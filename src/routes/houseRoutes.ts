import { Router } from "express";
import HouseController from "../controllers/houseController";
// Importá acá tu middleware de autenticación (el que valida el JWT)
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const houseController = new HouseController();

router.use(authMiddleware);

router.post("/", houseController.create);
router.get("/", houseController.getAll);
router.put("/:id", houseController.update);
router.delete("/:id", houseController.delete);

export default router;
