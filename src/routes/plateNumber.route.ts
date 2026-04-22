import { Request, Response, Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  createPlateNumber,
  deletePlateNumber,
  getMyPlateNumbers,
} from "../controllers/plateNumber.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: PlateNumbers
 *   description: Manage user vehicle plate numbers
 */

/**
 * @swagger
 * /api/plates:
 *   get:
 *     summary: Get all plate numbers for the current user
 *     description: Returns a list of all vehicle plate numbers associated with the authenticated user.
 *     tags: [PlateNumbers]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of plate numbers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 plateNumbers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: uuid
 *                       plate:
 *                         type: string
 *                         example: 10AA123
 *                       userId:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/", authMiddleware, getMyPlateNumbers);

/**
 * @swagger
 * /api/plates:
 *   post:
 *     summary: Create a new plate number
 *     description: Adds a new vehicle plate number to the authenticated user's account.
 *     tags: [PlateNumbers]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - plateNumber
 *             properties:
 *               plateNumber:
 *                 type: string
 *                 example: 10AA123
 *     responses:
 *       200:
 *         description: Plate number created successfully
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
 *                   example: Plate number created
 *                 data:
 *                   type: object
 *       400:
 *         description: Validation error or plate already exists
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/", authMiddleware, createPlateNumber);

/**
 * @swagger
 * /api/plates/{plateNumberId}:
 *   delete:
 *     summary: Delete a plate number
 *     description: Deletes a specific plate number belonging to the authenticated user.
 *     tags: [PlateNumbers]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: plateNumberId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the plate number
 *     responses:
 *       200:
 *         description: Plate number deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Plate number deleted successfully
 *                 deletePlate:
 *                   type: object
 *       400:
 *         description: Invalid plate ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Plate not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:plateNumberId", authMiddleware, deletePlateNumber);

export { router as plateRouter };
