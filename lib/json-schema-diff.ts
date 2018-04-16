import {Differ, DiffResult} from './differ';
import {FileReader} from './file-reader';
import {JsonSchema} from './json-schema';
import {Reporter} from './reporter';

interface Schemas {
    sourceSchema: JsonSchema;
    destinationSchema: JsonSchema;
}

export class JsonSchemaDiff {
    private static isBreakingChange(diffResult: DiffResult): boolean {
        return diffResult.removedByDestinationSpec;
    }

    public constructor(
        private readonly fileReader: FileReader,
        private readonly differ: Differ,
        private readonly reporter: Reporter) {}

    public async diff(sourceSchemaFile: string, destinationSchemaFile: string): Promise<any> {
        try {
            const {sourceSchema, destinationSchema} = await this.loadSchemas(sourceSchemaFile, destinationSchemaFile);
            const diffResult = await this.differ.diff(sourceSchema, destinationSchema);
            this.reportDiffResult(diffResult);

            if (JsonSchemaDiff.isBreakingChange(diffResult)) {
                return Promise.reject(new Error('Breaking changes detected'));
            }

            return Promise.resolve();
        } catch (error) {
            this.reporter.reportError(error);
            return Promise.reject(error);
        }
    }

    private reportDiffResult(diffResult: DiffResult): void {
        if (JsonSchemaDiff.isBreakingChange(diffResult)) {
            this.reporter.reportFailureWithDifferences(diffResult.differences);
        } else if (diffResult.differences.length > 0) {
            this.reporter.reportSuccessWithDifferences(diffResult.differences);
        } else {
            this.reporter.reportNoDifferencesFound();
        }
    }

    private async loadSchemas(sourceSchemaFile: string, destinationSchemaFile: string): Promise<Schemas> {
        const whenSourceSchema = this.fileReader.read(sourceSchemaFile);
        const whenDestinationSchema = this.fileReader.read(destinationSchemaFile);
        const [sourceSchema, destinationSchema] = await Promise.all([whenSourceSchema, whenDestinationSchema]);
        return {sourceSchema, destinationSchema};
    }
}
