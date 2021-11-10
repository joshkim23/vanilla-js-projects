// grab the DOM elements
const totalMulahEl = document.querySelector('.mulah');
const hourlyRateEl = document.querySelector('.hourly-rate');
const hoursEl = document.querySelector('.hours');
const minEl = document.querySelector('.min');
const secEl = document.querySelector('.sec');
const startStopButton = document.querySelector('.go-stop-button');
const headerEl = document.querySelector('.header');
const startedWithEl = document.querySelector('.started-with');

// helper tool for measuring time 
const timeElapsedArray = [hoursEl, minEl, secEl];

// States for the app
let hourlyRate = 40;
let buttonIsGo = true;
let timer; 
let elapsedTime = 0;
let startedWith = 0;
/* 
    The app needs to make the input fields immutable while running
    Toggle between a green go button and red stop button when clicked and track elapsed time and calculate dollar value
*/

function start() {
    timeElapsedArray.forEach(el => el.innerHTML = '0');
    hourlyRateEl.value = hourlyRate.toString();
    totalMulahEl.value = '';
    headerEl.innerHTML = "Amount Earned so Far"
}
start();

function toggleButton() {
    // clicked GO, time is now being measured
    if (buttonIsGo) {
        startStopButton.innerHTML = "STOP";
        startStopButton.style.backgroundColor = '#e74c3c';
        trackTime();
    
    } else { // clicked STOP
        startStopButton.innerHTML = "GO";
        startStopButton.style.backgroundColor = '#2ecc71';
        clearTimeout(timer);
    }
    buttonIsGo = !buttonIsGo; 
}

startStopButton.addEventListener('click', () => toggleButton())

totalMulahEl.addEventListener('input', (e) => {
    startedWith = parseInt(e.target.value);   
    startedWithEl.innerHTML = e.target.value;
})

function trackTime() {   
    timeElapsedArray[0].innerHTML = Math.floor(elapsedTime / 3600).toString(); // convert seconds to hours
    timeElapsedArray[1].innerHTML = Math.floor(elapsedTime / 60 % 60).toString(); // converts to minutes and rolls over
    timeElapsedArray[2].innerHTML = Math.floor(elapsedTime % 60).toString();

    totalMulahEl.value = (startedWith + (hourlyRate/3600*(elapsedTime))).toFixed(2).toString() // $40/hr * 1 hr/3600 sec * sec
    
    elapsedTime++;
    timer = setTimeout(trackTime, 1000);
}