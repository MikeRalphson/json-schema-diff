import {createArraySet} from '../../../../../lib/json-schema-diff/parser/json-set/json-subset/array-set';
import {Set} from '../../../../../lib/json-schema-diff/parser/json-set/set';
import {
    parsedSchemaKeywordsBuilder,
    ParsedSchemaKeywordsBuilder
} from '../parsed-schema-keywords/parsed-schema-keywords-builder';
import {parsedTypeKeywordBuilder} from '../parsed-schema-keywords/parsed-type-keyword-builder';
import {SchemaOriginBuilder, schemaOriginBuilder} from '../parsed-schema-keywords/schema-origin-builder';

export class ArraySetBuilder {
    public static defaultArraySetBuilder(): ArraySetBuilder {
        return new ArraySetBuilder(parsedSchemaKeywordsBuilder);
    }

    private constructor(private readonly parsedSchemaKeywords: ParsedSchemaKeywordsBuilder) {}

    public withParsedSchemaKeywords(parsedSchemaKeywords: ParsedSchemaKeywordsBuilder): ArraySetBuilder {
        return new ArraySetBuilder(parsedSchemaKeywords);
    }

    public build(): Set<'array'> {
        return createArraySet(this.parsedSchemaKeywords.build());
    }
}

export const arraySetBuilder = ArraySetBuilder.defaultArraySetBuilder();

export const createEmptyArraySetWithOrigins = (origins: SchemaOriginBuilder[]): ArraySetBuilder =>
    arraySetBuilder.withParsedSchemaKeywords(parsedSchemaKeywordsBuilder
        .withType(parsedTypeKeywordBuilder.withOrigins(origins).withParsedValue(['string'])));

export const createAllArraySetWithOrigins = (origins: SchemaOriginBuilder[]): ArraySetBuilder =>
    arraySetBuilder.withParsedSchemaKeywords(parsedSchemaKeywordsBuilder
        .withType(parsedTypeKeywordBuilder.withOrigins(origins).withParsedValue(['array'])));

export const emptyArraySetBuilder = createEmptyArraySetWithOrigins([
    schemaOriginBuilder
        .withPath(['type'])
        .withValue('string')
]);

export const allArraySetBuilder = createAllArraySetWithOrigins([
    schemaOriginBuilder
        .withPath(['type'])
        .withValue('array')
]);
