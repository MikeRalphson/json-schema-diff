// tslint:disable:max-classes-per-file

import {ParsedSchemaKeywords, Representation, SchemaOrigin, Set} from '../set';
import {isTypeSupported} from './is-type-supported';

type NumberSet = Set<'number'> & {
    intersectWithAll(otherAllSet: AllNumberSet): NumberSet;
    intersectWithEmpty(otherEmptySet: EmptyNumberSet): NumberSet;
    unionWithAll(otherAllSet: AllNumberSet): NumberSet;
    unionWithEmpty(otherEmptySet: EmptyNumberSet): NumberSet;
};

class AllNumberSet implements NumberSet {
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
    public union(otherSet: NumberSet): NumberSet {
        return otherSet.unionWithAll(this);
    }

    public unionWithAll(otherAllSet: NumberSet): NumberSet {
        return this.withAdditionalOrigins(otherAllSet.schemaOrigins);
    }

    public unionWithEmpty(otherEmptySet: NumberSet): NumberSet {
        return this.withAdditionalOrigins(otherEmptySet.schemaOrigins);
    }

    public complement(): NumberSet {
        return new EmptyNumberSet(this.schemaOrigins);
    }

    public withAdditionalOrigins(origins: SchemaOrigin[]): NumberSet {
        return new AllNumberSet(this.schemaOrigins.concat(origins));
    }

    public toRepresentations(): Representation[] {
        return [{
            destinationValues: Set.toDestinationRepresentationValues(this.schemaOrigins),
            sourceValues: Set.toSourceRepresentationValues(this.schemaOrigins),
            type: 'type',
            value: 'number'
        }];
    }
}

class EmptyNumberSet implements NumberSet {
    public readonly setType = 'number';

    public constructor(public readonly schemaOrigins: SchemaOrigin[]) {}

    public intersect(otherSet: NumberSet): NumberSet {
        return otherSet.intersectWithEmpty(this);
    }

    public intersectWithAll(otherAllSet: NumberSet): NumberSet {
        return this.withAdditionalOrigins(otherAllSet.schemaOrigins);
    }

    public intersectWithEmpty(otherEmptySet: EmptyNumberSet): NumberSet {
        return otherEmptySet.withAdditionalOrigins(this.schemaOrigins);
    }

    public union(otherSet: NumberSet): NumberSet {
        return otherSet.unionWithEmpty(this);
    }

    public unionWithAll(otherAllSet: AllNumberSet): NumberSet {
        return otherAllSet.withAdditionalOrigins(this.schemaOrigins);
    }

    public unionWithEmpty(otherEmptySet: NumberSet): NumberSet {
        return this.withAdditionalOrigins(otherEmptySet.schemaOrigins);
    }

    public complement(): NumberSet {
        return new AllNumberSet(this.schemaOrigins);
    }

    public withAdditionalOrigins(origins: SchemaOrigin[]): NumberSet {
        return new EmptyNumberSet(this.schemaOrigins.concat(origins));
    }

    public toRepresentations(): Representation[] {
        return [];
    }
}

export const createNumberSet = (parsedSchemaKeywords: ParsedSchemaKeywords): Set<'number'> =>
    isTypeSupported(parsedSchemaKeywords, 'number')
        ? new AllNumberSet(parsedSchemaKeywords.type.origins)
        : new EmptyNumberSet(parsedSchemaKeywords.type.origins);
