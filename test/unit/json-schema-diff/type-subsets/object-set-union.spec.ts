import {SchemaOriginType} from '../../../../lib/json-schema-diff/parser/json-set/set';
import {
    parsedSchemaKeywordsBuilder
} from '../../support/builders/parsed-schema-keywords/parsed-schema-keywords-builder';
import {parsedTypeKeywordBuilder} from '../../support/builders/parsed-schema-keywords/parsed-type-keyword-builder';
import {schemaOriginBuilder} from '../../support/builders/parsed-schema-keywords/schema-origin-builder';
import {representationBuilder} from '../../support/builders/representation-builder';
import {representationValueBuilder} from '../../support/builders/representation-value-builder';
import {allJsonSetBuilder} from '../../support/builders/sets/all-json-set-builder';
import {EmptyJsonSetBuilder, emptyJsonSetBuilder} from '../../support/builders/sets/empty-json-set-builder';
import {
    allObjectSetBuilder, emptyObjectSetBuilder,
    objectSetBuilder, someObjectSetBuilder
} from '../../support/builders/sets/object-set-builder';
import {someJsonSetBuilder} from '../../support/builders/sets/some-json-set-builder';
import {stringSetBuilder} from '../../support/builders/sets/string-set-builder';
import {customMatchers, CustomMatchers} from '../../support/custom-matchers/custom-matchers';

declare function expect<T>(actual: T): CustomMatchers<T>;

