"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parse_as_json_schema_set_1 = require("./diff-schemas/parse-as-json-schema-set");
const representationsToAddedDifferences = (representations) => representations.map((representation) => ({
    addedByDestinationSchema: true,
    destinationValues: representation.destinationValues,
    removedByDestinationSchema: false,
    sourceValues: representation.sourceValues,
    type: 'add.type',
    value: representation.value
}));
const representationsToRemovedDifferences = (representations) => representations.map((representation) => ({
    addedByDestinationSchema: false,
    destinationValues: representation.destinationValues,
    removedByDestinationSchema: true,
    sourceValues: representation.sourceValues,
    type: 'remove.type',
    value: representation.value
}));
exports.diffSchemas = (sourceSchema, destinationSchema) => {
    const sourceSet = parse_as_json_schema_set_1.parseAsJsonSchemaSet(sourceSchema, 'source');
    const destinationSet = parse_as_json_schema_set_1.parseAsJsonSchemaSet(destinationSchema, 'destination');
    const intersectionOfSets = sourceSet.intersect(destinationSet);
    const intersectionOfSetsComplement = intersectionOfSets.complement();
    const addedToDestinationSet = intersectionOfSetsComplement.intersect(destinationSet);
    const removedFromDestinationSet = intersectionOfSetsComplement.intersect(sourceSet);
    const addedRepresentations = addedToDestinationSet.toRepresentations();
    const addedDifferences = representationsToAddedDifferences(addedRepresentations);
    const removedRepresentations = removedFromDestinationSet.toRepresentations();
    const removedDifferences = representationsToRemovedDifferences(removedRepresentations);
    return Promise.resolve({
        addedByDestinationSchema: addedDifferences.length > 0,
        differences: addedDifferences.concat(removedDifferences),
        removedByDestinationSchema: removedDifferences.length > 0
    });
};
