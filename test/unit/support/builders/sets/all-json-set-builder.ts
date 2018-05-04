import {createAllJsonSet} from '../../../../../lib/json-schema-diff/parser/json-set/json-set';
import {Set} from '../../../../../lib/json-schema-diff/parser/json-set/set';
import {schemaOriginBuilder, SchemaOriginBuilder} from '../parsed-schema-keywords/schema-origin-builder';

export class AllJsonSetBuilder {
    public static defaultAllJsonSetBuilder(): AllJsonSetBuilder {
        return new AllJsonSetBuilder([]);
    }

    private constructor(private readonly origins: SchemaOriginBuilder[]) {}

    public withOrigins(origins: SchemaOriginBuilder[]): AllJsonSetBuilder {
        return new AllJsonSetBuilder(Array.from(origins));
    }

    public build(): Set<'json'> {
        return createAllJsonSet(this.origins.map((builder) => builder.build()));
    }
}

export const allJsonSetBuilder = AllJsonSetBuilder.defaultAllJsonSetBuilder()
    .withOrigins([schemaOriginBuilder.withType('source').withPath('').withValue(true)]);
