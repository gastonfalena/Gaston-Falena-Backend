import Container from "../models/containerModel";
import { IContainerRepository } from "../interfaces/container.interface";

class ContainerRepository implements IContainerRepository {
  async create(data: any) {
    const newContainer = new Container(data);
    return await newContainer.save();
  }

  async findByHouseId(houseId: string) {
    return await Container.find({ house: houseId });
  }

  async findByIdWithHouse(id: string) {
    return await Container.findById(id).populate("house");
  }

  async updateName(id: string, name: string) {
    const container = await Container.findById(id);
    if (!container) return null;
    container.name = name;
    await container.save();
    return container;
  }

  async deleteById(id: string) {
    return await Container.deleteOne({ _id: id });
  }
}

export default new ContainerRepository();
