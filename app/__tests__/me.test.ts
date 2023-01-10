import {Context, HttpRequest, Form, FormPart} from "@azure/functions"
jest.mock("../token-requester");
import * as token_requester from "../token-requester";
jest.mock("../graph");
import * as graph_requester from "../graph";
import me from "../me/index";
import { AxiosResponse } from "axios";

const mockProcessEnv = {
  APP_CLIENT_ID: 'client-id',
  APP_CLIENT_SECRET: 'client-secret',
  APP_TENANT_ID: 'tenant-id',
} as any;


jest.mock('process', () => ({
  env: mockProcessEnv,
}));

describe("me",()=>{
  beforeEach(()=>{
    jest.clearAllMocks();
  });
  it("bobResponseError",async()=>{
    const mockFn = (token_requester.getGraphApiTokkenWithUserPermission as jest.Mock).mockImplementation(async ()=>{return {error: true, message: ""}}
    );

    const mockRequest: any = {
      headers: {
        authorization: "Bearer 12345678"
      }
    };
    const mockContext: any = {};

    await me(mockContext,  mockRequest);
    expect(mockFn.mock.calls[0][0]).toBe("12345678");
    expect(mockContext.res?.status).toBe(500);
  });
  it("success",async()=>{
    const mockTokenFn = (token_requester.getGraphApiTokkenWithUserPermission as jest.Mock).mockImplementation(async (): Promise<AxiosResponse> => {
      return {
        data: {
          access_token: "987654321"
        },
        status: 200,
        statusText: "",
        headers: {},
        config: {}
      }
    });

    const mockRequest: any = {
      headers: {
        authorization: "Bearer 12345678"
      }
    };
    const mockResponse: AxiosResponse = {
      data: {
        name: "taro",
      },
      status: 200,
      statusText: "",
      headers: {},
      config: {}
    };
    const mockGraphFn = (graph_requester.GraphRequester.prototype.getMe as jest.Mock).mockImplementation(async () => mockResponse);

    const mockContext: any = {};
    await me(mockContext, mockRequest);

    expect(mockTokenFn.mock.calls[0][0]).toBe("12345678");
    expect(mockGraphFn.mock.calls[0][0]).toBe("987654321");
    expect(mockContext.res?.status).toBe(200);
    expect(mockContext.res?.body).toBe(JSON.stringify({
      data: mockResponse.data, used_token: "987654321"
    }))
  });
})