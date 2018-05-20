
function pauseMenu(sprite, event) {
  hpCounter.timer.pause();
  hpBarCounter.timer.pause();

  if (inputEnabled === true) {
    // Turns off input to everything but pause screen
    inputEnabled = false;
    sprite.input.enabled = false;
    game.input.onDown.removeAll();

    // Dark filter
    var darkFilter = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'darkFilter');
    darkFilter.anchor.setTo(0.5);
    darkFilter.scale.setTo(4);

    // Group for screen componenets
    var pauseScreen = this.game.add.group();

    // Big pause header
    this.pauseHeader = game.add.text(this.game.world.centerX, 200, "PAUSED", {
      font: 'bold 100pt Helvetica',
      fill: 'white',
      align: 'center',
      wordWrap: true,
      wordWrapWidth: 700
    });
    this.pauseHeader.anchor.setTo(0.5);
    this.pauseHeader.stroke = '#000000';
    this.pauseHeader.strokeThickness = 7;
    pauseScreen.add(this.pauseHeader);

    // Specifies text properties
    var textStyle = { font: 'bold 40pt Helvetica', fontSize: 52, fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 850 };

    // Tip text
    this.tipDisplay = game.add.text(this.game.world.centerX, 650,
      "WATER SAVING TIP:\n" + randomTip(this.tipDisplay, this), textStyle);
    this.tipDisplay.anchor.setTo(0.5);
    this.tipDisplay.lineSpacing = -2;
    this.tipDisplay.addColor('#3d87ff', 0);
    this.tipDisplay.addColor('white', 17);
    this.tipDisplay.stroke = '#000000';
    this.tipDisplay.strokeThickness = 7;
    pauseScreen.add(this.tipDisplay);

    // Continue button
    this.contButton = pauseScreen.create(this.game.world.centerX, 1050, 'continueButton');
    this.contButton.anchor.setTo(0.5);
    this.contButton.scale.setTo(2.3);
    this.contButton.inputEnabled = true;
    this.contButton.events.onInputDown.add(function () {
      SFX_gameMusic.volume = 0.4;
      inputEnabled = true;
      sprite.input.enabled = true;
      game.input.onDown.add(delegate, this, 0);
      hpCounter.timer.resume();
      hpBarCounter.timer.resume();
      pauseScreen.destroy();
      darkFilter.destroy();
    });

    // Restart button
    this.restartButton = pauseScreen.create(this.game.world.centerX, 1200, 'restart');
    this.restartButton.anchor.setTo(0.5);
    this.restartButton.scale.setTo(2.3);
    this.restartButton.inputEnabled = true;
    this.restartButton.events.onInputDown.add(function () {
      clearPipes();
      SFX_gameMusic.volume = 0.4;
      restartLightflash();
      SFX_reset.play();
      inputEnabled = true;
      sprite.input.enabled = true;
      game.input.onDown.add(delegate, this, 0);
      hpBar.frame = hpBar.animations.frameTotal;
      health = HP;
      hpCounter.timer.resume();
      hpBarCounter.timer.resume();
      pauseScreen.destroy();
      darkFilter.destroy();
    });

    // Menu button
    this.menuButton = pauseScreen.create(this.game.world.centerX, 1350, 'menuButton');
    this.menuButton.anchor.setTo(0.5);
    this.menuButton.scale.setTo(2.3);
    this.menuButton.inputEnabled = true;
    this.menuButton.events.onInputDown.add(function () {
      window.location.replace('/reservoir-rescue/Project/reservoir_rescue')
    });
  }
}

