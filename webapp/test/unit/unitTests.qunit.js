/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"CMR/ZEWM_MERCH_RETURN/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});