const SCALE = 4;
const MENU_X = 0;
const MENU_Y = 11;
const HP = 100;
const HP_RATE = 250;
const FLOW_RATE = 20;
const DELAY = 500;

// For enabling/disabling testing features
let testMode = true;

/* Game Objects */

// Number keys for selecting pipes
let key1, key2, key3, key4, key5, key6;

let map;
let layer1;
let layer2;
let winText;
let testText;
let healthText;
let hpBar;
let hpBarCounter;
let hpCounter;
let boxSelector;

/* Groups */

// Tracks which pipes are in which selection spot
let boxedPipes = [];

// Array to keep track of all obstacles on grid
let obstacles = [];

let pipeGroup;
let obstacleGroup;

/* Global Variables */

// Index of currently selected pipe
let pipeIndex = 0;

// Signals a pipe menu update when true (don't change!)
let pipeSwap = false;

// Pause Variable for turning off inputEnabled buttons
let input_Enabled = true;

// Ensures that player makes a selection before placing pipes
let canPlace = false;

// Tracks currently selected pipe
let currentSelection;

let win = false;
let lose = false;
let startConnected = false;
let endConnected = false;
let health = HP;
let score = HP;
let hpBarRate;

/* Signals */

let onWin = new Phaser.Signal();
let onLose = new Phaser.Signal();

