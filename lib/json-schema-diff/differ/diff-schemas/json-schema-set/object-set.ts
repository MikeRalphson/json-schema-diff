// tslint:disable:max-classes-per-file

import {Representation, SchemaOrigin, Set} from './set';
import {toDestinationRepresentationValues, toSourceRepresentationValues} from './set-helpers';

export interface ObjectSet extends Set<'object'> {}

export class AllObjectSet implements ObjectSet {
    public readonly setType = 'object';

    public constructor(public readonly schemaOrigins: SchemaOrigin[]) {}

    public intersect(otherSet: ObjectSet): ObjectSet {
        return otherSet.intersectWithAll(this);
    }

    public intersectWithAll(otherAllSet: ObjectSet): ObjectSet {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherAllSet.schemaOrigins);
        return new AllObjectSet(mergedSchemaOrigins);
    }

    public intersectWithEmpty(otherEmptySet: ObjectSet): ObjectSet {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherEmptySet.schemaOrigins);
        return new EmptyObjectSet(mergedSchemaOrigins);
    }

    public inverse(): ObjectSet {
        return new EmptyObjectSet(this.schemaOrigins);
    }

    public toRepresentations(): Representation[] {
        return [{
            destinationValues: toDestinationRepresentationValues(this.schemaOrigins),
            sourceValues: toSourceRepresentationValues(this.schemaOrigins),
            type: 'type',
            value: 'object'
        }];
    }
}

export class EmptyObjectSet implements ObjectSet {
    public readonly setType = 'object';

    public constructor(public readonly schemaOrigins: SchemaOrigin[]) {}

    public intersect(otherSet: ObjectSet): ObjectSet {
        return otherSet.intersectWithEmpty(this);
    }

    public intersectWithAll(otherAllSet: ObjectSet): ObjectSet {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherAllSet.schemaOrigins);
        return new EmptyObjectSet(mergedSchemaOrigins);
    }

    public intersectWithEmpty(otherEmptySet: ObjectSet): ObjectSet {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherEmptySet.schemaOrigins);
        return new EmptyObjectSet(mergedSchemaOrigins);
    }

    public inverse(): ObjectSet {
        return new AllObjectSet(this.schemaOrigins);
    }

    public toRepresentations(): Representation[] {
        return [];
    }
}
