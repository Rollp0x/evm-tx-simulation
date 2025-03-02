'use client';

import React, { createContext, useContext, useState } from 'react';
import { SimulationResponse, TraceRequest } from '../types';
import { api } from '../services/api';

interface TraceContextType {
  result: SimulationResponse | null;
  currentChainId: number | null;
  trace: (request: TraceRequest) => Promise<void>;
  reset: () => void;
}

const TraceContext = createContext<TraceContextType | null>(null);

export function TraceProvider({ children }: { children: React.ReactNode }) {
  const [result, setResult] = useState<SimulationResponse | null>(null);
  const [currentChainId, setCurrentChainId] = useState<number | null>(null);

  const trace = async (request: TraceRequest) => {
    try {
        
        const response = await api.trace(request);
        setCurrentChainId(request.chain_id);
        setResult(response as unknown as SimulationResponse);
    } catch (error) {
      setResult(null);
      throw error;
    }
  };

  return (
    <TraceContext.Provider value={{
      result,
      currentChainId,
      trace,
      reset: () => {
        setResult(null);
        setCurrentChainId(null);
      }
    }}>
      {children}
    </TraceContext.Provider>
  );
}

export function useTrace() {
  const context = useContext(TraceContext);
  if (!context) {
    throw new Error('useTrace must be used within a TraceProvider');
  }
  return context;
} 