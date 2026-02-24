import { Request, Response } from "express";
import itemService from "../services/item.service";

class ItemController {
  async create(req: Request, res: Response): Promise<any> {
    try {
      const { name, quantity, containerId } = req.body;
      const userId = (req as any).user.id;

      const newItem = await itemService.createItem(
        name,
        quantity,
        containerId,
        userId,
      );
      return res.status(201).json(newItem);
    } catch (error: any) {
      let status = 500;
      if (error.message === "Container no existe") status = 404;
      if (error.message === "No tenés permiso en esta casa") status = 403;
      return res
        .status(status)
        .json({ message: error.message || "Error al crear item" });
    }
  }

  async getAll(req: Request, res: Response): Promise<any> {
    try {
      const containerId = req.query.containerId as string;
      const userId = (req as any).user.id;

      if (!containerId)
        return res.status(400).json({ message: "Falta containerId" });

      const items = await itemService.getItemsByContainer(containerId, userId);
      return res.status(200).json(items);
    } catch (error: any) {
      let status = 500;
      if (error.message === "Falta containerId") status = 400;
      if (error.message === "Acceso denegado") status = 403;
      return res
        .status(status)
        .json({ message: error.message || "Error al listar items" });
    }
  }

  async update(req: Request, res: Response): Promise<any> {
    try {
      const id = req.params.id as string;
      const { name, quantity } = req.body;
      const userId = (req as any).user.id;

      const updatedItem = await itemService.updateItem(
        id,
        { name, quantity },
        userId,
      );
      return res
        .status(200)
        .json({ message: "Item actualizado correctamente", data: updatedItem });
    } catch (error: any) {
      let status = 500;
      if (error.message === "Item no encontrado") status = 404;
      if (error.message === "No tienes permiso para editar este item")
        status = 403;
      return res
        .status(status)
        .json({ message: error.message || "Error interno al actualizar item" });
    }
  }

  async delete(req: Request, res: Response): Promise<any> {
    try {
      const id = req.params.id as string;
      const userId = (req as any).user.id;

      await itemService.deleteItem(id, userId);
      return res.status(200).json({ message: "Item eliminado" });
    } catch (error: any) {
      let status = 500;
      if (error.message === "Item no encontrado") status = 404;
      if (error.message === "No puedes borrar items ajenos") status = 403;
      return res
        .status(status)
        .json({ message: error.message || "Error al eliminar item" });
    }
  }

  async getTotalCount(req: Request, res: Response): Promise<any> {
    try {
      const total = await itemService.getTotalCount();
      return res.status(200).json({ total });
    } catch (error: any) {
      return res.status(500).json({ message: "Error al obtener estadísticas" });
    }
  }
}

export default new ItemController();
