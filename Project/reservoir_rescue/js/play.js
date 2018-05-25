// For enabling/disabling testing features
let testMode = false; 

// For enabling/disabling water drain
let disableDrain = true;

const SCALE = 4;
const MENU_X = 32 * SCALE;
const MENU_Y = 328 * SCALE;
const SPRINKLER_GID = 10;
const SINK_GID = 31;
const TOILET_GID = 32;
const SHOWER_GID = 33;
const WASHING_GID = 34;

/* Gameplay Config */

// The initial health
const HP = 1000;

// Rate at which water drains
const HP_RATE = 150;

// Minimum rate at which water drains
const HP_RATE_MIN = 40;

// Water drained for placing a new pipe
const PENALTY = 30;

// Rate at which water flows in frames per second
const FLOW_RATE = 3;

// Rate at which water flows upon winning
const WIN_FLOW_RATE = 30;

// Countdown before water starts flowing
const COUNTDOWN = 5;

// Delay before countdown starts from obstacle screen
const OBSTACLE_DELAY = 1200;

// Delay before countdown starts from restart
const RESTART_DELAY = 500;

// Delay before countdown starts from pause menu  
const PAUSE_DELAY = 500;

/* Obstacle Config */

// Litres per minute
const SPRINKLER_DAMAGE = 10; 

// Litres per minute
const SINK_DAMAGE = 5;

// Litres per cycle
const WASHING_DAMAGE = 40;

// Litres per minute
const SHOWER_DAMAGE = 12;

// Litres per flush
const TOILET_DAMAGE = 7;

/* Game Objects */

// Number keys for selecting pipeSelection
let key1, key2, key3, key4, key5, key6;

let map;
let layer1;
let layer2;
let testText;
let healthText;
let temperatureText;
let hpBar;
let hpBarCounter;
let hpCounter;
let boxSelector;
let selectionMenu;
let countdownTimer;
let countdownTimerText;
let countdownTimerEvent;
let totalScoreText;
let buttonsEnabled = false;

/* Groups */

// Game levels
let levels = ['level1', 'level2', 'level3', 'level4', 'level5'];

let currentLevelIndex = 0;

// Tracks which pipeSelection are in which selection spot
let boxedPipes = [];

// Array to keep track of all pipes on grid
let pipeArray = [];

// Array to keep track of all obstacles on grid
let obstacleArray = [];

let menuPipeArray = [];
let menuPipeGroup;
let obstacleGroup;

/* Global Variables */

// Rate water level goes down in milliseconds
let hpRate;

// Index of currently selected pipe
let pipeIndex = 0;

// Signals a pipe menu update when true (don't change!)
let pipeSwap = false;

// Pause Variable for turning off inputEnabled buttons
let inputEnabled = true;

// Ensures that player makes a selection before placing pipeSelection
let canPlace = false;

// Tracks currently selected pipe
let currentSelection;

// Tracks if a pipe has ever been placed.
var firstPipePlaced = false;

// Used when swapping pipeSelection to prevent a randomized pipe
let doNotRandomize = false;

// Holds the pipe that is getting swapped back to the selection menu
let pipeSwappedBack = null;

// Turn music on or off.
var musicEnabled = true;

lose = false;
let startPipe = null;
let health = HP;
let score = HP;
let hpBarRate;
let endFlow = false;
let waterFlow = false;
let waterFlowRate = FLOW_RATE;
let totalScore = 0;
let complete = false;

/* Signals */

let onWin = new Phaser.Signal();
let onLose = new Phaser.Signal();

