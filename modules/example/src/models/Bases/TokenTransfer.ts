import { pre, prop, Ref } from "@typegoose/typegoose";
import { Field } from "type-graphql";
import { isChecksumAddress } from "../../validators/Address";
import { FindOrCreate } from "./FindOrCreate";
import { Token } from "./Token";

export abstract class TokenTransfer extends FindOrCreate {
  @prop({ ref: "Token", required: true })
  public token!: Ref<Token>;

  @Field()
  @prop({
    required: true,
    validate: isChecksumAddress,
    index: true,
  })
  public from!: string;

  @Field()
  @prop({
    required: true,
    validate: isChecksumAddress,
    index: true,
  })
  public to!: string;

  @Field()
  @prop({ required: true })
  public date!: Date;
}

@pre<TokenTransferCached>("validate", function () {
  this.lastUpdated = new Date();
})
export abstract class TokenTransferCached extends TokenTransfer {
  @Field()
  @prop({ required: true })
  public lastUpdated?: Date;
}
