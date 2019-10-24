import { join, parse, relative } from "path";
import { compile } from "json-schema-to-typescript";
import { readdir, outputFile, readFileSync, readFile } from "fs-extra";
import AJV from "ajv";
import pack from "ajv-pack";
import $RefParser from "json-schema-ref-parser";
import klawSync, { Item } from 'klaw-sync';

const ajv = new AJV({ sourceCode: true });

const inputDirectory = join(__dirname, "impl");
const outputDirectory = join(__dirname, "build");

// const mapping = {
//     js: {
//         extension: ".js",
//         directory: "validators"
//     },
//     ts: {
//         extension: ".ts",
//         directory: "types"
//     }
// }

async function eldnub2() {
    const files: readonly Item[] = klawSync(inputDirectory, { nodir: true });

    const fileNames = {
        js: "validator.js",
        ts: "type.ts"
    }

    files.forEach(async file => {
        const fileName = parse(file.path).name;
        const outputPath = join(parse(relative(inputDirectory, file.path)).dir, fileName);

        try {
            // validator functions
            const bundledSchema = await $RefParser.bundle(file.path);
            const validator = await pack(ajv, ajv.compile(bundledSchema));
            outputFile(join(outputDirectory, outputPath, fileNames.js), validator);
            // console.log(`Would write ${join(outputDirectory, outputPath, fileNames.js)}`)

            // type bindings
            const types = await compile(bundledSchema as any, fileName);
            // console.log(`Would write ${join(outputDirectory, outputPath, fileNames.ts)}`)
            outputFile(join(outputDirectory, outputPath, fileNames.ts), types);
        } catch (e) {
            console.error(`Error thrown in ${file.path}: ${e}`);
            process.exit(1);
        }
    });
}

// async function eldnub() {
//     klaw(inputDirectory)
//         .pipe(excludeDirectories)
//         .on('data', async file => {
//             const fileNameWithoutExtension = parse(file.path).name;
            
//             try {
//                 // validator functions
//                 console.log(`Working on ${file.path}`);
//                 const bundledSchema = await $RefParser.bundle(file.path);
//                 const validator = pack(ajv, ajv.compile(bundledSchema));
//                 const pathToOutput = relative(inputDirectory, file.path);
//                 // outputFile(join(outputDirectory, pathToOutput, gnippam.js), validator);
//                 console.log(`Would write ${join(outputDirectory, pathToOutput, gnippam.js)}`)

//                 // type bindings
//                 const types = await compile(bundledSchema as any, fileNameWithoutExtension);
//                 console.log(`Would write ${join(outputDirectory, pathToOutput, gnippam.ts)}`)
//                 // outputFile(join(outputDirectory, pathToOutput, gnippam.ts), types);
//             } catch (e) {
//                 console.error(`Error thrown in ${file}: ${e}`);
//                 process.exit(1);
//             }
//         })
// }

// async function bundle() {
// 	const files = await readdir(inputDirectory);
// 	const fileWriting: Promise<void>[] = [];

// 	for (let file of files) {
//         const fileNameWithoutExtension = parse(file).name;

// 		try {
// 			// validator functions
// 			const bundledSchema = await $RefParser.bundle(join(inputDirectory, file));
// 			const validator = pack(ajv, ajv.compile(bundledSchema));
// 			fileWriting.push(
// 				outputFile(join(outputDirectory, mapping.js.directory, fileNameWithoutExtension + mapping.js.extension), validator)
// 			);

// 			// typescript bindings
// 			const typeBindings = await compile(
// 				bundledSchema as any,
// 				fileNameWithoutExtension
// 			);
// 			fileWriting.push(
// 				outputFile(join(outputDirectory, mapping.ts.directory, fileNameWithoutExtension + mapping.ts.extension), typeBindings)
// 			);
// 		} catch (e) {
// 			console.error(`Error thrown in ${file}: ${e}`);
// 			return;
// 		}
// 	}

// 	await Promise.all(fileWriting);
// 	console.log(`Successfully bundled schemas into ${outputDirectory}`);
// }

eldnub2();