let playState = {
  create: function () {
    initializeTilemap(levels[currentLevelIndex]);
    initializeMenu();

    // HP bar
    hpRate = HP_RATE - weather * 5;
    if (hpRate < HP_RATE_MIN) {
      hpRate = HP_RATE_MIN;
    }
    hpBar = game.add.sprite(128, GRID_SIZE * 1, 'hp_bar', 0);
    hpBar.scale.setTo(SCALE);
    hpBarRate = hpRate * HP / hpBar.animations.frameTotal;

    // Event handlers and signals
    onWin.add(winScreen, this);
    onLose.add(gameOver, this);

    // Timers
    countdownTimer = game.time.create();

    countdownTimerEvent = countdownTimer.add(Phaser.Timer.SECOND * COUNTDOWN, releaseWater, this);

    countdownTimerText = game.add.text(
      game.world.centerX, 80 * SCALE, '',
      { font: 'bold 70pt Helvetica', fill: 'red', align: 'center' });
    countdownTimerText.anchor.setTo(0.5);
    countdownTimerText.stroke = '#000000';
    countdownTimerText.strokeThickness = 7;

    // Pause Button
    this.pauseButton = game.add.sprite(160 * SCALE, 0, 'pause');
    this.pauseButton.scale.setTo(SCALE);
    this.pauseButton.inputEnabled = inputEnabled;
    this.pauseButton.events.onInputDown.add(function () {
      if (buttonsEnabled) {
        if (yMod === 0) {
          SFX_gameMusic.volume = 0.1;
          SFX_pauseButton.play();
        }
      }
    }, this);
    this.pauseButton.events.onInputDown.add(pauseMenu, this);

    // Mute Button
    this.muteButton = game.add.sprite(32 * SCALE, 16, 'muteButton');
    this.muteButton.scale.setTo(3);
    this.muteButton.inputEnabled = inputEnabled;
    this.muteButton.events.onInputDown.add(muteSounds, this);

    // Help Button
    this.helpButton = game.add.sprite(16, 16, 'helpButton');
    this.helpButton.scale.setTo(3);
    this.helpButton.anchor.setTo(0, 0);
    this.helpButton.inputEnabled = inputEnabled;
    this.helpButton.events.onInputDown.add(function() {
      if (buttonsEnabled) {
        helpScreen();
      }
    }, this);

    // Water Counter
    this.waterCounter = game.add.sprite(64 * SCALE, 0, 'water_counter');
    this.waterCounter.scale.setTo(SCALE);

    // Temperatue Counter
    this.tempCounter = game.add.sprite(128 * SCALE, 288 * SCALE, 'temp');
    this.tempCounter.scale.setTo(SCALE);

    /* Text */

    // Text styles
    let textStyle = { font: 'bold 45pt Helvetica', fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 850 };
    let scoreTextStyle = { font: 'bold 40pt Helvetica', fill: 'white' };

    // Total score
    totalScoreText = game.add.text(8 * SCALE, 9 * GRID_SIZE + (10 * SCALE), '', scoreTextStyle);
    totalScoreText.stroke = '#444444';
    totalScoreText.strokeThickness = 7;

    // Test text
    testText = game.add.text(0, 0, '', { fontSize: '32px', fill: '#FFF' });    

    // Health text
    healthText = game.add.text(115 * SCALE, 28, health, textStyle);
    healthText.stroke = '#444444';
    healthText.strokeThickness = 7;

    // Temperature text
    temperatureText = game.add.text(182 * SCALE, 297 * SCALE, weather, textStyle);
    temperatureText.stroke = '#4444444';
    temperatureText.strokeThickness = 7;

    obsScreen1.call(this);

    // Testing features
    if (testMode) {
      initializeTestControls();
    }
  },
  update: function () {
    if (pipeSwap === true) {
      reloadPipe();
    }

    if (health < 0) {
      health = 0;
    }

    if (health <= 0) {
      onLose.dispatch();
    }

    if (testMode) {
      testText.text = '('
        + parseInt(game.input.activePointer.x) + ','
        + parseInt(game.input.activePointer.y) + ')';
    }

    if (endFlow) {
      endFlow = false;
      onWin.dispatch();
    }

    this.pauseButton.inputEnabled = inputEnabled;
    this.helpButton.inputEnabled = inputEnabled;

    if (countdownTimer.running) {
      countdownTimerText.text = Math.round((countdownTimerEvent.delay - countdownTimer.ms) / 1000);
    } else {
      countdownTimerText.text = '';
    }

    totalScoreText.text = 'Score: ' + totalScore;
  }
};

function formatTime(s) {
  let minutes = '0' + Math.floor(s / 60);
  let seconds = '0' + (s - minutes * 60);
  return minutes.substr(-2) + ':' + seconds.substr(-2);
}

