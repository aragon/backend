import "reflect-metadata";
import { container } from "tsyringe";
import AddressResolver from "../../src/resolvers/Address.resolver";
import { AddressModel } from "../../src/models";
import { NetworksEnum } from "../../src/types/Networks";
import EtherscanService from "../../src/services/Etherscan.service";
import EtherscanServiceMock from "../mocks/EtherscanService.mock";
import Logger from "../../src/services/Logger.service";
import { Address } from "../../src/models/Address";
import { DocumentType } from "@typegoose/typegoose";

describe("AddressResolver", () => {
  it("should have a default cache duration of 5 mins", () => {
    const resolver = container.resolve(AddressResolver);
    // @ts-ignore Ignore to access private property
    expect(resolver.cacheDuration).toBe(5 * 60 * 1000);
  });
  it("should have a set cache duration to 2 mins", () => {
    process.env.BALANCE_CACHE_DURATION_MINS = "2";
    const resolver = container.resolve(AddressResolver);
    // @ts-ignore Ignore to access private property
    expect(resolver.cacheDuration).toBe(2 * 60 * 1000);
    process.env.BALANCE_CACHE_DURATION_MINS = undefined;
  });
  describe("address query", () => {
    const checksumAddress = "0xD9B4A3B9c5b1022d5F8f254D731b0459813C2067";
    let findOrCreateSpy: jest.SpyInstance;
    let doc: DocumentType<Address>;
    let resolver: AddressResolver;

    beforeEach(() => {
      doc = new AddressModel({
        address: checksumAddress,
        balance: BigInt(0),
        network: NetworksEnum.MAINNET,
        lastUpdated: new Date(),
      });
      findOrCreateSpy = jest
        .spyOn(AddressModel, "findOrCreateWithResult")
        .mockResolvedValue({
          created: false,
          doc: new AddressModel({
            address: checksumAddress,
            balance: "0",
            network: NetworksEnum.MAINNET,
            lastUpdated: new Date(),
          }),
        });
      resolver = container.resolve(AddressResolver);
    });

    afterEach(() => {
      findOrCreateSpy.mockRestore();
    });

    beforeAll(() => {
      container.register(Logger, Logger);
      container.register(EtherscanService, EtherscanServiceMock);
    });

    it("should update the address to be checksum address", async () => {
      await resolver.address(
        checksumAddress.toLowerCase(),
        NetworksEnum.MAINNET
      );

      expect(findOrCreateSpy).toHaveBeenCalledWith({
        address: checksumAddress,
        network: NetworksEnum.MAINNET,
      });
    });

    it("should search with the correct parameters", async () => {
      await resolver.address(checksumAddress, NetworksEnum.MAINNET);

      expect(findOrCreateSpy).toHaveBeenCalledWith({
        address: checksumAddress,
        network: NetworksEnum.MAINNET,
      });
    });

    it("should query etherscan for the balance if the Address is never seen", async () => {
      doc.save = jest.fn();
      findOrCreateSpy.mockResolvedValue({
        created: true,
        doc,
      });
      await resolver.address(checksumAddress, NetworksEnum.MAINNET);

      // @ts-ignore Accessing private property
      expect(resolver.etherscan.getEtherBalance).toHaveBeenCalledWith(
        NetworksEnum.MAINNET,
        checksumAddress
      );
    });

    it("should update the doc with the balance from etherscan if the Address is never seen", async () => {
      doc.save = jest.fn();
      findOrCreateSpy.mockResolvedValue({
        created: true,
        doc,
      });
      const newBalance = "2000";
      // @ts-ignore Accessing private property
      resolver.etherscan.getEtherBalance.mockResolvedValue(newBalance);
      await resolver.address(checksumAddress, NetworksEnum.MAINNET);

      expect(doc.balance).toBe(newBalance);
      expect(doc.save).toHaveBeenCalled();
    });

    it("should update the doc with the balance from etherscan if the last update is older than the cache period", async () => {
      doc.save = jest.fn();
      findOrCreateSpy.mockResolvedValue({
        created: true,
        doc,
      });
      doc.lastUpdated = new Date(Date.now() - 10 * 60 * 1000);
      const newBalance = "2000";
      // @ts-ignore Accessing private property
      resolver.etherscan.getEtherBalance.mockResolvedValue(newBalance);
      await resolver.address(checksumAddress, NetworksEnum.MAINNET);

      expect(doc.balance).toBe(newBalance);
      expect(doc.save).toHaveBeenCalled();
    });

    it("should return a bare javascript object", async () => {
      const docObj = doc.toObject();
      doc.toObject = jest.fn().mockReturnValue(docObj);
      findOrCreateSpy.mockResolvedValue({
        created: false,
        doc,
      });
      const response = await resolver.address(
        checksumAddress,
        NetworksEnum.MAINNET
      );
      expect(response).toBe(docObj);
    });
  });
});
