"use strict";
// tslint:disable:max-classes-per-file
Object.defineProperty(exports, "__esModule", { value: true });
const set_helpers_1 = require("./set-helpers");
class AllNullSet {
    constructor(schemaOrigins) {
        this.schemaOrigins = schemaOrigins;
        this.setType = 'null';
    }
    intersect(otherSet) {
        return otherSet.intersectWithAll(this);
    }
    intersectWithAll(otherAllSet) {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherAllSet.schemaOrigins);
        return new AllNullSet(mergedSchemaOrigins);
    }
    intersectWithEmpty(otherEmptySet) {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherEmptySet.schemaOrigins);
        return new EmptyNullSet(mergedSchemaOrigins);
    }
    inverse() {
        return new EmptyNullSet(this.schemaOrigins);
    }
    toRepresentations() {
        return [{
                destinationValues: set_helpers_1.toDestinationRepresentationValues(this.schemaOrigins),
                sourceValues: set_helpers_1.toSourceRepresentationValues(this.schemaOrigins),
                type: 'type',
                value: 'null'
            }];
    }
}
exports.AllNullSet = AllNullSet;
class EmptyNullSet {
    constructor(schemaOrigins) {
        this.schemaOrigins = schemaOrigins;
        this.setType = 'null';
    }
    intersect(otherSet) {
        return otherSet.intersectWithEmpty(this);
    }
    intersectWithAll(otherAllSet) {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherAllSet.schemaOrigins);
        return new EmptyNullSet(mergedSchemaOrigins);
    }
    intersectWithEmpty(otherEmptySet) {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherEmptySet.schemaOrigins);
        return new EmptyNullSet(mergedSchemaOrigins);
    }
    inverse() {
        return new AllNullSet(this.schemaOrigins);
    }
    toRepresentations() {
        return [];
    }
}
exports.EmptyNullSet = EmptyNullSet;
