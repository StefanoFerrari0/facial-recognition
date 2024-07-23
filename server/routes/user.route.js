import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { authenticateToken, authorize } from "../middleware/middlewares.js";
import { createUpload } from "../utils/functions.js";

const router = Router();
const upload = createUpload();

// Public routes (no authentication required)
router.post("/login", userController.login);
router.post("/public", upload.single("image"), userController.createUserPublic);

// Apply authentication middleware to all routes below this line
router.use(authenticateToken);

// Routes that require authentication
router.post("/logout", userController.logout);
router.get("/auth/user", userController.getAuthenticatedUser);

// Apply authorization middleware to all routes below this line
router.use(authorize())

// Routes that require both authentication and authorization
router.get("/all", userController.getAllUsers);
router.post("/", upload.single("image"), userController.createUser);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.get("/", userController.getAllUsers);

export default router;