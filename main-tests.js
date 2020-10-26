const { throws, deepEqual } = require('assert');

const mainModule = require('./main');

const globSync = require('glob').sync;
const readFileSync = require('fs').readFileSync;
const writeFileSync = require('fs').writeFileSync;

const OLSKInternationalFileDelegateYAMLRead = JSON.parse;
const OLSKInternationalFileDelegateYAMLDump = JSON.stringify;

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

	context('OLSKInternationalFileDelegateYAMLDump', function () {
		
		it('returns true if OLSKInternationalFileDelegateYAMLDump not function', function() {
			deepEqual(_OLSKInternationalFileDelegateErrors({
				OLSKInternationalFileDelegateYAMLDump: 'alfa',
			}), true);
		});

		it('returns false', function() {
			deepEqual(_OLSKInternationalFileDelegateErrors({
				OLSKInternationalFileDelegateYAMLDump,
			}), false);
		});
	
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

	it('calls readFileSync', function() {
		const item = [];

		require('fs').readFileSync = (function () {
			item.push(...arguments);
			return '{}';
		});

		__OLSKInternationalConstructedDictionary({}, ['alfa/i18n.en.yml']);

		deepEqual(item, ['alfa/i18n.en.yml', 'utf8']);
	});

	it('constructs dictionary', function() {
		const alfa = Date.now().toString();

		require('fs').readFileSync = (function () {
			return JSON.stringify({ alfa });
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

	const __OLSKInternationalCompilationObject = function (params, cwd, languageID) {
		return Object.assign(Object.assign({}, mainModule), {
			_OLSKInternationalPaths: params._OLSKInternationalPaths || (function () {}),
		})._OLSKInternationalCompilationObject({
			OLSKInternationalFileDelegateYAMLRead,
		}, cwd, languageID);
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
			mainModule._OLSKInternationalCompilationFilePath(null)
		}, /OLSKErrorInputNotValid/);
	});

	it('throws error if not filled', function() {
		throws(function() {
			mainModule._OLSKInternationalCompilationFilePath(' ')
		}, /OLSKErrorInputNotValid/);
	});

	it('returns string', function () {
		deepEqual(mainModule._OLSKInternationalCompilationFilePath('alfa'), `alfa/__compiled/${ mainModule.OLSKInternationalDefaultIdentifier() }-compilation.yml`);
	});

});

describe('OLSKInternationalWriteCompilationFile', function test_OLSKInternationalWriteCompilationFile() {

	const _OLSKInternationalWriteCompilationFile = function (params, cwd, languageID) {
		return Object.assign(Object.assign({}, mainModule), {
			_OLSKInternationalCompilationObject: params._OLSKInternationalCompilationObject || (function () {}),
		}).OLSKInternationalWriteCompilationFile({
			OLSKInternationalFileDelegateYAMLRead,
			OLSKInternationalFileDelegateYAMLDump,
		}, cwd, languageID);
	};

	it('throws error if param1 not valid', function() {
		throws(function() {
			mainModule.OLSKInternationalWriteCompilationFile({});
		}, /OLSKErrorInputNotValid/);
	});

	it('throws error if param1 with no OLSKInternationalFileDelegateYAMLDump', function() {
		throws(function() {
			mainModule.OLSKInternationalWriteCompilationFile({
				OLSKInternationalFileDelegateYAMLRead,
				OLSKInternationalFileDelegateYAMLDump: null,
			}, Date.now().toString());
		}, /OLSKErrorInputNotValid/);
	});

	it('throws error if param2 not string', function() {
		throws(function() {
			mainModule.OLSKInternationalWriteCompilationFile({
				OLSKInternationalFileDelegateYAMLRead,
				OLSKInternationalFileDelegateYAMLDump,
			}, null)
		}, /OLSKErrorInputNotValid/);
	});

	it('throws error if param2 not filled', function() {
		throws(function() {
			mainModule.OLSKInternationalWriteCompilationFile({
				OLSKInternationalFileDelegateYAMLRead,
				OLSKInternationalFileDelegateYAMLDump,
			}, ' ')
		}, /OLSKErrorInputNotValid/);
	});

	it('calls _OLSKInternationalCompilationObject', function() {
		const cwd = Math.random().toString();
		const languageID = Math.random().toString();
		const item = [];

		require('fs').writeFileSync = (function () {});

		_OLSKInternationalWriteCompilationFile({
			_OLSKInternationalCompilationObject: (function () {
				item.push(...arguments);
				return [];
			}),
		}, cwd, languageID);

		deepEqual(item, [{
			OLSKInternationalFileDelegateYAMLRead,
			OLSKInternationalFileDelegateYAMLDump,
		}, cwd, languageID]);
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

		deepEqual(item, [require('path').join(cwd, mainModule.OLSKInternationalDefaultIdentifier() + '-compilation.yml'), OLSKInternationalFileDelegateYAMLDump(_OLSKInternationalCompilationObject)]);
	});

	it('returns undefined', function() {
		require('fs').writeFileSync = (function () {});

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

	const _OLSKInternationalSpreadCompilationFile = function (cwd) {
		return mainModule.OLSKInternationalSpreadCompilationFile({
			OLSKInternationalFileDelegateGlobSync: (function () {}),
			OLSKInternationalFileDelegateYAMLRead,
			OLSKInternationalFileDelegateYAMLDump,
		}, cwd);
	};

	it('throws error if param1 not valid', function() {
		throws(function() {
			mainModule.OLSKInternationalSpreadCompilationFile({});
		}, /OLSKErrorInputNotValid/);
	});

	it('throws error if param1 with no OLSKInternationalFileDelegateYAMLDump', function() {
		throws(function() {
			mainModule.OLSKInternationalSpreadCompilationFile({
				OLSKInternationalFileDelegateYAMLRead,
				OLSKInternationalFileDelegateYAMLDump: null,
			}, Date.now().toString());
		}, /OLSKErrorInputNotValid/);
	});

	it('throws error if param2 not string', function() {
		throws(function() {
			mainModule.OLSKInternationalSpreadCompilationFile({
				OLSKInternationalFileDelegateYAMLRead,
				OLSKInternationalFileDelegateYAMLDump,
			}, null)
		}, /OLSKErrorInputNotValid/);
	});

	it('throws error if param2 not filled', function() {
		throws(function() {
			mainModule.OLSKInternationalSpreadCompilationFile({
				OLSKInternationalFileDelegateYAMLRead,
				OLSKInternationalFileDelegateYAMLDump,
			}, ' ')
		}, /OLSKErrorInputNotValid/);
	});

	it('calls readFileSync', function() {
		const cwd = Date.now().toString();
		const item = [];

		require('fs').readFileSync = (function () {
			item.push(...arguments);
			return '{}';
		});

		_OLSKInternationalSpreadCompilationFile(cwd);

		deepEqual(item, [require('path').join(cwd, mainModule.OLSKInternationalDefaultIdentifier() + '-compilation.yml'), 'utf8']);
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
			return OLSKInternationalFileDelegateYAMLDump(compilation);
		});
		require('fs').writeFileSync = (function () {
			item.push(Array.from(arguments));
		});

		_OLSKInternationalSpreadCompilationFile(Math.random().toString());

		deepEqual(item, Object.keys(compilation).map(function (e) {
			return [e, OLSKInternationalFileDelegateYAMLDump(compilation[e])];
		}));
	});

	it('returns undefined', function() {
		require('fs').readFileSync = (function () {
			return '{}';
		});
		require('fs').writeFileSync = (function () {});

		deepEqual(_OLSKInternationalSpreadCompilationFile(Date.now().toString()), undefined);
	});

	afterEach(function () {
		require('fs').readFileSync = readFileSync;
		require('fs').writeFileSync = writeFileSync;
	});

});

describe('OLSKInternationalAddControllerLanguageCode', function test_OLSKInternationalAddControllerLanguageCode() {

	it('throws error if param1 not string', function() {
		throws(function() {
			mainModule.OLSKInternationalAddControllerLanguageCode(null, Math.random().toString());
		}, /OLSKErrorInputNotValid/);
	});

	it('throws error if param1 not filled', function() {
		throws(function() {
			mainModule.OLSKInternationalAddControllerLanguageCode(' ', Math.random().toString());
		}, /OLSKErrorInputNotValid/);
	});

	it('throws error if param2 not string', function() {
		throws(function() {
			mainModule.OLSKInternationalAddControllerLanguageCode(Math.random().toString(), null);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws error if param2 not filled', function() {
		throws(function() {
			mainModule.OLSKInternationalAddControllerLanguageCode(Math.random().toString(), ' ');
		}, /OLSKErrorInputNotValid/);
	});

	it('calls globSync', function() {
		const cwd = Math.random().toString();
		const item = [];

		require('glob').sync = (function () {
			item.push(...arguments);

			return [];
		});

		mainModule.OLSKInternationalAddControllerLanguageCode(cwd, Math.random().toString());

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
