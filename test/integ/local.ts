//BORROWED FROM DOCS: https://github.com/awslabs/aws-serverless-express/tree/master/examples/basic-starter
import { handler } from '../../lambda.js';
import { Server } from 'http';

/**
 * Allow us to call a lambda function with a gateway event passed
 * to this function for local integration testing.  I don't feel
 * like pulling out bluebird for one function.
 * 
 * Regardless of what happens, close the express server on the other
 * side, we'll just keep opening more servers to simulate real calls.
 */
export default class GatewayRunner {

    private server?: Server;

    public runEvent(event: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.server = handler(event, {
            succeed: (val: any) => {
                console.log(val);
                resolve(val);
            },
            fail: (err: Error | string) => {
                console.error(err);
                reject(err);
            }
            })
        })
    }

    public close() {
        if (this.server) {
            this.server.close();
        }
    }
}
