import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import { AuthenticationError } from '../error/error';
import * as jwk from './keys.json';
import secrets from './secrets';

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

const iss = `https://cognito-idp.us-east-1.amazonaws.com/${secrets.userPoolId}`

export const extractClaims = (token: string): Claims => {
    const sections = token.split('.');
    if (sections.length < 2) {
        throw new AuthenticationError('Token is invalid');
    }

    const header = JSON.parse(Buffer.from(sections[0], 'base64').toString('utf8'));
    const matchedKeys = jwk.keys.filter((key) => {
        return key.kid === header.kid;
    });

    if (matchedKeys.length < 1) {
        throw new AuthenticationError('Unknown key');
    }

    const claim = jwt.verify(token, jwkToPem(matchedKeys[0] as jwkToPem.RSA)) as ClaimVerificationValues;
    const currentSeconds = Math.floor(new Date().valueOf() / 1000);

    if (currentSeconds > claim.exp || currentSeconds < claim.auth_time) {
        throw new AuthenticationError('Claim is expired or invalid');
    }

    if (claim.iss !== iss) {
        throw new AuthenticationError('Issuer mismatch')
    }

    if (claim.token_use !== 'id') {
        throw new AuthenticationError('Claim use is not id');
    }

    return {
        username: claim['cognito:username'],
        givenName: claim.given_name,
        familyName: claim.family_name,
        email: claim.email,
        roles: claim['custom:roles']
    }
}