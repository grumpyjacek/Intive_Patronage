class Basket {
    constructor() {
        this.items = [];
        this.totalValue = 0;
    }

    clear() {
        this.items.length = 0;
        this.totalValue = 0;
    }

    add(product) {
        this.items.push(product);
        this.addToTotalValue(product.price);
    }

    addToTotalValue(newPrice) {
        this.totalValue +=newPrice;
    }

    getTotalValue() {
        return this.items.reduce((prev, product) => prev + product.price * product.count, 0);
    }

    getBasketSummary() {
        return this.items.map((product, i) => {
            return {
                id: i + 1,
                name: product.name,
                text: `${product.count} x ${product.name} - ${product.price.toFixed(2)} zł`,
            };
        });
    }

    remove(number) {
        this.items.splice(number - 1, 1);
    }

    changeCount(productName, productCount) {
       for (let item of this.items) {
           if (item.name === productName) item.count = productCount;
       }
    }

    check(productName) {
        for (let item of this.items) {
            if (item.name === productName) return item.count;
        }
    }
}

class SelectedProduct {
    constructor(productName, productPrice, productCount) {
        this.name = productName;
        this.price = productPrice;
        this.count = productCount;
    }
}
