import {createSomeJsonSet, Subsets} from '../json-set';
import {ParsedSchemaKeywords, Set} from '../set';
import {createArraySet} from './array-set';
import {createBooleanSet} from './boolean-set';
import {createIntegerSet} from './integer-set';
import {createNullSet} from './null-set';
import {createNumberSet} from './number-set';
import {createObjectSet} from './object-set';
import {createStringSet} from './string-set';

export const createJsonSet = (parsedSchemaKeywords: ParsedSchemaKeywords): Set<'json'> => {
    const subsets: Subsets = {
        array: createArraySet(parsedSchemaKeywords),
        boolean: createBooleanSet(parsedSchemaKeywords),
        integer: createIntegerSet(parsedSchemaKeywords),
        null: createNullSet(parsedSchemaKeywords),
        number: createNumberSet(parsedSchemaKeywords),
        object: createObjectSet(parsedSchemaKeywords),
        string: createStringSet(parsedSchemaKeywords)
    };

    return createSomeJsonSet(subsets);
};
