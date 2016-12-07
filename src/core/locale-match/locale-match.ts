import * as util from "gulp-util";
import * as path from "path";
import * as fs from "fs";
import * as chalk from "chalk";

import {ILocaleMatchConfig} from "./locale-match-config";

// Cache containing file stat instances retrieved while checking for path existence.
const pathStatCache = {};

/**
 * Represents the file path of a file that may have a locale postfix in its name,
 * or may be located in a locale folder.
 */
export class LocaleMatch
{
    private _config: ILocaleMatchConfig;
    private _basePath: string;
    private _pathSegments: string[];
    private _pathExtension: string;
    private _matchIndex: number;
    private _matchType: "base"|"exact"|"postfix";
    private _matchCode: string|null;
    private _isBestMatch = false;

    /**
     * Creates a new instance of the LocaleMatch type.
     * @param file The file or folder whose path should be evaluated.
     * @param config The configuration to use.
     * @param localeCode The locale code for which files should be passed through, or undefined to pass through only base files.
     */
    public constructor(file: util.File, config: ILocaleMatchConfig, localeCode?: string)
    {
        this._basePath = file.base;
        this._pathSegments = path.normalize(file.relative).split(path.sep);
        this._config = config;

        const langCode = localeCode ? localeCode.split("-", 1)[0] : undefined;

        // Remove any file name extension from the last path segment.
        if (!file.isDirectory())
        {
            const lastSegment = this._pathSegments.pop() as string;

            for (let ext of config.fileNameExtensions)
            {
                const extStartIndex = lastSegment.length - ext.length;

                if (extStartIndex > 0 && lastSegment.toUpperCase().lastIndexOf(ext.toUpperCase()) === extStartIndex)
                {
                    this._pathExtension = lastSegment.substring(extStartIndex);
                    break;
                }
            }

            if (this._pathExtension == null)
            {
                this._pathExtension = path.extname(lastSegment);
            }

            this._pathSegments.push(path.basename(lastSegment, this._pathExtension));
        }
        else
        {
            this._pathExtension = "";
        }

        if (this._config.debug)
        {
            console.log(`| Path:  ${JSON.stringify(this._pathSegments)}, ${this._pathExtension}\n|`);
        }

        // For each path segment, check whether a better match exists.
        for (let i = 0; i < this._pathSegments.length; i++)
        {
            const segment = this._pathSegments[i];
            const isDirectory = i === this._pathSegments.length - 1 ? file.isDirectory() : true;
            const localeSegmentRegExp = isDirectory ? this._config.localeFoldersRegExp : this._config.localeFilesRegExp;
            const langSegmentRegExp = isDirectory ? this._config.languageFoldersRegExp : this._config.languageFilesRegExp;

            let match: RegExpMatchArray|null;

            // Is the segment an exact default base name match?
            if (localeSegmentRegExp || langSegmentRegExp)
            {
                if (segment === this._config.defaultBaseName)
                {
                    this._matchType = "base";
                    this._matchIndex = i;
                    this._matchCode = null;
                    this._isBestMatch = localeCode == null || (
                        (!localeSegmentRegExp || !this.pathExists(i, localeCode, isDirectory)) &&
                        (!langSegmentRegExp || !this.pathExists(i, langCode as string, isDirectory))
                    );

                    break;
                }
            }

            // Is the segment an exact locale match?
            if (localeSegmentRegExp)
            {
                if (match = segment.match(localeSegmentRegExp))
                {
                    const matchSegment =
                        !this._config.matchOnlyIfBaseNameExists ||
                        (this._config.defaultBaseName != null && this.pathExists(i, this._config.defaultBaseName, isDirectory));

                    if (matchSegment)
                    {
                        this._matchType = "exact";
                        this._matchIndex = i;
                        this._matchCode = match[1];
                        this._isBestMatch = this._matchCode == localeCode;

                        break;
                    }
                }
            }

            // Is the segment an exact language match?
            if (langSegmentRegExp)
            {
                if (match = segment.match(langSegmentRegExp))
                {
                    const matchSegment =
                        !this._config.matchOnlyIfBaseNameExists ||
                        (this._config.defaultBaseName != null && this.pathExists(i, this._config.defaultBaseName, isDirectory));

                    if (matchSegment)
                    {
                        this._matchType = "exact";
                        this._matchIndex = i;
                        this._matchCode = match[1];
                        this._isBestMatch =
                            localeCode != null && this._matchCode === langCode &&
                            (localeCode.length === 2 || !this.pathExists(i, localeCode, isDirectory));

                        break;
                    }
                }
            }

            // Is the segment a locale postfix match?
            if (this._config.localePostfixesRegExp)
            {
                if (match = segment.match(this._config.localePostfixesRegExp))
                {
                    const matchSegment =
                        !this._config.matchOnlyIfBaseNameExists ||
                        this.pathExists(i, segment.substring(0, segment.length - match[0].length), isDirectory);

                    if (matchSegment)
                    {
                        this._matchType = "postfix";
                        this._matchIndex = i;
                        this._matchCode = match[1];
                        this._isBestMatch = this._matchCode === localeCode;

                        break;
                    }
                }
            }

            // Is the segment a language postfix match?
            if (this._config.languagePostfixesRegExp)
            {
                if (match = segment.match(this._config.languagePostfixesRegExp))
                {
                    const matchSegment =
                        !this._config.matchOnlyIfBaseNameExists ||
                        this.pathExists(i, segment.substring(0, segment.length - match[0].length), isDirectory);

                    if (matchSegment)
                    {
                        this._matchType = "postfix";
                        this._matchIndex = i;
                        this._matchCode = match[1];
                        this._isBestMatch =
                            localeCode != null && this._matchCode === langCode &&
                            (localeCode.length === 2 || !this.pathExists(i, `${segment.substring(0, segment.length - 3)}.${localeCode}`, isDirectory));

                        break;
                    }
                }
            }

            // The path contains no locale info, so we hypothesize that this is the best match.
            this._isBestMatch = true;

            if (localeCode != null)
            {
                if (this._config.localePostfixesRegExp && localeCode.length > 2)
                {
                    // Would postfixing the segment with the locale produce a better match?
                    if (this.pathExists(i, `${segment}.${localeCode}`, isDirectory))
                    {
                        this._isBestMatch = false;

                        break;
                    }
                }

                if (this._config.languagePostfixesRegExp)
                {
                    // Would postfixing the segment with the language produce a better match?
                    if (this.pathExists(i, `${segment}.${langCode}`, isDirectory))
                    {
                        this._isBestMatch = false;

                        break;
                    }
                }
            }
        }

        if (this._config.debug)
        {
            console.log(`| Match: ${JSON.stringify({ segment: this._matchIndex, type: this._matchType, code: this._matchCode,  best: this._isBestMatch})}`);
        }
    }

