import { CustomError } from "ts-custom-error";

/**
 * Creates a series of nested try-catch blocks to eventually catch the result of some function
 */
export function TranslateErrors(errors: typeof CustomError[], klazz: typeof CustomError) {
    return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
        const copy = descriptor.value;

        descriptor.value = async function() {
            try {
                return await copy.apply(this, arguments);
            } catch (e) {
                for (const clazz of errors) {
                    if (e instanceof clazz) {
                        throw new klazz(e.message);
                    }
                }

                throw e;
            }
        }
    }
}