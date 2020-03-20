import { Claims } from "../../../../core/src/auth/verify";
import ApplicationModel from "../models/ApplicationModel";
import ProjectModel from "../models/ProjectModel";
import { describeMembership } from "../queries/util";
import { Actions, Policy } from "../Enforcer";
import { Resources } from "../resources/resources";
import { getResourceMismatchView, getAuthenticationRequiredView } from "./util";

export const ApplicationPolicy: Policy<Resources, Actions> = {

    'project.application': {
        /**
         * Anyone who is not part of the project can apply to it.
         * They must also not have an open application to the project.
         */
        create: async (claims?: Claims, ...resourceIds: string[]) => {
            if (!claims) {
                return getAuthenticationRequiredView();
            }
            
            const projectId = resourceIds[0];

            const project = await ProjectModel.query()
                .findById(projectId)
                .throwIfNotFound();

            if (!project.acceptingApplications) {
                return {
                    view: 'blocked',
                    reason: 'Project is not accepting applications'
                };
            }

            const hasOpenApplication = Boolean(await ApplicationModel.query()
                .where('projectId', projectId)
                .andWhere('userId', claims.username)
                .andWhere('status', 'PENDING')
                .resultSize());

            if (hasOpenApplication) {
                return {
                    view: 'blocked',
                    reason: 'User has an open application for this project'
                };
            }

            const { isContributor, isAdministrator } = await describeMembership(projectId, claims.username);

            if (isContributor || isAdministrator) {
                return {
                    view: 'blocked',
                    reason: 'User is already a member of this project'
                }
            }

            return {
                view: 'verbose'
            };
        },

        /**
         * Only administrators and the author of the application 
         * can view it.
         */
        describe: async (claims?: Claims, ...resourceIds: string[]) => {
            if (!claims) {
                return getAuthenticationRequiredView();
            }

            const projectId = resourceIds[0];
            const applicationId = resourceIds[1];

            const application = await ApplicationModel.query()
                .findById(applicationId)
                .throwIfNotFound();

            if (application.projectId !== projectId) {
                return getResourceMismatchView(projectId, applicationId);
            }

            if (application.userId === claims.username) {
                return {
                    view: 'verbose'
                };
            }

            const { isAdministrator } = await describeMembership(projectId, claims.username);
            if (isAdministrator) {
                return {
                    view: 'verbose'
                }
            }
            
            return {
                view: 'hidden'
            };
        },

        /**
         * Only an administrator can update an application with
         * a response.  The application must not have been responded
         * to already.
         */
        update: async (claims?: Claims, ...resourceIds: string[]) => {
            if (!claims) {
                return getAuthenticationRequiredView();
            }

            const projectId = resourceIds[0];
            const applicationId = resourceIds[1];

            const application = await ApplicationModel.query()
                .findById(applicationId)
                .throwIfNotFound();

            if (application.projectId !== projectId) {
                return getResourceMismatchView(projectId, applicationId);
            }

            if (application.status !== 'PENDING') {
                return {
                    view: 'blocked',
                    reason: 'Application has already been responded to'
                }
            }

            const { isAdministrator } = await describeMembership(projectId, claims.username);
            if (isAdministrator) {
                return {
                    view: 'verbose'
                }
            }

            return {
                view: 'hidden'
            }
        },

        /**
         * Only an administrator of the project to which the
         * application is directed can respond to the application.
         * The application must not have been responded to already.
         */
        //TODO: Implement
        reply: async (claims?: Claims, ...resourceIds: string[]) => {
            return {
                view: 'full'
            }
        },

        /**
         * Only the author of the application can delete it, so
         * long as it has not been responded to yet.
         */
        delete: async (claims?: Claims, ...resourceIds: string[]) => {
            if (!claims) {
                return getAuthenticationRequiredView();
            }

            const projectId = resourceIds[0];
            const applicationId = resourceIds[1];

            const application = await ApplicationModel.query()
                .findById(applicationId)
                .throwIfNotFound();

            if (application.projectId !== projectId) {
                return getResourceMismatchView(projectId, applicationId);
            }

            if (application.status !== 'PENDING') {
                return {
                    view: 'blocked',
                    reason: 'Application has already been responded to'
                }
            }

            if(application.userId === claims.username) {
                return {
                    view: 'verbose',
                }
            }

            return {
                view: 'hidden'
            }
        }
    }
}