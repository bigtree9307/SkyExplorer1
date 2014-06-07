﻿module AST {
    export module UkData {

        interface SummaryTab extends HTMLElement {
            innerTitle;
            summaryTable;
            footnote;
        }

        export class UkDestPanel{
            private _tabSummary: SummaryTab = null;
            private _totalFlow: HTMLElement = null;
            private _tabs: HTMLElement = null;
            private _tabTimeSeries: HTMLElement = null;
            private _tabTimeSeriesTitle: HTMLElement = null;
            private _tabTimeSeriesFootNote: HTMLElement = null;
            private _divTimeSeriesChart: HTMLElement = null;

            constructor() {
                
            }

            public initUI() {
                this._tabSummary.appendChild(AST.Utils.createElement("div", { "height": "4px" }));
                this._tabSummary.innerTitle = AST.Utils.createElement("div", {
                    "id": "ukDestSummaryTitle", "class": "t100DataPanelTabTitle", "text": UkData.UkLocalization.strings.passengerFlowMonthlyStat
                });
                this._tabSummary.summaryTable = AST.Utils.createElement("table", { "id": "ukDestSummaryTable" });
                this._tabSummary.summaryTable.style.display = "block";
                this._tabSummary.summaryTable.style.overflow = "auto";
                this._tabSummary.footnote = document.createElement("div");

                this._tabSummary.appendChild(this._tabSummary.innerTitle);
                this._tabSummary.appendChild(AST.Utils.createElement("div", { "height": "4px" }));
                this._tabSummary.appendChild(this._tabSummary.summaryTable);
                this._tabSummary.appendChild(AST.Utils.createElement("div", { "height": "2px" }));
                this._tabSummary.appendChild(this._tabSummary.footnote);

                $("#ukDestTabs").tabs({
                    activate: (event, ui) => {
                        if (ui.newTab[0].id == "liUkDestTabTimeSeries") {
                            
                        }
                    }

                });
            }

            private querySegment() {
                if (AST.GlobalStatus.year == null || AST.GlobalStatus.originAirport == null
                    || AST.GlobalStatus.destAirport == null)
                    return;

            }

            static createUkDestPanel(): UkDestPanel {
                var destPanel = new AST.UkData.UkDestPanel();
                destPanel._totalFlow = document.getElementById("ukDestTotalFlow");

                destPanel._tabs = document.getElementById("ukDestTabs");

                destPanel._tabSummary = <SummaryTab>document.getElementById("ukDestTabSummary");
               
                destPanel._tabTimeSeries = document.getElementById("ukDestTabTimeSeries");
                destPanel._tabTimeSeriesTitle = document.getElementById("ukDestTabTimeSeriesTitle");
                destPanel._tabTimeSeriesFootNote = document.getElementById("ukDestTabTimeSeriesFootNote");
                destPanel._divTimeSeriesChart = document.getElementById("ukDestTabTimeSeriesChart");

                destPanel.initUI();
                return destPanel;
            }
        }
    }
} 