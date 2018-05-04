// tslint:disable:max-classes-per-file

import {ParsedSchemaKeywords, Representation, SchemaOrigin, Set} from '../set';
import {isTypeSupported} from './is-type-supported';

type BooleanSet = Set<'boolean'> & {
    intersectWithAll(otherAllSet: AllBooleanSet): BooleanSet;
    intersectWithEmpty(otherEmptySet: EmptyBooleanSet): BooleanSet;
    unionWithAll(otherAllSet: AllBooleanSet): BooleanSet;
    unionWithEmpty(otherEmptySet: EmptyBooleanSet): BooleanSet;
};

class AllBooleanSet implements BooleanSet {
    public readonly setType = 'boolean';

    public constructor(public readonly schemaOrigins: SchemaOrigin[]) {}

    public intersect(otherSet: BooleanSet): BooleanSet {
        return otherSet.intersectWithAll(this);
    }

    public intersectWithAll(otherAllSet: AllBooleanSet): BooleanSet {
        return this.withAdditionalOrigins(otherAllSet.schemaOrigins);
    }

    public intersectWithEmpty(otherEmptySet: EmptyBooleanSet): BooleanSet {
        return otherEmptySet.withAdditionalOrigins(this.schemaOrigins);
    }

    public union(otherSet: BooleanSet): BooleanSet {
        return otherSet.unionWithAll(this);
    }

    public unionWithAll(otherAllSet: AllBooleanSet): BooleanSet {
        return this.withAdditionalOrigins(otherAllSet.schemaOrigins);
    }

    public unionWithEmpty(otherEmptySet: BooleanSet): BooleanSet {
        return this.withAdditionalOrigins(otherEmptySet.schemaOrigins);
    }

    public complement(): BooleanSet {
        return new EmptyBooleanSet(this.schemaOrigins);
    }

    public withAdditionalOrigins(origins: SchemaOrigin[]): BooleanSet {
        return new AllBooleanSet(this.schemaOrigins.concat(origins));
    }

    public toRepresentations(): Representation[] {
        return [{
            destinationValues: Set.toDestinationRepresentationValues(this.schemaOrigins),
            sourceValues: Set.toSourceRepresentationValues(this.schemaOrigins),
            type: 'type',
            value: 'boolean'
        }];
    }
}

class EmptyBooleanSet implements BooleanSet {
    public readonly setType = 'boolean';

    public constructor(public readonly schemaOrigins: SchemaOrigin[]) {}

    public intersect(otherSet: BooleanSet): BooleanSet {
        return otherSet.intersectWithEmpty(this);
    }

    public intersectWithAll(otherAllSet: BooleanSet): BooleanSet {
        return this.withAdditionalOrigins(otherAllSet.schemaOrigins);
    }

    public intersectWithEmpty(otherEmptySet: BooleanSet): BooleanSet {
        return this.withAdditionalOrigins(otherEmptySet.schemaOrigins);
    }

    public union(otherSet: BooleanSet): BooleanSet {
        return otherSet.unionWithEmpty(this);
    }

    public unionWithAll(otherAllSet: AllBooleanSet): BooleanSet {
        return otherAllSet.withAdditionalOrigins(this.schemaOrigins);
    }

    public unionWithEmpty(otherEmptySet: BooleanSet): BooleanSet {
        return this.withAdditionalOrigins(otherEmptySet.schemaOrigins);
    }

    public complement(): BooleanSet {
        return new AllBooleanSet(this.schemaOrigins);
    }

    public withAdditionalOrigins(origins: SchemaOrigin[]): BooleanSet {
        return new EmptyBooleanSet(this.schemaOrigins.concat(origins));
    }

    public toRepresentations(): Representation[] {
        return [];
    }
}

export const createBooleanSet = (parsedSchemaKeywords: ParsedSchemaKeywords): Set<'boolean'> =>
    isTypeSupported(parsedSchemaKeywords, 'boolean')
        ? new AllBooleanSet(parsedSchemaKeywords.type.origins)
        : new EmptyBooleanSet(parsedSchemaKeywords.type.origins);
