import { S3Event, Context } from "aws-lambda";
import { Model } from "objection";

import BoardItemModel from "../../../core/src/access/models/BoardItemModel";
import UserModel from "../../../core/src/access/models/UserModel";
import ProjectModel from "../../../core/src/access/models/ProjectModel";

import * as config from "../env.json";
import Knex from "knex";

const knex = Knex(config);
Model.knex(knex);

function getTokens(link: string, expected: number): string[] {
    const tokens = link.split("/");

    if (tokens.length !== expected) {
        throw `Expected ${expected} tokens but found ${tokens.length} for link ${link}`;
    }

    return tokens;
}

type Handler = (string) => Promise<void>;

const handlers: Record<string, Handler> = {
    'avatar': async (link: string) => {
        const tokens = getTokens(link, 6);

        const userId = tokens[4];

        await UserModel.query()
            .findById(userId)
            .throwIfNotFound()
            .patch({
                thumbnailLink: link
            })
    },

    'cover': async (link: string) => {
        const tokens = getTokens(link, 6);

        const projectId = tokens[4];

        await ProjectModel.query()
            .findById(projectId)
            .throwIfNotFound()
            .patch({
                coverLink: link
            })
    },

    'thumbnail': async (link: string) => {
        const tokens = getTokens(link, 6);

        const projectId = tokens[4];

        await ProjectModel.query()
            .findById(projectId)
            .throwIfNotFound()
            .patch({
                thumbnailLink: link
            })
    },

    'board': async (link: string) => {
        const tokens = getTokens(link, 7);

        const projectId = tokens[4];
        const entryId = tokens[6];

        // the user could rush and switch this to a text
        // entry or delete it quickly, but both are unlikely
        // in the time frame and should not affect the system
        // too much.

        // We are able to do this because the media entry does
        // not contain other state that we cannot predict.  This
        // architecture would likely need to change if it got
        // more complex than this.
        await BoardItemModel.query()
            .findById(entryId)
            .throwIfNotFound()
            .patch({
                document: {
                    type: "MEDIA",
                    mediaLink: link
                },
                updatedAt: knex.fn.now()
            })
    }
}

async function processLink(link: string) {
    const handler: Handler[] = [];

    for (const key of Object.keys(handlers)) {
        if (link.includes(key)) {
            if (handler.length > 0) {
                throw `Duplicate handler detected for link ${link}`;
            }

            handler.push(handlers[key]);
        }
    }

    if (handler.length == 0) {
        throw `No handler detected for link ${link}`
    }

    await handler[0](link);
}

export const handler = async function (event: S3Event, context: Context) {
    for (const record of event.Records) {
        const bucket = record.s3.bucket.name;
        const key = record.s3.object.key;

        const link = `https://${bucket}.s3.amazonaws.com/${key}`;

        await processLink(link)
    }
}