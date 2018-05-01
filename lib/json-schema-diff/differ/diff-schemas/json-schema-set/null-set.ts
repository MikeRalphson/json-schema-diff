// tslint:disable:max-classes-per-file

import {Representation, SchemaOrigin, Set} from './set';
import {toDestinationRepresentationValues, toSourceRepresentationValues} from './set-helpers';

export interface NullSet extends Set<'null'> {}

export class AllNullSet implements NullSet {
    public readonly setType = 'null';

    public constructor(public readonly schemaOrigins: SchemaOrigin[]) {}

    public intersect(otherSet: NullSet): NullSet {
        return otherSet.intersectWithAll(this);
    }

    public intersectWithAll(otherAllSet: NullSet): NullSet {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherAllSet.schemaOrigins);
        return new AllNullSet(mergedSchemaOrigins);
    }

    public intersectWithEmpty(otherEmptySet: NullSet): NullSet {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherEmptySet.schemaOrigins);
        return new EmptyNullSet(mergedSchemaOrigins);
    }

    public union(otherSet: NullSet): NullSet {
        return otherSet.unionWithAll(this);
    }

    public unionWithAll(otherAllSet: NullSet): NullSet {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherAllSet.schemaOrigins);
        return new AllNullSet(mergedSchemaOrigins);
    }

    public unionWithEmpty(otherEmptySet: NullSet): NullSet {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherEmptySet.schemaOrigins);
        return new AllNullSet(mergedSchemaOrigins);
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

    public constructor(public readonly schemaOrigins: SchemaOrigin[]) {}

    public intersect(otherSet: NullSet): NullSet {
        return otherSet.intersectWithEmpty(this);
    }

    public intersectWithAll(otherAllSet: NullSet): NullSet {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherAllSet.schemaOrigins);
        return new EmptyNullSet(mergedSchemaOrigins);
    }

    public intersectWithEmpty(otherEmptySet: NullSet): NullSet {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherEmptySet.schemaOrigins);
        return new EmptyNullSet(mergedSchemaOrigins);
    }

    public union(otherSet: NullSet): NullSet {
        return otherSet.unionWithEmpty(this);
    }

    public unionWithAll(otherAllSet: NullSet): NullSet {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherAllSet.schemaOrigins);
        return new AllNullSet(mergedSchemaOrigins);
    }

    public unionWithEmpty(otherEmptySet: NullSet): NullSet {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherEmptySet.schemaOrigins);
        return new EmptyNullSet(mergedSchemaOrigins);
    }

    public complement(): NullSet {
        return new AllNullSet(this.schemaOrigins);
    }

    public toRepresentations(): Representation[] {
        return [];
    }
}
