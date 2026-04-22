import { Request, Response, Router } from "express";
import { register } from "../controllers/auth.controller";
import { login } from "../controllers/auth.controller";
import { logout } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and authorization endpoints
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account, hashes the password, sets an authentication cookie, and sends a registration email.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Parking
 *               email:
 *                 type: string
 *                 format: email
 *                 example: parking@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: 12345678
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User successfully registered!
 *                 newUser:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 75c39876-0062-452a-b98e-5074d9a48ff6
 *                     name:
 *                       type: string
 *                       example: Parking
 *                     email:
 *                       type: string
 *                       example: parking@example.com
 *       400:
 *         description: Validation error or user already exists
 *       500:
 *         description: Internal server error
 */
router.post("/register", register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a user
 *     description: Authenticates a user with email and password, then sets a JWT authentication cookie.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: parking@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: 12345678
 *     responses:
 *       200:
 *         description: Login successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 75c39876-0062-452a-b98e-5074d9a48ff6
 *                     name:
 *                       type: string
 *                       example: Parking
 *                     email:
 *                       type: string
 *                       example: parking@example.com
 *       400:
 *         description: Invalid credentials or missing fields
 *       500:
 *         description: Internal server error
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Log out the current user
 *     description: Clears the authentication cookie and logs the user out.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 *       500:
 *         description: Internal server error
 */
router.post("/logout", logout);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     description: Returns the currently authenticated user based on the JWT cookie.
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/me", authMiddleware, (req: Request, res: Response) => {
  return res.json({ user: req.user });
});

export { router as authRouter };
