import { keys } from "ts-transformer-keys";
import ApplicationImmutableValidator from '../schemas/build/Application/ApplicationImmutable/validator';
import InviteImmutableValidator from "../schemas/build/Invite/InviteImmutable/validator";
import ProjectImmutableValidator from '../schemas/build/Project/ProjectImmutable/validator';
import ProjectMutableValidator from '../schemas/build/Project/ProjectMutable/validator';
import BoardEntryImmutableValidator from '../schemas/build/ProjectBoard/BoardEntryImmutable/validator';
import BoardEntryMutableValidator from '../schemas/build/ProjectBoard/BoardEntryMutable/validator';
import QueryParamsValidator from '../schemas/build/QueryParams/QueryParams/validator';
import ResponseValidator from '../schemas/build/Response/Response/validator';
import UserMutableValidator from '../schemas/build/User/UserMutable/validator';
import CommentImmutableValidator from '../schemas/build/Comment/CommentImmutable/validator';
import ImageMediaImmutableValidator from '../schemas/build/Media/ImageMediaImmutable/validator';
import BoardMediaImmutableValidator from '../schemas/build/Media/BoardMediaImmutable/validator';
import { ApplicationImmutable } from "../schemas/types/Application/ApplicationImmutable";
import { InviteImmutable } from "../schemas/types/Invite/InviteImmutable";
import { ProjectImmutable } from "../schemas/types/Project/ProjectImmutable";
import { ProjectMutable } from "../schemas/types/Project/ProjectMutable";
import { BoardEntryImmutable } from "../schemas/types/ProjectBoard/BoardEntryImmutable";
import { BoardEntryMutable } from "../schemas/types/ProjectBoard/BoardEntryMutable";
import { QueryParams } from "../schemas/types/QueryParams/QueryParams";
import { Response } from "../schemas/types/Response/Response";
import { UserMutable } from "../schemas/types/User/UserMutable";
import { CommentImmutable } from "../schemas/types/Comment/CommentImmutable";
import { ImageMediaImmutable } from "../schemas/types/Media/ImageMediaImmutable";
import { BoardMediaImmutable } from "../schemas/types/Media/BoardMediaImmutable";


type Key = string | number;

interface Extractor {
    validator: (param: any) => boolean,
    extract: Key[]
}

export const extractors: Record<string, Extractor> = {
    'ProjectMutable': {
        validator: ProjectMutableValidator,
        extract: keys<ProjectMutable>()
    },
    'ProjectImmutable': {
        validator: ProjectImmutableValidator,
        extract: keys<ProjectImmutable>()
    },
    'QueryParams': {
        validator: QueryParamsValidator,
        extract: keys<QueryParams>()
    },
    'ApplicationImmutable': {
        validator: ApplicationImmutableValidator,
        extract: keys<ApplicationImmutable>()
    },
    'BoardEntryMutable': {
        validator: BoardEntryMutableValidator,
        extract: keys<BoardEntryMutable>()
    },
    'BoardEntryImmutable': {
        validator: BoardEntryImmutableValidator,
        extract: keys<BoardEntryImmutable>()
    },
    'Response': {
        validator: ResponseValidator,
        extract: keys<Response>()
    },
    'InviteImmutable': {
        validator: InviteImmutableValidator,
        extract: keys<InviteImmutable>()
    },
    'UserMutable': {
        validator: UserMutableValidator,
        extract: keys<UserMutable>()
    },
    'CommentImmutable': {
        validator: CommentImmutableValidator,
        extract: keys<CommentImmutable>()
    },
    'ImageMediaImmutable': {
        validator: ImageMediaImmutableValidator,
        extract: keys<ImageMediaImmutable>()
    },
    'BoardMediaImmutable': {
        validator: BoardMediaImmutableValidator,
        extract: keys<BoardMediaImmutable>()
    }
}