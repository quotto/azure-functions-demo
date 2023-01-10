import { Context } from "@azure/functions";
import { AxiosResponse } from "axios";
import { GraphRequester }  from "../graph";
import { getGraphApiTokenWithClientCertificate } from "../token-requester";
import { ErrorResponse, handleAxiosError, isErrorResponse, logger } from "../utils";
export default async function (context: Context) {
    logger.setContext(context);

    const clientCredentialsResponse = await getGraphApiTokenWithClientCertificate();
    if(!isErrorResponse(clientCredentialsResponse) && (clientCredentialsResponse as AxiosResponse).status === 200) {
        const graph_requester = new GraphRequester();
        const result = await graph_requester.getAllTenantUsers((clientCredentialsResponse as AxiosResponse).data.access_token);
        if(!isErrorResponse(result) && (result as AxiosResponse).status === 200) {
            context.res = {
                // status: 200, /* Defaults to 200 */
                body: JSON.stringify({data: (result as AxiosResponse).data, used_token: (clientCredentialsResponse as AxiosResponse).data.access_token})
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