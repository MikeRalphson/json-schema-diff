// tslint:disable:max-classes-per-file

import {allSchemaTypes, Representation, SchemaOrigin, Set} from './set';

type JsonSet = Set<'json'> & {
    intersectWithAll(otherSet: AllJsonSet): JsonSet;
    unionWithAll(otherSet: AllJsonSet): JsonSet;
    intersectWithEmpty(otherSet: EmptyJsonSet): JsonSet;
    unionWithEmpty(otherSet: EmptyJsonSet): JsonSet;
    intersectWithSome(otherSet: SomeJsonSet): JsonSet;
    unionWithSome(otherSet: SomeJsonSet): JsonSet;
};

export class AllJsonSet implements JsonSet {
    public readonly setType = 'json';

    public constructor(public readonly schemaOrigins: SchemaOrigin[]) {}

    public complement(): JsonSet {
        return new EmptyJsonSet(this.schemaOrigins);
    }

    public intersect(other: JsonSet): JsonSet {
        return other.intersectWithAll(this);
    }

    public intersectWithAll(other: AllJsonSet): JsonSet {
        return other.withAdditionalOrigins(this.schemaOrigins);
    }

    public intersectWithEmpty(other: EmptyJsonSet): JsonSet {
        return other.withAdditionalOrigins(this.schemaOrigins);
    }

    public intersectWithSome(other: SomeJsonSet): JsonSet {
        return other.withAdditionalOrigins(this.schemaOrigins);
    }

    public union(other: JsonSet): JsonSet {
        return other.unionWithAll(this);
    }

    public unionWithSome(other: SomeJsonSet): JsonSet {
        return this.withAdditionalOrigins(other.schemaOrigins);
    }

    public unionWithAll(other: AllJsonSet): JsonSet {
        return this.withAdditionalOrigins(other.schemaOrigins);
    }

    public unionWithEmpty(other: EmptyJsonSet): JsonSet {
        return this.withAdditionalOrigins(other.schemaOrigins);
    }

    public toRepresentations(): Representation[] {
        return allSchemaTypes
            .map<Representation>((value) => ({
                destinationValues: Set.toDestinationRepresentationValues(this.schemaOrigins),
                sourceValues: Set.toSourceRepresentationValues(this.schemaOrigins),
                type: 'type',
                value
            })
        );
    }

    public withAdditionalOrigins(otherOrigins: SchemaOrigin[]): JsonSet {
        return new AllJsonSet(this.schemaOrigins.concat(otherOrigins));
    }
}

class EmptyJsonSet implements JsonSet {
    public readonly setType = 'json';

    public constructor(public readonly schemaOrigins: SchemaOrigin[]) {}

    public complement(): JsonSet {
        return new AllJsonSet(this.schemaOrigins);
    }

    public intersect(other: JsonSet): JsonSet {
        return other.intersectWithEmpty(this);
    }

    public intersectWithEmpty(other: EmptyJsonSet): JsonSet {
        return this.withAdditionalOrigins(other.schemaOrigins);
    }

    public intersectWithAll(other: AllJsonSet): JsonSet {
        return this.withAdditionalOrigins(other.schemaOrigins);
    }

    public intersectWithSome(other: SomeJsonSet): JsonSet {
        return this.withAdditionalOrigins(other.schemaOrigins);
    }

    public union(other: JsonSet): JsonSet {
        return other.unionWithEmpty(this);
    }

    public unionWithEmpty(other: EmptyJsonSet): JsonSet {
        return other.withAdditionalOrigins(this.schemaOrigins);
    }

    public unionWithSome(other: SomeJsonSet): JsonSet {
        return other.withAdditionalOrigins(this.schemaOrigins);
    }

    public unionWithAll(other: AllJsonSet): JsonSet {
        return other.withAdditionalOrigins(this.schemaOrigins);
    }

    public toRepresentations(): Representation[] {
        return [];
    }

    public withAdditionalOrigins(otherOrigins: SchemaOrigin[]): JsonSet {
        return new EmptyJsonSet(this.schemaOrigins.concat(otherOrigins));
    }
}

class SomeJsonSet implements JsonSet {
    public readonly setType = 'json';

    public constructor(public readonly subsets: Subsets) {
    }