function obsScreen1(sprite, event) {
  // Prevents input to anything but obs screen
  inputEnabled = false;
  this.pauseButton.input.enabled = false;
  game.input.onDown.removeAll();

  // Dark Filter
  this.darkFilter = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'darkFilter');
  this.darkFilter.anchor.setTo(0.5);
  this.darkFilter.scale.setTo(4);
  this.darkFilter.alpha = 1;

  // Group for screen componenets
  var obsScreen = this.game.add.group();

  // Picture of a sprinkler
  this.obsSprink = obsScreen.create(this.game.world.centerX, -600, 'obs_screen_sprink');
  this.obsSprink.anchor.setTo(0.5);
  this.obsSprink.scale.setTo(0.284, 0.28);

  // "Look out!" header
  this.lookOutHeader = game.add.text(this.game.world.centerX, -260, "LOOK OUT!", { font: 'bold 70pt Helvetica', fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 700 });
  this.lookOutHeader.anchor.setTo(0.5);
  this.lookOutHeader.stroke = '#000000';
  this.lookOutHeader.strokeThickness = 5;
  obsScreen.add(this.lookOutHeader);

  // Obstacle text
  this.obsTextSprink = game.add.text(this.game.world.centerX, -110, "Sprinklers waste 16 litres of water per minute!", { font: 'bold 42pt Helvetica', fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 700 });
  this.obsTextSprink.addColor('#3d87ff', 17);
  this.obsTextSprink.addColor('white', 26);
  this.obsTextSprink.anchor.setTo(0.5);
  this.obsTextSprink.stroke = '#000000';
  this.obsTextSprink.strokeThickness = 5;
  obsScreen.add(this.obsTextSprink);

  // Obstacle text bottom line
  this.obsTextSprinkBLine = game.add.text(this.game.world.centerX, 62, "Better keep our pipes clear!", { font: 'bold 42pt Helvetica', fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 700 });
  this.obsTextSprinkBLine.anchor.setTo(0.5);
  this.obsTextSprinkBLine.stroke = '#000000';
  this.obsTextSprinkBLine.strokeThickness = 5;
  obsScreen.add(this.obsTextSprinkBLine);

  // Continue button
  this.contButton = obsScreen.create(this.game.world.centerX, 207, 'continueButton');
  this.contButton.anchor.setTo(0.5);
  this.contButton.scale.setTo(2.3);
  this.contButton.inputEnabled = true;
  this.contButton.events.onInputDown.add(endObsScreen, this);

  // How To Play button
  this.howToPlayButton = obsScreen.create(game.world.centerX, 315, 'howToPlayButton');
  this.howToPlayButton.anchor.setTo(0.5);
  this.howToPlayButton.scale.setTo(1.7);
  //this.howToPlayButton.inputEnabled = true;
  //this.howToPlayButton.events.onInputDown.add(endObsScreen, this);

  // Screen BG
  this.obsBorder = this.game.add.sprite(this.game.world.centerX, -300, 'borderWindow');
  this.obsBorder.anchor.setTo(0.5);
  this.obsBorder.scale.setTo(2, 2.1);
  obsScreen.add(this.obsBorder);

  // Opening screen animation. Auto-plays when game starts
  obsScreen.forEach(function (element) {
    var elementTween = this.game.add.tween(element);
    elementTween.to({ y: element.position.y + 1000 }, 1000, Phaser.Easing.Elastic.Out, true);
    elementTween.start();
  });

  // Exits screen. Plays when continue button is pressed
  function endObsScreen(sprite, event) {

    // Audio
    createAudio();
    game.sound.context.resume();
    SFX_obsScreenSwooshOut.play();
    SFX_obsScreenButton.play();
    SFX_obsScreenSwooshOut.onStop.add(function () {
      if (musicEnabled == true) {
        SFX_gameMusic.play();
      }
    });

    darkFilterTween = this.game.add.tween(this.darkFilter);
    darkFilterTween.to({ alpha: 0 }, 1500, Phaser.Easing.Cubic.Out, true);

    obsScreen.forEach(function (element) {
      var elementTween = this.game.add.tween(element);
      elementTween.to({ y: element.position.y - 640 }, 700, Phaser.Easing.Back.In, true);
      elementTween.start();
      elementTween.onComplete.add(function () {
        obsScreen.destroy();
      });

    });
    inputEnabled = true;
    this.pauseButton.input.enabled = true;
    game.input.onDown.add(delegate, this, 0);

    game.time.events.add(DELAY, startCounter, this);
  }
}

