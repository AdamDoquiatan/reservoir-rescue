// Initializes controls for manually selecting pipes
function initializeTestControls() {
    // For testing: select specific pipes
    key1 = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    key2 = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
    key3 = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
    key4 = game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
    key5 = game.input.keyboard.addKey(Phaser.Keyboard.FIVE);
    key6 = game.input.keyboard.addKey(Phaser.Keyboard.SIX);
    key1.onDown.add(function () {
      canPlace = true;
      pipeIndex = 0;
    }, this);
    key2.onDown.add(function () {
      canPlace = true;
      pipeIndex = 1;
    }, this);
    key3.onDown.add(function () {
      canPlace = true;
      pipeIndex = 2;
    }, this);
    key4.onDown.add(function () {
      canPlace = true;
      pipeIndex = 3;
    }, this);
    key5.onDown.add(function () {
      canPlace = true;
      pipeIndex = 4;
    }, this);
    key6.onDown.add(function () {
      canPlace = true;
      pipeIndex = 5;
    }, this);
  }