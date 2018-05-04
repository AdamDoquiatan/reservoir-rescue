var playState = {
  create() {
    // Add loaded images as sprites, and change properties. Also load other things
    this.title = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaded');
    this.title.anchor.setTo(0.5);
    this.title.scale.setTo(2.0);

    this.obsScreen1();



  },

  update() {
    // Gameplay goes here

  },

  obsScreen1: function (sprite, event) {

    var obsScreen = this.game.add.group();

    this.obsBG = obsScreen.create(this.game.world.centerX, 260, 'obs_screen');
    this.obsBG.anchor.setTo(0.5);
    this.obsBG.scale.setTo(1.3, 2.4);

    this.obsSprink = obsScreen.create(this.game.world.centerX, 150, 'obs_screen_sprink');
    this.obsSprink.anchor.setTo(0.5);
    this.obsSprink.scale.setTo(0.1, 0.1);

    var textStyle = { font: 'bold 13pt Helvetica', fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 290 };

    this.obsTextSprink = game.add.text(this.game.world.centerX, 330, "Ah, the common sprinkler. Beneath its innocent promise of green lawns and summer fun lies a dark truth: These things can toss out up to 16 liters/minute! Better keep our pipes clear!", textStyle);
    this.obsTextSprink.anchor.setTo(0.5);
    obsScreen.add(this.obsTextSprink);

    this.contButton = obsScreen.create(235, 436, 'continueButton');
    this.contButton.inputEnabled = true;
    this.contButton.events.onInputDown.add(endObsScreen, this);

    function endObsScreen(sprite, event) {
      console.log("Go away!");

      obsScreen.forEach(function (element) {
        element.position.y += 641;
      })
    }

  }

  
}

// Saw this stuff below in a tutorial. Doesn't seem to do anything, but might have something to do with the play class looping.

//var game = new Phaser.Game(640, 360, Phaser.AUTO);
//game.state.add('playState', playState);
//game.state.start('playState');