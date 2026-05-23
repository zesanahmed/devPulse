import type { Request, Response } from "express";
import sendResponse from "../../utility/sendResponse.js";
import { issuesService } from "./issues.service.js";

const createIssue = async (req: Request, res: Response): Promise<void> => {
  try {
    const reporterId = req.user!.id;
    const result = await issuesService.createIssue(req.body, reporterId);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Issue created successfully",
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

const getAllIssues = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sort } = req.query;
    const result = await issuesService.getAllIssues(sort as string);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issues retrieved successfully",
      data: result,
    });
  } catch (error: unknown) {
    const err = error as Error;
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: err.message,
      errors: err,
    });
  }
};

const getIssueById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await issuesService.getIssueById(id as string);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue retrieved successfully",
      data: result,
    });
  } catch (error: unknown) {
    const err = error as Error;
    sendResponse(res, {
      statusCode: 404,
      success: false,
      message: err.message,
      errors: err,
    });
  }
};

const updateIssueStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await issuesService.updateIssueStatus(
      id as string,
      req.body,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue status updated successfully",
      data: result,
    });
  } catch (error: unknown) {
    const err = error as Error;
    sendResponse(res, {
      statusCode: 404,
      success: false,
      message: err.message,
      errors: err,
    });
  }
};

const updateIssue = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const result = await issuesService.updateIssue(
      id as string,
      req.body,
      userId,
      userRole,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue updated successfully",
      data: result,
    });
  } catch (error: unknown) {
    const err = error as Error;

    const statusCode = err.message.startsWith("Forbidden")
      ? 403
      : err.message === "Issue not found"
        ? 404
        : 400;

    sendResponse(res, {
      statusCode,
      success: false,
      message: err.message,
      errors: err,
    });
  }
};

const deleteIssue = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await issuesService.deleteIssue(id as string);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error: unknown) {
    const err = error as Error;
    sendResponse(res, {
      statusCode: 404,
      success: false,
      message: err.message,
      errors: err,
    });
  }
};
export const issuesController = {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssueStatus,
  updateIssue,
  deleteIssue,
};
