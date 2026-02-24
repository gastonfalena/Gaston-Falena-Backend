import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

export const refreshTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token no encontrado" });
    }

    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
    if (!jwtRefreshSecret) {
      return res
        .status(500)
        .json({ message: "Error de configuración del servidor" });
    }

    const decoded = jwt.verify(refreshToken, jwtRefreshSecret) as any;
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const jwtAccessSecret = process.env.JWT_SECRET!;
    const jwtAccessExpiresIn = process.env.JWT_EXPIRES_IN!;

    const newAccessToken = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      jwtAccessSecret,
      { expiresIn: jwtAccessExpiresIn as jwt.SignOptions["expiresIn"] },
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 1000,
    });

    next();
  } catch (error) {
    return res.status(401).json({ message: "Refresh token inválido" });
  }
};
