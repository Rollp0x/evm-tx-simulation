import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Graph, NodeEvent, IElementEvent } from '@antv/g6';
import { Box, Typography, IconButton, Dialog, DialogContent } from '@mui/material';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import { processGraphData } from '@/utils/graph';
import { useSnackbar } from '@/providers/SnackbarContext';
import { TokenInfo,TokenTransfer } from '@/types';
import React from 'react';

const FlowGraph = React.memo(({ asset_transfers,token_infos }: { asset_transfers: TokenTransfer[],token_infos:Record<string, TokenInfo>}) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const fullscreenContainerRef = useRef<HTMLDivElement>(null);
    const graphRef = useRef<Graph | null>(null);
    const fullscreenGraphRef = useRef<Graph | null>(null);
    const { showSuccess, showError } = useSnackbar();

    // 添加一个处理地址显示的函数
    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };


    // 创建图表的函数
    const createGraph = useCallback((container: HTMLElement, width: number, height: number) => {
        const graph = new Graph({
            container,
            width,
            height,
            autoFit: 'view',
            padding: [20, 20, 20, 20],
            node: {
                type: 'rect',
                style: {
                    size: [240, 64],
                    radius: 8,
                    fill: '#5195ff',
                    stroke: '#fff',
                    lineWidth: 1,
                    labelFontSize: 18,
                    labelText: (d: any) => {
                        const label = d.data?.label;
                        return formatAddress(label);
                    },
                    labelPlacement: 'center',
                },
            },
            edge: {
                type: 'quadratic',
                style: {
                    labelBackground: true,
                    endArrow: true,
                    endArrowOffset: 20,
                    labelFontSize: 18,
                    labelText: (d: any) => d.data ? d.data.label : '',
                },
            },
            layout: {
                type: 'antv-dagre',
                rankdir: "LR",
                ranksep: 180,
                nodesep: 120,
            },
            behaviors: ['click-select', 'drag-element', 'drag-canvas', 'zoom-canvas'],
            transforms: [
                {
                    type: 'process-parallel-edges',
                    distance: 55,
                    offset: 35,
                    loop: {
                        distance: 50
                    },
                    thickness: 25,
                }
            ],
        });

        // 添加点击事件
        graph.on(NodeEvent.CLICK, (e: IElementEvent) => {
            const id = e.target.id;
            try {
                navigator.clipboard.writeText(id);
                showSuccess('地址已复制到剪贴板');
            } catch(err) {
                showError('复制失败: ' + (err as Error).message);
            }
        });

        return graph;
    }, [showError, showSuccess, formatAddress]);

    // 将 createGraph 用 useCallback 包装
    const createGraphMemo = useCallback((container: HTMLElement, width: number, height: number) => {
        return createGraph(container, width, height);
    }, [createGraph]);

    // 提取复杂表达式为变量
    const hasTransfers = asset_transfers.length > 0;

    // 修改 renderGraphData 函数
    const renderGraphData = useCallback((graph: Graph) => {

        if (!hasTransfers || !graph) return;

        setTimeout(() => {
            if (graph.destroyed) {
                return;
            }

            const data = processGraphData(
                asset_transfers,
                token_infos
            );

            graph.setData(data);
            graph.render();
        }, 100);
    }, []);

    // 修改初始化逻辑
    useEffect(() => {
        let graph: Graph | null = null;
        const initGraph = () => {
            if (!containerRef.current) return null;
            
            try {
                const newGraph = createGraphMemo(
                    containerRef.current,
                    containerRef.current.offsetWidth,
                    400
                );
                return newGraph;
            } catch (error) {
                return null;
            }
        };

        // 当有数据时才创建图表
        if (hasTransfers) {
            graph = initGraph();
            if (graph) {
                graphRef.current = graph;
                renderGraphData(graph);
            }
        }

        return () => {
            if (graph && !graph.destroyed) {
                try {
                    graph.destroy();
                } catch (error) {
                    console.error("Error destroying graph:", error);
                }
            }
            graphRef.current = null;
        };
    }, [hasTransfers, createGraphMemo, renderGraphData]);

    // 处理全屏图表的初始化
    const handleDialogEntered = () => {
        const container = fullscreenContainerRef.current;
        if (!container) {
            return;
        }

        const graph = createGraph(container, container.offsetWidth, container.offsetHeight);
        fullscreenGraphRef.current = graph;
        renderGraphData(graph);
    };

    // 清理全屏图表
    const handleDialogExit = () => {
        if (fullscreenGraphRef.current) {
            fullscreenGraphRef.current.destroy();
            fullscreenGraphRef.current = null;
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1">
                    资金流向图
                </Typography>
                {hasTransfers && (
                    <IconButton 
                        onClick={() => setIsFullscreen(true)}
                        size="small"
                        title="查看大图"
                    >
                        <OpenInFullIcon />
                    </IconButton>
                )}
            </Box>
            
            {!hasTransfers ? (
                <Box 
                    sx={{ 
                        height: 400,
                        border: '1px solid #f0f0f0',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Typography color="text.secondary">
                        此模拟交易没有资金转移
                    </Typography>
                </Box>
            ) : (
                <>
                    <Box 
                        ref={containerRef} 
                        sx={{ 
                            height: 400,
                            border: '1px solid #f0f0f0',
                            borderRadius: 1,
                            overflow: 'hidden'
                        }} 
                    />

                    <Dialog 
                        open={isFullscreen}
                        onClose={() => setIsFullscreen(false)}
                        maxWidth="xl"
                        fullWidth
                        TransitionProps={{
                            onEntered: handleDialogEntered,
                            onExit: handleDialogExit
                        }}
                    >
                        <DialogContent 
                            sx={{ 
                                height: '80vh', 
                                p: 0,
                                bgcolor: 'background.paper'
                            }}
                        >
                            <Box 
                                ref={fullscreenContainerRef} 
                                sx={{ 
                                    width: '100%',
                                    height: '100%'
                                }} 
                            />
                        </DialogContent>
                    </Dialog>
                </>
            )}
        </Box>
    );
}, (prev, next) => {
    const isEqual = JSON.stringify(prev.asset_transfers) === JSON.stringify(next.asset_transfers);
    return isEqual;
});

export default FlowGraph;
