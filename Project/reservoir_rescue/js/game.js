<<<<<<< HEAD:Project/reservoir_rescue_v03/js/game.js
var game = new Phaser.Game(360, 640, Phaser.AUTO, 'game');
=======
var game = new Phaser.Game(256, 448, Phaser.AUTO, 'game');
>>>>>>> e9484f8ca1e300f7a56e6e39207169cf5e716f80:Project/reservoir_rescue/js/game.js

// States arre added to the game
  game.state.add('boot', bootState);
  game.state.add('load', loadState);
  game.state.add('play', playState);

// Starts boot state
  game.state.start('boot');
