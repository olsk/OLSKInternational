const { throws, deepEqual } = require('assert');

const mod = require('./main');

const globSync = require('glob').sync;
const readFileSync = require('fs').readFileSync;
const writeFileSync = require('fs').writeFileSync;
const safeDump = require('js-yaml').safeDump; // #mysterious disappearing module

describe('OLSKInternationalDefaultIdentifier', function test_OLSKInternationalDefaultIdentifier() {

	it('returns string', function() {
		deepEqual(mod.OLSKInternationalDefaultIdentifier(), 'i18n');
	});

});

describe('OLSKInternationalIsTranslationFileBasename', function test_OLSKInternationalIsTranslationFileBasename() {

	it('returns false if not string', function() {
		deepEqual(mod.OLSKInternationalIsTranslationFileBasename(null), false);
	});

	it('returns false if without yaml extension', function() {
		deepEqual(mod.OLSKInternationalIsTranslationFileBasename('i18n.en.abc'), false);
	});

	it('returns false if without OLSKInternationalDefaultIdentifier', function() {
		deepEqual(mod.OLSKInternationalIsTranslationFileBasename('en.yaml'), false);
	});

	it('returns false if without languageID', function() {
		deepEqual(mod.OLSKInternationalIsTranslationFileBasename('i18n.yaml'), false);
	});

	it('returns true if valid translationFileBasename', function() {
		deepEqual(mod.OLSKInternationalIsTranslationFileBasename('i18n.en.yaml'), true);
		deepEqual(mod.OLSKInternationalIsTranslationFileBasename('i18n.en.yml'), true);
	});

});

