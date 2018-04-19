// this file was generated from https://raw.githubusercontent.com/json-schema-org/json-schema-spec/draft-07/schema.json

export type NonNegativeInteger = number;
export type NonNegativeIntegerDefault0 = NonNegativeInteger;
export type SchemaArray = CoreSchemaMetaSchema[];
export type StringArray = string[];
export type SimpleTypes = 'array' | 'boolean' | 'integer' | 'null' | 'number' | 'object' | 'string';

export interface CoreSchemaMetaSchema {
    $id?: string;
    $schema?: string;
    $ref?: string;
    $comment?: string;
    title?: string;
    description?: string;
    default?: any;
    readOnly?: boolean;
    examples?: any[];
    multipleOf?: number;
    maximum?: number;
    exclusiveMaximum?: number;
    minimum?: number;
    exclusiveMinimum?: number;
    maxLength?: NonNegativeInteger;
    minLength?: NonNegativeIntegerDefault0;
    pattern?: string;
    additionalItems?: CoreSchemaMetaSchema;
    items?: CoreSchemaMetaSchema | SchemaArray;
    maxItems?: NonNegativeInteger;
    minItems?: NonNegativeIntegerDefault0;
    uniqueItems?: boolean;
    contains?: CoreSchemaMetaSchema;
    maxProperties?: NonNegativeInteger;
    minProperties?: NonNegativeIntegerDefault0;
    required?: StringArray;
    additionalProperties?: CoreSchemaMetaSchema;
    definitions?: {
        [k: string]: CoreSchemaMetaSchema;
    };
    properties?: {
        [k: string]: CoreSchemaMetaSchema;
    };
    patternProperties?: {
        [k: string]: CoreSchemaMetaSchema;
    };
    dependencies?: {
        [k: string]: CoreSchemaMetaSchema | StringArray;
    };
    propertyNames?: CoreSchemaMetaSchema;
    const?: any;
    enum?: any[];
    type?: SimpleTypes | SimpleTypes[];
    format?: string;
    contentMediaType?: string;
    contentEncoding?: string;
    if?: CoreSchemaMetaSchema;
    then?: CoreSchemaMetaSchema;
    else?: CoreSchemaMetaSchema;
    allOf?: SchemaArray;
    anyOf?: SchemaArray;
    oneOf?: SchemaArray;
    not?: CoreSchemaMetaSchema;
    [k: string]: any;
}

export type JsonSchema = CoreSchemaMetaSchema | boolean;
