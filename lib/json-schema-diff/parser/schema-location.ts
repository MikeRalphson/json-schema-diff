import {SchemaOriginType} from './json-set/set';

export class SchemaLocation {
    public static createRoot(schemaOriginType: SchemaOriginType): SchemaLocation {
        return new SchemaLocation(schemaOriginType, '');
    }
    private constructor(public readonly schemaOriginType: SchemaOriginType, public readonly path: string) {}

    public child(subPath: string): SchemaLocation {
        return new SchemaLocation(this.schemaOriginType, `${this.path}.${subPath}`);
    }
}
