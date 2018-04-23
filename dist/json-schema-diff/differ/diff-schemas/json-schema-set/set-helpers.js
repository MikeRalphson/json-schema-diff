"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const toRepresentationValues = (schemaOrigins, origin) => {
    const representationValuesWithDuplications = schemaOrigins
        .filter((schemaOrigin) => schemaOrigin.type === origin)
        .map((schemaOrigin) => ({
        location: schemaOrigin.location,
        value: schemaOrigin.value
    }));
    return _.uniqWith(representationValuesWithDuplications, _.isEqual);
};
exports.toSourceRepresentationValues = (schemaOrigins) => toRepresentationValues(schemaOrigins, 'source');
exports.toDestinationRepresentationValues = (schemaOrigins) => toRepresentationValues(schemaOrigins, 'destination');
