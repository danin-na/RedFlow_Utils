export namespace folder
{

    type _Set = (
        modes:
            | { mode: "byName"; name: string }
    ) => Promise<AssetFolder[]>

    type _Get = (
        modes:
            | { mode: "all" }
            | { mode: "byId"; id: string }
            | { mode: "byName"; name: string }
    ) => Promise<AssetFolder[]>

    type _Ensure = (
        modes:
            | { mode: "byName"; name: string }
    ) => Promise<AssetFolder[]>

    export type Set = (
        modes: { mode: 'byName'; name: string; duplicate_if_exist: boolean }
    ) => Promise<AssetFolder[]>

    export type Get = (
        modes:
            | { mode: 'byName'; name: string; create_if_not_exist: boolean }
            | { mode: 'byId'; id: string }
    ) => Promise<AssetFolder[]>

    export type Assign = (
        modes:
            | { mode: 'byName'; name: string; asset: Asset; create_if_not_exist: boolean }
    ) => Promise<AssetFolder[]>

    // --
    // Private Helper
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
    // Public Api
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

export namespace asset
{
    const _create = async (file: File): Promise<Asset> => webflow.createAsset(file)

    type m = { text: { content: string; fileName: string } } | { json: { content: string; fileName: string } }

    const _generate = async (m: m): Promise<Asset> =>
    {
        let f: File

        switch (true) {
            case "text" in m: {
                const { content, fileName } = m.text
                const c = content
                const n = fileName
                const t = "text/plain"
                const b = new Blob([c], { type: t })
                f = new File([b], n, { type: t })
                break
            }

            case "json" in m: {
                const { content, fileName } = m.json
                const c = typeof content === "string" ? content : JSON.stringify(content, null, 2)
                const t = "text/plain"
                const n = fileName.replace(/\.[^.]+$/, "") + ".txt"
                const b = new Blob([c], { type: t })
                f = new File([b], n, { type: t })
                break
            }

            default:
                throw new Error("invalid input")
        }

        return _create(f)
    }
}

export const file = { folder }
