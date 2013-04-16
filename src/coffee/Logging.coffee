window.JSLogger or= {}
class JSLogger.Logging
  formatter: new JSLogger.Formatter()

  constructor: (@endpoint, @threshold = JSLogger.Level.DEBUG, @options = null) ->
    flush = options?.flush
    if flush
      @info("Finish flushing jslogger javascript logs", options)
    else
      @info("Initializing jslogger with threshold: #{@threshold.name} for path: #{window.location.pathname}, with endpoint #{@endpoint}")

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

  formatLogMessage: (event) ->
    date = new Date()
    start = if event.level.name then event.level.name.length else 0
    spacer = ""
    spacer += " " for num in [start..8]
    return "[#{@formatter.format(date, event.format)}]  #{event.level.name}#{spacer}#{event.title} #{event.messages[0]}"

  debug: (msg, options) ->
    if @isDebugEnabled
      @log(JSLogger.Level.DEBUG, [msg, options])

  info: (msg, options) ->
    if @isInfoEnabled
      @log(JSLogger.Level.INFO, [msg, options])

  warn: (msg, options) ->
    if @isWarnEnabled
      @log(JSLogger.Level.WARN, [msg, options])

  error: (msg, options) ->
    if @isErrorEnabled
      @log(JSLogger.Level.ERROR, [msg, options])

  fatal: (msg, options) ->
    @log(JSLogger.Level.FATAL, [msg, options])

  log: (level, params) ->
    event = @createLogEvent(level, params)
    message = @store(event)
    if message then @send(event, message)

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
      message = @formatLogMessage(event)
      store.set("jslogger-#{JSON.stringify(new Date().getTime())}", message)
      if event.level.isGreaterOrEqual(JSLogger.Level.ERROR) or event.flush
        stored = store.getAll()
        messages = for prop of stored
          if stored.hasOwnProperty(prop)
            message = stored[prop]
            if message instanceof Array
              "#{message[0]}"
            else
              "#{message}"
        return messages.join('\n')

  send: (event, message) ->
    req = new XMLHttpRequest()

    params = "level=#{event.level.name}&message=#{message}";
    req.open("POST", this.endpoint, true);

    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded")

    req.onreadystatechange = ->
      if req.readyState is 4 and req.status is 200
        store.clear()
      else
        store.clear()

    req.send(params)

