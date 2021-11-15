const readline = require('readline');


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

// rl.question("What is your name? ", resp => {
    
//     console.log('this is the response: ', resp);
//     rl.close();

// })

async function test() {
    let name = "INITIAL-NAME"; 

    rl.question("What is your name? ", resp => {
    
        console.log('Nice to meet you,', resp);
        name = resp;
        rl.close();
        console.log(name);

    })

}

test();