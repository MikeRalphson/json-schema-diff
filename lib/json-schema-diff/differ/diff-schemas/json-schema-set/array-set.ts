// tslint:disable:max-classes-per-file

import {Representation, SchemaOrigin, Set} from './set';
import {toDestinationRepresentationValues, toSourceRepresentationValues} from './set-helpers';

export interface ArraySet extends Set<'array'> {}

export class AllArraySet implements ArraySet {
    public readonly setType = 'array';

    public constructor(public readonly schemaOrigins: SchemaOrigin[]) {}

    public intersect(otherSet: ArraySet): ArraySet {
        return otherSet.intersectWithAll(this);
    }

    public intersectWithAll(otherAllSet: ArraySet): ArraySet {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherAllSet.schemaOrigins);
        return new AllArraySet(mergedSchemaOrigins);
    }

    public intersectWithEmpty(otherEmptySet: ArraySet): ArraySet {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherEmptySet.schemaOrigins);
        return new EmptyArraySet(mergedSchemaOrigins);
    }

    public inverse(): ArraySet {
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

    public constructor(public readonly schemaOrigins: SchemaOrigin[]) {}

    public intersect(otherSet: ArraySet): ArraySet {
        return otherSet.intersectWithEmpty(this);
    }

    public intersectWithAll(otherAllSet: ArraySet): ArraySet {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherAllSet.schemaOrigins);
        return new EmptyArraySet(mergedSchemaOrigins);
    }

    public intersectWithEmpty(otherEmptySet: ArraySet): ArraySet {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherEmptySet.schemaOrigins);
        return new EmptyArraySet(mergedSchemaOrigins);
    }

    public inverse(): ArraySet {
        return new AllArraySet(this.schemaOrigins);
    }

    public toRepresentations(): Representation[] {
        return [];
    }
}
