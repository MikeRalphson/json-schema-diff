// tslint:disable:max-classes-per-file
import {
    Representation, SchemaOrigin, Set, toDestinationRepresentationValues,
    toSourceRepresentationValues
} from '../set';

interface ArraySet extends Set<'array'> {
    intersectWithAll(other: AllArraySet): ArraySet;
    intersectWithEmpty(other: EmptyArraySet): ArraySet;
}

export class AllArraySet implements ArraySet {
    public readonly setType = 'array';
    public readonly type = 'all';

    public constructor(public readonly schemaOrigins: SchemaOrigin[]) {
    }

    public intersect(other: ArraySet): ArraySet {
        return other.intersectWithAll(this);
    }

    public intersectWithAll(other: ArraySet): ArraySet {
        return new AllArraySet(this.schemaOrigins.concat(other.schemaOrigins));
    }

    public intersectWithEmpty(other: EmptyArraySet): ArraySet {
        return new EmptyArraySet(this.schemaOrigins.concat(other.schemaOrigins));
    }

    public complement(): ArraySet {
        return new EmptyArraySet(this.schemaOrigins);
    }

    public toRepresentations(): Representation[] {
        return [{
            destinationValues: toDestinationRepresentationValues(this.schemaOrigins),
            sourceValues: toSourceRepresentationValues(this.schemaOrigins),
            type: 'type',
            value: 'array'
        }];
    }
}

export class EmptyArraySet implements ArraySet {
    public readonly setType = 'array';
    public readonly type = 'empty';

    public constructor(public readonly schemaOrigins: SchemaOrigin[]) {
    }

    public intersect(other: ArraySet): ArraySet {
        return other.intersectWithEmpty(this);
    }

    public intersectWithAll(other: ArraySet): ArraySet {
        return new EmptyArraySet(other.schemaOrigins.concat(this.schemaOrigins));
    }

    public intersectWithEmpty(other: EmptyArraySet): ArraySet {
        // TODO: this can't be asserted without keywords support
        return new EmptyArraySet(other.schemaOrigins.concat(this.schemaOrigins));
    }

    public complement(): ArraySet {
        return new AllArraySet(this.schemaOrigins);
    }

    public toRepresentations(): Representation[] {
        return [];
    }
}
