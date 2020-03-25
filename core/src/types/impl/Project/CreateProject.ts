import { ProjectShared } from "../../../../../lib/types/shared/ProjectShared";

export type CreateProject =
    | Pick<ProjectShared,
        | 'id'
        | 'title'
        | 'tagline'>
    & Partial<Pick<ProjectShared,
        | 'acceptingApplications'
        | 'body'>>