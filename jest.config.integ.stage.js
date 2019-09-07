const jest = require('./jest.config');

//override to only search for cloud integ tests
jest.testRegex = "stage\\.test\\.ts$";

module.exports = jest;