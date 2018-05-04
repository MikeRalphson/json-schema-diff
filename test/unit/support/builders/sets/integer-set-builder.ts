import {createIntegerSet} from '../../../../../lib/json-schema-diff/parser/json-set/json-subset/integer-set';
import {Set} from '../../../../../lib/json-schema-diff/parser/json-set/set';
import {
    parsedSchemaKeywordsBuilder,
    ParsedSchemaKeywordsBuilder
} from '../parsed-schema-keywords/parsed-schema-keywords-builder';
import {parsedTypeKeywordBuilder} from '../parsed-schema-keywords/parsed-type-keyword-builder';
import {SchemaOriginBuilder, schemaOriginBuilder} from '../parsed-schema-keywords/schema-origin-builder';

export class IntegerSetBuilder {
    public static defaultIntegerSetBuilder(): IntegerSetBuilder {
        return new IntegerSetBuilder(parsedSchemaKeywordsBuilder);
    }

    private constructor(private readonly parsedSchemaKeywords: ParsedSchemaKeywordsBuilder) {}

    public withParsedSchemaKeywords(parsedSchemaKeywords: ParsedSchemaKeywordsBuilder): IntegerSetBuilder {
        return new IntegerSetBuilder(parsedSchemaKeywords);
    }

    public build(): Set<'integer'> {
        return createIntegerSet(this.parsedSchemaKeywords.build());
    }
}

export const integerSetBuilder = IntegerSetBuilder.defaultIntegerSetBuilder();

export const createEmptyIntegerSetWithOrigins = (origins: SchemaOriginBuilder[]): IntegerSetBuilder =>
    integerSetBuilder.withParsedSchemaKeywords(parsedSchemaKeywordsBuilder
        .withType(parsedTypeKeywordBuilder.withOrigins(origins).withParsedValue(['string'])));

export const createAllIntegerSetWithOrigins = (origins: SchemaOriginBuilder[]): IntegerSetBuilder =>
    integerSetBuilder.withParsedSchemaKeywords(parsedSchemaKeywordsBuilder
        .withType(parsedTypeKeywordBuilder.withOrigins(origins).withParsedValue(['integer'])));

export const emptyIntegerSetBuilder = createEmptyIntegerSetWithOrigins([
    schemaOriginBuilder.withPath('.type').withValue('string')
]);

export const allIntegerSetBuilder = createAllIntegerSetWithOrigins([
    schemaOriginBuilder.withPath('.type').withValue('integer')
]);
