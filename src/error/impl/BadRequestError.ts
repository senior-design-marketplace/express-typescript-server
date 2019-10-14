import CodedError from "../CodedError";
import HttpStatus from "http-status-codes";

export default class BadRequestError extends CodedError {
	constructor(message: string) {
		super(message, HttpStatus.BAD_REQUEST);
	}
}
