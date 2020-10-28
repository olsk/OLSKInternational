#!/usr/bin/env node

const mod = {

	// VALUE

	_ValueDirectory: process.cwd(),
	_ValueLanguageID: undefined,

	// CONTROL

	ControlCompile(args) {
		require('./main.js').OLSKInternationalWriteCompilationFile(mod._ValueDirectory, mod._ValueLanguageID);
	},

	ControlSpread(args) {
		require('./main.js').OLSKInternationalSpreadCompilationFile(mod._ValueDirectory);
		console.log('Spread ', mod._ValueDirectory);
	},

	ControlAdd(args) {
		require('./main.js').OLSKInternationalAddControllerLanguageCode(mod._ValueDirectory, args[3]);
	},

	ControlPrintCompilationFilePath(args) {
		console.log(require('./main.js')._OLSKInternationalCompilationFilePath(mod._ValueDirectory));
	},

	// SETUP

	SetupEverything () {
		mod.SetupValueDirectory();

		mod.SetupValueLanguageID();
	},

	SetupValueDirectory () {
		if (process.argv[2]) {
			mod._ValueDirectory = require('path').resolve(process.argv[2]);
		}
	},

	SetupValueLanguageID () {
		if (process.argv[3]) {
			mod._ValueLanguageID = process.argv[3];
		}
	},

	// LIFECYCLE

	LifecycleScriptDidLoad() {
		mod.SetupEverything();

		if (process.argv[1].endsWith('olsk-i18n-compile')) {
			return mod.ControlCompile();
		}

		if (process.argv[1].endsWith('olsk-i18n-spread')) {
			return mod.ControlSpread();
		}

		if (process.argv[1].endsWith('olsk-i18n-add')) {
			return mod.ControlAdd(process.argv);
		}

		if (process.argv[1].endsWith('_olsk-i18n-compile-file-path')) {
			return mod.ControlPrintCompilationFilePath(process.argv);
		}
	},

};

mod.LifecycleScriptDidLoad();