let playState = {
  create: function () {
    // Initialize tilemap
    map = game.add.tilemap('map');
    map.addTilesetImage('tileset', 'tileset');
    layer1 = map.createLayer('Tile Layer 1');
    layer1.scale.set(SCALE);
    layer2 = map.createLayer('Tile Layer 2');
    layer2.scale.set(SCALE);

    // Create obstacles from object layer of tilemap
    obstacleGroup = game.add.group();
    map.createFromObjects('Object Layer 1', 14, 'sprinkler', 0, true, false, obstacleGroup);
    obstacleGroup.forEach(function (o) {
      o.scale.set(SCALE);
      o.x *= SCALE;
      o.y *= SCALE;
      let col = parseInt((o.x - GRID_X) / GRID_SIZE);
      let row = parseInt((o.y - GRID_Y) / GRID_SIZE);
      let obstacle = new Obstacle(o.key, col, row);
      obstacle.sprite = o;
      addObjectToGrid(obstacle, col, row);
      obstacles.push(obstacle);
    });

    // HP bar
    hpBar = game.add.sprite(0, GRID_SIZE * 1, 'hp_bar', 0);
    hpBar.scale.setTo(SCALE);
    hpBarRate = HP_RATE * HP / hpBar.animations.frameTotal;

    // Initialize pipe selection menu
    initializeMenu();

    // Text
    testText = game.add.text(0, 0, '', { fontSize: '32px', fill: '#FFF' });
    healthText = game.add.text(0, 32, health, { fontSize: '32px', fill: '#FFF' });

    // Event handlers and signals
    game.input.onDown.add(delegate, this, 0);
    onWin.add(levelComplete, this);
    onLose.add(gameOver, this);

    // Pause Button
    this.pauseButton = this.game.add.sprite(game.width, 0, 'pause');
    this.pauseButton.scale.setTo(2.3);
    this.pauseButton.anchor.setTo(1, 0);
    this.pauseButton.inputEnabled = input_Enabled;
    this.pauseButton.events.onInputDown.add(this.pauseMenu, this);

    // For testing: Win Button
    this.winButton = this.game.add.sprite(game.width - 450, 0, 'winButton');
    this.winButton.scale.setTo(2.6);
    this.winButton.anchor.setTo(1, 0);
    this.winButton.inputEnabled = input_Enabled;
    this.winButton.events.onInputDown.add(levelComplete, this);

    // For testing: Lose Button
    this.loseButton = this.game.add.sprite(game.width - 190, 0, 'loseButton');
    this.loseButton.scale.setTo(2.3);
    this.loseButton.anchor.setTo(1, 0);
    this.loseButton.inputEnabled = input_Enabled;
    this.loseButton.events.onInputDown.add(gameOver, this);

    // For testing: turn the obstacle screen on or off
    let playObsScreen = true;
    if (playObsScreen === true) {
      this.obsScreen1();
    }

    if (testMode) {
      initializeTestControls();
    }
  },
  update: function () {
    if (pipeSwap === true) {
      reloadPipe(pipeGroup);
    }

    if (health === 0 && !lose) {
      onLose.dispatch();
    }

    testText.text = '('
      + parseInt(game.input.activePointer.x) + ','
      + parseInt(game.input.activePointer.y) + ')';
  },
  pauseMenu: function (sprite, event) {
    if (input_Enabled === true) {
      // Turns off input to everything but pause screen
      input_Enabled = false;
      sprite.input.enabled = false;
      game.input.onDown.removeAll();

      // Dark filter
      var darkFilter = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'darkFilter');
      darkFilter.anchor.setTo(0.5);
      darkFilter.scale.setTo(4);

      // Group for screen componenets
      var pauseScreen = this.game.add.group();

      // Big pause header
      this.pauseHeader = game.add.text(this.game.world.centerX, 200, "PAUSED", {
        font: 'bold 100pt Helvetica',
        fill: 'white',
        align: 'center',
        wordWrap: true,
        wordWrapWidth: 700
      });
      this.pauseHeader.anchor.setTo(0.5);
      this.pauseHeader.stroke = '#000000';
      this.pauseHeader.strokeThickness = 7;
      pauseScreen.add(this.pauseHeader);

      // Specifies text properties
      var textStyle = {font: 'bold 40pt Helvetica', fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 850};

      // Tip text
      this.tipDisplay = game.add.text(this.game.world.centerX, 650,
        "RACCOON TIP:\n" + this.randomTip(this.tipDisplay, this), textStyle);
      this.tipDisplay.anchor.setTo(0.5);
      this.tipDisplay.lineSpacing = -2;
      this.tipDisplay.addColor('#3d87ff', 0);
      this.tipDisplay.addColor('white', 12);
      this.tipDisplay.stroke = '#000000';
      this.tipDisplay.strokeThickness = 7;
      pauseScreen.add(this.tipDisplay);

      // Continue button
      this.contButton = pauseScreen.create(this.game.world.centerX, 1050, 'continueButton');
      this.contButton.anchor.setTo(0.5);
      this.contButton.scale.setTo(2.3);
      this.contButton.inputEnabled = true;
      this.contButton.events.onInputDown.add(function () {
        input_Enabled = true;
        sprite.input.enabled = true;
        game.input.onDown.add(delegate, this, 0);
        pauseScreen.destroy();
        darkFilter.destroy();
      });

      // Restart button
      this.restartButton = pauseScreen.create(this.game.world.centerX, 1200, 'restart');
      this.restartButton.anchor.setTo(0.5);
      this.restartButton.scale.setTo(2.3);
      this.restartButton.inputEnabled = true;
      this.restartButton.events.onInputDown.add(function () {
        window.location.replace('/reservoir-rescue/Project/reservoir_rescue/game.html');
      });

      // Menu button
      this.menuButton = pauseScreen.create(this.game.world.centerX, 1350, 'menuButton');
      this.menuButton.anchor.setTo(0.5);
      this.menuButton.scale.setTo(2.3);
      this.menuButton.inputEnabled = true;
      this.menuButton.events.onInputDown.add(function () {
        window.location.replace('/reservoir-rescue/Project/reservoir_rescue');
      });
    }
  },
  obsScreen1: function (sprite, event) {
    // Prevents input to anything but obs screen
    input_Enabled = false;
    this.pauseButton.input.enabled = false;
    game.input.onDown.removeAll();

    // Dark Filter
    this.darkFilter = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'darkFilter');
    this.darkFilter.anchor.setTo(0.5);
    this.darkFilter.scale.setTo(4);
    this.darkFilter.alpha = 1;

    // Group for screen componenets
    var obsScreen = this.game.add.group();

    // Screen BG
    this.obsBG = obsScreen.create(this.game.world.centerX, -300, 'obs_screen');
    this.obsBG.anchor.setTo(0.5);
    this.obsBG.scale.setTo(3.1, 6.8);

    // Picture of a sprinkler
    this.obsSprink = obsScreen.create(this.game.world.centerX, -600, 'obs_screen_sprink');
    this.obsSprink.anchor.setTo(0.5);
    this.obsSprink.scale.setTo(0.284, 0.28);

    // "Look out!" header
    this.lookOutHeader = game.add.text(this.game.world.centerX, -260, "LOOK OUT!", { font: 'bold 70pt Helvetica', fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 700 });
    this.lookOutHeader.anchor.setTo(0.5);
    this.lookOutHeader.stroke = '#000000';
    this.lookOutHeader.strokeThickness = 5;
    obsScreen.add(this.lookOutHeader);

    // Obstacle text
    this.obsTextSprink = game.add.text(this.game.world.centerX, -110, "Sprinklers waste 16 litres of water per minute!", { font: 'bold 42pt Helvetica', fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 700 });
    this.obsTextSprink.addColor('#2de276', 17);
    this.obsTextSprink.addColor('white', 26);
    this.obsTextSprink.anchor.setTo(0.5);
    this.obsTextSprink.stroke = '#000000';
    this.obsTextSprink.strokeThickness = 5;
    obsScreen.add(this.obsTextSprink);

    // Obstacle text bottom line
    this.obsTextSprinkBLine = game.add.text(this.game.world.centerX, 62, "Better keep our pipes clear!", { font: 'bold 42pt Helvetica', fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 700 });
    this.obsTextSprinkBLine.anchor.setTo(0.5);
    this.obsTextSprinkBLine.stroke = '#000000';
    this.obsTextSprinkBLine.strokeThickness = 5;
    obsScreen.add(this.obsTextSprinkBLine);

    // Continue button
    this.contButton = obsScreen.create(this.game.world.centerX, 207, 'continueButton');
    this.contButton.anchor.setTo(0.5);
    this.contButton.scale.setTo(2.3);
    this.contButton.inputEnabled = true;
    this.contButton.events.onInputDown.add(endObsScreen, this);

    // Opening screen animation. Auto-plays when game starts
    obsScreen.forEach(function (element) {
      var elementTween = this.game.add.tween(element);
      elementTween.to({ y: element.position.y + 1000 }, 700, Phaser.Easing.Elastic.Out, true);
      elementTween.start();
    });

    // Exits screen. Plays when continue button is pressed
    function endObsScreen(sprite, event) {

      darkFilterTween = this.game.add.tween(this.darkFilter);
      darkFilterTween.to({ alpha: 0 }, 1200, Phaser.Easing.Cubic.Out, true);

      obsScreen.forEach(function (element) {
        var elementTween = this.game.add.tween(element);
        elementTween.to({ y: element.position.y - 640 }, 700, Phaser.Easing.Back.In, true);
        elementTween.start();
        elementTween.onComplete.add(function () {
          obsScreen.destroy();
        });

      });
      input_Enabled = true;
      this.pauseButton.input.enabled = true;
      game.input.onDown.add(delegate, this, 0);

      game.time.events.add(DELAY, startCounter, this);
    }
  },
  randomTip: function (sprite, event) {
    var tip = Math.floor(Math.random() * 8);

    switch (tip) {
      case 0:
        return "Did you know water gushes from the average faucet at 9.4 litres per second? " +
          "That\u0027s a lot of H2O swirling down your drain, there. While you\u0027re brushing " +
          "your teeth with one hand, try turning off the faucet with the other. Save some of that " +
          "good stuff for the rest of us!";
      case 1:
        return "What\u0027s that dripping? Why it\u0027s the sound of 19 litres of water being " +
          "wasted every day because somebody didn\u0027t fix a leaky faucet (not pointing any fingers). " +
          "Seriously, people! Fix it yourself or hire a plumber. A racoon plumber!";
      case 2:
        return "You know what plants crave? Exactly! That water you just cooked your pasta in; save it, " +
          "let it cool, and water your plants with it. Just, uh, make sure it\u0027s cooled off first. " +
          "Like, cold. Otherwise, you can say goodbye to your begonias.";
      case 3:
        return "How long does it take to have a shower? I mean, what are you people doing in there!? " +
          "Showers use up 15-19 litres of water per minute, so maybe do your daydreaming somewhere else.";
      case 4:
        return "Did you know that most lawns are overwatered? People are dumping as much as " +
          "340 litres per square foot per year on that thankless green patch in front of their houses. " +
          "Just let it go brown! I mean what did that grass ever do for you?";
      case 5:
        return "You know what uses a lot of water? Power plants and hydro-electric dams! " +
          "If you want to save water on the sly, using less electricity might just be the way to do it.";
      case 6:
        return "It takes a whole lot of water to rear animals for meat, so maybe lay off the beef a little. " +
          "The environment will thank you. The cows will thank you too!";
      case 7:
        return "Ah, the common sprinkler. Beneath its innocent promise of green lawns and summer fun " +
          "lies a dark truth: These things can toss out up to 16 liters/minute!";
      default:
        return "It takes a whole lot of water to rear animals for meat, so maybe lay off the beef a little. " +
          "The environment will thank you. The cows will thank you too!";
    }
  },
};

