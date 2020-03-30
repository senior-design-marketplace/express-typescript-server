//BORROWED FROM DOCS: https://github.com/awslabs/aws-serverless-express/tree/master/examples/basic-starter
import { handler } from "../../../lambda.js";
import { Server } from "http";

/**
 * The Gateway Runner is a local copy of the gateway.  It can
 * be configured to to point to the staging DB or a local
 * instance.  Keep in mind that running a Postgres instance
 * will leave open handles and prevent Jest from exiting.
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
