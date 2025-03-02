import { TokenTransfer, ChainInfo,TokenInfo } from '@/types';

export function processTokenTransfers(asset_transfers: TokenTransfer[],token_infos:Record<string, TokenInfo>, chainInfo: ChainInfo): {
    asset_transfers: TokenTransfer[];
    token_infos: Record<string, TokenInfo>;
} {
    // 过滤掉 value 为 0 的转账记录
    const processedTransfers = asset_transfers.filter(transfer => transfer.value !== '0x0');
    const tokenInfos = { ...token_infos };
    const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
    
    // 预先处理 chain_info 中的地址为小写
    const wrapTokenAddress = chainInfo.wrap_token?.toLowerCase();
    let newTransfers: TokenTransfer[] = [];
    // 正向遍历，根据业务逻辑决定 push 顺序
    for (const transfer of processedTransfers)  {
        // 如果是销毁wrapToken，则直接插入到前面
        if (transfer.token === ZERO_ADDRESS && wrapTokenAddress && transfer.from === wrapTokenAddress) {
            newTransfers.push({
                token:wrapTokenAddress,
                from: transfer.to as string,
                to: ZERO_ADDRESS,
                value: transfer.value
            });
        }
        newTransfers.push(transfer);
        // 如果是铸造wrapToken，则直接插入到后面
        if (transfer.token === ZERO_ADDRESS && wrapTokenAddress && transfer.to === wrapTokenAddress) {
            newTransfers.push({
                token:wrapTokenAddress,
                from: ZERO_ADDRESS,
                to: transfer.from,
                value: transfer.value
            });
        }
    }
    // 如果 token_info 中没有 wrap token 的信息，添加它
    // 不管是否涉及到wrap token
    if (!tokenInfos[wrapTokenAddress] && chainInfo.wrap_token_symbol) {
        tokenInfos[wrapTokenAddress] = {
            symbol: chainInfo.wrap_token_symbol,
            decimals: chainInfo.decimals
        };
    }
    
    return {
        asset_transfers: newTransfers,
        token_infos: tokenInfos
    };
}