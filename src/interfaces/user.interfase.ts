import { CreateUserDto } from "../dto/create-user.dto";

export type MongooseUser = Record<string, unknown> & {
  _id: { toString(): string };
  email: string;
  password?: string;
  toObject?: () => Record<string, unknown>;
};

export interface IUserRepository {
  findByEmail(email: string): Promise<any | null>;
  findById(id: string): Promise<any | null>;
  findAll(): Promise<any[]>;
  create(userData: Partial<CreateUserDto> | any): Promise<any>;
  deleteById(id: string): Promise<any | null>;
  updateById(id: string, updateData: any): Promise<any | null>;
}