// Displays win screen
function winScreen() {
  // Turns off input to everything but win screen
  input_Enabled = false;
  game.input.onDown.removeAll();

  // Dark Filter Fades In
  this.darkFilter = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'darkFilter');
  this.darkFilter.anchor.setTo(0.5);
  this.darkFilter.scale.setTo(4);
  this.darkFilter.alpha = 0;

  // Group for screen components
  var winScreen = this.game.add.group();

  // Big win header
  this.winHeader = game.add.text(this.game.world.centerX, 400, "VICTORY", {
    font: 'bold 140pt Helvetica',
    fill: 'white',
    align: 'center',
    wordWrap: true,
    wordWrapWidth: 700
  });
  this.winHeader.anchor.setTo(0.5);
  this.winHeader.stroke = '#000000';
  this.winHeader.strokeThickness = 10;
  this.winHeader.alpha = 0;

  // Specifies text properties
  var textStyle = { font: 'bold 60pt Helvetica', fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 850 };

  // Water-Saved text
  this.waterSavedDisplay = game.add.text(50 + 400, 650, "You saved: " + health + " litres!", textStyle);
  this.waterSavedDisplay.lineSpacing = -2;
  this.waterSavedDisplay.addColor('#3d87ff', 11);
  this.waterSavedDisplay.addColor('white', 21);
  this.waterSavedDisplay.stroke = '#000000';
  this.waterSavedDisplay.strokeThickness = 7;
  winScreen.add(this.waterSavedDisplay);

  // Score text
  this.scoreDisplay = game.add.text(game.world.centerX + 600, 850, "Score: " + health, textStyle);
  this.scoreDisplay.anchor.setTo(0.5);
  this.scoreDisplay.lineSpacing = -2;
  this.scoreDisplay.addColor('#3d87ff', 7);
  this.scoreDisplay.addColor('white', 10);
  this.scoreDisplay.stroke = '#000000';
  this.scoreDisplay.strokeThickness = 7;
  winScreen.add(this.scoreDisplay);

  // Continue (to next level) button -- doesn't do anything yet
  this.contButton = winScreen.create(this.game.world.centerX + 800, 1050, 'continueButton');
  this.contButton.anchor.setTo(0.5);
  this.contButton.scale.setTo(2.3);

  // Restart button
  this.restartButton = winScreen.create(this.game.world.centerX + 1000, 1200, 'restart');
  this.restartButton.anchor.setTo(0.5);
  this.restartButton.scale.setTo(2.3);
  this.restartButton.inputEnabled = true;
  this.restartButton.events.onInputDown.add(function () {
    window.location.replace('/reservoir-rescue/Project/reservoir_rescue/game.html');
  })

  // Text and Button Tweens
  darkFilterTween = this.game.add.tween(this.darkFilter);
  darkFilterTween.to({ alpha: 1 }, 1500, Phaser.Easing.Cubic.Out, true);

  victoryTween = this.game.add.tween(this.winHeader);
  victoryTween.to({ alpha: 1 }, 1300, Phaser.Easing.Cubic.Out, true);

  var xMovement = 400;
  winScreen.forEach(function (element) {
    var elementTween = this.game.add.tween(element);
    elementTween.to({ x: element.position.x - xMovement }, 1000, Phaser.Easing.Cubic.Out, true);
    elementTween.start();
    xMovement += 200;
  })
}

