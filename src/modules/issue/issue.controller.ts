import type { Request,Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { createIssueIntoDB } from "./issue.service";
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