import * as commander from 'commander';
import {JsonSchemaDiffFactory} from './json-schema-diff-factory';

// tslint:disable:no-var-requires
const packageJson = require('../package.json');

const jsonSchemaDiff = JsonSchemaDiffFactory.create();

commander
    .version(packageJson.version)
    .arguments('<sourceSchemaFile> <destinationSchemaFile>')
    .description(
        `TODO: write me`
    )
    .action(async (sourceSchemaFile, destinationSchemaFile) => {
        try {
            await jsonSchemaDiff.diffFiles(sourceSchemaFile, destinationSchemaFile);
        } catch (error) {
            process.exitCode = 1;
        }
    })
    .parse(process.argv);

if (!commander.args.length) {
    commander.help();
}
