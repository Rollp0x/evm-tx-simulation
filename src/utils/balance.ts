import { TokenBalance } from '../types/balance';
import { ethers } from 'ethers';
import { TokenTransfer } from '../types';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export function calculateBalanceChanges(transfers: TokenTransfer[]): TokenBalance {
  const balances: TokenBalance = {};

  transfers.forEach(transfer => {
    const value = ethers.getBigInt(transfer.value);
    
    // 处理发送方（非零地址）
    if (transfer.from !== ZERO_ADDRESS) {
      processTransfer(balances, transfer.from, transfer.token, value, false);
    }

    // 处理接收方（非零地址）
    if (transfer.to !== ZERO_ADDRESS) {
      processTransfer(balances, transfer.to || "合约创建失败", transfer.token, value, true);
    }
  });

  return balances;
}

function processTransfer(
  balances: TokenBalance, 
  address: string, 
  token: string, 
  value: bigint, 
  isReceiving: boolean
) {
  // 初始化地址和代币的余额记录
  if (!balances[address]) {
    balances[address] = {};
  }
  if (!balances[address][token]) {
    balances[address][token] = {
      value: ethers.getBigInt(0),
      isPositive: true
    };
  }

  const balance = balances[address][token];
  
  if (isReceiving) {
    processReceiving(balance, value);
  } else {
    processSending(balance, value);
  }
}

function processReceiving(
  balance: { value: bigint; isPositive: boolean }, 
  value: bigint
) {
  if (balance.isPositive) {
    // 当前是正数，继续累加
    balance.value = balance.value + value;
    balance.isPositive = true;
  } else {
    // 当前是负数
    if (balance.value <= value) {
      // 加法后变为正数
      balance.value = value - balance.value;
      balance.isPositive = true;
    } else {
      // 加法后仍为负数
      balance.value = balance.value - value;
      balance.isPositive = false;
    }
  }
}

function processSending(
  balance: { value: bigint; isPositive: boolean }, 
  value: bigint
) {
  if (balance.isPositive) {
    // 当前是正数
    if (balance.value >= value) {
      // 减法后仍为正数
      balance.value = balance.value - value;
      balance.isPositive = true;
    } else {
      // 减法后变为负数
      balance.value = value - balance.value;
      balance.isPositive = false;
    }
  } else {
    // 当前是负数，继续累加负数
    balance.value = balance.value + value;
    balance.isPositive = false;
  }
} 