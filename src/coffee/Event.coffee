window.JSLogger or= {}
class JSLogger.Event
  flush: false
  format: '%d %b %Y %H:%M:%S,%N'
  title: '[JSLogger]'
  constructor: (@level, @messages, @exception, @options) ->
    @flush = if @options?.flush then @options.flush else @flush
    @format = if @options?.format then @options.format else @format
    @title = if @options?.title then @options.title else @title

  getCombinedMessages: () ->
    return if @messages.length is 1 then @messages[0] else @messages.join("\r\n")

  toString: () ->
    return "Event[#{@level}]s"