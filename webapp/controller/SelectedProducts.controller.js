sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/ToolbarSpacer",
	"sap/ui/table/Row",
	"jquery.sap.sjax"
], function (Controller, JSONModel, MessageToast, ToolbarSpacer, TableRow, jQuery) {
	"use strict";

	return Controller.extend("CMR.ZEWM_MERCH_RETURN.controller.SelectedProducts", {

		onInit: function () {
			//Accessing the table from the fragment by it's Id	
			var oTable = this.byId("SelectTable");

			//column list item creation
			var oTemplate = new sap.m.ColumnListItem({
				cells: [new sap.m.Text({
						text: "{GuidParent}"
					}),
					new sap.m.Text({
						text: "{Libelle}"
					}),
					new sap.m.Text({
						text: "{GuidStock}"
					}),
					new sap.m.Text({
						text: "{ReturnType}"
					}),
					new sap.m.Text({
						text: "{Hu}"
					}),
					new sap.m.Text({
						text: "{ReturnPriceProp}"
					}),
					new sap.m.Text({
						text: "{Matid}"
					}),
					new sap.m.Text({
						text: "{ReturnWeightTotal}"
					}),
					new sap.m.Text({
						text: "{Bin}"
					}),
					new sap.m.Text({
						text: "{ReturnVolumTotal}"
					}),
					new sap.m.Text({
						text: "{PropositionNumber}"
					}),
					new sap.m.Text({
						text: "{Quantity}"
					}),
					new sap.m.Text({
						text: "{PropositionDate}"
					}),
					new sap.m.Text({
						text: "{Unit}"
					}),
					new sap.m.Text({
						text: "{AnswerDate}"
					}),
					new sap.m.Text({
						text: "{Product}"
					}),
					new sap.m.Text({
						text: "{CommandeNumber}"
					}),
					new sap.m.Text({
						text: "{Plant}"
					}),
					new sap.m.Text({
						text: "{StorageLocation}"
					}),
					new sap.m.Text({
						text: "{Stock}"
					}),
					new sap.m.Text({
						text: "{Supplier}"
					}),
					new sap.m.Text({
						text: "{Price}"
					})
				]
			});
			oTable.bindAggregation("rows", {
				path: "{/HeaderSet}",
				template: oTemplate
			});
		},

		_onButtonPropRetour: function (oEvent) {
			var Ctr = this;
			var oTable = Ctr.getView().byId("SelectTable");
			var oItems = oTable.getItems();

			var ConfirmdeleteText = Ctr._i18n.getText("TextPropRetour");
			var Confirm = Ctr._i18n.getText("Confirmation");
			sap.m.MessageBox.show(ConfirmdeleteText, {
				icon: sap.m.MessageBox.Icon.INFORMATION,
				title: Confirm,
				actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
				onClose: function (oAction) {
					if (oAction === "NO") {
						return;
					}
				}.bind(Ctr)
			});

			var createArray = {
				"HeaderSet": []
			};

			for (var i = 0, maxLength = oItems.length; i < maxLength; i++) {

				var j = oItems[i];
				var l_Product = oTable.getContextByIndex(j)
					.getProperty("Product");
				var l_Hu = oTable.getContextByIndex(j)
					.getProperty("Hu");
				var l_Matid = oTable.getContextByIndex(j)
					.getProperty("Matid");
				var l_Bin = oTable.getContextByIndex(j)
					.getProperty("Bin");
				var l_Price = oTable.getContextByIndex(j)
					.getProperty("Price");
				var l_Libelle = oTable.getContextByIndex(j)
					.getProperty("Libelle");
				var l_ReturnType = oTable.getContextByIndex(j)
					.getProperty("ReturnType");
				var l_ReturnPriceProp = oTable.getContextByIndex(j)
					.getProperty("ReturnPriceProp");
				var l_ReturnWeightTotal = oTable.getContextByIndex(j)
					.getProperty("ReturnWeightTotal");
				var l_ReturnVolumTotal = oTable.getContextByIndex(j)
					.getProperty("ReturnVolumTotal");
				var l_PropositionNumber = oTable.getContextByIndex(j)
					.getProperty("PropositionNumber");
				var l_Quantity = oTable.getContextByIndex(j)
					.getProperty("Quantity");
				var l_PropositionDate = oTable.getContextByIndex(j)
					.getProperty("PropositionDate");
				var l_Unit = oTable.getContextByIndex(j)
					.getProperty("Unit");
				var l_AnswerDate = oTable.getContextByIndex(j)
					.getProperty("AnswerDate");
				var l_CommandeNumber = oTable.getContextByIndex(j)
					.getProperty("CommandeNumber");
				var l_Plant = oTable.getContextByIndex(j)
					.getProperty("Plant");
				var l_StorageLocation = oTable.getContextByIndex(j)
					.getProperty("StorageLocation");
				var l_Stock = oTable.getContextByIndex(j)
					.getProperty("Stock");
				var l_Supplier = oTable.getContextByIndex(j)
					.getProperty("Supplier");

				createArray.HeaderSet.push({
					"Product": l_Product,
					"Hu": l_Hu,
					"Matid": l_Matid,
					"Bin": l_Bin,
					"Price": l_Price,
					"Libelle": l_Libelle,
					"ReturnType": l_ReturnType,
					"ReturnPriceProp": l_ReturnPriceProp,
					"ReturnWeightTotal": l_ReturnWeightTotal,
					"ReturnVolumTotal": l_ReturnVolumTotal,
					"PropositionNumber": l_PropositionNumber,
					"Quantity": l_Quantity,
					"PropositionDate": l_PropositionDate,
					"Unit": l_Unit,
					"AnswerDate": l_AnswerDate,
					"CommandeNumber": l_CommandeNumber,
					"Plant": l_Plant,
					"StorageLocation": l_StorageLocation,
					"Stock": l_Stock,
					"Supplier": l_Supplier
				});
			}
			Ctr._oModelSend.create("HeaderSet()", createArray, {
				async: true,
				success: function (createArray, response) {
					if (createArray.Subrc === 4) {
						sap.m.MessageBox.show(createArray.Message, {
							icon: sap.m.MessageBox.Icon.INFORMATION,
							title: "Dear User",
							actions: [sap.m.MessageBox.Action.OK],
							onClose: function (oAction) {}.bind(Ctr)
						});

					}
				}
			});

		}

		// moveSelectedRow: function (sDirection) {
		// 	this.getSelectedRowContext("table2", function (oSelectedRowContext, iSelectedRowIndex, oTable2) {
		// 		var iSiblingRowIndex = iSelectedRowIndex + (sDirection === "Up" ? -1 : 1);
		// 		var oSiblingRowContext = oTable2.getContextByIndex(iSiblingRowIndex);
		// 		if (!oSiblingRowContext) {
		// 			return;
		// 		}

		// 		// swap the selected and the siblings rank
		// 		var iSiblingRowRank = oSiblingRowContext.getProperty("Rank");
		// 		var iSelectedRowRank = oSelectedRowContext.getProperty("Rank");
		// 		this.oProductsModel.setProperty("Rank", iSiblingRowRank, oSelectedRowContext);
		// 		this.oProductsModel.setProperty("Rank", iSelectedRowRank, oSiblingRowContext);
		// 		this.oProductsModel.refresh(true);

		// 		// after move select the sibling
		// 		oTable2.setSelectedIndex(iSiblingRowIndex);
		// 	});
		// }
	});

});