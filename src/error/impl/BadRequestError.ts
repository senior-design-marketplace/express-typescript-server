export default class BadRequestError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'BadRequestError'
        Object.setPrototypeOf(this, BadRequestError.prototype);
        //FIX: needed to repair prototype chain broken by super() with Error
        //https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
        //https://github.com/Microsoft/TypeScript/issues/13965
    }
}