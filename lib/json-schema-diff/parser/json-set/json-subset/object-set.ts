// tslint:disable:max-classes-per-file

import _ = require('lodash');
import {
    ParsedPropertiesKeyword, Representation, SchemaOrigin, Set,
    toDestinationRepresentationValues, toSourceRepresentationValues
} from '../set';

export interface ObjectSet extends Set<'object'> {
    additionalProperties: Set<'json'>;
    properties: ParsedPropertiesKeyword;
    intersectWithAll(other: AllObjectSet): ObjectSet;
    intersectWithEmpty(other: EmptyObjectSet): ObjectSet;
    intersectWithSome(other: SomeObjectSet): ObjectSet;
    getProperty(propertyName: string): Set<'json'>;
    getPropertyNames(): string[];
}

const getUniquePropertyNames = (thisPropertyNames: string[], otherPropertyNames: string[]): string[] =>
    _.uniq(thisPropertyNames.concat(otherPropertyNames));

export class AllObjectSet implements ObjectSet {
    public readonly setType = 'object';
    public readonly type = 'all';

    public constructor(
        public readonly schemaOrigins: SchemaOrigin[],
        public readonly properties: ParsedPropertiesKeyword,
        public additionalProperties: Set<'json'>
    ) {}

    public intersect(other: ObjectSet): ObjectSet {
        return other.intersectWithAll(this);
    }

    public intersectWithSome(other: SomeObjectSet): ObjectSet {
        return intersectAllAndSome(this, other);
    }

    public intersectWithAll(other: AllObjectSet): ObjectSet {
        return new AllObjectSet(
            this.schemaOrigins.concat(other.schemaOrigins),
            intersectProperties(this, other),
            this.additionalProperties.intersect(other.additionalProperties)
        );
    }

    public intersectWithEmpty(other: EmptyObjectSet): ObjectSet {
        return intersectEmptyWithOtherObjectSet(other, this);
    }

    // TODO: this can't be asserted without keywords support
    public complement(): ObjectSet {
        return new EmptyObjectSet(
            this.schemaOrigins,
            complementProperties(this),
            this.additionalProperties.complement()
        );
    }

    public toRepresentations(): Representation[] {
        return [{
            destinationValues: toDestinationRepresentationValues(
                this.schemaOrigins
            ),
            sourceValues: toSourceRepresentationValues(
                this.schemaOrigins
            ),
            type: 'type',
            value: 'object'
        }];
    }

    public getPropertyNames(): string[] {
        return Object.keys(this.properties);
    }

    public getProperty(propertyName: string): Set<'json'> {
        return this.properties[propertyName] ? this.properties[propertyName] : this.additionalProperties;
    }
}

export class EmptyObjectSet implements ObjectSet {
    public readonly setType = 'object';
    public readonly type = 'empty';

    public constructor(
        public readonly schemaOrigins: SchemaOrigin[],
        public readonly properties: ParsedPropertiesKeyword,
        public additionalProperties: Set<'json'>
    ) {
    }

    public intersect(other: ObjectSet): ObjectSet {
        return other.intersectWithEmpty(this);
    }

    public intersectWithAll(other: AllObjectSet): ObjectSet {
        return intersectEmptyWithOtherObjectSet(this, other);
    }

    public intersectWithSome(other: SomeObjectSet): ObjectSet {
        return intersectEmptyWithOtherObjectSet(this, other);
    }

    public intersectWithEmpty(other: EmptyObjectSet): ObjectSet {
        // TODO: this can't be asserted without keywords support
        return intersectEmptyWithOtherObjectSet(this, other);
    }

    public complement(): ObjectSet {
        return new AllObjectSet(
            this.schemaOrigins,
            complementProperties(this),
            this.additionalProperties.complement()
        );
    }

    public toRepresentations(): Representation[] {
        return [];
    }

    public getProperty(propertyName: string): Set<'json'> {
        return this.properties[propertyName] ? this.properties[propertyName] : this.additionalProperties;
    }

