/*
Memory Manager (Outer Layer) specification and initial implementation.

Goal: Create a Memory Manager that uses Asset Manager (inner layer) to create, read, update text files (.text) on the user side. These files hold JSON-formatted user preference settings (as .json isn't allowed on the platform).

Asset Manager API:

f.getAssetById(id: string): Promise<Asset | null>
f.getAssetByName(name: string): Promise<Asset | null>

f.createAsset(name: string, content: string | Record<string, any>): Promise<Asset | null>
f.updateAsset(asset: Asset, content: string | Record<string, any>): Promise<Asset | null>
f.readAsset(asset: Asset): Promise<any>

f.getFolderById(id: string): Promise<AssetFolder | null>
f.getFolderByName(name: string): Promise<AssetFolder | null>
f.createFolder(name: string): Promise<AssetFolder | null>

f.setAssetFolder(asset: Asset, folder: AssetFolder): Promise<Asset | null>

f.ensureFolder(name: string): Promise<AssetFolder>
f.ensureAsset(folderName: string, assetName: string, initialContent?: string | Record<string, any>): Promise<Asset>
*/

import _ from 'lodash';
import { file as f } from "@/src/utils";

const MEMORY_FOLDER = 'RedFlow';

async function ensureMemory (fileName: string): Promise<Record<string, any>>
{
    const asset = await f.ensureAsset(MEMORY_FOLDER, `${fileName}.text`, '{}');
    const raw = await f.readAsset(asset);
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
}


async function addValue (
    fileName: string,
    entries: Record<string, any>
): Promise<void>
{
    try {
        const asset = await f.ensureAsset(MEMORY_FOLDER, `${fileName}.text`, '{}');
        const raw = await f.readAsset(asset);
        const data: Record<string, any> =
            typeof raw === 'string' ? JSON.parse(raw) : raw;

        const conflicts = Object.keys(entries).filter(key => _.has(data, key));

        if (conflicts.length) {
            throw new Error(`Cannot add keys to ${fileName}.text—already exist: ${conflicts.join(', ')}`);
        }

        _.forEach(entries, (value, key) => _.set(data, key, value));
        await f.updateAsset(asset, JSON.stringify(data, null, 2));

    } catch (err: any) {
        const message = err instanceof Error ? err.message : String(err);
        webflow.notify({ type: 'Error', message });
    }
}

async function updateValue (
    fileName: string,
    entries: Record<string, any>
): Promise<void>
{
    try {
        const asset = await f.ensureAsset(MEMORY_FOLDER, `${fileName}.text`, '{}');
        const raw = await f.readAsset(asset);
        const data: Record<string, any> =
            typeof raw === 'string' ? JSON.parse(raw) : raw;

        _.forEach(entries, (value, key) => _.set(data, key, value));
        await f.updateAsset(asset, JSON.stringify(data, null, 2));
    } catch (err: any) {
        webflow.notify({ type: 'Error', message: err.message });
    }
}

async function readValue (
    fileName: string,
    keys: string | string[]
): Promise<any>
{
    try {
        // Attempt to get existing asset; do NOT create if missing
        const asset = await f.getAssetByName(`${fileName}.text`);
        if (!asset) {
            throw new Error(`Memory file '${fileName}.text' not found in '${MEMORY_FOLDER}'`);
        }

        const raw = await f.readAsset(asset);
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

export const memory = {
    addValue, readValue, ensureMemory, updateValue
}
