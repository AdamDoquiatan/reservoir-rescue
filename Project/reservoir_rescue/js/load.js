var loadState = {

  preload() {
    // Load your sprites (and other stuff, I guess?) here!
    game.load.image('loading_bg', 'assets/images/loading_bg.jpg');
    game.load.image('loaded', 'assets/images/loaded.png');

    game.load.tilemap('map', 'assets/maps/tilemap.csv');
    game.load.image('tileset', 'assets/maps/tileset.png');

    game.load.spritesheet('pipev', 'assets/images/pipev.png', 32, 32);
    game.load.spritesheet('pipeh', 'assets/images/pipeh.png', 32, 32);
    game.load.spritesheet('pipe1', 'assets/images/pipe1.png', 32, 32);
    game.load.spritesheet('pipe2', 'assets/images/pipe2.png', 32, 32);
    game.load.spritesheet('pipe3', 'assets/images/pipe3.png', 32, 32);
    game.load.spritesheet('pipe4', 'assets/images/pipe4.png', 32, 32);

    game.load.image('cursor', 'assets/images/cursor.png');
  },
  create() {
    // Loads a loading screen (but right now loads too fast to show)
    game.add.sprite(0, 0, 'loading_bg');

    // Begins play state
    game.state.start('play');
  }
};
