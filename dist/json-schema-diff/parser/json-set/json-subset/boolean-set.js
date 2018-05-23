"use strict";
// tslint:disable:max-classes-per-file
Object.defineProperty(exports, "__esModule", { value: true });
const set_1 = require("../set");
const is_type_supported_1 = require("./is-type-supported");
class AllBooleanSet {
    constructor(schemaOrigins) {
        this.schemaOrigins = schemaOrigins;
        this.setType = 'boolean';
    }
    intersect(otherSet) {
        return otherSet.intersectWithAll(this);
    }
    intersectWithAll(otherAllSet) {
        return this.withAdditionalOrigins(otherAllSet.schemaOrigins);
    }
    intersectWithEmpty(otherEmptySet) {
        return otherEmptySet.withAdditionalOrigins(this.schemaOrigins);
    }
    union(otherSet) {
        return otherSet.unionWithAll(this);
    }
    unionWithAll(otherAllSet) {
        return this.withAdditionalOrigins(otherAllSet.schemaOrigins);
    }
    unionWithEmpty(otherEmptySet) {
        return this.withAdditionalOrigins(otherEmptySet.schemaOrigins);
    }
    complement() {
        return new EmptyBooleanSet(this.schemaOrigins);
    }
    withAdditionalOrigins(origins) {
        return new AllBooleanSet(this.schemaOrigins.concat(origins));
    }
    toRepresentations() {
        return [{
                destinationValues: set_1.Set.toDestinationRepresentationValues(this.schemaOrigins),
                sourceValues: set_1.Set.toSourceRepresentationValues(this.schemaOrigins),
                type: 'type',
                value: 'boolean'
            }];
    }
}
class EmptyBooleanSet {
    constructor(schemaOrigins) {
        this.schemaOrigins = schemaOrigins;
        this.setType = 'boolean';
    }
    intersect(otherSet) {
        return otherSet.intersectWithEmpty(this);
    }
    intersectWithAll(otherAllSet) {
        return this.withAdditionalOrigins(otherAllSet.schemaOrigins);
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
        return this.withAdditionalOrigins(otherEmptySet.schemaOrigins);
    }
    complement() {
        return new AllBooleanSet(this.schemaOrigins);
    }
    withAdditionalOrigins(origins) {
        return new EmptyBooleanSet(this.schemaOrigins.concat(origins));
    }
    toRepresentations() {
        return [];
    }
}
exports.createBooleanSet = (parsedSchemaKeywords) => is_type_supported_1.isTypeSupported(parsedSchemaKeywords, 'boolean')
    ? new AllBooleanSet(parsedSchemaKeywords.type.origins)
    : new EmptyBooleanSet(parsedSchemaKeywords.type.origins);
