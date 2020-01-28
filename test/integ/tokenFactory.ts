import AWS from 'aws-sdk';
import crypto from 'crypto-js';
import creds from './creds';
import secrets from '../../src/access/auth/secrets';

const cognito = new AWS.CognitoIdentityServiceProvider({
    region: 'us-east-1'
});

const SECRET_HASH = crypto.HmacSHA256(
    creds.username + secrets.clientId,
    secrets.clientSecret
).toString(crypto.enc.Base64);

export default class TokenFactory {

    token!: string;

    public getToken() {
        return this.token;
    }

    public async login() {
        const response = await cognito.adminInitiateAuth({
            AuthFlow: "ADMIN_USER_PASSWORD_AUTH",
            ClientId: secrets.clientId,
            UserPoolId: secrets.userPoolId,
            AuthParameters: {
                USERNAME: creds.username,
                PASSWORD: creds.password,
                SECRET_HASH
            }
        }).promise();

        if(!response.AuthenticationResult?.IdToken)
            throw 'Login of test user failed';

        this.token = response.AuthenticationResult.IdToken;
    }
}