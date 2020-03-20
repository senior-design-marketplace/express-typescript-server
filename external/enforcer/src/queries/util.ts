import { AdministratorModel } from "../models/AdministratorModel";
import { ContributorModel } from "../models/ContributorModel";
import { UserShared } from "../../../../lib/types/shared/UserShared";
import { ProjectModel } from "../models/ProjectModel";

const BASE_URL = 'https://marqetplace-staging-photos.s3.amazonaws.com/defaults/'
const NUM_DEFAULTS = 100;
const DEFAULT_EXTENSION = '.jpeg';

/**
 * Generate a link to a random default media entry.
 */
export function getDefaultMediaLink() {
    return `${BASE_URL}${Math.floor(Math.random() * NUM_DEFAULTS)}${DEFAULT_EXTENSION}`;
}

export async function describeMembership(projectId: string, userId: string) {
    const [ administratorInfo, contributorInfo ] = await Promise.all([
        AdministratorModel.query()
            .findById([ projectId, userId ]),
        ContributorModel.query()
            .findById([ projectId, userId ])  
    ])

    return {
        isContributor: Boolean(contributorInfo),
        isAdministrator: Boolean(administratorInfo),
        isAdvisor: Boolean(administratorInfo?.isAdvisor)
    }
}

export async function getProjectAdministrators(projectId: string): Promise<UserShared[]> {
    return ProjectModel.relatedQuery("administrators").for(projectId);
}

export async function getProjectMembers(projectId: string): Promise<UserShared[]> {
    const [ contributors, administrators ] = await Promise.all([
        getProjectAdministrators(projectId),
        ProjectModel.relatedQuery("contributors").for(projectId)
    ]);

    return [ ...contributors, ...administrators ];
}