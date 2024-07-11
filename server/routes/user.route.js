import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { authenticateToken, authorize } from "../middleware/middlewares.js";
import { createUpload } from "../utils/functions.js";

/* 
    Aca creamos las rutas get, post, put, delete, etc...
    decidimos la url y el controlador el cual va a responder a esa url cuando sea llamado
*/
const router = Router();
const upload = createUpload();

router.post("/login", userController.login);

router.use(authenticateToken);
router.post("/logout", userController.logout);
router.get("/auth/user", userController.getAuthenticatedUser);

router.use(authorize())
router.get("/all", userController.getAllUsers);
router.post("/", upload.single("image"), userController.createUser);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.get("/", userController.getAllUsers);

export default router;