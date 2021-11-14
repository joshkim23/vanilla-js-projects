import {DeckOfCards} from './deckOfCards.js';

// in order to import a class from another file, need to create a package.json file and set the type to module, and also import from filename.js** without .js it won't import
let deck = new DeckOfCards();
console.log(deck.dealDeckPartial(4,10));
console.log()
 