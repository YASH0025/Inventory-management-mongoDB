import routes from "./Router/User-Routes/signUp-router.js";
// require('@babel/register');
// require('./app.mjs');

import express from "express";
const router = express.Router();
import admin from "./Router/Admin-Rotutes/admin-router.js";
import categorys from "./Router/Category-Routes/category-route.js";
import product from "./Router/Products-Routes/product-route.js";
import inventory from "./Router/Inventory-Routes/inventory-route.js";

router.use("/", routes);
router.use("/", categorys);
router.use("/", product);
router.use("/", inventory);
router.use("/", admin);

export default router;
