describe 'Formatter', ->
  formatter = new JSLogger.Formatter()
  describe 'format()', ->
    it 'can format the date using multiple options', ->
      result = formatter.format(new Date(), '%F %H:%M:%S,%N')
      expect(result.length).toBe(23)

    it 'can format using the %a format option', ->
      result = formatter.format(new Date(), '%a')
      expect(result.length).toBe(3)

    it 'can format using the %A format option', ->
      result = formatter.format(new Date(), '%A')
      expect(result.length).toBeGreaterThan(3)

    it 'can format using the %b format option', ->
      result = formatter.format(new Date(), '%b')
      expect(result.length).toBe(3)

    it 'can format using the %B format option', ->
      result = formatter.format(new Date(), '%B')
      expect(result.length).toBeGreaterThan(3)

    it 'can format using the %c format option', ->
      date = new Date()
      result = formatter.format(date, '%c')
      expect(result).toBe(date.toLocaleString())

    it 'can format using the %d format option', ->
      result = formatter.format(new Date(), '%d')
      expect(result).toBe(new Date().getDate().toString())

    it 'can format using the %F format option', ->
      result = formatter.format(new Date(), '%F')
      expect(result.length).toBe(10)