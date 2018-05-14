var bootState = {
  create: function () {

    // Scales game window
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.smoothed = false;

    // Sets physics engine
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Begins load state
    game.state.start('load');
  }
};
