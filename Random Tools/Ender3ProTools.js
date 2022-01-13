const readline = require('readline');
 
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

ender3ProCalcsMain();

function ender3ProCalcsMain() {
    let percentage;
    let elapsedTime;
    rl.question("Input the completion percentage thus far: ", resp => {
        percentage = parseInt(resp);

        rl.question("Input the elapsed time in the form: h:mm: ", resp => {
            elapsedTime = resp;
    
            console.log(estimatePrintDuration(percentage, elapsedTime));
        })
    })

    
}

function estimatePrintDuration(percentage, elapsedTimeInMinutes) {
    const totalDurationStr = (convertEnder3ProTimeToMinutes(elapsedTimeInMinutes) / (percentage/100) / 60).toString();
    let i = 0;
    let hours = '';
    let minDecimal = '';

    while (totalDurationStr.charAt(i) !== '.' && i < totalDurationStr.length) {
        hours += totalDurationStr.charAt(i);
        i++;
    }

    for (let j = 0; j<3; j++) {
        minDecimal += totalDurationStr.charAt(i);
        i++;
    }

    const minutes = (parseFloat(minDecimal) * 60).toFixed(1)
    return `\nTotal duration of print: ${hours} hours, ${minutes} minutes. \nTime remaining = ${((parseFloat(totalDurationStr)*60 - convertEnder3ProTimeToMinutes(elapsedTimeInMinutes))/60).toFixed(2)} hours`;
}


function convertEnder3ProTimeToMinutes(time) {
    let i = 0;
    let hours = '';
    let minutes = '';
    while (time.charAt(i) !== ':') {
        hours += time.charAt(i);
        i++;
    }
    i++; 
    while (i < time.length) {
        minutes += time.charAt(i);
        i++;
    }
    return parseInt(hours) * 60 + parseInt(minutes);
}