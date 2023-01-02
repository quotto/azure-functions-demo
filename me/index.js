const axios = require("axios");
const GraphRequester = require("../graph");
const querystring = require('querystring');
module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    context.log(JSON.stringify(req));
    const token = req.headers.authorization.split(" ")[1];
    const bobResponse = await getGraphApiTokkenWithUserPermission(context,token);
    if(!bobResponse.error && bobResponse.status === 200) {
        const result = await GraphRequester.getMe(context,bobResponse.data.access_token);
        if(!result.erro && result.status === 200) {
            context.res = {
                // status: 200, /* Defaults to 200 */
                body:  JSON.stringify(result.data)
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
            body: JSON.stringify({message: bobResponse.message})
        }
    }
}

const getGraphApiTokkenWithUserPermission = async(context,token)=>{
    const headers = {
        Authorization: `Bearer ${token}`,
        ContentType: "application/json"
    }
    const body = {
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        client_id: process.env.APP_CLIENT_ID,
        client_secret: process.env.APP_CLIENT_SECRET,
        assertion: token,
        scrop: "https://graph.microsoft.com/User.Read",
        requested_token_use: "on_behalf_of"
    }
    return await axios.post(`https://login.microsoftonline.com/${process.env.APP_TENANT_ID}/oauth2/v2.0/token`,{headers: headers, data: querystring.stringify(body)}).then(response=>response).catch(error=>{
        if(error.response) {
            context.log.error("get graph api token with user permission response error");
            ;
            context.log.error(`${error.response.status}: ${typeof(error.response.data) === "object" ? JSON.stringify(error.response.data) : error.response.data}`);
        } else if (error.request) {
            context.log.error("get graph api token with user permission request error");
            context.log.error(`Bad request: ${JSON.stringify(error.request)}`);
        }
        context.log.error(error.message);
        context.log.error(error.stack);
        return {error: true, message: error.message};
    })
}
