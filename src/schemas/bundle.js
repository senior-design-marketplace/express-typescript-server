const $RefParser = require('json-schema-ref-parser');
const jsonSchemaToTypescript = require('json-schema-to-typescript');
const fse = require('fs-extra');
const path = require('path');
const AJV = require('ajv');
const pack = require('ajv-pack');
const mergeAllOf = require('json-schema-merge-allof');
const ajv = new AJV({ sourceCode: true });

//leave this as a .js file so we can run the build into the local file and compile the typescript after
const inputDirectory = path.join(__dirname, 'impl');
const outputDirectory = path.join(__dirname, 'build');

const JAVASCRIPT_FILE_EXTENSION = '.js';
const TYPESCRIPT_TYPE_FILE_EXTENSION = '.d.ts';

async function bundle() {
    const files = await fse.readdir(inputDirectory);
    const fileWriting = []

    for (let file of files) {
        const fileNameWithoutExtension = path.join(outputDirectory, path.parse(file).name);

        try {
            const bundledSchema = await $RefParser.bundle(path.join(inputDirectory, file));
            const mergedSchema = mergeAllOf(bundledSchema, { ignoreAdditionalProperties: true });
            const validator = pack(ajv, ajv.compile(mergedSchema));
            fileWriting.push(fse.outputFile(fileNameWithoutExtension + JAVASCRIPT_FILE_EXTENSION, validator));
            
            //compile typescript types
            const typeBindings = await jsonSchemaToTypescript.compile(bundledSchema);

            fileWriting.push(fse.outputFile(fileNameWithoutExtension + TYPESCRIPT_TYPE_FILE_EXTENSION, typeBindings));
        } catch (e) {
            console.error(`Error thrown in ${file}: ${e}`)
            return;
        }
    }

    await Promise.all(fileWriting);
    console.log(`Successfully bundled schemas into ${outputDirectory}`)
}

bundle();