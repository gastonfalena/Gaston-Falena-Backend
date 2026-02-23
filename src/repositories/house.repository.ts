import House from "../models/houseModel";
import { IHouseRepository } from "../interfaces/house.interfase";

class HouseRepository implements IHouseRepository {
  async create(data: any) {
    const newHouse = new House(data);
    return await newHouse.save();
  }

  async findByOwner(ownerId: string) {
    return await House.find({ owner: ownerId });
  }

  async findByIdAndOwner(id: string, ownerId: string) {
    return await House.findOne({ _id: id, owner: ownerId });
  }

  async updateByIdAndOwner(id: string, ownerId: string, data: any) {
    return await House.findOneAndUpdate(
      { _id: id, owner: ownerId },
      { $set: data },
      { new: true },
    );
  }

  async deleteByIdAndOwner(id: string, ownerId: string) {
    return await House.findOneAndDelete({ _id: id, owner: ownerId });
  }
}

export default new HouseRepository();
