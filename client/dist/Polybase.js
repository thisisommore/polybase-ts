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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Polybase = void 0;
var polylang_1 = require("@polybase/polylang");
var axios_1 = __importDefault(require("axios"));
var axios_fetch_adapter_1 = __importDefault(require("./axios-fetch-adapter"));
var Client_1 = require("./Client");
var Collection_1 = require("./Collection");
var errors_1 = require("./errors");
var defaultConfig = {
    baseURL: 'https://testnet.polybase.xyz/v0',
    clientId: 'polybase@ts/client:v0',
    sender: 'fetch' in global
        ? axios_1.default.create({ adapter: axios_fetch_adapter_1.default })
        : axios_1.default,
};
var Polybase = /** @class */ (function () {
    function Polybase(config) {
        var _this = this;
        this.collections = {};
        this.getResolvedPath = function (path) {
            if (path.startsWith('/'))
                return path.substring(1);
            return _this.config.defaultNamespace ? "".concat(_this.config.defaultNamespace, "/").concat(path) : path;
        };
        this.setCollectionCode = function (data) { return __awaiter(_this, void 0, void 0, function () {
            var id, col, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = data.id;
                        col = this.collection('Collection');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 8]);
                        return [4 /*yield*/, this.collection(id).getMeta()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, col.record(id).call('updateCode', [data.code])];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 4:
                        e_1 = _a.sent();
                        if (!(e_1 && typeof e_1 === 'object' &&
                            e_1 instanceof errors_1.PolybaseError &&
                            (e_1.reason === 'collection/not-found' || e_1.reason === 'record/not-found'))) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.collection('Collection').create([id, data.code])];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 6: throw e_1;
                    case 7: return [3 /*break*/, 8];
                    case 8: return [2 /*return*/, this.collection(data.id)];
                }
            });
        }); };
        /* Applies the given schema to the database, creating new collections and adding existing collections  */
        this.applySchema = function (schema, namespace) { return __awaiter(_this, void 0, void 0, function () {
            var collections, ns, _a, root, polybaseWithoutNamespace, _i, root_1, node;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        collections = [];
                        ns = (namespace !== null && namespace !== void 0 ? namespace : this.config.defaultNamespace);
                        if (!ns) {
                            throw (0, errors_1.createError)('collection/invalid-id', { message: 'Namespace is missing' });
                        }
                        return [4 /*yield*/, (0, polylang_1.parse)(schema, ns)
                            // We already manually prepend the namespace to the collection name,
                            // so we need a client without a default namespace.
                        ];
                    case 1:
                        _a = _b.sent(), root = _a[1];
                        polybaseWithoutNamespace = new Polybase(__assign(__assign({}, this.config), { defaultNamespace: undefined }));
                        for (_i = 0, root_1 = root; _i < root_1.length; _i++) {
                            node = root_1[_i];
                            if (node.kind !== 'collection')
                                continue;
                            collections.push(polybaseWithoutNamespace.setCollectionCode({
                                id: ns + '/' + node.name,
                                code: schema,
                            }));
                        }
                        return [4 /*yield*/, Promise.all(collections)];
                    case 2: return [2 /*return*/, _b.sent()];
                }
            });
        }); };
        this.signer = function (fn) {
            _this.client.signer = fn;
            _this.config.signer = fn;
        };
        this.config = Object.assign({}, defaultConfig, config);
        var _a = this.config, clientId = _a.clientId, baseURL = _a.baseURL;
        this.client = new Client_1.Client(this.config.sender, this.config.signer, { clientId: clientId, baseURL: baseURL });
    }
    Polybase.prototype.collection = function (path) {
        var rp = this.getResolvedPath(path);
        if (this.collections[rp])
            return this.collections[rp];
        var c = new Collection_1.Collection(rp, this.client);
        this.collections[rp] = c;
        return c;
    };
    return Polybase;
}());
exports.Polybase = Polybase;
//# sourceMappingURL=Polybase.js.map