import { Router } from "express";
import HouseController from "../controllers/houseController";

const router = Router();
const houseController = new HouseController();

router.post("/", houseController.create);
router.get("/", houseController.getAll);
router.put("/:id", houseController.update);
router.delete("/:id", houseController.delete);

export default router;
