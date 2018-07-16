import {createBooleanSet} from '../../../../../lib/json-schema-diff/parser/json-set/json-subset/boolean-set';
import {Set} from '../../../../../lib/json-schema-diff/parser/json-set/set';
import {
    parsedSchemaKeywordsBuilder,
    ParsedSchemaKeywordsBuilder
} from '../parsed-schema-keywords/parsed-schema-keywords-builder';
import {parsedTypeKeywordBuilder} from '../parsed-schema-keywords/parsed-type-keyword-builder';
import {SchemaOriginBuilder, schemaOriginBuilder} from '../parsed-schema-keywords/schema-origin-builder';

export class BooleanSetBuilder {
    public static defaultBooleanSetBuilder(): BooleanSetBuilder {
        return new BooleanSetBuilder(parsedSchemaKeywordsBuilder);
    }

    private constructor(private readonly parsedSchemaKeywords: ParsedSchemaKeywordsBuilder) {}

    public withParsedSchemaKeywords(parsedSchemaKeywords: ParsedSchemaKeywordsBuilder): BooleanSetBuilder {
        return new BooleanSetBuilder(parsedSchemaKeywords);
    }

    public build(): Set<'boolean'> {
        return createBooleanSet(this.parsedSchemaKeywords.build());
    }
}

export const booleanSetBuilder = BooleanSetBuilder.defaultBooleanSetBuilder();

export const createEmptyBooleanSetWithOrigins = (origins: SchemaOriginBuilder[]): BooleanSetBuilder =>
    booleanSetBuilder.withParsedSchemaKeywords(parsedSchemaKeywordsBuilder
        .withType(parsedTypeKeywordBuilder.withOrigins(origins).withParsedValue(['string'])));

export const createAllBooleanSetWithOrigins = (origins: SchemaOriginBuilder[]): BooleanSetBuilder =>
    booleanSetBuilder.withParsedSchemaKeywords(parsedSchemaKeywordsBuilder
        .withType(parsedTypeKeywordBuilder.withOrigins(origins).withParsedValue(['boolean'])));

export const emptyBooleanSetBuilder = createEmptyBooleanSetWithOrigins([
    schemaOriginBuilder
        .withPath(['type'])
        .withValue('string')
]);

export const allBooleanSetBuilder = createAllBooleanSetWithOrigins([
    schemaOriginBuilder
        .withPath(['type'])
        .withValue('boolean')
]);
