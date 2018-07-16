import {isBoolean, isUndefined} from 'util';
import {CoreSchemaMetaSchema, JsonSchema, SimpleTypes} from './json-set/json-schema';
import {createAllJsonSet, createEmptyJsonSet} from './json-set/json-set';
import {createJsonSet} from './json-set/json-subset/create-json-set';
import {
    allSchemaTypes,
    ParsedPropertiesKeyword,
    ParsedSchemaKeywords,
    ParsedTypeKeyword,
    SchemaOrigin,
    SchemaOriginType, Set
} from './json-set/set';
import {SchemaLocation} from './schema-location';

const toSimpleTypeArray = (type?: SimpleTypes | SimpleTypes[]): SimpleTypes[] => {
    if (!type) {
        return allSchemaTypes;
    }

    if (typeof type === 'string') {
        return [type];
    }

    return type;
};

const parseSchemaProperties = (schema: CoreSchemaMetaSchema,
                               location: SchemaLocation): ParsedPropertiesKeyword => {
    const objectSetProperties: ParsedPropertiesKeyword = {};

    if (schema.properties) {
        const propertiesLocation = location.child('properties');
        for (const propertyName of Object.keys(schema.properties)) {
            const propertySchema = schema.properties[propertyName];
            const propertyLocation = propertiesLocation.child(propertyName);
            objectSetProperties[propertyName] = parseWithLocation(propertySchema, propertyLocation);
        }
    }
    return objectSetProperties;
};

const parseType = (schema: CoreSchemaMetaSchema,
                   location: SchemaLocation): ParsedTypeKeyword => {
    const types = toSimpleTypeArray(schema.type);

    const schemaOrigins = [{
        path: location.child('type').path,
        type: location.schemaOriginType,
        value: schema.type
    }];

    return {parsedValue: types, origins: schemaOrigins};
};

const parseSubsets = (schema: CoreSchemaMetaSchema,
                      location: SchemaLocation): Set<'json'> => {
    const type = parseType(schema, location);
    let additionalProperties = parseWithLocation(schema.additionalProperties, location.child('additionalProperties'));
    additionalProperties = additionalProperties.withAdditionalOrigins(type.origins);
    const parsedSchemaKeywords: ParsedSchemaKeywords = {
        additionalProperties,
        properties: parseSchemaProperties(schema, location),
        type
    };

    return createJsonSet(parsedSchemaKeywords);
};

const parseCoreSchemaMetaSchema = (schema: CoreSchemaMetaSchema,
                                   location: SchemaLocation): Set<'json'> => {
    return parseSubsets(schema, location);
};

const parseBooleanSchema = (schema: boolean | undefined,
                            location: SchemaLocation): Set<'json'> => {
    const schemaOrigins: SchemaOrigin[] = [{
        path: location.path,
        type: location.schemaOriginType,
        value: schema
    }];
    const schemaValue = isUndefined(schema) ? true : schema;
    return schemaValue ? createAllJsonSet(schemaOrigins) : createEmptyJsonSet(schemaOrigins);
};

const parseWithLocation = (schema: JsonSchema | undefined,
                           location: SchemaLocation): Set<'json'> => {
    return (isBoolean(schema) || isUndefined(schema))
        ? parseBooleanSchema(schema, location)
        : parseCoreSchemaMetaSchema(schema, location);
};

export const parseAsJsonSet = (schema: JsonSchema, originType: SchemaOriginType): Set<'json'> => {
    return parseWithLocation(schema, SchemaLocation.createRoot(originType));
};
