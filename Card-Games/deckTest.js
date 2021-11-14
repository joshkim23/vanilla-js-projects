import {deckOfCards} from './deckOfCards.js';

// in order to import a class from another file, need to create a package.json file and set the type to module, and also import from filename.js** without .js it won't import
let deck = new deckOfCards();
console.log(deck.dealWholeDeck(4));
 