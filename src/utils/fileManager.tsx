namespace folder
{

    // --
    // Private Helper - fn
    // --

    type _Set = {
        folder: { set: "byName"; name: string }
    }
    /**
     * configuration for which folder to create
     * ```
     * folder: { set: "byName"; name: string }
     * ```
     * @returns 
     * ```
     * AssetFolder[]
     * ```
     */
    async function _set ({ folder: f }: _Set): Promise<AssetFolder[]>
    {
        switch (f.set) {
            case "byName":
                return [await webflow.createAssetFolder(f.name)]
            default:
                throw new Error("Unsupported mode")
        }
    }


    type _Get = {
        folder:
        | { get: "all" }
        | { get: "byId"; id: string }
        | { get: "byName"; name: string }
    }
    /**
     * configuration for which folders to retrieve
     * ```
     * folder: { get: "all" }
     * folder: { get: "byId"; id: string }
     * folder: { get: "byName"; name: string }
     * ```
     * @returns 
     * ```
     * AssetFolder[] or []
     * ```
     */
    async function _get ({ folder: f }: _Get)
    {
        const fld = await webflow.getAllAssetFolders()

        switch (f.get) {
            case "all":
                return fld

            case "byId":
                return fld.filter((x) => x.id === f.id)

            case "byName": {
                const names = await Promise.all(fld.map((x) => x.getName()))
                return fld.filter((_, i) => names[i] === f.name)
            }

            default:
                throw new Error("Unsupported mode")
        }
    }


    type _Ensure = {
        folder: { ensure: "byName"; name: string }
    }
    /**
     * configuration for ensuring a folder exists or creating it if missing
     * ```
     * folder: { ensure: "byName"; name: string }
     * ```
     * @returns 
     * ```
     * AssetFolder[]
     * ```
     */
    async function _ensure ({ folder: f }: _Ensure): Promise<AssetFolder[]>
    {
        switch (f.ensure) {
            case "byName": {
                const fld = await _get({ folder: { get: "byName", name: f.name } })
                return fld.length
                    ? fld
                    : await _set({ folder: { set: "byName", name: f.name } })
            }
            default:
                throw new Error("Unsupported mode")
        }
    }

    // --
    // Public Api - Fn
    // --

    export type Set = {
        folder: {
            set: "byName";
            name: string;
            fallback: "if_exist_then_duplicate" | "if_exist_return_exiting" | "if_exist_throw_error";
        };
    };
    /**
     * configuration for which folder to create or select
     * ```ts
     * folder: { set: "byName"; name: string; fallback: "if_exist_then_duplicate" | "if_exist_return_exiting" | "if_exist_throw_error" }
     * ```
     */
    export async function set ({ folder: f }: Set): Promise<AssetFolder[]>
    {
        switch (f.set) {
            case "byName":
                switch (f.fallback) {
                    case "if_exist_then_duplicate":
                        return await _set({ folder: { set: "byName", name: f.name } });

                    case "if_exist_return_exiting":
                        return await _ensure({ folder: { ensure: "byName", name: f.name } });

                    case "if_exist_throw_error": {
                        const existing = await _get({ folder: { get: "byName", name: f.name } });
                        if (existing.length) throw new Error(`Asset folder "${f.name}" already exists`);
                        return await _set({ folder: { set: "byName", name: f.name } });
                    }
                }

            default:
                throw new Error("Error in ' folder.set '");
        }
    }


    export type Get = {
        folder:
        | { get: "byName"; name: string; fallback: "if_not_exist_then_create" | "if_not_exist_return_empty" | "if_not_exist_throw_error" }
        | { get: "byId"; id: string };
    };
    /**
     * configuration for which folder to retrieve or select
     * ```ts
     * folder: { get: "byName"; name: string; fallback: "if_not_exist_then_create" | "if_not_exist_return_empty" | "if_not_exist_throw_error" }
     * folder: { get: "byId"; id: string }
     * ```
     */
    export async function get ({ folder: f }: Get): Promise<AssetFolder[]>
    {
        switch (f.get) {
            case "byName":
                switch (f.fallback) {
                    case "if_not_exist_then_create":
                        return await _ensure({ folder: { ensure: "byName", name: f.name } });
                    case "if_not_exist_return_empty":
                        return await _get({ folder: { get: "byName", name: f.name } });
                    case "if_not_exist_throw_error": {
                        const found = await _get({ folder: { get: "byName", name: f.name } });
                        if (!found.length) throw new Error(`Asset folder "${f.name}" not found`);
                        return found;
                    }
                }
            case "byId":
                return await _get({ folder: { get: "byId", id: f.id } });
            default:
                throw new Error("Error in ' folder.get '");
        }
    }


    export type Assign = {
        folder: { assign: "byName"; name: string; asset: Asset; fallback: "if_not_exist_then_create" | "if_not_exist_return_empty" | "if_not_exist_throw_error" }
    }
    /**
     * configuration for which folder to assign an asset to
     * ```
     * folder: { assign: "byName"; name: string; asset: Asset; fallback: "if_not_exist_then_create" | "if_not_exist_return_empty" | "if_not_exist_throw_error" }
     * ```
     */
    export async function assign ({ folder: f }: Assign): Promise<AssetFolder[]>
    {
        switch (f.assign) {
            case "byName": {
                let folders: AssetFolder[];

                switch (f.fallback) {
                    case "if_not_exist_then_create":
                        folders = await _ensure({ folder: { ensure: "byName", name: f.name } });
                        break;

                    case "if_not_exist_return_empty":
                        folders = await _get({ folder: { get: "byName", name: f.name } });
                        if (!folders.length) return [];
                        break;

                    case "if_not_exist_throw_error":
                        folders = await _get({ folder: { get: "byName", name: f.name } });
                        if (!folders.length) throw new Error(`Asset folder "${f.name}" not found`);
                        break;
                }

                const [fld] = folders;
                await f.asset.setParent(fld);
                return [fld];
            }
            default:
                throw new Error("Unsupported assign");
        }
    }
}

