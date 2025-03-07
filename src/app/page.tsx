"use client"

import { getAddress } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';

import { ClaimHistory } from '../components/ClaimHistory';
import { LoginLogout } from '../components/LoginLogout';
import { MbtiSelect } from '../components/MbtiSelect';
import { SearchMbti } from '../components/SearchMbti';
import mbtiStore from '../models/Mbti';
import metaMaskStore from '../models/MetaMask';
import { convertMbtiToString } from '../utils/mbti';

globalThis.addEventListener?.("unhandledrejection", ({ reason }) => {
  const { message, body } = reason;

  const tips = body?.detail || message;

  if (tips) alert(tips);
})

export default function Home() {
  const { localStorage } = globalThis;

  const [userAddress, setUserAddress] = useState<string>();

  const [mbtiSelectValue, setMbtiSelectValue] = useState<number>(0);

  const [myMbti, setMyMbti] = useState<number>(-1)

  const [myHistory, setMyHistory] = useState<string[]>([]);

  const [searchAddress, setSearchAddress] = useState<string>("");
  const [searchMbti, setSearchMbti] = useState<string>("");
  const [viewTime, setViewTime] = useState<number>(0);

  const handlePageInitRequest = useCallback(async () => {
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

    try {
      setMyMbti(localStorageAccount ? await mbtiStore.getMyMBTI() : -1)
    } catch (error: any) {
      if (error?.reason !== "MBTI is not initialized.")
        throw error;
    }

    try {
      const res = await fetch(`/api/mbti/${localStorageAccount}`);
      const { count } = await res.json();
      setViewTime(count);
    } catch (error: any) {
      console.error(error);
    }

    setMyHistory((localStorageAccount ? await mbtiStore.getRecord(localStorageAccount) : []).map(item => item > 0 ? convertMbtiToString(item) : ''));
  }, [])

  useEffect(() => { handlePageInitRequest() }, [])

  const onLogin = async () =>
    setUserAddress(localStorage.account = await metaMaskStore.connectWallet())

  const onLogout = async () => {
    localStorage.clear();
    location.reload();
  }

  const onClaimMBTI = async () => {
    const tx = await mbtiStore.claimMBTI(mbtiSelectValue);
    await tx.wait();
    setMyMbti(mbtiSelectValue);
    setMyHistory(myHistory => [...myHistory, convertMbtiToString(mbtiSelectValue)])
  }

  const onUpdateMBTI = async () => {
    if (mbtiSelectValue === myMbti) return;

    const tx = await mbtiStore.updateMBTI(mbtiSelectValue);
    await tx.wait();
    setMyMbti(mbtiSelectValue);
    setMyHistory(myHistory => [...myHistory, convertMbtiToString(mbtiSelectValue)])
  }

  const onDestroyMBTI = async () => {
    const tx = await mbtiStore.destroyMBTI();
    await tx.wait();
    setMyMbti(-1);
    setMyHistory(myHistory => [...myHistory, ""])
  }

  const handleSearchMbti = async (address: string) => {
    const signature = await metaMaskStore.signer?.signMessage(getAddress(address))

    if (!signature || !userAddress) return;

    const res = await fetch(`/api/mbti/${address}`, {
      method: 'POST',
      body: JSON.stringify({ signature, myAddress: userAddress })
    })

    const { address: searchAddress, value } = await res.json();
    setSearchAddress(searchAddress);
    setSearchMbti(convertMbtiToString(value));
  }

  return (
    <Container>
      <h1 className='text-center mt-5 mb-3'>MBTI</h1>
      <LoginLogout  {...{ address: userAddress, onLogin, onLogout }} />

      {userAddress && <>
        <MbtiSelect mbti={mbtiSelectValue} onChange={setMbtiSelectValue} />

        {myMbti < 0 && <Button
          className='w-100'
          onClick={onClaimMBTI}
        >Claim MBTI</Button>}

        {myMbti >= 0 && <>
          <Row className='justify-content-around'>
            <Col as={Button} xs={5} onClick={onUpdateMBTI}>更新</Col>
            <Col as={Button} variant="danger" xs={5} onClick={onDestroyMBTI}>销毁</Col>
          </Row>

          <Card body className='fs-1 bg-warning-subtle text-center mt-3 mb-5 shadow'>
            {convertMbtiToString(myMbti)}
          </Card>
        </>}

        <p>您被围观了 {viewTime} 次 MBTI</p>

        {myHistory.length > 0 && <ClaimHistory record={['INTJ', 'ENTJ', ''] || myHistory} />}

        <SearchMbti userAddress={searchAddress} mbti={searchMbti} onSearch={handleSearchMbti} />
      </>}
    </Container>
  )
}
