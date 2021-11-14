/* This class will initiate a new standard deck of 52 cards
    It will provide the following methods: 
        - shuffle the deck
        - order the deck, 
        - 'deal' the deck into a give number of piles for a game 

\*/

export class deckOfCards {
    constructor() {
        this.deck = this.createNewShuffledDeck()
    }

    // Generates the deck and shuffles it
    createNewShuffledDeck() {
        let deck = [];
        let nums = ['2', '3', '4', '5', '6', '7', '8', '9', '10'];
        let faces = ['Jack', 'Queen', 'King', 'Ace'];
        let suits = ['-diamonds', '-hearts', '-clubs', '-spades'];''

        nums.forEach(num => {
            for (let i=0; i<4; i++) {
                deck.push(num + suits[i]);
            }
        })
        faces.forEach(faceCard => {
            for (let i=0; i<4; i++) {
                deck.push(faceCard + suits[i]);
            }
        })
        this.shuffle(deck);

        return deck
    }
    
    // go through entire deck, pick random number and thats the index of the number to swap with, do this all the way to the end
    shuffle(deck) {
        for (let i=0; i<deck.length; i++) {
            let indexOfValueToSwapWith = Math.floor(Math.random()*52);
            let temp = deck[indexOfValueToSwapWith];
            deck[indexOfValueToSwapWith] = deck[i];
            deck[i] = temp;
        }
        console.log(deck.length)
        return deck;
    }

    // deals the cards into x number of piles evenly
    dealWholeDeck(piles) {
        let subDecks = this.createEmptySubDecks(piles); 
        
        let subDeckIndex = 0;
        for (let i=0; i<this.deck.length; i++) {
            //subDecks[subDeckIndex].push(this.deck[i]);
            subDecks[`player${subDeckIndex+1}`].push(this.deck[i]);
            if (subDeckIndex === 3) {
                subDeckIndex = 0;
            } else {
                subDeckIndex++;
            }
        }
        return subDecks;
    }

    createEmptySubDecks(piles) {
        if (this.deck.length % piles !== 0) {
            console.log("please pick a number of players that is divisible by the number of cards");
            return []
        }

        //let subDecks = [];
        let subDecks = {};
        for (let i=0; i<piles; i++) {
            subDecks[`player${i+1}`] = [];
            //subDecks.push([]);
        }
        return subDecks;
    }
    


    // deals the deck so each person has x number of cards
    dealDeckPartial(piles, numCards) {
        let subDecks = this.createEmptySubDecks(piles); 
        
    }

    // order deck from least to highest
    



}

