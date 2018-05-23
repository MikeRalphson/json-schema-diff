"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SchemaLocation {
    constructor(schemaOriginType, path) {
        this.schemaOriginType = schemaOriginType;
        this.path = path;
    }
    static createRoot(schemaOriginType) {
        return new SchemaLocation(schemaOriginType, '');
    }
    child(subPath) {
        return new SchemaLocation(this.schemaOriginType, `${this.path}.${subPath}`);
    }
}
exports.SchemaLocation = SchemaLocation;
