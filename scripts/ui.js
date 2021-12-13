'use strict';

let initialData = [];
let data = [];
const containerList = document.querySelector('.tile-list');
const basketList = document.querySelector('.basket-list');
const placeOrderButton = document.querySelector('.btn-place-order');
const clearBasketButton = document.querySelector('.btn-clear-basket');
const basketSummary = document.querySelector('.basket');
const handleBasketButton = document.querySelector('.view-basket');
const basketArrow = document.querySelectorAll('.view-basket img');
const filterInput = document.querySelector('#search-bar');
const sortInput = document.querySelector('#sort');
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
function createTile({id, title, price, image, ingredients}, i) {
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
    newTile.querySelector('.btn-buy-product').addEventListener('click', addProductToBasket);
}

function createList(list) {
    tileList.innerHTML = '';
    list.forEach((item, i) => createTile(item, i))
}

// Filtering by ingredients
function filterTiles(filterText = '') {
    const searchWords = filterText.toLowerCase().split(',').map(item => item.trim());
    data = initialData.filter(item => searchWords.every(word => item.ingredients.join().toLowerCase().includes(word)));
    createList(data);
}

filterInput.addEventListener('keyup', (e) => filterTiles(e.target.value));

// Pizza sorting
function sortTiles(sortOption = 'a-z') {
    switch (sortOption) {
        case 'a-z':
            data.sort((a, b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0));
            break;
        case 'z-a':
            data.sort((a, b) => (a.title < b.title) ? 1 : ((b.title < a.title) ? -1 : 0));
            break;
        case 'price-up':
            data.sort((a, b) => a.price - b.price);
            break;
        case 'price-down':
            data.sort((a, b) => b.price - a.price);
            break;
    }
    createList(data);
}

sortInput.addEventListener('change', (e) => sortTiles(e.target.value));

// UI handling
const basket = new Basket();

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
        totalPrice.innerHTML = `<span>Głodny? <br>Zamów naszą pizzę!</span>`
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
        initialData = await getData();
        filterTiles();
        sortTiles();
        createList(data);
        createBasketUi();
    } catch(err) {
        console.log(err);
    }
})();
