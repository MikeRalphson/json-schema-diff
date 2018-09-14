// tslint:disable:max-classes-per-file

import {
    Representation, SchemaOrigin, Set, toDestinationRepresentationValues,
    toSourceRepresentationValues
} from '../set';

interface BooleanSet extends Set<'boolean'> {
    intersectWithAll(other: AllBooleanSet): BooleanSet;
    intersectWithEmpty(other: EmptyBooleanSet): BooleanSet;
}

export class AllBooleanSet implements BooleanSet {
    public readonly setType = 'boolean';
    public readonly type = 'all';

    public constructor(public readonly schemaOrigins: SchemaOrigin[]) {}

    public intersect(other: BooleanSet): BooleanSet {
        return other.intersectWithAll(this);
    }

    public intersectWithAll(other: AllBooleanSet): BooleanSet {
        return new AllBooleanSet(this.schemaOrigins.concat(other.schemaOrigins));
    }

    public intersectWithEmpty(other: EmptyBooleanSet): BooleanSet {
        return new EmptyBooleanSet(this.schemaOrigins.concat(other.schemaOrigins));
    }

    public complement(): BooleanSet {
        return new EmptyBooleanSet(this.schemaOrigins);
    }

    public toRepresentations(): Representation[] {
        return [{
            destinationValues: toDestinationRepresentationValues(this.schemaOrigins),
            sourceValues: toSourceRepresentationValues(this.schemaOrigins),
            type: 'type',
            value: 'boolean'
        }];
    }
}

export class EmptyBooleanSet implements BooleanSet {
    public readonly setType = 'boolean';
    public readonly type = 'empty';

    public constructor(public readonly schemaOrigins: SchemaOrigin[]) {}

    public intersect(other: BooleanSet): BooleanSet {
        return other.intersectWithEmpty(this);
    }

    public intersectWithAll(other: BooleanSet): BooleanSet {
        return new EmptyBooleanSet(this.schemaOrigins.concat(other.schemaOrigins));
    }

    public intersectWithEmpty(other: BooleanSet): BooleanSet {
        // TODO: this can't be asserted without keywords support
        return new EmptyBooleanSet(this.schemaOrigins.concat(other.schemaOrigins));
    }

    public complement(): BooleanSet {
        return new AllBooleanSet(this.schemaOrigins);
    }

    public toRepresentations(): Representation[] {
        return [];
    }
}
