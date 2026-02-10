import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateItemDto } from "../dto/create-item.dto";
import { UpdateItemDto } from "../dto/update-item.dto";
import Item from "../models/itemModel";
import Container from "../models/containerModel";
import House from "../models/houseModel";

export default class ItemController {
  async create(req: Request, res: Response) {
    try {
      const dto = plainToInstance(CreateItemDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) return res.status(400).json({ errors });

      const userId = (req as any).user.id;

      const container = await Container.findById(dto.containerId);
      if (!container)
        return res.status(404).json({ message: "Container no existe" });

      const house = await House.findOne({
        _id: container.house,
        owner: userId,
      });
      if (!house)
        return res
          .status(403)
          .json({ message: "No tenés permiso en esta casa" });

      const newItem = new Item({
        name: dto.name,
        quantity: dto.quantity || 1,
        container: dto.containerId,
      });
      await newItem.save();
      return res.status(201).json(newItem);
    } catch (error) {
      console.log(error);
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
      if (!container || (container.house as any).owner.toString() !== userId) {
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
      const userId = (req as any).user.id;

      const dto = plainToInstance(UpdateItemDto, req.body);
      const errors = await validate(dto);

      if (errors.length > 0) {
        return res.status(400).json({
          message: "Error de validación",
          errors: errors.map((err) => Object.values(err.constraints || {})),
        });
      }

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
      if (dto.name !== undefined) item.name = dto.name;
      if (dto.quantity !== undefined) item.quantity = dto.quantity;

      const updatedItem = await item.save();

      return res.status(200).json({
        message: "Item actualizado correctamente",
        data: updatedItem,
      });
    } catch (error) {
      console.error(error);
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
}
