
const path = require("path");
const ProductManager = require("./ProductManager.js");
const CartManager = require("./CartManager.js");


const filePathProduct = path.join(__dirname, "data" , "products.json")
const managerProduct = new ProductManager(filePathProduct)

const filePathCart = path.join(__dirname, "data" , "carts.json")
const managerCart = new CartManager(filePathCart , managerProduct)



const express = require("express");
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));




// Listar todos los productos
app.get("/api/products", async (req, res) => {
    const products = await managerProduct.getProducts();
    res.json( {products} );
});
// Obtener un producto por su id
app.get("/api/products/:pid", async (req, res) => {
    const id = Number(req.params.pid);

    if (isNaN(id)) {
        return res.status(400).json({ error: "El id debe ser un número" });
    }

    const product = await managerProduct.getProductById(id);
    if (!product) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(product);
});
// Crear un nuevo producto
app.post("/api/products", async (req, res) => {
    try {
        const newProduct = await managerProduct.addProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Actualizar un producto existente
app.put("/api/products/:pid", async (req, res) => {
    const id = Number(req.params.pid);

    if (isNaN(id)) {
        return res.status(400).json({ error: "El id debe ser un número" });
    }

    try {
        const updatedProduct = await managerProduct.updateProductById(req.body, id);
        if (!updatedProduct) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Eliminar un producto
app.delete("/api/products/:pid", async (req, res) => {
    const id = Number(req.params.pid);

    if (isNaN(id)) {
        return res.status(400).json({ error: "El id debe ser un número" });
    }

    try {
        const deletedProduct = await managerProduct.deleteProductById(id);
        if (!deletedProduct) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.json({ message: "Producto eliminado con éxito", deletedProduct });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});




// Crear un carrito nuevo
app.post("/api/carts", async (req, res) => {
    try {
        const newCart = await managerCart.addCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: "Error al crear carrito" });
    }
});

// Obtener un carrito por id
app.get("/api/carts/:cid", async (req, res) => {
    const cid = Number(req.params.cid);

    if (isNaN(cid)) {
        return res.status(400).json({ error: "El id debe ser un número" });
    }

    try {
        const cart = await managerCart.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener carrito" });
    }
});

// Agregar producto a un carrito
app.post("/api/carts/:cid/product/:pid", async (req, res) => {
    const cid = Number(req.params.cid);
    const pid = Number(req.params.pid);

    if (isNaN(cid) || isNaN(pid)) {
        return res.status(400).json({ error: "cid y pid deben ser números" });
    }

    try {
        const updatedCart = await managerCart.addProductToCart(cid, pid);
        if (!updatedCart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        res.json(updatedCart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});






app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});