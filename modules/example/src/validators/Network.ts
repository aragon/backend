import { NetworksEnum } from "../types/Networks";

export const isSupportedNetwork = {
  validator: (network: NetworksEnum) => NetworksEnum[network] !== undefined,
  message: "Is not a supported network",
};
