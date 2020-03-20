import CodedError from "../CodedError";
import HttpStatus from "http-status-codes";

export default class NotFoundError extends CodedError {
	constructor(message: string = 'Resource not found') {
		super(message, HttpStatus.NOT_FOUND);
	}
}
