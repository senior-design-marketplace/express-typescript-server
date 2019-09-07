const jest = require('./jest.config');

//override to only search for local integ tests
jest.testRegex = "dev\\.test\\.ts$";

module.exports = jest;