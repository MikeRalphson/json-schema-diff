import {CoreSchemaMetaSchema, JsonSchema, SimpleTypes} from './json-schema';
import {JsonSchemaSet} from './json-schema-set';
import {AllArraySet, ArraySet, EmptyArraySet} from './json-schema-set/array-set';
import {AllBooleanSet, BooleanSet, EmptyBooleanSet} from './json-schema-set/boolean-set';
import {AllIntegerSet, EmptyIntegerSet, IntegerSet} from './json-schema-set/integer-set';
import {AllNullSet, EmptyNullSet, NullSet} from './json-schema-set/null-set';
import {AllNumberSet, EmptyNumberSet, NumberSet} from './json-schema-set/number-set';
import {AllObjectSet, EmptyObjectSet, ObjectSet} from './json-schema-set/object-set';
import {SchemaOrigin, SchemaOriginType} from './json-schema-set/set';
import {AllStringSet, EmptyStringSet, StringSet} from './json-schema-set/string-set';

const allSchemaTypes: SimpleTypes[] = ['string', 'number', 'boolean', 'integer', 'array', 'object', 'null'];
const emptySchemaTypes: SimpleTypes[] = [];

const toSimpleTypeArray = (type?: SimpleTypes | SimpleTypes[]): SimpleTypes[] => {
    if (!type) {
        return allSchemaTypes;
    }

    if (typeof type === 'string') {
        return [type];
    }

    return type;
};

const parseAsArraySet = (types: SimpleTypes[], schemaOrigins: SchemaOrigin[]): ArraySet =>
    types.indexOf('array') >= 0 ? new AllArraySet(schemaOrigins) : new EmptyArraySet(schemaOrigins);

const parseAsBooleanSet = (types: SimpleTypes[], schemaOrigins: SchemaOrigin[]): BooleanSet =>
    types.indexOf('boolean') >= 0 ? new AllBooleanSet(schemaOrigins) : new EmptyBooleanSet(schemaOrigins);

const parseAsIntegerSet = (types: SimpleTypes[], schemaOrigins: SchemaOrigin[]): IntegerSet =>
    types.indexOf('integer') >= 0 ? new AllIntegerSet(schemaOrigins) : new EmptyIntegerSet(schemaOrigins);

const parseAsNumberSet = (types: SimpleTypes[], schemaOrigins: SchemaOrigin[]): NumberSet =>
    types.indexOf('number') >= 0 ? new AllNumberSet(schemaOrigins) : new EmptyNumberSet(schemaOrigins);

const parseAsNullSet = (types: SimpleTypes[], schemaOrigins: SchemaOrigin[]): NullSet =>
    types.indexOf('null') >= 0 ? new AllNullSet(schemaOrigins) : new EmptyNullSet(schemaOrigins);

const parseAsObjectSet = (types: SimpleTypes[], schemaOrigins: SchemaOrigin[]): ObjectSet =>
    types.indexOf('object') >= 0 ? new AllObjectSet(schemaOrigins) : new EmptyObjectSet(schemaOrigins);

const parseAsStringSet = (types: SimpleTypes[], schemaOrigins: SchemaOrigin[]): StringSet =>
    types.indexOf('string') >= 0 ? new AllStringSet(schemaOrigins) : new EmptyStringSet(schemaOrigins);

const createJsonSchemaSet = (types: SimpleTypes[], schemaOrigins: SchemaOrigin[]): JsonSchemaSet => {
    const arraySet = parseAsArraySet(types, schemaOrigins);
    const booleanSet = parseAsBooleanSet(types, schemaOrigins);
    const integerSet = parseAsIntegerSet(types, schemaOrigins);
    const numberSet = parseAsNumberSet(types, schemaOrigins);
    const nullSet = parseAsNullSet(types, schemaOrigins);
    const objectSet = parseAsObjectSet(types, schemaOrigins);
    const stringSet = parseAsStringSet(types, schemaOrigins);

    return new JsonSchemaSet(arraySet, booleanSet, integerSet, numberSet, nullSet, objectSet, stringSet);
};

