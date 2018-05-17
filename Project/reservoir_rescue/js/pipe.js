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
    this.direction = null;
}

let pipeSelection = [
    new Pipe(PIPE_VERTICAL, [Directions.UP, Directions.DOWN]),
    new Pipe(PIPE_HORIZONTAL, [Directions.LEFT, Directions.RIGHT]),
    new Pipe(PIPE_UP_RIGHT, [Directions.UP, Directions.RIGHT]),
    new Pipe(PIPE_DOWN_RIGHT, [Directions.DOWN, Directions.RIGHT]),
    new Pipe(PIPE_LEFT_DOWN, [Directions.LEFT, Directions.DOWN]),
    new Pipe(PIPE_UP_LEFT, [Directions.UP, Directions.LEFT])
];

// Places pipe on grid
function placePipe() {
<<<<<<< HEAD
  let col = calculateCol();
  let row = calculateRow();

  if (canPlaceAt(col, row)) {
    let temp = grid[row][col];
=======
    let x = game.input.x - GRID_X;
    let y = game.input.y - GRID_Y;
    let col = parseInt(x / GRID_SIZE);
    let row = parseInt(y / GRID_SIZE);

    let clear = false;

    if (canPlaceAt(col, row)) {
      if (grid[row][col] instanceof Pipe) {
        pipeSwappedBack = grid[row][col];
        removeObjectFromArray(pipeSwappedBack, pipeArray);
        doNotRandomize = true;
        SFX_swapPipe.play();
        if (pipeSwappedBack.connectedToStart) {
          clear = true;
        } 
      } else {
        SFX_placePipe.play();
      }
      
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
      console.log(pipeArray);

      if (clear) {
        clearConnections(pipe);
      }
      checkConnections(pipe);

      if (pipe.connectedToStart) {
        setWarnings();
      }
      
    }
  }
>>>>>>> be8e9c7d4583890b87225593492d10cb19a071c6

    if (temp instanceof Pipe) {
      swapPipe(temp);
    }

    let pipe = intializePipe(col, row);

    if (startPipe === null) {
      let startObject = grid[startTile.row][startTile.col];
      if (startObject !== null && startObject instanceof Pipe) {
        if (startObject.connections.includes(startTile.direction)) {
          setStartPipe(startObject);
        }
      }
    }

    console.log(grid);

    if (startPipe !== null) {
      checkConnections(startPipe);
    }

    console.log(grid);

    setWarnings();

    console.log(grid);
  }
}

// Connects or disconnects pipe from other pipes
function checkConnections(pipe) {
  if (pipe !== null) {
    if (pipe.connectedToStart) {
      let adjacentPipes = getAdjacentObjects(pipe, Pipe);
      for (let p of adjacentPipes) {
        if (p.connectedToStart) {
          continue;
        }
        if (canConnect(pipe, p, p.direction)) {
          setStartPipe(p);
          checkConnections(p);
        }
      }
    }
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
<<<<<<< HEAD
function startWaterFlow(pipe, previousDirection) {
=======
function startWaterFlow(pipe, connection) {

>>>>>>> be8e9c7d4583890b87225593492d10cb19a071c6
  if (pipe !== null) {
    let adjacentObstacles = getAdjacentObjects(pipe, Obstacle); 
    for (let o of adjacentObstacles) {
      if (!o.connectedToPipe && o.warning) {
        health -= o.damage;
        healthText.text = health;
        o.warning.animations.play('flash');
        setHealthBar(health);
        o.connectedToPipe = true;
      }
    }
<<<<<<< HEAD
  }

  let index = pipe.connections.indexOf(previousDirection);
  let animation = (index === 0) ? 'forward' : 'backward';

  let adjacentPipes = getAdjacentObjects(pipe, Pipe);
    
  pipe.sprite.animations.play(animation);
  pipe.sprite.animations.getAnimation(animation).onComplete.add(function() {
    if (checkCollision(pipe, endTile)) {
      winScreen();
      return;
    }
    if (health <= 0) {
      onLose.dispatch();
      return;
    }
    for (let p of adjacentPipes) {
      if (p.direction === previousDirection) {
        continue;
      }
      if (p.connectedToStart && canConnect(pipe, p, p.direction)) {
        startWaterFlow(p, invertDirection(p.direction));
      }
    }
  }, this);
=======
    let index = pipe.connections.indexOf(connection);
    pipe.animation = (index === 0) ? 'forward' : 'backward';
    let connectedPipes = getConnectedPipes(pipe, connection);
    pipe.sprite.animations.play(pipe.animation);
    pipe.sprite.animations.getAnimation(pipe.animation)
      .onComplete.add(function () {
        console.log(grid);
        if (connectedPipes.length === 0) {
          SFX_endFlow.fadeOut(300);
          SFX_victorySound.play()
          SFX_victorySound.onStop.add(function () {
            SFX_gameMusic.volume = 0.1;
            SFX_gameMusic.resume();

          });
          winScreen();
          return;
        }
        if (health <= 0) {
          SFX_endFlow.fadeOut(200);
          SFX_loseSound.play();
          onLose.dispatch();
          return;
        }
        for (let p of connectedPipes) {
          startWaterFlow(p, p.connection);
        }
      }, this);
  } 
>>>>>>> be8e9c7d4583890b87225593492d10cb19a071c6
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

// Sets the starting pipe to search for other pipes
function setStartPipe(pipe) {
  if (pipe !== null) {
    startPipe = pipe;
    pipe.connectedToStart = true;

    if (checkCollision(pipe, endTile)) {
      if (pipe.connections.includes(endTile.direction)) {
        onWin.dispatch();
      } 
    }
  }
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

// Returns true if both pipes can be connected
function canConnect(pipeA, pipeB, pipeBDirection) {
  if (pipeB.connections.includes(invertDirection(pipeBDirection)) 
  && pipeA.connections.includes(pipeBDirection)) {
    return true;
  }
  return false;
}