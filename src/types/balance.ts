// 余额变化的类型定义
export interface TokenBalance {
  [address: string]: {
    [token: string]: {
      value: bigint;
      isPositive: boolean;
    };
  };
} 