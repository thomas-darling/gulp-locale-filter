gulp-locale-filter
===============
Gulp plugin that filters the files in the stream based on a locale code or language code in the file or folder name,
optionally renaming the files to their base name, without the code. Use this to e.g. localize the output of a build
process, by filtering to only the files that are relevant for target locale.

When identifying the locale of a file, the plugin evaluates each segment in the relative file path, stopping when it
finds the first segment, if any, that represents, or is postfixed with, a language or locale code. This means, that
given a file path such as `./foo/en-us/da-dk.html`, the locale would be identified as `en-us`. If the file path
contains no locale info, the file is considered a _base_ file, and is only passed through if there exist no file
variants matching the target locale. If both a matching language and locale variant is found, the locale variant
will take precendence. Note that this plugin does not replace files in the stream - it simply filters the files that
pass through, such that only the best matches are let through, and optionally renamed.

Locale codes are expected to be in the [IEFT language tag](https://en.wikipedia.org/wiki/IETF_language_tag) format,
and must be composed of a single primary 2-letter language subtag, an optional 4-letter script subtag, and a 2-letter
region subtag. Language codes are expected to be a 2-letters. Note that the matching is case-sensitive, meaning that
the casing of the specified target locale code must be the same as the casing of locale codes in the file paths.

You may also want to look at the plugins:

* `gulp-translate` for extracting and injecting localizable content in HTML templates.
* `gulp-replace` for replacing text content in files, for example by replacing `{{locale}}` in templates and CSS
  files with the actual target locale code.

## Examples

Assume we have the following Gulp task for localizing the contents of a folder:

```javascript
var targetLocaleCode = "da-dk";

var pluginConfig = { };

gulp.task("localize", function ()
{
    return gulp
        .src("./sources/**")
        .pipe(localeFilter(pluginConfig).filter({
            localeCode: targetLocaleCode,
            renameToBaseName: false
        }))
        .pipe(gulp.dest("./artifacts/" + targetLocaleCode));
});
```

### Files or folders with a locale postfix

Given a `sources` folder containing the files:
```
foo.html
bar.html
bar.en-us.html
bar.da-dk.html
```

The `artifacts/da-dk` folder would, after running the task, contain only the files:
```
foo.html
bar.da-dk.html
```

Or, if the `renameToBaseName` plugin option is enabled:
```
foo.html
bar.html // this is actually 'bar.da-dk.html', just renamed to its base name
```

### Locale folders

Given a `sources` folder containing locale-specific subfolders:
```
foo
    foo.html
da-dk
    bar.html
en-us
    bar.html
```

The `artifacts/da-dk` folder would, after running the task, contain only the files:
```
foo
    foo.html
da-dk
    bar.html
```

Or, if the `renameToBaseName` plugin option is enabled and `defaultBaseName` is set to "locale":
```
foo
    foo.html
locale // this is actually 'da-dk', just renamed to its default base name
    bar.html
```

### Locale files

Given a `sources` folder containing locale-specific files:
```
foo.html
da-dk.html
en-us.html
```

The `artifacts/da-dk` folder would, after running the task, contain only the files:
```
foo.html
da-dk.html
```

Or, if the `renameToBaseName` option is enabled and `defaultBaseName` is set to `locale`:
```
foo.html
locale.html // this is actually 'da-dk.html', just renamed to its default base name
```

### More options

This plugin can support more scenarios than the above examples, including e.g. filtering based on language codes.
Please review, and carefully consider the implications of, the available configuration options and default values.

## How to use

```
npm install gulp-locale-filter --save-dev
```

```javascript
// Import the plugin:
var localeFilter = require("gulp-locale-filter");

// Define the plugin configuration:
var pluginConfig = { };

// Use the command provided by the plugin in your gulp task:
.pipe(localeFilter(pluginConfig).filter(filterConfig))

```

## Plugin config

The following is the interface for the plugin config object, that may optionally be passed to the plugin function.

```typescript
interface IPluginConfig
{
    /**
     * True to filter folders whose name exactly matches locale codes, otherwise false.
     * Default is true.
     */
    matchLocaleFolders?: boolean;

    /**
     * True to filter files whose name exactly matches locale codes, otherwise false.
     * Default is true.
     */
    matchLocaleFiles?: boolean;

    /**
     * True to filter files whose names are postfixed with a '.' followed by a locale code, otherwise false.
     * Default is true.
     */
    matchLocalePostfixes?: boolean;

    /**
     * True to filter folders whose name exactly matches language codes, otherwise false.
     * Note that if a folder matching the full locale also exists, that will take precedence.
     * Default is false.
     */
    matchLanguageFolders?: boolean;

    /**
     * True to filter files whose name exactly matches language codes, otherwise false.
     * Note that if a file matching the full locale also exists, that will take precedence.
     * Default is false.
     */
    matchLanguageFiles?: boolean;

    /**
     * True to filter files whose names are postfixed with a '.' followed by a language code, otherwise false.
     * Note that if a file or folder matching the full locale also exists, that will take precedence.
     * Default is false.
     */
    matchLanguagePostfixes?: boolean;

    /**
     * True to only match files and folders if a corresponding base file or folder exist, otherwise false.
     * Note that if enabled, locale files and folders will only be matched if a default base name is specified.
     * Default is false.
     */
    matchOnlyIfBaseNameExists?: boolean;

    /**
     * The base name to look for when matching locale or language files and folders, with the requirement that
     * the base name must also exist, or when renaming such files and folders to their base name.
     * Default is undefined, meaning that such files and folders will not be renamed, and if the base name must
     * exist, not matched.
     */
    defaultBaseName?: string;

    /**
     * The list of expected file name extensions. By default, everything after the last '.' is
     * assumed to be the file name extension, but in some cases, such as '.js.map' files, this could lead
     * to incorrect locale or language matches. To avoid this, any such extensions must be listed here.
     * Default is [].
     */
    fileNameExtensions?: string[];

    /**
     * True to enable caching of file system lookups, otherwise false.
     * Default is true.
     */
    cache?: boolean;

    /**
     * True to enable debug logging, otherwise false.
     * Default is false.
     */
    debug?: boolean;
}
```

## The `export` command

Example:

```javascript

// The locale for which the source files should be localized.
var targetLocaleCode = "da-dk";

/**
 * Gulp task that localizes the build artifacts into locale specific builds.
 */
gulp.task("localize", function ()
{
    return gulp

        // Get the source files.
        .src("./sources/**")

        // Filter the stream to include only the files relevant for the configured locale.
        .pipe(localeFilter(pluginConfig).filter(
        {
            localeCode: targetLocaleCode,
            renameToBaseName: true
        }))

        // Write the destination file to the localized artifacts folder.
        .pipe(gulp.dest("./artifacts/" + targetLocaleCode));
});
```

Interface for the command config object, that may optionally be passed to the `filter` function.

```typescript
interface IFilterCommandConfig
{
    /**
     * The locale code for which files should be passed through, or undefined to pass through only base files.
     * Default is undefined.
     */
    localeCode?: string;

    /**
     * True to rename the files that are passed through to their base name, otherwise false.
     * Default is false.
     */
    renameToBaseName?: boolean;
}
```

Enjoy, and please report any issues in the issue tracker :-)