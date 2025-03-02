'use client';

import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

interface SnackbarContextType {
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  showInfo: (message: string) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: '',
    severity: 'success' as AlertColor
  });

  const showMessage = useCallback((msg: string, sev: AlertColor) => {
    setSnackbarState({
      open: true,
      message: msg,
      severity: sev
    });
  }, []);

  const handleClose = useCallback(() => {
    setSnackbarState(prev => ({
      ...prev,
      open: false
    }));
  }, []);

  const contextValue = useMemo(() => ({
    showError: (msg: string) => showMessage(msg, 'error'),
    showSuccess: (msg: string) => showMessage(msg, 'success'),
    showInfo: (msg: string) => showMessage(msg, 'info')
  }), [showMessage]);

  // 将 Snackbar 组件分离到一个单独的组件
  const SnackbarComponent = useMemo(() => (
    <Snackbar
      open={snackbarState.open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      sx={{ bottom: { xs: 16, sm: 24 } }}
    >
      <Alert 
        severity={snackbarState.severity} 
        onClose={handleClose}
        variant="filled"
        sx={{ 
          minWidth: '280px',
          boxShadow: 2,
          '& .MuiAlert-icon': {
            fontSize: '1.25rem'
          },
          '& .MuiAlert-message': {
            fontSize: '0.95rem',
            padding: '8px 0'
          },
          '& .MuiAlert-action': {
            padding: '0 8px'
          }
        }}
      >
        {snackbarState.message}
      </Alert>
    </Snackbar>
  ), [snackbarState, handleClose]);

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
      {SnackbarComponent}
    </SnackbarContext.Provider>
  );
}

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) throw new Error('useSnackbar must be used within SnackbarProvider');
  return context;
}; 