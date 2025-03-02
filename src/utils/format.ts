interface CallSchemeConfig {
  color: string;
  label: string;
}

import { CallScheme } from '../types';

export const CALL_SCHEME_CONFIG: Record<CallScheme, CallSchemeConfig> = {
  'Call': {
    color: '#1890ff',
    label: 'Call'
  },
  'CallCode': {
    color: '#faad14',
    label: 'CallCode'
  },
  'DelegateCall': {
    color: '#52c41a',
    label: 'DelegateCall'
  },
  'StaticCall': {
    color: '#722ed1',
    label: 'StaticCall'
  },
  'ExtCall': {
    color: '#eb2f96',
    label: 'ExtCall'
  },
  'ExtStaticCall': {
    color: '#f5222d',
    label: 'ExtStaticCall'
  },
  'ExtDelegateCall': {
    color: '#fa541c',
    label: 'ExtDelegateCall'
  }
};

export function getCallSchemeConfig(scheme: CallScheme): CallSchemeConfig {
  return CALL_SCHEME_CONFIG[scheme];
}

export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
} 