// Displays lose screen
function loseScreen() {
  // Turns off input to everything but lose screen
  input_Enabled = false;
  game.input.onDown.removeAll();

  // Dark Filter
  this.darkFilter = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'darkFilter');
  this.darkFilter.anchor.setTo(0.5);
  this.darkFilter.scale.setTo(4);
  this.darkFilter.alpha = 1;

  // Group for screen components
  var loseScreen = this.game.add.group();

  // Big lose header
  this.loseHeader = game.add.text(this.game.world.centerX, 400, "DEFEAT", {
    font: 'bold 140pt Helvetica',
    fill: 'white',
    align: 'center',
    wordWrap: true,
    wordWrapWidth: 700
  });
  this.loseHeader.anchor.setTo(0.5);
  this.loseHeader.stroke = '#000000';
  this.loseHeader.strokeThickness = 10;
  this.loseHeader.alpha = 0;

  // Specifies text properties
  var textStyle = { font: 'bold 70pt Helvetica', fill: 'red', align: 'center', wordWrap: true, wordWrapWidth: 550 };

  // Water-Saved text
  this.sadText = game.add.text(game.world.centerX, 730, "The water!! NOOOOOOOOO", textStyle);
  this.sadText.lineSpacing = -7;
  this.sadText.anchor.setTo(0.5);
  this.sadText.stroke = '#000000';
  this.sadText.strokeThickness = 7;
  loseScreen.add(this.sadText);

  // Menu Button
  this.menuButton = loseScreen.create(this.game.world.centerX, 1050, 'menuButton');
  this.menuButton.anchor.setTo(0.5);
  this.menuButton.scale.setTo(2.3);
  this.menuButton.inputEnabled = true;
  this.menuButton.events.onInputDown.add(function () {
    window.location.replace('/reservoir-rescue/Project/reservoir_rescue');
  })
  /*
  this.contButton.inputEnabled = true;
  this.contButton.events.onInputDown.add(function () {
    input_Enabled = true;
    sprite.input.enabled = tmenu
    game.input.onDown.add(delegate, this, 0);
    loseScreen.destroy();
  });
  */

  // Restart button
  this.restartButton = loseScreen.create(this.game.world.centerX, 1200, 'restart');
  this.restartButton.anchor.setTo(0.5);
  this.restartButton.scale.setTo(2.3);
  this.restartButton.inputEnabled = true;
  this.restartButton.events.onInputDown.add(function () {
    window.location.replace('/reservoir-rescue/Project/reservoir_rescue/game.html');
  })

  // White Filter
  this.whiteFilter = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'whiteFilter');
  this.whiteFilter.anchor.setTo(0.5);
  this.whiteFilter.scale.setTo(4);
  this.whiteFilter.alpha = 1;

  // Text and Filter Tweens
  whiteFilterTween = this.game.add.tween(this.whiteFilter);
  whiteFilterTween.to({ alpha: 0 }, 4500, Phaser.Easing.Cubic.Out, true);

  victoryTween = this.game.add.tween(this.loseHeader);
  victoryTween.to({ alpha: 1 }, 1300, Phaser.Easing.Cubic.Out, true);
}

