// tslint:disable:max-classes-per-file

import {Representation, SchemaOrigin, Set} from './set';
import {toDestinationRepresentationValues, toSourceRepresentationValues} from './set-helpers';

export interface NumberSet extends Set<'number'> {}

export class AllNumberSet implements NumberSet {
    public readonly setType = 'number';

    public constructor(public readonly schemaOrigins: SchemaOrigin[]) {}

    public intersect(otherSet: NumberSet): NumberSet {
        return otherSet.intersectWithAll(this);
    }

    public intersectWithAll(otherAllSet: NumberSet): NumberSet {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherAllSet.schemaOrigins);
        return new AllNumberSet(mergedSchemaOrigins);
    }

    public intersectWithEmpty(otherEmptySet: NumberSet): NumberSet {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherEmptySet.schemaOrigins);
        return new EmptyNumberSet(mergedSchemaOrigins);
    }

    public inverse(): NumberSet {
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

    public constructor(public readonly schemaOrigins: SchemaOrigin[]) {}

    public intersect(otherSet: NumberSet): NumberSet {
        return otherSet.intersectWithEmpty(this);
    }

    public intersectWithAll(otherAllSet: NumberSet): NumberSet {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherAllSet.schemaOrigins);
        return new EmptyNumberSet(mergedSchemaOrigins);
    }

    public intersectWithEmpty(otherEmptySet: NumberSet): NumberSet {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherEmptySet.schemaOrigins);
        return new EmptyNumberSet(mergedSchemaOrigins);
    }

    public inverse(): NumberSet {
        return new AllNumberSet(this.schemaOrigins);
    }

    public toRepresentations(): Representation[] {
        return [];
    }
}
