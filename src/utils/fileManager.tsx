type MIME_TYPE =
    | "image/jpeg"
    | "image/jpg"
    | "image/png"
    | "image/gif"
    | "image/svg+xml"
    | "image/bmp"
    | "image/webp"
    | "application/pdf"
    | "application/msword"
    | "application/vnd.ms-excel"
    | "application/vnd.ms-powerpoint"
    | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    | "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    | "text/plain"
    | "text/csv"
    | "application/vnd.oasis.opendocument.text"
    | "application/vnd.oasis.opendocument.spreadsheet"
    | "application/vnd.oasis.opendocument.presentation"
    | "application/json"


import
{
    FolderGetAll,
    FolderCreate,
    FolderGetById,
    FolderGetByName,
    AssetGetAll,
    AssetGetById,
    AssetGetByName,
} from "./fileManager.type"

// --
// Folder Manager
// --

export const folderGetAll: FolderGetAll = async () =>
{
    try {
        const result = await webflow.getAllAssetFolders()

        return result.length > 0
            ? { error: false, created: false, existed: true, message: `${result.length} folder(s) found.`, items: result }
            : { error: false, created: false, existed: false, message: `No folder(s) found.`, items: [] }
    }
    catch (error: any) {
        return { error: true, created: null, existed: null, message: error?.message ?? "Unknown error fetching folders.", items: [] }
    }
}

export const folderGetById: FolderGetById = async (id) =>
{
    try {
        const folders = await webflow.getAllAssetFolders()
        const result: AssetFolder[] = []

        for (const f of folders) if (f.id === id) result.push(f)

        return result.length > 0
            ? { error: false, created: false, existed: true, message: `${result.length} folder(s) matched "${id}".`, items: result }
            : { error: false, created: false, existed: false, message: `No folder(s) matched "${id}".`, items: [] }
    }
    catch (error: any) {
        return { error: true, created: null, existed: null, message: error?.message ?? "Unknown error fetching folders.", items: [] }
    }
}

export const folderGetByName: FolderGetByName = async (name) =>
{
    try {
        const folders = await webflow.getAllAssetFolders()
        const result: AssetFolder[] = []

        for (const f of folders) if ((await f.getName()) === name) result.push(f)

        return result.length > 0
            ? { error: false, created: false, existed: true, message: `${result.length} folder(s) matched "${name}".`, items: result }
            : { error: false, created: false, existed: false, message: `No folder(s) matched "${name}".`, items: [] }
    }
    catch (error: any) {
        return { error: true, created: null, existed: null, message: error?.message ?? "Unknown error fetching folders.", items: [] }
    }
}

export const folderCreate: FolderCreate = async (name) =>
{
    try {
        const folders = await webflow.getAllAssetFolders()
        let result: AssetFolder[] = []

        for (const f of folders) if ((await f.getName()) === name) result.push(f)

        if (result.length > 0)
            return { error: false, created: false, existed: true, message: `${result.length} folder(s) matched "${name}" already exist.`, items: result }

        const folder = await webflow.createAssetFolder(name)
        return { error: false, created: true, existed: false, message: `Folder "${name}" created.`, items: [folder] }
    }
    catch (error: any) {
        return { error: true, created: null, existed: null, message: error?.message ?? "Unknown error creating folder.", items: [] }
    }
}

// --
// FAsset Manager
// --

export const assetGetAll: AssetGetAll = async () =>
{
    try {
        const result = await webflow.getAllAssets()

        return result.length > 0
            ? { error: false, created: false, existed: true, message: `${result.length} asset(s) found.`, items: result }
            : { error: false, created: false, existed: false, message: `No asset(s) found.`, items: [] }
    }
    catch (error: any) {
        return { error: true, created: null, existed: null, message: error?.message ?? "Unknown error fetching assets.", items: [] }
    }
}

export const assetGetById: AssetGetById = async (id: string) =>
{
    try {
        const result = await webflow.getAssetById(id)

        return result != null
            ? { error: false, created: false, existed: true, message: `1 asset(s) matched "${id}".`, items: [result] }
            : { error: false, created: false, existed: false, message: `No asset(s) matched "${id}".`, items: [] }
    }
    catch (error: any) {
        return { error: true, created: null, existed: null, message: error?.message ?? "Unknown error fetching assets.", items: [] }
    }
}

export const assetGetByName: AssetGetByName = async (name: string) =>
{
    try {
        const assets = await webflow.getAllAssets()
        const result: Asset[] = []

        for (const a of assets) if ((await a.getName()) === name) result.push(a)

        return assets.length > 0
            ? { error: false, created: false, existed: true, message: `${result.length} assets(s) matched "${name}".`, items: result }
            : { error: false, created: false, existed: false, message: `No asset(s) matched "${name}".`, items: [] }
    }
    catch (error: any) {
        return { error: true, created: null, existed: null, message: error?.message ?? "Unknown error fetching assets.", items: [] }
    }
}



async function assetCreate (name: string, blob: Blob, mimeType: MIME_TYPE): Promise<Asset | null>
{
    const file = new File([blob], name, { type: mimeType })
    const asset = await webflow.createAsset(file)
    return asset || null
}


async function assetReplace (asset: Asset, blob: Blob): Promise<Asset | null>
{
    try {
        const name = await asset.getName()
        const file = new File([blob], name, { type: blob.type })
        await asset.setFile(file)
        return asset
    } catch {
        return null
    }
}

// --
// Text
// --

async function textAssetCreate (name: string, content: string | Record<string, any>): Promise<Asset | null>
{
    const fileName = name.endsWith(".text") ? name : `${name}.text`
    const data = typeof content === "string" ? content : JSON.stringify(content)
    const blob = new Blob([data], { type: "text/plain" })
    return await assetCreate(fileName, blob, "text/plain")
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
