# ONERAMP SDK

OneRamp is a utility package that helps facilitate token offramps and oneramps in various blockchain networks. It provides a set of tools to interact with blockchain tokens in a more accessible and abstracted way, providing a simple interface to approve, offramp and keep track of transactions.

## Installation

To use OneRamp in your project, you will need to install it via npm:

```bash
npm i @oneramp/sdk
```

or

```bash
yarn add @oneramp/sdk
```

## Usage

Import the OneRamp class from the package and create a new instance by providing the necessary parameters:

```js
import { OneRamp } from "@oneramp/sdk";

const oneramp = new OneRamp(
network, // Network type - "bscTestnet" | "bsc" | "celo" | "alfajores" | "mumbai"
  pubKey,  // Public key
  secretKey, // Secret key
  provider, // (Optional) ethers.provider
  signer // (Optional) Signer
);

```

You can then use the offramp method to deposit a specific amount of a token to a specific the oneramp address:

```js
oneramp.offramp(tokenAddress, amount, phoneNumber)
```

## Documentation

Browse the [documentation](https://docs.oneramp.io) online:

[Getting Started](https://docs.oneramp.io/#/quickstart)
[Full API Documentation](https://docs.oneramp.io/#/sdk)
