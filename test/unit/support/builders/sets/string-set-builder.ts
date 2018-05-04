import {createStringSet} from '../../../../../lib/json-schema-diff/parser/json-set/json-subset/string-set';
import {Set} from '../../../../../lib/json-schema-diff/parser/json-set/set';
import {
    parsedSchemaKeywordsBuilder,
    ParsedSchemaKeywordsBuilder
} from '../parsed-schema-keywords/parsed-schema-keywords-builder';
import {parsedTypeKeywordBuilder} from '../parsed-schema-keywords/parsed-type-keyword-builder';
import {SchemaOriginBuilder, schemaOriginBuilder} from '../parsed-schema-keywords/schema-origin-builder';

export class StringSetBuilder {
    public static defaultStringSetBuilder(): StringSetBuilder {
        return new StringSetBuilder(parsedSchemaKeywordsBuilder);
    }

    private constructor(private readonly parsedSchemaKeywords: ParsedSchemaKeywordsBuilder) {}

    public withParsedSchemaKeywords(parsedSchemaKeywords: ParsedSchemaKeywordsBuilder): StringSetBuilder {
        return new StringSetBuilder(parsedSchemaKeywords);
    }

    public build(): Set<'string'> {
        return createStringSet(this.parsedSchemaKeywords.build());
    }
}

export const stringSetBuilder = StringSetBuilder.defaultStringSetBuilder();

export const createAllStringSetWithOrigins = (origins: SchemaOriginBuilder[]): StringSetBuilder =>
    stringSetBuilder.withParsedSchemaKeywords(parsedSchemaKeywordsBuilder
        .withType(parsedTypeKeywordBuilder.withOrigins(origins).withParsedValue(['string'])));

export const createEmptyStringSetWithOrigins = (origins: SchemaOriginBuilder[]): StringSetBuilder =>
    stringSetBuilder.withParsedSchemaKeywords(parsedSchemaKeywordsBuilder
        .withType(parsedTypeKeywordBuilder.withOrigins(origins).withParsedValue(['number'])));

export const emptyStringSetBuilder = createEmptyStringSetWithOrigins([
    schemaOriginBuilder.withPath('.type').withValue('number')
]);

export const allStringSetBuilder = createAllStringSetWithOrigins([
    schemaOriginBuilder.withPath('.type').withValue('string')
]);
