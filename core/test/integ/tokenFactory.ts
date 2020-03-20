import AWS from 'aws-sdk';
import crypto from 'crypto-js';
import secrets from '../../src/auth/secrets';

const cognito = new AWS.CognitoIdentityServiceProvider({
    region: 'us-east-1'
});

export default class TokenFactory {

    tokens: Record<string, string>;

    constructor() {
        this.tokens = {};
    }

    public getToken(username: string) {
        return this.tokens[username];
    }

    public async login(username: string, password: string) {
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

        this.tokens[username] = response.AuthenticationResult.IdToken;
    }
}