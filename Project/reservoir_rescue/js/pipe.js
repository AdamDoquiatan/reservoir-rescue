const PIPE_VERTICAL = 'pipev';
const PIPE_HORIZONTAL = 'pipeh';
const PIPE_UP_RIGHT = 'pipe1';
const PIPE_DOWN_RIGHT = 'pipe2';
const PIPE_LEFT_DOWN = 'pipe3';
const PIPE_UP_LEFT = 'pipe4';

function Pipe(image, connections, col, row) {
    this.image = image;
    this.col = col;
    this.row = row;
    this.connectedToStart = false;
    this.connections = connections;
    this.sprite = null;
    this.waterFlow = false;
}

// Selection of pipes to choose from
pipeSelection = [
  new Pipe(PIPE_VERTICAL, [Directions.UP, Directions.DOWN]),
  new Pipe(PIPE_HORIZONTAL, [Directions.LEFT, Directions.RIGHT]),
  new Pipe(PIPE_UP_RIGHT, [Directions.UP, Directions.RIGHT]),
  new Pipe(PIPE_DOWN_RIGHT, [Directions.DOWN, Directions.RIGHT]),
  new Pipe(PIPE_LEFT_DOWN, [Directions.LEFT, Directions.DOWN]),
  new Pipe(PIPE_UP_LEFT, [Directions.UP, Directions.LEFT])
];

// Previous pipe checked in pipe connection algorithm
let previousPipe = null;

// Places pipe on grid
function placePipe() {
  if (canPlace) {
    let col = calculateCol(); 
    let row = calculateRow();

    if (canPlaceAt(col, row)) {
      let temp = grid[row][col];

      if (temp instanceof Pipe) {
        swapPipe(temp);
        resetConnections();
      }

      let pipe = intializePipe(col, row);
      SFX_placePipe.play();

      if (startPipe === null) {
        temp = grid[startTile.row][startTile.col];
        if (temp instanceof Pipe 
          && checkCollision(temp, startTile) 
          && temp.connections.includes(startTile.connection)) {
          startPipe = temp;
          startPipe.connectedToStart = true;
        } 
      }

      if (startPipe !== null) {
        previousPipe = startPipe;
        startPipe = connect(getNextPipe(startPipe));
      }

      if (startPipe !== null) {
        if (checkCollision(startPipe, endTile)) {
          if (startPipe.connections.includes(endTile.connection)) {
            canPlace = false;
            togglePipeInput(false);
            onWin.dispatch();
          } 
        }
      }

      setWarnings();
      console.log(grid); 
      console.log(startPipe);
    } 
  }
}

// Connects or disconnects pipe from other pipes
function connect(pipe) {
  if (pipe === null) {
    return previousPipe;
  } else {
    pipe.connectedToStart = true;
    previousPipe = pipe;
    return connect(getNextPipe(pipe));
  }
}

// Resets all connections between pipes
function resetConnections() {
  startPipe = null;

  for (let p of pipeArray) {
    p.connectedToStart = false;
  }
}

// Plays water flow animation
function startWaterFlow(pipe) {
  resetConnections();
  if (pipe !== null) {
    checkObstacles(pipe);
    let nextPipe = getNextPipe(pipe);

    let index;
    if (nextPipe !== null) {
      console.log(getDirection(pipe, nextPipe));
      index = pipe.connections.indexOf(getDirection(pipe, nextPipe));
    } else {
      index = pipe.connections.indexOf(endTile.connection);
    }

    let animation = (index === 1) ? 'forward' : 'backward';

    pipe.sprite.animations.play(animation);
    pipe.waterFlow = true;
    pipe.sprite.animations.getAnimation(animation).onComplete.add(function() {
      if (health <= 0) {
        SFX_endFlow.fadeOut(200);
        onLose.dispatch();
        return;
      }
      startWaterFlow(nextPipe);
    }, this);
  } else {
    SFX_endFlow.fadeOut(300);
    SFX_splash.play();
    SFX_victorySound.play();
    SFX_victorySound.onStop.add(function () {
      SFX_gameMusic.volume = 0.01;
      SFX_gameMusic.resume();
      game.add.tween(this.SFX_gameMusic).to({volume:-0.5}, 500).start();
    });
    winScreen();
  }
}

/* Helper Functions */

// Returns true if pipe can be placed at specified position on grid
function canPlaceAt(col, row) {
  return canPlace && (grid[row][col] === null
    || grid[row][col] === undefined
    || grid[row][col] instanceof Pipe);
}

// Converts active pointer x coordinate to grid column
function calculateCol() {
  let x = game.input.x - GRID_X;
  return parseInt(x / GRID_SIZE);
}

// Converts active pointer y coordinate to grid row
function calculateRow() {
  let y = game.input.y - GRID_Y;
  return parseInt(y / GRID_SIZE);
}

// Adds sprite and animations to pipe object and places it on grid
function intializePipe(col, row) {
  let pipe = new Pipe(pipeSelection[pipeIndex].image, 
    pipeSelection[pipeIndex].connections, col, row);
    
  pipeSwap = true;

  pipe.sprite = addSpriteToGrid(pipe.image, col, row);
    pipe.sprite.animations.add('forward',
      [1, 2, 3, 4, 5, 6, 7, 8], FLOW_RATE, false);
    pipe.sprite.animations.add('backward',
      [9, 10, 11, 12, 13, 14, 15, 16], FLOW_RATE, false);

  addObjectToGrid(pipe, col, row);
  pipeArray.push(pipe);   

  return pipe;
}

// Swaps specified pipe on grid back to the pipe selection menu
function swapPipe(pipe) {
  pipeSwappedBack = pipe;
  doNotRandomize = true;
  removeObjectFromArray(pipeSwappedBack, pipeArray);

  if (pipeSwappedBack.connectedToStart) {
    resetConnections();
  }

  pipeSwappedBack.connectedToStart = false;
}

// Returns inverse of specified direction
function invertDirection(direction) {
  switch (direction) {
    case Directions.UP:
      return Directions.DOWN;
    case Directions.RIGHT:
      return Directions.LEFT;
    case Directions.DOWN:
      return Directions.UP;
    case Directions.LEFT:
      return Directions.RIGHT;
  }
}

// Returns true a pipe can be connected to an adjacent pipe
function canConnect(pipe, adjacentPipe) {
  let adjacentPipeDirection = getDirection(pipe, adjacentPipe);
  return pipe.connections.includes(adjacentPipeDirection)
    && adjacentPipe.connections.includes(invertDirection(adjacentPipeDirection)); 
}

// Toggles 
function togglePipeInput(enabled) {
  for (let p of pipeArray) {
    p.sprite.input.enabled = enabled;
  }
}

// Clears all pipes from grid
function clearPipes() {
  for (let p of pipeArray) {
    p.sprite.destroy();
    grid[p.row][p.col] = null;
    pipeArray = [];
  }
}

// Returns the next pipe in the sequence of connected pipes
function getNextPipe(pipe) {
  let adjacentPipes = getAdjacentObjects(pipe, Pipe);
  for (p of adjacentPipes) {
    if (p.connectedToStart || p.waterFlow) {
      continue;
    }
    if (canConnect(pipe, p)) {
      return p;
    }
  }
  return null;
}

function checkObstacles(pipe) {
  let adjacentObstacles = getAdjacentObjects(pipe, Obstacle); 
  for (let o of adjacentObstacles) {
    if (!o.connectedToPipe && o.warning) {
      health -= o.damage;
      healthText.text = health;
      o.sprite.animations.play('active');
      o.warning.destroy();
      setHealthBar(health);
      o.connectedToPipe = true;
    }
  }
}