// Private Helper

const _findAll = async (): Promise<AssetFolder[]> =>
{
    return await webflow.getAllAssetFolders()
}

const _findByName = async (n: string): Promise<AssetFolder[]> =>
{
    const f = await _findAll();
    const r = await Promise.all(f.map(x => x.getName()));
    return f.filter((_, i) => r[i] === n);
};

const _findById = async (i: string): Promise<AssetFolder[]> =>
{
    const f = await _findAll()
    return f.filter((x) => x.id === i)
}

const _create = async (n: string): Promise<AssetFolder[]> =>
{
    const f = await webflow.createAssetFolder(n)
    return f ? [f] : []
}

const _ensure = async (n: string): Promise<AssetFolder[]> =>
{
    const f = await _findByName(n)
    return f.length ? f : await _create(n)
}

// Public Api

const folderSet = (name: string, duplicate_if_exist = false): Promise<AssetFolder[]> =>
    duplicate_if_exist ? _create(name) : _ensure(name)

const folderGetByName = (name: string, create_if_not_exist = false): Promise<AssetFolder[]> =>
    create_if_not_exist ? _ensure(name) : _findByName(name)

const folderGetById = (id: string, create_if_not_exist = false, create_name = id): Promise<AssetFolder[]> =>
    create_if_not_exist ? _ensure(create_name) : _findById(id)

const folderGetAll = (): Promise<AssetFolder[]> =>
    _findAll()


const folderAssign = async (asset: Asset, name: string, create_if_not_exist = true): Promise<AssetFolder[]> =>
{
    const [folder] = create_if_not_exist ? await _ensure(name) : await _findByName(name)
    if (!folder) throw new Error(`Folder "${name}" not found`)
    await asset.setParent(folder)
    return [folder]
}

export const folderManager = { folderSet, folderGetAll, folderGetById, folderGetByName, folderAssign }

