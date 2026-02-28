import { Request, Response } from "express";
import userService from "../services/user.service";

const setCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string,
) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

class UserController {
  public registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userResponse = await userService.registerUser(req.body);
      res.status(201).json(userResponse);
    } catch (error: any) {
      const status = error.message === "El usuario ya existe" ? 400 : 500;
      res.status(status).json({ error: error.message });
    }
  };

  public getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  public getUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await userService.getUserById(req.params.id as string);
      res.status(200).json(user);
    } catch (error: any) {
      const status = error.message === "Usuario no encontrado" ? 404 : 500;
      res.status(status).json({ error: error.message });
    }
  };

  public deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      await userService.deleteUser(req.params.id as string);
      res.json({ message: "Usuario eliminado correctamente" });
    } catch (error: any) {
      const status = error.message === "Usuario no encontrado" ? 404 : 500;
      res.status(status).json({ error: error.message });
    }
  };

  public updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await userService.updateUser(
        req.params.id as string,
        req.body,
      );
      res.status(200).json(user);
    } catch (error: any) {
      const status = error.message === "Usuario no encontrado" ? 404 : 500;
      res.status(status).json({ error: error.message });
    }
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const { userResponse, accessToken, refreshToken } =
        await userService.loginUser(email, password);
      setCookies(res, accessToken, refreshToken);
      res.json({ message: "Login exitoso", user: userResponse });
    } catch (error: any) {
      const status = [
        "Credenciales inválidas",
        "Usuario no encontrado",
      ].includes(error.message)
        ? 401
        : 500;
      res.status(status).json({ message: error.message });
    }
  };

  public logout = async (req: Request, res: Response): Promise<void> => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logout exitoso" });
  };

  public googleLogin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.body;
      const { userResponse, accessToken, refreshToken } =
        await userService.googleLogin(token);
      setCookies(res, accessToken, refreshToken);
      res.json({ message: "Login Google exitoso", user: userResponse });
    } catch (error: any) {
      const status = error.message === "Token inválido" ? 401 : 500;
      res.status(status).json({ message: error.message });
    }
  };
}

export default new UserController();
