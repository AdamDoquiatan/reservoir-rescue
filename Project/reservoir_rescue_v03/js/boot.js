var bootState = {
  create: function () {
    // Sets a physics engine
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //Begins load state
    game.state.start('load');
  }
}