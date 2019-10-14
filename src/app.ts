//access layer
import { Access } from "./access/dao";
import Knex from "knex";
import * as config from "./access/env.json";

//service layer
import { Server } from "@overnightjs/core";
import { Application } from "express";
import { HandleErrors } from "./routes/middlewares";
import {
	AuthenticationError,
	BadRequestError,
	InternalError,
	NotFoundError
} from "./error/error";

import cors from "cors";
import cookieParser from "cookie-parser";
import * as routes from "./routes/routes";

import AWS from "aws-sdk";
AWS.config.update({ region: "us-east-1" });

class App extends Server {
	static repository = new Access.Repository(Knex(config));

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
	 * Currently, those middlewares are CORS, cookie parsing, and error-handling.
	 */
	private enableMiddleware(): void {
		this.app.use(
			cors(),
			cookieParser(),
			HandleErrors([
				AuthenticationError,
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
