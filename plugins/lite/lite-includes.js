/* Source version: 1.2.26 */
(function (a) {
	a.ice = {}
}(this || window));
(function (b) {
	var k = (typeof b.define == "function" && b.define.amd);
	var t = "object", d = "function", z = "undefined";
	var a = ["startContainer", "startOffset", "endContainer", "endOffset", "collapsed", "commonAncestorContainer"];
	var p = ["setStart", "setStartBefore", "setStartAfter", "setEnd", "setEndBefore", "setEndAfter", "collapse", "selectNode", "selectNodeContents", "compareBoundaryPoints", "deleteContents", "extractContents", "cloneContents", "insertNode", "surroundContents", "cloneRange", "toString", "detach"];
	var l = ["boundingHeight", "boundingLeft", "boundingTop", "boundingWidth", "htmlText", "text"];
	var E = ["collapse", "compareEndPoints", "duplicate", "moveToElementText", "parentElement", "select", "setEndPoint", "getBoundingClientRect"];

	function B(M, L) {
		var K = typeof M[L];
		return K == d || (!!(K == t && M[L])) || K == "unknown"
	}

	function x(L, K) {
		return !!(typeof L[K] == t && L[K])
	}

	function e(L, K) {
		return typeof L[K] != z
	}

	function v(K) {
		return function (N, M) {
			var L = M.length;
			while (L--) {
				if (!K(N, M[L])) {
					return false
				}
			}
			return true
		}
	}

	var j = v(B);
	var s = v(x);
	var g = v(e);

	function y(K) {
		return K && j(K, E) && g(K, l)
	}

	function H(K) {
		return x(K, "body") ? K.body : K.getElementsByTagName("body")[0]
	}

	var u = {};
	var h = {
		version: "1.3alpha.20140716",
		initialized: false,
		supported: true,
		util: {
			isHostMethod: B,
			isHostObject: x,
			isHostProperty: e,
			areHostMethods: j,
			areHostObjects: s,
			areHostProperties: g,
			isTextRange: y,
			getBody: H
		},
		features: {},
		modules: u,
		config: {alertOnFail: true, alertOnWarn: false, preferTextRange: false}
	};

	function D(K) {
		if (x(window, "console") && B(window.console, "log")) {
			window.console.log(K)
		}
	}

	function o(L, K) {
		if (K) {
			window.alert(L)
		} else {
			D(L)
		}
	}

	function m(K) {
		h.initialized = true;
		h.supported = false;
		o("Rangy is not supported on this page in your browser. Reason: " + K, h.config.alertOnFail)
	}

	h.fail = m;
	function n(K) {
		o("Rangy warning: " + K, h.config.alertOnWarn)
	}

	h.warn = n;
	if ({}.hasOwnProperty) {
		h.util.extend = function (O, M, K) {
			var P, N;
			for (var L in M) {
				if (M.hasOwnProperty(L)) {
					P = O[L];
					N = M[L];
					if (K && P !== null && typeof P == "object" && N !== null && typeof N == "object") {
						h.util.extend(P, N, true)
					}
					O[L] = N
				}
			}
			if (M.hasOwnProperty("toString")) {
				O.toString = M.toString
			}
			return O
		}
	} else {
		m("hasOwnProperty not supported")
	}
	(function () {
		var L = document.createElement("div");
		L.appendChild(document.createElement("span"));
		var N = [].slice;
		var K;
		try {
			if (N.call(L.childNodes, 0)[0].nodeType == 1) {
				K = function (O) {
					return N.call(O, 0)
				}
			}
		} catch (M) {
		}
		if (!K) {
			K = function (Q) {
				var P = [];
				for (var R = 0, O = Q.length; R < O; ++R) {
					P[R] = Q[R]
				}
				return P
			}
		}
		h.util.toArray = K
	})();
	var i;
	if (B(document, "addEventListener")) {
		i = function (M, K, L) {
			M.addEventListener(K, L, false)
		}
	} else {
		if (B(document, "attachEvent")) {
			i = function (M, K, L) {
				M.attachEvent("on" + K, L)
			}
		} else {
			m("Document does not have required addEventListener or attachEvent method")
		}
	}
	h.util.addListener = i;
	var I = [];

	function c(K) {
		return K.message || K.description || String(K)
	}

	function F() {
		if (h.initialized) {
			return
		}
		var M;
		var T = false, N = false;
		if (B(document, "createRange")) {
			M = document.createRange();
			if (j(M, p) && g(M, a)) {
				T = true
			}
		}
		var P = H(document);
		if (!P || P.nodeName.toLowerCase() != "body") {
			m("No body element found");
			return
		}
		if (P && B(P, "createTextRange")) {
			M = P.createTextRange();
			if (y(M)) {
				N = true
			}
		}
		if (!T && !N) {
			m("Neither Range nor TextRange are available");
			return
		}
		h.initialized = true;
		h.features = {implementsDomRange: T, implementsTextRange: N};
		var L, R;
		for (var K in u) {
			if ((L = u[K]) instanceof w) {
				L.init(L, h)
			}
		}
		for (var O = 0, Q = I.length; O < Q; ++O) {
			try {
				I[O](h)
			} catch (S) {
				R = "Rangy init listener threw an exception. Continuing. Detail: " + c(S);
				D(R)
			}
		}
	}

	h.init = F;
	h.addInitListener = function (K) {
		if (h.initialized) {
			K(h)
		} else {
			I.push(K)
		}
	};
	var J = [];
	h.addCreateMissingNativeApiListener = function (K) {
		J.push(K)
	};
	function r(M) {
		M = M || window;
		F();
		for (var L = 0, K = J.length; L < K; ++L) {
			J[L](M)
		}
	}

	h.createMissingNativeApi = r;
	function w(K, M, L) {
		this.name = K;
		this.dependencies = M;
		this.initialized = false;
		this.supported = false;
		this.initializer = L
	}

	w.prototype = {
		init: function (N) {
			var O = this.dependencies || [];
			for (var M = 0, K = O.length, P, L; M < K; ++M) {
				L = O[M];
				P = u[L];
				if (!P || !(P instanceof w)) {
					throw new Error("required module '" + L + "' not found")
				}
				P.init();
				if (!P.supported) {
					throw new Error("required module '" + L + "' not supported")
				}
			}
			this.initializer(this)
		}, fail: function (K) {
			this.initialized = true;
			this.supported = false;
			throw new Error("Module '" + this.name + "' failed to load: " + K)
		}, warn: function (K) {
			h.warn("Module " + this.name + ": " + K)
		}, deprecationNotice: function (K, L) {
			h.warn("DEPRECATED: " + K + " in module " + this.name + "is deprecated. Please use " + L + " instead")
		}, createError: function (K) {
			return new Error("Error in Rangy " + this.name + " module: " + K)
		}
	};
	function q(K, L, N, O) {
		var M = new w(L, N, function (R) {
			if (!R.initialized) {
				R.initialized = true;
				try {
					O(h, R);
					R.supported = true
				} catch (Q) {
					var P = "Module '" + L + "' failed to load: " + c(Q);
					D(P)
				}
			}
		});
		u[L] = M
	}

	h.createModule = function (K) {
		var M, L;
		if (arguments.length == 2) {
			M = arguments[1];
			L = []
		} else {
			M = arguments[2];
			L = arguments[1]
		}
		q(false, K, L, M)
	};
	h.createCoreModule = function (K, L, M) {
		q(true, K, L, M)
	};
	function C() {
	}

	h.RangePrototype = C;
	h.rangePrototype = new C();
	function A() {
	}

	h.selectionPrototype = new A();
	var f = false;
	var G = function (K) {
		if (!f) {
			f = true;
			if (!h.initialized) {
				F()
			}
		}
	};
	if (typeof window == z) {
		m("No window found");
		return
	}
	if (typeof document == z) {
		m("No document found");
		return
	}
	if (B(document, "addEventListener")) {
		document.addEventListener("DOMContentLoaded", G, false)
	}
	i(window, "load", G);
	if (k) {
		(function (K) {
			K(function () {
				h.amd = true;
				return h
			})
		})(b.define)
	}
	b.rangy = h;
	b.rangy.createCoreModule("DomUtil", [], function (N, L) {
		var ac = "undefined";
		var P = N.util;
		if (!P.areHostMethods(document, ["createDocumentFragment", "createElement", "createTextNode"])) {
			L.fail("document missing a Node creation method")
		}
		if (!P.isHostMethod(document, "getElementsByTagName")) {
			L.fail("document missing getElementsByTagName method")
		}
		var ao = document.createElement("div");
		if (!P.areHostMethods(ao, ["insertBefore", "appendChild", "cloneNode"] || !P.areHostObjects(ao, ["previousSibling", "nextSibling", "childNodes", "parentNode"]))) {
			L.fail("Incomplete Element implementation")
		}
		if (!P.isHostProperty(ao, "innerHTML")) {
			L.fail("Element is missing innerHTML property")
		}
		var aq = document.createTextNode("test");
		if (!P.areHostMethods(aq, ["splitText", "deleteData", "insertData", "appendData", "cloneNode"] || !P.areHostObjects(ao, ["previousSibling", "nextSibling", "childNodes", "parentNode"]) || !P.areHostProperties(aq, ["data"]))) {
			L.fail("Incomplete Text Node implementation")
		}
		var au = function (av, ax) {
			var aw = av.length;
			while (aw--) {
				if (av[aw] === ax) {
					return true
				}
			}
			return false
		};

		function R(aw) {
			var av;
			return typeof aw.namespaceURI == ac || ((av = aw.namespaceURI) === null || av == "http://www.w3.org/1999/xhtml")
		}

		function ad(aw) {
			var av = aw.parentNode;
			return (av.nodeType == 1) ? av : null
		}

		function X(aw) {
			var av = 0;
			while ((aw = aw.previousSibling)) {
				++av
			}
			return av
		}

		function af(av) {
			switch (av.nodeType) {
				case 7:
				case 10:
					return 0;
				case 3:
				case 8:
					return av.length;
				default:
					return av.childNodes.length
			}
		}

		function U(aw, av) {
			var ax = [], ay;
			for (ay = aw; ay; ay = ay.parentNode) {
				ax.push(ay)
			}
			for (ay = av; ay; ay = ay.parentNode) {
				if (au(ax, ay)) {
					return ay
				}
			}
			return null
		}

		function T(av, aw, ay) {
			var ax = ay ? aw : aw.parentNode;
			while (ax) {
				if (ax === av) {
					return true
				} else {
					ax = ax.parentNode
				}
			}
			return false
		}

		function am(av, aw) {
			return T(av, aw, true)
		}

		function ak(aw, av, az) {
			var ax, ay = az ? aw : aw.parentNode;
			while (ay) {
				ax = ay.parentNode;
				if (ax === av) {
					return ay
				}
				ay = ax
			}
			return null
		}

		function M(aw) {
			var av = aw.nodeType;
			return av == 3 || av == 4 || av == 8
		}

		function K(aw) {
			if (!aw) {
				return false
			}
			var av = aw.nodeType;
			return av == 3 || av == 8
		}

		function Q(ay, aw) {
			var av = aw.nextSibling, ax = aw.parentNode;
			if (av) {
				ax.insertBefore(ay, av)
			} else {
				ax.appendChild(ay)
			}
			return ay
		}

		function ae(aA, ax, aw) {
			var az = aA.cloneNode(false);
			az.deleteData(0, ax);
			aA.deleteData(ax, aA.length - ax);
			Q(az, aA);
			if (aw) {
				for (var ay = 0, av; av = aw[ay++];) {
					if (av.node == aA && av.offset > ax) {
						av.node = az;
						av.offset -= ax
					} else {
						if (av.node == aA.parentNode && av.offset > X(aA)) {
							++av.offset
						}
					}
				}
			}
			return az
		}

		function ar(av) {
			if (av.nodeType == 9) {
				return av
			} else {
				if (typeof av.ownerDocument != ac) {
					return av.ownerDocument
				} else {
					if (typeof av.document != ac) {
						return av.document
					} else {
						if (av.parentNode) {
							return ar(av.parentNode)
						} else {
							throw L.createError("getDocument: no document found for node")
						}
					}
				}
			}
		}

		function W(av) {
			var aw = ar(av);
			if (typeof aw.defaultView != ac) {
				return aw.defaultView
			} else {
				if (typeof aw.parentWindow != ac) {
					return aw.parentWindow
				} else {
					throw L.createError("Cannot get a window object for node")
				}
			}
		}

		function at(av) {
			if (typeof av.contentDocument != ac) {
				return av.contentDocument
			} else {
				if (typeof av.contentWindow != ac) {
					return av.contentWindow.document
				} else {
					throw L.createError("getIframeDocument: No Document object found for iframe element")
				}
			}
		}

		function ap(av) {
			if (typeof av.contentWindow != ac) {
				return av.contentWindow
			} else {
				if (typeof av.contentDocument != ac) {
					return av.contentDocument.defaultView
				} else {
					throw L.createError("getIframeWindow: No Window object found for iframe element")
				}
			}
		}

		function ai(av) {
			return av && P.isHostMethod(av, "setTimeout") && P.isHostObject(av, "document")
		}

		function ah(ay, aw, av) {
			var ax;
			if (!ay) {
				ax = document
			} else {
				if (P.isHostProperty(ay, "nodeType")) {
					ax = (ay.nodeType == 1 && ay.tagName.toLowerCase() == "iframe") ? at(ay) : ar(ay)
				} else {
					if (ai(ay)) {
						ax = ay.document
					}
				}
			}
			if (!ax) {
				throw aw.createError(av + "(): Parameter must be a Window object or DOM node")
			}
			return ax
		}

		function S(aw) {
			var av;
			while ((av = aw.parentNode)) {
				aw = av
			}
			return aw
		}

		function al(ay, aA, ax, az) {
			var av, aB, aD, aC, aw;
			if (ay == ax) {
				return aA === az ? 0 : (aA < az) ? -1 : 1
			} else {
				if ((av = ak(ax, ay, true))) {
					return aA <= X(av) ? -1 : 1
				} else {
					if ((av = ak(ay, ax, true))) {
						return X(av) < az ? -1 : 1
					} else {
						aB = U(ay, ax);
						if (!aB) {
							throw new Error("comparePoints error: nodes have no common ancestor")
						}
						aD = (ay === aB) ? aB : ak(ay, aB, true);
						aC = (ax === aB) ? aB : ak(ax, aB, true);
						if (aD === aC) {
							throw L.createError("comparePoints got to case 4 and childA and childB are the same!")
						} else {
							aw = aB.firstChild;
							while (aw) {
								if (aw === aD) {
									return -1
								} else {
									if (aw === aC) {
										return 1
									}
								}
								aw = aw.nextSibling
							}
						}
					}
				}
			}
		}

		var aa = false;

		function Z(av) {
			var ax;
			try {
				ax = av.parentNode;
				return false
			} catch (aw) {
				return true
			}
		}

		(function () {
			var av = document.createElement("b");
			av.innerHTML = "1";
			var aw = av.firstChild;
			av.innerHTML = "<br>";
			aa = Z(aw);
			N.features.crashyTextNodes = aa
		})();
		function ab(av) {
			if (!av) {
				return "[No node]"
			}
			if (aa && Z(av)) {
				return "[Broken node]"
			}
			if (M(av)) {
				return '"' + av.data + '"'
			}
			if (av.nodeType == 1) {
				var aw = av.id ? ' id="' + av.id + '"' : "";
				return "<" + av.nodeName + aw + ">[index:" + X(av) + ",length:" + av.childNodes.length + "][" + (av.innerHTML || "[innerHTML not supported]").slice(0, 25) + "]"
			}
			return av.nodeName
		}

		function aj(aw) {
			var av = ar(aw).createDocumentFragment(), ax;
			while ((ax = aw.firstChild)) {
				av.appendChild(ax)
			}
			return av
		}

		var V;
		if (typeof window.getComputedStyle != ac) {
			V = function (av, aw) {
				return W(av).getComputedStyle(av, null)[aw]
			}
		} else {
			if (typeof document.documentElement.currentStyle != ac) {
				V = function (av, aw) {
					return av.currentStyle[aw]
				}
			} else {
				L.fail("No means of obtaining computed style properties found")
			}
		}
		function O(av) {
			this.root = av;
			this._next = av
		}

		O.prototype = {
			_current: null, hasNext: function () {
				return !!this._next
			}, next: function () {
				var ax = this._current = this._next;
				var aw, av;
				if (this._current) {
					aw = ax.firstChild;
					if (aw) {
						this._next = aw
					} else {
						av = null;
						while ((ax !== this.root) && !(av = ax.nextSibling)) {
							ax = ax.parentNode
						}
						this._next = av
					}
				}
				return this._current
			}, detach: function () {
				this._current = this._next = this.root = null
			}
		};
		function an(av) {
			return new O(av)
		}

		function Y(av, aw) {
			this.node = av;
			this.offset = aw
		}

		Y.prototype = {
			equals: function (av) {
				return !!av && this.node === av.node && this.offset == av.offset
			}, inspect: function () {
				return "[DomPosition(" + ab(this.node) + ":" + this.offset + ")]"
			}, toString: function () {
				return this.inspect()
			}
		};
		function ag(av) {
			this.code = this[av];
			this.codeName = av;
			this.message = "DOMException: " + this.codeName
		}

		ag.prototype = {
			INDEX_SIZE_ERR: 1,
			HIERARCHY_REQUEST_ERR: 3,
			WRONG_DOCUMENT_ERR: 4,
			NO_MODIFICATION_ALLOWED_ERR: 7,
			NOT_FOUND_ERR: 8,
			NOT_SUPPORTED_ERR: 9,
			INVALID_STATE_ERR: 11,
			INVALID_NODE_TYPE_ERR: 24
		};
		ag.prototype.toString = function () {
			return this.message
		};
		N.dom = {
			arrayContains: au,
			isHtmlNamespace: R,
			parentElement: ad,
			getNodeIndex: X,
			getNodeLength: af,
			getCommonAncestor: U,
			isAncestorOf: T,
			isOrIsAncestorOf: am,
			getClosestAncestorIn: ak,
			isCharacterDataNode: M,
			isTextOrCommentNode: K,
			insertAfter: Q,
			splitDataNode: ae,
			getDocument: ar,
			getWindow: W,
			getIframeWindow: ap,
			getIframeDocument: at,
			getBody: P.getBody,
			isWindow: ai,
			getContentDocument: ah,
			getRootContainer: S,
			comparePoints: al,
			isBrokenNode: Z,
			inspectNode: ab,
			getComputedStyleProperty: V,
			fragmentFromNodeChildren: aj,
			createIterator: an,
			DomPosition: Y
		};
		N.DOMException = ag
	});
	b.rangy.createCoreModule("DomRange", ["DomUtil"], function (S, O) {
		var M = S.dom;
		var aa = S.util;
		var an = M.DomPosition;
		var aG = S.DOMException;
		var Q = M.isCharacterDataNode;
		var ak = M.getNodeIndex;
		var aQ = M.isOrIsAncestorOf;
		var a1 = M.getDocument;
		var aN = M.comparePoints;
		var aE = M.splitDataNode;
		var aM = M.getClosestAncestorIn;
		var aF = M.getNodeLength;
		var a2 = M.arrayContains;
		var ae = M.getRootContainer;
		var au = S.features.crashyTextNodes;

		function ag(a4, a3) {
			return (a4.nodeType != 3) && (aQ(a4, a3.startContainer) || aQ(a4, a3.endContainer))
		}

		function W(a3) {
			return a3.document || a1(a3.startContainer)
		}

		function aj(a3) {
			return new an(a3.parentNode, ak(a3))
		}

		function aJ(a3) {
			return new an(a3.parentNode, ak(a3) + 1)
		}

		function T(a4, a6, a5) {
			var a3 = a4.nodeType == 11 ? a4.firstChild : a4;
			if (Q(a6)) {
				if (a5 == a6.length) {
					M.insertAfter(a4, a6)
				} else {
					a6.parentNode.insertBefore(a4, a5 == 0 ? a6 : aE(a6, a5))
				}
			} else {
				if (a5 >= a6.childNodes.length) {
					a6.appendChild(a4)
				} else {
					a6.insertBefore(a4, a6.childNodes[a5])
				}
			}
			return a3
		}

		function a0(a6, a5, a3) {
			R(a6);
			R(a5);
			if (W(a5) != W(a6)) {
				throw new aG("WRONG_DOCUMENT_ERR")
			}
			var a7 = aN(a6.startContainer, a6.startOffset, a5.endContainer, a5.endOffset), a4 = aN(a6.endContainer, a6.endOffset, a5.startContainer, a5.startOffset);
			return a3 ? a7 <= 0 && a4 >= 0 : a7 < 0 && a4 > 0
		}

		function aq(a5) {
			var a4;
			for (var a6, a7 = W(a5.range).createDocumentFragment(), a3; a6 = a5.next();) {
				a4 = a5.isPartiallySelectedSubtree();
				a6 = a6.cloneNode(!a4);
				if (a4) {
					a3 = a5.getSubtreeIterator();
					a6.appendChild(aq(a3));
					a3.detach()
				}
				if (a6.nodeType == 10) {
					throw new aG("HIERARCHY_REQUEST_ERR")
				}
				a7.appendChild(a6)
			}
			return a7
		}

		function aI(a4, a7, a3) {
			var a5, a9;
			a3 = a3 || {stop: false};
			for (var a6, a8; a6 = a4.next();) {
				if (a4.isPartiallySelectedSubtree()) {
					if (a7(a6) === false) {
						a3.stop = true;
						return
					} else {
						a8 = a4.getSubtreeIterator();
						aI(a8, a7, a3);
						a8.detach();
						if (a3.stop) {
							return
						}
					}
				} else {
					a5 = M.createIterator(a6);
					while ((a9 = a5.next())) {
						if (a7(a9) === false) {
							a3.stop = true;
							return
						}
					}
				}
			}
		}

		function X(a4) {
			var a3;
			while (a4.next()) {
				if (a4.isPartiallySelectedSubtree()) {
					a3 = a4.getSubtreeIterator();
					X(a3);
					a3.detach()
				} else {
					a4.remove()
				}
			}
		}

		function aB(a4) {
			for (var a5, a6 = W(a4.range).createDocumentFragment(), a3; a5 = a4.next();) {
				if (a4.isPartiallySelectedSubtree()) {
					a5 = a5.cloneNode(false);
					a3 = a4.getSubtreeIterator();
					a5.appendChild(aB(a3));
					a3.detach()
				} else {
					a4.remove()
				}
				if (a5.nodeType == 10) {
					throw new aG("HIERARCHY_REQUEST_ERR")
				}
				a6.appendChild(a5)
			}
			return a6
		}

		function Z(a5, a3, a6) {
			var a8 = !!(a3 && a3.length), a7;
			var a9 = !!a6;
			if (a8) {
				a7 = new RegExp("^(" + a3.join("|") + ")$")
			}
			var a4 = [];
			aI(new P(a5, false), function (bb) {
				if (a8 && !a7.test(bb.nodeType)) {
					return
				}
				if (a9 && !a6(bb)) {
					return
				}
				var bc = a5.startContainer;
				if (bb == bc && Q(bc) && a5.startOffset == bc.length) {
					return
				}
				var ba = a5.endContainer;
				if (bb == ba && Q(ba) && a5.endOffset == 0) {
					return
				}
				a4.push(bb)
			});
			return a4
		}

		function ai(a3) {
			var a4 = (typeof a3.getName == "undefined") ? "Range" : a3.getName();
			return "[" + a4 + "(" + M.inspectNode(a3.startContainer) + ":" + a3.startOffset + ", " + M.inspectNode(a3.endContainer) + ":" + a3.endOffset + ")]"
		}

		function P(a5, a4) {
			this.range = a5;
			this.clonePartiallySelectedTextNodes = a4;
			if (!a5.collapsed) {
				this.sc = a5.startContainer;
				this.so = a5.startOffset;
				this.ec = a5.endContainer;
				this.eo = a5.endOffset;
				var a3 = a5.commonAncestorContainer;
				if (this.sc === this.ec && Q(this.sc)) {
					this.isSingleCharacterDataNode = true;
					this._first = this._last = this._next = this.sc
				} else {
					this._first = this._next = (this.sc === a3 && !Q(this.sc)) ? this.sc.childNodes[this.so] : aM(this.sc, a3, true);
					this._last = (this.ec === a3 && !Q(this.ec)) ? this.ec.childNodes[this.eo - 1] : aM(this.ec, a3, true)
				}
			}
		}

		P.prototype = {
			_current: null,
			_next: null,
			_first: null,
			_last: null,
			isSingleCharacterDataNode: false,
			reset: function () {
				this._current = null;
				this._next = this._first
			},
			hasNext: function () {
				return !!this._next
			},
			next: function () {
				var a3 = this._current = this._next;
				if (a3) {
					this._next = (a3 !== this._last) ? a3.nextSibling : null;
					if (Q(a3) && this.clonePartiallySelectedTextNodes) {
						if (a3 === this.ec) {
							(a3 = a3.cloneNode(true)).deleteData(this.eo, a3.length - this.eo)
						}
						if (this._current === this.sc) {
							(a3 = a3.cloneNode(true)).deleteData(0, this.so)
						}
					}
				}
				return a3
			},
			remove: function () {
				var a4 = this._current, a5, a3;
				if (Q(a4) && (a4 === this.sc || a4 === this.ec)) {
					a5 = (a4 === this.sc) ? this.so : 0;
					a3 = (a4 === this.ec) ? this.eo : a4.length;
					if (a5 != a3) {
						a4.deleteData(a5, a3 - a5)
					}
				} else {
					if (a4.parentNode) {
						a4.parentNode.removeChild(a4)
					} else {
					}
				}
			},
			isPartiallySelectedSubtree: function () {
				var a3 = this._current;
				return ag(a3, this.range)
			},
			getSubtreeIterator: function () {
				var a4;
				if (this.isSingleCharacterDataNode) {
					a4 = this.range.cloneRange();
					a4.collapse(false)
				} else {
					a4 = new aY(W(this.range));
					var a8 = this._current;
					var a6 = a8, a3 = 0, a7 = a8, a5 = aF(a8);
					if (aQ(a8, this.sc)) {
						a6 = this.sc;
						a3 = this.so
					}
					if (aQ(a8, this.ec)) {
						a7 = this.ec;
						a5 = this.eo
					}
					am(a4, a6, a3, a7, a5)
				}
				return new P(a4, this.clonePartiallySelectedTextNodes)
			},
			detach: function () {
				this.range = this._current = this._next = this._first = this._last = this.sc = this.so = this.ec = this.eo = null
			}
		};
		var aT = [1, 3, 4, 5, 7, 8, 10];
		var aR = [2, 9, 11];
		var al = [5, 6, 10, 12];
		var ax = [1, 3, 4, 5, 7, 8, 10, 11];
		var ao = [1, 3, 4, 5, 7, 8];

		function aL(a3) {
			return function (a5, a7) {
				var a4, a6 = a7 ? a5 : a5.parentNode;
				while (a6) {
					a4 = a6.nodeType;
					if (a2(a3, a4)) {
						return a6
					}
					a6 = a6.parentNode
				}
				return null
			}
		}

		var ar = aL([9, 11]);
		var av = aL(al);
		var L = aL([6, 10, 12]);

		function ac(a4, a3) {
			if (L(a4, a3)) {
				throw new aG("INVALID_NODE_TYPE_ERR")
			}
		}

		function aH(a3, a4) {
			if (!a2(a4, a3.nodeType)) {
				throw new aG("INVALID_NODE_TYPE_ERR")
			}
		}

		function aS(a3, a4) {
			if (a4 < 0 || a4 > (Q(a3) ? a3.length : a3.childNodes.length)) {
				throw new aG("INDEX_SIZE_ERR")
			}
		}

		function N(a4, a3) {
			if (ar(a4, true) !== ar(a3, true)) {
				throw new aG("WRONG_DOCUMENT_ERR")
			}
		}

		function aP(a3) {
			if (av(a3, true)) {
				throw new aG("NO_MODIFICATION_ALLOWED_ERR")
			}
		}

		function aW(a4, a3) {
			if (!a4) {
				throw new aG(a3)
			}
		}

		function Y(a3) {
			return (au && M.isBrokenNode(a3)) || !a2(aR, a3.nodeType) && !ar(a3, true)
		}

		function aZ(a3, a4) {
			return a4 <= (Q(a3) ? a3.length : a3.childNodes.length)
		}

		function az(a3) {
			return (!!a3.startContainer && !!a3.endContainer && !Y(a3.startContainer) && !Y(a3.endContainer) && aZ(a3.startContainer, a3.startOffset) && aZ(a3.endContainer, a3.endOffset))
		}

		function R(a3) {
			if (!az(a3)) {
				throw new Error("Range error: Range is no longer valid after DOM mutation (" + a3.inspect() + ")")
			}
		}

		var K = document.createElement("style");
		var aA = false;
		try {
			K.innerHTML = "<b>x</b>";
			aA = (K.firstChild.nodeType == 3)
		} catch (aV) {
		}
		S.features.htmlParsingConforms = aA;
		var aC = aA ? function (a5) {
				var a4 = this.startContainer;
				var a6 = a1(a4);
				if (!a4) {
					throw new aG("INVALID_STATE_ERR")
				}
				var a3 = null;
				if (a4.nodeType == 1) {
					a3 = a4
				} else {
					if (Q(a4)) {
						a3 = M.parentElement(a4)
					}
				}
				if (a3 === null || (a3.nodeName == "HTML" && M.isHtmlNamespace(a1(a3).documentElement) && M.isHtmlNamespace(a3))) {
					a3 = a6.createElement("body")
				} else {
					a3 = a3.cloneNode(false)
				}
				a3.innerHTML = a5;
				return M.fragmentFromNodeChildren(a3)
			} : function (a4) {
				var a5 = W(this);
				var a3 = a5.createElement("body");
				a3.innerHTML = a4;
				return M.fragmentFromNodeChildren(a3)
			};

		function aX(a5, a3) {
			R(a5);
			var a9 = a5.startContainer, a8 = a5.startOffset, a6 = a5.endContainer, a4 = a5.endOffset;
			var a7 = (a9 === a6);
			if (Q(a6) && a4 > 0 && a4 < a6.length) {
				aE(a6, a4, a3)
			}
			if (Q(a9) && a8 > 0 && a8 < a9.length) {
				a9 = aE(a9, a8, a3);
				if (a7) {
					a4 -= a8;
					a6 = a9
				} else {
					if (a6 == a9.parentNode && a4 >= ak(a9)) {
						a4++
					}
				}
				a8 = 0
			}
			a5.setStartAndEnd(a9, a8, a6, a4)
		}

		var aw = ["startContainer", "startOffset", "endContainer", "endOffset", "collapsed", "commonAncestorContainer"];
		var V = 0, ah = 1, aU = 2, aO = 3;
		var ad = 0, af = 1, at = 2, U = 3;
		aa.extend(S.rangePrototype, {
			compareBoundaryPoints: function (a8, a5) {
				R(this);
				N(this.startContainer, a5.startContainer);
				var ba, a4, a9, a3;
				var a7 = (a8 == aO || a8 == V) ? "start" : "end";
				var a6 = (a8 == ah || a8 == V) ? "start" : "end";
				ba = this[a7 + "Container"];
				a4 = this[a7 + "Offset"];
				a9 = a5[a6 + "Container"];
				a3 = a5[a6 + "Offset"];
				return aN(ba, a4, a9, a3)
			}, insertNode: function (a4) {
				R(this);
				aH(a4, ax);
				aP(this.startContainer);
				if (aQ(a4, this.startContainer)) {
					throw new aG("HIERARCHY_REQUEST_ERR")
				}
				var a3 = T(a4, this.startContainer, this.startOffset);
				this.setStartBefore(a3)
			}, cloneContents: function () {
				R(this);
				var a5, a4;
				if (this.collapsed) {
					return W(this).createDocumentFragment()
				} else {
					if (this.startContainer === this.endContainer && Q(this.startContainer)) {
						a5 = this.startContainer.cloneNode(true);
						a5.data = a5.data.slice(this.startOffset, this.endOffset);
						a4 = W(this).createDocumentFragment();
						a4.appendChild(a5);
						return a4
					} else {
						var a3 = new P(this, true);
						a5 = aq(a3);
						a3.detach()
					}
					return a5
				}
			}, canSurroundContents: function () {
				R(this);
				aP(this.startContainer);
				aP(this.endContainer);
				var a3 = new P(this, true);
				var a4 = (a3._first && (ag(a3._first, this)) || (a3._last && ag(a3._last, this)));
				a3.detach();
				return !a4
			}, surroundContents: function (a4) {
				aH(a4, ao);
				if (!this.canSurroundContents()) {
					throw new aG("INVALID_STATE_ERR")
				}
				var a3 = this.extractContents();
				if (a4.hasChildNodes()) {
					while (a4.lastChild) {
						a4.removeChild(a4.lastChild)
					}
				}
				T(a4, this.startContainer, this.startOffset);
				a4.appendChild(a3);
				this.selectNode(a4)
			}, cloneRange: function () {
				R(this);
				var a3 = new aY(W(this));
				var a4 = aw.length, a5;
				while (a4--) {
					a5 = aw[a4];
					a3[a5] = this[a5]
				}
				return a3
			}, toString: function () {
				R(this);
				var a5 = this.startContainer;
				if (a5 === this.endContainer && Q(a5)) {
					return (a5.nodeType == 3 || a5.nodeType == 4) ? a5.data.slice(this.startOffset, this.endOffset) : ""
				} else {
					var a3 = [], a4 = new P(this, true);
					aI(a4, function (a6) {
						if (a6.nodeType == 3 || a6.nodeType == 4) {
							a3.push(a6.data)
						}
					});
					a4.detach();
					return a3.join("")
				}
			}, compareNode: function (a5) {
				R(this);
				var a4 = a5.parentNode;
				var a7 = ak(a5);
				if (!a4) {
					throw new aG("NOT_FOUND_ERR")
				}
				var a6 = this.comparePoint(a4, a7), a3 = this.comparePoint(a4, a7 + 1);
				if (a6 < 0) {
					return (a3 > 0) ? at : ad
				} else {
					return (a3 > 0) ? af : U
				}
			}, comparePoint: function (a3, a4) {
				R(this);
				aW(a3, "HIERARCHY_REQUEST_ERR");
				N(a3, this.startContainer);
				if (aN(a3, a4, this.startContainer, this.startOffset) < 0) {
					return -1
				} else {
					if (aN(a3, a4, this.endContainer, this.endOffset) > 0) {
						return 1
					}
				}
				return 0
			}, createContextualFragment: aC, toHtml: function () {
				R(this);
				var a3 = this.commonAncestorContainer.parentNode.cloneNode(false);
				a3.appendChild(this.cloneContents());
				return a3.innerHTML
			}, intersectsNode: function (a6, a3) {
				R(this);
				aW(a6, "NOT_FOUND_ERR");
				if (a1(a6) !== W(this)) {
					return false
				}
				var a5 = a6.parentNode, a8 = ak(a6);
				aW(a5, "NOT_FOUND_ERR");
				var a7 = aN(a5, a8, this.endContainer, this.endOffset), a4 = aN(a5, a8 + 1, this.startContainer, this.startOffset);
				return a3 ? a7 <= 0 && a4 >= 0 : a7 < 0 && a4 > 0
			}, isPointInRange: function (a3, a4) {
				R(this);
				aW(a3, "HIERARCHY_REQUEST_ERR");
				N(a3, this.startContainer);
				return (aN(a3, a4, this.startContainer, this.startOffset) >= 0) && (aN(a3, a4, this.endContainer, this.endOffset) <= 0)
			}, intersectsRange: function (a3) {
				return a0(this, a3, false)
			}, intersectsOrTouchesRange: function (a3) {
				return a0(this, a3, true)
			}, intersection: function (a3) {
				if (this.intersectsRange(a3)) {
					var a6 = aN(this.startContainer, this.startOffset, a3.startContainer, a3.startOffset), a4 = aN(this.endContainer, this.endOffset, a3.endContainer, a3.endOffset);
					var a5 = this.cloneRange();
					if (a6 == -1) {
						a5.setStart(a3.startContainer, a3.startOffset)
					}
					if (a4 == 1) {
						a5.setEnd(a3.endContainer, a3.endOffset)
					}
					return a5
				}
				return null
			}, union: function (a3) {
				if (this.intersectsOrTouchesRange(a3)) {
					var a4 = this.cloneRange();
					if (aN(a3.startContainer, a3.startOffset, this.startContainer, this.startOffset) == -1) {
						a4.setStart(a3.startContainer, a3.startOffset)
					}
					if (aN(a3.endContainer, a3.endOffset, this.endContainer, this.endOffset) == 1) {
						a4.setEnd(a3.endContainer, a3.endOffset)
					}
					return a4
				} else {
					throw new aG("Ranges do not intersect")
				}
			}, containsNode: function (a4, a3) {
				if (a3) {
					return this.intersectsNode(a4, false)
				} else {
					return this.compareNode(a4) == U
				}
			}, containsNodeContents: function (a3) {
				return this.comparePoint(a3, 0) >= 0 && this.comparePoint(a3, aF(a3)) <= 0
			}, containsRange: function (a3) {
				var a4 = this.intersection(a3);
				return a4 !== null && a3.equals(a4)
			}, containsNodeText: function (a5) {
				var a6 = this.cloneRange();
				a6.selectNode(a5);
				var a4 = a6.getNodes([3]);
				if (a4.length > 0) {
					a6.setStart(a4[0], 0);
					var a3 = a4.pop();
					a6.setEnd(a3, a3.length);
					return this.containsRange(a6)
				} else {
					return this.containsNodeContents(a5)
				}
			}, getNodes: function (a3, a4) {
				R(this);
				return Z(this, a3, a4)
			}, getDocument: function () {
				return W(this)
			}, collapseBefore: function (a3) {
				this.setEndBefore(a3);
				this.collapse(false)
			}, collapseAfter: function (a3) {
				this.setStartAfter(a3);
				this.collapse(true)
			}, getBookmark: function (a3) {
				var a7 = W(this);
				var a5 = S.createRange(a7);
				a3 = a3 || M.getBody(a7);
				a5.selectNodeContents(a3);
				var a6 = this.intersection(a5);
				var a8 = 0, a4 = 0;
				if (a6) {
					a5.setEnd(a6.startContainer, a6.startOffset);
					a8 = a5.toString().length;
					a4 = a8 + a6.toString().length
				}
				return {start: a8, end: a4, containerNode: a3}
			}, moveToBookmark: function (ba) {
				var a6 = ba.containerNode;
				var a3 = 0;
				this.setStart(a6, 0);
				this.collapse(true);
				var a8 = [a6], a4, a5 = false, bb = false;
				var a9, a7, bc;
				while (!bb && (a4 = a8.pop())) {
					if (a4.nodeType == 3) {
						a9 = a3 + a4.length;
						if (!a5 && ba.start >= a3 && ba.start <= a9) {
							this.setStart(a4, ba.start - a3);
							a5 = true
						}
						if (a5 && ba.end >= a3 && ba.end <= a9) {
							this.setEnd(a4, ba.end - a3);
							bb = true
						}
						a3 = a9
					} else {
						bc = a4.childNodes;
						a7 = bc.length;
						while (a7--) {
							a8.push(bc[a7])
						}
					}
				}
			}, getName: function () {
				return "DomRange"
			}, equals: function (a3) {
				return aY.rangesEqual(this, a3)
			}, isValid: function () {
				return az(this)
			}, inspect: function () {
				return ai(this)
			}, detach: function () {
			}
		});
		function aD(a3) {
			a3.START_TO_START = V;
			a3.START_TO_END = ah;
			a3.END_TO_END = aU;
			a3.END_TO_START = aO;
			a3.NODE_BEFORE = ad;
			a3.NODE_AFTER = af;
			a3.NODE_BEFORE_AND_AFTER = at;
			a3.NODE_INSIDE = U
		}

		function ap(a3) {
			aD(a3);
			aD(a3.prototype)
		}

		function ab(a3, a4) {
			return function () {
				R(this);
				var ba = this.startContainer, a9 = this.startOffset, a5 = this.commonAncestorContainer;
				var a7 = new P(this, true);
				var a8, bb;
				if (ba !== a5) {
					a8 = aM(ba, a5, true);
					bb = aJ(a8);
					ba = bb.node;
					a9 = bb.offset
				}
				aI(a7, aP);
				a7.reset();
				var a6 = a3(a7);
				a7.detach();
				a4(this, ba, a9, ba, a9);
				return a6
			}
		}

		function aK(a4, a8) {
			function a7(ba, a9) {
				return function (bb) {
					aH(bb, aT);
					aH(ae(bb), aR);
					var bc = (ba ? aj : aJ)(bb);
					(a9 ? a3 : a6)(this, bc.node, bc.offset)
				}
			}

			function a3(ba, bc, bd) {
				var bb = ba.endContainer, a9 = ba.endOffset;
				if (bc !== ba.startContainer || bd !== ba.startOffset) {
					if (ae(bc) != ae(bb) || aN(bc, bd, bb, a9) == 1) {
						bb = bc;
						a9 = bd
					}
					a8(ba, bc, bd, bb, a9)
				}
			}

			function a6(a9, ba, bd) {
				var bc = a9.startContainer, bb = a9.startOffset;
				if (ba !== a9.endContainer || bd !== a9.endOffset) {
					if (ae(ba) != ae(bc) || aN(ba, bd, bc, bb) == -1) {
						bc = ba;
						bb = bd
					}
					a8(a9, bc, bb, ba, bd)
				}
			}

			var a5 = function () {
			};
			a5.prototype = S.rangePrototype;
			a4.prototype = new a5();
			aa.extend(a4.prototype, {
				setStart: function (a9, ba) {
					ac(a9, true);
					aS(a9, ba);
					a3(this, a9, ba)
				},
				setEnd: function (a9, ba) {
					ac(a9, true);
					aS(a9, ba);
					a6(this, a9, ba)
				},
				setStartAndEnd: function () {
					var bb = arguments;
					var bd = bb[0], bc = bb[1], ba = bd, a9 = bc;
					switch (bb.length) {
						case 3:
							a9 = bb[2];
							break;
						case 4:
							ba = bb[2];
							a9 = bb[3];
							break
					}
					a8(this, bd, bc, ba, a9)
				},
				setBoundary: function (ba, bb, a9) {
					this["set" + (a9 ? "Start" : "End")](ba, bb)
				},
				setStartBefore: a7(true, true),
				setStartAfter: a7(false, true),
				setEndBefore: a7(true, false),
				setEndAfter: a7(false, false),
				collapse: function (a9) {
					R(this);
					if (a9) {
						a8(this, this.startContainer, this.startOffset, this.startContainer, this.startOffset)
					} else {
						a8(this, this.endContainer, this.endOffset, this.endContainer, this.endOffset)
					}
				},
				selectNodeContents: function (a9) {
					ac(a9, true);
					a8(this, a9, 0, a9, aF(a9))
				},
				selectNode: function (ba) {
					ac(ba, false);
					aH(ba, aT);
					var bb = aj(ba), a9 = aJ(ba);
					a8(this, bb.node, bb.offset, a9.node, a9.offset)
				},
				extractContents: ab(aB, a8),
				deleteContents: ab(X, a8),
				canSurroundContents: function () {
					R(this);
					aP(this.startContainer);
					aP(this.endContainer);
					var a9 = new P(this, true);
					var ba = (a9._first && ag(a9._first, this) || (a9._last && ag(a9._last, this)));
					a9.detach();
					return !ba
				},
				splitBoundaries: function () {
					aX(this)
				},
				splitBoundariesPreservingPositions: function (a9) {
					aX(this, a9)
				},
				normalizeBoundaries: function () {
					R(this);
					var bg = this.startContainer, bb = this.startOffset, bf = this.endContainer, a9 = this.endOffset;
					var bc = function (bj) {
						var bi = bj.nextSibling;
						if (bi && bi.nodeType == bj.nodeType) {
							bf = bj;
							a9 = bj.length;
							bj.appendData(bi.data);
							bi.parentNode.removeChild(bi)
						}
					};
					var bh = function (bk) {
						var bj = bk.previousSibling;
						if (bj && bj.nodeType == bk.nodeType) {
							bg = bk;
							var bi = bk.length;
							bb = bj.length;
							bk.insertData(0, bj.data);
							bj.parentNode.removeChild(bj);
							if (bg == bf) {
								a9 += bb;
								bf = bg
							} else {
								if (bf == bk.parentNode) {
									var bl = ak(bk);
									if (a9 == bl) {
										bf = bk;
										a9 = bi
									} else {
										if (a9 > bl) {
											a9--
										}
									}
								}
							}
						}
					};
					var be = true;
					if (Q(bf)) {
						if (bf.length == a9) {
							bc(bf)
						}
					} else {
						if (a9 > 0) {
							var bd = bf.childNodes[a9 - 1];
							if (bd && Q(bd)) {
								bc(bd)
							}
						}
						be = !this.collapsed
					}
					if (be) {
						if (Q(bg)) {
							if (bb == 0) {
								bh(bg)
							}
						} else {
							if (bb < bg.childNodes.length) {
								var ba = bg.childNodes[bb];
								if (ba && Q(ba)) {
									bh(ba)
								}
							}
						}
					} else {
						bg = bf;
						bb = a9
					}
					a8(this, bg, bb, bf, a9)
				},
				collapseToPoint: function (a9, ba) {
					ac(a9, true);
					aS(a9, ba);
					this.setStartAndEnd(a9, ba)
				}
			});
			ap(a4)
		}

		function ay(a3) {
			a3.collapsed = (a3.startContainer === a3.endContainer && a3.startOffset === a3.endOffset);
			a3.commonAncestorContainer = a3.collapsed ? a3.startContainer : M.getCommonAncestor(a3.startContainer, a3.endContainer)
		}

		function am(a4, a6, a3, a7, a5) {
			a4.startContainer = a6;
			a4.startOffset = a3;
			a4.endContainer = a7;
			a4.endOffset = a5;
			a4.document = M.getDocument(a6);
			ay(a4)
		}

		function aY(a3) {
			this.startContainer = a3;
			this.startOffset = 0;
			this.endContainer = a3;
			this.endOffset = 0;
			this.document = a3;
			ay(this)
		}

		aK(aY, am);
		aa.extend(aY, {
			rangeProperties: aw,
			RangeIterator: P,
			copyComparisonConstants: ap,
			createPrototypeRange: aK,
			inspect: ai,
			getRangeDocument: W,
			rangesEqual: function (a4, a3) {
				return a4.startContainer === a3.startContainer && a4.startOffset === a3.startOffset && a4.endContainer === a3.endContainer && a4.endOffset === a3.endOffset
			}
		});
		S.DomRange = aY
	});
	b.rangy.createCoreModule("WrappedRange", ["DomRange"], function (W, O) {
		var K, L;
		var S = W.dom;
		var T = W.util;
		var N = S.DomPosition;
		var X = W.DomRange;
		var U = S.getBody;
		var Z = S.getContentDocument;
		var V = S.isCharacterDataNode;
		if (W.features.implementsDomRange) {
			(function () {
				var ad;
				var ak = X.rangeProperties;

				function aa(am) {
					var an = ak.length, ao;
					while (an--) {
						ao = ak[an];
						am[ao] = am.nativeRange[ao]
					}
					am.collapsed = (am.startContainer === am.endContainer && am.startOffset === am.endOffset)
				}

				function af(ao, ar, an, at, ap) {
					var am = (ao.startContainer !== ar || ao.startOffset != an);
					var au = (ao.endContainer !== at || ao.endOffset != ap);
					var aq = !ao.equals(ao.nativeRange);
					if (am || au || aq) {
						ao.setEnd(at, ap);
						ao.setStart(ar, an)
					}
				}

				var ac;
				K = function (am) {
					if (!am) {
						throw O.createError("WrappedRange: Range must be specified")
					}
					this.nativeRange = am;
					aa(this)
				};
				X.createPrototypeRange(K, af);
				ad = K.prototype;
				ad.selectNode = function (am) {
					this.nativeRange.selectNode(am);
					aa(this)
				};
				ad.cloneContents = function () {
					return this.nativeRange.cloneContents()
				};
				ad.surroundContents = function (am) {
					this.nativeRange.surroundContents(am);
					aa(this)
				};
				ad.collapse = function (am) {
					this.nativeRange.collapse(am);
					aa(this)
				};
				ad.cloneRange = function () {
					return new K(this.nativeRange.cloneRange())
				};
				ad.refresh = function () {
					aa(this)
				};
				ad.toString = function () {
					return this.nativeRange.toString()
				};
				var aj = document.createTextNode("test");
				U(document).appendChild(aj);
				var ag = document.createRange();
				ag.setStart(aj, 0);
				ag.setEnd(aj, 0);
				try {
					ag.setStart(aj, 1);
					ad.setStart = function (am, an) {
						this.nativeRange.setStart(am, an);
						aa(this)
					};
					ad.setEnd = function (am, an) {
						this.nativeRange.setEnd(am, an);
						aa(this)
					};
					ac = function (am) {
						return function (an) {
							this.nativeRange[am](an);
							aa(this)
						}
					}
				} catch (ai) {
					ad.setStart = function (an, ao) {
						try {
							this.nativeRange.setStart(an, ao)
						} catch (am) {
							this.nativeRange.setEnd(an, ao);
							this.nativeRange.setStart(an, ao)
						}
						aa(this)
					};
					ad.setEnd = function (an, ao) {
						try {
							this.nativeRange.setEnd(an, ao)
						} catch (am) {
							this.nativeRange.setStart(an, ao);
							this.nativeRange.setEnd(an, ao)
						}
						aa(this)
					};
					ac = function (am, an) {
						return function (ap) {
							try {
								this.nativeRange[am](ap)
							} catch (ao) {
								this.nativeRange[an](ap);
								this.nativeRange[am](ap)
							}
							aa(this)
						}
					}
				}
				ad.setStartBefore = ac("setStartBefore", "setEndBefore");
				ad.setStartAfter = ac("setStartAfter", "setEndAfter");
				ad.setEndBefore = ac("setEndBefore", "setStartBefore");
				ad.setEndAfter = ac("setEndAfter", "setStartAfter");
				ad.selectNodeContents = function (am) {
					this.setStartAndEnd(am, 0, S.getNodeLength(am))
				};
				ag.selectNodeContents(aj);
				ag.setEnd(aj, 3);
				var al = document.createRange();
				al.selectNodeContents(aj);
				al.setEnd(aj, 4);
				al.setStart(aj, 2);
				if (ag.compareBoundaryPoints(ag.START_TO_END, al) == -1 && ag.compareBoundaryPoints(ag.END_TO_START, al) == 1) {
					ad.compareBoundaryPoints = function (an, am) {
						am = am.nativeRange || am;
						if (an == am.START_TO_END) {
							an = am.END_TO_START
						} else {
							if (an == am.END_TO_START) {
								an = am.START_TO_END
							}
						}
						return this.nativeRange.compareBoundaryPoints(an, am)
					}
				} else {
					ad.compareBoundaryPoints = function (an, am) {
						return this.nativeRange.compareBoundaryPoints(an, am.nativeRange || am)
					}
				}
				var ab = document.createElement("div");
				ab.innerHTML = "123";
				var ae = ab.firstChild;
				var ah = U(document);
				ah.appendChild(ab);
				ag.setStart(ae, 1);
				ag.setEnd(ae, 2);
				ag.deleteContents();
				if (ae.data == "13") {
					ad.deleteContents = function () {
						this.nativeRange.deleteContents();
						aa(this)
					};
					ad.extractContents = function () {
						var am = this.nativeRange.extractContents();
						aa(this);
						return am
					}
				} else {
				}
				ah.removeChild(ab);
				ah = null;
				if (T.isHostMethod(ag, "createContextualFragment")) {
					ad.createContextualFragment = function (am) {
						return this.nativeRange.createContextualFragment(am)
					}
				}
				U(document).removeChild(aj);
				ad.getName = function () {
					return "WrappedRange"
				};
				W.WrappedRange = K;
				W.createNativeRange = function (am) {
					am = Z(am, O, "createNativeRange");
					return am.createRange()
				}
			})()
		}
		if (W.features.implementsTextRange) {
			var P = function (af) {
				var ad = af.parentElement();
				var ab = af.duplicate();
				ab.collapse(true);
				var ae = ab.parentElement();
				ab = af.duplicate();
				ab.collapse(false);
				var ac = ab.parentElement();
				var aa = (ae == ac) ? ae : S.getCommonAncestor(ae, ac);
				return aa == ad ? aa : S.getCommonAncestor(ad, aa)
			};
			var M = function (aa) {
				return aa.compareEndPoints("StartToEnd", aa) == 0
			};
			var Q = function (aa, am, ak, ab, ae) {
				var an = aa.duplicate();
				an.collapse(ak);
				var ac = an.parentElement();
				if (!S.isOrIsAncestorOf(am, ac)) {
					ac = am
				}
				if (!ac.canHaveHTML) {
					var aj = new N(ac.parentNode, S.getNodeIndex(ac));
					return {boundaryPosition: aj, nodeInfo: {nodeIndex: aj.offset, containerElement: aj.node}}
				}
				var ad = S.getDocument(ac).createElement("span");
				if (ad.parentNode) {
					ad.parentNode.removeChild(ad)
				}
				var aw, au = ak ? "StartToStart" : "StartToEnd";
				var ao, af, al, ap;
				var ah = (ae && ae.containerElement == ac) ? ae.nodeIndex : 0;
				var aq = ac.childNodes.length;
				var ag = aq;
				var at = ag;
				while (true) {
					if (at == aq) {
						ac.appendChild(ad)
					} else {
						ac.insertBefore(ad, ac.childNodes[at])
					}
					an.moveToElementText(ad);
					aw = an.compareEndPoints(au, aa);
					if (aw == 0 || ah == ag) {
						break
					} else {
						if (aw == -1) {
							if (ag == ah + 1) {
								break
							} else {
								ah = at
							}
						} else {
							ag = (ag == ah + 1) ? ah : at
						}
					}
					at = Math.floor((ah + ag) / 2);
					ac.removeChild(ad)
				}
				ap = ad.nextSibling;
				if (aw == -1 && ap && V(ap)) {
					an.setEndPoint(ak ? "EndToStart" : "EndToEnd", aa);
					var ai;
					if (/[\r\n]/.test(ap.data)) {
						var ar = an.duplicate();
						var av = ar.text.replace(/\r\n/g, "\r").length;
						ai = ar.moveStart("character", av);
						while ((aw = ar.compareEndPoints("StartToEnd", ar)) == -1) {
							ai++;
							ar.moveStart("character", 1)
						}
					} else {
						ai = an.text.length
					}
					al = new N(ap, ai)
				} else {
					ao = (ab || !ak) && ad.previousSibling;
					af = (ab || ak) && ad.nextSibling;
					if (af && V(af)) {
						al = new N(af, 0)
					} else {
						if (ao && V(ao)) {
							al = new N(ao, ao.data.length)
						} else {
							al = new N(ac, S.getNodeIndex(ad))
						}
					}
				}
				ad.parentNode.removeChild(ad);
				return {boundaryPosition: al, nodeInfo: {nodeIndex: at, containerElement: ac}}
			};
			var Y = function (aa, ac) {
				var ad, ag, ae = aa.offset;
				var ah = S.getDocument(aa.node);
				var ab, ai, aj = U(ah).createTextRange();
				var af = V(aa.node);
				if (af) {
					ad = aa.node;
					ag = ad.parentNode
				} else {
					ai = aa.node.childNodes;
					ad = (ae < ai.length) ? ai[ae] : null;
					ag = aa.node
				}
				ab = ah.createElement("span");
				ab.innerHTML = "&#feff;";
				if (ad) {
					ag.insertBefore(ab, ad)
				} else {
					ag.appendChild(ab)
				}
				aj.moveToElementText(ab);
				aj.collapse(!ac);
				ag.removeChild(ab);
				if (af) {
					aj[ac ? "moveStart" : "moveEnd"]("character", ae)
				}
				return aj
			};
			L = function (aa) {
				this.textRange = aa;
				this.refresh()
			};
			L.prototype = new X(document);
			L.prototype.refresh = function () {
				var ad, aa, ac;
				var ab = P(this.textRange);
				if (M(this.textRange)) {
					aa = ad = Q(this.textRange, ab, true, true).boundaryPosition
				} else {
					ac = Q(this.textRange, ab, true, false);
					ad = ac.boundaryPosition;
					aa = Q(this.textRange, ab, false, false, ac.nodeInfo).boundaryPosition
				}
				this.setStart(ad.node, ad.offset);
				this.setEnd(aa.node, aa.offset)
			};
			L.prototype.getName = function () {
				return "WrappedTextRange"
			};
			X.copyComparisonConstants(L);
			L.rangeToTextRange = function (aa) {
				if (aa.collapsed) {
					return Y(new N(aa.startContainer, aa.startOffset), true)
				} else {
					var ad = Y(new N(aa.startContainer, aa.startOffset), true);
					var ac = Y(new N(aa.endContainer, aa.endOffset), false);
					var ab = U(X.getRangeDocument(aa)).createTextRange();
					ab.setEndPoint("StartToStart", ad);
					ab.setEndPoint("EndToEnd", ac);
					return ab
				}
			};
			W.WrappedTextRange = L;
			if (!W.features.implementsDomRange || W.config.preferTextRange) {
				var R = (function () {
					return this
				})();
				if (typeof R.Range == "undefined") {
					R.Range = L
				}
				W.createNativeRange = function (aa) {
					aa = Z(aa, O, "createNativeRange");
					return U(aa).createTextRange()
				};
				W.WrappedRange = L
			}
		}
		W.createRange = function (aa) {
			aa = Z(aa, O, "createRange");
			return new W.WrappedRange(W.createNativeRange(aa))
		};
		W.createRangyRange = function (aa) {
			aa = Z(aa, O, "createRangyRange");
			return new X(aa)
		};
		W.createIframeRange = function (aa) {
			O.deprecationNotice("createIframeRange()", "createRange(iframeEl)");
			return W.createRange(aa)
		};
		W.createIframeRangyRange = function (aa) {
			O.deprecationNotice("createIframeRangyRange()", "createRangyRange(iframeEl)");
			return W.createRangyRange(aa)
		};
		W.addCreateMissingNativeApiListener(function (ab) {
			var aa = ab.document;
			if (typeof aa.createRange == "undefined") {
				aa.createRange = function () {
					return W.createRange(aa)
				}
			}
			aa = ab = null
		})
	});
	b.rangy.createCoreModule("WrappedSelection", ["DomRange", "WrappedRange"], function (T, N) {
		T.config.checkSelectionRanges = true;
		var at = "boolean";
		var aw = "number";
		var M = T.dom;
		var Y = T.util;
		var aH = Y.isHostMethod;
		var aL = T.DomRange;
		var P = T.WrappedRange;
		var aG = T.DOMException;
		var an = M.DomPosition;
		var aD;
		var aa;
		var X = T.features;
		var aT = "Control";
		var aS = M.getDocument;
		var aR = M.getBody;
		var ay = aL.rangesEqual;

		function Q(aV) {
			return (typeof aV == "string") ? /^backward(s)?$/i.test(aV) : !!aV
		}

		function aj(aX, aV) {
			if (!aX) {
				return window
			} else {
				if (M.isWindow(aX)) {
					return aX
				} else {
					if (aX instanceof ap) {
						return aX.win
					} else {
						var aW = M.getContentDocument(aX, N, aV);
						return M.getWindow(aW)
					}
				}
			}
		}

		function Z(aV) {
			return aj(aV, "getWinSelection").getSelection()
		}

		function ad(aV) {
			return aj(aV, "getDocSelection").document.selection
		}

		function aQ(aV) {
			var aW = false;
			if (aV.anchorNode) {
				aW = (M.comparePoints(aV.anchorNode, aV.anchorOffset, aV.focusNode, aV.focusOffset) == 1)
			}
			return aW
		}

		var aO = aH(window, "getSelection"), aF = Y.isHostObject(document, "selection");
		X.implementsWinGetSelection = aO;
		X.implementsDocSelection = aF;
		var ag = aF && (!aO || T.config.preferTextRange);
		if (ag) {
			aD = ad;
			T.isSelectionValid = function (aW) {
				var aX = aj(aW, "isSelectionValid").document, aV = aX.selection;
				return (aV.type != "None" || aS(aV.createRange().parentElement()) == aX)
			}
		} else {
			if (aO) {
				aD = Z;
				T.isSelectionValid = function () {
					return true
				}
			} else {
				N.fail("Neither document.selection or window.getSelection() detected.")
			}
		}
		T.getNativeSelection = aD;
		var aE = aD();
		var aq = T.createNativeRange(document);
		var ar = aR(document);
		var aB = Y.areHostProperties(aE, ["anchorNode", "focusNode", "anchorOffset", "focusOffset"]);
		X.selectionHasAnchorAndFocus = aB;
		var ac = aH(aE, "extend");
		X.selectionHasExtend = ac;
		var aU = (typeof aE.rangeCount == aw);
		X.selectionHasRangeCount = aU;
		var aK = false;
		var aI = true;
		var ak = ac ? function (aY, aV) {
				var aX = aL.getRangeDocument(aV);
				var aW = T.createRange(aX);
				aW.collapseToPoint(aV.endContainer, aV.endOffset);
				aY.addRange(aA(aW));
				aY.extend(aV.startContainer, aV.startOffset)
			} : null;
		if (Y.areHostMethods(aE, ["addRange", "getRangeAt", "removeAllRanges"]) && typeof aE.rangeCount == aw && X.implementsDomRange) {
			(function () {
				var aW = window.getSelection();
				if (aW) {
					var a0 = aW.rangeCount;
					var a2 = (a0 > 1);
					var a4 = [];
					var a5 = aQ(aW);
					for (var a1 = 0; a1 < a0; ++a1) {
						a4[a1] = aW.getRangeAt(a1)
					}
					var a3 = aR(document);
					var aZ = a3.appendChild(document.createElement("div"));
					aZ.contentEditable = "false";
					var aY = aZ.appendChild(document.createTextNode("\u00a0\u00a0\u00a0"));
					var aX = document.createRange();
					aX.setStart(aY, 1);
					aX.collapse(true);
					aW.addRange(aX);
					aI = (aW.rangeCount == 1);
					aW.removeAllRanges();
					if (!a2) {
						var aV = aX.cloneRange();
						aX.setStart(aY, 0);
						aV.setEnd(aY, 3);
						aV.setStart(aY, 2);
						aW.addRange(aX);
						aW.addRange(aV);
						aK = (aW.rangeCount == 2);
						aV.detach()
					}
					a3.removeChild(aZ);
					aW.removeAllRanges();
					for (a1 = 0; a1 < a0; ++a1) {
						if (a1 == 0 && a5) {
							if (ak) {
								ak(aW, a4[a1])
							} else {
								T.warn("Rangy initialization: original selection was backwards but selection has been restored forwards because the browser does not support Selection.extend");
								aW.addRange(a4[a1])
							}
						} else {
							aW.addRange(a4[a1])
						}
					}
				}
			})()
		}
		X.selectionSupportsMultipleRanges = aK;
		X.collapsedNonEditableSelectionsSupported = aI;
		var S = false, V;
		if (ar && aH(ar, "createControlRange")) {
			V = ar.createControlRange();
			if (Y.areHostProperties(V, ["item", "add"])) {
				S = true
			}
		}
		X.implementsControlRange = S;
		if (aB) {
			aa = function (aV) {
				return aV.anchorNode === aV.focusNode && aV.anchorOffset === aV.focusOffset
			}
		} else {
			aa = function (aV) {
				return aV.rangeCount ? aV.getRangeAt(aV.rangeCount - 1).collapsed : false
			}
		}
		function L(aX, aV, aY) {
			var aW = aY ? "end" : "start", aZ = aY ? "start" : "end";
			aX.anchorNode = aV[aW + "Container"];
			aX.anchorOffset = aV[aW + "Offset"];
			aX.focusNode = aV[aZ + "Container"];
			aX.focusOffset = aV[aZ + "Offset"]
		}

		function ai(aW) {
			var aV = aW.nativeSelection;
			aW.anchorNode = aV.anchorNode;
			aW.anchorOffset = aV.anchorOffset;
			aW.focusNode = aV.focusNode;
			aW.focusOffset = aV.focusOffset
		}

		function ax(aV) {
			aV.anchorNode = aV.focusNode = null;
			aV.anchorOffset = aV.focusOffset = 0;
			aV.rangeCount = 0;
			aV.isCollapsed = true;
			aV._ranges.length = 0
		}

		function aA(aV) {
			var aW;
			if (aV instanceof aL) {
				aW = T.createNativeRange(aV.getDocument());
				aW.setEnd(aV.endContainer, aV.endOffset);
				aW.setStart(aV.startContainer, aV.startOffset)
			} else {
				if (aV instanceof P) {
					aW = aV.nativeRange
				} else {
					if (X.implementsDomRange && (aV instanceof M.getWindow(aV.startContainer).Range)) {
						aW = aV
					}
				}
			}
			return aW
		}

		function W(aX) {
			if (!aX.length || aX[0].nodeType != 1) {
				return false
			}
			for (var aW = 1, aV = aX.length; aW < aV; ++aW) {
				if (!M.isAncestorOf(aX[0], aX[aW])) {
					return false
				}
			}
			return true
		}

		function aC(aW) {
			var aV = aW.getNodes();
			if (!W(aV)) {
				throw N.createError("getSingleElementFromRange: range " + aW.inspect() + " did not consist of a single element")
			}
			return aV[0]
		}

		function av(aV) {
			return !!aV && typeof aV.text != "undefined"
		}

		function az(aX, aW) {
			var aV = new P(aW);
			aX._ranges = [aV];
			L(aX, aV, false);
			aX.rangeCount = 1;
			aX.isCollapsed = aV.collapsed
		}

		function af(aY) {
			aY._ranges.length = 0;
			if (aY.docSelection.type == "None") {
				ax(aY)
			} else {
				var aX = aY.docSelection.createRange();
				if (av(aX)) {
					az(aY, aX)
				} else {
					aY.rangeCount = aX.length;
					var aV, aZ = aS(aX.item(0));
					for (var aW = 0; aW < aY.rangeCount; ++aW) {
						aV = T.createRange(aZ);
						aV.selectNode(aX.item(aW));
						aY._ranges.push(aV)
					}
					aY.isCollapsed = aY.rangeCount == 1 && aY._ranges[0].collapsed;
					L(aY, aY._ranges[aY.rangeCount - 1], false)
				}
			}
		}

		function am(aW, aZ) {
			var aX = aW.docSelection.createRange();
			var aV = aC(aZ);
			var a3 = aS(aX.item(0));
			var a0 = aR(a3).createControlRange();
			for (var aY = 0, a1 = aX.length; aY < a1; ++aY) {
				a0.add(aX.item(aY))
			}
			try {
				a0.add(aV)
			} catch (a2) {
				throw N.createError("addRange(): Element within the specified Range could not be added to control selection (does it have layout?)")
			}
			a0.select();
			af(aW)
		}

		var ab;
		if (aH(aE, "getRangeAt")) {
			ab = function (aX, aV) {
				try {
					return aX.getRangeAt(aV)
				} catch (aW) {
					return null
				}
			}
		} else {
			if (aB) {
				ab = function (aW) {
					var aX = aS(aW.anchorNode);
					var aV = T.createRange(aX);
					aV.setStartAndEnd(aW.anchorNode, aW.anchorOffset, aW.focusNode, aW.focusOffset);
					if (aV.collapsed !== this.isCollapsed) {
						aV.setStartAndEnd(aW.focusNode, aW.focusOffset, aW.anchorNode, aW.anchorOffset)
					}
					return aV
				}
			}
		}
		function ap(aV, aX, aW) {
			this.nativeSelection = aV;
			this.docSelection = aX;
			this._ranges = [];
			this.win = aW;
			this.refresh()
		}

		ap.prototype = T.selectionPrototype;
		function al(aV) {
			aV.win = aV.anchorNode = aV.focusNode = aV._ranges = null;
			aV.rangeCount = aV.anchorOffset = aV.focusOffset = 0;
			aV.detached = true
		}

		var aP = [];

		function aJ(aZ, aY) {
			var aV = aP.length, aW, aX;
			while (aV--) {
				aW = aP[aV];
				aX = aW.selection;
				if (aY == "deleteAll") {
					al(aX)
				} else {
					if (aW.win == aZ) {
						if (aY == "delete") {
							aP.splice(aV, 1);
							return true
						} else {
							return aX
						}
					}
				}
			}
			if (aY == "deleteAll") {
				aP.length = 0
			}
			return null
		}

		var ah = function (aX) {
			if (aX && aX instanceof ap) {
				aX.refresh();
				return aX
			}
			aX = aj(aX, "getNativeSelection");
			var aW = aJ(aX);
			var aV = aD(aX), aY = aF ? ad(aX) : null;
			if (aW) {
				aW.nativeSelection = aV;
				aW.docSelection = aY;
				aW.refresh()
			} else {
				aW = new ap(aV, aY, aX);
				aP.push({win: aX, selection: aW})
			}
			return aW
		};
		T.getSelection = ah;
		T.getIframeSelection = function (aV) {
			N.deprecationNotice("getIframeSelection()", "getSelection(iframeEl)");
			return T.getSelection(M.getIframeWindow(aV))
		};
		var K = ap.prototype;

		function U(a1, aW) {
			var a2 = aS(aW[0].startContainer);
			var aZ = aR(a2).createControlRange();
			for (var aY = 0, a0, aV = aW.length; aY < aV; ++aY) {
				a0 = aC(aW[aY]);
				try {
					aZ.add(a0)
				} catch (aX) {
					throw N.createError("setRanges(): Element within one of the specified Ranges could not be added to control selection (does it have layout?)")
				}
			}
			aZ.select();
			af(a1)
		}

		if (!ag && aB && Y.areHostMethods(aE, ["removeAllRanges", "addRange"])) {
			K.removeAllRanges = function () {
				this.nativeSelection.removeAllRanges();
				ax(this)
			};
			var O = function (aW, aV) {
				ak(aW.nativeSelection, aV);
				aW.refresh()
			};
			if (aU) {
				K.addRange = function (aV, aY) {
					if (S && aF && this.docSelection.type == aT) {
						am(this, aV)
					} else {
						if (Q(aY) && ac) {
							O(this, aV)
						} else {
							var aW;
							if (aK) {
								aW = this.rangeCount
							} else {
								this.removeAllRanges();
								aW = 0
							}
							this.nativeSelection.addRange(aA(aV).cloneRange());
							this.rangeCount = this.nativeSelection.rangeCount;
							if (this.rangeCount == aW + 1) {
								if (T.config.checkSelectionRanges) {
									var aX = ab(this.nativeSelection, this.rangeCount - 1);
									if (aX && !ay(aX, aV)) {
										aV = new P(aX)
									}
								}
								this._ranges[this.rangeCount - 1] = aV;
								L(this, aV, R(this.nativeSelection));
								this.isCollapsed = aa(this)
							} else {
								this.refresh()
							}
						}
					}
				}
			} else {
				K.addRange = function (aV, aW) {
					if (Q(aW) && ac) {
						O(this, aV)
					} else {
						this.nativeSelection.addRange(aA(aV));
						this.refresh()
					}
				}
			}
			K.setRanges = function (aW) {
				if (S && aW.length > 1) {
					U(this, aW)
				} else {
					this.removeAllRanges();
					for (var aX = 0, aV = aW.length; aX < aV; ++aX) {
						this.addRange(aW[aX])
					}
				}
			}
		} else {
			if (aH(aE, "empty") && aH(aq, "select") && S && ag) {
				K.removeAllRanges = function () {
					try {
						this.docSelection.empty();
						if (this.docSelection.type != "None") {
							var aY;
							if (this.anchorNode) {
								aY = aS(this.anchorNode)
							} else {
								if (this.docSelection.type == aT) {
									var aW = this.docSelection.createRange();
									if (aW.length) {
										aY = aS(aW.item(0))
									}
								}
							}
							if (aY) {
								var aX = aR(aY).createTextRange();
								aX.select();
								this.docSelection.empty()
							}
						}
					} catch (aV) {
					}
					ax(this)
				};
				K.addRange = function (aV) {
					if (this.docSelection.type == aT) {
						am(this, aV)
					} else {
						T.WrappedTextRange.rangeToTextRange(aV).select();
						this._ranges[0] = aV;
						this.rangeCount = 1;
						this.isCollapsed = this._ranges[0].collapsed;
						L(this, aV, false)
					}
				};
				K.setRanges = function (aV) {
					this.removeAllRanges();
					var aW = aV.length;
					if (aW > 1) {
						U(this, aV)
					} else {
						if (aW) {
							this.addRange(aV[0])
						}
					}
				}
			} else {
				N.fail("No means of selecting a Range or TextRange was found");
				return false
			}
		}
		K.getRangeAt = function (aV) {
			if (aV < 0 || aV >= this.rangeCount) {
				throw new aG("INDEX_SIZE_ERR")
			} else {
				return this._ranges[aV].cloneRange()
			}
		};
		var au;
		if (ag) {
			au = function (aW) {
				var aV;
				if (T.isSelectionValid(aW.win)) {
					aV = aW.docSelection.createRange()
				} else {
					aV = aR(aW.win.document).createTextRange();
					aV.collapse(true)
				}
				if (aW.docSelection.type == aT) {
					af(aW)
				} else {
					if (av(aV)) {
						az(aW, aV)
					} else {
						ax(aW)
					}
				}
			}
		} else {
			if (aH(aE, "getRangeAt") && typeof aE.rangeCount == aw) {
				au = function (aX) {
					if (S && aF && aX.docSelection.type == aT) {
						af(aX)
					} else {
						aX._ranges.length = aX.rangeCount = aX.nativeSelection.rangeCount;
						if (aX.rangeCount) {
							for (var aW = 0, aV = aX.rangeCount; aW < aV; ++aW) {
								aX._ranges[aW] = new T.WrappedRange(aX.nativeSelection.getRangeAt(aW))
							}
							L(aX, aX._ranges[aX.rangeCount - 1], R(aX.nativeSelection));
							aX.isCollapsed = aa(aX)
						} else {
							ax(aX)
						}
					}
				}
			} else {
				if (aB && typeof aE.isCollapsed == at && typeof aq.collapsed == at && X.implementsDomRange) {
					au = function (aX) {
						var aV, aW = aX.nativeSelection;
						if (aW.anchorNode) {
							aV = ab(aW, 0);
							aX._ranges = [aV];
							aX.rangeCount = 1;
							ai(aX);
							aX.isCollapsed = aa(aX)
						} else {
							ax(aX)
						}
					}
				} else {
					N.fail("No means of obtaining a Range or TextRange from the user's selection was found");
					return false
				}
			}
		}
		K.refresh = function (aW) {
			var aV = aW ? this._ranges.slice(0) : null;
			var aY = this.anchorNode, aZ = this.anchorOffset;
			au(this);
			if (aW) {
				var aX = aV.length;
				if (aX != this._ranges.length) {
					return true
				}
				if (this.anchorNode != aY || this.anchorOffset != aZ) {
					return true
				}
				while (aX--) {
					if (!ay(aV[aX], this._ranges[aX])) {
						return true
					}
				}
				return false
			}
		};
		var ao = function (aZ, aX) {
			var aW = aZ.getAllRanges();
			aZ.removeAllRanges();
			for (var aY = 0, aV = aW.length; aY < aV; ++aY) {
				if (!ay(aX, aW[aY])) {
					aZ.addRange(aW[aY])
				}
			}
			if (!aZ.rangeCount) {
				ax(aZ)
			}
		};
		if (S) {
			K.removeRange = function (aZ) {
				if (this.docSelection.type == aT) {
					var aX = this.docSelection.createRange();
					var aV = aC(aZ);
					var a3 = aS(aX.item(0));
					var a1 = aR(a3).createControlRange();
					var aW, a2 = false;
					for (var aY = 0, a0 = aX.length; aY < a0; ++aY) {
						aW = aX.item(aY);
						if (aW !== aV || a2) {
							a1.add(aX.item(aY))
						} else {
							a2 = true
						}
					}
					a1.select();
					af(this)
				} else {
					ao(this, aZ)
				}
			}
		} else {
			K.removeRange = function (aV) {
				ao(this, aV)
			}
		}
		var R;
		if (!ag && aB && X.implementsDomRange) {
			R = aQ;
			K.isBackward = function () {
				return R(this)
			}
		} else {
			R = K.isBackward = function () {
				return false
			}
		}
		K.isBackwards = K.isBackward;
		K.toString = function () {
			var aX = [];
			for (var aW = 0, aV = this.rangeCount; aW < aV; ++aW) {
				aX[aW] = "" + this._ranges[aW]
			}
			return aX.join("")
		};
		function aM(aW, aV) {
			if (aW.win.document != aS(aV)) {
				throw new aG("WRONG_DOCUMENT_ERR")
			}
		}

		K.collapse = function (aW, aX) {
			aM(this, aW);
			var aV = T.createRange(aW);
			aV.collapseToPoint(aW, aX);
			this.setSingleRange(aV);
			this.isCollapsed = true
		};
		K.collapseToStart = function () {
			if (this.rangeCount) {
				var aV = this._ranges[0];
				this.collapse(aV.startContainer, aV.startOffset)
			} else {
				throw new aG("INVALID_STATE_ERR")
			}
		};
		K.collapseToEnd = function () {
			if (this.rangeCount) {
				var aV = this._ranges[this.rangeCount - 1];
				this.collapse(aV.endContainer, aV.endOffset)
			} else {
				throw new aG("INVALID_STATE_ERR")
			}
		};
		K.selectAllChildren = function (aW) {
			aM(this, aW);
			var aV = T.createRange(aW);
			aV.selectNodeContents(aW);
			this.setSingleRange(aV)
		};
		K.deleteFromDocument = function () {
			if (S && aF && this.docSelection.type == aT) {
				var aZ = this.docSelection.createRange();
				var aY;
				while (aZ.length) {
					aY = aZ.item(0);
					aZ.remove(aY);
					aY.parentNode.removeChild(aY)
				}
				this.refresh()
			} else {
				if (this.rangeCount) {
					var aW = this.getAllRanges();
					if (aW.length) {
						this.removeAllRanges();
						for (var aX = 0, aV = aW.length; aX < aV; ++aX) {
							aW[aX].deleteContents()
						}
						this.addRange(aW[aV - 1])
					}
				}
			}
		};
		K.eachRange = function (aY, aX) {
			for (var aW = 0, aV = this._ranges.length; aW < aV; ++aW) {
				if (aY(this.getRangeAt(aW))) {
					return aX
				}
			}
		};
		K.getAllRanges = function () {
			var aV = [];
			this.eachRange(function (aW) {
				aV.push(aW)
			});
			return aV
		};
		K.setSingleRange = function (aV, aW) {
			this.removeAllRanges();
			this.addRange(aV, aW)
		};
		K.callMethodOnEachRange = function (aV, aX) {
			var aW = [];
			this.eachRange(function (aY) {
				aW.push(aY[aV].apply(aY, aX))
			});
			return aW
		};
		function aN(aV) {
			return function (aX, aY) {
				var aW;
				if (this.rangeCount) {
					aW = this.getRangeAt(0);
					aW["set" + (aV ? "Start" : "End")](aX, aY)
				} else {
					aW = T.createRange(this.win.document);
					aW.setStartAndEnd(aX, aY)
				}
				this.setSingleRange(aW, this.isBackward())
			}
		}

		K.setStart = aN(true);
		K.setEnd = aN(false);
		T.rangePrototype.select = function (aV) {
			ah(this.getDocument()).setSingleRange(this, aV)
		};
		K.changeEachRange = function (aW) {
			var aV = [];
			var aX = this.isBackward();
			this.eachRange(function (aY) {
				aW(aY);
				aV.push(aY)
			});
			this.removeAllRanges();
			if (aX && aV.length == 1) {
				this.addRange(aV[0], "backward")
			} else {
				this.setRanges(aV)
			}
		};
		K.containsNode = function (aW, aV) {
			return this.eachRange(function (aX) {
				return aX.containsNode(aW, aV)
			}, true)
		};
		K.getBookmark = function (aV) {
			return {backward: this.isBackward(), rangeBookmarks: this.callMethodOnEachRange("getBookmark", [aV])}
		};
		K.moveToBookmark = function (aZ) {
			var aV = [];
			for (var aY = 0, aX, aW; aX = aZ.rangeBookmarks[aY++];) {
				aW = T.createRange(this.win);
				aW.moveToBookmark(aX);
				aV.push(aW)
			}
			if (aZ.backward) {
				this.setSingleRange(aV[0], "backward")
			} else {
				this.setRanges(aV)
			}
		};
		K.toHtml = function () {
			return this.callMethodOnEachRange("toHtml").join("")
		};
		function ae(a1) {
			var a0 = [];
			var aY = new an(a1.anchorNode, a1.anchorOffset);
			var aW = new an(a1.focusNode, a1.focusOffset);
			var aX = (typeof a1.getName == "function") ? a1.getName() : "Selection";
			if (typeof a1.rangeCount != "undefined") {
				for (var aZ = 0, aV = a1.rangeCount; aZ < aV; ++aZ) {
					a0[aZ] = aL.inspect(a1.getRangeAt(aZ))
				}
			}
			return "[" + aX + "(Ranges: " + a0.join(", ") + ")(anchor: " + aY.inspect() + ", focus: " + aW.inspect() + "]"
		}

		K.getName = function () {
			return "WrappedSelection"
		};
		K.inspect = function () {
			return ae(this)
		};
		K.detach = function () {
			aJ(this.win, "delete");
			al(this)
		};
		ap.detachAll = function () {
			aJ(null, "deleteAll")
		};
		ap.inspect = ae;
		ap.isDirectionBackward = Q;
		T.Selection = ap;
		T.selectionPrototype = K;
		T.addCreateMissingNativeApiListener(function (aV) {
			if (typeof aV.getSelection == "undefined") {
				aV.getSelection = function () {
					return ah(aV)
				}
			}
			aV = null
		})
	})
}(this.ice || window.ice));
(function (o, c) {
	var y = o, b = o.rangy, k, f;
	var h = "br", u = "p", q = "insertType", p = "deleteType", g = [{start: 0, end: 31}, {
		start: 33,
		end: 40
	}, {start: 45, end: 45}, {start: 91, end: 93}, {start: 112, end: 123}, {start: 144, end: 145}];
	k = {
		attributes: {
			changeId: "data-cid",
			userId: "data-userid",
			userName: "data-username",
			sessionId: "data-session-id",
			time: "data-time",
			lastTime: "data-last-change-time",
			changeData: "data-changedata"
		},
		attrValuePrefix: "",
		blockEl: "p",
		blockEls: ["div", "p", "ol", "ul", "li", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote"],
		stylePrefix: "cts",
		currentUser: {id: null, name: null},
		changeTypes: {
			insertType: {tag: "ins", alias: "ins", action: "Inserted"},
			deleteType: {tag: "del", alias: "del", action: "Deleted"}
		},
		contentEditable: undefined,
		_isTracking: true,
		tooltips: false,
		tooltipsDelay: 1,
		_isVisible: true,
		_changeData: null,
		_handleSelectAll: false,
		_sessionId: null
	};
	function m(B) {
		if (!B) {
			return true
		}
		var A, z = g.length, C;
		for (A = 0; A < z; ++A) {
			C = g[A];
			if (B >= C.start && B <= C.end) {
				return true
			}
		}
		return false
	}

	f = function (A) {
		A || (A = {});
		if (!A.element) {
			throw new Error("options.element must be defined for ice construction.")
		}
		this._changes = {};
		this._userStyles = {};
		this.currentUser = {name: "", id: ""};
		this._styles = {};
		this._savedNodesMap = {};
		this.$this = c(this);
		this._browser = o.dom.browser();
		this._tooltipMouseOver = this._tooltipMouseOver.bind(this);
		this._tooltipMouseOut = this._tooltipMouseOut.bind(this);
		c.extend(true, this, k, A);
		if (A.tooltips && (!c.isFunction(A.hostMethods.showTooltip) || !c.isFunction(A.hostMethods.hideTooltip))) {
			throw new Error("hostMethods.showTooltip and hostMethods.hideTooltip must be defined if tooltips is true")
		}
		var B = A.userStyles || {};
		for (var C in B) {
			if (B.hasOwnProperty(C)) {
				var z = B[C];
				if (!isNaN(z)) {
					this._userStyles[C] = this.stylePrefix + "-" + z;
					this._uniqueStyleIndex = Math.max(z, this._uniqueStyleIndex);
					this._styles[z] = true
				}
			}
		}
		t = A.hostMethods.logError || function () {
				return undefined
			};
		this._insertSelector = "." + this._getIceNodeClass(q);
		this._deleteSelector = "." + this._getIceNodeClass(p);
		this._iceSelector = this._insertSelector + "," + this._deleteSelector
	};
	f.prototype = {
		_uniqueStyleIndex: 0,
		_browserType: null,
		_batchChangeId: null,
		_uniqueIDIndex: 1,
		_delBookmark: "tempdel",
		isPlaceHoldingDeletes: false,
		startTracking: function (z) {
			if (typeof(this.contentEditable) == "boolean") {
				this.element.setAttribute("contentEditable", this.contentEditable)
			}
			this.initializeEnvironment();
			this.initializeEditor();
			this.initializeRange();
			this._updateTooltipsState();
			return this
		},
		stopTracking: function (A) {
			this._isTracking = false;
			try {
				var z = this.element;
				if (z) {
					this.unlistenToEvents()
				}
				if (!A && (typeof(this.contentEditable) !== "undefined")) {
					this.element.setAttribute("contentEditable", !this.contentEditable)
				}
			} catch (z) {
				t(z, "While trying to stop tracking")
			}
			this._updateTooltipsState();
			return this
		},
		listenToEvents: function () {
			if (this.element && !this._boundEventHandler) {
				this.unlistenToEvents();
				this._boundEventHandler = this.handleEvent.bind(this);
				this.element.addEventListener("keydown", this._boundEventHandler, true)
			}
		},
		unlistenToEvents: function () {
			if (this.element && this._boundEventHandler) {
				this.element.removeEventListener("keydown", this._boundEventHandler, true)
			}
			this._boundEventHandler = null
		},
		initializeEnvironment: function () {
			this.env || (this.env = {});
			this.env.element = this.element;
			this.env.document = this.element.ownerDocument;
			this.env.window = this.env.document.defaultView || this.env.document.parentWindow || window;
			this.env.frame = this.env.window.frameElement;
			this.env.selection = this.selection = new o.Selection(this.env)
		},
		initializeRange: function () {
		},
		initializeEditor: function () {
			this._loadFromDom();
			this._updateTooltipsState()
		},
		isTracking: function () {
			return this._isTracking
		},
		enableChangeTracking: function () {
			this._isTracking = true
		},
		disableChangeTracking: function () {
			this._isTracking = false
		},
		toggleChangeTracking: function (z) {
			z = (undefined === z) ? !this._isTracking : Boolean(z);
			this._isTracking = z
		},
		getCurrentUser: function () {
			var z = this.currentUser || {}, A = (z.id === null || z.id === undefined) ? "" : String(z.id);
			return {name: z.name || "", id: A}
		},
		setCurrentUser: function (E) {
			var B = {};
			E = E || {};
			B.name = E.name ? String(E.name) : "";
			if (E.id !== undefined && E.id !== null) {
				B.id = String(E.id)
			} else {
				B.id = ""
			}
			this.currentUser = B;
			for (var D in this._changes) {
				var F = this._changes[D];
				if (F.userid == B.id) {
					F.username = B.name
				}
			}
			var A = this.getIceNodes(), C, z = this.attributes.userId;
			A.each((function (G, H) {
				C = H.getAttribute(z);
				if (C === null || C === B.id) {
					H.setAttribute(this.attributes.userName, B.name)
				}
			}).bind(this))
		},
		setSessionId: function (z) {
			this._sessionId = z
		},
		toggleTooltips: function (z) {
			z = (undefined === z) ? !this.tooltips : Boolean(z);
			this.tooltips = z;
			this._updateTooltipsState()
		},
		visible: function (z) {
			if (z.nodeType === o.dom.TEXT_NODE) {
				z = z.parentNode
			}
			var A = z.getBoundingClientRect();
			return (A.top > 0 && A.left > 0)
		},
		_createIceNode: function (z, A, C) {
			var B = this.env.document.createElement(this.changeTypes[z].tag);
			B.setAttribute("class", this._getIceNodeClass(z));
			if (A) {
				B.appendChild(A)
			}
			this._addChange(z, [B], C);
			return B
		},
		insert: function (H) {
			this.hostMethods.beforeInsert && this.hostMethods.beforeInsert();
			var B = this.getCurrentRange(), C = this._isRangeInElement(B, this.element), A = C ? null : this.hostMethods.getHostRange(), G = this._startBatchChange(), F = Boolean(C && !C.collapsed), E = false;
			H = H || {};
			try {
				if (F) {
					this._deleteContents(false, C);
					C = this.getCurrentRange()
				}
				if (C || A) {
					var z = H.nodes;
					if (z && !c.isArray(z)) {
						z = [z]
					}
					this._moveRangeToValidTrackingPos(C, A);
					E = this._insertNodes(C, A, {nodes: z, text: H.text, insertStubText: H.insertStubText !== false})
				}
			} catch (D) {
				t(D, "while trying to insert nodes")
			} finally {
				this._endBatchChange(G, z || H.text || E)
			}
			return E
		},
		_deleteContents: function (C, A) {
			var z = true, F, B = this._browser;
			this.hostMethods.beforeDelete && this.hostMethods.beforeDelete();
			if (A) {
				this.selection.addRange(A)
			} else {
				A = this.getCurrentRange()
			}
			F = this._startBatchChange();
			try {
				if (A.collapsed === false) {
					A = this._deleteSelection(A);
					if (A && !this.visible(A.endContainer)) {
						A.setEnd(A.endContainer, Math.max(0, A.endOffset - 1));
						A.collapse(false)
					}
				} else {
					this._cleanupSelection(A, false, true);
					if (this._isCurrentUserIceNode(this._getIceNode(A.startContainer, q)) && (A.endOffset < A.startContainer.length)) {
						return false
					}
					if (C) {
						if (B.type === "mozilla") {
							z = this._deleteRight(A);
							if (!this.visible(A.endContainer)) {
								if (A.endContainer.parentNode.nextSibling) {
									A.setEndBefore(A.endContainer.parentNode.nextSibling)
								} else {
									A.setEndAfter(A.endContainer)
								}
								A.collapse(false)
							}
						} else {
							if (A.endOffset === o.dom.getNodeCharacterLength(A.endContainer)) {
								var D = A.startContainer.nextSibling;
								if (c(D).is(this._deleteSelector)) {
									while (D) {
										if (c(D).is(this._deleteSelector)) {
											D = D.nextSibling;
											continue
										}
										A.setStart(D, 0);
										A.collapse(true);
										break
									}
								}
							}
							z = this._deleteRight(A);
							if (!this.visible(A.endContainer)) {
								if (c(A.endContainer.parentNode).is(this._iceSelector)) {
									A.setStartAfter(A.endContainer.parentNode);
									A.collapse(true)
								}
							}
						}
					} else {
						if (B.mozilla) {
							z = this._deleteLeft(A);
							if (!this.visible(A.startContainer)) {
								if (A.startContainer.parentNode.previousSibling) {
									A.setEnd(A.startContainer.parentNode.previousSibling, 0)
								} else {
									A.setEnd(A.startContainer.parentNode, 0)
								}
								A.moveEnd(o.dom.CHARACTER_UNIT, o.dom.getNodeCharacterLength(A.endContainer));
								A.collapse(false)
							}
						} else {
							if (!this.visible(A.startContainer)) {
								if (A.endOffset === o.dom.getNodeCharacterLength(A.endContainer)) {
									var E = A.startContainer.previousSibling;
									if (c(E).is(this._deleteSelector)) {
										while (E) {
											if (c(E).is(this._deleteSelector)) {
												E = E.prevSibling;
												continue
											}
											A.setEndBefore(E.nextSibling, 0);
											A.collapse(false);
											break
										}
									}
								}
							}
							z = this._deleteLeft(A)
						}
					}
				}
				A && this.selection.addRange(A)
			} finally {
				this._endBatchChange(F, z)
			}
			return z
		},
		getChanges: function (z) {
			var A = z ? this._filterChanges(z) : this._changes;
			return c.extend({}, A)
		},
		getChangeUserids: function () {
			var A = this, B = Object.keys(this._changes), z = B.map(function (C) {
				return A._changes[B[C]].userid
			});
			return z.sort().filter(function (E, D, C) {
				if (D === C.indexOf(E)) {
					return 1
				}
				return 0
			})
		},
		getElementContent: function () {
			return this.element.innerHTML
		},
		getCleanContent: function (z, C, A) {
			var B = this.getCleanDOM(z, {callback: C, prepare: A, clone: true});
			return (B && B.innerHTML) || ""
		},
		getCleanDOM: function (z, B) {
			var C = "", A = this;
			B = B || {};
			c.each(this.changeTypes, function (E, D) {
				if (E !== p) {
					if (D > 0) {
						C += ","
					}
					C += "." + A._getIceNodeClass(E)
				}
			});
			if (z) {
				if (typeof z === "string") {
					z = c("<div>" + z + "</div>")
				} else {
					if (B.clone) {
						z = c(z).clone()[0]
					}
				}
			} else {
				z = B.clone ? c(this.element).clone()[0] : this.element
			}
			return this._cleanBody(z, C, B)
		},
		_cleanBody: function (z, E, A) {
			z = A.prepare ? A.prepare.call(this, z) : z;
			var D = c(z), C, B = D.find(E);
			c.each(B, function (F, G) {
				while (G.firstChild) {
					G.parentNode.insertBefore(G.firstChild, G)
				}
				G.parentNode.removeChild(G)
			});
			D.find(this._deleteSelector).remove();
			z = A.callback ? A.callback.call(this, z) : z;
			return z
		},
		acceptAll: function (z) {
			if (z) {
				return this._acceptRejectSome(z, true)
			} else {
				this.getCleanDOM(this.element, {clone: false});
				this._changes = {};
				this._triggerChange({isText: true})
			}
		},
		rejectAll: function (C) {
			if (C) {
				return this._acceptRejectSome(C, false)
			} else {
				var E = this._insertSelector, z = this._deleteSelector, D, B = this, A = c(this.element);
				A.find(E).each(function (F, G) {
					B._removeNode(G)
				});
				A.find(z).each(function (F, G) {
					D = o.dom.contents(G);
					o.dom.replaceWith(G, D);
					c.each(D, function (H, J) {
						var I = J && J.parentNode;
						B._normalizeNode(I)
					})
				});
				this._changes = {};
				this._triggerChange({isText: true})
			}
		},
		acceptChange: function (z) {
			this.acceptRejectChange(z, {isAccept: true})
		},
		rejectChange: function (z) {
			this.acceptRejectChange(z, {isAccept: false})
		},
		acceptRejectChange: function (M, C) {
			var I, S, Q, N, J, W, U, R = o.dom, V, G = this, E, P, O, H = c(this.element), z = this._userStyles, B, A = this.attributes.userId, T = this._getIceNodeClass(p), D = this._getIceNodeClass(q), K = C && C.isAccept, L = C && (C.notify === false);
			if (!M) {
				var F = this.getCurrentRange();
				if (!F || !F.collapsed) {
					return
				}
				M = F.startContainer
			}
			I = N = "." + T;
			S = J = "." + D;
			if (!K) {
				N = S;
				J = I
			}
			Q = I + "," + S;
			W = R.getNode(M, Q);
			E = W.getAttribute(this.attributes.changeId);
			U = H.find(N + "[" + this.attributes.changeId + "=" + E + "]");
			V = U.length;
			U.each(function (Y, X) {
				G._removeNode(X)
			});
			U = H.find(J + "[" + this.attributes.changeId + "=" + E + "]");
			V += U.length;
			c.each(U, function (X, Y) {
				if (n(Y)) {
					return d(Y)
				}
				B = Y.getAttribute(A);
				O = B !== null ? z[B] || "" : "";
				P = o.dom.contents(Y);
				c(Y).removeClass(D + " " + T + " " + O);
				R.replaceWith(Y, P);
				c.each(P, function (aa, ad) {
					var Z = o.dom.TEXT_NODE == ad.nodeType && ad.nodeValue;
					if (Z) {
						var ac = false;
						while (Z.indexOf("  ") >= 0) {
							ac = true;
							Z = Z.replace("  ", " \u00a0")
						}
						if (ac) {
							ad.nodeValue = Z
						}
					}
					var ab = ad && ad.parentNode;
					G._normalizeNode(ab)
				})
			});
			delete this._changes[E];
			if (V > 0 && !L) {
				this._triggerChange({isText: true})
			}
		},
		isInsideChange: function (B, A, z) {
			try {
				return Boolean(this.currentChangeNode(B, A, z))
			} catch (C) {
				t(C, "While testing if isInsideChange");
				return false
			}
		},
		getIceNodes: function () {
			var A = [];
			var z = this;
			c.each(this.changeTypes, function (B) {
				A.push("." + z._getIceNodeClass(B))
			});
			A = A.join(",");
			return c(this.element).find(A)
		},
		_getIceNode: function (B, A) {
			var z = this.changeTypes[A].tag + "." + this._getIceNodeClass(A);
			return o.dom.getNode((B && B.$) || B, z)
		},
		_isNodeOfChangeType: function (B, A) {
			if (!B) {
				return false
			}
			var z = "." + this._getIceNodeClass(A);
			return c(B.$ || B).is(z)
		},
		_isInsertNode: function (z) {
			return this._isNodeOfChangeType(z, q)
		},
		_isDeleteNode: function (z) {
			return this._isNodeOfChangeType(z, p)
		},
		_normalizeNode: function (z) {
			return o.dom.normalizeNode(z, this._browser.msie)
		},
		_moveRangeToValidTrackingPos: function (G, C) {
			if (!(G = (C || G))) {
				return
			}
			var z, A, E = -1, B, I = [], J, F, D = C ? this.hostMethods.getHostNode : e, K = false;
			while (!K) {
				A = G.startContainer;
				if (!A || I.indexOf(A) >= 0) {
					return
				}
				B = D(A);
				I.push(A);
				z = this._getVoidElement({node: B, checkEmpty: false});
				if (z) {
					if ((z !== A) && (I.indexOf(z) >= 0)) {
						return
					}
					I.push(z)
				} else {
					K = o.dom.isTextContainer(B)
				}
				if (!K) {
					if (-1 == E) {
						E = !s(D(G.startContainer), G.startOffset)
					}
					J = E ? o.dom.findPrevTextContainer(z || B, this.element) : o.dom.findNextTextContainer(z || B, this.element);
					F = J.node;
					if (C) {
						F = this.hostMethods.makeHostElement(F)
					}
					try {
						if (E) {
							G.setStart(F, J.offset)
						} else {
							G.setEnd(F, J.offset)
						}
						G.collapse(E)
					} catch (H) {
						t(H, "While trying to move range to valid tracking position");
						break
					}
				}
			}
		},
		_isRangeInElement: function (z, A) {
			var B = z && z.startContainer;
			while (B) {
				if (B == A) {
					return z
				}
				B = B.parentNode
			}
			return null
		},
		_getVoidElement: function (A) {
			if (!A) {
				return null
			}
			var C = A.node, B = A.checkEmpty !== false;
			try {
				var z = this._getIceNode(C, p);
				if (!z) {
					if (3 == C.nodeType && (B && C.nodeValue == "\u200B")) {
						return C
					}
				}
				return z
			} catch (D) {
				t(D, "While trying to get void element of", C);
				return null
			}
		},
		_cleanupSelection: function (A, z, C) {
			var D;
			if (!A || !A.collapsed || !(D = A.startContainer)) {
				return
			}
			if (z) {
				D = this.hostMethods.getHostNode(D)
			}
			var B = D.nodeType;
			if (o.dom.TEXT_NODE == B) {
				return this._cleanupTextSelection(A, D, z, C)
			} else {
				return this._cleanupElementSelection(A, z)
			}
		},
		_cleanupTextSelection: function (A, F, z, E) {
			this._cleanupAroundNode(F);
			if (E && o.dom.isEmptyTextNode(F)) {
				var B = F.parentNode, D = o.dom.getNodeIndex(F), C = z ? this.hostMethods.makeHostElement : e;
				B.removeChild(F);
				D = Math.max(0, D);
				A.setStart(C(B), D);
				A.setEnd(C(B), D)
			}
		},
		_cleanupElementSelection: function (D, B) {
			var z, F = false, H = B ? this.hostMethods.getHostNode(D.startContainer) : D.startContainer, C = H.childNodes.length;
			if (C < 1) {
				return
			}
			try {
				if (D.startOffset > 0) {
					z = H.childNodes[D.startOffset - 1]
				} else {
					z = H.firstChild;
					F = true
				}
				if (!z) {
					return
				}
			} catch (G) {
				return
			}
			this._cleanupAroundNode(z, F);
			if (D.startOffset === 0) {
				return
			}
			var A = o.dom.getNodeIndex(z) + 1;
			if (o.dom.isEmptyTextNode(z)) {
				A = Math.max(0, A - 1);
				H.removeChild(z)
			}
			if (H.childNodes.length !== C) {
				var E = B ? this.hostMethods.makeHostElement : e;
				D.setStart(E(H), A);
				D.setEnd(E(H), A)
			}
		},
		_cleanupAroundNode: function (C, D) {
			var B = C.parentNode, z = C.nextSibling, E, A;
			while (z) {
				E = (c(z).is(this._iceSelector) && o.dom.hasNoTextOrStubContent(z)) || o.dom.isEmptyTextNode(z);
				if (E) {
					A = z;
					z = z.nextSibling;
					B.removeChild(A)
				} else {
					z = z.nextSibling
				}
			}
			z = C.previousSibling;
			while (z) {
				E = (c(z).is(this._iceSelector) && o.dom.hasNoTextOrStubContent(z)) || o.dom.isEmptyTextNode(z);
				if (E) {
					A = z;
					z = z.previousSibling;
					B.removeChild(A)
				} else {
					z = z.previousSibling
				}
			}
			if (D && o.dom.isEmptyTextNode(C)) {
				B.removeChild(C)
			}
		},
		_isCurrentUserIceNode: function (A) {
			var z = Boolean(A && c(A).attr(this.attributes.userId) === this.currentUser.id);
			if (z && this._sessionId) {
				z = A.getAttribute(this.attributes.sessionId) === this._sessionId
			}
			return z
		},
		_getChangeTypeFromAlias: function (A) {
			var B, z = null;
			for (B in this.changeTypes) {
				if (this.changeTypes.hasOwnProperty(B)) {
					if (this.changeTypes[B].alias == A) {
						z = B
					}
				}
			}
			return z
		},
		_getIceNodeClass: function (z) {
			return this.attrValuePrefix + this.changeTypes[z].alias
		},
		_getUserStyle: function (z) {
			if (z === null || z === "" || "undefined" == typeof z) {
				return this.stylePrefix
			}
			var A = null;
			if (this._userStyles[z]) {
				A = this._userStyles[z]
			} else {
				A = this._setUserStyle(z, this._getNewStyleId())
			}
			return A
		},
		_setUserStyle: function (z, B) {
			var A = this.stylePrefix + "-" + B;
			if (!this._styles[B]) {
				this._styles[B] = true
			}
			return this._userStyles[z] = A
		},
		_getNewStyleId: function () {
			var z = ++this._uniqueStyleIndex;
			if (this._styles[z]) {
				return this._getNewStyleId()
			} else {
				this._styles[z] = true;
				return z
			}
		},
		_addChange: function (C, E, B) {
			var D = B || this._batchChangeId || this.getNewChangeId(), z = this;
			if (!this._changes[D]) {
				var A = (new Date()).getTime();
				this._changes[D] = {
					type: C,
					time: A,
					lastTime: A,
					sessionId: this._sessionId,
					userid: String(this.currentUser.id),
					username: this.currentUser.name,
					data: this._changeData || ""
				};
				this._triggerChange({text: false})
			}
			c.each(E, function (F) {
				z._addNodeToChange(D, E[F])
			});
			return D
		},
		_addNodeToChange: function (D, C) {
			var E = this.getChange(D), A = {};
			if (!C.getAttribute(this.attributes.changeId)) {
				A[this.attributes.changeId] = D
			}
			var B = C.getAttribute(this.attributes.userId);
			if (!B) {
				B = E.userid;
				A[this.attributes.userId] = B
			}
			if (B == E.userid) {
				A[this.attributes.userName] = E.username
			}
			var z = C.getAttribute(this.attributes.changeData);
			if (null === z) {
				A[this.attributes.changeData] = this._changeData || ""
			}
			if (!C.getAttribute(this.attributes.time)) {
				A[this.attributes.time] = E.time
			}
			if (!C.getAttribute(this.attributes.lastTime)) {
				A[this.attributes.lastTime] = E.lastTime
			}
			if (E.sessionId && !C.getAttribute(this.attributes.sessionId)) {
				A[this.attributes.sessionId] = E.sessionId
			}
			if (!E.style) {
				E.style = this._getUserStyle(E.userid)
			}
			c(C).attr(A).addClass(E.style);
			this._updateNodeTooltip(C)
		},
		getChange: function (z) {
			return this._changes[z] || null
		},
		getNewChangeId: function () {
			var z = ++this._uniqueIDIndex;
			if (this._changes[z]) {
				z = this.getNewChangeId()
			}
			return z
		},
		_startBatchChange: function () {
			return this._batchChangeId ? null : (this._batchChangeId = this.getNewChangeId())
		},
		getContentElement: function () {
			return this.element
		},
		_endBatchChange: function (A, z) {
			if (A && (A === this._batchChangeId)) {
				this._batchChangeId = null;
				if (z) {
					this._triggerChange({isText: true})
				}
			}
		},
		getCurrentRange: function () {
			try {
				return this.selection.getRangeAt(0)
			} catch (z) {
				t(z, "While trying to get current range");
				return null
			}
		},
		_insertNodes: function (A, N, O) {
			var L = N || A, X = O || {}, T = L.startContainer, F = (T && T.$) || T, U = N ? this.hostMethods.makeHostElement : e, P = X.nodes, W = X.insertStubText !== false, K = X.text, R, S, Y = this.env.document, D = false;
			var M = this._getIceNode(F, q), C = this._isCurrentUserIceNode(M);
			this._cleanupSelection(L, Boolean(N), true);
			if (C) {
				var G = P && P[0], I = M.getAttribute(this.attributes.changeId);
				if (G) {
					D = true;
					L.insertNode(U(G));
					var J = G.parentNode, V = G.nextSibling;
					S = P.length;
					for (R = 1; R < S; ++R) {
						if (V) {
							J.insertBefore(P[R], V)
						} else {
							J.appendChild(P[R])
						}
					}
					var H = P[S - 1];
					if (o.dom.TEXT_NODE == H.nodeType) {
						L.setEnd(H, (H.nodeValue && H.nodeValue.length) || 0)
					} else {
						L.setEndAfter(H)
					}
					L.collapse();
					if (N) {
						this.hostMethods.setHostRange(N)
					} else {
						this.selection.addRange(L)
					}
				} else {
					v(null, L, Y, true)
				}
				this._updateChangeTime(I)
			} else {
				var Q = this._createIceNode(q);
				if (M) {
					var z = M.childNodes.length;
					this._normalizeNode(M);
					if (z !== M.childNodes.length) {
						if (N) {
							N = L = this.hostMethods.getHostRange()
						} else {
							L.refresh()
						}
					}
					if (M) {
						var E = (N && this.hostMethods.getHostNode(N.endContainer)) || L.endContainer;
						if ((E.nodeType == 3 && L.endOffset < L.endContainer.length) || (E !== M.lastChild)) {
							M = this._splitNode(M, L.endContainer, L.endOffset)
						}
					}
				}
				if (M) {
					L.setStartAfter(U(M));
					L.collapse(true)
				}
				L.insertNode(U(Q));
				S = (P && P.length) || 0;
				if (S) {
					D = true;
					for (R = 0; R < S; ++R) {
						Q.appendChild(P[R])
					}
					L.setEndAfter(U(Q.lastChild));
					L.collapse()
				} else {
					if (K) {
						D = true;
						var B = Y.createTextNode(K);
						Q.appendChild(B);
						L.setEnd(B, 1);
						L.collapse()
					} else {
						v(Q, L, Y, W)
					}
				}
				if (N) {
					this.hostMethods.setHostRange(N)
				} else {
					this.selection.addRange(L)
				}
			}
			return D
		},
		_updateChangeTime: function (D) {
			var C = this._changes[D];
			if (C) {
				var B = (new Date()).getTime(), A = c(this.element).find("[" + this.attributes.changeId + "=" + D + "]"), z = this.attributes.lastTime;
				C.lastTime = B;
				A.each(function (E, F) {
					F.setAttribute(z, B)
				})
			}
		},
		_handleVoidEl: function (A, z) {
			var B = A && this._getVoidElement({node: A});
			if (B && !this._getIceNode(B, p)) {
				z.collapse(true);
				return true
			}
			return false
		},
		_deleteSelection: function (G) {
			var H = new o.Bookmark(this.env, G), z = o.dom.getElementsBetween(H.start, H.end), J = [], I = [], K = {
				deleteNodesCollection: I,
				moveLeft: true,
				range: null
			};
			for (var F = 0; F < z.length; F++) {
				var C = z[F];
				if (!C || !C.parentNode) {
					continue
				}
				if (o.dom.isBlockElement(C)) {
					J.push(C);
					if (!o.dom.canContainTextElement(C)) {
						for (var D = 0; D < C.childNodes.length; D++) {
							z.push(C.childNodes[D])
						}
						continue
					}
				}
				if (o.dom.isEmptyTextNode(C)) {
					this._removeNode(C);
					continue
				}
				if (!this._getVoidElement({node: C})) {
					if (C.nodeType !== o.dom.TEXT_NODE) {
						if (w(C)) {
							this._addDeleteTrackingToBreak(C, K);
							continue
						}
						if (o.dom.isStubElement(C)) {
							this._addDeleteTracking(C, K);
							continue
						}
						if (o.dom.hasNoTextOrStubContent(C)) {
							this._removeNode(C);
							continue
						}
						for (var E = 0; E < C.childNodes.length; E++) {
							var B = C.childNodes[E];
							z.push(B)
						}
						continue
					}
					var A = o.dom.getBlockParent(C);
					this._addDeleteTracking(C, K);
					if (o.dom.hasNoTextOrStubContent(A)) {
						o.dom.remove(A)
					}
				}
			}
			if (I.length) {
				H.remove();
				this._cleanupAroundNode(I[0]);
				G.setStartBefore(I[0]);
				G.collapse(true);
				this.selection.addRange(G)
			} else {
				H.selectStartAndCollapse();
				if (G = this.getCurrentRange()) {
					this._cleanupSelection(G, false, false);
					G = this.getCurrentRange()
				}
			}
			return G
		},
		_deleteRight: function (J) {
			var A = o.dom.isBlockElement(J.startContainer) && J.startContainer || o.dom.getBlockParent(J.startContainer, this.element) || null, L = A ? (o.dom.hasNoTextOrStubContent(A)) : false, H = A && o.dom.getNextContentNode(A, this.element), M = H ? (o.dom.hasNoTextOrStubContent(H)) : false, E = J.endContainer, D = J.endOffset, N, B = J.commonAncestorContainer, F, Q = false;
			if (L) {
				return false
			}
			if (w(B)) {
				this._addDeleteTrackingToBreak(B, {range: J});
				return true
			}
			if (B.nodeType !== o.dom.TEXT_NODE) {
				if (D === 0 && o.dom.isBlockElement(B) && (!o.dom.canContainTextElement(B))) {
					var P = B.firstElementChild;
					if (P) {
						J.setStart(P, 0);
						J.collapse();
						return this._deleteRight(J)
					}
				}
				if (B.childNodes.length > D) {
					var K = B.childNodes[D];
					if (w(K)) {
						this._addDeleteTrackingToBreak(K, {range: J});
						return true
					}
					J.setStart(B.childNodes[D], 0);
					J.collapse(true);
					Q = this._deleteRight(J);
					J.refresh();
					return Q
				} else {
					F = o.dom.getNextContentNode(B, this.element);
					if (F) {
						if (w(F)) {
							this._addDeleteTrackingToBreak(F, {range: J});
							return true
						}
						J.setEnd(F, 0)
					}
					J.collapse();
					return this._deleteRight(J)
				}
			}
			try {
				J.moveEnd(o.dom.CHARACTER_UNIT, 1);
				J.moveEnd(o.dom.CHARACTER_UNIT, -1)
			} catch (O) {
			}
			if (D === E.data.length && (!o.dom.hasNoTextOrStubContent(E))) {
				F = o.dom.getNextNode(E, this.element);
				if (!F) {
					J.selectNodeContents(E);
					J.collapse();
					return false
				}
				if (w(F)) {
					this._addDeleteTrackingToBreak(F, {range: J});
					return true
				}
				if (F.nodeType === o.dom.TEXT_NODE) {
					F = F.parentNode
				}
				if (!F.isContentEditable) {
					Q = this._addDeleteTracking(F, {range: null, moveLeft: false, merge: true});
					var C = this.env.document.createTextNode("");
					F.parentNode.insertBefore(C, F.nextSibling);
					J.selectNode(C);
					J.collapse(true);
					return Q
				}
				if (this._handleVoidEl(F, J)) {
					return true
				}
				if (o.dom.isChildOf(F, A) && o.dom.isStubElement(F)) {
					return this._addDeleteTracking(F, {range: J, moveLeft: false, merge: true})
				}
			}
			if (this._handleVoidEl(F, J)) {
				return true
			}
			if (o.dom.isOnBlockBoundary(J.startContainer, J.endContainer, this.element)) {
				if (this.mergeBlocks && c(o.dom.getBlockParent(F, this.element)).is(this.blockEl)) {
					if (H !== o.dom.getBlockParent(J.endContainer, this.element)) {
						J.setEnd(H, 0)
					}
					var I = o.dom.getElementsBetween(J.startContainer, J.endContainer);
					for (N = 0; N < I.length; N++) {
						o.dom.remove(I[N])
					}
					return o.dom.mergeBlockWithSibling(J, o.dom.getBlockParent(J.endContainer, this.element) || A)
				} else {
					if (M) {
						o.dom.remove(H);
						J.collapse(true);
						return true
					}
					J.setStart(H, 0);
					J.collapse(true);
					return true
				}
			}
			var z = J.endContainer, G = l(z, J.endOffset, 1);
			return this._addDeleteTracking(G, {range: J, moveLeft: false, merge: true})
		},
		_deleteLeft: function (H) {
			var D = o.dom.isBlockElement(H.startContainer) && H.startContainer || o.dom.getBlockParent(H.startContainer, this.element) || null, G = D ? o.dom.hasNoTextOrStubContent(D) : false, A = D && o.dom.getPrevContentNode(D, this.element), C = A ? o.dom.hasNoTextOrStubContent(A) : false, M = H.startContainer, B = H.startOffset, P = H.commonAncestorContainer, O, L;
			if (G) {
				return false
			}
			if (w(P)) {
				this._addDeleteTrackingToBreak(P, {range: H, moveLeft: true});
				return true
			}
			if (B === 0 || P.nodeType !== o.dom.TEXT_NODE) {
				if (o.dom.isBlockElement(P) && (!o.dom.canContainTextElement(P))) {
					if (B === 0) {
						var K = P.firstElementChild;
						if (K) {
							H.setStart(K, 0);
							H.collapse();
							return this._deleteLeft(H)
						}
					} else {
						var N = P.lastElementChild;
						if (N) {
							O = H.getLastSelectableChild(N);
							if (O) {
								H.setStart(O, O.data.length);
								H.collapse();
								return this._deleteLeft(H)
							}
						}
					}
				}
				if (B === 0) {
					L = o.dom.getPrevContentNode(M, this.element)
				} else {
					L = P.childNodes[B - 1]
				}
				if (!L) {
					return false
				}
				if (c(L).is(this._iceSelector) && L.childNodes.length > 0 && L.lastChild) {
					L = L.lastChild
				}
				if (w(L)) {
					this._addDeleteTrackingToBreak(L, {range: H, moveLeft: true});
					return true
				}
				if (L.nodeType === o.dom.TEXT_NODE) {
					L = L.parentNode
				}
				if (!L.isContentEditable) {
					var z = this._addDeleteTracking(L, {range: null, moveLeft: true, merge: true});
					var E = document.createTextNode("");
					L.parentNode.insertBefore(E, L);
					H.selectNode(E);
					H.collapse(true);
					return z
				}
				if (this._handleVoidEl(L, H)) {
					return true
				}
				if (o.dom.isStubElement(L) && o.dom.isChildOf(L, D) || !L.isContentEditable) {
					this._addDeleteTracking(L, {range: H, moveLeft: true, merge: true});
					return true
				}
				if (o.dom.isStubElement(L)) {
					o.dom.remove(L);
					H.collapse(true);
					return false
				}
				if (L !== D && !o.dom.isChildOf(L, D)) {
					if (!o.dom.canContainTextElement(L)) {
						L = L.lastElementChild
					}
					if (L.lastChild && L.lastChild.nodeType !== o.dom.TEXT_NODE && o.dom.isStubElement(L.lastChild) && L.lastChild.tagName !== "BR") {
						H.setStartAfter(L.lastChild);
						H.collapse(true);
						return true
					}
					O = H.getLastSelectableChild(L);
					if (O && !o.dom.isOnBlockBoundary(H.startContainer, O, this.element)) {
						H.selectNodeContents(O);
						H.collapse();
						return true
					}
				}
			}
			if (B === 1 && !o.dom.isBlockElement(P) && H.startContainer.childNodes.length > 1 && H.startContainer.childNodes[0].nodeType === o.dom.TEXT_NODE && H.startContainer.childNodes[0].data.length === 0) {
				H.setStart(H.startContainer, 0);
				return this._deleteLeft(H)
			}
			try {
				H.moveStart(o.dom.CHARACTER_UNIT, -1);
				H.moveStart(o.dom.CHARACTER_UNIT, 1)
			} catch (J) {
			}
			if (o.dom.isOnBlockBoundary(H.startContainer, H.endContainer, this.element)) {
				if (C) {
					o.dom.remove(A);
					H.collapse();
					return true
				}
				if (A && A.lastChild && o.dom.isStubElement(A.lastChild)) {
					H.setStartAfter(A.lastChild);
					H.collapse(true);
					return true
				}
				O = H.getLastSelectableChild(A);
				if (O) {
					H.setStart(O, O.data.length);
					H.collapse(true)
				} else {
					if (A) {
						H.setStart(A, A.childNodes.length);
						H.collapse(true)
					}
				}
				return true
			}
			var F = H.startContainer;
			if (F && (F.nodeType === o.dom.TEXT_NODE)) {
				var I = l(F, H.startOffset - 1, 1);
				this._addDeleteTracking(I, {range: H, moveLeft: true, merge: true});
				return true
			}
			return false
		},
		_removeNode: function (A) {
			var z = A && A.parentNode;
			if (z) {
				z.removeChild(A);
				if (z !== this.element && o.dom.hasNoTextOrStubContent(z)) {
					this._removeNode(z)
				}
			}
		},
		_addDeleteTracking: function (C, I) {
			var E = I && I.moveLeft, F = this._getIceNode(C, q), G, D;
			I = I || {};
			if (F) {
				return this._addDeletionInInsertNode(C, F, I)
			}
			D = I.range;
			if (D && this._getIceNode(C, p)) {
				return this._deleteInDeleted(C, I)
			}
			if (C.previousSibling && o.dom.isEmptyTextNode(C.previousSibling)) {
				C.parentNode.removeChild(C.previousSibling)
			}
			if (C.nextSibling && o.dom.isEmptyTextNode(C.nextSibling)) {
				C.parentNode.removeChild(C.nextSibling)
			}
			var A = this._getIceNode(C.previousSibling, p), H = this._getIceNode(C.nextSibling, p);
			if (A && this._isCurrentUserIceNode(A)) {
				G = A;
				G.appendChild(C);
				if (H && this._isCurrentUserIceNode(H)) {
					var B = o.dom.extractContent(H);
					G.appendChild(B);
					H.parentNode.removeChild(H)
				}
			} else {
				if (H && this._isCurrentUserIceNode(H)) {
					G = H;
					G.insertBefore(C, G.firstChild)
				} else {
					var z = this.getAdjacentChangeId(C, E);
					G = this._createIceNode(p, null, z);
					if (I.deleteNodesCollection) {
						I.deleteNodesCollection.push(G)
					}
					C.parentNode.insertBefore(G, C);
					G.appendChild(C)
				}
			}
			if (D) {
				if (o.dom.isStubElement(C)) {
					D.selectNode(C)
				} else {
					D.selectNodeContents(C)
				}
				if (E) {
					D.collapse(true)
				} else {
					D.collapse()
				}
			}
			if (G) {
				this._normalizeNode(G);
				D && D.refresh()
			}
			return true
		},
		_addDeleteTrackingToBreak: function (D, A) {
			var C = Boolean(A && A.moveLeft);

			function z() {
				var F = A && A.range;
				if (F) {
					if (w(D) || o.dom.hasNoTextOrStubContent(D) || C) {
						if (C) {
							F.setStartBefore(D);
							F.setEndBefore(D)
						} else {
							F.setStartAfter(D);
							F.setEndAfter(D)
						}
					} else {
						if (D.firstChild) {
							F.setStartBefore(D.firstChild);
							F.setEndBefore(D.firstChild)
						}
					}
					F.collapse()
				}
			}

			if (!w(D)) {
				t("addDeleteTracking to BR: not a break element");
				return
			}
			if (this._isDeleteNode(D)) {
				return z()
			}
			d(D);
			var B = p;
			o.dom.addClass(D, this._getIceNodeClass(B));
			var E = this.getAdjacentChangeId(D, C);
			this._addChange(B, [D], E);
			z()
		},
		_deleteInDeleted: function (B, H) {
			var C = H.range, D = H.moveLeft, F;
			this._normalizeNode(B);
			var G = false;
			if (D) {
				var z = o.dom.getPrevContentNode(B, this.element);
				while (!G) {
					F = this._getIceNode(z, p);
					if (!F) {
						G = true
					} else {
						z = o.dom.getPrevContentNode(z, this.element)
					}
				}
				if (z) {
					var E = C.getLastSelectableChild(z);
					if (E) {
						z = E
					}
					C.setStart(z, o.dom.getNodeCharacterLength(z));
					C.collapse(true)
				}
			} else {
				var A = o.dom.getNextContentNode(B, this.element);
				while (!G) {
					F = this._getIceNode(A, p);
					if (!F) {
						G = true
					} else {
						A = o.dom.getNextContentNode(A, this.element)
					}
				}
				if (A) {
					C.selectNodeContents(A);
					C.collapse(true)
				}
			}
			return true
		},
		_addDeletionInInsertNode: function (C, G, L) {
			var D = L && L.range, E = L && L.moveLeft;
			L = L || {};
			if (this._isCurrentUserIceNode(G)) {
				if (D) {
					if (E) {
						D.setStartBefore(C)
					} else {
						D.setStartAfter(C)
					}
					D.collapse(E)
				}
				C.parentNode.removeChild(C);
				if (!this._browser.msie) {
					this._normalizeNode(G)
				}
				var F = c(G), J = F.find(".iceBookmark").length, A;
				if (J > 0) {
					A = F.clone();
					A.find(".iceBookmark").remove();
					A = A[0]
				} else {
					A = G
				}
				if (o.dom.hasNoTextOrStubContent(A)) {
					if (D) {
						D.setStartBefore(G);
						D.collapse(true)
					}
					o.dom.replaceWith(G, o.dom.contents(G))
				}
			} else {
				var B = b.dom.getNodeIndex(C), I = C.parentNode, H = I.childNodes.length, K;
				I.removeChild(C);
				K = this._createIceNode(p);
				if (L.deleteNodesCollection) {
					L.deleteNodesCollection.push(K)
				}
				K.appendChild(C);
				if (B > 0 && B >= (H - 1)) {
					o.dom.insertAfter(G, K)
				} else {
					if (B > 0) {
						var z = this._splitNode(G, I, B);
						this._deleteEmptyNode(z)
					}
					G.parentNode.insertBefore(K, G)
				}
				this._deleteEmptyNode(G);
				if (D && E) {
					D.setStartBefore(K);
					D.collapse(true);
					this.selection.addRange(D)
				}
				if (L && L.merge) {
					this._mergeDeleteNode(K)
				}
				if (D) {
					D.refresh()
				}
			}
			return true
		},
		_deleteEmptyNode: function (A) {
			var z = A && A.parentNode;
			if (z && o.dom.hasNoTextOrStubContent(A)) {
				z.removeChild(A)
			}
		},
		_mergeDeleteNode: function (B) {
			var A, z;
			if (this._isCurrentUserIceNode(A = this._getIceNode(B.previousSibling, p))) {
				z = o.dom.extractContent(B);
				B.parentNode.removeChild(B);
				A.appendChild(z);
				this._mergeDeleteNode(A)
			} else {
				if (this._isCurrentUserIceNode(A = this._getIceNode(B.nextSibling, p))) {
					z = o.dom.extractContent(A);
					B.parentNode.removeChild(A);
					B.appendChild(z);
					this._mergeDeleteNode(B)
				}
			}
		},
		handleEvent: function (A) {
			if (!this._isTracking) {
				return true
			}
			var z = false;
			if ("keypress" == A.type) {
				z = this.keyPress(A)
			} else {
				if ("keydown" == A.type) {
					z = !this.handleKeyDown(A)
				}
			}
			if (z) {
				A.stopImmediatePropagation();
				A.preventDefault()
			}
			return !z
		},
		_handleAncillaryKey: function (D) {
			var C = this._browser, B = false, A = this, z = A.getCurrentRange();
			switch (D) {
				case o.dom.DOM_VK_DELETE:
					B = this._deleteContents();
					break;
				case 46:
					B = this._deleteContents(true);
					break;
				case o.dom.DOM_VK_DOWN:
				case o.dom.DOM_VK_UP:
				case o.dom.DOM_VK_LEFT:
					if (C.type === "mozilla") {
						if (!this.visible(z.startContainer)) {
							if (z.startContainer.parentNode.previousSibling) {
								z.setEnd(z.startContainer.parentNode.previousSibling, 0);
								z.moveEnd(o.dom.CHARACTER_UNIT, o.dom.getNodeCharacterLength(z.endContainer));
								z.collapse(false)
							} else {
								z.setEnd(z.startContainer.parentNode.nextSibling, 0);
								z.collapse(false)
							}
						}
					}
					B = false;
					break;
				case o.dom.DOM_VK_RIGHT:
					if (C.type === "mozilla") {
						if (!this.visible(z.startContainer)) {
							if (z.startContainer.parentNode.nextSibling) {
								z.setStart(z.startContainer.parentNode.nextSibling, 0);
								z.collapse(true)
							}
						}
					}
					break;
				default:
					break
			}
			return B
		},
		handleKeyDown: function (z) {
			if (this._handleSpecialKey(z)) {
				return true
			}
			return !this.keyPress(z)
		},
		onKeyDown: function (z) {
			if (this._handleSpecialKey(z)) {
				return false
			}
			return this._handleAncillaryKey(z)
		},
		keyPress: function (C) {
			var E = null;
			if (C.ctrlKey || C.metaKey) {
				return false
			}
			var z = this.getCurrentRange(), D, B = z && o.dom.parents(z.startContainer, "br")[0] || null;
			if (B) {
				z.moveToNextEl(B)
			}
			var A = C.keyCode ? C.keyCode : C.which;
			switch (A) {
				case 32:
					return this.insert({text: " "});
				case o.dom.DOM_VK_DELETE:
				case 46:
				case o.dom.DOM_VK_DOWN:
				case o.dom.DOM_VK_UP:
				case o.dom.DOM_VK_LEFT:
				case o.dom.DOM_VK_RIGHT:
					return this._handleAncillaryKey(A);
				case o.dom.DOM_VK_ENTER:
					this._handleEnter();
					return false;
				default:
					if (m(A)) {
						return false
					}
					E = C["char"] || String.fromCharCode(A);
					if (E) {
						var D = this._browser.msie ? {text: E} : null;
						return this.insert(D)
					}
					return false
			}
		},
		_handleEnter: function () {
			var z = this.getCurrentRange();
			if (z && !z.collapsed) {
				this._deleteContents()
			}
		},
		_handleSpecialKey: function (A) {
			var z = A.which;
			if (z === null) {
				z = A.keyCode
			}
			switch (z) {
				case 120:
				case 88:
					if (true === A.ctrlKey || true === A.metaKey) {
						this.prepareToCut();
						return true
					}
					break;
				case 67:
				case 99:
					if (true === A.ctrlKey || true === A.metaKey) {
						this.prepareToCopy();
						return true
					}
					break;
				default:
					break
			}
			return false
		},
		currentChangeNode: function (B, z, A) {
			var C = this._iceSelector, F = null;
			if (!B) {
				F = this.getCurrentRange();
				if (!F) {
					return false
				}
				if (A !== false && F.collapsed) {
					this._cleanupSelection(F, false, false);
					B = F.startContainer
				} else {
					B = F.commonAncestorContainer
				}
			}
			var G = z ? c(B).is(C) && B : o.dom.getNode(B, C);
			if ((!G) && F && F.collapsed) {
				var E = F.endContainer, H = F.endOffset, D = null;
				if (E.nodeType === o.dom.TEXT_NODE) {
					if (H === E.length) {
						D = o.dom.getNextNode(E)
					} else {
						if (H === 0) {
							D = o.dom.getPrevNode(E, this.element)
						}
					}
				} else {
					if (E.nodeType === o.dom.ELEMENT_NODE) {
						if (H === 0) {
							D = o.dom.getPrevNode(E, this.element)
						} else {
							if (E.childNodes.length > H) {
								E = E.childNodes[H - 1];
								if (c(E).is(C)) {
									return E
								}
								D = o.dom.getNextNode(E)
							}
						}
					}
				}
				if (D) {
					G = c(D).is(C)
				}
			}
			return G
		},
		setShowChanges: function (z) {
			var A = c(this.element);
			z = Boolean(z);
			this._isVisible = z;
			A.toggleClass("ICE-Tracking", z);
			this._showTitles(z);
			this._updateTooltipsState()
		},
		reload: function () {
			this._loadFromDom()
		},
		hasChanges: function () {
			for (var z in this._changes) {
				var A = this._changes[z];
				if (A && A.type) {
					return true
				}
			}
			return false
		},
		countChanges: function (z) {
			var A = this._filterChanges(z);
			return A.count
		},
		setChangeData: function (z) {
			if (null == z || (typeof z == "undefined")) {
				z = ""
			}
			this._changeData = String(z)
		},
		getDeleteClass: function () {
			return this._getIceNodeClass(p)
		},
		prepareToCopy: function () {
			var z = this.getCurrentRange();
			if (z && !z.collapsed) {
				this._removeTrackingInRange(z)
			}
		},
		prepareToCut: function () {
			var C = this.getCurrentRange(), z = this.hostMethods.getHostRange();
			if (C && z && C.collapsed && !z.collapsed) {
				try {
					var B = this.hostMethods.getHostRangeData(z);
					C.setStart(B.startContainer, B.startOffset);
					C.setEnd(B.endContainer, B.endOffset)
				} catch (D) {
					return
				}
			}
			if (!C || C.collapsed) {
				return false
			}
			j(C, this.element);
			var H = C.cloneContents(), A = C.cloneRange(), G = H.firstChild, E = H.lastChild;
			this.hostMethods.beforeEdit();
			C.collapse(false);
			C.insertNode(H);
			C.setStartBefore(G);
			C.setEndAfter(E);
			var F = this._startBatchChange();
			try {
				this._deleteSelection(C)
			} catch (D) {
				t(D, "While trying to delete selection")
			} finally {
				this._endBatchChange(F);
				this.selection.addRange(A);
				this._removeTrackingInRange(A, false)
			}
			return true
		},
		toString: function () {
			return "ICE " + ((this.element && this.element.id) || "(no element id)")
		},
		_splitNode: function (D, G, z) {
			var C = D.parentNode, A = b.dom.getNodeIndex(D), F = G.ownerDocument, B = F.createRange(), E;
			B.setStart(C, A);
			B.setEnd(G, z);
			E = B.extractContents();
			C.insertBefore(E, D);
			if (this.isInsideChange(D, true)) {
				this._updateNodeTooltip(D.previousSibling)
			}
			return D.previousSibling
		},
		_triggerChange: function (z) {
			if (this._isTracking) {
				this.$this.trigger("change");
				if (z && z.isText) {
					this.$this.trigger("textChange")
				}
			}
		},
		_updateNodeTooltip: function (z) {
			if (this.tooltips && this._isVisible) {
				this._addTooltip(z)
			}
		},
		_acceptRejectSome: function (B, z) {
			var D = (function (F, G) {
				this.acceptRejectChange(G, {isAccept: z, notify: false})
			}).bind(this);
			var C = this._filterChanges(B);
			for (var E in C.changes) {
				var A = c(this.element).find("[" + this.attributes.changeId + "=" + E + "]");
				A.each(D)
			}
			if (C.count) {
				this._triggerChange({isText: true})
			}
		},
		_filterChanges: function (J) {
			var D = 0, G = {}, F, K = J || {}, B = K.filter, C = K.exclude ? c.map(K.exclude, function (L) {
					return String(L)
				}) : null, A = K.include ? c.map(K.include, function (L) {
					return String(L)
				}) : null, E = K.verify, z = null;
			for (var I in this._changes) {
				F = this._changes[I];
				if (F && F.type) {
					var H = (B && !B({
							userid: F.userid,
							time: F.time,
							data: F.data
						})) || (C && C.indexOf(F.userid) >= 0) || (A && A.indexOf(F.userid) < 0);
					if (!H) {
						if (E) {
							z = c(this.element).find("[" + this.attributes.changeId + "]");
							H = !z.length
						}
						if (!H) {
							++D;
							G[I] = F
						}
					}
				}
			}
			return {count: D, changes: G}
		},
		_loadFromDom: function () {
			this._changes = {};
			this._uniqueStyleIndex = 0;
			var E = this.currentUser && this.currentUser.id, F = (this.currentUser && this.currentUser.name) || "", B = (new Date()).getTime(), D, H = new RegExp(this.stylePrefix + "-(\\d+)"), z = [];
			for (var G in this.changeTypes) {
				z.push(this._getIceNodeClass(G))
			}
			var A = this.getIceNodes();
			var C = function (N, J) {
				var R = 0, K, T = "", N, I = J.className.split(" ");
				for (N = 0; N < I.length; N++) {
					D = H.exec(I[N]);
					if (D) {
						K = D[0];
						R = D[1]
					}
					var U = new RegExp("(" + z.join("|") + ")").exec(I[N]);
					if (U) {
						T = this._getChangeTypeFromAlias(U[1])
					}
				}
				var O = J.getAttribute(this.attributes.userId);
				var S;
				if (E && (O == E)) {
					S = F;
					J.setAttribute(this.attributes.userName, F)
				} else {
					S = J.getAttribute(this.attributes.userName)
				}
				this._setUserStyle(O, Number(R));
				var V = parseInt(J.getAttribute(this.attributes.changeId) || "");
				if (isNaN(V)) {
					V = this.getNewChangeId();
					J.setAttribute(this.attributes.changeId, V)
				}
				var L = parseInt(J.getAttribute(this.attributes.time) || "");
				if (isNaN(L)) {
					L = B
				}
				var Q = parseInt(J.getAttribute(this.attributes.lastTime) || "");
				if (isNaN(Q)) {
					Q = L
				}
				var M = J.getAttribute(this.attributes.sessionId);
				var P = J.getAttribute(this.attributes.changeData) || "";
				this._changes[V] = {
					type: T,
					style: K,
					userid: String(O),
					username: S,
					time: L,
					lastTime: Q,
					sessionId: M,
					data: P
				};
				this._updateNodeTooltip(J)
			}.bind(this);
			A.each(C);
			this._triggerChange()
		},
		_showTitles: function (A) {
			var z = this.getIceNodes();
			if (A) {
				c(z).each((function (B, C) {
					this._updateNodeTooltip(C)
				}).bind(this))
			} else {
				c(z).removeAttr("title")
			}
		},
		_updateTooltipsState: function () {
			var A, z = this;
			if (this.tooltips && this._isVisible) {
				if (!this._showingTips) {
					this._showingTips = true;
					A = this.getIceNodes();
					A.each(function (B, C) {
						z._addTooltip(C)
					})
				}
			} else {
				if (this._showingTips) {
					this._showingTips = false;
					A = this.getIceNodes();
					A.each(function (B, C) {
						c(C).unbind("mouseover").unbind("mouseout")
					})
				}
			}
		},
		_addTooltip: function (z) {
			c(z).unbind("mouseover").unbind("mouseout").mouseover(this._tooltipMouseOver).mouseout(this._tooltipMouseOut)
		},
		_tooltipMouseOver: function (C) {
			var B = C.currentTarget, A = c(B), D, z = this;
			if (C.buttons || A.data("_tooltip_t")) {
				return
			}
			D = setTimeout(function () {
				var F = z.currentChangeNode(B), H = F && F.getAttribute(z.attributes.changeId), G = H && z.getChange(H);
				if (G) {
					var E = o.dom.hasClass(F, z._getIceNodeClass(q)) ? "insert" : "delete";
					A.removeData("_tooltip_t");
					z.hostMethods.showTooltip(B, {
						userName: G.username,
						changeId: H,
						userId: G.userid,
						time: G.time,
						lastTime: G.lastTime,
						type: E
					})
				}
			}, this.tooltipsDelay);
			A.data("_tooltip_t", D)
		},
		_tooltipMouseOut: function (B) {
			var A = B.currentTarget, z = c(A), C = z.data("_tooltip_t");
			z.removeData("_tooltip_t");
			if (C) {
				clearTimeout(C)
			} else {
				this.hostMethods.hideTooltip(A)
			}
		},
		_removeTrackingInRangeOld: function (B) {
			var F = this._getIceNodeClass(q), A = this._getIceNodeClass(p), z = "." + F + ",." + A, C = "data-ice-class", E = function (K) {
				var J, I = null;
				if (K.nodeType == o.dom.TEXT_NODE) {
					I = c(K).parents(z)
				} else {
					var H = c(K);
					if (H.is(z)) {
						I = H
					} else {
						I = H.parents(z)
					}
				}
				J = (I && I[0]);
				if (J) {
					var G = J.className;
					J.setAttribute(C, G);
					J.setAttribute("class", "ice-no-decoration");
					return true
				}
				return false
			};
			B.getNodes(null, E);
			var D = this.element;
			setTimeout(function () {
				var G = c(D).find("[" + C + "]");
				G.each(function (I, J) {
					var H = J.getAttribute(C);
					if (H) {
						J.setAttribute("class", H);
						J.removeAttribute(C)
					}
				})
			}, 10)
		},
		_removeTrackingInRange: function (F) {
			var D = this._getIceNodeClass(q), z = this._getIceNodeClass(p), E = "." + D + ",." + z, G = this._savedNodesMap, H = "data-ice-class", A = Date.now() % 1000000, B = function (O) {
				var L, N, K = null;
				if (O.nodeType == o.dom.TEXT_NODE) {
					K = c(O).parents(E)
				} else {
					L = c(O);
					if (L.is(E)) {
						K = L
					} else {
						K = L.parents(E)
					}
				}
				if (N = (K && K[0])) {
					var M = x(N), I = N.className, J = String(A++);
					G[J] = {attributes: M, className: I};
					i(N);
					N.setAttribute(H, J);
					N.setAttribute("class", "ice-no-decoration");
					return true
				}
				return false
			};
			F.getNodes(null, B);
			var C = this.element;
			setTimeout(function () {
				var I = c(C).find("[" + H + "]");
				I.each(function (L, M) {
					var J = M.getAttribute(H), K = G[J];
					if (J) {
						delete G[J];
						Object.keys(K.attributes).forEach(function (N) {
							M.setAttribute(N, K.attributes[N])
						});
						M.setAttribute("class", K.className);
						M.removeAttribute(H)
					} else {
						t("missing save data for node")
					}
				})
			}, 10)
		},
		_onDomMutation: function (C) {
			var D, B = C.length, A, F, z, E;
			for (D = 0; D < B; ++D) {
				A = C[D];
				switch (A.type) {
					case"childList":
						z = A.addedNodes;
						for (F = z.length - 1; F >= 0; --F) {
							E = z[F];
							r.log("mutation: added node", E.tagName)
						}
						break
				}
			}
		},
		_setDomObserverTimeout: function () {
			var z = this;
			if (this._domObserverTimeout) {
				window.clearTimeout(this._domObserverTimeout)
			}
			this._domObserverTimeout = window.setTimeout(function () {
				z._domObserverTimeout = null;
				z._domObserver.disconnect()
			}, 1)
		},
		getAdjacentChangeId: function (B, C) {
			var A = C ? o.dom.getNextNode(B) : o.dom.getPrevNode(B), z, D = null;
			z = this._getIceNode(A, q) || this._getIceNode(A, p);
			if (!z) {
				if (this._isInsertNode(A) || this._isDeleteNode(A)) {
					z = A
				}
			}
			if (z && this._isCurrentUserIceNode(z)) {
				D = z.getAttribute(this.attributes.changeId)
			}
			return D
		}
	};
	var r = (window && window.console) || {
			log: function () {
			}, error: function () {
			}, info: function () {
			}, assert: function () {
			}, count: function () {
			}
		};

	function x(E) {
		var C = E.attributes, A, z = C && C.length, B = {};
		for (var D = 0; D < z; ++D) {
			A = C[D];
			B[A.name] = A.value
		}
		return B
	}

	function i(B) {
		var A = null, z;
		try {
			while (B.attributes.length > 0) {
				z = B.attributes[0];
				if (z === A) {
					return
				}
				A = z;
				B.removeAttribute(z.name)
			}
		} catch (C) {
		}
	}

	function e(z) {
		return z
	}

	function d(A) {
		var z = c.map(A.attributes, function (B) {
			return B.name
		});
		c(A).removeClass();
		c.each(z, function (B, C) {
			A.removeAttribute(C)
		})
	}

	function w(z) {
		return h == o.dom.getTagName(z)
	}

	function n(A) {
		var z = o.dom.getTagName(A);
		return h === z || u === z
	}

	function s(A, B) {
		if (!A) {
			return false
		}
		var z = A.nodeType;
		if (o.dom.TEXT_NODE == z) {
			return B && A.nodeValue && (B >= A.nodeValue.length - 1)
		}
		if (o.dom.ELEMENT_NODE == z) {
			return A.childNodes && A.childNodes.length && (B >= A.childNodes.length)
		}
		return false
	}

	var t = null;

	function j(z, C) {
		if (!z || !C || z.collapsed) {
			return z
		}
		var B;
		try {
			while ((B = z.endContainer) && (B !== C) && (z.endOffset == 0) && !z.collapsed) {
				if (B.previousSibling) {
					z.setEndBefore(B)
				} else {
					if (B.parentNode && B.parentNode !== C) {
						z.setEndBefore(B.parentNode)
					}
				}
				if (z.endContainer == B) {
					break
				}
			}
		} catch (A) {
			t(A, "fixSelection, while trying to set end")
		}
		try {
			while ((B = z.startContainer) && (B !== C) && !z.collapsed) {
				B = z.startContainer;
				if (B.nodeType == o.dom.TEXT_NODE) {
					if (z.startOffset >= B.nodeValue.length) {
						z.setStartAfter(B)
					}
				} else {
					if (z.startOffset >= B.childNodes.length) {
						z.setStartAfter(B)
					}
				}
				if (z.startContainer == B) {
					break
				}
			}
		} catch (A) {
			t(A, "fixSelection, while trying to set start")
		}
	}

	function l(D, z, C) {
		var B = D.length, A;
		if (z < 0 || z >= B) {
			return D
		}
		if (z + C >= B) {
			C = B - z
		}
		if (C === B) {
			return D
		}
		A = z > 0 ? D.splitText(z) : D;
		if (A.length > C) {
			A.splitText(C)
		}
		return A
	}

	function v(C, A, D, B) {
		if (B) {
			if (A.collapsed && A.startContainer && A.startContainer.nodeType === o.dom.TEXT_NODE && A.startContainer.length) {
				return
			}
			var z = D.createTextNode("\uFEFF");
			if (C) {
				C.appendChild(z)
			} else {
				A.insertNode(z)
			}
			A.selectNode(z)
		} else {
			if (C) {
				A.selectNodeContents(C)
			}
		}
	}

	function a(A, C) {
		if (!A || !A.startContainer || !A.endContainer) {
			return
		}
		var D = [];

		function z(G) {
			if (!G) {
				return ""
			}
			G = G.replace("/\n/g", "\\n").replace("/\r/g", "").replace("\u200B", "{filler}").replace("\uFEFF", "{filler}");
			if (G.length <= 15) {
				return G
			}
			return G.substring(0, 5) + "..." + G.substring(G.length - 5)
		}

		function E(H) {
			var I;
			if (H.nodeType === 3) {
				I = "Text:" + z(H.nodeValue)
			} else {
				var G = H.innerText;
				I = H.nodeName + (G ? "(" + z(G) + ")" : "")
			}
			D.push("<" + I + " />")
		}

		function F(L, K, J) {
			if ("number" !== typeof J) {
				J = -1
			}
			if (3 == L.nodeType) {
				var G = L.nodeValue;
				D.push(z(G.substring(0, K)));
				D.push("|");
				if (J > K) {
					D.push(z(G.substring(K, J)));
					D.push("|");
					D.push(z(G.substring(J)))
				} else {
					D.push(z(G.substring(K)))
				}
			} else {
				if (1 == L.nodeType) {
					var I = 0, H = L.childNodes, N = 0;
					E(L);
					for (I = N; I < K; ++I) {
						E(H[I])
					}
					D.push("|");
					if (J > K) {
						for (I = K; I < J; ++I) {
							E(H[I])
						}
						D.push("|")
					}
					if (J > 0 && J < H.length) {
						var M = H[J];
						while (M) {
							E(M);
							M = M.nextSibling
						}
					}
				}
			}
		}

		if (A.startContainer === A.endContainer) {
			F(A.startContainer, A.startOffset, A.endOffset)
		} else {
			F(A.startContainer, A.startOffset);
			F(A.endContainer, A.endOffset)
		}
		var B = D.join(" ");
		if (C) {
			r.log(C + ":" + B)
		}
		return B
	}

	o.printRange = a;
	o.InlineChangeEditor = f
}(this.ice || window.ice, window.jQuery));
(function (k, g) {
	var e = k, c = {}, f = null, d = /^\s*$/, i = /^\d+$/;
	c.DOM_VK_DELETE = 8;
	c.DOM_VK_LEFT = 37;
	c.DOM_VK_UP = 38;
	c.DOM_VK_RIGHT = 39;
	c.DOM_VK_DOWN = 40;
	c.DOM_VK_ENTER = 13;
	c.ELEMENT_NODE = 1;
	c.ATTRIBUTE_NODE = 2;
	c.TEXT_NODE = 3;
	c.CDATA_SECTION_NODE = 4;
	c.ENTITY_REFERENCE_NODE = 5;
	c.ENTITY_NODE = 6;
	c.PROCESSING_INSTRUCTION_NODE = 7;
	c.COMMENT_NODE = 8;
	c.DOCUMENT_NODE = 9;
	c.DOCUMENT_TYPE_NODE = 10;
	c.DOCUMENT_FRAGMENT_NODE = 11;
	c.NOTATION_NODE = 12;
	c.CHARACTER_UNIT = "character";
	c.WORD_UNIT = "word";
	c.BREAK_ELEMENT = "br";
	c.PARAGRAPH_ELEMENT = "p";
	c.CONTENT_STUB_ELEMENTS = ["img", "hr", "iframe", "param", "link", "meta", "input", "frame", "col", "base", "area"];
	c.BLOCK_ELEMENTS = ["body", "p", "div", "pre", "ul", "ol", "li", "table", "tbody", "td", "th", "fieldset", "form", "blockquote", "dl", "dt", "dd", "dir", "center", "address", "h1", "h2", "h3", "h4", "h5", "h6"];
	c.TEXT_CONTAINER_ELEMENTS = ["body", "p", "div", "pre", "span", "b", "strong", "i", "li", "td", "th", "blockquote", "dt", "dd", "center", "address", "h1", "h2", "h3", "h4", "h5", "h6", "ins", "del"];
	c.STUB_ELEMENTS = c.CONTENT_STUB_ELEMENTS.slice();
	c.STUB_ELEMENTS.push(c.BREAK_ELEMENT);
	var j = c.CONTENT_STUB_ELEMENTS.join(", ");
	c.isEmptyString = function (n) {
		if (!n) {
			return true
		}
		var l = n.length - 1, m;
		while (l >= 0) {
			m = n[l--];
			if (m !== "\u200B" && m !== "\uFEFF") {
				return false
			}
		}
		return true
	};
	c.getKeyChar = function (l) {
		return String.fromCharCode(l.which)
	};
	c.getClass = function (n, m, l) {
		if (!m) {
			m = document.body
		}
		n = "." + n.split(" ").join(".");
		if (l) {
			n = l + n
		}
		return g.makeArray(g(m).find(n))
	};
	c.getId = function (m, l) {
		if (!l) {
			l = document
		}
		element = l.getElementById(m);
		return element
	};
	c.getTag = function (l, m) {
		if (!m) {
			m = document
		}
		return g.makeArray(g(m).find(l))
	};
	c.getElementWidth = function (l) {
		return l.offsetWidth
	};
	c.getElementHeight = function (l) {
		return l.offsetHeight
	};
	c.getElementDimensions = function (l) {
		return {width: c.getElementWidth(l), height: c.getElementHeight(l)}
	};
	c.insertBefore = function (m, l) {
		g(m).before(l)
	};
	c.insertAfter = function (o, n) {
		if (o && n) {
			var m = o.nextSibling, l = o.parentNode;
			return m ? l.insertBefore(n, m) : l.appendChild(n)
		}
	};
	c.removeWhitespace = function (l) {
		g(l).contents().filter(function () {
			if (this.nodeType != k.dom.TEXT_NODE && this.nodeName == "UL" || this.nodeName == "OL") {
				c.removeWhitespace(this);
				return false
			} else {
				if (this.nodeType != k.dom.TEXT_NODE) {
					return false
				} else {
					return !/\S/.test(this.nodeValue)
				}
			}
		}).remove()
	};
	c.contents = function (l) {
		return g.makeArray(g(l).contents())
	};
	c.extractContent = function (l) {
		var n = document.createDocumentFragment(), m;
		while ((m = l.firstChild)) {
			n.appendChild(m)
		}
		return n
	};
	c.getNode = function (m, l) {
		if (!m) {
			return null
		}
		m = m.$ || m;
		return (m.nodeType != c.TEXT_NODE && g(m).is(l)) ? m : c.parents(m, l)[0] || null
	};
	c.getParents = function (r, o, q) {
		var n = g(r).parents(o);
		var p = n.length;
		var l = [];
		for (var m = 0; m < p; m++) {
			if (n[m] === q) {
				break
			}
			l.push(n[m])
		}
		return l
	};
	c.hasBlockChildren = function (m) {
		var n = m.childNodes.length;
		for (var l = 0; l < n; l++) {
			if (m.childNodes[l].nodeType === c.ELEMENT_NODE) {
				if (c.isBlockElement(m.childNodes[l]) === true) {
					return true
				}
			}
		}
		return false
	};
	c.removeTag = function (m, l) {
		g(m).find(l).replaceWith(function () {
			return g(this).contents()
		});
		return m
	};
	c.stripEnclosingTags = function (l, n) {
		var m = g(l);
		m.find("*").not(n).replaceWith(function () {
			var o = g();
			var q;
			try {
				q = g(this);
				o = q.contents()
			} catch (p) {
			}
			if (o.length === 0) {
				q.remove()
			}
			return o
		});
		return m[0]
	};
	c.getSiblings = function (o, n, p, m) {
		if (p === true) {
			if (n === "prev") {
				return g(o).prevAll()
			} else {
				return g(o).nextAll()
			}
		} else {
			var l = [];
			if (n === "prev") {
				while (o.previousSibling) {
					o = o.previousSibling;
					if (o === m) {
						break
					}
					l.push(o)
				}
			} else {
				while (o.nextSibling) {
					o = o.nextSibling;
					if (o === m) {
						break
					}
					l.push(o)
				}
			}
			return l
		}
	};
	c.getNodeTextContent = function (l) {
		return g(l).text()
	};
	c.getNodeStubContent = function (l) {
		return g(l).find(j)
	};
	c.hasNoTextOrStubContent = function (l) {
		var m = c.getNodeTextContent(l);
		if (!c.isEmptyString(m)) {
			return false
		}
		if (!l.firstChild) {
			return true
		}
		return g(l).find(j).length === 0
	};
	c.isEmptyTextNode = function (l) {
		if (!l || (c.TEXT_NODE !== l.nodeType)) {
			return false
		}
		if (l.length === 0) {
			return true
		}
		return c.isEmptyString(l.nodeValue)
	};
	c.getNodeCharacterLength = function (l) {
		return c.getNodeTextContent(l).length + g(l).find(c.STUB_ELEMENTS.join(", ")).length
	};
	c.setNodeTextContent = function (m, l) {
		return g(m).text(l)
	};
	c.getTagName = function (l) {
		return l && l.tagName && l.tagName.toLowerCase() || null
	};
	c.getIframeDocument = function (l) {
		var m = null;
		if (l.contentDocument) {
			m = l.contentDocument
		} else {
			if (l.contentWindow) {
				m = l.contentWindow.document
			} else {
				if (l.document) {
					m = l.document
				}
			}
		}
		return m
	};
	c.isBlockElement = function (l) {
		return c.BLOCK_ELEMENTS.indexOf(l.nodeName.toLowerCase()) != -1
	};
	c.isStubElement = function (l) {
		return c.STUB_ELEMENTS.indexOf(l.nodeName.toLowerCase()) != -1
	};
	c.removeBRFromChild = function (l) {
		if (l && l.hasChildNodes()) {
			for (var m = 0; m < l.childNodes.length; m++) {
				var n = l.childNodes[m];
				if (n && (k.dom.BREAK_ELEMENT == k.dom.getTagName(n))) {
					n.parentNode.removeChild(n)
				}
			}
		}
	};
	c.isChildOf = function (m, l) {
		try {
			while (m && m.parentNode) {
				if (m.parentNode === l) {
					return true
				}
				m = m.parentNode
			}
		} catch (n) {
		}
		return false
	};
	c.isChildOfTagName = function (m, l) {
		try {
			while (m && m.parentNode) {
				if (m.parentNode && m.parentNode.tagName && m.parentNode.tagName.toLowerCase() === l) {
					return m.parentNode
				}
				m = m.parentNode
			}
		} catch (n) {
		}
		return false
	};
	c.isChildOfTagNames = function (m, o) {
		try {
			while (m && m.parentNode) {
				if (m.parentNode && m.parentNode.tagName) {
					tagName = m.parentNode.tagName.toLowerCase();
					for (var l = 0; l < o.length; l++) {
						if (tagName === o[l]) {
							return m.parentNode
						}
					}
				}
				m = m.parentNode
			}
		} catch (n) {
		}
		return null
	};
	c.isChildOfClassName = function (m, l) {
		try {
			while (m && m.parentNode) {
				if (g(m.parentNode).hasClass(l)) {
					return m.parentNode
				}
				m = m.parentNode
			}
		} catch (n) {
		}
		return null
	};
	c.replaceWith = function (m, l) {
		return g(m).replaceWith(l)
	};
	c.getElementsBetween = function (u, q) {
		var l = [];
		if (u === q) {
			return l
		}
		if (c.isChildOf(q, u) === true) {
			var r = u.childNodes.length;
			for (var o = 0; o < r; o++) {
				if (u.childNodes[o] === q) {
					break
				} else {
					if (c.isChildOf(q, u.childNodes[o]) === true) {
						return c.arrayMerge(l, c.getElementsBetween(u.childNodes[o], q))
					} else {
						l.push(u.childNodes[o])
					}
				}
			}
			return l
		}
		var n = u.nextSibling;
		while (n) {
			if (c.isChildOf(q, n) === true) {
				l = c.arrayMerge(l, c.getElementsBetween(n, q));
				return l
			} else {
				if (n === q) {
					return l
				} else {
					l.push(n);
					n = n.nextSibling
				}
			}
		}
		var w = c.getParents(u);
		var s = c.getParents(q);
		var v = c.arrayDiff(w, s, true);
		var t = v.length;
		for (var m = 0; m < (t - 1); m++) {
			l = c.arrayMerge(l, c.getSiblings(v[m], "next"))
		}
		var p = v[(v.length - 1)];
		l = c.arrayMerge(l, c.getElementsBetween(p, q));
		return l
	};
	c.getCommonAncestor = function (m, l) {
		var n = m;
		while (n) {
			if (c.isChildOf(l, n) === true) {
				return n
			}
			n = n.parentNode
		}
		return null
	};
	c.getNextNode = function (m, l) {
		if (m) {
			while (m.parentNode) {
				if (m === l) {
					return null
				}
				if (m.nextSibling) {
					if (m.nextSibling.nodeType === c.TEXT_NODE && m.nextSibling.length === 0) {
						m = m.nextSibling;
						continue
					}
					return c.getFirstChild(m.nextSibling)
				}
				m = m.parentNode
			}
		}
		return null
	};
	c.getNextContentNode = function (m, l) {
		if (m) {
			while (m.parentNode) {
				if (m === l) {
					return null
				}
				if (m.nextSibling && c.canContainTextElement(c.getBlockParent(m))) {
					if (m.nextSibling.nodeType === c.TEXT_NODE && m.nextSibling.length === 0) {
						m = m.nextSibling;
						continue
					}
					return m.nextSibling
				} else {
					if (m.nextElementSibling) {
						return m.nextElementSibling
					}
				}
				m = m.parentNode
			}
		}
		return null
	};
	c.getPrevNode = function (m, l) {
		if (m) {
			while (m.parentNode) {
				if (m === l) {
					return null
				}
				if (m.previousSibling) {
					if (m.previousSibling.nodeType === c.TEXT_NODE && m.previousSibling.length === 0) {
						m = m.previousSibling;
						continue
					}
					return c.getLastChild(m.previousSibling)
				}
				m = m.parentNode
			}
		}
		return null
	};
	c.getPrevContentNode = function (m, l) {
		if (m) {
			while (m.parentNode) {
				if (m === l) {
					return null
				}
				if (m.previousSibling && c.canContainTextElement(c.getBlockParent(m))) {
					if (m.previousSibling.nodeType === c.TEXT_NODE && m.previousSibling.length === 0) {
						m = m.previousSibling;
						continue
					}
					return m.previousSibling
				} else {
					if (m.previousElementSibling) {
						return m.previousElementSibling
					}
				}
				m = m.parentNode
			}
		}
		return null
	};
	function h(n, l) {
		while (n) {
			if (c.TEXT_NODE == n.nodeType) {
				return n
			}
			for (var o = n.firstChild; o; o = o.nextSibling) {
				var m = h(o, l);
				if (m) {
					return m
				}
			}
			if (c.isTextContainer(n)) {
				return n
			}
			n = n.nextSibling
		}
		return null
	}

	function a(n, l) {
		while (n) {
			if (c.TEXT_NODE == n.nodeType) {
				return n
			}
			for (var o = n.lastChild; o; o = o.previousSibling) {
				var m = a(o, l);
				if (m) {
					return m
				}
			}
			if (c.isTextContainer(n)) {
				return n
			}
			n = n.previousSibling
		}
		return null
	}

	c.findPrevTextContainer = function (n, l) {
		if (!n || n == l) {
			return {node: l, offset: 0}
		}
		if (n.parentNode && c.isTextContainer(n.parentNode)) {
			return {node: n.parentNode, offset: c.getNodeIndex(n)}
		}
		while (n.previousSibling) {
			var m = a(n.previousSibling);
			if (m) {
				return {node: m, offset: c.getNodeLength(m)}
			}
			n = n.previousSibling
		}
		return c.findPrevTextContainer(n.parentNode && n.parentNode.previousSibling, l)
	};
	c.findNextTextContainer = function (n, l) {
		if (!n || n == l) {
			return {node: l, offset: c.getNodeLength(l)}
		}
		if (n.parentNode && c.isTextContainer(n.parentNode)) {
			return {node: n.parentNode, offset: c.getNodeIndex(n) + 1}
		}
		while (n.nextSibling) {
			var m = h(n.nextSibling);
			if (m) {
				return {node: m, offset: 0}
			}
			n = n.previousSibling
		}
		return c.findNextTextContainer(n.parentNode && n.parentNode.nextSibling, l)
	};
	c.getNodeLength = function (l) {
		return l ? (c.TEXT_NODE == l.nodeType ? l.length : ((l.childNodes && l.childNodes.length) || 0)) : 0
	};
	c.isTextContainer = function (l) {
		return (l && (c.TEXT_NODE == l.nodeType) || c.TEXT_CONTAINER_ELEMENTS.indexOf((l.nodeName || "").toLowerCase()) >= 0)
	};
	c.getNodeIndex = function (m) {
		var l = 0;
		while ((m = m.previousSibling)) {
			++l
		}
		return l
	};
	c.canContainTextElement = function (l) {
		if (l && l.nodeName) {
			return c.TEXT_CONTAINER_ELEMENTS.lastIndexOf(l.nodeName.toLowerCase()) != -1
		} else {
			return false
		}
	};
	c.getFirstChild = function (l) {
		if (l.firstChild) {
			if (l.firstChild.nodeType === c.ELEMENT_NODE) {
				return c.getFirstChild(l.firstChild)
			} else {
				return l.firstChild
			}
		}
		return l
	};
	c.getLastChild = function (l) {
		if (l.lastChild) {
			if (l.lastChild.nodeType === c.ELEMENT_NODE) {
				return c.getLastChild(l.lastChild)
			} else {
				return l.lastChild
			}
		}
		return l
	};
	c.removeEmptyNodes = function (n, o) {
		var l = g(n).find(":empty");
		var m = l.length;
		while (m > 0) {
			m--;
			if (c.isStubElement(l[m]) === false) {
				if (!o || o.call(this, l[m]) !== false) {
					c.remove(l[m])
				}
			}
		}
	};
	c.create = function (l) {
		return g(l)[0]
	};
	c.children = function (l, m) {
		return g(l).children(m)
	};
	c.parent = function (m, l) {
		return g(m).parent(l)[0]
	};
	c.parents = function (m, l) {
		return g(m).parents(l)
	};
	c.walk = function (m, o, l) {
		if (!m) {
			return
		}
		if (!l) {
			l = 0
		}
		var n = o.call(this, m, l);
		if (n === false) {
			return
		}
		if (m.childNodes && m.childNodes.length > 0) {
			c.walk(m.firstChild, o, (l + 1))
		} else {
			if (m.nextSibling) {
				c.walk(m.nextSibling, o, l)
			} else {
				if (m.parentNode && m.parentNode.nextSibling) {
					c.walk(m.parentNode.nextSibling, o, (l - 1))
				}
			}
		}
	};
	c.revWalk = function (l, n) {
		if (!l) {
			return
		}
		var m = n.call(this, l);
		if (m === false) {
			return
		}
		if (l.childNodes && l.childNodes.length > 0) {
			c.walk(l.lastChild, n)
		} else {
			if (l.previousSibling) {
				c.walk(l.previousSibling, n)
			} else {
				if (l.parentNode && l.parentNode.previousSibling) {
					c.walk(l.parentNode.previousSibling, n)
				}
			}
		}
	};
	c.setStyle = function (l, n, m) {
		if (l) {
			g(l).css(n, m)
		}
	};
	c.getStyle = function (l, m) {
		return g(l).css(m)
	};
	c.hasClass = function (l, m) {
		return g(l).hasClass(m)
	};
	c.addClass = function (l, m) {
		g(l).addClass(m)
	};
	c.removeClass = function (l, m) {
		g(l).removeClass(m)
	};
	c.preventDefault = function (l) {
		l.preventDefault();
		c.stopPropagation(l)
	};
	c.stopPropagation = function (l) {
		l.stopPropagation()
	};
	c.isBlank = function (l) {
		return (!l || d.test(l))
	};
	c.isFn = function (l) {
		return (typeof l === "function")
	};
	c.isObj = function (l) {
		return (l !== null && typeof l === "object")
	};
	c.isset = function (l) {
		return (typeof l !== "undefined" && l !== null)
	};
	c.isArray = function (l) {
		return g.isArray(l)
	};
	c.isNumeric = function (l) {
		return l.match(i) !== null
	};
	c.getUniqueId = function () {
		var m = (new Date()).getTime();
		var l = Math.ceil(Math.random() * 1000000);
		var n = m + "" + l;
		return n.substr(5, 18).replace(/,/, "")
	};
	c.inArray = function (o, m) {
		var n = m.length;
		for (var l = 0; l < n; l++) {
			if (o === m[l]) {
				return true
			}
		}
		return false
	};
	c.arrayDiff = function (p, o, n) {
		var q = p.length, m, l = [];
		for (m = 0; m < q; m++) {
			if (c.inArray(p[m], o) === false) {
				l.push(p[m])
			}
		}
		if (n !== true) {
			q = o.length;
			for (m = 0; m < q; m++) {
				if (c.inArray(o[m], p) === false) {
					l.push(o[m])
				}
			}
		}
		return l
	};
	c.arrayMerge = function (n, m) {
		var o = m.length, l;
		for (l = 0; l < o; l++) {
			n.push(m[l])
		}
		return n
	};
	c.stripTags = function (n, q) {
		if (typeof q === "string") {
			var p = g("<div>" + n + "</div>");
			p.find("*").not(q).remove();
			return p.html()
		} else {
			var l;
			var m = new RegExp(/<\/?(\w+)((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)+\s*|\s*)\/?>/gim);
			var o = n;
			while ((l = m.exec(n)) != null) {
				if (c.isset(q) === false || c.inArray(l[1], q) !== true) {
					o = o.replace(l[0], "")
				}
			}
			return o
		}
	};
	c.browser = function () {
		if (f) {
			return g.extend({}, f)
		}
		f = (function () {
			function m(q) {
				q = q.toLowerCase();
				var p = /(chrome)[ \/]([\w.]+)/.exec(q) || /(webkit)[ \/]([\w.]+)/.exec(q) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(q) || /(msie) ([\w.]+)/.exec(q) || q.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(q) || [];
				return {browser: p[1] || "", version: p[2] || "0"}
			}

			var o = navigator.userAgent.toLowerCase(), l = m(o), n = {type: "unknown", version: 0, msie: false};
			if (l.browser) {
				n[l.browser] = true;
				n.version = l.version || 0;
				n.type = l.browser
			}
			if (n.chrome) {
				n.webkit = true
			} else {
				if (n.webkit) {
					n.safari = true
				}
			}
			if (n.webkit) {
				n.type = "webkit"
			}
			n.firefox = (/firefox/.test(o) == true);
			if (!n.msie) {
				n.msie = Boolean(/trident/.test(o))
			}
			return n
		})();
		return g.extend({}, f)
	};
	c.getBrowserType = function () {
		if (this._browserType === null) {
			var n = ["msie", "firefox", "chrome", "safari"];
			var m = n.length;
			for (var l = 0; l < m; l++) {
				var o = new RegExp(n[l], "i");
				if (o.test(navigator.userAgent) === true) {
					this._browserType = n[l];
					return this._browserType
				}
			}
			this._browserType = "other"
		}
		return this._browserType
	};
	c.getWebkitType = function () {
		if (c.browser().type !== "webkit") {
			console.log("Not a webkit!");
			return false
		}
		var l = Object.prototype.toString.call(window.HTMLElement).indexOf("Constructor") > 0;
		if (l) {
			return "safari"
		}
		return "chrome"
	};
	c.isBrowser = function (l) {
		return (c.browser().type === l)
	};
	c.getBlockParent = function (m, l) {
		if (c.isBlockElement(m) === true) {
			return m
		}
		if (m) {
			while (m.parentNode) {
				m = m.parentNode;
				if (c.isBlockElement(m) === true) {
					return m
				}
				if (m === l) {
					return null
				}
			}
		}
		return null
	};
	c.findNodeParent = function (n, l, m) {
		if (n) {
			while (n.parentNode) {
				if (n === m) {
					return null
				}
				if (g(n).is(l) === true) {
					return n
				}
				n = n.parentNode
			}
		}
		return null
	};
	c.onBlockBoundary = function (p, n, o) {
		if (!p || !n) {
			return false
		}
		var m = o.join(", "), l = c.isChildOfTagNames(p, o) || g(p).is(m) && p || null, q = c.isChildOfTagNames(n, o) || g(n).is(m) && n || null;
		return (l !== q)
	};
	c.isOnBlockBoundary = function (o, n, l) {
		if (!o || !n) {
			return false
		}
		var m = c.getBlockParent(o, l) || c.isBlockElement(o, l) && o || null, p = c.getBlockParent(n, l) || c.isBlockElement(n, l) && n || null;
		return (m !== p)
	};
	c.mergeContainers = function (m, l) {
		if (!m || !l) {
			return false
		}
		if (m.nodeType === c.TEXT_NODE || c.isStubElement(m)) {
			l.appendChild(m)
		} else {
			if (m.nodeType === c.ELEMENT_NODE) {
				while (m.firstChild) {
					l.appendChild(m.firstChild)
				}
				g(m).remove()
			}
		}
		return true
	};
	c.mergeBlockWithSibling = function (l, o, n) {
		var m = n ? g(o).next().get(0) : g(o).prev().get(0);
		if (n) {
			c.mergeContainers(m, o)
		} else {
			c.mergeContainers(o, m)
		}
		l.collapse(true);
		return true
	};
	c.date = function (w, t, m) {
		if (t === null && m) {
			t = c.tsIso8601ToTimestamp(m);
			if (!t) {
				return
			}
		}
		var o = new Date(t);
		var v = w.split("");
		var n = v.length;
		var p = "";
		for (var q = 0; q < n; q++) {
			var l = "";
			var s = v[q];
			switch (s) {
				case"D":
				case"l":
					var u = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
					l = u[o.getDay()];
					if (s === "D") {
						l = l.substring(0, 3)
					}
					break;
				case"F":
				case"m":
					l = o.getMonth() + 1;
					if (l < 10) {
						l = "0" + l
					}
					break;
				case"M":
					months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
					l = months[o.getMonth()];
					if (s === "M") {
						l = l.substring(0, 3)
					}
					break;
				case"d":
					l = o.getDate();
					break;
				case"S":
					l = c.getOrdinalSuffix(o.getDate());
					break;
				case"Y":
					l = o.getFullYear();
					break;
				case"y":
					l = o.getFullYear();
					l = l.toString().substring(2);
					break;
				case"H":
					l = o.getHours();
					break;
				case"h":
					l = o.getHours();
					if (l === 0) {
						l = 12
					} else {
						if (l > 12) {
							l -= 12
						}
					}
					break;
				case"i":
					l = c.addNumberPadding(o.getMinutes());
					break;
				case"a":
					l = "am";
					if (o.getHours() >= 12) {
						l = "pm"
					}
					break;
				default:
					l = s;
					break
			}
			p += l
		}
		return p
	};
	c.getOrdinalSuffix = function (m) {
		var n = "";
		var l = (m % 100);
		if (l >= 4 && l <= 20) {
			n = "th"
		} else {
			switch (m % 10) {
				case 1:
					n = "st";
					break;
				case 2:
					n = "nd";
					break;
				case 3:
					n = "rd";
					break;
				default:
					n = "th";
					break
			}
		}
		return n
	};
	c.addNumberPadding = function (l) {
		if (l < 10) {
			l = "0" + l
		}
		return l
	};
	c.tsIso8601ToTimestamp = function (l) {
		var n = /(\d\d\d\d)(?:-?(\d\d)(?:-?(\d\d)(?:[T ](\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(?:Z|(?:([-+])(\d\d)(?::?(\d\d))?)?)?)?)?)?/;
		var p = l.match(new RegExp(n));
		if (p) {
			var m = new Date();
			m.setDate(p[3]);
			m.setFullYear(p[1]);
			m.setMonth(p[2] - 1);
			m.setHours(p[4]);
			m.setMinutes(p[5]);
			m.setSeconds(p[6]);
			var o = (p[9] * 60);
			if (p[8] === "+") {
				o *= -1
			}
			o -= m.getTimezoneOffset();
			return (m.getTime() + (o * 60 * 1000))
		}
		return null
	};
	c.normalizeNode = function (m, l) {
		if (!m) {
			return
		}
		if (!c.browser().msie && (l !== true && "function" == typeof m.normalize)) {
			return m.normalize()
		}
		return b(m)
	};
	function b(o) {
		if (!o) {
			return
		}
		var l = 1;
		var m = 3;
		var q = o.firstChild;
		while (q) {
			if (q.nodeType == l) {
				b(q)
			} else {
				if (q.nodeType == m) {
					var n;
					while ((n = q.nextSibling) && n.nodeType == m) {
						var p = n.nodeValue;
						if (p != null && p.length) {
							q.nodeValue = q.nodeValue + p
						}
						o.removeChild(n)
					}
				}
			}
			q = q.nextSibling
		}
	}

	e.dom = c
}(this.ice || window.ice, window.jQuery));
(function (d) {
	var a = d, b = d.rangy, c;
	c = function (e) {
		this._selection = null;
		this.env = e;
		this._initializeRangeLibrary();
		this._getSelection()
	};
	c.prototype = {
		_getSelection: function () {
			if (this._selection) {
				this._selection.refresh()
			} else {
				if (this.env.frame) {
					this._selection = b.getSelection(this.env.frame)
				} else {
					this._selection = b.getSelection()
				}
			}
			return this._selection
		}, createRange: function () {
			return b.createRange(this.env.document)
		}, getRangeAt: function (h) {
			try {
				this._selection.refresh();
				return this._selection.getRangeAt(h)
			} catch (f) {
				this._selection = null;
				try {
					return this._getSelection().getRangeAt(0)
				} catch (g) {
				}
			}
			return null
		}, addRange: function (e) {
			this._selection || (this._selection = this._getSelection());
			this._selection.setSingleRange(e);
			this._selection.ranges = [e]
		}, _initializeRangeLibrary: function () {
			var f = this;
			b.init();
			b.config.checkSelectionRanges = false;
			var e = function (i, j, h, g) {
				if (h === 0) {
					return
				}
				var k = i.collapsed;
				switch (j) {
					case ice.dom.CHARACTER_UNIT:
						if (h > 0) {
							i.moveCharRight(g, h)
						} else {
							i.moveCharLeft(g, h * -1)
						}
						break;
					case ice.dom.WORD_UNIT:
					default:
						break
				}
				if (k) {
					i.collapse(g)
				}
			};
			b.rangePrototype.moveStart = function (h, g) {
				e(this, h, g, true)
			};
			b.rangePrototype.moveEnd = function (h, g) {
				e(this, h, g, false)
			};
			b.rangePrototype.setRange = function (i, g, h) {
				if (i) {
					this.setStart(g, h)
				} else {
					this.setEnd(g, h)
				}
			};
			b.rangePrototype.moveCharLeft = function (j, i) {
				var h, l;
				if (j) {
					h = this.startContainer;
					l = this.startOffset
				} else {
					h = this.endContainer;
					l = this.endOffset
				}
				if (h.nodeType === ice.dom.ELEMENT_NODE) {
					if (h.hasChildNodes() && l > 0) {
						var k = h.childNodes[l - 1], g = this.getLastSelectableChild(k);
						if (g) {
							h = g
						} else {
							h = this.getPreviousTextNode(k)
						}
						if (!h) {
							return
						}
						l = h.data.length - i
					} else {
						l = i * -1
					}
				} else {
					l -= i
				}
				if (l < 0) {
					while (l < 0) {
						h = this.getPreviousTextNode(h);
						if (!h) {
							return
						}
						if (h.nodeType === ice.dom.ELEMENT_NODE) {
							continue
						}
						l += h.data.length
					}
				}
				this.setRange(j, h, l)
			};
			b.rangePrototype.moveCharRight = function (i, h) {
				var g, l;
				if (i) {
					g = this.startContainer;
					l = this.startOffset
				} else {
					g = this.endContainer;
					l = this.endOffset
				}
				if (g.nodeType === ice.dom.ELEMENT_NODE) {
					var j = this.getNextTextNode(g.childNodes[Math.min(l, g.childNodes.length - 1)]);
					if (j) {
						g = j
					} else {
						g = this.getNextTextNode(g)
					}
					l = h
				} else {
					l += h
				}
				if (!g) {
					return
				}
				var k = (l - g.data.length);
				if (k > 0) {
					while (k > 0) {
						g = this.getNextContainer(g);
						if (!g) {
							return
						}
						if (g.nodeType === ice.dom.ELEMENT_NODE) {
							continue
						}
						if (g.data.length >= k) {
							break
						} else {
							if (g.data.length > 0) {
								k -= g.data.length
							}
						}
					}
					l = k
				}
				this.setRange(i, g, l)
			};
			b.rangePrototype.getNextContainer = function (g, j) {
				if (!g) {
					return null
				}
				j = j || [];
				while (g.nextSibling) {
					g = g.nextSibling;
					if (g.nodeType !== ice.dom.TEXT_NODE) {
						var i = this.getFirstSelectableChild(g);
						if (i !== null) {
							return i
						}
					} else {
						if (this.isSelectable(g) === true) {
							return g
						}
					}
				}
				while (g && !g.nextSibling) {
					g = g.parentNode
				}
				if (!g) {
					return null
				}
				g = g.nextSibling;
				if (this.isSelectable(g) === true) {
					return g
				} else {
					if (ice.dom.isBlockElement(g) === true) {
						j.push(g)
					}
				}
				var h = this.getFirstSelectableChild(g);
				if (h !== null) {
					return h
				}
				return this.getNextContainer(g, j)
			};
			b.rangePrototype.getPreviousContainer = function (g, j) {
				if (!g) {
					return null
				}
				j = j || [];
				while (g.previousSibling) {
					g = g.previousSibling;
					if (g.nodeType !== ice.dom.TEXT_NODE) {
						if (ice.dom.isStubElement(g) === true) {
							return g
						} else {
							var i = this.getLastSelectableChild(g);
							if (i !== null) {
								return i
							}
						}
					} else {
						if (this.isSelectable(g) === true) {
							return g
						}
					}
				}
				while (g && !g.previousSibling) {
					g = g.parentNode
				}
				if (!g) {
					return null
				}
				g = g.previousSibling;
				if (this.isSelectable(g) === true) {
					return g
				} else {
					if (ice.dom.isBlockElement(g) === true) {
						j.push(g)
					}
				}
				var h = this.getLastSelectableChild(g);
				if (h !== null) {
					return h
				}
				return this.getPreviousContainer(g, j)
			};
			b.rangePrototype.getNextTextNode = function (g) {
				if (g.nodeType === ice.dom.ELEMENT_NODE) {
					if (g.firstChild) {
						var h = this.getFirstSelectableChild(g);
						if (h) {
							return h
						}
					}
				}
				g = this.getNextContainer(g);
				if (!g) {
					return null
				}
				if (g.nodeType === ice.dom.TEXT_NODE) {
					return g
				}
				return this.getNextTextNode(g)
			};
			b.rangePrototype.getPreviousTextNode = function (g, h) {
				g = this.getPreviousContainer(g, h);
				if (!g) {
					return null
				}
				if (g.nodeType === ice.dom.TEXT_NODE) {
					return g
				}
				return this.getPreviousTextNode(g, h)
			};
			b.rangePrototype.getFirstSelectableChild = function (h) {
				if (!h) {
					return null
				}
				if (h.nodeType === ice.dom.TEXT_NODE) {
					return h
				}
				var i = h.firstChild;
				while (i) {
					if (this.isSelectable(i) === true) {
						return i
					} else {
						if (i.firstChild) {
							var g = this.getFirstSelectableChild(i);
							if (g !== null) {
								return g
							} else {
								i = i.nextSibling
							}
						} else {
							i = i.nextSibling
						}
					}
				}
				return null
			};
			b.rangePrototype.getLastSelectableChild = function (h) {
				if (!h) {
					return null
				}
				if (h.nodeType == ice.dom.TEXT_NODE) {
					return h
				}
				var i = h.lastChild;
				while (i) {
					if (this.isSelectable(i) === true) {
						return i
					} else {
						if (i.lastChild) {
							var g = this.getLastSelectableChild(i);
							if (g !== null) {
								return g
							} else {
								i = i.previousSibling
							}
						} else {
							i = i.previousSibling
						}
					}
				}
				return null
			};
			b.rangePrototype.isSelectable = function (g) {
				return Boolean(g && g.nodeType === ice.dom.TEXT_NODE && g.data.length !== 0)
			};
			b.rangePrototype.getHTMLContents = function (g) {
				if (!g) {
					g = this.cloneContents()
				}
				var h = f.env.document.createElement("div");
				h.appendChild(g.cloneNode(true));
				return h.innerHTML
			};
			b.rangePrototype.getHTMLContentsObj = function () {
				return this.cloneContents()
			}
		}
	};
	a.Selection = c
}(this.ice || window.ice));
(function (c, d) {
	var a = c, b;
	b = function (j, h, o) {
		this.env = j;
		this.element = j.element;
		this.selection = this.env.selection;
		if (!o) {
			this.removeBookmarks(this.element)
		}
		var n = h || this.selection.getRangeAt(0), h = n.cloneRange(), f = h.startContainer, m = h.startOffset, g;
		h.collapse(false);
		var k = this.env.document.createElement("span");
		k.style.display = "none";
		d(k).html("&nbsp;").addClass("iceBookmark iceBookmark_end").attr("iceBookmark", "end");
		h.insertNode(k);
		if (!c.dom.isChildOf(k, this.element)) {
			this.element.appendChild(k)
		}
		h.setStart(f, m);
		h.collapse(true);
		var i = this.env.document.createElement("span");
		i.style.display = "none";
		d(i).addClass("iceBookmark iceBookmark_start").html("&nbsp;").attr("iceBookmark", "start");
		try {
			h.insertNode(i);
			if (i.previousSibling === k) {
				g = i;
				i = k;
				k = g
			}
		} catch (l) {
			c.dom.insertBefore(k, i)
		}
		if (c.dom.isChildOf(i, this.element) === false) {
			if (this.element.firstChild) {
				c.dom.insertBefore(this.element.firstChild, i)
			} else {
				this.element.appendChild(i)
			}
		}
		if (!k.previousSibling) {
			g = this.env.document.createTextNode("");
			c.dom.insertBefore(k, g)
		}
		if (!i.nextSibling) {
			g = this.env.document.createTextNode("");
			c.dom.insertAfter(i, g)
		}
		n.setStart(i.nextSibling, 0);
		n.setEnd(k.previousSibling, (k.previousSibling.length || 0));
		this.start = i;
		this.end = k
	};
	b.prototype = {
		selectStartAndCollapse: function () {
			if (this.start) {
				var f = this.selection.getRangeAt(0);
				f.setStartBefore(this.start);
				f.collapse(true);
				d([this.start, this.end]).remove();
				try {
					this.selection.addRange(f)
				} catch (g) {
				}
			}
		}, remove: function () {
			if (this.start) {
				d([this.start, this.end]).remove();
				this.start = this.end = null
			}
		}, selectBookmark: function () {
			var g = this.selection.getRangeAt(0), j = null, i = null, f = 0, h = null, l = this.start && this.start.parentNode;
			if (this.start.nextSibling === this.end || c.dom.getElementsBetween(this.start, this.end).length === 0) {
				if (this.end.nextSibling) {
					j = c.dom.getFirstChild(this.end.nextSibling)
				} else {
					if (this.start.previousSibling) {
						j = c.dom.getFirstChild(this.start.previousSibling);
						if (j.nodeType === c.dom.TEXT_NODE) {
							f = j.length
						}
					} else {
						this.end.parentNode.appendChild(this.env.document.createTextNode(""));
						j = c.dom.getFirstChild(this.end.nextSibling)
					}
				}
			} else {
				if (this.start.nextSibling) {
					j = c.dom.getFirstChild(this.start.nextSibling)
				} else {
					if (!this.start.previousSibling) {
						var k = this.env.document.createTextNode("");
						c.dom.insertBefore(this.start, k)
					}
					j = c.dom.getLastChild(this.start.previousSibling);
					f = j.length
				}
				if (this.end.previousSibling) {
					i = c.dom.getLastChild(this.end.previousSibling)
				} else {
					i = c.dom.getFirstChild(this.end.nextSibling || this.end);
					h = 0
				}
			}
			d([this.start, this.end]).remove();
			try {
				c.dom.normalize(l)
			} catch (m) {
			}
			if (i === null) {
				if (g) {
					g.setEnd(j, f);
					g.collapse(false)
				}
			} else {
				g.setStart(j, f);
				if (h === null) {
					h = (i.length || 0)
				}
				g.setEnd(i, h)
			}
			try {
				this.selection.addRange(g)
			} catch (m) {
			}
		}, getBookmark: function (f, e) {
			var g = c.dom.getClass("iceBookmark_" + e, f)[0];
			return g
		}, removeBookmarks: function (e) {
			d(e).find("span.iceBookmark").remove()
		}
	};
	a.Bookmark = b
}(this.ice || window.ice, window.jQuery));
var LITE = {
	Events: {
		INIT: "lite:init",
		ACCEPT: "lite:accept",
		REJECT: "lite:reject",
		SHOW_HIDE: "lite:showHide",
		TRACKING: "lite:tracking",
		CHANGE: "lite:change",
		HOVER_IN: "lite:hover-in",
		HOVER_OUT: "lite:hover-out"
	},
	Commands: {
		TOGGLE_TRACKING: "lite-toggletracking",
		TOGGLE_SHOW: "lite-toggleshow",
		ACCEPT_ALL: "lite-acceptall",
		REJECT_ALL: "lite-rejectall",
		ACCEPT_ONE: "lite-acceptone",
		REJECT_ONE: "lite-rejectone",
		TOGGLE_TOOLTIPS: "lite-toggletooltips"
	}
};
/* Copyright (C) 2015 LoopIndex - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the LoopIndex Comments CKEditor plugin license.
 *
 * You should have received a copy of the LoopIndex Comments CKEditor plugin license with
 * this file. If not, please write to: loopindex@gmail.com, or visit http://www.loopindex.com
 * written by (David *)Frenkiel (https://github.com/imdfl)
 */
