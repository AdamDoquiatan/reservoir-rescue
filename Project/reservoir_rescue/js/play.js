// For enabling/disabling testing features
let testMode = true;

// How many time to multiply resolution
const SCALE = 4;
// Size of each grid tile in pixels
const GRID = 32 * SCALE;
// Number of grid tiles across
const TILES_X = 7;
// Number of grid tiles down
const TILES_Y = 6;
// Horizontal offset of grid
const GRID_X = 0;
// Vertical offset of grid
const GRID_Y = GRID * 3;
// Horizontal bound of grid
const GRID_X_MAX = GRID * TILES_X + GRID_X;
// Vertical bound of grid
const GRID_Y_MAX = GRID * TILES_Y + GRID_Y;
// Horizontal offset of pipe selection menu
const MENU_X = 0;
// Vertical offset of pipe selection menu
const MENU_Y = 11;
// Rate at which health goes down in milliseconds
const HP_RATE = 250;
// The initial health
const HP = 100;
// Rate at which water flows in frames per second
const FLOW_RATE = 60;
// Delay before water level starts decreasing
const DELAY = 500;

// Connections enum
let Connections = {
  UP: 1,
  RIGHT: 2,
  DOWN: 3,
  LEFT: 4
};
Object.freeze(Connections);

function Pipe(image, connections, col, row) {
  this.type = 'pipe';
  this.image = image;
  this.connections = connections;
  this.col = col;
  this.row = row;
}
// pipev = vertical pipe
// pipeh = horizontal pipe
// pipe1 = up & right
// pipe2 = down & right
// pipe3 = down & left
// pipe4 = up & left
let pipes = [
  new Pipe('pipev', [Connections.UP, Connections.DOWN]),
  new Pipe('pipeh', [Connections.LEFT, Connections.RIGHT]),
  new Pipe('pipe1', [Connections.UP, Connections.RIGHT]),
  new Pipe('pipe2', [Connections.DOWN, Connections.RIGHT]),
  new Pipe('pipe3', [Connections.LEFT, Connections.DOWN]),
  new Pipe('pipe4', [Connections.UP, Connections.LEFT])
];
// The index of the currently
// selected pipe from the pipes array
let pipeIndex = 0;

function Obstacle(image, col, row) {
  this.type = 'obstacle';
  this.image = image;
  this.col = col;
  this.row = row;
}

// Start and end points
let start = {
  image: 'cursor',
  connect: Connections.UP,
  col: 3,
  row: 0,
  object: null
};
let end = {
  image: 'cursor',
  connect: Connections.DOWN,
  col: 3,
  row: 5,
  object: null
};

// 2D array representing the grid
// where pipes are placed
let grid = new Array(TILES_Y);
for (let i = 0; i < TILES_Y; i++) {
  grid[i] = new Array(TILES_X);
}
for (let i = 0; i < TILES_Y; i++) {
  for (let j = 0; j < TILES_X; j++) {
    grid[i][j] = null;
  }
}

// Path from start to end
let path = [];

// If last pipe placed is connected to start point
let startConnected = false;
// If last pipe placed is connected to end point
let endConnected = false;
// If player won
let win = false;
// If player lost
let lose = false;
// Number keys for selecting pipes
let key1, key2, key3, key4, key5, key6;
// Pause Variable for turning off inputEnabled buttons
var input_Enabled = true;
// Ensures that player makes a selection before placing pipes
var can_Place = false;
// Tracks which pipes are in which selection spot
var boxedPipes = [];
// Tracks currently selected pipe
var currentSelection;
// Signals a pipe menu update when true (don't change!)
var pipeSwap = false;

// The main tilemap
let map;
// Background layer
let layer;
// Other layer
let otherLayer;
// Group for pipe selection menu
let menuPipes;
// Group for obstacles
let obstacles;
let winText;
let testText;
let healthText;
var boxSelector;
let counter;
var health = HP;
var score = HP;
let hpBar;
let hpBarRate;
let hpBarCounter;

// Signals
let onWin = new Phaser.Signal();
let onLose = new Phaser.Signal();

