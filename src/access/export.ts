import { outputJson } from 'fs-extra';
import { resolve } from 'path';
import * as secrets from '../../knexfile';

//pull the environment information and inject it here as a build step
async function writeSecrets() {
    const env = process.env.NODE_ENV || 'test';
    const config = secrets[env];
    
    try {
        await outputJson(resolve(__dirname, 'env.json'), config, { spaces: '\t' });
        console.log(`Successfully exported environment information for: ${env}`);
    } catch (e) {
        console.error(e);
    }
}

writeSecrets();