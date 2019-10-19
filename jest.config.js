module.exports = {
    preset: "ts-jest",

    //use the extended ttypescript compiler for testing
    globals: {
        "ts-jest": {
            compiler: "ttypescript"
        }
    }
};
