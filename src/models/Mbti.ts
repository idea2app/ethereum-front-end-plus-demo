import { EventLog, parseEther } from "ethers";

import { abiAndAddress } from "./AbiAndAddress";
import metaMaskStore from './MetaMask';

const { mbti: mbtiContractInfo } = abiAndAddress;

class Mbti {
  async claimMBTI(value: number) {
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

  async getRecord(address: string) {
    const mbtiContract = await metaMaskStore.getDaiContract(mbtiContractInfo);

    const filter = await mbtiContract.filters.MBTIUpdated(address);
    const eventLogs = await mbtiContract.queryFilter(filter) as EventLog[];

    return eventLogs.map(({args})=>Number((args[1] as BigInt).toString()));
  }
}

export default new Mbti();