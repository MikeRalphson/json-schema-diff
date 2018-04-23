import * as _ from 'lodash';
import {DiffResult, DiffResultDifference, DiffResultDifferenceType} from '../../../../lib/json-schema-diff/differ';

const doArraysContainSameElements = <T>(array1: T[], array2: T[]): boolean =>
        array1.length === array2.length && _.differenceWith(array1, array2, _.isEqual).length === 0;

const differenceWithoutProperties = (diff: DiffResultDifference,
                                     properties: Array<keyof DiffResultDifference>): Partial<DiffResultDifference> => {
    return _.omit(diff, properties);
};

const arePropertiesEqual = (diff1: DiffResultDifference,
                            diff2: DiffResultDifference,
                            excludedProperties: Array<keyof DiffResultDifference>): boolean => {
    const diff1WithoutSourceAndDestinationValues =
        differenceWithoutProperties(diff1, excludedProperties);
    const diff2WithoutSourceAndDestinationValues =
        differenceWithoutProperties(diff2, excludedProperties);
    return _.isEqual(diff1WithoutSourceAndDestinationValues, diff2WithoutSourceAndDestinationValues);
};

const areDifferencesEqual = (diff1: DiffResultDifference, diff2: DiffResultDifference): boolean => {
    const areSourceValuesEqual = doArraysContainSameElements(diff1.sourceValues, diff2.sourceValues);
    const areDestinationValuesEqual = doArraysContainSameElements(diff1.destinationValues, diff2.destinationValues);
    const areRestOfThePropertiesEqual = arePropertiesEqual(diff1, diff2, ['sourceValues', 'destinationValues']);

    return areSourceValuesEqual && areRestOfThePropertiesEqual && areDestinationValuesEqual;
};

const reportUnmatchedDifferences = (differences: DiffResultDifference[], description: string): string => {
    const differencesAsJson = differences.map((difference) => JSON.stringify(difference, null, 4));
    return differencesAsJson.length > 0
        ? `${description}\n${differencesAsJson.join('\n')}\n\n`
        : '';
};

const expectedTypeValue = (expectedDifferences: DiffResultDifference[], type: DiffResultDifferenceType): boolean => {
    return expectedDifferences.some((difference) => {
        return difference.type === type;
    });
};

const compareDifferences = (actualDiffResult: DiffResult,
                            expectedDifferences: DiffResultDifference[]): jasmine.CustomMatcherResult => {
    const unmatchedActualDifferences = _.differenceWith(
        actualDiffResult.differences, expectedDifferences, areDifferencesEqual);
    const unmatchedExpectedDifferences = _.differenceWith(
        expectedDifferences, actualDiffResult.differences, areDifferencesEqual);

    const unmatchedActualMessage = reportUnmatchedDifferences(
        unmatchedActualDifferences, 'Unmatched actual differences:');
    const unmatchedExpectedMessage = reportUnmatchedDifferences(
        unmatchedExpectedDifferences, 'Unmatched expected differences:');

    const noDifferences = unmatchedActualDifferences.length + unmatchedExpectedDifferences.length === 0;

    return {
        message: unmatchedActualMessage + unmatchedExpectedMessage,
        pass: noDifferences
    };
};

const compareType = (actualTypeValue: boolean,
                     expectedDifferences: DiffResultDifference[],
                     type: DiffResultDifferenceType): jasmine.CustomMatcherResult => {

    const expectedValue = expectedTypeValue(expectedDifferences, type);
    const expectedAndActualMatch = expectedValue === actualTypeValue;

    const propertyNames = {
        'add.type': 'addedByDestinationSchema',
        'remove.type': 'removedByDestinationSchema'
    };
    const unmatchedTypeMessage: string = !expectedAndActualMatch
        ? `Expected ${propertyNames[type]} to be ` +
        `${expectedValue} but it was ${actualTypeValue}`
        : '';

    return {
        message: unmatchedTypeMessage,
        pass: expectedAndActualMatch
    };
};

export const customMatchers = {
    toContainDifferences: (): jasmine.CustomMatcher => ({

        compare: (actualDiffResult: DiffResult,
                  expectedDifferences: DiffResultDifference[]): jasmine.CustomMatcherResult => {

            const differencesCheck = compareDifferences(actualDiffResult, expectedDifferences);
            const addedByDestinationCheck = compareType(
                actualDiffResult.addedByDestinationSchema, expectedDifferences, 'add.type'
            );
            const removedByDestinationCheck = compareType(
                actualDiffResult.removedByDestinationSchema, expectedDifferences, 'remove.type'
            );

            const pass = differencesCheck.pass && addedByDestinationCheck.pass && removedByDestinationCheck.pass;
            const message = [
                differencesCheck.message, addedByDestinationCheck.message, removedByDestinationCheck.message
            ].join('/n');

            return {
                message, pass
            };
        }
    })
};

export interface CustomMatchers<T> extends jasmine.Matchers<T> {
    toContainDifferences(expected: DiffResultDifference[]): boolean;
}
