import { defaultChainInfo } from "./chainInfo";

const { localStorage } = globalThis;

class MetaMask {
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
}

export default new MetaMask();
