"use strict";
// @ts-nocheck
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
// Originally copied from https://raw.githubusercontent.com/Mailbutler/axios-fetch-adapter/54e6b00de7176df723632c738e1625a4eaa31b89/index.js
// TODO: Remove this when we fully move to using fetch instead of axios.
var axios_1 = __importDefault(require("axios"));
var settle_1 = __importDefault(require("axios/lib/core/settle"));
var buildURL_1 = __importDefault(require("axios/lib/helpers/buildURL"));
var buildFullPath_1 = __importDefault(require("axios/lib/core/buildFullPath"));
var utils_1 = require("axios/lib/utils");
/**
 * - Create a request object
 * - Get response body
 * - Check if timeout
 */
function fetchAdapter(config) {
    return __awaiter(this, void 0, void 0, function () {
        var request, promiseChain, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    request = createRequest(config);
                    promiseChain = [getResponse(request, config)];
                    if (config.timeout && config.timeout > 0) {
                        promiseChain.push(new Promise(function (resolve) {
                            setTimeout(function () {
                                var message = config.timeoutErrorMessage
                                    ? config.timeoutErrorMessage
                                    : 'timeout of ' + config.timeout + 'ms exceeded';
                                resolve(createError(message, config, 'ECONNABORTED', request));
                            }, config.timeout);
                        }));
                    }
                    return [4 /*yield*/, Promise.race(promiseChain)];
                case 1:
                    data = _a.sent();
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            if (data instanceof Error) {
                                reject(data);
                            }
                            else {
                                Object.prototype.toString.call(config.settle) === '[object Function]'
                                    ? config.settle(resolve, reject, data)
                                    : (0, settle_1.default)(resolve, reject, data);
                            }
                        })];
            }
        });
    });
}
exports.default = fetchAdapter;
/**
 * Fetch API stage two is to get response body. This funtion tries to retrieve
 * response body based on response's type
 */
function getResponse(request, config) {
    return __awaiter(this, void 0, void 0, function () {
        var stageOne, e_1, response, _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    _g.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fetch(request)];
                case 1:
                    stageOne = _g.sent();
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _g.sent();
                    return [2 /*return*/, createError('Network Error', config, 'ERR_NETWORK', request)];
                case 3:
                    response = {
                        ok: stageOne.ok,
                        status: stageOne.status,
                        statusText: stageOne.statusText,
                        headers: new Headers(stageOne.headers),
                        config: config,
                        request: request,
                    };
                    if (!(stageOne.status >= 200 && stageOne.status !== 204)) return [3 /*break*/, 14];
                    _a = config.responseType;
                    switch (_a) {
                        case 'arraybuffer': return [3 /*break*/, 4];
                        case 'blob': return [3 /*break*/, 6];
                        case 'json': return [3 /*break*/, 8];
                        case 'formData': return [3 /*break*/, 10];
                    }
                    return [3 /*break*/, 12];
                case 4:
                    _b = response;
                    return [4 /*yield*/, stageOne.arrayBuffer()];
                case 5:
                    _b.data = _g.sent();
                    return [3 /*break*/, 14];
                case 6:
                    _c = response;
                    return [4 /*yield*/, stageOne.blob()];
                case 7:
                    _c.data = _g.sent();
                    return [3 /*break*/, 14];
                case 8:
                    _d = response;
                    return [4 /*yield*/, stageOne.json()];
                case 9:
                    _d.data = _g.sent();
                    return [3 /*break*/, 14];
                case 10:
                    _e = response;
                    return [4 /*yield*/, stageOne.formData()];
                case 11:
                    _e.data = _g.sent();
                    return [3 /*break*/, 14];
                case 12:
                    _f = response;
                    return [4 /*yield*/, stageOne.text()];
                case 13:
                    _f.data = _g.sent();
                    return [3 /*break*/, 14];
                case 14: return [2 /*return*/, response];
            }
        });
    });
}
/**
 * This function will create a Request object based on configuration's axios
 */
function createRequest(config) {
    var headers = new Headers(config.headers);
    // HTTP basic authentication
    if (config.auth) {
        var username = config.auth.username || '';
        var password = config.auth.password ? decodeURI(encodeURIComponent(config.auth.password)) : '';
        headers.set('Authorization', "Basic ".concat(btoa(username + ':' + password)));
    }
    var method = config.method.toUpperCase();
    var options = {
        headers: headers,
        method: method,
    };
    if (method !== 'GET' && method !== 'HEAD') {
        options.body = config.data;
        // In these cases the browser will automatically set the correct Content-Type,
        // but only if that header hasn't been set yet. So that's why we're deleting it.
        if ((0, utils_1.isFormData)(options.body) && (0, utils_1.isStandardBrowserEnv)()) {
            headers.delete('Content-Type');
        }
    }
    if (config.mode) {
        options.mode = config.mode;
    }
    if (config.cache) {
        options.cache = config.cache;
    }
    if (config.integrity) {
        options.integrity = config.integrity;
    }
    if (config.redirect) {
        options.redirect = config.redirect;
    }
    if (config.referrer) {
        options.referrer = config.referrer;
    }
    // This config is similar to XHR’s withCredentials flag, but with three available values instead of two.
    // So if withCredentials is not set, default value 'same-origin' will be used
    if (!(0, utils_1.isUndefined)(config.withCredentials)) {
        options.credentials = config.withCredentials ? 'include' : 'omit';
    }
    var fullPath = (0, buildFullPath_1.default)(config.baseURL, config.url);
    var url = (0, buildURL_1.default)(fullPath, config.params, config.paramsSerializer);
    // Expected browser to throw error if there is any wrong configuration value
    return new Request(url, options);
}
/**
 * Note:
 *
 *   From version >= 0.27.0, createError function is replaced by AxiosError class.
 *   So I copy the old createError function here for backward compatible.
 *
 *
 *
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
function createError(message, config, code, request, response) {
    if (axios_1.default.AxiosError && typeof axios_1.default.AxiosError === 'function') {
        return new axios_1.default.AxiosError(message, axios_1.default.AxiosError[code], config, request, response);
    }
    var error = new Error(message);
    return enhanceError(error, config, code, request, response);
}
;
/**
 *
 * Note:
 *
 *   This function is for backward compatible.
 *
 *
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
function enhanceError(error, config, code, request, response) {
    error.config = config;
    if (code) {
        error.code = code;
    }
    error.request = request;
    error.response = response;
    error.isAxiosError = true;
    error.toJSON = function toJSON() {
        return {
            // Standard
            message: this.message,
            name: this.name,
            // Microsoft
            description: this.description,
            number: this.number,
            // Mozilla
            fileName: this.fileName,
            lineNumber: this.lineNumber,
            columnNumber: this.columnNumber,
            stack: this.stack,
            // Axios
            config: this.config,
            code: this.code,
            status: this.response && this.response.status ? this.response.status : null,
        };
    };
    return error;
}
;
//# sourceMappingURL=axios-fetch-adapter.js.map