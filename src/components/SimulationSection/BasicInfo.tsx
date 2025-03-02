import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { SimulationResult, ExecutionStatus } from '@/types';
import CallHierarchy from './CallHierarchy';


function BasicInfo({result}: {result: SimulationResult}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const toggleCallHierarchy = () => {
    setDialogOpen((old) => !old);
  };


  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center',
      width: '100%',
      justifyContent: 'space-between'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ mr: 2 }}>
          模拟交易结果:
        </Typography>
        <Typography 
          color={getStatusColor(result.execution_result)} 
          sx={{ mr: 1 }}
        >
          {getExecutionStatusText(result.execution_result,result.error)}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        {result.trace_result?.call_trace && (
          <Button
            variant="outlined"
            startIcon={<AccountTreeIcon />}
            onClick={toggleCallHierarchy}
            size="small"
          >
            显示调用层级
          </Button>
        )}
      </Box>
      <CallHierarchy
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        error_trace_address={result.trace_result?.error_trace_address}
        call_trace={result.trace_result?.call_trace || null}
      />
    </Box>
  );
}

export default BasicInfo;

// 获取状态颜色
const getStatusColor = (status: ExecutionStatus) => {
  return ("Success" in status) ? 'success.main' : 'error.main';
};

// 获取状态文本
const getExecutionStatusText = (status: ExecutionStatus,error_message: string | null) => {
  let prefix = ("Success" in status) ? "模拟交易执行成功." : "模拟交易执行失败.";
  if (error_message) {
    prefix += ` 初始错误信息: ${formatErrorMessage(error_message)}`;
  }
  return prefix;
};

// 格式化错误信息
const formatErrorMessage = (error: string) => {
  if (error.startsWith('0x')) {
    // 如果是16进制字符串，只显示前10位
    return `${error.slice(0, 10)}...`;
  }
  return error;
};