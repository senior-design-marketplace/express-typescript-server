import { CustomError } from "ts-custom-error";

export class NotAcceptingApplicationsError extends CustomError {

    constructor(message: string) {
        super(message);
    }
}