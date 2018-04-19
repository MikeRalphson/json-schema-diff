import * as _ from 'lodash';
import {DiffResultDifference, DiffResultDifferenceType} from '../../../../lib/json-schema-diff/differ';
import {
diffResultDifferenceValueBuilder,
DiffResultDifferenceValueBuilder
} from './diff-result-difference-value-builder';

interface DiffResultDifferenceBuilderState {
    type: DiffResultDifferenceType;
    sourceValues: DiffResultDifferenceValueBuilder[];
    destinationValues: DiffResultDifferenceValueBuilder[];
    addedByDestinationSpec: boolean;
    removedByDestinationSpec: boolean;
    value: any;
}

export class DiffResultDifferenceBuilder {
    public static create(): DiffResultDifferenceBuilder {
        return new DiffResultDifferenceBuilder({
            addedByDestinationSpec: true,
            destinationValues: [
                diffResultDifferenceValueBuilder
                    .withLocation('default.destination.location')
                    .withValue('default-destination-value')
            ],
            removedByDestinationSpec: false,
            sourceValues: [
                diffResultDifferenceValueBuilder
                    .withLocation('default.source.location')
                    .withValue('default-source-value')
            ],
            type: 'add.type',
            value: 'default-value'
        });
    }

    private constructor(private readonly state: DiffResultDifferenceBuilderState) {}

    public build(): DiffResultDifference {
        return {
            addedByDestinationSpec: this.state.addedByDestinationSpec,
            destinationValues: this.state.destinationValues.map((builder) => builder.build()),
            removedByDestinationSpec: this.state.removedByDestinationSpec,
            sourceValues: this.state.sourceValues.map((builder) => builder.build()),
            type: this.state.type,
            value: _.cloneDeep(this.state.value)
        };
    }
    public withTypeAddType(): DiffResultDifferenceBuilder {
        return new DiffResultDifferenceBuilder({
            addedByDestinationSpec: true,
            destinationValues: this.state.destinationValues,
            removedByDestinationSpec: false,
            sourceValues: this.state.sourceValues,
            type: 'add.type',
            value: this.state.value
        });
    }

    public withTypeRemoveType(): DiffResultDifferenceBuilder {
        return new DiffResultDifferenceBuilder({
            addedByDestinationSpec: false,
            destinationValues: this.state.destinationValues,
            removedByDestinationSpec: true,
            sourceValues: this.state.sourceValues,
            type: 'remove.type',
            value: this.state.value
        });
    }

    public withSourceValues(newSourceValues: DiffResultDifferenceValueBuilder[]): DiffResultDifferenceBuilder {
        const copyOfNewSourceValues = Array.from(newSourceValues);
        return new DiffResultDifferenceBuilder({
            addedByDestinationSpec: this.state.addedByDestinationSpec,
            destinationValues: this.state.destinationValues,
            removedByDestinationSpec: this.state.removedByDestinationSpec,
            sourceValues: copyOfNewSourceValues,
            type: this.state.type,
            value: this.state.value
        });
    }

    public withSourceValue(newSourceValue: DiffResultDifferenceValueBuilder): DiffResultDifferenceBuilder {
        return new DiffResultDifferenceBuilder({
            addedByDestinationSpec: this.state.addedByDestinationSpec,
            destinationValues: this.state.destinationValues,
            removedByDestinationSpec: this.state.removedByDestinationSpec,
            sourceValues: [newSourceValue],
            type: this.state.type,
            value: this.state.value
        });
    }

    public withDestinationValues(
        newDestinationValues: DiffResultDifferenceValueBuilder[]
    ): DiffResultDifferenceBuilder {
        const copyOfNewDestinationValues = Array.from(newDestinationValues);
        return new DiffResultDifferenceBuilder({
            addedByDestinationSpec: this.state.addedByDestinationSpec,
            destinationValues: copyOfNewDestinationValues,
            removedByDestinationSpec: this.state.removedByDestinationSpec,
            sourceValues: this.state.sourceValues,
            type: this.state.type,
            value: this.state.value
        });
    }

    public withDestinationValue(newDestinationValue: DiffResultDifferenceValueBuilder): DiffResultDifferenceBuilder {
        return new DiffResultDifferenceBuilder({
            addedByDestinationSpec: this.state.addedByDestinationSpec,
            destinationValues: [newDestinationValue],
            removedByDestinationSpec: this.state.removedByDestinationSpec,
            sourceValues: this.state.sourceValues,
            type: this.state.type,
            value: this.state.value
        });
    }

    public withValue(newValue: any): DiffResultDifferenceBuilder {
        const copyOfNewValue = _.cloneDeep(newValue);
        return new DiffResultDifferenceBuilder({
            addedByDestinationSpec: this.state.addedByDestinationSpec,
            destinationValues: this.state.destinationValues,
            removedByDestinationSpec: this.state.removedByDestinationSpec,
            sourceValues: this.state.sourceValues,
            type: this.state.type,
            value: copyOfNewValue
        });
    }
}

export const diffResultDifferenceBuilder = DiffResultDifferenceBuilder.create();
