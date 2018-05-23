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

const parseAllOf = (allOfSchemas: JsonSchema[],
                    location: SchemaLocation,
                    initialJsonSet: Set<'json'>): Set<'json'> => {
    let jsonSetResult = initialJsonSet;

    for (let i = 0; i < allOfSchemas.length; i += 1) {
        const allOfLocation = location.child(`allOf[${i}]`);
        const currentJsonSet = parseWithLocation(allOfSchemas[i], allOfLocation);
        jsonSetResult = jsonSetResult.intersect(currentJsonSet);
    }

    return jsonSetResult;
};

const parseAnyOf = (anyOfSchemas: JsonSchema[],
                    location: SchemaLocation,
                    initialJsonSet: Set<'json'>): Set<'json'> => {

    let jsonSetResult = parseWithLocation(anyOfSchemas[0], location.child('anyOf[0]'));

    for (let i = 1; i < anyOfSchemas.length; i += 1) {
        const currentJsonSet = parseWithLocation(anyOfSchemas[i], location.child(`anyOf[${i}]`));
        jsonSetResult = jsonSetResult.union(currentJsonSet);
    }

    jsonSetResult = jsonSetResult.intersect(initialJsonSet);

    return jsonSetResult;
};

const parseNot = (notSchema: JsonSchema,
                  location: SchemaLocation,
                  initialJsonSet: Set<'json'>): Set<'json'> => {
    const notLocation = location.child('not');
    const parsedNotJsonSet = parseWithLocation(notSchema, notLocation);
    const complementedNotJsonSet = parsedNotJsonSet.complement();
    return complementedNotJsonSet.intersect(initialJsonSet);
};

const parseSchemaProperties = (schema: CoreSchemaMetaSchema,
                               location: SchemaLocation): ParsedPropertiesKeyword => {
    const objectSetProperties: ParsedPropertiesKeyword = {};

    if (schema.properties) {
        for (const propertyName of Object.keys(schema.properties)) {
            const propertySchema = schema.properties[propertyName];
            const propertyLocation = location.child(`properties.${propertyName}`);
            objectSetProperties[propertyName] = parseWithLocation(propertySchema, propertyLocation);
        }
    }
    return objectSetProperties;
};

const parseType = (schema: CoreSchemaMetaSchema,
                   location: SchemaLocation): ParsedTypeKeyword => {
    const types = toSimpleTypeArray(schema.type);

    const schemaOrigins = [{
        path: `${location.path}.type`,
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
