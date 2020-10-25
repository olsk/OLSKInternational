#!/usr/bin/env node

const mod = {

	// VALUE

	_ValueDirectory: process.cwd(),

	// CONTROL

	ControlCompile(args) {
		require('./main.js').OLSKInternationalWriteCompilationFile({
			OLSKInternationalFileDelegateGlobSync: require('glob').sync,
			OLSKInternationalFileDelegateYAMLRead: require('js-yaml').safeLoad,
			OLSKInternationalFileDelegateYAMLDump: require('js-yaml').safeDump,
		}, mod._ValueDirectory);
	},

	// SETUP

	SetupEverything () {
		mod.SetupDirectory();

		if (process.argv[1].endsWith('olsk-international-compile')) {
			return mod.ControlCompile(process.argv.slice(2));
		}
	},

	SetupDirectory () {
		if (process.argv.length !== 2) {
			mod._ValueDirectory = process.argv.slice(-1).pop();
		}
	},

	// LIFECYCLE

	LifecycleScriptDidLoad() {
		mod.SetupEverything();
	},

};

mod.LifecycleScriptDidLoad();
