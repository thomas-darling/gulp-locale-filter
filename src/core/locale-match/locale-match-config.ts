/**
 * Represents the command configuration.
 */
export interface ILocaleMatchConfig
{
    /**
     * True to filter folders whose name exactly matches locale codes, otherwise false.
     */
    matchLocaleFolders: boolean;

    /**
     * True to filter files whose name exactly matches locale codes, otherwise false.
     */
    matchLocaleFiles: boolean;

    /**
     * True to filter files whose name exactly matches language codes, otherwise false.
     */
    matchLanguageFiles: boolean;

    /**
     * True to filter folders whose name exactly matches language codes, otherwise false.
     */
    matchLanguageFolders: boolean;

    /**
     * True to filter files whose names are postfixed with a '.' followed by a locale code, otherwise false.
     */
    matchLocalePostfixes: boolean;

    /**
     * True to filter files whose names are postfixed with a '.' followed by a language code, otherwise false.
     */
    matchLanguagePostfixes: boolean;

    /**
     * True to only match files and folders if a corresponding base file or folder exist, otherwise false.
     */
    matchOnlyIfBaseNameExists: boolean;

    /**
     * The default name to use, if renaming a file or folder whose name exactly matches the locale.
     * If undefined, those files and folders will not be renamed.
     */
    defaultBaseName?: string;

    /**
     * The list of expected file name extensions. By default, everything after the last '.' is
     * assumed to be the file name extension, but in some cases, such as '.js.map' files, this could lead
     * to incorrect locale or language matches. To avoid this, any such extensions must be listed here.
     */
    fileNameExtensions: string[];

    /**
     * True to enable caching of file system lookups, otherwise false.
     */
    cache: boolean;

    /**
     * True to enable debug logging, otherwise false.
     */
    debug: boolean;
}
