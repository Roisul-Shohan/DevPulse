import type{ Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import AppError from "../errors/AppErrors";
import config from "../config";
import catchAsync from "../utils/catchAsync";
import { pool } from "../db";

const verifyAuth = catchAsync(async(
  req: Request,
  res: Response,
  next: NextFunction
) => {

    const token = req.headers.authorization;

    if (!token) {
     throw new AppError(401, "Unauthorized");
    }

    const decoded = jwt.verify(token, config.jwt_secret as string) as JwtPayload;
    
    const userData = await pool.query(
        `
     SELECT * FROM users WHERE id=$1   
        `,
        [decoded.id],
      );

    const user = userData.rows[0];
    
    if(!user){
         throw new AppError(404, "User not found!");
    }
    req.user = decoded;
    next();
        
});

export default verifyAuth;