    public get schemaOrigins(): SchemaOrigin[] {
        return Object.keys(this.subsets).reduce(
            (allOrigins: SchemaOrigin[], subsetName: keyof Subsets) =>
                allOrigins.concat(this.subsets[subsetName].schemaOrigins),
            []
        );
    }

    public complement(): JsonSet {
        return new SomeJsonSet({
            array: this.subsets.array.complement(),
            boolean: this.subsets.boolean.complement(),
            integer: this.subsets.integer.complement(),
            null: this.subsets.null.complement(),
            number: this.subsets.number.complement(),
            object: this.subsets.object.complement(),
            string: this.subsets.string.complement()
        });
    }

    public intersect(other: JsonSet): JsonSet {
        return other.intersectWithSome(this);
    }

    public intersectWithAll(other: AllJsonSet): JsonSet {
        return this.withAdditionalOrigins(other.schemaOrigins);
    }

    public intersectWithEmpty(other: EmptyJsonSet): JsonSet {
        return other.withAdditionalOrigins(this.schemaOrigins);
    }

    public intersectWithSome(other: SomeJsonSet): JsonSet {
        return new SomeJsonSet({
            array: this.subsets.array.intersect(other.subsets.array),
            boolean: this.subsets.boolean.intersect(other.subsets.boolean),
            integer: this.subsets.integer.intersect(other.subsets.integer),
            null: this.subsets.null.intersect(other.subsets.null),
            number: this.subsets.number.intersect(other.subsets.number),
            object: this.subsets.object.intersect(other.subsets.object),
            string: this.subsets.string.intersect(other.subsets.string)
        });
    }

    public union(other: JsonSet): JsonSet {
        return other.unionWithSome(this);
    }

    public unionWithEmpty(other: EmptyJsonSet): JsonSet {
        return this.withAdditionalOrigins(other.schemaOrigins);
    }

    public unionWithSome(other: SomeJsonSet): JsonSet {
        return new SomeJsonSet({
            array: this.subsets.array.union(other.subsets.array),
            boolean: this.subsets.boolean.union(other.subsets.boolean),
            integer: this.subsets.integer.union(other.subsets.integer),
            null: this.subsets.null.union(other.subsets.null),
            number: this.subsets.number.union(other.subsets.number),
            object: this.subsets.object.union(other.subsets.object),
            string: this.subsets.string.union(other.subsets.string)
        });
    }

    public unionWithAll(other: AllJsonSet): JsonSet {
        return other.withAdditionalOrigins(this.schemaOrigins);
    }

    public toRepresentations(): Representation[] {
        return Object.keys(this.subsets).reduce(
            (allRepresentations: Representation[], subsetName: keyof Subsets) =>
                allRepresentations.concat(this.subsets[subsetName].toRepresentations()),
            []
        );
    }

    public withAdditionalOrigins(otherOrigins: SchemaOrigin[]): JsonSet {
        return new SomeJsonSet({
            array: this.subsets.array.withAdditionalOrigins(otherOrigins),
            boolean: this.subsets.boolean.withAdditionalOrigins(otherOrigins),
            integer: this.subsets.integer.withAdditionalOrigins(otherOrigins),
            null: this.subsets.null.withAdditionalOrigins(otherOrigins),
            number: this.subsets.number.withAdditionalOrigins(otherOrigins),
            object: this.subsets.object.withAdditionalOrigins(otherOrigins),
            string: this.subsets.string.withAdditionalOrigins(otherOrigins)
        });
    }
}

export interface Subsets {
    array: Set<'array'>;
    boolean: Set<'boolean'>;
    integer: Set<'integer'>;
    number: Set<'number'>;
    null: Set<'null'>;
    object: Set<'object'>;
    string: Set<'string'>;
}

export const createSomeJsonSet = (subsets: Subsets): Set<'json'> => {
    return new SomeJsonSet(subsets);
};

export const createAllJsonSet = (schemaOrigins: SchemaOrigin[]): Set<'json'> => {
    return new AllJsonSet(schemaOrigins);
};

export const createEmptyJsonSet = (schemaOrigins: SchemaOrigin[]): Set<'json'> => {
    return new EmptyJsonSet(schemaOrigins);
};
