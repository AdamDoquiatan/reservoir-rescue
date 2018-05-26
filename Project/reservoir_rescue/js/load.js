var disableWeatherAPI = true;
var weather = 20;
var weatherInitialized = false;

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(success);			// if geolocation supported, call function
} else {
  weather = 20;
  weatherInitialized = true;
};

// function to get lat/long and plot on a google map
function success(position) {
  var lat = position.coords.latitude;							// set latitude variable
  var lng	= position.coords.longitude;						// set longitude variable

  getWeather(lat,lng);											      // get weather for the lat/long
};

// Key code for the weather API
var key = "d168d702f072e23805f64c65b6c88b9f";

function getWeather(lat,lng) {
  if(lat != '' && lng != '') {
    $.getJSON( "https://api.openweathermap.org/data/2.5/weather?id=524901&APPID="+key+"&lat="+lat+"&lon="+lng+"&units=metric", function(data) {	// add '&units=imperial' to get U.S. measurements
    console.log(data);
    weather = Math.round(data.main.temp);
    weatherInitialized = true;
    });
  } else {
    weather = 20;
    weatherInitialized = true;
  }
}

var loadState = {
  preload: function () {
    // Gameplay stuff
    game.load.image('loading_bg', 'assets/images/loading_bg.png');
    game.load.image('cursor', 'assets/images/cursor.png');
    game.load.image('boxSelector', 'assets/images/boxSelector.png');
    game.load.spritesheet('hp_bar', 'assets/images/hp_bar.png', 160, 32);
    game.load.spritesheet('warning', 'assets/images/warning.png', 32, 32);
    game.load.spritesheet('connectu', 'assets/images/connectu.png', 32, 32);
    game.load.spritesheet('connectr', 'assets/images/connectr.png', 32, 32);
    game.load.spritesheet('connectd', 'assets/images/connectd.png', 32, 32);
    game.load.spritesheet('connectl', 'assets/images/connectl.png', 32, 32);
    game.load.image('raccoon', 'assets/images/raccoon.png');

    // Tilemaps
    game.load.image('tileset', 'assets/maps/tileset.png');
    game.load.tilemap('level1', 'assets/maps/level1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('level2', 'assets/maps/level2.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('level3', 'assets/maps/level3.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('level4', 'assets/maps/level4.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('level5', 'assets/maps/level5.json', null, Phaser.Tilemap.TILED_JSON);
    
    // Pipes
    game.load.spritesheet('pipev', 'assets/images/pipev.png', 32, 32);
    game.load.spritesheet('pipeh', 'assets/images/pipeh.png', 32, 32);
    game.load.spritesheet('pipe1', 'assets/images/pipe1.png', 32, 32);
    game.load.spritesheet('pipe2', 'assets/images/pipe2.png', 32, 32);
    game.load.spritesheet('pipe3', 'assets/images/pipe3.png', 32, 32);
    game.load.spritesheet('pipe4', 'assets/images/pipe4.png', 32, 32);
    game.load.spritesheet('pipevselect', 'assets/images/pipevselect.png', 48, 48);
    game.load.spritesheet('pipehselect', 'assets/images/pipehselect.png', 48, 48);
    game.load.spritesheet('pipe1select', 'assets/images/pipe1select.png', 48, 48);
    game.load.spritesheet('pipe2select', 'assets/images/pipe2select.png', 48, 48);
    game.load.spritesheet('pipe3select', 'assets/images/pipe3select.png', 48, 48);
    game.load.spritesheet('pipe4select', 'assets/images/pipe4select.png', 48, 48);

    // Obstacles
    game.load.spritesheet('sprinkler', 'assets/images/sprinkler.png', 32, 32);
    game.load.spritesheet('sink', 'assets/images/sink.png', 32, 32);
    game.load.spritesheet('toilet', 'assets/images/toilet.png', 32, 32);
    game.load.spritesheet('washing_machine', 'assets/images/washing_machine.png', 32, 32);
    game.load.spritesheet('shower', 'assets/images/shower.png', 32, 32);

    // Help Menu spritesheets
    game.load.spritesheet('helpPipeSelect', 'assets/images/helpPipeSelect.png', 441, 96);
    game.load.spritesheet('helpPipesToGrid', 'assets/images/helpPipesToGrid.png', 128, 128);
    game.load.spritesheet('helpHealthBar', 'assets/images/helpHealthBar.png', 274, 53);
    game.load.spritesheet('helpObsticle', 'assets/images/helpObsticle.png', 131, 135);
    game.load.spritesheet('helpPipeSwap', 'assets/images/helpPipeSwap.png', 176, 278);

    // In-Game Menu Stuff
    this.load.image('borderWindow', 'assets/images/borderWindow.png');
    this.load.image('obs_screen_sprink', 'assets/images/Obs1_Sprink.png');
    this.load.image('continueButton', 'assets/images/continueButton.png');
    this.load.image('darkFilter', 'assets/images/darkFilter.png');
    this.load.image('whiteFilter', 'assets/images/whiteFilter.png');
    this.load.image('pause', 'assets/images/pause.png');
    this.load.image('restart', 'assets/images/restart.png');
    this.load.image('menuButton', 'assets/images/menu.png');
    this.load.image('winButton', 'assets/images/win.png');
    this.load.image('loseButton', 'assets/images/lose.png');
    this.load.image('menu_button', 'assets/images/menu_button.png');
    this.load.image('helpButton', 'assets/images/help.png');
    this.load.image('backButton', 'assets/images/back.png');
    this.load.image('moreButton', 'assets/images/more.png');
    this.load.image('howToPlayButton', 'assets/images/howToPlay.png');
    this.load.image('water_counter', 'assets/images/water_counter.png');
    this.load.image('muteButton', 'assets/images/mute.png');
    this.load.image('temp', 'assets/images/temp.png');
    this.load.image('helpTemp', 'assets/images/helpTemp.png');
    this.load.image('hintBox', 'assets/images/hintBox.png');
    this.load.spritesheet('selection_menu', 'assets/images/selection_menu.png', 224, 64);
  
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
    this.load.audio('regularButton', ['assets/sounds/254713__greekirish__projector-button-push_short.mp3', 'assets/sounds/254713__greekirish__projector-button-push_short.ogg']);
    //this.load.audio('endFlow', ['assets/sounds/drumroll.mp3', 'assets/sounds/drumroll.ogg']);
    this.load.audio('splash', ['assets/sounds/splash.mp3', 'assets/sounds/splash.ogg']);
    this.load.audio('beep', ['assets/sounds/beep-29.mp3', 'assets/sounds/beep-29.ogg']);
    //this.load.audio('', ['assets/sounds/', 'assets/sounds/']);
    
  },
  create() {
    // Loads a loading screen (but right now loads too fast to show)
  var loadingScreen = game.add.sprite(game.world.centerX, game.world.centerY, 'loading_bg');
  loadingScreen.anchor.setTo(0.5);
  },

  update() {
    if ((disableWeatherAPI || weatherInitialized) && this.cache.isSoundDecoded('victorySound')) {
        // Begins play state
        game.state.start('play');
    }
  }
};
