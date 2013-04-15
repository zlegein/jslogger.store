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