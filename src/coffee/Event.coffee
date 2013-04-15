window.JSLogger or= {}
class JSLogger.Event
  flush: false
  format: '%F %H:%M:%S,%N'
  title: 'JSLogger'
  constructor: (@level, @messages, @exception, @options) ->
    flush = @options?.flush
    format = @options?.format
    title = @options?.title

  getCombinedMessages: () ->
    return if @messages.length is 1 then @messages[0] else @messages.join("\r\n")

  toString: () ->
    return "Event[#{@level}]s"