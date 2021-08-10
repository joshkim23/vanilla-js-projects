//This is an array of objects; each object stores a question, the choices and the correct answer. these are called _____
const quizData = [
    { //index 0
        question: 'When did we move into Knoxville House?',
        a: 'June 2019',
        b: 'July 2019',
        c: 'May 2019',
        d: 'August 2019',
        correct: 'b',
    }, {
        question: 'Whose ethnicity is not properly matched?',
        a: 'Kevin: Filipino',
        b: 'Jacky: Hong Kong-ese',
        c: 'Nemo: Korean',
        d: 'Josh: Korean',
        correct: 'c',
    }, {
        question: 'Who is the coolest girl of Knoxville Fam?!',
        a: 'Helen',
        b: 'Myr',
        c: 'Sammie',
        d: 'Nike',
        correct: 'c',
    }, {
        question: 'Which age is matched improperly?',
        a: 'Josh: 26',
        b: 'Kevin: 24',
        c: 'Jacky: 24',
        d: 'Nemo: 25',
        correct: 'a',
    }, {
        question: 'what was Joshs first Knoxfam hangout?',
        a: 'moving in',
        b: 'lifegroup at Pastor Johns',
        c: 'bbq at home',
        d: 'July 4th beach day',
        correct: 'd',
    }
]

// Need to: 
// 1. Dont let submission happen if a button is not selected
// 2. Tally number of correct answers
// 3. Unselect the button after a submission 
// 4. Show results of Quiz at the end out of 5
// 5. Make Submit button green if answer is right, otherwise red

const title = document.getElementById('title');
const quiz = document.getElementById('quiz');
const questionEl = document.getElementById('question');
const a_text = document.getElementById('a_text');
const b_text = document.getElementById('b_text');
const c_text = document.getElementById('c_text');
const d_text = document.getElementById('d_text');
const submitButton = document.getElementById('submit');
const answersEls = document.querySelectorAll('.answer'); //The querySelectorAll() method returns all elements in the document that matches a specified CSS selector(s), as a static NodeList object. ie it grabs all elements that are under .answer class
// console.log(answersEls); //gives NodeList(4) [input#a.answer, input#b.answer, input#c.answer, input#d.answer]

// need to keep track of current question
let currentQuestion = 0;
let score = 0;
loadQuiz();

function loadQuiz() {
    if (currentQuestion != 0) {
        title.innerHTML = '';
    }
    deselectAnswer();
    const currentQuizData = quizData[currentQuestion];
    questionEl.innerHTML = currentQuizData.question;
    a_text.innerHTML = currentQuizData.a;
    b_text.innerHTML = currentQuizData.b;
    c_text.innerHTML = currentQuizData.c;
    d_text.innerHTML = currentQuizData.d;
}

// this function checks if the user selected a button, and if they did it stores their selection
function getSelected() {
    let answer = undefined; //const doesn't work... why

    // THIS IF STATEMENT IS STORING THE USER'S SELECTION! abcd is stored into answer const, also checking if the user actually clicked a button before submitting
    answersEls.forEach(answerEl => {
        if(answerEl.checked) { 
            answer = answerEl.id;
            console.log(answer);
        } 
    }); //DONT FORGET THE SEMICOLON!!!

    return answer;
    //if no option is clicked, ans wer will be undefined, so the boolean test if(answer) will return false. see event listener
}

//WHY DOESNT THIS WORK
// can you not return the id? or can u not return undefined?

// function getSelected() {
//     const answersEls = document.querySelectorAll('.answer');

//     answersEls.forEach(answerEl => {
//         if(answerEl.checked) {
//             return answerEl.id;
//         }
//     });
//     return undefined;
// 

function deselectAnswer() {
    answersEls.forEach(answerEl => {
        answerEl.checked = false;
    });
}


// called every time we submit
submitButton.addEventListener('click', () => {
    const answer = getSelected(); //stores return value from function, either the user  selected answer or undefined if they didn't pick anything --> can't click submit
    // console.log(answer);

    if(answer) {
        // console.log('the current question # or array index is ' + currentQuestion);
        if(answer === quizData[currentQuestion].correct) {
            score++;
            currentQuestion++;
            // console.log('the score is ' + score);
        } else {
            currentQuestion++;
        }
        if(currentQuestion < quizData.length) {
            loadQuiz();
        } else {
            quiz.innerHTML = `<h2>You answered ${score}/${quizData.length} questions correctly.</h2> <button onclick = "location.reload()"> Reload </button>`;
        }   
    } 
    else {
        alert('select an answer u hoe');
    }
})

