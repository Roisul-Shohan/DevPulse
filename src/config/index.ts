import dotnev from "dotenv";
import path from "path";

dotnev.config({
    path: path.join(process.cwd(),".env"),
});

const config = {
    PORT : process.env.PORT,
};

export default config;




