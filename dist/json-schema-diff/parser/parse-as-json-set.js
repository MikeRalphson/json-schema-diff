"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
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
    return parseSubsets(schema, location);
};
const parseBooleanSchema = (schema, location) => {
    const schemaOrigins = [{
            path: location.path,
            type: location.schemaOriginType,
            value: schema
        }];
    const schemaValue = util_1.isUndefined(schema) ? true : schema;
    return schemaValue ? json_set_1.createAllJsonSet(schemaOrigins) : json_set_1.createEmptyJsonSet(schemaOrigins);
};
const parseWithLocation = (schema, location) => {
    return (util_1.isBoolean(schema) || util_1.isUndefined(schema))
        ? parseBooleanSchema(schema, location)
        : parseCoreSchemaMetaSchema(schema, location);
};
exports.parseAsJsonSet = (schema, originType) => {
    return parseWithLocation(schema, schema_location_1.SchemaLocation.createRoot(originType));
};
