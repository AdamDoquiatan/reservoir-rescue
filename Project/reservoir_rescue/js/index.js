window.onload = startup;

var normalButtons=new Audio("assets/sounds/25879__acclivity__drip1.mp3");
normalButtons.volume = 0.5;
var startGame=new Audio("assets/sounds/212143__qubodup__splash-by-blaukreuz.mp3");

function startup() {
    var play =  document.getElementById("play");
    var leaderboard = document.getElementById("leaderboard");
    var tips =  document.getElementById("tips");
    play.addEventListener("touchstart", pressButtonPlay, false);
    play.addEventListener("touchend", releaseButtonPlay, false);
    leaderboard.addEventListener("touchstart", pressButton, false);
    leaderboard.addEventListener("touchend", releaseButton, false);
    tips.addEventListener("touchstart", pressButton, false);
    tips.addEventListener("touchend", releaseButton, false);
}

function pressButton(event) {
    event.target.setAttribute("class", "on");
    normalButtons.play();

}

function releaseButton(event) {
    event.target.setAttribute("class", "");
}

function pressButtonPlay(event) {
    event.target.setAttribute("class", "on");
    startGame.play();
}

function releaseButtonPlay(event) {
    event.target.setAttribute("class", "");
}





