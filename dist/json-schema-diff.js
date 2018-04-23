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
class JsonSchemaDiff {
    constructor(fileReader, differ, reporter) {
        this.fileReader = fileReader;
        this.differ = differ;
        this.reporter = reporter;
    }
    static isBreakingChange(diffResult) {
        return diffResult.removedByDestinationSpec;
    }
    diff(sourceSchemaFile, destinationSchemaFile) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { sourceSchema, destinationSchema } = yield this.loadSchemas(sourceSchemaFile, destinationSchemaFile);
                const diffResult = yield this.differ.diff(sourceSchema, destinationSchema);
                this.reportDiffResult(diffResult);
                if (JsonSchemaDiff.isBreakingChange(diffResult)) {
                    return Promise.reject(new Error('Breaking changes detected'));
                }
            }
            catch (error) {
                this.reporter.reportError(error);
                return Promise.reject(error);
            }
        });
    }
    reportDiffResult(diffResult) {
        if (JsonSchemaDiff.isBreakingChange(diffResult)) {
            this.reporter.reportFailureWithDifferences(diffResult.differences);
        }
        else if (diffResult.differences.length > 0) {
            this.reporter.reportSuccessWithDifferences(diffResult.differences);
        }
        else {
            this.reporter.reportNoDifferencesFound();
        }
    }
    loadSchemas(sourceSchemaFile, destinationSchemaFile) {
        return __awaiter(this, void 0, void 0, function* () {
            const whenSourceSchema = this.fileReader.read(sourceSchemaFile);
            const whenDestinationSchema = this.fileReader.read(destinationSchemaFile);
            const [sourceSchema, destinationSchema] = yield Promise.all([whenSourceSchema, whenDestinationSchema]);
            return { sourceSchema, destinationSchema };
        });
    }
}
exports.JsonSchemaDiff = JsonSchemaDiff;
