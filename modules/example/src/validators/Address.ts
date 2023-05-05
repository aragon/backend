import { isAddress } from "@ethersproject/address";

export const isChecksumAddress = {
  validator: (address: string) => isAddress(address),
  message: "Address is not a checksum address",
};
