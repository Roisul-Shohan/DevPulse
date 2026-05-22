import type { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { CreateUserIntoDB,  findUserByEmail } from "./auth.service";
import sendResponse from "../../utils/sendResponse";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "../../config";
import type { StringValue } from "ms";

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

export const loginUser = catchAsync(async (req, res) => {

    const {email,password}=req.body;
    const user =await findUserByEmail(email);

    if(!user){

      return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "User not found",

    });
    }
    
    const isPasswordValid =await bcrypt.compare(password,user.password);

    if(!isPasswordValid){

      return sendResponse(res, {
      statusCode: 401,
      success: false,
      message: "Invalid credentials"

    });
    }

    const jwtpayload = {
        id : user.id,
        name : user.name ,
        role : user.role,  
    };
    
    const token = jwt.sign(jwtpayload,config.jwt_secret as string,
        {
            expiresIn : config.jwt_expire_in as StringValue
        });

    delete user.password;

    sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Login successful",
    data : {
        token,
        user
    }

    });

});

