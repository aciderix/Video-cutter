function bv(i, o) {
  for (var s = 0; s < o.length; s++) {
    const f = o[s];
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
  const o = document.createElement('link').relList;
  if (o && o.supports && o.supports('modulepreload')) return;
  for (const m of document.querySelectorAll('link[rel="modulepreload"]')) f(m);
  new MutationObserver((m) => {
    for (const d of m)
      if (d.type === 'childList')
        for (const b of d.addedNodes) b.tagName === 'LINK' && b.rel === 'modulepreload' && f(b);
  }).observe(document, { childList: !0, subtree: !0 });
  function s(m) {
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
    const d = s(m);
    fetch(m.href, d);
  }
})();
function pv(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, 'default') ? i.default : i;
}
var Of = { exports: {} },
  Na = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Id;
function Sv() {
  if (Id) return Na;
  Id = 1;
  var i = Symbol.for('react.transitional.element'),
    o = Symbol.for('react.fragment');
  function s(f, m, d) {
    var b = null;
    if ((d !== void 0 && (b = '' + d), m.key !== void 0 && (b = '' + m.key), 'key' in m)) {
      d = {};
      for (var h in m) h !== 'key' && (d[h] = m[h]);
    } else d = m;
    return ((m = d.ref), { $$typeof: i, type: f, key: b, ref: m !== void 0 ? m : null, props: d });
  }
  return ((Na.Fragment = o), (Na.jsx = s), (Na.jsxs = s), Na);
}
var tm;
function Ev() {
  return (tm || ((tm = 1), (Of.exports = Sv())), Of.exports);
}
var Q = Ev(),
  Cf = { exports: {} },
  it = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var em;
function zv() {
  if (em) return it;
  em = 1;
  var i = Symbol.for('react.transitional.element'),
    o = Symbol.for('react.portal'),
    s = Symbol.for('react.fragment'),
    f = Symbol.for('react.strict_mode'),
    m = Symbol.for('react.profiler'),
    d = Symbol.for('react.consumer'),
    b = Symbol.for('react.context'),
    h = Symbol.for('react.forward_ref'),
    S = Symbol.for('react.suspense'),
    y = Symbol.for('react.memo'),
    O = Symbol.for('react.lazy'),
    z = Symbol.for('react.activity'),
    N = Symbol.iterator;
  function G(g) {
    return g === null || typeof g != 'object'
      ? null
      : ((g = (N && g[N]) || g['@@iterator']), typeof g == 'function' ? g : null);
  }
  var k = {
      isMounted: function () {
        return !1;
      },
      enqueueForceUpdate: function () {},
      enqueueReplaceState: function () {},
      enqueueSetState: function () {},
    },
    Y = Object.assign,
    X = {};
  function L(g, D, B) {
    ((this.props = g), (this.context = D), (this.refs = X), (this.updater = B || k));
  }
  ((L.prototype.isReactComponent = {}),
    (L.prototype.setState = function (g, D) {
      if (typeof g != 'object' && typeof g != 'function' && g != null)
        throw Error(
          'takes an object of state variables to update or a function which returns an object of state variables.',
        );
      this.updater.enqueueSetState(this, g, D, 'setState');
    }),
    (L.prototype.forceUpdate = function (g) {
      this.updater.enqueueForceUpdate(this, g, 'forceUpdate');
    }));
  function J() {}
  J.prototype = L.prototype;
  function V(g, D, B) {
    ((this.props = g), (this.context = D), (this.refs = X), (this.updater = B || k));
  }
  var K = (V.prototype = new J());
  ((K.constructor = V), Y(K, L.prototype), (K.isPureReactComponent = !0));
  var ct = Array.isArray;
  function P() {}
  var w = { H: null, A: null, T: null, S: null },
    nt = Object.prototype.hasOwnProperty;
  function St(g, D, B) {
    var Z = B.ref;
    return { $$typeof: i, type: g, key: D, ref: Z !== void 0 ? Z : null, props: B };
  }
  function Et(g, D) {
    return St(g.type, D, g.props);
  }
  function dt(g) {
    return typeof g == 'object' && g !== null && g.$$typeof === i;
  }
  function j(g) {
    var D = { '=': '=0', ':': '=2' };
    return (
      '$' +
      g.replace(/[=:]/g, function (B) {
        return D[B];
      })
    );
  }
  var at = /\/+/g;
  function At(g, D) {
    return typeof g == 'object' && g !== null && g.key != null ? j('' + g.key) : D.toString(36);
  }
  function mt(g) {
    switch (g.status) {
      case 'fulfilled':
        return g.value;
      case 'rejected':
        throw g.reason;
      default:
        switch (
          (typeof g.status == 'string'
            ? g.then(P, P)
            : ((g.status = 'pending'),
              g.then(
                function (D) {
                  g.status === 'pending' && ((g.status = 'fulfilled'), (g.value = D));
                },
                function (D) {
                  g.status === 'pending' && ((g.status = 'rejected'), (g.reason = D));
                },
              )),
          g.status)
        ) {
          case 'fulfilled':
            return g.value;
          case 'rejected':
            throw g.reason;
        }
    }
    throw g;
  }
  function M(g, D, B, Z, tt) {
    var ft = typeof g;
    (ft === 'undefined' || ft === 'boolean') && (g = null);
    var bt = !1;
    if (g === null) bt = !0;
    else
      switch (ft) {
        case 'bigint':
        case 'string':
        case 'number':
          bt = !0;
          break;
        case 'object':
          switch (g.$$typeof) {
            case i:
            case o:
              bt = !0;
              break;
            case O:
              return ((bt = g._init), M(bt(g._payload), D, B, Z, tt));
          }
      }
    if (bt)
      return (
        (tt = tt(g)),
        (bt = Z === '' ? '.' + At(g, 0) : Z),
        ct(tt)
          ? ((B = ''),
            bt != null && (B = bt.replace(at, '$&/') + '/'),
            M(tt, D, B, '', function (Gn) {
              return Gn;
            }))
          : tt != null &&
            (dt(tt) &&
              (tt = Et(
                tt,
                B +
                  (tt.key == null || (g && g.key === tt.key)
                    ? ''
                    : ('' + tt.key).replace(at, '$&/') + '/') +
                  bt,
              )),
            D.push(tt)),
        1
      );
    bt = 0;
    var te = Z === '' ? '.' : Z + ':';
    if (ct(g))
      for (var qt = 0; qt < g.length; qt++)
        ((Z = g[qt]), (ft = te + At(Z, qt)), (bt += M(Z, D, B, ft, tt)));
    else if (((qt = G(g)), typeof qt == 'function'))
      for (g = qt.call(g), qt = 0; !(Z = g.next()).done; )
        ((Z = Z.value), (ft = te + At(Z, qt++)), (bt += M(Z, D, B, ft, tt)));
    else if (ft === 'object') {
      if (typeof g.then == 'function') return M(mt(g), D, B, Z, tt);
      throw (
        (D = String(g)),
        Error(
          'Objects are not valid as a React child (found: ' +
            (D === '[object Object]' ? 'object with keys {' + Object.keys(g).join(', ') + '}' : D) +
            '). If you meant to render a collection of children, use an array instead.',
        )
      );
    }
    return bt;
  }
  function H(g, D, B) {
    if (g == null) return g;
    var Z = [],
      tt = 0;
    return (
      M(g, Z, '', '', function (ft) {
        return D.call(B, ft, tt++);
      }),
      Z
    );
  }
  function W(g) {
    if (g._status === -1) {
      var D = g._result;
      ((D = D()),
        D.then(
          function (B) {
            (g._status === 0 || g._status === -1) && ((g._status = 1), (g._result = B));
          },
          function (B) {
            (g._status === 0 || g._status === -1) && ((g._status = 2), (g._result = B));
          },
        ),
        g._status === -1 && ((g._status = 0), (g._result = D)));
    }
    if (g._status === 1) return g._result.default;
    throw g._result;
  }
  var ut =
      typeof reportError == 'function'
        ? reportError
        : function (g) {
            if (typeof window == 'object' && typeof window.ErrorEvent == 'function') {
              var D = new window.ErrorEvent('error', {
                bubbles: !0,
                cancelable: !0,
                message:
                  typeof g == 'object' && g !== null && typeof g.message == 'string'
                    ? String(g.message)
                    : String(g),
                error: g,
              });
              if (!window.dispatchEvent(D)) return;
            } else if (typeof process == 'object' && typeof process.emit == 'function') {
              process.emit('uncaughtException', g);
              return;
            }
            console.error(g);
          },
    lt = {
      map: H,
      forEach: function (g, D, B) {
        H(
          g,
          function () {
            D.apply(this, arguments);
          },
          B,
        );
      },
      count: function (g) {
        var D = 0;
        return (
          H(g, function () {
            D++;
          }),
          D
        );
      },
      toArray: function (g) {
        return (
          H(g, function (D) {
            return D;
          }) || []
        );
      },
      only: function (g) {
        if (!dt(g))
          throw Error('React.Children.only expected to receive a single React element child.');
        return g;
      },
    };
  return (
    (it.Activity = z),
    (it.Children = lt),
    (it.Component = L),
    (it.Fragment = s),
    (it.Profiler = m),
    (it.PureComponent = V),
    (it.StrictMode = f),
    (it.Suspense = S),
    (it.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = w),
    (it.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function (g) {
        return w.H.useMemoCache(g);
      },
    }),
    (it.cache = function (g) {
      return function () {
        return g.apply(null, arguments);
      };
    }),
    (it.cacheSignal = function () {
      return null;
    }),
    (it.cloneElement = function (g, D, B) {
      if (g == null) throw Error('The argument must be a React element, but you passed ' + g + '.');
      var Z = Y({}, g.props),
        tt = g.key;
      if (D != null)
        for (ft in (D.key !== void 0 && (tt = '' + D.key), D))
          !nt.call(D, ft) ||
            ft === 'key' ||
            ft === '__self' ||
            ft === '__source' ||
            (ft === 'ref' && D.ref === void 0) ||
            (Z[ft] = D[ft]);
      var ft = arguments.length - 2;
      if (ft === 1) Z.children = B;
      else if (1 < ft) {
        for (var bt = Array(ft), te = 0; te < ft; te++) bt[te] = arguments[te + 2];
        Z.children = bt;
      }
      return St(g.type, tt, Z);
    }),
    (it.createContext = function (g) {
      return (
        (g = {
          $$typeof: b,
          _currentValue: g,
          _currentValue2: g,
          _threadCount: 0,
          Provider: null,
          Consumer: null,
        }),
        (g.Provider = g),
        (g.Consumer = { $$typeof: d, _context: g }),
        g
      );
    }),
    (it.createElement = function (g, D, B) {
      var Z,
        tt = {},
        ft = null;
      if (D != null)
        for (Z in (D.key !== void 0 && (ft = '' + D.key), D))
          nt.call(D, Z) && Z !== 'key' && Z !== '__self' && Z !== '__source' && (tt[Z] = D[Z]);
      var bt = arguments.length - 2;
      if (bt === 1) tt.children = B;
      else if (1 < bt) {
        for (var te = Array(bt), qt = 0; qt < bt; qt++) te[qt] = arguments[qt + 2];
        tt.children = te;
      }
      if (g && g.defaultProps)
        for (Z in ((bt = g.defaultProps), bt)) tt[Z] === void 0 && (tt[Z] = bt[Z]);
      return St(g, ft, tt);
    }),
    (it.createRef = function () {
      return { current: null };
    }),
    (it.forwardRef = function (g) {
      return { $$typeof: h, render: g };
    }),
    (it.isValidElement = dt),
    (it.lazy = function (g) {
      return { $$typeof: O, _payload: { _status: -1, _result: g }, _init: W };
    }),
    (it.memo = function (g, D) {
      return { $$typeof: y, type: g, compare: D === void 0 ? null : D };
    }),
    (it.startTransition = function (g) {
      var D = w.T,
        B = {};
      w.T = B;
      try {
        var Z = g(),
          tt = w.S;
        (tt !== null && tt(B, Z),
          typeof Z == 'object' && Z !== null && typeof Z.then == 'function' && Z.then(P, ut));
      } catch (ft) {
        ut(ft);
      } finally {
        (D !== null && B.types !== null && (D.types = B.types), (w.T = D));
      }
    }),
    (it.unstable_useCacheRefresh = function () {
      return w.H.useCacheRefresh();
    }),
    (it.use = function (g) {
      return w.H.use(g);
    }),
    (it.useActionState = function (g, D, B) {
      return w.H.useActionState(g, D, B);
    }),
    (it.useCallback = function (g, D) {
      return w.H.useCallback(g, D);
    }),
    (it.useContext = function (g) {
      return w.H.useContext(g);
    }),
    (it.useDebugValue = function () {}),
    (it.useDeferredValue = function (g, D) {
      return w.H.useDeferredValue(g, D);
    }),
    (it.useEffect = function (g, D) {
      return w.H.useEffect(g, D);
    }),
    (it.useEffectEvent = function (g) {
      return w.H.useEffectEvent(g);
    }),
    (it.useId = function () {
      return w.H.useId();
    }),
    (it.useImperativeHandle = function (g, D, B) {
      return w.H.useImperativeHandle(g, D, B);
    }),
    (it.useInsertionEffect = function (g, D) {
      return w.H.useInsertionEffect(g, D);
    }),
    (it.useLayoutEffect = function (g, D) {
      return w.H.useLayoutEffect(g, D);
    }),
    (it.useMemo = function (g, D) {
      return w.H.useMemo(g, D);
    }),
    (it.useOptimistic = function (g, D) {
      return w.H.useOptimistic(g, D);
    }),
    (it.useReducer = function (g, D, B) {
      return w.H.useReducer(g, D, B);
    }),
    (it.useRef = function (g) {
      return w.H.useRef(g);
    }),
    (it.useState = function (g) {
      return w.H.useState(g);
    }),
    (it.useSyncExternalStore = function (g, D, B) {
      return w.H.useSyncExternalStore(g, D, B);
    }),
    (it.useTransition = function () {
      return w.H.useTransition();
    }),
    (it.version = '19.2.6'),
    it
  );
}
var lm;
function $f() {
  return (lm || ((lm = 1), (Cf.exports = zv())), Cf.exports);
}
var q = $f();
const Ol = pv(q),
  Tv = bv({ __proto__: null, default: Ol }, [q]);
var Df = { exports: {} },
  ja = {},
  Rf = { exports: {} },
  Uf = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var nm;
function Av() {
  return (
    nm ||
      ((nm = 1),
      (function (i) {
        function o(M, H) {
          var W = M.length;
          M.push(H);
          t: for (; 0 < W; ) {
            var ut = (W - 1) >>> 1,
              lt = M[ut];
            if (0 < m(lt, H)) ((M[ut] = H), (M[W] = lt), (W = ut));
            else break t;
          }
        }
        function s(M) {
          return M.length === 0 ? null : M[0];
        }
        function f(M) {
          if (M.length === 0) return null;
          var H = M[0],
            W = M.pop();
          if (W !== H) {
            M[0] = W;
            t: for (var ut = 0, lt = M.length, g = lt >>> 1; ut < g; ) {
              var D = 2 * (ut + 1) - 1,
                B = M[D],
                Z = D + 1,
                tt = M[Z];
              if (0 > m(B, W))
                Z < lt && 0 > m(tt, B)
                  ? ((M[ut] = tt), (M[Z] = W), (ut = Z))
                  : ((M[ut] = B), (M[D] = W), (ut = D));
              else if (Z < lt && 0 > m(tt, W)) ((M[ut] = tt), (M[Z] = W), (ut = Z));
              else break t;
            }
          }
          return H;
        }
        function m(M, H) {
          var W = M.sortIndex - H.sortIndex;
          return W !== 0 ? W : M.id - H.id;
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
          var b = Date,
            h = b.now();
          i.unstable_now = function () {
            return b.now() - h;
          };
        }
        var S = [],
          y = [],
          O = 1,
          z = null,
          N = 3,
          G = !1,
          k = !1,
          Y = !1,
          X = !1,
          L = typeof setTimeout == 'function' ? setTimeout : null,
          J = typeof clearTimeout == 'function' ? clearTimeout : null,
          V = typeof setImmediate < 'u' ? setImmediate : null;
        function K(M) {
          for (var H = s(y); H !== null; ) {
            if (H.callback === null) f(y);
            else if (H.startTime <= M) (f(y), (H.sortIndex = H.expirationTime), o(S, H));
            else break;
            H = s(y);
          }
        }
        function ct(M) {
          if (((Y = !1), K(M), !k))
            if (s(S) !== null) ((k = !0), P || ((P = !0), j()));
            else {
              var H = s(y);
              H !== null && mt(ct, H.startTime - M);
            }
        }
        var P = !1,
          w = -1,
          nt = 5,
          St = -1;
        function Et() {
          return X ? !0 : !(i.unstable_now() - St < nt);
        }
        function dt() {
          if (((X = !1), P)) {
            var M = i.unstable_now();
            St = M;
            var H = !0;
            try {
              t: {
                ((k = !1), Y && ((Y = !1), J(w), (w = -1)), (G = !0));
                var W = N;
                try {
                  e: {
                    for (K(M), z = s(S); z !== null && !(z.expirationTime > M && Et()); ) {
                      var ut = z.callback;
                      if (typeof ut == 'function') {
                        ((z.callback = null), (N = z.priorityLevel));
                        var lt = ut(z.expirationTime <= M);
                        if (((M = i.unstable_now()), typeof lt == 'function')) {
                          ((z.callback = lt), K(M), (H = !0));
                          break e;
                        }
                        (z === s(S) && f(S), K(M));
                      } else f(S);
                      z = s(S);
                    }
                    if (z !== null) H = !0;
                    else {
                      var g = s(y);
                      (g !== null && mt(ct, g.startTime - M), (H = !1));
                    }
                  }
                  break t;
                } finally {
                  ((z = null), (N = W), (G = !1));
                }
                H = void 0;
              }
            } finally {
              H ? j() : (P = !1);
            }
          }
        }
        var j;
        if (typeof V == 'function')
          j = function () {
            V(dt);
          };
        else if (typeof MessageChannel < 'u') {
          var at = new MessageChannel(),
            At = at.port2;
          ((at.port1.onmessage = dt),
            (j = function () {
              At.postMessage(null);
            }));
        } else
          j = function () {
            L(dt, 0);
          };
        function mt(M, H) {
          w = L(function () {
            M(i.unstable_now());
          }, H);
        }
        ((i.unstable_IdlePriority = 5),
          (i.unstable_ImmediatePriority = 1),
          (i.unstable_LowPriority = 4),
          (i.unstable_NormalPriority = 3),
          (i.unstable_Profiling = null),
          (i.unstable_UserBlockingPriority = 2),
          (i.unstable_cancelCallback = function (M) {
            M.callback = null;
          }),
          (i.unstable_forceFrameRate = function (M) {
            0 > M || 125 < M
              ? console.error(
                  'forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported',
                )
              : (nt = 0 < M ? Math.floor(1e3 / M) : 5);
          }),
          (i.unstable_getCurrentPriorityLevel = function () {
            return N;
          }),
          (i.unstable_next = function (M) {
            switch (N) {
              case 1:
              case 2:
              case 3:
                var H = 3;
                break;
              default:
                H = N;
            }
            var W = N;
            N = H;
            try {
              return M();
            } finally {
              N = W;
            }
          }),
          (i.unstable_requestPaint = function () {
            X = !0;
          }),
          (i.unstable_runWithPriority = function (M, H) {
            switch (M) {
              case 1:
              case 2:
              case 3:
              case 4:
              case 5:
                break;
              default:
                M = 3;
            }
            var W = N;
            N = M;
            try {
              return H();
            } finally {
              N = W;
            }
          }),
          (i.unstable_scheduleCallback = function (M, H, W) {
            var ut = i.unstable_now();
            switch (
              (typeof W == 'object' && W !== null
                ? ((W = W.delay), (W = typeof W == 'number' && 0 < W ? ut + W : ut))
                : (W = ut),
              M)
            ) {
              case 1:
                var lt = -1;
                break;
              case 2:
                lt = 250;
                break;
              case 5:
                lt = 1073741823;
                break;
              case 4:
                lt = 1e4;
                break;
              default:
                lt = 5e3;
            }
            return (
              (lt = W + lt),
              (M = {
                id: O++,
                callback: H,
                priorityLevel: M,
                startTime: W,
                expirationTime: lt,
                sortIndex: -1,
              }),
              W > ut
                ? ((M.sortIndex = W),
                  o(y, M),
                  s(S) === null && M === s(y) && (Y ? (J(w), (w = -1)) : (Y = !0), mt(ct, W - ut)))
                : ((M.sortIndex = lt), o(S, M), k || G || ((k = !0), P || ((P = !0), j()))),
              M
            );
          }),
          (i.unstable_shouldYield = Et),
          (i.unstable_wrapCallback = function (M) {
            var H = N;
            return function () {
              var W = N;
              N = H;
              try {
                return M.apply(this, arguments);
              } finally {
                N = W;
              }
            };
          }));
      })(Uf)),
    Uf
  );
}
var am;
function xv() {
  return (am || ((am = 1), (Rf.exports = Av())), Rf.exports);
}
var Nf = { exports: {} },
  It = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var um;
function Mv() {
  if (um) return It;
  um = 1;
  var i = $f();
  function o(S) {
    var y = 'https://react.dev/errors/' + S;
    if (1 < arguments.length) {
      y += '?args[]=' + encodeURIComponent(arguments[1]);
      for (var O = 2; O < arguments.length; O++) y += '&args[]=' + encodeURIComponent(arguments[O]);
    }
    return (
      'Minified React error #' +
      S +
      '; visit ' +
      y +
      ' for the full message or use the non-minified dev environment for full errors and additional helpful warnings.'
    );
  }
  function s() {}
  var f = {
      d: {
        f: s,
        r: function () {
          throw Error(o(522));
        },
        D: s,
        C: s,
        L: s,
        m: s,
        X: s,
        S: s,
        M: s,
      },
      p: 0,
      findDOMNode: null,
    },
    m = Symbol.for('react.portal');
  function d(S, y, O) {
    var z = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: m,
      key: z == null ? null : '' + z,
      children: S,
      containerInfo: y,
      implementation: O,
    };
  }
  var b = i.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function h(S, y) {
    if (S === 'font') return '';
    if (typeof y == 'string') return y === 'use-credentials' ? y : '';
  }
  return (
    (It.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = f),
    (It.createPortal = function (S, y) {
      var O = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
      if (!y || (y.nodeType !== 1 && y.nodeType !== 9 && y.nodeType !== 11)) throw Error(o(299));
      return d(S, y, null, O);
    }),
    (It.flushSync = function (S) {
      var y = b.T,
        O = f.p;
      try {
        if (((b.T = null), (f.p = 2), S)) return S();
      } finally {
        ((b.T = y), (f.p = O), f.d.f());
      }
    }),
    (It.preconnect = function (S, y) {
      typeof S == 'string' &&
        (y
          ? ((y = y.crossOrigin),
            (y = typeof y == 'string' ? (y === 'use-credentials' ? y : '') : void 0))
          : (y = null),
        f.d.C(S, y));
    }),
    (It.prefetchDNS = function (S) {
      typeof S == 'string' && f.d.D(S);
    }),
    (It.preinit = function (S, y) {
      if (typeof S == 'string' && y && typeof y.as == 'string') {
        var O = y.as,
          z = h(O, y.crossOrigin),
          N = typeof y.integrity == 'string' ? y.integrity : void 0,
          G = typeof y.fetchPriority == 'string' ? y.fetchPriority : void 0;
        O === 'style'
          ? f.d.S(S, typeof y.precedence == 'string' ? y.precedence : void 0, {
              crossOrigin: z,
              integrity: N,
              fetchPriority: G,
            })
          : O === 'script' &&
            f.d.X(S, {
              crossOrigin: z,
              integrity: N,
              fetchPriority: G,
              nonce: typeof y.nonce == 'string' ? y.nonce : void 0,
            });
      }
    }),
    (It.preinitModule = function (S, y) {
      if (typeof S == 'string')
        if (typeof y == 'object' && y !== null) {
          if (y.as == null || y.as === 'script') {
            var O = h(y.as, y.crossOrigin);
            f.d.M(S, {
              crossOrigin: O,
              integrity: typeof y.integrity == 'string' ? y.integrity : void 0,
              nonce: typeof y.nonce == 'string' ? y.nonce : void 0,
            });
          }
        } else y == null && f.d.M(S);
    }),
    (It.preload = function (S, y) {
      if (typeof S == 'string' && typeof y == 'object' && y !== null && typeof y.as == 'string') {
        var O = y.as,
          z = h(O, y.crossOrigin);
        f.d.L(S, O, {
          crossOrigin: z,
          integrity: typeof y.integrity == 'string' ? y.integrity : void 0,
          nonce: typeof y.nonce == 'string' ? y.nonce : void 0,
          type: typeof y.type == 'string' ? y.type : void 0,
          fetchPriority: typeof y.fetchPriority == 'string' ? y.fetchPriority : void 0,
          referrerPolicy: typeof y.referrerPolicy == 'string' ? y.referrerPolicy : void 0,
          imageSrcSet: typeof y.imageSrcSet == 'string' ? y.imageSrcSet : void 0,
          imageSizes: typeof y.imageSizes == 'string' ? y.imageSizes : void 0,
          media: typeof y.media == 'string' ? y.media : void 0,
        });
      }
    }),
    (It.preloadModule = function (S, y) {
      if (typeof S == 'string')
        if (y) {
          var O = h(y.as, y.crossOrigin);
          f.d.m(S, {
            as: typeof y.as == 'string' && y.as !== 'script' ? y.as : void 0,
            crossOrigin: O,
            integrity: typeof y.integrity == 'string' ? y.integrity : void 0,
          });
        } else f.d.m(S);
    }),
    (It.requestFormReset = function (S) {
      f.d.r(S);
    }),
    (It.unstable_batchedUpdates = function (S, y) {
      return S(y);
    }),
    (It.useFormState = function (S, y, O) {
      return b.H.useFormState(S, y, O);
    }),
    (It.useFormStatus = function () {
      return b.H.useHostTransitionStatus();
    }),
    (It.version = '19.2.6'),
    It
  );
}
var im;
function pm() {
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
      } catch (o) {
        console.error(o);
      }
  }
  return (i(), (Nf.exports = Mv()), Nf.exports);
}
/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var cm;
function _v() {
  if (cm) return ja;
  cm = 1;
  var i = xv(),
    o = $f(),
    s = pm();
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
  function b(t) {
    if (t.tag === 13) {
      var e = t.memoizedState;
      if ((e === null && ((t = t.alternate), t !== null && (e = t.memoizedState)), e !== null))
        return e.dehydrated;
    }
    return null;
  }
  function h(t) {
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
  function y(t) {
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
  function O(t) {
    var e = t.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return t;
    for (t = t.child; t !== null; ) {
      if (((e = O(t)), e !== null)) return e;
      t = t.sibling;
    }
    return null;
  }
  var z = Object.assign,
    N = Symbol.for('react.element'),
    G = Symbol.for('react.transitional.element'),
    k = Symbol.for('react.portal'),
    Y = Symbol.for('react.fragment'),
    X = Symbol.for('react.strict_mode'),
    L = Symbol.for('react.profiler'),
    J = Symbol.for('react.consumer'),
    V = Symbol.for('react.context'),
    K = Symbol.for('react.forward_ref'),
    ct = Symbol.for('react.suspense'),
    P = Symbol.for('react.suspense_list'),
    w = Symbol.for('react.memo'),
    nt = Symbol.for('react.lazy'),
    St = Symbol.for('react.activity'),
    Et = Symbol.for('react.memo_cache_sentinel'),
    dt = Symbol.iterator;
  function j(t) {
    return t === null || typeof t != 'object'
      ? null
      : ((t = (dt && t[dt]) || t['@@iterator']), typeof t == 'function' ? t : null);
  }
  var at = Symbol.for('react.client.reference');
  function At(t) {
    if (t == null) return null;
    if (typeof t == 'function') return t.$$typeof === at ? null : t.displayName || t.name || null;
    if (typeof t == 'string') return t;
    switch (t) {
      case Y:
        return 'Fragment';
      case L:
        return 'Profiler';
      case X:
        return 'StrictMode';
      case ct:
        return 'Suspense';
      case P:
        return 'SuspenseList';
      case St:
        return 'Activity';
    }
    if (typeof t == 'object')
      switch (t.$$typeof) {
        case k:
          return 'Portal';
        case V:
          return t.displayName || 'Context';
        case J:
          return (t._context.displayName || 'Context') + '.Consumer';
        case K:
          var e = t.render;
          return (
            (t = t.displayName),
            t ||
              ((t = e.displayName || e.name || ''),
              (t = t !== '' ? 'ForwardRef(' + t + ')' : 'ForwardRef')),
            t
          );
        case w:
          return ((e = t.displayName || null), e !== null ? e : At(t.type) || 'Memo');
        case nt:
          ((e = t._payload), (t = t._init));
          try {
            return At(t(e));
          } catch {}
      }
    return null;
  }
  var mt = Array.isArray,
    M = o.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    H = s.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    W = { pending: !1, data: null, method: null, action: null },
    ut = [],
    lt = -1;
  function g(t) {
    return { current: t };
  }
  function D(t) {
    0 > lt || ((t.current = ut[lt]), (ut[lt] = null), lt--);
  }
  function B(t, e) {
    (lt++, (ut[lt] = t.current), (t.current = e));
  }
  var Z = g(null),
    tt = g(null),
    ft = g(null),
    bt = g(null);
  function te(t, e) {
    switch ((B(ft, e), B(tt, t), B(Z, null), e.nodeType)) {
      case 9:
      case 11:
        t = (t = e.documentElement) && (t = t.namespaceURI) ? zd(t) : 0;
        break;
      default:
        if (((t = e.tagName), (e = e.namespaceURI))) ((e = zd(e)), (t = Td(e, t)));
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
    (D(Z), B(Z, t));
  }
  function qt() {
    (D(Z), D(tt), D(ft));
  }
  function Gn(t) {
    t.memoizedState !== null && B(bt, t);
    var e = Z.current,
      l = Td(e, t.type);
    e !== l && (B(tt, t), B(Z, l));
  }
  function Ga(t) {
    (tt.current === t && (D(Z), D(tt)), bt.current === t && (D(bt), (Ca._currentValue = W)));
  }
  var oi, Ff;
  function Dl(t) {
    if (oi === void 0)
      try {
        throw Error();
      } catch (l) {
        var e = l.stack.trim().match(/\n( *(at )?)/);
        ((oi = (e && e[1]) || ''),
          (Ff =
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
      Ff
    );
  }
  var ri = !1;
  function si(t, e) {
    if (!t || ri) return '';
    ri = !0;
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
                } catch (_) {
                  var x = _;
                }
                Reflect.construct(t, [], U);
              } else {
                try {
                  U.call();
                } catch (_) {
                  x = _;
                }
                t.call(U.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (_) {
                x = _;
              }
              (U = t()) && typeof U.catch == 'function' && U.catch(function () {});
            }
          } catch (_) {
            if (_ && x && typeof _.stack == 'string') return [_.stack, x.stack];
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
        var v = c.split(`
`),
          A = r.split(`
`);
        for (a = n = 0; n < v.length && !v[n].includes('DetermineComponentFrameRoot'); ) n++;
        for (; a < A.length && !A[a].includes('DetermineComponentFrameRoot'); ) a++;
        if (n === v.length || a === A.length)
          for (n = v.length - 1, a = A.length - 1; 1 <= n && 0 <= a && v[n] !== A[a]; ) a--;
        for (; 1 <= n && 0 <= a; n--, a--)
          if (v[n] !== A[a]) {
            if (n !== 1 || a !== 1)
              do
                if ((n--, a--, 0 > a || v[n] !== A[a])) {
                  var C =
                    `
` + v[n].replace(' at new ', ' at ');
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
      ((ri = !1), (Error.prepareStackTrace = l));
    }
    return (l = t ? t.displayName || t.name : '') ? Dl(l) : '';
  }
  function km(t, e) {
    switch (t.tag) {
      case 26:
      case 27:
      case 5:
        return Dl(t.type);
      case 16:
        return Dl('Lazy');
      case 13:
        return t.child !== e && e !== null ? Dl('Suspense Fallback') : Dl('Suspense');
      case 19:
        return Dl('SuspenseList');
      case 0:
      case 15:
        return si(t.type, !1);
      case 11:
        return si(t.type.render, !1);
      case 1:
        return si(t.type, !0);
      case 31:
        return Dl('Activity');
      default:
        return '';
    }
  }
  function Pf(t) {
    try {
      var e = '',
        l = null;
      do ((e += km(t, l)), (l = t), (t = t.return));
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
    Wm = i.unstable_shouldYield,
    Fm = i.unstable_requestPaint,
    oe = i.unstable_now,
    Pm = i.unstable_getCurrentPriorityLevel,
    If = i.unstable_ImmediatePriority,
    to = i.unstable_UserBlockingPriority,
    La = i.unstable_NormalPriority,
    Im = i.unstable_LowPriority,
    eo = i.unstable_IdlePriority,
    th = i.log,
    eh = i.unstable_setDisableYieldValue,
    Ln = null,
    re = null;
  function el(t) {
    if ((typeof th == 'function' && eh(t), re && typeof re.setStrictMode == 'function'))
      try {
        re.setStrictMode(Ln, t);
      } catch {}
  }
  var se = Math.clz32 ? Math.clz32 : ah,
    lh = Math.log,
    nh = Math.LN2;
  function ah(t) {
    return ((t >>>= 0), t === 0 ? 32 : (31 - ((lh(t) / nh) | 0)) | 0);
  }
  var Xa = 256,
    Qa = 262144,
    Va = 4194304;
  function Rl(t) {
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
  function Za(t, e, l) {
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
            ? (a = Rl(n))
            : ((c &= r), c !== 0 ? (a = Rl(c)) : l || ((l = r & ~t), l !== 0 && (a = Rl(l)))))
        : ((r = n & ~u),
          r !== 0
            ? (a = Rl(r))
            : c !== 0
              ? (a = Rl(c))
              : l || ((l = n & ~t), l !== 0 && (a = Rl(l)))),
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
  function Xn(t, e) {
    return (t.pendingLanes & ~(t.suspendedLanes & ~t.pingedLanes) & e) === 0;
  }
  function uh(t, e) {
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
  function lo() {
    var t = Va;
    return ((Va <<= 1), (Va & 62914560) === 0 && (Va = 4194304), t);
  }
  function vi(t) {
    for (var e = [], l = 0; 31 > l; l++) e.push(t);
    return e;
  }
  function Qn(t, e) {
    ((t.pendingLanes |= e),
      e !== 268435456 && ((t.suspendedLanes = 0), (t.pingedLanes = 0), (t.warmLanes = 0)));
  }
  function ih(t, e, l, n, a, u) {
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
      v = t.expirationTimes,
      A = t.hiddenUpdates;
    for (l = c & ~l; 0 < l; ) {
      var C = 31 - se(l),
        U = 1 << C;
      ((r[C] = 0), (v[C] = -1));
      var x = A[C];
      if (x !== null)
        for (A[C] = null, C = 0; C < x.length; C++) {
          var _ = x[C];
          _ !== null && (_.lane &= -536870913);
        }
      l &= ~U;
    }
    (n !== 0 && no(t, n, 0),
      u !== 0 && a === 0 && t.tag !== 0 && (t.suspendedLanes |= u & ~(c & ~e)));
  }
  function no(t, e, l) {
    ((t.pendingLanes |= e), (t.suspendedLanes &= ~e));
    var n = 31 - se(e);
    ((t.entangledLanes |= e),
      (t.entanglements[n] = t.entanglements[n] | 1073741824 | (l & 261930)));
  }
  function ao(t, e) {
    var l = (t.entangledLanes |= e);
    for (t = t.entanglements; l; ) {
      var n = 31 - se(l),
        a = 1 << n;
      ((a & e) | (t[n] & e) && (t[n] |= e), (l &= ~a));
    }
  }
  function uo(t, e) {
    var l = e & -e;
    return ((l = (l & 42) !== 0 ? 1 : yi(l)), (l & (t.suspendedLanes | e)) !== 0 ? 0 : l);
  }
  function yi(t) {
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
  function io() {
    var t = H.p;
    return t !== 0 ? t : ((t = window.event), t === void 0 ? 32 : Kd(t.type));
  }
  function co(t, e) {
    var l = H.p;
    try {
      return ((H.p = t), e());
    } finally {
      H.p = l;
    }
  }
  var ll = Math.random().toString(36).slice(2),
    $t = '__reactFiber$' + ll,
    le = '__reactProps$' + ll,
    Wl = '__reactContainer$' + ll,
    bi = '__reactEvents$' + ll,
    ch = '__reactListeners$' + ll,
    fh = '__reactHandles$' + ll,
    fo = '__reactResources$' + ll,
    Vn = '__reactMarker$' + ll;
  function pi(t) {
    (delete t[$t], delete t[le], delete t[bi], delete t[ch], delete t[fh]);
  }
  function Fl(t) {
    var e = t[$t];
    if (e) return e;
    for (var l = t.parentNode; l; ) {
      if ((e = l[Wl] || l[$t])) {
        if (((l = e.alternate), e.child !== null || (l !== null && l.child !== null)))
          for (t = Dd(t); t !== null; ) {
            if ((l = t[$t])) return l;
            t = Dd(t);
          }
        return e;
      }
      ((t = l), (l = t.parentNode));
    }
    return null;
  }
  function Pl(t) {
    if ((t = t[$t] || t[Wl])) {
      var e = t.tag;
      if (e === 5 || e === 6 || e === 13 || e === 31 || e === 26 || e === 27 || e === 3) return t;
    }
    return null;
  }
  function Zn(t) {
    var e = t.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return t.stateNode;
    throw Error(f(33));
  }
  function Il(t) {
    var e = t[fo];
    return (e || (e = t[fo] = { hoistableStyles: new Map(), hoistableScripts: new Map() }), e);
  }
  function Kt(t) {
    t[Vn] = !0;
  }
  var oo = new Set(),
    ro = {};
  function Ul(t, e) {
    (tn(t, e), tn(t + 'Capture', e));
  }
  function tn(t, e) {
    for (ro[t] = e, t = 0; t < e.length; t++) oo.add(e[t]);
  }
  var oh = RegExp(
      '^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$',
    ),
    so = {},
    mo = {};
  function rh(t) {
    return di.call(mo, t)
      ? !0
      : di.call(so, t)
        ? !1
        : oh.test(t)
          ? (mo[t] = !0)
          : ((so[t] = !0), !1);
  }
  function Ka(t, e, l) {
    if (rh(e))
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
  function Ja(t, e, l) {
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
  function Be(t, e, l, n) {
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
  function pe(t) {
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
  function ho(t) {
    var e = t.type;
    return (t = t.nodeName) && t.toLowerCase() === 'input' && (e === 'checkbox' || e === 'radio');
  }
  function sh(t, e, l) {
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
      var e = ho(t) ? 'checked' : 'value';
      t._valueTracker = sh(t, e, '' + t[e]);
    }
  }
  function vo(t) {
    if (!t) return !1;
    var e = t._valueTracker;
    if (!e) return !0;
    var l = e.getValue(),
      n = '';
    return (
      t && (n = ho(t) ? (t.checked ? 'true' : 'false') : t.value),
      (t = n),
      t !== l ? (e.setValue(t), !0) : !1
    );
  }
  function $a(t) {
    if (((t = t || (typeof document < 'u' ? document : void 0)), typeof t > 'u')) return null;
    try {
      return t.activeElement || t.body;
    } catch {
      return t.body;
    }
  }
  var dh = /[\n"\\]/g;
  function Se(t) {
    return t.replace(dh, function (e) {
      return '\\' + e.charCodeAt(0).toString(16) + ' ';
    });
  }
  function Ei(t, e, l, n, a, u, c, r) {
    ((t.name = ''),
      c != null && typeof c != 'function' && typeof c != 'symbol' && typeof c != 'boolean'
        ? (t.type = c)
        : t.removeAttribute('type'),
      e != null
        ? c === 'number'
          ? ((e === 0 && t.value === '') || t.value != e) && (t.value = '' + pe(e))
          : t.value !== '' + pe(e) && (t.value = '' + pe(e))
        : (c !== 'submit' && c !== 'reset') || t.removeAttribute('value'),
      e != null
        ? zi(t, c, pe(e))
        : l != null
          ? zi(t, c, pe(l))
          : n != null && t.removeAttribute('value'),
      a == null && u != null && (t.defaultChecked = !!u),
      a != null && (t.checked = a && typeof a != 'function' && typeof a != 'symbol'),
      r != null && typeof r != 'function' && typeof r != 'symbol' && typeof r != 'boolean'
        ? (t.name = '' + pe(r))
        : t.removeAttribute('name'));
  }
  function yo(t, e, l, n, a, u, c, r) {
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
      ((l = l != null ? '' + pe(l) : ''),
        (e = e != null ? '' + pe(e) : l),
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
    (e === 'number' && $a(t.ownerDocument) === t) ||
      t.defaultValue === '' + l ||
      (t.defaultValue = '' + l);
  }
  function en(t, e, l, n) {
    if (((t = t.options), e)) {
      e = {};
      for (var a = 0; a < l.length; a++) e['$' + l[a]] = !0;
      for (l = 0; l < t.length; l++)
        ((a = e.hasOwnProperty('$' + t[l].value)),
          t[l].selected !== a && (t[l].selected = a),
          a && n && (t[l].defaultSelected = !0));
    } else {
      for (l = '' + pe(l), e = null, a = 0; a < t.length; a++) {
        if (t[a].value === l) {
          ((t[a].selected = !0), n && (t[a].defaultSelected = !0));
          return;
        }
        e !== null || t[a].disabled || (e = t[a]);
      }
      e !== null && (e.selected = !0);
    }
  }
  function go(t, e, l) {
    if (e != null && ((e = '' + pe(e)), e !== t.value && (t.value = e), l == null)) {
      t.defaultValue !== e && (t.defaultValue = e);
      return;
    }
    t.defaultValue = l != null ? '' + pe(l) : '';
  }
  function bo(t, e, l, n) {
    if (e == null) {
      if (n != null) {
        if (l != null) throw Error(f(92));
        if (mt(n)) {
          if (1 < n.length) throw Error(f(93));
          n = n[0];
        }
        l = n;
      }
      (l == null && (l = ''), (e = l));
    }
    ((l = pe(e)),
      (t.defaultValue = l),
      (n = t.textContent),
      n === l && n !== '' && n !== null && (t.value = n),
      Si(t));
  }
  function ln(t, e) {
    if (e) {
      var l = t.firstChild;
      if (l && l === t.lastChild && l.nodeType === 3) {
        l.nodeValue = e;
        return;
      }
    }
    t.textContent = e;
  }
  var mh = new Set(
    'animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp'.split(
      ' ',
    ),
  );
  function po(t, e, l) {
    var n = e.indexOf('--') === 0;
    l == null || typeof l == 'boolean' || l === ''
      ? n
        ? t.setProperty(e, '')
        : e === 'float'
          ? (t.cssFloat = '')
          : (t[e] = '')
      : n
        ? t.setProperty(e, l)
        : typeof l != 'number' || l === 0 || mh.has(e)
          ? e === 'float'
            ? (t.cssFloat = l)
            : (t[e] = ('' + l).trim())
          : (t[e] = l + 'px');
  }
  function So(t, e, l) {
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
      for (var a in e) ((n = e[a]), e.hasOwnProperty(a) && l[a] !== n && po(t, a, n));
    } else for (var u in e) e.hasOwnProperty(u) && po(t, u, e[u]);
  }
  function Ti(t) {
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
  var hh = new Map([
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
    vh =
      /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function ka(t) {
    return vh.test('' + t)
      ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')"
      : t;
  }
  function we() {}
  var Ai = null;
  function xi(t) {
    return (
      (t = t.target || t.srcElement || window),
      t.correspondingUseElement && (t = t.correspondingUseElement),
      t.nodeType === 3 ? t.parentNode : t
    );
  }
  var nn = null,
    an = null;
  function Eo(t) {
    var e = Pl(t);
    if (e && (t = e.stateNode)) {
      var l = t[le] || null;
      t: switch (((t = e.stateNode), e.type)) {
        case 'input':
          if (
            (Ei(
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
                Ei(
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
            for (e = 0; e < l.length; e++) ((n = l[e]), n.form === t.form && vo(n));
          }
          break t;
        case 'textarea':
          go(t, l.value, l.defaultValue);
          break t;
        case 'select':
          ((e = l.value), e != null && en(t, !!l.multiple, e, !1));
      }
    }
  }
  var Mi = !1;
  function zo(t, e, l) {
    if (Mi) return t(e, l);
    Mi = !0;
    try {
      var n = t(e);
      return n;
    } finally {
      if (
        ((Mi = !1),
        (nn !== null || an !== null) &&
          (Bu(), nn && ((e = nn), (t = an), (an = nn = null), Eo(e), t)))
      )
        for (e = 0; e < t.length; e++) Eo(t[e]);
    }
  }
  function Kn(t, e) {
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
  var qe = !(
      typeof window > 'u' ||
      typeof window.document > 'u' ||
      typeof window.document.createElement > 'u'
    ),
    _i = !1;
  if (qe)
    try {
      var Jn = {};
      (Object.defineProperty(Jn, 'passive', {
        get: function () {
          _i = !0;
        },
      }),
        window.addEventListener('test', Jn, Jn),
        window.removeEventListener('test', Jn, Jn));
    } catch {
      _i = !1;
    }
  var nl = null,
    Oi = null,
    Wa = null;
  function To() {
    if (Wa) return Wa;
    var t,
      e = Oi,
      l = e.length,
      n,
      a = 'value' in nl ? nl.value : nl.textContent,
      u = a.length;
    for (t = 0; t < l && e[t] === a[t]; t++);
    var c = l - t;
    for (n = 1; n <= c && e[l - n] === a[u - n]; n++);
    return (Wa = a.slice(t, 1 < n ? 1 - n : void 0));
  }
  function Fa(t) {
    var e = t.keyCode;
    return (
      'charCode' in t ? ((t = t.charCode), t === 0 && e === 13 && (t = 13)) : (t = e),
      t === 10 && (t = 13),
      32 <= t || t === 13 ? t : 0
    );
  }
  function Pa() {
    return !0;
  }
  function Ao() {
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
          ? Pa
          : Ao),
        (this.isPropagationStopped = Ao),
        this
      );
    }
    return (
      z(e.prototype, {
        preventDefault: function () {
          this.defaultPrevented = !0;
          var l = this.nativeEvent;
          l &&
            (l.preventDefault
              ? l.preventDefault()
              : typeof l.returnValue != 'unknown' && (l.returnValue = !1),
            (this.isDefaultPrevented = Pa));
        },
        stopPropagation: function () {
          var l = this.nativeEvent;
          l &&
            (l.stopPropagation
              ? l.stopPropagation()
              : typeof l.cancelBubble != 'unknown' && (l.cancelBubble = !0),
            (this.isPropagationStopped = Pa));
        },
        persist: function () {},
        isPersistent: Pa,
      }),
      e
    );
  }
  var Nl = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function (t) {
        return t.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0,
    },
    Ia = ne(Nl),
    $n = z({}, Nl, { view: 0, detail: 0 }),
    yh = ne($n),
    Ci,
    Di,
    kn,
    tu = z({}, $n, {
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
      getModifierState: Ui,
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
          : (t !== kn &&
              (kn && t.type === 'mousemove'
                ? ((Ci = t.screenX - kn.screenX), (Di = t.screenY - kn.screenY))
                : (Di = Ci = 0),
              (kn = t)),
            Ci);
      },
      movementY: function (t) {
        return 'movementY' in t ? t.movementY : Di;
      },
    }),
    xo = ne(tu),
    gh = z({}, tu, { dataTransfer: 0 }),
    bh = ne(gh),
    ph = z({}, $n, { relatedTarget: 0 }),
    Ri = ne(ph),
    Sh = z({}, Nl, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
    Eh = ne(Sh),
    zh = z({}, Nl, {
      clipboardData: function (t) {
        return 'clipboardData' in t ? t.clipboardData : window.clipboardData;
      },
    }),
    Th = ne(zh),
    Ah = z({}, Nl, { data: 0 }),
    Mo = ne(Ah),
    xh = {
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
    Mh = {
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
    _h = { Alt: 'altKey', Control: 'ctrlKey', Meta: 'metaKey', Shift: 'shiftKey' };
  function Oh(t) {
    var e = this.nativeEvent;
    return e.getModifierState ? e.getModifierState(t) : (t = _h[t]) ? !!e[t] : !1;
  }
  function Ui() {
    return Oh;
  }
  var Ch = z({}, $n, {
      key: function (t) {
        if (t.key) {
          var e = xh[t.key] || t.key;
          if (e !== 'Unidentified') return e;
        }
        return t.type === 'keypress'
          ? ((t = Fa(t)), t === 13 ? 'Enter' : String.fromCharCode(t))
          : t.type === 'keydown' || t.type === 'keyup'
            ? Mh[t.keyCode] || 'Unidentified'
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
      getModifierState: Ui,
      charCode: function (t) {
        return t.type === 'keypress' ? Fa(t) : 0;
      },
      keyCode: function (t) {
        return t.type === 'keydown' || t.type === 'keyup' ? t.keyCode : 0;
      },
      which: function (t) {
        return t.type === 'keypress'
          ? Fa(t)
          : t.type === 'keydown' || t.type === 'keyup'
            ? t.keyCode
            : 0;
      },
    }),
    Dh = ne(Ch),
    Rh = z({}, tu, {
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
    _o = ne(Rh),
    Uh = z({}, $n, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: Ui,
    }),
    Nh = ne(Uh),
    jh = z({}, Nl, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
    Hh = ne(jh),
    Bh = z({}, tu, {
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
    wh = ne(Bh),
    qh = z({}, Nl, { newState: 0, oldState: 0 }),
    Yh = ne(qh),
    Gh = [9, 13, 27, 32],
    Ni = qe && 'CompositionEvent' in window,
    Wn = null;
  qe && 'documentMode' in document && (Wn = document.documentMode);
  var Lh = qe && 'TextEvent' in window && !Wn,
    Oo = qe && (!Ni || (Wn && 8 < Wn && 11 >= Wn)),
    Co = ' ',
    Do = !1;
  function Ro(t, e) {
    switch (t) {
      case 'keyup':
        return Gh.indexOf(e.keyCode) !== -1;
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
  function Uo(t) {
    return ((t = t.detail), typeof t == 'object' && 'data' in t ? t.data : null);
  }
  var un = !1;
  function Xh(t, e) {
    switch (t) {
      case 'compositionend':
        return Uo(e);
      case 'keypress':
        return e.which !== 32 ? null : ((Do = !0), Co);
      case 'textInput':
        return ((t = e.data), t === Co && Do ? null : t);
      default:
        return null;
    }
  }
  function Qh(t, e) {
    if (un)
      return t === 'compositionend' || (!Ni && Ro(t, e))
        ? ((t = To()), (Wa = Oi = nl = null), (un = !1), t)
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
        return Oo && e.locale !== 'ko' ? null : e.data;
      default:
        return null;
    }
  }
  var Vh = {
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
  function No(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase();
    return e === 'input' ? !!Vh[t.type] : e === 'textarea';
  }
  function jo(t, e, l, n) {
    (nn ? (an ? an.push(n) : (an = [n])) : (nn = n),
      (e = Qu(e, 'onChange')),
      0 < e.length &&
        ((l = new Ia('onChange', 'change', null, l, n)), t.push({ event: l, listeners: e })));
  }
  var Fn = null,
    Pn = null;
  function Zh(t) {
    yd(t, 0);
  }
  function eu(t) {
    var e = Zn(t);
    if (vo(e)) return t;
  }
  function Ho(t, e) {
    if (t === 'change') return e;
  }
  var Bo = !1;
  if (qe) {
    var ji;
    if (qe) {
      var Hi = 'oninput' in document;
      if (!Hi) {
        var wo = document.createElement('div');
        (wo.setAttribute('oninput', 'return;'), (Hi = typeof wo.oninput == 'function'));
      }
      ji = Hi;
    } else ji = !1;
    Bo = ji && (!document.documentMode || 9 < document.documentMode);
  }
  function qo() {
    Fn && (Fn.detachEvent('onpropertychange', Yo), (Pn = Fn = null));
  }
  function Yo(t) {
    if (t.propertyName === 'value' && eu(Pn)) {
      var e = [];
      (jo(e, Pn, t, xi(t)), zo(Zh, e));
    }
  }
  function Kh(t, e, l) {
    t === 'focusin'
      ? (qo(), (Fn = e), (Pn = l), Fn.attachEvent('onpropertychange', Yo))
      : t === 'focusout' && qo();
  }
  function Jh(t) {
    if (t === 'selectionchange' || t === 'keyup' || t === 'keydown') return eu(Pn);
  }
  function $h(t, e) {
    if (t === 'click') return eu(e);
  }
  function kh(t, e) {
    if (t === 'input' || t === 'change') return eu(e);
  }
  function Wh(t, e) {
    return (t === e && (t !== 0 || 1 / t === 1 / e)) || (t !== t && e !== e);
  }
  var de = typeof Object.is == 'function' ? Object.is : Wh;
  function In(t, e) {
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
  function Go(t) {
    for (; t && t.firstChild; ) t = t.firstChild;
    return t;
  }
  function Lo(t, e) {
    var l = Go(t);
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
      l = Go(l);
    }
  }
  function Xo(t, e) {
    return t && e
      ? t === e
        ? !0
        : t && t.nodeType === 3
          ? !1
          : e && e.nodeType === 3
            ? Xo(t, e.parentNode)
            : 'contains' in t
              ? t.contains(e)
              : t.compareDocumentPosition
                ? !!(t.compareDocumentPosition(e) & 16)
                : !1
      : !1;
  }
  function Qo(t) {
    t =
      t != null && t.ownerDocument != null && t.ownerDocument.defaultView != null
        ? t.ownerDocument.defaultView
        : window;
    for (var e = $a(t.document); e instanceof t.HTMLIFrameElement; ) {
      try {
        var l = typeof e.contentWindow.location.href == 'string';
      } catch {
        l = !1;
      }
      if (l) t = e.contentWindow;
      else break;
      e = $a(t.document);
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
  var Fh = qe && 'documentMode' in document && 11 >= document.documentMode,
    cn = null,
    wi = null,
    ta = null,
    qi = !1;
  function Vo(t, e, l) {
    var n = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    qi ||
      cn == null ||
      cn !== $a(n) ||
      ((n = cn),
      'selectionStart' in n && Bi(n)
        ? (n = { start: n.selectionStart, end: n.selectionEnd })
        : ((n = ((n.ownerDocument && n.ownerDocument.defaultView) || window).getSelection()),
          (n = {
            anchorNode: n.anchorNode,
            anchorOffset: n.anchorOffset,
            focusNode: n.focusNode,
            focusOffset: n.focusOffset,
          })),
      (ta && In(ta, n)) ||
        ((ta = n),
        (n = Qu(wi, 'onSelect')),
        0 < n.length &&
          ((e = new Ia('onSelect', 'select', null, e, l)),
          t.push({ event: e, listeners: n }),
          (e.target = cn))));
  }
  function jl(t, e) {
    var l = {};
    return (
      (l[t.toLowerCase()] = e.toLowerCase()),
      (l['Webkit' + t] = 'webkit' + e),
      (l['Moz' + t] = 'moz' + e),
      l
    );
  }
  var fn = {
      animationend: jl('Animation', 'AnimationEnd'),
      animationiteration: jl('Animation', 'AnimationIteration'),
      animationstart: jl('Animation', 'AnimationStart'),
      transitionrun: jl('Transition', 'TransitionRun'),
      transitionstart: jl('Transition', 'TransitionStart'),
      transitioncancel: jl('Transition', 'TransitionCancel'),
      transitionend: jl('Transition', 'TransitionEnd'),
    },
    Yi = {},
    Zo = {};
  qe &&
    ((Zo = document.createElement('div').style),
    'AnimationEvent' in window ||
      (delete fn.animationend.animation,
      delete fn.animationiteration.animation,
      delete fn.animationstart.animation),
    'TransitionEvent' in window || delete fn.transitionend.transition);
  function Hl(t) {
    if (Yi[t]) return Yi[t];
    if (!fn[t]) return t;
    var e = fn[t],
      l;
    for (l in e) if (e.hasOwnProperty(l) && l in Zo) return (Yi[t] = e[l]);
    return t;
  }
  var Ko = Hl('animationend'),
    Jo = Hl('animationiteration'),
    $o = Hl('animationstart'),
    Ph = Hl('transitionrun'),
    Ih = Hl('transitionstart'),
    t0 = Hl('transitioncancel'),
    ko = Hl('transitionend'),
    Wo = new Map(),
    Gi =
      'abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel'.split(
        ' ',
      );
  Gi.push('scrollEnd');
  function Ce(t, e) {
    (Wo.set(t, e), Ul(e, [t]));
  }
  var lu =
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
    Ee = [],
    on = 0,
    Li = 0;
  function nu() {
    for (var t = on, e = (Li = on = 0); e < t; ) {
      var l = Ee[e];
      Ee[e++] = null;
      var n = Ee[e];
      Ee[e++] = null;
      var a = Ee[e];
      Ee[e++] = null;
      var u = Ee[e];
      if (((Ee[e++] = null), n !== null && a !== null)) {
        var c = n.pending;
        (c === null ? (a.next = a) : ((a.next = c.next), (c.next = a)), (n.pending = a));
      }
      u !== 0 && Fo(l, a, u);
    }
  }
  function au(t, e, l, n) {
    ((Ee[on++] = t),
      (Ee[on++] = e),
      (Ee[on++] = l),
      (Ee[on++] = n),
      (Li |= n),
      (t.lanes |= n),
      (t = t.alternate),
      t !== null && (t.lanes |= n));
  }
  function Xi(t, e, l, n) {
    return (au(t, e, l, n), uu(t));
  }
  function Bl(t, e) {
    return (au(t, null, null, e), uu(t));
  }
  function Fo(t, e, l) {
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
          ((a = 31 - se(l)),
          (t = u.hiddenUpdates),
          (n = t[a]),
          n === null ? (t[a] = [e]) : n.push(e),
          (e.lane = l | 536870912)),
        u)
      : null;
  }
  function uu(t) {
    if (50 < za) throw ((za = 0), (Fc = null), Error(f(185)));
    for (var e = t.return; e !== null; ) ((t = e), (e = t.return));
    return t.tag === 3 ? t.stateNode : null;
  }
  var rn = {};
  function e0(t, e, l, n) {
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
    return new e0(t, e, l, n);
  }
  function Qi(t) {
    return ((t = t.prototype), !(!t || !t.isReactComponent));
  }
  function Ye(t, e) {
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
  function Po(t, e) {
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
  function iu(t, e, l, n, a, u) {
    var c = 0;
    if (((n = t), typeof t == 'function')) Qi(t) && (c = 1);
    else if (typeof t == 'string')
      c = iv(t, l, Z.current) ? 26 : t === 'html' || t === 'head' || t === 'body' ? 27 : 5;
    else
      t: switch (t) {
        case St:
          return ((t = me(31, l, e, a)), (t.elementType = St), (t.lanes = u), t);
        case Y:
          return wl(l.children, a, u, e);
        case X:
          ((c = 8), (a |= 24));
          break;
        case L:
          return ((t = me(12, l, e, a | 2)), (t.elementType = L), (t.lanes = u), t);
        case ct:
          return ((t = me(13, l, e, a)), (t.elementType = ct), (t.lanes = u), t);
        case P:
          return ((t = me(19, l, e, a)), (t.elementType = P), (t.lanes = u), t);
        default:
          if (typeof t == 'object' && t !== null)
            switch (t.$$typeof) {
              case V:
                c = 10;
                break t;
              case J:
                c = 9;
                break t;
              case K:
                c = 11;
                break t;
              case w:
                c = 14;
                break t;
              case nt:
                ((c = 16), (n = null));
                break t;
            }
          ((c = 29), (l = Error(f(130, t === null ? 'null' : typeof t, ''))), (n = null));
      }
    return ((e = me(c, l, e, a)), (e.elementType = t), (e.type = n), (e.lanes = u), e);
  }
  function wl(t, e, l, n) {
    return ((t = me(7, t, n, e)), (t.lanes = l), t);
  }
  function Vi(t, e, l) {
    return ((t = me(6, t, null, e)), (t.lanes = l), t);
  }
  function Io(t) {
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
  var tr = new WeakMap();
  function ze(t, e) {
    if (typeof t == 'object' && t !== null) {
      var l = tr.get(t);
      return l !== void 0 ? l : ((e = { value: t, source: e, stack: Pf(e) }), tr.set(t, e), e);
    }
    return { value: t, source: e, stack: Pf(e) };
  }
  var sn = [],
    dn = 0,
    cu = null,
    ea = 0,
    Te = [],
    Ae = 0,
    al = null,
    Ue = 1,
    Ne = '';
  function Ge(t, e) {
    ((sn[dn++] = ea), (sn[dn++] = cu), (cu = t), (ea = e));
  }
  function er(t, e, l) {
    ((Te[Ae++] = Ue), (Te[Ae++] = Ne), (Te[Ae++] = al), (al = t));
    var n = Ue;
    t = Ne;
    var a = 32 - se(n) - 1;
    ((n &= ~(1 << a)), (l += 1));
    var u = 32 - se(e) + a;
    if (30 < u) {
      var c = a - (a % 5);
      ((u = (n & ((1 << c) - 1)).toString(32)),
        (n >>= c),
        (a -= c),
        (Ue = (1 << (32 - se(e) + a)) | (l << a) | n),
        (Ne = u + t));
    } else ((Ue = (1 << u) | (l << a) | n), (Ne = t));
  }
  function Ki(t) {
    t.return !== null && (Ge(t, 1), er(t, 1, 0));
  }
  function Ji(t) {
    for (; t === cu; ) ((cu = sn[--dn]), (sn[dn] = null), (ea = sn[--dn]), (sn[dn] = null));
    for (; t === al; )
      ((al = Te[--Ae]),
        (Te[Ae] = null),
        (Ne = Te[--Ae]),
        (Te[Ae] = null),
        (Ue = Te[--Ae]),
        (Te[Ae] = null));
  }
  function lr(t, e) {
    ((Te[Ae++] = Ue), (Te[Ae++] = Ne), (Te[Ae++] = al), (Ue = e.id), (Ne = e.overflow), (al = t));
  }
  var kt = null,
    Ut = null,
    pt = !1,
    ul = null,
    xe = !1,
    $i = Error(f(519));
  function il(t) {
    var e = Error(
      f(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? 'text' : 'HTML', ''),
    );
    throw (la(ze(e, t)), $i);
  }
  function nr(t) {
    var e = t.stateNode,
      l = t.type,
      n = t.memoizedProps;
    switch (((e[$t] = t), (e[le] = n), l)) {
      case 'dialog':
        (vt('cancel', e), vt('close', e));
        break;
      case 'iframe':
      case 'object':
      case 'embed':
        vt('load', e);
        break;
      case 'video':
      case 'audio':
        for (l = 0; l < Aa.length; l++) vt(Aa[l], e);
        break;
      case 'source':
        vt('error', e);
        break;
      case 'img':
      case 'image':
      case 'link':
        (vt('error', e), vt('load', e));
        break;
      case 'details':
        vt('toggle', e);
        break;
      case 'input':
        (vt('invalid', e),
          yo(e, n.value, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name, !0));
        break;
      case 'select':
        vt('invalid', e);
        break;
      case 'textarea':
        (vt('invalid', e), bo(e, n.value, n.defaultValue, n.children));
    }
    ((l = n.children),
      (typeof l != 'string' && typeof l != 'number' && typeof l != 'bigint') ||
      e.textContent === '' + l ||
      n.suppressHydrationWarning === !0 ||
      Sd(e.textContent, l)
        ? (n.popover != null && (vt('beforetoggle', e), vt('toggle', e)),
          n.onScroll != null && vt('scroll', e),
          n.onScrollEnd != null && vt('scrollend', e),
          n.onClick != null && (e.onclick = we),
          (e = !0))
        : (e = !1),
      e || il(t, !0));
  }
  function ar(t) {
    for (kt = t.return; kt; )
      switch (kt.tag) {
        case 5:
        case 31:
        case 13:
          xe = !1;
          return;
        case 27:
        case 3:
          xe = !0;
          return;
        default:
          kt = kt.return;
      }
  }
  function mn(t) {
    if (t !== kt) return !1;
    if (!pt) return (ar(t), (pt = !0), !1);
    var e = t.tag,
      l;
    if (
      ((l = e !== 3 && e !== 27) &&
        ((l = e === 5) &&
          ((l = t.type), (l = !(l !== 'form' && l !== 'button') || mf(t.type, t.memoizedProps))),
        (l = !l)),
      l && Ut && il(t),
      ar(t),
      e === 13)
    ) {
      if (((t = t.memoizedState), (t = t !== null ? t.dehydrated : null), !t)) throw Error(f(317));
      Ut = Cd(t);
    } else if (e === 31) {
      if (((t = t.memoizedState), (t = t !== null ? t.dehydrated : null), !t)) throw Error(f(317));
      Ut = Cd(t);
    } else
      e === 27
        ? ((e = Ut), Sl(t.type) ? ((t = bf), (bf = null), (Ut = t)) : (Ut = e))
        : (Ut = kt ? _e(t.stateNode.nextSibling) : null);
    return !0;
  }
  function ql() {
    ((Ut = kt = null), (pt = !1));
  }
  function ki() {
    var t = ul;
    return (t !== null && (ce === null ? (ce = t) : ce.push.apply(ce, t), (ul = null)), t);
  }
  function la(t) {
    ul === null ? (ul = [t]) : ul.push(t);
  }
  var Wi = g(null),
    Yl = null,
    Le = null;
  function cl(t, e, l) {
    (B(Wi, e._currentValue), (e._currentValue = l));
  }
  function Xe(t) {
    ((t._currentValue = Wi.current), D(Wi));
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
  function Pi(t, e, l, n) {
    var a = t.child;
    for (a !== null && (a.return = t); a !== null; ) {
      var u = a.dependencies;
      if (u !== null) {
        var c = a.child;
        u = u.firstContext;
        t: for (; u !== null; ) {
          var r = u;
          u = a;
          for (var v = 0; v < e.length; v++)
            if (r.context === e[v]) {
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
  function hn(t, e, l, n) {
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
    (t !== null && Pi(e, t, l, n), (e.flags |= 262144));
  }
  function fu(t) {
    for (t = t.firstContext; t !== null; ) {
      if (!de(t.context._currentValue, t.memoizedValue)) return !0;
      t = t.next;
    }
    return !1;
  }
  function Gl(t) {
    ((Yl = t), (Le = null), (t = t.dependencies), t !== null && (t.firstContext = null));
  }
  function Wt(t) {
    return ur(Yl, t);
  }
  function ou(t, e) {
    return (Yl === null && Gl(t), ur(t, e));
  }
  function ur(t, e) {
    var l = e._currentValue;
    if (((e = { context: e, memoizedValue: l, next: null }), Le === null)) {
      if (t === null) throw Error(f(308));
      ((Le = e), (t.dependencies = { lanes: 0, firstContext: e }), (t.flags |= 524288));
    } else Le = Le.next = e;
    return l;
  }
  var l0 =
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
    n0 = i.unstable_scheduleCallback,
    a0 = i.unstable_NormalPriority,
    Lt = {
      $$typeof: V,
      Consumer: null,
      Provider: null,
      _currentValue: null,
      _currentValue2: null,
      _threadCount: 0,
    };
  function Ii() {
    return { controller: new l0(), data: new Map(), refCount: 0 };
  }
  function na(t) {
    (t.refCount--,
      t.refCount === 0 &&
        n0(a0, function () {
          t.controller.abort();
        }));
  }
  var aa = null,
    tc = 0,
    vn = 0,
    yn = null;
  function u0(t, e) {
    if (aa === null) {
      var l = (aa = []);
      ((tc = 0),
        (vn = nf()),
        (yn = {
          status: 'pending',
          value: void 0,
          then: function (n) {
            l.push(n);
          },
        }));
    }
    return (tc++, e.then(ir, ir), e);
  }
  function ir() {
    if (--tc === 0 && aa !== null) {
      yn !== null && (yn.status = 'fulfilled');
      var t = aa;
      ((aa = null), (vn = 0), (yn = null));
      for (var e = 0; e < t.length; e++) (0, t[e])();
    }
  }
  function i0(t, e) {
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
  var cr = M.S;
  M.S = function (t, e) {
    ((Vs = oe()),
      typeof e == 'object' && e !== null && typeof e.then == 'function' && u0(t, e),
      cr !== null && cr(t, e));
  };
  var Ll = g(null);
  function ec() {
    var t = Ll.current;
    return t !== null ? t : Rt.pooledCache;
  }
  function ru(t, e) {
    e === null ? B(Ll, Ll.current) : B(Ll, e.pool);
  }
  function fr() {
    var t = ec();
    return t === null ? null : { parent: Lt._currentValue, pool: t };
  }
  var gn = Error(f(460)),
    lc = Error(f(474)),
    su = Error(f(542)),
    du = { then: function () {} };
  function or(t) {
    return ((t = t.status), t === 'fulfilled' || t === 'rejected');
  }
  function rr(t, e, l) {
    switch (
      ((l = t[l]), l === void 0 ? t.push(e) : l !== e && (e.then(we, we), (e = l)), e.status)
    ) {
      case 'fulfilled':
        return e.value;
      case 'rejected':
        throw ((t = e.reason), dr(t), t);
      default:
        if (typeof e.status == 'string') e.then(we, we);
        else {
          if (((t = Rt), t !== null && 100 < t.shellSuspendCounter)) throw Error(f(482));
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
            throw ((t = e.reason), dr(t), t);
        }
        throw ((Ql = e), gn);
    }
  }
  function Xl(t) {
    try {
      var e = t._init;
      return e(t._payload);
    } catch (l) {
      throw l !== null && typeof l == 'object' && typeof l.then == 'function' ? ((Ql = l), gn) : l;
    }
  }
  var Ql = null;
  function sr() {
    if (Ql === null) throw Error(f(459));
    var t = Ql;
    return ((Ql = null), t);
  }
  function dr(t) {
    if (t === gn || t === su) throw Error(f(483));
  }
  var bn = null,
    ua = 0;
  function mu(t) {
    var e = ua;
    return ((ua += 1), bn === null && (bn = []), rr(bn, t, e));
  }
  function ia(t, e) {
    ((e = e.props.ref), (t.ref = e !== void 0 ? e : null));
  }
  function hu(t, e) {
    throw e.$$typeof === N
      ? Error(f(525))
      : ((t = Object.prototype.toString.call(e)),
        Error(
          f(
            31,
            t === '[object Object]' ? 'object with keys {' + Object.keys(e).join(', ') + '}' : t,
          ),
        ));
  }
  function mr(t) {
    function e(E, p) {
      if (t) {
        var T = E.deletions;
        T === null ? ((E.deletions = [p]), (E.flags |= 16)) : T.push(p);
      }
    }
    function l(E, p) {
      if (!t) return null;
      for (; p !== null; ) (e(E, p), (p = p.sibling));
      return null;
    }
    function n(E) {
      for (var p = new Map(); E !== null; )
        (E.key !== null ? p.set(E.key, E) : p.set(E.index, E), (E = E.sibling));
      return p;
    }
    function a(E, p) {
      return ((E = Ye(E, p)), (E.index = 0), (E.sibling = null), E);
    }
    function u(E, p, T) {
      return (
        (E.index = T),
        t
          ? ((T = E.alternate),
            T !== null
              ? ((T = T.index), T < p ? ((E.flags |= 67108866), p) : T)
              : ((E.flags |= 67108866), p))
          : ((E.flags |= 1048576), p)
      );
    }
    function c(E) {
      return (t && E.alternate === null && (E.flags |= 67108866), E);
    }
    function r(E, p, T, R) {
      return p === null || p.tag !== 6
        ? ((p = Vi(T, E.mode, R)), (p.return = E), p)
        : ((p = a(p, T)), (p.return = E), p);
    }
    function v(E, p, T, R) {
      var I = T.type;
      return I === Y
        ? C(E, p, T.props.children, R, T.key)
        : p !== null &&
            (p.elementType === I ||
              (typeof I == 'object' && I !== null && I.$$typeof === nt && Xl(I) === p.type))
          ? ((p = a(p, T.props)), ia(p, T), (p.return = E), p)
          : ((p = iu(T.type, T.key, T.props, null, E.mode, R)), ia(p, T), (p.return = E), p);
    }
    function A(E, p, T, R) {
      return p === null ||
        p.tag !== 4 ||
        p.stateNode.containerInfo !== T.containerInfo ||
        p.stateNode.implementation !== T.implementation
        ? ((p = Zi(T, E.mode, R)), (p.return = E), p)
        : ((p = a(p, T.children || [])), (p.return = E), p);
    }
    function C(E, p, T, R, I) {
      return p === null || p.tag !== 7
        ? ((p = wl(T, E.mode, R, I)), (p.return = E), p)
        : ((p = a(p, T)), (p.return = E), p);
    }
    function U(E, p, T) {
      if ((typeof p == 'string' && p !== '') || typeof p == 'number' || typeof p == 'bigint')
        return ((p = Vi('' + p, E.mode, T)), (p.return = E), p);
      if (typeof p == 'object' && p !== null) {
        switch (p.$$typeof) {
          case G:
            return ((T = iu(p.type, p.key, p.props, null, E.mode, T)), ia(T, p), (T.return = E), T);
          case k:
            return ((p = Zi(p, E.mode, T)), (p.return = E), p);
          case nt:
            return ((p = Xl(p)), U(E, p, T));
        }
        if (mt(p) || j(p)) return ((p = wl(p, E.mode, T, null)), (p.return = E), p);
        if (typeof p.then == 'function') return U(E, mu(p), T);
        if (p.$$typeof === V) return U(E, ou(E, p), T);
        hu(E, p);
      }
      return null;
    }
    function x(E, p, T, R) {
      var I = p !== null ? p.key : null;
      if ((typeof T == 'string' && T !== '') || typeof T == 'number' || typeof T == 'bigint')
        return I !== null ? null : r(E, p, '' + T, R);
      if (typeof T == 'object' && T !== null) {
        switch (T.$$typeof) {
          case G:
            return T.key === I ? v(E, p, T, R) : null;
          case k:
            return T.key === I ? A(E, p, T, R) : null;
          case nt:
            return ((T = Xl(T)), x(E, p, T, R));
        }
        if (mt(T) || j(T)) return I !== null ? null : C(E, p, T, R, null);
        if (typeof T.then == 'function') return x(E, p, mu(T), R);
        if (T.$$typeof === V) return x(E, p, ou(E, T), R);
        hu(E, T);
      }
      return null;
    }
    function _(E, p, T, R, I) {
      if ((typeof R == 'string' && R !== '') || typeof R == 'number' || typeof R == 'bigint')
        return ((E = E.get(T) || null), r(p, E, '' + R, I));
      if (typeof R == 'object' && R !== null) {
        switch (R.$$typeof) {
          case G:
            return ((E = E.get(R.key === null ? T : R.key) || null), v(p, E, R, I));
          case k:
            return ((E = E.get(R.key === null ? T : R.key) || null), A(p, E, R, I));
          case nt:
            return ((R = Xl(R)), _(E, p, T, R, I));
        }
        if (mt(R) || j(R)) return ((E = E.get(T) || null), C(p, E, R, I, null));
        if (typeof R.then == 'function') return _(E, p, T, mu(R), I);
        if (R.$$typeof === V) return _(E, p, T, ou(p, R), I);
        hu(p, R);
      }
      return null;
    }
    function $(E, p, T, R) {
      for (
        var I = null, zt = null, F = p, rt = (p = 0), gt = null;
        F !== null && rt < T.length;
        rt++
      ) {
        F.index > rt ? ((gt = F), (F = null)) : (gt = F.sibling);
        var Tt = x(E, F, T[rt], R);
        if (Tt === null) {
          F === null && (F = gt);
          break;
        }
        (t && F && Tt.alternate === null && e(E, F),
          (p = u(Tt, p, rt)),
          zt === null ? (I = Tt) : (zt.sibling = Tt),
          (zt = Tt),
          (F = gt));
      }
      if (rt === T.length) return (l(E, F), pt && Ge(E, rt), I);
      if (F === null) {
        for (; rt < T.length; rt++)
          ((F = U(E, T[rt], R)),
            F !== null && ((p = u(F, p, rt)), zt === null ? (I = F) : (zt.sibling = F), (zt = F)));
        return (pt && Ge(E, rt), I);
      }
      for (F = n(F); rt < T.length; rt++)
        ((gt = _(F, E, rt, T[rt], R)),
          gt !== null &&
            (t && gt.alternate !== null && F.delete(gt.key === null ? rt : gt.key),
            (p = u(gt, p, rt)),
            zt === null ? (I = gt) : (zt.sibling = gt),
            (zt = gt)));
      return (
        t &&
          F.forEach(function (xl) {
            return e(E, xl);
          }),
        pt && Ge(E, rt),
        I
      );
    }
    function et(E, p, T, R) {
      if (T == null) throw Error(f(151));
      for (
        var I = null, zt = null, F = p, rt = (p = 0), gt = null, Tt = T.next();
        F !== null && !Tt.done;
        rt++, Tt = T.next()
      ) {
        F.index > rt ? ((gt = F), (F = null)) : (gt = F.sibling);
        var xl = x(E, F, Tt.value, R);
        if (xl === null) {
          F === null && (F = gt);
          break;
        }
        (t && F && xl.alternate === null && e(E, F),
          (p = u(xl, p, rt)),
          zt === null ? (I = xl) : (zt.sibling = xl),
          (zt = xl),
          (F = gt));
      }
      if (Tt.done) return (l(E, F), pt && Ge(E, rt), I);
      if (F === null) {
        for (; !Tt.done; rt++, Tt = T.next())
          ((Tt = U(E, Tt.value, R)),
            Tt !== null &&
              ((p = u(Tt, p, rt)), zt === null ? (I = Tt) : (zt.sibling = Tt), (zt = Tt)));
        return (pt && Ge(E, rt), I);
      }
      for (F = n(F); !Tt.done; rt++, Tt = T.next())
        ((Tt = _(F, E, rt, Tt.value, R)),
          Tt !== null &&
            (t && Tt.alternate !== null && F.delete(Tt.key === null ? rt : Tt.key),
            (p = u(Tt, p, rt)),
            zt === null ? (I = Tt) : (zt.sibling = Tt),
            (zt = Tt)));
      return (
        t &&
          F.forEach(function (gv) {
            return e(E, gv);
          }),
        pt && Ge(E, rt),
        I
      );
    }
    function Dt(E, p, T, R) {
      if (
        (typeof T == 'object' &&
          T !== null &&
          T.type === Y &&
          T.key === null &&
          (T = T.props.children),
        typeof T == 'object' && T !== null)
      ) {
        switch (T.$$typeof) {
          case G:
            t: {
              for (var I = T.key; p !== null; ) {
                if (p.key === I) {
                  if (((I = T.type), I === Y)) {
                    if (p.tag === 7) {
                      (l(E, p.sibling), (R = a(p, T.props.children)), (R.return = E), (E = R));
                      break t;
                    }
                  } else if (
                    p.elementType === I ||
                    (typeof I == 'object' && I !== null && I.$$typeof === nt && Xl(I) === p.type)
                  ) {
                    (l(E, p.sibling), (R = a(p, T.props)), ia(R, T), (R.return = E), (E = R));
                    break t;
                  }
                  l(E, p);
                  break;
                } else e(E, p);
                p = p.sibling;
              }
              T.type === Y
                ? ((R = wl(T.props.children, E.mode, R, T.key)), (R.return = E), (E = R))
                : ((R = iu(T.type, T.key, T.props, null, E.mode, R)),
                  ia(R, T),
                  (R.return = E),
                  (E = R));
            }
            return c(E);
          case k:
            t: {
              for (I = T.key; p !== null; ) {
                if (p.key === I)
                  if (
                    p.tag === 4 &&
                    p.stateNode.containerInfo === T.containerInfo &&
                    p.stateNode.implementation === T.implementation
                  ) {
                    (l(E, p.sibling), (R = a(p, T.children || [])), (R.return = E), (E = R));
                    break t;
                  } else {
                    l(E, p);
                    break;
                  }
                else e(E, p);
                p = p.sibling;
              }
              ((R = Zi(T, E.mode, R)), (R.return = E), (E = R));
            }
            return c(E);
          case nt:
            return ((T = Xl(T)), Dt(E, p, T, R));
        }
        if (mt(T)) return $(E, p, T, R);
        if (j(T)) {
          if (((I = j(T)), typeof I != 'function')) throw Error(f(150));
          return ((T = I.call(T)), et(E, p, T, R));
        }
        if (typeof T.then == 'function') return Dt(E, p, mu(T), R);
        if (T.$$typeof === V) return Dt(E, p, ou(E, T), R);
        hu(E, T);
      }
      return (typeof T == 'string' && T !== '') || typeof T == 'number' || typeof T == 'bigint'
        ? ((T = '' + T),
          p !== null && p.tag === 6
            ? (l(E, p.sibling), (R = a(p, T)), (R.return = E), (E = R))
            : (l(E, p), (R = Vi(T, E.mode, R)), (R.return = E), (E = R)),
          c(E))
        : l(E, p);
    }
    return function (E, p, T, R) {
      try {
        ua = 0;
        var I = Dt(E, p, T, R);
        return ((bn = null), I);
      } catch (F) {
        if (F === gn || F === su) throw F;
        var zt = me(29, F, null, E.mode);
        return ((zt.lanes = R), (zt.return = E), zt);
      } finally {
      }
    };
  }
  var Vl = mr(!0),
    hr = mr(!1),
    fl = !1;
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
  function ol(t) {
    return { lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function rl(t, e, l) {
    var n = t.updateQueue;
    if (n === null) return null;
    if (((n = n.shared), (xt & 2) !== 0)) {
      var a = n.pending;
      return (
        a === null ? (e.next = e) : ((e.next = a.next), (a.next = e)),
        (n.pending = e),
        (e = uu(t)),
        Fo(t, null, l),
        e
      );
    }
    return (au(t, n, e, l), uu(t));
  }
  function ca(t, e, l) {
    if (((e = e.updateQueue), e !== null && ((e = e.shared), (l & 4194048) !== 0))) {
      var n = e.lanes;
      ((n &= t.pendingLanes), (l |= n), (e.lanes = l), ao(t, l));
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
  function fa() {
    if (ic) {
      var t = yn;
      if (t !== null) throw t;
    }
  }
  function oa(t, e, l, n) {
    ic = !1;
    var a = t.updateQueue;
    fl = !1;
    var u = a.firstBaseUpdate,
      c = a.lastBaseUpdate,
      r = a.shared.pending;
    if (r !== null) {
      a.shared.pending = null;
      var v = r,
        A = v.next;
      ((v.next = null), c === null ? (u = A) : (c.next = A), (c = v));
      var C = t.alternate;
      C !== null &&
        ((C = C.updateQueue),
        (r = C.lastBaseUpdate),
        r !== c && (r === null ? (C.firstBaseUpdate = A) : (r.next = A), (C.lastBaseUpdate = v)));
    }
    if (u !== null) {
      var U = a.baseState;
      ((c = 0), (C = A = v = null), (r = u));
      do {
        var x = r.lane & -536870913,
          _ = x !== r.lane;
        if (_ ? (yt & x) === x : (n & x) === x) {
          (x !== 0 && x === vn && (ic = !0),
            C !== null &&
              (C = C.next =
                { lane: 0, tag: r.tag, payload: r.payload, callback: null, next: null }));
          t: {
            var $ = t,
              et = r;
            x = e;
            var Dt = l;
            switch (et.tag) {
              case 1:
                if ((($ = et.payload), typeof $ == 'function')) {
                  U = $.call(Dt, U, x);
                  break t;
                }
                U = $;
                break t;
              case 3:
                $.flags = ($.flags & -65537) | 128;
              case 0:
                if (
                  (($ = et.payload), (x = typeof $ == 'function' ? $.call(Dt, U, x) : $), x == null)
                )
                  break t;
                U = z({}, U, x);
                break t;
              case 2:
                fl = !0;
            }
          }
          ((x = r.callback),
            x !== null &&
              ((t.flags |= 64),
              _ && (t.flags |= 8192),
              (_ = a.callbacks),
              _ === null ? (a.callbacks = [x]) : _.push(x)));
        } else
          ((_ = { lane: x, tag: r.tag, payload: r.payload, callback: r.callback, next: null }),
            C === null ? ((A = C = _), (v = U)) : (C = C.next = _),
            (c |= x));
        if (((r = r.next), r === null)) {
          if (((r = a.shared.pending), r === null)) break;
          ((_ = r),
            (r = _.next),
            (_.next = null),
            (a.lastBaseUpdate = _),
            (a.shared.pending = null));
        }
      } while (!0);
      (C === null && (v = U),
        (a.baseState = v),
        (a.firstBaseUpdate = A),
        (a.lastBaseUpdate = C),
        u === null && (a.shared.lanes = 0),
        (vl |= c),
        (t.lanes = c),
        (t.memoizedState = U));
    }
  }
  function vr(t, e) {
    if (typeof t != 'function') throw Error(f(191, t));
    t.call(e);
  }
  function yr(t, e) {
    var l = t.callbacks;
    if (l !== null) for (t.callbacks = null, t = 0; t < l.length; t++) vr(l[t], e);
  }
  var pn = g(null),
    vu = g(0);
  function gr(t, e) {
    ((t = Fe), B(vu, t), B(pn, e), (Fe = t | e.baseLanes));
  }
  function cc() {
    (B(vu, Fe), B(pn, pn.current));
  }
  function fc() {
    ((Fe = vu.current), D(pn), D(vu));
  }
  var he = g(null),
    Me = null;
  function sl(t) {
    var e = t.alternate;
    (B(Yt, Yt.current & 1),
      B(he, t),
      Me === null && (e === null || pn.current !== null || e.memoizedState !== null) && (Me = t));
  }
  function oc(t) {
    (B(Yt, Yt.current), B(he, t), Me === null && (Me = t));
  }
  function br(t) {
    t.tag === 22 ? (B(Yt, Yt.current), B(he, t), Me === null && (Me = t)) : dl();
  }
  function dl() {
    (B(Yt, Yt.current), B(he, he.current));
  }
  function ve(t) {
    (D(he), Me === t && (Me = null), D(Yt));
  }
  var Yt = g(0);
  function yu(t) {
    for (var e = t; e !== null; ) {
      if (e.tag === 13) {
        var l = e.memoizedState;
        if (l !== null && ((l = l.dehydrated), l === null || yf(l) || gf(l))) return e;
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
  var Qe = 0,
    ot = null,
    Ot = null,
    Xt = null,
    gu = !1,
    Sn = !1,
    Zl = !1,
    bu = 0,
    ra = 0,
    En = null,
    c0 = 0;
  function Bt() {
    throw Error(f(321));
  }
  function rc(t, e) {
    if (e === null) return !1;
    for (var l = 0; l < e.length && l < t.length; l++) if (!de(t[l], e[l])) return !1;
    return !0;
  }
  function sc(t, e, l, n, a, u) {
    return (
      (Qe = u),
      (ot = e),
      (e.memoizedState = null),
      (e.updateQueue = null),
      (e.lanes = 0),
      (M.H = t === null || t.memoizedState === null ? es : Mc),
      (Zl = !1),
      (u = l(n, a)),
      (Zl = !1),
      Sn && (u = Sr(e, l, n, a)),
      pr(t),
      u
    );
  }
  function pr(t) {
    M.H = ma;
    var e = Ot !== null && Ot.next !== null;
    if (((Qe = 0), (Xt = Ot = ot = null), (gu = !1), (ra = 0), (En = null), e)) throw Error(f(300));
    t === null || Qt || ((t = t.dependencies), t !== null && fu(t) && (Qt = !0));
  }
  function Sr(t, e, l, n) {
    ot = t;
    var a = 0;
    do {
      if ((Sn && (En = null), (ra = 0), (Sn = !1), 25 <= a)) throw Error(f(301));
      if (((a += 1), (Xt = Ot = null), t.updateQueue != null)) {
        var u = t.updateQueue;
        ((u.lastEffect = null),
          (u.events = null),
          (u.stores = null),
          u.memoCache != null && (u.memoCache.index = 0));
      }
      ((M.H = ls), (u = e(l, n)));
    } while (Sn);
    return u;
  }
  function f0() {
    var t = M.H,
      e = t.useState()[0];
    return (
      (e = typeof e.then == 'function' ? sa(e) : e),
      (t = t.useState()[0]),
      (Ot !== null ? Ot.memoizedState : null) !== t && (ot.flags |= 1024),
      e
    );
  }
  function dc() {
    var t = bu !== 0;
    return ((bu = 0), t);
  }
  function mc(t, e, l) {
    ((e.updateQueue = t.updateQueue), (e.flags &= -2053), (t.lanes &= ~l));
  }
  function hc(t) {
    if (gu) {
      for (t = t.memoizedState; t !== null; ) {
        var e = t.queue;
        (e !== null && (e.pending = null), (t = t.next));
      }
      gu = !1;
    }
    ((Qe = 0), (Xt = Ot = ot = null), (Sn = !1), (ra = bu = 0), (En = null));
  }
  function ee() {
    var t = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return (Xt === null ? (ot.memoizedState = Xt = t) : (Xt = Xt.next = t), Xt);
  }
  function Gt() {
    if (Ot === null) {
      var t = ot.alternate;
      t = t !== null ? t.memoizedState : null;
    } else t = Ot.next;
    var e = Xt === null ? ot.memoizedState : Xt.next;
    if (e !== null) ((Xt = e), (Ot = t));
    else {
      if (t === null) throw ot.alternate === null ? Error(f(467)) : Error(f(310));
      ((Ot = t),
        (t = {
          memoizedState: Ot.memoizedState,
          baseState: Ot.baseState,
          baseQueue: Ot.baseQueue,
          queue: Ot.queue,
          next: null,
        }),
        Xt === null ? (ot.memoizedState = Xt = t) : (Xt = Xt.next = t));
    }
    return Xt;
  }
  function pu() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function sa(t) {
    var e = ra;
    return (
      (ra += 1),
      En === null && (En = []),
      (t = rr(En, t, e)),
      (e = ot),
      (Xt === null ? e.memoizedState : Xt.next) === null &&
        ((e = e.alternate), (M.H = e === null || e.memoizedState === null ? es : Mc)),
      t
    );
  }
  function Su(t) {
    if (t !== null && typeof t == 'object') {
      if (typeof t.then == 'function') return sa(t);
      if (t.$$typeof === V) return Wt(t);
    }
    throw Error(f(438, String(t)));
  }
  function vc(t) {
    var e = null,
      l = ot.updateQueue;
    if ((l !== null && (e = l.memoCache), e == null)) {
      var n = ot.alternate;
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
      l === null && ((l = pu()), (ot.updateQueue = l)),
      (l.memoCache = e),
      (l = e.data[e.index]),
      l === void 0)
    )
      for (l = e.data[e.index] = Array(t), n = 0; n < t; n++) l[n] = Et;
    return (e.index++, l);
  }
  function Ve(t, e) {
    return typeof e == 'function' ? e(t) : e;
  }
  function Eu(t) {
    var e = Gt();
    return yc(e, Ot, t);
  }
  function yc(t, e, l) {
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
        v = null,
        A = e,
        C = !1;
      do {
        var U = A.lane & -536870913;
        if (U !== A.lane ? (yt & U) === U : (Qe & U) === U) {
          var x = A.revertLane;
          if (x === 0)
            (v !== null &&
              (v = v.next =
                {
                  lane: 0,
                  revertLane: 0,
                  gesture: null,
                  action: A.action,
                  hasEagerState: A.hasEagerState,
                  eagerState: A.eagerState,
                  next: null,
                }),
              U === vn && (C = !0));
          else if ((Qe & x) === x) {
            ((A = A.next), x === vn && (C = !0));
            continue;
          } else
            ((U = {
              lane: 0,
              revertLane: A.revertLane,
              gesture: null,
              action: A.action,
              hasEagerState: A.hasEagerState,
              eagerState: A.eagerState,
              next: null,
            }),
              v === null ? ((r = v = U), (c = u)) : (v = v.next = U),
              (ot.lanes |= x),
              (vl |= x));
          ((U = A.action), Zl && l(u, U), (u = A.hasEagerState ? A.eagerState : l(u, U)));
        } else
          ((x = {
            lane: U,
            revertLane: A.revertLane,
            gesture: A.gesture,
            action: A.action,
            hasEagerState: A.hasEagerState,
            eagerState: A.eagerState,
            next: null,
          }),
            v === null ? ((r = v = x), (c = u)) : (v = v.next = x),
            (ot.lanes |= U),
            (vl |= U));
        A = A.next;
      } while (A !== null && A !== e);
      if (
        (v === null ? (c = u) : (v.next = r),
        !de(u, t.memoizedState) && ((Qt = !0), C && ((l = yn), l !== null)))
      )
        throw l;
      ((t.memoizedState = u), (t.baseState = c), (t.baseQueue = v), (n.lastRenderedState = u));
    }
    return (a === null && (n.lanes = 0), [t.memoizedState, n.dispatch]);
  }
  function gc(t) {
    var e = Gt(),
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
      (de(u, e.memoizedState) || (Qt = !0),
        (e.memoizedState = u),
        e.baseQueue === null && (e.baseState = u),
        (l.lastRenderedState = u));
    }
    return [u, n];
  }
  function Er(t, e, l) {
    var n = ot,
      a = Gt(),
      u = pt;
    if (u) {
      if (l === void 0) throw Error(f(407));
      l = l();
    } else l = e();
    var c = !de((Ot || a).memoizedState, l);
    if (
      (c && ((a.memoizedState = l), (Qt = !0)),
      (a = a.queue),
      Sc(Ar.bind(null, n, a, t), [t]),
      a.getSnapshot !== e || c || (Xt !== null && Xt.memoizedState.tag & 1))
    ) {
      if (
        ((n.flags |= 2048),
        zn(9, { destroy: void 0 }, Tr.bind(null, n, a, l, e), null),
        Rt === null)
      )
        throw Error(f(349));
      u || (Qe & 127) !== 0 || zr(n, e, l);
    }
    return l;
  }
  function zr(t, e, l) {
    ((t.flags |= 16384),
      (t = { getSnapshot: e, value: l }),
      (e = ot.updateQueue),
      e === null
        ? ((e = pu()), (ot.updateQueue = e), (e.stores = [t]))
        : ((l = e.stores), l === null ? (e.stores = [t]) : l.push(t)));
  }
  function Tr(t, e, l, n) {
    ((e.value = l), (e.getSnapshot = n), xr(e) && Mr(t));
  }
  function Ar(t, e, l) {
    return l(function () {
      xr(e) && Mr(t);
    });
  }
  function xr(t) {
    var e = t.getSnapshot;
    t = t.value;
    try {
      var l = e();
      return !de(t, l);
    } catch {
      return !0;
    }
  }
  function Mr(t) {
    var e = Bl(t, 2);
    e !== null && fe(e, t, 2);
  }
  function bc(t) {
    var e = ee();
    if (typeof t == 'function') {
      var l = t;
      if (((t = l()), Zl)) {
        el(!0);
        try {
          l();
        } finally {
          el(!1);
        }
      }
    }
    return (
      (e.memoizedState = e.baseState = t),
      (e.queue = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Ve,
        lastRenderedState: t,
      }),
      e
    );
  }
  function _r(t, e, l, n) {
    return ((t.baseState = l), yc(t, Ot, typeof n == 'function' ? n : Ve));
  }
  function o0(t, e, l, n, a) {
    if (Au(t)) throw Error(f(485));
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
      (M.T !== null ? l(!0) : (u.isTransition = !1),
        n(u),
        (l = e.pending),
        l === null
          ? ((u.next = e.pending = u), Or(e, u))
          : ((u.next = l.next), (e.pending = l.next = u)));
    }
  }
  function Or(t, e) {
    var l = e.action,
      n = e.payload,
      a = t.state;
    if (e.isTransition) {
      var u = M.T,
        c = {};
      M.T = c;
      try {
        var r = l(a, n),
          v = M.S;
        (v !== null && v(c, r), Cr(t, e, r));
      } catch (A) {
        pc(t, e, A);
      } finally {
        (u !== null && c.types !== null && (u.types = c.types), (M.T = u));
      }
    } else
      try {
        ((u = l(a, n)), Cr(t, e, u));
      } catch (A) {
        pc(t, e, A);
      }
  }
  function Cr(t, e, l) {
    l !== null && typeof l == 'object' && typeof l.then == 'function'
      ? l.then(
          function (n) {
            Dr(t, e, n);
          },
          function (n) {
            return pc(t, e, n);
          },
        )
      : Dr(t, e, l);
  }
  function Dr(t, e, l) {
    ((e.status = 'fulfilled'),
      (e.value = l),
      Rr(e),
      (t.state = l),
      (e = t.pending),
      e !== null &&
        ((l = e.next), l === e ? (t.pending = null) : ((l = l.next), (e.next = l), Or(t, l))));
  }
  function pc(t, e, l) {
    var n = t.pending;
    if (((t.pending = null), n !== null)) {
      n = n.next;
      do ((e.status = 'rejected'), (e.reason = l), Rr(e), (e = e.next));
      while (e !== n);
    }
    t.action = null;
  }
  function Rr(t) {
    t = t.listeners;
    for (var e = 0; e < t.length; e++) (0, t[e])();
  }
  function Ur(t, e) {
    return e;
  }
  function Nr(t, e) {
    if (pt) {
      var l = Rt.formState;
      if (l !== null) {
        t: {
          var n = ot;
          if (pt) {
            if (Ut) {
              e: {
                for (var a = Ut, u = xe; a.nodeType !== 8; ) {
                  if (!u) {
                    a = null;
                    break e;
                  }
                  if (((a = _e(a.nextSibling)), a === null)) {
                    a = null;
                    break e;
                  }
                }
                ((u = a.data), (a = u === 'F!' || u === 'F' ? a : null));
              }
              if (a) {
                ((Ut = _e(a.nextSibling)), (n = a.data === 'F!'));
                break t;
              }
            }
            il(n);
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
        lastRenderedReducer: Ur,
        lastRenderedState: e,
      }),
      (l.queue = n),
      (l = Pr.bind(null, ot, n)),
      (n.dispatch = l),
      (n = bc(!1)),
      (u = xc.bind(null, ot, !1, n.queue)),
      (n = ee()),
      (a = { state: e, dispatch: null, action: t, pending: null }),
      (n.queue = a),
      (l = o0.bind(null, ot, a, u, l)),
      (a.dispatch = l),
      (n.memoizedState = t),
      [e, l, !1]
    );
  }
  function jr(t) {
    var e = Gt();
    return Hr(e, Ot, t);
  }
  function Hr(t, e, l) {
    if (
      ((e = yc(t, e, Ur)[0]),
      (t = Eu(Ve)[0]),
      typeof e == 'object' && e !== null && typeof e.then == 'function')
    )
      try {
        var n = sa(e);
      } catch (c) {
        throw c === gn ? su : c;
      }
    else n = e;
    e = Gt();
    var a = e.queue,
      u = a.dispatch;
    return (
      l !== e.memoizedState &&
        ((ot.flags |= 2048), zn(9, { destroy: void 0 }, r0.bind(null, a, l), null)),
      [n, u, t]
    );
  }
  function r0(t, e) {
    t.action = e;
  }
  function Br(t) {
    var e = Gt(),
      l = Ot;
    if (l !== null) return Hr(e, l, t);
    (Gt(), (e = e.memoizedState), (l = Gt()));
    var n = l.queue.dispatch;
    return ((l.memoizedState = t), [e, n, !1]);
  }
  function zn(t, e, l, n) {
    return (
      (t = { tag: t, create: l, deps: n, inst: e, next: null }),
      (e = ot.updateQueue),
      e === null && ((e = pu()), (ot.updateQueue = e)),
      (l = e.lastEffect),
      l === null
        ? (e.lastEffect = t.next = t)
        : ((n = l.next), (l.next = t), (t.next = n), (e.lastEffect = t)),
      t
    );
  }
  function wr() {
    return Gt().memoizedState;
  }
  function zu(t, e, l, n) {
    var a = ee();
    ((ot.flags |= t),
      (a.memoizedState = zn(1 | e, { destroy: void 0 }, l, n === void 0 ? null : n)));
  }
  function Tu(t, e, l, n) {
    var a = Gt();
    n = n === void 0 ? null : n;
    var u = a.memoizedState.inst;
    Ot !== null && n !== null && rc(n, Ot.memoizedState.deps)
      ? (a.memoizedState = zn(e, u, l, n))
      : ((ot.flags |= t), (a.memoizedState = zn(1 | e, u, l, n)));
  }
  function qr(t, e) {
    zu(8390656, 8, t, e);
  }
  function Sc(t, e) {
    Tu(2048, 8, t, e);
  }
  function s0(t) {
    ot.flags |= 4;
    var e = ot.updateQueue;
    if (e === null) ((e = pu()), (ot.updateQueue = e), (e.events = [t]));
    else {
      var l = e.events;
      l === null ? (e.events = [t]) : l.push(t);
    }
  }
  function Yr(t) {
    var e = Gt().memoizedState;
    return (
      s0({ ref: e, nextImpl: t }),
      function () {
        if ((xt & 2) !== 0) throw Error(f(440));
        return e.impl.apply(void 0, arguments);
      }
    );
  }
  function Gr(t, e) {
    return Tu(4, 2, t, e);
  }
  function Lr(t, e) {
    return Tu(4, 4, t, e);
  }
  function Xr(t, e) {
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
  function Qr(t, e, l) {
    ((l = l != null ? l.concat([t]) : null), Tu(4, 4, Xr.bind(null, e, t), l));
  }
  function Ec() {}
  function Vr(t, e) {
    var l = Gt();
    e = e === void 0 ? null : e;
    var n = l.memoizedState;
    return e !== null && rc(e, n[1]) ? n[0] : ((l.memoizedState = [t, e]), t);
  }
  function Zr(t, e) {
    var l = Gt();
    e = e === void 0 ? null : e;
    var n = l.memoizedState;
    if (e !== null && rc(e, n[1])) return n[0];
    if (((n = t()), Zl)) {
      el(!0);
      try {
        t();
      } finally {
        el(!1);
      }
    }
    return ((l.memoizedState = [n, e]), n);
  }
  function zc(t, e, l) {
    return l === void 0 || ((Qe & 1073741824) !== 0 && (yt & 261930) === 0)
      ? (t.memoizedState = e)
      : ((t.memoizedState = l), (t = Ks()), (ot.lanes |= t), (vl |= t), l);
  }
  function Kr(t, e, l, n) {
    return de(l, e)
      ? l
      : pn.current !== null
        ? ((t = zc(t, l, n)), de(t, e) || (Qt = !0), t)
        : (Qe & 42) === 0 || ((Qe & 1073741824) !== 0 && (yt & 261930) === 0)
          ? ((Qt = !0), (t.memoizedState = l))
          : ((t = Ks()), (ot.lanes |= t), (vl |= t), e);
  }
  function Jr(t, e, l, n, a) {
    var u = H.p;
    H.p = u !== 0 && 8 > u ? u : 8;
    var c = M.T,
      r = {};
    ((M.T = r), xc(t, !1, e, l));
    try {
      var v = a(),
        A = M.S;
      if (
        (A !== null && A(r, v), v !== null && typeof v == 'object' && typeof v.then == 'function')
      ) {
        var C = i0(v, n);
        da(t, e, C, be(t));
      } else da(t, e, n, be(t));
    } catch (U) {
      da(t, e, { then: function () {}, status: 'rejected', reason: U }, be());
    } finally {
      ((H.p = u), c !== null && r.types !== null && (c.types = r.types), (M.T = c));
    }
  }
  function d0() {}
  function Tc(t, e, l, n) {
    if (t.tag !== 5) throw Error(f(476));
    var a = $r(t).queue;
    Jr(
      t,
      a,
      e,
      W,
      l === null
        ? d0
        : function () {
            return (kr(t), l(n));
          },
    );
  }
  function $r(t) {
    var e = t.memoizedState;
    if (e !== null) return e;
    e = {
      memoizedState: W,
      baseState: W,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Ve,
        lastRenderedState: W,
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
          lastRenderedReducer: Ve,
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
  function kr(t) {
    var e = $r(t);
    (e.next === null && (e = t.alternate.memoizedState), da(t, e.next.queue, {}, be()));
  }
  function Ac() {
    return Wt(Ca);
  }
  function Wr() {
    return Gt().memoizedState;
  }
  function Fr() {
    return Gt().memoizedState;
  }
  function m0(t) {
    for (var e = t.return; e !== null; ) {
      switch (e.tag) {
        case 24:
        case 3:
          var l = be();
          t = ol(l);
          var n = rl(e, t, l);
          (n !== null && (fe(n, e, l), ca(n, e, l)), (e = { cache: Ii() }), (t.payload = e));
          return;
      }
      e = e.return;
    }
  }
  function h0(t, e, l) {
    var n = be();
    ((l = {
      lane: n,
      revertLane: 0,
      gesture: null,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    }),
      Au(t) ? Ir(e, l) : ((l = Xi(t, e, l, n)), l !== null && (fe(l, t, n), ts(l, e, n))));
  }
  function Pr(t, e, l) {
    var n = be();
    da(t, e, l, n);
  }
  function da(t, e, l, n) {
    var a = {
      lane: n,
      revertLane: 0,
      gesture: null,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    };
    if (Au(t)) Ir(e, a);
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
            return (au(t, e, a, 0), Rt === null && nu(), !1);
        } catch {
        } finally {
        }
      if (((l = Xi(t, e, a, n)), l !== null)) return (fe(l, t, n), ts(l, e, n), !0);
    }
    return !1;
  }
  function xc(t, e, l, n) {
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
      Au(t))
    ) {
      if (e) throw Error(f(479));
    } else ((e = Xi(t, l, n, 2)), e !== null && fe(e, t, 2));
  }
  function Au(t) {
    var e = t.alternate;
    return t === ot || (e !== null && e === ot);
  }
  function Ir(t, e) {
    Sn = gu = !0;
    var l = t.pending;
    (l === null ? (e.next = e) : ((e.next = l.next), (l.next = e)), (t.pending = e));
  }
  function ts(t, e, l) {
    if ((l & 4194048) !== 0) {
      var n = e.lanes;
      ((n &= t.pendingLanes), (l |= n), (e.lanes = l), ao(t, l));
    }
  }
  var ma = {
    readContext: Wt,
    use: Su,
    useCallback: Bt,
    useContext: Bt,
    useEffect: Bt,
    useImperativeHandle: Bt,
    useLayoutEffect: Bt,
    useInsertionEffect: Bt,
    useMemo: Bt,
    useReducer: Bt,
    useRef: Bt,
    useState: Bt,
    useDebugValue: Bt,
    useDeferredValue: Bt,
    useTransition: Bt,
    useSyncExternalStore: Bt,
    useId: Bt,
    useHostTransitionStatus: Bt,
    useFormState: Bt,
    useActionState: Bt,
    useOptimistic: Bt,
    useMemoCache: Bt,
    useCacheRefresh: Bt,
  };
  ma.useEffectEvent = Bt;
  var es = {
      readContext: Wt,
      use: Su,
      useCallback: function (t, e) {
        return ((ee().memoizedState = [t, e === void 0 ? null : e]), t);
      },
      useContext: Wt,
      useEffect: qr,
      useImperativeHandle: function (t, e, l) {
        ((l = l != null ? l.concat([t]) : null), zu(4194308, 4, Xr.bind(null, e, t), l));
      },
      useLayoutEffect: function (t, e) {
        return zu(4194308, 4, t, e);
      },
      useInsertionEffect: function (t, e) {
        zu(4, 2, t, e);
      },
      useMemo: function (t, e) {
        var l = ee();
        e = e === void 0 ? null : e;
        var n = t();
        if (Zl) {
          el(!0);
          try {
            t();
          } finally {
            el(!1);
          }
        }
        return ((l.memoizedState = [n, e]), n);
      },
      useReducer: function (t, e, l) {
        var n = ee();
        if (l !== void 0) {
          var a = l(e);
          if (Zl) {
            el(!0);
            try {
              l(e);
            } finally {
              el(!1);
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
          (t = t.dispatch = h0.bind(null, ot, t)),
          [n.memoizedState, t]
        );
      },
      useRef: function (t) {
        var e = ee();
        return ((t = { current: t }), (e.memoizedState = t));
      },
      useState: function (t) {
        t = bc(t);
        var e = t.queue,
          l = Pr.bind(null, ot, e);
        return ((e.dispatch = l), [t.memoizedState, l]);
      },
      useDebugValue: Ec,
      useDeferredValue: function (t, e) {
        var l = ee();
        return zc(l, t, e);
      },
      useTransition: function () {
        var t = bc(!1);
        return ((t = Jr.bind(null, ot, t.queue, !0, !1)), (ee().memoizedState = t), [!1, t]);
      },
      useSyncExternalStore: function (t, e, l) {
        var n = ot,
          a = ee();
        if (pt) {
          if (l === void 0) throw Error(f(407));
          l = l();
        } else {
          if (((l = e()), Rt === null)) throw Error(f(349));
          (yt & 127) !== 0 || zr(n, e, l);
        }
        a.memoizedState = l;
        var u = { value: l, getSnapshot: e };
        return (
          (a.queue = u),
          qr(Ar.bind(null, n, u, t), [t]),
          (n.flags |= 2048),
          zn(9, { destroy: void 0 }, Tr.bind(null, n, u, l, e), null),
          l
        );
      },
      useId: function () {
        var t = ee(),
          e = Rt.identifierPrefix;
        if (pt) {
          var l = Ne,
            n = Ue;
          ((l = (n & ~(1 << (32 - se(n) - 1))).toString(32) + l),
            (e = '_' + e + 'R_' + l),
            (l = bu++),
            0 < l && (e += 'H' + l.toString(32)),
            (e += '_'));
        } else ((l = c0++), (e = '_' + e + 'r_' + l.toString(32) + '_'));
        return (t.memoizedState = e);
      },
      useHostTransitionStatus: Ac,
      useFormState: Nr,
      useActionState: Nr,
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
        return ((e.queue = l), (e = xc.bind(null, ot, !0, l)), (l.dispatch = e), [t, e]);
      },
      useMemoCache: vc,
      useCacheRefresh: function () {
        return (ee().memoizedState = m0.bind(null, ot));
      },
      useEffectEvent: function (t) {
        var e = ee(),
          l = { impl: t };
        return (
          (e.memoizedState = l),
          function () {
            if ((xt & 2) !== 0) throw Error(f(440));
            return l.impl.apply(void 0, arguments);
          }
        );
      },
    },
    Mc = {
      readContext: Wt,
      use: Su,
      useCallback: Vr,
      useContext: Wt,
      useEffect: Sc,
      useImperativeHandle: Qr,
      useInsertionEffect: Gr,
      useLayoutEffect: Lr,
      useMemo: Zr,
      useReducer: Eu,
      useRef: wr,
      useState: function () {
        return Eu(Ve);
      },
      useDebugValue: Ec,
      useDeferredValue: function (t, e) {
        var l = Gt();
        return Kr(l, Ot.memoizedState, t, e);
      },
      useTransition: function () {
        var t = Eu(Ve)[0],
          e = Gt().memoizedState;
        return [typeof t == 'boolean' ? t : sa(t), e];
      },
      useSyncExternalStore: Er,
      useId: Wr,
      useHostTransitionStatus: Ac,
      useFormState: jr,
      useActionState: jr,
      useOptimistic: function (t, e) {
        var l = Gt();
        return _r(l, Ot, t, e);
      },
      useMemoCache: vc,
      useCacheRefresh: Fr,
    };
  Mc.useEffectEvent = Yr;
  var ls = {
    readContext: Wt,
    use: Su,
    useCallback: Vr,
    useContext: Wt,
    useEffect: Sc,
    useImperativeHandle: Qr,
    useInsertionEffect: Gr,
    useLayoutEffect: Lr,
    useMemo: Zr,
    useReducer: gc,
    useRef: wr,
    useState: function () {
      return gc(Ve);
    },
    useDebugValue: Ec,
    useDeferredValue: function (t, e) {
      var l = Gt();
      return Ot === null ? zc(l, t, e) : Kr(l, Ot.memoizedState, t, e);
    },
    useTransition: function () {
      var t = gc(Ve)[0],
        e = Gt().memoizedState;
      return [typeof t == 'boolean' ? t : sa(t), e];
    },
    useSyncExternalStore: Er,
    useId: Wr,
    useHostTransitionStatus: Ac,
    useFormState: Br,
    useActionState: Br,
    useOptimistic: function (t, e) {
      var l = Gt();
      return Ot !== null ? _r(l, Ot, t, e) : ((l.baseState = t), [t, l.queue.dispatch]);
    },
    useMemoCache: vc,
    useCacheRefresh: Fr,
  };
  ls.useEffectEvent = Yr;
  function _c(t, e, l, n) {
    ((e = t.memoizedState),
      (l = l(n, e)),
      (l = l == null ? e : z({}, e, l)),
      (t.memoizedState = l),
      t.lanes === 0 && (t.updateQueue.baseState = l));
  }
  var Oc = {
    enqueueSetState: function (t, e, l) {
      t = t._reactInternals;
      var n = be(),
        a = ol(n);
      ((a.payload = e),
        l != null && (a.callback = l),
        (e = rl(t, a, n)),
        e !== null && (fe(e, t, n), ca(e, t, n)));
    },
    enqueueReplaceState: function (t, e, l) {
      t = t._reactInternals;
      var n = be(),
        a = ol(n);
      ((a.tag = 1),
        (a.payload = e),
        l != null && (a.callback = l),
        (e = rl(t, a, n)),
        e !== null && (fe(e, t, n), ca(e, t, n)));
    },
    enqueueForceUpdate: function (t, e) {
      t = t._reactInternals;
      var l = be(),
        n = ol(l);
      ((n.tag = 2),
        e != null && (n.callback = e),
        (e = rl(t, n, l)),
        e !== null && (fe(e, t, l), ca(e, t, l)));
    },
  };
  function ns(t, e, l, n, a, u, c) {
    return (
      (t = t.stateNode),
      typeof t.shouldComponentUpdate == 'function'
        ? t.shouldComponentUpdate(n, u, c)
        : e.prototype && e.prototype.isPureReactComponent
          ? !In(l, n) || !In(a, u)
          : !0
    );
  }
  function as(t, e, l, n) {
    ((t = e.state),
      typeof e.componentWillReceiveProps == 'function' && e.componentWillReceiveProps(l, n),
      typeof e.UNSAFE_componentWillReceiveProps == 'function' &&
        e.UNSAFE_componentWillReceiveProps(l, n),
      e.state !== t && Oc.enqueueReplaceState(e, e.state, null));
  }
  function Kl(t, e) {
    var l = e;
    if ('ref' in e) {
      l = {};
      for (var n in e) n !== 'ref' && (l[n] = e[n]);
    }
    if ((t = t.defaultProps)) {
      l === e && (l = z({}, l));
      for (var a in t) l[a] === void 0 && (l[a] = t[a]);
    }
    return l;
  }
  function us(t) {
    lu(t);
  }
  function is(t) {
    console.error(t);
  }
  function cs(t) {
    lu(t);
  }
  function xu(t, e) {
    try {
      var l = t.onUncaughtError;
      l(e.value, { componentStack: e.stack });
    } catch (n) {
      setTimeout(function () {
        throw n;
      });
    }
  }
  function fs(t, e, l) {
    try {
      var n = t.onCaughtError;
      n(l.value, { componentStack: l.stack, errorBoundary: e.tag === 1 ? e.stateNode : null });
    } catch (a) {
      setTimeout(function () {
        throw a;
      });
    }
  }
  function Cc(t, e, l) {
    return (
      (l = ol(l)),
      (l.tag = 3),
      (l.payload = { element: null }),
      (l.callback = function () {
        xu(t, e);
      }),
      l
    );
  }
  function os(t) {
    return ((t = ol(t)), (t.tag = 3), t);
  }
  function rs(t, e, l, n) {
    var a = l.type.getDerivedStateFromError;
    if (typeof a == 'function') {
      var u = n.value;
      ((t.payload = function () {
        return a(u);
      }),
        (t.callback = function () {
          fs(e, l, n);
        }));
    }
    var c = l.stateNode;
    c !== null &&
      typeof c.componentDidCatch == 'function' &&
      (t.callback = function () {
        (fs(e, l, n),
          typeof a != 'function' && (yl === null ? (yl = new Set([this])) : yl.add(this)));
        var r = n.stack;
        this.componentDidCatch(n.value, { componentStack: r !== null ? r : '' });
      });
  }
  function v0(t, e, l, n, a) {
    if (((l.flags |= 32768), n !== null && typeof n == 'object' && typeof n.then == 'function')) {
      if (((e = l.alternate), e !== null && hn(e, l, a, !0), (l = he.current), l !== null)) {
        switch (l.tag) {
          case 31:
          case 13:
            return (
              Me === null ? wu() : l.alternate === null && wt === 0 && (wt = 3),
              (l.flags &= -257),
              (l.flags |= 65536),
              (l.lanes = a),
              n === du
                ? (l.flags |= 16384)
                : ((e = l.updateQueue),
                  e === null ? (l.updateQueue = new Set([n])) : e.add(n),
                  tf(t, n, a)),
              !1
            );
          case 22:
            return (
              (l.flags |= 65536),
              n === du
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
    if (pt)
      return (
        (e = he.current),
        e !== null
          ? ((e.flags & 65536) === 0 && (e.flags |= 256),
            (e.flags |= 65536),
            (e.lanes = a),
            n !== $i && ((t = Error(f(422), { cause: n })), la(ze(t, l))))
          : (n !== $i && ((e = Error(f(423), { cause: n })), la(ze(e, l))),
            (t = t.current.alternate),
            (t.flags |= 65536),
            (a &= -a),
            (t.lanes |= a),
            (n = ze(n, l)),
            (a = Cc(t.stateNode, n, a)),
            uc(t, a),
            wt !== 4 && (wt = 2)),
        !1
      );
    var u = Error(f(520), { cause: n });
    if (((u = ze(u, l)), Ea === null ? (Ea = [u]) : Ea.push(u), wt !== 4 && (wt = 2), e === null))
      return !0;
    ((n = ze(n, l)), (l = e));
    do {
      switch (l.tag) {
        case 3:
          return (
            (l.flags |= 65536),
            (t = a & -a),
            (l.lanes |= t),
            (t = Cc(l.stateNode, n, t)),
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
                  (yl === null || !yl.has(u)))))
          )
            return (
              (l.flags |= 65536),
              (a &= -a),
              (l.lanes |= a),
              (a = os(a)),
              rs(a, t, l, n),
              uc(l, a),
              !1
            );
      }
      l = l.return;
    } while (l !== null);
    return !1;
  }
  var Dc = Error(f(461)),
    Qt = !1;
  function Ft(t, e, l, n) {
    e.child = t === null ? hr(e, null, l, n) : Vl(e, t.child, l, n);
  }
  function ss(t, e, l, n, a) {
    l = l.render;
    var u = e.ref;
    if ('ref' in n) {
      var c = {};
      for (var r in n) r !== 'ref' && (c[r] = n[r]);
    } else c = n;
    return (
      Gl(e),
      (n = sc(t, e, l, c, u, a)),
      (r = dc()),
      t !== null && !Qt
        ? (mc(t, e, a), Ze(t, e, a))
        : (pt && r && Ki(e), (e.flags |= 1), Ft(t, e, n, a), e.child)
    );
  }
  function ds(t, e, l, n, a) {
    if (t === null) {
      var u = l.type;
      return typeof u == 'function' && !Qi(u) && u.defaultProps === void 0 && l.compare === null
        ? ((e.tag = 15), (e.type = u), ms(t, e, u, n, a))
        : ((t = iu(l.type, null, n, e, e.mode, a)), (t.ref = e.ref), (t.return = e), (e.child = t));
    }
    if (((u = t.child), !qc(t, a))) {
      var c = u.memoizedProps;
      if (((l = l.compare), (l = l !== null ? l : In), l(c, n) && t.ref === e.ref))
        return Ze(t, e, a);
    }
    return ((e.flags |= 1), (t = Ye(u, n)), (t.ref = e.ref), (t.return = e), (e.child = t));
  }
  function ms(t, e, l, n, a) {
    if (t !== null) {
      var u = t.memoizedProps;
      if (In(u, n) && t.ref === e.ref)
        if (((Qt = !1), (e.pendingProps = n = u), qc(t, a))) (t.flags & 131072) !== 0 && (Qt = !0);
        else return ((e.lanes = t.lanes), Ze(t, e, a));
    }
    return Rc(t, e, l, n, a);
  }
  function hs(t, e, l, n) {
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
        return vs(t, e, u, l, n);
      }
      if ((l & 536870912) !== 0)
        ((e.memoizedState = { baseLanes: 0, cachePool: null }),
          t !== null && ru(e, u !== null ? u.cachePool : null),
          u !== null ? gr(e, u) : cc(),
          br(e));
      else return ((n = e.lanes = 536870912), vs(t, e, u !== null ? u.baseLanes | l : l, l, n));
    } else
      u !== null
        ? (ru(e, u.cachePool), gr(e, u), dl(), (e.memoizedState = null))
        : (t !== null && ru(e, null), cc(), dl());
    return (Ft(t, e, a, l), e.child);
  }
  function ha(t, e) {
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
  function vs(t, e, l, n, a) {
    var u = ec();
    return (
      (u = u === null ? null : { parent: Lt._currentValue, pool: u }),
      (e.memoizedState = { baseLanes: l, cachePool: u }),
      t !== null && ru(e, null),
      cc(),
      br(e),
      t !== null && hn(t, e, n, !0),
      (e.childLanes = a),
      null
    );
  }
  function Mu(t, e) {
    return (
      (e = Ou({ mode: e.mode, children: e.children }, t.mode)),
      (e.ref = t.ref),
      (t.child = e),
      (e.return = t),
      e
    );
  }
  function ys(t, e, l) {
    return (
      Vl(e, t.child, null, l),
      (t = Mu(e, e.pendingProps)),
      (t.flags |= 2),
      ve(e),
      (e.memoizedState = null),
      t
    );
  }
  function y0(t, e, l) {
    var n = e.pendingProps,
      a = (e.flags & 128) !== 0;
    if (((e.flags &= -129), t === null)) {
      if (pt) {
        if (n.mode === 'hidden') return ((t = Mu(e, n)), (e.lanes = 536870912), ha(null, t));
        if (
          (oc(e),
          (t = Ut)
            ? ((t = Od(t, xe)),
              (t = t !== null && t.data === '&' ? t : null),
              t !== null &&
                ((e.memoizedState = {
                  dehydrated: t,
                  treeContext: al !== null ? { id: Ue, overflow: Ne } : null,
                  retryLane: 536870912,
                  hydrationErrors: null,
                }),
                (l = Io(t)),
                (l.return = e),
                (e.child = l),
                (kt = e),
                (Ut = null)))
            : (t = null),
          t === null)
        )
          throw il(e);
        return ((e.lanes = 536870912), null);
      }
      return Mu(e, n);
    }
    var u = t.memoizedState;
    if (u !== null) {
      var c = u.dehydrated;
      if ((oc(e), a))
        if (e.flags & 256) ((e.flags &= -257), (e = ys(t, e, l)));
        else if (e.memoizedState !== null) ((e.child = t.child), (e.flags |= 128), (e = null));
        else throw Error(f(558));
      else if ((Qt || hn(t, e, l, !1), (a = (l & t.childLanes) !== 0), Qt || a)) {
        if (((n = Rt), n !== null && ((c = uo(n, l)), c !== 0 && c !== u.retryLane)))
          throw ((u.retryLane = c), Bl(t, c), fe(n, t, c), Dc);
        (wu(), (e = ys(t, e, l)));
      } else
        ((t = u.treeContext),
          (Ut = _e(c.nextSibling)),
          (kt = e),
          (pt = !0),
          (ul = null),
          (xe = !1),
          t !== null && lr(e, t),
          (e = Mu(e, n)),
          (e.flags |= 4096));
      return e;
    }
    return (
      (t = Ye(t.child, { mode: n.mode, children: n.children })),
      (t.ref = e.ref),
      (e.child = t),
      (t.return = e),
      t
    );
  }
  function _u(t, e) {
    var l = e.ref;
    if (l === null) t !== null && t.ref !== null && (e.flags |= 4194816);
    else {
      if (typeof l != 'function' && typeof l != 'object') throw Error(f(284));
      (t === null || t.ref !== l) && (e.flags |= 4194816);
    }
  }
  function Rc(t, e, l, n, a) {
    return (
      Gl(e),
      (l = sc(t, e, l, n, void 0, a)),
      (n = dc()),
      t !== null && !Qt
        ? (mc(t, e, a), Ze(t, e, a))
        : (pt && n && Ki(e), (e.flags |= 1), Ft(t, e, l, a), e.child)
    );
  }
  function gs(t, e, l, n, a, u) {
    return (
      Gl(e),
      (e.updateQueue = null),
      (l = Sr(e, n, l, a)),
      pr(t),
      (n = dc()),
      t !== null && !Qt
        ? (mc(t, e, u), Ze(t, e, u))
        : (pt && n && Ki(e), (e.flags |= 1), Ft(t, e, l, u), e.child)
    );
  }
  function bs(t, e, l, n, a) {
    if ((Gl(e), e.stateNode === null)) {
      var u = rn,
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
        (u.context = typeof c == 'object' && c !== null ? Wt(c) : rn),
        (u.state = e.memoizedState),
        (c = l.getDerivedStateFromProps),
        typeof c == 'function' && (_c(e, l, c, n), (u.state = e.memoizedState)),
        typeof l.getDerivedStateFromProps == 'function' ||
          typeof u.getSnapshotBeforeUpdate == 'function' ||
          (typeof u.UNSAFE_componentWillMount != 'function' &&
            typeof u.componentWillMount != 'function') ||
          ((c = u.state),
          typeof u.componentWillMount == 'function' && u.componentWillMount(),
          typeof u.UNSAFE_componentWillMount == 'function' && u.UNSAFE_componentWillMount(),
          c !== u.state && Oc.enqueueReplaceState(u, u.state, null),
          oa(e, n, u, a),
          fa(),
          (u.state = e.memoizedState)),
        typeof u.componentDidMount == 'function' && (e.flags |= 4194308),
        (n = !0));
    } else if (t === null) {
      u = e.stateNode;
      var r = e.memoizedProps,
        v = Kl(l, r);
      u.props = v;
      var A = u.context,
        C = l.contextType;
      ((c = rn), typeof C == 'object' && C !== null && (c = Wt(C)));
      var U = l.getDerivedStateFromProps;
      ((C = typeof U == 'function' || typeof u.getSnapshotBeforeUpdate == 'function'),
        (r = e.pendingProps !== r),
        C ||
          (typeof u.UNSAFE_componentWillReceiveProps != 'function' &&
            typeof u.componentWillReceiveProps != 'function') ||
          ((r || A !== c) && as(e, u, n, c)),
        (fl = !1));
      var x = e.memoizedState;
      ((u.state = x),
        oa(e, n, u, a),
        fa(),
        (A = e.memoizedState),
        r || x !== A || fl
          ? (typeof U == 'function' && (_c(e, l, U, n), (A = e.memoizedState)),
            (v = fl || ns(e, l, v, n, x, A, c))
              ? (C ||
                  (typeof u.UNSAFE_componentWillMount != 'function' &&
                    typeof u.componentWillMount != 'function') ||
                  (typeof u.componentWillMount == 'function' && u.componentWillMount(),
                  typeof u.UNSAFE_componentWillMount == 'function' &&
                    u.UNSAFE_componentWillMount()),
                typeof u.componentDidMount == 'function' && (e.flags |= 4194308))
              : (typeof u.componentDidMount == 'function' && (e.flags |= 4194308),
                (e.memoizedProps = n),
                (e.memoizedState = A)),
            (u.props = n),
            (u.state = A),
            (u.context = c),
            (n = v))
          : (typeof u.componentDidMount == 'function' && (e.flags |= 4194308), (n = !1)));
    } else {
      ((u = e.stateNode),
        ac(t, e),
        (c = e.memoizedProps),
        (C = Kl(l, c)),
        (u.props = C),
        (U = e.pendingProps),
        (x = u.context),
        (A = l.contextType),
        (v = rn),
        typeof A == 'object' && A !== null && (v = Wt(A)),
        (r = l.getDerivedStateFromProps),
        (A = typeof r == 'function' || typeof u.getSnapshotBeforeUpdate == 'function') ||
          (typeof u.UNSAFE_componentWillReceiveProps != 'function' &&
            typeof u.componentWillReceiveProps != 'function') ||
          ((c !== U || x !== v) && as(e, u, n, v)),
        (fl = !1),
        (x = e.memoizedState),
        (u.state = x),
        oa(e, n, u, a),
        fa());
      var _ = e.memoizedState;
      c !== U || x !== _ || fl || (t !== null && t.dependencies !== null && fu(t.dependencies))
        ? (typeof r == 'function' && (_c(e, l, r, n), (_ = e.memoizedState)),
          (C =
            fl ||
            ns(e, l, C, n, x, _, v) ||
            (t !== null && t.dependencies !== null && fu(t.dependencies)))
            ? (A ||
                (typeof u.UNSAFE_componentWillUpdate != 'function' &&
                  typeof u.componentWillUpdate != 'function') ||
                (typeof u.componentWillUpdate == 'function' && u.componentWillUpdate(n, _, v),
                typeof u.UNSAFE_componentWillUpdate == 'function' &&
                  u.UNSAFE_componentWillUpdate(n, _, v)),
              typeof u.componentDidUpdate == 'function' && (e.flags |= 4),
              typeof u.getSnapshotBeforeUpdate == 'function' && (e.flags |= 1024))
            : (typeof u.componentDidUpdate != 'function' ||
                (c === t.memoizedProps && x === t.memoizedState) ||
                (e.flags |= 4),
              typeof u.getSnapshotBeforeUpdate != 'function' ||
                (c === t.memoizedProps && x === t.memoizedState) ||
                (e.flags |= 1024),
              (e.memoizedProps = n),
              (e.memoizedState = _)),
          (u.props = n),
          (u.state = _),
          (u.context = v),
          (n = C))
        : (typeof u.componentDidUpdate != 'function' ||
            (c === t.memoizedProps && x === t.memoizedState) ||
            (e.flags |= 4),
          typeof u.getSnapshotBeforeUpdate != 'function' ||
            (c === t.memoizedProps && x === t.memoizedState) ||
            (e.flags |= 1024),
          (n = !1));
    }
    return (
      (u = n),
      _u(t, e),
      (n = (e.flags & 128) !== 0),
      u || n
        ? ((u = e.stateNode),
          (l = n && typeof l.getDerivedStateFromError != 'function' ? null : u.render()),
          (e.flags |= 1),
          t !== null && n
            ? ((e.child = Vl(e, t.child, null, a)), (e.child = Vl(e, null, l, a)))
            : Ft(t, e, l, a),
          (e.memoizedState = u.state),
          (t = e.child))
        : (t = Ze(t, e, a)),
      t
    );
  }
  function ps(t, e, l, n) {
    return (ql(), (e.flags |= 256), Ft(t, e, l, n), e.child);
  }
  var Uc = { dehydrated: null, treeContext: null, retryLane: 0, hydrationErrors: null };
  function Nc(t) {
    return { baseLanes: t, cachePool: fr() };
  }
  function jc(t, e, l) {
    return ((t = t !== null ? t.childLanes & ~l : 0), e && (t |= ge), t);
  }
  function Ss(t, e, l) {
    var n = e.pendingProps,
      a = !1,
      u = (e.flags & 128) !== 0,
      c;
    if (
      ((c = u) || (c = t !== null && t.memoizedState === null ? !1 : (Yt.current & 2) !== 0),
      c && ((a = !0), (e.flags &= -129)),
      (c = (e.flags & 32) !== 0),
      (e.flags &= -33),
      t === null)
    ) {
      if (pt) {
        if (
          (a ? sl(e) : dl(),
          (t = Ut)
            ? ((t = Od(t, xe)),
              (t = t !== null && t.data !== '&' ? t : null),
              t !== null &&
                ((e.memoizedState = {
                  dehydrated: t,
                  treeContext: al !== null ? { id: Ue, overflow: Ne } : null,
                  retryLane: 536870912,
                  hydrationErrors: null,
                }),
                (l = Io(t)),
                (l.return = e),
                (e.child = l),
                (kt = e),
                (Ut = null)))
            : (t = null),
          t === null)
        )
          throw il(e);
        return (gf(t) ? (e.lanes = 32) : (e.lanes = 536870912), null);
      }
      var r = n.children;
      return (
        (n = n.fallback),
        a
          ? (dl(),
            (a = e.mode),
            (r = Ou({ mode: 'hidden', children: r }, a)),
            (n = wl(n, a, l, null)),
            (r.return = e),
            (n.return = e),
            (r.sibling = n),
            (e.child = r),
            (n = e.child),
            (n.memoizedState = Nc(l)),
            (n.childLanes = jc(t, c, l)),
            (e.memoizedState = Uc),
            ha(null, n))
          : (sl(e), Hc(e, r))
      );
    }
    var v = t.memoizedState;
    if (v !== null && ((r = v.dehydrated), r !== null)) {
      if (u)
        e.flags & 256
          ? (sl(e), (e.flags &= -257), (e = Bc(t, e, l)))
          : e.memoizedState !== null
            ? (dl(), (e.child = t.child), (e.flags |= 128), (e = null))
            : (dl(),
              (r = n.fallback),
              (a = e.mode),
              (n = Ou({ mode: 'visible', children: n.children }, a)),
              (r = wl(r, a, l, null)),
              (r.flags |= 2),
              (n.return = e),
              (r.return = e),
              (n.sibling = r),
              (e.child = n),
              Vl(e, t.child, null, l),
              (n = e.child),
              (n.memoizedState = Nc(l)),
              (n.childLanes = jc(t, c, l)),
              (e.memoizedState = Uc),
              (e = ha(null, n)));
      else if ((sl(e), gf(r))) {
        if (((c = r.nextSibling && r.nextSibling.dataset), c)) var A = c.dgst;
        ((c = A),
          (n = Error(f(419))),
          (n.stack = ''),
          (n.digest = c),
          la({ value: n, source: null, stack: null }),
          (e = Bc(t, e, l)));
      } else if ((Qt || hn(t, e, l, !1), (c = (l & t.childLanes) !== 0), Qt || c)) {
        if (((c = Rt), c !== null && ((n = uo(c, l)), n !== 0 && n !== v.retryLane)))
          throw ((v.retryLane = n), Bl(t, n), fe(c, t, n), Dc);
        (yf(r) || wu(), (e = Bc(t, e, l)));
      } else
        yf(r)
          ? ((e.flags |= 192), (e.child = t.child), (e = null))
          : ((t = v.treeContext),
            (Ut = _e(r.nextSibling)),
            (kt = e),
            (pt = !0),
            (ul = null),
            (xe = !1),
            t !== null && lr(e, t),
            (e = Hc(e, n.children)),
            (e.flags |= 4096));
      return e;
    }
    return a
      ? (dl(),
        (r = n.fallback),
        (a = e.mode),
        (v = t.child),
        (A = v.sibling),
        (n = Ye(v, { mode: 'hidden', children: n.children })),
        (n.subtreeFlags = v.subtreeFlags & 65011712),
        A !== null ? (r = Ye(A, r)) : ((r = wl(r, a, l, null)), (r.flags |= 2)),
        (r.return = e),
        (n.return = e),
        (n.sibling = r),
        (e.child = n),
        ha(null, n),
        (n = e.child),
        (r = t.child.memoizedState),
        r === null
          ? (r = Nc(l))
          : ((a = r.cachePool),
            a !== null
              ? ((v = Lt._currentValue), (a = a.parent !== v ? { parent: v, pool: v } : a))
              : (a = fr()),
            (r = { baseLanes: r.baseLanes | l, cachePool: a })),
        (n.memoizedState = r),
        (n.childLanes = jc(t, c, l)),
        (e.memoizedState = Uc),
        ha(t.child, n))
      : (sl(e),
        (l = t.child),
        (t = l.sibling),
        (l = Ye(l, { mode: 'visible', children: n.children })),
        (l.return = e),
        (l.sibling = null),
        t !== null &&
          ((c = e.deletions), c === null ? ((e.deletions = [t]), (e.flags |= 16)) : c.push(t)),
        (e.child = l),
        (e.memoizedState = null),
        l);
  }
  function Hc(t, e) {
    return ((e = Ou({ mode: 'visible', children: e }, t.mode)), (e.return = t), (t.child = e));
  }
  function Ou(t, e) {
    return ((t = me(22, t, null, e)), (t.lanes = 0), t);
  }
  function Bc(t, e, l) {
    return (
      Vl(e, t.child, null, l),
      (t = Hc(e, e.pendingProps.children)),
      (t.flags |= 2),
      (e.memoizedState = null),
      t
    );
  }
  function Es(t, e, l) {
    t.lanes |= e;
    var n = t.alternate;
    (n !== null && (n.lanes |= e), Fi(t.return, e, l));
  }
  function wc(t, e, l, n, a, u) {
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
  function zs(t, e, l) {
    var n = e.pendingProps,
      a = n.revealOrder,
      u = n.tail;
    n = n.children;
    var c = Yt.current,
      r = (c & 2) !== 0;
    if (
      (r ? ((c = (c & 1) | 2), (e.flags |= 128)) : (c &= 1),
      B(Yt, c),
      Ft(t, e, n, l),
      (n = pt ? ea : 0),
      !r && t !== null && (t.flags & 128) !== 0)
    )
      t: for (t = e.child; t !== null; ) {
        if (t.tag === 13) t.memoizedState !== null && Es(t, l, e);
        else if (t.tag === 19) Es(t, l, e);
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
          ((t = l.alternate), t !== null && yu(t) === null && (a = l), (l = l.sibling));
        ((l = a),
          l === null ? ((a = e.child), (e.child = null)) : ((a = l.sibling), (l.sibling = null)),
          wc(e, !1, a, l, u, n));
        break;
      case 'backwards':
      case 'unstable_legacy-backwards':
        for (l = null, a = e.child, e.child = null; a !== null; ) {
          if (((t = a.alternate), t !== null && yu(t) === null)) {
            e.child = a;
            break;
          }
          ((t = a.sibling), (a.sibling = l), (l = a), (a = t));
        }
        wc(e, !0, l, null, u, n);
        break;
      case 'together':
        wc(e, !1, null, null, void 0, n);
        break;
      default:
        e.memoizedState = null;
    }
    return e.child;
  }
  function Ze(t, e, l) {
    if (
      (t !== null && (e.dependencies = t.dependencies), (vl |= e.lanes), (l & e.childLanes) === 0)
    )
      if (t !== null) {
        if ((hn(t, e, l, !1), (l & e.childLanes) === 0)) return null;
      } else return null;
    if (t !== null && e.child !== t.child) throw Error(f(153));
    if (e.child !== null) {
      for (t = e.child, l = Ye(t, t.pendingProps), e.child = l, l.return = e; t.sibling !== null; )
        ((t = t.sibling), (l = l.sibling = Ye(t, t.pendingProps)), (l.return = e));
      l.sibling = null;
    }
    return e.child;
  }
  function qc(t, e) {
    return (t.lanes & e) !== 0 ? !0 : ((t = t.dependencies), !!(t !== null && fu(t)));
  }
  function g0(t, e, l) {
    switch (e.tag) {
      case 3:
        (te(e, e.stateNode.containerInfo), cl(e, Lt, t.memoizedState.cache), ql());
        break;
      case 27:
      case 5:
        Gn(e);
        break;
      case 4:
        te(e, e.stateNode.containerInfo);
        break;
      case 10:
        cl(e, e.type, e.memoizedProps.value);
        break;
      case 31:
        if (e.memoizedState !== null) return ((e.flags |= 128), oc(e), null);
        break;
      case 13:
        var n = e.memoizedState;
        if (n !== null)
          return n.dehydrated !== null
            ? (sl(e), (e.flags |= 128), null)
            : (l & e.child.childLanes) !== 0
              ? Ss(t, e, l)
              : (sl(e), (t = Ze(t, e, l)), t !== null ? t.sibling : null);
        sl(e);
        break;
      case 19:
        var a = (t.flags & 128) !== 0;
        if (
          ((n = (l & e.childLanes) !== 0),
          n || (hn(t, e, l, !1), (n = (l & e.childLanes) !== 0)),
          a)
        ) {
          if (n) return zs(t, e, l);
          e.flags |= 128;
        }
        if (
          ((a = e.memoizedState),
          a !== null && ((a.rendering = null), (a.tail = null), (a.lastEffect = null)),
          B(Yt, Yt.current),
          n)
        )
          break;
        return null;
      case 22:
        return ((e.lanes = 0), hs(t, e, l, e.pendingProps));
      case 24:
        cl(e, Lt, t.memoizedState.cache);
    }
    return Ze(t, e, l);
  }
  function Ts(t, e, l) {
    if (t !== null)
      if (t.memoizedProps !== e.pendingProps) Qt = !0;
      else {
        if (!qc(t, l) && (e.flags & 128) === 0) return ((Qt = !1), g0(t, e, l));
        Qt = (t.flags & 131072) !== 0;
      }
    else ((Qt = !1), pt && (e.flags & 1048576) !== 0 && er(e, ea, e.index));
    switch (((e.lanes = 0), e.tag)) {
      case 16:
        t: {
          var n = e.pendingProps;
          if (((t = Xl(e.elementType)), (e.type = t), typeof t == 'function'))
            Qi(t)
              ? ((n = Kl(t, n)), (e.tag = 1), (e = bs(null, e, t, n, l)))
              : ((e.tag = 0), (e = Rc(null, e, t, n, l)));
          else {
            if (t != null) {
              var a = t.$$typeof;
              if (a === K) {
                ((e.tag = 11), (e = ss(null, e, t, n, l)));
                break t;
              } else if (a === w) {
                ((e.tag = 14), (e = ds(null, e, t, n, l)));
                break t;
              }
            }
            throw ((e = At(t) || t), Error(f(306, e, '')));
          }
        }
        return e;
      case 0:
        return Rc(t, e, e.type, e.pendingProps, l);
      case 1:
        return ((n = e.type), (a = Kl(n, e.pendingProps)), bs(t, e, n, a, l));
      case 3:
        t: {
          if ((te(e, e.stateNode.containerInfo), t === null)) throw Error(f(387));
          n = e.pendingProps;
          var u = e.memoizedState;
          ((a = u.element), ac(t, e), oa(e, n, null, l));
          var c = e.memoizedState;
          if (
            ((n = c.cache),
            cl(e, Lt, n),
            n !== u.cache && Pi(e, [Lt], l, !0),
            fa(),
            (n = c.element),
            u.isDehydrated)
          )
            if (
              ((u = { element: n, isDehydrated: !1, cache: c.cache }),
              (e.updateQueue.baseState = u),
              (e.memoizedState = u),
              e.flags & 256)
            ) {
              e = ps(t, e, n, l);
              break t;
            } else if (n !== a) {
              ((a = ze(Error(f(424)), e)), la(a), (e = ps(t, e, n, l)));
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
                Ut = _e(t.firstChild),
                  kt = e,
                  pt = !0,
                  ul = null,
                  xe = !0,
                  l = hr(e, null, n, l),
                  e.child = l;
                l;
              )
                ((l.flags = (l.flags & -3) | 4096), (l = l.sibling));
            }
          else {
            if ((ql(), n === a)) {
              e = Ze(t, e, l);
              break t;
            }
            Ft(t, e, n, l);
          }
          e = e.child;
        }
        return e;
      case 26:
        return (
          _u(t, e),
          t === null
            ? (l = jd(e.type, null, e.pendingProps, null))
              ? (e.memoizedState = l)
              : pt ||
                ((l = e.type),
                (t = e.pendingProps),
                (n = Vu(ft.current).createElement(l)),
                (n[$t] = e),
                (n[le] = t),
                Pt(n, l, t),
                Kt(n),
                (e.stateNode = n))
            : (e.memoizedState = jd(e.type, t.memoizedProps, e.pendingProps, t.memoizedState)),
          null
        );
      case 27:
        return (
          Gn(e),
          t === null &&
            pt &&
            ((n = e.stateNode = Rd(e.type, e.pendingProps, ft.current)),
            (kt = e),
            (xe = !0),
            (a = Ut),
            Sl(e.type) ? ((bf = a), (Ut = _e(n.firstChild))) : (Ut = a)),
          Ft(t, e, e.pendingProps.children, l),
          _u(t, e),
          t === null && (e.flags |= 4194304),
          e.child
        );
      case 5:
        return (
          t === null &&
            pt &&
            ((a = n = Ut) &&
              ((n = J0(n, e.type, e.pendingProps, xe)),
              n !== null
                ? ((e.stateNode = n), (kt = e), (Ut = _e(n.firstChild)), (xe = !1), (a = !0))
                : (a = !1)),
            a || il(e)),
          Gn(e),
          (a = e.type),
          (u = e.pendingProps),
          (c = t !== null ? t.memoizedProps : null),
          (n = u.children),
          mf(a, u) ? (n = null) : c !== null && mf(a, c) && (e.flags |= 32),
          e.memoizedState !== null && ((a = sc(t, e, f0, null, null, l)), (Ca._currentValue = a)),
          _u(t, e),
          Ft(t, e, n, l),
          e.child
        );
      case 6:
        return (
          t === null &&
            pt &&
            ((t = l = Ut) &&
              ((l = $0(l, e.pendingProps, xe)),
              l !== null ? ((e.stateNode = l), (kt = e), (Ut = null), (t = !0)) : (t = !1)),
            t || il(e)),
          null
        );
      case 13:
        return Ss(t, e, l);
      case 4:
        return (
          te(e, e.stateNode.containerInfo),
          (n = e.pendingProps),
          t === null ? (e.child = Vl(e, null, n, l)) : Ft(t, e, n, l),
          e.child
        );
      case 11:
        return ss(t, e, e.type, e.pendingProps, l);
      case 7:
        return (Ft(t, e, e.pendingProps, l), e.child);
      case 8:
        return (Ft(t, e, e.pendingProps.children, l), e.child);
      case 12:
        return (Ft(t, e, e.pendingProps.children, l), e.child);
      case 10:
        return ((n = e.pendingProps), cl(e, e.type, n.value), Ft(t, e, n.children, l), e.child);
      case 9:
        return (
          (a = e.type._context),
          (n = e.pendingProps.children),
          Gl(e),
          (a = Wt(a)),
          (n = n(a)),
          (e.flags |= 1),
          Ft(t, e, n, l),
          e.child
        );
      case 14:
        return ds(t, e, e.type, e.pendingProps, l);
      case 15:
        return ms(t, e, e.type, e.pendingProps, l);
      case 19:
        return zs(t, e, l);
      case 31:
        return y0(t, e, l);
      case 22:
        return hs(t, e, l, e.pendingProps);
      case 24:
        return (
          Gl(e),
          (n = Wt(Lt)),
          t === null
            ? ((a = ec()),
              a === null &&
                ((a = Rt),
                (u = Ii()),
                (a.pooledCache = u),
                u.refCount++,
                u !== null && (a.pooledCacheLanes |= l),
                (a = u)),
              (e.memoizedState = { parent: n, cache: a }),
              nc(e),
              cl(e, Lt, a))
            : ((t.lanes & l) !== 0 && (ac(t, e), oa(e, null, null, l), fa()),
              (a = t.memoizedState),
              (u = e.memoizedState),
              a.parent !== n
                ? ((a = { parent: n, cache: n }),
                  (e.memoizedState = a),
                  e.lanes === 0 && (e.memoizedState = e.updateQueue.baseState = a),
                  cl(e, Lt, n))
                : ((n = u.cache), cl(e, Lt, n), n !== a.cache && Pi(e, [Lt], l, !0))),
          Ft(t, e, e.pendingProps.children, l),
          e.child
        );
      case 29:
        throw e.pendingProps;
    }
    throw Error(f(156, e.tag));
  }
  function Ke(t) {
    t.flags |= 4;
  }
  function Yc(t, e, l, n, a) {
    if (((e = (t.mode & 32) !== 0) && (e = !1), e)) {
      if (((t.flags |= 16777216), (a & 335544128) === a))
        if (t.stateNode.complete) t.flags |= 8192;
        else if (Ws()) t.flags |= 8192;
        else throw ((Ql = du), lc);
    } else t.flags &= -16777217;
  }
  function As(t, e) {
    if (e.type !== 'stylesheet' || (e.state.loading & 4) !== 0) t.flags &= -16777217;
    else if (((t.flags |= 16777216), !Yd(e)))
      if (Ws()) t.flags |= 8192;
      else throw ((Ql = du), lc);
  }
  function Cu(t, e) {
    (e !== null && (t.flags |= 4),
      t.flags & 16384 && ((e = t.tag !== 22 ? lo() : 536870912), (t.lanes |= e), (Mn |= e)));
  }
  function va(t, e) {
    if (!pt)
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
  function b0(t, e, l) {
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
          Xe(Lt),
          qt(),
          l.pendingContext && ((l.context = l.pendingContext), (l.pendingContext = null)),
          (t === null || t.child === null) &&
            (mn(e)
              ? Ke(e)
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
            ? (Ke(e), u !== null ? (Nt(e), As(e, u)) : (Nt(e), Yc(e, a, null, n, l)))
            : u
              ? u !== t.memoizedState
                ? (Ke(e), Nt(e), As(e, u))
                : (Nt(e), (e.flags &= -16777217))
              : ((t = t.memoizedProps), t !== n && Ke(e), Nt(e), Yc(e, a, t, n, l)),
          null
        );
      case 27:
        if ((Ga(e), (l = ft.current), (a = e.type), t !== null && e.stateNode != null))
          t.memoizedProps !== n && Ke(e);
        else {
          if (!n) {
            if (e.stateNode === null) throw Error(f(166));
            return (Nt(e), null);
          }
          ((t = Z.current), mn(e) ? nr(e) : ((t = Rd(a, n, l)), (e.stateNode = t), Ke(e)));
        }
        return (Nt(e), null);
      case 5:
        if ((Ga(e), (a = e.type), t !== null && e.stateNode != null))
          t.memoizedProps !== n && Ke(e);
        else {
          if (!n) {
            if (e.stateNode === null) throw Error(f(166));
            return (Nt(e), null);
          }
          if (((u = Z.current), mn(e))) nr(e);
          else {
            var c = Vu(ft.current);
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
            t: switch ((Pt(u, a, n), a)) {
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
            n && Ke(e);
          }
        }
        return (Nt(e), Yc(e, e.type, t === null ? null : t.memoizedProps, e.pendingProps, l), null);
      case 6:
        if (t && e.stateNode != null) t.memoizedProps !== n && Ke(e);
        else {
          if (typeof n != 'string' && e.stateNode === null) throw Error(f(166));
          if (((t = ft.current), mn(e))) {
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
                Sd(t.nodeValue, l)
              )),
              t || il(e, !0));
          } else ((t = Vu(t).createTextNode(n)), (t[$t] = e), (e.stateNode = t));
        }
        return (Nt(e), null);
      case 31:
        if (((l = e.memoizedState), t === null || t.memoizedState !== null)) {
          if (((n = mn(e)), l !== null)) {
            if (t === null) {
              if (!n) throw Error(f(318));
              if (((t = e.memoizedState), (t = t !== null ? t.dehydrated : null), !t))
                throw Error(f(557));
              t[$t] = e;
            } else (ql(), (e.flags & 128) === 0 && (e.memoizedState = null), (e.flags |= 4));
            (Nt(e), (t = !1));
          } else
            ((l = ki()),
              t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = l),
              (t = !0));
          if (!t) return e.flags & 256 ? (ve(e), e) : (ve(e), null);
          if ((e.flags & 128) !== 0) throw Error(f(558));
        }
        return (Nt(e), null);
      case 13:
        if (
          ((n = e.memoizedState),
          t === null || (t.memoizedState !== null && t.memoizedState.dehydrated !== null))
        ) {
          if (((a = mn(e)), n !== null && n.dehydrated !== null)) {
            if (t === null) {
              if (!a) throw Error(f(318));
              if (((a = e.memoizedState), (a = a !== null ? a.dehydrated : null), !a))
                throw Error(f(317));
              a[$t] = e;
            } else (ql(), (e.flags & 128) === 0 && (e.memoizedState = null), (e.flags |= 4));
            (Nt(e), (a = !1));
          } else
            ((a = ki()),
              t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = a),
              (a = !0));
          if (!a) return e.flags & 256 ? (ve(e), e) : (ve(e), null);
        }
        return (
          ve(e),
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
        return (qt(), t === null && ff(e.stateNode.containerInfo), Nt(e), null);
      case 10:
        return (Xe(e.type), Nt(e), null);
      case 19:
        if ((D(Yt), (n = e.memoizedState), n === null)) return (Nt(e), null);
        if (((a = (e.flags & 128) !== 0), (u = n.rendering), u === null))
          if (a) va(n, !1);
          else {
            if (wt !== 0 || (t !== null && (t.flags & 128) !== 0))
              for (t = e.child; t !== null; ) {
                if (((u = yu(t)), u !== null)) {
                  for (
                    e.flags |= 128,
                      va(n, !1),
                      t = u.updateQueue,
                      e.updateQueue = t,
                      Cu(e, t),
                      e.subtreeFlags = 0,
                      t = l,
                      l = e.child;
                    l !== null;
                  )
                    (Po(l, t), (l = l.sibling));
                  return (B(Yt, (Yt.current & 1) | 2), pt && Ge(e, n.treeForkCount), e.child);
                }
                t = t.sibling;
              }
            n.tail !== null &&
              oe() > ju &&
              ((e.flags |= 128), (a = !0), va(n, !1), (e.lanes = 4194304));
          }
        else {
          if (!a)
            if (((t = yu(u)), t !== null)) {
              if (
                ((e.flags |= 128),
                (a = !0),
                (t = t.updateQueue),
                (e.updateQueue = t),
                Cu(e, t),
                va(n, !0),
                n.tail === null && n.tailMode === 'hidden' && !u.alternate && !pt)
              )
                return (Nt(e), null);
            } else
              2 * oe() - n.renderingStartTime > ju &&
                l !== 536870912 &&
                ((e.flags |= 128), (a = !0), va(n, !1), (e.lanes = 4194304));
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
            (l = Yt.current),
            B(Yt, a ? (l & 1) | 2 : l & 1),
            pt && Ge(e, n.treeForkCount),
            t)
          : (Nt(e), null);
      case 22:
      case 23:
        return (
          ve(e),
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
          t !== null && D(Ll),
          null
        );
      case 24:
        return (
          (l = null),
          t !== null && (l = t.memoizedState.cache),
          e.memoizedState.cache !== l && (e.flags |= 2048),
          Xe(Lt),
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
  function p0(t, e) {
    switch ((Ji(e), e.tag)) {
      case 1:
        return ((t = e.flags), t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null);
      case 3:
        return (
          Xe(Lt),
          qt(),
          (t = e.flags),
          (t & 65536) !== 0 && (t & 128) === 0 ? ((e.flags = (t & -65537) | 128), e) : null
        );
      case 26:
      case 27:
      case 5:
        return (Ga(e), null);
      case 31:
        if (e.memoizedState !== null) {
          if ((ve(e), e.alternate === null)) throw Error(f(340));
          ql();
        }
        return ((t = e.flags), t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null);
      case 13:
        if ((ve(e), (t = e.memoizedState), t !== null && t.dehydrated !== null)) {
          if (e.alternate === null) throw Error(f(340));
          ql();
        }
        return ((t = e.flags), t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null);
      case 19:
        return (D(Yt), null);
      case 4:
        return (qt(), null);
      case 10:
        return (Xe(e.type), null);
      case 22:
      case 23:
        return (
          ve(e),
          fc(),
          t !== null && D(Ll),
          (t = e.flags),
          t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null
        );
      case 24:
        return (Xe(Lt), null);
      case 25:
        return null;
      default:
        return null;
    }
  }
  function xs(t, e) {
    switch ((Ji(e), e.tag)) {
      case 3:
        (Xe(Lt), qt());
        break;
      case 26:
      case 27:
      case 5:
        Ga(e);
        break;
      case 4:
        qt();
        break;
      case 31:
        e.memoizedState !== null && ve(e);
        break;
      case 13:
        ve(e);
        break;
      case 19:
        D(Yt);
        break;
      case 10:
        Xe(e.type);
        break;
      case 22:
      case 23:
        (ve(e), fc(), t !== null && D(Ll));
        break;
      case 24:
        Xe(Lt);
    }
  }
  function ya(t, e) {
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
      _t(e, e.return, r);
    }
  }
  function ml(t, e, l) {
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
              var v = l,
                A = r;
              try {
                A();
              } catch (C) {
                _t(a, v, C);
              }
            }
          }
          n = n.next;
        } while (n !== u);
      }
    } catch (C) {
      _t(e, e.return, C);
    }
  }
  function Ms(t) {
    var e = t.updateQueue;
    if (e !== null) {
      var l = t.stateNode;
      try {
        yr(e, l);
      } catch (n) {
        _t(t, t.return, n);
      }
    }
  }
  function _s(t, e, l) {
    ((l.props = Kl(t.type, t.memoizedProps)), (l.state = t.memoizedState));
    try {
      l.componentWillUnmount();
    } catch (n) {
      _t(t, e, n);
    }
  }
  function ga(t, e) {
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
      _t(t, e, a);
    }
  }
  function je(t, e) {
    var l = t.ref,
      n = t.refCleanup;
    if (l !== null)
      if (typeof n == 'function')
        try {
          n();
        } catch (a) {
          _t(t, e, a);
        } finally {
          ((t.refCleanup = null), (t = t.alternate), t != null && (t.refCleanup = null));
        }
      else if (typeof l == 'function')
        try {
          l(null);
        } catch (a) {
          _t(t, e, a);
        }
      else l.current = null;
  }
  function Os(t) {
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
      _t(t, t.return, a);
    }
  }
  function Gc(t, e, l) {
    try {
      var n = t.stateNode;
      (L0(n, t.type, l, e), (n[le] = e));
    } catch (a) {
      _t(t, t.return, a);
    }
  }
  function Cs(t) {
    return (
      t.tag === 5 || t.tag === 3 || t.tag === 26 || (t.tag === 27 && Sl(t.type)) || t.tag === 4
    );
  }
  function Lc(t) {
    t: for (;;) {
      for (; t.sibling === null; ) {
        if (t.return === null || Cs(t.return)) return null;
        t = t.return;
      }
      for (
        t.sibling.return = t.return, t = t.sibling;
        t.tag !== 5 && t.tag !== 6 && t.tag !== 18;
      ) {
        if ((t.tag === 27 && Sl(t.type)) || t.flags & 2 || t.child === null || t.tag === 4)
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
            l != null || e.onclick !== null || (e.onclick = we)));
    else if (
      n !== 4 &&
      (n === 27 && Sl(t.type) && ((l = t.stateNode), (e = null)), (t = t.child), t !== null)
    )
      for (Xc(t, e, l), t = t.sibling; t !== null; ) (Xc(t, e, l), (t = t.sibling));
  }
  function Du(t, e, l) {
    var n = t.tag;
    if (n === 5 || n === 6) ((t = t.stateNode), e ? l.insertBefore(t, e) : l.appendChild(t));
    else if (n !== 4 && (n === 27 && Sl(t.type) && (l = t.stateNode), (t = t.child), t !== null))
      for (Du(t, e, l), t = t.sibling; t !== null; ) (Du(t, e, l), (t = t.sibling));
  }
  function Ds(t) {
    var e = t.stateNode,
      l = t.memoizedProps;
    try {
      for (var n = t.type, a = e.attributes; a.length; ) e.removeAttributeNode(a[0]);
      (Pt(e, n, l), (e[$t] = t), (e[le] = l));
    } catch (u) {
      _t(t, t.return, u);
    }
  }
  var Je = !1,
    Vt = !1,
    Qc = !1,
    Rs = typeof WeakSet == 'function' ? WeakSet : Set,
    Jt = null;
  function S0(t, e) {
    if (((t = t.containerInfo), (sf = Fu), (t = Qo(t)), Bi(t))) {
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
              v = -1,
              A = 0,
              C = 0,
              U = t,
              x = null;
            e: for (;;) {
              for (
                var _;
                U !== l || (a !== 0 && U.nodeType !== 3) || (r = c + a),
                  U !== u || (n !== 0 && U.nodeType !== 3) || (v = c + n),
                  U.nodeType === 3 && (c += U.nodeValue.length),
                  (_ = U.firstChild) !== null;
              )
                ((x = U), (U = _));
              for (;;) {
                if (U === t) break e;
                if (
                  (x === l && ++A === a && (r = c),
                  x === u && ++C === n && (v = c),
                  (_ = U.nextSibling) !== null)
                )
                  break;
                ((U = x), (x = U.parentNode));
              }
              U = _;
            }
            l = r === -1 || v === -1 ? null : { start: r, end: v };
          } else l = null;
        }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (df = { focusedElem: t, selectionRange: l }, Fu = !1, Jt = e; Jt !== null; )
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
                  var $ = Kl(l.type, a);
                  ((t = n.getSnapshotBeforeUpdate($, u)),
                    (n.__reactInternalSnapshotBeforeUpdate = t));
                } catch (et) {
                  _t(l, l.return, et);
                }
              }
              break;
            case 3:
              if ((t & 1024) !== 0) {
                if (((t = e.stateNode.containerInfo), (l = t.nodeType), l === 9)) vf(t);
                else if (l === 1)
                  switch (t.nodeName) {
                    case 'HEAD':
                    case 'HTML':
                    case 'BODY':
                      vf(t);
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
  function Us(t, e, l) {
    var n = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        (ke(t, l), n & 4 && ya(5, l));
        break;
      case 1:
        if ((ke(t, l), n & 4))
          if (((t = l.stateNode), e === null))
            try {
              t.componentDidMount();
            } catch (c) {
              _t(l, l.return, c);
            }
          else {
            var a = Kl(l.type, e.memoizedProps);
            e = e.memoizedState;
            try {
              t.componentDidUpdate(a, e, t.__reactInternalSnapshotBeforeUpdate);
            } catch (c) {
              _t(l, l.return, c);
            }
          }
        (n & 64 && Ms(l), n & 512 && ga(l, l.return));
        break;
      case 3:
        if ((ke(t, l), n & 64 && ((t = l.updateQueue), t !== null))) {
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
            yr(t, e);
          } catch (c) {
            _t(l, l.return, c);
          }
        }
        break;
      case 27:
        e === null && n & 4 && Ds(l);
      case 26:
      case 5:
        (ke(t, l), e === null && n & 4 && Os(l), n & 512 && ga(l, l.return));
        break;
      case 12:
        ke(t, l);
        break;
      case 31:
        (ke(t, l), n & 4 && Hs(t, l));
        break;
      case 13:
        (ke(t, l),
          n & 4 && Bs(t, l),
          n & 64 &&
            ((t = l.memoizedState),
            t !== null && ((t = t.dehydrated), t !== null && ((l = C0.bind(null, l)), k0(t, l)))));
        break;
      case 22:
        if (((n = l.memoizedState !== null || Je), !n)) {
          ((e = (e !== null && e.memoizedState !== null) || Vt), (a = Je));
          var u = Vt;
          ((Je = n),
            (Vt = e) && !u ? We(t, l, (l.subtreeFlags & 8772) !== 0) : ke(t, l),
            (Je = a),
            (Vt = u));
        }
        break;
      case 30:
        break;
      default:
        ke(t, l);
    }
  }
  function Ns(t) {
    var e = t.alternate;
    (e !== null && ((t.alternate = null), Ns(e)),
      (t.child = null),
      (t.deletions = null),
      (t.sibling = null),
      t.tag === 5 && ((e = t.stateNode), e !== null && pi(e)),
      (t.stateNode = null),
      (t.return = null),
      (t.dependencies = null),
      (t.memoizedProps = null),
      (t.memoizedState = null),
      (t.pendingProps = null),
      (t.stateNode = null),
      (t.updateQueue = null));
  }
  var Ht = null,
    ae = !1;
  function $e(t, e, l) {
    for (l = l.child; l !== null; ) (js(t, e, l), (l = l.sibling));
  }
  function js(t, e, l) {
    if (re && typeof re.onCommitFiberUnmount == 'function')
      try {
        re.onCommitFiberUnmount(Ln, l);
      } catch {}
    switch (l.tag) {
      case 26:
        (Vt || je(l, e),
          $e(t, e, l),
          l.memoizedState
            ? l.memoizedState.count--
            : l.stateNode && ((l = l.stateNode), l.parentNode.removeChild(l)));
        break;
      case 27:
        Vt || je(l, e);
        var n = Ht,
          a = ae;
        (Sl(l.type) && ((Ht = l.stateNode), (ae = !1)),
          $e(t, e, l),
          Ma(l.stateNode),
          (Ht = n),
          (ae = a));
        break;
      case 5:
        Vt || je(l, e);
      case 6:
        if (((n = Ht), (a = ae), (Ht = null), $e(t, e, l), (Ht = n), (ae = a), Ht !== null))
          if (ae)
            try {
              (Ht.nodeType === 9
                ? Ht.body
                : Ht.nodeName === 'HTML'
                  ? Ht.ownerDocument.body
                  : Ht
              ).removeChild(l.stateNode);
            } catch (u) {
              _t(l, e, u);
            }
          else
            try {
              Ht.removeChild(l.stateNode);
            } catch (u) {
              _t(l, e, u);
            }
        break;
      case 18:
        Ht !== null &&
          (ae
            ? ((t = Ht),
              Md(
                t.nodeType === 9 ? t.body : t.nodeName === 'HTML' ? t.ownerDocument.body : t,
                l.stateNode,
              ),
              jn(t))
            : Md(Ht, l.stateNode));
        break;
      case 4:
        ((n = Ht),
          (a = ae),
          (Ht = l.stateNode.containerInfo),
          (ae = !0),
          $e(t, e, l),
          (Ht = n),
          (ae = a));
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        (ml(2, l, e), Vt || ml(4, l, e), $e(t, e, l));
        break;
      case 1:
        (Vt ||
          (je(l, e), (n = l.stateNode), typeof n.componentWillUnmount == 'function' && _s(l, e, n)),
          $e(t, e, l));
        break;
      case 21:
        $e(t, e, l);
        break;
      case 22:
        ((Vt = (n = Vt) || l.memoizedState !== null), $e(t, e, l), (Vt = n));
        break;
      default:
        $e(t, e, l);
    }
  }
  function Hs(t, e) {
    if (
      e.memoizedState === null &&
      ((t = e.alternate), t !== null && ((t = t.memoizedState), t !== null))
    ) {
      t = t.dehydrated;
      try {
        jn(t);
      } catch (l) {
        _t(e, e.return, l);
      }
    }
  }
  function Bs(t, e) {
    if (
      e.memoizedState === null &&
      ((t = e.alternate),
      t !== null && ((t = t.memoizedState), t !== null && ((t = t.dehydrated), t !== null)))
    )
      try {
        jn(t);
      } catch (l) {
        _t(e, e.return, l);
      }
  }
  function E0(t) {
    switch (t.tag) {
      case 31:
      case 13:
      case 19:
        var e = t.stateNode;
        return (e === null && (e = t.stateNode = new Rs()), e);
      case 22:
        return (
          (t = t.stateNode),
          (e = t._retryCache),
          e === null && (e = t._retryCache = new Rs()),
          e
        );
      default:
        throw Error(f(435, t.tag));
    }
  }
  function Ru(t, e) {
    var l = E0(t);
    e.forEach(function (n) {
      if (!l.has(n)) {
        l.add(n);
        var a = D0.bind(null, t, n);
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
              if (Sl(r.type)) {
                ((Ht = r.stateNode), (ae = !1));
                break t;
              }
              break;
            case 5:
              ((Ht = r.stateNode), (ae = !1));
              break t;
            case 3:
            case 4:
              ((Ht = r.stateNode.containerInfo), (ae = !0));
              break t;
          }
          r = r.return;
        }
        if (Ht === null) throw Error(f(160));
        (js(u, c, a),
          (Ht = null),
          (ae = !1),
          (u = a.alternate),
          u !== null && (u.return = null),
          (a.return = null));
      }
    if (e.subtreeFlags & 13886) for (e = e.child; e !== null; ) (ws(e, t), (e = e.sibling));
  }
  var De = null;
  function ws(t, e) {
    var l = t.alternate,
      n = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        (ue(e, t), ie(t), n & 4 && (ml(3, t, t.return), ya(3, t), ml(5, t, t.return)));
        break;
      case 1:
        (ue(e, t),
          ie(t),
          n & 512 && (Vt || l === null || je(l, l.return)),
          n & 64 &&
            Je &&
            ((t = t.updateQueue),
            t !== null &&
              ((n = t.callbacks),
              n !== null &&
                ((l = t.shared.hiddenCallbacks),
                (t.shared.hiddenCallbacks = l === null ? n : l.concat(n))))));
        break;
      case 26:
        var a = De;
        if ((ue(e, t), ie(t), n & 512 && (Vt || l === null || je(l, l.return)), n & 4)) {
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
                          u[Vn] ||
                          u[$t] ||
                          u.namespaceURI === 'http://www.w3.org/2000/svg' ||
                          u.hasAttribute('itemprop')) &&
                          ((u = a.createElement(n)),
                          a.head.insertBefore(u, a.querySelector('head > title'))),
                        Pt(u, n, l),
                        (u[$t] = t),
                        Kt(u),
                        (n = u));
                      break t;
                    case 'link':
                      var c = wd('link', 'href', a).get(n + (l.href || ''));
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
                      ((u = a.createElement(n)), Pt(u, n, l), a.head.appendChild(u));
                      break;
                    case 'meta':
                      if ((c = wd('meta', 'content', a).get(n + (l.content || '')))) {
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
                      ((u = a.createElement(n)), Pt(u, n, l), a.head.appendChild(u));
                      break;
                    default:
                      throw Error(f(468, n));
                  }
                  ((u[$t] = t), Kt(u), (n = u));
                }
                t.stateNode = n;
              } else qd(a, t.type, t.stateNode);
            else t.stateNode = Bd(a, n, t.memoizedProps);
          else
            u !== n
              ? (u === null
                  ? l.stateNode !== null && ((l = l.stateNode), l.parentNode.removeChild(l))
                  : u.count--,
                n === null ? qd(a, t.type, t.stateNode) : Bd(a, n, t.memoizedProps))
              : n === null && t.stateNode !== null && Gc(t, t.memoizedProps, l.memoizedProps);
        }
        break;
      case 27:
        (ue(e, t),
          ie(t),
          n & 512 && (Vt || l === null || je(l, l.return)),
          l !== null && n & 4 && Gc(t, t.memoizedProps, l.memoizedProps));
        break;
      case 5:
        if ((ue(e, t), ie(t), n & 512 && (Vt || l === null || je(l, l.return)), t.flags & 32)) {
          a = t.stateNode;
          try {
            ln(a, '');
          } catch ($) {
            _t(t, t.return, $);
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
          } catch ($) {
            _t(t, t.return, $);
          }
        }
        break;
      case 3:
        if (
          ((Ju = null),
          (a = De),
          (De = Zu(e.containerInfo)),
          ue(e, t),
          (De = a),
          ie(t),
          n & 4 && l !== null && l.memoizedState.isDehydrated)
        )
          try {
            jn(e.containerInfo);
          } catch ($) {
            _t(t, t.return, $);
          }
        Qc && ((Qc = !1), qs(t));
        break;
      case 4:
        ((n = De), (De = Zu(t.stateNode.containerInfo)), ue(e, t), ie(t), (De = n));
        break;
      case 12:
        (ue(e, t), ie(t));
        break;
      case 31:
        (ue(e, t),
          ie(t),
          n & 4 && ((n = t.updateQueue), n !== null && ((t.updateQueue = null), Ru(t, n))));
        break;
      case 13:
        (ue(e, t),
          ie(t),
          t.child.flags & 8192 &&
            (t.memoizedState !== null) != (l !== null && l.memoizedState !== null) &&
            (Nu = oe()),
          n & 4 && ((n = t.updateQueue), n !== null && ((t.updateQueue = null), Ru(t, n))));
        break;
      case 22:
        a = t.memoizedState !== null;
        var v = l !== null && l.memoizedState !== null,
          A = Je,
          C = Vt;
        if (((Je = A || a), (Vt = C || v), ue(e, t), (Vt = C), (Je = A), ie(t), n & 8192))
          t: for (
            e = t.stateNode,
              e._visibility = a ? e._visibility & -2 : e._visibility | 1,
              a && (l === null || v || Je || Vt || Jl(t)),
              l = null,
              e = t;
            ;
          ) {
            if (e.tag === 5 || e.tag === 26) {
              if (l === null) {
                v = l = e;
                try {
                  if (((u = v.stateNode), a))
                    ((c = u.style),
                      typeof c.setProperty == 'function'
                        ? c.setProperty('display', 'none', 'important')
                        : (c.display = 'none'));
                  else {
                    r = v.stateNode;
                    var U = v.memoizedProps.style,
                      x = U != null && U.hasOwnProperty('display') ? U.display : null;
                    r.style.display = x == null || typeof x == 'boolean' ? '' : ('' + x).trim();
                  }
                } catch ($) {
                  _t(v, v.return, $);
                }
              }
            } else if (e.tag === 6) {
              if (l === null) {
                v = e;
                try {
                  v.stateNode.nodeValue = a ? '' : v.memoizedProps;
                } catch ($) {
                  _t(v, v.return, $);
                }
              }
            } else if (e.tag === 18) {
              if (l === null) {
                v = e;
                try {
                  var _ = v.stateNode;
                  a ? _d(_, !0) : _d(v.stateNode, !1);
                } catch ($) {
                  _t(v, v.return, $);
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
          n !== null && ((l = n.retryQueue), l !== null && ((n.retryQueue = null), Ru(t, l))));
        break;
      case 19:
        (ue(e, t),
          ie(t),
          n & 4 && ((n = t.updateQueue), n !== null && ((t.updateQueue = null), Ru(t, n))));
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
          if (Cs(n)) {
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
            l.flags & 32 && (ln(c, ''), (l.flags &= -33));
            var r = Lc(t);
            Du(t, r, c);
            break;
          case 3:
          case 4:
            var v = l.stateNode.containerInfo,
              A = Lc(t);
            Xc(t, A, v);
            break;
          default:
            throw Error(f(161));
        }
      } catch (C) {
        _t(t, t.return, C);
      }
      t.flags &= -3;
    }
    e & 4096 && (t.flags &= -4097);
  }
  function qs(t) {
    if (t.subtreeFlags & 1024)
      for (t = t.child; t !== null; ) {
        var e = t;
        (qs(e), e.tag === 5 && e.flags & 1024 && e.stateNode.reset(), (t = t.sibling));
      }
  }
  function ke(t, e) {
    if (e.subtreeFlags & 8772)
      for (e = e.child; e !== null; ) (Us(t, e.alternate, e), (e = e.sibling));
  }
  function Jl(t) {
    for (t = t.child; t !== null; ) {
      var e = t;
      switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          (ml(4, e, e.return), Jl(e));
          break;
        case 1:
          je(e, e.return);
          var l = e.stateNode;
          (typeof l.componentWillUnmount == 'function' && _s(e, e.return, l), Jl(e));
          break;
        case 27:
          Ma(e.stateNode);
        case 26:
        case 5:
          (je(e, e.return), Jl(e));
          break;
        case 22:
          e.memoizedState === null && Jl(e);
          break;
        case 30:
          Jl(e);
          break;
        default:
          Jl(e);
      }
      t = t.sibling;
    }
  }
  function We(t, e, l) {
    for (l = l && (e.subtreeFlags & 8772) !== 0, e = e.child; e !== null; ) {
      var n = e.alternate,
        a = t,
        u = e,
        c = u.flags;
      switch (u.tag) {
        case 0:
        case 11:
        case 15:
          (We(a, u, l), ya(4, u));
          break;
        case 1:
          if ((We(a, u, l), (n = u), (a = n.stateNode), typeof a.componentDidMount == 'function'))
            try {
              a.componentDidMount();
            } catch (A) {
              _t(n, n.return, A);
            }
          if (((n = u), (a = n.updateQueue), a !== null)) {
            var r = n.stateNode;
            try {
              var v = a.shared.hiddenCallbacks;
              if (v !== null)
                for (a.shared.hiddenCallbacks = null, a = 0; a < v.length; a++) vr(v[a], r);
            } catch (A) {
              _t(n, n.return, A);
            }
          }
          (l && c & 64 && Ms(u), ga(u, u.return));
          break;
        case 27:
          Ds(u);
        case 26:
        case 5:
          (We(a, u, l), l && n === null && c & 4 && Os(u), ga(u, u.return));
          break;
        case 12:
          We(a, u, l);
          break;
        case 31:
          (We(a, u, l), l && c & 4 && Hs(a, u));
          break;
        case 13:
          (We(a, u, l), l && c & 4 && Bs(a, u));
          break;
        case 22:
          (u.memoizedState === null && We(a, u, l), ga(u, u.return));
          break;
        case 30:
          break;
        default:
          We(a, u, l);
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
      t !== l && (t != null && t.refCount++, l != null && na(l)));
  }
  function Zc(t, e) {
    ((t = null),
      e.alternate !== null && (t = e.alternate.memoizedState.cache),
      (e = e.memoizedState.cache),
      e !== t && (e.refCount++, t != null && na(t)));
  }
  function Re(t, e, l, n) {
    if (e.subtreeFlags & 10256) for (e = e.child; e !== null; ) (Ys(t, e, l, n), (e = e.sibling));
  }
  function Ys(t, e, l, n) {
    var a = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        (Re(t, e, l, n), a & 2048 && ya(9, e));
        break;
      case 1:
        Re(t, e, l, n);
        break;
      case 3:
        (Re(t, e, l, n),
          a & 2048 &&
            ((t = null),
            e.alternate !== null && (t = e.alternate.memoizedState.cache),
            (e = e.memoizedState.cache),
            e !== t && (e.refCount++, t != null && na(t))));
        break;
      case 12:
        if (a & 2048) {
          (Re(t, e, l, n), (t = e.stateNode));
          try {
            var u = e.memoizedProps,
              c = u.id,
              r = u.onPostCommit;
            typeof r == 'function' &&
              r(c, e.alternate === null ? 'mount' : 'update', t.passiveEffectDuration, -0);
          } catch (v) {
            _t(e, e.return, v);
          }
        } else Re(t, e, l, n);
        break;
      case 31:
        Re(t, e, l, n);
        break;
      case 13:
        Re(t, e, l, n);
        break;
      case 23:
        break;
      case 22:
        ((u = e.stateNode),
          (c = e.alternate),
          e.memoizedState !== null
            ? u._visibility & 2
              ? Re(t, e, l, n)
              : ba(t, e)
            : u._visibility & 2
              ? Re(t, e, l, n)
              : ((u._visibility |= 2), Tn(t, e, l, n, (e.subtreeFlags & 10256) !== 0 || !1)),
          a & 2048 && Vc(c, e));
        break;
      case 24:
        (Re(t, e, l, n), a & 2048 && Zc(e.alternate, e));
        break;
      default:
        Re(t, e, l, n);
    }
  }
  function Tn(t, e, l, n, a) {
    for (a = a && ((e.subtreeFlags & 10256) !== 0 || !1), e = e.child; e !== null; ) {
      var u = t,
        c = e,
        r = l,
        v = n,
        A = c.flags;
      switch (c.tag) {
        case 0:
        case 11:
        case 15:
          (Tn(u, c, r, v, a), ya(8, c));
          break;
        case 23:
          break;
        case 22:
          var C = c.stateNode;
          (c.memoizedState !== null
            ? C._visibility & 2
              ? Tn(u, c, r, v, a)
              : ba(u, c)
            : ((C._visibility |= 2), Tn(u, c, r, v, a)),
            a && A & 2048 && Vc(c.alternate, c));
          break;
        case 24:
          (Tn(u, c, r, v, a), a && A & 2048 && Zc(c.alternate, c));
          break;
        default:
          Tn(u, c, r, v, a);
      }
      e = e.sibling;
    }
  }
  function ba(t, e) {
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; ) {
        var l = t,
          n = e,
          a = n.flags;
        switch (n.tag) {
          case 22:
            (ba(l, n), a & 2048 && Vc(n.alternate, n));
            break;
          case 24:
            (ba(l, n), a & 2048 && Zc(n.alternate, n));
            break;
          default:
            ba(l, n);
        }
        e = e.sibling;
      }
  }
  var pa = 8192;
  function An(t, e, l) {
    if (t.subtreeFlags & pa) for (t = t.child; t !== null; ) (Gs(t, e, l), (t = t.sibling));
  }
  function Gs(t, e, l) {
    switch (t.tag) {
      case 26:
        (An(t, e, l),
          t.flags & pa && t.memoizedState !== null && cv(l, De, t.memoizedState, t.memoizedProps));
        break;
      case 5:
        An(t, e, l);
        break;
      case 3:
      case 4:
        var n = De;
        ((De = Zu(t.stateNode.containerInfo)), An(t, e, l), (De = n));
        break;
      case 22:
        t.memoizedState === null &&
          ((n = t.alternate),
          n !== null && n.memoizedState !== null
            ? ((n = pa), (pa = 16777216), An(t, e, l), (pa = n))
            : An(t, e, l));
        break;
      default:
        An(t, e, l);
    }
  }
  function Ls(t) {
    var e = t.alternate;
    if (e !== null && ((t = e.child), t !== null)) {
      e.child = null;
      do ((e = t.sibling), (t.sibling = null), (t = e));
      while (t !== null);
    }
  }
  function Sa(t) {
    var e = t.deletions;
    if ((t.flags & 16) !== 0) {
      if (e !== null)
        for (var l = 0; l < e.length; l++) {
          var n = e[l];
          ((Jt = n), Qs(n, t));
        }
      Ls(t);
    }
    if (t.subtreeFlags & 10256) for (t = t.child; t !== null; ) (Xs(t), (t = t.sibling));
  }
  function Xs(t) {
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        (Sa(t), t.flags & 2048 && ml(9, t, t.return));
        break;
      case 3:
        Sa(t);
        break;
      case 12:
        Sa(t);
        break;
      case 22:
        var e = t.stateNode;
        t.memoizedState !== null && e._visibility & 2 && (t.return === null || t.return.tag !== 13)
          ? ((e._visibility &= -3), Uu(t))
          : Sa(t);
        break;
      default:
        Sa(t);
    }
  }
  function Uu(t) {
    var e = t.deletions;
    if ((t.flags & 16) !== 0) {
      if (e !== null)
        for (var l = 0; l < e.length; l++) {
          var n = e[l];
          ((Jt = n), Qs(n, t));
        }
      Ls(t);
    }
    for (t = t.child; t !== null; ) {
      switch (((e = t), e.tag)) {
        case 0:
        case 11:
        case 15:
          (ml(8, e, e.return), Uu(e));
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
  function Qs(t, e) {
    for (; Jt !== null; ) {
      var l = Jt;
      switch (l.tag) {
        case 0:
        case 11:
        case 15:
          ml(8, l, e);
          break;
        case 23:
        case 22:
          if (l.memoizedState !== null && l.memoizedState.cachePool !== null) {
            var n = l.memoizedState.cachePool.pool;
            n != null && n.refCount++;
          }
          break;
        case 24:
          na(l.memoizedState.cache);
      }
      if (((n = l.child), n !== null)) ((n.return = l), (Jt = n));
      else
        t: for (l = t; Jt !== null; ) {
          n = Jt;
          var a = n.sibling,
            u = n.return;
          if ((Ns(n), n === l)) {
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
  var z0 = {
      getCacheForType: function (t) {
        var e = Wt(Lt),
          l = e.data.get(t);
        return (l === void 0 && ((l = t()), e.data.set(t, l)), l);
      },
      cacheSignal: function () {
        return Wt(Lt).controller.signal;
      },
    },
    T0 = typeof WeakMap == 'function' ? WeakMap : Map,
    xt = 0,
    Rt = null,
    ht = null,
    yt = 0,
    Mt = 0,
    ye = null,
    hl = !1,
    xn = !1,
    Kc = !1,
    Fe = 0,
    wt = 0,
    vl = 0,
    $l = 0,
    Jc = 0,
    ge = 0,
    Mn = 0,
    Ea = null,
    ce = null,
    $c = !1,
    Nu = 0,
    Vs = 0,
    ju = 1 / 0,
    Hu = null,
    yl = null,
    Zt = 0,
    gl = null,
    _n = null,
    Pe = 0,
    kc = 0,
    Wc = null,
    Zs = null,
    za = 0,
    Fc = null;
  function be() {
    return (xt & 2) !== 0 && yt !== 0 ? yt & -yt : M.T !== null ? nf() : io();
  }
  function Ks() {
    if (ge === 0)
      if ((yt & 536870912) === 0 || pt) {
        var t = Qa;
        ((Qa <<= 1), (Qa & 3932160) === 0 && (Qa = 262144), (ge = t));
      } else ge = 536870912;
    return ((t = he.current), t !== null && (t.flags |= 32), ge);
  }
  function fe(t, e, l) {
    (((t === Rt && (Mt === 2 || Mt === 9)) || t.cancelPendingCommit !== null) &&
      (On(t, 0), bl(t, yt, ge, !1)),
      Qn(t, l),
      ((xt & 2) === 0 || t !== Rt) &&
        (t === Rt && ((xt & 2) === 0 && ($l |= l), wt === 4 && bl(t, yt, ge, !1)), He(t)));
  }
  function Js(t, e, l) {
    if ((xt & 6) !== 0) throw Error(f(327));
    var n = (!l && (e & 127) === 0 && (e & t.expiredLanes) === 0) || Xn(t, e),
      a = n ? M0(t, e) : Ic(t, e, !0),
      u = n;
    do {
      if (a === 0) {
        xn && !n && bl(t, e, 0, !1);
        break;
      } else {
        if (((l = t.current.alternate), u && !A0(l))) {
          ((a = Ic(t, e, !1)), (u = !1));
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
              var v = r.current.memoizedState.isDehydrated;
              if ((v && (On(r, c).flags |= 256), (c = Ic(r, c, !1)), c !== 2)) {
                if (Kc && !v) {
                  ((r.errorRecoveryDisabledLanes |= u), ($l |= u), (a = 4));
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
          (On(t, 0), bl(t, e, 0, !0));
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
              bl(n, e, ge, !hl);
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
          if ((e & 62914560) === e && ((a = Nu + 300 - oe()), 10 < a)) {
            if ((bl(n, e, ge, !hl), Za(n, 0, !0) !== 0)) break t;
            ((Pe = e),
              (n.timeoutHandle = Ad(
                $s.bind(null, n, l, ce, Hu, $c, e, ge, $l, Mn, hl, u, 'Throttled', -0, 0),
                a,
              )));
            break t;
          }
          $s(n, l, ce, Hu, $c, e, ge, $l, Mn, hl, u, null, -0, 0);
        }
      }
      break;
    } while (!0);
    He(t);
  }
  function $s(t, e, l, n, a, u, c, r, v, A, C, U, x, _) {
    if (((t.timeoutHandle = -1), (U = e.subtreeFlags), U & 8192 || (U & 16785408) === 16785408)) {
      ((U = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: we,
      }),
        Gs(e, u, U));
      var $ = (u & 62914560) === u ? Nu - oe() : (u & 4194048) === u ? Vs - oe() : 0;
      if ((($ = fv(U, $)), $ !== null)) {
        ((Pe = u),
          (t.cancelPendingCommit = $(ld.bind(null, t, e, u, l, n, a, c, r, v, C, U, null, x, _))),
          bl(t, u, c, !A));
        return;
      }
    }
    ld(t, e, u, l, n, a, c, r, v);
  }
  function A0(t) {
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
  function bl(t, e, l, n) {
    ((e &= ~Jc),
      (e &= ~$l),
      (t.suspendedLanes |= e),
      (t.pingedLanes &= ~e),
      n && (t.warmLanes |= e),
      (n = t.expirationTimes));
    for (var a = e; 0 < a; ) {
      var u = 31 - se(a),
        c = 1 << u;
      ((n[u] = -1), (a &= ~c));
    }
    l !== 0 && no(t, l, e);
  }
  function Bu() {
    return (xt & 6) === 0 ? (Ta(0), !1) : !0;
  }
  function Pc() {
    if (ht !== null) {
      if (Mt === 0) var t = ht.return;
      else ((t = ht), (Le = Yl = null), hc(t), (bn = null), (ua = 0), (t = ht));
      for (; t !== null; ) (xs(t.alternate, t), (t = t.return));
      ht = null;
    }
  }
  function On(t, e) {
    var l = t.timeoutHandle;
    (l !== -1 && ((t.timeoutHandle = -1), V0(l)),
      (l = t.cancelPendingCommit),
      l !== null && ((t.cancelPendingCommit = null), l()),
      (Pe = 0),
      Pc(),
      (Rt = t),
      (ht = l = Ye(t.current, null)),
      (yt = e),
      (Mt = 0),
      (ye = null),
      (hl = !1),
      (xn = Xn(t, e)),
      (Kc = !1),
      (Mn = ge = Jc = $l = vl = wt = 0),
      (ce = Ea = null),
      ($c = !1),
      (e & 8) !== 0 && (e |= e & 32));
    var n = t.entangledLanes;
    if (n !== 0)
      for (t = t.entanglements, n &= e; 0 < n; ) {
        var a = 31 - se(n),
          u = 1 << a;
        ((e |= t[a]), (n &= ~u));
      }
    return ((Fe = e), nu(), l);
  }
  function ks(t, e) {
    ((ot = null),
      (M.H = ma),
      e === gn || e === su
        ? ((e = sr()), (Mt = 3))
        : e === lc
          ? ((e = sr()), (Mt = 4))
          : (Mt =
              e === Dc
                ? 8
                : e !== null && typeof e == 'object' && typeof e.then == 'function'
                  ? 6
                  : 1),
      (ye = e),
      ht === null && ((wt = 1), xu(t, ze(e, t.current))));
  }
  function Ws() {
    var t = he.current;
    return t === null
      ? !0
      : (yt & 4194048) === yt
        ? Me === null
        : (yt & 62914560) === yt || (yt & 536870912) !== 0
          ? t === Me
          : !1;
  }
  function Fs() {
    var t = M.H;
    return ((M.H = ma), t === null ? ma : t);
  }
  function Ps() {
    var t = M.A;
    return ((M.A = z0), t);
  }
  function wu() {
    ((wt = 4),
      hl || ((yt & 4194048) !== yt && he.current !== null) || (xn = !0),
      ((vl & 134217727) === 0 && ($l & 134217727) === 0) || Rt === null || bl(Rt, yt, ge, !1));
  }
  function Ic(t, e, l) {
    var n = xt;
    xt |= 2;
    var a = Fs(),
      u = Ps();
    ((Rt !== t || yt !== e) && ((Hu = null), On(t, e)), (e = !1));
    var c = wt;
    t: do
      try {
        if (Mt !== 0 && ht !== null) {
          var r = ht,
            v = ye;
          switch (Mt) {
            case 8:
              (Pc(), (c = 6));
              break t;
            case 3:
            case 2:
            case 9:
            case 6:
              he.current === null && (e = !0);
              var A = Mt;
              if (((Mt = 0), (ye = null), Cn(t, r, v, A), l && xn)) {
                c = 0;
                break t;
              }
              break;
            default:
              ((A = Mt), (Mt = 0), (ye = null), Cn(t, r, v, A));
          }
        }
        (x0(), (c = wt));
        break;
      } catch (C) {
        ks(t, C);
      }
    while (!0);
    return (
      e && t.shellSuspendCounter++,
      (Le = Yl = null),
      (xt = n),
      (M.H = a),
      (M.A = u),
      ht === null && ((Rt = null), (yt = 0), nu()),
      c
    );
  }
  function x0() {
    for (; ht !== null; ) Is(ht);
  }
  function M0(t, e) {
    var l = xt;
    xt |= 2;
    var n = Fs(),
      a = Ps();
    Rt !== t || yt !== e ? ((Hu = null), (ju = oe() + 500), On(t, e)) : (xn = Xn(t, e));
    t: do
      try {
        if (Mt !== 0 && ht !== null) {
          e = ht;
          var u = ye;
          e: switch (Mt) {
            case 1:
              ((Mt = 0), (ye = null), Cn(t, e, u, 1));
              break;
            case 2:
            case 9:
              if (or(u)) {
                ((Mt = 0), (ye = null), td(e));
                break;
              }
              ((e = function () {
                ((Mt !== 2 && Mt !== 9) || Rt !== t || (Mt = 7), He(t));
              }),
                u.then(e, e));
              break t;
            case 3:
              Mt = 7;
              break t;
            case 4:
              Mt = 5;
              break t;
            case 7:
              or(u) ? ((Mt = 0), (ye = null), td(e)) : ((Mt = 0), (ye = null), Cn(t, e, u, 7));
              break;
            case 5:
              var c = null;
              switch (ht.tag) {
                case 26:
                  c = ht.memoizedState;
                case 5:
                case 27:
                  var r = ht;
                  if (c ? Yd(c) : r.stateNode.complete) {
                    ((Mt = 0), (ye = null));
                    var v = r.sibling;
                    if (v !== null) ht = v;
                    else {
                      var A = r.return;
                      A !== null ? ((ht = A), qu(A)) : (ht = null);
                    }
                    break e;
                  }
              }
              ((Mt = 0), (ye = null), Cn(t, e, u, 5));
              break;
            case 6:
              ((Mt = 0), (ye = null), Cn(t, e, u, 6));
              break;
            case 8:
              (Pc(), (wt = 6));
              break t;
            default:
              throw Error(f(462));
          }
        }
        _0();
        break;
      } catch (C) {
        ks(t, C);
      }
    while (!0);
    return (
      (Le = Yl = null),
      (M.H = n),
      (M.A = a),
      (xt = l),
      ht !== null ? 0 : ((Rt = null), (yt = 0), nu(), wt)
    );
  }
  function _0() {
    for (; ht !== null && !Wm(); ) Is(ht);
  }
  function Is(t) {
    var e = Ts(t.alternate, t, Fe);
    ((t.memoizedProps = t.pendingProps), e === null ? qu(t) : (ht = e));
  }
  function td(t) {
    var e = t,
      l = e.alternate;
    switch (e.tag) {
      case 15:
      case 0:
        e = gs(l, e, e.pendingProps, e.type, void 0, yt);
        break;
      case 11:
        e = gs(l, e, e.pendingProps, e.type.render, e.ref, yt);
        break;
      case 5:
        hc(e);
      default:
        (xs(l, e), (e = ht = Po(e, Fe)), (e = Ts(l, e, Fe)));
    }
    ((t.memoizedProps = t.pendingProps), e === null ? qu(t) : (ht = e));
  }
  function Cn(t, e, l, n) {
    ((Le = Yl = null), hc(e), (bn = null), (ua = 0));
    var a = e.return;
    try {
      if (v0(t, a, e, l, yt)) {
        ((wt = 1), xu(t, ze(l, t.current)), (ht = null));
        return;
      }
    } catch (u) {
      if (a !== null) throw ((ht = a), u);
      ((wt = 1), xu(t, ze(l, t.current)), (ht = null));
      return;
    }
    e.flags & 32768
      ? (pt || n === 1
          ? (t = !0)
          : xn || (yt & 536870912) !== 0
            ? (t = !1)
            : ((hl = t = !0),
              (n === 2 || n === 9 || n === 3 || n === 6) &&
                ((n = he.current), n !== null && n.tag === 13 && (n.flags |= 16384))),
        ed(e, t))
      : qu(e);
  }
  function qu(t) {
    var e = t;
    do {
      if ((e.flags & 32768) !== 0) {
        ed(e, hl);
        return;
      }
      t = e.return;
      var l = b0(e.alternate, e, Fe);
      if (l !== null) {
        ht = l;
        return;
      }
      if (((e = e.sibling), e !== null)) {
        ht = e;
        return;
      }
      ht = e = t;
    } while (e !== null);
    wt === 0 && (wt = 5);
  }
  function ed(t, e) {
    do {
      var l = p0(t.alternate, t);
      if (l !== null) {
        ((l.flags &= 32767), (ht = l));
        return;
      }
      if (
        ((l = t.return),
        l !== null && ((l.flags |= 32768), (l.subtreeFlags = 0), (l.deletions = null)),
        !e && ((t = t.sibling), t !== null))
      ) {
        ht = t;
        return;
      }
      ht = t = l;
    } while (t !== null);
    ((wt = 6), (ht = null));
  }
  function ld(t, e, l, n, a, u, c, r, v) {
    t.cancelPendingCommit = null;
    do Yu();
    while (Zt !== 0);
    if ((xt & 6) !== 0) throw Error(f(327));
    if (e !== null) {
      if (e === t.current) throw Error(f(177));
      if (
        ((u = e.lanes | e.childLanes),
        (u |= Li),
        ih(t, l, u, c, r, v),
        t === Rt && ((ht = Rt = null), (yt = 0)),
        (_n = e),
        (gl = t),
        (Pe = l),
        (kc = u),
        (Wc = a),
        (Zs = n),
        (e.subtreeFlags & 10256) !== 0 || (e.flags & 10256) !== 0
          ? ((t.callbackNode = null),
            (t.callbackPriority = 0),
            R0(La, function () {
              return (cd(), null);
            }))
          : ((t.callbackNode = null), (t.callbackPriority = 0)),
        (n = (e.flags & 13878) !== 0),
        (e.subtreeFlags & 13878) !== 0 || n)
      ) {
        ((n = M.T), (M.T = null), (a = H.p), (H.p = 2), (c = xt), (xt |= 4));
        try {
          S0(t, e, l);
        } finally {
          ((xt = c), (H.p = a), (M.T = n));
        }
      }
      ((Zt = 1), nd(), ad(), ud());
    }
  }
  function nd() {
    if (Zt === 1) {
      Zt = 0;
      var t = gl,
        e = _n,
        l = (e.flags & 13878) !== 0;
      if ((e.subtreeFlags & 13878) !== 0 || l) {
        ((l = M.T), (M.T = null));
        var n = H.p;
        H.p = 2;
        var a = xt;
        xt |= 4;
        try {
          ws(e, t);
          var u = df,
            c = Qo(t.containerInfo),
            r = u.focusedElem,
            v = u.selectionRange;
          if (c !== r && r && r.ownerDocument && Xo(r.ownerDocument.documentElement, r)) {
            if (v !== null && Bi(r)) {
              var A = v.start,
                C = v.end;
              if ((C === void 0 && (C = A), 'selectionStart' in r))
                ((r.selectionStart = A), (r.selectionEnd = Math.min(C, r.value.length)));
              else {
                var U = r.ownerDocument || document,
                  x = (U && U.defaultView) || window;
                if (x.getSelection) {
                  var _ = x.getSelection(),
                    $ = r.textContent.length,
                    et = Math.min(v.start, $),
                    Dt = v.end === void 0 ? et : Math.min(v.end, $);
                  !_.extend && et > Dt && ((c = Dt), (Dt = et), (et = c));
                  var E = Lo(r, et),
                    p = Lo(r, Dt);
                  if (
                    E &&
                    p &&
                    (_.rangeCount !== 1 ||
                      _.anchorNode !== E.node ||
                      _.anchorOffset !== E.offset ||
                      _.focusNode !== p.node ||
                      _.focusOffset !== p.offset)
                  ) {
                    var T = U.createRange();
                    (T.setStart(E.node, E.offset),
                      _.removeAllRanges(),
                      et > Dt
                        ? (_.addRange(T), _.extend(p.node, p.offset))
                        : (T.setEnd(p.node, p.offset), _.addRange(T)));
                  }
                }
              }
            }
            for (U = [], _ = r; (_ = _.parentNode); )
              _.nodeType === 1 && U.push({ element: _, left: _.scrollLeft, top: _.scrollTop });
            for (typeof r.focus == 'function' && r.focus(), r = 0; r < U.length; r++) {
              var R = U[r];
              ((R.element.scrollLeft = R.left), (R.element.scrollTop = R.top));
            }
          }
          ((Fu = !!sf), (df = sf = null));
        } finally {
          ((xt = a), (H.p = n), (M.T = l));
        }
      }
      ((t.current = e), (Zt = 2));
    }
  }
  function ad() {
    if (Zt === 2) {
      Zt = 0;
      var t = gl,
        e = _n,
        l = (e.flags & 8772) !== 0;
      if ((e.subtreeFlags & 8772) !== 0 || l) {
        ((l = M.T), (M.T = null));
        var n = H.p;
        H.p = 2;
        var a = xt;
        xt |= 4;
        try {
          Us(t, e.alternate, e);
        } finally {
          ((xt = a), (H.p = n), (M.T = l));
        }
      }
      Zt = 3;
    }
  }
  function ud() {
    if (Zt === 4 || Zt === 3) {
      ((Zt = 0), Fm());
      var t = gl,
        e = _n,
        l = Pe,
        n = Zs;
      (e.subtreeFlags & 10256) !== 0 || (e.flags & 10256) !== 0
        ? (Zt = 5)
        : ((Zt = 0), (_n = gl = null), id(t, t.pendingLanes));
      var a = t.pendingLanes;
      if (
        (a === 0 && (yl = null),
        gi(l),
        (e = e.stateNode),
        re && typeof re.onCommitFiberRoot == 'function')
      )
        try {
          re.onCommitFiberRoot(Ln, e, void 0, (e.current.flags & 128) === 128);
        } catch {}
      if (n !== null) {
        ((e = M.T), (a = H.p), (H.p = 2), (M.T = null));
        try {
          for (var u = t.onRecoverableError, c = 0; c < n.length; c++) {
            var r = n[c];
            u(r.value, { componentStack: r.stack });
          }
        } finally {
          ((M.T = e), (H.p = a));
        }
      }
      ((Pe & 3) !== 0 && Yu(),
        He(t),
        (a = t.pendingLanes),
        (l & 261930) !== 0 && (a & 42) !== 0 ? (t === Fc ? za++ : ((za = 0), (Fc = t))) : (za = 0),
        Ta(0));
    }
  }
  function id(t, e) {
    (t.pooledCacheLanes &= e) === 0 &&
      ((e = t.pooledCache), e != null && ((t.pooledCache = null), na(e)));
  }
  function Yu() {
    return (nd(), ad(), ud(), cd());
  }
  function cd() {
    if (Zt !== 5) return !1;
    var t = gl,
      e = kc;
    kc = 0;
    var l = gi(Pe),
      n = M.T,
      a = H.p;
    try {
      ((H.p = 32 > l ? 32 : l), (M.T = null), (l = Wc), (Wc = null));
      var u = gl,
        c = Pe;
      if (((Zt = 0), (_n = gl = null), (Pe = 0), (xt & 6) !== 0)) throw Error(f(331));
      var r = xt;
      if (
        ((xt |= 4),
        Xs(u.current),
        Ys(u, u.current, c, l),
        (xt = r),
        Ta(0, !1),
        re && typeof re.onPostCommitFiberRoot == 'function')
      )
        try {
          re.onPostCommitFiberRoot(Ln, u);
        } catch {}
      return !0;
    } finally {
      ((H.p = a), (M.T = n), id(t, e));
    }
  }
  function fd(t, e, l) {
    ((e = ze(l, e)),
      (e = Cc(t.stateNode, e, 2)),
      (t = rl(t, e, 2)),
      t !== null && (Qn(t, 2), He(t)));
  }
  function _t(t, e, l) {
    if (t.tag === 3) fd(t, t, l);
    else
      for (; e !== null; ) {
        if (e.tag === 3) {
          fd(e, t, l);
          break;
        } else if (e.tag === 1) {
          var n = e.stateNode;
          if (
            typeof e.type.getDerivedStateFromError == 'function' ||
            (typeof n.componentDidCatch == 'function' && (yl === null || !yl.has(n)))
          ) {
            ((t = ze(l, t)),
              (l = os(2)),
              (n = rl(e, l, 2)),
              n !== null && (rs(l, n, e, t), Qn(n, 2), He(n)));
            break;
          }
        }
        e = e.return;
      }
  }
  function tf(t, e, l) {
    var n = t.pingCache;
    if (n === null) {
      n = t.pingCache = new T0();
      var a = new Set();
      n.set(e, a);
    } else ((a = n.get(e)), a === void 0 && ((a = new Set()), n.set(e, a)));
    a.has(l) || ((Kc = !0), a.add(l), (t = O0.bind(null, t, e, l)), e.then(t, t));
  }
  function O0(t, e, l) {
    var n = t.pingCache;
    (n !== null && n.delete(e),
      (t.pingedLanes |= t.suspendedLanes & l),
      (t.warmLanes &= ~l),
      Rt === t &&
        (yt & l) === l &&
        (wt === 4 || (wt === 3 && (yt & 62914560) === yt && 300 > oe() - Nu)
          ? (xt & 2) === 0 && On(t, 0)
          : (Jc |= l),
        Mn === yt && (Mn = 0)),
      He(t));
  }
  function od(t, e) {
    (e === 0 && (e = lo()), (t = Bl(t, e)), t !== null && (Qn(t, e), He(t)));
  }
  function C0(t) {
    var e = t.memoizedState,
      l = 0;
    (e !== null && (l = e.retryLane), od(t, l));
  }
  function D0(t, e) {
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
    (n !== null && n.delete(e), od(t, l));
  }
  function R0(t, e) {
    return mi(t, e);
  }
  var Gu = null,
    Dn = null,
    ef = !1,
    Lu = !1,
    lf = !1,
    pl = 0;
  function He(t) {
    (t !== Dn && t.next === null && (Dn === null ? (Gu = Dn = t) : (Dn = Dn.next = t)),
      (Lu = !0),
      ef || ((ef = !0), N0()));
  }
  function Ta(t, e) {
    if (!lf && Lu) {
      lf = !0;
      do
        for (var l = !1, n = Gu; n !== null; ) {
          if (t !== 0) {
            var a = n.pendingLanes;
            if (a === 0) var u = 0;
            else {
              var c = n.suspendedLanes,
                r = n.pingedLanes;
              ((u = (1 << (31 - se(42 | t) + 1)) - 1),
                (u &= a & ~(c & ~r)),
                (u = u & 201326741 ? (u & 201326741) | 1 : u ? u | 2 : 0));
            }
            u !== 0 && ((l = !0), md(n, u));
          } else
            ((u = yt),
              (u = Za(
                n,
                n === Rt ? u : 0,
                n.cancelPendingCommit !== null || n.timeoutHandle !== -1,
              )),
              (u & 3) === 0 || Xn(n, u) || ((l = !0), md(n, u)));
          n = n.next;
        }
      while (l);
      lf = !1;
    }
  }
  function U0() {
    rd();
  }
  function rd() {
    Lu = ef = !1;
    var t = 0;
    pl !== 0 && Q0() && (t = pl);
    for (var e = oe(), l = null, n = Gu; n !== null; ) {
      var a = n.next,
        u = sd(n, e);
      (u === 0
        ? ((n.next = null), l === null ? (Gu = a) : (l.next = a), a === null && (Dn = l))
        : ((l = n), (t !== 0 || (u & 3) !== 0) && (Lu = !0)),
        (n = a));
    }
    ((Zt !== 0 && Zt !== 5) || Ta(t), pl !== 0 && (pl = 0));
  }
  function sd(t, e) {
    for (
      var l = t.suspendedLanes,
        n = t.pingedLanes,
        a = t.expirationTimes,
        u = t.pendingLanes & -62914561;
      0 < u;
    ) {
      var c = 31 - se(u),
        r = 1 << c,
        v = a[c];
      (v === -1
        ? ((r & l) === 0 || (r & n) !== 0) && (a[c] = uh(r, e))
        : v <= e && (t.expiredLanes |= r),
        (u &= ~r));
    }
    if (
      ((e = Rt),
      (l = yt),
      (l = Za(t, t === e ? l : 0, t.cancelPendingCommit !== null || t.timeoutHandle !== -1)),
      (n = t.callbackNode),
      l === 0 || (t === e && (Mt === 2 || Mt === 9)) || t.cancelPendingCommit !== null)
    )
      return (n !== null && n !== null && hi(n), (t.callbackNode = null), (t.callbackPriority = 0));
    if ((l & 3) === 0 || Xn(t, l)) {
      if (((e = l & -l), e === t.callbackPriority)) return e;
      switch ((n !== null && hi(n), gi(l))) {
        case 2:
        case 8:
          l = to;
          break;
        case 32:
          l = La;
          break;
        case 268435456:
          l = eo;
          break;
        default:
          l = La;
      }
      return (
        (n = dd.bind(null, t)),
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
  function dd(t, e) {
    if (Zt !== 0 && Zt !== 5) return ((t.callbackNode = null), (t.callbackPriority = 0), null);
    var l = t.callbackNode;
    if (Yu() && t.callbackNode !== l) return null;
    var n = yt;
    return (
      (n = Za(t, t === Rt ? n : 0, t.cancelPendingCommit !== null || t.timeoutHandle !== -1)),
      n === 0
        ? null
        : (Js(t, n, e),
          sd(t, oe()),
          t.callbackNode != null && t.callbackNode === l ? dd.bind(null, t) : null)
    );
  }
  function md(t, e) {
    if (Yu()) return null;
    Js(t, e, !0);
  }
  function N0() {
    Z0(function () {
      (xt & 6) !== 0 ? mi(If, U0) : rd();
    });
  }
  function nf() {
    if (pl === 0) {
      var t = vn;
      (t === 0 && ((t = Xa), (Xa <<= 1), (Xa & 261888) === 0 && (Xa = 256)), (pl = t));
    }
    return pl;
  }
  function hd(t) {
    return t == null || typeof t == 'symbol' || typeof t == 'boolean'
      ? null
      : typeof t == 'function'
        ? t
        : ka('' + t);
  }
  function vd(t, e) {
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
  function j0(t, e, l, n, a) {
    if (e === 'submit' && l && l.stateNode === a) {
      var u = hd((a[le] || null).action),
        c = n.submitter;
      c &&
        ((e = (e = c[le] || null) ? hd(e.formAction) : c.getAttribute('formAction')),
        e !== null && ((u = e), (c = null)));
      var r = new Ia('action', 'action', null, n, a);
      t.push({
        event: r,
        listeners: [
          {
            instance: null,
            listener: function () {
              if (n.defaultPrevented) {
                if (pl !== 0) {
                  var v = c ? vd(a, c) : new FormData(a);
                  Tc(l, { pending: !0, data: v, method: a.method, action: u }, null, v);
                }
              } else
                typeof u == 'function' &&
                  (r.preventDefault(),
                  (v = c ? vd(a, c) : new FormData(a)),
                  Tc(l, { pending: !0, data: v, method: a.method, action: u }, u, v));
            },
            currentTarget: a,
          },
        ],
      });
    }
  }
  for (var af = 0; af < Gi.length; af++) {
    var uf = Gi[af],
      H0 = uf.toLowerCase(),
      B0 = uf[0].toUpperCase() + uf.slice(1);
    Ce(H0, 'on' + B0);
  }
  (Ce(Ko, 'onAnimationEnd'),
    Ce(Jo, 'onAnimationIteration'),
    Ce($o, 'onAnimationStart'),
    Ce('dblclick', 'onDoubleClick'),
    Ce('focusin', 'onFocus'),
    Ce('focusout', 'onBlur'),
    Ce(Ph, 'onTransitionRun'),
    Ce(Ih, 'onTransitionStart'),
    Ce(t0, 'onTransitionCancel'),
    Ce(ko, 'onTransitionEnd'),
    tn('onMouseEnter', ['mouseout', 'mouseover']),
    tn('onMouseLeave', ['mouseout', 'mouseover']),
    tn('onPointerEnter', ['pointerout', 'pointerover']),
    tn('onPointerLeave', ['pointerout', 'pointerover']),
    Ul('onChange', 'change click focusin focusout input keydown keyup selectionchange'.split(' ')),
    Ul(
      'onSelect',
      'focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange'.split(
        ' ',
      ),
    ),
    Ul('onBeforeInput', ['compositionend', 'keypress', 'textInput', 'paste']),
    Ul('onCompositionEnd', 'compositionend focusout keydown keypress keyup mousedown'.split(' ')),
    Ul(
      'onCompositionStart',
      'compositionstart focusout keydown keypress keyup mousedown'.split(' '),
    ),
    Ul(
      'onCompositionUpdate',
      'compositionupdate focusout keydown keypress keyup mousedown'.split(' '),
    ));
  var Aa =
      'abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting'.split(
        ' ',
      ),
    w0 = new Set(
      'beforetoggle cancel close invalid load scroll scrollend toggle'.split(' ').concat(Aa),
    );
  function yd(t, e) {
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
              v = r.instance,
              A = r.currentTarget;
            if (((r = r.listener), v !== u && a.isPropagationStopped())) break t;
            ((u = r), (a.currentTarget = A));
            try {
              u(a);
            } catch (C) {
              lu(C);
            }
            ((a.currentTarget = null), (u = v));
          }
        else
          for (c = 0; c < n.length; c++) {
            if (
              ((r = n[c]),
              (v = r.instance),
              (A = r.currentTarget),
              (r = r.listener),
              v !== u && a.isPropagationStopped())
            )
              break t;
            ((u = r), (a.currentTarget = A));
            try {
              u(a);
            } catch (C) {
              lu(C);
            }
            ((a.currentTarget = null), (u = v));
          }
      }
    }
  }
  function vt(t, e) {
    var l = e[bi];
    l === void 0 && (l = e[bi] = new Set());
    var n = t + '__bubble';
    l.has(n) || (gd(e, t, 2, !1), l.add(n));
  }
  function cf(t, e, l) {
    var n = 0;
    (e && (n |= 4), gd(l, t, n, e));
  }
  var Xu = '_reactListening' + Math.random().toString(36).slice(2);
  function ff(t) {
    if (!t[Xu]) {
      ((t[Xu] = !0),
        oo.forEach(function (l) {
          l !== 'selectionchange' && (w0.has(l) || cf(l, !1, t), cf(l, !0, t));
        }));
      var e = t.nodeType === 9 ? t : t.ownerDocument;
      e === null || e[Xu] || ((e[Xu] = !0), cf('selectionchange', !1, e));
    }
  }
  function gd(t, e, l, n) {
    switch (Kd(e)) {
      case 2:
        var a = sv;
        break;
      case 8:
        a = dv;
        break;
      default:
        a = Tf;
    }
    ((l = a.bind(null, e, l, t)),
      (a = void 0),
      !_i || (e !== 'touchstart' && e !== 'touchmove' && e !== 'wheel') || (a = !0),
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
              var v = c.tag;
              if ((v === 3 || v === 4) && c.stateNode.containerInfo === a) return;
              c = c.return;
            }
          for (; r !== null; ) {
            if (((c = Fl(r)), c === null)) return;
            if (((v = c.tag), v === 5 || v === 6 || v === 26 || v === 27)) {
              n = u = c;
              continue t;
            }
            r = r.parentNode;
          }
        }
        n = n.return;
      }
    zo(function () {
      var A = u,
        C = xi(l),
        U = [];
      t: {
        var x = Wo.get(t);
        if (x !== void 0) {
          var _ = Ia,
            $ = t;
          switch (t) {
            case 'keypress':
              if (Fa(l) === 0) break t;
            case 'keydown':
            case 'keyup':
              _ = Dh;
              break;
            case 'focusin':
              (($ = 'focus'), (_ = Ri));
              break;
            case 'focusout':
              (($ = 'blur'), (_ = Ri));
              break;
            case 'beforeblur':
            case 'afterblur':
              _ = Ri;
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
              _ = xo;
              break;
            case 'drag':
            case 'dragend':
            case 'dragenter':
            case 'dragexit':
            case 'dragleave':
            case 'dragover':
            case 'dragstart':
            case 'drop':
              _ = bh;
              break;
            case 'touchcancel':
            case 'touchend':
            case 'touchmove':
            case 'touchstart':
              _ = Nh;
              break;
            case Ko:
            case Jo:
            case $o:
              _ = Eh;
              break;
            case ko:
              _ = Hh;
              break;
            case 'scroll':
            case 'scrollend':
              _ = yh;
              break;
            case 'wheel':
              _ = wh;
              break;
            case 'copy':
            case 'cut':
            case 'paste':
              _ = Th;
              break;
            case 'gotpointercapture':
            case 'lostpointercapture':
            case 'pointercancel':
            case 'pointerdown':
            case 'pointermove':
            case 'pointerout':
            case 'pointerover':
            case 'pointerup':
              _ = _o;
              break;
            case 'toggle':
            case 'beforetoggle':
              _ = Yh;
          }
          var et = (e & 4) !== 0,
            Dt = !et && (t === 'scroll' || t === 'scrollend'),
            E = et ? (x !== null ? x + 'Capture' : null) : x;
          et = [];
          for (var p = A, T; p !== null; ) {
            var R = p;
            if (
              ((T = R.stateNode),
              (R = R.tag),
              (R !== 5 && R !== 26 && R !== 27) ||
                T === null ||
                E === null ||
                ((R = Kn(p, E)), R != null && et.push(xa(p, R, T))),
              Dt)
            )
              break;
            p = p.return;
          }
          0 < et.length && ((x = new _(x, $, null, l, C)), U.push({ event: x, listeners: et }));
        }
      }
      if ((e & 7) === 0) {
        t: {
          if (
            ((x = t === 'mouseover' || t === 'pointerover'),
            (_ = t === 'mouseout' || t === 'pointerout'),
            x && l !== Ai && ($ = l.relatedTarget || l.fromElement) && (Fl($) || $[Wl]))
          )
            break t;
          if (
            (_ || x) &&
            ((x =
              C.window === C
                ? C
                : (x = C.ownerDocument)
                  ? x.defaultView || x.parentWindow
                  : window),
            _
              ? (($ = l.relatedTarget || l.toElement),
                (_ = A),
                ($ = $ ? Fl($) : null),
                $ !== null &&
                  ((Dt = d($)), (et = $.tag), $ !== Dt || (et !== 5 && et !== 27 && et !== 6)) &&
                  ($ = null))
              : ((_ = null), ($ = A)),
            _ !== $)
          ) {
            if (
              ((et = xo),
              (R = 'onMouseLeave'),
              (E = 'onMouseEnter'),
              (p = 'mouse'),
              (t === 'pointerout' || t === 'pointerover') &&
                ((et = _o), (R = 'onPointerLeave'), (E = 'onPointerEnter'), (p = 'pointer')),
              (Dt = _ == null ? x : Zn(_)),
              (T = $ == null ? x : Zn($)),
              (x = new et(R, p + 'leave', _, l, C)),
              (x.target = Dt),
              (x.relatedTarget = T),
              (R = null),
              Fl(C) === A &&
                ((et = new et(E, p + 'enter', $, l, C)),
                (et.target = T),
                (et.relatedTarget = Dt),
                (R = et)),
              (Dt = R),
              _ && $)
            )
              e: {
                for (et = q0, E = _, p = $, T = 0, R = E; R; R = et(R)) T++;
                R = 0;
                for (var I = p; I; I = et(I)) R++;
                for (; 0 < T - R; ) ((E = et(E)), T--);
                for (; 0 < R - T; ) ((p = et(p)), R--);
                for (; T--; ) {
                  if (E === p || (p !== null && E === p.alternate)) {
                    et = E;
                    break e;
                  }
                  ((E = et(E)), (p = et(p)));
                }
                et = null;
              }
            else et = null;
            (_ !== null && bd(U, x, _, et, !1), $ !== null && Dt !== null && bd(U, Dt, $, et, !0));
          }
        }
        t: {
          if (
            ((x = A ? Zn(A) : window),
            (_ = x.nodeName && x.nodeName.toLowerCase()),
            _ === 'select' || (_ === 'input' && x.type === 'file'))
          )
            var zt = Ho;
          else if (No(x))
            if (Bo) zt = kh;
            else {
              zt = Jh;
              var F = Kh;
            }
          else
            ((_ = x.nodeName),
              !_ || _.toLowerCase() !== 'input' || (x.type !== 'checkbox' && x.type !== 'radio')
                ? A && Ti(A.elementType) && (zt = Ho)
                : (zt = $h));
          if (zt && (zt = zt(t, A))) {
            jo(U, zt, l, C);
            break t;
          }
          (F && F(t, x, A),
            t === 'focusout' &&
              A &&
              x.type === 'number' &&
              A.memoizedProps.value != null &&
              zi(x, 'number', x.value));
        }
        switch (((F = A ? Zn(A) : window), t)) {
          case 'focusin':
            (No(F) || F.contentEditable === 'true') && ((cn = F), (wi = A), (ta = null));
            break;
          case 'focusout':
            ta = wi = cn = null;
            break;
          case 'mousedown':
            qi = !0;
            break;
          case 'contextmenu':
          case 'mouseup':
          case 'dragend':
            ((qi = !1), Vo(U, l, C));
            break;
          case 'selectionchange':
            if (Fh) break;
          case 'keydown':
          case 'keyup':
            Vo(U, l, C);
        }
        var rt;
        if (Ni)
          t: {
            switch (t) {
              case 'compositionstart':
                var gt = 'onCompositionStart';
                break t;
              case 'compositionend':
                gt = 'onCompositionEnd';
                break t;
              case 'compositionupdate':
                gt = 'onCompositionUpdate';
                break t;
            }
            gt = void 0;
          }
        else
          un
            ? Ro(t, l) && (gt = 'onCompositionEnd')
            : t === 'keydown' && l.keyCode === 229 && (gt = 'onCompositionStart');
        (gt &&
          (Oo &&
            l.locale !== 'ko' &&
            (un || gt !== 'onCompositionStart'
              ? gt === 'onCompositionEnd' && un && (rt = To())
              : ((nl = C), (Oi = 'value' in nl ? nl.value : nl.textContent), (un = !0))),
          (F = Qu(A, gt)),
          0 < F.length &&
            ((gt = new Mo(gt, t, null, l, C)),
            U.push({ event: gt, listeners: F }),
            rt ? (gt.data = rt) : ((rt = Uo(l)), rt !== null && (gt.data = rt)))),
          (rt = Lh ? Xh(t, l) : Qh(t, l)) &&
            ((gt = Qu(A, 'onBeforeInput')),
            0 < gt.length &&
              ((F = new Mo('onBeforeInput', 'beforeinput', null, l, C)),
              U.push({ event: F, listeners: gt }),
              (F.data = rt))),
          j0(U, t, A, l, C));
      }
      yd(U, e);
    });
  }
  function xa(t, e, l) {
    return { instance: t, listener: e, currentTarget: l };
  }
  function Qu(t, e) {
    for (var l = e + 'Capture', n = []; t !== null; ) {
      var a = t,
        u = a.stateNode;
      if (
        ((a = a.tag),
        (a !== 5 && a !== 26 && a !== 27) ||
          u === null ||
          ((a = Kn(t, l)),
          a != null && n.unshift(xa(t, a, u)),
          (a = Kn(t, e)),
          a != null && n.push(xa(t, a, u))),
        t.tag === 3)
      )
        return n;
      t = t.return;
    }
    return [];
  }
  function q0(t) {
    if (t === null) return null;
    do t = t.return;
    while (t && t.tag !== 5 && t.tag !== 27);
    return t || null;
  }
  function bd(t, e, l, n, a) {
    for (var u = e._reactName, c = []; l !== null && l !== n; ) {
      var r = l,
        v = r.alternate,
        A = r.stateNode;
      if (((r = r.tag), v !== null && v === n)) break;
      ((r !== 5 && r !== 26 && r !== 27) ||
        A === null ||
        ((v = A),
        a
          ? ((A = Kn(l, u)), A != null && c.unshift(xa(l, A, v)))
          : a || ((A = Kn(l, u)), A != null && c.push(xa(l, A, v)))),
        (l = l.return));
    }
    c.length !== 0 && t.push({ event: e, listeners: c });
  }
  var Y0 = /\r\n?/g,
    G0 = /\u0000|\uFFFD/g;
  function pd(t) {
    return (typeof t == 'string' ? t : '' + t)
      .replace(
        Y0,
        `
`,
      )
      .replace(G0, '');
  }
  function Sd(t, e) {
    return ((e = pd(e)), pd(t) === e);
  }
  function Ct(t, e, l, n, a, u) {
    switch (l) {
      case 'children':
        typeof n == 'string'
          ? e === 'body' || (e === 'textarea' && n === '') || ln(t, n)
          : (typeof n == 'number' || typeof n == 'bigint') && e !== 'body' && ln(t, '' + n);
        break;
      case 'className':
        Ja(t, 'class', n);
        break;
      case 'tabIndex':
        Ja(t, 'tabindex', n);
        break;
      case 'dir':
      case 'role':
      case 'viewBox':
      case 'width':
      case 'height':
        Ja(t, l, n);
        break;
      case 'style':
        So(t, n, u);
        break;
      case 'data':
        if (e !== 'object') {
          Ja(t, 'data', n);
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
        ((n = ka('' + n)), t.setAttribute(l, n));
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
              ? (e !== 'input' && Ct(t, e, 'name', a.name, a, null),
                Ct(t, e, 'formEncType', a.formEncType, a, null),
                Ct(t, e, 'formMethod', a.formMethod, a, null),
                Ct(t, e, 'formTarget', a.formTarget, a, null))
              : (Ct(t, e, 'encType', a.encType, a, null),
                Ct(t, e, 'method', a.method, a, null),
                Ct(t, e, 'target', a.target, a, null)));
        if (n == null || typeof n == 'symbol' || typeof n == 'boolean') {
          t.removeAttribute(l);
          break;
        }
        ((n = ka('' + n)), t.setAttribute(l, n));
        break;
      case 'onClick':
        n != null && (t.onclick = we);
        break;
      case 'onScroll':
        n != null && vt('scroll', t);
        break;
      case 'onScrollEnd':
        n != null && vt('scrollend', t);
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
        ((l = ka('' + n)), t.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', l));
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
        (vt('beforetoggle', t), vt('toggle', t), Ka(t, 'popover', n));
        break;
      case 'xlinkActuate':
        Be(t, 'http://www.w3.org/1999/xlink', 'xlink:actuate', n);
        break;
      case 'xlinkArcrole':
        Be(t, 'http://www.w3.org/1999/xlink', 'xlink:arcrole', n);
        break;
      case 'xlinkRole':
        Be(t, 'http://www.w3.org/1999/xlink', 'xlink:role', n);
        break;
      case 'xlinkShow':
        Be(t, 'http://www.w3.org/1999/xlink', 'xlink:show', n);
        break;
      case 'xlinkTitle':
        Be(t, 'http://www.w3.org/1999/xlink', 'xlink:title', n);
        break;
      case 'xlinkType':
        Be(t, 'http://www.w3.org/1999/xlink', 'xlink:type', n);
        break;
      case 'xmlBase':
        Be(t, 'http://www.w3.org/XML/1998/namespace', 'xml:base', n);
        break;
      case 'xmlLang':
        Be(t, 'http://www.w3.org/XML/1998/namespace', 'xml:lang', n);
        break;
      case 'xmlSpace':
        Be(t, 'http://www.w3.org/XML/1998/namespace', 'xml:space', n);
        break;
      case 'is':
        Ka(t, 'is', n);
        break;
      case 'innerText':
      case 'textContent':
        break;
      default:
        (!(2 < l.length) || (l[0] !== 'o' && l[0] !== 'O') || (l[1] !== 'n' && l[1] !== 'N')) &&
          ((l = hh.get(l) || l), Ka(t, l, n));
    }
  }
  function rf(t, e, l, n, a, u) {
    switch (l) {
      case 'style':
        So(t, n, u);
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
          ? ln(t, n)
          : (typeof n == 'number' || typeof n == 'bigint') && ln(t, '' + n);
        break;
      case 'onScroll':
        n != null && vt('scroll', t);
        break;
      case 'onScrollEnd':
        n != null && vt('scrollend', t);
        break;
      case 'onClick':
        n != null && (t.onclick = we);
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
        if (!ro.hasOwnProperty(l))
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
            l in t ? (t[l] = n) : n === !0 ? t.setAttribute(l, '') : Ka(t, l, n);
          }
    }
  }
  function Pt(t, e, l) {
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
        (vt('error', t), vt('load', t));
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
                  Ct(t, e, u, c, l, null);
              }
          }
        (a && Ct(t, e, 'srcSet', l.srcSet, l, null), n && Ct(t, e, 'src', l.src, l, null));
        return;
      case 'input':
        vt('invalid', t);
        var r = (u = c = a = null),
          v = null,
          A = null;
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
                  v = C;
                  break;
                case 'defaultChecked':
                  A = C;
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
                  Ct(t, e, n, C, l, null);
              }
          }
        yo(t, u, r, v, A, c, a, !1);
        return;
      case 'select':
        (vt('invalid', t), (n = c = u = null));
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
                Ct(t, e, a, r, l, null);
            }
        ((e = u),
          (l = c),
          (t.multiple = !!n),
          e != null ? en(t, !!n, e, !1) : l != null && en(t, !!n, l, !0));
        return;
      case 'textarea':
        (vt('invalid', t), (u = a = n = null));
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
                Ct(t, e, c, r, l, null);
            }
        bo(t, n, a, u);
        return;
      case 'option':
        for (v in l)
          if (l.hasOwnProperty(v) && ((n = l[v]), n != null))
            switch (v) {
              case 'selected':
                t.selected = n && typeof n != 'function' && typeof n != 'symbol';
                break;
              default:
                Ct(t, e, v, n, l, null);
            }
        return;
      case 'dialog':
        (vt('beforetoggle', t), vt('toggle', t), vt('cancel', t), vt('close', t));
        break;
      case 'iframe':
      case 'object':
        vt('load', t);
        break;
      case 'video':
      case 'audio':
        for (n = 0; n < Aa.length; n++) vt(Aa[n], t);
        break;
      case 'image':
        (vt('error', t), vt('load', t));
        break;
      case 'details':
        vt('toggle', t);
        break;
      case 'embed':
      case 'source':
      case 'link':
        (vt('error', t), vt('load', t));
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
        for (A in l)
          if (l.hasOwnProperty(A) && ((n = l[A]), n != null))
            switch (A) {
              case 'children':
              case 'dangerouslySetInnerHTML':
                throw Error(f(137, e));
              default:
                Ct(t, e, A, n, l, null);
            }
        return;
      default:
        if (Ti(e)) {
          for (C in l)
            l.hasOwnProperty(C) && ((n = l[C]), n !== void 0 && rf(t, e, C, n, l, void 0));
          return;
        }
    }
    for (r in l) l.hasOwnProperty(r) && ((n = l[r]), n != null && Ct(t, e, r, n, l, null));
  }
  function L0(t, e, l, n) {
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
          v = null,
          A = null,
          C = null;
        for (_ in l) {
          var U = l[_];
          if (l.hasOwnProperty(_) && U != null)
            switch (_) {
              case 'checked':
                break;
              case 'value':
                break;
              case 'defaultValue':
                v = U;
              default:
                n.hasOwnProperty(_) || Ct(t, e, _, null, n, U);
            }
        }
        for (var x in n) {
          var _ = n[x];
          if (((U = l[x]), n.hasOwnProperty(x) && (_ != null || U != null)))
            switch (x) {
              case 'type':
                u = _;
                break;
              case 'name':
                a = _;
                break;
              case 'checked':
                A = _;
                break;
              case 'defaultChecked':
                C = _;
                break;
              case 'value':
                c = _;
                break;
              case 'defaultValue':
                r = _;
                break;
              case 'children':
              case 'dangerouslySetInnerHTML':
                if (_ != null) throw Error(f(137, e));
                break;
              default:
                _ !== U && Ct(t, e, x, _, n, U);
            }
        }
        Ei(t, c, r, v, A, C, u, a);
        return;
      case 'select':
        _ = c = r = x = null;
        for (u in l)
          if (((v = l[u]), l.hasOwnProperty(u) && v != null))
            switch (u) {
              case 'value':
                break;
              case 'multiple':
                _ = v;
              default:
                n.hasOwnProperty(u) || Ct(t, e, u, null, n, v);
            }
        for (a in n)
          if (((u = n[a]), (v = l[a]), n.hasOwnProperty(a) && (u != null || v != null)))
            switch (a) {
              case 'value':
                x = u;
                break;
              case 'defaultValue':
                r = u;
                break;
              case 'multiple':
                c = u;
              default:
                u !== v && Ct(t, e, a, u, n, v);
            }
        ((e = r),
          (l = c),
          (n = _),
          x != null
            ? en(t, !!l, x, !1)
            : !!n != !!l && (e != null ? en(t, !!l, e, !0) : en(t, !!l, l ? [] : '', !1)));
        return;
      case 'textarea':
        _ = x = null;
        for (r in l)
          if (((a = l[r]), l.hasOwnProperty(r) && a != null && !n.hasOwnProperty(r)))
            switch (r) {
              case 'value':
                break;
              case 'children':
                break;
              default:
                Ct(t, e, r, null, n, a);
            }
        for (c in n)
          if (((a = n[c]), (u = l[c]), n.hasOwnProperty(c) && (a != null || u != null)))
            switch (c) {
              case 'value':
                x = a;
                break;
              case 'defaultValue':
                _ = a;
                break;
              case 'children':
                break;
              case 'dangerouslySetInnerHTML':
                if (a != null) throw Error(f(91));
                break;
              default:
                a !== u && Ct(t, e, c, a, n, u);
            }
        go(t, x, _);
        return;
      case 'option':
        for (var $ in l)
          if (((x = l[$]), l.hasOwnProperty($) && x != null && !n.hasOwnProperty($)))
            switch ($) {
              case 'selected':
                t.selected = !1;
                break;
              default:
                Ct(t, e, $, null, n, x);
            }
        for (v in n)
          if (((x = n[v]), (_ = l[v]), n.hasOwnProperty(v) && x !== _ && (x != null || _ != null)))
            switch (v) {
              case 'selected':
                t.selected = x && typeof x != 'function' && typeof x != 'symbol';
                break;
              default:
                Ct(t, e, v, x, n, _);
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
        for (var et in l)
          ((x = l[et]),
            l.hasOwnProperty(et) && x != null && !n.hasOwnProperty(et) && Ct(t, e, et, null, n, x));
        for (A in n)
          if (((x = n[A]), (_ = l[A]), n.hasOwnProperty(A) && x !== _ && (x != null || _ != null)))
            switch (A) {
              case 'children':
              case 'dangerouslySetInnerHTML':
                if (x != null) throw Error(f(137, e));
                break;
              default:
                Ct(t, e, A, x, n, _);
            }
        return;
      default:
        if (Ti(e)) {
          for (var Dt in l)
            ((x = l[Dt]),
              l.hasOwnProperty(Dt) &&
                x !== void 0 &&
                !n.hasOwnProperty(Dt) &&
                rf(t, e, Dt, void 0, n, x));
          for (C in n)
            ((x = n[C]),
              (_ = l[C]),
              !n.hasOwnProperty(C) ||
                x === _ ||
                (x === void 0 && _ === void 0) ||
                rf(t, e, C, x, n, _));
          return;
        }
    }
    for (var E in l)
      ((x = l[E]),
        l.hasOwnProperty(E) && x != null && !n.hasOwnProperty(E) && Ct(t, e, E, null, n, x));
    for (U in n)
      ((x = n[U]),
        (_ = l[U]),
        !n.hasOwnProperty(U) || x === _ || (x == null && _ == null) || Ct(t, e, U, x, n, _));
  }
  function Ed(t) {
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
  function X0() {
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
        if (u && r && Ed(c)) {
          for (c = 0, r = a.responseEnd, n += 1; n < l.length; n++) {
            var v = l[n],
              A = v.startTime;
            if (A > r) break;
            var C = v.transferSize,
              U = v.initiatorType;
            C && Ed(U) && ((v = v.responseEnd), (c += C * (v < r ? 1 : (r - A) / (v - A))));
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
  var sf = null,
    df = null;
  function Vu(t) {
    return t.nodeType === 9 ? t : t.ownerDocument;
  }
  function zd(t) {
    switch (t) {
      case 'http://www.w3.org/2000/svg':
        return 1;
      case 'http://www.w3.org/1998/Math/MathML':
        return 2;
      default:
        return 0;
    }
  }
  function Td(t, e) {
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
  function Q0() {
    var t = window.event;
    return t && t.type === 'popstate' ? (t === hf ? !1 : ((hf = t), !0)) : ((hf = null), !1);
  }
  var Ad = typeof setTimeout == 'function' ? setTimeout : void 0,
    V0 = typeof clearTimeout == 'function' ? clearTimeout : void 0,
    xd = typeof Promise == 'function' ? Promise : void 0,
    Z0 =
      typeof queueMicrotask == 'function'
        ? queueMicrotask
        : typeof xd < 'u'
          ? function (t) {
              return xd.resolve(null).then(t).catch(K0);
            }
          : Ad;
  function K0(t) {
    setTimeout(function () {
      throw t;
    });
  }
  function Sl(t) {
    return t === 'head';
  }
  function Md(t, e) {
    var l = e,
      n = 0;
    do {
      var a = l.nextSibling;
      if ((t.removeChild(l), a && a.nodeType === 8))
        if (((l = a.data), l === '/$' || l === '/&')) {
          if (n === 0) {
            (t.removeChild(a), jn(e));
            return;
          }
          n--;
        } else if (l === '$' || l === '$?' || l === '$~' || l === '$!' || l === '&') n++;
        else if (l === 'html') Ma(t.ownerDocument.documentElement);
        else if (l === 'head') {
          ((l = t.ownerDocument.head), Ma(l));
          for (var u = l.firstChild; u; ) {
            var c = u.nextSibling,
              r = u.nodeName;
            (u[Vn] ||
              r === 'SCRIPT' ||
              r === 'STYLE' ||
              (r === 'LINK' && u.rel.toLowerCase() === 'stylesheet') ||
              l.removeChild(u),
              (u = c));
          }
        } else l === 'body' && Ma(t.ownerDocument.body);
      l = a;
    } while (l);
    jn(e);
  }
  function _d(t, e) {
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
  function vf(t) {
    var e = t.firstChild;
    for (e && e.nodeType === 10 && (e = e.nextSibling); e; ) {
      var l = e;
      switch (((e = e.nextSibling), l.nodeName)) {
        case 'HTML':
        case 'HEAD':
        case 'BODY':
          (vf(l), pi(l));
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
  function J0(t, e, l, n) {
    for (; t.nodeType === 1; ) {
      var a = l;
      if (t.nodeName.toLowerCase() !== e.toLowerCase()) {
        if (!n && (t.nodeName !== 'INPUT' || t.type !== 'hidden')) break;
      } else if (n) {
        if (!t[Vn])
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
      if (((t = _e(t.nextSibling)), t === null)) break;
    }
    return null;
  }
  function $0(t, e, l) {
    if (e === '') return null;
    for (; t.nodeType !== 3; )
      if (
        ((t.nodeType !== 1 || t.nodeName !== 'INPUT' || t.type !== 'hidden') && !l) ||
        ((t = _e(t.nextSibling)), t === null)
      )
        return null;
    return t;
  }
  function Od(t, e) {
    for (; t.nodeType !== 8; )
      if (
        ((t.nodeType !== 1 || t.nodeName !== 'INPUT' || t.type !== 'hidden') && !e) ||
        ((t = _e(t.nextSibling)), t === null)
      )
        return null;
    return t;
  }
  function yf(t) {
    return t.data === '$?' || t.data === '$~';
  }
  function gf(t) {
    return t.data === '$!' || (t.data === '$?' && t.ownerDocument.readyState !== 'loading');
  }
  function k0(t, e) {
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
  function _e(t) {
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
  var bf = null;
  function Cd(t) {
    t = t.nextSibling;
    for (var e = 0; t; ) {
      if (t.nodeType === 8) {
        var l = t.data;
        if (l === '/$' || l === '/&') {
          if (e === 0) return _e(t.nextSibling);
          e--;
        } else (l !== '$' && l !== '$!' && l !== '$?' && l !== '$~' && l !== '&') || e++;
      }
      t = t.nextSibling;
    }
    return null;
  }
  function Dd(t) {
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
    switch (((e = Vu(l)), t)) {
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
  function Ma(t) {
    for (var e = t.attributes; e.length; ) t.removeAttributeNode(e[0]);
    pi(t);
  }
  var Oe = new Map(),
    Ud = new Set();
  function Zu(t) {
    return typeof t.getRootNode == 'function'
      ? t.getRootNode()
      : t.nodeType === 9
        ? t
        : t.ownerDocument;
  }
  var Ie = H.d;
  H.d = { f: W0, r: F0, D: P0, C: I0, L: tv, m: ev, X: nv, S: lv, M: av };
  function W0() {
    var t = Ie.f(),
      e = Bu();
    return t || e;
  }
  function F0(t) {
    var e = Pl(t);
    e !== null && e.tag === 5 && e.type === 'form' ? kr(e) : Ie.r(t);
  }
  var Rn = typeof document > 'u' ? null : document;
  function Nd(t, e, l) {
    var n = Rn;
    if (n && typeof e == 'string' && e) {
      var a = Se(e);
      ((a = 'link[rel="' + t + '"][href="' + a + '"]'),
        typeof l == 'string' && (a += '[crossorigin="' + l + '"]'),
        Ud.has(a) ||
          (Ud.add(a),
          (t = { rel: t, crossOrigin: l, href: e }),
          n.querySelector(a) === null &&
            ((e = n.createElement('link')), Pt(e, 'link', t), Kt(e), n.head.appendChild(e))));
    }
  }
  function P0(t) {
    (Ie.D(t), Nd('dns-prefetch', t, null));
  }
  function I0(t, e) {
    (Ie.C(t, e), Nd('preconnect', t, e));
  }
  function tv(t, e, l) {
    Ie.L(t, e, l);
    var n = Rn;
    if (n && t && e) {
      var a = 'link[rel="preload"][as="' + Se(e) + '"]';
      e === 'image' && l && l.imageSrcSet
        ? ((a += '[imagesrcset="' + Se(l.imageSrcSet) + '"]'),
          typeof l.imageSizes == 'string' && (a += '[imagesizes="' + Se(l.imageSizes) + '"]'))
        : (a += '[href="' + Se(t) + '"]');
      var u = a;
      switch (e) {
        case 'style':
          u = Un(t);
          break;
        case 'script':
          u = Nn(t);
      }
      Oe.has(u) ||
        ((t = z(
          { rel: 'preload', href: e === 'image' && l && l.imageSrcSet ? void 0 : t, as: e },
          l,
        )),
        Oe.set(u, t),
        n.querySelector(a) !== null ||
          (e === 'style' && n.querySelector(_a(u))) ||
          (e === 'script' && n.querySelector(Oa(u))) ||
          ((e = n.createElement('link')), Pt(e, 'link', t), Kt(e), n.head.appendChild(e)));
    }
  }
  function ev(t, e) {
    Ie.m(t, e);
    var l = Rn;
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
          u = Nn(t);
      }
      if (
        !Oe.has(u) &&
        ((t = z({ rel: 'modulepreload', href: t }, e)), Oe.set(u, t), l.querySelector(a) === null)
      ) {
        switch (n) {
          case 'audioworklet':
          case 'paintworklet':
          case 'serviceworker':
          case 'sharedworker':
          case 'worker':
          case 'script':
            if (l.querySelector(Oa(u))) return;
        }
        ((n = l.createElement('link')), Pt(n, 'link', t), Kt(n), l.head.appendChild(n));
      }
    }
  }
  function lv(t, e, l) {
    Ie.S(t, e, l);
    var n = Rn;
    if (n && t) {
      var a = Il(n).hoistableStyles,
        u = Un(t);
      e = e || 'default';
      var c = a.get(u);
      if (!c) {
        var r = { loading: 0, preload: null };
        if ((c = n.querySelector(_a(u)))) r.loading = 5;
        else {
          ((t = z({ rel: 'stylesheet', href: t, 'data-precedence': e }, l)),
            (l = Oe.get(u)) && pf(t, l));
          var v = (c = n.createElement('link'));
          (Kt(v),
            Pt(v, 'link', t),
            (v._p = new Promise(function (A, C) {
              ((v.onload = A), (v.onerror = C));
            })),
            v.addEventListener('load', function () {
              r.loading |= 1;
            }),
            v.addEventListener('error', function () {
              r.loading |= 2;
            }),
            (r.loading |= 4),
            Ku(c, e, n));
        }
        ((c = { type: 'stylesheet', instance: c, count: 1, state: r }), a.set(u, c));
      }
    }
  }
  function nv(t, e) {
    Ie.X(t, e);
    var l = Rn;
    if (l && t) {
      var n = Il(l).hoistableScripts,
        a = Nn(t),
        u = n.get(a);
      u ||
        ((u = l.querySelector(Oa(a))),
        u ||
          ((t = z({ src: t, async: !0 }, e)),
          (e = Oe.get(a)) && Sf(t, e),
          (u = l.createElement('script')),
          Kt(u),
          Pt(u, 'link', t),
          l.head.appendChild(u)),
        (u = { type: 'script', instance: u, count: 1, state: null }),
        n.set(a, u));
    }
  }
  function av(t, e) {
    Ie.M(t, e);
    var l = Rn;
    if (l && t) {
      var n = Il(l).hoistableScripts,
        a = Nn(t),
        u = n.get(a);
      u ||
        ((u = l.querySelector(Oa(a))),
        u ||
          ((t = z({ src: t, async: !0, type: 'module' }, e)),
          (e = Oe.get(a)) && Sf(t, e),
          (u = l.createElement('script')),
          Kt(u),
          Pt(u, 'link', t),
          l.head.appendChild(u)),
        (u = { type: 'script', instance: u, count: 1, state: null }),
        n.set(a, u));
    }
  }
  function jd(t, e, l, n) {
    var a = (a = ft.current) ? Zu(a) : null;
    if (!a) throw Error(f(446));
    switch (t) {
      case 'meta':
      case 'title':
        return null;
      case 'style':
        return typeof l.precedence == 'string' && typeof l.href == 'string'
          ? ((e = Un(l.href)),
            (l = Il(a).hoistableStyles),
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
          t = Un(l.href);
          var u = Il(a).hoistableStyles,
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
              (u = a.querySelector(_a(t))) && !u._p && ((c.instance = u), (c.state.loading = 5)),
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
                u || uv(a, t, l, c.state))),
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
            ? ((e = Nn(l)),
              (l = Il(a).hoistableScripts),
              (n = l.get(e)),
              n || ((n = { type: 'script', instance: null, count: 0, state: null }), l.set(e, n)),
              n)
            : { type: 'void', instance: null, count: 0, state: null }
        );
      default:
        throw Error(f(444, t));
    }
  }
  function Un(t) {
    return 'href="' + Se(t) + '"';
  }
  function _a(t) {
    return 'link[rel="stylesheet"][' + t + ']';
  }
  function Hd(t) {
    return z({}, t, { 'data-precedence': t.precedence, precedence: null });
  }
  function uv(t, e, l, n) {
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
        Pt(e, 'link', l),
        Kt(e),
        t.head.appendChild(e));
  }
  function Nn(t) {
    return '[src="' + Se(t) + '"]';
  }
  function Oa(t) {
    return 'script[async]' + t;
  }
  function Bd(t, e, l) {
    if ((e.count++, e.instance === null))
      switch (e.type) {
        case 'style':
          var n = t.querySelector('style[data-href~="' + Se(l.href) + '"]');
          if (n) return ((e.instance = n), Kt(n), n);
          var a = z({}, l, {
            'data-href': l.href,
            'data-precedence': l.precedence,
            href: null,
            precedence: null,
          });
          return (
            (n = (t.ownerDocument || t).createElement('style')),
            Kt(n),
            Pt(n, 'style', a),
            Ku(n, l.precedence, t),
            (e.instance = n)
          );
        case 'stylesheet':
          a = Un(l.href);
          var u = t.querySelector(_a(a));
          if (u) return ((e.state.loading |= 4), (e.instance = u), Kt(u), u);
          ((n = Hd(l)),
            (a = Oe.get(a)) && pf(n, a),
            (u = (t.ownerDocument || t).createElement('link')),
            Kt(u));
          var c = u;
          return (
            (c._p = new Promise(function (r, v) {
              ((c.onload = r), (c.onerror = v));
            })),
            Pt(u, 'link', n),
            (e.state.loading |= 4),
            Ku(u, l.precedence, t),
            (e.instance = u)
          );
        case 'script':
          return (
            (u = Nn(l.src)),
            (a = t.querySelector(Oa(u)))
              ? ((e.instance = a), Kt(a), a)
              : ((n = l),
                (a = Oe.get(u)) && ((n = z({}, l)), Sf(n, a)),
                (t = t.ownerDocument || t),
                (a = t.createElement('script')),
                Kt(a),
                Pt(a, 'link', n),
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
        ((n = e.instance), (e.state.loading |= 4), Ku(n, l.precedence, t));
    return e.instance;
  }
  function Ku(t, e, l) {
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
  function pf(t, e) {
    (t.crossOrigin == null && (t.crossOrigin = e.crossOrigin),
      t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy),
      t.title == null && (t.title = e.title));
  }
  function Sf(t, e) {
    (t.crossOrigin == null && (t.crossOrigin = e.crossOrigin),
      t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy),
      t.integrity == null && (t.integrity = e.integrity));
  }
  var Ju = null;
  function wd(t, e, l) {
    if (Ju === null) {
      var n = new Map(),
        a = (Ju = new Map());
      a.set(l, n);
    } else ((a = Ju), (n = a.get(l)), n || ((n = new Map()), a.set(l, n)));
    if (n.has(t)) return n;
    for (n.set(t, null), l = l.getElementsByTagName(t), a = 0; a < l.length; a++) {
      var u = l[a];
      if (
        !(u[Vn] || u[$t] || (t === 'link' && u.getAttribute('rel') === 'stylesheet')) &&
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
  function qd(t, e, l) {
    ((t = t.ownerDocument || t),
      t.head.insertBefore(l, e === 'title' ? t.querySelector('head > title') : null));
  }
  function iv(t, e, l) {
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
  function Yd(t) {
    return !(t.type === 'stylesheet' && (t.state.loading & 3) === 0);
  }
  function cv(t, e, l, n) {
    if (
      l.type === 'stylesheet' &&
      (typeof n.media != 'string' || matchMedia(n.media).matches !== !1) &&
      (l.state.loading & 4) === 0
    ) {
      if (l.instance === null) {
        var a = Un(n.href),
          u = e.querySelector(_a(a));
        if (u) {
          ((e = u._p),
            e !== null &&
              typeof e == 'object' &&
              typeof e.then == 'function' &&
              (t.count++, (t = $u.bind(t)), e.then(t, t)),
            (l.state.loading |= 4),
            (l.instance = u),
            Kt(u));
          return;
        }
        ((u = e.ownerDocument || e),
          (n = Hd(n)),
          (a = Oe.get(a)) && pf(n, a),
          (u = u.createElement('link')),
          Kt(u));
        var c = u;
        ((c._p = new Promise(function (r, v) {
          ((c.onload = r), (c.onerror = v));
        })),
          Pt(u, 'link', n),
          (l.instance = u));
      }
      (t.stylesheets === null && (t.stylesheets = new Map()),
        t.stylesheets.set(l, e),
        (e = l.state.preload) &&
          (l.state.loading & 3) === 0 &&
          (t.count++,
          (l = $u.bind(t)),
          e.addEventListener('load', l),
          e.addEventListener('error', l)));
    }
  }
  var Ef = 0;
  function fv(t, e) {
    return (
      t.stylesheets && t.count === 0 && Wu(t, t.stylesheets),
      0 < t.count || 0 < t.imgCount
        ? function (l) {
            var n = setTimeout(function () {
              if ((t.stylesheets && Wu(t, t.stylesheets), t.unsuspend)) {
                var u = t.unsuspend;
                ((t.unsuspend = null), u());
              }
            }, 6e4 + e);
            0 < t.imgBytes && Ef === 0 && (Ef = 62500 * X0());
            var a = setTimeout(
              function () {
                if (
                  ((t.waitingForImages = !1),
                  t.count === 0 && (t.stylesheets && Wu(t, t.stylesheets), t.unsuspend))
                ) {
                  var u = t.unsuspend;
                  ((t.unsuspend = null), u());
                }
              },
              (t.imgBytes > Ef ? 50 : 800) + e,
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
  function $u() {
    if ((this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages))) {
      if (this.stylesheets) Wu(this, this.stylesheets);
      else if (this.unsuspend) {
        var t = this.unsuspend;
        ((this.unsuspend = null), t());
      }
    }
  }
  var ku = null;
  function Wu(t, e) {
    ((t.stylesheets = null),
      t.unsuspend !== null &&
        (t.count++, (ku = new Map()), e.forEach(ov, t), (ku = null), $u.call(t)));
  }
  function ov(t, e) {
    if (!(e.state.loading & 4)) {
      var l = ku.get(t);
      if (l) var n = l.get(null);
      else {
        ((l = new Map()), ku.set(t, l));
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
        (n = $u.bind(this)),
        a.addEventListener('load', n),
        a.addEventListener('error', n),
        u
          ? u.parentNode.insertBefore(a, u.nextSibling)
          : ((t = t.nodeType === 9 ? t.head : t), t.insertBefore(a, t.firstChild)),
        (e.state.loading |= 4));
    }
  }
  var Ca = {
    $$typeof: V,
    Provider: null,
    Consumer: null,
    _currentValue: W,
    _currentValue2: W,
    _threadCount: 0,
  };
  function rv(t, e, l, n, a, u, c, r, v) {
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
      (this.expirationTimes = vi(-1)),
      (this.entangledLanes =
        this.shellSuspendCounter =
        this.errorRecoveryDisabledLanes =
        this.expiredLanes =
        this.warmLanes =
        this.pingedLanes =
        this.suspendedLanes =
        this.pendingLanes =
          0),
      (this.entanglements = vi(0)),
      (this.hiddenUpdates = vi(null)),
      (this.identifierPrefix = n),
      (this.onUncaughtError = a),
      (this.onCaughtError = u),
      (this.onRecoverableError = c),
      (this.pooledCache = null),
      (this.pooledCacheLanes = 0),
      (this.formState = v),
      (this.incompleteTransitions = new Map()));
  }
  function Gd(t, e, l, n, a, u, c, r, v, A, C, U) {
    return (
      (t = new rv(t, e, l, c, v, A, C, U, r)),
      (e = 1),
      u === !0 && (e |= 24),
      (u = me(3, null, null, e)),
      (t.current = u),
      (u.stateNode = t),
      (e = Ii()),
      e.refCount++,
      (t.pooledCache = e),
      e.refCount++,
      (u.memoizedState = { element: n, isDehydrated: l, cache: e }),
      nc(u),
      t
    );
  }
  function Ld(t) {
    return t ? ((t = rn), t) : rn;
  }
  function Xd(t, e, l, n, a, u) {
    ((a = Ld(a)),
      n.context === null ? (n.context = a) : (n.pendingContext = a),
      (n = ol(e)),
      (n.payload = { element: l }),
      (u = u === void 0 ? null : u),
      u !== null && (n.callback = u),
      (l = rl(t, n, e)),
      l !== null && (fe(l, t, e), ca(l, t, e)));
  }
  function Qd(t, e) {
    if (((t = t.memoizedState), t !== null && t.dehydrated !== null)) {
      var l = t.retryLane;
      t.retryLane = l !== 0 && l < e ? l : e;
    }
  }
  function zf(t, e) {
    (Qd(t, e), (t = t.alternate) && Qd(t, e));
  }
  function Vd(t) {
    if (t.tag === 13 || t.tag === 31) {
      var e = Bl(t, 67108864);
      (e !== null && fe(e, t, 67108864), zf(t, 67108864));
    }
  }
  function Zd(t) {
    if (t.tag === 13 || t.tag === 31) {
      var e = be();
      e = yi(e);
      var l = Bl(t, e);
      (l !== null && fe(l, t, e), zf(t, e));
    }
  }
  var Fu = !0;
  function sv(t, e, l, n) {
    var a = M.T;
    M.T = null;
    var u = H.p;
    try {
      ((H.p = 2), Tf(t, e, l, n));
    } finally {
      ((H.p = u), (M.T = a));
    }
  }
  function dv(t, e, l, n) {
    var a = M.T;
    M.T = null;
    var u = H.p;
    try {
      ((H.p = 8), Tf(t, e, l, n));
    } finally {
      ((H.p = u), (M.T = a));
    }
  }
  function Tf(t, e, l, n) {
    if (Fu) {
      var a = Af(n);
      if (a === null) (of(t, e, n, Pu, l), Jd(t, n));
      else if (hv(a, t, e, l, n)) n.stopPropagation();
      else if ((Jd(t, n), e & 4 && -1 < mv.indexOf(t))) {
        for (; a !== null; ) {
          var u = Pl(a);
          if (u !== null)
            switch (u.tag) {
              case 3:
                if (((u = u.stateNode), u.current.memoizedState.isDehydrated)) {
                  var c = Rl(u.pendingLanes);
                  if (c !== 0) {
                    var r = u;
                    for (r.pendingLanes |= 2, r.entangledLanes |= 2; c; ) {
                      var v = 1 << (31 - se(c));
                      ((r.entanglements[1] |= v), (c &= ~v));
                    }
                    (He(u), (xt & 6) === 0 && ((ju = oe() + 500), Ta(0)));
                  }
                }
                break;
              case 31:
              case 13:
                ((r = Bl(u, 2)), r !== null && fe(r, u, 2), Bu(), zf(u, 2));
            }
          if (((u = Af(n)), u === null && of(t, e, n, Pu, l), u === a)) break;
          a = u;
        }
        a !== null && n.stopPropagation();
      } else of(t, e, n, null, l);
    }
  }
  function Af(t) {
    return ((t = xi(t)), xf(t));
  }
  var Pu = null;
  function xf(t) {
    if (((Pu = null), (t = Fl(t)), t !== null)) {
      var e = d(t);
      if (e === null) t = null;
      else {
        var l = e.tag;
        if (l === 13) {
          if (((t = b(e)), t !== null)) return t;
          t = null;
        } else if (l === 31) {
          if (((t = h(e)), t !== null)) return t;
          t = null;
        } else if (l === 3) {
          if (e.stateNode.current.memoizedState.isDehydrated)
            return e.tag === 3 ? e.stateNode.containerInfo : null;
          t = null;
        } else e !== t && (t = null);
      }
    }
    return ((Pu = t), null);
  }
  function Kd(t) {
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
        switch (Pm()) {
          case If:
            return 2;
          case to:
            return 8;
          case La:
          case Im:
            return 32;
          case eo:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var Mf = !1,
    El = null,
    zl = null,
    Tl = null,
    Da = new Map(),
    Ra = new Map(),
    Al = [],
    mv =
      'mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset'.split(
        ' ',
      );
  function Jd(t, e) {
    switch (t) {
      case 'focusin':
      case 'focusout':
        El = null;
        break;
      case 'dragenter':
      case 'dragleave':
        zl = null;
        break;
      case 'mouseover':
      case 'mouseout':
        Tl = null;
        break;
      case 'pointerover':
      case 'pointerout':
        Da.delete(e.pointerId);
        break;
      case 'gotpointercapture':
      case 'lostpointercapture':
        Ra.delete(e.pointerId);
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
        e !== null && ((e = Pl(e)), e !== null && Vd(e)),
        t)
      : ((t.eventSystemFlags |= n),
        (e = t.targetContainers),
        a !== null && e.indexOf(a) === -1 && e.push(a),
        t);
  }
  function hv(t, e, l, n, a) {
    switch (e) {
      case 'focusin':
        return ((El = Ua(El, t, e, l, n, a)), !0);
      case 'dragenter':
        return ((zl = Ua(zl, t, e, l, n, a)), !0);
      case 'mouseover':
        return ((Tl = Ua(Tl, t, e, l, n, a)), !0);
      case 'pointerover':
        var u = a.pointerId;
        return (Da.set(u, Ua(Da.get(u) || null, t, e, l, n, a)), !0);
      case 'gotpointercapture':
        return ((u = a.pointerId), Ra.set(u, Ua(Ra.get(u) || null, t, e, l, n, a)), !0);
    }
    return !1;
  }
  function $d(t) {
    var e = Fl(t.target);
    if (e !== null) {
      var l = d(e);
      if (l !== null) {
        if (((e = l.tag), e === 13)) {
          if (((e = b(l)), e !== null)) {
            ((t.blockedOn = e),
              co(t.priority, function () {
                Zd(l);
              }));
            return;
          }
        } else if (e === 31) {
          if (((e = h(l)), e !== null)) {
            ((t.blockedOn = e),
              co(t.priority, function () {
                Zd(l);
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
  function Iu(t) {
    if (t.blockedOn !== null) return !1;
    for (var e = t.targetContainers; 0 < e.length; ) {
      var l = Af(t.nativeEvent);
      if (l === null) {
        l = t.nativeEvent;
        var n = new l.constructor(l.type, l);
        ((Ai = n), l.target.dispatchEvent(n), (Ai = null));
      } else return ((e = Pl(l)), e !== null && Vd(e), (t.blockedOn = l), !1);
      e.shift();
    }
    return !0;
  }
  function kd(t, e, l) {
    Iu(t) && l.delete(e);
  }
  function vv() {
    ((Mf = !1),
      El !== null && Iu(El) && (El = null),
      zl !== null && Iu(zl) && (zl = null),
      Tl !== null && Iu(Tl) && (Tl = null),
      Da.forEach(kd),
      Ra.forEach(kd));
  }
  function ti(t, e) {
    t.blockedOn === e &&
      ((t.blockedOn = null),
      Mf || ((Mf = !0), i.unstable_scheduleCallback(i.unstable_NormalPriority, vv)));
  }
  var ei = null;
  function Wd(t) {
    ei !== t &&
      ((ei = t),
      i.unstable_scheduleCallback(i.unstable_NormalPriority, function () {
        ei === t && (ei = null);
        for (var e = 0; e < t.length; e += 3) {
          var l = t[e],
            n = t[e + 1],
            a = t[e + 2];
          if (typeof n != 'function') {
            if (xf(n || l) === null) continue;
            break;
          }
          var u = Pl(l);
          u !== null &&
            (t.splice(e, 3),
            (e -= 3),
            Tc(u, { pending: !0, data: a, method: l.method, action: n }, n, a));
        }
      }));
  }
  function jn(t) {
    function e(v) {
      return ti(v, t);
    }
    (El !== null && ti(El, t),
      zl !== null && ti(zl, t),
      Tl !== null && ti(Tl, t),
      Da.forEach(e),
      Ra.forEach(e));
    for (var l = 0; l < Al.length; l++) {
      var n = Al[l];
      n.blockedOn === t && (n.blockedOn = null);
    }
    for (; 0 < Al.length && ((l = Al[0]), l.blockedOn === null); )
      ($d(l), l.blockedOn === null && Al.shift());
    if (((l = (t.ownerDocument || t).$$reactFormReplay), l != null))
      for (n = 0; n < l.length; n += 3) {
        var a = l[n],
          u = l[n + 1],
          c = a[le] || null;
        if (typeof u == 'function') c || Wd(l);
        else if (c) {
          var r = null;
          if (u && u.hasAttribute('formAction')) {
            if (((a = u), (c = u[le] || null))) r = c.formAction;
            else if (xf(a) !== null) continue;
          } else r = c.action;
          (typeof r == 'function' ? (l[n + 1] = r) : (l.splice(n, 3), (n -= 3)), Wd(l));
        }
      }
  }
  function Fd() {
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
  function _f(t) {
    this._internalRoot = t;
  }
  ((li.prototype.render = _f.prototype.render =
    function (t) {
      var e = this._internalRoot;
      if (e === null) throw Error(f(409));
      var l = e.current,
        n = be();
      Xd(l, n, t, e, null, null);
    }),
    (li.prototype.unmount = _f.prototype.unmount =
      function () {
        var t = this._internalRoot;
        if (t !== null) {
          this._internalRoot = null;
          var e = t.containerInfo;
          (Xd(t.current, 2, null, t, null, null), Bu(), (e[Wl] = null));
        }
      }));
  function li(t) {
    this._internalRoot = t;
  }
  li.prototype.unstable_scheduleHydration = function (t) {
    if (t) {
      var e = io();
      t = { blockedOn: null, target: t, priority: e };
      for (var l = 0; l < Al.length && e !== 0 && e < Al[l].priority; l++);
      (Al.splice(l, 0, t), l === 0 && $d(t));
    }
  };
  var Pd = o.version;
  if (Pd !== '19.2.6') throw Error(f(527, Pd, '19.2.6'));
  H.findDOMNode = function (t) {
    var e = t._reactInternals;
    if (e === void 0)
      throw typeof t.render == 'function'
        ? Error(f(188))
        : ((t = Object.keys(t).join(',')), Error(f(268, t)));
    return ((t = y(e)), (t = t !== null ? O(t) : null), (t = t === null ? null : t.stateNode), t);
  };
  var yv = {
    bundleType: 0,
    version: '19.2.6',
    rendererPackageName: 'react-dom',
    currentDispatcherRef: M,
    reconcilerVersion: '19.2.6',
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < 'u') {
    var ni = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!ni.isDisabled && ni.supportsFiber)
      try {
        ((Ln = ni.inject(yv)), (re = ni));
      } catch {}
  }
  return (
    (ja.createRoot = function (t, e) {
      if (!m(t)) throw Error(f(299));
      var l = !1,
        n = '',
        a = us,
        u = is,
        c = cs;
      return (
        e != null &&
          (e.unstable_strictMode === !0 && (l = !0),
          e.identifierPrefix !== void 0 && (n = e.identifierPrefix),
          e.onUncaughtError !== void 0 && (a = e.onUncaughtError),
          e.onCaughtError !== void 0 && (u = e.onCaughtError),
          e.onRecoverableError !== void 0 && (c = e.onRecoverableError)),
        (e = Gd(t, 1, !1, null, null, l, n, null, a, u, c, Fd)),
        (t[Wl] = e.current),
        ff(t),
        new _f(e)
      );
    }),
    (ja.hydrateRoot = function (t, e, l) {
      if (!m(t)) throw Error(f(299));
      var n = !1,
        a = '',
        u = us,
        c = is,
        r = cs,
        v = null;
      return (
        l != null &&
          (l.unstable_strictMode === !0 && (n = !0),
          l.identifierPrefix !== void 0 && (a = l.identifierPrefix),
          l.onUncaughtError !== void 0 && (u = l.onUncaughtError),
          l.onCaughtError !== void 0 && (c = l.onCaughtError),
          l.onRecoverableError !== void 0 && (r = l.onRecoverableError),
          l.formState !== void 0 && (v = l.formState)),
        (e = Gd(t, 1, !0, e, l ?? null, n, a, v, u, c, r, Fd)),
        (e.context = Ld(null)),
        (l = e.current),
        (n = be()),
        (n = yi(n)),
        (a = ol(n)),
        (a.callback = null),
        rl(l, a, n),
        (l = n),
        (e.current.lanes = l),
        Qn(e, l),
        He(e),
        (t[Wl] = e.current),
        ff(t),
        new li(e)
      );
    }),
    (ja.version = '19.2.6'),
    ja
  );
}
var fm;
function Ov() {
  if (fm) return Df.exports;
  fm = 1;
  function i() {
    if (
      !(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > 'u' ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != 'function'
      )
    )
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i);
      } catch (o) {
        console.error(o);
      }
  }
  return (i(), (Df.exports = _v()), Df.exports);
}
var Cv = Ov();
function Sm(i) {
  var o,
    s,
    f = '';
  if (typeof i == 'string' || typeof i == 'number') f += i;
  else if (typeof i == 'object')
    if (Array.isArray(i)) {
      var m = i.length;
      for (o = 0; o < m; o++) i[o] && (s = Sm(i[o])) && (f && (f += ' '), (f += s));
    } else for (s in i) i[s] && (f && (f += ' '), (f += s));
  return f;
}
function Dv() {
  for (var i, o, s = 0, f = '', m = arguments.length; s < m; s++)
    (i = arguments[s]) && (o = Sm(i)) && (f && (f += ' '), (f += o));
  return f;
}
const kf = '-',
  Rv = (i) => {
    const o = Nv(i),
      { conflictingClassGroups: s, conflictingClassGroupModifiers: f } = i;
    return {
      getClassGroupId: (b) => {
        const h = b.split(kf);
        return (h[0] === '' && h.length !== 1 && h.shift(), Em(h, o) || Uv(b));
      },
      getConflictingClassGroupIds: (b, h) => {
        const S = s[b] || [];
        return h && f[b] ? [...S, ...f[b]] : S;
      },
    };
  },
  Em = (i, o) => {
    var b;
    if (i.length === 0) return o.classGroupId;
    const s = i[0],
      f = o.nextPart.get(s),
      m = f ? Em(i.slice(1), f) : void 0;
    if (m) return m;
    if (o.validators.length === 0) return;
    const d = i.join(kf);
    return (b = o.validators.find(({ validator: h }) => h(d))) == null ? void 0 : b.classGroupId;
  },
  om = /^\[(.+)\]$/,
  Uv = (i) => {
    if (om.test(i)) {
      const o = om.exec(i)[1],
        s = o == null ? void 0 : o.substring(0, o.indexOf(':'));
      if (s) return 'arbitrary..' + s;
    }
  },
  Nv = (i) => {
    const { theme: o, prefix: s } = i,
      f = { nextPart: new Map(), validators: [] };
    return (
      Hv(Object.entries(i.classGroups), s).forEach(([d, b]) => {
        Gf(b, f, d, o);
      }),
      f
    );
  },
  Gf = (i, o, s, f) => {
    i.forEach((m) => {
      if (typeof m == 'string') {
        const d = m === '' ? o : rm(o, m);
        d.classGroupId = s;
        return;
      }
      if (typeof m == 'function') {
        if (jv(m)) {
          Gf(m(f), o, s, f);
          return;
        }
        o.validators.push({ validator: m, classGroupId: s });
        return;
      }
      Object.entries(m).forEach(([d, b]) => {
        Gf(b, rm(o, d), s, f);
      });
    });
  },
  rm = (i, o) => {
    let s = i;
    return (
      o.split(kf).forEach((f) => {
        (s.nextPart.has(f) || s.nextPart.set(f, { nextPart: new Map(), validators: [] }),
          (s = s.nextPart.get(f)));
      }),
      s
    );
  },
  jv = (i) => i.isThemeGetter,
  Hv = (i, o) =>
    o
      ? i.map(([s, f]) => {
          const m = f.map((d) =>
            typeof d == 'string'
              ? o + d
              : typeof d == 'object'
                ? Object.fromEntries(Object.entries(d).map(([b, h]) => [o + b, h]))
                : d,
          );
          return [s, m];
        })
      : i,
  Bv = (i) => {
    if (i < 1) return { get: () => {}, set: () => {} };
    let o = 0,
      s = new Map(),
      f = new Map();
    const m = (d, b) => {
      (s.set(d, b), o++, o > i && ((o = 0), (f = s), (s = new Map())));
    };
    return {
      get(d) {
        let b = s.get(d);
        if (b !== void 0) return b;
        if ((b = f.get(d)) !== void 0) return (m(d, b), b);
      },
      set(d, b) {
        s.has(d) ? s.set(d, b) : m(d, b);
      },
    };
  },
  zm = '!',
  wv = (i) => {
    const { separator: o, experimentalParseClassName: s } = i,
      f = o.length === 1,
      m = o[0],
      d = o.length,
      b = (h) => {
        const S = [];
        let y = 0,
          O = 0,
          z;
        for (let X = 0; X < h.length; X++) {
          let L = h[X];
          if (y === 0) {
            if (L === m && (f || h.slice(X, X + d) === o)) {
              (S.push(h.slice(O, X)), (O = X + d));
              continue;
            }
            if (L === '/') {
              z = X;
              continue;
            }
          }
          L === '[' ? y++ : L === ']' && y--;
        }
        const N = S.length === 0 ? h : h.substring(O),
          G = N.startsWith(zm),
          k = G ? N.substring(1) : N,
          Y = z && z > O ? z - O : void 0;
        return {
          modifiers: S,
          hasImportantModifier: G,
          baseClassName: k,
          maybePostfixModifierPosition: Y,
        };
      };
    return s ? (h) => s({ className: h, parseClassName: b }) : b;
  },
  qv = (i) => {
    if (i.length <= 1) return i;
    const o = [];
    let s = [];
    return (
      i.forEach((f) => {
        f[0] === '[' ? (o.push(...s.sort(), f), (s = [])) : s.push(f);
      }),
      o.push(...s.sort()),
      o
    );
  },
  Yv = (i) => ({ cache: Bv(i.cacheSize), parseClassName: wv(i), ...Rv(i) }),
  Gv = /\s+/,
  Lv = (i, o) => {
    const { parseClassName: s, getClassGroupId: f, getConflictingClassGroupIds: m } = o,
      d = [],
      b = i.trim().split(Gv);
    let h = '';
    for (let S = b.length - 1; S >= 0; S -= 1) {
      const y = b[S],
        {
          modifiers: O,
          hasImportantModifier: z,
          baseClassName: N,
          maybePostfixModifierPosition: G,
        } = s(y);
      let k = !!G,
        Y = f(k ? N.substring(0, G) : N);
      if (!Y) {
        if (!k) {
          h = y + (h.length > 0 ? ' ' + h : h);
          continue;
        }
        if (((Y = f(N)), !Y)) {
          h = y + (h.length > 0 ? ' ' + h : h);
          continue;
        }
        k = !1;
      }
      const X = qv(O).join(':'),
        L = z ? X + zm : X,
        J = L + Y;
      if (d.includes(J)) continue;
      d.push(J);
      const V = m(Y, k);
      for (let K = 0; K < V.length; ++K) {
        const ct = V[K];
        d.push(L + ct);
      }
      h = y + (h.length > 0 ? ' ' + h : h);
    }
    return h;
  };
function Xv() {
  let i = 0,
    o,
    s,
    f = '';
  for (; i < arguments.length; ) (o = arguments[i++]) && (s = Tm(o)) && (f && (f += ' '), (f += s));
  return f;
}
const Tm = (i) => {
  if (typeof i == 'string') return i;
  let o,
    s = '';
  for (let f = 0; f < i.length; f++) i[f] && (o = Tm(i[f])) && (s && (s += ' '), (s += o));
  return s;
};
function Qv(i, ...o) {
  let s,
    f,
    m,
    d = b;
  function b(S) {
    const y = o.reduce((O, z) => z(O), i());
    return ((s = Yv(y)), (f = s.cache.get), (m = s.cache.set), (d = h), h(S));
  }
  function h(S) {
    const y = f(S);
    if (y) return y;
    const O = Lv(S, s);
    return (m(S, O), O);
  }
  return function () {
    return d(Xv.apply(null, arguments));
  };
}
const jt = (i) => {
    const o = (s) => s[i] || [];
    return ((o.isThemeGetter = !0), o);
  },
  Am = /^\[(?:([a-z-]+):)?(.+)\]$/i,
  Vv = /^\d+\/\d+$/,
  Zv = new Set(['px', 'full', 'screen']),
  Kv = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,
  Jv =
    /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,
  $v = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/,
  kv = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,
  Wv =
    /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,
  tl = (i) => Bn(i) || Zv.has(i) || Vv.test(i),
  Ml = (i) => qn(i, 'length', ay),
  Bn = (i) => !!i && !Number.isNaN(Number(i)),
  jf = (i) => qn(i, 'number', Bn),
  Ha = (i) => !!i && Number.isInteger(Number(i)),
  Fv = (i) => i.endsWith('%') && Bn(i.slice(0, -1)),
  st = (i) => Am.test(i),
  _l = (i) => Kv.test(i),
  Pv = new Set(['length', 'size', 'percentage']),
  Iv = (i) => qn(i, Pv, xm),
  ty = (i) => qn(i, 'position', xm),
  ey = new Set(['image', 'url']),
  ly = (i) => qn(i, ey, iy),
  ny = (i) => qn(i, '', uy),
  Ba = () => !0,
  qn = (i, o, s) => {
    const f = Am.exec(i);
    return f ? (f[1] ? (typeof o == 'string' ? f[1] === o : o.has(f[1])) : s(f[2])) : !1;
  },
  ay = (i) => Jv.test(i) && !$v.test(i),
  xm = () => !1,
  uy = (i) => kv.test(i),
  iy = (i) => Wv.test(i),
  cy = () => {
    const i = jt('colors'),
      o = jt('spacing'),
      s = jt('blur'),
      f = jt('brightness'),
      m = jt('borderColor'),
      d = jt('borderRadius'),
      b = jt('borderSpacing'),
      h = jt('borderWidth'),
      S = jt('contrast'),
      y = jt('grayscale'),
      O = jt('hueRotate'),
      z = jt('invert'),
      N = jt('gap'),
      G = jt('gradientColorStops'),
      k = jt('gradientColorStopPositions'),
      Y = jt('inset'),
      X = jt('margin'),
      L = jt('opacity'),
      J = jt('padding'),
      V = jt('saturate'),
      K = jt('scale'),
      ct = jt('sepia'),
      P = jt('skew'),
      w = jt('space'),
      nt = jt('translate'),
      St = () => ['auto', 'contain', 'none'],
      Et = () => ['auto', 'hidden', 'clip', 'visible', 'scroll'],
      dt = () => ['auto', st, o],
      j = () => [st, o],
      at = () => ['', tl, Ml],
      At = () => ['auto', Bn, st],
      mt = () => [
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
      M = () => ['solid', 'dashed', 'dotted', 'double', 'none'],
      H = () => [
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
      W = () => ['start', 'end', 'center', 'between', 'around', 'evenly', 'stretch'],
      ut = () => ['', '0', st],
      lt = () => ['auto', 'avoid', 'all', 'avoid-page', 'page', 'left', 'right', 'column'],
      g = () => [Bn, st];
    return {
      cacheSize: 500,
      separator: ':',
      theme: {
        colors: [Ba],
        spacing: [tl, Ml],
        blur: ['none', '', _l, st],
        brightness: g(),
        borderColor: [i],
        borderRadius: ['none', '', 'full', _l, st],
        borderSpacing: j(),
        borderWidth: at(),
        contrast: g(),
        grayscale: ut(),
        hueRotate: g(),
        invert: ut(),
        gap: j(),
        gradientColorStops: [i],
        gradientColorStopPositions: [Fv, Ml],
        inset: dt(),
        margin: dt(),
        opacity: g(),
        padding: j(),
        saturate: g(),
        scale: g(),
        sepia: ut(),
        skew: g(),
        space: j(),
        translate: j(),
      },
      classGroups: {
        aspect: [{ aspect: ['auto', 'square', 'video', st] }],
        container: ['container'],
        columns: [{ columns: [_l] }],
        'break-after': [{ 'break-after': lt() }],
        'break-before': [{ 'break-before': lt() }],
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
        'object-position': [{ object: [...mt(), st] }],
        overflow: [{ overflow: Et() }],
        'overflow-x': [{ 'overflow-x': Et() }],
        'overflow-y': [{ 'overflow-y': Et() }],
        overscroll: [{ overscroll: St() }],
        'overscroll-x': [{ 'overscroll-x': St() }],
        'overscroll-y': [{ 'overscroll-y': St() }],
        position: ['static', 'fixed', 'absolute', 'relative', 'sticky'],
        inset: [{ inset: [Y] }],
        'inset-x': [{ 'inset-x': [Y] }],
        'inset-y': [{ 'inset-y': [Y] }],
        start: [{ start: [Y] }],
        end: [{ end: [Y] }],
        top: [{ top: [Y] }],
        right: [{ right: [Y] }],
        bottom: [{ bottom: [Y] }],
        left: [{ left: [Y] }],
        visibility: ['visible', 'invisible', 'collapse'],
        z: [{ z: ['auto', Ha, st] }],
        basis: [{ basis: dt() }],
        'flex-direction': [{ flex: ['row', 'row-reverse', 'col', 'col-reverse'] }],
        'flex-wrap': [{ flex: ['wrap', 'wrap-reverse', 'nowrap'] }],
        flex: [{ flex: ['1', 'auto', 'initial', 'none', st] }],
        grow: [{ grow: ut() }],
        shrink: [{ shrink: ut() }],
        order: [{ order: ['first', 'last', 'none', Ha, st] }],
        'grid-cols': [{ 'grid-cols': [Ba] }],
        'col-start-end': [{ col: ['auto', { span: ['full', Ha, st] }, st] }],
        'col-start': [{ 'col-start': At() }],
        'col-end': [{ 'col-end': At() }],
        'grid-rows': [{ 'grid-rows': [Ba] }],
        'row-start-end': [{ row: ['auto', { span: [Ha, st] }, st] }],
        'row-start': [{ 'row-start': At() }],
        'row-end': [{ 'row-end': At() }],
        'grid-flow': [{ 'grid-flow': ['row', 'col', 'dense', 'row-dense', 'col-dense'] }],
        'auto-cols': [{ 'auto-cols': ['auto', 'min', 'max', 'fr', st] }],
        'auto-rows': [{ 'auto-rows': ['auto', 'min', 'max', 'fr', st] }],
        gap: [{ gap: [N] }],
        'gap-x': [{ 'gap-x': [N] }],
        'gap-y': [{ 'gap-y': [N] }],
        'justify-content': [{ justify: ['normal', ...W()] }],
        'justify-items': [{ 'justify-items': ['start', 'end', 'center', 'stretch'] }],
        'justify-self': [{ 'justify-self': ['auto', 'start', 'end', 'center', 'stretch'] }],
        'align-content': [{ content: ['normal', ...W(), 'baseline'] }],
        'align-items': [{ items: ['start', 'end', 'center', 'baseline', 'stretch'] }],
        'align-self': [{ self: ['auto', 'start', 'end', 'center', 'stretch', 'baseline'] }],
        'place-content': [{ 'place-content': [...W(), 'baseline'] }],
        'place-items': [{ 'place-items': ['start', 'end', 'center', 'baseline', 'stretch'] }],
        'place-self': [{ 'place-self': ['auto', 'start', 'end', 'center', 'stretch'] }],
        p: [{ p: [J] }],
        px: [{ px: [J] }],
        py: [{ py: [J] }],
        ps: [{ ps: [J] }],
        pe: [{ pe: [J] }],
        pt: [{ pt: [J] }],
        pr: [{ pr: [J] }],
        pb: [{ pb: [J] }],
        pl: [{ pl: [J] }],
        m: [{ m: [X] }],
        mx: [{ mx: [X] }],
        my: [{ my: [X] }],
        ms: [{ ms: [X] }],
        me: [{ me: [X] }],
        mt: [{ mt: [X] }],
        mr: [{ mr: [X] }],
        mb: [{ mb: [X] }],
        ml: [{ ml: [X] }],
        'space-x': [{ 'space-x': [w] }],
        'space-x-reverse': ['space-x-reverse'],
        'space-y': [{ 'space-y': [w] }],
        'space-y-reverse': ['space-y-reverse'],
        w: [{ w: ['auto', 'min', 'max', 'fit', 'svw', 'lvw', 'dvw', st, o] }],
        'min-w': [{ 'min-w': [st, o, 'min', 'max', 'fit'] }],
        'max-w': [
          { 'max-w': [st, o, 'none', 'full', 'min', 'max', 'fit', 'prose', { screen: [_l] }, _l] },
        ],
        h: [{ h: [st, o, 'auto', 'min', 'max', 'fit', 'svh', 'lvh', 'dvh'] }],
        'min-h': [{ 'min-h': [st, o, 'min', 'max', 'fit', 'svh', 'lvh', 'dvh'] }],
        'max-h': [{ 'max-h': [st, o, 'min', 'max', 'fit', 'svh', 'lvh', 'dvh'] }],
        size: [{ size: [st, o, 'auto', 'min', 'max', 'fit'] }],
        'font-size': [{ text: ['base', _l, Ml] }],
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
              jf,
            ],
          },
        ],
        'font-family': [{ font: [Ba] }],
        'fvn-normal': ['normal-nums'],
        'fvn-ordinal': ['ordinal'],
        'fvn-slashed-zero': ['slashed-zero'],
        'fvn-figure': ['lining-nums', 'oldstyle-nums'],
        'fvn-spacing': ['proportional-nums', 'tabular-nums'],
        'fvn-fraction': ['diagonal-fractions', 'stacked-fractions'],
        tracking: [{ tracking: ['tighter', 'tight', 'normal', 'wide', 'wider', 'widest', st] }],
        'line-clamp': [{ 'line-clamp': ['none', Bn, jf] }],
        leading: [{ leading: ['none', 'tight', 'snug', 'normal', 'relaxed', 'loose', tl, st] }],
        'list-image': [{ 'list-image': ['none', st] }],
        'list-style-type': [{ list: ['none', 'disc', 'decimal', st] }],
        'list-style-position': [{ list: ['inside', 'outside'] }],
        'placeholder-color': [{ placeholder: [i] }],
        'placeholder-opacity': [{ 'placeholder-opacity': [L] }],
        'text-alignment': [{ text: ['left', 'center', 'right', 'justify', 'start', 'end'] }],
        'text-color': [{ text: [i] }],
        'text-opacity': [{ 'text-opacity': [L] }],
        'text-decoration': ['underline', 'overline', 'line-through', 'no-underline'],
        'text-decoration-style': [{ decoration: [...M(), 'wavy'] }],
        'text-decoration-thickness': [{ decoration: ['auto', 'from-font', tl, Ml] }],
        'underline-offset': [{ 'underline-offset': ['auto', tl, st] }],
        'text-decoration-color': [{ decoration: [i] }],
        'text-transform': ['uppercase', 'lowercase', 'capitalize', 'normal-case'],
        'text-overflow': ['truncate', 'text-ellipsis', 'text-clip'],
        'text-wrap': [{ text: ['wrap', 'nowrap', 'balance', 'pretty'] }],
        indent: [{ indent: j() }],
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
              st,
            ],
          },
        ],
        whitespace: [
          { whitespace: ['normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap', 'break-spaces'] },
        ],
        break: [{ break: ['normal', 'words', 'all', 'keep'] }],
        hyphens: [{ hyphens: ['none', 'manual', 'auto'] }],
        content: [{ content: ['none', st] }],
        'bg-attachment': [{ bg: ['fixed', 'local', 'scroll'] }],
        'bg-clip': [{ 'bg-clip': ['border', 'padding', 'content', 'text'] }],
        'bg-opacity': [{ 'bg-opacity': [L] }],
        'bg-origin': [{ 'bg-origin': ['border', 'padding', 'content'] }],
        'bg-position': [{ bg: [...mt(), ty] }],
        'bg-repeat': [{ bg: ['no-repeat', { repeat: ['', 'x', 'y', 'round', 'space'] }] }],
        'bg-size': [{ bg: ['auto', 'cover', 'contain', Iv] }],
        'bg-image': [
          { bg: ['none', { 'gradient-to': ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl'] }, ly] },
        ],
        'bg-color': [{ bg: [i] }],
        'gradient-from-pos': [{ from: [k] }],
        'gradient-via-pos': [{ via: [k] }],
        'gradient-to-pos': [{ to: [k] }],
        'gradient-from': [{ from: [G] }],
        'gradient-via': [{ via: [G] }],
        'gradient-to': [{ to: [G] }],
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
        'border-w': [{ border: [h] }],
        'border-w-x': [{ 'border-x': [h] }],
        'border-w-y': [{ 'border-y': [h] }],
        'border-w-s': [{ 'border-s': [h] }],
        'border-w-e': [{ 'border-e': [h] }],
        'border-w-t': [{ 'border-t': [h] }],
        'border-w-r': [{ 'border-r': [h] }],
        'border-w-b': [{ 'border-b': [h] }],
        'border-w-l': [{ 'border-l': [h] }],
        'border-opacity': [{ 'border-opacity': [L] }],
        'border-style': [{ border: [...M(), 'hidden'] }],
        'divide-x': [{ 'divide-x': [h] }],
        'divide-x-reverse': ['divide-x-reverse'],
        'divide-y': [{ 'divide-y': [h] }],
        'divide-y-reverse': ['divide-y-reverse'],
        'divide-opacity': [{ 'divide-opacity': [L] }],
        'divide-style': [{ divide: M() }],
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
        'outline-style': [{ outline: ['', ...M()] }],
        'outline-offset': [{ 'outline-offset': [tl, st] }],
        'outline-w': [{ outline: [tl, Ml] }],
        'outline-color': [{ outline: [i] }],
        'ring-w': [{ ring: at() }],
        'ring-w-inset': ['ring-inset'],
        'ring-color': [{ ring: [i] }],
        'ring-opacity': [{ 'ring-opacity': [L] }],
        'ring-offset-w': [{ 'ring-offset': [tl, Ml] }],
        'ring-offset-color': [{ 'ring-offset': [i] }],
        shadow: [{ shadow: ['', 'inner', 'none', _l, ny] }],
        'shadow-color': [{ shadow: [Ba] }],
        opacity: [{ opacity: [L] }],
        'mix-blend': [{ 'mix-blend': [...H(), 'plus-lighter', 'plus-darker'] }],
        'bg-blend': [{ 'bg-blend': H() }],
        filter: [{ filter: ['', 'none'] }],
        blur: [{ blur: [s] }],
        brightness: [{ brightness: [f] }],
        contrast: [{ contrast: [S] }],
        'drop-shadow': [{ 'drop-shadow': ['', 'none', _l, st] }],
        grayscale: [{ grayscale: [y] }],
        'hue-rotate': [{ 'hue-rotate': [O] }],
        invert: [{ invert: [z] }],
        saturate: [{ saturate: [V] }],
        sepia: [{ sepia: [ct] }],
        'backdrop-filter': [{ 'backdrop-filter': ['', 'none'] }],
        'backdrop-blur': [{ 'backdrop-blur': [s] }],
        'backdrop-brightness': [{ 'backdrop-brightness': [f] }],
        'backdrop-contrast': [{ 'backdrop-contrast': [S] }],
        'backdrop-grayscale': [{ 'backdrop-grayscale': [y] }],
        'backdrop-hue-rotate': [{ 'backdrop-hue-rotate': [O] }],
        'backdrop-invert': [{ 'backdrop-invert': [z] }],
        'backdrop-opacity': [{ 'backdrop-opacity': [L] }],
        'backdrop-saturate': [{ 'backdrop-saturate': [V] }],
        'backdrop-sepia': [{ 'backdrop-sepia': [ct] }],
        'border-collapse': [{ border: ['collapse', 'separate'] }],
        'border-spacing': [{ 'border-spacing': [b] }],
        'border-spacing-x': [{ 'border-spacing-x': [b] }],
        'border-spacing-y': [{ 'border-spacing-y': [b] }],
        'table-layout': [{ table: ['auto', 'fixed'] }],
        caption: [{ caption: ['top', 'bottom'] }],
        transition: [
          { transition: ['none', 'all', '', 'colors', 'opacity', 'shadow', 'transform', st] },
        ],
        duration: [{ duration: g() }],
        ease: [{ ease: ['linear', 'in', 'out', 'in-out', st] }],
        delay: [{ delay: g() }],
        animate: [{ animate: ['none', 'spin', 'ping', 'pulse', 'bounce', st] }],
        transform: [{ transform: ['', 'gpu', 'none'] }],
        scale: [{ scale: [K] }],
        'scale-x': [{ 'scale-x': [K] }],
        'scale-y': [{ 'scale-y': [K] }],
        rotate: [{ rotate: [Ha, st] }],
        'translate-x': [{ 'translate-x': [nt] }],
        'translate-y': [{ 'translate-y': [nt] }],
        'skew-x': [{ 'skew-x': [P] }],
        'skew-y': [{ 'skew-y': [P] }],
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
              st,
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
              st,
            ],
          },
        ],
        'caret-color': [{ caret: [i] }],
        'pointer-events': [{ 'pointer-events': ['none', 'auto'] }],
        resize: [{ resize: ['none', 'y', 'x', ''] }],
        'scroll-behavior': [{ scroll: ['auto', 'smooth'] }],
        'scroll-m': [{ 'scroll-m': j() }],
        'scroll-mx': [{ 'scroll-mx': j() }],
        'scroll-my': [{ 'scroll-my': j() }],
        'scroll-ms': [{ 'scroll-ms': j() }],
        'scroll-me': [{ 'scroll-me': j() }],
        'scroll-mt': [{ 'scroll-mt': j() }],
        'scroll-mr': [{ 'scroll-mr': j() }],
        'scroll-mb': [{ 'scroll-mb': j() }],
        'scroll-ml': [{ 'scroll-ml': j() }],
        'scroll-p': [{ 'scroll-p': j() }],
        'scroll-px': [{ 'scroll-px': j() }],
        'scroll-py': [{ 'scroll-py': j() }],
        'scroll-ps': [{ 'scroll-ps': j() }],
        'scroll-pe': [{ 'scroll-pe': j() }],
        'scroll-pt': [{ 'scroll-pt': j() }],
        'scroll-pr': [{ 'scroll-pr': j() }],
        'scroll-pb': [{ 'scroll-pb': j() }],
        'scroll-pl': [{ 'scroll-pl': j() }],
        'snap-align': [{ snap: ['start', 'end', 'center', 'align-none'] }],
        'snap-stop': [{ snap: ['normal', 'always'] }],
        'snap-type': [{ snap: ['none', 'x', 'y', 'both'] }],
        'snap-strictness': [{ snap: ['mandatory', 'proximity'] }],
        touch: [{ touch: ['auto', 'none', 'manipulation'] }],
        'touch-x': [{ 'touch-pan': ['x', 'left', 'right'] }],
        'touch-y': [{ 'touch-pan': ['y', 'up', 'down'] }],
        'touch-pz': ['touch-pinch-zoom'],
        select: [{ select: ['none', 'text', 'all', 'auto'] }],
        'will-change': [{ 'will-change': ['auto', 'scroll', 'contents', 'transform', st] }],
        fill: [{ fill: [i, 'none'] }],
        'stroke-w': [{ stroke: [tl, Ml, jf] }],
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
  fy = Qv(cy);
function Mm(...i) {
  return fy(Dv(i));
}
const oy = {
    primary:
      'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600 disabled:bg-indigo-600/50',
    secondary:
      'bg-zinc-800 text-zinc-100 hover:bg-zinc-700 focus-visible:outline-zinc-500 disabled:bg-zinc-800/50',
    ghost: 'text-zinc-200 hover:bg-zinc-800/60 focus-visible:outline-zinc-500',
    danger: 'bg-rose-600 text-white hover:bg-rose-500 focus-visible:outline-rose-600',
  },
  ry = { sm: 'h-8 px-3 text-sm', md: 'h-10 px-4 text-sm', lg: 'h-11 px-5 text-base' },
  Hf = q.forwardRef(function (
    { className: o, variant: s = 'primary', size: f = 'md', type: m = 'button', ...d },
    b,
  ) {
    return Q.jsx('button', {
      ref: b,
      type: m,
      className: Mm(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-60',
        oy[s],
        ry[f],
        o,
      ),
      ...d,
    });
  });
function _m(i, [o, s]) {
  return Math.min(s, Math.max(o, i));
}
function Hn(i, o, { checkForDefaultPrevented: s = !0 } = {}) {
  return function (m) {
    if ((i == null || i(m), s === !1 || !m.defaultPrevented)) return o == null ? void 0 : o(m);
  };
}
function sm(i, o) {
  if (typeof i == 'function') return i(o);
  i != null && (i.current = o);
}
function Om(...i) {
  return (o) => {
    let s = !1;
    const f = i.map((m) => {
      const d = sm(m, o);
      return (!s && typeof d == 'function' && (s = !0), d);
    });
    if (s)
      return () => {
        for (let m = 0; m < f.length; m++) {
          const d = f[m];
          typeof d == 'function' ? d() : sm(i[m], null);
        }
      };
  };
}
function Cl(...i) {
  return q.useCallback(Om(...i), i);
}
function Cm(i, o = []) {
  let s = [];
  function f(d, b) {
    const h = q.createContext(b),
      S = s.length;
    s = [...s, b];
    const y = (z) => {
      var L;
      const { scope: N, children: G, ...k } = z,
        Y = ((L = N == null ? void 0 : N[i]) == null ? void 0 : L[S]) || h,
        X = q.useMemo(() => k, Object.values(k));
      return Q.jsx(Y.Provider, { value: X, children: G });
    };
    y.displayName = d + 'Provider';
    function O(z, N) {
      var Y;
      const G = ((Y = N == null ? void 0 : N[i]) == null ? void 0 : Y[S]) || h,
        k = q.useContext(G);
      if (k) return k;
      if (b !== void 0) return b;
      throw new Error(`\`${z}\` must be used within \`${d}\``);
    }
    return [y, O];
  }
  const m = () => {
    const d = s.map((b) => q.createContext(b));
    return function (h) {
      const S = (h == null ? void 0 : h[i]) || d;
      return q.useMemo(() => ({ [`__scope${i}`]: { ...h, [i]: S } }), [h, S]);
    };
  };
  return ((m.scopeName = i), [f, sy(m, ...o)]);
}
function sy(...i) {
  const o = i[0];
  if (i.length === 1) return o;
  const s = () => {
    const f = i.map((m) => ({ useScope: m(), scopeName: m.scopeName }));
    return function (d) {
      const b = f.reduce((h, { useScope: S, scopeName: y }) => {
        const z = S(d)[`__scope${y}`];
        return { ...h, ...z };
      }, {});
      return q.useMemo(() => ({ [`__scope${o.scopeName}`]: b }), [b]);
    };
  };
  return ((s.scopeName = o.scopeName), s);
}
var Dm = globalThis != null && globalThis.document ? q.useLayoutEffect : () => {},
  dy = Tv[' useInsertionEffect '.trim().toString()] || Dm;
function my({ prop: i, defaultProp: o, onChange: s = () => {}, caller: f }) {
  const [m, d, b] = hy({ defaultProp: o, onChange: s }),
    h = i !== void 0,
    S = h ? i : m;
  {
    const O = q.useRef(i !== void 0);
    q.useEffect(() => {
      const z = O.current;
      (z !== h &&
        console.warn(
          `${f} is changing from ${z ? 'controlled' : 'uncontrolled'} to ${h ? 'controlled' : 'uncontrolled'}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`,
        ),
        (O.current = h));
    }, [h, f]);
  }
  const y = q.useCallback(
    (O) => {
      var z;
      if (h) {
        const N = vy(O) ? O(i) : O;
        N !== i && ((z = b.current) == null || z.call(b, N));
      } else d(O);
    },
    [h, i, d, b],
  );
  return [S, y];
}
function hy({ defaultProp: i, onChange: o }) {
  const [s, f] = q.useState(i),
    m = q.useRef(s),
    d = q.useRef(o);
  return (
    dy(() => {
      d.current = o;
    }, [o]),
    q.useEffect(() => {
      var b;
      m.current !== s && ((b = d.current) == null || b.call(d, s), (m.current = s));
    }, [s, m]),
    [s, f, d]
  );
}
function vy(i) {
  return typeof i == 'function';
}
var yy = q.createContext(void 0);
function gy(i) {
  const o = q.useContext(yy);
  return i || o || 'ltr';
}
function by(i) {
  const o = q.useRef({ value: i, previous: i });
  return q.useMemo(
    () => (
      o.current.value !== i && ((o.current.previous = o.current.value), (o.current.value = i)),
      o.current.previous
    ),
    [i],
  );
}
function py(i) {
  const [o, s] = q.useState(void 0);
  return (
    Dm(() => {
      if (i) {
        s({ width: i.offsetWidth, height: i.offsetHeight });
        const f = new ResizeObserver((m) => {
          if (!Array.isArray(m) || !m.length) return;
          const d = m[0];
          let b, h;
          if ('borderBoxSize' in d) {
            const S = d.borderBoxSize,
              y = Array.isArray(S) ? S[0] : S;
            ((b = y.inlineSize), (h = y.blockSize));
          } else ((b = i.offsetWidth), (h = i.offsetHeight));
          s({ width: b, height: h });
        });
        return (f.observe(i, { box: 'border-box' }), () => f.unobserve(i));
      } else s(void 0);
    }, [i]),
    o
  );
}
pm();
function Lf(i) {
  const o = Sy(i),
    s = q.forwardRef((f, m) => {
      const { children: d, ...b } = f,
        h = q.Children.toArray(d),
        S = h.find(zy);
      if (S) {
        const y = S.props.children,
          O = h.map((z) =>
            z === S
              ? q.Children.count(y) > 1
                ? q.Children.only(null)
                : q.isValidElement(y)
                  ? y.props.children
                  : null
              : z,
          );
        return Q.jsx(o, {
          ...b,
          ref: m,
          children: q.isValidElement(y) ? q.cloneElement(y, void 0, O) : null,
        });
      }
      return Q.jsx(o, { ...b, ref: m, children: d });
    });
  return ((s.displayName = `${i}.Slot`), s);
}
function Sy(i) {
  const o = q.forwardRef((s, f) => {
    const { children: m, ...d } = s;
    if (q.isValidElement(m)) {
      const b = Ay(m),
        h = Ty(d, m.props);
      return (m.type !== q.Fragment && (h.ref = f ? Om(f, b) : b), q.cloneElement(m, h));
    }
    return q.Children.count(m) > 1 ? q.Children.only(null) : null;
  });
  return ((o.displayName = `${i}.SlotClone`), o);
}
var Ey = Symbol('radix.slottable');
function zy(i) {
  return (
    q.isValidElement(i) &&
    typeof i.type == 'function' &&
    '__radixId' in i.type &&
    i.type.__radixId === Ey
  );
}
function Ty(i, o) {
  const s = { ...o };
  for (const f in o) {
    const m = i[f],
      d = o[f];
    /^on[A-Z]/.test(f)
      ? m && d
        ? (s[f] = (...h) => {
            const S = d(...h);
            return (m(...h), S);
          })
        : m && (s[f] = m)
      : f === 'style'
        ? (s[f] = { ...m, ...d })
        : f === 'className' && (s[f] = [m, d].filter(Boolean).join(' '));
  }
  return { ...i, ...s };
}
function Ay(i) {
  var f, m;
  let o = (f = Object.getOwnPropertyDescriptor(i.props, 'ref')) == null ? void 0 : f.get,
    s = o && 'isReactWarning' in o && o.isReactWarning;
  return s
    ? i.ref
    : ((o = (m = Object.getOwnPropertyDescriptor(i, 'ref')) == null ? void 0 : m.get),
      (s = o && 'isReactWarning' in o && o.isReactWarning),
      s ? i.props.ref : i.props.ref || i.ref);
}
var xy = [
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
  qa = xy.reduce((i, o) => {
    const s = Lf(`Primitive.${o}`),
      f = q.forwardRef((m, d) => {
        const { asChild: b, ...h } = m,
          S = b ? s : o;
        return (
          typeof window < 'u' && (window[Symbol.for('radix-ui')] = !0),
          Q.jsx(S, { ...h, ref: d })
        );
      });
    return ((f.displayName = `Primitive.${o}`), { ...i, [o]: f });
  }, {});
function My(i) {
  const o = i + 'CollectionProvider',
    [s, f] = Cm(o),
    [m, d] = s(o, { collectionRef: { current: null }, itemMap: new Map() }),
    b = (Y) => {
      const { scope: X, children: L } = Y,
        J = Ol.useRef(null),
        V = Ol.useRef(new Map()).current;
      return Q.jsx(m, { scope: X, itemMap: V, collectionRef: J, children: L });
    };
  b.displayName = o;
  const h = i + 'CollectionSlot',
    S = Lf(h),
    y = Ol.forwardRef((Y, X) => {
      const { scope: L, children: J } = Y,
        V = d(h, L),
        K = Cl(X, V.collectionRef);
      return Q.jsx(S, { ref: K, children: J });
    });
  y.displayName = h;
  const O = i + 'CollectionItemSlot',
    z = 'data-radix-collection-item',
    N = Lf(O),
    G = Ol.forwardRef((Y, X) => {
      const { scope: L, children: J, ...V } = Y,
        K = Ol.useRef(null),
        ct = Cl(X, K),
        P = d(O, L);
      return (
        Ol.useEffect(() => (P.itemMap.set(K, { ref: K, ...V }), () => void P.itemMap.delete(K))),
        Q.jsx(N, { [z]: '', ref: ct, children: J })
      );
    });
  G.displayName = O;
  function k(Y) {
    const X = d(i + 'CollectionConsumer', Y);
    return Ol.useCallback(() => {
      const J = X.collectionRef.current;
      if (!J) return [];
      const V = Array.from(J.querySelectorAll(`[${z}]`));
      return Array.from(X.itemMap.values()).sort(
        (P, w) => V.indexOf(P.ref.current) - V.indexOf(w.ref.current),
      );
    }, [X.collectionRef, X.itemMap]);
  }
  return [{ Provider: b, Slot: y, ItemSlot: G }, k, f];
}
var Rm = ['PageUp', 'PageDown'],
  Um = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'],
  Nm = {
    'from-left': ['Home', 'PageDown', 'ArrowDown', 'ArrowLeft'],
    'from-right': ['Home', 'PageDown', 'ArrowDown', 'ArrowRight'],
    'from-bottom': ['Home', 'PageDown', 'ArrowDown', 'ArrowLeft'],
    'from-top': ['Home', 'PageDown', 'ArrowUp', 'ArrowLeft'],
  },
  Yn = 'Slider',
  [Xf, _y, Oy] = My(Yn),
  [jm] = Cm(Yn, [Oy]),
  [Cy, ci] = jm(Yn),
  Hm = q.forwardRef((i, o) => {
    const {
        name: s,
        min: f = 0,
        max: m = 100,
        step: d = 1,
        orientation: b = 'horizontal',
        disabled: h = !1,
        minStepsBetweenThumbs: S = 0,
        defaultValue: y = [f],
        value: O,
        onValueChange: z = () => {},
        onValueCommit: N = () => {},
        inverted: G = !1,
        form: k,
        ...Y
      } = i,
      X = q.useRef(new Set()),
      L = q.useRef(0),
      V = b === 'horizontal' ? Dy : Ry,
      [K = [], ct] = my({
        prop: O,
        defaultProp: y,
        onChange: (dt) => {
          var at;
          ((at = [...X.current][L.current]) == null || at.focus(), z(dt));
        },
      }),
      P = q.useRef(K);
    function w(dt) {
      const j = By(K, dt);
      Et(dt, j);
    }
    function nt(dt) {
      Et(dt, L.current);
    }
    function St() {
      const dt = P.current[L.current];
      K[L.current] !== dt && N(K);
    }
    function Et(dt, j, { commit: at } = { commit: !1 }) {
      const At = Gy(d),
        mt = Ly(Math.round((dt - f) / d) * d + f, At),
        M = _m(mt, [f, m]);
      ct((H = []) => {
        const W = jy(H, M, j);
        if (Yy(W, S * d)) {
          L.current = W.indexOf(M);
          const ut = String(W) !== String(H);
          return (ut && at && N(W), ut ? W : H);
        } else return H;
      });
    }
    return Q.jsx(Cy, {
      scope: i.__scopeSlider,
      name: s,
      disabled: h,
      min: f,
      max: m,
      valueIndexToChangeRef: L,
      thumbs: X.current,
      values: K,
      orientation: b,
      form: k,
      children: Q.jsx(Xf.Provider, {
        scope: i.__scopeSlider,
        children: Q.jsx(Xf.Slot, {
          scope: i.__scopeSlider,
          children: Q.jsx(V, {
            'aria-disabled': h,
            'data-disabled': h ? '' : void 0,
            ...Y,
            ref: o,
            onPointerDown: Hn(Y.onPointerDown, () => {
              h || (P.current = K);
            }),
            min: f,
            max: m,
            inverted: G,
            onSlideStart: h ? void 0 : w,
            onSlideMove: h ? void 0 : nt,
            onSlideEnd: h ? void 0 : St,
            onHomeKeyDown: () => !h && Et(f, 0, { commit: !0 }),
            onEndKeyDown: () => !h && Et(m, K.length - 1, { commit: !0 }),
            onStepKeyDown: ({ event: dt, direction: j }) => {
              if (!h) {
                const mt = Rm.includes(dt.key) || (dt.shiftKey && Um.includes(dt.key)) ? 10 : 1,
                  M = L.current,
                  H = K[M],
                  W = d * mt * j;
                Et(H + W, M, { commit: !0 });
              }
            },
          }),
        }),
      }),
    });
  });
Hm.displayName = Yn;
var [Bm, wm] = jm(Yn, { startEdge: 'left', endEdge: 'right', size: 'width', direction: 1 }),
  Dy = q.forwardRef((i, o) => {
    const {
        min: s,
        max: f,
        dir: m,
        inverted: d,
        onSlideStart: b,
        onSlideMove: h,
        onSlideEnd: S,
        onStepKeyDown: y,
        ...O
      } = i,
      [z, N] = q.useState(null),
      G = Cl(o, (V) => N(V)),
      k = q.useRef(void 0),
      Y = gy(m),
      X = Y === 'ltr',
      L = (X && !d) || (!X && d);
    function J(V) {
      const K = k.current || z.getBoundingClientRect(),
        ct = [0, K.width],
        w = Wf(ct, L ? [s, f] : [f, s]);
      return ((k.current = K), w(V - K.left));
    }
    return Q.jsx(Bm, {
      scope: i.__scopeSlider,
      startEdge: L ? 'left' : 'right',
      endEdge: L ? 'right' : 'left',
      direction: L ? 1 : -1,
      size: 'width',
      children: Q.jsx(qm, {
        dir: Y,
        'data-orientation': 'horizontal',
        ...O,
        ref: G,
        style: { ...O.style, '--radix-slider-thumb-transform': 'translateX(-50%)' },
        onSlideStart: (V) => {
          const K = J(V.clientX);
          b == null || b(K);
        },
        onSlideMove: (V) => {
          const K = J(V.clientX);
          h == null || h(K);
        },
        onSlideEnd: () => {
          ((k.current = void 0), S == null || S());
        },
        onStepKeyDown: (V) => {
          const ct = Nm[L ? 'from-left' : 'from-right'].includes(V.key);
          y == null || y({ event: V, direction: ct ? -1 : 1 });
        },
      }),
    });
  }),
  Ry = q.forwardRef((i, o) => {
    const {
        min: s,
        max: f,
        inverted: m,
        onSlideStart: d,
        onSlideMove: b,
        onSlideEnd: h,
        onStepKeyDown: S,
        ...y
      } = i,
      O = q.useRef(null),
      z = Cl(o, O),
      N = q.useRef(void 0),
      G = !m;
    function k(Y) {
      const X = N.current || O.current.getBoundingClientRect(),
        L = [0, X.height],
        V = Wf(L, G ? [f, s] : [s, f]);
      return ((N.current = X), V(Y - X.top));
    }
    return Q.jsx(Bm, {
      scope: i.__scopeSlider,
      startEdge: G ? 'bottom' : 'top',
      endEdge: G ? 'top' : 'bottom',
      size: 'height',
      direction: G ? 1 : -1,
      children: Q.jsx(qm, {
        'data-orientation': 'vertical',
        ...y,
        ref: z,
        style: { ...y.style, '--radix-slider-thumb-transform': 'translateY(50%)' },
        onSlideStart: (Y) => {
          const X = k(Y.clientY);
          d == null || d(X);
        },
        onSlideMove: (Y) => {
          const X = k(Y.clientY);
          b == null || b(X);
        },
        onSlideEnd: () => {
          ((N.current = void 0), h == null || h());
        },
        onStepKeyDown: (Y) => {
          const L = Nm[G ? 'from-bottom' : 'from-top'].includes(Y.key);
          S == null || S({ event: Y, direction: L ? -1 : 1 });
        },
      }),
    });
  }),
  qm = q.forwardRef((i, o) => {
    const {
        __scopeSlider: s,
        onSlideStart: f,
        onSlideMove: m,
        onSlideEnd: d,
        onHomeKeyDown: b,
        onEndKeyDown: h,
        onStepKeyDown: S,
        ...y
      } = i,
      O = ci(Yn, s);
    return Q.jsx(qa.span, {
      ...y,
      ref: o,
      onKeyDown: Hn(i.onKeyDown, (z) => {
        z.key === 'Home'
          ? (b(z), z.preventDefault())
          : z.key === 'End'
            ? (h(z), z.preventDefault())
            : Rm.concat(Um).includes(z.key) && (S(z), z.preventDefault());
      }),
      onPointerDown: Hn(i.onPointerDown, (z) => {
        const N = z.target;
        (N.setPointerCapture(z.pointerId), z.preventDefault(), O.thumbs.has(N) ? N.focus() : f(z));
      }),
      onPointerMove: Hn(i.onPointerMove, (z) => {
        z.target.hasPointerCapture(z.pointerId) && m(z);
      }),
      onPointerUp: Hn(i.onPointerUp, (z) => {
        const N = z.target;
        N.hasPointerCapture(z.pointerId) && (N.releasePointerCapture(z.pointerId), d(z));
      }),
    });
  }),
  Ym = 'SliderTrack',
  Gm = q.forwardRef((i, o) => {
    const { __scopeSlider: s, ...f } = i,
      m = ci(Ym, s);
    return Q.jsx(qa.span, {
      'data-disabled': m.disabled ? '' : void 0,
      'data-orientation': m.orientation,
      ...f,
      ref: o,
    });
  });
Gm.displayName = Ym;
var Qf = 'SliderRange',
  Lm = q.forwardRef((i, o) => {
    const { __scopeSlider: s, ...f } = i,
      m = ci(Qf, s),
      d = wm(Qf, s),
      b = q.useRef(null),
      h = Cl(o, b),
      S = m.values.length,
      y = m.values.map((N) => Vm(N, m.min, m.max)),
      O = S > 1 ? Math.min(...y) : 0,
      z = 100 - Math.max(...y);
    return Q.jsx(qa.span, {
      'data-orientation': m.orientation,
      'data-disabled': m.disabled ? '' : void 0,
      ...f,
      ref: h,
      style: { ...i.style, [d.startEdge]: O + '%', [d.endEdge]: z + '%' },
    });
  });
Lm.displayName = Qf;
var Vf = 'SliderThumb',
  Xm = q.forwardRef((i, o) => {
    const s = _y(i.__scopeSlider),
      [f, m] = q.useState(null),
      d = Cl(o, (h) => m(h)),
      b = q.useMemo(() => (f ? s().findIndex((h) => h.ref.current === f) : -1), [s, f]);
    return Q.jsx(Uy, { ...i, ref: d, index: b });
  }),
  Uy = q.forwardRef((i, o) => {
    const { __scopeSlider: s, index: f, name: m, ...d } = i,
      b = ci(Vf, s),
      h = wm(Vf, s),
      [S, y] = q.useState(null),
      O = Cl(o, (J) => y(J)),
      z = S ? b.form || !!S.closest('form') : !0,
      N = py(S),
      G = b.values[f],
      k = G === void 0 ? 0 : Vm(G, b.min, b.max),
      Y = Hy(f, b.values.length),
      X = N == null ? void 0 : N[h.size],
      L = X ? wy(X, k, h.direction) : 0;
    return (
      q.useEffect(() => {
        if (S)
          return (
            b.thumbs.add(S),
            () => {
              b.thumbs.delete(S);
            }
          );
      }, [S, b.thumbs]),
      Q.jsxs('span', {
        style: {
          transform: 'var(--radix-slider-thumb-transform)',
          position: 'absolute',
          [h.startEdge]: `calc(${k}% + ${L}px)`,
        },
        children: [
          Q.jsx(Xf.ItemSlot, {
            scope: i.__scopeSlider,
            children: Q.jsx(qa.span, {
              role: 'slider',
              'aria-label': i['aria-label'] || Y,
              'aria-valuemin': b.min,
              'aria-valuenow': G,
              'aria-valuemax': b.max,
              'aria-orientation': b.orientation,
              'data-orientation': b.orientation,
              'data-disabled': b.disabled ? '' : void 0,
              tabIndex: b.disabled ? void 0 : 0,
              ...d,
              ref: O,
              style: G === void 0 ? { display: 'none' } : i.style,
              onFocus: Hn(i.onFocus, () => {
                b.valueIndexToChangeRef.current = f;
              }),
            }),
          }),
          z &&
            Q.jsx(
              Qm,
              {
                name: m ?? (b.name ? b.name + (b.values.length > 1 ? '[]' : '') : void 0),
                form: b.form,
                value: G,
              },
              f,
            ),
        ],
      })
    );
  });
Xm.displayName = Vf;
var Ny = 'RadioBubbleInput',
  Qm = q.forwardRef(({ __scopeSlider: i, value: o, ...s }, f) => {
    const m = q.useRef(null),
      d = Cl(m, f),
      b = by(o);
    return (
      q.useEffect(() => {
        const h = m.current;
        if (!h) return;
        const S = window.HTMLInputElement.prototype,
          O = Object.getOwnPropertyDescriptor(S, 'value').set;
        if (b !== o && O) {
          const z = new Event('input', { bubbles: !0 });
          (O.call(h, o), h.dispatchEvent(z));
        }
      }, [b, o]),
      Q.jsx(qa.input, { style: { display: 'none' }, ...s, ref: d, defaultValue: o })
    );
  });
Qm.displayName = Ny;
function jy(i = [], o, s) {
  const f = [...i];
  return ((f[s] = o), f.sort((m, d) => m - d));
}
function Vm(i, o, s) {
  const d = (100 / (s - o)) * (i - o);
  return _m(d, [0, 100]);
}
function Hy(i, o) {
  return o > 2 ? `Value ${i + 1} of ${o}` : o === 2 ? ['Minimum', 'Maximum'][i] : void 0;
}
function By(i, o) {
  if (i.length === 1) return 0;
  const s = i.map((m) => Math.abs(m - o)),
    f = Math.min(...s);
  return s.indexOf(f);
}
function wy(i, o, s) {
  const f = i / 2,
    d = Wf([0, 50], [0, f]);
  return (f - d(o) * s) * s;
}
function qy(i) {
  return i.slice(0, -1).map((o, s) => i[s + 1] - o);
}
function Yy(i, o) {
  if (o > 0) {
    const s = qy(i);
    return Math.min(...s) >= o;
  }
  return !0;
}
function Wf(i, o) {
  return (s) => {
    if (i[0] === i[1] || o[0] === o[1]) return o[0];
    const f = (o[1] - o[0]) / (i[1] - i[0]);
    return o[0] + f * (s - i[0]);
  };
}
function Gy(i) {
  return (String(i).split('.')[1] || '').length;
}
function Ly(i, o) {
  const s = Math.pow(10, o);
  return Math.round(i * s) / s;
}
var Xy = Hm,
  Qy = Gm,
  Vy = Lm,
  Zy = Xm;
function Bf({
  value: i,
  min: o,
  max: s,
  step: f = 1,
  onValueChange: m,
  ariaLabel: d,
  className: b,
  disabled: h,
}) {
  return Q.jsxs(Xy, {
    className: Mm('relative flex h-5 w-full items-center', b),
    value: [i],
    min: o,
    max: s,
    step: f,
    onValueChange: (S) => m(S[0] ?? i),
    disabled: h,
    'aria-label': d,
    children: [
      Q.jsx(Qy, {
        className: 'relative h-1.5 grow rounded-full bg-zinc-800',
        children: Q.jsx(Vy, { className: 'absolute h-full rounded-full bg-indigo-500' }),
      }),
      Q.jsx(Zy, {
        className:
          'block h-4 w-4 rounded-full border-2 border-indigo-500 bg-white shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400',
        'aria-label': d,
      }),
    ],
  });
}
function Ky(i, o) {
  const s = new Float32Array(o),
    f = new Float32Array(o);
  if (o === 0 || i.length === 0) return { min: s, max: f };
  const m = i.length / o;
  for (let d = 0; d < o; d++) {
    const b = Math.floor(d * m),
      h = Math.min(i.length, Math.floor((d + 1) * m));
    let S = 1 / 0,
      y = -1 / 0;
    for (let O = b; O < h; O++) {
      const z = i[O];
      (z < S && (S = z), z > y && (y = z));
    }
    ((s[d] = S === 1 / 0 ? 0 : S), (f[d] = y === -1 / 0 ? 0 : y));
  }
  return { min: s, max: f };
}
const dm = 6;
function Jy({
  peaks: i,
  regions: o,
  duration: s,
  currentTime: f,
  onSeek: m,
  onBoundaryDrag: d,
  onRegionClick: b,
  height: h = 120,
}) {
  const S = q.useRef(null),
    [y, O] = q.useState('pointer'),
    z = q.useRef(null);
  q.useEffect(() => {
    const J = S.current;
    if (!J) return;
    const V = window.devicePixelRatio || 1,
      K = J.clientWidth,
      ct = J.clientHeight;
    ((J.width = Math.max(1, Math.floor(K * V))), (J.height = Math.max(1, Math.floor(ct * V))));
    const P = J.getContext('2d');
    if (P) {
      if (
        (P.setTransform(V, 0, 0, V, 0, 0),
        P.clearRect(0, 0, K, ct),
        (P.fillStyle = '#18181b'),
        P.fillRect(0, 0, K, ct),
        s > 0)
      )
        for (const w of o) {
          if (w.kept) continue;
          const nt = (w.start / s) * K,
            St = ((w.end - w.start) / s) * K;
          ((P.fillStyle = 'rgba(244, 63, 94, 0.22)'),
            P.fillRect(nt, 0, St, ct),
            (P.fillStyle = 'rgba(244, 63, 94, 0.55)'),
            P.fillRect(nt, 0, 1, ct),
            P.fillRect(nt + St - 1, 0, 1, ct));
        }
      if (i && i.length > 0) {
        const { min: w, max: nt } = Ky(i, Math.floor(K)),
          St = ct / 2;
        ((P.strokeStyle = '#a5b4fc'), (P.lineWidth = 1), P.beginPath());
        for (let Et = 0; Et < w.length; Et++) {
          const dt = St - nt[Et] * St,
            j = St - w[Et] * St;
          (P.moveTo(Et + 0.5, dt), P.lineTo(Et + 0.5, j));
        }
        P.stroke();
      }
      if (s > 0) {
        const w = (f / s) * K;
        ((P.strokeStyle = '#f59e0b'),
          (P.lineWidth = 1.5),
          P.beginPath(),
          P.moveTo(w, 0),
          P.lineTo(w, ct),
          P.stroke());
      }
    }
  }, [i, o, s, f, h]);
  const N = (J) => {
      const V = J.currentTarget.getBoundingClientRect(),
        K = (J.clientX - V.left) / V.width;
      return { time: Math.max(0, Math.min(s, K * s)), ratio: K };
    },
    G = (J) => {
      if (s <= 0) return null;
      const V = J.currentTarget.getBoundingClientRect(),
        K = J.clientX - V.left,
        ct = V.width / s;
      for (let P = 0; P < o.length; P++) {
        const w = o[P];
        if (P > 0 && Math.abs(w.start * ct - K) <= dm) return { regionId: w.id, side: 'start' };
        if (P < o.length - 1 && Math.abs(w.end * ct - K) <= dm)
          return { regionId: w.id, side: 'end' };
      }
      return null;
    },
    k = (J) => {
      const V = G(J);
      V && d && ((z.current = V), J.preventDefault());
    },
    Y = (J) => {
      if (z.current && d) {
        const { time: V } = N(J);
        d(z.current.regionId, z.current.side, V);
        return;
      }
      O(G(J) ? 'col-resize' : 'pointer');
    },
    X = () => {
      z.current = null;
    },
    L = (J) => {
      if (z.current) {
        z.current = null;
        return;
      }
      if (G(J)) return;
      const { time: V } = N(J);
      if (J.detail === 2 && b && s > 0) {
        const K = o.find((ct) => V >= ct.start && V <= ct.end);
        if (K) {
          b(K.id);
          return;
        }
      }
      m == null || m(V);
    };
  return Q.jsx('canvas', {
    ref: S,
    onMouseDown: k,
    onMouseMove: Y,
    onMouseUp: X,
    onMouseLeave: X,
    onClick: L,
    role: 'slider',
    tabIndex: 0,
    'aria-label':
      'Waveform timeline. Click to seek. Double-click to toggle a region. Drag boundaries to resize.',
    'aria-valuemin': 0,
    'aria-valuemax': s,
    'aria-valuenow': f,
    style: { width: '100%', height: h, display: 'block', cursor: y },
  });
}
const $y = { thresholdDb: -30, minSilenceDurationMs: 500, paddingMs: 100, minKeepDurationMs: 100 };
function mm(i, o, s) {
  const f = s.paddingMs / 1e3,
    m = s.minKeepDurationMs / 1e3,
    d = o
      .map((O) => ({ start: Math.max(0, O.start + f), end: Math.min(i, O.end - f) }))
      .filter((O) => O.end > O.start)
      .sort((O, z) => O.start - z.start),
    b = [];
  for (const O of d) {
    const z = b[b.length - 1];
    z && O.start <= z.end ? (z.end = Math.max(z.end, O.end)) : b.push({ ...O });
  }
  const h = [];
  let S = 0,
    y = 0;
  for (const O of b)
    (O.start > S && h.push({ id: `r${y++}`, start: S, end: O.start, kept: !0, source: 'detected' }),
      h.push({ id: `r${y++}`, start: O.start, end: O.end, kept: !1, source: 'detected' }),
      (S = O.end));
  return (
    S < i && h.push({ id: `r${y++}`, start: S, end: i, kept: !0, source: 'detected' }),
    ky(h, m)
  );
}
function ky(i, o) {
  return i.map((s) => (s.kept && s.end - s.start < o ? { ...s, kept: !1 } : s));
}
function Ya(i) {
  return i.filter((o) => o.kept);
}
function Wy(i) {
  return Ya(i).reduce((o, s) => o + (s.end - s.start), 0);
}
function hm(i, o, s, f = 20) {
  if (i.length === 0 || o <= 0) return [];
  const m = Math.pow(10, s.thresholdDb / 20),
    d = Math.max(1, Math.round((o * f) / 1e3)),
    b = Math.ceil(s.minSilenceDurationMs / f),
    h = [];
  let S = 0,
    y = null;
  for (let O = 0; O < i.length; O += d) {
    const z = Math.min(O + d, i.length);
    let N = 0;
    for (let G = O; G < z; G++) {
      const k = Math.abs(i[G]);
      k > N && (N = k);
    }
    N < m
      ? (y === null && (y = O), S++)
      : (y !== null && S >= b && h.push({ start: y / o, end: (y + S * d) / o }),
        (y = null),
        (S = 0));
  }
  return (
    y !== null && S >= b && h.push({ start: y / o, end: Math.min(i.length, y + S * d) / o }),
    h
  );
}
function Fy(i, o) {
  const s = new Float32Array(o);
  if (i.length === 0) return s;
  const f = i.length / o;
  for (let m = 0; m < o; m++) {
    const d = Math.floor(m * f),
      b = Math.min(i.length, Math.floor((m + 1) * f));
    let h = 0;
    for (let S = d; S < b; S++) {
      const y = Math.abs(i[S]);
      y > h && (h = y);
    }
    s[m] = h;
  }
  return s;
}
function Py(i, o) {
  return i.map((s) => (s.id === o ? { ...s, kept: !s.kept } : s));
}
function kl(i, o) {
  const s = Math.round(i * o),
    f = Math.round(o),
    m = s % f,
    d = Math.floor(s / f),
    b = d % 60,
    h = Math.floor(d / 60) % 60,
    S = Math.floor(d / 3600);
  return `${ai(S)}:${ai(h)}:${ai(b)}:${ai(m)}`;
}
function ai(i) {
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
function Iy(i) {
  var b;
  const o = Ya(i.regions),
    s = ((b = i.source.videoStream) == null ? void 0 : b.frameRate) ?? 30,
    f = tg(i.source.name),
    m = [];
  (m.push(`TITLE: ${i.projectName}`), m.push('FCM: NON-DROP FRAME'), m.push(''));
  let d = 0;
  return (
    o.forEach((h, S) => {
      const y = String(S + 1).padStart(3, '0'),
        O = kl(h.start, s),
        z = kl(h.end, s),
        N = kl(d, s),
        G = h.end - h.start,
        k = kl(d + G, s);
      d += G;
      const Y = i.source.hasVideo ? 'AA/V' : 'AA';
      (m.push(`${y}  ${f} ${Y}    C        ${O} ${z} ${N} ${k}`),
        m.push(`* FROM CLIP NAME: ${i.source.name}`));
    }),
    m.join(`
`) +
      `
`
  );
}
function tg(i) {
  return i
    .replace(/[^A-Za-z0-9]/g, '')
    .slice(0, 8)
    .toUpperCase()
    .padEnd(8, ' ');
}
function eg(i) {
  var O, z, N;
  const o = Ya(i.regions),
    s = ((O = i.source.videoStream) == null ? void 0 : O.frameRate) ?? 30,
    f = ((z = i.source.videoStream) == null ? void 0 : z.width) ?? 1920,
    m = ((N = i.source.videoStream) == null ? void 0 : N.height) ?? 1080,
    d = lg(s),
    b = 'r1',
    h = 'r2';
  let S = '',
    y = 0;
  return (
    o.forEach((G, k) => {
      const Y = ui(y, s),
        X = ui(G.start, s),
        L = ui(G.end - G.start, s);
      ((y += G.end - G.start),
        (S += `          <asset-clip name="${wa(i.source.name)} #${k + 1}" ref="${b}" offset="${Y}" start="${X}" duration="${L}" tcFormat="NDF"/>
`));
    }),
    `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE fcpxml>
<fcpxml version="1.10">
  <resources>
    <format id="${h}" name="FFVideoFormat${f}x${m}p${s}" frameDuration="${d}" width="${f}" height="${m}"/>
    <asset id="${b}" name="${wa(i.source.name)}" src="${wa(ng(i.source.path))}" start="0s" duration="${ui(i.source.duration, s)}" hasVideo="${i.source.hasVideo ? '1' : '0'}" hasAudio="${i.source.hasAudio ? '1' : '0'}" format="${h}"/>
  </resources>
  <library>
    <event name="${wa(i.projectName)}">
      <project name="${wa(i.projectName)}">
        <sequence format="${h}" tcStart="0s" tcFormat="NDF">
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
function lg(i) {
  return Math.abs(i - 23.976) < 0.01
    ? '1001/24000s'
    : Math.abs(i - 29.97) < 0.01
      ? '1001/30000s'
      : Math.abs(i - 59.94) < 0.01
        ? '1001/60000s'
        : `1/${Math.round(i)}s`;
}
function ui(i, o) {
  const s = Math.round(i * o),
    f = Math.round(o);
  return `${s}/${f}s`;
}
function ng(i) {
  return i.startsWith('file://')
    ? i
    : /^[A-Za-z]:[\\/]/.test(i)
      ? 'file:///' + i.replace(/\\/g, '/')
      : 'file://' + i;
}
function ag(i) {
  var b;
  const o = ((b = i.source.videoStream) == null ? void 0 : b.frameRate) ?? 30,
    f = Ya(i.regions).map((h, S) => ({
      OTIO_SCHEMA: 'Clip.2',
      name: `${i.source.name} #${S + 1}`,
      source_range: vm(h.start, h.end - h.start, o),
      media_reference: {
        OTIO_SCHEMA: 'ExternalReference.1',
        target_url: ug(i.source.path),
        available_range: vm(0, i.source.duration, o),
      },
    })),
    m = [{ OTIO_SCHEMA: 'Track.1', name: 'V1', kind: 'Video', children: f }];
  i.source.hasAudio &&
    m.push({
      OTIO_SCHEMA: 'Track.1',
      name: 'A1',
      kind: 'Audio',
      children: f.map((h) => ({ ...h })),
    });
  const d = {
    OTIO_SCHEMA: 'Timeline.1',
    name: i.projectName,
    global_start_time: Zf(0, o),
    tracks: { OTIO_SCHEMA: 'Stack.1', name: 'tracks', children: m },
  };
  return JSON.stringify(d, null, 2);
}
function Zf(i, o) {
  return { OTIO_SCHEMA: 'RationalTime.1', rate: o, value: i * o };
}
function vm(i, o, s) {
  return { OTIO_SCHEMA: 'TimeRange.1', start_time: Zf(i, s), duration: Zf(o, s) };
}
function ug(i) {
  return i.startsWith('file://')
    ? i
    : /^[A-Za-z]:[\\/]/.test(i)
      ? 'file:///' + i.replace(/\\/g, '/')
      : 'file://' + i;
}
function ig(i) {
  var m;
  const o = ((m = i.source.videoStream) == null ? void 0 : m.frameRate) ?? 30,
    f = [['#', 'Marker Name', 'Description', 'In', 'Out', 'Duration', 'Marker Type']];
  return (
    i.regions
      .filter((d) => !d.kept)
      .forEach((d, b) => {
        f.push([
          String(b + 1),
          `Silence ${b + 1}`,
          '',
          kl(d.start, o),
          kl(d.end, o),
          kl(d.end - d.start, o),
          'Red',
        ]);
      }),
    f.map((d) => d.join('	')).join(`
`) +
      `
`
  );
}
function cg(i, o) {
  const s = Ya(i.regions),
    f = i.source.hasVideo,
    m = i.source.hasAudio;
  if (s.length === 0) throw new Error('export: no kept regions');
  if (!f && !m) throw new Error('export: source has neither audio nor video');
  const d = [],
    b = [];
  s.forEach((z, N) => {
    const G = z.start.toFixed(6),
      k = z.end.toFixed(6);
    (f && d.push(`[0:v]trim=start=${G}:end=${k},setpts=PTS-STARTPTS[v${N}]`),
      m && d.push(`[0:a]atrim=start=${G}:end=${k},asetpts=PTS-STARTPTS[a${N}]`),
      f && b.push(`[v${N}]`),
      m && b.push(`[a${N}]`));
  });
  const h = f ? 1 : 0,
    S = m ? 1 : 0;
  d.push(`${b.join('')}concat=n=${s.length}:v=${h}:a=${S}${f ? '[v]' : ''}${m ? '[a]' : ''}`);
  const y = ['-y', '-nostdin', '-hide_banner', '-i', i.source.path, '-filter_complex', d.join(';')];
  (f && y.push('-map', '[v]', '-c:v', o.videoCodec ?? 'libx264'),
    m && y.push('-map', '[a]', '-c:a', o.audioCodec ?? 'aac'),
    o.extraArgs && y.push(...o.extraArgs),
    y.push(o.outputPath));
  const O = s.reduce((z, N) => z + (N.end - N.start), 0);
  return { args: y, outputDurationS: O, segmentCount: s.length };
}
const fg = 'modulepreload',
  og = function (i) {
    return '/' + i;
  },
  ym = {},
  Zm = function (o, s, f) {
    let m = Promise.resolve();
    if (s && s.length > 0) {
      let b = function (y) {
        return Promise.all(
          y.map((O) =>
            Promise.resolve(O).then(
              (z) => ({ status: 'fulfilled', value: z }),
              (z) => ({ status: 'rejected', reason: z }),
            ),
          ),
        );
      };
      document.getElementsByTagName('link');
      const h = document.querySelector('meta[property=csp-nonce]'),
        S = (h == null ? void 0 : h.nonce) || (h == null ? void 0 : h.getAttribute('nonce'));
      m = b(
        s.map((y) => {
          if (((y = og(y)), y in ym)) return;
          ym[y] = !0;
          const O = y.endsWith('.css'),
            z = O ? '[rel="stylesheet"]' : '';
          if (document.querySelector(`link[href="${y}"]${z}`)) return;
          const N = document.createElement('link');
          if (
            ((N.rel = O ? 'stylesheet' : fg),
            O || (N.as = 'script'),
            (N.crossOrigin = ''),
            (N.href = y),
            S && N.setAttribute('nonce', S),
            document.head.appendChild(N),
            O)
          )
            return new Promise((G, k) => {
              (N.addEventListener('load', G),
                N.addEventListener('error', () => k(new Error(`Unable to preload CSS for ${y}`))));
            });
        }),
      );
    }
    function d(b) {
      const h = new Event('vite:preloadError', { cancelable: !0 });
      if (((h.payload = b), window.dispatchEvent(h), !h.defaultPrevented)) throw b;
    }
    return m.then((b) => {
      for (const h of b || []) h.status === 'rejected' && d(h.reason);
      return o().catch(d);
    });
  };
/*! Capacitor: https://capacitorjs.com/ - MIT License */ const rg = (i) => {
    const o = new Map();
    o.set('web', { name: 'web' });
    const s = i.CapacitorPlatforms || { currentPlatform: { name: 'web' }, platforms: o },
      f = (d, b) => {
        s.platforms.set(d, b);
      },
      m = (d) => {
        s.platforms.has(d) && (s.currentPlatform = s.platforms.get(d));
      };
    return ((s.addPlatform = f), (s.setPlatform = m), s);
  },
  sg = (i) => (i.CapacitorPlatforms = rg(i)),
  Km = sg(
    typeof globalThis < 'u'
      ? globalThis
      : typeof self < 'u'
        ? self
        : typeof window < 'u'
          ? window
          : typeof global < 'u'
            ? global
            : {},
  );
Km.addPlatform;
Km.setPlatform;
var wn;
(function (i) {
  ((i.Unimplemented = 'UNIMPLEMENTED'), (i.Unavailable = 'UNAVAILABLE'));
})(wn || (wn = {}));
class wf extends Error {
  constructor(o, s, f) {
    (super(o), (this.message = o), (this.code = s), (this.data = f));
  }
}
const dg = (i) => {
    var o, s;
    return i != null && i.androidBridge
      ? 'android'
      : !(
            (s =
              (o = i == null ? void 0 : i.webkit) === null || o === void 0
                ? void 0
                : o.messageHandlers) === null || s === void 0
          ) && s.bridge
        ? 'ios'
        : 'web';
  },
  mg = (i) => {
    var o, s, f, m, d;
    const b = i.CapacitorCustomPlatform || null,
      h = i.Capacitor || {},
      S = (h.Plugins = h.Plugins || {}),
      y = i.CapacitorPlatforms,
      O = () => (b !== null ? b.name : dg(i)),
      z =
        ((o = y == null ? void 0 : y.currentPlatform) === null || o === void 0
          ? void 0
          : o.getPlatform) || O,
      N = () => z() !== 'web',
      G =
        ((s = y == null ? void 0 : y.currentPlatform) === null || s === void 0
          ? void 0
          : s.isNativePlatform) || N,
      k = (w) => {
        const nt = K.get(w);
        return !!((nt != null && nt.platforms.has(z())) || L(w));
      },
      Y =
        ((f = y == null ? void 0 : y.currentPlatform) === null || f === void 0
          ? void 0
          : f.isPluginAvailable) || k,
      X = (w) => {
        var nt;
        return (nt = h.PluginHeaders) === null || nt === void 0
          ? void 0
          : nt.find((St) => St.name === w);
      },
      L =
        ((m = y == null ? void 0 : y.currentPlatform) === null || m === void 0
          ? void 0
          : m.getPluginHeader) || X,
      J = (w) => i.console.error(w),
      V = (w, nt, St) => Promise.reject(`${St} does not have an implementation of "${nt}".`),
      K = new Map(),
      ct = (w, nt = {}) => {
        const St = K.get(w);
        if (St)
          return (
            console.warn(
              `Capacitor plugin "${w}" already registered. Cannot register plugins twice.`,
            ),
            St.proxy
          );
        const Et = z(),
          dt = L(w);
        let j;
        const at = async () => (
            !j && Et in nt
              ? (j = typeof nt[Et] == 'function' ? (j = await nt[Et]()) : (j = nt[Et]))
              : b !== null &&
                !j &&
                'web' in nt &&
                (j = typeof nt.web == 'function' ? (j = await nt.web()) : (j = nt.web)),
            j
          ),
          At = (lt, g) => {
            var D, B;
            if (dt) {
              const Z = dt == null ? void 0 : dt.methods.find((tt) => g === tt.name);
              if (Z)
                return Z.rtype === 'promise'
                  ? (tt) => h.nativePromise(w, g.toString(), tt)
                  : (tt, ft) => h.nativeCallback(w, g.toString(), tt, ft);
              if (lt) return (D = lt[g]) === null || D === void 0 ? void 0 : D.bind(lt);
            } else {
              if (lt) return (B = lt[g]) === null || B === void 0 ? void 0 : B.bind(lt);
              throw new wf(`"${w}" plugin is not implemented on ${Et}`, wn.Unimplemented);
            }
          },
          mt = (lt) => {
            let g;
            const D = (...B) => {
              const Z = at().then((tt) => {
                const ft = At(tt, lt);
                if (ft) {
                  const bt = ft(...B);
                  return ((g = bt == null ? void 0 : bt.remove), bt);
                } else throw new wf(`"${w}.${lt}()" is not implemented on ${Et}`, wn.Unimplemented);
              });
              return (lt === 'addListener' && (Z.remove = async () => g()), Z);
            };
            return (
              (D.toString = () => `${lt.toString()}() { [capacitor code] }`),
              Object.defineProperty(D, 'name', { value: lt, writable: !1, configurable: !1 }),
              D
            );
          },
          M = mt('addListener'),
          H = mt('removeListener'),
          W = (lt, g) => {
            const D = M({ eventName: lt }, g),
              B = async () => {
                const tt = await D;
                H({ eventName: lt, callbackId: tt }, g);
              },
              Z = new Promise((tt) => D.then(() => tt({ remove: B })));
            return (
              (Z.remove = async () => {
                (console.warn("Using addListener() without 'await' is deprecated."), await B());
              }),
              Z
            );
          },
          ut = new Proxy(
            {},
            {
              get(lt, g) {
                switch (g) {
                  case '$$typeof':
                    return;
                  case 'toJSON':
                    return () => ({});
                  case 'addListener':
                    return dt ? W : M;
                  case 'removeListener':
                    return H;
                  default:
                    return mt(g);
                }
              },
            },
          );
        return (
          (S[w] = ut),
          K.set(w, {
            name: w,
            proxy: ut,
            platforms: new Set([...Object.keys(nt), ...(dt ? [Et] : [])]),
          }),
          ut
        );
      },
      P =
        ((d = y == null ? void 0 : y.currentPlatform) === null || d === void 0
          ? void 0
          : d.registerPlugin) || ct;
    return (
      h.convertFileSrc || (h.convertFileSrc = (w) => w),
      (h.getPlatform = z),
      (h.handleError = J),
      (h.isNativePlatform = G),
      (h.isPluginAvailable = Y),
      (h.pluginMethodNoop = V),
      (h.registerPlugin = P),
      (h.Exception = wf),
      (h.DEBUG = !!h.DEBUG),
      (h.isLoggingEnabled = !!h.isLoggingEnabled),
      (h.platform = h.getPlatform()),
      (h.isNative = h.isNativePlatform()),
      h
    );
  },
  hg = (i) => (i.Capacitor = mg(i)),
  ii = hg(
    typeof globalThis < 'u'
      ? globalThis
      : typeof self < 'u'
        ? self
        : typeof window < 'u'
          ? window
          : typeof global < 'u'
            ? global
            : {},
  ),
  fi = ii.registerPlugin;
ii.Plugins;
class Jm {
  constructor(o) {
    ((this.listeners = {}),
      (this.retainedEventArguments = {}),
      (this.windowListeners = {}),
      o &&
        (console.warn(
          `Capacitor WebPlugin "${o.name}" config object was deprecated in v3 and will be removed in v4.`,
        ),
        (this.config = o)));
  }
  addListener(o, s) {
    let f = !1;
    (this.listeners[o] || ((this.listeners[o] = []), (f = !0)), this.listeners[o].push(s));
    const d = this.windowListeners[o];
    (d && !d.registered && this.addWindowListener(d), f && this.sendRetainedArgumentsForEvent(o));
    const b = async () => this.removeListener(o, s);
    return Promise.resolve({ remove: b });
  }
  async removeAllListeners() {
    this.listeners = {};
    for (const o in this.windowListeners) this.removeWindowListener(this.windowListeners[o]);
    this.windowListeners = {};
  }
  notifyListeners(o, s, f) {
    const m = this.listeners[o];
    if (!m) {
      if (f) {
        let d = this.retainedEventArguments[o];
        (d || (d = []), d.push(s), (this.retainedEventArguments[o] = d));
      }
      return;
    }
    m.forEach((d) => d(s));
  }
  hasListeners(o) {
    return !!this.listeners[o].length;
  }
  registerWindowListener(o, s) {
    this.windowListeners[s] = {
      registered: !1,
      windowEventName: o,
      pluginEventName: s,
      handler: (f) => {
        this.notifyListeners(s, f);
      },
    };
  }
  unimplemented(o = 'not implemented') {
    return new ii.Exception(o, wn.Unimplemented);
  }
  unavailable(o = 'not available') {
    return new ii.Exception(o, wn.Unavailable);
  }
  async removeListener(o, s) {
    const f = this.listeners[o];
    if (!f) return;
    const m = f.indexOf(s);
    (this.listeners[o].splice(m, 1),
      this.listeners[o].length || this.removeWindowListener(this.windowListeners[o]));
  }
  addWindowListener(o) {
    (window.addEventListener(o.windowEventName, o.handler), (o.registered = !0));
  }
  removeWindowListener(o) {
    o && (window.removeEventListener(o.windowEventName, o.handler), (o.registered = !1));
  }
  sendRetainedArgumentsForEvent(o) {
    const s = this.retainedEventArguments[o];
    s &&
      (delete this.retainedEventArguments[o],
      s.forEach((f) => {
        this.notifyListeners(o, f);
      }));
  }
}
const gm = (i) =>
    encodeURIComponent(i)
      .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
      .replace(/[()]/g, escape),
  bm = (i) => i.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
class vg extends Jm {
  async getCookies() {
    const o = document.cookie,
      s = {};
    return (
      o.split(';').forEach((f) => {
        if (f.length <= 0) return;
        let [m, d] = f.replace(/=/, 'CAP_COOKIE').split('CAP_COOKIE');
        ((m = bm(m).trim()), (d = bm(d).trim()), (s[m] = d));
      }),
      s
    );
  }
  async setCookie(o) {
    try {
      const s = gm(o.key),
        f = gm(o.value),
        m = `; expires=${(o.expires || '').replace('expires=', '')}`,
        d = (o.path || '/').replace('path=', ''),
        b = o.url != null && o.url.length > 0 ? `domain=${o.url}` : '';
      document.cookie = `${s}=${f || ''}${m}; path=${d}; ${b};`;
    } catch (s) {
      return Promise.reject(s);
    }
  }
  async deleteCookie(o) {
    try {
      document.cookie = `${o.key}=; Max-Age=0`;
    } catch (s) {
      return Promise.reject(s);
    }
  }
  async clearCookies() {
    try {
      const o = document.cookie.split(';') || [];
      for (const s of o)
        document.cookie = s
          .replace(/^ +/, '')
          .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
    } catch (o) {
      return Promise.reject(o);
    }
  }
  async clearAllCookies() {
    try {
      await this.clearCookies();
    } catch (o) {
      return Promise.reject(o);
    }
  }
}
fi('CapacitorCookies', { web: () => new vg() });
const yg = async (i) =>
    new Promise((o, s) => {
      const f = new FileReader();
      ((f.onload = () => {
        const m = f.result;
        o(m.indexOf(',') >= 0 ? m.split(',')[1] : m);
      }),
        (f.onerror = (m) => s(m)),
        f.readAsDataURL(i));
    }),
  gg = (i = {}) => {
    const o = Object.keys(i);
    return Object.keys(i)
      .map((m) => m.toLocaleLowerCase())
      .reduce((m, d, b) => ((m[d] = i[o[b]]), m), {});
  },
  bg = (i, o = !0) =>
    i
      ? Object.entries(i)
          .reduce((f, m) => {
            const [d, b] = m;
            let h, S;
            return (
              Array.isArray(b)
                ? ((S = ''),
                  b.forEach((y) => {
                    ((h = o ? encodeURIComponent(y) : y), (S += `${d}=${h}&`));
                  }),
                  S.slice(0, -1))
                : ((h = o ? encodeURIComponent(b) : b), (S = `${d}=${h}`)),
              `${f}&${S}`
            );
          }, '')
          .substr(1)
      : null,
  pg = (i, o = {}) => {
    const s = Object.assign({ method: i.method || 'GET', headers: i.headers }, o),
      m = gg(i.headers)['content-type'] || '';
    if (typeof i.data == 'string') s.body = i.data;
    else if (m.includes('application/x-www-form-urlencoded')) {
      const d = new URLSearchParams();
      for (const [b, h] of Object.entries(i.data || {})) d.set(b, h);
      s.body = d.toString();
    } else if (m.includes('multipart/form-data') || i.data instanceof FormData) {
      const d = new FormData();
      if (i.data instanceof FormData)
        i.data.forEach((h, S) => {
          d.append(S, h);
        });
      else for (const h of Object.keys(i.data)) d.append(h, i.data[h]);
      s.body = d;
      const b = new Headers(s.headers);
      (b.delete('content-type'), (s.headers = b));
    } else
      (m.includes('application/json') || typeof i.data == 'object') &&
        (s.body = JSON.stringify(i.data));
    return s;
  };
class Sg extends Jm {
  async request(o) {
    const s = pg(o, o.webFetchExtra),
      f = bg(o.params, o.shouldEncodeUrlParams),
      m = f ? `${o.url}?${f}` : o.url,
      d = await fetch(m, s),
      b = d.headers.get('content-type') || '';
    let { responseType: h = 'text' } = d.ok ? o : {};
    b.includes('application/json') && (h = 'json');
    let S, y;
    switch (h) {
      case 'arraybuffer':
      case 'blob':
        ((y = await d.blob()), (S = await yg(y)));
        break;
      case 'json':
        S = await d.json();
        break;
      case 'document':
      case 'text':
      default:
        S = await d.text();
    }
    const O = {};
    return (
      d.headers.forEach((z, N) => {
        O[N] = z;
      }),
      { data: S, headers: O, status: d.status, url: d.url }
    );
  }
  async get(o) {
    return this.request(Object.assign(Object.assign({}, o), { method: 'GET' }));
  }
  async post(o) {
    return this.request(Object.assign(Object.assign({}, o), { method: 'POST' }));
  }
  async put(o) {
    return this.request(Object.assign(Object.assign({}, o), { method: 'PUT' }));
  }
  async patch(o) {
    return this.request(Object.assign(Object.assign({}, o), { method: 'PATCH' }));
  }
  async delete(o) {
    return this.request(Object.assign(Object.assign({}, o), { method: 'DELETE' }));
  }
}
fi('CapacitorHttp', { web: () => new Sg() });
const Eg = fi('Share', {
  web: () => Zm(() => import('./web-BHjcuGVA.js'), []).then((i) => new i.ShareWeb()),
});
var Kf;
(function (i) {
  ((i.Documents = 'DOCUMENTS'),
    (i.Data = 'DATA'),
    (i.Library = 'LIBRARY'),
    (i.Cache = 'CACHE'),
    (i.External = 'EXTERNAL'),
    (i.ExternalStorage = 'EXTERNAL_STORAGE'));
})(Kf || (Kf = {}));
var Jf;
(function (i) {
  ((i.UTF8 = 'utf8'), (i.ASCII = 'ascii'), (i.UTF16 = 'utf16'));
})(Jf || (Jf = {}));
const zg = fi('Filesystem', {
    web: () => Zm(() => import('./web-BxuYfyPl.js'), []).then((i) => new i.FilesystemWeb()),
  }),
  qf = {
    fcpxml: { label: 'FCPXML', ext: 'fcpxml', build: eg },
    otio: { label: 'OTIO', ext: 'otio', build: ag },
    edl: { label: 'EDL', ext: 'edl', build: Iy },
    resolve: { label: 'Resolve markers', ext: 'txt', build: ig },
  };
function Tg() {
  const [i, o] = q.useState(null),
    [s, f] = q.useState([]),
    [m, d] = q.useState(null),
    [b, h] = q.useState($y),
    [S, y] = q.useState(0),
    [O, z] = q.useState(null),
    [N, G] = q.useState(!1),
    [k, Y] = q.useState(null),
    [X, L] = q.useState(null),
    J = q.useRef(null),
    V = q.useRef(48e3),
    K = q.useCallback(
      async (j) => {
        (L(null), Y(`Loading ${j.name}…`), G(!0));
        try {
          const at = await j.arrayBuffer(),
            At = new (window.AudioContext || window.webkitAudioContext)(),
            mt = await At.decodeAudioData(at.slice(0)),
            M = new Float32Array(mt.length);
          for (let g = 0; g < mt.numberOfChannels; g++) {
            const D = mt.getChannelData(g);
            for (let B = 0; B < D.length; B++) M[B] += D[B] / mt.numberOfChannels;
          }
          ((J.current = M), (V.current = mt.sampleRate), At.close());
          const H = {
              id: `m-${Date.now()}`,
              path: j.name,
              name: j.name,
              duration: mt.duration,
              hasVideo: j.type.startsWith('video/'),
              hasAudio: !0,
              audioStream: {
                sampleRate: mt.sampleRate,
                channels: mt.numberOfChannels,
                codec: 'web-audio',
              },
            },
            W = hm(M, mt.sampleRate, b),
            ut = mm(mt.duration, W, b),
            lt = Fy(M, 1024);
          (o(H),
            f(ut),
            d(lt),
            y(0),
            O && URL.revokeObjectURL(O),
            z(URL.createObjectURL(j)),
            Y(`${ut.filter((g) => !g.kept).length} silences found`));
        } catch (at) {
          L(at instanceof Error ? at.message : String(at));
        } finally {
          G(!1);
        }
      },
      [b, O],
    ),
    ct = q.useCallback(() => {
      const j = J.current,
        at = V.current;
      if (!j || !i) return;
      const At = hm(j, at, b);
      f(mm(i.duration, At, b));
    }, [b, i]),
    P = async (j) => {
      if (i) {
        L(null);
        try {
          const at = qf[j],
            At = at.build({ source: i, regions: s, projectName: i.name }),
            mt = `${i.name.replace(/\.[^./]+$/, '')}.${at.ext}`,
            M = await zg.writeFile({ path: mt, data: At, directory: Kf.Cache, encoding: Jf.UTF8 });
          try {
            (await Eg.share({
              title: `Quietcut — ${at.label}`,
              text: `${at.label} export from Quietcut`,
              url: M.uri,
              dialogTitle: `Share ${mt}`,
            }),
              Y(`Shared ${mt}`));
          } catch {
            Y(`Saved to ${M.uri}`);
          }
        } catch (at) {
          L(at instanceof Error ? at.message : String(at));
        }
      }
    },
    w = () => {
      var j;
      if (i)
        try {
          const at = cg(
              { source: i, regions: s, projectName: i.name },
              { outputPath: 'output.mp4' },
            ),
            At = ['ffmpeg', ...at.args].join(' ');
          ((j = navigator.clipboard) == null || j.writeText(At).catch(() => {}),
            Y(`FFmpeg command copied (${at.segmentCount} segments)`));
        } catch (at) {
          L(at instanceof Error ? at.message : String(at));
        }
    },
    nt = (j) => {
      var At;
      const at = (At = j.target.files) == null ? void 0 : At[0];
      (at && K(at), (j.target.value = ''));
    },
    St = (j) => y(j),
    Et = (j) => f((at) => Py(at, j)),
    dt = Wy(s);
  return Q.jsxs('div', {
    className: 'flex h-full flex-col bg-zinc-950 text-zinc-100',
    children: [
      Q.jsxs('header', {
        className: 'border-b border-zinc-800 px-4 py-3 flex items-center justify-between',
        children: [
          Q.jsx('h1', { className: 'text-base font-semibold', children: 'Quietcut' }),
          Q.jsxs('label', {
            className: 'cursor-pointer text-xs text-indigo-300 hover:text-indigo-200',
            children: [
              'Open file',
              Q.jsx('input', {
                type: 'file',
                accept: 'video/*,audio/*',
                className: 'hidden',
                onChange: nt,
              }),
            ],
          }),
        ],
      }),
      Q.jsxs('main', {
        className: 'flex flex-1 flex-col gap-3 overflow-auto p-4',
        children: [
          k && Q.jsx('p', { className: 'text-xs text-emerald-400', children: k }),
          X &&
            Q.jsx('p', {
              role: 'alert',
              className: 'rounded-md bg-rose-950 px-3 py-2 text-xs text-rose-200',
              children: X,
            }),
          !i &&
            Q.jsxs('div', {
              className: 'm-auto flex flex-col items-center gap-3 text-center',
              children: [
                Q.jsx('h2', {
                  className: 'text-lg font-medium',
                  children: 'Pick a video or audio file',
                }),
                Q.jsx('p', {
                  className: 'max-w-xs text-sm text-zinc-400',
                  children:
                    'On-device silence detection — no network, no upload. Exports an FCPXML / OTIO / EDL / Resolve marker file via the OS share sheet.',
                }),
                Q.jsxs('label', {
                  className: 'cursor-pointer',
                  children: [
                    Q.jsx('span', {
                      className:
                        'inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white',
                      children: N ? 'Loading…' : 'Choose file',
                    }),
                    Q.jsx('input', {
                      type: 'file',
                      accept: 'video/*,audio/*',
                      className: 'hidden',
                      onChange: nt,
                    }),
                  ],
                }),
              ],
            }),
          i &&
            Q.jsxs(Q.Fragment, {
              children: [
                Q.jsxs('div', {
                  children: [
                    Q.jsx('p', { className: 'text-sm', children: i.name }),
                    Q.jsxs('p', {
                      className: 'text-xs text-zinc-500',
                      children: [
                        i.duration.toFixed(1),
                        's · ',
                        s.filter((j) => !j.kept).length,
                        ' silences · output ',
                        dt.toFixed(1),
                        's',
                      ],
                    }),
                  ],
                }),
                O &&
                  i.hasVideo &&
                  Q.jsx('video', {
                    src: O,
                    controls: !0,
                    className: 'aspect-video w-full rounded bg-black',
                    preload: 'metadata',
                    onTimeUpdate: (j) => y(j.target.currentTime),
                  }),
                O &&
                  !i.hasVideo &&
                  Q.jsx('audio', {
                    src: O,
                    controls: !0,
                    className: 'w-full',
                    preload: 'metadata',
                    onTimeUpdate: (j) => y(j.target.currentTime),
                  }),
                Q.jsx('div', {
                  className: 'rounded-lg border border-zinc-800 bg-zinc-900 p-2',
                  children: Q.jsx(Jy, {
                    peaks: m,
                    regions: s,
                    duration: i.duration,
                    currentTime: S,
                    onSeek: St,
                    onRegionClick: Et,
                    height: 100,
                  }),
                }),
                Q.jsxs('details', {
                  className: 'rounded-lg border border-zinc-800 bg-zinc-900 p-3',
                  open: !0,
                  children: [
                    Q.jsx('summary', {
                      className: 'cursor-pointer text-sm font-medium',
                      children: 'Detection',
                    }),
                    Q.jsxs('div', {
                      className: 'space-y-4 pt-3',
                      children: [
                        Q.jsx(Yf, {
                          label: `Threshold ${b.thresholdDb} dB`,
                          children: Q.jsx(Bf, {
                            ariaLabel: 'Threshold',
                            value: b.thresholdDb,
                            onValueChange: (j) => h({ ...b, thresholdDb: j }),
                            min: -60,
                            max: -10,
                            step: 1,
                          }),
                        }),
                        Q.jsx(Yf, {
                          label: `Min silence ${b.minSilenceDurationMs} ms`,
                          children: Q.jsx(Bf, {
                            ariaLabel: 'Min silence',
                            value: b.minSilenceDurationMs,
                            onValueChange: (j) => h({ ...b, minSilenceDurationMs: j }),
                            min: 100,
                            max: 3e3,
                            step: 50,
                          }),
                        }),
                        Q.jsx(Yf, {
                          label: `Padding ${b.paddingMs} ms`,
                          children: Q.jsx(Bf, {
                            ariaLabel: 'Padding',
                            value: b.paddingMs,
                            onValueChange: (j) => h({ ...b, paddingMs: j }),
                            min: 0,
                            max: 500,
                            step: 10,
                          }),
                        }),
                        Q.jsx(Hf, {
                          size: 'sm',
                          onClick: ct,
                          className: 'w-full',
                          children: 'Re-analyze',
                        }),
                      ],
                    }),
                  ],
                }),
                Q.jsxs('div', {
                  className: 'rounded-lg border border-zinc-800 bg-zinc-900 p-3 space-y-2',
                  children: [
                    Q.jsx('p', {
                      className: 'text-xs uppercase tracking-wider text-zinc-500',
                      children: 'Share to editor',
                    }),
                    Q.jsx('div', {
                      className: 'grid grid-cols-2 gap-2',
                      children: Object.keys(qf).map((j) =>
                        Q.jsx(
                          Hf,
                          {
                            size: 'sm',
                            variant: 'secondary',
                            onClick: () => P(j),
                            children: qf[j].label,
                          },
                          j,
                        ),
                      ),
                    }),
                    Q.jsx(Hf, {
                      size: 'sm',
                      variant: 'ghost',
                      onClick: w,
                      className: 'w-full',
                      children: 'Copy FFmpeg command',
                    }),
                  ],
                }),
              ],
            }),
        ],
      }),
    ],
  });
}
function Yf({ label: i, children: o }) {
  return Q.jsxs('label', {
    className: 'block',
    children: [Q.jsx('span', { className: 'mb-1.5 block text-xs text-zinc-400', children: i }), o],
  });
}
const $m = document.getElementById('root');
if (!$m) throw new Error('Root element not found');
Cv.createRoot($m).render(Q.jsx(q.StrictMode, { children: Q.jsx(Tg, {}) }));
export { Jf as E, Jm as W, pg as b };
