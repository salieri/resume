import { z } from 'zod/v4';

import { Amount } from '../util/asset.type';

export const ExchangeLimits = z.object({
  maxExchangeAmount: Amount,
  minExchangeAmount: Amount,
});

export type ExchangeLimits = z.infer<typeof ExchangeLimits>;
