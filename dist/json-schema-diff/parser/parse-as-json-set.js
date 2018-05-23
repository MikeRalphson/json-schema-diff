"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const json_set_1 = require("./json-set/json-set");
const create_json_set_1 = require("./json-set/json-subset/create-json-set");
const set_1 = require("./json-set/set");
const schema_location_1 = require("./schema-location");
const toSimpleTypeArray = (type) => {
    if (!type) {
        return set_1.allSchemaTypes;
    }
    if (typeof type === 'string') {
        return [type];
    }
    return type;
};
const parseAllOf = (allOfSchemas, location, initialJsonSet) => {
    let jsonSetResult = initialJsonSet;
    for (let i = 0; i < allOfSchemas.length; i += 1) {
        const allOfLocation = location.child(`allOf[${i}]`);
        const currentJsonSet = parseWithLocation(allOfSchemas[i], allOfLocation);
        jsonSetResult = jsonSetResult.intersect(currentJsonSet);
    }
    return jsonSetResult;
};
const parseAnyOf = (anyOfSchemas, location, initialJsonSet) => {
    let jsonSetResult = parseWithLocation(anyOfSchemas[0], location.child('anyOf[0]'));
    for (let i = 1; i < anyOfSchemas.length; i += 1) {
        const currentJsonSet = parseWithLocation(anyOfSchemas[i], location.child(`anyOf[${i}]`));
        jsonSetResult = jsonSetResult.union(currentJsonSet);
    }
    jsonSetResult = jsonSetResult.intersect(initialJsonSet);
    return jsonSetResult;
};
const parseNot = (notSchema, location, initialJsonSet) => {
    const notLocation = location.child('not');
    const parsedNotJsonSet = parseWithLocation(notSchema, notLocation);
    const complementedNotJsonSet = parsedNotJsonSet.complement();
    return complementedNotJsonSet.intersect(initialJsonSet);
};
const parseSchemaProperties = (schema, location) => {
    const objectSetProperties = {};
    if (schema.properties) {
        for (const propertyName of Object.keys(schema.properties)) {
            const propertySchema = schema.properties[propertyName];
            const propertyLocation = location.child(`properties.${propertyName}`);
            objectSetProperties[propertyName] = parseWithLocation(propertySchema, propertyLocation);
        }
    }
    return objectSetProperties;
};
const parseType = (schema, location) => {
    const types = toSimpleTypeArray(schema.type);
    const schemaOrigins = [{
            path: `${location.path}.type`,
            type: location.schemaOriginType,
            value: schema.type
        }];
    return { parsedValue: types, origins: schemaOrigins };
};
const parseSubsets = (schema, location) => {
    const type = parseType(schema, location);
    let additionalProperties = parseWithLocation(schema.additionalProperties, location.child('additionalProperties'));
    additionalProperties = additionalProperties.withAdditionalOrigins(type.origins);
    const parsedSchemaKeywords = {
        additionalProperties,
        properties: parseSchemaProperties(schema, location),
        type
    };
    return create_json_set_1.createJsonSet(parsedSchemaKeywords);
};
const parseCoreSchemaMetaSchema = (schema, location) => {
    let jsonSet = parseSubsets(schema, location);
    if (schema.allOf) {
        jsonSet = parseAllOf(schema.allOf, location, jsonSet);
    }
    if (schema.anyOf) {
        jsonSet = parseAnyOf(schema.anyOf, location, jsonSet);
    }
    if (schema.not) {
        jsonSet = parseNot(schema.not, location, jsonSet);
    }
    return jsonSet;
};
const parseBooleanSchema = (schema, location) => {
    const schemaOrigins = [{
            path: location.path,
            type: location.schemaOriginType,
            value: schema
        }];
    const schemaValue = schema === undefined ? true : schema;
    return schemaValue ? json_set_1.createAllJsonSet(schemaOrigins) : json_set_1.createEmptyJsonSet(schemaOrigins);
};
const parseWithLocation = (schema, location) => {
    return (typeof schema === 'boolean' || schema === undefined)
        ? parseBooleanSchema(schema, location)
        : parseCoreSchemaMetaSchema(schema, location);
};
exports.parseAsJsonSet = (schema, originType) => {
    return parseWithLocation(schema, schema_location_1.SchemaLocation.createRoot(originType));
};
