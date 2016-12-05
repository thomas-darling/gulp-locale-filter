import {ILocaleMatchConfig} from "../core/locale-match/locale-match-config";

// Define the name of the plugin.
export const pluginName = "gulp-locale-filter";

/**
 * Represents the command configuration.
 */
export interface IPluginConfig
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

/**
 * Represents the command configuration.
 */
export class PluginConfig implements ILocaleMatchConfig
{
    /**
     * Creates a new instance of the FilterCommandConfig type.
     * @param config The config object from which the instance should be created.
     */
    public constructor(config?: IPluginConfig)
    {
        if (config == null)
            return;

        if (config.matchLocaleFolders != null)
            this.matchLocaleFolders = config.matchLocaleFolders;

        if (config.matchLocaleFiles != null)
            this.matchLocaleFiles = config.matchLocaleFiles;

        if (config.matchLocalePostfixes != null)
            this.matchLocalePostfixes = config.matchLocalePostfixes;

        if (config.matchLanguageFolders != null)
            this.matchLanguageFolders = config.matchLanguageFolders;

        if (config.matchLanguageFiles != null)
            this.matchLanguageFiles = config.matchLanguageFiles;

        if (config.matchLanguagePostfixes!= null)
            this.matchLanguagePostfixes = config.matchLanguagePostfixes;

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
     * True to filter folders whose name exactly matches locale codes, otherwise false.
     * Default is true.
     */
    public matchLocaleFolders: boolean = true;

    /**
     * True to filter files whose name exactly matches locale codes, otherwise false.
     * Default is true.
     */
    public matchLocaleFiles: boolean = true;

    /**
     * True to filter files whose names are postfixed with a '.' followed by a locale code, otherwise false.
     * Default is true.
     */
    public matchLocalePostfixes: boolean = true;

    /**
     * True to filter folders whose name exactly matches language codes, otherwise false.
     * Note that if a folder matching the full locale also exists, that will take precedence.
     * Default is false.
     */
    public matchLanguageFolders: boolean = false;

    /**
     * True to filter files whose name exactly matches language codes, otherwise false.
     * Note that if a file matching the full locale also exists, that will take precedence.
     * Default is false.
     */
    public matchLanguageFiles: boolean = false;

    /**
     * True to filter files whose names are postfixed with a '.' followed by a language code, otherwise false.
     * Note that if a file or folder matching the full locale also exists, that will take precedence.
     * Default is false.
     */
    public matchLanguagePostfixes: boolean = false;

    /**
     * True to only match files and folders if a corresponding base file or folder exist, otherwise false.
     * Note that if enabled, locale files and folders will only be matched if a default base name is specified.
     * Default is false.
     */
    public matchOnlyIfBaseNameExists: boolean = false;

    /**
     * The base name to look for when matching locale or language files and folders, with the requirement that
     * the base name must also exist, or when renaming such files and folders to their base name.
     * Default is undefined, meaning that such files and folders will not be renamed, and if the base name must
     * exist, not matched.
     */
    public defaultBaseName?: string;

    /**
     * The list of expected file name extensions. By default, everything after the last '.' is
     * assumed to be the file name extension, but in some cases, such as '.js.map' files, this could lead
     * to incorrect locale or language matches. To avoid this, any such extensions must be listed here.
     * Default is [].
     */
    public fileNameExtensions: string[] = [];

    /**
     * True to enable caching of file system lookups, otherwise false.
     * Default is true.
     */
    public cache: boolean = true;

    /**
     * True to enable debug logging, otherwise false.
     * Default is false.
     */
    public debug: boolean = false;
}
