const passwordEl = document.querySelector('.password');
const pwLength = document.querySelector('.input-number');
const generateButton = document.querySelector('.generate');

const checkBox = (id) => document.getElementById(id);

const checkBoxes = [{
    element: checkBox('upper'), 
    type: 'upper',
    values: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
}, {
    element: checkBox('lower'), 
    type: 'lower',
    values: 'abcdefghijklmnopqrstuvwyz'
}, {
    element: checkBox('nums'), 
    type: 'nums',
    values: '0123456789'
}, {
    element: checkBox('symbols'),
    type: 'symbols',
    values: '!@#$%^&*()~_+{}|:"<>?`-=[];,./'
}];


// create event listener for the generate button, makes an array of the checked types to be used later
generateButton.addEventListener('click', () => {
    let numChecked = [0, 0, 0, 0]; //correspond to upper, lower, nums, symbols
    let sum = 0;
    for (let i = 0; i<checkBoxes.length; i++) {
        if (checkBoxes[i].element.checked) { //check to see if checkboxes are checked
            numChecked[i] = 1;
            sum++; //keeps track of total number of user checked boxes
        }
    }

    if (sum === 0 || !pwLength.value) {
        alert('specify the number and type(s) of characters you want in your password');
    }
    // console.log(numChecked);
    generatePassword(numChecked);
});


// generates the password and updates the input value, NOT innerHTML
const generatePassword = (numChecked) => {
    let password = '';
    let possibleValuesArr = checkedBoxes(numChecked); //
    console.log(possibleValuesArr);

    for (let j = 0; j<pwLength.value; j++) { //need to grab the VALUE of the element!! pwLength is an element.
        let characters = randType(possibleValuesArr);
        let index = Math.floor(Math.random() * characters.length);
        password += characters.charAt(index);
    }

    passwordEl.value = password; //since this is an input container, you need to use .value, not .innerHTML!!!
}


// returns all the possible characters of a randomly chosen type out of the types that the user specified. User picks the types of characters, program creates an array of the types they selected where each element is all the possible characters of that type, this function chooses and returns one of the elements, effectively choosing a type randomly and returning all the corresponding possible characters
function randType(possibleValuesArr) {
    let typeRandomIndex = Math.floor(Math.random() * possibleValuesArr.length);  
    return possibleValuesArr[typeRandomIndex]; //returns one of the user selected types randomly! Returns the string of possible values within the type
}


// creates an array of the types that the user selected where each element is a string of all the possible characters per type
function checkedBoxes(numChecked) {
    console.log(numChecked);
    let possibleTypes = [];

    for (let k = 0; k<numChecked.length; k++) {
        if (numChecked[k] === 1) {
            possibleTypes[k] = checkBoxes[k].values;
        }
    }

    let filteredTypes = possibleTypes.filter(function (el) { 
        return el != null; //filters through each element of the array and returns all the elements that are NOT null!! This makes an array of the selected types and all of their possible values
    });
    console.log(filteredTypes);
    return filteredTypes;
}


// Reference:
// Math.floor(Math.random() * 10);     // returns a random integer from 0 to 9