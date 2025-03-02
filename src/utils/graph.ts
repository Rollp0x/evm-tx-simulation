import { v4 as uuidv4 } from 'uuid';
import { ethers } from 'ethers';
import { NodeData, EdgeData } from '@antv/g6';
import { TokenTransfer, TokenInfo } from '../types';

interface NodeCustomData {
  label: string;
  address: string;
}

interface EdgeCustomData {
  label: string;
}

export function processGraphData(
  transfers: TokenTransfer[],
  tokenInfo: Record<string, TokenInfo>
) {
  const nodes = new Map<string, NodeData & { data?: NodeCustomData }>();
  const edges: (EdgeData & { data?: EdgeCustomData })[] = [];
  // 处理转账记录
  transfers.forEach((transfer, index) => {
    // 添加节点（如果不存在）
    if (!nodes.has(transfer.from)) {
      nodes.set(transfer.from, {
        id: transfer.from,
        data: {
          label: transfer.from,
          address: transfer.from
        }
      });
    }
    if (!nodes.has(transfer.to || "合约创建失败")) {
      nodes.set(transfer.to || "合约创建失败", {
        id: transfer.to || "合约创建失败",
        data: {
          label: transfer.to || "合约创建失败",
          address: transfer.to || "合约创建失败"
        }
      });
    }

    // 处理数值
    const token = tokenInfo[transfer.token];
    const value = ethers.formatUnits(transfer.value, token.decimals);
    const displayValue = Number(value).toFixed(6);

    // 创建边
    edges.push({
      id: uuidv4(),
      source: transfer.from,
      target: transfer.to || "合约创建失败",
      data: {
        label: `(${index + 1})  ${displayValue}  ${token.symbol}`
      }
    });
  });

  return {
    nodes: Array.from(nodes.values()),
    edges
  };
}