import { Router } from "express";
import HouseController from "../controllers/houseController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const houseController = new HouseController();

router.use(authMiddleware);

router.post("/", houseController.create);
router.get("/", houseController.getAll);
router.put("/:id", houseController.update);
router.delete("/:id", houseController.delete);

export default router;
