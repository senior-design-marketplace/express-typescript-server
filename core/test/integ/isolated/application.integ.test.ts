import { EventFactory } from "../EventFactory";

import GatewayRunner from "../local";
import TokenFactory from '../tokenFactory';
import creds from '../creds';
import uuid from 'uuid/v4';

import { Application } from "../../../../external/enforcer/src/types/Application";
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

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

describe('Applications', () => {
    describe('can be replied to', () => {
        test('if they have not been replied to previously', async () => {
            const project = (await requestFactory.createGenericProject(
                USER_ZERO, 
                {
                    acceptingApplications: true
                }
            )).resourceId; 

            const application = (await requestFactory.createGenericApplication(
                USER_ONE, 
                project
            )).resourceId; 

            const response = await runner.runEvent(
                eventFactory.createEvent('PATCH', `/projects/${project}/applications/${application}`)
                    .withBody({
                        response: "ACCEPTED"
                    })
                    .withUser(USER_ZERO)
                    .build()
            );

            expect(response.statusCode).toBe(200);

            const other = await runner.runEvent(
                eventFactory.createEvent('GET', `/projects/${project}`)
                    .withUser(USER_ZERO)
                    .build()
            )
        })
    })

    describe('cannot be created', () => {
        test('if the user has an open application', async () => {
            const project = (await requestFactory.createGenericProject(
                USER_ZERO, 
                {
                    acceptingApplications: true
                }
            )).resourceId;

            await requestFactory.createGenericApplication(USER_ONE, project);
            const response = (await requestFactory.createGenericApplication(
                USER_ONE, 
                project
            )).payload;
            
            expect(response.statusCode).toBe(403);
        })

        test('if the project does not exist', async () => {
            const project = uuid();

            const response = (await requestFactory.createGenericApplication(
                USER_ONE, 
                project
            )).payload;
            expect(response.statusCode).toBe(404);
        })

        test('if the user is a member of the project', async () => {
            const project = (await requestFactory.createGenericProject(USER_ZERO)).resourceId;
            const response = (await requestFactory.createGenericApplication(
                USER_ZERO,
                project
            )).payload

            expect(response.statusCode).toBe(403);
        })

        test('if the project is not accepting applications', async () => {
            const project = (await requestFactory.createGenericProject(
                USER_ZERO,
                {
                    acceptingApplications: false
                }
            )).resourceId

            const response = (await requestFactory.createGenericApplication(USER_ONE, project)).payload;
            expect(response.statusCode).toBe(403);
        })
    });

    describe('cannot be deleted', () => {
        test('if they have been responded to', async () => {
            const project = (await requestFactory.createGenericProject(USER_ZERO)).resourceId;
            const application = (await requestFactory.createGenericApplication(USER_ONE, project)).resourceId

            await runner.runEvent(
                eventFactory.createEvent('PATCH', `/projects/${project}/applications/${application}`)
                    .withBody({
                        response: 'ACCEPTED'
                    })
                    .withUser(USER_ZERO)
                    .build()
            )

            const response = await runner.runEvent(
                eventFactory.createEvent('DELETE', `/projects/${project}/applications/${application}`)
                    .withUser(USER_ONE)
                    .build()
            )

            expect(response.statusCode).toBe(403);
        })
    });

    test('can be created', async () => {
        const expected = {
            id: uuid(),
            note: "Please let me in"
        }

        const project = (await requestFactory.createGenericProject(
            USER_ZERO,
            {
                acceptingApplications: true
            }
        )).resourceId;

        const response = (await requestFactory.createGenericApplication(
            USER_ONE,
            project,
            expected
        )).payload

        expect(response.statusCode).toBe(200);

        const body = JSON.parse(response.body) as Application.VerboseView;
        expect(body.id).toBe(expected.id)
        expect(body.projectId).toBe(project)
        expect(body.userId).toBe(USER_ONE)
        expect(body.status).toBe("PENDING")
        expect(body.note).toBe(expected.note);
    })
});