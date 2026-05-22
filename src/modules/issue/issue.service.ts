import { pool } from "../../db";
import type { TIssuePayload } from "./issue.interface";


export const createIssueIntoDB = async (payload: TIssuePayload,id :number) => {
    
    const {title,description,type}=payload;

    const result = pool.query(`
        
        INSERT INTO issues (title,description,type,reporter_id)
        VALUES($1,$2,$3,$4) RETURNING *
        `,[title,description,type,id]);

    return (await result).rows[0];

}