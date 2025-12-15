import { z } from 'zod/v4';

export const ExchangeId = z.string().brand('ExchangeId');
export type ExchangeId = z.infer<typeof ExchangeId>;

export const TransactionId = z.string().brand('TransactionId');
export type TransactionId = z.infer<typeof TransactionId>;

export const OperationId = z
  .string()
  .brand('OperationId')
  .describe('Unique operation ID (internal)');

export type OperationId = z.infer<typeof OperationId>;

export const ExchangeOperationId = z
  .string()
  .brand('ExchangeOperationId')
  .describe('Unique operation ID (third party)');

export type ExchangeOperationId = z.infer<typeof ExchangeOperationId>;

export const LegalEntityId = z.string().brand('LegalEntityId').describe('Legal entity ID');

export type LegalEntityId = z.infer<typeof LegalEntityId>;

export const AccountId = z.string().brand('AccountId').describe('Internal account ID');

export type AccountId = z.infer<typeof AccountId>;

export const ExchangeAccountId = z
  .string()
  .brand('ExchangeAccountId')
  .describe('Exchange account ID, such as user account at Coinbase');

export type ExchangeAccountId = z.infer<typeof ExchangeAccountId>;

export const LedgerId = z.string().brand('LedgerId').describe('Internal ledger ID');
export type LedgerId = z.infer<typeof LedgerId>;

export const ExchangeLedgerId = z
  .string()
  .brand('ExchangeLedgerId')
  .describe('Exchange ledger ID, such as a wallet ID on Coinbase, bank account ID, etc.');

export type ExchangeLedgerId = z.infer<typeof ExchangeLedgerId>;

export const AssetId = z.string().brand('AssetId').describe('Internal asset ID');

export type AssetId = z.infer<typeof AssetId>;
