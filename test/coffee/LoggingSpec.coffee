describe 'Level', ->
  describe 'createLogEvent()', ->
    it 'should create a new Logging Event', ->
      logging = new JSLogger.Logging('/test/me')
      event = logging.createLogEvent(JSLogger.Level.DEBUG, ['test me'])
      expect(event.level).toEqual(JSLogger.Level.DEBUG)

  describe 'createLogEvent()', ->
    it 'should format the log message with proper prefix', ->
      logging = new JSLogger.Logging('/test/me')
      event = new JSLogger.Event(JSLogger.Level.DEBUG, ['test it'])
      results = logging.formatLogMessage(event)
      expect(results.length).toEqual(53)