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
      var textStyle = { font: 'bold 40pt Helvetica', fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 850 };

      // Tip text
      this.tipDisplay = game.add.text(this.game.world.centerX, 650,
        "RACCOON TIP:\n" + randomTip(this.tipDisplay, this), textStyle);
      this.tipDisplay.anchor.setTo(0.5);
      this.tipDisplay.lineSpacing = -2;
      this.tipDisplay.addColor('#3d87ff', 0);
      this.tipDisplay.addColor('white', 12);
      this.tipDisplay.stroke = '#000000';
      this.tipDisplay.strokeThickness = 7;
      pauseScreen.add(this.tipDisplay);

      // Continue button
      this.contButton = pauseScreen.create(this.game.world.centerX, 1050, 'continueButton');
      this.contButton.anchor.setTo(0.5);
      this.contButton.scale.setTo(2.3);
      this.contButton.inputEnabled = true;
      this.contButton.events.onInputDown.add(function () {
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
        restartLightflash()
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
        window.location.replace('/reservoir-rescue/Project/reservoir_rescue')});
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

    // Screen BG
    this.obsBorder = this.game.add.sprite(this.game.world.centerX, -300, 'borderWindow');
    this.obsBorder.anchor.setTo(0.5);
    this.obsBorder.scale.setTo(1.9, 2);
    obsScreen.add(this.obsBorder);

    // Opening screen animation. Auto-plays when game starts
    obsScreen.forEach(function (element) {
      var elementTween = this.game.add.tween(element);
      elementTween.to({ y: element.position.y + 1000 }, 1000, Phaser.Easing.Elastic.Out, true);
      elementTween.start();
    });

    // Exits screen. Plays when continue button is pressed
    function endObsScreen(sprite, event) {

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
  
    // this.contButton.inputEnabled = true;
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
        console.log(this);
        restartLightflash();
        inputEnabled = true;
        game.input.onDown.add(delegate, this, 0);
        hpBar.frame = hpBar.animations.frameTotal;
        health = HP;
        canPlace = true;
        hpCounter.timer.resume();
        hpBarCounter.timer.resume();
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
      restartLightflash();
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
  
      loseHeader.destroy();
      loseScreen.destroy();
      darkFilter.destroy();
    })
  
    // White Filter
    this.whiteFilter = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'whiteFilter');
    this.whiteFilter.anchor.setTo(0.5);
    this.whiteFilter.scale.setTo(4);
    
    // Text and Filter Tweens
    whiteFilterTween = this.game.add.tween(this.whiteFilter);
    whiteFilterTween.to({ alpha: 0 }, 4500, Phaser.Easing.Cubic.Out, true);
  
    loseTween = this.game.add.tween(this.loseHeader);
    loseTween.to({ alpha: 1 }, 1300, Phaser.Easing.Cubic.Out, true);
  }