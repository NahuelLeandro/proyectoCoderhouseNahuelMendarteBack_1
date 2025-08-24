const fs = require("fs/promises")
const crypto = require("crypto")
const path = require("path")




class ProductManager{
    constructor( filePath ){
        this.filePath = filePath
    }

    async #readFile() {
        try {
        const data = await fs.readFile(this.filePath, "utf-8");
        return JSON.parse(data);
        } catch (error) {
        if (error.code === "ENOENT") return []; // Si no existe el archivo, devolvemos array vacío
        throw error;
        }
    }

    async #writeFile(data) {
        try {
            console.log(this.filePath);
            await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error("Error al escribir el archivo:", error);
        }
    }


    async addProduct( { title , description, code, price, status = true, stock, category, thumbnails = []    } ){
    
        try {

            if( !title || !description || !code || !price  || !stock || !category){
                throw new Error("todos los campos ( title, description, code, price, stock, category) son obligatorios. ")
            }

            const products = await this.#readFile();

            const lastId = products.length > 0 ? products[products.length - 1].id : 0;
            const newProduct ={
                id: lastId + 1 ,
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
                thumbnails,
            }

            products.push(newProduct)
            await this.#writeFile(products)
            return newProduct
            
        } catch (error) {
            console.error("Error al crear un producto:", error);
            throw error;
        }

    }


    async getProducts(){
        try {
            const data = await this.#readFile();
            return data;
        } catch (error) {
            console.error("error al buscar todos los productos:" , error)
        }
    }

    async getProductById(id){
        try {
            const products = await this.#readFile();
            const product = products.find((p) => p.id === Number(id) )
            return product || null;
        } catch (error) {
            console.error("error al buscar un producto por id:" , error)
        }
    }

    async updateProductById( dataUpdateProduct , id ){
        try {
            // buscamos el product por id
            const product = await this.getProductById(id);
            if (!product) {
                console.log("Producto no encontrado");
                return null;
            }
            const products = await this.#readFile();

            const { id: _, ...restUpdates } = dataUpdateProduct;

            const updatedProduct = {
                ...product,
                ...restUpdates
            };

            const updatedProducts = products.map(p =>
                String(p.id) === String(id) ? updatedProduct : p
            );

            await this.#writeFile(updatedProducts);

            console.log("Producto actualizado con éxito:", updatedProduct);
            return updatedProduct;

            //cargar el user actualizado
        } catch (error) {
            console.error("error al actualisar un producto por id:" , error)
            throw error;
        }
    }


    async deleteProductById(id){
        try {

            const product = await this.getProductById(id);
            if (!product) {
                console.log("Producto no encontrado");
                return null;
            }
            const products = await this.#readFile();
            const filteredProducts = products.filter(p => p.id !== Number(id));
            await this.#writeFile(filteredProducts);
            
            console.log("Producto eliminado con éxito:", product);
            return product; 

        } catch (error) {
            console.error("Error al eliminar un producto por id:" , error)
            throw error;
        }
    }


}

module.exports = ProductManager;