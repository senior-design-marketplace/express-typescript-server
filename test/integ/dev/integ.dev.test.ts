/**
 * Run integration tests against a local instance of the express server
 */
import runLocalGatewayEvent from './local';

test('Run a sample test', async () => {
    const response: any = await runLocalGatewayEvent({
        httpMethod: 'GET',
        body: '',
        path: '/projects',
        queryStringParameters: {}
    });

    expect(response.statusCode).toBe(200);
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
                cognitoIdentityId: '' //provide credentials
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