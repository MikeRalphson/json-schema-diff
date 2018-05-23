"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:max-classes-per-file
const set_1 = require("../set");
const is_type_supported_1 = require("./is-type-supported");
class AllArraySet {
    constructor(schemaOrigins) {
        this.schemaOrigins = schemaOrigins;
        this.setType = 'array';
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
    unionWithAll(otherAllArraySet) {
        return this.withAdditionalOrigins(otherAllArraySet.schemaOrigins);
    }
    unionWithEmpty(otherEmptySet) {
        return this.withAdditionalOrigins(otherEmptySet.schemaOrigins);
    }
    complement() {
        return new EmptyArraySet(this.schemaOrigins);
    }
    withAdditionalOrigins(origins) {
        return new AllArraySet(this.schemaOrigins.concat(origins));
    }
    toRepresentations() {
        return [{
                destinationValues: set_1.Set.toDestinationRepresentationValues(this.schemaOrigins),
                sourceValues: set_1.Set.toSourceRepresentationValues(this.schemaOrigins),
                type: 'type',
                value: 'array'
            }];
    }
}
class EmptyArraySet {
    constructor(schemaOrigins) {
        this.schemaOrigins = schemaOrigins;
        this.setType = 'array';
    }
    intersect(otherSet) {
        return otherSet.intersectWithEmpty(this);
    }
    intersectWithAll(otherAllSet) {
        return this.withAdditionalOrigins(otherAllSet.schemaOrigins);
    }
    intersectWithEmpty(otherEmptySet) {
        return otherEmptySet.withAdditionalOrigins(this.schemaOrigins);
    }
    union(otherSet) {
        return otherSet.unionWithEmpty(this);
    }
    unionWithAll(otherAllArraySet) {
        return otherAllArraySet.withAdditionalOrigins(this.schemaOrigins);
    }
    unionWithEmpty(otherEmptySet) {
        return this.withAdditionalOrigins(otherEmptySet.schemaOrigins);
    }
    complement() {
        return new AllArraySet(this.schemaOrigins);
    }
    withAdditionalOrigins(origins) {
        return new EmptyArraySet(this.schemaOrigins.concat(origins));
    }
    toRepresentations() {
        return [];
    }
}
exports.createArraySet = (parsedSchemaKeywords) => is_type_supported_1.isTypeSupported(parsedSchemaKeywords, 'array')
    ? new AllArraySet(parsedSchemaKeywords.type.origins)
    : new EmptyArraySet(parsedSchemaKeywords.type.origins);
