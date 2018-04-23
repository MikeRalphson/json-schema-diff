"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const json_schema_diff_1 = require("./json-schema-diff");
const differ_1 = require("./json-schema-diff/differ");
const file_reader_1 = require("./json-schema-diff/file-reader");
const file_system_1 = require("./json-schema-diff/file-reader/file-system");
const reporter_1 = require("./json-schema-diff/reporter");
const wrapped_log_1 = require("./json-schema-diff/reporter/wrapped-log");
class JsonSchemaDiffFactory {
    static create() {
        const fileSystem = new file_system_1.FileSystem();
        const fileReader = new file_reader_1.FileReader(fileSystem);
        const differ = new differ_1.Differ();
        const wrappedLog = new wrapped_log_1.WrappedLog();
        const reporter = new reporter_1.Reporter(wrappedLog);
        return new json_schema_diff_1.JsonSchemaDiff(fileReader, differ, reporter);
    }
}
exports.JsonSchemaDiffFactory = JsonSchemaDiffFactory;
