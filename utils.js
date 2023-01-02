exports.handleAxiosError = async(context,error) => {
    if (error.response) {
        context.log.error("axios response error");
        context.log.error(`${error.response.status}: ${typeof (error.response.data) === "object" ? json.stringify(error.response.data) : error.response.data}`);
    } else if (error.request) {
        context.log.error("axios request error");
        context.log.error(`bad request: ${json.stringify(error.request)}`);
    }
    context.log.error(error.message);
    context.log.error(error.stack);
    return { error: true, message: error.message };
}