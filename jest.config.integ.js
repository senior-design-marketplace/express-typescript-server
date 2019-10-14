const jest = require("./jest.config");

//override to only search for local integ tests
jest.testRegex = "integ\\.test\\.ts$";

module.exports = jest;
