
function muteSounds() {
    if (inputEnabled == true) {
        if (game.sound.mute == false) {
            game.sound.mute = true;
        } else {
            game.sound.mute = false;
            SFX_gameMusic.volume = 0.4;
        }
    }
}

function createAudio() {
    SFX_gameMusic = game.add.sound('gameMusic', 0.4, true);
    SFX_lastPipe = game.add.sound('lastPipe', 3);
    SFX_endFlow = game.add.sound('endFlow', 1, true);
    SFX_splash = game.add.sound('splash', 0.1);
    SFX_victorySound = game.add.sound('victorySound', 1.6);
    SFX_obsScreenSwooshIn = game.add.sound('obsScreenSwooshIn', 0.8);
    SFX_obsScreenSwooshOut = game.add.sound('obsScreenSwooshOut', 0.8);
    SFX_pauseButton = game.add.sound('pauseButton');
    SFX_selectPipe = game.add.sound('selectPipe', 0.6);
    SFX_placePipe = game.add.sound('placePipe', 0.9);
    SFX_loseSound = game.add.sound('loseSound', 0.8);
    SFX_obsScreenButton = game.add.sound('obsScreenButton', 1.5);
    SFX_reset = game.add.sound('reset', 1.3);
    SFX_swapPipe = game.add.sound('swapPipe', 0.8);
    SFX_regularButton = game.add.sound('regularButton', 0.5)
    SFX_beep = game.add.sound('beep', 1.0);
}
