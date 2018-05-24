
const dailyAverage = 440;
const BUTTON_SCALE = 1.2;
const BUTTON_SCALE_LARGE = 1.5;
const BUTTON_SCALE_SMALL = 1.0;
var yMod = 0;
var obsScreenActive = true;
var audioCreated = false;

let whiteFilter;
let whiteFilterTween;
let darkFilter;
let darkFilterTween;
let victoryTween;
let winScreenGroup;
let winHeader;
let loseScreenGroup;
let pauseScreenGroup;
let pauseHeader;
let textStyle;
let tipDisplay;
let contButton;
let restartButton;
let menuButton;
let scoreDisplay;
let waterSavedDisplay;
let obsSprink;
let obsTextSprink;
let obsTextSprinkBLine;

function pauseMenu(sprite, event) {
  hpCounter.timer.pause();
  hpBarCounter.timer.pause();

  if (inputEnabled === true) {
    // Turns off input to everything but pause screen
    inputEnabled = false;
    sprite.input.enabled = false;
    game.input.onDown.removeAll();

    // Dark filter
    darkFilter = game.add.sprite(game.world.centerX, game.world.centerY, 'darkFilter');
    darkFilter.anchor.setTo(0.5);
    darkFilter.scale.setTo(4);

    // Group for screen componenets
    pauseScreenGroup = game.add.group();

    // Big pause header
    pauseHeader = game.add.text(game.world.centerX, 200, "PAUSED", {
      font: 'bold 100pt Helvetica',
      fill: 'white',
      align: 'center',
      wordWrap: true,
      wordWrapWidth: 700
    });
    pauseHeader.anchor.setTo(0.5);
    pauseHeader.stroke = '#000000';
    pauseHeader.strokeThickness = 7;
    pauseScreenGroup.add(pauseHeader);

    // Specifies text properties
    textStyle = { font: 'bold 40pt Helvetica', fontSize: 52, fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 850 };

    // Tip text
    tipDisplay = game.add.text(game.world.centerX, 650,
      "WATER SAVING TIP:\n" + randomTip(tipDisplay, this), textStyle);
    tipDisplay.anchor.setTo(0.5);
    tipDisplay.lineSpacing = -2;
    tipDisplay.addColor('#3d87ff', 0);
    tipDisplay.addColor('white', 17);
    tipDisplay.stroke = '#000000';
    tipDisplay.strokeThickness = 7;
    pauseScreenGroup.add(tipDisplay);

    // Continue button
    contButton = pauseScreenGroup.create(game.world.centerX, 1050, 'continueButton');
    contButton.anchor.setTo(0.5);
    contButton.scale.setTo(BUTTON_SCALE_LARGE);
    contButton.inputEnabled = true;
    contButton.events.onInputDown.add(function () {
      SFX_gameMusic.volume = 0.4;
      inputEnabled = true;
      sprite.input.enabled = true;
      game.input.onDown.add(delegate, this, 0);
      hpCounter.timer.resume();
      hpBarCounter.timer.resume();
      pauseScreenGroup.destroy();
      darkFilter.destroy();
    });

    // Restart button
    restartButton = pauseScreenGroup.create(game.world.centerX, 1200, 'restart');
    restartButton.anchor.setTo(0.5);
    restartButton.scale.setTo(BUTTON_SCALE_LARGE);
    restartButton.inputEnabled = true;
    restartButton.events.onInputDown.add(function () {
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
      pauseScreenGroup.destroy();
      darkFilter.destroy();
    });

    // Menu button
    menuButton = pauseScreenGroup.create(game.world.centerX, 1350, 'menuButton');
    menuButton.anchor.setTo(0.5);
    menuButton.scale.setTo(BUTTON_SCALE_LARGE);
    menuButton.inputEnabled = true;
    menuButton.events.onInputDown.add(function () {
      window.location.replace('/reservoir-rescue/Project/reservoir_rescue')
    });
  }
}

