/**
 * Run integration tests against a local instance of the express server
 */
import runLocalGatewayEvent from './local';

test('Run a sample test', async () => {
    const response: any = await runLocalGatewayEvent({
        httpMethod: 'GET',
        body: '',
        path: '/projects',
        queryStringParameters: {
            test: null,
            foo: 'bar'
        }
    });

    expect(response.statusCode).toBe(200);
})

test('Provide a request with bad query params', async () => {
    const response: any = await runLocalGatewayEvent({
        httpMethod: 'GET',
        body: '',
        path: '/projects',
        queryStringParameters: {
            sort_by: 'foo' //not a valid sort parameter
        }
    })

    expect(response.statusCode).toBe(400);
})

test('Provide a bad reqest', async () => {
    const response: any = await runLocalGatewayEvent({
        httpMethod: 'POST',
        body: '', //invalid body
        path: '/projects',
        queryStringParameters: {},
        requestContext: {
            stage: 'dev',
            identity: {
                cognitoIdentityId: 'test' //provide credentials
            }
        }
    })

    expect(response.statusCode).toBe(400);
})

test('Attempt to access an authenticated route without credentials', async () => {
    const response: any = await runLocalGatewayEvent({
        httpMethod: 'POST',
        body: '',
        path: '/projects',
        queryStringParameters: {},
        requestContext: {} //no cognito id provided
    })

    expect(response.statusCode).toBe(403);
})

test('Get a specific project', async () => {
    const response: any = await runLocalGatewayEvent({
        httpMethod: 'GET',
        body: '',
        path: '/projects/sample_id',
        queryStringParameters: {},
        requestContext: {}
    })

    console.log(response);
    expect(response.statusCode).toBe(200);
})