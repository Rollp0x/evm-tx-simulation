
import { Paper, Box, Stack } from '@mui/material';
import { useMemo,useEffect,useState } from 'react';
import BasicInfo from './BasicInfo';
import BalanceChangesWithTable from './BalanceChangesWithTable';
import FlowGraph from './FlowGraph';
import { useTrace } from '@/providers/TraceContext';
import { processTokenTransfers } from '@/utils/token';
import LogsTable from './LogsTable'  // 新增
import { TokenTransfer,ChainInfo } from '@/types';
import { useSnackbar } from '@/providers/SnackbarContext';

function SimulationSection({chainInfos}:{chainInfos:ChainInfo[]}) {
  const { result,currentChainId } = useTrace();
  
  // 使用 useMemo 缓存处理后的数据
  const processedTraceResult = useMemo(() => {
    if (!result || !currentChainId) {
      return null;
    }
    const chainInfo = chainInfos.find(chain => chain.chain_id === currentChainId);
    if (!chainInfo) {
      return null;
    }

    try {
      const {
        asset_transfers,
        token_infos
      } = processTokenTransfers( result.results[0].trace_result?.asset_transfers || [],result.token_infos, chainInfo)
      // 这里是改成小写
      const processedTransfers = asset_transfers.map((transfer: TokenTransfer) => ({
          ...transfer,
          token: transfer.token.toLowerCase(),
          from: transfer.from.toLowerCase(),
          to: transfer.to?.toLowerCase() || "合约创建失败",
        }));
      return {
        token_infos,
        asset_transfers: processedTransfers,
      };
    } catch (error) {
      console.error('Error processing trace result:', error);
      return null;
    }
  }, [currentChainId, chainInfos]); // 只有这些依赖项变化时才重新计算

  if (!result || !processedTraceResult) {
    return null;
  }
  let simulate_result = result.results[0];
  return (
    <>
      <Box sx={{ mb: 2 }}>
        <BasicInfo 
          result={simulate_result} 
        />
      </Box>

      <Stack spacing={2}>
        <Paper elevation={2}>
          <Box sx={{ p: 3 }}>
            <FlowGraph 
            asset_transfers={processedTraceResult.asset_transfers} 
            token_infos={processedTraceResult.token_infos}
          />
          </Box>
        </Paper>

        <Paper elevation={2}>
          <Box sx={{ p: 3 }}>
            <BalanceChangesWithTable 
               asset_transfers={processedTraceResult.asset_transfers} 
               token_infos={processedTraceResult.token_infos}
            />
          </Box>
        </Paper>

        {/* 新增日志列表 */}
        <Paper elevation={2}>
          <Box sx={{ p: 3 }}>
            <LogsTable logs={simulate_result.trace_result?.logs || []} />
          </Box>
        </Paper>
      </Stack>

      
    </>
  );
}

export default SimulationSection;

