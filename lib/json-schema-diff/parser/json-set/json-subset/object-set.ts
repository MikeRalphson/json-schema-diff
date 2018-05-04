// tslint:disable:max-classes-per-file

import _ = require('lodash');
import {AllJsonSet} from '../json-set';
import {
    ParsedPropertiesKeyword,
    ParsedSchemaKeywords, Representation, SchemaOrigin,
    Set
} from '../set';
import {isTypeSupported} from './is-type-supported';

type ObjectSet = Set<'object'> & {
    intersectWithAll(otherAllSet: AllObjectSet): ObjectSet;
    intersectWithEmpty(otherEmptySet: EmptyObjectSet): ObjectSet;
    intersectWithSome(otherSomeSet: SomeObjectSet): ObjectSet;
    unionWithAll(otherAllSet: AllObjectSet): ObjectSet;
    unionWithEmpty(otherEmptySet: EmptyObjectSet): ObjectSet;
    unionWithSome(otherSomeSet: SomeObjectSet): ObjectSet;
};

const getUniquePropertyNames = (thisPropertyNames: string[], otherPropertyNames: string[]): string[] =>
    _.uniq(thisPropertyNames.concat(otherPropertyNames));

class AllObjectSet implements ObjectSet {
    public readonly setType = 'object';

    public constructor(public readonly schemaOrigins: SchemaOrigin[]) {
    }

    public intersect(otherSet: ObjectSet): ObjectSet {
        return otherSet.intersectWithAll(this);
    }

    public intersectWithSome(otherSomeObjectSet: SomeObjectSet): ObjectSet {
        return otherSomeObjectSet.withAdditionalOrigins(this.schemaOrigins);
    }

    public intersectWithAll(otherAllSet: AllObjectSet): ObjectSet {
        return otherAllSet.withAdditionalOrigins(this.schemaOrigins);
    }

    public intersectWithEmpty(otherEmptySet: EmptyObjectSet): ObjectSet {
        return otherEmptySet.withAdditionalOrigins(this.schemaOrigins);
    }

    public union(otherSet: ObjectSet): ObjectSet {
        return otherSet.unionWithAll(this);
    }

    public unionWithAll(otherAllObjectSet: AllObjectSet): ObjectSet {
        return this.withAdditionalOrigins(otherAllObjectSet.schemaOrigins);
    }

    public unionWithEmpty(otherEmptySet: EmptyObjectSet): ObjectSet {
        return this.withAdditionalOrigins(otherEmptySet.schemaOrigins);
    }

    public unionWithSome(otherSomeSet: SomeObjectSet): ObjectSet {
        return this.withAdditionalOrigins(otherSomeSet.getAllSchemaOrigins());
    }

    public withAdditionalOrigins(origins: SchemaOrigin[]): ObjectSet {
        return new AllObjectSet(this.schemaOrigins.concat(origins));
    }

    public complement(): ObjectSet {
        return new EmptyObjectSet(this.schemaOrigins);
    }

    public toRepresentations(): Representation[] {
        return [{
            destinationValues: Set.toDestinationRepresentationValues(this.schemaOrigins),
            sourceValues: Set.toSourceRepresentationValues(this.schemaOrigins),
            type: 'type',
            value: 'object'
        }];
    }
}

class EmptyObjectSet implements ObjectSet {
    public readonly setType = 'object';

    public constructor(public readonly schemaOrigins: SchemaOrigin[]) {
    }

    public intersect(otherSet: ObjectSet): ObjectSet {
        return otherSet.intersectWithEmpty(this);
    }

    public intersectWithAll(otherAllSet: AllObjectSet): ObjectSet {
        return this.withAdditionalOrigins(otherAllSet.schemaOrigins);
    }

    public intersectWithSome(otherSomeSet: SomeObjectSet): ObjectSet {
        return this.withAdditionalOrigins(otherSomeSet.getAllSchemaOrigins());
    }

