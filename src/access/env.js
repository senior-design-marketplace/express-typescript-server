//pull the environment information and inject it here as a build step
const secrets = require('../../knexfile');
const fse = require('fs-extra');
const join = require('path').join;

async function writeSecrets() {
    //default to local test environment if none specified
    const env = process.env.NODE_ENV || 'test';
    const config = secrets[env];
    try {
        await fse.writeJson(join(__dirname, './env.json'), config, { spaces: '\t' });
        console.log('Successfully exported environment information');
    } catch (e) {
        console.error(e);
    }
}

writeSecrets();