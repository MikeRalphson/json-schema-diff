"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const json_set_1 = require("../json-set");
const array_set_1 = require("./array-set");
const boolean_set_1 = require("./boolean-set");
const integer_set_1 = require("./integer-set");
const null_set_1 = require("./null-set");
const number_set_1 = require("./number-set");
const object_set_1 = require("./object-set");
const string_set_1 = require("./string-set");
exports.createJsonSet = (parsedSchemaKeywords) => {
    const subsets = {
        array: array_set_1.createArraySet(parsedSchemaKeywords),
        boolean: boolean_set_1.createBooleanSet(parsedSchemaKeywords),
        integer: integer_set_1.createIntegerSet(parsedSchemaKeywords),
        null: null_set_1.createNullSet(parsedSchemaKeywords),
        number: number_set_1.createNumberSet(parsedSchemaKeywords),
        object: object_set_1.createObjectSet(parsedSchemaKeywords),
        string: string_set_1.createStringSet(parsedSchemaKeywords)
    };
    return json_set_1.createSomeJsonSet(subsets);
};
