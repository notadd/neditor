"use strict";

module.exports = function (grunt) {
    var fs = require("fs"),
        Util = {
            jsBasePath: "_src/",
            parseBasePath: "_parse/",
            cssBasePath: "themes/notadd/_css/",

            fetchScripts: function (readFile, basePath) {
                var sources = fs.readFileSync(readFile);
                sources = /\[([^\]]+\.js'[^\]]+)\]/.exec(sources);
                sources = sources[1]
                    .replace(/\/\/.*\n/g, "\n")
                    .replace(/'|"|\n|\t|\s/g, "");
                sources = sources.split(",");
                sources.forEach(function (filepath, index) {
                    sources[index] = basePath + filepath;
                });

                return sources;
            },

            fetchStyles: function () {
                var sources = fs.readFileSync(this.cssBasePath + "neditor.css"),
                    filepath = null,
                    pattern = /@import\s+([^;]+)*;/g,
                    src = [];

                while ((filepath = pattern.exec(sources))) {
                    src.push(this.cssBasePath + filepath[1].replace(/'|"/g, ""));
                }

                return src;
            }
        },
        packageJson = {
            name: "neditor",
            version: grunt.file.readJSON("package.json").version
        },
        encode = grunt.option("encode") || "utf8",
        disDir = "dist/",
        banner =
        "/*!\n * " +
        packageJson.name +
        "\n * version: " +
        packageJson.version +
        "\n * build: <%= new Date() %>\n */\n\n";

    //init
    (function () {
        encode = typeof encode === "string" ? encode.toLowerCase() : "utf8";
        disDir = "dist/";
    })();

    grunt.initConfig({
        pkg: packageJson,
        concat: {
            js: {
                options: {
                    banner: "/*!\n * " +
                        packageJson.name +
                        "\n * version: " +
                        packageJson.version +
                        "\n * build: <%= new Date() %>\n */\n\n" +
                        "(function(){\n\n",
                    footer: "\n\n})();\n",
                    process: function (src, s) {
                        var filename = s.substr(s.indexOf("/") + 1);
                        return (
                            "// " + filename + "\n" + src.replace("/_css/", "/css/") + "\n"
                        );
                    }
                },
                src: Util.fetchScripts("_examples/editor_api.js", Util.jsBasePath),
                dest: disDir + packageJson.name + ".all.js"
            },
            parse: {
                options: {
                    banner: "/*!\n * " +
                        packageJson.name +
                        " parse\n * version: " +
                        packageJson.version +
                        "\n * build: <%= new Date() %>\n */\n\n" +
                        "(function(){\n\n",
                    footer: "\n\n})();\n"
                },
                src: Util.fetchScripts("neditor.parse.js", Util.parseBasePath),
                dest: disDir + packageJson.name + ".parse.js"
            },
            css: {
                src: Util.fetchStyles(),
                dest: disDir + "themes/notadd/css/neditor.css"
            }
        },
        cssmin: {
            options: {
                banner: banner
            },
            files: {
                expand: true,
                cwd: disDir + "themes/notadd/css/",
                src: ["*.css", "!*.min.css"],
                dest: disDir + "themes/notadd/css/",
                ext: ".min.css"
            }
        },
        uglify: {
            dist: {
                options: {
                    banner: "/*!\n * " +
                        packageJson.name +
                        "\n * version: " +
                        packageJson.version +
                        "\n * build: <%= new Date() %>\n */"
                },
                src: disDir + "<%= pkg.name %>.all.js",
                dest: disDir + "<%= pkg.name %>.all.min.js"
            },
            parse: {
                options: {
                    banner: "/*!\n * " +
                        packageJson.name +
                        " parse\n * version: " +
                        packageJson.version +
                        "\n * build: <%= new Date() %>\n */"
                },
                src: disDir + "<%= pkg.name %>.parse.js",
                dest: disDir + "<%= pkg.name %>.parse.min.js"
            }
        },
        copy: {
            base: {
                files: [{
                    src: [
                        "*.html",
                        "themes/iframe.css",
                        "themes/notadd/dialogbase.css",
                        "themes/notadd/images/**",
                        "themes/notadd/fonts/**",
			"themes/ueditor-list/**",
                        "dialogs/**",
                        "i18n/**",
                        "third-party/**",
                        "README.md",
                        "package.json"
                    ],
                    dest: disDir
                }]
            },
            demo: {
                files: [{
                    src: "_examples/completeDemo.html",
                    dest: disDir + "index.html"
                }]
            }
        },
        transcoding: {
            options: {
                charset: encode
            },
            src: [
                disDir + "**/*.html",
                disDir + "**/*.js",
                disDir + "**/*.css",
                disDir + "**/*.json"
            ]
        },
        replace: {
            fileEncode: {
                src: [
                    disDir + "**/*.html",
                    disDir + "dialogs/**/*.js",
                    disDir + "**/*.css"
                ],
                overwrite: true,
                replacements: [{
                    from: /utf-8/gi,
                    to: "gbk"
                }]
            },
            demo: {
                src: disDir + "index.html",
                overwrite: true,
                replacements: [{
                        from: /\.\.\//gi,
                        to: ""
                    },
                    {
                        from: "editor_api.js",
                        to: packageJson.name + ".all.min.js"
                    }
                ]
            }
        },
        clean: {
            build: {
                src: [
                    disDir + "*/upload",
                    disDir + ".DS_Store",
                    disDir + "**/.DS_Store",
                    disDir + ".git",
                    disDir + "**/.git"
                ]
            }
        }
    });

    grunt.loadNpmTasks("grunt-text-replace");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-transcoding");
    grunt.loadNpmTasks("grunt-contrib-clean");

    grunt.registerTask("neditor", "UEditor build", function () {
        var tasks = [
            "concat",
            "cssmin",
            "uglify",
            "copy:base",
            "copy:demo",
            "replace:demo",
            "clean"
        ];

        if (encode === "gbk") {
            tasks.push("replace:fileEncode");
        }

        tasks.push("transcoding");

        //config修改
        updateConfigFile();

        //service
        updateServiceFile();

        grunt.task.run(tasks);
    });

    function updateConfigFile() {
        var filename = "neditor.config.js",
            file = grunt.file.read(filename);

            if (encode == "gbk") {
                file = file.replace(/utf-8/gi, "gbk");
            }

        //写入到dist
        if (grunt.file.write(disDir + filename, file)) {
            grunt.log.writeln("config file update success");
        } else {
            grunt.log.warn("config file update error");
        }
    }

    function updateServiceFile() {
        var filename = "neditor.service.js",
            file = grunt.file.read(filename);

            if (encode == "gbk") {
                file = file.replace(/utf-8/gi, "gbk");
            }

        //写入到dist
        if (grunt.file.write(disDir + filename, file)) {
            grunt.log.writeln("config file update success");
        } else {
            grunt.log.warn("config file update error");
        }
    }
};
