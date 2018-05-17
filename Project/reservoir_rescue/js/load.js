var loadState = {

  preload: function () {

    // Gameplay stuff
    game.load.image('loading_bg', 'assets/images/loading_bg.jpg');
    game.load.image('cursor', 'assets/images/cursor.png');
    game.load.image('boxSelector', 'assets/images/boxSelector.png');
    game.load.spritesheet('hp_bar', 'assets/images/hp_bar.png', 224, 32);
    game.load.spritesheet('warning', 'assets/images/warning.png', 32, 32);

    // Tilemaps
    game.load.image('tileset', 'assets/maps/tileset.png');
    game.load.tilemap('map', 'assets/maps/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
    // game.load.tilemap('map', 'assets/maps/tilemap_Background.csv');
    // game.load.tilemap('objectsMap', 'assets/maps/tilemap_Objects.csv');
    // game.load.tilemap('otherMap', 'assets/maps/tilemap_Other.csv');
    // game.load.tilemap('map', 'assets/maps/tilemap.csv');

    // Pipes
    game.load.spritesheet('pipev', 'assets/images/pipev.png', 32, 32);
    game.load.spritesheet('pipeh', 'assets/images/pipeh.png', 32, 32);
    game.load.spritesheet('pipe1', 'assets/images/pipe1.png', 32, 32);
    game.load.spritesheet('pipe2', 'assets/images/pipe2.png', 32, 32);
    game.load.spritesheet('pipe3', 'assets/images/pipe3.png', 32, 32);
    game.load.spritesheet('pipe4', 'assets/images/pipe4.png', 32, 32);

    // Obstacles
    game.load.spritesheet('sprinkler', 'assets/images/sprinkler.png', 32, 32);

    // In-Game Menu Stuff
    this.load.image('borderWindow', 'assets/images/borderWindow.png');
    this.load.image('obs_screen_sprink', 'assets/images/Obs1_Sprink.png');
    this.load.image('continueButton', 'assets/images/continueButton.jpg');
    this.load.image('darkFilter', 'assets/images/darkFilter.png');
    this.load.image('whiteFilter', 'assets/images/whiteFilter.png');
    this.load.image('pause', 'assets/images/pause.png');
    this.load.image('restart', 'assets/images/restart.png');
    this.load.image('menuButton', 'assets/images/menu.png');
    this.load.image('winButton', 'assets/images/win.png');
    this.load.image('loseButton', 'assets/images/lose.png');
    this.load.image('muteButton', 'assets/images/mute.png');

    // Sounds
    this.load.audio('gameMusic', ['assets/sounds/Gameplay_Music.mp3', 'assets/sounds/Gameplay_Music.ogg']);
    this.load.audio('lastPipe', ['assets/sounds/149966__nenadsimic__muffled-distant-explosion.mp3', 'assets/sounds/149966__nenadsimic__muffled-distant-explosion.ogg']);
    this.load.audio('endFlow', ['assets/sounds/191718__adriann__drumroll.mp3', 'assets/sounds/191718__adriann__drumroll.ogg']);
    this.load.audio('victorySound', ['assets/sounds/578783_Victory-Sound.mp3', 'assets/sounds/578783_Victory-Sound.ogg']);
    this.load.audio('obsScreenSwooshIn', ['assets/sounds/14609__man__swosh1.mp3', 'assets/sounds/14609__man__swosh1.ogg']);
    this.load.audio('obsScreenSwooshOut', ['assets/sounds/14609__man__swosh2.mp3', 'assets/sounds/14609__man__swosh2.ogg']);
    this.load.audio('pauseButton', ['assets/sounds/70107__justinbw__power-on.mp3', 'assets/sounds/70107__justinbw__power-on.ogg']);
    this.load.audio('selectPipe', ['assets/sounds/396331__nioczkus__1911-reload1.mp3', 'assets/sounds/396331__nioczkus__1911-reload_1.ogg']);
    this.load.audio('placePipe', ['assets/sounds/275160__bird-man__thud.mp3', 'assets/sounds/275160__bird-man__thud.ogg']);
    this.load.audio('loseSound', ['assets/sounds/150567__khoon__percussive-sounddesign-2-eb2.mp3', 'assets/sounds/150567__khoon__percussive-sounddesign-2-eb2.ogg']);
    this.load.audio('obsScreenButton', ['assets/sounds/254713__greekirish__projector-button-push.mp3', 'assets/sounds/254713__greekirish__projector-button-push.ogg']);
    this.load.audio('reset', ['assets/sounds/85999__nextmaking__jump-from-the-sand-ground-2.mp3', 'assets/sounds/85999__nextmaking__jump-from-the-sand-ground-2.ogg']);
    this.load.audio('swapPipe', ['assets/sounds/216675__hitrison__stick-swoosh-whoosh_1.mp3', 'assets/sounds/216675__hitrison__stick-swoosh-whoosh_1.ogg']);
    //this.load.audio('', ['assets/sounds/', 'assets/sounds/']);


  },
  create() {

    // Loads a loading screen (but right now loads too fast to show)
    game.add.sprite(0, 0, 'loading_bg');


  },

  update() {
        // Begins play state
        game.state.start('play');
  }
};
