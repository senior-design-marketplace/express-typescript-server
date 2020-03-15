import { Claims } from "../../../../core/src/access/auth/verify";
import ApplicationModel from "../../../../core/src/access/models/ApplicationModel";
import ProjectModel from "../../../../core/src/access/models/ProjectModel";
import { describeMembership } from "../../../../core/src/access/queries/util";
import { Actions, Policy } from "../EnforcerService";
import { Resources } from "../resources/resources";

export const ApplicationPolicy: Policy<Resources, Actions> = {

    'application': {
        /**
         * Anyone who is not part of the project can apply to it.
         * They must also not have an open application to the project.
         */
        create: async (claims: Claims, ...resourceIds: string[]) => {
            const projectId = resourceIds[0];

            const project = await ProjectModel.query()
                .findById(projectId)
                .throwIfNotFound();

            if (!project.acceptingApplications) {
                return false;
            }

            const hasOpenApplication = Boolean(await ApplicationModel.query()
                .where('projectId', projectId)
                .andWhere('userId', claims.username)
                .andWhere('status', 'PENDING')
                .resultSize());

            if (hasOpenApplication) {
                return false;
            }

            const { isContributor, isAdministrator } = await describeMembership(projectId, claims.username);
            return !isContributor && !isAdministrator;
        },

        /**
         * Only administrators and the author of the application 
         * can view it.
         */
        read: async (claims: Claims, ...resourceIds: string[]) => {
            const projectId = resourceIds[0];
            const applicationId = resourceIds[1];

            const application = await ApplicationModel.query()
                .findById(applicationId)
                .throwIfNotFound();

            if (application.projectId !== projectId) {
                return false;
            }

            if (application.userId === claims.username) {
                return true;
            }

            const { isAdministrator } = await describeMembership(projectId, claims.username);
            return isAdministrator;
        },

        /**
         * Only an administrator can update an application with
         * a response.  The application must not have been responded
         * to already.
         */
        update: async (claims: Claims, ...resourceIds: string[]) => {
            const projectId = resourceIds[0];
            const applicationId = resourceIds[1];

            const application = await ApplicationModel.query()
                .findById(applicationId)
                .throwIfNotFound();

            if (application.projectId !== projectId) {
                return false;
            }

            if (application.status !== 'PENDING') {
                return false;
            }

            const { isAdministrator } = await describeMembership(projectId, claims.username);
            return isAdministrator;
        },

        /**
         * Only the author of the application can delete it, so
         * long as it has not been responded to yet.
         */
        delete: async (claims: Claims, ...resourceIds: string[]) => {
            const projectId = resourceIds[0];
            const applicationId = resourceIds[1];

            const application = await ApplicationModel.query()
                .findById(applicationId)
                .throwIfNotFound();

            if (application.projectId !== projectId) {
                return false;
            }

            if (application.status !== 'PENDING') {
                return false;
            }

            return application.userId === claims.username;
        }
    }
}