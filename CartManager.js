const fs = require("fs/promises");

class CartManager{
    constructor( filePath , productManager ){
        this.filePath = filePath
        this.productManager = productManager
    }

    async #readFile() {
        try {
            const data = await fs.readFile(this.filePath, "utf-8");
            return JSON.parse(data);
        } catch (error) {
            if (error.code === "ENOENT") return [];
            throw error;
        }
    }

    async #writeFile(data) {
        try {
            await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error("Error al escribir el archivo:", error);
        }
    }


    async addCart() {
        const carts = await this.#readFile();
        const lastId = carts.length > 0 ? carts[carts.length - 1].id : 0;

        const newCart = {
            id: lastId + 1,
            products: []
        };

        carts.push(newCart);
        await this.#writeFile(carts);

        return newCart;
    }

    async getCartById(id) {
        const carts = await this.#readFile();
        const cart = carts.find(c => c.id === Number(id));
        return cart || null;
    }

    async addProductToCart(cid, pid) {

        const product = await this.productManager.getProductById(pid);
        if (!product) {
            throw new Error("El producto no existe");
        }


        const carts = await this.#readFile();
        
        const cartIndex = carts.findIndex(c => c.id === Number(cid));
        if (cartIndex === -1) return null; // carrito no encontrado

        const cart = carts[cartIndex];

        const productIndex = cart.products.findIndex(p => p.product === Number(pid));

        if (productIndex !== -1) {
            // ya existe -> incrementar cantidad
            cart.products[productIndex].quantity++;
        } else {
            // no existe -> agregar nuevo
            cart.products.push({ product: Number(pid), quantity: 1 });
        }

        carts[cartIndex] = cart;
        await this.#writeFile(carts);

        return cart;
    }


}


module.exports = CartManager;