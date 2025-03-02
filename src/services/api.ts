import instance from './axios'; // 我们配置的 axios 实例
import { BatchTraceRequest,SimulationResponse,TraceRequest } from '../types';


export const api = {
  // 交易追踪
  trace: (request: TraceRequest) =>{
    let batch: BatchTraceRequest = {
      chain_id: request.chain_id,
      is_stateful: false,
      block_number: request.block_number,
      requests: [request]
    };
    return instance.post<SimulationResponse>('/simulate/batch', batch);
  }
};
  