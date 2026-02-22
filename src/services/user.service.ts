import userRepository from "../repositories/user.repository";
import { CreateUserDto } from "../dto/create-user.dto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class UserService {
  async registerUser(userData: CreateUserDto) {
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("El usuario ya existe");
    }
    const hashPassword = await bcrypt.hash(userData.password, 10);
    const newUser = await userRepository.create({
      ...userData,
      password: hashPassword,
    });

    const { password, ...userResponse } = newUser.toObject();
    return userResponse;
  }

  async getAllUsers() {
    return await userRepository.findAll();
  }

  async getUserById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) throw new Error("Usuario no encontrado");
    return user;
  }

  async deleteUser(id: string) {
    const user = await userRepository.deleteById(id);
    if (!user) throw new Error("Usuario no encontrado");
    return user;
  }

  async updateUser(id: string, updateData: any) {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    const user = await userRepository.updateById(id, updateData);
    if (!user) throw new Error("Usuario no encontrado");
    return user;
  }

  async loginUser(email: string, passwordRaw: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error("Usuario no encontrado");

    const isMatch = await bcrypt.compare(passwordRaw, user.password);
    if (!isMatch) throw new Error("Credenciales inválidas");

    return this.generateAuthTokens(user);
  }

  async googleLogin(token: string) {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) throw new Error("Token inválido");

    const { email, name } = payload;
    let user = await userRepository.findByEmail(email as string);

    if (!user) {
      const hashPassword = await bcrypt.hash(
        Math.random().toString(36).slice(-10),
        10,
      );
      user = await userRepository.create({
        name,
        email,
        password: hashPassword,
      });
    }

    return this.generateAuthTokens(user);
  }

  private generateAuthTokens(user: any) {
    const jwtAccessSecret = process.env.JWT_SECRET as string;
    const jwtAccessExpiresIn = process.env
      .JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"];
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET as string;

    if (!jwtAccessSecret || !jwtRefreshSecret) {
      throw new Error("JWT no definido");
    }

    const accessToken = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      jwtAccessSecret,
      { expiresIn: jwtAccessExpiresIn },
    );

    const refreshToken = jwt.sign(
      { userId: user._id.toString() },
      jwtRefreshSecret,
      { expiresIn: jwtAccessExpiresIn },
    );

    const rawUser = user.toObject ? user.toObject() : user;
    const { password, ...userResponse } = rawUser;

    return { userResponse, accessToken, refreshToken };
  }
}

export default new UserService();
