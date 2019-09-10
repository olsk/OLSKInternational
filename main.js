/*!
 * OLSKInternational
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

(function(global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
		typeof define === 'function' && define.amd ? define(['exports'], factory) :
			(factory((global.OLSKInternational = global.OLSKInternational || {})));
}(this, (function(exports) {
	'use strict';

	//_ OLSKInternationalDefaultIdentifier

	exports.OLSKInternationalDefaultIdentifier = function() {
		return 'i18n';
	};

	//_ OLSKInternationalIsTranslationFileBasename

	exports.OLSKInternationalIsTranslationFileBasename = function(inputData) {
		if (typeof inputData !== 'string') {
			return false;
		}

		if (!inputData.split('.').pop().match(/ya?ml/i)) {
			return false;
		}

		if (inputData.split('.').shift() !== exports.OLSKInternationalDefaultIdentifier()) {
			return false;
		}

		if (!exports._OLSKInternationalLanguageID(inputData)) {
			return false;
		}

		return true;
	};

	//_ OLSKInternationalLanguageID

	exports.OLSKInternationalLanguageID = function(inputData) {
		if (!exports.OLSKInternationalIsTranslationFileBasename(inputData)) {
			throw new Error('OLSKErrorInputInvalid');
		}

		return exports._OLSKInternationalLanguageID(inputData);
	};

	//_ _OLSKInternationalLanguageID

	exports._OLSKInternationalLanguageID = function(inputData) {
		var elements = inputData.split('.');

		elements.pop();
		elements.shift();

		return elements.pop();
	};

	//_ OLSKInternationalLocalizedString

	exports.OLSKInternationalLocalizedString = function(translationKey, translationDictionary) {
		if (typeof translationDictionary !== 'object' || translationDictionary === null) {
			throw new Error('OLSKErrorInputInvalid');
		}

		var localizedString = translationDictionary[translationKey];

		if (!localizedString) {
			localizedString = 'TRANSLATION_MISSING';
			console.log([
				localizedString,
				translationKey,
				]);
		}

		return localizedString;
	};

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

})));
