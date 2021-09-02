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

const rentUnits = {
    rent: 'monthly rent',
    salary: 'annual salary before tax'
};

let input = 'rent';
let inputValue = '0';
let output = 'salary'
let inputMetric = rentUnits[input];
let outputMetric = rentUnits[output];
let inputDollarValue; 
let taxValue = '30';
let salaryRentProportion = '33';

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



// create map of all numbers and decimal
const legalValues = new Map();
for (let i=0; i<10; i++) {
    legalValues.set(i.toString(), i.toString()); // (number, string of number)
}
legalValues.set('.', 0);
legalValues.set('', '');
console.log(legalValues);

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
    console.log(valueToConvert, 'tax :', parseFloat(taxValue),input, output, rentUnits[input]);

    let outputDollarValue;

    let taxPercentage = 1 - parseFloat(taxValue)/100;
    let percentageOfSalaryToRent = parseFloat(salaryRentProportion)/100;

    if (input === 'rent') {
        outputDollarValue = 12 * inputValue / (taxPercentage * percentageOfSalaryToRent); // AS = (12 * R) / (P * (1-T))
    } else if (input === 'salary') {
        outputDollarValue = (taxPercentage * inputValue * percentageOfSalaryToRent)/12; // R = ((1-T) * AS * P) / 12
    }

    outputDollarValue = formatOutput(outputDollarValue);

    outputField.innerHTML = outputDollarValue.toFixed(2).toString();
    outputText.innerHTML = rentUnits[output];

}

function formatOutput(input) {
    return input;
}