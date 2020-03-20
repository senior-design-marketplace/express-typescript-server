import { CustomError } from "ts-custom-error";

// remove Objection-related fields from query responses
export function Strip() {
    return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
        const copy = descriptor.value;

        descriptor.value = async function() {
            const instances = await copy.apply(this, arguments);

            if (Array.isArray(instances)) return instances.map(instance => instance.$toJson());
            return instances.$toJson();
        };
    }
}

export function Suppress(error: typeof CustomError) {
    return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
        const copy = descriptor.value;

        descriptor.value = async function() {
            try {
                return await copy.apply(this, arguments);
            } catch (err) {
                if (!(err instanceof error)) {
                    throw err;
                }
                console.warn(`Suppressed: ${err}`)
            }
        }
    }
}