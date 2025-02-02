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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscription = void 0;
var errors_1 = require("./errors");
var defaultOptions = {
    timeout: 100,
    maxErrorTimeout: 60 * 1000,
};
var Subscription = /** @class */ (function () {
    function Subscription(req, client, isPublicallyAccessible, options) {
        var _this = this;
        this._stopped = true;
        this.errors = 0;
        this.id = 0;
        this.tick = function (id) { return __awaiter(_this, void 0, void 0, function () {
            var params, req, sixtyMinutes, isPubliclyAccessible, res, err_1, statusCode, isCancelledError, e_1, errTimeout;
            var _this = this;
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (this._stopped || id !== this.id)
                            return [2 /*return*/];
                        params = this.req.params ? __assign({}, this.req.params) : {};
                        if (this.since) {
                            params.since = "".concat(this.since);
                        }
                        _f.label = 1;
                    case 1:
                        _f.trys.push([1, 4, , 5]);
                        req = this.client.request(__assign(__assign({}, this.req), { params: params }));
                        this.aborter = req.abort;
                        sixtyMinutes = 60 * 60 * 1000;
                        return [4 /*yield*/, this.isPublicallyAccessible];
                    case 2:
                        isPubliclyAccessible = _f.sent();
                        return [4 /*yield*/, req.send(isPubliclyAccessible ? 'none' : 'required', sixtyMinutes)];
                    case 3:
                        res = _f.sent();
                        this.since = (_a = res.headers['x-polybase-timestamp']) !== null && _a !== void 0 ? _a : "".concat(Date.now() / 1000);
                        // TODO: this is not nice, we should handle proccessing resp in
                        // parent record or query
                        this.data = res.data;
                        this._listeners.forEach(function (_a) {
                            var fn = _a.fn;
                            if (_this.data)
                                fn(_this.data);
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _f.sent();
                        statusCode = (_d = (_c = (_b = err_1.statusCode) !== null && _b !== void 0 ? _b : err_1.status) !== null && _c !== void 0 ? _c : err_1.code) !== null && _d !== void 0 ? _d : (_e = err_1.response) === null || _e === void 0 ? void 0 : _e.status;
                        isCancelledError = err_1 && typeof err_1 === 'object' &&
                            err_1 instanceof errors_1.PolybaseError && err_1.reason === 'request/cancelled';
                        // Don't error for 304
                        if (statusCode !== 304 && !isCancelledError) {
                            e_1 = err_1;
                            if (!(err_1 instanceof errors_1.PolybaseError)) {
                                e_1 = (0, errors_1.wrapError)(err_1);
                            }
                            // Send error to listeners
                            this._listeners.forEach(function (_a) {
                                var errFn = _a.errFn;
                                if (errFn)
                                    errFn(e_1);
                            });
                            // Also log to console
                            // console.error(err)
                            this.errors += 1;
                            errTimeout = Math.min(1000 * this.errors, this.options.maxErrorTimeout);
                            this.timer = setTimeout(function () {
                                _this.tick(id);
                            }, errTimeout);
                            return [2 /*return*/];
                        }
                        return [3 /*break*/, 5];
                    case 5:
                        this.errors = 0;
                        // If no since has been stored, then we need to wait longer
                        // because
                        this.timer = setTimeout(function () {
                            _this.tick(id);
                        }, this.options.timeout);
                        return [2 /*return*/];
                }
            });
        }); };
        this.subscribe = function (fn, errFn) {
            var l = { fn: fn, errFn: errFn };
            _this._listeners.push(l);
            if (_this.data) {
                fn(_this.data);
            }
            _this.start();
            return function () {
                var index = _this._listeners.indexOf(l);
                // Already removed, shouldn't happen
                if (index === -1)
                    return;
                // Remove the listener
                _this._listeners.splice(index, 1);
                // Stop if no more listeners
                if (_this._listeners.length === 0) {
                    _this.stop();
                }
            };
        };
        this.start = function () {
            if (_this._stopped) {
                _this._stopped = false;
                _this.id += 1;
                _this.tick(_this.id);
            }
        };
        // TODO: prevent race conditions by waiting for abort
        // before allowing start again
        this.stop = function () {
            _this._stopped = true;
            if (_this.timer)
                clearTimeout(_this.timer);
            _this.since = undefined;
            if (_this.aborter)
                _this.aborter();
        };
        this.req = req;
        this.client = client;
        this.isPublicallyAccessible = isPublicallyAccessible !== null && isPublicallyAccessible !== void 0 ? isPublicallyAccessible : false;
        this._listeners = [];
        this.options = Object.assign({}, defaultOptions, options);
    }
    Object.defineProperty(Subscription.prototype, "listeners", {
        get: function () {
            return this._listeners;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Subscription.prototype, "stopped", {
        get: function () {
            return this._stopped;
        },
        enumerable: false,
        configurable: true
    });
    return Subscription;
}());
exports.Subscription = Subscription;
//# sourceMappingURL=Subscription.js.map