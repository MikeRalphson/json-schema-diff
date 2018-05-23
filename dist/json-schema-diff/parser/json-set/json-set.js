"use strict";
// tslint:disable:max-classes-per-file
Object.defineProperty(exports, "__esModule", { value: true });
const set_1 = require("./set");
class AllJsonSet {
    constructor(schemaOrigins) {
        this.schemaOrigins = schemaOrigins;
        this.setType = 'json';
    }
    complement() {
        return new EmptyJsonSet(this.schemaOrigins);
    }
    intersect(other) {
        return other.intersectWithAll(this);
    }
    intersectWithAll(other) {
        return other.withAdditionalOrigins(this.schemaOrigins);
    }
    intersectWithEmpty(other) {
        return other.withAdditionalOrigins(this.schemaOrigins);
    }
    intersectWithSome(other) {
        return other.withAdditionalOrigins(this.schemaOrigins);
    }
    union(other) {
        return other.unionWithAll(this);
    }
    unionWithSome(other) {
        return this.withAdditionalOrigins(other.schemaOrigins);
    }
    unionWithAll(other) {
        return this.withAdditionalOrigins(other.schemaOrigins);
    }
    unionWithEmpty(other) {
        return this.withAdditionalOrigins(other.schemaOrigins);
    }
    toRepresentations() {
        return set_1.allSchemaTypes
            .map((value) => ({
            destinationValues: set_1.Set.toDestinationRepresentationValues(this.schemaOrigins),
            sourceValues: set_1.Set.toSourceRepresentationValues(this.schemaOrigins),
            type: 'type',
            value
        }));
    }
    withAdditionalOrigins(otherOrigins) {
        return new AllJsonSet(this.schemaOrigins.concat(otherOrigins));
    }
}
exports.AllJsonSet = AllJsonSet;
class EmptyJsonSet {
    constructor(schemaOrigins) {
        this.schemaOrigins = schemaOrigins;
        this.setType = 'json';
    }
    complement() {
        return new AllJsonSet(this.schemaOrigins);
    }
    intersect(other) {
        return other.intersectWithEmpty(this);
    }
    intersectWithEmpty(other) {
        return this.withAdditionalOrigins(other.schemaOrigins);
    }
    intersectWithAll(other) {
        return this.withAdditionalOrigins(other.schemaOrigins);
    }
    intersectWithSome(other) {
        return this.withAdditionalOrigins(other.schemaOrigins);
    }
    union(other) {
        return other.unionWithEmpty(this);
    }
    unionWithEmpty(other) {
        return other.withAdditionalOrigins(this.schemaOrigins);
    }
    unionWithSome(other) {
        return other.withAdditionalOrigins(this.schemaOrigins);
    }
    unionWithAll(other) {
        return other.withAdditionalOrigins(this.schemaOrigins);
    }
    toRepresentations() {
        return [];
    }
    withAdditionalOrigins(otherOrigins) {
        return new EmptyJsonSet(this.schemaOrigins.concat(otherOrigins));
    }
}
class SomeJsonSet {
    constructor(subsets) {
        this.subsets = subsets;
        this.setType = 'json';
    }
    get schemaOrigins() {
        return Object.keys(this.subsets).reduce((allOrigins, subsetName) => allOrigins.concat(this.subsets[subsetName].schemaOrigins), []);
    }
    complement() {
        return new SomeJsonSet({
            array: this.subsets.array.complement(),
            boolean: this.subsets.boolean.complement(),
            integer: this.subsets.integer.complement(),
            null: this.subsets.null.complement(),
            number: this.subsets.number.complement(),
            object: this.subsets.object.complement(),
            string: this.subsets.string.complement()
        });
    }
    intersect(other) {
        return other.intersectWithSome(this);
    }
    intersectWithAll(other) {
        return this.withAdditionalOrigins(other.schemaOrigins);
    }
    intersectWithEmpty(other) {
        return other.withAdditionalOrigins(this.schemaOrigins);
    }
    intersectWithSome(other) {
        return new SomeJsonSet({
            array: this.subsets.array.intersect(other.subsets.array),
            boolean: this.subsets.boolean.intersect(other.subsets.boolean),
            integer: this.subsets.integer.intersect(other.subsets.integer),
            null: this.subsets.null.intersect(other.subsets.null),
            number: this.subsets.number.intersect(other.subsets.number),
            object: this.subsets.object.intersect(other.subsets.object),
            string: this.subsets.string.intersect(other.subsets.string)
        });
    }
    union(other) {
        return other.unionWithSome(this);
    }
    unionWithEmpty(other) {
        return this.withAdditionalOrigins(other.schemaOrigins);
    }
    unionWithSome(other) {
        return new SomeJsonSet({
            array: this.subsets.array.union(other.subsets.array),
            boolean: this.subsets.boolean.union(other.subsets.boolean),
            integer: this.subsets.integer.union(other.subsets.integer),
            null: this.subsets.null.union(other.subsets.null),
            number: this.subsets.number.union(other.subsets.number),
            object: this.subsets.object.union(other.subsets.object),
            string: this.subsets.string.union(other.subsets.string)
        });
    }
    unionWithAll(other) {
        return other.withAdditionalOrigins(this.schemaOrigins);
    }
    toRepresentations() {
        return Object.keys(this.subsets).reduce((allRepresentations, subsetName) => allRepresentations.concat(this.subsets[subsetName].toRepresentations()), []);
    }
    withAdditionalOrigins(otherOrigins) {
        return new SomeJsonSet({
            array: this.subsets.array.withAdditionalOrigins(otherOrigins),
            boolean: this.subsets.boolean.withAdditionalOrigins(otherOrigins),
            integer: this.subsets.integer.withAdditionalOrigins(otherOrigins),
            null: this.subsets.null.withAdditionalOrigins(otherOrigins),
            number: this.subsets.number.withAdditionalOrigins(otherOrigins),
            object: this.subsets.object.withAdditionalOrigins(otherOrigins),
            string: this.subsets.string.withAdditionalOrigins(otherOrigins)
        });
    }
}
exports.createSomeJsonSet = (subsets) => {
    return new SomeJsonSet(subsets);
};
exports.createAllJsonSet = (schemaOrigins) => {
    return new AllJsonSet(schemaOrigins);
};
exports.createEmptyJsonSet = (schemaOrigins) => {
    return new EmptyJsonSet(schemaOrigins);
};
