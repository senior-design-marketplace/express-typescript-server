import { EventFactory } from "../EventFactory";

import GatewayRunner from "../local";
import TokenFactory from '../tokenFactory';
import creds from '../creds';
import uuid from 'uuid/v4';

import { CommentShared } from "../../../../lib/types/shared/CommentShared";
import { GenericRequestFactory } from "../GenericRequestFactory";

const runner: GatewayRunner = new GatewayRunner();
const tokenFactory: TokenFactory = new TokenFactory();
const eventFactory: EventFactory = new EventFactory(tokenFactory);
const requestFactory: GenericRequestFactory = new GenericRequestFactory(runner, eventFactory);

const USER_ZERO = creds[0].username;
const USER_ONE = creds[1].username;
const USER_TWO = creds[2].username;

beforeAll(async () => {
    for (const login of creds) {
        await tokenFactory.login(login.username, login.password);
    }
});

afterAll(async () => {
    await runner.close();
});

describe('Comments', () => {
    test('can be created', async () => {
        const expected = {
            id: uuid(),
            body: "Look at me!"
        };

        const project = (await requestFactory.createGenericProject(USER_ZERO)).resourceId;

        const response = await runner.runEvent(
            eventFactory.createEvent('POST', `/projects/${project}/comments`)
                .withBody(expected)
                .withUser(USER_ONE)
                .build()
        );

        expect(response.statusCode).toBe(200);

        const body = JSON.parse(response.body) as CommentShared;
        expect(body.id).toBe(expected.id);
        expect(body.body).toBe(expected.body);
        expect(body.userId).toBe(USER_ONE);
        expect(body.projectId).toBe(project);
    });

    test('can be replied to', async () => {
        const project = (await requestFactory.createGenericProject(USER_ZERO)).resourceId;
        const parent = (await requestFactory.createGenericComment(
            USER_ONE,
            project
        )).resourceId;

        const response = (await requestFactory.createGenericComment(
            USER_ZERO,
            project,
            parent
        )).payload;

        expect(response.statusCode).toBe(200);
        
        const body = JSON.parse(response.body);
        expect(body.parentId).toBe(parent);
    });
})