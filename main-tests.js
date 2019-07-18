/*!
 * OLSKInternational
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var internationalLibrary = require('./main');

describe('OLSKInternationalDefaultIdentifier', function testOLSKInternationalDefaultIdentifier() {

	it('returns i18n', function() {
		assert.strictEqual(internationalLibrary.OLSKInternationalDefaultIdentifier(), 'i18n');
	});

});

describe('OLSKInternationalInputDataIsTranslationFileBasename', function testOLSKInternationalInputDataIsTranslationFileBasename() {

	it('returns false if not string', function() {
		assert.strictEqual(internationalLibrary.OLSKInternationalInputDataIsTranslationFileBasename(null), false);
	});

	it('returns false if without yaml extension', function() {
		assert.strictEqual(internationalLibrary.OLSKInternationalInputDataIsTranslationFileBasename('i18n.en.abc'), false);
	});

	it('returns false if without OLSKInternationalDefaultIdentifier', function() {
		assert.strictEqual(internationalLibrary.OLSKInternationalInputDataIsTranslationFileBasename('en.yaml'), false);
	});

	it('returns false if without languageID', function() {
		assert.strictEqual(internationalLibrary.OLSKInternationalInputDataIsTranslationFileBasename('i18n.yaml'), false);
	});

	it('returns true if valid translationFileBasename', function() {
		assert.strictEqual(internationalLibrary.OLSKInternationalInputDataIsTranslationFileBasename('i18n.en.yaml'), true);
		assert.strictEqual(internationalLibrary.OLSKInternationalInputDataIsTranslationFileBasename('i18n.en.yml'), true);
	});

});

describe('OLSKInternationalLanguageIDForTranslationFileBasename', function testOLSKInternationalLanguageIDForTranslationFileBasename() {

	it('throws error if not translationFileBasename', function() {
		assert.throws(function() {
			internationalLibrary.OLSKInternationalLanguageIDForTranslationFileBasename(null);
		}, /OLSKErrorInputInvalid/);
	});

	it('returns languageID', function() {
		assert.strictEqual(internationalLibrary.OLSKInternationalLanguageIDForTranslationFileBasename('i18n.en.yaml'), 'en');
	});

});

describe('OLSKInternationalLocalizedStringWithTranslationKeyAndTranslationDictionary', function testOLSKInternationalLocalizedStringWithTranslationKeyAndTranslationDictionary() {

	it('throws error if param2 not object', function() {
		assert.throws(function() {
			internationalLibrary.OLSKInternationalLocalizedStringWithTranslationKeyAndTranslationDictionary('alpha', null);
		}, /OLSKErrorInputInvalid/);
	});

	it('returns localizedString', function() {
		assert.strictEqual(internationalLibrary.OLSKInternationalLocalizedStringWithTranslationKeyAndTranslationDictionary('alpha', {
			alpha: 'bravo',
		}), 'bravo');
	});

	it('returns alternate string if translation not available', function() {
		assert.strictEqual(internationalLibrary.OLSKInternationalLocalizedStringWithTranslationKeyAndTranslationDictionary('alpha', {
			charlie: 'bravo',
		}), 'TRANSLATION_MISSING');
	});

});
