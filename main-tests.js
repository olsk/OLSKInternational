/*!
 * OLSKInternational
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var internationalLibrary = require('./main');

describe('OLSKInternationalDefaultIdentifier', function testOLSKInternationalDefaultIdentifier() {

	it('returns string', function() {
		assert.strictEqual(internationalLibrary.OLSKInternationalDefaultIdentifier(), 'i18n');
	});

});

describe('OLSKInternationalIsTranslationFileBasename', function testOLSKInternationalIsTranslationFileBasename() {

	it('returns false if not string', function() {
		assert.strictEqual(internationalLibrary.OLSKInternationalIsTranslationFileBasename(null), false);
	});

	it('returns false if without yaml extension', function() {
		assert.strictEqual(internationalLibrary.OLSKInternationalIsTranslationFileBasename('i18n.en.abc'), false);
	});

	it('returns false if without OLSKInternationalDefaultIdentifier', function() {
		assert.strictEqual(internationalLibrary.OLSKInternationalIsTranslationFileBasename('en.yaml'), false);
	});

	it('returns false if without languageID', function() {
		assert.strictEqual(internationalLibrary.OLSKInternationalIsTranslationFileBasename('i18n.yaml'), false);
	});

	it('returns true if valid translationFileBasename', function() {
		assert.strictEqual(internationalLibrary.OLSKInternationalIsTranslationFileBasename('i18n.en.yaml'), true);
		assert.strictEqual(internationalLibrary.OLSKInternationalIsTranslationFileBasename('i18n.en.yml'), true);
	});

});

describe('OLSKInternationalLanguageID', function testOLSKInternationalLanguageID() {

	it('throws error if not valid', function() {
		assert.throws(function() {
			internationalLibrary.OLSKInternationalLanguageID(null);
		}, /OLSKErrorInputInvalid/);
	});

	it('returns languageID', function() {
		assert.strictEqual(internationalLibrary.OLSKInternationalLanguageID('i18n.en.yaml'), 'en');
	});

});

describe('OLSKInternationalSimplifiedLanguageCode', function testOLSKInternationalSimplifiedLanguageCode() {

	it('throws error if not string', function() {
		assert.throws(function() {
			internationalLibrary.OLSKInternationalSimplifiedLanguageCode(null);
		}, /OLSKErrorInputInvalid/);
	});

	it('returns input', function() {
		assert.strictEqual(internationalLibrary.OLSKInternationalSimplifiedLanguageCode(''), '');
	});

	it('extracts first hyphenated segment', function() {
		assert.strictEqual(internationalLibrary.OLSKInternationalSimplifiedLanguageCode('alfa-bravo'), 'alfa');
	});

});

describe('OLSKInternationalLocalizedString', function testOLSKInternationalLocalizedString() {

	it('throws error if param2 not object', function() {
		assert.throws(function() {
			internationalLibrary.OLSKInternationalLocalizedString('alpha', null);
		}, /OLSKErrorInputInvalid/);
	});

	it('returns localizedString', function() {
		assert.strictEqual(internationalLibrary.OLSKInternationalLocalizedString('alpha', {
			alpha: 'bravo',
		}), 'bravo');
	});

	it('returns alternate string if translation not available', function() {
		assert.strictEqual(internationalLibrary.OLSKInternationalLocalizedString('alpha', {
			charlie: 'bravo',
		}), 'TRANSLATION_MISSING');
	});

});
