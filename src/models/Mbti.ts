import { abiAndAddress } from "./AbiAndAddress";
import metaMaskstore from './MetaMask';

class Mbti {
  async claimMbti(value: number) {
    const mbtiContract = await metaMaskstore.getDaiContractWithSigner(abiAndAddress.mbti);

    mbtiContract.claimMBTI(value);
  }
}

export default new Mbti();