namespace asset
{
    // --
    // Private Helper - type
    // --

    type _Set = (file: File) => Promise<Asset>

    type _Get = (
        m: { mode: "all" } | { mode: "byId"; id: string } | { mode: "byName"; name: string }
    ) => Promise<Asset[]>

    // --
    // Private Helper - fn
    // --

    const _set: _Set = async (f) =>
    {
        return await webflow.createAsset(f)
    }

    const _get: _Get = async (m) =>
    {
        switch (m.mode) {
            case "all":
                return await webflow.getAllAssets()

            case "byId":
                return [await webflow.getAssetById(m.id)]

            case "byName": {
                const all = await webflow.getAllAssets()
                const names = await Promise.all(all.map((a) => a.getName()))
                return all.filter((_, i) => names[i] === m.name)
            }

            default:
                throw new Error("Unsupported mode")
        }
    }

    // --
    // Public Api - Type
    // --

    export type Get = (m: GetType) => Promise<Asset[]>
    export type GetType = { mode: "all" } | { mode: "byId"; id: string } | { mode: "byName"; name: string }

    export type Read = (m: ReadType) => Promise<any>
    export type ReadType = { mode: "Json"; name: string }

    // --
    // Public Api - fn
    // --

    export type Set = {
        asset:
        | { mode: "Text"; content: string; fileName: string }
        | { mode: "Json"; content: string | Record<string, any>; fileName: string }
        folder?: { name: string; create_if_not_exist?: boolean }
    }

    /**
     * ```
     *   asset:
     *     { mode: 'Text'; content: string; fileName: string }
     *     { mode: 'Json'; content: string | Record<string, any>; fileName: string }
     *   folder?:
     *     name: string
     *     create_if_not_exist?: boolean
     * ```
     */

    export async function set ({ asset: a, folder: f }: Set): Promise<Asset>
    {
        let fl: File
        const name_clean = (name: string) => name.replace(/\.[^.]+$/, "")

        switch (a.mode) {
            case "Text": {
                const c = a.content
                const t = "text/plain"
                const n = name_clean(a.fileName) + ".txt"
                const b = new Blob([c], { type: t })
                fl = new File([b], n, { type: t })
                break
            }
            case "Json": {
                const c = typeof a.content === "string" ? a.content : JSON.stringify(a.content, null, 2)
                const t = "text/plain"
                const n = name_clean(a.fileName) + ".txt"
                const b = new Blob([c], { type: t })
                fl = new File([b], n, { type: t })
                break
            }
            default:
                throw new Error("invalid input")
        }

        const newFile = await _set(fl)

        if (f) {
            await folder.assign({
                mode: "byName",
                name: f.name,
                asset: newFile,
                create_if_not_exist: f.create_if_not_exist!,
            })
        }

        return newFile
    }


    export const get: Get = async (m) =>
    {
        return await _get(m)
    }

    export const read: Read = async (m) =>
    {
        switch (m.mode) {
            case "Json": {
                const [assetFile] = await _get({ mode: "byName", name: m.name })
                console.log(assetFile)
                if (!assetFile) {
                    throw new Error(`Asset with name "${m.name}" not found`)
                }
                const url = await assetFile.getUrl()
                const response = await fetch(url)
                const text = await response.text()
                return JSON.parse(text)
            }
            default:
                throw new Error("Unsupported read mode")
        }
    }
}

export const file = { folder, asset }
