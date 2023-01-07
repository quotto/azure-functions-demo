import {Context, HttpRequest} from "@azure/functions";
import axios,{AxiosResponse} from "axios";
import {GraphRequester} from "../graph";
import querystring from 'querystring';
import { handleAxiosError,ErrorResponse, isErrorResponse } from "../utils";
export default async function (context: Context, req: HttpRequest) {
    const token = req.headers.authorization.split(" ")[1];
    const bobResponse = await getGraphApiTokkenWithUserPermission(context,token);
    if(!isErrorResponse(bobResponse) && bobResponse.status === 200) {
        const graph_requester = new GraphRequester(context);
        const result = await graph_requester.getMe(bobResponse.data.access_token);
        if(!isErrorResponse(result) && result.status === 200) {
            context.res = {
                // status: 200, /* Defaults to 200 */
                body:  JSON.stringify({data: result.data, used_token: bobResponse.data.access_token})
            };
        } else {
            context.res = {
                status: 500,
                body: JSON.stringify({message: (result as ErrorResponse).message})
            }
        }
    } else {
        context.res = {
            status: 500,
            body: JSON.stringify({message: (bobResponse as ErrorResponse).message})
        }
    }
}

const getGraphApiTokkenWithUserPermission = async(context: Context,token: string): Promise<AxiosResponse | ErrorResponse> =>{
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
        context.log.error("get graph api token with user permission response error");
        return handleAxiosError(context,error);
    })
}
