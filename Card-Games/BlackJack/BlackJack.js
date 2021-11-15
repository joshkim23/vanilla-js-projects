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
        rl.question("How many players? ", resp => {
            this.numberOfPlayers = parseInt(resp);
            this.numberPlayerTurn = 0;
            this.running = true;
            this.playAgain = true; 
            this.sums = [];
            this.hands = null;

            this.deck = new DeckOfCards();
            this.hands = this.deck.dealDeckPartial(2, 2, true);
            for (let i=0; i<this.numberOfPlayers; i++) {
                this.sums.push(this.calculateHandSums(this.hands[`player${i+1}`]));
            }
            this.sums.push(this.calculateHandSums(this.hands['dealer']));

            this.recursionRun();
        })
    }

    recursionRun() {
        console.log('Hands: ', this.hands);
        console.log('Everyone\'s sums: ',this.sums);
        console.log('\n');

        this.printPlayerData(this.numberPlayerTurn, this.hands[`player${this.numberPlayerTurn+1}`], this.hands['dealer']);

        if (this.sums[this.numberPlayerTurn] < 21) {
            // Key to waiting to move on until receiving a response is to not use synchronous loops like while loops. Putting handling inside the callback ensures that the program will not move forward until the answer is received.
            rl.question("--> Type H to hit, S to stay, Sp to split. Your input:  ", async resp => {
                if (resp === 'H') {
                    this.hands[`player${this.numberPlayerTurn+1}`].push(this.deck.dealOneCard());
                    this.sums[this.numberPlayerTurn] = this.calculateHandSums(this.hands[`player${this.numberPlayerTurn+1}`]);
                    console.log(`player ${this.numberPlayerTurn+1} just hit. the card they got: `, this.hands[`player${this.numberPlayerTurn+1}`][this.hands[`player${this.numberPlayerTurn+1}`].length-1]);
                } else if (resp === 'S') {
                    console.log(`player ${this.numberPlayerTurn+1} chose to stay.`);
                }
                
                if (this.numberPlayerTurn < this.numberOfPlayers && resp === 'H') {
                    // They hit and busted, move onto next player assuming that they aren't the last player
                    if (this.sums[this.numberPlayerTurn] > 21) {
                        console.log(`player ${this.numberPlayerTurn+1} busted!`);
                        if (this.numberPlayerTurn < this.numberOfPlayers-1){
                            this.numberPlayerTurn++;
                            this.recursionRun();
                        } else {
                            rl.close();
                            console.log('Hands: ', this.hands);
                            console.log('Everyone\'s sums: ',this.sums);
                            console.log('\n');
                            this.dealerMoves();
                        }
                        
                    // They are choosing hit again and their number is less than 21
                    } else if (this.sums[this.numberPlayerTurn] < 21) {
                        this.recursionRun();
                    // they got 21 and its not the last guy, move on to the next player
                    } else if (this.sums[this.numberPlayerTurn] === 21 && this.numberPlayerTurn !== this.numberOfPlayers-1) {
                        this.numberPlayerTurn++;
                        this.recursionRun();
                    } 
                }  
                if (this.numberPlayerTurn < this.numberOfPlayers && resp === 'S') {
                    if (this.numberPlayerTurn !== this.numberOfPlayers-1) {
                        this.numberPlayerTurn++;
                        this.recursionRun();
                    } else {
                        rl.close();
                        console.log('Hands: ', this.hands);
                        console.log('Everyone\'s sums: ',this.sums);
                        console.log('\n');
                        this.dealerMoves();
                    }
                } //else {
                //     if (this.numberPlayerTurn !== this.numberOfPlayers-1) {
                //         this.numberPlayerTurn++;
                //         this.recursionRun();
                //     } else {
                //         rl.close();
                //         console.log('Hands: ', this.hands);
                //         console.log('Everyone\'s sums: ',this.sums);
                //         console.log('\n');
                //         this.dealerMoves();
                //     }
                    
                // }

            })
        } else {
            if (this.numberPlayerTurn < this.numberOfPlayers-1) {
                this.numberPlayerTurn++;
                this.recursionRun();
            } else {
                console.log('Hands: ', this.hands);
                console.log('Everyone\'s sums: ',this.sums);
                console.log('\n');
                this.dealerMoves();
            }
        }
        
    }

    dealerMoves() {
        if (this.sums[this.sums.length-1] === 21) {
            console.log('game over, blackjack');
            return;
        } 
        console.log('Dealer\'s turn.');
        let dealerIndex = this.sums.length-1;

        while (this.sums[dealerIndex] < 17 && this.sums[dealerIndex] <22) {
            let card = this.deck.dealOneCard();
            this.hands['dealer'].push(card);
            this.sums[dealerIndex] = this.calculateHandSums(this.hands['dealer']);
            console.log(`${card} added to dealer's hand.`)

            console.log('Updated Hands: ', this.hands);
            console.log('Everyone\s sums: ', this.sums);
            console.log('\n');
            if (this.sums[dealerIndex] >= 17) {
                console.log('game over!');
            }
            if (this.sums[dealerIndex] > 21) {
                console.log('dealer busted! Everyone wins!');
            }
        }

        // console.log('Hands: ', this.hands);
        // console.log('Everyone\s sums: ', this.sums);
        // console.log('\n');
        
        
    }

    printPlayerData(player, hand, dealerHand) {
        console.log(`Player ${player+1} is up!`);
        console.log(`YOU: ${hand} || SUM: ${this.sums[player]}`);
        console.log(`DEALER: ${dealerHand} || SUM: ${this.sums[this.sums.length-1]}`)
    }

    calculateHandSums(hand) {
        let card = '';
        let sum = 0;

        for (let i=0; i<hand.length; i++) {
            let cardCharIndex = 0;
            while (hand[i].charAt(cardCharIndex) !== '-') {
                card += hand[i].charAt(cardCharIndex);
                cardCharIndex++;
            }
            if (card !== 'Ace') {
                sum += cardValues[card];
            } else {
                sum += 11;
            }
            card = '';
        }

        return sum;
    }
}


function start() {
    let game = new BlackJack()
}
start();
