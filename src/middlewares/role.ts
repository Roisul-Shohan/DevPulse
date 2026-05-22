import AppError from "../errors/AppErrors";
import type { ROLES } from "../types";
import type { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";




const authorizeRole = (...roles: ROLES[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if(!userRole){
        throw new AppError(401, "Unauthorized");
    }

    if(!roles.includes(userRole)){
         throw new AppError(403, "Forbidden");
    }

    next();

  });
}

export default authorizeRole;