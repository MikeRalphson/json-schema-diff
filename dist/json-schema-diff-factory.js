"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const differ_1 = require("./differ");
const file_reader_1 = require("./file-reader");
const file_system_1 = require("./file-reader/file-system");
const json_schema_diff_1 = require("./json-schema-diff");
const reporter_1 = require("./reporter");
const wrapped_log_1 = require("./wrapped-log");
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
