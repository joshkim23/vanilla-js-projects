// rent and salary input selector elements
const rentSelectorEl = document.querySelector('.rent-selector');
const salarySelectorEl = document.querySelector('.salary-selector');

// $$$ input
const inputFieldAmount = document.querySelector('.input-value');
const taxPercentageEl = document.querySelector('.tax-value');
const salaryToRentProportion = document.querySelector('.percentage');

// $$$ output
const outputField = document.querySelector('.converted-value');
const outputText = document.querySelector('.output-units');

// drop down elements
const inputDropdownEl = document.querySelector('.input-unit-dropdown');
const outputDropdownEl = document.querySelector('.output-unit-dropdown');

// constant reference
const rentUnits = {
    rent: 'monthly rent',
    salary: 'annual salary before tax'
};

// stages for the app 
let input = 'rent';
let inputValue = '0';
let output = 'salary'
let inputMetric = rentUnits[input];
let outputMetric = rentUnits[output];
let inputDollarValue; 
let taxValue = '30';
let salaryRentProportion = '33';

// initiate the dropdown and output data
function start() {
    generateDropdown('rent', 'salary');
    outputText.innerHTML = outputMetric;
}
start();


// conversion selection element event listeners
rentSelectorEl.addEventListener('click', () => {
    input = 'rent';
    output = 'salary'
    outputText.innerHTML = rentUnits[output];
    generateDropdown(input, output);
    calculate();
})

salarySelectorEl.addEventListener('click', () => {
    input = 'salary';
    output = 'rent';
    outputText.innerHTML = rentUnits[output];
    generateDropdown(input, output);
    calculate();
})

function generateDropdown(standard, opposite) {
    inputDropdownEl.innerHTML = '';
    let inputEl = document.createElement('option');
    inputEl.innerHTML = rentUnits[standard];
    inputDropdownEl.appendChild(inputEl);

    outputDropdownEl.innerHTML = '';
    let outputEl = document.createElement('option');
    outputEl.innerHTML = rentUnits[opposite];
    outputDropdownEl.appendChild(outputEl);
}



// create map of all numbers and decimal
const legalValues = new Map();
for (let i=0; i<10; i++) {
    legalValues.set(i.toString(), i.toString()); // (number, string of number)
}
legalValues.set('.', 0);
legalValues.set('', '');

// input value event listeners - should be consolidated
salaryToRentProportion.addEventListener('input', (e) => {
    salaryRentProportion = e.target.value;
    let mostRecentInput = taxValue.charAt(inputValue.length-1);
    if (!legalValues.has(mostRecentInput)) {
        alert('no alphanumeric characters allowed');
    } 

    if (!inputValue) {
        salaryRentProportion = '0'; // so that the default isn't 0 when it's empty. messes up temp. 
    }

    calculate();
})

taxPercentageEl.addEventListener('input', (e) => {
    taxValue = e.target.value;
    let mostRecentInput = taxValue.charAt(inputValue.length-1);
    if (!legalValues.has(mostRecentInput)) {
        alert('no alphanumeric characters allowed');
    } 

    if (!inputValue) {
        taxValue = '0'; // so that the default isn't 0 when it's empty. messes up temp. 
    }

    calculate();
})

inputFieldAmount.addEventListener('input', (e) => {
    inputValue = e.target.value;
    let mostRecentInput = inputValue.charAt(inputValue.length-1);

    if (!legalValues.has(mostRecentInput)) {
        alert('no alphanumeric characters allowed');
    } 

    if (!inputValue) {
        inputValue = '0'; // so that the default isn't 0 when it's empty. messes up temp. 
    }

    calculate();
})

// calculates the output and formats the output
function calculate() {
    const valueToConvert = Number(inputValue);
    let outputDollarValue;
    let taxPercentage = 1 - parseFloat(taxValue)/100;
    let percentageOfSalaryToRent = parseFloat(salaryRentProportion)/100;

    /*
        Calculated using two equations: 
            1. ASAT * P = 12 * R
            2. ASAT = (1-T) * AS 
        ASAT = annual salary after tax
        P = percentage of salary towards rent
        R = rent 
        T = tax percentage
        AS = annual salary BEFORE tax
    */
    if (input === 'rent') {
        outputDollarValue = 12 * inputValue / (taxPercentage * percentageOfSalaryToRent); // AS = (12 * R) / (P * (1-T)) 
    } else if (input === 'salary') {
        outputDollarValue = (taxPercentage * inputValue * percentageOfSalaryToRent)/12; // R = ((1-T) * AS * P) / 12 
    }

    outputDollarValue = formatOutput(outputDollarValue); // converts number to string with two decimal places

    outputField.innerHTML = outputDollarValue;
    outputText.innerHTML = rentUnits[output];
}


// transform the number with decimals to a string with commas up to two decimal places. 
function formatOutput(input) {
    let formattedOutput = input.toFixed(2); // 
    formattedOutput = formattedOutput.toString();
    // console.log('pre-formatted output: ',formattedOutput);

    let subStrings = [];
    let runningSubstring = '';

    // add decimal and decimal place portion
    subStrings[0] = formattedOutput.substring(formattedOutput.length-3, formattedOutput.length); // get the string from the decimal on

    let i=formattedOutput.length-4;

    while (formattedOutput.charAt(i) && runningSubstring.length < 3) {
        console.log(runningSubstring);
        if (runningSubstring.length) {
            runningSubstring += formattedOutput.charAt(i);
        } else {
            runningSubstring = formattedOutput.charAt(i);
        }
        
        // if there are three digits, add the substring and restart, or if you reach the last one, add what you have to the beginning of the substring array
        if (runningSubstring.length === 3) {
            subStrings.unshift(reverseString(runningSubstring));
            runningSubstring = '';
        } else if (i - 1< 0) {
            subStrings.unshift(reverseString(runningSubstring));
        }
        i--;
    }

    // concatenates the substring array, adding commas to everything except for the last one before the decimals
    let finalOutput = '';
    for (let i=0; i<subStrings.length; i++) {
        if (i < subStrings.length-2) {
            finalOutput += subStrings[i] + ',';
        } else {
            finalOutput += subStrings[i];
        }
        
    }

    return finalOutput;
}

// ** IN JS, STRINGS ARE IMMUTABLE
function reverseString(str) {
    let reversed = '';
    for (let i=str.length-1; i>=0; i--) {
        reversed += str.charAt(i);
    }
    return reversed;
}