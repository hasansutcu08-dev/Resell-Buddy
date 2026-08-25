/**
 * Subscription plans for Resell Buddy.
 * Enforced in API, worker, and Discord bot.
 * Billing is via Whop (primary) with optional Stripe mapping.
 */

export type PlanId = "free" | "pro" | "elite";

export interface PlanLimits {
  id: PlanId;
  name: string;
  monitors: number; // 0 = unlimited
  priceWatches: number;
  discordDms: boolean;
  discordRoles: boolean;
  sharedProxies: boolean;
  accountActions: boolean;
  prioritySupport: boolean;
  monthlyPriceCents: number;
  yearlyPriceCents: number;
}

export const PLANS: Record<PlanId, PlanLimits> = {
  free: {
    id: "free",
    name: "Free",
    monitors: 1,
    priceWatches: 0,
    discordDms: false,
    discordRoles: false,
    sharedProxies: false,
    accountActions: false,
    prioritySupport: false,
    monthlyPriceCents: 0,
    yearlyPriceCents: 0,
  },
  pro: {
    id: "pro",
    name: "Pro",
    monitors: 10,
    priceWatches: 5,
    discordDms: true,
    discordRoles: true,
    sharedProxies: true,
    accountActions: false,
    prioritySupport: true,
    monthlyPriceCents: 1499,
    yearlyPriceCents: 14900,
  },
  elite: {
    id: "elite",
    name: "Elite",
    monitors: 0,
    priceWatches: 0,
    discordDms: true,
    discordRoles: true,
    sharedProxies: true,
    accountActions: true,
    prioritySupport: true,
    monthlyPriceCents: 2999,
    yearlyPriceCents: 29900,
  },
};

/** Live Whop plan IDs (biz_Jqhj2PEBBvSaMI / prod_paXtUuRtqX13D) */
export const WHOP_PLANS = {
  proMonthly: "plan_vAO3R1lqZ11UT",
  proYearly: "plan_UNnsnnhzGRy9Y",
  eliteMonthly: "plan_3aG0H3FQibNZ4",
  eliteYearly: "plan_swwMjSoMLni4Z",
} as const;

export const WHOP_CHECKOUT = {
  proMonthly: "https://whop.com/checkout/plan_vAO3R1lqZ11UT",
  proYearly: "https://whop.com/checkout/plan_UNnsnnhzGRy9Y",
  eliteMonthly: "https://whop.com/checkout/plan_3aG0H3FQibNZ4",
  eliteYearly: "https://whop.com/checkout/plan_swwMjSoMLni4Z",
  product: "https://whop.com/resell-buddy",
} as const;

export function canCreateMonitor(plan: PlanId, currentCount: number): boolean {
  const limit = PLANS[plan].monitors;
  if (limit === 0) return true;
  return currentCount < limit;
}

export function planFromWhopPlanId(planId: string): PlanId {
  if (planId === WHOP_PLANS.eliteMonthly || planId === WHOP_PLANS.eliteYearly) {
    return "elite";
  }
  if (planId === WHOP_PLANS.proMonthly || planId === WHOP_PLANS.proYearly) {
    return "pro";
  }
  return "free";
}

export function planFromStripePrice(
  priceId: string,
  env: Record<string, string | undefined>
): PlanId {
  if (
    priceId === env.STRIPE_PRICE_ELITE_MONTHLY ||
    priceId === env.STRIPE_PRICE_ELITE_YEARLY
  ) {
    return "elite";
  }
  if (
    priceId === env.STRIPE_PRICE_PRO_MONTHLY ||
    priceId === env.STRIPE_PRICE_PRO_YEARLY
  ) {
    return "pro";
  }
  return "free";
}
