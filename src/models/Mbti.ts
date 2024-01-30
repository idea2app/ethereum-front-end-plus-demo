import { parseEther } from "ethers";

import { abiAndAddress } from "./AbiAndAddress";
import metaMaskStore from './MetaMask';

const { mbti: mbtiContractInfo } = abiAndAddress;

class Mbti {
  async claimMbti(value: number) {
    const mbtiContract = await metaMaskStore.getDaiContractWithSigner(mbtiContractInfo);

    return mbtiContract.claimMBTI(value);
  }

  async getMyMBTI() {
    const mbtiContract = await metaMaskStore.getDaiContractWithSigner(mbtiContractInfo);

    return mbtiContract.getMyMBTI();
  }

  async updateMBTI(mbti: number) {
    const mbtiContract = await metaMaskStore.getDaiContractWithSigner(mbtiContractInfo);

    return mbtiContract.updateMBTI(mbti,{value: parseEther("0.001")});
  }

  async destroyMBTI() {
    const mbtiContract = await metaMaskStore.getDaiContractWithSigner(mbtiContractInfo);

    return mbtiContract.destroyMBTI({value: parseEther("0.001")});
  }
}

export default new Mbti();