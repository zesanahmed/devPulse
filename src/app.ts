import cors from "cors";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import globalErrorHandler from "./middleware/globalErrorHandler.js";
import { authRoute } from "./modules/auth/auth.route.js";
import { issuesRoute } from "./modules/issues/issues.route.js";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "DevPulse API is running 🚀",
  });
});

// Routes
app.use("/api/auth", authRoute);
app.use("/api/issues", issuesRoute);

// Global Error Handling Middleware
app.use(globalErrorHandler);

export default app;
