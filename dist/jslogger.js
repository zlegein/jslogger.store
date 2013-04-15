(function() {
  window.JSLogger || (window.JSLogger = {});

  JSLogger.Event = (function() {
    Event.prototype.flush = false;

    Event.prototype.format = '%F %H:%M:%S,%N';

    Event.prototype.title = 'JSLogger';

    function Event(level, messages, exception, options) {
      var flush, format, title, _ref, _ref1, _ref2;

      this.level = level;
      this.messages = messages;
      this.exception = exception;
      this.options = options;
      flush = (_ref = this.options) != null ? _ref.flush : void 0;
      format = (_ref1 = this.options) != null ? _ref1.format : void 0;
      title = (_ref2 = this.options) != null ? _ref2.title : void 0;
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
      var flush;

      this.endpoint = endpoint;
      this.threshold = threshold != null ? threshold : JSLogger.Level.DEBUG;
      this.options = options != null ? options : null;
      flush = options != null ? options.flush : void 0;
      if (flush) {
        this.info("End flushing of jslogger javascript logs", options);
      } else {
        this.info("Initializing jslogger with threshold:" + this.threshold.name + "fors " + window.location.pathname + " with endpoint " + this.endpoint);
      }
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
      for (num = _i = start; start <= 10 ? _i <= 10 : _i >= 10; num = start <= 10 ? ++_i : --_i) {
        spacer += " ";
      }
      return "[" + (this.formatter.format(date, event.format)) + "] " + event.level.name + spacer + event.title + " " + event.messages[0];
    };

    Logging.prototype.debug = function(msg, options) {
      if (this.isDebugEnabled) {
        return this.log(JSLogger.Level.DEBUG, [msg, options]);
      }
    };

    Logging.prototype.info = function(msg, options) {
      if (this.isInfoEnabled) {
        return this.log(JSLogger.Level.INFO, [msg, options]);
      }
    };

    Logging.prototype.warn = function(msg, options) {
      if (this.isWarnEnabled) {
        return this.log(JSLogger.Level.WARN, [msg, options]);
      }
    };

    Logging.prototype.error = function(msg, options) {
      if (this.isErrorEnabled) {
        return this.log(JSLogger.Level.ERROR, [msg, options]);
      }
    };

    Logging.prototype.fatal = function(msg, options) {
      return this.log(JSLogger.Level.FATAL, [msg, options]);
    };

    Logging.prototype.log = function(level, params) {
      var event;

      event = this.createLogEvent(level, params);
      return this.store(event);
    };

    Logging.prototype.createLogEvent = function(level, params) {
      var exception, lastParam, messages, options, param;

      if (level.isGreaterOrEqual(this.threshold)) {
        options = (function() {
          var _i, _len, _results;

          _results = [];
          for (_i = 0, _len = params.length; _i < _len; _i++) {
            param = params[_i];
            if (param !== Error && param === Object) {
              _results.push(param);
            }
          }
          return _results;
        })();
        messages = (function() {
          var _i, _len, _results;

          _results = [];
          for (_i = 0, _len = params.length; _i < _len; _i++) {
            param = params[_i];
            if (param !== Error && param !== Object) {
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

    Logging.prototype.store = function(event) {
      var message, messageStr, messages, prop;

      if (store.enabled) {
        message = this.formatLogMessage(event);
        store.set("jslogger-" + (JSON.stringify(new Date().getTime())), message);
        if (event.level.isGreaterOrEqual(JSLogger.Level.ERROR) || event.flush) {
          messages = store.getAll();
          messageStr = 'Begin flushing javascript logs:\n';
          messageStr += (function() {
            var _i, _len, _results;

            _results = [];
            for (_i = 0, _len = messages.length; _i < _len; _i++) {
              prop = messages[_i];
              if (messages.hasOwnProperty(prop)) {
                message = messages[prop];
                if (message instanceof Array) {
                  _results.push("" + message[0] + "\n");
                } else {
                  _results.push("" + message + "\n");
                }
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          })();
          return this.send(messageStr);
        }
      }
    };

    Logging.prototype.send = function(event, message) {
      var params, req;

      req = new XMLHttpRequest();
      params = "level=i" + event.level.name + "&message=" + message;
      req.open("POST", this.endpoint, true);
      req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      req.setRequestHeader("Content-length", params.length);
      req.setRequestHeader("Connection", "close");
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
