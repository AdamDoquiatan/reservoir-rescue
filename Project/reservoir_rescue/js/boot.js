var bootState = {
  create: function () {
    //Centers the game screen
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    // Sets physics engine
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //Begins load state
    game.state.start('load');
  }
};