import { prop, Ref } from "@typegoose/typegoose";
import { ERC20Token } from "./ERC20Token";
import { TokenTransferCached } from "./Bases/TokenTransfer";
import { ObjectType } from "type-graphql";

@ObjectType()
export class ERC20Transfer extends TokenTransferCached {
  @prop({ ref: () => ERC20Token, required: true })
  public token!: Ref<ERC20Token>;

  @prop({ required: true, type: () => String })
  public amount = "0";
}
