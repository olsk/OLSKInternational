const { throws, deepEqual } = require('assert');

const mainModule = require('./main');

const readFileSync = require('fs').readFileSync;

const OLSKInternationalFileDelegateYAMLRead = (function (inputData) {
	return Object.fromEntries([inputData.split(':')]);
});

describe('OLSKInternationalDefaultIdentifier', function test_OLSKInternationalDefaultIdentifier() {

	it('returns string', function() {
		deepEqual(mainModule.OLSKInternationalDefaultIdentifier(), 'i18n');
	});

});

describe('OLSKInternationalIsTranslationFileBasename', function test_OLSKInternationalIsTranslationFileBasename() {

	it('returns false if not string', function() {
		deepEqual(mainModule.OLSKInternationalIsTranslationFileBasename(null), false);
	});

	it('returns false if without yaml extension', function() {
		deepEqual(mainModule.OLSKInternationalIsTranslationFileBasename('i18n.en.abc'), false);
	});

	it('returns false if without OLSKInternationalDefaultIdentifier', function() {
		deepEqual(mainModule.OLSKInternationalIsTranslationFileBasename('en.yaml'), false);
	});

	it('returns false if without languageID', function() {
		deepEqual(mainModule.OLSKInternationalIsTranslationFileBasename('i18n.yaml'), false);
	});

	it('returns true if valid translationFileBasename', function() {
		deepEqual(mainModule.OLSKInternationalIsTranslationFileBasename('i18n.en.yaml'), true);
		deepEqual(mainModule.OLSKInternationalIsTranslationFileBasename('i18n.en.yml'), true);
	});

});

