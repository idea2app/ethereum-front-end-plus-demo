class MetaMask {
  constructor() {
    globalThis.window?.ethereum?.on('accountsChanged', () => location.reload())
  }

  async connectWallet() {
    if (!window?.ethereum) throw new Error("MetaMask is not installed!")

    const [account] = await window.ethereum.request({
      method: 'eth_requestAccounts',
    }) as string[];

    return account;
  }
}

export default new MetaMask();
