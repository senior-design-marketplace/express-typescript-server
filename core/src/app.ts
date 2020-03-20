// access layer
import { Model } from "objection";
import * as config from "../env.json";
import Knex from "knex";
Model.knex(Knex(config));

// postgres 64 bit ints returned as 32 bit ints instead of strings
import pg from 'pg';
pg.types.setTypeParser(20, parseInt);

// controller layer
import ProjectController from "./controllers/impl/ProjectController";
import ApplicationController from "./controllers/impl/ApplicationController";
import MediaController from "./controllers/impl/MediaController";
import RootController from "./controllers/impl/RootController";
import UserController from "./controllers/impl/UserController";
import InviteController from "./controllers/impl/InviteController";
import ProjectBoardController from "./controllers/impl/ProjectBoardController";
import CommentController from "./controllers/impl/CommentController";
import { MediaRequestFactory } from "../../external/enforcer/src/MediaRequestFactory";

// core
import { Server } from "@overnightjs/core";
import { Application } from "express";
import { HandleErrors } from "./controllers/middlewares";
import { AuthenticationError, AuthorizationError, BadRequestError, InternalError, NotFoundError } from "./error/error";

import cors from "cors";
import bodyParser from "body-parser";
import boolParser from 'express-query-boolean';
import cookieParser from "cookie-parser";

import { EventEmitter } from "events";
import { EventHandler } from "./EventHandler";

// enforcement policies
import { Enforcer, Actions } from "../../external/enforcer/src/Enforcer";
import { UserPolicy } from "../../external/enforcer/src/policies/UserPolicy";
import { ProjectPolicy } from "../../external/enforcer/src/policies/ProjectPolicy";
import { ApplicationPolicy } from "../../external/enforcer/src/policies/ApplicationPolicy";
import { InvitePolicy } from "../../external/enforcer/src/policies/InvitePolicy";
import { BoardEntryPolicy } from "../../external/enforcer/src/policies/BoardEntryPolicy";
import { CommentPolicy } from "../../external/enforcer/src/policies/CommentPolicy";
import { NotificationPolicy } from "../../external/enforcer/src/policies/NotificationPolicy";
import { Resources } from "../../external/enforcer/src/resources/resources";
import { EnforcerService } from "../../external/enforcer/src/EnforcerService.js";

import AWS from "aws-sdk";
AWS.config.update({ region: "us-east-1" });

class App extends Server {
    static emitter = new EventEmitter();
    static enforcer = new Enforcer<Resources, Actions>();    
    static requestFactory = new MediaRequestFactory(new AWS.S3());
    static enforcerService = new EnforcerService(App.enforcer, App.requestFactory);

    static eventHandler = new EventHandler(
        App.emitter,
        App.enforcerService,
    );

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

        /**
         * Load the enforcer with policies for each known resource.
         */
        this.enableEnforcementPolicies();

        /**
         * Also allow authentication middlware to write through
         * user changes to the database.
         */
        this.app.set('enforcerService', App.enforcerService);
    }
    
    private enablePreRouteMiddleware(): void {
        this.app.use(
            cors(),
            cookieParser(),
            bodyParser.json(),
            boolParser()
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

    private enableEnforcementPolicies(): void {
        App.enforcer.addPolicies([
            UserPolicy,
            ProjectPolicy,
            ApplicationPolicy,
            InvitePolicy,
            BoardEntryPolicy,
            CommentPolicy,
            NotificationPolicy
        ]);
    }
    
	//basically a doctor with all these injections
	private enableRoutes(): void {
		const controllers: any[] = [];
		controllers.push(new ProjectController(App.enforcerService));
        controllers.push(new MediaController(App.enforcerService));
        controllers.push(new RootController(App.enforcerService));
        controllers.push(new UserController(App.enforcerService));
        controllers.push(new InviteController(App.enforcerService));
        controllers.push(new ApplicationController(App.enforcerService));
        controllers.push(new ProjectBoardController(App.enforcerService));
        controllers.push(new CommentController(App.enforcerService));

		super.addControllers(controllers);
	}

	//expose application to Claudia
	public getApp(): Application {
		return this.app;
	}
}

//FIX: https://github.com/claudiajs/claudia/issues/163
module.exports = new App().getApp();
