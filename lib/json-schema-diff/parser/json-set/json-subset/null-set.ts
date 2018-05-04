// tslint:disable:max-classes-per-file

import {ParsedSchemaKeywords, Representation, SchemaOrigin, Set} from '../set';
import {isTypeSupported} from './is-type-supported';

type NullSet = Set<'null'> & {
    intersectWithAll(otherAllSet: AllNullSet): NullSet;
    intersectWithEmpty(otherEmptySet: EmptyNullSet): NullSet;
    unionWithAll(otherAllSet: AllNullSet): NullSet;
    unionWithEmpty(otherEmptySet: EmptyNullSet): NullSet;
};

class AllNullSet implements NullSet {
    public readonly setType = 'null';

    public constructor(public readonly schemaOrigins: SchemaOrigin[]) {}

    public intersect(otherSet: NullSet): NullSet {
        return otherSet.intersectWithAll(this);
    }

    public intersectWithAll(otherAllSet: NullSet): NullSet {
        return this.withAdditionalOrigins(otherAllSet.schemaOrigins);
    }

    public intersectWithEmpty(otherEmptySet: EmptyNullSet): NullSet {
        return otherEmptySet.withAdditionalOrigins(this.schemaOrigins);
    }

    public union(otherSet: NullSet): NullSet {
        return otherSet.unionWithAll(this);
    }

    public unionWithAll(otherAllSet: NullSet): NullSet {
        return this.withAdditionalOrigins(otherAllSet.schemaOrigins);
    }

    public unionWithEmpty(otherEmptySet: NullSet): NullSet {
        return this.withAdditionalOrigins(otherEmptySet.schemaOrigins);
    }

    public complement(): NullSet {
        return new EmptyNullSet(this.schemaOrigins);
    }

    public withAdditionalOrigins(origins: SchemaOrigin[]): NullSet {
        return new AllNullSet(this.schemaOrigins.concat(origins));
    }

    public toRepresentations(): Representation[] {
        return [{
            destinationValues: Set.toDestinationRepresentationValues(this.schemaOrigins),
            sourceValues: Set.toSourceRepresentationValues(this.schemaOrigins),
            type: 'type',
            value: 'null'
        }];
    }
}

class EmptyNullSet implements NullSet {
    public readonly setType = 'null';

    public constructor(public readonly schemaOrigins: SchemaOrigin[]) {}

    public intersect(otherSet: NullSet): NullSet {
        return otherSet.intersectWithEmpty(this);
    }

    public intersectWithAll(otherAllSet: NullSet): NullSet {
        return this.withAdditionalOrigins(otherAllSet.schemaOrigins);
    }

    public intersectWithEmpty(otherEmptySet: EmptyNullSet): NullSet {
        return otherEmptySet.withAdditionalOrigins(this.schemaOrigins);
    }

    public union(otherSet: NullSet): NullSet {
        return otherSet.unionWithEmpty(this);
    }

    public unionWithAll(otherAllSet: AllNullSet): NullSet {
        return otherAllSet.withAdditionalOrigins(this.schemaOrigins);
    }

    public unionWithEmpty(otherEmptySet: NullSet): NullSet {
        return this.withAdditionalOrigins(otherEmptySet.schemaOrigins);
    }

    public complement(): NullSet {
        return new AllNullSet(this.schemaOrigins);
    }

    public withAdditionalOrigins(origins: SchemaOrigin[]): NullSet {
        return new EmptyNullSet(this.schemaOrigins.concat(origins));
    }

    public toRepresentations(): Representation[] {
        return [];
    }
}

export const createNullSet = (parsedSchemaKeywords: ParsedSchemaKeywords): Set<'null'> =>
    isTypeSupported(parsedSchemaKeywords, 'null')
        ? new AllNullSet(parsedSchemaKeywords.type.origins)
        : new EmptyNullSet(parsedSchemaKeywords.type.origins);
