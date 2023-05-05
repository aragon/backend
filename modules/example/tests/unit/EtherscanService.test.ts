import "reflect-metadata";
import { container } from "tsyringe";
import EtherscanService, {
  EtherscanResponseStatus,
} from "../../src/services/Etherscan.service";
import { NetworksEnum } from "../../src/types/Networks";

describe("EtherscanService", () => {
  let fetchBackup: (
    input: RequestInfo | URL,
    init?: RequestInit | undefined
  ) => Promise<Response>;
  let mockedFetch: jest.Mock;
  let responseMock: jest.Mock;
  let service: EtherscanService;
  const address = "0xD9B4A3B9c5b1022d5F8f254D731b0459813C2067";

  beforeAll(() => {
    fetchBackup = global.fetch;
    responseMock = jest.fn().mockResolvedValue({});
    global.fetch = jest.fn().mockResolvedValue({ json: responseMock });
    mockedFetch = global.fetch as jest.Mock;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    service = container.resolve(EtherscanService);
  });

  afterAll(() => {
    global.fetch = fetchBackup;
  });

  describe("constructor", () => {
    it("should load the api from env vars", () => {
      process.env.ETHERSCAN_API_KEY = "API_KEY";
      service = container.resolve(EtherscanService);
      // @ts-ignore Ignore to access private property
      expect(service.apiKey).toBe("API_KEY");

      process.env.ETHERSCAN_API_KEY = undefined;
    });
  });

  describe("getEtherBalance", () => {
    it("should call internal request function", async () => {
      // @ts-ignore ignore to access private property
      const requestSpy = jest.spyOn(service, "request").mockResolvedValue({});
      await service.getEtherBalance(NetworksEnum.MAINNET, address);
      expect(requestSpy).toHaveBeenCalledWith(
        NetworksEnum.MAINNET,
        `/api?module=account&action=balance&address=${address}&tag=latest`
      );
    });
  });

  describe("request", () => {
    it("should add the correct base for mainnet", async () => {
      // @ts-ignore ignore to access private property
      await service.request(NetworksEnum.MAINNET, "/path");
      expect(mockedFetch).toHaveBeenCalledWith(
        // @ts-ignore ignore to access private property
        `${service.apiBases[NetworksEnum.MAINNET]}/path&apikey=undefined`
      );
    });
    it("should append the api key", async () => {
      // @ts-ignore ignore to access private property
      service.apiKey = "Some-key";
      // @ts-ignore ignore to access private property
      await service.request(NetworksEnum.MAINNET, "/path");
      expect(mockedFetch).toHaveBeenCalledWith(
        // @ts-ignore ignore to access private property
        `${service.apiBases[NetworksEnum.MAINNET]}/path&apikey=Some-key`
      );
    });
    it("should append the correct path", async () => {
      // @ts-ignore ignore to access private property
      await service.request(
        NetworksEnum.MAINNET,
        "/Some/really/strange/path?foo=bar"
      );
      expect(mockedFetch).toHaveBeenCalledWith(
        `${
          // @ts-ignore ignore to access private property
          service.apiBases[NetworksEnum.MAINNET]
        }/Some/really/strange/path?foo=bar&apikey=undefined`
      );
    });
    it("should throw the body message on error", async () => {
      responseMock.mockResolvedValueOnce({
        status: EtherscanResponseStatus.NOTOK,
        message: "SomeErrorMessage",
      });
      await expect(
        // @ts-ignore ignore to access private property
        service.request(NetworksEnum.MAINNET, "/path")
      ).rejects.toEqual(new Error("SomeErrorMessage"));
    });
    it("should return the body on success", async () => {
      const body = {
        status: EtherscanResponseStatus.OK,
        message: "OK",
        result: "Success",
      };
      responseMock.mockResolvedValueOnce(body);
      await expect(
        // @ts-ignore ignore to access private property
        service.request(NetworksEnum.MAINNET, "/path")
      ).resolves.toEqual(body);
    });
  });
});
