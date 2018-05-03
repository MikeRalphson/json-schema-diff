"use strict";
// tslint:disable:max-classes-per-file
Object.defineProperty(exports, "__esModule", { value: true });
const set_helpers_1 = require("./set-helpers");
class AllIntegerSet {
    constructor(schemaOrigins) {
        this.schemaOrigins = schemaOrigins;
        this.setType = 'integer';
    }
    intersect(otherSet) {
        return otherSet.intersectWithAll(this);
    }
    intersectWithAll(otherAllSet) {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherAllSet.schemaOrigins);
        return new AllIntegerSet(mergedSchemaOrigins);
    }
    intersectWithEmpty(otherEmptySet) {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherEmptySet.schemaOrigins);
        return new EmptyIntegerSet(mergedSchemaOrigins);
    }
    union(otherSet) {
        return otherSet.unionWithAll(this);
    }
    unionWithAll(otherAllSet) {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherAllSet.schemaOrigins);
        return new AllIntegerSet(mergedSchemaOrigins);
    }
    unionWithEmpty(otherEmptySet) {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherEmptySet.schemaOrigins);
        return new AllIntegerSet(mergedSchemaOrigins);
    }
    complement() {
        return new EmptyIntegerSet(this.schemaOrigins);
    }
    toRepresentations() {
        return [{
                destinationValues: set_helpers_1.toDestinationRepresentationValues(this.schemaOrigins),
                sourceValues: set_helpers_1.toSourceRepresentationValues(this.schemaOrigins),
                type: 'type',
                value: 'integer'
            }];
    }
}
exports.AllIntegerSet = AllIntegerSet;
class EmptyIntegerSet {
    constructor(schemaOrigins) {
        this.schemaOrigins = schemaOrigins;
        this.setType = 'integer';
    }
    intersect(otherSet) {
        return otherSet.intersectWithEmpty(this);
    }
    intersectWithAll(otherAllSet) {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherAllSet.schemaOrigins);
        return new EmptyIntegerSet(mergedSchemaOrigins);
    }
    intersectWithEmpty(otherEmptySet) {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherEmptySet.schemaOrigins);
        return new EmptyIntegerSet(mergedSchemaOrigins);
    }
    union(otherSet) {
        return otherSet.unionWithEmpty(this);
    }
    unionWithAll(otherAllSet) {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherAllSet.schemaOrigins);
        return new AllIntegerSet(mergedSchemaOrigins);
    }
    unionWithEmpty(otherEmptySet) {
        const mergedSchemaOrigins = this.schemaOrigins.concat(otherEmptySet.schemaOrigins);
        return new EmptyIntegerSet(mergedSchemaOrigins);
    }
    complement() {
        return new AllIntegerSet(this.schemaOrigins);
    }
    toRepresentations() {
        return [];
    }
}
exports.EmptyIntegerSet = EmptyIntegerSet;
