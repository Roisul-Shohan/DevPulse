import  express  from "express";
import verifyAuth from "../../middlewares/auth";
import authorizeRole from "../../middlewares/role";
import { CreateIssue, getAllIssues, getSingleIssue } from "./issue.controller";

const router =express.Router();


router.post("/",verifyAuth,authorizeRole("contributor","maintainer"),CreateIssue);
router.get("/", getAllIssues);
router.get("/:id",getSingleIssue);


export const issueRouter = router;
