import { setTimeout } from "timers/promises";
import { injectable } from "tsyringe";
import { NetworksEnum } from "../types/Networks";
import Logger from "./Logger.service";

export enum EtherscanResponseStatus {
  NOTOK = "0",
  OK = "1",
}

export type EtherscanResponse<T> =
  | EtherscanResponseError
  | EtherscanResponseSuccess<T>;

export type EtherscanResponseError = {
  status: EtherscanResponseStatus.NOTOK;
  message: string;
};
export type EtherscanResponseSuccess<T> = {
  status: EtherscanResponseStatus.OK;
  message: string;
  result: T;
};

@injectable()
export default class EtherscanService {
  private apiKey?: string = process.env.ETHERSCAN_API_KEY;
  private apiBases: { [key in NetworksEnum]?: string } = {
    [NetworksEnum.GOERLI]: "https://api.etherscan.io",
    [NetworksEnum.MAINNET]: "https://api-goerli.etherscan.io",
  };

  constructor(private logger: Logger) {
    this.logger.setName(EtherscanService.name);

    if (!this.apiKey) {
      this.logger.warn("No API key defined. Limited performance...");
    }
  }

  /**
   * Returns the EtherBalance for an address
   *
   * @param {NetworksEnum} network
   * @param {string} address
   * @return {*}  {Promise<string>}
   * @memberof EtherscanService
   */
  public async getEtherBalance(
    network: NetworksEnum,
    address: string
  ): Promise<string> {
    this.logger.debug(`Getting ether balance on ${network} for ${address}`);
    const response = await this.request<string>(
      network,
      `/api?module=account&action=balance&address=${address}&tag=latest`
    );
    return response.result;
  }

  /**
   * Internal helper function to request resources from the API and handling rate limits
   *
   * @private
   * @template T
   * @param {NetworksEnum} network
   * @param {string} path
   * @return {*}  {Promise<EtherscanResponseSuccess<T>>}
   * @memberof EtherscanService
   */
  private async request<T>(
    network: NetworksEnum,
    path: string
  ): Promise<EtherscanResponseSuccess<T>> {
    this.logger.debug(`Requesting ${path} on ${network}`);
    const response = await fetch(
      `${this.apiBases[network]}${path}&apikey=${this.apiKey}`
    );
    this.logger.debug(`Got reponse`);
    const jsonBody: EtherscanResponse<T> = await response.json();
    if (jsonBody.status === EtherscanResponseStatus.NOTOK) {
      if (jsonBody.message.includes("Max rate limit reached")) {
        this.logger.warn(`Rate-limit reached. Retrying in 2 seconds...`);
        await setTimeout(2000);
        return this.request(network, path);
      }
      this.logger.error(
        `Request ${path} failed on ${network} with ${jsonBody.message}`
      );
      throw new Error(jsonBody.message);
    }
    return jsonBody;
  }
}
