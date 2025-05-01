type SizeText = (typeof sizeText)[number];
const sizeText = [50,75,100,125,150,175,200,225,250,275,300,325,350] as const;

type SizePadding = (typeof sizePadding)[number];
const sizePadding = [50,100,150,200,250,300,350,400,450] as const;

type SizeMargin = (typeof sizeMargin)[number];
const sizeMargin = [50,100,150,200,250,300,350,400,450] as const;


async function loadSizeVariables<T extends number>(prefix: string, values: readonly T[]): Promise<Record<T, SizeVariable>> {
  const collection = await webflow.getDefaultVariableCollection();
  const map = {} as Record<T, SizeVariable>;
  for (const value of values) {
    map[value] = (await collection.getVariableByName(`${prefix}/${value}`)) as SizeVariable;
  }
  return map;
}

const loadText = (): Promise<Record<SizeText, SizeVariable>> => loadSizeVariables('st', sizeText);
const loadPadding = (): Promise<Record<SizePadding, SizeVariable>> => loadSizeVariables('sg', sizePadding);
const loadMargin = (): Promise<Record<SizeMargin, SizeVariable>> => loadSizeVariables('sg', sizeMargin);

const variable = {
	size: {
	  text: sizeText,
	  padding: sizePadding,
	  margin: sizeMargin,
	},
	load: {
	  text: loadText,
	  padding: loadPadding,
	  margin: loadMargin,
	},
  };
  
export default variable;