// Replaces pipe in current selection box with new random pipe
function reloadPipe() {
  pipeSwap = false;

  let newPipeIndex
  if (pipeSwappedBack != null) {
    for (let i = 0; i < pipeSelection.length; i++) {
      if (pipeSwappedBack && pipeSwappedBack.selectImage === pipeSelection[i].selectImage) {
        newPipeIndex = i;
        pipeSwappedBack = null;
      }
    }
  } else {
    newPipeIndex = Math.floor(Math.random() * 6);
    while (boxedPipes.includes(newPipeIndex)) {
      newPipeIndex = Math.floor(Math.random() * 6);
    }
  }

  let oldPipe = menuPipeArray[currentSelection];
  menuPipeArray[currentSelection] = game.add.sprite(oldPipe.x, oldPipe.y, pipeSelection[newPipeIndex].selectImage);
  addPipeToMenu(menuPipeArray[currentSelection], currentSelection);
  menuPipeArray[currentSelection].events.onInputDown.add(selectPipe,
    this, 0, newPipeIndex, currentSelection);
  oldPipe.destroy();

  menuPipeArray[currentSelection].animations.play('active', 15);

  //Updates array.
  boxedPipes[currentSelection] = newPipeIndex;
  pipeIndex = newPipeIndex;

  doNotRandomize = false;
}

// Selects a pipe from the menu
function selectPipe(pipe, pointer, index, currentIndex) {
  if (inputEnabled === true) {
    if (!pipe.active) {
      pipeIndex = index;
      currentSelection = currentIndex;

      SFX_selectPipe.play();
      selectionMenu.frame = currentSelection;

      for (let m of menuPipeArray) {
        m.animations.stop();
        m.frame = 0;
        m.active = false;
      }
      pipe.animations.play('active', 15);
      pipe.active = true;
    }
  }
}

// Restarts light flash
function restartLightflash() {
  // White Filter
  this.whiteFilter = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'whiteFilter');
  this.whiteFilter.anchor.setTo(0.5);
  this.whiteFilter.scale.setTo(4);
  this.whiteFilter.alpha = 1;

  whiteFilterTween = this.game.add.tween(this.whiteFilter);
  whiteFilterTween.to({ alpha: 0 }, 1000, Phaser.Easing.Cubic.Out, true);
}

// Calls functions based on position of active pointer
function delegate(pointer) {
  if (inputEnabled) {
    if (pointer.x >= GRID_X
      && pointer.x < GRID_X_BOUND
      && pointer.y >= GRID_Y
      && pointer.y < GRID_Y_BOUND) {
      placePipe();
    }
  } 
}

// Starts water level hpCounters
function startCounters() {
  if (!disableDrain) {
    hpCounter = game.time.events.loop(hpRate, function() {
      healthText.text = --health;
    }, this);
    hpBarCounter = game.time.events.loop(hpBarRate, function() {
      hpBar.frame += 1;
    }, this);
  }
}

function pauseCounters() {
  if (!disableDrain) {
    hpCounter.timer.pause();
    hpBarCounter.timer.pause();
  }
}

function resumeCounters() {
  if (!disableDrain) {
    hpCounter.timer.resume();
    hpBarCounter.timer.resume();
  }
}

// Syncs health bar with health variable
function syncHealthBar() {
  if (health <= 0) {
    hpBar.frame = hpBar.animations.frameTotal - 1;
  } else {
    let percentGone = (HP - health) / HP;
    let nextFrame = parseInt(hpBar.animations.frameTotal * percentGone);
    if (nextFrame >= 0 && nextFrame < hpBar.animations.frameTotal) {
      hpBar.frame = nextFrame;
    }
  }
}

