import bcrypt from "bcrypt";
import type { IUser } from "./auth.interface";
import { pool } from "../../db";



export const CreateUserIntoDB =  async (payload : IUser)=>{
    console.log(payload);
    const {name ,email , password,role}=payload;
    
    const hashedPassword = await bcrypt.hash(password,10);

    const result = await pool.query(`
        
         INSERT INTO users(name,email,password,role)
         VALUES ($1,$2,$3,COALESCE($4,'contributor') )
         RETURNING id,name,email,role,created_at,updated_at
        `,[name,email,hashedPassword,role]);

    return  result.rows[0];
        
}



export const findUserByEmail = async (
  email: string) => {
 
  const result = await pool.query(`
      SELECT * FROM users WHERE email= $1
        
    `,[email]);

    return result.rows[0];

}