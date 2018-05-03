"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const json_schema_set_1 = require("./json-schema-set");
const array_set_1 = require("./json-schema-set/array-set");
const boolean_set_1 = require("./json-schema-set/boolean-set");
const integer_set_1 = require("./json-schema-set/integer-set");
const null_set_1 = require("./json-schema-set/null-set");
const number_set_1 = require("./json-schema-set/number-set");
const object_set_1 = require("./json-schema-set/object-set");
const string_set_1 = require("./json-schema-set/string-set");
const toSimpleTypeArray = (type) => {
    if (!type) {
        return ['string', 'number', 'boolean', 'integer', 'array', 'object', 'null'];
    }
    if (typeof type === 'string') {
        return [type];
    }
    return type;
};
const parseAsArraySet = (types, schemaOrigins) => types.indexOf('array') >= 0 ? new array_set_1.AllArraySet(schemaOrigins) : new array_set_1.EmptyArraySet(schemaOrigins);
const parseAsBooleanSet = (types, schemaOrigins) => types.indexOf('boolean') >= 0 ? new boolean_set_1.AllBooleanSet(schemaOrigins) : new boolean_set_1.EmptyBooleanSet(schemaOrigins);
const parseAsIntegerSet = (types, schemaOrigins) => types.indexOf('integer') >= 0 ? new integer_set_1.AllIntegerSet(schemaOrigins) : new integer_set_1.EmptyIntegerSet(schemaOrigins);
const parseAsNumberSet = (types, schemaOrigins) => types.indexOf('number') >= 0 ? new number_set_1.AllNumberSet(schemaOrigins) : new number_set_1.EmptyNumberSet(schemaOrigins);
const parseAsNullSet = (types, schemaOrigins) => types.indexOf('null') >= 0 ? new null_set_1.AllNullSet(schemaOrigins) : new null_set_1.EmptyNullSet(schemaOrigins);
const parseAsObjectSet = (types, schemaOrigins) => types.indexOf('object') >= 0 ? new object_set_1.AllObjectSet(schemaOrigins) : new object_set_1.EmptyObjectSet(schemaOrigins);
const parseAsStringSet = (types, schemaOrigins) => types.indexOf('string') >= 0 ? new string_set_1.AllStringSet(schemaOrigins) : new string_set_1.EmptyStringSet(schemaOrigins);
const parseSubsets = (schema, originType, location) => {
    const types = toSimpleTypeArray(schema.type);
    const schemaOrigins = [{
            location: `${location}.type`,
            type: originType,
            value: schema.type
        }];
    const arraySet = parseAsArraySet(types, schemaOrigins);
    const booleanSet = parseAsBooleanSet(types, schemaOrigins);
    const integerSet = parseAsIntegerSet(types, schemaOrigins);
    const numberSet = parseAsNumberSet(types, schemaOrigins);
    const nullSet = parseAsNullSet(types, schemaOrigins);
    const objectSet = parseAsObjectSet(types, schemaOrigins);
    const stringSet = parseAsStringSet(types, schemaOrigins);
    return new json_schema_set_1.JsonSchemaSet(arraySet, booleanSet, integerSet, numberSet, nullSet, objectSet, stringSet);
};
const parseAllOf = (allOfSchemas, origin, location, initialJsonSchemaSet) => {
    let jsonSchemaSetResult = initialJsonSchemaSet;
    for (let i = 0; i < allOfSchemas.length; i += 1) {
        const currentJsonSchemaSet = parseWithLocation(allOfSchemas[i], origin, `${location}.allOf[${i}]`);
        jsonSchemaSetResult = jsonSchemaSetResult.intersect(currentJsonSchemaSet);
    }
    return jsonSchemaSetResult;
};
const parseAnyOf = (anyOfSchemas, origin, location, initialJsonSchemaSet) => {
    let jsonSchemaSetResult = parseWithLocation(anyOfSchemas[0], origin, `${location}.anyOf[0]`);
    for (let i = 1; i < anyOfSchemas.length; i += 1) {
        const currentJsonSchemaSet = parseWithLocation(anyOfSchemas[i], origin, `${location}.anyOf[${i}]`);
        jsonSchemaSetResult = jsonSchemaSetResult.union(currentJsonSchemaSet);
    }
    jsonSchemaSetResult = jsonSchemaSetResult.intersect(initialJsonSchemaSet);
    return jsonSchemaSetResult;
};
const parseNot = (notSchema, origin, location, initialJsonSchemaSet) => {
    const parsedNotJsonSchemaSet = parseWithLocation(notSchema, origin, `${location}.not`);
    const complementedNotJsonSchemaSet = parsedNotJsonSchemaSet.complement();
    return complementedNotJsonSchemaSet.intersect(initialJsonSchemaSet);
};
const parseWithLocation = (schema, origin, location) => {
    let jsonSchemaSet = parseSubsets(schema, origin, location);
    if (schema.allOf) {
        jsonSchemaSet = parseAllOf(schema.allOf, origin, location, jsonSchemaSet);
    }
    if (schema.anyOf) {
        jsonSchemaSet = parseAnyOf(schema.anyOf, origin, location, jsonSchemaSet);
    }
    if (schema.not) {
        jsonSchemaSet = parseNot(schema.not, origin, location, jsonSchemaSet);
    }
    return jsonSchemaSet;
};
exports.parseAsJsonSchemaSet = (schema, origin) => {
    return parseWithLocation(schema, origin, '');
};
