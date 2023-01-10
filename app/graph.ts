import axios, { AxiosResponse } from "axios";
import {Context} from "@azure/functions";
import {ErrorResponse, handleAxiosError, logger} from "./utils";
export class GraphRequester {
    private static GRAPH_ENDPOINT = "https://graph.microsoft.com/v1.0";
    private static PATH_SIGNIN_USER = "/me";
    private static PATH_ALL_TENANT_USER = "/users";
    async getMe(token: string): Promise<AxiosResponse | ErrorResponse>  {
        const headers = {
            Authorization: `Bearer ${token}`
        }
        return await axios.get(`${GraphRequester.GRAPH_ENDPOINT}${GraphRequester.PATH_SIGNIN_USER}`, {headers: headers}).then(response=>response).catch(error=>{
            logger.error("get user profile error");
            return handleAxiosError(error);
        })
    }
    async getAllTenantUsers(token: string) {
        const headers = {
            Authorization: `Bearer ${token}`
        }
        return await axios.get(`${GraphRequester.GRAPH_ENDPOINT}${GraphRequester.PATH_ALL_TENANT_USER}`, {headers: headers}).then(response=>response).catch(error=>{
            logger.error("get all tenant users error");
            return handleAxiosError(error);
        })
    }
}