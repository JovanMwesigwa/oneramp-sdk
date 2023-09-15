import { Signer, ethers } from "ethers";
import tokenABI from "../utilities/abi.json";
import onerampABI from "../utilities/abit.json";

import addresses, {
  IfcAddresses,
  IfcOneNetworksAddresses,
} from "../constants/addresses";
import { Network, Token, UserCredsI, VerifyCreds } from "../Types";
import { Requests } from "../helpers/requests.js";
import axios from "axios";
import { createTransaction } from "../helpers/backend";

function getTokenAddress(tokenName: Token, network: Network) {
  const tokenAddress = addresses[network][tokenName];
  return tokenAddress;
}

export class OneRamp {
  private signer: Signer | undefined;
  provider: ethers.Provider | undefined;
  network: Network;
  private pubKey: string;
  private secretKey: string;
  private addresses: IfcOneNetworksAddresses;

  constructor(
    network: Network,
    pubKey: string,
    secretKey: string,
    provider?: ethers.Provider,
    signer?: Signer
  ) {
    this.network = network;
    this.provider = provider;
    this.signer = signer;
    this.addresses = addresses[this.network];
    this.pubKey = pubKey;
    this.secretKey = secretKey;
  }

  /*
    Verify application creds middleware
    This is a private function, and it will only be accessed and called from the class body
  */
  private async verifyCreds(): Promise<VerifyCreds> {
    if (!this.pubKey || !this.secretKey) {
      return {
        success: false,
        status: 404,
        message: "No Credentials detected!",
        store: null,
      };
    }

    const request = new Requests();

    /* 
        Extract the wanted store information from the db by matching the public and secret key that was entered
        THIS LINE CAN BE REPLACED WITH AN EXTRACT CALL TO THE DB
    */
    const data = {
      clientId: this.pubKey,
      secret: this.secretKey,
    };

    const authenticated: UserCredsI = await request.db(data);

    return authenticated;
  }

  async offramp(token: Token, amount: number, phone: string): Promise<any> {
    try {
      if (!token || !amount || !amount)
        throw new Error("Missing key arguments");

      const request = new Requests();

      const verified = await this.verifyCreds();

      if (!verified.success) throw new Error("Invalid credentials");

      if (!this.signer) throw new Error("No signer set");

      const signer = this.signer;

      if (!this.provider) throw new Error("No provider set");

      const provider = this.provider;

      const tokenAddress = getTokenAddress(token, this.network);

      if (!tokenAddress) {
        throw new Error("Services for this token not supported");
      }

      const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);

      const approveTx = await tokenContract.approve(
        addresses[this.network].contract,
        ethers.parseEther(amount.toString())
      );

      await provider.waitForTransaction(approveTx.hash, 1);

      /*
    const signerAddress = await signer.getAddress();

    const allowance = await tokenContract.allowance(
      signerAddress,
      addresses[this.network].contract
    );

    if (allowance < ethers.parseEther(amount.toString()))
      throw new Error(
        "Insufficient allowance. Please approve more tokens before depositing."
      );
    */

      const offRampAddress = addresses[this.network].contract;

      const oneRampContract = new ethers.Contract(
        offRampAddress,
        onerampABI,
        signer
      );

      const tx = await oneRampContract.depositToken(
        tokenAddress,
        ethers.parseEther(amount.toString())
      );

      // Wait for 2 block confirmations.
      await provider.waitForTransaction(tx.hash, 1);

      // const testTXHash = "12576523";

      const fiat = await request.convertUSD(amount);

      // Create a new transaction in the database.
      const newTransaction = {
        store: verified.store,
        txHash: tx.hash,
        //   txHash: testTXHash,
        amount: amount,
        fiat: fiat,
        network: this.network,
        phone: phone,
        asset: token,
        status: "Pending",
      };

      const txData = await createTransaction(newTransaction);

      return txData;
    } catch (error) {
      return error;
    }
  }

  async quote(initialAmount: number, token: Token) {
    const withdrawalFeePercentage = 2.0; // Example withdrawal fee percentage

    const withdrawalFee = (initialAmount * withdrawalFeePercentage) / 100;
    const finalAmount = initialAmount - withdrawalFee;
    const data = {
      recives: finalAmount,
      estimated_fee: withdrawalFee,
      amount: initialAmount,
      asset: token,
      memo: "Prices may vary with local service providers",
    };

    return data;
  }
}
