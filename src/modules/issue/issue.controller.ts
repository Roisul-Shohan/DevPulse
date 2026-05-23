import type { Request,Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { createIssueIntoDB, deleteIssueFromDB, getAllIssuesFromDB, getReporterById, getSingleIssueFromDB, updateIssueIntoDB } from "./issue.service";
import sendResponse from "../../utils/sendResponse";




export const CreateIssue = catchAsync(
    async(req : Request,res: Response)=>{
        const id = req.user?.id;
        
        const result = await createIssueIntoDB(req.body,id);

        sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Issue created successfully",
        data: result,
        });

    }
)

export const getAllIssues = catchAsync(
  async (req: Request, res: Response) => {
    const { sort, type, status } = req.query;

    const result = await getAllIssuesFromDB(
      sort as string,
      type as string,
      status as string
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issues retrieved successfully",
      data: result,
    });
  }
);

export const getSingleIssue = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const issue = await getSingleIssueFromDB(id as string);

    if (!issue) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Issue not found",
      });
    }

    const reporter = await getReporterById(issue.reporter_id);

    const enrichedIssue = {
                    id: issue.id,
                    title: issue.title,
                    description: issue.description,
                    type: issue.type,
                    status: issue.status,

                    reporter: {
                        id: reporter.id,
                        name: reporter.name,
                        role: reporter.role
                    },

                    created_at: issue.created_at,
                    updated_at: issue.updated_at
                }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue retrieved successfully",
      data: enrichedIssue,
    });
  }
);

export const updateIssue = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const issue = await getSingleIssueFromDB(id as string);

    if (!issue) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Issue not found",
      });
    }

    const User = req.user;

    if (User?.role === "maintainer") {
      const result = await updateIssueIntoDB(id as string, req.body);

      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Issue updated successfully",
        data: result,
      });
    }

    if (User?.role === "contributor") {
      
      if (issue.reporter_id !== User.id) {
        return sendResponse(res, {
          statusCode: 403,
          success: false,
          message: "You can update only your own issues",
        });
      }

      if (issue.status !== "open") {
        return sendResponse(res, {
          statusCode: 403,
          success: false,
          message: "You can update issue only when status is open",
        });
      }

      const result = await updateIssueIntoDB(id as string, req.body);

      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Issue updated successfully",
        data: result,
      });
    }
  }
);

export const deleteIssue = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const issue = await getSingleIssueFromDB(id as string);

    if (!issue) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Issue not found",
      });
    }

    if (req.user?.role !== "maintainer") {
      return sendResponse(res, {
        statusCode: 403,
        success: false,
        message: "Only maintainers can delete issues",
      });
    }

    await deleteIssueFromDB(id as string);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue deleted successfully",
    });
  }
);