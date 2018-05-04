import {JsonSchemaDiff} from '../../lib/json-schema-diff';
import {JsonSchema} from '../../lib/json-schema-diff/parser/json-set/json-schema';
import {expectToFail} from '../support/expect-to-fail';
import {
    diffResultDifferenceBuilder} from './support/builders/diff-result-difference-builder';
import {createMockDiffer, MockDiffer} from './support/mocks/mock-differ';
import {createMockFileReader, MockFileReader} from './support/mocks/mock-file-reader';
import {createMockReporter, MockReporter} from './support/mocks/mock-reporter';

describe('json-schema-diff', () => {
    let mockFileReader: MockFileReader;
    let mockReporter: MockReporter;
    let mockDiffer: MockDiffer;

    beforeEach(() => {
        mockFileReader = createMockFileReader();
        mockFileReader.givenReadReturns(Promise.resolve({default: 'schema'}));

        mockReporter = createMockReporter();
        mockDiffer = createMockDiffer();
    });

    const invokeDiffFiles = (sourceSchemaFile: string, destinationSchemaFile: string): Promise<void> => {
        const jsonSchemaDiff = new JsonSchemaDiff(mockFileReader, mockDiffer, mockReporter);
        return jsonSchemaDiff.diffFiles(sourceSchemaFile, destinationSchemaFile);
    };

    const defaultSourceSchemaFileName = 'default-source-schema-file.json';
    const defaultDestinationSchemaFileName = 'default-destination-schema-file.json';

    const invokeDiffFilesWithSource = (sourceSchemaFile: string): Promise<void> =>
        invokeDiffFiles(sourceSchemaFile, defaultDestinationSchemaFileName);

    const invokeDiffFilesWithDestination = (destinationSchemaFile: string): Promise<void> =>
        invokeDiffFiles(defaultSourceSchemaFileName, destinationSchemaFile);

    const invokeDiffFilesWithSchemas = (sourceSchemaContent: Promise<JsonSchema>,
                                        destinationSchemaContent: Promise<JsonSchema>): Promise<void> => {
        mockFileReader.givenReadReturnsFiles({
            [defaultSourceSchemaFileName]: sourceSchemaContent,
            [defaultDestinationSchemaFileName]: destinationSchemaContent
        });

        return invokeDiffFiles(defaultSourceSchemaFileName, defaultDestinationSchemaFileName);
    };

    describe('diffFiles', () => {
        it('should load the source schema file', async () => {
            const sourceSchemaFile = 'source-file.json';

            await invokeDiffFilesWithSource(sourceSchemaFile);

            expect(mockFileReader.read).toHaveBeenCalledWith(sourceSchemaFile);
        });

        it('should load the destination schema file', async () => {
            const destinationSchemaFile = 'destination-file.json';

            await invokeDiffFilesWithDestination(destinationSchemaFile);

            expect(mockFileReader.read).toHaveBeenCalledWith(destinationSchemaFile);
        });

        it('should report an error when loading the source schema file fails', async () => {
            const sourceSchema = Promise.reject(new Error('an error'));
            const destinationSchema = Promise.resolve({});

            await expectToFail(invokeDiffFilesWithSchemas(sourceSchema, destinationSchema));

            expect(mockReporter.reportError).toHaveBeenCalledWith(new Error('an error'));
        });

        it('should report an error when loading the destination schema file fails', async () => {
            const sourceSchema = Promise.resolve({});
            const destinationSchema = Promise.reject(new Error('an error'));

            await expectToFail(invokeDiffFilesWithSchemas(sourceSchema, destinationSchema));

            expect(mockReporter.reportError).toHaveBeenCalledWith(new Error('an error'));
        });

        it('should diff the source and destination schemas', async () => {
            const sourceSchema = Promise.resolve<JsonSchema>({type: 'string'});
            const destinationSchema = Promise.resolve<JsonSchema>({type: 'object'});

            await invokeDiffFilesWithSchemas(sourceSchema, destinationSchema);

            expect(mockDiffer.diff).toHaveBeenCalledWith({type: 'string'}, {type: 'object'});
        });

        it('should report an error when differ has an unexpected error', async () => {
            const sourceSchema = Promise.resolve<JsonSchema>({type: 'string'});
            const destinationSchema = Promise.resolve<JsonSchema>({type: 'object'});
            mockDiffer.givenDiffReturnsError(new Error('Unexpected error diffing'));

            await expectToFail(invokeDiffFilesWithSchemas(sourceSchema, destinationSchema));

            expect(mockReporter.reportError).toHaveBeenCalledWith(new Error('Unexpected error diffing'));
        });

        it('should report no differences when none are found', async () => {
            const sourceSchema = Promise.resolve<JsonSchema>({type: 'string'});
            const destinationSchema = Promise.resolve<JsonSchema>({type: 'string'});
            mockDiffer.givenDiffReturnsNoDifferencesFoundResult();

            await invokeDiffFilesWithSchemas(sourceSchema, destinationSchema);

            expect(mockReporter.reportNoDifferencesFound).toHaveBeenCalled();
            expect(mockReporter.reportSuccessWithDifferences).not.toHaveBeenCalled();
        });

        it('should report compatible differences when an addition is found', async () => {
            const sourceSchema = Promise.resolve<JsonSchema>({type: 'string'});
            const destinationSchema = Promise.resolve<JsonSchema>({type: ['string', 'number']});

            const addTypeDifferenceBuilder = diffResultDifferenceBuilder.withTypeAddType();

            mockDiffer.givenDiffReturnsResult({
                addedByDestinationSchema: true,
                differences: [addTypeDifferenceBuilder.build()],
                removedByDestinationSchema: false
            });

            await invokeDiffFilesWithSchemas(sourceSchema, destinationSchema);

            expect(mockReporter.reportNoDifferencesFound).not.toHaveBeenCalled();
            expect(mockReporter.reportSuccessWithDifferences).toHaveBeenCalledWith([addTypeDifferenceBuilder.build()]);
        });

        it('should report incompatible differences when a removal is found', async () => {
            const sourceSchema = Promise.resolve<JsonSchema>({type: ['string', 'boolean']});
            const destinationSchema = Promise.resolve<JsonSchema>({type: 'string'});

            const removeTypeDifferenceBuilder = diffResultDifferenceBuilder.withTypeRemoveType();

            mockDiffer.givenDiffReturnsResult({
                addedByDestinationSchema: false,
                differences: [removeTypeDifferenceBuilder.build()],
                removedByDestinationSchema: true
            });

            await expectToFail(invokeDiffFilesWithSchemas(sourceSchema, destinationSchema));

            expect(mockReporter.reportFailureWithDifferences).toHaveBeenCalledWith([
                removeTypeDifferenceBuilder.build()
            ]);
        });
    });
});
