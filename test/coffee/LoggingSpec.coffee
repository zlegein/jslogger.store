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

  describe 'store()', ->
    it 'should return no messages', ->
      logging = new JSLogger.Logging('/test/me')
      event = new JSLogger.Event(JSLogger.Level.DEBUG, ['test it'])
      message = logging.store(event)
      expect(message).toBeUndefined()
    it 'should return a bunch of messages', ->
      logging = new JSLogger.Logging('/test/me/')
      event = new JSLogger.Event(JSLogger.Level.DEBUG, ['test it'], null, {flush:true})
      messages = logging.store(event)
      expect(messages.length).toBe(2)
      expect(messages[0].level).toBe('INFO')
      expect(messages[1].message.indexOf('test it')).toBeTruthy()
