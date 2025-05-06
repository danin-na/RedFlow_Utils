namespace folder
{

    // --
    // Private Helper - type
    // --

    type _Set = (
        m:
            | { mode: "byName"; name: string }
    ) => Promise<AssetFolder[]>

    type _Get = (
        m:
            | { mode: "all" }
            | { mode: "byId"; id: string }
            | { mode: "byName"; name: string }
    ) => Promise<AssetFolder[]>

    type _Ensure = (
        m:
            | { mode: "byName"; name: string }
    ) => Promise<AssetFolder[]>

    // --
    // Private Helper - fn
    // --

    const _set: _Set = async (m) =>
    {
        switch (m.mode) {
            case 'byName':
                return [await webflow.createAssetFolder(m.name)]

            default:
                throw new Error('Unsupported mode');
        }
    };

    const _get: _Get = async (m) =>
    {
        const f = await webflow.getAllAssetFolders();

        switch (m.mode) {
            case 'all':
                return f;

            case 'byId':
                return f.filter((x) => x.id === m.id);

            case 'byName': {
                const n = await Promise.all(f.map((x) => x.getName()));
                return f.filter((_, i) => n[i] === m.name);
            }

            default:
                throw new Error('Unsupported mode');
        }
    };

    const _ensure: _Ensure = async (m) =>
    {
        switch (m.mode) {
            case 'byName': {
                const f = await _get({ mode: 'byName', name: m.name });
                return f.length
                    ? f
                    : await _set({ mode: 'byName', name: m.name });
            }

            default:
                throw new Error('Unsupported mode');
        }
    };

    // --
    // Public Api - Type
    // --

    export type Set = (m: SetType) => Promise<AssetFolder[]>
    export type SetType =
        { mode: 'byName'; name: string; duplicate_if_exist: boolean }

    export type Get = (m: GetType) => Promise<AssetFolder[]>
    export type GetType =
        | { mode: 'byName'; name: string; create_if_not_exist: boolean }
        | { mode: 'byId'; id: string }

    export type Assign = (m: AssignType) => Promise<AssetFolder[]>
    export type AssignType =
        { mode: 'byName'; name: string; asset: Asset; create_if_not_exist: boolean }

    // --
    // Public Api - Fn
    // --

    export const set: Set = async (m) =>
    {
        switch (m.mode) {
            case 'byName':
                return m.duplicate_if_exist
                    ? await _set({ mode: 'byName', name: m.name })
                    : await _ensure({ mode: 'byName', name: m.name });

            default:
                throw new Error('Unsupported mode');
        }
    };

    export const get: Get = async (m) =>
    {
        switch (m.mode) {
            case 'byName':
                return m.create_if_not_exist
                    ? await _ensure({ mode: "byName", name: m.name })
                    : await _set({ mode: "byName", name: m.name })

            case 'byId':
                return await _get({ mode: "byId", id: m.id })

            default:
                throw new Error('Unsupported mode');
        }
    };

    export const assign: Assign = async (m) =>
    {
        switch (m.mode) {
            case 'byName':
                const [f] = m.create_if_not_exist
                    ? await _ensure({ mode: "byName", name: m.name })
                    : await _get({ mode: "byName", name: m.name })
                if (!f) throw new Error(`folder "${name}" not found`)
                await m.asset.setParent(f)
                return [f]
            default:
                throw new Error('Unsupported mode');
        }
    };

}

namespace asset
{

    // --
    // Private Helper - type
    // --

    type _Set = (
        file: File
    ) => Promise<Asset>

    type _Get = (
        m:
            | { mode: "all" }
            | { mode: "byId"; id: string }
            | { mode: "byName"; name: string }
    ) => Promise<Asset[]>;

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
                return await webflow.getAllAssets();

            case "byId":
                return [await webflow.getAssetById(m.id)];

            case "byName": {
                const all = await webflow.getAllAssets();
                const names = await Promise.all(all.map((a) => a.getName()));
                return all.filter((_, i) => names[i] === m.name);
            }

            default:
                throw new Error("Unsupported mode");
        }
    };


    // --
    // Public Api - Type
    // --

    export type Set = (m: SetType, fl?: folder.AssignType) => Promise<Asset>;
    export type SetType =
        | { mode: 'Text'; content: string; fileName: string }
        | { mode: 'Json'; content: string | Record<string, any>; fileName: string }

    export type Get = (m: GetType) => Promise<Asset[]>;
    export type GetType =
        | { mode: "all" }
        | { mode: "byId"; id: string }
        | { mode: "byName"; name: string };

    export type Read = (m: ReadType) => Promise<any>;
    export type ReadType =
        { mode: "Json"; name: string };

    // --
    // Public Api - fn
    // --

    export const set: Set = async (m, fl) =>
    {
        let f: File;
        const name_clean = (name: string) => name.replace(/\.[^.]+$/, "")

        switch (m.mode) {
            case 'Text': {
                const c = m.content
                const t = 'text/plain'
                const n = name_clean(m.fileName) + ".txt"
                const b = new Blob([c], { type: t })
                f = new File([b], n, { type: t })
                break
            }
            case 'Json': {
                const c = typeof m.content === "string"
                    ? m.content
                    : JSON.stringify(m.content, null, 2)
                const t = 'text/plain'
                const n = name_clean(m.fileName) + ".txt"
                const b = new Blob([c], { type: t })
                f = new File([b], n, { type: t })
                break
            }
            default:
                throw new Error('invalid input')
        }
        const newFile = await _set(f)

        if (fl) {
            await folder.assign({
                mode: "byName",
                name: fl.name,
                asset: newFile,
                create_if_not_exist: fl.create_if_not_exist
            })
        }
        return newFile
    }

    export const get: Get = async (m) =>
    {
        return await _get(m);
    };

    export const read: Read = async (m) =>
    {
        switch (m.mode) {
            case "Json": {
                const [assetFile] = await _get({ mode: "byName", name: m.name });
                if (!assetFile) {
                    throw new Error(`Asset with name "${m.name}" not found`);
                }
                const url = await assetFile.getUrl();
                const response = await fetch(url);
                const text = await response.text();
                return JSON.parse(text);
            }
            default:
                throw new Error("Unsupported read mode");
        }
    };
}

export const file = { folder, asset }
