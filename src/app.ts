//access layer
import { Access } from "./access/dao";
import Knex from "knex";
import * as config from "./access/env.json";

//service layer
import { Server } from "@overnightjs/core";
import { Application } from "express";
import { HandleErrors } from "./routes/middlewares";
import { AuthenticationError, AuthorizationError, BadRequestError, InternalError, NotFoundError } from "./error/error";

import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import * as routes from "./routes/routes";

import AWS from "aws-sdk";
AWS.config.update({ region: "us-east-1" });

class App extends Server {
	static repository = new Access.Repository(Knex(config));

	constructor() {
        super();

        /**
         * enable parsing and other middlewares before routes so that
         * they are available on the routes.
         */
        this.enablePreRouteMiddleware();
		this.enableRoutes();

		/**
		 * load error handling middleware last, otherwise a middleware
         * that gets loaded after them which throws will not be able
         * to pass the error onto the handlers.
		 */
		this.enableErrorHandlingMiddleware();
    }
    
    private enablePreRouteMiddleware(): void {
        this.app.use(
            cors(),
            cookieParser(),
            bodyParser.json()
        );
    }

	private enableErrorHandlingMiddleware(): void {
		this.app.use(
			HandleErrors([
                AuthenticationError,
                AuthorizationError,
				BadRequestError,
				NotFoundError,
				InternalError
			])
		);
	}

	//basically a doctor with all these injections
	private enableRoutes(): void {
		const controllers: any[] = [];
		controllers.push(new routes.ProjectsController(App.repository));
		controllers.push(new routes.CommentsController(App.repository));

		super.addControllers(controllers);
	}

	//expose application to Claudia
	public getApp(): Application {
		return this.app;
	}
}

//FIX: https://github.com/claudiajs/claudia/issues/163
module.exports = new App().getApp();