function helpScreen1(sprite, event) {

  hpCounter.timer.pause();
  hpBarCounter.timer.pause();

  if (inputEnabled === true) {
    // Prevents input to anything but obs screen
    inputEnabled = false;
    this.pauseButton.input.enabled = false;
    game.input.onDown.removeAll();

    game.add.tween(SFX_gameMusic).to({ volume: 0.1 }, 500, Phaser.Easing.Cubic.Out, true).start();

    // Dark Filter
    this.darkFilter = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'darkFilter');
    this.darkFilter.anchor.setTo(0.5);
    this.darkFilter.scale.setTo(4);
    this.darkFilter.alpha = 0;

    // Tween Dark Filter in
    darkFilterTween = this.game.add.tween(this.darkFilter);
    darkFilterTween.to({ alpha: 1 }, 500, Phaser.Easing.Cubic.Out, true);

    // Group for screen componenets
    var helpScreen = this.game.add.group();

    var textStyle = { font: 'bold 40pt Helvetica', fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 620 };

    // "How To Play" header
    this.htpHeader = game.add.text(this.game.world.centerX, -825, "How To Play", { font: 'bold 70pt Helvetica', fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 700 });
    this.htpHeader.anchor.setTo(0.5);
    this.htpHeader.stroke = '#000000';
    this.htpHeader.strokeThickness = 5;
    helpScreen.add(this.htpHeader);

    // Pipe Selection img
    this.helpPipeSelect = this.game.add.sprite(675, -640, 'helpPipeSelect');
    this.helpPipeSelect.anchor.setTo(0.5);
    this.helpPipeSelect.scale.setTo(1);
    this.helpPipeSelect.animations.add('play', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    this.helpPipeSelect.animations.play('play', 3, true);
    helpScreen.add(this.helpPipeSelect);

    // Help Text 1
    this.helpText1 = game.add.text(225, -640, "Select a pipe. ⇨", textStyle);
    this.helpText1.anchor.setTo(0.5);
    this.helpText1.stroke = '#000000';
    this.helpText1.strokeThickness = 5;
    helpScreen.add(this.helpText1);

    // Pipe on grid img
    this.helpPipesToGrid = helpScreen.create(35, -510, 'helpPipesToGrid');
    this.helpPipesToGrid.scale.setTo(1.5);
    this.helpPipesToGrid.animations.add('play');
    this.helpPipesToGrid.animations.play('play', 3, true);
    helpScreen.add(this.helpPipesToGrid);

    // Help Text 2
    this.helpText2 = game.add.text(this.game.width - 50, -510, "⇦ Place it anywhere on   the grid. Connect pipes from start to end...", textStyle);
    this.helpText2.anchor.setTo(1, 0);
    this.helpText2.stroke = '#000000';
    this.helpText2.strokeThickness = 5;
    this.helpText2.align = 'right';
    helpScreen.add(this.helpText2);

    // Health bar img
    this.helpHealthBar = helpScreen.create(this.game.width - 70, -170, 'helpHealthBar');
    this.helpHealthBar.anchor.setTo(1, 0);
    this.helpHealthBar.scale.setTo(1.7, 1.5);
    this.helpHealthBar.animations.add('play');
    this.helpHealthBar.animations.play('play', 3, true);
    helpScreen.add(this.helpHealthBar);

    // Help Text 3
    this.helpText3 = game.add.text(50, -240, "...before your reservoir runs dry. ⇨", textStyle);
    this.helpText3.stroke = '#000000';
    this.helpText3.strokeThickness = 5;
    this.helpText3.align = 'left';
    this.helpText3.wordWrapWidth = 600;
    helpScreen.add(this.helpText3);

    // Sprinkler img
    this.helpObsticle = helpScreen.create(35, -20, 'helpObsticle');
    this.helpObsticle.scale.setTo(1.6);
    this.helpObsticle.animations.add('play');
    this.helpObsticle.animations.play('play', 3, true);
    helpScreen.add(this.helpObsticle);

    // Help Text 4
    this.helpText4 = game.add.text(this.game.width - 50, -20, "⇦ Avoid obsticles -- they'll sap your water!", textStyle);
    this.helpText4.anchor.setTo(1, 0);
    this.helpText4.stroke = '#000000';
    this.helpText4.strokeThickness = 5;
    this.helpText4.align = 'left';
    helpScreen.add(this.helpText4);

    // MORE IF THERE'S ROOM

    // Back button
    this.backButton = helpScreen.create(40, 255, 'backButton');
    this.backButton.scale.setTo(1.7);
    this.backButton.inputEnabled = true;
    this.backButton.events.onInputDown.add(endHelpScreen, this);
    helpScreen.add(this.backButton);

    // More button
    this.moreButton = helpScreen.create(game.world.width - 40, 255, 'moreButton');
    this.moreButton.scale.setTo(1.7);
    this.moreButton.anchor.setTo(1, 0);
    this.moreButton.inputEnabled = true;
    //this.moreButton.events.onInputDown.add(endHelpScreen, this);
    //helpScreen.add(this.moreButton);

    // Screen Border
    this.obsBorder = this.game.add.sprite(this.game.world.centerX, -300, 'borderWindow');
    this.obsBorder.anchor.setTo(0.5);
    this.obsBorder.scale.setTo(2.4, 2.05);
    helpScreen.add(this.obsBorder);

    // Opening screen animation. Auto-plays when game starts
    helpScreen.forEach(function (element) {
      var elementTween = this.game.add.tween(element);
      elementTween.to({ y: element.position.y + 1000 }, 1000, Phaser.Easing.Elastic.Out, true);
      elementTween.start();
    });

    // Exits screen. Plays when continue button is pressed
    function endHelpScreen(sprite, event) {

      // Audio
      SFX_obsScreenButton.play();
      if (musicEnabled == true) {
        game.add.tween(SFX_gameMusic).to({ volume: 0.4 }, 500, Phaser.Easing.Cubic.Out, true).start();
      };

      // Text and Button Tweens
      darkFilterTween = this.game.add.tween(this.darkFilter);
      darkFilterTween.to({ alpha: 0 }, 1500, Phaser.Easing.Cubic.Out, true);

      helpScreen.forEach(function (element) {
        var elementTween = this.game.add.tween(element);
        elementTween.to({ y: element.position.y - 640 }, 700, Phaser.Easing.Back.In, true);
        elementTween.start();
        elementTween.onComplete.add(function () {
          helpScreen.destroy();
        });

      });
      inputEnabled = true;
      sprite.input.enabled = true;
      this.pauseButton.input.enabled = true;
      game.input.onDown.add(delegate, this, 0);
      hpCounter.timer.resume();
      hpBarCounter.timer.resume()
    }
  }
}

