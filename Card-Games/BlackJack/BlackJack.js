const DeckOfCards = require("../deckOfCards.js");
const cardValues = require('./cardValueInterface.js');
const readline = require('readline');


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})


class BlackJack {
    constructor() {
        console.log('BlackJack Game started');
        this.numberOfPlayers = null;
        this.numberPlayerTurn = 0;
        this.running = true;
        this.playAgain = true; 

        //this.run();
        this.recursionRun();
    }

    recursionRun() {
        this.deck = new DeckOfCards();
        let hands = this.deck.dealDeckPartial(2, 2, true);
        console.log('Hands: ', hands);
        this.printPlayerData(this.numberPlayerTurn, hands[`player${this.numberPlayerTurn+1}`], hands['dealer']);

        rl.question("type H to hit, S to stay, Sp to split. Your input:  ", async resp => {
            if (resp === 'H') {
                console.log(`player ${this.numberPlayerTurn} just hit. `);
                hands[`player${this.numberPlayerTurn+1}`].push(this.deck.dealOneCard());
            } else if (resp === 'S') {
                this.numberPlayerTurn++;
            }
            console.log('this is the response: ', resp);
            console.log('new decks:', hands);
            
            rl.close();

        })
    }

    printPlayerData(player, hand, dealerHand) {
        console.log(`${player} is up!`);
        console.log(`your cards: ${hand}`);
        console.log(`dealer\'s cards: ${dealerHand}`)
    }
}


function start() {
    let game = new BlackJack()
}
start();
