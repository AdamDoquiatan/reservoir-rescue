const SCALE = 4;
const MENU_X = 0;
const MENU_Y = 11;
const SPRINKLER_GID = 10;
const SINK_GID = 31;
const TOILET_GID = 32;
const SHOWER_GID = 33;
const WASHING_GID = 34;
const HP_RATE = 500;
const HP_RATE_MIN = 50;

// The initial health
const HP = 440;

// Rate at which water flows in frames per second
const FLOW_RATE = 20;

// Delay before water level starts decreasing
const DELAY = 500;

// For enabling/disabling testing features
let testMode = true; 

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

/* Groups */

// Tracks which pipeSelection are in which selection spot
let boxedPipes = [];

// Array to keep track of all pipes on grid
let pipeArray = [];

// Array to keep track of all obstacles on grid
let obstacleArray = [];

let pipeGroup;
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

// Used when swapping pipeSelection to prevent a randomized pipe
let doNotRandomize = false;

// Holds the pipe that is getting swapped back to the selection menu
let pipeSwappedBack = null;

// Turn music on or off.
var musicEnabled = true; 

lose = false;
let startPipe = null;
let endPipe = null;
let health = HP;
let score = HP;
let hpBarRate;

/* Signals */

let onWin = new Phaser.Signal();
let onLose = new Phaser.Signal();

let playState = {
  create: function () {
    initializeTilemap('map');
    initializeMenu();

    // HP bar
    hpRate = HP_RATE - weather * 4;
    if (hpRate < HP_RATE_MIN) {
      hpRate = hpRate;
    }
    console.log(hpRate);
    hpBar = game.add.sprite(128, GRID_SIZE * 1, 'hp_bar', 0);
    hpBar.scale.setTo(SCALE);
    hpBarRate = hpRate * HP / hpBar.animations.frameTotal;

    // Event handlers and signals
    game.input.onDown.add(delegate, this, 0);
    onWin.add(levelComplete, this);
    onLose.add(gameOver, this);

    // Menu Button
    this.menuButton = game.add.sprite(0, 0, 'menu_button');
    this.menuButton.scale.setTo(SCALE);

    // Pause Button
    this.pauseButton = game.add.sprite(160 * SCALE, 0, 'pause');
    this.pauseButton.scale.setTo(SCALE);
    this.pauseButton.inputEnabled = inputEnabled;
    this.pauseButton.events.onInputDown.add(function (){
      if (yMod  === 0) {
      SFX_gameMusic.volume = 0.1;
      SFX_pauseButton.play();
      }
    }, this);
    this.pauseButton.events.onInputDown.add(pauseMenu, this);

    // Mute Button
    this.muteButton = game.add.sprite(game.width, 130, 'muteButton');
    this.muteButton.scale.setTo(1.5);
    this.muteButton.anchor.setTo(1, 0);
    this.muteButton.inputEnabled = inputEnabled;
    this.muteButton.events.onInputDown.add(muteSounds, this);

    // Help Button
    this.helpButton = game.add.sprite(0, 115, 'helpButton');
    this.helpButton.scale.setTo(2);
    this.helpButton.anchor.setTo(0, 0);
    this.helpButton.inputEnabled = inputEnabled;
    this.helpButton.events.onInputDown.add(helpScreen, this);    

    // Water Counter
    this.waterCounter = game.add.sprite(64 * SCALE, 0, 'water_counter');
    this.waterCounter.scale.setTo(SCALE);

    // Temperatue Counter
    this.tempCounter = game.add.sprite(128 * SCALE, 288 * SCALE, 'temp');
    this.tempCounter.scale.setTo(SCALE);

    // Text
    testText = game.add.text(0, 0, '', { fontSize: '32px', fill: '#FFF' });
    let textStyle = { font: 'bold 45pt Helvetica', fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 850 };
    healthText = game.add.text(121 * SCALE, 28, health, textStyle);
    healthText.stroke = '#444444';
    healthText.strokeThickness = 7;
    temperatureText = game.add.text(182 * SCALE, 297 * SCALE, weather, textStyle);
    temperatureText.stroke = '#4444444';
    temperatureText.strokeThickness = 7;

    obsScreen1.call(this);

    // Testing features
    if (testMode) {
      // For testing: Win Button
      this.winButton = game.add.sprite(game.width - 450, 0, 'winButton');
      this.winButton.scale.setTo(2.6);
      this.winButton.anchor.setTo(1, 0);
      this.winButton.inputEnabled = inputEnabled;
      this.winButton.events.onInputDown.add(winScreen, this);
      
      // For testing: Lose Button
      this.loseButton = game.add.sprite(game.width - 190, 0, 'loseButton');
      this.loseButton.scale.setTo(2.3);
      this.loseButton.anchor.setTo(1, 0);
      this.loseButton.inputEnabled = inputEnabled;
      this.loseButton.events.onInputDown.add(gameOver, this);

      initializeTestControls();
    }
  },
  update: function () {
    if (pipeSwap === true) {
      reloadPipe(pipeGroup);
    }

    if (health === 0 && !lose) {
      lose = true;
      onLose.dispatch();
    }

    if (testMode) {
      testText.text = '('
      + parseInt(game.input.activePointer.x) + ','
      + parseInt(game.input.activePointer.y) + ')';
    }

    this.pauseButton.inputEnabled = inputEnabled;
    this.helpButton.inputEnabled = inputEnabled;
  }
};

