import { pre, prop } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import { isChecksumAddress } from "../validators/Address";
import { isSupportedNetwork } from "../validators/Network";
import { FindOrCreate } from "./Bases/FindOrCreate";

@ObjectType()
@pre<Address>("validate", function () {
  this.lastUpdated = new Date();
})
export class Address extends FindOrCreate {
  @Field()
  @prop({ required: true, validate: isChecksumAddress })
  public address!: string;

  @Field()
  @prop({ required: true, validate: isSupportedNetwork })
  public network!: string;

  @Field()
  @prop({ required: true, default: "0", type: () => String })
  public balance: string = "0";

  @Field()
  @prop({ required: true })
  public lastUpdated!: Date;
}
