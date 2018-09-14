// tslint:disable:max-classes-per-file

import {
    Representation, SchemaOrigin, Set, toDestinationRepresentationValues,
    toSourceRepresentationValues
} from '../set';

interface IntegerSet extends  Set<'integer'> {
    readonly schemaOrigins: SchemaOrigin[];
    intersectWithAll(other: AllIntegerSet): IntegerSet;
    intersectWithEmpty(other: EmptyIntegerSet): IntegerSet;
}

export class AllIntegerSet implements IntegerSet {
    public readonly setType = 'integer';
    public readonly type = 'all';

    public constructor(public readonly schemaOrigins: SchemaOrigin[]) {}

    public intersect(other: IntegerSet): IntegerSet {
        return other.intersectWithAll(this);
    }

    public intersectWithAll(other: IntegerSet): IntegerSet {
        return new AllIntegerSet(this.schemaOrigins.concat(other.schemaOrigins));
    }

    public intersectWithEmpty(other: EmptyIntegerSet): IntegerSet {
        return new EmptyIntegerSet(this.schemaOrigins.concat(other.schemaOrigins));
    }

    public complement(): IntegerSet {
        return new EmptyIntegerSet(this.schemaOrigins);
    }

    public toRepresentations(): Representation[] {
        return [{
            destinationValues: toDestinationRepresentationValues(this.schemaOrigins),
            sourceValues: toSourceRepresentationValues(this.schemaOrigins),
            type: 'type',
            value: 'integer'
        }];
    }
}

export class EmptyIntegerSet implements IntegerSet {
    public readonly setType = 'integer';
    public readonly type = 'empty';

    public constructor(public readonly schemaOrigins: SchemaOrigin[]) {}

    public intersect(other: IntegerSet): IntegerSet {
        return other.intersectWithEmpty(this);
    }

    public intersectWithAll(other: IntegerSet): IntegerSet {
        return new EmptyIntegerSet(this.schemaOrigins.concat(other.schemaOrigins));
    }

    public intersectWithEmpty(other: IntegerSet): IntegerSet {
        // TODO: this can't be asserted without keywords support
        return new EmptyIntegerSet(this.schemaOrigins.concat(other.schemaOrigins));
    }

    public complement(): IntegerSet {
        return new AllIntegerSet(this.schemaOrigins);
    }

    public toRepresentations(): Representation[] {
        return [];
    }
}
