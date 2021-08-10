const mainScreen = document.querySelector('.main-screen');
const pokeName = document.querySelector('.poke-name');
const pokeId = document.querySelector('.poke-id');
const pokeFrontImage = document.querySelector('.poke-front-image');
const pokeBackImage = document.querySelector('.poke-back-image');
const pokeTypeOne = document.querySelector('.poke-type-one');
const pokeTypeTwo = document.querySelector('.poke-type-two');
const pokeWeight = document.querySelector('.poke-weight');
const pokeHeight = document.querySelector('.poke-height');
const pokeListItems = document.querySelectorAll('.list-item'); //returns an array like object called a node list!! iterate through each one like an array to fill the innerText one by one!
const leftButton = document.querySelector('.left-button');
const rightButton = document.querySelector('.right-button');


// constants and variables
const TYPES = [
    'normal', 'fighting', 'flying',
    'poison', 'ground', 'rock',
    'bug', 'ghost', 'steel',
    'fire', 'water', 'grass',
    'electric', 'psychic', 'ice',
    'dragon', 'dark', 'fairy'
];

let prevUrl = null;
let nextUrl = null;


// Functions
const capitalize = (str) => str[0].toUpperCase() + str.substr(1);

const resetScreen = () => {
    mainScreen.classList.remove('hide'); //removes the hide class from the main-screen div, so that it can be populated with info. this is the standard view of the pokedex, an empty black screen.
    for (const type of TYPES) { //goes through every single newly defined const "type" within the array TYPES.
        mainScreen.classList.remove(type); //esures that any type that was added as a class to the main-screen div is removed so that new styling can be added
    }
};

//fetches list of pokemon in increments of 20 from the server
const fetchPokeList = url => {
fetch(url) //same thing as fetch(url).then(something).then(something)
    .then(res => {return res.json()}) //returns json object of /pokemonoffset, ie the list. res is short for response. happens once the data from the url has been received. this is how javascript handles asynchronous code. This first response is a json object so it's still not super usable. 
    //the fetch function returns a promise. This has to do how js handles asynchronous code. ie. the fetching of third party data takes time due to internet connection.
    .then(data => { //another promise
        console.log(data);
        const { results, previous, next } = data;
        prevUrl = previous;
        nextUrl = next;

    for (let i = 0; i < pokeListItems.length ; i++) {
        const pokeListItem = pokeListItems[i];
        const resultData = results[i];

        if (resultData) {
        const { name, url } = resultData;
        const urlArray = url.split('/');
        const id = urlArray[urlArray.length - 2];
        pokeListItem.innerHTML = id + '. ' + capitalize(name);
        } else {
        pokeListItem.innerHTML = '';
        }
    }
    
    });
};

// fetches and displays then data of a specific pokemon ONCE IT IS SELECTED 
const fetchPokeData = (id) => {
fetch(`https://pokeapi.co/api/v2/pokemon/${id}`) //fetch the data for pokemon of id #
    .then(res => {return res.json()}) //returns json object of /pokemon/id
    .then(data => {
        resetScreen(); //remove previous type class if there is one so you can style the new pokemon info background
        console.log(data);

        const dataTypes = data.types; //from json object, data.type is an array with 2 components
        const dataFirstType = dataTypes[0];
        const dataSecondType = dataTypes[1];
        pokeTypeOne.innerHTML = capitalize(dataFirstType.type.name); //capitalizes and populates what type of pokemon it is, from the json object. goes data.types.type.name 

        // **not all pokemon in the directory have two types! so if there is only one, put an empty string and add the hide class to the poke-type-two div!! this is great so you can hide/unhide divs depending on if data is present
        if (dataSecondType) {
            pokeTypeTwo.classList.remove('hide');
            pokeTypeTwo.innerHTML = capitalize(dataSecondType.type.name);
        } else {
            pokeTypeTwo.classList.add('hide'); //iff second type doesnt exist, add hide class to the div to hide it!
            pokeTypeTwo.innerHTML = '';
        }

        mainScreen.classList.add(dataFirstType.type.name); //add type of pokemon as a class to the  main-screen div so that you can style it (background color) depending on the pokemon type!

        pokeName.innerHTML = capitalize(data.name);
        pokeId.innerHTML = '#' + data.id.toString().padStart(3, '0');
        pokeWeight.innerHTML = data.weight;
        pokeHeight.innerHTML = data.height;
        // pokeFrontImage.src = data['sprites']['front_default'] || ''; //another way to write this.... way less efficient
        pokeFrontImage.src = data.sprites.front_default || '';
        pokeBackImage.src = data.sprites.back_default || ''; //if photo isn't there, place empty string
    });
};

//the API gives a json object for a list of pokemon in increments that you specify. here we specify 20 ('https://pokeapi.co/api/v2/pokemon?offset=0&limit=20'). In the object it gives the list, a previous link and the next link for the previous and next list of 20 respectively. if its the beginning or end of the list, they give back null.
const handleLeftButtonClick = () => {
    if (prevUrl) {
        fetchPokeList(prevUrl);
    }
};
    
const handleRightButtonClick = () => {
    if (nextUrl) {
        fetchPokeList(nextUrl);
    }
};
    
const handleListItemClick = (e) => {
    if (!e.target) return; //what does this do

    const listItem = e.target; //what does e.target exactly do? this is storing the string of the list item element that was clicked!
    if (!listItem.textContent) return; //what does this do

    const id = listItem.textContent.split('.')[0]; //get everything from index 0 up to the . in the list item # 
    // console.log(listItem, id);
    fetchPokeData(id);
};


// adding event listeners
leftButton.addEventListener('click', handleLeftButtonClick);
rightButton.addEventListener('click', handleRightButtonClick);

for (const pokeListItem of pokeListItems) {
    pokeListItem.addEventListener('click', handleListItemClick);
};


// initialize App
fetchPokeList('https://pokeapi.co/api/v2/pokemon?offset=0&limit=20'); //first list of 20 pokemon that the api gives, see format of api at https://pokeapi.co

