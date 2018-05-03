// Constants
const GRID = 32;
const TILES = 9;

// Tilemap
var map;
var layer;

// Pipes
// pipe1 = top & right
// pipe2 = bottom & right
// pipe3 = bottom & left
// pipe4 = top & left
var menuPipes;
var pipes = ['pipev', 'pipeh', 'pipe1',
    'pipe2', 'pipe3', 'pipe4'];
var pipeIndex = 0;

// Start and end points
var start;
var end;

var grid = new Array(TILES);
for (var i = 0; i < TILES; i++) {
    grid[i] = new Array(TILES);
}

var playState = {

  create: function() {
        // Tilemap creation
        map = game.add.tilemap('map', 32, 32);
        map.addTilesetImage('tileset');
        layer = map.createLayer(0);
        layer.resizeWorld();

        start = addToGrid(4, 0, 'pipev');
        end = addToGrid(4, 8, 'pipev');

        // Pipe menu
        menuPipes = game.add.group();
        for (var i = 0; i < 6; i++) {
            menuPipes.add(addToGrid(0, i, pipes[i]));
        }
        for (let i = 0; i < menuPipes.children.length; i++) {
            menuPipes.children[i].inputEnabled = true;
            menuPipes.children[i].events.onInputDown.add(selectPipe,
                this, 0, i);
        }

        // Event handlers
        game.input.onDown.add(placePipe, this);

        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    },
    update: function() {

    }
};

function placePipe(pipe, pointer, index) {
    let row = parseInt(game.input.y / GRID);
    let col = parseInt(game.input.x / GRID);
    if (checkEmpty(col, row)) {
        addToGrid(col, row, pipes[pipeIndex]);
    }
}

function selectPipe(pipe, pointer, index) {
    pipeIndex = index;
    console.log('pipeindex: ' + pipeIndex);
}

// Checks if a tile on the grid is empty
function checkEmpty(col, row) {
    return grid[row][col] == undefined;
}

// Use this to add objects
function addToGrid(col, row, object) {
    grid[row][col] = game.add.sprite(col * GRID, row * GRID, object);
    return grid[row][col];
}
