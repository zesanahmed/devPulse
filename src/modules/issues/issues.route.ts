import { Router } from "express";
import auth from "../../middleware/auth.middleware.js";
import { USER_ROLE } from "../../types/index.js";
import { issuesController } from "./issues.controller.js";

const router = Router();

// Public
router.get("/", issuesController.getAllIssues);

// Logged in users only
router.post(
  "/",
  auth(USER_ROLE.contributor, USER_ROLE.maintainer),
  issuesController.createIssue,
);
router.get(
  "/:id",
  auth(USER_ROLE.contributor, USER_ROLE.maintainer),
  issuesController.getIssueById,
);

// Maintainer only
router.patch(
  "/:id/status",
  auth(USER_ROLE.maintainer),
  issuesController.updateIssueStatus,
);
router.delete("/:id", auth(USER_ROLE.maintainer), issuesController.deleteIssue);

export const issuesRoute = router;
