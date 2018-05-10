// GRID_X = horizontal offset
// GRID_Y = vertical offset
// GRID_X_MAX = horizontal bound of grid
// GRID_Y_MAX = vertical bound of grid
const SCALE = 4;
const GRID = 32 * SCALE;
const TILES_X = 7;
const TILES_Y = 6;
const GRID_X = 0;
const GRID_Y = GRID * 3;
const GRID_X_MAX = GRID * TILES_X + GRID_X;
const GRID_Y_MAX = GRID * TILES_Y + GRID_Y;
const MENU_X = 0;
const MENU_Y = 11;

// Connections enum
let Connections = {
  UP: 1,
  RIGHT: 2,
  DOWN: 3,
  LEFT: 4
};
Object.freeze(Connections);

// pipev = vertical pipe
// pipeh = horizontal pipe
// pipe1 = up & right
// pipe2 = down & right
// pipe3 = down & left
// pipe4 = up & left
let pipes = [
  {
    image: 'pipev',
    connections: [
      Connections.UP,
      Connections.DOWN
    ],
    start: false,
    end: false,
    object: null,
    col: 0,
    row: 0
  },
  {
    image: 'pipeh',
    connections: [
      Connections.LEFT,
      Connections.RIGHT
    ],
    start: false,
    end: false,
    object: null,
    col: 0,
    row: 0
  },
  {
    image: 'pipe1',
    connections: [
      Connections.UP,
      Connections.RIGHT
    ],
    start: false,
    end: false,
    object: null,
    col: 0,
    row: 0
  },
  {
    image: 'pipe2',
    connections: [
      Connections.DOWN,
      Connections.RIGHT
    ],
    start: false,
    end: false,
    object: null,
    col: 0,
    row: 0
  },
  {
    image: 'pipe3',
    connections: [
      Connections.LEFT,
      Connections.DOWN
    ],
    start: false,
    end: false,
    object: null,
    col: 0,
    row: 0
  },
  {
    image: 'pipe4',
    connections: [
      Connections.UP,
      Connections.LEFT
    ],
    start: false,
    end: false,
    object: null,
    col: 0,
    row: 0
  }
];
let pipeIndex = 0;

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

let path = [];

// Variables
let startConnected = false;
let endConnected = false;
let win = false;

// Pause Variable for turning off inputEnabled buttons
var input_Enabled = true;
// Tracks which pipes are in which selection spot
var boxedPipes = [];
// Tracks currently selected pipe
var currentSelection;
// Signals a pipe menu update when true (don't change!)
var pipeSwap = false;

// Game objects
let map;
let layer;
let menuPipes;
let winText;
let testText;

// Signals
let onWin = new Phaser.Signal();

let playState;
playState = {

  create: function () {

    // Initialize tilemap
    map = game.add.tilemap('map', 32, 32);
    map.addTilesetImage('tileset');
    layer = map.createLayer(0);
    layer.scale.set(SCALE);

    // Set start and end points
    start.object = addToGrid(start.col, start.row, start.image);
    end.object = addToGrid(end.col, end.row, end.image);

    // Initialize pipe selection menu
    initializeMenu();

    // Text
    winText = game.add.text(0, 32, 'LOSE', { fontSize: '32px', fill: '#FFF' });
    testText = game.add.text(0, 0, '', { fontSize: '32px', fill: '#FFF' });

    // Event handlers and signals
    game.input.onDown.add(delegate, this, 0);
    onWin.add(levelComplete, this);

    // Pause Button
    this.pauseButton = this.game.add.sprite(game.width, 0, 'pause');
    this.pauseButton.scale.setTo(2.3);
    this.pauseButton.anchor.setTo(1, 0);
    this.pauseButton.inputEnabled = input_Enabled;
    this.pauseButton.events.onInputDown.add(this.pauseMenu, this);

    // For testing: turn the obstacle screen on or off
    let playObsScreen = true;
    if (playObsScreen === true) {
      this.obsScreen1();
    }


  },

  update: function () {
    if (pipeSwap == true) {
      reloadPipe(menuPipes);
    }

    testText.text = '('
      + parseInt(game.input.activePointer.x) + ','
      + parseInt(game.input.activePointer.y) + ')';
  },

  pauseMenu: function (sprite, event) {

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
    this.tipDisplay = game.add.text(this.game.world.centerX, 650, "RACCOON TIP:\n" + this.randomTip(this.tipDisplay, this), textStyle);
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
    })

    // Menu button
    this.menuButton = pauseScreen.create(this.game.world.centerX, 1350, 'menuButton');
    this.menuButton.anchor.setTo(0.5);
    this.menuButton.scale.setTo(2.3);
    this.menuButton.inputEnabled = true;
    this.menuButton.events.onInputDown.add(function () {
      window.location.replace('/reservoir-rescue/Project/reservoir_rescue');
    })
  },

  obsScreen1: function (sprite, event) {

    this.pauseButton.input.enabled = false;
    game.input.onDown.removeAll();

    // Dummy Blurry BG
    //var filterBG = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'BG_blur');
    //filterBG.anchor.setTo(0.5);

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

      obsScreen.forEach(function (element) {
        var elementTween = this.game.add.tween(element);
        elementTween.to({ y: element.position.y - 640 }, 700, Phaser.Easing.Back.In, true);
        elementTween.start();
        elementTween.onComplete.add(function () {
          //filterBG.destroy();
          obsScreen.destroy();
        });

      });
      this.pauseButton.input.enabled = true;
      game.input.onDown.add(delegate, this, 0);

    }
  },

  randomTip: function (sprite, event) {

    var tip = Math.floor(Math.random() * 8);

    switch (tip) {
      case 0:
        return "Did you know water gushes from the average faucet at 9.4 litres per second? That\u0027s a lot of H2O swirling down your drain, there. While you\u0027re brushing your teeth with one hand, try turning off the faucet with the other. Save some of that good stuff for the rest of us!"
        break;
      case 1:
        return "What\u0027s that dripping? Why it\u0027s the sound of 19 litres of water being wasted every day because somebody didn\u0027t fix a leaky faucet (not pointing any fingers). Seriously, people! Fix it yourself or hire a plumber. A racoon plumber!"
        break;
      case 2:
        return "You know what plants crave? Exactly! That water you just cooked your pasta in; save it, let it cool, and water your plants with it. Just, uh, make sure it\u0027s cooled off first. Like, cold. Otherwise, you can say goodbye to your begonias."
        break;
      case 3:
        return "How long does it take to have a shower? I mean, what are you people doing in there!? Showers use up 15-19 litres of water per minute, so maybe do your daydreaming somewhere else."
        break;
      case 4:
        return "Did you know that most lawns are overwatered? People are dumping as much as 340 litres per square foot per year on that thankless green patch in front of their houses. Just let it go brown! I mean what did that grass ever do for you?"
        break;
      case 5:
        return "You know what uses a lot of water? Power plants and hydro-electric dams! If you want to save water on the sly, using less electricity might just be the way to do it."
        break;
      case 6:
        return "It takes a whole lot of water to rear animals for meat, so maybe lay off the beef a little. The environment will thank you. The cows will thank you too!"
        break;
      case 7:
        return "Ah, the common sprinkler. Beneath its innocent promise of green lawns and summer fun lies a dark truth: These things can toss out up to 16 liters/minute!"
        break;
      default:
        return "It takes a whole lot of water to rear animals for meat, so maybe lay off the beef a little. The environment will thank you. The cows will thank you too!"
        break;
    }
  }
};

