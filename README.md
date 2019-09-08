# Marqetplace
Welcome to the Marqetplace, a web technology to assist in finding, organizing, and conducting team projects.

## Tooling
If you're helping to contribute to the Marqetplace, you should know about some scaffolding that has been written to help you be as productive as possible.  Some useful commands and pointers are listed below:

### Middleware Support
Middlewares can be used for anything needed directly before or after hitting a route.  This can include things like error handling and request validation.

#### Error Handling
Bad things can happen when handling a route.  You might find yourself writing something like this:
```typescript
@Get()
public foo(req: Request, res: Response) {
    try {
        await bar.makeRiskyCall();
        res.sendStatus(200);
    } catch(e) {
        res.sendStatus(500);
    }
}
```
This gets even worse if you're planning on sending more than just a simple `500`.  Instead, why not leave it to the middleware to handle the error?  Try something like this:

```typescript
@Get()
public foo(req: Request, res: Response) {
    try {
        await bar.makeRiskyCall();
        res.sendStatus(200);
    } catch(e) {
        throw new InternalError("Panic!");
    }
}
```
But where is the middleware?  The application is structured to register all error-handling middleware at the root level, meaning that every route will have these error handlers available -- all you need to do is throw an error when you need it.  Of course, not every error will do -- please check `src/errors/impl` for all of the supported errors.

#### Request Validation
When you're developing controllers, some of them will have an incoming payload that you will want to validate against some schema.  We store these as [json-schema](https://json-schema.org/) documents.

Many of these documents are interrelated, meaning that one document will depend on another.  This allows schemas to be broken up into their own files for better separation and promotes reuse of code.

Prior to deployment, these schemas are bundled to replace these remote references with local (in-file) ones.  We then compile these schemas into an `ajv` validator function and pack them away into their own `.js` modules.

A `Validate` middleware then picks these modules up and allows controllers to call them by simply passing in a string of the schema that the request will match.  

```typescript
@Get()
@Middleware(Validate('myschema')) //assume myschema.json exists
public foo(req: Request, res: Response) {
    //...
}
```


If it does not match, the middleware automatically throws a `BadRequestError`.

### Staged Tests
Recall that there are three forms of tests used in the Marqetplace:

1. A unit test
2. An integration test running against a local copy of an `aws-serverless-express` lambda function.
3. An integration test running against a deployed version of our API.

If you are developing some new unit tests, you likely don't want to wait for the integration tests to pass each time and vice versa.  Instead of simply running all tests with a simple `npm run test`, you can use the below to only fire a specific section of the tests.

|   Command                 |   Description                     |
| ------------------------- | --------------------------------- |
|   `npm run init`          |   run unit tests                  |
|   `npm run integ-dev`     |   run local integration tests     |
|   `npm run integ-stage`   |   run cloud integration tests     |
|   `npm run test`          |   run all tests                   |