let playState;

playState = {

  create: function () {

    // Initialize tilemap
    map = game.add.tilemap('map');
    map.addTilesetImage('tileset', 'tileset');
    layer = map.createLayer('Background');
    layer.scale.set(SCALE);
    otherLayer = map.createLayer('Other');
    otherLayer.scale.set(SCALE);

    // Create obstacles from object layer of tilemap
    obstacles = game.add.group();
    map.createFromObjects('Object Layer 1', 14, 'sprinkler', 0, true, false, obstacles);
    obstacles.forEach(function (element) {
      element.scale.set(SCALE);
      element.x *= SCALE;
      element.y *= SCALE;
      let col = parseInt((element.x - GRID_X) / GRID);
      let row = parseInt((element.y - GRID_Y) / GRID);
      let obstacle = new Obstacle(element.key, col, row);
      obstacle.object = element;
      console.log(addObjectToGridArray(obstacle));
    });

    // HP Bar
    hpBar = game.add.sprite(0, GRID * 1, 'hp_bar', 0);
    hpBar.scale.setTo(SCALE);
    hpBarRate = HP_RATE * HP / hpBar.animations.frameTotal;

    // Set start and end points
    start.object = addToGrid(start.col, start.row, start.image);
    end.object = addToGrid(end.col, end.row, end.image);

    // Initialize pipe selection menu
    initializeMenu();

    // Text
    testText = game.add.text(0, 0, '', { fontSize: '32px', fill: '#FFF' });
    winText = game.add.text(0, 32, '', { fontSize: '32px', fill: '#FFF' });
    healthText = game.add.text(0, 64, health, { fontSize: '32px', fill: '#FFF' });

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
      reloadPipe(menuPipes);
    }

    if (health === 0 && !lose) {
      onLose.dispatch();
    }

    testText.text = '('
      + parseInt(game.input.activePointer.x) + ','
      + parseInt(game.input.activePointer.y) + ')';
  },

  pauseMenu: function (sprite, event) {

    counter.timer.pause();
    hpBarCounter.timer.pause();

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
      var textStyle = { font: 'bold 40pt Helvetica', fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 850 };

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
        counter.timer.resume();
        hpBarCounter.timer.resume();
        pauseScreen.destroy();
        darkFilter.destroy();
      });

      // Restart button
      this.restartButton = pauseScreen.create(this.game.world.centerX, 1200, 'restart');
      this.restartButton.anchor.setTo(0.5);
      this.restartButton.scale.setTo(2.3);
      this.restartButton.inputEnabled = true;
      this.restartButton.events.onInputDown.add(function () {
        restartLightflash()
        input_Enabled = true;
        sprite.input.enabled = true;
        game.input.onDown.add(delegate, this, 0);
        hpBar.frame = hpBar.animations.frameTotal;
        health = HP;
        counter.timer.resume();
        hpBarCounter.timer.resume();
        pauseScreen.destroy();
        darkFilter.destroy();
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
    this.obsTextSprink.addColor('#3d87ff', 17);
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

    // Screen BG
    this.obsBorder = this.game.add.sprite(this.game.world.centerX, -300, 'borderWindow');
    this.obsBorder.anchor.setTo(0.5);
    this.obsBorder.scale.setTo(1.9, 2);
    obsScreen.add(this.obsBorder);

    // Opening screen animation. Auto-plays when game starts
    obsScreen.forEach(function (element) {
      var elementTween = this.game.add.tween(element);
      elementTween.to({ y: element.position.y + 1000 }, 1000, Phaser.Easing.Elastic.Out, true);
      elementTween.start();
    });

    // Exits screen. Plays when continue button is pressed
    function endObsScreen(sprite, event) {

      darkFilterTween = this.game.add.tween(this.darkFilter);
      darkFilterTween.to({ alpha: 0 }, 1500, Phaser.Easing.Cubic.Out, true);

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
  /*
  this.contButton.inputEnabled = true;
  this.contButton.events.onInputDown.add(function () {
    input_Enabled = true;
    sprite.input.enabled = true;
    game.input.onDown.add(delegate, this, 0);
    winScreen.destroy();
  });
  */

  // Restart button (If we have multiple levels, maybe remove this?)
  this.restartButton = winScreen.create(this.game.world.centerX + 1000, 1200, 'restart');
  this.restartButton.anchor.setTo(0.5);
  this.restartButton.scale.setTo(2.3);
  this.restartButton.inputEnabled = true;
  this.restartButton.events.onInputDown.add(function () {
    restartLightflash();
    input_Enabled = true;
    game.input.onDown.add(delegate, this, 0);
    win = false;
    hpBar.frame = hpBar.animations.frameTotal;
    health = HP;
    can_Place = true;
    winText.text = '';
    counter.timer.resume();
    hpBarCounter.timer.resume();
    winHeader.destroy();
    winScreen.destroy();
    darkFilter.destroy();
  })

  // White Filter
  this.whiteFilter = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'whiteFilter');
  this.whiteFilter.anchor.setTo(0.5);
  this.whiteFilter.scale.setTo(4);
  this.whiteFilter.alpha = 0;

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
    restartLightflash();
    input_Enabled = true;
    game.input.onDown.add(delegate, this, 0);
    hpBar.frame = hpBar.animations.frameTotal;
    health = HP;
    lose = false;
    can_Place = true;
    winText.text = '';
    counter.timer.resume();
    hpBarCounter.timer.resume();

    this.whiteFilter.alpha = 1;
    whiteFilterTween = this.game.add.tween(this.whiteFilter);
    whiteFilterTween.to({ alpha: 0 }, 1000, Phaser.Easing.Cubic.Out, true);

    loseHeader.destroy();
    loseScreen.destroy();
    darkFilter.destroy();
  })

  // White Filter
  this.whiteFilter = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'whiteFilter');
  this.whiteFilter.anchor.setTo(0.5);
  this.whiteFilter.scale.setTo(4);
  
  // Text and Filter Tweens
  whiteFilterTween = this.game.add.tween(this.whiteFilter);
  whiteFilterTween.to({ alpha: 0 }, 4500, Phaser.Easing.Cubic.Out, true);

  loseTween = this.game.add.tween(this.loseHeader);
  loseTween.to({ alpha: 1 }, 1300, Phaser.Easing.Cubic.Out, true);
}