function randomTip(sprite, event) {
  var tip = Math.floor(Math.random() * 8);

  switch (tip) {
    case 0:
      return "Did you know water gushes from the average faucet at 9.4 litres per second? " +
        "That\u0027s a lot of H2O swirling down your drain, there. While you\u0027re brushing " +
        "your teeth with one hand, try turning off the faucet with the other. Save some of that " +
        "good stuff for the rest of us!";
    case 1:
      return "What\u0027s that dripping? Why it\u0027s the sound of 19 litres of water being " +
        "wasted every day because somebody didn\u0027t fix a leaky faucet (not pointing any fingers). " +
        "Seriously, people! Fix it yourself or hire a plumber. A racoon plumber!";
    case 2:
      return "You know what plants crave? Exactly! That water you just cooked your pasta in; save it, " +
        "let it cool, and water your plants with it. Just, uh, make sure it\u0027s cooled off first. " +
        "Like, cold. Otherwise, you can say goodbye to your begonias.";
    case 3:
      return "How long does it take to have a shower? I mean, what are you people doing in there!? " +
        "Showers use up 15-19 litres of water per minute, so maybe do your daydreaming somewhere else.";
    case 4:
      return "Did you know that most lawns are overwatered? People are dumping as much as " +
        "340 litres per square foot per year on that thankless green patch in front of their houses. " +
        "Just let it go brown! I mean what did that grass ever do for you?";
    case 5:
      return "You know what uses a lot of water? Power plants and hydro-electric dams! " +
        "If you want to save water on the sly, using less electricity might just be the way to do it.";
    case 6:
      return "It takes a whole lot of water to rear animals for meat, so maybe lay off the beef a little. " +
        "The environment will thank you. The cows will thank you too!";
    case 7:
      return "Ah, the common sprinkler. Beneath its innocent promise of green lawns and summer fun " +
        "lies a dark truth: These things can toss out up to 16 liters/minute!";
    default:
      return "It takes a whole lot of water to rear animals for meat, so maybe lay off the beef a little. " +
        "The environment will thank you. The cows will thank you too!";
  }
}