function obsScreen1(sprite, event) {


  // Prevents input to anything but obs screen
  inputEnabled = false;
  game.input.onDown.removeAll();

  // Dark Filter
  darkFilter = game.add.sprite(game.world.centerX, game.world.centerY, 'darkFilter');
  darkFilter.anchor.setTo(0.5);
  darkFilter.scale.setTo(4);
  darkFilter.alpha = 1;

  // Group for screen componenets
  var obsScreen = game.add.group();

  // Picture of a sprinkler
  this.obsSprink = this.game.add.sprite(this.game.world.centerX, -650 + yMod, 'sprinkler');
  this.obsSprink.anchor.setTo(0.5);
  this.obsSprink.scale.setTo(8);
  this.obsSprink.animations.add('play');
  this.obsSprink.animations.play('play', 3, true);
  obsScreen.add(this.obsSprink);

  // "Look out!" header
  this.lookOutHeader = game.add.text(this.game.world.centerX, -450 + yMod, "LOOK OUT!", { font: 'bold 80pt Helvetica', fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 700 });
  this.lookOutHeader.anchor.setTo(0.5);
  this.lookOutHeader.stroke = '#000000';
  this.lookOutHeader.strokeThickness = 5;
  obsScreen.add(this.lookOutHeader);

  // Obstacle text
  this.obsTextSprink = game.add.text(this.game.world.centerX, -300 + yMod, "Sprinklers waste 16 litres of water per minute!", { font: 'bold 42pt Helvetica', fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 700 });
  this.obsTextSprink.addColor('#3d87ff', 17);
  this.obsTextSprink.addColor('white', 26);
  this.obsTextSprink.anchor.setTo(0.5);
  this.obsTextSprink.stroke = '#000000';
  this.obsTextSprink.strokeThickness = 5;
  obsScreen.add(this.obsTextSprink);

  // Obstacle text bottom line
  this.obsTextSprinkBLine = game.add.text(this.game.world.centerX, -152 + yMod, "Better keep our pipes clear!", { font: 'bold 42pt Helvetica', fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 700 });
  this.obsTextSprinkBLine.anchor.setTo(0.5);
  this.obsTextSprinkBLine.stroke = '#000000';
  this.obsTextSprinkBLine.strokeThickness = 5;
  obsScreen.add(this.obsTextSprinkBLine);

  // Continue button
  this.contButton = obsScreen.create(this.game.world.centerX, 57 + yMod, 'continueButton');
  this.contButton.anchor.setTo(0.5);
  this.contButton.scale.setTo(BUTTON_SCALE);
  this.contButton.inputEnabled = true;
  this.contButton.events.onInputDown.add(endObsScreen, this);

  // How To Play button
  this.howToPlayButton = obsScreen.create(game.world.centerX, 180 + yMod, 'howToPlayButton');
  this.howToPlayButton.anchor.setTo(0.5);
  this.howToPlayButton.scale.setTo(BUTTON_SCALE);
  this.howToPlayButton.inputEnabled = true;
  this.howToPlayButton.events.onInputDown.add(function () {
    if (!audioCreated) {
      createAudio();
      audioCreated = false;
    }
    SFX_regularButton.play();
  });
  this.howToPlayButton.events.onInputDown.add(transitionToHelpScreen, this);


  // Screen BG
  obsBorder = game.add.sprite(game.world.centerX, -300 + yMod, 'borderWindow');
  obsBorder.anchor.setTo(0.5);
  obsBorder.scale.setTo(2, 2.1);
  obsScreen.add(obsBorder);

  if (yMod === 0) {
    // Opening screen animation. Auto-plays when game starts
    obsScreen.forEach(function (element) {
      var elementTween = game.add.tween(element);
      elementTween.to({ y: element.position.y + 1000 }, 1000, Phaser.Easing.Elastic.Out, true);
      elementTween.start();
    });
  }

  function transitionToHelpScreen() {
    obsScreen.destroy();
    obsBorder = game.add.sprite(game.world.centerX, 700, 'borderWindow');
    obsBorder.anchor.setTo(0.5);
    obsBorder.scale.setTo(2, 2.1);
    game.add.tween(obsBorder.scale).to({ x: 2.4, y: 2.05 }, 500, Phaser.Easing.Cubic.Out, true).onComplete.add(function () {
      obsBorder.destroy();
      darkFilter.destroy();
      helpScreen();
    })
  }

  // Exits screen. Plays when continue button is pressed
  function endObsScreen(sprite, event) {

    // Audio
    if (!audioCreated) {
      createAudio();
      audioCreated = true;
    }

    game.sound.context.resume();
    SFX_obsScreenSwooshOut.play();
    SFX_obsScreenButton.play();
    SFX_obsScreenSwooshOut.onStop.addOnce(function () {
      if (musicEnabled == true) {
        SFX_gameMusic.play();
      }
    });

    darkFilterTween = game.add.tween(darkFilter);
    darkFilterTween.to({ alpha: 0 }, 1000, Phaser.Easing.Cubic.Out, true);

    obsScreen.forEach(function (element) {
      var elementTween = game.add.tween(element);
      elementTween.to({ y: element.position.y - 640 }, 700, Phaser.Easing.Back.In, true);
      elementTween.start();
      elementTween.onComplete.add(function () {
        obsScreen.destroy();
      });

    });
    inputEnabled = true;
    yMod = 0;
    game.input.onDown.add(delegate, this, 0);
    game.time.events.add(DELAY, startTimers, this);
    obsScreenActive = false;
  }
}

function obsScreen2(sprite, event) {

  // Prevents input to anything but obs screen
  inputEnabled = false;
  game.input.onDown.removeAll();

  // Dark Filter
  darkFilter = game.add.sprite(game.world.centerX, game.world.centerY, 'darkFilter');
  darkFilter.anchor.setTo(0.5);
  darkFilter.scale.setTo(4);
  darkFilter.alpha = 1;

  // Group for screen componenets
  var obsScreen = game.add.group();

  // Picture of a sink
  this.obsSprink = this.game.add.sprite(this.game.world.centerX, 350 + yMod, 'sink');
  this.obsSprink.anchor.setTo(0.5);
  this.obsSprink.scale.setTo(8);
  this.obsSprink.animations.add('play');
  this.obsSprink.animations.play('play', 3, true);
  obsScreen.add(this.obsSprink);

  // "Holy Moly!!" header
  this.lookOutHeader = game.add.text(this.game.world.centerX, 550 + yMod, "HOLY MOLY!", { font: 'bold 80pt Helvetica', fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 700 });
  this.lookOutHeader.anchor.setTo(0.5);
  this.lookOutHeader.stroke = '#000000';
  this.lookOutHeader.strokeThickness = 5;
  obsScreen.add(this.lookOutHeader);

  // Obstacle text
  this.obsTextSprink = game.add.text(this.game.world.centerX, 800 + yMod, "Leaving the washroom sink running consumes 5 litres of water per minute! Don’t do it!!", { font: 'bold 42pt Helvetica', fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 650 });
  this.obsTextSprink.addColor('#3d87ff', 42);
  this.obsTextSprink.addColor('white', 52);
  this.obsTextSprink.anchor.setTo(0.5);
  this.obsTextSprink.stroke = '#000000';
  this.obsTextSprink.strokeThickness = 5;
  obsScreen.add(this.obsTextSprink);

  // Continue button
  this.contButton = obsScreen.create(this.game.world.centerX, 1070 + yMod, 'continueButton');
  this.contButton.anchor.setTo(0.5);
  this.contButton.scale.setTo(BUTTON_SCALE);
  this.contButton.inputEnabled = true;
  this.contButton.events.onInputDown.add(endObsScreen, this);

  // Screen BG
  obsBorder = game.add.sprite(game.world.centerX, 700 + yMod, 'borderWindow');
  obsBorder.anchor.setTo(0.5);
  obsBorder.scale.setTo(2, 2.1);
  obsScreen.add(obsBorder);

  // Exits screen. Plays when continue button is pressed
  function endObsScreen(sprite, event) {

    SFX_obsScreenSwooshOut.play();
    SFX_obsScreenButton.play();
    SFX_gameMusic.volume = 0.4;

    darkFilterTween = game.add.tween(darkFilter);
    darkFilterTween.to({ alpha: 0 }, 1000, Phaser.Easing.Cubic.Out, true);

    obsScreen.forEach(function (element) {
      var elementTween = game.add.tween(element);
      elementTween.to({ y: element.position.y - 640 }, 700, Phaser.Easing.Back.In, true);
      elementTween.start();
      elementTween.onComplete.add(function () {
        obsScreen.destroy();
      });

    });
    inputEnabled = true;
    yMod = 0;
    game.input.onDown.add(delegate, this, 0);
    game.time.events.add(DELAY, startTimers, this);
    obsScreenActive = false;
  }
}

