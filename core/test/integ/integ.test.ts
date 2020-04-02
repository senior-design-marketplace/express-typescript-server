import { EventFactory } from "./EventFactory";

import GatewayRunner from "./local";
import creds from './creds';
import uuid from 'uuid/v4';
import * as tokens from "./tokens.json";

import { GenericRequestFactory } from "./GenericRequestFactory";

const runner: GatewayRunner = new GatewayRunner();
const eventFactory: EventFactory = new EventFactory(tokens);
const requestFactory: GenericRequestFactory = new GenericRequestFactory(runner, eventFactory);

const USER_ZERO = creds[0].username;
const USER_ONE = creds[1].username;
const USER_TWO = creds[2].username;

test("Provide a request with bad query params", async () => {
    const response = await runner.runEvent(
        eventFactory.createEvent("GET", "/projects")
            .withQuery({
                sortBy: "foo"
            })
            .build()
    )

	expect(response.statusCode).toBe(200);
});

test("Provide a valid query param", async () => {
	const response = await runner.runEvent(
        eventFactory.createEvent("GET", "/projects")
            .withQuery({
                sortBy: "popular"
            })
            .build()
    )

	expect(response.statusCode).toBe(200);
});

test('Can access media endpoints for self', async () => {
    const response = await runner.runEvent(
        eventFactory.createEvent("POST", `/users/${USER_ZERO}/avatar`)
            .withBody({
                type: "JPEG"
            })
            .withUser(USER_ZERO)
            .build()
    )

    expect(response.statusCode).toBe(200);
});

test('Cannot access media for another user', async () => {
    const response = await runner.runEvent(
        eventFactory.createEvent("POST", `/users/${USER_ONE}/avatar`)
            .withBody({
                type: "JPEG"
            })
            .withUser(USER_ZERO)
            .build()
    )

    expect(response.statusCode).toBe(403);
});

test('Load the root of the application', async () => {
    const project = (await requestFactory.createGenericProject(USER_ZERO)).resourceId;
    const application = (await requestFactory.createGenericApplication(USER_ONE, project)).resourceId;

    const response = await runner.runEvent(
        eventFactory.createEvent("GET", "/")
            .withUser(USER_ZERO)
            .build()
    );

    expect(response.statusCode).toBe(200);
});

test('Invite a user to a project', async () => {
    const project = (await requestFactory.createGenericProject(USER_ZERO)).resourceId;
    const invite = (await requestFactory.createGenericInvite(USER_ZERO, USER_ONE, project, {
        role: "CONTRIBUTOR",
        isAdvisor: false
    })).payload;

    expect(invite.statusCode).toBe(200);
})

test('Create a project with a user not yet in the users table', async () => {
    const response = (await requestFactory.createGenericProject(USER_TWO)).payload;

    expect(response.statusCode).toBe(200);
})

test('Create a board entry on a project', async () => {
    const project = (await requestFactory.createGenericProject(USER_ZERO)).resourceId;
    const response = (await requestFactory.createGenericBoardEntry(USER_ZERO, project, "TEXT")).payload;

    expect(response.statusCode).toBe(200);
})

test('Apply to a project not accepting applications', async () => {
    const project = (await requestFactory.createGenericProject(USER_ZERO, {
        acceptingApplications: false
    })).resourceId;
    const response = (await requestFactory.createGenericApplication(USER_ONE, project)).payload;

    expect(response.statusCode).toBe(403);
})

test('Apply to a project the user is already a member of', async () => {
    const project = (await requestFactory.createGenericProject(USER_ZERO)).resourceId;
    const response = (await requestFactory.createGenericApplication(USER_ZERO, project)).payload;

    expect(response.statusCode).toBe(403);
})

test('Content types for media uploads are respected', async () => {
    const response = await runner.runEvent(
        eventFactory.createEvent("POST", `/users/${USER_ZERO}/avatar`)
            .withBody({
                type: "JPEG"
            })
            .withUser(USER_ZERO)
            .build()
    );

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.body);

    expect(body.fields['Content-Type']).toBe('image/jpeg');
})

test('Provide an invalid path parameter', async () => {
    const response = await runner.runEvent(
        eventFactory.createEvent("GET", "/projects/foo")
            .build()
    )

    expect(response.statusCode).toBe(400);
})

test('Board entries for a project are sorted', async () => {
    const project = (await requestFactory.createGenericProject(USER_ZERO)).resourceId;
    const first = (await requestFactory.createGenericBoardEntry(USER_ZERO, project, "TEXT")).resourceId;
    const second = (await requestFactory.createGenericBoardEntry(USER_ZERO, project, "TEXT")).resourceId;

    const response = await runner.runEvent(
        eventFactory.createEvent("GET", `/projects/${project}`)
            .build()
    );

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.body);

    assertOrder(body.boardItems
        .map(instance => new Date(instance.createdAt).valueOf()), true);
})

test('Can delete a comment on a project', async () => {
    const project = (await requestFactory.createGenericProject(USER_ZERO)).resourceId;
    const comment = (await requestFactory.createGenericComment(USER_ZERO, project)).resourceId;

    const response = await runner.runEvent(
        eventFactory.createEvent("DELETE", `/projects/${project}/comments/${comment}`)
            .withUser(USER_ZERO)
            .build()
    );

    expect(response.statusCode).toBe(200);
})

test('Load the root of the application unauthenticated', async () => {
    const response = await runner.runEvent(
        eventFactory.createEvent("GET", "/")
            .build()
    )

    expect(response.statusCode).toBe(200);
})

test('Get a user who does not exist', async () => {
    const response = await runner.runEvent(
        eventFactory.createEvent("GET", "/users/foo")
            .build()
    )

    expect(response.statusCode).toBe(404);
})

function assertOrder(items: number[], descending?: boolean) {
    for (let i = 0; i < items.length - 1; i++) {
        const current = items[i];
        const next = items[i + 1];

        if (descending) expect(current).toBeGreaterThanOrEqual(next);
        else expect(current).toBeLessThanOrEqual(next);
    }
}