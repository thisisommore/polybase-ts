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
exports.Collection = void 0;
var Record_1 = require("./Record");
var Query_1 = require("./Query");
var Subscription_1 = require("./Subscription");
var validator_1 = require("@polybase/polylang/dist/validator");
var util_1 = require("./util");
var errors_1 = require("./errors");
var Collection = /** @class */ (function () {
    // TODO: this will be fetched
    function Collection(id, client) {
        var _this = this;
        this.querySubs = {};
        this.recordSubs = {};
        this.load = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            this.getValidator(),
                        ])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.getMeta = function () { return __awaiter(_this, void 0, void 0, function () {
            var col, res, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (this.meta)
                            return [2 /*return*/, this.meta];
                        col = new Collection('Collection', this.client);
                        return [4 /*yield*/, col.record(this.id).get()];
                    case 1:
                        res = _a.sent();
                        this.meta = res.data;
                        return [2 /*return*/, this.meta];
                    case 2:
                        e_1 = _a.sent();
                        if (e_1 && typeof e_1 === 'object' && e_1 instanceof errors_1.PolybaseError) {
                            if (e_1.reason === 'record/not-found') {
                                throw (0, errors_1.createError)('collection/not-found');
                            }
                            throw e_1;
                        }
                        throw (0, errors_1.createError)('unknown/error', { originalError: e_1 });
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.getCollectionAST = function () { return __awaiter(_this, void 0, void 0, function () {
            var meta, ast, collectionAST;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Return cached value if it exists
                        if (this.astCache)
                            return [2 /*return*/, this.astCache];
                        return [4 /*yield*/, this.getMeta()];
                    case 1:
                        meta = _a.sent();
                        ast = JSON.parse(meta.ast);
                        collectionAST = ast.find(function (node) { return node.kind === 'collection' && node.name === _this.name(); });
                        if (!collectionAST)
                            throw (0, errors_1.createError)('collection/invalid-ast');
                        this.astCache = collectionAST;
                        return [2 /*return*/, collectionAST];
                }
            });
        }); };
        this.getValidator = function () { return __awaiter(_this, void 0, void 0, function () {
            var meta, ast;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.validator)
                            return [2 /*return*/, this.validator];
                        return [4 /*yield*/, this.getMeta()];
                    case 1:
                        meta = _a.sent();
                        ast = JSON.parse(meta.ast);
                        this.validator = function (data) { return __awaiter(_this, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _b.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, (0, validator_1.validateSet)((0, util_1.getCollectionAST)(this.id, ast), data)];
                                    case 1:
                                        _b.sent();
                                        return [2 /*return*/, true];
                                    case 2:
                                        _a = _b.sent();
                                        return [2 /*return*/, false];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); };
                        return [2 /*return*/, this.validator];
                }
            });
        }); };
        this.validate = function (data) { return __awaiter(_this, void 0, void 0, function () {
            var validator;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getValidator()];
                    case 1:
                        validator = _a.sent();
                        return [4 /*yield*/, validator(data)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.isReadPubliclyAccessible = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Without this, we would recursively call this function
                if (this.id === 'Collection')
                    return [2 /*return*/, true];
                return [2 /*return*/, this.isCollectionPubliclyAccessible('read')];
            });
        }); };
        this.isCallPubliclyAccessible = function (methodName) { return __awaiter(_this, void 0, void 0, function () {
            var colAST, methodAST, methodDirectives;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Without this, we would recursively call this function
                        if (this.id === 'Collection')
                            return [2 /*return*/, true];
                        return [4 /*yield*/, this.getCollectionAST()
                            // Find the method in the AST
                        ];
                    case 1:
                        colAST = _a.sent();
                        methodAST = colAST.attributes.find(function (attr) { return attr.kind === 'method' && attr.name === methodName; });
                        if (!methodAST)
                            throw (0, errors_1.createError)('function/not-found');
                        methodDirectives = methodAST === null || methodAST === void 0 ? void 0 : methodAST.attributes.filter(function (attr) { return attr.kind === 'directive' && attr.name === 'call'; });
                        // Method has @call directives with arguments/restrictions
                        if (methodDirectives.some(function (attr) { return attr.arguments.length > 0; }))
                            return [2 /*return*/, false
                                // Method has @call any
                            ];
                        // Method has @call any
                        else if (methodDirectives.length > 0)
                            return [2 /*return*/, true
                                // Otherwise check the root of the collection
                            ];
                        // Otherwise check the root of the collection
                        return [2 /*return*/, this.isCollectionPubliclyAccessible('call')];
                }
            });
        }); };
        this.isCollectionPubliclyAccessible = function (type) { return __awaiter(_this, void 0, void 0, function () {
            var colAST, hasPublicDirective, hasTypeDirective;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCollectionAST()];
                    case 1:
                        colAST = _a.sent();
                        hasPublicDirective = colAST.attributes.some(function (attr) { return attr.kind === 'directive' && attr.name === 'public'; });
                        hasTypeDirective = colAST.attributes.some(function (attr) { var _a; return attr.kind === 'directive' && attr.name === type && ((_a = attr.arguments) === null || _a === void 0 ? void 0 : _a.length) === 0; });
                        return [2 /*return*/, hasPublicDirective || hasTypeDirective];
                }
            });
        }); };
        this.create = function (args) { return __awaiter(_this, void 0, void 0, function () {
            var meta, ast, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getMeta()];
                    case 1:
                        meta = _a.sent();
                        ast = JSON.parse(meta.ast);
                        return [4 /*yield*/, this.client.request({
                                url: "/collections/".concat(encodeURIComponent(this.id), "/records"),
                                method: 'POST',
                                data: {
                                    args: args.map(util_1.serializeValue),
                                },
                            }).send('optional')];
                    case 2:
                        res = _a.sent();
                        (0, Record_1.deserializeRecord)(res.data.data, (0, util_1.getCollectionProperties)(this.id, ast));
                        return [2 /*return*/, res.data];
                }
            });
        }); };
        this.get = function () { return __awaiter(_this, void 0, void 0, function () {
            var isPubliclyAccessible, needsAuth, sixtyMinutes, res, meta, ast, _i, _a, record;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.isReadPubliclyAccessible()];
                    case 1:
                        isPubliclyAccessible = _b.sent();
                        needsAuth = !isPubliclyAccessible;
                        sixtyMinutes = 60 * 60 * 1000;
                        return [4 /*yield*/, this.client.request({
                                url: "/collections/".concat(encodeURIComponent(this.id), "/records"),
                                method: 'GET',
                            }).send(needsAuth ? 'required' : 'none', sixtyMinutes)];
                    case 2:
                        res = _b.sent();
                        return [4 /*yield*/, this.getMeta()];
                    case 3:
                        meta = _b.sent();
                        ast = JSON.parse(meta.ast);
                        for (_i = 0, _a = res.data.data; _i < _a.length; _i++) {
                            record = _a[_i];
                            (0, Record_1.deserializeRecord)(record.data, (0, util_1.getCollectionProperties)(this.id, ast));
                        }
                        return [2 /*return*/, res.data];
                }
            });
        }); };
        this.record = function (id) {
            return new Record_1.CollectionRecord(id, _this, _this.client, _this.onCollectionRecordSnapshotRegister);
        };
        /**
         * @deprecated use .record(id: string)
         */
        this.doc = function (id) {
            return _this.record(id);
        };
        this.where = function (field, op, value) {
            return _this.createQuery().where(field, op, value);
        };
        this.sort = function (field, direction) {
            return _this.createQuery().sort(field, direction);
        };
        this.limit = function (limit) {
            return _this.createQuery().limit(limit);
        };
        this.onSnapshot = function (fn, errFn) {
            return _this.createQuery().onSnapshot(fn, errFn);
        };
        this.after = function (cursor) {
            return _this.createQuery().after(cursor);
        };
        this.before = function (cursor) {
            return _this.createQuery().before(cursor);
        };
        this.key = function () {
            return "collection:".concat(_this.id);
        };
        this.onQuerySnapshotRegister = function (q, fn, errFn) {
            var k = q.key();
            if (!_this.querySubs[k]) {
                _this.querySubs[k] = new Subscription_1.Subscription(q.request(), _this.client, _this.isReadPubliclyAccessible());
            }
            return _this.querySubs[k].subscribe(fn, errFn);
        };
        this.onCollectionRecordSnapshotRegister = function (d, fn, errFn) {
            var k = d.key();
            if (!_this.recordSubs[k]) {
                _this.recordSubs[k] = new Subscription_1.Subscription(d.request(), _this.client, _this.isReadPubliclyAccessible());
            }
            return _this.recordSubs[k].subscribe(fn, errFn);
        };
        this.id = id;
        this.client = client;
    }
    Collection.prototype.name = function () {
        return this.id.split('/').pop(); // there is always at least one element from split
    };
    Collection.prototype.createQuery = function () {
        return new Query_1.Query(this, this.client, this.onQuerySnapshotRegister);
    };
    return Collection;
}());
exports.Collection = Collection;
//# sourceMappingURL=Collection.js.map