import * as util from "gulp-util";
import * as path from "path";
import * as through from "through2";

import {IPluginConfig, PluginConfig} from "./plugin-config";

import {FilterCommand} from "./filter/filter-command";
import {IFilterCommandConfig, FilterCommandConfig} from "./filter/filter-command-config";

/**
 * Represents the plugin.
 */
export class Plugin
{
    private _config: PluginConfig;

    /**
     * Creates a new instance of the Plugin type.
     * @param config The plugin configuration to use, or undefined to use the default.
     */
    public constructor(config?: IPluginConfig)
    {
        this._config = new PluginConfig(config);
    }

    /**
     * Filters the files being processed, keeping only the file variants that best match the
     * configured locale in the stream, optionally renaming the files to their base name.
     * @param config The command configuration to use, or undefined to use the default.
     */
    public filter(config: IFilterCommandConfig): NodeJS.ReadWriteStream
    {
        const exportCommand = new FilterCommand(this._config);
        return exportCommand.create(new FilterCommandConfig(config));
    }
}