function obsScreen3(sprite, event) {

  // Prevents input to anything but obs screen
  inputEnabled = false;
  game.input.onDown.removeAll();

  // Dark Filter
  darkFilter = game.add.sprite(game.world.centerX, game.world.centerY, 'darkFilter');
  darkFilter.anchor.setTo(0.5);
  darkFilter.scale.setTo(4);
  darkFilter.alpha = 1;

  // Group for screen componenets
  var obsScreen = game.add.group();

  // Picture of a toilet
  this.obsSprink = this.game.add.sprite(this.game.world.centerX, 350 + yMod, 'toilet');
  this.obsSprink.anchor.setTo(0.5);
  this.obsSprink.scale.setTo(8);
  this.obsSprink.animations.add('play');
  this.obsSprink.animations.play('play', 3, true);
  obsScreen.add(this.obsSprink);

  // "Look out!" header
  this.lookOutHeader = game.add.text(this.game.world.centerX, 550 + yMod, "GADZOOKS!", { font: 'bold 80pt Helvetica', fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 700 });
  this.lookOutHeader.anchor.setTo(0.5);
  this.lookOutHeader.stroke = '#000000';
  this.lookOutHeader.strokeThickness = 5;
  obsScreen.add(this.lookOutHeader);

  // Obstacle text
  this.obsTextSprink = game.add.text(this.game.world.centerX, 800 + yMod, "Toilets use up 12 litres of water per flush. That can add up to 21,900 litres per year!", { font: 'bold 42pt Helvetica', fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 650 });
  this.obsTextSprink.addColor('#3d87ff', 14);
  this.obsTextSprink.addColor('white', 25);
  this.obsTextSprink.addColor('#3d87ff', 63);
  this.obsTextSprink.addColor('white', 78);
  this.obsTextSprink.anchor.setTo(0.5);
  this.obsTextSprink.stroke = '#000000';
  this.obsTextSprink.strokeThickness = 5;
  obsScreen.add(this.obsTextSprink);

  // Continue button
  this.contButton = obsScreen.create(this.game.world.centerX, 1070 + yMod, 'continueButton');
  this.contButton.anchor.setTo(0.5);
  this.contButton.scale.setTo(BUTTON_SCALE);
  this.contButton.inputEnabled = true;
  this.contButton.events.onInputDown.add(endObsScreen, this);

  // Screen BG
  obsBorder = game.add.sprite(game.world.centerX, 700 + yMod, 'borderWindow');
  obsBorder.anchor.setTo(0.5);
  obsBorder.scale.setTo(2, 2.1);
  obsScreen.add(obsBorder);

  // Exits screen. Plays when continue button is pressed
  function endObsScreen(sprite, event) {

    SFX_obsScreenSwooshOut.play();
    SFX_obsScreenButton.play();
    SFX_gameMusic.volume = 0.4;

    darkFilterTween = game.add.tween(darkFilter);
    darkFilterTween.to({ alpha: 0 }, 1000, Phaser.Easing.Cubic.Out, true);

    obsScreen.forEach(function (element) {
      var elementTween = game.add.tween(element);
      elementTween.to({ y: element.position.y - 640 }, 700, Phaser.Easing.Back.In, true);
      elementTween.start();
      elementTween.onComplete.add(function () {
        obsScreen.destroy();
      });

    });
    inputEnabled = true;
    yMod = 0;
    game.input.onDown.add(delegate, this, 0);
    game.time.events.add(DELAY, startTimers, this);
    obsScreenActive = false;
  }
}

