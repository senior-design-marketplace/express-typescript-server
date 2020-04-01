export type MediaResources = 
    | "project.thumbnail" 
    | "project.cover"
    | "project.entry.media"
    | "user.avatar"
    | "user.resume";

export type Resources =
    | 'user'
    | 'user.notification'
    | 'user.star'
    
    | 'project'
    | 'project.majors'
    | 'project.tags'
    | 'project.member'
    | 'project.contributor'
    | 'project.administrator'
    | 'project.application'
    | 'project.invite'
    | 'project.comment'
    | 'project.entry'
    | MediaResources;