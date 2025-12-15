import { z } from 'zod/v4';

import { AssetSymbol, AssetType } from './asset.type';
import {
  AccountId,
  ExchangeAccountId,
  ExchangeId,
  ExchangeLedgerId,
  LedgerId,
  LegalEntityId,
} from './id.type';

export const Account = z.object({
  id: AccountId,
  exchangeId: ExchangeId,
  exchangeAccountId: ExchangeAccountId,
});

export type Account = z.infer<typeof Account>;

export const Ledger = z.object({
  id: LedgerId,
  accountId: AccountId,
  exchangeLedgerId: ExchangeLedgerId,
  assetCode: AssetSymbol,
  assetType: AssetType,
});

export const LegalEntity = z.object({
  id: LegalEntityId,
});

export enum FundingSourceType {
  LEDGER = 'ledger',
}

export const FundingSource = z.union([
  z.object({
    type: z.literal(FundingSourceType.LEDGER),
    account: Account,
    ledger: Ledger,
  }),
]);

export type FundingSource = z.infer<typeof FundingSource>;
