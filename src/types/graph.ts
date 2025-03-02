export interface GraphNode {
  id: string;      // 地址作为节点ID
  label: string;   // 显示的地址（可以是截断的）
}

export interface GraphEdge {
  id: string;      // UUID
  source: string;  // 来源地址
  target: string;  // 目标地址
  label: string;   // "序号 数量 Symbol"
  style: {
    endArrow: true;
    type: 'quadratic'; // 二次曲线
  };
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
} 