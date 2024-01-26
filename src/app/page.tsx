"use client"

import { useCallback, useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';

import { LoginLogout } from '../components/LoginLogout';
import metaMaskStore from '../models/MetaMask';

export default function Home() {
  const { localStorage } = globalThis;

  const [userAddress, setUserAddress] = useState<string>();

  const handleRequestAccounts = useCallback(async () => {
    const accounts = await window.ethereum?.request<string[]>({
      method: "eth_accounts",
      params: [],
    })

    const localStorageAccount = localStorage.account;

    setUserAddress(
      localStorage.account =
      (!accounts?.length || !localStorageAccount)
        ? ""
        : accounts.includes(localStorageAccount)
          ? localStorageAccount
          : accounts[0]
    )
  }, [])

  useEffect(() => { handleRequestAccounts() }, [])

  const onLogin = async () =>
    setUserAddress(localStorage.account = await metaMaskStore.connectWallet())

  const onLogout = async () => {
    localStorage.clear();
    location.reload();
  }

  return (
    <Container>
      <h1 className='text-center mt-5 mb-3'>MBTI</h1>
      <LoginLogout  {...{ address: userAddress, onLogin, onLogout }} />
    </Container>
  )
}
