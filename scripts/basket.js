class Basket {
    constructor() {
        this.items = [];
        this.totalValue = 0;
    }

    clear() {
        this.items = [];
        this.totalValue = 0;
    }

    add(id, name, price) {
        let productCount = this.check(id);

        if (productCount) {
            let count = productCount + 1;
            this.changeCount(id, count);
        } else {
            let count = 1;
            const selectedProduct = new SelectedProduct(id, name, price, count);
            this.items.push(selectedProduct);
        }

        this.addToTotalValue(price);
    }

    addToTotalValue(newPrice) {
        this.totalValue +=newPrice;
    }

    getTotalValue() {
        return this.items.reduce((prev, product) => prev + product.price * product.count, 0);
    }

    getBasketSummary() {
        return this.items.map(product => {
            return {
                id: product.id,
                name: product.name,
                text: `${product.count} x ${product.name} - ${product.price.toFixed(2)} zł`,
            };
        });
    }

    remove(id) {
        let productCount = this.check(id);

        if (productCount > 1) {
            let count = productCount - 1;
            this.changeCount(id, count);
        } else {
            const index = this.items.findIndex(item => item.id === id);
            this.items.splice(index, 1);
        }
    }

    changeCount(id, count) {
        this.items.find(item => item.id === id).count = count;
    }

    check(id) {
        const checkProduct = this.items.find(item => item.id === id);
        return checkProduct && checkProduct.count;
    }
}

class SelectedProduct {
    constructor(id, name, price, count) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.count = count;
    }
}