// Replaces pipe in current selection box with new random pipe
function reloadPipe(menuPipes) {
  var randomPipeIndex = Math.floor(Math.random() * 6);

  // Variables for holding current pipes
  var index0;
  var index1;
  var index2;

  // Moves each pipe to a variable.
  // If pipe was used, creates and stores new pipe instead.
  for (i = 0; i < 3; i++) {
    switch (i) {
      case 0:
        if (i !== currentSelection) {
          index0 = menuPipes.children[i];
        } else {
          index0 = game.add.sprite(currentSelection * 2 * GRID_SIZE + (GRID_SIZE) + MENU_X, MENU_Y * GRID_SIZE - (GRID_SIZE / 2), pipeSelection[randomPipeIndex].image, 0);
          index0.inputEnabled = true;
          index0.scale.setTo(SCALE, SCALE);
          index0.events.onInputDown.add(selectPipe,
            this, 0, randomPipeIndex, i);
        }
        break;
      case 1:
        if (i !== currentSelection) {
          index1 = menuPipes.children[i];
        } else {
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
        } else {
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

  //Updates array.
  boxedPipes[currentSelection] = pipeIndex;
  console.log(boxedPipes);

  // Signals pipe swap complete.
  pipeSwap = false;
}

// Selects a pipe from the menu
function selectPipe(pipe, pointer, index, currentIndex) {
  if (input_Enabled === true) {
    currentSelection = currentIndex;
    pipeIndex = index;
    boxCreator(pointer);
    canPlace = true;
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
  boxSelector.scale.setTo(SCALE + 3.1, SCALE + 3.1);
  boxSelector.x += -55;
  boxSelector.y += -55;
}

// Calls functions based on position of active pointer
function delegate(pointer) {
  if (pointer.x >= GRID_X
    && pointer.x < GRID_X_BOUND
    && pointer.y >= GRID_Y
    && pointer.y <= GRID_Y_BOUND) {
    placePipe();
    console.log(grid);
  }
}

// Plays water flow animation
function startWaterFlow(pipe, connection) {
  if (pipe !== null) {
    let adjacentObstacles = getAdjacentObjects(pipe, Obstacle);
    for (o of adjacentObstacles) {
      if (!o.sap && o.warning) {
        health -= o.damage;
        healthText.text = health;
        o.warning.animations.play('flash');
        setHealthBar(health);
        o.sap = true;
      }
    }
    let index = pipe.connections.indexOf(connection);
    pipe.animation = (index === 0) ? 'forward' : 'backward';
    let connectedPipes = getConnectedPipes(pipe, connection);
    pipe.sprite.animations.play(pipe.animation);
    pipe.sprite.animations.getAnimation(pipe.animation)
      .onComplete.add(function () {
        console.log(grid);
        if (connectedPipes.length === 0) {
          winScreen();
          return;
        }
        if (health <= 0) {
          onLose.dispatch();
          return;
        }
        for (let p of connectedPipes) {
          startWaterFlow(p, p.connection);
        }
      }, this);
  } 
}

// Starts water level counter
function startCounter() {
  hpCounter = game.time.events.loop(HP_RATE, function() {
    healthText.text = --health;
  }, this);
  hpBarCounter = game.time.events.loop(hpBarRate, function() {
    hpBar.frame += 1;
  }, this);
}

// Stops gameplay and begins water flow animation
function levelComplete() {
  hpCounter.timer.stop();
  hpBarCounter.timer.stop();
  canPlace = false;
  let startingPipe = grid[startTile.row][startTile.col];
  startWaterFlow(startingPipe, startTile.connection);
}

// Stops gameplay and displays lose screen
function gameOver() {
  hpCounter.timer.stop();
  hpBarCounter.timer.stop();
  hpBar.frame = hpBar.animations.frameTotal - 1;
  canPlace = false;
  loseScreen();
}

// Syncs health bar with health variable
function setHealthBar(health) {
  let percentGone = (HP - health) / HP;
  let nextFrame = parseInt(hpBar.animations.frameTotal * percentGone) - 1;
  if (nextFrame >= 0 && nextFrame < hpBar.animations.frameTotal) {
    hpBar.frame = nextFrame;
  }
}

// Creates starting selection of random (but unique) pipes
function initializeMenu() {
  pipeGroup = game.add.group();

  for (let i = 0; pipeGroup.length < 3;) {
    var randomPipeIndex = Math.floor(Math.random() * 6);
    if (!boxedPipes.includes(randomPipeIndex)) {
      let pipe = game.add.sprite(
        i * 2 * GRID_SIZE + (GRID_SIZE) + MENU_X,
        MENU_Y * GRID_SIZE - (GRID_SIZE / 2),
        pipeSelection[randomPipeIndex].image, 0);
      pipe.scale.setTo(SCALE, SCALE)
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

    console.log(boxedPipes);
  }
}

// Initializes controls for manually selecting pipes
function initializeTestControls() {
  // For testing: select specific pipes
  key1 = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
  key2 = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
  key3 = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
  key4 = game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
  key5 = game.input.keyboard.addKey(Phaser.Keyboard.FIVE);
  key6 = game.input.keyboard.addKey(Phaser.Keyboard.SIX);
  key1.onDown.add(function () {
    canPlace = true;
    pipeIndex = 0;
  }, this);
  key2.onDown.add(function () {
    canPlace = true;
    pipeIndex = 1;
  }, this);
  key3.onDown.add(function () {
    canPlace = true;
    pipeIndex = 2;
  }, this);
  key4.onDown.add(function () {
    canPlace = true;
    pipeIndex = 3;
  }, this);
  key5.onDown.add(function () {
    canPlace = true;
    pipeIndex = 4;
  }, this);
  key6.onDown.add(function () {
    canPlace = true;
    pipeIndex = 5;
  }, this);
}

