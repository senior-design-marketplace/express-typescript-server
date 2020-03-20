import CodedError from "../CodedError";
import HttpStatus from "http-status-codes";

export default class AuthorizationError extends CodedError {
	constructor(message: string = 'User does not have appropriate credentials') {
		super(message, HttpStatus.FORBIDDEN);
	}
}
