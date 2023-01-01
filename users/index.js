const axios = require("axios");
const GraphRequester  = require("../graph");
module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const clientCredentialsResponse = await getGraphApiTokenWithClientCertificate(token);
    if(clientCredentialsResponse.status === 200) {
        const result = await GraphRequester.getAllTenantUser(bobResponse.data.access_token);
        if(result.status === 200) {
            context.res = {
                // status: 200, /* Defaults to 200 */
                body: JSON.stringify({
                    message: JSON.stringify(result.data)
                })
            };
        } else {
            context.log.error("graph api request all user profile error");
            context.log.error(`${result.statusText}: ${JSON.stringify(result.data)}`)
            context.res = {
                status: 500,
                body: JSON.stringify({message: "request all user profile error"})
            }
        }
    } else {
        context.log.error("get application token error");
        context.log.error(`${clientCredentialsResponse.statusText}: ${JSON.stringify(clientCredentialsResponse.data)}`)
        context.res = {
            status: 500,
            body: JSON.stringify({message: clientCredentialsResponse.data.error, description: clientCredentialsResponse.data.error_description})
        }
    }
}

const getGraphApiTokenWithClientCertificate = async(token)=>{
    const headers = {
        ContentType: "application/json"
    }
    const body = {
        client_id: process.env.APP_CLIENT_ID,
        scope: "User.Read.All",
        client_secret: process.env.APP_CLIENT_SECRET,
        grant_type: "client_credentials"
    }
    return await axios.post(`https://login.microsoftonline.com/${process.env.APP_TENANT_ID}/oauth2/v2.0/token`,{headers: headers, data: body}).then(response=>response)
}
