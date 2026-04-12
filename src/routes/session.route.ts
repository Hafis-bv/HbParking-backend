import { Router } from "express";
import {
  endSession,
  getSession,
  startSession,
} from "../controllers/session.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/", authMiddleware, getSession);
router.post("/start", authMiddleware, startSession);
router.patch("/end/:sessionId", authMiddleware, endSession);

export { router as sessionRouter };
