import * as _ from 'lodash';
import {Path} from '../../../api-types';
import {SimpleTypes} from './json-schema';

export type RepresentationType = 'type';

export interface RepresentationValue {
    path: Path;
    value: any;
}

export interface Representation {
    destinationValues: RepresentationValue[];
    sourceValues: RepresentationValue[];
    type: RepresentationType;
    value: any;
}

export type SchemaOriginType = 'source' | 'destination';

export interface SchemaOrigin {
    path: Path;
    type: SchemaOriginType;
    value: any;
}

export interface ParsedSchemaKeywords {
    additionalProperties: Set<'json'>;
    type: ParsedTypeKeyword;
    properties: ParsedPropertiesKeyword;
}

export interface ParsedPropertiesKeyword {
    [key: string]: Set<'json'>;
}

export interface ParsedTypeKeyword {
    parsedValue: SimpleTypes[];
    origins: SchemaOrigin[];
}

export const allSchemaTypes: SimpleTypes[] = ['string', 'number', 'boolean', 'integer', 'array', 'object', 'null'];

export abstract class Set<T> {
    public static toSourceRepresentationValues(schemaOrigins: SchemaOrigin[]): RepresentationValue[] {
        return Set.toRepresentationValues(schemaOrigins, 'source');
    }

    public static toDestinationRepresentationValues(schemaOrigins: SchemaOrigin[]): RepresentationValue[] {
        return Set.toRepresentationValues(schemaOrigins, 'destination');
    }

    private static toRepresentationValues(
        schemaOrigins: SchemaOrigin[], origin: SchemaOriginType
    ): RepresentationValue[] {
        const representationValuesWithDuplications: RepresentationValue[] = schemaOrigins
            .filter((schemaOrigin) => schemaOrigin.type === origin)
            .map((schemaOrigin) => ({
                path: schemaOrigin.path,
                value: schemaOrigin.value
            }));

        return _.uniqWith(representationValuesWithDuplications, _.isEqual);
    }

    public readonly setType: T;
    public readonly schemaOrigins: SchemaOrigin[];
    public abstract intersect(otherSet: Set<T>): Set<T>;
    public abstract union(otherSet: Set<T>): Set<T>;
    public abstract complement(): Set<T>;
    public abstract toRepresentations(): Representation[];
    public abstract withAdditionalOrigins(origins: SchemaOrigin[]): Set<T>;
}
