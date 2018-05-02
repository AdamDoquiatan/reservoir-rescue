var playState = {

  create() {
  // Add loaded images as sprites, and change properties. Also load other things
  this.title = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaded');
  this.title.anchor.setTo(0.5);
  this.title.scale.setTo(2.0);
  },


  update() {
    // Gameplay goes here

  }
}

// Saw this stuff below in a tutorial. Doesn't seem to do anything, but might have something to do with the play class looping.

//var game = new Phaser.Game(640, 360, Phaser.AUTO);
//game.state.add('playState', playState);
//game.state.start('playState');