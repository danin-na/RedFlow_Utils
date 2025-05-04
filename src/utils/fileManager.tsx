type MIME_TYPE =
    | 'image/jpeg'
    | 'image/jpg'
    | 'image/png'
    | 'image/gif'
    | 'image/svg+xml'
    | 'image/bmp'
    | 'image/webp'
    | 'application/pdf'
    | 'application/msword'
    | 'application/vnd.ms-excel'
    | 'application/vnd.ms-powerpoint'
    | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    | 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    | 'text/plain'
    | 'text/csv'
    | 'application/vnd.oasis.opendocument.text'
    | 'application/vnd.oasis.opendocument.spreadsheet'
    | 'application/vnd.oasis.opendocument.presentation'
    | 'application/json'

// --
// Folder Manager
// -- 

async function folderGetAll ()
    : Promise<AssetFolder[]> 
{
    return await webflow.getAllAssetFolders()
}

async function folderGetById (id: string)
    : Promise<AssetFolder | null>
{
    const folders = await webflow.getAllAssetFolders()
    for (const folder of folders) if (folder.id === id) return folder
    return null
}

async function folderGetByName (name: string)
    : Promise<AssetFolder[] | null>
{
    const folders = await webflow.getAllAssetFolders()
    const matches: AssetFolder[] = []

    for (const folder of folders) if ((await folder.getName()) === name) matches.push(folder)

    return matches.length > 0 ? matches : null
}

async function folderCreate (name: string)
    : Promise<AssetFolder | null>
{
    try {
        const folders = await webflow.getAllAssetFolders()
        for (const folder of folders) if ((await folder.getName()) === name) return folder
        return await webflow.createAssetFolder(name)
    } catch {
        return null
    }
}

// --
// FAsset Manager
// -- 

async function assetCreate (name: string, blob: Blob, mimeType: MIME_TYPE)
    : Promise<Asset | null>
{
    const file = new File([blob], name, { type: mimeType })
    const asset = (await webflow.createAsset(file))
    return asset || null
}

async function assetGetById (id: string): Promise<Asset | null>
{
    const asset = await webflow.getAssetById(id)
    return asset || null
}

async function assetGetByName (name: string): Promise<Asset | null>
{
    const assets = await webflow.getAllAssets()
    for (const asset of assets) if ((await asset.getName()) === `${name}`) return asset
    return null
}

async function assetReplace (asset: Asset, blob: Blob)
    : Promise<Asset | null>
{
    try {
        const name = await asset.getName();
        const file = new File([blob], name, { type: blob.type });
        await asset.setFile(file);
        return asset;
    } catch {
        return null;
    }
}

// --
// Text 
// --

async function textAssetCreate (name: string, content: string | Record<string, any>)
    : Promise<Asset | null> 
{
    const fileName = name.endsWith('.text') ? name : `${name}.text`
    const data = typeof content === 'string' ? content : JSON.stringify(content)
    const blob = new Blob([data], { type: 'text/plain' })
    return await assetCreate(fileName, blob, 'text/plain')
}

async function readAsset (asset: Asset): Promise<any>
{
    const url = await asset.getUrl()
    const response = await fetch(url)
    const text = await response.text()

    try {
        return JSON.parse(text)
    } catch {
        return text
    }
}








async function setAssetFolder (asset: Asset, folder: AssetFolder): Promise<Asset | null>
{
    try {
        await asset.setParent(folder)
        return asset
    } catch {
        return null
    }
}

export const FileManager = {}
