import { z } from 'zod/v4';

import { Amount } from './amount.type';
import { AssetId } from './id.type';
import { Timestamp } from './timestamp.type';

export enum AssetType {
  STOCK = 'stock',
  COMMODITY = 'commodity',
  CRYPTO = 'crypto',
  FOREX = 'forex',
}

export const exchangeableAssetTypes = [AssetType.CRYPTO, AssetType.FOREX];

export const AssetSymbol = z
  .string()
  .brand('AssetSymbol')
  .describe('Human-readable asset symbol, e.g. BTC, USD, AAPL');

export type AssetSymbol = z.infer<typeof AssetSymbol>;

export enum AssetIdentificationType {
  ISIN = 'isin', // stock identifier
  CUSIP = 'cusip', // stock identifier
  ISO4217 = 'iso4217', // currency code
  ISO10962 = 'iso10962', // financial instrument code
  CRYPTO = 'crypto', // crypto identifier
}

export const AssetIdentifier = z.object({
  type: z.enum(AssetIdentificationType),
  identifier: z.string().trim(),
});

export const Asset = z.object({
  id: AssetId,
  symbol: AssetSymbol,
  type: z.enum(AssetType),
  name: z.string(),
  description: z.string().optional(),
  identifiers: z.array(AssetIdentifier).optional(),
});

export type Asset = z.infer<typeof Asset>;

export const AssetExchangeRate = z.object({
  from: AssetId,
  to: AssetId,
  rate: Amount.describe('The amount of "to" asset you get for 1 unit of "from" asset'),
  timestamp: Timestamp,
});

export type AssetExchangeRate = z.infer<typeof AssetExchangeRate>;

export const AssetIndexes = [
  {
    unique: true,
    fields: ['asset.identifiers.identifier', 'asset.identifiers.type'],
  },
  {
    unique: false,
    fields: ['asset.symbol', 'asset.type'],
  },
  {
    unique: false,
    fields: ['asset.type', 'asset.symbol'],
  },
];
