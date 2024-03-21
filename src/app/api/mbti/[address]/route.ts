import { ethers, getAddress, verifyMessage } from "ethers";

import { abiAndAddress } from "../../../../models/AbiAndAddress";
import { defaultChainInfo } from "../../../../models/chainInfo";

const url = defaultChainInfo.rpcUrls[0];
const { mbti: { abi, address: contractAddress } } = abiAndAddress;

const provider = new ethers.JsonRpcProvider(url);
const contract = new ethers.Contract(contractAddress, abi, provider)

const countMap = new Map<string, number>();

const CustomResponse = (value: any, status = 200) => new Response(JSON.stringify(value), { status });

const ErrorResponse = (error: string | any, status = 400) => CustomResponse(error, status);

const checkAddress = (address?: string) => {
  if (!address) return ErrorResponse("Address parameter is required", 404)
  if (!/^0[xX][0-9a-fA-F]{40}$/.test(address)) return ErrorResponse("Invalid input address", 404)
}

export async function POST(
  request: Request,
  { params: { address } }: { params: { address: string } }
) {
  const checkResult = checkAddress(address);
  if (checkResult) return checkResult;

  try {
    const normalizedAddress = getAddress(address);
    const { signature, myAddress } = await request.json();

    if (!signature) return ErrorResponse('Invalid signature');
    if (getAddress(myAddress) !== verifyMessage(normalizedAddress, signature)) return ErrorResponse("illegal signature");

    const value = Number(await contract.getMBTI(normalizedAddress));

    const count = (countMap.get(normalizedAddress) || 0) + 1;
    countMap.set(normalizedAddress, count);

    return CustomResponse({ address: normalizedAddress, value })
  } catch (error: any) {
    console.error(error);

    const { message } = error as Error;
    if (message) return ErrorResponse(message);

    return ErrorResponse('Not found', 404);
  }
}

export function GET(
  _: Request,
  { params: { address } }: { params: { address: string } }
) {
  const checkResult = checkAddress(address);
  if (checkResult) return checkResult;

  try {
    const normalizedAddress = getAddress(address);

    const count = countMap.get(normalizedAddress) || 0;

    return CustomResponse({ count });
  } catch (error: any) {
    console.error(error);

    const { message } = error as Error;
    if (message) return ErrorResponse(message);

    return ErrorResponse('Not found', 404);
  }
}
