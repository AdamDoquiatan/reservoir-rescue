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
    this.pauseHeader = game.add.text(this.game.world.centerX, 100, "PAUSED", { font: 'bold 42pt Helvetica', fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 310 });
    this.pauseHeader.anchor.setTo(0.5);
    pauseScreen.add(this.pauseHeader);

    // Specifies text properties
    var textStyle = { font: 'bold 15pt Helvetica', fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 290 };

    // Tip text
    this.tipDisplay = game.add.text(this.game.world.centerX, 300, "RACCOON TIP:\n" + this.randomTip(this.tipDisplay, this), textStyle);
    this.tipDisplay.anchor.setTo(0.5);
    pauseScreen.add(this.tipDisplay);

    // Continue button
    this.contButton = pauseScreen.create(235, 476, 'continueButton');
    this.contButton.inputEnabled = true;
    this.contButton.events.onInputDown.add(function () {
      pauseScreen.destroy();
      darkFilter.destroy();
    });

    // Menu button
    this.menuButton = pauseScreen.create(35, 476, 'menuButton');
    this.menuButton.inputEnabled = true;
    this.menuButton.events.onInputDown.add(function () {
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
    this.obsBG = obsScreen.create(this.game.world.centerX, -360, 'obs_screen');
    this.obsBG.anchor.setTo(0.5);
    this.obsBG.scale.setTo(1.4, 2.6);

    // Picture of a sprinkler
    this.obsSprink = obsScreen.create(this.game.world.centerX, -475, 'obs_screen_sprink');
    this.obsSprink.anchor.setTo(0.5);
    this.obsSprink.scale.setTo(0.1, 0.1);

    // Specifies text properties
    var textStyle = { font: 'bold 15pt Helvetica', fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 310 };

    // Obstacle text
    this.obsTextSprink = game.add.text(this.game.world.centerX, -280, "Ah, the common sprinkler. Beneath its innocent promise of green lawns and summer fun lies a dark truth: These things can toss out up to 16 liters/minute! Better keep our pipes clear!", textStyle);
    this.obsTextSprink.anchor.setTo(0.5);
    obsScreen.add(this.obsTextSprink);

    // Continue button
    this.contButton = obsScreen.create(247, -166, 'continueButton');
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

  },

  randomTip: function (sprite, event) {
    var tip = Math.floor(Math.random() * 8);

    switch (tip) {
      case 0:
        return "Did you know water gushes from the average faucet at 9.4 litres per second? That\u0027s a lot of H2O swirling down your drain, there. While you\u0027re brushing your teeth with one hand, try turning off the faucet with the other. Save some of that good stuff for the rest of us!"
        break;
      case 1:
        return "What\u0027s that dripping? Why it\u0027s the sound of 19 litres of water being wasted every day because somebody didn\u0027t fix a leaky faucet (not pointing any fingers). Seriously, people! Fix it yourself or hire a plumber. A racoon plumber!"
        break;
      case 2:
        return "You know what plants crave? Exactly! That water you just cooked your pasta in; save it, let it cool, and water your plants with it. Just, uh, make sure it\u0027s cooled off first. Like, cold. Otherwise, you can say goodbye to your begonias."
        break;
      case 3:
        return "How long does it take to have a shower? I mean, what are you people doing in there!? Showers use up 15-19 litres of water per minute, so maybe do your daydreaming somewhere else."
        break;
      case 4:
        return "Did you know that most lawns are overwatered? People are dumping as much as 340 litres per square foot per year on that thankless green patch in front of their houses. Just let it go brown! I mean what did that grass ever do for you?"
        break;
      case 5:
        return "You know what uses a lot of water? Power plants and hydro-electric dams! If you want to save water on the sly, using less electricity might just be the way to do it."
        break;
      case 6:
        return "It takes a whole lot of water to rear animals for meat, so maybe lay off the beef a little. The environment will thank you. The cows will thank you too!"
        break;
      case 7:
        return "Ah, the common sprinkler. Beneath its innocent promise of green lawns and summer fun lies a dark truth: These things can toss out up to 16 liters/minute!"
        break;
      default:
        return "It takes a whole lot of water to rear animals for meat, so maybe lay off the beef a little. The environment will thank you. The cows will thank you too!"
        break;
    }


  }


}

// Saw this stuff below in a tutorial. Doesn't seem to do anything, but might have something to do with the play class looping.

//var game = new Phaser.Game(640, 360, Phaser.AUTO);
//game.state.add('playState', playState);
//game.state.start('playState');