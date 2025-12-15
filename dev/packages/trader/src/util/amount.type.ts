import { BigNumber } from 'bignumber.js';
import { z } from 'zod/v4';

/**
 * Always represents a positive amount of currency.
 */
export const Amount = z
  .union([
    z.string().transform((str) => new BigNumber(str).abs()),
    z.number().transform((num) => new BigNumber(num).abs()),
    z.instanceof(BigNumber).transform((bn) => new BigNumber(bn).abs()),
  ])
  .pipe(z.instanceof(BigNumber))
  .brand('Amount');

export type Amount = z.infer<typeof Amount>;
