"use client"

import { useCallback, useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';

import { LoginLogout } from '../components/LoginLogout';
import { MbtiSelect } from '../components/MbtiSelect';
import mbtiStore from '../models/Mbti';
import metaMaskStore from '../models/MetaMask';

globalThis.addEventListener?.("unhandledrejection", ({ reason }) => {
  const { message, body } = reason;

  const tips = body?.detail || message;

  if(tips) alert(tips);
})

export default function Home() {
  const { localStorage } = globalThis;

  const [userAddress, setUserAddress] = useState<string>();

  const [mbtiSelectValue, setMbtiSelectValue] = useState<number>(0);

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

      {userAddress && <MbtiSelect mbti={mbtiSelectValue} onChange={setMbtiSelectValue} />}

      {userAddress && <Button
        className='w-100'
        onClick={() => mbtiStore.claimMbti(mbtiSelectValue)}
      >Claim MBTI</Button>}
    </Container>
  )
}