// Displays win screen
function winScreen() {
  hpCounter.timer.pause();
  hpBarCounter.timer.pause();

  console.log(this);
  // Turns off input to everything but win screen
  hpCounter.timer.pause();
  hpBarCounter.timer.pause();
  inputEnabled = false;
  game.input.onDown.removeAll();

  // Dark Filter Fades In
  this.darkFilter = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'darkFilter');
  this.darkFilter.anchor.setTo(0.5);
  this.darkFilter.scale.setTo(4);
  this.darkFilter.alpha = 0;

  // Group for screen components
  var winScreen = this.game.add.group();

  // Big win header
  this.winHeader = game.add.text(this.game.world.centerX, 400, "VICTORY", {
    font: 'bold 140pt Helvetica',
    fill: 'white',
    align: 'center',
    wordWrap: true,
    wordWrapWidth: 700
  });
  this.winHeader.anchor.setTo(0.5);
  this.winHeader.stroke = '#000000';
  this.winHeader.strokeThickness = 10;
  this.winHeader.alpha = 0;

  // Specifies text properties
  var textStyle = { font: 'bold 60pt Helvetica', fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 850 };

  // Water-saved text
  this.waterSavedDisplay = game.add.text(game.world.centerX + 400, 550, "You saved: " + health + " litres!", textStyle);
  this.waterSavedDisplay.anchor.setTo(0.5);
  this.waterSavedDisplay.lineSpacing = -2;
  this.waterSavedDisplay.addColor('#3d87ff', 11);
  this.waterSavedDisplay.stroke = '#000000';
  this.waterSavedDisplay.strokeThickness = 7;
  winScreen.add(this.waterSavedDisplay);

  // Score text
  this.scoreDisplay = game.add.text(game.world.centerX + 600, 800,
    "That's " + ((health / HP) * 100).toFixed(1) + "% of the average person's daily water usage!", textStyle);
  this.scoreDisplay.anchor.setTo(0.5);
  this.scoreDisplay.lineSpacing = -2;
  this.scoreDisplay.addColor('#3d87ff', 7);
  this.scoreDisplay.addColor('white', 12);
  this.scoreDisplay.stroke = '#000000';
  this.scoreDisplay.strokeThickness = 7;
  winScreen.add(this.scoreDisplay);

  // Continue (to next level) button -- doesn't do anything yet
  this.contButton = winScreen.create(this.game.world.centerX + 800, 1050, 'continueButton');
  this.contButton.anchor.setTo(0.5);
  this.contButton.scale.setTo(2.3);

  this.contButton.inputEnabled = true;

  this.contButton.events.onInputDown.add(function () {
    winScreen.destroy();
    this.winHeader.destroy();
    submitScreen();
  });
  // this.contButton.events.onInputDown.add(function () {
  //   inputEnabled = true;
  //   sprite.input.enabled = true;
  //   game.input.onDown.add(delegate, this, 0);
  //   winScreen.destroy();
  // });

  // Restart button (If we have multiple levels, maybe remove this?)
  this.restartButton = winScreen.create(this.game.world.centerX + 1000, 1200, 'restart');
  this.restartButton.anchor.setTo(0.5);
  this.restartButton.scale.setTo(2.3);
  this.restartButton.inputEnabled = true;
  this.restartButton.events.onInputDown.add(function () {
    clearPipes();
    console.log(this);
    restartLightflash();
    SFX_reset.play();
    inputEnabled = true;
    game.input.onDown.add(delegate, this, 0);
    hpBar.frame = hpBar.animations.frameTotal;
    health = HP;
    canPlace = true;
    hpCounter.timer.resume();
    hpBarCounter.timer.resume();
    SFX_gameMusic.volume = 0.4;
    this.winHeader.destroy();
    winScreen.destroy();
    this.darkFilter.destroy();
  }, this);

  // White Filter
  this.whiteFilter = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'whiteFilter');
  this.whiteFilter.anchor.setTo(0.5);
  this.whiteFilter.scale.setTo(4);
  this.whiteFilter.alpha = 0;

  // Text and Button Tweens
  darkFilterTween = this.game.add.tween(this.darkFilter);
  darkFilterTween.to({ alpha: 1 }, 1500, Phaser.Easing.Cubic.Out, true);

  victoryTween = this.game.add.tween(this.winHeader);
  victoryTween.to({ alpha: 1 }, 1300, Phaser.Easing.Cubic.Out, true);

  var xMovement = 400;
  winScreen.forEach(function (element) {
    var elementTween = this.game.add.tween(element);
    elementTween.to({ x: element.position.x - xMovement }, 1000, Phaser.Easing.Cubic.Out, true);
    elementTween.start();
    xMovement += 200;
  })
}

