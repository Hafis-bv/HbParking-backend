import { Request, Response, Router } from "express";
import { register } from "../controllers/auth.controller";
import { login } from "../controllers/auth.controller";
import { logout } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  createPlateNumber,
  deletePlateNumber,
  getMyPlateNumbers,
} from "../controllers/plateNumber.controller";

const router = Router();

router.get("/", authMiddleware, getMyPlateNumbers);
router.post("/", authMiddleware, createPlateNumber);
router.delete("/:plateNumberId", authMiddleware, deletePlateNumber);

export { router as plateRouter };
