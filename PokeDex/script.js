//DOM Objects
const powerButton = document.querySelector(".top-section__blue");
const mainScreen = document.querySelector(".main-screen");
const pokeName = document.querySelector(".poke-name");
const pokeId = document.querySelector(".poke-id");
const pokeFrontImage = document.querySelector(".poke-front-image");
const pokeBackImage = document.querySelector(".poke-back-image");
const pokeTypeOne = document.querySelector(".poke-type-one");
const pokeTypeTwo = document.querySelector(".poke-type-two");
const pokeWeight = document.querySelector(".poke-weight");
const pokeHeight = document.querySelector(".poke-height");
const pokeListItems = document.querySelectorAll(".list-item"); //returns an array like object of elements called a node list!! iterate through each one like an array to fill the innerText one by one!
const prevButton = document.querySelector('.left-button');
const nextButton = document.querySelector('.right-button');


// constants and variables
const TYPES = [
    'normal', 'fighting', 'flying',
    'poison', 'ground', 'rock',
    'bug', 'ghost', 'steel',
    'fire', 'water', 'grass',
    'electric', 'psychic', 'ice',
    'dragon', 'dark', 'fairy'
];

let nextUrl = null;
let prevUrl = null;
let toggleScreenValue = 0;

// functions
const resetScreen = () => {
    mainScreen.classList.remove("hide");
    for (const type of TYPES) {
        mainScreen.classList.remove(type);
    }
};

const capitalize = (str) => str[0].toUpperCase() + str.substr(1); //brilliant way to write a function!! takes a string, make the first index uppercase and add the substring starting from index 1 and on.


const fetchPokeData = (id) => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then(res => {return res.json()}) 
    .then(data => {
        // console.log(data);
        toggleScreenValue = 1;
        resetScreen();

        const pokeTypes = data.types;
        typeOne = pokeTypes[0].type.name;
        mainScreen.classList.add(typeOne.toString()); //adds the type of the pokemon as a class to the mainScreen Div so that the screen color can change accordingly

        if (pokeTypes[1]){
            typeTwo = pokeTypes[1].type.name;
        } else {
            typeTwo = "";
            pokeTypeTwo.classList.add("hide");
        }
        
        pokeTypeOne.innerHTML = typeOne;
        pokeTypeTwo.innerHTML = typeTwo;

        pokeName.innerHTML = capitalize(data.name);
        pokeId.innerHTML =  "#" + data.id.toString();
        pokeFrontImage.src = data.sprites.front_default;
        pokeBackImage.src = data.sprites.back_default;
        pokeWeight.innerHTML = data.weight;
        pokeHeight.innerHTML = data.height;
    });  
};


const fetchPokeList = (url) => {
    fetch(url)
    .then(res => {return res.json()})
    .then(data => {
        console.log(data);
        const { results, previous, next } = data; //create the following constants from the data object! just makes it cleaner than writing data.results, data.previous, data.next 
        prevUrl = previous;
        nextUrl = next;
        console.log(nextUrl);
        const pokeList = results;
        // console.log(pokeList);

        // displays the list of 20 pokemon from the current url
        for (var j = 0; j < pokeListItems.length; j++) { //pokeListItems is a node list (basically an array) of all the list items that are to be filled! you can iterate through each list item in order to fill in data!!!!!!
            const pokeListItem = pokeListItems[j];
            const pokeURL = pokeList[j].url;
            const urlArray = pokeURL.toString().split('/');
            // console.log(urlArray);
            const id = urlArray[6];
            pokeListItem.innerHTML = id + ". " + capitalize(pokeList[j].name);
        }

    });
};


const previousList = () => {
    if (prevUrl){
        fetchPokeList(prevUrl);
    } 
};

const nextList = () => {
    if (nextUrl){
        fetchPokeList(nextUrl);
    }
};

const handleListItemClick = (e) => {
    const listItem = e.target; //this grabs the element that was selected! 
    const pokeID = listItem.innerText.split('.')[0]; //grabs the text inside the element, splits the string at the first . and then lists everything from the first index to grab the id number only.
    fetchPokeData(pokeID);
    
};


const powerToggle = () => {
    if (toggleScreenValue === 1){
        mainScreen.classList.add("hide");
        toggleScreenValue = 0;
    } else {
        mainScreen.classList.remove("hide");
        toggleScreenValue = 1;
    }
}; 

// add event listeners
prevButton.addEventListener('click', previousList); //in this scenario only we don't do the function() or else it wont work!! previouslist() doesn't work here!!!
nextButton.addEventListener('click', nextList);

for (pokeListItem of pokeListItems) {
    pokeListItem.addEventListener('click', handleListItemClick);
};

powerButton.addEventListener('click', powerToggle)


//initialize app
fetchPokeList(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=0`);





    
