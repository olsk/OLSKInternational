#!/usr/bin/env node

const mod = {

	// VALUE

	_ValueDirectory: process.cwd(),
	_ValueLanguageID: undefined,

	// DATA

	_DataFileDelegate: {
		OLSKInternationalFileDelegateGlobSync: require('glob').sync,
		OLSKInternationalFileDelegateYAMLRead: require('js-yaml').safeLoad,
		OLSKInternationalFileDelegateYAMLDump: require('js-yaml').safeDump,
	},

	// CONTROL

	ControlCompile(args) {
		require('./main.js').OLSKInternationalWriteCompilationFile(mod._DataFileDelegate, mod._ValueDirectory, mod._ValueLanguageID);
	},

	ControlSpread(args) {
		require('./main.js').OLSKInternationalSpreadCompilationFile(mod._DataFileDelegate, mod._ValueDirectory);
	},

	// SETUP

	SetupEverything () {
		mod.SetupValueDirectory();

		mod.SetupValueLanguageID();

		if (process.argv[1].endsWith('olsk-international-compile')) {
			return mod.ControlCompile();
		}

		if (process.argv[1].endsWith('olsk-international-spread')) {
			return mod.ControlSpread();
		}
	},

	SetupValueDirectory () {
		if (process.argv[2]) {
			mod._ValueDirectory = process.argv[2];
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
	},

};

mod.LifecycleScriptDidLoad();
