sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/ToolbarSpacer",
    "sap/ui/table/Row",
    "sap/ui/core/BusyIndicator",
],

    function (Controller, JSONModel, MessageToast, ToolbarSpacer, TableRow, BusyIndicator) {
        "use strict";

        return Controller.extend("CMR.ZEWM_MERCH_RETURN.controller.Main", {
            onInit: function () {
                //Accessing the table from the fragment by it's Id	
                this._i18n = this.getView().getModel("i18n").getResourceBundle();
                var oTable = this.byId("SelectTable");
                var me = this;
                var oView = this.getView();
                var oComponent = this.getOwnerComponent();
                var oNewLines = new JSONModel({
                    "items": []
                });
                this.getView().setModel(oNewLines, "SelectModel");
                var oSelectTable = this.getView().byId("SelectTable");
                oSelectTable.setModel(oNewLines);
                this._oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZRETOUR_MERCHANDISE_SRV/", true, "", "");
            },


            onSort: function () {
                var oSmartTable = this._getSmartTable();
                if (oSmartTable) {
                    oSmartTable.openPersonalisationDialog("Sort");
                }
            },

            onFilter: function () {
                var oSmartTable = this._getSmartTable();
                if (oSmartTable) {
                    oSmartTable.openPersonalisationDialog("Filter");
                }
            },

            onColumns: function () {
                var oSmartTable = this._getSmartTable();
                if (oSmartTable) {
                    oSmartTable.openPersonalisationDialog("Columns");
                }
            },

            _getSmartTable: function () {
                if (!this._oSmartTable) {
                    this._oSmartTable = this.getView().byId("Table");
                }
                return this._oSmartTable;
            },

            onExit: function () {
                this._oSmartTable = null;
                this._oMockServer.stop();
            },


            moveToTable: function (oEvent) {
                var SelectedItems = [];
                var tableModel = this.getView().byId("SelectTable").getModel();
                var Items = tableModel.getProperty("/items");
                var lineNbre = tableModel.getData().items.length
                var SelectTable = this.getView().byId("SelectionList");
                var selectedIndex = SelectTable.getSelectedIndices();

                var data = tableModel.getData();
                if (data.items.length !== 0) {
                    var supplier = data.items[0].Supplier;
                    var plant = data.items[0].Plant;
                    var returnType = data.items[0].ReturnType;
                }

                var SelectedLines = selectedIndex.map(function (oItem) {
                    return SelectTable.getContextByIndex(oItem).getObject();
                });
                if (SelectedLines.length === 0) {
                    var Noselecttext = this._i18n.getText("NoSelectedLines");
                    MessageToast.show(Noselecttext);
                    return;
                }
                var AllRows = SelectTable.getBinding("rows").getContexts();
                var columns = SelectTable.getColumns();
                for (var j = 0; j < SelectedLines.length; j++) {
                    if ((supplier !== undefined && supplier !== null && supplier !== SelectedLines[j].Supplier) ||
                        (plant !== undefined && plant !== null && plant !== SelectedLines[j].Plant) ||
                        (returnType !== undefined && returnType !== null && returnType !== SelectedLines[j].ReturnType)) {
                        var NoUniqueKey = this._i18n.getText("NoUniqueKey");
                        MessageToast.show(NoUniqueKey);
                        return;
                    }
                    else {
                        supplier = SelectedLines[j].Supplier;
                        plant = SelectedLines[j].Plant;
                        returnType = SelectedLines[j].ReturnType;
                        for (var i = 0; i < AllRows.length; i++) {
                            if (((AllRows[i].getObject().PropositionNumber === SelectedLines[j].PropositionNumber) 
                                    && AllRows[i].getObject().PropositionNumber !== "00000000")
                                || ((AllRows[i].getObject().Product === SelectedLines[j].Product) 
                                    && (AllRows[i].getObject().GuidStock === SelectedLines[j].GuidStock)
                                    && (AllRows[i].getObject().GuidParent === SelectedLines[j].GuidParent))) {
                                var copyRow = {};
                                for (var r = 0; r < columns.length; r++) {
                                    if (columns[r].getTemplate().getMetadata()._sClassName === "sap.m.Text") {
                                        var field = columns[r].getTemplate().getBindingInfo("text").parts[0].path;
                                        copyRow[field] = AllRows[i].getObject()[field];
                                    }
                                }
                                var Index = Items.map(function (img) {
                                    return img.Product;
                                }).indexOf(copyRow.Product);
                                if (Index !== -1) {
                                    continue;
                                }

                                lineNbre = Number(lineNbre + 1);
                                copyRow.Quantity = AllRows[i].getObject().Quantity;
                                copyRow.Libelle = AllRows[i].getObject().Libelle;
                                copyRow.ReturnType = AllRows[i].getObject().ReturnType;
                                copyRow.ReturnPriceProp = AllRows[i].getObject().Price;
                                copyRow.ReturnWeightTotal = AllRows[i].getObject().ReturnWeightTotal;
                                copyRow.ReturnVolumTotal = AllRows[i].getObject().ReturnVolumTotal;
                                copyRow.PropositionNumber = AllRows[i].getObject().PropositionNumber;
                                copyRow.CommandeNumber = AllRows[i].getObject().CommandeNumber;
                                copyRow.Plant = AllRows[i].getObject().Plant;
                                copyRow.GuidStock = AllRows[i].getObject().GuidStock;
                                copyRow.GuidParent = AllRows[i].getObject().GuidParent;

                                tableModel.getData().items.splice(lineNbre, 0, copyRow);
                            }
                        }
                    }
                }
                tableModel.refresh();
            },

            removefromTable: function () {
                var indexs = [];
                var SelectTable = this.getView().byId("SelectTable");
                var tableModel = SelectTable.getModel();
                var data = tableModel.getData();
                var selectedIndex = SelectTable.getSelectedIndices();
                var SelectedLines = selectedIndex.map(function (oItem) {
                    return SelectTable.getContextByIndex(oItem).getObject();
                });
                if (SelectedLines.length === 0) {
                    var Noselecttext = this._i18n.getText("NoSelectedLines");
                    MessageToast.show(Noselecttext);
                    return;
                }

                for (var i = 0; i < selectedIndex.length; i++) {
                    var idx = selectedIndex[i];
                    var oThisObj = SelectTable.getContextByIndex(idx).getObject();
                    var index = $.map(data.items, function (obj, index) {
                        if (obj === oThisObj) {
                            return index;
                        }
                    });

                    indexs.push({
                        "index": index
                    });
                }

                for (i = indexs.length - 1; i >= 0; i--) {
                    index = indexs[i].index;
                    data.items.splice(index, 1);

                }
                tableModel.setData(data);
                SelectTable.clearSelection();
            },

            _onButtonPropRetour: function (oEvent) {
                var SelectTable = this.getView().byId("SelectTable");
                var rows = SelectTable.getBinding("rows").getContexts();
                if (rows.length === 0) {
                    var Noselecttext = this._i18n.getText("NoSelectedLines");
                    MessageToast.show(Noselecttext);
                    return;
                }
                var Ctr = this;
                sap.m.MessageBox.show(this._i18n.getText("TextPropRetour"), {
                    icon: sap.m.MessageBox.Icon.INFORMATION,
                    title: this._i18n.getText("titlePropRetour"),
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === "YES") {
                            Ctr._SendProposition(rows);
                        }
                    }.bind(this)
                });
            },

            _SendProposition: function (rows) {
                var createArray = {
                    "Hu": "",
                    "Product": "",
                    "ItemsSet": []
                };
                for (var i = 0; i < rows.length; i++) {
                    //     var product = rows[i].getObject().Product;
                    createArray.ItemsSet.push(rows[i].getObject());
                }
                BusyIndicator.show();
                this._oModel.create("HItemsSet()", createArray, {
                    async: true,
                    success: function (createArray, response) {
                        BusyIndicator.hide();
                        if (response.data.Subrc === "00") {
                            MessageToast.show(response.data.Message);
                            this.getView().buId("smartFilterBar".search());
                        }
                        else {
                            MessageToast.show(response.data.Message);
                        }
                    },
                    error: function () {
                        BusyIndicator.hide();
                    }
                });
            },
        });
    });