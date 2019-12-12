(function(global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
		typeof define === 'function' && define.amd ? define(['exports'], factory) :
			(factory((global.OLSKInternational = global.OLSKInternational || {})));
}(this, (function(exports) { 'use strict';

	const mod = {

		OLSKInternationalDefaultIdentifier () {
			return 'i18n';
		},

		OLSKInternationalIsTranslationFileBasename (inputData) {
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
		},

		OLSKInternationalLanguageID (inputData) {
			if (!exports.OLSKInternationalIsTranslationFileBasename(inputData)) {
				throw new Error('OLSKErrorInputNotValid');
			}

			return exports._OLSKInternationalLanguageID(inputData);
		},

		OLSKInternationalSimplifiedLanguageCode (inputData) {
			if (typeof inputData !== 'string') {
				throw new Error('OLSKErrorInputNotValid');
			}

			return inputData.split('-').shift();
		},

		_OLSKInternationalLanguageID (inputData) {
			var elements = inputData.split('.');

			elements.pop();
			elements.shift();

			return elements.pop();
		},

		OLSKInternationalLocalizedString (translationKey, translationDictionary) {
			if (typeof translationDictionary !== 'object' || translationDictionary === null) {
				throw new Error('OLSKErrorInputNotValid');
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
		},

		OLSKInternationalLocalizedStringCallback (dictionary, fallbackLocales) {
			if (typeof dictionary !== 'object' || dictionary === null) {
				throw new Error('OLSKErrorInputNotValid');
			}

			if (!Array.isArray(fallbackLocales)) {
				throw new Error('OLSKErrorInputNotValid');
			}

			const _locales = Object.keys(dictionary).reverse().concat(...fallbackLocales.map(function (e) {
					return [exports.OLSKInternationalSimplifiedLanguageCode(e), e]
				}).reverse())

			return function (signature, requestLocales) {
				if (!Array.isArray(requestLocales)) {
					throw new Error('OLSKErrorInputNotValid');
				}

				let locales = _locales.concat(...requestLocales.map(function (e) {
					return [exports.OLSKInternationalSimplifiedLanguageCode(e), e]
				}).reverse(), [])

				let outputData;

				while (!outputData && locales.length) {
					outputData = (dictionary[locales.pop()] || {})[signature];
				}

				if (!outputData) {
					console.log([outputData = 'TRANSLATION_MISSING', signature].join(' '));
				}

				return outputData;				
			};
		},

	};
	
	Object.assign(exports, mod);

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

})));