// Stops gameplay and begins water flow animation
function levelComplete() {
  inputEnabled = false;
  complete = true;
  pauseObstacles();

  let currentFrame;
  if (waterFlow) {
    currentFrame = currentPipe.sprite.animations.frame;
    currentPipe.sprite.animations.stop();
  }
  
  pauseCounters();
  countdownTimer.stop();
  canPlace = false;

  SFX_gameMusic.pause();
  SFX_placePipe.stop();
  SFX_lastPipe.play();
  SFX_lastPipe.onStop.addOnce(function () {

    var drumrollPlaying = false;
    if (drumrollPlaying === false) {
      SFX_endFlow.play();
      // game.add.tween(this.SFX_endFlow).to({volume:0.7}, 5000).start();
      drumrollPlaying = true;
    }

    waterFlowRate = WIN_FLOW_RATE;
    
    if (!waterFlow) {
      let startingPipe = grid[startTile.row][startTile.col];
      startWaterFlow(startingPipe);
    } else {
      currentPipe.sprite.animations.play(animation, waterFlowRate); 
      currentPipe.sprite.animations.currentAnim.setFrame(currentFrame, false);    
    }
  });
}

// Stops gameplay and displays lose screen
function gameOver() {
  if (!lose) {
    lose = true;
    canPlace = false;
    
    if (currentPipe) {
      currentPipe.sprite.animations.stop();
    }
  
    togglePipeInput(false);
    pauseObstacles();
    pauseCounters();
    setHealth(0);

    SFX_loseSound.play();
    SFX_gameMusic.pause();

    loseScreen();
  }
}

/* Initialization */

// Sets the tilemap to the specified map
function initializeTilemap(mapName) {
  map = game.add.tilemap(mapName);
  map.addTilesetImage('tileset', 'tileset');
  layer1 = map.createLayer('Tile Layer 1');
  layer1.scale.set(SCALE);
  if (layer2 === undefined) {
    layer2 = map.createLayer('Tile Layer 2');
    layer2.scale.set(SCALE);
  }

  // Create obstacles from object layer of tilemap
  obstacleGroup = game.add.group();
  map.createFromObjects('Object Layer 1', SPRINKLER_GID, 'sprinkler', 0, true, false, obstacleGroup);
  map.createFromObjects('Object Layer 1', SINK_GID, 'sink', 0, true, false, obstacleGroup);
  map.createFromObjects('Object Layer 1', TOILET_GID, 'toilet', 0, true, false, obstacleGroup);
  map.createFromObjects('Object Layer 1', SHOWER_GID, 'shower', 0, true, false, obstacleGroup);
  map.createFromObjects('Object Layer 1', WASHING_GID, 'washing_machine', 0, true, false, obstacleGroup);
  obstacleGroup.forEach(function (o) {
    o.scale.set(SCALE);
    o.x *= SCALE;
    o.y *= SCALE;
    let col = parseInt((o.x - GRID_X) / GRID_SIZE);
    let row = parseInt((o.y - GRID_Y) / GRID_SIZE);
    let obstacle;
    switch (o.key) {
      case 'sprinkler':
        obstacle = new Obstacle(o.key, col, row, Math.round(SPRINKLER_DAMAGE + weather / 3), [0,1,2,3,4,5,6,7], 4, 1000);
        break;
      case 'washing_machine':
        obstacle = new Obstacle(o.key, col, row, Math.round(WASHING_DAMAGE + weather), 
          [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36], 12.3, 3000);
        break;
      case 'sink':
        obstacle = new Obstacle(o.key, col, row, Math.round(SINK_DAMAGE + weather / 4), [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17], 9, 1000);
        break;
      case 'shower':
        obstacle = new Obstacle(o.key, col, row, Math.round(SHOWER_DAMAGE + weather / 2), [1,2,3,4,5,6,7], 15, 1000);
        break;
      case 'toilet':
        obstacle = new Obstacle(o.key, col, row, Math.round(TOILET_DAMAGE + weather / 4), [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17], 9, 2000);
        break;
    }
    obstacle.sprite = o;
    obstacle.sprite.animations.add('active', obstacle.animationFrames, obstacle.animationSpeed, true);
    addObjectToGrid(obstacle, col, row);
    obstacleArray.push(obstacle);
  });
}