    /**
     * Gets the base path, or null if the path was an exact match and no default base name was configured.
     * @returns The base path, or null.
     */
    public get basePath(): string|null
    {
        if (this._matchType === "base")
        {
            return path.join(this._basePath, ...this._pathSegments) + this._pathExtension;
        }

        if (this._matchType === "exact")
        {
            if (this._config.defaultBaseName == null)
            {
                return null;
            }

            const baseSegment = this._config.defaultBaseName;
            const segments = this._pathSegments.slice();
            segments.splice(this._matchIndex, 1, baseSegment);

            return path.join(this._basePath, ...segments) + this._pathExtension;
        }

        if (this._matchType === "postfix")
        {
            const matchedSegment = this._pathSegments[this._matchIndex];
            const baseSegment = matchedSegment.substring(0, matchedSegment.length - (this._matchCode as string).length - 1);
            const segments = this._pathSegments.slice();
            segments.splice(this._matchIndex, 1, baseSegment);

            return path.join(this._basePath, ...segments) + this._pathExtension;
        }

        return path.join(this._basePath, ...this._pathSegments) + this._pathExtension;
    }

    /**
     * Gets a alue indicating whether this is the best match for the configured locale.
     * @returns True if there are no better matches for the locale, otherwise false.
     */
    public get isBestMatch(): boolean
    {
        return this._isBestMatch;
    }

    /**
     * Determines whether an alternative file or folder path exists.
     * @param segments The number of segments that make up the base path.
     * @param segment The segment to append to the base path.
     * @param isDirectory True if the path is expected to match a directory, false if it is expected to match a file.
     * @returns True if the path exists, otherwise false.
     */
    private pathExists(segments: number, segment: string, isDirectory: boolean): boolean
    {
        try
        {
            let statPath = path.join(this._basePath, ...this._pathSegments.slice(0, segments), segment);

            if (!isDirectory)
            {
                statPath += this._pathExtension;
            }

            if (this._config.debug)
            {
                console.log(`| Check: ${chalk.magenta(statPath)}`);
            }

            const stat = this._config.cache ? pathStatCache[statPath] || (pathStatCache[statPath] = fs.statSync(statPath)) : fs.statSync(statPath);
            const result = stat.isDirectory() === isDirectory;

            if (this._config.debug)
            {
                console.log(`|        ${result ? "found" : "missing"}\n|`);
            }

            return result;
        }
        catch (error)
        {
            if (this._config.debug)
            {
                console.log(`|        missing\n|`);
            }

            return false;
        }
    }
}
