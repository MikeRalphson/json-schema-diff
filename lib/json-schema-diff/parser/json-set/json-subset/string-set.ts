// tslint:disable:max-classes-per-file

import {ParsedSchemaKeywords, Representation, SchemaOrigin, Set} from '../set';
import {isTypeSupported} from './is-type-supported';

type StringSet = Set<'string'> & {
    intersectWithAll(otherAllSet: AllStringSet): StringSet;
    intersectWithEmpty(otherEmptySet: EmptyStringSet): StringSet;
    unionWithAll(otherAllSet: AllStringSet): StringSet;
    unionWithEmpty(otherEmptySet: EmptyStringSet): StringSet;
};

class AllStringSet implements StringSet {
    public readonly setType = 'string';

    public constructor(public readonly schemaOrigins: SchemaOrigin[]) {}

    public intersect(otherSet: StringSet): StringSet {
        return otherSet.intersectWithAll(this);
    }

    public intersectWithAll(otherAllSet: StringSet): StringSet {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherAllSet.schemaOrigins);
        return new AllStringSet(mergedSchemaOrigins);
    }

    public intersectWithEmpty(otherEmptySet: StringSet): StringSet {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherEmptySet.schemaOrigins);
        return new EmptyStringSet(mergedSchemaOrigins);
    }

    public union(otherSet: StringSet): StringSet {
        return otherSet.unionWithAll(this);
    }

    public unionWithAll(otherAllSet: StringSet): StringSet {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherAllSet.schemaOrigins);
        return new AllStringSet(mergedSchemaOrigins);
    }

    public unionWithEmpty(otherEmptySet: StringSet): StringSet {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherEmptySet.schemaOrigins);
        return new AllStringSet(mergedSchemaOrigins);
    }

    public withAdditionalOrigins(origins: SchemaOrigin[]): StringSet {
        return new AllStringSet(this.schemaOrigins.concat(origins));
    }

    public complement(): StringSet {
        return new EmptyStringSet(this.schemaOrigins);
    }

    public toRepresentations(): Representation[] {
        return [{
            destinationValues: Set.toDestinationRepresentationValues(this.schemaOrigins),
            sourceValues: Set.toSourceRepresentationValues(this.schemaOrigins),
            type: 'type',
            value: 'string'
        }];
    }
}

class EmptyStringSet implements StringSet {
    public readonly setType = 'string';

    public constructor(public readonly schemaOrigins: SchemaOrigin[]) {}

    public intersect(otherSet: StringSet): StringSet {
        return otherSet.intersectWithEmpty(this);
    }

    public intersectWithAll(otherAllSet: StringSet): StringSet {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherAllSet.schemaOrigins);
        return new EmptyStringSet(mergedSchemaOrigins);
    }

    public intersectWithEmpty(otherEmptySet: StringSet): StringSet {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherEmptySet.schemaOrigins);
        return new EmptyStringSet(mergedSchemaOrigins);
    }

    public union(otherSet: StringSet): StringSet {
        return otherSet.unionWithEmpty(this);
    }

    public unionWithAll(otherAllSet: StringSet): StringSet {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherAllSet.schemaOrigins);
        return new AllStringSet(mergedSchemaOrigins);
    }

    public unionWithEmpty(otherEmptySet: StringSet): StringSet {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherEmptySet.schemaOrigins);
        return new EmptyStringSet(mergedSchemaOrigins);
    }

    public withAdditionalOrigins(origins: SchemaOrigin[]): StringSet {
        return new EmptyStringSet(this.schemaOrigins.concat(origins));
    }

    public complement(): StringSet {
        return new AllStringSet(this.schemaOrigins);
    }

    public toRepresentations(): Representation[] {
        return [];
    }
}

export const createStringSet = (parsedSchemaKeywords: ParsedSchemaKeywords): Set<'string'> =>
    isTypeSupported(parsedSchemaKeywords, 'string')
        ? new AllStringSet(parsedSchemaKeywords.type.origins)
        : new EmptyStringSet(parsedSchemaKeywords.type.origins);
