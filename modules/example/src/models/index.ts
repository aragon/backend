import { getModelForClass } from "@typegoose/typegoose";
import { Address } from "./Address";
import { ERC20Token } from "./ERC20Token";
import { ERC20Transfer } from "./ERC20Transfer";

export const ERC20TransferModel = getModelForClass(ERC20Transfer);
export const ERC20TokenModel = getModelForClass(ERC20Token);
export const AddressModel = getModelForClass(Address)