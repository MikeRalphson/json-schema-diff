import {Differ, DiffResult} from '../../../lib/json-schema-diff/differ';
import {JsonSchema} from '../../../lib/json-schema-diff/differ/diff-schemas/json-schema';
import {expectToFail} from '../../support/expect-to-fail';
import {diffResultDifferenceBuilder} from '../support/builders/diff-result-difference-builder';
import {
diffResultDifferenceValueBuilder
} from '../support/builders/diff-result-difference-value-builder';
import {customMatchers, CustomMatchers} from '../support/custom-matchers/diff-custom-matcher';

declare function expect<T>(actual: T): CustomMatchers<T>;

describe('differ', () => {
    beforeEach(() => {
        jasmine.addMatchers(customMatchers);
    });

    const invokeDiff = async (sourceSchema: JsonSchema, destinationSchema: JsonSchema): Promise<DiffResult> => {
        try {
            return await new Differ().diff(sourceSchema, destinationSchema);
        } catch (error) {
            fail(error.stack);
            throw error;
        }
    };

    const invokeDiffAndExpectToFail = async (
        sourceSchema: JsonSchema,
        destinationSchema: JsonSchema
    ): Promise<Error> => {
        return expectToFail(new Differ().diff(sourceSchema, destinationSchema));
    };

    describe('validation', () => {
        it('should return an error when the source schema is not valid', async () => {
            const sourceSchema: JsonSchema = {type: 'invalid-type'} as any;
            const destinationsSchema: JsonSchema = {type: 'string'};

            const error = await invokeDiffAndExpectToFail(sourceSchema, destinationsSchema);

            expect(error).toEqual(new Error(
                'Source schema is not a valid json schema: ' +
                'data.type should be equal to one of the allowed values, ' +
                'data.type should be array, data.type should match some schema in anyOf'
            ));
        });

        it('should return an error when the destination schema is not valid', async () => {
            const sourceSchema: JsonSchema = {type: 'string'};
            const destinationsSchema: JsonSchema = {type: 'invalid-type'} as any;

            const error = await invokeDiffAndExpectToFail(sourceSchema, destinationsSchema);

            expect(error).toEqual(new Error(
                'Destination schema is not a valid json schema: ' +
                'data.type should be equal to one of the allowed values, ' +
                'data.type should be array, data.type should match some schema in anyOf'
            ));
        });
    });

    describe('type', () => {
        it('should find no differences when the schemas are the same', async () => {
            const sourceSchema: JsonSchema = {type: 'string'};
            const destinationsSchema: JsonSchema = {type: 'string'};

            const diffResult = await invokeDiff(sourceSchema, destinationsSchema);

            expect(diffResult).toContainDifferences([]);
        });

        it('should find no differences when the schemas are equivalent', async () => {
            const sourceSchema: JsonSchema = {type: 'string'};
            const destinationsSchema: JsonSchema = {type: ['string']};

            const diffResult = await invokeDiff(sourceSchema, destinationsSchema);

            expect(diffResult).toContainDifferences([]);
        });

        it('should find a remove type difference when a type is removed', async () => {
            const sourceSchema: JsonSchema = {type: ['string', 'number']};
            const destinationsSchema: JsonSchema = {type: ['string']};

            const diffResult = await invokeDiff(sourceSchema, destinationsSchema);

            const difference = diffResultDifferenceBuilder
                .withDestinationValue(
                    diffResultDifferenceValueBuilder
                        .withLocation('.type')
                        .withValue(['string'])
                )
                .withSourceValue(
                    diffResultDifferenceValueBuilder
                        .withLocation('.type')
                        .withValue(['string', 'number'])
                )
                .withValue('number')
                .withTypeRemoveType()
                .build();

            expect(diffResult).toContainDifferences([difference]);
        });

        it('should find an add type difference when an array is added', async () => {
            const sourceSchema: JsonSchema = {type: 'number'};
            const destinationsSchema: JsonSchema = {type: ['number', 'array']};

            const diffResult = await invokeDiff(sourceSchema, destinationsSchema);

            const difference = diffResultDifferenceBuilder
                .withDestinationValue(
                    diffResultDifferenceValueBuilder
                        .withLocation('.type')
                        .withValue(['number', 'array'])
                )
                .withSourceValue(
                    diffResultDifferenceValueBuilder
                        .withLocation('.type')
                        .withValue('number')
                )
                .withValue('array')
                .withTypeAddType()
                .build();

            expect(diffResult).toContainDifferences([difference]);
        });

        it('should find an add type difference when a boolean is added', async () => {
            const sourceSchema: JsonSchema = {type: 'number'};
            const destinationsSchema: JsonSchema = {type: ['number', 'boolean']};

            const diffResult = await invokeDiff(sourceSchema, destinationsSchema);

            const difference = diffResultDifferenceBuilder
                .withDestinationValue(
                    diffResultDifferenceValueBuilder
                        .withLocation('.type')
                        .withValue(['number', 'boolean'])
                )
                .withSourceValue(
                    diffResultDifferenceValueBuilder
                        .withLocation('.type')
                        .withValue('number')
                )
                .withValue('boolean')
                .withTypeAddType()
                .build();

            expect(diffResult).toContainDifferences([difference]);
        });

        it('should find an add type difference when an integer is added', async () => {
            const sourceSchema: JsonSchema = {type: 'number'};
            const destinationsSchema: JsonSchema = {type: ['number', 'integer']};

            const diffResult = await invokeDiff(sourceSchema, destinationsSchema);

            const difference = diffResultDifferenceBuilder
                .withDestinationValue(
                    diffResultDifferenceValueBuilder
                        .withLocation('.type')
                        .withValue(['number', 'integer'])
                )
                .withSourceValue(
                    diffResultDifferenceValueBuilder
                        .withLocation('.type')
                        .withValue('number')
                )
                .withValue('integer')
                .withTypeAddType()
                .build();

            expect(diffResult).toContainDifferences([difference]);
        });

        it('should find an add type difference when a null is added', async () => {
            const sourceSchema: JsonSchema = {type: 'number'};
            const destinationsSchema: JsonSchema = {type: ['number', 'null']};

            const diffResult = await invokeDiff(sourceSchema, destinationsSchema);

            const difference = diffResultDifferenceBuilder
                .withDestinationValue(
                    diffResultDifferenceValueBuilder
                        .withLocation('.type')
                        .withValue(['number', 'null'])
                )
                .withSourceValue(
                    diffResultDifferenceValueBuilder
                        .withLocation('.type')
                        .withValue('number')
                )
                .withValue('null')
                .withTypeAddType()
                .build();

            expect(diffResult).toContainDifferences([difference]);
        });

        it('should find an add type difference when a number is added', async () => {
            const sourceSchema: JsonSchema = {type: 'string'};
            const destinationsSchema: JsonSchema = {type: ['string', 'number']};

            const diffResult = await invokeDiff(sourceSchema, destinationsSchema);

            const difference = diffResultDifferenceBuilder
                .withDestinationValue(
                    diffResultDifferenceValueBuilder
                        .withLocation('.type')
                        .withValue(['string', 'number'])
                )
                .withSourceValue(
                    diffResultDifferenceValueBuilder
                        .withLocation('.type')
                        .withValue('string')
                )
                .withValue('number')
                .withTypeAddType()
                .build();

            expect(diffResult).toContainDifferences([difference]);
        });

        it('should find an add type difference when an object is added', async () => {
            const sourceSchema: JsonSchema = {type: 'number'};
            const destinationsSchema: JsonSchema = {type: ['number', 'object']};

            const diffResult = await invokeDiff(sourceSchema, destinationsSchema);

            const difference = diffResultDifferenceBuilder
                .withDestinationValue(
                    diffResultDifferenceValueBuilder
                        .withLocation('.type')
                        .withValue(['number', 'object'])
                )
                .withSourceValue(
                    diffResultDifferenceValueBuilder
                        .withLocation('.type')
                        .withValue('number')
                )
                .withValue('object')
                .withTypeAddType()
                .build();

            expect(diffResult).toContainDifferences([difference]);
        });

        it('should find an add type difference when a string is added', async () => {
            const sourceSchema: JsonSchema = {type: 'number'};
            const destinationsSchema: JsonSchema = {type: ['number', 'string']};

            const diffResult = await invokeDiff(sourceSchema, destinationsSchema);

            const difference = diffResultDifferenceBuilder
                .withDestinationValue(
                    diffResultDifferenceValueBuilder
                        .withLocation('.type')
                        .withValue(['number', 'string'])
                )
                .withSourceValue(
                    diffResultDifferenceValueBuilder
                        .withLocation('.type')
                        .withValue('number')
                )
                .withValue('string')
                .withTypeAddType()
                .build();

            expect(diffResult).toContainDifferences([difference]);
        });

        it('should find an add and remove difference when a type is changed ', async () => {
            const sourceSchema: JsonSchema = {type: 'number'};
            const destinationsSchema: JsonSchema = {type: 'string'};

            const diffResult = await invokeDiff(sourceSchema, destinationsSchema);

            const differenceBuilder = diffResultDifferenceBuilder
                .withDestinationValue(
                    diffResultDifferenceValueBuilder
                        .withLocation('.type')
                        .withValue('string')
                )
                .withSourceValue(
                    diffResultDifferenceValueBuilder
                        .withLocation('.type')
                        .withValue('number')
                );

            const addedDifference = differenceBuilder
                .withValue('string')
                .withTypeAddType()
                .build();

            const removedDifference = differenceBuilder
                .withValue('number')
                .withTypeRemoveType()
                .build();

            expect(diffResult).toContainDifferences([addedDifference, removedDifference]);
        });

        it('should find no differences when given two empty schemas', async () => {
            const sourceSchema: JsonSchema = {};
            const destinationsSchema: JsonSchema = {};

            const diffResult = await invokeDiff(sourceSchema, destinationsSchema);

            expect(diffResult).toContainDifferences([]);
        });

        it('should find two differences when multiple types are removed', async () => {
            const sourceSchema: JsonSchema = {type: ['number', 'string', 'boolean']};
            const destinationsSchema: JsonSchema = {type: ['number']};

            const diffResult = await invokeDiff(sourceSchema, destinationsSchema);

            const differenceBuilder = diffResultDifferenceBuilder
                .withDestinationValue(
                    diffResultDifferenceValueBuilder
                        .withLocation('.type')
                        .withValue(['number'])
                )
                .withSourceValue(
                    diffResultDifferenceValueBuilder
                        .withLocation('.type')
                        .withValue(['number', 'string', 'boolean'])
                )
                .withTypeRemoveType();

            const removedFirstDifference = differenceBuilder
                .withValue('string')
                .build();

            const removedSecondDifference = differenceBuilder
                .withValue('boolean')
                .build();

            expect(diffResult).toContainDifferences([removedFirstDifference, removedSecondDifference]);
        });

        it('should find two differences when multiple types are added', async () => {
            const sourceSchema: JsonSchema = {type: ['number']};
            const destinationsSchema: JsonSchema = {type: ['number', 'string', 'boolean']};

            const diffResult = await invokeDiff(sourceSchema, destinationsSchema);

            const differenceBuilder = diffResultDifferenceBuilder
                .withDestinationValue(
                    diffResultDifferenceValueBuilder
                        .withLocation('.type')
                        .withValue(['number', 'string', 'boolean'])
                )
                .withSourceValue(
                    diffResultDifferenceValueBuilder
                        .withLocation('.type')
                        .withValue(['number'])
                )
                .withTypeAddType();

            const addedFirstDifference = differenceBuilder
                .withValue('string')
                .build();

            const addedSecondDifference = differenceBuilder
                .withValue('boolean')
                .build();

            expect(diffResult).toContainDifferences([addedFirstDifference, addedSecondDifference]);
        });

        it('should find removed differences when there was no type and now there is', async () => {
            const sourceSchema: JsonSchema = {};
            const destinationsSchema: JsonSchema = {type: ['integer', 'number', 'object', 'null', 'boolean', 'array']};

            const diffResult = await invokeDiff(sourceSchema, destinationsSchema);

            const removedDifference = diffResultDifferenceBuilder
                .withDestinationValue(
                    diffResultDifferenceValueBuilder
                        .withLocation('.type')
                        .withValue(['integer', 'number', 'object', 'null', 'boolean', 'array'])
                )
                .withSourceValue(
                    diffResultDifferenceValueBuilder
                        .withLocation('.type')
                        .withValue(undefined)
                )
                .withValue('string')
                .withTypeRemoveType()
                .build();

            expect(diffResult).toContainDifferences([removedDifference]);
        });
    });

    describe('allOf', () => {
        it('should find a remove type difference inside an allOf', async () => {
            const sourceSchema: JsonSchema = {
                allOf: [{type: ['string', 'number']}]
            };
            const destinationsSchema: JsonSchema = {
                allOf: [
                    {type: ['string', 'number']},
                    {type: ['string', 'boolean']}
                ]
            };

            const diffResult = await invokeDiff(sourceSchema, destinationsSchema);

            const difference = diffResultDifferenceBuilder
                .withDestinationValues([
                    diffResultDifferenceValueBuilder
                        .withLocation('.allOf[1].type')
                        .withValue(['string', 'boolean']),
                    diffResultDifferenceValueBuilder
                        .withLocation('.allOf[0].type')
                        .withValue(['string', 'number']),
                    diffResultDifferenceValueBuilder
                        .withLocation('.type')
                        .withValue(undefined)
                ])
                .withSourceValues([
                    diffResultDifferenceValueBuilder
                        .withLocation('.allOf[0].type')
                        .withValue(['string', 'number']),
                    diffResultDifferenceValueBuilder
                        .withLocation('.type')
                        .withValue(undefined)
                ])
                .withValue('number')
                .withTypeRemoveType()
                .build();

            expect(diffResult).toContainDifferences([difference]);
        });
    });

    describe('not', () => {
        it('should find a remove and an add difference inside of a not', async () => {
            const sourceSchema: JsonSchema = {
                not: { type: 'string'}
            };
            const destinationSchema: JsonSchema = {
                not: { type: 'number'}
            };

            const diffResult = await invokeDiff(sourceSchema, destinationSchema);

            const baseDifference = diffResultDifferenceBuilder
                .withSourceValues([
                    diffResultDifferenceValueBuilder
                        .withLocation('.not.type')
                        .withValue('string'),
                    diffResultDifferenceValueBuilder
                        .withLocation('.type')
                        .withValue(undefined)
                ])
                .withDestinationValues([
                    diffResultDifferenceValueBuilder
                        .withLocation('.not.type')
                        .withValue('number'),
                    diffResultDifferenceValueBuilder
                        .withLocation('.type')
                        .withValue(undefined)
                ]);

            const addedDifference = baseDifference
                .withTypeAddType()
                .withValue('string')
                .build();

            const removeDifference = baseDifference
                .withTypeRemoveType()
                .withValue('number')
                .build();

            expect(diffResult).toContainDifferences([addedDifference, removeDifference]);
        });
    });
});
