import {Differ, DiffResult} from './json-schema-diff/differ';
import {FileReader} from './json-schema-diff/file-reader';
import {Reporter} from './json-schema-diff/reporter';

export class JsonSchemaDiff {
    private static containsBreakingChanges(diffResult: DiffResult): boolean {
        return diffResult.removedByDestinationSchema;
    }

    public constructor(
        private readonly fileReader: FileReader,
        private readonly differ: Differ,
        private readonly reporter: Reporter) {}

    public async diffFiles(sourceSchemaFile: string, destinationSchemaFile: string): Promise<void> {
        try {
            const {sourceSchema, destinationSchema} = await this.loadSchemas(sourceSchemaFile, destinationSchemaFile);
            const diffResult = await this.differ.diff(sourceSchema, destinationSchema);
            this.reportDiffResult(diffResult);

            if (JsonSchemaDiff.containsBreakingChanges(diffResult)) {
                return Promise.reject(new Error('Breaking changes detected'));
            }
        } catch (error) {
            this.reporter.reportError(error);
            return Promise.reject(error);
        }
    }

    private reportDiffResult(diffResult: DiffResult): void {
        if (JsonSchemaDiff.containsBreakingChanges(diffResult)) {
            this.reporter.reportFailureWithDifferences(diffResult.differences);
        } else if (diffResult.differences.length > 0) {
            this.reporter.reportSuccessWithDifferences(diffResult.differences);
        } else {
            this.reporter.reportNoDifferencesFound();
        }
    }

    private async loadSchemas(sourceSchemaFile: string, destinationSchemaFile: string): Promise<any> {
        const whenSourceSchema = this.fileReader.read(sourceSchemaFile);
        const whenDestinationSchema = this.fileReader.read(destinationSchemaFile);
        const [sourceSchema, destinationSchema] = await Promise.all([whenSourceSchema, whenDestinationSchema]);
        return {sourceSchema, destinationSchema};
    }
}
