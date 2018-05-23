import {JsonSchema, SimpleTypes} from '../../../lib/json-schema-diff/parser/json-set/json-schema';
import {diffResultDifferenceBuilder} from '../support/builders/diff-result-difference-builder';
import {
    diffResultDifferenceValueBuilder
} from '../support/builders/diff-result-difference-value-builder';
import {customMatchers, CustomMatchers} from '../support/custom-matchers/custom-matchers';
import {invokeDiff, invokeDiffAndExpectToFail} from '../support/invoke-diff';

declare function expect<T>(actual: T): CustomMatchers<T>;

describe('differ', () => {
    beforeEach(() => {
        jasmine.addMatchers(customMatchers);
    });

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
                        .withPath('.type')
                        .withValue(['string'])
                )
                .withSourceValue(
                    diffResultDifferenceValueBuilder
                        .withPath('.type')
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
                        .withPath('.type')
                        .withValue(['number', 'array'])
                )
                .withSourceValue(
                    diffResultDifferenceValueBuilder
                        .withPath('.type')
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
                        .withPath('.type')
                        .withValue(['number', 'boolean'])
                )
                .withSourceValue(
                    diffResultDifferenceValueBuilder
                        .withPath('.type')
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
                        .withPath('.type')
                        .withValue(['number', 'integer'])
                )
                .withSourceValue(
                    diffResultDifferenceValueBuilder
                        .withPath('.type')
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
                        .withPath('.type')
                        .withValue(['number', 'null'])
                )
                .withSourceValue(
                    diffResultDifferenceValueBuilder
                        .withPath('.type')
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
                        .withPath('.type')
                        .withValue(['string', 'number'])
                )
                .withSourceValue(
                    diffResultDifferenceValueBuilder
                        .withPath('.type')
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
                .withDestinationValues([
                    diffResultDifferenceValueBuilder
                        .withPath('.type')
                        .withValue(['number', 'object']),
                    diffResultDifferenceValueBuilder
                        .withPath('.additionalProperties')
                        .withValue(undefined)
                ])
                .withSourceValue(
                    diffResultDifferenceValueBuilder
                        .withPath('.type')
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
                        .withPath('.type')
                        .withValue(['number', 'string'])
                )
                .withSourceValue(
                    diffResultDifferenceValueBuilder
                        .withPath('.type')
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
                        .withPath('.type')
                        .withValue('string')
                )
                .withSourceValue(
                    diffResultDifferenceValueBuilder
                        .withPath('.type')
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

        it('should find multiple differences when multiple types are removed', async () => {
            const sourceSchema: JsonSchema = {type: ['number', 'string', 'boolean']};
            const destinationsSchema: JsonSchema = {type: ['number']};

            const diffResult = await invokeDiff(sourceSchema, destinationsSchema);

            const differenceBuilder = diffResultDifferenceBuilder
                .withDestinationValue(
                    diffResultDifferenceValueBuilder
                        .withPath('.type')
                        .withValue(['number'])
                )
                .withSourceValue(
                    diffResultDifferenceValueBuilder
                        .withPath('.type')
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

        it('should find multiple differences when multiple types are added', async () => {
            const sourceSchema: JsonSchema = {type: ['number']};
            const destinationsSchema: JsonSchema = {type: ['number', 'string', 'boolean']};

            const diffResult = await invokeDiff(sourceSchema, destinationsSchema);

            const differenceBuilder = diffResultDifferenceBuilder
                .withDestinationValue(
                    diffResultDifferenceValueBuilder
                        .withPath('.type')
                        .withValue(['number', 'string', 'boolean'])
                )
                .withSourceValue(
                    diffResultDifferenceValueBuilder
                        .withPath('.type')
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
                        .withPath('.type')
                        .withValue(['integer', 'number', 'object', 'null', 'boolean', 'array'])
                )
                .withSourceValue(
                    diffResultDifferenceValueBuilder
                        .withPath('.type')
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
                        .withPath('.allOf[1].type')
                        .withValue(['string', 'boolean']),
                    diffResultDifferenceValueBuilder
                        .withPath('.allOf[0].type')
                        .withValue(['string', 'number']),
                    diffResultDifferenceValueBuilder
                        .withPath('.type')
                        .withValue(undefined)
                ])
                .withSourceValues([
                    diffResultDifferenceValueBuilder
                        .withPath('.allOf[0].type')
                        .withValue(['string', 'number']),
                    diffResultDifferenceValueBuilder
                        .withPath('.type')
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
                not: {type: 'string'}
            };
            const destinationSchema: JsonSchema = {
                not: {type: 'number'}
            };

            const diffResult = await invokeDiff(sourceSchema, destinationSchema);

            const baseDifference = diffResultDifferenceBuilder
                .withSourceValues([
                    diffResultDifferenceValueBuilder
                        .withPath('.not.type')
                        .withValue('string'),
                    diffResultDifferenceValueBuilder
                        .withPath('.type')
                        .withValue(undefined)
                ])
                .withDestinationValues([
                    diffResultDifferenceValueBuilder
                        .withPath('.not.type')
                        .withValue('number'),
                    diffResultDifferenceValueBuilder
                        .withPath('.type')
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

    describe('anyOf', () => {
        it('should find an add and a remove difference inside an anyOf', async () => {
            const sourceSchema: JsonSchema = {
                anyOf: [
                    {type: 'string'},
                    {type: 'number'}
                ]
            };
            const destinationSchema: JsonSchema = {
                anyOf: [
                    {type: 'string'},
                    {type: 'boolean'}
                ]
            };

            const diffResult = await invokeDiff(sourceSchema, destinationSchema);

            const baseDifferenceBuilder = diffResultDifferenceBuilder
                .withSourceValues([
                    diffResultDifferenceValueBuilder
                        .withValue(undefined)
                        .withPath('.type'),
                    diffResultDifferenceValueBuilder
                        .withValue('string')
                        .withPath('.anyOf[0].type'),
                    diffResultDifferenceValueBuilder
                        .withValue('number')
                        .withPath('.anyOf[1].type')
                ])
                .withDestinationValues([
                    diffResultDifferenceValueBuilder
                        .withValue(undefined)
                        .withPath('.type'),
                    diffResultDifferenceValueBuilder
                        .withValue('string')
                        .withPath('.anyOf[0].type'),
                    diffResultDifferenceValueBuilder
                        .withValue('boolean')
                        .withPath('.anyOf[1].type')]);

            const addDifference = baseDifferenceBuilder
                .withTypeAddType()
                .withValue('boolean')
                .build();

            const removeDifference = baseDifferenceBuilder
                .withTypeRemoveType()
                .withValue('number')
                .build();

            expect(diffResult).toContainDifferences([addDifference, removeDifference]);
        });
    });

    describe('keyword combination', () => {
        it('should find an add and remove differences for a schema with all the keywords', async () => {
            const sourceSchema: JsonSchema = {
                allOf: [
                    {type: 'number'},
                    {type: ['number', 'array']}
                ],
                anyOf: [
                    {type: 'number'},
                    {not: {type: 'array'}}
                ]
            };
            const destinationSchema: JsonSchema = {
                allOf: [
                    {type: 'string'},
                    {type: ['string', 'array']}
                ],
                anyOf: [
                    {type: 'string'},
                    {not: {type: 'array'}}
                ]
            };

            const diffResult = await invokeDiff(sourceSchema, destinationSchema);

            const baseDifference = diffResultDifferenceBuilder
                .withSourceValues([
                    diffResultDifferenceValueBuilder
                        .withPath('.allOf[0].type')
                        .withValue('number'),
                    diffResultDifferenceValueBuilder
                        .withPath('.allOf[1].type')
                        .withValue(['number', 'array']),
                    diffResultDifferenceValueBuilder
                        .withPath('.anyOf[0].type')
                        .withValue('number'),
                    diffResultDifferenceValueBuilder
                        .withPath('.anyOf[1].type')
                        .withValue(undefined),
                    diffResultDifferenceValueBuilder
                        .withPath('.anyOf[1].not.type')
                        .withValue('array'),
                    diffResultDifferenceValueBuilder
                        .withPath('.type')
                        .withValue(undefined)
                ])
                .withDestinationValues([
                    diffResultDifferenceValueBuilder
                        .withPath('.allOf[0].type')
                        .withValue('string'),
                    diffResultDifferenceValueBuilder
                        .withPath('.allOf[1].type')
                        .withValue(['string', 'array']),
                    diffResultDifferenceValueBuilder
                        .withPath('.anyOf[0].type')
                        .withValue('string'),
                    diffResultDifferenceValueBuilder
                        .withPath('.anyOf[1].type')
                        .withValue(undefined),
                    diffResultDifferenceValueBuilder
                        .withPath('.anyOf[1].not.type')
                        .withValue('array'),
                    diffResultDifferenceValueBuilder
                        .withPath('.type')
                        .withValue(undefined)
                ]);

            const addedDifference = baseDifference
                .withTypeAddType()
                .withValue('string')
                .build();

            const removedDifference = baseDifference
                .withTypeRemoveType()
                .withValue('number')
                .build();

            expect(diffResult).toContainDifferences([addedDifference, removedDifference]);

        });

        it('should find no differences with two equivalent schemas using nested boolean schemas', async () => {
            const sourceSchema: JsonSchema = {
                not: {
                    anyOf: [
                        false,
                        true
                    ]
                }
            };

            const destinationSchema: JsonSchema = false;

            const diffResult = await invokeDiff(sourceSchema, destinationSchema);
            expect(diffResult).toContainDifferences([]);
        });
    });

    describe('schema as boolean', () => {
        it('should find an add difference when schema is changed to true', async () => {
            const allTypesButObject: SimpleTypes[] = ['string', 'array', 'number', 'integer', 'boolean', 'null'];
            const sourceSchema: JsonSchema = {
                type: allTypesButObject
            };
            const destinationSchema: JsonSchema = true;

            const diffResult = await invokeDiff(sourceSchema, destinationSchema);

            const addDifference = diffResultDifferenceBuilder
                .withSourceValue(
                    diffResultDifferenceValueBuilder
                        .withPath('.type')
                        .withValue(['string', 'array', 'number', 'integer', 'boolean', 'null'])
                )
                .withDestinationValue(
                    diffResultDifferenceValueBuilder
                        .withValue(true)
                        .withPath('')
                )
                .withValue('object')
                .withTypeAddType()
                .build();

            expect(diffResult).toContainDifferences([addDifference]);
        });

        it('should find a remove difference when schema is changed to false', async () => {
            const sourceSchema: JsonSchema = {type: 'integer'};
            const destinationSchema: JsonSchema = false;

            const diffResult = await invokeDiff(sourceSchema, destinationSchema);

            const removeDifference = diffResultDifferenceBuilder
                .withSourceValue(
                    diffResultDifferenceValueBuilder
                        .withValue('integer')
                        .withPath('.type'))
                .withDestinationValue(
                    diffResultDifferenceValueBuilder
                        .withValue(false)
                        .withPath(''))
                .withTypeRemoveType()
                .withValue('integer')
                .build();

            expect(diffResult).toContainDifferences([removeDifference]);
        });
    });

    describe('object type', () => {
        it('should find an add and a remove differences when changing properties type', async () => {
            const sourceSchema: JsonSchema = {
                properties: {
                    name: {type: 'array'}
                },
                type: 'object'
            };
            const destinationSchema: JsonSchema = {
                properties: {
                    name: {type: 'string'}
                },
                type: 'object'
            };

            const diffResult = await invokeDiff(sourceSchema, destinationSchema);

            const baseDifference = diffResultDifferenceBuilder
                .withSourceValues([
                    diffResultDifferenceValueBuilder
                        .withValue('array')
                        .withPath('.properties.name.type')])
                .withDestinationValues([
                    diffResultDifferenceValueBuilder
                        .withValue('string')
                        .withPath('.properties.name.type')]);

            const removeDifference = baseDifference
                .withTypeRemoveType()
                .withValue('array')
                .build();

            const addDifference = baseDifference
                .withTypeAddType()
                .withValue('string')
                .build();
            expect(diffResult).toContainDifferences([removeDifference, addDifference]);
        });

        it('should find a difference between schemas with boolean additional properties', async () => {
            const sourceSchema: JsonSchema = {
                additionalProperties: true,
                type: 'object'
            };
            const destinationSchema: JsonSchema = {
                additionalProperties: false,
                type: 'object'
            };

            const diffResult = await invokeDiff(sourceSchema, destinationSchema);

            const baseRemovedDifference = diffResultDifferenceBuilder
                .withSourceValues([
                    diffResultDifferenceValueBuilder
                        .withValue('object')
                        .withPath('.type'),
                    diffResultDifferenceValueBuilder
                        .withValue(true)
                        .withPath('.additionalProperties')
                ])
                .withDestinationValues([
                    diffResultDifferenceValueBuilder
                        .withValue('object')
                        .withPath('.type'),
                    diffResultDifferenceValueBuilder
                        .withValue(false)
                        .withPath('.additionalProperties')
                ])
                .withTypeRemoveType();
            expect(diffResult).toContainDifferences([
                baseRemovedDifference.withValue('array').build(),
                baseRemovedDifference.withValue('boolean').build(),
                baseRemovedDifference.withValue('integer').build(),
                baseRemovedDifference.withValue('null').build(),
                baseRemovedDifference.withValue('number').build(),
                baseRemovedDifference.withValue('object').build(),
                baseRemovedDifference.withValue('string').build()
            ]);
        });
    });

    describe('references', () => {
        it('should follow references in source schema when detecting differences', async () => {
            const sourceSchema: JsonSchema = {
                definitions: {
                    basic_type: {
                        type: 'string'
                    }
                },
                properties: {
                    id: {
                        $ref: '#/definitions/basic_type'
                    }
                },
                type: 'object'
            };
            const destinationSchema: JsonSchema = {
                properties: {
                    id: {
                        type: 'number'
                    }
                },
                type: 'object'
            };

            const diffResult = await invokeDiff(sourceSchema, destinationSchema);

            const removeDifference = diffResultDifferenceBuilder
                .withSourceValue(
                    diffResultDifferenceValueBuilder
                        .withValue('string')
                        .withPath('.properties.id.type'))
                .withDestinationValue(
                    diffResultDifferenceValueBuilder
                        .withValue('number')
                        .withPath('.properties.id.type'))
                .withTypeRemoveType()
                .withValue('string')
                .build();

            const addDifference = diffResultDifferenceBuilder
                .withSourceValue(
                    diffResultDifferenceValueBuilder
                        .withValue('string')
                        .withPath('.properties.id.type'))
                .withDestinationValue(
                    diffResultDifferenceValueBuilder
                        .withValue('number')
                        .withPath('.properties.id.type'))
                .withTypeAddType()
                .withValue('number')
                .build();

            expect(diffResult).toContainDifferences([removeDifference, addDifference]);
        });

        it('should follow references in destination schema when detecting differences', async () => {
            const sourceSchema: JsonSchema = {
                properties: {
                    id: {
                        type: 'string'
                    }
                },
                type: 'object'
            };
            const destinationSchema: JsonSchema = {
                definitions: {
                    basic_type: {
                        type: 'number'
                    }
                },
                properties: {
                    id: {
                        $ref: '#/definitions/basic_type'
                    }
                },
                type: 'object'
            };

            const diffResult = await invokeDiff(sourceSchema, destinationSchema);

            const removeDifference = diffResultDifferenceBuilder
                .withSourceValue(
                    diffResultDifferenceValueBuilder
                        .withValue('string')
                        .withPath('.properties.id.type'))
                .withDestinationValue(
                    diffResultDifferenceValueBuilder
                        .withValue('number')
                        .withPath('.properties.id.type'))
                .withTypeRemoveType()
                .withValue('string')
                .build();

            const addDifference = diffResultDifferenceBuilder
                .withSourceValue(
                    diffResultDifferenceValueBuilder
                        .withValue('string')
                        .withPath('.properties.id.type'))
                .withDestinationValue(
                    diffResultDifferenceValueBuilder
                        .withValue('number')
                        .withPath('.properties.id.type'))
                .withTypeAddType()
                .withValue('number')
                .build();

            expect(diffResult).toContainDifferences([removeDifference, addDifference]);
        });

        it('should follow nested references', async () => {
            const sourceSchema: JsonSchema = {
                definitions: {
                    basic_object: {
                        properties: {
                            content: {
                                $ref: '#/definitions/basic_type'
                            }
                        },
                        type: 'object'
                    },
                    basic_type: {
                        type: 'string'
                    }
                },
                properties: {
                    id: {
                        $ref: '#/definitions/basic_object'
                    }
                },
                type: 'object'
            };
            const destinationSchema: JsonSchema = {
                definitions: {
                    basic_object: {
                        properties: {
                            content: {
                                $ref: '#/definitions/basic_type'
                            }
                        },
                        type: 'object'
                    },
                    basic_type: {
                        type: 'number'
                    }
                },
                properties: {
                    id: {
                        $ref: '#/definitions/basic_object'
                    }
                },
                type: 'object'
            };

            const diffResult = await invokeDiff(sourceSchema, destinationSchema);

            const removeDifference = diffResultDifferenceBuilder
                .withSourceValue(
                    diffResultDifferenceValueBuilder
                        .withValue('string')
                        .withPath('.properties.id.properties.content.type'))
                .withDestinationValue(
                    diffResultDifferenceValueBuilder
                        .withValue('number')
                        .withPath('.properties.id.properties.content.type'))
                .withTypeRemoveType()
                .withValue('string')
                .build();

            const addDifference = diffResultDifferenceBuilder
                .withSourceValue(
                    diffResultDifferenceValueBuilder
                        .withValue('string')
                        .withPath('.properties.id.properties.content.type'))
                .withDestinationValue(
                    diffResultDifferenceValueBuilder
                        .withValue('number')
                        .withPath('.properties.id.properties.content.type'))
                .withTypeAddType()
                .withValue('number')
                .build();

            expect(diffResult).toContainDifferences([removeDifference, addDifference]);
        });
    });
});
