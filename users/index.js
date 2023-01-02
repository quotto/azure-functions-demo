const axios = require("axios");
const querystring = require("querystring");
const GraphRequester  = require("../graph");
const { handleAxiosError } = require("../utils");
module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const clientCredentialsResponse = await getGraphApiTokenWithClientCertificate(context);
    if(!clientCredentialsResponse.error && clientCredentialsResponse.status === 200) {
        const graph_requester = new GraphRequester(context);
        const result = graph_requester.getAllTenantUsers(clientCredentialsResponse.data.access_token);
        if(!result.error && result.status === 200) {
            context.res = {
                // status: 200, /* Defaults to 200 */
                body: JSON.stringify({data: result.data, used_token: clientCredentialsResponse.data.access_token})
            };
        } else {
            context.res = {
                status: 500,
                body: JSON.stringify({message: result.message})
            }
        }
    } else {
        context.res = {
            status: 500,
            body: JSON.stringify({message: clientCredentialsResponse.message})
        }
    }
}

const getGraphApiTokenWithClientCertificate = async(context)=>{
    const headers = {
        ContentType: "application/json"
    }
    const body = {
        client_id: process.env.APP_CLIENT_ID,
        scope: "User.Read.All",
        client_secret: process.env.APP_CLIENT_SECRET,
        grant_type: "client_credentials"
    }
    return await axios.post(`https://login.microsoftonline.com/${process.env.APP_TENANT_ID}/oauth2/v2.0/token`, querystring.stringify(body),{headers: headers}).then(response=>response).catch(error=>{
       context.log.error("get client credentials token error");
        return handleAxiosError(context,error);
    })
}
