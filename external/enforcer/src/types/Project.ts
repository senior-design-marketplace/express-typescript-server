import { Tag } from "../../../../lib/types/base/Tag";
import { Major } from "../../../../lib/types/base/Major";
import { ProjectModel } from "../models/ProjectModel";

export namespace Project {
    
    export type PartialView = 
        Pick<ProjectModel,
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
        Pick<ProjectModel, 
            | 'applications'>

    export type FullView = ProjectModel;

    export type QueryParams = {
        // filters
        tag?: Tag
        advisorId?: string
        hasAdvisor?: boolean
        major?: Major
        acceptingApplications?: boolean
        title?: string

        // sorts
        sortBy?: 'new' | 'popular'
        order?: 'reverse'
        page?: number
        perPage?: number
    }
}
