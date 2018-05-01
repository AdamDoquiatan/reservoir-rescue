let play = document.getElementById("play");
let leaderboard = document.getElementById("leaderboard");
let tips = document.getElementById("tips");

let buttons = [play, leaderboard, tips];

let sound = new Audio("sounds/Bassjackers_-_Higher_Place_Stab__A_.wav");

// Add event listeners for each button
for (let button of buttons) {
    // Check if button is a valid DOM element
    if (button instanceof Element) {
        // "pointer" handles mouse and touch events
        button.addEventListener("pointerdown", pressButton, false);
        button.addEventListener("pointerup", releaseButton, false);
        // button.addEventListener("mousedown", pressButton, false);
        button.addEventListener("touchend", releaseButton, false);
    }
}

function pressButton(event) {
    let sound = new Audio("sounds/Bassjackers_-_Higher_Place_Stab__A_.wav");
    console.log(event.type);
    event.target.classList.add("on");
    sound.play();
}

function releaseButton(event) {
    console.log(event.type);
    event.target.classList.remove("on");
}