import { useState,useEffect, useRef } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Button,
  Box,
  Typography,
  IconButton,
  Collapse,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Remove as RemoveIcon, 
  ContentCopy as ContentCopyIcon,
  RestartAlt as RestartAltIcon,
  ReportProblem as ReportProblemIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useSnackbar } from '../../providers/SnackbarContext';
import { CallTrace } from '../../types';

interface CallHierarchyProps {
  open: boolean;
  onClose: () => void;
  error_trace_address?: number[] | null;
  call_trace: CallTrace | null;
}

interface TraceItemProps {
  trace: CallTrace;
  index: number;
  level: number;
  expandedPath: number[];
  resetCounter: number;
  onReset: () => void;
  isFirstInLevel?: boolean;
}

function TraceItem({ trace, index, level, expandedPath, resetCounter, onReset, isFirstInLevel = true }: TraceItemProps) {
  const [expanded, setExpanded] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (expandedPath.length === 0) {
      setExpanded(false);
      return;
    }

    if (expandedPath.length > 0) {
      const currentPath = trace.trace_address;
      const isInPath = currentPath.every((value, index) => value === expandedPath[index]);
      
      if (isInPath) {
        setExpanded(true);

        if (currentPath.length === expandedPath.length) {
          setTimeout(() => {
            const dialogContent = itemRef.current?.closest('.MuiDialogContent-root');
            if (dialogContent && itemRef.current) {
              const dialogHeight = dialogContent.clientHeight;
              
              const targetPosition = itemRef.current.offsetTop - (dialogHeight / 4);
              
              dialogContent.scrollTo({
                top: Math.max(0, targetPosition),
                behavior: 'smooth'
              });
            }
          }, 150);
        }
      }
    }
  }, [expandedPath, trace.trace_address]);

  const formatLongString = (prefix: string, value: string) => {
    if (value.length > 130) {
      return `"${prefix}": "${value.slice(0, 130)}..."`;
    }
    return `"${prefix}": "${value}"`;
  };

  const getPrefix = (level: number, isFirst: boolean) => {
    const baseIndent = '  '.repeat(Math.max(0, level - 1));
    const prefix = isFirst ? `${baseIndent}${'> '.repeat(level)}` : `${baseIndent}${'  '.repeat(level)}`;
    return prefix;
  };

  const formatTrace = () => {
    let result = '';
    const baseIndent = '  '.repeat(Math.max(0, level - 1));
    const contentIndent = baseIndent + '  '.repeat(level + 1);
    
    result += `${contentIndent}"type": "${getSchemeDisplay(trace)}",\n`;
    result += `${contentIndent}"from": "${trace.from}",\n`;
    result += `${contentIndent}"to": "${trace.to}",\n`;
    result += `${contentIndent}"value": "${trace.value || '0x0'}",\n`;
    result += `${contentIndent}"gas_used": ${parseInt(trace.gas_used || '0x0')},\n`;
    
    const inputLine = formatLongString('input', trace.input);
    result += `${contentIndent}${inputLine},\n`;
    
    if (trace.output) {
      const outputLine = formatLongString('output', trace.output);
      result += `${contentIndent}${outputLine}`;
    }
    
    // 处理状态
  if (trace.status !== 'Success' && trace.status !== 'InProgress') {
    const errorMessage = typeof trace.status === 'object' 
      ? ('Revert' in trace.status 
          ? `Revert:${trace.status.Revert}` 
          : `Halt:${trace.status.Halt})`)
      : trace.status;  // FatalError 的情况

    result += `,\n${contentIndent}<span style="background-color: rgba(255, 0, 0, 0.3)">"status": "${
      typeof trace.status === 'object'
        ? `${errorMessage}`  // "Revert: xxx" 或 "Halt: xxx"
        : errorMessage  // "FatalError"
    }"</span>`;
  }
    
    return result;
  };
  const is_error = trace.status !== 'Success' && trace.status !== 'InProgress';
  return (
    <Box 
      ref={itemRef}
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'flex-start',
        mb: 1,
        position: 'relative'
      }}>
        {is_error && (
          <Box
            sx={{
              position: 'absolute',
              left: -20,
              top: 12,
              color: '#d32f2f',
              fontSize: '0.85em',
              lineHeight: 1,
              zIndex: 1
            }}
          >
            ❌
          </Box>
        )}
        {trace.subtraces.length > 0 && (
          <IconButton 
            size="small" 
            onClick={() => setExpanded(!expanded)}
            sx={{ 
              mt: 0.5,
              mr: 1,
              minWidth: 28,
              color: 'primary.main',
              '&:hover': {
                color: 'primary.dark',
              }
            }}
          >
            {expanded ? <RemoveIcon /> : <AddIcon />}
          </IconButton>
        )}
        {trace.subtraces.length === 0 && (
          <Box sx={{ width: 36 }} />
        )}
        <Typography 
          component="pre" 
          sx={{ 
            fontFamily: 'monospace',
            backgroundColor: is_error ? 'error.lighter' : 'action.hover',
            p: 1,
            borderRadius: 1,
            flexGrow: 1,
            maxWidth: 'calc(100% - 36px)',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all'
          }}
          dangerouslySetInnerHTML={{
            __html: `${getPrefix(level, isFirstInLevel)}{\n${formatTrace()}\n${getPrefix(level, false)}}`
          }}
        />
      </Box>
      
      <Collapse in={expanded} sx={{ width: '100%' }}>
        {trace.subtraces.map((subtrace: any, subIndex: number) => (
          <TraceItem 
            key={`${index}-${subIndex}`}
            trace={subtrace}
            index={subIndex}
            level={level + 1}
            expandedPath={expandedPath}
            resetCounter={resetCounter}
            onReset={onReset}
            isFirstInLevel={subIndex === 0}
          />
        ))}
      </Collapse>
    </Box>
  );
}

