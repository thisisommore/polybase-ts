"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeValue = exports.referenceArg = exports.decodeBase64 = exports.encodeBase64 = exports.getCollectionShortNameFromId = exports.getCollectionProperties = exports.getCollectionAST = void 0;
var Record_1 = require("./Record");
function getCollectionAST(id, ast) {
    var name = getCollectionShortNameFromId(id);
    return ast.filter(function (n) { return n.kind === 'collection'; }).find(function (n) { return n.name === name; });
}
exports.getCollectionAST = getCollectionAST;
function getCollectionProperties(id, ast) {
    return getCollectionAST(id, ast).attributes.filter(function (a) { return a.kind === 'property'; });
}
exports.getCollectionProperties = getCollectionProperties;
function getCollectionShortNameFromId(id) {
    return id.split('/').pop();
}
exports.getCollectionShortNameFromId = getCollectionShortNameFromId;
function encodeBase64(value) {
    return btoa(String.fromCharCode.apply(null, value));
}
exports.encodeBase64 = encodeBase64;
function decodeBase64(value) {
    var binaryString = atob(value);
    var bytes = new Uint8Array(binaryString.length);
    for (var i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}
exports.decodeBase64 = decodeBase64;
function referenceArg(arg) {
    if (arg instanceof Record_1.CollectionRecord)
        return arg.reference();
    if (Array.isArray(arg)) {
        for (var i in arg) {
            arg[i] = referenceArg(arg[i]);
        }
    }
    return arg;
}
exports.referenceArg = referenceArg;
function serializeValue(arg) {
    if (arg instanceof Uint8Array)
        return encodeBase64(arg);
    arg = referenceArg(arg);
    return arg;
}
exports.serializeValue = serializeValue;
//# sourceMappingURL=util.js.map