// Sample Karma configuration file, that contain pretty much all the available options
// It's used for running client tests on Travis (http://travis-ci.org/#!/karma-runner/karma)
// Most of the options can be overriden by cli arguments (see karma --help)
//
// For all available config options and default values, see:
// https://github.com/karma-runner/karma/blob/stable/lib/config.js#L54


// base path, that will be used to resolve files and exclude
basePath = '../';

// list of files / patterns to load in the browser
files = [
    JASMINE,
    JASMINE_ADAPTER,
    'target/build/js/*.js',
    'target/test/js/*.js',
    'lib/*.js'
];

// use dots reporter, as travis terminal does not support escaping sequences
// possible values: 'dots', 'progress', 'junit', 'teamcity'
// CLI --reporters progress
reporters = ['progress', 'junit', 'growl'];

junitReporter = {
    // will be resolved to basePath (in the same way as files/exclude patterns)
    outputFile: 'target/test-results.xml'
};

// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
// CLI --browsers Chrome,Firefox,Safari
browsers = ['Chrome'];

autoWatch = true;

