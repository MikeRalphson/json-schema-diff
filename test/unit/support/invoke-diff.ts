import {Differ, DiffResult} from '../../../lib/json-schema-diff/differ';
import {JsonSchema} from '../../../lib/json-schema-diff/parser/json-set/json-schema';
import {expectToFail} from '../../support/expect-to-fail';

export const invokeDiff = async (sourceSchema: JsonSchema, destinationSchema: JsonSchema): Promise<DiffResult> => {
    try {
        return await new Differ().diff(sourceSchema, destinationSchema);
    } catch (error) {
        fail(error.stack);
        throw error;
    }
};

export const invokeDiffAndExpectToFail = async (sourceSchema: JsonSchema,
                                                destinationSchema: JsonSchema): Promise<Error> => {
    return expectToFail(new Differ().diff(sourceSchema, destinationSchema));
};
