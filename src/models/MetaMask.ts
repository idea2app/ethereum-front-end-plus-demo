import { BrowserProvider, Contract, ethers, JsonRpcSigner } from "ethers";

import { defaultChainInfo } from "./chainInfo";

interface ContractAddressAndAbi {
  address: string;
  abi: ethers.Interface | ethers.InterfaceAbi;
}

const { localStorage } = globalThis;

class MetaMask {
  browserProvider?: BrowserProvider;

  signer?: JsonRpcSigner;

  constructor() {
    globalThis.window?.ethereum?.on('accountsChanged', accounts => {
      localStorage.account = (accounts as string[])?.[0] ?? "";
      this.switchDefaultChainAndReload();
    })

    globalThis.window?.ethereum?.on('chainChanged', this.switchDefaultChainAndReload)
  }

  async connectWallet() {
    if (!window?.ethereum) throw new Error("MetaMask is not installed!")

    const [account] = await window.ethereum.request({
      method: 'eth_requestAccounts',
    }) as string[];

    return account;
  }

  async switchChain(chainInfo: Record<string, unknown>) {
    try {
      await window?.ethereum?.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainInfo.chainId }]
      })
    } catch (error: any) {
      window?.ethereum?.request({
        method: "wallet_addEthereumChain",
        params: [chainInfo]
      })
    }
  }

  switchDefaultChain = () => this.switchChain(defaultChainInfo);

  switchDefaultChainAndReload = async () => {
    await this.switchDefaultChain();
    location.reload()
  }

  getBrowserProvider() {
    if (!globalThis.window?.ethereum)
      throw new Error('MetaMask is not installed!');

    if (!this.browserProvider)
      this.browserProvider = new ethers.BrowserProvider(globalThis.window.ethereum);

    return this.browserProvider;
  }

  async getSigner() {
    if (this.browserProvider && localStorage?.account && this.signer) return this.signer;

    if (!localStorage.account) await this.connectWallet();

    if (!this.browserProvider) this.getBrowserProvider();

    return (this.signer = await this.browserProvider!.getSigner());
  }

  async getDaiContract({ address, abi }: ContractAddressAndAbi) {
    await this.switchDefaultChain();

    return new Contract(address, abi, this.getBrowserProvider());
  }

  async getDaiContractWithSigner({ address, abi }: ContractAddressAndAbi) {
    await this.switchDefaultChain();

    return new Contract(address, abi, await this.getSigner());
  }
}

export default new MetaMask();
