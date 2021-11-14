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

        this.run();
    }

    async run() {
        let count = 0;
        let hands;
        while (this.playAgain) {
            this.deck = new DeckOfCards();
            hands = this.deck.dealDeckPartial(2, 2, true);
            console.log(hands);
            this.running = true;

            while (this.running) {
                this.printPlayerData(this.numberPlayerTurn, hands[`player${this.numberPlayerTurn+1}`], hands['dealer']);

                await this.requestUserInput(hands);
                this.running = false;

                
            }

            count++;
            if (count === 2) {
                this.playAgain = false;
            }
        }

        console.log('END: ', hands);

    }

    requestUserInput(hands) {
        rl.question("type H to hit, S to stay, Sp to split. Your input:  ", resp => {
            if (resp === 'H') {
                hands[`player${this.numberPlayerTurn+1}`].push(this.deck.dealOneCard());
            } else if (resp === 'S') {
                this.numberPlayerTurn++;
            }

            

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
