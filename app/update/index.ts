import { Context, HttpRequest } from "@azure/functions";
import { GraphRequester } from "../graph";
import { ErrorResponse, isErrorResponse, logger } from "../utils";
import { getGraphApiTokkenWithUserPermission } from "../token-requester";
import { AxiosResponse } from "axios";
export default async function (context: Context, req: HttpRequest) {
    logger.setContext(context);

    if(req.body) {
        logger.debug(req.body);
        // Set the output binding data from the query object.
        context.bindings.todoDocument = JSON.stringify(req.body);

        // Success.
        context.res = {
            status: 200
        };
    } else {
        context.res = {
            status: 400
        }
    }
}