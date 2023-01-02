exports.handleAxiosError = async(context,error) => {
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