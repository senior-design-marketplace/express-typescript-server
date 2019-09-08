import CodedError from '../CodedError';
import HttpStatus from 'http-status-codes';

export default class AuthenticationError extends CodedError {

    constructor(message: string) {
        super(message, HttpStatus.FORBIDDEN);
    }
}