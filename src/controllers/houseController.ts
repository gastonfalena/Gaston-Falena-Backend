import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateHouseDto } from "../dto/create-house.dto";
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

      // Buscamos en la DB filtrando por el owner
      const houses = await House.find({ owner: userId });

      return res.status(200).json(houses);
    } catch (error) {
      return res.status(500).json({ message: "Error al obtener tus casas" });
    }
  }
}
