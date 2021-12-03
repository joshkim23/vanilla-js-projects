    // selecting the conversion type (length, weight, temp)
    const lengthSelectorEl = document.querySelector('.length');
    const weightSelectorEl = document.querySelector('.weight');
    const tempSelectorEl = document.querySelector('.temp');
    
    // need to populate selections based on metric/us selection, and then populate the output units based on the selection from the dropdown
    // selecting input units standard
    const metricSelectorEl = document.querySelector('.metric-selector');
    const USSelectorEl = document.querySelector('.US-selector');

    // value to convert
    const inputValueEl = document.querySelector('.input-value');
    
    // dropdown unit selection elements
    const inputUnitDropdownEl = document.querySelector('.input-unit-dropdown');
    const outputUnitDropdownEl = document.querySelector('.output-unit-dropdown');

    // calculated output and units
    let outputEl = document.querySelector('.converted-value');
    let outputUnitEl = document.querySelector('.output-units');

    // standards for the app
    const units = {
        metric: {
            length: ['mm', 'cm', 'm', 'km'],
            weight: ['mg', 'g', 'kg'],
            temperature: ['C']
        },
        US: {
            length: ['in', 'ft', 'yd', 'mi'],
            weight: ['oz','lb', 'ton'],
            temperature: ['F']
        }
    }

    // STATES for the app that are used to calculate the output - initialized for start of app to be in metric
    let conversionType = "length";
    let inputStandard = "metric";
    let outputStandard = "US";
    let inputValue;
    let inputUnits = `${units[inputStandard][conversionType][0]}`; // mm
    let outputUnits = `${units[outputStandard][conversionType][0]}`; // in

    // start the app with initial selections
    function start() {
        generateDropdown('metric', 'US');
        outputUnitEl.innerHTML = outputUnits;
        // console.log(outputUnits);
    }
    start();

    // generate drop down unit options depending on the selected conversion type and standard
    function generateDropdown(standard, opposite) {
        inputUnitDropdownEl.innerHTML = '';
        // generate input units based on input standard
        for (let i=0; i<units[standard][conversionType].length; i++) {
            let optionEl = document.createElement('option');
            optionEl.innerHTML = units[standard][conversionType][i];
            inputUnitDropdownEl.appendChild(optionEl); 
        }

        outputUnitDropdownEl.innerHTML = '';
        // generate output units based on input standard
        for (let i=0; i<units[opposite][conversionType].length; i++) {
            let optionEl = document.createElement('option');
            optionEl.innerHTML = units[opposite][conversionType][i];
            outputUnitDropdownEl.appendChild(optionEl); 
            if (i===0) {
                outputUnitEl.innerHTML = units[opposite][conversionType][0]; // populate the output units 
            }
        }
    }

    // event listeners for the conversion type (length, weight, temp)
    lengthSelectorEl.addEventListener('click', () => {
        conversionType = "length";
        generateDropdown(inputStandard, outputStandard);
        inputUnits = `${units[inputStandard][conversionType][0]}`;
        outputUnits = `${units[outputStandard][conversionType][0]}`;
        calculate();
    });
    weightSelectorEl.addEventListener('click', () => {
        conversionType = "weight";
        generateDropdown(inputStandard, outputStandard);
        inputUnits = `${units[inputStandard][conversionType][0]}`;
        outputUnits = `${units[outputStandard][conversionType][0]}`;
        calculate();
    });
    tempSelectorEl.addEventListener('click', () => {
        conversionType = "temperature";
        generateDropdown(inputStandard, outputStandard);
        inputUnits = `${units[inputStandard][conversionType][0]}`;
        outputUnits = `${units[outputStandard][conversionType][0]}`;
        calculate();
    });


    // event listeners for selecting US/metric standard for input --> initiates calculation if input is present
    metricSelectorEl.addEventListener('click', () => {
        generateDropdown('metric', 'US');
        inputStandard = "metric";
        inputUnits = `${units[inputStandard][conversionType][0]}`;
        outputStandard = "US";
        outputUnits = `${units[outputStandard][conversionType][0]}`;
        calculate();
    });
    USSelectorEl.addEventListener('click', () => {
        generateDropdown('US', 'metric');
        inputStandard = "US";
        inputUnits = `${units[inputStandard][conversionType][0]}`;
        outputStandard = "metric";
        outputUnits = `${units[outputStandard][conversionType][0]}`;
        calculate();
    })

    // event listener for selecting input units
    inputUnitDropdownEl.addEventListener('change', (e) => {
        const selectedIndex = e.target.options.selectedIndex;
        inputUnits = units[inputStandard][conversionType][selectedIndex];
        calculate();
        console.log('input units: ', inputUnits);
    })

    // need to update the output units based on the selection of the output unit selector
    outputUnitDropdownEl.addEventListener('change', (e) => {
        const selectedIndex = e.target.options.selectedIndex; // index of the units array that was selected
        outputUnitEl.innerHTML = units[outputStandard][conversionType][selectedIndex];
        outputUnits =  units[outputStandard][conversionType][selectedIndex];
        console.log('output standard: ', outputStandard);
        calculate();
        console.log('output units: ', outputUnits);
    })


    // not used, but this is how you create a map of the alphabet
    const illegalValues = new Map();
    for (let i=0; i<26; i++) {
        illegalValues.set(String.fromCharCode(97 + i), i);
    }

    // create map of all numbers and decimal
    const legalValues = new Map();
    for (let i=0; i<10; i++) {
        legalValues.set(i.toString(), i.toString()); // (number, string of number)
    }

    // create map of all operands for calculations MINUS THE PARENS
    // const arithmeticRelatedChars = ['.','+', '-', '/', '*'];
    const arithmeticRelatedChars = ['+', '-', '/', '*'];

    const operandsMap = new Map(); 
    for (let i=0; i<arithmeticRelatedChars.length; i++) {
        operandsMap.set(arithmeticRelatedChars[i], '');
    }

    // add operands to legal values
    for (let i=0; i<arithmeticRelatedChars.length; i++) {
        legalValues.set(arithmeticRelatedChars[i], '');
    }
    legalValues.set('.','.');
    legalValues.set('',''); // make sure to include empty string as a legal value
    legalValues.set('(',''); // add the parentheses to legal values
    legalValues.set(')','');
    // console.log(legalValues);


    // grab the input value from the user and calculate. Need to handle decimals/letters
    inputValueEl.addEventListener('input', (e) => {
        inputValue = e.target.value;
        let mostRecentInput = inputValue.charAt(inputValue.length-1);
        // console.log(mostRecentInput);
        if (!legalValues.has(mostRecentInput)) {
            alert('no alphanumeric characters allowed');
        } 

        if (!inputValue) {
            inputValue = NaN; // so that the default isn't 0 when it's empty. messes up temp. 
        }

        calculate();
    })

    // checks to make sure that parentheses are balanced, no consecutive operands, does not end with a operand or parentheses
    function assessUserInput(input) {
        let parenthesesStack = [];
        let operandsStack = [];

        // check for balanced parentheses && legal operand usage
        for (let i=0; i<input.length; i++) {
            operandsStack.push(input.charAt(i));
            if (i === 0 && input.charAt(i) === ')' || i === 0 && operandsMap.has(input.charAt(i))) {
                console.log('First input was a closed parentheses or an operand')
                return false; 
            }
            if (input.charAt(i) === '(') {
                parenthesesStack.push('(');
            }
            if (input.charAt(i) === ')' && parenthesesStack[parenthesesStack.length-1] === '(') {
                parenthesesStack.pop();
                // console.log(parenthesesStack);
            }
            // checking for consecutive operands
            if (operandsMap.has(input.charAt(i)) && operandsMap.has(operandsStack[operandsStack.length-2])) {
                console.log('USED TWO CONSECUTIVE OPERANDS');
                console.log(operandsStack);
                return false;
            } 

            // make sure the last char is not an operand or open parentheses
            if (i === input.length-1 && operandsMap.has(input.charAt(i)) || i === input.length-1 && input.charAt(i) === '(') {
                console.log('ENDED WITH AN OPERAND OR AN OPEN PARENTHESES');
                return false;
            }
        }

        // format the return object
        if (parenthesesStack.length === 0) {
            let response = {
                status: true,
                inputArray: operandsStack
            }
            return response; // if you get here, the operands rule is met and the parentheses are balanced
        } else {
            let response = {
                status: false
            }
            return response;
        }
    }

    /* 
     (55+12)/2
        workingNumbers = [
                            [55, 12, 5],
                            [23, 24]
                         ]
        operands = [+, -, /, +]

        --> results in (55 + 12 - 5)/(23+24)
        ** have a 2d array, each row is a layer of parentheses? then iterate through the array and operands
    */

    // converts the input data from an array of all chars into two different arrays: working numbers and operands. 
    // working numbers array is a 2d array where each row is a grouped paranthetical expression to be solved downstream. 
    // operands array has all of the operations done in order
    // Both arrays will be used to calculate the arithmetic result. CURRENTLY DOES NOT SUPPORT PEMDAS IN ONE PARANTHETICAL LAYER: ie (5+4/3) will be incorrect
    function arithmeticResult(input) {
        // console.log('input array: ',input);
        let result;
        let workingNumbers = [[''], ['']];
        let runningWorkingNumber = '';
        let operands = [];
        let workingNumbersRow = 0;
        let workingNumbersCol = 0;
        let inputIndex = 0;

        // test: (12+5)/4
        // generates the working numbers array and operands array
        while (inputIndex < input.length) {
            //console.log('input index: ', inputIndex);
            // iterate the row index to allow for a new "set" of operations within a parentheses expression
            if (input[inputIndex] === ')') {
                //console.log('close parentheses', 'index:',inputIndex);
                workingNumbersRow++;
                workingNumbersCol = 0;
            }

            // add the operands to the operands array
            if (operandsMap.has(input[inputIndex])) {
                operands.push(input[inputIndex]);
                if (runningWorkingNumber) {
                    //console.log('writing this value: ', Number(runningWorkingNumber), 'to row: ', workingNumbersRow, 'col: ', workingNumbersCol);
                    workingNumbers[workingNumbersRow][workingNumbersCol] = runningWorkingNumber;
                    workingNumbersCol++;
                    runningWorkingNumber = '';
                }
            }

            // add a number from strings until you hit an operand
            if (!operandsMap.has(input[inputIndex]) && input[inputIndex] !== '(' && input[inputIndex] !== ')') { // if input char is not an operand, and is not a parentheses --> its a number
                // console.log('input value: ',input[inputIndex]);    
   
                runningWorkingNumber += input[inputIndex];

                if (input[inputIndex + 1 ] === ')' || operandsMap.has(input[inputIndex]) || inputIndex + 1 === input.length) {
                    //console.log('writing this value: ', Number(runningWorkingNumber), 'to row: ', workingNumbersRow, 'col: ', workingNumbersCol);
                    workingNumbers[workingNumbersRow][workingNumbersCol] = runningWorkingNumber;
                    workingNumbersCol++;
                    runningWorkingNumber = '';
                } 
                
            } 
            inputIndex++;
        }

        console.log('working numbers array where each row is a parenthetical expression: ', workingNumbers);
        console.log('list of all operands used in order: ',operands);

        // calculates the arithmetic result using the tool arrays
        let operandIndex = 0;
        let numbersRowIndex = 0;
        let numbersColIndex = 1;
        let runningResult = parseFloat(workingNumbers[0][0]);
        console.log('RUNNING RESULT: ', runningResult);
        
        while (operandIndex < operands.length && numbersRowIndex < workingNumbers.length && numbersColIndex < workingNumbers[numbersRowIndex].length) {
            if (operands[operandIndex] === '+') {
                console.log('operation was: +')
                runningResult += parseFloat(workingNumbers[numbersRowIndex][numbersColIndex]);
            } else if (operands[operandIndex] === '-') {
                console.log('operation was: -')
                runningResult -= parseFloat(workingNumbers[numbersRowIndex][numbersColIndex]);
            } else if (operands[operandIndex] === '*') {
                console.log('operation was: *')
                runningResult *= parseFloat(workingNumbers[numbersRowIndex][numbersColIndex]);
            } else if (operands[operandIndex] === '/') {
                console.log('operation was: /')
                runningResult /= parseFloat(workingNumbers[numbersRowIndex][numbersColIndex]);
            }
            operandIndex++;
            numbersColIndex++; 
            if (numbersColIndex >= workingNumbers[numbersRowIndex].length) {
                numbersRowIndex++;
                numbersColIndex = 0;
            }
            console.log('RUNNING RESULT: ', runningResult);
        }
        return runningResult;
    }



    function calculate() {
        let userInputResult = assessUserInput(inputValue);
        console.log('user input validation check response: ',userInputResult);

        if (userInputResult?.status) { // NEED TO ADD THE QUESTION MARK OR ELSE IT DOESN'T WORK. Since userInputResult is not predefined, it doesn't know if it has a property named status or if it's even an object
            let valueToConvert = arithmeticResult(userInputResult?.inputArray);
            
            //const valueToConvert = Number(inputValue); // needs to be something else to grab decimals
            // console.log(valueToConvert, conversionType, inputStandard, inputUnits, outputStandard, outputUnits); // FINALLY WORKING

            // convert everything to a baseline standard (ft or m) then calculate the output
            const conversionConstantstoStandardMeasurement = {
                metric: { // conversions to 1 meter
                    length: {
                        in: 39.3701,
                        ft: 3.28084,
                        m: 1, 
                        yd: 1.09361,
                        mi: 0.000621371,
                        mm: 1000,
                        cm: 100,
                        km: .001
                    },
                    weight: { // conversions to 1kg
                        mg: 1000000,
                        g: 1000,
                        kg: 1,
                        oz: 35.274,
                        lb: 2.20462,
                        ton: 0.00110231,
                    }
                },
                US: { // conversions to 1 foot
                    length: {
                        in: 12,
                        ft: 1,
                        yd: 1/3,
                        mi: 1/5280,
                        mm: 304.8,
                        cm: 30.48,
                        m: .3048,
                        km: .0003048
                    },
                    weight: { // conversion to 1lb
                        mg: 453592,
                        g: 453.592,
                        kg: 0.453592,
                        oz: 16,
                        lb: 1,
                        ton: 0.0005,
                    }
                }
            }

            const conversionFactors = {
                length: {
                    metric: 3.28084, // number of feet in a meter
                    US: 0.3048 // number of meters in a foot
                },
                weight: {
                    metric: 2.20462, // lb in kg
                    US: 0.453592 // kg in a lb
                }
            }

            let outputValue;
            if (conversionType !== 'temperature') {
                let ftMeterConversionFactor = inputStandard === 'metric' ? conversionFactors[conversionType].metric : conversionFactors[conversionType].US; // number of ft/meter and vice versa for conversion
                // converts the input to standard based on input standard (1 m or 1 ft), then converts that to the right output units
                outputValue = valueToConvert/conversionConstantstoStandardMeasurement[inputStandard][conversionType][inputUnits] * ftMeterConversionFactor * conversionConstantstoStandardMeasurement[outputStandard][conversionType][outputUnits];
            } else {
                outputValue = inputStandard === 'metric' ? inputValue * (9/5) + 32 : (inputValue - 32) * (5/9);
            }
            
            if (outputValue) {
                outputEl.innerHTML = outputValue.toFixed(3); 
            } else {
                outputEl.innerHTML = '_.___';
            }
            // console.log(outputValue);

            // ex: 10cm to ft , inputStandard: metric, input units: cm, output units: ft
            // 10cm/100cmPerMeter m * 3.28 ft/meter 
            // input / conversion[inputStandard][inputUnits] (m)  * ftPermeter (ft) * conversion[outputStandard][outputUnits] 
        }
    }


