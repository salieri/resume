import type { TransactionResult } from '../transaction/types';
import type { Amount, Asset, AssetExchangeRate } from '../util/asset.type';
import type { Account, FundingSource } from '../util/entity.type';
import type { AssetId } from '../util/id.type';
import { isTransactionableAmount } from '../util/is-transactionable-amount';
import type { OrderParams } from '../util/order.type';

import { validateExchange } from './validate';

export class AssetExchange {
  constructor(private readonly exchangeOperator: AssetExchangeOperator) {}

  /**
   * Sell a specific amount of an asset
   * @param asset
   * @param amount
   * @param fromAccount account to sell from
   */
  async sell(
    asset: Asset,
    amount: Amount,
    orderParams: OrderParams,
    fromAccount: Account,
  ): Promise<TransactionResult> {
    validateSell(asset, amount);

    const operator = this.getOperator(fromAccount);

    return await operator.sell(asset, amount, orderParams, fromAccount);
  }

  /**
   * Buy a specific amount of an asset using a specified funding source.
   * @param asset
   * @param amount
   * @param toAccount account to buy into
   * @param fundingSource
   */
  async buy(
    asset: Asset,
    amount: Amount,
    orderParams: OrderParams,
    toAccount: Account,
    fundingSource: FundingSource,
  ): Promise<TransactionResult> {
    validateBuy(asset, amount);

    const operator = this.getOperator(toAccount);

    return await operator.buy(asset, amount, orderParams, toAccount, fundingSource);
  }

  /**
   * Exchange one asset for another
   * @param from
   * @param to
   * @param amount
   */
  async exchange(
    from: Asset,
    to: Asset,
    amount: Amount,
    orderParams: OrderParams,
    account: Account,
  ): Promise<TransactionResult> {
    validateExchange(from, to, amount);

    const operator = this.getOperator(account);

    return await operator.exchange(from, to, amount, orderParams, account);
  }

  /**
   * List all supported assets on the exchange
   */
  async list(account: Account): Promise<Asset[]> {}

  /**
   * Fetch current exchange rates
   */
  async fetchExchangeRates(
    from?: Asset[],
    to?: Asset[],
  ): Promise<Map<AssetId, AssetExchangeRate[]>> {}

  private getOperator(account: Account): AssetExchangeOperator {
    const operator = this.exchangeOperators.get(account.exchangeId);

    if (!operator) {
      throw new UnknownExchangeError(`Unknown exchange ID: ${account.exchangeId}`);
    }

    return operator;
  }
}
