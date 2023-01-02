const axios = require("axios");
const utils = require("./utils");
module.exports = class GraphRequester {
    GRAPH_ENDPOINT = "https://graph.microsoft.com/v1.0";
    PATH_SIGNIN_USER = "/me";
    PATH_ALL_TENANT_USER = "/users";
    context = {};
    constructor(_context) {
        this.context = _context;
    }
    async getMe(token) {
        const headers = {
            Authorization: `Bearer ${token}`
        }
        return await axios.get(`${this.GRAPH_ENDPOINT}${this.PATH_SIGNIN_USER}`, {headers: headers}).then(response=>response).catch(error=>{
            context.log.error("get user profile error");
            return utils.handleAxiosError(context,error);
        })
    }
    async getAllTenantUsers(token) {
        const headers = {
            Authorization: `Bearer ${token}`
        }
        return await axios.get(`${this.GRAPH_ENDPOINT}${this.PATH_ALL_TENANT_USER}`, {headers: headers}).then(response=>response).catch(error=>{
            context.log.error("get all tenant users error");
            return utils.handleAxiosError(context,error);
        })
    }
}