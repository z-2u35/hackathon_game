import { getFullnodeUrl } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } = createNetworkConfig({
  devnet: {
    url: getFullnodeUrl("devnet"),
    variables: {
      // Package ID devnet (sau khi bạn deploy devnet)
      packageId: "0xbe8205e3b7a68a1f8527322a62f540600839b0d6435f5508e80c4255d517ae7b",
    },
  },

  testnet: {
    url: getFullnodeUrl("testnet"),
    variables: {
      // Package ID từ lần deploy thành công trước đó
      packageId: "0xf28c49f61cfa0853385f04450cc510d7df2fbc6d573b93a2ed04ee15b18076df",
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
