import CodedError from "../CodedError";
import HttpStatus from "http-status-codes";

export default class InternalError extends CodedError {
	constructor(message: string) {
		super(message, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