// Replaces pipe in current selection box with new random pipe
function reloadPipe(menuPipes) {
  var randomPipeIndex = Math.floor(Math.random() * 6);
  var swapBackPipeIndex = 0;
      
  // Variables for holding current pipeSelection
  var index0;
  var index1;
  var index2;
  
  if (pipeSwappedBack != null) {
  for (let i = 0; i < pipeSelection.length; i++) {
      if (pipeSelection[i].image === pipeSwappedBack.image) {
          swapBackPipeIndex = i;
      }
  }
  }
    
  // Moves each pipe to a variable.
  // If pipe was used, creates and stores new pipe instead.
  for (let i = 0; i < 3; i++) {
    switch (i) {
      case 0:
        if (i !== currentSelection) {
          index0 = menuPipes.children[i];
        } else if (doNotRandomize) {
          index0 = game.add.sprite(
            currentSelection * 2 * GRID_SIZE + (GRID_SIZE) + MENU_X, 
            MENU_Y * GRID_SIZE - (GRID_SIZE / 2), 
            pipeSelection[swapBackPipeIndex].image, 0);
          index0.inputEnabled = true;
          index0.scale.setTo(SCALE, SCALE);
          index0.events.onInputDown.add(selectPipe,
          this, 0, swapBackPipeIndex, i);
        }
        else {
          index0 = game.add.sprite(
            currentSelection * 2 * GRID_SIZE + (GRID_SIZE) + MENU_X, 
            MENU_Y * GRID_SIZE - (GRID_SIZE / 2), 
            pipeSelection[randomPipeIndex].image, 0);
          index0.inputEnabled = true;
          index0.scale.setTo(SCALE, SCALE);
          index0.events.onInputDown.add(selectPipe,
            this, 0, randomPipeIndex, i);
        }
        break;
      case 1:
        if (i !== currentSelection) {
          index1 = menuPipes.children[i];
        } else if (doNotRandomize) {
          index1 = game.add.sprite(currentSelection * 2 * GRID_SIZE + (GRID_SIZE) + MENU_X, MENU_Y * GRID_SIZE - (GRID_SIZE / 2), pipeSelection[swapBackPipeIndex].image, 0);
          index1.inputEnabled = true;
          index1.scale.setTo(SCALE, SCALE);
          index1.events.onInputDown.add(selectPipe,
            this, 0, swapBackPipeIndex, i);
        }
          else {
          index1 = game.add.sprite(currentSelection * 2 * GRID_SIZE + (GRID_SIZE) + MENU_X, MENU_Y * GRID_SIZE - (GRID_SIZE / 2), pipeSelection[randomPipeIndex].image, 0);
          index1.inputEnabled = true;
          index1.scale.setTo(SCALE, SCALE);
          index1.events.onInputDown.add(selectPipe,
            this, 0, randomPipeIndex, i);
        }
        break;
      case 2:
        if (i !== currentSelection) {
          index2 = menuPipes.children[i];
        } else if (doNotRandomize) {
          index2 = game.add.sprite(
          currentSelection * 2 * GRID_SIZE + (GRID_SIZE) + MENU_X,
          MENU_Y * GRID_SIZE - (GRID_SIZE / 2), pipeSelection[swapBackPipeIndex].image, 0);
          index2.inputEnabled = true;
          index2.scale.setTo(SCALE, SCALE);
          index2.events.onInputDown.add(selectPipe,
            this, 0, swapBackPipeIndex, i);  
        }
          else {
          index2 = game.add.sprite(
          currentSelection * 2 * GRID_SIZE + (GRID_SIZE) + MENU_X,
          MENU_Y * GRID_SIZE - (GRID_SIZE / 2), pipeSelection[randomPipeIndex].image, 0);
          index2.inputEnabled = true;
          index2.scale.setTo(SCALE, SCALE);
          index2.events.onInputDown.add(selectPipe,
            this, 0, randomPipeIndex, i);
        }
        break;
      default:
        console.log("default");
    }
  }

  // Clears and repopulates menu group.
  menuPipes.removeAll();
  menuPipes.add(index0);
  menuPipes.add(index1);
  menuPipes.add(index2);
  
  // Auto changes pipe index to new pipe in selected spot.
  pipeIndex = randomPipeIndex;
    
  if (doNotRandomize) {
      pipeIndex = swapBackPipeIndex;
  }

  //Updates array.
  boxedPipes[currentSelection] = pipeIndex;
  
  doNotRandomize = false;
  // Signals pipe swap complete.
  pipeSwap = false;
}

