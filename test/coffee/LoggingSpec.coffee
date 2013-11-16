describe 'Level', ->
  describe 'createLogEvent()', ->
    it 'should create a new Logging Event', ->
      logging = new JSLogger.Logging('/test/me')
      params = {flush:true}
      event = logging.createLogEvent(JSLogger.Level.DEBUG, ['test me', params])
      expect(event.level).toEqual(JSLogger.Level.DEBUG)
      expect(event.flush).toBeTruthy()

    it 'should create a new Logging event with an exception', ->
      logging = new JSLogger.Logging('/test/me')
      event = logging.createLogEvent(JSLogger.Level.DEBUG, ['test me', new Error('me no likey')])
      expect(event.level).toEqual(JSLogger.Level.DEBUG)
      expect(event.exception.message).toBe('me no likey')

    it 'should create a new Logging event with an exception and options', ->
      logging = new JSLogger.Logging('/test/me')
      event = logging.createLogEvent(JSLogger.Level.DEBUG, ['test me', {title:'tester'}, new Error('me no likey')])
      expect(event.level).toEqual(JSLogger.Level.DEBUG)
      expect(event.exception.message).toBe('me no likey')
      expect(event.title).toBe('tester')

  describe 'formatLogMessage()', ->
    it 'should format the log message with proper prefix', ->
      logging = new JSLogger.Logging('/test/me')
      event = new JSLogger.Event(JSLogger.Level.DEBUG, ['test it'])
      results = logging.formatLogMessage(event)
      expect(results.indexOf('test it')).toBeGreaterThan(1)

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
