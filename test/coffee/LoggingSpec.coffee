describe 'Level', ->
  describe 'createLogEvent()', ->
    it 'should create a new Logging Event', ->
      logging = new JSLogger.Logging('/test/me')
      params = {flush:true}
      event = logging.createLogEvent(JSLogger.Level.DEBUG, ['test me', params])
      expect(event.level).toEqual(JSLogger.Level.DEBUG)
      expect(event.flush).toBeTruthy()

  describe 'createLogEvent()', ->
    it 'should format the log message with proper prefix', ->
      logging = new JSLogger.Logging('/test/me')
      event = new JSLogger.Event(JSLogger.Level.DEBUG, ['test it'])
      results = logging.formatLogMessage(event)
      expect(results.length).toEqual(56)

  describe 'store()', ->
    it 'should return no messages', ->
      logging = new JSLogger.Logging('/test/me')
      event = new JSLogger.Event(JSLogger.Level.DEBUG, ['test it'])
      message = logging.store(event)
      expect(message).toBeUndefined()
    it 'should return a bunch of messages', ->
      logging = new JSLogger.Logging('/test/me')
      event = new JSLogger.Event(JSLogger.Level.DEBUG, ['test it'], null, {flush:true})
      message = logging.store(event)
      expect(message.split('\n').length).toBeGreaterThan(1)