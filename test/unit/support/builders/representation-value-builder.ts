import * as _ from 'lodash';
import {RepresentationValue} from '../../../../lib/json-schema-diff/parser/json-set/set';

export class RepresentationValueBuilder {
    public static create(): RepresentationValueBuilder {
        return new RepresentationValueBuilder('default.path', 'default-value');
    }

    private constructor(private readonly path: string, private readonly value: any) {}

    public build(): RepresentationValue {
        return {
            path: this.path,
            value: _.cloneDeep(this.value)
        };
    }

    public withPath(newLocation: string): RepresentationValueBuilder {
        return new RepresentationValueBuilder(newLocation, this.value);
    }

    public withValue(newValue: any): RepresentationValueBuilder {
        const copyOfNewValue = _.cloneDeep(newValue);
        return new RepresentationValueBuilder(this.path, copyOfNewValue);
    }
}

export const representationValueBuilder = RepresentationValueBuilder.create();