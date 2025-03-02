import { Box, Typography, styled } from '@mui/material';

const TableContainer = styled(Box)(({ theme }) => ({
  fontFamily: 'monospace',
  whiteSpace: 'pre',
  marginTop: theme.spacing(2),
}));

const TableHeader = styled(Typography)(({ theme }) => ({
  color: theme.palette.info.main,
  fontWeight: 'bold',
  marginBottom: theme.spacing(1),
}));

const TableRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  height: '24px',
});

const Address = styled(Typography)({
  width: '48ch',
  fontFamily: 'monospace',
  paddingRight: '10ch',
});

const Token = styled(Typography)({
  width: '20ch',
  fontFamily: 'monospace',
  paddingRight: '5ch',
});

const Change = styled(Typography)({
  width: '14ch',
  fontFamily: 'monospace',
  textAlign: 'left',
});

interface BalanceTableProps {
  rows: Array<{
    address: string;
    tokens: Array<{
      symbol: string;
      value: string;
      isPositive: boolean;
    }>;
  }>;
}

export function BalanceTable({ rows }: BalanceTableProps) {
  return (
    <TableContainer>
      <TableHeader variant="subtitle1" color="info" sx={{ marginTop: -3,marginBottom:3 }}>
        余额变化列表
      </TableHeader>
      <TableRow sx={{ marginBottom: 2 }}>
        <Address>地址</Address>
        <Token>代币</Token>
        <Change>变化值</Change>
      </TableRow>
      <Box sx={{ height: 1, bgcolor: 'divider', my: 1 }} />
      
      {rows.map((row, rowIndex) => (
        <Box key={row.address} sx={{ mb: rowIndex < rows.length - 1 ? 2 : 0 }}>
          {row.tokens.map((token, tokenIndex) => (
            <TableRow key={`${row.address}-${token.symbol}`}>
              {tokenIndex === 0 ? (
                <Address>{row.address.toLowerCase()}</Address>
              ) : (
                <Address>{''}</Address>
              )}
              <Token>{token.symbol}</Token>
              <Change color={token.isPositive ? 'success.main' : 'error.main'}>
                {token.isPositive ? '+' : '-'}{token.value}
              </Change>
            </TableRow>
          ))}
        </Box>
      ))}
    </TableContainer>
  );
} 