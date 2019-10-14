import { join, parse } from "path";
import { compile } from "json-schema-to-typescript";
import { readdir, outputFile } from "fs-extra";
import AJV from "ajv";
import pack from "ajv-pack";
import $RefParser from "json-schema-ref-parser";
import mergeAllOf from "json-schema-merge-allof";

const ajv = new AJV({ sourceCode: true });

const inputDirectory = join(__dirname, "impl");
const outputDirectory = join(__dirname, "build");

const extensions = {
	js: ".js",
	ts: ".d.ts"
};

async function bundle() {
	const files = await readdir(inputDirectory);
	const fileWriting: Promise<void>[] = [];

	for (let file of files) {
		const fileNameWithoutExtension = join(outputDirectory, parse(file).name);

		try {
			// validator functions
			const bundledSchema = await $RefParser.bundle(join(inputDirectory, file));
			const mergedSchema = mergeAllOf(bundledSchema, {
				ignoreAdditionalProperties: true
			});
			const validator = pack(ajv, ajv.compile(mergedSchema));
			fileWriting.push(
				outputFile(fileNameWithoutExtension + extensions.js, validator)
			);

			// typescript bindings
			const typeBindings = await compile(
				bundledSchema as any,
				fileNameWithoutExtension
			);
			fileWriting.push(
				outputFile(fileNameWithoutExtension + extensions.ts, typeBindings)
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
