import {DiffResult, DiffResultDifference, DiffResultDifferenceType} from '../differ';
import {CoreSchemaMetaSchema} from './diff-schemas/json-schema';
import {Representation} from './diff-schemas/json-schema-set/set';
import {parseAsJsonSchemaSet} from './diff-schemas/parse-as-json-schema-set';

const interpretationsToAddedDifferences = (interpretations: Representation[]): DiffResultDifference[] =>
    interpretations.map((interpretation) => ({
        addedByDestinationSpec: true,
        destinationValues: interpretation.destinationValues,
        removedByDestinationSpec: false,
        sourceValues: interpretation.sourceValues,
        type: 'add.type' as DiffResultDifferenceType,
        value: interpretation.value
    }));

const interpretationsToRemovedDifferences = (interpretations: Representation[]): DiffResultDifference[] =>
    interpretations.map((interpretation) => ({
        addedByDestinationSpec: false,
        destinationValues: interpretation.destinationValues,
        removedByDestinationSpec: true,
        sourceValues: interpretation.sourceValues,
        type: 'remove.type' as DiffResultDifferenceType,
        value: interpretation.value
    }));

export const diffSchemas = (sourceSchema: CoreSchemaMetaSchema,
                            destinationSchema: CoreSchemaMetaSchema): Promise<DiffResult> => {
    const sourceSet = parseAsJsonSchemaSet(sourceSchema, 'source');
    const destinationSet = parseAsJsonSchemaSet(destinationSchema, 'destination');

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
