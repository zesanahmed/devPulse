import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../../config/db.js";
import type { ILogin, ISignup } from "./auth.interface.js";

const signup = async (payload: ISignup) => {
  const { name, email, password, role } = payload;

  // Check if user already exists
  const existingUser = await pool.query(
    `SELECT id FROM users WHERE email = $1`,
    [email],
  );

  if ((existingUser.rowCount ?? 0) > 0) {
    throw new Error("User already exists with this email");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, COALESCE($4, 'contributor'))
     RETURNING id, name, email, role, created_at`,
    [name, email, hashedPassword, role],
  );

  return result.rows[0];
};

const login = async (payload: ILogin) => {
  const { email, password } = payload;

  // Check if user exists
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  if ((result.rowCount ?? 0) === 0) {
    throw new Error("Invalid email or password");
  }

  const user = result.rows[0];

  // Check password
  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new Error("Invalid email or password");
  }

  // Generate JWT
  const jwtSecret = process.env["JWT_SECRET"];
  if (!jwtSecret) throw new Error("JWT_SECRET is not defined");

  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      role: user.role,
    },
    jwtSecret,
    { expiresIn: "7d" },
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const authService = {
  signup,
  login,
};
