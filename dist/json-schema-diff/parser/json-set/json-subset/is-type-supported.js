"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTypeSupported = (parsedSchemaKeywords, type) => parsedSchemaKeywords.type.parsedValue.indexOf(type) >= 0;
