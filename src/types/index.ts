// 链信息
export interface ChainInfo {
  name: string;
  chain_id: number;
  symbol: string;
  decimals: number;
  wrap_token: string;
  wrap_token_symbol: string;
}

// 普通模拟交易请求
export interface TraceRequest {
  chain_id: number;
  from: string;
  to?: string | null;
  value?: string | null;
  data?: string | null;
  operation: 0 | 1 | 2; // 0=call, 1=delegatecall, 2=create 
  block_number: number | null;
}
// 批量模拟交易请求
export interface BatchTraceRequest {
  chain_id: number;
  is_stateful: boolean;
  block_number: number | null;
  requests: TraceRequest[];
}



interface BlockEnv {
  number: number;
  timestamp: number;
}

// API响应
export interface ApiResponse<T> {
  code: number;
  data: T;
}

export interface TokenTransfer {
  token: string;   // Address
  from: string;    // Address
  to?: string | null;      // Address
  value: string;   // U256
}




// 日志结构
export interface Log {
  address: string;     // Address -> string
  topics: string[];    // Vec<B256> -> string[]
  data: string;        // Bytes -> string
}



// 基础类型
export interface TokenInfo {
  symbol: string;
  decimals: number;
}
  
export type CreateScheme = 
  | "Create"                              // 无绑定值，直接是字符串
  | { Create2: { salt: string } };        // 有绑定值，是对象

// 修改为
export type CallScheme = 
  | 'Call'
  | 'CallCode'
  | 'DelegateCall'
  | 'StaticCall'
  | 'ExtCall'
  | 'ExtStaticCall'
  | 'ExtDelegateCall';

export interface Gas {
  limit: number;
  remaining: number;
  refunded: number;
}

// 合约调用状态
export type CallStatus = 
  | "Success"
  | { Revert: string }
  | { Halt: string }
  | "FatalError"
  | "InProgress";

export interface CallTrace {
  from: string;
  to: string;
  value: string;
  input: string;
  call_scheme?: CallScheme | null;
  create_scheme?: CreateScheme | null;
  gas_used: string;
  output: string;
  status: CallStatus;
  error_origin: boolean;
  subtraces: CallTrace[];
  trace_address: number[];
}


// 执行失败的类型
export type FailureKind = 
  | { PreExecution: string }
  | { Revert: string }
  | { Halt: string };

// 交易执行状态,只有成功和失败两个状态
export type ExecutionStatus = 
  | {
      Success: {
        gas_used: number;
        gas_refunded: number;
        output: {
          Call: string;
        } | {
          Create: [string, string | null];  // 对应 Create(Bytes, Option<Address>)
        };
      }
    }
  | {
      Revert: {
        gas_used: number;
        output: string | null;
      }
    }
  | {
    Halt: {
      gas_used: number;
    }
  };

  // Token 信息
export interface TokenInfoParam {
  address: string;
  symbol: string;
  decimals: number;
  value: string;  // 格式化后的值
}

// 参数信息
export interface Parameter {
  name: string;
  description: string;
  display_value: string;
  param_type: string;
  token_info?: TokenInfoParam | null;
}

// 函数调用信息
export interface FunctionCall {
  name: string;
  description?: string | null;
  parameters: Parameter[];
}

// 基本信息
export interface BasicInfo {
  from: string;
  to?: string | null;
  to_name?: string | null;
  value: string;
  symbol: string;
}

// 交易类型信息 注意这里后台使用了tag和content来修改json的key
export type TransactionInfo =
  | {
      type: 'Transfer';
      content: {
        value: string;
        symbol: string;
      };
    }
  | {
      type: 'ContractCreation';
      content: {
        contract_name?: string | null;
      };
    }
  | {
      type: 'ContractCall';
      content: {
        contract_address: string;
        contract_name?: string | null;
        is_self_call: boolean;
      };
    };

// 格式化后的交易信息
export interface FormattedTransaction {
  basic_info: BasicInfo;
  transaction_info: TransactionInfo;
  function_call?: FunctionCall | null;
}


  // 追踪信息
  export interface TxTraceOutput {
    asset_transfers: TokenTransfer[];
    call_trace: CallTrace;
    logs: Log[];
    error_trace_address: number[] | null;
  }

  export interface SimulationResult {
    block_number: number;
    error:string | null;
    execution_result:ExecutionStatus;
    trace_result:TxTraceOutput | null;
  }

  
// 统一的追踪响应类型
export interface SimulationResponse {
  token_infos: Record<string, TokenInfo> | {};
  results: SimulationResult[];
}
