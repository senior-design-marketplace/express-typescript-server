import { CustomError } from "ts-custom-error";

export class AlreadyMemberError extends CustomError {

    constructor(message: string) {
        super(message);
    }
}