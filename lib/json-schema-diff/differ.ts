import {diffSchemas} from './differ/diff-schemas';
import {validateSchemas} from './differ/validate-schemas';

export interface DiffResultDifferenceValue {
    location: string;
    value: any;
}

export type DiffResultDifferenceType = 'add.type' | 'remove.type';

export interface DiffResultDifference {
    addedByDestinationSchema: boolean;
    destinationValues: DiffResultDifferenceValue[];
    removedByDestinationSchema: boolean;
    sourceValues: DiffResultDifferenceValue[];
    type: DiffResultDifferenceType;
    value: any;
}

export interface DiffResult {
    addedByDestinationSchema: boolean;
    differences: DiffResultDifference[];
    removedByDestinationSchema: boolean;
}

export class Differ {
    public async diff(sourceSchema: any, destinationSchema: any): Promise<DiffResult> {
        await validateSchemas(sourceSchema, destinationSchema);

        if (typeof sourceSchema !== 'boolean' && typeof destinationSchema !== 'boolean') {
            return diffSchemas(sourceSchema, destinationSchema);
        }
        return Promise.resolve({
            addedByDestinationSchema: false,
            differences: [],
            removedByDestinationSchema: false
        });
    }
}
