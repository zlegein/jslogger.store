window.JSLogger or= {}
class JSLogger.Level
  constructor: (@value, @name) ->

  equals: (level) ->
    return @value is level.value

  isGreaterOrEqual: (level) ->
    return @value >= level.value

JSLogger.Level.ALL = new JSLogger.Level(Number.MIN_VALUE, "ALL")
JSLogger.Level.TRACE = new JSLogger.Level(10000, "TRACE")
JSLogger.Level.DEBUG = new JSLogger.Level(20000, "DEBUG")
JSLogger.Level.INFO = new JSLogger.Level(30000, "INFO")
JSLogger.Level.WARN = new JSLogger.Level(40000, "WARN")
JSLogger.Level.ERROR = new JSLogger.Level(50000, "ERROR")
JSLogger.Level.FATAL = new JSLogger.Level(60000, "FATAL")
JSLogger.Level.OFF = new JSLogger.Level(Number.MAX_VALUE, "OFF")