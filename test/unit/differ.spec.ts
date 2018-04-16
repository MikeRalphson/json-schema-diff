import {Differ, DiffResult} from '../../lib/differ';
import {JsonSchema} from '../../lib/json-schema';
import {diffResultDifferenceBuilder} from './support/builders/diff-result-difference-builder';
import {
    diffResultDifferenceValueBuilder
} from './support/builders/diff-result-difference-value-builder';

describe('differ', () => {
    const invokeDiff = (sourceSchema: JsonSchema, destinationSchema: JsonSchema): Promise<DiffResult> =>
        new Differ().diff(sourceSchema, destinationSchema);

    it('should find no differences when the schemas are the same', async () => {
        const sourceSchema: JsonSchema = {type: 'string'};
        const destinationsSchema: JsonSchema = {type: 'string'};

        const diffResult = await invokeDiff(sourceSchema, destinationsSchema);

        expect(diffResult.addedByDestinationSpec).toBe(false, 'diffResult.addedByDestinationSpec');
        expect(diffResult.removedByDestinationSpec).toBe(false, 'diffResult.removedByDestinationSpec');
        expect(diffResult.differences).toEqual([], 'diffResult.differences');
    });

    it('should find no differences when the schemas are the same', async () => {
        const sourceSchema: JsonSchema = {type: 'string'};
        const destinationsSchema: JsonSchema = {type: ['string']};

        const diffResult = await invokeDiff(sourceSchema, destinationsSchema);

        expect(diffResult.addedByDestinationSpec).toBe(false, 'diffResult.addedByDestinationSpec');
        expect(diffResult.removedByDestinationSpec).toBe(false, 'diffResult.removedByDestinationSpec');
        expect(diffResult.differences).toEqual([], 'diffResult.differences');
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

        expect(diffResult.addedByDestinationSpec).toBe(false, 'diffResult.addedByDestinationSpec');
        expect(diffResult.removedByDestinationSpec).toBe(true, 'diffResult.removedByDestinationSpec');
        expect(diffResult.differences).toEqual([difference], 'diffResult.differences');
    });

    it('should find a add type difference when a type is added', async () => {
        const sourceSchema: JsonSchema = {type: 'number'};
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
                    .withValue('number')
            )
            .withValue('string')
            .withTypeAddType()
            .build();

        expect(diffResult.addedByDestinationSpec).toBe(true, 'diffResult.addedByDestinationSpec');
        expect(diffResult.removedByDestinationSpec).toBe(false, 'diffResult.removedByDestinationSpec');
        expect(diffResult.differences).toEqual([difference], 'diffResult.differences');
    });

    it('should find an add and remove difference when a type is changed ', async () => {
        const sourceSchema: JsonSchema = {type: 'number'};
        const destinationsSchema: JsonSchema = {type: 'string'};

        const diffResult = await invokeDiff(sourceSchema, destinationsSchema);

        const differenceBuilder =  diffResultDifferenceBuilder
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

        expect(diffResult.addedByDestinationSpec).toBe(true, 'diffResult.addedByDestinationSpec');
        expect(diffResult.removedByDestinationSpec).toBe(true, 'diffResult.removedByDestinationSpec');
        expect(diffResult.differences).toContain(addedDifference, 'diffResult.differences');
        expect(diffResult.differences).toContain(removedDifference, 'diffResult.differences');
    });

    it('should find no differences when given two empty specs', async () => {
        const sourceSchema: JsonSchema = {};
        const destinationsSchema: JsonSchema = {};

        const diffResult = await invokeDiff(sourceSchema, destinationsSchema);

        expect(diffResult.addedByDestinationSpec).toBe(false, 'diffResult.addedByDestinationSpec');
        expect(diffResult.removedByDestinationSpec).toBe(false, 'diffResult.removedByDestinationSpec');
        expect(diffResult.differences).toEqual([], 'diffResult.differences');
    });

    it('should find two differences when multiple types are removed', async () => {
        const sourceSchema: JsonSchema = {type: ['number', 'string', 'boolean']};
        const destinationsSchema: JsonSchema = {type: ['number']};

        const diffResult = await invokeDiff(sourceSchema, destinationsSchema);

        const differenceBuilder =  diffResultDifferenceBuilder
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

        expect(diffResult.addedByDestinationSpec).toBe(false, 'diffResult.addedByDestinationSpec');
        expect(diffResult.removedByDestinationSpec).toBe(true, 'diffResult.removedByDestinationSpec');
        expect(diffResult.differences).toContain(removedFirstDifference, 'diffResult.differences');
        expect(diffResult.differences).toContain(removedSecondDifference, 'diffResult.differences');
    });

    it('should find two differences when multiple types are added', async () => {
        const sourceSchema: JsonSchema = {type: ['number']};
        const destinationsSchema: JsonSchema = {type: ['number', 'string', 'boolean']};

        const diffResult = await invokeDiff(sourceSchema, destinationsSchema);

        const differenceBuilder =  diffResultDifferenceBuilder
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

        expect(diffResult.addedByDestinationSpec).toBe(true, 'diffResult.addedByDestinationSpec');
        expect(diffResult.removedByDestinationSpec).toBe(false, 'diffResult.removedByDestinationSpec');
        expect(diffResult.differences).toContain(addedFirstDifference, 'diffResult.differences');
        expect(diffResult.differences).toContain(addedSecondDifference, 'diffResult.differences');
    });

    it('should find removed differences when there was no type and now there is', async () => {
        const sourceSchema: JsonSchema = {};
        const destinationsSchema: JsonSchema = {type: ['string', 'number', 'object', 'null', 'boolean', 'array']};

        const diffResult = await invokeDiff(sourceSchema, destinationsSchema);

        const removedDifference = diffResultDifferenceBuilder
            .withDestinationValue(
                diffResultDifferenceValueBuilder
                    .withLocation('.type')
                    .withValue(['string', 'number', 'object', 'null', 'boolean', 'array'])
            )
            .withSourceValue(
                diffResultDifferenceValueBuilder
                    .withLocation('.type')
                    .withValue(undefined)
            )
            .withValue('integer')
            .withTypeRemoveType()
            .build();

        expect(diffResult.addedByDestinationSpec).toBe(false, 'diffResult.addedByDestinationSpec');
        expect(diffResult.removedByDestinationSpec).toBe(true, 'diffResult.removedByDestinationSpec');
        expect(diffResult.differences).toContain(removedDifference, 'diffResult.differences');
    });
});
