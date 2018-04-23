"use strict";
// tslint:disable:max-classes-per-file
Object.defineProperty(exports, "__esModule", { value: true });
const set_helpers_1 = require("./set-helpers");
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
    inverse() {
        return new EmptyStringSet(this.schemaOrigins);
    }
    toRepresentations() {
        return [{
                destinationValues: set_helpers_1.toDestinationRepresentationValues(this.schemaOrigins),
                sourceValues: set_helpers_1.toSourceRepresentationValues(this.schemaOrigins),
                type: 'type',
                value: 'string'
            }];
    }
}
exports.AllStringSet = AllStringSet;
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
    inverse() {
        return new AllStringSet(this.schemaOrigins);
    }
    toRepresentations() {
        return [];
    }
}
exports.EmptyStringSet = EmptyStringSet;
