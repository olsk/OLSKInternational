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
