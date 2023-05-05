import { getAddress } from "@ethersproject/address";
import { injectable } from "tsyringe";
import { Arg, FieldResolver, Query, Resolver, Root } from "type-graphql";
import { AddressModel } from "../models";
import { Address } from "../models/Address";
import EtherscanService from "../services/Etherscan.service";
import Logger from "../services/Logger.service";
import { NetworksEnum } from "../types/Networks";

@Resolver(() => Address)
@injectable()
export default class AddressResolver {
  private cacheDuration =
    parseInt(process.env.BALANCE_CACHE_DURATION_MINS || "5") * 60 * 1000;

  constructor(private logger: Logger, private etherscan: EtherscanService) {
    this.logger.setName(AddressResolver.name);
  }

  /**
   * Query to get an address on the specific network.
   * Updates the DB entity if the last update is older than the cache duration.
   *
   * @param {string} address
   * @param {NetworksEnum} network
   * @return {*}
   * @memberof AddressResolver
   */
  @Query(() => Address)
  public async address(
    @Arg("address") address: string,
    @Arg("network", () => NetworksEnum) network: NetworksEnum
  ) {
    this.logger.debug(`Got request for ${address} on ${network}`);
    const checksumAddress = getAddress(address);
    const addressDB = await AddressModel.findOrCreateWithResult({
      address: checksumAddress,
      network: network.toUpperCase(),
    });
    if (
      addressDB.created ||
      addressDB.doc.lastUpdated < new Date(Date.now() - this.cacheDuration)
    ) {
      this.logger.info(
        `${address} on ${network} needs an update. Grabbing latest info`
      );
      const balance = await this.etherscan.getEtherBalance(network, address);
      addressDB.doc.balance = balance;
      await addressDB.doc.save();
    }
    return addressDB.doc.toObject();
  }
}
