export type RepresentationType = 'type';

export interface RepresentationValue {
    location: string;
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
    location: string;
    type: SchemaOriginType;
    value: any;
}

export interface Set<T> {
    readonly setType: T;
    readonly schemaOrigins: SchemaOrigin[];
    intersect(otherSet: Set<T>): Set<T>;
    intersectWithAll(otherAllSet: Set<T>): Set<T>;
    intersectWithEmpty(otherEmptySet: Set<T>): Set<T>;
    complement(): Set<T>;
    toRepresentations(): Representation[];
}