describe('object-set', () => {
    beforeEach(() => {
        jasmine.addMatchers(customMatchers);
    });

    describe('union', () => {
        describe('empty and empty', () => {
            it('should union empty and empty object sets resulting in another empty object set', () => {
                const emptyObjectSetSource = emptyObjectSetBuilder.build();

                const emptyObjectSetDestination = emptyObjectSetBuilder.build();

                const resultObjectSet = emptyObjectSetSource.union(emptyObjectSetDestination);

                expect(resultObjectSet.toRepresentations()).toContainRepresentations([]);
            });

            it('should merge type schema origins when empty and empty object sets are unioned', () => {
                const emptyObjectSetSource = objectSetBuilder
                    .withParsedSchemaKeywords(
                        parsedSchemaKeywordsBuilder
                            .withType(
                                parsedTypeKeywordBuilder
                                    .withParsedValue(['string'])
                                    .withOrigins([
                                        schemaOriginBuilder
                                            .withPath(['type'])
                                            .withType('source')
                                            .withValue('integer')
                                    ])))
                    .build();

                const emptyObjectSetDestination = objectSetBuilder
                    .withParsedSchemaKeywords(
                        parsedSchemaKeywordsBuilder
                            .withType(
                                parsedTypeKeywordBuilder
                                    .withParsedValue(['string'])
                                    .withOrigins([
                                        schemaOriginBuilder
                                            .withPath(['type'])
                                            .withType('destination')
                                            .withValue('string')
                                    ])))
                    .build();

                const resultComplementOfUnion = emptyObjectSetSource.union(emptyObjectSetDestination).complement();

                const representation = representationBuilder
                    .withSourceValue(representationValueBuilder
                        .withPath(['type'])
                        .withValue('integer'))
                    .withDestinationValue(representationValueBuilder
                        .withPath(['type'])
                        .withValue('string'))
                    .withValue('object')
                    .build();

                expect(resultComplementOfUnion.toRepresentations()).toContainRepresentations([representation]);
            });

            it('should ignore additional properties origins when empty and empty object sets are unioned', () => {
                const emptyAdditionalPropertiesWithOriginType = (type: SchemaOriginType): EmptyJsonSetBuilder =>
                    emptyJsonSetBuilder
                        .withOrigins([
                            schemaOriginBuilder
                                .withPath(['additionalProperties'])
                                .withType(type)
                                .withValue(false)]);

                const emptyObjectSetSource = objectSetBuilder
                    .withParsedSchemaKeywords(
                        parsedSchemaKeywordsBuilder
                            .withAdditionalProperties(emptyAdditionalPropertiesWithOriginType('source'))
                            .withType(parsedTypeKeywordBuilder
                                .withParsedValue(['integer'])
                                .withOrigins([])))
                    .build();

                const emptyObjectSetDestination = objectSetBuilder
                    .withParsedSchemaKeywords(
                        parsedSchemaKeywordsBuilder
                            .withAdditionalProperties(emptyAdditionalPropertiesWithOriginType('destination'))
                            .withType(parsedTypeKeywordBuilder
                                .withParsedValue(['string'])
                                .withOrigins([])))
                    .build();

                const resultObjectSet = emptyObjectSetSource.union(emptyObjectSetDestination);

                expect(resultObjectSet.complement().toRepresentations()).toContainRepresentations([
                    representationBuilder
                        .withDestinationValues([])
                        .withSourceValues([])
                        .withValue('object')
                        .build()
                ]);
            });
        });

        describe('all and all', () => {
            it('should union all and all object sets resulting in another all object set', () => {
                const sourceAllObjectSet = objectSetBuilder
                    .withParsedSchemaKeywords(
                        parsedSchemaKeywordsBuilder
                            .withAdditionalProperties(allJsonSetBuilder
                                .withOrigins([]))
                            .withType(parsedTypeKeywordBuilder
                                .withOrigins([])
                                .withParsedValue(['object']))
                    ).build();

                const destinationAllObjectSet = objectSetBuilder
                    .withParsedSchemaKeywords(
                        parsedSchemaKeywordsBuilder
                            .withAdditionalProperties(allJsonSetBuilder
                                .withOrigins([]))
                            .withType(parsedTypeKeywordBuilder
                                .withOrigins([])
                                .withParsedValue(['object']))
                    ).build();

                const resultObjectSet = sourceAllObjectSet.union(destinationAllObjectSet);

                const representation = representationBuilder
                    .withSourceValues([])
                    .withDestinationValues([])
                    .withValue('object')
                    .build();
                expect(resultObjectSet.toRepresentations()).toContainRepresentations([representation]);
            });

            it('should keep track of type schema origins when unioning all and all object sets', () => {
                const sourceAllObjectSet = objectSetBuilder
                    .withParsedSchemaKeywords(
                        parsedSchemaKeywordsBuilder
                            .withAdditionalProperties(allJsonSetBuilder
                                .withOrigins([]))
                            .withType(parsedTypeKeywordBuilder
                                .withOrigins([schemaOriginBuilder
                                    .withPath(['type'])
                                    .withType('source')
                                    .withValue('object')])
                                .withParsedValue(['object']))
                    ).build();

                const destinationAllObjectSet = objectSetBuilder
                    .withParsedSchemaKeywords(
                        parsedSchemaKeywordsBuilder
                            .withAdditionalProperties(allJsonSetBuilder
                                .withOrigins([]))
                            .withType(parsedTypeKeywordBuilder
                                .withOrigins([schemaOriginBuilder
                                    .withPath(['type'])
                                    .withType('destination')
                                    .withValue('object')])
                                .withParsedValue(['object']))
                    ).build();

                const resultObjectSet = sourceAllObjectSet.union(destinationAllObjectSet);

                const representation = representationBuilder
                    .withSourceValues([
                        representationValueBuilder
                            .withValue('object')
                            .withPath(['type'])])
                    .withDestinationValues([
                        representationValueBuilder
                            .withValue('object')
                            .withPath(['type'])])
                    .withValue('object')
                    .build();
                expect(resultObjectSet.toRepresentations()).toContainRepresentations([representation]);
            });
            it('should keep track of additional properties schema origins when unioning all and all object sets',
                () => {
                    const sourceAllObjectSet = objectSetBuilder
                        .withParsedSchemaKeywords(
                            parsedSchemaKeywordsBuilder
                                .withAdditionalProperties(allJsonSetBuilder
                                    .withOrigins([
                                        schemaOriginBuilder
                                            .withPath(['additionalProperties'])
                                            .withType('source')
                                            .withValue(true)
                                    ]))
                                .withType(parsedTypeKeywordBuilder
                                    .withOrigins([])
                                    .withParsedValue(['object']))
                        ).build();

                    const destinationAllObjectSet = objectSetBuilder
                        .withParsedSchemaKeywords(
                            parsedSchemaKeywordsBuilder
                                .withAdditionalProperties(allJsonSetBuilder
                                    .withOrigins([
                                        schemaOriginBuilder
                                            .withPath(['additionalProperties'])
                                            .withType('destination')
                                            .withValue(undefined)
                                    ]))
                                .withType(parsedTypeKeywordBuilder
                                    .withOrigins([])
                                    .withParsedValue(['object']))
                        ).build();

                    const resultObjectSet = sourceAllObjectSet.union(destinationAllObjectSet);

                    const representation = representationBuilder
                        .withSourceValues([
                            representationValueBuilder
                                .withValue(true)
                                .withPath(['additionalProperties'])])
                        .withDestinationValues([
                            representationValueBuilder
                                .withValue(undefined)
                                .withPath(['additionalProperties'])])
                        .withValue('object')
                        .build();
                    expect(resultObjectSet.toRepresentations()).toContainRepresentations([representation]);
                });
        });

        describe('empty and all', () => {
            it('should union empty and all object sets and return all object set', () => {
                const emptyObjectSetSource = objectSetBuilder
                    .withParsedSchemaKeywords(
                        parsedSchemaKeywordsBuilder
                            .withType(
                                parsedTypeKeywordBuilder
                                    .withParsedValue(['string'])
                                    .withOrigins([])))
                    .build();

                const allObjectSetDestination = objectSetBuilder
                    .withParsedSchemaKeywords(
                        parsedSchemaKeywordsBuilder
                            .withAdditionalProperties(allJsonSetBuilder
                                .withOrigins([]))
                            .withType(parsedTypeKeywordBuilder
                                .withOrigins([])
                                .withParsedValue(['object']))
                    ).build();

                const resultObjectSet = emptyObjectSetSource.union(allObjectSetDestination);

                const representation = representationBuilder
                    .withSourceValues([])
                    .withDestinationValues([])
                    .withValue('object')
                    .build();

                expect(resultObjectSet.toRepresentations()).toContainRepresentations([representation]);
            });

            it('should keep track of type schema origins when unioning empty and all object sets', () => {
                const emptyObjectSetSource = objectSetBuilder
                    .withParsedSchemaKeywords(
                        parsedSchemaKeywordsBuilder
                            .withType(
                                parsedTypeKeywordBuilder
                                    .withParsedValue(['string'])
                                    .withOrigins([schemaOriginBuilder
                                        .withType('source')
                                        .withValue('string')
                                        .withPath(['type'])])))
                    .build();

                const allObjectSetDestination = objectSetBuilder
                    .withParsedSchemaKeywords(
                        parsedSchemaKeywordsBuilder
                            .withAdditionalProperties(allJsonSetBuilder
                                .withOrigins([]))
                            .withType(parsedTypeKeywordBuilder
                                .withOrigins([schemaOriginBuilder
                                    .withType('destination')
                                    .withValue('object')
                                    .withPath(['type'])])
                                .withParsedValue(['object']))
                    ).build();

                const resultObjectSet = emptyObjectSetSource.union(allObjectSetDestination);

                const representation = representationBuilder
                    .withSourceValues([representationValueBuilder
                        .withValue('string')
                        .withPath(['type'])])
                    .withDestinationValues([representationValueBuilder
                        .withValue('object')
                        .withPath(['type'])])
                    .withValue('object')
                    .build();

                expect(resultObjectSet.toRepresentations()).toContainRepresentations([representation]);
            });

            it('should keep track of additional properties schema origins when unioning empty and all object sets',
                () => {
                    const emptyObjectSetSource = objectSetBuilder
                        .withParsedSchemaKeywords(
                            parsedSchemaKeywordsBuilder
                                .withType(
                                    parsedTypeKeywordBuilder
                                        .withParsedValue(['string'])
                                        .withOrigins([])))
                        .build();

                    const allObjectSetDestination = objectSetBuilder
                        .withParsedSchemaKeywords(
                            parsedSchemaKeywordsBuilder
                                .withAdditionalProperties(allJsonSetBuilder
                                    .withOrigins([schemaOriginBuilder
                                        .withType('destination')
                                        .withValue(true)
                                        .withPath(['additionalProperties'])]))
                                .withType(parsedTypeKeywordBuilder
                                    .withOrigins([])
                                    .withParsedValue(['object']))
                        ).build();

                    const resultObjectSet = emptyObjectSetSource.union(allObjectSetDestination);

                    const representation = representationBuilder
                        .withSourceValues([])
                        .withDestinationValues([representationValueBuilder
                            .withValue(true)
                            .withPath(['additionalProperties'])])
                        .withValue('object')
                        .build();

                    expect(resultObjectSet.toRepresentations()).toContainRepresentations([representation]);
                });

            it('should return the same result regardless the order of the operands', () => {
                const emptyObjectSet = emptyObjectSetBuilder.build();

                const allObjectSet = allObjectSetBuilder.build();

                const resultAllWithEmpty = allObjectSet.union(emptyObjectSet);
                const resultEmptyWithAll = emptyObjectSet.union(allObjectSet);

                expect(resultAllWithEmpty.toRepresentations())
                    .toContainRepresentations(resultEmptyWithAll.toRepresentations());
            });
        });

        describe('empty and some', () => {
            it('should union empty and some object sets and return some object set', () => {
                const emptyObjectSet = objectSetBuilder
                    .withParsedSchemaKeywords(
                        parsedSchemaKeywordsBuilder
                            .withType(
                                parsedTypeKeywordBuilder
                                    .withParsedValue(['string'])
                                    .withOrigins([])))
                    .build();

                const someObjectSet = objectSetBuilder
                    .withParsedSchemaKeywords(
                        parsedSchemaKeywordsBuilder
                            .withAdditionalProperties(emptyJsonSetBuilder
                                .withOrigins([]))
                            .withProperties({
                                name: emptyJsonSetBuilder
                                    .withOrigins([])
                            })
                            .withType(parsedTypeKeywordBuilder
                                .withOrigins([])
                                .withParsedValue(['object']))
                    ).build();

                const resultObjectSet = emptyObjectSet.union(someObjectSet);

                const representations = representationBuilder
                    .withSourceValues([])
                    .withDestinationValues([])
                    .withValue('object')
                    .build();

                expect(resultObjectSet.toRepresentations()).toContainRepresentations([representations]);

            });

            it('should keep track of type origins when unioning empty and some object sets', () => {
                const emptyObjectSet = objectSetBuilder
                    .withParsedSchemaKeywords(
                        parsedSchemaKeywordsBuilder
                            .withType(
                                parsedTypeKeywordBuilder
                                    .withParsedValue(['string'])
                                    .withOrigins([schemaOriginBuilder
                                        .withPath(['type'])
                                        .withValue('string')
                                        .withType('source')])))
                    .build();

                const someObjectSet = objectSetBuilder
                    .withParsedSchemaKeywords(
                        parsedSchemaKeywordsBuilder
                            .withAdditionalProperties(emptyJsonSetBuilder
                                .withOrigins([]))
                            .withProperties({
                                name: emptyJsonSetBuilder
                                    .withOrigins([])
                            })
                            .withType(parsedTypeKeywordBuilder
                                .withOrigins([schemaOriginBuilder
                                    .withPath(['type'])
                                    .withValue('object')
                                    .withType('destination')])
                                .withParsedValue(['object']))
                    ).build();

                const resultObjectSet = emptyObjectSet.union(someObjectSet);

                const representations = representationBuilder
                    .withSourceValues([representationValueBuilder
                        .withPath(['type'])
                        .withValue('string')])
                    .withDestinationValues([representationValueBuilder
                        .withPath(['type'])
                        .withValue('object')])
                    .withValue('object')
                    .build();

                expect(resultObjectSet.toRepresentations()).toContainRepresentations([representations]);
            });

            it('should keep track of some object set properties origins when unioning with empty', () => {
                const emptyObjectSet = objectSetBuilder
                    .withParsedSchemaKeywords(
                        parsedSchemaKeywordsBuilder
                            .withType(
                                parsedTypeKeywordBuilder
                                    .withParsedValue(['number'])
                                    .withOrigins([schemaOriginBuilder
                                        .withType('source')
                                        .withPath(['type'])
                                        .withValue('number')])))
                    .build();

                const jsonSetOfStrings = someJsonSetBuilder
                    .withStringSet(stringSetBuilder
                        .withParsedSchemaKeywords(
                            parsedSchemaKeywordsBuilder
                                .withType(parsedTypeKeywordBuilder
                                    .withOrigins([schemaOriginBuilder
                                        .withValue('string')
                                        .withPath(['properties', 'name', 'additionalProperties', 'type'])
                                        .withType('destination')])
                                    .withParsedValue(['string']))
                        ));

                const someObjectSet = objectSetBuilder
                    .withParsedSchemaKeywords(
                        parsedSchemaKeywordsBuilder
                            .withAdditionalProperties(emptyJsonSetBuilder
                                .withOrigins([]))
                            .withProperties({
                                name: jsonSetOfStrings
                            })
                            .withType(parsedTypeKeywordBuilder
                                .withOrigins([])
                                .withParsedValue(['object']))
                    ).build();

                const resultObjectSet = emptyObjectSet.union(someObjectSet);

                const expectedSourceValue = representationValueBuilder.withValue('number').withPath(['type']);

                const rootTypeRepresentation = representationBuilder
                    .withSourceValue(expectedSourceValue)
                    .withDestinationValues([])
                    .withValue('object')
                    .build();

                const propertiesRepresentation = representationBuilder
                    .withSourceValue(expectedSourceValue)
                    .withDestinationValue(representationValueBuilder
                        .withValue('string')
                        .withPath(['properties', 'name', 'additionalProperties', 'type']))
                    .withValue('string')
                    .build();

                expect(resultObjectSet.toRepresentations()).toContainRepresentations([
                    rootTypeRepresentation, propertiesRepresentation
                ]);
            });

            it('should keep track of some object set additionalProperties origins when unioning with empty', () => {
                const emptyObjectSet = objectSetBuilder
                    .withParsedSchemaKeywords(
                        parsedSchemaKeywordsBuilder
                            .withType(parsedTypeKeywordBuilder
                                .withOrigins([])
                                .withParsedValue(['string']))
                    ).build();

                const jsonSetOfString = someJsonSetBuilder
                    .withStringSet(stringSetBuilder
                        .withParsedSchemaKeywords(
                            parsedSchemaKeywordsBuilder
                                .withType(parsedTypeKeywordBuilder
                                    .withOrigins([schemaOriginBuilder
                                        .withValue('string')
                                        .withPath(['additionalProperties', 'type'])
                                        .withType('destination')])
                                    .withParsedValue(['string']))
                        ));

                const someObjectSet = objectSetBuilder
                    .withParsedSchemaKeywords(
                        parsedSchemaKeywordsBuilder
                            .withAdditionalProperties(jsonSetOfString)
                            .withProperties({})
                            .withType(parsedTypeKeywordBuilder
                                .withOrigins([])
                                .withParsedValue(['object']))
                    ).build();

                const resultObjectSet = emptyObjectSet.union(someObjectSet);

                const rootTypeRepresentation = representationBuilder
                    .withSourceValues([])
                    .withDestinationValues([])
                    .withValue('object')
                    .build();

                const additionalPropertiesRepresentation = representationBuilder
                    .withSourceValues([])
                    .withDestinationValue(
                        representationValueBuilder
                            .withPath(['additionalProperties', 'type'])
                            .withValue('string'))
                    .withValue('string')
                    .build();

                expect(resultObjectSet.toRepresentations()).toContainRepresentations([
                    rootTypeRepresentation, additionalPropertiesRepresentation
                ]);

            });

            it('should return the same result regardless the order of the operands', () => {
                const emptyObjectSet = emptyObjectSetBuilder.build();

                const someObjectSet = someObjectSetBuilder.build();

                const resultSomeAndEmpty = someObjectSet.union(emptyObjectSet);
                const resultEmptyAndSome = emptyObjectSet.union(someObjectSet);

                expect(resultSomeAndEmpty.toRepresentations())
                    .toContainRepresentations(resultEmptyAndSome.toRepresentations());
            });
        });

        describe('all and some', () => {
            it('should union all and some object sets and return all object set', () => {
                const allObjectSet = objectSetBuilder
                    .withParsedSchemaKeywords(
                        parsedSchemaKeywordsBuilder
                            .withAdditionalProperties(allJsonSetBuilder
                                .withOrigins([]))
                            .withType(parsedTypeKeywordBuilder
                                .withOrigins([])
                                .withParsedValue(['object']))
                    ).build();

                const someObjectSet = objectSetBuilder
                    .withParsedSchemaKeywords(
                        parsedSchemaKeywordsBuilder
                            .withAdditionalProperties(emptyJsonSetBuilder
                                .withOrigins([]))
                            .withProperties({
                                name: emptyJsonSetBuilder
                                    .withOrigins([])
                            })
                            .withType(parsedTypeKeywordBuilder
                                .withOrigins([])
                                .withParsedValue(['object']))
                    ).build();

                const resultObjectSet = allObjectSet.union(someObjectSet);

                const representations = representationBuilder
                    .withSourceValues([])
                    .withDestinationValues([])
                    .withValue('object')
                    .build();

                expect(resultObjectSet.toRepresentations()).toContainRepresentations([representations]);
            });

            it('should keep track of the type schema origins', () => {
                const allObjectSet = objectSetBuilder
                    .withParsedSchemaKeywords(
                        parsedSchemaKeywordsBuilder
                            .withAdditionalProperties(allJsonSetBuilder
                                .withOrigins([]))
                            .withType(parsedTypeKeywordBuilder
                                .withOrigins([schemaOriginBuilder
                                    .withType('source')
                                    .withPath(['type'])
                                    .withValue('object')])
                                .withParsedValue(['object']))
                    ).build();

                const someObjectSet = objectSetBuilder
                    .withParsedSchemaKeywords(
                        parsedSchemaKeywordsBuilder
                            .withAdditionalProperties(emptyJsonSetBuilder
                                .withOrigins([]))
                            .withProperties({
                                name: emptyJsonSetBuilder
                                    .withOrigins([])
                            })
                            .withType(parsedTypeKeywordBuilder
                                .withOrigins([schemaOriginBuilder
                                    .withType('destination')
                                    .withPath(['type'])
                                    .withValue('object')])
                                .withParsedValue(['object']))
                    ).build();

                const resultObjectSet = allObjectSet.union(someObjectSet);

                const representations = representationBuilder
                    .withSourceValue(representationValueBuilder
                        .withPath(['type'])
                        .withValue('object'))
                    .withDestinationValue(representationValueBuilder
                        .withPath(['type'])
                        .withValue('object'))
                    .withValue('object')
                    .build();

                expect(resultObjectSet.toRepresentations()).toContainRepresentations([representations]);
            });

            it('should keep track of additional properties of some and all object sets', () => {
                const allObjectSet = objectSetBuilder
                    .withParsedSchemaKeywords(
                        parsedSchemaKeywordsBuilder
                            .withAdditionalProperties(allJsonSetBuilder
                                .withOrigins([schemaOriginBuilder
                                    .withType('source')
                                    .withPath(['additionalProperties'])
                                    .withValue(true)
                                ]))
                            .withType(parsedTypeKeywordBuilder
                                .withOrigins([])
                                .withParsedValue(['object']))
                    ).build();

                const someObjectSet = objectSetBuilder
                    .withParsedSchemaKeywords(
                        parsedSchemaKeywordsBuilder
                            .withAdditionalProperties(emptyJsonSetBuilder
                                .withOrigins([schemaOriginBuilder
                                    .withType('destination')
                                    .withPath(['additionalProperties'])
                                    .withValue(false)]))
                            .withProperties({
                                name: emptyJsonSetBuilder
                                    .withOrigins([])
                            })
                            .withType(parsedTypeKeywordBuilder
                                .withOrigins([])
                                .withParsedValue(['object']))
                    ).build();

                const resultObjectSet = allObjectSet.union(someObjectSet);

                const representations = representationBuilder
                    .withSourceValue(representationValueBuilder
                        .withPath(['additionalProperties'])
                        .withValue(true))
                    .withDestinationValue(representationValueBuilder
                        .withPath(['additionalProperties'])
                        .withValue(false))
                    .withValue('object')
                    .build();

                expect(resultObjectSet.toRepresentations()).toContainRepresentations([representations]);
            });

            it('should keep track of properties origins of some object set', () => {
                const allObjectSet = objectSetBuilder
                    .withParsedSchemaKeywords(
                        parsedSchemaKeywordsBuilder
                            .withAdditionalProperties(allJsonSetBuilder
                                .withOrigins([]))
                            .withType(parsedTypeKeywordBuilder
                                .withOrigins([])
                                .withParsedValue(['object']))
                    ).build();

                const someObjectSet = objectSetBuilder
                    .withParsedSchemaKeywords(
                        parsedSchemaKeywordsBuilder
                            .withAdditionalProperties(emptyJsonSetBuilder
                                .withOrigins([]))
                            .withProperties({
                                name: emptyJsonSetBuilder
                                    .withOrigins([schemaOriginBuilder
                                        .withType('destination')
                                        .withPath(['properties', 'name'])
                                        .withValue(false)
                                    ])
                            })
                            .withType(parsedTypeKeywordBuilder
                                .withOrigins([])
                                .withParsedValue(['object']))
                    ).build();

                const resultObjectSet = allObjectSet.union(someObjectSet);

                const representations = representationBuilder
                    .withSourceValues([])
                    .withDestinationValue(representationValueBuilder
                        .withPath(['properties', 'name'])
                        .withValue(false))
                    .withValue('object')
                    .build();

                expect(resultObjectSet.toRepresentations()).toContainRepresentations([representations]);
            });

            it('should return the same result regardless the order of the operands', () => {
                const allObjectSet = allObjectSetBuilder.build();

                const someObjectSet = someObjectSetBuilder.build();

                const resultSomeAndAll = someObjectSet.union(allObjectSet);
                const resultAllAndSome = allObjectSet.union(someObjectSet);

                expect(resultSomeAndAll.toRepresentations())
                    .toContainRepresentations(resultAllAndSome.toRepresentations());
            });
        });

        describe('some and some', () => {
            it('should track type schema origins when some and some object sets are unioned', () => {
                const firstSomeObjectSet = objectSetBuilder
                    .withParsedSchemaKeywords(
                        parsedSchemaKeywordsBuilder
                            .withProperties({
                                name: emptyJsonSetBuilder
                                    .withOrigins([])
                            })
                            .withType(parsedTypeKeywordBuilder
                                .withOrigins([schemaOriginBuilder
                                    .withType('source')
                                    .withValue('object')
                                    .withPath(['type'])])
                                .withParsedValue(['object']))
                    ).build();

                const secondSomeObjectSet = objectSetBuilder
                    .withParsedSchemaKeywords(
                        parsedSchemaKeywordsBuilder
                            .withProperties({
                                name: emptyJsonSetBuilder
                                    .withOrigins([])
                            })
                            .withType(parsedTypeKeywordBuilder
                                .withOrigins([schemaOriginBuilder
                                    .withType('destination')
                                    .withValue('object')
                                    .withPath(['type'])])
                                .withParsedValue(['object']))
                    ).build();

                const result = firstSomeObjectSet.union(secondSomeObjectSet);

                const representation = representationBuilder
                    .withSourceValue(representationValueBuilder
                        .withValue('object')
                        .withPath(['type']))
                    .withDestinationValue(representationValueBuilder
                        .withValue('object')
                        .withPath(['type']))
                    .withValue('object')
                    .build();

                expect(result.toRepresentations()).toContainRepresentations([representation]);
            });

            it('should track additionalProperties origins when some and some object sets are unioned', () => {
                const firstSomeObjectSet = objectSetBuilder
                    .withParsedSchemaKeywords(
                        parsedSchemaKeywordsBuilder
                            .withAdditionalProperties(emptyJsonSetBuilder
                                .withOrigins([schemaOriginBuilder
                                    .withPath(['additionalProperties'])
                                    .withValue(false)
                                    .withType('source')]))
                            .withProperties({
                                name: emptyJsonSetBuilder
                                    .withOrigins([])
                            })
                            .withType(parsedTypeKeywordBuilder
                                .withOrigins([])
                                .withParsedValue(['object']))
                    ).build();

                const secondSomeObjectSet = objectSetBuilder
                    .withParsedSchemaKeywords(
                        parsedSchemaKeywordsBuilder
                            .withAdditionalProperties(allJsonSetBuilder
                                .withOrigins([schemaOriginBuilder
                                    .withPath(['additionalProperties'])
                                    .withValue(true)
                                    .withType('destination')]))
                            .withProperties({
                                name: emptyJsonSetBuilder
                                    .withOrigins([])
                            })
                            .withType(parsedTypeKeywordBuilder
                                .withOrigins([])
                                .withParsedValue(['object']))
                    ).build();

                const result = firstSomeObjectSet.union(secondSomeObjectSet);

                const rootTypeRepresentation = representationBuilder
                    .withSourceValues([])
                    .withDestinationValues([])
                    .withValue('object')
                    .build();

                const baseAdditionalPropertiesRepresentation = representationBuilder
                    .withSourceValue(representationValueBuilder
                        .withPath(['additionalProperties'])
                        .withValue(false))
                    .withDestinationValue(representationValueBuilder
                        .withPath(['additionalProperties'])
                        .withValue(true));

                expect(result.toRepresentations()).toContainRepresentations([
                    baseAdditionalPropertiesRepresentation.withValue('array').build(),
                    baseAdditionalPropertiesRepresentation.withValue('boolean').build(),
                    baseAdditionalPropertiesRepresentation.withValue('integer').build(),
                    baseAdditionalPropertiesRepresentation.withValue('number').build(),
                    baseAdditionalPropertiesRepresentation.withValue('null').build(),
                    baseAdditionalPropertiesRepresentation.withValue('string').build(),
                    baseAdditionalPropertiesRepresentation.withValue('object').build(),
                    rootTypeRepresentation
                ]);
            });

            it('should union same properties and track its origins when some and some object sets are unioned',
                () => {
                    const firstSomeObjectSet = objectSetBuilder
                        .withParsedSchemaKeywords(
                            parsedSchemaKeywordsBuilder
                                .withAdditionalProperties(
                                    emptyJsonSetBuilder
                                        .withOrigins([]))
                                .withProperties({
                                    name: emptyJsonSetBuilder
                                        .withOrigins([schemaOriginBuilder
                                            .withPath(['properties', 'name'])
                                            .withValue(false)
                                            .withType('source')])
                                })
                                .withType(parsedTypeKeywordBuilder
                                    .withOrigins([])
                                    .withParsedValue(['object']))
                        ).build();

                    const secondSomeObjectSet = objectSetBuilder
                        .withParsedSchemaKeywords(
                            parsedSchemaKeywordsBuilder
                                .withAdditionalProperties(emptyJsonSetBuilder
                                    .withOrigins([]))
                                .withProperties({
                                    name: allJsonSetBuilder
                                        .withOrigins([schemaOriginBuilder
                                            .withPath(['properties', 'name'])
                                            .withValue(true)
                                            .withType('destination')])
                                })
                                .withType(parsedTypeKeywordBuilder
                                    .withOrigins([])
                                    .withParsedValue(['object']))
                        ).build();

                    const result = firstSomeObjectSet.union(secondSomeObjectSet);

                    const basePropertyNameRepresentation = representationBuilder
                        .withSourceValue(representationValueBuilder
                            .withPath(['properties', 'name'])
                            .withValue(false))
                        .withDestinationValue(representationValueBuilder
                            .withPath(['properties', 'name'])
                            .withValue(true));

                    const rootTypeRepresentation = representationBuilder
                        .withSourceValues([])
                        .withDestinationValues([])
                        .withValue('object')
                        .build();

                    expect(result.toRepresentations()).toContainRepresentations([
                        basePropertyNameRepresentation.withValue('array').build(),
                        basePropertyNameRepresentation.withValue('boolean').build(),
                        basePropertyNameRepresentation.withValue('integer').build(),
                        basePropertyNameRepresentation.withValue('number').build(),
                        basePropertyNameRepresentation.withValue('null').build(),
                        basePropertyNameRepresentation.withValue('string').build(),
                        basePropertyNameRepresentation.withValue('object').build(),
                        rootTypeRepresentation
                    ]);
                });

            it('should union source schema properties with destination additional properties, ' +
                'if they are missing in destination schema', () => {
                const firstSomeObjectSet = objectSetBuilder
                    .withParsedSchemaKeywords(
                        parsedSchemaKeywordsBuilder
                            .withAdditionalProperties(emptyJsonSetBuilder
                                .withOrigins([]))
                            .withProperties({
                                lastName: emptyJsonSetBuilder,
                                propertyMissingInDestination: allJsonSetBuilder
                                    .withOrigins([schemaOriginBuilder
                                        .withValue(true)
                                        .withPath(['properties', 'propertyMissingInDestination'])
                                        .withType('source')])
                            })
                            .withType(parsedTypeKeywordBuilder
                                .withOrigins([])
                                .withParsedValue(['object']))
                    ).build();

                const jsonSetOfStrings = someJsonSetBuilder
                    .withStringSet(stringSetBuilder
                        .withParsedSchemaKeywords(
                            parsedSchemaKeywordsBuilder
                                .withType(parsedTypeKeywordBuilder
                                    .withOrigins([schemaOriginBuilder
                                        .withValue('string')
                                        .withPath(['additionalProperties', 'type'])
                                        .withType('destination')])
                                    .withParsedValue(['string']))
                        ));
                const secondSomeObjectSet = objectSetBuilder
                    .withParsedSchemaKeywords(
                        parsedSchemaKeywordsBuilder
                            .withAdditionalProperties(jsonSetOfStrings)
                            .withProperties({
                                lastName: emptyJsonSetBuilder
                            })
                            .withType(parsedTypeKeywordBuilder
                                .withOrigins([])
                                .withParsedValue(['object']))
                    ).build();

                const result = firstSomeObjectSet.union(secondSomeObjectSet);

                const baseMissingPropertyRepresentation = representationBuilder
                    .withSourceValue(representationValueBuilder
                        .withPath(['properties', 'propertyMissingInDestination'])
                        .withValue(true))
                    .withDestinationValue(representationValueBuilder
                        .withPath(['additionalProperties', 'type'])
                        .withValue('string'));

                const additionalPropertiesRepresentation = representationBuilder
                    .withSourceValues([])
                    .withDestinationValue(representationValueBuilder
                        .withPath(['additionalProperties', 'type'])
                        .withValue('string'))
                    .withValue('string')
                    .build();

                const rootTypeRepresentation = representationBuilder
                    .withSourceValues([])
                    .withDestinationValues([])
                    .withValue('object')
                    .build();

                expect(result.toRepresentations()).toContainRepresentations([
                    baseMissingPropertyRepresentation.withValue('array').build(),
                    baseMissingPropertyRepresentation.withValue('boolean').build(),
                    baseMissingPropertyRepresentation.withValue('integer').build(),
                    baseMissingPropertyRepresentation.withValue('number').build(),
                    baseMissingPropertyRepresentation.withValue('null').build(),
                    baseMissingPropertyRepresentation.withValue('string').build(),
                    baseMissingPropertyRepresentation.withValue('object').build(),
                    rootTypeRepresentation,
                    additionalPropertiesRepresentation
                ]);
            });

            it('should union destination schema properties with source additional properties, ' +
                'if they are missing in source schema', () => {
                const jsonSetOfStrings = someJsonSetBuilder
                    .withStringSet(stringSetBuilder
                        .withParsedSchemaKeywords(
                            parsedSchemaKeywordsBuilder
                                .withType(parsedTypeKeywordBuilder
                                    .withOrigins([schemaOriginBuilder
                                        .withValue('string')
                                        .withPath(['additionalProperties', 'type'])
                                        .withType('source')])
                                    .withParsedValue(['string']))
                        ));

                const firstSomeObjectSet = objectSetBuilder
                    .withParsedSchemaKeywords(
                        parsedSchemaKeywordsBuilder
                            .withAdditionalProperties(jsonSetOfStrings)
                            .withProperties({
                                lastName: emptyJsonSetBuilder.withOrigins([])
                            })
                            .withType(parsedTypeKeywordBuilder
                                .withOrigins([])
                                .withParsedValue(['object']))
                    ).build();

                const secondSomeObjectSet = objectSetBuilder
                    .withParsedSchemaKeywords(
                        parsedSchemaKeywordsBuilder
                            .withAdditionalProperties(emptyJsonSetBuilder.withOrigins([]))
                            .withProperties({
                                lastName: emptyJsonSetBuilder,
                                propertyMissingInSource: allJsonSetBuilder
                                    .withOrigins([schemaOriginBuilder
                                        .withValue(true)
                                        .withPath(['properties', 'propertyMissingInSource'])
                                        .withType('destination')])
                            })
                            .withType(parsedTypeKeywordBuilder
                                .withOrigins([])
                                .withParsedValue(['object']))
                    ).build();

                const result = firstSomeObjectSet.union(secondSomeObjectSet);

                const baseMissingPropertyRepresentation = representationBuilder
                    .withSourceValue(representationValueBuilder
                        .withPath(['additionalProperties', 'type'])
                        .withValue('string'))
                    .withDestinationValue(representationValueBuilder
                        .withPath(['properties', 'propertyMissingInSource'])
                        .withValue(true));

                const additionalPropertiesRepresentation = representationBuilder
                    .withSourceValue(representationValueBuilder
                        .withPath(['additionalProperties', 'type'])
                        .withValue('string'))
                    .withDestinationValues([])
                    .withValue('string')
                    .build();

                const rootTypeRepresentation = representationBuilder
                    .withSourceValues([])
                    .withDestinationValues([])
                    .withValue('object')
                    .build();

                expect(result.toRepresentations()).toContainRepresentations([
                    baseMissingPropertyRepresentation.withValue('array').build(),
                    baseMissingPropertyRepresentation.withValue('boolean').build(),
                    baseMissingPropertyRepresentation.withValue('integer').build(),
                    baseMissingPropertyRepresentation.withValue('number').build(),
                    baseMissingPropertyRepresentation.withValue('null').build(),
                    baseMissingPropertyRepresentation.withValue('string').build(),
                    baseMissingPropertyRepresentation.withValue('object').build(),
                    rootTypeRepresentation,
                    additionalPropertiesRepresentation
                ]);
            });
        });
    });
});
