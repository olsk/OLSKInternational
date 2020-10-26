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

		OLSKInternationalFileDelegateErrors (inputData) {
			if (typeof inputData !== 'object' || inputData === null) {
				throw new Error('OLSKErrorInputNotValid');
			}

			if (typeof inputData.OLSKInternationalFileDelegateYAMLRead !== 'function') {
				return true;
			}

			if (inputData.OLSKInternationalFileDelegateYAMLDump && typeof inputData.OLSKInternationalFileDelegateYAMLDump !== 'function') {
				return true;
			}

			return false;
		},

		_OLSKInternationalPaths (params, cwd) {
			if (mod.OLSKInternationalFileDelegateErrors(params)) {
				throw new Error('OLSKErrorInputNotValid');
			}

			if (typeof cwd !== 'string' || !cwd.trim()) {
				throw new Error('OLSKErrorInputNotValid');
			}

			const _require = require;

			return _require('glob').sync(`**/*${ mod.OLSKInternationalDefaultIdentifier() }*.y*(a)ml`, {
				cwd,
				realpath: true,
			}).filter(function (e) {
				return mod.OLSKInternationalIsTranslationFileBasename(_require('path').basename(e));
			});
		},

		_OLSKInternationalConstructedDictionary (param1, param2) {
			if (mod.OLSKInternationalFileDelegateErrors(param1)) {
				throw new Error('OLSKErrorInputNotValid');
			}

			if (!Array.isArray(param2)) {
				throw new Error('OLSKErrorInputNotValid');
			}

			const _require = require;

			return param2.reduce(function (coll, item) {
				const key = mod.OLSKInternationalLanguageID(_require('path').basename(item));

				coll[key] = Object.assign(coll[key] || {}, param1.OLSKInternationalFileDelegateYAMLRead(_require('fs').readFileSync(item, 'utf8')))

				return coll;
			}, {});
		},

		OLSKInternationalDictionary (params, cwd) {
			return this._OLSKInternationalConstructedDictionary(params, this._OLSKInternationalPaths(params, cwd));
		},

		_OLSKInternationalCompilationObject (params, cwd, languageID) {
			const _require = require;

			return this._OLSKInternationalPaths(params, cwd).filter(function (e) {
				if (!languageID) {
					return true;
				}

				return mod.OLSKInternationalLanguageID(_require('path').basename(e)) === languageID;
			}).reduce(function (coll, item) {
				return Object.assign(coll, {
					[item]: params.OLSKInternationalFileDelegateYAMLRead(_require('fs').readFileSync(item, 'utf8')),
				});
			}, {});
		},

		_OLSKInternationalCompilationFilePath (cwd) {
			if (typeof cwd !== 'string' || !cwd.trim()) {
				throw new Error('OLSKErrorInputNotValid');
			}
			const _require = require;

			return _require('path').join(cwd, '__compiled', mod.OLSKInternationalDefaultIdentifier() + '-compilation.yml')
		},

		OLSKInternationalWriteCompilationFile (params, cwd, languageID) {
			const _require = require;

			const data = params.OLSKInternationalFileDelegateYAMLDump(this._OLSKInternationalCompilationObject(params, cwd, languageID));

			if (!params.OLSKInternationalFileDelegateYAMLDump) {
				throw new Error('OLSKErrorInputNotValid');
			}

			_require('fs').writeFileSync(mod._OLSKInternationalCompilationFilePath(cwd), data);
		},

		OLSKInternationalSpreadCompilationFile (params, cwd, languageID) {
			if (mod.OLSKInternationalFileDelegateErrors(params)) {
				throw new Error('OLSKErrorInputNotValid');
			}

			if (!params.OLSKInternationalFileDelegateYAMLDump) {
				throw new Error('OLSKErrorInputNotValid');
			}

			if (typeof cwd !== 'string' || !cwd.trim()) {
				throw new Error('OLSKErrorInputNotValid');
			}

			const _require = require;

			const compilation = params.OLSKInternationalFileDelegateYAMLRead(_require('fs').readFileSync(mod._OLSKInternationalCompilationFilePath(cwd), 'utf8'));

			Object.keys(compilation).map(function (e) {
				return _require('fs').writeFileSync(e, params.OLSKInternationalFileDelegateYAMLDump(compilation[e]));
			});
		},

		OLSKInternationalAddControllerLanguageCode (cwd, languageID) {
			if (typeof cwd !== 'string' || !cwd.trim()) {
				throw new Error('OLSKErrorInputNotValid');
			}

			if (typeof languageID !== 'string' || !languageID.trim()) {
				throw new Error('OLSKErrorInputNotValid');
			}

			const _require = require;

			_require('glob').sync('controller.js', {
				cwd,
				matchBase: true,
				realpath: true,
			}).forEach(function (file) {
				if (file.match(/.*(\.git|DS_Store|node_modules|vendor|__\w+)\/.*/i)) {
					return
				}

				const item = _require(file);

				if (typeof item.OLSKControllerRoutes !== 'function') {
					return;
				}

				if (!(function(inputData) {
					if (Array.isArray(inputData)) {
						return inputData;
					};

					return Object.entries(inputData).reduce(function (coll, item) {
						return coll.concat(Object.assign(item[1], {
							OLSKRouteSignature: item[0],
						}));
					}, []);
				})(item.OLSKControllerRoutes()).filter(function (e) {
					return e.OLSKRouteLanguages;
				}).filter(function (e) {
					return !e.OLSKRouteLanguages.includes(languageID);
				}).length) {
					return
				};

				const match = _require('fs').readFileSync(file, 'utf8').match(/OLSKRouteLanguages: \[.*\]/g);

				if (!match) {
					throw new Error(`invalid OLSKRouteLanguages syntax in ${ e }`);
				}

				match.map(function (e) {
					const match = e.match(/\[.*\]/);
					return _require('fs').writeFileSync(file, _require('fs').readFileSync(file, 'utf8').replace(/OLSKRouteLanguages: \[.*\]/, `OLSKRouteLanguages: ['${JSON.parse(match[0].replace(/\'/g, '"')).concat(languageID).join('\', \'')}']`));
				});
			});

			if (process.argv[2].endsWith('olsk-i18n-add')) {
				process.exit();
			}
		},

	};
	
	Object.assign(exports, mod);

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

})));
