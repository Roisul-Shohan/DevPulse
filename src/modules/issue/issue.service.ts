import { pool } from "../../db";
import AppError from "../../errors/AppErrors";
import type { IssuePayload, IUpdateIssue } from "./issue.interface";


export const createIssueIntoDB = async (payload: IssuePayload,id :number) => {
    
    const {title,description,type}=payload;

    const result = pool.query(`
        
        INSERT INTO issues (title,description,type,reporter_id)
        VALUES($1,$2,$3,$4) RETURNING *
        `,[title,description,type,id]);

    return (await result).rows[0];

}

export const getAllIssuesFromDB = async (
  sort = "newest",
  type?: string,
  status?: string
) => {

  let query = `SELECT * FROM issues`;
  const values: string[] = [];

  if (type && status) {
    query += ` WHERE type = $1 AND status = $2`;
    values.push(type, status);

  } else if (type) {
    query += ` WHERE type = $1`;
    values.push(type);

  } else if (status) {
    query += ` WHERE status = $1`;
    values.push(status);
  }

  if (sort === "oldest") {
    query += ` ORDER BY created_at ASC`;
  } else {
    query += ` ORDER BY created_at DESC`;
  }

  const result = await pool.query(query, values);

  const issues= result.rows;
  
  const IssuesWithUser = await Promise.all(
      issues.map(async (issue) => {
        const reporter = await getReporterById(issue.reporter_id);

         return {
                    id: issue.id,
                    title: issue.title,
                    description: issue.description,
                    type: issue.type,
                    status: issue.status,

                    reporter: {
                        id: reporter.id,
                        name: reporter.name,
                        role: reporter.role
                    },

                    created_at: issue.created_at,
                    updated_at: issue.updated_at
                }
            })
        )
    
    return  IssuesWithUser;


};

export const getReporterById = async (id: number) => {

    if(!id){
    throw new AppError(404,"id not found");
    }
    const result =await pool.query( `
        SELECT id, name, role FROM users
        WHERE id = $1
    `,[id]);

    if(result.rows.length === 0){
        throw new AppError(404,"user not found ");
    }

    return result.rows[0];
};


export const getSingleIssueFromDB = async (id: string) => {
  const query = `
    SELECT * FROM issues WHERE id = $1
  `;

  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const updateIssueIntoDB = async (
  id: string,
  payload: IUpdateIssue
) => {

    const {title,description,type} =payload;

    const updateIssue = await pool.query(`
        UPDATE issues SET 
            title = COALESCE($1,title),
            description = COALESCE($2,description),
            type = COALESCE($3,type),
            updated_at = NOW()
        WHERE id = $4  RETURNING *
        `,[title,description,type,id])

    return updateIssue.rows[0];
}