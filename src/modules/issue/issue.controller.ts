import type { Request,Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { createIssueIntoDB, getAllIssuesFromDB } from "./issue.service";
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