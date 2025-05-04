import _ from 'lodash';
import
{
    getAssetByName,
    createAsset,
    updateAsset,
    readAsset,
    getFolderByName,
    createFolder,
    setAssetFolder,
    ensureAsset,
    ensureFolder,
} from "@/src/utils"

const MEMORY_FOLDER = 'RedFlow';

async function ensureMemoryFile (fileName: string)
{
    return ensureAsset(MEMORY_FOLDER, `${fileName}.text`, '{}');
}

/**
 * Reads the value for a given key in the specified memory file.
 */
export async function readMemoryValue (
    fileName: string,
    key: string
): Promise<any>
{
    const asset = await ensureMemoryFile(fileName);
    const content = await readAsset(asset);
    const data = typeof content === 'string' ? JSON.parse(content) : content;
    return _.get(data, key);
}

/**
 * Adds a new key/value pair to the memory file. Throws if key exists.
 */
export async function addMemoryValue (
    fileName: string,
    key: string,
    value: any
): Promise<void>
{
    const asset = await ensureMemoryFile(fileName);
    const content = await readAsset(asset);
    const data = typeof content === 'string' ? JSON.parse(content) : content;

    if (_.has(data, key)) {
        throw new Error(`Key \`${key}\` already exists in ${fileName}`);
    }
    _.set(data, key, value);
    await updateAsset(asset, JSON.stringify(data, null, 2));
}

/**
 * Updates an existing key/value pair in the memory file. Throws if key is missing.
 */
export async function updateMemoryValue (
    fileName: string,
    key: string,
    value: any
): Promise<void>
{
    const asset = await ensureMemoryFile(fileName);
    const content = await readAsset(asset);
    const data = typeof content === 'string' ? JSON.parse(content) : content;

    if (!_.has(data, key)) {
        throw new Error(`Key \`${key}\` does not exist in ${fileName}`);
    }
    _.set(data, key, value);
    await updateAsset(asset, JSON.stringify(data, null, 2));
}