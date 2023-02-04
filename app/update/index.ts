import { Context, HttpRequest } from "@azure/functions";
import { logger } from "../utils";
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