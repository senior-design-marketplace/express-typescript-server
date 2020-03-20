import CodedError from "../CodedError";
import HttpStatus from "http-status-codes";

export default class AuthenticationError extends CodedError {
	constructor(message: string = 'Authentication required') {
		super(message, HttpStatus.UNAUTHORIZED);
	}
}
