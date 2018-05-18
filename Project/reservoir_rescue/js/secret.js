var water=document.getElementById("water");

var percent=100;

//The audio variables
var FlushStep=new Audio("assets/sounds/FlushStep.mp3");


//Sets the water level at the top intially
water.style.transform='translate(0, 0)';

//Draining water animation and plays audios at certain intervals
function flush(){ 
    if(percent!=0){
        percent--; 
        count=percent; 
        water.style.transform='translate(0'+','+(100-count)+'%)'; 
        FlushStep.play();
    };         
};