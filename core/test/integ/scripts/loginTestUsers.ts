import credentials from "../creds";
import fse from "fs-extra";
import path from "path";
import AWS from "aws-sdk";
import crypto from "crypto-js";
import secrets from "../../../src/auth/secrets";

const cognito = new AWS.CognitoIdentityServiceProvider({
    region: 'us-east-1'
});

async function login(username: string, password: string) {
    const SECRET_HASH = crypto.HmacSHA256(
        username + secrets.clientId,
        secrets.clientSecret
    ).toString(crypto.enc.Base64);

    const response = await cognito.adminInitiateAuth({
        AuthFlow: "ADMIN_USER_PASSWORD_AUTH",
        ClientId: secrets.clientId,
        UserPoolId: secrets.userPoolId,
        AuthParameters: {
            USERNAME: username,
            PASSWORD: password,
            SECRET_HASH
        }
    }).promise();

    if(!response.AuthenticationResult?.IdToken)
        throw 'Login of test user failed';

    return response.AuthenticationResult.IdToken;
}

async function main() {
    const tokens = {};
    for (const credential of credentials) {
        tokens[credential.username] = await login(
            credential.username, 
            credential.password
        );
    }

    fse.writeJsonSync(path.resolve(__dirname, "..", "tokens.json"), tokens, {
        spaces: "\t"
    });
    console.log("Successfully logged in test users");
}

main();
