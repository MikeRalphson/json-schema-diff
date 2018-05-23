"use strict";
// tslint:disable:max-classes-per-file
Object.defineProperty(exports, "__esModule", { value: true });
const set_1 = require("../set");
const is_type_supported_1 = require("./is-type-supported");
class AllStringSet {
    constructor(schemaOrigins) {
        this.schemaOrigins = schemaOrigins;
        this.setType = 'string';
    }
    intersect(otherSet) {
        return otherSet.intersectWithAll(this);
    }
    intersectWithAll(otherAllSet) {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherAllSet.schemaOrigins);
        return new AllStringSet(mergedSchemaOrigins);
    }
    intersectWithEmpty(otherEmptySet) {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherEmptySet.schemaOrigins);
        return new EmptyStringSet(mergedSchemaOrigins);
    }
    union(otherSet) {
        return otherSet.unionWithAll(this);
    }
    unionWithAll(otherAllSet) {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherAllSet.schemaOrigins);
        return new AllStringSet(mergedSchemaOrigins);
    }
    unionWithEmpty(otherEmptySet) {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherEmptySet.schemaOrigins);
        return new AllStringSet(mergedSchemaOrigins);
    }
    withAdditionalOrigins(origins) {
        return new AllStringSet(this.schemaOrigins.concat(origins));
    }
    complement() {
        return new EmptyStringSet(this.schemaOrigins);
    }
    toRepresentations() {
        return [{
                destinationValues: set_1.Set.toDestinationRepresentationValues(this.schemaOrigins),
                sourceValues: set_1.Set.toSourceRepresentationValues(this.schemaOrigins),
                type: 'type',
                value: 'string'
            }];
    }
}
class EmptyStringSet {
    constructor(schemaOrigins) {
        this.schemaOrigins = schemaOrigins;
        this.setType = 'string';
    }
    intersect(otherSet) {
        return otherSet.intersectWithEmpty(this);
    }
    intersectWithAll(otherAllSet) {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherAllSet.schemaOrigins);
        return new EmptyStringSet(mergedSchemaOrigins);
    }
    intersectWithEmpty(otherEmptySet) {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherEmptySet.schemaOrigins);
        return new EmptyStringSet(mergedSchemaOrigins);
    }
    union(otherSet) {
        return otherSet.unionWithEmpty(this);
    }
    unionWithAll(otherAllSet) {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherAllSet.schemaOrigins);
        return new AllStringSet(mergedSchemaOrigins);
    }
    unionWithEmpty(otherEmptySet) {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherEmptySet.schemaOrigins);
        return new EmptyStringSet(mergedSchemaOrigins);
    }
    withAdditionalOrigins(origins) {
        return new EmptyStringSet(this.schemaOrigins.concat(origins));
    }
    complement() {
        return new AllStringSet(this.schemaOrigins);
    }
    toRepresentations() {
        return [];
    }
}
exports.createStringSet = (parsedSchemaKeywords) => is_type_supported_1.isTypeSupported(parsedSchemaKeywords, 'string')
    ? new AllStringSet(parsedSchemaKeywords.type.origins)
    : new EmptyStringSet(parsedSchemaKeywords.type.origins);
