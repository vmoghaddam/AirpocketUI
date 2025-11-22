'use strict';
app.controller('fixTimeController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'schedulingService', 'aircraftService', 'authService', 'notificationService', '$route', '$http', function ($scope, $location, $routeParams, $rootScope, flightService, schedulingService, aircraftService, authService, notificationService, $route, $http) {
    $scope.prms = $routeParams.prms;

   
    $scope.loadingVisible = false;
    $scope.loadPanel = {
        message: 'Please wait...',

        showIndicator: true,
        showPane: true,
        shading: true,
        closeOnOutsideClick: false,
        shadingColor: "rgba(0,0,0,0.4)",
        // position: { of: "body" },
        onShown: function () {

        },
        onHidden: function () {

        },
        bindingOptions: {
            visible: 'loadingVisible'
        }
    };
    //////////////////////////////////
    $scope.yf = 1400;
    $scope.month = null;
    $scope.sb_yf = {
        placeholder: 'Year',
        showClearButton: false,
        searchEnabled: false,
        dataSource: [1400, 1399, 1398],

        onSelectionChanged: function (arg) {

        },

        bindingOptions: {
            value: 'yf',


        }
    };
    $scope.monthDs = [
        { id: 1, title: 'فروردین' },
        { id: 2, title: 'اردیبهشت' },
        { id: 3, title: 'خرداد' },
        { id: 4, title: 'تیر' },
        { id: 5, title: 'مرداد' },
        { id: 6, title: 'شهریور' },
        { id: 7, title: 'مهر' },
        { id: 8, title: 'آبان' },
        { id: 9, title: 'آذر' },
        { id: 10, title: 'دی' },
        { id: 11, title: 'بهمن' },
        { id: 12, title: 'اسفند' },
    ];

    $scope.periodDs = [
        { id: 1, title: '12/16 - 01/15' },
        { id: 2, title: '01/16 - 02/15' },
        { id: 3, title: '02/16 - 03/15' },
        { id: 4, title: '03/16 - 04/15' },
        { id: 5, title: '04/16 - 05/15' },
        { id: 6, title: '05/16 - 06/15' },
        { id: 7, title: '06/16 - 07/15' },
        { id: 8, title: '07/16 - 08/15' },
        { id: 9, title: '08/16 - 09/15' },
        { id: 10, title: '09/16 - 10/15' },
        { id: 11, title: '10/16 - 11/15' },
        { id: 12, title: '11/16 - 12/15' },
    ];
    $scope.sb_month = {
        placeholder: 'Period',
        showClearButton: false,
        searchEnabled: false,
        dataSource: $scope.periodDs,
        valueExpr: 'id',
        displayExpr: "title",
        onSelectionChanged: function (arg) {

        },

        bindingOptions: {
            value: 'month',


        }
    };
    $scope.rank = 'All';
    $scope.sb_rank = {
        placeholder: 'Rank',
        showClearButton: false,
        searchEnabled: false,
        dataSource: ['All', 'Cockpit', 'Cabin', 'IP', 'P1', 'P2', 'SCCM', 'CCM', 'ISCCM'],

        onSelectionChanged: function (arg) {

        },

        bindingOptions: {
            value: 'rank',


        }
    };

    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 120,
        validationGroup: 'fixtimerep',
        bindingOptions: {},
        onClick: function (e) {
            var result = e.validationGroup.validate();

            if (!result.isValid) {
                General.ShowNotify(Config.Text_FillRequired, 'error');
                return;
            }

            

            $scope.bind();

        }

    };
    $scope.btn_add = {
        text: 'Add',
        type: 'default',

        width: 150,

        onClick: function (e) {
            $scope.fxmonth = $scope.month;
            $scope.popup_fx_visible = true;


        }

    };
    $scope.btn_delete = {
        text: 'Delete',
        type: 'danger',

        width: 150,
         
        onClick: function (e) {
            
            var selected = $rootScope.getSelectedRows($scope.dg_errors_instance);
            if (!selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            General.Confirm(Config.Text_DeleteConfirm, function (res) {
                if (res) {

                    var ids = Enumerable.From(selected).Select('$.Id').ToArray();
                    var dto = { Ids:ids};
                    $scope.loadingVisible = true;
                    flightService.deleteFDPs(dto).then(function (response) {
                        $scope.loadingVisible = false;
                        $scope.bind();

                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                }
            });

        }

    };
    ////////////////////////////////
    $scope.dg_regroute_columns = [

        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },

        //sortIndex: 2, sortOrder: 'asc'
       // { dataField: 'Date', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yyyy-MM-dd', fixed: true, fixedPosition: 'left' },
        // { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200, fixed: false, fixedPosition: 'left', },
        //  { dataField: 'CourseCode', caption: 'Course Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, minWidth: 300, fixed: false, fixedPosition: 'left', },

        { dataField: 'PDate', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 110, fixed: false, fixedPosition: 'left', fixed: false, fixedPosition: 'left' },
        { dataField: 'DutyTypeTitle', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 250, fixed: false, fixedPosition: 'left', fixed: false, fixedPosition: 'left', sortIndex: 0, sortOrder: 'asc' },
        { dataField: 'LastName', caption: 'Last Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 250, fixed: false, fixedPosition: 'left', fixed: false, fixedPosition: 'left', sortIndex: 1, sortOrder: 'asc' },
        { dataField: 'FirstName', caption: 'First Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 250, fixed: false, fixedPosition: 'left', fixed: false, fixedPosition: 'left', sortIndex: 2, sortOrder: 'asc' },
        { dataField: 'JobGroup', caption: 'Rank', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', fixed: false, fixedPosition: 'left' },
        { dataField: 'FX2', caption: 'Amount', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', fixed: false, fixedPosition: 'left' },
        { dataField: 'Remark', caption: 'Remark', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 400, fixed: false, fixedPosition: 'left', fixed: false, fixedPosition: 'left' },
         


    ];
    $scope.dg_errors_selected = null;
    $scope.dg_errors_instance = null;
    $scope.dg_errors_ds = null;
    $scope.dg_errors = {
        wordWrapEnabled: true,
        rowAlternationEnabled: false,
        headerFilter: {
            visible: false
        },
        filterRow: {
            visible: true,
            showOperationChooser: true,
        },
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'none' },

        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'multiple' },

        columnAutoWidth: false,
        height: $(window).height() - 120,

        columns: $scope.dg_regroute_columns,
        onContentReady: function (e) {
            if (!$scope.dg_errors_instance)
                $scope.dg_errors_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_errors_selected = null;
            }
            else
                $scope.dg_errors_selected = data;


        },

        //"export": {
        //    enabled: true,
        //    fileName: "Financial_Monthly_Register_Route_Report",
        //    allowExportSelectedData: false
        //},
        //onToolbarPreparing: function (e) {
        //    e.toolbarOptions.items.unshift({
        //        location: "before",
        //        template: function () {
        //            return $("<div/>")
        //                // .addClass("informer")
        //                .append(
        //                    "<span style='color:white;'>Flights</span>"
        //                );
        //        }
        //    });
        //},
        //onExporting: function (e) {
        //    e.component.beginUpdate();
        //    e.component.columnOption("row", "visible", false);
        //},
        //onExported: function (e) {
        //    e.component.columnOption("row", "visible", true);
        //    e.component.endUpdate();
        //},
        onRowPrepared: function (e) {
            if (e.data && e.data.IsConflicted == 1) {
                e.rowElement.css('font-weight', 'bold');
                //e.rowElement.css('background', '#fff3e6');
            }

        },

        onCellPrepared: function (e) {
            if (e.rowType === "data" && e.column.caption == "AP") {
                e.cellElement.css('color', '#cc0099');
                e.cellElement.css('background', '#f2f2f2');
            }
            if (e.rowType === "data" && e.column.caption == "Flight No" && e.data.IsConflicted == 1) {
                e.cellElement.css('color', 'white');
                e.cellElement.css('background', '#ff3300');
            }

            if (e.rowType === "data" && e.column.dataField == "IsNiraFound" && e.data.IsNiraFound == 0) {
                e.cellElement.css('color', 'white');
                e.cellElement.css('background', '#ff3300');
            }
            if (e.rowType === "data" && e.column.dataField == "IsRegister" && e.data.IsRegister == 0) {
                e.cellElement.css('color', 'white');
                e.cellElement.css('background', '#ff3300');
            }
            if (e.rowType === "data" && e.column.dataField == "IsSTD" && e.data.IsSTD == 0) {
                e.cellElement.css('color', 'white');
                e.cellElement.css('background', '#ff3300');
            }
            if (e.rowType === "data" && e.column.dataField == "IsSTA" && e.data.IsSTA == 0) {
                e.cellElement.css('color', 'white');
                e.cellElement.css('background', '#ff3300');
            }
            if (e.rowType === "data" && e.column.dataField == "IsRoute" && e.data.IsRoute == 0) {
                e.cellElement.css('color', 'white');
                e.cellElement.css('background', '#ff3300');
            }
            if (e.rowType === "data" && e.column.dataField == "IsStatus" && e.data.IsStatus == 0) {
                e.cellElement.css('color', 'white');
                e.cellElement.css('background', '#ff3300');
            }

        },


        bindingOptions: {
            dataSource: 'dg_errors_ds'
        },
        columnChooser: {
            enabled: false
        },

    };
    //////////////////////////////////
    $scope.fillCrew = function () {


        var _dt = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');

        
        $scope.loadingVisible = true;
        schedulingService.getCrewForRosterByDateNew(1, _dt).then(function (response) {

            $scope.loadingVisible = false;

            $scope.ds_crew = response;
            console.log($scope.ds_crew);
            


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.dg_smscrew_columns = [
        // { dataField: 'Selected', caption: '', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width:45},
        { dataField: 'ScheduleName', caption: 'Schedule Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, sortIndex: 1, sortOrder: 'asc' },
        { dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
        { dataField: 'GroupOrder', caption: 'O', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, visible: false, sortIndex: 0, sortOrder: 'asc' },


    ];
    $scope.dg_smscrew_selected = null;
    $scope.dg_smscrew_instance = null;
    $scope.dg_smscrew_ds = null;
    $scope.smsRecsKeys = [];
    $scope.removeCrew = function (c) {
        $scope.dg_smscrew_selected = Enumerable.From($scope.dg_smscrew_selected).Where('$.Id!=' + c.Id).ToArray();
        $scope.smsRecsKeys = Enumerable.From($scope.smsRecsKeys).Where('$!=' + c.Id).ToArray();
    };
    $scope.bindSMSRecs = function () {
        $scope.dg_smscrew_selected = Enumerable.From($scope.ds_crew).Where(function (x) { return $scope.smsRecsKeys.indexOf(x.Id) != -1; }).OrderBy('$.ScheduleName').ToArray();
        console.log($scope.smsRecsKeys);
    };
    $scope.dg_smscrew = {
        headerFilter: {
            visible: false
        },
        filterRow: {
            visible: true,
            showOperationChooser: true,
        },
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'none' },
        keyExpr: 'Id',
        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'multiple' },

        columnAutoWidth: false,
        height: function () {
            return 520;
        },

        columns: $scope.dg_smscrew_columns,
        onContentReady: function (e) {
            if (!$scope.dg_smscrew_instance)
                $scope.dg_smscrew_instance = e.component;

        },
        onSelectionChanged: function (e) {
            $scope.bindSMSRecs();
            //var data = e.selectedRowsData[0];

            //if (!data) {
            //    $scope.dg_smscrew_selected = null;

            //}
            //else {
            //    $scope.dg_smscrew_selected = data;

            //}

        },
        onRowPrepared: function (e) {
            //if (e.data && e.data.AvailabilityId != 1)
            //    e.rowElement.css('background', '#ffcccc');

        },

        bindingOptions: {
            dataSource: 'ds_crew',
            selectedRowKeys: 'smsRecsKeys',
        }
    };
    $scope.dsFxType = [
       // { id: 300000, title: 'عملیات پرواز - تاکسی' },
        //{
        //    id: 300001, title: 'عملیات پرواز - دایورت'
        //},
        {
            id: 300002, title: 'عملیات پرواز - بازگشت به رمپ'
        },
        {
            id: 300003, title: 'عملیات پرواز - گارانتی تایم'
        },
        {
            id: 300004, title: 'عملیات پرواز - حق مسئولیت'
        },
        { id: 300005, title: 'عملیات پرواز - تاخیرات' },
        { id: 300006, title: 'عملیات پرواز - متفرقه' },


    ];
    $scope.fxType = null;
    $scope.sb_fx_type = {
        placeholder: 'Type',
        showClearButton: false,
        searchEnabled: false,
        dataSource: $scope.dsFxType,
        valueExpr: 'id',
        displayExpr: "title",
        onSelectionChanged: function (arg) {

        },

        bindingOptions: {
            value: 'fxType',


        }
    };
    $scope.fxPeriodDs = [
        { id: 1, title: '12/16 - 01/15' },
        { id: 2, title: '01/16 - 02/15' },
        { id: 3, title: '02/16 - 03/15' },
        { id: 4, title: '03/16 - 04/15' },
        { id: 5, title: '04/16 - 05/15' },
        { id: 6, title: '05/16 - 06/15' },
        { id: 7, title: '06/16 - 07/15' },
        { id: 8, title: '07/16 - 08/15' },
        { id: 9, title: '08/16 - 09/15' },
        { id: 10, title: '09/16 - 10/15' },
        { id: 11, title: '10/16 - 11/15' },
        { id: 12, title: '11/16 - 12/15' },
    ];
    $scope.fxyear = 1400;
    $scope.fxmonth = null;
    $scope.sb_fx_year = {
        placeholder: 'Year',
        showClearButton: false,
        searchEnabled: false,
        dataSource: [1400, 1399, 1398],

        onSelectionChanged: function (arg) {

        },

        bindingOptions: {
            value: 'fxyear',


        }
    };
    $scope.sb_fx_period = {
        placeholder: 'Period',
        showClearButton: false,
        searchEnabled: false,
        dataSource: $scope.fxPeriodDs,
        valueExpr: 'id',
        displayExpr: "title",
        onSelectionChanged: function (arg) {

        },

        bindingOptions: {
            value: 'fxmonth',


        }
    };
    $scope.fx_hh = 0;
    $scope.num_fx_hh = {
        min: 0,
        showSpinButtons: true,
        bindingOptions: {
            value: 'fx_hh',

        }
    };
    $scope.fx_mm = 0;
    $scope.num_fx_mm = {
        min: 0,
        max: 59,
        showSpinButtons: true,
        bindingOptions: {
            value: 'fx_mm',

        }
    };
    //Reposition
    $scope.fx_remark = "";

    $scope.remark_fx = {
        bindingOptions: {
            value: 'fx_remark',


        }
    };
    $scope.popup_fx_visible = false;
    $scope.popup_fx_title = 'Notification';
    $scope.popup_fx = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_fx"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 640,
        width: 1100,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,

        toolbarItems: [

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', validationGroup: "fxsave", onClick: function (arg) {

                        var result = arg.validationGroup.validate();

                        if (!result.isValid || !$scope.dg_smscrew_selected || $scope.dg_smscrew_selected.length == 0) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }

                        if (!$scope.fx_hh && !$scope.fx_mm) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        var cids = Enumerable.From($scope.dg_smscrew_selected).Select('$.Id').ToArray();
                        var dto = {};
                        dto.Ids = cids;
                        dto.Year = $scope.fxyear;
                        dto.Period = $scope.fxmonth;
                        dto.HH = $scope.fx_hh;
                        dto.MM = $scope.fx_mm;
                        dto.Type = $scope.fxType;
                        //Reposition
                        dto.Remark = $scope.fx_remark;
                        if (!dto.Remark)
                            dto.Remark = "";
                        if ($scope.fxFlight) {
                            dto.Remark += "   FLT " + $scope.fxFlight.FlightNumber + " " + $scope.fxFlight.FromAirportIATA + "-" + $scope.fxFlight.ToAirportIATA
                                + " " + moment(new Date($scope.fxFlight.STD)).format('YYYY-MM-DD') + " (" + $scope.fxFlight.ID + ")";
                            dto.FlightId = $scope.fxFlight.ID;
                        }
                        //var names = Enumerable.From($scope.dg_smscrew_selected).Select('$.Name').ToArray().join('_');
                        //var mobiles = Enumerable.From($scope.dg_smscrew_selected).Select('$.Mobile').ToArray().join('_');
                        //var dto = { names: names, mobiles: mobiles, message: $scope.sms_message, sender: $rootScope.userName };
                        $scope.loadingVisible = true;

                        schedulingService.saveFixTime(dto).then(function (response) {
                            $scope.loadingVisible = false;
                            General.ShowNotify(Config.Text_SavedOk, 'success');
                            // $scope.popup_fx_visible = false;
                            $scope.fxType = null;
                            $scope.smsRecsKeys = [];
                            $scope.dg_smscrew_selected = null;
                            $scope.sms_message = null;

                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



                    }
                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (arg) {

                        $scope.popup_fx_visible = false;

                    }
                }, toolbar: 'bottom'
            }
        ],
        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {
            // $(e.titleElement).addClass('vahid');
            // $(e.titleElement).css('background-color', '#f2552c');
        },
        onShowing: function (e) {

        },
        onShown: function (e) {
            if (!$scope.dg_smscrew_instance)
                $scope.dg_smscrew_instance.refresh();
            // $scope.tag_sms_recs_ds=Enumerable.From($scope.ds_crew).Select("{Id:$.Id,ScheduleName:$.ScheduleName}").ToArray();
        },
        onHiding: function () {
            $scope.smsRecsKeys = [];
            $scope.dg_smscrew_selected = null;
            $scope.sms_message = null;
            $scope.popup_fx_visible = false;
            $scope.bind();

        },

        bindingOptions: {
            visible: 'popup_fx_visible',

            title: 'popup_fx_title',

        }
    };
    //////////////////////////////////
    $scope.bind = function () {
        $scope.dg_errors_ds = [];
       


        $scope.loadingVisible = true;
        flightService.getCrewFixTimePeriodReportNoFDP($scope.yf, $scope.month ).then(function (response) {

          

            $scope.loadingVisible = false;
           
            $.each(response, function (_i, _d) {

                _d.FX2 = _d.FX ? $scope.formatMinutes(_d.FX) : $scope.formatMinutes(_d.Duration);
               
            });
            $scope.dg_errors_ds = response;

            //$scope.bound = true;
            //$scope.dg_fix_ds = response.fixDs;
            //$scope.dg_no_ds = response.noDs;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


    };

    ///////////////////////////////////
     
    ///////////////////////////////////
    $scope.formatMinutes = function (mm) {
        return pad(Math.floor(mm / 60)).toString() + ':' + pad(mm % 60).toString();
    };
    $scope._toDate = function (dt) {
        return moment(dt).format("YYYY-MM-DD");
    };
    $scope._toTime = function (dt) {
        return moment(dt).format("HH:mm");
    };
    //////////////////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> Fixed Time';


        $('.fixtime').fadeIn(400, function () {

        });
    }
    //////////////////////////////////////////

    $scope.$on('$viewContentLoaded', function () {
        $scope.fillCrew();

    });



}]);