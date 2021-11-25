const containerList = document.querySelector('.tile-list');
const basketList = document.querySelector('.basket-list');
const placeOrderButton = document.querySelector('.btn-place-order');

// Fetching data.
async function getData() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/alexsimkovich/patronage/main/api/data.json');
        const data = await response.json();
        return data;

    } catch(err) {
        console.log(err);
    }
}

// Create pizza tiles list
function createNewTile({id, title, price, image, ingredients}) {
    const ingredientsList = ingredients.join(", ");
    const fixedPrice = `${price.toFixed(2)} zł`;
    const newTile = document.createElement('div');

    newTile.className = "tile"
    newTile.innerHTML = `
        <h2 class="title">${id}. ${title}</h2>
        <div class="image">
            <img src="${image}" alt="${title}">
        </div>
        <p class="ingredients"><span>Skladniki:</span><br>${ingredientsList}</p>
            <p class="price">${fixedPrice}</p>
            <button type="submit" class="btn-buy-product" data-name="${title}" data-price="${price}">Zamów</button>
    `
    containerList.appendChild(newTile)
}

function createNewList(list) {
    list.forEach(item => createNewTile(item))
}

// UI handling
const basket = new Basket();

function setListenerForBuyButtons() {
    const buyButtons = [...document.querySelectorAll('.btn-buy-product')];

    for (const btn of buyButtons) {
        btn.addEventListener('click', addProductToBasket);
    }
}

function removeProduct(event) {
    const id = Number(event.target.dataset.id);
    const name = event.target.dataset.name;
    let productsCount = basket.check(name);

    if (productsCount > 1) {
        let count = productsCount - 1;
        basket.changeCount(name, count);
    } else {
        basket.remove(id);
    }

    createBasketUi();
}

// Used for creating and refreshing basket after each change
function createBasketUi() {
    basketList.innerText = '';

    const allProducts = basket.getBasketSummary();
    for (const singleProductInfo of allProducts) {
        const {id, name, text} = singleProductInfo;

        const newLi = document.createElement('li');
        newLi.innerText = singleProductInfo.text;
        const removeButton = document.createElement('button');
        removeButton.dataset.id = singleProductInfo.id;
        removeButton.dataset.name = singleProductInfo.name;
        removeButton.innerText = 'x';

        removeButton.addEventListener('click', removeProduct);
        newLi.appendChild(removeButton);
        basketList.appendChild(newLi);
    }

    const basketTotalValue = basket.getTotalValue();
    const totalPrice = document.querySelector('.total-price')
    totalPrice.innerText = `${basketTotalValue.toFixed(2)} zł.`;

    if (basketTotalValue){
        placeOrderButton.removeAttribute('disabled');
    } else {
        placeOrderButton.setAttribute('disabled', 'true')
        totalPrice.innerHTML = `Głodny? <br>Zamów naszą pizzę!`
    }
}

function addProductToBasket(event) {
    const name = event.target.dataset.name;
    const price = Number(event.target.dataset.price);
    let selectedProduct;
    let productsCount = basket.check(name);

    if (productsCount > 0) {
        let count = productsCount + 1;
       basket.changeCount(name, count);
    } else {
        let count = 1;
        selectedProduct = new SelectedProduct(name, price, count);
        basket.add(selectedProduct);
    }

    createBasketUi();
}

function placeOrder() {
    alert(`Dziękujemy za złożenie zamówienia na kwotę ${(basket.getTotalValue()).toFixed(2)} zł.`);
    basket.clear();
    createBasketUi();
}

placeOrderButton.addEventListener('click', placeOrder);

(async function() {
    try {
        const data = await getData();

        createNewList(data);
        setListenerForBuyButtons();
        createBasketUi();

    } catch(err) {
        console.log(err);
    }
})();

