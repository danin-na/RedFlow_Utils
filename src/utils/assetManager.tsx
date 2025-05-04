/*

getAssetById(id: string): Promise<Asset | null>
getAssetByName(name: string): Promise<Asset | null>

createAsset(name: string, content: string | Record<string, any>): Promise<Asset | null>
updateAsset(asset: Asset, content: string | Record<string, any>): Promise<Asset | null>
readAsset(asset: Asset): Promise<any>

getFolderById(id: string): Promise<AssetFolder | null>
getFolderByName(name: string): Promise<AssetFolder | null>
createFolder(name: string): Promise<AssetFolder | null>

setAssetFolder(asset: Asset, folder: AssetFolder): Promise<Asset | null>

*/

// Folder

export async function createFolder (name: string): Promise<AssetFolder | null>
{
    const folder = await webflow.createAssetFolder(name)
    return folder || null
}

export async function getFolderById (id: string): Promise<AssetFolder | null>
{
    const folders = await webflow.getAllAssetFolders()
    for (const folder of folders) if (folder.id === id) return folder
    return null
}

export async function getFolderByName (name: string): Promise<AssetFolder | null>
{
    const folders = await webflow.getAllAssetFolders()
    for (const folder of folders) if ((await folder.getName()) === name) return folder
    return null
}

// Asset

export async function getAssetById (id: string): Promise<Asset | null>
{
    const asset = await webflow.getAssetById(id)
    return asset || null
}

export async function getAssetByName (name: string): Promise<Asset | null>
{
    const assets = await webflow.getAllAssets()
    for (const asset of assets) if ((await asset.getName()) === `${name}.txt`) return asset
    return null
}

export async function createAsset (name: string, content: string | Record<string, any>): Promise<Asset | null>
{
    const data = typeof content === "string" ? content : JSON.stringify(content)
    const blob = new Blob([data], { type: "text/plain" })

    const file = new File([blob], `${name}.txt`, { type: "text/plain" })
    const asset = await webflow.createAsset(file)
    return asset || null
}

export async function updateAsset (asset: Asset, content: string | Record<string, any>): Promise<Asset | null>
{
    try {
        const data = typeof content === "string" ? content : JSON.stringify(content)
        const blob = new Blob([data], { type: "text/plain" })
        const name = await asset.getName()
        const file = new File([blob], name, { type: await asset.getMimeType() })
        await asset.setFile(file)
        return asset
    } catch {
        return null
    }
}

export async function readAsset (asset: Asset): Promise<any>
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

// Folder & Asset

export async function setAssetFolder (asset: Asset, folder: AssetFolder): Promise<Asset | null>
{
    try {
        await asset.setParent(folder)
        return asset
    } catch {
        return null
    }
}
