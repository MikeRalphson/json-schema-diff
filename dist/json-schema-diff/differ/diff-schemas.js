"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const parse_as_json_set_1 = require("../parser/parse-as-json-set");
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
    const sourceSet = parse_as_json_set_1.parseAsJsonSet(sourceSchema, 'source');
    const destinationSet = parse_as_json_set_1.parseAsJsonSet(destinationSchema, 'destination');
    const intersectionOfSets = sourceSet.intersect(destinationSet);
    const intersectionOfSetsComplement = intersectionOfSets.complement();
    const addedToDestinationSet = intersectionOfSetsComplement.intersect(destinationSet);
    const removedFromDestinationSet = intersectionOfSetsComplement.intersect(sourceSet);
    const addedRepresentations = addedToDestinationSet.toRepresentations();
    const removedRepresentations = removedFromDestinationSet.toRepresentations();
    const identicalRepresentations = _.intersectionWith(addedRepresentations, removedRepresentations, _.isEqual);
    const uniqueDifferenceAddedRepresentations = _.differenceWith(addedRepresentations, identicalRepresentations, _.isEqual);
    const uniqueDifferenceRemovedRepresentations = _.differenceWith(removedRepresentations, identicalRepresentations, _.isEqual);
    const addedDifferences = representationsToAddedDifferences(uniqueDifferenceAddedRepresentations);
    const removedDifferences = representationsToRemovedDifferences(uniqueDifferenceRemovedRepresentations);
    return Promise.resolve({
        addedByDestinationSchema: addedDifferences.length > 0,
        differences: addedDifferences.concat(removedDifferences),
        removedByDestinationSchema: removedDifferences.length > 0
    });
};
