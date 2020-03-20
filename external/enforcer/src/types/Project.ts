import { ProjectShared } from "../../../../lib/types/shared/ProjectShared";
import { Tag } from "../../../../lib/types/base/Tag";
import { Major } from "../../../../lib/types/base/Major";

export namespace Project {
    
    export type PartialView = 
        Pick<ProjectShared,
            | 'id'
            | 'title'
            | 'tagline'
            | 'body'
            | 'acceptingApplications'
            | 'thumbnailLink'
            | 'coverLink'
            | 'tags'
            | 'requestedMajors'
            | 'contributors'
            | 'administrators'>

    export type VerboseView = PartialView & 
        Pick<ProjectShared, 
            | 'applications'>

    export type FullView = ProjectShared;

    export type QueryParams = {
        // filters
        tag?: Tag
        advisorId?: string
        hasAdvisor?: boolean
        major?: Major
        acceptingApplications?: boolean

        // sorts
        sortBy?: 'new' | 'popular'
        order?: 'reverse'
    }
}
