export function jsLikeGet(path: string[], fromObject: Record<string, any>): any {
	let value = fromObject;

	if (!value || typeof value !== 'object') {
		// Safe mode!
		return undefined;
	}

	for (let i = 0; i < path.length; i++) {
		const key = path[i];
		const isEnd = i === path.length - 1;

		const nextValue = value[key];

		if (isEnd) {
			return nextValue;
		}

		if (nextValue && typeof nextValue === 'object') {
			value = nextValue;
		} else {
			// Safe mode!
			return undefined;
		}
	}
}