    public getPropertyNames(): string[] {
        return Object.keys(this.properties);
    }
}

export class SomeObjectSet implements ObjectSet {
    public readonly setType = 'object';
    public readonly type = 'some';

    public constructor(public readonly schemaOrigins: SchemaOrigin[],
                       public readonly properties: ParsedPropertiesKeyword,
                       public readonly additionalProperties: Set<'json'>) {
    }

    public intersect(other: ObjectSet): ObjectSet {
        return other.intersectWithSome(this);
    }

    public intersectWithSome(other: SomeObjectSet): ObjectSet {
        // TODO: mergedSchemaOrigins can't be properly asserted without keywords support
        const mergedSchemaOrigins = this.schemaOrigins.concat(other.schemaOrigins);
        const mergedProperties = intersectProperties(this, other);
        const mergedAdditionalProperties = this.additionalProperties.intersect(other.additionalProperties);

        return new SomeObjectSet(mergedSchemaOrigins, mergedProperties, mergedAdditionalProperties);
    }

    public intersectWithAll(other: AllObjectSet): ObjectSet {
        return intersectAllAndSome(other, this);
    }

    public intersectWithEmpty(other: EmptyObjectSet): ObjectSet {
        return intersectEmptyWithOtherObjectSet(other, this);
    }

    public complement(): ObjectSet {
        return new SomeObjectSet(
            this.schemaOrigins,
            complementProperties(this),
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
            destinationValues: toDestinationRepresentationValues(this.schemaOrigins),
            sourceValues: toSourceRepresentationValues(this.schemaOrigins),
            type: 'type',
            value: 'object'
        });

        return representations;
    }

    public getProperty(propertyName: string): Set<'json'> {
        return this.properties[propertyName] ? this.properties[propertyName] : this.additionalProperties;
    }

    public getPropertyNames(): string[] {
        return Object.keys(this.properties);
    }
}

const intersectProperties = (objectSet1: ObjectSet, objectSet2: ObjectSet) => {
    const mergedProperties: ParsedPropertiesKeyword = {};
    const allPropertyNames = getUniquePropertyNames(objectSet1.getPropertyNames(), objectSet2.getPropertyNames());
    allPropertyNames.forEach((propertyName) => {
        mergedProperties[propertyName] = objectSet1.getProperty(propertyName)
            .intersect(objectSet2.getProperty(propertyName));
    });
    return mergedProperties;
};

const intersectAllAndSome = (allObjectSet: ObjectSet, someObjectSet: ObjectSet): SomeObjectSet => {
    const mergedSchemaOrigins = allObjectSet.schemaOrigins.concat(someObjectSet.schemaOrigins);
    const mergedProperties = intersectProperties(allObjectSet, someObjectSet);
    const mergedAdditionalProperties = allObjectSet.additionalProperties.intersect(someObjectSet.additionalProperties);

    return new SomeObjectSet(mergedSchemaOrigins, mergedProperties, mergedAdditionalProperties);
};

const intersectEmptyWithOtherObjectSet = (
    emptyObjectSet: EmptyObjectSet, otherObjectSet: ObjectSet
): EmptyObjectSet => {
    const mergedSchemaOrigins = emptyObjectSet.schemaOrigins.concat(otherObjectSet.schemaOrigins);
    const mergedProperties = intersectProperties(emptyObjectSet, otherObjectSet);
    const mergedAdditionalProperties = emptyObjectSet.additionalProperties
        .intersect(otherObjectSet.additionalProperties);

    return new EmptyObjectSet(mergedSchemaOrigins, mergedProperties, mergedAdditionalProperties);
};

const complementProperties = (objectSet: ObjectSet): ParsedPropertiesKeyword => {
    const complementedProperties: ParsedPropertiesKeyword = {};
    objectSet.getPropertyNames().forEach((property) => {
        complementedProperties[property] = objectSet.properties[property].complement();
    });
    return complementedProperties;
};
