/**
 * Represents the command configuration.
 */
export interface ILocaleMatchConfig
{
    /**
     * The RegExp used when matching folders whose name exactly matches
     * locale codes, or undefined to not match.
     */
    localeFoldersRegExp?: RegExp;

    /**
     * The RegExp used when matching files whose name exactly matches
     * locale codes, or undefined to not match.
     */
    localeFilesRegExp?: RegExp;

    /**
     * The RegExp used when matching files whose names are postfixed with
     * a locale code, or undefined to not match.
     */
    localePostfixesRegExp?: RegExp;

    /**
     * The RegExp used when matching folders whose name exactly matches
     * language codes, or undefined to not match. Note that if a folder
     * matching the full locale also exists, that will take precedence.
     */
    languageFoldersRegExp?: RegExp;

    /**
     * The RegExp used when matching files whose name exactly matches
     * language codes, or undefined to not match. Note that if a file
     * matching the full locale also exists, that will take precedence.
     */
    languageFilesRegExp?: RegExp;

    /**
     * The RegExp used when matching files whose names are postfixed with a
     * language code, or undefined to not match. Note that if a file or folder
     * matching the full locale also exists, that will take precedence.
     */
    languagePostfixesRegExp?: RegExp;

    /**
     * True to only match files and folders if a corresponding base file or
     * folder exist, otherwise false. Note that if enabled, locale files and
     * folders will only be matched if a default base name is specified.
     */
    matchOnlyIfBaseNameExists: boolean;

    /**
     * The base name to look for when matching files and folders whose name
     * exactly matches a locale or language code, with the requirement that
     * the base name must also exist, or when renaming such files and folders
     * to their base name.
     * If undefined, such files and folders will not be renamed, and if the
     * base name must exist, not matched.
     */
    defaultBaseName?: string;

    /**
     * The list of expected file name extensions. By default, everything
     * after the last '.' is assumed to be the file name extension, but in
     * some cases, such as '.js.map' files, this could lead to incorrect
     * locale or language matches. To avoid this, any such extensions must
     * be listed here.
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
