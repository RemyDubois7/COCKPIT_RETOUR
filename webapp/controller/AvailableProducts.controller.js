sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/ToolbarSpacer",
	"sap/ui/table/Row",
	"jquery.sap.sjax"
], function (Controller, JSONModel, MessageToast, ToolbarSpacer, TableRow, jQuery) {
	"use strict";

	return Controller.extend("CMR.ZEWM_MERCH_RETURN.controller.AvailableProducts", {
		onInit: function () {
            var Table = new sap.ui.commons.Table('Table');
		},
		// onDragStart: function (oEvent) {
		// 	var oDraggedRow = oEvent.getParameter("target");
		// 	var oDragSession = oEvent.getParameter("dragSession");

		// 	// keep the dragged row context for the drop action
		// 	oDragSession.setComplexData("draggedRowContext", oDraggedRow.getBindingContext());
		// },
		// onDropTable1: function (oEvent) {
		// 	var oDragSession = oEvent.getParameter("dragSession");
		// 	var oDraggedRowContext = oDragSession.getComplexData("draggedRowContext");
		// 	if (!oDraggedRowContext) {
		// 		return;
		// 	}

		// 	// reset the rank property and update the model to refresh the bindings
		// 	this.oProductsModel.setProperty("Rank", this.config.initialRank, oDraggedRowContext);
		// 	this.oProductsModel.refresh(true);
		// }
	});

});