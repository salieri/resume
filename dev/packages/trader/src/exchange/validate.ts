import type { Amount } from '../util/amount.type';
import type { Asset } from '../util/asset.type';
import { exchangeableAssetTypes } from '../util/asset.type';

import type { ExchangeLimits } from './types';

export const isValidAmount = (amount: Amount): boolean => {
  return amount.gt(0) && !amount.isNaN() && amount.isFinite();
};

export const isExchangeableAssetType = (asset: Asset): boolean => {
  return exchangeableAssetTypes.includes(asset.type);
};

export const validateExchange = (
  from: Asset,
  to: Asset,
  amount: Amount,
  limits: ExchangeLimits,
) => {
  if (!isExchangeableAssetType(from)) {
    throw new InvalidAssetError('Not an exchangeable asset type', from);
  }

  if (!isExchangeableAssetType(to)) {
    throw new InvalidAssetError('Not an exchangeable asset type', to);
  }

  if (from.id === to.id) {
    throw new InvalidAssetError('Cannot exchange asset with itself', to);
  }

  if (isValidAmount(amount)) {
    throw new InvalidAmountError('Invalid amount', amount);
  }

  if (amount.gt(limits.maxExchangeAmount)) {
    throw new TooLargeAmountError('Amount exceeds maximum exchange limit', amount);
  }

  if (amount.lt(limits.minExchangeAmount)) {
    throw new TooSmallAmountError('Amount exceeds minimum exchange limit', amount);
  }
};
