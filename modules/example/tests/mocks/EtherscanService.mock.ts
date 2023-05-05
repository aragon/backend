import { container } from "tsyringe";
import EtherscanService from "../../src/services/Etherscan.service";
import Logger from "../../src/services/Logger.service";

export default class EtherscanServiceMock extends EtherscanService {
  constructor() {
    const logger = container.resolve(Logger);
    super(logger);
  }

  public getEtherBalance = jest.fn();
}
