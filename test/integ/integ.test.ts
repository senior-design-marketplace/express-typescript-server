/**
 * Run integration tests against a local instance of the express server
 */
import GatewayRunner from './local';

const runner: GatewayRunner = new GatewayRunner();

afterAll(() => {
    runner.close();
})

//FIXME:  Any seed scripts which are relied on for this
//must be called from this module.  Must be self-contained
//for Travis CI testing
test('Run a sample test', async () => {
    const response: any = await runner.runEvent({
        httpMethod: 'GET',
        body: '',
        path: '/projects',
        queryStringParameters: {
            advisor_id: '32697a46-8d7b-4b43-8fef-4ea38cd2ec71',
            tag: 'Computer Science'
        }
    });

    console.log(response);
    expect(response.statusCode).toBe(200);
})

test('Provide a request with bad query params', async () => {
    const response: any = await runner.runEvent({
        httpMethod: 'GET',
        body: '',
        path: '/projects',
        queryStringParameters: {
            sort_by: 'foo' //not a valid sort parameter
        }
    })

    console.log(response);
    expect(response.statusCode).toBe(400);
})

test('Provide a bad reqest', async () => {
    const response: any = await runner.runEvent({
        httpMethod: 'POST',
        body: '', //invalid body
        path: '/projects',
        queryStringParameters: {}
    })

    console.log(response);
    expect(response.statusCode).toBe(400);
})

test('Get a specific project', async () => {
    const response: any = await runner.runEvent({
        httpMethod: 'GET',
        body: '',
        path: '/projects/32697a46-8d7b-4b43-8fef-4ea38cd2ec71',
        queryStringParameters: {},
        requestContext: {}
    })

    console.log(response);
    expect(response.statusCode).toBe(200);
})