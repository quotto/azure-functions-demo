const axios = require("axios");
module.exports = class GraphRequester {
    static GRAPH_ENDPOINT = "https://graph.microsoft.com/v1.0";
    static PATH_SIGNIN_USER = "/me";
    static PATH_ALL_TENANT_USER = "/users"
    static async getMe(context, token) {
        const headers = {
            Authorization: `Bearer ${token}`
        }
        return await axios.get(`${this.GRAPH_ENDPOINT}${this.PATH_SIGNIN_USER}`, {headers: headers}).then(response=>response).catch(error=>{
            if (error.response) {
                context.log.error("graph api get me response error");
                context.log.error(`${error.response.status}: ${typeof (error.response.data) === "object" ? JSON.stringify(error.response.data) : error.response.data}`);
            } else if (error.request) {
                context.log.error("graph api get me request error");
                context.log.error(`Bad request: ${JSON.stringify(error.request)}`);
            }
            context.log.error(error.message);
            context.log.error(error.stack);
            return { error: true, message: error.message };
        })
    }
    static async getAllTenantUser(token) {
        const headers = {
            Authorization: `Bearer ${token}`
        }
        return await axios.get(`${this.GRAPH_ENDPOINT}${this.PATH_ALL_TENANT_USER}`, {headers: headers})
    }
}