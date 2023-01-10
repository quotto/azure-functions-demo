import axios, { AxiosResponse } from "axios"
import querystring from "querystring";
import { ErrorResponse, handleAxiosError, logger } from "./utils"
export const getGraphApiTokenWithClientCertificate = async(): Promise<AxiosResponse | ErrorResponse>=>{
    const headers = {
        ContentType: "application/json"
    }
    const body = {
        client_id: process.env.APP_CLIENT_ID,
        client_secret: process.env.APP_CLIENT_SECRET,
        scope: "https://graph.microsoft.com/.default",
        grant_type: "client_credentials"
    }
    return await axios.post(`https://login.microsoftonline.com/${process.env.APP_TENANT_ID}/oauth2/v2.0/token`, querystring.stringify(body),{headers: headers}).then(response=>response).catch(error=>{
       logger.error("get client credentials token error");
        return handleAxiosError(error);
    })
}

export const getGraphApiTokkenWithUserPermission = async(token: string): Promise<AxiosResponse | ErrorResponse> =>{
    const headers = {
        Authorization: `Bearer ${token}`,
        ContentType: "application/json"
    }
    const body = {
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        client_id: process.env.APP_CLIENT_ID,
        client_secret: process.env.APP_CLIENT_SECRET,
        assertion: token,
        scope: "https://graph.microsoft.com/User.Read",
        requested_token_use: "on_behalf_of"
    }
    return await axios.post(`https://login.microsoftonline.com/${process.env.APP_TENANT_ID}/oauth2/v2.0/token`, querystring.stringify(body),{headers: headers}).then(response=>response).catch(error=>{
        logger.error("get graph api token with user permission response error");
        return handleAxiosError(error);
    })
}
