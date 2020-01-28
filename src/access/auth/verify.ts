import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import secrets from './secrets';
import * as jwk from './keys.json';

export interface Claims {
    username: string,
    givenName: string,
    familyName: string,
    email: string,
    roles: Array<string>
}

interface GuaranteedClaims {
    token_use: string;
    auth_time: number;
    iss: string;
    exp: number;
    username: string;
    client_id: string;
}

interface ExpectedClaims {
    given_name: string;
    family_name: string;
    email: string;
    roles: Array<string>
}

type ClaimVerificationValues = GuaranteedClaims & ExpectedClaims;

interface ClaimVerificationResult {
    claims: Claims,
    error?: string
}

const iss = `https://cognito-idp.us-east-1.amazonaws.com/${secrets.userPoolId}`

export const verify = (token: string): ClaimVerificationResult => {
    try {
        const sections = token.split('.');
        if (sections.length < 2) {
            throw new Error('token is invalid');
        }

        const header = JSON.parse(Buffer.from(sections[0], 'base64').toString('utf8'));
        const matchedKeys = jwk.keys.filter((key) => {
            return key.kid === header.kid;
        });

        if (matchedKeys.length < 1) {
            throw new Error('unknown key');
        }

        const claim = jwt.verify(token, jwkToPem(matchedKeys[0] as jwkToPem.RSA)) as ClaimVerificationValues;
        const currentSeconds = Math.floor(new Date().valueOf() / 1000);

        if (currentSeconds > claim.exp || currentSeconds < claim.auth_time) {
            throw new Error('claim is expired or invalid');
        }

        if (claim.iss !== iss) {
            throw new Error('issuer mismatch')
        }

        if (claim.token_use !== 'id') {
            throw new Error('claim use is not id');
        }

        return {
            claims: {
                username: claim['cognito:username'],
                givenName: claim.given_name,
                familyName: claim.family_name,
                email: claim.email,
                roles: claim['custom:roles']
            }
        }
    } catch (error) {
        return {
            claims: {
                username: '',
                givenName: '',
                familyName: '',
                email: '',
                roles: [],
            },
            error
        }
    }
}