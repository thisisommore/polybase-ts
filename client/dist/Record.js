"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeRecord = exports.Doc = exports.CollectionRecord = void 0;
var util_1 = require("./util");
var CollectionRecord = /** @class */ (function () {
    function CollectionRecord(id, collection, client, onSnapshotRegister) {
        var _this = this;
        this.call = function (functionName, args) {
            if (args === void 0) { args = []; }
            return __awaiter(_this, void 0, void 0, function () {
                var meta, ast, isCallPubliclyAccessible, res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.collection.getMeta()];
                        case 1:
                            meta = _a.sent();
                            ast = JSON.parse(meta.ast);
                            return [4 /*yield*/, this.collection.isCallPubliclyAccessible(functionName)];
                        case 2:
                            isCallPubliclyAccessible = _a.sent();
                            return [4 /*yield*/, this.client.request({
                                    url: "/collections/".concat(encodeURIComponent(this.collection.id), "/records/").concat(encodeURIComponent(this.id), "/call/").concat(encodeURIComponent(functionName)),
                                    method: 'POST',
                                    data: {
                                        args: args.map(util_1.serializeValue),
                                    },
                                }).send(isCallPubliclyAccessible ? 'optional' : 'required')];
                        case 3:
                            res = _a.sent();
                            deserializeRecord(res.data.data, (0, util_1.getCollectionProperties)(this.collection.id, ast));
                            return [2 /*return*/, res.data];
                    }
                });
            });
        };
        this.get = function () { return __awaiter(_this, void 0, void 0, function () {
            var isReadPubliclyAccessible, sixtyMinutes, res, meta, ast;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.isReadPubliclyAccessible()];
                    case 1:
                        isReadPubliclyAccessible = _a.sent();
                        sixtyMinutes = 60 * 60 * 1000;
                        return [4 /*yield*/, this.client.request(this.request()).send(isReadPubliclyAccessible ? 'none' : 'required', sixtyMinutes)
                            // Without this, we would be infinitely recursing, trying to get the meta of Collection
                        ];
                    case 2:
                        res = _a.sent();
                        if (!(this.collection.id !== 'Collection')) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.collection.getMeta()];
                    case 3:
                        meta = _a.sent();
                        ast = JSON.parse(meta.ast);
                        deserializeRecord(res.data.data, (0, util_1.getCollectionProperties)(this.collection.id, ast));
                        _a.label = 4;
                    case 4: return [2 /*return*/, res.data];
                }
            });
        }); };
        this.reference = function () { return ({
            collectionId: _this.collection.id,
            id: _this.id,
        }); };
        this.key = function () {
            return "record:".concat(_this.collection.id, "/").concat(_this.id);
        };
        this.onSnapshot = function (fn, errFn) {
            return _this.onSnapshotRegister(_this, fn, errFn);
        };
        this.request = function () { return ({
            url: "/collections/".concat(encodeURIComponent(_this.collection.id), "/records/").concat(encodeURIComponent(_this.id)),
            method: 'GET',
        }); };
        this.id = id;
        this.collection = collection;
        this.client = client;
        this.onSnapshotRegister = onSnapshotRegister;
    }
    return CollectionRecord;
}());
exports.CollectionRecord = CollectionRecord;
/**
 * @deprecated use CollectionRecord
 */
exports.Doc = CollectionRecord;
function deserializeRecord(data, properties) {
    if (!data)
        return;
    for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
        var property = properties_1[_i];
        switch (property.type.kind) {
            case 'primitive':
                switch (property.type.value) {
                    case 'bytes':
                        if (property.name in data) {
                            data[property.name] = (0, util_1.decodeBase64)(data[property.name]);
                        }
                }
                break;
            case 'object':
                deserializeRecord(data[property.name], property.type.fields);
                break;
        }
    }
}
exports.deserializeRecord = deserializeRecord;
//# sourceMappingURL=Record.js.map