import express from "express";
import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  createCheckoutSession,
  handleStripeWebhook,
} from "../controllers/checkout.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment and Stripe checkout endpoints
 */

/**
 * @swagger
 * /api/checkout/create-checkout-session:
 *   post:
 *     summary: Create a Stripe Checkout session
 *     description: Creates a Stripe Checkout session for balance top-up and returns a payment URL.
 *     tags: [Payments]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - balance
 *             properties:
 *               balance:
 *                 type: number
 *                 example: 10
 *                 description: Amount to top up the user balance with
 *     responses:
 *       200:
 *         description: Stripe Checkout session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: https://checkout.stripe.com/c/pay/cs_test_example
 *       400:
 *         description: Missing required data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post(
  "/create-checkout-session",
  express.json(),
  authMiddleware,
  createCheckoutSession,
);

/**
 * @swagger
 * /api/checkout/webhook:
 *   post:
 *     summary: Stripe webhook endpoint
 *     description: Receives Stripe webhook events and updates user balance after successful payment completion.
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       description: Raw Stripe webhook payload
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook received successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 received:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Webhook signature verification failed
 *       404:
 *         description: Missing metadata
 *       500:
 *         description: Internal server error
 */
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook,
);

export { router as checkoutRouter };
