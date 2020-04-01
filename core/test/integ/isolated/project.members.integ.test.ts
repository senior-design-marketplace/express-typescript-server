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

describe('Project members', () => {
    test('can be promoted', async () => {
        const project = (await requestFactory.createGenericProject(USER_ZERO)).resourceId;
        const application = (await requestFactory.createGenericApplication(USER_ONE, project)).resourceId;
        
        await requestFactory.acceptApplication(USER_ZERO, project, application);

        const response = await runner.runEvent(
            eventFactory.createEvent("PATCH", `/projects/${project}/members/${USER_ONE}`)
                .withBody({
                    role: "ADMINISTRATOR",
                    isAdvisor: false
                })
                .withUser(USER_ZERO)
                .build()
        )

        expect(response.statusCode).toBe(200);
    });

    test('can be demoted', async () => {
        const project = (await requestFactory.createGenericProject(USER_ZERO)).resourceId;
        const invite = (await requestFactory.createGenericInvite(USER_ZERO, USER_ONE, project, {
            role: "ADMINISTRATOR",
            isAdvisor: false
        })).resourceId;

        await requestFactory.acceptInvite(USER_ONE, project, invite);

        const response = await runner.runEvent(
            eventFactory.createEvent("PATCH", `/projects/${project}/members/${USER_ONE}`)
                .withBody({
                    role: "CONTRIBUTOR",
                    isAdvisor: false
                })
                .withUser(USER_ZERO)
        )

        expect(response.statusCode).toBe(200);
    });

    test('can be deleted', async () => {
        const project = (await requestFactory.createGenericProject(USER_ZERO)).resourceId;
        const application = (await requestFactory.createGenericApplication(USER_ONE, project)).resourceId;
        
        await requestFactory.acceptApplication(USER_ZERO, project, application);

        const response = await runner.runEvent(
            eventFactory.createEvent("DELETE", `/projects/${project}/members/${USER_ONE}`)
                .withUser(USER_ZERO)
        )

        expect(response.statusCode).toBe(200);
    });
});