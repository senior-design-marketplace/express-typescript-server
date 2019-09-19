const $RefParser = require('json-schema-ref-parser');
const fse = require('fs-extra');
const path = require('path');
const AJV = require('ajv');

//leave this as a .js file so we can run the build into the local file and compile the typescript after
const inputDirectory = path.join(__dirname, 'impl');
const outputDirectory = path.join(__dirname, 'build');

fse.readdir(inputDirectory, (err, files) => {
    const promises = [];

    const ajv = new AJV({ sourceCode: true });
    const pack = require('ajv-pack');

    for (let file of files) {
        $RefParser.bundle(path.join(inputDirectory, file))
            .then(bundle => {
                promises.push(fse.outputFile(path.join(outputDirectory, path.parse(file).name + '.js'), pack(ajv, ajv.compile(bundle))));
            })
            .catch(err => {
                throw err;
            })
    }

    Promise.all(promises)
        .then(() => {
            console.info(`Successfully bundled schemas into ${outputDirectory}`);
        })
        .catch(err => {
            throw err;
        })
})