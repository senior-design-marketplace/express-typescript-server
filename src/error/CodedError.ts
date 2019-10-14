import { CustomError } from "ts-custom-error";

export default abstract class CodedError extends CustomError {
	constructor(message: string, public readonly code: number) {
		super(message);
		this.code = code;
	}
}
