// tslint:disable:max-classes-per-file

import {
    Representation, SchemaOrigin, Set, toDestinationRepresentationValues,
    toSourceRepresentationValues
} from '../set';

interface NumberSet extends Set<'number'> {
    intersectWithAll(other: AllNumberSet): NumberSet;
    intersectWithEmpty(other: EmptyNumberSet): NumberSet;
}

export class AllNumberSet implements NumberSet {
    public readonly setType = 'number';
    public readonly type = 'all';

    public constructor(public readonly schemaOrigins: SchemaOrigin[]) {}

    public intersect(other: NumberSet): NumberSet {
        return other.intersectWithAll(this);
    }

    public intersectWithAll(other: NumberSet): NumberSet {
        return new AllNumberSet(this.schemaOrigins.concat(other.schemaOrigins));
    }

    public intersectWithEmpty(other: NumberSet): NumberSet {
        return new EmptyNumberSet(this.schemaOrigins.concat(other.schemaOrigins));
    }

    public complement(): NumberSet {
        return new EmptyNumberSet(this.schemaOrigins);
    }

    public toRepresentations(): Representation[] {
        return [{
            destinationValues: toDestinationRepresentationValues(this.schemaOrigins),
            sourceValues: toSourceRepresentationValues(this.schemaOrigins),
            type: 'type',
            value: 'number'
        }];
    }
}

export class EmptyNumberSet implements NumberSet {
    public readonly setType = 'number';
    public readonly type = 'empty';

    public constructor(public readonly schemaOrigins: SchemaOrigin[]) {}

    public intersect(other: NumberSet): NumberSet {
        return other.intersectWithEmpty(this);
    }

    public intersectWithAll(other: NumberSet): NumberSet {
        return new EmptyNumberSet(this.schemaOrigins.concat(other.schemaOrigins));
    }

    public intersectWithEmpty(other: EmptyNumberSet): NumberSet {
        // TODO: this can't be asserted without keywords support
        return new EmptyNumberSet(this.schemaOrigins.concat(other.schemaOrigins));
    }

    public complement(): NumberSet {
        return new AllNumberSet(this.schemaOrigins);
    }

    public toRepresentations(): Representation[] {
        return [];
    }
}
