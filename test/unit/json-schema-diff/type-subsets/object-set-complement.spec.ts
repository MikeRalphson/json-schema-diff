import {
    parsedSchemaKeywordsBuilder
} from '../../support/builders/parsed-schema-keywords/parsed-schema-keywords-builder';
import {parsedTypeKeywordBuilder} from '../../support/builders/parsed-schema-keywords/parsed-type-keyword-builder';
import {schemaOriginBuilder} from '../../support/builders/parsed-schema-keywords/schema-origin-builder';
import {representationBuilder} from '../../support/builders/representation-builder';
import {representationValueBuilder} from '../../support/builders/representation-value-builder';
import {allJsonSetBuilder} from '../../support/builders/sets/all-json-set-builder';
import {emptyJsonSetBuilder} from '../../support/builders/sets/empty-json-set-builder';
import {allObjectSetBuilder, objectSetBuilder} from '../../support/builders/sets/object-set-builder';
import {customMatchers, CustomMatchers} from '../../support/custom-matchers/custom-matchers';

declare function expect<T>(actual: T): CustomMatchers<T>;

describe('object-set', () => {
    beforeEach(() => {
        jasmine.addMatchers(customMatchers);
    });

    describe('complement', () => {
        it('should return an all object set when complementing an empty object set', () => {
            const emptyObjectSet = objectSetBuilder
                .withParsedSchemaKeywords(
                    parsedSchemaKeywordsBuilder
                        .withType(parsedTypeKeywordBuilder
                            .withOrigins([schemaOriginBuilder
                                .withType('source')
                                .withPath('.type')
                                .withValue('string')])
                            .withParsedValue(['string']))
                ).build();

            const result = emptyObjectSet.complement();

            expect(result.toRepresentations()).toContainRepresentations([
                representationBuilder
                    .withDestinationValues([])
                    .withSourceValue(representationValueBuilder
                        .withPath('.type')
                        .withValue('string'))
                    .withValue('object')
                    .build()
            ]);
        });

        it('should return an empty object set when complementing an all object set', () => {
            const allObjectSet = allObjectSetBuilder.build();

            const result = allObjectSet.complement();

            expect(result.toRepresentations()).toContainRepresentations([]);
            expect(allObjectSet.toRepresentations()).toContainRepresentations(result.complement().toRepresentations());
        });

        describe('some object set', () => {
            it('should return a some object set with complemented properties', () => {
                const someObjectSet = objectSetBuilder
                    .withParsedSchemaKeywords(
                        parsedSchemaKeywordsBuilder
                            .withAdditionalProperties(allJsonSetBuilder
                                .withOrigins([]))
                            .withProperties({
                                name: emptyJsonSetBuilder
                                    .withOrigins([schemaOriginBuilder
                                        .withPath('.properties.name')
                                        .withValue(false)
                                        .withType('source')])
                            })
                            .withType(parsedTypeKeywordBuilder
                                .withOrigins([])
                                .withParsedValue(['object']))
                    ).build();

                const result = someObjectSet.complement();

                const baseNamePropertyRepresentation = representationBuilder
                    .withSourceValue(representationValueBuilder
                        .withValue(false)
                        .withPath('.properties.name'))
                    .withDestinationValues([]);

                const representation = representationBuilder
                    .withSourceValues([])
                    .withDestinationValues([])
                    .withValue('object')
                    .build();

                expect(result.toRepresentations()).toContainRepresentations([
                    baseNamePropertyRepresentation.withValue('boolean').build(),
                    baseNamePropertyRepresentation.withValue('array').build(),
                    baseNamePropertyRepresentation.withValue('integer').build(),
                    baseNamePropertyRepresentation.withValue('null').build(),
                    baseNamePropertyRepresentation.withValue('number').build(),
                    baseNamePropertyRepresentation.withValue('object').build(),
                    baseNamePropertyRepresentation.withValue('string').build(),
                    representation
                ]);
            });

            it('should return a some object set with complemented additional properties', () => {
                const someObjectSet = objectSetBuilder
                    .withParsedSchemaKeywords(
                        parsedSchemaKeywordsBuilder
                            .withAdditionalProperties(emptyJsonSetBuilder
                                .withOrigins([schemaOriginBuilder
                                    .withPath('.additionalProperties')
                                    .withValue(false)
                                    .withType('source')]))
                            .withProperties({
                                name: allJsonSetBuilder
                                    .withOrigins([])
                            })
                            .withType(parsedTypeKeywordBuilder
                                .withOrigins([])
                                .withParsedValue(['object']))
                    ).build();

                const result = someObjectSet.complement();

                const baseAddtionalPropertiesRepresentation = representationBuilder
                    .withSourceValue(representationValueBuilder
                        .withValue(false)
                        .withPath('.additionalProperties'))
                    .withDestinationValues([]);

                const representation = representationBuilder
                    .withSourceValues([])
                    .withDestinationValues([])
                    .withValue('object')
                    .build();

                expect(result.toRepresentations()).toContainRepresentations([
                    baseAddtionalPropertiesRepresentation.withValue('boolean').build(),
                    baseAddtionalPropertiesRepresentation.withValue('array').build(),
                    baseAddtionalPropertiesRepresentation.withValue('integer').build(),
                    baseAddtionalPropertiesRepresentation.withValue('null').build(),
                    baseAddtionalPropertiesRepresentation.withValue('number').build(),
                    baseAddtionalPropertiesRepresentation.withValue('object').build(),
                    baseAddtionalPropertiesRepresentation.withValue('string').build(),
                    representation
                ]);
            });

            it('should return a some object', () => {
                const someObjectSet = objectSetBuilder
                    .withParsedSchemaKeywords(
                        parsedSchemaKeywordsBuilder
                            .withAdditionalProperties(allJsonSetBuilder
                                .withOrigins([]))
                            .withProperties({
                                name: allJsonSetBuilder
                                    .withOrigins([])
                            })
                            .withType(parsedTypeKeywordBuilder
                                .withOrigins([schemaOriginBuilder
                                    .withPath('.type')
                                    .withValue('object')
                                    .withType('source')])
                                .withParsedValue(['object']))
                    ).build();

                const result = someObjectSet.complement();

                const representation = representationBuilder
                    .withSourceValues([representationValueBuilder
                        .withPath('.type')
                        .withValue('object')])
                    .withDestinationValues([])
                    .withValue('object')
                    .build();

                expect(result.toRepresentations()).toContainRepresentations([
                    representation
                ]);
            });

        });
    });
});
