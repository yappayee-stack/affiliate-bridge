import { v } from "convex/values";
import { action } from "./_generated/server";

declare const process: { env: Record<string, string | undefined> };

const PRODUCTS = {
  starter: {
    name: "Filter Foundations — Starter Pack",
    description:
      "Complete beginner's guide to Effect House. 6 chapters + bonus filter ideas.",
    amount: 2900, // $29
  },
  pro: {
    name: "Viral Filter Secrets — Pro Pack",
    description:
      "Advanced playbook: 60+ layer architecture, GAN overrides, viral launch strategy.",
    amount: 5900, // $59
  },
  bundle: {
    name: "Complete Filter Guide Bundle",
    description:
      "Both Filter Foundations + Viral Filter Secrets. Save $9.",
    amount: 7900, // $79
  },
};

export const createCheckoutSession = action({
  args: {
    name: v.string(),
    email: v.string(),
    product: v.union(
      v.literal("starter"),
      v.literal("pro"),
      v.literal("bundle")
    ),
  },
  handler: async (_ctx, args) => {
    const stripeKey =
      process.env.STRIPE_SECRET_KEY ||
      process.env.STRIPE_SECRET_KEY!;
    if (!stripeKey) throw new Error("Stripe not configured");

    const siteUrl =
      process.env.SITE_URL ||
      "https://affiliate-bridge-4a8f6373.viktor.space";
    const product = PRODUCTS[args.product];

    const params = new URLSearchParams();
    params.append("mode", "payment");
    params.append("payment_method_types[0]", "card");
    params.append("line_items[0][price_data][currency]", "usd");
    params.append(
      "line_items[0][price_data][product_data][name]",
      product.name
    );
    params.append(
      "line_items[0][price_data][product_data][description]",
      product.description
    );
    params.append(
      "line_items[0][price_data][unit_amount]",
      String(product.amount)
    );
    params.append("line_items[0][quantity]", "1");
    params.append("customer_email", args.email);
    params.append(
      "success_url",
      `${siteUrl}/filters?paid=true&product=${args.product}`
    );
    params.append("cancel_url", `${siteUrl}/filters?canceled=true`);
    params.append("metadata[product]", args.product);
    params.append("metadata[name]", args.name);
    params.append("metadata[email]", args.email);

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(stripeKey + ":")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Stripe error:", err);
      throw new Error("Payment setup failed. Please try again.");
    }

    const session = await res.json();
    return { url: session.url, sessionId: session.id };
  },
});
