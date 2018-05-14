const GRID_SIZE = 32 * SCALE;
const TILES_X = 7;
const TILES_Y = 6;
const GRID_X = 0;
const GRID_Y = GRID_SIZE * 3;
const GRID_X_BOUND = GRID_SIZE * TILES_X + GRID_X;
const GRID_Y_BOUND = GRID_SIZE * TILES_Y + GRID_Y;

// Grid as 2D array
let grid = new Array(TILES_Y);
for (let i = 0; i < TILES_Y; i++) {
  grid[i] = new Array(TILES_X);
}
for (let i = 0; i < TILES_Y; i++) {
  for (let j = 0; j < TILES_X; j++) {
    grid[i][j] = null;
  }
}

let startTile = {
  image: 'cursor',
  connection: Connections.UP,
  col: 3,
  row: 0,
  gameObject: null
};

let endTile = {
  image: 'cursor',
  connection: Connections.DOWN,
  col: 3,
  row: 5,
  gameObject: null
};

// Adds object to grid
function addToGrid(object, col, row) {
  return grid[row][col] = object;
}

// Checks if two objects occupy same tile 
function checkCollision(objectA, objectB) {
  return (objectA.col === objectB.col && objectA.row === objectB.row);
}

// Returns array of adjacent objects of specified type
function getAdjacentObjects(object, type) {
  let objects = [];
  let temp;

  temp = checkUp(object);
  if (other !== null && other instanceof type) {
    objects.push(temp);
  }
  temp = checkRight(object);
  if (other !== null && other instanceof type) {
    objects.push(temp);
  }
  temp = checkDown(object);
  if (other !== null && other instanceof type) {
    objects.push(temp);
  }
  temp = checkLeft(object);
  if (other !== null && other instanceof type) {
    objects.push(temp);
  }

  return objects;
}

// Returns object above or null if empty
function checkUp(object) {
  if (object.row > 0) {
    if (grid[object.row - 1][object.col] !== null) {
      return other;
    }
  }
  return null;
}

// Returns object to right or null if empty
function checkRight(object) {
  if (object.col < TILES_X - 1) {
    if (grid[object.row + 1][object.col] !== null) {
      return other;
    }
  }
  return null;
}

// Returns object below or null if empty
function checkDown(object) {
  if (object.row < TILES_Y - 1) {
    if (grid[object.row + 1][object.col] !== null) {
      return other;
    }
  }
  return null;
}

// Returns object to the left or null if empty
function checkLeft(object) {
  if (object.col > 0) {
    if (grid[object.row][object.col - 1] !== null) {
      return other;
    }
  }
  return null;
}

// Returns inverse of specified connection
function invertConnection(connection) {
  switch (connection) {
    case Connections.UP:
      return Connections.DOWN;
    case Connections.RIGHT:
      return Connections.LEFT;
    case Connections.DOWN:
      return Connections.UP;
    case Connections.LEFT:
      return Connections.RIGHT;
  }
}
