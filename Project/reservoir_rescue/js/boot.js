var bootState = {
  create: function () {
    // Scales game window
    if (window.matchMedia("(min-width: 700px)").matches) {
      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    } else {
      game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    }
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.smoothed = false;

    // Sets physics engine
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Begins load state
    game.state.start('load');
  }
};
