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
}

let pipes = [
    new Pipe(PIPE_VERTICAL, [Connections.UP, Connections.DOWN]),
    new Pipe(PIPE_HORIZONTAL, [Connections.LEFT, Connections.RIGHT]),
    new Pipe(PIPE_UP_RIGHT, [Connections.UP, Connections.RIGHT]),
    new Pipe(PIPE_DOWN_RIGHT, [Connections.DOWN, Connections.RIGHT]),
    new Pipe(PIPE_LEFT_DOWN, [Connections.LEFT, Connections.DOWN]),
    new Pipe(PIPE_UP_LEFT, [Connections.UP, Connections.LEFT])
];

// Places pipe on grid
function placePipe() {
    let col = parseInt((game.input.x - GRID_X) / GRID_SIZE);
    let row = parseInt((game.input.y - GRID_Y) / GRID_SIZE);
  
    if (grid[row][col] === null && canPlace) {
      let pipe = new Pipe(pipes[pipeIndex].image, pipes[pipeIndex].connections, col, row);
  
      pipeSwap = true;
  
      if (!startConnected && checkCollision(pipe, startTile)) {
        startConnected = pipe.connectedToStart = true;
      }
      if (!endConnected && checkOverlap(pipe, endTile)) {
        endConnected = pipe.connectedToEnd = true;
      }
  
      addToGridArray(col, row, pipe);
  
      pipe.object.animations.add('forward',
        [1,2,3,4,5,6,7,8], FLOW_RATE, false);
      pipe.object.animations.add('backward',
        [9,10,11,12,13,14,15,16], FLOW_RATE, false);
  
      connect(pipe);
      if (pipe.connectedToStart) {
        setWarnings(obstacleArray);
      }
    
      console.log(grid);
    }
  }

// Returns array of connected pipes
function getConnectedPipes(pipe, connection) {
  let pipeArray = [];
  let other;
  let cInverse;

  for (let c of pipe.connections) {
    if (c === connection)
      continue;
    switch (c) {
      case Connections.UP:
        other = checkUp(pipe);
        break;
      case Connections.RIGHT:
        other = checkRight(pipe);
        break;
      case Connections.DOWN:
        other = checkDown(pipe);
        break;
      case Connections.LEFT:
        other = checkLeft(pipe);
        break;
    }
    if (other !== null && other instanceof Pipe) {
      cInverse = connectionInverse(c);
      if (other.connections.includes(cInverse)) {
        other.connection = cInverse;
        pipeArray.push(other);
      }
    }
  }

  return pipeArray;
}

function connect(pipe, connection) {
  let connectedPipes = getConnectedPipes(pipe, connection);
  if (!pipe.start) {
    for (let p of connectedPipes) {
      if (!pipe.start && p.start) {
        pipe.start = true;
      }
    }
  }
  if (pipe.start) {
    if (pipe.end) {
      onWin.dispatch();
      return;
    }
    for (let p of connectedPipes) {
      if (!p.start) {
        connect(p);
      }
    }
  }   
}