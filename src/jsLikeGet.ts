const CHAR_DOT = '.'.charCodeAt(0);

export function jsLikeGet(path: string, fromObject: Record<string, any>): any {
	let value = fromObject;

	for (let i = 0; i <= path.length; i++) {
		const isEnd = i === path.length;

		if (isEnd || path.charCodeAt(i) === CHAR_DOT) {
			const key = path.slice(0, i);
			const pathRest = isEnd ? '' : path.slice(i + 1);

			const nextValue = value[key];

			if (isEnd) {
				return nextValue;
			}

			if (nextValue && typeof nextValue === 'object') {
				value = nextValue;
				path = pathRest;
			} else {
				// Safe mode!
				return undefined;
			}
		}
	}
}
