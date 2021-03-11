import {jsLikeGet} from "../src/jsLikeGet";

describe('jsLikeGet', () => {
	test('empty', () => {
		expect(jsLikeGet('', {})).toEqual(undefined);
	});

	test('simple', () => {
		expect(jsLikeGet('key', {key: true})).toEqual(true);
	});

	test('simple not exists', () => {
		expect(jsLikeGet('key', {})).toEqual(undefined);
	});

	test('inset 2', () => {
		expect(jsLikeGet('p.key', {p: {key: true}})).toEqual(true);
	});

	test('inset 2 not exists', () => {
		expect(jsLikeGet('p.key', {p: undefined})).toEqual(undefined);
	});
});
