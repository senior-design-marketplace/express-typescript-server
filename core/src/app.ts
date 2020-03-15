// access layer
import { Model } from "objection";
import * as config from "../env.json";
import Knex from "knex";
Model.knex(Knex(config));

// postgres 64 bit ints returned as 32 bit ints instead of strings
import pg from 'pg';
pg.types.setTypeParser(20, parseInt);

import { DescribeProjectQuery } from "./access/queries/DescribeProjectQuery";
import { CreateProjectQuery } from "./access/queries/CreateProjectQuery";
import { DescribeProjectsQuery } from "./access/queries/DescribeProjectsQuery";
import { CreateProjectApplicationQuery } from "./access/queries/CreateProjectApplicationQuery";
import { DescribeProjectMembershipQuery } from "./access/queries/DescribeProjectMembershipQuery";
import { UpdateProjectQuery } from "./access/queries/UpdateProjectQuery";
import { DescribeSupportedMajorsQuery } from "./access/queries/DescribeSupportedMajorsQuery";
import { DescribeSupportedTagsQuery } from "./access/queries/DescribeSupportedTagsQuery";
import { GetUserProjectsQuery } from "./access/queries/GetUserProjectsQuery";
import { ReplyProjectApplicationQuery } from "./access/queries/ReplyProjectApplicationQuery";
import { DeleteProjectQuery } from "./access/queries/DeleteProjectQuery";
import { DescribeUserQuery } from "./access/queries/DescribeUserQuery";
import { UpdateUserQuery } from "./access/queries/UpdateUserQuery";
import { GetProjectAdministratorsQuery } from "./access/queries/GetProjectAdministratorsQuery";
import { GetProjectMembersQuery } from "./access/queries/GetProjectMembersQuery";
import { InviteProjectMemberQuery } from "./access/queries/InviteProjectMemberQuery";
import { InviteReplyQuery } from "./access/queries/InviteReplyQuery";
import { GetUserNotificationsQuery } from "./access/queries/GetUserNotificationsQuery";
import { CreateCommentQuery } from "./access/queries/CreateCommentQuery.js";

// controller layer
import ProjectController from "./controllers/impl/ProjectController";
import ApplicationController from "./controllers/impl/ApplicationController";
import MediaController from "./controllers/impl/MediaController";
import RootController from "./controllers/impl/RootController";
import UserController from "./controllers/impl/UserController";
import InviteController from "./controllers/impl/InviteController";
import ProjectBoardController from "./controllers/impl/ProjectBoardController";
import CommentController from "./controllers/impl/CommentController.js";
import { MediaRequestFactory } from "./controllers/mediaRequestFactory";

// service layer
import ProjectService from "./service/ProjectService";
import ApplicationService from "./service/ApplicationService";
import InviteService from "./service/InviteService";
import RootService from "./service/RootService";
import UserService from "./service/UserService";
import ProjectBoardService from "./service/ProjectBoardService";
import CommentService from "./service/CommentService.js";

// core
import { Server } from "@overnightjs/core";
import { Application } from "express";
import { HandleErrors } from "./controllers/middlewares";
import { AuthenticationError, AuthorizationError, BadRequestError, InternalError, NotFoundError } from "./error/error";

import cors from "cors";
import bodyParser from "body-parser";
import boolParser from 'express-query-boolean';
import cookieParser from "cookie-parser";

import AWS from "aws-sdk";

import { EventEmitter } from "events";
import { EventHandler } from "./eventHandlers";
import { WriteThroughUserQuery } from "./access/queries/WriteThroughUserQuery";
import { CreateBoardEntryQuery } from "./access/queries/CreateBoardEntryQuery";
import { DescribeBoardEntryQuery } from "./access/queries/DescribeBoardEntryQuery";
import { UpdateBoardEntryQuery } from "./access/queries/UpdateBoardEntryQuery";
import { DeleteBoardEntryQuery } from "./access/queries/DeleteBoardEntryQuery";
import { AddContributorQuery } from "./access/queries/AddContributorQuery.js";
import { GetProjectApplicationQuery } from "./access/queries/GetProjectApplicationQuery.js";
import { GetUserApplicationsQuery } from "./access/queries/GetUserApplicationsQuery.js";
import { UpdateNotificationAsReadQuery } from "./access/queries/UpdateNotificationAsReadQuery.js";
import { DeleteCommentQuery } from "./access/queries/DeleteCommentQuery.js";

