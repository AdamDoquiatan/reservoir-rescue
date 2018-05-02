var loadState = {

  preload() {
    // Load your sprites (and other stuff, I guess?) here!
    this.load.image('loading_bg', 'assets/loading_bg.jpg');
    this.load.image('loaded', 'assets/loaded.png');
  },

  create() {
    // Loads a loading screen (but right now loads too fast to show)
    this.add.sprite(0,0, "loading_bg");

    // Begins play state
    this.game.state.start('play');
  }

}