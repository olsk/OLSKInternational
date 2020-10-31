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

			if (inputData.split('.').shift() !== mod.OLSKInternationalDefaultIdentifier()) {
				return false;
			}

			if (!mod._OLSKInternationalLanguageID(inputData)) {
				return false;
			}

			return true;
		},

		OLSKInternationalLanguageID (inputData) {
			if (!mod.OLSKInternationalIsTranslationFileBasename(inputData)) {
				throw new Error('OLSKErrorInputNotValid');
			}

			return mod._OLSKInternationalLanguageID(inputData);
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
					return [mod.OLSKInternationalSimplifiedLanguageCode(e), e]
				}).reverse())

			return function (signature, requestLocales) {
				if (!Array.isArray(requestLocales)) {
					throw new Error('OLSKErrorInputNotValid');
				}

				let locales = _locales.concat(...requestLocales.map(function (e) {
					return [mod.OLSKInternationalSimplifiedLanguageCode(e), e]
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

		_OLSKInternationalPaths (cwd, filter) {
			if (typeof cwd !== 'string' || !cwd.trim()) {
				throw new Error('OLSKErrorInputNotValid');
			}

			const _require = require;

			return _require('glob').sync(`**/*${ mod.OLSKInternationalDefaultIdentifier() }*.y*(a)ml`, {
				cwd,
				realpath: true,
			}).filter(function (e) {
				if (!filter) {
					return true;
				}

				return !e.match(filter);
			}).filter(function (e) {
				return mod.OLSKInternationalIsTranslationFileBasename(_require('path').basename(e));
			});
		},

		_OLSKInternationalConstructedDictionary (inputData) {
			if (!Array.isArray(inputData)) {
				throw new Error('OLSKErrorInputNotValid');
			}

			const _require = require;

			return inputData.reduce(function (coll, item) {
				const key = mod.OLSKInternationalLanguageID(_require('path').basename(item));

				coll[key] = Object.assign(coll[key] || {}, _require('js-yaml').safeLoad(_require('fs').readFileSync(item, 'utf8')))

				return coll;
			}, {});
		},

		OLSKInternationalDictionary (cwd) {
			return this._OLSKInternationalConstructedDictionary(this._OLSKInternationalPaths(cwd));
		},

		_OLSKInternationalCompilationObject (cwd, languageID) {
			const _require = require;

			return this._OLSKInternationalPaths(cwd, /node_modules|__external/).filter(function (e) {
				if (!languageID) {
					return true;
				}

				return mod.OLSKInternationalLanguageID(_require('path').basename(e)) === languageID;
			}).reduce(function (coll, item) {
				return Object.assign(coll, {
					[item]: _require('js-yaml').safeLoad(_require('fs').readFileSync(item, 'utf8')),
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

		OLSKInternationalWriteCompilationFile (cwd, languageID) {
			const _require = require;

			const data = _require('js-yaml').safeDump(this._OLSKInternationalCompilationObject(cwd, languageID));

			const outputDirectory = _require('path').dirname(mod._OLSKInternationalCompilationFilePath(cwd));

			if (!_require('fs').existsSync(outputDirectory)){
				_require('fs').mkdirSync(outputDirectory);
			}

			_require('fs').writeFileSync(mod._OLSKInternationalCompilationFilePath(cwd), data);
		},

		OLSKInternationalSpreadCompilationFile (cwd, languageID) {
			if (typeof cwd !== 'string' || !cwd.trim()) {
				throw new Error('OLSKErrorInputNotValid');
			}

			const _require = require;

			const compilation = _require('js-yaml').safeLoad(_require('fs').readFileSync(mod._OLSKInternationalCompilationFilePath(cwd), 'utf8'));

			Object.keys(compilation).map(function (e) {
				return _require('fs').writeFileSync(e, _require('js-yaml').safeDump(compilation[e]));
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
