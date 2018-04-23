"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const diff_schemas_1 = require("./differ/diff-schemas");
const validate_schemas_1 = require("./differ/validate-schemas");
class Differ {
    diff(sourceSchema, destinationSchema) {
        return __awaiter(this, void 0, void 0, function* () {
            yield validate_schemas_1.validateSchemas(sourceSchema, destinationSchema);
            if (typeof sourceSchema !== 'boolean' && typeof destinationSchema !== 'boolean') {
                return diff_schemas_1.diffSchemas(sourceSchema, destinationSchema);
            }
            return Promise.resolve({
                addedByDestinationSpec: false,
                differences: [],
                removedByDestinationSpec: false
            });
        });
    }
}
exports.Differ = Differ;