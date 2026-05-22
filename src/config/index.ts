import dotnev from "dotenv";
import path from "path";


dotnev.config({
    path: path.join(process.cwd(),".env"),
});

const config = {
    PORT : process.env.PORT,
    Connection_string : process.env.CONNECTIONSTRING,
    jwt_secret : process.env.JWT_SECRET ,
    jwt_expire_in : process.env.JWT_EXPIRES_IN 
};

export default config;




