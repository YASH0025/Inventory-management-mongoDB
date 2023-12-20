// import admincontrol from "../../Controllers/admin-controller.js";
import admincontrol from "../../Controllers/admin-controller.js";
const { productsController } = admincontrol
// const = default;
import _default from "../../Controllers/products-controller.js";
const { products, removeProducts, removeSingleProduct, filteredProducts, orderProduct } = _default;
import auth from "../../Middlewares/cheak-role-auth-middleware.js";
import Routers from "../User-Routes/index.js";
const { router } =Routers

router.get("/products-list", products),
router.post('/products',auth, productsController )
router.post('/remove-category-products', removeProducts)
router.post('/remove-single-product', removeSingleProduct)
router.get('/category-products', filteredProducts)
router.post('/order', orderProduct)



export default router