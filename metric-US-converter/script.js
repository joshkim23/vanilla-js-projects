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
        metric: ['mm', 'cm', 'm', 'km'],
        US: ['in', 'ft', 'yd', 'mi']
    }

    // states for the app that are used to calculate the output - initialized for start of app to be in metric
    let inputStandard = "metric"
    let outputStandard = "US";
    let inputValue;
    let inputUnits = "mm";
    let outputUnits = "in";

    // start the app with initial selections
    function start() {
        generateDropdown('metric', 'US');
    }
    start();

    // generate drop down unit options depending on the selected standard
    function generateDropdown(standard, opposite) {
        inputUnitDropdownEl.innerHTML = '';
        // generate input units based on input standard
        for (let i=0; i<units[standard].length; i++) {
            let optionEl = document.createElement('option');
            optionEl.innerHTML = units[standard][i];
            inputUnitDropdownEl.appendChild(optionEl); 
        }

        outputUnitDropdownEl.innerHTML = '';
        // generate output units based on input standard
        for (let i=0; i<units[opposite].length; i++) {
            let optionEl = document.createElement('option');
            optionEl.innerHTML = units[opposite][i];
            outputUnitDropdownEl.appendChild(optionEl); 
            if (i===0) {
                outputUnitEl.innerHTML = units[opposite][0];
            }
        }
    }

    // event listeners for selecting US/metric standard for input --> initiates calculation if input is present
    metricSelectorEl.addEventListener('click', () => {
        generateDropdown('metric', 'US');
        inputStandard = "metric";
        inputUnits = "mm";
        outputStandard = "US";
        outputUnits = "in";
        calculate();
    });
    USSelectorEl.addEventListener('click', () => {
        generateDropdown('US', 'metric');
        inputStandard = "US";
        inputUnits = "in";
        outputStandard = "metric";
        outputUnits = "mm";
        calculate();
    })

    // event listener for selecting input units
    inputUnitDropdownEl.addEventListener('change', (e) => {
        const selectedIndex = e.target.options.selectedIndex;
        inputUnits = units[inputStandard][selectedIndex];
        calculate();
        console.log('input units: ', inputUnits);
    })

    // need to update the output units based on the selection of the output unit selector
    outputUnitDropdownEl.addEventListener('change', (e) => {
        const selectedIndex = e.target.options.selectedIndex; // index of the units array that was selected
        outputUnitEl.innerHTML = units[outputStandard][selectedIndex];
        outputUnits =  units[outputStandard][selectedIndex];
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
    legalValues.set('.', 0);
    legalValues.set('', '');
    console.log(legalValues);


    // grab the input value from the user and calculate. Need to handle decimals/letters
    inputValueEl.addEventListener('input', (e) => {
        inputValue = e.target.value;
        let mostRecentInput = inputValue.charAt(inputValue.length-1);
        console.log(mostRecentInput);
        if (!legalValues.has(mostRecentInput)) {
            alert('no alphanumeric characters allowed');
        } 

        calculate();
    })

    function calculate() {
        const valueToConvert = Number(inputValue); // needs to be something else to grab decimals
        console.log(valueToConvert, inputUnits, outputUnits); // FINALLY WORKING

        // convert everything to a baseline standard (ft or m) then calculate the output
        const conversionConstantstoStandardFootOrMeter = {
            metric: { // conversions to 1 meter
                in: 39.3701,
                ft: 3.28084,
                m: 1, 
                yd: 1.09361,
                mi: 0.000621371,
                mm: 1000,
                cm: 100,
                km: .001
                },
            US: { // conversions to 1 foot
                in: 12,
                ft: 1,
                yd: 1/3,
                mi: 1/5280,
                mm: 304.8,
                cm: 30.48,
                m: .3048,
                km: .0003048
            }
        }

        let ftMeterConversionFactor = inputStandard === 'metric' ? 3.28084 : 0.3048; // number of ft/meter and vice versa for conversion

        // converts the input to standard based on input standard (1 m or 1 ft), then converts that to the right output units
        let outputValue = valueToConvert/conversionConstantstoStandardFootOrMeter[inputStandard][inputUnits] * ftMeterConversionFactor * conversionConstantstoStandardFootOrMeter[outputStandard][outputUnits];

        if (outputValue) {
            outputEl.innerHTML = outputValue.toFixed(4); 
        } else {
            outputEl.innerHTML = '_.____';
        }
        console.log(outputValue);

        // ex: 10cm to ft , inputStandard: metric, input units: cm, output units: ft
        // 10cm/100cmPerMeter m * 3.28 ft/meter 
        // input / conversion[inputStandard][inputUnits] (m)  * ftPermeter (ft) * conversion[outputStandard][outputUnits] 
    }
