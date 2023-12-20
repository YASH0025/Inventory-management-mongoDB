import { Router } from 'express';
const router = Router();
import auth from '../../Middlewares/cheak-role-auth-middleware.js';
import adminControlls from '../../Controllers/admin-controller.js';
const  { addProductController, assignRoleByEmailController, productsController, inventoryController, updateInventoryController, removeCategory } = adminControlls
// const  = default;


// router.post('/category',auth ,categoryController)
// router.post('/products',auth, productsController )

// router.post('/inventory',auth, inventoryController )
// router.post('/update-inventory',auth, updateInventoryController )

router.post('/add-products',auth, addProductController)
router.put('/assign-role',auth,assignRoleByEmailController );
router.post('/remove', removeCategory);


export default router;
