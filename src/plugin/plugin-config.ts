import {ILocaleMatchConfig} from "../core/locale-match/locale-match-config";

// Define the name of the plugin.
export const pluginName = "gulp-locale-filter";

/**
 * Represents the command configuration.
 */
export interface IPluginConfig
{
    /**
     * True to filter folders whose name exactly matches locale codes,
     * otherwise false. Alternatively you may specify the RegExp used for
     * matching, which must contain exactly one capture group, capturing
     * the locale code.
     * Default is true.
     */
    matchLocaleFolders?: boolean|RegExp;

    /**
     * True to filter files whose name exactly matches locale codes,
     * otherwise false. Alternatively you may specify the RegExp used for
     * matching, which must contain exactly one capture group, capturing
     * the locale code.
     * Default is true.
     */
    matchLocaleFiles?: boolean|RegExp;

    /**
     * True to filter files whose names are postfixed with a '.' followed
     * by a locale code, otherwise false. Alternatively you may specify the
     * RegExp used for matching, which must contain exactly one capture
     * group, capturing the locale code.
     * Default is true.
     */
    matchLocalePostfixes?: boolean|RegExp;

    /**
     * True to filter folders whose name exactly matches language codes,
     * otherwise false. Alternatively you may specify the RegExp used for
     * matching, which must contain exactly one capture group, capturing
     * the locale code. Note that if a folder matching the full locale
     * also exists, that will take precedence.
     * Default is false.
     */
    matchLanguageFolders?: boolean|RegExp;

    /**
     * True to filter files whose name exactly matches language codes,
     * otherwise false. Alternatively you may specify the RegExp used for
     * matching, which must contain exactly one capture group, capturing
     * the locale code. Note that if a file matching the full locale
     * also exists, that will take precedence.
     * Default is false.
     */
    matchLanguageFiles?: boolean|RegExp;

    /**
     * True to filter files whose names are postfixed with a '.' followed
     * by a language code, otherwise false. Alternatively you may specify
     * the RegExp used for matching, which must contain exactly one capture
     * group, capturing the locale code. Note that if a file or folder
     * matching the full locale also exists, that will take precedence.
     * Default is false.
     */
    matchLanguagePostfixes?: boolean|RegExp;

    /**
     * True to only match files and folders if a corresponding base file or
     * folder exist, otherwise false. Note that if enabled, locale files and
     * folders will only be matched if a default base name is specified.
     * Default is false.
     */
    matchOnlyIfBaseNameExists?: boolean;

    /**
     * The base name to look for when matching files and folders whose name
     * exactly matches a locale or language code, with the requirement that
     * the base name must also exist, or when renaming such files and folders
     * to their base name.
     * Default is undefined, meaning that such files and folders will not be
     * renamed, and if the base name must
     * exist, not matched.
     */
    defaultBaseName?: string;

    /**
     * The list of expected file name extensions. By default, everything
     * after the last '.' is assumed to be the file name extension, but in
     * some cases, such as '.js.map' files, this could lead to incorrect
     * locale or language matches. To avoid this, any such extensions must
     * be listed here.
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

/**
 * Represents the command configuration.
 */
export class PluginConfig implements ILocaleMatchConfig
{
    /**
     * Creates a new instance of the PluginConfig type.
     * @param config The config object from which the instance should be created.
     */
    public constructor(config?: IPluginConfig)
    {
        if (config == null)
            return;

        if (config.matchLocaleFolders !== true)
            this.localeFoldersRegExp = config.matchLocaleFolders || undefined;

        if (config.matchLocaleFiles !== true)
            this.localeFilesRegExp = config.matchLocaleFiles || undefined;

        if (config.matchLocalePostfixes !== true)
            this.localePostfixesRegExp = config.matchLocalePostfixes || undefined;

        if (config.matchLanguageFolders !== true)
            this.languageFoldersRegExp = config.matchLanguageFolders || undefined;

        if (config.matchLanguageFiles !== true)
            this.languageFilesRegExp = config.matchLanguageFiles || undefined;

        if (config.matchLanguagePostfixes !== true)
            this.languagePostfixesRegExp = config.matchLanguagePostfixes || undefined;

        if (config.matchOnlyIfBaseNameExists!= null)
            this.matchOnlyIfBaseNameExists = config.matchOnlyIfBaseNameExists;

        if (config.defaultBaseName != null)
            this.defaultBaseName = config.defaultBaseName;

        if (config.fileNameExtensions != null)
            this.fileNameExtensions = config.fileNameExtensions;

        if (config.cache != null)
            this.cache = config.cache;

        if (config.debug != null)
            this.debug = config.debug;
    }

    /**
     * The RegExp used when matching folders whose name exactly matches
     * locale codes, or undefined to not match.
     */
    public localeFoldersRegExp?: RegExp = /^([a-z]{2}(?:-[a-zA-Z]{4})?-[a-zA-Z]{2})$/;

    /**
     * The RegExp used when matching files whose name exactly matches
     * locale codes, or undefined to not match.
     */
    public localeFilesRegExp?: RegExp = /^([a-z]{2}(?:-[a-zA-Z]{4})?-[a-zA-Z]{2})$/;

    /**
     * The RegExp used when matching files whose names are postfixed with
     * a locale code, or undefined to not match.
     */
    public localePostfixesRegExp?: RegExp = /\.([a-z]{2}(?:-[a-zA-Z]{4})?-[a-zA-Z]{2})$/;

    /**
     * The RegExp used when matching folders whose name exactly matches
     * language codes, or undefined to not match. Note that if a folder
     * matching the full locale also exists, that will take precedence.
     */
    public languageFoldersRegExp?: RegExp = /^([a-z]{2})$/;

    /**
     * The RegExp used when matching files whose name exactly matches
     * language codes, or undefined to not match. Note that if a file
     * matching the full locale also exists, that will take precedence.
     */
    public languageFilesRegExp?: RegExp = /^([a-z]{2})$/;

    /**
     * The RegExp used when matching files whose names are postfixed with a
     * language code, or undefined to not match. Note that if a file or folder
     * matching the full locale also exists, that will take precedence.
     */
    public languagePostfixesRegExp?: RegExp = /\.([a-z]{2})$/;

    /**
     * True to only match files and folders if a corresponding base file or
     * folder exist, otherwise false. Note that if enabled, locale files and
     * folders will only be matched if a default base name is specified.
     */
    public matchOnlyIfBaseNameExists: boolean = false;

    /**
     * The base name to look for when matching files and folders whose name
     * exactly matches a locale or language code, with the requirement that
     * the base name must also exist, or when renaming such files and folders
     * to their base name.
     * If undefined, such files and folders will not be renamed, and if the
     * base name must exist, not matched.
     */
    public defaultBaseName?: string;

    /**
     * The list of expected file name extensions. By default, everything
     * after the last '.' is assumed to be the file name extension, but in
     * some cases, such as '.js.map' files, this could lead to incorrect
     * locale or language matches. To avoid this, any such extensions must
     * be listed here.
     */
    public fileNameExtensions: string[] = [];

    /**
     * True to enable caching of file system lookups, otherwise false.
     */
    public cache: boolean = true;

    /**
     * True to enable debug logging, otherwise false.
     */
    public debug: boolean = false;
}
