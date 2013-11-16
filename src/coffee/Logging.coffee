window.JSLogger or= {}
class JSLogger.Logging
  formatter: new JSLogger.Formatter()

  constructor: (@endpoint, @threshold = JSLogger.Level.DEBUG, @options) ->
      @info("Initializing jslogger with threshold: #{@threshold.name} for path: #{window.location.pathname}, with endpoint #{@endpoint}", @options)

  isEnabledFor: (level) ->
    return  level.isGreaterOrEqual(@threshold)

  isDebugEnabled: () ->
    return @isEnabledFor(JSLogger.Level.DEBUG)

  isInfoEnabled: () ->
    return @isEnabledFor(JSLogger.Level.INFO)

  isWarnEnabled: () ->
    return @isEnabledFor(JSLogger.Level.WARN)

  isErrorEnabled: () ->
    return @isEnabledFor(JSLogger.Level.ERROR)

  debug: () ->
    if @isDebugEnabled
      @log(JSLogger.Level.DEBUG, arguments)

  info: () ->
    if @isInfoEnabled
      @log(JSLogger.Level.INFO, arguments)

  warn: () ->
    if @isWarnEnabled
      @log(JSLogger.Level.WARN, arguments)

  error: () ->
    if @isErrorEnabled
      @log(JSLogger.Level.ERROR, arguments)

  fatal: () ->
    @log(JSLogger.Level.FATAL, arguments)

  log: (level, params) ->
    event = @createLogEvent(level, params)
    messages = @store(event)
    if messages then @send(messages)

  createLogEvent: (level, params) ->
    if level.isGreaterOrEqual(@threshold)
      results = (param for param in params when param isnt Error and param is Object(param))
      options = if results then results[0] else null
      messages = (param for param in params when param isnt Error and param isnt Object(param))
      lastParam = if params.length > 1 then params[params.length - 1]
      exception = if lastParam instanceof Error then lastParam
      return new JSLogger.Event(level, messages, exception, options)

  store: (event) ->
    if store.enabled
      store.set("jslogger-#{JSON.stringify(new Date().getTime())}", {level:event.level.name, message: "#{event.title} #{event.messages[0]}"})
      if event.level.isGreaterOrEqual(JSLogger.Level.ERROR) or event.flush
        stored = store.getAll()
        messages = for prop of stored
          if stored.hasOwnProperty(prop)
            stored[prop]
        return messages


  send: (messages) ->
    req = new XMLHttpRequest()
    params = "messages=#{JSON.stringify(messages)}"
    req.open("POST", this.endpoint, true)
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    req.onreadystatechange = ->
      if req.readyState is 4 and req.status is 200
        store.clear()
      else
        store.clear()
    req.send(params)

