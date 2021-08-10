const groceryList = [
    {
        groceryItem: "Chicken Breast",
        forTextPricePerUnit: "$5.99/lb",
        pricePerUnit: 5.99
    }, {
        groceryItem: "Ribeye Meat",
        forTextPricePerUnit: "14.99/lb",
        pricePerUnit: 14.99
    }, {
        groceryItem: "Digiorno Pizza",
        forTextPricePerUnit: "$4.99/box",
        pricePerUnit: 4.99
    }, {
        groceryItem: "Corona 12 Pack",
        forTextPricePerUnit: "$12.99/pack",
        pricePerUnit: 12.99
    }, {
        groceryItem: "Coke 48 Pack",
        forTextPricePerUnit: "$19.99/box",
        pricePerUnit: 19.99
    }, {
        groceryItem: "Precooked Lasagna",
        forTextPricePerUnit: "$12/box",
        pricePerUnit: 12
    }, {
        groceryItem: "hi",
        forTextPricePerUnit: "$15/box",
        pricePerUnit: 15
    }
];


const list = document.querySelector('.list');
let minusButtons = [];
let quantities = [];
let plusButtons = [];
let itemSubtotals = [];


const initialize = () => {
    for(let i=0; i<groceryList.length; i++) {
        // create a new list element per loop for each item
        let listItemEl = document.createElement('li');

        //for the description of the item
        let spanItemEl = document.createElement('span');
        spanItemEl.className = "item-name";
        spanItemEl.innerHTML = groceryList[i].groceryItem + " (" + groceryList[i].forTextPricePerUnit + ")";
        listItemEl.appendChild(spanItemEl);

        // for the - button, quantity input, + button
        let spanQuantityBox = document.createElement('span');
        spanQuantityBox.className = "quantity-box";
        minusButtons[i] = document.createElement('button');
        minusButtons[i].className = "add-or-subtract";
        minusButtons[i].innerHTML = " - ";
        spanQuantityBox.appendChild(minusButtons[i]);
        listItemEl.appendChild(spanQuantityBox);

        quantities[i] = document.createElement('input');
        quantities[i].placeholder = "0";
        spanQuantityBox.appendChild(quantities[i]);

        plusButtons[i] = document.createElement('button');
        plusButtons[i].className = "add-or-subtract";
        plusButtons[i].innerHTML = " + ";
        spanQuantityBox.appendChild(plusButtons[i]);
        listItemEl.appendChild(spanQuantityBox);

        // for the item list subtotal
        itemSubtotals[i] = document.createElement('span');
        itemSubtotals[i].className = "cost-per-item";
        itemSubtotals[i].innerHTML = "$" + 0;
        listItemEl.appendChild(itemSubtotals[i]);

        // append all the span elements to the list item element
        list.appendChild(listItemEl);
    }   
}
initialize();



// create event listeners for each button 
function makeEventListeners() {
    for (let j = 0; j<groceryList.length; j++) {
        quantities[j].addEventListener('input', (e)=> {
            // makes it so if user deletes their input it goes to 0 instead of NaN
            if (quantities[j].value) {
                quantities[j].value = parseInt(e.target.value);
                itemSubtotals[j].innerHTML = "$" + (groceryList[j].pricePerUnit * quantities[j].value).toFixed(2);
            } else {
                quantities[j].value = 0;
                itemSubtotals[j].innerHTML = "$" + (groceryList[j].pricePerUnit * quantities[j].value).toFixed(2);
            }
            updateTotals();
        });

        minusButtons[j].addEventListener('click', ()=> {
            // if the minus button is pushed before any quantity input the value is default to 0. 
            if (!quantities[j].value) {
                quantities[j].value = 0;
            }

            let quant = parseInt(quantities[j].value); //need to define this first, cant do quantities[j].value-- off the bat! 
            if (quant>= 1) {
                quant--;
                itemSubtotals[j].innerHTML = "$" + (groceryList[j].pricePerUnit * quant).toFixed(2);
                quantities[j].value = quant;
                updateTotals();
            } else {
                quant = 0;
                itemSubtotals[j].innerHTML = "$" + 0;

            }
        });

        plusButtons[j].addEventListener('click', ()=> {
            if (!quantities[j].value) {
                quantities[j].value = 0;
            }
            let quant = parseInt(quantities[j].value);
            quant++
            itemSubtotals[j].innerHTML = "$" + (groceryList[j].pricePerUnit * quant).toFixed(2);
            quantities[j].value = quant;
            updateTotals();
        });
    }
};
makeEventListeners();


// function to dynamically update subtotal/tax/total values
function updateTotals() {
    const subTotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');

    function subTotalCalc() {
        let total = 0;

        for (let k=0; k<groceryList.length; k++) {
            // the slice method removes the dollar signs from itemSubtotals, the .innerHTML method grabs the string within the element. slice says grab the string starting from the 1st index, so you only grab the number.
            total += parseFloat(itemSubtotals[k].innerHTML.slice(1));
            // console.log(itemSubtotals[0].innerHTML.slice(1));
        }
        // console.log(total);
        return total;
    };

    subTotalEl.innerHTML = "$" + subTotalCalc().toFixed(2);
    taxEl.innerHTML = "$" + (subTotalCalc() * 0.095).toFixed(2);
    let taxValue = (subTotalCalc() * 0.095).toFixed(2);
    totalEl.innerHTML = "$" + (subTotalCalc() + parseFloat(taxValue)).toFixed(2);
};

