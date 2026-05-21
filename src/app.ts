import  express, {type Request, type Response }  from "express";
import cors from "cors";

const app =express();


app.use(cors());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request,res:Response ) => {

    res.send("DevPulse Server Running") ;
});


export default app;