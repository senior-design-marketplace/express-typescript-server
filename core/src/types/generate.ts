import { join, parse, relative } from 'path';
import { outputFileSync, outputJsonSync } from 'fs-extra';
import klawSync from 'klaw-sync';
import * as TJS from 'typescript-json-schema';
import AJV from "ajv";
import pack from "ajv-pack";

const ajv = new AJV({ sourceCode: true });
const inputDirectory = join(__dirname, "impl");
const outputDirectory = join(__dirname, "build");

const files = klawSync(inputDirectory, { nodir: true });

const fileNames = {
    validator: "validator.js",
    schema: "schema.json"
}

// create required array on non-optional fields
// prevent extra properties from being provided
const settings: TJS.PartialArgs = {
    required: true,
    noExtraProps: true
};

// this assumes that type names are unique over the project,
// which may not hold as the project continues to grow
const pairs = {};
files.forEach(file => {
    const fileName = parse(file.path).name;
    const outputPath = join(parse(relative(inputDirectory, file.path)).dir, fileName);
    const program = TJS.getProgramFromFiles([file.path]);
    const schema = TJS.generateSchema(program, fileName, settings);

    if (!schema) {
        throw `Could not generate schema for ${fileName}`; 
    }

    // json schemas
    outputJsonSync(join(outputDirectory, outputPath, fileNames.schema), schema, { spaces: '\t' });

    // validator functions for schemas
    const validator = pack(ajv, ajv.compile(schema));
    pairs[fileName] = validator;

    outputFileSync(join(outputDirectory, outputPath, fileNames.validator), validator);
});

outputJsonSync(join(outputDirectory, 'validators.json'), pairs, { spaces: '\t' });