function obsScreen4(sprite, event) {

  // Prevents input to anything but obs screen
  inputEnabled = false;
  game.input.onDown.removeAll();

  // Dark Filter
  darkFilter = game.add.sprite(game.world.centerX, game.world.centerY, 'darkFilter');
  darkFilter.anchor.setTo(0.5);
  darkFilter.scale.setTo(4);
  darkFilter.alpha = 1;

  // Group for screen componenets
  var obsScreen = game.add.group();

  // Picture of a washing machine
  this.obsSprink = this.game.add.sprite(this.game.world.centerX, 350 + yMod, 'washing_machine');
  this.obsSprink.anchor.setTo(0.5);
  this.obsSprink.scale.setTo(8);
  this.obsSprink.animations.add('play');
  this.obsSprink.animations.play('play', 3, true);
  obsScreen.add(this.obsSprink);

  // "Look out!" header
  this.lookOutHeader = game.add.text(this.game.world.centerX, 550 + yMod, "OMG!!", { font: 'bold 80pt Helvetica', fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 700 });
  this.lookOutHeader.anchor.setTo(0.5);
  this.lookOutHeader.stroke = '#000000';
  this.lookOutHeader.strokeThickness = 5;
  obsScreen.add(this.lookOutHeader);

  // Obstacle text
  this.obsTextSprink = game.add.text(this.game.world.centerX, 850 + yMod, "Washing machines can squander 60 – 150 litres of water each load! How clean do you need to your clothes to be?! Just turn your socks inside out!", { font: 'bold 42pt Helvetica', fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 700 });
  this.obsTextSprink.addColor('#3d87ff', 29);
  this.obsTextSprink.addColor('white', 46);
  this.obsTextSprink.anchor.setTo(0.5);
  this.obsTextSprink.stroke = '#000000';
  this.obsTextSprink.strokeThickness = 5;
  obsScreen.add(this.obsTextSprink);

  // Continue button
  this.contButton = obsScreen.create(this.game.world.centerX, 1200 + yMod, 'continueButton');
  this.contButton.anchor.setTo(0.5);
  this.contButton.scale.setTo(BUTTON_SCALE);
  this.contButton.inputEnabled = true;
  this.contButton.events.onInputDown.add(endObsScreen, this);

  // Screen BG
  obsBorder = game.add.sprite(game.world.centerX, 700 + yMod, 'borderWindow');
  obsBorder.anchor.setTo(0.5);
  obsBorder.scale.setTo(2, 2.1);
  obsScreen.add(obsBorder);

  // Exits screen. Plays when continue button is pressed
  function endObsScreen(sprite, event) {

    SFX_obsScreenSwooshOut.play();
    SFX_obsScreenButton.play();
    SFX_gameMusic.volume = 0.4;

    darkFilterTween = game.add.tween(darkFilter);
    darkFilterTween.to({ alpha: 0 }, 1000, Phaser.Easing.Cubic.Out, true);

    obsScreen.forEach(function (element) {
      var elementTween = game.add.tween(element);
      elementTween.to({ y: element.position.y - 640 }, 700, Phaser.Easing.Back.In, true);
      elementTween.start();
      elementTween.onComplete.add(function () {
        obsScreen.destroy();
      });

    });
    inputEnabled = true;
    yMod = 0;
    game.input.onDown.add(delegate, this, 0);
    game.time.events.add(DELAY, startTimers, this);
    obsScreenActive = false;
  }
}

function obsScreen5(sprite, event) {

  // Prevents input to anything but obs screen
  inputEnabled = false;
  game.input.onDown.removeAll();

  // Dark Filter
  darkFilter = game.add.sprite(game.world.centerX, game.world.centerY, 'darkFilter');
  darkFilter.anchor.setTo(0.5);
  darkFilter.scale.setTo(4);
  darkFilter.alpha = 1;

  // Group for screen componenets
  var obsScreen = game.add.group();

  // Picture of a sprinkler
  this.obsSprink = this.game.add.sprite(this.game.world.centerX, 350 + yMod, 'shower');
  this.obsSprink.anchor.setTo(0.5);
  this.obsSprink.scale.setTo(8);
  this.obsSprink.animations.add('play');
  this.obsSprink.animations.play('play', 3, true);
  obsScreen.add(this.obsSprink);

  // "Look out!" header
  this.lookOutHeader = game.add.text(this.game.world.centerX, 550 + yMod, "PANIC!!", { font: 'bold 80pt Helvetica', fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 700 });
  this.lookOutHeader.anchor.setTo(0.5);
  this.lookOutHeader.stroke = '#000000';
  this.lookOutHeader.strokeThickness = 5;
  obsScreen.add(this.lookOutHeader);

  // Obstacle text
  this.obsTextSprink = game.add.text(this.game.world.centerX, 900 + yMod, "Showers annihilate up to 15 litres of water per minute. They destroy our water supply and make orphans cry. You must stop thier campaign of terror before it’s too late!", { font: 'bold 42pt Helvetica', fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 750 });
  this.obsTextSprink.addColor('#3d87ff', 24);
  this.obsTextSprink.addColor('white', 35);
  this.obsTextSprink.addColor('red', 147);
  this.obsTextSprink.anchor.setTo(0.5);
  this.obsTextSprink.stroke = '#000000';
  this.obsTextSprink.strokeThickness = 5;
  obsScreen.add(this.obsTextSprink);

  // Continue button
  this.contButton = obsScreen.create(this.game.world.centerX, 1250 + yMod, 'continueButton');
  this.contButton.anchor.setTo(0.5);
  this.contButton.scale.setTo(BUTTON_SCALE);
  this.contButton.inputEnabled = true;
  this.contButton.events.onInputDown.add(endObsScreen, this);

  // Screen BG
  obsBorder = game.add.sprite(game.world.centerX, 700 + yMod, 'borderWindow');
  obsBorder.anchor.setTo(0.5);
  obsBorder.scale.setTo(2, 2.1);
  obsScreen.add(obsBorder);

  // Exits screen. Plays when continue button is pressed
  function endObsScreen(sprite, event) {

    SFX_obsScreenSwooshOut.play();
    SFX_obsScreenButton.play();
    SFX_gameMusic.volume = 0.4;

    darkFilterTween = game.add.tween(darkFilter);
    darkFilterTween.to({ alpha: 0 }, 1000, Phaser.Easing.Cubic.Out, true);

    obsScreen.forEach(function (element) {
      var elementTween = game.add.tween(element);
      elementTween.to({ y: element.position.y - 640 }, 700, Phaser.Easing.Back.In, true);
      elementTween.start();
      elementTween.onComplete.add(function () {
        obsScreen.destroy();
      });

    });
    inputEnabled = true;
    yMod = 0;
    game.input.onDown.add(delegate, this, 0);
    game.time.events.add(DELAY, startTimers, this);
    obsScreenActive = false;
  }
}

