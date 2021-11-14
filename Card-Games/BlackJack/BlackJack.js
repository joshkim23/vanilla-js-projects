import { DeckOfCards } from "../deckOfCards.js";
import { cardValues } from "./cardValueInterface.js";

class BlackJack {
    constructor() {
        console.log('BlackJack Game started');
        this.numberOfPlayers = null;
        this.numberPlayerTurn = 1;
        this.running = true; 

        this.run();
    }

    run() {
        let count = 0;
        while (this.running) {
            this.deck = new DeckOfCards();
            let hands = this.deck.dealDeckPartial(2, 2, true);
            console.log(hands);
            console.log(this.numberPlayerTurn);
            count++;
            if (count === 2) {
                this.running = false;
            }
        }

        
    }
}


function start() {
    let game = new BlackJack()
}
start();