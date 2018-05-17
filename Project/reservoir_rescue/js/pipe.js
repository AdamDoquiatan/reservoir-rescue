const PIPE_VERTICAL = 'pipev';
const PIPE_HORIZONTAL = 'pipeh';
const PIPE_UP_RIGHT = 'pipe1';
const PIPE_DOWN_RIGHT = 'pipe2';
const PIPE_LEFT_DOWN = 'pipe3';
const PIPE_UP_LEFT = 'pipe4';

const Connections = {
    UP: 1,
    RIGHT: 2,
    DOWN: 3,
    LEFT: 4
};

function Pipe(image, connections, col, row) {
    this.image = image;
    this.connections = connections;
    this.col = col;
    this.row = row;
    this.connectedToStart = false;
    this.connectedToEnd = false;
    this.sprite = null;
}

let pipeSelection = [
    new Pipe(PIPE_VERTICAL, [Connections.UP, Connections.DOWN]),
    new Pipe(PIPE_HORIZONTAL, [Connections.LEFT, Connections.RIGHT]),
    new Pipe(PIPE_UP_RIGHT, [Connections.UP, Connections.RIGHT]),
    new Pipe(PIPE_DOWN_RIGHT, [Connections.DOWN, Connections.RIGHT]),
    new Pipe(PIPE_LEFT_DOWN, [Connections.LEFT, Connections.DOWN]),
    new Pipe(PIPE_UP_LEFT, [Connections.UP, Connections.LEFT])
];

// Places pipe on grid
function placePipe() {
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

// Returns array of connected pipes
function getConnectedPipes(pipe, connection) {
  let pipes = [];
  let temp;
  let cInverse;

  for (let c of pipe.connections) {
    if (c === connection)
      continue;
    switch (c) {
      case Connections.UP:
        temp = checkUp(pipe);
        break;
      case Connections.RIGHT:
        temp = checkRight(pipe);
        break;
      case Connections.DOWN:
        temp = checkDown(pipe);
        break;
      case Connections.LEFT:
        temp = checkLeft(pipe);
        break;
    }
    if (temp !== null && temp instanceof Pipe) {
      cInverse = invertConnection(c);
      if (temp.connections.includes(cInverse)) {
        temp.connection = cInverse;
        pipes.push(temp);
      }
    }
  }

  return pipes;
}

// Checks if pipe is connected to start and end tiles
function checkConnections(pipe, connection) {
  if (!startConnected 
  && checkCollision(pipe, startTile)
  && pipe.connections.includes(startTile.connection)) {
    startConnected = pipe.connectedToStart = true;
  }
  if (!endConnected 
  && checkCollision(pipe, endTile)
  && pipe.connections.includes(endTile.connection)) {
    endConnected = pipe.connectedToEnd = true;
  }

  let connectedPipes = getConnectedPipes(pipe, connection);

  if (!pipe.connectedToStart) {
    for (let p of connectedPipes) {
      if (!pipe.connectedToStart && p.connectedToStart) {
        pipe.connectedToStart = true;
      } else if (!pipe.connectedToStart) {
        checkConnections(p, p.connection);
      }
    }
  }

  if (pipe.connectedToStart) {
    if (pipe.connectedToEnd) {
      onWin.dispatch();
      return;
    }
    connectedPipes = getConnectedPipes(pipe);
    for (let p of connectedPipes) {
      if (!p.connectedToStart) {
        checkConnections(p);
      }
    }
  }   
}

// Clears all connections between pipes on grid
function clearConnections(pipe) {
  if (startConnected && checkCollision(pipe, startTile)) {
    startConnected = false;
  }
  if (endConnected && checkCollision(pipe, endTile)) {
    endConnected = false;
  }
  for (p of pipeArray) {
    if (checkCollision(p, startTile)) {
      continue;
    }
    p.connectedToStart = false;
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
}

function canPlaceAt(col, row) {
  return canPlace && (grid[row][col] === null
    || grid[row][col] instanceof Pipe);
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