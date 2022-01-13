const form = document.getElementById('form');
const input = document.getElementById('input');
const todos = document.getElementById('todos');

//the form in html automatically knows that enter key is a submission. this works without a button. button goes with click, form goes with submit
form.addEventListener('submit', (e) =>{
    e.preventDefault(); //default form behavior is to refresh page upon submission (pushing enter)
    const todoText = input.value; //to grab the text within the element! 

    if (todoText) {
        addListItem(todoText);
    } else {
        alert('type a todo list item');
    }
});



function addListItem(inputText) {
    const todoEl = document.createElement('li');

    todoEl.addEventListener('click', () => {
        todoEl.classList.toggle('completed');
    }); //toggles the class 'completed' on and off! so it strikes through and then unstrikes it

    todoEl.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        todoEl.remove();
    });

    todoEl.innerText = inputText;
    todos.appendChild(todoEl); //add list item element to ul
    input.value = ''; //input.value NOT input.html or input.innertext
}

function sortByCompleted() {
    
}



