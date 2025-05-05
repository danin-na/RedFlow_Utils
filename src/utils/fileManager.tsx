import
{
    FolderGetAll,
    FolderCreate,
    FolderGetById,
    FolderGetByName,
    AssetGetAll,
    AssetGetById,
    AssetGetByName,
    AssetCreateOrReplace,
    TextAssetCreateOrReplace,
    MIME_TYPE
} from "./fileManager.type"

// --
// Folder Manager
// --

const defaultFail = { error: true, created: null, existed: null, items: [] as AssetFolder[] }

export const folderGetAll: FolderGetAll = async () =>
{
    try {
        // Get Folders
        const folders = await webflow.getAllAssetFolders()

        // Return Folders
        return {
            error: false,
            created: false,
            existed: !!folders.length,
            items: folders,
        }
    } catch {
        return defaultFail
    }
}

export const folderGetById: FolderGetById = async (id) =>
{
    try {
        // Get Folders
        const folders = await webflow.getAllAssetFolders()

        // Find Matches
        const matches = folders.filter((f) => f.id === id)

        // Return Matches
        return {
            error: false,
            created: false,
            existed: !!matches.length,
            items: matches,
        }
    } catch {
        return defaultFail
    }
}

export const folderGetByName: FolderGetByName = async (name) =>
{
    try {
        // Get Folders
        const folders = await webflow.getAllAssetFolders()

        // Find Matches
        const names = await Promise.all(folders.map((f) => f.getName()))
        const matches = folders.filter((_, i) => names[i] === name)

        // Return Matches
        return {
            error: false,
            created: false,
            existed: !!matches.length,
            items: matches,
        }
    } catch {
        return defaultFail
    }
}

export const folderCreate: FolderCreate = async (name) =>
{
    try {
        // Get Folders
        const folders = await webflow.getAllAssetFolders()
        const names = await Promise.all(folders.map((f) => f.getName()))

        // Find Matches
        const matches = folders.filter((_, i) => names[i] === name)

        // Return Matches
        if (matches.length)
            return {
                error: false,
                created: false,
                existed: true,
                items: matches,
            }
        // Return Created
        else {
            const created = await webflow.createAssetFolder(name)
            return {
                error: false,
                created: true,
                existed: false,
                items: [created],
            }
        }
    } catch {
        return defaultFail
    }
}

// --
// Asset Manager
// --

const defaultFailAsset = { error: true, created: null, existed: null, items: [] as Asset[] }

export const assetGetAll: AssetGetAll = async () =>
{
    try {
        // Get  Assets
        const assets = await webflow.getAllAssets()

        // Return Assets
        return {
            error: false,
            created: false,
            existed: !!assets.length,
            items: assets,
        }
    } catch {
        return defaultFailAsset
    }
}

export const assetGetById: AssetGetById = async (id) =>
{
    try {
        // Get Assets
        const asset = await webflow.getAssetById(id)

        // Find Matches
        const matches = asset ? [asset] : []

        // Return Matches
        return {
            error: false,
            created: false,
            existed: !!asset,
            items: matches,
        }
    } catch {
        return defaultFailAsset
    }
}

export const assetGetByName: AssetGetByName = async (name) =>
{
    try {
        // Get Assets
        const assets = await webflow.getAllAssets()

        // Find Matches
        const names = await Promise.all(assets.map((a) => a.getName()))
        const matches = assets.filter((_, i) => names[i] === name)

        // Return Matches
        return {
            error: false,
            created: false,
            existed: !!matches.length,
            items: matches,
        }
    } catch {
        return defaultFailAsset
    }
}

export const assetCreateOrReplace: AssetCreateOrReplace = async (
    name,
    blob,
    mimeType,
    createIfNotExist = true,
    replaceIfExist = false
) =>
{
    try {
        // Get Assets
        const assets = await webflow.getAllAssets()

        // Find Matches
        const names = await Promise.all(assets.map((a) => a.getName()))
        const matches = assets.filter((_, i) => names[i] === name)

        // Handle Replaced (optional)
        if (matches.length) {
            if (replaceIfExist) {
                await Promise.all(
                    matches.map((asset) =>
                        asset.setFile(new File([blob], name, { type: mimeType }))
                    )
                )
            }

            // Return Replaced (optional)
            return {
                error: false,
                created: false,
                existed: true,
                items: matches,
            }
        }

        // Return Created (optional)
        if (createIfNotExist) {
            const created = await webflow.createAsset(
                new File([blob], name, { type: mimeType })
            )
            return {
                error: false,
                created: true,
                existed: false,
                items: [created],
            }
        }

        // Not found and not creating
        return {
            error: false,
            created: false,
            existed: false,
            items: [],
        }
    } catch {
        return defaultFailAsset
    }
}

// --
// Text
// --

export const textAssetCreateOrReplace: TextAssetCreateOrReplace = async (
    name,
    content,
    createIfNotExist = true,
    replaceIfExist = false
) =>
{
    try {
        // Format file name
        const fileName = name.endsWith(".text") ? name : `${name}.text`

        // Prepare data string
        const data = typeof content === "string" ? content : JSON.stringify(content)

        // Create Blob
        const blob = new Blob([data], { type: "text/plain" })

        // Delegate to generic asset helper
        return await assetCreateOrReplace(
            fileName,
            blob,
            "text/plain",
            createIfNotExist,
            replaceIfExist
        )
    } catch {
        return defaultFailAsset
    }
}

// --
// Read Text Asset by Name
// --

// --
// Read Text Asset
// --

// --
// Read Text or JSON Asset by Name
// --

const defaultFailReadAssetByName: {
    error: boolean
    created: false
    existed: boolean
    items: unknown[]
} = {
    error: true,
    created: false,
    existed: false,
    items: [],
}

export type ReadAssetByName = (
    name: string,
    parseJson?: boolean
) => Promise<{
    error: boolean
    created: false
    existed: boolean
    items: unknown[]
}>

export const readAssetByName: ReadAssetByName = async (name, parseJson = false) =>
{
    try {
        // Get Assets
        const assets = await webflow.getAllAssets()

        // Find Matches
        const names = await Promise.all(assets.map((a) => a.getName()))
        const matches = assets.filter((_, i) => names[i] === name)

        // Fetch raw text from each URL
        const rawItems = await Promise.all(
            matches.map(async (asset) =>
            {
                const url = await asset.getUrl()
                const res = await fetch(url)
                return res.text()
            })
        )

        // Optionally parse JSON
        const items = parseJson
            ? rawItems.map((txt) =>
            {
                try { return JSON.parse(txt) }
                catch { return null }
            })
            : rawItems

        // Return Results
        return {
            error: false,
            created: false,
            existed: !!matches.length,
            items,
        }
    } catch {
        return defaultFailReadAssetByName
    }
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
