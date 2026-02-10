import { Router } from "express";
import ItemController from "../controllers/itemController";
import validationMiddleware from "../middlewares/validationMiddleware";
import { CreateItemDto } from "../dto/create-item.dto";
import { UpdateItemDto } from "../dto/update-item.dto";

const router = Router();
const itemController = new ItemController();

router.post("/", validationMiddleware(CreateItemDto), itemController.create);
router.get("/", itemController.getAll); // Se usa así: GET /api/items?containerId=xxxx
router.put("/:id", validationMiddleware(UpdateItemDto), itemController.update);
router.delete("/:id", itemController.delete);

export default router;
