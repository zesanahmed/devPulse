import { pool } from "../../config/db.js";
import type { IIssue, IUpdateStatus } from "./issues.interface.js";

const createIssue = async (payload: IIssue, reporterId: number) => {
  const { title, description, type } = payload;

  const result = await pool.query(
    `INSERT INTO issues (title, description, type, reporter_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [title, description, type, reporterId],
  );

  return result.rows[0];
};

const getAllIssues = async () => {
  const issuesResult = await pool.query(
    `SELECT * FROM issues ORDER BY created_at DESC`,
  );

  const issues = issuesResult.rows;

  if (issues.length === 0) return [];

  // Get all unique reporter IDs
  const reporterIds = [
    ...new Set(issues.map((issue) => issue.reporter_id as number)),
  ];

  // Fetch reporter info without JOIN
  const usersResult = await pool.query(
    `SELECT id, name, email, role FROM users WHERE id = ANY($1)`,
    [reporterIds],
  );

  const usersMap = new Map<number, object>();
  for (const user of usersResult.rows) {
    usersMap.set(user.id as number, user);
  }

  // Attach reporter info to each issue
  const issuesWithReporter = issues.map((issue) => ({
    ...issue,
    reporter: usersMap.get(issue.reporter_id as number) ?? null,
  }));

  return issuesWithReporter;
};

const getIssueById = async (id: string) => {
  const issueResult = await pool.query(`SELECT * FROM issues WHERE id = $1`, [
    id,
  ]);

  if ((issueResult.rowCount ?? 0) === 0) {
    throw new Error("Issue not found");
  }

  const issue = issueResult.rows[0];

  // Fetch reporter info without JOIN
  const userResult = await pool.query(
    `SELECT id, name, email, role FROM users WHERE id = $1`,
    [issue.reporter_id],
  );

  return {
    ...issue,
    reporter: userResult.rows[0] ?? null,
  };
};

const updateIssueStatus = async (id: string, payload: IUpdateStatus) => {
  const { status } = payload;

  const result = await pool.query(
    `UPDATE issues
     SET status = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [status, id],
  );

  if ((result.rowCount ?? 0) === 0) {
    throw new Error("Issue not found");
  }

  return result.rows[0];
};

const deleteIssue = async (id: string) => {
  const result = await pool.query(
    `DELETE FROM issues WHERE id = $1 RETURNING *`,
    [id],
  );

  if ((result.rowCount ?? 0) === 0) {
    throw new Error("Issue not found");
  }

  return result.rows[0];
};

export const issuesService = {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssueStatus,
  deleteIssue,
};
