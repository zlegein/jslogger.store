;(function(win){
	var store = {},
		doc = win.document,
		localStorageName = 'localStorage',
		storage

	store.disabled = false
	store.set = function(key, value) {}
	store.get = function(key) {}
	store.remove = function(key) {}
	store.clear = function() {}
	store.transact = function(key, defaultVal, transactionFn) {
		var val = store.get(key)
		if (transactionFn == null) {
			transactionFn = defaultVal
			defaultVal = null
		}
		if (typeof val == 'undefined') { val = defaultVal || {} }
		transactionFn(val)
		store.set(key, val)
	}
	store.getAll = function() {}
	store.forEach = function() {}

	store.serialize = function(value) {
		return JSON.stringify(value)
	}
	store.deserialize = function(value) {
		if (typeof value != 'string') { return undefined }
		try { return JSON.parse(value) }
		catch(e) { return value || undefined }
	}

	// Functions to encapsulate questionable FireFox 3.6.13 behavior
	// when about.config::dom.storage.enabled === false
	// See https://github.com/marcuswestin/store.js/issues#issue/13
	function isLocalStorageNameSupported() {
		try { return (localStorageName in win && win[localStorageName]) }
		catch(err) { return false }
	}

	if (isLocalStorageNameSupported()) {
		storage = win[localStorageName]
		store.set = function(key, val) {
			if (val === undefined) { return store.remove(key) }
			storage.setItem(key, store.serialize(val))
			return val
		}
		store.get = function(key) { return store.deserialize(storage.getItem(key)) }
		store.remove = function(key) { storage.removeItem(key) }
		store.clear = function() { storage.clear() }
		store.getAll = function() {
			var ret = {}
			store.forEach(function(key, val) {
				ret[key] = val
			})
			return ret
		}
		store.forEach = function(callback) {
			for (var i=0; i<storage.length; i++) {
				var key = storage.key(i)
				callback(key, store.get(key))
			}
		}
	} else if (doc.documentElement.addBehavior) {
		var storageOwner,
			storageContainer
		// Since #userData storage applies only to specific paths, we need to
		// somehow link our data to a specific path.  We choose /favicon.ico
		// as a pretty safe option, since all browsers already make a request to
		// this URL anyway and being a 404 will not hurt us here.  We wrap an
		// iframe pointing to the favicon in an ActiveXObject(htmlfile) object
		// (see: http://msdn.microsoft.com/en-us/library/aa752574(v=VS.85).aspx)
		// since the iframe access rules appear to allow direct access and
		// manipulation of the document element, even for a 404 page.  This
		// document can be used instead of the current document (which would
		// have been limited to the current path) to perform #userData storage.
		try {
			storageContainer = new ActiveXObject('htmlfile')
			storageContainer.open()
			storageContainer.write('<s' + 'cript>document.w=window</s' + 'cript><iframe src="/favicon.ico"></iframe>')
			storageContainer.close()
			storageOwner = storageContainer.w.frames[0].document
			storage = storageOwner.createElement('div')
		} catch(e) {
			// somehow ActiveXObject instantiation failed (perhaps some special
			// security settings or otherwse), fall back to per-path storage
			storage = doc.createElement('div')
			storageOwner = doc.body
		}
		function withIEStorage(storeFunction) {
			return function() {
				var args = Array.prototype.slice.call(arguments, 0)
				args.unshift(storage)
				// See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
				// and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
				storageOwner.appendChild(storage)
				storage.addBehavior('#default#userData')
				storage.load(localStorageName)
				var result = storeFunction.apply(store, args)
				storageOwner.removeChild(storage)
				return result
			}
		}

		// In IE7, keys may not contain special chars. See all of https://github.com/marcuswestin/store.js/issues/40
		var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g")
		function ieKeyFix(key) {
			return key.replace(forbiddenCharsRegex, '___')
		}
		store.set = withIEStorage(function(storage, key, val) {
			key = ieKeyFix(key)
			if (val === undefined) { return store.remove(key) }
			storage.setAttribute(key, store.serialize(val))
			storage.save(localStorageName)
			return val
		})
		store.get = withIEStorage(function(storage, key) {
			key = ieKeyFix(key)
			return store.deserialize(storage.getAttribute(key))
		})
		store.remove = withIEStorage(function(storage, key) {
			key = ieKeyFix(key)
			storage.removeAttribute(key)
			storage.save(localStorageName)
		})
		store.clear = withIEStorage(function(storage) {
			var attributes = storage.XMLDocument.documentElement.attributes
			storage.load(localStorageName)
			for (var i=0, attr; attr=attributes[i]; i++) {
				storage.removeAttribute(attr.name)
			}
			storage.save(localStorageName)
		})
		store.getAll = function(storage) {
			var ret = {}
			store.forEach(function(key, val) {
				ret[key] = val
			})
			return ret
		}
		store.forEach = withIEStorage(function(storage, callback) {
			var attributes = storage.XMLDocument.documentElement.attributes
			for (var i=0, attr; attr=attributes[i]; ++i) {
				callback(attr.name, store.deserialize(storage.getAttribute(attr.name)))
			}
		})
	}

	try {
		var testKey = '__storejs__'
		store.set(testKey, testKey)
		if (store.get(testKey) != testKey) { store.disabled = true }
		store.remove(testKey)
	} catch(e) {
		store.disabled = true
	}
	store.enabled = !store.disabled
	
	if (typeof module != 'undefined' && module.exports) { module.exports = store }
	else if (typeof define === 'function' && define.amd) { define(store) }
	else { win.store = store }
	
})(this.window || global);
;(function() {
  window.JSLogger || (window.JSLogger = {});

  JSLogger.Event = (function() {
    Event.prototype.flush = false;

    Event.prototype.format = '%d %b %Y %H:%M:%S,%N';

    Event.prototype.title = '[JSLogger]';

    function Event(level, messages, exception, options) {
      var _ref, _ref1, _ref2;
      this.level = level;
      this.messages = messages;
      this.exception = exception;
      this.options = options;
      this.flush = ((_ref = this.options) != null ? _ref.flush : void 0) ? this.options.flush : this.flush;
      this.format = ((_ref1 = this.options) != null ? _ref1.format : void 0) ? this.options.format : this.format;
      this.title = ((_ref2 = this.options) != null ? _ref2.title : void 0) ? this.options.title : this.title;
    }

    Event.prototype.getCombinedMessages = function() {
      if (this.messages.length === 1) {
        return this.messages[0];
      } else {
        return this.messages.join("\r\n");
      }
    };

    Event.prototype.toString = function() {
      return "Event[" + this.level + "]s";
    };

    return Event;

  })();

}).call(this);
;(function() {
  window.JSLogger || (window.JSLogger = {});

  JSLogger.Level = (function() {
    function Level(value, name) {
      this.value = value;
      this.name = name;
    }

    Level.prototype.equals = function(level) {
      return this.value === level.value;
    };

    Level.prototype.isGreaterOrEqual = function(level) {
      return this.value >= level.value;
    };

    return Level;

  })();

  JSLogger.Level.ALL = new JSLogger.Level(Number.MIN_VALUE, "ALL");

  JSLogger.Level.TRACE = new JSLogger.Level(10000, "TRACE");

  JSLogger.Level.DEBUG = new JSLogger.Level(20000, "DEBUG");

  JSLogger.Level.INFO = new JSLogger.Level(30000, "INFO");

  JSLogger.Level.WARN = new JSLogger.Level(40000, "WARN");

  JSLogger.Level.ERROR = new JSLogger.Level(50000, "ERROR");

  JSLogger.Level.FATAL = new JSLogger.Level(60000, "FATAL");

  JSLogger.Level.OFF = new JSLogger.Level(Number.MAX_VALUE, "OFF");

}).call(this);
;(function() {
  var __hasProp = {}.hasOwnProperty;

  window.JSLogger || (window.JSLogger = {});

  JSLogger.Formatter = (function() {
    function Formatter() {}

    Formatter.prototype.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    Formatter.prototype.weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturdays"];

    Formatter.prototype.formats = function(date) {
      return {
        "a": function() {
          return this.weekdays[date.getDay()].substring(0, 3);
        },
        "A": function() {
          return this.weekdays[date.getDay()];
        },
        "b": function() {
          return this.months[date.getMonth()].substring(0, 3);
        },
        "B": function() {
          return this.months[date.getMonth()];
        },
        "c": function() {
          return date.toLocaleString();
        },
        "d": function() {
          return date.getDate().toString();
        },
        "F": function() {
          return "" + (date.getFullYear()) + "-" + (this.pad(date.getMonth() + 1, 2)) + "-" + (this.pad(date.getDate(), 2));
        },
        "H": function() {
          return this.pad(date.getHours(), 2);
        },
        "I": function() {
          return "" + ((date.getHours() % 12) || 12);
        },
        "j": function() {
          return this.getDayOfYear();
        },
        "L": function() {
          return this.pad(date.getMilliseconds(), 3);
        },
        "m": function() {
          return this.pad(date.getMonth() + 1, 2);
        },
        "M": function() {
          return this.pad(date.getMinutes(), 2);
        },
        "N": function() {
          return this.pad(date.getMilliseconds(), 3);
        },
        "p": function() {
          if (date.getHours() < 12) {
            return "AM";
          } else {
            return "PM";
          }
        },
        "P": function() {
          if (date.getHours() < 12) {
            return "am";
          } else {
            return "pm";
          }
        },
        "S": function() {
          return this.pad(date.getSeconds(), 2);
        },
        "s": function() {
          return Math.floor(date.getTime() / 1000);
        },
        "U": function() {
          return this.getWeekOfYear();
        },
        "w": function() {
          return date.getDay();
        },
        "W": function() {
          return this.getWeekOfYear(1);
        },
        "y": function() {
          return date.getFullYear() % 100;
        },
        "Y": function() {
          return date.getFullYear();
        },
        "x": function() {
          return date.toLocaleDateString();
        },
        "X": function() {
          return date.toLocaleTimeString();
        },
        "z": function() {
          var z;
          return this.pad(Math.floor((z = -date.getTimezoneOffset()) / 60), 2, true) + this.pad(Math.abs(z) % 60, 2);
        },
        "Z": function() {
          return /\(([^\)]*)\)$/.exec(date.toString())[1];
        }
      };
    };

    Formatter.prototype.pad = function(number, digits, signed) {
      var s;
      s = Math.abs(number).toString();
      while (s.length < digits) {
        s = "0" + s;
      }
      return (number < 0 ? "-" : (signed ? "+" : "")) + s;
    };

    Formatter.prototype.format = function(date, fmt) {
      var callback, char, part, parts, r, _ref;
      parts = (fmt || "%c").split("%%");
      _ref = this.formats(date);
      for (char in _ref) {
        if (!__hasProp.call(_ref, char)) continue;
        callback = _ref[char];
        r = new RegExp("%" + char, "g");
        parts = (function() {
          var _i, _len, _results,
            _this = this;
          _results = [];
          for (_i = 0, _len = parts.length; _i < _len; _i++) {
            part = parts[_i];
            _results.push(part.replace(r, function() {
              return callback.apply(_this);
            }));
          }
          return _results;
        }).call(this);
      }
      return parts.join("%");
    };

    Formatter.prototype.getDayOfYear = function() {
      return Math.ceil((this.getTime() - new Date(this.getFullYear(), 0, 1).getTime()) / 24 / 60 / 60 / 1000);
    };

    Formatter.prototype.getWeekOfYear = function(start) {
      if (start == null) {
        start = 0;
      }
      return Math.floor((this.getDayOfYear() - (start + 7 - new Date(this.getFullYear(), 0, 1).getDay()) % 7) / 7) + 1;
    };

    return Formatter;

  })();

}).call(this);
;(function() {
  window.JSLogger || (window.JSLogger = {});

  JSLogger.Logging = (function() {
    Logging.prototype.formatter = new JSLogger.Formatter();

    function Logging(endpoint, threshold, options) {
      this.endpoint = endpoint;
      this.threshold = threshold != null ? threshold : JSLogger.Level.DEBUG;
      this.options = options;
      this.info("Initializing jslogger with threshold: " + this.threshold.name + " for path: " + window.location.pathname + ", with endpoint " + this.endpoint, this.options);
    }

    Logging.prototype.isEnabledFor = function(level) {
      return level.isGreaterOrEqual(this.threshold);
    };

    Logging.prototype.isDebugEnabled = function() {
      return this.isEnabledFor(JSLogger.Level.DEBUG);
    };

    Logging.prototype.isInfoEnabled = function() {
      return this.isEnabledFor(JSLogger.Level.INFO);
    };

    Logging.prototype.isWarnEnabled = function() {
      return this.isEnabledFor(JSLogger.Level.WARN);
    };

    Logging.prototype.isErrorEnabled = function() {
      return this.isEnabledFor(JSLogger.Level.ERROR);
    };

    Logging.prototype.formatLogMessage = function(event) {
      var date, num, spacer, start, _i;
      date = new Date();
      start = event.level.name ? event.level.name.length : 0;
      spacer = "";
      for (num = _i = start; start <= 8 ? _i <= 8 : _i >= 8; num = start <= 8 ? ++_i : --_i) {
        spacer += " ";
      }
      return "[" + (this.formatter.format(date, event.format)) + "]  " + event.level.name + spacer + event.title + " " + event.messages[0];
    };

    Logging.prototype.debug = function() {
      if (this.isDebugEnabled) {
        return this.log(JSLogger.Level.DEBUG, arguments);
      }
    };

    Logging.prototype.info = function() {
      if (this.isInfoEnabled) {
        return this.log(JSLogger.Level.INFO, arguments);
      }
    };

    Logging.prototype.warn = function() {
      if (this.isWarnEnabled) {
        return this.log(JSLogger.Level.WARN, arguments);
      }
    };

    Logging.prototype.error = function() {
      if (this.isErrorEnabled) {
        return this.log(JSLogger.Level.ERROR, arguments);
      }
    };

    Logging.prototype.fatal = function() {
      return this.log(JSLogger.Level.FATAL, arguments);
    };

    Logging.prototype.log = function(level, params) {
      var event, message;
      event = this.createLogEvent(level, params);
      message = this.store(event);
      if (message) {
        return this.send(event, message);
      }
    };

    Logging.prototype.createLogEvent = function(level, params) {
      var exception, lastParam, messages, options, param, results;
      if (level.isGreaterOrEqual(this.threshold)) {
        results = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = params.length; _i < _len; _i++) {
            param = params[_i];
            if (param !== Error && param === Object(param)) {
              _results.push(param);
            }
          }
          return _results;
        })();
        options = results ? results[0] : null;
        messages = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = params.length; _i < _len; _i++) {
            param = params[_i];
            if (param !== Error && param !== Object(param)) {
              _results.push(param);
            }
          }
          return _results;
        })();
        lastParam = params.length > 1 ? params[params.length - 1] : void 0;
        exception = lastParam instanceof Error ? lastParam : void 0;
        return new JSLogger.Event(level, messages, exception, options);
      }
    };

    Logging.prototype.getInitialMessage = function() {
      var event, message;
      message = 'Flushing stored javascript logs....';
      event = this.createLogEvent(JSLogger.Level.INFO, [message]);
      return this.formatLogMessage(event);
    };

    Logging.prototype.store = function(event) {
      var message, messages, prop, stored;
      if (store.enabled) {
        message = this.formatLogMessage(event);
        store.set("jslogger-" + (JSON.stringify(new Date().getTime())), message);
        if (event.level.isGreaterOrEqual(JSLogger.Level.ERROR) || event.flush) {
          stored = store.getAll();
          messages = (function() {
            var _results;
            _results = [];
            for (prop in stored) {
              if (stored.hasOwnProperty(prop)) {
                message = stored[prop];
                if (message instanceof Array) {
                  _results.push("" + message[0]);
                } else {
                  _results.push("" + message);
                }
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          })();
          messages.unshift(this.getInitialMessage());
          return messages.join('\n');
        }
      }
    };

    Logging.prototype.send = function(event, message) {
      var params, req;
      req = new XMLHttpRequest();
      params = "level=" + event.level.name + "&message=" + message;
      req.open("POST", this.endpoint, true);
      req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      req.onreadystatechange = function() {
        if (req.readyState === 4 && req.status === 200) {
          return store.clear();
        } else {
          return store.clear();
        }
      };
      return req.send(params);
    };

    return Logging;

  })();

}).call(this);
