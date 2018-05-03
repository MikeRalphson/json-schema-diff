import {DiffResult, DiffResultDifference, DiffResultDifferenceType} from '../differ';
import {JsonSchema} from './diff-schemas/json-schema';
import {Representation} from './diff-schemas/json-schema-set/set';
import {parseAsJsonSchemaSet} from './diff-schemas/parse-as-json-schema-set';

const representationsToAddedDifferences = (representations: Representation[]): DiffResultDifference[] =>
    representations.map((representation) => ({
        addedByDestinationSchema: true,
        destinationValues: representation.destinationValues,
        removedByDestinationSchema: false,
        sourceValues: representation.sourceValues,
        type: 'add.type' as DiffResultDifferenceType,
        value: representation.value
    }));

const representationsToRemovedDifferences = (representations: Representation[]): DiffResultDifference[] =>
    representations.map((representation) => ({
        addedByDestinationSchema: false,
        destinationValues: representation.destinationValues,
        removedByDestinationSchema: true,
        sourceValues: representation.sourceValues,
        type: 'remove.type' as DiffResultDifferenceType,
        value: representation.value
    }));

export const diffSchemas = (sourceSchema: JsonSchema,
                            destinationSchema: JsonSchema): Promise<DiffResult> => {
    const sourceSet = parseAsJsonSchemaSet(sourceSchema, 'source');
    const destinationSet = parseAsJsonSchemaSet(destinationSchema, 'destination');

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
