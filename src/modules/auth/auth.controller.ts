import type { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { CreateUserIntoDB } from "./auth.service";
import sendResponse from "../../utils/sendResponse";

export const registerUser = catchAsync(
    async(req : Request, res: Response) =>{
        console.log(req.body);
        const result = await CreateUserIntoDB(req.body);

        sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "User registered successfully",
        data: result,
    });
    }
)