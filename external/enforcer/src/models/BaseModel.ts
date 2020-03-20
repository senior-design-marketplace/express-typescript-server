import { Model } from "objection";
import { NotFoundError, InternalError } from "../../../../core/src/error/error";

export class BaseModel extends Model {

    static createNotFoundError = () => {
        return new NotFoundError();
    }

    static createValidationError = ({type, message, data}) => {
        return new InternalError(`Schema validation failed with message: "${message}"`);
    }
}