// Actions to take once level is complete
function levelComplete() {
  winText.text = 'WIN';
  let startingPipe = grid[start.row][start.col];
  pathToArray(startingPipe, Connections.UP);
  flow(null, null, 0);
}

// Initializes the pipe selection menu
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

function selectPipe(pipe, pointer, index) {
  if (input_Enabled === true) {
    pipeIndex = index;
  }
}

function placePipe() {

  let col = parseInt((game.input.x - GRID_X) / GRID);
  let row = parseInt((game.input.y - GRID_Y) / GRID);

  let pipe = Object.assign({}, pipes[pipeIndex]);
  pipe.col = col;
  pipe.row = row;

  if (checkEmpty(col, row)) {
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
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], 60, false);
    pipe.object.animations.add('backward',
      [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32], 60, false);

    connect(pipe);
    if (startConnected && endConnected) {
      win = true;
      onWin.dispatch();
    }
    else {
      startConnected = false;
      endConnected = false;
    }
  }


}

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
        if (i != currentSelection) {
          index0 = menuPipes.children[i];
        } else {
          index0 = game.add.sprite(currentSelection * 2 * GRID + (GRID) + MENU_X, MENU_Y * GRID - (GRID / 2), pipes[randomPipeIndex].image, 0);
          index0.inputEnabled = true;
          index0.scale.setTo(SCALE, SCALE)
          index0.events.onInputDown.add(selectPipe,
            this, 0, randomPipeIndex, i);
        }
        break;
      case 1:
        if (i != currentSelection) {
          index1 = menuPipes.children[i];
        } else {
          index1 = game.add.sprite(currentSelection * 2 * GRID + (GRID) + MENU_X, MENU_Y * GRID - (GRID / 2), pipes[randomPipeIndex].image, 0);
          index1.inputEnabled = true;
          index1.scale.setTo(SCALE, SCALE)
          index1.events.onInputDown.add(selectPipe,
            this, 0, randomPipeIndex, i);
        }
        break;
      case 2:
        if (i != currentSelection) {
          index2 = menuPipes.children[i];
        } else {
          index2 = game.add.sprite(currentSelection * 2 * GRID + (GRID) + MENU_X, MENU_Y * GRID - (GRID / 2), pipes[randomPipeIndex].image, 0);
          index2.inputEnabled = true;
          index2.scale.setTo(SCALE, SCALE)
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
    let otherPipe = grid[pipe.row - 1][pipe.col];
    if (otherPipe !== null) {
      if (otherPipe.connections.includes(Connections.DOWN)) {
        return otherPipe;
      }
    }
  }
  return null;
}

// Checks if there's a pipe to the right
function checkRight(pipe) {
  if (pipe.col < TILES_X - 1) {
    let otherPipe = grid[pipe.row][pipe.col + 1];
    if (otherPipe !== null) {
      if (otherPipe.connections.includes(Connections.LEFT)) {
        return otherPipe;
      }
    }
  }
  return null;
}

// Checks if there's a pipe below
function checkDown(pipe) {
  if (pipe.row < TILES_Y - 1) {
    let otherPipe = grid[pipe.row + 1][pipe.col];
    if (otherPipe !== null) {
      if (otherPipe.connections.includes(Connections.UP)) {
        return otherPipe;
      }
    }
  }
  return null;
}

// Checks if there's a pipe to the left
function checkLeft(pipe) {
  if (pipe.col > 0) {
    let otherPipe = grid[pipe.row][pipe.col - 1];
    if (otherPipe !== null) {
      if (otherPipe.connections.includes(Connections.RIGHT)) {
        return otherPipe;
      }
    }
  }
  return null;
}


