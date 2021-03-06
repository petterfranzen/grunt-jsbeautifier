"use strict";
/*jshint -W079*/
var chai = require("chai"),
    expect = chai.expect,
    ncp = require('ncp').ncp,
    grunt = require("grunt"),
    _ = grunt.util._,
    JsBeautifierTask = require("../lib/jsbeautifier");

/*jshint -W030*/
describe("JsBeautifier: FileMapping test", function() {
    var createMockTask;
    var mockTask;

    createMockTask = function(taskOptions, files, done) {
        return {
            _taskOptions: taskOptions,
            files: [{
                src: grunt.file.expand(files)
            }],
            options: function(defs) {
                return _.defaults(this._taskOptions, defs);
            },
            async: function() {
                return done || function() {};
            }
        };
    };

    beforeEach(function(done) {
        grunt.file.mkdir("tmp/fileMapping");
        ncp("test/fixtures/fileMapping", "tmp/fileMapping", done);
    });

    afterEach(function() {
        mockTask = null;
        grunt.file.delete("tmp");
    });

    function assertBeautifiedFile(actualFile, expectedFile) {
        var actual = grunt.file.read("tmp/fileMapping/" + actualFile),
            expected = grunt.file.read("tmp/fileMapping/" + expectedFile);
        expect(actual, expected, "should beautify js " + actualFile + " using config file");
    }

    it("beautification of js, css & html file using file mapping", function(done) {
        var task;
        mockTask = createMockTask({
            js: {
                fileTypes: [".js.erb"],
                maxPreserveNewlines: 2
            },
            css: {
                fileTypes: [".css.erb"]
            },
            html: {
                fileTypes: [".html.erb"],
                preserveNewLines: true,
                maxPreserveNewlines: 1
            }
        }, ["tmp/fileMapping/not-beautified.js.erb", "tmp/fileMapping/not-beautified.css.erb", "tmp/fileMapping/not-beautified.html.erb"], function() {
            assertBeautifiedFile("not-beautified.js.erb", "expected/beautified.js.erb");
            assertBeautifiedFile("not-beautified.css.erb", "expected/beautified.css.erb");
            assertBeautifiedFile("not-beautified.html.erb", "expected/beautified.html.erb");
            done();
        });

        task = new JsBeautifierTask(mockTask);
        task.run();
    });
});
