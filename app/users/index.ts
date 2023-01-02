import { Context } from "@azure/functions";
import axios from "axios";
import querystring from "querystring";
import { GraphRequester }  from "../graph";
import { ErrorResponse, handleAxiosError, isErrorResponse } from "../utils";
export default async function (context: Context) {
    const clientCredentialsResponse = await getGraphApiTokenWithClientCertificate(context);
    if(!isErrorResponse(clientCredentialsResponse) && clientCredentialsResponse.status === 200) {
        const graph_requester = new GraphRequester(context);
        const result = await graph_requester.getAllTenantUsers(clientCredentialsResponse.data.access_token);
        if(!isErrorResponse(result) && result.status === 200) {
            context.res = {
                // status: 200, /* Defaults to 200 */
                body: JSON.stringify({data: result.data, used_token: clientCredentialsResponse.data.access_token})
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
            body: JSON.stringify({message: (clientCredentialsResponse as ErrorResponse).message})
        }
    }
}

const getGraphApiTokenWithClientCertificate = async(context: Context)=>{
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
       context.log.error("get client credentials token error");
        return handleAxiosError(context,error);
    })
}
