"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeToArray = (type) => {
    if (!type) {
        return ['string', 'number', 'boolean', 'integer', 'array', 'object', 'null'];
    }
    if (typeof type === 'string') {
        return [type];
    }
    return type;
};
const findAddedValues = (originalList, newList) => {
    const valuesAdded = [];
    for (const newValue of newList) {
        if (originalList.indexOf(newValue) === -1) {
            valuesAdded.push(newValue);
        }
    }
    return valuesAdded;
};
const findRemovedValues = (originalList, newList) => {
    const valuesRemoved = [];
    for (const originalValue of originalList) {
        if (newList.indexOf(originalValue) === -1) {
            valuesRemoved.push(originalValue);
        }
    }
    return valuesRemoved;
};
const diffSchemas = (sourceSchema, destinationSchema) => {
    const sourceType = typeToArray(sourceSchema.type);
    const destinationType = typeToArray(destinationSchema.type);
    const differences = [];
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
            type: 'remove.type',
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
            type: 'add.type',
            value: valueAdded
        });
    }
    return Promise.resolve({
        addedByDestinationSpec: valuesAdded.length > 0,
        differences,
        removedByDestinationSpec: valuesRemoved.length > 0
    });
};
class Differ {
    diff(sourceSchema, destinationSchema) {
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
exports.Differ = Differ;
