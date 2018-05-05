var playState = {
  create() {
    // Add loaded images as sprites, and change properties. Also load other things
    this.tempBG = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'tempBG');
    this.tempBG.anchor.setTo(0.5);

    this.pauseButton = this.game.add.sprite(360, 0, 'pause');
    this.pauseButton.anchor.setTo(1, 0);
    this.pauseButton.inputEnabled = true;
    this.pauseButton.events.onInputDown.add(this.pauseMenu, this);

    // For testing: Turn the obstacle screen on or off.
    var playObsScreen = true;
    if (playObsScreen == true) {
      this.obsScreen1();
    }

  },

  update() {
    // Gameplay goes here

  },

  pauseMenu: function (sprite, event) {

    // Dark Filter
    var darkFilter = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'darkFilter');
    darkFilter.anchor.setTo(0.5);

    // Group for screen componenets
    var pauseScreen = this.game.add.group();

    // Big pause header
    this.pauseHeader = game.add.text(this.game.world.centerX, 160, "PAUSED", { font: 'bold 42pt Helvetica', fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 290 });
    this.pauseHeader.anchor.setTo(0.5);
    pauseScreen.add(this.pauseHeader);

    // Specifies text properties
    var textStyle = { font: 'bold 15pt Helvetica', fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 290 };

    // Tip text
    this.tipDisplay = game.add.text(this.game.world.centerX, 315, "RACCOON TIP:\nAh, the common sprinkler. Beneath its innocent promise of green lawns and summer fun lies a dark truth: These things can toss out up to 16 liters/minute!", textStyle);
    this.tipDisplay.anchor.setTo(0.5);
    pauseScreen.add(this.tipDisplay);

    // Continue button
    this.contButton = pauseScreen.create(235, 466, 'continueButton');
    this.contButton.inputEnabled = true;
    this.contButton.events.onInputDown.add(function () {
      pauseScreen.destroy();
      darkFilter.destroy();
    });

    // Menu button
    this.menuButton = pauseScreen.create(35, 466, 'menuButton');
    this.menuButton.inputEnabled = true;
    this.menuButton.events.onInputDown.add(function() {
      window.location.replace('/reservoir-rescue/Project/reservoir_rescue_v03');
    })
  },

  obsScreen1: function (sprite, event) {

    // Dummy Blurry BG
    var filterBG = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'tempBG_blur');
    filterBG.anchor.setTo(0.5);

    // Group for screen componenets
    var obsScreen = this.game.add.group();

    // Screen BG
    this.obsBG = obsScreen.create(this.game.world.centerX, -380, 'obs_screen');
    this.obsBG.anchor.setTo(0.5);
    this.obsBG.scale.setTo(1.3, 2.4);

    // Picture of a sprinkler
    this.obsSprink = obsScreen.create(this.game.world.centerX, -490, 'obs_screen_sprink');
    this.obsSprink.anchor.setTo(0.5);
    this.obsSprink.scale.setTo(0.1, 0.1);

    // Specifies text properties
    var textStyle = { font: 'bold 13pt Helvetica', fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 290 };

    // Obstacle text
    this.obsTextSprink = game.add.text(this.game.world.centerX, -310, "Ah, the common sprinkler. Beneath its innocent promise of green lawns and summer fun lies a dark truth: These things can toss out up to 16 liters/minute! Better keep our pipes clear!", textStyle);
    this.obsTextSprink.anchor.setTo(0.5);
    obsScreen.add(this.obsTextSprink);

    // Continue button
    this.contButton = obsScreen.create(235, -204, 'continueButton');
    this.contButton.inputEnabled = true;
    this.contButton.events.onInputDown.add(endObsScreen, this);

    // Opening screen animation. Auto-plays when game starts
    obsScreen.forEach(function (element) {
      var elementTween = this.game.add.tween(element);
      elementTween.to({ y: element.position.y + 640 }, 700, Phaser.Easing.Elastic.Out, true);
      elementTween.start();
    })

    // Exits screen. Plays when continue button is pressed
    function endObsScreen(sprite, event) {

      obsScreen.forEach(function (element) {
        var elementTween = this.game.add.tween(element);
        elementTween.to({ y: element.position.y + 640 }, 700, Phaser.Easing.Back.In, true);
        elementTween.start();
        elementTween.onComplete.add(function () {
          filterBG.destroy();
          obsScreen.destroy();
        });
      });

    }

  }


}

// Saw this stuff below in a tutorial. Doesn't seem to do anything, but might have something to do with the play class looping.

//var game = new Phaser.Game(640, 360, Phaser.AUTO);
//game.state.add('playState', playState);
//game.state.start('playState');