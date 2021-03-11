import {jsLikeGet} from "./jsLikeGet";

export interface TemplateValueFormatterOptions<T = unknown> {
	validate(value: unknown): asserts value is T;
	format(path: string[], value: T): string;
}

export interface TemplateValueFormatter<T> extends TemplateValueFormatterOptions<T> {
	(value: unknown): T;
}

export interface Formatters {
	String: TemplateValueFormatter<string>;
	Number: TemplateValueFormatter<number>;
	Any: TemplateValueFormatter<any>;
}

export function createFormatter<T>(options: TemplateValueFormatterOptions<T>): TemplateValueFormatter<T> {
	function formatter(): T {
		return undefined as any as T;
	}

	formatter.validate = options.validate;
	formatter.format = options.format;

	return formatter;
}

export const formatters: Formatters = {
	String: createFormatter({
		validate(value: unknown): asserts value is string {
			if (typeof value !== 'string') {
				throw new Error('Bad format');
			}
		},
		format(_key: string[], value: string): string {
			return String(value);
		},
	}),

	Number: createFormatter({
		validate(value: unknown): asserts value is number {
			if (typeof value !== 'number') {
				throw new Error('Bad format');
			}
		},
		format(_key: string[], value: number): string {
			return String(value);
		},
	}),

	Any: createFormatter({
		validate(_value: unknown): boolean {
			return true;
		},
		format(key: string[], value: any): string {
			value = jsLikeGet(key, value);

			return String(value);
		},
	})
};
