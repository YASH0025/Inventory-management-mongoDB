import adminsControllers from "../../Controllers/admin-controller.js"
const { updateInventoryController, inventoryController } = adminsControllers
// const  = default
import auth from "../../Middlewares/cheak-role-auth-middleware.js"
import userRoutes from "../User-Routes/index.js"
const { router } = userRoutes


router.post('/inventory',auth, inventoryController )
router.post('/update-inventory',auth, updateInventoryController )


export default router