import {Context} from "@azure/functions";
import {AxiosError} from "axios";
export interface ErrorResponse {
    error: boolean,
    message: string
}

export const isErrorResponse = (arg: unknown): arg is ErrorResponse =>{
    return typeof arg === "object" && arg != null &&
        typeof (arg as ErrorResponse).error === "boolean" &&
        typeof (arg as ErrorResponse).message === "string"
}

export const handleAxiosError = async(error: AxiosError): Promise<ErrorResponse> => {
    if (error.response) {
        logger.error("axios response error");
        logger.error(`${error.response.status}: ${typeof (error.response.data) === "object" ? JSON.stringify(error.response.data) : error.response.data}`);
    } else if (error.request) {
        logger.error("axios request error");
        logger.error(`bad request: ${JSON.stringify(error.request)}`);
    }
    logger.error(error.message);
    logger.error(error.stack || "");
    return { error: true, message: error.message };
}

let _context: Context|undefined;
const _log = (level: string, message: string)=>{
    console.log(`[${level}]${message}`);
}
export const logger = {
    error: (message: string)=>{
       if(typeof(_context) != "undefined")  {
        _context.log.error(message);
       } else {
        _log("ERROR", message)
       }
    },
    warn: (message: string)=>{
       if(typeof(_context) != "undefined")  {
        _context.log.warn(message);
       } else {
        _log("WARN", message)
       }
    },
    info: (message: string)=>{
       if(typeof(_context) != "undefined")  {
        _context.log.info(message);
       } else {
        _log("INFO", message)
       }
    },
    debug: (message: string)=>{
       if(typeof(_context) != "undefined")  {
        _context.log(message);
       } else {
        _log("DEBUG", message)
       }
    },
    setContext: (context: Context) => {
        _context = context;
    }
}