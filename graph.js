import axios from "axios";
export class GraphRequester {
    static GRAPH_ENDPOINT = "https://graph.microsoft.com/v1.0";
    static PATH_SIGNIN_USER = "/me";
    static PATH_ALL_TENANT_USER = "/users"
    static async getMe(token) {
        const headers = {
            Authorization: `Bearer ${token}`
        }
        return await axios.get(`${this.GRAPH_ENDPOINT}${this.PATH_SIGNIN_USER}`, {headers: headers})
    }
    static async getAllTenantUser(token) {
        const headers = {
            Authorization: `Bearer ${token}`
        }
        return await axios.get(`${this.GRAPH_ENDPOINT}${this.PATH_ALL_TENANT_USER}`, {headers: headers})
    }
}