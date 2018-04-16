import {CoreSchemaMetaSchema, JsonSchema, SimpleTypes} from './json-schema';

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

const typeToArray = (type?: SimpleTypes | SimpleTypes[]): SimpleTypes[] => {
    if (!type) {
        return ['string', 'number', 'boolean', 'integer', 'array', 'object', 'null'];
    }

    if (typeof type === 'string') {
        return [type];
    }

    return type;
};

const findAddedValues = (originalList: string[], newList: string[]): string[] => {
    const valuesAdded = [];

    for (const newValue of newList) {
        if (originalList.indexOf(newValue) === -1) {
            valuesAdded.push(newValue);
        }
    }

    return valuesAdded;
};

const findRemovedValues = (originalList: string[], newList: string[]): string[] => {
    const valuesRemoved = [];

    for (const originalValue of originalList) {
        if (newList.indexOf(originalValue) === -1) {
            valuesRemoved.push(originalValue);
        }
    }

    return valuesRemoved;
};

const diffSchemas = (
    sourceSchema: CoreSchemaMetaSchema,
    destinationSchema: CoreSchemaMetaSchema
): Promise<DiffResult> => {
    const sourceType = typeToArray(sourceSchema.type);
    const destinationType = typeToArray(destinationSchema.type);

    const differences: DiffResultDifference[] = [];

    const valuesRemoved = findRemovedValues(sourceType, destinationType);
    const valuesAdded = findAddedValues(sourceType, destinationType);

    for (const valueRemove of valuesRemoved) {
        differences.push({
            addedByDestinationSpec: false,
            destinationValues: [{
                location: '.type',
                value: destinationSchema.type
            }],
            removedByDestinationSpec: true,
            sourceValues: [{
                location: '.type',
                value: sourceSchema.type
            }],
            type: 'remove.type' as DiffResultDifferenceType,
            value: valueRemove
        });
    }

    for (const valueAdded of valuesAdded) {
        differences.push({
            addedByDestinationSpec: true,
            destinationValues: [{
                location: '.type',
                value: destinationSchema.type
            }],
            removedByDestinationSpec: false,
            sourceValues: [{
                location: '.type',
                value: sourceSchema.type
            }],
            type: 'add.type' as DiffResultDifferenceType,
            value: valueAdded
        });
    }

    return Promise.resolve({
        addedByDestinationSpec: valuesAdded.length > 0,
        differences,
        removedByDestinationSpec: valuesRemoved.length > 0
    });
};

export class Differ {
    public diff(sourceSchema: JsonSchema, destinationSchema: JsonSchema): Promise<DiffResult> {
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
