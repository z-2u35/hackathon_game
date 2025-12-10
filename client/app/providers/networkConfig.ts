import { getFullnodeUrl } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } = createNetworkConfig({
  testnet: {
    url: getFullnodeUrl("testnet"),
    variables: {
      // Package ID từ lần deploy thành công trước đó
      packageId: "0xe971854d96a1005aed7e1bd41bc703c1f8626d1b70cad7f789ecc41eb9ca7b12",
    },
  },
  mainnet: {
    url: getFullnodeUrl("mainnet"),
    variables: {
      packageId: "0xe971854d96a1005aed7e1bd41bc703c1f8626d1b70cad7f789ecc41eb9ca7b12",
    },
  },
});

export { networkConfig, useNetworkVariable, useNetworkVariables };