function helpScreen(sprite, event) {

  // Dark Filter
  helpDarkFilter = game.add.sprite(game.world.centerX, game.world.centerY, 'darkFilter');
  helpDarkFilter.anchor.setTo(0.5);
  helpDarkFilter.scale.setTo(4);
  helpDarkFilter.alpha = 1;

  // Tween Dark Filter in
  helpDarkFilterTween = game.add.tween(helpDarkFilter);
  helpDarkFilterTween.to({ alpha: 1 }, 500, Phaser.Easing.Cubic.Out, true);

  if (inputEnabled === true) {
    inputEnabled = false;
    game.input.onDown.removeAll();
  }

  // Group for screen componenets
  var helpScreen = game.add.group();

  var textStyle = { font: 'bold 40pt Helvetica', fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 620 };

  if (obsScreenActive) {
    // Screen Border
    yMod = 1000;
    createHelp1();
  } else {
    hpCounter.timer.pause();
    hpBarCounter.timer.pause();
    game.add.tween(SFX_gameMusic).to({ volume: 0.1 }, 500, Phaser.Easing.Cubic.Out, true).start();
    createHelp1();
    SFX_obsScreenSwooshIn.play();

    // Opening screen animation. Auto-plays when game starts
    helpScreen.forEach(function (element) {
      var elementTween = game.add.tween(element);
      elementTween.to({ y: element.position.y + 1000 }, 1000, Phaser.Easing.Elastic.Out, true);
      elementTween.start();
    });

    yMod = 1000;
  }

  function createHelp1() {

    obsBorder = game.add.sprite(game.world.centerX, -300 + yMod, 'borderWindow');
    obsBorder.anchor.setTo(0.5);
    obsBorder.scale.setTo(2.4, 2.05);
    helpScreen.add(obsBorder);

    // "How To Play" header
    htpHeader = game.add.text(game.world.centerX, -825 + yMod, "How To Play", { font: 'bold 70pt Helvetica', fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 700 });
    htpHeader.anchor.setTo(0.5);
    htpHeader.stroke = '#000000';
    htpHeader.strokeThickness = 5;
    helpScreen.add(htpHeader);

    // Pipe Selection img
    helpPipeSelect = game.add.sprite(675, -640 + yMod, 'helpPipeSelect');
    helpPipeSelect.anchor.setTo(0.5);
    helpPipeSelect.scale.setTo(1);
    helpPipeSelect.animations.add('play', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    helpPipeSelect.animations.play('play', 3, true);
    helpScreen.add(helpPipeSelect);

    // Help Text 1
    helpText1 = game.add.text(225, -640 + yMod, "Select a pipe. ⇨", textStyle);
    helpText1.anchor.setTo(0.5);
    helpText1.stroke = '#000000';
    helpText1.strokeThickness = 5;
    helpScreen.add(helpText1);

    // Pipe on grid img
    helpPipesToGrid = helpScreen.create(35, -510 + yMod, 'helpPipesToGrid');
    helpPipesToGrid.scale.setTo(1.5);
    helpPipesToGrid.animations.add('play');
    helpPipesToGrid.animations.play('play', 3, true);
    helpScreen.add(helpPipesToGrid);

    // Help Text 2
    helpText2 = game.add.text(game.width - 50, -510 + yMod, "⇦ Place it anywhere on   the grid. Connect pipes from start to end...", textStyle);
    helpText2.anchor.setTo(1, 0);
    helpText2.stroke = '#000000';
    helpText2.strokeThickness = 5;
    helpText2.align = 'right';
    helpScreen.add(helpText2);

    // Health bar img
    helpHealthBar = helpScreen.create(game.width - 70, -170 + yMod, 'helpHealthBar');
    helpHealthBar.anchor.setTo(1, 0);
    helpHealthBar.scale.setTo(1.7, 1.5);
    helpHealthBar.animations.add('play');
    helpHealthBar.animations.play('play', 3, true);
    helpScreen.add(helpHealthBar);

    // Help Text 3
    helpText3 = game.add.text(50, -240 + yMod, "...before your reservoir runs dry. ⇨", textStyle);
    helpText3.stroke = '#000000';
    helpText3.strokeThickness = 5;
    helpText3.align = 'left';
    helpText3.wordWrapWidth = 600;
    helpScreen.add(helpText3);

    // Sprinkler img
    helpObsticle = helpScreen.create(35, -20 + yMod, 'helpObsticle');
    helpObsticle.scale.setTo(1.6);
    helpObsticle.animations.add('play');
    helpObsticle.animations.play('play', 3, true);
    helpScreen.add(helpObsticle);

    // Help Text 4
    helpText4 = game.add.text(game.width - 50, -20 + yMod, "⇦ Avoid obstacles -- they'll sap your water!", textStyle);
    helpText4.anchor.setTo(1, 0);
    helpText4.stroke = '#000000';
    helpText4.strokeThickness = 5;
    helpText4.align = 'left';
    helpScreen.add(helpText4);

    // Back button
    backButton = helpScreen.create(40, 255 + yMod, 'backButton');
    backButton.scale.setTo(BUTTON_SCALE_SMALL);
    backButton.inputEnabled = true;
    if (obsScreenActive) {
      backButton.events.onInputDown.add(function () {
        SFX_regularButton.play();
      });
    }
    backButton.events.onInputDown.add(endHelpScreen, this);
    helpScreen.add(backButton);

    // More button
    moreButton = helpScreen.create(game.world.width - 40, 255 + yMod, 'moreButton');
    moreButton.scale.setTo(BUTTON_SCALE_SMALL);
    moreButton.anchor.setTo(1, 0);
    moreButton.inputEnabled = true;
    moreButton.events.onInputDown.add(function () {
      SFX_regularButton.play();
    });
    moreButton.events.onInputDown.add(showHelp2, this);
    helpScreen.add(moreButton);
  }

  function createHelp2() {

    // Pipe Swap img
    helpPipeSwap = game.add.sprite(game.width - 70, 340, 'helpPipeSwap');
    helpPipeSwap.anchor.setTo(1, 0);
    helpPipeSwap.scale.setTo(1.5);
    helpPipeSwap.animations.add('play');
    helpPipeSwap.animations.play('play', 3, true);
    helpScreen.add(helpPipeSwap);

    // Help Text 5
    helpText5 = game.add.text(70, 370, "Swap a pipe on the field by clicking on it. ⇨", textStyle);
    helpText5.stroke = '#000000';
    helpText5.strokeThickness = 5;
    helpText5.align = 'left';
    helpText5.wordWrapWidth = 450;
    helpScreen.add(helpText5);

    // Temp img
    helpTemp = helpScreen.create(game.world.centerX, 1145, 'helpTemp');
    helpTemp.anchor.setTo(0.5);
    helpTemp.scale.setTo(2);
    helpScreen.add(helpTemp);

    // Help Text 6
    helpText6 = game.add.text(game.world.centerX, 900, "The temperature where you live influences how fast obstacles drain your water. BEWARE THE HEAT!", textStyle);
    helpText6.anchor.setTo(0.5);
    helpText6.fontSize = 50;
    helpText6.stroke = '#000000';
    helpText6.strokeThickness = 5;
    helpText6.wordWrapWidth = 850;
    helpScreen.add(helpText6);

    // Help Text 7
    helpText7 = game.add.text(game.world.centerX, 1040, "⇩", textStyle);
    helpText7.anchor.setTo(0.5);
    helpText7.stroke = '#000000';
    helpText7.strokeThickness = 5;
    helpScreen.add(helpText7);

    // Back button
    backButton = helpScreen.create(40, 255 + yMod, 'backButton');
    backButton.scale.setTo(BUTTON_SCALE_SMALL);
    backButton.inputEnabled = true;
    backButton.events.onInputDown.add(showHelp1, this);
    helpScreen.add(backButton);
  }

  function showHelp1() {
    SFX_regularButton.play();
    destroyHelp2();
    createHelp1();
  }

  function showHelp2() {
    destroyHelp1();
    createHelp2();
  }

  function destroyHelp1() {
    helpPipeSelect.destroy();
    helpText1.destroy();
    helpPipesToGrid.destroy();
    helpText2.destroy();
    helpHealthBar.destroy();
    helpText3.destroy();
    helpObsticle.destroy();
    helpText4.destroy();
    backButton.destroy();
    moreButton.destroy();
  }

  function destroyHelp2() {
    helpPipeSwap.destroy();
    helpText5.destroy();
    helpTemp.destroy();
    helpText6.destroy();
  }

  // Exits screen. Plays when back button is pressed
  function endHelpScreen(sprite, event) {

    if (obsScreenActive) {
      helpScreen.destroy();

      // Screen BG
      obsBorder = game.add.sprite(game.world.centerX, -300 + yMod, 'borderWindow');
      obsBorder.anchor.setTo(0.5);
      obsBorder.scale.setTo(2.4, 2.05);
      game.add.tween(obsBorder.scale).to({ x: 2, y: 2.1 }, 500, Phaser.Easing.Cubic.Out, true).onComplete.add(function () {
        obsBorder.destroy();
        helpDarkFilter.destroy();
        obsScreen1();
      })

    } else {

      // Audio
      SFX_obsScreenButton.play();
      SFX_obsScreenSwooshOut.play();
      if (musicEnabled == true) {
        game.add.tween(SFX_gameMusic).to({ volume: 0.4 }, 500, Phaser.Easing.Cubic.Out, true).start();
      };

      // Text and Button Tweens
      helpDarkFilterTween.to({ alpha: 0 }, 500, Phaser.Easing.Cubic.Out, true);
      helpDarkFilterTween.onComplete.add(function (helpDarkFilter) {
        helpDarkFilter.destroy();
      })

      helpScreen.forEach(function (element) {
        var elementTween = game.add.tween(element);
        elementTween.to({ y: element.position.y - 640 }, 700, Phaser.Easing.Back.In, true);
        elementTween.start();
        elementTween.onComplete.add(function () {
          helpScreen.destroy();
        });

      });
      inputEnabled = true;
      sprite.input.enabled = true;
      game.input.onDown.add(delegate, this, 0);
      hpCounter.timer.resume();
      hpBarCounter.timer.resume()
      yMod = 0;
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
  // Turns off input to everything but win screen
  inputEnabled = false;
  game.input.onDown.removeAll();

  // Dark Filter Fades In
  darkFilter = game.add.sprite(game.world.centerX, game.world.centerY, 'darkFilter');
  darkFilter.anchor.setTo(0.5);
  darkFilter.scale.setTo(4);
  darkFilter.alpha = 0;

  // Group for screen components
  winScreenGroup = game.add.group();

  // Big win header
  winHeader = game.add.text(game.world.centerX, 300, "VICTORY", {
    font: 'bold 140pt Helvetica',
    fill: 'white',
    align: 'center',
    wordWrap: true,
    wordWrapWidth: 700
  });
  winHeader.anchor.setTo(0.5);
  winHeader.stroke = '#000000';
  winHeader.strokeThickness = 10;
  winHeader.alpha = 0;

  // Specifies text properties
  var textStyle = { font: 'bold 58pt Helvetica', fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 850 };

  // Water-saved text
  waterSavedDisplay = game.add.text(game.world.centerX + 400, 450, "You saved: " + health + " litres!", textStyle);
  waterSavedDisplay.anchor.setTo(0.5);
  waterSavedDisplay.lineSpacing = -2;
  waterSavedDisplay.addColor('#3d87ff', 11);
  waterSavedDisplay.stroke = '#000000';
  waterSavedDisplay.strokeThickness = 7;
  winScreenGroup.add(waterSavedDisplay);

  // Water-Wasted text
  waterWastedDisplay = game.add.text(game.world.centerX + 600, 575, "You wasted: " + (HP - health) + " litres", textStyle);
  waterWastedDisplay.anchor.setTo(0.5);
  waterWastedDisplay.lineSpacing = -2;
  waterWastedDisplay.addColor('#3d87ff', 11);
  waterWastedDisplay.stroke = '#000000';
  waterWastedDisplay.strokeThickness = 7;
  winScreenGroup.add(waterWastedDisplay);

  // Score text
  if ((HP - health) < dailyAverage) {
    scoreDisplay = game.add.text(game.world.centerX + 800, 850,
      "That's " + (100 - ((HP - health) * 100) / dailyAverage).toFixed(1) + "% less than the average person's daily water usage!", textStyle);
    scoreDisplay.addColor('white', 12);
  } else if ((HP - health) > dailyAverage) {
    scoreDisplay = game.add.text(game.world.centerX + 800, 850,
      "That's " + ((((HP - health) * 100) / dailyAverage) - 100).toFixed(1) + "% more than the average person's daily water usage!", textStyle);
    if ((HP - health) >= 2 * dailyAverage) {
      scoreDisplay.addColor('white', 13);
    } else {
      scoreDisplay.addColor('white', 12);
    }
  } else if ((HP - health) === dailyAverage) {
    scoreDisplay = game.add.text(game.world.centerX + 800, 850,
      "That's the same as the average person's daily water usage!", textStyle);
  }
  scoreDisplay.anchor.setTo(0.5);
  scoreDisplay.lineSpacing = -2;
  scoreDisplay.addColor('#3d87ff', 7);
  scoreDisplay.stroke = '#000000';
  scoreDisplay.strokeThickness = 7;
  winScreenGroup.add(scoreDisplay);

  // Continue (to next level) button
  contButton = winScreenGroup.create(game.world.centerX + 1000, 1150, 'continueButton');
  contButton.anchor.setTo(0.5);
  contButton.scale.setTo(BUTTON_SCALE_LARGE);

  contButton.inputEnabled = true;

  contButton.events.onInputUp.add(function () {
    inputEnabled = true;
    game.input.onDown.add(delegate, this, 0);
    darkFilter.destroy();
    if (currentLevelIndex === (levels.length - 1)) {
      submitScreen();
    } else {
      nextLevel();
      resumeTimers();
    }
    SFX_victorySound.pause();
    restartLightflash();
    SFX_reset.play();
    SFX_gameMusic.resume();
    SFX_gameMusic.volume = 0.1

    winHeader.destroy();
    winScreenGroup.destroy(true);
  }, this);

  // Restart button 
  restartButton = winScreenGroup.create(game.world.centerX + 1200, 1300, 'restart');
  restartButton.anchor.setTo(0.5);
  restartButton.scale.setTo(BUTTON_SCALE_LARGE);
  restartButton.inputEnabled = true;
  restartButton.events.onInputDown.add(function () {
    clearPipes();
    restartLightflash();
    SFX_victorySound.pause();
    SFX_reset.play();
    SFX_gameMusic.volume = 0.4;
    SFX_gameMusic.resume();
    inputEnabled = true;
    game.input.onDown.add(delegate, this, 0);
    hpBar.frame = hpBar.animations.frameTotal;
    health = HP;
    canPlace = true;
    hpCounter.timer.resume();
    hpBarCounter.timer.resume();
    winHeader.destroy();
    winScreenGroup.destroy();
    darkFilter.destroy();
  }, this);

  // White Filter
  whiteFilter = game.add.sprite(game.world.centerX, game.world.centerY, 'whiteFilter');
  whiteFilter.anchor.setTo(0.5);
  whiteFilter.scale.setTo(4);
  whiteFilter.alpha = 0;

  // Text and Button Tweens
  darkFilterTween = game.add.tween(darkFilter);
  darkFilterTween.to({ alpha: 1 }, 1500, Phaser.Easing.Cubic.Out, true);

  victoryTween = game.add.tween(winHeader);
  victoryTween.to({ alpha: 1 }, 1300, Phaser.Easing.Cubic.Out, true);

  let xMovement = 400;
  winScreenGroup.forEach(function (element) {
    let elementTween = game.add.tween(element);
    elementTween.to({ x: element.position.x - xMovement }, 1000, Phaser.Easing.Cubic.Out, true);
    elementTween.start();
    xMovement += 200;
  });
}

// Displays lose screen
function loseScreen() {
  // Turns off input to everything but lose screen
  inputEnabled = false;
  game.input.onDown.removeAll();

  // Dark Filter
  darkFilter = game.add.sprite(game.world.centerX, game.world.centerY, 'darkFilter');
  darkFilter.anchor.setTo(0.5);
  darkFilter.scale.setTo(4);
  darkFilter.alpha = 1;

  // Group for screen components
  loseScreen = game.add.group();

  // Big lose header
  loseHeader = game.add.text(game.world.centerX, 400, "DEFEAT", {
    font: 'bold 140pt Helvetica',
    fill: 'white',
    align: 'center',
    wordWrap: true,
    wordWrapWidth: 700
  });
  loseHeader.anchor.setTo(0.5);
  loseHeader.stroke = '#000000';
  loseHeader.strokeThickness = 10;
  loseHeader.alpha = 0;

  // Specifies text properties
  var textStyle = { font: 'bold 70pt Helvetica', fill: 'red', align: 'center', wordWrap: true, wordWrapWidth: 550 };

  // Water-Saved text
  sadText = game.add.text(game.world.centerX, 730, "The water!! NOOOOOOOOO", textStyle);
  sadText.lineSpacing = -7;
  sadText.anchor.setTo(0.5);
  sadText.stroke = '#000000';
  sadText.strokeThickness = 7;
  loseScreen.add(sadText);

  // Menu Button
  menuButton = loseScreen.create(game.world.centerX, 1050, 'menuButton');
  menuButton.anchor.setTo(0.5);
  menuButton.scale.setTo(BUTTON_SCALE_LARGE);
  menuButton.inputEnabled = true;
  menuButton.events.onInputDown.add(function () {
    window.location.replace('/reservoir-rescue/Project/reservoir_rescue');
  });

  // Restart button
  restartButton = loseScreen.create(game.world.centerX, 1200, 'restart');
  restartButton.anchor.setTo(0.5);
  restartButton.scale.setTo(BUTTON_SCALE_LARGE);
  restartButton.inputEnabled = true;
  restartButton.events.onInputDown.add(function () {
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

    whiteFilter.alpha = 1;
    whiteFilterTween = game.add.tween(whiteFilter);
    whiteFilterTween.to({ alpha: 0 }, 1000, Phaser.Easing.Cubic.Out, true);

    SFX_loseSound.stop();
    SFX_gameMusic.resume();

    loseHeader.destroy();
    loseScreen.destroy();
    darkFilter.destroy();
  });

  // White Filter
  whiteFilter = game.add.sprite(game.world.centerX, game.world.centerY, 'whiteFilter');
  whiteFilter.anchor.setTo(0.5);
  whiteFilter.scale.setTo(4);

  // Text and Filter Tweens
  whiteFilterTween = game.add.tween(whiteFilter);
  whiteFilterTween.to({ alpha: 0 }, 1000, Phaser.Easing.Cubic.Out, true);

  loseTween = game.add.tween(loseHeader);
  loseTween.to({ alpha: 1 }, 1300, Phaser.Easing.Cubic.Out, true);
}

//Submit score screen
function submitScreen() {
  winScreenGroup.destroy();
  winHeader.destroy();

  darkFilter = game.add.sprite(game.world.centerX, game.world.centerY, 'darkFilter');
  darkFilter.anchor.setTo(0.5);
  darkFilter.scale.setTo(4);
  darkFilter.alpha = 0;

  darkFilterTween = game.add.tween(darkFilter);
  darkFilterTween.to({ alpha: 1 }, 1500, Phaser.Easing.Cubic.Out, true);

  totalScore += health;
  sessionStorage.setItem("totalScore", totalScore);

  var textStyle = { font: 'bold 80pt Helvetica', fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 850 };
  var submitGroup = game.add.group();

  scoreDisplay = game.add.text(game.world.centerX, 500, "Congratulations You win!", textStyle);
  scoreDisplay.anchor.setTo(0.5);
  scoreDisplay.lineSpacing = -2;
  scoreDisplay.stroke = '#000000';
  scoreDisplay.strokeThickness = 7;
  submitGroup.add(scoreDisplay);

  nameDisplay = game.add.text(game.world.centerX, 800, "Submit your score?", textStyle);
  nameDisplay.anchor.setTo(0.5);
  nameDisplay.lineSpacing = -2;
  nameDisplay.strokeThickness = 7;
  submitGroup.add(nameDisplay)


  //Temporary submit button.
  submitButton = submitGroup.create(game.world.centerX, 1050, 'continueButton');
  submitButton.anchor.setTo(0.5);
  submitButton.scale.setTo(BUTTON_SCALE_LARGE);

  submitButton.inputEnabled = true;

  submitButton.events.onInputDown.add(function () {
    window.location.replace('/reservoir-rescue/Project/reservoir_rescue/submitScreen.html');
  });

  //returns to main menu
  menuButton = submitGroup.create(game.world.centerX, 1200, 'menuButton');
  menuButton.anchor.setTo(0.5);
  menuButton.scale.setTo(BUTTON_SCALE_LARGE);
  menuButton.inputEnabled = true;

  menuButton.events.onInputDown.add(function () {
    window.location.replace('/reservoir-rescue/Project/reservoir_rescue');
  });
}
