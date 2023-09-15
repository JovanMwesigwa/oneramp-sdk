import axios from "axios";
import { UserCreds, UserCredsI } from "../Types";
import { getAppCreds } from "./backend.js";

export class Requests {
  constructor() {}

  async db(data: UserCreds): Promise<UserCredsI> {
    try {
      const result = await getAppCreds(data);

      if (result?.store) {
        return {
          status: 200,
          success: true,
          message: "User credentials valid ",
          store: result.store,
          env: result.store.env,
        };
      } else {
        return {
          status: 404,
          success: false,
          message: "Invalid Credentials",
          store: null,
          env: "DEV",
        };
      }
    } catch (error) {
      return {
        status: 500,
        success: false,
        message: "Failed to reach the server",
        store: null,
        env: null,
      };
    }
  }

  async convertUSD(amount: number): Promise<any> {
    try {
      const response = await axios.get("https://open.er-api.com/v6/latest/USD");

      const rate = await response.data.rates.UGX.toFixed();

      const fiat = rate * amount;

      return fiat;
    } catch (error) {
      return error;
    }
  }
}
