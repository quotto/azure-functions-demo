const axios = require("axios");
const utils = require("./utils");
module.exports = class GraphRequester {
    static GRAPH_ENDPOINT = "https://graph.microsoft.com/v1.0";
    static PATH_SIGNIN_USER = "/me";
    static PATH_ALL_TENANT_USER = "/users";
    context = {};
    constructor(_context) {
        this.context = _context;
    }
    async getMe(token) {
        const headers = {
            Authorization: `Bearer ${token}`
        }
        return await axios.get(`${GraphRequester.GRAPH_ENDPOINT}${GraphRequester.PATH_SIGNIN_USER}`, {headers: headers}).then(response=>response).catch(error=>{
            this.context.log.error("get user profile error");
            return utils.handleAxiosError(this.context,error);
        })
    }
    async getAllTenantUsers(token) {
        const headers = {
            Authorization: `Bearer ${token}`
        }
        return await axios.get(`${GraphRequester.GRAPH_ENDPOINT}${GraphRequester.PATH_ALL_TENANT_USER}`, {headers: headers}).then(response=>response).catch(error=>{
            this.context.log.error("get all tenant users error");
            return utils.handleAxiosError(this.context,error);
        })
    }
}