// tslint:disable:max-classes-per-file

import {createAllObjectSet} from '../set-factories/create-object-set';
import {AllArraySet} from './json-subset/array-set';
import {AllBooleanSet} from './json-subset/boolean-set';
import {AllIntegerSet} from './json-subset/integer-set';
import {AllNullSet} from './json-subset/null-set';
import {AllNumberSet} from './json-subset/number-set';
import {AllStringSet} from './json-subset/string-set';
import {
    allSchemaTypes, Representation, SchemaOrigin, Set, toDestinationRepresentationValues,
    toSourceRepresentationValues
} from './set';

interface JsonSet extends Set<'json'> {
    intersectWithAll(other: AllJsonSet): JsonSet;
    intersectWithEmpty(other: EmptyJsonSet): JsonSet;
    intersectWithSome(other: SomeJsonSet): JsonSet;
}

export class AllJsonSet implements JsonSet {
    public readonly setType = 'json';
    public readonly type = 'all';

    public constructor(public readonly schemaOrigins: SchemaOrigin[]) {}

    public complement(): JsonSet {
        // TODO: can't be properly asserted without keywords support
        return new EmptyJsonSet(this.schemaOrigins);
    }

    public intersect(other: JsonSet): JsonSet {
        return other.intersectWithAll(this);
    }

    public intersectWithAll(other: AllJsonSet): JsonSet {
        // TODO: mergedSchemaOrigins can't be properly asserted without keywords support
        return new AllJsonSet(this.schemaOrigins.concat(other.schemaOrigins));
    }

    public intersectWithEmpty(other: EmptyJsonSet): JsonSet {
        return new EmptyJsonSet(this.schemaOrigins.concat(other.schemaOrigins));
    }

    public intersectWithSome(other: SomeJsonSet): JsonSet {
        return new SomeJsonSet({
            array: other.subsets.array.intersect(new AllArraySet(this.schemaOrigins)),
            boolean: other.subsets.boolean.intersect(new AllBooleanSet(this.schemaOrigins)),
            integer: other.subsets.integer.intersect(new AllIntegerSet(this.schemaOrigins)),
            null: other.subsets.null.intersect(new AllNullSet(this.schemaOrigins)),
            number: other.subsets.number.intersect(new AllNumberSet(this.schemaOrigins)),
            object: other.subsets.object.intersect(createAllObjectSet(this)),
            string: other.subsets.string.intersect(new AllStringSet(this.schemaOrigins))
        });
    }

    public toRepresentations(): Representation[] {
        return allSchemaTypes
            .map((value): Representation => ({
                destinationValues: toDestinationRepresentationValues(this.schemaOrigins),
                sourceValues: toSourceRepresentationValues(this.schemaOrigins),
                type: 'type',
                value
            })
        );
    }
}

export class EmptyJsonSet implements JsonSet {
    public readonly setType = 'json';
    public readonly type = 'empty';

    public constructor(public readonly schemaOrigins: SchemaOrigin[]) {}

    public complement(): JsonSet {
        return new AllJsonSet(this.schemaOrigins);
    }

    public intersect(other: JsonSet): JsonSet {
        return other.intersectWithEmpty(this);
    }

    public intersectWithEmpty(other: EmptyJsonSet): JsonSet {
        // TODO: can't be properly asserted without keywords support
        return new EmptyJsonSet(this.schemaOrigins.concat(other.schemaOrigins));
    }

    public intersectWithAll(other: AllJsonSet): JsonSet {
        return new EmptyJsonSet(this.schemaOrigins.concat(other.schemaOrigins));
    }

    public intersectWithSome(other: SomeJsonSet): JsonSet {
        return new EmptyJsonSet(this.schemaOrigins.concat(other.schemaOrigins));
    }

    public toRepresentations(): Representation[] {
        return [];
    }
}

export class SomeJsonSet implements JsonSet {
    public readonly setType = 'json';
    public readonly type = 'some';

    public constructor(public readonly subsets: Subsets) {}

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
        return new SomeJsonSet({
            array: this.subsets.array.intersect(new AllArraySet(other.schemaOrigins)),
            boolean: this.subsets.boolean.intersect(new AllBooleanSet(other.schemaOrigins)),
            integer: this.subsets.integer.intersect(new AllIntegerSet(other.schemaOrigins)),
            null: this.subsets.null.intersect(new AllNullSet(other.schemaOrigins)),
            number: this.subsets.number.intersect(new AllNumberSet(other.schemaOrigins)),
            object: this.subsets.object.intersect(createAllObjectSet(other)),
            string: this.subsets.string.intersect(new AllStringSet(other.schemaOrigins))
        });
    }

    public intersectWithEmpty(other: EmptyJsonSet): JsonSet {
        return new EmptyJsonSet(this.schemaOrigins.concat(other.schemaOrigins));
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

    public toRepresentations(): Representation[] {
        return Object.keys(this.subsets).reduce(
            (allRepresentations: Representation[], subsetName: keyof Subsets) =>
                allRepresentations.concat(this.subsets[subsetName].toRepresentations()),
            []
        );
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
