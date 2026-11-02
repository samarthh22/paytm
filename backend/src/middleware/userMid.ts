import { NextFunction, Response } from "express";
import { AuthRequest } from "../types";
import jwt, { JwtPayload } from "jsonwebtoken";
export const userMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Session expired login again",
    });
  }
  const token = authHeader.split(" ")[1] as string;

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;

    if (!decoded || !decoded.id) {
      return res.status(403).json({
        message: "Invlaid token",
      });
    }
    req.userId = decoded.id as string;
    next();
  } catch (error) {
    return res.status(403).json({
      message: "Invalid or expired token",
    });
  }
};
