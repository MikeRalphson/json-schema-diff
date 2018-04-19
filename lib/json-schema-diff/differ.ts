import {diffSchemas} from './differ/diff-schemas';
import {validateSchemas} from './differ/validate-schemas';

export interface DiffResultDifferenceValue {
    location: string;
    value: any;
}

export type DiffResultDifferenceType = 'add.type' | 'remove.type';

export interface DiffResultDifference {
    addedByDestinationSpec: boolean;
    destinationValues: DiffResultDifferenceValue[];
    removedByDestinationSpec: boolean;
    sourceValues: DiffResultDifferenceValue[];
    type: DiffResultDifferenceType;
    value: any;
}

export interface DiffResult {
    addedByDestinationSpec: boolean;
    differences: DiffResultDifference[];
    removedByDestinationSpec: boolean;
}

export class Differ {
    public async diff(sourceSchema: any, destinationSchema: any): Promise<DiffResult> {
        await validateSchemas(sourceSchema, destinationSchema);

        if (typeof sourceSchema !== 'boolean' && typeof destinationSchema !== 'boolean') {
            return diffSchemas(sourceSchema, destinationSchema);
        }
        return Promise.resolve({
            addedByDestinationSpec: false,
            differences: [],
            removedByDestinationSpec: false
        });
    }
}
