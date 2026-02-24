import Item from "../models/itemModel";
import { IItemRepository } from "../interfaces/item.interfase";

class ItemRepository implements IItemRepository {
  async create(data: any) {
    const newItem = new Item(data);
    return await newItem.save();
  }

  async findByContainerId(containerId: string) {
    return await Item.find({ container: containerId });
  }

  async findByIdWithContainerAndHouse(id: string) {
    return await Item.findById(id).populate({
      path: "container",
      populate: { path: "house" },
    });
  }

  async updateById(id: string, data: any) {
    const item = await Item.findById(id);
    if (!item) return null;
    if (data.name !== undefined) item.name = data.name;
    if (data.quantity !== undefined) item.quantity = data.quantity;
    return await item.save();
  }

  async deleteById(id: string) {
    return await Item.deleteOne({ _id: id });
  }

  async countAll() {
    return await Item.countDocuments();
  }
}

export default new ItemRepository();
