var loadState = {

  preload() {
    // Load your sprites (and other stuff, I guess?) here!
    this.load.image('loading_bg', 'assets/loading_bg.jpg');
    this.load.image('tempBG', 'assets/tempBG.jpg');
    this.load.image('tempBG_blur', 'assets/tempBG_blur.jpg');
    this.load.image('obs_screen', 'assets/obs_bg_1.jpg');
    this.load.image('obs_screen_sprink', 'assets/Obs1_Sprink.png');
    this.load.image('continueButton', 'assets/continueButton.jpg');
  },

  create() {
    // Loads a loading screen (but right now loads too fast to show)
    this.add.sprite(0,0, "loading_bg");

    // Begins play state
    this.game.state.start('play');
  }

}