// Displays lose screen
function loseScreen() {
  // Turns off input to everything but lose screen
  inputEnabled = false;
  game.input.onDown.removeAll();

  // Dark Filter
  this.darkFilter = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'darkFilter');
  this.darkFilter.anchor.setTo(0.5);
  this.darkFilter.scale.setTo(4);
  this.darkFilter.alpha = 1;

  // Group for screen components
  var loseScreen = this.game.add.group();

  // Big lose header
  this.loseHeader = game.add.text(this.game.world.centerX, 400, "DEFEAT", {
    font: 'bold 140pt Helvetica',
    fill: 'white',
    align: 'center',
    wordWrap: true,
    wordWrapWidth: 700
  });
  this.loseHeader.anchor.setTo(0.5);
  this.loseHeader.stroke = '#000000';
  this.loseHeader.strokeThickness = 10;
  this.loseHeader.alpha = 0;

  // Specifies text properties
  var textStyle = { font: 'bold 70pt Helvetica', fill: 'red', align: 'center', wordWrap: true, wordWrapWidth: 550 };

  // Water-Saved text
  this.sadText = game.add.text(game.world.centerX, 730, "The water!! NOOOOOOOOO", textStyle);
  this.sadText.lineSpacing = -7;
  this.sadText.anchor.setTo(0.5);
  this.sadText.stroke = '#000000';
  this.sadText.strokeThickness = 7;
  loseScreen.add(this.sadText);

  // Menu Button
  this.menuButton = loseScreen.create(this.game.world.centerX, 1050, 'menuButton');
  this.menuButton.anchor.setTo(0.5);
  this.menuButton.scale.setTo(2.3);
  this.menuButton.inputEnabled = true;
  this.menuButton.events.onInputDown.add(function () {
    window.location.replace('/reservoir-rescue/Project/reservoir_rescue');
  })
  /*
  this.contButton.inputEnabled = true;
  this.contButton.events.onInputDown.add(function () {
    input_Enabled = true;
    sprite.input.enabled = tmenu
    game.input.onDown.add(delegate, this, 0);
    loseScreen.destroy();
  });
  */

  // Restart button
  this.restartButton = loseScreen.create(this.game.world.centerX, 1200, 'restart');
  this.restartButton.anchor.setTo(0.5);
  this.restartButton.scale.setTo(2.3);
  this.restartButton.inputEnabled = true;
  this.restartButton.events.onInputDown.add(function () {
    clearPipes();
    restartLightflash();
    SFX_reset.play();
    inputEnabled = true;
    game.input.onDown.add(delegate, this, 0);
    hpBar.frame = hpBar.animations.frameTotal;
    health = HP;
    lose = false;
    canPlace = true;
    hpCounter.timer.resume();
    hpBarCounter.timer.resume();

    this.whiteFilter.alpha = 1;
    whiteFilterTween = this.game.add.tween(this.whiteFilter);
    whiteFilterTween.to({ alpha: 0 }, 1000, Phaser.Easing.Cubic.Out, true);

    SFX_loseSound.stop();
    SFX_gameMusic.resume();

    loseHeader.destroy();
    loseScreen.destroy();
    darkFilter.destroy();
  });

  // White Filter
  this.whiteFilter = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'whiteFilter');
  this.whiteFilter.anchor.setTo(0.5);
  this.whiteFilter.scale.setTo(4);

  // Text and Filter Tweens
  whiteFilterTween = this.game.add.tween(this.whiteFilter);
  whiteFilterTween.to({ alpha: 0 }, 1000, Phaser.Easing.Cubic.Out, true);

  loseTween = this.game.add.tween(this.loseHeader);
  loseTween.to({ alpha: 1 }, 1300, Phaser.Easing.Cubic.Out, true);
}

