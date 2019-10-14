import { outputJson } from "fs-extra";
import { resolve } from "path";
import Config from "../../knexfile";

//pull the environment information and inject it here as a build step
async function writeSecrets() {
	const env = process.env.NODE_ENV || "test";
	const config = Config[env];

	//only inject the necessary fields
	const { client, connection, pool } = config;
	const extracted = { client, connection, pool };

	try {
		await outputJson(resolve(__dirname, "env.json"), extracted, {
			spaces: "\t"
		});
		console.log(`Successfully exported environment information for: ${env}`);
	} catch (e) {
		console.error(e);
	}
}

writeSecrets();
