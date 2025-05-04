/*
 * Manager API Wrappers for Webflow Assets and Folders
 */

/*
  Syntax:

  createFolder(name: string): Promise<AssetFolder | null>

  getFolderById(id: string): Promise<AssetFolder | null>

  getFolderByName(name: string): Promise<AssetFolder | null>

  ensureFolder(name: string): Promise<AssetFolder>

  getAssetById(id: string): Promise<Asset | null>

  getAssetByName(name: string): Promise<Asset | null>

  createAsset(name: string, content: string | Record<string, any>): Promise<Asset | null>

  updateAsset(asset: Asset, content: string | Record<string, any>): Promise<Asset | null>

  readAsset(asset: Asset): Promise<any>

  ensureAsset(folderName: string,assetName: string, initialContent?: string | Record<string, any>): Promise<Asset>

  setAssetFolder(asset: Asset, folder: AssetFolder): Promise<Asset | null>

 */


/**
 * Creates a new asset folder with the given name.
 * @param name - The name of the folder to create.
 * @returns A Promise that resolves to the created AssetFolder, or null if creation failed.
 * @example
 * const folder = await createFolder('Images');
 * if (folder) console.log(`Folder created: ${await folder.getName()}`);
 */

async function createFolder (name: string): Promise<AssetFolder | null>
{
    const folder = await webflow.createAssetFolder(name);
    return folder || null;
}

/**
 * Retrieves an AssetFolder by its ID.
 * @param id - The ID of the folder to retrieve.
 * @returns A Promise that resolves to the AssetFolder if found, or null otherwise.
 * @example
 * const folder = await getFolderById('12345');
 * if (folder) console.log(`Found folder: ${await folder.getName()}`);
 */

async function getFolderById (id: string): Promise<AssetFolder | null>
{
    const folders = await webflow.getAllAssetFolders();
    for (const folder of folders) {
        if (folder.id === id) return folder;
    }
    return null;
}

/**
 * Retrieves an AssetFolder by its name.
 * @param name - The name of the folder to find.
 * @returns A Promise that resolves to the AssetFolder if found, or null otherwise.
 * @example
 * const folder = await getFolderByName('Documents');
 * if (folder) console.log(`Found folder: ${await folder.getName()}`);
 */

async function getFolderByName (name: string): Promise<AssetFolder | null>
{
    const folders = await webflow.getAllAssetFolders();
    for (const folder of folders) {
        if ((await folder.getName()) === name) return folder;
    }
    return null;
}

/**
 * Ensures a folder with the specified name exists: finds it or creates it.
 * @param name - The name of the folder to ensure.
 * @returns A Promise that resolves to the existing or newly created AssetFolder.
 * @throws If folder creation fails.
 * @example
 * const folder = await ensureFolder('Backups');
 * console.log(`Folder ready: ${await folder.getName()}`);
 */

async function ensureFolder (name: string): Promise<AssetFolder>
{
    try {
        let folder = await getFolderByName(name);
        if (!folder) {
            folder = await createFolder(name);
            if (!folder) throw new Error(`Failed to create folder: ${name}`);
        }
        return folder;
    } catch (error: any) {
        webflow.notify({ type: 'Error', message: `Folder Error: error while ensuring folder '${name}'` });
        throw error;
    }
}

/**
 * Retrieves an Asset by its ID.
 * @param id - The ID of the asset to retrieve.
 * @returns A Promise that resolves to the Asset if found, or null otherwise.
 * @example
 * const asset = await getAssetById('abcde');
 * if (asset) console.log(`Asset URL: ${await asset.getUrl()}`);
 */

async function getAssetById (id: string): Promise<Asset | null>
{
    const asset = await webflow.getAssetById(id);
    return asset || null;
}

/**
 * Retrieves an Asset by its name (with .txt extension).
 * @param name - The base name (without extension) of the asset to find.
 * @returns A Promise that resolves to the Asset if found, or null otherwise.
 * @example
 * const asset = await getAssetByName('config');
 * if (asset) console.log(`Found asset: ${await asset.getName()}`);
 */

async function getAssetByName (name: string): Promise<Asset | null>
{
    const assets = await webflow.getAllAssets();
    for (const asset of assets) {
        if ((await asset.getName()) === `${name}.txt`) return asset;
    }
    return null;
}

