import { Box, Paper} from '@mui/material';
import GeneralTraceTab from './GeneralTraceTab';
import { ChainInfo } from '../../types';

function InputSection({ chains }: { chains: ChainInfo[] }) {
  return (
    <Paper elevation={2}>
      <Box sx={{ p: 3 }}>
        <GeneralTraceTab chains={chains} />
      </Box>
    </Paper>
  );
}

export default InputSection;