"use strict";
/*jshint -W079*/
var chai = require("chai"),
    expect = chai.expect,
    ncp = require('ncp').ncp,
    grunt = require("grunt"),
    _ = grunt.util._,
    JsBeautifierTask = require("../lib/jsbeautifier");

/*jshint -W030*/
describe("JsBeautifier: Config file test", function() {
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
        grunt.file.mkdir("tmp/configFile");
        ncp("test/fixtures/configFile", "tmp/configFile", done);
    });

    afterEach(function() {
        mockTask = null;
        grunt.file.delete("tmp");
    });

    function assertBeautifiedFile(actualFile, expectedFile) {
        var actual = grunt.file.read("tmp/configFile/" + actualFile),
            expected = grunt.file.read("tmp/configFile/" + expectedFile);
        expect(actual, expected, "should beautify js " + actualFile + " using config file");
    }

    it("beautification of js, css & html file using settings from config file", function(done) {
        var task;
        mockTask = createMockTask({
            config: "tmp/configFile/jsbeautifyrc.json"
        }, ["tmp/configFile/test.js", "tmp/configFile/test.css", "tmp/configFile/test.html"], function() {
            assertBeautifiedFile("test.js", "expected/test_expected.js");
            assertBeautifiedFile("test.css", "expected/test_expected.css");
            assertBeautifiedFile("test.html", "expected/test_expected.html");
            done();
        });

        task = new JsBeautifierTask(mockTask);
        task.run();
    });

    it("beautification of js, css & html file using settings from flat config file", function(done) {
        var task;
        mockTask = createMockTask({
            config: "tmp/configFile/jsbeautifyrc_flat.json"
        }, ["tmp/configFile/test.js", "tmp/configFile/test.css", "tmp/configFile/test.html"], function() {
            assertBeautifiedFile("test.js", "expected/test_expected.js");
            assertBeautifiedFile("test.css", "expected/test_expected.css");
            assertBeautifiedFile("test.html", "expected/test_expected.html");
            done();
        });

        task = new JsBeautifierTask(mockTask);
        task.run();
    });

    it("beautification of js, css & html file using settings from config file and gruntfile", function(done) {
        var task;
        mockTask = createMockTask({
            config: "tmp/configFile/jsbeautifyrc_flat.json",
            js: {
                indentSize: 3
            },
            css: {
                indentSize: 5
            },
            html: {
                indentSize: 7
            }
        }, ["tmp/configFile/test.js", "tmp/configFile/test.css", "tmp/configFile/test.html"], function() {
            assertBeautifiedFile("test.js", "expected/withGruntFileOptions/test_expected.js");
            assertBeautifiedFile("test.css", "expected/withGruntFileOptions/test_expected.css");
            assertBeautifiedFile("test.html", "expected/withGruntFileOptions/test_expected.html");
            done();
        });

        task = new JsBeautifierTask(mockTask);
        task.run();
    });
});
