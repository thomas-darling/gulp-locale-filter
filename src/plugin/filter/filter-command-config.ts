/**
 * Represents the command configuration.
 */
export interface IFilterCommandConfig
{
    /**
     * The locale code for which files should be passed through,
     * or undefined to pass through only base files.
     * Default is undefined.
     */
    localeCode?: string;

    /**
     * True to rename the files that are passed through to their
     * base name, otherwise false.
     * Default is false.
     */
    renameToBaseName?: boolean;
}

/**
 * Represents the command configuration.
 */
export class FilterCommandConfig
{
    /**
     * Creates a new instance of the FilterCommandConfig type.
     * @param config The config object from which the instance should be created.
     */
    public constructor(config?: IFilterCommandConfig)
    {
        if (config == null)
            return;

        if (config.localeCode != null)
            this.localeCode = config.localeCode;

        if (config.renameToBaseName != null)
            this.renameToBaseName = config.renameToBaseName;
    }

    /**
     * The locale code for which files should be passed through,
     * or undefined to pass through only base files.
     */
    public localeCode: string;

    /**
     * True to rename the files that are passed through to their
     * base name, otherwise false.
     */
    public renameToBaseName: boolean = false;
}
