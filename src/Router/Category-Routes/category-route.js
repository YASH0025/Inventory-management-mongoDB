import adminss from "../../Controllers/admin-controller.js";
const { categoryController } = adminss
// const  = default;
import auth from "../../Middlewares/cheak-role-auth-middleware.js";
import Routers from "../User-Routes/index.js";
const { router } = Routers


router.post('/category',auth ,categoryController)


export default router

