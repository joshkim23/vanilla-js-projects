// rent and salary input selector elements
const rentSelectorEl = document.querySelector('.rent-selector');
const salarySelectorEl = document.querySelector('.salary-selector');

// $$$ input
const inputFieldAmount = document.querySelector('.input-value');
const taxPercentageEl = document.querySelector('.tax-value');

// $$$ output
const outputField = document.querySelector('.converted-value');
const outputText = document.querySelector('.output-units');

// drop down elements
const inputDropdownEl = document.querySelector('.input-unit-dropdown');
const outputDropdownEl = document.querySelector('.output-unit-dropdown');

const rentUnits = {
    rent: 'monthly rent',
    salary: 'annual salary'
};

let input = 'rent';
let inputValue = '0';
let output = 'salary'
let inputMetric = rentUnits[input];
let outputMetric = rentUnits[output];
let inputDollarValue; 
let taxValue = .3;

function start() {
    generateDropdown('rent', 'salary');
    outputText.innerHTML = outputMetric;
}
start();


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

taxPercentageEl.addEventListener('input', (e) => {
    taxValue = e.target.value;
    let mostRecentInput = inputValue.charAt(inputValue.length-1);
    console.log(mostRecentInput);
    if (!legalValues.has(mostRecentInput)) {
        alert('no alphanumeric characters allowed');
    } 

    if (!inputValue) {
        inputValue = NaN; // so that the default isn't 0 when it's empty. messes up temp. 
    }

    calculate();
})


// create map of all numbers and decimal
const legalValues = new Map();
for (let i=0; i<10; i++) {
    legalValues.set(i.toString(), i.toString()); // (number, string of number)
}
legalValues.set('.', 0);
legalValues.set('', '');
console.log(legalValues);

inputFieldAmount.addEventListener('input', (e) => {
    inputValue = e.target.value;
    let mostRecentInput = inputValue.charAt(inputValue.length-1);
    console.log(mostRecentInput);
    if (!legalValues.has(mostRecentInput)) {
        alert('no alphanumeric characters allowed');
    } 

    if (!inputValue) {
        inputValue = NaN; // so that the default isn't 0 when it's empty. messes up temp. 
    }

    calculate();
})

function calculate() {
    const valueToConvert = Number(inputValue);
    console.log(valueToConvert, input);

    let outputDollarValue;

    if (input === 'rent') {
        outputDollarValue = inputValue * 12 / taxValue / .66;
    } else if (input === 'salary') {
        outputDollarValue = inputValue * (1-taxValue) / 12 * .33;
    }

    outputField.innerHTML = outputDollarValue.toFixed(2).toString();
    outputText.innerHTML = outputMetric.toString();


}