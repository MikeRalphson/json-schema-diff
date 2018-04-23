"use strict";
// tslint:disable:max-classes-per-file
Object.defineProperty(exports, "__esModule", { value: true });
const set_helpers_1 = require("./set-helpers");
class AllArraySet {
    constructor(schemaOrigins) {
        this.schemaOrigins = schemaOrigins;
        this.setType = 'array';
    }
    intersect(otherSet) {
        return otherSet.intersectWithAll(this);
    }
    intersectWithAll(otherAllSet) {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherAllSet.schemaOrigins);
        return new AllArraySet(mergedSchemaOrigins);
    }
    intersectWithEmpty(otherEmptySet) {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherEmptySet.schemaOrigins);
        return new EmptyArraySet(mergedSchemaOrigins);
    }
    inverse() {
        return new EmptyArraySet(this.schemaOrigins);
    }
    toRepresentations() {
        return [{
                destinationValues: set_helpers_1.toDestinationRepresentationValues(this.schemaOrigins),
                sourceValues: set_helpers_1.toSourceRepresentationValues(this.schemaOrigins),
                type: 'type',
                value: 'array'
            }];
    }
}
exports.AllArraySet = AllArraySet;
class EmptyArraySet {
    constructor(schemaOrigins) {
        this.schemaOrigins = schemaOrigins;
        this.setType = 'array';
    }
    intersect(otherSet) {
        return otherSet.intersectWithEmpty(this);
    }
    intersectWithAll(otherAllSet) {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherAllSet.schemaOrigins);
        return new EmptyArraySet(mergedSchemaOrigins);
    }
    intersectWithEmpty(otherEmptySet) {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherEmptySet.schemaOrigins);
        return new EmptyArraySet(mergedSchemaOrigins);
    }
    inverse() {
        return new AllArraySet(this.schemaOrigins);
    }
    toRepresentations() {
        return [];
    }
}
exports.EmptyArraySet = EmptyArraySet;
