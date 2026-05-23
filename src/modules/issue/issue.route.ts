import  express  from "express";
import verifyAuth from "../../middlewares/auth";
import authorizeRole from "../../middlewares/role";
import { CreateIssue, deleteIssue, getAllIssues, getSingleIssue, updateIssue } from "./issue.controller";

const router =express.Router();


router.post("/",verifyAuth,authorizeRole("contributor","maintainer"),CreateIssue);
router.get("/", getAllIssues);
router.get("/:id",getSingleIssue);
router.patch("/:id",verifyAuth,authorizeRole("contributor","maintainer"),updateIssue);
router.delete("/:id", verifyAuth,authorizeRole("maintainer"),deleteIssue);

export const issueRouter = router;
