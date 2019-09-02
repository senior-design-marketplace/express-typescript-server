import { Server } from '@overnightjs/core';
import { Application } from 'express';
import { HandleInternalError, HandleAuthenticationError } from './routes/middlewares';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import cors from 'cors';
import * as routes from './routes/routes';

import AWS from 'aws-sdk';
AWS.config.update({ region: 'us-east-1' });

class App extends Server {

    constructor() {
        super();
        this.enableMiddleware();
        this.enableRoutes();
    }

    /**
     * The ONLY middlewares that should be registered at the root level are those
     * which are guaranteed to be available on each and every route in the application.
     * Currently, those middlewares are CORS and error-handling.
     */
    private enableMiddleware(): void {
        this.app.use(
            cors(),
            HandleInternalError,
            HandleAuthenticationError
        )
    }

    //basically a doctor with all these injections
    private enableRoutes(): void {
        const controllers: any[] = []
        controllers.push(new routes.ProjectsController(new DocumentClient()));
        controllers.push(new routes.ProjectsIdController(new DocumentClient()));
        controllers.push(new routes.CommentsController(new DocumentClient));
        controllers.push(new routes.CommentsIdController(new DocumentClient));

        super.addControllers(controllers);
    }

    //expose application to Claudia
    public getApp(): Application {
        return this.app;
    }
}

//FIX: https://github.com/claudiajs/claudia/issues/163
module.exports = new App().getApp();