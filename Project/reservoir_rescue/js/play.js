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

let playState = {

  create: function() {

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
    }

    // Text
    text = game.add.text(game.width / 2, game.height / 6, 'LOSE', { fontSize: '32px', fill: '#FFF' });
    text.anchor.setTo(0.5, 0);

    // Event handlers
    game.input.onDown.add(delegate, this, 0);

    // Scales the game window
    game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
  },
  update: function() {
    if (win === true) {
      text.text = 'WIN';
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
  pipeIndex = index;
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
    let otherPipe = grid[pipe.row-1][pipe.col];
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
    let otherPipe = grid[pipe.row][pipe.col+1];
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
    let otherPipe = grid[pipe.row+1][pipe.col];
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
    let otherPipe = grid[pipe.row][pipe.col-1];
    if (otherPipe !== null) {
      if (otherPipe.connections.includes(Connections.RIGHT)) {
        return otherPipe;
      }
    }
  }
  return null;
}