/**
 * Creates a new text asset with the given name and content.
 * @param name - The base name (without extension) for the new asset.
 * @param content - The text or JSON content to store in the asset.
 * @returns A Promise that resolves to the created Asset, or null if creation failed.
 * @example
 * const asset = await createAsset('settings', { theme: 'dark' });
 * console.log(`New asset created: ${await asset.getName()}`);
 */

async function createAsset (name: string, content: string | Record<string, any>): Promise<Asset | null>
{
    const data = typeof content === 'string' ? content : JSON.stringify(content);
    const blob = new Blob([data], { type: 'text/plain' });
    const fileObj = new File([blob], `${name}.txt`, { type: 'text/plain' });
    const asset = await webflow.createAsset(fileObj);
    return asset || null;
}

/**
 * Updates an existing Asset with new content.
 * @param asset - The Asset to update.
 * @param content - The new text or JSON content.
 * @returns A Promise that resolves to the updated Asset, or null on failure.
 * @example
 * const updated = await updateAsset(asset, 'Updated config');
 * if (updated) console.log('Asset updated successfully');
 */

async function updateAsset (asset: Asset, content: string | Record<string, any>): Promise<Asset | null>
{
    try {
        const data = typeof content === 'string' ? content : JSON.stringify(content);
        const blob = new Blob([data], { type: 'text/plain' });
        const name = await asset.getName();
        const fileObj = new File([blob], name, { type: await asset.getMimeType() });
        await asset.setFile(fileObj);
        return asset;
    } catch {
        return null;
    }
}

/**
 * Reads and parses the content of a text Asset.
 * @param asset - The Asset to read.
 * @returns A Promise that resolves to parsed JSON or raw text.
 * @example
 * const data = await readAsset(asset);
 * console.log(data);
 */

async function readAsset (asset: Asset): Promise<any>
{
    const url = await asset.getUrl();
    const response = await fetch(url);
    const text = await response.text();

    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}

/**
 * Ensures an Asset exists in the specified folder: finds it or creates it with initial content.
 * @param folderName - The name of the folder to contain the asset.
 * @param assetName - The base name (without extension) of the asset.
 * @param initialContent - Initial content for newly created assets (text or JSON).
 * @returns A Promise that resolves to the existing or newly created Asset.
 * @throws If creation or assignment fails.
 * @example
 * const asset = await ensureAsset('Configs', 'appSettings', { version: 1 });
 * console.log(`Asset ready at URL: ${await asset.getUrl()}`);
 */

async function ensureAsset (
    folderName: string,
    assetName: string,
    initialContent: string | Record<string, any> = '{}'
): Promise<Asset>
{
    try {
        const folder = await ensureFolder(folderName);
        let asset = await getAssetByName(assetName);
        if (!asset) {
            asset = await createAsset(assetName, initialContent);
            if (!asset) throw new Error(`Failed to create asset: ${assetName}`);
            const assigned = await setAssetFolder(asset, folder);
            if (!assigned) throw new Error(`Failed to assign asset '${assetName}' to folder '${folderName}'`);
        }
        return asset;
    } catch (error: any) {
        webflow.notify({ type: 'Error', message: `Asset Error: error while ensuring asset '${assetName}'` });
        throw error;
    }
}

/**
 * Assigns an Asset to a specified AssetFolder.
 * @param asset - The Asset to move.
 * @param folder - The target AssetFolder.
 * @returns A Promise that resolves to the Asset if successful, or null on failure.
 * @example
 * const moved = await setAssetFolder(asset, folder);
 * if (moved) console.log('Asset folder updated');
 */

async function setAssetFolder (asset: Asset, folder: AssetFolder): Promise<Asset | null>
{
    try {
        await asset.setParent(folder);
        return asset;
    } catch {
        return null;
    }
}

const file = {
    // Folder methods
    createFolder,
    getFolderById,
    getFolderByName,
    ensureFolder,
    // Asset methods
    getAssetById,
    getAssetByName,
    createAsset,
    updateAsset,
    readAsset,
    ensureAsset,
    // Combined
    setAssetFolder,
};

export default file