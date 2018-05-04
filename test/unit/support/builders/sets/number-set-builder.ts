import {createNumberSet} from '../../../../../lib/json-schema-diff/parser/json-set/json-subset/number-set';
import {Set} from '../../../../../lib/json-schema-diff/parser/json-set/set';
import {
    parsedSchemaKeywordsBuilder,
    ParsedSchemaKeywordsBuilder
} from '../parsed-schema-keywords/parsed-schema-keywords-builder';
import {parsedTypeKeywordBuilder} from '../parsed-schema-keywords/parsed-type-keyword-builder';
import {SchemaOriginBuilder, schemaOriginBuilder} from '../parsed-schema-keywords/schema-origin-builder';

export class NumberSetBuilder {
    public static defaultNumberSetBuilder(): NumberSetBuilder {
        return new NumberSetBuilder(parsedSchemaKeywordsBuilder);
    }

    private constructor(private readonly parsedSchemaKeywords: ParsedSchemaKeywordsBuilder) {}

    public withParsedSchemaKeywords(parsedSchemaKeywords: ParsedSchemaKeywordsBuilder): NumberSetBuilder {
        return new NumberSetBuilder(parsedSchemaKeywords);
    }

    public build(): Set<'number'> {
        return createNumberSet(this.parsedSchemaKeywords.build());
    }
}

export const numberSetBuilder = NumberSetBuilder.defaultNumberSetBuilder();

export const createEmptyNumberSetWithOrigins = (origins: SchemaOriginBuilder[]): NumberSetBuilder =>
    numberSetBuilder.withParsedSchemaKeywords(parsedSchemaKeywordsBuilder
        .withType(parsedTypeKeywordBuilder.withOrigins(origins).withParsedValue(['string'])));

export const createAllNumberSetWithOrigins = (origins: SchemaOriginBuilder[]): NumberSetBuilder =>
    numberSetBuilder.withParsedSchemaKeywords(parsedSchemaKeywordsBuilder
        .withType(parsedTypeKeywordBuilder.withOrigins(origins).withParsedValue(['number'])));

export const emptyNumberSetBuilder = createEmptyNumberSetWithOrigins(
    [schemaOriginBuilder
        .withPath('.type')
        .withValue('string')
]);

export const allNumberSetBuilder = createAllNumberSetWithOrigins([
    schemaOriginBuilder
    .withPath('.type')
    .withValue('number')
]);
