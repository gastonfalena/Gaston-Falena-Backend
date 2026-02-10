import { Router } from "express";
import ItemController from "../controllers/itemController";
import validationMiddleware from "../middlewares/validationMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";
import { CreateItemDto } from "../dto/create-item.dto";
import { UpdateItemDto } from "../dto/update-item.dto";

const router = Router();
const itemController = new ItemController();

//public
router.get("/total", itemController.getTotalCount);

//private
router.post(
  "/",
  authMiddleware,
  validationMiddleware(CreateItemDto),
  itemController.create,
);
router.get("/", authMiddleware, itemController.getAll); // Se usa así: GET /api/items?containerId=xxxx
router.put(
  "/:id",
  authMiddleware,
  validationMiddleware(UpdateItemDto),
  itemController.update,
);
router.delete("/:id", authMiddleware, itemController.delete);

export default router;
