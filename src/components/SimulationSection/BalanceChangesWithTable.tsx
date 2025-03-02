import { Box, Typography } from '@mui/material';
import { calculateBalanceChanges } from '../../utils/balance';
import { ethers } from 'ethers';
import { BalanceTable } from './BalanceTable';
import { TokenInfo,TokenTransfer } from '@/types';

function BalanceChangeWithTable({ asset_transfers,token_infos }: { asset_transfers: TokenTransfer[],token_infos:Record<string, TokenInfo>}) {
  // 转换数据格式以适配 BalanceTable
  const formatBalanceData = () => {
    const balances = calculateBalanceChanges(asset_transfers);

    return Object.entries(balances).map(([address, tokens]) => ({
      address,
      tokens: Object.entries(tokens)
        .map(([token, { value, isPositive }]) => {
          const tokenData = token_infos?.[token] || { symbol: "unknown", decimals: 18 };
          const formattedValue = ethers.formatUnits(value, tokenData.decimals);
          const displayValue = Number(formattedValue);

          // 如果值为 0，跳过
          if (displayValue === 0) {
            return null;
          }

          return {
            symbol: tokenData.symbol ,
            value: displayValue.toFixed(tokenData.decimals),
            isPositive
          };
        })
        .filter((token): token is NonNullable<typeof token> => token !== null)
    }))
    .filter(row => row.tokens.length > 0); // 过滤掉没有代币变化的地址
  };

  // 检查是否有余额变化数据
  const balanceData = formatBalanceData();
  const hasBalanceChanges = balanceData.length > 0;

  if (!hasBalanceChanges) {
    return (
      <Box sx={{ 
        p: 2, 
        textAlign: 'center',
        border: '1px solid #f0f0f0',
        borderRadius: 1,
      }}>
        <Typography color="text.secondary">
          此模拟交易没有余额变化
        </Typography>
      </Box>
    );
  }

  return <BalanceTable rows={balanceData} />;
}

export default BalanceChangeWithTable; 