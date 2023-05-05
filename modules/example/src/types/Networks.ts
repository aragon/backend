import { registerEnumType } from "type-graphql";

export type Networks = "MAINNET" | "GOERLI" | "MUMBAI" | "POLYGON";
export enum NetworksEnum {
  MAINNET = "MAINNET",
  GOERLI = "GOERLI",
  MUMBAI = "MUMBAI",
  POLYGON = "POLYGON",
}


registerEnumType(NetworksEnum, {
    name: 'Network',
    description: 'The supported networks'
})