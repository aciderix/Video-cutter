function zy(i, s) {
  for (var o = 0; o < s.length; o++) {
    const f = s[o];
    if (typeof f != 'string' && !Array.isArray(f)) {
      for (const m in f)
        if (m !== 'default' && !(m in i)) {
          const d = Object.getOwnPropertyDescriptor(f, m);
          d && Object.defineProperty(i, m, d.get ? d : { enumerable: !0, get: () => f[m] });
        }
    }
  }
  return Object.freeze(Object.defineProperty(i, Symbol.toStringTag, { value: 'Module' }));
}
(function () {
  const s = document.createElement('link').relList;
  if (s && s.supports && s.supports('modulepreload')) return;
  for (const m of document.querySelectorAll('link[rel="modulepreload"]')) f(m);
  new MutationObserver((m) => {
    for (const d of m)
      if (d.type === 'childList')
        for (const y of d.addedNodes) y.tagName === 'LINK' && y.rel === 'modulepreload' && f(y);
  }).observe(document, { childList: !0, subtree: !0 });
  function o(m) {
    const d = {};
    return (
      m.integrity && (d.integrity = m.integrity),
      m.referrerPolicy && (d.referrerPolicy = m.referrerPolicy),
      m.crossOrigin === 'use-credentials'
        ? (d.credentials = 'include')
        : m.crossOrigin === 'anonymous'
          ? (d.credentials = 'omit')
          : (d.credentials = 'same-origin'),
      d
    );
  }
  function f(m) {
    if (m.ep) return;
    m.ep = !0;
    const d = o(m);
    fetch(m.href, d);
  }
})();
function Ey(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, 'default') ? i.default : i;
}
var Of = { exports: {} },
  Ha = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Fd;
function Ay() {
  if (Fd) return Ha;
  Fd = 1;
  var i = Symbol.for('react.transitional.element'),
    s = Symbol.for('react.fragment');
  function o(f, m, d) {
    var y = null;
    if ((d !== void 0 && (y = '' + d), m.key !== void 0 && (y = '' + m.key), 'key' in m)) {
      d = {};
      for (var p in m) p !== 'key' && (d[p] = m[p]);
    } else d = m;
    return ((m = d.ref), { $$typeof: i, type: f, key: y, ref: m !== void 0 ? m : null, props: d });
  }
  return ((Ha.Fragment = s), (Ha.jsx = o), (Ha.jsxs = o), Ha);
}
var Id;
function Ty() {
  return (Id || ((Id = 1), (Of.exports = Ay())), Of.exports);
}
var M = Ty(),
  Rf = { exports: {} },
  nt = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Pd;
function _y() {
  if (Pd) return nt;
  Pd = 1;
  var i = Symbol.for('react.transitional.element'),
    s = Symbol.for('react.portal'),
    o = Symbol.for('react.fragment'),
    f = Symbol.for('react.strict_mode'),
    m = Symbol.for('react.profiler'),
    d = Symbol.for('react.consumer'),
    y = Symbol.for('react.context'),
    p = Symbol.for('react.forward_ref'),
    S = Symbol.for('react.suspense'),
    g = Symbol.for('react.memo'),
    x = Symbol.for('react.lazy'),
    E = Symbol.for('react.activity'),
    H = Symbol.iterator;
  function Z(v) {
    return v === null || typeof v != 'object'
      ? null
      : ((v = (H && v[H]) || v['@@iterator']), typeof v == 'function' ? v : null);
  }
  var $ = {
      isMounted: function () {
        return !1;
      },
      enqueueForceUpdate: function () {},
      enqueueReplaceState: function () {},
      enqueueSetState: function () {},
    },
    L = Object.assign,
    q = {};
  function Y(v, j, Q) {
    ((this.props = v), (this.context = j), (this.refs = q), (this.updater = Q || $));
  }
  ((Y.prototype.isReactComponent = {}),
    (Y.prototype.setState = function (v, j) {
      if (typeof v != 'object' && typeof v != 'function' && v != null)
        throw Error(
          'takes an object of state variables to update or a function which returns an object of state variables.',
        );
      this.updater.enqueueSetState(this, v, j, 'setState');
    }),
    (Y.prototype.forceUpdate = function (v) {
      this.updater.enqueueForceUpdate(this, v, 'forceUpdate');
    }));
  function V() {}
  V.prototype = Y.prototype;
  function G(v, j, Q) {
    ((this.props = v), (this.context = j), (this.refs = q), (this.updater = Q || $));
  }
  var X = (G.prototype = new V());
  ((X.constructor = G), L(X, Y.prototype), (X.isPureReactComponent = !0));
  var at = Array.isArray;
  function F() {}
  var J = { H: null, A: null, T: null, S: null },
    zt = Object.prototype.hasOwnProperty;
  function Mt(v, j, Q) {
    var k = Q.ref;
    return { $$typeof: i, type: v, key: j, ref: k !== void 0 ? k : null, props: Q };
  }
  function Ot(v, j) {
    return Mt(v.type, j, v.props);
  }
  function yt(v) {
    return typeof v == 'object' && v !== null && v.$$typeof === i;
  }
  function tt(v) {
    var j = { '=': '=0', ':': '=2' };
    return (
      '$' +
      v.replace(/[=:]/g, function (Q) {
        return j[Q];
      })
    );
  }
  var Qt = /\/+/g;
  function Vt(v, j) {
    return typeof v == 'object' && v !== null && v.key != null ? tt('' + v.key) : j.toString(36);
  }
  function Yt(v) {
    switch (v.status) {
      case 'fulfilled':
        return v.value;
      case 'rejected':
        throw v.reason;
      default:
        switch (
          (typeof v.status == 'string'
            ? v.then(F, F)
            : ((v.status = 'pending'),
              v.then(
                function (j) {
                  v.status === 'pending' && ((v.status = 'fulfilled'), (v.value = j));
                },
                function (j) {
                  v.status === 'pending' && ((v.status = 'rejected'), (v.reason = j));
                },
              )),
          v.status)
        ) {
          case 'fulfilled':
            return v.value;
          case 'rejected':
            throw v.reason;
        }
    }
    throw v;
  }
  function N(v, j, Q, k, ut) {
    var ot = typeof v;
    (ot === 'undefined' || ot === 'boolean') && (v = null);
    var bt = !1;
    if (v === null) bt = !0;
    else
      switch (ot) {
        case 'bigint':
        case 'string':
        case 'number':
          bt = !0;
          break;
        case 'object':
          switch (v.$$typeof) {
            case i:
            case s:
              bt = !0;
              break;
            case x:
              return ((bt = v._init), N(bt(v._payload), j, Q, k, ut));
          }
      }
    if (bt)
      return (
        (ut = ut(v)),
        (bt = k === '' ? '.' + Vt(v, 0) : k),
        at(ut)
          ? ((Q = ''),
            bt != null && (Q = bt.replace(Qt, '$&/') + '/'),
            N(ut, j, Q, '', function (Xn) {
              return Xn;
            }))
          : ut != null &&
            (yt(ut) &&
              (ut = Ot(
                ut,
                Q +
                  (ut.key == null || (v && v.key === ut.key)
                    ? ''
                    : ('' + ut.key).replace(Qt, '$&/') + '/') +
                  bt,
              )),
            j.push(ut)),
        1
      );
    bt = 0;
    var te = k === '' ? '.' : k + ':';
    if (at(v))
      for (var Ht = 0; Ht < v.length; Ht++)
        ((k = v[Ht]), (ot = te + Vt(k, Ht)), (bt += N(k, j, Q, ot, ut)));
    else if (((Ht = Z(v)), typeof Ht == 'function'))
      for (v = Ht.call(v), Ht = 0; !(k = v.next()).done; )
        ((k = k.value), (ot = te + Vt(k, Ht++)), (bt += N(k, j, Q, ot, ut)));
    else if (ot === 'object') {
      if (typeof v.then == 'function') return N(Yt(v), j, Q, k, ut);
      throw (
        (j = String(v)),
        Error(
          'Objects are not valid as a React child (found: ' +
            (j === '[object Object]' ? 'object with keys {' + Object.keys(v).join(', ') + '}' : j) +
            '). If you meant to render a collection of children, use an array instead.',
        )
      );
    }
    return bt;
  }
  function w(v, j, Q) {
    if (v == null) return v;
    var k = [],
      ut = 0;
    return (
      N(v, k, '', '', function (ot) {
        return j.call(Q, ot, ut++);
      }),
      k
    );
  }
  function R(v) {
    if (v._status === -1) {
      var j = v._result;
      ((j = j()),
        j.then(
          function (Q) {
            (v._status === 0 || v._status === -1) && ((v._status = 1), (v._result = Q));
          },
          function (Q) {
            (v._status === 0 || v._status === -1) && ((v._status = 2), (v._result = Q));
          },
        ),
        v._status === -1 && ((v._status = 0), (v._result = j)));
    }
    if (v._status === 1) return v._result.default;
    throw v._result;
  }
  var et =
      typeof reportError == 'function'
        ? reportError
        : function (v) {
            if (typeof window == 'object' && typeof window.ErrorEvent == 'function') {
              var j = new window.ErrorEvent('error', {
                bubbles: !0,
                cancelable: !0,
                message:
                  typeof v == 'object' && v !== null && typeof v.message == 'string'
                    ? String(v.message)
                    : String(v),
                error: v,
              });
              if (!window.dispatchEvent(j)) return;
            } else if (typeof process == 'object' && typeof process.emit == 'function') {
              process.emit('uncaughtException', v);
              return;
            }
            console.error(v);
          },
    I = {
      map: w,
      forEach: function (v, j, Q) {
        w(
          v,
          function () {
            j.apply(this, arguments);
          },
          Q,
        );
      },
      count: function (v) {
        var j = 0;
        return (
          w(v, function () {
            j++;
          }),
          j
        );
      },
      toArray: function (v) {
        return (
          w(v, function (j) {
            return j;
          }) || []
        );
      },
      only: function (v) {
        if (!yt(v))
          throw Error('React.Children.only expected to receive a single React element child.');
        return v;
      },
    };
  return (
    (nt.Activity = E),
    (nt.Children = I),
    (nt.Component = Y),
    (nt.Fragment = o),
    (nt.Profiler = m),
    (nt.PureComponent = G),
    (nt.StrictMode = f),
    (nt.Suspense = S),
    (nt.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = J),
    (nt.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function (v) {
        return J.H.useMemoCache(v);
      },
    }),
    (nt.cache = function (v) {
      return function () {
        return v.apply(null, arguments);
      };
    }),
    (nt.cacheSignal = function () {
      return null;
    }),
    (nt.cloneElement = function (v, j, Q) {
      if (v == null) throw Error('The argument must be a React element, but you passed ' + v + '.');
      var k = L({}, v.props),
        ut = v.key;
      if (j != null)
        for (ot in (j.key !== void 0 && (ut = '' + j.key), j))
          !zt.call(j, ot) ||
            ot === 'key' ||
            ot === '__self' ||
            ot === '__source' ||
            (ot === 'ref' && j.ref === void 0) ||
            (k[ot] = j[ot]);
      var ot = arguments.length - 2;
      if (ot === 1) k.children = Q;
      else if (1 < ot) {
        for (var bt = Array(ot), te = 0; te < ot; te++) bt[te] = arguments[te + 2];
        k.children = bt;
      }
      return Mt(v.type, ut, k);
    }),
    (nt.createContext = function (v) {
      return (
        (v = {
          $$typeof: y,
          _currentValue: v,
          _currentValue2: v,
          _threadCount: 0,
          Provider: null,
          Consumer: null,
        }),
        (v.Provider = v),
        (v.Consumer = { $$typeof: d, _context: v }),
        v
      );
    }),
    (nt.createElement = function (v, j, Q) {
      var k,
        ut = {},
        ot = null;
      if (j != null)
        for (k in (j.key !== void 0 && (ot = '' + j.key), j))
          zt.call(j, k) && k !== 'key' && k !== '__self' && k !== '__source' && (ut[k] = j[k]);
      var bt = arguments.length - 2;
      if (bt === 1) ut.children = Q;
      else if (1 < bt) {
        for (var te = Array(bt), Ht = 0; Ht < bt; Ht++) te[Ht] = arguments[Ht + 2];
        ut.children = te;
      }
      if (v && v.defaultProps)
        for (k in ((bt = v.defaultProps), bt)) ut[k] === void 0 && (ut[k] = bt[k]);
      return Mt(v, ot, ut);
    }),
    (nt.createRef = function () {
      return { current: null };
    }),
    (nt.forwardRef = function (v) {
      return { $$typeof: p, render: v };
    }),
    (nt.isValidElement = yt),
    (nt.lazy = function (v) {
      return { $$typeof: x, _payload: { _status: -1, _result: v }, _init: R };
    }),
    (nt.memo = function (v, j) {
      return { $$typeof: g, type: v, compare: j === void 0 ? null : j };
    }),
    (nt.startTransition = function (v) {
      var j = J.T,
        Q = {};
      J.T = Q;
      try {
        var k = v(),
          ut = J.S;
        (ut !== null && ut(Q, k),
          typeof k == 'object' && k !== null && typeof k.then == 'function' && k.then(F, et));
      } catch (ot) {
        et(ot);
      } finally {
        (j !== null && Q.types !== null && (j.types = Q.types), (J.T = j));
      }
    }),
    (nt.unstable_useCacheRefresh = function () {
      return J.H.useCacheRefresh();
    }),
    (nt.use = function (v) {
      return J.H.use(v);
    }),
    (nt.useActionState = function (v, j, Q) {
      return J.H.useActionState(v, j, Q);
    }),
    (nt.useCallback = function (v, j) {
      return J.H.useCallback(v, j);
    }),
    (nt.useContext = function (v) {
      return J.H.useContext(v);
    }),
    (nt.useDebugValue = function () {}),
    (nt.useDeferredValue = function (v, j) {
      return J.H.useDeferredValue(v, j);
    }),
    (nt.useEffect = function (v, j) {
      return J.H.useEffect(v, j);
    }),
    (nt.useEffectEvent = function (v) {
      return J.H.useEffectEvent(v);
    }),
    (nt.useId = function () {
      return J.H.useId();
    }),
    (nt.useImperativeHandle = function (v, j, Q) {
      return J.H.useImperativeHandle(v, j, Q);
    }),
    (nt.useInsertionEffect = function (v, j) {
      return J.H.useInsertionEffect(v, j);
    }),
    (nt.useLayoutEffect = function (v, j) {
      return J.H.useLayoutEffect(v, j);
    }),
    (nt.useMemo = function (v, j) {
      return J.H.useMemo(v, j);
    }),
    (nt.useOptimistic = function (v, j) {
      return J.H.useOptimistic(v, j);
    }),
    (nt.useReducer = function (v, j, Q) {
      return J.H.useReducer(v, j, Q);
    }),
    (nt.useRef = function (v) {
      return J.H.useRef(v);
    }),
    (nt.useState = function (v) {
      return J.H.useState(v);
    }),
    (nt.useSyncExternalStore = function (v, j, Q) {
      return J.H.useSyncExternalStore(v, j, Q);
    }),
    (nt.useTransition = function () {
      return J.H.useTransition();
    }),
    (nt.version = '19.2.6'),
    nt
  );
}
var tm;
function Kf() {
  return (tm || ((tm = 1), (Rf.exports = _y())), Rf.exports);
}
var B = Kf();
const Re = Ey(B),
  My = zy({ __proto__: null, default: Re }, [B]);
var Nf = { exports: {} },
  Ba = {},
  Cf = { exports: {} },
  Df = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var em;
function Oy() {
  return (
    em ||
      ((em = 1),
      (function (i) {
        function s(N, w) {
          var R = N.length;
          N.push(w);
          t: for (; 0 < R; ) {
            var et = (R - 1) >>> 1,
              I = N[et];
            if (0 < m(I, w)) ((N[et] = w), (N[R] = I), (R = et));
            else break t;
          }
        }
        function o(N) {
          return N.length === 0 ? null : N[0];
        }
        function f(N) {
          if (N.length === 0) return null;
          var w = N[0],
            R = N.pop();
          if (R !== w) {
            N[0] = R;
            t: for (var et = 0, I = N.length, v = I >>> 1; et < v; ) {
              var j = 2 * (et + 1) - 1,
                Q = N[j],
                k = j + 1,
                ut = N[k];
              if (0 > m(Q, R))
                k < I && 0 > m(ut, Q)
                  ? ((N[et] = ut), (N[k] = R), (et = k))
                  : ((N[et] = Q), (N[j] = R), (et = j));
              else if (k < I && 0 > m(ut, R)) ((N[et] = ut), (N[k] = R), (et = k));
              else break t;
            }
          }
          return w;
        }
        function m(N, w) {
          var R = N.sortIndex - w.sortIndex;
          return R !== 0 ? R : N.id - w.id;
        }
        if (
          ((i.unstable_now = void 0),
          typeof performance == 'object' && typeof performance.now == 'function')
        ) {
          var d = performance;
          i.unstable_now = function () {
            return d.now();
          };
        } else {
          var y = Date,
            p = y.now();
          i.unstable_now = function () {
            return y.now() - p;
          };
        }
        var S = [],
          g = [],
          x = 1,
          E = null,
          H = 3,
          Z = !1,
          $ = !1,
          L = !1,
          q = !1,
          Y = typeof setTimeout == 'function' ? setTimeout : null,
          V = typeof clearTimeout == 'function' ? clearTimeout : null,
          G = typeof setImmediate < 'u' ? setImmediate : null;
        function X(N) {
          for (var w = o(g); w !== null; ) {
            if (w.callback === null) f(g);
            else if (w.startTime <= N) (f(g), (w.sortIndex = w.expirationTime), s(S, w));
            else break;
            w = o(g);
          }
        }
        function at(N) {
          if (((L = !1), X(N), !$))
            if (o(S) !== null) (($ = !0), F || ((F = !0), tt()));
            else {
              var w = o(g);
              w !== null && Yt(at, w.startTime - N);
            }
        }
        var F = !1,
          J = -1,
          zt = 5,
          Mt = -1;
        function Ot() {
          return q ? !0 : !(i.unstable_now() - Mt < zt);
        }
        function yt() {
          if (((q = !1), F)) {
            var N = i.unstable_now();
            Mt = N;
            var w = !0;
            try {
              t: {
                (($ = !1), L && ((L = !1), V(J), (J = -1)), (Z = !0));
                var R = H;
                try {
                  e: {
                    for (X(N), E = o(S); E !== null && !(E.expirationTime > N && Ot()); ) {
                      var et = E.callback;
                      if (typeof et == 'function') {
                        ((E.callback = null), (H = E.priorityLevel));
                        var I = et(E.expirationTime <= N);
                        if (((N = i.unstable_now()), typeof I == 'function')) {
                          ((E.callback = I), X(N), (w = !0));
                          break e;
                        }
                        (E === o(S) && f(S), X(N));
                      } else f(S);
                      E = o(S);
                    }
                    if (E !== null) w = !0;
                    else {
                      var v = o(g);
                      (v !== null && Yt(at, v.startTime - N), (w = !1));
                    }
                  }
                  break t;
                } finally {
                  ((E = null), (H = R), (Z = !1));
                }
                w = void 0;
              }
            } finally {
              w ? tt() : (F = !1);
            }
          }
        }
        var tt;
        if (typeof G == 'function')
          tt = function () {
            G(yt);
          };
        else if (typeof MessageChannel < 'u') {
          var Qt = new MessageChannel(),
            Vt = Qt.port2;
          ((Qt.port1.onmessage = yt),
            (tt = function () {
              Vt.postMessage(null);
            }));
        } else
          tt = function () {
            Y(yt, 0);
          };
        function Yt(N, w) {
          J = Y(function () {
            N(i.unstable_now());
          }, w);
        }
        ((i.unstable_IdlePriority = 5),
          (i.unstable_ImmediatePriority = 1),
          (i.unstable_LowPriority = 4),
          (i.unstable_NormalPriority = 3),
          (i.unstable_Profiling = null),
          (i.unstable_UserBlockingPriority = 2),
          (i.unstable_cancelCallback = function (N) {
            N.callback = null;
          }),
          (i.unstable_forceFrameRate = function (N) {
            0 > N || 125 < N
              ? console.error(
                  'forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported',
                )
              : (zt = 0 < N ? Math.floor(1e3 / N) : 5);
          }),
          (i.unstable_getCurrentPriorityLevel = function () {
            return H;
          }),
          (i.unstable_next = function (N) {
            switch (H) {
              case 1:
              case 2:
              case 3:
                var w = 3;
                break;
              default:
                w = H;
            }
            var R = H;
            H = w;
            try {
              return N();
            } finally {
              H = R;
            }
          }),
          (i.unstable_requestPaint = function () {
            q = !0;
          }),
          (i.unstable_runWithPriority = function (N, w) {
            switch (N) {
              case 1:
              case 2:
              case 3:
              case 4:
              case 5:
                break;
              default:
                N = 3;
            }
            var R = H;
            H = N;
            try {
              return w();
            } finally {
              H = R;
            }
          }),
          (i.unstable_scheduleCallback = function (N, w, R) {
            var et = i.unstable_now();
            switch (
              (typeof R == 'object' && R !== null
                ? ((R = R.delay), (R = typeof R == 'number' && 0 < R ? et + R : et))
                : (R = et),
              N)
            ) {
              case 1:
                var I = -1;
                break;
              case 2:
                I = 250;
                break;
              case 5:
                I = 1073741823;
                break;
              case 4:
                I = 1e4;
                break;
              default:
                I = 5e3;
            }
            return (
              (I = R + I),
              (N = {
                id: x++,
                callback: w,
                priorityLevel: N,
                startTime: R,
                expirationTime: I,
                sortIndex: -1,
              }),
              R > et
                ? ((N.sortIndex = R),
                  s(g, N),
                  o(S) === null && N === o(g) && (L ? (V(J), (J = -1)) : (L = !0), Yt(at, R - et)))
                : ((N.sortIndex = I), s(S, N), $ || Z || (($ = !0), F || ((F = !0), tt()))),
              N
            );
          }),
          (i.unstable_shouldYield = Ot),
          (i.unstable_wrapCallback = function (N) {
            var w = H;
            return function () {
              var R = H;
              H = w;
              try {
                return N.apply(this, arguments);
              } finally {
                H = R;
              }
            };
          }));
      })(Df)),
    Df
  );
}
var lm;
function Ry() {
  return (lm || ((lm = 1), (Cf.exports = Oy())), Cf.exports);
}
var jf = { exports: {} },
  Pt = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var nm;
function Ny() {
  if (nm) return Pt;
  nm = 1;
  var i = Kf();
  function s(S) {
    var g = 'https://react.dev/errors/' + S;
    if (1 < arguments.length) {
      g += '?args[]=' + encodeURIComponent(arguments[1]);
      for (var x = 2; x < arguments.length; x++) g += '&args[]=' + encodeURIComponent(arguments[x]);
    }
    return (
      'Minified React error #' +
      S +
      '; visit ' +
      g +
      ' for the full message or use the non-minified dev environment for full errors and additional helpful warnings.'
    );
  }
  function o() {}
  var f = {
      d: {
        f: o,
        r: function () {
          throw Error(s(522));
        },
        D: o,
        C: o,
        L: o,
        m: o,
        X: o,
        S: o,
        M: o,
      },
      p: 0,
      findDOMNode: null,
    },
    m = Symbol.for('react.portal');
  function d(S, g, x) {
    var E = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: m,
      key: E == null ? null : '' + E,
      children: S,
      containerInfo: g,
      implementation: x,
    };
  }
  var y = i.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function p(S, g) {
    if (S === 'font') return '';
    if (typeof g == 'string') return g === 'use-credentials' ? g : '';
  }
  return (
    (Pt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = f),
    (Pt.createPortal = function (S, g) {
      var x = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
      if (!g || (g.nodeType !== 1 && g.nodeType !== 9 && g.nodeType !== 11)) throw Error(s(299));
      return d(S, g, null, x);
    }),
    (Pt.flushSync = function (S) {
      var g = y.T,
        x = f.p;
      try {
        if (((y.T = null), (f.p = 2), S)) return S();
      } finally {
        ((y.T = g), (f.p = x), f.d.f());
      }
    }),
    (Pt.preconnect = function (S, g) {
      typeof S == 'string' &&
        (g
          ? ((g = g.crossOrigin),
            (g = typeof g == 'string' ? (g === 'use-credentials' ? g : '') : void 0))
          : (g = null),
        f.d.C(S, g));
    }),
    (Pt.prefetchDNS = function (S) {
      typeof S == 'string' && f.d.D(S);
    }),
    (Pt.preinit = function (S, g) {
      if (typeof S == 'string' && g && typeof g.as == 'string') {
        var x = g.as,
          E = p(x, g.crossOrigin),
          H = typeof g.integrity == 'string' ? g.integrity : void 0,
          Z = typeof g.fetchPriority == 'string' ? g.fetchPriority : void 0;
        x === 'style'
          ? f.d.S(S, typeof g.precedence == 'string' ? g.precedence : void 0, {
              crossOrigin: E,
              integrity: H,
              fetchPriority: Z,
            })
          : x === 'script' &&
            f.d.X(S, {
              crossOrigin: E,
              integrity: H,
              fetchPriority: Z,
              nonce: typeof g.nonce == 'string' ? g.nonce : void 0,
            });
      }
    }),
    (Pt.preinitModule = function (S, g) {
      if (typeof S == 'string')
        if (typeof g == 'object' && g !== null) {
          if (g.as == null || g.as === 'script') {
            var x = p(g.as, g.crossOrigin);
            f.d.M(S, {
              crossOrigin: x,
              integrity: typeof g.integrity == 'string' ? g.integrity : void 0,
              nonce: typeof g.nonce == 'string' ? g.nonce : void 0,
            });
          }
        } else g == null && f.d.M(S);
    }),
    (Pt.preload = function (S, g) {
      if (typeof S == 'string' && typeof g == 'object' && g !== null && typeof g.as == 'string') {
        var x = g.as,
          E = p(x, g.crossOrigin);
        f.d.L(S, x, {
          crossOrigin: E,
          integrity: typeof g.integrity == 'string' ? g.integrity : void 0,
          nonce: typeof g.nonce == 'string' ? g.nonce : void 0,
          type: typeof g.type == 'string' ? g.type : void 0,
          fetchPriority: typeof g.fetchPriority == 'string' ? g.fetchPriority : void 0,
          referrerPolicy: typeof g.referrerPolicy == 'string' ? g.referrerPolicy : void 0,
          imageSrcSet: typeof g.imageSrcSet == 'string' ? g.imageSrcSet : void 0,
          imageSizes: typeof g.imageSizes == 'string' ? g.imageSizes : void 0,
          media: typeof g.media == 'string' ? g.media : void 0,
        });
      }
    }),
    (Pt.preloadModule = function (S, g) {
      if (typeof S == 'string')
        if (g) {
          var x = p(g.as, g.crossOrigin);
          f.d.m(S, {
            as: typeof g.as == 'string' && g.as !== 'script' ? g.as : void 0,
            crossOrigin: x,
            integrity: typeof g.integrity == 'string' ? g.integrity : void 0,
          });
        } else f.d.m(S);
    }),
    (Pt.requestFormReset = function (S) {
      f.d.r(S);
    }),
    (Pt.unstable_batchedUpdates = function (S, g) {
      return S(g);
    }),
    (Pt.useFormState = function (S, g, x) {
      return y.H.useFormState(S, g, x);
    }),
    (Pt.useFormStatus = function () {
      return y.H.useHostTransitionStatus();
    }),
    (Pt.version = '19.2.6'),
    Pt
  );
}
var am;
function Am() {
  if (am) return jf.exports;
  am = 1;
  function i() {
    if (
      !(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > 'u' ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != 'function'
      )
    )
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i);
      } catch (s) {
        console.error(s);
      }
  }
  return (i(), (jf.exports = Ny()), jf.exports);
}
/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var um;
function Cy() {
  if (um) return Ba;
  um = 1;
  var i = Ry(),
    s = Kf(),
    o = Am();
  function f(t) {
    var e = 'https://react.dev/errors/' + t;
    if (1 < arguments.length) {
      e += '?args[]=' + encodeURIComponent(arguments[1]);
      for (var l = 2; l < arguments.length; l++) e += '&args[]=' + encodeURIComponent(arguments[l]);
    }
    return (
      'Minified React error #' +
      t +
      '; visit ' +
      e +
      ' for the full message or use the non-minified dev environment for full errors and additional helpful warnings.'
    );
  }
  function m(t) {
    return !(!t || (t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11));
  }
  function d(t) {
    var e = t,
      l = t;
    if (t.alternate) for (; e.return; ) e = e.return;
    else {
      t = e;
      do ((e = t), (e.flags & 4098) !== 0 && (l = e.return), (t = e.return));
      while (t);
    }
    return e.tag === 3 ? l : null;
  }
  function y(t) {
    if (t.tag === 13) {
      var e = t.memoizedState;
      if ((e === null && ((t = t.alternate), t !== null && (e = t.memoizedState)), e !== null))
        return e.dehydrated;
    }
    return null;
  }
  function p(t) {
    if (t.tag === 31) {
      var e = t.memoizedState;
      if ((e === null && ((t = t.alternate), t !== null && (e = t.memoizedState)), e !== null))
        return e.dehydrated;
    }
    return null;
  }
  function S(t) {
    if (d(t) !== t) throw Error(f(188));
  }
  function g(t) {
    var e = t.alternate;
    if (!e) {
      if (((e = d(t)), e === null)) throw Error(f(188));
      return e !== t ? null : t;
    }
    for (var l = t, n = e; ; ) {
      var a = l.return;
      if (a === null) break;
      var u = a.alternate;
      if (u === null) {
        if (((n = a.return), n !== null)) {
          l = n;
          continue;
        }
        break;
      }
      if (a.child === u.child) {
        for (u = a.child; u; ) {
          if (u === l) return (S(a), t);
          if (u === n) return (S(a), e);
          u = u.sibling;
        }
        throw Error(f(188));
      }
      if (l.return !== n.return) ((l = a), (n = u));
      else {
        for (var c = !1, r = a.child; r; ) {
          if (r === l) {
            ((c = !0), (l = a), (n = u));
            break;
          }
          if (r === n) {
            ((c = !0), (n = a), (l = u));
            break;
          }
          r = r.sibling;
        }
        if (!c) {
          for (r = u.child; r; ) {
            if (r === l) {
              ((c = !0), (l = u), (n = a));
              break;
            }
            if (r === n) {
              ((c = !0), (n = u), (l = a));
              break;
            }
            r = r.sibling;
          }
          if (!c) throw Error(f(189));
        }
      }
      if (l.alternate !== n) throw Error(f(190));
    }
    if (l.tag !== 3) throw Error(f(188));
    return l.stateNode.current === l ? t : e;
  }
  function x(t) {
    var e = t.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return t;
    for (t = t.child; t !== null; ) {
      if (((e = x(t)), e !== null)) return e;
      t = t.sibling;
    }
    return null;
  }
  var E = Object.assign,
    H = Symbol.for('react.element'),
    Z = Symbol.for('react.transitional.element'),
    $ = Symbol.for('react.portal'),
    L = Symbol.for('react.fragment'),
    q = Symbol.for('react.strict_mode'),
    Y = Symbol.for('react.profiler'),
    V = Symbol.for('react.consumer'),
    G = Symbol.for('react.context'),
    X = Symbol.for('react.forward_ref'),
    at = Symbol.for('react.suspense'),
    F = Symbol.for('react.suspense_list'),
    J = Symbol.for('react.memo'),
    zt = Symbol.for('react.lazy'),
    Mt = Symbol.for('react.activity'),
    Ot = Symbol.for('react.memo_cache_sentinel'),
    yt = Symbol.iterator;
  function tt(t) {
    return t === null || typeof t != 'object'
      ? null
      : ((t = (yt && t[yt]) || t['@@iterator']), typeof t == 'function' ? t : null);
  }
  var Qt = Symbol.for('react.client.reference');
  function Vt(t) {
    if (t == null) return null;
    if (typeof t == 'function') return t.$$typeof === Qt ? null : t.displayName || t.name || null;
    if (typeof t == 'string') return t;
    switch (t) {
      case L:
        return 'Fragment';
      case Y:
        return 'Profiler';
      case q:
        return 'StrictMode';
      case at:
        return 'Suspense';
      case F:
        return 'SuspenseList';
      case Mt:
        return 'Activity';
    }
    if (typeof t == 'object')
      switch (t.$$typeof) {
        case $:
          return 'Portal';
        case G:
          return t.displayName || 'Context';
        case V:
          return (t._context.displayName || 'Context') + '.Consumer';
        case X:
          var e = t.render;
          return (
            (t = t.displayName),
            t ||
              ((t = e.displayName || e.name || ''),
              (t = t !== '' ? 'ForwardRef(' + t + ')' : 'ForwardRef')),
            t
          );
        case J:
          return ((e = t.displayName || null), e !== null ? e : Vt(t.type) || 'Memo');
        case zt:
          ((e = t._payload), (t = t._init));
          try {
            return Vt(t(e));
          } catch {}
      }
    return null;
  }
  var Yt = Array.isArray,
    N = s.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    w = o.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    R = { pending: !1, data: null, method: null, action: null },
    et = [],
    I = -1;
  function v(t) {
    return { current: t };
  }
  function j(t) {
    0 > I || ((t.current = et[I]), (et[I] = null), I--);
  }
  function Q(t, e) {
    (I++, (et[I] = t.current), (t.current = e));
  }
  var k = v(null),
    ut = v(null),
    ot = v(null),
    bt = v(null);
  function te(t, e) {
    switch ((Q(ot, e), Q(ut, t), Q(k, null), e.nodeType)) {
      case 9:
      case 11:
        t = (t = e.documentElement) && (t = t.namespaceURI) ? Sd(t) : 0;
        break;
      default:
        if (((t = e.tagName), (e = e.namespaceURI))) ((e = Sd(e)), (t = xd(e, t)));
        else
          switch (t) {
            case 'svg':
              t = 1;
              break;
            case 'math':
              t = 2;
              break;
            default:
              t = 0;
          }
    }
    (j(k), Q(k, t));
  }
  function Ht() {
    (j(k), j(ut), j(ot));
  }
  function Xn(t) {
    t.memoizedState !== null && Q(bt, t);
    var e = k.current,
      l = xd(e, t.type);
    e !== l && (Q(ut, t), Q(k, l));
  }
  function Xa(t) {
    (ut.current === t && (j(k), j(ut)), bt.current === t && (j(bt), (Ca._currentValue = R)));
  }
  var oi, kf;
  function jl(t) {
    if (oi === void 0)
      try {
        throw Error();
      } catch (l) {
        var e = l.stack.trim().match(/\n( *(at )?)/);
        ((oi = (e && e[1]) || ''),
          (kf =
            -1 <
            l.stack.indexOf(`
    at`)
              ? ' (<anonymous>)'
              : -1 < l.stack.indexOf('@')
                ? '@unknown:0:0'
                : ''));
      }
    return (
      `
` +
      oi +
      t +
      kf
    );
  }
  var si = !1;
  function ri(t, e) {
    if (!t || si) return '';
    si = !0;
    var l = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var n = {
        DetermineComponentFrameRoot: function () {
          try {
            if (e) {
              var U = function () {
                throw Error();
              };
              if (
                (Object.defineProperty(U.prototype, 'props', {
                  set: function () {
                    throw Error();
                  },
                }),
                typeof Reflect == 'object' && Reflect.construct)
              ) {
                try {
                  Reflect.construct(U, []);
                } catch (O) {
                  var _ = O;
                }
                Reflect.construct(t, [], U);
              } else {
                try {
                  U.call();
                } catch (O) {
                  _ = O;
                }
                t.call(U.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (O) {
                _ = O;
              }
              (U = t()) && typeof U.catch == 'function' && U.catch(function () {});
            }
          } catch (O) {
            if (O && _ && typeof O.stack == 'string') return [O.stack, _.stack];
          }
          return [null, null];
        },
      };
      n.DetermineComponentFrameRoot.displayName = 'DetermineComponentFrameRoot';
      var a = Object.getOwnPropertyDescriptor(n.DetermineComponentFrameRoot, 'name');
      a &&
        a.configurable &&
        Object.defineProperty(n.DetermineComponentFrameRoot, 'name', {
          value: 'DetermineComponentFrameRoot',
        });
      var u = n.DetermineComponentFrameRoot(),
        c = u[0],
        r = u[1];
      if (c && r) {
        var h = c.split(`
`),
          T = r.split(`
`);
        for (a = n = 0; n < h.length && !h[n].includes('DetermineComponentFrameRoot'); ) n++;
        for (; a < T.length && !T[a].includes('DetermineComponentFrameRoot'); ) a++;
        if (n === h.length || a === T.length)
          for (n = h.length - 1, a = T.length - 1; 1 <= n && 0 <= a && h[n] !== T[a]; ) a--;
        for (; 1 <= n && 0 <= a; n--, a--)
          if (h[n] !== T[a]) {
            if (n !== 1 || a !== 1)
              do
                if ((n--, a--, 0 > a || h[n] !== T[a])) {
                  var C =
                    `
` + h[n].replace(' at new ', ' at ');
                  return (
                    t.displayName &&
                      C.includes('<anonymous>') &&
                      (C = C.replace('<anonymous>', t.displayName)),
                    C
                  );
                }
              while (1 <= n && 0 <= a);
            break;
          }
      }
    } finally {
      ((si = !1), (Error.prepareStackTrace = l));
    }
    return (l = t ? t.displayName || t.name : '') ? jl(l) : '';
  }
  function Pm(t, e) {
    switch (t.tag) {
      case 26:
      case 27:
      case 5:
        return jl(t.type);
      case 16:
        return jl('Lazy');
      case 13:
        return t.child !== e && e !== null ? jl('Suspense Fallback') : jl('Suspense');
      case 19:
        return jl('SuspenseList');
      case 0:
      case 15:
        return ri(t.type, !1);
      case 11:
        return ri(t.type.render, !1);
      case 1:
        return ri(t.type, !0);
      case 31:
        return jl('Activity');
      default:
        return '';
    }
  }
  function Wf(t) {
    try {
      var e = '',
        l = null;
      do ((e += Pm(t, l)), (l = t), (t = t.return));
      while (t);
      return e;
    } catch (n) {
      return (
        `
Error generating stack: ` +
        n.message +
        `
` +
        n.stack
      );
    }
  }
  var di = Object.prototype.hasOwnProperty,
    mi = i.unstable_scheduleCallback,
    hi = i.unstable_cancelCallback,
    th = i.unstable_shouldYield,
    eh = i.unstable_requestPaint,
    oe = i.unstable_now,
    lh = i.unstable_getCurrentPriorityLevel,
    Ff = i.unstable_ImmediatePriority,
    If = i.unstable_UserBlockingPriority,
    Qa = i.unstable_NormalPriority,
    nh = i.unstable_LowPriority,
    Pf = i.unstable_IdlePriority,
    ah = i.log,
    uh = i.unstable_setDisableYieldValue,
    Qn = null,
    se = null;
  function ul(t) {
    if ((typeof ah == 'function' && uh(t), se && typeof se.setStrictMode == 'function'))
      try {
        se.setStrictMode(Qn, t);
      } catch {}
  }
  var re = Math.clz32 ? Math.clz32 : fh,
    ih = Math.log,
    ch = Math.LN2;
  function fh(t) {
    return ((t >>>= 0), t === 0 ? 32 : (31 - ((ih(t) / ch) | 0)) | 0);
  }
  var Va = 256,
    Za = 262144,
    Ka = 4194304;
  function Ul(t) {
    var e = t & 42;
    if (e !== 0) return e;
    switch (t & -t) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
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
        return t & 261888;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return t & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return t;
    }
  }
  function Ja(t, e, l) {
    var n = t.pendingLanes;
    if (n === 0) return 0;
    var a = 0,
      u = t.suspendedLanes,
      c = t.pingedLanes;
    t = t.warmLanes;
    var r = n & 134217727;
    return (
      r !== 0
        ? ((n = r & ~u),
          n !== 0
            ? (a = Ul(n))
            : ((c &= r), c !== 0 ? (a = Ul(c)) : l || ((l = r & ~t), l !== 0 && (a = Ul(l)))))
        : ((r = n & ~u),
          r !== 0
            ? (a = Ul(r))
            : c !== 0
              ? (a = Ul(c))
              : l || ((l = n & ~t), l !== 0 && (a = Ul(l)))),
      a === 0
        ? 0
        : e !== 0 &&
            e !== a &&
            (e & u) === 0 &&
            ((u = a & -a), (l = e & -e), u >= l || (u === 32 && (l & 4194048) !== 0))
          ? e
          : a
    );
  }
  function Vn(t, e) {
    return (t.pendingLanes & ~(t.suspendedLanes & ~t.pingedLanes) & e) === 0;
  }
  function oh(t, e) {
    switch (t) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return e + 250;
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
      case 2097152:
        return e + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function to() {
    var t = Ka;
    return ((Ka <<= 1), (Ka & 62914560) === 0 && (Ka = 4194304), t);
  }
  function yi(t) {
    for (var e = [], l = 0; 31 > l; l++) e.push(t);
    return e;
  }
  function Zn(t, e) {
    ((t.pendingLanes |= e),
      e !== 268435456 && ((t.suspendedLanes = 0), (t.pingedLanes = 0), (t.warmLanes = 0)));
  }
  function sh(t, e, l, n, a, u) {
    var c = t.pendingLanes;
    ((t.pendingLanes = l),
      (t.suspendedLanes = 0),
      (t.pingedLanes = 0),
      (t.warmLanes = 0),
      (t.expiredLanes &= l),
      (t.entangledLanes &= l),
      (t.errorRecoveryDisabledLanes &= l),
      (t.shellSuspendCounter = 0));
    var r = t.entanglements,
      h = t.expirationTimes,
      T = t.hiddenUpdates;
    for (l = c & ~l; 0 < l; ) {
      var C = 31 - re(l),
        U = 1 << C;
      ((r[C] = 0), (h[C] = -1));
      var _ = T[C];
      if (_ !== null)
        for (T[C] = null, C = 0; C < _.length; C++) {
          var O = _[C];
          O !== null && (O.lane &= -536870913);
        }
      l &= ~U;
    }
    (n !== 0 && eo(t, n, 0),
      u !== 0 && a === 0 && t.tag !== 0 && (t.suspendedLanes |= u & ~(c & ~e)));
  }
  function eo(t, e, l) {
    ((t.pendingLanes |= e), (t.suspendedLanes &= ~e));
    var n = 31 - re(e);
    ((t.entangledLanes |= e),
      (t.entanglements[n] = t.entanglements[n] | 1073741824 | (l & 261930)));
  }
  function lo(t, e) {
    var l = (t.entangledLanes |= e);
    for (t = t.entanglements; l; ) {
      var n = 31 - re(l),
        a = 1 << n;
      ((a & e) | (t[n] & e) && (t[n] |= e), (l &= ~a));
    }
  }
  function no(t, e) {
    var l = e & -e;
    return ((l = (l & 42) !== 0 ? 1 : vi(l)), (l & (t.suspendedLanes | e)) !== 0 ? 0 : l);
  }
  function vi(t) {
    switch (t) {
      case 2:
        t = 1;
        break;
      case 8:
        t = 4;
        break;
      case 32:
        t = 16;
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
        t = 128;
        break;
      case 268435456:
        t = 134217728;
        break;
      default:
        t = 0;
    }
    return t;
  }
  function gi(t) {
    return ((t &= -t), 2 < t ? (8 < t ? ((t & 134217727) !== 0 ? 32 : 268435456) : 8) : 2);
  }
  function ao() {
    var t = w.p;
    return t !== 0 ? t : ((t = window.event), t === void 0 ? 32 : Vd(t.type));
  }
  function uo(t, e) {
    var l = w.p;
    try {
      return ((w.p = t), e());
    } finally {
      w.p = l;
    }
  }
  var il = Math.random().toString(36).slice(2),
    $t = '__reactFiber$' + il,
    le = '__reactProps$' + il,
    Pl = '__reactContainer$' + il,
    pi = '__reactEvents$' + il,
    rh = '__reactListeners$' + il,
    dh = '__reactHandles$' + il,
    io = '__reactResources$' + il,
    Kn = '__reactMarker$' + il;
  function bi(t) {
    (delete t[$t], delete t[le], delete t[pi], delete t[rh], delete t[dh]);
  }
  function tn(t) {
    var e = t[$t];
    if (e) return e;
    for (var l = t.parentNode; l; ) {
      if ((e = l[Pl] || l[$t])) {
        if (((l = e.alternate), e.child !== null || (l !== null && l.child !== null)))
          for (t = Od(t); t !== null; ) {
            if ((l = t[$t])) return l;
            t = Od(t);
          }
        return e;
      }
      ((t = l), (l = t.parentNode));
    }
    return null;
  }
  function en(t) {
    if ((t = t[$t] || t[Pl])) {
      var e = t.tag;
      if (e === 5 || e === 6 || e === 13 || e === 31 || e === 26 || e === 27 || e === 3) return t;
    }
    return null;
  }
  function Jn(t) {
    var e = t.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return t.stateNode;
    throw Error(f(33));
  }
  function ln(t) {
    var e = t[io];
    return (e || (e = t[io] = { hoistableStyles: new Map(), hoistableScripts: new Map() }), e);
  }
  function Kt(t) {
    t[Kn] = !0;
  }
  var co = new Set(),
    fo = {};
  function Hl(t, e) {
    (nn(t, e), nn(t + 'Capture', e));
  }
  function nn(t, e) {
    for (fo[t] = e, t = 0; t < e.length; t++) co.add(e[t]);
  }
  var mh = RegExp(
      '^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$',
    ),
    oo = {},
    so = {};
  function hh(t) {
    return di.call(so, t)
      ? !0
      : di.call(oo, t)
        ? !1
        : mh.test(t)
          ? (so[t] = !0)
          : ((oo[t] = !0), !1);
  }
  function $a(t, e, l) {
    if (hh(e))
      if (l === null) t.removeAttribute(e);
      else {
        switch (typeof l) {
          case 'undefined':
          case 'function':
          case 'symbol':
            t.removeAttribute(e);
            return;
          case 'boolean':
            var n = e.toLowerCase().slice(0, 5);
            if (n !== 'data-' && n !== 'aria-') {
              t.removeAttribute(e);
              return;
            }
        }
        t.setAttribute(e, '' + l);
      }
  }
  function ka(t, e, l) {
    if (l === null) t.removeAttribute(e);
    else {
      switch (typeof l) {
        case 'undefined':
        case 'function':
        case 'symbol':
        case 'boolean':
          t.removeAttribute(e);
          return;
      }
      t.setAttribute(e, '' + l);
    }
  }
  function Ge(t, e, l, n) {
    if (n === null) t.removeAttribute(l);
    else {
      switch (typeof n) {
        case 'undefined':
        case 'function':
        case 'symbol':
        case 'boolean':
          t.removeAttribute(l);
          return;
      }
      t.setAttributeNS(e, l, '' + n);
    }
  }
  function be(t) {
    switch (typeof t) {
      case 'bigint':
      case 'boolean':
      case 'number':
      case 'string':
      case 'undefined':
        return t;
      case 'object':
        return t;
      default:
        return '';
    }
  }
  function ro(t) {
    var e = t.type;
    return (t = t.nodeName) && t.toLowerCase() === 'input' && (e === 'checkbox' || e === 'radio');
  }
  function yh(t, e, l) {
    var n = Object.getOwnPropertyDescriptor(t.constructor.prototype, e);
    if (
      !t.hasOwnProperty(e) &&
      typeof n < 'u' &&
      typeof n.get == 'function' &&
      typeof n.set == 'function'
    ) {
      var a = n.get,
        u = n.set;
      return (
        Object.defineProperty(t, e, {
          configurable: !0,
          get: function () {
            return a.call(this);
          },
          set: function (c) {
            ((l = '' + c), u.call(this, c));
          },
        }),
        Object.defineProperty(t, e, { enumerable: n.enumerable }),
        {
          getValue: function () {
            return l;
          },
          setValue: function (c) {
            l = '' + c;
          },
          stopTracking: function () {
            ((t._valueTracker = null), delete t[e]);
          },
        }
      );
    }
  }
  function Si(t) {
    if (!t._valueTracker) {
      var e = ro(t) ? 'checked' : 'value';
      t._valueTracker = yh(t, e, '' + t[e]);
    }
  }
  function mo(t) {
    if (!t) return !1;
    var e = t._valueTracker;
    if (!e) return !0;
    var l = e.getValue(),
      n = '';
    return (
      t && (n = ro(t) ? (t.checked ? 'true' : 'false') : t.value),
      (t = n),
      t !== l ? (e.setValue(t), !0) : !1
    );
  }
  function Wa(t) {
    if (((t = t || (typeof document < 'u' ? document : void 0)), typeof t > 'u')) return null;
    try {
      return t.activeElement || t.body;
    } catch {
      return t.body;
    }
  }
  var vh = /[\n"\\]/g;
  function Se(t) {
    return t.replace(vh, function (e) {
      return '\\' + e.charCodeAt(0).toString(16) + ' ';
    });
  }
  function xi(t, e, l, n, a, u, c, r) {
    ((t.name = ''),
      c != null && typeof c != 'function' && typeof c != 'symbol' && typeof c != 'boolean'
        ? (t.type = c)
        : t.removeAttribute('type'),
      e != null
        ? c === 'number'
          ? ((e === 0 && t.value === '') || t.value != e) && (t.value = '' + be(e))
          : t.value !== '' + be(e) && (t.value = '' + be(e))
        : (c !== 'submit' && c !== 'reset') || t.removeAttribute('value'),
      e != null
        ? zi(t, c, be(e))
        : l != null
          ? zi(t, c, be(l))
          : n != null && t.removeAttribute('value'),
      a == null && u != null && (t.defaultChecked = !!u),
      a != null && (t.checked = a && typeof a != 'function' && typeof a != 'symbol'),
      r != null && typeof r != 'function' && typeof r != 'symbol' && typeof r != 'boolean'
        ? (t.name = '' + be(r))
        : t.removeAttribute('name'));
  }
  function ho(t, e, l, n, a, u, c, r) {
    if (
      (u != null &&
        typeof u != 'function' &&
        typeof u != 'symbol' &&
        typeof u != 'boolean' &&
        (t.type = u),
      e != null || l != null)
    ) {
      if (!((u !== 'submit' && u !== 'reset') || e != null)) {
        Si(t);
        return;
      }
      ((l = l != null ? '' + be(l) : ''),
        (e = e != null ? '' + be(e) : l),
        r || e === t.value || (t.value = e),
        (t.defaultValue = e));
    }
    ((n = n ?? a),
      (n = typeof n != 'function' && typeof n != 'symbol' && !!n),
      (t.checked = r ? t.checked : !!n),
      (t.defaultChecked = !!n),
      c != null &&
        typeof c != 'function' &&
        typeof c != 'symbol' &&
        typeof c != 'boolean' &&
        (t.name = c),
      Si(t));
  }
  function zi(t, e, l) {
    (e === 'number' && Wa(t.ownerDocument) === t) ||
      t.defaultValue === '' + l ||
      (t.defaultValue = '' + l);
  }
  function an(t, e, l, n) {
    if (((t = t.options), e)) {
      e = {};
      for (var a = 0; a < l.length; a++) e['$' + l[a]] = !0;
      for (l = 0; l < t.length; l++)
        ((a = e.hasOwnProperty('$' + t[l].value)),
          t[l].selected !== a && (t[l].selected = a),
          a && n && (t[l].defaultSelected = !0));
    } else {
      for (l = '' + be(l), e = null, a = 0; a < t.length; a++) {
        if (t[a].value === l) {
          ((t[a].selected = !0), n && (t[a].defaultSelected = !0));
          return;
        }
        e !== null || t[a].disabled || (e = t[a]);
      }
      e !== null && (e.selected = !0);
    }
  }
  function yo(t, e, l) {
    if (e != null && ((e = '' + be(e)), e !== t.value && (t.value = e), l == null)) {
      t.defaultValue !== e && (t.defaultValue = e);
      return;
    }
    t.defaultValue = l != null ? '' + be(l) : '';
  }
  function vo(t, e, l, n) {
    if (e == null) {
      if (n != null) {
        if (l != null) throw Error(f(92));
        if (Yt(n)) {
          if (1 < n.length) throw Error(f(93));
          n = n[0];
        }
        l = n;
      }
      (l == null && (l = ''), (e = l));
    }
    ((l = be(e)),
      (t.defaultValue = l),
      (n = t.textContent),
      n === l && n !== '' && n !== null && (t.value = n),
      Si(t));
  }
  function un(t, e) {
    if (e) {
      var l = t.firstChild;
      if (l && l === t.lastChild && l.nodeType === 3) {
        l.nodeValue = e;
        return;
      }
    }
    t.textContent = e;
  }
  var gh = new Set(
    'animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp'.split(
      ' ',
    ),
  );
  function go(t, e, l) {
    var n = e.indexOf('--') === 0;
    l == null || typeof l == 'boolean' || l === ''
      ? n
        ? t.setProperty(e, '')
        : e === 'float'
          ? (t.cssFloat = '')
          : (t[e] = '')
      : n
        ? t.setProperty(e, l)
        : typeof l != 'number' || l === 0 || gh.has(e)
          ? e === 'float'
            ? (t.cssFloat = l)
            : (t[e] = ('' + l).trim())
          : (t[e] = l + 'px');
  }
  function po(t, e, l) {
    if (e != null && typeof e != 'object') throw Error(f(62));
    if (((t = t.style), l != null)) {
      for (var n in l)
        !l.hasOwnProperty(n) ||
          (e != null && e.hasOwnProperty(n)) ||
          (n.indexOf('--') === 0
            ? t.setProperty(n, '')
            : n === 'float'
              ? (t.cssFloat = '')
              : (t[n] = ''));
      for (var a in e) ((n = e[a]), e.hasOwnProperty(a) && l[a] !== n && go(t, a, n));
    } else for (var u in e) e.hasOwnProperty(u) && go(t, u, e[u]);
  }
  function Ei(t) {
    if (t.indexOf('-') === -1) return !1;
    switch (t) {
      case 'annotation-xml':
      case 'color-profile':
      case 'font-face':
      case 'font-face-src':
      case 'font-face-uri':
      case 'font-face-format':
      case 'font-face-name':
      case 'missing-glyph':
        return !1;
      default:
        return !0;
    }
  }
  var ph = new Map([
      ['acceptCharset', 'accept-charset'],
      ['htmlFor', 'for'],
      ['httpEquiv', 'http-equiv'],
      ['crossOrigin', 'crossorigin'],
      ['accentHeight', 'accent-height'],
      ['alignmentBaseline', 'alignment-baseline'],
      ['arabicForm', 'arabic-form'],
      ['baselineShift', 'baseline-shift'],
      ['capHeight', 'cap-height'],
      ['clipPath', 'clip-path'],
      ['clipRule', 'clip-rule'],
      ['colorInterpolation', 'color-interpolation'],
      ['colorInterpolationFilters', 'color-interpolation-filters'],
      ['colorProfile', 'color-profile'],
      ['colorRendering', 'color-rendering'],
      ['dominantBaseline', 'dominant-baseline'],
      ['enableBackground', 'enable-background'],
      ['fillOpacity', 'fill-opacity'],
      ['fillRule', 'fill-rule'],
      ['floodColor', 'flood-color'],
      ['floodOpacity', 'flood-opacity'],
      ['fontFamily', 'font-family'],
      ['fontSize', 'font-size'],
      ['fontSizeAdjust', 'font-size-adjust'],
      ['fontStretch', 'font-stretch'],
      ['fontStyle', 'font-style'],
      ['fontVariant', 'font-variant'],
      ['fontWeight', 'font-weight'],
      ['glyphName', 'glyph-name'],
      ['glyphOrientationHorizontal', 'glyph-orientation-horizontal'],
      ['glyphOrientationVertical', 'glyph-orientation-vertical'],
      ['horizAdvX', 'horiz-adv-x'],
      ['horizOriginX', 'horiz-origin-x'],
      ['imageRendering', 'image-rendering'],
      ['letterSpacing', 'letter-spacing'],
      ['lightingColor', 'lighting-color'],
      ['markerEnd', 'marker-end'],
      ['markerMid', 'marker-mid'],
      ['markerStart', 'marker-start'],
      ['overlinePosition', 'overline-position'],
      ['overlineThickness', 'overline-thickness'],
      ['paintOrder', 'paint-order'],
      ['panose-1', 'panose-1'],
      ['pointerEvents', 'pointer-events'],
      ['renderingIntent', 'rendering-intent'],
      ['shapeRendering', 'shape-rendering'],
      ['stopColor', 'stop-color'],
      ['stopOpacity', 'stop-opacity'],
      ['strikethroughPosition', 'strikethrough-position'],
      ['strikethroughThickness', 'strikethrough-thickness'],
      ['strokeDasharray', 'stroke-dasharray'],
      ['strokeDashoffset', 'stroke-dashoffset'],
      ['strokeLinecap', 'stroke-linecap'],
      ['strokeLinejoin', 'stroke-linejoin'],
      ['strokeMiterlimit', 'stroke-miterlimit'],
      ['strokeOpacity', 'stroke-opacity'],
      ['strokeWidth', 'stroke-width'],
      ['textAnchor', 'text-anchor'],
      ['textDecoration', 'text-decoration'],
      ['textRendering', 'text-rendering'],
      ['transformOrigin', 'transform-origin'],
      ['underlinePosition', 'underline-position'],
      ['underlineThickness', 'underline-thickness'],
      ['unicodeBidi', 'unicode-bidi'],
      ['unicodeRange', 'unicode-range'],
      ['unitsPerEm', 'units-per-em'],
      ['vAlphabetic', 'v-alphabetic'],
      ['vHanging', 'v-hanging'],
      ['vIdeographic', 'v-ideographic'],
      ['vMathematical', 'v-mathematical'],
      ['vectorEffect', 'vector-effect'],
      ['vertAdvY', 'vert-adv-y'],
      ['vertOriginX', 'vert-origin-x'],
      ['vertOriginY', 'vert-origin-y'],
      ['wordSpacing', 'word-spacing'],
      ['writingMode', 'writing-mode'],
      ['xmlnsXlink', 'xmlns:xlink'],
      ['xHeight', 'x-height'],
    ]),
    bh =
      /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Fa(t) {
    return bh.test('' + t)
      ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')"
      : t;
  }
  function Le() {}
  var Ai = null;
  function Ti(t) {
    return (
      (t = t.target || t.srcElement || window),
      t.correspondingUseElement && (t = t.correspondingUseElement),
      t.nodeType === 3 ? t.parentNode : t
    );
  }
  var cn = null,
    fn = null;
  function bo(t) {
    var e = en(t);
    if (e && (t = e.stateNode)) {
      var l = t[le] || null;
      t: switch (((t = e.stateNode), e.type)) {
        case 'input':
          if (
            (xi(
              t,
              l.value,
              l.defaultValue,
              l.defaultValue,
              l.checked,
              l.defaultChecked,
              l.type,
              l.name,
            ),
            (e = l.name),
            l.type === 'radio' && e != null)
          ) {
            for (l = t; l.parentNode; ) l = l.parentNode;
            for (
              l = l.querySelectorAll('input[name="' + Se('' + e) + '"][type="radio"]'), e = 0;
              e < l.length;
              e++
            ) {
              var n = l[e];
              if (n !== t && n.form === t.form) {
                var a = n[le] || null;
                if (!a) throw Error(f(90));
                xi(
                  n,
                  a.value,
                  a.defaultValue,
                  a.defaultValue,
                  a.checked,
                  a.defaultChecked,
                  a.type,
                  a.name,
                );
              }
            }
            for (e = 0; e < l.length; e++) ((n = l[e]), n.form === t.form && mo(n));
          }
          break t;
        case 'textarea':
          yo(t, l.value, l.defaultValue);
          break t;
        case 'select':
          ((e = l.value), e != null && an(t, !!l.multiple, e, !1));
      }
    }
  }
  var _i = !1;
  function So(t, e, l) {
    if (_i) return t(e, l);
    _i = !0;
    try {
      var n = t(e);
      return n;
    } finally {
      if (
        ((_i = !1),
        (cn !== null || fn !== null) &&
          (Yu(), cn && ((e = cn), (t = fn), (fn = cn = null), bo(e), t)))
      )
        for (e = 0; e < t.length; e++) bo(t[e]);
    }
  }
  function $n(t, e) {
    var l = t.stateNode;
    if (l === null) return null;
    var n = l[le] || null;
    if (n === null) return null;
    l = n[e];
    t: switch (e) {
      case 'onClick':
      case 'onClickCapture':
      case 'onDoubleClick':
      case 'onDoubleClickCapture':
      case 'onMouseDown':
      case 'onMouseDownCapture':
      case 'onMouseMove':
      case 'onMouseMoveCapture':
      case 'onMouseUp':
      case 'onMouseUpCapture':
      case 'onMouseEnter':
        ((n = !n.disabled) ||
          ((t = t.type),
          (n = !(t === 'button' || t === 'input' || t === 'select' || t === 'textarea'))),
          (t = !n));
        break t;
      default:
        t = !1;
    }
    if (t) return null;
    if (l && typeof l != 'function') throw Error(f(231, e, typeof l));
    return l;
  }
  var Xe = !(
      typeof window > 'u' ||
      typeof window.document > 'u' ||
      typeof window.document.createElement > 'u'
    ),
    Mi = !1;
  if (Xe)
    try {
      var kn = {};
      (Object.defineProperty(kn, 'passive', {
        get: function () {
          Mi = !0;
        },
      }),
        window.addEventListener('test', kn, kn),
        window.removeEventListener('test', kn, kn));
    } catch {
      Mi = !1;
    }
  var cl = null,
    Oi = null,
    Ia = null;
  function xo() {
    if (Ia) return Ia;
    var t,
      e = Oi,
      l = e.length,
      n,
      a = 'value' in cl ? cl.value : cl.textContent,
      u = a.length;
    for (t = 0; t < l && e[t] === a[t]; t++);
    var c = l - t;
    for (n = 1; n <= c && e[l - n] === a[u - n]; n++);
    return (Ia = a.slice(t, 1 < n ? 1 - n : void 0));
  }
  function Pa(t) {
    var e = t.keyCode;
    return (
      'charCode' in t ? ((t = t.charCode), t === 0 && e === 13 && (t = 13)) : (t = e),
      t === 10 && (t = 13),
      32 <= t || t === 13 ? t : 0
    );
  }
  function tu() {
    return !0;
  }
  function zo() {
    return !1;
  }
  function ne(t) {
    function e(l, n, a, u, c) {
      ((this._reactName = l),
        (this._targetInst = a),
        (this.type = n),
        (this.nativeEvent = u),
        (this.target = c),
        (this.currentTarget = null));
      for (var r in t) t.hasOwnProperty(r) && ((l = t[r]), (this[r] = l ? l(u) : u[r]));
      return (
        (this.isDefaultPrevented = (
          u.defaultPrevented != null ? u.defaultPrevented : u.returnValue === !1
        )
          ? tu
          : zo),
        (this.isPropagationStopped = zo),
        this
      );
    }
    return (
      E(e.prototype, {
        preventDefault: function () {
          this.defaultPrevented = !0;
          var l = this.nativeEvent;
          l &&
            (l.preventDefault
              ? l.preventDefault()
              : typeof l.returnValue != 'unknown' && (l.returnValue = !1),
            (this.isDefaultPrevented = tu));
        },
        stopPropagation: function () {
          var l = this.nativeEvent;
          l &&
            (l.stopPropagation
              ? l.stopPropagation()
              : typeof l.cancelBubble != 'unknown' && (l.cancelBubble = !0),
            (this.isPropagationStopped = tu));
        },
        persist: function () {},
        isPersistent: tu,
      }),
      e
    );
  }
  var Bl = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function (t) {
        return t.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0,
    },
    eu = ne(Bl),
    Wn = E({}, Bl, { view: 0, detail: 0 }),
    Sh = ne(Wn),
    Ri,
    Ni,
    Fn,
    lu = E({}, Wn, {
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
      getModifierState: Di,
      button: 0,
      buttons: 0,
      relatedTarget: function (t) {
        return t.relatedTarget === void 0
          ? t.fromElement === t.srcElement
            ? t.toElement
            : t.fromElement
          : t.relatedTarget;
      },
      movementX: function (t) {
        return 'movementX' in t
          ? t.movementX
          : (t !== Fn &&
              (Fn && t.type === 'mousemove'
                ? ((Ri = t.screenX - Fn.screenX), (Ni = t.screenY - Fn.screenY))
                : (Ni = Ri = 0),
              (Fn = t)),
            Ri);
      },
      movementY: function (t) {
        return 'movementY' in t ? t.movementY : Ni;
      },
    }),
    Eo = ne(lu),
    xh = E({}, lu, { dataTransfer: 0 }),
    zh = ne(xh),
    Eh = E({}, Wn, { relatedTarget: 0 }),
    Ci = ne(Eh),
    Ah = E({}, Bl, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
    Th = ne(Ah),
    _h = E({}, Bl, {
      clipboardData: function (t) {
        return 'clipboardData' in t ? t.clipboardData : window.clipboardData;
      },
    }),
    Mh = ne(_h),
    Oh = E({}, Bl, { data: 0 }),
    Ao = ne(Oh),
    Rh = {
      Esc: 'Escape',
      Spacebar: ' ',
      Left: 'ArrowLeft',
      Up: 'ArrowUp',
      Right: 'ArrowRight',
      Down: 'ArrowDown',
      Del: 'Delete',
      Win: 'OS',
      Menu: 'ContextMenu',
      Apps: 'ContextMenu',
      Scroll: 'ScrollLock',
      MozPrintableKey: 'Unidentified',
    },
    Nh = {
      8: 'Backspace',
      9: 'Tab',
      12: 'Clear',
      13: 'Enter',
      16: 'Shift',
      17: 'Control',
      18: 'Alt',
      19: 'Pause',
      20: 'CapsLock',
      27: 'Escape',
      32: ' ',
      33: 'PageUp',
      34: 'PageDown',
      35: 'End',
      36: 'Home',
      37: 'ArrowLeft',
      38: 'ArrowUp',
      39: 'ArrowRight',
      40: 'ArrowDown',
      45: 'Insert',
      46: 'Delete',
      112: 'F1',
      113: 'F2',
      114: 'F3',
      115: 'F4',
      116: 'F5',
      117: 'F6',
      118: 'F7',
      119: 'F8',
      120: 'F9',
      121: 'F10',
      122: 'F11',
      123: 'F12',
      144: 'NumLock',
      145: 'ScrollLock',
      224: 'Meta',
    },
    Ch = { Alt: 'altKey', Control: 'ctrlKey', Meta: 'metaKey', Shift: 'shiftKey' };
  function Dh(t) {
    var e = this.nativeEvent;
    return e.getModifierState ? e.getModifierState(t) : (t = Ch[t]) ? !!e[t] : !1;
  }
  function Di() {
    return Dh;
  }
  var jh = E({}, Wn, {
      key: function (t) {
        if (t.key) {
          var e = Rh[t.key] || t.key;
          if (e !== 'Unidentified') return e;
        }
        return t.type === 'keypress'
          ? ((t = Pa(t)), t === 13 ? 'Enter' : String.fromCharCode(t))
          : t.type === 'keydown' || t.type === 'keyup'
            ? Nh[t.keyCode] || 'Unidentified'
            : '';
      },
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: Di,
      charCode: function (t) {
        return t.type === 'keypress' ? Pa(t) : 0;
      },
      keyCode: function (t) {
        return t.type === 'keydown' || t.type === 'keyup' ? t.keyCode : 0;
      },
      which: function (t) {
        return t.type === 'keypress'
          ? Pa(t)
          : t.type === 'keydown' || t.type === 'keyup'
            ? t.keyCode
            : 0;
      },
    }),
    Uh = ne(jh),
    Hh = E({}, lu, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0,
    }),
    To = ne(Hh),
    Bh = E({}, Wn, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: Di,
    }),
    qh = ne(Bh),
    Yh = E({}, Bl, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
    wh = ne(Yh),
    Gh = E({}, lu, {
      deltaX: function (t) {
        return 'deltaX' in t ? t.deltaX : 'wheelDeltaX' in t ? -t.wheelDeltaX : 0;
      },
      deltaY: function (t) {
        return 'deltaY' in t
          ? t.deltaY
          : 'wheelDeltaY' in t
            ? -t.wheelDeltaY
            : 'wheelDelta' in t
              ? -t.wheelDelta
              : 0;
      },
      deltaZ: 0,
      deltaMode: 0,
    }),
    Lh = ne(Gh),
    Xh = E({}, Bl, { newState: 0, oldState: 0 }),
    Qh = ne(Xh),
    Vh = [9, 13, 27, 32],
    ji = Xe && 'CompositionEvent' in window,
    In = null;
  Xe && 'documentMode' in document && (In = document.documentMode);
  var Zh = Xe && 'TextEvent' in window && !In,
    _o = Xe && (!ji || (In && 8 < In && 11 >= In)),
    Mo = ' ',
    Oo = !1;
  function Ro(t, e) {
    switch (t) {
      case 'keyup':
        return Vh.indexOf(e.keyCode) !== -1;
      case 'keydown':
        return e.keyCode !== 229;
      case 'keypress':
      case 'mousedown':
      case 'focusout':
        return !0;
      default:
        return !1;
    }
  }
  function No(t) {
    return ((t = t.detail), typeof t == 'object' && 'data' in t ? t.data : null);
  }
  var on = !1;
  function Kh(t, e) {
    switch (t) {
      case 'compositionend':
        return No(e);
      case 'keypress':
        return e.which !== 32 ? null : ((Oo = !0), Mo);
      case 'textInput':
        return ((t = e.data), t === Mo && Oo ? null : t);
      default:
        return null;
    }
  }
  function Jh(t, e) {
    if (on)
      return t === 'compositionend' || (!ji && Ro(t, e))
        ? ((t = xo()), (Ia = Oi = cl = null), (on = !1), t)
        : null;
    switch (t) {
      case 'paste':
        return null;
      case 'keypress':
        if (!(e.ctrlKey || e.altKey || e.metaKey) || (e.ctrlKey && e.altKey)) {
          if (e.char && 1 < e.char.length) return e.char;
          if (e.which) return String.fromCharCode(e.which);
        }
        return null;
      case 'compositionend':
        return _o && e.locale !== 'ko' ? null : e.data;
      default:
        return null;
    }
  }
  var $h = {
    color: !0,
    date: !0,
    datetime: !0,
    'datetime-local': !0,
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
    week: !0,
  };
  function Co(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase();
    return e === 'input' ? !!$h[t.type] : e === 'textarea';
  }
  function Do(t, e, l, n) {
    (cn ? (fn ? fn.push(n) : (fn = [n])) : (cn = n),
      (e = Zu(e, 'onChange')),
      0 < e.length &&
        ((l = new eu('onChange', 'change', null, l, n)), t.push({ event: l, listeners: e })));
  }
  var Pn = null,
    ta = null;
  function kh(t) {
    hd(t, 0);
  }
  function nu(t) {
    var e = Jn(t);
    if (mo(e)) return t;
  }
  function jo(t, e) {
    if (t === 'change') return e;
  }
  var Uo = !1;
  if (Xe) {
    var Ui;
    if (Xe) {
      var Hi = 'oninput' in document;
      if (!Hi) {
        var Ho = document.createElement('div');
        (Ho.setAttribute('oninput', 'return;'), (Hi = typeof Ho.oninput == 'function'));
      }
      Ui = Hi;
    } else Ui = !1;
    Uo = Ui && (!document.documentMode || 9 < document.documentMode);
  }
  function Bo() {
    Pn && (Pn.detachEvent('onpropertychange', qo), (ta = Pn = null));
  }
  function qo(t) {
    if (t.propertyName === 'value' && nu(ta)) {
      var e = [];
      (Do(e, ta, t, Ti(t)), So(kh, e));
    }
  }
  function Wh(t, e, l) {
    t === 'focusin'
      ? (Bo(), (Pn = e), (ta = l), Pn.attachEvent('onpropertychange', qo))
      : t === 'focusout' && Bo();
  }
  function Fh(t) {
    if (t === 'selectionchange' || t === 'keyup' || t === 'keydown') return nu(ta);
  }
  function Ih(t, e) {
    if (t === 'click') return nu(e);
  }
  function Ph(t, e) {
    if (t === 'input' || t === 'change') return nu(e);
  }
  function t0(t, e) {
    return (t === e && (t !== 0 || 1 / t === 1 / e)) || (t !== t && e !== e);
  }
  var de = typeof Object.is == 'function' ? Object.is : t0;
  function ea(t, e) {
    if (de(t, e)) return !0;
    if (typeof t != 'object' || t === null || typeof e != 'object' || e === null) return !1;
    var l = Object.keys(t),
      n = Object.keys(e);
    if (l.length !== n.length) return !1;
    for (n = 0; n < l.length; n++) {
      var a = l[n];
      if (!di.call(e, a) || !de(t[a], e[a])) return !1;
    }
    return !0;
  }
  function Yo(t) {
    for (; t && t.firstChild; ) t = t.firstChild;
    return t;
  }
  function wo(t, e) {
    var l = Yo(t);
    t = 0;
    for (var n; l; ) {
      if (l.nodeType === 3) {
        if (((n = t + l.textContent.length), t <= e && n >= e)) return { node: l, offset: e - t };
        t = n;
      }
      t: {
        for (; l; ) {
          if (l.nextSibling) {
            l = l.nextSibling;
            break t;
          }
          l = l.parentNode;
        }
        l = void 0;
      }
      l = Yo(l);
    }
  }
  function Go(t, e) {
    return t && e
      ? t === e
        ? !0
        : t && t.nodeType === 3
          ? !1
          : e && e.nodeType === 3
            ? Go(t, e.parentNode)
            : 'contains' in t
              ? t.contains(e)
              : t.compareDocumentPosition
                ? !!(t.compareDocumentPosition(e) & 16)
                : !1
      : !1;
  }
  function Lo(t) {
    t =
      t != null && t.ownerDocument != null && t.ownerDocument.defaultView != null
        ? t.ownerDocument.defaultView
        : window;
    for (var e = Wa(t.document); e instanceof t.HTMLIFrameElement; ) {
      try {
        var l = typeof e.contentWindow.location.href == 'string';
      } catch {
        l = !1;
      }
      if (l) t = e.contentWindow;
      else break;
      e = Wa(t.document);
    }
    return e;
  }
  function Bi(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase();
    return (
      e &&
      ((e === 'input' &&
        (t.type === 'text' ||
          t.type === 'search' ||
          t.type === 'tel' ||
          t.type === 'url' ||
          t.type === 'password')) ||
        e === 'textarea' ||
        t.contentEditable === 'true')
    );
  }
  var e0 = Xe && 'documentMode' in document && 11 >= document.documentMode,
    sn = null,
    qi = null,
    la = null,
    Yi = !1;
  function Xo(t, e, l) {
    var n = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    Yi ||
      sn == null ||
      sn !== Wa(n) ||
      ((n = sn),
      'selectionStart' in n && Bi(n)
        ? (n = { start: n.selectionStart, end: n.selectionEnd })
        : ((n = ((n.ownerDocument && n.ownerDocument.defaultView) || window).getSelection()),
          (n = {
            anchorNode: n.anchorNode,
            anchorOffset: n.anchorOffset,
            focusNode: n.focusNode,
            focusOffset: n.focusOffset,
          })),
      (la && ea(la, n)) ||
        ((la = n),
        (n = Zu(qi, 'onSelect')),
        0 < n.length &&
          ((e = new eu('onSelect', 'select', null, e, l)),
          t.push({ event: e, listeners: n }),
          (e.target = sn))));
  }
  function ql(t, e) {
    var l = {};
    return (
      (l[t.toLowerCase()] = e.toLowerCase()),
      (l['Webkit' + t] = 'webkit' + e),
      (l['Moz' + t] = 'moz' + e),
      l
    );
  }
  var rn = {
      animationend: ql('Animation', 'AnimationEnd'),
      animationiteration: ql('Animation', 'AnimationIteration'),
      animationstart: ql('Animation', 'AnimationStart'),
      transitionrun: ql('Transition', 'TransitionRun'),
      transitionstart: ql('Transition', 'TransitionStart'),
      transitioncancel: ql('Transition', 'TransitionCancel'),
      transitionend: ql('Transition', 'TransitionEnd'),
    },
    wi = {},
    Qo = {};
  Xe &&
    ((Qo = document.createElement('div').style),
    'AnimationEvent' in window ||
      (delete rn.animationend.animation,
      delete rn.animationiteration.animation,
      delete rn.animationstart.animation),
    'TransitionEvent' in window || delete rn.transitionend.transition);
  function Yl(t) {
    if (wi[t]) return wi[t];
    if (!rn[t]) return t;
    var e = rn[t],
      l;
    for (l in e) if (e.hasOwnProperty(l) && l in Qo) return (wi[t] = e[l]);
    return t;
  }
  var Vo = Yl('animationend'),
    Zo = Yl('animationiteration'),
    Ko = Yl('animationstart'),
    l0 = Yl('transitionrun'),
    n0 = Yl('transitionstart'),
    a0 = Yl('transitioncancel'),
    Jo = Yl('transitionend'),
    $o = new Map(),
    Gi =
      'abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel'.split(
        ' ',
      );
  Gi.push('scrollEnd');
  function Ce(t, e) {
    ($o.set(t, e), Hl(e, [t]));
  }
  var au =
      typeof reportError == 'function'
        ? reportError
        : function (t) {
            if (typeof window == 'object' && typeof window.ErrorEvent == 'function') {
              var e = new window.ErrorEvent('error', {
                bubbles: !0,
                cancelable: !0,
                message:
                  typeof t == 'object' && t !== null && typeof t.message == 'string'
                    ? String(t.message)
                    : String(t),
                error: t,
              });
              if (!window.dispatchEvent(e)) return;
            } else if (typeof process == 'object' && typeof process.emit == 'function') {
              process.emit('uncaughtException', t);
              return;
            }
            console.error(t);
          },
    xe = [],
    dn = 0,
    Li = 0;
  function uu() {
    for (var t = dn, e = (Li = dn = 0); e < t; ) {
      var l = xe[e];
      xe[e++] = null;
      var n = xe[e];
      xe[e++] = null;
      var a = xe[e];
      xe[e++] = null;
      var u = xe[e];
      if (((xe[e++] = null), n !== null && a !== null)) {
        var c = n.pending;
        (c === null ? (a.next = a) : ((a.next = c.next), (c.next = a)), (n.pending = a));
      }
      u !== 0 && ko(l, a, u);
    }
  }
  function iu(t, e, l, n) {
    ((xe[dn++] = t),
      (xe[dn++] = e),
      (xe[dn++] = l),
      (xe[dn++] = n),
      (Li |= n),
      (t.lanes |= n),
      (t = t.alternate),
      t !== null && (t.lanes |= n));
  }
  function Xi(t, e, l, n) {
    return (iu(t, e, l, n), cu(t));
  }
  function wl(t, e) {
    return (iu(t, null, null, e), cu(t));
  }
  function ko(t, e, l) {
    t.lanes |= l;
    var n = t.alternate;
    n !== null && (n.lanes |= l);
    for (var a = !1, u = t.return; u !== null; )
      ((u.childLanes |= l),
        (n = u.alternate),
        n !== null && (n.childLanes |= l),
        u.tag === 22 && ((t = u.stateNode), t === null || t._visibility & 1 || (a = !0)),
        (t = u),
        (u = u.return));
    return t.tag === 3
      ? ((u = t.stateNode),
        a &&
          e !== null &&
          ((a = 31 - re(l)),
          (t = u.hiddenUpdates),
          (n = t[a]),
          n === null ? (t[a] = [e]) : n.push(e),
          (e.lane = l | 536870912)),
        u)
      : null;
  }
  function cu(t) {
    if (50 < Aa) throw ((Aa = 0), (Fc = null), Error(f(185)));
    for (var e = t.return; e !== null; ) ((t = e), (e = t.return));
    return t.tag === 3 ? t.stateNode : null;
  }
  var mn = {};
  function u0(t, e, l, n) {
    ((this.tag = t),
      (this.key = l),
      (this.sibling =
        this.child =
        this.return =
        this.stateNode =
        this.type =
        this.elementType =
          null),
      (this.index = 0),
      (this.refCleanup = this.ref = null),
      (this.pendingProps = e),
      (this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null),
      (this.mode = n),
      (this.subtreeFlags = this.flags = 0),
      (this.deletions = null),
      (this.childLanes = this.lanes = 0),
      (this.alternate = null));
  }
  function me(t, e, l, n) {
    return new u0(t, e, l, n);
  }
  function Qi(t) {
    return ((t = t.prototype), !(!t || !t.isReactComponent));
  }
  function Qe(t, e) {
    var l = t.alternate;
    return (
      l === null
        ? ((l = me(t.tag, e, t.key, t.mode)),
          (l.elementType = t.elementType),
          (l.type = t.type),
          (l.stateNode = t.stateNode),
          (l.alternate = t),
          (t.alternate = l))
        : ((l.pendingProps = e),
          (l.type = t.type),
          (l.flags = 0),
          (l.subtreeFlags = 0),
          (l.deletions = null)),
      (l.flags = t.flags & 65011712),
      (l.childLanes = t.childLanes),
      (l.lanes = t.lanes),
      (l.child = t.child),
      (l.memoizedProps = t.memoizedProps),
      (l.memoizedState = t.memoizedState),
      (l.updateQueue = t.updateQueue),
      (e = t.dependencies),
      (l.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }),
      (l.sibling = t.sibling),
      (l.index = t.index),
      (l.ref = t.ref),
      (l.refCleanup = t.refCleanup),
      l
    );
  }
  function Wo(t, e) {
    t.flags &= 65011714;
    var l = t.alternate;
    return (
      l === null
        ? ((t.childLanes = 0),
          (t.lanes = e),
          (t.child = null),
          (t.subtreeFlags = 0),
          (t.memoizedProps = null),
          (t.memoizedState = null),
          (t.updateQueue = null),
          (t.dependencies = null),
          (t.stateNode = null))
        : ((t.childLanes = l.childLanes),
          (t.lanes = l.lanes),
          (t.child = l.child),
          (t.subtreeFlags = 0),
          (t.deletions = null),
          (t.memoizedProps = l.memoizedProps),
          (t.memoizedState = l.memoizedState),
          (t.updateQueue = l.updateQueue),
          (t.type = l.type),
          (e = l.dependencies),
          (t.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext })),
      t
    );
  }
  function fu(t, e, l, n, a, u) {
    var c = 0;
    if (((n = t), typeof t == 'function')) Qi(t) && (c = 1);
    else if (typeof t == 'string')
      c = sy(t, l, k.current) ? 26 : t === 'html' || t === 'head' || t === 'body' ? 27 : 5;
    else
      t: switch (t) {
        case Mt:
          return ((t = me(31, l, e, a)), (t.elementType = Mt), (t.lanes = u), t);
        case L:
          return Gl(l.children, a, u, e);
        case q:
          ((c = 8), (a |= 24));
          break;
        case Y:
          return ((t = me(12, l, e, a | 2)), (t.elementType = Y), (t.lanes = u), t);
        case at:
          return ((t = me(13, l, e, a)), (t.elementType = at), (t.lanes = u), t);
        case F:
          return ((t = me(19, l, e, a)), (t.elementType = F), (t.lanes = u), t);
        default:
          if (typeof t == 'object' && t !== null)
            switch (t.$$typeof) {
              case G:
                c = 10;
                break t;
              case V:
                c = 9;
                break t;
              case X:
                c = 11;
                break t;
              case J:
                c = 14;
                break t;
              case zt:
                ((c = 16), (n = null));
                break t;
            }
          ((c = 29), (l = Error(f(130, t === null ? 'null' : typeof t, ''))), (n = null));
      }
    return ((e = me(c, l, e, a)), (e.elementType = t), (e.type = n), (e.lanes = u), e);
  }
  function Gl(t, e, l, n) {
    return ((t = me(7, t, n, e)), (t.lanes = l), t);
  }
  function Vi(t, e, l) {
    return ((t = me(6, t, null, e)), (t.lanes = l), t);
  }
  function Fo(t) {
    var e = me(18, null, null, 0);
    return ((e.stateNode = t), e);
  }
  function Zi(t, e, l) {
    return (
      (e = me(4, t.children !== null ? t.children : [], t.key, e)),
      (e.lanes = l),
      (e.stateNode = {
        containerInfo: t.containerInfo,
        pendingChildren: null,
        implementation: t.implementation,
      }),
      e
    );
  }
  var Io = new WeakMap();
  function ze(t, e) {
    if (typeof t == 'object' && t !== null) {
      var l = Io.get(t);
      return l !== void 0 ? l : ((e = { value: t, source: e, stack: Wf(e) }), Io.set(t, e), e);
    }
    return { value: t, source: e, stack: Wf(e) };
  }
  var hn = [],
    yn = 0,
    ou = null,
    na = 0,
    Ee = [],
    Ae = 0,
    fl = null,
    He = 1,
    Be = '';
  function Ve(t, e) {
    ((hn[yn++] = na), (hn[yn++] = ou), (ou = t), (na = e));
  }
  function Po(t, e, l) {
    ((Ee[Ae++] = He), (Ee[Ae++] = Be), (Ee[Ae++] = fl), (fl = t));
    var n = He;
    t = Be;
    var a = 32 - re(n) - 1;
    ((n &= ~(1 << a)), (l += 1));
    var u = 32 - re(e) + a;
    if (30 < u) {
      var c = a - (a % 5);
      ((u = (n & ((1 << c) - 1)).toString(32)),
        (n >>= c),
        (a -= c),
        (He = (1 << (32 - re(e) + a)) | (l << a) | n),
        (Be = u + t));
    } else ((He = (1 << u) | (l << a) | n), (Be = t));
  }
  function Ki(t) {
    t.return !== null && (Ve(t, 1), Po(t, 1, 0));
  }
  function Ji(t) {
    for (; t === ou; ) ((ou = hn[--yn]), (hn[yn] = null), (na = hn[--yn]), (hn[yn] = null));
    for (; t === fl; )
      ((fl = Ee[--Ae]),
        (Ee[Ae] = null),
        (Be = Ee[--Ae]),
        (Ee[Ae] = null),
        (He = Ee[--Ae]),
        (Ee[Ae] = null));
  }
  function ts(t, e) {
    ((Ee[Ae++] = He), (Ee[Ae++] = Be), (Ee[Ae++] = fl), (He = e.id), (Be = e.overflow), (fl = t));
  }
  var kt = null,
    Rt = null,
    ht = !1,
    ol = null,
    Te = !1,
    $i = Error(f(519));
  function sl(t) {
    var e = Error(
      f(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? 'text' : 'HTML', ''),
    );
    throw (aa(ze(e, t)), $i);
  }
  function es(t) {
    var e = t.stateNode,
      l = t.type,
      n = t.memoizedProps;
    switch (((e[$t] = t), (e[le] = n), l)) {
      case 'dialog':
        (rt('cancel', e), rt('close', e));
        break;
      case 'iframe':
      case 'object':
      case 'embed':
        rt('load', e);
        break;
      case 'video':
      case 'audio':
        for (l = 0; l < _a.length; l++) rt(_a[l], e);
        break;
      case 'source':
        rt('error', e);
        break;
      case 'img':
      case 'image':
      case 'link':
        (rt('error', e), rt('load', e));
        break;
      case 'details':
        rt('toggle', e);
        break;
      case 'input':
        (rt('invalid', e),
          ho(e, n.value, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name, !0));
        break;
      case 'select':
        rt('invalid', e);
        break;
      case 'textarea':
        (rt('invalid', e), vo(e, n.value, n.defaultValue, n.children));
    }
    ((l = n.children),
      (typeof l != 'string' && typeof l != 'number' && typeof l != 'bigint') ||
      e.textContent === '' + l ||
      n.suppressHydrationWarning === !0 ||
      pd(e.textContent, l)
        ? (n.popover != null && (rt('beforetoggle', e), rt('toggle', e)),
          n.onScroll != null && rt('scroll', e),
          n.onScrollEnd != null && rt('scrollend', e),
          n.onClick != null && (e.onclick = Le),
          (e = !0))
        : (e = !1),
      e || sl(t, !0));
  }
  function ls(t) {
    for (kt = t.return; kt; )
      switch (kt.tag) {
        case 5:
        case 31:
        case 13:
          Te = !1;
          return;
        case 27:
        case 3:
          Te = !0;
          return;
        default:
          kt = kt.return;
      }
  }
  function vn(t) {
    if (t !== kt) return !1;
    if (!ht) return (ls(t), (ht = !0), !1);
    var e = t.tag,
      l;
    if (
      ((l = e !== 3 && e !== 27) &&
        ((l = e === 5) &&
          ((l = t.type), (l = !(l !== 'form' && l !== 'button') || mf(t.type, t.memoizedProps))),
        (l = !l)),
      l && Rt && sl(t),
      ls(t),
      e === 13)
    ) {
      if (((t = t.memoizedState), (t = t !== null ? t.dehydrated : null), !t)) throw Error(f(317));
      Rt = Md(t);
    } else if (e === 31) {
      if (((t = t.memoizedState), (t = t !== null ? t.dehydrated : null), !t)) throw Error(f(317));
      Rt = Md(t);
    } else
      e === 27
        ? ((e = Rt), Al(t.type) ? ((t = pf), (pf = null), (Rt = t)) : (Rt = e))
        : (Rt = kt ? Me(t.stateNode.nextSibling) : null);
    return !0;
  }
  function Ll() {
    ((Rt = kt = null), (ht = !1));
  }
  function ki() {
    var t = ol;
    return (t !== null && (ce === null ? (ce = t) : ce.push.apply(ce, t), (ol = null)), t);
  }
  function aa(t) {
    ol === null ? (ol = [t]) : ol.push(t);
  }
  var Wi = v(null),
    Xl = null,
    Ze = null;
  function rl(t, e, l) {
    (Q(Wi, e._currentValue), (e._currentValue = l));
  }
  function Ke(t) {
    ((t._currentValue = Wi.current), j(Wi));
  }
  function Fi(t, e, l) {
    for (; t !== null; ) {
      var n = t.alternate;
      if (
        ((t.childLanes & e) !== e
          ? ((t.childLanes |= e), n !== null && (n.childLanes |= e))
          : n !== null && (n.childLanes & e) !== e && (n.childLanes |= e),
        t === l)
      )
        break;
      t = t.return;
    }
  }
  function Ii(t, e, l, n) {
    var a = t.child;
    for (a !== null && (a.return = t); a !== null; ) {
      var u = a.dependencies;
      if (u !== null) {
        var c = a.child;
        u = u.firstContext;
        t: for (; u !== null; ) {
          var r = u;
          u = a;
          for (var h = 0; h < e.length; h++)
            if (r.context === e[h]) {
              ((u.lanes |= l),
                (r = u.alternate),
                r !== null && (r.lanes |= l),
                Fi(u.return, l, t),
                n || (c = null));
              break t;
            }
          u = r.next;
        }
      } else if (a.tag === 18) {
        if (((c = a.return), c === null)) throw Error(f(341));
        ((c.lanes |= l), (u = c.alternate), u !== null && (u.lanes |= l), Fi(c, l, t), (c = null));
      } else c = a.child;
      if (c !== null) c.return = a;
      else
        for (c = a; c !== null; ) {
          if (c === t) {
            c = null;
            break;
          }
          if (((a = c.sibling), a !== null)) {
            ((a.return = c.return), (c = a));
            break;
          }
          c = c.return;
        }
      a = c;
    }
  }
  function gn(t, e, l, n) {
    t = null;
    for (var a = e, u = !1; a !== null; ) {
      if (!u) {
        if ((a.flags & 524288) !== 0) u = !0;
        else if ((a.flags & 262144) !== 0) break;
      }
      if (a.tag === 10) {
        var c = a.alternate;
        if (c === null) throw Error(f(387));
        if (((c = c.memoizedProps), c !== null)) {
          var r = a.type;
          de(a.pendingProps.value, c.value) || (t !== null ? t.push(r) : (t = [r]));
        }
      } else if (a === bt.current) {
        if (((c = a.alternate), c === null)) throw Error(f(387));
        c.memoizedState.memoizedState !== a.memoizedState.memoizedState &&
          (t !== null ? t.push(Ca) : (t = [Ca]));
      }
      a = a.return;
    }
    (t !== null && Ii(e, t, l, n), (e.flags |= 262144));
  }
  function su(t) {
    for (t = t.firstContext; t !== null; ) {
      if (!de(t.context._currentValue, t.memoizedValue)) return !0;
      t = t.next;
    }
    return !1;
  }
  function Ql(t) {
    ((Xl = t), (Ze = null), (t = t.dependencies), t !== null && (t.firstContext = null));
  }
  function Wt(t) {
    return ns(Xl, t);
  }
  function ru(t, e) {
    return (Xl === null && Ql(t), ns(t, e));
  }
  function ns(t, e) {
    var l = e._currentValue;
    if (((e = { context: e, memoizedValue: l, next: null }), Ze === null)) {
      if (t === null) throw Error(f(308));
      ((Ze = e), (t.dependencies = { lanes: 0, firstContext: e }), (t.flags |= 524288));
    } else Ze = Ze.next = e;
    return l;
  }
  var i0 =
      typeof AbortController < 'u'
        ? AbortController
        : function () {
            var t = [],
              e = (this.signal = {
                aborted: !1,
                addEventListener: function (l, n) {
                  t.push(n);
                },
              });
            this.abort = function () {
              ((e.aborted = !0),
                t.forEach(function (l) {
                  return l();
                }));
            };
          },
    c0 = i.unstable_scheduleCallback,
    f0 = i.unstable_NormalPriority,
    wt = {
      $$typeof: G,
      Consumer: null,
      Provider: null,
      _currentValue: null,
      _currentValue2: null,
      _threadCount: 0,
    };
  function Pi() {
    return { controller: new i0(), data: new Map(), refCount: 0 };
  }
  function ua(t) {
    (t.refCount--,
      t.refCount === 0 &&
        c0(f0, function () {
          t.controller.abort();
        }));
  }
  var ia = null,
    tc = 0,
    pn = 0,
    bn = null;
  function o0(t, e) {
    if (ia === null) {
      var l = (ia = []);
      ((tc = 0),
        (pn = nf()),
        (bn = {
          status: 'pending',
          value: void 0,
          then: function (n) {
            l.push(n);
          },
        }));
    }
    return (tc++, e.then(as, as), e);
  }
  function as() {
    if (--tc === 0 && ia !== null) {
      bn !== null && (bn.status = 'fulfilled');
      var t = ia;
      ((ia = null), (pn = 0), (bn = null));
      for (var e = 0; e < t.length; e++) (0, t[e])();
    }
  }
  function s0(t, e) {
    var l = [],
      n = {
        status: 'pending',
        value: null,
        reason: null,
        then: function (a) {
          l.push(a);
        },
      };
    return (
      t.then(
        function () {
          ((n.status = 'fulfilled'), (n.value = e));
          for (var a = 0; a < l.length; a++) (0, l[a])(e);
        },
        function (a) {
          for (n.status = 'rejected', n.reason = a, a = 0; a < l.length; a++) (0, l[a])(void 0);
        },
      ),
      n
    );
  }
  var us = N.S;
  N.S = function (t, e) {
    ((Xr = oe()),
      typeof e == 'object' && e !== null && typeof e.then == 'function' && o0(t, e),
      us !== null && us(t, e));
  };
  var Vl = v(null);
  function ec() {
    var t = Vl.current;
    return t !== null ? t : _t.pooledCache;
  }
  function du(t, e) {
    e === null ? Q(Vl, Vl.current) : Q(Vl, e.pool);
  }
  function is() {
    var t = ec();
    return t === null ? null : { parent: wt._currentValue, pool: t };
  }
  var Sn = Error(f(460)),
    lc = Error(f(474)),
    mu = Error(f(542)),
    hu = { then: function () {} };
  function cs(t) {
    return ((t = t.status), t === 'fulfilled' || t === 'rejected');
  }
  function fs(t, e, l) {
    switch (
      ((l = t[l]), l === void 0 ? t.push(e) : l !== e && (e.then(Le, Le), (e = l)), e.status)
    ) {
      case 'fulfilled':
        return e.value;
      case 'rejected':
        throw ((t = e.reason), ss(t), t);
      default:
        if (typeof e.status == 'string') e.then(Le, Le);
        else {
          if (((t = _t), t !== null && 100 < t.shellSuspendCounter)) throw Error(f(482));
          ((t = e),
            (t.status = 'pending'),
            t.then(
              function (n) {
                if (e.status === 'pending') {
                  var a = e;
                  ((a.status = 'fulfilled'), (a.value = n));
                }
              },
              function (n) {
                if (e.status === 'pending') {
                  var a = e;
                  ((a.status = 'rejected'), (a.reason = n));
                }
              },
            ));
        }
        switch (e.status) {
          case 'fulfilled':
            return e.value;
          case 'rejected':
            throw ((t = e.reason), ss(t), t);
        }
        throw ((Kl = e), Sn);
    }
  }
  function Zl(t) {
    try {
      var e = t._init;
      return e(t._payload);
    } catch (l) {
      throw l !== null && typeof l == 'object' && typeof l.then == 'function' ? ((Kl = l), Sn) : l;
    }
  }
  var Kl = null;
  function os() {
    if (Kl === null) throw Error(f(459));
    var t = Kl;
    return ((Kl = null), t);
  }
  function ss(t) {
    if (t === Sn || t === mu) throw Error(f(483));
  }
  var xn = null,
    ca = 0;
  function yu(t) {
    var e = ca;
    return ((ca += 1), xn === null && (xn = []), fs(xn, t, e));
  }
  function fa(t, e) {
    ((e = e.props.ref), (t.ref = e !== void 0 ? e : null));
  }
  function vu(t, e) {
    throw e.$$typeof === H
      ? Error(f(525))
      : ((t = Object.prototype.toString.call(e)),
        Error(
          f(
            31,
            t === '[object Object]' ? 'object with keys {' + Object.keys(e).join(', ') + '}' : t,
          ),
        ));
  }
  function rs(t) {
    function e(z, b) {
      if (t) {
        var A = z.deletions;
        A === null ? ((z.deletions = [b]), (z.flags |= 16)) : A.push(b);
      }
    }
    function l(z, b) {
      if (!t) return null;
      for (; b !== null; ) (e(z, b), (b = b.sibling));
      return null;
    }
    function n(z) {
      for (var b = new Map(); z !== null; )
        (z.key !== null ? b.set(z.key, z) : b.set(z.index, z), (z = z.sibling));
      return b;
    }
    function a(z, b) {
      return ((z = Qe(z, b)), (z.index = 0), (z.sibling = null), z);
    }
    function u(z, b, A) {
      return (
        (z.index = A),
        t
          ? ((A = z.alternate),
            A !== null
              ? ((A = A.index), A < b ? ((z.flags |= 67108866), b) : A)
              : ((z.flags |= 67108866), b))
          : ((z.flags |= 1048576), b)
      );
    }
    function c(z) {
      return (t && z.alternate === null && (z.flags |= 67108866), z);
    }
    function r(z, b, A, D) {
      return b === null || b.tag !== 6
        ? ((b = Vi(A, z.mode, D)), (b.return = z), b)
        : ((b = a(b, A)), (b.return = z), b);
    }
    function h(z, b, A, D) {
      var P = A.type;
      return P === L
        ? C(z, b, A.props.children, D, A.key)
        : b !== null &&
            (b.elementType === P ||
              (typeof P == 'object' && P !== null && P.$$typeof === zt && Zl(P) === b.type))
          ? ((b = a(b, A.props)), fa(b, A), (b.return = z), b)
          : ((b = fu(A.type, A.key, A.props, null, z.mode, D)), fa(b, A), (b.return = z), b);
    }
    function T(z, b, A, D) {
      return b === null ||
        b.tag !== 4 ||
        b.stateNode.containerInfo !== A.containerInfo ||
        b.stateNode.implementation !== A.implementation
        ? ((b = Zi(A, z.mode, D)), (b.return = z), b)
        : ((b = a(b, A.children || [])), (b.return = z), b);
    }
    function C(z, b, A, D, P) {
      return b === null || b.tag !== 7
        ? ((b = Gl(A, z.mode, D, P)), (b.return = z), b)
        : ((b = a(b, A)), (b.return = z), b);
    }
    function U(z, b, A) {
      if ((typeof b == 'string' && b !== '') || typeof b == 'number' || typeof b == 'bigint')
        return ((b = Vi('' + b, z.mode, A)), (b.return = z), b);
      if (typeof b == 'object' && b !== null) {
        switch (b.$$typeof) {
          case Z:
            return ((A = fu(b.type, b.key, b.props, null, z.mode, A)), fa(A, b), (A.return = z), A);
          case $:
            return ((b = Zi(b, z.mode, A)), (b.return = z), b);
          case zt:
            return ((b = Zl(b)), U(z, b, A));
        }
        if (Yt(b) || tt(b)) return ((b = Gl(b, z.mode, A, null)), (b.return = z), b);
        if (typeof b.then == 'function') return U(z, yu(b), A);
        if (b.$$typeof === G) return U(z, ru(z, b), A);
        vu(z, b);
      }
      return null;
    }
    function _(z, b, A, D) {
      var P = b !== null ? b.key : null;
      if ((typeof A == 'string' && A !== '') || typeof A == 'number' || typeof A == 'bigint')
        return P !== null ? null : r(z, b, '' + A, D);
      if (typeof A == 'object' && A !== null) {
        switch (A.$$typeof) {
          case Z:
            return A.key === P ? h(z, b, A, D) : null;
          case $:
            return A.key === P ? T(z, b, A, D) : null;
          case zt:
            return ((A = Zl(A)), _(z, b, A, D));
        }
        if (Yt(A) || tt(A)) return P !== null ? null : C(z, b, A, D, null);
        if (typeof A.then == 'function') return _(z, b, yu(A), D);
        if (A.$$typeof === G) return _(z, b, ru(z, A), D);
        vu(z, A);
      }
      return null;
    }
    function O(z, b, A, D, P) {
      if ((typeof D == 'string' && D !== '') || typeof D == 'number' || typeof D == 'bigint')
        return ((z = z.get(A) || null), r(b, z, '' + D, P));
      if (typeof D == 'object' && D !== null) {
        switch (D.$$typeof) {
          case Z:
            return ((z = z.get(D.key === null ? A : D.key) || null), h(b, z, D, P));
          case $:
            return ((z = z.get(D.key === null ? A : D.key) || null), T(b, z, D, P));
          case zt:
            return ((D = Zl(D)), O(z, b, A, D, P));
        }
        if (Yt(D) || tt(D)) return ((z = z.get(A) || null), C(b, z, D, P, null));
        if (typeof D.then == 'function') return O(z, b, A, yu(D), P);
        if (D.$$typeof === G) return O(z, b, A, ru(b, D), P);
        vu(b, D);
      }
      return null;
    }
    function K(z, b, A, D) {
      for (
        var P = null, vt = null, W = b, ct = (b = 0), mt = null;
        W !== null && ct < A.length;
        ct++
      ) {
        W.index > ct ? ((mt = W), (W = null)) : (mt = W.sibling);
        var gt = _(z, W, A[ct], D);
        if (gt === null) {
          W === null && (W = mt);
          break;
        }
        (t && W && gt.alternate === null && e(z, W),
          (b = u(gt, b, ct)),
          vt === null ? (P = gt) : (vt.sibling = gt),
          (vt = gt),
          (W = mt));
      }
      if (ct === A.length) return (l(z, W), ht && Ve(z, ct), P);
      if (W === null) {
        for (; ct < A.length; ct++)
          ((W = U(z, A[ct], D)),
            W !== null && ((b = u(W, b, ct)), vt === null ? (P = W) : (vt.sibling = W), (vt = W)));
        return (ht && Ve(z, ct), P);
      }
      for (W = n(W); ct < A.length; ct++)
        ((mt = O(W, z, ct, A[ct], D)),
          mt !== null &&
            (t && mt.alternate !== null && W.delete(mt.key === null ? ct : mt.key),
            (b = u(mt, b, ct)),
            vt === null ? (P = mt) : (vt.sibling = mt),
            (vt = mt)));
      return (
        t &&
          W.forEach(function (Rl) {
            return e(z, Rl);
          }),
        ht && Ve(z, ct),
        P
      );
    }
    function lt(z, b, A, D) {
      if (A == null) throw Error(f(151));
      for (
        var P = null, vt = null, W = b, ct = (b = 0), mt = null, gt = A.next();
        W !== null && !gt.done;
        ct++, gt = A.next()
      ) {
        W.index > ct ? ((mt = W), (W = null)) : (mt = W.sibling);
        var Rl = _(z, W, gt.value, D);
        if (Rl === null) {
          W === null && (W = mt);
          break;
        }
        (t && W && Rl.alternate === null && e(z, W),
          (b = u(Rl, b, ct)),
          vt === null ? (P = Rl) : (vt.sibling = Rl),
          (vt = Rl),
          (W = mt));
      }
      if (gt.done) return (l(z, W), ht && Ve(z, ct), P);
      if (W === null) {
        for (; !gt.done; ct++, gt = A.next())
          ((gt = U(z, gt.value, D)),
            gt !== null &&
              ((b = u(gt, b, ct)), vt === null ? (P = gt) : (vt.sibling = gt), (vt = gt)));
        return (ht && Ve(z, ct), P);
      }
      for (W = n(W); !gt.done; ct++, gt = A.next())
        ((gt = O(W, z, ct, gt.value, D)),
          gt !== null &&
            (t && gt.alternate !== null && W.delete(gt.key === null ? ct : gt.key),
            (b = u(gt, b, ct)),
            vt === null ? (P = gt) : (vt.sibling = gt),
            (vt = gt)));
      return (
        t &&
          W.forEach(function (xy) {
            return e(z, xy);
          }),
        ht && Ve(z, ct),
        P
      );
    }
    function Tt(z, b, A, D) {
      if (
        (typeof A == 'object' &&
          A !== null &&
          A.type === L &&
          A.key === null &&
          (A = A.props.children),
        typeof A == 'object' && A !== null)
      ) {
        switch (A.$$typeof) {
          case Z:
            t: {
              for (var P = A.key; b !== null; ) {
                if (b.key === P) {
                  if (((P = A.type), P === L)) {
                    if (b.tag === 7) {
                      (l(z, b.sibling), (D = a(b, A.props.children)), (D.return = z), (z = D));
                      break t;
                    }
                  } else if (
                    b.elementType === P ||
                    (typeof P == 'object' && P !== null && P.$$typeof === zt && Zl(P) === b.type)
                  ) {
                    (l(z, b.sibling), (D = a(b, A.props)), fa(D, A), (D.return = z), (z = D));
                    break t;
                  }
                  l(z, b);
                  break;
                } else e(z, b);
                b = b.sibling;
              }
              A.type === L
                ? ((D = Gl(A.props.children, z.mode, D, A.key)), (D.return = z), (z = D))
                : ((D = fu(A.type, A.key, A.props, null, z.mode, D)),
                  fa(D, A),
                  (D.return = z),
                  (z = D));
            }
            return c(z);
          case $:
            t: {
              for (P = A.key; b !== null; ) {
                if (b.key === P)
                  if (
                    b.tag === 4 &&
                    b.stateNode.containerInfo === A.containerInfo &&
                    b.stateNode.implementation === A.implementation
                  ) {
                    (l(z, b.sibling), (D = a(b, A.children || [])), (D.return = z), (z = D));
                    break t;
                  } else {
                    l(z, b);
                    break;
                  }
                else e(z, b);
                b = b.sibling;
              }
              ((D = Zi(A, z.mode, D)), (D.return = z), (z = D));
            }
            return c(z);
          case zt:
            return ((A = Zl(A)), Tt(z, b, A, D));
        }
        if (Yt(A)) return K(z, b, A, D);
        if (tt(A)) {
          if (((P = tt(A)), typeof P != 'function')) throw Error(f(150));
          return ((A = P.call(A)), lt(z, b, A, D));
        }
        if (typeof A.then == 'function') return Tt(z, b, yu(A), D);
        if (A.$$typeof === G) return Tt(z, b, ru(z, A), D);
        vu(z, A);
      }
      return (typeof A == 'string' && A !== '') || typeof A == 'number' || typeof A == 'bigint'
        ? ((A = '' + A),
          b !== null && b.tag === 6
            ? (l(z, b.sibling), (D = a(b, A)), (D.return = z), (z = D))
            : (l(z, b), (D = Vi(A, z.mode, D)), (D.return = z), (z = D)),
          c(z))
        : l(z, b);
    }
    return function (z, b, A, D) {
      try {
        ca = 0;
        var P = Tt(z, b, A, D);
        return ((xn = null), P);
      } catch (W) {
        if (W === Sn || W === mu) throw W;
        var vt = me(29, W, null, z.mode);
        return ((vt.lanes = D), (vt.return = z), vt);
      } finally {
      }
    };
  }
  var Jl = rs(!0),
    ds = rs(!1),
    dl = !1;
  function nc(t) {
    t.updateQueue = {
      baseState: t.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null,
    };
  }
  function ac(t, e) {
    ((t = t.updateQueue),
      e.updateQueue === t &&
        (e.updateQueue = {
          baseState: t.baseState,
          firstBaseUpdate: t.firstBaseUpdate,
          lastBaseUpdate: t.lastBaseUpdate,
          shared: t.shared,
          callbacks: null,
        }));
  }
  function ml(t) {
    return { lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function hl(t, e, l) {
    var n = t.updateQueue;
    if (n === null) return null;
    if (((n = n.shared), (pt & 2) !== 0)) {
      var a = n.pending;
      return (
        a === null ? (e.next = e) : ((e.next = a.next), (a.next = e)),
        (n.pending = e),
        (e = cu(t)),
        ko(t, null, l),
        e
      );
    }
    return (iu(t, n, e, l), cu(t));
  }
  function oa(t, e, l) {
    if (((e = e.updateQueue), e !== null && ((e = e.shared), (l & 4194048) !== 0))) {
      var n = e.lanes;
      ((n &= t.pendingLanes), (l |= n), (e.lanes = l), lo(t, l));
    }
  }
  function uc(t, e) {
    var l = t.updateQueue,
      n = t.alternate;
    if (n !== null && ((n = n.updateQueue), l === n)) {
      var a = null,
        u = null;
      if (((l = l.firstBaseUpdate), l !== null)) {
        do {
          var c = { lane: l.lane, tag: l.tag, payload: l.payload, callback: null, next: null };
          (u === null ? (a = u = c) : (u = u.next = c), (l = l.next));
        } while (l !== null);
        u === null ? (a = u = e) : (u = u.next = e);
      } else a = u = e;
      ((l = {
        baseState: n.baseState,
        firstBaseUpdate: a,
        lastBaseUpdate: u,
        shared: n.shared,
        callbacks: n.callbacks,
      }),
        (t.updateQueue = l));
      return;
    }
    ((t = l.lastBaseUpdate),
      t === null ? (l.firstBaseUpdate = e) : (t.next = e),
      (l.lastBaseUpdate = e));
  }
  var ic = !1;
  function sa() {
    if (ic) {
      var t = bn;
      if (t !== null) throw t;
    }
  }
  function ra(t, e, l, n) {
    ic = !1;
    var a = t.updateQueue;
    dl = !1;
    var u = a.firstBaseUpdate,
      c = a.lastBaseUpdate,
      r = a.shared.pending;
    if (r !== null) {
      a.shared.pending = null;
      var h = r,
        T = h.next;
      ((h.next = null), c === null ? (u = T) : (c.next = T), (c = h));
      var C = t.alternate;
      C !== null &&
        ((C = C.updateQueue),
        (r = C.lastBaseUpdate),
        r !== c && (r === null ? (C.firstBaseUpdate = T) : (r.next = T), (C.lastBaseUpdate = h)));
    }
    if (u !== null) {
      var U = a.baseState;
      ((c = 0), (C = T = h = null), (r = u));
      do {
        var _ = r.lane & -536870913,
          O = _ !== r.lane;
        if (O ? (dt & _) === _ : (n & _) === _) {
          (_ !== 0 && _ === pn && (ic = !0),
            C !== null &&
              (C = C.next =
                { lane: 0, tag: r.tag, payload: r.payload, callback: null, next: null }));
          t: {
            var K = t,
              lt = r;
            _ = e;
            var Tt = l;
            switch (lt.tag) {
              case 1:
                if (((K = lt.payload), typeof K == 'function')) {
                  U = K.call(Tt, U, _);
                  break t;
                }
                U = K;
                break t;
              case 3:
                K.flags = (K.flags & -65537) | 128;
              case 0:
                if (
                  ((K = lt.payload), (_ = typeof K == 'function' ? K.call(Tt, U, _) : K), _ == null)
                )
                  break t;
                U = E({}, U, _);
                break t;
              case 2:
                dl = !0;
            }
          }
          ((_ = r.callback),
            _ !== null &&
              ((t.flags |= 64),
              O && (t.flags |= 8192),
              (O = a.callbacks),
              O === null ? (a.callbacks = [_]) : O.push(_)));
        } else
          ((O = { lane: _, tag: r.tag, payload: r.payload, callback: r.callback, next: null }),
            C === null ? ((T = C = O), (h = U)) : (C = C.next = O),
            (c |= _));
        if (((r = r.next), r === null)) {
          if (((r = a.shared.pending), r === null)) break;
          ((O = r),
            (r = O.next),
            (O.next = null),
            (a.lastBaseUpdate = O),
            (a.shared.pending = null));
        }
      } while (!0);
      (C === null && (h = U),
        (a.baseState = h),
        (a.firstBaseUpdate = T),
        (a.lastBaseUpdate = C),
        u === null && (a.shared.lanes = 0),
        (bl |= c),
        (t.lanes = c),
        (t.memoizedState = U));
    }
  }
  function ms(t, e) {
    if (typeof t != 'function') throw Error(f(191, t));
    t.call(e);
  }
  function hs(t, e) {
    var l = t.callbacks;
    if (l !== null) for (t.callbacks = null, t = 0; t < l.length; t++) ms(l[t], e);
  }
  var zn = v(null),
    gu = v(0);
  function ys(t, e) {
    ((t = el), Q(gu, t), Q(zn, e), (el = t | e.baseLanes));
  }
  function cc() {
    (Q(gu, el), Q(zn, zn.current));
  }
  function fc() {
    ((el = gu.current), j(zn), j(gu));
  }
  var he = v(null),
    _e = null;
  function yl(t) {
    var e = t.alternate;
    (Q(Bt, Bt.current & 1),
      Q(he, t),
      _e === null && (e === null || zn.current !== null || e.memoizedState !== null) && (_e = t));
  }
  function oc(t) {
    (Q(Bt, Bt.current), Q(he, t), _e === null && (_e = t));
  }
  function vs(t) {
    t.tag === 22 ? (Q(Bt, Bt.current), Q(he, t), _e === null && (_e = t)) : vl();
  }
  function vl() {
    (Q(Bt, Bt.current), Q(he, he.current));
  }
  function ye(t) {
    (j(he), _e === t && (_e = null), j(Bt));
  }
  var Bt = v(0);
  function pu(t) {
    for (var e = t; e !== null; ) {
      if (e.tag === 13) {
        var l = e.memoizedState;
        if (l !== null && ((l = l.dehydrated), l === null || vf(l) || gf(l))) return e;
      } else if (
        e.tag === 19 &&
        (e.memoizedProps.revealOrder === 'forwards' ||
          e.memoizedProps.revealOrder === 'backwards' ||
          e.memoizedProps.revealOrder === 'unstable_legacy-backwards' ||
          e.memoizedProps.revealOrder === 'together')
      ) {
        if ((e.flags & 128) !== 0) return e;
      } else if (e.child !== null) {
        ((e.child.return = e), (e = e.child));
        continue;
      }
      if (e === t) break;
      for (; e.sibling === null; ) {
        if (e.return === null || e.return === t) return null;
        e = e.return;
      }
      ((e.sibling.return = e.return), (e = e.sibling));
    }
    return null;
  }
  var Je = 0,
    it = null,
    Et = null,
    Gt = null,
    bu = !1,
    En = !1,
    $l = !1,
    Su = 0,
    da = 0,
    An = null,
    r0 = 0;
  function jt() {
    throw Error(f(321));
  }
  function sc(t, e) {
    if (e === null) return !1;
    for (var l = 0; l < e.length && l < t.length; l++) if (!de(t[l], e[l])) return !1;
    return !0;
  }
  function rc(t, e, l, n, a, u) {
    return (
      (Je = u),
      (it = e),
      (e.memoizedState = null),
      (e.updateQueue = null),
      (e.lanes = 0),
      (N.H = t === null || t.memoizedState === null ? Ps : _c),
      ($l = !1),
      (u = l(n, a)),
      ($l = !1),
      En && (u = ps(e, l, n, a)),
      gs(t),
      u
    );
  }
  function gs(t) {
    N.H = ya;
    var e = Et !== null && Et.next !== null;
    if (((Je = 0), (Gt = Et = it = null), (bu = !1), (da = 0), (An = null), e)) throw Error(f(300));
    t === null || Lt || ((t = t.dependencies), t !== null && su(t) && (Lt = !0));
  }
  function ps(t, e, l, n) {
    it = t;
    var a = 0;
    do {
      if ((En && (An = null), (da = 0), (En = !1), 25 <= a)) throw Error(f(301));
      if (((a += 1), (Gt = Et = null), t.updateQueue != null)) {
        var u = t.updateQueue;
        ((u.lastEffect = null),
          (u.events = null),
          (u.stores = null),
          u.memoCache != null && (u.memoCache.index = 0));
      }
      ((N.H = tr), (u = e(l, n)));
    } while (En);
    return u;
  }
  function d0() {
    var t = N.H,
      e = t.useState()[0];
    return (
      (e = typeof e.then == 'function' ? ma(e) : e),
      (t = t.useState()[0]),
      (Et !== null ? Et.memoizedState : null) !== t && (it.flags |= 1024),
      e
    );
  }
  function dc() {
    var t = Su !== 0;
    return ((Su = 0), t);
  }
  function mc(t, e, l) {
    ((e.updateQueue = t.updateQueue), (e.flags &= -2053), (t.lanes &= ~l));
  }
  function hc(t) {
    if (bu) {
      for (t = t.memoizedState; t !== null; ) {
        var e = t.queue;
        (e !== null && (e.pending = null), (t = t.next));
      }
      bu = !1;
    }
    ((Je = 0), (Gt = Et = it = null), (En = !1), (da = Su = 0), (An = null));
  }
  function ee() {
    var t = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return (Gt === null ? (it.memoizedState = Gt = t) : (Gt = Gt.next = t), Gt);
  }
  function qt() {
    if (Et === null) {
      var t = it.alternate;
      t = t !== null ? t.memoizedState : null;
    } else t = Et.next;
    var e = Gt === null ? it.memoizedState : Gt.next;
    if (e !== null) ((Gt = e), (Et = t));
    else {
      if (t === null) throw it.alternate === null ? Error(f(467)) : Error(f(310));
      ((Et = t),
        (t = {
          memoizedState: Et.memoizedState,
          baseState: Et.baseState,
          baseQueue: Et.baseQueue,
          queue: Et.queue,
          next: null,
        }),
        Gt === null ? (it.memoizedState = Gt = t) : (Gt = Gt.next = t));
    }
    return Gt;
  }
  function xu() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function ma(t) {
    var e = da;
    return (
      (da += 1),
      An === null && (An = []),
      (t = fs(An, t, e)),
      (e = it),
      (Gt === null ? e.memoizedState : Gt.next) === null &&
        ((e = e.alternate), (N.H = e === null || e.memoizedState === null ? Ps : _c)),
      t
    );
  }
  function zu(t) {
    if (t !== null && typeof t == 'object') {
      if (typeof t.then == 'function') return ma(t);
      if (t.$$typeof === G) return Wt(t);
    }
    throw Error(f(438, String(t)));
  }
  function yc(t) {
    var e = null,
      l = it.updateQueue;
    if ((l !== null && (e = l.memoCache), e == null)) {
      var n = it.alternate;
      n !== null &&
        ((n = n.updateQueue),
        n !== null &&
          ((n = n.memoCache),
          n != null &&
            (e = {
              data: n.data.map(function (a) {
                return a.slice();
              }),
              index: 0,
            })));
    }
    if (
      (e == null && (e = { data: [], index: 0 }),
      l === null && ((l = xu()), (it.updateQueue = l)),
      (l.memoCache = e),
      (l = e.data[e.index]),
      l === void 0)
    )
      for (l = e.data[e.index] = Array(t), n = 0; n < t; n++) l[n] = Ot;
    return (e.index++, l);
  }
  function $e(t, e) {
    return typeof e == 'function' ? e(t) : e;
  }
  function Eu(t) {
    var e = qt();
    return vc(e, Et, t);
  }
  function vc(t, e, l) {
    var n = t.queue;
    if (n === null) throw Error(f(311));
    n.lastRenderedReducer = l;
    var a = t.baseQueue,
      u = n.pending;
    if (u !== null) {
      if (a !== null) {
        var c = a.next;
        ((a.next = u.next), (u.next = c));
      }
      ((e.baseQueue = a = u), (n.pending = null));
    }
    if (((u = t.baseState), a === null)) t.memoizedState = u;
    else {
      e = a.next;
      var r = (c = null),
        h = null,
        T = e,
        C = !1;
      do {
        var U = T.lane & -536870913;
        if (U !== T.lane ? (dt & U) === U : (Je & U) === U) {
          var _ = T.revertLane;
          if (_ === 0)
            (h !== null &&
              (h = h.next =
                {
                  lane: 0,
                  revertLane: 0,
                  gesture: null,
                  action: T.action,
                  hasEagerState: T.hasEagerState,
                  eagerState: T.eagerState,
                  next: null,
                }),
              U === pn && (C = !0));
          else if ((Je & _) === _) {
            ((T = T.next), _ === pn && (C = !0));
            continue;
          } else
            ((U = {
              lane: 0,
              revertLane: T.revertLane,
              gesture: null,
              action: T.action,
              hasEagerState: T.hasEagerState,
              eagerState: T.eagerState,
              next: null,
            }),
              h === null ? ((r = h = U), (c = u)) : (h = h.next = U),
              (it.lanes |= _),
              (bl |= _));
          ((U = T.action), $l && l(u, U), (u = T.hasEagerState ? T.eagerState : l(u, U)));
        } else
          ((_ = {
            lane: U,
            revertLane: T.revertLane,
            gesture: T.gesture,
            action: T.action,
            hasEagerState: T.hasEagerState,
            eagerState: T.eagerState,
            next: null,
          }),
            h === null ? ((r = h = _), (c = u)) : (h = h.next = _),
            (it.lanes |= U),
            (bl |= U));
        T = T.next;
      } while (T !== null && T !== e);
      if (
        (h === null ? (c = u) : (h.next = r),
        !de(u, t.memoizedState) && ((Lt = !0), C && ((l = bn), l !== null)))
      )
        throw l;
      ((t.memoizedState = u), (t.baseState = c), (t.baseQueue = h), (n.lastRenderedState = u));
    }
    return (a === null && (n.lanes = 0), [t.memoizedState, n.dispatch]);
  }
  function gc(t) {
    var e = qt(),
      l = e.queue;
    if (l === null) throw Error(f(311));
    l.lastRenderedReducer = t;
    var n = l.dispatch,
      a = l.pending,
      u = e.memoizedState;
    if (a !== null) {
      l.pending = null;
      var c = (a = a.next);
      do ((u = t(u, c.action)), (c = c.next));
      while (c !== a);
      (de(u, e.memoizedState) || (Lt = !0),
        (e.memoizedState = u),
        e.baseQueue === null && (e.baseState = u),
        (l.lastRenderedState = u));
    }
    return [u, n];
  }
  function bs(t, e, l) {
    var n = it,
      a = qt(),
      u = ht;
    if (u) {
      if (l === void 0) throw Error(f(407));
      l = l();
    } else l = e();
    var c = !de((Et || a).memoizedState, l);
    if (
      (c && ((a.memoizedState = l), (Lt = !0)),
      (a = a.queue),
      Sc(zs.bind(null, n, a, t), [t]),
      a.getSnapshot !== e || c || (Gt !== null && Gt.memoizedState.tag & 1))
    ) {
      if (
        ((n.flags |= 2048),
        Tn(9, { destroy: void 0 }, xs.bind(null, n, a, l, e), null),
        _t === null)
      )
        throw Error(f(349));
      u || (Je & 127) !== 0 || Ss(n, e, l);
    }
    return l;
  }
  function Ss(t, e, l) {
    ((t.flags |= 16384),
      (t = { getSnapshot: e, value: l }),
      (e = it.updateQueue),
      e === null
        ? ((e = xu()), (it.updateQueue = e), (e.stores = [t]))
        : ((l = e.stores), l === null ? (e.stores = [t]) : l.push(t)));
  }
  function xs(t, e, l, n) {
    ((e.value = l), (e.getSnapshot = n), Es(e) && As(t));
  }
  function zs(t, e, l) {
    return l(function () {
      Es(e) && As(t);
    });
  }
  function Es(t) {
    var e = t.getSnapshot;
    t = t.value;
    try {
      var l = e();
      return !de(t, l);
    } catch {
      return !0;
    }
  }
  function As(t) {
    var e = wl(t, 2);
    e !== null && fe(e, t, 2);
  }
  function pc(t) {
    var e = ee();
    if (typeof t == 'function') {
      var l = t;
      if (((t = l()), $l)) {
        ul(!0);
        try {
          l();
        } finally {
          ul(!1);
        }
      }
    }
    return (
      (e.memoizedState = e.baseState = t),
      (e.queue = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: $e,
        lastRenderedState: t,
      }),
      e
    );
  }
  function Ts(t, e, l, n) {
    return ((t.baseState = l), vc(t, Et, typeof n == 'function' ? n : $e));
  }
  function m0(t, e, l, n, a) {
    if (_u(t)) throw Error(f(485));
    if (((t = e.action), t !== null)) {
      var u = {
        payload: a,
        action: t,
        next: null,
        isTransition: !0,
        status: 'pending',
        value: null,
        reason: null,
        listeners: [],
        then: function (c) {
          u.listeners.push(c);
        },
      };
      (N.T !== null ? l(!0) : (u.isTransition = !1),
        n(u),
        (l = e.pending),
        l === null
          ? ((u.next = e.pending = u), _s(e, u))
          : ((u.next = l.next), (e.pending = l.next = u)));
    }
  }
  function _s(t, e) {
    var l = e.action,
      n = e.payload,
      a = t.state;
    if (e.isTransition) {
      var u = N.T,
        c = {};
      N.T = c;
      try {
        var r = l(a, n),
          h = N.S;
        (h !== null && h(c, r), Ms(t, e, r));
      } catch (T) {
        bc(t, e, T);
      } finally {
        (u !== null && c.types !== null && (u.types = c.types), (N.T = u));
      }
    } else
      try {
        ((u = l(a, n)), Ms(t, e, u));
      } catch (T) {
        bc(t, e, T);
      }
  }
  function Ms(t, e, l) {
    l !== null && typeof l == 'object' && typeof l.then == 'function'
      ? l.then(
          function (n) {
            Os(t, e, n);
          },
          function (n) {
            return bc(t, e, n);
          },
        )
      : Os(t, e, l);
  }
  function Os(t, e, l) {
    ((e.status = 'fulfilled'),
      (e.value = l),
      Rs(e),
      (t.state = l),
      (e = t.pending),
      e !== null &&
        ((l = e.next), l === e ? (t.pending = null) : ((l = l.next), (e.next = l), _s(t, l))));
  }
  function bc(t, e, l) {
    var n = t.pending;
    if (((t.pending = null), n !== null)) {
      n = n.next;
      do ((e.status = 'rejected'), (e.reason = l), Rs(e), (e = e.next));
      while (e !== n);
    }
    t.action = null;
  }
  function Rs(t) {
    t = t.listeners;
    for (var e = 0; e < t.length; e++) (0, t[e])();
  }
  function Ns(t, e) {
    return e;
  }
  function Cs(t, e) {
    if (ht) {
      var l = _t.formState;
      if (l !== null) {
        t: {
          var n = it;
          if (ht) {
            if (Rt) {
              e: {
                for (var a = Rt, u = Te; a.nodeType !== 8; ) {
                  if (!u) {
                    a = null;
                    break e;
                  }
                  if (((a = Me(a.nextSibling)), a === null)) {
                    a = null;
                    break e;
                  }
                }
                ((u = a.data), (a = u === 'F!' || u === 'F' ? a : null));
              }
              if (a) {
                ((Rt = Me(a.nextSibling)), (n = a.data === 'F!'));
                break t;
              }
            }
            sl(n);
          }
          n = !1;
        }
        n && (e = l[0]);
      }
    }
    return (
      (l = ee()),
      (l.memoizedState = l.baseState = e),
      (n = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Ns,
        lastRenderedState: e,
      }),
      (l.queue = n),
      (l = Ws.bind(null, it, n)),
      (n.dispatch = l),
      (n = pc(!1)),
      (u = Tc.bind(null, it, !1, n.queue)),
      (n = ee()),
      (a = { state: e, dispatch: null, action: t, pending: null }),
      (n.queue = a),
      (l = m0.bind(null, it, a, u, l)),
      (a.dispatch = l),
      (n.memoizedState = t),
      [e, l, !1]
    );
  }
  function Ds(t) {
    var e = qt();
    return js(e, Et, t);
  }
  function js(t, e, l) {
    if (
      ((e = vc(t, e, Ns)[0]),
      (t = Eu($e)[0]),
      typeof e == 'object' && e !== null && typeof e.then == 'function')
    )
      try {
        var n = ma(e);
      } catch (c) {
        throw c === Sn ? mu : c;
      }
    else n = e;
    e = qt();
    var a = e.queue,
      u = a.dispatch;
    return (
      l !== e.memoizedState &&
        ((it.flags |= 2048), Tn(9, { destroy: void 0 }, h0.bind(null, a, l), null)),
      [n, u, t]
    );
  }
  function h0(t, e) {
    t.action = e;
  }
  function Us(t) {
    var e = qt(),
      l = Et;
    if (l !== null) return js(e, l, t);
    (qt(), (e = e.memoizedState), (l = qt()));
    var n = l.queue.dispatch;
    return ((l.memoizedState = t), [e, n, !1]);
  }
  function Tn(t, e, l, n) {
    return (
      (t = { tag: t, create: l, deps: n, inst: e, next: null }),
      (e = it.updateQueue),
      e === null && ((e = xu()), (it.updateQueue = e)),
      (l = e.lastEffect),
      l === null
        ? (e.lastEffect = t.next = t)
        : ((n = l.next), (l.next = t), (t.next = n), (e.lastEffect = t)),
      t
    );
  }
  function Hs() {
    return qt().memoizedState;
  }
  function Au(t, e, l, n) {
    var a = ee();
    ((it.flags |= t),
      (a.memoizedState = Tn(1 | e, { destroy: void 0 }, l, n === void 0 ? null : n)));
  }
  function Tu(t, e, l, n) {
    var a = qt();
    n = n === void 0 ? null : n;
    var u = a.memoizedState.inst;
    Et !== null && n !== null && sc(n, Et.memoizedState.deps)
      ? (a.memoizedState = Tn(e, u, l, n))
      : ((it.flags |= t), (a.memoizedState = Tn(1 | e, u, l, n)));
  }
  function Bs(t, e) {
    Au(8390656, 8, t, e);
  }
  function Sc(t, e) {
    Tu(2048, 8, t, e);
  }
  function y0(t) {
    it.flags |= 4;
    var e = it.updateQueue;
    if (e === null) ((e = xu()), (it.updateQueue = e), (e.events = [t]));
    else {
      var l = e.events;
      l === null ? (e.events = [t]) : l.push(t);
    }
  }
  function qs(t) {
    var e = qt().memoizedState;
    return (
      y0({ ref: e, nextImpl: t }),
      function () {
        if ((pt & 2) !== 0) throw Error(f(440));
        return e.impl.apply(void 0, arguments);
      }
    );
  }
  function Ys(t, e) {
    return Tu(4, 2, t, e);
  }
  function ws(t, e) {
    return Tu(4, 4, t, e);
  }
  function Gs(t, e) {
    if (typeof e == 'function') {
      t = t();
      var l = e(t);
      return function () {
        typeof l == 'function' ? l() : e(null);
      };
    }
    if (e != null)
      return (
        (t = t()),
        (e.current = t),
        function () {
          e.current = null;
        }
      );
  }
  function Ls(t, e, l) {
    ((l = l != null ? l.concat([t]) : null), Tu(4, 4, Gs.bind(null, e, t), l));
  }
  function xc() {}
  function Xs(t, e) {
    var l = qt();
    e = e === void 0 ? null : e;
    var n = l.memoizedState;
    return e !== null && sc(e, n[1]) ? n[0] : ((l.memoizedState = [t, e]), t);
  }
  function Qs(t, e) {
    var l = qt();
    e = e === void 0 ? null : e;
    var n = l.memoizedState;
    if (e !== null && sc(e, n[1])) return n[0];
    if (((n = t()), $l)) {
      ul(!0);
      try {
        t();
      } finally {
        ul(!1);
      }
    }
    return ((l.memoizedState = [n, e]), n);
  }
  function zc(t, e, l) {
    return l === void 0 || ((Je & 1073741824) !== 0 && (dt & 261930) === 0)
      ? (t.memoizedState = e)
      : ((t.memoizedState = l), (t = Vr()), (it.lanes |= t), (bl |= t), l);
  }
  function Vs(t, e, l, n) {
    return de(l, e)
      ? l
      : zn.current !== null
        ? ((t = zc(t, l, n)), de(t, e) || (Lt = !0), t)
        : (Je & 42) === 0 || ((Je & 1073741824) !== 0 && (dt & 261930) === 0)
          ? ((Lt = !0), (t.memoizedState = l))
          : ((t = Vr()), (it.lanes |= t), (bl |= t), e);
  }
  function Zs(t, e, l, n, a) {
    var u = w.p;
    w.p = u !== 0 && 8 > u ? u : 8;
    var c = N.T,
      r = {};
    ((N.T = r), Tc(t, !1, e, l));
    try {
      var h = a(),
        T = N.S;
      if (
        (T !== null && T(r, h), h !== null && typeof h == 'object' && typeof h.then == 'function')
      ) {
        var C = s0(h, n);
        ha(t, e, C, pe(t));
      } else ha(t, e, n, pe(t));
    } catch (U) {
      ha(t, e, { then: function () {}, status: 'rejected', reason: U }, pe());
    } finally {
      ((w.p = u), c !== null && r.types !== null && (c.types = r.types), (N.T = c));
    }
  }
  function v0() {}
  function Ec(t, e, l, n) {
    if (t.tag !== 5) throw Error(f(476));
    var a = Ks(t).queue;
    Zs(
      t,
      a,
      e,
      R,
      l === null
        ? v0
        : function () {
            return (Js(t), l(n));
          },
    );
  }
  function Ks(t) {
    var e = t.memoizedState;
    if (e !== null) return e;
    e = {
      memoizedState: R,
      baseState: R,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: $e,
        lastRenderedState: R,
      },
      next: null,
    };
    var l = {};
    return (
      (e.next = {
        memoizedState: l,
        baseState: l,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: $e,
          lastRenderedState: l,
        },
        next: null,
      }),
      (t.memoizedState = e),
      (t = t.alternate),
      t !== null && (t.memoizedState = e),
      e
    );
  }
  function Js(t) {
    var e = Ks(t);
    (e.next === null && (e = t.alternate.memoizedState), ha(t, e.next.queue, {}, pe()));
  }
  function Ac() {
    return Wt(Ca);
  }
  function $s() {
    return qt().memoizedState;
  }
  function ks() {
    return qt().memoizedState;
  }
  function g0(t) {
    for (var e = t.return; e !== null; ) {
      switch (e.tag) {
        case 24:
        case 3:
          var l = pe();
          t = ml(l);
          var n = hl(e, t, l);
          (n !== null && (fe(n, e, l), oa(n, e, l)), (e = { cache: Pi() }), (t.payload = e));
          return;
      }
      e = e.return;
    }
  }
  function p0(t, e, l) {
    var n = pe();
    ((l = {
      lane: n,
      revertLane: 0,
      gesture: null,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    }),
      _u(t) ? Fs(e, l) : ((l = Xi(t, e, l, n)), l !== null && (fe(l, t, n), Is(l, e, n))));
  }
  function Ws(t, e, l) {
    var n = pe();
    ha(t, e, l, n);
  }
  function ha(t, e, l, n) {
    var a = {
      lane: n,
      revertLane: 0,
      gesture: null,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    };
    if (_u(t)) Fs(e, a);
    else {
      var u = t.alternate;
      if (
        t.lanes === 0 &&
        (u === null || u.lanes === 0) &&
        ((u = e.lastRenderedReducer), u !== null)
      )
        try {
          var c = e.lastRenderedState,
            r = u(c, l);
          if (((a.hasEagerState = !0), (a.eagerState = r), de(r, c)))
            return (iu(t, e, a, 0), _t === null && uu(), !1);
        } catch {
        } finally {
        }
      if (((l = Xi(t, e, a, n)), l !== null)) return (fe(l, t, n), Is(l, e, n), !0);
    }
    return !1;
  }
  function Tc(t, e, l, n) {
    if (
      ((n = {
        lane: 2,
        revertLane: nf(),
        gesture: null,
        action: n,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      }),
      _u(t))
    ) {
      if (e) throw Error(f(479));
    } else ((e = Xi(t, l, n, 2)), e !== null && fe(e, t, 2));
  }
  function _u(t) {
    var e = t.alternate;
    return t === it || (e !== null && e === it);
  }
  function Fs(t, e) {
    En = bu = !0;
    var l = t.pending;
    (l === null ? (e.next = e) : ((e.next = l.next), (l.next = e)), (t.pending = e));
  }
  function Is(t, e, l) {
    if ((l & 4194048) !== 0) {
      var n = e.lanes;
      ((n &= t.pendingLanes), (l |= n), (e.lanes = l), lo(t, l));
    }
  }
  var ya = {
    readContext: Wt,
    use: zu,
    useCallback: jt,
    useContext: jt,
    useEffect: jt,
    useImperativeHandle: jt,
    useLayoutEffect: jt,
    useInsertionEffect: jt,
    useMemo: jt,
    useReducer: jt,
    useRef: jt,
    useState: jt,
    useDebugValue: jt,
    useDeferredValue: jt,
    useTransition: jt,
    useSyncExternalStore: jt,
    useId: jt,
    useHostTransitionStatus: jt,
    useFormState: jt,
    useActionState: jt,
    useOptimistic: jt,
    useMemoCache: jt,
    useCacheRefresh: jt,
  };
  ya.useEffectEvent = jt;
  var Ps = {
      readContext: Wt,
      use: zu,
      useCallback: function (t, e) {
        return ((ee().memoizedState = [t, e === void 0 ? null : e]), t);
      },
      useContext: Wt,
      useEffect: Bs,
      useImperativeHandle: function (t, e, l) {
        ((l = l != null ? l.concat([t]) : null), Au(4194308, 4, Gs.bind(null, e, t), l));
      },
      useLayoutEffect: function (t, e) {
        return Au(4194308, 4, t, e);
      },
      useInsertionEffect: function (t, e) {
        Au(4, 2, t, e);
      },
      useMemo: function (t, e) {
        var l = ee();
        e = e === void 0 ? null : e;
        var n = t();
        if ($l) {
          ul(!0);
          try {
            t();
          } finally {
            ul(!1);
          }
        }
        return ((l.memoizedState = [n, e]), n);
      },
      useReducer: function (t, e, l) {
        var n = ee();
        if (l !== void 0) {
          var a = l(e);
          if ($l) {
            ul(!0);
            try {
              l(e);
            } finally {
              ul(!1);
            }
          }
        } else a = e;
        return (
          (n.memoizedState = n.baseState = a),
          (t = {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: t,
            lastRenderedState: a,
          }),
          (n.queue = t),
          (t = t.dispatch = p0.bind(null, it, t)),
          [n.memoizedState, t]
        );
      },
      useRef: function (t) {
        var e = ee();
        return ((t = { current: t }), (e.memoizedState = t));
      },
      useState: function (t) {
        t = pc(t);
        var e = t.queue,
          l = Ws.bind(null, it, e);
        return ((e.dispatch = l), [t.memoizedState, l]);
      },
      useDebugValue: xc,
      useDeferredValue: function (t, e) {
        var l = ee();
        return zc(l, t, e);
      },
      useTransition: function () {
        var t = pc(!1);
        return ((t = Zs.bind(null, it, t.queue, !0, !1)), (ee().memoizedState = t), [!1, t]);
      },
      useSyncExternalStore: function (t, e, l) {
        var n = it,
          a = ee();
        if (ht) {
          if (l === void 0) throw Error(f(407));
          l = l();
        } else {
          if (((l = e()), _t === null)) throw Error(f(349));
          (dt & 127) !== 0 || Ss(n, e, l);
        }
        a.memoizedState = l;
        var u = { value: l, getSnapshot: e };
        return (
          (a.queue = u),
          Bs(zs.bind(null, n, u, t), [t]),
          (n.flags |= 2048),
          Tn(9, { destroy: void 0 }, xs.bind(null, n, u, l, e), null),
          l
        );
      },
      useId: function () {
        var t = ee(),
          e = _t.identifierPrefix;
        if (ht) {
          var l = Be,
            n = He;
          ((l = (n & ~(1 << (32 - re(n) - 1))).toString(32) + l),
            (e = '_' + e + 'R_' + l),
            (l = Su++),
            0 < l && (e += 'H' + l.toString(32)),
            (e += '_'));
        } else ((l = r0++), (e = '_' + e + 'r_' + l.toString(32) + '_'));
        return (t.memoizedState = e);
      },
      useHostTransitionStatus: Ac,
      useFormState: Cs,
      useActionState: Cs,
      useOptimistic: function (t) {
        var e = ee();
        e.memoizedState = e.baseState = t;
        var l = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: null,
          lastRenderedState: null,
        };
        return ((e.queue = l), (e = Tc.bind(null, it, !0, l)), (l.dispatch = e), [t, e]);
      },
      useMemoCache: yc,
      useCacheRefresh: function () {
        return (ee().memoizedState = g0.bind(null, it));
      },
      useEffectEvent: function (t) {
        var e = ee(),
          l = { impl: t };
        return (
          (e.memoizedState = l),
          function () {
            if ((pt & 2) !== 0) throw Error(f(440));
            return l.impl.apply(void 0, arguments);
          }
        );
      },
    },
    _c = {
      readContext: Wt,
      use: zu,
      useCallback: Xs,
      useContext: Wt,
      useEffect: Sc,
      useImperativeHandle: Ls,
      useInsertionEffect: Ys,
      useLayoutEffect: ws,
      useMemo: Qs,
      useReducer: Eu,
      useRef: Hs,
      useState: function () {
        return Eu($e);
      },
      useDebugValue: xc,
      useDeferredValue: function (t, e) {
        var l = qt();
        return Vs(l, Et.memoizedState, t, e);
      },
      useTransition: function () {
        var t = Eu($e)[0],
          e = qt().memoizedState;
        return [typeof t == 'boolean' ? t : ma(t), e];
      },
      useSyncExternalStore: bs,
      useId: $s,
      useHostTransitionStatus: Ac,
      useFormState: Ds,
      useActionState: Ds,
      useOptimistic: function (t, e) {
        var l = qt();
        return Ts(l, Et, t, e);
      },
      useMemoCache: yc,
      useCacheRefresh: ks,
    };
  _c.useEffectEvent = qs;
  var tr = {
    readContext: Wt,
    use: zu,
    useCallback: Xs,
    useContext: Wt,
    useEffect: Sc,
    useImperativeHandle: Ls,
    useInsertionEffect: Ys,
    useLayoutEffect: ws,
    useMemo: Qs,
    useReducer: gc,
    useRef: Hs,
    useState: function () {
      return gc($e);
    },
    useDebugValue: xc,
    useDeferredValue: function (t, e) {
      var l = qt();
      return Et === null ? zc(l, t, e) : Vs(l, Et.memoizedState, t, e);
    },
    useTransition: function () {
      var t = gc($e)[0],
        e = qt().memoizedState;
      return [typeof t == 'boolean' ? t : ma(t), e];
    },
    useSyncExternalStore: bs,
    useId: $s,
    useHostTransitionStatus: Ac,
    useFormState: Us,
    useActionState: Us,
    useOptimistic: function (t, e) {
      var l = qt();
      return Et !== null ? Ts(l, Et, t, e) : ((l.baseState = t), [t, l.queue.dispatch]);
    },
    useMemoCache: yc,
    useCacheRefresh: ks,
  };
  tr.useEffectEvent = qs;
  function Mc(t, e, l, n) {
    ((e = t.memoizedState),
      (l = l(n, e)),
      (l = l == null ? e : E({}, e, l)),
      (t.memoizedState = l),
      t.lanes === 0 && (t.updateQueue.baseState = l));
  }
  var Oc = {
    enqueueSetState: function (t, e, l) {
      t = t._reactInternals;
      var n = pe(),
        a = ml(n);
      ((a.payload = e),
        l != null && (a.callback = l),
        (e = hl(t, a, n)),
        e !== null && (fe(e, t, n), oa(e, t, n)));
    },
    enqueueReplaceState: function (t, e, l) {
      t = t._reactInternals;
      var n = pe(),
        a = ml(n);
      ((a.tag = 1),
        (a.payload = e),
        l != null && (a.callback = l),
        (e = hl(t, a, n)),
        e !== null && (fe(e, t, n), oa(e, t, n)));
    },
    enqueueForceUpdate: function (t, e) {
      t = t._reactInternals;
      var l = pe(),
        n = ml(l);
      ((n.tag = 2),
        e != null && (n.callback = e),
        (e = hl(t, n, l)),
        e !== null && (fe(e, t, l), oa(e, t, l)));
    },
  };
  function er(t, e, l, n, a, u, c) {
    return (
      (t = t.stateNode),
      typeof t.shouldComponentUpdate == 'function'
        ? t.shouldComponentUpdate(n, u, c)
        : e.prototype && e.prototype.isPureReactComponent
          ? !ea(l, n) || !ea(a, u)
          : !0
    );
  }
  function lr(t, e, l, n) {
    ((t = e.state),
      typeof e.componentWillReceiveProps == 'function' && e.componentWillReceiveProps(l, n),
      typeof e.UNSAFE_componentWillReceiveProps == 'function' &&
        e.UNSAFE_componentWillReceiveProps(l, n),
      e.state !== t && Oc.enqueueReplaceState(e, e.state, null));
  }
  function kl(t, e) {
    var l = e;
    if ('ref' in e) {
      l = {};
      for (var n in e) n !== 'ref' && (l[n] = e[n]);
    }
    if ((t = t.defaultProps)) {
      l === e && (l = E({}, l));
      for (var a in t) l[a] === void 0 && (l[a] = t[a]);
    }
    return l;
  }
  function nr(t) {
    au(t);
  }
  function ar(t) {
    console.error(t);
  }
  function ur(t) {
    au(t);
  }
  function Mu(t, e) {
    try {
      var l = t.onUncaughtError;
      l(e.value, { componentStack: e.stack });
    } catch (n) {
      setTimeout(function () {
        throw n;
      });
    }
  }
  function ir(t, e, l) {
    try {
      var n = t.onCaughtError;
      n(l.value, { componentStack: l.stack, errorBoundary: e.tag === 1 ? e.stateNode : null });
    } catch (a) {
      setTimeout(function () {
        throw a;
      });
    }
  }
  function Rc(t, e, l) {
    return (
      (l = ml(l)),
      (l.tag = 3),
      (l.payload = { element: null }),
      (l.callback = function () {
        Mu(t, e);
      }),
      l
    );
  }
  function cr(t) {
    return ((t = ml(t)), (t.tag = 3), t);
  }
  function fr(t, e, l, n) {
    var a = l.type.getDerivedStateFromError;
    if (typeof a == 'function') {
      var u = n.value;
      ((t.payload = function () {
        return a(u);
      }),
        (t.callback = function () {
          ir(e, l, n);
        }));
    }
    var c = l.stateNode;
    c !== null &&
      typeof c.componentDidCatch == 'function' &&
      (t.callback = function () {
        (ir(e, l, n),
          typeof a != 'function' && (Sl === null ? (Sl = new Set([this])) : Sl.add(this)));
        var r = n.stack;
        this.componentDidCatch(n.value, { componentStack: r !== null ? r : '' });
      });
  }
  function b0(t, e, l, n, a) {
    if (((l.flags |= 32768), n !== null && typeof n == 'object' && typeof n.then == 'function')) {
      if (((e = l.alternate), e !== null && gn(e, l, a, !0), (l = he.current), l !== null)) {
        switch (l.tag) {
          case 31:
          case 13:
            return (
              _e === null ? wu() : l.alternate === null && Ut === 0 && (Ut = 3),
              (l.flags &= -257),
              (l.flags |= 65536),
              (l.lanes = a),
              n === hu
                ? (l.flags |= 16384)
                : ((e = l.updateQueue),
                  e === null ? (l.updateQueue = new Set([n])) : e.add(n),
                  tf(t, n, a)),
              !1
            );
          case 22:
            return (
              (l.flags |= 65536),
              n === hu
                ? (l.flags |= 16384)
                : ((e = l.updateQueue),
                  e === null
                    ? ((e = { transitions: null, markerInstances: null, retryQueue: new Set([n]) }),
                      (l.updateQueue = e))
                    : ((l = e.retryQueue), l === null ? (e.retryQueue = new Set([n])) : l.add(n)),
                  tf(t, n, a)),
              !1
            );
        }
        throw Error(f(435, l.tag));
      }
      return (tf(t, n, a), wu(), !1);
    }
    if (ht)
      return (
        (e = he.current),
        e !== null
          ? ((e.flags & 65536) === 0 && (e.flags |= 256),
            (e.flags |= 65536),
            (e.lanes = a),
            n !== $i && ((t = Error(f(422), { cause: n })), aa(ze(t, l))))
          : (n !== $i && ((e = Error(f(423), { cause: n })), aa(ze(e, l))),
            (t = t.current.alternate),
            (t.flags |= 65536),
            (a &= -a),
            (t.lanes |= a),
            (n = ze(n, l)),
            (a = Rc(t.stateNode, n, a)),
            uc(t, a),
            Ut !== 4 && (Ut = 2)),
        !1
      );
    var u = Error(f(520), { cause: n });
    if (((u = ze(u, l)), Ea === null ? (Ea = [u]) : Ea.push(u), Ut !== 4 && (Ut = 2), e === null))
      return !0;
    ((n = ze(n, l)), (l = e));
    do {
      switch (l.tag) {
        case 3:
          return (
            (l.flags |= 65536),
            (t = a & -a),
            (l.lanes |= t),
            (t = Rc(l.stateNode, n, t)),
            uc(l, t),
            !1
          );
        case 1:
          if (
            ((e = l.type),
            (u = l.stateNode),
            (l.flags & 128) === 0 &&
              (typeof e.getDerivedStateFromError == 'function' ||
                (u !== null &&
                  typeof u.componentDidCatch == 'function' &&
                  (Sl === null || !Sl.has(u)))))
          )
            return (
              (l.flags |= 65536),
              (a &= -a),
              (l.lanes |= a),
              (a = cr(a)),
              fr(a, t, l, n),
              uc(l, a),
              !1
            );
      }
      l = l.return;
    } while (l !== null);
    return !1;
  }
  var Nc = Error(f(461)),
    Lt = !1;
  function Ft(t, e, l, n) {
    e.child = t === null ? ds(e, null, l, n) : Jl(e, t.child, l, n);
  }
  function or(t, e, l, n, a) {
    l = l.render;
    var u = e.ref;
    if ('ref' in n) {
      var c = {};
      for (var r in n) r !== 'ref' && (c[r] = n[r]);
    } else c = n;
    return (
      Ql(e),
      (n = rc(t, e, l, c, u, a)),
      (r = dc()),
      t !== null && !Lt
        ? (mc(t, e, a), ke(t, e, a))
        : (ht && r && Ki(e), (e.flags |= 1), Ft(t, e, n, a), e.child)
    );
  }
  function sr(t, e, l, n, a) {
    if (t === null) {
      var u = l.type;
      return typeof u == 'function' && !Qi(u) && u.defaultProps === void 0 && l.compare === null
        ? ((e.tag = 15), (e.type = u), rr(t, e, u, n, a))
        : ((t = fu(l.type, null, n, e, e.mode, a)), (t.ref = e.ref), (t.return = e), (e.child = t));
    }
    if (((u = t.child), !Yc(t, a))) {
      var c = u.memoizedProps;
      if (((l = l.compare), (l = l !== null ? l : ea), l(c, n) && t.ref === e.ref))
        return ke(t, e, a);
    }
    return ((e.flags |= 1), (t = Qe(u, n)), (t.ref = e.ref), (t.return = e), (e.child = t));
  }
  function rr(t, e, l, n, a) {
    if (t !== null) {
      var u = t.memoizedProps;
      if (ea(u, n) && t.ref === e.ref)
        if (((Lt = !1), (e.pendingProps = n = u), Yc(t, a))) (t.flags & 131072) !== 0 && (Lt = !0);
        else return ((e.lanes = t.lanes), ke(t, e, a));
    }
    return Cc(t, e, l, n, a);
  }
  function dr(t, e, l, n) {
    var a = n.children,
      u = t !== null ? t.memoizedState : null;
    if (
      (t === null &&
        e.stateNode === null &&
        (e.stateNode = {
          _visibility: 1,
          _pendingMarkers: null,
          _retryCache: null,
          _transitions: null,
        }),
      n.mode === 'hidden')
    ) {
      if ((e.flags & 128) !== 0) {
        if (((u = u !== null ? u.baseLanes | l : l), t !== null)) {
          for (n = e.child = t.child, a = 0; n !== null; )
            ((a = a | n.lanes | n.childLanes), (n = n.sibling));
          n = a & ~u;
        } else ((n = 0), (e.child = null));
        return mr(t, e, u, l, n);
      }
      if ((l & 536870912) !== 0)
        ((e.memoizedState = { baseLanes: 0, cachePool: null }),
          t !== null && du(e, u !== null ? u.cachePool : null),
          u !== null ? ys(e, u) : cc(),
          vs(e));
      else return ((n = e.lanes = 536870912), mr(t, e, u !== null ? u.baseLanes | l : l, l, n));
    } else
      u !== null
        ? (du(e, u.cachePool), ys(e, u), vl(), (e.memoizedState = null))
        : (t !== null && du(e, null), cc(), vl());
    return (Ft(t, e, a, l), e.child);
  }
  function va(t, e) {
    return (
      (t !== null && t.tag === 22) ||
        e.stateNode !== null ||
        (e.stateNode = {
          _visibility: 1,
          _pendingMarkers: null,
          _retryCache: null,
          _transitions: null,
        }),
      e.sibling
    );
  }
  function mr(t, e, l, n, a) {
    var u = ec();
    return (
      (u = u === null ? null : { parent: wt._currentValue, pool: u }),
      (e.memoizedState = { baseLanes: l, cachePool: u }),
      t !== null && du(e, null),
      cc(),
      vs(e),
      t !== null && gn(t, e, n, !0),
      (e.childLanes = a),
      null
    );
  }
  function Ou(t, e) {
    return (
      (e = Nu({ mode: e.mode, children: e.children }, t.mode)),
      (e.ref = t.ref),
      (t.child = e),
      (e.return = t),
      e
    );
  }
  function hr(t, e, l) {
    return (
      Jl(e, t.child, null, l),
      (t = Ou(e, e.pendingProps)),
      (t.flags |= 2),
      ye(e),
      (e.memoizedState = null),
      t
    );
  }
  function S0(t, e, l) {
    var n = e.pendingProps,
      a = (e.flags & 128) !== 0;
    if (((e.flags &= -129), t === null)) {
      if (ht) {
        if (n.mode === 'hidden') return ((t = Ou(e, n)), (e.lanes = 536870912), va(null, t));
        if (
          (oc(e),
          (t = Rt)
            ? ((t = _d(t, Te)),
              (t = t !== null && t.data === '&' ? t : null),
              t !== null &&
                ((e.memoizedState = {
                  dehydrated: t,
                  treeContext: fl !== null ? { id: He, overflow: Be } : null,
                  retryLane: 536870912,
                  hydrationErrors: null,
                }),
                (l = Fo(t)),
                (l.return = e),
                (e.child = l),
                (kt = e),
                (Rt = null)))
            : (t = null),
          t === null)
        )
          throw sl(e);
        return ((e.lanes = 536870912), null);
      }
      return Ou(e, n);
    }
    var u = t.memoizedState;
    if (u !== null) {
      var c = u.dehydrated;
      if ((oc(e), a))
        if (e.flags & 256) ((e.flags &= -257), (e = hr(t, e, l)));
        else if (e.memoizedState !== null) ((e.child = t.child), (e.flags |= 128), (e = null));
        else throw Error(f(558));
      else if ((Lt || gn(t, e, l, !1), (a = (l & t.childLanes) !== 0), Lt || a)) {
        if (((n = _t), n !== null && ((c = no(n, l)), c !== 0 && c !== u.retryLane)))
          throw ((u.retryLane = c), wl(t, c), fe(n, t, c), Nc);
        (wu(), (e = hr(t, e, l)));
      } else
        ((t = u.treeContext),
          (Rt = Me(c.nextSibling)),
          (kt = e),
          (ht = !0),
          (ol = null),
          (Te = !1),
          t !== null && ts(e, t),
          (e = Ou(e, n)),
          (e.flags |= 4096));
      return e;
    }
    return (
      (t = Qe(t.child, { mode: n.mode, children: n.children })),
      (t.ref = e.ref),
      (e.child = t),
      (t.return = e),
      t
    );
  }
  function Ru(t, e) {
    var l = e.ref;
    if (l === null) t !== null && t.ref !== null && (e.flags |= 4194816);
    else {
      if (typeof l != 'function' && typeof l != 'object') throw Error(f(284));
      (t === null || t.ref !== l) && (e.flags |= 4194816);
    }
  }
  function Cc(t, e, l, n, a) {
    return (
      Ql(e),
      (l = rc(t, e, l, n, void 0, a)),
      (n = dc()),
      t !== null && !Lt
        ? (mc(t, e, a), ke(t, e, a))
        : (ht && n && Ki(e), (e.flags |= 1), Ft(t, e, l, a), e.child)
    );
  }
  function yr(t, e, l, n, a, u) {
    return (
      Ql(e),
      (e.updateQueue = null),
      (l = ps(e, n, l, a)),
      gs(t),
      (n = dc()),
      t !== null && !Lt
        ? (mc(t, e, u), ke(t, e, u))
        : (ht && n && Ki(e), (e.flags |= 1), Ft(t, e, l, u), e.child)
    );
  }
  function vr(t, e, l, n, a) {
    if ((Ql(e), e.stateNode === null)) {
      var u = mn,
        c = l.contextType;
      (typeof c == 'object' && c !== null && (u = Wt(c)),
        (u = new l(n, u)),
        (e.memoizedState = u.state !== null && u.state !== void 0 ? u.state : null),
        (u.updater = Oc),
        (e.stateNode = u),
        (u._reactInternals = e),
        (u = e.stateNode),
        (u.props = n),
        (u.state = e.memoizedState),
        (u.refs = {}),
        nc(e),
        (c = l.contextType),
        (u.context = typeof c == 'object' && c !== null ? Wt(c) : mn),
        (u.state = e.memoizedState),
        (c = l.getDerivedStateFromProps),
        typeof c == 'function' && (Mc(e, l, c, n), (u.state = e.memoizedState)),
        typeof l.getDerivedStateFromProps == 'function' ||
          typeof u.getSnapshotBeforeUpdate == 'function' ||
          (typeof u.UNSAFE_componentWillMount != 'function' &&
            typeof u.componentWillMount != 'function') ||
          ((c = u.state),
          typeof u.componentWillMount == 'function' && u.componentWillMount(),
          typeof u.UNSAFE_componentWillMount == 'function' && u.UNSAFE_componentWillMount(),
          c !== u.state && Oc.enqueueReplaceState(u, u.state, null),
          ra(e, n, u, a),
          sa(),
          (u.state = e.memoizedState)),
        typeof u.componentDidMount == 'function' && (e.flags |= 4194308),
        (n = !0));
    } else if (t === null) {
      u = e.stateNode;
      var r = e.memoizedProps,
        h = kl(l, r);
      u.props = h;
      var T = u.context,
        C = l.contextType;
      ((c = mn), typeof C == 'object' && C !== null && (c = Wt(C)));
      var U = l.getDerivedStateFromProps;
      ((C = typeof U == 'function' || typeof u.getSnapshotBeforeUpdate == 'function'),
        (r = e.pendingProps !== r),
        C ||
          (typeof u.UNSAFE_componentWillReceiveProps != 'function' &&
            typeof u.componentWillReceiveProps != 'function') ||
          ((r || T !== c) && lr(e, u, n, c)),
        (dl = !1));
      var _ = e.memoizedState;
      ((u.state = _),
        ra(e, n, u, a),
        sa(),
        (T = e.memoizedState),
        r || _ !== T || dl
          ? (typeof U == 'function' && (Mc(e, l, U, n), (T = e.memoizedState)),
            (h = dl || er(e, l, h, n, _, T, c))
              ? (C ||
                  (typeof u.UNSAFE_componentWillMount != 'function' &&
                    typeof u.componentWillMount != 'function') ||
                  (typeof u.componentWillMount == 'function' && u.componentWillMount(),
                  typeof u.UNSAFE_componentWillMount == 'function' &&
                    u.UNSAFE_componentWillMount()),
                typeof u.componentDidMount == 'function' && (e.flags |= 4194308))
              : (typeof u.componentDidMount == 'function' && (e.flags |= 4194308),
                (e.memoizedProps = n),
                (e.memoizedState = T)),
            (u.props = n),
            (u.state = T),
            (u.context = c),
            (n = h))
          : (typeof u.componentDidMount == 'function' && (e.flags |= 4194308), (n = !1)));
    } else {
      ((u = e.stateNode),
        ac(t, e),
        (c = e.memoizedProps),
        (C = kl(l, c)),
        (u.props = C),
        (U = e.pendingProps),
        (_ = u.context),
        (T = l.contextType),
        (h = mn),
        typeof T == 'object' && T !== null && (h = Wt(T)),
        (r = l.getDerivedStateFromProps),
        (T = typeof r == 'function' || typeof u.getSnapshotBeforeUpdate == 'function') ||
          (typeof u.UNSAFE_componentWillReceiveProps != 'function' &&
            typeof u.componentWillReceiveProps != 'function') ||
          ((c !== U || _ !== h) && lr(e, u, n, h)),
        (dl = !1),
        (_ = e.memoizedState),
        (u.state = _),
        ra(e, n, u, a),
        sa());
      var O = e.memoizedState;
      c !== U || _ !== O || dl || (t !== null && t.dependencies !== null && su(t.dependencies))
        ? (typeof r == 'function' && (Mc(e, l, r, n), (O = e.memoizedState)),
          (C =
            dl ||
            er(e, l, C, n, _, O, h) ||
            (t !== null && t.dependencies !== null && su(t.dependencies)))
            ? (T ||
                (typeof u.UNSAFE_componentWillUpdate != 'function' &&
                  typeof u.componentWillUpdate != 'function') ||
                (typeof u.componentWillUpdate == 'function' && u.componentWillUpdate(n, O, h),
                typeof u.UNSAFE_componentWillUpdate == 'function' &&
                  u.UNSAFE_componentWillUpdate(n, O, h)),
              typeof u.componentDidUpdate == 'function' && (e.flags |= 4),
              typeof u.getSnapshotBeforeUpdate == 'function' && (e.flags |= 1024))
            : (typeof u.componentDidUpdate != 'function' ||
                (c === t.memoizedProps && _ === t.memoizedState) ||
                (e.flags |= 4),
              typeof u.getSnapshotBeforeUpdate != 'function' ||
                (c === t.memoizedProps && _ === t.memoizedState) ||
                (e.flags |= 1024),
              (e.memoizedProps = n),
              (e.memoizedState = O)),
          (u.props = n),
          (u.state = O),
          (u.context = h),
          (n = C))
        : (typeof u.componentDidUpdate != 'function' ||
            (c === t.memoizedProps && _ === t.memoizedState) ||
            (e.flags |= 4),
          typeof u.getSnapshotBeforeUpdate != 'function' ||
            (c === t.memoizedProps && _ === t.memoizedState) ||
            (e.flags |= 1024),
          (n = !1));
    }
    return (
      (u = n),
      Ru(t, e),
      (n = (e.flags & 128) !== 0),
      u || n
        ? ((u = e.stateNode),
          (l = n && typeof l.getDerivedStateFromError != 'function' ? null : u.render()),
          (e.flags |= 1),
          t !== null && n
            ? ((e.child = Jl(e, t.child, null, a)), (e.child = Jl(e, null, l, a)))
            : Ft(t, e, l, a),
          (e.memoizedState = u.state),
          (t = e.child))
        : (t = ke(t, e, a)),
      t
    );
  }
  function gr(t, e, l, n) {
    return (Ll(), (e.flags |= 256), Ft(t, e, l, n), e.child);
  }
  var Dc = { dehydrated: null, treeContext: null, retryLane: 0, hydrationErrors: null };
  function jc(t) {
    return { baseLanes: t, cachePool: is() };
  }
  function Uc(t, e, l) {
    return ((t = t !== null ? t.childLanes & ~l : 0), e && (t |= ge), t);
  }
  function pr(t, e, l) {
    var n = e.pendingProps,
      a = !1,
      u = (e.flags & 128) !== 0,
      c;
    if (
      ((c = u) || (c = t !== null && t.memoizedState === null ? !1 : (Bt.current & 2) !== 0),
      c && ((a = !0), (e.flags &= -129)),
      (c = (e.flags & 32) !== 0),
      (e.flags &= -33),
      t === null)
    ) {
      if (ht) {
        if (
          (a ? yl(e) : vl(),
          (t = Rt)
            ? ((t = _d(t, Te)),
              (t = t !== null && t.data !== '&' ? t : null),
              t !== null &&
                ((e.memoizedState = {
                  dehydrated: t,
                  treeContext: fl !== null ? { id: He, overflow: Be } : null,
                  retryLane: 536870912,
                  hydrationErrors: null,
                }),
                (l = Fo(t)),
                (l.return = e),
                (e.child = l),
                (kt = e),
                (Rt = null)))
            : (t = null),
          t === null)
        )
          throw sl(e);
        return (gf(t) ? (e.lanes = 32) : (e.lanes = 536870912), null);
      }
      var r = n.children;
      return (
        (n = n.fallback),
        a
          ? (vl(),
            (a = e.mode),
            (r = Nu({ mode: 'hidden', children: r }, a)),
            (n = Gl(n, a, l, null)),
            (r.return = e),
            (n.return = e),
            (r.sibling = n),
            (e.child = r),
            (n = e.child),
            (n.memoizedState = jc(l)),
            (n.childLanes = Uc(t, c, l)),
            (e.memoizedState = Dc),
            va(null, n))
          : (yl(e), Hc(e, r))
      );
    }
    var h = t.memoizedState;
    if (h !== null && ((r = h.dehydrated), r !== null)) {
      if (u)
        e.flags & 256
          ? (yl(e), (e.flags &= -257), (e = Bc(t, e, l)))
          : e.memoizedState !== null
            ? (vl(), (e.child = t.child), (e.flags |= 128), (e = null))
            : (vl(),
              (r = n.fallback),
              (a = e.mode),
              (n = Nu({ mode: 'visible', children: n.children }, a)),
              (r = Gl(r, a, l, null)),
              (r.flags |= 2),
              (n.return = e),
              (r.return = e),
              (n.sibling = r),
              (e.child = n),
              Jl(e, t.child, null, l),
              (n = e.child),
              (n.memoizedState = jc(l)),
              (n.childLanes = Uc(t, c, l)),
              (e.memoizedState = Dc),
              (e = va(null, n)));
      else if ((yl(e), gf(r))) {
        if (((c = r.nextSibling && r.nextSibling.dataset), c)) var T = c.dgst;
        ((c = T),
          (n = Error(f(419))),
          (n.stack = ''),
          (n.digest = c),
          aa({ value: n, source: null, stack: null }),
          (e = Bc(t, e, l)));
      } else if ((Lt || gn(t, e, l, !1), (c = (l & t.childLanes) !== 0), Lt || c)) {
        if (((c = _t), c !== null && ((n = no(c, l)), n !== 0 && n !== h.retryLane)))
          throw ((h.retryLane = n), wl(t, n), fe(c, t, n), Nc);
        (vf(r) || wu(), (e = Bc(t, e, l)));
      } else
        vf(r)
          ? ((e.flags |= 192), (e.child = t.child), (e = null))
          : ((t = h.treeContext),
            (Rt = Me(r.nextSibling)),
            (kt = e),
            (ht = !0),
            (ol = null),
            (Te = !1),
            t !== null && ts(e, t),
            (e = Hc(e, n.children)),
            (e.flags |= 4096));
      return e;
    }
    return a
      ? (vl(),
        (r = n.fallback),
        (a = e.mode),
        (h = t.child),
        (T = h.sibling),
        (n = Qe(h, { mode: 'hidden', children: n.children })),
        (n.subtreeFlags = h.subtreeFlags & 65011712),
        T !== null ? (r = Qe(T, r)) : ((r = Gl(r, a, l, null)), (r.flags |= 2)),
        (r.return = e),
        (n.return = e),
        (n.sibling = r),
        (e.child = n),
        va(null, n),
        (n = e.child),
        (r = t.child.memoizedState),
        r === null
          ? (r = jc(l))
          : ((a = r.cachePool),
            a !== null
              ? ((h = wt._currentValue), (a = a.parent !== h ? { parent: h, pool: h } : a))
              : (a = is()),
            (r = { baseLanes: r.baseLanes | l, cachePool: a })),
        (n.memoizedState = r),
        (n.childLanes = Uc(t, c, l)),
        (e.memoizedState = Dc),
        va(t.child, n))
      : (yl(e),
        (l = t.child),
        (t = l.sibling),
        (l = Qe(l, { mode: 'visible', children: n.children })),
        (l.return = e),
        (l.sibling = null),
        t !== null &&
          ((c = e.deletions), c === null ? ((e.deletions = [t]), (e.flags |= 16)) : c.push(t)),
        (e.child = l),
        (e.memoizedState = null),
        l);
  }
  function Hc(t, e) {
    return ((e = Nu({ mode: 'visible', children: e }, t.mode)), (e.return = t), (t.child = e));
  }
  function Nu(t, e) {
    return ((t = me(22, t, null, e)), (t.lanes = 0), t);
  }
  function Bc(t, e, l) {
    return (
      Jl(e, t.child, null, l),
      (t = Hc(e, e.pendingProps.children)),
      (t.flags |= 2),
      (e.memoizedState = null),
      t
    );
  }
  function br(t, e, l) {
    t.lanes |= e;
    var n = t.alternate;
    (n !== null && (n.lanes |= e), Fi(t.return, e, l));
  }
  function qc(t, e, l, n, a, u) {
    var c = t.memoizedState;
    c === null
      ? (t.memoizedState = {
          isBackwards: e,
          rendering: null,
          renderingStartTime: 0,
          last: n,
          tail: l,
          tailMode: a,
          treeForkCount: u,
        })
      : ((c.isBackwards = e),
        (c.rendering = null),
        (c.renderingStartTime = 0),
        (c.last = n),
        (c.tail = l),
        (c.tailMode = a),
        (c.treeForkCount = u));
  }
  function Sr(t, e, l) {
    var n = e.pendingProps,
      a = n.revealOrder,
      u = n.tail;
    n = n.children;
    var c = Bt.current,
      r = (c & 2) !== 0;
    if (
      (r ? ((c = (c & 1) | 2), (e.flags |= 128)) : (c &= 1),
      Q(Bt, c),
      Ft(t, e, n, l),
      (n = ht ? na : 0),
      !r && t !== null && (t.flags & 128) !== 0)
    )
      t: for (t = e.child; t !== null; ) {
        if (t.tag === 13) t.memoizedState !== null && br(t, l, e);
        else if (t.tag === 19) br(t, l, e);
        else if (t.child !== null) {
          ((t.child.return = t), (t = t.child));
          continue;
        }
        if (t === e) break t;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e) break t;
          t = t.return;
        }
        ((t.sibling.return = t.return), (t = t.sibling));
      }
    switch (a) {
      case 'forwards':
        for (l = e.child, a = null; l !== null; )
          ((t = l.alternate), t !== null && pu(t) === null && (a = l), (l = l.sibling));
        ((l = a),
          l === null ? ((a = e.child), (e.child = null)) : ((a = l.sibling), (l.sibling = null)),
          qc(e, !1, a, l, u, n));
        break;
      case 'backwards':
      case 'unstable_legacy-backwards':
        for (l = null, a = e.child, e.child = null; a !== null; ) {
          if (((t = a.alternate), t !== null && pu(t) === null)) {
            e.child = a;
            break;
          }
          ((t = a.sibling), (a.sibling = l), (l = a), (a = t));
        }
        qc(e, !0, l, null, u, n);
        break;
      case 'together':
        qc(e, !1, null, null, void 0, n);
        break;
      default:
        e.memoizedState = null;
    }
    return e.child;
  }
  function ke(t, e, l) {
    if (
      (t !== null && (e.dependencies = t.dependencies), (bl |= e.lanes), (l & e.childLanes) === 0)
    )
      if (t !== null) {
        if ((gn(t, e, l, !1), (l & e.childLanes) === 0)) return null;
      } else return null;
    if (t !== null && e.child !== t.child) throw Error(f(153));
    if (e.child !== null) {
      for (t = e.child, l = Qe(t, t.pendingProps), e.child = l, l.return = e; t.sibling !== null; )
        ((t = t.sibling), (l = l.sibling = Qe(t, t.pendingProps)), (l.return = e));
      l.sibling = null;
    }
    return e.child;
  }
  function Yc(t, e) {
    return (t.lanes & e) !== 0 ? !0 : ((t = t.dependencies), !!(t !== null && su(t)));
  }
  function x0(t, e, l) {
    switch (e.tag) {
      case 3:
        (te(e, e.stateNode.containerInfo), rl(e, wt, t.memoizedState.cache), Ll());
        break;
      case 27:
      case 5:
        Xn(e);
        break;
      case 4:
        te(e, e.stateNode.containerInfo);
        break;
      case 10:
        rl(e, e.type, e.memoizedProps.value);
        break;
      case 31:
        if (e.memoizedState !== null) return ((e.flags |= 128), oc(e), null);
        break;
      case 13:
        var n = e.memoizedState;
        if (n !== null)
          return n.dehydrated !== null
            ? (yl(e), (e.flags |= 128), null)
            : (l & e.child.childLanes) !== 0
              ? pr(t, e, l)
              : (yl(e), (t = ke(t, e, l)), t !== null ? t.sibling : null);
        yl(e);
        break;
      case 19:
        var a = (t.flags & 128) !== 0;
        if (
          ((n = (l & e.childLanes) !== 0),
          n || (gn(t, e, l, !1), (n = (l & e.childLanes) !== 0)),
          a)
        ) {
          if (n) return Sr(t, e, l);
          e.flags |= 128;
        }
        if (
          ((a = e.memoizedState),
          a !== null && ((a.rendering = null), (a.tail = null), (a.lastEffect = null)),
          Q(Bt, Bt.current),
          n)
        )
          break;
        return null;
      case 22:
        return ((e.lanes = 0), dr(t, e, l, e.pendingProps));
      case 24:
        rl(e, wt, t.memoizedState.cache);
    }
    return ke(t, e, l);
  }
  function xr(t, e, l) {
    if (t !== null)
      if (t.memoizedProps !== e.pendingProps) Lt = !0;
      else {
        if (!Yc(t, l) && (e.flags & 128) === 0) return ((Lt = !1), x0(t, e, l));
        Lt = (t.flags & 131072) !== 0;
      }
    else ((Lt = !1), ht && (e.flags & 1048576) !== 0 && Po(e, na, e.index));
    switch (((e.lanes = 0), e.tag)) {
      case 16:
        t: {
          var n = e.pendingProps;
          if (((t = Zl(e.elementType)), (e.type = t), typeof t == 'function'))
            Qi(t)
              ? ((n = kl(t, n)), (e.tag = 1), (e = vr(null, e, t, n, l)))
              : ((e.tag = 0), (e = Cc(null, e, t, n, l)));
          else {
            if (t != null) {
              var a = t.$$typeof;
              if (a === X) {
                ((e.tag = 11), (e = or(null, e, t, n, l)));
                break t;
              } else if (a === J) {
                ((e.tag = 14), (e = sr(null, e, t, n, l)));
                break t;
              }
            }
            throw ((e = Vt(t) || t), Error(f(306, e, '')));
          }
        }
        return e;
      case 0:
        return Cc(t, e, e.type, e.pendingProps, l);
      case 1:
        return ((n = e.type), (a = kl(n, e.pendingProps)), vr(t, e, n, a, l));
      case 3:
        t: {
          if ((te(e, e.stateNode.containerInfo), t === null)) throw Error(f(387));
          n = e.pendingProps;
          var u = e.memoizedState;
          ((a = u.element), ac(t, e), ra(e, n, null, l));
          var c = e.memoizedState;
          if (
            ((n = c.cache),
            rl(e, wt, n),
            n !== u.cache && Ii(e, [wt], l, !0),
            sa(),
            (n = c.element),
            u.isDehydrated)
          )
            if (
              ((u = { element: n, isDehydrated: !1, cache: c.cache }),
              (e.updateQueue.baseState = u),
              (e.memoizedState = u),
              e.flags & 256)
            ) {
              e = gr(t, e, n, l);
              break t;
            } else if (n !== a) {
              ((a = ze(Error(f(424)), e)), aa(a), (e = gr(t, e, n, l)));
              break t;
            } else {
              switch (((t = e.stateNode.containerInfo), t.nodeType)) {
                case 9:
                  t = t.body;
                  break;
                default:
                  t = t.nodeName === 'HTML' ? t.ownerDocument.body : t;
              }
              for (
                Rt = Me(t.firstChild),
                  kt = e,
                  ht = !0,
                  ol = null,
                  Te = !0,
                  l = ds(e, null, n, l),
                  e.child = l;
                l;
              )
                ((l.flags = (l.flags & -3) | 4096), (l = l.sibling));
            }
          else {
            if ((Ll(), n === a)) {
              e = ke(t, e, l);
              break t;
            }
            Ft(t, e, n, l);
          }
          e = e.child;
        }
        return e;
      case 26:
        return (
          Ru(t, e),
          t === null
            ? (l = Dd(e.type, null, e.pendingProps, null))
              ? (e.memoizedState = l)
              : ht ||
                ((l = e.type),
                (t = e.pendingProps),
                (n = Ku(ot.current).createElement(l)),
                (n[$t] = e),
                (n[le] = t),
                It(n, l, t),
                Kt(n),
                (e.stateNode = n))
            : (e.memoizedState = Dd(e.type, t.memoizedProps, e.pendingProps, t.memoizedState)),
          null
        );
      case 27:
        return (
          Xn(e),
          t === null &&
            ht &&
            ((n = e.stateNode = Rd(e.type, e.pendingProps, ot.current)),
            (kt = e),
            (Te = !0),
            (a = Rt),
            Al(e.type) ? ((pf = a), (Rt = Me(n.firstChild))) : (Rt = a)),
          Ft(t, e, e.pendingProps.children, l),
          Ru(t, e),
          t === null && (e.flags |= 4194304),
          e.child
        );
      case 5:
        return (
          t === null &&
            ht &&
            ((a = n = Rt) &&
              ((n = F0(n, e.type, e.pendingProps, Te)),
              n !== null
                ? ((e.stateNode = n), (kt = e), (Rt = Me(n.firstChild)), (Te = !1), (a = !0))
                : (a = !1)),
            a || sl(e)),
          Xn(e),
          (a = e.type),
          (u = e.pendingProps),
          (c = t !== null ? t.memoizedProps : null),
          (n = u.children),
          mf(a, u) ? (n = null) : c !== null && mf(a, c) && (e.flags |= 32),
          e.memoizedState !== null && ((a = rc(t, e, d0, null, null, l)), (Ca._currentValue = a)),
          Ru(t, e),
          Ft(t, e, n, l),
          e.child
        );
      case 6:
        return (
          t === null &&
            ht &&
            ((t = l = Rt) &&
              ((l = I0(l, e.pendingProps, Te)),
              l !== null ? ((e.stateNode = l), (kt = e), (Rt = null), (t = !0)) : (t = !1)),
            t || sl(e)),
          null
        );
      case 13:
        return pr(t, e, l);
      case 4:
        return (
          te(e, e.stateNode.containerInfo),
          (n = e.pendingProps),
          t === null ? (e.child = Jl(e, null, n, l)) : Ft(t, e, n, l),
          e.child
        );
      case 11:
        return or(t, e, e.type, e.pendingProps, l);
      case 7:
        return (Ft(t, e, e.pendingProps, l), e.child);
      case 8:
        return (Ft(t, e, e.pendingProps.children, l), e.child);
      case 12:
        return (Ft(t, e, e.pendingProps.children, l), e.child);
      case 10:
        return ((n = e.pendingProps), rl(e, e.type, n.value), Ft(t, e, n.children, l), e.child);
      case 9:
        return (
          (a = e.type._context),
          (n = e.pendingProps.children),
          Ql(e),
          (a = Wt(a)),
          (n = n(a)),
          (e.flags |= 1),
          Ft(t, e, n, l),
          e.child
        );
      case 14:
        return sr(t, e, e.type, e.pendingProps, l);
      case 15:
        return rr(t, e, e.type, e.pendingProps, l);
      case 19:
        return Sr(t, e, l);
      case 31:
        return S0(t, e, l);
      case 22:
        return dr(t, e, l, e.pendingProps);
      case 24:
        return (
          Ql(e),
          (n = Wt(wt)),
          t === null
            ? ((a = ec()),
              a === null &&
                ((a = _t),
                (u = Pi()),
                (a.pooledCache = u),
                u.refCount++,
                u !== null && (a.pooledCacheLanes |= l),
                (a = u)),
              (e.memoizedState = { parent: n, cache: a }),
              nc(e),
              rl(e, wt, a))
            : ((t.lanes & l) !== 0 && (ac(t, e), ra(e, null, null, l), sa()),
              (a = t.memoizedState),
              (u = e.memoizedState),
              a.parent !== n
                ? ((a = { parent: n, cache: n }),
                  (e.memoizedState = a),
                  e.lanes === 0 && (e.memoizedState = e.updateQueue.baseState = a),
                  rl(e, wt, n))
                : ((n = u.cache), rl(e, wt, n), n !== a.cache && Ii(e, [wt], l, !0))),
          Ft(t, e, e.pendingProps.children, l),
          e.child
        );
      case 29:
        throw e.pendingProps;
    }
    throw Error(f(156, e.tag));
  }
  function We(t) {
    t.flags |= 4;
  }
  function wc(t, e, l, n, a) {
    if (((e = (t.mode & 32) !== 0) && (e = !1), e)) {
      if (((t.flags |= 16777216), (a & 335544128) === a))
        if (t.stateNode.complete) t.flags |= 8192;
        else if ($r()) t.flags |= 8192;
        else throw ((Kl = hu), lc);
    } else t.flags &= -16777217;
  }
  function zr(t, e) {
    if (e.type !== 'stylesheet' || (e.state.loading & 4) !== 0) t.flags &= -16777217;
    else if (((t.flags |= 16777216), !qd(e)))
      if ($r()) t.flags |= 8192;
      else throw ((Kl = hu), lc);
  }
  function Cu(t, e) {
    (e !== null && (t.flags |= 4),
      t.flags & 16384 && ((e = t.tag !== 22 ? to() : 536870912), (t.lanes |= e), (Rn |= e)));
  }
  function ga(t, e) {
    if (!ht)
      switch (t.tailMode) {
        case 'hidden':
          e = t.tail;
          for (var l = null; e !== null; ) (e.alternate !== null && (l = e), (e = e.sibling));
          l === null ? (t.tail = null) : (l.sibling = null);
          break;
        case 'collapsed':
          l = t.tail;
          for (var n = null; l !== null; ) (l.alternate !== null && (n = l), (l = l.sibling));
          n === null
            ? e || t.tail === null
              ? (t.tail = null)
              : (t.tail.sibling = null)
            : (n.sibling = null);
      }
  }
  function Nt(t) {
    var e = t.alternate !== null && t.alternate.child === t.child,
      l = 0,
      n = 0;
    if (e)
      for (var a = t.child; a !== null; )
        ((l |= a.lanes | a.childLanes),
          (n |= a.subtreeFlags & 65011712),
          (n |= a.flags & 65011712),
          (a.return = t),
          (a = a.sibling));
    else
      for (a = t.child; a !== null; )
        ((l |= a.lanes | a.childLanes),
          (n |= a.subtreeFlags),
          (n |= a.flags),
          (a.return = t),
          (a = a.sibling));
    return ((t.subtreeFlags |= n), (t.childLanes = l), e);
  }
  function z0(t, e, l) {
    var n = e.pendingProps;
    switch ((Ji(e), e.tag)) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return (Nt(e), null);
      case 1:
        return (Nt(e), null);
      case 3:
        return (
          (l = e.stateNode),
          (n = null),
          t !== null && (n = t.memoizedState.cache),
          e.memoizedState.cache !== n && (e.flags |= 2048),
          Ke(wt),
          Ht(),
          l.pendingContext && ((l.context = l.pendingContext), (l.pendingContext = null)),
          (t === null || t.child === null) &&
            (vn(e)
              ? We(e)
              : t === null ||
                (t.memoizedState.isDehydrated && (e.flags & 256) === 0) ||
                ((e.flags |= 1024), ki())),
          Nt(e),
          null
        );
      case 26:
        var a = e.type,
          u = e.memoizedState;
        return (
          t === null
            ? (We(e), u !== null ? (Nt(e), zr(e, u)) : (Nt(e), wc(e, a, null, n, l)))
            : u
              ? u !== t.memoizedState
                ? (We(e), Nt(e), zr(e, u))
                : (Nt(e), (e.flags &= -16777217))
              : ((t = t.memoizedProps), t !== n && We(e), Nt(e), wc(e, a, t, n, l)),
          null
        );
      case 27:
        if ((Xa(e), (l = ot.current), (a = e.type), t !== null && e.stateNode != null))
          t.memoizedProps !== n && We(e);
        else {
          if (!n) {
            if (e.stateNode === null) throw Error(f(166));
            return (Nt(e), null);
          }
          ((t = k.current), vn(e) ? es(e) : ((t = Rd(a, n, l)), (e.stateNode = t), We(e)));
        }
        return (Nt(e), null);
      case 5:
        if ((Xa(e), (a = e.type), t !== null && e.stateNode != null))
          t.memoizedProps !== n && We(e);
        else {
          if (!n) {
            if (e.stateNode === null) throw Error(f(166));
            return (Nt(e), null);
          }
          if (((u = k.current), vn(e))) es(e);
          else {
            var c = Ku(ot.current);
            switch (u) {
              case 1:
                u = c.createElementNS('http://www.w3.org/2000/svg', a);
                break;
              case 2:
                u = c.createElementNS('http://www.w3.org/1998/Math/MathML', a);
                break;
              default:
                switch (a) {
                  case 'svg':
                    u = c.createElementNS('http://www.w3.org/2000/svg', a);
                    break;
                  case 'math':
                    u = c.createElementNS('http://www.w3.org/1998/Math/MathML', a);
                    break;
                  case 'script':
                    ((u = c.createElement('div')),
                      (u.innerHTML = '<script><\/script>'),
                      (u = u.removeChild(u.firstChild)));
                    break;
                  case 'select':
                    ((u =
                      typeof n.is == 'string'
                        ? c.createElement('select', { is: n.is })
                        : c.createElement('select')),
                      n.multiple ? (u.multiple = !0) : n.size && (u.size = n.size));
                    break;
                  default:
                    u =
                      typeof n.is == 'string'
                        ? c.createElement(a, { is: n.is })
                        : c.createElement(a);
                }
            }
            ((u[$t] = e), (u[le] = n));
            t: for (c = e.child; c !== null; ) {
              if (c.tag === 5 || c.tag === 6) u.appendChild(c.stateNode);
              else if (c.tag !== 4 && c.tag !== 27 && c.child !== null) {
                ((c.child.return = c), (c = c.child));
                continue;
              }
              if (c === e) break t;
              for (; c.sibling === null; ) {
                if (c.return === null || c.return === e) break t;
                c = c.return;
              }
              ((c.sibling.return = c.return), (c = c.sibling));
            }
            e.stateNode = u;
            t: switch ((It(u, a, n), a)) {
              case 'button':
              case 'input':
              case 'select':
              case 'textarea':
                n = !!n.autoFocus;
                break t;
              case 'img':
                n = !0;
                break t;
              default:
                n = !1;
            }
            n && We(e);
          }
        }
        return (Nt(e), wc(e, e.type, t === null ? null : t.memoizedProps, e.pendingProps, l), null);
      case 6:
        if (t && e.stateNode != null) t.memoizedProps !== n && We(e);
        else {
          if (typeof n != 'string' && e.stateNode === null) throw Error(f(166));
          if (((t = ot.current), vn(e))) {
            if (((t = e.stateNode), (l = e.memoizedProps), (n = null), (a = kt), a !== null))
              switch (a.tag) {
                case 27:
                case 5:
                  n = a.memoizedProps;
              }
            ((t[$t] = e),
              (t = !!(
                t.nodeValue === l ||
                (n !== null && n.suppressHydrationWarning === !0) ||
                pd(t.nodeValue, l)
              )),
              t || sl(e, !0));
          } else ((t = Ku(t).createTextNode(n)), (t[$t] = e), (e.stateNode = t));
        }
        return (Nt(e), null);
      case 31:
        if (((l = e.memoizedState), t === null || t.memoizedState !== null)) {
          if (((n = vn(e)), l !== null)) {
            if (t === null) {
              if (!n) throw Error(f(318));
              if (((t = e.memoizedState), (t = t !== null ? t.dehydrated : null), !t))
                throw Error(f(557));
              t[$t] = e;
            } else (Ll(), (e.flags & 128) === 0 && (e.memoizedState = null), (e.flags |= 4));
            (Nt(e), (t = !1));
          } else
            ((l = ki()),
              t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = l),
              (t = !0));
          if (!t) return e.flags & 256 ? (ye(e), e) : (ye(e), null);
          if ((e.flags & 128) !== 0) throw Error(f(558));
        }
        return (Nt(e), null);
      case 13:
        if (
          ((n = e.memoizedState),
          t === null || (t.memoizedState !== null && t.memoizedState.dehydrated !== null))
        ) {
          if (((a = vn(e)), n !== null && n.dehydrated !== null)) {
            if (t === null) {
              if (!a) throw Error(f(318));
              if (((a = e.memoizedState), (a = a !== null ? a.dehydrated : null), !a))
                throw Error(f(317));
              a[$t] = e;
            } else (Ll(), (e.flags & 128) === 0 && (e.memoizedState = null), (e.flags |= 4));
            (Nt(e), (a = !1));
          } else
            ((a = ki()),
              t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = a),
              (a = !0));
          if (!a) return e.flags & 256 ? (ye(e), e) : (ye(e), null);
        }
        return (
          ye(e),
          (e.flags & 128) !== 0
            ? ((e.lanes = l), e)
            : ((l = n !== null),
              (t = t !== null && t.memoizedState !== null),
              l &&
                ((n = e.child),
                (a = null),
                n.alternate !== null &&
                  n.alternate.memoizedState !== null &&
                  n.alternate.memoizedState.cachePool !== null &&
                  (a = n.alternate.memoizedState.cachePool.pool),
                (u = null),
                n.memoizedState !== null &&
                  n.memoizedState.cachePool !== null &&
                  (u = n.memoizedState.cachePool.pool),
                u !== a && (n.flags |= 2048)),
              l !== t && l && (e.child.flags |= 8192),
              Cu(e, e.updateQueue),
              Nt(e),
              null)
        );
      case 4:
        return (Ht(), t === null && ff(e.stateNode.containerInfo), Nt(e), null);
      case 10:
        return (Ke(e.type), Nt(e), null);
      case 19:
        if ((j(Bt), (n = e.memoizedState), n === null)) return (Nt(e), null);
        if (((a = (e.flags & 128) !== 0), (u = n.rendering), u === null))
          if (a) ga(n, !1);
          else {
            if (Ut !== 0 || (t !== null && (t.flags & 128) !== 0))
              for (t = e.child; t !== null; ) {
                if (((u = pu(t)), u !== null)) {
                  for (
                    e.flags |= 128,
                      ga(n, !1),
                      t = u.updateQueue,
                      e.updateQueue = t,
                      Cu(e, t),
                      e.subtreeFlags = 0,
                      t = l,
                      l = e.child;
                    l !== null;
                  )
                    (Wo(l, t), (l = l.sibling));
                  return (Q(Bt, (Bt.current & 1) | 2), ht && Ve(e, n.treeForkCount), e.child);
                }
                t = t.sibling;
              }
            n.tail !== null &&
              oe() > Bu &&
              ((e.flags |= 128), (a = !0), ga(n, !1), (e.lanes = 4194304));
          }
        else {
          if (!a)
            if (((t = pu(u)), t !== null)) {
              if (
                ((e.flags |= 128),
                (a = !0),
                (t = t.updateQueue),
                (e.updateQueue = t),
                Cu(e, t),
                ga(n, !0),
                n.tail === null && n.tailMode === 'hidden' && !u.alternate && !ht)
              )
                return (Nt(e), null);
            } else
              2 * oe() - n.renderingStartTime > Bu &&
                l !== 536870912 &&
                ((e.flags |= 128), (a = !0), ga(n, !1), (e.lanes = 4194304));
          n.isBackwards
            ? ((u.sibling = e.child), (e.child = u))
            : ((t = n.last), t !== null ? (t.sibling = u) : (e.child = u), (n.last = u));
        }
        return n.tail !== null
          ? ((t = n.tail),
            (n.rendering = t),
            (n.tail = t.sibling),
            (n.renderingStartTime = oe()),
            (t.sibling = null),
            (l = Bt.current),
            Q(Bt, a ? (l & 1) | 2 : l & 1),
            ht && Ve(e, n.treeForkCount),
            t)
          : (Nt(e), null);
      case 22:
      case 23:
        return (
          ye(e),
          fc(),
          (n = e.memoizedState !== null),
          t !== null
            ? (t.memoizedState !== null) !== n && (e.flags |= 8192)
            : n && (e.flags |= 8192),
          n
            ? (l & 536870912) !== 0 &&
              (e.flags & 128) === 0 &&
              (Nt(e), e.subtreeFlags & 6 && (e.flags |= 8192))
            : Nt(e),
          (l = e.updateQueue),
          l !== null && Cu(e, l.retryQueue),
          (l = null),
          t !== null &&
            t.memoizedState !== null &&
            t.memoizedState.cachePool !== null &&
            (l = t.memoizedState.cachePool.pool),
          (n = null),
          e.memoizedState !== null &&
            e.memoizedState.cachePool !== null &&
            (n = e.memoizedState.cachePool.pool),
          n !== l && (e.flags |= 2048),
          t !== null && j(Vl),
          null
        );
      case 24:
        return (
          (l = null),
          t !== null && (l = t.memoizedState.cache),
          e.memoizedState.cache !== l && (e.flags |= 2048),
          Ke(wt),
          Nt(e),
          null
        );
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(f(156, e.tag));
  }
  function E0(t, e) {
    switch ((Ji(e), e.tag)) {
      case 1:
        return ((t = e.flags), t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null);
      case 3:
        return (
          Ke(wt),
          Ht(),
          (t = e.flags),
          (t & 65536) !== 0 && (t & 128) === 0 ? ((e.flags = (t & -65537) | 128), e) : null
        );
      case 26:
      case 27:
      case 5:
        return (Xa(e), null);
      case 31:
        if (e.memoizedState !== null) {
          if ((ye(e), e.alternate === null)) throw Error(f(340));
          Ll();
        }
        return ((t = e.flags), t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null);
      case 13:
        if ((ye(e), (t = e.memoizedState), t !== null && t.dehydrated !== null)) {
          if (e.alternate === null) throw Error(f(340));
          Ll();
        }
        return ((t = e.flags), t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null);
      case 19:
        return (j(Bt), null);
      case 4:
        return (Ht(), null);
      case 10:
        return (Ke(e.type), null);
      case 22:
      case 23:
        return (
          ye(e),
          fc(),
          t !== null && j(Vl),
          (t = e.flags),
          t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null
        );
      case 24:
        return (Ke(wt), null);
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Er(t, e) {
    switch ((Ji(e), e.tag)) {
      case 3:
        (Ke(wt), Ht());
        break;
      case 26:
      case 27:
      case 5:
        Xa(e);
        break;
      case 4:
        Ht();
        break;
      case 31:
        e.memoizedState !== null && ye(e);
        break;
      case 13:
        ye(e);
        break;
      case 19:
        j(Bt);
        break;
      case 10:
        Ke(e.type);
        break;
      case 22:
      case 23:
        (ye(e), fc(), t !== null && j(Vl));
        break;
      case 24:
        Ke(wt);
    }
  }
  function pa(t, e) {
    try {
      var l = e.updateQueue,
        n = l !== null ? l.lastEffect : null;
      if (n !== null) {
        var a = n.next;
        l = a;
        do {
          if ((l.tag & t) === t) {
            n = void 0;
            var u = l.create,
              c = l.inst;
            ((n = u()), (c.destroy = n));
          }
          l = l.next;
        } while (l !== a);
      }
    } catch (r) {
      xt(e, e.return, r);
    }
  }
  function gl(t, e, l) {
    try {
      var n = e.updateQueue,
        a = n !== null ? n.lastEffect : null;
      if (a !== null) {
        var u = a.next;
        n = u;
        do {
          if ((n.tag & t) === t) {
            var c = n.inst,
              r = c.destroy;
            if (r !== void 0) {
              ((c.destroy = void 0), (a = e));
              var h = l,
                T = r;
              try {
                T();
              } catch (C) {
                xt(a, h, C);
              }
            }
          }
          n = n.next;
        } while (n !== u);
      }
    } catch (C) {
      xt(e, e.return, C);
    }
  }
  function Ar(t) {
    var e = t.updateQueue;
    if (e !== null) {
      var l = t.stateNode;
      try {
        hs(e, l);
      } catch (n) {
        xt(t, t.return, n);
      }
    }
  }
  function Tr(t, e, l) {
    ((l.props = kl(t.type, t.memoizedProps)), (l.state = t.memoizedState));
    try {
      l.componentWillUnmount();
    } catch (n) {
      xt(t, e, n);
    }
  }
  function ba(t, e) {
    try {
      var l = t.ref;
      if (l !== null) {
        switch (t.tag) {
          case 26:
          case 27:
          case 5:
            var n = t.stateNode;
            break;
          case 30:
            n = t.stateNode;
            break;
          default:
            n = t.stateNode;
        }
        typeof l == 'function' ? (t.refCleanup = l(n)) : (l.current = n);
      }
    } catch (a) {
      xt(t, e, a);
    }
  }
  function qe(t, e) {
    var l = t.ref,
      n = t.refCleanup;
    if (l !== null)
      if (typeof n == 'function')
        try {
          n();
        } catch (a) {
          xt(t, e, a);
        } finally {
          ((t.refCleanup = null), (t = t.alternate), t != null && (t.refCleanup = null));
        }
      else if (typeof l == 'function')
        try {
          l(null);
        } catch (a) {
          xt(t, e, a);
        }
      else l.current = null;
  }
  function _r(t) {
    var e = t.type,
      l = t.memoizedProps,
      n = t.stateNode;
    try {
      t: switch (e) {
        case 'button':
        case 'input':
        case 'select':
        case 'textarea':
          l.autoFocus && n.focus();
          break t;
        case 'img':
          l.src ? (n.src = l.src) : l.srcSet && (n.srcset = l.srcSet);
      }
    } catch (a) {
      xt(t, t.return, a);
    }
  }
  function Gc(t, e, l) {
    try {
      var n = t.stateNode;
      (Z0(n, t.type, l, e), (n[le] = e));
    } catch (a) {
      xt(t, t.return, a);
    }
  }
  function Mr(t) {
    return (
      t.tag === 5 || t.tag === 3 || t.tag === 26 || (t.tag === 27 && Al(t.type)) || t.tag === 4
    );
  }
  function Lc(t) {
    t: for (;;) {
      for (; t.sibling === null; ) {
        if (t.return === null || Mr(t.return)) return null;
        t = t.return;
      }
      for (
        t.sibling.return = t.return, t = t.sibling;
        t.tag !== 5 && t.tag !== 6 && t.tag !== 18;
      ) {
        if ((t.tag === 27 && Al(t.type)) || t.flags & 2 || t.child === null || t.tag === 4)
          continue t;
        ((t.child.return = t), (t = t.child));
      }
      if (!(t.flags & 2)) return t.stateNode;
    }
  }
  function Xc(t, e, l) {
    var n = t.tag;
    if (n === 5 || n === 6)
      ((t = t.stateNode),
        e
          ? (l.nodeType === 9
              ? l.body
              : l.nodeName === 'HTML'
                ? l.ownerDocument.body
                : l
            ).insertBefore(t, e)
          : ((e = l.nodeType === 9 ? l.body : l.nodeName === 'HTML' ? l.ownerDocument.body : l),
            e.appendChild(t),
            (l = l._reactRootContainer),
            l != null || e.onclick !== null || (e.onclick = Le)));
    else if (
      n !== 4 &&
      (n === 27 && Al(t.type) && ((l = t.stateNode), (e = null)), (t = t.child), t !== null)
    )
      for (Xc(t, e, l), t = t.sibling; t !== null; ) (Xc(t, e, l), (t = t.sibling));
  }
  function Du(t, e, l) {
    var n = t.tag;
    if (n === 5 || n === 6) ((t = t.stateNode), e ? l.insertBefore(t, e) : l.appendChild(t));
    else if (n !== 4 && (n === 27 && Al(t.type) && (l = t.stateNode), (t = t.child), t !== null))
      for (Du(t, e, l), t = t.sibling; t !== null; ) (Du(t, e, l), (t = t.sibling));
  }
  function Or(t) {
    var e = t.stateNode,
      l = t.memoizedProps;
    try {
      for (var n = t.type, a = e.attributes; a.length; ) e.removeAttributeNode(a[0]);
      (It(e, n, l), (e[$t] = t), (e[le] = l));
    } catch (u) {
      xt(t, t.return, u);
    }
  }
  var Fe = !1,
    Xt = !1,
    Qc = !1,
    Rr = typeof WeakSet == 'function' ? WeakSet : Set,
    Jt = null;
  function A0(t, e) {
    if (((t = t.containerInfo), (rf = Pu), (t = Lo(t)), Bi(t))) {
      if ('selectionStart' in t) var l = { start: t.selectionStart, end: t.selectionEnd };
      else
        t: {
          l = ((l = t.ownerDocument) && l.defaultView) || window;
          var n = l.getSelection && l.getSelection();
          if (n && n.rangeCount !== 0) {
            l = n.anchorNode;
            var a = n.anchorOffset,
              u = n.focusNode;
            n = n.focusOffset;
            try {
              (l.nodeType, u.nodeType);
            } catch {
              l = null;
              break t;
            }
            var c = 0,
              r = -1,
              h = -1,
              T = 0,
              C = 0,
              U = t,
              _ = null;
            e: for (;;) {
              for (
                var O;
                U !== l || (a !== 0 && U.nodeType !== 3) || (r = c + a),
                  U !== u || (n !== 0 && U.nodeType !== 3) || (h = c + n),
                  U.nodeType === 3 && (c += U.nodeValue.length),
                  (O = U.firstChild) !== null;
              )
                ((_ = U), (U = O));
              for (;;) {
                if (U === t) break e;
                if (
                  (_ === l && ++T === a && (r = c),
                  _ === u && ++C === n && (h = c),
                  (O = U.nextSibling) !== null)
                )
                  break;
                ((U = _), (_ = U.parentNode));
              }
              U = O;
            }
            l = r === -1 || h === -1 ? null : { start: r, end: h };
          } else l = null;
        }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (df = { focusedElem: t, selectionRange: l }, Pu = !1, Jt = e; Jt !== null; )
      if (((e = Jt), (t = e.child), (e.subtreeFlags & 1028) !== 0 && t !== null))
        ((t.return = e), (Jt = t));
      else
        for (; Jt !== null; ) {
          switch (((e = Jt), (u = e.alternate), (t = e.flags), e.tag)) {
            case 0:
              if (
                (t & 4) !== 0 &&
                ((t = e.updateQueue), (t = t !== null ? t.events : null), t !== null)
              )
                for (l = 0; l < t.length; l++) ((a = t[l]), (a.ref.impl = a.nextImpl));
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((t & 1024) !== 0 && u !== null) {
                ((t = void 0),
                  (l = e),
                  (a = u.memoizedProps),
                  (u = u.memoizedState),
                  (n = l.stateNode));
                try {
                  var K = kl(l.type, a);
                  ((t = n.getSnapshotBeforeUpdate(K, u)),
                    (n.__reactInternalSnapshotBeforeUpdate = t));
                } catch (lt) {
                  xt(l, l.return, lt);
                }
              }
              break;
            case 3:
              if ((t & 1024) !== 0) {
                if (((t = e.stateNode.containerInfo), (l = t.nodeType), l === 9)) yf(t);
                else if (l === 1)
                  switch (t.nodeName) {
                    case 'HEAD':
                    case 'HTML':
                    case 'BODY':
                      yf(t);
                      break;
                    default:
                      t.textContent = '';
                  }
              }
              break;
            case 5:
            case 26:
            case 27:
            case 6:
            case 4:
            case 17:
              break;
            default:
              if ((t & 1024) !== 0) throw Error(f(163));
          }
          if (((t = e.sibling), t !== null)) {
            ((t.return = e.return), (Jt = t));
            break;
          }
          Jt = e.return;
        }
  }
  function Nr(t, e, l) {
    var n = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        (Pe(t, l), n & 4 && pa(5, l));
        break;
      case 1:
        if ((Pe(t, l), n & 4))
          if (((t = l.stateNode), e === null))
            try {
              t.componentDidMount();
            } catch (c) {
              xt(l, l.return, c);
            }
          else {
            var a = kl(l.type, e.memoizedProps);
            e = e.memoizedState;
            try {
              t.componentDidUpdate(a, e, t.__reactInternalSnapshotBeforeUpdate);
            } catch (c) {
              xt(l, l.return, c);
            }
          }
        (n & 64 && Ar(l), n & 512 && ba(l, l.return));
        break;
      case 3:
        if ((Pe(t, l), n & 64 && ((t = l.updateQueue), t !== null))) {
          if (((e = null), l.child !== null))
            switch (l.child.tag) {
              case 27:
              case 5:
                e = l.child.stateNode;
                break;
              case 1:
                e = l.child.stateNode;
            }
          try {
            hs(t, e);
          } catch (c) {
            xt(l, l.return, c);
          }
        }
        break;
      case 27:
        e === null && n & 4 && Or(l);
      case 26:
      case 5:
        (Pe(t, l), e === null && n & 4 && _r(l), n & 512 && ba(l, l.return));
        break;
      case 12:
        Pe(t, l);
        break;
      case 31:
        (Pe(t, l), n & 4 && jr(t, l));
        break;
      case 13:
        (Pe(t, l),
          n & 4 && Ur(t, l),
          n & 64 &&
            ((t = l.memoizedState),
            t !== null && ((t = t.dehydrated), t !== null && ((l = j0.bind(null, l)), P0(t, l)))));
        break;
      case 22:
        if (((n = l.memoizedState !== null || Fe), !n)) {
          ((e = (e !== null && e.memoizedState !== null) || Xt), (a = Fe));
          var u = Xt;
          ((Fe = n),
            (Xt = e) && !u ? tl(t, l, (l.subtreeFlags & 8772) !== 0) : Pe(t, l),
            (Fe = a),
            (Xt = u));
        }
        break;
      case 30:
        break;
      default:
        Pe(t, l);
    }
  }
  function Cr(t) {
    var e = t.alternate;
    (e !== null && ((t.alternate = null), Cr(e)),
      (t.child = null),
      (t.deletions = null),
      (t.sibling = null),
      t.tag === 5 && ((e = t.stateNode), e !== null && bi(e)),
      (t.stateNode = null),
      (t.return = null),
      (t.dependencies = null),
      (t.memoizedProps = null),
      (t.memoizedState = null),
      (t.pendingProps = null),
      (t.stateNode = null),
      (t.updateQueue = null));
  }
  var Dt = null,
    ae = !1;
  function Ie(t, e, l) {
    for (l = l.child; l !== null; ) (Dr(t, e, l), (l = l.sibling));
  }
  function Dr(t, e, l) {
    if (se && typeof se.onCommitFiberUnmount == 'function')
      try {
        se.onCommitFiberUnmount(Qn, l);
      } catch {}
    switch (l.tag) {
      case 26:
        (Xt || qe(l, e),
          Ie(t, e, l),
          l.memoizedState
            ? l.memoizedState.count--
            : l.stateNode && ((l = l.stateNode), l.parentNode.removeChild(l)));
        break;
      case 27:
        Xt || qe(l, e);
        var n = Dt,
          a = ae;
        (Al(l.type) && ((Dt = l.stateNode), (ae = !1)),
          Ie(t, e, l),
          Oa(l.stateNode),
          (Dt = n),
          (ae = a));
        break;
      case 5:
        Xt || qe(l, e);
      case 6:
        if (((n = Dt), (a = ae), (Dt = null), Ie(t, e, l), (Dt = n), (ae = a), Dt !== null))
          if (ae)
            try {
              (Dt.nodeType === 9
                ? Dt.body
                : Dt.nodeName === 'HTML'
                  ? Dt.ownerDocument.body
                  : Dt
              ).removeChild(l.stateNode);
            } catch (u) {
              xt(l, e, u);
            }
          else
            try {
              Dt.removeChild(l.stateNode);
            } catch (u) {
              xt(l, e, u);
            }
        break;
      case 18:
        Dt !== null &&
          (ae
            ? ((t = Dt),
              Ad(
                t.nodeType === 9 ? t.body : t.nodeName === 'HTML' ? t.ownerDocument.body : t,
                l.stateNode,
              ),
              qn(t))
            : Ad(Dt, l.stateNode));
        break;
      case 4:
        ((n = Dt),
          (a = ae),
          (Dt = l.stateNode.containerInfo),
          (ae = !0),
          Ie(t, e, l),
          (Dt = n),
          (ae = a));
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        (gl(2, l, e), Xt || gl(4, l, e), Ie(t, e, l));
        break;
      case 1:
        (Xt ||
          (qe(l, e), (n = l.stateNode), typeof n.componentWillUnmount == 'function' && Tr(l, e, n)),
          Ie(t, e, l));
        break;
      case 21:
        Ie(t, e, l);
        break;
      case 22:
        ((Xt = (n = Xt) || l.memoizedState !== null), Ie(t, e, l), (Xt = n));
        break;
      default:
        Ie(t, e, l);
    }
  }
  function jr(t, e) {
    if (
      e.memoizedState === null &&
      ((t = e.alternate), t !== null && ((t = t.memoizedState), t !== null))
    ) {
      t = t.dehydrated;
      try {
        qn(t);
      } catch (l) {
        xt(e, e.return, l);
      }
    }
  }
  function Ur(t, e) {
    if (
      e.memoizedState === null &&
      ((t = e.alternate),
      t !== null && ((t = t.memoizedState), t !== null && ((t = t.dehydrated), t !== null)))
    )
      try {
        qn(t);
      } catch (l) {
        xt(e, e.return, l);
      }
  }
  function T0(t) {
    switch (t.tag) {
      case 31:
      case 13:
      case 19:
        var e = t.stateNode;
        return (e === null && (e = t.stateNode = new Rr()), e);
      case 22:
        return (
          (t = t.stateNode),
          (e = t._retryCache),
          e === null && (e = t._retryCache = new Rr()),
          e
        );
      default:
        throw Error(f(435, t.tag));
    }
  }
  function ju(t, e) {
    var l = T0(t);
    e.forEach(function (n) {
      if (!l.has(n)) {
        l.add(n);
        var a = U0.bind(null, t, n);
        n.then(a, a);
      }
    });
  }
  function ue(t, e) {
    var l = e.deletions;
    if (l !== null)
      for (var n = 0; n < l.length; n++) {
        var a = l[n],
          u = t,
          c = e,
          r = c;
        t: for (; r !== null; ) {
          switch (r.tag) {
            case 27:
              if (Al(r.type)) {
                ((Dt = r.stateNode), (ae = !1));
                break t;
              }
              break;
            case 5:
              ((Dt = r.stateNode), (ae = !1));
              break t;
            case 3:
            case 4:
              ((Dt = r.stateNode.containerInfo), (ae = !0));
              break t;
          }
          r = r.return;
        }
        if (Dt === null) throw Error(f(160));
        (Dr(u, c, a),
          (Dt = null),
          (ae = !1),
          (u = a.alternate),
          u !== null && (u.return = null),
          (a.return = null));
      }
    if (e.subtreeFlags & 13886) for (e = e.child; e !== null; ) (Hr(e, t), (e = e.sibling));
  }
  var De = null;
  function Hr(t, e) {
    var l = t.alternate,
      n = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        (ue(e, t), ie(t), n & 4 && (gl(3, t, t.return), pa(3, t), gl(5, t, t.return)));
        break;
      case 1:
        (ue(e, t),
          ie(t),
          n & 512 && (Xt || l === null || qe(l, l.return)),
          n & 64 &&
            Fe &&
            ((t = t.updateQueue),
            t !== null &&
              ((n = t.callbacks),
              n !== null &&
                ((l = t.shared.hiddenCallbacks),
                (t.shared.hiddenCallbacks = l === null ? n : l.concat(n))))));
        break;
      case 26:
        var a = De;
        if ((ue(e, t), ie(t), n & 512 && (Xt || l === null || qe(l, l.return)), n & 4)) {
          var u = l !== null ? l.memoizedState : null;
          if (((n = t.memoizedState), l === null))
            if (n === null)
              if (t.stateNode === null) {
                t: {
                  ((n = t.type), (l = t.memoizedProps), (a = a.ownerDocument || a));
                  e: switch (n) {
                    case 'title':
                      ((u = a.getElementsByTagName('title')[0]),
                        (!u ||
                          u[Kn] ||
                          u[$t] ||
                          u.namespaceURI === 'http://www.w3.org/2000/svg' ||
                          u.hasAttribute('itemprop')) &&
                          ((u = a.createElement(n)),
                          a.head.insertBefore(u, a.querySelector('head > title'))),
                        It(u, n, l),
                        (u[$t] = t),
                        Kt(u),
                        (n = u));
                      break t;
                    case 'link':
                      var c = Hd('link', 'href', a).get(n + (l.href || ''));
                      if (c) {
                        for (var r = 0; r < c.length; r++)
                          if (
                            ((u = c[r]),
                            u.getAttribute('href') ===
                              (l.href == null || l.href === '' ? null : l.href) &&
                              u.getAttribute('rel') === (l.rel == null ? null : l.rel) &&
                              u.getAttribute('title') === (l.title == null ? null : l.title) &&
                              u.getAttribute('crossorigin') ===
                                (l.crossOrigin == null ? null : l.crossOrigin))
                          ) {
                            c.splice(r, 1);
                            break e;
                          }
                      }
                      ((u = a.createElement(n)), It(u, n, l), a.head.appendChild(u));
                      break;
                    case 'meta':
                      if ((c = Hd('meta', 'content', a).get(n + (l.content || '')))) {
                        for (r = 0; r < c.length; r++)
                          if (
                            ((u = c[r]),
                            u.getAttribute('content') ===
                              (l.content == null ? null : '' + l.content) &&
                              u.getAttribute('name') === (l.name == null ? null : l.name) &&
                              u.getAttribute('property') ===
                                (l.property == null ? null : l.property) &&
                              u.getAttribute('http-equiv') ===
                                (l.httpEquiv == null ? null : l.httpEquiv) &&
                              u.getAttribute('charset') === (l.charSet == null ? null : l.charSet))
                          ) {
                            c.splice(r, 1);
                            break e;
                          }
                      }
                      ((u = a.createElement(n)), It(u, n, l), a.head.appendChild(u));
                      break;
                    default:
                      throw Error(f(468, n));
                  }
                  ((u[$t] = t), Kt(u), (n = u));
                }
                t.stateNode = n;
              } else Bd(a, t.type, t.stateNode);
            else t.stateNode = Ud(a, n, t.memoizedProps);
          else
            u !== n
              ? (u === null
                  ? l.stateNode !== null && ((l = l.stateNode), l.parentNode.removeChild(l))
                  : u.count--,
                n === null ? Bd(a, t.type, t.stateNode) : Ud(a, n, t.memoizedProps))
              : n === null && t.stateNode !== null && Gc(t, t.memoizedProps, l.memoizedProps);
        }
        break;
      case 27:
        (ue(e, t),
          ie(t),
          n & 512 && (Xt || l === null || qe(l, l.return)),
          l !== null && n & 4 && Gc(t, t.memoizedProps, l.memoizedProps));
        break;
      case 5:
        if ((ue(e, t), ie(t), n & 512 && (Xt || l === null || qe(l, l.return)), t.flags & 32)) {
          a = t.stateNode;
          try {
            un(a, '');
          } catch (K) {
            xt(t, t.return, K);
          }
        }
        (n & 4 &&
          t.stateNode != null &&
          ((a = t.memoizedProps), Gc(t, a, l !== null ? l.memoizedProps : a)),
          n & 1024 && (Qc = !0));
        break;
      case 6:
        if ((ue(e, t), ie(t), n & 4)) {
          if (t.stateNode === null) throw Error(f(162));
          ((n = t.memoizedProps), (l = t.stateNode));
          try {
            l.nodeValue = n;
          } catch (K) {
            xt(t, t.return, K);
          }
        }
        break;
      case 3:
        if (
          ((ku = null),
          (a = De),
          (De = Ju(e.containerInfo)),
          ue(e, t),
          (De = a),
          ie(t),
          n & 4 && l !== null && l.memoizedState.isDehydrated)
        )
          try {
            qn(e.containerInfo);
          } catch (K) {
            xt(t, t.return, K);
          }
        Qc && ((Qc = !1), Br(t));
        break;
      case 4:
        ((n = De), (De = Ju(t.stateNode.containerInfo)), ue(e, t), ie(t), (De = n));
        break;
      case 12:
        (ue(e, t), ie(t));
        break;
      case 31:
        (ue(e, t),
          ie(t),
          n & 4 && ((n = t.updateQueue), n !== null && ((t.updateQueue = null), ju(t, n))));
        break;
      case 13:
        (ue(e, t),
          ie(t),
          t.child.flags & 8192 &&
            (t.memoizedState !== null) != (l !== null && l.memoizedState !== null) &&
            (Hu = oe()),
          n & 4 && ((n = t.updateQueue), n !== null && ((t.updateQueue = null), ju(t, n))));
        break;
      case 22:
        a = t.memoizedState !== null;
        var h = l !== null && l.memoizedState !== null,
          T = Fe,
          C = Xt;
        if (((Fe = T || a), (Xt = C || h), ue(e, t), (Xt = C), (Fe = T), ie(t), n & 8192))
          t: for (
            e = t.stateNode,
              e._visibility = a ? e._visibility & -2 : e._visibility | 1,
              a && (l === null || h || Fe || Xt || Wl(t)),
              l = null,
              e = t;
            ;
          ) {
            if (e.tag === 5 || e.tag === 26) {
              if (l === null) {
                h = l = e;
                try {
                  if (((u = h.stateNode), a))
                    ((c = u.style),
                      typeof c.setProperty == 'function'
                        ? c.setProperty('display', 'none', 'important')
                        : (c.display = 'none'));
                  else {
                    r = h.stateNode;
                    var U = h.memoizedProps.style,
                      _ = U != null && U.hasOwnProperty('display') ? U.display : null;
                    r.style.display = _ == null || typeof _ == 'boolean' ? '' : ('' + _).trim();
                  }
                } catch (K) {
                  xt(h, h.return, K);
                }
              }
            } else if (e.tag === 6) {
              if (l === null) {
                h = e;
                try {
                  h.stateNode.nodeValue = a ? '' : h.memoizedProps;
                } catch (K) {
                  xt(h, h.return, K);
                }
              }
            } else if (e.tag === 18) {
              if (l === null) {
                h = e;
                try {
                  var O = h.stateNode;
                  a ? Td(O, !0) : Td(h.stateNode, !1);
                } catch (K) {
                  xt(h, h.return, K);
                }
              }
            } else if (
              ((e.tag !== 22 && e.tag !== 23) || e.memoizedState === null || e === t) &&
              e.child !== null
            ) {
              ((e.child.return = e), (e = e.child));
              continue;
            }
            if (e === t) break t;
            for (; e.sibling === null; ) {
              if (e.return === null || e.return === t) break t;
              (l === e && (l = null), (e = e.return));
            }
            (l === e && (l = null), (e.sibling.return = e.return), (e = e.sibling));
          }
        n & 4 &&
          ((n = t.updateQueue),
          n !== null && ((l = n.retryQueue), l !== null && ((n.retryQueue = null), ju(t, l))));
        break;
      case 19:
        (ue(e, t),
          ie(t),
          n & 4 && ((n = t.updateQueue), n !== null && ((t.updateQueue = null), ju(t, n))));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        (ue(e, t), ie(t));
    }
  }
  function ie(t) {
    var e = t.flags;
    if (e & 2) {
      try {
        for (var l, n = t.return; n !== null; ) {
          if (Mr(n)) {
            l = n;
            break;
          }
          n = n.return;
        }
        if (l == null) throw Error(f(160));
        switch (l.tag) {
          case 27:
            var a = l.stateNode,
              u = Lc(t);
            Du(t, u, a);
            break;
          case 5:
            var c = l.stateNode;
            l.flags & 32 && (un(c, ''), (l.flags &= -33));
            var r = Lc(t);
            Du(t, r, c);
            break;
          case 3:
          case 4:
            var h = l.stateNode.containerInfo,
              T = Lc(t);
            Xc(t, T, h);
            break;
          default:
            throw Error(f(161));
        }
      } catch (C) {
        xt(t, t.return, C);
      }
      t.flags &= -3;
    }
    e & 4096 && (t.flags &= -4097);
  }
  function Br(t) {
    if (t.subtreeFlags & 1024)
      for (t = t.child; t !== null; ) {
        var e = t;
        (Br(e), e.tag === 5 && e.flags & 1024 && e.stateNode.reset(), (t = t.sibling));
      }
  }
  function Pe(t, e) {
    if (e.subtreeFlags & 8772)
      for (e = e.child; e !== null; ) (Nr(t, e.alternate, e), (e = e.sibling));
  }
  function Wl(t) {
    for (t = t.child; t !== null; ) {
      var e = t;
      switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          (gl(4, e, e.return), Wl(e));
          break;
        case 1:
          qe(e, e.return);
          var l = e.stateNode;
          (typeof l.componentWillUnmount == 'function' && Tr(e, e.return, l), Wl(e));
          break;
        case 27:
          Oa(e.stateNode);
        case 26:
        case 5:
          (qe(e, e.return), Wl(e));
          break;
        case 22:
          e.memoizedState === null && Wl(e);
          break;
        case 30:
          Wl(e);
          break;
        default:
          Wl(e);
      }
      t = t.sibling;
    }
  }
  function tl(t, e, l) {
    for (l = l && (e.subtreeFlags & 8772) !== 0, e = e.child; e !== null; ) {
      var n = e.alternate,
        a = t,
        u = e,
        c = u.flags;
      switch (u.tag) {
        case 0:
        case 11:
        case 15:
          (tl(a, u, l), pa(4, u));
          break;
        case 1:
          if ((tl(a, u, l), (n = u), (a = n.stateNode), typeof a.componentDidMount == 'function'))
            try {
              a.componentDidMount();
            } catch (T) {
              xt(n, n.return, T);
            }
          if (((n = u), (a = n.updateQueue), a !== null)) {
            var r = n.stateNode;
            try {
              var h = a.shared.hiddenCallbacks;
              if (h !== null)
                for (a.shared.hiddenCallbacks = null, a = 0; a < h.length; a++) ms(h[a], r);
            } catch (T) {
              xt(n, n.return, T);
            }
          }
          (l && c & 64 && Ar(u), ba(u, u.return));
          break;
        case 27:
          Or(u);
        case 26:
        case 5:
          (tl(a, u, l), l && n === null && c & 4 && _r(u), ba(u, u.return));
          break;
        case 12:
          tl(a, u, l);
          break;
        case 31:
          (tl(a, u, l), l && c & 4 && jr(a, u));
          break;
        case 13:
          (tl(a, u, l), l && c & 4 && Ur(a, u));
          break;
        case 22:
          (u.memoizedState === null && tl(a, u, l), ba(u, u.return));
          break;
        case 30:
          break;
        default:
          tl(a, u, l);
      }
      e = e.sibling;
    }
  }
  function Vc(t, e) {
    var l = null;
    (t !== null &&
      t.memoizedState !== null &&
      t.memoizedState.cachePool !== null &&
      (l = t.memoizedState.cachePool.pool),
      (t = null),
      e.memoizedState !== null &&
        e.memoizedState.cachePool !== null &&
        (t = e.memoizedState.cachePool.pool),
      t !== l && (t != null && t.refCount++, l != null && ua(l)));
  }
  function Zc(t, e) {
    ((t = null),
      e.alternate !== null && (t = e.alternate.memoizedState.cache),
      (e = e.memoizedState.cache),
      e !== t && (e.refCount++, t != null && ua(t)));
  }
  function je(t, e, l, n) {
    if (e.subtreeFlags & 10256) for (e = e.child; e !== null; ) (qr(t, e, l, n), (e = e.sibling));
  }
  function qr(t, e, l, n) {
    var a = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        (je(t, e, l, n), a & 2048 && pa(9, e));
        break;
      case 1:
        je(t, e, l, n);
        break;
      case 3:
        (je(t, e, l, n),
          a & 2048 &&
            ((t = null),
            e.alternate !== null && (t = e.alternate.memoizedState.cache),
            (e = e.memoizedState.cache),
            e !== t && (e.refCount++, t != null && ua(t))));
        break;
      case 12:
        if (a & 2048) {
          (je(t, e, l, n), (t = e.stateNode));
          try {
            var u = e.memoizedProps,
              c = u.id,
              r = u.onPostCommit;
            typeof r == 'function' &&
              r(c, e.alternate === null ? 'mount' : 'update', t.passiveEffectDuration, -0);
          } catch (h) {
            xt(e, e.return, h);
          }
        } else je(t, e, l, n);
        break;
      case 31:
        je(t, e, l, n);
        break;
      case 13:
        je(t, e, l, n);
        break;
      case 23:
        break;
      case 22:
        ((u = e.stateNode),
          (c = e.alternate),
          e.memoizedState !== null
            ? u._visibility & 2
              ? je(t, e, l, n)
              : Sa(t, e)
            : u._visibility & 2
              ? je(t, e, l, n)
              : ((u._visibility |= 2), _n(t, e, l, n, (e.subtreeFlags & 10256) !== 0 || !1)),
          a & 2048 && Vc(c, e));
        break;
      case 24:
        (je(t, e, l, n), a & 2048 && Zc(e.alternate, e));
        break;
      default:
        je(t, e, l, n);
    }
  }
  function _n(t, e, l, n, a) {
    for (a = a && ((e.subtreeFlags & 10256) !== 0 || !1), e = e.child; e !== null; ) {
      var u = t,
        c = e,
        r = l,
        h = n,
        T = c.flags;
      switch (c.tag) {
        case 0:
        case 11:
        case 15:
          (_n(u, c, r, h, a), pa(8, c));
          break;
        case 23:
          break;
        case 22:
          var C = c.stateNode;
          (c.memoizedState !== null
            ? C._visibility & 2
              ? _n(u, c, r, h, a)
              : Sa(u, c)
            : ((C._visibility |= 2), _n(u, c, r, h, a)),
            a && T & 2048 && Vc(c.alternate, c));
          break;
        case 24:
          (_n(u, c, r, h, a), a && T & 2048 && Zc(c.alternate, c));
          break;
        default:
          _n(u, c, r, h, a);
      }
      e = e.sibling;
    }
  }
  function Sa(t, e) {
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; ) {
        var l = t,
          n = e,
          a = n.flags;
        switch (n.tag) {
          case 22:
            (Sa(l, n), a & 2048 && Vc(n.alternate, n));
            break;
          case 24:
            (Sa(l, n), a & 2048 && Zc(n.alternate, n));
            break;
          default:
            Sa(l, n);
        }
        e = e.sibling;
      }
  }
  var xa = 8192;
  function Mn(t, e, l) {
    if (t.subtreeFlags & xa) for (t = t.child; t !== null; ) (Yr(t, e, l), (t = t.sibling));
  }
  function Yr(t, e, l) {
    switch (t.tag) {
      case 26:
        (Mn(t, e, l),
          t.flags & xa && t.memoizedState !== null && ry(l, De, t.memoizedState, t.memoizedProps));
        break;
      case 5:
        Mn(t, e, l);
        break;
      case 3:
      case 4:
        var n = De;
        ((De = Ju(t.stateNode.containerInfo)), Mn(t, e, l), (De = n));
        break;
      case 22:
        t.memoizedState === null &&
          ((n = t.alternate),
          n !== null && n.memoizedState !== null
            ? ((n = xa), (xa = 16777216), Mn(t, e, l), (xa = n))
            : Mn(t, e, l));
        break;
      default:
        Mn(t, e, l);
    }
  }
  function wr(t) {
    var e = t.alternate;
    if (e !== null && ((t = e.child), t !== null)) {
      e.child = null;
      do ((e = t.sibling), (t.sibling = null), (t = e));
      while (t !== null);
    }
  }
  function za(t) {
    var e = t.deletions;
    if ((t.flags & 16) !== 0) {
      if (e !== null)
        for (var l = 0; l < e.length; l++) {
          var n = e[l];
          ((Jt = n), Lr(n, t));
        }
      wr(t);
    }
    if (t.subtreeFlags & 10256) for (t = t.child; t !== null; ) (Gr(t), (t = t.sibling));
  }
  function Gr(t) {
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        (za(t), t.flags & 2048 && gl(9, t, t.return));
        break;
      case 3:
        za(t);
        break;
      case 12:
        za(t);
        break;
      case 22:
        var e = t.stateNode;
        t.memoizedState !== null && e._visibility & 2 && (t.return === null || t.return.tag !== 13)
          ? ((e._visibility &= -3), Uu(t))
          : za(t);
        break;
      default:
        za(t);
    }
  }
  function Uu(t) {
    var e = t.deletions;
    if ((t.flags & 16) !== 0) {
      if (e !== null)
        for (var l = 0; l < e.length; l++) {
          var n = e[l];
          ((Jt = n), Lr(n, t));
        }
      wr(t);
    }
    for (t = t.child; t !== null; ) {
      switch (((e = t), e.tag)) {
        case 0:
        case 11:
        case 15:
          (gl(8, e, e.return), Uu(e));
          break;
        case 22:
          ((l = e.stateNode), l._visibility & 2 && ((l._visibility &= -3), Uu(e)));
          break;
        default:
          Uu(e);
      }
      t = t.sibling;
    }
  }
  function Lr(t, e) {
    for (; Jt !== null; ) {
      var l = Jt;
      switch (l.tag) {
        case 0:
        case 11:
        case 15:
          gl(8, l, e);
          break;
        case 23:
        case 22:
          if (l.memoizedState !== null && l.memoizedState.cachePool !== null) {
            var n = l.memoizedState.cachePool.pool;
            n != null && n.refCount++;
          }
          break;
        case 24:
          ua(l.memoizedState.cache);
      }
      if (((n = l.child), n !== null)) ((n.return = l), (Jt = n));
      else
        t: for (l = t; Jt !== null; ) {
          n = Jt;
          var a = n.sibling,
            u = n.return;
          if ((Cr(n), n === l)) {
            Jt = null;
            break t;
          }
          if (a !== null) {
            ((a.return = u), (Jt = a));
            break t;
          }
          Jt = u;
        }
    }
  }
  var _0 = {
      getCacheForType: function (t) {
        var e = Wt(wt),
          l = e.data.get(t);
        return (l === void 0 && ((l = t()), e.data.set(t, l)), l);
      },
      cacheSignal: function () {
        return Wt(wt).controller.signal;
      },
    },
    M0 = typeof WeakMap == 'function' ? WeakMap : Map,
    pt = 0,
    _t = null,
    st = null,
    dt = 0,
    St = 0,
    ve = null,
    pl = !1,
    On = !1,
    Kc = !1,
    el = 0,
    Ut = 0,
    bl = 0,
    Fl = 0,
    Jc = 0,
    ge = 0,
    Rn = 0,
    Ea = null,
    ce = null,
    $c = !1,
    Hu = 0,
    Xr = 0,
    Bu = 1 / 0,
    qu = null,
    Sl = null,
    Zt = 0,
    xl = null,
    Nn = null,
    ll = 0,
    kc = 0,
    Wc = null,
    Qr = null,
    Aa = 0,
    Fc = null;
  function pe() {
    return (pt & 2) !== 0 && dt !== 0 ? dt & -dt : N.T !== null ? nf() : ao();
  }
  function Vr() {
    if (ge === 0)
      if ((dt & 536870912) === 0 || ht) {
        var t = Za;
        ((Za <<= 1), (Za & 3932160) === 0 && (Za = 262144), (ge = t));
      } else ge = 536870912;
    return ((t = he.current), t !== null && (t.flags |= 32), ge);
  }
  function fe(t, e, l) {
    (((t === _t && (St === 2 || St === 9)) || t.cancelPendingCommit !== null) &&
      (Cn(t, 0), zl(t, dt, ge, !1)),
      Zn(t, l),
      ((pt & 2) === 0 || t !== _t) &&
        (t === _t && ((pt & 2) === 0 && (Fl |= l), Ut === 4 && zl(t, dt, ge, !1)), Ye(t)));
  }
  function Zr(t, e, l) {
    if ((pt & 6) !== 0) throw Error(f(327));
    var n = (!l && (e & 127) === 0 && (e & t.expiredLanes) === 0) || Vn(t, e),
      a = n ? N0(t, e) : Pc(t, e, !0),
      u = n;
    do {
      if (a === 0) {
        On && !n && zl(t, e, 0, !1);
        break;
      } else {
        if (((l = t.current.alternate), u && !O0(l))) {
          ((a = Pc(t, e, !1)), (u = !1));
          continue;
        }
        if (a === 2) {
          if (((u = e), t.errorRecoveryDisabledLanes & u)) var c = 0;
          else
            ((c = t.pendingLanes & -536870913), (c = c !== 0 ? c : c & 536870912 ? 536870912 : 0));
          if (c !== 0) {
            e = c;
            t: {
              var r = t;
              a = Ea;
              var h = r.current.memoizedState.isDehydrated;
              if ((h && (Cn(r, c).flags |= 256), (c = Pc(r, c, !1)), c !== 2)) {
                if (Kc && !h) {
                  ((r.errorRecoveryDisabledLanes |= u), (Fl |= u), (a = 4));
                  break t;
                }
                ((u = ce), (ce = a), u !== null && (ce === null ? (ce = u) : ce.push.apply(ce, u)));
              }
              a = c;
            }
            if (((u = !1), a !== 2)) continue;
          }
        }
        if (a === 1) {
          (Cn(t, 0), zl(t, e, 0, !0));
          break;
        }
        t: {
          switch (((n = t), (u = a), u)) {
            case 0:
            case 1:
              throw Error(f(345));
            case 4:
              if ((e & 4194048) !== e) break;
            case 6:
              zl(n, e, ge, !pl);
              break t;
            case 2:
              ce = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(f(329));
          }
          if ((e & 62914560) === e && ((a = Hu + 300 - oe()), 10 < a)) {
            if ((zl(n, e, ge, !pl), Ja(n, 0, !0) !== 0)) break t;
            ((ll = e),
              (n.timeoutHandle = zd(
                Kr.bind(null, n, l, ce, qu, $c, e, ge, Fl, Rn, pl, u, 'Throttled', -0, 0),
                a,
              )));
            break t;
          }
          Kr(n, l, ce, qu, $c, e, ge, Fl, Rn, pl, u, null, -0, 0);
        }
      }
      break;
    } while (!0);
    Ye(t);
  }
  function Kr(t, e, l, n, a, u, c, r, h, T, C, U, _, O) {
    if (((t.timeoutHandle = -1), (U = e.subtreeFlags), U & 8192 || (U & 16785408) === 16785408)) {
      ((U = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: Le,
      }),
        Yr(e, u, U));
      var K = (u & 62914560) === u ? Hu - oe() : (u & 4194048) === u ? Xr - oe() : 0;
      if (((K = dy(U, K)), K !== null)) {
        ((ll = u),
          (t.cancelPendingCommit = K(td.bind(null, t, e, u, l, n, a, c, r, h, C, U, null, _, O))),
          zl(t, u, c, !T));
        return;
      }
    }
    td(t, e, u, l, n, a, c, r, h);
  }
  function O0(t) {
    for (var e = t; ; ) {
      var l = e.tag;
      if (
        (l === 0 || l === 11 || l === 15) &&
        e.flags & 16384 &&
        ((l = e.updateQueue), l !== null && ((l = l.stores), l !== null))
      )
        for (var n = 0; n < l.length; n++) {
          var a = l[n],
            u = a.getSnapshot;
          a = a.value;
          try {
            if (!de(u(), a)) return !1;
          } catch {
            return !1;
          }
        }
      if (((l = e.child), e.subtreeFlags & 16384 && l !== null)) ((l.return = e), (e = l));
      else {
        if (e === t) break;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) return !0;
          e = e.return;
        }
        ((e.sibling.return = e.return), (e = e.sibling));
      }
    }
    return !0;
  }
  function zl(t, e, l, n) {
    ((e &= ~Jc),
      (e &= ~Fl),
      (t.suspendedLanes |= e),
      (t.pingedLanes &= ~e),
      n && (t.warmLanes |= e),
      (n = t.expirationTimes));
    for (var a = e; 0 < a; ) {
      var u = 31 - re(a),
        c = 1 << u;
      ((n[u] = -1), (a &= ~c));
    }
    l !== 0 && eo(t, l, e);
  }
  function Yu() {
    return (pt & 6) === 0 ? (Ta(0), !1) : !0;
  }
  function Ic() {
    if (st !== null) {
      if (St === 0) var t = st.return;
      else ((t = st), (Ze = Xl = null), hc(t), (xn = null), (ca = 0), (t = st));
      for (; t !== null; ) (Er(t.alternate, t), (t = t.return));
      st = null;
    }
  }
  function Cn(t, e) {
    var l = t.timeoutHandle;
    (l !== -1 && ((t.timeoutHandle = -1), $0(l)),
      (l = t.cancelPendingCommit),
      l !== null && ((t.cancelPendingCommit = null), l()),
      (ll = 0),
      Ic(),
      (_t = t),
      (st = l = Qe(t.current, null)),
      (dt = e),
      (St = 0),
      (ve = null),
      (pl = !1),
      (On = Vn(t, e)),
      (Kc = !1),
      (Rn = ge = Jc = Fl = bl = Ut = 0),
      (ce = Ea = null),
      ($c = !1),
      (e & 8) !== 0 && (e |= e & 32));
    var n = t.entangledLanes;
    if (n !== 0)
      for (t = t.entanglements, n &= e; 0 < n; ) {
        var a = 31 - re(n),
          u = 1 << a;
        ((e |= t[a]), (n &= ~u));
      }
    return ((el = e), uu(), l);
  }
  function Jr(t, e) {
    ((it = null),
      (N.H = ya),
      e === Sn || e === mu
        ? ((e = os()), (St = 3))
        : e === lc
          ? ((e = os()), (St = 4))
          : (St =
              e === Nc
                ? 8
                : e !== null && typeof e == 'object' && typeof e.then == 'function'
                  ? 6
                  : 1),
      (ve = e),
      st === null && ((Ut = 1), Mu(t, ze(e, t.current))));
  }
  function $r() {
    var t = he.current;
    return t === null
      ? !0
      : (dt & 4194048) === dt
        ? _e === null
        : (dt & 62914560) === dt || (dt & 536870912) !== 0
          ? t === _e
          : !1;
  }
  function kr() {
    var t = N.H;
    return ((N.H = ya), t === null ? ya : t);
  }
  function Wr() {
    var t = N.A;
    return ((N.A = _0), t);
  }
  function wu() {
    ((Ut = 4),
      pl || ((dt & 4194048) !== dt && he.current !== null) || (On = !0),
      ((bl & 134217727) === 0 && (Fl & 134217727) === 0) || _t === null || zl(_t, dt, ge, !1));
  }
  function Pc(t, e, l) {
    var n = pt;
    pt |= 2;
    var a = kr(),
      u = Wr();
    ((_t !== t || dt !== e) && ((qu = null), Cn(t, e)), (e = !1));
    var c = Ut;
    t: do
      try {
        if (St !== 0 && st !== null) {
          var r = st,
            h = ve;
          switch (St) {
            case 8:
              (Ic(), (c = 6));
              break t;
            case 3:
            case 2:
            case 9:
            case 6:
              he.current === null && (e = !0);
              var T = St;
              if (((St = 0), (ve = null), Dn(t, r, h, T), l && On)) {
                c = 0;
                break t;
              }
              break;
            default:
              ((T = St), (St = 0), (ve = null), Dn(t, r, h, T));
          }
        }
        (R0(), (c = Ut));
        break;
      } catch (C) {
        Jr(t, C);
      }
    while (!0);
    return (
      e && t.shellSuspendCounter++,
      (Ze = Xl = null),
      (pt = n),
      (N.H = a),
      (N.A = u),
      st === null && ((_t = null), (dt = 0), uu()),
      c
    );
  }
  function R0() {
    for (; st !== null; ) Fr(st);
  }
  function N0(t, e) {
    var l = pt;
    pt |= 2;
    var n = kr(),
      a = Wr();
    _t !== t || dt !== e ? ((qu = null), (Bu = oe() + 500), Cn(t, e)) : (On = Vn(t, e));
    t: do
      try {
        if (St !== 0 && st !== null) {
          e = st;
          var u = ve;
          e: switch (St) {
            case 1:
              ((St = 0), (ve = null), Dn(t, e, u, 1));
              break;
            case 2:
            case 9:
              if (cs(u)) {
                ((St = 0), (ve = null), Ir(e));
                break;
              }
              ((e = function () {
                ((St !== 2 && St !== 9) || _t !== t || (St = 7), Ye(t));
              }),
                u.then(e, e));
              break t;
            case 3:
              St = 7;
              break t;
            case 4:
              St = 5;
              break t;
            case 7:
              cs(u) ? ((St = 0), (ve = null), Ir(e)) : ((St = 0), (ve = null), Dn(t, e, u, 7));
              break;
            case 5:
              var c = null;
              switch (st.tag) {
                case 26:
                  c = st.memoizedState;
                case 5:
                case 27:
                  var r = st;
                  if (c ? qd(c) : r.stateNode.complete) {
                    ((St = 0), (ve = null));
                    var h = r.sibling;
                    if (h !== null) st = h;
                    else {
                      var T = r.return;
                      T !== null ? ((st = T), Gu(T)) : (st = null);
                    }
                    break e;
                  }
              }
              ((St = 0), (ve = null), Dn(t, e, u, 5));
              break;
            case 6:
              ((St = 0), (ve = null), Dn(t, e, u, 6));
              break;
            case 8:
              (Ic(), (Ut = 6));
              break t;
            default:
              throw Error(f(462));
          }
        }
        C0();
        break;
      } catch (C) {
        Jr(t, C);
      }
    while (!0);
    return (
      (Ze = Xl = null),
      (N.H = n),
      (N.A = a),
      (pt = l),
      st !== null ? 0 : ((_t = null), (dt = 0), uu(), Ut)
    );
  }
  function C0() {
    for (; st !== null && !th(); ) Fr(st);
  }
  function Fr(t) {
    var e = xr(t.alternate, t, el);
    ((t.memoizedProps = t.pendingProps), e === null ? Gu(t) : (st = e));
  }
  function Ir(t) {
    var e = t,
      l = e.alternate;
    switch (e.tag) {
      case 15:
      case 0:
        e = yr(l, e, e.pendingProps, e.type, void 0, dt);
        break;
      case 11:
        e = yr(l, e, e.pendingProps, e.type.render, e.ref, dt);
        break;
      case 5:
        hc(e);
      default:
        (Er(l, e), (e = st = Wo(e, el)), (e = xr(l, e, el)));
    }
    ((t.memoizedProps = t.pendingProps), e === null ? Gu(t) : (st = e));
  }
  function Dn(t, e, l, n) {
    ((Ze = Xl = null), hc(e), (xn = null), (ca = 0));
    var a = e.return;
    try {
      if (b0(t, a, e, l, dt)) {
        ((Ut = 1), Mu(t, ze(l, t.current)), (st = null));
        return;
      }
    } catch (u) {
      if (a !== null) throw ((st = a), u);
      ((Ut = 1), Mu(t, ze(l, t.current)), (st = null));
      return;
    }
    e.flags & 32768
      ? (ht || n === 1
          ? (t = !0)
          : On || (dt & 536870912) !== 0
            ? (t = !1)
            : ((pl = t = !0),
              (n === 2 || n === 9 || n === 3 || n === 6) &&
                ((n = he.current), n !== null && n.tag === 13 && (n.flags |= 16384))),
        Pr(e, t))
      : Gu(e);
  }
  function Gu(t) {
    var e = t;
    do {
      if ((e.flags & 32768) !== 0) {
        Pr(e, pl);
        return;
      }
      t = e.return;
      var l = z0(e.alternate, e, el);
      if (l !== null) {
        st = l;
        return;
      }
      if (((e = e.sibling), e !== null)) {
        st = e;
        return;
      }
      st = e = t;
    } while (e !== null);
    Ut === 0 && (Ut = 5);
  }
  function Pr(t, e) {
    do {
      var l = E0(t.alternate, t);
      if (l !== null) {
        ((l.flags &= 32767), (st = l));
        return;
      }
      if (
        ((l = t.return),
        l !== null && ((l.flags |= 32768), (l.subtreeFlags = 0), (l.deletions = null)),
        !e && ((t = t.sibling), t !== null))
      ) {
        st = t;
        return;
      }
      st = t = l;
    } while (t !== null);
    ((Ut = 6), (st = null));
  }
  function td(t, e, l, n, a, u, c, r, h) {
    t.cancelPendingCommit = null;
    do Lu();
    while (Zt !== 0);
    if ((pt & 6) !== 0) throw Error(f(327));
    if (e !== null) {
      if (e === t.current) throw Error(f(177));
      if (
        ((u = e.lanes | e.childLanes),
        (u |= Li),
        sh(t, l, u, c, r, h),
        t === _t && ((st = _t = null), (dt = 0)),
        (Nn = e),
        (xl = t),
        (ll = l),
        (kc = u),
        (Wc = a),
        (Qr = n),
        (e.subtreeFlags & 10256) !== 0 || (e.flags & 10256) !== 0
          ? ((t.callbackNode = null),
            (t.callbackPriority = 0),
            H0(Qa, function () {
              return (ud(), null);
            }))
          : ((t.callbackNode = null), (t.callbackPriority = 0)),
        (n = (e.flags & 13878) !== 0),
        (e.subtreeFlags & 13878) !== 0 || n)
      ) {
        ((n = N.T), (N.T = null), (a = w.p), (w.p = 2), (c = pt), (pt |= 4));
        try {
          A0(t, e, l);
        } finally {
          ((pt = c), (w.p = a), (N.T = n));
        }
      }
      ((Zt = 1), ed(), ld(), nd());
    }
  }
  function ed() {
    if (Zt === 1) {
      Zt = 0;
      var t = xl,
        e = Nn,
        l = (e.flags & 13878) !== 0;
      if ((e.subtreeFlags & 13878) !== 0 || l) {
        ((l = N.T), (N.T = null));
        var n = w.p;
        w.p = 2;
        var a = pt;
        pt |= 4;
        try {
          Hr(e, t);
          var u = df,
            c = Lo(t.containerInfo),
            r = u.focusedElem,
            h = u.selectionRange;
          if (c !== r && r && r.ownerDocument && Go(r.ownerDocument.documentElement, r)) {
            if (h !== null && Bi(r)) {
              var T = h.start,
                C = h.end;
              if ((C === void 0 && (C = T), 'selectionStart' in r))
                ((r.selectionStart = T), (r.selectionEnd = Math.min(C, r.value.length)));
              else {
                var U = r.ownerDocument || document,
                  _ = (U && U.defaultView) || window;
                if (_.getSelection) {
                  var O = _.getSelection(),
                    K = r.textContent.length,
                    lt = Math.min(h.start, K),
                    Tt = h.end === void 0 ? lt : Math.min(h.end, K);
                  !O.extend && lt > Tt && ((c = Tt), (Tt = lt), (lt = c));
                  var z = wo(r, lt),
                    b = wo(r, Tt);
                  if (
                    z &&
                    b &&
                    (O.rangeCount !== 1 ||
                      O.anchorNode !== z.node ||
                      O.anchorOffset !== z.offset ||
                      O.focusNode !== b.node ||
                      O.focusOffset !== b.offset)
                  ) {
                    var A = U.createRange();
                    (A.setStart(z.node, z.offset),
                      O.removeAllRanges(),
                      lt > Tt
                        ? (O.addRange(A), O.extend(b.node, b.offset))
                        : (A.setEnd(b.node, b.offset), O.addRange(A)));
                  }
                }
              }
            }
            for (U = [], O = r; (O = O.parentNode); )
              O.nodeType === 1 && U.push({ element: O, left: O.scrollLeft, top: O.scrollTop });
            for (typeof r.focus == 'function' && r.focus(), r = 0; r < U.length; r++) {
              var D = U[r];
              ((D.element.scrollLeft = D.left), (D.element.scrollTop = D.top));
            }
          }
          ((Pu = !!rf), (df = rf = null));
        } finally {
          ((pt = a), (w.p = n), (N.T = l));
        }
      }
      ((t.current = e), (Zt = 2));
    }
  }
  function ld() {
    if (Zt === 2) {
      Zt = 0;
      var t = xl,
        e = Nn,
        l = (e.flags & 8772) !== 0;
      if ((e.subtreeFlags & 8772) !== 0 || l) {
        ((l = N.T), (N.T = null));
        var n = w.p;
        w.p = 2;
        var a = pt;
        pt |= 4;
        try {
          Nr(t, e.alternate, e);
        } finally {
          ((pt = a), (w.p = n), (N.T = l));
        }
      }
      Zt = 3;
    }
  }
  function nd() {
    if (Zt === 4 || Zt === 3) {
      ((Zt = 0), eh());
      var t = xl,
        e = Nn,
        l = ll,
        n = Qr;
      (e.subtreeFlags & 10256) !== 0 || (e.flags & 10256) !== 0
        ? (Zt = 5)
        : ((Zt = 0), (Nn = xl = null), ad(t, t.pendingLanes));
      var a = t.pendingLanes;
      if (
        (a === 0 && (Sl = null),
        gi(l),
        (e = e.stateNode),
        se && typeof se.onCommitFiberRoot == 'function')
      )
        try {
          se.onCommitFiberRoot(Qn, e, void 0, (e.current.flags & 128) === 128);
        } catch {}
      if (n !== null) {
        ((e = N.T), (a = w.p), (w.p = 2), (N.T = null));
        try {
          for (var u = t.onRecoverableError, c = 0; c < n.length; c++) {
            var r = n[c];
            u(r.value, { componentStack: r.stack });
          }
        } finally {
          ((N.T = e), (w.p = a));
        }
      }
      ((ll & 3) !== 0 && Lu(),
        Ye(t),
        (a = t.pendingLanes),
        (l & 261930) !== 0 && (a & 42) !== 0 ? (t === Fc ? Aa++ : ((Aa = 0), (Fc = t))) : (Aa = 0),
        Ta(0));
    }
  }
  function ad(t, e) {
    (t.pooledCacheLanes &= e) === 0 &&
      ((e = t.pooledCache), e != null && ((t.pooledCache = null), ua(e)));
  }
  function Lu() {
    return (ed(), ld(), nd(), ud());
  }
  function ud() {
    if (Zt !== 5) return !1;
    var t = xl,
      e = kc;
    kc = 0;
    var l = gi(ll),
      n = N.T,
      a = w.p;
    try {
      ((w.p = 32 > l ? 32 : l), (N.T = null), (l = Wc), (Wc = null));
      var u = xl,
        c = ll;
      if (((Zt = 0), (Nn = xl = null), (ll = 0), (pt & 6) !== 0)) throw Error(f(331));
      var r = pt;
      if (
        ((pt |= 4),
        Gr(u.current),
        qr(u, u.current, c, l),
        (pt = r),
        Ta(0, !1),
        se && typeof se.onPostCommitFiberRoot == 'function')
      )
        try {
          se.onPostCommitFiberRoot(Qn, u);
        } catch {}
      return !0;
    } finally {
      ((w.p = a), (N.T = n), ad(t, e));
    }
  }
  function id(t, e, l) {
    ((e = ze(l, e)),
      (e = Rc(t.stateNode, e, 2)),
      (t = hl(t, e, 2)),
      t !== null && (Zn(t, 2), Ye(t)));
  }
  function xt(t, e, l) {
    if (t.tag === 3) id(t, t, l);
    else
      for (; e !== null; ) {
        if (e.tag === 3) {
          id(e, t, l);
          break;
        } else if (e.tag === 1) {
          var n = e.stateNode;
          if (
            typeof e.type.getDerivedStateFromError == 'function' ||
            (typeof n.componentDidCatch == 'function' && (Sl === null || !Sl.has(n)))
          ) {
            ((t = ze(l, t)),
              (l = cr(2)),
              (n = hl(e, l, 2)),
              n !== null && (fr(l, n, e, t), Zn(n, 2), Ye(n)));
            break;
          }
        }
        e = e.return;
      }
  }
  function tf(t, e, l) {
    var n = t.pingCache;
    if (n === null) {
      n = t.pingCache = new M0();
      var a = new Set();
      n.set(e, a);
    } else ((a = n.get(e)), a === void 0 && ((a = new Set()), n.set(e, a)));
    a.has(l) || ((Kc = !0), a.add(l), (t = D0.bind(null, t, e, l)), e.then(t, t));
  }
  function D0(t, e, l) {
    var n = t.pingCache;
    (n !== null && n.delete(e),
      (t.pingedLanes |= t.suspendedLanes & l),
      (t.warmLanes &= ~l),
      _t === t &&
        (dt & l) === l &&
        (Ut === 4 || (Ut === 3 && (dt & 62914560) === dt && 300 > oe() - Hu)
          ? (pt & 2) === 0 && Cn(t, 0)
          : (Jc |= l),
        Rn === dt && (Rn = 0)),
      Ye(t));
  }
  function cd(t, e) {
    (e === 0 && (e = to()), (t = wl(t, e)), t !== null && (Zn(t, e), Ye(t)));
  }
  function j0(t) {
    var e = t.memoizedState,
      l = 0;
    (e !== null && (l = e.retryLane), cd(t, l));
  }
  function U0(t, e) {
    var l = 0;
    switch (t.tag) {
      case 31:
      case 13:
        var n = t.stateNode,
          a = t.memoizedState;
        a !== null && (l = a.retryLane);
        break;
      case 19:
        n = t.stateNode;
        break;
      case 22:
        n = t.stateNode._retryCache;
        break;
      default:
        throw Error(f(314));
    }
    (n !== null && n.delete(e), cd(t, l));
  }
  function H0(t, e) {
    return mi(t, e);
  }
  var Xu = null,
    jn = null,
    ef = !1,
    Qu = !1,
    lf = !1,
    El = 0;
  function Ye(t) {
    (t !== jn && t.next === null && (jn === null ? (Xu = jn = t) : (jn = jn.next = t)),
      (Qu = !0),
      ef || ((ef = !0), q0()));
  }
  function Ta(t, e) {
    if (!lf && Qu) {
      lf = !0;
      do
        for (var l = !1, n = Xu; n !== null; ) {
          if (t !== 0) {
            var a = n.pendingLanes;
            if (a === 0) var u = 0;
            else {
              var c = n.suspendedLanes,
                r = n.pingedLanes;
              ((u = (1 << (31 - re(42 | t) + 1)) - 1),
                (u &= a & ~(c & ~r)),
                (u = u & 201326741 ? (u & 201326741) | 1 : u ? u | 2 : 0));
            }
            u !== 0 && ((l = !0), rd(n, u));
          } else
            ((u = dt),
              (u = Ja(
                n,
                n === _t ? u : 0,
                n.cancelPendingCommit !== null || n.timeoutHandle !== -1,
              )),
              (u & 3) === 0 || Vn(n, u) || ((l = !0), rd(n, u)));
          n = n.next;
        }
      while (l);
      lf = !1;
    }
  }
  function B0() {
    fd();
  }
  function fd() {
    Qu = ef = !1;
    var t = 0;
    El !== 0 && J0() && (t = El);
    for (var e = oe(), l = null, n = Xu; n !== null; ) {
      var a = n.next,
        u = od(n, e);
      (u === 0
        ? ((n.next = null), l === null ? (Xu = a) : (l.next = a), a === null && (jn = l))
        : ((l = n), (t !== 0 || (u & 3) !== 0) && (Qu = !0)),
        (n = a));
    }
    ((Zt !== 0 && Zt !== 5) || Ta(t), El !== 0 && (El = 0));
  }
  function od(t, e) {
    for (
      var l = t.suspendedLanes,
        n = t.pingedLanes,
        a = t.expirationTimes,
        u = t.pendingLanes & -62914561;
      0 < u;
    ) {
      var c = 31 - re(u),
        r = 1 << c,
        h = a[c];
      (h === -1
        ? ((r & l) === 0 || (r & n) !== 0) && (a[c] = oh(r, e))
        : h <= e && (t.expiredLanes |= r),
        (u &= ~r));
    }
    if (
      ((e = _t),
      (l = dt),
      (l = Ja(t, t === e ? l : 0, t.cancelPendingCommit !== null || t.timeoutHandle !== -1)),
      (n = t.callbackNode),
      l === 0 || (t === e && (St === 2 || St === 9)) || t.cancelPendingCommit !== null)
    )
      return (n !== null && n !== null && hi(n), (t.callbackNode = null), (t.callbackPriority = 0));
    if ((l & 3) === 0 || Vn(t, l)) {
      if (((e = l & -l), e === t.callbackPriority)) return e;
      switch ((n !== null && hi(n), gi(l))) {
        case 2:
        case 8:
          l = If;
          break;
        case 32:
          l = Qa;
          break;
        case 268435456:
          l = Pf;
          break;
        default:
          l = Qa;
      }
      return (
        (n = sd.bind(null, t)),
        (l = mi(l, n)),
        (t.callbackPriority = e),
        (t.callbackNode = l),
        e
      );
    }
    return (
      n !== null && n !== null && hi(n),
      (t.callbackPriority = 2),
      (t.callbackNode = null),
      2
    );
  }
  function sd(t, e) {
    if (Zt !== 0 && Zt !== 5) return ((t.callbackNode = null), (t.callbackPriority = 0), null);
    var l = t.callbackNode;
    if (Lu() && t.callbackNode !== l) return null;
    var n = dt;
    return (
      (n = Ja(t, t === _t ? n : 0, t.cancelPendingCommit !== null || t.timeoutHandle !== -1)),
      n === 0
        ? null
        : (Zr(t, n, e),
          od(t, oe()),
          t.callbackNode != null && t.callbackNode === l ? sd.bind(null, t) : null)
    );
  }
  function rd(t, e) {
    if (Lu()) return null;
    Zr(t, e, !0);
  }
  function q0() {
    k0(function () {
      (pt & 6) !== 0 ? mi(Ff, B0) : fd();
    });
  }
  function nf() {
    if (El === 0) {
      var t = pn;
      (t === 0 && ((t = Va), (Va <<= 1), (Va & 261888) === 0 && (Va = 256)), (El = t));
    }
    return El;
  }
  function dd(t) {
    return t == null || typeof t == 'symbol' || typeof t == 'boolean'
      ? null
      : typeof t == 'function'
        ? t
        : Fa('' + t);
  }
  function md(t, e) {
    var l = e.ownerDocument.createElement('input');
    return (
      (l.name = e.name),
      (l.value = e.value),
      t.id && l.setAttribute('form', t.id),
      e.parentNode.insertBefore(l, e),
      (t = new FormData(t)),
      l.parentNode.removeChild(l),
      t
    );
  }
  function Y0(t, e, l, n, a) {
    if (e === 'submit' && l && l.stateNode === a) {
      var u = dd((a[le] || null).action),
        c = n.submitter;
      c &&
        ((e = (e = c[le] || null) ? dd(e.formAction) : c.getAttribute('formAction')),
        e !== null && ((u = e), (c = null)));
      var r = new eu('action', 'action', null, n, a);
      t.push({
        event: r,
        listeners: [
          {
            instance: null,
            listener: function () {
              if (n.defaultPrevented) {
                if (El !== 0) {
                  var h = c ? md(a, c) : new FormData(a);
                  Ec(l, { pending: !0, data: h, method: a.method, action: u }, null, h);
                }
              } else
                typeof u == 'function' &&
                  (r.preventDefault(),
                  (h = c ? md(a, c) : new FormData(a)),
                  Ec(l, { pending: !0, data: h, method: a.method, action: u }, u, h));
            },
            currentTarget: a,
          },
        ],
      });
    }
  }
  for (var af = 0; af < Gi.length; af++) {
    var uf = Gi[af],
      w0 = uf.toLowerCase(),
      G0 = uf[0].toUpperCase() + uf.slice(1);
    Ce(w0, 'on' + G0);
  }
  (Ce(Vo, 'onAnimationEnd'),
    Ce(Zo, 'onAnimationIteration'),
    Ce(Ko, 'onAnimationStart'),
    Ce('dblclick', 'onDoubleClick'),
    Ce('focusin', 'onFocus'),
    Ce('focusout', 'onBlur'),
    Ce(l0, 'onTransitionRun'),
    Ce(n0, 'onTransitionStart'),
    Ce(a0, 'onTransitionCancel'),
    Ce(Jo, 'onTransitionEnd'),
    nn('onMouseEnter', ['mouseout', 'mouseover']),
    nn('onMouseLeave', ['mouseout', 'mouseover']),
    nn('onPointerEnter', ['pointerout', 'pointerover']),
    nn('onPointerLeave', ['pointerout', 'pointerover']),
    Hl('onChange', 'change click focusin focusout input keydown keyup selectionchange'.split(' ')),
    Hl(
      'onSelect',
      'focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange'.split(
        ' ',
      ),
    ),
    Hl('onBeforeInput', ['compositionend', 'keypress', 'textInput', 'paste']),
    Hl('onCompositionEnd', 'compositionend focusout keydown keypress keyup mousedown'.split(' ')),
    Hl(
      'onCompositionStart',
      'compositionstart focusout keydown keypress keyup mousedown'.split(' '),
    ),
    Hl(
      'onCompositionUpdate',
      'compositionupdate focusout keydown keypress keyup mousedown'.split(' '),
    ));
  var _a =
      'abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting'.split(
        ' ',
      ),
    L0 = new Set(
      'beforetoggle cancel close invalid load scroll scrollend toggle'.split(' ').concat(_a),
    );
  function hd(t, e) {
    e = (e & 4) !== 0;
    for (var l = 0; l < t.length; l++) {
      var n = t[l],
        a = n.event;
      n = n.listeners;
      t: {
        var u = void 0;
        if (e)
          for (var c = n.length - 1; 0 <= c; c--) {
            var r = n[c],
              h = r.instance,
              T = r.currentTarget;
            if (((r = r.listener), h !== u && a.isPropagationStopped())) break t;
            ((u = r), (a.currentTarget = T));
            try {
              u(a);
            } catch (C) {
              au(C);
            }
            ((a.currentTarget = null), (u = h));
          }
        else
          for (c = 0; c < n.length; c++) {
            if (
              ((r = n[c]),
              (h = r.instance),
              (T = r.currentTarget),
              (r = r.listener),
              h !== u && a.isPropagationStopped())
            )
              break t;
            ((u = r), (a.currentTarget = T));
            try {
              u(a);
            } catch (C) {
              au(C);
            }
            ((a.currentTarget = null), (u = h));
          }
      }
    }
  }
  function rt(t, e) {
    var l = e[pi];
    l === void 0 && (l = e[pi] = new Set());
    var n = t + '__bubble';
    l.has(n) || (yd(e, t, 2, !1), l.add(n));
  }
  function cf(t, e, l) {
    var n = 0;
    (e && (n |= 4), yd(l, t, n, e));
  }
  var Vu = '_reactListening' + Math.random().toString(36).slice(2);
  function ff(t) {
    if (!t[Vu]) {
      ((t[Vu] = !0),
        co.forEach(function (l) {
          l !== 'selectionchange' && (L0.has(l) || cf(l, !1, t), cf(l, !0, t));
        }));
      var e = t.nodeType === 9 ? t : t.ownerDocument;
      e === null || e[Vu] || ((e[Vu] = !0), cf('selectionchange', !1, e));
    }
  }
  function yd(t, e, l, n) {
    switch (Vd(e)) {
      case 2:
        var a = yy;
        break;
      case 8:
        a = vy;
        break;
      default:
        a = Ef;
    }
    ((l = a.bind(null, e, l, t)),
      (a = void 0),
      !Mi || (e !== 'touchstart' && e !== 'touchmove' && e !== 'wheel') || (a = !0),
      n
        ? a !== void 0
          ? t.addEventListener(e, l, { capture: !0, passive: a })
          : t.addEventListener(e, l, !0)
        : a !== void 0
          ? t.addEventListener(e, l, { passive: a })
          : t.addEventListener(e, l, !1));
  }
  function of(t, e, l, n, a) {
    var u = n;
    if ((e & 1) === 0 && (e & 2) === 0 && n !== null)
      t: for (;;) {
        if (n === null) return;
        var c = n.tag;
        if (c === 3 || c === 4) {
          var r = n.stateNode.containerInfo;
          if (r === a) break;
          if (c === 4)
            for (c = n.return; c !== null; ) {
              var h = c.tag;
              if ((h === 3 || h === 4) && c.stateNode.containerInfo === a) return;
              c = c.return;
            }
          for (; r !== null; ) {
            if (((c = tn(r)), c === null)) return;
            if (((h = c.tag), h === 5 || h === 6 || h === 26 || h === 27)) {
              n = u = c;
              continue t;
            }
            r = r.parentNode;
          }
        }
        n = n.return;
      }
    So(function () {
      var T = u,
        C = Ti(l),
        U = [];
      t: {
        var _ = $o.get(t);
        if (_ !== void 0) {
          var O = eu,
            K = t;
          switch (t) {
            case 'keypress':
              if (Pa(l) === 0) break t;
            case 'keydown':
            case 'keyup':
              O = Uh;
              break;
            case 'focusin':
              ((K = 'focus'), (O = Ci));
              break;
            case 'focusout':
              ((K = 'blur'), (O = Ci));
              break;
            case 'beforeblur':
            case 'afterblur':
              O = Ci;
              break;
            case 'click':
              if (l.button === 2) break t;
            case 'auxclick':
            case 'dblclick':
            case 'mousedown':
            case 'mousemove':
            case 'mouseup':
            case 'mouseout':
            case 'mouseover':
            case 'contextmenu':
              O = Eo;
              break;
            case 'drag':
            case 'dragend':
            case 'dragenter':
            case 'dragexit':
            case 'dragleave':
            case 'dragover':
            case 'dragstart':
            case 'drop':
              O = zh;
              break;
            case 'touchcancel':
            case 'touchend':
            case 'touchmove':
            case 'touchstart':
              O = qh;
              break;
            case Vo:
            case Zo:
            case Ko:
              O = Th;
              break;
            case Jo:
              O = wh;
              break;
            case 'scroll':
            case 'scrollend':
              O = Sh;
              break;
            case 'wheel':
              O = Lh;
              break;
            case 'copy':
            case 'cut':
            case 'paste':
              O = Mh;
              break;
            case 'gotpointercapture':
            case 'lostpointercapture':
            case 'pointercancel':
            case 'pointerdown':
            case 'pointermove':
            case 'pointerout':
            case 'pointerover':
            case 'pointerup':
              O = To;
              break;
            case 'toggle':
            case 'beforetoggle':
              O = Qh;
          }
          var lt = (e & 4) !== 0,
            Tt = !lt && (t === 'scroll' || t === 'scrollend'),
            z = lt ? (_ !== null ? _ + 'Capture' : null) : _;
          lt = [];
          for (var b = T, A; b !== null; ) {
            var D = b;
            if (
              ((A = D.stateNode),
              (D = D.tag),
              (D !== 5 && D !== 26 && D !== 27) ||
                A === null ||
                z === null ||
                ((D = $n(b, z)), D != null && lt.push(Ma(b, D, A))),
              Tt)
            )
              break;
            b = b.return;
          }
          0 < lt.length && ((_ = new O(_, K, null, l, C)), U.push({ event: _, listeners: lt }));
        }
      }
      if ((e & 7) === 0) {
        t: {
          if (
            ((_ = t === 'mouseover' || t === 'pointerover'),
            (O = t === 'mouseout' || t === 'pointerout'),
            _ && l !== Ai && (K = l.relatedTarget || l.fromElement) && (tn(K) || K[Pl]))
          )
            break t;
          if (
            (O || _) &&
            ((_ =
              C.window === C
                ? C
                : (_ = C.ownerDocument)
                  ? _.defaultView || _.parentWindow
                  : window),
            O
              ? ((K = l.relatedTarget || l.toElement),
                (O = T),
                (K = K ? tn(K) : null),
                K !== null &&
                  ((Tt = d(K)), (lt = K.tag), K !== Tt || (lt !== 5 && lt !== 27 && lt !== 6)) &&
                  (K = null))
              : ((O = null), (K = T)),
            O !== K)
          ) {
            if (
              ((lt = Eo),
              (D = 'onMouseLeave'),
              (z = 'onMouseEnter'),
              (b = 'mouse'),
              (t === 'pointerout' || t === 'pointerover') &&
                ((lt = To), (D = 'onPointerLeave'), (z = 'onPointerEnter'), (b = 'pointer')),
              (Tt = O == null ? _ : Jn(O)),
              (A = K == null ? _ : Jn(K)),
              (_ = new lt(D, b + 'leave', O, l, C)),
              (_.target = Tt),
              (_.relatedTarget = A),
              (D = null),
              tn(C) === T &&
                ((lt = new lt(z, b + 'enter', K, l, C)),
                (lt.target = A),
                (lt.relatedTarget = Tt),
                (D = lt)),
              (Tt = D),
              O && K)
            )
              e: {
                for (lt = X0, z = O, b = K, A = 0, D = z; D; D = lt(D)) A++;
                D = 0;
                for (var P = b; P; P = lt(P)) D++;
                for (; 0 < A - D; ) ((z = lt(z)), A--);
                for (; 0 < D - A; ) ((b = lt(b)), D--);
                for (; A--; ) {
                  if (z === b || (b !== null && z === b.alternate)) {
                    lt = z;
                    break e;
                  }
                  ((z = lt(z)), (b = lt(b)));
                }
                lt = null;
              }
            else lt = null;
            (O !== null && vd(U, _, O, lt, !1), K !== null && Tt !== null && vd(U, Tt, K, lt, !0));
          }
        }
        t: {
          if (
            ((_ = T ? Jn(T) : window),
            (O = _.nodeName && _.nodeName.toLowerCase()),
            O === 'select' || (O === 'input' && _.type === 'file'))
          )
            var vt = jo;
          else if (Co(_))
            if (Uo) vt = Ph;
            else {
              vt = Fh;
              var W = Wh;
            }
          else
            ((O = _.nodeName),
              !O || O.toLowerCase() !== 'input' || (_.type !== 'checkbox' && _.type !== 'radio')
                ? T && Ei(T.elementType) && (vt = jo)
                : (vt = Ih));
          if (vt && (vt = vt(t, T))) {
            Do(U, vt, l, C);
            break t;
          }
          (W && W(t, _, T),
            t === 'focusout' &&
              T &&
              _.type === 'number' &&
              T.memoizedProps.value != null &&
              zi(_, 'number', _.value));
        }
        switch (((W = T ? Jn(T) : window), t)) {
          case 'focusin':
            (Co(W) || W.contentEditable === 'true') && ((sn = W), (qi = T), (la = null));
            break;
          case 'focusout':
            la = qi = sn = null;
            break;
          case 'mousedown':
            Yi = !0;
            break;
          case 'contextmenu':
          case 'mouseup':
          case 'dragend':
            ((Yi = !1), Xo(U, l, C));
            break;
          case 'selectionchange':
            if (e0) break;
          case 'keydown':
          case 'keyup':
            Xo(U, l, C);
        }
        var ct;
        if (ji)
          t: {
            switch (t) {
              case 'compositionstart':
                var mt = 'onCompositionStart';
                break t;
              case 'compositionend':
                mt = 'onCompositionEnd';
                break t;
              case 'compositionupdate':
                mt = 'onCompositionUpdate';
                break t;
            }
            mt = void 0;
          }
        else
          on
            ? Ro(t, l) && (mt = 'onCompositionEnd')
            : t === 'keydown' && l.keyCode === 229 && (mt = 'onCompositionStart');
        (mt &&
          (_o &&
            l.locale !== 'ko' &&
            (on || mt !== 'onCompositionStart'
              ? mt === 'onCompositionEnd' && on && (ct = xo())
              : ((cl = C), (Oi = 'value' in cl ? cl.value : cl.textContent), (on = !0))),
          (W = Zu(T, mt)),
          0 < W.length &&
            ((mt = new Ao(mt, t, null, l, C)),
            U.push({ event: mt, listeners: W }),
            ct ? (mt.data = ct) : ((ct = No(l)), ct !== null && (mt.data = ct)))),
          (ct = Zh ? Kh(t, l) : Jh(t, l)) &&
            ((mt = Zu(T, 'onBeforeInput')),
            0 < mt.length &&
              ((W = new Ao('onBeforeInput', 'beforeinput', null, l, C)),
              U.push({ event: W, listeners: mt }),
              (W.data = ct))),
          Y0(U, t, T, l, C));
      }
      hd(U, e);
    });
  }
  function Ma(t, e, l) {
    return { instance: t, listener: e, currentTarget: l };
  }
  function Zu(t, e) {
    for (var l = e + 'Capture', n = []; t !== null; ) {
      var a = t,
        u = a.stateNode;
      if (
        ((a = a.tag),
        (a !== 5 && a !== 26 && a !== 27) ||
          u === null ||
          ((a = $n(t, l)),
          a != null && n.unshift(Ma(t, a, u)),
          (a = $n(t, e)),
          a != null && n.push(Ma(t, a, u))),
        t.tag === 3)
      )
        return n;
      t = t.return;
    }
    return [];
  }
  function X0(t) {
    if (t === null) return null;
    do t = t.return;
    while (t && t.tag !== 5 && t.tag !== 27);
    return t || null;
  }
  function vd(t, e, l, n, a) {
    for (var u = e._reactName, c = []; l !== null && l !== n; ) {
      var r = l,
        h = r.alternate,
        T = r.stateNode;
      if (((r = r.tag), h !== null && h === n)) break;
      ((r !== 5 && r !== 26 && r !== 27) ||
        T === null ||
        ((h = T),
        a
          ? ((T = $n(l, u)), T != null && c.unshift(Ma(l, T, h)))
          : a || ((T = $n(l, u)), T != null && c.push(Ma(l, T, h)))),
        (l = l.return));
    }
    c.length !== 0 && t.push({ event: e, listeners: c });
  }
  var Q0 = /\r\n?/g,
    V0 = /\u0000|\uFFFD/g;
  function gd(t) {
    return (typeof t == 'string' ? t : '' + t)
      .replace(
        Q0,
        `
`,
      )
      .replace(V0, '');
  }
  function pd(t, e) {
    return ((e = gd(e)), gd(t) === e);
  }
  function At(t, e, l, n, a, u) {
    switch (l) {
      case 'children':
        typeof n == 'string'
          ? e === 'body' || (e === 'textarea' && n === '') || un(t, n)
          : (typeof n == 'number' || typeof n == 'bigint') && e !== 'body' && un(t, '' + n);
        break;
      case 'className':
        ka(t, 'class', n);
        break;
      case 'tabIndex':
        ka(t, 'tabindex', n);
        break;
      case 'dir':
      case 'role':
      case 'viewBox':
      case 'width':
      case 'height':
        ka(t, l, n);
        break;
      case 'style':
        po(t, n, u);
        break;
      case 'data':
        if (e !== 'object') {
          ka(t, 'data', n);
          break;
        }
      case 'src':
      case 'href':
        if (n === '' && (e !== 'a' || l !== 'href')) {
          t.removeAttribute(l);
          break;
        }
        if (n == null || typeof n == 'function' || typeof n == 'symbol' || typeof n == 'boolean') {
          t.removeAttribute(l);
          break;
        }
        ((n = Fa('' + n)), t.setAttribute(l, n));
        break;
      case 'action':
      case 'formAction':
        if (typeof n == 'function') {
          t.setAttribute(
            l,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')",
          );
          break;
        } else
          typeof u == 'function' &&
            (l === 'formAction'
              ? (e !== 'input' && At(t, e, 'name', a.name, a, null),
                At(t, e, 'formEncType', a.formEncType, a, null),
                At(t, e, 'formMethod', a.formMethod, a, null),
                At(t, e, 'formTarget', a.formTarget, a, null))
              : (At(t, e, 'encType', a.encType, a, null),
                At(t, e, 'method', a.method, a, null),
                At(t, e, 'target', a.target, a, null)));
        if (n == null || typeof n == 'symbol' || typeof n == 'boolean') {
          t.removeAttribute(l);
          break;
        }
        ((n = Fa('' + n)), t.setAttribute(l, n));
        break;
      case 'onClick':
        n != null && (t.onclick = Le);
        break;
      case 'onScroll':
        n != null && rt('scroll', t);
        break;
      case 'onScrollEnd':
        n != null && rt('scrollend', t);
        break;
      case 'dangerouslySetInnerHTML':
        if (n != null) {
          if (typeof n != 'object' || !('__html' in n)) throw Error(f(61));
          if (((l = n.__html), l != null)) {
            if (a.children != null) throw Error(f(60));
            t.innerHTML = l;
          }
        }
        break;
      case 'multiple':
        t.multiple = n && typeof n != 'function' && typeof n != 'symbol';
        break;
      case 'muted':
        t.muted = n && typeof n != 'function' && typeof n != 'symbol';
        break;
      case 'suppressContentEditableWarning':
      case 'suppressHydrationWarning':
      case 'defaultValue':
      case 'defaultChecked':
      case 'innerHTML':
      case 'ref':
        break;
      case 'autoFocus':
        break;
      case 'xlinkHref':
        if (n == null || typeof n == 'function' || typeof n == 'boolean' || typeof n == 'symbol') {
          t.removeAttribute('xlink:href');
          break;
        }
        ((l = Fa('' + n)), t.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', l));
        break;
      case 'contentEditable':
      case 'spellCheck':
      case 'draggable':
      case 'value':
      case 'autoReverse':
      case 'externalResourcesRequired':
      case 'focusable':
      case 'preserveAlpha':
        n != null && typeof n != 'function' && typeof n != 'symbol'
          ? t.setAttribute(l, '' + n)
          : t.removeAttribute(l);
        break;
      case 'inert':
      case 'allowFullScreen':
      case 'async':
      case 'autoPlay':
      case 'controls':
      case 'default':
      case 'defer':
      case 'disabled':
      case 'disablePictureInPicture':
      case 'disableRemotePlayback':
      case 'formNoValidate':
      case 'hidden':
      case 'loop':
      case 'noModule':
      case 'noValidate':
      case 'open':
      case 'playsInline':
      case 'readOnly':
      case 'required':
      case 'reversed':
      case 'scoped':
      case 'seamless':
      case 'itemScope':
        n && typeof n != 'function' && typeof n != 'symbol'
          ? t.setAttribute(l, '')
          : t.removeAttribute(l);
        break;
      case 'capture':
      case 'download':
        n === !0
          ? t.setAttribute(l, '')
          : n !== !1 && n != null && typeof n != 'function' && typeof n != 'symbol'
            ? t.setAttribute(l, n)
            : t.removeAttribute(l);
        break;
      case 'cols':
      case 'rows':
      case 'size':
      case 'span':
        n != null && typeof n != 'function' && typeof n != 'symbol' && !isNaN(n) && 1 <= n
          ? t.setAttribute(l, n)
          : t.removeAttribute(l);
        break;
      case 'rowSpan':
      case 'start':
        n == null || typeof n == 'function' || typeof n == 'symbol' || isNaN(n)
          ? t.removeAttribute(l)
          : t.setAttribute(l, n);
        break;
      case 'popover':
        (rt('beforetoggle', t), rt('toggle', t), $a(t, 'popover', n));
        break;
      case 'xlinkActuate':
        Ge(t, 'http://www.w3.org/1999/xlink', 'xlink:actuate', n);
        break;
      case 'xlinkArcrole':
        Ge(t, 'http://www.w3.org/1999/xlink', 'xlink:arcrole', n);
        break;
      case 'xlinkRole':
        Ge(t, 'http://www.w3.org/1999/xlink', 'xlink:role', n);
        break;
      case 'xlinkShow':
        Ge(t, 'http://www.w3.org/1999/xlink', 'xlink:show', n);
        break;
      case 'xlinkTitle':
        Ge(t, 'http://www.w3.org/1999/xlink', 'xlink:title', n);
        break;
      case 'xlinkType':
        Ge(t, 'http://www.w3.org/1999/xlink', 'xlink:type', n);
        break;
      case 'xmlBase':
        Ge(t, 'http://www.w3.org/XML/1998/namespace', 'xml:base', n);
        break;
      case 'xmlLang':
        Ge(t, 'http://www.w3.org/XML/1998/namespace', 'xml:lang', n);
        break;
      case 'xmlSpace':
        Ge(t, 'http://www.w3.org/XML/1998/namespace', 'xml:space', n);
        break;
      case 'is':
        $a(t, 'is', n);
        break;
      case 'innerText':
      case 'textContent':
        break;
      default:
        (!(2 < l.length) || (l[0] !== 'o' && l[0] !== 'O') || (l[1] !== 'n' && l[1] !== 'N')) &&
          ((l = ph.get(l) || l), $a(t, l, n));
    }
  }
  function sf(t, e, l, n, a, u) {
    switch (l) {
      case 'style':
        po(t, n, u);
        break;
      case 'dangerouslySetInnerHTML':
        if (n != null) {
          if (typeof n != 'object' || !('__html' in n)) throw Error(f(61));
          if (((l = n.__html), l != null)) {
            if (a.children != null) throw Error(f(60));
            t.innerHTML = l;
          }
        }
        break;
      case 'children':
        typeof n == 'string'
          ? un(t, n)
          : (typeof n == 'number' || typeof n == 'bigint') && un(t, '' + n);
        break;
      case 'onScroll':
        n != null && rt('scroll', t);
        break;
      case 'onScrollEnd':
        n != null && rt('scrollend', t);
        break;
      case 'onClick':
        n != null && (t.onclick = Le);
        break;
      case 'suppressContentEditableWarning':
      case 'suppressHydrationWarning':
      case 'innerHTML':
      case 'ref':
        break;
      case 'innerText':
      case 'textContent':
        break;
      default:
        if (!fo.hasOwnProperty(l))
          t: {
            if (
              l[0] === 'o' &&
              l[1] === 'n' &&
              ((a = l.endsWith('Capture')),
              (e = l.slice(2, a ? l.length - 7 : void 0)),
              (u = t[le] || null),
              (u = u != null ? u[l] : null),
              typeof u == 'function' && t.removeEventListener(e, u, a),
              typeof n == 'function')
            ) {
              (typeof u != 'function' &&
                u !== null &&
                (l in t ? (t[l] = null) : t.hasAttribute(l) && t.removeAttribute(l)),
                t.addEventListener(e, n, a));
              break t;
            }
            l in t ? (t[l] = n) : n === !0 ? t.setAttribute(l, '') : $a(t, l, n);
          }
    }
  }
  function It(t, e, l) {
    switch (e) {
      case 'div':
      case 'span':
      case 'svg':
      case 'path':
      case 'a':
      case 'g':
      case 'p':
      case 'li':
        break;
      case 'img':
        (rt('error', t), rt('load', t));
        var n = !1,
          a = !1,
          u;
        for (u in l)
          if (l.hasOwnProperty(u)) {
            var c = l[u];
            if (c != null)
              switch (u) {
                case 'src':
                  n = !0;
                  break;
                case 'srcSet':
                  a = !0;
                  break;
                case 'children':
                case 'dangerouslySetInnerHTML':
                  throw Error(f(137, e));
                default:
                  At(t, e, u, c, l, null);
              }
          }
        (a && At(t, e, 'srcSet', l.srcSet, l, null), n && At(t, e, 'src', l.src, l, null));
        return;
      case 'input':
        rt('invalid', t);
        var r = (u = c = a = null),
          h = null,
          T = null;
        for (n in l)
          if (l.hasOwnProperty(n)) {
            var C = l[n];
            if (C != null)
              switch (n) {
                case 'name':
                  a = C;
                  break;
                case 'type':
                  c = C;
                  break;
                case 'checked':
                  h = C;
                  break;
                case 'defaultChecked':
                  T = C;
                  break;
                case 'value':
                  u = C;
                  break;
                case 'defaultValue':
                  r = C;
                  break;
                case 'children':
                case 'dangerouslySetInnerHTML':
                  if (C != null) throw Error(f(137, e));
                  break;
                default:
                  At(t, e, n, C, l, null);
              }
          }
        ho(t, u, r, h, T, c, a, !1);
        return;
      case 'select':
        (rt('invalid', t), (n = c = u = null));
        for (a in l)
          if (l.hasOwnProperty(a) && ((r = l[a]), r != null))
            switch (a) {
              case 'value':
                u = r;
                break;
              case 'defaultValue':
                c = r;
                break;
              case 'multiple':
                n = r;
              default:
                At(t, e, a, r, l, null);
            }
        ((e = u),
          (l = c),
          (t.multiple = !!n),
          e != null ? an(t, !!n, e, !1) : l != null && an(t, !!n, l, !0));
        return;
      case 'textarea':
        (rt('invalid', t), (u = a = n = null));
        for (c in l)
          if (l.hasOwnProperty(c) && ((r = l[c]), r != null))
            switch (c) {
              case 'value':
                n = r;
                break;
              case 'defaultValue':
                a = r;
                break;
              case 'children':
                u = r;
                break;
              case 'dangerouslySetInnerHTML':
                if (r != null) throw Error(f(91));
                break;
              default:
                At(t, e, c, r, l, null);
            }
        vo(t, n, a, u);
        return;
      case 'option':
        for (h in l)
          if (l.hasOwnProperty(h) && ((n = l[h]), n != null))
            switch (h) {
              case 'selected':
                t.selected = n && typeof n != 'function' && typeof n != 'symbol';
                break;
              default:
                At(t, e, h, n, l, null);
            }
        return;
      case 'dialog':
        (rt('beforetoggle', t), rt('toggle', t), rt('cancel', t), rt('close', t));
        break;
      case 'iframe':
      case 'object':
        rt('load', t);
        break;
      case 'video':
      case 'audio':
        for (n = 0; n < _a.length; n++) rt(_a[n], t);
        break;
      case 'image':
        (rt('error', t), rt('load', t));
        break;
      case 'details':
        rt('toggle', t);
        break;
      case 'embed':
      case 'source':
      case 'link':
        (rt('error', t), rt('load', t));
      case 'area':
      case 'base':
      case 'br':
      case 'col':
      case 'hr':
      case 'keygen':
      case 'meta':
      case 'param':
      case 'track':
      case 'wbr':
      case 'menuitem':
        for (T in l)
          if (l.hasOwnProperty(T) && ((n = l[T]), n != null))
            switch (T) {
              case 'children':
              case 'dangerouslySetInnerHTML':
                throw Error(f(137, e));
              default:
                At(t, e, T, n, l, null);
            }
        return;
      default:
        if (Ei(e)) {
          for (C in l)
            l.hasOwnProperty(C) && ((n = l[C]), n !== void 0 && sf(t, e, C, n, l, void 0));
          return;
        }
    }
    for (r in l) l.hasOwnProperty(r) && ((n = l[r]), n != null && At(t, e, r, n, l, null));
  }
  function Z0(t, e, l, n) {
    switch (e) {
      case 'div':
      case 'span':
      case 'svg':
      case 'path':
      case 'a':
      case 'g':
      case 'p':
      case 'li':
        break;
      case 'input':
        var a = null,
          u = null,
          c = null,
          r = null,
          h = null,
          T = null,
          C = null;
        for (O in l) {
          var U = l[O];
          if (l.hasOwnProperty(O) && U != null)
            switch (O) {
              case 'checked':
                break;
              case 'value':
                break;
              case 'defaultValue':
                h = U;
              default:
                n.hasOwnProperty(O) || At(t, e, O, null, n, U);
            }
        }
        for (var _ in n) {
          var O = n[_];
          if (((U = l[_]), n.hasOwnProperty(_) && (O != null || U != null)))
            switch (_) {
              case 'type':
                u = O;
                break;
              case 'name':
                a = O;
                break;
              case 'checked':
                T = O;
                break;
              case 'defaultChecked':
                C = O;
                break;
              case 'value':
                c = O;
                break;
              case 'defaultValue':
                r = O;
                break;
              case 'children':
              case 'dangerouslySetInnerHTML':
                if (O != null) throw Error(f(137, e));
                break;
              default:
                O !== U && At(t, e, _, O, n, U);
            }
        }
        xi(t, c, r, h, T, C, u, a);
        return;
      case 'select':
        O = c = r = _ = null;
        for (u in l)
          if (((h = l[u]), l.hasOwnProperty(u) && h != null))
            switch (u) {
              case 'value':
                break;
              case 'multiple':
                O = h;
              default:
                n.hasOwnProperty(u) || At(t, e, u, null, n, h);
            }
        for (a in n)
          if (((u = n[a]), (h = l[a]), n.hasOwnProperty(a) && (u != null || h != null)))
            switch (a) {
              case 'value':
                _ = u;
                break;
              case 'defaultValue':
                r = u;
                break;
              case 'multiple':
                c = u;
              default:
                u !== h && At(t, e, a, u, n, h);
            }
        ((e = r),
          (l = c),
          (n = O),
          _ != null
            ? an(t, !!l, _, !1)
            : !!n != !!l && (e != null ? an(t, !!l, e, !0) : an(t, !!l, l ? [] : '', !1)));
        return;
      case 'textarea':
        O = _ = null;
        for (r in l)
          if (((a = l[r]), l.hasOwnProperty(r) && a != null && !n.hasOwnProperty(r)))
            switch (r) {
              case 'value':
                break;
              case 'children':
                break;
              default:
                At(t, e, r, null, n, a);
            }
        for (c in n)
          if (((a = n[c]), (u = l[c]), n.hasOwnProperty(c) && (a != null || u != null)))
            switch (c) {
              case 'value':
                _ = a;
                break;
              case 'defaultValue':
                O = a;
                break;
              case 'children':
                break;
              case 'dangerouslySetInnerHTML':
                if (a != null) throw Error(f(91));
                break;
              default:
                a !== u && At(t, e, c, a, n, u);
            }
        yo(t, _, O);
        return;
      case 'option':
        for (var K in l)
          if (((_ = l[K]), l.hasOwnProperty(K) && _ != null && !n.hasOwnProperty(K)))
            switch (K) {
              case 'selected':
                t.selected = !1;
                break;
              default:
                At(t, e, K, null, n, _);
            }
        for (h in n)
          if (((_ = n[h]), (O = l[h]), n.hasOwnProperty(h) && _ !== O && (_ != null || O != null)))
            switch (h) {
              case 'selected':
                t.selected = _ && typeof _ != 'function' && typeof _ != 'symbol';
                break;
              default:
                At(t, e, h, _, n, O);
            }
        return;
      case 'img':
      case 'link':
      case 'area':
      case 'base':
      case 'br':
      case 'col':
      case 'embed':
      case 'hr':
      case 'keygen':
      case 'meta':
      case 'param':
      case 'source':
      case 'track':
      case 'wbr':
      case 'menuitem':
        for (var lt in l)
          ((_ = l[lt]),
            l.hasOwnProperty(lt) && _ != null && !n.hasOwnProperty(lt) && At(t, e, lt, null, n, _));
        for (T in n)
          if (((_ = n[T]), (O = l[T]), n.hasOwnProperty(T) && _ !== O && (_ != null || O != null)))
            switch (T) {
              case 'children':
              case 'dangerouslySetInnerHTML':
                if (_ != null) throw Error(f(137, e));
                break;
              default:
                At(t, e, T, _, n, O);
            }
        return;
      default:
        if (Ei(e)) {
          for (var Tt in l)
            ((_ = l[Tt]),
              l.hasOwnProperty(Tt) &&
                _ !== void 0 &&
                !n.hasOwnProperty(Tt) &&
                sf(t, e, Tt, void 0, n, _));
          for (C in n)
            ((_ = n[C]),
              (O = l[C]),
              !n.hasOwnProperty(C) ||
                _ === O ||
                (_ === void 0 && O === void 0) ||
                sf(t, e, C, _, n, O));
          return;
        }
    }
    for (var z in l)
      ((_ = l[z]),
        l.hasOwnProperty(z) && _ != null && !n.hasOwnProperty(z) && At(t, e, z, null, n, _));
    for (U in n)
      ((_ = n[U]),
        (O = l[U]),
        !n.hasOwnProperty(U) || _ === O || (_ == null && O == null) || At(t, e, U, _, n, O));
  }
  function bd(t) {
    switch (t) {
      case 'css':
      case 'script':
      case 'font':
      case 'img':
      case 'image':
      case 'input':
      case 'link':
        return !0;
      default:
        return !1;
    }
  }
  function K0() {
    if (typeof performance.getEntriesByType == 'function') {
      for (
        var t = 0, e = 0, l = performance.getEntriesByType('resource'), n = 0;
        n < l.length;
        n++
      ) {
        var a = l[n],
          u = a.transferSize,
          c = a.initiatorType,
          r = a.duration;
        if (u && r && bd(c)) {
          for (c = 0, r = a.responseEnd, n += 1; n < l.length; n++) {
            var h = l[n],
              T = h.startTime;
            if (T > r) break;
            var C = h.transferSize,
              U = h.initiatorType;
            C && bd(U) && ((h = h.responseEnd), (c += C * (h < r ? 1 : (r - T) / (h - T))));
          }
          if ((--n, (e += (8 * (u + c)) / (a.duration / 1e3)), t++, 10 < t)) break;
        }
      }
      if (0 < t) return e / t / 1e6;
    }
    return navigator.connection && ((t = navigator.connection.downlink), typeof t == 'number')
      ? t
      : 5;
  }
  var rf = null,
    df = null;
  function Ku(t) {
    return t.nodeType === 9 ? t : t.ownerDocument;
  }
  function Sd(t) {
    switch (t) {
      case 'http://www.w3.org/2000/svg':
        return 1;
      case 'http://www.w3.org/1998/Math/MathML':
        return 2;
      default:
        return 0;
    }
  }
  function xd(t, e) {
    if (t === 0)
      switch (e) {
        case 'svg':
          return 1;
        case 'math':
          return 2;
        default:
          return 0;
      }
    return t === 1 && e === 'foreignObject' ? 0 : t;
  }
  function mf(t, e) {
    return (
      t === 'textarea' ||
      t === 'noscript' ||
      typeof e.children == 'string' ||
      typeof e.children == 'number' ||
      typeof e.children == 'bigint' ||
      (typeof e.dangerouslySetInnerHTML == 'object' &&
        e.dangerouslySetInnerHTML !== null &&
        e.dangerouslySetInnerHTML.__html != null)
    );
  }
  var hf = null;
  function J0() {
    var t = window.event;
    return t && t.type === 'popstate' ? (t === hf ? !1 : ((hf = t), !0)) : ((hf = null), !1);
  }
  var zd = typeof setTimeout == 'function' ? setTimeout : void 0,
    $0 = typeof clearTimeout == 'function' ? clearTimeout : void 0,
    Ed = typeof Promise == 'function' ? Promise : void 0,
    k0 =
      typeof queueMicrotask == 'function'
        ? queueMicrotask
        : typeof Ed < 'u'
          ? function (t) {
              return Ed.resolve(null).then(t).catch(W0);
            }
          : zd;
  function W0(t) {
    setTimeout(function () {
      throw t;
    });
  }
  function Al(t) {
    return t === 'head';
  }
  function Ad(t, e) {
    var l = e,
      n = 0;
    do {
      var a = l.nextSibling;
      if ((t.removeChild(l), a && a.nodeType === 8))
        if (((l = a.data), l === '/$' || l === '/&')) {
          if (n === 0) {
            (t.removeChild(a), qn(e));
            return;
          }
          n--;
        } else if (l === '$' || l === '$?' || l === '$~' || l === '$!' || l === '&') n++;
        else if (l === 'html') Oa(t.ownerDocument.documentElement);
        else if (l === 'head') {
          ((l = t.ownerDocument.head), Oa(l));
          for (var u = l.firstChild; u; ) {
            var c = u.nextSibling,
              r = u.nodeName;
            (u[Kn] ||
              r === 'SCRIPT' ||
              r === 'STYLE' ||
              (r === 'LINK' && u.rel.toLowerCase() === 'stylesheet') ||
              l.removeChild(u),
              (u = c));
          }
        } else l === 'body' && Oa(t.ownerDocument.body);
      l = a;
    } while (l);
    qn(e);
  }
  function Td(t, e) {
    var l = t;
    t = 0;
    do {
      var n = l.nextSibling;
      if (
        (l.nodeType === 1
          ? e
            ? ((l._stashedDisplay = l.style.display), (l.style.display = 'none'))
            : ((l.style.display = l._stashedDisplay || ''),
              l.getAttribute('style') === '' && l.removeAttribute('style'))
          : l.nodeType === 3 &&
            (e
              ? ((l._stashedText = l.nodeValue), (l.nodeValue = ''))
              : (l.nodeValue = l._stashedText || '')),
        n && n.nodeType === 8)
      )
        if (((l = n.data), l === '/$')) {
          if (t === 0) break;
          t--;
        } else (l !== '$' && l !== '$?' && l !== '$~' && l !== '$!') || t++;
      l = n;
    } while (l);
  }
  function yf(t) {
    var e = t.firstChild;
    for (e && e.nodeType === 10 && (e = e.nextSibling); e; ) {
      var l = e;
      switch (((e = e.nextSibling), l.nodeName)) {
        case 'HTML':
        case 'HEAD':
        case 'BODY':
          (yf(l), bi(l));
          continue;
        case 'SCRIPT':
        case 'STYLE':
          continue;
        case 'LINK':
          if (l.rel.toLowerCase() === 'stylesheet') continue;
      }
      t.removeChild(l);
    }
  }
  function F0(t, e, l, n) {
    for (; t.nodeType === 1; ) {
      var a = l;
      if (t.nodeName.toLowerCase() !== e.toLowerCase()) {
        if (!n && (t.nodeName !== 'INPUT' || t.type !== 'hidden')) break;
      } else if (n) {
        if (!t[Kn])
          switch (e) {
            case 'meta':
              if (!t.hasAttribute('itemprop')) break;
              return t;
            case 'link':
              if (
                ((u = t.getAttribute('rel')),
                u === 'stylesheet' && t.hasAttribute('data-precedence'))
              )
                break;
              if (
                u !== a.rel ||
                t.getAttribute('href') !== (a.href == null || a.href === '' ? null : a.href) ||
                t.getAttribute('crossorigin') !== (a.crossOrigin == null ? null : a.crossOrigin) ||
                t.getAttribute('title') !== (a.title == null ? null : a.title)
              )
                break;
              return t;
            case 'style':
              if (t.hasAttribute('data-precedence')) break;
              return t;
            case 'script':
              if (
                ((u = t.getAttribute('src')),
                (u !== (a.src == null ? null : a.src) ||
                  t.getAttribute('type') !== (a.type == null ? null : a.type) ||
                  t.getAttribute('crossorigin') !==
                    (a.crossOrigin == null ? null : a.crossOrigin)) &&
                  u &&
                  t.hasAttribute('async') &&
                  !t.hasAttribute('itemprop'))
              )
                break;
              return t;
            default:
              return t;
          }
      } else if (e === 'input' && t.type === 'hidden') {
        var u = a.name == null ? null : '' + a.name;
        if (a.type === 'hidden' && t.getAttribute('name') === u) return t;
      } else return t;
      if (((t = Me(t.nextSibling)), t === null)) break;
    }
    return null;
  }
  function I0(t, e, l) {
    if (e === '') return null;
    for (; t.nodeType !== 3; )
      if (
        ((t.nodeType !== 1 || t.nodeName !== 'INPUT' || t.type !== 'hidden') && !l) ||
        ((t = Me(t.nextSibling)), t === null)
      )
        return null;
    return t;
  }
  function _d(t, e) {
    for (; t.nodeType !== 8; )
      if (
        ((t.nodeType !== 1 || t.nodeName !== 'INPUT' || t.type !== 'hidden') && !e) ||
        ((t = Me(t.nextSibling)), t === null)
      )
        return null;
    return t;
  }
  function vf(t) {
    return t.data === '$?' || t.data === '$~';
  }
  function gf(t) {
    return t.data === '$!' || (t.data === '$?' && t.ownerDocument.readyState !== 'loading');
  }
  function P0(t, e) {
    var l = t.ownerDocument;
    if (t.data === '$~') t._reactRetry = e;
    else if (t.data !== '$?' || l.readyState !== 'loading') e();
    else {
      var n = function () {
        (e(), l.removeEventListener('DOMContentLoaded', n));
      };
      (l.addEventListener('DOMContentLoaded', n), (t._reactRetry = n));
    }
  }
  function Me(t) {
    for (; t != null; t = t.nextSibling) {
      var e = t.nodeType;
      if (e === 1 || e === 3) break;
      if (e === 8) {
        if (
          ((e = t.data),
          e === '$' ||
            e === '$!' ||
            e === '$?' ||
            e === '$~' ||
            e === '&' ||
            e === 'F!' ||
            e === 'F')
        )
          break;
        if (e === '/$' || e === '/&') return null;
      }
    }
    return t;
  }
  var pf = null;
  function Md(t) {
    t = t.nextSibling;
    for (var e = 0; t; ) {
      if (t.nodeType === 8) {
        var l = t.data;
        if (l === '/$' || l === '/&') {
          if (e === 0) return Me(t.nextSibling);
          e--;
        } else (l !== '$' && l !== '$!' && l !== '$?' && l !== '$~' && l !== '&') || e++;
      }
      t = t.nextSibling;
    }
    return null;
  }
  function Od(t) {
    t = t.previousSibling;
    for (var e = 0; t; ) {
      if (t.nodeType === 8) {
        var l = t.data;
        if (l === '$' || l === '$!' || l === '$?' || l === '$~' || l === '&') {
          if (e === 0) return t;
          e--;
        } else (l !== '/$' && l !== '/&') || e++;
      }
      t = t.previousSibling;
    }
    return null;
  }
  function Rd(t, e, l) {
    switch (((e = Ku(l)), t)) {
      case 'html':
        if (((t = e.documentElement), !t)) throw Error(f(452));
        return t;
      case 'head':
        if (((t = e.head), !t)) throw Error(f(453));
        return t;
      case 'body':
        if (((t = e.body), !t)) throw Error(f(454));
        return t;
      default:
        throw Error(f(451));
    }
  }
  function Oa(t) {
    for (var e = t.attributes; e.length; ) t.removeAttributeNode(e[0]);
    bi(t);
  }
  var Oe = new Map(),
    Nd = new Set();
  function Ju(t) {
    return typeof t.getRootNode == 'function'
      ? t.getRootNode()
      : t.nodeType === 9
        ? t
        : t.ownerDocument;
  }
  var nl = w.d;
  w.d = { f: ty, r: ey, D: ly, C: ny, L: ay, m: uy, X: cy, S: iy, M: fy };
  function ty() {
    var t = nl.f(),
      e = Yu();
    return t || e;
  }
  function ey(t) {
    var e = en(t);
    e !== null && e.tag === 5 && e.type === 'form' ? Js(e) : nl.r(t);
  }
  var Un = typeof document > 'u' ? null : document;
  function Cd(t, e, l) {
    var n = Un;
    if (n && typeof e == 'string' && e) {
      var a = Se(e);
      ((a = 'link[rel="' + t + '"][href="' + a + '"]'),
        typeof l == 'string' && (a += '[crossorigin="' + l + '"]'),
        Nd.has(a) ||
          (Nd.add(a),
          (t = { rel: t, crossOrigin: l, href: e }),
          n.querySelector(a) === null &&
            ((e = n.createElement('link')), It(e, 'link', t), Kt(e), n.head.appendChild(e))));
    }
  }
  function ly(t) {
    (nl.D(t), Cd('dns-prefetch', t, null));
  }
  function ny(t, e) {
    (nl.C(t, e), Cd('preconnect', t, e));
  }
  function ay(t, e, l) {
    nl.L(t, e, l);
    var n = Un;
    if (n && t && e) {
      var a = 'link[rel="preload"][as="' + Se(e) + '"]';
      e === 'image' && l && l.imageSrcSet
        ? ((a += '[imagesrcset="' + Se(l.imageSrcSet) + '"]'),
          typeof l.imageSizes == 'string' && (a += '[imagesizes="' + Se(l.imageSizes) + '"]'))
        : (a += '[href="' + Se(t) + '"]');
      var u = a;
      switch (e) {
        case 'style':
          u = Hn(t);
          break;
        case 'script':
          u = Bn(t);
      }
      Oe.has(u) ||
        ((t = E(
          { rel: 'preload', href: e === 'image' && l && l.imageSrcSet ? void 0 : t, as: e },
          l,
        )),
        Oe.set(u, t),
        n.querySelector(a) !== null ||
          (e === 'style' && n.querySelector(Ra(u))) ||
          (e === 'script' && n.querySelector(Na(u))) ||
          ((e = n.createElement('link')), It(e, 'link', t), Kt(e), n.head.appendChild(e)));
    }
  }
  function uy(t, e) {
    nl.m(t, e);
    var l = Un;
    if (l && t) {
      var n = e && typeof e.as == 'string' ? e.as : 'script',
        a = 'link[rel="modulepreload"][as="' + Se(n) + '"][href="' + Se(t) + '"]',
        u = a;
      switch (n) {
        case 'audioworklet':
        case 'paintworklet':
        case 'serviceworker':
        case 'sharedworker':
        case 'worker':
        case 'script':
          u = Bn(t);
      }
      if (
        !Oe.has(u) &&
        ((t = E({ rel: 'modulepreload', href: t }, e)), Oe.set(u, t), l.querySelector(a) === null)
      ) {
        switch (n) {
          case 'audioworklet':
          case 'paintworklet':
          case 'serviceworker':
          case 'sharedworker':
          case 'worker':
          case 'script':
            if (l.querySelector(Na(u))) return;
        }
        ((n = l.createElement('link')), It(n, 'link', t), Kt(n), l.head.appendChild(n));
      }
    }
  }
  function iy(t, e, l) {
    nl.S(t, e, l);
    var n = Un;
    if (n && t) {
      var a = ln(n).hoistableStyles,
        u = Hn(t);
      e = e || 'default';
      var c = a.get(u);
      if (!c) {
        var r = { loading: 0, preload: null };
        if ((c = n.querySelector(Ra(u)))) r.loading = 5;
        else {
          ((t = E({ rel: 'stylesheet', href: t, 'data-precedence': e }, l)),
            (l = Oe.get(u)) && bf(t, l));
          var h = (c = n.createElement('link'));
          (Kt(h),
            It(h, 'link', t),
            (h._p = new Promise(function (T, C) {
              ((h.onload = T), (h.onerror = C));
            })),
            h.addEventListener('load', function () {
              r.loading |= 1;
            }),
            h.addEventListener('error', function () {
              r.loading |= 2;
            }),
            (r.loading |= 4),
            $u(c, e, n));
        }
        ((c = { type: 'stylesheet', instance: c, count: 1, state: r }), a.set(u, c));
      }
    }
  }
  function cy(t, e) {
    nl.X(t, e);
    var l = Un;
    if (l && t) {
      var n = ln(l).hoistableScripts,
        a = Bn(t),
        u = n.get(a);
      u ||
        ((u = l.querySelector(Na(a))),
        u ||
          ((t = E({ src: t, async: !0 }, e)),
          (e = Oe.get(a)) && Sf(t, e),
          (u = l.createElement('script')),
          Kt(u),
          It(u, 'link', t),
          l.head.appendChild(u)),
        (u = { type: 'script', instance: u, count: 1, state: null }),
        n.set(a, u));
    }
  }
  function fy(t, e) {
    nl.M(t, e);
    var l = Un;
    if (l && t) {
      var n = ln(l).hoistableScripts,
        a = Bn(t),
        u = n.get(a);
      u ||
        ((u = l.querySelector(Na(a))),
        u ||
          ((t = E({ src: t, async: !0, type: 'module' }, e)),
          (e = Oe.get(a)) && Sf(t, e),
          (u = l.createElement('script')),
          Kt(u),
          It(u, 'link', t),
          l.head.appendChild(u)),
        (u = { type: 'script', instance: u, count: 1, state: null }),
        n.set(a, u));
    }
  }
  function Dd(t, e, l, n) {
    var a = (a = ot.current) ? Ju(a) : null;
    if (!a) throw Error(f(446));
    switch (t) {
      case 'meta':
      case 'title':
        return null;
      case 'style':
        return typeof l.precedence == 'string' && typeof l.href == 'string'
          ? ((e = Hn(l.href)),
            (l = ln(a).hoistableStyles),
            (n = l.get(e)),
            n || ((n = { type: 'style', instance: null, count: 0, state: null }), l.set(e, n)),
            n)
          : { type: 'void', instance: null, count: 0, state: null };
      case 'link':
        if (
          l.rel === 'stylesheet' &&
          typeof l.href == 'string' &&
          typeof l.precedence == 'string'
        ) {
          t = Hn(l.href);
          var u = ln(a).hoistableStyles,
            c = u.get(t);
          if (
            (c ||
              ((a = a.ownerDocument || a),
              (c = {
                type: 'stylesheet',
                instance: null,
                count: 0,
                state: { loading: 0, preload: null },
              }),
              u.set(t, c),
              (u = a.querySelector(Ra(t))) && !u._p && ((c.instance = u), (c.state.loading = 5)),
              Oe.has(t) ||
                ((l = {
                  rel: 'preload',
                  as: 'style',
                  href: l.href,
                  crossOrigin: l.crossOrigin,
                  integrity: l.integrity,
                  media: l.media,
                  hrefLang: l.hrefLang,
                  referrerPolicy: l.referrerPolicy,
                }),
                Oe.set(t, l),
                u || oy(a, t, l, c.state))),
            e && n === null)
          )
            throw Error(f(528, ''));
          return c;
        }
        if (e && n !== null) throw Error(f(529, ''));
        return null;
      case 'script':
        return (
          (e = l.async),
          (l = l.src),
          typeof l == 'string' && e && typeof e != 'function' && typeof e != 'symbol'
            ? ((e = Bn(l)),
              (l = ln(a).hoistableScripts),
              (n = l.get(e)),
              n || ((n = { type: 'script', instance: null, count: 0, state: null }), l.set(e, n)),
              n)
            : { type: 'void', instance: null, count: 0, state: null }
        );
      default:
        throw Error(f(444, t));
    }
  }
  function Hn(t) {
    return 'href="' + Se(t) + '"';
  }
  function Ra(t) {
    return 'link[rel="stylesheet"][' + t + ']';
  }
  function jd(t) {
    return E({}, t, { 'data-precedence': t.precedence, precedence: null });
  }
  function oy(t, e, l, n) {
    t.querySelector('link[rel="preload"][as="style"][' + e + ']')
      ? (n.loading = 1)
      : ((e = t.createElement('link')),
        (n.preload = e),
        e.addEventListener('load', function () {
          return (n.loading |= 1);
        }),
        e.addEventListener('error', function () {
          return (n.loading |= 2);
        }),
        It(e, 'link', l),
        Kt(e),
        t.head.appendChild(e));
  }
  function Bn(t) {
    return '[src="' + Se(t) + '"]';
  }
  function Na(t) {
    return 'script[async]' + t;
  }
  function Ud(t, e, l) {
    if ((e.count++, e.instance === null))
      switch (e.type) {
        case 'style':
          var n = t.querySelector('style[data-href~="' + Se(l.href) + '"]');
          if (n) return ((e.instance = n), Kt(n), n);
          var a = E({}, l, {
            'data-href': l.href,
            'data-precedence': l.precedence,
            href: null,
            precedence: null,
          });
          return (
            (n = (t.ownerDocument || t).createElement('style')),
            Kt(n),
            It(n, 'style', a),
            $u(n, l.precedence, t),
            (e.instance = n)
          );
        case 'stylesheet':
          a = Hn(l.href);
          var u = t.querySelector(Ra(a));
          if (u) return ((e.state.loading |= 4), (e.instance = u), Kt(u), u);
          ((n = jd(l)),
            (a = Oe.get(a)) && bf(n, a),
            (u = (t.ownerDocument || t).createElement('link')),
            Kt(u));
          var c = u;
          return (
            (c._p = new Promise(function (r, h) {
              ((c.onload = r), (c.onerror = h));
            })),
            It(u, 'link', n),
            (e.state.loading |= 4),
            $u(u, l.precedence, t),
            (e.instance = u)
          );
        case 'script':
          return (
            (u = Bn(l.src)),
            (a = t.querySelector(Na(u)))
              ? ((e.instance = a), Kt(a), a)
              : ((n = l),
                (a = Oe.get(u)) && ((n = E({}, l)), Sf(n, a)),
                (t = t.ownerDocument || t),
                (a = t.createElement('script')),
                Kt(a),
                It(a, 'link', n),
                t.head.appendChild(a),
                (e.instance = a))
          );
        case 'void':
          return null;
        default:
          throw Error(f(443, e.type));
      }
    else
      e.type === 'stylesheet' &&
        (e.state.loading & 4) === 0 &&
        ((n = e.instance), (e.state.loading |= 4), $u(n, l.precedence, t));
    return e.instance;
  }
  function $u(t, e, l) {
    for (
      var n = l.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),
        a = n.length ? n[n.length - 1] : null,
        u = a,
        c = 0;
      c < n.length;
      c++
    ) {
      var r = n[c];
      if (r.dataset.precedence === e) u = r;
      else if (u !== a) break;
    }
    u
      ? u.parentNode.insertBefore(t, u.nextSibling)
      : ((e = l.nodeType === 9 ? l.head : l), e.insertBefore(t, e.firstChild));
  }
  function bf(t, e) {
    (t.crossOrigin == null && (t.crossOrigin = e.crossOrigin),
      t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy),
      t.title == null && (t.title = e.title));
  }
  function Sf(t, e) {
    (t.crossOrigin == null && (t.crossOrigin = e.crossOrigin),
      t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy),
      t.integrity == null && (t.integrity = e.integrity));
  }
  var ku = null;
  function Hd(t, e, l) {
    if (ku === null) {
      var n = new Map(),
        a = (ku = new Map());
      a.set(l, n);
    } else ((a = ku), (n = a.get(l)), n || ((n = new Map()), a.set(l, n)));
    if (n.has(t)) return n;
    for (n.set(t, null), l = l.getElementsByTagName(t), a = 0; a < l.length; a++) {
      var u = l[a];
      if (
        !(u[Kn] || u[$t] || (t === 'link' && u.getAttribute('rel') === 'stylesheet')) &&
        u.namespaceURI !== 'http://www.w3.org/2000/svg'
      ) {
        var c = u.getAttribute(e) || '';
        c = t + c;
        var r = n.get(c);
        r ? r.push(u) : n.set(c, [u]);
      }
    }
    return n;
  }
  function Bd(t, e, l) {
    ((t = t.ownerDocument || t),
      t.head.insertBefore(l, e === 'title' ? t.querySelector('head > title') : null));
  }
  function sy(t, e, l) {
    if (l === 1 || e.itemProp != null) return !1;
    switch (t) {
      case 'meta':
      case 'title':
        return !0;
      case 'style':
        if (typeof e.precedence != 'string' || typeof e.href != 'string' || e.href === '') break;
        return !0;
      case 'link':
        if (
          typeof e.rel != 'string' ||
          typeof e.href != 'string' ||
          e.href === '' ||
          e.onLoad ||
          e.onError
        )
          break;
        switch (e.rel) {
          case 'stylesheet':
            return ((t = e.disabled), typeof e.precedence == 'string' && t == null);
          default:
            return !0;
        }
      case 'script':
        if (
          e.async &&
          typeof e.async != 'function' &&
          typeof e.async != 'symbol' &&
          !e.onLoad &&
          !e.onError &&
          e.src &&
          typeof e.src == 'string'
        )
          return !0;
    }
    return !1;
  }
  function qd(t) {
    return !(t.type === 'stylesheet' && (t.state.loading & 3) === 0);
  }
  function ry(t, e, l, n) {
    if (
      l.type === 'stylesheet' &&
      (typeof n.media != 'string' || matchMedia(n.media).matches !== !1) &&
      (l.state.loading & 4) === 0
    ) {
      if (l.instance === null) {
        var a = Hn(n.href),
          u = e.querySelector(Ra(a));
        if (u) {
          ((e = u._p),
            e !== null &&
              typeof e == 'object' &&
              typeof e.then == 'function' &&
              (t.count++, (t = Wu.bind(t)), e.then(t, t)),
            (l.state.loading |= 4),
            (l.instance = u),
            Kt(u));
          return;
        }
        ((u = e.ownerDocument || e),
          (n = jd(n)),
          (a = Oe.get(a)) && bf(n, a),
          (u = u.createElement('link')),
          Kt(u));
        var c = u;
        ((c._p = new Promise(function (r, h) {
          ((c.onload = r), (c.onerror = h));
        })),
          It(u, 'link', n),
          (l.instance = u));
      }
      (t.stylesheets === null && (t.stylesheets = new Map()),
        t.stylesheets.set(l, e),
        (e = l.state.preload) &&
          (l.state.loading & 3) === 0 &&
          (t.count++,
          (l = Wu.bind(t)),
          e.addEventListener('load', l),
          e.addEventListener('error', l)));
    }
  }
  var xf = 0;
  function dy(t, e) {
    return (
      t.stylesheets && t.count === 0 && Iu(t, t.stylesheets),
      0 < t.count || 0 < t.imgCount
        ? function (l) {
            var n = setTimeout(function () {
              if ((t.stylesheets && Iu(t, t.stylesheets), t.unsuspend)) {
                var u = t.unsuspend;
                ((t.unsuspend = null), u());
              }
            }, 6e4 + e);
            0 < t.imgBytes && xf === 0 && (xf = 62500 * K0());
            var a = setTimeout(
              function () {
                if (
                  ((t.waitingForImages = !1),
                  t.count === 0 && (t.stylesheets && Iu(t, t.stylesheets), t.unsuspend))
                ) {
                  var u = t.unsuspend;
                  ((t.unsuspend = null), u());
                }
              },
              (t.imgBytes > xf ? 50 : 800) + e,
            );
            return (
              (t.unsuspend = l),
              function () {
                ((t.unsuspend = null), clearTimeout(n), clearTimeout(a));
              }
            );
          }
        : null
    );
  }
  function Wu() {
    if ((this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages))) {
      if (this.stylesheets) Iu(this, this.stylesheets);
      else if (this.unsuspend) {
        var t = this.unsuspend;
        ((this.unsuspend = null), t());
      }
    }
  }
  var Fu = null;
  function Iu(t, e) {
    ((t.stylesheets = null),
      t.unsuspend !== null &&
        (t.count++, (Fu = new Map()), e.forEach(my, t), (Fu = null), Wu.call(t)));
  }
  function my(t, e) {
    if (!(e.state.loading & 4)) {
      var l = Fu.get(t);
      if (l) var n = l.get(null);
      else {
        ((l = new Map()), Fu.set(t, l));
        for (
          var a = t.querySelectorAll('link[data-precedence],style[data-precedence]'), u = 0;
          u < a.length;
          u++
        ) {
          var c = a[u];
          (c.nodeName === 'LINK' || c.getAttribute('media') !== 'not all') &&
            (l.set(c.dataset.precedence, c), (n = c));
        }
        n && l.set(null, n);
      }
      ((a = e.instance),
        (c = a.getAttribute('data-precedence')),
        (u = l.get(c) || n),
        u === n && l.set(null, a),
        l.set(c, a),
        this.count++,
        (n = Wu.bind(this)),
        a.addEventListener('load', n),
        a.addEventListener('error', n),
        u
          ? u.parentNode.insertBefore(a, u.nextSibling)
          : ((t = t.nodeType === 9 ? t.head : t), t.insertBefore(a, t.firstChild)),
        (e.state.loading |= 4));
    }
  }
  var Ca = {
    $$typeof: G,
    Provider: null,
    Consumer: null,
    _currentValue: R,
    _currentValue2: R,
    _threadCount: 0,
  };
  function hy(t, e, l, n, a, u, c, r, h) {
    ((this.tag = 1),
      (this.containerInfo = t),
      (this.pingCache = this.current = this.pendingChildren = null),
      (this.timeoutHandle = -1),
      (this.callbackNode =
        this.next =
        this.pendingContext =
        this.context =
        this.cancelPendingCommit =
          null),
      (this.callbackPriority = 0),
      (this.expirationTimes = yi(-1)),
      (this.entangledLanes =
        this.shellSuspendCounter =
        this.errorRecoveryDisabledLanes =
        this.expiredLanes =
        this.warmLanes =
        this.pingedLanes =
        this.suspendedLanes =
        this.pendingLanes =
          0),
      (this.entanglements = yi(0)),
      (this.hiddenUpdates = yi(null)),
      (this.identifierPrefix = n),
      (this.onUncaughtError = a),
      (this.onCaughtError = u),
      (this.onRecoverableError = c),
      (this.pooledCache = null),
      (this.pooledCacheLanes = 0),
      (this.formState = h),
      (this.incompleteTransitions = new Map()));
  }
  function Yd(t, e, l, n, a, u, c, r, h, T, C, U) {
    return (
      (t = new hy(t, e, l, c, h, T, C, U, r)),
      (e = 1),
      u === !0 && (e |= 24),
      (u = me(3, null, null, e)),
      (t.current = u),
      (u.stateNode = t),
      (e = Pi()),
      e.refCount++,
      (t.pooledCache = e),
      e.refCount++,
      (u.memoizedState = { element: n, isDehydrated: l, cache: e }),
      nc(u),
      t
    );
  }
  function wd(t) {
    return t ? ((t = mn), t) : mn;
  }
  function Gd(t, e, l, n, a, u) {
    ((a = wd(a)),
      n.context === null ? (n.context = a) : (n.pendingContext = a),
      (n = ml(e)),
      (n.payload = { element: l }),
      (u = u === void 0 ? null : u),
      u !== null && (n.callback = u),
      (l = hl(t, n, e)),
      l !== null && (fe(l, t, e), oa(l, t, e)));
  }
  function Ld(t, e) {
    if (((t = t.memoizedState), t !== null && t.dehydrated !== null)) {
      var l = t.retryLane;
      t.retryLane = l !== 0 && l < e ? l : e;
    }
  }
  function zf(t, e) {
    (Ld(t, e), (t = t.alternate) && Ld(t, e));
  }
  function Xd(t) {
    if (t.tag === 13 || t.tag === 31) {
      var e = wl(t, 67108864);
      (e !== null && fe(e, t, 67108864), zf(t, 67108864));
    }
  }
  function Qd(t) {
    if (t.tag === 13 || t.tag === 31) {
      var e = pe();
      e = vi(e);
      var l = wl(t, e);
      (l !== null && fe(l, t, e), zf(t, e));
    }
  }
  var Pu = !0;
  function yy(t, e, l, n) {
    var a = N.T;
    N.T = null;
    var u = w.p;
    try {
      ((w.p = 2), Ef(t, e, l, n));
    } finally {
      ((w.p = u), (N.T = a));
    }
  }
  function vy(t, e, l, n) {
    var a = N.T;
    N.T = null;
    var u = w.p;
    try {
      ((w.p = 8), Ef(t, e, l, n));
    } finally {
      ((w.p = u), (N.T = a));
    }
  }
  function Ef(t, e, l, n) {
    if (Pu) {
      var a = Af(n);
      if (a === null) (of(t, e, n, ti, l), Zd(t, n));
      else if (py(a, t, e, l, n)) n.stopPropagation();
      else if ((Zd(t, n), e & 4 && -1 < gy.indexOf(t))) {
        for (; a !== null; ) {
          var u = en(a);
          if (u !== null)
            switch (u.tag) {
              case 3:
                if (((u = u.stateNode), u.current.memoizedState.isDehydrated)) {
                  var c = Ul(u.pendingLanes);
                  if (c !== 0) {
                    var r = u;
                    for (r.pendingLanes |= 2, r.entangledLanes |= 2; c; ) {
                      var h = 1 << (31 - re(c));
                      ((r.entanglements[1] |= h), (c &= ~h));
                    }
                    (Ye(u), (pt & 6) === 0 && ((Bu = oe() + 500), Ta(0)));
                  }
                }
                break;
              case 31:
              case 13:
                ((r = wl(u, 2)), r !== null && fe(r, u, 2), Yu(), zf(u, 2));
            }
          if (((u = Af(n)), u === null && of(t, e, n, ti, l), u === a)) break;
          a = u;
        }
        a !== null && n.stopPropagation();
      } else of(t, e, n, null, l);
    }
  }
  function Af(t) {
    return ((t = Ti(t)), Tf(t));
  }
  var ti = null;
  function Tf(t) {
    if (((ti = null), (t = tn(t)), t !== null)) {
      var e = d(t);
      if (e === null) t = null;
      else {
        var l = e.tag;
        if (l === 13) {
          if (((t = y(e)), t !== null)) return t;
          t = null;
        } else if (l === 31) {
          if (((t = p(e)), t !== null)) return t;
          t = null;
        } else if (l === 3) {
          if (e.stateNode.current.memoizedState.isDehydrated)
            return e.tag === 3 ? e.stateNode.containerInfo : null;
          t = null;
        } else e !== t && (t = null);
      }
    }
    return ((ti = t), null);
  }
  function Vd(t) {
    switch (t) {
      case 'beforetoggle':
      case 'cancel':
      case 'click':
      case 'close':
      case 'contextmenu':
      case 'copy':
      case 'cut':
      case 'auxclick':
      case 'dblclick':
      case 'dragend':
      case 'dragstart':
      case 'drop':
      case 'focusin':
      case 'focusout':
      case 'input':
      case 'invalid':
      case 'keydown':
      case 'keypress':
      case 'keyup':
      case 'mousedown':
      case 'mouseup':
      case 'paste':
      case 'pause':
      case 'play':
      case 'pointercancel':
      case 'pointerdown':
      case 'pointerup':
      case 'ratechange':
      case 'reset':
      case 'resize':
      case 'seeked':
      case 'submit':
      case 'toggle':
      case 'touchcancel':
      case 'touchend':
      case 'touchstart':
      case 'volumechange':
      case 'change':
      case 'selectionchange':
      case 'textInput':
      case 'compositionstart':
      case 'compositionend':
      case 'compositionupdate':
      case 'beforeblur':
      case 'afterblur':
      case 'beforeinput':
      case 'blur':
      case 'fullscreenchange':
      case 'focus':
      case 'hashchange':
      case 'popstate':
      case 'select':
      case 'selectstart':
        return 2;
      case 'drag':
      case 'dragenter':
      case 'dragexit':
      case 'dragleave':
      case 'dragover':
      case 'mousemove':
      case 'mouseout':
      case 'mouseover':
      case 'pointermove':
      case 'pointerout':
      case 'pointerover':
      case 'scroll':
      case 'touchmove':
      case 'wheel':
      case 'mouseenter':
      case 'mouseleave':
      case 'pointerenter':
      case 'pointerleave':
        return 8;
      case 'message':
        switch (lh()) {
          case Ff:
            return 2;
          case If:
            return 8;
          case Qa:
          case nh:
            return 32;
          case Pf:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var _f = !1,
    Tl = null,
    _l = null,
    Ml = null,
    Da = new Map(),
    ja = new Map(),
    Ol = [],
    gy =
      'mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset'.split(
        ' ',
      );
  function Zd(t, e) {
    switch (t) {
      case 'focusin':
      case 'focusout':
        Tl = null;
        break;
      case 'dragenter':
      case 'dragleave':
        _l = null;
        break;
      case 'mouseover':
      case 'mouseout':
        Ml = null;
        break;
      case 'pointerover':
      case 'pointerout':
        Da.delete(e.pointerId);
        break;
      case 'gotpointercapture':
      case 'lostpointercapture':
        ja.delete(e.pointerId);
    }
  }
  function Ua(t, e, l, n, a, u) {
    return t === null || t.nativeEvent !== u
      ? ((t = {
          blockedOn: e,
          domEventName: l,
          eventSystemFlags: n,
          nativeEvent: u,
          targetContainers: [a],
        }),
        e !== null && ((e = en(e)), e !== null && Xd(e)),
        t)
      : ((t.eventSystemFlags |= n),
        (e = t.targetContainers),
        a !== null && e.indexOf(a) === -1 && e.push(a),
        t);
  }
  function py(t, e, l, n, a) {
    switch (e) {
      case 'focusin':
        return ((Tl = Ua(Tl, t, e, l, n, a)), !0);
      case 'dragenter':
        return ((_l = Ua(_l, t, e, l, n, a)), !0);
      case 'mouseover':
        return ((Ml = Ua(Ml, t, e, l, n, a)), !0);
      case 'pointerover':
        var u = a.pointerId;
        return (Da.set(u, Ua(Da.get(u) || null, t, e, l, n, a)), !0);
      case 'gotpointercapture':
        return ((u = a.pointerId), ja.set(u, Ua(ja.get(u) || null, t, e, l, n, a)), !0);
    }
    return !1;
  }
  function Kd(t) {
    var e = tn(t.target);
    if (e !== null) {
      var l = d(e);
      if (l !== null) {
        if (((e = l.tag), e === 13)) {
          if (((e = y(l)), e !== null)) {
            ((t.blockedOn = e),
              uo(t.priority, function () {
                Qd(l);
              }));
            return;
          }
        } else if (e === 31) {
          if (((e = p(l)), e !== null)) {
            ((t.blockedOn = e),
              uo(t.priority, function () {
                Qd(l);
              }));
            return;
          }
        } else if (e === 3 && l.stateNode.current.memoizedState.isDehydrated) {
          t.blockedOn = l.tag === 3 ? l.stateNode.containerInfo : null;
          return;
        }
      }
    }
    t.blockedOn = null;
  }
  function ei(t) {
    if (t.blockedOn !== null) return !1;
    for (var e = t.targetContainers; 0 < e.length; ) {
      var l = Af(t.nativeEvent);
      if (l === null) {
        l = t.nativeEvent;
        var n = new l.constructor(l.type, l);
        ((Ai = n), l.target.dispatchEvent(n), (Ai = null));
      } else return ((e = en(l)), e !== null && Xd(e), (t.blockedOn = l), !1);
      e.shift();
    }
    return !0;
  }
  function Jd(t, e, l) {
    ei(t) && l.delete(e);
  }
  function by() {
    ((_f = !1),
      Tl !== null && ei(Tl) && (Tl = null),
      _l !== null && ei(_l) && (_l = null),
      Ml !== null && ei(Ml) && (Ml = null),
      Da.forEach(Jd),
      ja.forEach(Jd));
  }
  function li(t, e) {
    t.blockedOn === e &&
      ((t.blockedOn = null),
      _f || ((_f = !0), i.unstable_scheduleCallback(i.unstable_NormalPriority, by)));
  }
  var ni = null;
  function $d(t) {
    ni !== t &&
      ((ni = t),
      i.unstable_scheduleCallback(i.unstable_NormalPriority, function () {
        ni === t && (ni = null);
        for (var e = 0; e < t.length; e += 3) {
          var l = t[e],
            n = t[e + 1],
            a = t[e + 2];
          if (typeof n != 'function') {
            if (Tf(n || l) === null) continue;
            break;
          }
          var u = en(l);
          u !== null &&
            (t.splice(e, 3),
            (e -= 3),
            Ec(u, { pending: !0, data: a, method: l.method, action: n }, n, a));
        }
      }));
  }
  function qn(t) {
    function e(h) {
      return li(h, t);
    }
    (Tl !== null && li(Tl, t),
      _l !== null && li(_l, t),
      Ml !== null && li(Ml, t),
      Da.forEach(e),
      ja.forEach(e));
    for (var l = 0; l < Ol.length; l++) {
      var n = Ol[l];
      n.blockedOn === t && (n.blockedOn = null);
    }
    for (; 0 < Ol.length && ((l = Ol[0]), l.blockedOn === null); )
      (Kd(l), l.blockedOn === null && Ol.shift());
    if (((l = (t.ownerDocument || t).$$reactFormReplay), l != null))
      for (n = 0; n < l.length; n += 3) {
        var a = l[n],
          u = l[n + 1],
          c = a[le] || null;
        if (typeof u == 'function') c || $d(l);
        else if (c) {
          var r = null;
          if (u && u.hasAttribute('formAction')) {
            if (((a = u), (c = u[le] || null))) r = c.formAction;
            else if (Tf(a) !== null) continue;
          } else r = c.action;
          (typeof r == 'function' ? (l[n + 1] = r) : (l.splice(n, 3), (n -= 3)), $d(l));
        }
      }
  }
  function kd() {
    function t(u) {
      u.canIntercept &&
        u.info === 'react-transition' &&
        u.intercept({
          handler: function () {
            return new Promise(function (c) {
              return (a = c);
            });
          },
          focusReset: 'manual',
          scroll: 'manual',
        });
    }
    function e() {
      (a !== null && (a(), (a = null)), n || setTimeout(l, 20));
    }
    function l() {
      if (!n && !navigation.transition) {
        var u = navigation.currentEntry;
        u &&
          u.url != null &&
          navigation.navigate(u.url, {
            state: u.getState(),
            info: 'react-transition',
            history: 'replace',
          });
      }
    }
    if (typeof navigation == 'object') {
      var n = !1,
        a = null;
      return (
        navigation.addEventListener('navigate', t),
        navigation.addEventListener('navigatesuccess', e),
        navigation.addEventListener('navigateerror', e),
        setTimeout(l, 100),
        function () {
          ((n = !0),
            navigation.removeEventListener('navigate', t),
            navigation.removeEventListener('navigatesuccess', e),
            navigation.removeEventListener('navigateerror', e),
            a !== null && (a(), (a = null)));
        }
      );
    }
  }
  function Mf(t) {
    this._internalRoot = t;
  }
  ((ai.prototype.render = Mf.prototype.render =
    function (t) {
      var e = this._internalRoot;
      if (e === null) throw Error(f(409));
      var l = e.current,
        n = pe();
      Gd(l, n, t, e, null, null);
    }),
    (ai.prototype.unmount = Mf.prototype.unmount =
      function () {
        var t = this._internalRoot;
        if (t !== null) {
          this._internalRoot = null;
          var e = t.containerInfo;
          (Gd(t.current, 2, null, t, null, null), Yu(), (e[Pl] = null));
        }
      }));
  function ai(t) {
    this._internalRoot = t;
  }
  ai.prototype.unstable_scheduleHydration = function (t) {
    if (t) {
      var e = ao();
      t = { blockedOn: null, target: t, priority: e };
      for (var l = 0; l < Ol.length && e !== 0 && e < Ol[l].priority; l++);
      (Ol.splice(l, 0, t), l === 0 && Kd(t));
    }
  };
  var Wd = s.version;
  if (Wd !== '19.2.6') throw Error(f(527, Wd, '19.2.6'));
  w.findDOMNode = function (t) {
    var e = t._reactInternals;
    if (e === void 0)
      throw typeof t.render == 'function'
        ? Error(f(188))
        : ((t = Object.keys(t).join(',')), Error(f(268, t)));
    return ((t = g(e)), (t = t !== null ? x(t) : null), (t = t === null ? null : t.stateNode), t);
  };
  var Sy = {
    bundleType: 0,
    version: '19.2.6',
    rendererPackageName: 'react-dom',
    currentDispatcherRef: N,
    reconcilerVersion: '19.2.6',
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < 'u') {
    var ui = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!ui.isDisabled && ui.supportsFiber)
      try {
        ((Qn = ui.inject(Sy)), (se = ui));
      } catch {}
  }
  return (
    (Ba.createRoot = function (t, e) {
      if (!m(t)) throw Error(f(299));
      var l = !1,
        n = '',
        a = nr,
        u = ar,
        c = ur;
      return (
        e != null &&
          (e.unstable_strictMode === !0 && (l = !0),
          e.identifierPrefix !== void 0 && (n = e.identifierPrefix),
          e.onUncaughtError !== void 0 && (a = e.onUncaughtError),
          e.onCaughtError !== void 0 && (u = e.onCaughtError),
          e.onRecoverableError !== void 0 && (c = e.onRecoverableError)),
        (e = Yd(t, 1, !1, null, null, l, n, null, a, u, c, kd)),
        (t[Pl] = e.current),
        ff(t),
        new Mf(e)
      );
    }),
    (Ba.hydrateRoot = function (t, e, l) {
      if (!m(t)) throw Error(f(299));
      var n = !1,
        a = '',
        u = nr,
        c = ar,
        r = ur,
        h = null;
      return (
        l != null &&
          (l.unstable_strictMode === !0 && (n = !0),
          l.identifierPrefix !== void 0 && (a = l.identifierPrefix),
          l.onUncaughtError !== void 0 && (u = l.onUncaughtError),
          l.onCaughtError !== void 0 && (c = l.onCaughtError),
          l.onRecoverableError !== void 0 && (r = l.onRecoverableError),
          l.formState !== void 0 && (h = l.formState)),
        (e = Yd(t, 1, !0, e, l ?? null, n, a, h, u, c, r, kd)),
        (e.context = wd(null)),
        (l = e.current),
        (n = pe()),
        (n = vi(n)),
        (a = ml(n)),
        (a.callback = null),
        hl(l, a, n),
        (l = n),
        (e.current.lanes = l),
        Zn(e, l),
        Ye(e),
        (t[Pl] = e.current),
        ff(t),
        new ai(e)
      );
    }),
    (Ba.version = '19.2.6'),
    Ba
  );
}
var im;
function Dy() {
  if (im) return Nf.exports;
  im = 1;
  function i() {
    if (
      !(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > 'u' ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != 'function'
      )
    )
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i);
      } catch (s) {
        console.error(s);
      }
  }
  return (i(), (Nf.exports = Cy()), Nf.exports);
}
var jy = Dy();
function Uy(i, s = !1) {
  return window.__TAURI_INTERNALS__.transformCallback(i, s);
}
async function we(i, s = {}, o) {
  return window.__TAURI_INTERNALS__.invoke(i, s, o);
}
function Hy(i, s = 'asset') {
  return window.__TAURI_INTERNALS__.convertFileSrc(i, s);
}
async function Tm(i = {}) {
  return (typeof i == 'object' && Object.freeze(i), await we('plugin:dialog|open', { options: i }));
}
async function Yf(i = {}) {
  return (typeof i == 'object' && Object.freeze(i), await we('plugin:dialog|save', { options: i }));
}
function _m(i) {
  var s,
    o,
    f = '';
  if (typeof i == 'string' || typeof i == 'number') f += i;
  else if (typeof i == 'object')
    if (Array.isArray(i)) {
      var m = i.length;
      for (s = 0; s < m; s++) i[s] && (o = _m(i[s])) && (f && (f += ' '), (f += o));
    } else for (o in i) i[o] && (f && (f += ' '), (f += o));
  return f;
}
function By() {
  for (var i, s, o = 0, f = '', m = arguments.length; o < m; o++)
    (i = arguments[o]) && (s = _m(i)) && (f && (f += ' '), (f += s));
  return f;
}
const Jf = '-',
  qy = (i) => {
    const s = wy(i),
      { conflictingClassGroups: o, conflictingClassGroupModifiers: f } = i;
    return {
      getClassGroupId: (y) => {
        const p = y.split(Jf);
        return (p[0] === '' && p.length !== 1 && p.shift(), Mm(p, s) || Yy(y));
      },
      getConflictingClassGroupIds: (y, p) => {
        const S = o[y] || [];
        return p && f[y] ? [...S, ...f[y]] : S;
      },
    };
  },
  Mm = (i, s) => {
    var y;
    if (i.length === 0) return s.classGroupId;
    const o = i[0],
      f = s.nextPart.get(o),
      m = f ? Mm(i.slice(1), f) : void 0;
    if (m) return m;
    if (s.validators.length === 0) return;
    const d = i.join(Jf);
    return (y = s.validators.find(({ validator: p }) => p(d))) == null ? void 0 : y.classGroupId;
  },
  cm = /^\[(.+)\]$/,
  Yy = (i) => {
    if (cm.test(i)) {
      const s = cm.exec(i)[1],
        o = s == null ? void 0 : s.substring(0, s.indexOf(':'));
      if (o) return 'arbitrary..' + o;
    }
  },
  wy = (i) => {
    const { theme: s, prefix: o } = i,
      f = { nextPart: new Map(), validators: [] };
    return (
      Ly(Object.entries(i.classGroups), o).forEach(([d, y]) => {
        wf(y, f, d, s);
      }),
      f
    );
  },
  wf = (i, s, o, f) => {
    i.forEach((m) => {
      if (typeof m == 'string') {
        const d = m === '' ? s : fm(s, m);
        d.classGroupId = o;
        return;
      }
      if (typeof m == 'function') {
        if (Gy(m)) {
          wf(m(f), s, o, f);
          return;
        }
        s.validators.push({ validator: m, classGroupId: o });
        return;
      }
      Object.entries(m).forEach(([d, y]) => {
        wf(y, fm(s, d), o, f);
      });
    });
  },
  fm = (i, s) => {
    let o = i;
    return (
      s.split(Jf).forEach((f) => {
        (o.nextPart.has(f) || o.nextPart.set(f, { nextPart: new Map(), validators: [] }),
          (o = o.nextPart.get(f)));
      }),
      o
    );
  },
  Gy = (i) => i.isThemeGetter,
  Ly = (i, s) =>
    s
      ? i.map(([o, f]) => {
          const m = f.map((d) =>
            typeof d == 'string'
              ? s + d
              : typeof d == 'object'
                ? Object.fromEntries(Object.entries(d).map(([y, p]) => [s + y, p]))
                : d,
          );
          return [o, m];
        })
      : i,
  Xy = (i) => {
    if (i < 1) return { get: () => {}, set: () => {} };
    let s = 0,
      o = new Map(),
      f = new Map();
    const m = (d, y) => {
      (o.set(d, y), s++, s > i && ((s = 0), (f = o), (o = new Map())));
    };
    return {
      get(d) {
        let y = o.get(d);
        if (y !== void 0) return y;
        if ((y = f.get(d)) !== void 0) return (m(d, y), y);
      },
      set(d, y) {
        o.has(d) ? o.set(d, y) : m(d, y);
      },
    };
  },
  Om = '!',
  Qy = (i) => {
    const { separator: s, experimentalParseClassName: o } = i,
      f = s.length === 1,
      m = s[0],
      d = s.length,
      y = (p) => {
        const S = [];
        let g = 0,
          x = 0,
          E;
        for (let q = 0; q < p.length; q++) {
          let Y = p[q];
          if (g === 0) {
            if (Y === m && (f || p.slice(q, q + d) === s)) {
              (S.push(p.slice(x, q)), (x = q + d));
              continue;
            }
            if (Y === '/') {
              E = q;
              continue;
            }
          }
          Y === '[' ? g++ : Y === ']' && g--;
        }
        const H = S.length === 0 ? p : p.substring(x),
          Z = H.startsWith(Om),
          $ = Z ? H.substring(1) : H,
          L = E && E > x ? E - x : void 0;
        return {
          modifiers: S,
          hasImportantModifier: Z,
          baseClassName: $,
          maybePostfixModifierPosition: L,
        };
      };
    return o ? (p) => o({ className: p, parseClassName: y }) : y;
  },
  Vy = (i) => {
    if (i.length <= 1) return i;
    const s = [];
    let o = [];
    return (
      i.forEach((f) => {
        f[0] === '[' ? (s.push(...o.sort(), f), (o = [])) : o.push(f);
      }),
      s.push(...o.sort()),
      s
    );
  },
  Zy = (i) => ({ cache: Xy(i.cacheSize), parseClassName: Qy(i), ...qy(i) }),
  Ky = /\s+/,
  Jy = (i, s) => {
    const { parseClassName: o, getClassGroupId: f, getConflictingClassGroupIds: m } = s,
      d = [],
      y = i.trim().split(Ky);
    let p = '';
    for (let S = y.length - 1; S >= 0; S -= 1) {
      const g = y[S],
        {
          modifiers: x,
          hasImportantModifier: E,
          baseClassName: H,
          maybePostfixModifierPosition: Z,
        } = o(g);
      let $ = !!Z,
        L = f($ ? H.substring(0, Z) : H);
      if (!L) {
        if (!$) {
          p = g + (p.length > 0 ? ' ' + p : p);
          continue;
        }
        if (((L = f(H)), !L)) {
          p = g + (p.length > 0 ? ' ' + p : p);
          continue;
        }
        $ = !1;
      }
      const q = Vy(x).join(':'),
        Y = E ? q + Om : q,
        V = Y + L;
      if (d.includes(V)) continue;
      d.push(V);
      const G = m(L, $);
      for (let X = 0; X < G.length; ++X) {
        const at = G[X];
        d.push(Y + at);
      }
      p = g + (p.length > 0 ? ' ' + p : p);
    }
    return p;
  };
function $y() {
  let i = 0,
    s,
    o,
    f = '';
  for (; i < arguments.length; ) (s = arguments[i++]) && (o = Rm(s)) && (f && (f += ' '), (f += o));
  return f;
}
const Rm = (i) => {
  if (typeof i == 'string') return i;
  let s,
    o = '';
  for (let f = 0; f < i.length; f++) i[f] && (s = Rm(i[f])) && (o && (o += ' '), (o += s));
  return o;
};
function ky(i, ...s) {
  let o,
    f,
    m,
    d = y;
  function y(S) {
    const g = s.reduce((x, E) => E(x), i());
    return ((o = Zy(g)), (f = o.cache.get), (m = o.cache.set), (d = p), p(S));
  }
  function p(S) {
    const g = f(S);
    if (g) return g;
    const x = Jy(S, o);
    return (m(S, x), x);
  }
  return function () {
    return d($y.apply(null, arguments));
  };
}
const Ct = (i) => {
    const s = (o) => o[i] || [];
    return ((s.isThemeGetter = !0), s);
  },
  Nm = /^\[(?:([a-z-]+):)?(.+)\]$/i,
  Wy = /^\d+\/\d+$/,
  Fy = new Set(['px', 'full', 'screen']),
  Iy = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,
  Py =
    /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,
  tv = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/,
  ev = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,
  lv =
    /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,
  al = (i) => wn(i) || Fy.has(i) || Wy.test(i),
  Nl = (i) => Gn(i, 'length', sv),
  wn = (i) => !!i && !Number.isNaN(Number(i)),
  Uf = (i) => Gn(i, 'number', wn),
  qa = (i) => !!i && Number.isInteger(Number(i)),
  nv = (i) => i.endsWith('%') && wn(i.slice(0, -1)),
  ft = (i) => Nm.test(i),
  Cl = (i) => Iy.test(i),
  av = new Set(['length', 'size', 'percentage']),
  uv = (i) => Gn(i, av, Cm),
  iv = (i) => Gn(i, 'position', Cm),
  cv = new Set(['image', 'url']),
  fv = (i) => Gn(i, cv, dv),
  ov = (i) => Gn(i, '', rv),
  Ya = () => !0,
  Gn = (i, s, o) => {
    const f = Nm.exec(i);
    return f ? (f[1] ? (typeof s == 'string' ? f[1] === s : s.has(f[1])) : o(f[2])) : !1;
  },
  sv = (i) => Py.test(i) && !tv.test(i),
  Cm = () => !1,
  rv = (i) => ev.test(i),
  dv = (i) => lv.test(i),
  mv = () => {
    const i = Ct('colors'),
      s = Ct('spacing'),
      o = Ct('blur'),
      f = Ct('brightness'),
      m = Ct('borderColor'),
      d = Ct('borderRadius'),
      y = Ct('borderSpacing'),
      p = Ct('borderWidth'),
      S = Ct('contrast'),
      g = Ct('grayscale'),
      x = Ct('hueRotate'),
      E = Ct('invert'),
      H = Ct('gap'),
      Z = Ct('gradientColorStops'),
      $ = Ct('gradientColorStopPositions'),
      L = Ct('inset'),
      q = Ct('margin'),
      Y = Ct('opacity'),
      V = Ct('padding'),
      G = Ct('saturate'),
      X = Ct('scale'),
      at = Ct('sepia'),
      F = Ct('skew'),
      J = Ct('space'),
      zt = Ct('translate'),
      Mt = () => ['auto', 'contain', 'none'],
      Ot = () => ['auto', 'hidden', 'clip', 'visible', 'scroll'],
      yt = () => ['auto', ft, s],
      tt = () => [ft, s],
      Qt = () => ['', al, Nl],
      Vt = () => ['auto', wn, ft],
      Yt = () => [
        'bottom',
        'center',
        'left',
        'left-bottom',
        'left-top',
        'right',
        'right-bottom',
        'right-top',
        'top',
      ],
      N = () => ['solid', 'dashed', 'dotted', 'double', 'none'],
      w = () => [
        'normal',
        'multiply',
        'screen',
        'overlay',
        'darken',
        'lighten',
        'color-dodge',
        'color-burn',
        'hard-light',
        'soft-light',
        'difference',
        'exclusion',
        'hue',
        'saturation',
        'color',
        'luminosity',
      ],
      R = () => ['start', 'end', 'center', 'between', 'around', 'evenly', 'stretch'],
      et = () => ['', '0', ft],
      I = () => ['auto', 'avoid', 'all', 'avoid-page', 'page', 'left', 'right', 'column'],
      v = () => [wn, ft];
    return {
      cacheSize: 500,
      separator: ':',
      theme: {
        colors: [Ya],
        spacing: [al, Nl],
        blur: ['none', '', Cl, ft],
        brightness: v(),
        borderColor: [i],
        borderRadius: ['none', '', 'full', Cl, ft],
        borderSpacing: tt(),
        borderWidth: Qt(),
        contrast: v(),
        grayscale: et(),
        hueRotate: v(),
        invert: et(),
        gap: tt(),
        gradientColorStops: [i],
        gradientColorStopPositions: [nv, Nl],
        inset: yt(),
        margin: yt(),
        opacity: v(),
        padding: tt(),
        saturate: v(),
        scale: v(),
        sepia: et(),
        skew: v(),
        space: tt(),
        translate: tt(),
      },
      classGroups: {
        aspect: [{ aspect: ['auto', 'square', 'video', ft] }],
        container: ['container'],
        columns: [{ columns: [Cl] }],
        'break-after': [{ 'break-after': I() }],
        'break-before': [{ 'break-before': I() }],
        'break-inside': [{ 'break-inside': ['auto', 'avoid', 'avoid-page', 'avoid-column'] }],
        'box-decoration': [{ 'box-decoration': ['slice', 'clone'] }],
        box: [{ box: ['border', 'content'] }],
        display: [
          'block',
          'inline-block',
          'inline',
          'flex',
          'inline-flex',
          'table',
          'inline-table',
          'table-caption',
          'table-cell',
          'table-column',
          'table-column-group',
          'table-footer-group',
          'table-header-group',
          'table-row-group',
          'table-row',
          'flow-root',
          'grid',
          'inline-grid',
          'contents',
          'list-item',
          'hidden',
        ],
        float: [{ float: ['right', 'left', 'none', 'start', 'end'] }],
        clear: [{ clear: ['left', 'right', 'both', 'none', 'start', 'end'] }],
        isolation: ['isolate', 'isolation-auto'],
        'object-fit': [{ object: ['contain', 'cover', 'fill', 'none', 'scale-down'] }],
        'object-position': [{ object: [...Yt(), ft] }],
        overflow: [{ overflow: Ot() }],
        'overflow-x': [{ 'overflow-x': Ot() }],
        'overflow-y': [{ 'overflow-y': Ot() }],
        overscroll: [{ overscroll: Mt() }],
        'overscroll-x': [{ 'overscroll-x': Mt() }],
        'overscroll-y': [{ 'overscroll-y': Mt() }],
        position: ['static', 'fixed', 'absolute', 'relative', 'sticky'],
        inset: [{ inset: [L] }],
        'inset-x': [{ 'inset-x': [L] }],
        'inset-y': [{ 'inset-y': [L] }],
        start: [{ start: [L] }],
        end: [{ end: [L] }],
        top: [{ top: [L] }],
        right: [{ right: [L] }],
        bottom: [{ bottom: [L] }],
        left: [{ left: [L] }],
        visibility: ['visible', 'invisible', 'collapse'],
        z: [{ z: ['auto', qa, ft] }],
        basis: [{ basis: yt() }],
        'flex-direction': [{ flex: ['row', 'row-reverse', 'col', 'col-reverse'] }],
        'flex-wrap': [{ flex: ['wrap', 'wrap-reverse', 'nowrap'] }],
        flex: [{ flex: ['1', 'auto', 'initial', 'none', ft] }],
        grow: [{ grow: et() }],
        shrink: [{ shrink: et() }],
        order: [{ order: ['first', 'last', 'none', qa, ft] }],
        'grid-cols': [{ 'grid-cols': [Ya] }],
        'col-start-end': [{ col: ['auto', { span: ['full', qa, ft] }, ft] }],
        'col-start': [{ 'col-start': Vt() }],
        'col-end': [{ 'col-end': Vt() }],
        'grid-rows': [{ 'grid-rows': [Ya] }],
        'row-start-end': [{ row: ['auto', { span: [qa, ft] }, ft] }],
        'row-start': [{ 'row-start': Vt() }],
        'row-end': [{ 'row-end': Vt() }],
        'grid-flow': [{ 'grid-flow': ['row', 'col', 'dense', 'row-dense', 'col-dense'] }],
        'auto-cols': [{ 'auto-cols': ['auto', 'min', 'max', 'fr', ft] }],
        'auto-rows': [{ 'auto-rows': ['auto', 'min', 'max', 'fr', ft] }],
        gap: [{ gap: [H] }],
        'gap-x': [{ 'gap-x': [H] }],
        'gap-y': [{ 'gap-y': [H] }],
        'justify-content': [{ justify: ['normal', ...R()] }],
        'justify-items': [{ 'justify-items': ['start', 'end', 'center', 'stretch'] }],
        'justify-self': [{ 'justify-self': ['auto', 'start', 'end', 'center', 'stretch'] }],
        'align-content': [{ content: ['normal', ...R(), 'baseline'] }],
        'align-items': [{ items: ['start', 'end', 'center', 'baseline', 'stretch'] }],
        'align-self': [{ self: ['auto', 'start', 'end', 'center', 'stretch', 'baseline'] }],
        'place-content': [{ 'place-content': [...R(), 'baseline'] }],
        'place-items': [{ 'place-items': ['start', 'end', 'center', 'baseline', 'stretch'] }],
        'place-self': [{ 'place-self': ['auto', 'start', 'end', 'center', 'stretch'] }],
        p: [{ p: [V] }],
        px: [{ px: [V] }],
        py: [{ py: [V] }],
        ps: [{ ps: [V] }],
        pe: [{ pe: [V] }],
        pt: [{ pt: [V] }],
        pr: [{ pr: [V] }],
        pb: [{ pb: [V] }],
        pl: [{ pl: [V] }],
        m: [{ m: [q] }],
        mx: [{ mx: [q] }],
        my: [{ my: [q] }],
        ms: [{ ms: [q] }],
        me: [{ me: [q] }],
        mt: [{ mt: [q] }],
        mr: [{ mr: [q] }],
        mb: [{ mb: [q] }],
        ml: [{ ml: [q] }],
        'space-x': [{ 'space-x': [J] }],
        'space-x-reverse': ['space-x-reverse'],
        'space-y': [{ 'space-y': [J] }],
        'space-y-reverse': ['space-y-reverse'],
        w: [{ w: ['auto', 'min', 'max', 'fit', 'svw', 'lvw', 'dvw', ft, s] }],
        'min-w': [{ 'min-w': [ft, s, 'min', 'max', 'fit'] }],
        'max-w': [
          { 'max-w': [ft, s, 'none', 'full', 'min', 'max', 'fit', 'prose', { screen: [Cl] }, Cl] },
        ],
        h: [{ h: [ft, s, 'auto', 'min', 'max', 'fit', 'svh', 'lvh', 'dvh'] }],
        'min-h': [{ 'min-h': [ft, s, 'min', 'max', 'fit', 'svh', 'lvh', 'dvh'] }],
        'max-h': [{ 'max-h': [ft, s, 'min', 'max', 'fit', 'svh', 'lvh', 'dvh'] }],
        size: [{ size: [ft, s, 'auto', 'min', 'max', 'fit'] }],
        'font-size': [{ text: ['base', Cl, Nl] }],
        'font-smoothing': ['antialiased', 'subpixel-antialiased'],
        'font-style': ['italic', 'not-italic'],
        'font-weight': [
          {
            font: [
              'thin',
              'extralight',
              'light',
              'normal',
              'medium',
              'semibold',
              'bold',
              'extrabold',
              'black',
              Uf,
            ],
          },
        ],
        'font-family': [{ font: [Ya] }],
        'fvn-normal': ['normal-nums'],
        'fvn-ordinal': ['ordinal'],
        'fvn-slashed-zero': ['slashed-zero'],
        'fvn-figure': ['lining-nums', 'oldstyle-nums'],
        'fvn-spacing': ['proportional-nums', 'tabular-nums'],
        'fvn-fraction': ['diagonal-fractions', 'stacked-fractions'],
        tracking: [{ tracking: ['tighter', 'tight', 'normal', 'wide', 'wider', 'widest', ft] }],
        'line-clamp': [{ 'line-clamp': ['none', wn, Uf] }],
        leading: [{ leading: ['none', 'tight', 'snug', 'normal', 'relaxed', 'loose', al, ft] }],
        'list-image': [{ 'list-image': ['none', ft] }],
        'list-style-type': [{ list: ['none', 'disc', 'decimal', ft] }],
        'list-style-position': [{ list: ['inside', 'outside'] }],
        'placeholder-color': [{ placeholder: [i] }],
        'placeholder-opacity': [{ 'placeholder-opacity': [Y] }],
        'text-alignment': [{ text: ['left', 'center', 'right', 'justify', 'start', 'end'] }],
        'text-color': [{ text: [i] }],
        'text-opacity': [{ 'text-opacity': [Y] }],
        'text-decoration': ['underline', 'overline', 'line-through', 'no-underline'],
        'text-decoration-style': [{ decoration: [...N(), 'wavy'] }],
        'text-decoration-thickness': [{ decoration: ['auto', 'from-font', al, Nl] }],
        'underline-offset': [{ 'underline-offset': ['auto', al, ft] }],
        'text-decoration-color': [{ decoration: [i] }],
        'text-transform': ['uppercase', 'lowercase', 'capitalize', 'normal-case'],
        'text-overflow': ['truncate', 'text-ellipsis', 'text-clip'],
        'text-wrap': [{ text: ['wrap', 'nowrap', 'balance', 'pretty'] }],
        indent: [{ indent: tt() }],
        'vertical-align': [
          {
            align: [
              'baseline',
              'top',
              'middle',
              'bottom',
              'text-top',
              'text-bottom',
              'sub',
              'super',
              ft,
            ],
          },
        ],
        whitespace: [
          { whitespace: ['normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap', 'break-spaces'] },
        ],
        break: [{ break: ['normal', 'words', 'all', 'keep'] }],
        hyphens: [{ hyphens: ['none', 'manual', 'auto'] }],
        content: [{ content: ['none', ft] }],
        'bg-attachment': [{ bg: ['fixed', 'local', 'scroll'] }],
        'bg-clip': [{ 'bg-clip': ['border', 'padding', 'content', 'text'] }],
        'bg-opacity': [{ 'bg-opacity': [Y] }],
        'bg-origin': [{ 'bg-origin': ['border', 'padding', 'content'] }],
        'bg-position': [{ bg: [...Yt(), iv] }],
        'bg-repeat': [{ bg: ['no-repeat', { repeat: ['', 'x', 'y', 'round', 'space'] }] }],
        'bg-size': [{ bg: ['auto', 'cover', 'contain', uv] }],
        'bg-image': [
          { bg: ['none', { 'gradient-to': ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl'] }, fv] },
        ],
        'bg-color': [{ bg: [i] }],
        'gradient-from-pos': [{ from: [$] }],
        'gradient-via-pos': [{ via: [$] }],
        'gradient-to-pos': [{ to: [$] }],
        'gradient-from': [{ from: [Z] }],
        'gradient-via': [{ via: [Z] }],
        'gradient-to': [{ to: [Z] }],
        rounded: [{ rounded: [d] }],
        'rounded-s': [{ 'rounded-s': [d] }],
        'rounded-e': [{ 'rounded-e': [d] }],
        'rounded-t': [{ 'rounded-t': [d] }],
        'rounded-r': [{ 'rounded-r': [d] }],
        'rounded-b': [{ 'rounded-b': [d] }],
        'rounded-l': [{ 'rounded-l': [d] }],
        'rounded-ss': [{ 'rounded-ss': [d] }],
        'rounded-se': [{ 'rounded-se': [d] }],
        'rounded-ee': [{ 'rounded-ee': [d] }],
        'rounded-es': [{ 'rounded-es': [d] }],
        'rounded-tl': [{ 'rounded-tl': [d] }],
        'rounded-tr': [{ 'rounded-tr': [d] }],
        'rounded-br': [{ 'rounded-br': [d] }],
        'rounded-bl': [{ 'rounded-bl': [d] }],
        'border-w': [{ border: [p] }],
        'border-w-x': [{ 'border-x': [p] }],
        'border-w-y': [{ 'border-y': [p] }],
        'border-w-s': [{ 'border-s': [p] }],
        'border-w-e': [{ 'border-e': [p] }],
        'border-w-t': [{ 'border-t': [p] }],
        'border-w-r': [{ 'border-r': [p] }],
        'border-w-b': [{ 'border-b': [p] }],
        'border-w-l': [{ 'border-l': [p] }],
        'border-opacity': [{ 'border-opacity': [Y] }],
        'border-style': [{ border: [...N(), 'hidden'] }],
        'divide-x': [{ 'divide-x': [p] }],
        'divide-x-reverse': ['divide-x-reverse'],
        'divide-y': [{ 'divide-y': [p] }],
        'divide-y-reverse': ['divide-y-reverse'],
        'divide-opacity': [{ 'divide-opacity': [Y] }],
        'divide-style': [{ divide: N() }],
        'border-color': [{ border: [m] }],
        'border-color-x': [{ 'border-x': [m] }],
        'border-color-y': [{ 'border-y': [m] }],
        'border-color-s': [{ 'border-s': [m] }],
        'border-color-e': [{ 'border-e': [m] }],
        'border-color-t': [{ 'border-t': [m] }],
        'border-color-r': [{ 'border-r': [m] }],
        'border-color-b': [{ 'border-b': [m] }],
        'border-color-l': [{ 'border-l': [m] }],
        'divide-color': [{ divide: [m] }],
        'outline-style': [{ outline: ['', ...N()] }],
        'outline-offset': [{ 'outline-offset': [al, ft] }],
        'outline-w': [{ outline: [al, Nl] }],
        'outline-color': [{ outline: [i] }],
        'ring-w': [{ ring: Qt() }],
        'ring-w-inset': ['ring-inset'],
        'ring-color': [{ ring: [i] }],
        'ring-opacity': [{ 'ring-opacity': [Y] }],
        'ring-offset-w': [{ 'ring-offset': [al, Nl] }],
        'ring-offset-color': [{ 'ring-offset': [i] }],
        shadow: [{ shadow: ['', 'inner', 'none', Cl, ov] }],
        'shadow-color': [{ shadow: [Ya] }],
        opacity: [{ opacity: [Y] }],
        'mix-blend': [{ 'mix-blend': [...w(), 'plus-lighter', 'plus-darker'] }],
        'bg-blend': [{ 'bg-blend': w() }],
        filter: [{ filter: ['', 'none'] }],
        blur: [{ blur: [o] }],
        brightness: [{ brightness: [f] }],
        contrast: [{ contrast: [S] }],
        'drop-shadow': [{ 'drop-shadow': ['', 'none', Cl, ft] }],
        grayscale: [{ grayscale: [g] }],
        'hue-rotate': [{ 'hue-rotate': [x] }],
        invert: [{ invert: [E] }],
        saturate: [{ saturate: [G] }],
        sepia: [{ sepia: [at] }],
        'backdrop-filter': [{ 'backdrop-filter': ['', 'none'] }],
        'backdrop-blur': [{ 'backdrop-blur': [o] }],
        'backdrop-brightness': [{ 'backdrop-brightness': [f] }],
        'backdrop-contrast': [{ 'backdrop-contrast': [S] }],
        'backdrop-grayscale': [{ 'backdrop-grayscale': [g] }],
        'backdrop-hue-rotate': [{ 'backdrop-hue-rotate': [x] }],
        'backdrop-invert': [{ 'backdrop-invert': [E] }],
        'backdrop-opacity': [{ 'backdrop-opacity': [Y] }],
        'backdrop-saturate': [{ 'backdrop-saturate': [G] }],
        'backdrop-sepia': [{ 'backdrop-sepia': [at] }],
        'border-collapse': [{ border: ['collapse', 'separate'] }],
        'border-spacing': [{ 'border-spacing': [y] }],
        'border-spacing-x': [{ 'border-spacing-x': [y] }],
        'border-spacing-y': [{ 'border-spacing-y': [y] }],
        'table-layout': [{ table: ['auto', 'fixed'] }],
        caption: [{ caption: ['top', 'bottom'] }],
        transition: [
          { transition: ['none', 'all', '', 'colors', 'opacity', 'shadow', 'transform', ft] },
        ],
        duration: [{ duration: v() }],
        ease: [{ ease: ['linear', 'in', 'out', 'in-out', ft] }],
        delay: [{ delay: v() }],
        animate: [{ animate: ['none', 'spin', 'ping', 'pulse', 'bounce', ft] }],
        transform: [{ transform: ['', 'gpu', 'none'] }],
        scale: [{ scale: [X] }],
        'scale-x': [{ 'scale-x': [X] }],
        'scale-y': [{ 'scale-y': [X] }],
        rotate: [{ rotate: [qa, ft] }],
        'translate-x': [{ 'translate-x': [zt] }],
        'translate-y': [{ 'translate-y': [zt] }],
        'skew-x': [{ 'skew-x': [F] }],
        'skew-y': [{ 'skew-y': [F] }],
        'transform-origin': [
          {
            origin: [
              'center',
              'top',
              'top-right',
              'right',
              'bottom-right',
              'bottom',
              'bottom-left',
              'left',
              'top-left',
              ft,
            ],
          },
        ],
        accent: [{ accent: ['auto', i] }],
        appearance: [{ appearance: ['none', 'auto'] }],
        cursor: [
          {
            cursor: [
              'auto',
              'default',
              'pointer',
              'wait',
              'text',
              'move',
              'help',
              'not-allowed',
              'none',
              'context-menu',
              'progress',
              'cell',
              'crosshair',
              'vertical-text',
              'alias',
              'copy',
              'no-drop',
              'grab',
              'grabbing',
              'all-scroll',
              'col-resize',
              'row-resize',
              'n-resize',
              'e-resize',
              's-resize',
              'w-resize',
              'ne-resize',
              'nw-resize',
              'se-resize',
              'sw-resize',
              'ew-resize',
              'ns-resize',
              'nesw-resize',
              'nwse-resize',
              'zoom-in',
              'zoom-out',
              ft,
            ],
          },
        ],
        'caret-color': [{ caret: [i] }],
        'pointer-events': [{ 'pointer-events': ['none', 'auto'] }],
        resize: [{ resize: ['none', 'y', 'x', ''] }],
        'scroll-behavior': [{ scroll: ['auto', 'smooth'] }],
        'scroll-m': [{ 'scroll-m': tt() }],
        'scroll-mx': [{ 'scroll-mx': tt() }],
        'scroll-my': [{ 'scroll-my': tt() }],
        'scroll-ms': [{ 'scroll-ms': tt() }],
        'scroll-me': [{ 'scroll-me': tt() }],
        'scroll-mt': [{ 'scroll-mt': tt() }],
        'scroll-mr': [{ 'scroll-mr': tt() }],
        'scroll-mb': [{ 'scroll-mb': tt() }],
        'scroll-ml': [{ 'scroll-ml': tt() }],
        'scroll-p': [{ 'scroll-p': tt() }],
        'scroll-px': [{ 'scroll-px': tt() }],
        'scroll-py': [{ 'scroll-py': tt() }],
        'scroll-ps': [{ 'scroll-ps': tt() }],
        'scroll-pe': [{ 'scroll-pe': tt() }],
        'scroll-pt': [{ 'scroll-pt': tt() }],
        'scroll-pr': [{ 'scroll-pr': tt() }],
        'scroll-pb': [{ 'scroll-pb': tt() }],
        'scroll-pl': [{ 'scroll-pl': tt() }],
        'snap-align': [{ snap: ['start', 'end', 'center', 'align-none'] }],
        'snap-stop': [{ snap: ['normal', 'always'] }],
        'snap-type': [{ snap: ['none', 'x', 'y', 'both'] }],
        'snap-strictness': [{ snap: ['mandatory', 'proximity'] }],
        touch: [{ touch: ['auto', 'none', 'manipulation'] }],
        'touch-x': [{ 'touch-pan': ['x', 'left', 'right'] }],
        'touch-y': [{ 'touch-pan': ['y', 'up', 'down'] }],
        'touch-pz': ['touch-pinch-zoom'],
        select: [{ select: ['none', 'text', 'all', 'auto'] }],
        'will-change': [{ 'will-change': ['auto', 'scroll', 'contents', 'transform', ft] }],
        fill: [{ fill: [i, 'none'] }],
        'stroke-w': [{ stroke: [al, Nl, Uf] }],
        stroke: [{ stroke: [i, 'none'] }],
        sr: ['sr-only', 'not-sr-only'],
        'forced-color-adjust': [{ 'forced-color-adjust': ['auto', 'none'] }],
      },
      conflictingClassGroups: {
        overflow: ['overflow-x', 'overflow-y'],
        overscroll: ['overscroll-x', 'overscroll-y'],
        inset: ['inset-x', 'inset-y', 'start', 'end', 'top', 'right', 'bottom', 'left'],
        'inset-x': ['right', 'left'],
        'inset-y': ['top', 'bottom'],
        flex: ['basis', 'grow', 'shrink'],
        gap: ['gap-x', 'gap-y'],
        p: ['px', 'py', 'ps', 'pe', 'pt', 'pr', 'pb', 'pl'],
        px: ['pr', 'pl'],
        py: ['pt', 'pb'],
        m: ['mx', 'my', 'ms', 'me', 'mt', 'mr', 'mb', 'ml'],
        mx: ['mr', 'ml'],
        my: ['mt', 'mb'],
        size: ['w', 'h'],
        'font-size': ['leading'],
        'fvn-normal': [
          'fvn-ordinal',
          'fvn-slashed-zero',
          'fvn-figure',
          'fvn-spacing',
          'fvn-fraction',
        ],
        'fvn-ordinal': ['fvn-normal'],
        'fvn-slashed-zero': ['fvn-normal'],
        'fvn-figure': ['fvn-normal'],
        'fvn-spacing': ['fvn-normal'],
        'fvn-fraction': ['fvn-normal'],
        'line-clamp': ['display', 'overflow'],
        rounded: [
          'rounded-s',
          'rounded-e',
          'rounded-t',
          'rounded-r',
          'rounded-b',
          'rounded-l',
          'rounded-ss',
          'rounded-se',
          'rounded-ee',
          'rounded-es',
          'rounded-tl',
          'rounded-tr',
          'rounded-br',
          'rounded-bl',
        ],
        'rounded-s': ['rounded-ss', 'rounded-es'],
        'rounded-e': ['rounded-se', 'rounded-ee'],
        'rounded-t': ['rounded-tl', 'rounded-tr'],
        'rounded-r': ['rounded-tr', 'rounded-br'],
        'rounded-b': ['rounded-br', 'rounded-bl'],
        'rounded-l': ['rounded-tl', 'rounded-bl'],
        'border-spacing': ['border-spacing-x', 'border-spacing-y'],
        'border-w': [
          'border-w-s',
          'border-w-e',
          'border-w-t',
          'border-w-r',
          'border-w-b',
          'border-w-l',
        ],
        'border-w-x': ['border-w-r', 'border-w-l'],
        'border-w-y': ['border-w-t', 'border-w-b'],
        'border-color': [
          'border-color-s',
          'border-color-e',
          'border-color-t',
          'border-color-r',
          'border-color-b',
          'border-color-l',
        ],
        'border-color-x': ['border-color-r', 'border-color-l'],
        'border-color-y': ['border-color-t', 'border-color-b'],
        'scroll-m': [
          'scroll-mx',
          'scroll-my',
          'scroll-ms',
          'scroll-me',
          'scroll-mt',
          'scroll-mr',
          'scroll-mb',
          'scroll-ml',
        ],
        'scroll-mx': ['scroll-mr', 'scroll-ml'],
        'scroll-my': ['scroll-mt', 'scroll-mb'],
        'scroll-p': [
          'scroll-px',
          'scroll-py',
          'scroll-ps',
          'scroll-pe',
          'scroll-pt',
          'scroll-pr',
          'scroll-pb',
          'scroll-pl',
        ],
        'scroll-px': ['scroll-pr', 'scroll-pl'],
        'scroll-py': ['scroll-pt', 'scroll-pb'],
        touch: ['touch-x', 'touch-y', 'touch-pz'],
        'touch-x': ['touch'],
        'touch-y': ['touch'],
        'touch-pz': ['touch'],
      },
      conflictingClassGroupModifiers: { 'font-size': ['leading'] },
    };
  },
  hv = ky(mv);
function Dm(...i) {
  return hv(By(i));
}
const yv = {
    primary:
      'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600 disabled:bg-indigo-600/50',
    secondary:
      'bg-zinc-800 text-zinc-100 hover:bg-zinc-700 focus-visible:outline-zinc-500 disabled:bg-zinc-800/50',
    ghost: 'text-zinc-200 hover:bg-zinc-800/60 focus-visible:outline-zinc-500',
    danger: 'bg-rose-600 text-white hover:bg-rose-500 focus-visible:outline-rose-600',
  },
  vv = { sm: 'h-8 px-3 text-sm', md: 'h-10 px-4 text-sm', lg: 'h-11 px-5 text-base' },
  Ne = B.forwardRef(function (
    { className: s, variant: o = 'primary', size: f = 'md', type: m = 'button', ...d },
    y,
  ) {
    return M.jsx('button', {
      ref: y,
      type: m,
      className: Dm(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-60',
        yv[o],
        vv[f],
        s,
      ),
      ...d,
    });
  });
function jm(i, [s, o]) {
  return Math.min(o, Math.max(s, i));
}
function Yn(i, s, { checkForDefaultPrevented: o = !0 } = {}) {
  return function (m) {
    if ((i == null || i(m), o === !1 || !m.defaultPrevented)) return s == null ? void 0 : s(m);
  };
}
function om(i, s) {
  if (typeof i == 'function') return i(s);
  i != null && (i.current = s);
}
function Um(...i) {
  return (s) => {
    let o = !1;
    const f = i.map((m) => {
      const d = om(m, s);
      return (!o && typeof d == 'function' && (o = !0), d);
    });
    if (o)
      return () => {
        for (let m = 0; m < f.length; m++) {
          const d = f[m];
          typeof d == 'function' ? d() : om(i[m], null);
        }
      };
  };
}
function Dl(...i) {
  return B.useCallback(Um(...i), i);
}
function Hm(i, s = []) {
  let o = [];
  function f(d, y) {
    const p = B.createContext(y),
      S = o.length;
    o = [...o, y];
    const g = (E) => {
      var Y;
      const { scope: H, children: Z, ...$ } = E,
        L = ((Y = H == null ? void 0 : H[i]) == null ? void 0 : Y[S]) || p,
        q = B.useMemo(() => $, Object.values($));
      return M.jsx(L.Provider, { value: q, children: Z });
    };
    g.displayName = d + 'Provider';
    function x(E, H) {
      var L;
      const Z = ((L = H == null ? void 0 : H[i]) == null ? void 0 : L[S]) || p,
        $ = B.useContext(Z);
      if ($) return $;
      if (y !== void 0) return y;
      throw new Error(`\`${E}\` must be used within \`${d}\``);
    }
    return [g, x];
  }
  const m = () => {
    const d = o.map((y) => B.createContext(y));
    return function (p) {
      const S = (p == null ? void 0 : p[i]) || d;
      return B.useMemo(() => ({ [`__scope${i}`]: { ...p, [i]: S } }), [p, S]);
    };
  };
  return ((m.scopeName = i), [f, gv(m, ...s)]);
}
function gv(...i) {
  const s = i[0];
  if (i.length === 1) return s;
  const o = () => {
    const f = i.map((m) => ({ useScope: m(), scopeName: m.scopeName }));
    return function (d) {
      const y = f.reduce((p, { useScope: S, scopeName: g }) => {
        const E = S(d)[`__scope${g}`];
        return { ...p, ...E };
      }, {});
      return B.useMemo(() => ({ [`__scope${s.scopeName}`]: y }), [y]);
    };
  };
  return ((o.scopeName = s.scopeName), o);
}
var Bm = globalThis != null && globalThis.document ? B.useLayoutEffect : () => {},
  pv = My[' useInsertionEffect '.trim().toString()] || Bm;
function bv({ prop: i, defaultProp: s, onChange: o = () => {}, caller: f }) {
  const [m, d, y] = Sv({ defaultProp: s, onChange: o }),
    p = i !== void 0,
    S = p ? i : m;
  {
    const x = B.useRef(i !== void 0);
    B.useEffect(() => {
      const E = x.current;
      (E !== p &&
        console.warn(
          `${f} is changing from ${E ? 'controlled' : 'uncontrolled'} to ${p ? 'controlled' : 'uncontrolled'}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`,
        ),
        (x.current = p));
    }, [p, f]);
  }
  const g = B.useCallback(
    (x) => {
      var E;
      if (p) {
        const H = xv(x) ? x(i) : x;
        H !== i && ((E = y.current) == null || E.call(y, H));
      } else d(x);
    },
    [p, i, d, y],
  );
  return [S, g];
}
function Sv({ defaultProp: i, onChange: s }) {
  const [o, f] = B.useState(i),
    m = B.useRef(o),
    d = B.useRef(s);
  return (
    pv(() => {
      d.current = s;
    }, [s]),
    B.useEffect(() => {
      var y;
      m.current !== o && ((y = d.current) == null || y.call(d, o), (m.current = o));
    }, [o, m]),
    [o, f, d]
  );
}
function xv(i) {
  return typeof i == 'function';
}
var zv = B.createContext(void 0);
function Ev(i) {
  const s = B.useContext(zv);
  return i || s || 'ltr';
}
function Av(i) {
  const s = B.useRef({ value: i, previous: i });
  return B.useMemo(
    () => (
      s.current.value !== i && ((s.current.previous = s.current.value), (s.current.value = i)),
      s.current.previous
    ),
    [i],
  );
}
function Tv(i) {
  const [s, o] = B.useState(void 0);
  return (
    Bm(() => {
      if (i) {
        o({ width: i.offsetWidth, height: i.offsetHeight });
        const f = new ResizeObserver((m) => {
          if (!Array.isArray(m) || !m.length) return;
          const d = m[0];
          let y, p;
          if ('borderBoxSize' in d) {
            const S = d.borderBoxSize,
              g = Array.isArray(S) ? S[0] : S;
            ((y = g.inlineSize), (p = g.blockSize));
          } else ((y = i.offsetWidth), (p = i.offsetHeight));
          o({ width: y, height: p });
        });
        return (f.observe(i, { box: 'border-box' }), () => f.unobserve(i));
      } else o(void 0);
    }, [i]),
    s
  );
}
Am();
function Gf(i) {
  const s = _v(i),
    o = B.forwardRef((f, m) => {
      const { children: d, ...y } = f,
        p = B.Children.toArray(d),
        S = p.find(Ov);
      if (S) {
        const g = S.props.children,
          x = p.map((E) =>
            E === S
              ? B.Children.count(g) > 1
                ? B.Children.only(null)
                : B.isValidElement(g)
                  ? g.props.children
                  : null
              : E,
          );
        return M.jsx(s, {
          ...y,
          ref: m,
          children: B.isValidElement(g) ? B.cloneElement(g, void 0, x) : null,
        });
      }
      return M.jsx(s, { ...y, ref: m, children: d });
    });
  return ((o.displayName = `${i}.Slot`), o);
}
function _v(i) {
  const s = B.forwardRef((o, f) => {
    const { children: m, ...d } = o;
    if (B.isValidElement(m)) {
      const y = Nv(m),
        p = Rv(d, m.props);
      return (m.type !== B.Fragment && (p.ref = f ? Um(f, y) : y), B.cloneElement(m, p));
    }
    return B.Children.count(m) > 1 ? B.Children.only(null) : null;
  });
  return ((s.displayName = `${i}.SlotClone`), s);
}
var Mv = Symbol('radix.slottable');
function Ov(i) {
  return (
    B.isValidElement(i) &&
    typeof i.type == 'function' &&
    '__radixId' in i.type &&
    i.type.__radixId === Mv
  );
}
function Rv(i, s) {
  const o = { ...s };
  for (const f in s) {
    const m = i[f],
      d = s[f];
    /^on[A-Z]/.test(f)
      ? m && d
        ? (o[f] = (...p) => {
            const S = d(...p);
            return (m(...p), S);
          })
        : m && (o[f] = m)
      : f === 'style'
        ? (o[f] = { ...m, ...d })
        : f === 'className' && (o[f] = [m, d].filter(Boolean).join(' '));
  }
  return { ...i, ...o };
}
function Nv(i) {
  var f, m;
  let s = (f = Object.getOwnPropertyDescriptor(i.props, 'ref')) == null ? void 0 : f.get,
    o = s && 'isReactWarning' in s && s.isReactWarning;
  return o
    ? i.ref
    : ((s = (m = Object.getOwnPropertyDescriptor(i, 'ref')) == null ? void 0 : m.get),
      (o = s && 'isReactWarning' in s && s.isReactWarning),
      o ? i.props.ref : i.props.ref || i.ref);
}
var Cv = [
    'a',
    'button',
    'div',
    'form',
    'h2',
    'h3',
    'img',
    'input',
    'label',
    'li',
    'nav',
    'ol',
    'p',
    'select',
    'span',
    'svg',
    'ul',
  ],
  Ga = Cv.reduce((i, s) => {
    const o = Gf(`Primitive.${s}`),
      f = B.forwardRef((m, d) => {
        const { asChild: y, ...p } = m,
          S = y ? o : s;
        return (
          typeof window < 'u' && (window[Symbol.for('radix-ui')] = !0),
          M.jsx(S, { ...p, ref: d })
        );
      });
    return ((f.displayName = `Primitive.${s}`), { ...i, [s]: f });
  }, {});
function Dv(i) {
  const s = i + 'CollectionProvider',
    [o, f] = Hm(s),
    [m, d] = o(s, { collectionRef: { current: null }, itemMap: new Map() }),
    y = (L) => {
      const { scope: q, children: Y } = L,
        V = Re.useRef(null),
        G = Re.useRef(new Map()).current;
      return M.jsx(m, { scope: q, itemMap: G, collectionRef: V, children: Y });
    };
  y.displayName = s;
  const p = i + 'CollectionSlot',
    S = Gf(p),
    g = Re.forwardRef((L, q) => {
      const { scope: Y, children: V } = L,
        G = d(p, Y),
        X = Dl(q, G.collectionRef);
      return M.jsx(S, { ref: X, children: V });
    });
  g.displayName = p;
  const x = i + 'CollectionItemSlot',
    E = 'data-radix-collection-item',
    H = Gf(x),
    Z = Re.forwardRef((L, q) => {
      const { scope: Y, children: V, ...G } = L,
        X = Re.useRef(null),
        at = Dl(q, X),
        F = d(x, Y);
      return (
        Re.useEffect(() => (F.itemMap.set(X, { ref: X, ...G }), () => void F.itemMap.delete(X))),
        M.jsx(H, { [E]: '', ref: at, children: V })
      );
    });
  Z.displayName = x;
  function $(L) {
    const q = d(i + 'CollectionConsumer', L);
    return Re.useCallback(() => {
      const V = q.collectionRef.current;
      if (!V) return [];
      const G = Array.from(V.querySelectorAll(`[${E}]`));
      return Array.from(q.itemMap.values()).sort(
        (F, J) => G.indexOf(F.ref.current) - G.indexOf(J.ref.current),
      );
    }, [q.collectionRef, q.itemMap]);
  }
  return [{ Provider: y, Slot: g, ItemSlot: Z }, $, f];
}
var qm = ['PageUp', 'PageDown'],
  Ym = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'],
  wm = {
    'from-left': ['Home', 'PageDown', 'ArrowDown', 'ArrowLeft'],
    'from-right': ['Home', 'PageDown', 'ArrowDown', 'ArrowRight'],
    'from-bottom': ['Home', 'PageDown', 'ArrowDown', 'ArrowLeft'],
    'from-top': ['Home', 'PageDown', 'ArrowUp', 'ArrowLeft'],
  },
  Ln = 'Slider',
  [Lf, jv, Uv] = Dv(Ln),
  [Gm] = Hm(Ln, [Uv]),
  [Hv, fi] = Gm(Ln),
  Lm = B.forwardRef((i, s) => {
    const {
        name: o,
        min: f = 0,
        max: m = 100,
        step: d = 1,
        orientation: y = 'horizontal',
        disabled: p = !1,
        minStepsBetweenThumbs: S = 0,
        defaultValue: g = [f],
        value: x,
        onValueChange: E = () => {},
        onValueCommit: H = () => {},
        inverted: Z = !1,
        form: $,
        ...L
      } = i,
      q = B.useRef(new Set()),
      Y = B.useRef(0),
      G = y === 'horizontal' ? Bv : qv,
      [X = [], at] = bv({
        prop: x,
        defaultProp: g,
        onChange: (yt) => {
          var Qt;
          ((Qt = [...q.current][Y.current]) == null || Qt.focus(), E(yt));
        },
      }),
      F = B.useRef(X);
    function J(yt) {
      const tt = Xv(X, yt);
      Ot(yt, tt);
    }
    function zt(yt) {
      Ot(yt, Y.current);
    }
    function Mt() {
      const yt = F.current[Y.current];
      X[Y.current] !== yt && H(X);
    }
    function Ot(yt, tt, { commit: Qt } = { commit: !1 }) {
      const Vt = Kv(d),
        Yt = Jv(Math.round((yt - f) / d) * d + f, Vt),
        N = jm(Yt, [f, m]);
      at((w = []) => {
        const R = Gv(w, N, tt);
        if (Zv(R, S * d)) {
          Y.current = R.indexOf(N);
          const et = String(R) !== String(w);
          return (et && Qt && H(R), et ? R : w);
        } else return w;
      });
    }
    return M.jsx(Hv, {
      scope: i.__scopeSlider,
      name: o,
      disabled: p,
      min: f,
      max: m,
      valueIndexToChangeRef: Y,
      thumbs: q.current,
      values: X,
      orientation: y,
      form: $,
      children: M.jsx(Lf.Provider, {
        scope: i.__scopeSlider,
        children: M.jsx(Lf.Slot, {
          scope: i.__scopeSlider,
          children: M.jsx(G, {
            'aria-disabled': p,
            'data-disabled': p ? '' : void 0,
            ...L,
            ref: s,
            onPointerDown: Yn(L.onPointerDown, () => {
              p || (F.current = X);
            }),
            min: f,
            max: m,
            inverted: Z,
            onSlideStart: p ? void 0 : J,
            onSlideMove: p ? void 0 : zt,
            onSlideEnd: p ? void 0 : Mt,
            onHomeKeyDown: () => !p && Ot(f, 0, { commit: !0 }),
            onEndKeyDown: () => !p && Ot(m, X.length - 1, { commit: !0 }),
            onStepKeyDown: ({ event: yt, direction: tt }) => {
              if (!p) {
                const Yt = qm.includes(yt.key) || (yt.shiftKey && Ym.includes(yt.key)) ? 10 : 1,
                  N = Y.current,
                  w = X[N],
                  R = d * Yt * tt;
                Ot(w + R, N, { commit: !0 });
              }
            },
          }),
        }),
      }),
    });
  });
Lm.displayName = Ln;
var [Xm, Qm] = Gm(Ln, { startEdge: 'left', endEdge: 'right', size: 'width', direction: 1 }),
  Bv = B.forwardRef((i, s) => {
    const {
        min: o,
        max: f,
        dir: m,
        inverted: d,
        onSlideStart: y,
        onSlideMove: p,
        onSlideEnd: S,
        onStepKeyDown: g,
        ...x
      } = i,
      [E, H] = B.useState(null),
      Z = Dl(s, (G) => H(G)),
      $ = B.useRef(void 0),
      L = Ev(m),
      q = L === 'ltr',
      Y = (q && !d) || (!q && d);
    function V(G) {
      const X = $.current || E.getBoundingClientRect(),
        at = [0, X.width],
        J = $f(at, Y ? [o, f] : [f, o]);
      return (($.current = X), J(G - X.left));
    }
    return M.jsx(Xm, {
      scope: i.__scopeSlider,
      startEdge: Y ? 'left' : 'right',
      endEdge: Y ? 'right' : 'left',
      direction: Y ? 1 : -1,
      size: 'width',
      children: M.jsx(Vm, {
        dir: L,
        'data-orientation': 'horizontal',
        ...x,
        ref: Z,
        style: { ...x.style, '--radix-slider-thumb-transform': 'translateX(-50%)' },
        onSlideStart: (G) => {
          const X = V(G.clientX);
          y == null || y(X);
        },
        onSlideMove: (G) => {
          const X = V(G.clientX);
          p == null || p(X);
        },
        onSlideEnd: () => {
          (($.current = void 0), S == null || S());
        },
        onStepKeyDown: (G) => {
          const at = wm[Y ? 'from-left' : 'from-right'].includes(G.key);
          g == null || g({ event: G, direction: at ? -1 : 1 });
        },
      }),
    });
  }),
  qv = B.forwardRef((i, s) => {
    const {
        min: o,
        max: f,
        inverted: m,
        onSlideStart: d,
        onSlideMove: y,
        onSlideEnd: p,
        onStepKeyDown: S,
        ...g
      } = i,
      x = B.useRef(null),
      E = Dl(s, x),
      H = B.useRef(void 0),
      Z = !m;
    function $(L) {
      const q = H.current || x.current.getBoundingClientRect(),
        Y = [0, q.height],
        G = $f(Y, Z ? [f, o] : [o, f]);
      return ((H.current = q), G(L - q.top));
    }
    return M.jsx(Xm, {
      scope: i.__scopeSlider,
      startEdge: Z ? 'bottom' : 'top',
      endEdge: Z ? 'top' : 'bottom',
      size: 'height',
      direction: Z ? 1 : -1,
      children: M.jsx(Vm, {
        'data-orientation': 'vertical',
        ...g,
        ref: E,
        style: { ...g.style, '--radix-slider-thumb-transform': 'translateY(50%)' },
        onSlideStart: (L) => {
          const q = $(L.clientY);
          d == null || d(q);
        },
        onSlideMove: (L) => {
          const q = $(L.clientY);
          y == null || y(q);
        },
        onSlideEnd: () => {
          ((H.current = void 0), p == null || p());
        },
        onStepKeyDown: (L) => {
          const Y = wm[Z ? 'from-bottom' : 'from-top'].includes(L.key);
          S == null || S({ event: L, direction: Y ? -1 : 1 });
        },
      }),
    });
  }),
  Vm = B.forwardRef((i, s) => {
    const {
        __scopeSlider: o,
        onSlideStart: f,
        onSlideMove: m,
        onSlideEnd: d,
        onHomeKeyDown: y,
        onEndKeyDown: p,
        onStepKeyDown: S,
        ...g
      } = i,
      x = fi(Ln, o);
    return M.jsx(Ga.span, {
      ...g,
      ref: s,
      onKeyDown: Yn(i.onKeyDown, (E) => {
        E.key === 'Home'
          ? (y(E), E.preventDefault())
          : E.key === 'End'
            ? (p(E), E.preventDefault())
            : qm.concat(Ym).includes(E.key) && (S(E), E.preventDefault());
      }),
      onPointerDown: Yn(i.onPointerDown, (E) => {
        const H = E.target;
        (H.setPointerCapture(E.pointerId), E.preventDefault(), x.thumbs.has(H) ? H.focus() : f(E));
      }),
      onPointerMove: Yn(i.onPointerMove, (E) => {
        E.target.hasPointerCapture(E.pointerId) && m(E);
      }),
      onPointerUp: Yn(i.onPointerUp, (E) => {
        const H = E.target;
        H.hasPointerCapture(E.pointerId) && (H.releasePointerCapture(E.pointerId), d(E));
      }),
    });
  }),
  Zm = 'SliderTrack',
  Km = B.forwardRef((i, s) => {
    const { __scopeSlider: o, ...f } = i,
      m = fi(Zm, o);
    return M.jsx(Ga.span, {
      'data-disabled': m.disabled ? '' : void 0,
      'data-orientation': m.orientation,
      ...f,
      ref: s,
    });
  });
Km.displayName = Zm;
var Xf = 'SliderRange',
  Jm = B.forwardRef((i, s) => {
    const { __scopeSlider: o, ...f } = i,
      m = fi(Xf, o),
      d = Qm(Xf, o),
      y = B.useRef(null),
      p = Dl(s, y),
      S = m.values.length,
      g = m.values.map((H) => Wm(H, m.min, m.max)),
      x = S > 1 ? Math.min(...g) : 0,
      E = 100 - Math.max(...g);
    return M.jsx(Ga.span, {
      'data-orientation': m.orientation,
      'data-disabled': m.disabled ? '' : void 0,
      ...f,
      ref: p,
      style: { ...i.style, [d.startEdge]: x + '%', [d.endEdge]: E + '%' },
    });
  });
Jm.displayName = Xf;
var Qf = 'SliderThumb',
  $m = B.forwardRef((i, s) => {
    const o = jv(i.__scopeSlider),
      [f, m] = B.useState(null),
      d = Dl(s, (p) => m(p)),
      y = B.useMemo(() => (f ? o().findIndex((p) => p.ref.current === f) : -1), [o, f]);
    return M.jsx(Yv, { ...i, ref: d, index: y });
  }),
  Yv = B.forwardRef((i, s) => {
    const { __scopeSlider: o, index: f, name: m, ...d } = i,
      y = fi(Qf, o),
      p = Qm(Qf, o),
      [S, g] = B.useState(null),
      x = Dl(s, (V) => g(V)),
      E = S ? y.form || !!S.closest('form') : !0,
      H = Tv(S),
      Z = y.values[f],
      $ = Z === void 0 ? 0 : Wm(Z, y.min, y.max),
      L = Lv(f, y.values.length),
      q = H == null ? void 0 : H[p.size],
      Y = q ? Qv(q, $, p.direction) : 0;
    return (
      B.useEffect(() => {
        if (S)
          return (
            y.thumbs.add(S),
            () => {
              y.thumbs.delete(S);
            }
          );
      }, [S, y.thumbs]),
      M.jsxs('span', {
        style: {
          transform: 'var(--radix-slider-thumb-transform)',
          position: 'absolute',
          [p.startEdge]: `calc(${$}% + ${Y}px)`,
        },
        children: [
          M.jsx(Lf.ItemSlot, {
            scope: i.__scopeSlider,
            children: M.jsx(Ga.span, {
              role: 'slider',
              'aria-label': i['aria-label'] || L,
              'aria-valuemin': y.min,
              'aria-valuenow': Z,
              'aria-valuemax': y.max,
              'aria-orientation': y.orientation,
              'data-orientation': y.orientation,
              'data-disabled': y.disabled ? '' : void 0,
              tabIndex: y.disabled ? void 0 : 0,
              ...d,
              ref: x,
              style: Z === void 0 ? { display: 'none' } : i.style,
              onFocus: Yn(i.onFocus, () => {
                y.valueIndexToChangeRef.current = f;
              }),
            }),
          }),
          E &&
            M.jsx(
              km,
              {
                name: m ?? (y.name ? y.name + (y.values.length > 1 ? '[]' : '') : void 0),
                form: y.form,
                value: Z,
              },
              f,
            ),
        ],
      })
    );
  });
$m.displayName = Qf;
var wv = 'RadioBubbleInput',
  km = B.forwardRef(({ __scopeSlider: i, value: s, ...o }, f) => {
    const m = B.useRef(null),
      d = Dl(m, f),
      y = Av(s);
    return (
      B.useEffect(() => {
        const p = m.current;
        if (!p) return;
        const S = window.HTMLInputElement.prototype,
          x = Object.getOwnPropertyDescriptor(S, 'value').set;
        if (y !== s && x) {
          const E = new Event('input', { bubbles: !0 });
          (x.call(p, s), p.dispatchEvent(E));
        }
      }, [y, s]),
      M.jsx(Ga.input, { style: { display: 'none' }, ...o, ref: d, defaultValue: s })
    );
  });
km.displayName = wv;
function Gv(i = [], s, o) {
  const f = [...i];
  return ((f[o] = s), f.sort((m, d) => m - d));
}
function Wm(i, s, o) {
  const d = (100 / (o - s)) * (i - s);
  return jm(d, [0, 100]);
}
function Lv(i, s) {
  return s > 2 ? `Value ${i + 1} of ${s}` : s === 2 ? ['Minimum', 'Maximum'][i] : void 0;
}
function Xv(i, s) {
  if (i.length === 1) return 0;
  const o = i.map((m) => Math.abs(m - s)),
    f = Math.min(...o);
  return o.indexOf(f);
}
function Qv(i, s, o) {
  const f = i / 2,
    d = $f([0, 50], [0, f]);
  return (f - d(s) * o) * o;
}
function Vv(i) {
  return i.slice(0, -1).map((s, o) => i[o + 1] - s);
}
function Zv(i, s) {
  if (s > 0) {
    const o = Vv(i);
    return Math.min(...o) >= s;
  }
  return !0;
}
function $f(i, s) {
  return (o) => {
    if (i[0] === i[1] || s[0] === s[1]) return s[0];
    const f = (s[1] - s[0]) / (i[1] - i[0]);
    return s[0] + f * (o - i[0]);
  };
}
function Kv(i) {
  return (String(i).split('.')[1] || '').length;
}
function Jv(i, s) {
  const o = Math.pow(10, s);
  return Math.round(i * o) / o;
}
var $v = Lm,
  kv = Km,
  Wv = Jm,
  Fv = $m;
function Hf({
  value: i,
  min: s,
  max: o,
  step: f = 1,
  onValueChange: m,
  ariaLabel: d,
  className: y,
  disabled: p,
}) {
  return M.jsxs($v, {
    className: Dm('relative flex h-5 w-full items-center', y),
    value: [i],
    min: s,
    max: o,
    step: f,
    onValueChange: (S) => m(S[0] ?? i),
    disabled: p,
    'aria-label': d,
    children: [
      M.jsx(kv, {
        className: 'relative h-1.5 grow rounded-full bg-zinc-800',
        children: M.jsx(Wv, { className: 'absolute h-full rounded-full bg-indigo-500' }),
      }),
      M.jsx(Fv, {
        className:
          'block h-4 w-4 rounded-full border-2 border-indigo-500 bg-white shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400',
        'aria-label': d,
      }),
    ],
  });
}
function Iv(i, s) {
  const o = new Float32Array(s),
    f = new Float32Array(s);
  if (s === 0 || i.length === 0) return { min: o, max: f };
  const m = i.length / s;
  for (let d = 0; d < s; d++) {
    const y = Math.floor(d * m),
      p = Math.min(i.length, Math.floor((d + 1) * m));
    let S = 1 / 0,
      g = -1 / 0;
    for (let x = y; x < p; x++) {
      const E = i[x];
      (E < S && (S = E), E > g && (g = E));
    }
    ((o[d] = S === 1 / 0 ? 0 : S), (f[d] = g === -1 / 0 ? 0 : g));
  }
  return { min: o, max: f };
}
const sm = 6;
function Pv({
  peaks: i,
  regions: s,
  duration: o,
  currentTime: f,
  onSeek: m,
  onBoundaryDrag: d,
  onRegionClick: y,
  height: p = 120,
}) {
  const S = B.useRef(null),
    [g, x] = B.useState('pointer'),
    E = B.useRef(null);
  B.useEffect(() => {
    const V = S.current;
    if (!V) return;
    const G = window.devicePixelRatio || 1,
      X = V.clientWidth,
      at = V.clientHeight;
    ((V.width = Math.max(1, Math.floor(X * G))), (V.height = Math.max(1, Math.floor(at * G))));
    const F = V.getContext('2d');
    if (F) {
      if (
        (F.setTransform(G, 0, 0, G, 0, 0),
        F.clearRect(0, 0, X, at),
        (F.fillStyle = '#18181b'),
        F.fillRect(0, 0, X, at),
        o > 0)
      )
        for (const J of s) {
          if (J.kept) continue;
          const zt = (J.start / o) * X,
            Mt = ((J.end - J.start) / o) * X;
          ((F.fillStyle = 'rgba(244, 63, 94, 0.22)'),
            F.fillRect(zt, 0, Mt, at),
            (F.fillStyle = 'rgba(244, 63, 94, 0.55)'),
            F.fillRect(zt, 0, 1, at),
            F.fillRect(zt + Mt - 1, 0, 1, at));
        }
      if (i && i.length > 0) {
        const { min: J, max: zt } = Iv(i, Math.floor(X)),
          Mt = at / 2;
        ((F.strokeStyle = '#a5b4fc'), (F.lineWidth = 1), F.beginPath());
        for (let Ot = 0; Ot < J.length; Ot++) {
          const yt = Mt - zt[Ot] * Mt,
            tt = Mt - J[Ot] * Mt;
          (F.moveTo(Ot + 0.5, yt), F.lineTo(Ot + 0.5, tt));
        }
        F.stroke();
      }
      if (o > 0) {
        const J = (f / o) * X;
        ((F.strokeStyle = '#f59e0b'),
          (F.lineWidth = 1.5),
          F.beginPath(),
          F.moveTo(J, 0),
          F.lineTo(J, at),
          F.stroke());
      }
    }
  }, [i, s, o, f, p]);
  const H = (V) => {
      const G = V.currentTarget.getBoundingClientRect(),
        X = (V.clientX - G.left) / G.width;
      return { time: Math.max(0, Math.min(o, X * o)), ratio: X };
    },
    Z = (V) => {
      if (o <= 0) return null;
      const G = V.currentTarget.getBoundingClientRect(),
        X = V.clientX - G.left,
        at = G.width / o;
      for (let F = 0; F < s.length; F++) {
        const J = s[F];
        if (F > 0 && Math.abs(J.start * at - X) <= sm) return { regionId: J.id, side: 'start' };
        if (F < s.length - 1 && Math.abs(J.end * at - X) <= sm)
          return { regionId: J.id, side: 'end' };
      }
      return null;
    },
    $ = (V) => {
      const G = Z(V);
      G && d && ((E.current = G), V.preventDefault());
    },
    L = (V) => {
      if (E.current && d) {
        const { time: G } = H(V);
        d(E.current.regionId, E.current.side, G);
        return;
      }
      x(Z(V) ? 'col-resize' : 'pointer');
    },
    q = () => {
      E.current = null;
    },
    Y = (V) => {
      if (E.current) {
        E.current = null;
        return;
      }
      if (Z(V)) return;
      const { time: G } = H(V);
      if (V.detail === 2 && y && o > 0) {
        const X = s.find((at) => G >= at.start && G <= at.end);
        if (X) {
          y(X.id);
          return;
        }
      }
      m == null || m(G);
    };
  return M.jsx('canvas', {
    ref: S,
    onMouseDown: $,
    onMouseMove: L,
    onMouseUp: q,
    onMouseLeave: q,
    onClick: Y,
    role: 'slider',
    tabIndex: 0,
    'aria-label':
      'Waveform timeline. Click to seek. Double-click to toggle a region. Drag boundaries to resize.',
    'aria-valuemin': 0,
    'aria-valuemax': o,
    'aria-valuenow': f,
    style: { width: '100%', height: p, display: 'block', cursor: g },
  });
}
const rm = { thresholdDb: -30, minSilenceDurationMs: 500, paddingMs: 100, minKeepDurationMs: 100 };
function dm(i, s, o) {
  const f = o.paddingMs / 1e3,
    m = o.minKeepDurationMs / 1e3,
    d = s
      .map((x) => ({ start: Math.max(0, x.start + f), end: Math.min(i, x.end - f) }))
      .filter((x) => x.end > x.start)
      .sort((x, E) => x.start - E.start),
    y = [];
  for (const x of d) {
    const E = y[y.length - 1];
    E && x.start <= E.end ? (E.end = Math.max(E.end, x.end)) : y.push({ ...x });
  }
  const p = [];
  let S = 0,
    g = 0;
  for (const x of y)
    (x.start > S && p.push({ id: `r${g++}`, start: S, end: x.start, kept: !0, source: 'detected' }),
      p.push({ id: `r${g++}`, start: x.start, end: x.end, kept: !1, source: 'detected' }),
      (S = x.end));
  return (
    S < i && p.push({ id: `r${g++}`, start: S, end: i, kept: !0, source: 'detected' }),
    tg(p, m)
  );
}
function tg(i, s) {
  return i.map((o) => (o.kept && o.end - o.start < s ? { ...o, kept: !1 } : o));
}
function La(i) {
  return i.filter((s) => s.kept);
}
function Fm(i) {
  return La(i).reduce((s, o) => s + (o.end - o.start), 0);
}
function mm(i, s) {
  return i.map((o) => (o.id === s ? { ...o, kept: !o.kept } : o));
}
function eg(i, s, o, f, m = 0.05) {
  const d = i.findIndex((p) => p.id === s);
  if (d === -1) return i;
  const y = i[d];
  if (o === 'start') {
    if (d === 0) return i;
    const p = i[d - 1],
      S = p.start + m,
      g = y.end - m,
      x = Math.max(S, Math.min(g, f)),
      E = [...i];
    return ((E[d - 1] = { ...p, end: x }), (E[d] = { ...y, start: x }), E);
  } else {
    if (d === i.length - 1) return i;
    const p = i[d + 1],
      S = y.start + m,
      g = p.end - m,
      x = Math.max(S, Math.min(g, f)),
      E = [...i];
    return ((E[d] = { ...y, end: x }), (E[d + 1] = { ...p, start: x }), E);
  }
}
function lg(i, s, o) {
  const f = i.findIndex((p) => s > p.start && s < p.end);
  if (f === -1) return i;
  const m = i[f],
    d = { ...m, end: s },
    y = { id: o(), start: s, end: m.end, kept: m.kept, source: 'manual' };
  return [...i.slice(0, f), d, y, ...i.slice(f + 1)];
}
function ng(i, s) {
  const o = i.findIndex((y) => y.id === s);
  if (o === -1 || o === i.length - 1) return i;
  const f = i[o],
    m = i[o + 1],
    d = { ...f, end: m.end, source: 'manual' };
  return [...i.slice(0, o), d, ...i.slice(o + 2)];
}
function ag(i, s) {
  return i.find((o) => s >= o.start && s <= o.end) ?? null;
}
function ug(i, s) {
  for (const o of i) if (o.kept && o.start > s + 0.001) return o.start;
  return null;
}
function ig(i, s) {
  let o = null;
  for (const f of i)
    if (f.kept) {
      if (f.end >= s - 0.001) break;
      o = f.start;
    }
  return o;
}
const hm = [
  { id: 'streaming', label: 'Streaming (-14 LUFS)', i: -14, tp: -1, lra: 11 },
  { id: 'podcast', label: 'Podcast / Apple Music (-16 LUFS)', i: -16, tp: -1, lra: 11 },
  { id: 'broadcast', label: 'EBU R128 (-23 LUFS)', i: -23, tp: -2, lra: 11 },
];
function cg(i, s = !0) {
  const o = ['loudnorm', `I=${i.i}`, `TP=${i.tp}`, `LRA=${i.lra}`, 'print_format=summary'];
  return (s || o.push('linear=true'), o.join(':'));
}
const fg = '.quietcut',
  ym = 1;
function vm(i) {
  return JSON.stringify({ ...i, updatedAt: new Date().toISOString() }, null, 2);
}
function og(i) {
  const s = JSON.parse(i);
  if (s.version !== ym)
    throw new Error(`Unsupported project version ${s.version}. Expected ${ym}.`);
  return s;
}
const gm = (i) => {
    let s;
    const o = new Set(),
      f = (g, x) => {
        const E = typeof g == 'function' ? g(s) : g;
        if (!Object.is(E, s)) {
          const H = s;
          ((s = (x ?? (typeof E != 'object' || E === null)) ? E : Object.assign({}, s, E)),
            o.forEach((Z) => Z(s, H)));
        }
      },
      m = () => s,
      p = {
        setState: f,
        getState: m,
        getInitialState: () => S,
        subscribe: (g) => (o.add(g), () => o.delete(g)),
      },
      S = (s = i(f, m, p));
    return p;
  },
  sg = (i) => (i ? gm(i) : gm),
  rg = (i) => i;
function dg(i, s = rg) {
  const o = Re.useSyncExternalStore(
    i.subscribe,
    Re.useCallback(() => s(i.getState()), [i, s]),
    Re.useCallback(() => s(i.getInitialState()), [i, s]),
  );
  return (Re.useDebugValue(o), o);
}
const pm = (i) => {
    const s = sg(i),
      o = (f) => dg(s, f);
    return (Object.assign(o, s), o);
  },
  mg = (i) => (i ? pm(i) : pm),
  Ue = mg((i, s) => ({
    sources: [],
    currentSourceId: null,
    regionsBySource: {},
    peaksBySource: {},
    detectionSettings: { ...rm },
    currentTime: 0,
    past: [],
    future: [],
    projectPath: null,
    projectName: 'Untitled',
    source: () => {
      const { sources: o, currentSourceId: f } = s();
      return o.find((m) => m.id === f) ?? null;
    },
    regions: () => {
      const { regionsBySource: o, currentSourceId: f } = s();
      return f ? (o[f] ?? []) : [];
    },
    peaks: () => {
      const { peaksBySource: o, currentSourceId: f } = s();
      return f ? (o[f] ?? null) : null;
    },
    addSource: (o) => {
      const { sources: f } = s();
      if (f.some((m) => m.id === o.id)) {
        i({ currentSourceId: o.id, currentTime: 0 });
        return;
      }
      i({ sources: [...f, o], currentSourceId: o.id, currentTime: 0 });
    },
    removeSource: (o) => {
      var x;
      const { sources: f, regionsBySource: m, peaksBySource: d, currentSourceId: y } = s(),
        p = f.filter((E) => E.id !== o),
        S = { ...m };
      delete S[o];
      const g = { ...d };
      (delete g[o],
        i({
          sources: p,
          regionsBySource: S,
          peaksBySource: g,
          currentSourceId: y === o ? (((x = p[0]) == null ? void 0 : x.id) ?? null) : y,
        }));
    },
    selectSource: (o) => i({ currentSourceId: o, currentTime: 0 }),
    setRegions: (o, f = { history: !0 }) => {
      const { currentSourceId: m, regionsBySource: d, past: y } = s();
      if (m)
        if (f.history) {
          const p = d[m] ?? [],
            S = [...y, { sourceId: m, regions: p }].slice(-100);
          i({ regionsBySource: { ...d, [m]: o }, past: S, future: [] });
        } else i({ regionsBySource: { ...d, [m]: o } });
    },
    setRegionsFor: (o, f) => {
      i({ regionsBySource: { ...s().regionsBySource, [o]: f } });
    },
    setPeaks: (o) => {
      const { currentSourceId: f, peaksBySource: m } = s();
      if (!f) return;
      const d = { ...m };
      (o ? (d[f] = o) : delete d[f], i({ peaksBySource: d }));
    },
    setPeaksFor: (o, f) => {
      i({ peaksBySource: { ...s().peaksBySource, [o]: f } });
    },
    setCurrentTime: (o) => i({ currentTime: o }),
    setDetectionSettings: (o) => i({ detectionSettings: o }),
    undo: () => {
      const { past: o, regionsBySource: f, future: m } = s(),
        d = o[o.length - 1];
      if (!d) return;
      const y = f[d.sourceId] ?? [];
      i({
        regionsBySource: { ...f, [d.sourceId]: d.regions },
        past: o.slice(0, -1),
        future: [{ sourceId: d.sourceId, regions: y }, ...m],
        currentSourceId: d.sourceId,
      });
    },
    redo: () => {
      const { future: o, regionsBySource: f, past: m } = s(),
        d = o[0];
      if (!d) return;
      const y = f[d.sourceId] ?? [];
      i({
        regionsBySource: { ...f, [d.sourceId]: d.regions },
        future: o.slice(1),
        past: [...m, { sourceId: d.sourceId, regions: y }],
        currentSourceId: d.sourceId,
      });
    },
    resetHistory: () => i({ past: [], future: [] }),
    setProjectPath: (o) => i({ projectPath: o }),
    setProjectName: (o) => i({ projectName: o }),
    loadProject: (o, f) => {
      var m;
      i({
        sources: o.sources,
        regionsBySource: o.regionsBySource,
        peaksBySource: {},
        currentSourceId: ((m = o.sources[0]) == null ? void 0 : m.id) ?? null,
        detectionSettings: o.detectionSettings,
        currentTime: 0,
        past: [],
        future: [],
        projectPath: f,
        projectName: o.name,
      });
    },
    toProjectFile: () => {
      const { sources: o, regionsBySource: f, detectionSettings: m, projectName: d } = s(),
        y = new Date().toISOString();
      return {
        version: 1,
        name: d,
        createdAt: y,
        updatedAt: y,
        sources: o,
        regionsBySource: f,
        detectionSettings: m,
      };
    },
    resetProject: () => {
      i({
        sources: [],
        currentSourceId: null,
        regionsBySource: {},
        peaksBySource: {},
        detectionSettings: { ...rm },
        currentTime: 0,
        past: [],
        future: [],
        projectPath: null,
        projectName: 'Untitled',
      });
    },
  }));
var bm;
(function (i) {
  ((i[(i.Audio = 1)] = 'Audio'),
    (i[(i.Cache = 2)] = 'Cache'),
    (i[(i.Config = 3)] = 'Config'),
    (i[(i.Data = 4)] = 'Data'),
    (i[(i.LocalData = 5)] = 'LocalData'),
    (i[(i.Document = 6)] = 'Document'),
    (i[(i.Download = 7)] = 'Download'),
    (i[(i.Picture = 8)] = 'Picture'),
    (i[(i.Public = 9)] = 'Public'),
    (i[(i.Video = 10)] = 'Video'),
    (i[(i.Resource = 11)] = 'Resource'),
    (i[(i.Temp = 12)] = 'Temp'),
    (i[(i.AppConfig = 13)] = 'AppConfig'),
    (i[(i.AppData = 14)] = 'AppData'),
    (i[(i.AppLocalData = 15)] = 'AppLocalData'),
    (i[(i.AppCache = 16)] = 'AppCache'),
    (i[(i.AppLog = 17)] = 'AppLog'),
    (i[(i.Desktop = 18)] = 'Desktop'),
    (i[(i.Executable = 19)] = 'Executable'),
    (i[(i.Font = 20)] = 'Font'),
    (i[(i.Home = 21)] = 'Home'),
    (i[(i.Runtime = 22)] = 'Runtime'),
    (i[(i.Template = 23)] = 'Template'));
})(bm || (bm = {}));
var Sm;
(function (i) {
  ((i[(i.Start = 0)] = 'Start'), (i[(i.Current = 1)] = 'Current'), (i[(i.End = 2)] = 'End'));
})(Sm || (Sm = {}));
async function hg(i, s) {
  if (i instanceof URL && i.protocol !== 'file:') throw new TypeError('Must be a file URL.');
  const o = await we('plugin:fs|read_text_file', {
      path: i instanceof URL ? i.toString() : i,
      options: s,
    }),
    f = o instanceof ArrayBuffer ? o : Uint8Array.from(o);
  return new TextDecoder('utf-8').decode(f);
}
async function yg(i, s, o) {
  if (i instanceof URL && i.protocol !== 'file:') throw new TypeError('Must be a file URL.');
  const f = new TextEncoder();
  await we('plugin:fs|write_text_file', f.encode(s), {
    headers: {
      path: encodeURIComponent(i instanceof URL ? i.toString() : i),
      options: JSON.stringify(o),
    },
  });
}
async function vg() {
  const i = await Tm({
    multiple: !0,
    filters: [
      {
        name: 'Media',
        extensions: ['mp4', 'mov', 'mkv', 'webm', 'avi', 'mp3', 'wav', 'flac', 'm4a', 'aac', 'ogg'],
      },
    ],
  });
  return i ? (Array.isArray(i) ? i : [i]) : [];
}
async function gg(i) {
  return await we('analyze_media', { path: i });
}
async function xm(i, s) {
  return await we('detect_silences', { path: i, settings: s });
}
async function pg(i, s = 2048) {
  const o = await we('compute_peaks', { path: i, targetBins: s });
  return Float32Array.from(o);
}
async function bg(i) {
  return await we('export_cut', { request: i });
}
async function Vf(i, s) {
  await yg(i, s);
}
async function Sg(i) {
  return await hg(i);
}
const xg = B.forwardRef(function ({ source: s, onTimeUpdate: o }, f) {
  const m = B.useRef(null),
    d = B.useRef(null),
    y = () => m.current ?? d.current,
    p = Hy(s.path);
  return (
    B.useImperativeHandle(
      f,
      () => ({
        play: () => {
          var S;
          return void ((S = y()) == null ? void 0 : S.play());
        },
        pause: () => {
          var S;
          return (S = y()) == null ? void 0 : S.pause();
        },
        toggle: () => {
          const S = y();
          S && (S.paused ? S.play() : S.pause());
        },
        seek: (S) => {
          const g = y();
          g && (g.currentTime = S);
        },
        isPlaying: () => {
          const S = y();
          return !!S && !S.paused;
        },
      }),
      [],
    ),
    B.useEffect(() => {
      const S = y();
      if (!S || !o) return;
      const g = () => o(S.currentTime);
      return (S.addEventListener('timeupdate', g), () => S.removeEventListener('timeupdate', g));
    }, [o, s.path]),
    s.hasVideo
      ? M.jsx('video', {
          ref: m,
          src: p,
          controls: !0,
          className: 'aspect-video w-full max-h-[50vh] rounded bg-black',
          preload: 'metadata',
        })
      : M.jsx('audio', { ref: d, src: p, controls: !0, className: 'w-full', preload: 'metadata' })
  );
});
var zm;
(function (i) {
  ((i.WINDOW_RESIZED = 'tauri://resize'),
    (i.WINDOW_MOVED = 'tauri://move'),
    (i.WINDOW_CLOSE_REQUESTED = 'tauri://close-requested'),
    (i.WINDOW_DESTROYED = 'tauri://destroyed'),
    (i.WINDOW_FOCUS = 'tauri://focus'),
    (i.WINDOW_BLUR = 'tauri://blur'),
    (i.WINDOW_SCALE_FACTOR_CHANGED = 'tauri://scale-change'),
    (i.WINDOW_THEME_CHANGED = 'tauri://theme-changed'),
    (i.WINDOW_CREATED = 'tauri://window-created'),
    (i.WINDOW_SUSPENDED = 'tauri://suspended'),
    (i.WINDOW_RESUMED = 'tauri://resumed'),
    (i.WEBVIEW_CREATED = 'tauri://webview-created'),
    (i.DRAG_ENTER = 'tauri://drag-enter'),
    (i.DRAG_OVER = 'tauri://drag-over'),
    (i.DRAG_DROP = 'tauri://drag-drop'),
    (i.DRAG_LEAVE = 'tauri://drag-leave'));
})(zm || (zm = {}));
async function zg(i, s) {
  (window.__TAURI_EVENT_PLUGIN_INTERNALS__.unregisterListener(i, s),
    await we('plugin:event|unlisten', { event: i, eventId: s }));
}
async function Eg(i, s, o) {
  var f;
  const m = (f = void 0) !== null && f !== void 0 ? f : { kind: 'Any' };
  return we('plugin:event|listen', { event: i, target: m, handler: Uy(s) }).then(
    (d) => async () => zg(i, d),
  );
}
function Il(i, s) {
  const o = Math.round(i * s),
    f = Math.round(s),
    m = o % f,
    d = Math.floor(o / f),
    y = d % 60,
    p = Math.floor(d / 60) % 60,
    S = Math.floor(d / 3600);
  return `${ii(S)}:${ii(p)}:${ii(y)}:${ii(m)}`;
}
function ii(i) {
  return i.toString().padStart(2, '0');
}
function wa(i) {
  return i
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
function Ag(i) {
  var y;
  const s = La(i.regions),
    o = ((y = i.source.videoStream) == null ? void 0 : y.frameRate) ?? 30,
    f = Tg(i.source.name),
    m = [];
  (m.push(`TITLE: ${i.projectName}`), m.push('FCM: NON-DROP FRAME'), m.push(''));
  let d = 0;
  return (
    s.forEach((p, S) => {
      const g = String(S + 1).padStart(3, '0'),
        x = Il(p.start, o),
        E = Il(p.end, o),
        H = Il(d, o),
        Z = p.end - p.start,
        $ = Il(d + Z, o);
      d += Z;
      const L = i.source.hasVideo ? 'AA/V' : 'AA';
      (m.push(`${g}  ${f} ${L}    C        ${x} ${E} ${H} ${$}`),
        m.push(`* FROM CLIP NAME: ${i.source.name}`));
    }),
    m.join(`
`) +
      `
`
  );
}
function Tg(i) {
  return i
    .replace(/[^A-Za-z0-9]/g, '')
    .slice(0, 8)
    .toUpperCase()
    .padEnd(8, ' ');
}
function _g(i) {
  var x, E, H;
  const s = La(i.regions),
    o = ((x = i.source.videoStream) == null ? void 0 : x.frameRate) ?? 30,
    f = ((E = i.source.videoStream) == null ? void 0 : E.width) ?? 1920,
    m = ((H = i.source.videoStream) == null ? void 0 : H.height) ?? 1080,
    d = Mg(o),
    y = 'r1',
    p = 'r2';
  let S = '',
    g = 0;
  return (
    s.forEach((Z, $) => {
      const L = ci(g, o),
        q = ci(Z.start, o),
        Y = ci(Z.end - Z.start, o);
      ((g += Z.end - Z.start),
        (S += `          <asset-clip name="${wa(i.source.name)} #${$ + 1}" ref="${y}" offset="${L}" start="${q}" duration="${Y}" tcFormat="NDF"/>
`));
    }),
    `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE fcpxml>
<fcpxml version="1.10">
  <resources>
    <format id="${p}" name="FFVideoFormat${f}x${m}p${o}" frameDuration="${d}" width="${f}" height="${m}"/>
    <asset id="${y}" name="${wa(i.source.name)}" src="${wa(Og(i.source.path))}" start="0s" duration="${ci(i.source.duration, o)}" hasVideo="${i.source.hasVideo ? '1' : '0'}" hasAudio="${i.source.hasAudio ? '1' : '0'}" format="${p}"/>
  </resources>
  <library>
    <event name="${wa(i.projectName)}">
      <project name="${wa(i.projectName)}">
        <sequence format="${p}" tcStart="0s" tcFormat="NDF">
          <spine>
${S}          </spine>
        </sequence>
      </project>
    </event>
  </library>
</fcpxml>
`
  );
}
function Mg(i) {
  return Math.abs(i - 23.976) < 0.01
    ? '1001/24000s'
    : Math.abs(i - 29.97) < 0.01
      ? '1001/30000s'
      : Math.abs(i - 59.94) < 0.01
        ? '1001/60000s'
        : `1/${Math.round(i)}s`;
}
function ci(i, s) {
  const o = Math.round(i * s),
    f = Math.round(s);
  return `${o}/${f}s`;
}
function Og(i) {
  return i.startsWith('file://')
    ? i
    : /^[A-Za-z]:[\\/]/.test(i)
      ? 'file:///' + i.replace(/\\/g, '/')
      : 'file://' + i;
}
function Rg(i) {
  var y;
  const s = ((y = i.source.videoStream) == null ? void 0 : y.frameRate) ?? 30,
    f = La(i.regions).map((p, S) => ({
      OTIO_SCHEMA: 'Clip.2',
      name: `${i.source.name} #${S + 1}`,
      source_range: Em(p.start, p.end - p.start, s),
      media_reference: {
        OTIO_SCHEMA: 'ExternalReference.1',
        target_url: Ng(i.source.path),
        available_range: Em(0, i.source.duration, s),
      },
    })),
    m = [{ OTIO_SCHEMA: 'Track.1', name: 'V1', kind: 'Video', children: f }];
  i.source.hasAudio &&
    m.push({
      OTIO_SCHEMA: 'Track.1',
      name: 'A1',
      kind: 'Audio',
      children: f.map((p) => ({ ...p })),
    });
  const d = {
    OTIO_SCHEMA: 'Timeline.1',
    name: i.projectName,
    global_start_time: Zf(0, s),
    tracks: { OTIO_SCHEMA: 'Stack.1', name: 'tracks', children: m },
  };
  return JSON.stringify(d, null, 2);
}
function Zf(i, s) {
  return { OTIO_SCHEMA: 'RationalTime.1', rate: s, value: i * s };
}
function Em(i, s, o) {
  return { OTIO_SCHEMA: 'TimeRange.1', start_time: Zf(i, o), duration: Zf(s, o) };
}
function Ng(i) {
  return i.startsWith('file://')
    ? i
    : /^[A-Za-z]:[\\/]/.test(i)
      ? 'file:///' + i.replace(/\\/g, '/')
      : 'file://' + i;
}
function Cg(i) {
  var m;
  const s = ((m = i.source.videoStream) == null ? void 0 : m.frameRate) ?? 30,
    f = [['#', 'Marker Name', 'Description', 'In', 'Out', 'Duration', 'Marker Type']];
  return (
    i.regions
      .filter((d) => !d.kept)
      .forEach((d, y) => {
        f.push([
          String(y + 1),
          `Silence ${y + 1}`,
          '',
          Il(d.start, s),
          Il(d.end, s),
          Il(d.end - d.start, s),
          'Red',
        ]);
      }),
    f.map((d) => d.join('	')).join(`
`) +
      `
`
  );
}
function Dg(i, s) {
  const o = La(i.regions),
    f = i.source.hasVideo,
    m = i.source.hasAudio;
  if (o.length === 0) throw new Error('export: no kept regions');
  if (!f && !m) throw new Error('export: source has neither audio nor video');
  const d = [],
    y = [];
  o.forEach((E, H) => {
    const Z = E.start.toFixed(6),
      $ = E.end.toFixed(6);
    (f && d.push(`[0:v]trim=start=${Z}:end=${$},setpts=PTS-STARTPTS[v${H}]`),
      m && d.push(`[0:a]atrim=start=${Z}:end=${$},asetpts=PTS-STARTPTS[a${H}]`),
      f && y.push(`[v${H}]`),
      m && y.push(`[a${H}]`));
  });
  const p = f ? 1 : 0,
    S = m ? 1 : 0;
  d.push(`${y.join('')}concat=n=${o.length}:v=${p}:a=${S}${f ? '[v]' : ''}${m ? '[a]' : ''}`);
  const g = ['-y', '-nostdin', '-hide_banner', '-i', i.source.path, '-filter_complex', d.join(';')];
  (f && g.push('-map', '[v]', '-c:v', s.videoCodec ?? 'libx264'),
    m && g.push('-map', '[a]', '-c:a', s.audioCodec ?? 'aac'),
    s.extraArgs && g.push(...s.extraArgs),
    g.push(s.outputPath));
  const x = o.reduce((E, H) => E + (H.end - H.start), 0);
  return { args: g, outputDurationS: x, segmentCount: o.length };
}
const Bf = {
  fcpxml: { label: 'Final Cut Pro XML', ext: 'fcpxml', mime: 'application/xml', build: _g },
  otio: { label: 'OpenTimelineIO', ext: 'otio', mime: 'application/json', build: Rg },
  edl: { label: 'CMX 3600 EDL', ext: 'edl', mime: 'text/plain', build: Ag },
  resolve: {
    label: 'DaVinci Resolve markers (TSV)',
    ext: 'txt',
    mime: 'text/tab-separated-values',
    build: Cg,
  },
};
let jg = 0;
function Ug({ source: i, regions: s, projectName: o }) {
  const [f, m] = B.useState(!1),
    [d, y] = B.useState(null),
    [p, S] = B.useState(null),
    [g, x] = B.useState(null),
    [E, H] = B.useState('none');
  B.useEffect(() => {
    const q = Eg('export-progress', (Y) => {
      y({ percent: Y.payload.percent, outTimeMs: Y.payload.outTimeMs, speed: Y.payload.speed });
    });
    return () => {
      q.then((Y) => Y());
    };
  }, []);
  const Z = async () => {
      (x(null), S(null));
      const q = i.name.replace(/\.[^./]+$/, '') + '.cut.mp4',
        Y = await Yf({ defaultPath: q, filters: [{ name: 'MP4', extensions: ['mp4'] }] });
      if (Y) {
        (m(!0), y({ percent: 0, outTimeMs: 0, speed: null }));
        try {
          const V = hm.find((J) => J.id === E),
            G = ['-preset', 'veryfast', '-crf', '20'];
          V && G.push('-af', cg(V));
          const X = Dg({ source: i, regions: s, projectName: o }, { outputPath: Y, extraArgs: G }),
            at = `export-${++jg}`,
            F = await bg({ args: X.args, expectedDurationS: X.outputDurationS, jobId: at });
          S(`Wrote ${Y} (${X.segmentCount} segments, ${X.outputDurationS.toFixed(2)}s)`);
        } catch (V) {
          x(V instanceof Error ? V.message : String(V));
        } finally {
          m(!1);
        }
      }
    },
    $ = async (q) => {
      (x(null), S(null));
      const Y = Bf[q],
        V = i.name.replace(/\.[^./]+$/, '') + '.' + Y.ext,
        G = await Yf({ defaultPath: V, filters: [{ name: Y.label, extensions: [Y.ext] }] });
      if (G)
        try {
          const X = Y.build({ source: i, regions: s, projectName: o });
          (await Vf(G, X), S(`Wrote ${Y.label} → ${G}`));
        } catch (X) {
          x(X instanceof Error ? X.message : String(X));
        }
    },
    L = s.filter((q) => q.kept).length;
  return M.jsxs('div', {
    className: 'rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-3',
    children: [
      M.jsxs('div', {
        className: 'flex items-center justify-between',
        children: [
          M.jsxs('div', {
            children: [
              M.jsx('h3', {
                className: 'text-sm font-semibold uppercase tracking-wider text-zinc-400',
                children: 'Export',
              }),
              M.jsxs('p', {
                className: 'text-xs text-zinc-500',
                children: [L, ' kept · ', s.filter((q) => !q.kept).length, ' cuts'],
              }),
            ],
          }),
          M.jsx(Ne, {
            onClick: Z,
            disabled: f || L === 0,
            children: f
              ? `Exporting… ${(d == null ? void 0 : d.percent.toFixed(0)) ?? 0}%`
              : 'Export single MP4',
          }),
        ],
      }),
      M.jsxs('div', {
        className: 'flex items-center gap-2 text-xs text-zinc-400',
        children: [
          M.jsx('label', { htmlFor: 'loudness-select', children: 'Loudness:' }),
          M.jsxs('select', {
            id: 'loudness-select',
            value: E,
            onChange: (q) => H(q.target.value),
            disabled: f,
            className: 'rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-200',
            children: [
              M.jsx('option', { value: 'none', children: 'None (skip normalization)' }),
              hm.map((q) => M.jsx('option', { value: q.id, children: q.label }, q.id)),
            ],
          }),
        ],
      }),
      d &&
        f &&
        M.jsxs('div', {
          className: 'space-y-1',
          children: [
            M.jsx('div', {
              className: 'h-1.5 w-full overflow-hidden rounded-full bg-zinc-800',
              children: M.jsx('div', {
                className: 'h-full bg-indigo-500 transition-all',
                style: { width: `${d.percent}%` },
              }),
            }),
            M.jsxs('p', {
              className: 'text-xs text-zinc-500',
              children: [
                (d.outTimeMs / 1e3).toFixed(1),
                's rendered',
                d.speed ? ` · ${d.speed.toFixed(2)}× speed` : '',
              ],
            }),
          ],
        }),
      M.jsxs('div', {
        className: 'border-t border-zinc-800 pt-3',
        children: [
          M.jsx('p', {
            className: 'mb-2 text-xs text-zinc-500',
            children: 'Hand off to an NLE — no re-encode needed.',
          }),
          M.jsx('div', {
            className: 'flex flex-wrap gap-2',
            children: Object.keys(Bf).map((q) =>
              M.jsx(
                Ne,
                {
                  variant: 'secondary',
                  size: 'sm',
                  onClick: () => $(q),
                  disabled: f || L === 0,
                  children: Bf[q].label,
                },
                q,
              ),
            ),
          }),
        ],
      }),
      p && M.jsx('p', { className: 'text-xs text-emerald-400', children: p }),
      g && M.jsx('p', { className: 'text-xs text-rose-400', children: g }),
    ],
  });
}
function Hg(i) {
  B.useEffect(() => {
    const s = (o) => {
      var y, p, S, g, x, E, H;
      const f = o.target;
      if (f && /^(INPUT|TEXTAREA|SELECT)$/.test(f.tagName)) return;
      const d = navigator.platform.toLowerCase().includes('mac') ? o.metaKey : o.ctrlKey;
      if (o.code === 'Space') {
        (o.preventDefault(), (y = i.togglePlay) == null || y.call(i, o));
        return;
      }
      if (o.code === 'KeyL') {
        (o.preventDefault(), (p = i.nextKept) == null || p.call(i, o));
        return;
      }
      if (o.code === 'KeyJ') {
        (o.preventDefault(), (S = i.prevKept) == null || S.call(i, o));
        return;
      }
      if (o.code === 'KeyK') {
        (o.preventDefault(), (g = i.split) == null || g.call(i, o));
        return;
      }
      if (o.code === 'KeyD') {
        (o.preventDefault(), (x = i.toggleRegion) == null || x.call(i, o));
        return;
      }
      if (d && o.code === 'KeyZ' && !o.shiftKey) {
        (o.preventDefault(), (E = i.undo) == null || E.call(i, o));
        return;
      }
      if (d && (o.code === 'KeyY' || (o.code === 'KeyZ' && o.shiftKey))) {
        (o.preventDefault(), (H = i.redo) == null || H.call(i, o));
        return;
      }
    };
    return (window.addEventListener('keydown', s), () => window.removeEventListener('keydown', s));
  }, [i]);
}
let Bg = 0;
const qg = () => `m${Date.now().toString(36)}-${Bg++}`;
function Yg() {
  const i = Ue((R) => R.sources),
    s = Ue((R) => R.currentSourceId),
    o = Ue((R) => R.regionsBySource),
    f = Ue((R) => R.peaksBySource),
    m = Ue((R) => R.currentTime),
    d = Ue((R) => R.past),
    y = Ue((R) => R.future),
    p = Ue((R) => R.detectionSettings),
    S = Ue((R) => R.projectName),
    g = Ue((R) => R.projectPath),
    x = Ue,
    E = B.useMemo(() => i.find((R) => R.id === s) ?? null, [i, s]),
    H = B.useMemo(() => (s ? (o[s] ?? []) : []), [o, s]),
    Z = B.useMemo(() => (s ? (f[s] ?? null) : null), [f, s]),
    [$, L] = B.useState(!1),
    [q, Y] = B.useState(null),
    [V, G] = B.useState(null),
    X = B.useRef(null),
    at = B.useCallback(
      async (R, et) => {
        const I = await gg(R);
        x.getState().addSource(I);
        const [v, j] = await Promise.all([xm(I.path, et), pg(I.path, 2048).catch(() => null)]);
        return (
          x.getState().setRegionsFor(I.id, dm(I.duration, v, et)),
          j && x.getState().setPeaksFor(I.id, j),
          I
        );
      },
      [x],
    ),
    F = async () => {
      G(null);
      try {
        const R = await vg();
        if (R.length === 0) return;
        (L(!0), Y({ index: 0, total: R.length }));
        const et = x.getState().detectionSettings;
        for (let I = 0; I < R.length; I++) (Y({ index: I, total: R.length }), await at(R[I], et));
        x.getState().resetHistory();
      } catch (R) {
        G(R instanceof Error ? R.message : String(R));
      } finally {
        (Y(null), L(!1));
      }
    },
    J = B.useCallback(async () => {
      (L(!0), G(null));
      try {
        const R = x.getState().sources,
          et = x.getState().detectionSettings;
        for (let I = 0; I < R.length; I++) {
          Y({ index: I, total: R.length });
          const v = R[I],
            j = await xm(v.path, et);
          x.getState().setRegionsFor(v.id, dm(v.duration, j, et));
        }
        x.getState().resetHistory();
      } catch (R) {
        G(R instanceof Error ? R.message : String(R));
      } finally {
        (Y(null), L(!1));
      }
    }, [x]),
    zt = async () => {
      const R = await Yf({
        defaultPath: `${S}${fg}`,
        filters: [{ name: 'Quietcut project', extensions: ['quietcut'] }],
      });
      R && (await Vf(R, vm(x.getState().toProjectFile())), x.getState().setProjectPath(R));
    },
    Mt = async () => {
      if (!g) return zt();
      await Vf(g, vm(x.getState().toProjectFile()));
    },
    Ot = async () => {
      const R = await Tm({
          multiple: !1,
          filters: [{ name: 'Quietcut project', extensions: ['quietcut'] }],
        }),
        et = Array.isArray(R) ? R[0] : R;
      if (et)
        try {
          const I = await Sg(et),
            v = og(I);
          x.getState().loadProject(v, et);
        } catch (I) {
          G(`Failed to load project: ${I instanceof Error ? I.message : String(I)}`);
        }
    },
    yt = () => x.getState().resetProject(),
    tt = B.useCallback(
      (R) => {
        var et;
        (x.getState().setCurrentTime(R), (et = X.current) == null || et.seek(R));
      },
      [x],
    ),
    Qt = B.useCallback(
      (R, et, I) => {
        x.getState().setRegions(eg(H, R, et, I), { history: !1 });
      },
      [H, x],
    ),
    Vt = B.useCallback(() => {
      x.getState().setRegions([...H]);
    }, [H, x]),
    Yt = B.useCallback((R) => x.getState().setRegions(mm(H, R)), [H, x]),
    N = B.useCallback((R) => x.getState().setDetectionSettings(R), [x]),
    w = B.useMemo(
      () => ({
        togglePlay: () => {
          var R;
          return (R = X.current) == null ? void 0 : R.toggle();
        },
        nextKept: () => {
          const R = ug(H, m);
          R != null && tt(R);
        },
        prevKept: () => {
          const R = ig(H, m);
          R != null && tt(R);
        },
        split: () => x.getState().setRegions(lg(H, m, qg)),
        toggleRegion: () => {
          const R = ag(H, m);
          R && x.getState().setRegions(mm(H, R.id));
        },
        undo: () => x.getState().undo(),
        redo: () => x.getState().redo(),
      }),
      [H, m, tt, x],
    );
  return (
    Hg(w),
    M.jsxs('div', {
      className: 'flex h-full flex-col bg-zinc-950 text-zinc-100',
      children: [
        M.jsx(wg, {
          canUndo: d.length > 0,
          canRedo: y.length > 0,
          onUndo: () => x.getState().undo(),
          onRedo: () => x.getState().redo(),
          onNewProject: yt,
          onLoadProject: Ot,
          onSaveProject: Mt,
          onSaveProjectAs: zt,
          projectName: S,
          projectDirty: !1,
        }),
        M.jsxs('main', {
          className: 'flex flex-1 min-h-0',
          children: [
            M.jsx(Vg, {
              sources: i,
              currentSourceId: s,
              settings: p,
              batchProgress: q,
              onSelectSource: (R) => x.getState().selectSource(R),
              onRemoveSource: (R) => x.getState().removeSource(R),
              onSettingsChange: N,
              onReanalyzeAll: J,
              onAddFiles: F,
              disabled: $,
            }),
            M.jsxs('section', {
              className: 'flex flex-1 min-w-0 flex-col p-6 overflow-auto',
              children: [
                E
                  ? M.jsx(Xg, {
                      source: E,
                      regions: H,
                      peaks: Z,
                      currentTime: m,
                      busy: $,
                      projectName: S,
                      playerRef: X,
                      onTimeUpdate: (R) => x.getState().setCurrentTime(R),
                      onSeek: tt,
                      onBoundaryDrag: Qt,
                      onBoundaryRelease: Vt,
                      onRegionToggle: Yt,
                      onMerge: (R) => x.getState().setRegions(ng(H, R)),
                    })
                  : M.jsx(Lg, { onOpen: F, onLoad: Ot, busy: $ }),
                V &&
                  M.jsx('p', {
                    role: 'alert',
                    className: 'mt-4 rounded-md bg-rose-950 px-4 py-2 text-rose-200',
                    children: V,
                  }),
              ],
            }),
          ],
        }),
        M.jsx(Gg, {
          regions: H,
          duration: (E == null ? void 0 : E.duration) ?? 0,
          sourceCount: i.length,
        }),
      ],
    })
  );
}
function wg({
  canUndo: i,
  canRedo: s,
  onUndo: o,
  onRedo: f,
  onNewProject: m,
  onLoadProject: d,
  onSaveProject: y,
  onSaveProjectAs: p,
  projectName: S,
  projectDirty: g,
}) {
  return M.jsxs('header', {
    className: 'flex items-center justify-between border-b border-zinc-800 px-6 py-3',
    children: [
      M.jsxs('div', {
        className: 'flex items-center gap-3',
        children: [
          M.jsx('h1', { className: 'text-lg font-semibold tracking-tight', children: 'Quietcut' }),
          M.jsxs('span', { className: 'text-xs text-zinc-500', children: [S, g ? ' •' : ''] }),
        ],
      }),
      M.jsxs('div', {
        className: 'flex items-center gap-1',
        children: [
          M.jsx(Ne, { variant: 'ghost', size: 'sm', onClick: m, children: 'New' }),
          M.jsx(Ne, { variant: 'ghost', size: 'sm', onClick: d, children: 'Open' }),
          M.jsx(Ne, { variant: 'ghost', size: 'sm', onClick: y, children: 'Save' }),
          M.jsx(Ne, { variant: 'ghost', size: 'sm', onClick: p, children: 'Save as…' }),
          M.jsx('div', { className: 'mx-2 h-5 w-px bg-zinc-800' }),
          M.jsx(Ne, { variant: 'ghost', size: 'sm', onClick: o, disabled: !i, children: 'Undo' }),
          M.jsx(Ne, { variant: 'ghost', size: 'sm', onClick: f, disabled: !s, children: 'Redo' }),
          M.jsx('span', {
            className: 'ml-3 text-xs text-zinc-500',
            children: 'v0.1.0 — Phase 7 advanced',
          }),
        ],
      }),
    ],
  });
}
function Gg({ regions: i, duration: s, sourceCount: o }) {
  const f = Fm(i),
    m = i.filter((d) => !d.kept).length;
  return M.jsxs('footer', {
    className: 'border-t border-zinc-800 px-6 py-2 text-xs text-zinc-500 flex gap-6',
    children: [
      M.jsxs('span', { children: [o, ' source', o === 1 ? '' : 's'] }),
      M.jsxs('span', { children: ['Source: ', s.toFixed(2), 's'] }),
      M.jsxs('span', { children: ['Output: ', f.toFixed(2), 's'] }),
      M.jsxs('span', { children: ['Removed: ', (s - f).toFixed(2), 's'] }),
      M.jsxs('span', { children: [m, ' cuts'] }),
      M.jsx('span', {
        className: 'ml-auto',
        children: 'Space play · J/L skip · K split · D toggle · ⌘Z undo',
      }),
    ],
  });
}
function Lg({ onOpen: i, onLoad: s, busy: o }) {
  return M.jsxs('div', {
    className: 'm-auto flex flex-col items-center gap-4 text-center',
    children: [
      M.jsx('h2', { className: 'text-2xl font-medium', children: 'Open files or a project' }),
      M.jsx('p', {
        className: 'max-w-md text-zinc-400',
        children:
          'Quietcut detects silences automatically and lets you export the trimmed result or send it to your favorite editor.',
      }),
      M.jsxs('div', {
        className: 'flex gap-2',
        children: [
          M.jsx(Ne, {
            size: 'lg',
            onClick: i,
            disabled: o,
            children: o ? 'Loading…' : 'Choose file(s)',
          }),
          M.jsx(Ne, {
            size: 'lg',
            variant: 'secondary',
            onClick: s,
            disabled: o,
            children: 'Open project…',
          }),
        ],
      }),
    ],
  });
}
function Xg({
  source: i,
  regions: s,
  peaks: o,
  currentTime: f,
  busy: m,
  projectName: d,
  playerRef: y,
  onTimeUpdate: p,
  onSeek: S,
  onBoundaryDrag: g,
  onBoundaryRelease: x,
  onRegionToggle: E,
  onMerge: H,
}) {
  const Z = i.duration - Fm(s);
  return M.jsxs('div', {
    className: 'flex flex-col gap-4 min-h-0',
    children: [
      M.jsx('div', {
        className: 'flex items-baseline justify-between',
        children: M.jsxs('div', {
          children: [
            M.jsx('h2', { className: 'text-lg font-medium', children: i.name }),
            M.jsxs('p', {
              className: 'text-sm text-zinc-400',
              children: [
                i.duration.toFixed(1),
                's · ',
                s.filter(($) => !$.kept).length,
                ' silences · save',
                ' ',
                Z.toFixed(1),
                's',
              ],
            }),
          ],
        }),
      }),
      M.jsx(xg, { ref: y, source: i, onTimeUpdate: p }),
      M.jsx('div', {
        className: 'rounded-lg border border-zinc-800 bg-zinc-900 p-2',
        onMouseUp: x,
        children: M.jsx(Pv, {
          peaks: o,
          regions: s,
          duration: i.duration,
          currentTime: f,
          onSeek: S,
          onBoundaryDrag: g,
          onRegionClick: E,
        }),
      }),
      M.jsx(Ug, { source: i, regions: s, projectName: d }),
      M.jsx(Qg, { regions: s, currentTime: f, onSeek: S, onToggle: E, onMerge: H }),
      m && M.jsx('p', { className: 'text-sm text-zinc-400', children: 'Analyzing…' }),
    ],
  });
}
function Qg({ regions: i, currentTime: s, onSeek: o, onToggle: f, onMerge: m }) {
  return M.jsx('div', {
    className: 'overflow-auto max-h-64 rounded-lg border border-zinc-800',
    children: M.jsxs('table', {
      className: 'w-full text-sm',
      children: [
        M.jsx('thead', {
          className: 'sticky top-0 bg-zinc-900 text-left text-xs uppercase text-zinc-500',
          children: M.jsxs('tr', {
            children: [
              M.jsx('th', { className: 'px-3 py-2', children: '#' }),
              M.jsx('th', { className: 'px-3 py-2', children: 'Start' }),
              M.jsx('th', { className: 'px-3 py-2', children: 'End' }),
              M.jsx('th', { className: 'px-3 py-2', children: 'Length' }),
              M.jsx('th', { className: 'px-3 py-2', children: 'Kept' }),
              M.jsx('th', { className: 'px-3 py-2', children: 'Source' }),
              M.jsx('th', { className: 'px-3 py-2' }),
            ],
          }),
        }),
        M.jsx('tbody', {
          children: i.map((d, y) => {
            const p = s >= d.start && s <= d.end;
            return M.jsxs(
              'tr',
              {
                className: `border-t border-zinc-800 ${p ? 'bg-zinc-800/60' : ''}`,
                children: [
                  M.jsx('td', { className: 'px-3 py-1.5 text-zinc-500', children: y + 1 }),
                  M.jsx('td', {
                    className: 'px-3 py-1.5',
                    children: M.jsx('button', {
                      className: 'hover:text-indigo-300',
                      onClick: () => o(d.start),
                      children: d.start.toFixed(2),
                    }),
                  }),
                  M.jsx('td', { className: 'px-3 py-1.5', children: d.end.toFixed(2) }),
                  M.jsxs('td', {
                    className: 'px-3 py-1.5 text-zinc-400',
                    children: [(d.end - d.start).toFixed(2), 's'],
                  }),
                  M.jsx('td', {
                    className: 'px-3 py-1.5',
                    children: M.jsx('input', {
                      type: 'checkbox',
                      checked: d.kept,
                      onChange: () => f(d.id),
                      'aria-label': `Keep region ${y + 1}`,
                    }),
                  }),
                  M.jsx('td', { className: 'px-3 py-1.5 text-zinc-500', children: d.source }),
                  M.jsx('td', {
                    className: 'px-3 py-1.5 text-right',
                    children:
                      y < i.length - 1 &&
                      M.jsx('button', {
                        className: 'text-xs text-zinc-400 hover:text-zinc-200',
                        onClick: () => m(d.id),
                        title: 'Merge with next region',
                        children: 'merge →',
                      }),
                  }),
                ],
              },
              d.id,
            );
          }),
        }),
      ],
    }),
  });
}
function Vg({
  sources: i,
  currentSourceId: s,
  settings: o,
  batchProgress: f,
  onSelectSource: m,
  onRemoveSource: d,
  onSettingsChange: y,
  onReanalyzeAll: p,
  onAddFiles: S,
  disabled: g,
}) {
  return M.jsxs('aside', {
    className: 'flex w-72 shrink-0 flex-col border-r border-zinc-800 overflow-auto',
    children: [
      M.jsxs('div', {
        className: 'border-b border-zinc-800 p-4',
        children: [
          M.jsxs('div', {
            className: 'mb-3 flex items-center justify-between',
            children: [
              M.jsx('h3', {
                className: 'text-sm font-semibold uppercase tracking-wider text-zinc-400',
                children: 'Sources',
              }),
              M.jsx(Ne, {
                size: 'sm',
                variant: 'ghost',
                onClick: S,
                disabled: g,
                children: '+ Add',
              }),
            ],
          }),
          i.length === 0
            ? M.jsx('p', { className: 'text-xs text-zinc-500', children: 'No sources yet.' })
            : M.jsx('ul', {
                className: 'space-y-1',
                children: i.map((x) => {
                  const E = x.id === s;
                  return M.jsxs(
                    'li',
                    {
                      className: `group flex items-center justify-between rounded px-2 py-1 text-sm ${E ? 'bg-indigo-600/20 text-indigo-200' : 'hover:bg-zinc-800/60'}`,
                      children: [
                        M.jsx('button', {
                          className: 'truncate text-left flex-1 min-w-0',
                          onClick: () => m(x.id),
                          title: x.path,
                          children: x.name,
                        }),
                        M.jsx('button', {
                          className:
                            'ml-2 opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-rose-400',
                          onClick: () => d(x.id),
                          'aria-label': `Remove ${x.name}`,
                          children: '×',
                        }),
                      ],
                    },
                    x.id,
                  );
                }),
              }),
          f &&
            M.jsxs('p', {
              className: 'mt-2 text-xs text-zinc-400',
              children: ['Analyzing ', f.index + 1, '/', f.total, '…'],
            }),
        ],
      }),
      M.jsxs('div', {
        className: 'p-4',
        children: [
          M.jsx('h3', {
            className: 'mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400',
            children: 'Detection',
          }),
          M.jsxs('div', {
            className: 'space-y-5',
            children: [
              M.jsx(qf, {
                label: `Threshold: ${o.thresholdDb} dB`,
                children: M.jsx(Hf, {
                  ariaLabel: 'Silence threshold in decibels',
                  value: o.thresholdDb,
                  onValueChange: (x) => y({ ...o, thresholdDb: x }),
                  min: -60,
                  max: -10,
                  step: 1,
                }),
              }),
              M.jsx(qf, {
                label: `Min silence: ${o.minSilenceDurationMs} ms`,
                children: M.jsx(Hf, {
                  ariaLabel: 'Minimum silence duration',
                  value: o.minSilenceDurationMs,
                  onValueChange: (x) => y({ ...o, minSilenceDurationMs: x }),
                  min: 100,
                  max: 3e3,
                  step: 50,
                }),
              }),
              M.jsx(qf, {
                label: `Padding: ${o.paddingMs} ms`,
                children: M.jsx(Hf, {
                  ariaLabel: 'Padding around speech',
                  value: o.paddingMs,
                  onValueChange: (x) => y({ ...o, paddingMs: x }),
                  min: 0,
                  max: 500,
                  step: 10,
                }),
              }),
            ],
          }),
          M.jsx(Ne, {
            className: 'mt-6 w-full',
            onClick: p,
            disabled: g || i.length === 0,
            children: 'Re-analyze all',
          }),
        ],
      }),
    ],
  });
}
function qf({ label: i, children: s }) {
  return M.jsxs('label', {
    className: 'block',
    children: [M.jsx('span', { className: 'mb-2 block text-sm text-zinc-300', children: i }), s],
  });
}
const Im = document.getElementById('root');
if (!Im) throw new Error('Root element not found');
jy.createRoot(Im).render(M.jsx(B.StrictMode, { children: M.jsx(Yg, {}) }));
