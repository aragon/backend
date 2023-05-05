import { pre, prop, Ref } from "@typegoose/typegoose";
import { Field } from "type-graphql";
import { NetworksEnum } from "../../types/Networks";
import { isChecksumAddress } from "../../validators/Address";
import { isSupportedNetwork } from "../../validators/Network";
import { FindOrCreate } from "./FindOrCreate";
import { TokenTransfer } from "./TokenTransfer";

export abstract class Token extends FindOrCreate {
  @Field()
  @prop({
    required: true,
    validate: isChecksumAddress,
    index: true,
  })
  public address!: string;

  @Field()
  @prop({ enum: NetworksEnum, required: true, validate: isSupportedNetwork })
  public network!: NetworksEnum;

  @prop({ ref: "TokenTransfer" })
  public transfers?: Ref<TokenTransfer>[];
}

@pre<TokenCached>("validate", function () {
  this.lastUpdated = new Date();
})
export abstract class TokenCached extends Token {
  @Field()
  @prop({ required: true })
  public lastUpdated?: Date;
}
