import { EventFactory } from "../EventFactory";

import GatewayRunner from "../local";
import creds from '../creds';
import uuid from 'uuid/v4';
import * as tokens from "../tokens.json";

import { Project } from "../../../../external/enforcer/src/types/Project";
import { GenericRequestFactory } from "../GenericRequestFactory";

const runner: GatewayRunner = new GatewayRunner();
const eventFactory: EventFactory = new EventFactory(tokens);
const requestFactory: GenericRequestFactory = new GenericRequestFactory(runner, eventFactory);

const USER_ZERO = creds[0].username;
const USER_ONE = creds[1].username;
const USER_TWO = creds[2].username;

describe('Projects', () => {
    test('can have their majors updated', async () => {
        const project = (await requestFactory.createGenericProject(USER_ZERO)).resourceId;
        const response = await runner.runEvent(
            eventFactory.createEvent("PUT", `/projects/${project}/majors`)
                .withBody([
                    "Computer Science"
                ])
                .withUser(USER_ZERO)
                .build()
        )

        expect(response.statusCode).toBe(200);
    })
    test('can have their tags updated', async () => {
        const project = (await requestFactory.createGenericProject(USER_ZERO)).resourceId;
        const response = await runner.runEvent(
            eventFactory.createEvent("PUT", `/projects/${project}/tags`)
                .withBody([
                    "Programming"
                ])
                .withUser(USER_ZERO)
                .build()
        )

        expect(response.statusCode).toBe(200);
    })
    test('give a 404 if they do not exist', async () => {
        const response = await runner.runEvent(
            eventFactory.createEvent('GET', `/projects/${uuid()}`)
                .build()
        )

        expect(response.statusCode).toBe(404);
    });

    test('can be created', async () => {
        const expected = {
            id: uuid(),
            title: 'Foo? I Hardly Bar!',
            tagline: 'Creating fake data since 2002.'
        }

        const response = await runner.runEvent(
            eventFactory.createEvent('POST', '/projects')
                .withBody(expected)
                .withUser(USER_ZERO)
                .build()
        );

        expect(response.statusCode).toBe(200);

        const body = JSON.parse(response.body) as Project.VerboseView;
        expect(expected.id).toBe(body.id);
        expect(expected.title).toBe(body.title);
        expect(expected.tagline).toBe(body.tagline);

        expect(true).toBe(body.administrators.some(user => {
            return user.id === USER_ZERO
        }))
    });

    test('can be updated', async () => {
        const project = uuid()

        const expected = {
            title: 'Wallabies Will Rise',
            tagline: 'The day of reckoning is approaching, be warned',
            acceptingApplications: false
        }

        await runner.runEvent(
            eventFactory.createEvent('POST', '/projects')
                .withBody({
                    id: project,
                    title: 'Wallabies are Not a Threat',
                    tagline: 'There is no cause for alarm, the situation is under control.',
                    acceptingApplications: true
                })
                .withUser(USER_ZERO)
                .build()
        )

        const response = await runner.runEvent(
            eventFactory.createEvent('PATCH', `/projects/${project}`)
                .withBody(expected)
                .withUser(USER_ZERO)
                .build()
        )

        expect(response.statusCode).toBe(200);

        const body = JSON.parse(response.body) as Project.VerboseView;
        expect(expected.title).toBe(body.title);
        expect(expected.tagline).toBe(body.tagline);
        expect(expected.acceptingApplications).toBe(body.acceptingApplications);
    });

    test('differ depending on who is looking', async () => {
        const project = uuid()

        const expected = {
            id: project,
            title: 'She Said Put My Diamonds',
            tagline: 'In the chest, and nobody gets hurt'
        }

        await runner.runEvent(
            eventFactory.createEvent('POST', '/projects')
                .withBody(expected)
                .withUser(USER_ZERO)
                .build()
        );

        const primary = await runner.runEvent(
            eventFactory.createEvent('GET', `/projects/${project}`)
                .withUser(USER_ZERO)
                .build()
        )

        const secondary = await runner.runEvent(
            eventFactory.createEvent('GET', `/projects/${project}`)
                .withUser(USER_ONE)
                .build()
        )

        expect(JSON.parse(primary.body)).not.toEqual(JSON.parse(secondary.body));
    });

    test('can be deleted by an administrator', async () => {
        const project = uuid()

        const expected = {
            id: project,
            title: 'And then He Turned into a Pickle',
            tagline: 'I swear, funniest thing I have ever seen'
        }

        await runner.runEvent(
            eventFactory.createEvent('POST', '/projects')
                .withBody(expected)
                .withUser(USER_ZERO)
                .build()
        )

        const primary = await runner.runEvent(
            eventFactory.createEvent('DELETE', `/projects/${project}`)
                .withUser(USER_ONE)
                .build()
        )

        const secondary = await runner.runEvent(
            eventFactory.createEvent('DELETE', `/projects/${project}`)
                .withUser(USER_ZERO)
                .build()
        )

        expect(primary.statusCode).toBe(403);

        expect(secondary.statusCode).toBe(200);

        const response = await runner.runEvent(
            eventFactory.createEvent('GET', `/projects/${project}`)
                .build()
        )

        expect(response.statusCode).toBe(404);
    })
});