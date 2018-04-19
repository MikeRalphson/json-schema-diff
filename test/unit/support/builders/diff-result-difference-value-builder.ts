import * as _ from 'lodash';
import {DiffResultDifferenceValue} from '../../../../lib/json-schema-diff/differ';

export class DiffResultDifferenceValueBuilder {
    public static create(): DiffResultDifferenceValueBuilder {
        return new DiffResultDifferenceValueBuilder('default.location', 'default-value');
    }

    private constructor(private readonly location: string, private readonly value: any) {}

    public build(): DiffResultDifferenceValue {
        return {
            location: this.location,
            value: _.cloneDeep(this.value)
        };
    }

    public withLocation(newLocation: string): DiffResultDifferenceValueBuilder {
        return new DiffResultDifferenceValueBuilder(newLocation, this.value);
    }

    public withValue(newValue: any): DiffResultDifferenceValueBuilder {
        const copyOfNewValue = _.cloneDeep(newValue);
        return new DiffResultDifferenceValueBuilder(this.location, copyOfNewValue);
    }
}

export const diffResultDifferenceValueBuilder = DiffResultDifferenceValueBuilder.create();
