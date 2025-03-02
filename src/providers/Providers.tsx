'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { ThemeProvider, createTheme } from '@mui/material'
import { SnackbarProvider } from './SnackbarContext'
import { TraceProvider } from './TraceContext'



const queryClient = new QueryClient()

const theme = createTheme()

export function Providers({ children }: { children: React.ReactNode }) {
  return (

        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
              <SnackbarProvider>
                <TraceProvider>
                    {children}
                </TraceProvider>
              </SnackbarProvider>
            </ThemeProvider>
        </QueryClientProvider>

  )
} 