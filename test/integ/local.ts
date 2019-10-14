//BORROWED FROM DOCS: https://github.com/awslabs/aws-serverless-express/tree/master/examples/basic-starter
import { handler } from "../../lambda.js";
import { Server } from "http";

/**
 * Allow us to call a lambda function with a gateway event passed
 * to this function for local integration testing.
 */
export default class GatewayRunner {
	private server?: Server;

	public runEvent(event: any): Promise<any> {
		return new Promise((resolve, reject) => {
			this.server = handler(event, {
				succeed: (val: any) => {
					resolve(val);
				},
				fail: (err: Error | string) => {
					console.error(err);
					reject(err);
				}
			});
		});
	}

	public close() {
		return new Promise((resolve, reject) => {
			if (this.server) {
				this.server.close((e: Error | undefined) => {
					if (e) {
						reject(e);
					} else {
						resolve("Successfully shut down server");
					}
				});
			} else {
				resolve();
			}
		});
	}
}
