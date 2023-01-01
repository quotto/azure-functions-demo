const axios = require("axios");
const GraphRequester = require("../graph");
module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    context.log(JSON.stringify(req));
    const token = req.headers.Authorization.split(" ")[1];
    const bobResponse = await getGraphApiTokkenWithUserPermission(token);
    if(bobResponse.status === 200) {
        const result = await GraphRequester.getMe(bobResponse.data.access_token);
        if(result.status === 200) {
            context.res = {
                // status: 200, /* Defaults to 200 */
                body: JSON.stringify({
                    message: JSON.stringify(result.data)
                })
            };
        } else {
            context.log.error("graph api request user profile error");
            context.log.error(`${result.statusText}: ${JSON.stringify(result.data)}`)
            context.res = {
                status: 500,
                body: JSON.stringify({message: "request user profile error"})
            }
        }
    } else {
        context.log.error("get user token error");
        context.log.error(`${clientCredentialsResponse.statusText}: ${JSON.stringify(clientCredentialsResponse.data)}`)
        context.res = {
            status: 500,
            body: JSON.stringify({message: clientCredentialsResponse.data.error, description: clientCredentialsResponse.data.error_description})
        }
    }
}

const getGraphApiTokkenWithUserPermission = async(token)=>{
    const headers = {
        Authorization: `Bearer ${token}`,
        ContentType: "application/json"
    }
    const body = {
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        client_id: process.env.APP_CLIENT_ID,
        client_secret: process.env.APP_CLIENT_SECRET,
        assertion: token,
        scrop: "User.Read",
        requested_token_use: "on_behalf_of"
    }
    return await axios.post(`https://login.microsoftonline.com/${process.env.APP_TENANT_ID}/oauth2/v2.0/token`,{headers: headers, data: body}).then(response=>response)
}
