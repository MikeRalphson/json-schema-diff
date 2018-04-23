"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parse_as_json_schema_set_1 = require("./diff-schemas/parse-as-json-schema-set");
const interpretationsToAddedDifferences = (interpretations) => interpretations.map((interpretation) => ({
    addedByDestinationSpec: true,
    destinationValues: interpretation.destinationValues,
    removedByDestinationSpec: false,
    sourceValues: interpretation.sourceValues,
    type: 'add.type',
    value: interpretation.value
}));
const interpretationsToRemovedDifferences = (interpretations) => interpretations.map((interpretation) => ({
    addedByDestinationSpec: false,
    destinationValues: interpretation.destinationValues,
    removedByDestinationSpec: true,
    sourceValues: interpretation.sourceValues,
    type: 'remove.type',
    value: interpretation.value
}));
exports.diffSchemas = (sourceSchema, destinationSchema) => {
    const sourceSet = parse_as_json_schema_set_1.parseAsJsonSchemaSet(sourceSchema, 'source');
    const destinationSet = parse_as_json_schema_set_1.parseAsJsonSchemaSet(destinationSchema, 'destination');
    const intersectionOfSets = sourceSet.intersect(destinationSet);
    const negatedIntersectionOfSets = intersectionOfSets.inverse();
    const addedToDestinationSet = negatedIntersectionOfSets.intersect(destinationSet);
    const removedFromDestinationSet = negatedIntersectionOfSets.intersect(sourceSet);
    const addedInterpretations = addedToDestinationSet.toRepresentations();
    const addedDifferences = interpretationsToAddedDifferences(addedInterpretations);
    const removedInterpretations = removedFromDestinationSet.toRepresentations();
    const removedDifferences = interpretationsToRemovedDifferences(removedInterpretations);
    return Promise.resolve({
        addedByDestinationSpec: addedDifferences.length > 0,
        differences: addedDifferences.concat(removedDifferences),
        removedByDestinationSpec: removedDifferences.length > 0
    });
};
