import { UserShared } from "../../../../lib/types/shared/UserShared";
import { ProjectModel } from "../models/ProjectModel";
import { MemberModel } from "../models/MemberModel";
import { Membership } from "../../../../lib/types/base/Membership";

const BASE_URL = 'https://marqetplace-staging-photos.s3.amazonaws.com/defaults/'
const NUM_DEFAULTS = 500;
const DEFAULT_EXTENSION = '.jpeg';

/**
 * Generate a link to a random default media entry.
 */
export function getDefaultMediaLink() {
    return `${BASE_URL}${Math.floor(Math.random() * NUM_DEFAULTS)}${DEFAULT_EXTENSION}`;
}

export async function describeMembership(projectId: string, userId: string): Promise<Membership | null> {
    const membership = await MemberModel.query()
        .findById([ projectId, userId ]);

    if (!membership) return null;

    // map into Membership for easier comparison against incoming objects
    if (membership.contributorId) {
        return {
            role: "CONTRIBUTOR",
            isAdvisor: membership.isAdvisor
        }
    }

    return {
        role: "ADMINISTRATOR",
        isAdvisor: membership.isAdvisor
    }
}

export async function getProjectAdministrators(projectId: string): Promise<UserShared[]> {
    return ProjectModel.relatedQuery("administrators")
        .for(projectId);
}