function placePipe() {

  let col = parseInt((game.input.x - GRID_X) / GRID);
  let row = parseInt((game.input.y - GRID_Y) / GRID);

  if (checkEmpty(col, row) && can_Place === true) {
    let pipe = Object.assign({}, pipes[pipeIndex]);
    pipe.col = col;
    pipe.row = row;

    pipeSwap = true;

    if (checkOverlap(pipe, start)) {
      if (pipe.connections.includes(start.connect))
        pipe.start = true;
    } else if (checkOverlap(pipe, end)) {
      if (pipe.connections.includes(end.connect))
        pipe.end = true;
    }
    addToGridArray(col, row, pipe);

    pipe.object.animations.add('forward',
      [1, 2, 3, 4, 5, 6, 7, 8], FLOW_RATE, false);
    pipe.object.animations.add('backward',
      [9, 10, 11, 12, 13, 14, 15, 16], FLOW_RATE, false);

    connect(pipe);
    if (startConnected && endConnected) {
      onWin.dispatch();
    }
    else {
      startConnected = false;
      endConnected = false;
    }
  }

  console.log(grid);
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
          index0 = game.add.sprite(currentSelection * 2 * GRID + (GRID) + MENU_X, MENU_Y * GRID - (GRID / 2), pipes[randomPipeIndex].image, 0);
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
          index1 = game.add.sprite(currentSelection * 2 * GRID + (GRID) + MENU_X, MENU_Y * GRID - (GRID / 2), pipes[randomPipeIndex].image, 0);
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
            currentSelection * 2 * GRID + (GRID) + MENU_X,
            MENU_Y * GRID - (GRID / 2), pipes[randomPipeIndex].image, 0);
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

