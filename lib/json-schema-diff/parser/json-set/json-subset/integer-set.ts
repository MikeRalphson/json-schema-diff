// tslint:disable:max-classes-per-file

import {ParsedSchemaKeywords, Representation, SchemaOrigin, Set} from '../set';
import {isTypeSupported} from './is-type-supported';

type IntegerSet = Set<'integer'> & {
    readonly schemaOrigins: SchemaOrigin[];
    intersectWithAll(otherAllSet: AllIntegerSet): IntegerSet;
    intersectWithEmpty(otherEmptySet: EmptyIntegerSet): IntegerSet;
    unionWithAll(otherAllSet: AllIntegerSet): IntegerSet;
    unionWithEmpty(otherEmptySet: EmptyIntegerSet): IntegerSet;
};

class AllIntegerSet implements IntegerSet {
    public readonly setType = 'integer';

    public constructor(public readonly schemaOrigins: SchemaOrigin[]) {}

    public intersect(otherSet: IntegerSet): IntegerSet {
        return otherSet.intersectWithAll(this);
    }

    public intersectWithAll(otherAllSet: IntegerSet): IntegerSet {
        return this.withAdditionalOrigins(otherAllSet.schemaOrigins);
    }

    public intersectWithEmpty(otherEmptySet: EmptyIntegerSet): IntegerSet {
        return otherEmptySet.withAdditionalOrigins(this.schemaOrigins);
    }

    public union(otherSet: IntegerSet): IntegerSet {
        return otherSet.unionWithAll(this);
    }

    public unionWithAll(otherAllSet: IntegerSet): IntegerSet {
        return this.withAdditionalOrigins(otherAllSet.schemaOrigins);
    }

    public unionWithEmpty(otherEmptySet: IntegerSet): IntegerSet {
        return this.withAdditionalOrigins(otherEmptySet.schemaOrigins);
    }

    public complement(): IntegerSet {
        return new EmptyIntegerSet(this.schemaOrigins);
    }

    public withAdditionalOrigins(origins: SchemaOrigin[]): IntegerSet {
        return new AllIntegerSet(this.schemaOrigins.concat(origins));
    }

    public toRepresentations(): Representation[] {
        return [{
            destinationValues: Set.toDestinationRepresentationValues(this.schemaOrigins),
            sourceValues: Set.toSourceRepresentationValues(this.schemaOrigins),
            type: 'type',
            value: 'integer'
        }];
    }
}

class EmptyIntegerSet implements IntegerSet {
    public readonly setType = 'integer';

    public constructor(public readonly schemaOrigins: SchemaOrigin[]) {}

    public intersect(otherSet: IntegerSet): IntegerSet {
        return otherSet.intersectWithEmpty(this);
    }

    public intersectWithAll(otherAllSet: IntegerSet): IntegerSet {
        return this.withAdditionalOrigins(otherAllSet.schemaOrigins);
    }

    public intersectWithEmpty(otherEmptySet: IntegerSet): IntegerSet {
        return this.withAdditionalOrigins(otherEmptySet.schemaOrigins);
    }

    public union(otherSet: IntegerSet): IntegerSet {
        return otherSet.unionWithEmpty(this);
    }

    public unionWithAll(otherAllSet: AllIntegerSet): IntegerSet {
        return otherAllSet.withAdditionalOrigins(this.schemaOrigins);
    }

    public unionWithEmpty(otherEmptySet: IntegerSet): IntegerSet {
        return this.withAdditionalOrigins(otherEmptySet.schemaOrigins);
    }

    public complement(): IntegerSet {
        return new AllIntegerSet(this.schemaOrigins);
    }

    public withAdditionalOrigins(origins: SchemaOrigin[]): IntegerSet {
        return new EmptyIntegerSet(this.schemaOrigins.concat(origins));
    }

    public toRepresentations(): Representation[] {
        return [];
    }
}

export const createIntegerSet = (parsedSchemaKeywords: ParsedSchemaKeywords): Set<'integer'> =>
    isTypeSupported(parsedSchemaKeywords, 'integer')
        ? new AllIntegerSet(parsedSchemaKeywords.type.origins)
        : new EmptyIntegerSet(parsedSchemaKeywords.type.origins);
