var loadState = {

  preload: function () {

    // Gameplay stuff
    game.load.image('loading_bg', 'assets/images/loading_bg.jpg');
    game.load.image('cursor', 'assets/images/cursor.png');
    game.load.image('boxSelector', 'assets/images/boxSelector.png');

    // Tilemaps
    game.load.tilemap('map', 'assets/maps/tilemap.csv');
    game.load.image('tileset', 'assets/maps/tileset.png');

    // Pipes
    game.load.spritesheet('pipev', 'assets/images/pipev.png', 32, 32);
    game.load.spritesheet('pipeh', 'assets/images/pipeh.png', 32, 32);
    game.load.spritesheet('pipe1', 'assets/images/pipe1.png', 32, 32);
    game.load.spritesheet('pipe2', 'assets/images/pipe2.png', 32, 32);
    game.load.spritesheet('pipe3', 'assets/images/pipe3.png', 32, 32);
    game.load.spritesheet('pipe4', 'assets/images/pipe4.png', 32, 32);

    // In-Game Menu Stuff
    this.load.image('obs_screen', 'assets/images/obs_bg_1.jpg');
    this.load.image('obs_screen_sprink', 'assets/images/Obs1_Sprink.png');
    this.load.image('continueButton', 'assets/images/continueButton.jpg');
    this.load.image('darkFilter', 'assets/images/darkFilter.png');
    this.load.image('pause_screen', 'assets/images/obs_bg_1.jpg');
    this.load.image('pause', 'assets/images/pause.png');
    this.load.image('restart', 'assets/images/restart.png');
    this.load.image('menuButton', 'assets/images/menu.png');
  },
  create() {

    // Loads a loading screen (but right now loads too fast to show)
    game.add.sprite(0, 0, 'loading_bg');

    // Begins play state
    game.state.start('play');
  }
};
