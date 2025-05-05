// Private helper

const _findAll = async (): Promise<Asset[]> =>
{
    return await webflow.getAllAssets();
};

const _findByName = async (n: string): Promise<Asset[]> =>
{
    const a = await _findAll();
    const r = await Promise.all(a.map(f => f.getName()));
    return a.filter((_, i) => r[i] === n);
};

const _findById = async (i: string): Promise<Asset | null> =>
{
    return await webflow.getAssetById(i);
};


const _create = async (fileBlob: File): Promise<Asset> =>
{
    return await webflow.createAsset(fileBlob);
};

const _ensure = async (name: string, file: File): Promise<Asset> =>
{
    const existing = await _findByName(name);
    if (existing.length > 0) return existing[0];
    return await _create(file);
};




// Public API
