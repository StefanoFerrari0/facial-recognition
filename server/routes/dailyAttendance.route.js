import { Router } from "express";
import dailyAttendanceController from "../controllers/dailyAttendance.controller.js";
import { authenticateToken, authorize } from "../middleware/middlewares.js";

const router = Router();

//Public routes
router.post("/mark-present", dailyAttendanceController.markUserPresent);

//Private routes
router.use(authenticateToken, authorize())

router.post("/", dailyAttendanceController.create);
router.get("/:id", dailyAttendanceController.getById);
router.get("/date/:date", dailyAttendanceController.getByDatePopulate);
router.get("/", dailyAttendanceController.getAll);
router.put("/:id", dailyAttendanceController.update);
router.delete("/:id", dailyAttendanceController.delete);

export default router;