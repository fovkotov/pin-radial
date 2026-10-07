//#region \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), s = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, c = (n, r, o) => (o = n == null ? {} : e(i(n)), s(r || !n || !n.__esModule || !a.call(n, "default") ? t(o, "default", {
	value: n,
	enumerable: !0
}) : o, n)), l = /* @__PURE__ */ o(((e) => {
	function t(e, t) {
		var n = e.length;
		e.push(t);
		a: for (; 0 < n;) {
			var r = n - 1 >>> 1, a = e[r];
			if (0 < i(a, t)) e[r] = t, e[n] = a, n = r;
			else break a;
		}
	}
	function n(e) {
		return e.length === 0 ? null : e[0];
	}
	function r(e) {
		if (e.length === 0) return null;
		var t = e[0], n = e.pop();
		if (n !== t) {
			e[0] = n;
			a: for (var r = 0, a = e.length, o = a >>> 1; r < o;) {
				var s = 2 * (r + 1) - 1, c = e[s], l = s + 1, u = e[l];
				if (0 > i(c, n)) l < a && 0 > i(u, c) ? (e[r] = u, e[l] = n, r = l) : (e[r] = c, e[s] = n, r = s);
				else if (l < a && 0 > i(u, n)) e[r] = u, e[l] = n, r = l;
				else break a;
			}
		}
		return t;
	}
	function i(e, t) {
		var n = e.sortIndex - t.sortIndex;
		return n === 0 ? e.id - t.id : n;
	}
	if (e.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
		var a = performance;
		e.unstable_now = function() {
			return a.now();
		};
	} else {
		var o = Date, s = o.now();
		e.unstable_now = function() {
			return o.now() - s;
		};
	}
	var c = [], l = [], u = 1, d = null, f = 3, p = !1, m = !1, h = !1, g = !1, _ = typeof setTimeout == "function" ? setTimeout : null, v = typeof clearTimeout == "function" ? clearTimeout : null, y = typeof setImmediate < "u" ? setImmediate : null;
	function b(e) {
		for (var i = n(l); i !== null;) {
			if (i.callback === null) r(l);
			else if (i.startTime <= e) r(l), i.sortIndex = i.expirationTime, t(c, i);
			else break;
			i = n(l);
		}
	}
	function x(e) {
		if (h = !1, b(e), !m) {
			if (n(c) !== null) m = !0, S || (S = !0, O());
			else {
				var t = n(l);
				t !== null && j(x, t.startTime - e);
			}
		}
	}
	var S = !1, C = -1, w = 5, T = -1;
	function E() {
		return g ? !0 : !(e.unstable_now() - T < w);
	}
	function D() {
		if (g = !1, S) {
			var t = e.unstable_now();
			T = t;
			var i = !0;
			try {
				a: {
					m = !1, h && (h = !1, v(C), C = -1), p = !0;
					var a = f;
					try {
						b: {
							for (b(t), d = n(c); d !== null && !(d.expirationTime > t && E());) {
								var o = d.callback;
								if (typeof o == "function") {
									d.callback = null, f = d.priorityLevel;
									var s = o(d.expirationTime <= t);
									if (t = e.unstable_now(), typeof s == "function") {
										d.callback = s, b(t), i = !0;
										break b;
									}
									d === n(c) && r(c), b(t);
								} else r(c);
								d = n(c);
							}
							if (d !== null) i = !0;
							else {
								var u = n(l);
								u !== null && j(x, u.startTime - t), i = !1;
							}
						}
						break a;
					} finally {
						d = null, f = a, p = !1;
					}
					i = void 0;
				}
			} finally {
				i ? O() : S = !1;
			}
		}
	}
	var O;
	if (typeof y == "function") O = function() {
		y(D);
	};
	else if (typeof MessageChannel < "u") {
		var k = new MessageChannel(), A = k.port2;
		k.port1.onmessage = D, O = function() {
			A.postMessage(null);
		};
	} else O = function() {
		_(D, 0);
	};
	function j(t, n) {
		C = _(function() {
			t(e.unstable_now());
		}, n);
	}
	e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(e) {
		e.callback = null;
	}, e.unstable_forceFrameRate = function(e) {
		0 > e || 125 < e ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : w = 0 < e ? Math.floor(1e3 / e) : 5;
	}, e.unstable_getCurrentPriorityLevel = function() {
		return f;
	}, e.unstable_next = function(e) {
		switch (f) {
			case 1:
			case 2:
			case 3:
				var t = 3;
				break;
			default: t = f;
		}
		var n = f;
		f = t;
		try {
			return e();
		} finally {
			f = n;
		}
	}, e.unstable_requestPaint = function() {
		g = !0;
	}, e.unstable_runWithPriority = function(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 3:
			case 4:
			case 5: break;
			default: e = 3;
		}
		var n = f;
		f = e;
		try {
			return t();
		} finally {
			f = n;
		}
	}, e.unstable_scheduleCallback = function(r, i, a) {
		var o = e.unstable_now();
		switch (typeof a == "object" && a ? (a = a.delay, a = typeof a == "number" && 0 < a ? o + a : o) : a = o, r) {
			case 1:
				var s = -1;
				break;
			case 2:
				s = 250;
				break;
			case 5:
				s = 1073741823;
				break;
			case 4:
				s = 1e4;
				break;
			default: s = 5e3;
		}
		return s = a + s, r = {
			id: u++,
			callback: i,
			priorityLevel: r,
			startTime: a,
			expirationTime: s,
			sortIndex: -1
		}, a > o ? (r.sortIndex = a, t(l, r), n(c) === null && r === n(l) && (h ? (v(C), C = -1) : h = !0, j(x, a - o))) : (r.sortIndex = s, t(c, r), m || p || (m = !0, S || (S = !0, O()))), r;
	}, e.unstable_shouldYield = E, e.unstable_wrapCallback = function(e) {
		var t = f;
		return function() {
			var n = f;
			f = t;
			try {
				return e.apply(this, arguments);
			} finally {
				f = n;
			}
		};
	};
})), u = /* @__PURE__ */ o(((e, t) => {
	t.exports = l();
})), d = /* @__PURE__ */ o(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), i = Symbol.for("react.strict_mode"), a = Symbol.for("react.profiler"), o = Symbol.for("react.consumer"), s = Symbol.for("react.context"), c = Symbol.for("react.forward_ref"), l = Symbol.for("react.suspense"), u = Symbol.for("react.memo"), d = Symbol.for("react.lazy"), f = Symbol.for("react.activity"), p = Symbol.iterator;
	function m(e) {
		return typeof e != "object" || !e ? null : (e = p && e[p] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var h = {
		isMounted: function() {
			return !1;
		},
		enqueueForceUpdate: function() {},
		enqueueReplaceState: function() {},
		enqueueSetState: function() {}
	}, g = Object.assign, _ = {};
	function v(e, t, n) {
		this.props = e, this.context = t, this.refs = _, this.updater = n || h;
	}
	v.prototype.isReactComponent = {}, v.prototype.setState = function(e, t) {
		if (typeof e != "object" && typeof e != "function" && e != null) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
		this.updater.enqueueSetState(this, e, t, "setState");
	}, v.prototype.forceUpdate = function(e) {
		this.updater.enqueueForceUpdate(this, e, "forceUpdate");
	};
	function y() {}
	y.prototype = v.prototype;
	function b(e, t, n) {
		this.props = e, this.context = t, this.refs = _, this.updater = n || h;
	}
	var x = b.prototype = new y();
	x.constructor = b, g(x, v.prototype), x.isPureReactComponent = !0;
	var S = Array.isArray;
	function C() {}
	var w = {
		H: null,
		A: null,
		T: null,
		S: null
	}, T = Object.prototype.hasOwnProperty;
	function E(e, n, r) {
		var i = r.ref;
		return {
			$$typeof: t,
			type: e,
			key: n,
			ref: i === void 0 ? null : i,
			props: r
		};
	}
	function D(e, t) {
		return E(e.type, t, e.props);
	}
	function O(e) {
		return typeof e == "object" && !!e && e.$$typeof === t;
	}
	function k(e) {
		var t = {
			"=": "=0",
			":": "=2"
		};
		return "$" + e.replace(/[=:]/g, function(e) {
			return t[e];
		});
	}
	var A = /\/+/g;
	function j(e, t) {
		return typeof e == "object" && e && e.key != null ? k("" + e.key) : t.toString(36);
	}
	function M(e) {
		switch (e.status) {
			case "fulfilled": return e.value;
			case "rejected": throw e.reason;
			default: switch (typeof e.status == "string" ? e.then(C, C) : (e.status = "pending", e.then(function(t) {
				e.status === "pending" && (e.status = "fulfilled", e.value = t);
			}, function(t) {
				e.status === "pending" && (e.status = "rejected", e.reason = t);
			})), e.status) {
				case "fulfilled": return e.value;
				case "rejected": throw e.reason;
			}
		}
		throw e;
	}
	function N(e, r, i, a, o) {
		var s = typeof e;
		(s === "undefined" || s === "boolean") && (e = null);
		var c = !1;
		if (e === null) c = !0;
		else switch (s) {
			case "bigint":
			case "string":
			case "number":
				c = !0;
				break;
			case "object": switch (e.$$typeof) {
				case t:
				case n:
					c = !0;
					break;
				case d: return c = e._init, N(c(e._payload), r, i, a, o);
			}
		}
		if (c) return o = o(e), c = a === "" ? "." + j(e, 0) : a, S(o) ? (i = "", c != null && (i = c.replace(A, "$&/") + "/"), N(o, r, i, "", function(e) {
			return e;
		})) : o != null && (O(o) && (o = D(o, i + (o.key == null || e && e.key === o.key ? "" : ("" + o.key).replace(A, "$&/") + "/") + c)), r.push(o)), 1;
		c = 0;
		var l = a === "" ? "." : a + ":";
		if (S(e)) for (var u = 0; u < e.length; u++) a = e[u], s = l + j(a, u), c += N(a, r, i, s, o);
		else if (u = m(e), typeof u == "function") for (e = u.call(e), u = 0; !(a = e.next()).done;) a = a.value, s = l + j(a, u++), c += N(a, r, i, s, o);
		else if (s === "object") {
			if (typeof e.then == "function") return N(M(e), r, i, a, o);
			throw r = String(e), Error("Objects are not valid as a React child (found: " + (r === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : r) + "). If you meant to render a collection of children, use an array instead.");
		}
		return c;
	}
	function P(e, t, n) {
		if (e == null) return e;
		var r = [], i = 0;
		return N(e, r, "", "", function(e) {
			return t.call(n, e, i++);
		}), r;
	}
	function ee(e) {
		if (e._status === -1) {
			var t = e._result;
			t = t(), t.then(function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 1, e._result = t);
			}, function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 2, e._result = t);
			}), e._status === -1 && (e._status = 0, e._result = t);
		}
		if (e._status === 1) return e._result.default;
		throw e._result;
	}
	var F = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	}, I = {
		map: P,
		forEach: function(e, t, n) {
			P(e, function() {
				t.apply(this, arguments);
			}, n);
		},
		count: function(e) {
			var t = 0;
			return P(e, function() {
				t++;
			}), t;
		},
		toArray: function(e) {
			return P(e, function(e) {
				return e;
			}) || [];
		},
		only: function(e) {
			if (!O(e)) throw Error("React.Children.only expected to receive a single React element child.");
			return e;
		}
	};
	e.Activity = f, e.Children = I, e.Component = v, e.Fragment = r, e.Profiler = a, e.PureComponent = b, e.StrictMode = i, e.Suspense = l, e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = w, e.__COMPILER_RUNTIME = {
		__proto__: null,
		c: function(e) {
			return w.H.useMemoCache(e);
		}
	}, e.cache = function(e) {
		return function() {
			return e.apply(null, arguments);
		};
	}, e.cacheSignal = function() {
		return null;
	}, e.cloneElement = function(e, t, n) {
		if (e == null) throw Error("The argument must be a React element, but you passed " + e + ".");
		var r = g({}, e.props), i = e.key;
		if (t != null) for (a in t.key !== void 0 && (i = "" + t.key), t) !T.call(t, a) || a === "key" || a === "__self" || a === "__source" || a === "ref" && t.ref === void 0 || (r[a] = t[a]);
		var a = arguments.length - 2;
		if (a === 1) r.children = n;
		else if (1 < a) {
			for (var o = Array(a), s = 0; s < a; s++) o[s] = arguments[s + 2];
			r.children = o;
		}
		return E(e.type, i, r);
	}, e.createContext = function(e) {
		return e = {
			$$typeof: s,
			_currentValue: e,
			_currentValue2: e,
			_threadCount: 0,
			Provider: null,
			Consumer: null
		}, e.Provider = e, e.Consumer = {
			$$typeof: o,
			_context: e
		}, e;
	}, e.createElement = function(e, t, n) {
		var r, i = {}, a = null;
		if (t != null) for (r in t.key !== void 0 && (a = "" + t.key), t) T.call(t, r) && r !== "key" && r !== "__self" && r !== "__source" && (i[r] = t[r]);
		var o = arguments.length - 2;
		if (o === 1) i.children = n;
		else if (1 < o) {
			for (var s = Array(o), c = 0; c < o; c++) s[c] = arguments[c + 2];
			i.children = s;
		}
		if (e && e.defaultProps) for (r in o = e.defaultProps, o) i[r] === void 0 && (i[r] = o[r]);
		return E(e, a, i);
	}, e.createRef = function() {
		return { current: null };
	}, e.forwardRef = function(e) {
		return {
			$$typeof: c,
			render: e
		};
	}, e.isValidElement = O, e.lazy = function(e) {
		return {
			$$typeof: d,
			_payload: {
				_status: -1,
				_result: e
			},
			_init: ee
		};
	}, e.memo = function(e, t) {
		return {
			$$typeof: u,
			type: e,
			compare: t === void 0 ? null : t
		};
	}, e.startTransition = function(e) {
		var t = w.T, n = {};
		w.T = n;
		try {
			var r = e(), i = w.S;
			i !== null && i(n, r), typeof r == "object" && r && typeof r.then == "function" && r.then(C, F);
		} catch (e) {
			F(e);
		} finally {
			t !== null && n.types !== null && (t.types = n.types), w.T = t;
		}
	}, e.unstable_useCacheRefresh = function() {
		return w.H.useCacheRefresh();
	}, e.use = function(e) {
		return w.H.use(e);
	}, e.useActionState = function(e, t, n) {
		return w.H.useActionState(e, t, n);
	}, e.useCallback = function(e, t) {
		return w.H.useCallback(e, t);
	}, e.useContext = function(e) {
		return w.H.useContext(e);
	}, e.useDebugValue = function() {}, e.useDeferredValue = function(e, t) {
		return w.H.useDeferredValue(e, t);
	}, e.useEffect = function(e, t) {
		return w.H.useEffect(e, t);
	}, e.useEffectEvent = function(e) {
		return w.H.useEffectEvent(e);
	}, e.useId = function() {
		return w.H.useId();
	}, e.useImperativeHandle = function(e, t, n) {
		return w.H.useImperativeHandle(e, t, n);
	}, e.useInsertionEffect = function(e, t) {
		return w.H.useInsertionEffect(e, t);
	}, e.useLayoutEffect = function(e, t) {
		return w.H.useLayoutEffect(e, t);
	}, e.useMemo = function(e, t) {
		return w.H.useMemo(e, t);
	}, e.useOptimistic = function(e, t) {
		return w.H.useOptimistic(e, t);
	}, e.useReducer = function(e, t, n) {
		return w.H.useReducer(e, t, n);
	}, e.useRef = function(e) {
		return w.H.useRef(e);
	}, e.useState = function(e) {
		return w.H.useState(e);
	}, e.useSyncExternalStore = function(e, t, n) {
		return w.H.useSyncExternalStore(e, t, n);
	}, e.useTransition = function() {
		return w.H.useTransition();
	}, e.version = "19.2.8";
})), f = /* @__PURE__ */ o(((e, t) => {
	t.exports = d();
})), p = /* @__PURE__ */ o(((e) => {
	var t = f();
	function n(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function r() {}
	var i = {
		d: {
			f: r,
			r: function() {
				throw Error(n(522));
			},
			D: r,
			C: r,
			L: r,
			m: r,
			X: r,
			S: r,
			M: r
		},
		p: 0,
		findDOMNode: null
	}, a = Symbol.for("react.portal");
	function o(e, t, n) {
		var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
		return {
			$$typeof: a,
			key: r == null ? null : "" + r,
			children: e,
			containerInfo: t,
			implementation: n
		};
	}
	var s = t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
	function c(e, t) {
		if (e === "font") return "";
		if (typeof t == "string") return t === "use-credentials" ? t : "";
	}
	e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = i, e.createPortal = function(e, t) {
		var r = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
		if (!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11) throw Error(n(299));
		return o(e, t, null, r);
	}, e.flushSync = function(e) {
		var t = s.T, n = i.p;
		try {
			if (s.T = null, i.p = 2, e) return e();
		} finally {
			s.T = t, i.p = n, i.d.f();
		}
	}, e.preconnect = function(e, t) {
		typeof e == "string" && (t ? (t = t.crossOrigin, t = typeof t == "string" ? t === "use-credentials" ? t : "" : void 0) : t = null, i.d.C(e, t));
	}, e.prefetchDNS = function(e) {
		typeof e == "string" && i.d.D(e);
	}, e.preinit = function(e, t) {
		if (typeof e == "string" && t && typeof t.as == "string") {
			var n = t.as, r = c(n, t.crossOrigin), a = typeof t.integrity == "string" ? t.integrity : void 0, o = typeof t.fetchPriority == "string" ? t.fetchPriority : void 0;
			n === "style" ? i.d.S(e, typeof t.precedence == "string" ? t.precedence : void 0, {
				crossOrigin: r,
				integrity: a,
				fetchPriority: o
			}) : n === "script" && i.d.X(e, {
				crossOrigin: r,
				integrity: a,
				fetchPriority: o,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0
			});
		}
	}, e.preinitModule = function(e, t) {
		if (typeof e == "string") {
			if (typeof t == "object" && t) {
				if (t.as == null || t.as === "script") {
					var n = c(t.as, t.crossOrigin);
					i.d.M(e, {
						crossOrigin: n,
						integrity: typeof t.integrity == "string" ? t.integrity : void 0,
						nonce: typeof t.nonce == "string" ? t.nonce : void 0
					});
				}
			} else t ?? i.d.M(e);
		}
	}, e.preload = function(e, t) {
		if (typeof e == "string" && typeof t == "object" && t && typeof t.as == "string") {
			var n = t.as, r = c(n, t.crossOrigin);
			i.d.L(e, n, {
				crossOrigin: r,
				integrity: typeof t.integrity == "string" ? t.integrity : void 0,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0,
				type: typeof t.type == "string" ? t.type : void 0,
				fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0,
				referrerPolicy: typeof t.referrerPolicy == "string" ? t.referrerPolicy : void 0,
				imageSrcSet: typeof t.imageSrcSet == "string" ? t.imageSrcSet : void 0,
				imageSizes: typeof t.imageSizes == "string" ? t.imageSizes : void 0,
				media: typeof t.media == "string" ? t.media : void 0
			});
		}
	}, e.preloadModule = function(e, t) {
		if (typeof e == "string") {
			if (t) {
				var n = c(t.as, t.crossOrigin);
				i.d.m(e, {
					as: typeof t.as == "string" && t.as !== "script" ? t.as : void 0,
					crossOrigin: n,
					integrity: typeof t.integrity == "string" ? t.integrity : void 0
				});
			} else i.d.m(e);
		}
	}, e.requestFormReset = function(e) {
		i.d.r(e);
	}, e.unstable_batchedUpdates = function(e, t) {
		return e(t);
	}, e.useFormState = function(e, t, n) {
		return s.H.useFormState(e, t, n);
	}, e.useFormStatus = function() {
		return s.H.useHostTransitionStatus();
	}, e.version = "19.2.8";
})), m = /* @__PURE__ */ o(((e, t) => {
	function n() {
		if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = p();
})), h = /* @__PURE__ */ o(((e) => {
	var t = u(), n = f(), r = m();
	function i(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function a(e) {
		return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
	}
	function o(e) {
		var t = e, n = e;
		if (e.alternate) for (; t.return;) t = t.return;
		else {
			e = t;
			do
				t = e, t.flags & 4098 && (n = t.return), e = t.return;
			while (e);
		}
		return t.tag === 3 ? n : null;
	}
	function s(e) {
		if (e.tag === 13) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function c(e) {
		if (e.tag === 31) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function l(e) {
		if (o(e) !== e) throw Error(i(188));
	}
	function d(e) {
		var t = e.alternate;
		if (!t) {
			if (t = o(e), t === null) throw Error(i(188));
			return t === e ? e : null;
		}
		for (var n = e, r = t;;) {
			var a = n.return;
			if (a === null) break;
			var s = a.alternate;
			if (s === null) {
				if (r = a.return, r !== null) {
					n = r;
					continue;
				}
				break;
			}
			if (a.child === s.child) {
				for (s = a.child; s;) {
					if (s === n) return l(a), e;
					if (s === r) return l(a), t;
					s = s.sibling;
				}
				throw Error(i(188));
			}
			if (n.return !== r.return) n = a, r = s;
			else {
				for (var c = !1, u = a.child; u;) {
					if (u === n) {
						c = !0, n = a, r = s;
						break;
					}
					if (u === r) {
						c = !0, r = a, n = s;
						break;
					}
					u = u.sibling;
				}
				if (!c) {
					for (u = s.child; u;) {
						if (u === n) {
							c = !0, n = s, r = a;
							break;
						}
						if (u === r) {
							c = !0, r = s, n = a;
							break;
						}
						u = u.sibling;
					}
					if (!c) throw Error(i(189));
				}
			}
			if (n.alternate !== r) throw Error(i(190));
		}
		if (n.tag !== 3) throw Error(i(188));
		return n.stateNode.current === n ? e : t;
	}
	function p(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e;
		for (e = e.child; e !== null;) {
			if (t = p(e), t !== null) return t;
			e = e.sibling;
		}
		return null;
	}
	var h = Object.assign, g = Symbol.for("react.element"), _ = Symbol.for("react.transitional.element"), v = Symbol.for("react.portal"), y = Symbol.for("react.fragment"), b = Symbol.for("react.strict_mode"), x = Symbol.for("react.profiler"), S = Symbol.for("react.consumer"), C = Symbol.for("react.context"), w = Symbol.for("react.forward_ref"), T = Symbol.for("react.suspense"), E = Symbol.for("react.suspense_list"), D = Symbol.for("react.memo"), O = Symbol.for("react.lazy"), k = Symbol.for("react.activity"), A = Symbol.for("react.memo_cache_sentinel"), j = Symbol.iterator;
	function M(e) {
		return typeof e != "object" || !e ? null : (e = j && e[j] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var N = Symbol.for("react.client.reference");
	function P(e) {
		if (e == null) return null;
		if (typeof e == "function") return e.$$typeof === N ? null : e.displayName || e.name || null;
		if (typeof e == "string") return e;
		switch (e) {
			case y: return "Fragment";
			case x: return "Profiler";
			case b: return "StrictMode";
			case T: return "Suspense";
			case E: return "SuspenseList";
			case k: return "Activity";
		}
		if (typeof e == "object") switch (e.$$typeof) {
			case v: return "Portal";
			case C: return e.displayName || "Context";
			case S: return (e._context.displayName || "Context") + ".Consumer";
			case w:
				var t = e.render;
				return e = e.displayName, e ||= (e = t.displayName || t.name || "", e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
			case D: return t = e.displayName || null, t === null ? P(e.type) || "Memo" : t;
			case O:
				t = e._payload, e = e._init;
				try {
					return P(e(t));
				} catch {}
		}
		return null;
	}
	var ee = Array.isArray, F = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, I = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, te = {
		pending: !1,
		data: null,
		method: null,
		action: null
	}, ne = [], re = -1;
	function L(e) {
		return { current: e };
	}
	function R(e) {
		0 > re || (e.current = ne[re], ne[re] = null, re--);
	}
	function z(e, t) {
		re++, ne[re] = e.current, e.current = t;
	}
	var ie = L(null), B = L(null), ae = L(null), oe = L(null);
	function se(e, t) {
		switch (z(ae, t), z(B, e), z(ie, null), t.nodeType) {
			case 9:
			case 11:
				e = (e = t.documentElement) && (e = e.namespaceURI) ? Hd(e) : 0;
				break;
			default: if (e = t.tagName, t = t.namespaceURI) t = Hd(t), e = Ud(t, e);
			else switch (e) {
				case "svg":
					e = 1;
					break;
				case "math":
					e = 2;
					break;
				default: e = 0;
			}
		}
		R(ie), z(ie, e);
	}
	function ce() {
		R(ie), R(B), R(ae);
	}
	function V(e) {
		e.memoizedState !== null && z(oe, e);
		var t = ie.current, n = Ud(t, e.type);
		t !== n && (z(B, e), z(ie, n));
	}
	function le(e) {
		B.current === e && (R(ie), R(B)), oe.current === e && (R(oe), $f._currentValue = te);
	}
	var ue, de;
	function fe(e) {
		if (ue === void 0) try {
			throw Error();
		} catch (e) {
			var t = e.stack.trim().match(/\n( *(at )?)/);
			ue = t && t[1] || "", de = -1 < e.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
		}
		return "\n" + ue + e + de;
	}
	var pe = !1;
	function me(e, t) {
		if (!e || pe) return "";
		pe = !0;
		var n = Error.prepareStackTrace;
		Error.prepareStackTrace = void 0;
		try {
			var r = { DetermineComponentFrameRoot: function() {
				try {
					if (t) {
						var n = function() {
							throw Error();
						};
						if (Object.defineProperty(n.prototype, "props", { set: function() {
							throw Error();
						} }), typeof Reflect == "object" && Reflect.construct) {
							try {
								Reflect.construct(n, []);
							} catch (e) {
								var r = e;
							}
							Reflect.construct(e, [], n);
						} else {
							try {
								n.call();
							} catch (e) {
								r = e;
							}
							e.call(n.prototype);
						}
					} else {
						try {
							throw Error();
						} catch (e) {
							r = e;
						}
						(n = e()) && typeof n.catch == "function" && n.catch(function() {});
					}
				} catch (e) {
					if (e && r && typeof e.stack == "string") return [e.stack, r.stack];
				}
				return [null, null];
			} };
			r.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
			var i = Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot, "name");
			i && i.configurable && Object.defineProperty(r.DetermineComponentFrameRoot, "name", { value: "DetermineComponentFrameRoot" });
			var a = r.DetermineComponentFrameRoot(), o = a[0], s = a[1];
			if (o && s) {
				var c = o.split("\n"), l = s.split("\n");
				for (i = r = 0; r < c.length && !c[r].includes("DetermineComponentFrameRoot");) r++;
				for (; i < l.length && !l[i].includes("DetermineComponentFrameRoot");) i++;
				if (r === c.length || i === l.length) for (r = c.length - 1, i = l.length - 1; 1 <= r && 0 <= i && c[r] !== l[i];) i--;
				for (; 1 <= r && 0 <= i; r--, i--) if (c[r] !== l[i]) {
					if (r !== 1 || i !== 1) do
						if (r--, i--, 0 > i || c[r] !== l[i]) {
							var u = "\n" + c[r].replace(" at new ", " at ");
							return e.displayName && u.includes("<anonymous>") && (u = u.replace("<anonymous>", e.displayName)), u;
						}
					while (1 <= r && 0 <= i);
					break;
				}
			}
		} finally {
			pe = !1, Error.prepareStackTrace = n;
		}
		return (n = e ? e.displayName || e.name : "") ? fe(n) : "";
	}
	function he(e, t) {
		switch (e.tag) {
			case 26:
			case 27:
			case 5: return fe(e.type);
			case 16: return fe("Lazy");
			case 13: return e.child !== t && t !== null ? fe("Suspense Fallback") : fe("Suspense");
			case 19: return fe("SuspenseList");
			case 0:
			case 15: return me(e.type, !1);
			case 11: return me(e.type.render, !1);
			case 1: return me(e.type, !0);
			case 31: return fe("Activity");
			default: return "";
		}
	}
	function ge(e) {
		try {
			var t = "", n = null;
			do
				t += he(e, n), n = e, e = e.return;
			while (e);
			return t;
		} catch (e) {
			return "\nError generating stack: " + e.message + "\n" + e.stack;
		}
	}
	var _e = Object.prototype.hasOwnProperty, ve = t.unstable_scheduleCallback, ye = t.unstable_cancelCallback, be = t.unstable_shouldYield, xe = t.unstable_requestPaint, Se = t.unstable_now, Ce = t.unstable_getCurrentPriorityLevel, we = t.unstable_ImmediatePriority, Te = t.unstable_UserBlockingPriority, Ee = t.unstable_NormalPriority, De = t.unstable_LowPriority, Oe = t.unstable_IdlePriority, ke = t.log, Ae = t.unstable_setDisableYieldValue, je = null, Me = null;
	function Ne(e) {
		if (typeof ke == "function" && Ae(e), Me && typeof Me.setStrictMode == "function") try {
			Me.setStrictMode(je, e);
		} catch {}
	}
	var Pe = Math.clz32 ? Math.clz32 : Le, Fe = Math.log, Ie = Math.LN2;
	function Le(e) {
		return e >>>= 0, e === 0 ? 32 : 31 - (Fe(e) / Ie | 0) | 0;
	}
	var Re = 256, ze = 262144, Be = 4194304;
	function Ve(e) {
		var t = e & 42;
		if (t !== 0) return t;
		switch (e & -e) {
			case 1: return 1;
			case 2: return 2;
			case 4: return 4;
			case 8: return 8;
			case 16: return 16;
			case 32: return 32;
			case 64: return 64;
			case 128: return 128;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072: return e & 261888;
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return e & 3932160;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return e & 62914560;
			case 67108864: return 67108864;
			case 134217728: return 134217728;
			case 268435456: return 268435456;
			case 536870912: return 536870912;
			case 1073741824: return 0;
			default: return e;
		}
	}
	function He(e, t, n) {
		var r = e.pendingLanes;
		if (r === 0) return 0;
		var i = 0, a = e.suspendedLanes, o = e.pingedLanes;
		e = e.warmLanes;
		var s = r & 134217727;
		return s === 0 ? (s = r & ~a, s === 0 ? o === 0 ? n || (n = r & ~e, n !== 0 && (i = Ve(n))) : i = Ve(o) : i = Ve(s)) : (r = s & ~a, r === 0 ? (o &= s, o === 0 ? n || (n = s & ~e, n !== 0 && (i = Ve(n))) : i = Ve(o)) : i = Ve(r)), i === 0 ? 0 : t !== 0 && t !== i && (t & a) === 0 && (a = i & -i, n = t & -t, a >= n || a === 32 && n & 4194048) ? t : i;
	}
	function Ue(e, t) {
		return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
	}
	function We(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 4:
			case 8:
			case 64: return t + 250;
			case 16:
			case 32:
			case 128:
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return t + 5e3;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return -1;
			case 67108864:
			case 134217728:
			case 268435456:
			case 536870912:
			case 1073741824: return -1;
			default: return -1;
		}
	}
	function Ge() {
		var e = Be;
		return Be <<= 1, !(Be & 62914560) && (Be = 4194304), e;
	}
	function Ke(e) {
		for (var t = [], n = 0; 31 > n; n++) t.push(e);
		return t;
	}
	function qe(e, t) {
		e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
	}
	function Je(e, t, n, r, i, a) {
		var o = e.pendingLanes;
		e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
		var s = e.entanglements, c = e.expirationTimes, l = e.hiddenUpdates;
		for (n = o & ~n; 0 < n;) {
			var u = 31 - Pe(n), d = 1 << u;
			s[u] = 0, c[u] = -1;
			var f = l[u];
			if (f !== null) for (l[u] = null, u = 0; u < f.length; u++) {
				var p = f[u];
				p !== null && (p.lane &= -536870913);
			}
			n &= ~d;
		}
		r !== 0 && Ye(e, r, 0), a !== 0 && i === 0 && e.tag !== 0 && (e.suspendedLanes |= a & ~(o & ~t));
	}
	function Ye(e, t, n) {
		e.pendingLanes |= t, e.suspendedLanes &= ~t;
		var r = 31 - Pe(t);
		e.entangledLanes |= t, e.entanglements[r] = e.entanglements[r] | 1073741824 | n & 261930;
	}
	function Xe(e, t) {
		var n = e.entangledLanes |= t;
		for (e = e.entanglements; n;) {
			var r = 31 - Pe(n), i = 1 << r;
			i & t | e[r] & t && (e[r] |= t), n &= ~i;
		}
	}
	function Ze(e, t) {
		var n = t & -t;
		return n = n & 42 ? 1 : Qe(n), (n & (e.suspendedLanes | t)) === 0 ? n : 0;
	}
	function Qe(e) {
		switch (e) {
			case 2:
				e = 1;
				break;
			case 8:
				e = 4;
				break;
			case 32:
				e = 16;
				break;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152:
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432:
				e = 128;
				break;
			case 268435456:
				e = 134217728;
				break;
			default: e = 0;
		}
		return e;
	}
	function $e(e) {
		return e &= -e, 2 < e ? 8 < e ? e & 134217727 ? 32 : 268435456 : 8 : 2;
	}
	function et() {
		var e = I.p;
		return e === 0 ? (e = window.event, e === void 0 ? 32 : hp(e.type)) : e;
	}
	function tt(e, t) {
		var n = I.p;
		try {
			return I.p = e, t();
		} finally {
			I.p = n;
		}
	}
	var nt = Math.random().toString(36).slice(2), rt = "__reactFiber$" + nt, it = "__reactProps$" + nt, at = "__reactContainer$" + nt, ot = "__reactEvents$" + nt, st = "__reactListeners$" + nt, ct = "__reactHandles$" + nt, lt = "__reactResources$" + nt, ut = "__reactMarker$" + nt;
	function dt(e) {
		delete e[rt], delete e[it], delete e[ot], delete e[st], delete e[ct];
	}
	function ft(e) {
		var t = e[rt];
		if (t) return t;
		for (var n = e.parentNode; n;) {
			if (t = n[at] || n[rt]) {
				if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = ff(e); e !== null;) {
					if (n = e[rt]) return n;
					e = ff(e);
				}
				return t;
			}
			e = n, n = e.parentNode;
		}
		return null;
	}
	function pt(e) {
		if (e = e[rt] || e[at]) {
			var t = e.tag;
			if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
		}
		return null;
	}
	function mt(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
		throw Error(i(33));
	}
	function ht(e) {
		var t = e[lt];
		return t ||= e[lt] = {
			hoistableStyles: /* @__PURE__ */ new Map(),
			hoistableScripts: /* @__PURE__ */ new Map()
		}, t;
	}
	function gt(e) {
		e[ut] = !0;
	}
	var _t = /* @__PURE__ */ new Set(), vt = {};
	function yt(e, t) {
		bt(e, t), bt(e + "Capture", t);
	}
	function bt(e, t) {
		for (vt[e] = t, e = 0; e < t.length; e++) _t.add(t[e]);
	}
	var xt = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), St = {}, Ct = {};
	function wt(e) {
		return _e.call(Ct, e) ? !0 : _e.call(St, e) ? !1 : xt.test(e) ? Ct[e] = !0 : (St[e] = !0, !1);
	}
	function Tt(e, t, n) {
		if (wt(t)) {
			if (n === null) e.removeAttribute(t);
			else {
				switch (typeof n) {
					case "undefined":
					case "function":
					case "symbol":
						e.removeAttribute(t);
						return;
					case "boolean":
						var r = t.toLowerCase().slice(0, 5);
						if (r !== "data-" && r !== "aria-") {
							e.removeAttribute(t);
							return;
						}
				}
				e.setAttribute(t, "" + n);
			}
		}
	}
	function Et(e, t, n) {
		if (n === null) e.removeAttribute(t);
		else {
			switch (typeof n) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(t);
					return;
			}
			e.setAttribute(t, "" + n);
		}
	}
	function Dt(e, t, n, r) {
		if (r === null) e.removeAttribute(n);
		else {
			switch (typeof r) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(n);
					return;
			}
			e.setAttributeNS(t, n, "" + r);
		}
	}
	function Ot(e) {
		switch (typeof e) {
			case "bigint":
			case "boolean":
			case "number":
			case "string":
			case "undefined": return e;
			case "object": return e;
			default: return "";
		}
	}
	function kt(e) {
		var t = e.type;
		return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
	}
	function At(e, t, n) {
		var r = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
		if (!e.hasOwnProperty(t) && r !== void 0 && typeof r.get == "function" && typeof r.set == "function") {
			var i = r.get, a = r.set;
			return Object.defineProperty(e, t, {
				configurable: !0,
				get: function() {
					return i.call(this);
				},
				set: function(e) {
					n = "" + e, a.call(this, e);
				}
			}), Object.defineProperty(e, t, { enumerable: r.enumerable }), {
				getValue: function() {
					return n;
				},
				setValue: function(e) {
					n = "" + e;
				},
				stopTracking: function() {
					e._valueTracker = null, delete e[t];
				}
			};
		}
	}
	function jt(e) {
		if (!e._valueTracker) {
			var t = kt(e) ? "checked" : "value";
			e._valueTracker = At(e, t, "" + e[t]);
		}
	}
	function Mt(e) {
		if (!e) return !1;
		var t = e._valueTracker;
		if (!t) return !0;
		var n = t.getValue(), r = "";
		return e && (r = kt(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n && (t.setValue(e), !0);
	}
	function Nt(e) {
		if (e ||= typeof document < "u" ? document : void 0, e === void 0) return null;
		try {
			return e.activeElement || e.body;
		} catch {
			return e.body;
		}
	}
	var H = /[\n"\\]/g;
	function Pt(e) {
		return e.replace(H, function(e) {
			return "\\" + e.charCodeAt(0).toString(16) + " ";
		});
	}
	function Ft(e, t, n, r, i, a, o, s) {
		e.name = "", o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? e.type = o : e.removeAttribute("type"), t == null ? o !== "submit" && o !== "reset" || e.removeAttribute("value") : o === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Ot(t)) : e.value !== "" + Ot(t) && (e.value = "" + Ot(t)), t == null ? n == null ? r != null && e.removeAttribute("value") : Lt(e, o, Ot(n)) : Lt(e, o, Ot(t)), i == null && a != null && (e.defaultChecked = !!a), i != null && (e.checked = i && typeof i != "function" && typeof i != "symbol"), s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" ? e.name = "" + Ot(s) : e.removeAttribute("name");
	}
	function It(e, t, n, r, i, a, o, s) {
		if (a != null && typeof a != "function" && typeof a != "symbol" && typeof a != "boolean" && (e.type = a), t != null || n != null) {
			if (!(a !== "submit" && a !== "reset" || t != null)) {
				jt(e);
				return;
			}
			n = n == null ? "" : "" + Ot(n), t = t == null ? n : "" + Ot(t), s || t === e.value || (e.value = t), e.defaultValue = t;
		}
		r ??= i, r = typeof r != "function" && typeof r != "symbol" && !!r, e.checked = s ? e.checked : !!r, e.defaultChecked = !!r, o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (e.name = o), jt(e);
	}
	function Lt(e, t, n) {
		t === "number" && Nt(e.ownerDocument) === e || e.defaultValue === "" + n || (e.defaultValue = "" + n);
	}
	function Rt(e, t, n, r) {
		if (e = e.options, t) {
			t = {};
			for (var i = 0; i < n.length; i++) t["$" + n[i]] = !0;
			for (n = 0; n < e.length; n++) i = t.hasOwnProperty("$" + e[n].value), e[n].selected !== i && (e[n].selected = i), i && r && (e[n].defaultSelected = !0);
		} else {
			for (n = "" + Ot(n), t = null, i = 0; i < e.length; i++) {
				if (e[i].value === n) {
					e[i].selected = !0, r && (e[i].defaultSelected = !0);
					return;
				}
				t !== null || e[i].disabled || (t = e[i]);
			}
			t !== null && (t.selected = !0);
		}
	}
	function zt(e, t, n) {
		if (t != null && (t = "" + Ot(t), t !== e.value && (e.value = t), n == null)) {
			e.defaultValue !== t && (e.defaultValue = t);
			return;
		}
		e.defaultValue = n == null ? "" : "" + Ot(n);
	}
	function Bt(e, t, n, r) {
		if (t == null) {
			if (r != null) {
				if (n != null) throw Error(i(92));
				if (ee(r)) {
					if (1 < r.length) throw Error(i(93));
					r = r[0];
				}
				n = r;
			}
			n ??= "", t = n;
		}
		n = Ot(t), e.defaultValue = n, r = e.textContent, r === n && r !== "" && r !== null && (e.value = r), jt(e);
	}
	function Vt(e, t) {
		if (t) {
			var n = e.firstChild;
			if (n && n === e.lastChild && n.nodeType === 3) {
				n.nodeValue = t;
				return;
			}
		}
		e.textContent = t;
	}
	var Ht = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
	function Ut(e, t, n) {
		var r = t.indexOf("--") === 0;
		n == null || typeof n == "boolean" || n === "" ? r ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : r ? e.setProperty(t, n) : typeof n != "number" || n === 0 || Ht.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
	}
	function Wt(e, t, n) {
		if (t != null && typeof t != "object") throw Error(i(62));
		if (e = e.style, n != null) {
			for (var r in n) !n.hasOwnProperty(r) || t != null && t.hasOwnProperty(r) || (r.indexOf("--") === 0 ? e.setProperty(r, "") : r === "float" ? e.cssFloat = "" : e[r] = "");
			for (var a in t) r = t[a], t.hasOwnProperty(a) && n[a] !== r && Ut(e, a, r);
		} else for (var o in t) t.hasOwnProperty(o) && Ut(e, o, t[o]);
	}
	function U(e) {
		if (e.indexOf("-") === -1) return !1;
		switch (e) {
			case "annotation-xml":
			case "color-profile":
			case "font-face":
			case "font-face-src":
			case "font-face-uri":
			case "font-face-format":
			case "font-face-name":
			case "missing-glyph": return !1;
			default: return !0;
		}
	}
	var Gt = /* @__PURE__ */ new Map([
		["acceptCharset", "accept-charset"],
		["htmlFor", "for"],
		["httpEquiv", "http-equiv"],
		["crossOrigin", "crossorigin"],
		["accentHeight", "accent-height"],
		["alignmentBaseline", "alignment-baseline"],
		["arabicForm", "arabic-form"],
		["baselineShift", "baseline-shift"],
		["capHeight", "cap-height"],
		["clipPath", "clip-path"],
		["clipRule", "clip-rule"],
		["colorInterpolation", "color-interpolation"],
		["colorInterpolationFilters", "color-interpolation-filters"],
		["colorProfile", "color-profile"],
		["colorRendering", "color-rendering"],
		["dominantBaseline", "dominant-baseline"],
		["enableBackground", "enable-background"],
		["fillOpacity", "fill-opacity"],
		["fillRule", "fill-rule"],
		["floodColor", "flood-color"],
		["floodOpacity", "flood-opacity"],
		["fontFamily", "font-family"],
		["fontSize", "font-size"],
		["fontSizeAdjust", "font-size-adjust"],
		["fontStretch", "font-stretch"],
		["fontStyle", "font-style"],
		["fontVariant", "font-variant"],
		["fontWeight", "font-weight"],
		["glyphName", "glyph-name"],
		["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
		["glyphOrientationVertical", "glyph-orientation-vertical"],
		["horizAdvX", "horiz-adv-x"],
		["horizOriginX", "horiz-origin-x"],
		["imageRendering", "image-rendering"],
		["letterSpacing", "letter-spacing"],
		["lightingColor", "lighting-color"],
		["markerEnd", "marker-end"],
		["markerMid", "marker-mid"],
		["markerStart", "marker-start"],
		["overlinePosition", "overline-position"],
		["overlineThickness", "overline-thickness"],
		["paintOrder", "paint-order"],
		["panose-1", "panose-1"],
		["pointerEvents", "pointer-events"],
		["renderingIntent", "rendering-intent"],
		["shapeRendering", "shape-rendering"],
		["stopColor", "stop-color"],
		["stopOpacity", "stop-opacity"],
		["strikethroughPosition", "strikethrough-position"],
		["strikethroughThickness", "strikethrough-thickness"],
		["strokeDasharray", "stroke-dasharray"],
		["strokeDashoffset", "stroke-dashoffset"],
		["strokeLinecap", "stroke-linecap"],
		["strokeLinejoin", "stroke-linejoin"],
		["strokeMiterlimit", "stroke-miterlimit"],
		["strokeOpacity", "stroke-opacity"],
		["strokeWidth", "stroke-width"],
		["textAnchor", "text-anchor"],
		["textDecoration", "text-decoration"],
		["textRendering", "text-rendering"],
		["transformOrigin", "transform-origin"],
		["underlinePosition", "underline-position"],
		["underlineThickness", "underline-thickness"],
		["unicodeBidi", "unicode-bidi"],
		["unicodeRange", "unicode-range"],
		["unitsPerEm", "units-per-em"],
		["vAlphabetic", "v-alphabetic"],
		["vHanging", "v-hanging"],
		["vIdeographic", "v-ideographic"],
		["vMathematical", "v-mathematical"],
		["vectorEffect", "vector-effect"],
		["vertAdvY", "vert-adv-y"],
		["vertOriginX", "vert-origin-x"],
		["vertOriginY", "vert-origin-y"],
		["wordSpacing", "word-spacing"],
		["writingMode", "writing-mode"],
		["xmlnsXlink", "xmlns:xlink"],
		["xHeight", "x-height"]
	]), Kt = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
	function qt(e) {
		return Kt.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
	}
	function Jt() {}
	var Yt = null;
	function Xt(e) {
		return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
	}
	var Zt = null, W = null;
	function Qt(e) {
		var t = pt(e);
		if (t && (e = t.stateNode)) {
			var n = e[it] || null;
			a: switch (e = t.stateNode, t.type) {
				case "input":
					if (Ft(e, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name), t = n.name, n.type === "radio" && t != null) {
						for (n = e; n.parentNode;) n = n.parentNode;
						for (n = n.querySelectorAll("input[name=\"" + Pt("" + t) + "\"][type=\"radio\"]"), t = 0; t < n.length; t++) {
							var r = n[t];
							if (r !== e && r.form === e.form) {
								var a = r[it] || null;
								if (!a) throw Error(i(90));
								Ft(r, a.value, a.defaultValue, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name);
							}
						}
						for (t = 0; t < n.length; t++) r = n[t], r.form === e.form && Mt(r);
					}
					break a;
				case "textarea":
					zt(e, n.value, n.defaultValue);
					break a;
				case "select": t = n.value, t != null && Rt(e, !!n.multiple, t, !1);
			}
		}
	}
	var $t = !1;
	function en(e, t, n) {
		if ($t) return e(t, n);
		$t = !0;
		try {
			return e(t);
		} finally {
			if ($t = !1, (Zt !== null || W !== null) && (yu(), Zt && (t = Zt, e = W, W = Zt = null, Qt(t), e))) for (t = 0; t < e.length; t++) Qt(e[t]);
		}
	}
	function tn(e, t) {
		var n = e.stateNode;
		if (n === null) return null;
		var r = n[it] || null;
		if (r === null) return null;
		n = r[t];
		a: switch (t) {
			case "onClick":
			case "onClickCapture":
			case "onDoubleClick":
			case "onDoubleClickCapture":
			case "onMouseDown":
			case "onMouseDownCapture":
			case "onMouseMove":
			case "onMouseMoveCapture":
			case "onMouseUp":
			case "onMouseUpCapture":
			case "onMouseEnter":
				(r = !r.disabled) || (e = e.type, r = e !== "button" && e !== "input" && e !== "select" && e !== "textarea"), e = !r;
				break a;
			default: e = !1;
		}
		if (e) return null;
		if (n && typeof n != "function") throw Error(i(231, t, typeof n));
		return n;
	}
	var nn = !(typeof window > "u" || window.document === void 0 || window.document.createElement === void 0), rn = !1;
	if (nn) try {
		var an = {};
		Object.defineProperty(an, "passive", { get: function() {
			rn = !0;
		} }), window.addEventListener("test", an, an), window.removeEventListener("test", an, an);
	} catch {
		rn = !1;
	}
	var on = null, sn = null, cn = null;
	function ln() {
		if (cn) return cn;
		var e, t = sn, n = t.length, r, i = "value" in on ? on.value : on.textContent, a = i.length;
		for (e = 0; e < n && t[e] === i[e]; e++);
		var o = n - e;
		for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
		return cn = i.slice(e, 1 < r ? 1 - r : void 0);
	}
	function un(e) {
		var t = e.keyCode;
		return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
	}
	function dn() {
		return !0;
	}
	function fn() {
		return !1;
	}
	function pn(e) {
		function t(t, n, r, i, a) {
			for (var o in this._reactName = t, this._targetInst = r, this.type = n, this.nativeEvent = i, this.target = a, this.currentTarget = null, e) e.hasOwnProperty(o) && (t = e[o], this[o] = t ? t(i) : i[o]);
			return this.isDefaultPrevented = (i.defaultPrevented == null ? !1 === i.returnValue : i.defaultPrevented) ? dn : fn, this.isPropagationStopped = fn, this;
		}
		return h(t.prototype, {
			preventDefault: function() {
				this.defaultPrevented = !0;
				var e = this.nativeEvent;
				e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = dn);
			},
			stopPropagation: function() {
				var e = this.nativeEvent;
				e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = dn);
			},
			persist: function() {},
			isPersistent: dn
		}), t;
	}
	var mn = {
		eventPhase: 0,
		bubbles: 0,
		cancelable: 0,
		timeStamp: function(e) {
			return e.timeStamp || Date.now();
		},
		defaultPrevented: 0,
		isTrusted: 0
	}, hn = pn(mn), gn = h({}, mn, {
		view: 0,
		detail: 0
	}), _n = pn(gn), vn, G, yn, bn = h({}, gn, {
		screenX: 0,
		screenY: 0,
		clientX: 0,
		clientY: 0,
		pageX: 0,
		pageY: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		getModifierState: jn,
		button: 0,
		buttons: 0,
		relatedTarget: function(e) {
			return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
		},
		movementX: function(e) {
			return "movementX" in e ? e.movementX : (e !== yn && (yn && e.type === "mousemove" ? (vn = e.screenX - yn.screenX, G = e.screenY - yn.screenY) : G = vn = 0, yn = e), vn);
		},
		movementY: function(e) {
			return "movementY" in e ? e.movementY : G;
		}
	}), xn = pn(bn), Sn = pn(h({}, bn, { dataTransfer: 0 })), Cn = pn(h({}, gn, { relatedTarget: 0 })), wn = pn(h({}, mn, {
		animationName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), Tn = pn(h({}, mn, { clipboardData: function(e) {
		return "clipboardData" in e ? e.clipboardData : window.clipboardData;
	} })), En = pn(h({}, mn, { data: 0 })), Dn = {
		Esc: "Escape",
		Spacebar: " ",
		Left: "ArrowLeft",
		Up: "ArrowUp",
		Right: "ArrowRight",
		Down: "ArrowDown",
		Del: "Delete",
		Win: "OS",
		Menu: "ContextMenu",
		Apps: "ContextMenu",
		Scroll: "ScrollLock",
		MozPrintableKey: "Unidentified"
	}, On = {
		8: "Backspace",
		9: "Tab",
		12: "Clear",
		13: "Enter",
		16: "Shift",
		17: "Control",
		18: "Alt",
		19: "Pause",
		20: "CapsLock",
		27: "Escape",
		32: " ",
		33: "PageUp",
		34: "PageDown",
		35: "End",
		36: "Home",
		37: "ArrowLeft",
		38: "ArrowUp",
		39: "ArrowRight",
		40: "ArrowDown",
		45: "Insert",
		46: "Delete",
		112: "F1",
		113: "F2",
		114: "F3",
		115: "F4",
		116: "F5",
		117: "F6",
		118: "F7",
		119: "F8",
		120: "F9",
		121: "F10",
		122: "F11",
		123: "F12",
		144: "NumLock",
		145: "ScrollLock",
		224: "Meta"
	}, kn = {
		Alt: "altKey",
		Control: "ctrlKey",
		Meta: "metaKey",
		Shift: "shiftKey"
	};
	function An(e) {
		var t = this.nativeEvent;
		return t.getModifierState ? t.getModifierState(e) : (e = kn[e]) ? !!t[e] : !1;
	}
	function jn() {
		return An;
	}
	var Mn = pn(h({}, gn, {
		key: function(e) {
			if (e.key) {
				var t = Dn[e.key] || e.key;
				if (t !== "Unidentified") return t;
			}
			return e.type === "keypress" ? (e = un(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? On[e.keyCode] || "Unidentified" : "";
		},
		code: 0,
		location: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		repeat: 0,
		locale: 0,
		getModifierState: jn,
		charCode: function(e) {
			return e.type === "keypress" ? un(e) : 0;
		},
		keyCode: function(e) {
			return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		},
		which: function(e) {
			return e.type === "keypress" ? un(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		}
	})), Nn = pn(h({}, bn, {
		pointerId: 0,
		width: 0,
		height: 0,
		pressure: 0,
		tangentialPressure: 0,
		tiltX: 0,
		tiltY: 0,
		twist: 0,
		pointerType: 0,
		isPrimary: 0
	})), Pn = pn(h({}, gn, {
		touches: 0,
		targetTouches: 0,
		changedTouches: 0,
		altKey: 0,
		metaKey: 0,
		ctrlKey: 0,
		shiftKey: 0,
		getModifierState: jn
	})), Fn = pn(h({}, mn, {
		propertyName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), In = pn(h({}, bn, {
		deltaX: function(e) {
			return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
		},
		deltaY: function(e) {
			return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
		},
		deltaZ: 0,
		deltaMode: 0
	})), Ln = pn(h({}, mn, {
		newState: 0,
		oldState: 0
	})), Rn = [
		9,
		13,
		27,
		32
	], zn = nn && "CompositionEvent" in window, Bn = null;
	nn && "documentMode" in document && (Bn = document.documentMode);
	var Vn = nn && "TextEvent" in window && !Bn, Hn = nn && (!zn || Bn && 8 < Bn && 11 >= Bn), Un = " ", Wn = !1;
	function Gn(e, t) {
		switch (e) {
			case "keyup": return Rn.indexOf(t.keyCode) !== -1;
			case "keydown": return t.keyCode !== 229;
			case "keypress":
			case "mousedown":
			case "focusout": return !0;
			default: return !1;
		}
	}
	function Kn(e) {
		return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
	}
	var qn = !1;
	function Jn(e, t) {
		switch (e) {
			case "compositionend": return Kn(t);
			case "keypress": return t.which === 32 ? (Wn = !0, Un) : null;
			case "textInput": return e = t.data, e === Un && Wn ? null : e;
			default: return null;
		}
	}
	function Yn(e, t) {
		if (qn) return e === "compositionend" || !zn && Gn(e, t) ? (e = ln(), cn = sn = on = null, qn = !1, e) : null;
		switch (e) {
			case "paste": return null;
			case "keypress":
				if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
					if (t.char && 1 < t.char.length) return t.char;
					if (t.which) return String.fromCharCode(t.which);
				}
				return null;
			case "compositionend": return Hn && t.locale !== "ko" ? null : t.data;
			default: return null;
		}
	}
	var Xn = {
		color: !0,
		date: !0,
		datetime: !0,
		"datetime-local": !0,
		email: !0,
		month: !0,
		number: !0,
		password: !0,
		range: !0,
		search: !0,
		tel: !0,
		text: !0,
		time: !0,
		url: !0,
		week: !0
	};
	function Zn(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t === "input" ? !!Xn[e.type] : t === "textarea";
	}
	function Qn(e, t, n, r) {
		Zt ? W ? W.push(r) : W = [r] : Zt = r, t = Ed(t, "onChange"), 0 < t.length && (n = new hn("onChange", "change", null, n, r), e.push({
			event: n,
			listeners: t
		}));
	}
	var $n = null, er = null;
	function tr(e) {
		yd(e, 0);
	}
	function nr(e) {
		if (Mt(mt(e))) return e;
	}
	function rr(e, t) {
		if (e === "change") return t;
	}
	var ir = !1;
	if (nn) {
		var ar;
		if (nn) {
			var or = "oninput" in document;
			if (!or) {
				var sr = document.createElement("div");
				sr.setAttribute("oninput", "return;"), or = typeof sr.oninput == "function";
			}
			ar = or;
		} else ar = !1;
		ir = ar && (!document.documentMode || 9 < document.documentMode);
	}
	function cr() {
		$n && ($n.detachEvent("onpropertychange", lr), er = $n = null);
	}
	function lr(e) {
		if (e.propertyName === "value" && nr(er)) {
			var t = [];
			Qn(t, er, e, Xt(e)), en(tr, t);
		}
	}
	function ur(e, t, n) {
		e === "focusin" ? (cr(), $n = t, er = n, $n.attachEvent("onpropertychange", lr)) : e === "focusout" && cr();
	}
	function dr(e) {
		if (e === "selectionchange" || e === "keyup" || e === "keydown") return nr(er);
	}
	function fr(e, t) {
		if (e === "click") return nr(t);
	}
	function pr(e, t) {
		if (e === "input" || e === "change") return nr(t);
	}
	function mr(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var hr = typeof Object.is == "function" ? Object.is : mr;
	function gr(e, t) {
		if (hr(e, t)) return !0;
		if (typeof e != "object" || !e || typeof t != "object" || !t) return !1;
		var n = Object.keys(e), r = Object.keys(t);
		if (n.length !== r.length) return !1;
		for (r = 0; r < n.length; r++) {
			var i = n[r];
			if (!_e.call(t, i) || !hr(e[i], t[i])) return !1;
		}
		return !0;
	}
	function _r(e) {
		for (; e && e.firstChild;) e = e.firstChild;
		return e;
	}
	function vr(e, t) {
		var n = _r(e);
		e = 0;
		for (var r; n;) {
			if (n.nodeType === 3) {
				if (r = e + n.textContent.length, e <= t && r >= t) return {
					node: n,
					offset: t - e
				};
				e = r;
			}
			a: {
				for (; n;) {
					if (n.nextSibling) {
						n = n.nextSibling;
						break a;
					}
					n = n.parentNode;
				}
				n = void 0;
			}
			n = _r(n);
		}
	}
	function yr(e, t) {
		return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? yr(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
	}
	function br(e) {
		e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
		for (var t = Nt(e.document); t instanceof e.HTMLIFrameElement;) {
			try {
				var n = typeof t.contentWindow.location.href == "string";
			} catch {
				n = !1;
			}
			if (n) e = t.contentWindow;
			else break;
			t = Nt(e.document);
		}
		return t;
	}
	function xr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
	}
	var Sr = nn && "documentMode" in document && 11 >= document.documentMode, Cr = null, wr = null, Tr = null, Er = !1;
	function Dr(e, t, n) {
		var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
		Er || Cr == null || Cr !== Nt(r) || (r = Cr, "selectionStart" in r && xr(r) ? r = {
			start: r.selectionStart,
			end: r.selectionEnd
		} : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
			anchorNode: r.anchorNode,
			anchorOffset: r.anchorOffset,
			focusNode: r.focusNode,
			focusOffset: r.focusOffset
		}), Tr && gr(Tr, r) || (Tr = r, r = Ed(wr, "onSelect"), 0 < r.length && (t = new hn("onSelect", "select", null, t, n), e.push({
			event: t,
			listeners: r
		}), t.target = Cr)));
	}
	function Or(e, t) {
		var n = {};
		return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
	}
	var kr = {
		animationend: Or("Animation", "AnimationEnd"),
		animationiteration: Or("Animation", "AnimationIteration"),
		animationstart: Or("Animation", "AnimationStart"),
		transitionrun: Or("Transition", "TransitionRun"),
		transitionstart: Or("Transition", "TransitionStart"),
		transitioncancel: Or("Transition", "TransitionCancel"),
		transitionend: Or("Transition", "TransitionEnd")
	}, Ar = {}, jr = {};
	nn && (jr = document.createElement("div").style, "AnimationEvent" in window || (delete kr.animationend.animation, delete kr.animationiteration.animation, delete kr.animationstart.animation), "TransitionEvent" in window || delete kr.transitionend.transition);
	function Mr(e) {
		if (Ar[e]) return Ar[e];
		if (!kr[e]) return e;
		var t = kr[e], n;
		for (n in t) if (t.hasOwnProperty(n) && n in jr) return Ar[e] = t[n];
		return e;
	}
	var Nr = Mr("animationend"), Pr = Mr("animationiteration"), Fr = Mr("animationstart"), Ir = Mr("transitionrun"), Lr = Mr("transitionstart"), Rr = Mr("transitioncancel"), zr = Mr("transitionend"), Br = /* @__PURE__ */ new Map(), Vr = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
	Vr.push("scrollEnd");
	function Hr(e, t) {
		Br.set(e, t), yt(t, [e]);
	}
	var Ur = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	}, Wr = [], Gr = 0, Kr = 0;
	function qr() {
		for (var e = Gr, t = Kr = Gr = 0; t < e;) {
			var n = Wr[t];
			Wr[t++] = null;
			var r = Wr[t];
			Wr[t++] = null;
			var i = Wr[t];
			Wr[t++] = null;
			var a = Wr[t];
			if (Wr[t++] = null, r !== null && i !== null) {
				var o = r.pending;
				o === null ? i.next = i : (i.next = o.next, o.next = i), r.pending = i;
			}
			a !== 0 && Zr(n, i, a);
		}
	}
	function Jr(e, t, n, r) {
		Wr[Gr++] = e, Wr[Gr++] = t, Wr[Gr++] = n, Wr[Gr++] = r, Kr |= r, e.lanes |= r, e = e.alternate, e !== null && (e.lanes |= r);
	}
	function Yr(e, t, n, r) {
		return Jr(e, t, n, r), Qr(e);
	}
	function Xr(e, t) {
		return Jr(e, null, null, t), Qr(e);
	}
	function Zr(e, t, n) {
		e.lanes |= n;
		var r = e.alternate;
		r !== null && (r.lanes |= n);
		for (var i = !1, a = e.return; a !== null;) a.childLanes |= n, r = a.alternate, r !== null && (r.childLanes |= n), a.tag === 22 && (e = a.stateNode, e === null || e._visibility & 1 || (i = !0)), e = a, a = a.return;
		return e.tag === 3 ? (a = e.stateNode, i && t !== null && (i = 31 - Pe(n), e = a.hiddenUpdates, r = e[i], r === null ? e[i] = [t] : r.push(t), t.lane = n | 536870912), a) : null;
	}
	function Qr(e) {
		if (50 < uu) throw uu = 0, du = null, Error(i(185));
		for (var t = e.return; t !== null;) e = t, t = e.return;
		return e.tag === 3 ? e.stateNode : null;
	}
	var $r = {};
	function ei(e, t, n, r) {
		this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
	}
	function ti(e, t, n, r) {
		return new ei(e, t, n, r);
	}
	function ni(e) {
		return e = e.prototype, !(!e || !e.isReactComponent);
	}
	function ri(e, t) {
		var n = e.alternate;
		return n === null ? (n = ti(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 65011712, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
	}
	function ii(e, t) {
		e.flags &= 65011714;
		var n = e.alternate;
		return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}), e;
	}
	function ai(e, t, n, r, a, o) {
		var s = 0;
		if (r = e, typeof e == "function") ni(e) && (s = 1);
		else if (typeof e == "string") s = Wf(e, n, ie.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
		else a: switch (e) {
			case k: return e = ti(31, n, t, a), e.elementType = k, e.lanes = o, e;
			case y: return oi(n.children, a, o, t);
			case b:
				s = 8, a |= 24;
				break;
			case x: return e = ti(12, n, t, a | 2), e.elementType = x, e.lanes = o, e;
			case T: return e = ti(13, n, t, a), e.elementType = T, e.lanes = o, e;
			case E: return e = ti(19, n, t, a), e.elementType = E, e.lanes = o, e;
			default:
				if (typeof e == "object" && e) switch (e.$$typeof) {
					case C:
						s = 10;
						break a;
					case S:
						s = 9;
						break a;
					case w:
						s = 11;
						break a;
					case D:
						s = 14;
						break a;
					case O:
						s = 16, r = null;
						break a;
				}
				s = 29, n = Error(i(130, e === null ? "null" : typeof e, "")), r = null;
		}
		return t = ti(s, n, t, a), t.elementType = e, t.type = r, t.lanes = o, t;
	}
	function oi(e, t, n, r) {
		return e = ti(7, e, r, t), e.lanes = n, e;
	}
	function si(e, t, n) {
		return e = ti(6, e, null, t), e.lanes = n, e;
	}
	function ci(e) {
		var t = ti(18, null, null, 0);
		return t.stateNode = e, t;
	}
	function li(e, t, n) {
		return t = ti(4, e.children === null ? [] : e.children, e.key, t), t.lanes = n, t.stateNode = {
			containerInfo: e.containerInfo,
			pendingChildren: null,
			implementation: e.implementation
		}, t;
	}
	var ui = /* @__PURE__ */ new WeakMap();
	function di(e, t) {
		if (typeof e == "object" && e) {
			var n = ui.get(e);
			return n === void 0 ? (t = {
				value: e,
				source: t,
				stack: ge(t)
			}, ui.set(e, t), t) : n;
		}
		return {
			value: e,
			source: t,
			stack: ge(t)
		};
	}
	var fi = [], pi = 0, mi = null, hi = 0, gi = [], _i = 0, vi = null, yi = 1, bi = "";
	function xi(e, t) {
		fi[pi++] = hi, fi[pi++] = mi, mi = e, hi = t;
	}
	function Si(e, t, n) {
		gi[_i++] = yi, gi[_i++] = bi, gi[_i++] = vi, vi = e;
		var r = yi;
		e = bi;
		var i = 32 - Pe(r) - 1;
		r &= ~(1 << i), n += 1;
		var a = 32 - Pe(t) + i;
		if (30 < a) {
			var o = i - i % 5;
			a = (r & (1 << o) - 1).toString(32), r >>= o, i -= o, yi = 1 << 32 - Pe(t) + i | n << i | r, bi = a + e;
		} else yi = 1 << a | n << i | r, bi = e;
	}
	function Ci(e) {
		e.return !== null && (xi(e, 1), Si(e, 1, 0));
	}
	function wi(e) {
		for (; e === mi;) mi = fi[--pi], fi[pi] = null, hi = fi[--pi], fi[pi] = null;
		for (; e === vi;) vi = gi[--_i], gi[_i] = null, bi = gi[--_i], gi[_i] = null, yi = gi[--_i], gi[_i] = null;
	}
	function Ti(e, t) {
		gi[_i++] = yi, gi[_i++] = bi, gi[_i++] = vi, yi = t.id, bi = t.overflow, vi = e;
	}
	var Ei = null, Di = null, K = !1, Oi = null, ki = !1, Ai = Error(i(519));
	function ji(e) {
		throw Li(di(Error(i(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", "")), e)), Ai;
	}
	function Mi(e) {
		var t = e.stateNode, n = e.type, r = e.memoizedProps;
		switch (t[rt] = e, t[it] = r, n) {
			case "dialog":
				Q("cancel", t), Q("close", t);
				break;
			case "iframe":
			case "object":
			case "embed":
				Q("load", t);
				break;
			case "video":
			case "audio":
				for (n = 0; n < _d.length; n++) Q(_d[n], t);
				break;
			case "source":
				Q("error", t);
				break;
			case "img":
			case "image":
			case "link":
				Q("error", t), Q("load", t);
				break;
			case "details":
				Q("toggle", t);
				break;
			case "input":
				Q("invalid", t), It(t, r.value, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name, !0);
				break;
			case "select":
				Q("invalid", t);
				break;
			case "textarea": Q("invalid", t), Bt(t, r.value, r.defaultValue, r.children);
		}
		n = r.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || !0 === r.suppressHydrationWarning || Md(t.textContent, n) ? (r.popover != null && (Q("beforetoggle", t), Q("toggle", t)), r.onScroll != null && Q("scroll", t), r.onScrollEnd != null && Q("scrollend", t), r.onClick != null && (t.onclick = Jt), t = !0) : t = !1, t || ji(e, !0);
	}
	function Ni(e) {
		for (Ei = e.return; Ei;) switch (Ei.tag) {
			case 5:
			case 31:
			case 13:
				ki = !1;
				return;
			case 27:
			case 3:
				ki = !0;
				return;
			default: Ei = Ei.return;
		}
	}
	function Pi(e) {
		if (e !== Ei) return !1;
		if (!K) return Ni(e), K = !0, !1;
		var t = e.tag, n;
		if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = n === "form" || n === "button" || Wd(e.type, e.memoizedProps)), n = !n), n && Di && ji(e), Ni(e), t === 13) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			Di = df(e);
		} else if (t === 31) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			Di = df(e);
		} else t === 27 ? (t = Di, Qd(e.type) ? (e = uf, uf = null, Di = e) : Di = t) : Di = Ei ? lf(e.stateNode.nextSibling) : null;
		return !0;
	}
	function Fi() {
		Di = Ei = null, K = !1;
	}
	function Ii() {
		var e = Oi;
		return e !== null && (Xl === null ? Xl = e : Xl.push.apply(Xl, e), Oi = null), e;
	}
	function Li(e) {
		Oi === null ? Oi = [e] : Oi.push(e);
	}
	var Ri = L(null), zi = null, Bi = null;
	function Vi(e, t, n) {
		z(Ri, t._currentValue), t._currentValue = n;
	}
	function Hi(e) {
		e._currentValue = Ri.current, R(Ri);
	}
	function Ui(e, t, n) {
		for (; e !== null;) {
			var r = e.alternate;
			if ((e.childLanes & t) === t ? r !== null && (r.childLanes & t) !== t && (r.childLanes |= t) : (e.childLanes |= t, r !== null && (r.childLanes |= t)), e === n) break;
			e = e.return;
		}
	}
	function Wi(e, t, n, r) {
		var a = e.child;
		for (a !== null && (a.return = e); a !== null;) {
			var o = a.dependencies;
			if (o !== null) {
				var s = a.child;
				o = o.firstContext;
				a: for (; o !== null;) {
					var c = o;
					o = a;
					for (var l = 0; l < t.length; l++) if (c.context === t[l]) {
						o.lanes |= n, c = o.alternate, c !== null && (c.lanes |= n), Ui(o.return, n, e), r || (s = null);
						break a;
					}
					o = c.next;
				}
			} else if (a.tag === 18) {
				if (s = a.return, s === null) throw Error(i(341));
				s.lanes |= n, o = s.alternate, o !== null && (o.lanes |= n), Ui(s, n, e), s = null;
			} else s = a.child;
			if (s !== null) s.return = a;
			else for (s = a; s !== null;) {
				if (s === e) {
					s = null;
					break;
				}
				if (a = s.sibling, a !== null) {
					a.return = s.return, s = a;
					break;
				}
				s = s.return;
			}
			a = s;
		}
	}
	function Gi(e, t, n, r) {
		e = null;
		for (var a = t, o = !1; a !== null;) {
			if (!o) {
				if (a.flags & 524288) o = !0;
				else if (a.flags & 262144) break;
			}
			if (a.tag === 10) {
				var s = a.alternate;
				if (s === null) throw Error(i(387));
				if (s = s.memoizedProps, s !== null) {
					var c = a.type;
					hr(a.pendingProps.value, s.value) || (e === null ? e = [c] : e.push(c));
				}
			} else if (a === oe.current) {
				if (s = a.alternate, s === null) throw Error(i(387));
				s.memoizedState.memoizedState !== a.memoizedState.memoizedState && (e === null ? e = [$f] : e.push($f));
			}
			a = a.return;
		}
		e !== null && Wi(t, e, n, r), t.flags |= 262144;
	}
	function Ki(e) {
		for (e = e.firstContext; e !== null;) {
			if (!hr(e.context._currentValue, e.memoizedValue)) return !0;
			e = e.next;
		}
		return !1;
	}
	function qi(e) {
		zi = e, Bi = null, e = e.dependencies, e !== null && (e.firstContext = null);
	}
	function Ji(e) {
		return Xi(zi, e);
	}
	function Yi(e, t) {
		return zi === null && qi(e), Xi(e, t);
	}
	function Xi(e, t) {
		var n = t._currentValue;
		if (t = {
			context: t,
			memoizedValue: n,
			next: null
		}, Bi === null) {
			if (e === null) throw Error(i(308));
			Bi = t, e.dependencies = {
				lanes: 0,
				firstContext: t
			}, e.flags |= 524288;
		} else Bi = Bi.next = t;
		return n;
	}
	var Zi = typeof AbortController < "u" ? AbortController : function() {
		var e = [], t = this.signal = {
			aborted: !1,
			addEventListener: function(t, n) {
				e.push(n);
			}
		};
		this.abort = function() {
			t.aborted = !0, e.forEach(function(e) {
				return e();
			});
		};
	}, Qi = t.unstable_scheduleCallback, $i = t.unstable_NormalPriority, ea = {
		$$typeof: C,
		Consumer: null,
		Provider: null,
		_currentValue: null,
		_currentValue2: null,
		_threadCount: 0
	};
	function ta() {
		return {
			controller: new Zi(),
			data: /* @__PURE__ */ new Map(),
			refCount: 0
		};
	}
	function na(e) {
		e.refCount--, e.refCount === 0 && Qi($i, function() {
			e.controller.abort();
		});
	}
	var ra = null, ia = 0, aa = 0, oa = null;
	function sa(e, t) {
		if (ra === null) {
			var n = ra = [];
			ia = 0, aa = dd(), oa = {
				status: "pending",
				value: void 0,
				then: function(e) {
					n.push(e);
				}
			};
		}
		return ia++, t.then(ca, ca), t;
	}
	function ca() {
		if (--ia === 0 && ra !== null) {
			oa !== null && (oa.status = "fulfilled");
			var e = ra;
			ra = null, aa = 0, oa = null;
			for (var t = 0; t < e.length; t++) (0, e[t])();
		}
	}
	function la(e, t) {
		var n = [], r = {
			status: "pending",
			value: null,
			reason: null,
			then: function(e) {
				n.push(e);
			}
		};
		return e.then(function() {
			r.status = "fulfilled", r.value = t;
			for (var e = 0; e < n.length; e++) (0, n[e])(t);
		}, function(e) {
			for (r.status = "rejected", r.reason = e, e = 0; e < n.length; e++) (0, n[e])(void 0);
		}), r;
	}
	var ua = F.S;
	F.S = function(e, t) {
		$l = Se(), typeof t == "object" && t && typeof t.then == "function" && sa(e, t), ua !== null && ua(e, t);
	};
	var da = L(null);
	function fa() {
		var e = da.current;
		return e === null ? Il.pooledCache : e;
	}
	function pa(e, t) {
		t === null ? z(da, da.current) : z(da, t.pool);
	}
	function ma() {
		var e = fa();
		return e === null ? null : {
			parent: ea._currentValue,
			pool: e
		};
	}
	var ha = Error(i(460)), ga = Error(i(474)), _a = Error(i(542)), va = { then: function() {} };
	function ya(e) {
		return e = e.status, e === "fulfilled" || e === "rejected";
	}
	function ba(e, t, n) {
		switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then(Jt, Jt), t = n), t.status) {
			case "fulfilled": return t.value;
			case "rejected": throw e = t.reason, wa(e), e;
			default:
				if (typeof t.status == "string") t.then(Jt, Jt);
				else {
					if (e = Il, e !== null && 100 < e.shellSuspendCounter) throw Error(i(482));
					e = t, e.status = "pending", e.then(function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "fulfilled", n.value = e;
						}
					}, function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "rejected", n.reason = e;
						}
					});
				}
				switch (t.status) {
					case "fulfilled": return t.value;
					case "rejected": throw e = t.reason, wa(e), e;
				}
				throw Sa = t, ha;
		}
	}
	function xa(e) {
		try {
			var t = e._init;
			return t(e._payload);
		} catch (e) {
			throw typeof e == "object" && e && typeof e.then == "function" ? (Sa = e, ha) : e;
		}
	}
	var Sa = null;
	function Ca() {
		if (Sa === null) throw Error(i(459));
		var e = Sa;
		return Sa = null, e;
	}
	function wa(e) {
		if (e === ha || e === _a) throw Error(i(483));
	}
	var Ta = null, Ea = 0;
	function Da(e) {
		var t = Ea;
		return Ea += 1, Ta === null && (Ta = []), ba(Ta, e, t);
	}
	function Oa(e, t) {
		t = t.props.ref, e.ref = t === void 0 ? null : t;
	}
	function ka(e, t) {
		throw t.$$typeof === g ? Error(i(525)) : (e = Object.prototype.toString.call(t), Error(i(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e)));
	}
	function Aa(e) {
		function t(t, n) {
			if (e) {
				var r = t.deletions;
				r === null ? (t.deletions = [n], t.flags |= 16) : r.push(n);
			}
		}
		function n(n, r) {
			if (!e) return null;
			for (; r !== null;) t(n, r), r = r.sibling;
			return null;
		}
		function r(e) {
			for (var t = /* @__PURE__ */ new Map(); e !== null;) e.key === null ? t.set(e.index, e) : t.set(e.key, e), e = e.sibling;
			return t;
		}
		function a(e, t) {
			return e = ri(e, t), e.index = 0, e.sibling = null, e;
		}
		function o(t, n, r) {
			return t.index = r, e ? (r = t.alternate, r === null ? (t.flags |= 67108866, n) : (r = r.index, r < n ? (t.flags |= 67108866, n) : r)) : (t.flags |= 1048576, n);
		}
		function s(t) {
			return e && t.alternate === null && (t.flags |= 67108866), t;
		}
		function c(e, t, n, r) {
			return t === null || t.tag !== 6 ? (t = si(n, e.mode, r), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function l(e, t, n, r) {
			var i = n.type;
			return i === y ? d(e, t, n.props.children, r, n.key) : t !== null && (t.elementType === i || typeof i == "object" && i && i.$$typeof === O && xa(i) === t.type) ? (t = a(t, n.props), Oa(t, n), t.return = e, t) : (t = ai(n.type, n.key, n.props, null, e.mode, r), Oa(t, n), t.return = e, t);
		}
		function u(e, t, n, r) {
			return t === null || t.tag !== 4 || t.stateNode.containerInfo !== n.containerInfo || t.stateNode.implementation !== n.implementation ? (t = li(n, e.mode, r), t.return = e, t) : (t = a(t, n.children || []), t.return = e, t);
		}
		function d(e, t, n, r, i) {
			return t === null || t.tag !== 7 ? (t = oi(n, e.mode, r, i), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function f(e, t, n) {
			if (typeof t == "string" && t !== "" || typeof t == "number" || typeof t == "bigint") return t = si("" + t, e.mode, n), t.return = e, t;
			if (typeof t == "object" && t) {
				switch (t.$$typeof) {
					case _: return n = ai(t.type, t.key, t.props, null, e.mode, n), Oa(n, t), n.return = e, n;
					case v: return t = li(t, e.mode, n), t.return = e, t;
					case O: return t = xa(t), f(e, t, n);
				}
				if (ee(t) || M(t)) return t = oi(t, e.mode, n, null), t.return = e, t;
				if (typeof t.then == "function") return f(e, Da(t), n);
				if (t.$$typeof === C) return f(e, Yi(e, t), n);
				ka(e, t);
			}
			return null;
		}
		function p(e, t, n, r) {
			var i = t === null ? null : t.key;
			if (typeof n == "string" && n !== "" || typeof n == "number" || typeof n == "bigint") return i === null ? c(e, t, "" + n, r) : null;
			if (typeof n == "object" && n) {
				switch (n.$$typeof) {
					case _: return n.key === i ? l(e, t, n, r) : null;
					case v: return n.key === i ? u(e, t, n, r) : null;
					case O: return n = xa(n), p(e, t, n, r);
				}
				if (ee(n) || M(n)) return i === null ? d(e, t, n, r, null) : null;
				if (typeof n.then == "function") return p(e, t, Da(n), r);
				if (n.$$typeof === C) return p(e, t, Yi(e, n), r);
				ka(e, n);
			}
			return null;
		}
		function m(e, t, n, r, i) {
			if (typeof r == "string" && r !== "" || typeof r == "number" || typeof r == "bigint") return e = e.get(n) || null, c(t, e, "" + r, i);
			if (typeof r == "object" && r) {
				switch (r.$$typeof) {
					case _: return e = e.get(r.key === null ? n : r.key) || null, l(t, e, r, i);
					case v: return e = e.get(r.key === null ? n : r.key) || null, u(t, e, r, i);
					case O: return r = xa(r), m(e, t, n, r, i);
				}
				if (ee(r) || M(r)) return e = e.get(n) || null, d(t, e, r, i, null);
				if (typeof r.then == "function") return m(e, t, n, Da(r), i);
				if (r.$$typeof === C) return m(e, t, n, Yi(t, r), i);
				ka(t, r);
			}
			return null;
		}
		function h(i, a, s, c) {
			for (var l = null, u = null, d = a, h = a = 0, g = null; d !== null && h < s.length; h++) {
				d.index > h ? (g = d, d = null) : g = d.sibling;
				var _ = p(i, d, s[h], c);
				if (_ === null) {
					d === null && (d = g);
					break;
				}
				e && d && _.alternate === null && t(i, d), a = o(_, a, h), u === null ? l = _ : u.sibling = _, u = _, d = g;
			}
			if (h === s.length) return n(i, d), K && xi(i, h), l;
			if (d === null) {
				for (; h < s.length; h++) d = f(i, s[h], c), d !== null && (a = o(d, a, h), u === null ? l = d : u.sibling = d, u = d);
				return K && xi(i, h), l;
			}
			for (d = r(d); h < s.length; h++) g = m(d, i, h, s[h], c), g !== null && (e && g.alternate !== null && d.delete(g.key === null ? h : g.key), a = o(g, a, h), u === null ? l = g : u.sibling = g, u = g);
			return e && d.forEach(function(e) {
				return t(i, e);
			}), K && xi(i, h), l;
		}
		function g(a, s, c, l) {
			if (c == null) throw Error(i(151));
			for (var u = null, d = null, h = s, g = s = 0, _ = null, v = c.next(); h !== null && !v.done; g++, v = c.next()) {
				h.index > g ? (_ = h, h = null) : _ = h.sibling;
				var y = p(a, h, v.value, l);
				if (y === null) {
					h === null && (h = _);
					break;
				}
				e && h && y.alternate === null && t(a, h), s = o(y, s, g), d === null ? u = y : d.sibling = y, d = y, h = _;
			}
			if (v.done) return n(a, h), K && xi(a, g), u;
			if (h === null) {
				for (; !v.done; g++, v = c.next()) v = f(a, v.value, l), v !== null && (s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
				return K && xi(a, g), u;
			}
			for (h = r(h); !v.done; g++, v = c.next()) v = m(h, a, g, v.value, l), v !== null && (e && v.alternate !== null && h.delete(v.key === null ? g : v.key), s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
			return e && h.forEach(function(e) {
				return t(a, e);
			}), K && xi(a, g), u;
		}
		function b(e, r, o, c) {
			if (typeof o == "object" && o && o.type === y && o.key === null && (o = o.props.children), typeof o == "object" && o) {
				switch (o.$$typeof) {
					case _:
						a: {
							for (var l = o.key; r !== null;) {
								if (r.key === l) {
									if (l = o.type, l === y) {
										if (r.tag === 7) {
											n(e, r.sibling), c = a(r, o.props.children), c.return = e, e = c;
											break a;
										}
									} else if (r.elementType === l || typeof l == "object" && l && l.$$typeof === O && xa(l) === r.type) {
										n(e, r.sibling), c = a(r, o.props), Oa(c, o), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							o.type === y ? (c = oi(o.props.children, e.mode, c, o.key), c.return = e, e = c) : (c = ai(o.type, o.key, o.props, null, e.mode, c), Oa(c, o), c.return = e, e = c);
						}
						return s(e);
					case v:
						a: {
							for (l = o.key; r !== null;) {
								if (r.key === l) {
									if (r.tag === 4 && r.stateNode.containerInfo === o.containerInfo && r.stateNode.implementation === o.implementation) {
										n(e, r.sibling), c = a(r, o.children || []), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							c = li(o, e.mode, c), c.return = e, e = c;
						}
						return s(e);
					case O: return o = xa(o), b(e, r, o, c);
				}
				if (ee(o)) return h(e, r, o, c);
				if (M(o)) {
					if (l = M(o), typeof l != "function") throw Error(i(150));
					return o = l.call(o), g(e, r, o, c);
				}
				if (typeof o.then == "function") return b(e, r, Da(o), c);
				if (o.$$typeof === C) return b(e, r, Yi(e, o), c);
				ka(e, o);
			}
			return typeof o == "string" && o !== "" || typeof o == "number" || typeof o == "bigint" ? (o = "" + o, r !== null && r.tag === 6 ? (n(e, r.sibling), c = a(r, o), c.return = e, e = c) : (n(e, r), c = si(o, e.mode, c), c.return = e, e = c), s(e)) : n(e, r);
		}
		return function(e, t, n, r) {
			try {
				Ea = 0;
				var i = b(e, t, n, r);
				return Ta = null, i;
			} catch (t) {
				if (t === ha || t === _a) throw t;
				var a = ti(29, t, null, e.mode);
				return a.lanes = r, a.return = e, a;
			}
		};
	}
	var ja = Aa(!0), Ma = Aa(!1), Na = !1;
	function Pa(e) {
		e.updateQueue = {
			baseState: e.memoizedState,
			firstBaseUpdate: null,
			lastBaseUpdate: null,
			shared: {
				pending: null,
				lanes: 0,
				hiddenCallbacks: null
			},
			callbacks: null
		};
	}
	function Fa(e, t) {
		e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
			baseState: e.baseState,
			firstBaseUpdate: e.firstBaseUpdate,
			lastBaseUpdate: e.lastBaseUpdate,
			shared: e.shared,
			callbacks: null
		});
	}
	function q(e) {
		return {
			lane: e,
			tag: 0,
			payload: null,
			callback: null,
			next: null
		};
	}
	function Ia(e, t, n) {
		var r = e.updateQueue;
		if (r === null) return null;
		if (r = r.shared, Fl & 2) {
			var i = r.pending;
			return i === null ? t.next = t : (t.next = i.next, i.next = t), r.pending = t, t = Qr(e), Zr(e, null, n), t;
		}
		return Jr(e, r, t, n), Qr(e);
	}
	function La(e, t, n) {
		if (t = t.updateQueue, t !== null && (t = t.shared, n & 4194048)) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, Xe(e, n);
		}
	}
	function Ra(e, t) {
		var n = e.updateQueue, r = e.alternate;
		if (r !== null && (r = r.updateQueue, n === r)) {
			var i = null, a = null;
			if (n = n.firstBaseUpdate, n !== null) {
				do {
					var o = {
						lane: n.lane,
						tag: n.tag,
						payload: n.payload,
						callback: null,
						next: null
					};
					a === null ? i = a = o : a = a.next = o, n = n.next;
				} while (n !== null);
				a === null ? i = a = t : a = a.next = t;
			} else i = a = t;
			n = {
				baseState: r.baseState,
				firstBaseUpdate: i,
				lastBaseUpdate: a,
				shared: r.shared,
				callbacks: r.callbacks
			}, e.updateQueue = n;
			return;
		}
		e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
	}
	var za = !1;
	function Ba() {
		if (za) {
			var e = oa;
			if (e !== null) throw e;
		}
	}
	function Va(e, t, n, r) {
		za = !1;
		var i = e.updateQueue;
		Na = !1;
		var a = i.firstBaseUpdate, o = i.lastBaseUpdate, s = i.shared.pending;
		if (s !== null) {
			i.shared.pending = null;
			var c = s, l = c.next;
			c.next = null, o === null ? a = l : o.next = l, o = c;
			var u = e.alternate;
			u !== null && (u = u.updateQueue, s = u.lastBaseUpdate, s !== o && (s === null ? u.firstBaseUpdate = l : s.next = l, u.lastBaseUpdate = c));
		}
		if (a !== null) {
			var d = i.baseState;
			o = 0, u = l = c = null, s = a;
			do {
				var f = s.lane & -536870913, p = f !== s.lane;
				if (p ? (Z & f) === f : (r & f) === f) {
					f !== 0 && f === aa && (za = !0), u !== null && (u = u.next = {
						lane: 0,
						tag: s.tag,
						payload: s.payload,
						callback: null,
						next: null
					});
					a: {
						var m = e, g = s;
						f = t;
						var _ = n;
						switch (g.tag) {
							case 1:
								if (m = g.payload, typeof m == "function") {
									d = m.call(_, d, f);
									break a;
								}
								d = m;
								break a;
							case 3: m.flags = m.flags & -65537 | 128;
							case 0:
								if (m = g.payload, f = typeof m == "function" ? m.call(_, d, f) : m, f == null) break a;
								d = h({}, d, f);
								break a;
							case 2: Na = !0;
						}
					}
					f = s.callback, f !== null && (e.flags |= 64, p && (e.flags |= 8192), p = i.callbacks, p === null ? i.callbacks = [f] : p.push(f));
				} else p = {
					lane: f,
					tag: s.tag,
					payload: s.payload,
					callback: s.callback,
					next: null
				}, u === null ? (l = u = p, c = d) : u = u.next = p, o |= f;
				if (s = s.next, s === null) {
					if (s = i.shared.pending, s === null) break;
					p = s, s = p.next, p.next = null, i.lastBaseUpdate = p, i.shared.pending = null;
				}
			} while (1);
			u === null && (c = d), i.baseState = c, i.firstBaseUpdate = l, i.lastBaseUpdate = u, a === null && (i.shared.lanes = 0), Wl |= o, e.lanes = o, e.memoizedState = d;
		}
	}
	function Ha(e, t) {
		if (typeof e != "function") throw Error(i(191, e));
		e.call(t);
	}
	function Ua(e, t) {
		var n = e.callbacks;
		if (n !== null) for (e.callbacks = null, e = 0; e < n.length; e++) Ha(n[e], t);
	}
	var Wa = L(null), Ga = L(0);
	function Ka(e, t) {
		e = Hl, z(Ga, e), z(Wa, t), Hl = e | t.baseLanes;
	}
	function qa() {
		z(Ga, Hl), z(Wa, Wa.current);
	}
	function Ja() {
		Hl = Ga.current, R(Wa), R(Ga);
	}
	var Ya = L(null), Xa = null;
	function Za(e) {
		var t = e.alternate;
		z(no, no.current & 1), z(Ya, e), Xa === null && (t === null || Wa.current !== null || t.memoizedState !== null) && (Xa = e);
	}
	function Qa(e) {
		z(no, no.current), z(Ya, e), Xa === null && (Xa = e);
	}
	function $a(e) {
		e.tag === 22 ? (z(no, no.current), z(Ya, e), Xa === null && (Xa = e)) : eo(e);
	}
	function eo() {
		z(no, no.current), z(Ya, Ya.current);
	}
	function to(e) {
		R(Ya), Xa === e && (Xa = null), R(no);
	}
	var no = L(0);
	function ro(e) {
		for (var t = e; t !== null;) {
			if (t.tag === 13) {
				var n = t.memoizedState;
				if (n !== null && (n = n.dehydrated, n === null || of(n) || sf(n))) return t;
			} else if (t.tag === 19 && (t.memoizedProps.revealOrder === "forwards" || t.memoizedProps.revealOrder === "backwards" || t.memoizedProps.revealOrder === "unstable_legacy-backwards" || t.memoizedProps.revealOrder === "together")) {
				if (t.flags & 128) return t;
			} else if (t.child !== null) {
				t.child.return = t, t = t.child;
				continue;
			}
			if (t === e) break;
			for (; t.sibling === null;) {
				if (t.return === null || t.return === e) return null;
				t = t.return;
			}
			t.sibling.return = t.return, t = t.sibling;
		}
		return null;
	}
	var io = 0, J = null, Y = null, ao = null, oo = !1, so = !1, co = !1, lo = 0, uo = 0, fo = null, po = 0;
	function mo() {
		throw Error(i(321));
	}
	function ho(e, t) {
		if (t === null) return !1;
		for (var n = 0; n < t.length && n < e.length; n++) if (!hr(e[n], t[n])) return !1;
		return !0;
	}
	function go(e, t, n, r, i, a) {
		return io = a, J = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, F.H = e === null || e.memoizedState === null ? Ns : Ps, co = !1, a = n(r, i), co = !1, so && (a = vo(t, n, r, i)), _o(e), a;
	}
	function _o(e) {
		F.H = Ms;
		var t = Y !== null && Y.next !== null;
		if (io = 0, ao = Y = J = null, oo = !1, uo = 0, fo = null, t) throw Error(i(300));
		e === null || Zs || (e = e.dependencies, e !== null && Ki(e) && (Zs = !0));
	}
	function vo(e, t, n, r) {
		J = e;
		var a = 0;
		do {
			if (so && (fo = null), uo = 0, so = !1, 25 <= a) throw Error(i(301));
			if (a += 1, ao = Y = null, e.updateQueue != null) {
				var o = e.updateQueue;
				o.lastEffect = null, o.events = null, o.stores = null, o.memoCache != null && (o.memoCache.index = 0);
			}
			F.H = Fs, o = t(n, r);
		} while (so);
		return o;
	}
	function yo() {
		var e = F.H, t = e.useState()[0];
		return t = typeof t.then == "function" ? Eo(t) : t, e = e.useState()[0], (Y === null ? null : Y.memoizedState) !== e && (J.flags |= 1024), t;
	}
	function bo() {
		var e = lo !== 0;
		return lo = 0, e;
	}
	function xo(e, t, n) {
		t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
	}
	function So(e) {
		if (oo) {
			for (e = e.memoizedState; e !== null;) {
				var t = e.queue;
				t !== null && (t.pending = null), e = e.next;
			}
			oo = !1;
		}
		io = 0, ao = Y = J = null, so = !1, uo = lo = 0, fo = null;
	}
	function Co() {
		var e = {
			memoizedState: null,
			baseState: null,
			baseQueue: null,
			queue: null,
			next: null
		};
		return ao === null ? J.memoizedState = ao = e : ao = ao.next = e, ao;
	}
	function wo() {
		if (Y === null) {
			var e = J.alternate;
			e = e === null ? null : e.memoizedState;
		} else e = Y.next;
		var t = ao === null ? J.memoizedState : ao.next;
		if (t !== null) ao = t, Y = e;
		else {
			if (e === null) throw J.alternate === null ? Error(i(467)) : Error(i(310));
			Y = e, e = {
				memoizedState: Y.memoizedState,
				baseState: Y.baseState,
				baseQueue: Y.baseQueue,
				queue: Y.queue,
				next: null
			}, ao === null ? J.memoizedState = ao = e : ao = ao.next = e;
		}
		return ao;
	}
	function To() {
		return {
			lastEffect: null,
			events: null,
			stores: null,
			memoCache: null
		};
	}
	function Eo(e) {
		var t = uo;
		return uo += 1, fo === null && (fo = []), e = ba(fo, e, t), t = J, (ao === null ? t.memoizedState : ao.next) === null && (t = t.alternate, F.H = t === null || t.memoizedState === null ? Ns : Ps), e;
	}
	function Do(e) {
		if (typeof e == "object" && e) {
			if (typeof e.then == "function") return Eo(e);
			if (e.$$typeof === C) return Ji(e);
		}
		throw Error(i(438, String(e)));
	}
	function Oo(e) {
		var t = null, n = J.updateQueue;
		if (n !== null && (t = n.memoCache), t == null) {
			var r = J.alternate;
			r !== null && (r = r.updateQueue, r !== null && (r = r.memoCache, r != null && (t = {
				data: r.data.map(function(e) {
					return e.slice();
				}),
				index: 0
			})));
		}
		if (t ??= {
			data: [],
			index: 0
		}, n === null && (n = To(), J.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0) for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = A;
		return t.index++, n;
	}
	function ko(e, t) {
		return typeof t == "function" ? t(e) : t;
	}
	function Ao(e) {
		return jo(wo(), Y, e);
	}
	function jo(e, t, n) {
		var r = e.queue;
		if (r === null) throw Error(i(311));
		r.lastRenderedReducer = n;
		var a = e.baseQueue, o = r.pending;
		if (o !== null) {
			if (a !== null) {
				var s = a.next;
				a.next = o.next, o.next = s;
			}
			t.baseQueue = a = o, r.pending = null;
		}
		if (o = e.baseState, a === null) e.memoizedState = o;
		else {
			t = a.next;
			var c = s = null, l = null, u = t, d = !1;
			do {
				var f = u.lane & -536870913;
				if (f === u.lane ? (io & f) === f : (Z & f) === f) {
					var p = u.revertLane;
					if (p === 0) l !== null && (l = l.next = {
						lane: 0,
						revertLane: 0,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}), f === aa && (d = !0);
					else if ((io & p) === p) {
						u = u.next, p === aa && (d = !0);
						continue;
					} else f = {
						lane: 0,
						revertLane: u.revertLane,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}, l === null ? (c = l = f, s = o) : l = l.next = f, J.lanes |= p, Wl |= p;
					f = u.action, co && n(o, f), o = u.hasEagerState ? u.eagerState : n(o, f);
				} else p = {
					lane: f,
					revertLane: u.revertLane,
					gesture: u.gesture,
					action: u.action,
					hasEagerState: u.hasEagerState,
					eagerState: u.eagerState,
					next: null
				}, l === null ? (c = l = p, s = o) : l = l.next = p, J.lanes |= f, Wl |= f;
				u = u.next;
			} while (u !== null && u !== t);
			if (l === null ? s = o : l.next = c, !hr(o, e.memoizedState) && (Zs = !0, d && (n = oa, n !== null))) throw n;
			e.memoizedState = o, e.baseState = s, e.baseQueue = l, r.lastRenderedState = o;
		}
		return a === null && (r.lanes = 0), [e.memoizedState, r.dispatch];
	}
	function Mo(e) {
		var t = wo(), n = t.queue;
		if (n === null) throw Error(i(311));
		n.lastRenderedReducer = e;
		var r = n.dispatch, a = n.pending, o = t.memoizedState;
		if (a !== null) {
			n.pending = null;
			var s = a = a.next;
			do
				o = e(o, s.action), s = s.next;
			while (s !== a);
			hr(o, t.memoizedState) || (Zs = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
		}
		return [o, r];
	}
	function No(e, t, n) {
		var r = J, a = wo(), o = K;
		if (o) {
			if (n === void 0) throw Error(i(407));
			n = n();
		} else n = t();
		var s = !hr((Y || a).memoizedState, n);
		if (s && (a.memoizedState = n, Zs = !0), a = a.queue, is(Io.bind(null, r, a, e), [e]), a.getSnapshot !== t || s || ao !== null && ao.memoizedState.tag & 1) {
			if (r.flags |= 2048, $o(9, { destroy: void 0 }, Fo.bind(null, r, a, n, t), null), Il === null) throw Error(i(349));
			o || io & 127 || Po(r, t, n);
		}
		return n;
	}
	function Po(e, t, n) {
		e.flags |= 16384, e = {
			getSnapshot: t,
			value: n
		}, t = J.updateQueue, t === null ? (t = To(), J.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
	}
	function Fo(e, t, n, r) {
		t.value = n, t.getSnapshot = r, Lo(t) && Ro(e);
	}
	function Io(e, t, n) {
		return n(function() {
			Lo(t) && Ro(e);
		});
	}
	function Lo(e) {
		var t = e.getSnapshot;
		e = e.value;
		try {
			var n = t();
			return !hr(e, n);
		} catch {
			return !0;
		}
	}
	function Ro(e) {
		var t = Xr(e, 2);
		t !== null && mu(t, e, 2);
	}
	function zo(e) {
		var t = Co();
		if (typeof e == "function") {
			var n = e;
			if (e = n(), co) {
				Ne(!0);
				try {
					n();
				} finally {
					Ne(!1);
				}
			}
		}
		return t.memoizedState = t.baseState = e, t.queue = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: ko,
			lastRenderedState: e
		}, t;
	}
	function Bo(e, t, n, r) {
		return e.baseState = n, jo(e, Y, typeof r == "function" ? r : ko);
	}
	function Vo(e, t, n, r, a) {
		if (ks(e)) throw Error(i(485));
		if (e = t.action, e !== null) {
			var o = {
				payload: a,
				action: e,
				next: null,
				isTransition: !0,
				status: "pending",
				value: null,
				reason: null,
				listeners: [],
				then: function(e) {
					o.listeners.push(e);
				}
			};
			F.T === null ? o.isTransition = !1 : n(!0), r(o), n = t.pending, n === null ? (o.next = t.pending = o, Ho(t, o)) : (o.next = n.next, t.pending = n.next = o);
		}
	}
	function Ho(e, t) {
		var n = t.action, r = t.payload, i = e.state;
		if (t.isTransition) {
			var a = F.T, o = {};
			F.T = o;
			try {
				var s = n(i, r), c = F.S;
				c !== null && c(o, s), Uo(e, t, s);
			} catch (n) {
				Go(e, t, n);
			} finally {
				a !== null && o.types !== null && (a.types = o.types), F.T = a;
			}
		} else try {
			a = n(i, r), Uo(e, t, a);
		} catch (n) {
			Go(e, t, n);
		}
	}
	function Uo(e, t, n) {
		typeof n == "object" && n && typeof n.then == "function" ? n.then(function(n) {
			Wo(e, t, n);
		}, function(n) {
			return Go(e, t, n);
		}) : Wo(e, t, n);
	}
	function Wo(e, t, n) {
		t.status = "fulfilled", t.value = n, Ko(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, Ho(e, n)));
	}
	function Go(e, t, n) {
		var r = e.pending;
		if (e.pending = null, r !== null) {
			r = r.next;
			do
				t.status = "rejected", t.reason = n, Ko(t), t = t.next;
			while (t !== r);
		}
		e.action = null;
	}
	function Ko(e) {
		e = e.listeners;
		for (var t = 0; t < e.length; t++) (0, e[t])();
	}
	function qo(e, t) {
		return t;
	}
	function Jo(e, t) {
		if (K) {
			var n = Il.formState;
			if (n !== null) {
				a: {
					var r = J;
					if (K) {
						if (Di) {
							b: {
								for (var i = Di, a = ki; i.nodeType !== 8;) {
									if (!a) {
										i = null;
										break b;
									}
									if (i = lf(i.nextSibling), i === null) {
										i = null;
										break b;
									}
								}
								a = i.data, i = a === "F!" || a === "F" ? i : null;
							}
							if (i) {
								Di = lf(i.nextSibling), r = i.data === "F!";
								break a;
							}
						}
						ji(r);
					}
					r = !1;
				}
				r && (t = n[0]);
			}
		}
		return n = Co(), n.memoizedState = n.baseState = t, r = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: qo,
			lastRenderedState: t
		}, n.queue = r, n = Es.bind(null, J, r), r.dispatch = n, r = zo(!1), a = Os.bind(null, J, !1, r.queue), r = Co(), i = {
			state: t,
			dispatch: null,
			action: e,
			pending: null
		}, r.queue = i, n = Vo.bind(null, J, i, a, n), i.dispatch = n, r.memoizedState = e, [
			t,
			n,
			!1
		];
	}
	function Yo(e) {
		return Xo(wo(), Y, e);
	}
	function Xo(e, t, n) {
		if (t = jo(e, t, qo)[0], e = Ao(ko)[0], typeof t == "object" && t && typeof t.then == "function") try {
			var r = Eo(t);
		} catch (e) {
			throw e === ha ? _a : e;
		}
		else r = t;
		t = wo();
		var i = t.queue, a = i.dispatch;
		return n !== t.memoizedState && (J.flags |= 2048, $o(9, { destroy: void 0 }, Zo.bind(null, i, n), null)), [
			r,
			a,
			e
		];
	}
	function Zo(e, t) {
		e.action = t;
	}
	function Qo(e) {
		var t = wo(), n = Y;
		if (n !== null) return Xo(t, n, e);
		wo(), t = t.memoizedState, n = wo();
		var r = n.queue.dispatch;
		return n.memoizedState = e, [
			t,
			r,
			!1
		];
	}
	function $o(e, t, n, r) {
		return e = {
			tag: e,
			create: n,
			deps: r,
			inst: t,
			next: null
		}, t = J.updateQueue, t === null && (t = To(), J.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e), e;
	}
	function es() {
		return wo().memoizedState;
	}
	function ts(e, t, n, r) {
		var i = Co();
		J.flags |= e, i.memoizedState = $o(1 | t, { destroy: void 0 }, n, r === void 0 ? null : r);
	}
	function ns(e, t, n, r) {
		var i = wo();
		r = r === void 0 ? null : r;
		var a = i.memoizedState.inst;
		Y !== null && r !== null && ho(r, Y.memoizedState.deps) ? i.memoizedState = $o(t, a, n, r) : (J.flags |= e, i.memoizedState = $o(1 | t, a, n, r));
	}
	function rs(e, t) {
		ts(8390656, 8, e, t);
	}
	function is(e, t) {
		ns(2048, 8, e, t);
	}
	function as(e) {
		J.flags |= 4;
		var t = J.updateQueue;
		if (t === null) t = To(), J.updateQueue = t, t.events = [e];
		else {
			var n = t.events;
			n === null ? t.events = [e] : n.push(e);
		}
	}
	function os(e) {
		var t = wo().memoizedState;
		return as({
			ref: t,
			nextImpl: e
		}), function() {
			if (Fl & 2) throw Error(i(440));
			return t.impl.apply(void 0, arguments);
		};
	}
	function ss(e, t) {
		return ns(4, 2, e, t);
	}
	function cs(e, t) {
		return ns(4, 4, e, t);
	}
	function ls(e, t) {
		if (typeof t == "function") {
			e = e();
			var n = t(e);
			return function() {
				typeof n == "function" ? n() : t(null);
			};
		}
		if (t != null) return e = e(), t.current = e, function() {
			t.current = null;
		};
	}
	function us(e, t, n) {
		n = n == null ? null : n.concat([e]), ns(4, 4, ls.bind(null, t, e), n);
	}
	function ds() {}
	function fs(e, t) {
		var n = wo();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		return t !== null && ho(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
	}
	function ps(e, t) {
		var n = wo();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		if (t !== null && ho(t, r[1])) return r[0];
		if (r = e(), co) {
			Ne(!0);
			try {
				e();
			} finally {
				Ne(!1);
			}
		}
		return n.memoizedState = [r, t], r;
	}
	function ms(e, t, n) {
		return n === void 0 || io & 1073741824 && !(Z & 261930) ? e.memoizedState = t : (e.memoizedState = n, e = pu(), J.lanes |= e, Wl |= e, n);
	}
	function hs(e, t, n, r) {
		return hr(n, t) ? n : Wa.current === null ? !(io & 42) || io & 1073741824 && !(Z & 261930) ? (Zs = !0, e.memoizedState = n) : (e = pu(), J.lanes |= e, Wl |= e, t) : (e = ms(e, n, r), hr(e, t) || (Zs = !0), e);
	}
	function gs(e, t, n, r, i) {
		var a = I.p;
		I.p = a !== 0 && 8 > a ? a : 8;
		var o = F.T, s = {};
		F.T = s, Os(e, !1, t, n);
		try {
			var c = i(), l = F.S;
			l !== null && l(s, c), typeof c == "object" && c && typeof c.then == "function" ? Ds(e, t, la(c, r), fu(e)) : Ds(e, t, r, fu(e));
		} catch (n) {
			Ds(e, t, {
				then: function() {},
				status: "rejected",
				reason: n
			}, fu());
		} finally {
			I.p = a, o !== null && s.types !== null && (o.types = s.types), F.T = o;
		}
	}
	function _s() {}
	function vs(e, t, n, r) {
		if (e.tag !== 5) throw Error(i(476));
		var a = ys(e).queue;
		gs(e, a, t, te, n === null ? _s : function() {
			return bs(e), n(r);
		});
	}
	function ys(e) {
		var t = e.memoizedState;
		if (t !== null) return t;
		t = {
			memoizedState: te,
			baseState: te,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: ko,
				lastRenderedState: te
			},
			next: null
		};
		var n = {};
		return t.next = {
			memoizedState: n,
			baseState: n,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: ko,
				lastRenderedState: n
			},
			next: null
		}, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
	}
	function bs(e) {
		var t = ys(e);
		t.next === null && (t = e.alternate.memoizedState), Ds(e, t.next.queue, {}, fu());
	}
	function xs() {
		return Ji($f);
	}
	function Ss() {
		return wo().memoizedState;
	}
	function Cs() {
		return wo().memoizedState;
	}
	function ws(e) {
		for (var t = e.return; t !== null;) {
			switch (t.tag) {
				case 24:
				case 3:
					var n = fu();
					e = q(n);
					var r = Ia(t, e, n);
					r !== null && (mu(r, t, n), La(r, t, n)), t = { cache: ta() }, e.payload = t;
					return;
			}
			t = t.return;
		}
	}
	function Ts(e, t, n) {
		var r = fu();
		n = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, ks(e) ? As(t, n) : (n = Yr(e, t, n, r), n !== null && (mu(n, e, r), js(n, t, r)));
	}
	function Es(e, t, n) {
		Ds(e, t, n, fu());
	}
	function Ds(e, t, n, r) {
		var i = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		};
		if (ks(e)) As(t, i);
		else {
			var a = e.alternate;
			if (e.lanes === 0 && (a === null || a.lanes === 0) && (a = t.lastRenderedReducer, a !== null)) try {
				var o = t.lastRenderedState, s = a(o, n);
				if (i.hasEagerState = !0, i.eagerState = s, hr(s, o)) return Jr(e, t, i, 0), Il === null && qr(), !1;
			} catch {}
			if (n = Yr(e, t, i, r), n !== null) return mu(n, e, r), js(n, t, r), !0;
		}
		return !1;
	}
	function Os(e, t, n, r) {
		if (r = {
			lane: 2,
			revertLane: dd(),
			gesture: null,
			action: r,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, ks(e)) {
			if (t) throw Error(i(479));
		} else t = Yr(e, n, r, 2), t !== null && mu(t, e, 2);
	}
	function ks(e) {
		var t = e.alternate;
		return e === J || t !== null && t === J;
	}
	function As(e, t) {
		so = oo = !0;
		var n = e.pending;
		n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
	}
	function js(e, t, n) {
		if (n & 4194048) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, Xe(e, n);
		}
	}
	var Ms = {
		readContext: Ji,
		use: Do,
		useCallback: mo,
		useContext: mo,
		useEffect: mo,
		useImperativeHandle: mo,
		useLayoutEffect: mo,
		useInsertionEffect: mo,
		useMemo: mo,
		useReducer: mo,
		useRef: mo,
		useState: mo,
		useDebugValue: mo,
		useDeferredValue: mo,
		useTransition: mo,
		useSyncExternalStore: mo,
		useId: mo,
		useHostTransitionStatus: mo,
		useFormState: mo,
		useActionState: mo,
		useOptimistic: mo,
		useMemoCache: mo,
		useCacheRefresh: mo
	};
	Ms.useEffectEvent = mo;
	var Ns = {
		readContext: Ji,
		use: Do,
		useCallback: function(e, t) {
			return Co().memoizedState = [e, t === void 0 ? null : t], e;
		},
		useContext: Ji,
		useEffect: rs,
		useImperativeHandle: function(e, t, n) {
			n = n == null ? null : n.concat([e]), ts(4194308, 4, ls.bind(null, t, e), n);
		},
		useLayoutEffect: function(e, t) {
			return ts(4194308, 4, e, t);
		},
		useInsertionEffect: function(e, t) {
			ts(4, 2, e, t);
		},
		useMemo: function(e, t) {
			var n = Co();
			t = t === void 0 ? null : t;
			var r = e();
			if (co) {
				Ne(!0);
				try {
					e();
				} finally {
					Ne(!1);
				}
			}
			return n.memoizedState = [r, t], r;
		},
		useReducer: function(e, t, n) {
			var r = Co();
			if (n !== void 0) {
				var i = n(t);
				if (co) {
					Ne(!0);
					try {
						n(t);
					} finally {
						Ne(!1);
					}
				}
			} else i = t;
			return r.memoizedState = r.baseState = i, e = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: e,
				lastRenderedState: i
			}, r.queue = e, e = e.dispatch = Ts.bind(null, J, e), [r.memoizedState, e];
		},
		useRef: function(e) {
			var t = Co();
			return e = { current: e }, t.memoizedState = e;
		},
		useState: function(e) {
			e = zo(e);
			var t = e.queue, n = Es.bind(null, J, t);
			return t.dispatch = n, [e.memoizedState, n];
		},
		useDebugValue: ds,
		useDeferredValue: function(e, t) {
			return ms(Co(), e, t);
		},
		useTransition: function() {
			var e = zo(!1);
			return e = gs.bind(null, J, e.queue, !0, !1), Co().memoizedState = e, [!1, e];
		},
		useSyncExternalStore: function(e, t, n) {
			var r = J, a = Co();
			if (K) {
				if (n === void 0) throw Error(i(407));
				n = n();
			} else {
				if (n = t(), Il === null) throw Error(i(349));
				Z & 127 || Po(r, t, n);
			}
			a.memoizedState = n;
			var o = {
				value: n,
				getSnapshot: t
			};
			return a.queue = o, rs(Io.bind(null, r, o, e), [e]), r.flags |= 2048, $o(9, { destroy: void 0 }, Fo.bind(null, r, o, n, t), null), n;
		},
		useId: function() {
			var e = Co(), t = Il.identifierPrefix;
			if (K) {
				var n = bi, r = yi;
				n = (r & ~(1 << 32 - Pe(r) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = lo++, 0 < n && (t += "H" + n.toString(32)), t += "_";
			} else n = po++, t = "_" + t + "r_" + n.toString(32) + "_";
			return e.memoizedState = t;
		},
		useHostTransitionStatus: xs,
		useFormState: Jo,
		useActionState: Jo,
		useOptimistic: function(e) {
			var t = Co();
			t.memoizedState = t.baseState = e;
			var n = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: null,
				lastRenderedState: null
			};
			return t.queue = n, t = Os.bind(null, J, !0, n), n.dispatch = t, [e, t];
		},
		useMemoCache: Oo,
		useCacheRefresh: function() {
			return Co().memoizedState = ws.bind(null, J);
		},
		useEffectEvent: function(e) {
			var t = Co(), n = { impl: e };
			return t.memoizedState = n, function() {
				if (Fl & 2) throw Error(i(440));
				return n.impl.apply(void 0, arguments);
			};
		}
	}, Ps = {
		readContext: Ji,
		use: Do,
		useCallback: fs,
		useContext: Ji,
		useEffect: is,
		useImperativeHandle: us,
		useInsertionEffect: ss,
		useLayoutEffect: cs,
		useMemo: ps,
		useReducer: Ao,
		useRef: es,
		useState: function() {
			return Ao(ko);
		},
		useDebugValue: ds,
		useDeferredValue: function(e, t) {
			return hs(wo(), Y.memoizedState, e, t);
		},
		useTransition: function() {
			var e = Ao(ko)[0], t = wo().memoizedState;
			return [typeof e == "boolean" ? e : Eo(e), t];
		},
		useSyncExternalStore: No,
		useId: Ss,
		useHostTransitionStatus: xs,
		useFormState: Yo,
		useActionState: Yo,
		useOptimistic: function(e, t) {
			return Bo(wo(), Y, e, t);
		},
		useMemoCache: Oo,
		useCacheRefresh: Cs
	};
	Ps.useEffectEvent = os;
	var Fs = {
		readContext: Ji,
		use: Do,
		useCallback: fs,
		useContext: Ji,
		useEffect: is,
		useImperativeHandle: us,
		useInsertionEffect: ss,
		useLayoutEffect: cs,
		useMemo: ps,
		useReducer: Mo,
		useRef: es,
		useState: function() {
			return Mo(ko);
		},
		useDebugValue: ds,
		useDeferredValue: function(e, t) {
			var n = wo();
			return Y === null ? ms(n, e, t) : hs(n, Y.memoizedState, e, t);
		},
		useTransition: function() {
			var e = Mo(ko)[0], t = wo().memoizedState;
			return [typeof e == "boolean" ? e : Eo(e), t];
		},
		useSyncExternalStore: No,
		useId: Ss,
		useHostTransitionStatus: xs,
		useFormState: Qo,
		useActionState: Qo,
		useOptimistic: function(e, t) {
			var n = wo();
			return Y === null ? (n.baseState = e, [e, n.queue.dispatch]) : Bo(n, Y, e, t);
		},
		useMemoCache: Oo,
		useCacheRefresh: Cs
	};
	Fs.useEffectEvent = os;
	function Is(e, t, n, r) {
		t = e.memoizedState, n = n(r, t), n = n == null ? t : h({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
	}
	var Ls = {
		enqueueSetState: function(e, t, n) {
			e = e._reactInternals;
			var r = fu(), i = q(r);
			i.payload = t, n != null && (i.callback = n), t = Ia(e, i, r), t !== null && (mu(t, e, r), La(t, e, r));
		},
		enqueueReplaceState: function(e, t, n) {
			e = e._reactInternals;
			var r = fu(), i = q(r);
			i.tag = 1, i.payload = t, n != null && (i.callback = n), t = Ia(e, i, r), t !== null && (mu(t, e, r), La(t, e, r));
		},
		enqueueForceUpdate: function(e, t) {
			e = e._reactInternals;
			var n = fu(), r = q(n);
			r.tag = 2, t != null && (r.callback = t), t = Ia(e, r, n), t !== null && (mu(t, e, n), La(t, e, n));
		}
	};
	function Rs(e, t, n, r, i, a, o) {
		return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, a, o) : t.prototype && t.prototype.isPureReactComponent ? !gr(n, r) || !gr(i, a) : !0;
	}
	function zs(e, t, n, r) {
		e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && Ls.enqueueReplaceState(t, t.state, null);
	}
	function Bs(e, t) {
		var n = t;
		if ("ref" in t) for (var r in n = {}, t) r !== "ref" && (n[r] = t[r]);
		if (e = e.defaultProps) for (var i in n === t && (n = h({}, n)), e) n[i] === void 0 && (n[i] = e[i]);
		return n;
	}
	function Vs(e) {
		Ur(e);
	}
	function Hs(e) {
		console.error(e);
	}
	function Us(e) {
		Ur(e);
	}
	function Ws(e, t) {
		try {
			var n = e.onUncaughtError;
			n(t.value, { componentStack: t.stack });
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function Gs(e, t, n) {
		try {
			var r = e.onCaughtError;
			r(n.value, {
				componentStack: n.stack,
				errorBoundary: t.tag === 1 ? t.stateNode : null
			});
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function Ks(e, t, n) {
		return n = q(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
			Ws(e, t);
		}, n;
	}
	function qs(e) {
		return e = q(e), e.tag = 3, e;
	}
	function Js(e, t, n, r) {
		var i = n.type.getDerivedStateFromError;
		if (typeof i == "function") {
			var a = r.value;
			e.payload = function() {
				return i(a);
			}, e.callback = function() {
				Gs(t, n, r);
			};
		}
		var o = n.stateNode;
		o !== null && typeof o.componentDidCatch == "function" && (e.callback = function() {
			Gs(t, n, r), typeof i != "function" && (nu === null ? nu = /* @__PURE__ */ new Set([this]) : nu.add(this));
			var e = r.stack;
			this.componentDidCatch(r.value, { componentStack: e === null ? "" : e });
		});
	}
	function Ys(e, t, n, r, a) {
		if (n.flags |= 32768, typeof r == "object" && r && typeof r.then == "function") {
			if (t = n.alternate, t !== null && Gi(t, n, a, !0), n = Ya.current, n !== null) {
				switch (n.tag) {
					case 31:
					case 13: return Xa === null ? Eu() : n.alternate === null && Ul === 0 && (Ul = 3), n.flags &= -257, n.flags |= 65536, n.lanes = a, r === va ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = /* @__PURE__ */ new Set([r]) : t.add(r), Gu(e, r, a)), !1;
					case 22: return n.flags |= 65536, r === va ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
						transitions: null,
						markerInstances: null,
						retryQueue: /* @__PURE__ */ new Set([r])
					}, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = /* @__PURE__ */ new Set([r]) : n.add(r)), Gu(e, r, a)), !1;
				}
				throw Error(i(435, n.tag));
			}
			return Gu(e, r, a), Eu(), !1;
		}
		if (K) return t = Ya.current, t === null ? (r !== Ai && (t = Error(i(423), { cause: r }), Li(di(t, n))), e = e.current.alternate, e.flags |= 65536, a &= -a, e.lanes |= a, r = di(r, n), a = Ks(e.stateNode, r, a), Ra(e, a), Ul !== 4 && (Ul = 2)) : (!(t.flags & 65536) && (t.flags |= 256), t.flags |= 65536, t.lanes = a, r !== Ai && (e = Error(i(422), { cause: r }), Li(di(e, n)))), !1;
		var o = Error(i(520), { cause: r });
		if (o = di(o, n), Yl === null ? Yl = [o] : Yl.push(o), Ul !== 4 && (Ul = 2), t === null) return !0;
		r = di(r, n), n = t;
		do {
			switch (n.tag) {
				case 3: return n.flags |= 65536, e = a & -a, n.lanes |= e, e = Ks(n.stateNode, r, e), Ra(n, e), !1;
				case 1: if (t = n.type, o = n.stateNode, !(n.flags & 128) && (typeof t.getDerivedStateFromError == "function" || o !== null && typeof o.componentDidCatch == "function" && (nu === null || !nu.has(o)))) return n.flags |= 65536, a &= -a, n.lanes |= a, a = qs(a), Js(a, e, n, r), Ra(n, a), !1;
			}
			n = n.return;
		} while (n !== null);
		return !1;
	}
	var Xs = Error(i(461)), Zs = !1;
	function Qs(e, t, n, r) {
		t.child = e === null ? Ma(t, null, n, r) : ja(t, e.child, n, r);
	}
	function $s(e, t, n, r, i) {
		n = n.render;
		var a = t.ref;
		if ("ref" in r) {
			var o = {};
			for (var s in r) s !== "ref" && (o[s] = r[s]);
		} else o = r;
		return qi(t), r = go(e, t, n, o, a, i), s = bo(), e !== null && !Zs ? (xo(e, t, i), Cc(e, t, i)) : (K && s && Ci(t), t.flags |= 1, Qs(e, t, r, i), t.child);
	}
	function ec(e, t, n, r, i) {
		if (e === null) {
			var a = n.type;
			return typeof a == "function" && !ni(a) && a.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = a, tc(e, t, a, r, i)) : (e = ai(n.type, null, r, t, t.mode, i), e.ref = t.ref, e.return = t, t.child = e);
		}
		if (a = e.child, !wc(e, i)) {
			var o = a.memoizedProps;
			if (n = n.compare, n = n === null ? gr : n, n(o, r) && e.ref === t.ref) return Cc(e, t, i);
		}
		return t.flags |= 1, e = ri(a, r), e.ref = t.ref, e.return = t, t.child = e;
	}
	function tc(e, t, n, r, i) {
		if (e !== null) {
			var a = e.memoizedProps;
			if (gr(a, r) && e.ref === t.ref) {
				if (Zs = !1, t.pendingProps = r = a, wc(e, i)) e.flags & 131072 && (Zs = !0);
				else return t.lanes = e.lanes, Cc(e, t, i);
			}
		}
		return lc(e, t, n, r, i);
	}
	function nc(e, t, n, r) {
		var i = r.children, a = e === null ? null : e.memoizedState;
		if (e === null && t.stateNode === null && (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), r.mode === "hidden") {
			if (t.flags & 128) {
				if (a = a === null ? n : a.baseLanes | n, e !== null) {
					for (r = t.child = e.child, i = 0; r !== null;) i = i | r.lanes | r.childLanes, r = r.sibling;
					r = i & ~a;
				} else r = 0, t.child = null;
				return ic(e, t, a, n, r);
			}
			if (n & 536870912) t.memoizedState = {
				baseLanes: 0,
				cachePool: null
			}, e !== null && pa(t, a === null ? null : a.cachePool), a === null ? qa() : Ka(t, a), $a(t);
			else return r = t.lanes = 536870912, ic(e, t, a === null ? n : a.baseLanes | n, n, r);
		} else a === null ? (e !== null && pa(t, null), qa(), eo(t)) : (pa(t, a.cachePool), Ka(t, a), eo(t), t.memoizedState = null);
		return Qs(e, t, i, n), t.child;
	}
	function rc(e, t) {
		return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), t.sibling;
	}
	function ic(e, t, n, r, i) {
		var a = fa();
		return a = a === null ? null : {
			parent: ea._currentValue,
			pool: a
		}, t.memoizedState = {
			baseLanes: n,
			cachePool: a
		}, e !== null && pa(t, null), qa(), $a(t), e !== null && Gi(e, t, r, !0), t.childLanes = i, null;
	}
	function ac(e, t) {
		return t = vc({
			mode: t.mode,
			children: t.children
		}, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
	}
	function oc(e, t, n) {
		return ja(t, e.child, null, n), e = ac(t, t.pendingProps), e.flags |= 2, to(t), t.memoizedState = null, e;
	}
	function sc(e, t, n) {
		var r = t.pendingProps, a = !!(t.flags & 128);
		if (t.flags &= -129, e === null) {
			if (K) {
				if (r.mode === "hidden") return e = ac(t, r), t.lanes = 536870912, rc(null, e);
				if (Qa(t), (e = Di) ? (e = af(e, ki), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: vi === null ? null : {
						id: yi,
						overflow: bi
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = ci(e), n.return = t, t.child = n, Ei = t, Di = null)) : e = null, e === null) throw ji(t);
				return t.lanes = 536870912, null;
			}
			return ac(t, r);
		}
		var o = e.memoizedState;
		if (o !== null) {
			var s = o.dehydrated;
			if (Qa(t), a) {
				if (t.flags & 256) t.flags &= -257, t = oc(e, t, n);
				else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;
				else throw Error(i(558));
			} else if (Zs || Gi(e, t, n, !1), a = (n & e.childLanes) !== 0, Zs || a) {
				if (r = Il, r !== null && (s = Ze(r, n), s !== 0 && s !== o.retryLane)) throw o.retryLane = s, Xr(e, s), mu(r, e, s), Xs;
				Eu(), t = oc(e, t, n);
			} else e = o.treeContext, Di = lf(s.nextSibling), Ei = t, K = !0, Oi = null, ki = !1, e !== null && Ti(t, e), t = ac(t, r), t.flags |= 4096;
			return t;
		}
		return e = ri(e.child, {
			mode: r.mode,
			children: r.children
		}), e.ref = t.ref, t.child = e, e.return = t, e;
	}
	function cc(e, t) {
		var n = t.ref;
		if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
		else {
			if (typeof n != "function" && typeof n != "object") throw Error(i(284));
			(e === null || e.ref !== n) && (t.flags |= 4194816);
		}
	}
	function lc(e, t, n, r, i) {
		return qi(t), n = go(e, t, n, r, void 0, i), r = bo(), e !== null && !Zs ? (xo(e, t, i), Cc(e, t, i)) : (K && r && Ci(t), t.flags |= 1, Qs(e, t, n, i), t.child);
	}
	function uc(e, t, n, r, i, a) {
		return qi(t), t.updateQueue = null, n = vo(t, r, n, i), _o(e), r = bo(), e !== null && !Zs ? (xo(e, t, a), Cc(e, t, a)) : (K && r && Ci(t), t.flags |= 1, Qs(e, t, n, a), t.child);
	}
	function dc(e, t, n, r, i) {
		if (qi(t), t.stateNode === null) {
			var a = $r, o = n.contextType;
			typeof o == "object" && o && (a = Ji(o)), a = new n(r, a), t.memoizedState = a.state !== null && a.state !== void 0 ? a.state : null, a.updater = Ls, t.stateNode = a, a._reactInternals = t, a = t.stateNode, a.props = r, a.state = t.memoizedState, a.refs = {}, Pa(t), o = n.contextType, a.context = typeof o == "object" && o ? Ji(o) : $r, a.state = t.memoizedState, o = n.getDerivedStateFromProps, typeof o == "function" && (Is(t, n, o, r), a.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof a.getSnapshotBeforeUpdate == "function" || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (o = a.state, typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount(), o !== a.state && Ls.enqueueReplaceState(a, a.state, null), Va(t, r, a, i), Ba(), a.state = t.memoizedState), typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !0;
		} else if (e === null) {
			a = t.stateNode;
			var s = t.memoizedProps, c = Bs(n, s);
			a.props = c;
			var l = a.context, u = n.contextType;
			o = $r, typeof u == "object" && u && (o = Ji(u));
			var d = n.getDerivedStateFromProps;
			u = typeof d == "function" || typeof a.getSnapshotBeforeUpdate == "function", s = t.pendingProps !== s, u || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (s || l !== o) && zs(t, a, r, o), Na = !1;
			var f = t.memoizedState;
			a.state = f, Va(t, r, a, i), Ba(), l = t.memoizedState, s || f !== l || Na ? (typeof d == "function" && (Is(t, n, d, r), l = t.memoizedState), (c = Na || Rs(t, n, c, r, f, l, o)) ? (u || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount()), typeof a.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = l), a.props = r, a.state = l, a.context = o, r = c) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
		} else {
			a = t.stateNode, Fa(e, t), o = t.memoizedProps, u = Bs(n, o), a.props = u, d = t.pendingProps, f = a.context, l = n.contextType, c = $r, typeof l == "object" && l && (c = Ji(l)), s = n.getDerivedStateFromProps, (l = typeof s == "function" || typeof a.getSnapshotBeforeUpdate == "function") || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (o !== d || f !== c) && zs(t, a, r, c), Na = !1, f = t.memoizedState, a.state = f, Va(t, r, a, i), Ba();
			var p = t.memoizedState;
			o !== d || f !== p || Na || e !== null && e.dependencies !== null && Ki(e.dependencies) ? (typeof s == "function" && (Is(t, n, s, r), p = t.memoizedState), (u = Na || Rs(t, n, u, r, f, p, c) || e !== null && e.dependencies !== null && Ki(e.dependencies)) ? (l || typeof a.UNSAFE_componentWillUpdate != "function" && typeof a.componentWillUpdate != "function" || (typeof a.componentWillUpdate == "function" && a.componentWillUpdate(r, p, c), typeof a.UNSAFE_componentWillUpdate == "function" && a.UNSAFE_componentWillUpdate(r, p, c)), typeof a.componentDidUpdate == "function" && (t.flags |= 4), typeof a.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = p), a.props = r, a.state = p, a.context = c, r = u) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), r = !1);
		}
		return a = r, cc(e, t), r = !!(t.flags & 128), a || r ? (a = t.stateNode, n = r && typeof n.getDerivedStateFromError != "function" ? null : a.render(), t.flags |= 1, e !== null && r ? (t.child = ja(t, e.child, null, i), t.child = ja(t, null, n, i)) : Qs(e, t, n, i), t.memoizedState = a.state, e = t.child) : e = Cc(e, t, i), e;
	}
	function fc(e, t, n, r) {
		return Fi(), t.flags |= 256, Qs(e, t, n, r), t.child;
	}
	var pc = {
		dehydrated: null,
		treeContext: null,
		retryLane: 0,
		hydrationErrors: null
	};
	function mc(e) {
		return {
			baseLanes: e,
			cachePool: ma()
		};
	}
	function hc(e, t, n) {
		return e = e === null ? 0 : e.childLanes & ~n, t && (e |= ql), e;
	}
	function gc(e, t, n) {
		var r = t.pendingProps, a = !1, o = !!(t.flags & 128), s;
		if ((s = o) || (s = e !== null && e.memoizedState === null ? !1 : !!(no.current & 2)), s && (a = !0, t.flags &= -129), s = !!(t.flags & 32), t.flags &= -33, e === null) {
			if (K) {
				if (a ? Za(t) : eo(t), (e = Di) ? (e = af(e, ki), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: vi === null ? null : {
						id: yi,
						overflow: bi
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = ci(e), n.return = t, t.child = n, Ei = t, Di = null)) : e = null, e === null) throw ji(t);
				return sf(e) ? t.lanes = 32 : t.lanes = 536870912, null;
			}
			var c = r.children;
			return r = r.fallback, a ? (eo(t), a = t.mode, c = vc({
				mode: "hidden",
				children: c
			}, a), r = oi(r, a, n, null), c.return = t, r.return = t, c.sibling = r, t.child = c, r = t.child, r.memoizedState = mc(n), r.childLanes = hc(e, s, n), t.memoizedState = pc, rc(null, r)) : (Za(t), _c(t, c));
		}
		var l = e.memoizedState;
		if (l !== null && (c = l.dehydrated, c !== null)) {
			if (o) t.flags & 256 ? (Za(t), t.flags &= -257, t = yc(e, t, n)) : t.memoizedState === null ? (eo(t), c = r.fallback, a = t.mode, r = vc({
				mode: "visible",
				children: r.children
			}, a), c = oi(c, a, n, null), c.flags |= 2, r.return = t, c.return = t, r.sibling = c, t.child = r, ja(t, e.child, null, n), r = t.child, r.memoizedState = mc(n), r.childLanes = hc(e, s, n), t.memoizedState = pc, t = rc(null, r)) : (eo(t), t.child = e.child, t.flags |= 128, t = null);
			else if (Za(t), sf(c)) {
				if (s = c.nextSibling && c.nextSibling.dataset, s) var u = s.dgst;
				s = u, r = Error(i(419)), r.stack = "", r.digest = s, Li({
					value: r,
					source: null,
					stack: null
				}), t = yc(e, t, n);
			} else if (Zs || Gi(e, t, n, !1), s = (n & e.childLanes) !== 0, Zs || s) {
				if (s = Il, s !== null && (r = Ze(s, n), r !== 0 && r !== l.retryLane)) throw l.retryLane = r, Xr(e, r), mu(s, e, r), Xs;
				of(c) || Eu(), t = yc(e, t, n);
			} else of(c) ? (t.flags |= 192, t.child = e.child, t = null) : (e = l.treeContext, Di = lf(c.nextSibling), Ei = t, K = !0, Oi = null, ki = !1, e !== null && Ti(t, e), t = _c(t, r.children), t.flags |= 4096);
			return t;
		}
		return a ? (eo(t), c = r.fallback, a = t.mode, l = e.child, u = l.sibling, r = ri(l, {
			mode: "hidden",
			children: r.children
		}), r.subtreeFlags = l.subtreeFlags & 65011712, u === null ? (c = oi(c, a, n, null), c.flags |= 2) : c = ri(u, c), c.return = t, r.return = t, r.sibling = c, t.child = r, rc(null, r), r = t.child, c = e.child.memoizedState, c === null ? c = mc(n) : (a = c.cachePool, a === null ? a = ma() : (l = ea._currentValue, a = a.parent === l ? a : {
			parent: l,
			pool: l
		}), c = {
			baseLanes: c.baseLanes | n,
			cachePool: a
		}), r.memoizedState = c, r.childLanes = hc(e, s, n), t.memoizedState = pc, rc(e.child, r)) : (Za(t), n = e.child, e = n.sibling, n = ri(n, {
			mode: "visible",
			children: r.children
		}), n.return = t, n.sibling = null, e !== null && (s = t.deletions, s === null ? (t.deletions = [e], t.flags |= 16) : s.push(e)), t.child = n, t.memoizedState = null, n);
	}
	function _c(e, t) {
		return t = vc({
			mode: "visible",
			children: t
		}, e.mode), t.return = e, e.child = t;
	}
	function vc(e, t) {
		return e = ti(22, e, null, t), e.lanes = 0, e;
	}
	function yc(e, t, n) {
		return ja(t, e.child, null, n), e = _c(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
	}
	function bc(e, t, n) {
		e.lanes |= t;
		var r = e.alternate;
		r !== null && (r.lanes |= t), Ui(e.return, t, n);
	}
	function xc(e, t, n, r, i, a) {
		var o = e.memoizedState;
		o === null ? e.memoizedState = {
			isBackwards: t,
			rendering: null,
			renderingStartTime: 0,
			last: r,
			tail: n,
			tailMode: i,
			treeForkCount: a
		} : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = r, o.tail = n, o.tailMode = i, o.treeForkCount = a);
	}
	function Sc(e, t, n) {
		var r = t.pendingProps, i = r.revealOrder, a = r.tail;
		r = r.children;
		var o = no.current, s = !!(o & 2);
		if (s ? (o = o & 1 | 2, t.flags |= 128) : o &= 1, z(no, o), Qs(e, t, r, n), r = K ? hi : 0, !s && e !== null && e.flags & 128) a: for (e = t.child; e !== null;) {
			if (e.tag === 13) e.memoizedState !== null && bc(e, n, t);
			else if (e.tag === 19) bc(e, n, t);
			else if (e.child !== null) {
				e.child.return = e, e = e.child;
				continue;
			}
			if (e === t) break a;
			for (; e.sibling === null;) {
				if (e.return === null || e.return === t) break a;
				e = e.return;
			}
			e.sibling.return = e.return, e = e.sibling;
		}
		switch (i) {
			case "forwards":
				for (n = t.child, i = null; n !== null;) e = n.alternate, e !== null && ro(e) === null && (i = n), n = n.sibling;
				n = i, n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), xc(t, !1, i, n, a, r);
				break;
			case "backwards":
			case "unstable_legacy-backwards":
				for (n = null, i = t.child, t.child = null; i !== null;) {
					if (e = i.alternate, e !== null && ro(e) === null) {
						t.child = i;
						break;
					}
					e = i.sibling, i.sibling = n, n = i, i = e;
				}
				xc(t, !0, n, null, a, r);
				break;
			case "together":
				xc(t, !1, null, null, void 0, r);
				break;
			default: t.memoizedState = null;
		}
		return t.child;
	}
	function Cc(e, t, n) {
		if (e !== null && (t.dependencies = e.dependencies), Wl |= t.lanes, (n & t.childLanes) === 0) {
			if (e !== null) {
				if (Gi(e, t, n, !1), (n & t.childLanes) === 0) return null;
			} else return null;
		}
		if (e !== null && t.child !== e.child) throw Error(i(153));
		if (t.child !== null) {
			for (e = t.child, n = ri(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null;) e = e.sibling, n = n.sibling = ri(e, e.pendingProps), n.return = t;
			n.sibling = null;
		}
		return t.child;
	}
	function wc(e, t) {
		return (e.lanes & t) !== 0 || (e = e.dependencies, !!(e !== null && Ki(e)));
	}
	function Tc(e, t, n) {
		switch (t.tag) {
			case 3:
				se(t, t.stateNode.containerInfo), Vi(t, ea, e.memoizedState.cache), Fi();
				break;
			case 27:
			case 5:
				V(t);
				break;
			case 4:
				se(t, t.stateNode.containerInfo);
				break;
			case 10:
				Vi(t, t.type, t.memoizedProps.value);
				break;
			case 31:
				if (t.memoizedState !== null) return t.flags |= 128, Qa(t), null;
				break;
			case 13:
				var r = t.memoizedState;
				if (r !== null) return r.dehydrated === null ? (n & t.child.childLanes) === 0 ? (Za(t), e = Cc(e, t, n), e === null ? null : e.sibling) : gc(e, t, n) : (Za(t), t.flags |= 128, null);
				Za(t);
				break;
			case 19:
				var i = !!(e.flags & 128);
				if (r = (n & t.childLanes) !== 0, r ||= (Gi(e, t, n, !1), (n & t.childLanes) !== 0), i) {
					if (r) return Sc(e, t, n);
					t.flags |= 128;
				}
				if (i = t.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), z(no, no.current), r) break;
				return null;
			case 22: return t.lanes = 0, nc(e, t, n, t.pendingProps);
			case 24: Vi(t, ea, e.memoizedState.cache);
		}
		return Cc(e, t, n);
	}
	function Ec(e, t, n) {
		if (e !== null) {
			if (e.memoizedProps !== t.pendingProps) Zs = !0;
			else {
				if (!wc(e, n) && !(t.flags & 128)) return Zs = !1, Tc(e, t, n);
				Zs = !!(e.flags & 131072);
			}
		} else Zs = !1, K && t.flags & 1048576 && Si(t, hi, t.index);
		switch (t.lanes = 0, t.tag) {
			case 16:
				a: {
					var r = t.pendingProps;
					if (e = xa(t.elementType), t.type = e, typeof e == "function") ni(e) ? (r = Bs(e, r), t.tag = 1, t = dc(null, t, e, r, n)) : (t.tag = 0, t = lc(null, t, e, r, n));
					else {
						if (e != null) {
							var a = e.$$typeof;
							if (a === w) {
								t.tag = 11, t = $s(null, t, e, r, n);
								break a;
							}
							if (a === D) {
								t.tag = 14, t = ec(null, t, e, r, n);
								break a;
							}
						}
						throw t = P(e) || e, Error(i(306, t, ""));
					}
				}
				return t;
			case 0: return lc(e, t, t.type, t.pendingProps, n);
			case 1: return r = t.type, a = Bs(r, t.pendingProps), dc(e, t, r, a, n);
			case 3:
				a: {
					if (se(t, t.stateNode.containerInfo), e === null) throw Error(i(387));
					r = t.pendingProps;
					var o = t.memoizedState;
					a = o.element, Fa(e, t), Va(t, r, null, n);
					var s = t.memoizedState;
					if (r = s.cache, Vi(t, ea, r), r !== o.cache && Wi(t, [ea], n, !0), Ba(), r = s.element, o.isDehydrated) {
						if (o = {
							element: r,
							isDehydrated: !1,
							cache: s.cache
						}, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
							t = fc(e, t, r, n);
							break a;
						}
						if (r !== a) {
							a = di(Error(i(424)), t), Li(a), t = fc(e, t, r, n);
							break a;
						}
						switch (e = t.stateNode.containerInfo, e.nodeType) {
							case 9:
								e = e.body;
								break;
							default: e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
						}
						for (Di = lf(e.firstChild), Ei = t, K = !0, Oi = null, ki = !0, n = Ma(t, null, r, n), t.child = n; n;) n.flags = n.flags & -3 | 4096, n = n.sibling;
					} else {
						if (Fi(), r === a) {
							t = Cc(e, t, n);
							break a;
						}
						Qs(e, t, r, n);
					}
					t = t.child;
				}
				return t;
			case 26: return cc(e, t), e === null ? (n = Af(t.type, null, t.pendingProps, null)) ? t.memoizedState = n : K || (n = t.type, e = t.pendingProps, r = Vd(ae.current).createElement(n), r[rt] = t, r[it] = e, Fd(r, n, e), gt(r), t.stateNode = r) : t.memoizedState = Af(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
			case 27: return V(t), e === null && K && (r = t.stateNode = pf(t.type, t.pendingProps, ae.current), Ei = t, ki = !0, a = Di, Qd(t.type) ? (uf = a, Di = lf(r.firstChild)) : Di = a), Qs(e, t, t.pendingProps.children, n), cc(e, t), e === null && (t.flags |= 4194304), t.child;
			case 5: return e === null && K && ((a = r = Di) && (r = nf(r, t.type, t.pendingProps, ki), r === null ? a = !1 : (t.stateNode = r, Ei = t, Di = lf(r.firstChild), ki = !1, a = !0)), a || ji(t)), V(t), a = t.type, o = t.pendingProps, s = e === null ? null : e.memoizedProps, r = o.children, Wd(a, o) ? r = null : s !== null && Wd(a, s) && (t.flags |= 32), t.memoizedState !== null && (a = go(e, t, yo, null, null, n), $f._currentValue = a), cc(e, t), Qs(e, t, r, n), t.child;
			case 6: return e === null && K && ((e = n = Di) && (n = rf(n, t.pendingProps, ki), n === null ? e = !1 : (t.stateNode = n, Ei = t, Di = null, e = !0)), e || ji(t)), null;
			case 13: return gc(e, t, n);
			case 4: return se(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = ja(t, null, r, n) : Qs(e, t, r, n), t.child;
			case 11: return $s(e, t, t.type, t.pendingProps, n);
			case 7: return Qs(e, t, t.pendingProps, n), t.child;
			case 8: return Qs(e, t, t.pendingProps.children, n), t.child;
			case 12: return Qs(e, t, t.pendingProps.children, n), t.child;
			case 10: return r = t.pendingProps, Vi(t, t.type, r.value), Qs(e, t, r.children, n), t.child;
			case 9: return a = t.type._context, r = t.pendingProps.children, qi(t), a = Ji(a), r = r(a), t.flags |= 1, Qs(e, t, r, n), t.child;
			case 14: return ec(e, t, t.type, t.pendingProps, n);
			case 15: return tc(e, t, t.type, t.pendingProps, n);
			case 19: return Sc(e, t, n);
			case 31: return sc(e, t, n);
			case 22: return nc(e, t, n, t.pendingProps);
			case 24: return qi(t), r = Ji(ea), e === null ? (a = fa(), a === null && (a = Il, o = ta(), a.pooledCache = o, o.refCount++, o !== null && (a.pooledCacheLanes |= n), a = o), t.memoizedState = {
				parent: r,
				cache: a
			}, Pa(t), Vi(t, ea, a)) : ((e.lanes & n) !== 0 && (Fa(e, t), Va(t, null, null, n), Ba()), a = e.memoizedState, o = t.memoizedState, a.parent === r ? (r = o.cache, Vi(t, ea, r), r !== a.cache && Wi(t, [ea], n, !0)) : (a = {
				parent: r,
				cache: r
			}, t.memoizedState = a, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = a), Vi(t, ea, r))), Qs(e, t, t.pendingProps.children, n), t.child;
			case 29: throw t.pendingProps;
		}
		throw Error(i(156, t.tag));
	}
	function Dc(e) {
		e.flags |= 4;
	}
	function Oc(e, t, n, r, i) {
		if ((t = !!(e.mode & 32)) && (t = !1), t) {
			if (e.flags |= 16777216, (i & 335544128) === i) {
				if (e.stateNode.complete) e.flags |= 8192;
				else if (Cu()) e.flags |= 8192;
				else throw Sa = va, ga;
			}
		} else e.flags &= -16777217;
	}
	function kc(e, t) {
		if (t.type !== "stylesheet" || t.state.loading & 4) e.flags &= -16777217;
		else if (e.flags |= 16777216, !Gf(t)) {
			if (Cu()) e.flags |= 8192;
			else throw Sa = va, ga;
		}
	}
	function Ac(e, t) {
		t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag === 22 ? 536870912 : Ge(), e.lanes |= t, Jl |= t);
	}
	function jc(e, t) {
		if (!K) switch (e.tailMode) {
			case "hidden":
				t = e.tail;
				for (var n = null; t !== null;) t.alternate !== null && (n = t), t = t.sibling;
				n === null ? e.tail = null : n.sibling = null;
				break;
			case "collapsed":
				n = e.tail;
				for (var r = null; n !== null;) n.alternate !== null && (r = n), n = n.sibling;
				r === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : r.sibling = null;
		}
	}
	function Mc(e) {
		var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
		if (t) for (var i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags & 65011712, r |= i.flags & 65011712, i.return = e, i = i.sibling;
		else for (i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags, r |= i.flags, i.return = e, i = i.sibling;
		return e.subtreeFlags |= r, e.childLanes = n, t;
	}
	function Nc(e, t, n) {
		var r = t.pendingProps;
		switch (wi(t), t.tag) {
			case 16:
			case 15:
			case 0:
			case 11:
			case 7:
			case 8:
			case 12:
			case 9:
			case 14: return Mc(t), null;
			case 1: return Mc(t), null;
			case 3: return n = t.stateNode, r = null, e !== null && (r = e.memoizedState.cache), t.memoizedState.cache !== r && (t.flags |= 2048), Hi(ea), ce(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (Pi(t) ? Dc(t) : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, Ii())), Mc(t), null;
			case 26:
				var a = t.type, o = t.memoizedState;
				return e === null ? (Dc(t), o === null ? (Mc(t), Oc(t, a, null, r, n)) : (Mc(t), kc(t, o))) : o ? o === e.memoizedState ? (Mc(t), t.flags &= -16777217) : (Dc(t), Mc(t), kc(t, o)) : (e = e.memoizedProps, e !== r && Dc(t), Mc(t), Oc(t, a, e, r, n)), null;
			case 27:
				if (le(t), n = ae.current, a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && Dc(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return Mc(t), null;
					}
					e = ie.current, Pi(t) ? Mi(t, e) : (e = pf(a, r, n), t.stateNode = e, Dc(t));
				}
				return Mc(t), null;
			case 5:
				if (le(t), a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && Dc(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return Mc(t), null;
					}
					if (o = ie.current, Pi(t)) Mi(t, o);
					else {
						var s = Vd(ae.current);
						switch (o) {
							case 1:
								o = s.createElementNS("http://www.w3.org/2000/svg", a);
								break;
							case 2:
								o = s.createElementNS("http://www.w3.org/1998/Math/MathML", a);
								break;
							default: switch (a) {
								case "svg":
									o = s.createElementNS("http://www.w3.org/2000/svg", a);
									break;
								case "math":
									o = s.createElementNS("http://www.w3.org/1998/Math/MathML", a);
									break;
								case "script":
									o = s.createElement("div"), o.innerHTML = "<script><\/script>", o = o.removeChild(o.firstChild);
									break;
								case "select":
									o = typeof r.is == "string" ? s.createElement("select", { is: r.is }) : s.createElement("select"), r.multiple ? o.multiple = !0 : r.size && (o.size = r.size);
									break;
								default: o = typeof r.is == "string" ? s.createElement(a, { is: r.is }) : s.createElement(a);
							}
						}
						o[rt] = t, o[it] = r;
						a: for (s = t.child; s !== null;) {
							if (s.tag === 5 || s.tag === 6) o.appendChild(s.stateNode);
							else if (s.tag !== 4 && s.tag !== 27 && s.child !== null) {
								s.child.return = s, s = s.child;
								continue;
							}
							if (s === t) break a;
							for (; s.sibling === null;) {
								if (s.return === null || s.return === t) break a;
								s = s.return;
							}
							s.sibling.return = s.return, s = s.sibling;
						}
						t.stateNode = o;
						a: switch (Fd(o, a, r), a) {
							case "button":
							case "input":
							case "select":
							case "textarea":
								r = !!r.autoFocus;
								break a;
							case "img":
								r = !0;
								break a;
							default: r = !1;
						}
						r && Dc(t);
					}
				}
				return Mc(t), Oc(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, n), null;
			case 6:
				if (e && t.stateNode != null) e.memoizedProps !== r && Dc(t);
				else {
					if (typeof r != "string" && t.stateNode === null) throw Error(i(166));
					if (e = ae.current, Pi(t)) {
						if (e = t.stateNode, n = t.memoizedProps, r = null, a = Ei, a !== null) switch (a.tag) {
							case 27:
							case 5: r = a.memoizedProps;
						}
						e[rt] = t, e = !!(e.nodeValue === n || r !== null && !0 === r.suppressHydrationWarning || Md(e.nodeValue, n)), e || ji(t, !0);
					} else e = Vd(e).createTextNode(r), e[rt] = t, t.stateNode = e;
				}
				return Mc(t), null;
			case 31:
				if (n = t.memoizedState, e === null || e.memoizedState !== null) {
					if (r = Pi(t), n !== null) {
						if (e === null) {
							if (!r) throw Error(i(318));
							if (e = t.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(557));
							e[rt] = t;
						} else Fi(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						Mc(t), e = !1;
					} else n = Ii(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
					if (!e) return t.flags & 256 ? (to(t), t) : (to(t), null);
					if (t.flags & 128) throw Error(i(558));
				}
				return Mc(t), null;
			case 13:
				if (r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
					if (a = Pi(t), r !== null && r.dehydrated !== null) {
						if (e === null) {
							if (!a) throw Error(i(318));
							if (a = t.memoizedState, a = a === null ? null : a.dehydrated, !a) throw Error(i(317));
							a[rt] = t;
						} else Fi(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						Mc(t), a = !1;
					} else a = Ii(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = a), a = !0;
					if (!a) return t.flags & 256 ? (to(t), t) : (to(t), null);
				}
				return to(t), t.flags & 128 ? (t.lanes = n, t) : (n = r !== null, e = e !== null && e.memoizedState !== null, n && (r = t.child, a = null, r.alternate !== null && r.alternate.memoizedState !== null && r.alternate.memoizedState.cachePool !== null && (a = r.alternate.memoizedState.cachePool.pool), o = null, r.memoizedState !== null && r.memoizedState.cachePool !== null && (o = r.memoizedState.cachePool.pool), o !== a && (r.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), Ac(t, t.updateQueue), Mc(t), null);
			case 4: return ce(), e === null && Sd(t.stateNode.containerInfo), Mc(t), null;
			case 10: return Hi(t.type), Mc(t), null;
			case 19:
				if (R(no), r = t.memoizedState, r === null) return Mc(t), null;
				if (a = !!(t.flags & 128), o = r.rendering, o === null) {
					if (a) jc(r, !1);
					else {
						if (Ul !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null;) {
							if (o = ro(e), o !== null) {
								for (t.flags |= 128, jc(r, !1), e = o.updateQueue, t.updateQueue = e, Ac(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null;) ii(n, e), n = n.sibling;
								return z(no, no.current & 1 | 2), K && xi(t, r.treeForkCount), t.child;
							}
							e = e.sibling;
						}
						r.tail !== null && Se() > eu && (t.flags |= 128, a = !0, jc(r, !1), t.lanes = 4194304);
					}
				} else {
					if (!a) {
						if (e = ro(o), e !== null) {
							if (t.flags |= 128, a = !0, e = e.updateQueue, t.updateQueue = e, Ac(t, e), jc(r, !0), r.tail === null && r.tailMode === "hidden" && !o.alternate && !K) return Mc(t), null;
						} else 2 * Se() - r.renderingStartTime > eu && n !== 536870912 && (t.flags |= 128, a = !0, jc(r, !1), t.lanes = 4194304);
					}
					r.isBackwards ? (o.sibling = t.child, t.child = o) : (e = r.last, e === null ? t.child = o : e.sibling = o, r.last = o);
				}
				return r.tail === null ? (Mc(t), null) : (e = r.tail, r.rendering = e, r.tail = e.sibling, r.renderingStartTime = Se(), e.sibling = null, n = no.current, z(no, a ? n & 1 | 2 : n & 1), K && xi(t, r.treeForkCount), e);
			case 22:
			case 23: return to(t), Ja(), r = t.memoizedState !== null, e === null ? r && (t.flags |= 8192) : e.memoizedState !== null !== r && (t.flags |= 8192), r ? n & 536870912 && !(t.flags & 128) && (Mc(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Mc(t), n = t.updateQueue, n !== null && Ac(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), r = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (r = t.memoizedState.cachePool.pool), r !== n && (t.flags |= 2048), e !== null && R(da), null;
			case 24: return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), Hi(ea), Mc(t), null;
			case 25: return null;
			case 30: return null;
		}
		throw Error(i(156, t.tag));
	}
	function Pc(e, t) {
		switch (wi(t), t.tag) {
			case 1: return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 3: return Hi(ea), ce(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
			case 26:
			case 27:
			case 5: return le(t), null;
			case 31:
				if (t.memoizedState !== null) {
					if (to(t), t.alternate === null) throw Error(i(340));
					Fi();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 13:
				if (to(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
					if (t.alternate === null) throw Error(i(340));
					Fi();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 19: return R(no), null;
			case 4: return ce(), null;
			case 10: return Hi(t.type), null;
			case 22:
			case 23: return to(t), Ja(), e !== null && R(da), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 24: return Hi(ea), null;
			case 25: return null;
			default: return null;
		}
	}
	function Fc(e, t) {
		switch (wi(t), t.tag) {
			case 3:
				Hi(ea), ce();
				break;
			case 26:
			case 27:
			case 5:
				le(t);
				break;
			case 4:
				ce();
				break;
			case 31:
				t.memoizedState !== null && to(t);
				break;
			case 13:
				to(t);
				break;
			case 19:
				R(no);
				break;
			case 10:
				Hi(t.type);
				break;
			case 22:
			case 23:
				to(t), Ja(), e !== null && R(da);
				break;
			case 24: Hi(ea);
		}
	}
	function Ic(e, t) {
		try {
			var n = t.updateQueue, r = n === null ? null : n.lastEffect;
			if (r !== null) {
				var i = r.next;
				n = i;
				do {
					if ((n.tag & e) === e) {
						r = void 0;
						var a = n.create, o = n.inst;
						r = a(), o.destroy = r;
					}
					n = n.next;
				} while (n !== i);
			}
		} catch (e) {
			Wu(t, t.return, e);
		}
	}
	function Lc(e, t, n) {
		try {
			var r = t.updateQueue, i = r === null ? null : r.lastEffect;
			if (i !== null) {
				var a = i.next;
				r = a;
				do {
					if ((r.tag & e) === e) {
						var o = r.inst, s = o.destroy;
						if (s !== void 0) {
							o.destroy = void 0, i = t;
							var c = n, l = s;
							try {
								l();
							} catch (e) {
								Wu(i, c, e);
							}
						}
					}
					r = r.next;
				} while (r !== a);
			}
		} catch (e) {
			Wu(t, t.return, e);
		}
	}
	function Rc(e) {
		var t = e.updateQueue;
		if (t !== null) {
			var n = e.stateNode;
			try {
				Ua(t, n);
			} catch (t) {
				Wu(e, e.return, t);
			}
		}
	}
	function zc(e, t, n) {
		n.props = Bs(e.type, e.memoizedProps), n.state = e.memoizedState;
		try {
			n.componentWillUnmount();
		} catch (n) {
			Wu(e, t, n);
		}
	}
	function Bc(e, t) {
		try {
			var n = e.ref;
			if (n !== null) {
				switch (e.tag) {
					case 26:
					case 27:
					case 5:
						var r = e.stateNode;
						break;
					case 30:
						r = e.stateNode;
						break;
					default: r = e.stateNode;
				}
				typeof n == "function" ? e.refCleanup = n(r) : n.current = r;
			}
		} catch (n) {
			Wu(e, t, n);
		}
	}
	function Vc(e, t) {
		var n = e.ref, r = e.refCleanup;
		if (n !== null) {
			if (typeof r == "function") try {
				r();
			} catch (n) {
				Wu(e, t, n);
			} finally {
				e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
			}
			else if (typeof n == "function") try {
				n(null);
			} catch (n) {
				Wu(e, t, n);
			}
			else n.current = null;
		}
	}
	function Hc(e) {
		var t = e.type, n = e.memoizedProps, r = e.stateNode;
		try {
			a: switch (t) {
				case "button":
				case "input":
				case "select":
				case "textarea":
					n.autoFocus && r.focus();
					break a;
				case "img": n.src ? r.src = n.src : n.srcSet && (r.srcset = n.srcSet);
			}
		} catch (t) {
			Wu(e, e.return, t);
		}
	}
	function Uc(e, t, n) {
		try {
			var r = e.stateNode;
			Id(r, e.type, n, t), r[it] = t;
		} catch (t) {
			Wu(e, e.return, t);
		}
	}
	function Wc(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Qd(e.type) || e.tag === 4;
	}
	function Gc(e) {
		a: for (;;) {
			for (; e.sibling === null;) {
				if (e.return === null || Wc(e.return)) return null;
				e = e.return;
			}
			for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;) {
				if (e.tag === 27 && Qd(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue a;
				e.child.return = e, e = e.child;
			}
			if (!(e.flags & 2)) return e.stateNode;
		}
	}
	function Kc(e, t, n) {
		var r = e.tag;
		if (r === 5 || r === 6) e = e.stateNode, t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(e, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(e), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = Jt));
		else if (r !== 4 && (r === 27 && Qd(e.type) && (n = e.stateNode, t = null), e = e.child, e !== null)) for (Kc(e, t, n), e = e.sibling; e !== null;) Kc(e, t, n), e = e.sibling;
	}
	function qc(e, t, n) {
		var r = e.tag;
		if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
		else if (r !== 4 && (r === 27 && Qd(e.type) && (n = e.stateNode), e = e.child, e !== null)) for (qc(e, t, n), e = e.sibling; e !== null;) qc(e, t, n), e = e.sibling;
	}
	function Jc(e) {
		var t = e.stateNode, n = e.memoizedProps;
		try {
			for (var r = e.type, i = t.attributes; i.length;) t.removeAttributeNode(i[0]);
			Fd(t, r, n), t[rt] = e, t[it] = n;
		} catch (t) {
			Wu(e, e.return, t);
		}
	}
	var Yc = !1, Xc = !1, Zc = !1, Qc = typeof WeakSet == "function" ? WeakSet : Set, $c = null;
	function el(e, t) {
		if (e = e.containerInfo, zd = cp, e = br(e), xr(e)) {
			if ("selectionStart" in e) var n = {
				start: e.selectionStart,
				end: e.selectionEnd
			};
			else a: {
				n = (n = e.ownerDocument) && n.defaultView || window;
				var r = n.getSelection && n.getSelection();
				if (r && r.rangeCount !== 0) {
					n = r.anchorNode;
					var a = r.anchorOffset, o = r.focusNode;
					r = r.focusOffset;
					try {
						n.nodeType, o.nodeType;
					} catch {
						n = null;
						break a;
					}
					var s = 0, c = -1, l = -1, u = 0, d = 0, f = e, p = null;
					b: for (;;) {
						for (var m; f !== n || a !== 0 && f.nodeType !== 3 || (c = s + a), f !== o || r !== 0 && f.nodeType !== 3 || (l = s + r), f.nodeType === 3 && (s += f.nodeValue.length), (m = f.firstChild) !== null;) p = f, f = m;
						for (;;) {
							if (f === e) break b;
							if (p === n && ++u === a && (c = s), p === o && ++d === r && (l = s), (m = f.nextSibling) !== null) break;
							f = p, p = f.parentNode;
						}
						f = m;
					}
					n = c === -1 || l === -1 ? null : {
						start: c,
						end: l
					};
				} else n = null;
			}
			n ||= {
				start: 0,
				end: 0
			};
		} else n = null;
		for (Bd = {
			focusedElem: e,
			selectionRange: n
		}, cp = !1, $c = t; $c !== null;) if (t = $c, e = t.child, t.subtreeFlags & 1028 && e !== null) e.return = t, $c = e;
		else for (; $c !== null;) {
			switch (t = $c, o = t.alternate, e = t.flags, t.tag) {
				case 0:
					if (e & 4 && (e = t.updateQueue, e = e === null ? null : e.events, e !== null)) for (n = 0; n < e.length; n++) a = e[n], a.ref.impl = a.nextImpl;
					break;
				case 11:
				case 15: break;
				case 1:
					if (e & 1024 && o !== null) {
						e = void 0, n = t, a = o.memoizedProps, o = o.memoizedState, r = n.stateNode;
						try {
							var h = Bs(n.type, a);
							e = r.getSnapshotBeforeUpdate(h, o), r.__reactInternalSnapshotBeforeUpdate = e;
						} catch (e) {
							Wu(n, n.return, e);
						}
					}
					break;
				case 3:
					if (e & 1024) {
						if (e = t.stateNode.containerInfo, n = e.nodeType, n === 9) tf(e);
						else if (n === 1) switch (e.nodeName) {
							case "HEAD":
							case "HTML":
							case "BODY":
								tf(e);
								break;
							default: e.textContent = "";
						}
					}
					break;
				case 5:
				case 26:
				case 27:
				case 6:
				case 4:
				case 17: break;
				default: if (e & 1024) throw Error(i(163));
			}
			if (e = t.sibling, e !== null) {
				e.return = t.return, $c = e;
				break;
			}
			$c = t.return;
		}
	}
	function tl(e, t, n) {
		var r = n.flags;
		switch (n.tag) {
			case 0:
			case 11:
			case 15:
				gl(e, n), r & 4 && Ic(5, n);
				break;
			case 1:
				if (gl(e, n), r & 4) {
					if (e = n.stateNode, t === null) try {
						e.componentDidMount();
					} catch (e) {
						Wu(n, n.return, e);
					}
					else {
						var i = Bs(n.type, t.memoizedProps);
						t = t.memoizedState;
						try {
							e.componentDidUpdate(i, t, e.__reactInternalSnapshotBeforeUpdate);
						} catch (e) {
							Wu(n, n.return, e);
						}
					}
				}
				r & 64 && Rc(n), r & 512 && Bc(n, n.return);
				break;
			case 3:
				if (gl(e, n), r & 64 && (e = n.updateQueue, e !== null)) {
					if (t = null, n.child !== null) switch (n.child.tag) {
						case 27:
						case 5:
							t = n.child.stateNode;
							break;
						case 1: t = n.child.stateNode;
					}
					try {
						Ua(e, t);
					} catch (e) {
						Wu(n, n.return, e);
					}
				}
				break;
			case 27: t === null && r & 4 && Jc(n);
			case 26:
			case 5:
				gl(e, n), t === null && r & 4 && Hc(n), r & 512 && Bc(n, n.return);
				break;
			case 12:
				gl(e, n);
				break;
			case 31:
				gl(e, n), r & 4 && sl(e, n);
				break;
			case 13:
				gl(e, n), r & 4 && cl(e, n), r & 64 && (e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null && (n = Ju.bind(null, n), cf(e, n))));
				break;
			case 22:
				if (r = n.memoizedState !== null || Yc, !r) {
					t = t !== null && t.memoizedState !== null || Xc, i = Yc;
					var a = Xc;
					Yc = r, (Xc = t) && !a ? vl(e, n, !!(n.subtreeFlags & 8772)) : gl(e, n), Yc = i, Xc = a;
				}
				break;
			case 30: break;
			default: gl(e, n);
		}
	}
	function nl(e) {
		var t = e.alternate;
		t !== null && (e.alternate = null, nl(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && dt(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
	}
	var rl = null, il = !1;
	function al(e, t, n) {
		for (n = n.child; n !== null;) ol(e, t, n), n = n.sibling;
	}
	function ol(e, t, n) {
		if (Me && typeof Me.onCommitFiberUnmount == "function") try {
			Me.onCommitFiberUnmount(je, n);
		} catch {}
		switch (n.tag) {
			case 26:
				Xc || Vc(n, t), al(e, t, n), n.memoizedState ? n.memoizedState.count-- : n.stateNode && (n = n.stateNode, n.parentNode.removeChild(n));
				break;
			case 27:
				Xc || Vc(n, t);
				var r = rl, i = il;
				Qd(n.type) && (rl = n.stateNode, il = !1), al(e, t, n), mf(n.stateNode), rl = r, il = i;
				break;
			case 5: Xc || Vc(n, t);
			case 6:
				if (r = rl, i = il, rl = null, al(e, t, n), rl = r, il = i, rl !== null) {
					if (il) try {
						(rl.nodeType === 9 ? rl.body : rl.nodeName === "HTML" ? rl.ownerDocument.body : rl).removeChild(n.stateNode);
					} catch (e) {
						Wu(n, t, e);
					}
					else try {
						rl.removeChild(n.stateNode);
					} catch (e) {
						Wu(n, t, e);
					}
				}
				break;
			case 18:
				rl !== null && (il ? (e = rl, $d(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, n.stateNode), Pp(e)) : $d(rl, n.stateNode));
				break;
			case 4:
				r = rl, i = il, rl = n.stateNode.containerInfo, il = !0, al(e, t, n), rl = r, il = i;
				break;
			case 0:
			case 11:
			case 14:
			case 15:
				Lc(2, n, t), Xc || Lc(4, n, t), al(e, t, n);
				break;
			case 1:
				Xc || (Vc(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function" && zc(n, t, r)), al(e, t, n);
				break;
			case 21:
				al(e, t, n);
				break;
			case 22:
				Xc = (r = Xc) || n.memoizedState !== null, al(e, t, n), Xc = r;
				break;
			default: al(e, t, n);
		}
	}
	function sl(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
			e = e.dehydrated;
			try {
				Pp(e);
			} catch (e) {
				Wu(t, t.return, e);
			}
		}
	}
	function cl(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null)))) try {
			Pp(e);
		} catch (e) {
			Wu(t, t.return, e);
		}
	}
	function ll(e) {
		switch (e.tag) {
			case 31:
			case 13:
			case 19:
				var t = e.stateNode;
				return t === null && (t = e.stateNode = new Qc()), t;
			case 22: return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new Qc()), t;
			default: throw Error(i(435, e.tag));
		}
	}
	function ul(e, t) {
		var n = ll(e);
		t.forEach(function(t) {
			if (!n.has(t)) {
				n.add(t);
				var r = Yu.bind(null, e, t);
				t.then(r, r);
			}
		});
	}
	function dl(e, t) {
		var n = t.deletions;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var a = n[r], o = e, s = t, c = s;
			a: for (; c !== null;) {
				switch (c.tag) {
					case 27:
						if (Qd(c.type)) {
							rl = c.stateNode, il = !1;
							break a;
						}
						break;
					case 5:
						rl = c.stateNode, il = !1;
						break a;
					case 3:
					case 4:
						rl = c.stateNode.containerInfo, il = !0;
						break a;
				}
				c = c.return;
			}
			if (rl === null) throw Error(i(160));
			ol(o, s, a), rl = null, il = !1, o = a.alternate, o !== null && (o.return = null), a.return = null;
		}
		if (t.subtreeFlags & 13886) for (t = t.child; t !== null;) pl(t, e), t = t.sibling;
	}
	var fl = null;
	function pl(e, t) {
		var n = e.alternate, r = e.flags;
		switch (e.tag) {
			case 0:
			case 11:
			case 14:
			case 15:
				dl(t, e), ml(e), r & 4 && (Lc(3, e, e.return), Ic(3, e), Lc(5, e, e.return));
				break;
			case 1:
				dl(t, e), ml(e), r & 512 && (Xc || n === null || Vc(n, n.return)), r & 64 && Yc && (e = e.updateQueue, e !== null && (r = e.callbacks, r !== null && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = n === null ? r : n.concat(r))));
				break;
			case 26:
				var a = fl;
				if (dl(t, e), ml(e), r & 512 && (Xc || n === null || Vc(n, n.return)), r & 4) {
					var o = n === null ? null : n.memoizedState;
					if (r = e.memoizedState, n === null) {
						if (r === null) {
							if (e.stateNode === null) {
								a: {
									r = e.type, n = e.memoizedProps, a = a.ownerDocument || a;
									b: switch (r) {
										case "title":
											o = a.getElementsByTagName("title")[0], (!o || o[ut] || o[rt] || o.namespaceURI === "http://www.w3.org/2000/svg" || o.hasAttribute("itemprop")) && (o = a.createElement(r), a.head.insertBefore(o, a.querySelector("head > title"))), Fd(o, r, n), o[rt] = e, gt(o), r = o;
											break a;
										case "link":
											var s = Hf("link", "href", a).get(r + (n.href || ""));
											if (s) {
												for (var c = 0; c < s.length; c++) if (o = s[c], o.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && o.getAttribute("rel") === (n.rel == null ? null : n.rel) && o.getAttribute("title") === (n.title == null ? null : n.title) && o.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
													s.splice(c, 1);
													break b;
												}
											}
											o = a.createElement(r), Fd(o, r, n), a.head.appendChild(o);
											break;
										case "meta":
											if (s = Hf("meta", "content", a).get(r + (n.content || ""))) {
												for (c = 0; c < s.length; c++) if (o = s[c], o.getAttribute("content") === (n.content == null ? null : "" + n.content) && o.getAttribute("name") === (n.name == null ? null : n.name) && o.getAttribute("property") === (n.property == null ? null : n.property) && o.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && o.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
													s.splice(c, 1);
													break b;
												}
											}
											o = a.createElement(r), Fd(o, r, n), a.head.appendChild(o);
											break;
										default: throw Error(i(468, r));
									}
									o[rt] = e, gt(o), r = o;
								}
								e.stateNode = r;
							} else Uf(a, e.type, e.stateNode);
						} else e.stateNode = Lf(a, r, e.memoizedProps);
					} else o === r ? r === null && e.stateNode !== null && Uc(e, e.memoizedProps, n.memoizedProps) : (o === null ? n.stateNode !== null && (n = n.stateNode, n.parentNode.removeChild(n)) : o.count--, r === null ? Uf(a, e.type, e.stateNode) : Lf(a, r, e.memoizedProps));
				}
				break;
			case 27:
				dl(t, e), ml(e), r & 512 && (Xc || n === null || Vc(n, n.return)), n !== null && r & 4 && Uc(e, e.memoizedProps, n.memoizedProps);
				break;
			case 5:
				if (dl(t, e), ml(e), r & 512 && (Xc || n === null || Vc(n, n.return)), e.flags & 32) {
					a = e.stateNode;
					try {
						Vt(a, "");
					} catch (t) {
						Wu(e, e.return, t);
					}
				}
				r & 4 && e.stateNode != null && (a = e.memoizedProps, Uc(e, a, n === null ? a : n.memoizedProps)), r & 1024 && (Zc = !0);
				break;
			case 6:
				if (dl(t, e), ml(e), r & 4) {
					if (e.stateNode === null) throw Error(i(162));
					r = e.memoizedProps, n = e.stateNode;
					try {
						n.nodeValue = r;
					} catch (t) {
						Wu(e, e.return, t);
					}
				}
				break;
			case 3:
				if (Vf = null, a = fl, fl = _f(t.containerInfo), dl(t, e), fl = a, ml(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
					Pp(t.containerInfo);
				} catch (t) {
					Wu(e, e.return, t);
				}
				Zc && (Zc = !1, hl(e));
				break;
			case 4:
				r = fl, fl = _f(e.stateNode.containerInfo), dl(t, e), ml(e), fl = r;
				break;
			case 12:
				dl(t, e), ml(e);
				break;
			case 31:
				dl(t, e), ml(e), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, ul(e, r)));
				break;
			case 13:
				dl(t, e), ml(e), e.child.flags & 8192 && e.memoizedState !== null != (n !== null && n.memoizedState !== null) && (Ql = Se()), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, ul(e, r)));
				break;
			case 22:
				a = e.memoizedState !== null;
				var l = n !== null && n.memoizedState !== null, u = Yc, d = Xc;
				if (Yc = u || a, Xc = d || l, dl(t, e), Xc = d, Yc = u, ml(e), r & 8192) a: for (t = e.stateNode, t._visibility = a ? t._visibility & -2 : t._visibility | 1, a && (n === null || l || Yc || Xc || _l(e)), n = null, t = e;;) {
					if (t.tag === 5 || t.tag === 26) {
						if (n === null) {
							l = n = t;
							try {
								if (o = l.stateNode, a) s = o.style, typeof s.setProperty == "function" ? s.setProperty("display", "none", "important") : s.display = "none";
								else {
									c = l.stateNode;
									var f = l.memoizedProps.style, p = f != null && f.hasOwnProperty("display") ? f.display : null;
									c.style.display = p == null || typeof p == "boolean" ? "" : ("" + p).trim();
								}
							} catch (e) {
								Wu(l, l.return, e);
							}
						}
					} else if (t.tag === 6) {
						if (n === null) {
							l = t;
							try {
								l.stateNode.nodeValue = a ? "" : l.memoizedProps;
							} catch (e) {
								Wu(l, l.return, e);
							}
						}
					} else if (t.tag === 18) {
						if (n === null) {
							l = t;
							try {
								var m = l.stateNode;
								a ? ef(m, !0) : ef(l.stateNode, !1);
							} catch (e) {
								Wu(l, l.return, e);
							}
						}
					} else if ((t.tag !== 22 && t.tag !== 23 || t.memoizedState === null || t === e) && t.child !== null) {
						t.child.return = t, t = t.child;
						continue;
					}
					if (t === e) break a;
					for (; t.sibling === null;) {
						if (t.return === null || t.return === e) break a;
						n === t && (n = null), t = t.return;
					}
					n === t && (n = null), t.sibling.return = t.return, t = t.sibling;
				}
				r & 4 && (r = e.updateQueue, r !== null && (n = r.retryQueue, n !== null && (r.retryQueue = null, ul(e, n))));
				break;
			case 19:
				dl(t, e), ml(e), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, ul(e, r)));
				break;
			case 30: break;
			case 21: break;
			default: dl(t, e), ml(e);
		}
	}
	function ml(e) {
		var t = e.flags;
		if (t & 2) {
			try {
				for (var n, r = e.return; r !== null;) {
					if (Wc(r)) {
						n = r;
						break;
					}
					r = r.return;
				}
				if (n == null) throw Error(i(160));
				switch (n.tag) {
					case 27:
						var a = n.stateNode;
						qc(e, Gc(e), a);
						break;
					case 5:
						var o = n.stateNode;
						n.flags & 32 && (Vt(o, ""), n.flags &= -33), qc(e, Gc(e), o);
						break;
					case 3:
					case 4:
						var s = n.stateNode.containerInfo;
						Kc(e, Gc(e), s);
						break;
					default: throw Error(i(161));
				}
			} catch (t) {
				Wu(e, e.return, t);
			}
			e.flags &= -3;
		}
		t & 4096 && (e.flags &= -4097);
	}
	function hl(e) {
		if (e.subtreeFlags & 1024) for (e = e.child; e !== null;) {
			var t = e;
			hl(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
		}
	}
	function gl(e, t) {
		if (t.subtreeFlags & 8772) for (t = t.child; t !== null;) tl(e, t.alternate, t), t = t.sibling;
	}
	function _l(e) {
		for (e = e.child; e !== null;) {
			var t = e;
			switch (t.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					Lc(4, t, t.return), _l(t);
					break;
				case 1:
					Vc(t, t.return);
					var n = t.stateNode;
					typeof n.componentWillUnmount == "function" && zc(t, t.return, n), _l(t);
					break;
				case 27: mf(t.stateNode);
				case 26:
				case 5:
					Vc(t, t.return), _l(t);
					break;
				case 22:
					t.memoizedState === null && _l(t);
					break;
				case 30:
					_l(t);
					break;
				default: _l(t);
			}
			e = e.sibling;
		}
	}
	function vl(e, t, n) {
		for (n &&= !!(t.subtreeFlags & 8772), t = t.child; t !== null;) {
			var r = t.alternate, i = e, a = t, o = a.flags;
			switch (a.tag) {
				case 0:
				case 11:
				case 15:
					vl(i, a, n), Ic(4, a);
					break;
				case 1:
					if (vl(i, a, n), r = a, i = r.stateNode, typeof i.componentDidMount == "function") try {
						i.componentDidMount();
					} catch (e) {
						Wu(r, r.return, e);
					}
					if (r = a, i = r.updateQueue, i !== null) {
						var s = r.stateNode;
						try {
							var c = i.shared.hiddenCallbacks;
							if (c !== null) for (i.shared.hiddenCallbacks = null, i = 0; i < c.length; i++) Ha(c[i], s);
						} catch (e) {
							Wu(r, r.return, e);
						}
					}
					n && o & 64 && Rc(a), Bc(a, a.return);
					break;
				case 27: Jc(a);
				case 26:
				case 5:
					vl(i, a, n), n && r === null && o & 4 && Hc(a), Bc(a, a.return);
					break;
				case 12:
					vl(i, a, n);
					break;
				case 31:
					vl(i, a, n), n && o & 4 && sl(i, a);
					break;
				case 13:
					vl(i, a, n), n && o & 4 && cl(i, a);
					break;
				case 22:
					a.memoizedState === null && vl(i, a, n), Bc(a, a.return);
					break;
				case 30: break;
				default: vl(i, a, n);
			}
			t = t.sibling;
		}
	}
	function yl(e, t) {
		var n = null;
		e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && na(n));
	}
	function bl(e, t) {
		e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && na(e));
	}
	function xl(e, t, n, r) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) Sl(e, t, n, r), t = t.sibling;
	}
	function Sl(e, t, n, r) {
		var i = t.flags;
		switch (t.tag) {
			case 0:
			case 11:
			case 15:
				xl(e, t, n, r), i & 2048 && Ic(9, t);
				break;
			case 1:
				xl(e, t, n, r);
				break;
			case 3:
				xl(e, t, n, r), i & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && na(e)));
				break;
			case 12:
				if (i & 2048) {
					xl(e, t, n, r), e = t.stateNode;
					try {
						var a = t.memoizedProps, o = a.id, s = a.onPostCommit;
						typeof s == "function" && s(o, t.alternate === null ? "mount" : "update", e.passiveEffectDuration, -0);
					} catch (e) {
						Wu(t, t.return, e);
					}
				} else xl(e, t, n, r);
				break;
			case 31:
				xl(e, t, n, r);
				break;
			case 13:
				xl(e, t, n, r);
				break;
			case 23: break;
			case 22:
				a = t.stateNode, o = t.alternate, t.memoizedState === null ? a._visibility & 2 ? xl(e, t, n, r) : (a._visibility |= 2, Cl(e, t, n, r, !!(t.subtreeFlags & 10256) || !1)) : a._visibility & 2 ? xl(e, t, n, r) : wl(e, t), i & 2048 && yl(o, t);
				break;
			case 24:
				xl(e, t, n, r), i & 2048 && bl(t.alternate, t);
				break;
			default: xl(e, t, n, r);
		}
	}
	function Cl(e, t, n, r, i) {
		for (i &&= !!(t.subtreeFlags & 10256) || !1, t = t.child; t !== null;) {
			var a = e, o = t, s = n, c = r, l = o.flags;
			switch (o.tag) {
				case 0:
				case 11:
				case 15:
					Cl(a, o, s, c, i), Ic(8, o);
					break;
				case 23: break;
				case 22:
					var u = o.stateNode;
					o.memoizedState === null ? (u._visibility |= 2, Cl(a, o, s, c, i)) : u._visibility & 2 ? Cl(a, o, s, c, i) : wl(a, o), i && l & 2048 && yl(o.alternate, o);
					break;
				case 24:
					Cl(a, o, s, c, i), i && l & 2048 && bl(o.alternate, o);
					break;
				default: Cl(a, o, s, c, i);
			}
			t = t.sibling;
		}
	}
	function wl(e, t) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) {
			var n = e, r = t, i = r.flags;
			switch (r.tag) {
				case 22:
					wl(n, r), i & 2048 && yl(r.alternate, r);
					break;
				case 24:
					wl(n, r), i & 2048 && bl(r.alternate, r);
					break;
				default: wl(n, r);
			}
			t = t.sibling;
		}
	}
	var Tl = 8192;
	function El(e, t, n) {
		if (e.subtreeFlags & Tl) for (e = e.child; e !== null;) Dl(e, t, n), e = e.sibling;
	}
	function Dl(e, t, n) {
		switch (e.tag) {
			case 26:
				El(e, t, n), e.flags & Tl && e.memoizedState !== null && Kf(n, fl, e.memoizedState, e.memoizedProps);
				break;
			case 5:
				El(e, t, n);
				break;
			case 3:
			case 4:
				var r = fl;
				fl = _f(e.stateNode.containerInfo), El(e, t, n), fl = r;
				break;
			case 22:
				e.memoizedState === null && (r = e.alternate, r !== null && r.memoizedState !== null ? (r = Tl, Tl = 16777216, El(e, t, n), Tl = r) : El(e, t, n));
				break;
			default: El(e, t, n);
		}
	}
	function Ol(e) {
		var t = e.alternate;
		if (t !== null && (e = t.child, e !== null)) {
			t.child = null;
			do
				t = e.sibling, e.sibling = null, e = t;
			while (e !== null);
		}
	}
	function kl(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				$c = r, Ml(r, e);
			}
			Ol(e);
		}
		if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) Al(e), e = e.sibling;
	}
	function Al(e) {
		switch (e.tag) {
			case 0:
			case 11:
			case 15:
				kl(e), e.flags & 2048 && Lc(9, e, e.return);
				break;
			case 3:
				kl(e);
				break;
			case 12:
				kl(e);
				break;
			case 22:
				var t = e.stateNode;
				e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, jl(e)) : kl(e);
				break;
			default: kl(e);
		}
	}
	function jl(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				$c = r, Ml(r, e);
			}
			Ol(e);
		}
		for (e = e.child; e !== null;) {
			switch (t = e, t.tag) {
				case 0:
				case 11:
				case 15:
					Lc(8, t, t.return), jl(t);
					break;
				case 22:
					n = t.stateNode, n._visibility & 2 && (n._visibility &= -3, jl(t));
					break;
				default: jl(t);
			}
			e = e.sibling;
		}
	}
	function Ml(e, t) {
		for (; $c !== null;) {
			var n = $c;
			switch (n.tag) {
				case 0:
				case 11:
				case 15:
					Lc(8, n, t);
					break;
				case 23:
				case 22:
					if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
						var r = n.memoizedState.cachePool.pool;
						r != null && r.refCount++;
					}
					break;
				case 24: na(n.memoizedState.cache);
			}
			if (r = n.child, r !== null) r.return = n, $c = r;
			else a: for (n = e; $c !== null;) {
				r = $c;
				var i = r.sibling, a = r.return;
				if (nl(r), r === n) {
					$c = null;
					break a;
				}
				if (i !== null) {
					i.return = a, $c = i;
					break a;
				}
				$c = a;
			}
		}
	}
	var Nl = {
		getCacheForType: function(e) {
			var t = Ji(ea), n = t.data.get(e);
			return n === void 0 && (n = e(), t.data.set(e, n)), n;
		},
		cacheSignal: function() {
			return Ji(ea).controller.signal;
		}
	}, Pl = typeof WeakMap == "function" ? WeakMap : Map, Fl = 0, Il = null, X = null, Z = 0, Ll = 0, Rl = null, zl = !1, Bl = !1, Vl = !1, Hl = 0, Ul = 0, Wl = 0, Gl = 0, Kl = 0, ql = 0, Jl = 0, Yl = null, Xl = null, Zl = !1, Ql = 0, $l = 0, eu = Infinity, tu = null, nu = null, ru = 0, iu = null, au = null, ou = 0, su = 0, cu = null, lu = null, uu = 0, du = null;
	function fu() {
		return Fl & 2 && Z !== 0 ? Z & -Z : F.T === null ? et() : dd();
	}
	function pu() {
		if (ql === 0) {
			if (!(Z & 536870912) || K) {
				var e = ze;
				ze <<= 1, !(ze & 3932160) && (ze = 262144), ql = e;
			} else ql = 536870912;
		}
		return e = Ya.current, e !== null && (e.flags |= 32), ql;
	}
	function mu(e, t, n) {
		(e === Il && (Ll === 2 || Ll === 9) || e.cancelPendingCommit !== null) && (xu(e, 0), vu(e, Z, ql, !1)), qe(e, n), (!(Fl & 2) || e !== Il) && (e === Il && (!(Fl & 2) && (Gl |= n), Ul === 4 && vu(e, Z, ql, !1)), rd(e));
	}
	function hu(e, t, n) {
		if (Fl & 6) throw Error(i(327));
		var r = !n && !(t & 127) && (t & e.expiredLanes) === 0 || Ue(e, t), a = r ? ku(e, t) : Du(e, t, !0), o = r;
		do {
			if (a === 0) {
				Bl && !r && vu(e, t, 0, !1);
				break;
			}
			if (n = e.current.alternate, o && !_u(n)) {
				a = Du(e, t, !1), o = !1;
				continue;
			}
			if (a === 2) {
				if (o = t, e.errorRecoveryDisabledLanes & o) var s = 0;
				else s = e.pendingLanes & -536870913, s = s === 0 ? s & 536870912 ? 536870912 : 0 : s;
				if (s !== 0) {
					t = s;
					a: {
						var c = e;
						a = Yl;
						var l = c.current.memoizedState.isDehydrated;
						if (l && (xu(c, s).flags |= 256), s = Du(c, s, !1), s !== 2) {
							if (Vl && !l) {
								c.errorRecoveryDisabledLanes |= o, Gl |= o, a = 4;
								break a;
							}
							o = Xl, Xl = a, o !== null && (Xl === null ? Xl = o : Xl.push.apply(Xl, o));
						}
						a = s;
					}
					if (o = !1, a !== 2) continue;
				}
			}
			if (a === 1) {
				xu(e, 0), vu(e, t, 0, !0);
				break;
			}
			a: {
				switch (r = e, o = a, o) {
					case 0:
					case 1: throw Error(i(345));
					case 4: if ((t & 4194048) !== t) break;
					case 6:
						vu(r, t, ql, !zl);
						break a;
					case 2:
						Xl = null;
						break;
					case 3:
					case 5: break;
					default: throw Error(i(329));
				}
				if ((t & 62914560) === t && (a = Ql + 300 - Se(), 10 < a)) {
					if (vu(r, t, ql, !zl), He(r, 0, !0) !== 0) break a;
					ou = t, r.timeoutHandle = qd(gu.bind(null, r, n, Xl, tu, Zl, t, ql, Gl, Jl, zl, o, "Throttled", -0, 0), a);
					break a;
				}
				gu(r, n, Xl, tu, Zl, t, ql, Gl, Jl, zl, o, null, -0, 0);
			}
			break;
		} while (1);
		rd(e);
	}
	function gu(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
		if (e.timeoutHandle = -1, d = t.subtreeFlags, d & 8192 || (d & 16785408) == 16785408) {
			d = {
				stylesheets: null,
				count: 0,
				imgCount: 0,
				imgBytes: 0,
				suspenseyImages: [],
				waitingForImages: !0,
				waitingForViewTransition: !1,
				unsuspend: Jt
			}, Dl(t, a, d);
			var m = (a & 62914560) === a ? Ql - Se() : (a & 4194048) === a ? $l - Se() : 0;
			if (m = Jf(d, m), m !== null) {
				ou = a, e.cancelPendingCommit = m(Iu.bind(null, e, t, a, n, r, i, o, s, c, u, d, null, f, p)), vu(e, a, o, !l);
				return;
			}
		}
		Iu(e, t, a, n, r, i, o, s, c);
	}
	function _u(e) {
		for (var t = e;;) {
			var n = t.tag;
			if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null))) for (var r = 0; r < n.length; r++) {
				var i = n[r], a = i.getSnapshot;
				i = i.value;
				try {
					if (!hr(a(), i)) return !1;
				} catch {
					return !1;
				}
			}
			if (n = t.child, t.subtreeFlags & 16384 && n !== null) n.return = t, t = n;
			else {
				if (t === e) break;
				for (; t.sibling === null;) {
					if (t.return === null || t.return === e) return !0;
					t = t.return;
				}
				t.sibling.return = t.return, t = t.sibling;
			}
		}
		return !0;
	}
	function vu(e, t, n, r) {
		t &= ~Kl, t &= ~Gl, e.suspendedLanes |= t, e.pingedLanes &= ~t, r && (e.warmLanes |= t), r = e.expirationTimes;
		for (var i = t; 0 < i;) {
			var a = 31 - Pe(i), o = 1 << a;
			r[a] = -1, i &= ~o;
		}
		n !== 0 && Ye(e, n, t);
	}
	function yu() {
		return Fl & 6 ? !0 : (id(0, !1), !1);
	}
	function bu() {
		if (X !== null) {
			if (Ll === 0) var e = X.return;
			else e = X, Bi = zi = null, So(e), Ta = null, Ea = 0, e = X;
			for (; e !== null;) Fc(e.alternate, e), e = e.return;
			X = null;
		}
	}
	function xu(e, t) {
		var n = e.timeoutHandle;
		n !== -1 && (e.timeoutHandle = -1, Jd(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), ou = 0, bu(), Il = e, X = n = ri(e.current, null), Z = t, Ll = 0, Rl = null, zl = !1, Bl = Ue(e, t), Vl = !1, Jl = ql = Kl = Gl = Wl = Ul = 0, Xl = Yl = null, Zl = !1, t & 8 && (t |= t & 32);
		var r = e.entangledLanes;
		if (r !== 0) for (e = e.entanglements, r &= t; 0 < r;) {
			var i = 31 - Pe(r), a = 1 << i;
			t |= e[i], r &= ~a;
		}
		return Hl = t, qr(), n;
	}
	function Su(e, t) {
		J = null, F.H = Ms, t === ha || t === _a ? (t = Ca(), Ll = 3) : t === ga ? (t = Ca(), Ll = 4) : Ll = t === Xs ? 8 : typeof t == "object" && t && typeof t.then == "function" ? 6 : 1, Rl = t, X === null && (Ul = 1, Ws(e, di(t, e.current)));
	}
	function Cu() {
		var e = Ya.current;
		return e === null ? !0 : (Z & 4194048) === Z ? Xa === null : (Z & 62914560) === Z || Z & 536870912 ? e === Xa : !1;
	}
	function wu() {
		var e = F.H;
		return F.H = Ms, e === null ? Ms : e;
	}
	function Tu() {
		var e = F.A;
		return F.A = Nl, e;
	}
	function Eu() {
		Ul = 4, zl || (Z & 4194048) !== Z && Ya.current !== null || (Bl = !0), !(Wl & 134217727) && !(Gl & 134217727) || Il === null || vu(Il, Z, ql, !1);
	}
	function Du(e, t, n) {
		var r = Fl;
		Fl |= 2;
		var i = wu(), a = Tu();
		(Il !== e || Z !== t) && (tu = null, xu(e, t)), t = !1;
		var o = Ul;
		a: do
			try {
				if (Ll !== 0 && X !== null) {
					var s = X, c = Rl;
					switch (Ll) {
						case 8:
							bu(), o = 6;
							break a;
						case 3:
						case 2:
						case 9:
						case 6:
							Ya.current === null && (t = !0);
							var l = Ll;
							if (Ll = 0, Rl = null, Nu(e, s, c, l), n && Bl) {
								o = 0;
								break a;
							}
							break;
						default: l = Ll, Ll = 0, Rl = null, Nu(e, s, c, l);
					}
				}
				Ou(), o = Ul;
				break;
			} catch (t) {
				Su(e, t);
			}
		while (1);
		return t && e.shellSuspendCounter++, Bi = zi = null, Fl = r, F.H = i, F.A = a, X === null && (Il = null, Z = 0, qr()), o;
	}
	function Ou() {
		for (; X !== null;) ju(X);
	}
	function ku(e, t) {
		var n = Fl;
		Fl |= 2;
		var r = wu(), a = Tu();
		Il !== e || Z !== t ? (tu = null, eu = Se() + 500, xu(e, t)) : Bl = Ue(e, t);
		a: do
			try {
				if (Ll !== 0 && X !== null) {
					t = X;
					var o = Rl;
					b: switch (Ll) {
						case 1:
							Ll = 0, Rl = null, Nu(e, t, o, 1);
							break;
						case 2:
						case 9:
							if (ya(o)) {
								Ll = 0, Rl = null, Mu(t);
								break;
							}
							t = function() {
								Ll !== 2 && Ll !== 9 || Il !== e || (Ll = 7), rd(e);
							}, o.then(t, t);
							break a;
						case 3:
							Ll = 7;
							break a;
						case 4:
							Ll = 5;
							break a;
						case 7:
							ya(o) ? (Ll = 0, Rl = null, Mu(t)) : (Ll = 0, Rl = null, Nu(e, t, o, 7));
							break;
						case 5:
							var s = null;
							switch (X.tag) {
								case 26: s = X.memoizedState;
								case 5:
								case 27:
									var c = X;
									if (s ? Gf(s) : c.stateNode.complete) {
										Ll = 0, Rl = null;
										var l = c.sibling;
										if (l !== null) X = l;
										else {
											var u = c.return;
											u === null ? X = null : (X = u, Pu(u));
										}
										break b;
									}
							}
							Ll = 0, Rl = null, Nu(e, t, o, 5);
							break;
						case 6:
							Ll = 0, Rl = null, Nu(e, t, o, 6);
							break;
						case 8:
							bu(), Ul = 6;
							break a;
						default: throw Error(i(462));
					}
				}
				Au();
				break;
			} catch (t) {
				Su(e, t);
			}
		while (1);
		return Bi = zi = null, F.H = r, F.A = a, Fl = n, X === null ? (Il = null, Z = 0, qr(), Ul) : 0;
	}
	function Au() {
		for (; X !== null && !be();) ju(X);
	}
	function ju(e) {
		var t = Ec(e.alternate, e, Hl);
		e.memoizedProps = e.pendingProps, t === null ? Pu(e) : X = t;
	}
	function Mu(e) {
		var t = e, n = t.alternate;
		switch (t.tag) {
			case 15:
			case 0:
				t = uc(n, t, t.pendingProps, t.type, void 0, Z);
				break;
			case 11:
				t = uc(n, t, t.pendingProps, t.type.render, t.ref, Z);
				break;
			case 5: So(t);
			default: Fc(n, t), t = X = ii(t, Hl), t = Ec(n, t, Hl);
		}
		e.memoizedProps = e.pendingProps, t === null ? Pu(e) : X = t;
	}
	function Nu(e, t, n, r) {
		Bi = zi = null, So(t), Ta = null, Ea = 0;
		var i = t.return;
		try {
			if (Ys(e, i, t, n, Z)) {
				Ul = 1, Ws(e, di(n, e.current)), X = null;
				return;
			}
		} catch (t) {
			if (i !== null) throw X = i, t;
			Ul = 1, Ws(e, di(n, e.current)), X = null;
			return;
		}
		t.flags & 32768 ? (K || r === 1 ? e = !0 : Bl || Z & 536870912 ? e = !1 : (zl = e = !0, (r === 2 || r === 9 || r === 3 || r === 6) && (r = Ya.current, r !== null && r.tag === 13 && (r.flags |= 16384))), Fu(t, e)) : Pu(t);
	}
	function Pu(e) {
		var t = e;
		do {
			if (t.flags & 32768) {
				Fu(t, zl);
				return;
			}
			e = t.return;
			var n = Nc(t.alternate, t, Hl);
			if (n !== null) {
				X = n;
				return;
			}
			if (t = t.sibling, t !== null) {
				X = t;
				return;
			}
			X = t = e;
		} while (t !== null);
		Ul === 0 && (Ul = 5);
	}
	function Fu(e, t) {
		do {
			var n = Pc(e.alternate, e);
			if (n !== null) {
				n.flags &= 32767, X = n;
				return;
			}
			if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
				X = e;
				return;
			}
			X = e = n;
		} while (e !== null);
		Ul = 6, X = null;
	}
	function Iu(e, t, n, r, a, o, s, c, l) {
		e.cancelPendingCommit = null;
		do
			Vu();
		while (ru !== 0);
		if (Fl & 6) throw Error(i(327));
		if (t !== null) {
			if (t === e.current) throw Error(i(177));
			if (o = t.lanes | t.childLanes, o |= Kr, Je(e, n, o, s, c, l), e === Il && (X = Il = null, Z = 0), au = t, iu = e, ou = n, su = o, cu = a, lu = r, t.subtreeFlags & 10256 || t.flags & 10256 ? (e.callbackNode = null, e.callbackPriority = 0, Xu(Ee, function() {
				return Hu(), null;
			})) : (e.callbackNode = null, e.callbackPriority = 0), r = !!(t.flags & 13878), t.subtreeFlags & 13878 || r) {
				r = F.T, F.T = null, a = I.p, I.p = 2, s = Fl, Fl |= 4;
				try {
					el(e, t, n);
				} finally {
					Fl = s, I.p = a, F.T = r;
				}
			}
			ru = 1, Lu(), Ru(), zu();
		}
	}
	function Lu() {
		if (ru === 1) {
			ru = 0;
			var e = iu, t = au, n = !!(t.flags & 13878);
			if (t.subtreeFlags & 13878 || n) {
				n = F.T, F.T = null;
				var r = I.p;
				I.p = 2;
				var i = Fl;
				Fl |= 4;
				try {
					pl(t, e);
					var a = Bd, o = br(e.containerInfo), s = a.focusedElem, c = a.selectionRange;
					if (o !== s && s && s.ownerDocument && yr(s.ownerDocument.documentElement, s)) {
						if (c !== null && xr(s)) {
							var l = c.start, u = c.end;
							if (u === void 0 && (u = l), "selectionStart" in s) s.selectionStart = l, s.selectionEnd = Math.min(u, s.value.length);
							else {
								var d = s.ownerDocument || document, f = d && d.defaultView || window;
								if (f.getSelection) {
									var p = f.getSelection(), m = s.textContent.length, h = Math.min(c.start, m), g = c.end === void 0 ? h : Math.min(c.end, m);
									!p.extend && h > g && (o = g, g = h, h = o);
									var _ = vr(s, h), v = vr(s, g);
									if (_ && v && (p.rangeCount !== 1 || p.anchorNode !== _.node || p.anchorOffset !== _.offset || p.focusNode !== v.node || p.focusOffset !== v.offset)) {
										var y = d.createRange();
										y.setStart(_.node, _.offset), p.removeAllRanges(), h > g ? (p.addRange(y), p.extend(v.node, v.offset)) : (y.setEnd(v.node, v.offset), p.addRange(y));
									}
								}
							}
						}
						for (d = [], p = s; p = p.parentNode;) p.nodeType === 1 && d.push({
							element: p,
							left: p.scrollLeft,
							top: p.scrollTop
						});
						for (typeof s.focus == "function" && s.focus(), s = 0; s < d.length; s++) {
							var b = d[s];
							b.element.scrollLeft = b.left, b.element.scrollTop = b.top;
						}
					}
					cp = !!zd, Bd = zd = null;
				} finally {
					Fl = i, I.p = r, F.T = n;
				}
			}
			e.current = t, ru = 2;
		}
	}
	function Ru() {
		if (ru === 2) {
			ru = 0;
			var e = iu, t = au, n = !!(t.flags & 8772);
			if (t.subtreeFlags & 8772 || n) {
				n = F.T, F.T = null;
				var r = I.p;
				I.p = 2;
				var i = Fl;
				Fl |= 4;
				try {
					tl(e, t.alternate, t);
				} finally {
					Fl = i, I.p = r, F.T = n;
				}
			}
			ru = 3;
		}
	}
	function zu() {
		if (ru === 4 || ru === 3) {
			ru = 0, xe();
			var e = iu, t = au, n = ou, r = lu;
			t.subtreeFlags & 10256 || t.flags & 10256 ? ru = 5 : (ru = 0, au = iu = null, Bu(e, e.pendingLanes));
			var i = e.pendingLanes;
			if (i === 0 && (nu = null), $e(n), t = t.stateNode, Me && typeof Me.onCommitFiberRoot == "function") try {
				Me.onCommitFiberRoot(je, t, void 0, (t.current.flags & 128) == 128);
			} catch {}
			if (r !== null) {
				t = F.T, i = I.p, I.p = 2, F.T = null;
				try {
					for (var a = e.onRecoverableError, o = 0; o < r.length; o++) {
						var s = r[o];
						a(s.value, { componentStack: s.stack });
					}
				} finally {
					F.T = t, I.p = i;
				}
			}
			ou & 3 && Vu(), rd(e), i = e.pendingLanes, n & 261930 && i & 42 ? e === du ? uu++ : (uu = 0, du = e) : uu = 0, id(0, !1);
		}
	}
	function Bu(e, t) {
		(e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, na(t)));
	}
	function Vu() {
		return Lu(), Ru(), zu(), Hu();
	}
	function Hu() {
		if (ru !== 5) return !1;
		var e = iu, t = su;
		su = 0;
		var n = $e(ou), r = F.T, a = I.p;
		try {
			I.p = 32 > n ? 32 : n, F.T = null, n = cu, cu = null;
			var o = iu, s = ou;
			if (ru = 0, au = iu = null, ou = 0, Fl & 6) throw Error(i(331));
			var c = Fl;
			if (Fl |= 4, Al(o.current), Sl(o, o.current, s, n), Fl = c, id(0, !1), Me && typeof Me.onPostCommitFiberRoot == "function") try {
				Me.onPostCommitFiberRoot(je, o);
			} catch {}
			return !0;
		} finally {
			I.p = a, F.T = r, Bu(e, t);
		}
	}
	function Uu(e, t, n) {
		t = di(n, t), t = Ks(e.stateNode, t, 2), e = Ia(e, t, 2), e !== null && (qe(e, 2), rd(e));
	}
	function Wu(e, t, n) {
		if (e.tag === 3) Uu(e, e, n);
		else for (; t !== null;) {
			if (t.tag === 3) {
				Uu(t, e, n);
				break;
			}
			if (t.tag === 1) {
				var r = t.stateNode;
				if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (nu === null || !nu.has(r))) {
					e = di(n, e), n = qs(2), r = Ia(t, n, 2), r !== null && (Js(n, r, t, e), qe(r, 2), rd(r));
					break;
				}
			}
			t = t.return;
		}
	}
	function Gu(e, t, n) {
		var r = e.pingCache;
		if (r === null) {
			r = e.pingCache = new Pl();
			var i = /* @__PURE__ */ new Set();
			r.set(t, i);
		} else i = r.get(t), i === void 0 && (i = /* @__PURE__ */ new Set(), r.set(t, i));
		i.has(n) || (Vl = !0, i.add(n), e = Ku.bind(null, e, t, n), t.then(e, e));
	}
	function Ku(e, t, n) {
		var r = e.pingCache;
		r !== null && r.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, Il === e && (Z & n) === n && (Ul === 4 || Ul === 3 && (Z & 62914560) === Z && 300 > Se() - Ql ? !(Fl & 2) && xu(e, 0) : Kl |= n, Jl === Z && (Jl = 0)), rd(e);
	}
	function qu(e, t) {
		t === 0 && (t = Ge()), e = Xr(e, t), e !== null && (qe(e, t), rd(e));
	}
	function Ju(e) {
		var t = e.memoizedState, n = 0;
		t !== null && (n = t.retryLane), qu(e, n);
	}
	function Yu(e, t) {
		var n = 0;
		switch (e.tag) {
			case 31:
			case 13:
				var r = e.stateNode, a = e.memoizedState;
				a !== null && (n = a.retryLane);
				break;
			case 19:
				r = e.stateNode;
				break;
			case 22:
				r = e.stateNode._retryCache;
				break;
			default: throw Error(i(314));
		}
		r !== null && r.delete(t), qu(e, n);
	}
	function Xu(e, t) {
		return ve(e, t);
	}
	var Zu = null, Qu = null, $u = !1, ed = !1, td = !1, nd = 0;
	function rd(e) {
		e !== Qu && e.next === null && (Qu === null ? Zu = Qu = e : Qu = Qu.next = e), ed = !0, $u || ($u = !0, ud());
	}
	function id(e, t) {
		if (!td && ed) {
			td = !0;
			do
				for (var n = !1, r = Zu; r !== null;) {
					if (!t) {
						if (e !== 0) {
							var i = r.pendingLanes;
							if (i === 0) var a = 0;
							else {
								var o = r.suspendedLanes, s = r.pingedLanes;
								a = (1 << 31 - Pe(42 | e) + 1) - 1, a &= i & ~(o & ~s), a = a & 201326741 ? a & 201326741 | 1 : a ? a | 2 : 0;
							}
							a !== 0 && (n = !0, ld(r, a));
						} else a = Z, a = He(r, r === Il ? a : 0, r.cancelPendingCommit !== null || r.timeoutHandle !== -1), !(a & 3) || Ue(r, a) || (n = !0, ld(r, a));
					}
					r = r.next;
				}
			while (n);
			td = !1;
		}
	}
	function ad() {
		od();
	}
	function od() {
		ed = $u = !1;
		var e = 0;
		nd !== 0 && Kd() && (e = nd);
		for (var t = Se(), n = null, r = Zu; r !== null;) {
			var i = r.next, a = sd(r, t);
			a === 0 ? (r.next = null, n === null ? Zu = i : n.next = i, i === null && (Qu = n)) : (n = r, (e !== 0 || a & 3) && (ed = !0)), r = i;
		}
		ru !== 0 && ru !== 5 || id(e, !1), nd !== 0 && (nd = 0);
	}
	function sd(e, t) {
		for (var n = e.suspendedLanes, r = e.pingedLanes, i = e.expirationTimes, a = e.pendingLanes & -62914561; 0 < a;) {
			var o = 31 - Pe(a), s = 1 << o, c = i[o];
			c === -1 ? ((s & n) === 0 || (s & r) !== 0) && (i[o] = We(s, t)) : c <= t && (e.expiredLanes |= s), a &= ~s;
		}
		if (t = Il, n = Z, n = He(e, e === t ? n : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r = e.callbackNode, n === 0 || e === t && (Ll === 2 || Ll === 9) || e.cancelPendingCommit !== null) return r !== null && r !== null && ye(r), e.callbackNode = null, e.callbackPriority = 0;
		if (!(n & 3) || Ue(e, n)) {
			if (t = n & -n, t === e.callbackPriority) return t;
			switch (r !== null && ye(r), $e(n)) {
				case 2:
				case 8:
					n = Te;
					break;
				case 32:
					n = Ee;
					break;
				case 268435456:
					n = Oe;
					break;
				default: n = Ee;
			}
			return r = cd.bind(null, e), n = ve(n, r), e.callbackPriority = t, e.callbackNode = n, t;
		}
		return r !== null && r !== null && ye(r), e.callbackPriority = 2, e.callbackNode = null, 2;
	}
	function cd(e, t) {
		if (ru !== 0 && ru !== 5) return e.callbackNode = null, e.callbackPriority = 0, null;
		var n = e.callbackNode;
		if (Vu() && e.callbackNode !== n) return null;
		var r = Z;
		return r = He(e, e === Il ? r : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r === 0 ? null : (hu(e, r, t), sd(e, Se()), e.callbackNode != null && e.callbackNode === n ? cd.bind(null, e) : null);
	}
	function ld(e, t) {
		if (Vu()) return null;
		hu(e, t, !0);
	}
	function ud() {
		Xd(function() {
			Fl & 6 ? ve(we, ad) : od();
		});
	}
	function dd() {
		if (nd === 0) {
			var e = aa;
			e === 0 && (e = Re, Re <<= 1, !(Re & 261888) && (Re = 256)), nd = e;
		}
		return nd;
	}
	function fd(e) {
		return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : qt("" + e);
	}
	function pd(e, t) {
		var n = t.ownerDocument.createElement("input");
		return n.name = t.name, n.value = t.value, e.id && n.setAttribute("form", e.id), t.parentNode.insertBefore(n, t), e = new FormData(e), n.parentNode.removeChild(n), e;
	}
	function md(e, t, n, r, i) {
		if (t === "submit" && n && n.stateNode === i) {
			var a = fd((i[it] || null).action), o = r.submitter;
			o && (t = (t = o[it] || null) ? fd(t.formAction) : o.getAttribute("formAction"), t !== null && (a = t, o = null));
			var s = new hn("action", "action", null, r, i);
			e.push({
				event: s,
				listeners: [{
					instance: null,
					listener: function() {
						if (r.defaultPrevented) {
							if (nd !== 0) {
								var e = o ? pd(i, o) : new FormData(i);
								vs(n, {
									pending: !0,
									data: e,
									method: i.method,
									action: a
								}, null, e);
							}
						} else typeof a == "function" && (s.preventDefault(), e = o ? pd(i, o) : new FormData(i), vs(n, {
							pending: !0,
							data: e,
							method: i.method,
							action: a
						}, a, e));
					},
					currentTarget: i
				}]
			});
		}
	}
	for (var hd = 0; hd < Vr.length; hd++) {
		var gd = Vr[hd];
		Hr(gd.toLowerCase(), "on" + (gd[0].toUpperCase() + gd.slice(1)));
	}
	Hr(Nr, "onAnimationEnd"), Hr(Pr, "onAnimationIteration"), Hr(Fr, "onAnimationStart"), Hr("dblclick", "onDoubleClick"), Hr("focusin", "onFocus"), Hr("focusout", "onBlur"), Hr(Ir, "onTransitionRun"), Hr(Lr, "onTransitionStart"), Hr(Rr, "onTransitionCancel"), Hr(zr, "onTransitionEnd"), bt("onMouseEnter", ["mouseout", "mouseover"]), bt("onMouseLeave", ["mouseout", "mouseover"]), bt("onPointerEnter", ["pointerout", "pointerover"]), bt("onPointerLeave", ["pointerout", "pointerover"]), yt("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), yt("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), yt("onBeforeInput", [
		"compositionend",
		"keypress",
		"textInput",
		"paste"
	]), yt("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), yt("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), yt("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
	var _d = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), vd = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(_d));
	function yd(e, t) {
		t = !!(t & 4);
		for (var n = 0; n < e.length; n++) {
			var r = e[n], i = r.event;
			r = r.listeners;
			a: {
				var a = void 0;
				if (t) for (var o = r.length - 1; 0 <= o; o--) {
					var s = r[o], c = s.instance, l = s.currentTarget;
					if (s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						Ur(e);
					}
					i.currentTarget = null, a = c;
				}
				else for (o = 0; o < r.length; o++) {
					if (s = r[o], c = s.instance, l = s.currentTarget, s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						Ur(e);
					}
					i.currentTarget = null, a = c;
				}
			}
		}
	}
	function Q(e, t) {
		var n = t[ot];
		n === void 0 && (n = t[ot] = /* @__PURE__ */ new Set());
		var r = e + "__bubble";
		n.has(r) || (Cd(t, e, 2, !1), n.add(r));
	}
	function bd(e, t, n) {
		var r = 0;
		t && (r |= 4), Cd(n, e, r, t);
	}
	var xd = "_reactListening" + Math.random().toString(36).slice(2);
	function Sd(e) {
		if (!e[xd]) {
			e[xd] = !0, _t.forEach(function(t) {
				t !== "selectionchange" && (vd.has(t) || bd(t, !1, e), bd(t, !0, e));
			});
			var t = e.nodeType === 9 ? e : e.ownerDocument;
			t === null || t[xd] || (t[xd] = !0, bd("selectionchange", !1, t));
		}
	}
	function Cd(e, t, n, r) {
		switch (hp(t)) {
			case 2:
				var i = lp;
				break;
			case 8:
				i = up;
				break;
			default: i = dp;
		}
		n = i.bind(null, t, n, e), i = void 0, !rn || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (i = !0), r ? i === void 0 ? e.addEventListener(t, n, !0) : e.addEventListener(t, n, {
			capture: !0,
			passive: i
		}) : i === void 0 ? e.addEventListener(t, n, !1) : e.addEventListener(t, n, { passive: i });
	}
	function wd(e, t, n, r, i) {
		var a = r;
		if (!(t & 1) && !(t & 2) && r !== null) a: for (;;) {
			if (r === null) return;
			var s = r.tag;
			if (s === 3 || s === 4) {
				var c = r.stateNode.containerInfo;
				if (c === i) break;
				if (s === 4) for (s = r.return; s !== null;) {
					var l = s.tag;
					if ((l === 3 || l === 4) && s.stateNode.containerInfo === i) return;
					s = s.return;
				}
				for (; c !== null;) {
					if (s = ft(c), s === null) return;
					if (l = s.tag, l === 5 || l === 6 || l === 26 || l === 27) {
						r = a = s;
						continue a;
					}
					c = c.parentNode;
				}
			}
			r = r.return;
		}
		en(function() {
			var r = a, i = Xt(n), s = [];
			a: {
				var c = Br.get(e);
				if (c !== void 0) {
					var l = hn, u = e;
					switch (e) {
						case "keypress": if (un(n) === 0) break a;
						case "keydown":
						case "keyup":
							l = Mn;
							break;
						case "focusin":
							u = "focus", l = Cn;
							break;
						case "focusout":
							u = "blur", l = Cn;
							break;
						case "beforeblur":
						case "afterblur":
							l = Cn;
							break;
						case "click": if (n.button === 2) break a;
						case "auxclick":
						case "dblclick":
						case "mousedown":
						case "mousemove":
						case "mouseup":
						case "mouseout":
						case "mouseover":
						case "contextmenu":
							l = xn;
							break;
						case "drag":
						case "dragend":
						case "dragenter":
						case "dragexit":
						case "dragleave":
						case "dragover":
						case "dragstart":
						case "drop":
							l = Sn;
							break;
						case "touchcancel":
						case "touchend":
						case "touchmove":
						case "touchstart":
							l = Pn;
							break;
						case Nr:
						case Pr:
						case Fr:
							l = wn;
							break;
						case zr:
							l = Fn;
							break;
						case "scroll":
						case "scrollend":
							l = _n;
							break;
						case "wheel":
							l = In;
							break;
						case "copy":
						case "cut":
						case "paste":
							l = Tn;
							break;
						case "gotpointercapture":
						case "lostpointercapture":
						case "pointercancel":
						case "pointerdown":
						case "pointermove":
						case "pointerout":
						case "pointerover":
						case "pointerup":
							l = Nn;
							break;
						case "toggle":
						case "beforetoggle": l = Ln;
					}
					var d = !!(t & 4), f = !d && (e === "scroll" || e === "scrollend"), p = d ? c === null ? null : c + "Capture" : c;
					d = [];
					for (var m = r, h; m !== null;) {
						var g = m;
						if (h = g.stateNode, g = g.tag, g !== 5 && g !== 26 && g !== 27 || h === null || p === null || (g = tn(m, p), g != null && d.push(Td(m, g, h))), f) break;
						m = m.return;
					}
					0 < d.length && (c = new l(c, u, null, n, i), s.push({
						event: c,
						listeners: d
					}));
				}
			}
			if (!(t & 7)) {
				a: {
					if (c = e === "mouseover" || e === "pointerover", l = e === "mouseout" || e === "pointerout", c && n !== Yt && (u = n.relatedTarget || n.fromElement) && (ft(u) || u[at])) break a;
					if ((l || c) && (c = i.window === i ? i : (c = i.ownerDocument) ? c.defaultView || c.parentWindow : window, l ? (u = n.relatedTarget || n.toElement, l = r, u = u ? ft(u) : null, u !== null && (f = o(u), d = u.tag, u !== f || d !== 5 && d !== 27 && d !== 6) && (u = null)) : (l = null, u = r), l !== u)) {
						if (d = xn, g = "onMouseLeave", p = "onMouseEnter", m = "mouse", (e === "pointerout" || e === "pointerover") && (d = Nn, g = "onPointerLeave", p = "onPointerEnter", m = "pointer"), f = l == null ? c : mt(l), h = u == null ? c : mt(u), c = new d(g, m + "leave", l, n, i), c.target = f, c.relatedTarget = h, g = null, ft(i) === r && (d = new d(p, m + "enter", u, n, i), d.target = h, d.relatedTarget = f, g = d), f = g, l && u) b: {
							for (d = Dd, p = l, m = u, h = 0, g = p; g; g = d(g)) h++;
							g = 0;
							for (var _ = m; _; _ = d(_)) g++;
							for (; 0 < h - g;) p = d(p), h--;
							for (; 0 < g - h;) m = d(m), g--;
							for (; h--;) {
								if (p === m || m !== null && p === m.alternate) {
									d = p;
									break b;
								}
								p = d(p), m = d(m);
							}
							d = null;
						}
						else d = null;
						l !== null && Od(s, c, l, d, !1), u !== null && f !== null && Od(s, f, u, d, !0);
					}
				}
				a: {
					if (c = r ? mt(r) : window, l = c.nodeName && c.nodeName.toLowerCase(), l === "select" || l === "input" && c.type === "file") var v = rr;
					else if (Zn(c)) {
						if (ir) v = pr;
						else {
							v = dr;
							var y = ur;
						}
					} else l = c.nodeName, !l || l.toLowerCase() !== "input" || c.type !== "checkbox" && c.type !== "radio" ? r && U(r.elementType) && (v = rr) : v = fr;
					if (v &&= v(e, r)) {
						Qn(s, v, n, i);
						break a;
					}
					y && y(e, c, r), e === "focusout" && r && c.type === "number" && r.memoizedProps.value != null && Lt(c, "number", c.value);
				}
				switch (y = r ? mt(r) : window, e) {
					case "focusin":
						(Zn(y) || y.contentEditable === "true") && (Cr = y, wr = r, Tr = null);
						break;
					case "focusout":
						Tr = wr = Cr = null;
						break;
					case "mousedown":
						Er = !0;
						break;
					case "contextmenu":
					case "mouseup":
					case "dragend":
						Er = !1, Dr(s, n, i);
						break;
					case "selectionchange": if (Sr) break;
					case "keydown":
					case "keyup": Dr(s, n, i);
				}
				var b;
				if (zn) b: {
					switch (e) {
						case "compositionstart":
							var x = "onCompositionStart";
							break b;
						case "compositionend":
							x = "onCompositionEnd";
							break b;
						case "compositionupdate":
							x = "onCompositionUpdate";
							break b;
					}
					x = void 0;
				}
				else qn ? Gn(e, n) && (x = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (x = "onCompositionStart");
				x && (Hn && n.locale !== "ko" && (qn || x !== "onCompositionStart" ? x === "onCompositionEnd" && qn && (b = ln()) : (on = i, sn = "value" in on ? on.value : on.textContent, qn = !0)), y = Ed(r, x), 0 < y.length && (x = new En(x, e, null, n, i), s.push({
					event: x,
					listeners: y
				}), b ? x.data = b : (b = Kn(n), b !== null && (x.data = b)))), (b = Vn ? Jn(e, n) : Yn(e, n)) && (x = Ed(r, "onBeforeInput"), 0 < x.length && (y = new En("onBeforeInput", "beforeinput", null, n, i), s.push({
					event: y,
					listeners: x
				}), y.data = b)), md(s, e, r, n, i);
			}
			yd(s, t);
		});
	}
	function Td(e, t, n) {
		return {
			instance: e,
			listener: t,
			currentTarget: n
		};
	}
	function Ed(e, t) {
		for (var n = t + "Capture", r = []; e !== null;) {
			var i = e, a = i.stateNode;
			if (i = i.tag, i !== 5 && i !== 26 && i !== 27 || a === null || (i = tn(e, n), i != null && r.unshift(Td(e, i, a)), i = tn(e, t), i != null && r.push(Td(e, i, a))), e.tag === 3) return r;
			e = e.return;
		}
		return [];
	}
	function Dd(e) {
		if (e === null) return null;
		do
			e = e.return;
		while (e && e.tag !== 5 && e.tag !== 27);
		return e || null;
	}
	function Od(e, t, n, r, i) {
		for (var a = t._reactName, o = []; n !== null && n !== r;) {
			var s = n, c = s.alternate, l = s.stateNode;
			if (s = s.tag, c !== null && c === r) break;
			s !== 5 && s !== 26 && s !== 27 || l === null || (c = l, i ? (l = tn(n, a), l != null && o.unshift(Td(n, l, c))) : i || (l = tn(n, a), l != null && o.push(Td(n, l, c)))), n = n.return;
		}
		o.length !== 0 && e.push({
			event: t,
			listeners: o
		});
	}
	var kd = /\r\n?/g, Ad = /\u0000|\uFFFD/g;
	function jd(e) {
		return (typeof e == "string" ? e : "" + e).replace(kd, "\n").replace(Ad, "");
	}
	function Md(e, t) {
		return t = jd(t), jd(e) === t;
	}
	function Nd(e, t, n, r, a, o) {
		switch (n) {
			case "children":
				typeof r == "string" ? t === "body" || t === "textarea" && r === "" || Vt(e, r) : (typeof r == "number" || typeof r == "bigint") && t !== "body" && Vt(e, "" + r);
				break;
			case "className":
				Et(e, "class", r);
				break;
			case "tabIndex":
				Et(e, "tabindex", r);
				break;
			case "dir":
			case "role":
			case "viewBox":
			case "width":
			case "height":
				Et(e, n, r);
				break;
			case "style":
				Wt(e, r, o);
				break;
			case "data": if (t !== "object") {
				Et(e, "data", r);
				break;
			}
			case "src":
			case "href":
				if (r === "" && (t !== "a" || n !== "href")) {
					e.removeAttribute(n);
					break;
				}
				if (r == null || typeof r == "function" || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = qt("" + r), e.setAttribute(n, r);
				break;
			case "action":
			case "formAction":
				if (typeof r == "function") {
					e.setAttribute(n, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
					break;
				}
				if (typeof o == "function" && (n === "formAction" ? (t !== "input" && Nd(e, t, "name", a.name, a, null), Nd(e, t, "formEncType", a.formEncType, a, null), Nd(e, t, "formMethod", a.formMethod, a, null), Nd(e, t, "formTarget", a.formTarget, a, null)) : (Nd(e, t, "encType", a.encType, a, null), Nd(e, t, "method", a.method, a, null), Nd(e, t, "target", a.target, a, null))), r == null || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = qt("" + r), e.setAttribute(n, r);
				break;
			case "onClick":
				r != null && (e.onclick = Jt);
				break;
			case "onScroll":
				r != null && Q("scroll", e);
				break;
			case "onScrollEnd":
				r != null && Q("scrollend", e);
				break;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(i(61));
					if (n = r.__html, n != null) {
						if (a.children != null) throw Error(i(60));
						e.innerHTML = n;
					}
				}
				break;
			case "multiple":
				e.multiple = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "muted":
				e.muted = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "defaultValue":
			case "defaultChecked":
			case "innerHTML":
			case "ref": break;
			case "autoFocus": break;
			case "xlinkHref":
				if (r == null || typeof r == "function" || typeof r == "boolean" || typeof r == "symbol") {
					e.removeAttribute("xlink:href");
					break;
				}
				n = qt("" + r), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n);
				break;
			case "contentEditable":
			case "spellCheck":
			case "draggable":
			case "value":
			case "autoReverse":
			case "externalResourcesRequired":
			case "focusable":
			case "preserveAlpha":
				r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, "" + r) : e.removeAttribute(n);
				break;
			case "inert":
			case "allowFullScreen":
			case "async":
			case "autoPlay":
			case "controls":
			case "default":
			case "defer":
			case "disabled":
			case "disablePictureInPicture":
			case "disableRemotePlayback":
			case "formNoValidate":
			case "hidden":
			case "loop":
			case "noModule":
			case "noValidate":
			case "open":
			case "playsInline":
			case "readOnly":
			case "required":
			case "reversed":
			case "scoped":
			case "seamless":
			case "itemScope":
				r && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, "") : e.removeAttribute(n);
				break;
			case "capture":
			case "download":
				!0 === r ? e.setAttribute(n, "") : !1 !== r && r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "cols":
			case "rows":
			case "size":
			case "span":
				r != null && typeof r != "function" && typeof r != "symbol" && !isNaN(r) && 1 <= r ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "rowSpan":
			case "start":
				r == null || typeof r == "function" || typeof r == "symbol" || isNaN(r) ? e.removeAttribute(n) : e.setAttribute(n, r);
				break;
			case "popover":
				Q("beforetoggle", e), Q("toggle", e), Tt(e, "popover", r);
				break;
			case "xlinkActuate":
				Dt(e, "http://www.w3.org/1999/xlink", "xlink:actuate", r);
				break;
			case "xlinkArcrole":
				Dt(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", r);
				break;
			case "xlinkRole":
				Dt(e, "http://www.w3.org/1999/xlink", "xlink:role", r);
				break;
			case "xlinkShow":
				Dt(e, "http://www.w3.org/1999/xlink", "xlink:show", r);
				break;
			case "xlinkTitle":
				Dt(e, "http://www.w3.org/1999/xlink", "xlink:title", r);
				break;
			case "xlinkType":
				Dt(e, "http://www.w3.org/1999/xlink", "xlink:type", r);
				break;
			case "xmlBase":
				Dt(e, "http://www.w3.org/XML/1998/namespace", "xml:base", r);
				break;
			case "xmlLang":
				Dt(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", r);
				break;
			case "xmlSpace":
				Dt(e, "http://www.w3.org/XML/1998/namespace", "xml:space", r);
				break;
			case "is":
				Tt(e, "is", r);
				break;
			case "innerText":
			case "textContent": break;
			default: (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") && (n = Gt.get(n) || n, Tt(e, n, r));
		}
	}
	function Pd(e, t, n, r, a, o) {
		switch (n) {
			case "style":
				Wt(e, r, o);
				break;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(i(61));
					if (n = r.__html, n != null) {
						if (a.children != null) throw Error(i(60));
						e.innerHTML = n;
					}
				}
				break;
			case "children":
				typeof r == "string" ? Vt(e, r) : (typeof r == "number" || typeof r == "bigint") && Vt(e, "" + r);
				break;
			case "onScroll":
				r != null && Q("scroll", e);
				break;
			case "onScrollEnd":
				r != null && Q("scrollend", e);
				break;
			case "onClick":
				r != null && (e.onclick = Jt);
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "innerHTML":
			case "ref": break;
			case "innerText":
			case "textContent": break;
			default: if (!vt.hasOwnProperty(n)) a: {
				if (n[0] === "o" && n[1] === "n" && (a = n.endsWith("Capture"), t = n.slice(2, a ? n.length - 7 : void 0), o = e[it] || null, o = o == null ? null : o[n], typeof o == "function" && e.removeEventListener(t, o, a), typeof r == "function")) {
					typeof o != "function" && o !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(t, r, a);
					break a;
				}
				n in e ? e[n] = r : !0 === r ? e.setAttribute(n, "") : Tt(e, n, r);
			}
		}
	}
	function Fd(e, t, n) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "img":
				Q("error", e), Q("load", e);
				var r = !1, a = !1, o;
				for (o in n) if (n.hasOwnProperty(o)) {
					var s = n[o];
					if (s != null) switch (o) {
						case "src":
							r = !0;
							break;
						case "srcSet":
							a = !0;
							break;
						case "children":
						case "dangerouslySetInnerHTML": throw Error(i(137, t));
						default: Nd(e, t, o, s, n, null);
					}
				}
				a && Nd(e, t, "srcSet", n.srcSet, n, null), r && Nd(e, t, "src", n.src, n, null);
				return;
			case "input":
				Q("invalid", e);
				var c = o = s = a = null, l = null, u = null;
				for (r in n) if (n.hasOwnProperty(r)) {
					var d = n[r];
					if (d != null) switch (r) {
						case "name":
							a = d;
							break;
						case "type":
							s = d;
							break;
						case "checked":
							l = d;
							break;
						case "defaultChecked":
							u = d;
							break;
						case "value":
							o = d;
							break;
						case "defaultValue":
							c = d;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (d != null) throw Error(i(137, t));
							break;
						default: Nd(e, t, r, d, n, null);
					}
				}
				It(e, o, c, l, u, s, a, !1);
				return;
			case "select":
				for (a in Q("invalid", e), r = s = o = null, n) if (n.hasOwnProperty(a) && (c = n[a], c != null)) switch (a) {
					case "value":
						o = c;
						break;
					case "defaultValue":
						s = c;
						break;
					case "multiple": r = c;
					default: Nd(e, t, a, c, n, null);
				}
				t = o, n = s, e.multiple = !!r, t == null ? n != null && Rt(e, !!r, n, !0) : Rt(e, !!r, t, !1);
				return;
			case "textarea":
				for (s in Q("invalid", e), o = a = r = null, n) if (n.hasOwnProperty(s) && (c = n[s], c != null)) switch (s) {
					case "value":
						r = c;
						break;
					case "defaultValue":
						a = c;
						break;
					case "children":
						o = c;
						break;
					case "dangerouslySetInnerHTML":
						if (c != null) throw Error(i(91));
						break;
					default: Nd(e, t, s, c, n, null);
				}
				Bt(e, r, a, o);
				return;
			case "option":
				for (l in n) if (n.hasOwnProperty(l) && (r = n[l], r != null)) switch (l) {
					case "selected":
						e.selected = r && typeof r != "function" && typeof r != "symbol";
						break;
					default: Nd(e, t, l, r, n, null);
				}
				return;
			case "dialog":
				Q("beforetoggle", e), Q("toggle", e), Q("cancel", e), Q("close", e);
				break;
			case "iframe":
			case "object":
				Q("load", e);
				break;
			case "video":
			case "audio":
				for (r = 0; r < _d.length; r++) Q(_d[r], e);
				break;
			case "image":
				Q("error", e), Q("load", e);
				break;
			case "details":
				Q("toggle", e);
				break;
			case "embed":
			case "source":
			case "link": Q("error", e), Q("load", e);
			case "area":
			case "base":
			case "br":
			case "col":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "track":
			case "wbr":
			case "menuitem":
				for (u in n) if (n.hasOwnProperty(u) && (r = n[u], r != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML": throw Error(i(137, t));
					default: Nd(e, t, u, r, n, null);
				}
				return;
			default: if (U(t)) {
				for (d in n) n.hasOwnProperty(d) && (r = n[d], r !== void 0 && Pd(e, t, d, r, n, void 0));
				return;
			}
		}
		for (c in n) n.hasOwnProperty(c) && (r = n[c], r != null && Nd(e, t, c, r, n, null));
	}
	function Id(e, t, n, r) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "input":
				var a = null, o = null, s = null, c = null, l = null, u = null, d = null;
				for (m in n) {
					var f = n[m];
					if (n.hasOwnProperty(m) && f != null) switch (m) {
						case "checked": break;
						case "value": break;
						case "defaultValue": l = f;
						default: r.hasOwnProperty(m) || Nd(e, t, m, null, r, f);
					}
				}
				for (var p in r) {
					var m = r[p];
					if (f = n[p], r.hasOwnProperty(p) && (m != null || f != null)) switch (p) {
						case "type":
							o = m;
							break;
						case "name":
							a = m;
							break;
						case "checked":
							u = m;
							break;
						case "defaultChecked":
							d = m;
							break;
						case "value":
							s = m;
							break;
						case "defaultValue":
							c = m;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (m != null) throw Error(i(137, t));
							break;
						default: m !== f && Nd(e, t, p, m, r, f);
					}
				}
				Ft(e, s, c, l, u, d, o, a);
				return;
			case "select":
				for (o in m = s = c = p = null, n) if (l = n[o], n.hasOwnProperty(o) && l != null) switch (o) {
					case "value": break;
					case "multiple": m = l;
					default: r.hasOwnProperty(o) || Nd(e, t, o, null, r, l);
				}
				for (a in r) if (o = r[a], l = n[a], r.hasOwnProperty(a) && (o != null || l != null)) switch (a) {
					case "value":
						p = o;
						break;
					case "defaultValue":
						c = o;
						break;
					case "multiple": s = o;
					default: o !== l && Nd(e, t, a, o, r, l);
				}
				t = c, n = s, r = m, p == null ? !!r != !!n && (t == null ? Rt(e, !!n, n ? [] : "", !1) : Rt(e, !!n, t, !0)) : Rt(e, !!n, p, !1);
				return;
			case "textarea":
				for (c in m = p = null, n) if (a = n[c], n.hasOwnProperty(c) && a != null && !r.hasOwnProperty(c)) switch (c) {
					case "value": break;
					case "children": break;
					default: Nd(e, t, c, null, r, a);
				}
				for (s in r) if (a = r[s], o = n[s], r.hasOwnProperty(s) && (a != null || o != null)) switch (s) {
					case "value":
						p = a;
						break;
					case "defaultValue":
						m = a;
						break;
					case "children": break;
					case "dangerouslySetInnerHTML":
						if (a != null) throw Error(i(91));
						break;
					default: a !== o && Nd(e, t, s, a, r, o);
				}
				zt(e, p, m);
				return;
			case "option":
				for (var h in n) if (p = n[h], n.hasOwnProperty(h) && p != null && !r.hasOwnProperty(h)) switch (h) {
					case "selected":
						e.selected = !1;
						break;
					default: Nd(e, t, h, null, r, p);
				}
				for (l in r) if (p = r[l], m = n[l], r.hasOwnProperty(l) && p !== m && (p != null || m != null)) switch (l) {
					case "selected":
						e.selected = p && typeof p != "function" && typeof p != "symbol";
						break;
					default: Nd(e, t, l, p, r, m);
				}
				return;
			case "img":
			case "link":
			case "area":
			case "base":
			case "br":
			case "col":
			case "embed":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "source":
			case "track":
			case "wbr":
			case "menuitem":
				for (var g in n) p = n[g], n.hasOwnProperty(g) && p != null && !r.hasOwnProperty(g) && Nd(e, t, g, null, r, p);
				for (u in r) if (p = r[u], m = n[u], r.hasOwnProperty(u) && p !== m && (p != null || m != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML":
						if (p != null) throw Error(i(137, t));
						break;
					default: Nd(e, t, u, p, r, m);
				}
				return;
			default: if (U(t)) {
				for (var _ in n) p = n[_], n.hasOwnProperty(_) && p !== void 0 && !r.hasOwnProperty(_) && Pd(e, t, _, void 0, r, p);
				for (d in r) p = r[d], m = n[d], !r.hasOwnProperty(d) || p === m || p === void 0 && m === void 0 || Pd(e, t, d, p, r, m);
				return;
			}
		}
		for (var v in n) p = n[v], n.hasOwnProperty(v) && p != null && !r.hasOwnProperty(v) && Nd(e, t, v, null, r, p);
		for (f in r) p = r[f], m = n[f], !r.hasOwnProperty(f) || p === m || p == null && m == null || Nd(e, t, f, p, r, m);
	}
	function Ld(e) {
		switch (e) {
			case "css":
			case "script":
			case "font":
			case "img":
			case "image":
			case "input":
			case "link": return !0;
			default: return !1;
		}
	}
	function Rd() {
		if (typeof performance.getEntriesByType == "function") {
			for (var e = 0, t = 0, n = performance.getEntriesByType("resource"), r = 0; r < n.length; r++) {
				var i = n[r], a = i.transferSize, o = i.initiatorType, s = i.duration;
				if (a && s && Ld(o)) {
					for (o = 0, s = i.responseEnd, r += 1; r < n.length; r++) {
						var c = n[r], l = c.startTime;
						if (l > s) break;
						var u = c.transferSize, d = c.initiatorType;
						u && Ld(d) && (c = c.responseEnd, o += u * (c < s ? 1 : (s - l) / (c - l)));
					}
					if (--r, t += 8 * (a + o) / (i.duration / 1e3), e++, 10 < e) break;
				}
			}
			if (0 < e) return t / e / 1e6;
		}
		return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
	}
	var zd = null, Bd = null;
	function Vd(e) {
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	function Hd(e) {
		switch (e) {
			case "http://www.w3.org/2000/svg": return 1;
			case "http://www.w3.org/1998/Math/MathML": return 2;
			default: return 0;
		}
	}
	function Ud(e, t) {
		if (e === 0) switch (t) {
			case "svg": return 1;
			case "math": return 2;
			default: return 0;
		}
		return e === 1 && t === "foreignObject" ? 0 : e;
	}
	function Wd(e, t) {
		return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
	}
	var Gd = null;
	function Kd() {
		var e = window.event;
		return e && e.type === "popstate" ? e !== Gd && (Gd = e, !0) : (Gd = null, !1);
	}
	var qd = typeof setTimeout == "function" ? setTimeout : void 0, Jd = typeof clearTimeout == "function" ? clearTimeout : void 0, Yd = typeof Promise == "function" ? Promise : void 0, Xd = typeof queueMicrotask == "function" ? queueMicrotask : Yd === void 0 ? qd : function(e) {
		return Yd.resolve(null).then(e).catch(Zd);
	};
	function Zd(e) {
		setTimeout(function() {
			throw e;
		});
	}
	function Qd(e) {
		return e === "head";
	}
	function $d(e, t) {
		var n = t, r = 0;
		do {
			var i = n.nextSibling;
			if (e.removeChild(n), i && i.nodeType === 8) {
				if (n = i.data, n === "/$" || n === "/&") {
					if (r === 0) {
						e.removeChild(i), Pp(t);
						return;
					}
					r--;
				} else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&") r++;
				else if (n === "html") mf(e.ownerDocument.documentElement);
				else if (n === "head") {
					n = e.ownerDocument.head, mf(n);
					for (var a = n.firstChild; a;) {
						var o = a.nextSibling, s = a.nodeName;
						a[ut] || s === "SCRIPT" || s === "STYLE" || s === "LINK" && a.rel.toLowerCase() === "stylesheet" || n.removeChild(a), a = o;
					}
				} else n === "body" && mf(e.ownerDocument.body);
			}
			n = i;
		} while (n);
		Pp(t);
	}
	function ef(e, t) {
		var n = e;
		e = 0;
		do {
			var r = n.nextSibling;
			if (n.nodeType === 1 ? t ? (n._stashedDisplay = n.style.display, n.style.display = "none") : (n.style.display = n._stashedDisplay || "", n.getAttribute("style") === "" && n.removeAttribute("style")) : n.nodeType === 3 && (t ? (n._stashedText = n.nodeValue, n.nodeValue = "") : n.nodeValue = n._stashedText || ""), r && r.nodeType === 8) {
				if (n = r.data, n === "/$") {
					if (e === 0) break;
					e--;
				} else n !== "$" && n !== "$?" && n !== "$~" && n !== "$!" || e++;
			}
			n = r;
		} while (n);
	}
	function tf(e) {
		var t = e.firstChild;
		for (t && t.nodeType === 10 && (t = t.nextSibling); t;) {
			var n = t;
			switch (t = t.nextSibling, n.nodeName) {
				case "HTML":
				case "HEAD":
				case "BODY":
					tf(n), dt(n);
					continue;
				case "SCRIPT":
				case "STYLE": continue;
				case "LINK": if (n.rel.toLowerCase() === "stylesheet") continue;
			}
			e.removeChild(n);
		}
	}
	function nf(e, t, n, r) {
		for (; e.nodeType === 1;) {
			var i = n;
			if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
				if (!r && (e.nodeName !== "INPUT" || e.type !== "hidden")) break;
			} else if (!r) {
				if (t === "input" && e.type === "hidden") {
					var a = i.name == null ? null : "" + i.name;
					if (i.type === "hidden" && e.getAttribute("name") === a) return e;
				} else return e;
			} else if (!e[ut]) switch (t) {
				case "meta":
					if (!e.hasAttribute("itemprop")) break;
					return e;
				case "link":
					if (a = e.getAttribute("rel"), a === "stylesheet" && e.hasAttribute("data-precedence") || a !== i.rel || e.getAttribute("href") !== (i.href == null || i.href === "" ? null : i.href) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin) || e.getAttribute("title") !== (i.title == null ? null : i.title)) break;
					return e;
				case "style":
					if (e.hasAttribute("data-precedence")) break;
					return e;
				case "script":
					if (a = e.getAttribute("src"), (a !== (i.src == null ? null : i.src) || e.getAttribute("type") !== (i.type == null ? null : i.type) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin)) && a && e.hasAttribute("async") && !e.hasAttribute("itemprop")) break;
					return e;
				default: return e;
			}
			if (e = lf(e.nextSibling), e === null) break;
		}
		return null;
	}
	function rf(e, t, n) {
		if (t === "") return null;
		for (; e.nodeType !== 3;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !n || (e = lf(e.nextSibling), e === null)) return null;
		return e;
	}
	function af(e, t) {
		for (; e.nodeType !== 8;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = lf(e.nextSibling), e === null)) return null;
		return e;
	}
	function of(e) {
		return e.data === "$?" || e.data === "$~";
	}
	function sf(e) {
		return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
	}
	function cf(e, t) {
		var n = e.ownerDocument;
		if (e.data === "$~") e._reactRetry = t;
		else if (e.data !== "$?" || n.readyState !== "loading") t();
		else {
			var r = function() {
				t(), n.removeEventListener("DOMContentLoaded", r);
			};
			n.addEventListener("DOMContentLoaded", r), e._reactRetry = r;
		}
	}
	function lf(e) {
		for (; e != null; e = e.nextSibling) {
			var t = e.nodeType;
			if (t === 1 || t === 3) break;
			if (t === 8) {
				if (t = e.data, t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F") break;
				if (t === "/$" || t === "/&") return null;
			}
		}
		return e;
	}
	var uf = null;
	function df(e) {
		e = e.nextSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "/$" || n === "/&") {
					if (t === 0) return lf(e.nextSibling);
					t--;
				} else n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&" || t++;
			}
			e = e.nextSibling;
		}
		return null;
	}
	function ff(e) {
		e = e.previousSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "$" || n === "$!" || n === "$?" || n === "$~" || n === "&") {
					if (t === 0) return e;
					t--;
				} else n !== "/$" && n !== "/&" || t++;
			}
			e = e.previousSibling;
		}
		return null;
	}
	function pf(e, t, n) {
		switch (t = Vd(n), e) {
			case "html":
				if (e = t.documentElement, !e) throw Error(i(452));
				return e;
			case "head":
				if (e = t.head, !e) throw Error(i(453));
				return e;
			case "body":
				if (e = t.body, !e) throw Error(i(454));
				return e;
			default: throw Error(i(451));
		}
	}
	function mf(e) {
		for (var t = e.attributes; t.length;) e.removeAttributeNode(t[0]);
		dt(e);
	}
	var hf = /* @__PURE__ */ new Map(), gf = /* @__PURE__ */ new Set();
	function _f(e) {
		return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
	}
	var vf = I.d;
	I.d = {
		f: yf,
		r: bf,
		D: Cf,
		C: wf,
		L: Tf,
		m: Ef,
		X: Of,
		S: Df,
		M: kf
	};
	function yf() {
		var e = vf.f(), t = yu();
		return e || t;
	}
	function bf(e) {
		var t = pt(e);
		t !== null && t.tag === 5 && t.type === "form" ? bs(t) : vf.r(e);
	}
	var xf = typeof document > "u" ? null : document;
	function Sf(e, t, n) {
		var r = xf;
		if (r && typeof t == "string" && t) {
			var i = Pt(t);
			i = "link[rel=\"" + e + "\"][href=\"" + i + "\"]", typeof n == "string" && (i += "[crossorigin=\"" + n + "\"]"), gf.has(i) || (gf.add(i), e = {
				rel: e,
				crossOrigin: n,
				href: t
			}, r.querySelector(i) === null && (t = r.createElement("link"), Fd(t, "link", e), gt(t), r.head.appendChild(t)));
		}
	}
	function Cf(e) {
		vf.D(e), Sf("dns-prefetch", e, null);
	}
	function wf(e, t) {
		vf.C(e, t), Sf("preconnect", e, t);
	}
	function Tf(e, t, n) {
		vf.L(e, t, n);
		var r = xf;
		if (r && e && t) {
			var i = "link[rel=\"preload\"][as=\"" + Pt(t) + "\"]";
			t === "image" && n && n.imageSrcSet ? (i += "[imagesrcset=\"" + Pt(n.imageSrcSet) + "\"]", typeof n.imageSizes == "string" && (i += "[imagesizes=\"" + Pt(n.imageSizes) + "\"]")) : i += "[href=\"" + Pt(e) + "\"]";
			var a = i;
			switch (t) {
				case "style":
					a = jf(e);
					break;
				case "script": a = Ff(e);
			}
			hf.has(a) || (e = h({
				rel: "preload",
				href: t === "image" && n && n.imageSrcSet ? void 0 : e,
				as: t
			}, n), hf.set(a, e), r.querySelector(i) !== null || t === "style" && r.querySelector(Mf(a)) || t === "script" && r.querySelector(If(a)) || (t = r.createElement("link"), Fd(t, "link", e), gt(t), r.head.appendChild(t)));
		}
	}
	function Ef(e, t) {
		vf.m(e, t);
		var n = xf;
		if (n && e) {
			var r = t && typeof t.as == "string" ? t.as : "script", i = "link[rel=\"modulepreload\"][as=\"" + Pt(r) + "\"][href=\"" + Pt(e) + "\"]", a = i;
			switch (r) {
				case "audioworklet":
				case "paintworklet":
				case "serviceworker":
				case "sharedworker":
				case "worker":
				case "script": a = Ff(e);
			}
			if (!hf.has(a) && (e = h({
				rel: "modulepreload",
				href: e
			}, t), hf.set(a, e), n.querySelector(i) === null)) {
				switch (r) {
					case "audioworklet":
					case "paintworklet":
					case "serviceworker":
					case "sharedworker":
					case "worker":
					case "script": if (n.querySelector(If(a))) return;
				}
				r = n.createElement("link"), Fd(r, "link", e), gt(r), n.head.appendChild(r);
			}
		}
	}
	function Df(e, t, n) {
		vf.S(e, t, n);
		var r = xf;
		if (r && e) {
			var i = ht(r).hoistableStyles, a = jf(e);
			t ||= "default";
			var o = i.get(a);
			if (!o) {
				var s = {
					loading: 0,
					preload: null
				};
				if (o = r.querySelector(Mf(a))) s.loading = 5;
				else {
					e = h({
						rel: "stylesheet",
						href: e,
						"data-precedence": t
					}, n), (n = hf.get(a)) && zf(e, n);
					var c = o = r.createElement("link");
					gt(c), Fd(c, "link", e), c._p = new Promise(function(e, t) {
						c.onload = e, c.onerror = t;
					}), c.addEventListener("load", function() {
						s.loading |= 1;
					}), c.addEventListener("error", function() {
						s.loading |= 2;
					}), s.loading |= 4, Rf(o, t, r);
				}
				o = {
					type: "stylesheet",
					instance: o,
					count: 1,
					state: s
				}, i.set(a, o);
			}
		}
	}
	function Of(e, t) {
		vf.X(e, t);
		var n = xf;
		if (n && e) {
			var r = ht(n).hoistableScripts, i = Ff(e), a = r.get(i);
			a || (a = n.querySelector(If(i)), a || (e = h({
				src: e,
				async: !0
			}, t), (t = hf.get(i)) && Bf(e, t), a = n.createElement("script"), gt(a), Fd(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function kf(e, t) {
		vf.M(e, t);
		var n = xf;
		if (n && e) {
			var r = ht(n).hoistableScripts, i = Ff(e), a = r.get(i);
			a || (a = n.querySelector(If(i)), a || (e = h({
				src: e,
				async: !0,
				type: "module"
			}, t), (t = hf.get(i)) && Bf(e, t), a = n.createElement("script"), gt(a), Fd(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Af(e, t, n, r) {
		var a = (a = ae.current) ? _f(a) : null;
		if (!a) throw Error(i(446));
		switch (e) {
			case "meta":
			case "title": return null;
			case "style": return typeof n.precedence == "string" && typeof n.href == "string" ? (t = jf(n.href), n = ht(a).hoistableStyles, r = n.get(t), r || (r = {
				type: "style",
				instance: null,
				count: 0,
				state: null
			}, n.set(t, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			case "link":
				if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
					e = jf(n.href);
					var o = ht(a).hoistableStyles, s = o.get(e);
					if (s || (a = a.ownerDocument || a, s = {
						type: "stylesheet",
						instance: null,
						count: 0,
						state: {
							loading: 0,
							preload: null
						}
					}, o.set(e, s), (o = a.querySelector(Mf(e))) && !o._p && (s.instance = o, s.state.loading = 5), hf.has(e) || (n = {
						rel: "preload",
						as: "style",
						href: n.href,
						crossOrigin: n.crossOrigin,
						integrity: n.integrity,
						media: n.media,
						hrefLang: n.hrefLang,
						referrerPolicy: n.referrerPolicy
					}, hf.set(e, n), o || Pf(a, e, n, s.state))), t && r === null) throw Error(i(528, ""));
					return s;
				}
				if (t && r !== null) throw Error(i(529, ""));
				return null;
			case "script": return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = Ff(n), n = ht(a).hoistableScripts, r = n.get(t), r || (r = {
				type: "script",
				instance: null,
				count: 0,
				state: null
			}, n.set(t, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			default: throw Error(i(444, e));
		}
	}
	function jf(e) {
		return "href=\"" + Pt(e) + "\"";
	}
	function Mf(e) {
		return "link[rel=\"stylesheet\"][" + e + "]";
	}
	function Nf(e) {
		return h({}, e, {
			"data-precedence": e.precedence,
			precedence: null
		});
	}
	function Pf(e, t, n, r) {
		e.querySelector("link[rel=\"preload\"][as=\"style\"][" + t + "]") ? r.loading = 1 : (t = e.createElement("link"), r.preload = t, t.addEventListener("load", function() {
			return r.loading |= 1;
		}), t.addEventListener("error", function() {
			return r.loading |= 2;
		}), Fd(t, "link", n), gt(t), e.head.appendChild(t));
	}
	function Ff(e) {
		return "[src=\"" + Pt(e) + "\"]";
	}
	function If(e) {
		return "script[async]" + e;
	}
	function Lf(e, t, n) {
		if (t.count++, t.instance === null) switch (t.type) {
			case "style":
				var r = e.querySelector("style[data-href~=\"" + Pt(n.href) + "\"]");
				if (r) return t.instance = r, gt(r), r;
				var a = h({}, n, {
					"data-href": n.href,
					"data-precedence": n.precedence,
					href: null,
					precedence: null
				});
				return r = (e.ownerDocument || e).createElement("style"), gt(r), Fd(r, "style", a), Rf(r, n.precedence, e), t.instance = r;
			case "stylesheet":
				a = jf(n.href);
				var o = e.querySelector(Mf(a));
				if (o) return t.state.loading |= 4, t.instance = o, gt(o), o;
				r = Nf(n), (a = hf.get(a)) && zf(r, a), o = (e.ownerDocument || e).createElement("link"), gt(o);
				var s = o;
				return s._p = new Promise(function(e, t) {
					s.onload = e, s.onerror = t;
				}), Fd(o, "link", r), t.state.loading |= 4, Rf(o, n.precedence, e), t.instance = o;
			case "script": return o = Ff(n.src), (a = e.querySelector(If(o))) ? (t.instance = a, gt(a), a) : (r = n, (a = hf.get(o)) && (r = h({}, n), Bf(r, a)), e = e.ownerDocument || e, a = e.createElement("script"), gt(a), Fd(a, "link", r), e.head.appendChild(a), t.instance = a);
			case "void": return null;
			default: throw Error(i(443, t.type));
		}
		else t.type === "stylesheet" && !(t.state.loading & 4) && (r = t.instance, t.state.loading |= 4, Rf(r, n.precedence, e));
		return t.instance;
	}
	function Rf(e, t, n) {
		for (var r = n.querySelectorAll("link[rel=\"stylesheet\"][data-precedence],style[data-precedence]"), i = r.length ? r[r.length - 1] : null, a = i, o = 0; o < r.length; o++) {
			var s = r[o];
			if (s.dataset.precedence === t) a = s;
			else if (a !== i) break;
		}
		a ? a.parentNode.insertBefore(e, a.nextSibling) : (t = n.nodeType === 9 ? n.head : n, t.insertBefore(e, t.firstChild));
	}
	function zf(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.title ??= t.title;
	}
	function Bf(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.integrity ??= t.integrity;
	}
	var Vf = null;
	function Hf(e, t, n) {
		if (Vf === null) {
			var r = /* @__PURE__ */ new Map(), i = Vf = /* @__PURE__ */ new Map();
			i.set(n, r);
		} else i = Vf, r = i.get(n), r || (r = /* @__PURE__ */ new Map(), i.set(n, r));
		if (r.has(e)) return r;
		for (r.set(e, null), n = n.getElementsByTagName(e), i = 0; i < n.length; i++) {
			var a = n[i];
			if (!(a[ut] || a[rt] || e === "link" && a.getAttribute("rel") === "stylesheet") && a.namespaceURI !== "http://www.w3.org/2000/svg") {
				var o = a.getAttribute(t) || "";
				o = e + o;
				var s = r.get(o);
				s ? s.push(a) : r.set(o, [a]);
			}
		}
		return r;
	}
	function Uf(e, t, n) {
		e = e.ownerDocument || e, e.head.insertBefore(n, t === "title" ? e.querySelector("head > title") : null);
	}
	function Wf(e, t, n) {
		if (n === 1 || t.itemProp != null) return !1;
		switch (e) {
			case "meta":
			case "title": return !0;
			case "style":
				if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "") break;
				return !0;
			case "link":
				if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError) break;
				switch (t.rel) {
					case "stylesheet": return e = t.disabled, typeof t.precedence == "string" && e == null;
					default: return !0;
				}
			case "script": if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string") return !0;
		}
		return !1;
	}
	function Gf(e) {
		return !(e.type === "stylesheet" && !(e.state.loading & 3));
	}
	function Kf(e, t, n, r) {
		if (n.type === "stylesheet" && (typeof r.media != "string" || !1 !== matchMedia(r.media).matches) && !(n.state.loading & 4)) {
			if (n.instance === null) {
				var i = jf(r.href), a = t.querySelector(Mf(i));
				if (a) {
					t = a._p, typeof t == "object" && t && typeof t.then == "function" && (e.count++, e = Yf.bind(e), t.then(e, e)), n.state.loading |= 4, n.instance = a, gt(a);
					return;
				}
				a = t.ownerDocument || t, r = Nf(r), (i = hf.get(i)) && zf(r, i), a = a.createElement("link"), gt(a);
				var o = a;
				o._p = new Promise(function(e, t) {
					o.onload = e, o.onerror = t;
				}), Fd(a, "link", r), n.instance = a;
			}
			e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(n, t), (t = n.state.preload) && !(n.state.loading & 3) && (e.count++, n = Yf.bind(e), t.addEventListener("load", n), t.addEventListener("error", n));
		}
	}
	var qf = 0;
	function Jf(e, t) {
		return e.stylesheets && e.count === 0 && Zf(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(n) {
			var r = setTimeout(function() {
				if (e.stylesheets && Zf(e, e.stylesheets), e.unsuspend) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, 6e4 + t);
			0 < e.imgBytes && qf === 0 && (qf = 62500 * Rd());
			var i = setTimeout(function() {
				if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && Zf(e, e.stylesheets), e.unsuspend)) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, (e.imgBytes > qf ? 50 : 800) + t);
			return e.unsuspend = n, function() {
				e.unsuspend = null, clearTimeout(r), clearTimeout(i);
			};
		} : null;
	}
	function Yf() {
		if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
			if (this.stylesheets) Zf(this, this.stylesheets);
			else if (this.unsuspend) {
				var e = this.unsuspend;
				this.unsuspend = null, e();
			}
		}
	}
	var Xf = null;
	function Zf(e, t) {
		e.stylesheets = null, e.unsuspend !== null && (e.count++, Xf = /* @__PURE__ */ new Map(), t.forEach(Qf, e), Xf = null, Yf.call(e));
	}
	function Qf(e, t) {
		if (!(t.state.loading & 4)) {
			var n = Xf.get(e);
			if (n) var r = n.get(null);
			else {
				n = /* @__PURE__ */ new Map(), Xf.set(e, n);
				for (var i = e.querySelectorAll("link[data-precedence],style[data-precedence]"), a = 0; a < i.length; a++) {
					var o = i[a];
					(o.nodeName === "LINK" || o.getAttribute("media") !== "not all") && (n.set(o.dataset.precedence, o), r = o);
				}
				r && n.set(null, r);
			}
			i = t.instance, o = i.getAttribute("data-precedence"), a = n.get(o) || r, a === r && n.set(null, i), n.set(o, i), this.count++, r = Yf.bind(this), i.addEventListener("load", r), i.addEventListener("error", r), a ? a.parentNode.insertBefore(i, a.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(i, e.firstChild)), t.state.loading |= 4;
		}
	}
	var $f = {
		$$typeof: C,
		Provider: null,
		Consumer: null,
		_currentValue: te,
		_currentValue2: te,
		_threadCount: 0
	};
	function ep(e, t, n, r, i, a, o, s, c) {
		this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = Ke(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Ke(0), this.hiddenUpdates = Ke(null), this.identifierPrefix = r, this.onUncaughtError = i, this.onCaughtError = a, this.onRecoverableError = o, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = c, this.incompleteTransitions = /* @__PURE__ */ new Map();
	}
	function tp(e, t, n, r, i, a, o, s, c, l, u, d) {
		return e = new ep(e, t, n, o, c, l, u, d, s), t = 1, !0 === a && (t |= 24), a = ti(3, null, null, t), e.current = a, a.stateNode = e, t = ta(), t.refCount++, e.pooledCache = t, t.refCount++, a.memoizedState = {
			element: r,
			isDehydrated: n,
			cache: t
		}, Pa(a), e;
	}
	function np(e) {
		return e ? (e = $r, e) : $r;
	}
	function rp(e, t, n, r, i, a) {
		i = np(i), r.context === null ? r.context = i : r.pendingContext = i, r = q(t), r.payload = { element: n }, a = a === void 0 ? null : a, a !== null && (r.callback = a), n = Ia(e, r, t), n !== null && (mu(n, e, t), La(n, e, t));
	}
	function ip(e, t) {
		if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
			var n = e.retryLane;
			e.retryLane = n !== 0 && n < t ? n : t;
		}
	}
	function ap(e, t) {
		ip(e, t), (e = e.alternate) && ip(e, t);
	}
	function op(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = Xr(e, 67108864);
			t !== null && mu(t, e, 67108864), ap(e, 67108864);
		}
	}
	function sp(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = fu();
			t = Qe(t);
			var n = Xr(e, t);
			n !== null && mu(n, e, t), ap(e, t);
		}
	}
	var cp = !0;
	function lp(e, t, n, r) {
		var i = F.T;
		F.T = null;
		var a = I.p;
		try {
			I.p = 2, dp(e, t, n, r);
		} finally {
			I.p = a, F.T = i;
		}
	}
	function up(e, t, n, r) {
		var i = F.T;
		F.T = null;
		var a = I.p;
		try {
			I.p = 8, dp(e, t, n, r);
		} finally {
			I.p = a, F.T = i;
		}
	}
	function dp(e, t, n, r) {
		if (cp) {
			var i = fp(r);
			if (i === null) wd(e, t, r, pp, n), wp(e, r);
			else if (Ep(i, e, t, n, r)) r.stopPropagation();
			else if (wp(e, r), t & 4 && -1 < Cp.indexOf(e)) {
				for (; i !== null;) {
					var a = pt(i);
					if (a !== null) switch (a.tag) {
						case 3:
							if (a = a.stateNode, a.current.memoizedState.isDehydrated) {
								var o = Ve(a.pendingLanes);
								if (o !== 0) {
									var s = a;
									for (s.pendingLanes |= 2, s.entangledLanes |= 2; o;) {
										var c = 1 << 31 - Pe(o);
										s.entanglements[1] |= c, o &= ~c;
									}
									rd(a), !(Fl & 6) && (eu = Se() + 500, id(0, !1));
								}
							}
							break;
						case 31:
						case 13: s = Xr(a, 2), s !== null && mu(s, a, 2), yu(), ap(a, 2);
					}
					if (a = fp(r), a === null && wd(e, t, r, pp, n), a === i) break;
					i = a;
				}
				i !== null && r.stopPropagation();
			} else wd(e, t, r, null, n);
		}
	}
	function fp(e) {
		return e = Xt(e), mp(e);
	}
	var pp = null;
	function mp(e) {
		if (pp = null, e = ft(e), e !== null) {
			var t = o(e);
			if (t === null) e = null;
			else {
				var n = t.tag;
				if (n === 13) {
					if (e = s(t), e !== null) return e;
					e = null;
				} else if (n === 31) {
					if (e = c(t), e !== null) return e;
					e = null;
				} else if (n === 3) {
					if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
					e = null;
				} else t !== e && (e = null);
			}
		}
		return pp = e, null;
	}
	function hp(e) {
		switch (e) {
			case "beforetoggle":
			case "cancel":
			case "click":
			case "close":
			case "contextmenu":
			case "copy":
			case "cut":
			case "auxclick":
			case "dblclick":
			case "dragend":
			case "dragstart":
			case "drop":
			case "focusin":
			case "focusout":
			case "input":
			case "invalid":
			case "keydown":
			case "keypress":
			case "keyup":
			case "mousedown":
			case "mouseup":
			case "paste":
			case "pause":
			case "play":
			case "pointercancel":
			case "pointerdown":
			case "pointerup":
			case "ratechange":
			case "reset":
			case "resize":
			case "seeked":
			case "submit":
			case "toggle":
			case "touchcancel":
			case "touchend":
			case "touchstart":
			case "volumechange":
			case "change":
			case "selectionchange":
			case "textInput":
			case "compositionstart":
			case "compositionend":
			case "compositionupdate":
			case "beforeblur":
			case "afterblur":
			case "beforeinput":
			case "blur":
			case "fullscreenchange":
			case "focus":
			case "hashchange":
			case "popstate":
			case "select":
			case "selectstart": return 2;
			case "drag":
			case "dragenter":
			case "dragexit":
			case "dragleave":
			case "dragover":
			case "mousemove":
			case "mouseout":
			case "mouseover":
			case "pointermove":
			case "pointerout":
			case "pointerover":
			case "scroll":
			case "touchmove":
			case "wheel":
			case "mouseenter":
			case "mouseleave":
			case "pointerenter":
			case "pointerleave": return 8;
			case "message": switch (Ce()) {
				case we: return 2;
				case Te: return 8;
				case Ee:
				case De: return 32;
				case Oe: return 268435456;
				default: return 32;
			}
			default: return 32;
		}
	}
	var gp = !1, _p = null, vp = null, yp = null, bp = /* @__PURE__ */ new Map(), xp = /* @__PURE__ */ new Map(), Sp = [], Cp = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
	function wp(e, t) {
		switch (e) {
			case "focusin":
			case "focusout":
				_p = null;
				break;
			case "dragenter":
			case "dragleave":
				vp = null;
				break;
			case "mouseover":
			case "mouseout":
				yp = null;
				break;
			case "pointerover":
			case "pointerout":
				bp.delete(t.pointerId);
				break;
			case "gotpointercapture":
			case "lostpointercapture": xp.delete(t.pointerId);
		}
	}
	function Tp(e, t, n, r, i, a) {
		return e === null || e.nativeEvent !== a ? (e = {
			blockedOn: t,
			domEventName: n,
			eventSystemFlags: r,
			nativeEvent: a,
			targetContainers: [i]
		}, t !== null && (t = pt(t), t !== null && op(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, i !== null && t.indexOf(i) === -1 && t.push(i), e);
	}
	function Ep(e, t, n, r, i) {
		switch (t) {
			case "focusin": return _p = Tp(_p, e, t, n, r, i), !0;
			case "dragenter": return vp = Tp(vp, e, t, n, r, i), !0;
			case "mouseover": return yp = Tp(yp, e, t, n, r, i), !0;
			case "pointerover":
				var a = i.pointerId;
				return bp.set(a, Tp(bp.get(a) || null, e, t, n, r, i)), !0;
			case "gotpointercapture": return a = i.pointerId, xp.set(a, Tp(xp.get(a) || null, e, t, n, r, i)), !0;
		}
		return !1;
	}
	function Dp(e) {
		var t = ft(e.target);
		if (t !== null) {
			var n = o(t);
			if (n !== null) {
				if (t = n.tag, t === 13) {
					if (t = s(n), t !== null) {
						e.blockedOn = t, tt(e.priority, function() {
							sp(n);
						});
						return;
					}
				} else if (t === 31) {
					if (t = c(n), t !== null) {
						e.blockedOn = t, tt(e.priority, function() {
							sp(n);
						});
						return;
					}
				} else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
					e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
					return;
				}
			}
		}
		e.blockedOn = null;
	}
	function Op(e) {
		if (e.blockedOn !== null) return !1;
		for (var t = e.targetContainers; 0 < t.length;) {
			var n = fp(e.nativeEvent);
			if (n === null) {
				n = e.nativeEvent;
				var r = new n.constructor(n.type, n);
				Yt = r, n.target.dispatchEvent(r), Yt = null;
			} else return t = pt(n), t !== null && op(t), e.blockedOn = n, !1;
			t.shift();
		}
		return !0;
	}
	function kp(e, t, n) {
		Op(e) && n.delete(t);
	}
	function Ap() {
		gp = !1, _p !== null && Op(_p) && (_p = null), vp !== null && Op(vp) && (vp = null), yp !== null && Op(yp) && (yp = null), bp.forEach(kp), xp.forEach(kp);
	}
	function jp(e, n) {
		e.blockedOn === n && (e.blockedOn = null, gp || (gp = !0, t.unstable_scheduleCallback(t.unstable_NormalPriority, Ap)));
	}
	var Mp = null;
	function Np(e) {
		Mp !== e && (Mp = e, t.unstable_scheduleCallback(t.unstable_NormalPriority, function() {
			Mp === e && (Mp = null);
			for (var t = 0; t < e.length; t += 3) {
				var n = e[t], r = e[t + 1], i = e[t + 2];
				if (typeof r != "function") {
					if (mp(r || n) === null) continue;
					break;
				}
				var a = pt(n);
				a !== null && (e.splice(t, 3), t -= 3, vs(a, {
					pending: !0,
					data: i,
					method: n.method,
					action: r
				}, r, i));
			}
		}));
	}
	function Pp(e) {
		function t(t) {
			return jp(t, e);
		}
		_p !== null && jp(_p, e), vp !== null && jp(vp, e), yp !== null && jp(yp, e), bp.forEach(t), xp.forEach(t);
		for (var n = 0; n < Sp.length; n++) {
			var r = Sp[n];
			r.blockedOn === e && (r.blockedOn = null);
		}
		for (; 0 < Sp.length && (n = Sp[0], n.blockedOn === null);) Dp(n), n.blockedOn === null && Sp.shift();
		if (n = (e.ownerDocument || e).$$reactFormReplay, n != null) for (r = 0; r < n.length; r += 3) {
			var i = n[r], a = n[r + 1], o = i[it] || null;
			if (typeof a == "function") o || Np(n);
			else if (o) {
				var s = null;
				if (a && a.hasAttribute("formAction")) {
					if (i = a, o = a[it] || null) s = o.formAction;
					else if (mp(i) !== null) continue;
				} else s = o.action;
				typeof s == "function" ? n[r + 1] = s : (n.splice(r, 3), r -= 3), Np(n);
			}
		}
	}
	function Fp() {
		function e(e) {
			e.canIntercept && e.info === "react-transition" && e.intercept({
				handler: function() {
					return new Promise(function(e) {
						return i = e;
					});
				},
				focusReset: "manual",
				scroll: "manual"
			});
		}
		function t() {
			i !== null && (i(), i = null), r || setTimeout(n, 20);
		}
		function n() {
			if (!r && !navigation.transition) {
				var e = navigation.currentEntry;
				e && e.url != null && navigation.navigate(e.url, {
					state: e.getState(),
					info: "react-transition",
					history: "replace"
				});
			}
		}
		if (typeof navigation == "object") {
			var r = !1, i = null;
			return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(n, 100), function() {
				r = !0, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), i !== null && (i(), i = null);
			};
		}
	}
	function Ip(e) {
		this._internalRoot = e;
	}
	Lp.prototype.render = Ip.prototype.render = function(e) {
		var t = this._internalRoot;
		if (t === null) throw Error(i(409));
		var n = t.current;
		rp(n, fu(), e, t, null, null);
	}, Lp.prototype.unmount = Ip.prototype.unmount = function() {
		var e = this._internalRoot;
		if (e !== null) {
			this._internalRoot = null;
			var t = e.containerInfo;
			rp(e.current, 2, null, e, null, null), yu(), t[at] = null;
		}
	};
	function Lp(e) {
		this._internalRoot = e;
	}
	Lp.prototype.unstable_scheduleHydration = function(e) {
		if (e) {
			var t = et();
			e = {
				blockedOn: null,
				target: e,
				priority: t
			};
			for (var n = 0; n < Sp.length && t !== 0 && t < Sp[n].priority; n++);
			Sp.splice(n, 0, e), n === 0 && Dp(e);
		}
	};
	var Rp = n.version;
	if (Rp !== "19.2.8") throw Error(i(527, Rp, "19.2.8"));
	I.findDOMNode = function(e) {
		var t = e._reactInternals;
		if (t === void 0) throw typeof e.render == "function" ? Error(i(188)) : (e = Object.keys(e).join(","), Error(i(268, e)));
		return e = d(t), e = e === null ? null : p(e), e = e === null ? null : e.stateNode, e;
	};
	var zp = {
		bundleType: 0,
		version: "19.2.8",
		rendererPackageName: "react-dom",
		currentDispatcherRef: F,
		reconcilerVersion: "19.2.8"
	};
	if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
		var Bp = __REACT_DEVTOOLS_GLOBAL_HOOK__;
		if (!Bp.isDisabled && Bp.supportsFiber) try {
			je = Bp.inject(zp), Me = Bp;
		} catch {}
	}
	e.createRoot = function(e, t) {
		if (!a(e)) throw Error(i(299));
		var n = !1, r = "", o = Vs, s = Hs, c = Us;
		return t != null && (!0 === t.unstable_strictMode && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onUncaughtError !== void 0 && (o = t.onUncaughtError), t.onCaughtError !== void 0 && (s = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError)), t = tp(e, 1, !1, null, null, n, r, null, o, s, c, Fp), e[at] = t.current, Sd(e), new Ip(t);
	};
})), g = /* @__PURE__ */ o(((e, t) => {
	function n() {
		if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = h();
}));
//#endregion
//#region node_modules/.pnpm/@floating-ui+utils@0.2.12/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs
function _() {
	return typeof window < "u";
}
function v(e) {
	var t;
	return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function y(e) {
	return _() ? e instanceof Element || e instanceof v(e).Element : !1;
}
function b(e) {
	return _() ? e instanceof HTMLElement || e instanceof v(e).HTMLElement : !1;
}
function x(e) {
	return !_() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof v(e).ShadowRoot;
}
function S(e) {
	return v(e).getComputedStyle(e);
}
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/safeReact.mjs
var C = /* @__PURE__ */ c(f(), 1), w = { ...C }, T = {};
function E(e, t) {
	let n = C.useRef(T);
	return n.current === T && (n.current = e(t)), n;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/useStableCallback.mjs
var D = w.useInsertionEffect, O = D && D !== w.useLayoutEffect ? D : (e) => e();
function k(e) {
	let t = E(A).current;
	return t.next = e, O(t.effect), t.trampoline;
}
function A() {
	let e = {
		next: void 0,
		callback: j,
		trampoline: (...t) => e.callback?.(...t),
		effect: () => {
			e.callback = e.next;
		}
	};
	return e;
}
function j() {}
var M = typeof document < "u" ? C.useLayoutEffect : () => {};
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/mergeObjects.mjs
function N(e, t) {
	if (e && !t) return e;
	if (!e && t) return t;
	if (e || t) return {
		...e,
		...t
	};
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/merge-props/mergeProps.mjs
var P = {};
function ee(e, t, n, r, i) {
	if (!n && !r && !i && !e) return I(t);
	let a = I(e);
	return t && (a = te(a, t)), n && (a = te(a, n)), r && (a = te(a, r)), i && (a = te(a, i)), a;
}
function F(e) {
	if (e.length === 0) return P;
	if (e.length === 1) return I(e[0]);
	let t = I(e[0]);
	for (let n = 1; n < e.length; n += 1) t = te(t, e[n]);
	return t;
}
function I(e) {
	return R(e) ? { ...z(e, P) } : ne(e);
}
function te(e, t) {
	return R(t) ? z(t, e) : re(e, t);
}
function ne(e) {
	let t = { ...e };
	for (let e in t) {
		let n = t[e];
		L(e, n) && (t[e] = B(n));
	}
	return t;
}
function re(e, t) {
	if (!t) return e;
	for (let n in t) {
		let r = t[n];
		switch (n) {
			case "style":
				e[n] = N(e.style, r);
				break;
			case "className":
				e[n] = oe(e.className, r);
				break;
			default: e[n] = L(n, r) ? ie(e[n], r) : r;
		}
	}
	return e;
}
function L(e, t) {
	let n = e.charCodeAt(0), r = e.charCodeAt(1), i = e.charCodeAt(2);
	return n === 111 && r === 110 && i >= 65 && i <= 90 && (typeof t == "function" || t === void 0);
}
function R(e) {
	return typeof e == "function";
}
function z(e, t) {
	return R(e) ? e(t) : e ?? P;
}
function ie(e, t) {
	return t ? e ? (...n) => {
		let r = n[0];
		if (se(r)) {
			let i = r;
			ae(i);
			let a = t(...n);
			return i.baseUIHandlerPrevented || e?.(...n), a;
		}
		let i = t(...n);
		return e?.(...n), i;
	} : B(t) : e;
}
function B(e) {
	return e && ((...t) => {
		let n = t[0];
		return se(n) && ae(n), e(...t);
	});
}
function ae(e) {
	return e.preventBaseUIHandler = () => {
		e.baseUIHandlerPrevented = !0;
	}, e;
}
function oe(e, t) {
	return t ? e ? t + " " + e : t : e;
}
function se(e) {
	return typeof e == "object" && !!e && "nativeEvent" in e;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/formatErrorMessage.mjs
function ce(e, t) {
	return function(n, ...r) {
		let i = new URL(e);
		return i.searchParams.set("code", n.toString()), r.forEach((e) => i.searchParams.append("args[]", e)), `${t} error #${n}; visit ${i} for the full message.`;
	};
}
var V = ce("https://base-ui.com/production-error", "Base UI"), le = /*#__PURE__*/ C.createContext(void 0);
function ue(e = !1) {
	let t = C.useContext(le);
	if (t === void 0 && !e) throw Error(V(16));
	return t;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/useFocusableWhenDisabled.mjs
function de(e) {
	let { focusableWhenDisabled: t, disabled: n, composite: r = !1, tabIndex: i = 0, isNativeButton: a } = e, o = r && t !== !1, s = r && t === !1;
	return { props: C.useMemo(() => {
		let e = { onKeyDown(e) {
			n && t && e.key !== "Tab" && e.preventDefault();
		} };
		return r || (e.tabIndex = i, !a && n && (e.tabIndex = t ? i : -1)), (a && (t || o) || !a && n) && (e["aria-disabled"] = n), a && (!t || s) && (e.disabled = n), e;
	}, [
		r,
		n,
		t,
		o,
		s,
		a,
		i
	]) };
}
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/owner.mjs
function fe(e) {
	return e?.ownerDocument || document;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/dispatchClickWithModifiers.mjs
function pe(e, t, { detail: n = 0 } = {}) {
	e.dispatchEvent(new (v(e)).PointerEvent("click", {
		bubbles: !0,
		cancelable: !0,
		composed: !0,
		detail: n,
		shiftKey: t.shiftKey,
		ctrlKey: t.ctrlKey,
		altKey: t.altKey,
		metaKey: t.metaKey
	}));
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/use-button/useButton.mjs
function me(e = {}) {
	let { disabled: t = !1, focusableWhenDisabled: n, tabIndex: r = 0, native: i = !0, composite: a } = e, o = C.useRef(null), s = ue(!0), c = a ?? s !== void 0, { props: l } = de({
		focusableWhenDisabled: n,
		disabled: t,
		composite: c,
		tabIndex: r,
		isNativeButton: i
	}), u = C.useCallback(() => {
		let e = o.current;
		he(e) && c && t && l.disabled === void 0 && e.disabled && (e.disabled = !1);
	}, [
		t,
		l.disabled,
		c
	]);
	return M(u, [u]), {
		getButtonProps: C.useCallback((e = {}) => {
			let { onClick: n, onMouseDown: r, onKeyUp: a, onKeyDown: o, onPointerDown: s, ...u } = e;
			return ee({
				onClick(e) {
					if (t) {
						e.preventDefault();
						return;
					}
					n?.(e);
				},
				onMouseDown(e) {
					t || r?.(e);
				},
				onKeyDown(e) {
					if (t || (ae(e), o?.(e), e.baseUIHandlerPrevented)) return;
					let n = e.target === e.currentTarget, r = e.currentTarget, a = he(r), s = !i && ge(r), l = n && (i ? a : !s), u = e.key === "Enter", d = e.key === " ", f = r.getAttribute("role"), p = f?.startsWith("menuitem") || f === "option" || f === "gridcell";
					if (n && c && d) {
						if (e.defaultPrevented && p) return;
						e.preventDefault(), (!i || a) && (e.preventBaseUIHandler(), pe(r, e));
						return;
					}
					if (!l || i || !d && !u) {
						n && s && d && e.preventDefault();
						return;
					}
					e.defaultPrevented || (e.preventDefault(), u && (e.preventBaseUIHandler(), pe(r, e)));
				},
				onKeyUp(e) {
					if (!t) {
						if (ae(e), a?.(e), e.target === e.currentTarget && i && c && he(e.currentTarget) && e.key === " ") {
							e.preventDefault();
							return;
						}
						e.baseUIHandlerPrevented || e.target === e.currentTarget && !i && !c && !e.defaultPrevented && e.key === " " && (e.preventBaseUIHandler(), pe(e.currentTarget, e));
					}
				},
				onPointerDown(e) {
					if (t) {
						e.preventDefault();
						return;
					}
					s?.(e);
				}
			}, i ? { type: "button" } : { role: "button" }, l, u);
		}, [
			t,
			l,
			c,
			i
		]),
		buttonRef: k((e) => {
			o.current = e, u();
		})
	};
}
function he(e) {
	return b(e) && e.tagName === "BUTTON";
}
function ge(e) {
	return b(e) && e.tagName === "A" && !!e.href;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/useMergedRefs.mjs
function _e(e, t, n, r) {
	let i = E(ye).current;
	return be(i, e, t, n, r) && Se(i, [
		e,
		t,
		n,
		r
	]), i.callback;
}
function ve(e) {
	let t = E(ye).current;
	return xe(t, e) && Se(t, e), t.callback;
}
function ye() {
	return {
		callback: null,
		cleanup: null,
		refs: []
	};
}
function be(e, t, n, r, i) {
	return e.refs[0] !== t || e.refs[1] !== n || e.refs[2] !== r || e.refs[3] !== i;
}
function xe(e, t) {
	return e.refs.length !== t.length || e.refs.some((e, n) => e !== t[n]);
}
function Se(e, t) {
	if (e.refs = t, t.every((e) => e == null)) {
		e.callback = null;
		return;
	}
	e.callback = (n) => {
		if (e.cleanup &&= (e.cleanup(), null), n != null) {
			let r = Array(t.length).fill(null);
			for (let e = 0; e < t.length; e += 1) {
				let i = t[e];
				if (i != null) switch (typeof i) {
					case "function": {
						let t = i(n);
						typeof t == "function" && (r[e] = t);
						break;
					}
					case "object": i.current = n;
				}
			}
			e.cleanup = () => {
				for (let e = 0; e < t.length; e += 1) {
					let n = t[e];
					if (n != null) switch (typeof n) {
						case "function": {
							let t = r[e];
							typeof t == "function" ? t() : n(null);
							break;
						}
						case "object": n.current = null;
					}
				}
			};
		}
	};
}
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/reactVersion.mjs
var Ce = 19;
function we(e) {
	return Ce >= e;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/getReactElementRef.mjs
function Te(e) {
	if (!/*#__PURE__*/ C.isValidElement(e)) return null;
	let t = e, n = t.props;
	return (we(19) ? n?.ref : t.ref) ?? null;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/empty.mjs
function Ee() {}
var De = Object.freeze([]), Oe = Object.freeze({});
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/getStateAttributesProps.mjs
function ke(e, t) {
	let n = {};
	for (let r in e) {
		let i = e[r];
		if (t?.hasOwnProperty(r)) {
			let e = t[r](i);
			e != null && Object.assign(n, e);
			continue;
		}
		i === !0 ? n[`data-${r.toLowerCase()}`] = "" : i && (n[`data-${r.toLowerCase()}`] = i.toString());
	}
	return n;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/resolveClassName.mjs
function Ae(e, t) {
	return typeof e == "function" ? e(t) : e;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/resolveStyle.mjs
function je(e, t) {
	return typeof e == "function" ? e(t) : e;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/useRenderElement.mjs
function Me(e, t, n = {}) {
	let r = t.render, i = Ne(t, n);
	return n.enabled === !1 ? null : Ie(e, r, i, n.state ?? Oe);
}
function Ne(e, t = {}) {
	let { className: n, style: r, render: i } = e, { state: a = Oe, ref: o, props: s, stateAttributesMapping: c, enabled: l = !0 } = t, u = l ? Ae(n, a) : void 0, d = l ? je(r, a) : void 0, f = l ? ke(a, c) : Oe, p = l && s ? Pe(s) : void 0, m = l ? N(f, p) ?? {} : Oe;
	return typeof document < "u" && (l ? m.ref = Array.isArray(o) ? ve([
		m.ref,
		Te(i),
		...o
	]) : _e(m.ref, Te(i), o) : _e(null, null)), l ? (u !== void 0 && (m.className = oe(m.className, u)), d !== void 0 && (m.style = N(m.style, d)), m) : Oe;
}
function Pe(e) {
	return Array.isArray(e) ? F(e) : ee(void 0, e);
}
var Fe = Symbol.for("react.lazy");
function Ie(e, t, n, r) {
	if (t) {
		if (typeof t == "function") return t(n, r);
		let e = ee(n, t.props);
		e.ref = n.ref;
		let i = t;
		return i?.$$typeof === Fe && (i = C.Children.toArray(t)[0]), /*#__PURE__*/ C.cloneElement(i, e);
	}
	if (e && typeof e == "string") return Le(e, n);
	throw Error(V(8));
}
function Le(e, t) {
	return e === "button" ? /*#__PURE__*/ (0, C.createElement)("button", {
		type: "button",
		...t,
		key: t.key
	}) : e === "img" ? /*#__PURE__*/ (0, C.createElement)("img", {
		alt: "",
		...t,
		key: t.key
	}) : /*#__PURE__*/ C.createElement(e, t);
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/button/Button.mjs
var Re = /*#__PURE__*/ C.forwardRef(function(e, t) {
	let { render: n, className: r, disabled: i = !1, focusableWhenDisabled: a = !1, nativeButton: o = !0, style: s, ...c } = e, { getButtonProps: l, buttonRef: u } = me({
		disabled: i,
		focusableWhenDisabled: a,
		native: o
	});
	return Me("button", e, {
		state: { disabled: i },
		ref: [t, u],
		props: [c, l]
	});
}), ze = g();
function Be(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") {
		if (Array.isArray(e)) {
			var i = e.length;
			for (t = 0; t < i; t++) e[t] && (n = Be(e[t])) && (r && (r += " "), r += n);
		} else for (n in e) e[n] && (r && (r += " "), r += n);
	}
	return r;
}
function Ve() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = Be(e)) && (r && (r += " "), r += t);
	return r;
}
//#endregion
//#region node_modules/.pnpm/class-variance-authority@0.7.1/node_modules/class-variance-authority/dist/index.mjs
var He = (e) => typeof e == "boolean" ? `${e}` : e === 0 ? "0" : e, Ue = Ve, We = (e, t) => (n) => {
	if (t?.variants == null) return Ue(e, n?.class, n?.className);
	let { variants: r, defaultVariants: i } = t, a = Object.keys(r).map((e) => {
		let t = n?.[e], a = i?.[e];
		if (t === null) return null;
		let o = He(t) || He(a);
		return r[e][o];
	}), o = n && Object.entries(n).reduce((e, t) => {
		let [n, r] = t;
		return r === void 0 || (e[n] = r), e;
	}, {});
	return Ue(e, a, t?.compoundVariants?.reduce((e, t) => {
		let { class: n, className: r, ...a } = t;
		return Object.entries(a).every((e) => {
			let [t, n] = e;
			return Array.isArray(n) ? n.includes({
				...i,
				...o
			}[t]) : {
				...i,
				...o
			}[t] === n;
		}) ? [
			...e,
			n,
			r
		] : e;
	}, []), n?.class, n?.className);
}, Ge = (e, t) => {
	let n = Array(e.length + t.length);
	for (let t = 0; t < e.length; t++) n[t] = e[t];
	for (let r = 0; r < t.length; r++) n[e.length + r] = t[r];
	return n;
}, Ke = (e, t) => ({
	classGroupId: e,
	validator: t
}), qe = (e = /* @__PURE__ */ new Map(), t = null, n) => ({
	nextPart: e,
	validators: t,
	classGroupId: n
}), Je = "-", Ye = [], Xe = "arbitrary..", Ze = (e) => {
	let t = et(e), { conflictingClassGroups: n, conflictingClassGroupModifiers: r } = e;
	return {
		getClassGroupId: (e) => {
			if (e.startsWith("[") && e.endsWith("]")) return $e(e);
			let n = e.split(Je);
			return Qe(n, +(n[0] === "" && n.length > 1), t);
		},
		getConflictingClassGroupIds: (e, t) => {
			if (t) {
				let t = r[e], i = n[e];
				return t ? i ? Ge(i, t) : t : i || Ye;
			}
			return n[e] || Ye;
		}
	};
}, Qe = (e, t, n) => {
	if (e.length - t === 0) return n.classGroupId;
	let r = e[t], i = n.nextPart.get(r);
	if (i) {
		let n = Qe(e, t + 1, i);
		if (n) return n;
	}
	let a = n.validators;
	if (a === null) return;
	let o = t === 0 ? e.join(Je) : e.slice(t).join(Je), s = a.length;
	for (let e = 0; e < s; e++) {
		let t = a[e];
		if (t.validator(o)) return t.classGroupId;
	}
}, $e = (e) => e.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
	let t = e.slice(1, -1), n = t.indexOf(":"), r = t.slice(0, n);
	return r ? Xe + r : void 0;
})(), et = (e) => {
	let { theme: t, classGroups: n } = e;
	return tt(n, t);
}, tt = (e, t) => {
	let n = qe();
	for (let r in e) {
		let i = e[r];
		nt(i, n, r, t);
	}
	return n;
}, nt = (e, t, n, r) => {
	let i = e.length;
	for (let a = 0; a < i; a++) {
		let i = e[a];
		rt(i, t, n, r);
	}
}, rt = (e, t, n, r) => {
	if (typeof e == "string") {
		it(e, t, n);
		return;
	}
	if (typeof e == "function") {
		at(e, t, n, r);
		return;
	}
	ot(e, t, n, r);
}, it = (e, t, n) => {
	let r = e === "" ? t : st(t, e);
	r.classGroupId = n;
}, at = (e, t, n, r) => {
	if (ct(e)) {
		nt(e(r), t, n, r);
		return;
	}
	t.validators === null && (t.validators = []), t.validators.push(Ke(n, e));
}, ot = (e, t, n, r) => {
	let i = Object.entries(e), a = i.length;
	for (let e = 0; e < a; e++) {
		let [a, o] = i[e];
		nt(o, st(t, a), n, r);
	}
}, st = (e, t) => {
	let n = e, r = t.split(Je), i = r.length;
	for (let e = 0; e < i; e++) {
		let t = r[e], i = n.nextPart.get(t);
		i || (i = qe(), n.nextPart.set(t, i)), n = i;
	}
	return n;
}, ct = (e) => "isThemeGetter" in e && e.isThemeGetter === !0, lt = (e) => {
	if (e < 1) return {
		get: () => void 0,
		set: () => {}
	};
	let t = 0, n = Object.create(null), r = Object.create(null), i = (i, a) => {
		n[i] = a, t++, t > e && (t = 0, r = n, n = Object.create(null));
	};
	return {
		get(e) {
			let t = n[e];
			if (t !== void 0) return t;
			if ((t = r[e]) !== void 0) return i(e, t), t;
		},
		set(e, t) {
			e in n ? n[e] = t : i(e, t);
		}
	};
}, ut = "!", dt = ":", ft = [], pt = (e, t, n, r, i) => ({
	modifiers: e,
	hasImportantModifier: t,
	baseClassName: n,
	maybePostfixModifierPosition: r,
	isExternal: i
}), mt = (e) => {
	let { prefix: t, experimentalParseClassName: n } = e, r = (e) => {
		let t = [], n = 0, r = 0, i = 0, a, o = e.length;
		for (let s = 0; s < o; s++) {
			let o = e[s];
			if (n === 0 && r === 0) {
				if (o === dt) {
					t.push(e.slice(i, s)), i = s + 1;
					continue;
				}
				if (o === "/") {
					a = s;
					continue;
				}
			}
			o === "[" ? n++ : o === "]" ? n-- : o === "(" ? r++ : o === ")" && r--;
		}
		let s = t.length === 0 ? e : e.slice(i), c = s, l = !1;
		s.endsWith(ut) ? (c = s.slice(0, -1), l = !0) : s.startsWith(ut) && (c = s.slice(1), l = !0);
		let u = a && a > i ? a - i : void 0;
		return pt(t, l, c, u);
	};
	if (t) {
		let e = t + dt, n = r;
		r = (t) => t.startsWith(e) ? n(t.slice(e.length)) : pt(ft, !1, t, void 0, !0);
	}
	if (n) {
		let e = r;
		r = (t) => n({
			className: t,
			parseClassName: e
		});
	}
	return r;
}, ht = (e) => {
	let t = /* @__PURE__ */ new Map();
	return e.orderSensitiveModifiers.forEach((e, n) => {
		t.set(e, 1e6 + n);
	}), (e) => {
		let n = [], r = [];
		for (let i = 0; i < e.length; i++) {
			let a = e[i], o = a[0] === "[", s = t.has(a);
			o || s ? (r.length > 0 && (r.sort(), n.push(...r), r = []), n.push(a)) : r.push(a);
		}
		return r.length > 0 && (r.sort(), n.push(...r)), n;
	};
}, gt = (e) => ({
	cache: lt(e.cacheSize),
	parseClassName: mt(e),
	sortModifiers: ht(e),
	postfixLookupClassGroupIds: _t(e),
	...Ze(e)
}), _t = (e) => {
	let t = Object.create(null), n = e.postfixLookupClassGroups;
	if (n) for (let e = 0; e < n.length; e++) t[n[e]] = !0;
	return t;
}, vt = /\s+/, yt = (e, t) => {
	let { parseClassName: n, getClassGroupId: r, getConflictingClassGroupIds: i, sortModifiers: a, postfixLookupClassGroupIds: o } = t, s = [], c = e.trim().split(vt), l = "";
	for (let e = c.length - 1; e >= 0; --e) {
		let t = c[e], { isExternal: u, modifiers: d, hasImportantModifier: f, baseClassName: p, maybePostfixModifierPosition: m } = n(t);
		if (u) {
			l = t + (l.length > 0 ? " " + l : l);
			continue;
		}
		let h = !!m, g;
		if (h) {
			g = r(p.substring(0, m));
			let e = g && o[g] ? r(p) : void 0;
			e && e !== g && (g = e, h = !1);
		} else g = r(p);
		if (!g) {
			if (!h) {
				l = t + (l.length > 0 ? " " + l : l);
				continue;
			}
			if (g = r(p), !g) {
				l = t + (l.length > 0 ? " " + l : l);
				continue;
			}
			h = !1;
		}
		let _ = d.length === 0 ? "" : d.length === 1 ? d[0] : a(d).join(":"), v = f ? _ + ut : _, y = v + g;
		if (s.indexOf(y) > -1) continue;
		s.push(y);
		let b = i(g, h);
		for (let e = 0; e < b.length; ++e) {
			let t = b[e];
			s.push(v + t);
		}
		l = t + (l.length > 0 ? " " + l : l);
	}
	return l;
}, bt = (...e) => {
	let t = 0, n, r, i = "";
	for (; t < e.length;) (n = e[t++]) && (r = xt(n)) && (i && (i += " "), i += r);
	return i;
}, xt = (e) => {
	if (typeof e == "string") return e;
	let t, n = "";
	for (let r = 0; r < e.length; r++) e[r] && (t = xt(e[r])) && (n && (n += " "), n += t);
	return n;
}, St = (e, ...t) => {
	let n, r, i, a, o = (o) => (n = gt(t.reduce((e, t) => t(e), e())), r = n.cache.get, i = n.cache.set, a = s, s(o)), s = (e) => {
		let t = r(e);
		if (t) return t;
		let a = yt(e, n);
		return i(e, a), a;
	};
	return a = o, (...e) => a(bt(...e));
}, Ct = [], wt = (e) => {
	let t = (t) => t[e] || Ct;
	return t.isThemeGetter = !0, t;
}, Tt = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, Et = /^\((?:(\w[\w-]*):)?(.+)\)$/i, Dt = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, Ot = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, kt = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, At = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, jt = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, Mt = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, Nt = (e) => Dt.test(e), H = (e) => !!e && !Number.isNaN(Number(e)), Pt = (e) => !!e && Number.isInteger(Number(e)), Ft = (e) => e.endsWith("%") && H(e.slice(0, -1)), It = (e) => Ot.test(e), Lt = () => !0, Rt = (e) => kt.test(e) && !At.test(e), zt = () => !1, Bt = (e) => jt.test(e), Vt = (e) => Mt.test(e), Ht = (e) => !U(e) && !W(e), Ut = (e) => e.startsWith("@container") && (e[10] === "/" && e[11] !== void 0 || e[11] === "s" && e[16] !== void 0 && e.startsWith("-size/", 10) || e[11] === "n" && e[18] !== void 0 && e.startsWith("-normal/", 10)), Wt = (e) => on(e, un, zt), U = (e) => Tt.test(e), Gt = (e) => on(e, dn, Rt), Kt = (e) => on(e, fn, H), qt = (e) => on(e, mn, Lt), Jt = (e) => on(e, pn, zt), Yt = (e) => on(e, cn, zt), Xt = (e) => on(e, ln, Vt), Zt = (e) => on(e, hn, Bt), W = (e) => Et.test(e), Qt = (e) => sn(e, dn), $t = (e) => sn(e, pn), en = (e) => sn(e, cn), tn = (e) => sn(e, un), nn = (e) => sn(e, ln), rn = (e) => sn(e, hn, !0), an = (e) => sn(e, mn, !0), on = (e, t, n) => {
	let r = Tt.exec(e);
	return r ? r[1] ? t(r[1]) : n(r[2]) : !1;
}, sn = (e, t, n = !1) => {
	let r = Et.exec(e);
	return r ? r[1] ? t(r[1]) : n : !1;
}, cn = (e) => e === "position" || e === "percentage", ln = (e) => e === "image" || e === "url", un = (e) => e === "length" || e === "size" || e === "bg-size", dn = (e) => e === "length", fn = (e) => e === "number", pn = (e) => e === "family-name", mn = (e) => e === "number" || e === "weight", hn = (e) => e === "shadow", gn = /*#__PURE__*/ St(() => {
	let e = wt("color"), t = wt("font"), n = wt("text"), r = wt("font-weight"), i = wt("tracking"), a = wt("leading"), o = wt("breakpoint"), s = wt("container"), c = wt("spacing"), l = wt("radius"), u = wt("shadow"), d = wt("inset-shadow"), f = wt("text-shadow"), p = wt("drop-shadow"), m = wt("blur"), h = wt("perspective"), g = wt("aspect"), _ = wt("ease"), v = wt("animate"), y = () => [
		"auto",
		"avoid",
		"all",
		"avoid-page",
		"page",
		"left",
		"right",
		"column"
	], b = () => [
		"center",
		"top",
		"bottom",
		"left",
		"right",
		"top-left",
		"left-top",
		"top-right",
		"right-top",
		"bottom-right",
		"right-bottom",
		"bottom-left",
		"left-bottom"
	], x = () => [
		...b(),
		W,
		U
	], S = () => [
		"auto",
		"hidden",
		"clip",
		"visible",
		"scroll"
	], C = () => [
		"auto",
		"contain",
		"none"
	], w = () => [
		W,
		U,
		c
	], T = () => [
		Nt,
		"full",
		"auto",
		...w()
	], E = () => [
		Pt,
		"none",
		"subgrid",
		W,
		U
	], D = () => [
		"auto",
		{ span: [
			"full",
			Pt,
			W,
			U
		] },
		Pt,
		W,
		U
	], O = () => [
		Pt,
		"auto",
		W,
		U
	], k = () => [
		"auto",
		"min",
		"max",
		"fr",
		W,
		U
	], A = () => [
		"start",
		"end",
		"center",
		"between",
		"around",
		"evenly",
		"stretch",
		"baseline",
		"center-safe",
		"end-safe"
	], j = () => [
		"start",
		"end",
		"center",
		"stretch",
		"center-safe",
		"end-safe"
	], M = () => ["auto", ...w()], N = () => [
		Nt,
		"auto",
		"full",
		"dvw",
		"dvh",
		"lvw",
		"lvh",
		"svw",
		"svh",
		"min",
		"max",
		"fit",
		...w()
	], P = () => [
		Nt,
		"screen",
		"full",
		"dvw",
		"lvw",
		"svw",
		"min",
		"max",
		"fit",
		...w()
	], ee = () => [
		Nt,
		"screen",
		"full",
		"lh",
		"dvh",
		"lvh",
		"svh",
		"min",
		"max",
		"fit",
		...w()
	], F = () => [
		e,
		W,
		U
	], I = () => [
		...b(),
		en,
		Yt,
		{ position: [W, U] }
	], te = () => ["no-repeat", { repeat: [
		"",
		"x",
		"y",
		"space",
		"round"
	] }], ne = () => [
		"auto",
		"cover",
		"contain",
		tn,
		Wt,
		{ size: [W, U] }
	], re = () => [
		Ft,
		Qt,
		Gt
	], L = () => [
		"",
		"none",
		"full",
		l,
		W,
		U
	], R = () => [
		"",
		H,
		Qt,
		Gt
	], z = () => [
		"solid",
		"dashed",
		"dotted",
		"double"
	], ie = () => [
		"normal",
		"multiply",
		"screen",
		"overlay",
		"darken",
		"lighten",
		"color-dodge",
		"color-burn",
		"hard-light",
		"soft-light",
		"difference",
		"exclusion",
		"hue",
		"saturation",
		"color",
		"luminosity"
	], B = () => [
		H,
		Ft,
		en,
		Yt
	], ae = () => [
		"",
		"none",
		m,
		W,
		U
	], oe = () => [
		"none",
		H,
		W,
		U
	], se = () => [
		"none",
		H,
		W,
		U
	], ce = () => [
		H,
		W,
		U
	], V = () => [
		Nt,
		"full",
		...w()
	];
	return {
		cacheSize: 500,
		theme: {
			animate: [
				"spin",
				"ping",
				"pulse",
				"bounce"
			],
			aspect: ["video"],
			blur: [It],
			breakpoint: [It],
			color: [Lt],
			container: [It],
			"drop-shadow": [It],
			ease: [
				"in",
				"out",
				"in-out"
			],
			font: [Ht],
			"font-weight": [
				"thin",
				"extralight",
				"light",
				"normal",
				"medium",
				"semibold",
				"bold",
				"extrabold",
				"black"
			],
			"inset-shadow": [It],
			leading: [
				"none",
				"tight",
				"snug",
				"normal",
				"relaxed",
				"loose"
			],
			perspective: [
				"dramatic",
				"near",
				"normal",
				"midrange",
				"distant",
				"none"
			],
			radius: [It],
			shadow: [It],
			spacing: ["px", H],
			text: [It],
			"text-shadow": [It],
			tracking: [
				"tighter",
				"tight",
				"normal",
				"wide",
				"wider",
				"widest"
			]
		},
		classGroups: {
			aspect: [{ aspect: [
				"auto",
				"square",
				Nt,
				U,
				W,
				g
			] }],
			container: ["container"],
			"container-type": [{ "@container": [
				"",
				"normal",
				"size",
				W,
				U
			] }],
			"container-named": [Ut],
			columns: [{ columns: [
				H,
				U,
				W,
				s
			] }],
			"break-after": [{ "break-after": y() }],
			"break-before": [{ "break-before": y() }],
			"break-inside": [{ "break-inside": [
				"auto",
				"avoid",
				"avoid-page",
				"avoid-column"
			] }],
			"box-decoration": [{ "box-decoration": ["slice", "clone"] }],
			box: [{ box: ["border", "content"] }],
			display: [
				"block",
				"inline-block",
				"inline",
				"flex",
				"inline-flex",
				"table",
				"inline-table",
				"table-caption",
				"table-cell",
				"table-column",
				"table-column-group",
				"table-footer-group",
				"table-header-group",
				"table-row-group",
				"table-row",
				"flow-root",
				"grid",
				"inline-grid",
				"contents",
				"list-item",
				"hidden"
			],
			sr: ["sr-only", "not-sr-only"],
			float: [{ float: [
				"right",
				"left",
				"none",
				"start",
				"end"
			] }],
			clear: [{ clear: [
				"left",
				"right",
				"both",
				"none",
				"start",
				"end"
			] }],
			isolation: ["isolate", "isolation-auto"],
			"object-fit": [{ object: [
				"contain",
				"cover",
				"fill",
				"none",
				"scale-down"
			] }],
			"object-position": [{ object: x() }],
			overflow: [{ overflow: S() }],
			"overflow-x": [{ "overflow-x": S() }],
			"overflow-y": [{ "overflow-y": S() }],
			overscroll: [{ overscroll: C() }],
			"overscroll-x": [{ "overscroll-x": C() }],
			"overscroll-y": [{ "overscroll-y": C() }],
			position: [
				"static",
				"fixed",
				"absolute",
				"relative",
				"sticky"
			],
			inset: [{ inset: T() }],
			"inset-x": [{ "inset-x": T() }],
			"inset-y": [{ "inset-y": T() }],
			start: [{
				"inset-s": T(),
				start: T()
			}],
			end: [{
				"inset-e": T(),
				end: T()
			}],
			"inset-bs": [{ "inset-bs": T() }],
			"inset-be": [{ "inset-be": T() }],
			top: [{ top: T() }],
			right: [{ right: T() }],
			bottom: [{ bottom: T() }],
			left: [{ left: T() }],
			visibility: [
				"visible",
				"invisible",
				"collapse"
			],
			z: [{ z: [
				Pt,
				"auto",
				W,
				U
			] }],
			basis: [{ basis: [
				Nt,
				"full",
				"auto",
				s,
				...w()
			] }],
			"flex-direction": [{ flex: [
				"row",
				"row-reverse",
				"col",
				"col-reverse"
			] }],
			"flex-wrap": [{ flex: [
				"nowrap",
				"wrap",
				"wrap-reverse"
			] }],
			flex: [{ flex: [
				H,
				Nt,
				"auto",
				"initial",
				"none",
				U
			] }],
			grow: [{ grow: [
				"",
				H,
				W,
				U
			] }],
			shrink: [{ shrink: [
				"",
				H,
				W,
				U
			] }],
			order: [{ order: [
				Pt,
				"first",
				"last",
				"none",
				W,
				U
			] }],
			"grid-cols": [{ "grid-cols": E() }],
			"col-start-end": [{ col: D() }],
			"col-start": [{ "col-start": O() }],
			"col-end": [{ "col-end": O() }],
			"grid-rows": [{ "grid-rows": E() }],
			"row-start-end": [{ row: D() }],
			"row-start": [{ "row-start": O() }],
			"row-end": [{ "row-end": O() }],
			"grid-flow": [{ "grid-flow": [
				"row",
				"col",
				"dense",
				"row-dense",
				"col-dense"
			] }],
			"auto-cols": [{ "auto-cols": k() }],
			"auto-rows": [{ "auto-rows": k() }],
			gap: [{ gap: w() }],
			"gap-x": [{ "gap-x": w() }],
			"gap-y": [{ "gap-y": w() }],
			"justify-content": [{ justify: [...A(), "normal"] }],
			"justify-items": [{ "justify-items": [...j(), "normal"] }],
			"justify-self": [{ "justify-self": ["auto", ...j()] }],
			"align-content": [{ content: ["normal", ...A()] }],
			"align-items": [{ items: [...j(), { baseline: ["", "last"] }] }],
			"align-self": [{ self: [
				"auto",
				...j(),
				{ baseline: ["", "last"] }
			] }],
			"place-content": [{ "place-content": A() }],
			"place-items": [{ "place-items": [...j(), "baseline"] }],
			"place-self": [{ "place-self": ["auto", ...j()] }],
			p: [{ p: w() }],
			px: [{ px: w() }],
			py: [{ py: w() }],
			ps: [{ ps: w() }],
			pe: [{ pe: w() }],
			pbs: [{ pbs: w() }],
			pbe: [{ pbe: w() }],
			pt: [{ pt: w() }],
			pr: [{ pr: w() }],
			pb: [{ pb: w() }],
			pl: [{ pl: w() }],
			m: [{ m: M() }],
			mx: [{ mx: M() }],
			my: [{ my: M() }],
			ms: [{ ms: M() }],
			me: [{ me: M() }],
			mbs: [{ mbs: M() }],
			mbe: [{ mbe: M() }],
			mt: [{ mt: M() }],
			mr: [{ mr: M() }],
			mb: [{ mb: M() }],
			ml: [{ ml: M() }],
			"space-x": [{ "space-x": w() }],
			"space-x-reverse": ["space-x-reverse"],
			"space-y": [{ "space-y": w() }],
			"space-y-reverse": ["space-y-reverse"],
			size: [{ size: N() }],
			"inline-size": [{ inline: ["auto", ...P()] }],
			"min-inline-size": [{ "min-inline": ["auto", ...P()] }],
			"max-inline-size": [{ "max-inline": ["none", ...P()] }],
			"block-size": [{ block: ["auto", ...ee()] }],
			"min-block-size": [{ "min-block": ["auto", ...ee()] }],
			"max-block-size": [{ "max-block": ["none", ...ee()] }],
			w: [{ w: [
				s,
				"screen",
				...N()
			] }],
			"min-w": [{ "min-w": [
				s,
				"screen",
				"none",
				...N()
			] }],
			"max-w": [{ "max-w": [
				s,
				"screen",
				"none",
				"prose",
				{ screen: [o] },
				...N()
			] }],
			h: [{ h: [
				"screen",
				"lh",
				...N()
			] }],
			"min-h": [{ "min-h": [
				"screen",
				"lh",
				"none",
				...N()
			] }],
			"max-h": [{ "max-h": [
				"screen",
				"lh",
				...N()
			] }],
			"font-size": [{ text: [
				"base",
				n,
				Qt,
				Gt
			] }],
			"font-smoothing": ["antialiased", "subpixel-antialiased"],
			"font-style": ["italic", "not-italic"],
			"font-weight": [{ font: [
				r,
				an,
				qt
			] }],
			"font-stretch": [{ "font-stretch": [
				"ultra-condensed",
				"extra-condensed",
				"condensed",
				"semi-condensed",
				"normal",
				"semi-expanded",
				"expanded",
				"extra-expanded",
				"ultra-expanded",
				Ft,
				U
			] }],
			"font-family": [{ font: [
				$t,
				Jt,
				t
			] }],
			"font-features": [{ "font-features": [U] }],
			"fvn-normal": ["normal-nums"],
			"fvn-ordinal": ["ordinal"],
			"fvn-slashed-zero": ["slashed-zero"],
			"fvn-figure": ["lining-nums", "oldstyle-nums"],
			"fvn-spacing": ["proportional-nums", "tabular-nums"],
			"fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
			tracking: [{ tracking: [
				i,
				W,
				U
			] }],
			"line-clamp": [{ "line-clamp": [
				H,
				"none",
				W,
				Kt
			] }],
			leading: [{ leading: [a, ...w()] }],
			"list-image": [{ "list-image": [
				"none",
				W,
				U
			] }],
			"list-style-position": [{ list: ["inside", "outside"] }],
			"list-style-type": [{ list: [
				"disc",
				"decimal",
				"none",
				W,
				U
			] }],
			"text-alignment": [{ text: [
				"left",
				"center",
				"right",
				"justify",
				"start",
				"end"
			] }],
			"placeholder-color": [{ placeholder: F() }],
			"text-color": [{ text: F() }],
			"text-decoration": [
				"underline",
				"overline",
				"line-through",
				"no-underline"
			],
			"text-decoration-style": [{ decoration: [...z(), "wavy"] }],
			"text-decoration-thickness": [{ decoration: [
				H,
				"from-font",
				"auto",
				W,
				Gt
			] }],
			"text-decoration-color": [{ decoration: F() }],
			"underline-offset": [{ "underline-offset": [
				H,
				"auto",
				W,
				U
			] }],
			"text-transform": [
				"uppercase",
				"lowercase",
				"capitalize",
				"normal-case"
			],
			"text-overflow": [
				"truncate",
				"text-ellipsis",
				"text-clip"
			],
			"text-wrap": [{ text: [
				"wrap",
				"nowrap",
				"balance",
				"pretty"
			] }],
			indent: [{ indent: w() }],
			"tab-size": [{ tab: [
				Pt,
				W,
				U
			] }],
			"vertical-align": [{ align: [
				"baseline",
				"top",
				"middle",
				"bottom",
				"text-top",
				"text-bottom",
				"sub",
				"super",
				W,
				U
			] }],
			whitespace: [{ whitespace: [
				"normal",
				"nowrap",
				"pre",
				"pre-line",
				"pre-wrap",
				"break-spaces"
			] }],
			break: [{ break: [
				"normal",
				"words",
				"all",
				"keep"
			] }],
			wrap: [{ wrap: [
				"break-word",
				"anywhere",
				"normal"
			] }],
			hyphens: [{ hyphens: [
				"none",
				"manual",
				"auto"
			] }],
			content: [{ content: [
				"none",
				W,
				U
			] }],
			"bg-attachment": [{ bg: [
				"fixed",
				"local",
				"scroll"
			] }],
			"bg-clip": [{ "bg-clip": [
				"border",
				"padding",
				"content",
				"text"
			] }],
			"bg-origin": [{ "bg-origin": [
				"border",
				"padding",
				"content"
			] }],
			"bg-position": [{ bg: I() }],
			"bg-repeat": [{ bg: te() }],
			"bg-size": [{ bg: ne() }],
			"bg-image": [{ bg: [
				"none",
				{
					linear: [
						{ to: [
							"t",
							"tr",
							"r",
							"br",
							"b",
							"bl",
							"l",
							"tl"
						] },
						Pt,
						W,
						U
					],
					radial: [
						"",
						W,
						U
					],
					conic: [
						Pt,
						W,
						U
					]
				},
				nn,
				Xt
			] }],
			"bg-color": [{ bg: F() }],
			"gradient-from-pos": [{ from: re() }],
			"gradient-via-pos": [{ via: re() }],
			"gradient-to-pos": [{ to: re() }],
			"gradient-from": [{ from: F() }],
			"gradient-via": [{ via: F() }],
			"gradient-to": [{ to: F() }],
			rounded: [{ rounded: L() }],
			"rounded-s": [{ "rounded-s": L() }],
			"rounded-e": [{ "rounded-e": L() }],
			"rounded-t": [{ "rounded-t": L() }],
			"rounded-r": [{ "rounded-r": L() }],
			"rounded-b": [{ "rounded-b": L() }],
			"rounded-l": [{ "rounded-l": L() }],
			"rounded-ss": [{ "rounded-ss": L() }],
			"rounded-se": [{ "rounded-se": L() }],
			"rounded-ee": [{ "rounded-ee": L() }],
			"rounded-es": [{ "rounded-es": L() }],
			"rounded-tl": [{ "rounded-tl": L() }],
			"rounded-tr": [{ "rounded-tr": L() }],
			"rounded-br": [{ "rounded-br": L() }],
			"rounded-bl": [{ "rounded-bl": L() }],
			"border-w": [{ border: R() }],
			"border-w-x": [{ "border-x": R() }],
			"border-w-y": [{ "border-y": R() }],
			"border-w-s": [{ "border-s": R() }],
			"border-w-e": [{ "border-e": R() }],
			"border-w-bs": [{ "border-bs": R() }],
			"border-w-be": [{ "border-be": R() }],
			"border-w-t": [{ "border-t": R() }],
			"border-w-r": [{ "border-r": R() }],
			"border-w-b": [{ "border-b": R() }],
			"border-w-l": [{ "border-l": R() }],
			"divide-x": [{ "divide-x": R() }],
			"divide-x-reverse": ["divide-x-reverse"],
			"divide-y": [{ "divide-y": R() }],
			"divide-y-reverse": ["divide-y-reverse"],
			"border-style": [{ border: [
				...z(),
				"hidden",
				"none"
			] }],
			"divide-style": [{ divide: [
				...z(),
				"hidden",
				"none"
			] }],
			"border-color": [{ border: F() }],
			"border-color-x": [{ "border-x": F() }],
			"border-color-y": [{ "border-y": F() }],
			"border-color-s": [{ "border-s": F() }],
			"border-color-e": [{ "border-e": F() }],
			"border-color-bs": [{ "border-bs": F() }],
			"border-color-be": [{ "border-be": F() }],
			"border-color-t": [{ "border-t": F() }],
			"border-color-r": [{ "border-r": F() }],
			"border-color-b": [{ "border-b": F() }],
			"border-color-l": [{ "border-l": F() }],
			"divide-color": [{ divide: F() }],
			"outline-style": [{ outline: [
				...z(),
				"none",
				"hidden"
			] }],
			"outline-offset": [{ "outline-offset": [
				H,
				W,
				U
			] }],
			"outline-w": [{ outline: [
				"",
				H,
				Qt,
				Gt
			] }],
			"outline-color": [{ outline: F() }],
			shadow: [{ shadow: [
				"",
				"none",
				u,
				rn,
				Zt
			] }],
			"shadow-color": [{ shadow: F() }],
			"inset-shadow": [{ "inset-shadow": [
				"none",
				d,
				rn,
				Zt
			] }],
			"inset-shadow-color": [{ "inset-shadow": F() }],
			"ring-w": [{ ring: R() }],
			"ring-w-inset": ["ring-inset"],
			"ring-color": [{ ring: F() }],
			"ring-offset-w": [{ "ring-offset": [H, Gt] }],
			"ring-offset-color": [{ "ring-offset": F() }],
			"inset-ring-w": [{ "inset-ring": R() }],
			"inset-ring-color": [{ "inset-ring": F() }],
			"text-shadow": [{ "text-shadow": [
				"none",
				f,
				rn,
				Zt
			] }],
			"text-shadow-color": [{ "text-shadow": F() }],
			opacity: [{ opacity: [
				H,
				W,
				U
			] }],
			"mix-blend": [{ "mix-blend": [
				...ie(),
				"plus-darker",
				"plus-lighter"
			] }],
			"bg-blend": [{ "bg-blend": ie() }],
			"mask-clip": [{ "mask-clip": [
				"border",
				"padding",
				"content",
				"fill",
				"stroke",
				"view"
			] }, "mask-no-clip"],
			"mask-composite": [{ mask: [
				"add",
				"subtract",
				"intersect",
				"exclude"
			] }],
			"mask-image-linear-pos": [{ "mask-linear": [H] }],
			"mask-image-linear-from-pos": [{ "mask-linear-from": B() }],
			"mask-image-linear-to-pos": [{ "mask-linear-to": B() }],
			"mask-image-linear-from-color": [{ "mask-linear-from": F() }],
			"mask-image-linear-to-color": [{ "mask-linear-to": F() }],
			"mask-image-t-from-pos": [{ "mask-t-from": B() }],
			"mask-image-t-to-pos": [{ "mask-t-to": B() }],
			"mask-image-t-from-color": [{ "mask-t-from": F() }],
			"mask-image-t-to-color": [{ "mask-t-to": F() }],
			"mask-image-r-from-pos": [{ "mask-r-from": B() }],
			"mask-image-r-to-pos": [{ "mask-r-to": B() }],
			"mask-image-r-from-color": [{ "mask-r-from": F() }],
			"mask-image-r-to-color": [{ "mask-r-to": F() }],
			"mask-image-b-from-pos": [{ "mask-b-from": B() }],
			"mask-image-b-to-pos": [{ "mask-b-to": B() }],
			"mask-image-b-from-color": [{ "mask-b-from": F() }],
			"mask-image-b-to-color": [{ "mask-b-to": F() }],
			"mask-image-l-from-pos": [{ "mask-l-from": B() }],
			"mask-image-l-to-pos": [{ "mask-l-to": B() }],
			"mask-image-l-from-color": [{ "mask-l-from": F() }],
			"mask-image-l-to-color": [{ "mask-l-to": F() }],
			"mask-image-x-from-pos": [{ "mask-x-from": B() }],
			"mask-image-x-to-pos": [{ "mask-x-to": B() }],
			"mask-image-x-from-color": [{ "mask-x-from": F() }],
			"mask-image-x-to-color": [{ "mask-x-to": F() }],
			"mask-image-y-from-pos": [{ "mask-y-from": B() }],
			"mask-image-y-to-pos": [{ "mask-y-to": B() }],
			"mask-image-y-from-color": [{ "mask-y-from": F() }],
			"mask-image-y-to-color": [{ "mask-y-to": F() }],
			"mask-image-radial": [{ "mask-radial": [W, U] }],
			"mask-image-radial-from-pos": [{ "mask-radial-from": B() }],
			"mask-image-radial-to-pos": [{ "mask-radial-to": B() }],
			"mask-image-radial-from-color": [{ "mask-radial-from": F() }],
			"mask-image-radial-to-color": [{ "mask-radial-to": F() }],
			"mask-image-radial-shape": [{ "mask-radial": ["circle", "ellipse"] }],
			"mask-image-radial-size": [{ "mask-radial": [{
				closest: ["side", "corner"],
				farthest: ["side", "corner"]
			}] }],
			"mask-image-radial-pos": [{ "mask-radial-at": b() }],
			"mask-image-conic-pos": [{ "mask-conic": [H] }],
			"mask-image-conic-from-pos": [{ "mask-conic-from": B() }],
			"mask-image-conic-to-pos": [{ "mask-conic-to": B() }],
			"mask-image-conic-from-color": [{ "mask-conic-from": F() }],
			"mask-image-conic-to-color": [{ "mask-conic-to": F() }],
			"mask-mode": [{ mask: [
				"alpha",
				"luminance",
				"match"
			] }],
			"mask-origin": [{ "mask-origin": [
				"border",
				"padding",
				"content",
				"fill",
				"stroke",
				"view"
			] }],
			"mask-position": [{ mask: I() }],
			"mask-repeat": [{ mask: te() }],
			"mask-size": [{ mask: ne() }],
			"mask-type": [{ "mask-type": ["alpha", "luminance"] }],
			"mask-image": [{ mask: [
				"none",
				W,
				U
			] }],
			filter: [{ filter: [
				"",
				"none",
				W,
				U
			] }],
			blur: [{ blur: ae() }],
			brightness: [{ brightness: [
				H,
				W,
				U
			] }],
			contrast: [{ contrast: [
				H,
				W,
				U
			] }],
			"drop-shadow": [{ "drop-shadow": [
				"",
				"none",
				p,
				rn,
				Zt
			] }],
			"drop-shadow-color": [{ "drop-shadow": F() }],
			grayscale: [{ grayscale: [
				"",
				H,
				W,
				U
			] }],
			"hue-rotate": [{ "hue-rotate": [
				H,
				W,
				U
			] }],
			invert: [{ invert: [
				"",
				H,
				W,
				U
			] }],
			saturate: [{ saturate: [
				H,
				W,
				U
			] }],
			sepia: [{ sepia: [
				"",
				H,
				W,
				U
			] }],
			"backdrop-filter": [{ "backdrop-filter": [
				"",
				"none",
				W,
				U
			] }],
			"backdrop-blur": [{ "backdrop-blur": ae() }],
			"backdrop-brightness": [{ "backdrop-brightness": [
				H,
				W,
				U
			] }],
			"backdrop-contrast": [{ "backdrop-contrast": [
				H,
				W,
				U
			] }],
			"backdrop-grayscale": [{ "backdrop-grayscale": [
				"",
				H,
				W,
				U
			] }],
			"backdrop-hue-rotate": [{ "backdrop-hue-rotate": [
				H,
				W,
				U
			] }],
			"backdrop-invert": [{ "backdrop-invert": [
				"",
				H,
				W,
				U
			] }],
			"backdrop-opacity": [{ "backdrop-opacity": [
				H,
				W,
				U
			] }],
			"backdrop-saturate": [{ "backdrop-saturate": [
				H,
				W,
				U
			] }],
			"backdrop-sepia": [{ "backdrop-sepia": [
				"",
				H,
				W,
				U
			] }],
			"border-collapse": [{ border: ["collapse", "separate"] }],
			"border-spacing": [{ "border-spacing": w() }],
			"border-spacing-x": [{ "border-spacing-x": w() }],
			"border-spacing-y": [{ "border-spacing-y": w() }],
			"table-layout": [{ table: ["auto", "fixed"] }],
			caption: [{ caption: ["top", "bottom"] }],
			transition: [{ transition: [
				"",
				"all",
				"colors",
				"opacity",
				"shadow",
				"transform",
				"none",
				W,
				U
			] }],
			"transition-behavior": [{ transition: ["normal", "discrete"] }],
			duration: [{ duration: [
				H,
				"initial",
				W,
				U
			] }],
			ease: [{ ease: [
				"linear",
				"initial",
				_,
				W,
				U
			] }],
			delay: [{ delay: [
				H,
				W,
				U
			] }],
			animate: [{ animate: [
				"none",
				v,
				W,
				U
			] }],
			backface: [{ backface: ["hidden", "visible"] }],
			perspective: [{ perspective: [
				h,
				W,
				U
			] }],
			"perspective-origin": [{ "perspective-origin": x() }],
			rotate: [{ rotate: oe() }],
			"rotate-x": [{ "rotate-x": oe() }],
			"rotate-y": [{ "rotate-y": oe() }],
			"rotate-z": [{ "rotate-z": oe() }],
			scale: [{ scale: se() }],
			"scale-x": [{ "scale-x": se() }],
			"scale-y": [{ "scale-y": se() }],
			"scale-z": [{ "scale-z": se() }],
			"scale-3d": ["scale-3d"],
			skew: [{ skew: ce() }],
			"skew-x": [{ "skew-x": ce() }],
			"skew-y": [{ "skew-y": ce() }],
			transform: [{ transform: [
				W,
				U,
				"",
				"none",
				"gpu",
				"cpu"
			] }],
			"transform-origin": [{ origin: x() }],
			"transform-style": [{ transform: ["3d", "flat"] }],
			translate: [{ translate: V() }],
			"translate-x": [{ "translate-x": V() }],
			"translate-y": [{ "translate-y": V() }],
			"translate-z": [{ "translate-z": V() }],
			"translate-none": ["translate-none"],
			zoom: [{ zoom: [
				Pt,
				W,
				U
			] }],
			accent: [{ accent: F() }],
			appearance: [{ appearance: ["none", "auto"] }],
			"caret-color": [{ caret: F() }],
			"color-scheme": [{ scheme: [
				"normal",
				"dark",
				"light",
				"light-dark",
				"only-dark",
				"only-light"
			] }],
			cursor: [{ cursor: [
				"auto",
				"default",
				"pointer",
				"wait",
				"text",
				"move",
				"help",
				"not-allowed",
				"none",
				"context-menu",
				"progress",
				"cell",
				"crosshair",
				"vertical-text",
				"alias",
				"copy",
				"no-drop",
				"grab",
				"grabbing",
				"all-scroll",
				"col-resize",
				"row-resize",
				"n-resize",
				"e-resize",
				"s-resize",
				"w-resize",
				"ne-resize",
				"nw-resize",
				"se-resize",
				"sw-resize",
				"ew-resize",
				"ns-resize",
				"nesw-resize",
				"nwse-resize",
				"zoom-in",
				"zoom-out",
				W,
				U
			] }],
			"field-sizing": [{ "field-sizing": ["fixed", "content"] }],
			"pointer-events": [{ "pointer-events": ["auto", "none"] }],
			resize: [{ resize: [
				"none",
				"",
				"y",
				"x"
			] }],
			"scroll-behavior": [{ scroll: ["auto", "smooth"] }],
			"scrollbar-thumb-color": [{ "scrollbar-thumb": F() }],
			"scrollbar-track-color": [{ "scrollbar-track": F() }],
			"scrollbar-gutter": [{ "scrollbar-gutter": [
				"auto",
				"stable",
				"both"
			] }],
			"scrollbar-w": [{ scrollbar: [
				"auto",
				"thin",
				"none"
			] }],
			"scroll-m": [{ "scroll-m": w() }],
			"scroll-mx": [{ "scroll-mx": w() }],
			"scroll-my": [{ "scroll-my": w() }],
			"scroll-ms": [{ "scroll-ms": w() }],
			"scroll-me": [{ "scroll-me": w() }],
			"scroll-mbs": [{ "scroll-mbs": w() }],
			"scroll-mbe": [{ "scroll-mbe": w() }],
			"scroll-mt": [{ "scroll-mt": w() }],
			"scroll-mr": [{ "scroll-mr": w() }],
			"scroll-mb": [{ "scroll-mb": w() }],
			"scroll-ml": [{ "scroll-ml": w() }],
			"scroll-p": [{ "scroll-p": w() }],
			"scroll-px": [{ "scroll-px": w() }],
			"scroll-py": [{ "scroll-py": w() }],
			"scroll-ps": [{ "scroll-ps": w() }],
			"scroll-pe": [{ "scroll-pe": w() }],
			"scroll-pbs": [{ "scroll-pbs": w() }],
			"scroll-pbe": [{ "scroll-pbe": w() }],
			"scroll-pt": [{ "scroll-pt": w() }],
			"scroll-pr": [{ "scroll-pr": w() }],
			"scroll-pb": [{ "scroll-pb": w() }],
			"scroll-pl": [{ "scroll-pl": w() }],
			"snap-align": [{ snap: [
				"start",
				"end",
				"center",
				"align-none"
			] }],
			"snap-stop": [{ snap: ["normal", "always"] }],
			"snap-type": [{ snap: [
				"none",
				"x",
				"y",
				"both"
			] }],
			"snap-strictness": [{ snap: ["mandatory", "proximity"] }],
			touch: [{ touch: [
				"auto",
				"none",
				"manipulation"
			] }],
			"touch-x": [{ "touch-pan": [
				"x",
				"left",
				"right"
			] }],
			"touch-y": [{ "touch-pan": [
				"y",
				"up",
				"down"
			] }],
			"touch-pz": ["touch-pinch-zoom"],
			select: [{ select: [
				"none",
				"text",
				"all",
				"auto"
			] }],
			"will-change": [{ "will-change": [
				"auto",
				"scroll",
				"contents",
				"transform",
				W,
				U
			] }],
			fill: [{ fill: ["none", ...F()] }],
			"stroke-w": [{ stroke: [
				H,
				Qt,
				Gt,
				Kt
			] }],
			stroke: [{ stroke: ["none", ...F()] }],
			"forced-color-adjust": [{ "forced-color-adjust": ["auto", "none"] }]
		},
		conflictingClassGroups: {
			"container-named": ["container-type"],
			overflow: ["overflow-x", "overflow-y"],
			overscroll: ["overscroll-x", "overscroll-y"],
			inset: [
				"inset-x",
				"inset-y",
				"inset-bs",
				"inset-be",
				"start",
				"end",
				"top",
				"right",
				"bottom",
				"left"
			],
			"inset-x": ["right", "left"],
			"inset-y": ["top", "bottom"],
			flex: [
				"basis",
				"grow",
				"shrink"
			],
			gap: ["gap-x", "gap-y"],
			p: [
				"px",
				"py",
				"ps",
				"pe",
				"pbs",
				"pbe",
				"pt",
				"pr",
				"pb",
				"pl"
			],
			px: ["pr", "pl"],
			py: ["pt", "pb"],
			m: [
				"mx",
				"my",
				"ms",
				"me",
				"mbs",
				"mbe",
				"mt",
				"mr",
				"mb",
				"ml"
			],
			mx: ["mr", "ml"],
			my: ["mt", "mb"],
			size: ["w", "h"],
			"font-size": ["leading"],
			"fvn-normal": [
				"fvn-ordinal",
				"fvn-slashed-zero",
				"fvn-figure",
				"fvn-spacing",
				"fvn-fraction"
			],
			"fvn-ordinal": ["fvn-normal"],
			"fvn-slashed-zero": ["fvn-normal"],
			"fvn-figure": ["fvn-normal"],
			"fvn-spacing": ["fvn-normal"],
			"fvn-fraction": ["fvn-normal"],
			"line-clamp": ["display", "overflow"],
			rounded: [
				"rounded-s",
				"rounded-e",
				"rounded-t",
				"rounded-r",
				"rounded-b",
				"rounded-l",
				"rounded-ss",
				"rounded-se",
				"rounded-ee",
				"rounded-es",
				"rounded-tl",
				"rounded-tr",
				"rounded-br",
				"rounded-bl"
			],
			"rounded-s": ["rounded-ss", "rounded-es"],
			"rounded-e": ["rounded-se", "rounded-ee"],
			"rounded-t": ["rounded-tl", "rounded-tr"],
			"rounded-r": ["rounded-tr", "rounded-br"],
			"rounded-b": ["rounded-br", "rounded-bl"],
			"rounded-l": ["rounded-tl", "rounded-bl"],
			"border-spacing": ["border-spacing-x", "border-spacing-y"],
			"border-w": [
				"border-w-x",
				"border-w-y",
				"border-w-s",
				"border-w-e",
				"border-w-bs",
				"border-w-be",
				"border-w-t",
				"border-w-r",
				"border-w-b",
				"border-w-l"
			],
			"border-w-x": ["border-w-r", "border-w-l"],
			"border-w-y": ["border-w-t", "border-w-b"],
			"border-color": [
				"border-color-x",
				"border-color-y",
				"border-color-s",
				"border-color-e",
				"border-color-bs",
				"border-color-be",
				"border-color-t",
				"border-color-r",
				"border-color-b",
				"border-color-l"
			],
			"border-color-x": ["border-color-r", "border-color-l"],
			"border-color-y": ["border-color-t", "border-color-b"],
			translate: [
				"translate-x",
				"translate-y",
				"translate-none"
			],
			"translate-none": [
				"translate",
				"translate-x",
				"translate-y",
				"translate-z"
			],
			"scroll-m": [
				"scroll-mx",
				"scroll-my",
				"scroll-ms",
				"scroll-me",
				"scroll-mbs",
				"scroll-mbe",
				"scroll-mt",
				"scroll-mr",
				"scroll-mb",
				"scroll-ml"
			],
			"scroll-mx": ["scroll-mr", "scroll-ml"],
			"scroll-my": ["scroll-mt", "scroll-mb"],
			"scroll-p": [
				"scroll-px",
				"scroll-py",
				"scroll-ps",
				"scroll-pe",
				"scroll-pbs",
				"scroll-pbe",
				"scroll-pt",
				"scroll-pr",
				"scroll-pb",
				"scroll-pl"
			],
			"scroll-px": ["scroll-pr", "scroll-pl"],
			"scroll-py": ["scroll-pt", "scroll-pb"],
			touch: [
				"touch-x",
				"touch-y",
				"touch-pz"
			],
			"touch-x": ["touch"],
			"touch-y": ["touch"],
			"touch-pz": ["touch"]
		},
		conflictingClassGroupModifiers: { "font-size": ["leading"] },
		postfixLookupClassGroups: ["container-type"],
		orderSensitiveModifiers: [
			"*",
			"**",
			"after",
			"backdrop",
			"before",
			"details-content",
			"file",
			"first-letter",
			"first-line",
			"marker",
			"placeholder",
			"selection"
		]
	};
});
//#endregion
//#region src/lib/utils.ts
function _n(...e) {
	return gn(Ve(e));
}
//#endregion
//#region node_modules/.pnpm/react@19.2.8/node_modules/react/cjs/react-jsx-runtime.production.js
var vn = /* @__PURE__ */ o(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.fragment");
	function r(e, n, r) {
		var i = null;
		if (r !== void 0 && (i = "" + r), n.key !== void 0 && (i = "" + n.key), "key" in n) for (var a in r = {}, n) a !== "key" && (r[a] = n[a]);
		else r = n;
		return n = r.ref, {
			$$typeof: t,
			type: e,
			key: i,
			ref: n === void 0 ? null : n,
			props: r
		};
	}
	e.Fragment = n, e.jsx = r, e.jsxs = r;
})), G = (/* @__PURE__ */ o(((e, t) => {
	t.exports = vn();
})))(), yn = {
	pill: {
		item: "rounded-[20px]",
		bg: "rounded-[20px]",
		focusRing: "rounded-[22px]",
		mergedBg: "rounded-2xl",
		container: "rounded-3xl",
		button: "rounded-[20px]",
		input: "rounded-[20px]",
		bgRadius: 20,
		mergedRadius: 16
	},
	rounded: {
		item: "rounded-lg",
		bg: "rounded-lg",
		focusRing: "rounded-[10px]",
		mergedBg: "rounded-lg",
		container: "rounded-xl",
		button: "rounded-lg",
		input: "rounded-lg",
		bgRadius: 8,
		mergedRadius: 8
	}
}, bn = (0, C.createContext)(null);
function xn() {
	let e = (0, C.useContext)(bn);
	return e ? e.classes : yn.pill;
}
function Sn({ children: e, defaultShape: t = "pill" }) {
	let [n, r] = (0, C.useState)(t), i = (0, C.useRef)(null), a = (0, C.useCallback)((e) => {
		let t = document.documentElement;
		t.classList.add("transitioning"), t.offsetHeight, e(), i.current && clearTimeout(i.current), i.current = setTimeout(() => t.classList.remove("transitioning"), 200);
	}, []), o = (0, C.useCallback)((e) => {
		a(() => r(e));
	}, [a]);
	(0, C.useEffect)(() => {
		document.documentElement.style.setProperty("--shape-input-radius", `${yn[n].bgRadius}px`);
	}, [n]);
	let s = (0, C.useMemo)(() => ({
		shape: n,
		setShape: o,
		classes: yn[n]
	}), [n, o]);
	return /* @__PURE__ */ (0, G.jsx)(bn.Provider, {
		value: s,
		children: e
	});
}
//#endregion
//#region src/lib/size-context.tsx
var Cn = {
	default: {
		variant: "default",
		control: "h-9",
		controlHeight: 36,
		segmentItem: "h-7",
		segmentPad: "p-1",
		text: "text-[13px]",
		px: "px-3",
		itemPx: "px-2",
		gap: "gap-2",
		icon: 16
	},
	compact: {
		variant: "compact",
		control: "h-7",
		controlHeight: 28,
		segmentItem: "h-6",
		segmentPad: "p-0.5",
		text: "text-[12px]",
		px: "px-2.5",
		itemPx: "px-1.5",
		gap: "gap-1",
		icon: 14
	}
}, wn = (0, C.createContext)(null);
function Tn(e) {
	let t = (0, C.useContext)(wn);
	return e ?? t?.size ?? "default";
}
function En(e) {
	return Cn[Tn(e)];
}
function Dn({ children: e, size: t, defaultSize: n = "default" }) {
	let [r, i] = (0, C.useState)(n), a = t !== void 0, o = t ?? r, s = (0, C.useCallback)((e) => {
		a || i(e);
	}, [a]), c = (0, C.useMemo)(() => ({
		size: o,
		setSize: s,
		classes: Cn[o]
	}), [o, s]);
	return /* @__PURE__ */ (0, G.jsx)(wn.Provider, {
		value: c,
		children: e
	});
}
//#endregion
//#region src/components/ui/button.tsx
var On = We([
	"group relative isolate inline-flex items-center justify-center outline-none cursor-pointer",
	"font-medium tracking-[0] normal-case",
	"transition-colors duration-80",
	"disabled:opacity-50 disabled:pointer-events-none",
	"focus-visible:ring-1 focus-visible:ring-[color:var(--focus-ring,#6B97FF)]"
], {
	variants: {
		variant: {
			primary: "text-background",
			secondary: "text-foreground",
			tertiary: "text-foreground",
			ghost: "text-muted-foreground hover:text-foreground"
		},
		size: {
			default: "h-9 px-4 text-[13px] gap-1.5",
			compact: "h-7 px-3 text-[12px] gap-1",
			icon: "h-9 w-9 p-0 [&_svg]:h-4 [&_svg]:w-4",
			"icon-compact": "h-7 w-7 p-0 [&_svg]:h-3.5 [&_svg]:w-3.5"
		},
		iconLeft: { true: "" },
		iconRight: { true: "" }
	},
	compoundVariants: [
		{
			size: "compact",
			iconLeft: !0,
			className: "pl-[6px]"
		},
		{
			size: "default",
			iconLeft: !0,
			className: "pl-[10px]"
		},
		{
			size: "compact",
			iconRight: !0,
			className: "pr-[6px]"
		},
		{
			size: "default",
			iconRight: !0,
			className: "pr-[10px]"
		}
	],
	defaultVariants: {
		variant: "primary",
		size: "default"
	}
}), kn = {
	sm: "compact",
	md: "default",
	lg: "default",
	"icon-sm": "icon-compact",
	"icon-lg": "icon"
}, An = {
	primary: "[--btn-bg:var(--foreground)] group-hover:[--btn-bg:color-mix(in_oklab,var(--foreground)_90%,var(--background))] group-active:[--btn-bg:color-mix(in_oklab,var(--foreground)_80%,var(--background))] bg-[var(--btn-bg)] shadow-[0_0_0_1px_var(--btn-bg)] group-active:shadow-[0_0_0_0px_var(--btn-bg)]",
	secondary: "[--btn-bg:var(--accent)] group-hover:[--btn-bg:color-mix(in_oklab,var(--accent)_80%,var(--background))] group-active:[--btn-bg:var(--accent)] bg-[var(--btn-bg)] shadow-[0_0_0_1px_var(--btn-bg)] group-active:shadow-[0_0_0_0px_var(--btn-bg)]",
	tertiary: "bg-transparent shadow-[0_0_0_1px_var(--border),inset_0_0_0_0px_var(--border)] group-hover:bg-hover group-active:bg-active group-active:shadow-[0_0_0_0px_var(--border),inset_0_0_0_1px_var(--border)]",
	ghost: "bg-transparent shadow-[0_0_0_1px_transparent] group-hover:bg-hover group-hover:shadow-[0_0_0_1px_var(--hover)] group-active:bg-active group-active:shadow-[0_0_0_0px_var(--active)]"
}, jn = {
	primary: "[--btn-bg:color-mix(in_oklab,var(--foreground)_80%,var(--background))] bg-[var(--btn-bg)] shadow-[0_0_0_1px_var(--btn-bg)] group-active:shadow-[0_0_0_0px_var(--btn-bg)]",
	secondary: "[--btn-bg:var(--accent)] bg-[var(--btn-bg)] shadow-[0_0_0_1px_var(--btn-bg)] group-active:shadow-[0_0_0_0px_var(--btn-bg)]",
	tertiary: "bg-active shadow-[0_0_0_1px_var(--border),inset_0_0_0_0px_var(--border)] group-active:shadow-[0_0_0_0px_var(--border),inset_0_0_0_1px_var(--border)]",
	ghost: "bg-active shadow-[0_0_0_1px_var(--active)] group-active:shadow-[0_0_0_0px_var(--active)]"
}, Mn = (0, C.forwardRef)(({ className: e, variant: t, size: n, asChild: r = !1, loading: i = !1, leadingIcon: a, trailingIcon: o, active: s = !1, disabled: c, children: l, style: u, ...d }, f) => {
	let p = r && (0, C.isValidElement)(l) ? l : null, m = p ? p.props.children : l, h = Tn(), g = n ? kn[n] ?? n : h === "compact" ? "compact" : "default", _ = g === "icon" || g === "icon-compact", v = g === "compact" || g === "icon-compact", y = v ? 14 : 16, b = v ? "h-7 w-7" : "h-9 w-9", x = xn(), S = s ? jn[t ?? "primary"] : An[t ?? "primary"], w = /* @__PURE__ */ (0, G.jsxs)(G.Fragment, { children: [/* @__PURE__ */ (0, G.jsx)("span", {
		"aria-hidden": !0,
		className: _n("absolute inset-px rounded-[inherit] transition-[box-shadow,background-color] [transition-duration:180ms,80ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1),ease] group-active:[transition-duration:80ms,80ms]", S)
	}), /* @__PURE__ */ (0, G.jsx)("span", {
		className: "relative inline-flex items-center justify-center gap-[inherit]",
		children: i ? /* @__PURE__ */ (0, G.jsxs)(G.Fragment, { children: [/* @__PURE__ */ (0, G.jsxs)("span", {
			className: "flex items-center justify-center gap-[inherit] opacity-0",
			children: [
				a && !_ && /* @__PURE__ */ (0, G.jsx)(a, {
					size: y,
					strokeWidth: 2
				}),
				m,
				o && !_ && /* @__PURE__ */ (0, G.jsx)(o, {
					size: y,
					strokeWidth: 2
				})
			]
		}), /* @__PURE__ */ (0, G.jsx)("span", {
			className: "absolute inset-0 flex items-center justify-center",
			children: /* @__PURE__ */ (0, G.jsx)("svg", {
				className: b,
				viewBox: "0 0 24 24",
				fill: "none",
				children: /* @__PURE__ */ (0, G.jsx)("path", {
					d: "M 12 12 C 14 8.5 19 8.5 19 12 C 19 15.5 14 15.5 12 12 C 10 8.5 5 8.5 5 12 C 5 15.5 10 15.5 12 12 Z",
					stroke: "currentColor",
					strokeWidth: "1.125",
					strokeLinecap: "round",
					pathLength: "100",
					style: {
						strokeDasharray: "15 85",
						animation: "spinner-move 2s linear infinite, spinner-dash 4s ease-in-out infinite"
					}
				})
			})
		})] }) : _ ? /* @__PURE__ */ (0, G.jsx)("span", {
			className: "[&_svg]:stroke-[1.5] [&_svg]:transition-[stroke-width] [&_svg]:duration-80 group-hover:[&_svg]:stroke-[2]",
			children: m
		}) : /* @__PURE__ */ (0, G.jsxs)(G.Fragment, { children: [
			a && /* @__PURE__ */ (0, G.jsx)(a, {
				size: y,
				strokeWidth: 1.5,
				className: "transition-[stroke-width] duration-80 group-hover:stroke-[2]"
			}),
			/* @__PURE__ */ (0, G.jsx)("span", {
				className: "[text-box:trim-both_cap_alphabetic]",
				children: m
			}),
			o && /* @__PURE__ */ (0, G.jsx)(o, {
				size: y,
				strokeWidth: 1.5,
				className: "transition-[stroke-width] duration-80 group-hover:stroke-[2]"
			})
		] })
	})] }), T = _n(On({
		variant: t,
		size: g,
		iconLeft: !_ && !!a,
		iconRight: !_ && !!o
	}), x.button, e);
	if (p) {
		let e = p.props;
		return (0, C.cloneElement)(p, {
			...d,
			ref: f,
			className: _n(T, e.className),
			style: {
				...u,
				...e.style
			}
		}, w);
	}
	return /* @__PURE__ */ (0, G.jsx)(Re, {
		ref: f,
		className: T,
		disabled: c || i,
		style: u,
		...d,
		children: w
	});
});
Mn.displayName = "Button";
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/field-constants/constants.mjs
var Nn = {
	badInput: !1,
	customError: !1,
	patternMismatch: !1,
	rangeOverflow: !1,
	rangeUnderflow: !1,
	stepMismatch: !1,
	tooLong: !1,
	tooShort: !1,
	typeMismatch: !1,
	valid: null,
	valueMissing: !1
}, Pn = {
	disabled: !1,
	valid: null,
	touched: !1,
	dirty: !1,
	filled: !1,
	focused: !1
}, Fn = { valid(e) {
	return e === null ? null : e ? { "data-valid": "" } : { "data-invalid": "" };
} }, In = {
	invalid: void 0,
	name: void 0,
	validityData: {
		state: Nn,
		errors: [],
		error: "",
		value: "",
		initialValue: null
	},
	setValidityData: Ee,
	disabled: void 0,
	setTouched: Ee,
	setDirty: Ee,
	setFilled: Ee,
	setFocused: Ee,
	validationMode: "onSubmit",
	shouldValidateOnChange: () => !1,
	state: Pn,
	registerFieldControl: Ee,
	validation: {
		getValidationProps: (e, t = Oe) => t,
		inputRef: { current: null },
		registeredInputs: /* @__PURE__ */ new Map(),
		registerInput: Ee,
		getInputControl: () => null,
		commit: async () => {},
		change: Ee
	}
}, Ln = /*#__PURE__*/ C.createContext(In);
function Rn(e = !0) {
	let t = C.useContext(Ln);
	if (t.setValidityData === Ee && !e) throw Error(V(28));
	return t;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/fieldset/root/FieldsetRootContext.mjs
var zn = /*#__PURE__*/ C.createContext(void 0);
function Bn(e = !1) {
	let t = C.useContext(zn);
	if (!t && !e) throw Error(V(86));
	return t;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/form-context/FormContext.mjs
var Vn = /*#__PURE__*/ C.createContext({
	elementRef: { current: null },
	formRef: { current: { fields: /* @__PURE__ */ new Map() } },
	errors: {},
	clearErrors: Ee,
	validationMode: "onSubmit",
	submitAttemptedRef: { current: !1 }
});
function Hn() {
	return C.useContext(Vn);
}
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/useId.mjs
var Un = 0;
function Wn(e, t = "mui") {
	let [n, r] = C.useState(e), i = e || n;
	return C.useEffect(() => {
		n ?? (Un += 1, r(`${t}-${Un}`));
	}, [n, t]), i;
}
var Gn = w.useId;
function Kn(e, t) {
	if (Gn !== void 0) {
		let n = Gn();
		return e ?? (t ? `${t}-${n}` : n);
	}
	return Wn(e, t);
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/useBaseUiId.mjs
function qn(e) {
	return Kn(e, "base-ui");
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/labelable-provider/LabelableContext.mjs
var Jn = /*#__PURE__*/ C.createContext({
	controlId: void 0,
	registerControlId: Ee,
	labelId: void 0,
	setLabelId: Ee,
	messageIds: [],
	setMessageIds: Ee,
	getDescriptionProps: (e) => e
});
function Yn() {
	return C.useContext(Jn);
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/labelable-provider/LabelableProvider.mjs
var Xn = function(e) {
	let t = qn(), n = e.controlId === void 0 ? t : e.controlId, [r, i] = C.useState(n), [a, o] = C.useState(e.labelId), [s, c] = C.useState([]), l = E(() => /* @__PURE__ */ new Map()), { messageIds: u } = Yn(), d = k((e, t) => {
		let n = l.current;
		if (t === void 0) {
			n.delete(e);
			return;
		}
		n.set(e, t), i((e) => {
			if (n.size === 0) return;
			let t;
			for (let r of n.values()) {
				if (e !== void 0 && r === e) return e;
				t === void 0 && (t = r);
			}
			return t;
		});
	}), f = C.useCallback((e) => {
		let t = e["aria-describedby"] ? e["aria-describedby"].split(" ") : [];
		return t.push(...u, ...s), {
			...e,
			"aria-describedby": Array.from(new Set(t)).join(" ") || void 0
		};
	}, [u, s]), p = C.useMemo(() => ({
		controlId: r,
		registerControlId: d,
		labelId: a,
		setLabelId: o,
		messageIds: s,
		setMessageIds: c,
		getDescriptionProps: f
	}), [
		r,
		d,
		a,
		o,
		s,
		c,
		f
	]);
	return /*#__PURE__*/ (0, G.jsx)(Jn.Provider, {
		value: p,
		children: e.children
	});
};
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/labelable-provider/useLabelableId.mjs
function Zn(e = {}) {
	let { id: t, implicit: n = !1, controlRef: r } = e, { controlId: i, registerControlId: a } = Yn(), o = qn(t), s = n ? i : void 0, c = E(() => Symbol()), l = C.useRef(!1), u = C.useRef(t != null), d = k(() => {
		!l.current || a === Ee || (l.current = !1, a(c.current, void 0));
	});
	return M(() => {
		if (a === Ee) return;
		let e;
		if (n) {
			let n = r?.current;
			e = y(n) && n.closest("label") != null ? t ?? null : s ?? o;
		} else if (t != null) u.current = !0, e = t;
		else if (u.current) e = o;
		else {
			d();
			return;
		}
		if (e === void 0) {
			d();
			return;
		}
		l.current = !0, a(c.current, e);
	}, [
		t,
		r,
		s,
		a,
		n,
		o,
		c,
		d
	]), C.useEffect(() => d, [d]), i ?? o;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/platform/shared.mjs
function Qn() {
	return typeof navigator > "u" ? {
		userAgent: "",
		platform: "",
		maxTouchPoints: 0
	} : {
		userAgent: navigator.userAgent,
		platform: navigator.platform ?? "",
		maxTouchPoints: navigator.maxTouchPoints ?? 0
	};
}
var { userAgent: $n, platform: er, maxTouchPoints: tr } = Qn(), nr = $n.toLowerCase();
er.toLowerCase();
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/platform/env.mjs
var rr = /jsdom|happydom/.test(nr);
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/shadowDom.mjs
function ir(e) {
	let t = e.activeElement;
	for (; t?.shadowRoot?.activeElement != null;) t = t.shadowRoot.activeElement;
	return t;
}
function ar(e, t) {
	if (!e || !t) return !1;
	let n = t.getRootNode?.();
	if (e.contains(t)) return !0;
	if (n && x(n)) {
		let n = t;
		for (; n;) {
			if (e === n) return !0;
			n = n.parentNode || n.host;
		}
	}
	return !1;
}
function or(e) {
	return "composedPath" in e ? e.composedPath()[0] : e.target;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/floating-ui-react/utils/element.mjs
function sr(e) {
	if (!e || rr) return !0;
	try {
		return e.matches(":focus-visible");
	} catch {
		return !0;
	}
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/floating-ui-react/utils/composite.mjs
function cr(e, t) {
	return t < 0 || t >= e.length;
}
function lr(e, t) {
	return dr(e.current, { disabledIndices: t });
}
function ur(e, t) {
	return dr(e.current, {
		decrement: !0,
		startingIndex: e.current.length,
		disabledIndices: t
	});
}
function dr(e, { startingIndex: t = -1, decrement: n = !1, disabledIndices: r, amount: i = 1 } = {}) {
	let a = t;
	do
		a += n ? -i : i;
	while (a >= 0 && a <= e.length - 1 && fr(e, a, r));
	return a;
}
function fr(e, t, n) {
	if (typeof n == "function" ? n(t) : n?.includes(t) ?? !1) return !0;
	let r = e[t];
	return r ? !mr(r) || r.matches(":disabled") ? !0 : !n && (r.hasAttribute("disabled") || r.getAttribute("aria-disabled") === "true") : !1;
}
function pr(e) {
	return e.visibility === "hidden" || e.visibility === "collapse";
}
function mr(e, t = e ? S(e) : null) {
	return !e || !e.isConnected || !t || pr(t) ? !1 : typeof e.checkVisibility == "function" ? e.checkVisibility() : t.display !== "none" && t.display !== "contents";
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/useRegisteredLabelId.mjs
function hr(e, t) {
	let n = qn(e);
	return M(() => (t(n), () => {
		t((e) => e === n ? void 0 : e);
	}), [n, t]), n;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/labelable-provider/useLabel.mjs
function gr(e = {}) {
	let { id: t, fallbackControlId: n, native: r = !1, setLabelId: i, focusControl: a } = e, { controlId: o, setLabelId: s } = Yn(), c = hr(t, k((e) => {
		s(e), i?.(e);
	})), l = o ?? n;
	function u(e) {
		if (a) {
			a(e, l);
			return;
		}
		if (!l) return;
		let t = fe(e.currentTarget).getElementById(l);
		b(t) && _r(t);
	}
	function d(e) {
		or(e.nativeEvent)?.closest("button,input,select,textarea") || (!e.defaultPrevented && e.detail > 1 && e.preventDefault(), !r && u(e));
	}
	return r ? {
		id: c,
		htmlFor: l ?? void 0,
		onMouseDown: d
	} : {
		id: c,
		onClick: d,
		onPointerDown(e) {
			e.preventDefault();
		}
	};
}
function _r(e) {
	e.focus({ focusVisible: !0 });
}
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/useOnMount.mjs
function vr(e) {
	C.useEffect(e, De);
}
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/useTimeout.mjs
var yr = 0, br = class e {
	static create() {
		return new e();
	}
	currentId = yr;
	start(e, t) {
		this.clear(), this.currentId = setTimeout(() => {
			this.currentId = yr, t();
		}, e);
	}
	isStarted() {
		return this.currentId !== yr;
	}
	clear = () => {
		this.currentId !== yr && (clearTimeout(this.currentId), this.currentId = yr);
	};
	disposeEffect = () => this.clear;
};
function xr() {
	let e = E(br.create).current;
	return vr(e.disposeEffect), e;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/field/utils/getCombinedFieldValidityData.mjs
function Sr(e, t) {
	return {
		...e,
		state: {
			...e.state,
			valid: !t && e.state.valid
		}
	};
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/field/root/useFieldValidation.mjs
var Cr = Object.keys(Nn);
function wr(e, t) {
	return e.matches(":disabled") ? !1 : !t || e.form === t || e.form === null && !e.hasAttribute("form");
}
function Tr(e, t) {
	let n = null;
	for (let r of e.keys()) if (wr(r, t)) {
		if (!r.validity.valid) return r;
		n ??= r;
	}
	return n;
}
function Er(e, t) {
	for (let e of t.keys()) e.setCustomValidity("");
	e?.setCustomValidity("");
}
function Dr(e) {
	let { elementRef: t, formRef: n } = Hn(), { setValidityData: r, validate: i, validityData: a, validationDebounceTime: o, invalid: s, markedDirtyRef: c, state: l, shouldValidateOnChange: u, registeredFieldIdRef: d } = e, { controlId: f, getDescriptionProps: p } = Yn(), m = xr(), h = C.useRef(null), g = E(() => /* @__PURE__ */ new Map()).current, _ = C.useRef(0), v = C.useCallback((e, t) => (g.set(e, t), () => {
		g.delete(e);
	}), [g]), y = k(() => {
		let e = Tr(g, t.current);
		return e && g.get(e)?.controlRef.current || null;
	}), b = k(async (e, o = !1) => {
		_.current += 1;
		let p = _.current;
		function v(e, t = s) {
			let r = d.current ?? f;
			if (r == null) return;
			let i = n.current.fields.get(r);
			if (!i) return;
			let a = Sr(e, t);
			n.current.fields.set(r, {
				...i,
				validityData: a
			});
		}
		function y(t, n) {
			let i = {
				value: e,
				state: {
					...Nn,
					valid: !0
				},
				error: "",
				errors: [],
				initialValue: a.initialValue
			};
			Er(t, g), v(i, n), r(i);
		}
		let b = g.size > 0 ? Tr(g, t.current) : h.current;
		if (o) {
			if (l.valid !== !1 || !b) return;
			let e = b.validity;
			if (!e.valueMissing) {
				y(b, !1);
				return;
			}
			for (let t of Cr) if (t !== "valid" && t !== "valueMissing" && t !== "customError" && e[t]) return;
		}
		function x(e) {
			let t = Cr.reduce((t, n) => (t[n] = e.validity[n], t), {}), n = !1;
			for (let e of Cr) if (e !== "valid") {
				if (e === "valueMissing" && t[e]) n = !0;
				else if (t[e]) return t;
			}
			return n && !c.current && (t.valid = !0, t.valueMissing = !1), t;
		}
		m.clear();
		let S = null, C = [], w = b ? x(b) : {
			...Nn,
			valid: !0
		}, T, E = u();
		if (b && b.validationMessage && !E) T = b.validationMessage, C = [b.validationMessage];
		else {
			let t = Array.from(n.current.fields.values()).reduce((e, t) => (t.name && (e[t.name] = t.getValue()), e), {}), r = i(e, t);
			if (typeof r == "object" && r && "then" in r) {
				if (S = await r, p !== _.current) return;
			} else S = r;
			S === null ? E && (Er(b, g), w.customError = !1, b && b.validationMessage ? (T = b.validationMessage, C = [b.validationMessage]) : (!b || b.validity.valid) && !w.valid && (w.valid = !0)) : (w.valid = !1, w.customError = !0, Array.isArray(S) ? (C = S, b?.setCustomValidity(S.join("\n"))) : S && (C = [S], b?.setCustomValidity(S)));
		}
		let D = {
			value: e,
			state: w,
			error: T ?? (Array.isArray(S) ? S[0] : S ?? ""),
			errors: C,
			initialValue: a.initialValue
		};
		v(D), r(D);
	}), x = k((e) => {
		m.clear();
		let t = u();
		t && e !== "" && o ? (_.current += 1, m.start(o, () => {
			b(e);
		})) : b(e, !t);
	}), S = C.useCallback((e, t = {}) => ee(p(t), l.valid === !1 && !l.disabled && !e ? { "aria-invalid": !0 } : Oe), [
		p,
		l.disabled,
		l.valid
	]);
	return C.useMemo(() => ({
		getValidationProps: S,
		inputRef: h,
		registeredInputs: g,
		registerInput: v,
		getInputControl: y,
		commit: b,
		change: x
	}), [
		S,
		g,
		v,
		y,
		b,
		x
	]);
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/field-register-control/useFieldControlRegistration.mjs
function Or(e) {
	let { commit: t, invalid: n, markedDirtyRef: r, name: i, setRegisteredFieldName: a, registeredFieldIdRef: o, setValidityData: s, validityData: c } = e, { formRef: l } = Hn(), u = C.useRef(null), d = C.useRef(null), f = C.useRef(!1), p = k(() => {
		let e = d.current;
		if (e) return e.getValue ? e.getValue() : e.value;
	});
	function m(e) {
		return e.value === void 0 ? p() : e.value;
	}
	let h = k(() => {
		let e = d.current;
		if (r.current = !0, !e) {
			t(c.value);
			return;
		}
		t(m(e));
	});
	function g() {
		let e = d.current;
		!e || !e.id || l.current.fields.set(e.id, {
			getValue: p,
			name: i ?? e.name,
			controlRef: e.controlRef,
			validityData: Sr(c, n),
			validate: h
		});
	}
	function _(e = d.current?.id) {
		e && l.current.fields.delete(e);
	}
	function v(e) {
		if (f.current) return;
		f.current = !0;
		let t = m(e);
		s((e) => e.initialValue === t ? e : {
			...e,
			initialValue: t
		});
	}
	return M(() => {
		let e = d.current;
		!e || !e.id || (a(i ? void 0 : e.name), l.current.fields.set(e.id, {
			getValue: p,
			name: i ?? e.name,
			controlRef: e.controlRef,
			validityData: Sr(c, n),
			validate: h
		}));
	}, [
		l,
		p,
		n,
		i,
		a,
		h,
		c
	]), M(() => {
		let e = l.current.fields;
		return () => {
			let t = d.current?.id;
			t && e.delete(t);
		};
	}, [l]), [h, k((e, t) => {
		if (!t) {
			u.current === e && (u.current = null, _(), d.current = null, a(void 0), o.current = void 0);
			return;
		}
		let n = d.current?.id;
		u.current = e, d.current = t, i || a(t.name), o.current = t.id, n && n !== t.id && _(n), v(t), g();
	})];
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/field/root/FieldRoot.mjs
var kr = /*#__PURE__*/ C.forwardRef(function(e, t) {
	let { errors: n, validationMode: r, submitAttemptedRef: i } = Hn(), { render: a, className: o, validate: s, validationDebounceTime: c = 0, validationMode: l = r, name: u, disabled: d = !1, invalid: f, dirty: p, touched: m, actionsRef: h, style: g, ..._ } = e, v = Bn(!0)?.disabled, y = k(s || (() => null)), b = v || d, [x, S] = C.useState(!1), [w, T] = C.useState(!1), [E, D] = C.useState(!1), [O, A] = C.useState(!1), j = p ?? w, N = m ?? x, P = C.useRef(j), ee = C.useRef(void 0), [F, I] = C.useState(), te = u ?? F;
	M(() => {
		p !== void 0 && (P.current = p);
	}, [p]);
	let ne = k((e) => {
		p === void 0 && (e && (P.current = !0), T(e));
	}), re = k((e) => {
		m === void 0 && S(e);
	}), L = k(() => l === "onChange" || l === "onSubmit" && i.current), R = te && Object.hasOwn(n, te) ? n[te] : null, z = !!(Array.isArray(R) ? R.length : R), ie = f === !0 || z, [B, ae] = C.useState({
		state: Nn,
		error: "",
		errors: [],
		value: null,
		initialValue: null
	}), oe = !ie && (b ? null : B.state.valid), se = C.useMemo(() => ({
		disabled: b,
		touched: N,
		dirty: j,
		valid: oe,
		filled: E,
		focused: O
	}), [
		b,
		N,
		j,
		oe,
		E,
		O
	]), ce = Dr({
		setValidityData: ae,
		validate: y,
		validityData: B,
		validationDebounceTime: c,
		invalid: ie,
		markedDirtyRef: P,
		state: se,
		shouldValidateOnChange: L,
		registeredFieldIdRef: ee
	}), [V, le] = Or({
		commit: ce.commit,
		invalid: ie,
		markedDirtyRef: P,
		name: u,
		setRegisteredFieldName: I,
		registeredFieldIdRef: ee,
		setValidityData: ae,
		validityData: B
	});
	C.useImperativeHandle(h, () => ({ validate: V }), [V]);
	let ue = C.useMemo(() => ({
		invalid: ie,
		name: te,
		validityData: B,
		setValidityData: ae,
		disabled: b,
		setTouched: re,
		setDirty: ne,
		setFilled: D,
		setFocused: A,
		validationMode: l,
		shouldValidateOnChange: L,
		state: se,
		registerFieldControl: le,
		validation: ce
	}), [
		ie,
		te,
		B,
		b,
		re,
		ne,
		D,
		A,
		l,
		L,
		se,
		le,
		ce
	]), de = Me("div", e, {
		ref: t,
		state: se,
		props: _,
		stateAttributesMapping: Fn
	});
	return /*#__PURE__*/ (0, G.jsx)(Ln.Provider, {
		value: ue,
		children: de
	});
}), Ar = /*#__PURE__*/ C.forwardRef(function(e, t) {
	return /*#__PURE__*/ (0, G.jsx)(Xn, { children: /*#__PURE__*/ (0, G.jsx)(kr, {
		...e,
		ref: t
	}) });
}), jr = /*#__PURE__*/ C.createContext({ disabled: !1 });
function Mr() {
	return C.useContext(jr);
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/field/label/FieldLabel.mjs
var Nr = /*#__PURE__*/ C.forwardRef(function(e, t) {
	let { render: n, className: r, style: i, id: a, nativeLabel: o = !0, ...s } = e, c = Rn(!1), l = Mr(), { labelId: u } = Yn(), d = {
		...c.state,
		disabled: c.disabled || l.disabled
	}, f = C.useRef(null), p = gr({
		id: u ?? a,
		native: o
	});
	return Me("label", e, {
		ref: [t, f],
		state: d,
		props: [p, s],
		stateAttributesMapping: Fn
	});
}), Pr = null;
globalThis.requestAnimationFrame;
var Fr = new class {
	callbacks = [];
	callbacksCount = 0;
	nextId = 1;
	startId = 1;
	isScheduled = !1;
	tick = (e) => {
		this.isScheduled = !1;
		let t = this.callbacks, n = this.callbacksCount;
		if (this.callbacks = [], this.callbacksCount = 0, this.startId = this.nextId, n > 0) for (let n = 0; n < t.length; n += 1) t[n]?.(e);
	};
	request(e) {
		let t = this.nextId;
		return this.nextId += 1, this.callbacks.push(e), this.callbacksCount += 1, this.isScheduled ||= (requestAnimationFrame(this.tick), !0), t;
	}
	cancel(e) {
		let t = e - this.startId;
		t < 0 || t >= this.callbacks.length || (this.callbacks[t] = null, --this.callbacksCount);
	}
}(), Ir = class e {
	static create() {
		return new e();
	}
	static request(e) {
		return Fr.request(e);
	}
	static cancel(e) {
		return Fr.cancel(e);
	}
	currentId = Pr;
	request(e) {
		this.cancel(), this.currentId = Fr.request(() => {
			this.currentId = Pr, e();
		});
	}
	cancel = () => {
		this.currentId !== Pr && (Fr.cancel(this.currentId), this.currentId = Pr);
	};
	disposeEffect = () => this.cancel;
};
function Lr() {
	let e = E(Ir.create).current;
	return vr(e.disposeEffect), e;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/resolveRef.mjs
function Rr(e) {
	return e == null ? e : "current" in e ? e.current : e;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/useAnimationsFinished.mjs
var zr = /* @__PURE__ */ c(m(), 1);
function Br(e, t = !1) {
	let n = Lr();
	return k((r, i = null) => {
		n.cancel();
		let a = Rr(e);
		if (a == null) return;
		let o = a, s = () => {
			zr.flushSync(r);
		};
		if (typeof o.getAnimations != "function" || globalThis.BASE_UI_ANIMATIONS_DISABLED) {
			r();
			return;
		}
		function c() {
			Promise.all(o.getAnimations().map((e) => e.finished)).then(() => {
				i?.aborted || s();
			}, () => {
				if (!i?.aborted) {
					if (o.getAnimations().some((e) => e.pending || e.playState !== "finished")) {
						c();
						return;
					}
					s();
				}
			});
		}
		if (t) {
			let e = "data-starting-style";
			if (!o.hasAttribute(e)) {
				n.request(c);
				return;
			}
			let t = new MutationObserver(() => {
				o.hasAttribute(e) || (t.disconnect(), c());
			});
			t.observe(o, {
				attributes: !0,
				attributeFilter: [e]
			}), i?.addEventListener("abort", () => t.disconnect(), { once: !0 });
			return;
		}
		n.request(c);
	});
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/useOpenChangeComplete.mjs
function Vr(e) {
	let { enabled: t = !0, open: n, ref: r, onComplete: i } = e, a = k(i), o = Br(r, n);
	C.useEffect(() => {
		if (!t) return;
		let e = new AbortController();
		return o(a, e.signal), () => {
			e.abort();
		};
	}, [
		t,
		n,
		a,
		o
	]);
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/stateAttributesMapping.mjs
var Hr = { "data-starting-style": "" }, Ur = { "data-ending-style": "" }, Wr = { transitionStatus(e) {
	return e === "starting" ? Hr : e === "ending" ? Ur : null;
} };
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/useTransitionStatus.mjs
function Gr(e, t = !1, n = !1) {
	let [r, i] = C.useState(e && t ? "idle" : void 0), [a, o] = C.useState(e);
	return e && !a && (o(!0), i("starting")), !e && a && r !== "ending" && !n && i("ending"), !e && !a && r === "ending" && i(void 0), M(() => {
		if (!e && a && r !== "ending" && n) {
			let e = Ir.request(() => {
				i("ending");
			});
			return () => {
				Ir.cancel(e);
			};
		}
	}, [
		e,
		a,
		r,
		n
	]), M(() => {
		if (!e || t) return;
		let n = Ir.request(() => {
			i(void 0);
		});
		return () => {
			Ir.cancel(n);
		};
	}, [t, e]), M(() => {
		if (!e || !t) return;
		e && a && r !== "idle" && i("starting");
		let n = Ir.request(() => {
			i("idle");
		});
		return () => {
			Ir.cancel(n);
		};
	}, [
		t,
		e,
		a,
		r
	]), {
		mounted: a,
		setMounted: o,
		transitionStatus: r
	};
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/field/error/FieldError.mjs
var Kr = {
	...Fn,
	...Wr
}, qr = /*#__PURE__*/ C.forwardRef(function(e, t) {
	let { render: n, id: r, className: i, match: a, style: o, ...s } = e, c = qn(r), { validityData: l, state: u, name: d } = Rn(!1), { setMessageIds: f } = Yn(), { errors: p } = Hn(), m = d && Object.hasOwn(p, d) ? p[d] : null, h = !!(Array.isArray(m) ? m.length : m), g = typeof a == "string", _ = !1;
	_ = a === !0 ? !0 : u.disabled ? !1 : g ? !!l.state[a] : h || l.state.valid === !1;
	let { mounted: v, transitionStatus: y, setMounted: b } = Gr(_);
	M(() => {
		if (!(!_ || !c)) return f((e) => e.concat(c)), () => {
			f((e) => e.filter((e) => e !== c));
		};
	}, [
		_,
		c,
		f
	]);
	let x = C.useRef(null), [S, w] = C.useState(null), [T, E] = C.useState(null), D = l.error;
	!g && h ? D = m : l.errors.length > 1 && (D = l.errors);
	let O = D;
	Array.isArray(D) && (O = D.length > 1 ? /*#__PURE__*/ (0, G.jsx)("ul", { children: D.map((e) => /*#__PURE__*/ (0, G.jsx)("li", { children: e }, e)) }) : D[0]);
	let k = Array.isArray(D) ? JSON.stringify(D) : D;
	_ && k !== T && (E(k), w(O)), Vr({
		open: _,
		ref: x,
		onComplete() {
			_ || b(!1);
		}
	});
	let A = {
		...u,
		transitionStatus: y
	}, j = Me("div", e, {
		ref: [t, x],
		state: A,
		props: [{
			id: c,
			children: _ ? O : S
		}, s],
		stateAttributesMapping: Kr,
		enabled: v
	});
	return v ? j : null;
});
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/useControlled.mjs
function Jr({ controlled: e, default: t, name: n, state: r = "value" }) {
	let { current: i } = C.useRef(e !== void 0), [a, o] = C.useState(t);
	return [i ? e : a, C.useCallback((e) => {
		i || o(e);
	}, [])];
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/field-register-control/useRegisterFieldControl.mjs
function Yr(e, t, n, r, i = !0, a) {
	let { registerFieldControl: o } = Rn(), s = E(() => Symbol());
	M(() => {
		let c = s.current;
		if (!i) {
			o(c, void 0);
			return;
		}
		o(c, {
			controlRef: e,
			getValue: r,
			id: t,
			name: a,
			value: n
		});
	}, [
		e,
		i,
		r,
		t,
		a,
		o,
		s,
		n
	]), M(() => {
		let e = s.current;
		return () => {
			o(e, void 0);
		};
	}, [o, s]);
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/reason-parts.mjs
var Xr = "none", Zr = "track-press", Qr = "input-change", $r = "keyboard", ei = "drag", ti = "disabled", ni = "missing", ri = "initial";
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/createBaseUIEventDetails.mjs
function ii(e, t, n, r) {
	let i = !1, a = !1, o = r ?? Oe;
	return {
		reason: e,
		event: t ?? new Event("base-ui"),
		cancel() {
			i = !0;
		},
		allowPropagation() {
			a = !0;
		},
		get isCanceled() {
			return i;
		},
		get isPropagationAllowed() {
			return a;
		},
		trigger: n,
		...o
	};
}
function ai(e, t, n) {
	let r = n ?? Oe;
	return {
		reason: e,
		event: t ?? new Event("base-ui"),
		...r
	};
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/field/control/FieldControl.mjs
var oi = /*#__PURE__*/ C.forwardRef(function(e, t) {
	let { render: n, className: r, id: i, name: a, value: o, disabled: s = !1, onValueChange: c, defaultValue: l, autoFocus: u = !1, style: d, ...f } = e, { state: p, name: m, disabled: h, setTouched: g, setDirty: _, validityData: v, setFocused: y, setFilled: b, validationMode: x, validation: S } = Rn(), { clearErrors: w } = Hn(), T = h || s, E = m ?? a, D = {
		...p,
		disabled: T
	}, { labelId: O } = Yn(), A = Zn({ id: i });
	M(() => {
		let e = o != null;
		S.inputRef.current?.value || e && o !== "" ? b(!0) : e && o === "" && b(!1);
	}, [
		S.inputRef,
		b,
		o
	]);
	let j = C.useRef(null);
	M(() => {
		u && j.current === ir(fe(j.current)) && y(!0);
	}, [u, y]);
	let [N] = Jr({
		controlled: o,
		default: l,
		name: "FieldControl",
		state: "value"
	}), P = o !== void 0, ee = P ? N : void 0, F = k(() => S.inputRef.current?.value);
	return Yr(S.inputRef, A, ee, F, !T, a), Me("input", e, {
		ref: [t, j],
		state: D,
		props: [
			{
				id: A,
				disabled: T,
				name: E,
				ref: S.inputRef,
				"aria-labelledby": O,
				autoFocus: u,
				...P ? { value: ee } : { defaultValue: l },
				onChange(e) {
					let t = e.currentTarget.value;
					c?.(t, ii(Xr, e.nativeEvent)), _(t !== (v.initialValue ?? "")), b(t !== ""), e.nativeEvent.defaultPrevented || (w(E), S.change(t));
				},
				onFocus() {
					y(!0);
				},
				onBlur(e) {
					g(!0), y(!1), x === "onBlur" && S.commit(e.currentTarget.value);
				},
				onKeyDown(e) {
					e.currentTarget.tagName === "INPUT" && e.key === "Enter" && (g(!0), S.commit(e.currentTarget.value));
				}
			},
			f,
			(e) => S.getValidationProps(T, e)
		],
		stateAttributesMapping: Fn
	});
}), si = {
	normal: "'wght' 400, 'opsz' 14",
	medium: "'wght' 450, 'opsz' 15",
	semibold: "'wght' 550, 'opsz' 18",
	bold: "'wght' 700, 'opsz' 25"
}, ci = 3;
function li(e, t = {}) {
	let { axis: n = "y", isItemDisabled: r } = t, i = (0, C.useRef)(/* @__PURE__ */ new Map()), [a, o] = (0, C.useState)(null), [s, c] = (0, C.useState)([]), [l, u] = (0, C.useState)(!1), d = (0, C.useRef)([]), f = (0, C.useRef)(0), p = (0, C.useRef)(null), m = (0, C.useRef)(null), h = (0, C.useCallback)(() => {
		let t = e.current;
		if (!t) return !1;
		let n = [], r = !0;
		if (i.current.forEach((e, i) => {
			if (!(e.offsetParent !== null || e.offsetWidth > 0 || e.offsetHeight > 0)) {
				r = !1;
				return;
			}
			let a = e.offsetTop, o = e.offsetLeft, s = e.offsetParent;
			for (; s && s !== t && t.contains(s);) a += s.offsetTop + s.clientTop, o += s.offsetLeft + s.clientLeft, s = s.offsetParent;
			n[i] = {
				top: a,
				height: e.offsetHeight,
				left: o,
				width: e.offsetWidth
			};
		}), !r) return !1;
		let a = d.current, o = a.length !== n.length;
		for (let e = 0; !o && e < n.length; e++) {
			let t = a[e], r = n[e];
			t !== r && (o = !t || !r || t.top !== r.top || t.left !== r.left || t.width !== r.width || t.height !== r.height);
		}
		return o && (d.current = n, c(n)), !0;
	}, [e]), g = (0, C.useCallback)(() => {
		h();
	}, [h]), _ = (0, C.useCallback)((e) => {
		m.current !== null && cancelAnimationFrame(m.current), m.current = requestAnimationFrame(() => {
			m.current = null, h() ? u(!0) : e > 1 && _(e - 1);
		});
	}, [h]), v = (0, C.useCallback)(() => {
		u(!1), _(ci);
	}, [_]), y = (0, C.useRef)(null), b = (0, C.useCallback)(() => (y.current === null && typeof ResizeObserver < "u" && (y.current = new ResizeObserver(() => _(ci))), y.current), [_]), x = (0, C.useCallback)((e, t) => {
		if (t) i.current.set(e, t), b()?.observe(t);
		else {
			let t = i.current.get(e);
			t && y.current?.unobserve(t), i.current.delete(e);
		}
		v();
	}, [v, b]), S = (0, C.useCallback)((t) => {
		let a = t.clientX, s = t.clientY;
		p.current !== null && cancelAnimationFrame(p.current), p.current = requestAnimationFrame(() => {
			p.current = null;
			let t = e.current;
			if (!t) return;
			let c = t.getBoundingClientRect();
			if (n === "xy") {
				let e = null, n = Infinity, l = null, u = d.current, f = t.scrollLeft, p = t.scrollTop, m = t.clientLeft, h = t.clientTop, g = t.offsetWidth > 0 ? c.width / t.offsetWidth : 1, _ = t.offsetHeight > 0 ? c.height / t.offsetHeight : 1;
				for (let t = 0; t < u.length; t++) {
					let o = u[t];
					if (!o) continue;
					let d = i.current.get(t);
					if (d && r?.(d)) continue;
					let v = c.left + (m + o.left - f) * g, y = c.top + (h + o.top - p) * _, b = o.width * g, x = o.height * _;
					a >= v && a <= v + b && s >= y && s <= y + x && (l = t);
					let S = a - (v + b / 2), C = s - (y + x / 2), w = Math.hypot(S, C);
					w < n && (n = w, e = t);
				}
				o(l ?? e);
				return;
			}
			let l = n === "x" ? a : s, u = null, f = Infinity, m = null, h = d.current, g = n === "x" ? t.scrollLeft : t.scrollTop, _ = n === "x" ? t.clientLeft : t.clientTop, v = n === "x" ? c.left : c.top, y = n === "x" ? t.offsetWidth : t.offsetHeight, b = n === "x" ? c.width : c.height, x = y > 0 ? b / y : 1;
			for (let e = 0; e < h.length; e++) {
				let t = h[e];
				if (!t) continue;
				let a = i.current.get(e);
				if (a && r?.(a)) continue;
				let o = v + (_ + (n === "x" ? t.left : t.top) - g) * x, s = (n === "x" ? t.width : t.height) * x, c = o + s;
				l >= o && l <= c && (m = e);
				let d = o + s / 2, p = Math.abs(l - d);
				p < f && (f = p, u = e);
			}
			o(m ?? u);
		});
	}, [
		n,
		e,
		r
	]), w = (0, C.useCallback)(() => {
		f.current += 1;
	}, []), T = (0, C.useCallback)(() => {
		p.current !== null && (cancelAnimationFrame(p.current), p.current = null), o(null);
	}, []);
	return (0, C.useEffect)(() => {
		let t = e.current;
		if (!t || typeof ResizeObserver > "u") return;
		let n = new ResizeObserver(() => _(ci));
		return n.observe(t), () => n.disconnect();
	}, [e, _]), (0, C.useEffect)(() => () => {
		p.current !== null && cancelAnimationFrame(p.current), m.current !== null && cancelAnimationFrame(m.current), y.current?.disconnect(), y.current = null;
	}, []), {
		activeIndex: a,
		setActiveIndex: o,
		itemRects: s,
		isMeasured: l,
		sessionRef: f,
		handlers: {
			onMouseMove: S,
			onMouseEnter: w,
			onMouseLeave: T
		},
		registerItem: x,
		remeasure: v,
		measureItems: g
	};
}
//#endregion
//#region src/components/ui/input-group.tsx
var ui = (0, C.createContext)(null);
function di() {
	let e = (0, C.useContext)(ui);
	if (!e) throw Error("useInputGroup must be used within an InputGroup");
	return e;
}
var fi = (0, C.forwardRef)(({ children: e, size: t, className: n, ...r }, i) => {
	let a = (0, C.useRef)(null), { activeIndex: o, handlers: s, registerItem: c, measureItems: l } = li(a);
	(0, C.useEffect)(() => {
		l();
	}, [l, e]);
	let u = (0, C.useMemo)(() => ({
		registerItem: c,
		activeIndex: o
	}), [c, o]), d = /* @__PURE__ */ (0, G.jsx)(ui.Provider, {
		value: u,
		children: /* @__PURE__ */ (0, G.jsx)("div", {
			ref: (e) => {
				a.current = e, typeof i == "function" ? i(e) : i && (i.current = e);
			},
			onMouseEnter: s.onMouseEnter,
			onMouseMove: s.onMouseMove,
			onMouseLeave: s.onMouseLeave,
			className: _n("relative flex flex-col gap-3 w-72 max-w-full", n),
			...r,
			children: e
		})
	});
	return t ? /* @__PURE__ */ (0, G.jsx)(Dn, {
		size: t,
		children: d
	}) : d;
});
fi.displayName = "InputGroup";
var pi = (0, C.forwardRef)(({ label: e, labelHidden: t, placeholder: n, icon: r, index: i, value: a, onChange: o, error: s, disabled: c, className: l, ...u }, d) => {
	let f = (0, C.useRef)(null), p = (0, C.useRef)(null), { registerItem: m, activeIndex: h } = di(), [g, _] = (0, C.useState)(!1), v = xn(), y = En(), b = y.variant === "compact";
	(0, C.useEffect)(() => (m(i, f.current), () => m(i, null)), [i, m]);
	let x = h === i, S = x || g, w = () => {
		_(!0);
	}, T = () => {
		_(!1);
	}, E, D;
	return c ? (E = "bg-transparent", D = "ring-border") : s ? (E = g ? "bg-card" : x ? "bg-destructive-light/60" : "bg-transparent", D = g || x ? "ring-destructive/50" : "ring-transparent") : g ? (E = "bg-card", D = "ring-border") : x ? (E = "bg-muted/50", D = "ring-border") : (E = "bg-transparent", D = "ring-transparent"), /* @__PURE__ */ (0, G.jsxs)(Ar, {
		ref: (e) => {
			f.current = e, typeof d == "function" ? d(e) : d && (d.current = e);
		},
		invalid: !!s,
		disabled: c,
		className: _n("flex flex-col gap-1 cursor-text", c && "opacity-50 pointer-events-none", l),
		children: [
			/* @__PURE__ */ (0, G.jsxs)(Nr, {
				className: _n(t ? "sr-only" : "inline-grid", y.text, !t && (b ? "pl-2" : "pl-2.5")),
				children: [/* @__PURE__ */ (0, G.jsx)("span", {
					className: "col-start-1 row-start-1 invisible",
					style: { fontVariationSettings: si.semibold },
					"aria-hidden": "true",
					children: e
				}), /* @__PURE__ */ (0, G.jsx)("span", {
					className: _n("col-start-1 row-start-1", s ? "text-destructive" : "text-muted-foreground"),
					style: { fontVariationSettings: si.normal },
					children: e
				})]
			}),
			/* @__PURE__ */ (0, G.jsxs)("div", {
				onMouseDown: (e) => {
					e.target !== p.current && (e.preventDefault(), p.current?.focus());
				},
				className: _n(`flex items-center ${y.gap} ${v.input} ${b ? "px-2" : "px-2.5"} ${y.control} ring-1 transition-all duration-80`, E, D),
				children: [r && /* @__PURE__ */ (0, G.jsx)(r, {
					size: y.icon,
					strokeWidth: S ? 2 : 1.5,
					className: _n("shrink-0 transition-[color,stroke-width] duration-80", S ? "text-foreground" : "text-muted-foreground")
				}), /* @__PURE__ */ (0, G.jsx)(oi, {
					ref: p,
					type: "text",
					value: a,
					onChange: (e) => o(e.target.value),
					onFocus: w,
					onBlur: T,
					placeholder: n,
					className: _n("w-full bg-transparent text-foreground placeholder:text-muted-foreground outline-none font-[inherit]", y.text),
					style: { fontVariationSettings: si.normal },
					...u
				})]
			}),
			s && /* @__PURE__ */ (0, G.jsx)(qr, {
				match: !0,
				className: _n("text-destructive", b ? "text-[11px] pl-2" : "text-[12px] pl-2.5"),
				style: { fontVariationSettings: si.medium },
				children: s
			})
		]
	});
});
pi.displayName = "InputField";
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/context/LayoutGroupContext.mjs
var mi = (0, C.createContext)({});
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/utils/use-constant.mjs
function hi(e) {
	let t = (0, C.useRef)(null);
	return t.current === null && (t.current = e()), t.current;
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/utils/use-isomorphic-effect.mjs
var gi = typeof window < "u" ? C.useLayoutEffect : C.useEffect, _i = /* @__PURE__ */ (0, C.createContext)(null);
//#endregion
//#region node_modules/.pnpm/motion-utils@13.0.0/node_modules/motion-utils/dist/es/array.mjs
function vi(e, t) {
	e.indexOf(t) === -1 && e.push(t);
}
function yi(e, t) {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}
//#endregion
//#region node_modules/.pnpm/motion-utils@13.0.0/node_modules/motion-utils/dist/es/clamp.mjs
var bi = (e, t, n) => n > t ? t : n < e ? e : n, xi = {}, Si = (e) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(e), Ci = (e) => typeof e == "object" && !!e, wi = (e) => /^0[^.\s]+$/u.test(e);
//#endregion
//#region node_modules/.pnpm/motion-utils@13.0.0/node_modules/motion-utils/dist/es/memo.mjs
/*#__NO_SIDE_EFFECTS__*/
function Ti(e) {
	let t;
	return () => (t === void 0 && (t = e()), t);
}
//#endregion
//#region node_modules/.pnpm/motion-utils@13.0.0/node_modules/motion-utils/dist/es/noop.mjs
var Ei = /* @__NO_SIDE_EFFECTS__ */ (e) => e, Di = (...e) => e.reduce((e, t) => (n) => t(e(n))), K = /* @__NO_SIDE_EFFECTS__ */ (e, t, n) => {
	let r = t - e;
	return r ? (n - e) / r : 1;
}, Oi = class {
	constructor() {
		this.subscriptions = [];
	}
	add(e) {
		return vi(this.subscriptions, e), () => yi(this.subscriptions, e);
	}
	notify(e, t, n) {
		let r = this.subscriptions.length;
		if (r) {
			if (r === 1) this.subscriptions[0](e, t, n);
			else for (let i = 0; i < r; i++) {
				let r = this.subscriptions[i];
				r && r(e, t, n);
			}
		}
	}
	getSize() {
		return this.subscriptions.length;
	}
	clear() {
		this.subscriptions.length = 0;
	}
}, ki = /* @__NO_SIDE_EFFECTS__ */ (e) => e * 1e3, Ai = /* @__NO_SIDE_EFFECTS__ */ (e) => e / 1e3, ji = /* @__NO_SIDE_EFFECTS__ */ (e, t) => t ? 1e3 / t * e : 0, Mi = (e, t, n) => {
	let r = t - e;
	return ((n - e) % r + r) % r + e;
}, Ni = (e, t, n) => (((1 - 3 * n + 3 * t) * e + (3 * n - 6 * t)) * e + 3 * t) * e, Pi = 1e-7, Fi = 12;
function Ii(e, t, n, r, i) {
	let a, o, s = 0;
	do
		o = t + (n - t) / 2, a = Ni(o, r, i) - e, a > 0 ? n = o : t = o;
	while (Math.abs(a) > Pi && ++s < Fi);
	return o;
}
/*#__NO_SIDE_EFFECTS__*/
function Li(e, t, n, r) {
	if (e === t && n === r) return Ei;
	let i = (t) => Ii(t, 0, 1, e, n);
	return (e) => e === 0 || e === 1 ? e : Ni(i(e), t, r);
}
//#endregion
//#region node_modules/.pnpm/motion-utils@13.0.0/node_modules/motion-utils/dist/es/easing/modifiers/mirror.mjs
var Ri = /* @__NO_SIDE_EFFECTS__ */ (e) => (t) => t <= .5 ? e(2 * t) / 2 : (2 - e(2 * (1 - t))) / 2, zi = /* @__NO_SIDE_EFFECTS__ */ (e) => (t) => 1 - e(1 - t), Bi = /*@__PURE__*/ Li(.33, 1.53, .69, .99), Vi = /*@__PURE__*/ zi(Bi), Hi = /*@__PURE__*/ Ri(Vi), Ui = (e) => e >= 1 ? 1 : (e *= 2) < 1 ? .5 * Vi(e) : .5 * (2 - 2 ** (-10 * (e - 1))), Wi = (e) => 1 - Math.sin(Math.acos(e)), Gi = /* @__PURE__ */ zi(Wi), Ki = /* @__PURE__ */ Ri(Wi), qi = /*@__PURE__*/ Li(.42, 0, 1, 1), Ji = /*@__PURE__*/ Li(0, 0, .58, 1), Yi = /*@__PURE__*/ Li(.42, 0, .58, 1), Xi = /* @__NO_SIDE_EFFECTS__ */ (e) => Array.isArray(e) && typeof e[0] != "number";
//#endregion
//#region node_modules/.pnpm/motion-utils@13.0.0/node_modules/motion-utils/dist/es/easing/utils/get-easing-for-segment.mjs
/*#__NO_SIDE_EFFECTS__*/
function Zi(e, t) {
	return /* @__PURE__ */ Xi(e) ? e[Mi(0, e.length, t)] : e;
}
//#endregion
//#region node_modules/.pnpm/motion-utils@13.0.0/node_modules/motion-utils/dist/es/easing/utils/is-bezier-definition.mjs
var Qi = /* @__NO_SIDE_EFFECTS__ */ (e) => Array.isArray(e) && typeof e[0] == "number", $i = {
	linear: Ei,
	easeIn: qi,
	easeInOut: Yi,
	easeOut: Ji,
	circIn: Wi,
	circInOut: Ki,
	circOut: Gi,
	backIn: Vi,
	backInOut: Hi,
	backOut: Bi,
	anticipate: Ui
}, ea = (e) => typeof e == "string", ta = (e) => {
	if (/* @__PURE__ */ Qi(e)) {
		e.length;
		let [t, n, r, i] = e;
		return /* @__PURE__ */ Li(t, n, r, i);
	}
	return ea(e) ? ($i[e], `${e}`, $i[e]) : e;
}, na = [
	"setup",
	"read",
	"resolveKeyframes",
	"preUpdate",
	"update",
	"preRender",
	"render",
	"postRender"
];
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/frameloop/render-step.mjs
function ra(e) {
	let t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set(), r = !1, i = !1, a = /* @__PURE__ */ new WeakSet(), o = {
		delta: 0,
		timestamp: 0,
		isProcessing: !1
	};
	function s(t) {
		a.has(t) && (c.schedule(t), e()), t(o);
	}
	let c = {
		schedule: (e, i = !1, o = !1) => {
			let s = o && r ? t : n;
			return i && a.add(e), s.add(e), e;
		},
		cancel: (e) => {
			n.delete(e), a.delete(e);
		},
		process: (e) => {
			if (o = e, r) {
				i = !0;
				return;
			}
			r = !0;
			let a = t;
			t = n, n = a, t.forEach(s), t.clear(), r = !1, i && (i = !1, c.process(e));
		}
	};
	return c;
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/frameloop/batcher.mjs
var ia = 40;
function aa(e, t) {
	let n = !1, r = !0, i = {
		delta: 0,
		timestamp: 0,
		isProcessing: !1
	}, a = () => n = !0, o = na.reduce((e, t) => (e[t] = ra(a), e), {}), { setup: s, read: c, resolveKeyframes: l, preUpdate: u, update: d, preRender: f, render: p, postRender: m } = o, h = () => {
		let a = xi.useManualTiming, o = a ? i.timestamp : performance.now();
		n = !1, a || (i.delta = r ? 1e3 / 60 : Math.max(Math.min(o - i.timestamp, ia), 1)), i.timestamp = o, i.isProcessing = !0, s.process(i), c.process(i), l.process(i), u.process(i), d.process(i), f.process(i), p.process(i), m.process(i), i.isProcessing = !1, n && t && (r = !1, e(h));
	}, g = () => {
		n = !0, r = !0, i.isProcessing || e(h);
	};
	return {
		schedule: na.reduce((e, t) => {
			let r = o[t];
			return e[t] = (e, t = !1, i = !1) => (n || g(), r.schedule(e, t, i)), e;
		}, {}),
		cancel: (e) => {
			for (let t = 0; t < na.length; t++) o[na[t]].cancel(e);
		},
		state: i,
		steps: o
	};
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/frameloop/frame.mjs
var { schedule: oa, cancel: sa, state: ca, steps: la } = /* @__PURE__ */ aa(typeof requestAnimationFrame < "u" ? requestAnimationFrame : Ei, !0), ua;
function da() {
	ua = void 0;
}
var fa = {
	now: () => (ua === void 0 && fa.set(ca.isProcessing || xi.useManualTiming ? ca.timestamp : performance.now()), ua),
	set: (e) => {
		ua = e, queueMicrotask(da);
	}
}, pa = (e) => (t) => typeof t == "string" && t.startsWith(e), ma = /*@__PURE__*/ pa("--"), ha = /*@__PURE__*/ pa("var(--"), ga = (e) => ha(e) ? _a.test(e.split("/*")[0].trim()) : !1, _a = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
function va(e) {
	return typeof e == "string" && e.split("/*")[0].includes("var(--");
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/value/types/numbers/index.mjs
var ya = {
	test: (e) => typeof e == "number",
	parse: parseFloat,
	transform: (e) => e
}, ba = {
	...ya,
	transform: (e) => bi(0, 1, e)
}, xa = {
	...ya,
	default: 1
}, Sa = (e) => Math.round(e * 1e5) / 1e5, Ca = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/value/types/utils/is-nullish.mjs
function wa(e) {
	return e == null;
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/value/types/utils/single-color-regex.mjs
var Ta = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu, Ea = (e, t) => (n) => !!(typeof n == "string" && Ta.test(n) && n.startsWith(e) || t && !wa(n) && Object.prototype.hasOwnProperty.call(n, t)), Da = (e, t, n) => (r) => {
	if (typeof r != "string") return r;
	let [i, a, o, s] = r.match(Ca);
	return {
		[e]: parseFloat(i),
		[t]: parseFloat(a),
		[n]: parseFloat(o),
		alpha: s === void 0 ? 1 : parseFloat(s)
	};
}, Oa = (e) => bi(0, 255, e), ka = {
	...ya,
	transform: (e) => Math.round(Oa(e))
}, Aa = {
	test: /*@__PURE__*/ Ea("rgb", "red"),
	parse: /*@__PURE__*/ Da("red", "green", "blue"),
	transform: ({ red: e, green: t, blue: n, alpha: r = 1 }) => "rgba(" + ka.transform(e) + ", " + ka.transform(t) + ", " + ka.transform(n) + ", " + Sa(ba.transform(r)) + ")"
};
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/value/types/color/hex.mjs
function ja(e) {
	let t = "", n = "", r = "", i = "";
	return e.length > 5 ? (t = e.substring(1, 3), n = e.substring(3, 5), r = e.substring(5, 7), i = e.substring(7, 9)) : (t = e.substring(1, 2), n = e.substring(2, 3), r = e.substring(3, 4), i = e.substring(4, 5), t += t, n += n, r += r, i += i), {
		red: parseInt(t, 16),
		green: parseInt(n, 16),
		blue: parseInt(r, 16),
		alpha: i ? parseInt(i, 16) / 255 : 1
	};
}
var Ma = {
	test: /*@__PURE__*/ Ea("#"),
	parse: ja,
	transform: Aa.transform
}, Na = /* @__NO_SIDE_EFFECTS__ */ (e) => ({
	test: (t) => typeof t == "string" && t.endsWith(e) && t.split(" ").length === 1,
	parse: parseFloat,
	transform: (t) => `${t}${e}`
}), Pa = /*@__PURE__*/ Na("deg"), Fa = /*@__PURE__*/ Na("%"), q = /*@__PURE__*/ Na("px"), Ia = /*@__PURE__*/ Na("vh"), La = /*@__PURE__*/ Na("vw"), Ra = {
	...Fa,
	parse: (e) => Fa.parse(e) / 100,
	transform: (e) => Fa.transform(e * 100)
}, za = {
	test: /*@__PURE__*/ Ea("hsl", "hue"),
	parse: /*@__PURE__*/ Da("hue", "saturation", "lightness"),
	transform: ({ hue: e, saturation: t, lightness: n, alpha: r = 1 }) => "hsla(" + Math.round(e) + ", " + Fa.transform(Sa(t)) + ", " + Fa.transform(Sa(n)) + ", " + Sa(ba.transform(r)) + ")"
}, Ba = {
	test: (e) => Aa.test(e) || Ma.test(e) || za.test(e),
	parse: (e) => Aa.test(e) ? Aa.parse(e) : za.test(e) ? za.parse(e) : Ma.parse(e),
	transform: (e) => typeof e == "string" ? e : e.hasOwnProperty("red") ? Aa.transform(e) : za.transform(e),
	getAnimatableNone: (e) => {
		let t = Ba.parse(e);
		return t.alpha = 0, Ba.transform(t);
	}
}, Va = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/value/types/complex/index.mjs
function Ha(e) {
	return isNaN(e) && typeof e == "string" && (e.match(Ca)?.length || 0) + (e.match(Va)?.length || 0) > 0;
}
var Ua = "number", Wa = "color", Ga = "var", Ka = "var(", qa = "${}", Ja = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function Ya(e) {
	let t = e.toString(), n = [], r = {
		color: [],
		number: [],
		var: []
	}, i = [], a = 0;
	return {
		values: n,
		split: t.replace(Ja, (e) => (Ba.test(e) ? (r.color.push(a), i.push(Wa), n.push(Ba.parse(e))) : e.startsWith(Ka) ? (r.var.push(a), i.push(Ga), n.push(e)) : (r.number.push(a), i.push(Ua), n.push(parseFloat(e))), ++a, qa)).split(qa),
		indexes: r,
		types: i
	};
}
function Xa(e) {
	return Ya(e).values;
}
function Za({ split: e, types: t }) {
	let n = e.length;
	return (r) => {
		let i = "";
		for (let a = 0; a < n; a++) if (i += e[a], r[a] !== void 0) {
			let e = t[a];
			i += e === Ua ? Sa(r[a]) : e === Wa ? Ba.transform(r[a]) : r[a];
		}
		return i;
	};
}
function Qa(e) {
	return Za(Ya(e));
}
var $a = (e) => typeof e == "number" ? 0 : Ba.test(e) ? Ba.getAnimatableNone(e) : e, eo = (e, t) => typeof e == "number" ? t?.trim().endsWith("/") ? e : 0 : $a(e);
function to(e) {
	let t = Ya(e);
	return Za(t)(t.values.map((e, n) => eo(e, t.split[n])));
}
var no = {
	test: Ha,
	parse: Xa,
	createTransformer: Qa,
	getAnimatableNone: to
};
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/value/types/color/hsla-to-rgba.mjs
function ro(e, t, n) {
	return n < 0 && (n += 1), n > 1 && --n, n < 1 / 6 ? e + (t - e) * 6 * n : n < 1 / 2 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e;
}
function io({ hue: e, saturation: t, lightness: n, alpha: r }) {
	e /= 360, t /= 100, n /= 100;
	let i = 0, a = 0, o = 0;
	if (!t) i = a = o = n;
	else {
		let r = n < .5 ? n * (1 + t) : n + t - n * t, s = 2 * n - r;
		i = ro(s, r, e + 1 / 3), a = ro(s, r, e), o = ro(s, r, e - 1 / 3);
	}
	return {
		red: Math.round(i * 255),
		green: Math.round(a * 255),
		blue: Math.round(o * 255),
		alpha: r
	};
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/utils/mix/immediate.mjs
function J(e, t) {
	return (n) => n > 0 ? t : e;
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/utils/mix/number.mjs
var Y = (e, t, n) => e + (t - e) * n, ao = (e, t, n) => {
	let r = e * e, i = n * (t * t - r) + r;
	return i < 0 ? 0 : Math.sqrt(i);
}, oo = [
	Ma,
	Aa,
	za
], so = (e) => oo.find((t) => t.test(e));
function co(e) {
	let t = so(e);
	if (`${e}`, !t) return !1;
	let n = t.parse(e);
	return t === za && (n = io(n)), n;
}
var lo = (e, t) => {
	let n = co(e), r = co(t);
	if (!n || !r) return J(e, t);
	let i = { ...n };
	return (e) => (i.red = ao(n.red, r.red, e), i.green = ao(n.green, r.green, e), i.blue = ao(n.blue, r.blue, e), i.alpha = Y(n.alpha, r.alpha, e), Aa.transform(i));
}, uo = /* @__PURE__ */ new Set(["none", "hidden"]);
function fo(e, t) {
	return uo.has(e) ? (n) => n <= 0 ? e : t : (n) => n >= 1 ? t : e;
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/utils/mix/complex.mjs
function po(e, t) {
	return (n) => Y(e, t, n);
}
function mo(e) {
	return typeof e == "number" ? po : typeof e == "string" ? ga(e) ? J : Ba.test(e) ? lo : vo : Array.isArray(e) ? ho : typeof e == "object" ? Ba.test(e) ? lo : go : J;
}
function ho(e, t) {
	let n = [...e], r = n.length, i = e.map((e, n) => mo(e)(e, t[n]));
	return (e) => {
		for (let t = 0; t < r; t++) n[t] = i[t](e);
		return n;
	};
}
function go(e, t) {
	let n = {
		...e,
		...t
	}, r = {};
	for (let i in n) e[i] !== void 0 && t[i] !== void 0 && (r[i] = mo(e[i])(e[i], t[i]));
	return (e) => {
		for (let t in r) n[t] = r[t](e);
		return n;
	};
}
function _o(e, t) {
	let n = [], r = {
		color: 0,
		var: 0,
		number: 0
	};
	for (let i = 0; i < t.values.length; i++) {
		let a = t.types[i], o = e.indexes[a][r[a]], s = e.values[o] ?? 0;
		n[i] = s, r[a]++;
	}
	return n;
}
var vo = (e, t) => {
	let n = no.createTransformer(t), r = Ya(e), i = Ya(t);
	return r.indexes.var.length === i.indexes.var.length && r.indexes.color.length === i.indexes.color.length && r.indexes.number.length >= i.indexes.number.length ? uo.has(e) && !i.values.length || uo.has(t) && !r.values.length ? fo(e, t) : Di(ho(_o(r, i), i.values), n) : (`${e}${t}`, J(e, t));
};
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/utils/mix/index.mjs
function yo(e, t, n) {
	return typeof e == "number" && typeof t == "number" && typeof n == "number" ? Y(e, t, n) : mo(e)(e, t);
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/animation/drivers/frame.mjs
var bo = (e) => {
	let t = ({ timestamp: t }) => e(t);
	return {
		start: (e = !0) => oa.update(t, e),
		stop: () => sa(t),
		now: () => ca.isProcessing ? ca.timestamp : fa.now()
	};
}, xo = (e, t, n = 10) => {
	let r = "", i = Math.max(Math.round(t / n), 2);
	for (let t = 0; t < i; t++) r += Math.round(e(t / (i - 1)) * 1e4) / 1e4 + ", ";
	return `linear(${r.substring(0, r.length - 2)})`;
}, So = 2e4;
function Co(e) {
	let t = 0, n = e.next(t);
	for (; !n.done && t < 2e4;) t += 50, n = e.next(t);
	return t >= 2e4 ? Infinity : t;
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/animation/generators/utils/create-generator-easing.mjs
function wo(e, t = 100, n) {
	let r = n({
		...e,
		keyframes: [0, t]
	}), i = Math.min(Co(r), So);
	return {
		type: "keyframes",
		ease: (e) => r.next(i * e).value / t,
		duration: /* @__PURE__ */ Ai(i)
	};
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/animation/generators/spring.mjs
var To = {
	stiffness: 100,
	damping: 10,
	mass: 1,
	velocity: 0,
	duration: 800,
	bounce: .3,
	visualDuration: .3,
	restSpeed: {
		granular: .01,
		default: 2
	},
	restDelta: {
		granular: .005,
		default: .5
	},
	minDuration: .01,
	maxDuration: 10,
	minDamping: .05,
	maxDamping: 1
};
function Eo(e, t) {
	return e * Math.sqrt(1 - t * t);
}
var Do = 12;
function Oo(e, t, n) {
	let r = n;
	for (let n = 1; n < Do; n++) r -= e(r) / t(r);
	return r;
}
var ko = .001;
function Ao({ duration: e = To.duration, bounce: t = To.bounce, velocity: n = To.velocity, mass: r = To.mass }) {
	let i, a;
	To.maxDuration;
	let o = 1 - t;
	o = bi(To.minDamping, To.maxDamping, o), e = bi(To.minDuration, To.maxDuration, /* @__PURE__ */ Ai(e)), o < 1 ? (i = (t) => {
		let r = t * o, i = r * e, a = r - n, s = Eo(t, o), c = Math.exp(-i);
		return ko - a / s * c;
	}, a = (t) => {
		let r = t * o * e, a = r * n + n, s = o ** 2 * t ** 2 * e, c = Math.exp(-r), l = Eo(t ** 2, o);
		return (-i(t) + ko > 0 ? -1 : 1) * ((a - s) * c) / l;
	}) : (i = (t) => -.001 + Math.exp(-t * e) * ((t - n) * e + 1), a = (t) => Math.exp(-t * e) * ((n - t) * (e * e)));
	let s = 5 / e, c = Oo(i, a, s);
	if (e = /* @__PURE__ */ ki(e), isNaN(c)) return {
		stiffness: To.stiffness,
		damping: To.damping,
		duration: e
	};
	{
		let t = c ** 2 * r;
		return {
			stiffness: t,
			damping: o * 2 * Math.sqrt(r * t),
			duration: e
		};
	}
}
var jo = ["duration", "bounce"], Mo = [
	"stiffness",
	"damping",
	"mass"
];
function No(e, t) {
	return t.some((t) => e[t] !== void 0);
}
function Po(e) {
	let t = {
		velocity: To.velocity,
		stiffness: To.stiffness,
		damping: To.damping,
		mass: To.mass,
		isResolvedFromDuration: !1,
		...e
	};
	if (!No(e, Mo) && No(e, jo)) {
		if (t.velocity = 0, e.visualDuration) {
			let n = e.visualDuration, r = 2 * Math.PI / (n * 1.2), i = r * r, a = 2 * bi(.05, 1, 1 - (e.bounce || 0)) * Math.sqrt(i);
			t = {
				...t,
				mass: To.mass,
				stiffness: i,
				damping: a
			};
		} else {
			let n = Ao({
				...e,
				velocity: 0
			});
			t = {
				...t,
				...n,
				mass: To.mass
			}, t.isResolvedFromDuration = !0;
		}
	}
	return t;
}
function Fo(e = To.visualDuration, t = To.bounce) {
	let n = typeof e == "object" ? e : {
		visualDuration: e,
		keyframes: [0, 1],
		bounce: t
	}, { restSpeed: r, restDelta: i } = n, a = n.keyframes[0], o = n.keyframes[n.keyframes.length - 1], s = {
		done: !1,
		value: a
	}, { stiffness: c, damping: l, mass: u, duration: d, velocity: f, isResolvedFromDuration: p } = Po({
		...n,
		velocity: -/* @__PURE__ */ Ai(n.velocity || 0)
	}), m = f || 0, h = l / (2 * Math.sqrt(c * u)), g = o - a, _ = /* @__PURE__ */ Ai(Math.sqrt(c / u)), v = Math.abs(g) < 5;
	r ||= v ? To.restSpeed.granular : To.restSpeed.default, i ||= v ? To.restDelta.granular : To.restDelta.default;
	let y, b, x, S, C, w;
	if (h < 1) x = Eo(_, h), S = (m + h * _ * g) / x, y = (e) => {
		let t = Math.exp(-h * _ * e);
		return o - t * (S * Math.sin(x * e) + g * Math.cos(x * e));
	}, C = h * _ * S + g * x, w = h * _ * g - S * x, b = (e) => Math.exp(-h * _ * e) * (C * Math.sin(x * e) + w * Math.cos(x * e));
	else if (h === 1) {
		y = (e) => o - Math.exp(-_ * e) * (g + (m + _ * g) * e);
		let e = m + _ * g;
		b = (t) => Math.exp(-_ * t) * (_ * e * t - m);
	} else {
		let e = _ * Math.sqrt(h * h - 1);
		y = (t) => {
			let n = Math.exp(-h * _ * t), r = Math.min(e * t, 300);
			return o - n * ((m + h * _ * g) * Math.sinh(r) + e * g * Math.cosh(r)) / e;
		};
		let t = (m + h * _ * g) / e, n = h * _ * t - g * e, r = h * _ * g - t * e;
		b = (t) => {
			let i = Math.exp(-h * _ * t), a = Math.min(e * t, 300);
			return i * (n * Math.sinh(a) + r * Math.cosh(a));
		};
	}
	let T = {
		calculatedDuration: p && d || null,
		velocity: (e) => /* @__PURE__ */ ki(b(e)),
		next: (e) => {
			if (!p && h < 1) {
				let t = Math.exp(-h * _ * e), n = Math.sin(x * e), a = Math.cos(x * e), c = o - t * (S * n + g * a), l = /* @__PURE__ */ ki(t * (C * n + w * a));
				return s.done = Math.abs(l) <= r && Math.abs(o - c) <= i, s.value = s.done ? o : c, s;
			}
			let t = y(e);
			if (p) s.done = e >= d;
			else {
				let n = /* @__PURE__ */ ki(b(e));
				s.done = Math.abs(n) <= r && Math.abs(o - t) <= i;
			}
			return s.value = s.done ? o : t, s;
		},
		toString: () => {
			let e = Math.min(Co(T), So), t = xo((t) => T.next(e * t).value, e, 30);
			return e + "ms " + t;
		},
		toTransition: () => {}
	};
	return T;
}
Fo.applyToOptions = (e) => {
	let t = wo(e, 100, Fo);
	return e.ease = t.ease, e.duration = /* @__PURE__ */ ki(t.duration), e.type = "keyframes", e;
};
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/animation/generators/utils/velocity.mjs
var Io = 5;
function Lo(e, t, n) {
	let r = Math.max(t - Io, 0);
	return /* @__PURE__ */ ji(n - e(r), t - r);
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/animation/generators/inertia.mjs
function Ro({ keyframes: e, velocity: t = 0, power: n = .8, timeConstant: r = 325, bounceDamping: i = 10, bounceStiffness: a = 500, modifyTarget: o, min: s, max: c, restDelta: l = .5, restSpeed: u }) {
	let d = e[0], f = {
		done: !1,
		value: d
	}, p = (e) => s !== void 0 && e < s || c !== void 0 && e > c, m = (e) => s === void 0 ? c : c === void 0 || Math.abs(s - e) < Math.abs(c - e) ? s : c, h = n * t, g = d + h, _ = o === void 0 ? g : o(g);
	_ !== g && (h = _ - d);
	let v = (e) => -h * Math.exp(-e / r), y = (e) => _ + v(e), b = (e) => {
		let t = v(e), n = y(e);
		f.done = Math.abs(t) <= l, f.value = f.done ? _ : n;
	}, x, S, C = (e) => {
		p(f.value) && (x = e, S = Fo({
			keyframes: [f.value, m(f.value)],
			velocity: Lo(y, e, f.value),
			damping: i,
			stiffness: a,
			restDelta: l,
			restSpeed: u
		}));
	};
	return C(0), {
		calculatedDuration: null,
		next: (e) => {
			let t = !1;
			return !S && x === void 0 && (t = !0, b(e), C(e)), x !== void 0 && e >= x ? S.next(e - x) : (!t && b(e), f);
		}
	};
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/utils/interpolate.mjs
function zo(e, t, n) {
	let r = [], i = n || xi.mix || yo, a = e.length - 1;
	for (let n = 0; n < a; n++) {
		let a = i(e[n], e[n + 1]);
		t && (a = Di(Array.isArray(t) ? t[n] || Ei : t, a)), r.push(a);
	}
	return r;
}
function Bo(e, t, { clamp: n = !0, ease: r, mixer: i } = {}) {
	let a = e.length;
	if (t.length, a === 1) return () => t[0];
	if (a === 2 && t[0] === t[1]) return () => t[1];
	let o = e[0] === e[1];
	e[0] > e[a - 1] && (e = [...e].reverse(), t = [...t].reverse());
	let s = zo(t, r, i), c = s.length, l = (n) => {
		if (o && n < e[0]) return t[0];
		let r = 0;
		if (c > 1) for (; r < e.length - 2 && !(n < e[r + 1]); r++);
		let i = /* @__PURE__ */ K(e[r], e[r + 1], n);
		return s[r](i);
	};
	return n ? (t) => l(bi(e[0], e[a - 1], t)) : l;
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/animation/keyframes/offsets/fill.mjs
function Vo(e, t) {
	let n = e[e.length - 1];
	for (let r = 1; r <= t; r++) {
		let i = /* @__PURE__ */ K(0, t, r);
		e.push(Y(n, 1, i));
	}
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/animation/keyframes/offsets/default.mjs
function Ho(e) {
	let t = [0];
	return Vo(t, e.length - 1), t;
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/animation/keyframes/offsets/time.mjs
function Uo(e, t) {
	return e.map((e) => e * t);
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/animation/generators/keyframes.mjs
function Wo(e, t) {
	return e.map(() => t || Yi).splice(0, e.length - 1);
}
function Go({ duration: e = 300, keyframes: t, times: n, ease: r = "easeInOut" }) {
	let i = /* @__PURE__ */ Xi(r) ? r.map(ta) : ta(r), a = {
		done: !1,
		value: t[0]
	}, o = Bo(Uo(n && n.length === t.length ? n : Ho(t), e), t, { ease: Array.isArray(i) ? i : Wo(t, i) });
	return {
		calculatedDuration: e,
		next: (t) => (a.value = o(t), a.done = t >= e, a)
	};
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/animation/keyframes/get-final.mjs
var Ko = (e) => e !== null;
function qo(e, { repeat: t, repeatType: n = "loop" }, r, i = 1) {
	let a = e.filter(Ko), o = i < 0 || t && n !== "loop" && t % 2 == 1 ? 0 : a.length - 1;
	return !o || r === void 0 ? a[o] : r;
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/animation/utils/replace-transition-type.mjs
var Jo = {
	decay: Ro,
	inertia: Ro,
	tween: Go,
	keyframes: Go,
	spring: Fo
};
function Yo(e) {
	typeof e.type == "string" && (e.type = Jo[e.type]);
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/animation/utils/WithPromise.mjs
var Xo = class {
	constructor() {
		this.updateFinished();
	}
	get finished() {
		return this._finished;
	}
	updateFinished() {
		this._finished = new Promise((e) => {
			this.resolve = e;
		});
	}
	notifyFinished() {
		this.resolve();
	}
	then(e, t) {
		return this.finished.then(e, t);
	}
}, Zo = (e) => e / 100, Qo = class extends Xo {
	constructor(e) {
		super(), this.state = "idle", this.startTime = null, this.isStopped = !1, this.currentTime = 0, this.holdTime = null, this.playbackSpeed = 1, this.delayState = {
			done: !1,
			value: void 0
		}, this.stop = () => {
			let { motionValue: e } = this.options;
			e && e.updatedAt !== fa.now() && this.tick(fa.now()), this.isStopped = !0, this.state !== "idle" && (this.teardown(), this.options.onStop?.());
		}, this.options = e, this.initAnimation(), this.play(), e.autoplay === !1 && this.pause();
	}
	initAnimation() {
		let { options: e } = this;
		Yo(e);
		let { type: t = Go, repeat: n = 0, repeatDelay: r = 0, repeatType: i, velocity: a = 0 } = e, { keyframes: o } = e, s = t || Go;
		s !== Go && typeof o[0] != "number" && (this.mixKeyframes = Di(Zo, yo(o[0], o[1])), o = [0, 100]);
		let c = s({
			...e,
			keyframes: o
		});
		i === "mirror" && (this.mirroredGenerator = s({
			...e,
			keyframes: [...o].reverse(),
			velocity: -a
		})), c.calculatedDuration === null && (c.calculatedDuration = Co(c));
		let { calculatedDuration: l } = c;
		this.calculatedDuration = l, this.resolvedDuration = l + r, this.totalDuration = this.resolvedDuration * (n + 1) - r, this.generator = c;
	}
	updateTime(e) {
		let t = Math.round(e - this.startTime) * this.playbackSpeed;
		this.currentTime = this.holdTime === null ? t : this.holdTime;
	}
	tick(e, t = !1) {
		let { generator: n, totalDuration: r, mixKeyframes: i, mirroredGenerator: a, resolvedDuration: o, calculatedDuration: s } = this;
		if (this.startTime === null) return n.next(0);
		let { delay: c = 0, keyframes: l, repeat: u, repeatType: d, repeatDelay: f, type: p, onUpdate: m, finalKeyframe: h } = this.options;
		this.speed > 0 ? this.startTime = Math.min(this.startTime, e) : this.speed < 0 && (this.startTime = Math.min(e - r / this.speed, this.startTime)), t ? this.currentTime = e : this.updateTime(e);
		let g = this.currentTime - c * (this.playbackSpeed >= 0 ? 1 : -1), _ = this.playbackSpeed >= 0 ? g < 0 : g > r;
		this.currentTime = Math.max(g, 0), this.state === "finished" && this.holdTime === null && (this.currentTime = r);
		let v = this.currentTime, y = n;
		if (u) {
			let e = Math.min(this.currentTime, r) / o, t = Math.floor(e), n = e % 1;
			!n && e >= 1 && (n = 1), n === 1 && t--, t = Math.min(t, u + 1), t % 2 && (d === "reverse" ? (n = 1 - n, f && (n -= f / o)) : d === "mirror" && (y = a)), v = bi(0, 1, n) * o;
		}
		let b;
		_ ? (this.delayState.value = l[0], b = this.delayState) : b = y.next(v), i && !_ && (b.value = i(b.value));
		let { done: x } = b;
		!_ && s !== null && (x = this.playbackSpeed >= 0 ? this.currentTime >= r : this.currentTime <= 0);
		let S = this.holdTime === null && (this.state === "finished" || this.state === "running" && x);
		return S && p !== Ro && (b.value = qo(l, this.options, h, this.speed)), m && m(b.value), S && this.finish(), b;
	}
	then(e, t) {
		return this.finished.then(e, t);
	}
	get duration() {
		return /* @__PURE__ */ Ai(this.calculatedDuration);
	}
	get iterationDuration() {
		let { delay: e = 0 } = this.options || {};
		return this.duration + /* @__PURE__ */ Ai(e);
	}
	get time() {
		return /* @__PURE__ */ Ai(this.currentTime);
	}
	set time(e) {
		e = /* @__PURE__ */ ki(e), this.currentTime = e, this.startTime === null || this.holdTime !== null || this.playbackSpeed === 0 ? this.holdTime = e : this.driver && (this.startTime = this.driver.now() - e / this.playbackSpeed), this.driver ? this.driver.start(!1) : (this.startTime = 0, this.state = "paused", this.holdTime = e, this.tick(e));
	}
	getGeneratorVelocity() {
		let e = this.currentTime;
		if (e <= 0) return this.options.velocity || 0;
		if (this.generator.velocity) return this.generator.velocity(e);
		let t = this.generator.next(e).value;
		return Lo((e) => this.generator.next(e).value, e, t);
	}
	get speed() {
		return this.playbackSpeed;
	}
	set speed(e) {
		let t = this.playbackSpeed !== e;
		t && this.driver && this.updateTime(fa.now()), this.playbackSpeed = e, t && this.driver && (this.time = /* @__PURE__ */ Ai(this.currentTime));
	}
	play() {
		if (this.isStopped) return;
		let { driver: e = bo, startTime: t } = this.options;
		this.driver ||= e((e) => this.tick(e)), this.options.onPlay?.();
		let n = this.driver.now();
		this.state === "finished" ? (this.updateFinished(), this.startTime = n) : this.holdTime === null ? this.startTime ||= t ?? n : this.startTime = n - this.holdTime, this.state === "finished" && this.speed < 0 && (this.startTime += this.calculatedDuration), this.holdTime = null, this.state = "running", this.driver.start();
	}
	pause() {
		this.state = "paused", this.updateTime(fa.now()), this.holdTime = this.currentTime;
	}
	complete() {
		this.state !== "running" && this.play(), this.state = "finished", this.holdTime = null;
	}
	finish() {
		this.notifyFinished(), this.teardown(), this.state = "finished", this.options.onComplete?.();
	}
	cancel() {
		this.holdTime = null, this.startTime = 0, this.tick(0), this.teardown(), this.options.onCancel?.();
	}
	teardown() {
		this.state = "idle", this.stopDriver(), this.startTime = this.holdTime = null;
	}
	stopDriver() {
		this.driver &&= (this.driver.stop(), void 0);
	}
	sample(e) {
		return this.startTime = 0, this.tick(e, !0);
	}
	attachTimeline(e) {
		return this.options.allowFlatten && (this.options.type = "keyframes", this.options.ease = "linear", this.initAnimation()), this.driver?.stop(), e.observe(this);
	}
};
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/animation/keyframes/utils/fill-wildcards.mjs
function $o(e) {
	for (let t = 1; t < e.length; t++) e[t] ?? (e[t] = e[t - 1]);
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/render/dom/parse-transform.mjs
var es = (e) => e * 180 / Math.PI, ts = (e) => rs(es(Math.atan2(e[1], e[0]))), ns = {
	x: 4,
	y: 5,
	translateX: 4,
	translateY: 5,
	scaleX: 0,
	scaleY: 3,
	scale: (e) => (Math.abs(e[0]) + Math.abs(e[3])) / 2,
	rotate: ts,
	rotateZ: ts,
	skewX: (e) => es(Math.atan(e[1])),
	skewY: (e) => es(Math.atan(e[2])),
	skew: (e) => (Math.abs(e[1]) + Math.abs(e[2])) / 2
}, rs = (e) => (e %= 360, e < 0 && (e += 360), e), is = ts, as = (e) => Math.sqrt(e[0] * e[0] + e[1] * e[1]), os = (e) => Math.sqrt(e[4] * e[4] + e[5] * e[5]), ss = {
	x: 12,
	y: 13,
	z: 14,
	translateX: 12,
	translateY: 13,
	translateZ: 14,
	scaleX: as,
	scaleY: os,
	scale: (e) => (as(e) + os(e)) / 2,
	rotateX: (e) => rs(es(Math.atan2(e[6], e[5]))),
	rotateY: (e) => rs(es(Math.atan2(-e[2], e[0]))),
	rotateZ: is,
	rotate: is,
	skewX: (e) => es(Math.atan(e[4])),
	skewY: (e) => es(Math.atan(e[1])),
	skew: (e) => (Math.abs(e[1]) + Math.abs(e[4])) / 2
};
function cs(e) {
	return +!!e.includes("scale");
}
function ls(e, t) {
	if (!e || e === "none") return cs(t);
	let n = e.match(/^matrix3d\(([-\d.e\s,]+)\)$/u), r, i;
	if (n) r = ss, i = n;
	else {
		let t = e.match(/^matrix\(([-\d.e\s,]+)\)$/u);
		r = ns, i = t;
	}
	if (!i) return cs(t);
	let a = r[t], o = i[1].split(",").map(ds);
	return typeof a == "function" ? a(o) : o[a];
}
var us = (e, t) => {
	let { transform: n = "none" } = getComputedStyle(e);
	return ls(n, t);
};
function ds(e) {
	return parseFloat(e.trim());
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/render/utils/keys-transform.mjs
var fs = [
	"transformPerspective",
	"x",
	"y",
	"z",
	"translateX",
	"translateY",
	"translateZ",
	"scale",
	"scaleX",
	"scaleY",
	"rotate",
	"rotateX",
	"rotateY",
	"rotateZ",
	"skew",
	"skewX",
	"skewY"
], ps = /* @__PURE__ */ new Set([...fs, "pathRotation"]), ms = (e) => e === ya || e === q, hs = /* @__PURE__ */ new Set([
	"x",
	"y",
	"z"
]), gs = fs.filter((e) => !hs.has(e));
function _s(e) {
	let t = [];
	return gs.forEach((n) => {
		let r = e.getValue(n);
		r !== void 0 && (t.push([n, r.get()]), r.set(+!!n.startsWith("scale")));
	}), t;
}
var vs = {
	width: ({ x: e }, { paddingLeft: t = "0", paddingRight: n = "0", boxSizing: r }) => {
		let i = e.max - e.min;
		return r === "border-box" ? i : i - parseFloat(t) - parseFloat(n);
	},
	height: ({ y: e }, { paddingTop: t = "0", paddingBottom: n = "0", boxSizing: r }) => {
		let i = e.max - e.min;
		return r === "border-box" ? i : i - parseFloat(t) - parseFloat(n);
	},
	top: (e, { top: t }) => parseFloat(t),
	left: (e, { left: t }) => parseFloat(t),
	bottom: ({ y: e }, { top: t }) => parseFloat(t) + (e.max - e.min),
	right: ({ x: e }, { left: t }) => parseFloat(t) + (e.max - e.min),
	x: (e, { transform: t }) => ls(t, "x"),
	y: (e, { transform: t }) => ls(t, "y")
};
vs.translateX = vs.x, vs.translateY = vs.y;
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/animation/keyframes/KeyframesResolver.mjs
var ys = /* @__PURE__ */ new Set(), bs = !1, xs = !1, Ss = !1;
function Cs() {
	if (xs) {
		let e = Array.from(ys).filter((e) => e.needsMeasurement), t = new Set(e.map((e) => e.element)), n = /* @__PURE__ */ new Map();
		t.forEach((e) => {
			let t = _s(e);
			t.length && (n.set(e, t), e.render());
		}), e.forEach((e) => e.measureInitialState()), t.forEach((e) => {
			e.render();
			let t = n.get(e);
			t && t.forEach(([t, n]) => {
				e.getValue(t)?.set(n);
			});
		}), e.forEach((e) => e.measureEndState()), e.forEach((e) => {
			e.suspendedScrollY !== void 0 && window.scrollTo(0, e.suspendedScrollY);
		});
	}
	xs = !1, bs = !1, ys.forEach((e) => e.complete(Ss)), ys.clear();
}
function ws() {
	ys.forEach((e) => {
		e.readKeyframes(), e.needsMeasurement && (xs = !0);
	});
}
function Ts() {
	Ss = !0, ws(), Cs(), Ss = !1;
}
var Es = class {
	constructor(e, t, n, r, i, a = !1) {
		this.state = "pending", this.isAsync = !1, this.needsMeasurement = !1, this.unresolvedKeyframes = [...e], this.onComplete = t, this.name = n, this.motionValue = r, this.element = i, this.isAsync = a;
	}
	scheduleResolve() {
		this.state = "scheduled", this.isAsync ? (ys.add(this), bs || (bs = !0, oa.read(ws), oa.resolveKeyframes(Cs))) : (this.readKeyframes(), this.complete());
	}
	readKeyframes() {
		let { unresolvedKeyframes: e, name: t, element: n, motionValue: r } = this;
		if (e[0] === null) {
			let i = r?.get(), a = e[e.length - 1];
			if (i !== void 0) e[0] = i;
			else if (n && t) {
				let r = n.readValue(t, a);
				r != null && (e[0] = r);
			}
			e[0] === void 0 && (e[0] = a), r && i === void 0 && r.set(e[0]);
		}
		$o(e);
	}
	setFinalKeyframe() {}
	measureInitialState() {}
	renderEndStyles() {}
	measureEndState() {}
	complete(e = !1) {
		this.state = "complete", this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, e), ys.delete(this);
	}
	cancel() {
		this.state === "scheduled" && (ys.delete(this), this.state = "pending");
	}
	resume() {
		this.state === "pending" && this.scheduleResolve();
	}
}, Ds = (e) => e.startsWith("--");
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/render/dom/style-set.mjs
function Os(e, t, n) {
	Ds(t) ? e.style.setProperty(t, n) : e.style[t] = n;
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/utils/supports/flags.mjs
var ks = {};
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/utils/supports/memo.mjs
function As(e, t) {
	let n = /* @__PURE__ */ Ti(e);
	return () => ks[t] ?? n();
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/utils/supports/scroll-timeline.mjs
var js = /* @__PURE__ */ As(() => window.ScrollTimeline !== void 0, "scrollTimeline"), Ms = /*@__PURE__*/ As(() => {
	try {
		document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
	} catch {
		return !1;
	}
	return !0;
}, "linearEasing"), Ns = ([e, t, n, r]) => `cubic-bezier(${e}, ${t}, ${n}, ${r})`, Ps = {
	linear: "linear",
	ease: "ease",
	easeIn: "ease-in",
	easeOut: "ease-out",
	easeInOut: "ease-in-out",
	circIn: /*@__PURE__*/ Ns([
		0,
		.65,
		.55,
		1
	]),
	circOut: /*@__PURE__*/ Ns([
		.55,
		0,
		1,
		.45
	]),
	backIn: /*@__PURE__*/ Ns([
		.31,
		.01,
		.66,
		-.59
	]),
	backOut: /*@__PURE__*/ Ns([
		.33,
		1.53,
		.69,
		.99
	])
};
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/animation/waapi/easing/map-easing.mjs
function Fs(e, t) {
	if (e) return typeof e == "function" ? Ms() ? xo(e, t) : "ease-out" : /* @__PURE__ */ Qi(e) ? Ns(e) : Array.isArray(e) ? e.map((e) => Fs(e, t) || Ps.easeOut) : Ps[e];
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/animation/waapi/start-waapi-animation.mjs
function Is(e, t, n, { delay: r = 0, duration: i = 300, repeat: a = 0, repeatType: o = "loop", ease: s = "easeOut", times: c } = {}, l = void 0) {
	let u = { [t]: n };
	c && (u.offset = c);
	let d = Fs(s, i);
	Array.isArray(d) && (u.easing = d);
	let f = {
		delay: r,
		duration: i,
		easing: Array.isArray(d) ? "linear" : d,
		fill: "both",
		iterations: a + 1,
		direction: o === "reverse" ? "alternate" : "normal"
	};
	return l && (f.pseudoElement = l), e.animate(u, f);
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/animation/generators/utils/is-generator.mjs
function Ls(e) {
	return typeof e == "function" && "applyToOptions" in e;
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/animation/waapi/utils/apply-generator.mjs
function Rs({ type: e, ...t }) {
	return Ls(e) && Ms() ? e.applyToOptions(t) : (t.duration ??= 300, t.ease ??= "easeOut", t);
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/animation/NativeAnimation.mjs
var zs = class extends Xo {
	constructor(e) {
		if (super(), this.finishedTime = null, this.isStopped = !1, this.manualStartTime = null, !e) return;
		let { element: t, name: n, keyframes: r, pseudoElement: i, allowFlatten: a = !1, finalKeyframe: o, onComplete: s } = e;
		this.isPseudoElement = !!i, this.allowFlatten = a, this.options = e, e.type;
		let c = Rs(e);
		this.animation = Is(t, n, r, c, i), c.autoplay === !1 && this.animation.pause(), this.animation.onfinish = () => {
			if (this.finishedTime = this.time, !i) {
				let e = qo(r, this.options, o, this.speed);
				this.updateMotionValue && this.updateMotionValue(e), Os(t, n, e), this.animation.cancel();
			}
			s?.(), this.notifyFinished();
		};
	}
	play() {
		this.isStopped || (this.manualStartTime = null, this.animation.play(), this.state === "finished" && this.updateFinished());
	}
	pause() {
		this.animation.pause();
	}
	complete() {
		this.animation.finish?.();
	}
	cancel() {
		try {
			this.animation.cancel();
		} catch {}
	}
	stop() {
		if (this.isStopped) return;
		this.isStopped = !0;
		let { state: e } = this;
		e !== "idle" && e !== "finished" && (this.updateMotionValue ? this.updateMotionValue() : this.commitStyles(), this.isPseudoElement || this.cancel());
	}
	commitStyles() {
		let e = this.options?.element;
		!this.isPseudoElement && e?.isConnected && this.animation.commitStyles?.();
	}
	get duration() {
		let e = this.animation.effect?.getComputedTiming?.().duration || 0;
		return /* @__PURE__ */ Ai(Number(e));
	}
	get iterationDuration() {
		let { delay: e = 0 } = this.options || {};
		return this.duration + /* @__PURE__ */ Ai(e);
	}
	get time() {
		return /* @__PURE__ */ Ai(Number(this.animation.currentTime) || 0);
	}
	set time(e) {
		let t = this.finishedTime !== null;
		this.manualStartTime = null, this.finishedTime = null, this.animation.currentTime = /* @__PURE__ */ ki(e), t && this.animation.pause();
	}
	get speed() {
		return this.animation.playbackRate;
	}
	set speed(e) {
		e < 0 && (this.finishedTime = null), this.animation.playbackRate = e;
	}
	get state() {
		return this.finishedTime === null ? this.animation.playState : "finished";
	}
	get startTime() {
		return this.manualStartTime ?? Number(this.animation.startTime);
	}
	set startTime(e) {
		this.manualStartTime = this.animation.startTime = e;
	}
	attachTimeline({ timeline: e, rangeStart: t, rangeEnd: n, observe: r }) {
		return this.allowFlatten && this.animation.effect?.updateTiming({ easing: "linear" }), this.animation.onfinish = null, e && js() ? (this.animation.timeline = e, t && (this.animation.rangeStart = t), n && (this.animation.rangeEnd = n), Ei) : r(this);
	}
}, Bs = {
	anticipate: Ui,
	backInOut: Hi,
	circInOut: Ki
};
function Vs(e) {
	return e in Bs;
}
function Hs(e) {
	typeof e.ease == "string" && Vs(e.ease) && (e.ease = Bs[e.ease]);
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/animation/NativeAnimationExtended.mjs
var Us = 10, Ws = class extends zs {
	constructor(e) {
		Hs(e), Yo(e), super(e), e.startTime !== void 0 && e.autoplay !== !1 && (this.startTime = e.startTime), this.options = e;
	}
	updateMotionValue(e) {
		let { motionValue: t, onUpdate: n, onComplete: r, element: i, ...a } = this.options;
		if (!t) return;
		if (e !== void 0) {
			t.set(e);
			return;
		}
		let o = new Qo({
			...a,
			autoplay: !1
		}), s = Math.max(Us, fa.now() - this.startTime), c = bi(0, Us, s - Us), l = o.sample(s).value, { name: u } = this.options;
		i && u && Os(i, u, l), t.setWithVelocity(o.sample(Math.max(0, s - c)).value, l, c), o.stop();
	}
}, Gs = (e, t) => t !== "zIndex" && !!(typeof e == "number" || Array.isArray(e) || typeof e == "string" && (no.test(e) || e === "0") && !e.startsWith("url("));
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/animation/utils/can-animate.mjs
function Ks(e) {
	let t = e[0];
	if (e.length === 1) return !0;
	for (let n = 0; n < e.length; n++) if (e[n] !== t) return !0;
}
function qs(e, t, n, r) {
	let i = e[0];
	if (i === null) return !1;
	if (t === "display" || t === "visibility") return !0;
	let a = e[e.length - 1], o = Gs(i, t), s = Gs(a, t);
	return `${t}${i}${a}${o ? a : i}`, !o || !s ? !1 : Ks(e) || (n === "spring" || Ls(n)) && r;
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/animation/utils/make-animation-instant.mjs
function Js(e) {
	e.duration = 0, e.type = "keyframes";
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/animation/waapi/utils/accelerated-values.mjs
var Ys = /* @__PURE__ */ new Set([
	"opacity",
	"clipPath",
	"filter",
	"transform",
	"backgroundColor"
]), Xs = /^(?:oklch|oklab|lab|lch|color|color-mix|light-dark)\(/;
function Zs(e) {
	for (let t = 0; t < e.length; t++) if (typeof e[t] == "string" && Xs.test(e[t])) return !0;
	return !1;
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/animation/waapi/supports/waapi.mjs
var Qs = /* @__PURE__ */ new Set([
	"color",
	"backgroundColor",
	"outlineColor",
	"fill",
	"stroke",
	"borderColor",
	"borderTopColor",
	"borderRightColor",
	"borderBottomColor",
	"borderLeftColor"
]), $s = /*@__PURE__*/ Ti(() => Object.hasOwnProperty.call(Element.prototype, "animate"));
function ec(e) {
	let { motionValue: t, name: n, repeatDelay: r, repeatType: i, damping: a, type: o, keyframes: s } = e, c = t?.owner?.current;
	if (!(c instanceof HTMLElement) && !(c instanceof SVGElement)) return !1;
	let { onUpdate: l, transformTemplate: u } = t.owner.getProps();
	return $s() && n && (Ys.has(n) || Qs.has(n) && Zs(s)) && (n !== "transform" || !u) && !l && !r && i !== "mirror" && a !== 0 && o !== "inertia";
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/animation/AsyncMotionValueAnimation.mjs
var tc = 40, nc = class extends Xo {
	constructor({ autoplay: e = !0, delay: t = 0, type: n = "keyframes", repeat: r = 0, repeatDelay: i = 0, repeatType: a = "loop", keyframes: o, name: s, motionValue: c, element: l, ...u }) {
		super(), this.stop = () => {
			this._animation && (this._animation.stop(), this.stopTimeline?.()), this.keyframeResolver?.cancel();
		}, this.createdAt = fa.now();
		let d = {
			autoplay: e,
			delay: t,
			type: n,
			repeat: r,
			repeatDelay: i,
			repeatType: a,
			name: s,
			motionValue: c,
			element: l,
			...u
		}, f = l?.KeyframeResolver || Es;
		this.keyframeResolver = new f(o, (e, t, n) => this.onKeyframesResolved(e, t, d, !n), s, c, l), this.keyframeResolver?.scheduleResolve();
	}
	onKeyframesResolved(e, t, n, r) {
		this.keyframeResolver = void 0;
		let { name: i, type: a, velocity: o, delay: s, isHandoff: c, onUpdate: l } = n;
		this.resolvedAt = fa.now();
		let u = !0;
		qs(e, i, a, o) || (u = !1, (xi.instantAnimations || !s) && l?.(qo(e, n, t)), e[0] = e[e.length - 1], Js(n), n.repeat = 0);
		let d = {
			startTime: r ? this.resolvedAt && this.resolvedAt - this.createdAt > tc ? this.resolvedAt : this.createdAt : void 0,
			finalKeyframe: t,
			...n,
			keyframes: e
		}, f = u && !c && ec(d), p = d.motionValue?.owner?.current, m;
		if (f) try {
			m = new Ws({
				...d,
				element: p
			});
		} catch {
			m = new Qo(d);
		}
		else m = new Qo(d);
		m.finished.then(() => {
			this.notifyFinished();
		}).catch(Ei), this.pendingTimeline &&= (this.stopTimeline = m.attachTimeline(this.pendingTimeline), void 0), this._animation = m;
	}
	get finished() {
		return this._animation ? this.animation.finished : this._finished;
	}
	then(e, t) {
		return this.finished.finally(e).then(() => {});
	}
	get animation() {
		return this._animation || (this.keyframeResolver?.resume(), Ts()), this._animation;
	}
	get duration() {
		return this.animation.duration;
	}
	get iterationDuration() {
		return this.animation.iterationDuration;
	}
	get time() {
		return this.animation.time;
	}
	set time(e) {
		this.animation.time = e;
	}
	get speed() {
		return this.animation.speed;
	}
	get state() {
		return this.animation.state;
	}
	set speed(e) {
		this.animation.speed = e;
	}
	get startTime() {
		return this.animation.startTime;
	}
	attachTimeline(e) {
		return this._animation ? this.stopTimeline = this.animation.attachTimeline(e) : this.pendingTimeline = e, () => this.stop();
	}
	play() {
		this.animation.play();
	}
	pause() {
		this.animation.pause();
	}
	complete() {
		this.animation.complete();
	}
	cancel() {
		this._animation && this.animation.cancel(), this.keyframeResolver?.cancel();
	}
}, rc = class {
	constructor(e) {
		this.stop = () => this.runAll("stop"), this.animations = e.filter(Boolean);
	}
	get finished() {
		return Promise.all(this.animations.map((e) => e.finished));
	}
	getAll(e) {
		return this.animations[0][e];
	}
	setAll(e, t) {
		for (let n = 0; n < this.animations.length; n++) this.animations[n][e] = t;
	}
	attachTimeline(e) {
		let t = this.animations.map((t) => t.attachTimeline(e));
		return () => {
			t.forEach((e, t) => {
				e && e(), this.animations[t].stop();
			});
		};
	}
	get time() {
		return this.getAll("time");
	}
	set time(e) {
		this.setAll("time", e);
	}
	get speed() {
		return this.getAll("speed");
	}
	set speed(e) {
		this.setAll("speed", e);
	}
	get state() {
		return this.getAll("state");
	}
	get startTime() {
		return this.getAll("startTime");
	}
	get duration() {
		return ic(this.animations, "duration");
	}
	get iterationDuration() {
		return ic(this.animations, "iterationDuration");
	}
	runAll(e) {
		this.animations.forEach((t) => t[e]());
	}
	play() {
		this.runAll("play");
	}
	pause() {
		this.runAll("pause");
	}
	cancel() {
		this.runAll("cancel");
	}
	complete() {
		this.runAll("complete");
	}
};
function ic(e, t) {
	let n = 0;
	for (let r = 0; r < e.length; r++) {
		let i = e[r][t];
		i !== null && i > n && (n = i);
	}
	return n;
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/animation/GroupAnimationWithThen.mjs
var ac = class extends rc {
	then(e, t) {
		return this.finished.finally(e).then(() => {});
	}
};
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/animation/utils/calc-child-stagger.mjs
function oc(e, t, n, r = 0, i = 1) {
	let a = Array.from(e).sort((e, t) => e.sortNodePosition(t)).indexOf(t), o = e.size, s = (o - 1) * r;
	return typeof n == "function" ? n(a, o) : i === 1 ? a * r : s - a * r;
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/value/index.mjs
var sc = 30, cc = (e) => !isNaN(parseFloat(e)), lc = { current: void 0 }, uc = class {
	constructor(e, t = {}) {
		this.canTrackVelocity = null, this.events = {}, this.updateAndNotify = (e) => {
			let t = fa.now();
			if (this.updatedAt !== t && this.setPrevFrameValue(), this.prev = this.current, this.setCurrent(e), this.current !== this.prev && (this.events.change?.notify(this.current), this.dependents)) for (let e of this.dependents) e.dirty();
		}, this.hasAnimated = !1, this.setCurrent(e), this.owner = t.owner;
	}
	setCurrent(e) {
		this.current = e, this.updatedAt = fa.now(), this.canTrackVelocity === null && e !== void 0 && (this.canTrackVelocity = cc(this.current));
	}
	setPrevFrameValue(e = this.current) {
		this.prevFrameValue = e, this.prevUpdatedAt = this.updatedAt;
	}
	onChange(e) {
		return this.on("change", e);
	}
	on(e, t) {
		this.events[e] || (this.events[e] = new Oi());
		let n = this.events[e].add(t);
		return e === "change" ? () => {
			n(), oa.read(() => {
				this.events.change.getSize() || this.stop();
			});
		} : n;
	}
	clearListeners() {
		for (let e in this.events) this.events[e].clear();
	}
	attach(e, t) {
		this.passiveEffect = e, this.stopPassiveEffect = t;
	}
	set(e) {
		this.passiveEffect ? this.passiveEffect(e, this.updateAndNotify) : this.updateAndNotify(e);
	}
	setWithVelocity(e, t, n) {
		this.set(t), this.prev = void 0, this.prevFrameValue = e, this.prevUpdatedAt = this.updatedAt - n;
	}
	jump(e, t = !0) {
		this.updateAndNotify(e), this.prev = e, this.prevUpdatedAt = this.prevFrameValue = void 0, t && this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
	}
	dirty() {
		this.events.change?.notify(this.current);
	}
	addDependent(e) {
		this.dependents ||= /* @__PURE__ */ new Set(), this.dependents.add(e);
	}
	removeDependent(e) {
		this.dependents && this.dependents.delete(e);
	}
	get() {
		return lc.current && lc.current.push(this), this.current;
	}
	getPrevious() {
		return this.prev;
	}
	getVelocity() {
		let e = fa.now();
		if (!this.canTrackVelocity || this.prevFrameValue === void 0 || e - this.updatedAt > sc) return 0;
		let t = Math.min(this.updatedAt - this.prevUpdatedAt, sc);
		return /* @__PURE__ */ ji(parseFloat(this.current) - parseFloat(this.prevFrameValue), t);
	}
	start(e) {
		return this.stop(), new Promise((t) => {
			this.hasAnimated = !0, this.animation = e(t), this.events.animationStart && this.events.animationStart.notify();
		}).then(() => {
			this.events.animationComplete && this.events.animationComplete.notify(), this.clearAnimation();
		});
	}
	stop() {
		this.animation && (this.animation.stop(), this.events.animationCancel && this.events.animationCancel.notify()), this.clearAnimation();
	}
	isAnimating() {
		return !!this.animation;
	}
	clearAnimation() {
		delete this.animation;
	}
	destroy() {
		this.dependents?.clear(), this.events.destroy?.notify(), this.clearListeners(), this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
	}
};
function dc(e, t) {
	return new uc(e, t);
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/animation/utils/resolve-transition.mjs
function fc(e, t) {
	if (e?.inherit && t) {
		let { inherit: n, ...r } = e;
		return {
			...t,
			...r
		};
	}
	return e;
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/animation/utils/get-value-transition.mjs
function pc(e, t) {
	let n = e?.[t] ?? e?.default ?? e;
	return n === e ? n : fc(n, e);
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/animation/utils/default-transitions.mjs
var mc = {
	type: "spring",
	stiffness: 500,
	damping: 25,
	restSpeed: 10
}, hc = (e) => ({
	type: "spring",
	stiffness: 550,
	damping: e === 0 ? 2 * Math.sqrt(550) : 30,
	restSpeed: 10
}), gc = {
	type: "keyframes",
	duration: .8
}, _c = {
	type: "keyframes",
	ease: [
		.25,
		.1,
		.35,
		1
	],
	duration: .3
}, vc = (e, { keyframes: t }) => t.length > 2 ? gc : ps.has(e) ? e.startsWith("scale") ? hc(t[1]) : mc : _c, yc = /* @__PURE__ */ new Set([
	"when",
	"delay",
	"delayChildren",
	"staggerChildren",
	"staggerDirection",
	"repeat",
	"repeatType",
	"repeatDelay",
	"from",
	"elapsed"
]);
function bc(e) {
	for (let t in e) if (!yc.has(t)) return !0;
	return !1;
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/animation/interfaces/motion-value.mjs
var xc = (e, t, n, r = {}, i, a) => (o) => {
	let s = pc(r, e) || {}, c = s.delay || r.delay || 0, { elapsed: l = 0 } = r;
	l -= /* @__PURE__ */ ki(c);
	let u = {
		keyframes: Array.isArray(n) ? n : [null, n],
		ease: "easeOut",
		velocity: t.getVelocity(),
		...s,
		delay: -l,
		onUpdate: (e) => {
			t.set(e), s.onUpdate && s.onUpdate(e);
		},
		onComplete: () => {
			o(), s.onComplete && s.onComplete();
		},
		name: e,
		motionValue: t,
		element: a ? void 0 : i
	};
	bc(s) || Object.assign(u, vc(e, u)), u.duration &&= /* @__PURE__ */ ki(u.duration), u.repeatDelay &&= /* @__PURE__ */ ki(u.repeatDelay), u.from !== void 0 && (u.keyframes[0] = u.from);
	let d = !1;
	if ((u.type === !1 || u.duration === 0 && !u.repeatDelay) && (Js(u), u.delay === 0 && (d = !0)), (xi.instantAnimations || xi.skipAnimations || i?.shouldSkipAnimations || s.skipAnimations) && (d = !0, Js(u), u.delay = 0), u.allowFlatten = !s.type && !s.ease, d && !a && t.get() !== void 0) {
		let e = qo(u.keyframes, s);
		if (e !== void 0) {
			oa.update(() => {
				u.onUpdate(e), u.onComplete();
			});
			return;
		}
	}
	return s.isSync ? new Qo(u) : new nc(u);
}, Sc = /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;
function Cc(e) {
	let t = Sc.exec(e);
	if (!t) return [,];
	let [, n, r, i] = t;
	return [`--${n ?? r}`, i];
}
function wc(e, t, n = 1) {
	`${e}`;
	let [r, i] = Cc(e);
	if (!r) return;
	let a = window.getComputedStyle(t).getPropertyValue(r);
	if (a) {
		let e = a.trim();
		return Si(e) ? parseFloat(e) : e;
	}
	return ga(i) ? wc(i, t, n + 1) : i;
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/render/utils/resolve-variants.mjs
function Tc(e) {
	let t = [{}, {}];
	return e?.values.forEach((e, n) => {
		t[0][n] = e.get(), t[1][n] = e.getVelocity();
	}), t;
}
function Ec(e, t, n, r) {
	if (typeof t == "function") {
		let [i, a] = Tc(r);
		t = t(n === void 0 ? e.custom : n, i, a);
	}
	if (typeof t == "string" && (t = e.variants && e.variants[t]), typeof t == "function") {
		let [i, a] = Tc(r);
		t = t(n === void 0 ? e.custom : n, i, a);
	}
	return t;
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/render/utils/resolve-dynamic-variants.mjs
function Dc(e, t, n) {
	let r = e.getProps();
	return Ec(r, t, n === void 0 ? r.custom : n, e);
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/render/utils/keys-position.mjs
var Oc = /* @__PURE__ */ new Set([
	"width",
	"height",
	"top",
	"left",
	"right",
	"bottom",
	...fs
]), kc = (e) => Array.isArray(e);
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/render/utils/setters.mjs
function Ac(e, t, n) {
	e.hasValue(t) ? e.getValue(t).set(n) : e.addValue(t, dc(n));
}
function jc(e) {
	return kc(e) ? e[e.length - 1] || 0 : e;
}
function Mc(e, t) {
	let { transitionEnd: n = {}, transition: r = {}, ...i } = Dc(e, t) || {};
	i = {
		...i,
		...n
	};
	for (let t in i) Ac(e, t, jc(i[t]));
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/value/utils/is-motion-value.mjs
var Nc = (e) => !!(e && e.getVelocity);
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/value/will-change/is.mjs
function Pc(e) {
	return !!(Nc(e) && e.add);
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/value/will-change/add-will-change.mjs
function Fc(e, t) {
	let n = e.getValue("willChange");
	if (Pc(n)) return n.add(t);
	if (!n && xi.WillChange) {
		let n = new xi.WillChange("auto");
		e.addValue("willChange", n), n.add(t);
	}
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/render/dom/utils/camel-to-dash.mjs
function Ic(e) {
	return e.replace(/([A-Z])/g, (e) => `-${e.toLowerCase()}`);
}
var Lc = "data-" + Ic("framerAppearId");
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/animation/optimized-appear/get-appear-id.mjs
function Rc(e) {
	return e.props[Lc];
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/animation/interfaces/visual-element-target.mjs
var zc = typeof window < "u";
function Bc({ protectedKeys: e, needsAnimating: t }, n) {
	let r = e.hasOwnProperty(n) && t[n] !== !0;
	return t[n] = !1, r;
}
function Vc(e, t, { delay: n = 0, transitionOverride: r, type: i } = {}) {
	let { transition: a, transitionEnd: o, ...s } = t, c = e.getDefaultTransition();
	a = a ? fc(a, c) : c;
	let l = a?.reduceMotion, u = a?.skipAnimations;
	r && (a = r);
	let d = [], f = i && e.animationState && e.animationState.getState()[i], p = a?.path;
	p && p.animateVisualElement(e, s, a, n, d);
	for (let t in s) {
		let r = e.getValue(t, e.latestValues[t] ?? null), i = s[t];
		if (i === void 0 || f && Bc(f, t)) continue;
		let o = {
			delay: n,
			...pc(a || {}, t)
		};
		u && (o.skipAnimations = !0);
		let c = r.get();
		if (c !== void 0 && !r.isAnimating() && !Array.isArray(i) && i === c && !o.velocity) {
			oa.update(() => r.set(i));
			continue;
		}
		let p = !1;
		if (zc && window.MotionHandoffAnimation) {
			let n = Rc(e);
			if (n) {
				let e = window.MotionHandoffAnimation(n, t, oa);
				e !== null && (o.startTime = e, p = !0);
			}
		}
		Fc(e, t);
		let m = l ?? e.shouldReduceMotion;
		r.start(xc(t, r, i, m && Oc.has(t) ? { type: !1 } : o, e, p));
		let h = r.animation;
		h && d.push(h);
	}
	if (o) {
		let t = () => oa.update(() => {
			o && Mc(e, o);
		});
		d.length ? Promise.all(d).then(t) : t();
	}
	return d;
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/animation/interfaces/visual-element-variant.mjs
function Hc(e, t, n = {}) {
	let r = Dc(e, t, n.type === "exit" ? e.presenceContext?.custom : void 0), { transition: i = e.getDefaultTransition() || {} } = r || {};
	n.transitionOverride && (i = n.transitionOverride);
	let a = r ? () => Promise.all(Vc(e, r, n)) : () => Promise.resolve(), o = e.variantChildren && e.variantChildren.size ? (r = 0) => {
		let { delayChildren: a = 0, staggerChildren: o, staggerDirection: s } = i;
		return Uc(e, t, r, a, o, s, n);
	} : () => Promise.resolve(), { when: s } = i;
	if (s) {
		let [e, t] = s === "beforeChildren" ? [a, o] : [o, a];
		return e().then(() => t());
	}
	return Promise.all([a(), o(n.delay)]);
}
function Uc(e, t, n = 0, r = 0, i = 0, a = 1, o) {
	let s = [];
	for (let c of e.variantChildren) c.notify("AnimationStart", t), s.push(Hc(c, t, {
		...o,
		delay: n + (typeof r == "function" ? 0 : r) + oc(e.variantChildren, c, r, i, a)
	}).then(() => c.notify("AnimationComplete", t)));
	return Promise.all(s);
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/animation/interfaces/visual-element.mjs
function Wc(e, t, n = {}) {
	e.notify("AnimationStart", t);
	let r;
	if (Array.isArray(t)) {
		let i = t.map((t) => Hc(e, t, n));
		r = Promise.all(i);
	} else if (typeof t == "string") r = Hc(e, t, n);
	else {
		let i = typeof t == "function" ? Dc(e, t, n.custom) : t;
		r = Promise.all(Vc(e, i, n));
	}
	return r.then(() => {
		e.notify("AnimationComplete", t);
	});
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/value/types/auto.mjs
var Gc = {
	test: (e) => e === "auto",
	parse: (e) => e
}, Kc = (e) => (t) => t.test(e), qc = [
	ya,
	q,
	Fa,
	Pa,
	La,
	Ia,
	Gc
], Jc = (e) => qc.find(Kc(e));
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/animation/keyframes/utils/is-none.mjs
function Yc(e) {
	return typeof e == "number" ? e === 0 : e === null || e === "none" || e === "0" || wi(e);
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/value/types/complex/filter.mjs
var Xc = /* @__PURE__ */ new Set([
	"brightness",
	"contrast",
	"saturate",
	"opacity"
]);
function Zc(e) {
	let [t, n] = e.slice(0, -1).split("(");
	if (t === "drop-shadow") return e;
	let [r] = n.match(Ca) || [];
	if (!r) return e;
	let i = n.replace(r, ""), a = +!!Xc.has(t);
	return r !== n && (a *= 100), t + "(" + a + i + ")";
}
var Qc = /\b([a-z-]*)\(.*?\)/gu, $c = {
	...no,
	getAnimatableNone: (e) => {
		let t = e.match(Qc);
		return t ? t.map(Zc).join(" ") : e;
	}
}, el = {
	...no,
	getAnimatableNone: (e) => {
		let t = no.parse(e);
		return no.createTransformer(e)(t.map((e) => typeof e == "number" ? 0 : typeof e == "object" ? {
			...e,
			alpha: 1
		} : e));
	}
}, tl = {
	...ya,
	transform: Math.round
}, nl = {
	borderWidth: q,
	borderTopWidth: q,
	borderRightWidth: q,
	borderBottomWidth: q,
	borderLeftWidth: q,
	borderRadius: q,
	borderTopLeftRadius: q,
	borderTopRightRadius: q,
	borderBottomRightRadius: q,
	borderBottomLeftRadius: q,
	width: q,
	maxWidth: q,
	height: q,
	maxHeight: q,
	top: q,
	right: q,
	bottom: q,
	left: q,
	inset: q,
	insetBlock: q,
	insetBlockStart: q,
	insetBlockEnd: q,
	insetInline: q,
	insetInlineStart: q,
	insetInlineEnd: q,
	padding: q,
	paddingTop: q,
	paddingRight: q,
	paddingBottom: q,
	paddingLeft: q,
	paddingBlock: q,
	paddingBlockStart: q,
	paddingBlockEnd: q,
	paddingInline: q,
	paddingInlineStart: q,
	paddingInlineEnd: q,
	margin: q,
	marginTop: q,
	marginRight: q,
	marginBottom: q,
	marginLeft: q,
	marginBlock: q,
	marginBlockStart: q,
	marginBlockEnd: q,
	marginInline: q,
	marginInlineStart: q,
	marginInlineEnd: q,
	fontSize: q,
	backgroundPositionX: q,
	backgroundPositionY: q,
	rotate: Pa,
	pathRotation: Pa,
	rotateX: Pa,
	rotateY: Pa,
	rotateZ: Pa,
	scale: xa,
	scaleX: xa,
	scaleY: xa,
	scaleZ: xa,
	skew: Pa,
	skewX: Pa,
	skewY: Pa,
	distance: q,
	translateX: q,
	translateY: q,
	translateZ: q,
	x: q,
	y: q,
	z: q,
	perspective: q,
	transformPerspective: q,
	opacity: ba,
	originX: Ra,
	originY: Ra,
	originZ: q,
	zIndex: tl,
	fillOpacity: ba,
	strokeOpacity: ba,
	numOctaves: tl
}, rl = {
	...nl,
	color: Ba,
	backgroundColor: Ba,
	outlineColor: Ba,
	fill: Ba,
	stroke: Ba,
	borderColor: Ba,
	borderTopColor: Ba,
	borderRightColor: Ba,
	borderBottomColor: Ba,
	borderLeftColor: Ba,
	filter: $c,
	WebkitFilter: $c,
	mask: el,
	WebkitMask: el
}, il = (e) => rl[e], al = /*@__PURE__*/ new Set([$c, el]);
function ol(e, t) {
	let n = il(e);
	return al.has(n) || (n = no), n.getAnimatableNone ? n.getAnimatableNone(t) : void 0;
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/animation/keyframes/utils/make-none-animatable.mjs
var sl = /* @__PURE__ */ new Set([
	"auto",
	"none",
	"0"
]);
function cl(e, t, n) {
	let r = 0, i;
	for (; r < e.length && !i;) {
		let t = e[r];
		typeof t == "string" && !sl.has(t) && Ya(t).values.length && (i = e[r]), r++;
	}
	if (i && n) for (let r of t) e[r] = ol(n, i);
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/animation/keyframes/DOMKeyframesResolver.mjs
var ll = class extends Es {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i, !0);
	}
	readKeyframes() {
		let { unresolvedKeyframes: e, element: t, name: n } = this;
		if (!t || !t.current) return;
		super.readKeyframes();
		for (let n = 0; n < e.length; n++) {
			let r = e[n];
			if (typeof r == "string" && (r = r.trim(), ga(r))) {
				let i = wc(r, t.current);
				i !== void 0 && (e[n] = i), n === e.length - 1 && (this.finalKeyframe = r);
			}
		}
		if (this.resolveNoneKeyframes(), !Oc.has(n) || e.length !== 2) return;
		let [r, i] = e, a = Jc(r), o = Jc(i);
		if (va(r) !== va(i) && vs[n]) {
			this.needsMeasurement = !0;
			return;
		}
		if (a !== o) {
			if (ms(a) && ms(o)) for (let t = 0; t < e.length; t++) {
				let n = e[t];
				typeof n == "string" && (e[t] = parseFloat(n));
			}
			else vs[n] && (this.needsMeasurement = !0);
		}
	}
	resolveNoneKeyframes() {
		let { unresolvedKeyframes: e, name: t } = this, n = [];
		for (let t = 0; t < e.length; t++) (e[t] === null || Yc(e[t])) && n.push(t);
		n.length && cl(e, n, t);
	}
	measureInitialState() {
		let { element: e, unresolvedKeyframes: t, name: n } = this;
		if (!e || !e.current) return;
		n === "height" && (this.suspendedScrollY = window.pageYOffset), this.measuredOrigin = vs[n](e.measureViewportBox(), window.getComputedStyle(e.current)), t[0] = this.measuredOrigin;
		let r = t[t.length - 1];
		r !== void 0 && e.getValue(n, r).jump(r, !1);
	}
	measureEndState() {
		let { element: e, name: t, unresolvedKeyframes: n } = this;
		if (!e || !e.current) return;
		let r = e.getValue(t);
		r && r.jump(this.measuredOrigin, !1);
		let i = n.length - 1, a = n[i];
		n[i] = vs[t](e.measureViewportBox(), window.getComputedStyle(e.current)), a !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = a), this.removedTransforms?.length && this.removedTransforms.forEach(([t, n]) => {
			e.getValue(t).set(n);
		}), this.resolveNoneKeyframes();
	}
}, ul = [
	"borderTopLeftRadius",
	"borderTopRightRadius",
	"borderBottomRightRadius",
	"borderBottomLeftRadius"
];
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/utils/resolve-elements.mjs
function dl(e, t, n) {
	if (e == null) return [];
	if (e instanceof EventTarget) return [e];
	if (typeof e == "string") {
		let r = document;
		t && (r = t.current);
		let i = n?.[e] ?? r.querySelectorAll(e);
		return i ? Array.from(i) : [];
	}
	return Array.from(e).filter((e) => e != null);
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/value/types/utils/get-as-type.mjs
var fl = (e, t) => t && typeof e == "number" ? t.transform(e) : e;
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/utils/is-html-element.mjs
function pl(e) {
	return Ci(e) && "offsetHeight" in e && !("ownerSVGElement" in e);
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/frameloop/microtask.mjs
var { schedule: ml, cancel: hl } = /* @__PURE__ */ aa(queueMicrotask, !1), gl = {
	x: !1,
	y: !1
};
function _l() {
	return gl.x || gl.y;
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/gestures/drag/state/set-active.mjs
function vl(e) {
	return e === "x" || e === "y" ? gl[e] ? null : (gl[e] = !0, () => {
		gl[e] = !1;
	}) : gl.x || gl.y ? null : (gl.x = gl.y = !0, () => {
		gl.x = gl.y = !1;
	});
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/gestures/utils/setup.mjs
function yl(e, t) {
	let n = dl(e), r = new AbortController();
	return [
		n,
		{
			passive: !0,
			...t,
			signal: r.signal
		},
		() => r.abort()
	];
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/gestures/hover.mjs
function bl(e) {
	return !(e.pointerType === "touch" || _l());
}
function xl(e, t, n = {}) {
	let [r, i, a] = yl(e, n);
	return r.forEach((e) => {
		let n = !1, r = !1, a, o = () => {
			e.removeEventListener("pointerleave", u);
		}, s = (e) => {
			a &&= (a(e), void 0), o();
		}, c = (e) => {
			n = !1, window.removeEventListener("pointerup", c), window.removeEventListener("pointercancel", c), r && (r = !1, s(e));
		}, l = () => {
			n = !0, window.addEventListener("pointerup", c, i), window.addEventListener("pointercancel", c, i);
		}, u = (e) => {
			if (e.pointerType !== "touch") {
				if (n) {
					r = !0;
					return;
				}
				s(e);
			}
		};
		e.addEventListener("pointerenter", (n) => {
			if (!bl(n)) return;
			r = !1;
			let o = t(e, n);
			typeof o == "function" && (a = o, e.addEventListener("pointerleave", u, i));
		}, i), e.addEventListener("pointerdown", l, i);
	}), a;
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/gestures/utils/is-node-or-child.mjs
var Sl = (e, t) => t ? e === t || Sl(e, t.parentElement) : !1, Cl = (e) => e.pointerType === "mouse" ? typeof e.button != "number" || e.button <= 0 : e.isPrimary !== !1, wl = /* @__PURE__ */ new Set([
	"BUTTON",
	"INPUT",
	"SELECT",
	"TEXTAREA",
	"A"
]);
function Tl(e) {
	return wl.has(e.tagName) || e.isContentEditable === !0;
}
var El = /* @__PURE__ */ new Set([
	"INPUT",
	"SELECT",
	"TEXTAREA"
]);
function Dl(e) {
	return El.has(e.tagName) || e.isContentEditable === !0;
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/gestures/press/utils/state.mjs
var Ol = /* @__PURE__ */ new WeakSet();
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/gestures/press/utils/keyboard.mjs
function kl(e) {
	return (t) => {
		t.key === "Enter" && e(t);
	};
}
function Al(e, t) {
	e.dispatchEvent(new PointerEvent("pointer" + t, {
		isPrimary: !0,
		bubbles: !0
	}));
}
var jl = (e, t) => {
	let n = e.currentTarget;
	if (!n) return;
	let r = kl(() => {
		if (Ol.has(n)) return;
		Al(n, "down");
		let e = kl(() => {
			Al(n, "up");
		});
		n.addEventListener("keyup", e, t), n.addEventListener("blur", () => Al(n, "cancel"), t);
	});
	n.addEventListener("keydown", r, t), n.addEventListener("blur", () => n.removeEventListener("keydown", r), t);
};
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/gestures/press/index.mjs
function Ml(e) {
	return Cl(e) && !_l();
}
var Nl = /* @__PURE__ */ new WeakSet();
function Pl(e, t, n = {}) {
	let [r, i, a] = yl(e, n), o = (e) => {
		let r = e.currentTarget;
		if (!Ml(e) || Nl.has(e)) return;
		Ol.add(r), n.stopPropagation && Nl.add(e);
		let a = t(r, e), o = {
			...i,
			capture: !0
		}, s = (e, t) => {
			window.removeEventListener("pointerup", c, o), window.removeEventListener("pointercancel", l, o), Ol.has(r) && Ol.delete(r), Ml(e) && typeof a == "function" && a(e, { success: t });
		}, c = (e) => {
			s(e, r === window || r === document || n.useGlobalTarget || Sl(r, e.target));
		}, l = (e) => {
			s(e, !1);
		};
		window.addEventListener("pointerup", c, o), window.addEventListener("pointercancel", l, o);
	};
	return r.forEach((e) => {
		(n.useGlobalTarget ? window : e).addEventListener("pointerdown", o, i), pl(e) && (e.addEventListener("focus", (e) => jl(e, i)), !Tl(e) && !e.hasAttribute("tabindex") && (e.tabIndex = 0));
	}), a;
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/utils/is-svg-element.mjs
function Fl(e) {
	return Ci(e) && "ownerSVGElement" in e;
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/resize/handle-element.mjs
var Il = /* @__PURE__ */ new WeakMap(), X, Z = (e, t, n) => (r, i) => i && i[0] ? i[0][e + "Size"] : Fl(r) && "getBBox" in r ? r.getBBox()[t] : r[n], Ll = /*@__PURE__*/ Z("inline", "width", "offsetWidth"), Rl = /*@__PURE__*/ Z("block", "height", "offsetHeight");
function zl({ target: e, borderBoxSize: t }) {
	Il.get(e)?.forEach((n) => {
		n(e, {
			get width() {
				return Ll(e, t);
			},
			get height() {
				return Rl(e, t);
			}
		});
	});
}
function Bl(e) {
	e.forEach(zl);
}
function Vl() {
	typeof ResizeObserver > "u" || (X = new ResizeObserver(Bl));
}
function Hl(e, t) {
	X || Vl();
	let n = dl(e);
	return n.forEach((e) => {
		let n = Il.get(e);
		n || (n = /* @__PURE__ */ new Set(), Il.set(e, n)), n.add(t), X?.observe(e);
	}), () => {
		n.forEach((e) => {
			let n = Il.get(e);
			n?.delete(t), n?.size || X?.unobserve(e);
		});
	};
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/resize/handle-window.mjs
var Ul = /* @__PURE__ */ new Set(), Wl;
function Gl() {
	Wl = () => {
		let e = {
			get width() {
				return window.innerWidth;
			},
			get height() {
				return window.innerHeight;
			}
		};
		Ul.forEach((t) => t(e));
	}, window.addEventListener("resize", Wl);
}
function Kl(e) {
	return Ul.add(e), Wl || Gl(), () => {
		Ul.delete(e), !Ul.size && typeof Wl == "function" && (window.removeEventListener("resize", Wl), Wl = void 0);
	};
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/resize/index.mjs
function ql(e, t) {
	return typeof e == "function" ? Kl(e) : Hl(e, t);
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/stats/buffer.mjs
var Jl = {
	value: null,
	addProjectionMetrics: null
};
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/utils/is-svg-svg-element.mjs
function Yl(e) {
	return Fl(e) && e.tagName === "svg";
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/utils/transform.mjs
function Xl(...e) {
	let t = !Array.isArray(e[0]), n = t ? 0 : -1, r = e[0 + n], i = e[1 + n], a = e[2 + n], o = e[3 + n], s = Bo(i, a, o);
	return t ? s(r) : s;
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/value/types/utils/find.mjs
var Zl = [
	...qc,
	Ba,
	no
], Ql = (e) => Zl.find(Kc(e)), $l = () => ({
	translate: 0,
	scale: 1,
	origin: 0,
	originPoint: 0
}), eu = () => ({
	x: $l(),
	y: $l()
}), tu = () => ({
	min: 0,
	max: 0
}), nu = () => ({
	x: tu(),
	y: tu()
}), ru = /* @__PURE__ */ new WeakMap();
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/render/utils/is-animation-controls.mjs
function iu(e) {
	return typeof e == "object" && !!e && typeof e.start == "function";
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/render/utils/is-variant-label.mjs
function au(e) {
	return typeof e == "string" || Array.isArray(e);
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/render/utils/variant-props.mjs
var ou = [
	"animate",
	"whileInView",
	"whileFocus",
	"whileHover",
	"whileTap",
	"whileDrag",
	"exit"
], su = ["initial", ...ou];
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/render/utils/is-controlling-variants.mjs
function cu(e) {
	return iu(e.animate) || su.some((t) => au(e[t]));
}
function lu(e) {
	return !!(cu(e) || e.variants);
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/render/utils/motion-values.mjs
function uu(e, t, n) {
	for (let r in t) {
		let i = t[r], a = n[r];
		if (Nc(i)) e.addValue(r, i);
		else if (Nc(a)) e.addValue(r, dc(i, { owner: e }));
		else if (a !== i) {
			if (e.hasValue(r)) {
				let t = e.getValue(r);
				t.liveStyle === !0 ? t.jump(i) : t.hasAnimated || t.set(i);
			} else {
				let t = e.getStaticValue(r);
				e.addValue(r, dc(t === void 0 ? i : t, { owner: e }));
			}
		}
	}
	for (let r in n) t[r] === void 0 && e.removeValue(r);
	return t;
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/render/utils/reduced-motion/state.mjs
var du = { current: null }, fu = { current: !1 }, pu = typeof window < "u";
function mu() {
	if (fu.current = !0, pu) {
		if (window.matchMedia) {
			let e = window.matchMedia("(prefers-reduced-motion)"), t = () => du.current = e.matches;
			e.addEventListener("change", t), t();
		} else du.current = !1;
	}
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/render/VisualElement.mjs
var hu = [
	"AnimationStart",
	"AnimationComplete",
	"Update",
	"BeforeLayoutMeasure",
	"LayoutMeasure",
	"LayoutAnimationStart",
	"LayoutAnimationComplete"
], gu = {};
function _u(e) {
	gu = e;
}
function vu() {
	return gu;
}
var yu = class {
	scrapeMotionValuesFromProps(e, t, n) {
		return {};
	}
	constructor({ parent: e, props: t, presenceContext: n, reducedMotionConfig: r, skipAnimations: i, blockInitialAnimation: a, visualState: o }, s = {}) {
		this.current = null, this.children = /* @__PURE__ */ new Set(), this.isVariantNode = !1, this.isControllingVariants = !1, this.shouldReduceMotion = null, this.shouldSkipAnimations = !1, this.values = /* @__PURE__ */ new Map(), this.KeyframeResolver = Es, this.features = {}, this.valueSubscriptions = /* @__PURE__ */ new Map(), this.prevMotionValues = {}, this.hasBeenMounted = !1, this.events = {}, this.propEventSubscriptions = {}, this.notifyUpdate = () => this.notify("Update", this.latestValues), this.render = () => {
			this.current && (this.triggerBuild(), this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
		}, this.renderScheduledAt = 0, this.scheduleRender = () => {
			let e = fa.now();
			this.renderScheduledAt < e && (this.renderScheduledAt = e, oa.render(this.render, !1, !0));
		};
		let { latestValues: c, renderState: l } = o;
		this.latestValues = c, this.baseTarget = { ...c }, this.initialValues = t.initial ? { ...c } : {}, this.renderState = l, this.parent = e, this.props = t, this.presenceContext = n, this.depth = e ? e.depth + 1 : 0, this.reducedMotionConfig = r, this.skipAnimationsConfig = i, this.options = s, this.blockInitialAnimation = !!a, this.isControllingVariants = cu(t), this.isVariantNode = lu(t), this.isVariantNode && (this.variantChildren = /* @__PURE__ */ new Set()), this.manuallyAnimateOnMount = !!(e && e.current);
		let { willChange: u, ...d } = this.scrapeMotionValuesFromProps(t, {}, this);
		for (let e in d) {
			let t = d[e];
			c[e] !== void 0 && Nc(t) && t.set(c[e]);
		}
	}
	mount(e) {
		if (this.hasBeenMounted) for (let e in this.initialValues) this.values.get(e)?.jump(this.initialValues[e]), this.latestValues[e] = this.initialValues[e];
		this.current = e, ru.set(e, this), this.projection && !this.projection.instance && this.projection.mount(e), this.parent && this.isVariantNode && !this.isControllingVariants && (this.removeFromVariantTree = this.parent.addVariantChild(this)), this.values.forEach((e, t) => this.bindToMotionValue(t, e)), this.reducedMotionConfig === "never" ? this.shouldReduceMotion = !1 : this.reducedMotionConfig === "always" ? this.shouldReduceMotion = !0 : (fu.current || mu(), this.shouldReduceMotion = du.current), this.shouldSkipAnimations = this.skipAnimationsConfig ?? !1, this.parent?.addChild(this), this.update(this.props, this.presenceContext), this.hasBeenMounted = !0;
	}
	unmount() {
		this.projection && this.projection.unmount(), sa(this.notifyUpdate), sa(this.render), this.valueSubscriptions.forEach((e) => e()), this.valueSubscriptions.clear(), this.removeFromVariantTree && this.removeFromVariantTree(), this.parent?.removeChild(this);
		for (let e in this.events) this.events[e].clear();
		for (let e in this.features) {
			let t = this.features[e];
			t && (t.unmount(), t.isMounted = !1);
		}
		this.current = null;
	}
	addChild(e) {
		this.children.add(e), this.enteringChildren ??= /* @__PURE__ */ new Set(), this.enteringChildren.add(e);
	}
	removeChild(e) {
		this.children.delete(e), this.enteringChildren && this.enteringChildren.delete(e);
	}
	bindToMotionValue(e, t) {
		if (this.valueSubscriptions.has(e) && this.valueSubscriptions.get(e)(), t.accelerate && Ys.has(e) && this.current instanceof HTMLElement) {
			let { factory: n, keyframes: r, times: i, ease: a, duration: o } = t.accelerate, s = new zs({
				element: this.current,
				name: e,
				keyframes: r,
				times: i,
				ease: a,
				duration: /* @__PURE__ */ ki(o)
			}), c = n(s);
			this.valueSubscriptions.set(e, () => {
				c(), s.cancel();
			});
			return;
		}
		let n = ps.has(e);
		n && this.onBindTransform && this.onBindTransform();
		let r = t.on("change", (t) => {
			this.latestValues[e] = t, this.props.onUpdate && oa.preRender(this.notifyUpdate), n && this.projection && (this.projection.isTransformDirty = !0), this.scheduleRender();
		}), i;
		typeof window < "u" && window.MotionCheckAppearSync && (i = window.MotionCheckAppearSync(this, e, t)), this.valueSubscriptions.set(e, () => {
			r(), i && i();
		});
	}
	sortNodePosition(e) {
		return !this.current || !this.sortInstanceNodePosition || this.type !== e.type ? 0 : this.sortInstanceNodePosition(this.current, e.current);
	}
	updateFeatures() {
		let e = "animation";
		for (e in gu) {
			let t = gu[e];
			if (!t) continue;
			let { isEnabled: n, Feature: r } = t;
			if (!this.features[e] && r && n(this.props) && (this.features[e] = new r(this)), this.features[e]) {
				let t = this.features[e];
				t.isMounted ? t.update() : (t.mount(), t.isMounted = !0);
			}
		}
	}
	triggerBuild() {
		this.build(this.renderState, this.latestValues, this.props);
	}
	measureViewportBox() {
		return this.current ? this.measureInstanceViewportBox(this.current, this.props) : nu();
	}
	getStaticValue(e) {
		return this.latestValues[e];
	}
	setStaticValue(e, t) {
		this.latestValues[e] = t;
	}
	update(e, t) {
		(e.transformTemplate || this.props.transformTemplate) && this.scheduleRender(), this.prevProps = this.props, this.props = e, this.prevPresenceContext = this.presenceContext, this.presenceContext = t;
		for (let t = 0; t < hu.length; t++) {
			let n = hu[t];
			this.propEventSubscriptions[n] && (this.propEventSubscriptions[n](), delete this.propEventSubscriptions[n]);
			let r = e["on" + n];
			r && (this.propEventSubscriptions[n] = this.on(n, r));
		}
		this.prevMotionValues = uu(this, this.scrapeMotionValuesFromProps(e, this.prevProps || {}, this), this.prevMotionValues), this.handleChildMotionValue && this.handleChildMotionValue();
	}
	getProps() {
		return this.props;
	}
	getVariant(e) {
		return this.props.variants ? this.props.variants[e] : void 0;
	}
	getDefaultTransition() {
		return this.props.transition;
	}
	getTransformPagePoint() {
		return this.props.transformPagePoint;
	}
	getClosestVariantNode() {
		return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0;
	}
	addVariantChild(e) {
		let t = this.getClosestVariantNode();
		if (t) return t.variantChildren && t.variantChildren.add(e), () => t.variantChildren.delete(e);
	}
	addValue(e, t) {
		let n = this.values.get(e);
		t !== n && (n && this.removeValue(e), this.bindToMotionValue(e, t), this.values.set(e, t), this.latestValues[e] = t.get());
	}
	removeValue(e) {
		this.values.delete(e);
		let t = this.valueSubscriptions.get(e);
		t && (t(), this.valueSubscriptions.delete(e)), delete this.latestValues[e], this.removeValueFromRenderState(e, this.renderState);
	}
	hasValue(e) {
		return this.values.has(e);
	}
	getValue(e, t) {
		if (this.props.values && this.props.values[e]) return this.props.values[e];
		let n = this.values.get(e);
		return n === void 0 && t !== void 0 && (n = dc(t === null ? void 0 : t, { owner: this }), this.addValue(e, n)), n;
	}
	readValue(e, t) {
		let n = this.latestValues[e] !== void 0 || !this.current ? this.latestValues[e] : this.getBaseTargetFromProps(this.props, e) ?? this.readValueFromInstance(this.current, e, this.options);
		return n != null && (typeof n == "string" && (Si(n) || wi(n)) ? n = parseFloat(n) : !Ql(n) && no.test(t) && (n = ol(e, t)), this.setBaseTarget(e, Nc(n) ? n.get() : n)), Nc(n) ? n.get() : n;
	}
	setBaseTarget(e, t) {
		this.baseTarget[e] = t;
	}
	getBaseTarget(e) {
		let { initial: t } = this.props, n;
		if (typeof t == "string" || typeof t == "object") {
			let r = Ec(this.props, t, this.presenceContext?.custom);
			r && (n = r[e]);
		}
		if (t && n !== void 0) return n;
		let r = this.getBaseTargetFromProps(this.props, e);
		return r !== void 0 && !Nc(r) ? r : this.initialValues[e] !== void 0 && n === void 0 ? void 0 : this.baseTarget[e];
	}
	on(e, t) {
		return this.events[e] || (this.events[e] = new Oi()), this.events[e].add(t);
	}
	notify(e, ...t) {
		this.events[e] && this.events[e].notify(...t);
	}
	scheduleRenderMicrotask() {
		ml.render(this.render);
	}
}, bu = class extends yu {
	constructor() {
		super(...arguments), this.KeyframeResolver = ll;
	}
	sortInstanceNodePosition(e, t) {
		return e.compareDocumentPosition(t) & 2 ? 1 : -1;
	}
	getBaseTargetFromProps(e, t) {
		let n = e.style;
		return n ? n[t] : void 0;
	}
	removeValueFromRenderState(e, { vars: t, style: n }) {
		delete t[e], delete n[e];
	}
	handleChildMotionValue() {
		this.childSubscription && (this.childSubscription(), delete this.childSubscription);
		let { children: e } = this.props;
		Nc(e) && (this.childSubscription = e.on("change", (e) => {
			this.current && (this.current.textContent = `${e}`);
		}));
	}
}, xu = class {
	constructor(e) {
		this.isMounted = !1, this.node = e;
	}
	update() {}
};
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/projection/geometry/conversion.mjs
function Su({ top: e, left: t, right: n, bottom: r }) {
	return {
		x: {
			min: t,
			max: n
		},
		y: {
			min: e,
			max: r
		}
	};
}
function Cu({ x: e, y: t }) {
	return {
		top: t.min,
		right: e.max,
		bottom: t.max,
		left: e.min
	};
}
function wu(e, t) {
	if (!t) return e;
	let n = t({
		x: e.left,
		y: e.top
	}), r = t({
		x: e.right,
		y: e.bottom
	});
	return {
		top: n.y,
		left: n.x,
		bottom: r.y,
		right: r.x
	};
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/projection/utils/has-transform.mjs
function Tu(e) {
	return e === void 0 || e === 1;
}
function Eu({ scale: e, scaleX: t, scaleY: n }) {
	return !Tu(e) || !Tu(t) || !Tu(n);
}
function Du(e) {
	return Eu(e) || Ou(e) || e.z || e.rotate || e.rotateX || e.rotateY || e.skewX || e.skewY;
}
function Ou(e) {
	return ku(e.x) || ku(e.y);
}
function ku(e) {
	return e && e !== "0%";
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/projection/geometry/delta-apply.mjs
function Au(e, t, n) {
	return n + t * (e - n);
}
function ju(e, t, n, r, i) {
	return i !== void 0 && (e = Au(e, i, r)), Au(e, n, r) + t;
}
function Mu(e, t = 0, n = 1, r, i) {
	e.min = ju(e.min, t, n, r, i), e.max = ju(e.max, t, n, r, i);
}
function Nu(e, { x: t, y: n }) {
	Mu(e.x, t.translate, t.scale, t.originPoint), Mu(e.y, n.translate, n.scale, n.originPoint);
}
var Pu = .999999999999, Fu = 1.0000000000001;
function Iu(e, t, n, r = !1) {
	let i = n.length;
	if (!i) return;
	t.x = t.y = 1;
	let a, o;
	for (let s = 0; s < i; s++) {
		a = n[s], o = a.projectionDelta;
		let { visualElement: i } = a.options;
		i && i.props.style && i.props.style.display === "contents" || (r && a.options.layoutScroll && a.scroll && a !== a.root && (Lu(e.x, -a.scroll.offset.x), Lu(e.y, -a.scroll.offset.y)), o && (t.x *= o.x.scale, t.y *= o.y.scale, Nu(e, o)), r && Du(a.latestValues) && Bu(e, a.latestValues, a.layout?.layoutBox));
	}
	t.x < Fu && t.x > Pu && (t.x = 1), t.y < Fu && t.y > Pu && (t.y = 1);
}
function Lu(e, t) {
	e.min += t, e.max += t;
}
function Ru(e, t, n, r, i = .5) {
	Mu(e, t, n, Y(e.min, e.max, i), r);
}
function zu(e, t) {
	return typeof e == "string" ? parseFloat(e) / 100 * (t.max - t.min) : e;
}
function Bu(e, t, n) {
	let r = n ?? e;
	Ru(e.x, zu(t.x, r.x), t.scaleX, t.scale, t.originX), Ru(e.y, zu(t.y, r.y), t.scaleY, t.scale, t.originY);
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/projection/utils/measure.mjs
function Vu(e, t) {
	return Su(wu(e.getBoundingClientRect(), t));
}
function Hu(e, t, n) {
	let r = Vu(e, n), { scroll: i } = t;
	return i && (Lu(r.x, i.offset.x), Lu(r.y, i.offset.y)), r;
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/render/html/utils/build-transform.mjs
var Uu = {
	x: "translateX",
	y: "translateY",
	z: "translateZ",
	transformPerspective: "perspective"
}, Wu = fs.length;
function Gu(e, t, n) {
	let r = "", i = !0;
	for (let a = 0; a < Wu; a++) {
		let o = fs[a], s = e[o];
		if (s === void 0) continue;
		let c = !0;
		if (typeof s == "number") c = s === +!!o.startsWith("scale");
		else {
			let e = parseFloat(s);
			c = o.startsWith("scale") ? e === 1 : e === 0;
		}
		if (!c || n) {
			let e = fl(s, nl[o]);
			if (!c) {
				i = !1;
				let t = Uu[o] || o;
				r += `${t}(${e}) `;
			}
			n && (t[o] = e);
		}
	}
	let a = e.pathRotation;
	return a && (i = !1, r += `rotate(${fl(a, nl.pathRotation)}) `), r = r.trim(), n ? r = n(t, i ? "" : r) : i && (r = "none"), r;
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/render/html/utils/build-styles.mjs
function Ku(e, t, n) {
	let { style: r, vars: i, transformOrigin: a } = e, o = !1, s = !1;
	for (let e in t) {
		let n = t[e];
		if (ps.has(e)) {
			o = !0;
			continue;
		}
		if (ma(e)) {
			i[e] = n;
			continue;
		}
		{
			let t = fl(n, nl[e]);
			e.startsWith("origin") ? (s = !0, a[e] = t) : r[e] = t;
		}
	}
	if (t.transform || (o || n ? r.transform = Gu(t, e.transform, n) : r.transform &&= "none"), s) {
		let { originX: e = "50%", originY: t = "50%", originZ: n = 0 } = a;
		r.transformOrigin = `${e} ${t} ${n}`;
	}
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/render/html/utils/render.mjs
function qu(e, { style: t, vars: n }, r, i) {
	let a = e.style, o;
	for (o in t) a[o] = t[o];
	for (o in i?.applyProjectionStyles(a, r), n) a.setProperty(o, n[o]);
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/projection/styles/scale-border-radius.mjs
function Ju(e, t) {
	return t.max === t.min ? 0 : e / (t.max - t.min) * 100;
}
var Yu = { correct: (e, t) => {
	if (!t.target) return e;
	if (typeof e == "string") {
		if (q.test(e)) e = parseFloat(e);
		else return e;
	}
	return `${Ju(e, t.target.x)}% ${Ju(e, t.target.y)}%`;
} }, Xu = { correct: (e, { treeScale: t, projectionDelta: n }) => {
	let r = e, i = no.parse(e);
	if (i.length > 5) return r;
	let a = no.createTransformer(e), o = typeof i[0] == "number" ? 0 : 1, s = n.x.scale * t.x, c = n.y.scale * t.y;
	i[0 + o] /= s, i[1 + o] /= c;
	let l = Y(s, c, .5);
	return typeof i[2 + o] == "number" && (i[2 + o] /= l), typeof i[3 + o] == "number" && (i[3 + o] /= l), a(i);
} }, Zu = {
	borderRadius: {
		...Yu,
		applyTo: [...ul]
	},
	borderTopLeftRadius: Yu,
	borderTopRightRadius: Yu,
	borderBottomLeftRadius: Yu,
	borderBottomRightRadius: Yu,
	boxShadow: Xu
};
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/render/utils/is-forced-motion-value.mjs
function Qu(e, { layout: t, layoutId: n }) {
	return ps.has(e) || e.startsWith("origin") || (t || n !== void 0) && (!!Zu[e] || e === "opacity");
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/render/html/utils/scrape-motion-values.mjs
function $u(e, t, n) {
	let r = e.style, i = t?.style, a = {};
	if (!r) return a;
	for (let t in r) (Nc(r[t]) || i && Nc(i[t]) || Qu(t, e) || n?.getValue(t)?.liveStyle !== void 0) && (a[t] = r[t]);
	return a;
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/render/html/HTMLVisualElement.mjs
function ed(e) {
	return window.getComputedStyle(e);
}
var td = class extends bu {
	constructor() {
		super(...arguments), this.type = "html", this.renderInstance = qu;
	}
	mount(e) {
		e.style, super.mount(e);
	}
	readValueFromInstance(e, t) {
		if (ps.has(t)) return this.projection?.isProjecting ? cs(t) : us(e, t);
		{
			let n = ed(e), r = (ma(t) ? n.getPropertyValue(t) : n[t]) || 0;
			return typeof r == "string" ? r.trim() : r;
		}
	}
	measureInstanceViewportBox(e, { transformPagePoint: t }) {
		return Vu(e, t);
	}
	build(e, t, n) {
		Ku(e, t, n.transformTemplate);
	}
	scrapeMotionValuesFromProps(e, t, n) {
		return $u(e, t, n);
	}
};
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/render/object/ObjectVisualElement.mjs
function nd(e, t) {
	return e in t;
}
var rd = class extends yu {
	constructor() {
		super(...arguments), this.type = "object";
	}
	readValueFromInstance(e, t) {
		if (nd(t, e)) {
			let n = e[t];
			if (typeof n == "string" || typeof n == "number") return n;
		}
	}
	getBaseTargetFromProps() {}
	removeValueFromRenderState(e, t) {
		delete t.output[e];
	}
	measureInstanceViewportBox() {
		return nu();
	}
	build(e, t) {
		Object.assign(e.output, t);
	}
	renderInstance(e, { output: t }) {
		Object.assign(e, t);
	}
	sortInstanceNodePosition() {
		return 0;
	}
}, id = {
	offset: "stroke-dashoffset",
	array: "stroke-dasharray"
}, ad = {
	offset: "strokeDashoffset",
	array: "strokeDasharray"
};
function od(e, t, n = 1, r = 0, i = !0) {
	e.pathLength = 1;
	let a = i ? id : ad;
	e[a.offset] = `${-r}`, e[a.array] = `${t} ${n}`;
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/render/svg/utils/build-attrs.mjs
var sd = [
	"transform",
	"opacity",
	"offsetDistance",
	"offsetPath",
	"offsetRotate",
	"offsetAnchor"
];
function cd(e, { attrX: t, attrY: n, attrScale: r, pathLength: i, pathSpacing: a = 1, pathOffset: o = 0, ...s }, c, l, u) {
	if (Ku(e, s, l), c) {
		e.style.viewBox && (e.attrs.viewBox = e.style.viewBox);
		return;
	}
	e.attrs = e.style, e.style = {};
	let { attrs: d, style: f } = e;
	for (let e of sd) d[e] !== void 0 && (f[e] = d[e], delete d[e]);
	(f.transform || d.transformOrigin) && (f.transformOrigin = d.transformOrigin ?? "50% 50%", delete d.transformOrigin), f.transform && (f.transformBox = u?.transformBox ?? "fill-box", delete d.transformBox), t !== void 0 && (d.x = t), n !== void 0 && (d.y = n), r !== void 0 && (d.scale = r), i !== void 0 && od(d, i, a, o, !1);
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/render/svg/utils/camel-case-attrs.mjs
var ld = /* @__PURE__ */ new Set([
	"baseFrequency",
	"diffuseConstant",
	"kernelMatrix",
	"kernelUnitLength",
	"keySplines",
	"keyTimes",
	"limitingConeAngle",
	"markerHeight",
	"markerWidth",
	"numOctaves",
	"targetX",
	"targetY",
	"surfaceScale",
	"specularConstant",
	"specularExponent",
	"stdDeviation",
	"tableValues",
	"viewBox",
	"gradientTransform",
	"pathLength",
	"startOffset",
	"textLength",
	"lengthAdjust"
]), ud = (e) => typeof e == "string" && e.toLowerCase() === "svg";
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/render/svg/utils/render.mjs
function dd(e, t, n, r) {
	qu(e, t, void 0, r);
	for (let n in t.attrs) e.setAttribute(ld.has(n) ? n : Ic(n), t.attrs[n]);
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/render/svg/utils/scrape-motion-values.mjs
function fd(e, t, n) {
	let r = $u(e, t, n);
	for (let n in e) if (Nc(e[n]) || Nc(t[n])) {
		let t = fs.indexOf(n) === -1 ? n : "attr" + n.charAt(0).toUpperCase() + n.substring(1);
		r[t] = e[n];
	}
	return r;
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/render/svg/SVGVisualElement.mjs
var pd = class extends bu {
	constructor() {
		super(...arguments), this.type = "svg", this.isSVGTag = !1, this.measureInstanceViewportBox = nu;
	}
	getBaseTargetFromProps(e, t) {
		return e[t];
	}
	readValueFromInstance(e, t) {
		if (ps.has(t)) {
			let e = il(t);
			return e && e.default || 0;
		}
		if (sd.includes(t)) {
			let n = getComputedStyle(e)[t];
			if (typeof n == "string" && n) return n.trim();
		}
		return t = ld.has(t) ? t : Ic(t), e.getAttribute(t);
	}
	scrapeMotionValuesFromProps(e, t, n) {
		return fd(e, t, n);
	}
	build(e, t, n) {
		cd(e, t, this.isSVGTag, n.transformTemplate, n.style);
	}
	renderInstance(e, t, n, r) {
		dd(e, t, n, r);
	}
	mount(e) {
		this.isSVGTag = ud(e.tagName), super.mount(e);
	}
}, md = su.length;
function hd(e) {
	if (!e) return;
	if (!e.isControllingVariants) {
		let t = e.parent && hd(e.parent) || {};
		return e.props.initial !== void 0 && (t.initial = e.props.initial), t;
	}
	let t = {};
	for (let n = 0; n < md; n++) {
		let r = su[n], i = e.props[r];
		(au(i) || i === !1) && (t[r] = i);
	}
	return t;
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/render/utils/shallow-compare.mjs
function gd(e, t) {
	if (!Array.isArray(t)) return !1;
	let n = t.length;
	if (n !== e.length) return !1;
	for (let r = 0; r < n; r++) if (t[r] !== e[r]) return !1;
	return !0;
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/render/utils/animation-state.mjs
var _d = [...ou].reverse(), vd = ou.length;
function yd(e) {
	return (t) => Promise.all(t.map(({ animation: t, options: n }) => Wc(e, t, n)));
}
function Q(e) {
	let t = yd(e), n = Sd(), r = !0, i = !1, a = (t) => (n, r) => {
		let i = Dc(e, r, t === "exit" ? e.presenceContext?.custom : void 0);
		if (i) {
			let { transition: e, transitionEnd: t, ...r } = i;
			n = {
				...n,
				...r,
				...t
			};
		}
		return n;
	};
	function o(n) {
		t = n(e);
	}
	function s(o) {
		let { props: s } = e, c = hd(e.parent) || {}, l = [], u = /* @__PURE__ */ new Set(), d = {}, f = Infinity;
		for (let t = 0; t < vd; t++) {
			let p = _d[t], m = n[p], h = s[p] === void 0 ? c[p] : s[p], g = au(h), _ = p === o ? m.isActive : null;
			_ === !1 && (f = t);
			let v = h === c[p] && h !== s[p] && g;
			if (v && (r || i) && e.manuallyAnimateOnMount && (v = !1), m.protectedKeys = { ...d }, !m.isActive && _ === null || !h && !m.prevProp || iu(h) || typeof h == "boolean") continue;
			if (p === "exit" && m.isActive && _ !== !0) {
				m.prevResolvedValues && (d = {
					...d,
					...m.prevResolvedValues
				});
				continue;
			}
			let y = bd(m.prevProp, h), b = y || p === o && m.isActive && !v && g || t > f && g, x = !1, S = Array.isArray(h) ? h : [h], C = S.reduce(a(p), {});
			_ === !1 && (C = {});
			let { prevResolvedValues: w = {} } = m, T = {
				...w,
				...C
			}, E = (t) => {
				b = !0, u.has(t) && (x = !0, u.delete(t)), m.needsAnimating[t] = !0;
				let n = e.getValue(t);
				n && (n.liveStyle = !1);
			};
			for (let e in T) {
				let t = C[e], n = w[e];
				if (d.hasOwnProperty(e)) continue;
				let r = !1;
				r = kc(t) && kc(n) ? !gd(t, n) || y : t !== n, r ? t == null ? u.add(e) : E(e) : t !== void 0 && u.has(e) ? E(e) : m.protectedKeys[e] = !0;
			}
			m.prevProp = h, m.prevResolvedValues = C, m.isActive && (d = {
				...d,
				...C
			}), (r || i) && e.blockInitialAnimation && (b = !1);
			let D = v && y;
			b && (!D || x) && l.push(...S.map((t) => {
				let n = { type: p };
				if (typeof t == "string" && (r || i) && !D && e.manuallyAnimateOnMount && e.parent) {
					let { parent: r } = e, i = Dc(r, t);
					if (r.enteringChildren && i) {
						let { delayChildren: t } = i.transition || {};
						n.delay = oc(r.enteringChildren, e, t);
					}
				}
				return {
					animation: t,
					options: n
				};
			}));
		}
		if (u.size) {
			let t = {};
			if (typeof s.initial != "boolean") {
				let n = Dc(e, Array.isArray(s.initial) ? s.initial[0] : s.initial);
				n && n.transition && (t.transition = n.transition);
			}
			u.forEach((n) => {
				let r = e.getBaseTarget(n), i = e.getValue(n);
				i && (i.liveStyle = !0), t[n] = r ?? null;
			}), l.push({ animation: t });
		}
		let p = !!l.length;
		return r && (s.initial === !1 || s.initial === s.animate) && !e.manuallyAnimateOnMount && (p = !1), r = !1, i = !1, p ? t(l) : Promise.resolve();
	}
	function c(t, r) {
		if (n[t].isActive === r) return Promise.resolve();
		e.variantChildren?.forEach((e) => e.animationState?.setActive(t, r)), n[t].isActive = r;
		let i = s(t);
		for (let e in n) n[e].protectedKeys = {};
		return i;
	}
	return {
		animateChanges: s,
		setActive: c,
		setAnimateFunction: o,
		getState: () => n,
		reset: () => {
			n = Sd(), i = !0;
		}
	};
}
function bd(e, t) {
	return typeof t == "string" ? t !== e : Array.isArray(t) ? !gd(t, e) : !1;
}
function xd(e = !1) {
	return {
		isActive: e,
		protectedKeys: {},
		needsAnimating: {},
		prevResolvedValues: {}
	};
}
function Sd() {
	return {
		animate: xd(!0),
		whileInView: xd(),
		whileHover: xd(),
		whileTap: xd(),
		whileDrag: xd(),
		whileFocus: xd(),
		exit: xd()
	};
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/projection/geometry/copy.mjs
function Cd(e, t) {
	e.min = t.min, e.max = t.max;
}
function wd(e, t) {
	Cd(e.x, t.x), Cd(e.y, t.y);
}
function Td(e, t) {
	e.translate = t.translate, e.scale = t.scale, e.originPoint = t.originPoint, e.origin = t.origin;
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/projection/geometry/delta-calc.mjs
var Ed = .9999, Dd = 1.0001, Od = -.01, kd = .01;
function Ad(e) {
	return e.max - e.min;
}
function jd(e, t, n) {
	return Math.abs(e - t) <= n;
}
function Md(e, t, n, r = .5) {
	e.origin = r, e.originPoint = Y(t.min, t.max, e.origin), e.scale = Ad(n) / Ad(t), e.translate = Y(n.min, n.max, e.origin) - e.originPoint, (e.scale >= Ed && e.scale <= Dd || isNaN(e.scale)) && (e.scale = 1), (e.translate >= Od && e.translate <= kd || isNaN(e.translate)) && (e.translate = 0);
}
function Nd(e, t, n, r) {
	Md(e.x, t.x, n.x, r ? r.originX : void 0), Md(e.y, t.y, n.y, r ? r.originY : void 0);
}
function Pd(e, t, n, r = 0) {
	e.min = (r ? Y(n.min, n.max, r) : n.min) + t.min, e.max = e.min + Ad(t);
}
function Fd(e, t, n, r) {
	Pd(e.x, t.x, n.x, r?.x), Pd(e.y, t.y, n.y, r?.y);
}
function Id(e, t, n, r = 0) {
	let i = r ? Y(n.min, n.max, r) : n.min;
	e.min = t.min - i, e.max = e.min + Ad(t);
}
function Ld(e, t, n, r) {
	Id(e.x, t.x, n.x, r?.x), Id(e.y, t.y, n.y, r?.y);
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/projection/geometry/delta-remove.mjs
function Rd(e, t, n, r, i) {
	return e -= t, e = Au(e, 1 / n, r), i !== void 0 && (e = Au(e, 1 / i, r)), e;
}
function zd(e, t = 0, n = 1, r = .5, i, a = e, o = e) {
	if (Fa.test(t) && (t = parseFloat(t), t = Y(o.min, o.max, t / 100) - o.min), typeof t != "number") return;
	let s = Y(a.min, a.max, r);
	e === a && (s -= t), e.min = Rd(e.min, t, n, s, i), e.max = Rd(e.max, t, n, s, i);
}
function Bd(e, t, [n, r, i], a, o) {
	zd(e, t[n], t[r], t[i], t.scale, a, o);
}
var Vd = [
	"x",
	"scaleX",
	"originX"
], Hd = [
	"y",
	"scaleY",
	"originY"
];
function Ud(e, t, n, r) {
	Bd(e.x, t, Vd, n ? n.x : void 0, r ? r.x : void 0), Bd(e.y, t, Hd, n ? n.y : void 0, r ? r.y : void 0);
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/projection/geometry/utils.mjs
function Wd(e) {
	return e.translate === 0 && e.scale === 1;
}
function Gd(e) {
	return Wd(e.x) && Wd(e.y);
}
function Kd(e, t) {
	return e.min === t.min && e.max === t.max;
}
function qd(e, t) {
	return Kd(e.x, t.x) && Kd(e.y, t.y);
}
function Jd(e, t) {
	return Math.round(e.min) === Math.round(t.min) && Math.round(e.max) === Math.round(t.max);
}
function Yd(e, t) {
	return Jd(e.x, t.x) && Jd(e.y, t.y);
}
function Xd(e) {
	return Ad(e.x) / Ad(e.y);
}
function Zd(e, t) {
	return e.translate === t.translate && e.scale === t.scale && e.originPoint === t.originPoint;
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/projection/utils/each-axis.mjs
function Qd(e) {
	return [e("x"), e("y")];
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/projection/styles/transform.mjs
function $d(e, t, n) {
	let r = "", i = e.x.translate / t.x, a = e.y.translate / t.y, o = n?.z || 0;
	if ((i || a || o) && (r = `translate3d(${i}px, ${a}px, ${o}px) `), (t.x !== 1 || t.y !== 1) && (r += `scale(${1 / t.x}, ${1 / t.y}) `), n) {
		let { transformPerspective: e, rotate: t, pathRotation: i, rotateX: a, rotateY: o, skewX: s, skewY: c } = n;
		e && (r = `perspective(${e}px) ${r}`), t && (r += `rotate(${t}deg) `), i && (r += `rotate(${i}deg) `), a && (r += `rotateX(${a}deg) `), o && (r += `rotateY(${o}deg) `), s && (r += `skewX(${s}deg) `), c && (r += `skewY(${c}deg) `);
	}
	let s = e.x.scale * t.x, c = e.y.scale * t.y;
	return (s !== 1 || c !== 1) && (r += `scale(${s}, ${c})`), r || "none";
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/projection/animation/mix-values.mjs
var ef = ul.length, tf = (e) => typeof e == "string" ? parseFloat(e) : e, nf = (e) => typeof e == "number" || q.test(e);
function rf(e, t, n, r, i, a) {
	i ? (e.opacity = Y(0, n.opacity ?? 1, of(r)), e.opacityExit = Y(t.opacity ?? 1, 0, sf(r))) : a && (e.opacity = Y(t.opacity ?? 1, n.opacity ?? 1, r));
	for (let i = 0; i < ef; i++) {
		let a = ul[i], o = af(t, a), s = af(n, a);
		(o !== void 0 || s !== void 0) && (o ||= 0, s ||= 0, o === 0 || s === 0 || nf(o) === nf(s) ? (e[a] = Math.max(Y(tf(o), tf(s), r), 0), (Fa.test(s) || Fa.test(o)) && (e[a] += "%")) : e[a] = s);
	}
	(t.rotate || n.rotate) && (e.rotate = Y(t.rotate || 0, n.rotate || 0, r));
}
function af(e, t) {
	return e[t] === void 0 ? e.borderRadius : e[t];
}
var of = /*@__PURE__*/ cf(0, .5, Gi), sf = /*@__PURE__*/ cf(.5, .95, Ei);
function cf(e, t, n) {
	return (r) => r < e ? 0 : r > t ? 1 : n(/* @__PURE__ */ K(e, t, r));
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/animation/animate/single-value.mjs
function lf(e, t, n) {
	let r = Nc(e) ? e : dc(e);
	return r.start(xc("", r, t, n)), r.animation;
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/events/add-dom-event.mjs
function uf(e, t, n, r = { passive: !0 }) {
	return e.addEventListener(t, n, r), () => e.removeEventListener(t, n, r);
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/projection/utils/compare-by-depth.mjs
var df = (e, t) => e.depth - t.depth, ff = class {
	constructor() {
		this.children = [], this.isDirty = !1;
	}
	add(e) {
		vi(this.children, e), this.isDirty = !0;
	}
	remove(e) {
		yi(this.children, e), this.isDirty = !0;
	}
	forEach(e) {
		this.isDirty && this.children.sort(df), this.isDirty = !1, this.children.forEach(e);
	}
};
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/utils/delay.mjs
function pf(e, t) {
	let n = fa.now(), r = ({ timestamp: i }) => {
		let a = i - n;
		a >= t && (sa(r), e(a - t));
	};
	return oa.setup(r, !0), () => sa(r);
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/value/utils/resolve-motion-value.mjs
function mf(e) {
	return Nc(e) ? e.get() : e;
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/projection/shared/stack.mjs
var hf = class {
	constructor() {
		this.members = [];
	}
	add(e) {
		vi(this.members, e);
		for (let t = this.members.length - 1; t >= 0; t--) {
			let n = this.members[t];
			if (n === e || n === this.lead || n === this.prevLead) continue;
			let r = n.instance;
			(!r || r.isConnected === !1) && !n.snapshot && (yi(this.members, n), n.unmount());
		}
		e.scheduleRender();
	}
	remove(e) {
		if (yi(this.members, e), e === this.prevLead && (this.prevLead = void 0), e === this.lead) {
			let e = this.members[this.members.length - 1];
			e && this.promote(e);
		}
	}
	relegate(e) {
		for (let t = this.members.indexOf(e) - 1; t >= 0; t--) {
			let e = this.members[t];
			if (e.isPresent !== !1 && e.instance?.isConnected !== !1) return this.promote(e), !0;
		}
		return !1;
	}
	promote(e, t) {
		let n = this.lead;
		if (e !== n && (this.prevLead = n, this.lead = e, e.show(), n)) {
			n.updateSnapshot(), e.scheduleRender();
			let { layoutDependency: r } = n.options, { layoutDependency: i } = e.options;
			(r === void 0 || r !== i) && (e.resumeFrom = n, t && (n.preserveOpacity = !0), n.snapshot && (e.snapshot = n.snapshot, e.snapshot.latestValues = n.animationValues || n.latestValues), e.root?.isUpdating && (e.isLayoutDirty = !0)), e.options.crossfade === !1 && n.hide();
		}
	}
	exitAnimationComplete() {
		this.members.forEach((e) => {
			e.options.onExitComplete?.(), e.resumingFrom?.options.onExitComplete?.();
		});
	}
	scheduleRender() {
		this.members.forEach((e) => e.instance && e.scheduleRender(!1));
	}
	removeLeadSnapshot() {
		this.lead?.snapshot && (this.lead.snapshot = void 0);
	}
}, gf = {
	hasAnimatedSinceResize: !0,
	hasEverUpdated: !1
}, _f = {
	nodes: 0,
	calculatedTargetDeltas: 0,
	calculatedProjections: 0
}, vf = [
	"",
	"X",
	"Y",
	"Z"
], yf = 1e3, bf = 0;
function xf(e, t, n, r) {
	let { latestValues: i } = t;
	i[e] && (n[e] = i[e], t.setStaticValue(e, 0), r && (r[e] = 0));
}
function Sf(e) {
	if (e.hasCheckedOptimisedAppear = !0, e.root === e) return;
	let { visualElement: t } = e.options;
	if (!t) return;
	let n = Rc(t);
	if (window.MotionHasOptimisedAnimation(n, "transform")) {
		let { layout: t, layoutId: r } = e.options;
		window.MotionCancelOptimisedAnimation(n, "transform", oa, !(t || r));
	}
	let { parent: r } = e;
	r && !r.hasCheckedOptimisedAppear && Sf(r);
}
function Cf({ attachResizeListener: e, defaultParent: t, measureScroll: n, checkIsScrollRoot: r, resetTransform: i }) {
	return class {
		constructor(e = {}, n = t?.()) {
			this.id = bf++, this.animationId = 0, this.animationCommitId = 0, this.children = /* @__PURE__ */ new Set(), this.options = {}, this.isTreeAnimating = !1, this.isAnimationBlocked = !1, this.isLayoutDirty = !1, this.isProjectionDirty = !1, this.isSharedProjectionDirty = !1, this.isTransformDirty = !1, this.updateManuallyBlocked = !1, this.updateBlockedByResize = !1, this.isUpdating = !1, this.isSVG = !1, this.needsReset = !1, this.shouldResetTransform = !1, this.hasCheckedOptimisedAppear = !1, this.treeScale = {
				x: 1,
				y: 1
			}, this.eventHandlers = /* @__PURE__ */ new Map(), this.hasTreeAnimated = !1, this.layoutVersion = 0, this.updateScheduled = !1, this.scheduleUpdate = () => this.update(), this.projectionUpdateScheduled = !1, this.checkUpdateFailed = () => {
				this.isUpdating && (this.isUpdating = !1, this.clearAllSnapshots());
			}, this.updateProjection = () => {
				this.projectionUpdateScheduled = !1, Jl.value && (_f.nodes = _f.calculatedTargetDeltas = _f.calculatedProjections = 0), this.nodes.forEach(Ef), this.nodes.forEach(Ff), this.nodes.forEach(If), this.nodes.forEach(Df), Jl.addProjectionMetrics && Jl.addProjectionMetrics(_f);
			}, this.resolvedRelativeTargetAt = 0, this.linkedParentVersion = 0, this.hasProjected = !1, this.isVisible = !0, this.animationProgress = 0, this.sharedNodes = /* @__PURE__ */ new Map(), this.latestValues = e, this.root = n ? n.root || n : this, this.path = n ? [...n.path, n] : [], this.parent = n, this.depth = n ? n.depth + 1 : 0;
			for (let e = 0; e < this.path.length; e++) this.path[e].shouldResetTransform = !0;
			this.root === this && (this.nodes = new ff());
		}
		addEventListener(e, t) {
			return this.eventHandlers.has(e) || this.eventHandlers.set(e, new Oi()), this.eventHandlers.get(e).add(t);
		}
		notifyListeners(e, ...t) {
			let n = this.eventHandlers.get(e);
			n && n.notify(...t);
		}
		hasListeners(e) {
			return this.eventHandlers.has(e);
		}
		mount(t) {
			if (this.instance) return;
			this.isSVG = Fl(t) && !Yl(t), this.instance = t;
			let { layoutId: n, layout: r, visualElement: i } = this.options;
			if (i && !i.current && i.mount(t), this.root.nodes.add(this), this.parent && this.parent.children.add(this), this.root.hasTreeAnimated && (r || n) && (this.isLayoutDirty = !0), e) {
				let n, r = 0, i = () => this.root.updateBlockedByResize = !1;
				oa.read(() => {
					r = window.innerWidth;
				}), e(t, () => {
					let e = window.innerWidth;
					e !== r && (r = e, this.root.updateBlockedByResize = !0, n && n(), n = pf(i, 250), gf.hasAnimatedSinceResize && (gf.hasAnimatedSinceResize = !1, this.nodes.forEach(Pf)));
				});
			}
			n && this.root.registerSharedNode(n, this), this.options.animate !== !1 && i && (n || r) && this.addEventListener("didUpdate", ({ delta: e, hasLayoutChanged: t, hasRelativeLayoutChanged: n, layout: r }) => {
				if (this.isTreeAnimationBlocked()) {
					this.target = void 0, this.relativeTarget = void 0;
					return;
				}
				let a = this.options.transition || i.getDefaultTransition() || Uf, { onLayoutAnimationStart: o, onLayoutAnimationComplete: s } = i.getProps(), c = !this.targetLayout || !Yd(this.targetLayout, r), l = !t && n;
				if (this.options.layoutRoot || this.resumeFrom || l || t && (c || !this.currentAnimation)) {
					this.resumeFrom && (this.resumingFrom = this.resumeFrom, this.resumingFrom.resumingFrom = void 0);
					let t = {
						...pc(a, "layout"),
						onPlay: o,
						onComplete: s
					};
					(i.shouldReduceMotion || this.options.layoutRoot) && (t.delay = 0, t.type = !1), this.startAnimation(t), this.setAnimationOrigin(e, l, t.path);
				} else t || Pf(this), this.isLead() && this.options.onExitComplete && this.options.onExitComplete();
				this.targetLayout = r;
			});
		}
		unmount() {
			this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this);
			let e = this.getStack();
			e && e.remove(this), this.parent && this.parent.children.delete(this), this.instance = void 0, this.eventHandlers.clear(), sa(this.updateProjection);
		}
		blockUpdate() {
			this.updateManuallyBlocked = !0;
		}
		unblockUpdate() {
			this.updateManuallyBlocked = !1;
		}
		isUpdateBlocked() {
			return this.updateManuallyBlocked || this.updateBlockedByResize;
		}
		isTreeAnimationBlocked() {
			return this.isAnimationBlocked || this.parent && this.parent.isTreeAnimationBlocked() || !1;
		}
		startUpdate() {
			this.isUpdateBlocked() || (this.isUpdating = !0, this.nodes && this.nodes.forEach(Lf), this.animationId++);
		}
		getTransformTemplate() {
			let { visualElement: e } = this.options;
			return e && e.getProps().transformTemplate;
		}
		willUpdate(e = !0) {
			if (this.root.hasTreeAnimated = !0, this.root.isUpdateBlocked()) {
				this.options.onExitComplete && this.options.onExitComplete();
				return;
			}
			if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && Sf(this), !this.root.isUpdating && this.root.startUpdate(), this.isLayoutDirty) return;
			this.isLayoutDirty = !0;
			for (let e = 0; e < this.path.length; e++) {
				let t = this.path[e];
				t.shouldResetTransform = !0, (typeof t.latestValues.x == "string" || typeof t.latestValues.y == "string") && (t.isLayoutDirty = !0), t.updateScroll("snapshot"), t.options.layoutRoot && t.willUpdate(!1);
			}
			let { layoutId: t, layout: n } = this.options;
			if (t === void 0 && !n) return;
			let r = this.getTransformTemplate();
			this.prevTransformTemplateValue = r ? r(this.latestValues, "") : void 0, this.updateSnapshot(), e && this.notifyListeners("willUpdate");
		}
		update() {
			if (this.updateScheduled = !1, this.isUpdateBlocked()) {
				let e = this.updateBlockedByResize;
				this.unblockUpdate(), this.updateBlockedByResize = !1, this.clearAllSnapshots(), e && this.nodes.forEach(Af), this.nodes.forEach(kf);
				return;
			}
			if (this.animationId <= this.animationCommitId) {
				this.nodes.forEach(jf);
				return;
			}
			this.animationCommitId = this.animationId, this.isUpdating ? (this.isUpdating = !1, this.nodes.forEach(Mf), this.nodes.forEach(Nf), this.nodes.forEach(wf), this.nodes.forEach(Tf)) : this.nodes.forEach(jf), this.clearAllSnapshots();
			let e = fa.now();
			ca.delta = bi(0, 1e3 / 60, e - ca.timestamp), ca.timestamp = e, ca.isProcessing = !0, la.update.process(ca), la.preRender.process(ca), la.render.process(ca), ca.isProcessing = !1;
		}
		didUpdate() {
			this.updateScheduled || (this.updateScheduled = !0, ml.read(this.scheduleUpdate));
		}
		clearAllSnapshots() {
			this.nodes.forEach(Of), this.sharedNodes.forEach(Rf);
		}
		scheduleUpdateProjection() {
			this.projectionUpdateScheduled || (this.projectionUpdateScheduled = !0, oa.preRender(this.updateProjection, !1, !0));
		}
		scheduleCheckAfterUnmount() {
			oa.postRender(() => {
				this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed();
			});
		}
		updateSnapshot() {
			this.snapshot || !this.instance || (this.snapshot = this.measure(), this.snapshot && !Ad(this.snapshot.measuredBox.x) && !Ad(this.snapshot.measuredBox.y) && (this.snapshot = void 0));
		}
		updateLayout() {
			if (!this.instance || (this.updateScroll(), !(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty)) return;
			if (this.resumeFrom && !this.resumeFrom.instance) for (let e = 0; e < this.path.length; e++) this.path[e].updateScroll();
			let e = this.layout;
			this.layout = this.measure(!1), this.layoutVersion++, this.layoutCorrected ||= nu(), this.isLayoutDirty = !1, this.projectionDelta = void 0, this.notifyListeners("measure", this.layout.layoutBox);
			let { visualElement: t } = this.options;
			t && t.notify("LayoutMeasure", this.layout.layoutBox, e ? e.layoutBox : void 0);
		}
		updateScroll(e = "measure") {
			let t = !!(this.options.layoutScroll && this.instance);
			if (this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === e && (t = !1), t && this.instance) {
				let t = r(this.instance);
				this.scroll = {
					animationId: this.root.animationId,
					phase: e,
					isRoot: t,
					offset: n(this.instance),
					wasRoot: this.scroll ? this.scroll.isRoot : t
				};
			}
		}
		resetTransform() {
			if (!i) return;
			let e = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout, t = this.projectionDelta && !Gd(this.projectionDelta), n = this.getTransformTemplate(), r = n ? n(this.latestValues, "") : void 0, a = r !== this.prevTransformTemplateValue;
			e && this.instance && (t || Du(this.latestValues) || a) && (i(this.instance, r), this.shouldResetTransform = !1, this.scheduleRender());
		}
		measure(e = !0) {
			let t = this.measurePageBox(), n = this.removeElementScroll(t);
			return e && (n = this.removeTransform(n)), qf(n), {
				animationId: this.root.animationId,
				measuredBox: t,
				layoutBox: n,
				latestValues: {},
				source: this.id
			};
		}
		measurePageBox() {
			let { visualElement: e } = this.options;
			if (!e) return nu();
			let t = e.measureViewportBox();
			if (!(this.scroll?.wasRoot || this.path.some(Yf))) {
				let { scroll: e } = this.root;
				e && (Lu(t.x, e.offset.x), Lu(t.y, e.offset.y));
			}
			return t;
		}
		removeElementScroll(e) {
			let t = nu();
			if (wd(t, e), this.scroll?.wasRoot) return t;
			for (let n = 0; n < this.path.length; n++) {
				let r = this.path[n], { scroll: i, options: a } = r;
				r !== this.root && i && a.layoutScroll && (i.wasRoot && wd(t, e), Lu(t.x, i.offset.x), Lu(t.y, i.offset.y));
			}
			return t;
		}
		applyTransform(e, t = !1, n) {
			let r = n || nu();
			wd(r, e);
			for (let e = 0; e < this.path.length; e++) {
				let n = this.path[e];
				!t && n.options.layoutScroll && n.scroll && n !== n.root && (Lu(r.x, -n.scroll.offset.x), Lu(r.y, -n.scroll.offset.y)), Du(n.latestValues) && Bu(r, n.latestValues, n.layout?.layoutBox);
			}
			return Du(this.latestValues) && Bu(r, this.latestValues, this.layout?.layoutBox), r;
		}
		removeTransform(e) {
			let t = nu();
			wd(t, e);
			for (let e = 0; e < this.path.length; e++) {
				let n = this.path[e];
				if (!Du(n.latestValues)) continue;
				let r;
				n.instance && (Eu(n.latestValues) && n.updateSnapshot(), r = nu(), wd(r, n.measurePageBox())), Ud(t, n.latestValues, n.snapshot?.layoutBox, r);
			}
			return Du(this.latestValues) && Ud(t, this.latestValues), t;
		}
		setTargetDelta(e) {
			this.targetDelta = e, this.root.scheduleUpdateProjection(), this.isProjectionDirty = !0;
		}
		setOptions(e) {
			this.options = {
				...this.options,
				...e,
				crossfade: e.crossfade === void 0 || e.crossfade
			};
		}
		clearMeasurements() {
			this.scroll = void 0, this.layout = void 0, this.snapshot = void 0, this.prevTransformTemplateValue = void 0, this.targetDelta = void 0, this.target = void 0, this.isLayoutDirty = !1;
		}
		forceRelativeParentToResolveTarget() {
			this.relativeParent && this.relativeParent.resolvedRelativeTargetAt !== ca.timestamp && this.relativeParent.resolveTargetDelta(!0);
		}
		resolveTargetDelta(e = !1) {
			let t = this.getLead();
			this.isProjectionDirty ||= t.isProjectionDirty, this.isTransformDirty ||= t.isTransformDirty, this.isSharedProjectionDirty ||= t.isSharedProjectionDirty;
			let n = !!this.resumingFrom || this !== t;
			if (!(e || n && this.isSharedProjectionDirty || this.isProjectionDirty || this.parent?.isProjectionDirty || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize)) return;
			let { layout: r, layoutId: i } = this.options;
			if (!this.layout || !(r || i)) return;
			this.resolvedRelativeTargetAt = ca.timestamp;
			let a = this.getClosestProjectingParent();
			a && this.linkedParentVersion !== a.layoutVersion && !a.options.layoutRoot && this.removeRelativeTarget(), !this.targetDelta && !this.relativeTarget && (this.options.layoutAnchor !== !1 && a && a.layout ? this.createRelativeTarget(a, this.layout.layoutBox, a.layout.layoutBox) : this.removeRelativeTarget()), !(!this.relativeTarget && !this.targetDelta) && (this.target || (this.target = nu(), this.targetWithTransforms = nu()), this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target ? (this.forceRelativeParentToResolveTarget(), Fd(this.target, this.relativeTarget, this.relativeParent.target, this.options.layoutAnchor || void 0)) : this.targetDelta ? (this.resumingFrom ? this.applyTransform(this.layout.layoutBox, !1, this.target) : wd(this.target, this.layout.layoutBox), Nu(this.target, this.targetDelta)) : wd(this.target, this.layout.layoutBox), this.attemptToResolveRelativeTarget && (this.attemptToResolveRelativeTarget = !1, this.options.layoutAnchor !== !1 && a && !!a.resumingFrom == !!this.resumingFrom && !a.options.layoutScroll && a.target && this.animationProgress !== 1 ? this.createRelativeTarget(a, this.target, a.target) : this.relativeParent = this.relativeTarget = void 0), Jl.value && _f.calculatedTargetDeltas++);
		}
		getClosestProjectingParent() {
			if (!(!this.parent || Eu(this.parent.latestValues) || Ou(this.parent.latestValues))) return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent();
		}
		isProjecting() {
			return !!((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
		}
		createRelativeTarget(e, t, n) {
			this.relativeParent = e, this.linkedParentVersion = e.layoutVersion, this.forceRelativeParentToResolveTarget(), this.relativeTarget = nu(), this.relativeTargetOrigin = nu(), Ld(this.relativeTargetOrigin, t, n, this.options.layoutAnchor || void 0), wd(this.relativeTarget, this.relativeTargetOrigin);
		}
		removeRelativeTarget() {
			this.relativeParent = this.relativeTarget = void 0;
		}
		calcProjection() {
			let e = this.getLead(), t = !!this.resumingFrom || this !== e, n = !0;
			if ((this.isProjectionDirty || this.parent?.isProjectionDirty) && (n = !1), t && (this.isSharedProjectionDirty || this.isTransformDirty) && (n = !1), this.resolvedRelativeTargetAt === ca.timestamp && (n = !1), n) return;
			let { layout: r, layoutId: i } = this.options;
			if (this.isTreeAnimating = !!(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation), this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0), !this.layout || !(r || i)) return;
			wd(this.layoutCorrected, this.layout.layoutBox);
			let a = this.treeScale.x, o = this.treeScale.y;
			Iu(this.layoutCorrected, this.treeScale, this.path, t), e.layout && !e.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1) && (e.target = e.layout.layoutBox, e.targetWithTransforms = nu());
			let { target: s } = e;
			if (!s) {
				this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
				return;
			}
			!this.projectionDelta || !this.prevProjectionDelta ? this.createProjectionDeltas() : (Td(this.prevProjectionDelta.x, this.projectionDelta.x), Td(this.prevProjectionDelta.y, this.projectionDelta.y)), Nd(this.projectionDelta, this.layoutCorrected, s, this.latestValues), (this.treeScale.x !== a || this.treeScale.y !== o || !Zd(this.projectionDelta.x, this.prevProjectionDelta.x) || !Zd(this.projectionDelta.y, this.prevProjectionDelta.y)) && (this.hasProjected = !0, this.scheduleRender(), this.notifyListeners("projectionUpdate", s)), Jl.value && _f.calculatedProjections++;
		}
		hide() {
			this.isVisible = !1;
		}
		show() {
			this.isVisible = !0;
		}
		scheduleRender(e = !0) {
			if (this.options.visualElement?.scheduleRender(), e) {
				let e = this.getStack();
				e && e.scheduleRender();
			}
			this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0);
		}
		createProjectionDeltas() {
			this.prevProjectionDelta = eu(), this.projectionDelta = eu(), this.projectionDeltaWithTransform = eu();
		}
		setAnimationOrigin(e, t = !1, n) {
			let r = this.snapshot, i = r ? r.latestValues : {}, a = { ...this.latestValues }, o = eu();
			(!this.relativeParent || !this.relativeParent.options.layoutRoot) && (this.relativeTarget = this.relativeTargetOrigin = void 0), this.attemptToResolveRelativeTarget = !t;
			let s = nu(), c = (r ? r.source : void 0) !== (this.layout ? this.layout.source : void 0), l = this.getStack(), u = !l || l.members.length <= 1, d = !!(c && !u && this.options.crossfade === !0 && !this.path.some(Hf));
			this.animationProgress = 0;
			let f, p = n?.interpolateProjection(e);
			this.mixTargetDelta = (t) => {
				let n = t / 1e3, r = p?.(n);
				r ? (o.x.translate = r.x, o.x.scale = Y(e.x.scale, 1, n), o.x.origin = e.x.origin, o.x.originPoint = e.x.originPoint, o.y.translate = r.y, o.y.scale = Y(e.y.scale, 1, n), o.y.origin = e.y.origin, o.y.originPoint = e.y.originPoint) : (zf(o.x, e.x, n), zf(o.y, e.y, n)), this.setTargetDelta(o), this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout && (Ld(s, this.layout.layoutBox, this.relativeParent.layout.layoutBox, this.options.layoutAnchor || void 0), Vf(this.relativeTarget, this.relativeTargetOrigin, s, n), f && qd(this.relativeTarget, f) && (this.isProjectionDirty = !1), f ||= nu(), wd(f, this.relativeTarget)), c && (this.animationValues = a, rf(a, i, this.latestValues, n, d, u)), r && r.rotate !== void 0 && (this.animationValues ||= a, this.animationValues.pathRotation = r.rotate), this.root.scheduleUpdateProjection(), this.scheduleRender(), this.animationProgress = n;
			}, this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
		}
		startAnimation(e) {
			this.notifyListeners("animationStart"), this.currentAnimation?.stop(), this.resumingFrom?.currentAnimation?.stop(), this.pendingAnimation &&= (sa(this.pendingAnimation), void 0), this.pendingAnimation = oa.update(() => {
				gf.hasAnimatedSinceResize = !0, this.motionValue ||= dc(0), this.motionValue.jump(0, !1), this.currentAnimation = lf(this.motionValue, [0, 1e3], {
					...e,
					velocity: 0,
					isSync: !0,
					onUpdate: (t) => {
						this.mixTargetDelta(t), e.onUpdate && e.onUpdate(t);
					},
					onComplete: () => {
						e.onComplete && e.onComplete(), this.completeAnimation();
					}
				}), this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation), this.pendingAnimation = void 0;
			});
		}
		completeAnimation() {
			this.resumingFrom && (this.resumingFrom.currentAnimation = void 0, this.resumingFrom.preserveOpacity = void 0);
			let e = this.getStack();
			e && e.exitAnimationComplete(), this.resumingFrom = this.currentAnimation = this.animationValues = void 0, this.notifyListeners("animationComplete");
		}
		finishAnimation() {
			this.currentAnimation && (this.mixTargetDelta && this.mixTargetDelta(yf), this.currentAnimation.stop()), this.completeAnimation();
		}
		applyTransformsToTarget() {
			let e = this.getLead(), { targetWithTransforms: t, target: n, layout: r, latestValues: i } = e;
			if (!(!t || !n || !r)) {
				if (this !== e && this.layout && r && Jf(this.options.animationType, this.layout.layoutBox, r.layoutBox)) {
					n = this.target || nu();
					let t = Ad(this.layout.layoutBox.x);
					n.x.min = e.target.x.min, n.x.max = n.x.min + t;
					let r = Ad(this.layout.layoutBox.y);
					n.y.min = e.target.y.min, n.y.max = n.y.min + r;
				}
				wd(t, n), Bu(t, i), Nd(this.projectionDeltaWithTransform, this.layoutCorrected, t, i);
			}
		}
		registerSharedNode(e, t) {
			this.sharedNodes.has(e) || this.sharedNodes.set(e, new hf()), this.sharedNodes.get(e).add(t);
			let n = t.options.initialPromotionConfig;
			t.promote({
				transition: n ? n.transition : void 0,
				preserveFollowOpacity: n && n.shouldPreserveFollowOpacity ? n.shouldPreserveFollowOpacity(t) : void 0
			});
		}
		isLead() {
			let e = this.getStack();
			return !e || e.lead === this;
		}
		getLead() {
			let { layoutId: e } = this.options;
			return e && this.getStack()?.lead || this;
		}
		getPrevLead() {
			let { layoutId: e } = this.options;
			return e ? this.getStack()?.prevLead : void 0;
		}
		getStack() {
			let { layoutId: e } = this.options;
			if (e) return this.root.sharedNodes.get(e);
		}
		promote({ needsReset: e, transition: t, preserveFollowOpacity: n } = {}) {
			let r = this.getStack();
			r && r.promote(this, n), e && (this.projectionDelta = void 0, this.needsReset = !0), t && this.setOptions({ transition: t });
		}
		relegate() {
			let e = this.getStack();
			return e ? e.relegate(this) : !1;
		}
		resetSkewAndRotation() {
			let { visualElement: e } = this.options;
			if (!e) return;
			let t = !1, { latestValues: n } = e;
			if ((n.z || n.rotate || n.rotateX || n.rotateY || n.rotateZ || n.skewX || n.skewY) && (t = !0), !t) return;
			let r = {};
			n.z && xf("z", e, r, this.animationValues);
			for (let t = 0; t < vf.length; t++) xf(`rotate${vf[t]}`, e, r, this.animationValues), xf(`skew${vf[t]}`, e, r, this.animationValues);
			e.render();
			for (let t in r) e.setStaticValue(t, r[t]), this.animationValues && (this.animationValues[t] = r[t]);
			e.scheduleRender();
		}
		applyProjectionStyles(e, t) {
			if (!this.instance || this.isSVG) return;
			if (!this.isVisible) {
				e.visibility = "hidden";
				return;
			}
			let n = this.getTransformTemplate();
			if (this.needsReset) {
				this.needsReset = !1, e.visibility = "", e.opacity = "", e.pointerEvents = mf(t?.pointerEvents) || "", e.transform = n ? n(this.latestValues, "") : "none";
				return;
			}
			let r = this.getLead();
			if (!this.projectionDelta || !this.layout || !r.target) {
				this.options.layoutId && (e.opacity = this.latestValues.opacity === void 0 ? 1 : this.latestValues.opacity, e.pointerEvents = mf(t?.pointerEvents) || ""), this.hasProjected && !Du(this.latestValues) && (e.transform = n ? n({}, "") : "none", this.hasProjected = !1);
				return;
			}
			e.visibility = "";
			let i = r.animationValues || r.latestValues;
			this.applyTransformsToTarget();
			let a = $d(this.projectionDeltaWithTransform, this.treeScale, i);
			n && (a = n(i, a)), e.transform = a;
			let { x: o, y: s } = this.projectionDelta;
			e.transformOrigin = `${o.origin * 100}% ${s.origin * 100}% 0`, e.opacity = r.animationValues ? r === this ? i.opacity ?? this.latestValues.opacity ?? 1 : this.preserveOpacity ? this.latestValues.opacity : i.opacityExit : r === this ? i.opacity === void 0 ? "" : i.opacity : i.opacityExit === void 0 ? 0 : i.opacityExit;
			for (let t in Zu) {
				if (i[t] === void 0) continue;
				let { correct: n, applyTo: o, isCSSVariable: s } = Zu[t], c = a === "none" ? i[t] : n(i[t], r);
				if (o) {
					let t = o.length;
					for (let n = 0; n < t; n++) e[o[n]] = c;
				} else s ? this.options.visualElement.renderState.vars[t] = c : e[t] = c;
			}
			this.options.layoutId && (e.pointerEvents = r === this ? mf(t?.pointerEvents) || "" : "none");
		}
		clearSnapshot() {
			this.resumeFrom = this.snapshot = void 0;
		}
		resetTree() {
			this.root.nodes.forEach((e) => e.currentAnimation?.stop()), this.root.nodes.forEach(kf), this.root.sharedNodes.clear();
		}
	};
}
function wf(e) {
	e.updateLayout();
}
function Tf(e) {
	let t = e.resumeFrom?.snapshot || e.snapshot;
	if (e.isLead() && e.layout && t && e.hasListeners("didUpdate")) {
		let { layoutBox: n, measuredBox: r } = e.layout, { animationType: i } = e.options, a = t.source !== e.layout.source;
		if (i === "size") Qd((e) => {
			let r = a ? t.measuredBox[e] : t.layoutBox[e], i = Ad(r);
			r.min = n[e].min, r.max = r.min + i;
		});
		else if (i === "x" || i === "y") {
			let e = i === "x" ? "y" : "x";
			Cd(a ? t.measuredBox[e] : t.layoutBox[e], n[e]);
		} else Jf(i, t.layoutBox, n) && Qd((r) => {
			let i = a ? t.measuredBox[r] : t.layoutBox[r], o = Ad(n[r]);
			i.max = i.min + o, e.relativeTarget && !e.currentAnimation && (e.isProjectionDirty = !0, e.relativeTarget[r].max = e.relativeTarget[r].min + o);
		});
		let o = eu();
		Nd(o, n, t.layoutBox);
		let s = eu();
		a ? Nd(s, e.applyTransform(r, !0), t.measuredBox) : Nd(s, n, t.layoutBox);
		let c = !Gd(o), l = !1;
		if (!e.resumeFrom) {
			let r = e.getClosestProjectingParent();
			if (r && !r.resumeFrom) {
				let { snapshot: i, layout: a } = r;
				if (i && a) {
					let o = e.options.layoutAnchor || void 0, s = nu();
					Ld(s, t.layoutBox, i.layoutBox, o);
					let c = nu();
					Ld(c, n, a.layoutBox, o), Yd(s, c) || (l = !0), r.options.layoutRoot && (e.relativeTarget = c, e.relativeTargetOrigin = s, e.relativeParent = r);
				}
			}
		}
		e.notifyListeners("didUpdate", {
			layout: n,
			snapshot: t,
			delta: s,
			layoutDelta: o,
			hasLayoutChanged: c,
			hasRelativeLayoutChanged: l
		});
	} else if (e.isLead()) {
		let { onExitComplete: t } = e.options;
		t && t();
	}
	e.options.transition = void 0;
}
function Ef(e) {
	Jl.value && _f.nodes++, e.parent && (e.isProjecting() || (e.isProjectionDirty = e.parent.isProjectionDirty), e.isSharedProjectionDirty ||= !!(e.isProjectionDirty || e.parent.isProjectionDirty || e.parent.isSharedProjectionDirty), e.isTransformDirty ||= e.parent.isTransformDirty);
}
function Df(e) {
	e.isProjectionDirty = e.isSharedProjectionDirty = e.isTransformDirty = !1;
}
function Of(e) {
	e.clearSnapshot();
}
function kf(e) {
	e.clearMeasurements();
}
function Af(e) {
	e.isLayoutDirty = !0, e.updateLayout();
}
function jf(e) {
	e.isLayoutDirty = !1;
}
function Mf(e) {
	e.isAnimationBlocked && e.layout && !e.isLayoutDirty && (e.snapshot = e.layout, e.isLayoutDirty = !0);
}
function Nf(e) {
	let { visualElement: t } = e.options;
	t && t.getProps().onBeforeLayoutMeasure && t.notify("BeforeLayoutMeasure"), e.resetTransform();
}
function Pf(e) {
	e.finishAnimation(), e.targetDelta = e.relativeTarget = e.target = void 0, e.isProjectionDirty = !0;
}
function Ff(e) {
	e.resolveTargetDelta();
}
function If(e) {
	e.calcProjection();
}
function Lf(e) {
	e.resetSkewAndRotation();
}
function Rf(e) {
	e.removeLeadSnapshot();
}
function zf(e, t, n) {
	e.translate = Y(t.translate, 0, n), e.scale = Y(t.scale, 1, n), e.origin = t.origin, e.originPoint = t.originPoint;
}
function Bf(e, t, n, r) {
	e.min = Y(t.min, n.min, r), e.max = Y(t.max, n.max, r);
}
function Vf(e, t, n, r) {
	Bf(e.x, t.x, n.x, r), Bf(e.y, t.y, n.y, r);
}
function Hf(e) {
	return e.animationValues && e.animationValues.opacityExit !== void 0;
}
var Uf = {
	duration: .45,
	ease: [
		.4,
		0,
		.1,
		1
	]
}, Wf = (e) => typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(e), Gf = Wf("applewebkit/") && !Wf("chrome/") ? Math.round : Ei;
function Kf(e) {
	e.min = Gf(e.min), e.max = Gf(e.max);
}
function qf(e) {
	Kf(e.x), Kf(e.y);
}
function Jf(e, t, n) {
	return e === "position" || e === "preserve-aspect" && !jd(Xd(t), Xd(n), .2);
}
function Yf(e) {
	return e !== e.root && e.scroll?.wasRoot;
}
//#endregion
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/projection/node/DocumentProjectionNode.mjs
var Xf = Cf({
	attachResizeListener: (e, t) => uf(e, "resize", t),
	measureScroll: () => ({
		x: document.documentElement.scrollLeft || document.body?.scrollLeft || 0,
		y: document.documentElement.scrollTop || document.body?.scrollTop || 0
	}),
	checkIsScrollRoot: () => !0
}), Zf = { current: void 0 }, Qf = Cf({
	measureScroll: (e) => ({
		x: e.scrollLeft,
		y: e.scrollTop
	}),
	defaultParent: () => {
		if (!Zf.current) {
			let e = new Xf({});
			e.mount(window), e.setOptions({ layoutScroll: !0 }), Zf.current = e;
		}
		return Zf.current;
	},
	resetTransform: (e, t) => {
		e.style.transform = t === void 0 ? "none" : t;
	},
	checkIsScrollRoot: (e) => window.getComputedStyle(e).position === "fixed"
}), $f = (0, C.createContext)({
	transformPagePoint: (e) => e,
	isStatic: !1,
	reducedMotion: "never"
});
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/utils/use-composed-ref.mjs
function ep(e, t) {
	if (typeof e == "function") return e(t);
	e != null && (e.current = t);
}
function tp(...e) {
	return (t) => {
		let n = !1, r = e.map((e) => {
			let r = ep(e, t);
			return !n && typeof r == "function" && (n = !0), r;
		});
		if (n) return () => {
			for (let t = 0; t < r.length; t++) {
				let n = r[t];
				typeof n == "function" ? n() : ep(e[t], null);
			}
		};
	};
}
function np(...e) {
	return C.useCallback(tp(...e), e);
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/components/AnimatePresence/PopChild.mjs
var rp = class extends C.Component {
	getSnapshotBeforeUpdate(e) {
		let t = this.props.childRef.current;
		if (pl(t) && e.isPresent && !this.props.isPresent && this.props.pop !== !1) {
			let e = t.offsetParent, n = pl(e) && e.offsetWidth || 0, r = pl(e) && e.offsetHeight || 0, i = getComputedStyle(t), a = this.props.sizeRef.current;
			a.height = parseFloat(i.height), a.width = parseFloat(i.width), a.top = t.offsetTop, a.left = t.offsetLeft, a.right = n - a.width - a.left, a.bottom = r - a.height - a.top, a.direction = i.direction;
		}
		return null;
	}
	componentDidUpdate() {}
	render() {
		return this.props.children;
	}
};
function ip({ children: e, isPresent: t, anchorX: n, anchorY: r, root: i, pop: a }) {
	let o = (0, C.useId)(), s = (0, C.useRef)(null), c = (0, C.useRef)({
		width: 0,
		height: 0,
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		direction: "ltr"
	}), { nonce: l } = (0, C.useContext)($f), u = np(s, a === !1 ? void 0 : e.props?.ref ?? e?.ref);
	return (0, C.useInsertionEffect)(() => {
		let { width: e, height: u, top: d, left: f, right: p, bottom: m, direction: h } = c.current;
		if (t || a === !1 || !s.current || !e || !u) return;
		let g = h === "rtl", _ = n === "left" ? g ? `right: ${p}` : `left: ${f}` : g ? `left: ${f}` : `right: ${p}`, v = r === "bottom" ? `bottom: ${m}` : `top: ${d}`;
		s.current.dataset.motionPopId = o;
		let y = document.createElement("style");
		l && (y.nonce = l);
		let b = i ?? document.head;
		return b.appendChild(y), y.sheet && y.sheet.insertRule(`
          [data-motion-pop-id="${o}"] {
            position: absolute !important;
            width: ${e}px !important;
            height: ${u}px !important;
            ${_}px !important;
            ${v}px !important;
          }
        `), () => {
			s.current?.removeAttribute("data-motion-pop-id"), b.contains(y) && b.removeChild(y);
		};
	}, [t]), (0, G.jsx)(rp, {
		isPresent: t,
		childRef: s,
		sizeRef: c,
		pop: a,
		children: a === !1 ? e : C.cloneElement(e, { ref: u })
	});
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/components/AnimatePresence/PresenceChild.mjs
var ap = ({ children: e, initial: t, isPresent: n, onExitComplete: r, custom: i, presenceAffectsLayout: a, mode: o, anchorX: s, anchorY: c, root: l }) => {
	let u = hi(op), d = (0, C.useId)(), f = (0, C.useRef)(n), p = (0, C.useRef)(r);
	gi(() => {
		f.current = n, p.current = r;
	});
	let m = !0, h = (0, C.useMemo)(() => (m = !1, {
		id: d,
		initial: t,
		isPresent: n,
		custom: i,
		onExitComplete: (e) => {
			u.set(e, !0);
			for (let e of u.values()) if (!e) return;
			r && r();
		},
		register: (e) => (u.set(e, !1), () => {
			u.delete(e), !f.current && !u.size && p.current?.();
		})
	}), [
		n,
		u,
		r
	]);
	return a && m && (h = { ...h }), (0, C.useMemo)(() => {
		u.forEach((e, t) => u.set(t, !1));
	}, [n]), C.useEffect(() => {
		!n && !u.size && r && r();
	}, [n]), e = (0, G.jsx)(ip, {
		pop: o === "popLayout",
		isPresent: n,
		anchorX: s,
		anchorY: c,
		root: l,
		children: e
	}), (0, G.jsx)(_i.Provider, {
		value: h,
		children: e
	});
};
function op() {
	return /* @__PURE__ */ new Map();
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/components/AnimatePresence/use-presence.mjs
function sp(e = !0) {
	let t = (0, C.useContext)(_i);
	if (t === null) return [!0, null];
	let { isPresent: n, onExitComplete: r, register: i } = t, a = (0, C.useId)();
	(0, C.useEffect)(() => {
		if (e) return i(a);
	}, [e]);
	let o = (0, C.useCallback)(() => e && r && r(a), [
		a,
		r,
		e
	]);
	return !n && r ? [!1, o] : [!0];
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/components/AnimatePresence/utils.mjs
var cp = (e) => e.key || "";
function lp(e) {
	let t = [];
	return C.Children.forEach(e, (e) => {
		(0, C.isValidElement)(e) && t.push(e);
	}), t;
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs
var up = ({ children: e, custom: t, initial: n = !0, onExitComplete: r, presenceAffectsLayout: i = !0, mode: a = "sync", propagate: o = !1, anchorX: s = "left", anchorY: c = "top", root: l }) => {
	let [u, d] = sp(o), f = (0, C.useMemo)(() => lp(e), [e]), p = o && !u ? [] : f.map(cp), m = (0, C.useRef)(!0), h = (0, C.useRef)(f), g = hi(() => /* @__PURE__ */ new Map()), _ = (0, C.useRef)(/* @__PURE__ */ new Set()), [v, y] = (0, C.useState)(f), [b, x] = (0, C.useState)(f);
	gi(() => {
		o && !u && !b.length && d?.();
	}, [
		u,
		o,
		b.length,
		d
	]), gi(() => {
		m.current = !1, h.current = f;
		for (let e = 0; e < b.length; e++) {
			let t = cp(b[e]);
			p.includes(t) ? (g.delete(t), _.current.delete(t)) : g.get(t) !== !0 && g.set(t, !1);
		}
	}, [
		b,
		p.length,
		p.join("-")
	]);
	let S = [];
	if (f !== v) {
		let e = [...f], t = 0;
		for (let n of b) {
			let r = p.indexOf(cp(n));
			r === -1 ? (e.splice(t++, 0, n), S.push(n)) : t = r + S.length + 1;
		}
		return a === "wait" && S.length && (e = S), x(lp(e)), y(f), null;
	}
	let { forceRender: w } = (0, C.useContext)(mi);
	return (0, G.jsx)(G.Fragment, { children: b.map((e) => {
		let v = cp(e), y = o && !u ? !1 : f === b || p.includes(v);
		return (0, G.jsx)(ap, {
			isPresent: y,
			initial: !m.current || n ? void 0 : !1,
			custom: t,
			presenceAffectsLayout: i,
			mode: a,
			root: l,
			onExitComplete: y ? void 0 : () => {
				if (_.current.has(v)) return;
				if (g.has(v)) _.current.add(v), g.set(v, !0);
				else return;
				let e = !0;
				g.forEach((t) => {
					t || (e = !1);
				}), e && (w?.(), x(h.current), o && d?.(), r && r());
			},
			anchorX: s,
			anchorY: c,
			children: e
		}, v);
	}) });
}, dp = (0, C.createContext)({ strict: !1 }), fp = {
	animation: [
		"animate",
		"variants",
		"whileHover",
		"whileTap",
		"exit",
		"whileInView",
		"whileFocus",
		"whileDrag"
	],
	exit: ["exit"],
	drag: ["drag", "dragControls"],
	focus: ["whileFocus"],
	hover: [
		"whileHover",
		"onHoverStart",
		"onHoverEnd"
	],
	tap: [
		"whileTap",
		"onTap",
		"onTapStart",
		"onTapCancel"
	],
	pan: [
		"onPan",
		"onPanStart",
		"onPanSessionStart",
		"onPanEnd"
	],
	inView: [
		"whileInView",
		"onViewportEnter",
		"onViewportLeave"
	],
	layout: ["layout", "layoutId"]
}, pp = !1;
function mp() {
	if (pp) return;
	let e = {};
	for (let t in fp) e[t] = { isEnabled: (e) => fp[t].some((t) => !!e[t]) };
	_u(e), pp = !0;
}
function hp() {
	return mp(), vu();
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/motion/features/load-features.mjs
function gp(e) {
	let t = hp();
	for (let n in e) t[n] = {
		...t[n],
		...e[n]
	};
	_u(t);
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/context/MotionContext/index.mjs
var _p = /* @__PURE__ */ (0, C.createContext)({});
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/context/MotionContext/utils.mjs
function vp(e, t) {
	if (cu(e)) {
		let { initial: t, animate: n } = e;
		return {
			initial: t === !1 || au(t) ? t : void 0,
			animate: au(n) ? n : void 0
		};
	}
	return e.inherit === !1 ? {} : t;
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/context/MotionContext/create.mjs
function yp(e) {
	let { initial: t, animate: n } = vp(e, (0, C.useContext)(_p));
	return (0, C.useMemo)(() => ({
		initial: t,
		animate: n
	}), [bp(t), bp(n)]);
}
function bp(e) {
	return Array.isArray(e) ? e.join(" ") : e;
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/render/html/utils/create-render-state.mjs
var xp = () => ({
	style: {},
	transform: {},
	transformOrigin: {},
	vars: {}
});
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/render/html/use-props.mjs
function Sp(e, t, n) {
	for (let r in t) !Nc(t[r]) && !Qu(r, n) && (e[r] = t[r]);
}
function Cp({ transformTemplate: e }, t) {
	return (0, C.useMemo)(() => {
		let n = xp();
		return Ku(n, t, e), Object.assign({}, n.vars, n.style);
	}, [t]);
}
function wp(e, t) {
	let n = e.style || {}, r = {};
	return Sp(r, n, e), Object.assign(r, Cp(e, t)), r;
}
function Tp(e, t) {
	let n = {}, r = wp(e, t);
	return e.drag && e.dragListener !== !1 && (n.draggable = !1, r.userSelect = r.WebkitUserSelect = r.WebkitTouchCallout = "none", r.touchAction = e.drag === !0 ? "none" : `pan-${e.drag === "x" ? "y" : "x"}`), e.tabIndex === void 0 && (e.onTap || e.onTapStart || e.whileTap) && (n.tabIndex = 0), n.style = r, n;
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/render/svg/utils/create-render-state.mjs
var Ep = () => ({
	...xp(),
	attrs: {}
});
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/render/svg/use-props.mjs
function Dp(e, t, n, r) {
	let i = (0, C.useMemo)(() => {
		let n = Ep();
		return cd(n, t, ud(r), e.transformTemplate, e.style), {
			...n.attrs,
			style: { ...n.style }
		};
	}, [t]);
	if (e.style) {
		let t = {};
		Sp(t, e.style, e), i.style = {
			...t,
			...i.style
		};
	}
	return i;
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/motion/utils/valid-prop.mjs
var Op = /* @__PURE__ */ new Set(/* @__PURE__ */ "animate.exit.variants.initial.style.values.variants.transition.transformTemplate.custom.inherit.onBeforeLayoutMeasure.onAnimationStart.onAnimationComplete.onUpdate.onDragStart.onDrag.onDragEnd.onMeasureDragConstraints.onDirectionLock.onDragTransitionEnd._dragX._dragY.onHoverStart.onHoverEnd.onViewportEnter.onViewportLeave.globalTapTarget.propagate.ignoreStrict.viewport".split("."));
function kp(e) {
	return e.startsWith("while") || e.startsWith("drag") && e !== "draggable" || e.startsWith("layout") || e.startsWith("onTap") || e.startsWith("onPan") || e.startsWith("onLayout") || Op.has(e);
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/render/dom/utils/filter-props.mjs
function Ap(e, t) {
	return e.startsWith("on") ? !kp(e) : t?.(e) ?? !kp(e);
}
function jp(e, t, n, r) {
	let i = {};
	for (let a in e) (a !== "values" || typeof e.values != "object") && (Nc(e[a]) || (Ap(a, r) || n === !0 && kp(a) || !t && !kp(a) || e.draggable && a.startsWith("onDrag")) && (i[a] = e[a]));
	return i;
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/render/svg/lowercase-elements.mjs
var Mp = [
	"animate",
	"circle",
	"defs",
	"desc",
	"ellipse",
	"g",
	"image",
	"line",
	"filter",
	"marker",
	"mask",
	"metadata",
	"path",
	"pattern",
	"polygon",
	"polyline",
	"rect",
	"stop",
	"switch",
	"symbol",
	"svg",
	"text",
	"tspan",
	"use",
	"view"
];
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/render/dom/utils/is-svg-component.mjs
function Np(e) {
	return typeof e != "string" || e.includes("-") ? !1 : !!(Mp.indexOf(e) > -1 || /[A-Z]/u.test(e));
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/render/dom/use-render.mjs
function Pp(e, t, n, { latestValues: r }, i, a = !1, o, s) {
	let c = (o ?? Np(e) ? Dp : Tp)(t, r, i, e), l = jp(t, typeof e == "string", a, s), u = e === C.Fragment ? {} : {
		...l,
		...c,
		ref: n
	}, { children: d } = t, f = (0, C.useMemo)(() => Nc(d) ? d.get() : d, [d]);
	return (0, C.createElement)(e, {
		...u,
		children: f
	});
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/motion/utils/use-visual-state.mjs
function Fp({ scrapeMotionValuesFromProps: e, createRenderState: t }, n, r, i) {
	return {
		latestValues: Ip(n, r, i, e),
		renderState: t()
	};
}
function Ip(e, t, n, r) {
	let i = {}, a = r(e, {});
	for (let e in a) i[e] = mf(a[e]);
	let { initial: o, animate: s } = e, c = cu(e), l = lu(e);
	t && l && !c && e.inherit !== !1 && (o === void 0 && (o = t.initial), s === void 0 && (s = t.animate));
	let u = n ? n.initial === !1 : !1;
	u ||= o === !1;
	let d = u ? s : o;
	if (d && typeof d != "boolean" && !iu(d)) {
		let t = Array.isArray(d) ? d : [d];
		for (let n = 0; n < t.length; n++) {
			let r = Ec(e, t[n]);
			if (r) {
				let { transitionEnd: e, transition: t, ...n } = r;
				for (let e in n) {
					let t = n[e];
					if (Array.isArray(t)) {
						let e = u ? t.length - 1 : 0;
						t = t[e];
					}
					t !== null && (i[e] = t);
				}
				for (let t in e) i[t] = e[t];
			}
		}
	}
	return i;
}
var Lp = (e) => (t, n) => {
	let r = (0, C.useContext)(_p), i = (0, C.useContext)(_i), a = () => Fp(e, t, r, i);
	return n ? a() : hi(a);
}, Rp = /*@__PURE__*/ Lp({
	scrapeMotionValuesFromProps: $u,
	createRenderState: xp
}), zp = /*@__PURE__*/ Lp({
	scrapeMotionValuesFromProps: fd,
	createRenderState: Ep
}), Bp = Symbol.for("motionComponentSymbol");
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/motion/utils/use-motion-ref.mjs
function Vp(e, t, n) {
	let r = (0, C.useRef)(n);
	(0, C.useInsertionEffect)(() => {
		r.current = n;
	});
	let i = (0, C.useRef)(null);
	return (0, C.useCallback)((n) => {
		n && e.onMount?.(n), t && (n ? t.mount(n) : t.unmount());
		let a = r.current;
		if (typeof a == "function") {
			if (n) {
				let e = a(n);
				typeof e == "function" && (i.current = e);
			} else i.current ? (i.current(), i.current = null) : a(n);
		} else a && (a.current = n);
	}, [t]);
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/context/SwitchLayoutGroupContext.mjs
var Hp = (0, C.createContext)({});
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/utils/is-ref-object.mjs
function Up(e) {
	return e && typeof e == "object" && Object.prototype.hasOwnProperty.call(e, "current");
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/motion/utils/use-visual-element.mjs
function Wp(e, t, n, r, i, a) {
	let { visualElement: o } = (0, C.useContext)(_p), s = (0, C.useContext)(dp), c = (0, C.useContext)(_i), l = (0, C.useContext)($f), u = l.reducedMotion, d = l.skipAnimations, f = (0, C.useRef)(null), p = (0, C.useRef)(!1);
	r ||= s.renderer, !f.current && r && (f.current = r(e, {
		visualState: t,
		parent: o,
		props: n,
		presenceContext: c,
		blockInitialAnimation: c ? c.initial === !1 : !1,
		reducedMotionConfig: u,
		skipAnimations: d,
		isSVG: a
	}), p.current && f.current && (f.current.manuallyAnimateOnMount = !0));
	let m = f.current, h = (0, C.useContext)(Hp);
	m && !m.projection && i && (m.type === "html" || m.type === "svg") && Gp(f.current, n, i, h);
	let g = (0, C.useRef)(!1);
	(0, C.useInsertionEffect)(() => {
		m && g.current && m.update(n, c);
	});
	let _ = n[Lc], v = (0, C.useRef)(!!_ && typeof window < "u" && !window.MotionHandoffIsComplete?.(_) && window.MotionHasOptimisedAnimation?.(_));
	return gi(() => {
		p.current = !0, m && (g.current = !0, window.MotionIsMounted = !0, m.updateFeatures(), m.scheduleRenderMicrotask(), v.current && m.animationState && m.animationState.animateChanges());
	}), (0, C.useEffect)(() => {
		m && (!v.current && m.animationState && m.animationState.animateChanges(), v.current &&= (queueMicrotask(() => {
			window.MotionHandoffMarkAsComplete?.(_);
		}), !1), m.enteringChildren = void 0);
	}), m;
}
function Gp(e, t, n, r) {
	let { layoutId: i, layout: a, drag: o, dragConstraints: s, layoutScroll: c, layoutRoot: l, layoutAnchor: u, layoutCrossfade: d } = t;
	e.projection = new n(e.latestValues, t["data-framer-portal-id"] ? void 0 : Kp(e.parent)), e.projection.setOptions({
		layoutId: i,
		layout: a,
		alwaysMeasureLayout: !!o || s && Up(s),
		visualElement: e,
		animationType: typeof a == "string" ? a : "both",
		initialPromotionConfig: r,
		crossfade: d,
		layoutScroll: c,
		layoutRoot: l,
		layoutAnchor: u
	});
}
function Kp(e) {
	if (e) return e.options.allowProjection === !1 ? Kp(e.parent) : e.projection;
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/motion/index.mjs
function qp(e, { forwardMotionProps: t = !1, type: n } = {}, r, i) {
	r && gp(r);
	let a = n ? n === "svg" : Np(e), o = a ? zp : Rp;
	function s(n, s) {
		let c, l = {
			...(0, C.useContext)($f),
			...n,
			layoutId: Jp(n)
		}, { isStatic: u, isValidProp: d } = l, f = yp(n), p = o(n, u);
		if (!u && typeof window < "u") {
			Yp(l, r);
			let t = Xp(l);
			c = t.MeasureLayout, f.visualElement = Wp(e, p, l, i, t.ProjectionNode, a);
		}
		return (0, G.jsxs)(_p.Provider, {
			value: f,
			children: [c && f.visualElement ? (0, G.jsx)(c, {
				visualElement: f.visualElement,
				...l
			}) : null, Pp(e, n, Vp(p, f.visualElement, s), p, u, t, a, d)]
		});
	}
	s.displayName = `motion.${typeof e == "string" ? e : `create(${e.displayName ?? e.name ?? ""})`}`;
	let c = (0, C.forwardRef)(s);
	return c[Bp] = e, c;
}
function Jp({ layoutId: e }) {
	let t = (0, C.useContext)(mi).id;
	return t && e !== void 0 ? t + "-" + e : e;
}
function Yp(e, t) {
	(0, C.useContext)(dp).strict;
}
function Xp(e) {
	let { drag: t, layout: n } = hp();
	if (!t && !n) return {};
	let r = {
		...t,
		...n
	};
	return {
		MeasureLayout: t?.isEnabled(e) || n?.isEnabled(e) ? r.MeasureLayout : void 0,
		ProjectionNode: r.ProjectionNode
	};
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/render/components/create-proxy.mjs
function Zp(e, t) {
	if (typeof Proxy > "u") return qp;
	let n = /* @__PURE__ */ new Map(), r = (n, r) => qp(n, r, e, t);
	return new Proxy((e, t) => r(e, t), { get: (i, a) => a === "create" ? r : (n.has(a) || n.set(a, qp(a, void 0, e, t)), n.get(a)) });
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/render/dom/create-visual-element.mjs
var Qp = (e, t) => t.isSVG ?? Np(e) ? new pd(t) : new td(t, { allowProjection: e !== C.Fragment }), $p = class extends xu {
	constructor(e) {
		super(e), e.animationState ||= Q(e);
	}
	updateAnimationControlsSubscription() {
		let { animate: e } = this.node.getProps();
		iu(e) && (this.unmountControls = e.subscribe(this.node));
	}
	mount() {
		this.updateAnimationControlsSubscription();
	}
	update() {
		let { animate: e } = this.node.getProps(), { animate: t } = this.node.prevProps || {};
		e !== t && this.updateAnimationControlsSubscription();
	}
	unmount() {
		this.node.animationState.reset(), this.unmountControls?.();
	}
}, em = 0, tm = {
	animation: { Feature: $p },
	exit: { Feature: class extends xu {
		constructor() {
			super(...arguments), this.id = em++, this.isExitComplete = !1;
		}
		update() {
			if (!this.node.presenceContext) return;
			let { isPresent: e, onExitComplete: t } = this.node.presenceContext, { isPresent: n } = this.node.prevPresenceContext || {};
			if (!this.node.animationState || e === n) return;
			if (e && n === !1) {
				if (this.isExitComplete) {
					let { initial: e, custom: t } = this.node.getProps();
					if (typeof e == "string" || typeof e == "object" && e && !Array.isArray(e)) {
						let n = Dc(this.node, e, t);
						if (n) {
							let { transition: e, transitionEnd: t, ...r } = n;
							for (let e in r) this.node.getValue(e)?.jump(r[e]);
						}
					}
					this.node.animationState.reset(), this.node.animationState.animateChanges();
				} else this.node.animationState.setActive("exit", !1);
				this.isExitComplete = !1;
				return;
			}
			let r = this.node.animationState.setActive("exit", !e);
			t && !e && r.then(() => {
				this.isExitComplete = !0, t(this.id);
			});
		}
		mount() {
			let { register: e, onExitComplete: t } = this.node.presenceContext || {};
			t && t(this.id), e && (this.unmount = e(this.id));
		}
		unmount() {}
	} }
};
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/events/event-info.mjs
function nm(e) {
	return { point: {
		x: e.pageX,
		y: e.pageY
	} };
}
var rm = (e) => (t) => Cl(t) && e(t, nm(t));
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/events/add-pointer-event.mjs
function im(e, t, n, r) {
	return uf(e, t, rm(n), r);
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/utils/get-context-window.mjs
var am = ({ current: e }) => e ? e.ownerDocument.defaultView : null, om = (e, t) => Math.abs(e - t);
function sm(e, t) {
	let n = om(e.x, t.x), r = om(e.y, t.y);
	return Math.sqrt(n ** 2 + r ** 2);
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/gestures/pan/PanSession.mjs
var cm = /*#__PURE__*/ new Set(["auto", "scroll"]), lm = class {
	constructor(e, t, { transformPagePoint: n, contextWindow: r = window, dragSnapToOrigin: i = !1, distanceThreshold: a = 3, element: o } = {}) {
		if (this.startEvent = null, this.lastMoveEvent = null, this.lastMoveEventInfo = null, this.lastRawMoveEventInfo = null, this.handlers = {}, this.contextWindow = window, this.scrollPositions = /* @__PURE__ */ new Map(), this.removeScrollListeners = null, this.onElementScroll = (e) => {
			this.handleScroll(e.target);
		}, this.onWindowScroll = () => {
			this.handleScroll(window);
		}, this.updatePoint = () => {
			if (!(this.lastMoveEvent && this.lastMoveEventInfo)) return;
			this.lastRawMoveEventInfo && (this.lastMoveEventInfo = um(this.lastRawMoveEventInfo, this.transformPagePoint));
			let e = fm(this.lastMoveEventInfo, this.history), t = this.startEvent !== null, n = sm(e.offset, {
				x: 0,
				y: 0
			}) >= this.distanceThreshold;
			if (!t && !n) return;
			let { point: r } = e, { timestamp: i } = ca;
			this.history.push({
				...r,
				timestamp: i
			});
			let { onStart: a, onMove: o } = this.handlers;
			t || (a && a(this.lastMoveEvent, e), this.startEvent = this.lastMoveEvent), o && o(this.lastMoveEvent, e);
		}, this.handlePointerMove = (e, t) => {
			this.lastMoveEvent = e, this.lastRawMoveEventInfo = t, this.lastMoveEventInfo = um(t, this.transformPagePoint), oa.update(this.updatePoint, !0);
		}, this.handlePointerUp = (e, t) => {
			this.end();
			let { onEnd: n, onSessionEnd: r, resumeAnimation: i } = this.handlers;
			if ((this.dragSnapToOrigin || !this.startEvent) && i && i(), !(this.lastMoveEvent && this.lastMoveEventInfo)) return;
			let a = fm(e.type === "pointercancel" ? this.lastMoveEventInfo : um(t, this.transformPagePoint), this.history);
			this.startEvent && n && n(e, a), r && r(e, a);
		}, !Cl(e)) return;
		this.dragSnapToOrigin = i, this.handlers = t, this.transformPagePoint = n, this.distanceThreshold = a, this.contextWindow = r || window;
		let s = um(nm(e), this.transformPagePoint), { point: c } = s, { timestamp: l } = ca;
		this.history = [{
			...c,
			timestamp: l
		}];
		let { onSessionStart: u } = t;
		u && u(e, fm(s, this.history));
		let d = {
			passive: !0,
			capture: !0
		};
		this.removeListeners = Di(im(this.contextWindow, "pointermove", this.handlePointerMove, d), im(this.contextWindow, "pointerup", this.handlePointerUp, d), im(this.contextWindow, "pointercancel", this.handlePointerUp, d)), o && this.startScrollTracking(o);
	}
	startScrollTracking(e) {
		let t = e.parentElement;
		for (; t;) {
			let e = getComputedStyle(t);
			(cm.has(e.overflowX) || cm.has(e.overflowY)) && this.scrollPositions.set(t, {
				x: t.scrollLeft,
				y: t.scrollTop
			}), t = t.parentElement;
		}
		this.scrollPositions.set(window, {
			x: window.scrollX,
			y: window.scrollY
		}), window.addEventListener("scroll", this.onElementScroll, { capture: !0 }), window.addEventListener("scroll", this.onWindowScroll), this.removeScrollListeners = () => {
			window.removeEventListener("scroll", this.onElementScroll, { capture: !0 }), window.removeEventListener("scroll", this.onWindowScroll);
		};
	}
	handleScroll(e) {
		let t = this.scrollPositions.get(e);
		if (!t) return;
		let n = e === window, r = n ? {
			x: window.scrollX,
			y: window.scrollY
		} : {
			x: e.scrollLeft,
			y: e.scrollTop
		}, i = {
			x: r.x - t.x,
			y: r.y - t.y
		};
		(i.x !== 0 || i.y !== 0) && (n ? this.lastMoveEventInfo && (this.lastMoveEventInfo.point.x += i.x, this.lastMoveEventInfo.point.y += i.y) : this.history.length > 0 && (this.history[0].x -= i.x, this.history[0].y -= i.y), this.scrollPositions.set(e, r), oa.update(this.updatePoint, !0));
	}
	updateHandlers(e) {
		this.handlers = e;
	}
	end() {
		this.removeListeners && this.removeListeners(), this.removeScrollListeners && this.removeScrollListeners(), this.scrollPositions.clear(), sa(this.updatePoint);
	}
};
function um(e, t) {
	return t ? { point: t(e.point) } : e;
}
function dm(e, t) {
	return {
		x: e.x - t.x,
		y: e.y - t.y
	};
}
function fm({ point: e }, t) {
	return {
		point: e,
		delta: dm(e, mm(t)),
		offset: dm(e, pm(t)),
		velocity: hm(t, .1)
	};
}
function pm(e) {
	return e[0];
}
function mm(e) {
	return e[e.length - 1];
}
function hm(e, t) {
	if (e.length < 2) return {
		x: 0,
		y: 0
	};
	let n = e.length - 1, r = null, i = mm(e);
	for (; n >= 0 && (r = e[n], !(i.timestamp - r.timestamp > /* @__PURE__ */ ki(t)));) n--;
	if (!r) return {
		x: 0,
		y: 0
	};
	r === e[0] && e.length > 2 && i.timestamp - r.timestamp > /* @__PURE__ */ ki(t) * 2 && (r = e[1]);
	let a = /* @__PURE__ */ Ai(i.timestamp - r.timestamp);
	if (a === 0) return {
		x: 0,
		y: 0
	};
	let o = {
		x: (i.x - r.x) / a,
		y: (i.y - r.y) / a
	};
	return o.x === Infinity && (o.x = 0), o.y === Infinity && (o.y = 0), o;
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/gestures/drag/utils/constraints.mjs
function gm(e, { min: t, max: n }, r) {
	return t !== void 0 && e < t ? e = r ? Y(t, e, r.min) : Math.max(e, t) : n !== void 0 && e > n && (e = r ? Y(n, e, r.max) : Math.min(e, n)), e;
}
function _m(e, t, n) {
	return {
		min: t === void 0 ? void 0 : e.min + t,
		max: n === void 0 ? void 0 : e.max + n - (e.max - e.min)
	};
}
function vm(e, { top: t, left: n, bottom: r, right: i }) {
	return {
		x: _m(e.x, n, i),
		y: _m(e.y, t, r)
	};
}
function ym(e, t) {
	let n = t.min - e.min, r = t.max - e.max;
	return t.max - t.min < e.max - e.min && ([n, r] = [r, n]), {
		min: n,
		max: r
	};
}
function bm(e, t) {
	return {
		x: ym(e.x, t.x),
		y: ym(e.y, t.y)
	};
}
function xm(e, t) {
	let n = .5, r = Ad(e), i = Ad(t);
	return i > r ? n = /* @__PURE__ */ K(t.min, t.max - r, e.min) : r > i && (n = /* @__PURE__ */ K(e.min, e.max - i, t.min)), bi(0, 1, n);
}
function Sm(e, t) {
	let n = {};
	return t.min !== void 0 && (n.min = t.min - e.min), t.max !== void 0 && (n.max = t.max - e.min), n;
}
var Cm = .35;
function wm(e = Cm) {
	return e === !1 ? e = 0 : e === !0 && (e = Cm), {
		x: Tm(e, "left", "right"),
		y: Tm(e, "top", "bottom")
	};
}
function Tm(e, t, n) {
	return {
		min: Em(e, t),
		max: Em(e, n)
	};
}
function Em(e, t) {
	return typeof e == "number" ? e : e[t] || 0;
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/gestures/drag/VisualElementDragControls.mjs
var Dm = /* @__PURE__ */ new WeakMap(), Om = class {
	constructor(e) {
		this.openDragLock = null, this.isDragging = !1, this.currentDirection = null, this.originPoint = {
			x: 0,
			y: 0
		}, this.constraints = !1, this.hasMutatedConstraints = !1, this.elastic = nu(), this.latestPointerEvent = null, this.latestPanInfo = null, this.visualElement = e;
	}
	start(e, { snapToCursor: t = !1, distanceThreshold: n } = {}) {
		let { presenceContext: r } = this.visualElement;
		if (r && r.isPresent === !1) return;
		let i = (e) => {
			t && this.snapToCursor(nm(e).point), this.stopAnimation();
		}, a = (e, t) => {
			let { drag: n, dragPropagation: r, onDragStart: i } = this.getProps();
			if (n && !r && (this.openDragLock && this.openDragLock(), this.openDragLock = vl(n), !this.openDragLock)) return;
			this.latestPointerEvent = e, this.latestPanInfo = t, this.isDragging = !0, this.currentDirection = null, this.resolveConstraints(), this.visualElement.projection && (this.visualElement.projection.isAnimationBlocked = !0, this.visualElement.projection.target = void 0), Qd((e) => {
				let t = this.getAxisMotionValue(e).get() || 0;
				if (Fa.test(t)) {
					let { projection: n } = this.visualElement;
					if (n && n.layout) {
						let r = n.layout.layoutBox[e];
						r && (t = Ad(r) * (parseFloat(t) / 100));
					}
				}
				this.originPoint[e] = t;
			}), i && oa.update(() => i(e, t), !1, !0), Fc(this.visualElement, "transform");
			let { animationState: a } = this.visualElement;
			a && a.setActive("whileDrag", !0);
		}, o = (e, t) => {
			this.latestPointerEvent = e, this.latestPanInfo = t;
			let { dragPropagation: n, dragDirectionLock: r, onDirectionLock: i, onDrag: a } = this.getProps();
			if (!n && !this.openDragLock) return;
			let { offset: o } = t;
			if (r && this.currentDirection === null) {
				this.currentDirection = Mm(o), this.currentDirection !== null && i && i(this.currentDirection);
				return;
			}
			this.updateAxis("x", t.point, o), this.updateAxis("y", t.point, o), this.visualElement.render(), a && oa.update(() => a(e, t), !1, !0);
		}, s = (e, t) => {
			this.latestPointerEvent = e, this.latestPanInfo = t, this.stop(e, t), this.latestPointerEvent = null, this.latestPanInfo = null;
		}, c = () => {
			let { dragSnapToOrigin: e } = this.getProps();
			(e || this.constraints) && this.startAnimation({
				x: 0,
				y: 0
			});
		}, { dragSnapToOrigin: l } = this.getProps();
		this.panSession = new lm(e, {
			onSessionStart: i,
			onStart: a,
			onMove: o,
			onSessionEnd: s,
			resumeAnimation: c
		}, {
			transformPagePoint: this.visualElement.getTransformPagePoint(),
			dragSnapToOrigin: l,
			distanceThreshold: n,
			contextWindow: am(this.visualElement),
			element: this.visualElement.current
		});
	}
	stop(e, t) {
		let n = e || this.latestPointerEvent, r = t || this.latestPanInfo, i = this.isDragging;
		if (this.cancel(), !i || !r || !n) return;
		let { velocity: a } = r;
		this.startAnimation(a);
		let { onDragEnd: o } = this.getProps();
		o && oa.postRender(() => o(n, r));
	}
	cancel() {
		this.isDragging = !1;
		let { projection: e, animationState: t } = this.visualElement;
		e && (e.isAnimationBlocked = !1), this.endPanSession();
		let { dragPropagation: n } = this.getProps();
		!n && this.openDragLock && (this.openDragLock(), this.openDragLock = null), t && t.setActive("whileDrag", !1);
	}
	endPanSession() {
		this.panSession && this.panSession.end(), this.panSession = void 0;
	}
	updateAxis(e, t, n) {
		let { drag: r } = this.getProps();
		if (!n || !jm(e, r, this.currentDirection)) return;
		let i = this.getAxisMotionValue(e), a = this.originPoint[e] + n[e];
		this.constraints && this.constraints[e] && (a = gm(a, this.constraints[e], this.elastic[e])), i.set(a);
	}
	resolveConstraints() {
		let { dragConstraints: e, dragElastic: t } = this.getProps(), n = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(!1) : this.visualElement.projection?.layout, r = this.constraints;
		e && Up(e) ? this.constraints ||= this.resolveRefConstraints() : this.constraints = e && n ? vm(n.layoutBox, e) : !1, this.elastic = wm(t), r !== this.constraints && !Up(e) && n && this.constraints && !this.hasMutatedConstraints && Qd((e) => {
			this.constraints !== !1 && this.getAxisMotionValue(e) && (this.constraints[e] = Sm(n.layoutBox[e], this.constraints[e]));
		});
	}
	resolveRefConstraints() {
		let { dragConstraints: e, onMeasureDragConstraints: t } = this.getProps();
		if (!e || !Up(e)) return !1;
		let n = e.current, { projection: r } = this.visualElement;
		if (!r || !r.layout) return !1;
		r.root && (r.root.scroll = void 0, r.root.updateScroll());
		let i = Hu(n, r.root, this.visualElement.getTransformPagePoint()), a = bm(r.layout.layoutBox, i);
		if (t) {
			let e = t(Cu(a));
			this.hasMutatedConstraints = !!e, e && (a = Su(e));
		}
		return a;
	}
	startAnimation(e) {
		let { drag: t, dragMomentum: n, dragElastic: r, dragTransition: i, dragSnapToOrigin: a, onDragTransitionEnd: o } = this.getProps(), s = this.constraints || {}, c = Qd((o) => {
			if (!jm(o, t, this.currentDirection)) return;
			let c = s && s[o] || {};
			(a === !0 || a === o) && (c = {
				min: 0,
				max: 0
			});
			let l = r ? 200 : 1e6, u = r ? 40 : 1e7, d = {
				type: "inertia",
				velocity: n ? e[o] : 0,
				bounceStiffness: l,
				bounceDamping: u,
				timeConstant: 750,
				restDelta: 1,
				restSpeed: 10,
				...i,
				...c
			};
			return this.startAxisValueAnimation(o, d);
		});
		return Promise.all(c).then(o);
	}
	startAxisValueAnimation(e, t) {
		let n = this.getAxisMotionValue(e);
		return Fc(this.visualElement, e), n.start(xc(e, n, 0, t, this.visualElement, !1));
	}
	stopAnimation() {
		Qd((e) => this.getAxisMotionValue(e).stop());
	}
	getAxisMotionValue(e) {
		let t = `_drag${e.toUpperCase()}`;
		return this.visualElement.getProps()[t] || this.visualElement.getValue(e, this.visualElement.latestValues[e] ?? 0);
	}
	snapToCursor(e) {
		Qd((t) => {
			let { drag: n } = this.getProps();
			if (!jm(t, n, this.currentDirection)) return;
			let { projection: r } = this.visualElement, i = this.getAxisMotionValue(t);
			if (r && r.layout) {
				let { min: n, max: a } = r.layout.layoutBox[t], o = i.get() || 0;
				i.set(e[t] - Y(n, a, .5) + o);
			}
		});
	}
	scalePositionWithinConstraints() {
		if (!this.visualElement.current) return;
		let { drag: e, dragConstraints: t } = this.getProps(), { projection: n } = this.visualElement;
		if (!Up(t) || !n || !this.constraints) return;
		this.stopAnimation();
		let r = {
			x: 0,
			y: 0
		};
		Qd((e) => {
			let t = this.getAxisMotionValue(e);
			if (t && this.constraints !== !1) {
				let n = t.get();
				r[e] = xm({
					min: n,
					max: n
				}, this.constraints[e]);
			}
		});
		let { transformTemplate: i } = this.visualElement.getProps();
		this.visualElement.current.style.transform = i ? i({}, "") : "none", n.root && n.root.updateScroll(), n.updateLayout(), this.constraints = !1, this.resolveConstraints(), Qd((t) => {
			if (!jm(t, e, null)) return;
			let n = this.getAxisMotionValue(t), { min: i, max: a } = this.constraints[t];
			n.set(Y(i, a, r[t]));
		}), this.visualElement.render();
	}
	addListeners() {
		if (!this.visualElement.current) return;
		Dm.set(this.visualElement, this);
		let e = this.visualElement.current, t = im(e, "pointerdown", (t) => {
			let { drag: n, dragListener: r = !0 } = this.getProps(), i = t.target, a = i !== e && Dl(i);
			n && r && !a && this.start(t);
		}), n, r = () => {
			let { dragConstraints: t } = this.getProps();
			Up(t) && t.current && (this.constraints = this.resolveRefConstraints(), n ||= Am(e, t.current, () => this.scalePositionWithinConstraints()));
		}, { projection: i } = this.visualElement, a = i.addEventListener("measure", r);
		i && !i.layout && (i.root && i.root.updateScroll(), i.updateLayout()), oa.read(r);
		let o = uf(window, "resize", () => this.scalePositionWithinConstraints()), s = i.addEventListener("didUpdate", (({ delta: e, hasLayoutChanged: t }) => {
			this.isDragging && t && (Qd((t) => {
				let n = this.getAxisMotionValue(t);
				n && (this.originPoint[t] += e[t].translate, n.set(n.get() + e[t].translate));
			}), this.visualElement.render());
		}));
		return () => {
			o(), t(), a(), s && s(), n && n();
		};
	}
	getProps() {
		let e = this.visualElement.getProps(), { drag: t = !1, dragDirectionLock: n = !1, dragPropagation: r = !1, dragConstraints: i = !1, dragElastic: a = Cm, dragMomentum: o = !0 } = e;
		return {
			...e,
			drag: t,
			dragDirectionLock: n,
			dragPropagation: r,
			dragConstraints: i,
			dragElastic: a,
			dragMomentum: o
		};
	}
};
function km(e) {
	let t = !0;
	return () => {
		if (t) {
			t = !1;
			return;
		}
		e();
	};
}
function Am(e, t, n) {
	let r = ql(e, km(n)), i = ql(t, km(n));
	return () => {
		r(), i();
	};
}
function jm(e, t, n) {
	return (t === !0 || t === e) && (n === null || n === e);
}
function Mm(e, t = 10) {
	let n = null;
	return Math.abs(e.y) > t ? n = "y" : Math.abs(e.x) > t && (n = "x"), n;
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/gestures/drag/index.mjs
var Nm = class extends xu {
	constructor(e) {
		super(e), this.removeGroupControls = Ei, this.removeListeners = Ei, this.controls = new Om(e);
	}
	mount() {
		let { dragControls: e } = this.node.getProps();
		e && (this.removeGroupControls = e.subscribe(this.controls)), this.removeListeners = this.controls.addListeners() || Ei;
	}
	update() {
		let { dragControls: e } = this.node.getProps(), { dragControls: t } = this.node.prevProps || {};
		e !== t && (this.removeGroupControls(), e && (this.removeGroupControls = e.subscribe(this.controls)));
	}
	unmount() {
		this.removeGroupControls(), this.removeListeners(), this.controls.isDragging || this.controls.endPanSession();
	}
}, Pm = (e) => (t, n) => {
	e && oa.update(() => e(t, n), !1, !0);
}, Fm = class extends xu {
	constructor() {
		super(...arguments), this.removePointerDownListener = Ei;
	}
	onPointerDown(e) {
		this.session = new lm(e, this.createPanHandlers(), {
			transformPagePoint: this.node.getTransformPagePoint(),
			contextWindow: am(this.node)
		});
	}
	createPanHandlers() {
		let { onPanSessionStart: e, onPanStart: t, onPan: n, onPanEnd: r } = this.node.getProps();
		return {
			onSessionStart: Pm(e),
			onStart: Pm(t),
			onMove: Pm(n),
			onEnd: (e, t) => {
				delete this.session, r && oa.postRender(() => r(e, t));
			}
		};
	}
	mount() {
		this.removePointerDownListener = im(this.node.current, "pointerdown", (e) => this.onPointerDown(e));
	}
	update() {
		this.session && this.session.updateHandlers(this.createPanHandlers());
	}
	unmount() {
		this.removePointerDownListener(), this.session && this.session.end();
	}
}, Im = !1, Lm = class extends C.Component {
	componentDidMount() {
		let { visualElement: e, layoutGroup: t, switchLayoutGroup: n, layoutId: r } = this.props, { projection: i } = e;
		i && (t.group && t.group.add(i), n && n.register && r && n.register(i), Im && i.root.didUpdate(), i.addEventListener("animationComplete", () => {
			this.safeToRemove();
		}), i.setOptions({
			...i.options,
			layoutDependency: this.props.layoutDependency,
			onExitComplete: () => this.safeToRemove()
		})), gf.hasEverUpdated = !0;
	}
	getSnapshotBeforeUpdate(e) {
		let { layoutDependency: t, visualElement: n, drag: r, isPresent: i } = this.props, { projection: a } = n;
		return a ? (a.isPresent = i, e.layoutDependency !== t && a.setOptions({
			...a.options,
			layoutDependency: t
		}), Im = !0, r || e.layoutDependency !== t || t === void 0 || e.isPresent !== i ? a.willUpdate() : this.safeToRemove(), e.isPresent !== i && (i ? a.promote() : a.relegate() || oa.postRender(() => {
			let e = a.getStack();
			(!e || !e.members.length) && this.safeToRemove();
		})), null) : null;
	}
	componentDidUpdate() {
		let { visualElement: e, layoutAnchor: t } = this.props, { projection: n } = e;
		n && (n.options.layoutAnchor = t, n.root.didUpdate(), ml.postRender(() => {
			!n.currentAnimation && n.isLead() && this.safeToRemove();
		}));
	}
	componentWillUnmount() {
		let { visualElement: e, layoutGroup: t, switchLayoutGroup: n } = this.props, { projection: r } = e;
		Im = !0, r && (r.scheduleCheckAfterUnmount(), t && t.group && t.group.remove(r), n && n.deregister && n.deregister(r));
	}
	safeToRemove() {
		let { safeToRemove: e } = this.props;
		e && e();
	}
	render() {
		return null;
	}
};
function Rm(e) {
	let [t, n] = sp(), r = (0, C.useContext)(mi);
	return (0, G.jsx)(Lm, {
		...e,
		layoutGroup: r,
		switchLayoutGroup: (0, C.useContext)(Hp),
		isPresent: t,
		safeToRemove: n
	});
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/motion/features/drag.mjs
var zm = {
	pan: { Feature: Fm },
	drag: {
		Feature: Nm,
		ProjectionNode: Qf,
		MeasureLayout: Rm
	}
};
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/gestures/hover.mjs
function Bm(e, t, n) {
	let { props: r } = e;
	e.animationState && r.whileHover && e.animationState.setActive("whileHover", n === "Start");
	let i = r["onHover" + n];
	i && oa.postRender(() => i(t, nm(t)));
}
var Vm = class extends xu {
	mount() {
		let { current: e } = this.node;
		e && (this.unmount = xl(e, (e, t) => (Bm(this.node, t, "Start"), (e) => Bm(this.node, e, "End"))));
	}
	unmount() {}
}, Hm = class extends xu {
	constructor() {
		super(...arguments), this.isActive = !1;
	}
	onFocus() {
		let e = !1;
		try {
			e = this.node.current.matches(":focus-visible");
		} catch {
			e = !0;
		}
		!e || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !0), this.isActive = !0);
	}
	onBlur() {
		!this.isActive || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !1), this.isActive = !1);
	}
	mount() {
		this.unmount = Di(uf(this.node.current, "focus", () => this.onFocus()), uf(this.node.current, "blur", () => this.onBlur()));
	}
	unmount() {}
};
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/gestures/press.mjs
function Um(e, t, n) {
	let { props: r } = e;
	if (e.current instanceof HTMLButtonElement && e.current.disabled) return;
	e.animationState && r.whileTap && e.animationState.setActive("whileTap", n === "Start");
	let i = r["onTap" + (n === "End" ? "" : n)];
	i && oa.postRender(() => i(t, nm(t)));
}
var Wm = class extends xu {
	mount() {
		let { current: e } = this.node;
		if (!e) return;
		let { globalTapTarget: t, propagate: n } = this.node.props;
		this.unmount = Pl(e, (e, t) => (Um(this.node, t, "Start"), (e, { success: t }) => Um(this.node, e, t ? "End" : "Cancel")), {
			useGlobalTarget: t,
			stopPropagation: n?.tap === !1
		});
	}
	unmount() {}
}, Gm = /* @__PURE__ */ new WeakMap(), Km = /* @__PURE__ */ new WeakMap(), qm = (e) => {
	let t = Gm.get(e.target);
	t && t(e);
}, Jm = (e) => {
	e.forEach(qm);
};
function Ym({ root: e, ...t }) {
	let n = e || document;
	Km.has(n) || Km.set(n, {});
	let r = Km.get(n), i = JSON.stringify(t);
	return r[i] || (r[i] = new IntersectionObserver(Jm, {
		root: e,
		...t
	})), r[i];
}
function Xm(e, t, n) {
	let r = Ym(t);
	return Gm.set(e, n), r.observe(e), () => {
		Gm.delete(e), r.unobserve(e);
	};
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/motion/features/viewport/index.mjs
var Zm = {
	some: 0,
	all: 1
}, Qm = class extends xu {
	constructor() {
		super(...arguments), this.hasEnteredView = !1, this.isInView = !1;
	}
	startObserver() {
		this.stopObserver?.();
		let { viewport: e = {} } = this.node.getProps(), { root: t, margin: n, amount: r = "some", once: i } = e, a = {
			root: t ? t.current : void 0,
			rootMargin: n,
			threshold: typeof r == "number" ? r : Zm[r]
		}, o = (e) => {
			let { isIntersecting: t } = e;
			if (this.isInView === t || (this.isInView = t, i && !t && this.hasEnteredView)) return;
			t && (this.hasEnteredView = !0), this.node.animationState && this.node.animationState.setActive("whileInView", t);
			let { onViewportEnter: n, onViewportLeave: r } = this.node.getProps(), a = t ? n : r;
			a && a(e);
		};
		this.stopObserver = Xm(this.node.current, a, o);
	}
	mount() {
		this.startObserver();
	}
	update() {
		if (typeof IntersectionObserver > "u") return;
		let { props: e, prevProps: t } = this.node;
		[
			"amount",
			"margin",
			"root"
		].some($m(e, t)) && this.startObserver();
	}
	unmount() {
		this.stopObserver?.(), this.hasEnteredView = !1, this.isInView = !1;
	}
};
function $m({ viewport: e = {} }, { viewport: t = {} } = {}) {
	return (n) => e[n] !== t[n];
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/motion/features/gestures.mjs
var eh = {
	inView: { Feature: Qm },
	tap: { Feature: Wm },
	focus: { Feature: Hm },
	hover: { Feature: Vm }
}, th = { layout: {
	ProjectionNode: Qf,
	MeasureLayout: Rm
} }, nh = /*@__PURE__*/ Zp({
	...tm,
	...eh,
	...zm,
	...th
}, Qp);
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/value/use-motion-value.mjs
function rh(e) {
	let t = hi(() => dc(e)), { isStatic: n } = (0, C.useContext)($f);
	if (n) {
		let [, n] = (0, C.useState)(e);
		(0, C.useEffect)(() => t.on("change", n), []);
	}
	return t;
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/value/use-combine-values.mjs
function ih(e, t) {
	let n = rh(t()), r = () => n.set(t());
	return r(), gi(() => {
		let t = () => oa.preRender(r, !1, !0), n = e.map((e) => e.on("change", t));
		return () => {
			n.forEach((e) => e()), sa(r);
		};
	}), n;
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/value/use-computed.mjs
function ah(e) {
	lc.current = [], e();
	let t = ih(lc.current, e);
	return lc.current = void 0, t;
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/value/use-transform.mjs
function oh(e, t, n, r) {
	if (typeof e == "function") return ah(e);
	if (n !== void 0 && !Array.isArray(n) && typeof t != "function") return ch(e, t, n, r);
	let i = typeof t == "function" ? t : Xl(t, n, r), a = Array.isArray(e) ? sh(e, i) : sh([e], ([e]) => i(e)), o = Array.isArray(e) ? void 0 : e.accelerate;
	return o && !o.isTransformed && typeof t != "function" && Array.isArray(n) && r?.clamp !== !1 && (a.accelerate = {
		...o,
		times: t,
		keyframes: n,
		isTransformed: !0,
		...r?.ease ? { ease: r.ease } : {}
	}), a;
}
function sh(e, t) {
	let n = hi(() => []);
	return ih(e, () => {
		n.length = 0;
		let r = e.length;
		for (let t = 0; t < r; t++) n[t] = e[t].get();
		return t(n);
	});
}
function ch(e, t, n, r) {
	let i = hi(() => Object.keys(n)), a = hi(() => ({}));
	for (let o of i) a[o] = oh(e, t, n[o], r);
	return a;
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/animation/utils/is-dom-keyframes.mjs
function lh(e) {
	return typeof e == "object" && !Array.isArray(e);
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/animation/animate/resolve-subjects.mjs
function uh(e, t, n, r) {
	return e == null ? [] : typeof e == "string" && lh(t) ? dl(e, n, r) : e instanceof NodeList ? Array.from(e) : Array.isArray(e) ? e.filter((e) => e != null) : [e];
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/animation/sequence/utils/calc-repeat-duration.mjs
function dh(e, t, n) {
	return e * (t + 1) + n * t;
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/animation/sequence/utils/calc-time.mjs
function fh(e, t, n, r) {
	return typeof t == "number" ? t : t.startsWith("-") || t.startsWith("+") ? Math.max(0, e + parseFloat(t)) : t === "<" ? n : t.startsWith("<") ? Math.max(0, n + parseFloat(t.slice(1))) : r.get(t) ?? e;
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/animation/sequence/utils/edit.mjs
function ph(e, t, n) {
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		i.at > t && i.at < n && (yi(e, i), r--);
	}
}
function mh(e, t, n, r, i, a) {
	ph(e, i, a);
	for (let o = 0; o < t.length; o++) e.push({
		value: t[o],
		at: Y(i, a, r[o]),
		easing: /* @__PURE__ */ Zi(n, o)
	});
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/animation/sequence/utils/normalize-times.mjs
function hh(e, t, n = 0) {
	let r = t + 1 + t * n;
	for (let t = 0; t < e.length; t++) e[t] = e[t] / r;
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/animation/sequence/utils/sort.mjs
function gh(e, t) {
	return e.at === t.at ? e.value === null ? 1 : t.value === null ? -1 : 0 : e.at - t.at;
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/animation/sequence/create.mjs
var _h = "easeInOut", vh = 20;
function yh(e, { defaultTransition: t = {}, ...n } = {}, r, i) {
	let a = t.duration || .3, o = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), c = {}, l = /* @__PURE__ */ new Map(), u = 0, d = 0, f = 0;
	for (let n = 0; n < e.length; n++) {
		let o = e[n];
		if (typeof o == "string") {
			l.set(o, d);
			continue;
		}
		if (!Array.isArray(o)) {
			l.set(o.name, fh(d, o.at, u, l));
			continue;
		}
		let [p, m, h = {}] = o;
		h.at !== void 0 && (d = fh(d, h.at, u, l));
		let g = 0, _ = (e, n, r, o = 0, s = 0) => {
			let c = Sh(e), { delay: l = 0, times: u = Ho(c), type: p = t.type || "keyframes", repeat: m, repeatType: h, repeatDelay: _ = 0, ...v } = n, { ease: y = t.ease || "easeOut", duration: b } = n, x = typeof l == "function" ? l(o, s) : l, S = c.length, C = Ls(p) ? p : i?.[p || "keyframes"];
			if (S <= 2 && C) {
				let e = 100;
				if (S === 2 && Th(c)) {
					let t = c[1] - c[0];
					e = Math.abs(t);
				}
				let n = {
					...t,
					...v
				};
				b !== void 0 && (n.duration = /* @__PURE__ */ ki(b));
				let r = wo(n, e, C);
				y = r.ease, b = r.duration;
			}
			b ??= a;
			let w = d + x;
			u.length === 1 && u[0] === 0 && (u[1] = 1);
			let T = u.length - c.length;
			if (T > 0 && Vo(u, T), c.length === 1 && c.unshift(null), m && `${m}${vh}`, m && m < vh) {
				let e = b > 0 ? _ / b : 0;
				b = dh(b, m, _);
				let t = [...c], n = [...u];
				y = Array.isArray(y) ? [...y] : [y];
				let r = [...y], i = h === "reverse" || h === "mirror", a = t, o = r;
				i && (a = [...t].reverse(), h === "reverse" && (o = [...r].reverse().map((e) => typeof e == "function" ? /* @__PURE__ */ zi(e) : e)));
				for (let s = 0; s < m; s++) {
					let l = i && s % 2 == 0, d = l ? a : t, f = l ? o : r, p = (s + 1) * (1 + e);
					e > 0 && (c.push(c[c.length - 1]), u.push(p), y.push("linear")), c.push(...d);
					for (let e = 0; e < d.length; e++) u.push(n[e] + p), y.push(e === 0 ? "linear" : /* @__PURE__ */ Zi(f, e - 1));
				}
				hh(u, m, e);
			}
			let E = w + b;
			mh(r, c, y, u, w, E), g = Math.max(x + b, g), f = Math.max(E, f);
		};
		if (Nc(p)) {
			let e = bh(p, s);
			_(m, h, xh("default", e));
		} else {
			let e = uh(p, m, r, c), t = e.length;
			for (let n = 0; n < t; n++) {
				m = m, h = h;
				let r = e[n], i = bh(r, s);
				for (let e in m) _(m[e], Ch(h, e), xh(e, i), n, t);
			}
		}
		u = d, d += g;
	}
	return s.forEach((e, r) => {
		for (let i in e) {
			let a = e[i];
			a.sort(gh);
			let s = [], c = [], l = [];
			for (let e = 0; e < a.length; e++) {
				let { at: t, value: n, easing: r } = a[e];
				s.push(n), c.push(/* @__PURE__ */ K(0, f, t)), l.push(r || "easeOut");
			}
			c[0] !== 0 && (c.unshift(0), s.unshift(s[0]), l.unshift(_h)), c[c.length - 1] !== 1 && (c.push(1), s.push(null)), o.has(r) || o.set(r, {
				keyframes: {},
				transition: {}
			});
			let u = o.get(r);
			u.keyframes[i] = s;
			let { type: d, ...p } = t;
			u.transition[i] = {
				...p,
				duration: f,
				ease: l,
				times: c,
				...n
			};
		}
	}), o;
}
function bh(e, t) {
	return !t.has(e) && t.set(e, {}), t.get(e);
}
function xh(e, t) {
	return t[e] || (t[e] = []), t[e];
}
function Sh(e) {
	return Array.isArray(e) ? e : [e];
}
function Ch(e, t) {
	return e && e[t] ? {
		...e,
		...e[t]
	} : { ...e };
}
var wh = (e) => typeof e == "number", Th = (e) => e.every(wh);
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/animation/utils/create-visual-element.mjs
function Eh(e) {
	let t = {
		presenceContext: null,
		props: {},
		visualState: {
			renderState: {
				transform: {},
				transformOrigin: {},
				style: {},
				vars: {},
				attrs: {}
			},
			latestValues: {}
		}
	}, n = Fl(e) && !Yl(e) ? new pd(t) : new td(t);
	n.mount(e), ru.set(e, n);
}
function Dh(e) {
	let t = new rd({
		presenceContext: null,
		props: {},
		visualState: {
			renderState: { output: {} },
			latestValues: {}
		}
	});
	t.mount(e), ru.set(e, t);
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/animation/animate/subject.mjs
function Oh(e, t) {
	return Nc(e) || typeof e == "number" || typeof e == "string" && !lh(t);
}
function kh(e, t, n, r) {
	let i = [];
	if (Oh(e, t)) i.push(lf(e, lh(t) && t.default || t, n && (n.default || n)));
	else {
		if (e == null) return i;
		let a = uh(e, t, r), o = a.length;
		for (let e = 0; e < o; e++) {
			let r = a[e], s = r instanceof Element ? Eh : Dh;
			ru.has(r) || s(r);
			let c = ru.get(r), l = { ...n };
			"delay" in l && typeof l.delay == "function" && (l.delay = l.delay(e, o)), i.push(...Vc(c, {
				...t,
				transition: l
			}, {}));
		}
	}
	return i;
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/animation/animate/sequence.mjs
function Ah(e, t, n) {
	let r = [];
	return yh(e.map((e) => {
		if (Array.isArray(e) && typeof e[0] == "function") {
			let t = e[0], n = dc(0);
			return n.on("change", t), e.length === 1 ? [n, [0, 1]] : e.length === 2 ? [
				n,
				[0, 1],
				e[1]
			] : [
				n,
				e[1],
				e[2]
			];
		}
		return e;
	}), t, n, { spring: Fo }).forEach(({ keyframes: e, transition: t }, n) => {
		r.push(...kh(n, e, t));
	}), r;
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/animation/animate/index.mjs
function jh(e) {
	return Array.isArray(e) && e.some(Array.isArray);
}
function Mh(e = {}) {
	let { scope: t, reduceMotion: n, skipAnimations: r } = e;
	function i(e, i, a) {
		let o = [], s, c = {};
		if (n !== void 0 && (c.reduceMotion = n), r !== void 0 && (c.skipAnimations = r), jh(e)) {
			let { onComplete: n, ...r } = i || {};
			typeof n == "function" && (s = n), o = Ah(e, {
				...c,
				...r
			}, t);
		} else {
			let { onComplete: n, ...r } = a || {};
			typeof n == "function" && (s = n), o = kh(e, i, {
				...c,
				...r
			}, t);
		}
		let l = new ac(o);
		return s && l.finished.then(s), t && (t.animations.push(l), l.finished.then(() => {
			yi(t.animations, l);
		})), l;
	}
	return i;
}
var Nh = Mh();
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/useValueChanged.mjs
function Ph(e, t) {
	let n = C.useRef(e), r = k(t);
	M(() => {
		n.current !== e && r(n.current), n.current = e;
	}, [e, r]);
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/clamp.mjs
function Fh(e, t = -(2 ** 53 - 1), n = 2 ** 53 - 1) {
	return Math.max(t, Math.min(e, n));
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/areArraysEqual.mjs
function Ih(e, t, n = (e, t) => e === t) {
	return e.length === t.length && e.every((e, r) => n(e, t[r]));
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/composite/list/CompositeListContext.mjs
var Lh = /*#__PURE__*/ C.createContext({
	register: () => {},
	unregister: () => {},
	subscribeMapChange: () => () => {},
	nextIndexRef: { current: 0 }
});
function Rh() {
	return C.useContext(Lh);
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/composite/list/CompositeList.mjs
function zh(e) {
	let { children: t, elementsRef: n, labelsRef: r, onMapChange: i } = e, a = k(i), [, o] = C.useState(!1), s = E(Vh).current, c = E(Bh).current, l = C.useRef(0), u = C.useRef(!0), d = C.useRef([]), f = C.useRef(null), p = k(() => {
		u.current || (u.current = !0, o((e) => !e));
	}), m = k((e, t) => {
		c.set(e, t), p();
	}), h = k((e) => {
		c.delete(e), p();
	}), g = k((e) => {
		let t = /* @__PURE__ */ new Map();
		return n.current.length = 0, r && (r.current.length = 0), e.forEach((e) => {
			t.set(e.element, {
				...e.registration.metadata ?? {},
				index: e.index
			}), n.current[e.index] = e.element, r && (r.current[e.index] = e.registration.label === void 0 ? e.registration.textRef?.current?.textContent ?? e.element.textContent : e.registration.label);
		}), l.current = n.current.length, t;
	});
	function _(e) {
		if (f.current?.disconnect(), f.current = null, typeof MutationObserver != "function" || e.length < 2) return;
		let t = new MutationObserver((n) => {
			if (!Wh(n)) return;
			let r = null;
			for (let n of e) if (n.isConnected) {
				if (r && Gh(r, n) > 0) {
					t.disconnect(), p();
					return;
				}
				r = n;
			}
		});
		f.current = t;
		let n = /* @__PURE__ */ new Set();
		for (let t = 1; t < e.length; t += 1) {
			let r = Uh(e[t - 1], e[t]);
			r && n.add(r);
		}
		n.forEach((e) => t.observe(e, { childList: !0 }));
	}
	let v = k(() => {
		let [e, t] = Hh(c), n = g(e);
		_(t), d.current = e, u.current = !1, s.forEach((e) => e(n)), a(n);
	});
	M(() => (u.current || g(d.current), () => {
		n.current = [], r && (r.current = []);
	}), [
		n,
		r,
		g
	]), M(() => {
		u.current && v();
	}), M(() => () => {
		f.current?.disconnect(), u.current = !0;
	}, []);
	let y = k((e) => (s.add(e), () => {
		s.delete(e);
	})), b = C.useMemo(() => ({
		register: m,
		unregister: h,
		subscribeMapChange: y,
		nextIndexRef: l
	}), [
		m,
		h,
		y,
		l
	]);
	return /*#__PURE__*/ (0, G.jsx)(Lh.Provider, {
		value: b,
		children: t
	});
}
function Bh() {
	return /* @__PURE__ */ new Map();
}
function Vh() {
	return /* @__PURE__ */ new Set();
}
function Hh(e) {
	let t = /* @__PURE__ */ new Set(), n = [], r = [];
	e.forEach((e, i) => {
		if (!i.isConnected) return;
		let a = e.index, o = {
			index: a ?? -1,
			element: i,
			registration: e
		};
		a === null ? r.push(o) : a >= 0 && (t.add(a), n.push(o));
	});
	let i = 0;
	return r.sort((e, t) => Gh(e.element, t.element)), r.forEach((e) => {
		for (; t.has(i);) i += 1;
		e.index = i, n.push(e), i += 1;
	}), t.size > 0 && n.sort((e, t) => e.index - t.index), [n, r.map((e) => e.element)];
}
function Uh(e, t) {
	let n = e.parentElement;
	for (; n && !n.contains(t);) n = n.parentElement;
	return n;
}
function Wh(e) {
	for (let t of e) for (let e = 0; e < t.removedNodes.length; e += 1) if (t.removedNodes[e].isConnected) return !0;
	return !1;
}
function Gh(e, t) {
	return e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/resolveAriaLabelledBy.mjs
function Kh(e) {
	return e == null ? void 0 : `${e}-label`;
}
function qh(e, t) {
	return e ?? t;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/slider/utils/asc.mjs
function Jh(e, t) {
	return e - t;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/slider/utils/getSliderValue.mjs
function Yh(e, t, n, r, i, a) {
	let o = Fh(e, n, r);
	if (!i) return o;
	let s = a.slice();
	return s[t] = Fh(o, a[t - 1] ?? -Infinity, a[t + 1] ?? Infinity), s.sort(Jh);
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/slider/utils/validateMinimumDistance.mjs
function Xh(e, t, n) {
	if (!Array.isArray(e)) return !0;
	let r = t * n;
	for (let t = 0; t < e.length - 1; t += 1) if (!(Math.abs(e[t] - e[t + 1]) >= r)) return !1;
	return !0;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/slider/root/stateAttributesMapping.mjs
var Zh = () => null, Qh = {
	activeThumbIndex: Zh,
	max: Zh,
	min: Zh,
	minStepsBetweenValues: Zh,
	step: Zh,
	values: Zh,
	...Fn
}, $h = /*#__PURE__*/ C.createContext(void 0);
function eg() {
	let e = C.useContext($h);
	if (e === void 0) throw Error(V(62));
	return e;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/slider/root/SliderRoot.mjs
function tg(e, t) {
	return e === t || Array.isArray(e) && Array.isArray(t) && Ih(e, t);
}
var ng = /*#__PURE__*/ C.forwardRef(function(e, t) {
	let { "aria-labelledby": n, className: r, defaultValue: i, disabled: a = !1, id: o, format: s, largeStep: c = 10, locale: l, render: u, max: d = 100, min: f = 0, minStepsBetweenValues: p = 0, form: m, name: h, onValueChange: g, onValueCommitted: _, orientation: v = "horizontal", step: y = 1, thumbCollisionBehavior: b = "push", thumbAlignment: x = "center", value: S, style: w, ...T } = e, E = qn(o), D = Kh(E), O = k(g), A = k(_), { clearErrors: j } = Hn(), { state: N, disabled: P, name: ee, setTouched: F, setDirty: I, validityData: te, validation: ne } = Rn(), { labelId: re } = Yn(), [L, R] = C.useState(), z = n ?? qh(re, L), ie = P || a, B = ee ?? h, [ae, oe] = Jr({
		controlled: S,
		default: i ?? f,
		name: "Slider"
	}), se = C.useRef(null), ce = C.useRef(null), V = C.useRef([]), le = C.useRef(null), ue = C.useRef(-1), de = C.useRef(null), pe = C.useRef(Xr), [me, he] = C.useState(-1), [ge, _e] = C.useState(-1), [ve, ye] = C.useState(!1), [be, xe] = C.useState(() => /* @__PURE__ */ new Map()), [Se, Ce] = C.useState([void 0, void 0]), we = k((e) => {
		he(e), e !== -1 && _e(e);
	}), Te = k((e) => {
		e && (ce.current = e);
	}), Ee = Array.isArray(ae), De = C.useMemo(() => Ee ? ae.map((e) => Fh(e, f, d)).sort(Jh) : [Fh(ae, f, d)], [
		d,
		f,
		Ee,
		ae
	]), Oe = Ee ? De : De[0];
	Yr(ne.inputRef, E, Oe, void 0, !ie, h), Ph(Oe, () => {
		j(B), ne.change(Oe);
		let e = te.initialValue, t;
		t = Array.isArray(Oe) && Array.isArray(e) ? !Ih(Oe, e) : Oe !== e, I(t);
	});
	let ke = k((e, t) => {
		if (Number.isNaN(e) || tg(e, ae)) return !1;
		let n = t.event, r = n.constructor, i = new r(n.type, n);
		return Object.defineProperty(i, "target", {
			writable: !0,
			value: {
				value: e,
				name: B
			}
		}), t.event = i, O(e, t), !t.isCanceled && (pe.current = t.reason, oe(e), !0);
	}), Ae = k((e, t, n) => {
		let r = Yh(e, t, f, d, Ee, De);
		if (Xh(r, y, p)) {
			let e = "key" in n ? $r : Qr, i = ke(r, ii(e, n.nativeEvent, void 0, { activeThumbIndex: t }));
			F(!0), i && A(r, ai(e, n.nativeEvent));
		}
	});
	M(() => {
		if (!ie) return;
		let e = ir(fe(se.current));
		ar(se.current, e) && e.blur(), me !== -1 && we(-1);
	}, [
		me,
		ie,
		we
	]);
	let je = C.useMemo(() => ({
		...N,
		activeThumbIndex: me,
		disabled: ie,
		dragging: ve,
		orientation: v,
		max: d,
		min: f,
		minStepsBetweenValues: p,
		step: y,
		values: De
	}), [
		N,
		me,
		ie,
		ve,
		d,
		f,
		p,
		v,
		y,
		De
	]), Ne = C.useMemo(() => ({
		active: me,
		controlRef: ce,
		disabled: ie,
		dragging: ve,
		validation: ne,
		format: s,
		handleInputChange: Ae,
		indicatorPosition: Se,
		inset: x !== "center",
		labelId: z,
		rootLabelId: D,
		largeStep: c,
		lastUsedThumbIndex: ge,
		lastChangeReasonRef: pe,
		form: m,
		locale: l,
		max: d,
		min: f,
		minStepsBetweenValues: p,
		name: B,
		onValueCommitted: A,
		orientation: v,
		pressedThumbCenterOffsetRef: le,
		pressedThumbIndexRef: ue,
		pressedValuesRef: de,
		registerFieldControlRef: Te,
		renderBeforeHydration: x === "edge",
		setActive: we,
		setDragging: ye,
		setIndicatorPosition: Ce,
		setLabelId: R,
		setValue: ke,
		state: je,
		step: y,
		thumbCollisionBehavior: b,
		thumbMap: be,
		thumbRefs: V,
		values: De
	}), [
		me,
		z,
		D,
		ie,
		ve,
		ne,
		s,
		Ae,
		Se,
		c,
		ge,
		m,
		l,
		d,
		f,
		p,
		B,
		A,
		v,
		Te,
		we,
		ke,
		je,
		y,
		b,
		x,
		be,
		De
	]), Pe = Me("div", e, {
		state: je,
		ref: [t, se],
		props: [
			{
				"aria-labelledby": z,
				id: E,
				role: "group"
			},
			T,
			(e) => ne.getValidationProps(ie, e)
		],
		stateAttributesMapping: Qh
	});
	return /*#__PURE__*/ (0, G.jsx)($h.Provider, {
		value: Ne,
		children: /*#__PURE__*/ (0, G.jsx)(zh, {
			elementsRef: V,
			onMapChange: xe,
			children: Pe
		})
	});
});
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/stringifyLocale.mjs
function rg(e) {
	return Array.isArray(e) ? e.map((e) => rg(e)).join(",") : e == null ? "" : String(e);
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/formatNumber.mjs
var ig = /* @__PURE__ */ new Map();
function ag(e, t) {
	let n = JSON.stringify({
		locale: rg(e),
		options: t
	}), r = ig.get(n);
	if (r) return r;
	let i = new Intl.NumberFormat(e, t);
	return ig.set(n, i), i;
}
function og(e, t, n) {
	return e == null ? "" : ag(t, n).format(e);
}
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/addEventListener.mjs
function sg(e, t, n, r) {
	return e.addEventListener(t, n, r), () => {
		e.removeEventListener(t, n, r);
	};
}
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/useValueAsRef.mjs
function cg(e) {
	let t = E(lg, e).current;
	return t.next = e, M(t.effect), t;
}
function lg(e) {
	let t = {
		current: e,
		next: e,
		effect: () => {
			t.current = t.next;
		}
	};
	return t;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/direction-context/DirectionContext.mjs
var ug = /*#__PURE__*/ C.createContext(void 0);
function dg() {
	return C.useContext(ug)?.direction ?? "ltr";
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/slider/utils/getMidpoint.mjs
function fg(e, t) {
	let n = e.getBoundingClientRect();
	return t ? (n.top + n.bottom) / 2 : (n.left + n.right) / 2;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/slider/utils/roundValueToStep.mjs
function pg(e) {
	if (e === 0) return 0;
	if (Math.abs(e) < 1) {
		let t = e.toExponential().split("e-"), n = t[0].split(".")[1];
		return (n ? n.length : 0) + parseInt(t[1], 10);
	}
	let t = e.toString().split(".")[1];
	return t ? t.length : 0;
}
function mg(e, t, n) {
	let r = Math.round((e - n) / t) * t + n;
	return Number(r.toFixed(Math.max(pg(t), pg(n))));
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/slider/utils/getPushedThumbValues.mjs
function hg(e, t, n, r, i, a, o, s) {
	let c = e.slice(), l = a * o, u = c.length - 1, d = s ?? e;
	c[t] = Fh(n, r + t * l, i - (u - t) * l);
	for (let e = t + 1; e <= u; e += 1) {
		let t = c[e - 1] + l, n = i - (u - e) * l, r = d[e], a = Math.max(c[e], t);
		r < a && (a = Math.max(r, t)), c[e] = Fh(a, t, n);
	}
	for (let e = t - 1; e >= 0; --e) {
		let t = c[e + 1] - l, n = r + e * l, i = d[e], a = Math.min(c[e], t);
		i > a && (a = Math.min(i, t)), c[e] = Fh(a, n, t);
	}
	for (let e = 0; e <= u; e += 1) c[e] = Number(c[e].toFixed(12));
	return c;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/slider/utils/resolveThumbCollision.mjs
function gg(e, t, n, r, i, a, o, s, c, l) {
	let u = n ?? t, d = r ?? t;
	if (!(u.length > 1)) return {
		value: a,
		thumbIndex: 0,
		didSwap: !1
	};
	let f = c * l;
	if (e === "push") return {
		value: hg(u, i, a, o, s, c, l),
		thumbIndex: i,
		didSwap: !1
	};
	let p = u.slice(), m = p[i - 1], h = p[i + 1], g = m == null ? o : m + f, _ = h == null ? s : h - f, v = Number(Fh(a, g, _).toFixed(12));
	switch (p[i] = v, e) {
		case "swap": {
			let e = u[i], t = 1e-7, n = a > e, r = a < e, g = n && h != null && a >= h - t, _ = r && m != null && a <= m + t;
			if (!g && !_) return {
				value: p,
				thumbIndex: i,
				didSwap: !1
			};
			let y = g ? i + 1 : i - 1, b = p.map((e, t) => t === i ? v : d[t] ?? u[t]), x = a;
			x = g ? Math.max(a, p[y]) : Math.min(a, p[y]);
			let S = hg(p, y, x, o, s, c, l, b), C = g ? y - 1 : y + 1, w = S[C - 1], T = S[C + 1], E = w == null ? o : w + f;
			E = Math.max(E, o + C * f);
			let D = T == null ? s : T - f;
			D = Math.min(D, s - (S.length - 1 - C) * f);
			let O = Fh(v, E, D);
			return S[C] = Number(O.toFixed(12)), {
				value: S,
				thumbIndex: y,
				didSwap: !0
			};
		}
		default: return {
			value: p,
			thumbIndex: i,
			didSwap: !1
		};
	}
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/slider/control/SliderControl.mjs
var _g = 2;
function vg(e, t) {
	if (!e) return {
		start: 0,
		end: 0
	};
	function n(e) {
		let t = e == null ? 0 : parseFloat(e);
		return Number.isNaN(t) ? 0 : t;
	}
	let r = t ? "Top" : "InlineStart", i = t ? "Bottom" : "InlineEnd";
	return {
		start: n(e[`border${r}Width`]) + n(e[`padding${r}`]),
		end: n(e[`border${i}Width`]) + n(e[`padding${i}`])
	};
}
function yg(e, t) {
	if (t.current != null && e.changedTouches) {
		let n = e;
		for (let e = 0; e < n.changedTouches.length; e += 1) {
			let r = n.changedTouches[e];
			if (r.identifier === t.current) return {
				x: r.clientX,
				y: r.clientY
			};
		}
		return null;
	}
	return {
		x: e.clientX,
		y: e.clientY
	};
}
var bg = /*#__PURE__*/ C.forwardRef(function(e, t) {
	let { render: n, className: r, style: i, ...a } = e, { disabled: o, dragging: s, inset: c, lastChangeReasonRef: l, max: u, min: d, minStepsBetweenValues: f, onValueCommitted: p, orientation: m, pressedThumbCenterOffsetRef: h, pressedThumbIndexRef: g, pressedValuesRef: _, registerFieldControlRef: b, renderBeforeHydration: x, setActive: S, setDragging: w, setValue: T, state: E, step: D, thumbCollisionBehavior: O, thumbRefs: A, values: j } = eg(), M = dg(), N = j.length > 1, P = m === "vertical", ee = C.useRef(null), F = C.useRef(null), I = k((e) => {
		e && F.current == null && (F.current = v(e).getComputedStyle(e));
	}), te = C.useRef(null), ne = C.useRef(0), re = C.useRef(0), L = C.useRef(null), R = cg(j);
	function z(e) {
		return e?.querySelector("input[type=\"range\"]");
	}
	function ie(e) {
		g.current = e, A.current[e] || (h.current = null);
	}
	function B() {
		g.current = -1, h.current = null;
	}
	function ae(e) {
		return y(e) ? A.current.some((t) => !y(t) || !ar(t, e) ? !1 : z(t)?.disabled === !0) : !1;
	}
	function oe(e) {
		let t = ee.current, n = g.current;
		if (!t || n < 0 || n >= j.length) return n >= j.length && (L.current = null), null;
		let { width: r, height: i, bottom: a, left: o, right: s } = t.getBoundingClientRect(), c = vg(F.current, P), l = re.current, p = (P ? i : r) - c.start - c.end - l * 2, m = h.current ?? 0, v = e.x - m, y = e.y - m, b = Fh(((P ? a - y - c.end : (M === "rtl" ? s - v : v - o) - c.start) - l) / p, 0, 1), x = (u - d) * b + d;
		return x = mg(x, D, d), x = Fh(x, d, u), N ? gg(O, j, R.current, _.current, n, x, d, u, D, f) : {
			value: x,
			thumbIndex: n,
			didSwap: !1
		};
	}
	function se(e) {
		_.current = N ? j.slice() : null, L.current = null, R.current = j;
		let t = g.current, n = t;
		if (t > -1 && t < j.length) {
			if (j[t] === u) {
				let e = t;
				for (; e > 0 && j[e - 1] === u;) --e;
				n = e;
			}
		} else {
			let t = P ? "y" : "x", r;
			n = -1;
			for (let i = 0; i < A.current.length; i += 1) {
				let a = A.current[i];
				if (y(a) && !z(a)?.disabled) {
					let o = fg(a, P), s = Math.abs(e[t] - o);
					(r === void 0 || s <= r) && (n = i, r = s);
				}
			}
		}
		if (n > -1 && n !== t && ie(n), c) {
			let e = A.current[n];
			if (y(e)) {
				let t = e.getBoundingClientRect();
				re.current = t[P ? "height" : "width"] / 2;
			}
		}
	}
	function ce(e) {
		let t = z(A.current?.[e]);
		t && t.focus({
			preventScroll: !0,
			focusVisible: !1
		});
	}
	function V(e, t, n) {
		let r = T(e.value, ii(t, n, void 0, { activeThumbIndex: e.thumbIndex }));
		return r && (L.current = e.value, R.current = Array.isArray(e.value) ? e.value : [e.value], e.didSwap && (ie(e.thumbIndex), ce(e.thumbIndex))), r;
	}
	let le = k((e) => {
		let t = yg(e, te);
		if (t == null) return;
		if (ne.current += 1, e.type === "pointermove" && e.buttons === 0) {
			ue(e);
			return;
		}
		let n = oe(t);
		n != null && Xh(n.value, D, f) && (!s && ne.current > _g && w(!0), V(n, ei, e));
	}), ue = k((e) => {
		S(-1), w(!1), h.current = null;
		let t = L.current;
		if (Array.isArray(t) && t.length !== j.length && (L.current = null), L.current != null) {
			let t = l.current;
			p(L.current, ai(t, e));
		}
		"pointerType" in e && ee.current?.hasPointerCapture(e.pointerId) && ee.current?.releasePointerCapture(e.pointerId), g.current = -1, te.current = null, pe();
	}), de = k((e) => {
		if (o) return;
		if (ae(or(e))) {
			B();
			return;
		}
		let t = e.changedTouches[0];
		if (t == null) return;
		te.current = t.identifier;
		let n = {
			x: t.clientX,
			y: t.clientY
		};
		se(n);
		let r = oe(n);
		if (r == null) return;
		ce(r.thumbIndex), V(r, Zr, e), ne.current = 0;
		let i = fe(ee.current);
		i.addEventListener("touchmove", le, { passive: !0 }), i.addEventListener("touchend", ue, { passive: !0 });
	}), pe = k(() => {
		let e = fe(ee.current);
		e.removeEventListener("pointermove", le), e.removeEventListener("pointerup", ue), e.removeEventListener("touchmove", le), e.removeEventListener("touchend", ue), _.current = null, L.current = null;
	}), me = Lr();
	return C.useEffect(() => {
		let e = ee.current;
		if (!e) return () => pe();
		let t = sg(e, "touchstart", de, { passive: !0 });
		return () => {
			t(), me.cancel(), pe();
		};
	}, [
		pe,
		de,
		ee,
		me
	]), C.useEffect(() => {
		o && pe();
	}, [o, pe]), Me("div", e, {
		state: E,
		ref: [
			t,
			b,
			ee,
			I
		],
		props: [{
			"data-base-ui-slider-control": x ? "" : void 0,
			onPointerDown(e) {
				let t = ee.current, n = or(e.nativeEvent);
				if (!t || o || e.defaultPrevented || !y(n) || e.button !== 0) return;
				if (ae(n)) {
					B();
					return;
				}
				let r = {
					x: e.clientX,
					y: e.clientY
				};
				se(r);
				let i = oe(r);
				if (i == null) return;
				ar(A.current[i.thumbIndex], ir(fe(t))) ? e.preventDefault() : me.request(() => {
					ce(i.thumbIndex);
				}), w(!0), h.current ?? V(i, Zr, e.nativeEvent), e.nativeEvent.pointerId && t.setPointerCapture(e.nativeEvent.pointerId), ne.current = 0;
				let a = fe(t);
				a.addEventListener("pointermove", le, { passive: !0 }), a.addEventListener("pointerup", ue, { once: !0 });
			}
		}, a],
		stateAttributesMapping: Qh
	});
}), xg = /*#__PURE__*/ C.forwardRef(function(e, t) {
	let { render: n, className: r, style: i, ...a } = e, { state: o } = eg();
	return Me("div", e, {
		state: o,
		ref: t,
		props: [{ style: { position: "relative" } }, a],
		stateAttributesMapping: Qh
	});
}), Sg = {
	clipPath: "inset(50%)",
	overflow: "hidden",
	whiteSpace: "nowrap",
	border: 0,
	padding: 0,
	width: 1,
	height: 1,
	margin: -1
}, Cg = {
	...Sg,
	position: "fixed",
	top: 0,
	left: 0
};
({ ...Sg });
//#endregion
//#region node_modules/.pnpm/use-sync-external-store@1.6.0_react@19.2.8/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.production.js
var wg = /* @__PURE__ */ o(((e) => {
	var t = f();
	function n(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var r = typeof Object.is == "function" ? Object.is : n, i = t.useState, a = t.useEffect, o = t.useLayoutEffect, s = t.useDebugValue;
	function c(e, t) {
		var n = t(), r = i({ inst: {
			value: n,
			getSnapshot: t
		} }), c = r[0].inst, u = r[1];
		return o(function() {
			c.value = n, c.getSnapshot = t, l(c) && u({ inst: c });
		}, [
			e,
			n,
			t
		]), a(function() {
			return l(c) && u({ inst: c }), e(function() {
				l(c) && u({ inst: c });
			});
		}, [e]), s(n), n;
	}
	function l(e) {
		var t = e.getSnapshot;
		e = e.value;
		try {
			var n = t();
			return !r(e, n);
		} catch {
			return !0;
		}
	}
	function u(e, t) {
		return t();
	}
	var d = typeof window > "u" || window.document === void 0 || window.document.createElement === void 0 ? u : c;
	e.useSyncExternalStore = t.useSyncExternalStore === void 0 ? d : t.useSyncExternalStore;
})), Tg = (/* @__PURE__ */ o(((e, t) => {
	t.exports = wg();
})))();
function Eg() {
	return Ee;
}
function Dg() {
	return !1;
}
function Og() {
	return !0;
}
function kg() {
	return (0, Tg.useSyncExternalStore)(Eg, Dg, Og);
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/valueToPercent.mjs
function Ag(e, t, n) {
	return (e - t) * 100 / (n - t);
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/composite/composite.mjs
var jg = "ArrowUp", Mg = "ArrowDown", Ng = "ArrowLeft", Pg = "ArrowRight", Fg = "Home", Ig = "PageUp", Lg = "PageDown", Rg = /* @__PURE__ */ new Set([
	jg,
	Mg,
	Ng,
	Pg,
	Fg,
	"End"
]), zg = [
	"Shift",
	"Control",
	"Alt",
	"Meta"
];
function Bg(e) {
	return b(e) && e.tagName === "INPUT";
}
function Vg(e) {
	return !!(Bg(e) && e.selectionStart != null || b(e) && e.tagName === "TEXTAREA");
}
function Hg(e, t, n, r) {
	if (!e || !t || !t.scrollTo) return;
	let i = e.scrollLeft, a = e.scrollTop, o = e.clientWidth < e.scrollWidth, s = e.clientHeight < e.scrollHeight;
	if (o && r !== "vertical") {
		let r = Ug(e, t, "left"), a = Wg(e), o = Wg(t);
		n === "ltr" && (r + t.offsetWidth + o.scrollMarginRight > e.scrollLeft + e.clientWidth - a.scrollPaddingRight ? i = r + t.offsetWidth + o.scrollMarginRight - e.clientWidth + a.scrollPaddingRight : r - o.scrollMarginLeft < e.scrollLeft + a.scrollPaddingLeft && (i = r - o.scrollMarginLeft - a.scrollPaddingLeft)), n === "rtl" && (r - o.scrollMarginLeft < e.scrollLeft + a.scrollPaddingLeft ? i = r - o.scrollMarginLeft - a.scrollPaddingLeft : r + t.offsetWidth + o.scrollMarginRight > e.scrollLeft + e.clientWidth - a.scrollPaddingRight && (i = r + t.offsetWidth + o.scrollMarginRight - e.clientWidth + a.scrollPaddingRight));
	}
	if (s && r !== "horizontal") {
		let n = Ug(e, t, "top"), r = Wg(e), i = Wg(t);
		n - i.scrollMarginTop < e.scrollTop + r.scrollPaddingTop ? a = n - i.scrollMarginTop - r.scrollPaddingTop : n + t.offsetHeight + i.scrollMarginBottom > e.scrollTop + e.clientHeight - r.scrollPaddingBottom && (a = n + t.offsetHeight + i.scrollMarginBottom - e.clientHeight + r.scrollPaddingBottom);
	}
	e.scrollTo({
		left: i,
		top: a,
		behavior: "auto"
	});
}
function Ug(e, t, n) {
	let r = n === "left" ? "offsetLeft" : "offsetTop", i = 0;
	for (; t.offsetParent && (i += t[r], t.offsetParent !== e);) t = t.offsetParent;
	return i;
}
function Wg(e) {
	let t = getComputedStyle(e);
	return {
		scrollMarginTop: parseFloat(t.scrollMarginTop) || 0,
		scrollMarginRight: parseFloat(t.scrollMarginRight) || 0,
		scrollMarginBottom: parseFloat(t.scrollMarginBottom) || 0,
		scrollMarginLeft: parseFloat(t.scrollMarginLeft) || 0,
		scrollPaddingTop: parseFloat(t.scrollPaddingTop) || 0,
		scrollPaddingRight: parseFloat(t.scrollPaddingRight) || 0,
		scrollPaddingBottom: parseFloat(t.scrollPaddingBottom) || 0,
		scrollPaddingLeft: parseFloat(t.scrollPaddingLeft) || 0
	};
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/composite/list/useCompositeListItem.mjs
function Gg(e = {}) {
	let { guess: t, label: n, metadata: r, textRef: i, index: a } = e, { register: o, unregister: s, subscribeMapChange: c, nextIndexRef: l } = Rh(), u = C.useRef(-1), [d, f] = C.useState(a == null && t ? () => {
		if (u.current === -1) {
			let e = l.current;
			l.current += 1, u.current = e;
		}
		return u.current;
	} : -1), p = a ?? d, m = C.useRef(null), h = C.useCallback((e) => {
		let t = m.current;
		t && s(t), m.current = e, e && o(e, {
			metadata: r ?? null,
			index: a ?? null,
			label: n,
			textRef: i
		});
	}, [
		a,
		o,
		s,
		r,
		n,
		i
	]);
	return M(() => {
		if (a == null) return c((e) => {
			let t = m.current ? e.get(m.current)?.index : null;
			t != null && f(t);
		});
	}, [a, c]), {
		ref: h,
		index: p
	};
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/csp-context/CSPContext.mjs
var Kg = /*#__PURE__*/ C.createContext(void 0), qg = { disableStyleElements: !1 };
function Jg() {
	return C.useContext(Kg) ?? qg;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/PrehydrationScript.mjs
function Yg(e) {
	let { script: t } = e, { nonce: n } = Jg();
	return kg() ? /*#__PURE__*/ (0, G.jsx)("script", {
		nonce: n,
		dangerouslySetInnerHTML: { __html: t },
		suppressHydrationWarning: !0
	}) : null;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/slider/thumb/SliderThumb.mjs
var Xg, Zg = /* @__PURE__ */ new Set([
	...Rg,
	Ig,
	Lg
]);
function Qg(e, t, n, r) {
	if (!(t < 0)) return e.length === 2 ? `${og(e[t], r, n)} ${t === 0 ? "start" : "end"} range` : n ? og(e[t], r, n) : void 0;
}
function $g(e, t, n, r, i) {
	let a = e + t * n;
	return Fh(Number(a.toFixed(Math.max(pg(e), pg(t), pg(r)))), r, i);
}
var e_ = /*#__PURE__*/ C.forwardRef(function(e, t) {
	let { render: n, children: r, className: i, "aria-describedby": a, "aria-label": o, "aria-labelledby": s, "aria-valuetext": c, disabled: l = !1, getAriaLabel: u, getAriaValueText: d, id: f, index: p, inputRef: m, onBlur: h, onFocus: g, onKeyDown: _, tabIndex: y, style: b, ...x } = e, S = qn(f), { active: w, lastUsedThumbIndex: T, controlRef: E, disabled: D, validation: O, format: A, handleInputChange: j, inset: N, labelId: P, largeStep: F, locale: I, max: te, min: ne, minStepsBetweenValues: re, form: L, name: R, orientation: z, pressedThumbCenterOffsetRef: ie, pressedThumbIndexRef: B, renderBeforeHydration: ae, setActive: oe, setIndicatorPosition: se, state: ce, step: V, thumbRefs: le, values: ue } = eg(), de = dg(), fe = l || D, pe = ue.length > 1, me = z === "vertical", he = de === "rtl", { setTouched: ge, setFocused: ve, validationMode: ye } = Rn(), be = C.useRef(null), xe = C.useRef(null), Se = C.useRef(!1), Ce = k((e) => {
		Se.current || g?.(e);
	}), we = k((e) => {
		Se.current || h?.(e);
	}), Te = qn(), Ee = Zn(), De = pe ? Te : Ee, { ref: Oe, index: ke } = Gg({ metadata: C.useMemo(() => ({ inputId: De }), [De]) }), Ae = pe ? p ?? ke : 0, je = Ae === ue.length - 1, Ne = ue[Ae], Pe = Ag(Ne, ne, te), [Fe, Ie] = C.useState(), Le = kg(), Re = T >= 0 && T < ue.length ? T : -1, ze = k(() => {
		let e = E.current, t = be.current;
		if (!e || !t) return;
		let n = t.getBoundingClientRect(), r = e.getBoundingClientRect(), i = me ? "height" : "width", a = r[i] - n[i], o = (n[i] / 2 + a * Pe / 100) / r[i] * 100, s = Number.isFinite(o) ? o : void 0;
		Ie(s), Ae === 0 ? se((e) => [s, e[1]]) : je && se((e) => [e[0], s]);
	});
	M(() => {
		N && queueMicrotask(ze);
	}, [ze, N]), M(() => {
		N && ze();
	}, [
		ze,
		N,
		Pe
	]), M(() => {
		if (!N) return;
		let e = E.current, t = be.current;
		if (!e || !t) return;
		let n = v(e).ResizeObserver;
		if (typeof n != "function") return;
		let r = new n(ze);
		return r.observe(e), r.observe(t), () => {
			r.disconnect();
		};
	}, [
		E,
		ze,
		N
	]);
	let Be = me ? "bottom" : "insetInlineStart", Ve = me ? "left" : "top", He;
	pe ? w === Ae ? He = 2 : Re === Ae && (He = 1) : w === Ae && (He = 1);
	let Ue;
	Ue = !N && !Number.isFinite(Pe) ? Cg : {
		position: "absolute",
		[Be]: N ? "var(--position)" : `${Pe}%`,
		[Ve]: "50%",
		translate: `${(me || !he ? -1 : 1) * 50}% ${(me ? 1 : -1) * 50}%`,
		zIndex: He,
		...N && {
			"--position": `${Fe ?? 0}%`,
			visibility: ae && Le || Fe === void 0 ? "hidden" : void 0
		}
	};
	let We;
	me && (We = he ? "vertical-rl" : "vertical-lr");
	let Ge = typeof u == "function" ? u(Ae) : o, Ke = ee({
		"aria-label": Ge,
		"aria-labelledby": s ?? (Ge == null ? P : void 0),
		"aria-describedby": a,
		"aria-orientation": z,
		"aria-valuenow": Ne,
		"aria-valuetext": typeof d == "function" ? d(og(Ne, I, A), Ne, Ae) : c ?? Qg(ue, Ae, A, I),
		disabled: fe,
		form: L,
		id: De,
		max: te,
		min: ne,
		name: R,
		onChange(e) {
			j(e.currentTarget.valueAsNumber, Ae, e);
		},
		onFocus(e) {
			let t = Se.current;
			Se.current = !1, oe(Ae), ve(!0), t && e.stopPropagation();
		},
		onBlur(e) {
			if (Se.current) {
				e.stopPropagation();
				return;
			}
			oe(-1), !le.current.some((t) => ar(t, e.relatedTarget)) && (ge(!0), ve(!1), ye === "onBlur" && O.commit(Yh(Ne, Ae, ne, te, pe, ue)));
		},
		onKeyDown(e) {
			if (e.defaultPrevented || !Zg.has(e.key)) return;
			Rg.has(e.key) && e.stopPropagation();
			let t = null, n = 0, r = e.shiftKey ? F : V, i = mg(Ne, V, ne);
			switch (e.key) {
				case jg:
					n = 1;
					break;
				case Pg:
					n = he ? -1 : 1;
					break;
				case Mg:
					n = -1;
					break;
				case Ng:
					n = he ? 1 : -1;
					break;
				case Ig:
					r = F, n = 1;
					break;
				case Lg:
					r = F, n = -1;
					break;
				case "End":
					t = pe && Number.isFinite(ue[Ae + 1]) ? ue[Ae + 1] - V * re : te;
					break;
				case Fg: t = pe && Number.isFinite(ue[Ae - 1]) ? ue[Ae - 1] + V * re : ne;
			}
			if (n !== 0 && (t = $g(i, r, n, ne, te)), t !== null) {
				let n = e.currentTarget;
				sr(n) || (Se.current = !0, n.blur(), n.focus({
					preventScroll: !0,
					focusVisible: !0
				})), j(t, Ae, e), e.preventDefault();
			}
		},
		step: V,
		style: {
			...Cg,
			width: "100%",
			height: "100%",
			writingMode: We
		},
		tabIndex: y,
		type: "range",
		value: Ne ?? ""
	}, (e) => O.getValidationProps(fe, e), {
		onFocus: Ce,
		onBlur: we,
		onKeyDown: _
	}), qe = _e(xe, O.inputRef, m);
	return Me("div", e, {
		state: ce,
		ref: [
			t,
			Oe,
			be
		],
		props: [{
			"data-index": Ae,
			children: /*#__PURE__*/ (0, G.jsxs)(C.Fragment, { children: [
				r,
				/*#__PURE__*/ (0, G.jsx)("input", {
					ref: qe,
					...Ke,
					suppressHydrationWarning: !0
				}),
				N && je && ae && (Xg ||= /*#__PURE__*/ (0, G.jsx)(Yg, { script: "" }))
			] }),
			id: S,
			onPointerDown(e) {
				if (fe) return;
				B.current = Ae;
				let t = fg(e.currentTarget, me);
				ie.current = (me ? e.clientY : e.clientX) - t;
			},
			style: Ue,
			suppressHydrationWarning: ae || void 0
		}, x],
		stateAttributesMapping: Qh
	});
});
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/slider/indicator/SliderIndicator.mjs
function t_(e, t, n, r, i, a) {
	let o = {
		visibility: a || n && (r === void 0 || t && i === void 0) ? "hidden" : void 0,
		position: e ? "absolute" : "relative",
		[e ? "width" : "height"]: "inherit"
	}, s = `${r ?? 0}%`, c = `${(i ?? 0) - (r ?? 0)}%`;
	return n && (o["--start-position"] = s, s = "var(--start-position)", t && (o["--relative-size"] = c, c = "var(--relative-size)")), o[e ? "bottom" : "insetInlineStart"] = t ? s : 0, o[e ? "height" : "width"] = t ? c : s, o;
}
var n_ = /*#__PURE__*/ C.forwardRef(function(e, t) {
	let { render: n, className: r, style: i, ...a } = e, { indicatorPosition: o, inset: s, max: c, min: l, orientation: u, renderBeforeHydration: d, state: f, values: p } = eg(), m = kg(), h = t_(u === "vertical", p.length > 1, s, s ? o[0] : Ag(p[0], l, c), s ? o[1] : Ag(p[p.length - 1], l, c), s && d && m);
	return Me("div", e, {
		state: f,
		ref: t,
		props: [{
			"data-base-ui-slider-indicator": d ? "" : void 0,
			style: h,
			suppressHydrationWarning: d || void 0
		}, a],
		stateAttributesMapping: Qh
	});
}), $ = {
	fast: {
		type: "spring",
		duration: .08,
		bounce: 0,
		exit: { duration: .06 }
	},
	moderate: {
		type: "spring",
		duration: .16,
		bounce: 0,
		exit: { duration: .12 }
	},
	slow: {
		type: "spring",
		duration: .24,
		bounce: .12,
		exit: { duration: .16 }
	}
}, r_ = 20, i_ = 16, a_ = 18, o_ = 4, s_ = 5, c_ = 1;
function l_(e, t, n, r) {
	if (n === t) return 0;
	let i = r - r_;
	return (e - t) / (n - t) * i;
}
function u_(e, t) {
	let n = 0;
	for (let r = 1; r < t.length; r++) Math.abs(t[r] - e) < Math.abs(t[n] - e) && (n = r);
	return n;
}
function d_(e, t, n, r, i, a = null) {
	let o = i - r_;
	if (o <= 0) return t;
	let s = e / o * (n - t) + t;
	if (a) return a[u_(s, a)];
	let c = Math.round((s - t) / r) * r + t;
	return Math.max(t, Math.min(n, c));
}
function f_(e) {
	return Array.isArray(e) ? e : [e];
}
function p_({ values: e, editingIndex: t, onStartEdit: n, onCommitEdit: r, onCancelEdit: i, min: a, max: o, step: s, stepValues: c, formatValue: l, label: u, isRange: d, isInteracting: f }) {
	let p = xn(), [m, h] = (0, C.useState)(""), g = (0, C.useRef)(null);
	(0, C.useEffect)(() => {
		t !== null && (h(String(e[t])), requestAnimationFrame(() => g.current?.select()));
	}, [t]);
	let _ = (0, C.useCallback)((e) => {
		let t = parseFloat(m);
		if (isNaN(t)) i();
		else {
			let n = Math.max(a, Math.min(o, t));
			r(e, c ? c[u_(n, c)] : Math.round((n - a) / s) * s + a);
		}
	}, [
		m,
		a,
		o,
		s,
		c,
		r,
		i
	]), v = (r) => t === r ? /* @__PURE__ */ (0, G.jsxs)("span", {
		className: "inline-grid text-[13px]",
		children: [/* @__PURE__ */ (0, G.jsxs)("span", {
			className: "col-start-1 row-start-1 invisible",
			style: { fontVariationSettings: si.medium },
			"aria-hidden": "true",
			children: [u ? `${u}: ` : "", l(o)]
		}), /* @__PURE__ */ (0, G.jsxs)("span", {
			className: "col-start-1 row-start-1 flex items-center gap-1",
			children: [u && /* @__PURE__ */ (0, G.jsxs)("span", {
				className: "text-muted-foreground",
				children: [u, ":"]
			}), /* @__PURE__ */ (0, G.jsx)("input", {
				ref: g,
				type: "number",
				value: m,
				min: a,
				max: o,
				step: c ? "any" : s,
				onChange: (e) => h(e.target.value),
				onBlur: () => _(r),
				onKeyDown: (e) => {
					e.key === "Enter" && _(r), e.key === "Escape" && i();
				},
				"aria-label": `Edit slider value${d ? r === 0 ? " (start)" : " (end)" : ""}`,
				className: _n("w-[5ch] bg-transparent text-foreground outline-none border-b border-border text-center", p.input),
				style: { fontVariationSettings: si.medium }
			})]
		})]
	}) : /* @__PURE__ */ (0, G.jsx)("span", {
		className: "cursor-text select-none",
		onClick: () => n(r),
		children: l(e[r])
	}), y = d ? `${u ? `${u}: ` : ""}${l(o)} — ${l(o)}` : `${u ? `${u}: ` : ""}${l(o)}`;
	return /* @__PURE__ */ (0, G.jsxs)("span", {
		className: _n("inline-grid shrink-0 text-[13px] leading-none text-muted-foreground transition-[font-variation-settings] duration-100", "tabular-nums"),
		style: { fontVariationSettings: f ? si.medium : si.normal },
		children: [/* @__PURE__ */ (0, G.jsx)("span", {
			className: "col-start-1 row-start-1 invisible whitespace-nowrap",
			style: { fontVariationSettings: si.medium },
			"aria-hidden": "true",
			children: y
		}), /* @__PURE__ */ (0, G.jsxs)("span", {
			className: "col-start-1 row-start-1 whitespace-nowrap",
			children: [u && t === null && /* @__PURE__ */ (0, G.jsxs)("span", {
				className: "text-muted-foreground",
				children: [u, ": "]
			}), d ? /* @__PURE__ */ (0, G.jsxs)(G.Fragment, { children: [
				v(0),
				/* @__PURE__ */ (0, G.jsx)("span", {
					className: "mx-1 text-muted-foreground/50",
					children: "—"
				}),
				v(1)
			] }) : v(0)]
		})]
	});
}
function m_({ value: e, formatValue: t, motionX: n }) {
	let r = xn(), i = oh(n, (e) => e + r_ / 2);
	return /* @__PURE__ */ (0, G.jsx)(nh.div, {
		className: "absolute -translate-x-1/2 pointer-events-none z-20",
		style: {
			x: i,
			top: -16
		},
		initial: {
			opacity: 0,
			y: 4
		},
		animate: {
			opacity: 1,
			y: 0
		},
		exit: {
			opacity: 0,
			y: 4,
			transition: $.fast.exit
		},
		transition: $.fast,
		children: /* @__PURE__ */ (0, G.jsx)("span", {
			className: _n("text-[12px] text-background tabular-nums whitespace-nowrap bg-foreground px-2 py-1", r.bg),
			style: { fontVariationSettings: si.medium },
			children: t(e)
		})
	});
}
var h_ = (0, C.forwardRef)(({ value: e, onChange: t, min: n = 0, max: r = 100, step: i = 1, steps: a, showSteps: o = !1, showValue: s = !0, valuePosition: c = "left", formatValue: l = String, label: u, disabled: d = !1, trackClassName: f, trackStyle: p, fillClassName: m, fillStyle: h, hideFill: g = !1, thumbColor: _, thumbBorderColor: v, className: y, ...b }, x) => {
	let S = Array.isArray(e), w = f_(e), T = xn(), E = a ? a.join(",") : "", D = (0, C.useMemo)(() => {
		if (!E) return null;
		let e = Array.from(new Set(E.split(",").map(Number))).sort((e, t) => e - t);
		return e.length > 1 ? e : null;
	}, [E]), O = D ? D[0] : n, k = D ? D[D.length - 1] : r, A = (0, C.useRef)(null), j = (0, C.useRef)(0), M = (0, C.useRef)(!1), N = (0, C.useRef)(0), P = (0, C.useRef)(w), ee = (0, C.useRef)(O), F = (0, C.useRef)(k);
	P.current = w, ee.current = O, F.current = k;
	let [I, te] = (0, C.useState)(!1), [ne, re] = (0, C.useState)(!1), [L, R] = (0, C.useState)(null), [z, ie] = (0, C.useState)(null), [B, ae] = (0, C.useState)(null), [oe, se] = (0, C.useState)(!1), ce = (0, C.useRef)(null);
	(0, C.useEffect)(() => (I ? ce.current = setTimeout(() => se(!0), 100) : (ce.current && clearTimeout(ce.current), se(!1)), () => {
		ce.current && clearTimeout(ce.current);
	}), [I]);
	let V = rh(0), le = rh(0), ue = oh(V, (e) => S ? e + r_ / 2 - c_ : 0), de = oh(V, (e) => e + r_ / 2 - c_), fe = oh([V, le], ([e, t]) => t - e), pe = S ? fe : de, me = oh(V, (e) => {
		let t = e + r_ / 2;
		return `linear-gradient(to right, transparent ${t}px, black ${t + 2}px)`;
	}), he = oh([V, le], ([e, t]) => {
		let n = e + r_ / 2, r = t + r_ / 2;
		return `linear-gradient(to right, black ${n - 2}px, transparent ${n}px, transparent ${r}px, black ${r + 2}px)`;
	}), ge = S ? he : me, _e = (0, C.useCallback)((e, t) => {
		let n = t - r_, r = e - r_ / 2, a = n > 0 ? Math.max(0, Math.min(n, r)) / n * (k - O) + O : O, o = D ? D[u_(a, D)] : Math.max(O, Math.min(k, Math.round((a - O) / i) * i + O)), s = k === O ? 0 : (o - O) / (k - O), c = r_ / 2 + s * n, l = V.get() + r_ / 2, u = le.get() + r_ / 2, d = S && !(Math.abs(c - l) <= Math.abs(c - u)) ? u : l, f = o === O ? 0 : o === k ? t : c, p = Math.min(d, f), m = Math.abs(f - d);
		ie({
			left: p,
			width: m,
			snappedValue: o,
			cursorX: c
		});
	}, [
		O,
		k,
		i,
		D,
		S,
		V,
		le
	]), ve = (0, C.useRef)(!1), [ye, be] = (0, C.useState)(!1);
	(0, C.useLayoutEffect)(() => {
		let e = A.current;
		if (!e || ve.current) return;
		let t = e.offsetWidth;
		j.current = t;
		let n = l_(w[0], O, k, t);
		if (V.set(n), S && w[1] !== void 0) {
			let e = l_(w[1], O, k, t);
			le.set(e);
		}
		ve.current = !0, be(!0);
	}, []), (0, C.useEffect)(() => {
		let e = A.current;
		if (!e) return;
		let t = new ResizeObserver(([e]) => {
			let t = e.contentRect.width;
			if (j.current = t, !M.current && ve.current) {
				let e = P.current, n = ee.current, r = F.current, i = l_(e[0], n, r, t);
				if (Nh(V, i, $.moderate), S && e[1] !== void 0) {
					let i = l_(e[1], n, r, t);
					Nh(le, i, $.moderate);
				}
			}
		});
		return t.observe(e), () => t.disconnect();
	}, [
		S,
		V,
		le
	]);
	let xe = w.join(",");
	(0, C.useEffect)(() => {
		if (!ve.current || M.current) return;
		let e = j.current;
		if (e <= 0) return;
		let t = P.current, n = l_(t[0], O, k, e);
		if (Nh(V, n, $.moderate), S && t[1] !== void 0) {
			let n = l_(t[1], O, k, e);
			Nh(le, n, $.moderate);
		}
	}, [
		xe,
		O,
		k,
		S,
		V,
		le
	]);
	let Se = (0, C.useCallback)((e, t) => S ? t === 0 ? Math.min(e, le.get() - r_ * .5) : Math.max(e, V.get() + r_ * .5) : e, [
		S,
		V,
		le
	]), Ce = (0, C.useCallback)((e, n) => {
		if (S) {
			let r = [...w];
			r[e] = n, t(r);
		} else t(n);
	}, [
		S,
		w,
		t
	]), we = (0, C.useCallback)((e) => {
		if (d || e.pointerType === "mouse" && e.button !== 0) return;
		e.preventDefault(), e.stopPropagation();
		let t = A.current;
		if (!t) return;
		let n = t.getBoundingClientRect(), r = t.offsetWidth;
		if (r <= 0 || n.width <= 0) return;
		let a = n.width / r, o = (e.clientX - n.left) / a - r_ / 2, s = Math.max(0, Math.min(r - r_, o));
		if (S) {
			let e = Math.abs(s - V.get()), t = Math.abs(s - le.get());
			N.current = e <= t ? 0 : 1;
		} else N.current = 0;
		M.current = !0, re(!0);
		let c = N.current === 0 ? V : le, l = l_(d_(s, O, k, i, r, D), O, k, r), u = Se(l, N.current);
		Nh(c, u, $.moderate);
		let f = d_(u, O, k, i, r, D);
		Ce(N.current, f), e.currentTarget.setPointerCapture(e.pointerId);
	}, [
		d,
		S,
		O,
		k,
		i,
		D,
		V,
		le,
		Se,
		Ce
	]), Te = (0, C.useCallback)((e) => {
		if (!M.current) return;
		e.stopPropagation();
		let t = A.current;
		if (!t) return;
		let n = t.getBoundingClientRect(), r = t.offsetWidth;
		if (r <= 0 || n.width <= 0) return;
		let a = n.width / r, o = (e.clientX - n.left) / a - r_ / 2, s = Math.max(0, Math.min(r - r_, o)), c = N.current === 0 ? V : le, l = l_(d_(s, O, k, i, r, D), O, k, r), u = Se(l, N.current);
		c.set(u);
		let d = d_(u, O, k, i, r, D);
		Ce(N.current, d);
	}, [
		O,
		k,
		i,
		D,
		V,
		le,
		Se,
		Ce
	]), Ee = (0, C.useCallback)(() => {
		if (!M.current) return;
		M.current = !1, re(!1), ie(null);
		let e = j.current, t = N.current === 0 ? V : le;
		Nh(t, l_(d_(t.get(), O, k, i, e, D), O, k, e), $.moderate);
	}, [
		O,
		k,
		i,
		D,
		V,
		le
	]), De = (0, C.useCallback)((e) => {
		if (M.current) return;
		let n = D ? e.map((e) => D[Math.round(e)]) : e;
		t(S ? n : n[0]);
	}, [
		S,
		t,
		D
	]), Oe = (0, C.useCallback)((e) => {
		R(e);
	}, []), ke = (0, C.useCallback)((e, t) => {
		Ce(e, t), R(null);
	}, [Ce]), Ae = (0, C.useCallback)(() => {
		R(null);
	}, []), je = (0, C.useMemo)(() => o ? D ? D.map((e) => ({
		value: e,
		percent: k === O ? 0 : (e - O) / (k - O)
	})) : Array.from({ length: Math.round((k - O) / i) + 1 }, (e, t) => {
		let n = O + t * i;
		return {
			value: n,
			percent: (n - O) / (k - O)
		};
	}) : [], [
		o,
		O,
		k,
		i,
		D
	]), Me = I || ne, Ne = (e) => S ? u ? e === 0 ? `${u} minimum` : `${u} maximum` : e === 0 ? "Minimum" : "Maximum" : u, Pe = s && c !== "tooltip" && /* @__PURE__ */ (0, G.jsx)(p_, {
		values: w,
		editingIndex: L,
		onStartEdit: Oe,
		onCommitEdit: ke,
		onCancelEdit: Ae,
		min: O,
		max: k,
		step: i,
		stepValues: D,
		formatValue: l,
		label: u,
		isRange: S,
		isInteracting: Me
	}), Fe = (e) => {
		let t = e === 0 ? V : le;
		return /* @__PURE__ */ (0, G.jsxs)(nh.span, {
			className: "flex items-center justify-center pointer-events-none",
			style: {
				width: r_,
				height: r_,
				marginTop: -10,
				x: t,
				position: "absolute",
				top: "50%",
				left: 0,
				zIndex: 10
			},
			initial: !1,
			children: [/* @__PURE__ */ (0, G.jsx)(nh.span, {
				className: "block rounded-full",
				initial: !1,
				animate: {
					width: i_,
					height: i_
				},
				transition: $.fast,
				style: {
					backgroundColor: _ ?? "white",
					boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
					border: v ? `1px solid ${v}` : void 0
				}
			}), /* @__PURE__ */ (0, G.jsx)(nh.span, {
				className: "absolute rounded-full border border-[color:var(--focus-ring,#6B97FF)] pointer-events-none",
				initial: !1,
				animate: {
					opacity: +(B === e),
					width: 24,
					height: 24
				},
				transition: $.fast
			})]
		}, `visual-thumb-${e}`);
	};
	return /* @__PURE__ */ (0, G.jsxs)("div", {
		ref: x,
		className: _n("flex flex-col gap-0 w-full select-none touch-none overflow-visible", c === "left" || c === "right" ? "flex-row items-center gap-2 mb-2" : "flex-col", d && "opacity-50 pointer-events-none", y),
		...b,
		children: [
			(c === "top" || c === "left") && Pe,
			/* @__PURE__ */ (0, G.jsxs)("div", {
				className: "relative flex-1 overflow-visible",
				style: {
					height: c === "left" || c === "right" ? 36 : r_ + (c === "tooltip" ? 16 : 0),
					paddingTop: c === "tooltip" ? 16 : 0
				},
				onPointerEnter: () => te(!0),
				onPointerLeave: () => {
					te(!1), ie(null);
				},
				onMouseMove: (e) => {
					if (M.current) return;
					let t = A.current;
					if (!t) return;
					let n = t.getBoundingClientRect(), r = t.offsetWidth;
					if (r <= 0 || n.width <= 0) return;
					let i = n.width / r, a = (e.clientX - n.left) / i;
					_e(Math.max(0, Math.min(r, a)), r);
				},
				children: [
					s && c === "tooltip" && /* @__PURE__ */ (0, G.jsxs)(up, { children: [Me && /* @__PURE__ */ (0, G.jsx)(m_, {
						value: w[0],
						formatValue: l,
						motionX: V
					}, "tooltip-0"), Me && S && w[1] !== void 0 && /* @__PURE__ */ (0, G.jsx)(m_, {
						value: w[1],
						formatValue: l,
						motionX: le
					}, "tooltip-1")] }),
					/* @__PURE__ */ (0, G.jsx)(ng, {
						value: D ? w.map((e) => u_(e, D)) : w,
						onValueChange: (e) => De(e),
						min: D ? 0 : O,
						max: D ? D.length - 1 : k,
						step: D ? 1 : i,
						disabled: d,
						className: "absolute inset-0 opacity-0 pointer-events-none",
						style: { height: r_ },
						children: /* @__PURE__ */ (0, G.jsxs)(bg, {
							className: "w-full h-full",
							children: [
								/* @__PURE__ */ (0, G.jsx)(xg, {
									className: "w-full h-full",
									children: /* @__PURE__ */ (0, G.jsx)(n_, {})
								}),
								/* @__PURE__ */ (0, G.jsx)(e_, {
									index: 0,
									"aria-label": Ne(0),
									getAriaValueText: D ? () => l(w[0]) : void 0,
									className: "block outline-none",
									style: {
										width: r_,
										height: r_
									},
									onFocus: (e) => {
										e.currentTarget.matches(":focus-visible") && ae(0);
									},
									onBlur: () => ae((e) => e === 0 ? null : e)
								}),
								S && /* @__PURE__ */ (0, G.jsx)(e_, {
									index: 1,
									"aria-label": Ne(1),
									getAriaValueText: D ? () => l(w[1]) : void 0,
									className: "block outline-none",
									style: {
										width: r_,
										height: r_
									},
									onFocus: (e) => {
										e.currentTarget.matches(":focus-visible") && ae(1);
									},
									onBlur: () => ae((e) => e === 1 ? null : e)
								})
							]
						})
					}),
					/* @__PURE__ */ (0, G.jsxs)("div", {
						ref: A,
						className: "relative w-full cursor-ew-resize py-2",
						style: {
							height: 36,
							opacity: +!!ye
						},
						onPointerDown: we,
						onPointerMove: Te,
						onPointerUp: Ee,
						onPointerCancel: Ee,
						children: [
							/* @__PURE__ */ (0, G.jsx)("div", {
								className: "absolute cursor-ew-resize",
								style: {
									left: -8,
									right: -8,
									top: 0,
									bottom: 0
								},
								onPointerDown: we,
								onPointerMove: Te,
								onPointerUp: Ee,
								onPointerCancel: Ee
							}),
							/* @__PURE__ */ (0, G.jsx)(up, { children: z && oe && !ne && c !== "tooltip" && /* @__PURE__ */ (0, G.jsx)(nh.div, {
								className: "absolute -translate-x-1/2 pointer-events-none z-20",
								initial: {
									opacity: 0,
									y: 4
								},
								animate: {
									opacity: 1,
									y: 0
								},
								exit: {
									opacity: 0,
									y: 4,
									transition: $.fast.exit
								},
								transition: $.fast,
								style: {
									left: z.cursorX,
									top: -20
								},
								children: /* @__PURE__ */ (0, G.jsx)("span", {
									className: _n("text-[12px] text-background tabular-nums whitespace-nowrap bg-foreground px-2 py-1", T.bg),
									style: { fontVariationSettings: si.medium },
									children: l(z.snappedValue)
								})
							}, "hover-tooltip") }),
							/* @__PURE__ */ (0, G.jsxs)(nh.div, {
								className: _n("absolute border border-border overflow-hidden rounded-full", f),
								initial: !1,
								animate: {
									height: a_,
									top: 9
								},
								transition: $.fast,
								style: {
									left: c_,
									right: c_,
									backgroundColor: "transparent",
									...p
								},
								children: [!g && /* @__PURE__ */ (0, G.jsx)(nh.div, {
									className: _n("absolute h-full bg-selected/50 dark:bg-accent/40", m),
									style: {
										left: ue,
										width: pe,
										...h
									}
								}), /* @__PURE__ */ (0, G.jsx)(nh.div, {
									className: "absolute h-full pointer-events-none z-[2]",
									initial: !1,
									animate: { opacity: z && !ne ? 1 : 0 },
									transition: { opacity: { duration: .15 } },
									style: {
										left: z ? z.left - c_ : 0,
										width: z ? z.width : 0,
										borderRadius: z && z.cursorX > z.left ? "0 9999px 9999px 0" : "9999px 0 0 9999px",
										backgroundColor: "color-mix(in srgb, var(--color-accent) 40%, transparent)"
									}
								})]
							}),
							je.length > 0 && /* @__PURE__ */ (0, G.jsx)(nh.div, {
								className: "absolute left-0 right-0 pointer-events-none",
								style: {
									top: 9,
									height: a_,
									WebkitMaskImage: ge,
									maskImage: ge
								},
								children: je.map(({ value: e, percent: t }) => /* @__PURE__ */ (0, G.jsx)("div", {
									className: "absolute pointer-events-none flex items-center justify-center",
									style: {
										left: `calc(${r_ / 2}px + ${t} * (100% - ${r_}px))`,
										top: "50%",
										width: 0,
										height: 0
									},
									children: /* @__PURE__ */ (0, G.jsx)(nh.div, {
										className: "rounded-full flex-shrink-0",
										initial: !1,
										animate: {
											width: I ? o_ * 1.25 : o_,
											height: I ? o_ * 1.25 : o_
										},
										transition: $.moderate,
										style: {
											backgroundColor: "var(--muted-foreground)",
											opacity: .3
										}
									})
								}, e))
							}),
							Fe(0),
							S && Fe(1)
						]
					})
				]
			}),
			(c === "bottom" || c === "right") && Pe
		]
	});
});
h_.displayName = "SliderCompact";
var g_ = (0, C.forwardRef)(({ value: e, onChange: t, min: n = 0, max: r = 100, step: i = 1, variant: a = "pips", label: o, formatValue: s = String, disabled: c = !1, className: l, ...u }, d) => {
	let f = (0, C.useRef)(null), p = (0, C.useRef)(!1), m = (0, C.useRef)(!1), [h, g] = (0, C.useState)(!1), [_, v] = (0, C.useState)(!1), [y, b] = (0, C.useState)(!1), [x, S] = (0, C.useState)(null), [w, T] = (0, C.useState)(!1), E = (0, C.useRef)(null), D = xn();
	(0, C.useEffect)(() => (h ? E.current = setTimeout(() => T(!0), 100) : (E.current && clearTimeout(E.current), T(!1)), () => {
		E.current && clearTimeout(E.current);
	}), [h]);
	let O = (0, C.useCallback)((e) => {
		f.current = e, typeof d == "function" ? d(e) : d && (d.current = e);
	}, [d]), k = (0, C.useMemo)(() => Array.from({ length: Math.round((r - n) / i) + 1 }, (e, t) => n + t * i), [
		n,
		r,
		i
	]), A = k.length, j = rh(r === n ? 0 : Math.max(0, Math.min(1, (e - n) / (r - n)))), M = a === "pips" ? 8 : 17, N = rh(e === n ? M : 0), P = oh(j, (e) => `${e * 100}%`), ee = oh([j, N], ([e, t]) => `calc(${e * 100}% - 8px + ${t}px)`), F = oh([j, N], ([e, t]) => `calc(${e * 100}% - 9px + ${t}px)`), I = oh([j, N], ([e, t]) => `calc(${e * 100}% + ${20 - 20 * e - t * 2.5}px)`), te = oh(j, (e) => `calc(${e * 100}% + ${11 - 24 * e}px)`), ne = oh([j, N], ([e, t]) => {
		let n = 20 - 20 * e - t * 2.5;
		return `linear-gradient(to right, transparent calc(${e * 100}% + ${n}px), black calc(${e * 100}% + ${n + 2}px))`;
	}), re = (0, C.useCallback)((e) => {
		let t = f.current;
		if (!t) return;
		let o = t.getBoundingClientRect(), s = t.clientWidth;
		if (s <= 0 || o.width <= 0) return;
		let c = o.width / t.offsetWidth, l = (t.offsetWidth - s) / 2, u = (e - o.left) / c - l, d = Math.max(0, Math.min(s, u)), p;
		if (a === "pips") {
			if (A <= 1) return;
			let e = Math.max(0, Math.min(A - 1, Math.round(d / s * (A - 1))));
			p = k[e];
		} else {
			let e = n + d / s * (r - n);
			p = Math.max(n, Math.min(r, Math.round((e - n) / i) * i + n));
		}
		let m = (r === n ? 0 : (p - n) / (r - n)) * s, h = j.get(), g;
		if (a === "pips") {
			let e = N.get();
			g = h * s + (20 - 20 * h - e * 2.5);
		} else g = h * s;
		let _ = p === n ? 0 : p === r ? s : m, v = Math.min(g, _), y = Math.abs(_ - g);
		S({
			left: v,
			width: y,
			snappedValue: p,
			cursorX: m
		});
	}, [
		a,
		k,
		A,
		n,
		r,
		i,
		j,
		N
	]);
	(0, C.useEffect)(() => {
		if (p.current || m.current) return;
		let t = r === n ? 0 : Math.max(0, Math.min(1, (e - n) / (r - n)));
		Nh(j, t, $.fast), Nh(N, e === n ? M : 0, $.fast);
	}, [
		e,
		n,
		r,
		a,
		j,
		N,
		M
	]);
	let L = (0, C.useCallback)((e) => {
		let t = f.current?.getBoundingClientRect();
		if (!t) return n;
		let o = e - t.left, s = Math.max(0, Math.min(t.width, o));
		if (a === "pips") {
			if (A <= 1) return n;
			let e = Math.max(0, Math.min(A - 1, Math.round(s / t.width * (A - 1))));
			return k[e];
		}
		{
			let e = n + s / t.width * (r - n), a = Math.round((e - n) / i) * i + n;
			return Math.max(n, Math.min(r, a));
		}
	}, [
		a,
		k,
		A,
		n,
		r,
		i
	]), R = (0, C.useCallback)((e) => {
		if (c || e.pointerType === "mouse" && e.button !== 0) return;
		e.preventDefault(), p.current = !0, v(!0);
		let i = L(e.clientX);
		t(i);
		let a = Math.max(0, Math.min(1, (i - n) / (r - n)));
		Nh(j, a, $.fast), Nh(N, i === n ? M : 0, $.fast), e.currentTarget.setPointerCapture(e.pointerId);
	}, [
		c,
		L,
		t,
		j,
		N,
		M,
		n,
		r
	]), z = (0, C.useCallback)((e) => {
		if (!p.current) return;
		let i = L(e.clientX);
		t(i);
		let o = Math.max(0, Math.min(1, (i - n) / (r - n)));
		a === "scrubber" ? j.set(o) : Nh(j, o, $.fast), Nh(N, i === n ? M : 0, $.fast);
	}, [
		L,
		t,
		a,
		j,
		N,
		M,
		n,
		r
	]), ie = (0, C.useCallback)(() => {
		p.current = !1, v(!1), S(null);
	}, []), B = (0, C.useCallback)((e) => {
		if (c || e.pointerType === "mouse" && e.button !== 0) return;
		e.preventDefault(), e.stopPropagation(), m.current = !0, v(!0);
		let i = L(e.clientX);
		t(i), j.set(Math.max(0, Math.min(1, (i - n) / (r - n)))), Nh(N, i === n ? M : 0, $.fast), e.currentTarget.setPointerCapture(e.pointerId);
	}, [
		c,
		L,
		t,
		j,
		N,
		M,
		n,
		r
	]), ae = (0, C.useCallback)((e) => {
		if (!m.current) return;
		let i = L(e.clientX);
		t(i), j.set(Math.max(0, Math.min(1, (i - n) / (r - n)))), Nh(N, i === n ? M : 0, $.fast);
	}, [
		L,
		t,
		j,
		N,
		M,
		n,
		r
	]), oe = (0, C.useCallback)(() => {
		m.current = !1, v(!1), S(null);
	}, []), se = (0, C.useCallback)((e) => {
		t(e[0]);
	}, [t]), ce = h || y;
	return /* @__PURE__ */ (0, G.jsxs)("div", {
		className: "relative w-full touch-none",
		onPointerEnter: () => {
			c || g(!0);
		},
		onPointerLeave: () => {
			c || (g(!1), S(null));
		},
		onMouseMove: (e) => {
			c || p.current || m.current || re(e.clientX);
		},
		children: [
			/* @__PURE__ */ (0, G.jsx)("div", {
				className: "absolute cursor-ew-resize",
				style: {
					left: -8,
					right: -8,
					top: 0,
					bottom: 0
				},
				onPointerDown: R,
				onPointerMove: z,
				onPointerUp: ie,
				onPointerCancel: ie
			}),
			/* @__PURE__ */ (0, G.jsx)(up, { children: x && w && !_ && /* @__PURE__ */ (0, G.jsx)(nh.div, {
				className: "absolute -translate-x-1/2 pointer-events-none z-20",
				initial: {
					opacity: 0,
					y: 4
				},
				animate: {
					opacity: 1,
					y: 0
				},
				exit: {
					opacity: 0,
					y: 4,
					transition: $.fast.exit
				},
				transition: $.fast,
				style: {
					left: x.cursorX,
					top: -30
				},
				children: /* @__PURE__ */ (0, G.jsx)("span", {
					className: _n("text-[12px] text-background tabular-nums whitespace-nowrap bg-foreground px-2 py-1", D.bg),
					style: { fontVariationSettings: si.medium },
					children: s(x.snappedValue)
				})
			}, "hover-tooltip") }),
			/* @__PURE__ */ (0, G.jsxs)(nh.div, {
				ref: O,
				className: _n("relative w-full select-none touch-none border border-border overflow-hidden outline-offset-2", a === "scrubber" ? "h-9 flex items-center gap-3 px-3.5 cursor-ew-resize" : "h-8 cursor-ew-resize", D.bg, c && "opacity-50 pointer-events-none", l),
				initial: !1,
				animate: { outline: y ? "1px solid var(--focus-ring, #6B97FF)" : "1px solid transparent" },
				transition: $.fast,
				onPointerDown: R,
				onPointerMove: z,
				onPointerUp: ie,
				onPointerCancel: ie,
				...u,
				children: [
					/* @__PURE__ */ (0, G.jsx)(ng, {
						value: [e],
						onValueChange: (e) => se(e),
						min: n,
						max: r,
						step: i,
						disabled: c,
						className: "absolute inset-0 opacity-0 pointer-events-none [&_*]:pointer-events-none",
						children: /* @__PURE__ */ (0, G.jsxs)(bg, {
							className: "w-full h-full",
							children: [/* @__PURE__ */ (0, G.jsx)(xg, {
								className: "w-full h-full",
								children: /* @__PURE__ */ (0, G.jsx)(n_, {})
							}), /* @__PURE__ */ (0, G.jsx)(e_, {
								index: 0,
								"aria-label": o,
								className: "block outline-none",
								onFocus: (e) => {
									e.currentTarget.matches(":focus-visible") && b(!0);
								},
								onBlur: () => b(!1)
							})]
						})
					}),
					/* @__PURE__ */ (0, G.jsx)(nh.div, {
						className: "absolute inset-y-0 pointer-events-none z-[3]",
						initial: !1,
						animate: { opacity: x && !_ ? 1 : 0 },
						transition: { opacity: { duration: .15 } },
						style: {
							left: x ? x.left : 0,
							width: x ? x.width : 0,
							backgroundColor: "color-mix(in srgb, var(--color-accent) 40%, transparent)"
						}
					}),
					a === "pips" && /* @__PURE__ */ (0, G.jsx)(nh.div, {
						className: "absolute inset-0 flex justify-between items-center px-3 pointer-events-none z-[1]",
						style: {
							WebkitMaskImage: ne,
							maskImage: ne
						},
						children: k.map((t) => {
							let n = t === e;
							return /* @__PURE__ */ (0, G.jsx)("div", {
								className: "relative flex items-center justify-center",
								style: {
									width: s_,
									height: s_
								},
								children: /* @__PURE__ */ (0, G.jsx)(nh.div, {
									className: "rounded-full",
									initial: !1,
									animate: {
										backgroundColor: n ? "var(--foreground)" : "var(--muted-foreground)",
										opacity: n ? 1 : .3
									},
									transition: $.fast,
									style: {
										width: s_,
										height: s_
									}
								})
							}, t);
						})
					}),
					a === "pips" && /* @__PURE__ */ (0, G.jsxs)("div", {
						className: "absolute inset-0 flex items-center px-2 z-[2] pointer-events-none",
						"aria-hidden": !0,
						children: [o && /* @__PURE__ */ (0, G.jsx)("span", {
							className: "text-[13px] px-2 bg-background text-transparent select-none",
							children: o
						}), /* @__PURE__ */ (0, G.jsx)("span", {
							className: "text-[13px] tabular-nums ml-auto px-2 bg-background text-transparent select-none",
							style: { minWidth: `${String(s(r)).length}ch` },
							children: s(e)
						})]
					}),
					a === "pips" && /* @__PURE__ */ (0, G.jsx)(nh.div, {
						className: "absolute left-0 top-0 bottom-0 pointer-events-none z-[3]",
						style: {
							width: I,
							backgroundColor: "var(--active)"
						}
					}),
					a === "pips" && /* @__PURE__ */ (0, G.jsx)(nh.div, {
						className: "absolute rounded-full pointer-events-none z-[3]",
						initial: !1,
						animate: {
							top: ce ? 7 : 8,
							bottom: ce ? 7 : 8,
							backgroundColor: y ? "var(--foreground)" : h ? "color-mix(in srgb, var(--foreground) 50%, transparent)" : "color-mix(in srgb, var(--foreground) 25%, transparent)"
						},
						transition: $.fast,
						style: {
							left: te,
							width: 2
						}
					}),
					a === "pips" && /* @__PURE__ */ (0, G.jsxs)("div", {
						className: "absolute inset-0 flex items-center px-2 z-[4] pointer-events-none",
						children: [o && /* @__PURE__ */ (0, G.jsx)(nh.span, {
							className: "text-[13px] px-2",
							initial: !1,
							animate: { color: ce ? "var(--foreground)" : "var(--muted-foreground)" },
							transition: $.fast,
							children: o
						}), /* @__PURE__ */ (0, G.jsx)(nh.span, {
							className: "text-[13px] tabular-nums ml-auto px-2",
							initial: !1,
							animate: { color: ce ? "var(--foreground)" : "var(--muted-foreground)" },
							transition: $.fast,
							style: {
								minWidth: `${String(s(r)).length}ch`,
								textAlign: "right"
							},
							children: s(e)
						})]
					}),
					a === "scrubber" && /* @__PURE__ */ (0, G.jsx)(nh.div, {
						className: "absolute left-0 top-0 bottom-0 pointer-events-none",
						style: {
							width: P,
							backgroundColor: "var(--active)"
						}
					}),
					a === "scrubber" && /* @__PURE__ */ (0, G.jsx)(nh.div, {
						className: "absolute rounded-full pointer-events-none z-10",
						initial: !1,
						animate: {
							top: ce ? 7 : 8,
							bottom: ce ? 7 : 8,
							backgroundColor: y ? "var(--foreground)" : h ? "color-mix(in srgb, var(--foreground) 50%, transparent)" : "color-mix(in srgb, var(--foreground) 25%, transparent)"
						},
						transition: $.fast,
						style: {
							left: F,
							width: 2
						}
					}),
					a === "scrubber" && o && /* @__PURE__ */ (0, G.jsx)(nh.span, {
						className: "text-[13px] shrink-0 z-10",
						initial: !1,
						animate: { color: ce ? "var(--foreground)" : "var(--muted-foreground)" },
						transition: $.fast,
						children: o
					}),
					a === "scrubber" && /* @__PURE__ */ (0, G.jsxs)(G.Fragment, { children: [/* @__PURE__ */ (0, G.jsx)("div", { className: "flex-1" }), /* @__PURE__ */ (0, G.jsx)(nh.span, {
						className: "text-[13px] shrink-0 tabular-nums text-right z-10",
						initial: !1,
						animate: { color: ce ? "var(--foreground)" : "var(--muted-foreground)" },
						transition: $.fast,
						style: { minWidth: `${String(s(r)).length}ch` },
						children: s(e)
					})] }),
					a === "scrubber" && /* @__PURE__ */ (0, G.jsx)(nh.div, {
						className: "absolute top-0 bottom-0 w-2 cursor-ew-resize z-20",
						style: { left: ee },
						onPointerDown: B,
						onPointerMove: ae,
						onPointerUp: oe,
						onPointerCancel: oe
					})
				]
			})
		]
	});
});
g_.displayName = "SliderComfortable";
var __ = (0, C.forwardRef)(({ size: e, variant: t = "pips", ...n }, r) => {
	let i = Tn(e), a = Array.isArray(n.value) || n.steps !== void 0 || n.showSteps !== void 0 || n.showValue !== void 0 || n.valuePosition !== void 0 || n.trackClassName !== void 0 || n.trackStyle !== void 0 || n.fillClassName !== void 0 || n.fillStyle !== void 0 || n.hideFill !== void 0 || n.thumbColor !== void 0 || n.thumbBorderColor !== void 0;
	if (i === "compact" || a) return /* @__PURE__ */ (0, G.jsx)(h_, {
		ref: r,
		...n
	});
	let { value: o, onChange: s, min: c, max: l, step: u, label: d, formatValue: f, disabled: p, steps: m, showSteps: h, showValue: g, valuePosition: _, trackClassName: v, trackStyle: y, fillClassName: b, fillStyle: x, hideFill: S, thumbColor: C, thumbBorderColor: w, ...T } = n;
	return /* @__PURE__ */ (0, G.jsx)(g_, {
		ref: r,
		value: o,
		onChange: s,
		min: c,
		max: l,
		step: u,
		variant: t,
		label: d,
		formatValue: f,
		disabled: p,
		...T
	});
});
__.displayName = "Slider";
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/tabs/root/TabsRootContext.mjs
var v_ = /*#__PURE__*/ C.createContext(void 0);
function y_() {
	let e = C.useContext(v_);
	if (e === void 0) throw Error(V(64));
	return e;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/tabs/root/stateAttributesMapping.mjs
var b_ = { tabActivationDirection: (e) => ({ "data-activation-direction": e }) }, x_ = /*#__PURE__*/ C.forwardRef(function(e, t) {
	let { className: n, defaultValue: r = 0, onValueChange: i, orientation: a = "horizontal", render: o, value: s, style: c, ...l } = e, u = e.defaultValue !== void 0, d = C.useRef([]), [f, p] = C.useState(() => /* @__PURE__ */ new Map()), [m, h] = Jr({
		controlled: s,
		default: r,
		name: "Tabs",
		state: "value"
	}), g = s !== void 0, [_, v] = C.useState(() => /* @__PURE__ */ new Map()), y = C.useRef(void 0), b = C.useCallback((e) => S_(_, e), [_]), [x, S] = C.useState(() => ({
		previousValue: m,
		tabActivationDirection: "none"
	})), { previousValue: w, tabActivationDirection: T } = x, E = T, D = !1;
	w !== m && (E = C_(w, m, a, _), D = w != null && m != null && b(m) == null);
	let O = D ? w : m, A = w !== O || T !== E;
	M(() => {
		A && S({
			previousValue: O,
			tabActivationDirection: E
		});
	}, [
		O,
		A,
		E
	]);
	let j = k((e, t) => {
		t.activationDirection = C_(m, e, a, _), i?.(e, t), !t.isCanceled && h(e);
	}), N = k((e, t) => {
		i?.(e, ii(t, void 0, void 0, { activationDirection: "none" }));
	}), P = k((e, t) => (p((n) => {
		let r = new Map(n);
		return r.set(e, t), r;
	}), () => {
		p((n) => {
			if (n.get(e) !== t) return n;
			let r = new Map(n);
			return r.delete(e), r;
		});
	})), ee = C.useCallback((e) => f.get(e), [f]), F = C.useCallback((e) => {
		for (let t of _.values()) if (e === t.value) return t.id;
	}, [_]), I = C.useMemo(() => ({
		getTabElementBySelectedValue: b,
		getTabIdByPanelValue: F,
		getTabPanelIdByValue: ee,
		onValueChange: j,
		orientation: a,
		registerMountedTabPanel: P,
		setTabMap: v,
		tabActivationDirection: E,
		value: m
	}), [
		b,
		F,
		ee,
		j,
		a,
		P,
		v,
		E,
		m
	]), te = C.useMemo(() => {
		for (let e of _.values()) if (e.value === m) return e;
	}, [_, m]), ne = C.useMemo(() => {
		for (let e of _.values()) if (!e.disabled) return e.value;
	}, [_]), re = C.useRef(!u), L = C.useRef(r), R = C.useRef(u), z = C.useRef(!1);
	M(() => {
		if (g) return;
		function e(e, t) {
			h(e), S({
				previousValue: e,
				tabActivationDirection: "none"
			}), N(e, t), re.current = !1;
		}
		if (_.size === 0) {
			z.current && m !== null && !y.current?.isConnected && e(null, ni);
			return;
		}
		z.current = !0, y.current = _.keys().next().value;
		let t = te?.disabled, n = te == null && m !== null;
		if (!t && m === L.current && (R.current = !1), R.current && t && m === L.current) return;
		let r = re.current;
		if (t || n) {
			let n = ne ?? null;
			if (m === n) {
				re.current = !1;
				return;
			}
			let i = ni;
			r ? i = ri : t && (i = ti), e(n, i);
			return;
		}
		r && te != null && (N(m, ri), re.current = !1);
	}, [
		ne,
		g,
		N,
		te,
		h,
		_,
		m
	]);
	let ie = Me("div", e, {
		state: {
			orientation: a,
			tabActivationDirection: E
		},
		ref: t,
		props: l,
		stateAttributesMapping: b_
	});
	return /*#__PURE__*/ (0, G.jsx)(v_.Provider, {
		value: I,
		children: /*#__PURE__*/ (0, G.jsx)(zh, {
			elementsRef: d,
			children: ie
		})
	});
});
function S_(e, t) {
	for (let [n, r] of e.entries()) if (t === r.value) return n;
	return null;
}
function C_(e, t, n, r) {
	if (e == null || t == null) return "none";
	let [i, a, o] = n === "horizontal" ? [
		"left",
		"left",
		"right"
	] : [
		"top",
		"up",
		"down"
	], s = S_(r, e), c = S_(r, t);
	if (s == null || c == null) return s !== c && (typeof e == "number" || typeof e == "string") && typeof e == typeof t ? t > e ? o : a : "none";
	let l = s.getBoundingClientRect()[i], u = c.getBoundingClientRect()[i];
	return u < l ? a : u > l ? o : "none";
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/composite/constants.mjs
var w_ = "data-composite-item-active";
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/composite/item/useCompositeItem.mjs
function T_(e = {}) {
	let { highlightItemOnHover: t, highlightedIndex: n, onHighlightedIndexChange: r } = ue(), { ref: i, index: a } = Gg(e), o = n === a, s = C.useRef(null), c = _e(i, s);
	return {
		compositeProps: {
			tabIndex: o ? 0 : -1,
			onFocus() {
				r(a);
			},
			onMouseMove() {
				let e = s.current;
				if (!t || !e) return;
				let n = e.hasAttribute("disabled") || e.ariaDisabled === "true";
				!o && !n && e.focus();
			}
		},
		compositeRef: c,
		index: a
	};
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/tabs/list/TabsListContext.mjs
var E_ = /*#__PURE__*/ C.createContext(void 0);
function D_() {
	let e = C.useContext(E_);
	if (e === void 0) throw Error(V(65));
	return e;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/tabs/tab/TabsTab.mjs
var O_ = /*#__PURE__*/ C.forwardRef(function(e, t) {
	let { className: n, disabled: r = !1, render: i, value: a, id: o, nativeButton: s = !0, style: c, ...l } = e, { value: u, getTabPanelIdByValue: d, onValueChange: f, orientation: p, tabActivationDirection: m } = y_(), { activateOnFocus: h, registerTabResizeObserverElement: g, tabsListElement: _ } = D_(), { highlightedIndex: v, onHighlightedIndexChange: y } = ue(), b = qn(o), { compositeProps: x, compositeRef: S, index: w } = T_({ metadata: C.useMemo(() => ({
		disabled: r,
		id: b,
		value: a
	}), [
		r,
		b,
		a
	]) }), T = a === u, E = C.useRef(!1), D = C.useRef(null), O = k((e) => {
		D.current?.(), D.current = e ? g(e) : null;
	});
	M(() => {
		if (E.current) {
			E.current = !1;
			return;
		}
		if (!(T && w > -1 && v !== w)) return;
		let e = _;
		if (e != null) {
			let t = ir(fe(e));
			if (t && ar(e, t)) return;
		}
		r || y(w);
	}, [
		T,
		w,
		v,
		y,
		r,
		_
	]);
	let { getButtonProps: A, buttonRef: j } = me({
		disabled: r,
		native: s,
		focusableWhenDisabled: !0
	}), N = d(a), P = C.useRef(!1), ee = C.useRef(!1);
	function F(e) {
		f(a, ii(Xr, e.nativeEvent, void 0, { activationDirection: "none" }));
	}
	function I(e) {
		T || r || F(e);
	}
	function te(e) {
		T || r || h && (!P.current || ee.current) && F(e);
	}
	function ne(e) {
		if (T || r) return;
		P.current = !0, ee.current = e.button === 0;
		let t = fe(e.currentTarget);
		function n() {
			P.current = !1, ee.current = !1, t.removeEventListener("pointerup", n), t.removeEventListener("pointercancel", n);
		}
		t.addEventListener("pointerup", n), t.addEventListener("pointercancel", n);
	}
	return Me("button", e, {
		state: {
			disabled: r,
			active: T,
			orientation: p,
			tabActivationDirection: m
		},
		ref: [
			t,
			j,
			S,
			O
		],
		props: [
			x,
			{
				role: "tab",
				"aria-controls": N,
				"aria-selected": T,
				id: b,
				onClick: I,
				onFocus: te,
				onPointerDown: ne,
				[w_]: T ? "" : void 0,
				onKeyDownCapture() {
					E.current = !0;
				}
			},
			l,
			A
		],
		stateAttributesMapping: b_
	});
});
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/inertValue.mjs
function k_(e) {
	return we(19) ? e : e ? "true" : void 0;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/tabs/panel/TabsPanel.mjs
var A_ = {
	...b_,
	...Wr
}, j_ = /*#__PURE__*/ C.forwardRef(function(e, t) {
	let { className: n, value: r, render: i, keepMounted: a = !1, style: o, ...s } = e, { value: c, getTabIdByPanelValue: l, orientation: u, tabActivationDirection: d, registerMountedTabPanel: f } = y_(), p = qn(), { ref: m, index: h } = Gg(), g = r === c, { mounted: _, transitionStatus: v, setMounted: y } = Gr(g), b = !_, x = l(r), S = {
		hidden: b,
		orientation: u,
		tabActivationDirection: d,
		transitionStatus: v
	}, w = C.useRef(null), T = Me("div", e, {
		state: S,
		ref: [
			t,
			m,
			w
		],
		props: [{
			"aria-labelledby": x,
			hidden: b,
			id: p,
			role: "tabpanel",
			tabIndex: g ? 0 : -1,
			inert: k_(!g),
			"data-index": h
		}, s],
		stateAttributesMapping: A_
	});
	return Vr({
		open: g,
		ref: w,
		onComplete() {
			g || y(!1);
		}
	}), M(() => {
		if (!(p == null || b && !a)) return f(r, p);
	}, [
		b,
		a,
		r,
		p,
		f
	]), a || _ ? T : null;
});
//#endregion
//#region node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/isElementDisabled.mjs
function M_(e) {
	return e == null || e.hasAttribute("disabled") || e.getAttribute("aria-disabled") === "true";
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/composite/root/useCompositeRoot.mjs
var N_ = [];
function P_(e) {
	let { loopFocus: t = !0, orientation: n = "both", grid: r, onLoop: i, direction: a, highlightedIndex: o, onHighlightedIndexChange: s, rootRef: c, enableHomeAndEndKeys: l = !1, stopEventPropagation: u, disabledIndices: d, modifierKeys: f = N_ } = e, [p, m] = C.useState(0), h = r != null, g = C.useRef(null), _ = _e(g, c), v = C.useRef([]), y = C.useRef(!1), b = o ?? p, x = k((e, t = !1) => {
		if ((s ?? m)(e), t) {
			let t = v.current[e];
			Hg(g.current, t, a, n);
		}
	}), S = k((e) => {
		if (e.size === 0 || y.current) return;
		y.current = !0;
		let t = Array.from(e.keys()), r = t.find((e) => e?.hasAttribute("data-composite-item-active")) ?? null, i = r ? e.get(r)?.index ?? -1 : -1;
		if (i !== -1) x(i);
		else if (fr(t, b, d)) {
			let e = dr(t, { disabledIndices: d });
			cr(t, e) || x(e);
		}
		Hg(g.current, r, a, n);
	});
	M(() => {
		if (d == null || o != null || !y.current) return;
		let e = v.current;
		if (fr(e, b, d)) {
			let t = dr(e, { disabledIndices: d });
			cr(e, t) || x(t);
		}
	}, [
		d,
		o,
		b,
		v,
		x
	]);
	let w = k((e, t, n) => i ? i(e, t, n, v) : n), T = k((e) => {
		let o = e.key === "Home" || e.key === "End";
		if (!Rg.has(e.key) || !l && o || F_(e, f) || !g.current) return;
		let s = a === "rtl", c = s ? Ng : Pg, p = s ? Pg : Ng, m = n === "vertical" ? Mg : c, _ = n === "vertical" ? jg : p, y = or(e.nativeEvent);
		if (y != null && Vg(y) && !M_(y)) {
			let t = y.selectionStart, n = y.selectionEnd, r = y.value;
			if (t == null || e.shiftKey || t !== n || e.key !== _ && t < r.length || e.key !== m && t > 0) return;
		}
		let S = b, C = lr(v, d), T = ur(v, d);
		r != null && (S = r({
			disabledIndices: d,
			elementsRef: v,
			event: e,
			highlightedIndex: b,
			loopFocus: t,
			maxIndex: T,
			minIndex: C,
			onLoop: w,
			orientation: n,
			rtl: s
		}));
		let E = n !== "vertical" && e.key === c || n !== "horizontal" && e.key === "ArrowDown", D = n !== "vertical" && e.key === p || n !== "horizontal" && e.key === "ArrowUp";
		l && (e.key === "Home" ? S = C : e.key === "End" && (S = T)), S === b && (E || D) && (t && S === T && E ? (S = C, i && (S = i(e, b, S, v))) : t && S === C && D ? (S = T, i && (S = i(e, b, S, v))) : S = dr(v.current, {
			startingIndex: S,
			decrement: D,
			disabledIndices: d
		})), S !== b && !cr(v.current, S) && (u && e.stopPropagation(), (h || o || E || D) && e.preventDefault(), x(S, !0), queueMicrotask(() => {
			v.current[S]?.focus();
		}));
	});
	return {
		props: {
			ref: _,
			onFocus(e) {
				let t = g.current, n = or(e.nativeEvent);
				!t || n == null || !Vg(n) || n.setSelectionRange(0, n.value.length);
			},
			onKeyDown: T
		},
		highlightedIndex: b,
		onHighlightedIndexChange: x,
		elementsRef: v,
		onMapChange: S,
		relayKeyboardEvent: T
	};
}
function F_(e, t) {
	for (let n of zg) if (!t.includes(n) && e.getModifierState(n)) return !0;
	return !1;
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/composite/root/CompositeRoot.mjs
function I_(e) {
	let { render: t, className: n, style: r, refs: i = De, props: a = De, state: o = Oe, stateAttributesMapping: s, highlightedIndex: c, onHighlightedIndexChange: l, orientation: u, grid: d, loopFocus: f, onLoop: p, enableHomeAndEndKeys: m, onMapChange: h, stopEventPropagation: g = !0, rootRef: _, disabledIndices: v, modifierKeys: y, highlightItemOnHover: b = !1, tag: x = "div", ...S } = e, { props: w, highlightedIndex: T, onHighlightedIndexChange: E, elementsRef: D, onMapChange: O, relayKeyboardEvent: k } = P_({
		grid: d,
		loopFocus: f,
		onLoop: p,
		orientation: u,
		highlightedIndex: c,
		onHighlightedIndexChange: l,
		rootRef: _,
		stopEventPropagation: g,
		enableHomeAndEndKeys: m,
		direction: dg(),
		disabledIndices: v,
		modifierKeys: y
	}), A = Me(x, e, {
		state: o,
		ref: i,
		props: [
			w,
			...a,
			S
		],
		stateAttributesMapping: s
	}), j = C.useMemo(() => ({
		highlightedIndex: T,
		onHighlightedIndexChange: E,
		highlightItemOnHover: b,
		relayKeyboardEvent: k
	}), [
		T,
		E,
		b,
		k
	]);
	return /*#__PURE__*/ (0, G.jsx)(le.Provider, {
		value: j,
		children: /*#__PURE__*/ (0, G.jsx)(zh, {
			elementsRef: D,
			onMapChange: (e) => {
				h?.(e), O(e);
			},
			children: A
		})
	});
}
//#endregion
//#region node_modules/.pnpm/@base-ui+react@1.7.0_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/tabs/list/TabsList.mjs
var L_ = /*#__PURE__*/ C.forwardRef(function(e, t) {
	let { activateOnFocus: n = !1, className: r, loopFocus: i = !0, render: a, style: o, ...s } = e, { orientation: c, setTabMap: l, tabActivationDirection: u } = y_(), [d, f] = C.useState(0), [p, m] = C.useState(null), h = C.useRef(/* @__PURE__ */ new Set()), g = C.useRef(/* @__PURE__ */ new Set()), _ = C.useRef(null);
	M(() => {
		if (typeof ResizeObserver > "u") return;
		let e = new ResizeObserver(() => {
			h.current.forEach((e) => {
				e();
			});
		});
		return _.current = e, p && e.observe(p), g.current.forEach((t) => {
			e.observe(t);
		}), () => {
			e.disconnect(), _.current = null;
		};
	}, [p]);
	let v = k((e) => (h.current.add(e), () => {
		h.current.delete(e);
	})), y = k((e) => (g.current.add(e), _.current?.observe(e), () => {
		g.current.delete(e), _.current?.unobserve(e);
	})), b = {
		orientation: c,
		tabActivationDirection: u
	}, x = {
		"aria-orientation": c === "vertical" ? "vertical" : void 0,
		role: "tablist"
	}, S = C.useMemo(() => ({
		activateOnFocus: n,
		registerIndicatorUpdateListener: v,
		registerTabResizeObserverElement: y,
		tabsListElement: p
	}), [
		n,
		v,
		y,
		p
	]);
	return /*#__PURE__*/ (0, G.jsx)(E_.Provider, {
		value: S,
		children: /*#__PURE__*/ (0, G.jsx)(I_, {
			render: a,
			className: r,
			style: o,
			state: b,
			refs: [t, m],
			props: [x, s],
			stateAttributesMapping: b_,
			highlightedIndex: d,
			enableHomeAndEndKeys: !0,
			loopFocus: i,
			orientation: c,
			onHighlightedIndexChange: f,
			onMapChange: l,
			disabledIndices: De
		})
	});
}), R_ = (0, C.createContext)(1);
function z_() {
	return (0, C.useContext)(R_);
}
function B_({ value: e, children: t }) {
	return /* @__PURE__ */ (0, G.jsx)(R_.Provider, {
		value: Math.max(1, Math.min(8, e)),
		children: t
	});
}
//#endregion
//#region src/lib/surface-classes.ts
var V_ = {
	1: "bg-surface-1",
	2: "bg-surface-2",
	3: "bg-surface-3",
	4: "bg-surface-4",
	5: "bg-surface-5",
	6: "bg-surface-6",
	7: "bg-surface-7",
	8: "bg-surface-8"
}, H_ = {
	1: "shadow-surface-1",
	2: "shadow-surface-2",
	3: "shadow-surface-3",
	4: "shadow-surface-4",
	5: "shadow-surface-5",
	6: "shadow-surface-6",
	7: "shadow-surface-7",
	8: "shadow-surface-8"
};
function U_(e, t = e) {
	let n = Math.round(Math.max(1, Math.min(8, e))), r = Math.round(Math.max(1, Math.min(8, t)));
	return `${V_[n]} ${H_[r]}`;
}
//#endregion
//#region src/components/ui/tabs.tsx
var W_ = (0, C.createContext)(null), G_ = (0, C.createContext)(null);
function K_() {
	let e = (0, C.useContext)(G_);
	if (!e) throw Error("TabItem must be used within a TabsList");
	return e;
}
var q_ = (0, C.forwardRef)(({ value: e, onValueChange: t, selectedIndex: n, onSelect: r, defaultValue: i, size: a, children: o, ...s }, c) => {
	let [l, u] = (0, C.useState)([]), [d, f] = (0, C.useState)(i), p = (0, C.useCallback)((e) => {
		u((t) => t.length === e.length && t.every((t, n) => t === e[n]) ? t : e);
	}, []), m = e ?? (n == null ? d ?? l[0] : l[n]), h = (0, C.useCallback)((i) => {
		let a = i;
		if (e === void 0 && n == null && f(a), t?.(a), r) {
			let e = l.indexOf(a);
			e !== -1 && r(e);
		}
	}, [
		t,
		r,
		l,
		e,
		n
	]), g = /* @__PURE__ */ (0, G.jsx)(W_.Provider, {
		value: {
			valueOrder: l,
			setValueOrder: p,
			selectedValue: m
		},
		children: /* @__PURE__ */ (0, G.jsx)(x_, {
			ref: c,
			value: m ?? "",
			onValueChange: h,
			...s,
			children: o
		})
	});
	return a ? /* @__PURE__ */ (0, G.jsx)(Dn, {
		size: a,
		children: g
	}) : g;
});
q_.displayName = "Tabs";
var J_ = (0, C.forwardRef)(({ children: e, className: t, ...n }, r) => {
	let i = (0, C.useRef)(null), a = (0, C.useRef)(!1), o = xn(), s = En(), c = z_(), l = Math.min(c + 3, 8), u = (0, C.useContext)(W_), [d, f] = (0, C.useState)(null), p = C.Children.toArray(e).filter(C.isValidElement).map((e) => e.props.value).filter((e) => typeof e == "string"), m = p.join(","), h = u?.setValueOrder;
	(0, C.useLayoutEffect)(() => {
		h?.(p);
	}, [h, m]);
	let { activeIndex: g, setActiveIndex: _, itemRects: v, handlers: y, registerItem: b, measureItems: x } = li(i, { axis: "x" }), S = (0, C.useCallback)((e, t, n) => {
		b(e, n);
	}, [b]);
	(0, C.useEffect)(() => {
		x();
	}, [x, e]);
	let w = (0, C.useCallback)((e) => {
		a.current = !0, y.onMouseMove(e);
	}, [y]), T = (0, C.useCallback)(() => {
		a.current = !1, y.onMouseLeave();
	}, [y]), [E, D] = (0, C.useState)(null), O = u?.selectedValue, k = O === void 0 ? -1 : p.indexOf(O);
	(0, C.useEffect)(() => {
		f(k >= 0 ? k : null);
	}, [k]);
	let A = d, j = A === null ? null : v[A], M = g === null ? null : v[g], N = E === null ? null : v[E], P = g === A, ee = g !== null && !P, F = C.Children.map(e, (e, t) => (0, C.isValidElement)(e) && typeof e.type != "string" ? (0, C.cloneElement)(e, { _index: t }) : e);
	return /* @__PURE__ */ (0, G.jsx)(G_.Provider, {
		value: {
			registerTab: S,
			hoveredIndex: g,
			selectedValue: O,
			setOptimisticIdx: f
		},
		children: /* @__PURE__ */ (0, G.jsxs)(L_, {
			activateOnFocus: !0,
			ref: (e) => {
				i.current = e, typeof r == "function" ? r(e) : r && (r.current = e);
			},
			onMouseMove: w,
			onMouseLeave: T,
			onFocus: (e) => {
				let t = e.target.closest("[role=\"tab\"]");
				if (!t) return;
				let n = t.getAttribute("data-proximity-index");
				if (n != null) {
					let t = Number(n);
					_(t), D(e.target.matches(":focus-visible") ? t : null);
				}
			},
			onBlur: (e) => {
				i.current?.contains(e.relatedTarget) || (D(null), !a.current && _(null));
			},
			className: _n("relative inline-flex items-center gap-0.5 select-none bg-muted", s.segmentPad, o.container, t),
			...n,
			children: [
				j && /* @__PURE__ */ (0, G.jsx)(nh.div, {
					className: _n("absolute pointer-events-none", U_(l), o.bg),
					initial: !1,
					animate: {
						left: j.left,
						width: j.width,
						top: j.top,
						height: j.height,
						opacity: ee ? .85 : 1
					},
					transition: {
						...$.moderate,
						opacity: { duration: .08 }
					}
				}),
				/* @__PURE__ */ (0, G.jsx)(up, { children: M && !P && j && /* @__PURE__ */ (0, G.jsx)(nh.div, {
					className: _n("absolute pointer-events-none bg-hover", o.bg),
					initial: {
						left: j.left,
						width: j.width,
						top: j.top,
						height: j.height,
						opacity: 0
					},
					animate: {
						left: M.left,
						width: M.width,
						top: M.top,
						height: M.height,
						opacity: .4
					},
					exit: !a.current && j ? {
						left: j.left,
						width: j.width,
						top: j.top,
						height: j.height,
						opacity: 0,
						transition: {
							...$.moderate,
							opacity: { duration: .06 }
						}
					} : {
						opacity: 0,
						transition: $.fast.exit
					},
					transition: {
						...$.fast,
						opacity: { duration: .08 }
					}
				}) }),
				/* @__PURE__ */ (0, G.jsx)(up, { children: N && /* @__PURE__ */ (0, G.jsx)(nh.div, {
					className: _n("absolute pointer-events-none z-20 border border-[color:var(--focus-ring,#6B97FF)]", o.focusRing),
					initial: !1,
					animate: {
						left: N.left - 2,
						top: N.top - 2,
						width: N.width + 4,
						height: N.height + 4
					},
					exit: {
						opacity: 0,
						transition: $.fast.exit
					},
					transition: {
						...$.fast,
						opacity: { duration: .08 }
					}
				}) }),
				F
			]
		})
	});
});
J_.displayName = "TabsList";
var Y_ = (0, C.forwardRef)(({ value: e, icon: t, label: n, _index: r = 0, className: i, onClick: a, ...o }, s) => {
	let c = (0, C.useRef)(null), l = En(), { registerTab: u, hoveredIndex: d, selectedValue: f, setOptimisticIdx: p } = K_();
	(0, C.useEffect)(() => (u(r, e, c.current), () => u(r, e, null)), [
		r,
		e,
		u
	]);
	let m = f === e, h = d === r || m;
	return /* @__PURE__ */ (0, G.jsxs)(O_, {
		onClick: (e) => {
			p(r), a?.(e);
		},
		ref: (e) => {
			c.current = e, typeof s == "function" ? s(e) : s && (s.current = e);
		},
		value: e,
		"data-proximity-index": r,
		className: _n("relative z-10 flex items-center px-3 cursor-pointer bg-transparent border-none outline-none", l.segmentItem, l.gap, i),
		...o,
		children: [t && /* @__PURE__ */ (0, G.jsx)(t, {
			size: l.icon,
			strokeWidth: h ? 2 : 1.5,
			className: _n("transition-[color,stroke-width] duration-80", h ? "text-foreground" : "text-muted-foreground")
		}), /* @__PURE__ */ (0, G.jsxs)("span", {
			className: _n("inline-grid whitespace-nowrap", l.text),
			children: [/* @__PURE__ */ (0, G.jsx)("span", {
				className: "col-start-1 row-start-1 invisible [text-box:trim-both_cap_alphabetic]",
				style: { fontVariationSettings: si.semibold },
				"aria-hidden": "true",
				children: n
			}), /* @__PURE__ */ (0, G.jsx)("span", {
				className: _n("col-start-1 row-start-1 transition-[color,font-variation-settings] duration-80 [text-box:trim-both_cap_alphabetic]", h ? "text-foreground" : "text-muted-foreground"),
				style: { fontVariationSettings: m ? si.semibold : si.normal },
				children: n
			})]
		})]
	});
});
Y_.displayName = "TabItem";
var X_ = (0, C.forwardRef)(({ className: e, ...t }, n) => /* @__PURE__ */ (0, G.jsx)(j_, {
	ref: n,
	className: _n("outline-none", e),
	...t
}));
X_.displayName = "TabPanel";
//#endregion
//#region src/AppChrome.tsx
var Z_ = {
	viewMode: "flat",
	animPlaying: !1,
	animSpeed: "norm",
	animStepped: !0,
	animSpin: !1,
	animSize: !1,
	animSound: !0,
	animParticles: !0,
	animSizeW: !1,
	animSizeH: !0,
	animWaves: "quadrants",
	stripsBlocks: 6,
	stripsWidth: 128,
	exportVideoLabel: "экспорт видео",
	exportVideoBusy: !1,
	kbdFlash: {
		random: !1,
		export: !1
	}
}, Q_ = {
	segRin: "",
	segRout: "",
	segA0: "",
	segA1: ""
};
function $_(e, t) {
	window.dispatchEvent(new CustomEvent("radial-chrome-action", { detail: {
		action: e,
		...t
	} }));
}
function ev(e, t, n = "change") {
	window.dispatchEvent(new CustomEvent("radial-props-change", { detail: {
		field: e,
		value: t,
		phase: n
	} }));
}
function tv({ children: e }) {
	return /* @__PURE__ */ (0, G.jsx)(B_, {
		value: 2,
		children: /* @__PURE__ */ (0, G.jsx)(Dn, {
			defaultSize: "default",
			children: /* @__PURE__ */ (0, G.jsx)(Sn, {
				defaultShape: "rounded",
				children: e
			})
		})
	});
}
function nv() {
	let [e, t] = (0, C.useState)(() => ({
		...Z_,
		...window.__radialChrome,
		kbdFlash: {
			...Z_.kbdFlash,
			...window.__radialChrome?.kbdFlash
		}
	}));
	return (0, C.useEffect)(() => {
		let e = (e) => {
			let n = e.detail || {};
			t((e) => ({
				...e,
				...n,
				kbdFlash: {
					...e.kbdFlash,
					...n.kbdFlash || {}
				}
			}));
		};
		return window.addEventListener("radial-chrome-sync", e), () => window.removeEventListener("radial-chrome-sync", e);
	}, []), (0, C.useEffect)(() => {
		let e = /* @__PURE__ */ new Map(), n = (n) => {
			let r = n.detail?.id;
			if (r !== "btn-random" && r !== "btn-export") return;
			let i = r === "btn-random" ? "random" : "export";
			t((e) => ({
				...e,
				kbdFlash: {
					...e.kbdFlash,
					[i]: !0
				}
			}));
			let a = e.get(i);
			a && clearTimeout(a), e.set(i, setTimeout(() => {
				t((e) => ({
					...e,
					kbdFlash: {
						...e.kbdFlash,
						[i]: !1
					}
				})), e.delete(i);
			}, 150));
		};
		return window.addEventListener("radial-kbd-flash", n), window.__flashShortcutKbd = (e) => {
			window.dispatchEvent(new CustomEvent("radial-kbd-flash", { detail: { id: e } }));
		}, () => {
			e.forEach(clearTimeout), window.removeEventListener("radial-kbd-flash", n), delete window.__flashShortcutKbd;
		};
	}, []), e;
}
function rv() {
	let [e, t] = (0, C.useState)(Q_);
	return (0, C.useEffect)(() => {
		let e = (e) => {
			let n = e.detail || {};
			t((e) => ({
				...e,
				...n
			}));
		}, n = (e) => {
			let t = e.detail?.field;
			if (!t) return;
			let n = t.replace(/[A-Z]/g, (e) => `-${e.toLowerCase()}`), r = document.getElementById(n);
			r?.focus(), r && "select" in r && r.select();
		};
		return window.addEventListener("radial-props-sync", e), window.addEventListener("radial-props-focus", n), () => {
			window.removeEventListener("radial-props-sync", e), window.removeEventListener("radial-props-focus", n);
		};
	}, []), [e, (e) => t((t) => ({
		...t,
		...e
	}))];
}
function iv({ label: e, pressed: t, onPrimary: n }) {
	return /* @__PURE__ */ (0, G.jsx)("kbd", {
		className: _n("shortcut-kbd", t && "is-pressed", n && "shortcut-kbd--on-primary"),
		"aria-hidden": "true",
		children: e
	});
}
function av() {
	let { viewMode: e } = nv();
	return /* @__PURE__ */ (0, G.jsx)(tv, { children: /* @__PURE__ */ (0, G.jsx)(q_, {
		value: e,
		onValueChange: (e) => $_("mode", { mode: e }),
		className: "fluid-tabs w-full",
		children: /* @__PURE__ */ (0, G.jsxs)(J_, {
			className: "fluid-tabs__list w-full",
			"aria-label": "режим",
			children: [
				/* @__PURE__ */ (0, G.jsx)(Y_, {
					value: "flat",
					label: "плоский",
					className: "fluid-tabs__item"
				}),
				/* @__PURE__ */ (0, G.jsx)(Y_, {
					value: "volume",
					label: "объём",
					className: "fluid-tabs__item"
				}),
				/* @__PURE__ */ (0, G.jsx)(Y_, {
					value: "anim",
					label: "моушн",
					className: "fluid-tabs__item"
				}),
				/* @__PURE__ */ (0, G.jsx)(Y_, {
					value: "strips",
					label: "лента",
					className: "fluid-tabs__item"
				})
			]
		})
	}) });
}
function ov() {
	let { kbdFlash: e } = nv();
	return /* @__PURE__ */ (0, G.jsx)(tv, { children: /* @__PURE__ */ (0, G.jsxs)(Mn, {
		id: "btn-random",
		type: "button",
		variant: "secondary",
		className: _n("fluid-btn-block fluid-btn-with-kbd", e.random && "is-kbd-pressed"),
		onClick: () => $_("random"),
		children: [/* @__PURE__ */ (0, G.jsx)("span", {
			className: "fluid-btn-label",
			children: "рандом"
		}), /* @__PURE__ */ (0, G.jsx)(iv, {
			label: "r",
			pressed: e.random
		})]
	}) });
}
function sv() {
	let { animStepped: e } = nv();
	return /* @__PURE__ */ (0, G.jsx)(tv, { children: /* @__PURE__ */ (0, G.jsx)(q_, {
		value: e ? "on" : "off",
		onValueChange: (e) => $_("anim-stepped", { stepped: e }),
		className: "fluid-tabs w-full",
		children: /* @__PURE__ */ (0, G.jsxs)(J_, {
			className: "fluid-tabs__list w-full",
			"aria-label": "стоп-моушн",
			children: [/* @__PURE__ */ (0, G.jsx)(Y_, {
				value: "on",
				label: "стоп-моушн",
				className: "fluid-tabs__item"
			}), /* @__PURE__ */ (0, G.jsx)(Y_, {
				value: "off",
				label: "плавно",
				className: "fluid-tabs__item"
			})]
		})
	}) });
}
function cv() {
	let { animWaves: e } = nv();
	return /* @__PURE__ */ (0, G.jsx)(tv, { children: /* @__PURE__ */ (0, G.jsx)(q_, {
		value: e,
		onValueChange: (e) => $_("anim-waves", { waves: e }),
		className: "fluid-tabs w-full",
		children: /* @__PURE__ */ (0, G.jsxs)(J_, {
			className: "fluid-tabs__list w-full",
			"aria-label": "волны",
			children: [
				/* @__PURE__ */ (0, G.jsx)(Y_, {
					value: "quadrants",
					label: "секторы",
					className: "fluid-tabs__item"
				}),
				/* @__PURE__ */ (0, G.jsx)(Y_, {
					value: "neighbors",
					label: "по соседям",
					className: "fluid-tabs__item"
				}),
				/* @__PURE__ */ (0, G.jsx)(Y_, {
					value: "zones",
					label: "зоны",
					className: "fluid-tabs__item"
				})
			]
		})
	}) });
}
function lv() {
	let { animSound: e } = nv();
	return /* @__PURE__ */ (0, G.jsx)(tv, { children: /* @__PURE__ */ (0, G.jsx)(q_, {
		value: e ? "on" : "off",
		onValueChange: (e) => $_("anim-sound", { sound: e }),
		className: "fluid-tabs w-full",
		children: /* @__PURE__ */ (0, G.jsxs)(J_, {
			className: "fluid-tabs__list w-full",
			"aria-label": "звук",
			children: [/* @__PURE__ */ (0, G.jsx)(Y_, {
				value: "on",
				label: "звук",
				className: "fluid-tabs__item"
			}), /* @__PURE__ */ (0, G.jsx)(Y_, {
				value: "off",
				label: "без звука",
				className: "fluid-tabs__item"
			})]
		})
	}) });
}
function uv({ axis: e, label: t, checked: n }) {
	return /* @__PURE__ */ (0, G.jsxs)("label", {
		className: "fluid-check",
		children: [/* @__PURE__ */ (0, G.jsx)("input", {
			type: "checkbox",
			className: "fluid-check__box",
			checked: n,
			onChange: (t) => $_("anim-size-axis", {
				axis: e,
				on: t.target.checked ? "on" : "off"
			})
		}), /* @__PURE__ */ (0, G.jsx)("span", {
			className: "fluid-check__label",
			children: t
		})]
	});
}
function dv() {
	let { animSize: e, animSizeW: t, animSizeH: n } = nv();
	return /* @__PURE__ */ (0, G.jsxs)(tv, { children: [/* @__PURE__ */ (0, G.jsx)(q_, {
		value: e ? "on" : "off",
		onValueChange: (e) => $_("anim-size", { size: e }),
		className: "fluid-tabs w-full",
		children: /* @__PURE__ */ (0, G.jsxs)(J_, {
			className: "fluid-tabs__list w-full",
			"aria-label": "изменение размера",
			children: [/* @__PURE__ */ (0, G.jsx)(Y_, {
				value: "on",
				label: "изменение размера",
				className: "fluid-tabs__item"
			}), /* @__PURE__ */ (0, G.jsx)(Y_, {
				value: "off",
				label: "без изменения",
				className: "fluid-tabs__item"
			})]
		})
	}), e && /* @__PURE__ */ (0, G.jsxs)("div", {
		className: "fluid-checks",
		children: [/* @__PURE__ */ (0, G.jsx)(uv, {
			axis: "w",
			label: "ширина",
			checked: t
		}), /* @__PURE__ */ (0, G.jsx)(uv, {
			axis: "h",
			label: "высота",
			checked: n
		})]
	})] });
}
function fv() {
	let { animParticles: e } = nv();
	return /* @__PURE__ */ (0, G.jsx)(tv, { children: /* @__PURE__ */ (0, G.jsx)(q_, {
		value: e ? "on" : "off",
		onValueChange: (e) => $_("anim-particles", { particles: e }),
		className: "fluid-tabs w-full",
		children: /* @__PURE__ */ (0, G.jsxs)(J_, {
			className: "fluid-tabs__list w-full",
			"aria-label": "частички",
			children: [/* @__PURE__ */ (0, G.jsx)(Y_, {
				value: "on",
				label: "частички",
				className: "fluid-tabs__item"
			}), /* @__PURE__ */ (0, G.jsx)(Y_, {
				value: "off",
				label: "без частичек",
				className: "fluid-tabs__item"
			})]
		})
	}) });
}
function pv() {
	let { animSpin: e } = nv();
	return /* @__PURE__ */ (0, G.jsx)(tv, { children: /* @__PURE__ */ (0, G.jsx)(q_, {
		value: e ? "on" : "off",
		onValueChange: (e) => $_("anim-spin", { spin: e }),
		className: "fluid-tabs w-full",
		children: /* @__PURE__ */ (0, G.jsxs)(J_, {
			className: "fluid-tabs__list w-full",
			"aria-label": "вращение",
			children: [/* @__PURE__ */ (0, G.jsx)(Y_, {
				value: "on",
				label: "вращение",
				className: "fluid-tabs__item"
			}), /* @__PURE__ */ (0, G.jsx)(Y_, {
				value: "off",
				label: "без вращения",
				className: "fluid-tabs__item"
			})]
		})
	}) });
}
function mv() {
	let { animSpeed: e } = nv();
	return /* @__PURE__ */ (0, G.jsx)(tv, { children: /* @__PURE__ */ (0, G.jsx)(q_, {
		value: e,
		onValueChange: (e) => $_("anim-speed", { speed: e }),
		className: "fluid-tabs w-full",
		children: /* @__PURE__ */ (0, G.jsxs)(J_, {
			className: "fluid-tabs__list w-full",
			"aria-label": "скорость",
			children: [
				/* @__PURE__ */ (0, G.jsx)(Y_, {
					value: "slow",
					label: "slow",
					className: "fluid-tabs__item"
				}),
				/* @__PURE__ */ (0, G.jsx)(Y_, {
					value: "norm",
					label: "norm",
					className: "fluid-tabs__item"
				}),
				/* @__PURE__ */ (0, G.jsx)(Y_, {
					value: "fast",
					label: "fast",
					className: "fluid-tabs__item"
				})
			]
		})
	}) });
}
function hv({ label: e, field: t, action: n, min: r, max: i }) {
	let a = nv()[t], [o, s] = (0, C.useState)(a);
	return (0, C.useEffect)(() => s(a), [a]), /* @__PURE__ */ (0, G.jsx)(tv, { children: /* @__PURE__ */ (0, G.jsx)("div", {
		className: "composition-scrubber",
		children: /* @__PURE__ */ (0, G.jsx)(__, {
			variant: "scrubber",
			label: e,
			value: o,
			onChange: (e) => {
				let t = typeof e == "number" ? e : e[0];
				s(t), $_(n, { count: String(t) });
			},
			min: r,
			max: i,
			step: 1,
			formatValue: (e) => String(e)
		})
	}) });
}
function gv() {
	let { exportVideoLabel: e, exportVideoBusy: t, viewMode: n } = nv();
	return n === "strips" ? null : /* @__PURE__ */ (0, G.jsx)(tv, { children: /* @__PURE__ */ (0, G.jsx)(Mn, {
		id: "btn-export-video",
		type: "button",
		variant: "tertiary",
		className: "fluid-btn-block",
		disabled: t,
		loading: t,
		onClick: () => $_("export-video"),
		children: e
	}) });
}
function _v() {
	let { kbdFlash: e } = nv();
	return /* @__PURE__ */ (0, G.jsx)(tv, { children: /* @__PURE__ */ (0, G.jsxs)(Mn, {
		id: "btn-export",
		type: "button",
		variant: "primary",
		className: _n("fluid-btn-block fluid-btn-with-kbd", e.export && "is-kbd-pressed"),
		onClick: () => $_("export-svg"),
		children: [/* @__PURE__ */ (0, G.jsx)("span", {
			className: "fluid-btn-label",
			children: "экспорт svg"
		}), /* @__PURE__ */ (0, G.jsx)(iv, {
			label: "d",
			pressed: e.export,
			onPrimary: !0
		})]
	}) });
}
function vv() {
	let { viewMode: e } = nv();
	return e === "volume" ? /* @__PURE__ */ (0, G.jsx)(tv, { children: /* @__PURE__ */ (0, G.jsx)(Mn, {
		id: "btn-export-fbx",
		type: "button",
		variant: "primary",
		className: "fluid-btn-block",
		onClick: () => $_("export-fbx"),
		children: "экспорт fbx"
	}) }) : null;
}
function yv() {
	let { viewMode: e } = nv();
	return e === "flat" ? /* @__PURE__ */ (0, G.jsx)(tv, { children: /* @__PURE__ */ (0, G.jsx)(Mn, {
		id: "btn-add-segment",
		type: "button",
		variant: "secondary",
		className: "fluid-fab",
		"data-tool": "segment",
		onClick: () => $_("add-segment"),
		children: "добавить сегмент"
	}) }) : null;
}
function bv({ id: e, action: t }) {
	return /* @__PURE__ */ (0, G.jsx)(tv, { children: /* @__PURE__ */ (0, G.jsx)(Mn, {
		id: e,
		type: "button",
		variant: "tertiary",
		className: "fluid-btn-block fluid-btn-danger",
		onClick: () => $_(t),
		children: "удалить"
	}) });
}
function xv() {
	let [e, t] = (0, C.useState)(""), [n, r] = (0, C.useState)(!1);
	return (0, C.useEffect)(() => {
		let e = () => r(!0);
		return window.addEventListener("radial-gate-error", e), () => window.removeEventListener("radial-gate-error", e);
	}, []), /* @__PURE__ */ (0, G.jsxs)(tv, { children: [/* @__PURE__ */ (0, G.jsx)(fi, {
		className: "fluid-input-group w-full max-w-none",
		size: "default",
		children: /* @__PURE__ */ (0, G.jsx)(pi, {
			index: 0,
			id: "gate-pass",
			name: "password",
			type: "password",
			label: "пароль",
			autoFocus: !0,
			required: !0,
			value: e,
			error: n ? "неверный пароль" : void 0,
			onChange: (e) => {
				r(!1), t(e);
			}
		})
	}), /* @__PURE__ */ (0, G.jsx)(Mn, {
		type: "submit",
		variant: "primary",
		className: "fluid-btn-block gate__btn",
		children: "войти"
	})] });
}
var Sv = {
	"seg-rin": "segRin",
	"seg-rout": "segRout",
	"seg-a0": "segA0",
	"seg-a1": "segA1"
};
function Cv() {
	let [e, t] = rv();
	return /* @__PURE__ */ (0, G.jsx)(tv, { children: /* @__PURE__ */ (0, G.jsx)("div", {
		className: "fluid-props-fields",
		onBlur: (e) => {
			let t = e.target?.id, n = t ? Sv[t] : void 0;
			n && ev(n, e.target.value ?? "", "change");
		},
		children: /* @__PURE__ */ (0, G.jsxs)(fi, {
			className: "fluid-input-group w-full max-w-none",
			size: "default",
			children: [/* @__PURE__ */ (0, G.jsxs)("div", {
				className: "fluid-input-row",
				children: [/* @__PURE__ */ (0, G.jsx)(pi, {
					index: 0,
					id: "seg-rin",
					type: "number",
					step: "any",
					label: "rIn",
					value: e.segRin,
					onChange: (e) => t({ segRin: e })
				}), /* @__PURE__ */ (0, G.jsx)(pi, {
					index: 1,
					id: "seg-rout",
					type: "number",
					step: "any",
					label: "rOut",
					value: e.segRout,
					onChange: (e) => t({ segRout: e })
				})]
			}), /* @__PURE__ */ (0, G.jsxs)("div", {
				className: "fluid-input-row",
				children: [/* @__PURE__ */ (0, G.jsx)(pi, {
					index: 2,
					id: "seg-a0",
					type: "number",
					step: "any",
					label: "старт°",
					value: e.segA0,
					onChange: (e) => t({ segA0: e })
				}), /* @__PURE__ */ (0, G.jsx)(pi, {
					index: 3,
					id: "seg-a1",
					type: "number",
					step: "any",
					label: "конец°",
					value: e.segA1,
					onChange: (e) => t({ segA1: e })
				})]
			})]
		})
	}) });
}
var wv = /* @__PURE__ */ new Map();
function Tv(e, t) {
	let n = document.getElementById(e);
	if (!n) return;
	let r = wv.get(e);
	r || (r = (0, ze.createRoot)(n), wv.set(e, r)), r.render(t);
}
function Ev() {
	Tv("fluid-host-mode", /* @__PURE__ */ (0, G.jsx)(av, {})), Tv("fluid-host-random", /* @__PURE__ */ (0, G.jsx)(ov, {})), Tv("fluid-host-anim-stepped", /* @__PURE__ */ (0, G.jsx)(sv, {})), Tv("fluid-host-anim-spin", /* @__PURE__ */ (0, G.jsx)(pv, {})), Tv("fluid-host-anim-size", /* @__PURE__ */ (0, G.jsx)(dv, {})), Tv("fluid-host-anim-sound", /* @__PURE__ */ (0, G.jsx)(lv, {})), Tv("fluid-host-anim-particles", /* @__PURE__ */ (0, G.jsx)(fv, {})), Tv("fluid-host-anim-waves", /* @__PURE__ */ (0, G.jsx)(cv, {})), Tv("fluid-host-anim-speed", /* @__PURE__ */ (0, G.jsx)(mv, {})), Tv("fluid-host-strips-count", /* @__PURE__ */ (0, G.jsx)(hv, {
		label: "количество",
		field: "stripsBlocks",
		action: "strips-blocks",
		min: 3,
		max: 12
	})), Tv("fluid-host-strips-width", /* @__PURE__ */ (0, G.jsx)(hv, {
		label: "ширина",
		field: "stripsWidth",
		action: "strips-width",
		min: 48,
		max: 320
	})), Tv("fluid-host-export-video", /* @__PURE__ */ (0, G.jsx)(gv, {})), Tv("fluid-host-export-fbx", /* @__PURE__ */ (0, G.jsx)(vv, {})), Tv("fluid-host-export-svg", /* @__PURE__ */ (0, G.jsx)(_v, {})), Tv("fluid-host-fabs", /* @__PURE__ */ (0, G.jsx)(yv, {})), Tv("fluid-host-delete-seg", /* @__PURE__ */ (0, G.jsx)(bv, {
		id: "btn-delete-seg",
		action: "delete-seg"
	})), Tv("fluid-host-gate", /* @__PURE__ */ (0, G.jsx)(xv, {})), Tv("fluid-host-seg-fields", /* @__PURE__ */ (0, G.jsx)(Cv, {})), window.dispatchEvent(new CustomEvent("radial-fluid-ready"));
}
//#endregion
//#region src/CompositionScrubbers.tsx
var Dv = 69, Ov = 90, kv = 66, Av = 120, jv = 83, Mv = 100;
function Nv(e) {
	if (e === "small") return 0;
	if (e === "large") return 100;
	let t = Math.round(Number(e));
	return Number.isFinite(t) ? Math.max(0, Math.min(100, t)) : Mv;
}
function Pv() {
	let e = window.__radialPrefs;
	return {
		randomness: typeof e?.randomness == "number" ? e.randomness : Dv,
		objectCount: typeof e?.objectCount == "number" ? e.objectCount : Ov,
		widePieces: typeof e?.widePieces == "number" ? e.widePieces : kv,
		longPieces: typeof e?.longPieces == "number" ? e.longPieces : jv,
		sizeMix: Nv(e?.sizeMix ?? Mv)
	};
}
function Fv(e, t, n) {
	window.dispatchEvent(new CustomEvent("radial-scrubber-change", { detail: {
		key: e,
		value: t,
		phase: n
	} }));
}
function Iv({ prefKey: e, label: t, value: n, onValue: r, max: i = 100 }) {
	let a = (0, C.useCallback)((t) => {
		let n = typeof t == "number" ? t : t[0];
		r(n), Fv(e, n, "input");
	}, [e, r]);
	return /* @__PURE__ */ (0, G.jsx)("div", {
		className: "composition-scrubber",
		onPointerDownCapture: () => Fv(e, n, "start"),
		onPointerUpCapture: () => Fv(e, n, "end"),
		onPointerCancelCapture: () => Fv(e, n, "end"),
		children: /* @__PURE__ */ (0, G.jsx)(__, {
			variant: "scrubber",
			label: t,
			value: n,
			onChange: a,
			min: 0,
			max: i,
			step: 1,
			formatValue: (e) => String(e)
		})
	});
}
function Lv() {
	let [e, t] = (0, C.useState)(Pv);
	return (0, C.useEffect)(() => {
		let e = (e) => {
			let n = e.detail;
			n && t({
				randomness: n.randomness,
				objectCount: n.objectCount,
				widePieces: typeof n.widePieces == "number" ? n.widePieces : kv,
				longPieces: typeof n.longPieces == "number" ? n.longPieces : jv,
				sizeMix: Nv(n.sizeMix)
			});
		};
		return window.addEventListener("radial-prefs-sync", e), () => window.removeEventListener("radial-prefs-sync", e);
	}, []), /* @__PURE__ */ (0, G.jsx)(B_, {
		value: 2,
		children: /* @__PURE__ */ (0, G.jsx)(Dn, {
			defaultSize: "default",
			children: /* @__PURE__ */ (0, G.jsx)(Sn, {
				defaultShape: "rounded",
				children: /* @__PURE__ */ (0, G.jsxs)("div", {
					className: "composition-scrubbers flex flex-col gap-1",
					children: [
						/* @__PURE__ */ (0, G.jsx)(Iv, {
							prefKey: "randomness",
							label: "рандомность",
							value: e.randomness,
							onValue: (e) => t((t) => ({
								...t,
								randomness: e
							}))
						}),
						/* @__PURE__ */ (0, G.jsx)(Iv, {
							prefKey: "objectCount",
							label: "количество",
							value: e.objectCount,
							onValue: (e) => t((t) => ({
								...t,
								objectCount: e
							}))
						}),
						/* @__PURE__ */ (0, G.jsx)(Iv, {
							prefKey: "sizeMix",
							label: "размер",
							value: e.sizeMix,
							onValue: (e) => t((t) => ({
								...t,
								sizeMix: e
							}))
						}),
						/* @__PURE__ */ (0, G.jsx)("div", {
							className: "composition-subhead",
							children: "геометрия сегментов"
						}),
						/* @__PURE__ */ (0, G.jsx)(Iv, {
							prefKey: "widePieces",
							label: "широкие",
							value: e.widePieces,
							max: Av,
							onValue: (e) => t((t) => ({
								...t,
								widePieces: e
							}))
						}),
						/* @__PURE__ */ (0, G.jsx)(Iv, {
							prefKey: "longPieces",
							label: "длинные",
							value: e.longPieces,
							onValue: (e) => t((t) => ({
								...t,
								longPieces: e
							}))
						})
					]
				})
			})
		})
	});
}
//#endregion
//#region src/scrubbers-main.tsx
function Rv() {
	let e = document.getElementById("composition-scrubbers");
	e && (0, ze.createRoot)(e).render(/* @__PURE__ */ (0, G.jsx)(Lv, {})), Ev();
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", Rv) : Rv();
//#endregion
