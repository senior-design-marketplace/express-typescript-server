import { join, parse } from "path";
import { compile } from "json-schema-to-typescript";
import { readdir, outputFile } from "fs-extra";
import AJV from "ajv";
import pack from "ajv-pack";
import $RefParser from "json-schema-ref-parser";

const ajv = new AJV({ sourceCode: true });

const inputDirectory = join(__dirname, "impl");
const outputDirectory = join(__dirname, "build");

const mapping = {
    js: {
        extension: ".js",
        directory: "validators"
    },
    ts: {
        extension: ".ts",
        directory: "types"
    }
}

async function bundle() {
	const files = await readdir(inputDirectory);
	const fileWriting: Promise<void>[] = [];

	for (let file of files) {
        const fileNameWithoutExtension = parse(file).name;

		try {
			// validator functions
			const bundledSchema = await $RefParser.bundle(join(inputDirectory, file));
			const validator = pack(ajv, ajv.compile(bundledSchema));
			fileWriting.push(
				outputFile(join(outputDirectory, mapping.js.directory, fileNameWithoutExtension + mapping.js.extension), validator)
			);

			// typescript bindings
			const typeBindings = await compile(
				bundledSchema as any,
				fileNameWithoutExtension
			);
			fileWriting.push(
				outputFile(join(outputDirectory, mapping.ts.directory, fileNameWithoutExtension + mapping.ts.extension), typeBindings)
			);
		} catch (e) {
			console.error(`Error thrown in ${file}: ${e}`);
			return;
		}
	}

	await Promise.all(fileWriting);
	console.log(`Successfully bundled schemas into ${outputDirectory}`);
}

bundle();
