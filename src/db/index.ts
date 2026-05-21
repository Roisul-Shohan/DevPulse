import { Pool } from "pg";
import config from "../config";


export const pool =new Pool({
    connectionString : config.Connection_string,
});

export const initDB = async ()=>{
    try{
    await pool.query(`
        
          CREATE TABLE IF NOT EXISTS  users (
            id SERIAL PRIMARY KEY,
            name  VARCHAR(64) NOT NULL,
            email VARCHAR(64) UNIQUE NOT NULL,
            password text NOT NULL,
            role VARCHAR(20) DEFAULT 'contributor' ,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW(),

            CHECK (role in ('contributor', 'maintainer'))

          )
        
        `);

        await pool.query(`

             CREATE TABLE IF NOT EXISTS issues(
             
              id SERIAL PRIMARY KEY,
              title  VARCHAR(150) NOT NULL,
              description text NOT NULL,
              type VARCHAR(20) NOT NULL,
              status VARCHAR(20) DEFAULT 'open',
              reporter_id INTEGER NOT NULL,
              created_at TIMESTAMP DEFAULT NOW(),
              updated_at TIMESTAMP DEFAULT NOW(),

              CHECK(LENGTH(description)>=20),
              CHECK(type IN('bug','feature_request')),
              CHECK(status IN ('open','in_progress','resolved'))
             )
            
            `);

        console.log("Database connected successfully!");
        }catch(err){
           console.log(err);
        }
}

