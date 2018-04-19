import * as _ from 'lodash';
import {RepresentationValue, SchemaOrigin, SchemaOriginType} from './set';

const toRepresentationValues =
    (schemaOrigins: SchemaOrigin[], origin: SchemaOriginType): RepresentationValue[] => {
        const representationValuesWithDuplications = schemaOrigins
            .filter((schemaOrigin) => schemaOrigin.type === origin)
            .map((schemaOrigin) => ({
                location: schemaOrigin.location,
                value: schemaOrigin.value
            }));

        return _.uniqWith(representationValuesWithDuplications, _.isEqual);
    };

export const toSourceRepresentationValues = (schemaOrigins: SchemaOrigin[]): RepresentationValue[] =>
    toRepresentationValues(schemaOrigins, 'source');

export const toDestinationRepresentationValues = (schemaOrigins: SchemaOrigin[]): RepresentationValue[] =>
    toRepresentationValues(schemaOrigins, 'destination');
