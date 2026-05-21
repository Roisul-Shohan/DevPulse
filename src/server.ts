import app from "./app" ;
import config from "./config";
import { initDB } from "./db";

(()=>{
    initDB();
    app.listen(config.PORT, ()=>{
        console.log(`Server running on port ${config.PORT}`);
    })
})()