//Submit score screen
function submitScreen() {

  var textStyle = { font: 'bold 60pt Helvetica', fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 850 };
  var submitGroup = this.game.add.group();

  this.scoreDisplay = game.add.text(game.world.centerX, 550, "Your total score is: " + health + " litres!", textStyle);
  this.scoreDisplay.anchor.setTo(0.5);
  this.scoreDisplay.lineSpacing = -2;
  this.scoreDisplay.addColor('#3d87ff', 20);
  this.scoreDisplay.stroke = '#000000';
  this.scoreDisplay.strokeThickness = 7;
  submitGroup.add(this.scoreDisplay);

  this.nameDisplay = game.add.text(game.world.centerX, 700, "Enter your name:", textStyle);
  this.nameDisplay.anchor.setTo(0.5);
  this.nameDisplay.lineSpacing = -2;
  this.nameDisplay.strokeThickness = 7;
  submitGroup.add(this.nameDisplay)

  var textBox = document.createElement("input");
  var textBoxHeight = game.scale.height / 2 + "px";
  var windowSize = window.matchMedia("(max-width: 700px)");
  console.log(textBoxHeight);
  textBox.setAttribute("type", "text");
  textBox.setAttribute("id", "textBox")
  textBox.style.borderRadius = "15px";
  if (windowSize.matches) {
    textBox.style.marginLeft = "25%";
    console.log("small screen");
  } else {
    textBox.style.marginLeft = "45%";
    console.log("big screen");
  }
  textBox.style.padding = "10px";
  textBox.style.marginTop = textBoxHeight;
  textBox.style.position = "absolute";
  textBox.style.textAlign = "center";
  document.getElementById("gameDiv").appendChild(textBox);


  //Temporary submit button.
  this.submitButton = submitGroup.create(this.game.world.centerX, this.game.world.centerY + 225, 'continueButton');
  this.submitButton.anchor.setTo(0.5);
  this.submitButton.scale.setTo(2.3);

  this.submitButton.inputEnabled = true;

  this.submitButton.events.onInputDown.add(function () {
    var inputScore = health;
    var inputName = document.getElementById("textBox").value;
    console.log(inputScore);
    console.log(inputName);
    $.ajax({
      type: "POST",
      url: "php/Leaderboard_input.php",
      data: "player_name=" + inputName + "&score=" + inputScore,
      success: function (response) {
        console.log("Sent new entry" + testPlayer + testScore);
      }
    });
    document.getElementById("textBox").style.visibility = "hidden";
    submitGroup.destroy();
    sentScreen();
  });
}

//Shows once score is sent
function sentScreen() {

  var textStyle = { font: 'bold 60pt Helvetica', fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 850 };
  var sentGroup = this.game.add.group();

  this.sentDisplay = game.add.text(game.world.centerX, 550, "Score sent!", textStyle);
  this.sentDisplay.anchor.setTo(0.5);
  this.sentDisplay.lineSpacing = -2;

  //returns to main menu
  this.menuButton = sentGroup.create(this.game.world.centerX, this.game.world.centerY, 'menuButton');
  this.menuButton.anchor.setTo(0.5);
  this.menuButton.scale.setTo(2.3);
  this.menuButton.inputEnabled = true;

  this.menuButton.events.onInputDown.add(function () {
    window.location.replace('/reservoir-rescue/Project/reservoir_rescue');
  });

  // goes to leaderboard
  this.leadButton = sentGroup.create(this.game.world.centerX, this.game.world.centerY + 150, 'continueButton');
  this.leadButton.anchor.setTo(0.5);
  this.leadButton.scale.setTo(2.3);
  this.leadButton.inputEnabled = true;

  this.leadButton.events.onInputDown.add(function () {
    window.location.replace('/reservoir-rescue/Project/reservoir_rescue/leaderboard.html');
  });
}