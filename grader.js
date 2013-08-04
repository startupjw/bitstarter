#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/
var thing;
var fs = require('fs');
var flag = 0;
var program = require('commander');
var cheerio = require('cheerio');
var resuult = '';
var HTMLFILE_DEFAULT = "index.html";
var URL_DEFAULT = "DEFAULT_URL, NO URL EXIST";
var CHECKSFILE_DEFAULT = "checks.json";
var restler = require('restler');
var util = require('util');
var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};
function dumbfunction(result)
{
    thing = result;
    resuult = checkHtmlFile(program.file, program.checks, program.url);
    var outJson = JSON.stringify(resuult, null, 4);
    console.log(outJson);
}
var assertURL = function(URL)
{
    return URL;
};
var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile, url) {
    if(url != URL_DEFAULT)
    {
        $ = cheerio.load(thing.toString());
    }
    if(url == URL_DEFAULT)
    {
        $ = cheerioHtmlFile(htmlfile);
    }
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};
function checkHtmlFile1(file, checks, url)
{
    if(url == URL_DEFAULT)
    {
        return checkHtmlFile(program.file, program.checks, program.url);
    }
    else
    {
        restler.request(url, "utf-8").on("complete", dumbfunction);
    }
}
if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-u, --url <url>', 'URL to index.html', clone(assertURL), URL_DEFAULT).parse(process.argv);
    var checkJson = checkHtmlFile1(program.file, program.checks, program.url);
    var outJson = JSON.stringify(checkJson, null, 4);
    if(program.url == URL_DEFAULT)
    {
        console.log(outJson);
    }
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
