import type { Request, Response } from "express";
import sendResponse from "../../utility/sendResponse.js";
import { authService } from "./auth.service.js";

const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await authService.signup(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error: unknown) {
    const err = error as Error;
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: err.message,
      errors: err,
    });
  }
};

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await authService.login(req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: unknown) {
    const err = error as Error;
    sendResponse(res, {
      statusCode: 401,
      success: false,
      message: err.message,
      errors: err,
    });
  }
};

export const authController = {
  signup,
  login,
};
