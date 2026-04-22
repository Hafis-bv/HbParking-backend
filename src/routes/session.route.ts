import { Router } from "express";
import {
  endSession,
  getSession,
  startSession,
} from "../controllers/session.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: Manage parking sessions
 */

/**
 * @swagger
 * /api/sessions:
 *   get:
 *     summary: Get the current active session
 *     description: Returns the authenticated user's current active parking session, including zone and plate number details.
 *     tags: [Sessions]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Active session fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 75c39876-0062-452a-b98e-5074d9a48ff6
 *                     startTime:
 *                       type: string
 *                       format: date-time
 *                     endTime:
 *                       type: string
 *                       nullable: true
 *                       format: date-time
 *                     totalCost:
 *                       type: number
 *                       nullable: true
 *                       example: 2.5
 *                     userId:
 *                       type: string
 *                     zoneId:
 *                       type: string
 *                     plateNumberId:
 *                       type: string
 *                     zone:
 *                       type: object
 *                     plateNumber:
 *                       type: object
 *                 - type: "null"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/", authMiddleware, getSession);

/**
 * @swagger
 * /api/sessions/start:
 *   post:
 *     summary: Start a parking session
 *     description: Creates a new parking session for the authenticated user using a selected zone and plate number. Only one active session per vehicle is allowed.
 *     tags: [Sessions]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - zoneId
 *               - plateNumberId
 *             properties:
 *               zoneId:
 *                 type: string
 *                 example: 4f528c50-8995-4cb8-aef8-2d7d1a1bb123
 *               plateNumberId:
 *                 type: string
 *                 example: 8ac69f87-5f7a-4f83-bc3d-4a7f4dba4567
 *     responses:
 *       200:
 *         description: Session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Session created successfully
 *                 session:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     startTime:
 *                       type: string
 *                       format: date-time
 *                     endTime:
 *                       type: string
 *                       nullable: true
 *                       format: date-time
 *                     totalCost:
 *                       type: number
 *                       nullable: true
 *                     userId:
 *                       type: string
 *                     zoneId:
 *                       type: string
 *                     plateNumberId:
 *                       type: string
 *                     zone:
 *                       type: object
 *                     user:
 *                       type: object
 *                     plateNumber:
 *                       type: object
 *       400:
 *         description: Missing fields, active session exists, invalid ownership, or invalid data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Plate number or zone not found
 *       500:
 *         description: Internal server error
 */
router.post("/start", authMiddleware, startSession);

/**
 * @swagger
 * /api/sessions/end/{sessionId}:
 *   patch:
 *     summary: End a parking session
 *     description: Ends an active parking session, calculates the parking cost, and deducts the amount from the user's balance. The first 15 minutes are free.
 *     tags: [Sessions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the session to end
 *     responses:
 *       200:
 *         description: Session ended successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Session ended
 *                 totalCost:
 *                   type: number
 *                   example: 1.5
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     startTime:
 *                       type: string
 *                       format: date-time
 *                     endTime:
 *                       type: string
 *                       format: date-time
 *                     totalCost:
 *                       type: number
 *                       example: 1.5
 *                     userId:
 *                       type: string
 *                     zoneId:
 *                       type: string
 *                     plateNumberId:
 *                       type: string
 *       400:
 *         description: Invalid session ID, session already ended, insufficient balance, or session not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.patch("/end/:sessionId", authMiddleware, endSession);

export { router as sessionRouter };
