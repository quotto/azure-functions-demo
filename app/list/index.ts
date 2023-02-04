import { Context, HttpRequest } from "@azure/functions";
import { logger } from "../utils";
export default async function (context: Context, req: HttpRequest) {
    logger.setContext(context);
    console.log(JSON.stringify(context.bindings.inDocument))

    // Success.
    context.res = {
        status: 200,
        body: JSON.stringify({items: context.bindings.inDocument})
    };
}