const { throws, deepEqual } = require('assert');

const mainModule = require('./main');

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
			OLSKInternationalFileDelegateDirectory: Math.random().toString(),
			OLSKInternationalFileDelegateGlobSync: (function () {}),
			OLSKInternationalFileDelegateFileRead: (function () {}),
			OLSKInternationalFileDelegateYAMLRead: (function () {}),
			OLSKInternationalFileDelegateFileWrite: (function () {}),
		}, inputData));
	};

	it('throws error if not object', function() {
		throws(function() {
			mainModule.OLSKInternationalFileDelegateErrors(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns true if OLSKInternationalFileDelegateDirectory not string', function() {
		deepEqual(_OLSKInternationalFileDelegateErrors({
			OLSKInternationalFileDelegateDirectory: null,
		}), true);
	});

	it('returns true if OLSKInternationalFileDelegateDirectory not filled', function() {
		deepEqual(_OLSKInternationalFileDelegateErrors({
			OLSKInternationalFileDelegateDirectory: ' ',
		}), true);
	});

	it('returns true if OLSKInternationalFileDelegateGlobSync not function', function() {
		deepEqual(_OLSKInternationalFileDelegateErrors({
			OLSKInternationalFileDelegateGlobSync: null,
		}), true);
	});

	it('returns true if OLSKInternationalFileDelegateFileRead not function', function() {
		deepEqual(_OLSKInternationalFileDelegateErrors({
			OLSKInternationalFileDelegateFileRead: null,
		}), true);
	});

	it('returns true if OLSKInternationalFileDelegateYAMLRead not function', function() {
		deepEqual(_OLSKInternationalFileDelegateErrors({
			OLSKInternationalFileDelegateYAMLRead: null,
		}), true);
	});

	it('returns true if OLSKInternationalFileDelegateFileWrite not function', function() {
		deepEqual(_OLSKInternationalFileDelegateErrors({
			OLSKInternationalFileDelegateFileWrite: null,
		}), true);
	});

	it('returns false', function() {
		deepEqual(_OLSKInternationalFileDelegateErrors(), false);
	});

});

describe('_OLSKInternationalPaths', function test__OLSKInternationalPaths() {

	const __OLSKInternationalPaths = function (inputData) {
		return mainModule._OLSKInternationalPaths(Object.assign({
			OLSKInternationalFileDelegateDirectory: Math.random().toString(),
			OLSKInternationalFileDelegateGlobSync: (function () {
				return [];
			}),
			OLSKInternationalFileDelegateFileRead: (function () {}),
			OLSKInternationalFileDelegateYAMLRead: (function () {}),
			OLSKInternationalFileDelegateFileWrite: (function () {}),
		}, inputData));
	};

	it('throws error if not valid', function() {
		throws(function() {
			mainModule._OLSKInternationalPaths({});
		}, /OLSKErrorInputNotValid/);
	});

	it('calls OLSKInternationalFileDelegateGlobSync', function() {
		const OLSKInternationalFileDelegateDirectory = Math.random().toString();
		const item = [];

		__OLSKInternationalPaths({
			OLSKInternationalFileDelegateDirectory,	
			OLSKInternationalFileDelegateGlobSync: (function () {
				item.push(...arguments);
				return [];
			}),
		});

		deepEqual(item, [`**/*${ mainModule.OLSKInternationalDefaultIdentifier() }*.y*(a)ml`, {
			cwd: OLSKInternationalFileDelegateDirectory,
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
			OLSKInternationalFileDelegateDirectory: Math.random().toString(),
			OLSKInternationalFileDelegateGlobSync: (function () {
				return [];
			}),
			OLSKInternationalFileDelegateFileRead: (function () {}),
			OLSKInternationalFileDelegateYAMLRead: (function () {}),
			OLSKInternationalFileDelegateFileWrite: (function () {}),
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

	it('calls OLSKInternationalFileDelegateFileRead', function() {
		const item = [];

		__OLSKInternationalConstructedDictionary({
			OLSKInternationalFileDelegateFileRead: (function () {
				item.push(...arguments);
				return '';
			}),
		}, ['alfa/i18n.en.yml']);

		deepEqual(item, ['alfa/i18n.en.yml', 'utf8']);
	});

	it('constructs dictionary', function() {
		const alfa = Date.now().toString();

		deepEqual(__OLSKInternationalConstructedDictionary({
			OLSKInternationalFileDelegateFileRead: (function () {
				return `alfa:${ alfa }`;
			}),
			OLSKInternationalFileDelegateYAMLRead: (function (inputData) {
				return Object.fromEntries([inputData.split(':')]);
			}),
		}, ['alfa/i18n.en.yml']), {
			en: {
				alfa,
			},
		});
	});

});

describe('OLSKInternationalDictionary', function test_OLSKInternationalDictionary() {

	const _OLSKInternationalDictionary = function (inputData) {
		return Object.assign(Object.assign({}, mainModule), {
			_OLSKInternationalPaths: inputData._OLSKInternationalPaths || (function () {}),
			_OLSKInternationalConstructedDictionary: inputData._OLSKInternationalConstructedDictionary || (function () {}),
		}).OLSKInternationalDictionary(inputData.params);
	};

	it('throws error if not valid', function() {
		throws(function() {
			mainModule.OLSKInternationalDictionary({});
		}, /OLSKErrorInputNotValid/);
	});

	it('calls _OLSKInternationalPaths', function() {
		const params = Date.now().toString();
		const item = [];

		_OLSKInternationalDictionary({
			_OLSKInternationalPaths: (function () {
				item.push(...arguments);
				return '';
			}),
			params,
		});

		deepEqual(item, [params]);
	});

	it('calls _OLSKInternationalConstructedDictionary', function() {
		const params = Date.now().toString();
		const paths = [Date.now().toString()];
		const item = [];

		_OLSKInternationalDictionary({
			_OLSKInternationalPaths: (function () {
				return paths;
			}),
			_OLSKInternationalConstructedDictionary: (function () {
				item.push(...arguments);
			}),
			params,
		});

		deepEqual(item, [params, paths]);
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
