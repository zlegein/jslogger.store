describe 'Event', ->
  describe 'getCombinedMessages()', ->
    it 'should return one message in string', ->
      event = new JSLogger.Event(JSLogger.Level.DEBUG, ['test foo'])
      result = event.getCombinedMessages()
      expect(result).toBe('test foo')

    it 'should return many message in string', ->
      event = new JSLogger.Event(JSLogger.Level.DEBUG, ['test foo', 'test bar'])
      result = event.getCombinedMessages()
      expect(result).toBe('test foo\r\ntest bar')

  describe 'initialize()', ->
    it 'should have the default values after initializing', ->
      event = new JSLogger.Event(JSLogger.Level.DEBUG, ['test foo'])
      expect(event.flush).toBeFalsy()
      expect(event.format).toBe('%d %b %Y %H:%M:%S,%N')
      expect(event.title).toBe('[JSLogger]')

    it 'should have the passed in values after initializing', ->
      event = new JSLogger.Event(JSLogger.Level.DEBUG, ['test foo'], null, {flush: true, format:'%d', title:'Tester'})
      expect(event.flush).toBeTruthy()
      expect(event.format).toBe('%d')
      expect(event.title).toBe('Tester')