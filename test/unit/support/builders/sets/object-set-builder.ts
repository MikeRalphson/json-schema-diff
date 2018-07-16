import {createObjectSet} from '../../../../../lib/json-schema-diff/parser/json-set/json-subset/object-set';
import {Set} from '../../../../../lib/json-schema-diff/parser/json-set/set';
import {
    parsedSchemaKeywordsBuilder,
    ParsedSchemaKeywordsBuilder
} from '../parsed-schema-keywords/parsed-schema-keywords-builder';
import {parsedTypeKeywordBuilder} from '../parsed-schema-keywords/parsed-type-keyword-builder';
import {SchemaOriginBuilder, schemaOriginBuilder} from '../parsed-schema-keywords/schema-origin-builder';
import {allJsonSetBuilder} from './all-json-set-builder';
import {emptyJsonSetBuilder} from './empty-json-set-builder';

export class ObjectSetBuilder {
    public static defaultObjectSetBuilder(): ObjectSetBuilder {
        return new ObjectSetBuilder(parsedSchemaKeywordsBuilder);
    }

    private constructor(private readonly parsedSchemaKeywords: ParsedSchemaKeywordsBuilder) {}

    public withParsedSchemaKeywords(parsedSchemaKeywords: ParsedSchemaKeywordsBuilder): ObjectSetBuilder {
        return new ObjectSetBuilder(parsedSchemaKeywords);
    }

    public build(): Set<'object'> {
        return createObjectSet(this.parsedSchemaKeywords.build());
    }
}

export const objectSetBuilder = ObjectSetBuilder.defaultObjectSetBuilder();

export const createAllObjectSetWithOrigins = (origins: SchemaOriginBuilder[]): ObjectSetBuilder =>
    objectSetBuilder.withParsedSchemaKeywords(parsedSchemaKeywordsBuilder
        .withType(parsedTypeKeywordBuilder.withOrigins(origins).withParsedValue(['object']))
        .withAdditionalProperties(allJsonSetBuilder.withOrigins([])));

export const createEmptyObjectSetWithOrigins = (origins: SchemaOriginBuilder[]): ObjectSetBuilder =>
    objectSetBuilder.withParsedSchemaKeywords(parsedSchemaKeywordsBuilder
        .withType(parsedTypeKeywordBuilder.withOrigins(origins).withParsedValue(['string'])));

export const emptyObjectSetBuilder = objectSetBuilder
    .withParsedSchemaKeywords(
        parsedSchemaKeywordsBuilder
            .withType(parsedTypeKeywordBuilder
                .withOrigins([schemaOriginBuilder
                    .withPath(['type'])
                    .withValue('string')])
                .withParsedValue(['string'])));

export const allObjectSetBuilder = objectSetBuilder
    .withParsedSchemaKeywords(
        parsedSchemaKeywordsBuilder
            .withAdditionalProperties(allJsonSetBuilder
                .withOrigins([
                    schemaOriginBuilder
                        .withPath(['additionalProperties'])
                        .withValue(undefined)
                ]))
            .withType(parsedTypeKeywordBuilder
                .withOrigins([schemaOriginBuilder
                    .withPath(['type'])
                    .withValue('object')])
                .withParsedValue(['object'])));

export const someObjectSetBuilder = objectSetBuilder
    .withParsedSchemaKeywords(
        parsedSchemaKeywordsBuilder
            .withAdditionalProperties(emptyJsonSetBuilder
                .withOrigins([
                    schemaOriginBuilder
                        .withValue(false)
                        .withPath(['additionalProperties'])]))
            .withProperties({
                name: allJsonSetBuilder
                    .withOrigins([
                        schemaOriginBuilder
                            .withValue(true)
                            .withPath(['properties', 'name'])])
            })
            .withType(parsedTypeKeywordBuilder
                .withOrigins([schemaOriginBuilder
                    .withPath(['type'])
                    .withValue('object')])
                .withParsedValue(['object'])));
