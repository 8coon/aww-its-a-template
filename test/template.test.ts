import {formatters, makeTemplate} from "../src";

describe('makeTemplate', () => {
  test('Empty template', () => {
    const value = makeTemplate('', {});

    expect(value({})).toEqual('');
  });

  test('Template with no variables', () => {
    const value = makeTemplate('Hello!', {});

    expect(value(undefined as any)).toEqual('Hello!');
  });

  test('Template with no variables but with escape-sequences', () => {
    const value = makeTemplate('Hello! \\${var1}_$\\{var2}', {
      var1: formatters.String,
      var2: formatters.String,
    });

    expect(value({var1: '1', var2: '2'})).toEqual('Hello! ${var1}_${var2}');
  });

  test('Template with a variable and an escape-sequence in the beginning', () => {
    const value = makeTemplate('Hello! \\${var1}/${id}/', {
      var1: formatters.String,
      id: formatters.Number,
    });

    expect(value({var1: '1', id: 2})).toEqual('Hello! ${var1}/2/');
  });

  test('Template with variables', () => {
    const value = makeTemplate('Hello! ${var1}/${var2}', {
      var1: formatters.String,
      var2: formatters.String,
    });

    expect(value({var1: '1', var2: '2'})).toEqual('Hello! 1/2');
  });

  test('Template with a partial data', () => {
    const value = makeTemplate('Hello! ${var1}/${var2}', {
      var1: formatters.String,
      var2: formatters.String,
    });

    expect(value({var1: '1'} as any)).toEqual('Hello! 1/');
  });
});
