const listContainer = document.querySelector('.tile-list');

const createNewTile = (id, title, price, image, ingredients) => {
    let ingredientsList = ingredients.join(", ");

    return (
        `<div class="tile">
        <h2 class="title">${id}. ${title}</h2>
        <div class="image">
            <img src="${image}" alt="${title}">
        </div>
        <p class="ingredients">${ingredientsList}</p>
        <hr>
            <p class="price">${price} zł</p>
            <button type="submit">Dodaj do koszyka</button>
    </div>`
    )
}

const createNewList = list => {
    list.forEach(item => {
        const newTile = createNewTile(item.id, item.title, item.price, item.image, item.ingredients);
        listContainer.innerHTML+=newTile;
    })
}

(async () => {
    try {
        const response = await fetch('https://raw.githubusercontent.com/alexsimkovich/patronage/main/api/data.json');
        const data = await response.json();

        createNewList(data);
    } catch(err) {
        console.log(err);
    }
})();