// Selects a pipe from the menu
function selectPipe(pipe, pointer, index, currentIndex) {
  if (inputEnabled === true) {
    currentSelection = currentIndex;
    pipeIndex = index;
    boxCreator(pointer);
    canPlace = true;
    SFX_selectPipe.play();
  }
}

// Creates a box around player's selected pipe
function boxCreator(selector) {
  if (boxSelector != null) {
    boxSelector.destroy();
  }

  boxSelector = game.add.sprite(
    currentSelection * 2 * GRID_SIZE + (GRID_SIZE) + MENU_X, 
    MENU_Y * GRID_SIZE - (GRID_SIZE / 2), 'boxSelector', 0);
    boxSelector.scale.setTo(SCALE + 1.8, SCALE + 1.8);
    boxSelector.x += -60;
    boxSelector.y += -60;
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
  if (pointer.x >= GRID_X
    && pointer.x < GRID_X_BOUND
    && pointer.y >= GRID_Y
    && pointer.y < GRID_Y_BOUND) {
    placePipe();
  }
}

// Starts water level hpCounter
function startCounter() {
  hpCounter = game.time.events.loop(hpRate, function() {
    healthText.text = --health;
  }, this);
  hpBarCounter = game.time.events.loop(hpBarRate, function() {
    hpBar.frame += 1;
  }, this);
}

// Syncs health bar with health variable
function setHealthBar(health) {
  let percentGone = (HP - health) / HP;
  let nextFrame = parseInt(hpBar.animations.frameTotal * percentGone) - 1;
  if (nextFrame >= 0 && nextFrame < hpBar.animations.frameTotal) {
    hpBar.frame = nextFrame;
  }
}

// Stops gameplay and begins water flow animation
function levelComplete() {
  hpCounter.timer.pause();
  hpBarCounter.timer.pause();

  SFX_gameMusic.pause();
  SFX_placePipe.stop();
  SFX_lastPipe.play();
  SFX_lastPipe.onStop.add(function (){
  
    var drumrollPlaying = false;
    if (drumrollPlaying === false) {
      SFX_endFlow.play();
      game.add.tween(this.SFX_endFlow).to({volume:0.7}, 5000).start();
      drumrollPlaying = true;
    }

    canPlace = false;
    let startingPipe = grid[startTile.row][startTile.col];
    startWaterFlow(startingPipe);
  });
}

// Stops gameplay and displays lose screen
function gameOver() {
  hpCounter.timer.pause();
  hpBarCounter.timer.pause();
  hpBar.frame = hpBar.animations.frameTotal - 1;
  canPlace = false;
  SFX_loseSound.play();
  SFX_gameMusic.pause();
  loseScreen();
}

/* Initialization */

// Sets the tilemap to the specified map
function initializeTilemap(mapName) {
  map = game.add.tilemap(mapName);
  map.addTilesetImage('tileset', 'tileset');
  layer1 = map.createLayer('Tile Layer 1');
  layer1.scale.set(SCALE);
  layer2 = map.createLayer('Tile Layer 2');
  layer2.scale.set(SCALE);

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
        obstacle = new Obstacle(o.key, col, row, 20, [0,1,2,3,4,5,6,7], 5);
        break;
      case 'washing_machine':
        obstacle = new Obstacle(o.key, col, row, 30, 
          [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36], 20);
        break;
      case 'sink':
        obstacle = new Obstacle(o.key, col, row, 40, [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17], 5);
        break;
      case 'shower':
        obstacle = new Obstacle(o.key, col, row, 50, [1,2,3,4,5,6,7], 10);
        break;
      case 'toilet':
        obstacle = new Obstacle(o.key, col, row, 50, [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17], 5);
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
  selectionMenu = 

  pipeGroup = game.add.group();

  for (let i = 0; pipeGroup.length < 3;) {
    var randomPipeIndex = Math.floor(Math.random() * 6);
    if (!boxedPipes.includes(randomPipeIndex)) {
      let pipe = game.add.sprite(
        i * 2 * GRID_SIZE + (GRID_SIZE) + MENU_X,
        MENU_Y * GRID_SIZE - (GRID_SIZE / 2),
        pipeSelection[randomPipeIndex].image, 0);
      pipe.scale.setTo(SCALE, SCALE);
      pipeGroup.add(pipe);
      boxedPipes.push(randomPipeIndex);
      i++;
    }

    for (let i = 0; i < pipeGroup.children.length; i++) {
      pipeGroup.children[i].inputEnabled = true;
      pipeGroup
        .children[i].events.onInputDown.add(selectPipe,
        this, 0, randomPipeIndex, i);
    }
  }
}

// Destroys the sprite
function destroySprite (sprite) {
    sprite.destroy();
}

// Removes object from specifed array
function removeObjectFromArray(object, array) {
  let index = array.indexOf(object);
  if (index !== -1) {
    array.splice(index, 1);
  }
}
