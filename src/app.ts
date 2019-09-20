import { Server } from '@overnightjs/core';
import { Application } from 'express';
import { HandleErrors } from './routes/middlewares';
import { AuthenticationError, BadRequestError, InternalError } from './error/error';
import cors from 'cors';
import * as routes from './routes/routes';
import * as config from './aws_config.json';

import AWS from 'aws-sdk';
import HitTracker from './routes/helpers/hitTracker';
AWS.config.update({ region: 'us-east-1' });

class App extends Server {

    static sqs = new AWS.SQS();
    static documentClient = new AWS.DynamoDB.DocumentClient();
    static hitTracker = new HitTracker(App.sqs, config.sqs.projects);

    constructor() {
        super();
        this.enableRoutes();

        /**
         * load global middlewares LAST because they include error-handling which must
         * be loaded last -- otherwise a middleware that gets loaded after them which 
         * throws will not be able to pass the error onto the handlers.
         */
        this.enableMiddleware();
    }

    /**
     * The ONLY middlewares that should be registered at the root level are those
     * which are guaranteed to be available on each and every route in the application.
     * Currently, those middlewares are CORS and error-handling.
     */
    private enableMiddleware(): void {
        this.app.use(
            cors(),
            HandleErrors([
                AuthenticationError,
                BadRequestError,
                InternalError
            ])
        )
    }

    //basically a doctor with all these injections
    private enableRoutes(): void {
        const controllers: any[] = []
        controllers.push(new routes.ProjectsController(App.documentClient, App.hitTracker));
        controllers.push(new routes.CommentsController(App.documentClient));

        super.addControllers(controllers);
    }

    //expose application to Claudia
    public getApp(): Application {
        return this.app;
    }
}

//FIX: https://github.com/claudiajs/claudia/issues/163
module.exports = new App().getApp();