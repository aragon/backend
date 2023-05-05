import { prop, Ref } from "@typegoose/typegoose";
import { ERC20Transfer } from "./ERC20Transfer";
import { TokenCached } from "./Bases/Token";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class ERC20Token extends TokenCached {
  @Field()
  @prop({ required: true })
  public decimals!: number;

  @Field()
  @prop({ required: true })
  public totalSupply!: number;

  @prop({ ref: () => ERC20Transfer })
  public transfers?: Ref<ERC20Transfer>[];
}
