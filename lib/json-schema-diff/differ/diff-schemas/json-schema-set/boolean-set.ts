// tslint:disable:max-classes-per-file

import {Representation, SchemaOrigin, Set} from './set';
import {toDestinationRepresentationValues, toSourceRepresentationValues} from './set-helpers';

export interface BooleanSet extends Set<'boolean'> {}

export class AllBooleanSet implements BooleanSet {
    public readonly setType = 'boolean';

    public constructor(public readonly schemaOrigins: SchemaOrigin[]) {}

    public intersect(otherSet: BooleanSet): BooleanSet {
        return otherSet.intersectWithAll(this);
    }

    public intersectWithAll(otherAllSet: BooleanSet): BooleanSet {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherAllSet.schemaOrigins);
        return new AllBooleanSet(mergedSchemaOrigins);
    }

    public intersectWithEmpty(otherEmptySet: BooleanSet): BooleanSet {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherEmptySet.schemaOrigins);
        return new EmptyBooleanSet(mergedSchemaOrigins);
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

    public constructor(public readonly schemaOrigins: SchemaOrigin[]) {}

    public intersect(otherSet: BooleanSet): BooleanSet {
        return otherSet.intersectWithEmpty(this);
    }

    public intersectWithAll(otherAllSet: BooleanSet): BooleanSet {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherAllSet.schemaOrigins);
        return new EmptyBooleanSet(mergedSchemaOrigins);
    }

    public intersectWithEmpty(otherEmptySet: BooleanSet): BooleanSet {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherEmptySet.schemaOrigins);
        return new EmptyBooleanSet(mergedSchemaOrigins);
    }

    public complement(): BooleanSet {
        return new AllBooleanSet(this.schemaOrigins);
    }

    public toRepresentations(): Representation[] {
        return [];
    }
}
