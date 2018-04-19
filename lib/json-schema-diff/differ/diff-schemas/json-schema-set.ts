import {ArraySet} from './json-schema-set/array-set';
import {BooleanSet} from './json-schema-set/boolean-set';
import {IntegerSet} from './json-schema-set/integer-set';
import {NullSet} from './json-schema-set/null-set';
import {NumberSet} from './json-schema-set/number-set';
import {ObjectSet} from './json-schema-set/object-set';
import {Representation} from './json-schema-set/set';
import {StringSet} from './json-schema-set/string-set';

export class JsonSchemaSet {
    public constructor(
        private readonly arraySet: ArraySet,
        private readonly booleanSet: BooleanSet,
        private readonly integerSet: IntegerSet,
        private readonly numberSet: NumberSet,
        private readonly nullSet: NullSet,
        private readonly objectSet: ObjectSet,
        private readonly stringSet: StringSet) {}

    public inverse(): JsonSchemaSet {
        return new JsonSchemaSet(
            this.arraySet.inverse(),
            this.booleanSet.inverse(),
            this.integerSet.inverse(),
            this.numberSet.inverse(),
            this.nullSet.inverse(),
            this.objectSet.inverse(),
            this.stringSet.inverse()
        );
    }

    public intersect(other: JsonSchemaSet): JsonSchemaSet {
        return new JsonSchemaSet(
            this.arraySet.intersect(other.arraySet),
            this.booleanSet.intersect(other.booleanSet),
            this.integerSet.intersect(other.integerSet),
            this.numberSet.intersect(other.numberSet),
            this.nullSet.intersect(other.nullSet),
            this.objectSet.intersect(other.objectSet),
            this.stringSet.intersect(other.stringSet)
        );
    }

    public toRepresentations(): Representation[] {
        return this.arraySet.toRepresentations()
            .concat(this.booleanSet.toRepresentations())
            .concat(this.integerSet.toRepresentations())
            .concat(this.numberSet.toRepresentations())
            .concat(this.nullSet.toRepresentations())
            .concat(this.objectSet.toRepresentations())
            .concat(this.stringSet.toRepresentations());
    }
}
