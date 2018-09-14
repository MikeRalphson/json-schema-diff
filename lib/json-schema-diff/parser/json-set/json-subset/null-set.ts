// tslint:disable:max-classes-per-file

import {
    Representation, SchemaOrigin, Set, toDestinationRepresentationValues,
    toSourceRepresentationValues
} from '../set';

interface NullSet extends Set<'null'> {
    intersectWithAll(other: AllNullSet): NullSet;
    intersectWithEmpty(other: EmptyNullSet): NullSet;
}

export class AllNullSet implements NullSet {
    public readonly setType = 'null';
    public readonly type = 'all';

    public constructor(public readonly schemaOrigins: SchemaOrigin[]) {}

    public intersect(other: NullSet): NullSet {
        return other.intersectWithAll(this);
    }

    public intersectWithAll(other: NullSet): NullSet {
        return new AllNullSet(this.schemaOrigins.concat(other.schemaOrigins));
    }

    public intersectWithEmpty(other: EmptyNullSet): NullSet {
        return new EmptyNullSet(this.schemaOrigins.concat(other.schemaOrigins));
    }

    public complement(): NullSet {
        return new EmptyNullSet(this.schemaOrigins);
    }

    public toRepresentations(): Representation[] {
        return [{
            destinationValues: toDestinationRepresentationValues(this.schemaOrigins),
            sourceValues: toSourceRepresentationValues(this.schemaOrigins),
            type: 'type',
            value: 'null'
        }];
    }
}

export class EmptyNullSet implements NullSet {
    public readonly setType = 'null';
    public readonly type = 'empty';

    public constructor(public readonly schemaOrigins: SchemaOrigin[]) {}

    public intersect(other: NullSet): NullSet {
        return other.intersectWithEmpty(this);
    }

    public intersectWithAll(other: NullSet): NullSet {
        return new EmptyNullSet(this.schemaOrigins.concat(other.schemaOrigins));
    }

    public intersectWithEmpty(other: EmptyNullSet): NullSet {
        // TODO: this can't be asserted without keywords support
        return new EmptyNullSet(this.schemaOrigins.concat(other.schemaOrigins));
    }

    public complement(): NullSet {
        return new AllNullSet(this.schemaOrigins);
    }

    public toRepresentations(): Representation[] {
        return [];
    }
}
