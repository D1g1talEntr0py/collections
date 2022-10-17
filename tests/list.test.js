import { describe, expect, test } from '@jest/globals';
import List from '../src/list.js';

describe('Constructor', () => {
	test('Empty Constructor', () => expect(new List().size).toEqual(0));
	test('Number Array', () => expect(new List([2]).size).toEqual(1));
	test('String Array', () => expect(new List(['string']).size).toEqual(1));
	test('String', () => expect(new List('string').size).toEqual(6));
	test('Empty Set', () => expect(new List(new Set()).size).toEqual(0));
	test('Set of Objects', () => expect(new List(new Set([{foo: 'bar'}, {foo: 'zoo'}])).size).toEqual(2));
	test('Map<string, string>', () => expect(new List(new Map([['key', 'value']])).size).toEqual(1));

});