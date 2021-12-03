const DeckOfCards = require("../deckOfCards.js");

const cardValues = {
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    'Jack': 11,
    'Queen': 12,
    'King': 13,
    'Ace': 14
}

class War {
    constructor() {
        this.decks = new DeckOfCards().dealWholeDeck(2);
        this.scores = this.getScores();
        this.wagerList = []; // used when two players draw cards of the same value. 

        console.log(this.decks);
        console.log(this.scores);
        this.gameStart();
    }

    gameStart() {
        let count = 0
        while (this.scores[0] !== 0 && this.scores[1] !== 0) {

            console.log('\n');
            console.log(`ROUND ${count}`);

            const player1Card = this.decks['player1'].pop();
            const player1CardValue = this.getCardValue(player1Card);
            const player2Card = this.decks['player2'].pop();
            const player2CardValue = this.getCardValue(player2Card);

            console.log('PLAYER 1 CARD: ', player1Card);
            console.log('PLAYER 2 CARD: ', player2Card);

            if (player1CardValue > player2CardValue) {
                console.log('player 1 wins the round.');
                this.decks['player1'].unshift(player1Card);
                this.decks['player1'].unshift(player2Card);
            } else if (player1CardValue < player2CardValue) {
                console.log('player 2 wins the round.');
                this.decks['player2'].unshift(player1Card);
                this.decks['player2'].unshift(player2Card);
            } else if (player1CardValue === player2CardValue) {
                console.log('its a tie!');

                if (this.decks['player2'].length < 4) {
                    console.log('PLAYER 1 WINS');

                    this.decks['player1'].unshift(player1Card);
                    this.decks['player1'].unshift(player2Card);
                    while (this.decks['player2'].length > 0) {
                        this.decks['player1'].push(this.decks['player2'].pop());
                    }
                    console.log(this.decks);
                } else if (this.decks['player1'].length < 4) {
                    console.log('PLAYER 2 WINS');

                    this.decks['player2'].unshift(player1Card);
                    this.decks['player2'].unshift(player2Card);
                    while (this.decks['player1'].length > 0) {
                        this.decks['player2'].push(this.decks['player1'].pop());
                    }
                    console.log(this.decks);
                } else {
                    this.wagerList = [player1Card, player2Card];
                    this.handleSameCard();
                }
            }

            this.scores = this.getScores();
            console.log('updated number of cards per player: ',this.scores);
            console.log('\n')
            count++;
        }
    }

    getCardValue(card) {
        let cardKey = '';
        let cardStrIndex = 0;

        while (card.charAt(cardStrIndex) !== '-') {
            cardKey += card.charAt(cardStrIndex);
            cardStrIndex++;
        }

        return cardValues[cardKey];
    }

    handleSameCard() {
        console.log('WAR STARTED');
        let pot = this.wagerList; // initialize the pot with the first two 
        
        while (this.getCardValue(this.wagerList[0]) === this.getCardValue(this.wagerList[1])) {
            let count = 0;
            while (count < 3 && this.decks['player1'].length >= 3) {
                pot.push(this.decks['player1'].pop());
                count++;
            }
            count = 0;
            while (count < 3 && this.decks['player2'].length >= 3) {
                pot.push(this.decks['player2'].pop());
                count++;
            }

            const player1Card = this.decks['player1'].pop();
            pot.push(player1Card);
            const player2Card = this.decks['player2'].pop();
            pot.push(player2Card);
            this.wagerList[0] = player1Card;
            this.wagerList[1] = player2Card; 

            if (this.getCardValue(this.wagerList[0]) > this.getCardValue(this.wagerList[1])) {
                console.log('THIS IS THE POT: ', pot, 'length: ', pot.length);
                for (let i=0; i<pot.length; i++) {
                    this.decks['player1'].unshift(pot[i]);
                }
                console.log('PLAYER 1 WON THE WAR');
            } else if (this.getCardValue(this.wagerList[0]) < this.getCardValue(this.wagerList[1])) {
                console.log('THIS IS THE POT: ', pot, 'length: ', pot.length);
                for (let i=0; i<pot.length; i++) {
                    this.decks['player2'].unshift(pot[i]);
                }
                console.log('PLAYER 2 WON THE WAR');
            }
        }
        this.wagerList = [];
    }



    getScores() {
        return [this.decks['player1'].length, this.decks['player2'].length];
    }
}


function run() {
    const game = new War();
}
run();