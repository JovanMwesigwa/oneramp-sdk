import axios from "axios";
import { Converter } from "easy-currencies";
import { UserCreds } from "../Types";
import apiUrl from "../constants/backend";

export const getAppCreds = async (creds: UserCreds): Promise<any> => {
  try {
    const headers = {
      client: creds.clientId,
      secret: creds.secret,
    };

    const response = await axios.get(`${apiUrl}/creds`, { headers });

    const data = response.data;

    return data;
  } catch (error) {
    return error;
  }
};

export const createTransaction = async (txData: any) => {
  try {
    // Convert the currency from here...
    const fiat = await currencyConvertor(txData.amount, "USD", "UGX");

    const newTransaction = {
      store: txData.store,
      txHash: txData.txHash,
      amount: txData.amount,
      fiat: fiat,
      network: txData.network,
      phone: txData.phone,
      asset: txData.asset,
      status: txData.status,
    };

    const response = await axios.post(`${apiUrl}/tx/create`, newTransaction);

    const result = response.data;

    return result;
  } catch (error: any) {
    console.log(error.message);
    return error;
  }
};

export const currencyConvertor = async (
  amount: number,
  currencyFrom: string,
  currencyTo: string
) => {
  try {
    if (Number(amount) <= 0) {
      return Number(amount);
    }

    const converter = new Converter();
    const value = await converter.convert(amount, currencyFrom, currencyTo);
    return value.toString();
  } catch (error: any) {
    console.log(error.response);
  }
};
