import { ObjectId } from 'mongodb';
import adminIndex from './admin-index.js';
const { Category, Product, Inventory, User, jwt, Role } = adminIndex
import adminControl from '../Helper/admin-controller.helper.js';
const { getTokenDataFromHeader, handleStatusCode, generateToken } = adminControl



const categoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { email, userId } = getTokenDataFromHeader(req.headers.authorization);

    if (!name || !email || !userId)
      return handleStatusCode(res, 400, 'Name, email, and userId are required fields');

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) return handleStatusCode(res, 409, 'Category with the same name already exists');

    const user = await User.findOne({ email });
    if (!user) return handleStatusCode(res, 404, 'User not found');

    const newCategory = new Category({ name, createdBy: user._id });
    await newCategory.save();

    // const token1 = generateToken({ userId, categoryId: newCategory._id, createdBy: user.userId });

    res.status(201).json({ message: 'Category created successfully', category: newCategory });
  } catch (error) {
    console.error(error);
    handleStatusCode(res, 500, 'Internal Server Error');
  }
};

const productsController = async (req, res) => {
  try {
    const { name, price, categoryId, quantity } = req.body;
    // const { , userId } = getTokenDataFromHeader(req.headers.authorization);

    if (!name || !price || !categoryId)
      return handleStatusCode(res, 400, 'Name, price, categoryId, and userId are required fields');

    const existingCategory = await Category.findById(categoryId);
    if (!existingCategory)
      return handleStatusCode(res, 404, 'Category not found');

    const newProduct = new Product({ name, price, category: categoryId });

    const savedProduct = await newProduct.save();

    const newInventory = new Inventory({ quantity, productId: savedProduct._id });
    await newInventory.save();

    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    console.error(error);
    handleStatusCode(res, 500, 'Internal Server Error');
  }
};


const inventoryController = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId, userId } = getTokenDataFromHeader(req.headers.authorization);

    if (!quantity || !productId || !userId)
      return handleStatusCode(res, 400, 'Quantity, productId, and userId are required fields');

    const existingProduct = await Product.findById(productId);
    if (!existingProduct)
      return handleStatusCode(res, 404, 'Product not found');

    const newInventory = new Inventory({ quantity, product: existingProduct._id });
    await newInventory.save();

    const token1 = generateToken({ userId, inventoryId: newInventory._id });
    res.status(201).json({ message: 'Inventory entry created successfully', inventory: newInventory, token1 });
  } catch (error) {
    console.error(error);
    handleStatusCode(res, 500, 'Internal Server Error');
  }
};


const updateInventoryController = async (req, res) => {
  try {
    const { quantity } = req.body;
    const tokenData = getTokenDataFromHeader(req.headers.authorization);

    if (!quantity || !tokenData.inventoryId || !tokenData.userId)
      return handleStatusCode(res, 400, 'Quantity, inventoryId, and userId are required fields');

    const existingInventory = await Inventory.findById(tokenData.inventoryId);

    if (!existingInventory || tokenData.inventoryId !== existingInventory._id.toString())
      return handleStatusCode(res, 404, 'Inventory entry not found');

    existingInventory.quantity = quantity;
    await existingInventory.save();

    res.status(200).json({ message: 'Inventory entry updated successfully', inventory: existingInventory });
  } catch (error) {
    console.error(error);
    handleStatusCode(res, 500, 'Internal Server Error');
  }
};


const addProductController = async (req, res) => {
  try {
    const { name, category, createdBy, quantity, price } = req.body;
    const tokenData = getTokenDataFromHeader(req.headers.authorization);

    if (!name || !category || !createdBy || !quantity || !price || !tokenData.email)
      return handleStatusCode(res, 400, 'Name, category, createdBy, quantity, price, and email are required fields');

    let userName = '';
    let existingUser = await User.findOne({ email: tokenData.email });

    if (existingUser)
      userName = existingUser.name;

    let existingCategory = await Category.findOne({ name: category });

    if (!existingCategory)
      existingCategory = await new Category({ name: category, createdBy: userName }).save();

    const newProduct = new Product({ name, category: existingCategory._id, createdBy, price });
    await newProduct.save();

    const newInventory = new Inventory({ quantity, product: newProduct._id });
    await newInventory.save();

    res.status(201).json({ message: 'Product and inventory entry created successfully', product: newProduct, inventory: newInventory });
  } catch (error) {
    console.error(error);
    handleStatusCode(res, 500, 'Internal Server Error');
  }
};


const assignRoleByEmailController = async (req, res) => {
  try {
    const { email, roleName } = req.body;
    const tokenData = getTokenDataFromHeader(req.headers.authorization);

    if (!email || !roleName || !tokenData.email)
      return handleStatusCode(res, 400, 'Email, roleName, and email are required fields');

    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return handleStatusCode(res, 404, 'User not found');

    const userRole = await Role.findOne({ name: roleName });
    if (!userRole)
      return handleStatusCode(res, 404, 'Role not found');

    existingUser.roles = userRole._id;
    await existingUser.save();

    res.status(200).json({ message: 'Role assigned successfully', user: existingUser });
  } catch (error) {
    console.error(error);
    handleStatusCode(res, 500, 'Internal Server Error');
  }
};


const removeCategory = async (req, res) => {
  try {
    console.log(req.body.category);
    const category = req.body.category; // Assuming the category is in the request body
    if (!category) {
      return res.status(400).json({ message: 'Category is required in the request body' });
    }

    const products = await Product.find({ category: category });

    for (let product of products) {
      await Inventory.deleteMany({ productId: product._id });
    }

    await Product.deleteMany({ category: category });

    const deletedCategory = await Category.findByIdAndDelete(category);

    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category and associated products deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

}

// const getTokenDataFromHeader = (authorizationHeader) => jwt.verify(authorizationHeader.split(' ')[1], 'your-secret-key');

// const handleStatusCode = (res, statusCode, message) => res.status(statusCode).json({ message });
// const generateToken = (data) => jwt.sign(data, 'your-secret-key', { expiresIn: '1h' });



export default { addProductController, assignRoleByEmailController, categoryController, productsController, inventoryController, updateInventoryController,removeCategory };