const parseAllOf = (allOfSchemas: JsonSchema[],
                    origin: SchemaOriginType,
                    location: string,
                    initialJsonSchemaSet: JsonSchemaSet): JsonSchemaSet => {
    let jsonSchemaSetResult = initialJsonSchemaSet;

    for (let i = 0; i < allOfSchemas.length; i += 1) {
        const currentJsonSchemaSet =
            parseWithLocation(allOfSchemas[i], origin, `${location}.allOf[${i}]`);
        jsonSchemaSetResult = jsonSchemaSetResult.intersect(currentJsonSchemaSet);
    }

    return jsonSchemaSetResult;
};

const parseAnyOf = (anyOfSchemas: JsonSchema[],
                    origin: SchemaOriginType,
                    location: string,
                    initialJsonSchemaSet: JsonSchemaSet): JsonSchemaSet => {
    let jsonSchemaSetResult = parseWithLocation(anyOfSchemas[0], origin, `${location}.anyOf[0]`);

    for (let i = 1; i < anyOfSchemas.length; i += 1) {
        const currentJsonSchemaSet = parseWithLocation(anyOfSchemas[i], origin, `${location}.anyOf[${i}]`);
        jsonSchemaSetResult = jsonSchemaSetResult.union(currentJsonSchemaSet);
    }

    jsonSchemaSetResult = jsonSchemaSetResult.intersect(initialJsonSchemaSet);

    return jsonSchemaSetResult;
};

const parseNot = (notSchema: JsonSchema,
                  origin: SchemaOriginType,
                  location: string,
                  initialJsonSchemaSet: JsonSchemaSet): JsonSchemaSet => {
    const parsedNotJsonSchemaSet = parseWithLocation(notSchema, origin, `${location}.not`);
    const complementedNotJsonSchemaSet = parsedNotJsonSchemaSet.complement();
    return complementedNotJsonSchemaSet.intersect(initialJsonSchemaSet);
};

const parseSubsets = (schema: CoreSchemaMetaSchema,
                      originType: SchemaOriginType,
                      location: string): JsonSchemaSet => {
    const types = toSimpleTypeArray(schema.type);

    const schemaOrigins = [{
        location: `${location}.type`,
        type: originType,
        value: schema.type
    }];

    return createJsonSchemaSet(types, schemaOrigins);
};

const parseCoreSchemaMetaSchema = (schema: CoreSchemaMetaSchema,
                                   originType: SchemaOriginType,
                                   location: string): JsonSchemaSet => {
    let jsonSchemaSet = parseSubsets(schema, originType, location);
    if (schema.allOf) {
        jsonSchemaSet = parseAllOf(schema.allOf, originType, location, jsonSchemaSet);
    }
    if (schema.anyOf) {
        jsonSchemaSet = parseAnyOf(schema.anyOf, originType, location, jsonSchemaSet);
    }
    if (schema.not) {
        jsonSchemaSet = parseNot(schema.not, originType, location, jsonSchemaSet);
    }
    return jsonSchemaSet;
};

const parseBooleanSchema = (schema: boolean,
                            originType: SchemaOriginType,
                            location: string): JsonSchemaSet => {
    const types = schema ? allSchemaTypes : emptySchemaTypes;

    const schemaOrigins = [{
        location,
        type: originType,
        value: schema
    }];

    return createJsonSchemaSet(types, schemaOrigins);
};

const parseWithLocation = (schema: JsonSchema,
                           originType: SchemaOriginType,
                           location: string): JsonSchemaSet => {

    return (typeof schema === 'boolean')
        ? parseBooleanSchema(schema, originType, location)
        : parseCoreSchemaMetaSchema(schema, originType, location);
};

export const parseAsJsonSchemaSet = (schema: JsonSchema, originType: SchemaOriginType): JsonSchemaSet => {
    return parseWithLocation(schema, originType, '');
};
