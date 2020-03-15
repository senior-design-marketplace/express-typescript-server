enum UserResourcesEnum {
    'user',
    'user.avatar'
}

enum ProjectResourcesEnum {
    'project',
    'project.thumbnail',
    'project.cover'    
}

enum ApplicationResoucesEnum {
    'application',
    'application.status'
}

enum InviteResourcesEnum {
    'invite',
    'invite.status'
}

enum CommentResourcesEnum {
    'comment'
}

enum EntryResourcesEnum {
    'entry'
}

enum NotificationResourcesEnum {
    'notification'
}

export type Resources = 
    keyof typeof UserResourcesEnum 
    | keyof typeof ProjectResourcesEnum
    | keyof typeof ApplicationResoucesEnum
    | keyof typeof InviteResourcesEnum
    | keyof typeof CommentResourcesEnum
    | keyof typeof EntryResourcesEnum
    | keyof typeof NotificationResourcesEnum