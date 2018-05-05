var loadState = {

  preload() {
    // Load your sprites (and other stuff, I guess?) here!
    game.load.image('loading_bg', 'assets/loading_bg.jpg');
    game.load.image('loaded', 'assets/loaded.png');

    game.load.tilemap('map', 'assets/tilemap.csv');
    game.load.image('tileset', 'assets/tileset.png');

    game.load.spritesheet('pipev', 'assets/pipev.png', 32, 32);
    game.load.spritesheet('pipeh', 'assets/pipeh.png', 32, 32);
    game.load.spritesheet('pipe1', 'assets/pipe1.png', 32, 32);
    game.load.spritesheet('pipe2', 'assets/pipe2.png', 32, 32);
    game.load.spritesheet('pipe3', 'assets/pipe3.png', 32, 32);
    game.load.spritesheet('pipe4', 'assets/pipe4.png', 32, 32);

    game.load.image('cursor', 'assets/cursor.png');
  },
  create() {
    // Loads a loading screen (but right now loads too fast to show)
    game.add.sprite(0, 0, 'loading_bg');

    // Begins play state
    game.state.start('play');
  }
};
