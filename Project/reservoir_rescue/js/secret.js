var water=document.getElementById("water");

var percent=100;

//The audio variables
var flushSound=new Audio("assets/sounds/toilet_flush.mp3");
var dubstepMusic=new Audio("assets/sounds/NK_backlight(trimmed).mp3");
dubstepMusic.volume=0.2;

//Sets the water level at the top intially
water.style.transform='translate(0, 0)';

//Draining water animation and plays audios at certain intervals
function flush(){ 
    if(percent!=0){
        percent--; 
        count=percent; 
        water.style.transform='translate(0'+','+(100-count)+'%)'; 
        flushSound.play();
    };
    if(percent==0){
        flushSound.pause();
        dubstepMusic.play();
    };               
};