import {SimpleTypes} from '../json-schema';
import {ParsedSchemaKeywords} from '../set';

export const isTypeSupported = (parsedSchemaKeywords: ParsedSchemaKeywords, type: SimpleTypes): boolean =>
    parsedSchemaKeywords.type.parsedValue.indexOf(type) >= 0;
