const GRID_SIZE = 32 * SCALE;
const TILES_X = 7;
const TILES_Y = 6;
const GRID_X = 0;
const GRID_Y = GRID_SIZE * 3;
const GRID_X_BOUND = GRID_SIZE * TILES_X + GRID_X;
const GRID_Y_BOUND = GRID_SIZE * TILES_Y + GRID_Y;

const Directions = {
  UP: 1,
  RIGHT: 2,
  DOWN: 3,
  LEFT: 4
};

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
  connection: Directions.UP,
  col: 3,
  row: 0
};

let endTile = {
  connection: Directions.DOWN,
  col: 3,
  row: 5
};

// Adds object to grid
function addObjectToGrid(object, col, row) {
  return grid[row][col] = object;
}

// Adds sprites to grid
function addSpriteToGrid(sprite, col, row) {
  let s = game.add.sprite(GRID_X + GRID_SIZE * col, GRID_Y + GRID_SIZE * row, sprite);
  s.scale.set(SCALE);
  if (sprite !== 'warning') {
    s.inputEnabled = true;
    s.events.onInputDown.add(destroySprite, this);
  }
  return s;
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
  if (temp !== null && temp instanceof type) {
    objects.push(temp);
  }
  temp = checkRight(object);
  if (temp !== null && temp instanceof type) {
    objects.push(temp);
  }
  temp = checkDown(object);
  if (temp !== null && temp instanceof type) {
    objects.push(temp);
  }
  temp = checkLeft(object);
  if (temp !== null && temp instanceof type) {
    objects.push(temp);
  }

  return objects;
}

// Returns object above or null if empty
function checkUp(object) {
  if (object.row > 0) {
    return grid[object.row - 1][object.col];
  }
  return null;
}

// Returns object to right or null if empty
function checkRight(object) {
  if (object.col < TILES_X - 1) {
    return grid[object.row][object.col + 1];
  }
  return null;
}

// Returns object below or null if empty
function checkDown(object) {
  if (object.row < TILES_Y - 1) {
    return grid[object.row + 1][object.col];
  }
  return null;
}

// Returns object to the left or null if empty
function checkLeft(object) {
  if (object.col > 0) {
    return grid[object.row][object.col - 1];
  }
  return null;
}

// Gets direction from source object to target object
function getDirection(source, target) {
  if (source && target !== null) {
    if (source.col === target.col) {
      if (source.row > target.row) {
        return Directions.UP;
      } else if (source.row < target.row) {
        return Directions.DOWN;
      }
    } else if (source.row === target.row) {
      if (source.col < target.col) {
        return Directions.RIGHT;
      } else if (source.col > target.col) {
        return Directions.LEFT;
      }
    }
  }
}

function colToX(col) {
  return col * GRID_SIZE + GRID_X;
}

function rowToY(row) {
  return row * GRID_SIZE + GRID_Y;
}