import { Router } from "express";
import {
  createZone,
  deleteZone,
  getAllZones,
  getZoneById,
} from "../controllers/zone.controller";
import { authMiddleware } from "../middleware/authMiddleware";
import { isAdmin } from "../middleware/isAdmin";

const router = Router();

router.get("/", authMiddleware, getAllZones);
router.get("/:id", authMiddleware, getZoneById);
router.post("/", authMiddleware, isAdmin, createZone);
router.delete("/:id", authMiddleware, isAdmin, deleteZone);

export { router as zoneRouter };
