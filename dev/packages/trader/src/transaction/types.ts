import { z } from 'zod/v4';

import { Amount } from '../util/amount.type';
import { Asset } from '../util/asset.type';
import { CountryCode } from '../util/country.type';
import {
  ExchangeAccountId,
  ExchangeId,
  ExchangeLedgerId,
  ExchangeOperationId,
  LegalEntityId,
  OperationId,
  TransactionId,
} from '../util/id.type';
import { Timestamp } from '../util/timestamp.type';

export enum TransactionOperationType {
  CREDIT = 'credit',
  DEBIT = 'debit',
}

export enum TransactionStatus {
  CREATED = 'created',
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

/**
 * Used to track what is added and removed from a ledger
 */
export const TransactionOperation = z.object({
  id: OperationId,
  exchangeId: ExchangeId,
  exchangeOperationId: ExchangeOperationId,
  exchangeAccountId: ExchangeAccountId,
  exchangeLedgerId: ExchangeLedgerId,
  ownerEntityId: LegalEntityId,
  financialAccountCountry: CountryCode,
  type: z.enum(TransactionOperationType),
  amount: Amount,
  asset: Asset,
  status: z.enum(TransactionStatus),
  statusTimestamp: Timestamp,
});

export type TransactionOperation = z.infer<typeof TransactionOperation>;

export const TransactionResult = z.object({
  id: TransactionId,
  status: z.enum(TransactionStatus),
  statusTimestamp: Timestamp,
  requestTimestamp: Timestamp,

  operations: z.array(TransactionOperation).min(1),
});

export type TransactionResult = z.infer<typeof TransactionResult>;
