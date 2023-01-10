import { Context, HttpRequest } from "@azure/functions";
import { GraphRequester } from "../graph";
import { ErrorResponse, isErrorResponse, logger } from "../utils";
import { getGraphApiTokkenWithUserPermission } from "../token-requester";
import { AxiosResponse } from "axios";
export default async function (context: Context, req: HttpRequest) {
    logger.setContext(context);

    const token = req.headers.authorization.split(" ")[1];
    const bobResponse = await getGraphApiTokkenWithUserPermission(token);
    if (!isErrorResponse(bobResponse) && (bobResponse as AxiosResponse).status === 200) {
        const graph_requester = new GraphRequester();
        const result = await graph_requester.getMe((bobResponse as AxiosResponse).data.access_token);
        if (!isErrorResponse(result) && (result as AxiosResponse).status === 200) {
            context.res = {
                status: 200, /* Defaults to 200 */
                body: JSON.stringify({ data: (result as AxiosResponse).data, used_token: (bobResponse as AxiosResponse).data.access_token })
            };
        } else {
            context.res = {
                status: 500,
                body: JSON.stringify({ message: (result as ErrorResponse).message })
            }
        }
    } else {
        context.res = {
            status: 500,
            body: JSON.stringify({ message: (bobResponse as ErrorResponse).message })
        }
    }
}