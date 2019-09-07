//BORROWED FROM DOCS: https://github.com/awslabs/aws-serverless-express/tree/master/examples/basic-starter
import { handler } from '../../../lambda.js';
import { Server } from 'http';

/**
 * Allow us to call a lambda function with a gateway event passed
 * to this function for local integration testing.  I don't feel
 * like pulling out bluebird for one function.
 * 
 * Regardless of what happens, close the express server on the other
 * side, we'll just keep opening more servers to simulate real calls.
 */
const runLocalGatewayEvent: any = (event: any) => {
    return new Promise((resolve, reject) => {
        const server: Server = handler(event, {
            succeed: (val: any) => {
                resolve(val);
                server.close();
            },
            fail: (err: Error | string) => {
                reject(err);
            }
        })
    })
}

export default runLocalGatewayEvent