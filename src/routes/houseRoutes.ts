import { Router } from "express";
import houseController from "../controllers/houseController";

const router = Router();

router.post("/", houseController.create);
router.get("/", houseController.getAll);
router.put("/:id", houseController.update);
router.delete("/:id", houseController.delete);

export default router;
