export type Network = "bscTestnet" | "bsc" | "celo" | "alfajores" | "mumbai";
export type Token =
  | "stable"
  | "usdt"
  | "dai"
  | "0xc0EBB770F2c9CA7eD0dDeBa58Af101695Cf1BDc1";

export type VerifyCreds = {
  success: boolean;
  status: Number;
  message: String;
  store: string | null;
};

export interface UserCreds {
  clientId: string;
  secret: string;
}

export interface UserCredsI {
  status: number;
  success: boolean;
  message: string;
  store: any;
  env: string | null;
}
