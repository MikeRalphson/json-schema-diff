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
    inverse() {
        return new JsonSchemaSet(this.arraySet.inverse(), this.booleanSet.inverse(), this.integerSet.inverse(), this.numberSet.inverse(), this.nullSet.inverse(), this.objectSet.inverse(), this.stringSet.inverse());
    }
    intersect(other) {
        return new JsonSchemaSet(this.arraySet.intersect(other.arraySet), this.booleanSet.intersect(other.booleanSet), this.integerSet.intersect(other.integerSet), this.numberSet.intersect(other.numberSet), this.nullSet.intersect(other.nullSet), this.objectSet.intersect(other.objectSet), this.stringSet.intersect(other.stringSet));
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
