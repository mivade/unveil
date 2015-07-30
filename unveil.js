#!/usr/bin/env node

var fs = require('fs'),
    http = require('http'),
    program = require('commander'),
    md = require('reveal.js/plugin/markdown/markdown'),
    express = require('express'),
    Handlebars = require('handlebars');

var options = {
    port: 8999,
    markdown: {
        separator: '^(\r\n?|\n)---(\r\n?|\n)$',
        verticalSeparator: '^(\r\n?|\n)----(\r\n?|\n)$'
    }
};

/** 
 * Process a Markdown file 
 * @param {string} filename - Markdown file to process
 */
function processMarkdown(filename) {
    console.log('Generating slides from ' + filename + '...');
    var template = Handlebars.compile(fs.readFileSync('template.html').toString());
    var slides = md.slidify(
        fs.readFileSync(filename).toString(), options.markdown);
    return template({
        title: 'Unveil',
        description: 'Slides',
        author: 'John Doe',
        slides: new Handlebars.SafeString(slides)
    });
}

/**
 * Serve the presentation from a Markdown file so that edits can be
 * made.
 * @param {string} filename - Markdown file to process
 */
function servePresentation(filename) {
    var app = express();

    app.get('/', function (req, res) {
        res.send(processMarkdown(filename));
    });
    
    console.log('Serving on http://localhost:' + parseInt(options.port) + '...');
    app.use('/js', express.static('node_modules/reveal.js/js'));
    app.use('/css', express.static('node_modules/reveal.js/css'));
    app.use('/lib', express.static('node_modules/reveal.js/lib'));
    app.use('/plugin', express.static('node_modules/reveal.js/plugin'));
    app.listen(options.port);
}

/**
 * Export the presentation.
 * @param {string} filename - Markdown file to process
 * @param {string} path - Directory to export slides and associated files to
 */
function exportPresentation(filename, path) {
    console.log(filename);
    console.log(path);
    var slides = processMarkdown(filename);
}

program.version('0.1.0');
program
    .command('serve <filename>')
    .description('Serve the given filename')
    .action(function (filename) {
        servePresentation(filename);
    });
program
    .command('export <path>')
    .description('Export the full presentation to the specified path')
    .option('-f <filename>', 'Markdown file to process', 'slides.md')
    .action(function (filename, path) {
        exportPresentation(filename);
    });
program.parse(process.argv);