describe('OLSKInternationalLanguageID', function test_OLSKInternationalLanguageID() {

	it('throws error if not valid', function() {
		throws(function() {
			mainModule.OLSKInternationalLanguageID(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns languageID', function() {
		deepEqual(mainModule.OLSKInternationalLanguageID('i18n.en.yaml'), 'en');
	});

});

describe('OLSKInternationalSimplifiedLanguageCode', function test_OLSKInternationalSimplifiedLanguageCode() {

	it('throws error if not string', function() {
		throws(function() {
			mainModule.OLSKInternationalSimplifiedLanguageCode(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns input', function() {
		deepEqual(mainModule.OLSKInternationalSimplifiedLanguageCode(''), '');
	});

	it('extracts first hyphenated segment', function() {
		deepEqual(mainModule.OLSKInternationalSimplifiedLanguageCode('alfa-bravo'), 'alfa');
	});

});

describe('OLSKInternationalLocalizedString', function test_OLSKInternationalLocalizedString() {

	it('throws error if param2 not object', function() {
		throws(function() {
			mainModule.OLSKInternationalLocalizedString('alfa', null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns localizedString', function() {
		deepEqual(mainModule.OLSKInternationalLocalizedString('alfa', {
			alfa: 'bravo',
		}), 'bravo');
	});

	it('returns alternate string if translation not available', function() {
		deepEqual(mainModule.OLSKInternationalLocalizedString('alfa', {
			charlie: 'bravo',
		}), 'TRANSLATION_MISSING');
	});

});

describe('OLSKInternationalLocalizedStringCallback', function test_OLSKInternationalLocalizedStringCallback() {

	it('throws error if param1 not object', function() {
		throws(function() {
			mainModule.OLSKInternationalLocalizedStringCallback(null, []);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws error if param2 not array', function() {
		throws(function() {
			mainModule.OLSKInternationalLocalizedStringCallback({}, null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns function', function() {
		deepEqual(typeof mainModule.OLSKInternationalLocalizedStringCallback({}, []), 'function');
	});

	context('callback', function () {

		it('throws error if param2 not array', function() {
			throws(function() {
				mainModule.OLSKInternationalLocalizedStringCallback({}, [])('alfa', null);
			}, /OLSKErrorInputNotValid/);
		});

		it('returns first request locale compound', function() {
			deepEqual(mainModule.OLSKInternationalLocalizedStringCallback({
				en: {
					alfa: 'bravo',
				},
				fr: {
					alfa: 'charlie',
				}
			}, [])('alfa', ['fr-CA']), 'charlie');
		});

		it('returns first request locale', function() {
			deepEqual(mainModule.OLSKInternationalLocalizedStringCallback({
				en: {
					alfa: 'bravo',
				},
				fr: {
					alfa: 'charlie',
				}
			}, [])('alfa', ['fr']), 'charlie');
		});

		it('returns first fallback locale compound', function() {
			deepEqual(mainModule.OLSKInternationalLocalizedStringCallback({
				en: {
					alfa: 'bravo',
				},
				fr: {
					alfa: 'charlie',
				}
			}, ['fr-CA'])('alfa', []), 'charlie');
		});

		it('returns first fallback locale', function() {
			deepEqual(mainModule.OLSKInternationalLocalizedStringCallback({
				en: {
					alfa: 'bravo',
				},
				fr: {
					alfa: 'charlie',
				}
			}, ['fr'])('alfa', []), 'charlie');
		});

		it('returns first locale', function() {
			deepEqual(mainModule.OLSKInternationalLocalizedStringCallback({
				en: {
					alfa: 'bravo',
				},
				fr: {
					alfa: 'charlie',
				}
			}, [])('alfa', []), 'bravo');
		});

		it('returns missing', function() {
			deepEqual(mainModule.OLSKInternationalLocalizedStringCallback({}, [])('alfa', []), 'TRANSLATION_MISSING');
		});
	
	});

});

describe('OLSKInternationalFileDelegateErrors', function test_OLSKInternationalFileDelegateErrors() {

	const _OLSKInternationalFileDelegateErrors = function (inputData) {
		return mainModule.OLSKInternationalFileDelegateErrors(Object.assign({
			OLSKInternationalFileDelegateGlobSync: (function () {}),
			OLSKInternationalFileDelegateYAMLRead,
		}, inputData));
	};

	it('throws error if not object', function() {
		throws(function() {
			mainModule.OLSKInternationalFileDelegateErrors(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns true if OLSKInternationalFileDelegateGlobSync not function', function() {
		deepEqual(_OLSKInternationalFileDelegateErrors({
			OLSKInternationalFileDelegateGlobSync: null,
		}), true);
	});

	it('returns true if OLSKInternationalFileDelegateYAMLRead not function', function() {
		deepEqual(_OLSKInternationalFileDelegateErrors({
			OLSKInternationalFileDelegateYAMLRead: null,
		}), true);
	});

	it('returns false', function() {
		deepEqual(_OLSKInternationalFileDelegateErrors(), false);
	});

});

describe('_OLSKInternationalPaths', function test__OLSKInternationalPaths() {

	const __OLSKInternationalPaths = function (params, cwd = Math.random().toString()) {
		return mainModule._OLSKInternationalPaths(Object.assign({
			OLSKInternationalFileDelegateGlobSync: (function () {
				return [];
			}),
			OLSKInternationalFileDelegateYAMLRead,
		}, params), cwd);
	};

	it('throws error if param1 not valid', function() {
		throws(function() {
			mainModule._OLSKInternationalPaths({}, Math.random().toString());
		}, /OLSKErrorInputNotValid/);
	});

	it('throws error if param2 not string', function() {
		throws(function() {
			__OLSKInternationalPaths({}, null)
		}, /OLSKErrorInputNotValid/);
	});

	it('throws error if param2 not filled', function() {
		throws(function() {
			__OLSKInternationalPaths({}, ' ')
		}, /OLSKErrorInputNotValid/);
	});

	it('calls OLSKInternationalFileDelegateGlobSync', function() {
		const cwd = Math.random().toString();
		const item = [];

		__OLSKInternationalPaths({
			OLSKInternationalFileDelegateGlobSync: (function () {
				item.push(...arguments);
				return [];
			}),
		}, cwd);

		deepEqual(item, [`**/*${ mainModule.OLSKInternationalDefaultIdentifier() }*.y*(a)ml`, {
			cwd,
			realpath: true,
		}]);
	});

	it('returns OLSKInternationalFileDelegateGlobSync', function() {
		const item = Date.now().toString() + '/i18n.en.yml';

		deepEqual(__OLSKInternationalPaths({
			OLSKInternationalFileDelegateGlobSync: (function () {
				return [item];
			})
		}), [item]);
	});

	it('filters OLSKInternationalFileDelegateGlobSync', function() {
		deepEqual(__OLSKInternationalPaths({
			OLSKInternationalFileDelegateGlobSync: (function () {
				return [
					Math.random().toString(),
					'alfa/i18n.en.yml',
				];
			}),
		}), ['alfa/i18n.en.yml']);
	});

});

describe('_OLSKInternationalConstructedDictionary', function test__OLSKInternationalConstructedDictionary() {

	const __OLSKInternationalConstructedDictionary = function (param1, param2) {
		return mainModule._OLSKInternationalConstructedDictionary(Object.assign({
			OLSKInternationalFileDelegateGlobSync: (function () {
				return [];
			}),
			OLSKInternationalFileDelegateYAMLRead,
		}, param1), param2);
	};

	it('throws error if param1 not valid', function() {
		throws(function() {
			mainModule._OLSKInternationalConstructedDictionary({}, []);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws error if param2 not array', function() {
		throws(function() {
			__OLSKInternationalConstructedDictionary({}, null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns object', function() {
		deepEqual(__OLSKInternationalConstructedDictionary({}, []), {});
	});

	it('calls readFileSync', function() {
		const item = [];

		require('fs').readFileSync = (function () {
			item.push(...arguments);
			return '';
		});

		__OLSKInternationalConstructedDictionary({
		}, ['alfa/i18n.en.yml']);

		deepEqual(item, ['alfa/i18n.en.yml', 'utf8']);
	});

	it('constructs dictionary', function() {
		const alfa = Date.now().toString();

		require('fs').readFileSync = (function () {
			return `alfa:${ alfa }`;
		});

		deepEqual(__OLSKInternationalConstructedDictionary({}, ['alfa/i18n.en.yml']), {
			en: {
				alfa,
			},
		});
	});

	afterEach(function () {
		require('fs').readFileSync = readFileSync;
	});

});

describe('OLSKInternationalDictionary', function test_OLSKInternationalDictionary() {

	const _OLSKInternationalDictionary = function (params, cwd) {
		return Object.assign(Object.assign({}, mainModule), {
			_OLSKInternationalPaths: params._OLSKInternationalPaths || (function () {}),
			_OLSKInternationalConstructedDictionary: params._OLSKInternationalConstructedDictionary || (function () {}),
		}).OLSKInternationalDictionary({}, cwd);
	};

	it('throws error if param1 not valid', function() {
		throws(function() {
			mainModule.OLSKInternationalDictionary({});
		}, /OLSKErrorInputNotValid/);
	});

	it('throws error if param2 not string', function() {
		throws(function() {
			mainModule.OLSKInternationalDictionary({}, null)
		}, /OLSKErrorInputNotValid/);
	});

	it('throws error if param2 not filled', function() {
		throws(function() {
			mainModule.OLSKInternationalDictionary({}, ' ')
		}, /OLSKErrorInputNotValid/);
	});

	it('calls _OLSKInternationalPaths', function() {
		const cwd = Date.now().toString();
		const item = [];

		_OLSKInternationalDictionary({
			_OLSKInternationalPaths: (function () {
				item.push(...arguments);
				return '';
			}),
		}, cwd);

		deepEqual(item, [{}, cwd]);
	});

	it('calls _OLSKInternationalConstructedDictionary', function() {
		const paths = [Date.now().toString()];
		const item = [];

		_OLSKInternationalDictionary({
			_OLSKInternationalPaths: (function () {
				return paths;
			}),
			_OLSKInternationalConstructedDictionary: (function () {
				item.push(...arguments);
			}),
		});

		deepEqual(item, [{}, paths]);
	});

	it('returns _OLSKInternationalConstructedDictionary', function() {
		const item = Date.now().toString();

		deepEqual(_OLSKInternationalDictionary({
			_OLSKInternationalConstructedDictionary: (function () {
				return item;
			}),
		}), item);
	});

});

describe('_OLSKInternationalCompilationObject', function test__OLSKInternationalCompilationObject() {

	const __OLSKInternationalCompilationObject = function (params, cwd) {
		return Object.assign(Object.assign({}, mainModule), {
			_OLSKInternationalPaths: params._OLSKInternationalPaths || (function () {}),
		})._OLSKInternationalCompilationObject({
			OLSKInternationalFileDelegateYAMLRead,
		}, cwd);
	};

	it('throws error if param1 not valid', function() {
		throws(function() {
			mainModule._OLSKInternationalCompilationObject({});
		}, /OLSKErrorInputNotValid/);
	});

	it('throws error if param2 not string', function() {
		throws(function() {
			mainModule._OLSKInternationalCompilationObject({}, null)
		}, /OLSKErrorInputNotValid/);
	});

	it('throws error if param2 not filled', function() {
		throws(function() {
			mainModule._OLSKInternationalCompilationObject({}, ' ')
		}, /OLSKErrorInputNotValid/);
	});

	it('calls _OLSKInternationalPaths', function() {
		const cwd = Date.now().toString();
		const item = [];

		__OLSKInternationalCompilationObject({
			_OLSKInternationalPaths: (function () {
				item.push(...arguments);
				return [];
			}),
		}, cwd);

		deepEqual(item, [{
			OLSKInternationalFileDelegateYAMLRead,
		}, cwd]);
	});

	it('returns object', function() {
		const path = Date.now().toString();
		const alfa = Math.random().toString();

		require('fs').readFileSync = (function () {
			return `alfa:${ alfa }`;
		});

		deepEqual(__OLSKInternationalCompilationObject({
			_OLSKInternationalPaths: (function () {
				return [path];
			}),
		}), {
			[path]: {
				alfa,
			},
		});
	});

	afterEach(function () {
		require('fs').readFileSync = readFileSync;
	});

});
