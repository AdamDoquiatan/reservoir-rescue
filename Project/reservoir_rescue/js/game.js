var game = new Phaser.Game(256, 448, Phaser.AUTO, 'game');

// States arre added to the game
  game.state.add('boot', bootState);
  game.state.add('load', loadState);
  game.state.add('play', playState);

// Starts boot state
  game.state.start('boot');
