"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JsonSchemaSet {
    constructor(arraySet, booleanSet, integerSet, numberSet, nullSet, objectSet, stringSet) {
        this.arraySet = arraySet;
        this.booleanSet = booleanSet;
        this.integerSet = integerSet;
        this.numberSet = numberSet;
        this.nullSet = nullSet;
        this.objectSet = objectSet;
        this.stringSet = stringSet;
    }
    complement() {
        return new JsonSchemaSet(this.arraySet.complement(), this.booleanSet.complement(), this.integerSet.complement(), this.numberSet.complement(), this.nullSet.complement(), this.objectSet.complement(), this.stringSet.complement());
    }
    intersect(other) {
        return new JsonSchemaSet(this.arraySet.intersect(other.arraySet), this.booleanSet.intersect(other.booleanSet), this.integerSet.intersect(other.integerSet), this.numberSet.intersect(other.numberSet), this.nullSet.intersect(other.nullSet), this.objectSet.intersect(other.objectSet), this.stringSet.intersect(other.stringSet));
    }
    union(other) {
        return new JsonSchemaSet(this.arraySet.union(other.arraySet), this.booleanSet.union(other.booleanSet), this.integerSet.union(other.integerSet), this.numberSet.union(other.numberSet), this.nullSet.union(other.nullSet), this.objectSet.union(other.objectSet), this.stringSet.union(other.stringSet));
    }
    toRepresentations() {
        return this.arraySet.toRepresentations()
            .concat(this.booleanSet.toRepresentations())
            .concat(this.integerSet.toRepresentations())
            .concat(this.numberSet.toRepresentations())
            .concat(this.nullSet.toRepresentations())
            .concat(this.objectSet.toRepresentations())
            .concat(this.stringSet.toRepresentations());
    }
}
exports.JsonSchemaSet = JsonSchemaSet;
