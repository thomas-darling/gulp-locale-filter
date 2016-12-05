
/* How to run this example:
 * --------------------------------------------------------------------------------------------------------------------
 * 1. Open a command prompt in this folder.
 * 2. Execute the command: gulp --locale en-us
 *
 * This will execute all the tasks in the correct order, producing output in the 'artifacts' folder.
 * You may optionally specify '--debug' to enable logging, or other locales, to see how they affect the output.
 * --------------------------------------------------------------------------------------------------------------------
 */

var gulp = require("gulp");
var util = require("gulp-util");
var rename = require("gulp-rename");
var del = require("del");
var localeFilter = require("../lib/index");

// The configuration for the 'filter-locale' plugin.
var pluginConfig =
{
    /**
     * True to filter folders whose name exactly matches locale codes, otherwise false.
     * Default is true.
     */
    matchLocaleFolders: true,

    /**
     * True to filter files whose name exactly matches locale codes, otherwise false.
     * Default is true.
     */
    matchLocaleFiles: true,

    /**
     * True to filter files whose name exactly matches language codes, otherwise false.
     * Default is false.
     */
    matchLanguageFiles: true,

    /**
     * True to filter folders whose name exactly matches language codes, otherwise false.
     * Default is false.
     */
    matchLanguageFolders: true,

    /**
     * True to filter files whose names are postfixed with a '.' followed by a language code, otherwise false.
     * Default is true.
     */
    matchLanguagePostfixes: true,

    /**
     * True to filter files whose names are postfixed with a '.' followed by a locale code, otherwise false.
     * Default is true.
     */
    matchLocalePostfixes: true,

    /**
     * True to only match files and folders if a corresponding base file or folder exist, otherwise false.
     * Default is false.
     */
    matchOnlyIfBaseNameExists: true,

    /**
     * The default base name to use, if renaming a file or folder whose name exactly matches the locale.
     * Default is undefined, meaning that those files and folders will not be renamed.
     */
    defaultBaseName: "locale",

    /**
     * The list of additional, expected file name extensions. By default, everything after the last '.' is assumed to be
     * the file name extension, but in some cases, such as '.js.map' files, this would lead to incorrect locale or
     * language matches. To avoid this, any such extensions must be listed here.
     */
    fileNameExtensions: [".js.map"],

    /**
     * True to enable caching of file system lookups, otherwise false.
     * Default is true.
     */
    cache: true,

    /**
     * True to enable debug logging, otherwise false.
     * Default is false.
     */
    debug: util.env.debug != null
};

/**
 * Gulp task for cleaning the artifacts folder.
 */
gulp.task("clean", function ()
{
    // Delete the artifacts.
    return del("./artifacts/*");
});

/**
 * Gulp task that simulates a normal build, producing build artifacts.
 */
gulp.task("build", function ()
{
    return gulp

        // Get the source files.
        .src("./source/**")

        // TODO: This is where you would transpile files, etc.

        // Write the file to the build folder..
        .pipe(gulp.dest("./artifacts/build"));
});

/**
 * Gulp task that localizes the build artifacts into a locale specific build.
 */
gulp.task("localize", function ()
{
    var targetLocaleCode = util.env.locale;

    return gulp

        // Get the build artifacts.
        .src("./artifacts/build/**")

        // Filter the stream to include only the files relevant for the target locale.
        .pipe(localeFilter(pluginConfig).filter(
        {
            localeCode: targetLocaleCode,
            renameToBaseName: true
            // See 'readme.md' for more options.
        }))

        // Write the destination file to the locale-specific artifacts folder.
        .pipe(gulp.dest("./artifacts/localize/" + targetLocaleCode));
});

/**
 * Runs all the tasks, in sequence.
 */
gulp.task("default", gulp.series("clean", "build", "localize"));