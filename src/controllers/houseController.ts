import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateHouseDto } from "../dto/create-house.dto";
import { UpdateHouseDto } from "../dto/update-house.dto";
import House from "../models/houseModel";

export default class HouseController {
  async create(req: Request, res: Response) {
    try {
      const houseDto = plainToInstance(CreateHouseDto, req.body);
      const errors = await validate(houseDto);

      if (errors.length > 0) {
        return res.status(400).json({ message: "Validación fallida", errors });
      }

      const userId = (req as any).user.id;
      const newHouse = new House({
        ...houseDto,
        owner: userId,
      });

      await newHouse.save();

      return res.status(201).json({
        message: "Casa creada y vinculada a tu usuario",
        data: newHouse,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error al procesar la creación de la casa" });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;

      const houses = await House.find({ owner: userId });

      return res.status(200).json(houses);
    } catch (error) {
      return res.status(500).json({ message: "Error al obtener tus casas" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;

      const updateDto = plainToInstance(UpdateHouseDto, req.body);
      const errors = await validate(updateDto);

      if (errors.length > 0) {
        return res.status(400).json({ message: "Validación fallida", errors });
      }

      const updatedHouse = await House.findOneAndUpdate(
        { _id: id, owner: userId },
        { $set: updateDto },
        { new: true },
      );

      if (!updatedHouse) {
        return res
          .status(404)
          .json({ message: "Casa no encontrada o no tenés permiso" });
      }

      return res.status(200).json({
        message: "Casa actualizada correctamente",
        data: updatedHouse,
      });
    } catch (error) {
      return res.status(500).json({ message: "Error al actualizar la casa" });
    }
  }
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;

      const deletedHouse = await House.findOneAndDelete({
        _id: id,
        owner: userId,
      });

      if (!deletedHouse) {
        return res.status(404).json({
          message:
            "No se encontró la casa o no tienes permisos para eliminarla",
        });
      }

      return res.status(200).json({
        message: "Casa eliminada correctamente",
        id: deletedHouse._id,
      });
    } catch (error) {
      return res.status(500).json({ message: "Error al eliminar la casa" });
    }
  }
}