    public intersectWithEmpty(otherEmptySet: EmptyObjectSet): ObjectSet {
        return this.withAdditionalOrigins(otherEmptySet.schemaOrigins);
    }

    public union(otherSet: ObjectSet): ObjectSet {
        return otherSet.unionWithEmpty(this);
    }

    public unionWithAll(otherAllSet: AllObjectSet): ObjectSet {
        return otherAllSet.withAdditionalOrigins(this.schemaOrigins);
    }

    public unionWithEmpty(otherEmptySet: EmptyObjectSet): ObjectSet {
        return otherEmptySet.withAdditionalOrigins(this.schemaOrigins);
    }

    public unionWithSome(otherSomeSet: SomeObjectSet): ObjectSet {
        return otherSomeSet.withAdditionalOrigins(this.schemaOrigins);
    }

    public withAdditionalOrigins(origins: SchemaOrigin[]): ObjectSet {
        return new EmptyObjectSet(this.schemaOrigins.concat(origins));
    }

    public complement(): ObjectSet {
        return new AllObjectSet(this.schemaOrigins);
    }

    public toRepresentations(): Representation[] {
        return [];
    }
}

class SomeObjectSet implements ObjectSet {
    public readonly setType = 'object';

    public constructor(public readonly schemaOrigins: SchemaOrigin[],
                       public readonly properties: ParsedPropertiesKeyword,
                       public readonly additionalProperties: Set<'json'>) {
    }

    public intersect(otherSet: ObjectSet): ObjectSet {
        return otherSet.intersectWithSome(this);
    }

    public intersectWithSome(otherSomeSet: SomeObjectSet): ObjectSet {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherSomeSet.schemaOrigins);
        const mergedProperties = this.intersectPropertiesWithOtherSomeSetProperties(otherSomeSet);
        const mergedAdditionalProperties = this.additionalProperties.intersect(otherSomeSet.additionalProperties);

