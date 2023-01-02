import {Context} from "@azure/functions";
import {AxiosError} from "axios";
export interface ErrorResponse {
    error: boolean,
    message: string
}
export const isErrorResponse = (response: any): response is ErrorResponse => {
    return response != null && typeof(response) === "object" && typeof(response.error) != "undefined";
}
export const handleAxiosError = async(context: Context,error: AxiosError): Promise<ErrorResponse> => {
    if (error.response) {
        context.log.error("axios response error");
        context.log.error(`${error.response.status}: ${typeof (error.response.data) === "object" ? JSON.stringify(error.response.data) : error.response.data}`);
    } else if (error.request) {
        context.log.error("axios request error");
        context.log.error(`bad request: ${JSON.stringify(error.request)}`);
    }
    context.log.error(error.message);
    context.log.error(error.stack);
    return { error: true, message: error.message };
}