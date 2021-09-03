// option + clicking selects multiple lines and you can write the same code like that! 
// command shift left and right arrow key moves the multiple line selections to beginning/start of respective code lines


const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const newYears = '1 Jan 2022';


// new Date() is a js date constructor! calling new Date() will be current date, store it in a const. the format it reads is: 'XX XXX XXXX' ex: 1 JAN 2021
 // console.log(newYearsDate - currentDate); //this function gives the difference in milliseconds

function countdown() {
    const newYearsDate = new Date(newYears);
    const currentDate = new Date();

    const totalSeconds = Math.floor((newYearsDate - currentDate) / 1000); //this is dynamic! changes over time in milliseconds! convert to seconds.
    const days = Math.floor(totalSeconds / 3600 / 24); //The Math.floor() function returns the largest integer less than or equal to a given number.
    const hours = Math.floor(totalSeconds/3600) % 24;
    const minutes = Math.floor(totalSeconds/60) % 60;
    const seconds = Math.floor(totalSeconds) % 60;

    console.log(days, hours, minutes, seconds);

    daysEl.innerHTML = days; //DOM MANIPULATION
    hoursEl.innerHTML = formatTime(hours);
    minutesEl.innerHTML = formatTime(minutes);
    secondsEl.innerHTML = formatTime(seconds);
}

// add zero to the element if it's less than 10 ie. 02 hours or 09 seconds if time < 10, otherwise just return the time
function formatTime(time) {
    return time < 10 ? (`0${time}`) : time; 
}

// initial call
countdown(); //calls the countdown function
setInterval(countdown, 1000); //use this to check countdown live in the developer tools console.