function selectPipe(pipe, pointer, index, currentIndex) {
  if (input_Enabled === true) {
    currentSelection = currentIndex;
    pipeIndex = index;
    boxCreator(pointer);
    can_Place = true;
  }
}

// Checks if a tile on the grid is empty
function checkEmpty(col, row) {
  return grid[row][col] === null;
}

// Adds to the on-screen grid but not the 2D array
function addToGrid(col, row, object) {
  let sprite = game.add.sprite(
    col * GRID + GRID_X,
    row * GRID + GRID_Y, object);
  sprite.scale.setTo(SCALE, SCALE);
  return sprite;
}

// Adds to on-screen grid and 2D array
function addToGridArray(col, row, object) {
  object.object = addToGrid(col, row, object.image);
  return grid[row][col] = object;
}

// Adds already created object to 2D array
function addObjectToGridArray(object) {
  return grid[object.row][object.col] = object;
}

// This calls specifc functions based
// on where the player touched the screen
function delegate(pointer) {
  if (pointer.x >= GRID_X
    && pointer.x < GRID_X_MAX
    && pointer.y >= GRID_Y
    && pointer.y <= GRID_Y_MAX) {
    placePipe();
  }
}

// Checks if two objects occupy the same tile on the grid
function checkOverlap(objectA, objectB) {
  return objectA.col === objectB.col && objectA.row === objectB.row;
}

// Checks if connected pipes include pipes on the start and
// end tiles
function connect(pipe, direction) {
  if (pipe.start === true)
    startConnected = true;
  if (pipe.end === true)
    endConnected = true;
  checkDirections(pipe, direction, connect);
}

// Converts path from start point to end goal into an array
function pathToArray(pipe, direction) {
  let index = pipe.connections.indexOf(direction);
  pipe.animation = (index === 0) ? 'forward' : 'backward';
  path.push(pipe);
  checkDirections(pipe, direction, pathToArray);
}

// Plays water flow animations in order
function flow(sprite, animation, index) {
  if (index >= 0 && index < path.length) {
    let pipe = path[index];
    pipe.object.animations.play(pipe.animation);
    pipe.object.animations.getAnimation(pipe.animation)
      .onComplete.add(flow, this, 0, ++index);
  } else {
    winScreen();
  }
}

// Checks for pipes adjacent to the specified pipe
// and performs action on them
function checkDirections(pipe, direction, action) {
  let otherPipe;
  for (let connection of pipe.connections) {
    if (connection === direction)
      continue;
    switch (connection) {
      case Connections.UP:
        otherPipe = checkUp(pipe);
        if (otherPipe !== null)
          action(otherPipe, Connections.DOWN);
        break;
      case Connections.RIGHT:
        otherPipe = checkRight(pipe);
        if (otherPipe !== null)
          action(otherPipe, Connections.LEFT);
        break;
      case Connections.DOWN:
        otherPipe = checkDown(pipe);
        if (otherPipe !== null)
          action(otherPipe, Connections.UP);
        break;
      case Connections.LEFT:
        otherPipe = checkLeft(pipe);
        if (otherPipe !== null)
          action(otherPipe, Connections.RIGHT);
        break;
    }
  }
}

// Checks if there's a pipe above
function checkUp(pipe) {
  if (pipe.row > 0) {
    let other = grid[pipe.row - 1][pipe.col];
    if (other !== null && other.type === 'pipe') {
      if (other.connections.includes(Connections.DOWN)) {
        return other;
      }
    }
  }
  return null;
}

// Checks if there's a pipe to the right
function checkRight(pipe) {
  if (pipe.col < TILES_X - 1) {
    let other = grid[pipe.row][pipe.col + 1];
    if (other !== null && other.type === 'pipe') {
      if (other.connections.includes(Connections.LEFT)) {
        return other;
      }
    }
  }
  return null;
}

// Checks if there's a pipe below
function checkDown(pipe) {
  if (pipe.row < TILES_Y - 1) {
    let other = grid[pipe.row + 1][pipe.col];
    if (other !== null && other.type === 'pipe') {
      if (other.connections.includes(Connections.UP)) {
        return other;
      }
    }
  }
  return null;
}

