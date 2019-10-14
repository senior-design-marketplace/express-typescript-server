import CodedError from "../CodedError";
import HttpStatus from "http-status-codes";

export default class AthorizationError extends CodedError {
	constructor(message: string) {
		super(message, HttpStatus.UNAUTHORIZED);
	}
}
