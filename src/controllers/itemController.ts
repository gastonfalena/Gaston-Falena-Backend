import { Request, Response } from "express";
import Item from "../models/itemModel";
import Container from "../models/containerModel";
import House from "../models/houseModel";

export default class ItemController {
  async create(req: Request, res: Response) {
    try {
      const { name, quantity, containerId } = req.body;
      const userId = (req as any).user.id;

      const container = await Container.findById(containerId);
      if (!container) {
        return res.status(404).json({ message: "Container no existe" });
      }

      const house = await House.findOne({
        _id: container.house,
        owner: userId,
      });

      if (!house) {
        return res
          .status(403)
          .json({ message: "No tenés permiso en esta casa" });
      }

      const newItem = new Item({
        name: name,
        quantity: quantity || 1,
        container: containerId,
        owner: userId,
      });

      await newItem.save();
      return res.status(201).json(newItem);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error al crear item" });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const { containerId } = req.query;
      const userId = (req as any).user.id;

      if (!containerId)
        return res.status(400).json({ message: "Falta containerId" });

      const container = await Container.findById(containerId).populate("house");

      if (
        !container ||
        !container.house ||
        (container.house as any).owner.toString() !== userId
      ) {
        return res.status(403).json({ message: "Acceso denegado" });
      }

      const items = await Item.find({ container: containerId });
      return res.status(200).json(items);
    } catch (error) {
      return res.status(500).json({ message: "Error al listar items" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, quantity } = req.body;
      const userId = (req as any).user.id;

      const item = await Item.findById(id).populate({
        path: "container",
        populate: { path: "house" },
      });

      if (!item) {
        return res.status(404).json({ message: "Item no encontrado" });
      }

      const ownerId = (item.container as any).house.owner.toString();

      if (ownerId !== userId) {
        return res
          .status(403)
          .json({ message: "No tienes permiso para editar este item" });
      }

      if (name !== undefined) item.name = name;
      if (quantity !== undefined) item.quantity = quantity;

      const updatedItem = await item.save();

      return res.status(200).json({
        message: "Item actualizado correctamente",
        data: updatedItem,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error interno al actualizar item" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;

      const item = await Item.findById(id).populate({
        path: "container",
        populate: { path: "house" },
      });

      if (!item) return res.status(404).json({ message: "Item no encontrado" });

      const ownerId = (item.container as any).house.owner.toString();

      if (ownerId !== userId) {
        return res
          .status(403)
          .json({ message: "No puedes borrar items ajenos" });
      }

      await Item.deleteOne({ _id: id });
      return res.status(200).json({ message: "Item eliminado" });
    } catch (error) {
      return res.status(500).json({ message: "Error al eliminar item" });
    }
  }

  async getTotalCount(req: Request, res: Response) {
    try {
      const total = await Item.countDocuments();
      return res.status(200).json({ total });
    } catch (error) {
      return res.status(500).json({ message: "Error al obtener estadísticas" });
    }
  }
}
