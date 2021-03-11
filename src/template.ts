import {TemplateValueFormatter} from "./formatters";

type ParsedTemplate = (string | ((context: Record<string, any>) => string))[];

const R_URL_VAR = /\u0024{[\w_.]+}/g;

// Функция разворачивает escape-последовательности в шаблонах features.getAsTemplate
function unescapeTemplateString(value: string): string {
	return value.replace(/\\\$/g, '$$').replace(/\\{/g, '{');
}

// Фабрика скомпилированных шаблонов для features.getAsTemplate
function compileTemplate<C>(parsedTemplate: ParsedTemplate): (context: C) => string {
	return function(context: C) {
		context = (context && typeof context === 'object') ? context : ({} as C);
		let result = [];

		for (const part of parsedTemplate) {
			switch (typeof part) {
				case "function":
					// Форматируем вставляемое значение
					try {
						result.push(part(context));
					} catch (error) {
						// Safe mode!
					}

					break;

				case 'string':
				default:
					result.push(part);
					break;
			}
		}

		return result.join('');
	}
}

// Основная реализация шаблонизатора
export function makeTemplate<D extends Record<string, TemplateValueFormatter<unknown>>>(
	source: string,
	descriptor: D,
): (context: (
	{
		[variable in keyof D]: ReturnType<D[variable]>;
	}
)) => string {
	const parsedTemplate: ParsedTemplate = [];
	let matched;
	let lastIndex = 0;
	let staticSlice;
	let formatter;

	do {
		matched = R_URL_VAR.exec(source);

		if (matched && typeof matched[0] === 'string') {

			// Если наткнулись на escape-последовательность
			if (source.slice(matched.index - 1, matched.index) === '\\') {

				// Записываем предыдущую часть без echo-символа '\'
				staticSlice = source.slice(lastIndex, matched.index - 1);
				parsedTemplate.push(unescapeTemplateString(staticSlice));
				// Записываем сырую переменную
				parsedTemplate.push(source.slice(matched.index, matched.index + matched[0].length));
			} else {

				// Записываем предыдущую часть
				staticSlice = source.slice(lastIndex, matched.index);
				parsedTemplate.push(unescapeTemplateString(staticSlice));

				// Получаем имя переменной
				const name = matched[0].slice(2, matched[0].length - 1);

				// Создаём функцию её форматирования
				formatter = (context: Record<string, unknown>) => {
					const [varName, ...path] = name.split('.');

					// TODO: Figure out how to get rid of any here
					(descriptor[varName].validate as any)(context[varName]);
					return descriptor[varName].format(path, context[varName]);
				}

				// Записываем
				parsedTemplate.push(formatter);
			}

			// Сохраняем позицию
			lastIndex = matched.index + matched[0].length;
		}
	} while (matched !== null);

	// Записываем конец строки
	staticSlice = source.slice(lastIndex);
	parsedTemplate.push(unescapeTemplateString(staticSlice));

	return compileTemplate(parsedTemplate);
}
