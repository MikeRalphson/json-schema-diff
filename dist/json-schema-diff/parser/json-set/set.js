"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
exports.allSchemaTypes = ['string', 'number', 'boolean', 'integer', 'array', 'object', 'null'];
class Set {
    static toSourceRepresentationValues(schemaOrigins) {
        return Set.toRepresentationValues(schemaOrigins, 'source');
    }
    static toDestinationRepresentationValues(schemaOrigins) {
        return Set.toRepresentationValues(schemaOrigins, 'destination');
    }
    static toRepresentationValues(schemaOrigins, origin) {
        const representationValuesWithDuplications = schemaOrigins
            .filter((schemaOrigin) => schemaOrigin.type === origin)
            .map((schemaOrigin) => ({
            path: schemaOrigin.path,
            value: schemaOrigin.value
        }));
        return _.uniqWith(representationValuesWithDuplications, _.isEqual);
    }
}
exports.Set = Set;
