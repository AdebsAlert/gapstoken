import { Injectable } from '@nestjs/common';

import Web3 from 'web3';
import { AbiItem } from 'web3-utils';

import HDWalletProvider from '@truffle/hdwallet-provider';

import moment from 'moment-timezone';

import numeral from 'numeral';

import _ from 'lodash';

import { UNISWAP_EXCHANGE_ABI, UNISWAP_FACTORY_ABI } from '../abis/uniswap.abi';
import { KYBER_RATE_ABI } from '../abis/kyber.abi';
import { IPriceBot } from '../types/price-bot.type';
import { RequestPriceDto } from '../dtos/price-bot.dto';

@Injectable()
export class PriceBotService {
  async getPrices(args: RequestPriceDto) {
    const {
      inputTokenSymbol,
      inputTokenAddress,
      outputTokenSymbol,
      outputTokenAddress,
      inputAmount,
    } = args;
    // WEB3 CONFIG
    const web3 = new Web3(process.env.RPC_URL);

    const queryAmount = web3.utils.toWei(inputAmount, 'ether');

    const uniswapFactoryContract = new web3.eth.Contract(
      UNISWAP_FACTORY_ABI as AbiItem[],
      process.env.UNISWAP_FACTORY_ADDRESS,
    );

    const kyberRateContract = new web3.eth.Contract(
      KYBER_RATE_ABI as AbiItem[],
      process.env.KYBER_RATE_ADDRESS,
    );

    const exchangeAddress = await uniswapFactoryContract.methods
      .getExchange(outputTokenAddress)
      .call();
    const exchangeContract = new web3.eth.Contract(
      UNISWAP_EXCHANGE_ABI as AbiItem[],
      exchangeAddress,
    );

    const uniswapResult = await exchangeContract.methods
      .getEthToTokenInputPrice(queryAmount)
      .call();

    const kyberResult = await kyberRateContract.methods
      .getExpectedRate(inputTokenAddress, outputTokenAddress, queryAmount)
      .call();

    const data: IPriceBot = {
      inputToken: inputTokenSymbol,
      outputToken: outputTokenSymbol,
      inputAmount: web3.utils.fromWei(queryAmount, 'ether'),
      uniswapReturn: web3.utils.fromWei(uniswapResult, 'ether'),
      kyberExpectedRate: web3.utils.fromWei(kyberResult.expectedRate, 'ether'),
      kyberMinReturn: web3.utils.fromWei(kyberResult.worstRate, 'ether'),
      timestamp: moment().tz('Africa/Lagos').format(),
    };

    return data;
  }
}
