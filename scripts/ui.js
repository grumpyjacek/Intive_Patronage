let data = [];
const containerList = document.querySelector('.tile-list');
const basketList = document.querySelector('.basket-list');
const placeOrderButton = document.querySelector('.btn-place-order');
const clearBasketButton = document.querySelector('.btn-clear-basket');
const basketSummary = document.querySelector('.basket');
const handleBasketButton = document.querySelector('.view-basket');
const basketArrow = document.querySelectorAll('.view-basket img');
const sortOption = document.querySelector('#sort');
const tileList = document.querySelector('.tile-list');


function handleViewBasket () {
    basketSummary.classList.toggle('on');
    basketArrow.forEach(arrow => arrow.classList.toggle('inactive'));
}

handleBasketButton.addEventListener('click', handleViewBasket);

// Fetching data.
async function getData() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/alexsimkovich/patronage/main/api/data.json');
        return response.json();

    } catch(err) {
        console.log(err);
    }
}

// Localize prices
function localizePrice (price) {
    return price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
}

// Create pizza tiles list
function createNewTile({id, title, price, image, ingredients}, i) {
    const ingredientsList = ingredients.join(", ");
    const fixedPrice = `${localizePrice(price)} zł`;
    const newTile = document.createElement('div');

    newTile.className = "tile"
    newTile.innerHTML = `
        <h2 class="title">${i + 1}. ${title}</h2>
        <div class="image">
            <img src="${image}" alt="${title}">
        </div>
        <p class="ingredients"><span>Skladniki:</span> ${ingredientsList}</p>
            <p class="price">${fixedPrice}</p>
            <button type="submit" class="btn-buy-product" data-name="${title}" data-price="${price}" data-id="${id}">Zamów</button>
    `
    containerList.appendChild(newTile)
}

function createNewList(list) {
    list.forEach((item, i) => createNewTile(item, i))
}

sortOption.addEventListener('change', (e) => sortTiles(e.target.value));

// Pizza sorting
function sortTiles(sortOption) {
    let newData;

    if (sortOption === 'a-z') {
        newData = data.sort((a, b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0))
    } else if (sortOption === 'z-a') {
        newData = data.sort((a, b) => (a.title < b.title) ? 1 : ((b.title < a.title) ? -1 : 0))
    } else if (sortOption === 'price-up') {
        newData = data.sort((a, b) => a.price - b.price)
    } else if (sortOption === 'price-down') {
        newData = data.sort((a, b) => b.price - a.price)
    }
    tileList.innerText = '';
    createNewList(newData)
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
    const id = event.target.dataset.id;

    basket.remove(id);
    createBasketUi();
}

// Used for creating and refreshing basket after each change
function createBasketUi() {
    basketList.innerText = '';

    const allProducts = basket.getBasketSummary();
    for (const singleProductInfo of allProducts) {
        const {id, name, price, count} = singleProductInfo;

        const newLi = document.createElement('li');
        newLi.innerText = `${count} x ${name} - ${localizePrice(price)} zł`;
        const removeButton = document.createElement('button');
        removeButton.dataset.id = id;
        removeButton.dataset.name = name;
        removeButton.innerText = 'x';

        removeButton.addEventListener('click', removeProduct);
        newLi.appendChild(removeButton);
        basketList.appendChild(newLi);
    }

    const basketTotalValue = basket.getTotalValue();
    const totalPrice = document.querySelector('.total-price')
    totalPrice.innerText = `${localizePrice(basketTotalValue)} zł`;

    if (basketTotalValue){
        placeOrderButton.removeAttribute('disabled');
        clearBasketButton.removeAttribute('disabled')
    } else {
        placeOrderButton.setAttribute('disabled', 'true')
        clearBasketButton.setAttribute('disabled', 'true')
        totalPrice.innerHTML = `Głodny? <br>Zamów naszą pizzę!`
    }
}

function addProductToBasket(event) {
    const id = event.target.dataset.id;
    const name = event.target.dataset.name;
    const price = Number(event.target.dataset.price);
    basket.add(id, name, price);

    createBasketUi();
}

function placeOrder() {
    alert(`Dziękujemy za złożenie zamówienia na kwotę ${(basket.getTotalValue()).toFixed(2)} zł.`);
    basket.clear();
    createBasketUi();
}

placeOrderButton.addEventListener('click', placeOrder);

function clearBasket() {
    basket.clear()
    createBasketUi()
}

clearBasketButton.addEventListener('click', clearBasket);

(async function() {
    try {
        data = await getData();

        sortTiles('a-z');
        createNewList(data);
        setListenerForBuyButtons();
        createBasketUi();

    } catch(err) {
        console.log(err);
    }
})();
