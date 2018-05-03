var game = new Phaser.Game(288, 288, Phaser.AUTO, 'game');

// States are added to the game
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('play', playState);

// Starts boot state
game.state.start('boot');
