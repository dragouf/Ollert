var deferred, isFunction, isReady, ready, waitUntil, wrapper,
  __slice = [].slice;

wrapper = function (window, jQuery, opts) {
    var $, Trello, apiEndpoint, authEndpoint, authorizeURL, baseURL, collection, key, localStorage, location, parseRestArgs, readStorage, receiveMessage, storagePrefix, token, type, version, writeStorage, _fn, _fn1, _i, _j, _len, _len1, _ref, _ref1;
    $ = jQuery;
    key = opts.key, token = opts.token, apiEndpoint = opts.apiEndpoint, authEndpoint = opts.authEndpoint, version = opts.version;
    baseURL = "" + apiEndpoint + "/" + version + "/";
    location = window.location;
    Trello = {
        version: function () {
            return version;
        },
        key: function () {
            return key;
        },
        setKey: function (newKey) {
            key = newKey;
        },
        token: function () {
            return token;
        },
        setToken: function (newToken) {
            token = newToken;
        },
        rest: function () {
            var args, error, method, params, path, success, _ref;
            method = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
            _ref = parseRestArgs(args), path = _ref[0], params = _ref[1], success = _ref[2], error = _ref[3];
            opts = {
                url: "" + baseURL + path,
                type: method,
                data: {},
                dataType: "json",
                success: success,
                error: error
            };
            if (!$.support.cors) {
                opts.dataType = "jsonp";
                if (method !== "GET") {
                    opts.type = "GET";
                    $.extend(opts.data, {
                        _method: method
                    });
                }
            }
            if (key) {
                opts.data.key = key;
            }
            if (token) {
                opts.data.token = token;
            }
            if (params != null) {
                $.extend(opts.data, params);
            }
            return $.ajax(opts);
        },
        authorized: function () {
            return token != null;
        },
        deauthorize: function () {
            token = null;
            writeStorage("token", token);
        },
        authorize: function (userOpts) {
            var k, persistToken, regexToken, scope, v, _ref;
            opts = $.extend(true, {
                type: "redirect",
                persist: true,
                interactive: true,
                scope: {
                    read: true,
                    write: false,
                    account: false
                },
                expiration: "30days"
            }, userOpts);
            regexToken = /[&#]?token=([0-9a-f]{64})/;
            persistToken = function () {
                if (opts.persist && (token != null)) {
                    return writeStorage("token", token);
                }
            };
            if (opts.persist) {
                if (token == null) {
                    token = readStorage("token");
                }
            }
            if (token == null) {
                token = (_ref = regexToken.exec(location.hash)) != null ? _ref[1] : void 0;
            }
            if (this.authorized()) {
                persistToken();
                location.hash = location.hash.replace(regexToken, "");
                return typeof opts.success === "function" ? opts.success() : void 0;
            }
            if (!opts.interactive) {
                return typeof opts.error === "function" ? opts.error() : void 0;
            }
            scope = ((function () {
                var _ref1, _results;
                _ref1 = opts.scope;
                _results = [];
                for (k in _ref1) {
                    v = _ref1[k];
                    if (v) {
                        _results.push(k);
                    }
                }
                return _results;
            })()).join(",");
            switch (opts.type) {
                case "popup":
                    (function () {
                        var height, left, origin, top, width, _ref1,
                          _this = this;
                        waitUntil("authorized", function (isAuthorized) {
                            if (isAuthorized) {
                                persistToken();
                                return typeof opts.success === "function" ? opts.success() : void 0;
                            } else {
                                return typeof opts.error === "function" ? opts.error() : void 0;
                            }
                        });
                        width = 420;
                        height = 470;
                        left = window.screenX + (window.innerWidth - width) / 2;
                        top = window.screenY + (window.innerHeight - height) / 2;
                        origin = (_ref1 = /^[a-z]+:\/\/[^\/]*/.exec(location)) != null ? _ref1[0] : void 0;
                        return window.open(authorizeURL({
                            return_url: origin,
                            callback_method: "postMessage",
                            scope: scope,
                            expiration: opts.expiration,
                            name: opts.name
                        }), "trello", "width=" + width + ",height=" + height + ",left=" + left + ",top=" + top);
                    })();
                    break;
                default:
                    window.location = authorizeURL({
                        redirect_uri: location.href,
                        callback_method: "fragment",
                        scope: scope,
                        expiration: opts.expiration,
                        name: opts.name
                    });
            }
        }
    };
    _ref = ["GET", "PUT", "POST", "DELETE"];
    _fn = function (type) {
        return Trello[type.toLowerCase()] = function () {
            return this.rest.apply(this, [type].concat(__slice.call(arguments)));
        };
    };
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        type = _ref[_i];
        _fn(type);
    }
    Trello.del = Trello["delete"];
    _ref1 = ["actions", "cards", "checklists", "boards", "lists", "members", "organizations", "lists"];
    _fn1 = function (collection) {
        return Trello[collection] = {
            get: function (id, params, success, error) {
                return Trello.get("" + collection + "/" + id, params, success, error);
            }
        };
    };
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        collection = _ref1[_j];
        _fn1(collection);
    }
    window.Trello = Trello;
    authorizeURL = function (args) {
        var baseArgs;
        baseArgs = {
            response_type: "token",
            key: key
        };
        return authEndpoint + "/" + version + "/authorize?" + $.param($.extend(baseArgs, args));
    };
    parseRestArgs = function (_arg) {
        var error, params, path, success;
        path = _arg[0], params = _arg[1], success = _arg[2], error = _arg[3];
        if (isFunction(params)) {
            error = success;
            success = params;
            params = {};
        }
        path = path.replace(/^\/*/, "");
        return [path, params, success, error];
    };
    receiveMessage = function (event) {
        var _ref2;
        if (event.origin !== authEndpoint) {
            return;
        }
        if ((_ref2 = event.source) != null) {
            _ref2.close();
        }
        if ((event.data != null) && event.data.length > 4) {
            token = event.data;
        } else {
            token = null;
        }
        isReady("authorized", Trello.authorized());
    };
    localStorage = window.localStorage;
    if (localStorage != null) {
        storagePrefix = "trello_";
        readStorage = function (key) {
            return localStorage[storagePrefix + key];
        };
        writeStorage = function (key, value) {
            if (value === null) {
                return delete localStorage[storagePrefix + key];
            } else {
                return localStorage[storagePrefix + key] = value;
            }
        };
    } else {
        readStorage = writeStorage = function () { };
    }
    if (typeof window.addEventListener === "function") {
        window.addEventListener("message", receiveMessage, false);
    }
};

deferred = {};

ready = {};

waitUntil = function (name, fx) {
    var _ref;
    if (ready[name] != null) {
        return fx(ready[name]);
    } else {
        return ((_ref = deferred[name]) != null ? _ref : deferred[name] = []).push(fx);
    }
};

isReady = function (name, value) {
    var fx, fxs, _i, _len;
    ready[name] = value;
    if (deferred[name]) {
        fxs = deferred[name];
        delete deferred[name];
        for (_i = 0, _len = fxs.length; _i < _len; _i++) {
            fx = fxs[_i];
            fx(value);
        }
    }
};

isFunction = function (val) {
    return typeof val === "function";
};

wrapper(window, jQuery, opts);
