import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import stripe from "../config/stripe";
import { prisma } from "../utils/prisma";
import Stripe from "stripe";

export async function createCheckoutSession(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { balance } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return next(new AppError("Id is required", 400));
  }
  if (!balance) {
    return next(new AppError("Please provide an amount", 400));
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "azn",
            unit_amount: balance * 100,
            product_data: { name: "Balance top-up" },
          },
          quantity: 1,
        },
      ],
      customer_email: user.email,
      metadata: {
        userId: user.id,
        topUpAmount: balance.toString(),
      },

      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    return res.json({ url: session.url });
  } catch (err) {
    console.log(err);
    return next(new AppError("Internal Server Error", 500));
  }
}

export async function handleStripeWebhook(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const sig = req.headers["stripe-signature"] as string;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ error: "Webhook signature verification failed" });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { userId, topUpAmount } = session.metadata ?? {};
    if (!userId || !topUpAmount) {
      return res.status(404).json({ error: "Missing metadata" });
    }
    await prisma.user.update({
      where: { id: userId },
      data: {
        balance: {
          increment: parseFloat(topUpAmount),
        },
      },
    });
  }

  res.json({ received: true });
}