// enforcement policies
import { EnforcerService, Actions } from "./service/enforcer/EnforcerService.js";
import { UserPolicy } from "./service/enforcer/policies/UserPolicy";
import { ProjectPolicy } from "./service/enforcer/policies/ProjectPolicy";
import { ApplicationPolicy } from "./service/enforcer/policies/ApplicationPolicy";
import { InvitePolicy } from "./service/enforcer/policies/InvitePolicy";
import { BoardEntryPolicy } from "./service/enforcer/policies/BoardEntryPolicy";
import { CommentPolicy } from "./service/enforcer/policies/CommentPolicy";
import { NotificationPolicy } from "./service/enforcer/policies/NotificationPolicy.js";
import { Resources } from "./service/enforcer/resources/resources.js";
import { MediaService } from "./service/MediaService.js";


AWS.config.update({ region: "us-east-1" });

class App extends Server {
    static emitter = new EventEmitter();
    static enforcer = new EnforcerService<Resources, Actions>();

    static projectService = new ProjectService(
        App.emitter,
        App.enforcer,
        new DescribeProjectQuery(),
        new DescribeProjectsQuery(),
        new CreateProjectQuery(),
        new UpdateProjectQuery(),
        new DeleteProjectQuery()
    );

    static applicationService = new ApplicationService(
        App.emitter,
        App.enforcer,
        new DescribeProjectMembershipQuery(),
        new DescribeProjectQuery(),
        new CreateProjectApplicationQuery(),
        new ReplyProjectApplicationQuery(),
        new AddContributorQuery(),
        new GetProjectApplicationQuery()
    )

    static rootService = new RootService(
        App.emitter,
        App.enforcer,
        new DescribeSupportedMajorsQuery(),
        new DescribeSupportedTagsQuery(),
        new GetUserProjectsQuery(),
        new GetUserNotificationsQuery(),
        new GetUserApplicationsQuery()
    )

    static userService = new UserService(
        App.emitter,
        App.enforcer,
        new DescribeUserQuery(),
        new UpdateUserQuery(),
        new UpdateNotificationAsReadQuery()
    )

    static inviteService = new InviteService(
        App.emitter,
        App.enforcer,
        new InviteProjectMemberQuery(),
        new InviteReplyQuery()
    )

    static boardService = new ProjectBoardService(
        App.emitter,
        App.enforcer,
        new CreateBoardEntryQuery(),
        new DescribeBoardEntryQuery(),
        new UpdateBoardEntryQuery(),
        new DeleteBoardEntryQuery()
    )

    static commentService = new CommentService(
        App.emitter,
        App.enforcer,
        new CreateCommentQuery(),
        new DeleteCommentQuery()
    )

    static requestFactory = new MediaRequestFactory(new AWS.S3());

    static mediaService = new MediaService(
        App.emitter,
        App.enforcer,
        App.requestFactory 
    )

    static eventHandler = new EventHandler(
        App.emitter,
        new GetProjectAdministratorsQuery(),
        new GetProjectMembersQuery(),
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
        this.app.set('writeThroughUserQuery', new WriteThroughUserQuery());
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
		controllers.push(new ProjectController(App.projectService));
        controllers.push(new MediaController(App.mediaService));
        controllers.push(new RootController(App.rootService));
        controllers.push(new UserController(App.userService));
        controllers.push(new InviteController(App.inviteService));
        controllers.push(new ApplicationController(App.applicationService));
        controllers.push(new ProjectBoardController(App.boardService));
        controllers.push(new CommentController(App.commentService));

		super.addControllers(controllers);
	}

	//expose application to Claudia
	public getApp(): Application {
		return this.app;
	}
}

//FIX: https://github.com/claudiajs/claudia/issues/163
module.exports = new App().getApp();
