// tslint:disable:max-classes-per-file
import {ParsedSchemaKeywords, Representation, SchemaOrigin, Set} from '../set';
import {isTypeSupported} from './is-type-supported';

type ArraySet = Set<'array'> & {
    intersectWithAll(otherAllSet: AllArraySet): ArraySet;
    intersectWithEmpty(otherEmptySet: EmptyArraySet): ArraySet;
    unionWithAll(otherAllSet: AllArraySet): ArraySet;
    unionWithEmpty(otherEmptySet: EmptyArraySet): ArraySet;
};

class AllArraySet implements ArraySet {
    public readonly setType = 'array';
    public constructor(public readonly schemaOrigins: SchemaOrigin[]) {
    }

    public intersect(otherSet: ArraySet): ArraySet {
        return otherSet.intersectWithAll(this);
    }

    public intersectWithAll(otherAllSet: ArraySet): ArraySet {
        return this.withAdditionalOrigins(otherAllSet.schemaOrigins);
    }

    public intersectWithEmpty(otherEmptySet: EmptyArraySet): ArraySet {
        return otherEmptySet.withAdditionalOrigins(this.schemaOrigins);
    }

    public union(otherSet: ArraySet): ArraySet {
        return otherSet.unionWithAll(this);
    }

    public unionWithAll(otherAllArraySet: AllArraySet): ArraySet {
        return this.withAdditionalOrigins(otherAllArraySet.schemaOrigins);
    }

    public unionWithEmpty(otherEmptySet: EmptyArraySet): ArraySet {
        return this.withAdditionalOrigins(otherEmptySet.schemaOrigins);
    }

    public complement(): ArraySet {
        return new EmptyArraySet(this.schemaOrigins);
    }

    public withAdditionalOrigins(origins: SchemaOrigin[]): ArraySet {
        return new AllArraySet(this.schemaOrigins.concat(origins));
    }

    public toRepresentations(): Representation[] {
        return [{
            destinationValues: Set.toDestinationRepresentationValues(this.schemaOrigins),
            sourceValues: Set.toSourceRepresentationValues(this.schemaOrigins),
            type: 'type',
            value: 'array'
        }];
    }
}

class EmptyArraySet implements ArraySet {
    public readonly setType = 'array';

    public constructor(public readonly schemaOrigins: SchemaOrigin[]) {
    }

    public intersect(otherSet: ArraySet): ArraySet {
        return otherSet.intersectWithEmpty(this);
    }

    public intersectWithAll(otherAllSet: ArraySet): ArraySet {
        return this.withAdditionalOrigins(otherAllSet.schemaOrigins);
    }

    public intersectWithEmpty(otherEmptySet: EmptyArraySet): ArraySet {
        return otherEmptySet.withAdditionalOrigins(this.schemaOrigins);
    }

    public union(otherSet: ArraySet): ArraySet {
        return otherSet.unionWithEmpty(this);
    }

    public unionWithAll(otherAllArraySet: AllArraySet): ArraySet {
        return otherAllArraySet.withAdditionalOrigins(this.schemaOrigins);
    }

    public unionWithEmpty(otherEmptySet: ArraySet): ArraySet {
        return this.withAdditionalOrigins(otherEmptySet.schemaOrigins);
    }

    public complement(): ArraySet {
        return new AllArraySet(this.schemaOrigins);
    }

    public withAdditionalOrigins(origins: SchemaOrigin[]): ArraySet {
        return new EmptyArraySet(this.schemaOrigins.concat(origins));
    }

    public toRepresentations(): Representation[] {
        return [];
    }
}

export const createArraySet = (parsedSchemaKeywords: ParsedSchemaKeywords): Set<'array'> =>
    isTypeSupported(parsedSchemaKeywords, 'array')
        ? new AllArraySet(parsedSchemaKeywords.type.origins)
        : new EmptyArraySet(parsedSchemaKeywords.type.origins);
