import {createNullSet} from '../../../../../lib/json-schema-diff/parser/json-set/json-subset/null-set';
import {Set} from '../../../../../lib/json-schema-diff/parser/json-set/set';
import {
    parsedSchemaKeywordsBuilder,
    ParsedSchemaKeywordsBuilder
} from '../parsed-schema-keywords/parsed-schema-keywords-builder';
import {parsedTypeKeywordBuilder} from '../parsed-schema-keywords/parsed-type-keyword-builder';
import {SchemaOriginBuilder, schemaOriginBuilder} from '../parsed-schema-keywords/schema-origin-builder';

export class NullSetBuilder {
    public static defaultNullSetBuilder(): NullSetBuilder {
        return new NullSetBuilder(parsedSchemaKeywordsBuilder);
    }

    private constructor(private readonly parsedSchemaKeywords: ParsedSchemaKeywordsBuilder) {}

    public withParsedSchemaKeywords(parsedSchemaKeywords: ParsedSchemaKeywordsBuilder): NullSetBuilder {
        return new NullSetBuilder(parsedSchemaKeywords);
    }

    public build(): Set<'null'> {
        return createNullSet(this.parsedSchemaKeywords.build());
    }
}

export const nullSetBuilder = NullSetBuilder.defaultNullSetBuilder();

export const createEmptyNullSetWithOrigins = (origins: SchemaOriginBuilder[]): NullSetBuilder =>
    nullSetBuilder.withParsedSchemaKeywords(parsedSchemaKeywordsBuilder
        .withType(parsedTypeKeywordBuilder.withOrigins(origins).withParsedValue(['string'])));

export const createAllNullSetWithOrigins = (origins: SchemaOriginBuilder[]): NullSetBuilder =>
    nullSetBuilder.withParsedSchemaKeywords(parsedSchemaKeywordsBuilder
        .withType(parsedTypeKeywordBuilder.withOrigins(origins).withParsedValue(['null'])));

export const emptyNullSetBuilder = createEmptyNullSetWithOrigins([
    schemaOriginBuilder
        .withPath(['type'])
        .withValue('string')
]);

export const allNullSetBuilder = createAllNullSetWithOrigins([
    schemaOriginBuilder
        .withPath(['type'])
        .withValue('null')
]);
