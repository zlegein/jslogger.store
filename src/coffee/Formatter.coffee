window.JSLogger or= {}
class JSLogger.Formatter

    months: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]
    weekdays: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturdays" ]

    formats:(date) ->
      "a": -> @weekdays[date.getDay()].substring(0, 3)
      "A": -> @weekdays[date.getDay()]
      "b": -> @months[date.getMonth()].substring(0, 3)
      "B": -> @months[date.getMonth()]
      "c": -> date.toLocaleString()
      "d": -> date.getDate().toString()
      "F": -> "#{date.getFullYear()}-#{@pad(date.getMonth() + 1, 2) }-#{@pad(date.getDate(),2)}"
      "H": -> @pad(date.getHours(), 2)
      "I": -> "#{(date.getHours() % 12) || 12}"
      "j": -> @getDayOfYear()
      "L": -> @pad(date.getMilliseconds(), 3)
      "m": -> @pad((date.getMonth() + 1), 2)
      "M": -> @pad(date.getMinutes(), 2)
      "N": -> @pad(date.getMilliseconds(),3)
      "p": -> if date.getHours() < 12 then "AM" else "PM"
      "P": -> if date.getHours() < 12 then "am" else "pm"
      "S": -> @pad(date.getSeconds(), 2)
      "s": -> Math.floor(date.getTime() / 1000)
      "U": -> @getWeekOfYear()
      "w": -> date.getDay()
      "W": -> @getWeekOfYear(1)
      "y": -> date.getFullYear() % 100
      "Y": -> date.getFullYear()
      "x": -> date.toLocaleDateString()
      "X": -> date.toLocaleTimeString()
      "z": -> @pad(Math.floor((z = -date.getTimezoneOffset()) / 60), 2, true) + @pad(Math.abs(z) % 60, 2)
      "Z": -> /\(([^\)]*)\)$/.exec(date.toString())[1]

    pad:(number, digits, signed) ->
      s = Math.abs(number).toString()
      s = "0" + s while s.length < digits
      (if number < 0 then "-" else (if signed then "+" else "")) + s
     

     

     
    format: (date, fmt) ->
      parts = (fmt || "%c").split "%%"
      for own char, callback of @formats(date)
        r = new RegExp("%#{char}", "g")
        parts = (part.replace(r, => callback.apply(this)) for part in parts)
      parts.join "%"
      
    getDayOfYear:() -> 
      Math.ceil((@getTime() - new Date(@getFullYear(), 0, 1).getTime()) / 24 / 60 / 60 / 1000)
     
    getWeekOfYear: (start = 0) ->
      Math.floor((@getDayOfYear() - (start + 7 - new Date(@getFullYear(), 0, 1).getDay()) % 7) / 7) + 1