// Creates starting selection of random (but unique) pipeSelection
function initializeMenu() {
  selectionMenu = game.add.sprite(0, 10 * GRID_SIZE, 'selection_menu', 1);
  selectionMenu.scale.setTo(SCALE);

  let randomPipeIndex;

  let i = 0;
  while (menuPipeArray.length < 3) {
    randomPipeIndex = Math.floor(Math.random() * 6);

    if (!boxedPipes.includes(randomPipeIndex)) {
      let pipe = game.add.sprite(
        MENU_X + i * 56 * SCALE,
        MENU_Y,
        pipeSelection[randomPipeIndex].selectImage, 0);
      addPipeToMenu(pipe, i);
      boxedPipes.push(randomPipeIndex);
      i++;
    }
  }

  for (let i = 0; i < menuPipeArray.length; i++) {
    menuPipeArray[i].events.onInputDown.add(selectPipe,
      this, 0, boxedPipes[i], i);
  }

  pipeIndex = boxedPipes[1];
  currentSelection = 1;
  menuPipeArray[1].animations.play('active');
}

// Destroys the sprite
function destroySprite(sprite) {
  sprite.destroy();
}

// Removes object from specifed array
function removeObjectFromArray(object, array) {
  let index = array.indexOf(object);
  if (index !== -1) {
    array.splice(index, 1);
  }
}

function addPipeToMenu(pipe, index) {
  pipe.active = false;
  pipe.scale.setTo(SCALE);
  pipe.inputEnabled = true;
  pipe.animations.add('active', [0, 1, 2, 3, 4, 5, 6], 20);

  menuPipeArray[index] = pipe;
}

function releaseWater() {
  resetCountdown();
  
  let start = grid[startTile.row][startTile.col];
  if (start instanceof Pipe) {
    if (start.connectedToStart) {
      startWaterFlow(start);
      return;
    }
  }
  onLose.dispatch();
}

// Switches to the next level
function nextLevel() {
  countdownTimer.stop();

  // Update variables
  totalScore += health;

  // Prepare for next level
  clearGrid();
  layer1.destroy(); 
  
  complete = false;

  // Switch level
  ++currentLevelIndex;
  initializeTilemap(levels[currentLevelIndex]);  

  switch (currentLevelIndex) {
    case 1:
      obsScreen2();
      break;
    case 2:
      obsScreen3();
      break;
    case 3:
      obsScreen4();
      break;
    case 4:
      obsScreen5();
      break;
  }
}

// Clears grid of pipes and obstacles
function clearGrid() {
  clearPipes();
  clearObstacles();
} 

function resetLevel(delay) {
  inputEnabled = true;
  buttonsEnabled = false;
  lose = false;
  
  clearPipes();
  resumeCounters();
  resetHealth();
  resetCountdown();
  resetMenu();
  resetObstacles();
  initializePipes();  

  game.time.events.add(delay, startCountdown, this);
  game.input.onDown.add(delegate, this);
}

function resetHealth() {
  setHealth(HP);
}

function setHealth(amount) {
  health = amount;
  healthText.text = health;
  syncHealthBar();
}

function resetMenu() {
  for (let m of menuPipeArray) {
    m.animations.stop();
    m.frame = 0;
    m.active = false;
  }
  pipeIndex = boxedPipes[1];
  currentSelection = 1;
  menuPipeArray[1].animations.play('active');
  selectionMenu.frame = 1;
}

function resetCountdown() {
  countdownTimer.stop(false);
  countdownTimer = game.time.create();
  countdownTimerEvent = countdownTimer.add(Phaser.Timer.SECOND * COUNTDOWN, releaseWater, this);
}

function startCountdown() {
  canPlace = true;
  countdownTimer.start();
  buttonsEnabled = true;
}

function pauseGame() {
  countdownRunningMs = countdownTimer.ms;
  countdownTimer.pause();

  pauseObstacles();
  pauseCounters();
  togglePipeInput(false);

  if (currentPipe instanceof Pipe) {
    currentPipe.sprite.animations.stop();
    currentPipe.currentFrame = currentPipe.sprite.animations.frame;
  }
}

function resumeGame() {
  countdownTimer.resume();

  resumeObstacles();  
  resumeCounters();
  togglePipeInput(true);
  canPlace = true;

  if (currentPipe instanceof Pipe) {
    currentPipe.sprite.animations.play(animation, waterFlowRate);
    currentPipe.sprite.animations.currentAnim.setFrame(currentPipe.currentFrame, false);  
  }

  game.input.onDown.add(delegate, this, 0);
}