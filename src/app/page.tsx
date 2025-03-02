'use client'
import '@rainbow-me/rainbowkit/styles.css';
import { useState, useEffect } from 'react'
import { 
  Box, 
  Typography, 
  Container,
  IconButton,
  AppBar,
  Toolbar
} from '@mui/material'
import InputSection from '@/components/InputSection'
import SimulationSection from '@/components/SimulationSection'
import MenuIcon from '@mui/icons-material/Menu'
import { ChainInfo } from '@/types'

export default function Home() {
  const [chains, setChains] = useState<ChainInfo[]>([]);
  useEffect(() => {
    fetch(`./config/chain_infos.json?t=${Date.now()}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        setChains(data);
      });
  }, []);
  
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 在客户端渲染之前返回一个加载状态或空内容
  if (!mounted) {
    return null // 或者返回一个加载指示器
  }

  return (
    <>
      <CustomAppBar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <InputSection chains={chains}/>
        <Box sx={{ my: 4 }}>
          <SimulationSection chainInfos={chains}/>
        </Box>
      </Container>
    </>
  )
}

function CustomAppBar() {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div">
            Evm兼容链交易模拟工具
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
