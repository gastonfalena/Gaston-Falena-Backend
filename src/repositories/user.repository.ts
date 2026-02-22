import User from "../models/userModel";
import { CreateUserDto } from "../dto/create-user.dto";
import { IUserRepository } from "../interfaces/user.interfase";

class UserRepository implements IUserRepository {
  async findByEmail(email: string) {
    return await User.findOne({ email });
  }

  async findById(id: string) {
    return await User.findById(id).select("-password");
  }

  async findAll() {
    return await User.find().select("-password");
  }

  async create(userData: Partial<CreateUserDto> | any) {
    return await User.create(userData);
  }

  async deleteById(id: string) {
    return await User.findByIdAndDelete(id);
  }

  async updateById(id: string, updateData: any) {
    return await User.findByIdAndUpdate(id, updateData, { new: true }).select(
      "-password",
    );
  }
}

export default new UserRepository();
