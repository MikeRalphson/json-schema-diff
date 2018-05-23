"use strict";
// tslint:disable:max-classes-per-file
Object.defineProperty(exports, "__esModule", { value: true });
const set_1 = require("../set");
const is_type_supported_1 = require("./is-type-supported");
class AllNumberSet {
    constructor(schemaOrigins) {
        this.schemaOrigins = schemaOrigins;
        this.setType = 'number';
    }
    intersect(otherSet) {
        return otherSet.intersectWithAll(this);
    }
    intersectWithAll(otherAllSet) {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherAllSet.schemaOrigins);
        return new AllNumberSet(mergedSchemaOrigins);
    }
    intersectWithEmpty(otherEmptySet) {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherEmptySet.schemaOrigins);
        return new EmptyNumberSet(mergedSchemaOrigins);
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
        return new EmptyNumberSet(this.schemaOrigins);
    }
    withAdditionalOrigins(origins) {
        return new AllNumberSet(this.schemaOrigins.concat(origins));
    }
    toRepresentations() {
        return [{
                destinationValues: set_1.Set.toDestinationRepresentationValues(this.schemaOrigins),
                sourceValues: set_1.Set.toSourceRepresentationValues(this.schemaOrigins),
                type: 'type',
                value: 'number'
            }];
    }
}
class EmptyNumberSet {
    constructor(schemaOrigins) {
        this.schemaOrigins = schemaOrigins;
        this.setType = 'number';
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
    unionWithAll(otherAllSet) {
        return otherAllSet.withAdditionalOrigins(this.schemaOrigins);
    }
    unionWithEmpty(otherEmptySet) {
        return this.withAdditionalOrigins(otherEmptySet.schemaOrigins);
    }
    complement() {
        return new AllNumberSet(this.schemaOrigins);
    }
    withAdditionalOrigins(origins) {
        return new EmptyNumberSet(this.schemaOrigins.concat(origins));
    }
    toRepresentations() {
        return [];
    }
}
exports.createNumberSet = (parsedSchemaKeywords) => is_type_supported_1.isTypeSupported(parsedSchemaKeywords, 'number')
    ? new AllNumberSet(parsedSchemaKeywords.type.origins)
    : new EmptyNumberSet(parsedSchemaKeywords.type.origins);
