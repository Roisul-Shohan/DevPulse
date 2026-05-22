import  express, {type NextFunction, type Request, type Response }  from "express";
import cors from "cors";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import { authRouter } from "./modules/auth/auth.route";
import { issueRouter } from "./modules/issue/issue.route";

const app =express();


app.use(cors());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request,res:Response ) => {

    res.send("DevPulse Server Running") ;
});

app.use("/api/auth",authRouter);
app.use("/api/issues",issueRouter);


app.use((req: Request, res: Response, next: NextFunction) => {
 return res.status(404).json({
    success: false,
    message: "API Not Found",
  });
});


app.use(globalErrorHandler);


export default app;