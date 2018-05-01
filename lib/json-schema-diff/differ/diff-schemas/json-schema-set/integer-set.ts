// tslint:disable:max-classes-per-file

import {Representation, SchemaOrigin, Set} from './set';
import {toDestinationRepresentationValues, toSourceRepresentationValues} from './set-helpers';

export interface IntegerSet extends Set<'integer'> {}

export class AllIntegerSet implements IntegerSet {
    public readonly setType = 'integer';

    public constructor(public readonly schemaOrigins: SchemaOrigin[]) {}

    public intersect(otherSet: IntegerSet): IntegerSet {
        return otherSet.intersectWithAll(this);
    }

    public intersectWithAll(otherAllSet: IntegerSet): IntegerSet {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherAllSet.schemaOrigins);
        return new AllIntegerSet(mergedSchemaOrigins);
    }

    public intersectWithEmpty(otherEmptySet: IntegerSet): IntegerSet {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherEmptySet.schemaOrigins);
        return new EmptyIntegerSet(mergedSchemaOrigins);
    }

    public union(otherSet: IntegerSet): IntegerSet {
        return otherSet.unionWithAll(this);
    }

    public unionWithAll(otherAllSet: IntegerSet): IntegerSet {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherAllSet.schemaOrigins);
        return new AllIntegerSet(mergedSchemaOrigins);
    }

    public unionWithEmpty(otherEmptySet: IntegerSet): IntegerSet {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherEmptySet.schemaOrigins);
        return new AllIntegerSet(mergedSchemaOrigins);
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

    public constructor(public readonly schemaOrigins: SchemaOrigin[]) {}

    public intersect(otherSet: IntegerSet): IntegerSet {
        return otherSet.intersectWithEmpty(this);
    }

    public intersectWithAll(otherAllSet: IntegerSet): IntegerSet {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherAllSet.schemaOrigins);
        return new EmptyIntegerSet(mergedSchemaOrigins);
    }

    public intersectWithEmpty(otherEmptySet: IntegerSet): IntegerSet {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherEmptySet.schemaOrigins);
        return new EmptyIntegerSet(mergedSchemaOrigins);
    }

    public union(otherSet: IntegerSet): IntegerSet {
        return otherSet.unionWithEmpty(this);
    }

    public unionWithAll(otherAllSet: IntegerSet): IntegerSet {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherAllSet.schemaOrigins);
        return new AllIntegerSet(mergedSchemaOrigins);
    }

    public unionWithEmpty(otherEmptySet: IntegerSet): IntegerSet {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherEmptySet.schemaOrigins);
        return new EmptyIntegerSet(mergedSchemaOrigins);
    }

    public complement(): IntegerSet {
        return new AllIntegerSet(this.schemaOrigins);
    }

    public toRepresentations(): Representation[] {
        return [];
    }
}
