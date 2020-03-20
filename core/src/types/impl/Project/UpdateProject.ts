import { ProjectShared } from "../../../../../lib/types/shared/ProjectShared";

export type UpdateProject =
    | Partial<Pick<ProjectShared,
        | 'title'
        | 'tagline'
        | 'body'
        | 'acceptingApplications'>>
