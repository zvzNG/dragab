/* eslint-disable */

// polyfill for Safari
window.requestIdleCallback =
  window.requestIdleCallback ||
  function (handler) {
    const startTime = Date.now();

    return setTimeout(function () {
      handler({
        didTimeout: false,
        timeRemaining: function () {
          return Math.max(0, 50.0 - (Date.now() - startTime));
        },
      });
    }, 1);
  };
  
if (isOld) {
  const smoothscroll = require('smoothscroll-polyfill');
  smoothscroll.polyfill();

  // used in Page.js
  if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (search, this_len) {
      if (this_len === undefined || this_len > this.length) {
        this_len = this.length;
      }
      return this.substring(this_len - search.length, this_len) === search;
    };
  }
}

if (isOld) {
  require('core-js/modules/es.array.iterator');
  require('./svgUse')

  var requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }

  // Create Element.remove() function if not exist
  if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function () {
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
    };
  }

  if (typeof Object.assign !== 'function') {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, 'assign', {
      value: function assign(target, varArgs) {
        // .length of function is 2
        'use strict';
        if (target === null || target === undefined) {
          throw new TypeError('Cannot convert undefined or null to object');
        }

        var to = Object(target);

        for (var index = 1; index < arguments.length; index++) {
          var nextSource = arguments[index];

          if (nextSource !== null && nextSource !== undefined) {
            for (var nextKey in nextSource) {
              // Avoid bugs when hasOwnProperty is shadowed
              if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                to[nextKey] = nextSource[nextKey];
              }
            }
          }
        }
        return to;
      },
      writable: true,
      configurable: true,
    });
  }

  if (!Element.prototype.closest) {
    Element.prototype.closest = function closest(selector) {
      var node = this;

      while (node) {
        if (node.matches(selector)) return node;
        else
          node =
            'SVGElement' in window && node instanceof SVGElement
              ? node.parentNode
              : node.parentElement;
      }

      return null;
    };
  }

  // contains
  if (!Element.prototype.contains) {
    document.contains = Element.prototype.contains = function (node) {
      do {
        if (this === node) {
          return true;
        }
      } while ((node = node && node.parentNode));

      return false;
    };
  }

  if (!('classList' in SVGElement.prototype)) {
    Object.defineProperty(SVGElement.prototype, 'classList', {
      get: function get() {
        var _this = this;

        return {
          contains: function contains(className) {
            return _this.className.baseVal.split(' ').indexOf(className) !== -1;
          },
          add: function add(className) {
            return _this.setAttribute(
              'class',
              _this.getAttribute('class') + ' ' + className
            );
          },
          remove: function remove(className) {
            var removedClass = _this
              .getAttribute('class')
              .replace(
                new RegExp('(\\s|^)'.concat(className, '(\\s|$)'), 'g'),
                '$2'
              );

            if (_this.classList.contains(className)) {
              _this.setAttribute('class', removedClass);
            }
          },
          toggle: function toggle(className) {
            if (this.contains(className)) {
              this.remove(className);
            } else {
              this.add(className);
            }
          },
        };
      },
    });
  }

  Element.prototype.matches =
    Element.prototype.webkitMatchesSelector ||
    Element.prototype.oMatchesSelector ||
    Element.prototype.msMatchesSelector ||
    Element.prototype.mozMatchesSelector ||
    function matches(selector) {
      var element = this;
      var elements = (
        element.document || element.ownerDocument
      ).querySelectorAll(selector);
      var index = 0;

      while (elements[index] && elements[index] !== element) {
        ++index;
      }

      return !!elements[index];
    };

  (function () {
    if (typeof window.CustomEvent === 'function') return false;

    function CustomEvent(event, params) {
      params = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined,
      };
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(
        event,
        params.bubbles,
        params.cancelable,
        params.detail
      );
      return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
  })();
}
