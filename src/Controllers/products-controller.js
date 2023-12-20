import AdminIndex from "./admin-index.js";
// const { Product, Category, Inventory } = AdminIndex
import Category from '../Models/Admin-Models/category-model.js'
import Product from '../Models/Admin-Models/product-model.js'
import Inventory from '../Models/Admin-Models/inventory-model.js'
// const {} = default;
import adminHelper from '../Helper/admin-controller.helper.js';
const  { getTokenDataFromHeader, handleStatusCode, generateToken } = adminHelper
import Order from '../Models/Admin-Models/orders-model.js';



const products = async (req, res) => {
    try {
        // const products = await Product.find();
        // const products = await Product.find().populate('Inventory');
        const productsWithInventory = await Inventory.find().populate(
            'productId'
        );


        const simplifiedProducts = productsWithInventory.map(product => ({
            name: product.productId.name,
            price: product.productId.price,
            quantity: product.quantity
        }));

        res.json(simplifiedProducts);
    } catch (error) {
        console.error(error);
        // res.status(500).json({ error: 'Internal Server Error' });
        handleStatusCode(res, 500, 'Internal Server Error')
    }
}

const removeProducts = async (req, res) => {
    try {
        console.log(req.body.category);
        const category = req.body.category;
        if (!category) {
            return handleStatusCode(res, 400, 'Category is required in the request body')

        }

        const products = await Product.find({ category: category });

        for (let product of products) {
            await Inventory.deleteMany({ productId: product._id });
        }

        await Product.deleteMany({ category: category });

        const deletedCategory = await Category.findByIdAndDelete(category);

        if (!deletedCategory) {
            return handleStatusCode(res, 404, 'Category not found')
     //  res.status(404).json({ message: 'Category not found' });
        }

        res.json({ message: 'Category and associated products deleted successfully' });
    } catch (error) {
        console.error(error);
        // res.status(500).json({ error: 'Internal Server Error' });
        handleStatusCode(res, 500, 'Internal Server Error')

    }

}
const removeSingleProduct = async (req, res) => {
    try {
        const { productId } = req.body;

        await Inventory.findOneAndDelete({ productId: productId });

        const deletedProduct = await Product.findByIdAndDelete(productId)
        if (!deletedProduct) {
            return handleStatusCode(res, 404, 'No product with that ID was found.')
        }
        res.status(201).json(deletedProduct);

    } catch (error) {
        console.log('Error in delete Single Product', error);
        handleStatusCode(res, 500, ' Server Error')

        // res.status(500).json({ error: "Server Error" })
    }

}
const filteredProducts = async (req, res) => {
    try {
        const { categoryId } = req.body;

        const categoryProducts = await Product.find({ category: categoryId });

        if (categoryProducts.length === 0) {

            return handleStatusCode(res, 404, 'No products found in the specified category.')
        }

        const allProducts = [];

        for (const product of categoryProducts) {

            const inventory = await Inventory.findOne({ productId: product._id }).populate('productId');

            if (inventory) {

                const productDetails = {
                    id: inventory.productId._id,
                    name: inventory.productId.name,
                    price: inventory.productId.price,
                    quantity: inventory.quantity,
                };
                allProducts.push(productDetails);
            }
        }

        res.status(200).json(allProducts);

    } catch (error) {
        console.error(error);
        handleStatusCode(res, 500, 'Internal Server Error')
        // res.status(500).json({ error:  });
    }
};
const orderProduct = async (req, res) => {
    try {

        const { productId, quantity } = req.body
        console.log(req.body);
        const { userId } = getTokenDataFromHeader(req.headers.authorization);

        // console.log(req.userData);
        // const userData = req.userData

        const inventory = await Inventory.findOne({ productId: productId });

        if (!inventory) {
            return handleStatusCode(res, 404, 'Inventory not found for the specified product')
        }

        if (inventory.quantity < quantity) {
            return handleStatusCode(res, 400, 'Insufficient quantity in the inventory.')
            // res.status(400).json({ error: ' });
        }

        inventory.quantity -= quantity;
        await inventory.save();

        const newOrder = new Order({
            productId: productId,
            userId: userId,
            quantity: quantity,
        });

        await newOrder.save();

        res.status(200).json({ details: newOrder });


    } catch (error) {
        console.log("Error at ordering a Product");
        handleStatusCode(res, 500, 'Server Error')
        // res.status(500).json({ error: "Server Error" })
    }

}

export default {
    products,
    removeProducts,
    removeSingleProduct,
    filteredProducts,
    orderProduct
}

