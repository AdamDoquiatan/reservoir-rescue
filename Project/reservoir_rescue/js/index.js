window.onload = startup;

function startup() {
    var play =  document.getElementById("play");
    var leaderboard = document.getElementById("leaderboard");
    var tips =  document.getElementById("tips");
    play.addEventListener("touchstart", pressButton, false);
    play.addEventListener("touchend", releaseButton, false);
    leaderboard.addEventListener("touchstart", pressButton, false);
    leaderboard.addEventListener("touchend", releaseButton, false);
    tips.addEventListener("touchstart", pressButton, false);
    tips.addEventListener("touchend", releaseButton, false);
}

function pressButton(event) {
    event.target.setAttribute("class", "on");
}

function releaseButton(event) {
    event.target.setAttribute("class", "");
}




