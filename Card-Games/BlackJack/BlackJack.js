const DeckOfCards = require("../deckOfCards.js");
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const legalPlayerInputValues = {
    'h': 1,
    'H': 1,
    's': 1,
    'S': 1
};

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
    'Jack': 10,
    'Queen': 10,
    'King': 10,
    'Ace': {
        High: 11,
        Low: 1
    }
}

/* 
    Things to add: 
        1. rename numberPlayerTurn to indicate that it is the player index, not player number. 
        2. winners: does not support when there are two winners who got a higher score than the dealer but they did not bust and are not the same. ex: player 1 got 20, player 4 got 19, dealer got 17. 
           currently the app only says player 1 is the winner and not player 4 as well. 
*/


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
            this.hands = this.deck.dealDeckPartial(this.numberOfPlayers, 2, true);

            for (let i=0; i<this.numberOfPlayers; i++) {
                this.sums.push(this.calculateHandSums(this.hands[`player${i+1}`]));
            }
            this.sums.push(this.calculateHandSums(this.hands['dealer']));

            if (this.sums[this.sums.length-1] === 21) {
                console.log('GAME OVER - black jack');
            } else {
                this.recursionRun();
            }
        })
    }

    // for later... doesn't look great in the console though
    // formatHands() {
    //     for (let i=0; i<this.numberOfPlayers-1; i++) {
    //         this.hands[`player${i+1}`] = {
    //             cards: this.hands[`player${i+1}`],
    //             score: this.sums[i]
    //         }
    //     }

    //     this.hands = {
    //         cards: this.hands.dealer,
    //         score: this.sums[this.sums.length-1]
    //     }
    // }

    recursionRun() {
        console.log('\n');
        console.log('Hands: ', this.hands);
        console.log('Everyone\'s sums: ',this.sums);
        console.log('\n');

        this.printPlayerData(this.numberPlayerTurn, this.hands[`player${this.numberPlayerTurn+1}`], this.hands['dealer']);

        if (this.sums[this.numberPlayerTurn] < 21) {
            // Key to waiting to move on until receiving a response is to not use synchronous loops like while loops. Putting handling inside the callback ensures that the program will not move forward until the answer is received.
            rl.question("--> Type H to hit, S to stay, Sp to split. Your input:  ", async resp => {

                if (!legalPlayerInputValues[resp]) {
                    console.log('\n');
                    console.log('Please only use the following values: H or h to hit and S or s to stay');
                    console.log('\n');
                    this.recursionRun();
                }
                // player chose to hit
                if (resp === 'H' || resp === 'h') {
                    this.hands[`player${this.numberPlayerTurn+1}`].push(this.deck.dealOneCard());
                    this.sums[this.numberPlayerTurn] = this.calculateHandSums(this.hands[`player${this.numberPlayerTurn+1}`]);
                    console.log(`--> player ${this.numberPlayerTurn+1} just hit. the card they got: `, this.hands[`player${this.numberPlayerTurn+1}`][this.hands[`player${this.numberPlayerTurn+1}`].length-1]);
                
                    // They hit and busted, move onto next player assuming that they aren't the last player
                    if (this.sums[this.numberPlayerTurn] > 21) {
                        console.log('\n');
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
                    // the last guy got 21 
                    }  else if (this.sums[this.numberPlayerTurn] === 21 && this.numberPlayerTurn === this.numberOfPlayers-1){
                        rl.close();
                        console.log('Hands: ', this.hands);
                        console.log('Everyone\'s sums: ',this.sums);
                        console.log('\n');
                        this.dealerMoves();
                    }

                } else if (resp === 'S' || resp === 's') {
                    console.log(`--> player ${this.numberPlayerTurn+1} chose to stay.`);

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
                }
            })
            // end of the callback - enters the else if the player got a blackjack.
        } else {
            console.log(`player${this.numberPlayerTurn+1} got a blackjack.`);
            // if there is another player besides the dealer
            if (this.numberPlayerTurn < this.numberOfPlayers-1) {
                this.numberPlayerTurn++;
                this.recursionRun();
            } else {
                console.log('\n');
                console.log('Hands: ', this.hands);
                console.log('Everyone\'s sums: ',this.sums);
                console.log('\n');
                this.dealerMoves();
            }
        }
        
    }

    dealerMoves() {
        let dealerIndex = this.sums.length-1;

        if (this.sums[dealerIndex] >= 17 && this.sums[dealerIndex] < 22) {
            console.log('Dealer has a hand of at least 17.');
            console.log('GAME OVER. winners: ',this.determineWinner(false));
        }
        let running = true;
        while (this.sums[dealerIndex] < 17 && this.sums[dealerIndex] < 22 && running ) {
            console.log('Dealer\'s turn.');
            let card = this.deck.dealOneCard();
            this.hands['dealer'].push(card);
            this.sums[dealerIndex] = this.calculateHandSums(this.hands['dealer']);
            console.log(`${card} added to dealer's hand.`)

            console.log('\n');
            console.log('Hands: ', this.hands);
            console.log('Everyone\s sums: ', this.sums);
            console.log('\n');
            if (this.sums[dealerIndex] >= 17 && this.sums[dealerIndex] < 22) {
                console.log('game over!');
                console.log('WINNERS:', this.determineWinner(false));
                running = false;
            }
            if (this.sums[dealerIndex] > 21) {
                console.log('dealer busted! Everyone wins!');
                console.log('WINNERS:', this.determineWinner(true));
                running = false;
            }
            console.log('\n');
        }
        return;
        
    }

    printPlayerData(player, hand, dealerHand) {
        console.log(`========== Player ${player+1} is up! ==========`);
        console.log('YOU:    ', this.sums[player], '||', hand)
        // console.log(`DEALER: ${parseInt(this.sums[this.sums.length-1])} || ${dealerHand}`);
        console.log('DEALER: ', this.sums[this.sums.length-1], '||', dealerHand);
        console.log('\n');
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
            } else if (card === 'Ace' && sum + 11 <= 21){
                sum += cardValues.Ace.High;
            } else if (card === 'Ace' && sum + 11 > 21) {
                sum += cardValues.Ace.Low;
            }
            card = '';
        }

        return sum;
    }

    /* 
        All game outcomes: 
            1. Only dealer wins 
            2. Either player wins
            3. Both players win 
            4. Dealer and a player win 
            5. Dealer and both players win 
    */
    determineWinner(dealerBust) {
        let winners = [{
            playerIndex: `player${1}`,
            score: this.sums[0]
        }];
        
        // dealer busts, everyone wins
        if (dealerBust) {
            for (let i=1; i< this.sums.length-1; i++) {
                winners.push({
                    playerIndex: `player${i+1}`,
                    score: this.sums[i]
                })
            }
            let formattedWinners = winners.map(winner => winner.playerIndex);

            return formattedWinners;
        }


        for (let i=1; i<this.sums.length; i++) {
            // this overwrites a previous winner if it meets the criteria. 
            if (this.sums[i] > winners[0].score && this.sums[i] < 22 || winners[0].score > 21 && this.sums[i] < 22) {
                winners = [{
                    playerIndex: null,
                    score: null
                }];
                winners[0].playerIndex = `player${i+1}`;
                winners[0].score = this.sums[i];
            }
            
            if (this.sums[i] === winners[0].score && winners[0].playerIndex !== `player${i+1}`) {
                if (i < this.sums.length - 1) {
                    winners.push({
                        playerIndex: `player${i+1}`,
                        score: this.sums[i]
                    })
                } else {
                    winners.push({
                        playerIndex: 'dealer',
                        score: this.sums[i]
                    })
                }
                
            }
            
        }

        let formattedWinners = winners.map(winner => winner.playerIndex);
        if (formattedWinners[0] === `player${this.sums.length}` && formattedWinners.length === 1) formattedWinners = ['dealer'];
        return formattedWinners;
    }
}


function start() {
    let game = new BlackJack()
}
start();
