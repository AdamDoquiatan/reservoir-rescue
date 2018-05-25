function Pipe(image, selectImage, connections, col, row) {
    this.image = image;
    this.col = col;
    this.row = row;
    this.connectedToStart = false;
    this.connections = connections;
    this.sprite = null;
    this.waterFlow = false;
    this.selectImage = selectImage;
}

// Selection of pipes to choose from
pipeSelection = [
  new Pipe('pipev', 'pipevselect', [Directions.UP, Directions.DOWN]),
  new Pipe('pipeh', 'pipehselect', [Directions.LEFT, Directions.RIGHT]),
  new Pipe('pipe1', 'pipe1select', [Directions.UP, Directions.RIGHT]),
  new Pipe('pipe2', 'pipe2select', [Directions.DOWN, Directions.RIGHT]),
  new Pipe('pipe3', 'pipe3select', [Directions.LEFT, Directions.DOWN]),
  new Pipe('pipe4', 'pipe4select', [Directions.UP, Directions.LEFT])
];

// Previous pipe checked in pipe connection algorithm
let previousPipe = null;

let endPipe = null;
let currentPipe = null;
let animation = 'forward';

// Places pipe on grid
function placePipe() {
  console.log('placePipe');
  if (canPlace) {
    let col = calculateCol(); 
    let row = calculateRow();

    if (canPlaceAt(col, row)) {
      let temp = grid[row][col];

      if (temp instanceof Pipe) {
        swapPipe(temp);
        resetConnections();
      } else {
        setHealth(health - PENALTY);
      }

      let pipe = intializePipe(col, row);
      SFX_placePipe.play();
      if (firstPipePlaced == false) {
        hintText.destroy();
        hintBox.destroy();
        firstPipePlaced = true;
      }

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
        startPipe = connect(getNextPipe(startPipe, 'connectedToStart'));
      }

      if (startPipe !== null) {
        if (checkCollision(startPipe, endTile)) {
          if (startPipe.connections.includes(endTile.connection)) {
            canPlace = false;
            endPipe = startPipe;
            togglePipeInput(false);
            levelComplete();
          } 
        }
      }
      setWarnings();
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
    return connect(getNextPipe(pipe, 'connectedToStart'));
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
  waterFlow = true;

  if (pipe !== null) {
    if (!complete) {
      checkObstacles(pipe);
    }  
    
    currentPipe = pipe;
    pipe.sprite.animations.play(animation, waterFlowRate);
    pipe.waterFlow = true;
    pipe.sprite.inputEnabled = false;
    pipe.sprite.animations.getAnimation(animation).onComplete.add(function() {
      let nextPipe = getNextPipe(pipe, 'waterFlow');
  
      let index;
      if (nextPipe !== null) {
        index = nextPipe.connections.indexOf(invertDirection(getDirection(pipe, nextPipe)));
      } else if (pipe === endPipe) {
        index = pipe.connections.indexOf(endTile.connection);
      } else {
        onLose.dispatch();
        return;
      }

      animation = (index === 0) ? 'forward' : 'backward'; 

      if (health <= 0) {
        SFX_endFlow.fadeOut(200);
        onLose.dispatch();
        return;
      }
      startWaterFlow(nextPipe);
    }, this);
  } else {
    SFX_endFlow.stop();
    endFlow = true;   
    SFX_splash.play();
  }
}

/* Helper Functions */

// Returns true if pipe can be placed at specified position on grid
function canPlaceAt(col, row) {
  return canPlace && (grid[row][col] === null
    || grid[row][col] === undefined
    || (grid[row][col] instanceof Pipe && !grid[row][col].waterFlow));
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
    pipeSelection[pipeIndex].selectImage, 
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
function getNextPipe(pipe, property) {
  let adjacentPipes = getAdjacentObjects(pipe, Pipe);
  for (p of adjacentPipes) {
    if (p[property]) {
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
      o.sprite.animations.play('active');
      o.warning.destroy();
      o.connectedToPipe = true;

      // Draw connector sprite
      switch (getDirection(pipe, o)) {
        case 1:
          o.connector = obstacleGroup.create(
            pipe.col * GRID_SIZE + GRID_X, 
            pipe.row * GRID_SIZE + GRID_Y - (GRID_SIZE / 2), 'connectu');
          break;
        case 2:
          o.connector = obstacleGroup.create(
            pipe.col * GRID_SIZE + GRID_X + (GRID_SIZE / 2), 
            pipe.row * GRID_SIZE + GRID_Y, 'connectr');
          break;
        case 3:
          o.connector = obstacleGroup.create(
            pipe.col * GRID_SIZE + GRID_X, 
            pipe.row * GRID_SIZE + GRID_Y + (GRID_SIZE / 2), 'connectd');
          break;
        case 4:
          o.connector = obstacleGroup.create(
            pipe.col * GRID_SIZE + GRID_X - (GRID_SIZE / 2), 
            pipe.row * GRID_SIZE + GRID_Y, 'connectl');
          break;
      }
      o.connector.scale.setTo(4);
      pipe.sprite.bringToTop();
      o.sprite.bringToTop();

      if (!o.timer.running) {
        o.startSap();
      }
    }
  }
}

function initializePipes() {
  startPipe = null;
  endPipe = null;
  currentPipe = null;
  animation = 'forward'; 
  resetConnections();
  waterFlow = false;
  waterFlowRate = FLOW_RATE;
}