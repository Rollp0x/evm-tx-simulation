'use client'

import { 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Typography,
  Box
} from '@mui/material'
import { Log } from '@/types'

interface LogsTableProps {
  logs: Log[]
}

function LogsTable({ logs }: LogsTableProps) {
  if (!logs || logs.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="text.secondary">
          没有日志数据
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        事件日志
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>合约地址</TableCell>
              <TableCell>Topics</TableCell>
              <TableCell>Data</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log, index) => (
              <TableRow key={index}>
                <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {log.address}
                </TableCell>
                <TableCell>
                  <Box sx={{ maxWidth: 300, overflow: 'hidden' }}>
                    {log.topics.map((topic, i) => (
                      <Typography key={i} variant="body2" sx={{ 
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {topic}
                      </Typography>
                    ))}
                  </Box>
                </TableCell>
                <TableCell sx={{ 
                  maxWidth: 300, 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {log.data || '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default LogsTable