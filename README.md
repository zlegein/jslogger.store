About
-------

There are a ton of javascript loggers out there, but I was unable to find any that completely fit. 
This jslogger takes advantage of the browsers LocalStorage to store log events and then will only send them to the
configured endpoint when there is a log event level that is `error` or above, or stated in the log event options.

Installation
------

There are two distributable version of the jslogger. 

* The bundled one includes the dependent [store.js](https://github.com/marcuswestin/store.js) by Marcus Westin.
* The non bundled version excludes this library, but note you will need to have it included in your project.

Setup
------

Setup a global namespace for your logger like so:

``` javascript
var myapp = myapp || {};
myapp.logger = new JSLogger.Logging('/my/server/enpoint', JSLogger.Level.INFO, {title:'[My App]'});
```

* endpoint - the server endpoint url you want to send logging information to
* the logging threshold you want to use
* options - see below

Snippet of how to use the logger:

``` javascript
if(beer) {
    myapp.logger.info("you are good person!");
} else {
    myapp.logger.error("you are a bad person!", new Error('how dare you!');
}
```

The logs will be flushed to the server when there is a log event greater than `ERROR` or the `flush` flag is set to `true` 

### Options

* title: the title message for the logs. Default is: `[JSLogger]`
* flush: whether or not to force a dump of all the stored logs from local storage. Defalut is: `false`
* format: the format of the timestamp you want to set for the logs. Default is: `'%d %b %Y %H:%M:%S,%N'`


Development
------------
You need [Node](http://nodejs.org/) version 0.6.2 or later installed on your system. Node is extremely easy to install and has a small footprint, and is really awesome otherwise too, so [just do it](http://nodejs.org/).

Once you have Node installed:

    npm install
    
This will install all the `jslogger` dependent node modules needed for development

Thanks
-----

* The timestamp formatter is a public utility take from [Date Formatter](https://gist.github.com/fauxparse/1508172)
* Many Thanks to Marcus Westin for [store.js](https://github.com/marcuswestin/store.js) to make this possible


