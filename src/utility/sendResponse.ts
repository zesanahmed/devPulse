import type { Response } from "express";

interface IResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data?: unknown;
  errors?: unknown;
}

const sendResponse = (res: Response, payload: IResponse): void => {
  res.status(payload.statusCode).json({
    success: payload.success,
    message: payload.message,
    ...(payload.data !== undefined && { data: payload.data }),
    ...(payload.errors !== undefined && { errors: payload.errors }),
  });
};

export default sendResponse;
