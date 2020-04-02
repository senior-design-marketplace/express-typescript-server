import creds from '../creds';
import { EventFactory } from "../EventFactory";
import { GenericRequestFactory } from "../GenericRequestFactory";
import GatewayRunner from "../local";
import * as tokens from "../tokens.json";


const runner: GatewayRunner = new GatewayRunner();
const eventFactory: EventFactory = new EventFactory(tokens);
const requestFactory: GenericRequestFactory = new GenericRequestFactory(runner, eventFactory);

const USER_ZERO = creds[0].username;
const USER_ONE = creds[1].username;
const USER_TWO = creds[2].username;

describe('Stars', () => {
    test('can be created', async () => {
        const project = (await requestFactory.createGenericProject(USER_ZERO)).resourceId;
        const response = (await requestFactory.starProject(USER_ZERO, project)).payload;

        expect(response.statusCode).toBe(200);
    })

    test('can be deleted', async () => {
        const project = (await requestFactory.createGenericProject(USER_ZERO)).resourceId;
        
        await requestFactory.starProject(USER_ZERO, project);
        const response = (await requestFactory.unstarProject(USER_ZERO, project)).payload;

        expect(response.statusCode).toBe(200);
    })
})

