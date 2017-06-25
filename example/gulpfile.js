
/* How to run this example:
 * --------------------------------------------------------------------------------------------------------------------
 * 1. Open a command prompt in this folder.
 * 2. Execute the command: gulp --locale en-us
 *
 * This will execute all the tasks in the correct order, producing output in the 'artifacts' folder.
 * You can try specifying another locale, to see how that affects the output.
 * You may optionally specify '--debug' to enable debug logging.
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
    matchLocaleFolders: true,
    matchLocaleFiles: true,
    matchLanguageFiles: true,
    matchLanguageFolders: true,
    matchLanguagePostfixes: true,
    matchLocalePostfixes: true,
    matchOnlyIfBaseNameExists: true,
    defaultBaseName: "locale",
    fileNameExtensions: [".js.map", ".css.map"],
    debug: util.env.debug != null
    // See 'readme.md' for more options.
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