// Checks if there's a pipe to the left
function checkLeft(pipe) {
  if (pipe.col > 0) {
    let other = grid[pipe.row][pipe.col - 1];
    if (other !== null && other.type === 'pipe') {
      if (other.connections.includes(Connections.RIGHT)) {
        return other;
      }
    }
  }
  return null;
}

function levelComplete() {
  counter.timer.pause();
  hpBarCounter.timer.pause();
  win = true;
  can_Place = false;
  winText.text = 'WIN';
  if (startConnected && endConnected) {
    let startingPipe = grid[start.row][start.col];
    pathToArray(startingPipe, Connections.UP);
  }
  flow(null, null, 0);
}

function gameOver() {
  counter.timer.pause();
  hpBarCounter.timer.pause();
  hpBar.frame = hpBar.animations.frameTotal - 1;
  lose = true;
  can_Place = false;
  winText.text = 'LOSE';
  loseScreen();
}

// Creates starting selection of random (but unique) pipes
function initializeMenu() {
  menuPipes = game.add.group();
  for (let i = 0; menuPipes.length < 3;) {
    var randomPipeIndex = Math.floor(Math.random() * 6);
    if (!boxedPipes.includes(randomPipeIndex)) {
      let pipe = game.add.sprite(i * 2 * GRID + (GRID) + MENU_X, MENU_Y * GRID - (GRID / 2), pipes[randomPipeIndex].image, 0);
      pipe.scale.setTo(SCALE, SCALE)
      menuPipes.add(pipe);
      boxedPipes.push(randomPipeIndex);
      i++;
    }
    for (let i = 0; i < menuPipes.children.length; i++) {
      menuPipes.children[i].inputEnabled = true;
      menuPipes.children[i].events.onInputDown.add(selectPipe,
        this, 0, randomPipeIndex, i);

    }
    console.log(boxedPipes);
  }
}

// Creates a box around player's selected pipe
function boxCreator(selector) {

  if (boxSelector != null) {
    boxSelector.destroy();
  }

  boxSelector = game.add.sprite(currentSelection * 2 * GRID + (GRID) + MENU_X, MENU_Y * GRID - (GRID / 2), 'boxSelector', 0);
  boxSelector.scale.setTo(SCALE + 1.8, SCALE + 1.8);
  boxSelector.x += -60;
  boxSelector.y += -60;
}

function initializeTestControls() {
  // For testing: select specific pipes
  key1 = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
  key2 = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
  key3 = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
  key4 = game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
  key5 = game.input.keyboard.addKey(Phaser.Keyboard.FIVE);
  key6 = game.input.keyboard.addKey(Phaser.Keyboard.SIX);
  key1.onDown.add(function () {
    can_Place = true;
    pipeIndex = 0;
  }, this);
  key2.onDown.add(function () {
    can_Place = true;
    pipeIndex = 1;
  }, this);
  key3.onDown.add(function () {
    can_Place = true;
    pipeIndex = 2;
  }, this);
  key4.onDown.add(function () {
    can_Place = true;
    pipeIndex = 3;
  }, this);
  key5.onDown.add(function () {
    can_Place = true;
    pipeIndex = 4;
  }, this);
  key6.onDown.add(function () {
    can_Place = true;
    pipeIndex = 5;
  }, this);
}

// Starts water level counter
function startCounter() {
  counter = game.time.events.loop(HP_RATE, function () {
    healthText.text = --health;
  }, this);
  hpBarCounter = game.time.events.loop(hpBarRate, function () {
    hpBar.frame += 1;
  }, this);
}

function restartLightflash() {
  // White Filter
  this.whiteFilter = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'whiteFilter');
  this.whiteFilter.anchor.setTo(0.5);
  this.whiteFilter.scale.setTo(4);
  this.whiteFilter.alpha = 1;

  whiteFilterTween = this.game.add.tween(this.whiteFilter);
  whiteFilterTween.to({ alpha: 0 }, 1000, Phaser.Easing.Cubic.Out, true);
}