function CallHierarchy({ open, onClose, call_trace, error_trace_address }: CallHierarchyProps) {
  const { showSuccess, showError } = useSnackbar();
  const [resetCounter, setResetCounter] = useState(0);
  const [expandedPath, setExpandedPath] = useState<number[]>([]);
  
  const handleClose = () => {
    setExpandedPath([]);
    setResetCounter(prev => prev + 1);
    onClose();
  };

  if (!call_trace) return null;
  const handleCopy = () => {
    const jsonString = JSON.stringify(call_trace, null, 2);
    navigator.clipboard.writeText(jsonString)
      .then(() => showSuccess('复制成功'))
      .catch(() => showError('复制失败'));
  };

  // 定位到错误源
  const locateError = () => {
    if (error_trace_address) {
      setExpandedPath(error_trace_address);
    }
  };

  const handleReset = () => {
    setExpandedPath([]);
    setResetCounter(prev => prev + 1);
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth={false} 
      fullWidth
      PaperProps={{
        sx: { 
          width: '1920px', 
          maxWidth: '90%', 
          height: 'calc(100% - 64px)',
          '& .MuiDialogContent-root': {
            overflowY: 'auto'
          }
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between'
        }}>
          <Typography variant="h6" component="div">
            调用层级
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {error_trace_address && (
              <Button
                startIcon={<ReportProblemIcon />}
                onClick={locateError}
                variant="outlined"
                color="error"
                size="small"
              >
                定位错误
              </Button>
            )}
            <Button
              startIcon={<ContentCopyIcon />}
              onClick={handleCopy}
              variant="outlined"
              size="small"
            >
              复制内容
            </Button>
            <Button
              startIcon={<RestartAltIcon />}
              onClick={handleReset}
              variant="outlined"
              size="small"
            >
              重置展开
            </Button>
            <Button
              startIcon={<CloseIcon />}
              onClick={handleClose}
              variant="outlined"
              size="small"
            >
              关闭
            </Button>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        {[call_trace].map((trace: CallTrace, index: number) => (
          <TraceItem 
            key={index} 
            trace={trace} 
            index={index} 
            level={0}
            expandedPath={expandedPath}
            resetCounter={resetCounter}
            onReset={() => setResetCounter(resetCounter + 1)}
            isFirstInLevel={true}
          />
        ))}
      </DialogContent>
    </Dialog>
  );
}

export default CallHierarchy;

// 添加处理 scheme 的辅助函数
const getSchemeDisplay = (trace: CallTrace) => {
  if (trace.call_scheme) {
    return trace.call_scheme;
  }
  if (trace.create_scheme) {
    if (typeof trace.create_scheme === 'string') {
      return trace.create_scheme;  // "Create"
    }
    if ('Create2' in trace.create_scheme) {
      return `Create2 (Salt: ${trace.create_scheme.Create2.salt})`;
    }
  }
  return '<span style="color: #ff9800">Unknown Scheme</span>';  // 警告颜色
};