describe('OLSKInternationalLanguageID', function test_OLSKInternationalLanguageID() {

	it('throws error if not valid', function() {
		throws(function() {
			mod.OLSKInternationalLanguageID(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns languageID', function() {
		deepEqual(mod.OLSKInternationalLanguageID('i18n.en.yaml'), 'en');
	});

});

describe('OLSKInternationalSimplifiedLanguageCode', function test_OLSKInternationalSimplifiedLanguageCode() {

	it('throws error if not string', function() {
		throws(function() {
			mod.OLSKInternationalSimplifiedLanguageCode(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns input', function() {
		deepEqual(mod.OLSKInternationalSimplifiedLanguageCode(''), '');
	});

	it('extracts first hyphenated segment', function() {
		deepEqual(mod.OLSKInternationalSimplifiedLanguageCode('alfa-bravo'), 'alfa');
	});

});

describe('OLSKInternationalLocalizedString', function test_OLSKInternationalLocalizedString() {

	it('throws error if param2 not object', function() {
		throws(function() {
			mod.OLSKInternationalLocalizedString('alfa', null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns localizedString', function() {
		deepEqual(mod.OLSKInternationalLocalizedString('alfa', {
			alfa: 'bravo',
		}), 'bravo');
	});

	it('returns alternate string if translation not available', function() {
		deepEqual(mod.OLSKInternationalLocalizedString('alfa', {
			charlie: 'bravo',
		}), 'TRANSLATION_MISSING');
	});

});

describe('OLSKInternationalLocalizedStringCallback', function test_OLSKInternationalLocalizedStringCallback() {

	it('throws error if param1 not object', function() {
		throws(function() {
			mod.OLSKInternationalLocalizedStringCallback(null, []);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws error if param2 not array', function() {
		throws(function() {
			mod.OLSKInternationalLocalizedStringCallback({}, null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns function', function() {
		deepEqual(typeof mod.OLSKInternationalLocalizedStringCallback({}, []), 'function');
	});

	context('callback', function () {

		it('throws error if param2 not array', function() {
			throws(function() {
				mod.OLSKInternationalLocalizedStringCallback({}, [])('alfa', null);
			}, /OLSKErrorInputNotValid/);
		});

		it('returns first request locale compound', function() {
			deepEqual(mod.OLSKInternationalLocalizedStringCallback({
				en: {
					alfa: 'bravo',
				},
				fr: {
					alfa: 'charlie',
				}
			}, [])('alfa', ['fr-CA']), 'charlie');
		});

		it('returns first request locale', function() {
			deepEqual(mod.OLSKInternationalLocalizedStringCallback({
				en: {
					alfa: 'bravo',
				},
				fr: {
					alfa: 'charlie',
				}
			}, [])('alfa', ['fr']), 'charlie');
		});

		it('returns first fallback locale compound', function() {
			deepEqual(mod.OLSKInternationalLocalizedStringCallback({
				en: {
					alfa: 'bravo',
				},
				fr: {
					alfa: 'charlie',
				}
			}, ['fr-CA'])('alfa', []), 'charlie');
		});

		it('returns first fallback locale', function() {
			deepEqual(mod.OLSKInternationalLocalizedStringCallback({
				en: {
					alfa: 'bravo',
				},
				fr: {
					alfa: 'charlie',
				}
			}, ['fr'])('alfa', []), 'charlie');
		});

		it('returns first locale', function() {
			deepEqual(mod.OLSKInternationalLocalizedStringCallback({
				en: {
					alfa: 'bravo',
				},
				fr: {
					alfa: 'charlie',
				}
			}, [])('alfa', []), 'bravo');
		});

		it('returns missing', function() {
			deepEqual(mod.OLSKInternationalLocalizedStringCallback({}, [])('alfa', []), 'TRANSLATION_MISSING');
		});
	
	});

});

describe('_OLSKInternationalPaths', function test__OLSKInternationalPaths() {

	it('throws error if not string', function() {
		throws(function() {
			mod._OLSKInternationalPaths(null)
		}, /OLSKErrorInputNotValid/);
	});

	it('throws error if not filled', function() {
		throws(function() {
			mod._OLSKInternationalPaths(' ')
		}, /OLSKErrorInputNotValid/);
	});

	it('calls globSync', function() {
		const cwd = Math.random().toString();
		const item = [];

		require('glob').sync = (function () {
			item.push(...arguments);

			return [];
		});

		mod._OLSKInternationalPaths(cwd);

		deepEqual(item, [`**/*${ mod.OLSKInternationalDefaultIdentifier() }*.y*(a)ml`, {
			cwd,
			realpath: true,
		}]);
	});

	it('returns globSync', function() {
		const item = Date.now().toString() + '/i18n.en.yml';

		require('glob').sync = (function () {
			return [item];
		});

		deepEqual(mod._OLSKInternationalPaths(Math.random().toString()), [item]);
	});

	it('filters globSync if param2', function() {
		require('glob').sync = (function () {
			return [
				Math.random().toString(),
				'alfa/i18n.en.yml',
				'__external/alfa/i18n.en.yml',
				'node_modules/alfa/i18n.en.yml',
			];
		});
		deepEqual(mod._OLSKInternationalPaths(Math.random().toString(), /node_modules/), [
			'alfa/i18n.en.yml',
			'__external/alfa/i18n.en.yml',
			]);
	});

	afterEach(function () {
		require('glob').sync = globSync;
	});

});

describe('_OLSKInternationalConstructedDictionary', function test__OLSKInternationalConstructedDictionary() {

	it('throws error if param2 not array', function() {
		throws(function() {
			mod._OLSKInternationalConstructedDictionary(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('calls readFileSync', function() {
		const item = [];

		require('fs').readFileSync = (function () {
			item.push(...arguments);
			return '{}';
		});

		mod._OLSKInternationalConstructedDictionary(['alfa/i18n.en.yml']);

		deepEqual(item, ['alfa/i18n.en.yml', 'utf8']);
	});

	it('constructs dictionary', function() {
		const alfa = Date.now().toString();

		require('fs').readFileSync = (function () {
			return JSON.stringify({ alfa });
		});

		deepEqual(mod._OLSKInternationalConstructedDictionary(['alfa/i18n.en.yml']), {
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
		return Object.assign(Object.assign({}, mod), {
			_OLSKInternationalPaths: params._OLSKInternationalPaths || (function () {}),
			_OLSKInternationalConstructedDictionary: params._OLSKInternationalConstructedDictionary || (function () {}),
		}).OLSKInternationalDictionary(cwd);
	};

	it('throws error if not string', function() {
		throws(function() {
			mod.OLSKInternationalDictionary(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws error if not filled', function() {
		throws(function() {
			mod.OLSKInternationalDictionary(' ');
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

		deepEqual(item, [cwd]);
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

		deepEqual(item, [paths]);
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

	const __OLSKInternationalCompilationObject = function (params, cwd, languageID) {
		return Object.assign(Object.assign({}, mod), {
			_OLSKInternationalPaths: params._OLSKInternationalPaths || (function () {}),
		})._OLSKInternationalCompilationObject(cwd, languageID);
	};

	it('throws error if not string', function() {
		throws(function() {
			mod._OLSKInternationalCompilationObject(null)
		}, /OLSKErrorInputNotValid/);
	});

	it('throws error if not filled', function() {
		throws(function() {
			mod._OLSKInternationalCompilationObject(' ')
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

		deepEqual(item, [cwd, /node_modules|__external/]);
	});

	it('returns object', function() {
		const path = Date.now().toString();
		const alfa = Math.random().toString();

		require('fs').readFileSync = (function () {
			return JSON.stringify({ alfa });
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

	it('filters if param3', function() {
		const path = 'alfa/i18n.en.yml';

		deepEqual(__OLSKInternationalCompilationObject({
			_OLSKInternationalPaths: (function () {
				return [path];
			}),
		}, Math.random().toString(), 'fr'), {});
	});

	afterEach(function () {
		require('fs').readFileSync = readFileSync;
	});

});

describe('_OLSKInternationalCompilationFilePath', function test__OLSKInternationalCompilationFilePath() {

	it('throws error if not string', function() {
		throws(function() {
			mod._OLSKInternationalCompilationFilePath(null)
		}, /OLSKErrorInputNotValid/);
	});

	it('throws error if not filled', function() {
		throws(function() {
			mod._OLSKInternationalCompilationFilePath(' ')
		}, /OLSKErrorInputNotValid/);
	});

	it('returns string', function () {
		deepEqual(mod._OLSKInternationalCompilationFilePath('alfa'), `alfa/__compiled/${ mod.OLSKInternationalDefaultIdentifier() }-compilation.yml`);
	});

});

describe('OLSKInternationalWriteCompilationFile', function test_OLSKInternationalWriteCompilationFile() {

	const _OLSKInternationalWriteCompilationFile = function (params, cwd, languageID) {
		return Object.assign(Object.assign({}, mod), {
			_OLSKInternationalCompilationObject: params._OLSKInternationalCompilationObject || (function () {}),
		}).OLSKInternationalWriteCompilationFile(cwd, languageID);
	};

	beforeEach(function () {
		require('fs').writeFileSync = (function () {});
	});

	it('throws error if not string', function() {
		throws(function() {
			mod.OLSKInternationalWriteCompilationFile(null)
		}, /OLSKErrorInputNotValid/);
	});

	it('throws error if not filled', function() {
		throws(function() {
			mod.OLSKInternationalWriteCompilationFile(' ')
		}, /OLSKErrorInputNotValid/);
	});

	it('calls _OLSKInternationalCompilationObject', function() {
		const cwd = Math.random().toString();
		const languageID = Math.random().toString();
		const item = [];

		_OLSKInternationalWriteCompilationFile({
			_OLSKInternationalCompilationObject: (function () {
				item.push(...arguments);
				return {};
			}),
		}, cwd, languageID);

		deepEqual(item, [cwd, languageID]);
	});

	it('calls writeFileSync', function() {
		const cwd = Date.now().toString();
		const _OLSKInternationalCompilationObject = {
			alfa: Date.now().toString(),
		};
		const item = [];

		require('fs').writeFileSync = (function () {
			item.push(...arguments);
		});

		_OLSKInternationalWriteCompilationFile({
			_OLSKInternationalCompilationObject: (function () {
				return _OLSKInternationalCompilationObject;
			}),
		}, cwd);

		deepEqual(item, [mod._OLSKInternationalCompilationFilePath(cwd), safeDump(_OLSKInternationalCompilationObject)]);
	});

	it('returns undefined', function() {

		deepEqual(_OLSKInternationalWriteCompilationFile({
			_OLSKInternationalCompilationObject: (function () {
				return {};
			}),
		}, Date.now().toString()), undefined);
	});

	afterEach(function () {
		require('fs').writeFileSync = writeFileSync;
	});

});

describe('OLSKInternationalSpreadCompilationFile', function test_OLSKInternationalSpreadCompilationFile() {

	it('throws error if not string', function() {
		throws(function() {
			mod.OLSKInternationalSpreadCompilationFile(null)
		}, /OLSKErrorInputNotValid/);
	});

	it('throws error if not filled', function() {
		throws(function() {
			mod.OLSKInternationalSpreadCompilationFile(' ')
		}, /OLSKErrorInputNotValid/);
	});

	it('calls readFileSync', function() {
		const cwd = Date.now().toString();
		const item = [];

		require('fs').readFileSync = (function () {
			item.push(...arguments);
			return '{}';
		});

		mod.OLSKInternationalSpreadCompilationFile(cwd);

		deepEqual(item, [mod._OLSKInternationalCompilationFilePath(cwd), 'utf8']);
	});

	it('calls writeFileSync', function() {
		const compilation = {
			alfa: {
				bravo: Math.random().toString(),
			},
			charlie: {
				bravo: Math.random().toString(),
			},
		};
		const item = [];

		require('fs').readFileSync = (function () {
			return safeDump(compilation);
		});
		require('fs').writeFileSync = (function () {
			item.push(Array.from(arguments));
		});

		mod.OLSKInternationalSpreadCompilationFile(Math.random().toString());

		deepEqual(item, Object.keys(compilation).map(function (e) {
			return [e, safeDump(compilation[e])];
		}));
	});

	it('returns undefined', function() {
		require('fs').readFileSync = (function () {
			return '{}';
		});
		require('fs').writeFileSync = (function () {});

		deepEqual(mod.OLSKInternationalSpreadCompilationFile(Date.now().toString()), undefined);
	});

	afterEach(function () {
		require('fs').readFileSync = readFileSync;
		require('fs').writeFileSync = writeFileSync;
	});

});

describe('OLSKInternationalAddControllerLanguageCode', function test_OLSKInternationalAddControllerLanguageCode() {

	it('throws error if param1 not string', function() {
		throws(function() {
			mod.OLSKInternationalAddControllerLanguageCode(null, Math.random().toString());
		}, /OLSKErrorInputNotValid/);
	});

	it('throws error if param1 not filled', function() {
		throws(function() {
			mod.OLSKInternationalAddControllerLanguageCode(' ', Math.random().toString());
		}, /OLSKErrorInputNotValid/);
	});

	it('throws error if param2 not string', function() {
		throws(function() {
			mod.OLSKInternationalAddControllerLanguageCode(Math.random().toString(), null);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws error if param2 not filled', function() {
		throws(function() {
			mod.OLSKInternationalAddControllerLanguageCode(Math.random().toString(), ' ');
		}, /OLSKErrorInputNotValid/);
	});

	it('calls globSync', function() {
		const cwd = Math.random().toString();
		const item = [];

		require('glob').sync = (function () {
			item.push(...arguments);

			return [];
		});

		mod.OLSKInternationalAddControllerLanguageCode(cwd, Math.random().toString());

		deepEqual(item, ['controller.js', {
			cwd,
			matchBase: true,
			realpath: true,
		}]);
	});

	afterEach(function () {
		require('glob').sync = globSync;
		require('fs').readFileSync = readFileSync;
		require('fs').writeFileSync = writeFileSync;
	});

});
