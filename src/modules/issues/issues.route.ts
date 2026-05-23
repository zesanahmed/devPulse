import { Router } from "express";
import auth from "../../middleware/auth.middleware.js";
import { USER_ROLE } from "../../types/index.js";
import { issuesController } from "./issues.controller.js";

const router = Router();

// Public routes
router.get("/", issuesController.getAllIssues);
router.get("/:id", issuesController.getIssueById);

// Authenticated users only
router.post(
  "/",
  auth(USER_ROLE.contributor, USER_ROLE.maintainer),
  issuesController.createIssue,
);

// Maintainer only )
router.patch(
  "/:id/status",
  auth(USER_ROLE.maintainer),
  issuesController.updateIssueStatus,
);

// Contributor (own + open) OR Maintainer (any)
router.patch(
  "/:id",
  auth(USER_ROLE.contributor, USER_ROLE.maintainer),
  issuesController.updateIssue,
);
router.delete("/:id", auth(USER_ROLE.maintainer), issuesController.deleteIssue);

export const issuesRoute = router;
