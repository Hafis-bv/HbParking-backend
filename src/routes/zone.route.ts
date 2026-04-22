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

/**
 * @swagger
 * tags:
 *   name: Zones
 *   description: Manage parking zones
 */

/**
 * @swagger
 * /api/zones:
 *   get:
 *     summary: Get all zones
 *     description: Returns a list of all parking zones.
 *     tags: [Zones]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of zones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                     example: Zone A
 *                   pricePerHour:
 *                     type: number
 *                     example: 2.5
 *                   maxCapacity:
 *                     type: number
 *                     example: 50
 *                   address:
 *                     type: string
 *                     example: Baku, Nizami street
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/", authMiddleware, getAllZones);

/**
 * @swagger
 * /api/zones/{id}:
 *   get:
 *     summary: Get zone by ID
 *     description: Returns a specific parking zone by its ID.
 *     tags: [Zones]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Zone ID
 *     responses:
 *       200:
 *         description: Zone found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Invalid ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Zone not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", authMiddleware, getZoneById);

/**
 * @swagger
 * /api/zones:
 *   post:
 *     summary: Create a new zone
 *     description: Creates a new parking zone (Admin only).
 *     tags: [Zones]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - pricePerHour
 *               - maxCapacity
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *                 example: Zone A
 *               pricePerHour:
 *                 type: number
 *                 example: 2.5
 *               maxCapacity:
 *                 type: number
 *                 example: 50
 *               address:
 *                 type: string
 *                 example: Baku, Nizami street
 *     responses:
 *       200:
 *         description: Zone successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Zone successfully created!
 *                 zone:
 *                   type: object
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 *       500:
 *         description: Internal server error
 */
router.post("/", authMiddleware, isAdmin, createZone);

/**
 * @swagger
 * /api/zones/{id}:
 *   delete:
 *     summary: Delete a zone
 *     description: Deletes a parking zone by ID (Admin only).
 *     tags: [Zones]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Zone ID
 *     responses:
 *       200:
 *         description: Zone successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Zone successfully deleted
 *                 zone:
 *                   type: object
 *       400:
 *         description: Invalid ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 *       404:
 *         description: Zone not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", authMiddleware, isAdmin, deleteZone);

export { router as zoneRouter };
