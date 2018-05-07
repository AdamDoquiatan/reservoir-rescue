// GRID_X = horizontal offset
// GRID_Y = vertical offset
// GRID_X_MAX = horizontal bound of grid
// GRID_Y_MAX = vertical boun of grid
const GRID = 32;
const TILES = 8;
const GRID_X = 0;
const GRID_Y = GRID * 4;
const GRID_X_MAX = GRID * TILES + GRID_X;
const GRID_Y_MAX = GRID * TILES + GRID_Y;

let startConnected = false;
let endConnected = false;

var win = false;

// Tilemap
let map;
let layer;

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
let menuPipes;
// This should be put in a separate file
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
      Connections.DOWN,
      Connections.LEFT
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
  col: 4,
  row: 7,
  object: null
};

// 2D array repressenting the grid
// where pipes are placed
let grid = new Array(TILES);
for (let i = 0; i < TILES; i++) {
  grid[i] = new Array(TILES);
}
for (let i = 0; i < TILES; i++) {
  for (let j = 0; j < TILES; j++) {
    grid[i][j] = null;
  }
}

// Text
let text;

// Pause Variable for turning off inputEnabled buttons
var input_Enabled = true;

let playState = {

  create: function () {

    // Tilemap creation
    map = game.add.tilemap('map', 32, 32);
    map.addTilesetImage('tileset');
    layer = map.createLayer(0);

    start.object = addToGrid(start.col, start.row, start.image);
    end.object = addToGrid(end.col, end.row, end.image);

    // Pipe menu
   
      menuPipes = game.add.group();
      for (let i = 0; i < pipes.length; i++) {
        menuPipes.add(game.add.sprite(i * GRID + 32, 12 * GRID, pipes[i].image, 0));
      }
      for (let i = 0; i < menuPipes.children.length; i++) {
        menuPipes.children[i].inputEnabled = true;
        menuPipes.children[i].events.onInputDown.add(selectPipe,
          this, 0, i);
      };
   

    // Text
    text = game.add.text(game.width / 2, game.height / 6, 'LOSE', { fontSize: '32px', fill: '#FFF' });
    text.anchor.setTo(0.5, 0);

    // Event handlers
    game.input.onDown.add(delegate, this, 0);

    // Scales the game window
    game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;

    // Pause Button
    this.pauseButton = this.game.add.sprite(256, 0, 'pause');
    this.pauseButton.anchor.setTo(1, 0);
    this.pauseButton.inputEnabled = input_Enabled;
    this.pauseButton.events.onInputDown.add(this.pauseMenu, this);

    // For testing: Turn the obstacle screen on or off.
    var playObsScreen = true;
    if (playObsScreen == true) {
      this.obsScreen1();
    }

    
  },
  update: function () {
    if (win === true) {
      text.text = 'WIN';
    }
  },

  pauseMenu: function (sprite, event) {

    input_Enabled = false;
    game.input.onDown.removeAll();

    // Dark Filter
    var darkFilter = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'darkFilter');
    darkFilter.anchor.setTo(0.5);

    // Group for screen componenets
    var pauseScreen = this.game.add.group();

    // Big pause header
    this.pauseHeader = game.add.text(this.game.world.centerX, 60, "PAUSED", { font: 'bold 29.4pt Helvetica', fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 310 });
    this.pauseHeader.anchor.setTo(0.5);
    pauseScreen.add(this.pauseHeader);

    // Specifies text properties
    var textStyle = { font: 'bold 11pt Helvetica', fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 210 };

    // Tip text
    this.tipDisplay = game.add.text(this.game.world.centerX, 200, "RACCOON TIP:\n" + this.randomTip(this.tipDisplay, this), textStyle);
    this.tipDisplay.anchor.setTo(0.5);
    this.tipDisplay.lineSpacing = -2;
    pauseScreen.add(this.tipDisplay);

    // Continue button
    this.contButton = pauseScreen.create(200, 333.2, 'continueButton');
    this.contButton.anchor.setTo(0.5);
    this.contButton.scale.setTo(0.7);
    this.contButton.inputEnabled = true;
    this.contButton.events.onInputDown.add(function () {
      input_Enabled = true;
      game.input.onDown.add(delegate, this, 0);
      pauseScreen.destroy();
      darkFilter.destroy();
    });

    // Menu button
    this.menuButton = pauseScreen.create(56, 333.2, 'menuButton');
    this.menuButton.anchor.setTo(0.5);
    this.menuButton.scale.setTo(0.7);
    this.menuButton.inputEnabled = true;
    this.menuButton.events.onInputDown.add(function () {
      window.location.replace('/reservoir-rescue/Project/reservoir_rescue');
    })
  },

  obsScreen1: function (sprite, event) {

    input_Enabled = false;
    game.input.onDown.removeAll();

    // Dummy Blurry BG
    var filterBG = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'BG_blur');
    filterBG.anchor.setTo(0.5);

    // Group for screen componenets
    var obsScreen = this.game.add.group();

    // Screen BG
    this.obsBG = obsScreen.create(this.game.world.centerX, -448, 'obs_screen');
    this.obsBG.anchor.setTo(0.5);
    this.obsBG.scale.setTo(1, 2);

    // Picture of a sprinkler
    this.obsSprink = obsScreen.create(this.game.world.centerX, -543, 'obs_screen_sprink');
    this.obsSprink.anchor.setTo(0.5);
    this.obsSprink.scale.setTo(0.071, 0.07);

    // Specifies text properties
    var textStyle = { font: 'bold 11pt Helvetica', fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 210 };

    // Obstacle text
    this.obsTextSprink = game.add.text(this.game.world.centerX, -378, "Ah, the common sprinkler. Beneath its innocent promise of green lawns and summer fun lies a dark truth: These things can toss out up to 16 liters/minute! Better keep our pipes clear!", textStyle);
    this.obsTextSprink.anchor.setTo(0.5);
    obsScreen.add(this.obsTextSprink);

    // Continue button
    this.contButton = obsScreen.create(207, -287, 'continueButton');
    this.contButton.anchor.setTo(0.5);
    this.contButton.scale.setTo(0.8);
    this.contButton.inputEnabled = true;
    this.contButton.events.onInputDown.add(endObsScreen, this);

    // Opening screen animation. Auto-plays when game starts
    obsScreen.forEach(function (element) {
      var elementTween = this.game.add.tween(element);
      elementTween.to({ y: element.position.y + 640 }, 700, Phaser.Easing.Elastic.Out, true);
      elementTween.start();
    })

    // Exits screen. Plays when continue button is pressed
    function endObsScreen(sprite, event) {

      obsScreen.forEach(function (element) {
        var elementTween = this.game.add.tween(element);
        elementTween.to({ y: element.position.y + 640 }, 700, Phaser.Easing.Back.In, true);
        elementTween.start();
        elementTween.onComplete.add(function () {
          filterBG.destroy();
          obsScreen.destroy();
        });
        input_Enabled = true;
        game.input.onDown.add(delegate, this, 0);
      });

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

function placePipe() {
  let col = parseInt((game.input.x - GRID_X) / GRID);
  let row = parseInt((game.input.y - GRID_Y) / GRID);

  let pipe = Object.assign({}, pipes[pipeIndex]);
  pipe.col = col;
  pipe.row = row;

  if (checkEmpty(col, row)) {
    if (checkOverlap(pipe, start)) {
      if (pipe.connections.includes(start.connect))
        pipe.start = true;
    } else if (checkOverlap(pipe, end)) {
      if (pipe.connections.includes(end.connect))
        pipe.end = true;
    }
    addToGridArray(col, row, pipe);

    connect(pipe);
    if (startConnected && endConnected) {
      win = true;
    }
    else {
      startConnected = false;
      endConnected = false;
    }

    console.log(grid);
  }
}

function selectPipe(pipe, pointer, index) {
  if (input_Enabled == true) {
    pipeIndex = index;
  };
}

// Checks if a tile on the grid is empty
function checkEmpty(col, row) {
  return grid[row][col] === null;
}

// Adds to the on-screen grid but not the 2D array
function addToGrid(col, row, object) {
  return game.add.sprite(
    col * GRID + GRID_X,
    row * GRID + GRID_Y, object);
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
  let otherPipe;
  for (let connection of pipe.connections) {
    if (connection === direction)
      continue;
    switch (connection) {
      case Connections.UP:
        otherPipe = checkUp(pipe);
        if (otherPipe !== null)
          connect(otherPipe, Connections.DOWN);
        break;
      case Connections.RIGHT:
        otherPipe = checkRight(pipe);
        if (otherPipe !== null)
          connect(otherPipe, Connections.LEFT);
        break;
      case Connections.DOWN:
        otherPipe = checkDown(pipe);
        if (otherPipe !== null)
          connect(otherPipe, Connections.UP);
        break;
      case Connections.LEFT:
        otherPipe = checkLeft(pipe);
        if (otherPipe !== null)
          connect(otherPipe, Connections.RIGHT);
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
  if (pipe.col < TILES - 1) {
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
  if (pipe.row < TILES - 1) {
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

