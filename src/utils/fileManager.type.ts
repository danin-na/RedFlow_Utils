
export type MIME_TYPE =
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

type FolderReturn = {
    error: boolean
    created?: boolean | null
    existed?: boolean | null
    items: AssetFolder[]
}

type AssetReturn = {
    error: boolean
    created?: boolean | null
    existed?: boolean | null
    items: Asset[]
}


export type FolderGetAll = () => Promise<FolderReturn>

export type FolderGetById = (id: string) => Promise<FolderReturn>

export type FolderGetByName = (name: string) => Promise<FolderReturn>

export type FolderCreate = (name: string) => Promise<FolderReturn>




export type AssetGetAll = () => Promise<AssetReturn>

export type AssetGetById = (id: string) => Promise<AssetReturn>

export type AssetGetByName = (name: string) => Promise<AssetReturn>

export type AssetGet = (mode: "all" | "id" | "name", identifier?: string) => Promise<AssetReturn>;

export type AssetSet = (name: string, blob: Blob, mimeType: string, createIfNotExist?: boolean, replaceIfExist?: boolean) => Promise<AssetReturn>;

export type TextAssetCreateOrReplace = (
    name: string,
    content: string | Record<string, any>,
    createIfNotExist?: boolean,
    replaceIfExist?: boolean
) => Promise<AssetReturn>;
