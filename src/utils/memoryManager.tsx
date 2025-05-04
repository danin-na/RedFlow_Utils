/*
Memory Manager (Outer Layer) specification and initial implementation.

Goal: Create a Memory Manager that uses Asset Manager (inner layer) to create, read, update text files (.text) on the user side. These files hold JSON-formatted user preference settings (as .json isn't allowed on the platform).

Asset Manager API:

util.file.getAssetById(id: string): Promise<Asset | null>
util.file.getAssetByName(name: string): Promise<Asset | null>

util.file.createAsset(name: string, content: string | Record<string, any>): Promise<Asset | null>
util.file.updateAsset(asset: Asset, content: string | Record<string, any>): Promise<Asset | null>
util.file.readAsset(asset: Asset): Promise<any>

util.file.getFolderById(id: string): Promise<AssetFolder | null>
util.file.getFolderByName(name: string): Promise<AssetFolder | null>
util.file.createFolder(name: string): Promise<AssetFolder | null>

util.file.setAssetFolder(asset: Asset, folder: AssetFolder): Promise<Asset | null>

util.file.ensureFolder(name: string): Promise<AssetFolder>
util.file.ensureAsset(folderName: string, assetName: string, initialContent?: string | Record<string, any>): Promise<Asset>
*/

import _ from 'lodash';
import util from "@/src/utils";

const MEMORY_FOLDER = 'RedFlow';

/**
 * Ensures the memory file exists in the RedFlow folder.
 * @param fileName - Base name of the memory file (without extension)
 * @returns Parsed JSON content of the memory file as an object
 */
async function ensureMemoryFile (fileName: string): Promise<Record<string, any>>
{
    const asset = await util.file.ensureAsset(MEMORY_FOLDER, `${fileName}.text`, '{}');
    const raw = await util.file.readAsset(asset);
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
}

/**
 * Adds one or more key→value pairs to a memory file in a single call.
 * Throws if any key already exists.
 * For a single entry, pass an object with one key: e.g. { theme: 'dark' }.
 * @param fileName  Base name without extension
 * @param entries   An object mapping lodash paths to values
 * @example         // single
 *                  await addMemoryEntries('userPrefs', { theme: 'dark', fontSize: 14 });
 */
export async function memoryAddValue (
    fileName: string,
    entries: Record<string, any>
): Promise<void>
{
    try {
        const asset = await util.file.ensureAsset(MEMORY_FOLDER, `${fileName}.text`, '{}');
        const raw = await util.file.readAsset(asset);
        const data: Record<string, any> =
            typeof raw === 'string' ? JSON.parse(raw) : raw;

        // Check for any existing keys
        const conflicts = Object.keys(entries).filter(key => _.has(data, key));
        if (conflicts.length) {
            throw new Error(
                `Cannot add keys to ${fileName}.text—already exist: ${conflicts.join(', ')}`
            );
        }

        // Set all new entries
        _.forEach(entries, (value, key) => _.set(data, key, value));
        await util.file.updateAsset(asset, JSON.stringify(data, null, 2));
    } catch (err: any) {
        const message = err instanceof Error ? err.message : String(err);
        webflow.notify({ type: 'Error', message });
    }
}

/**
 * Reads one or more key values from a memory file without creating it.
 * Throws if the asset (memory file) does not exist.
 * @param fileName  Base name without extension
 * @param keys      A lodash path string or array of path strings to read
 * @returns         If a single key is passed, returns the value or undefined.
 *                  If an array, returns an object mapping each key to its value.
 * @example
 *   const theme = await memoryReadValue('userPrefs', 'theme');
 *   const settings = await memoryReadValue('userPrefs', ['theme', 'fontSize']);
 */
export async function memoryReadValue (
    fileName: string,
    keys: string | string[]
): Promise<any>
{
    try {
        // Attempt to get existing asset; do NOT create if missing
        const asset = await util.file.getAssetByName(`${fileName}.text`);
        if (!asset) {
            throw new Error(`Memory file '${fileName}.text' not found in '${MEMORY_FOLDER}'`);
        }

        const raw = await util.file.readAsset(asset);
        const data: Record<string, any> =
            typeof raw === 'string' ? JSON.parse(raw) : raw;

        const keyList = Array.isArray(keys) ? keys : [keys];
        const result: Record<string, any> = {};
        keyList.forEach(key =>
        {
            result[key] = _.get(data, key);
        });

        return Array.isArray(keys) ? result : result[keyList[0]];
    } catch (err: any) {
        const message = err instanceof Error ? err.message : String(err);
        webflow.notify({ type: 'Error', message });
        throw err;
    }
}

export
{
    ensureMemoryFile,
    MEMORY_FOLDER,
};
