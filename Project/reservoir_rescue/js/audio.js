function muteSounds() {
    if (inputEnabled == true) {
        if (game.sound.mute == false) {
            game.sound.mute = true;
        } else {
            game.sound.mute = false;
        }
    }
}

function createAudio() {
    SFX_gameMusic = game.add.sound('gameMusic', 0.3, true);
    SFX_lastPipe = game.add.sound('lastPipe', 2.5);
    SFX_endFlow = game.add.sound('endFlow', 0.5);
    SFX_victorySound = game.add.sound('victorySound', 1.8);
    SFX_obsScreenSwooshIn = game.add.sound('obsScreenSwooshIn');
    SFX_obsScreenSwooshOut = game.add.sound('obsScreenSwooshOut');
    SFX_buttonSound = game.add.sound('buttonSound'); //?
    SFX_selectPipe = game.add.sound('selectPipe', 0.5);
    SFX_placePipe = game.add.sound('placePipe', 0.35);
    SFX_loseSound = game.add.sound('loseSound', 0.8);
}

