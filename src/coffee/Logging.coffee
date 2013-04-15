window.JSLogger or= {}
class JSLogger.Logging
  formatter: new JSLogger.Formatter()

  constructor: (@endpoint, @threshold = JSLogger.Level.DEBUG, @options = null) ->
    flush = options?.flush
    if flush
      @info("End flushing of jslogger javascript logs", options)
    else
      @info("Initializing jslogger with threshold:" + @threshold.name + "fors " + window.location.pathname + " with endpoint " + @endpoint)

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
    spacer += " " for num in [start..10]
    return "[#{@formatter.format(date, event.format)}] #{event.level.name}#{spacer}#{event.title} #{event.messages[0]}"

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
    @store(event)

  createLogEvent: (level, params) ->
    if level.isGreaterOrEqual(@threshold)
      options = (param for param in params when param isnt Error and param is Object)
      messages = (param for param in params when param isnt Error and param isnt Object)
      lastParam = if params.length > 1 then params[params.length - 1]
      exception = if lastParam instanceof Error then lastParam
      return new JSLogger.Event(level, messages, exception, options)

  store: (event) ->
    if store.enabled
      message = @formatLogMessage(event)
      store.set("jslogger-#{JSON.stringify(new Date().getTime())}", message)
      if event.level.isGreaterOrEqual(JSLogger.Level.ERROR) or event.flush
        messages = store.getAll()
        messageStr = 'Begin flushing javascript logs:\n'
        messageStr += for prop in messages
          if messages.hasOwnProperty(prop)
            message = messages[prop]
            if message instanceof Array
              "#{message[0]}\n"
            else
              "#{message}\n"

        @send(messageStr)

  send: (event, message) ->
    req = new XMLHttpRequest()

    params = "level=i#{event.level.name}&message=#{message}";
    req.open("POST", this.endpoint, true);

    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    req.setRequestHeader("Content-length", params.length)
    req.setRequestHeader("Connection", "close")

    req.onreadystatechange = ->
      if req.readyState is 4 and req.status is 200
        store.clear()
      else
        store.clear()

    req.send(params)

