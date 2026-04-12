import express from "express";
import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  createCheckoutSession,
  handleStripeWebhook,
} from "../controllers/checkout.controller";

const router = Router();

router.post(
  "/create-checkout-session",
  express.json(),
  authMiddleware,
  createCheckoutSession,
);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook,
);

export { router as checkoutRouter };
