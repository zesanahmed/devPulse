import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload, TUserRole } from "../types/index.js";
import sendResponse from "../utility/sendResponse.js";

const auth = (...roles: TUserRole[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const authHeader = req.headers["authorization"];

      if (!authHeader?.startsWith("Bearer ")) {
        sendResponse(res, {
          statusCode: 401,
          success: false,
          message: "Unauthorized: No token provided",
        });
        return;
      }

      const token = authHeader.split(" ")[1];

      if (!token) {
        sendResponse(res, {
          statusCode: 401,
          success: false,
          message: "Unauthorized: No token provided",
        });
        return;
      }

      const jwtSecret = process.env["JWT_SECRET"];
      if (!jwtSecret) throw new Error("JWT_SECRET is not defined");

      const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

      // Role check
      if (roles.length > 0 && !roles.includes(decoded.role)) {
        sendResponse(res, {
          statusCode: 403,
          success: false,
          message: "Forbidden: You do not have permission",
        });
        return;
      }

      req.user = decoded;
      next();
    } catch (error: unknown) {
      const err = error as Error;
      sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Unauthorized: Invalid or expired token",
        errors: err,
      });
    }
  };
};

export default auth;
