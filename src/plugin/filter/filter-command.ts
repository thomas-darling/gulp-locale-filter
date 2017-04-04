import * as util from "gulp-util";
import * as path from "path";
import * as fs from "fs";
import * as through from "through2";
import * as chalk from "chalk";

import {LocaleMatch} from "../../core/locale-match/locale-match";

import {PluginConfig, pluginName} from "../plugin-config";
import {FilterCommandConfig} from "./filter-command-config";

const mapFileCommentRegex = /(?:(\/\/[@#][ \t]+sourceMappingURL=\/?)([^\s'"]+?)([ \t]*)$)|(?:(\/\*[@#][ \t]+sourceMappingURL=\/?)([^\*]+?)([ \t]*\*\/[ \t]*)$)/gm;

/**
 * Represents the command.
 */
export class FilterCommand
{
    private _config: PluginConfig;

    /**
     * Creates a new instance of the FilterCommand type.
     * @param config The plugin configuration to use.
     */
    public constructor(config: PluginConfig)
    {
        this._config = config;
    }

    /**
     * Creates the stream transform.
     * @param config The command configuration to use.
     * @returns The stream transform.
     */
    public create(config: FilterCommandConfig): NodeJS.ReadWriteStream
    {
        const renamedFilePaths: string[] = [];

        const _this = this;

        // Return the stream transform.
        return through.obj(function (file: util.File, encoding: string, callback: (err?: any, data?: any) => void)
        {
            let relativeFilePath = `./${path.relative(process.cwd(), file.path).replace(/\\/g, "/")}`;

            try
            {
                // Drop null-files from the stream, as they would otherwise cause empty directories to be created.
                if (file.isNull())
                {
                    // Notify stream engine that we are done with this file.
                    callback();
                    return;
                }

                if (_this._config.debug)
                {
                    console.log(`\nPROCESS: ${chalk.magenta(file.path)}\n|`);
                }

                // Create the locale file path instance needed for inspecting and renaming the current file path.
                const localeMatch = new LocaleMatch(file, _this._config, config.localeCode);

                if (_this._config.debug)
                {
                    console.log("|");
                }

                // Only keep the file in the stream if it is the best match.
                if (localeMatch.isBestMatch)
                {
                    // If requested, rename the file to its base name.
                    if (config.renameToBaseName)
                    {
                        const basePath = localeMatch.basePath;

                        if (basePath != null)
                        {
                            if (_this._config.debug && file.path !== basePath)
                            {
                                console.log(`${chalk.green("RENAME:")}  ${chalk.magenta(basePath)}`);
                            }

                            const fileNameExt = path.extname(file.path).toLowerCase();

                            // If the file contains a 'sourceMappingURL' comment, update it to reference the renamed map file.
                            if (fileNameExt === ".js" || fileNameExt === ".css")
                            {
                                // Don't support streams.
                                if (file.isStream())
                                {
                                    throw new Error("This plugin command does not support streams.");
                                }

                                // Process the buffer contents.
                                if (file.isBuffer())
                                {
                                    let contents = file.contents.toString();

                                    contents = contents.replace(mapFileCommentRegex, (match, ...groups) =>
                                    {
                                        const offset = groups[0] != null ? 0 : 3;

                                        if (groups[offset + 1] === `${path.basename(file.path)}.map`)
                                        {
                                            return groups[offset] + `${path.basename(basePath)}.map` + groups[offset + 2];
                                        }

                                        return match;
                                    });

                                    // Write the localized input file to the destination.
                                    file.contents = new Buffer(contents);
                                }
                            }

                            // Rename the file.
                            file.path = basePath;
                        }
                    }

                    if (_this._config.debug)
                    {
                        console.log(chalk.green("PUSH"));
                    }

                    // Push the file back into the stream.
                    this.push(file);

                    // Notify stream engine that we are done with this file.
                    callback();
                }
                else
                {
                    if (_this._config.debug)
                    {
                        console.log(chalk.red("DROP"));
                    }

                    // Notify stream engine that we are done with this file.
                    callback();
                }
            }
            catch (error)
            {
                // Notify stream engine that an error occurred.
                callback(new util.PluginError(pluginName, `Error while processing file ${chalk.magenta(relativeFilePath)}: ${error.message}`));
            }
        },
        function (callback: () => void)
        {
            if (_this._config.debug)
            {
                console.log("");
            }

            // Notify stream engine that we are all done.
            callback();
        });
    }
}
