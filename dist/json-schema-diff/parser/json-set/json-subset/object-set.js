"use strict";
// tslint:disable:max-classes-per-file
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const json_set_1 = require("../json-set");
const set_1 = require("../set");
const is_type_supported_1 = require("./is-type-supported");
const getUniquePropertyNames = (thisPropertyNames, otherPropertyNames) => _.uniq(thisPropertyNames.concat(otherPropertyNames));
class AllObjectSet {
    constructor(schemaOrigins) {
        this.schemaOrigins = schemaOrigins;
        this.setType = 'object';
    }
    intersect(otherSet) {
        return otherSet.intersectWithAll(this);
    }
    intersectWithSome(otherSomeObjectSet) {
        return otherSomeObjectSet.withAdditionalOrigins(this.schemaOrigins);
    }
    intersectWithAll(otherAllSet) {
        return otherAllSet.withAdditionalOrigins(this.schemaOrigins);
    }
    intersectWithEmpty(otherEmptySet) {
        return otherEmptySet.withAdditionalOrigins(this.schemaOrigins);
    }
    union(otherSet) {
        return otherSet.unionWithAll(this);
    }
    unionWithAll(otherAllObjectSet) {
        return this.withAdditionalOrigins(otherAllObjectSet.schemaOrigins);
    }
    unionWithEmpty(otherEmptySet) {
        return this.withAdditionalOrigins(otherEmptySet.schemaOrigins);
    }
    unionWithSome(otherSomeSet) {
        return this.withAdditionalOrigins(otherSomeSet.getAllSchemaOrigins());
    }
    withAdditionalOrigins(origins) {
        return new AllObjectSet(this.schemaOrigins.concat(origins));
    }
    complement() {
        return new EmptyObjectSet(this.schemaOrigins);
    }
    toRepresentations() {
        return [{
                destinationValues: set_1.Set.toDestinationRepresentationValues(this.schemaOrigins),
                sourceValues: set_1.Set.toSourceRepresentationValues(this.schemaOrigins),
                type: 'type',
                value: 'object'
            }];
    }
}
class EmptyObjectSet {
    constructor(schemaOrigins) {
        this.schemaOrigins = schemaOrigins;
        this.setType = 'object';
    }
    intersect(otherSet) {
        return otherSet.intersectWithEmpty(this);
    }
    intersectWithAll(otherAllSet) {
        return this.withAdditionalOrigins(otherAllSet.schemaOrigins);
    }
    intersectWithSome(otherSomeSet) {
        return this.withAdditionalOrigins(otherSomeSet.getAllSchemaOrigins());
    }
    intersectWithEmpty(otherEmptySet) {
        return this.withAdditionalOrigins(otherEmptySet.schemaOrigins);
    }
    union(otherSet) {
        return otherSet.unionWithEmpty(this);
    }
    unionWithAll(otherAllSet) {
        return otherAllSet.withAdditionalOrigins(this.schemaOrigins);
    }
    unionWithEmpty(otherEmptySet) {
        return otherEmptySet.withAdditionalOrigins(this.schemaOrigins);
    }
    unionWithSome(otherSomeSet) {
        return otherSomeSet.withAdditionalOrigins(this.schemaOrigins);
    }
    withAdditionalOrigins(origins) {
        return new EmptyObjectSet(this.schemaOrigins.concat(origins));
    }
    complement() {
        return new AllObjectSet(this.schemaOrigins);
    }
    toRepresentations() {
        return [];
    }
}
class SomeObjectSet {
    constructor(schemaOrigins, properties, additionalProperties) {
        this.schemaOrigins = schemaOrigins;
        this.properties = properties;
        this.additionalProperties = additionalProperties;
        this.setType = 'object';
    }
    intersect(otherSet) {
        return otherSet.intersectWithSome(this);
    }
    intersectWithSome(otherSomeSet) {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherSomeSet.schemaOrigins);
        const mergedProperties = this.intersectPropertiesWithOtherSomeSetProperties(otherSomeSet);
        const mergedAdditionalProperties = this.additionalProperties.intersect(otherSomeSet.additionalProperties);
        return new SomeObjectSet(mergedSchemaOrigins, mergedProperties, mergedAdditionalProperties);
    }
    intersectWithAll(otherAllSet) {
        return this.withAdditionalOrigins(otherAllSet.schemaOrigins);
    }
    intersectWithEmpty(otherEmptySet) {
        return otherEmptySet.withAdditionalOrigins(this.getAllSchemaOrigins());
    }
    union(otherSet) {
        return otherSet.unionWithSome(this);
    }
    unionWithAll(otherAllSet) {
        return otherAllSet.withAdditionalOrigins(this.getAllSchemaOrigins());
    }
    unionWithEmpty(otherEmptySet) {
        return this.withAdditionalOrigins(otherEmptySet.schemaOrigins);
    }
    unionWithSome(otherSomeSet) {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherSomeSet.schemaOrigins);
        const mergedProperties = this.unionPropertiesWithOtherSomeSetProperties(otherSomeSet);
        const mergedAdditionalProperties = this.additionalProperties.union(otherSomeSet.additionalProperties);
        return new SomeObjectSet(mergedSchemaOrigins, mergedProperties, mergedAdditionalProperties);
    }
    withAdditionalOrigins(schemaOrigins) {
        const mergedSchemaOrigins = this.schemaOrigins.concat(schemaOrigins);
        const mergedProperties = this.getPropertiesWithAdditionalSchemaOrigins(schemaOrigins);
        const mergedAdditionalProperties = this.additionalProperties.withAdditionalOrigins(schemaOrigins);
        return new SomeObjectSet(mergedSchemaOrigins, mergedProperties, mergedAdditionalProperties);
    }
    complement() {
        const complementedProperties = this.complementProperties();
        return new SomeObjectSet(this.schemaOrigins, complementedProperties, this.additionalProperties.complement());
    }
    toRepresentations() {
        const representations = [];
        this.getPropertyNames().forEach((property) => {
            representations.push(...this.properties[property].toRepresentations());
        });
        representations.push(...this.additionalProperties.toRepresentations());
        representations.push({
            destinationValues: set_1.Set.toDestinationRepresentationValues(this.schemaOrigins),
            sourceValues: set_1.Set.toSourceRepresentationValues(this.schemaOrigins),
            type: 'type',
            value: 'object'
        });
        return representations;
    }
    getAllSchemaOrigins() {
        const propertiesOrigins = this.getPropertyNames()
            .reduce((acc, propName) => acc.concat(this.properties[propName].schemaOrigins), []);
        return this.schemaOrigins.concat(propertiesOrigins).concat(this.additionalProperties.schemaOrigins);
    }
    getProperty(propertyName) {
        return this.properties[propertyName] ? this.properties[propertyName] : this.additionalProperties;
    }
    complementProperties() {
        const complementedProperties = {};
        this.getPropertyNames().forEach((property) => {
            complementedProperties[property] = this.properties[property].complement();
        });
        return complementedProperties;
    }
    getPropertyNames() {
        return Object.keys(this.properties);
    }
    intersectPropertiesWithOtherSomeSetProperties(otherSomeSet) {
        const mergedProperties = {};
        const allPropertyNames = getUniquePropertyNames(this.getPropertyNames(), otherSomeSet.getPropertyNames());
        allPropertyNames.forEach((propertyName) => {
            mergedProperties[propertyName] = this.getProperty(propertyName)
                .intersect(otherSomeSet.getProperty(propertyName));
        });
        return mergedProperties;
    }
    unionPropertiesWithOtherSomeSetProperties(otherSomeSet) {
        const mergedProperties = {};
        const allPropertyNames = getUniquePropertyNames(this.getPropertyNames(), otherSomeSet.getPropertyNames());
        allPropertyNames.forEach((propertyName) => {
            mergedProperties[propertyName] = this.getProperty(propertyName)
                .union(otherSomeSet.getProperty(propertyName));
        });
        return mergedProperties;
    }
    getPropertiesWithAdditionalSchemaOrigins(schemaOrigins) {
        const mergedProperties = {};
        this.getPropertyNames().forEach((property) => {
            mergedProperties[property] = this.properties[property].withAdditionalOrigins(schemaOrigins);
        });
        return mergedProperties;
    }
}
const supportsAllObjects = (parsedSchemaKeywords) => Object.keys(parsedSchemaKeywords.properties).length === 0
    && parsedSchemaKeywords.additionalProperties instanceof json_set_1.AllJsonSet;
exports.createObjectSet = (parsedSchemaKeywords) => {
    if (is_type_supported_1.isTypeSupported(parsedSchemaKeywords, 'object')) {
        return supportsAllObjects(parsedSchemaKeywords)
            ? new AllObjectSet(parsedSchemaKeywords.type.origins.concat(parsedSchemaKeywords.additionalProperties.schemaOrigins))
            : new SomeObjectSet(parsedSchemaKeywords.type.origins, parsedSchemaKeywords.properties, parsedSchemaKeywords.additionalProperties);
    }
    return new EmptyObjectSet(parsedSchemaKeywords.type.origins);
};
