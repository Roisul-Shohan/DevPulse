import  express  from "express";
import verifyAuth from "../../middlewares/auth";
import authorizeRole from "../../middlewares/role";
import { CreateIssue } from "./issue.controller";

const router =express.Router();


router.post("/",verifyAuth,authorizeRole("contributor","maintainer"),CreateIssue)


export const issueRouter = router;
