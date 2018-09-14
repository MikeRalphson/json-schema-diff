// tslint:disable:max-classes-per-file

import {
    Representation, SchemaOrigin, Set, toDestinationRepresentationValues,
    toSourceRepresentationValues
} from '../set';

interface StringSet extends Set<'string'> {
    intersectWithAll(other: AllStringSet): StringSet;
    intersectWithEmpty(other: EmptyStringSet): StringSet;
}

export class AllStringSet implements StringSet {
    public readonly setType = 'string';
    public readonly type = 'all';

    public constructor(public readonly schemaOrigins: SchemaOrigin[]) {}

    public intersect(otherSet: StringSet): StringSet {
        return otherSet.intersectWithAll(this);
    }

    public intersectWithAll(other: StringSet): StringSet {
        return new AllStringSet(this.schemaOrigins.concat(other.schemaOrigins));
    }

    public intersectWithEmpty(other: StringSet): StringSet {
        return new EmptyStringSet(this.schemaOrigins.concat(other.schemaOrigins));
    }

    public complement(): StringSet {
        return new EmptyStringSet(this.schemaOrigins);
    }

    public toRepresentations(): Representation[] {
        return [{
            destinationValues: toDestinationRepresentationValues(this.schemaOrigins),
            sourceValues: toSourceRepresentationValues(this.schemaOrigins),
            type: 'type',
            value: 'string'
        }];
    }
}

export class EmptyStringSet implements StringSet {
    public readonly setType = 'string';
    public readonly type = 'empty';

    public constructor(public readonly schemaOrigins: SchemaOrigin[]) {}

    public intersect(otherSet: StringSet): StringSet {
        return otherSet.intersectWithEmpty(this);
    }

    public intersectWithAll(other: StringSet): StringSet {
        return new EmptyStringSet(this.schemaOrigins.concat(other.schemaOrigins));
    }

    public intersectWithEmpty(other: StringSet): StringSet {
        // TODO: this can't be asserted without keywords support
        return new EmptyStringSet(this.schemaOrigins.concat(other.schemaOrigins));
    }

    public complement(): StringSet {
        return new AllStringSet(this.schemaOrigins);
    }

    public toRepresentations(): Representation[] {
        return [];
    }
}
