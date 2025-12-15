import { z } from 'zod/v4';

import { Amount } from './amount.type';
import { Timestamp } from './timestamp.type';

export enum OrderType {
  LIMIT = 'limit',
  MARKET = 'market',
  STOP_LOSS = 'stop-loss',
  STOP_LIMIT = 'stop-limit',
  TRAILING_STOP = 'trailing-stop',
}

export enum TrailType {
  PERCENTAGE = 'percentage',
  AMOUNT = 'amount',
}

export const OrderStrategy = z.union([
  z.object({
    // sell or buy at market price
    type: z.literal(OrderType.MARKET),
  }),

  z.object({
    // sell or buy at limit price
    type: z.literal(OrderType.LIMIT),
    limitPrice: Amount,
  }),

  z.object({
    // sell or buy at limit price
    type: z.literal(OrderType.STOP_LOSS),
    stopPrice: Amount,
  }),

  z.object({
    // sell or buy at limit price
    type: z.literal(OrderType.STOP_LIMIT),
    limitPrice: Amount,
    stopPrice: Amount,
  }),

  z.object({
    // sell or buy at limit price
    type: z.literal(OrderType.TRAILING_STOP),
    trailType: TrailType.PERCENTAGE,
    trailPercentage: z.number().positive().max(100).int(),
  }),

  z.object({
    // sell or buy at limit price
    type: z.literal(OrderType.TRAILING_STOP),
    trailType: TrailType.AMOUNT,
    trailAmount: Amount,
  }),
]);

export type OrderStrategy = z.infer<typeof OrderStrategy>;

export const OrderParams = z.object({
  strategy: OrderStrategy,
  expiresAt: Timestamp,
});

export type OrderParams = z.infer<typeof OrderParams>;
