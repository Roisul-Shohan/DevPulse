import type { Request,Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { createIssueIntoDB, getAllIssuesFromDB, getReporterById, getSingleIssueFromDB } from "./issue.service";
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