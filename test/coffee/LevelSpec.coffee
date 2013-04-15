describe 'Level', ->
  describe 'eauls()', ->
    it 'should be equal', ->
      level = JSLogger.Level.TRACE
      result = level.equals(JSLogger.Level.TRACE)
      expect(result).toBeTruthy()

    it 'should be not equal', ->
      level = JSLogger.Level.ERROR
      result = level.equals(JSLogger.Level.INFO)
      expect(result).toBeFalsy()

  describe 'isGreaterOrEqual()', ->
    it 'should be greater', ->
      level = JSLogger.Level.ERROR
      result = level.isGreaterOrEqual(JSLogger.Level.INFO)
      expect(result).toBeTruthy()

    it 'should be equal', ->
      level = JSLogger.Level.WARN
      result = level.isGreaterOrEqual(JSLogger.Level.WARN)
      expect(result).toBeTruthy()

    it 'should be not equal', ->
      level = JSLogger.Level.INFO
      result = level.isGreaterOrEqual(JSLogger.Level.WARN)
      expect(result).toBeFalsy()