import { Box } from '@mui/material';
import parse from 'html-react-parser';

interface CodeBlockProps {
  value: string;
  maxHeight?: string | number;
  maxWidth?: string | number;
}

function CodeBlock({ 
  value,   
  maxHeight = '400px',
  maxWidth = '100%'
}: CodeBlockProps) {
  const processedValue = value.replace(
    /(# .+)/g, 
    match => match
  );

  return (
    <Box sx={{ 
      my: 2,
      maxWidth,
      overflow: 'hidden',
      '& pre': {
        background: '#282c34',
        padding: '1em',
        margin: 0,
        fontFamily: 'monospace',
        fontSize: '14px',
        lineHeight: '1.5',
        color: '#e3e3e3',
        whiteSpace: 'pre',
        overflowX: 'auto',
        maxHeight,
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '4px',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
          },
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
        },
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '4px',
      },
      '& .positive': { 
        color: '#7bed9f',
        textShadow: '0 0 1px rgba(123, 237, 159, 0.3)'
      },
      '& .negative': { 
        color: '#ff6b6b',
        textShadow: '0 0 1px rgba(255, 107, 107, 0.3)'
      },
      '& .warning': {
        color: '#ffd700',
        textShadow: '0 0 1px rgba(255, 215, 0, 0.3)'
      },
      '& .comment': {
        color: '#74b9ff',
        fontWeight: 'bold',
        textShadow: '0 0 1px rgba(116, 185, 255, 0.3)'
      }
    }}>
      <pre>
        {parse(processedValue)}
      </pre>
    </Box>
  );
}

export default CodeBlock;