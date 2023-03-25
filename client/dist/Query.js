"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Query = exports.QueryWhereOperatorMap = void 0;
var Record_1 = require("./Record");
var util_1 = require("./util");
exports.QueryWhereOperatorMap = {
    '>': '$gt',
    '<': '$lt',
    '>=': '$gte',
    '<=': '$lte',
    '==': '$eq',
};
var Query = /** @class */ (function () {
    function Query(collection, client, onSnapshotRegister) {
        var _this = this;
        this.sort = function (field, direction) {
            var q = _this.clone();
            if (!q.params.sort)
                q.params.sort = [];
            q.params.sort.push([field, direction !== null && direction !== void 0 ? direction : 'asc']);
            return q;
        };
        this.limit = function (limit) {
            var q = _this.clone();
            q.params.limit = limit;
            return q;
        };
        this.after = function (after) {
            _this.params.after = after;
            return _this;
        };
        this.before = function (before) {
            _this.params.before = before;
            return _this;
        };
        this.where = function (field, op, value) {
            var _a;
            var q = _this.clone();
            var referencedValue = value instanceof Record_1.CollectionRecord
                ? value.reference()
                : value;
            if (!q.params.where)
                q.params.where = {};
            q.params.where[field] = op === '=='
                ? referencedValue
                : (_a = {}, _a[exports.QueryWhereOperatorMap[op]] = referencedValue, _a);
            return q;
        };
        this.get = function () { return __awaiter(_this, void 0, void 0, function () {
            var isReadPubliclyAccessible, sixtyMinutes, res, meta, ast, _i, _a, record;
            var _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, this.collection.isReadPubliclyAccessible()];
                    case 1:
                        isReadPubliclyAccessible = _f.sent();
                        sixtyMinutes = 60 * 60 * 1000;
                        return [4 /*yield*/, this.client.request(this.request()).send(isReadPubliclyAccessible ? 'none' : 'required', sixtyMinutes)];
                    case 2:
                        res = _f.sent();
                        return [4 /*yield*/, this.collection.getMeta()];
                    case 3:
                        meta = _f.sent();
                        ast = JSON.parse(meta.ast);
                        for (_i = 0, _a = ((_c = (_b = res.data) === null || _b === void 0 ? void 0 : _b.data) !== null && _c !== void 0 ? _c : []); _i < _a.length; _i++) {
                            record = _a[_i];
                            (0, Record_1.deserializeRecord)(record.data, (0, util_1.getCollectionProperties)(this.collection.id, ast));
                        }
                        return [2 /*return*/, {
                                data: (_d = res.data) === null || _d === void 0 ? void 0 : _d.data,
                                cursor: (_e = res.data) === null || _e === void 0 ? void 0 : _e.cursor,
                            }];
                }
            });
        }); };
        // TODO: validate query has required indexes
        this.validate = function () { };
        this.key = function () {
            return "query:".concat(_this.collection.id, "?").concat(JSON.stringify(_this.params));
        };
        this.onSnapshot = function (fn, errFn) {
            return _this.onSnapshotRegister(_this, fn, errFn);
        };
        this.request = function () {
            return {
                url: "/collections/".concat(encodeURIComponent(_this.collection.id), "/records"),
                method: 'GET',
                params: _this.params,
            };
        };
        this.clone = function () {
            var q = new Query(_this.collection, _this.client, _this.onSnapshotRegister);
            q.params = __assign(__assign({}, _this.params), { sort: _this.params.sort ? __spreadArray([], _this.params.sort, true) : undefined, where: _this.params.where ? __assign({}, _this.params.where) : undefined });
            return q;
        };
        this.params = {};
        this.collection = collection;
        this.client = client;
        this.onSnapshotRegister = onSnapshotRegister;
    }
    return Query;
}());
exports.Query = Query;
//# sourceMappingURL=Query.js.map