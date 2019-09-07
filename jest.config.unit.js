const jest = require('./jest.config');

//ignore integ test folder when unit testing
jest.testPathIgnorePatterns = [
    "/node_modules/",
    "/test/integ/"
]

module.exports = jest;