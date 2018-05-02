"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander = require("commander");
const json_schema_diff_factory_1 = require("./json-schema-diff-factory");
// tslint:disable:no-var-requires
const packageJson = require('../package.json');
const jsonSchemaDiff = json_schema_diff_factory_1.JsonSchemaDiffFactory.create();
commander
    .version(packageJson.version)
    .arguments('<sourceSchemaFile> <destinationSchemaFile>')
    .description(`TODO: write me`)
    .action((sourceSchemaFile, destinationSchemaFile) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield jsonSchemaDiff.diffFiles(sourceSchemaFile, destinationSchemaFile);
    }
    catch (error) {
        process.exitCode = 1;
    }
}))
    .parse(process.argv);
if (!commander.args.length) {
    commander.help();
}