        return new SomeObjectSet(mergedSchemaOrigins, mergedProperties, mergedAdditionalProperties);
    }

    public intersectWithAll(otherAllSet: AllObjectSet): ObjectSet {
        return this.withAdditionalOrigins(otherAllSet.schemaOrigins);
    }

    public intersectWithEmpty(otherEmptySet: EmptyObjectSet): ObjectSet {
        return otherEmptySet.withAdditionalOrigins(this.getAllSchemaOrigins());
    }

    public union(otherSet: ObjectSet): ObjectSet {
        return otherSet.unionWithSome(this);

    }

    public unionWithAll(otherAllSet: AllObjectSet): ObjectSet {
        return otherAllSet.withAdditionalOrigins(this.getAllSchemaOrigins());
    }

    public unionWithEmpty(otherEmptySet: EmptyObjectSet): ObjectSet {
        return this.withAdditionalOrigins(otherEmptySet.schemaOrigins);
    }

    public unionWithSome(otherSomeSet: SomeObjectSet): ObjectSet {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherSomeSet.schemaOrigins);
        const mergedProperties = this.unionPropertiesWithOtherSomeSetProperties(otherSomeSet);
        const mergedAdditionalProperties = this.additionalProperties.union(otherSomeSet.additionalProperties);

        return new SomeObjectSet(mergedSchemaOrigins, mergedProperties, mergedAdditionalProperties);
    }

    public withAdditionalOrigins(schemaOrigins: SchemaOrigin[]): ObjectSet {
        const mergedSchemaOrigins = this.schemaOrigins.concat(schemaOrigins);
        const mergedProperties = this.getPropertiesWithAdditionalSchemaOrigins(schemaOrigins);
        const mergedAdditionalProperties = this.additionalProperties.withAdditionalOrigins(schemaOrigins);

        return new SomeObjectSet(mergedSchemaOrigins, mergedProperties, mergedAdditionalProperties);
    }

    public complement(): ObjectSet {
        const complementedProperties = this.complementProperties();
        return new SomeObjectSet(
            this.schemaOrigins,
            complementedProperties,
            this.additionalProperties.complement()
        );
    }

    public toRepresentations(): Representation[] {
        const representations: Representation[] = [];
        this.getPropertyNames().forEach((property) => {
            representations.push(...this.properties[property].toRepresentations());
        });

        representations.push(...this.additionalProperties.toRepresentations());
        representations.push({
            destinationValues: Set.toDestinationRepresentationValues(this.schemaOrigins),
            sourceValues: Set.toSourceRepresentationValues(this.schemaOrigins),
            type: 'type',
            value: 'object'
        });

        return representations;
    }

    public getAllSchemaOrigins(): SchemaOrigin[] {
        const propertiesOrigins = this.getPropertyNames()
            .reduce<SchemaOrigin[]>((acc, propName) => acc.concat(this.properties[propName].schemaOrigins),
                []);

        return this.schemaOrigins.concat(propertiesOrigins).concat(this.additionalProperties.schemaOrigins);
    }

    private getProperty(propertyName: string): Set<'json'> {
        return this.properties[propertyName] ? this.properties[propertyName] : this.additionalProperties;
    }

    private complementProperties(): ParsedPropertiesKeyword {
        const complementedProperties: ParsedPropertiesKeyword = {};
        this.getPropertyNames().forEach((property) => {
            complementedProperties[property] = this.properties[property].complement();
        });
        return complementedProperties;
    }

    private getPropertyNames(): string[] {
        return Object.keys(this.properties);
    }

    private intersectPropertiesWithOtherSomeSetProperties(otherSomeSet: SomeObjectSet): ParsedPropertiesKeyword {
        const mergedProperties: ParsedPropertiesKeyword = {};
        const allPropertyNames = getUniquePropertyNames(this.getPropertyNames(), otherSomeSet.getPropertyNames());
        allPropertyNames.forEach((propertyName) => {
            mergedProperties[propertyName] = this.getProperty(propertyName)
                .intersect(otherSomeSet.getProperty(propertyName));
        });
        return mergedProperties;
    }

    private unionPropertiesWithOtherSomeSetProperties(otherSomeSet: SomeObjectSet): ParsedPropertiesKeyword {
        const mergedProperties: ParsedPropertiesKeyword = {};
        const allPropertyNames = getUniquePropertyNames(this.getPropertyNames(), otherSomeSet.getPropertyNames());
        allPropertyNames.forEach((propertyName) => {
            mergedProperties[propertyName] = this.getProperty(propertyName)
                .union(otherSomeSet.getProperty(propertyName));
        });
        return mergedProperties;
    }

    private getPropertiesWithAdditionalSchemaOrigins(schemaOrigins: SchemaOrigin[]) {
        const mergedProperties: ParsedPropertiesKeyword = {};
        this.getPropertyNames().forEach((property) => {
            mergedProperties[property] = this.properties[property].withAdditionalOrigins(schemaOrigins);
        });
        return mergedProperties;
    }
}

const supportsAllObjects = (parsedSchemaKeywords: ParsedSchemaKeywords): boolean =>
    Object.keys(parsedSchemaKeywords.properties).length === 0
    && parsedSchemaKeywords.additionalProperties instanceof AllJsonSet;

export const createObjectSet = (parsedSchemaKeywords: ParsedSchemaKeywords): ObjectSet => {
    if (isTypeSupported(parsedSchemaKeywords, 'object')) {
        return supportsAllObjects(parsedSchemaKeywords)
            ? new AllObjectSet(
                parsedSchemaKeywords.type.origins.concat(parsedSchemaKeywords.additionalProperties.schemaOrigins)
            )
            : new SomeObjectSet(
                parsedSchemaKeywords.type.origins,
                parsedSchemaKeywords.properties,
                parsedSchemaKeywords.additionalProperties);
    }
    return new EmptyObjectSet(parsedSchemaKeywords.type.origins);
};
