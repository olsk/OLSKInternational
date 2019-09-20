import { throws, deepEqual } from 'assert';

const mainModule = require('./main');

describe('OLSKInternationalDefaultIdentifier', function testOLSKInternationalDefaultIdentifier() {

	it('returns string', function() {
		deepEqual(mainModule.OLSKInternationalDefaultIdentifier(), 'i18n');
	});

});

describe('OLSKInternationalIsTranslationFileBasename', function testOLSKInternationalIsTranslationFileBasename() {

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

describe('OLSKInternationalLanguageID', function testOLSKInternationalLanguageID() {

	it('throws error if not valid', function() {
		throws(function() {
			mainModule.OLSKInternationalLanguageID(null);
		}, /OLSKErrorInputInvalid/);
	});

	it('returns languageID', function() {
		deepEqual(mainModule.OLSKInternationalLanguageID('i18n.en.yaml'), 'en');
	});

});

describe('OLSKInternationalSimplifiedLanguageCode', function testOLSKInternationalSimplifiedLanguageCode() {

	it('throws error if not string', function() {
		throws(function() {
			mainModule.OLSKInternationalSimplifiedLanguageCode(null);
		}, /OLSKErrorInputInvalid/);
	});

	it('returns input', function() {
		deepEqual(mainModule.OLSKInternationalSimplifiedLanguageCode(''), '');
	});

	it('extracts first hyphenated segment', function() {
		deepEqual(mainModule.OLSKInternationalSimplifiedLanguageCode('alfa-bravo'), 'alfa');
	});

});

describe('OLSKInternationalLocalizedString', function testOLSKInternationalLocalizedString() {

	it('throws error if param2 not object', function() {
		throws(function() {
			mainModule.OLSKInternationalLocalizedString('alpha', null);
		}, /OLSKErrorInputInvalid/);
	});

	it('returns localizedString', function() {
		deepEqual(mainModule.OLSKInternationalLocalizedString('alpha', {
			alpha: 'bravo',
		}), 'bravo');
	});

	it('returns alternate string if translation not available', function() {
		deepEqual(mainModule.OLSKInternationalLocalizedString('alpha', {
			charlie: 'bravo',
		}), 'TRANSLATION_MISSING');
	});

});
