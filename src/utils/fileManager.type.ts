
type Folders = {
    error: boolean
    created?: boolean | null
    existed?: boolean | null
    message: string
    items: AssetFolder[]
}

export type FolderGetAll = () => Promise<Folders>

export type FolderGetById = (id: string) => Promise<Folders>

export type FolderGetByName = (name: string) => Promise<Folders>

export type FolderCreate = (name: string) => Promise<Folders>

type Assets = {
    error: boolean
    created?: boolean | null
    existed?: boolean | null
    message: string
    items: Asset[]
}


export type AssetGetAll = () => Promise<Assets>

export type AssetGetById = (id: string) => Promise<Assets>

export type AssetGetByName = (name: string) => Promise<Assets>
