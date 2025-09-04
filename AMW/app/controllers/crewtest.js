'use strict';

app.controller('crewtestController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'aircraftService', 'authService', 'notificationService', '$route', function ($scope, $location, $routeParams, $rootScope, flightService, aircraftService, authService, notificationService, $route) {
    $scope.prms = $routeParams.prms;

    $scope.Day0 = "05/06/2019";
    $scope.Day1 = "05/08/2019";
    $scope.Day2 = "05/08/2019 23:59:00.000";
    $scope.CurrentDate = new Date(); //new Date(2019, 4, 19, 0, 0, 0);
    $scope.ToDate = (new Date()).addDays(0);
    Flight.cindex = 0;
    $scope.taskIndex = 1000000;
    Flight.activeDatasource = [];
    $scope.flight = null;
    $scope.getGantt = function () {
        var ganttObj = $("#resourceGanttba").data("ejGantt");
        return ganttObj;
    };
    $scope.ganttData = null;
    $scope.resourceGroups = [];
    $scope.resources = [];
    $scope.dataSource = [];



    $scope.scrollGantt = function (data) {

        var df = new Date(data.STD);
        var dd = new Date($scope.datefrom);
        var hours = (Flight.subtractDatesHours(df, dd) * $('.e-schedule-day-headercell').width()) - 50;
        $('.e-ganttviewerbodyContianer').data("ejScroller").scrollX(hours);
    };
    $scope.scrollGanttNow = function () {
        var d = new Date(Date.now());
        var df = new Date(d);
        var dd = new Date($scope.datefrom);
        var hours = (Flight.subtractDatesHours(df, dd) * $('.e-schedule-day-headercell').width()) - 50;
        $('.e-ganttviewerbodyContianer').data("ejScroller").scrollX(hours);
    };
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
    /////////////////////////////////////////
    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 120,

        bindingOptions: {},
        onClick: function (e) {

            $scope.popup_search_visible = true;

        }

    };
    $scope.btn_box = {
        text: 'Group',
        type: 'default',
        //icon: 'link',
        width: 150,

        onClick: function (e) {


            if ($scope.selectedIds.length < 1)
                return;
            if ($scope.selectedIds.length > 10) {
                General.ShowNotify('Invalid sector counts', 'error');
                return;
            }
            //$scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            //if (!$scope.dg_selected) {
            //    General.ShowNotify(Config.Text_NoRowSelected, 'error');
            //    return;
            //}
            var check = Enumerable.From($scope.selectedItems).Select('$.CalendarId').Distinct().ToArray();

            // if (check.length > 1)
            //     return;
            var dto = { ids: $scope.selectedIds, cid: $scope.selectedItems[0].CalendarId };
            $scope.loadingVisible = true;
            flightService.boxItems(dto).then(function (response) {
                $scope.loadingVisible = false;
                $scope.rebind();

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        }

    };
    $scope.btn_unbox = {
        text: 'UnGroup',
        type: 'default',
        //icon: 'revert',
        width: 150,

        onClick: function (e) {
            if (!$scope.selectedBox)
                return;
            //$scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            //if (!$scope.dg_selected) {
            //    General.ShowNotify(Config.Text_NoRowSelected, 'error');
            //    return;
            //}


            var dto = { id: $scope.selectedBox.BoxId };
            $scope.loadingVisible = true;
            flightService.unboxItems(dto).then(function (response) {
                $scope.loadingVisible = false;
                $scope.rebind();
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        }

    };
    $scope.IsCrewDisabled = false;
    $scope.btn_crew_add = {
        text: '',
        type: 'default',
        icon: 'plus',
        width: 40,
        onClick: function (e) {


            if (!$scope.selectedBox) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            if ($scope.selectedBox.WOCLError == 1) {
                General.ShowNotify('WOCL Error', 'error');
                return;
            }
            if ($scope.selectedBox.IsDutyOver == 1) {
                General.ShowNotify('Over Duty Error', 'error');
                return;
            }

            $scope.popup_crew2_visible = true;
            //var data = { parent: $scope.dg_selected, Id: null };

            //$rootScope.$broadcast('InitAddLocation', data);
        },
        bindingOptions: {
            disabled: 'IsCrewDisabled',
        }

    };
    $scope.btn_crew_delete = {
        text: '',
        type: 'danger',
        icon: 'remove',
        width: 40,
        onClick: function (e) {

            $scope.dg_crew_selected = $rootScope.getSelectedRow($scope.dg_crew_instance);
            if (!$scope.dg_crew_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            General.Confirm(Config.Text_DeleteConfirm, function (res) {
                if (res) {

                    var dto = { Id: $scope.dg_crew_selected.Id, };
                    //joks
                    $scope.loadingVisible = true;
                    flightService.deleteBoxCrew(dto).then(function (response) {
                        $scope.loadingVisible = false;
                        General.ShowNotify(Config.Text_SavedOk, 'success');
                        $scope.doRefresh = true;

                        $scope.getCrew($scope.selectedBox.BoxId);


                        // $scope.bind();




                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                }
            });
        },
        bindingOptions: {
            disabled: 'IsCrewDisabled',
        }

    };
    ///////////////////////////
    $scope.group_id = null;
    $scope.sb_group = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceGroups(),
        itemTemplate: function (data) {
            return $rootScope.getSbTemplateGroup(data);
        },
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'group_id',

        }
    };
    $scope.dg_person_columns = [
        { dataField: 'Position', caption: 'Position', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 140, fixed: true, fixedPosition: 'left' },
        { dataField: 'ScheduleName', caption: 'Schedule Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 180, fixed: false, fixedPosition: 'left' },
        { dataField: 'Code', caption: 'Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: true, fixedPosition: 'left' },
        //{ dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150, fixed: false, fixedPosition: 'left' },
        { dataField: 'AvStatus', caption: 'Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },

        {
            dataField: "", caption: 'MEDICAL',
            width: 85,
            allowFiltering: false,
            allowSorting: false,
            alignment: 'center',
            cellTemplate: function (container, options) {

                var color = 'green';
                var icon = 'ion-md-checkmark-circle';
                if (options.data.IsMedicalExpired == 1) { color = 'red'; icon = 'ion-md-alert'; };


                $("<div>")
                    .append("<i style='font-size:22px;color:" + color + "!important' class='icon " + icon + "'></i>")
                    .appendTo(container);

            },

        },

        {
            dataField: "", caption: 'LPR',
            width: 85,
            allowFiltering: false,
            allowSorting: false,
            alignment: 'center',
            cellTemplate: function (container, options) {

                var color = 'green';
                var icon = 'ion-md-checkmark-circle';
                if (options.data.IsLPRExpired == 1) { color = 'red'; icon = 'ion-md-alert'; };
                var text = "";
                if (options.data.IsLPRExpired == -1) { color = 'gray'; icon = ''; text = "<span style='font-size:16px'>N/A</span>" };

                $("<div>")
                    .append("<i style='font-size:22px;color:" + color + "!important' class='icon " + icon + "'>" + text + "</i>")
                    .appendTo(container);

            },

        },

        {
            dataField: "", caption: 'SKILL',
            width: 85,
            allowFiltering: false,
            allowSorting: false,
            alignment: 'center',
            cellTemplate: function (container, options) {

                var color = 'green';
                var icon = 'ion-md-checkmark-circle';

                if (options.data.IsProficiencyExpired == 1) { color = 'red'; icon = 'ion-md-alert'; };

                var text = "";
                if (options.data.IsProficiencyExpired == -1) { color = 'gray'; icon = ''; text = "<span style='font-size:16px'>N/A</span>" };


                $("<div>")
                    .append("<i style='font-size:22px;color:" + color + "!important' class='icon " + icon + "'>" + text + "</i>")
                    .appendTo(container);

            },

        },

        {
            dataField: "", caption: 'CMC',
            width: 85,
            allowFiltering: false,
            allowSorting: false,
            alignment: 'center',
            cellTemplate: function (container, options) {

                var color = 'green';
                var icon = 'ion-md-checkmark-circle';
                if (options.data.IsCMCExpired == 1) { color = 'red'; icon = 'ion-md-alert'; };


                $("<div>")
                    .append("<i style='font-size:22px;color:" + color + "!important' class='icon " + icon + "'></i>")
                    .appendTo(container);

            },

        },

        //{
        //    dataField: "", caption: 'CRM',
        //    width: 85,
        //    allowFiltering: false,
        //    allowSorting: false,
        //    alignment: 'center',
        //    cellTemplate: function (container, options) {

        //        var color = 'green';
        //        var icon = 'ion-md-checkmark-circle';
        //        if (options.data.IsCRMExpired == 1) { color = 'red'; icon = 'ion-md-alert'; };


        //        $("<div>")
        //            .append("<i style='font-size:22px;color:" + color + "!important' class='icon " + icon + "'></i>")
        //            .appendTo(container);

        //    },

        //},

        {
            dataField: "", caption: 'CCRM',
            width: 85,
            allowFiltering: false,
            allowSorting: false,
            alignment: 'center',
            cellTemplate: function (container, options) {

                var color = 'green';
                var icon = 'ion-md-checkmark-circle';
                if (options.data.IsCCRMExpired == 1) { color = 'red'; icon = 'ion-md-alert'; };


                $("<div>")
                    .append("<i style='font-size:22px;color:" + color + "!important' class='icon " + icon + "'></i>")
                    .appendTo(container);

            },

        },

        {
            dataField: "", caption: 'AVSEC',
            width: 85,
            allowFiltering: false,
            allowSorting: false,
            alignment: 'center',
            cellTemplate: function (container, options) {

                var color = 'green';
                var icon = 'ion-md-checkmark-circle';
                if (options.data.IsAvSecExpired == 1) { color = 'red'; icon = 'ion-md-alert'; };


                $("<div>")
                    .append("<i style='font-size:22px;color:" + color + "!important' class='icon " + icon + "'></i>")
                    .appendTo(container);

            },

        },

        {
            dataField: "", caption: 'SEPT',
            width: 85,
            allowFiltering: false,
            allowSorting: false,
            alignment: 'center',
            cellTemplate: function (container, options) {

                var color = 'green';
                var icon = 'ion-md-checkmark-circle';
                if (options.data.IsSEPTExpired == 1) { color = 'red'; icon = 'ion-md-alert'; };


                $("<div>")
                    .append("<i style='font-size:22px;color:" + color + "!important' class='icon " + icon + "'></i>")
                    .appendTo(container);

            },

        },

        {
            dataField: "", caption: 'SEPTP',
            width: 85,
            allowFiltering: false,
            allowSorting: false,
            alignment: 'center',
            cellTemplate: function (container, options) {

                var color = 'green';
                var icon = 'ion-md-checkmark-circle';
                if (options.data.IsSEPTPExpired == 1) { color = 'red'; icon = 'ion-md-alert'; };


                $("<div>")
                    .append("<i style='font-size:22px;color:" + color + "!important' class='icon " + icon + "'></i>")
                    .appendTo(container);

            },

        },

        {
            dataField: "", caption: 'DG',
            width: 85,
            allowFiltering: false,
            allowSorting: false,
            alignment: 'center',
            cellTemplate: function (container, options) {

                var color = 'green';
                var icon = 'ion-md-checkmark-circle';
                if (options.data.IsDGExpired == 1) { color = 'red'; icon = 'ion-md-alert'; };


                $("<div>")
                    .append("<i style='font-size:22px;color:" + color + "!important' class='icon " + icon + "'></i>")
                    .appendTo(container);

            },

        },

        {
            dataField: "", caption: 'SMS',
            width: 85,
            allowFiltering: false,
            allowSorting: false,
            alignment: 'center',
            cellTemplate: function (container, options) {

                var color = 'green';
                var icon = 'ion-md-checkmark-circle';
                if (options.data.IsSMSExpired == 1) { color = 'red'; icon = 'ion-md-alert'; };


                $("<div>")
                    .append("<i style='font-size:22px;color:" + color + "!important' class='icon " + icon + "'></i>")
                    .appendTo(container);

            },

        },

        {
            dataField: "", caption: 'FIRSTAID',
            width: 85,
            allowFiltering: false,
            allowSorting: false,
            alignment: 'center',
            cellTemplate: function (container, options) {

                var color = 'green';
                var icon = 'ion-md-checkmark-circle';
                if (options.data.IsFirstAidExpired == 1) { color = 'red'; icon = 'ion-md-alert'; };

                var text = "";
                if (options.data.IsFirstAidExpired == -1) { color = 'gray'; icon = ''; text = "<span style='font-size:16px'>N/A</span>" };


                $("<div>")
                    .append("<i style='font-size:22px;color:" + color + "!important' class='icon " + icon + "'>" + text + "</i>")
                    .appendTo(container);

            },

        },


        {
            dataField: "", caption: 'COLD W.',
            width: 85,
            allowFiltering: false,
            allowSorting: false,
            alignment: 'center',
            cellTemplate: function (container, options) {

                var color = 'green';
                var icon = 'ion-md-checkmark-circle';
                if (options.data.IsColdWeatherExpired == 1) { color = 'red'; icon = 'ion-md-alert'; };

                var text = "";
                if (options.data.IsColdWeatherExpired == -1) { color = 'gray'; icon = ''; text = "<span style='font-size:16px'>N/A</span>" };


                $("<div>")
                    .append("<i style='font-size:22px;color:" + color + "!important' class='icon " + icon + "'>" + text + "</i>")
                    .appendTo(container);

            },

        },

        {
            dataField: "", caption: 'HOT W.',
            width: 85,
            allowFiltering: false,
            allowSorting: false,
            alignment: 'center',
            cellTemplate: function (container, options) {

                var color = 'green';
                var icon = 'ion-md-checkmark-circle';
                if (options.data.IsHotWeatherExpired == 1) { color = 'red'; icon = 'ion-md-alert'; };

                var text = "";
                if (options.data.IsHotWeatherExpired == -1) { color = 'gray'; icon = ''; text = "<span style='font-size:16px'>N/A</span>" };


                $("<div>")
                    .append("<i style='font-size:22px;color:" + color + "!important' class='icon " + icon + "'>" + text + "</i>")
                    .appendTo(container);

            },

        },


        {
            dataField: "", caption: 'UPSET',
            width: 85,
            allowFiltering: false,
            allowSorting: false,
            alignment: 'center',
            cellTemplate: function (container, options) {

                var color = 'green';
                var icon = 'ion-md-checkmark-circle';
                if (options.data.IsUpsetRecoveryTrainingExpired == 1) { color = 'red'; icon = 'ion-md-alert'; };
                var text = "";
                if (options.data.IsUpsetRecoveryTrainingExpired == -1) { color = 'gray'; icon = ''; text = "<span style='font-size:16px'>N/A</span>" };

                $("<div>")
                    .append("<i style='font-size:22px;color:" + color + "!important' class='icon " + icon + "'>" + text + "</i>")
                    .appendTo(container);

            },

        },
        { dataField: 'CurrentLocationAirporIATA', caption: 'Location', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90 },


    ];

    $scope.dg_person_selected = null;
    $scope.dg_person_instance = null;
    $scope.dg_person_ds = null;
    $scope.dg_person = {
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
        selection: { mode: 'single' },

        columnAutoWidth: false,
        height: $(window).height() - 310,// 490 

        columns: $scope.dg_person_columns,
        onContentReady: function (e) {
            if (!$scope.dg_person_instance)
                $scope.dg_person_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_person_selected = null;
                // $scope.group_id = null;
                // $scope.dg_sum_ds = null;
            }
            else {
                $scope.dg_person_selected = data;
                $scope.group_id = data.GroupId;
                //$scope.loadingVisible = true;

                //flightService.getCrewSummary(data.Id).then(function (response) {


                //    $scope.dg_sum_ds = [];
                //    $scope.dg_sum_ds.push({ Id: 1, Title: 'Past 24 Hours', Value: (response.Past24 ? response.Past24 : 0) });
                //    $scope.dg_sum_ds.push({ Id: 2, Title: 'Past 48 Hours', Value: (response.Past48 ? response.Past48 : 0) });
                //    $scope.dg_sum_ds.push({ Id: 3, Title: 'Past Week', Value: (response.PastWeek ? response.PastWeek : 0) });
                //    $scope.dg_sum_ds.push({ Id: 4, Title: 'Past Month', Value: (response.PastMonth ? response.PastMonth : 0) });
                //    $scope.dg_sum_instance.refresh();
                //    /////////////////////
                //    courseService.getPersonLastCertificates(data.PersonId).then(function (response) {
                //        $scope.loadingVisible = false;
                //        $scope.dg_certificate_ds = response;


                //    }, function (err) { General.ShowNotify(err.message, 'error'); });
                //    ////////////////////////

                //}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            }


        },
        onCellPrepared: function (cellInfo) {
            if (cellInfo.rowType == "data" && cellInfo.column.dataField === 'CurrentLocationAirporIATA') {
                if (cellInfo.data.IsLocation) {
                    //   cellInfo.cellElement.css('background', '#ddffdd');
                    cellInfo.cellElement.css('color', 'green');

                }
                else {
                    // cellInfo.cellElement.css('background', '#ffdddd');
                    cellInfo.cellElement.css('color', 'red').css('font-weight', 'bold');
                }
            }
            if (cellInfo.rowType == "data" && cellInfo.column.dataField === 'AvStatus') {
                if (cellInfo.data.AvStatusId > 1) {

                    cellInfo.cellElement.css('background', '#ffdddd');
                }
                else {
                    cellInfo.cellElement.css('background', '#ddffdd');
                }
            }
        },
        bindingOptions: {
            dataSource: 'dg_person_ds',

        }
    };

    ///////////////////////////
    $scope.dg_crew_columns = [

        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 250, fixed: true, fixedPosition: 'left' },
        { dataField: 'PID', caption: 'Personnel Id', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130, fixed: true, fixedPosition: 'left' },
        { dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150, fixed: true, fixedPosition: 'left' },
        { dataField: 'Location', caption: 'Department', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },

        {
            dataField: "", caption: 'Passport',
            width: 55,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {

                var color = 'green';
                var icon = 'ion-md-checkmark-circle';
                if (options.data.IsPassportExpired) { color = 'red'; icon = 'ion-md-alert'; }
                else if (options.data.IsPassportExpiring) {
                    color = 'orange'; icon = 'ion-md-alert';
                }


                $("<div>")
                    .append("<i style='font-size:22px;color:" + color + "!important' class='icon " + icon + "'></i>")
                    .appendTo(container);



            },

        },




        { dataField: 'PassportNumber', caption: 'Passport No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
        { dataField: 'DatePassportExpire', caption: 'Passport Expire', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },
        { dataField: 'CaoCardNumber', caption: 'CAO No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
        { dataField: 'DateCaoCardExpire', caption: 'CAO Expire', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },

        { dataField: 'NID', caption: 'National Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
        { dataField: 'Mobile', caption: 'Mobile', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },

        { dataField: 'Types', caption: 'Types', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200, fixed: false, fixedPosition: 'left' },


    ];

    $scope.dg_crew_selected = null;
    $scope.dg_crew_instance = null;
    $scope.dg_crew_ds = null;
    $scope.dg_crew = {
        headerFilter: {
            visible: false
        },
        filterRow: {
            visible: false,
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
        selection: { mode: 'single' },

        columnAutoWidth: false,
        height: 270,// $(window).height() - 250,// 490 

        columns: $scope.dg_person_columns,
        onContentReady: function (e) {
            if (!$scope.dg_crew_instance)
                $scope.dg_crew_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_crew_selected = null;

            }
            else {
                $scope.dg_crew_selected = data;

            }
        },
        onRowPrepared: function (e) {
            if (e.data && e.data.AvailabilityId != 1)
                e.rowElement.css('background', '#ffcccc');

        },




        bindingOptions: {
            dataSource: 'dg_crew_ds',

        }
    };
    //////////////////////////////////////

    $scope.dg_crew2_columns = [
        // { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 250, fixed: true, fixedPosition: 'left' },

    ];
    $scope.selectedCell = null;
    $scope.dg_crew2_selected = null;
    $scope.dg_crew2_instance = null;
    $scope.dg_crew2_ds = null;
    $scope.dg_crew2 = {
        headerFilter: {
            visible: false
        },
        filterRow: {
            visible: false,
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
        selection: { mode: 'single' },

        columnAutoWidth: false,
        height: $(window).height() - 115,// 490 

        columns: $scope.dg_crew2_columns,
        onContentReady: function (e) {
            if (!$scope.dg_crew2_instance)
                $scope.dg_crew2_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_crew2_selected = null;

            }
            else {
                $scope.dg_crew2_selected = data;

            }
        },
        onRowPrepared: function (e) {
            //if (e.data && e.data.AvStatusId != 1)
            //    e.rowElement.css('background', '#ffcccc');
            //  if (e.data)
            //    e.rowElement.css({ height: 100 });
        },
        onCellPrepared: function (e) {
            var sbdate = moment($scope.selectedBox.Date).format("YYYYMMDD");
            if (e.data && e.column.dataField == "Name")
                e.cellElement.css({
                    background: '#f1f1f1',
                    padding: '5px'
                });
            console.log('green ' + e.column.dataField + '   ' + sbdate);
            if (e.data && e.column.dataField == sbdate)
                e.cellElement.addClass('grid-cell-day');

            if (e.data && e.value.CalendarStatusId) {

                var clr = "white";
                switch (e.value.CalendarStatusId) {
                    case 1169:
                        clr = "#ffccff";
                        break;
                    case 1166:
                    case 1165:
                        clr = '#e6ccff';
                        break;
                    case 1167:
                    case 1168:
                    case 1170:
                        clr = '#ffff99';
                        break;
                    default:
                        break;
                }
                e.cellElement.css({
                    background: clr
                });
            }

            if (e.data && e.column.dataField != "Name") {
                var violated = Enumerable.From(e.value.Times).Where('$.DutyViolated || $.FlightViolated').FirstOrDefault();
                if (violated)
                    e.cellElement.css({
                        background: '#ff8566'
                    });
            }
        },

        onCellClick: function (e) {
            if (e.data) {
                console.log(e.data);
                $('td').removeClass('grid-cell-selected');
                e.cellElement.addClass('grid-cell-selected');
                $scope.selectedCell = e.value;
                $scope.selected_date = e.value.DateStr;
                $scope.selected_crew = e.data.Name + " (" + e.data.PID + ")";
                if ($scope.sb_position_instance) {

                    if (e.data.JobGroup == 'P1') {

                        $scope.sb_position_instance.option('value', 1160);
                    }
                    if (e.data.JobGroup == 'P2') {

                        $scope.sb_position_instance.option('value', 1161);
                    }
                    if (e.data.JobGroup == 'TRI') {

                        $scope.sb_position_instance.option('value', 1205);
                    }
                    if (e.data.JobGroup == 'TRE') {

                        $scope.sb_position_instance.option('value', 1206);
                    }
                    if (e.data.JobGroup == 'CCM') {

                        $scope.sb_position_instance.option('value', 1158);
                    }
                    if (e.data.JobGroup == 'SCCM') {

                        $scope.sb_position_instance.option('value', 1157);
                    }
                    if (e.data.JobGroup == 'SCCM(i)') {

                        $scope.sb_position_instance.option('value', 1157);
                    }
                }

                $scope.dg_fdp_ds = e.value.Times;
                //FDPReduction
                $scope.BoxTimeStr = "Flight: " + GetTimeStr($scope.selectedBox.Flight) + " (h)       Duty: " + GetTimeStr($scope.selectedBox.Duty) + " (h)   Max:" + GetTimeStr($scope.selectedBox.MaxFDPExtended - e.value.FDPReduction) + "(h)";


                var value = e.value;
                var assign = true;
                var sbdate = moment($scope.selectedBox.Date).format("YYYYMMDD");
                if (e.column.dataField != sbdate)
                    assign = false;
                if (e.value.CalendarStatusId && (e.value.CalendarStatusId != 1167 && e.value.CalendarStatusId != 1168)) {
                    assign = false;

                }
                if (assign && value.Boxes) {
                    assign = Enumerable.From(value.Boxes).Where('$.BoxId==' + $scope.selectedBox.BoxId).FirstOrDefault() == null;
                }
                if (e.data.RestIssue == 1) {
                    assign = false;
                }
                if (e.data.OverDuty == 1) {
                    assign = false;
                }
                $scope.selected_date2 = e.column.dataField;
                $scope.IsAssignDisable = !assign;
                //   console.log(e.value);
                //   console.log(e.data);
            }

        },


        bindingOptions: {
            dataSource: 'dg_crew2_ds',
            // columns:'dg_crew2_columns',
        }
    };
    //////////////////////////////////////
    $scope.selected_crew = "Crew";
    $scope.selected_date = "Date";
    $scope.selected_date2 = "";
    $scope.dg_fdp_columns = [
        // { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 250, fixed: true, fixedPosition: 'left' },
        { dataField: 'Title', caption: 'FDP', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },
        { dataField: 'Flight', caption: 'Flight', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 75, },
        { dataField: 'Duty', caption: 'Duty', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 75, },
        {
            caption: 'After Assigning',
            columns: [
                { dataField: 'NewFlight', caption: 'Flight', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 75, },
                { dataField: 'NewDuty', caption: 'Duty', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 75, },
            ]
        }

    ];
    $scope.dg_fdp_selected = null;
    $scope.dg_fdp_instance = null;
    $scope.dg_fdp_ds = null;
    $scope.dg_fdp = {
        headerFilter: {
            visible: false
        },
        filterRow: {
            visible: false,
            showOperationChooser: true,
        },
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'none' },

        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite', showScrollbar: 'never' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,
        height: 320,

        columns: $scope.dg_fdp_columns,
        onContentReady: function (e) {
            if (!$scope.dg_fdp_instance)
                $scope.dg_fdp_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_fdp_selected = null;

            }
            else {
                $scope.dg_fdp_selected = data;

            }
        },
        onRowPrepared: function (e) {
            //if (e.data && e.data.AvStatusId != 1)
            //    e.rowElement.css('background', '#ffcccc');
            //  if (e.data)
            //    e.rowElement.css({ height: 100 });
        },
        onCellPrepared: function (e) {
            if (e.data && e.column.dataField == "Title")
                e.cellElement.css({
                    background: '#f1f1f1'
                });

            if (e.data && e.column.dataField == "Duty" && e.data.DutyViolated) {
                //#ff8566
                e.cellElement.css({
                    background: '#ff8566'
                });
            }

            if (e.data && e.column.dataField == "Flight" && e.data.FlightViolated) {
                //#ff8566
                e.cellElement.css({
                    background: '#ff8566'
                });
            }

            if (e.data && e.column.dataField == "NewDuty" && e.data.NewDutyViolated) {
                //#ff8566
                e.cellElement.css({
                    background: '#ff8566'
                });
            }

            if (e.data && e.column.dataField == "NewFlight" && e.data.NewFlightViolated) {
                //#ff8566
                e.cellElement.css({
                    background: '#ff8566'
                });
            }


        },




        bindingOptions: {
            dataSource: 'dg_fdp_ds',
            // columns:'dg_crew2_columns',
        }
    };
    //////////////////////////////////////

    $scope.dg_items_columns = [
        // { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 250, fixed: true, fixedPosition: 'left' },
        { dataField: 'FlightNumber', caption: 'No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 70 },
        { dataField: 'Route', caption: 'Route', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, },
        { dataField: 'Duration', caption: 'Duration', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, },
        { dataField: 'STS', caption: '', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, },
        //{ dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, },
        //{ dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, },
        //{ dataField: 'FlightH', caption: 'HH', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 60, },
        //{ dataField: 'FlightM', caption: 'MM', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 60, },
    ];
    $scope.dg_items_selected = null;
    $scope.dg_items_instance = null;
    $scope.dg_items_ds = null;
    $scope.dg_items = {
        headerFilter: {
            visible: false
        },
        filterRow: {
            visible: false,
            showOperationChooser: true,
        },
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'none' },

        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite', },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,
        height: $(window).height() - 500,

        columns: $scope.dg_items_columns,
        onContentReady: function (e) {
            if (!$scope.dg_items_instance)
                $scope.dg_items_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_items_selected = null;

            }
            else {
                $scope.dg_items_selected = data;

            }
        },
        onRowPrepared: function (e) {
            //if (e.data && e.data.AvStatusId != 1)
            //    e.rowElement.css('background', '#ffcccc');
            //  if (e.data)
            //    e.rowElement.css({ height: 100 });
        },
        onCellPrepared: function (e) {

        },




        bindingOptions: {
            dataSource: 'dg_items_ds',
            // columns:'dg_crew2_columns',
        }
    };
    //////////////////////////////////////
    $scope.dg_sum_columns = [

        { dataField: 'Title', caption: 'Summary', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },
        { dataField: 'Value', caption: 'Count', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 60 },


    ];

    $scope.dg_sum_selected = null;
    $scope.dg_sum_instance = null;
    $scope.dg_sum_ds = null;
    $scope.dg_sum = {
        headerFilter: {
            visible: false
        },
        filterRow: {
            visible: false,
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
        selection: { mode: 'single' },

        columnAutoWidth: false,
        height: 270,

        columns: $scope.dg_sum_columns,
        onContentReady: function (e) {
            if (!$scope.dg_sum_instance)
                $scope.dg_sum_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_sum_selected = null;

            }
            else {
                $scope.dg_sum_selected = data;

            }


        },
        bindingOptions: {
            dataSource: 'dg_sum_ds',

        }
    };
    ///////////////////////////////////////////
    $scope.date_from = {
        type: "date",
        width: '100%',

        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: 'CurrentDate',

        }
    };
    $scope.date_to = {
        type: "date",
        width: '100%',

        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: 'ToDate',

        }
    };
    //////////////////////////////////////////////
    $scope.FromDateEvent = null;
    $scope.ToDateEvent = null;
    $scope.date_from_event = {
        type: "datetime",
        width: '100%',

        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: 'FromDateEvent',

        }
    };
    $scope.date_to_event = {
        type: "datetime",
        width: '100%',

        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: 'ToDateEvent',

        }
    };
    //////////////////////////////////////////////
    $scope.event_status = null;
    $scope.popup_event_visible = false;
    $scope.popup_event_title = '';
    $scope.popup_event = {
        width: 300,
        height: 260,
        fullScreen: false,
        showTitle: true,
        dragEnabled: false,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Ok', icon: 'check', validationGroup: 'eventadd', onClick: function (arg) {

                        // console.log($scope.data);
                        //return;
                        var result = arg.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        //////////////////////////////
                        var dto = {

                            EmployeeId: $scope.dg_crew2_selected.Id,
                            Date: $scope.selected_date2,
                            Status: $scope.event_status,
                            DateStart: $scope.FromDateEvent,
                            DateEnd: $scope.ToDateEvent,
                        };

                        $scope.loadingVisible = true;
                        flightService.saveCrewCalendar(dto).then(function (response) {
                            $scope.loadingVisible = false;
                            $scope.bindCrew();

                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                        //////////////////////////////

                    }
                }, toolbar: 'bottom'
            },

            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {


        },
        onShown: function (e) {

        },
        onHiding: function () {


        },
        bindingOptions: {
            visible: 'popup_event_visible',
            //width: 'pop_width',
            //height: 'pop_height',
            title: 'popup_event_title',

        }
    };

    //close button
    $scope.popup_event.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_event_visible = false;

    };
    ///////////////////////////////////////////
    $scope.popup_search_visible = false;
    $scope.popup_search_title = '';
    $scope.popup_search = {
        width: 500,
        height: 300,
        fullScreen: false,
        showTitle: true,
        dragEnabled: false,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Ok', icon: 'check', validationGroup: 'crewsearch', onClick: function (arg) {

                        // console.log($scope.data);
                        //return;
                        var result = arg.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        $scope.bindtest();

                    }
                }, toolbar: 'bottom'
            },

            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {


        },
        onShown: function (e) {

        },
        onHiding: function () {


        },
        bindingOptions: {
            visible: 'popup_search_visible',
            //width: 'pop_width',
            //height: 'pop_height',
            title: 'popup_search_title',

        }
    };

    //close button
    $scope.popup_search.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_search_visible = false;

    };

    $scope.popup_crew_visible = false;
    $scope.popup_crew_title = 'Crew';
    $scope.popup_crew = {
        width: 1300,
        height: 650,
        fullScreen: true,
        showTitle: true,
        dragEnabled: false,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Add', icon: 'check', validationGroup: 'crewadd', onClick: function (arg) {
                        var result = arg.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        //crewati
                        $scope.dg_person_selected = $rootScope.getSelectedRow($scope.dg_person_instance);
                        if (!$scope.dg_person_selected) {
                            General.ShowNotify(Config.Text_NoRowSelected, 'error');
                            return;
                        }

                        //                public int Id { get; set; }
                        //public int EmployeeId { get; set; }
                        //public int FlightPlanId { get; set; }
                        //public int CalanderId { get; set; }
                        //public int GroupId { get; set; }
                        //public string Remark { get; set; }
                        var dto = {
                            Id: -1,
                            EmployeeId: $scope.dg_person_selected.Id,
                            FlightPlanId: $scope.selectedBox.FlightPlanId,
                            CalanderId: $scope.selectedBox.CalendarId,
                            GroupId: $scope.group_id,
                            BoxId: $scope.selectedBox.BoxId,
                            AvailabilityId: $scope.dg_person_selected.AvStatusId,
                        };




                        $scope.loadingVisible = true;

                        flightService.saveFlightPlanCrew(dto).then(function (response) {
                            General.ShowNotify(Config.Text_SavedOk, 'success');
                            $scope.loadingVisible = false;
                            $scope.doRefresh = true;
                            $scope.group_id = null;
                            $scope.getCrew($scope.selectedBox.BoxId);


                            /////////////////////

                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


                    }
                }, toolbar: 'bottom'
            },

            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' },
            { widget: 'dxButton', location: 'before', options: { type: 'default', text: 'Calendar', }, toolbar: 'bottom' },
            { widget: 'dxButton', location: 'before', options: { type: 'default', text: 'Flights', }, toolbar: 'bottom' },
            // { widget: 'dxButton', location: 'before', options: { type: 'default', text: 'Certificates', }, toolbar: 'bottom' },
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {
            //if ($scope.plan.IsApproved70==1)
            //    $scope.dg_reg_height = 380;
            //else
            //    $scope.dg_reg_height = 330;

        },
        onShown: function (e) {

            $scope.dg_person_instance.repaint();
            $scope.bindPeople();
        },
        onHiding: function () {


            //$scope.group_id = null;

            //$scope.doRefreshPeople = true;
            //$scope.dg_person_ds = null;
            //$scope.getCrew($scope.dg_selected.Id, $scope.dg_selected.CalendarId);
            //if ($scope.doRefresh)
            //    $scope.bind();
            $scope.popup_crew_visible = false;

        },
        bindingOptions: {
            visible: 'popup_crew_visible',
            //width: 'pop_width',
            //height: 'pop_height',
            title: 'FlightsTitle',

        }
    };

    //close button
    $scope.popup_crew.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_crew_visible = false;

    };
    ////////////////////////////////////////////
    $scope.crew_position_ds = [];
    $scope.$watch('IsCockpit', function (newValue, oldValue, scope) {
        if (newValue)
            flightService.getCockpitPositions().then(function (response) {
                $scope.crew_position_ds = response;
                $scope.bindCrew();
            }, function (err) { General.ShowNotify(err.message, 'error'); });
        else
            flightService.getCabinPositions().then(function (response) {
                $scope.crew_position_ds = response;
                $scope.bindCrew();
            }, function (err) { General.ShowNotify(err.message, 'error'); });
    });
    $scope.IsCockpit = true;
    $scope.sb_cabin = {
        showClearButton: false,
        searchEnabled: false,

        //displayExpr: "Title",
        //valueExpr: 'Id',
        height: 35,
        width: 150,
        value: 'Cockpit',
        dataSource: ['Cockpit', 'Cabin'],
        onValueChanged: function (e) {
            $scope.IsCockpit = e.value == 'Cockpit';

        },
    };
    $scope.filter_name = null;
    $scope.txt_name_filter = {
        hoverStateEnabled: false,
        readOnly: false,
        placeholder: 'Name, PID',
        width: '100%',
        onFocusOut: function (e) {
            // alert($scope.filter_name);
            $scope.dg_crew2_ds = $scope.getFilteredCrew();
            $scope.dg_crew2_instance.refresh();
        },
        bindingOptions: {
            value: 'filter_name',

        }
    };
    $scope.popup_crew2_visible = false;
    $scope.popup_crew2_title = 'Crew';
    $scope.IsAssignDisable = true;

    $scope.sb_position_instance = null;
    $scope.buildAlertBox = function (data, field, caption, cabin) {

        var rc = "#cc0000";
        if (cabin) {
            if (cabin == "cabin" && data.JobGroupCode.startsWith('00101')) {
                return "";

            }
            else if (cabin == "cockpit" && data.JobGroupCode.startsWith('00102')) {
                return "";
            }
        }
        if (data[field] == 0)
            return "";
        return "<div class='grid-cell-certificate' style='background:" + (rc) + "'>" + caption + "</div>";
    };
    $scope.popup_crew2 = {
        width: 1300,
        height: 650,
        fullScreen: true,
        showTitle: false,
        dragEnabled: false,
        toolbarItems: [
            {
                widget: 'dxButton', location: 'before', options: {
                    //bindingOptions: { disabled: 'IsAssignDisable' },
                    type: 'default', text: 'Profile', icon: 'card', onClick: function (arg) {
                        if (!$scope.dg_crew2_selected)
                            return;
                        var eid = $scope.dg_crew2_selected.Id;
                        $rootScope.$broadcast('InitViewPerson', $scope.dg_crew2_selected);

                    }
                }, toolbar: 'bottom'
            },
            //jooj

            //{
            //    widget: 'dxSelectBox', location: 'before', options: {
            //        showClearButton: false,
            //        searchEnabled: false,

            //        //displayExpr: "Title",
            //        //valueExpr: 'Id',
            //        height: 35,
            //        width: 150,
            //        value: 'Cockpit',
            //        dataSource: ['Cockpit', 'Cabin'],
            //        onValueChanged: function (e) {
            //            $scope.IsCockpit = e.value == 'Cockpit';

            //        },

            //    }, toolbar: 'bottom'
            //},
            {
                widget: 'dxSelectBox', location: 'after', options: {
                    showClearButton: true,
                    searchEnabled: true,
                    //dataSource: $rootScope.getDatasourceGroups(),
                    //itemTemplate: function (data) {
                    //    return $rootScope.getSbTemplateGroup(data);
                    //},
                    onInitialized: function (e) {
                        if (!$scope.sb_position_instance)
                            $scope.sb_position_instance = e.component;

                    },
                    displayExpr: "Title",
                    valueExpr: 'Id',
                    height: 35,
                    width: 200,
                    onValueChanged: function (e) {
                        $scope.group_id = e.value;

                    },
                    bindingOptions: {
                        //  value: 'group_id',
                        dataSource: 'crew_position_ds'

                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    bindingOptions: { disabled: 'IsAssignDisable' },
                    type: 'success', text: 'Assign', icon: 'check', onClick: function (arg) {

                        $scope.dg_crew2_selected = $rootScope.getSelectedRow($scope.dg_crew2_instance);
                        if (!$scope.dg_crew2_selected) {
                            General.ShowNotify(Config.Text_NoRowSelected, 'error');
                            return;
                        }
                        if (!$scope.group_id) {
                            General.ShowNotify('Please select Position', 'error');
                            return;
                        }


                        // console.log('Assign');
                        // console.log($scope.selectedBox);



                        //var locationIssue = ($scope.dg_crew2_selected.CurrentLocationAirporIATA != $scope.selectedBox.FromAirportIATA);
                        //var passportIssue = ($scope.dg_crew2_selected.IsPassportExpired || !$scope.dg_crew2_selected.PassportNumber);
                        //var caoIssue = ($scope.dg_crew2_selected.IsCAOExpired || !$scope.dg_crew2_selected.CaoCardNumber);
                        //var medicalIssue = ($scope.dg_crew2_selected.IsMedicalExpired == 1);

                        //var cerIssue = false;
                        //if ($scope.IsCockpit)
                        //    cerIssue = (!$scope.dg_crew2_selected.PPLExpireStatus || $scope.dg_crew2_selected.PPLExpireStatus == 1)
                        //        ||
                        //        (!$scope.dg_crew2_selected.CPLExpireStatus || $scope.dg_crew2_selected.CPLExpireStatus == 1)
                        //        ||
                        //        (!$scope.dg_crew2_selected.ATPLExpireStatus || $scope.dg_crew2_selected.ATPLExpireStatus == 1);
                        //else
                        //    cerIssue = (!$scope.dg_crew2_selected.MCCExpireStatus || $scope.dg_crew2_selected.MCCExpireStatus == 1);
                        //var issues = [];
                        //if (cerIssue)
                        //    issues.push('Certificates');
                        //if (locationIssue)
                        //    issues.push('Location');
                        //if (passportIssue)
                        //    issues.push('Passport');
                        //if (caoIssue)
                        //    issues.push('CAO');
                        //if (medicalIssue)
                        //    issues.push('Medical');


                        //////////////   ISSUE  ////////////////////
                        ////////////////////////////////////
                        //if ($scope.dg_crew2_selected.Issues.length > 0) {
                        //    var issueStr = $scope.dg_crew2_selected.Issues.join(', ');
                        //    General.ShowNotify('Issues found: ' + issueStr, 'error');
                        //    return;
                        //}
                        //////////////   ISSUE  ////////////////////
                        ////////////////////////////////////

                        //////////////////////////////////////////////
                        console.log($scope.selectedBox);
                        flightService.getRestValidation($scope.selectedBox.BoxId, $scope.dg_crew2_selected.Id).then(function (response) {
                            if (response.nextRest && response.nextRest.length > 0) {

                                General.ShowNotify('Rest Requirement Error(Next FDP)', 'error');
                                return;
                            }
                            else if (!response.dayoff) {

                                General.ShowNotify('Rest Requirement Error(Day Off)', 'error');
                                return;
                            }
                            else {
                                var boxDate = new Date($scope.selectedBox.Date);
                                var boxDateStr = boxDate.getFullYear() + '-' + (boxDate.getMonth() + 1) + '-' + boxDate.getDate();
                                //date,pid,duty,flight
                                flightService.getOverDuty(boxDateStr, $scope.dg_crew2_selected.Id, $scope.selectedBox.Duty + ($scope.selectedCell && $scope.selectedCell.ECDuty ? $scope.selectedCell.ECDuty : 0), $scope.selectedBox.Flight).then(function (response) {
                                    // console.log('get over');
                                    //console.log(response);
                                    if (!response.status) {
                                        var msg = "Over Duty/Flight error found. First occurrence: "
                                            + (moment(new Date(response.first.CDate)).format('YYYY-MM-DD')) + '. '
                                            + 'Errors: ' + response.remark.join(',');
                                        General.ShowNotify(msg, 'error');
                                        return;
                                    }
                                    else {





                                        //oosk
                                        var dto = {
                                            Id: -1,
                                            EmployeeId: $scope.dg_crew2_selected.Id,
                                            FlightPlanId: $scope.selectedBox.FlightPlanId,
                                            CalanderId: $scope.selectedBox.CalendarId,
                                            GroupId: $scope.group_id,
                                            BoxId: $scope.selectedBox.BoxId,
                                            AvailabilityId: $scope.dg_crew2_selected.Issues.length > 0 ? -1 : 1, //$scope.dg_person_selected.AvStatusId,
                                            ECId: $scope.selectedCell.ECId ? $scope.selectedCell.ECId : -1,
                                            ECSplitedId: $scope.selectedCell.ECSplitedId ? $scope.selectedCell.ECSplitedId : -1,
                                        };
                                        var message = "Are you sure?";
                                        if ($scope.dg_crew2_selected.Issues.length > 0)
                                            message = "Errors: " + $scope.dg_crew2_selected.Issues.join(', ') + ". Are you sure?";
                                        General.Confirm(message, function (res) {
                                            if (res) {

                                                $scope.loadingVisible = true;

                                                flightService.saveFlightPlanCrew(dto).then(function (response) {
                                                    General.ShowNotify(Config.Text_SavedOk, 'success');
                                                    $scope.loadingVisible = false;
                                                    $scope.doRefresh = true;
                                                    //$scope.group_id = null;
                                                    //  $scope.getCrew($scope.selectedBox.BoxId);
                                                    $scope.bindCrew();


                                                    /////////////////////

                                                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                                            }
                                        });



                                    }

                                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });




                            }



                            /////////////////////

                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                        return;
                        //////////////////////////////////////////////////////









                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    //bindingOptions: { disabled: 'IsAssignDisable' },
                    type: 'default', text: 'Day Off', onClick: function (arg) {
                        //kool
                        if ($scope.selectedCell && $scope.selectedCell.Boxes && $scope.selectedCell.Boxes.length > 0)
                            return;

                        //jool


                        flightService.getRestDayOffCheck($scope.selected_date2, $scope.dg_crew2_selected.Id).then(function (response) {
                            if (response && response == -1) {

                                General.ShowNotify('Rest Requirement Error', 'error');
                                return;
                            }
                            var dto = {

                                EmployeeId: $scope.dg_crew2_selected.Id,
                                Date: $scope.selected_date2,
                                Status: 1166,
                            };

                            $scope.loadingVisible = true;
                            flightService.saveCrewCalendar(dto).then(function (response) {
                                $scope.loadingVisible = false;
                                $scope.bindCrew();

                            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


                        });



                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    //bindingOptions: { disabled: 'IsAssignDisable' },
                    type: 'default', text: 'Rest', onClick: function (arg) {
                        if ($scope.selectedCell && $scope.selectedCell.Boxes && $scope.selectedCell.Boxes.length > 0)
                            return;
                        var dto = {

                            EmployeeId: $scope.dg_crew2_selected.Id,
                            Date: $scope.selected_date2,
                            Status: 1165,
                        };

                        $scope.loadingVisible = true;
                        flightService.saveCrewCalendar(dto).then(function (response) {
                            $scope.loadingVisible = false;
                            $scope.bindCrew();

                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    //bindingOptions: { disabled: 'IsAssignDisable' },
                    type: 'default', text: 'STBY-A', onClick: function (arg) {
                        if ($scope.selectedCell && $scope.selectedCell.Boxes && $scope.selectedCell.Boxes.length > 0)
                            return;
                        flightService.getRestDayOffCheck($scope.selected_date2, $scope.dg_crew2_selected.Id).then(function (response) {
                            if (response && response == -1) {

                                General.ShowNotify('Rest Requirement Error', 'error');
                                return;
                            }
                            var dto = {

                                EmployeeId: $scope.dg_crew2_selected.Id,
                                Date: $scope.selected_date2,
                                Status: 1168,
                            };

                            $scope.loadingVisible = true;
                            flightService.saveCrewCalendar(dto).then(function (response) {
                                $scope.loadingVisible = false;
                                $scope.bindCrew();

                            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                        });


                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    //bindingOptions: { disabled: 'IsAssignDisable' },
                    type: 'default', text: 'STBY-P', onClick: function (arg) {
                        if ($scope.selectedCell && $scope.selectedCell.Boxes && $scope.selectedCell.Boxes.length > 0)
                            return;
                        flightService.getRestDayOffCheck($scope.selected_date2, $scope.dg_crew2_selected.Id).then(function (response) {
                            alert('x');
                            //if (response && response == -1) {

                            //    General.ShowNotify('Rest Requirement Error', 'error');
                            //    return;
                            //}
                            var dto = {

                                EmployeeId: $scope.dg_crew2_selected.Id,
                                Date: $scope.selected_date2,
                                Status: 1167,
                            };

                            $scope.loadingVisible = true;
                            flightService.saveCrewCalendar(dto).then(function (response) {
                                $scope.loadingVisible = false;
                                $scope.bindCrew();

                            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                        });



                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    //bindingOptions: { disabled: 'IsAssignDisable' },
                    type: 'default', text: 'Reserve', onClick: function (arg) {
                        if ($scope.selectedCell && $scope.selectedCell.Boxes && $scope.selectedCell.Boxes.length > 0)
                            return;
                        flightService.getRestDayOffCheck($scope.selected_date2, $scope.dg_crew2_selected.Id).then(function (response) {
                            if (response && response == -1) {

                                General.ShowNotify('Rest Requirement Error', 'error');
                                return;
                            }
                            var dto = {

                                EmployeeId: $scope.dg_crew2_selected.Id,
                                Date: $scope.selected_date2,
                                Status: 1170,
                            };

                            $scope.loadingVisible = true;
                            flightService.saveCrewCalendar(dto).then(function (response) {
                                $scope.loadingVisible = false;
                                $scope.bindCrew();

                            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                        });



                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    //bindingOptions: { disabled: 'IsAssignDisable' },
                    type: 'default', text: 'Training', onClick: function (arg) {
                        if ($scope.selectedCell && $scope.selectedCell.Boxes && $scope.selectedCell.Boxes.length > 0)
                            return;
                        flightService.getRestDayOffCheck($scope.selected_date2, $scope.dg_crew2_selected.Id).then(function (response) {
                            if (response && response == -1) {

                                General.ShowNotify('Rest Requirement Error', 'error');
                                return;
                            }
                            //var dto = {

                            //    EmployeeId: $scope.dg_crew2_selected.Id,
                            //    Date: $scope.selected_date2,
                            //    Status: 5000,
                            //};

                            //$scope.loadingVisible = true;
                            //flightService.saveCrewCalendar(dto).then(function (response) {
                            //    $scope.loadingVisible = false;
                            //    $scope.bindCrew();

                            //}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


                            var _dd = new Date(moment($scope.selected_date2, "YYYYMMDD"));

                            // console.log('office');
                            //console.log($scope.selected_date2);
                            //return;

                            $scope.FromDateEvent = (new Date(General.getDayFirstHour(_dd))).addHours(8);
                            $scope.ToDateEvent = (new Date(General.getDayFirstHour(_dd))).addHours(16);
                            $scope.event_status = 5000;
                            $scope.popup_event_visible = true;



                        });




                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    //bindingOptions: { disabled: 'IsAssignDisable' },
                    type: 'default', text: 'Office', onClick: function (arg) {
                        if ($scope.selectedCell && $scope.selectedCell.Boxes && $scope.selectedCell.Boxes.length > 0)
                            return;
                        flightService.getRestDayOffCheck($scope.selected_date2, $scope.dg_crew2_selected.Id).then(function (response) {
                            if (response && response == -1) {

                                General.ShowNotify('Rest Requirement Error', 'error');
                                return;
                            }


                            //var dto = {

                            //    EmployeeId: $scope.dg_crew2_selected.Id,
                            //    Date: $scope.selected_date2,
                            //    Status: 5001,
                            //};

                            //$scope.loadingVisible = true;
                            //flightService.saveCrewCalendar(dto).then(function (response) {
                            //    $scope.loadingVisible = false;
                            //    $scope.bindCrew();

                            //}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


                            var _dd = new Date(moment($scope.selected_date2, "YYYYMMDD"));

                            // console.log('office');
                            //console.log($scope.selected_date2);
                            //return;

                            $scope.FromDateEvent = (new Date(General.getDayFirstHour(_dd))).addHours(8);
                            $scope.ToDateEvent = (new Date(General.getDayFirstHour(_dd))).addHours(16);
                            $scope.event_status = 5001;
                            $scope.popup_event_visible = true;


                        });



                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    //bindingOptions: { disabled: 'IsAssignDisable' },
                    type: 'default', text: 'Clear', onClick: function (arg) {
                        var dto = {

                            EmployeeId: $scope.dg_crew2_selected.Id,
                            Date: $scope.selected_date2,
                            Status: -1,
                        };

                        $scope.loadingVisible = true;
                        flightService.saveCrewCalendar(dto).then(function (response) {
                            $scope.loadingVisible = false;
                            $scope.bindCrew();

                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


                    }
                }, toolbar: 'bottom'
            },
            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_crew2_visible = false; } }, toolbar: 'bottom' },
            // { widget: 'dxButton', location: 'before', options: { type: 'default', text: 'Calendar', }, toolbar: 'bottom' },
            // { widget: 'dxButton', location: 'before', options: { type: 'default', text: 'Flights', }, toolbar: 'bottom' },
            // { widget: 'dxButton', location: 'before', options: { type: 'default', text: 'Certificates', }, toolbar: 'bottom' },

        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {
            //if ($scope.plan.IsApproved70==1)
            //    $scope.dg_reg_height = 380;
            //else
            //    $scope.dg_reg_height = 330;

            //$scope.dg_crew2_columns = [];
            //  $scope.dg_crew2_columns.push({ dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 250, fixed: true, fixedPosition: 'left' });

            //{ dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 250, fixed: true, fixedPosition: 'left' }
            var columns = $scope.dg_crew2_instance.option("columns");
            columns = [
                {
                    //dool
                    dataField: "Name", caption: '',
                    width: 210,
                    allowFiltering: false,
                    allowSorting: false,
                    alignment: 'center',
                    fixed: true, fixedPosition: 'left',
                    cellTemplate: function (container, options) {

                        var gc = "#00cc99";
                        var rc = "#cc0000";
                        //soosk
                        if (!options.data.ImageUrl)
                            options.data.ImageUrl = 'imguser.png';
                        //var element = "<div style='width:20%;display:inline-block;float:left;'><img style='height:57px;max-width:50px;border-radius:100%;' src='" + $rootScope.clientsFilesUrl+options.data.ImageUrl+"' /></div>"
                        var element = "<div style='text-align:left;width:100%;display:inline-block'>"
                            + "<div  >" + "<span style='display:inline-block;font-weight:bold;margin-right:5px;font-size:13px;'>(" + options.data.JobGroup + ")</span>" + "<span style='display:inline-block;font-weight:bold;font-size:13px'>" + options.data.ScheduleName + "</span>" + "<span style='display:inline-block;font-weight:normal;margin-left:5px;font-size:13px'>(" + options.data.Code + ")</span>" + "</div>"
                            ;
                        //FromAirportIATA
                        if (options.data.CurrentLocationAirporIATA != $scope.selectedBox.FromAirportIATA)
                            element += "<div  class='grid-cell-certificate' style='position:relative; white-space:normal;text-align:center;background:white;color:" + (options.data.CurrentLocationAirporIATA == $scope.selectedBox.FromAirportIATA ? gc : rc) + ";border:1px solid " + (options.data.CurrentLocationAirporIATA == $scope.selectedBox.FromAirportIATA ? gc : rc) + "'>" + options.data.CurrentLocationAirporIATA + "</div>";

                        // if (options.data.IsCAOExpired || !options.data.CaoCardNumber)
                        //    element += "<div class='grid-cell-certificate' style='background:" + (options.data.IsCAOExpired || !options.data.CaoCardNumber ? rc : gc) + "'>" + "CAO" + "</div>";
                        //gooz
                        //data,field,caption,cabin
                        element += $scope.buildAlertBox(options.data, "IsMedicalExpired", "MEDICAL", null);
                        element += $scope.buildAlertBox(options.data, "IsCMCExpired", "CMC", null);
                        element += $scope.buildAlertBox(options.data, "IsSEPTExpired", "SEPT", null);
                        element += $scope.buildAlertBox(options.data, "IsSEPTPExpired", "SEPTP", null);
                        element += $scope.buildAlertBox(options.data, "IsDGExpired", "DG", null);
                        // element += $scope.buildAlertBox(options.data, "IsCRMExpired", "CRM", null);
                        element += $scope.buildAlertBox(options.data, "IsCCRMExpired", "CCRM", null);
                        element += $scope.buildAlertBox(options.data, "IsSMSExpired", "SMS", null);
                        element += $scope.buildAlertBox(options.data, "IsAvSecExpired", "AVSEC", null);
                        //IsLPRExpired
                        element += $scope.buildAlertBox(options.data, "IsProficiencyExpired", "SKILL", "cockpit");
                        element += $scope.buildAlertBox(options.data, "IsLPRExpired", "LPR", "cockpit");
                        element += $scope.buildAlertBox(options.data, "IsFirstAidExpired", "FIRST AID", "cabin");

                        //element += "<div style='position:relative;margin-top:5px;white-space:normal'>";
                        //if (options.data.IsPassportExpired || !options.data.PassportNumber)
                        //    element += "<div class='grid-cell-certificate' style='background:" + (options.data.IsPassportExpired || !options.data.PassportNumber ? rc : gc) + "'>" + "Passport" + "</div>";

                        //if (options.data.IsCAOExpired || !options.data.CaoCardNumber)
                        //    element += "<div class='grid-cell-certificate' style='background:" + (options.data.IsCAOExpired || !options.data.CaoCardNumber ? rc : gc) + "'>" + "CAO" + "</div>";

                        //if (options.data.IsMedicalExpired == 1)
                        //    element += "<div class='grid-cell-certificate' style='background:" + (options.data.IsMedicalExpired == 1 ? rc : gc) + "'>" + "Medical" + "</div>";
                        //if ($scope.IsCockpit) {
                        //    if (!options.data.PPLExpireStatus || options.data.PPLExpireStatus == 1)
                        //        element += "<div class='grid-cell-certificate' style='background:" + (!options.data.PPLExpireStatus || options.data.PPLExpireStatus == 1 ? rc : gc) + "'>" + "PPL" + "</div>";
                        //    if (!options.data.CPLExpireStatus || options.data.CPLExpireStatus == 1)
                        //        element += "<div class='grid-cell-certificate' style='background:" + (!options.data.CPLExpireStatus || options.data.CPLExpireStatus == 1 ? rc : gc) + "'>" + "CPL" + "</div>";
                        //    if (!options.data.ATPLExpireStatus || options.data.ATPLExpireStatus == 1)
                        //        element += "<div class='grid-cell-certificate' style='background:" + (!options.data.ATPLExpireStatus || options.data.ATPLExpireStatus == 1 ? rc : gc) + "'>" + "ATPL" + "</div>";
                        //}
                        //else {
                        //    if (!options.data.MCCExpireStatus || options.data.MCCExpireStatus == 1)
                        //        element += "<div class='grid-cell-certificate' style='background:" + (!options.data.MCCExpireStatus || options.data.MCCExpireStatus == 1 ? rc : gc) + "'>" + "MCC" + "</div>";
                        //}
                        //element += "</div>";



                        element += "<div style='clear:both'></div></div>";

                        $("<div style='white-space:normal'>")
                            .append(element)
                            .appendTo(container);



                    },

                },
            ];
            //columns.push();
            var sbdate = moment($scope.selectedBox.Date).format("YYYYMMDD");
            var bd = (new Date($scope.CurrentDate)).setHours(0, 0, 0, 0);
            var ed = (new Date($scope.ToDate)).setHours(0, 0, 0, 0);
            while (bd <= ed) {
                var datafield = moment(bd).format("YYYYMMDD");
                var column = { dataField: datafield, caption: moment(bd).format("MMM Do YYYY"), allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 172, };
                column.cellTemplate = function (container, options) {
                    var assignLink = "";
                    if (sbdate == options.column.dataField) {

                        assignLink = "<a class='link-button green assigncrew' data-eid='" + options.data.Id + "' >Assign</a>";
                    }
                    var restremark = "";
                    if (sbdate == options.column.dataField && options.data.RestRemark && (!options.value.CalendarStatusId || options.value.CalendarStatusId == 1167 || options.value.CalendarStatusId == 1168)) {
                        restremark = "<div style='font-weight:bold;color:red;font-size:12px'>" + options.data.RestRemark + "</div>";
                    }

                    var overduty = "";
                    if (sbdate == options.column.dataField && options.data.OverDuty == 1) {
                        overduty = "<div style='font-weight:bold;color:red;font-size:12px'>" + "Over Duty/Flight" + "</div>";
                    }

                    var calendarStatus = "";
                    if (options.value.CalendarStatusId) {
                        calendarStatus = "<div style='font-weight:normal;color:black;font-size:12px'>" + options.value.CalendarStatus + "</div>";

                    }
                    var flights = "";
                    var value = options.value;

                    if (value.Boxes) {

                        $.each(value.Boxes, function (_i, _d) {
                            var items = "";
                            $.each(_d.Items, function (_j, _f) {
                                items += "<div class='cell-flight' style='height:initial;width:29px;padding:0 3px 0 3px;margin-right:3px;'>"
                                    //+ "<div class='route'>" + _f.FromAirportIATA + " - " + _f.ToAirportIATA + "</div>"

                                    // + "<div class='time'>" + moment(_f.STD).format("HH:mm") + "-" + moment(_f.STA).format("HH:mm")+"</div>"
                                    + "<div class='route'>" + _f.FlightNumber + "</div>"
                                    + "</div>";
                            });
                            flights += "<div style='margin-bottom:5px;width:100%;text-align:left'>" + items + "</div>";
                            //console.log(_d);
                        });
                    }

                    //var status ="<div>"+ options.value.Status+"</div>";

                    var element = "<div>"
                        //  + "<div>" + options.data.Name + "</div>"
                        //  + "<div>" + options.data.PID + "</div>"
                        // + overduty
                        + restremark
                        + calendarStatus
                        + flights
                        // + assignLink
                        + "</div>";

                    $("<div>")
                        .append(element)
                        .appendTo(container);



                };
                columns.push(column);
                bd = (new Date(bd)).addDays(1).setHours(0, 0, 0, 0);
            };



            $scope.dg_crew2_instance.option("columns", columns);
            $scope.dg_crew2_instance.repaint();


        },
        onShown: function (e) {
            $('.dx-toolbar-items-container').addClass('dx-border');
            var _ds = [];
            $.each($scope.selectedBox.BoxItems, function (_i, _d) {
                var _item = JSON.parse(JSON.stringify(_d));
                _item.Duration = pad(_d.FlightH) + ':' + pad(_d.FlightM);
                _item.Route = _item.FromAirportIATA + '-' + _item.ToAirportIATA;
                var _std = new Date(_item.STD);
                var _sta = new Date(_item.STA);
                _item.STS = pad(_std.getHours()) + ':' + pad(_std.getMinutes()) + ' - ' + pad(_sta.getHours()) + ':' + pad(_sta.getMinutes());

                _ds.push(_item);
            });
            $scope.dg_items_ds = _ds; //$scope.selectedBox.BoxItems;
            //  console.log(_ds);
            $scope.BoxTimeStr = "Flight: " + GetTimeStr($scope.selectedBox.Flight) + " (h)       Duty: " + GetTimeStr($scope.selectedBox.Duty) + " (h)   Max:" + GetTimeStr($scope.selectedBox.MaxFDPExtended) + "(h)";
            //$scope.dg_person_instance.repaint();
            $scope.bindCrew();
            //console.log($scope.selectedBox);
        },
        onHiding: function () {

            // $scope.crew_position_ds = [];
            $scope.getCrew($scope.selectedBox.BoxId);
            //$scope.group_id = null;

            //$scope.doRefreshPeople = true;
            //$scope.dg_person_ds = null;
            //$scope.getCrew($scope.dg_selected.Id, $scope.dg_selected.CalendarId);
            //if ($scope.doRefresh)
            //    $scope.bind();
            $scope.popup_crew2_visible = false;

        },
        bindingOptions: {
            visible: 'popup_crew2_visible',
            //width: 'pop_width',
            //height: 'pop_height',
            title: 'FlightsTitle',

        }
    };



    /////////gantt//////////////////////////////
    Flight.cindex = 0;
    $scope.taskIndex = 1000000;
    Flight.activeDatasource = [];
    $scope.scroll = 0;
    /////////////////////////////
    $scope.crewDataSource = [];
    $scope.getFilteredCrew = function () {
        var result = Enumerable.From($scope.crewDataSource).ToArray();
        if ($scope.filter_name) {
            var fn = $scope.filter_name.toLowerCase();
            result = Enumerable.From(result).Where('$.Name.toLowerCase().includes("' + fn + '") || $.PID=="' + $scope.filter_name + '"').ToArray();
        }
        //OrderBy

        result = Enumerable.From(result).OrderBy('$.AvStatus2').ThenBy('$.JobGroupCode').ThenBy('$._F1').ThenBy('$._F7').ThenBy('$._F14').ThenBy('$._F28').ThenBy('$._FY').ToArray();
        return result;
    };
    $scope.setAvStatus = function (data) {
        //dool2

        //var cnd = (data.CurrentLocationAirporIATA == $scope.selectedBox.FromAirportIATA)
        //    && !(data.IsPassportExpired || !data.PassportNumber)

        //    && !(data.IsCAOExpired || !data.CaoCardNumber)
        //    && !(data.IsMedicalExpired == 1);
        //if ($scope.IsCockpit) {
        //    cnd = cnd && !(!data.PPLExpireStatus || data.PPLExpireStatus == 1)
        //        && !(!data.CPLExpireStatus || data.CPLExpireStatus == 1)
        //        && !(!data.ATPLExpireStatus || data.ATPLExpireStatus == 1);
        //}
        //else         
        //    cnd=cnd && !(!data.MCCExpireStatus || data.MCCExpireStatus == 1); 
        //if (cnd)
        //    data.AvStatus2 = 0;
        //else
        //    data.AvStatus2 = 1;
        data.Issues = [];
        if (data.CurrentLocationAirporIATA != $scope.selectedBox.FromAirportIATA)
            data.Issues.push("Location");
        if (data.IsSEPTExpired == 1)
            data.Issues.push("SEPT");
        if (data.IsSEPTPExpired == 1)
            data.Issues.push("SEPTP");
        if (data.IsCCRMExpired == 1)
            data.Issues.push("CCRM");
        //if (data.IsCRMExpired == 1)
        //    data.Issues.push("CRM");
        if (data.IsDGExpired == 1)
            data.Issues.push("DG");
        if (data.IsAvSecExpired == 1)
            data.Issues.push("AVSEC");
        if (data.IsSMSExpired == 1)
            data.Issues.push("SMS");
        if (data.IsCMCExpired == 1)
            data.Issues.push("CMC");
        if (data.IsMedicalExpired == 1)
            data.Issues.push("MEDICAL");

        if (data.JobGroupCode.startsWith('00101')) {
            //cockpit

            if (data.IsProficiencyExpired == 1)
                data.Issues.push("SKILL");
            if (data.IsLPRExpired == 1)
                data.Issues.push("LPR");
        }
        if (data.JobGroupCode.startsWith('00102')) {
            //cabin 

            if (data.IsFirstAidExpired == 1)
                data.Issues.push("FIRSTAID");
        }



        var cnd = (data.CurrentLocationAirporIATA == $scope.selectedBox.FromAirportIATA)
            && data.IsSEPTExpired == 0
            && data.IsSEPTPExpired == 0
            && data.IsCCRMExpired == 0
            && data.IsCRMExpired == 0
            && data.IsDGExpired == 0
            && data.IsAvSecExpired == 0
            && data.IsSMSExpired == 0
            && data.IsCMCExpired == 0
            && data.IsMedicalExpired == 0;





        if (data.JobGroupCode.startsWith('00101')) {
            //cockpit
            cnd = cnd && data.IsProficiencyExpired == 0
                && data.IsLPRExpired == 0;

        }
        if (data.JobGroupCode.startsWith('00102')) {
            //cabin 
            cnd = cnd && data.IsFirstAidExpired == 0;
        }

        if (cnd)
            data.AvStatus2 = 0;
        else
            data.AvStatus2 = 1;
    };
    //dool
    $scope.bindCrew = function () {
        var dto = {
            cid: Config.CustomerId,
            type: $scope.selectedBox.TypeId,
            boxid: $scope.selectedBox.BoxId,
            DateFrom: (new Date($scope.CurrentDate)).toUTCString(),
            DateTo: (new Date($scope.ToDate)).toUTCString(),
            cockpit: $scope.IsCockpit,
        };
        $scope.loadingVisible = true;
        flightService.getCrew(dto).then(function (response) {

            $scope.loadingVisible = false;

            var offset = -1 * (new Date()).getTimezoneOffset();
            $.each(response.reqrests, function (_j, _r) {
                //(new Date($scope.flight.ChocksOut)).addMinutes(offset);
                _r.RestFrom = (new Date(_r.RestFrom)).addMinutes(offset);
                _r.RestUntil = (new Date(_r.RestUntil)).addMinutes(offset);
            });

            var sbdate = moment($scope.selectedBox.Date).format("YYYYMMDD");
            $.each(response.crew, function (_i, _d) {
                $scope.setAvStatus(_d);
                var reqrest = Enumerable.From(response.reqrests).Where('$.EmployeeId==' + _d.Id).FirstOrDefault();
                if (reqrest) {
                    _d.RestFrom = reqrest.RestFrom;
                    _d.RestUntil = reqrest.RestUntil;
                    _d.RestRemark = "Rest Until " + moment(new Date(reqrest.RestUntil)).format("MMM-DD h:mm a");
                    _d.RestIssue = 1;
                    console.log(_d.RestRemark);
                }
                else {
                    _d.RestFrom = null;
                    _d.RestUntil = null;
                    _d.RestRemark = null;
                    _d.RestIssue = 0;
                }
                var sbdate = moment($scope.selectedBox.Date).format("YYYYMMDD");
                var bd = (new Date($scope.CurrentDate)).setHours(0, 0, 0, 0);
                var ed = (new Date($scope.ToDate)).setHours(0, 0, 0, 0);
                _d.OverDuty = 0;
                while (bd <= ed) {
                    var datafield = moment(bd).format("YYYYMMDD");

                    _d[datafield] = { DateStr: moment(bd).format("MMM Do YYYY") };
                    var _boxes = Enumerable.From(response.calendar).Where('$.DateStr=="' + datafield + '" && $.EmployeeId==' + _d.Id).FirstOrDefault();
                    //console.log('df boxes');
                    //console.log(_boxes);
                    //console.log('-----------------');
                    //boosk
                    if (_boxes)
                        _d[datafield].Boxes = _boxes.Boxed;

                    var times = Enumerable.From(response.times).Where('$.Id==' + _d.Id + ' && $.DateStr=="' + datafield + '"').FirstOrDefault();
                    var timesds = [];
                    timesds.push({ Id: 1, Title: 'Day', DM: times.Day1_Duty, FM: times.Day1_Flight, Duty: GetTimeStr(times.Day1_Duty), Flight: GetTimeStr(times.Day1_Flight), DutyViolated: Flight.IsDutyViolated(1, times.Day1_Duty, $scope.selectedBox.MaxFDPExtended), FlightViolated: Flight.IsFlightViolated(1, times.Day1_Flight) });

                    timesds.push({ Id: 7, Title: '7D', DM: times.Day7_Duty, FM: times.Day7_Flight, Duty: GetTimeStr(times.Day7_Duty), Flight: GetTimeStr(times.Day7_Flight), DutyViolated: Flight.IsDutyViolated(7, times.Day7_Duty), FlightViolated: Flight.IsFlightViolated(7, times.Day7_Flight) });
                    timesds.push({ Id: 14, Title: '14D', DM: times.Day14_Duty, FM: times.Day14_Flight, Duty: GetTimeStr(times.Day14_Duty), Flight: GetTimeStr(times.Day14_Flight), DutyViolated: Flight.IsDutyViolated(14, times.Day14_Duty), FlightViolated: Flight.IsFlightViolated(14, times.Day14_Flight) });
                    timesds.push({ Id: 28, Title: '28D', DM: times.Day28_Duty, FM: times.Day28_Flight, Duty: GetTimeStr(times.Day28_Duty), Flight: GetTimeStr(times.Day28_Flight), DutyViolated: Flight.IsDutyViolated(28, times.Day28_Duty), FlightViolated: Flight.IsFlightViolated(28, times.Day28_Flight) });
                    timesds.push({ Id: 12, Title: 'Year', DM: times.Year_Duty, FM: times.Year_Flight, Duty: GetTimeStr(times.Year_Duty), Flight: GetTimeStr(times.Year_Flight), DutyViolated: Flight.IsDutyViolated(12, times.Year_Duty), FlightViolated: Flight.IsFlightViolated(12, times.Year_Flight) });

                    $.each(timesds, function (_h, _t) {
                        if (datafield == sbdate) {

                            var _bb = Enumerable.From(_d[datafield].Boxes).Where('$.BoxId==' + $scope.selectedBox.BoxId).FirstOrDefault();
                            if (!_bb) {
                                _t.NFM = _t.FM + $scope.selectedBox.Flight;
                                _t.NDM = _t.DM + $scope.selectedBox.Duty + (times.CalendarStatusId ? times.ECDuty : 0);
                                _t.NewFlight = GetTimeStr(_t.NFM);
                                _t.NewDuty = GetTimeStr(_t.NDM);
                                _t.NewDutyViolated = Flight.IsDutyViolated(_t.Id, _t.NDM, $scope.selectedBox.MaxFDPExtended, times.FDPReduction);
                                _t.NewFlightViolated = Flight.IsFlightViolated(_t.Id, _t.NFM);
                                if (_t.NewFlightViolated || _t.NewDutyViolated || _t.FlightViolated || _t.DutyViolated) {
                                    _d.OverDuty = 1;


                                }
                            }


                        }



                        //sook
                    });

                    _d[datafield].Times = timesds;
                    _d[datafield].ECDuty = times.CalendarStatusId ? times.ECDuty : 0;
                    _d[datafield].FDPReduction = times.FDPReduction;
                    _d[datafield].CalendarStatus = times.CalendarStatus;
                    _d[datafield].CalendarStatusId = times.CalendarStatusId;
                    _d[datafield].ECSplitedId = times.ECSplitedId;
                    _d[datafield].ECId = times.ECId;
                    if (datafield == sbdate) {
                        _d._F1 = times.Day1_Flight;
                        _d._F7 = times.Day7_Flight;
                        _d._F14 = times.Day14_Flight;
                        _d._F28 = times.Day28_Flight;
                        _d._FY = times.Year_Flight;
                    }

                    bd = (new Date(bd)).addDays(1).setHours(0, 0, 0, 0);
                };
            });
            $scope.crewDataSource = response.crew;

            $scope.dg_crew2_ds = $scope.getFilteredCrew();
            //  console.log($scope.dg_crew2_ds);



        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.doRefreshPeople = true;
    $scope.bindPeople = function () {

        // [Route("odata/crew/available/{cid}/{type}/{day}")]
        var dt = (new Date()).toDateTimeDigits();
        var url = 'odata/crew/available/' + Config.CustomerId + '/' + $scope.selectedBox.TypeId + '/' + $scope.selectedBox.BoxId;
        //if ($scope.doRefreshPeople)
        {

            $scope.dg_person_ds = {
                store: {
                    type: "odata",
                    url: $rootScope.serviceUrl + url,
                    //key: "Id",
                    version: 4,
                    onLoaded: function (e) {

                        $.each(e, function (_i, _d) {
                            _d.IsLocation = _d.CurrentLocationAirporIATA == $scope.SourceLocation;
                        });
                        //$rootScope.$broadcast('OnDataLoaded', null);
                    },
                    beforeSend: function (e) {

                        // e.params.$filter = (e.params.$filter ? e.params.$filter + ' and ' : '')
                        //+ "(Date ge " + (new Date($scope.dt_from)).ToUTC2(1) + ") and (Date le " + (new Date($scope.dt_to)).ToUTC2() + ")";
                        // console.log(e.params);
                        //$scope.dsUrl = General.getDsUrl(e);

                        // $scope.$apply(function () {
                        //    $scope.loadingVisible = true;
                        // });
                        $rootScope.$broadcast('OnDataLoading', null);
                    },
                },
                // filter: [['Date', '=', new Date()]],
                sort: [{ getter: "JobGroup", desc: false }, { getter: "Name", desc: false }],

            };
        }

        //if ($scope.doRefreshPeople)
        {
            //$scope.filters = $scope.getFilters();
            // $scope.dg_ds.filter = [];
            //  $scope.dg_ds.filter = $scope.filters;
            // console.log('Filters');
            // console.log($scope.dg_ds.filter);
            $scope.dg_person_instance.refresh();
            $scope.doRefreshPeople = false;
        }

    };
    ////////////////////////////
    $scope.bind = function () {
        var url = 'odata/flightplans/customer/' + Config.CustomerId;
        if (!$scope.dg_ds && $scope.doRefresh) {

            $scope.dg_ds = {
                store: {
                    type: "odata",
                    url: $rootScope.serviceUrl + url,
                    key: "Id",
                    version: 4,
                    onLoaded: function (e) {
                        // $scope.loadingVisible = false;
                        //filter
                        $rootScope.$broadcast('OnDataLoaded', null);
                    },
                    beforeSend: function (e) {

                        $scope.dsUrl = General.getDsUrl(e);

                        // $scope.$apply(function () {
                        //    $scope.loadingVisible = true;
                        // });
                        $rootScope.$broadcast('OnDataLoading', null);
                    },
                },
                // filter: [['OfficeCode', 'startswith', $scope.ParentLocation.FullCode]],
                sort: [{ getter: "Id", desc: false }],

            };
        }

        if ($scope.doRefresh) {
            $scope.filters = $scope.getFilters();
            $scope.dg_ds.filter = $scope.filters;
            $scope.dg_instance.refresh();
            $scope.doRefresh = false;
        }

    };

    $scope.doRefresh = false;
    $scope.filters = [];
    $scope.getFilters = function () {
        var filters = $scope.filters;
        if (filters.length == 0)
            filters = [['Id', '>', 0]];
        else {
            //filters.push('and');
            //filters.push(['OfficeCode', 'startswith', $scope.ParentLocation.FullCode]);

        }


        return filters;
    };

    $scope.selectedFlights = [];
    $scope.clearSelectedFlights = function () {
        $scope.selectedFlights = [];
        $scope.hideButtons();
    };
    $scope.doGridSelectedChanged = true;
    $scope.addSelectedFlight = function (item) {
        //var exist = Enumerable.From($scope.selectedFlights).Where("$.taskId==" + item.taskId).FirstOrDefault();
        //if (exist)
        //    $scope.selectedFlights = Enumerable.From($scope.selectedFlights).Where("$.taskId!=" + item.taskId).ToArray();
        //else
        //    $scope.selectedFlights.push(item);
        $scope.removeUpdatedFlights(item);
        $scope.hideButtons();
        var exist = Enumerable.From($scope.selectedFlights).Where("$.taskId==" + item.taskId).FirstOrDefault();
        if (!exist) {
            $scope.selectedFlights = [];
            $scope.selectedFlights.push(item);
            $scope.flight = item;

            $scope.showButtons(item);
            if ($scope.popup_inf_visible)
                $scope.setWeather();

            $scope.doGridSelectedChanged = false;
            $scope.dg_flights_instance.selectRows([item], false);

        }
        else {
            $scope.selectedFlights = [];

            $scope.$apply(function () {
                $scope.popup_inf_visible = false;
            });
        }


    };
    $scope.addSelectedFlight2 = function (item) {
        $scope.removeUpdatedFlights(item);

        $scope.hideButtons2();
        var exist = Enumerable.From($scope.selectedFlights).Where("$.taskId==" + item.taskId).FirstOrDefault();
        if (!exist) {
            $scope.selectedFlights = [];
            $scope.selectedFlights.push(item);
            $scope.flight = item;

            $scope.showButtons2(item);
            if ($scope.popup_inf_visible)
                $scope.setWeather();

        }
        else {
            $scope.selectedFlights = [];


            $scope.popup_inf_visible = false;

        }


    };
    $scope.selectedResource = null;
    $scope.setSelectedResource = function (data) {
        var index = data.index;
        if ($scope.selectedResource && $scope.setSelectedResource.index == index) {
            $scope.selectedResource = null;
            $("#resourceGanttba").data("ejGantt").clearSelection(index);
            alert('x');
        }
        else

            $scope.selectedResource = { index: data.index, item: data.item };
    };
    $scope.ganttCreated = false;
    $scope.createGantt = function () {
        var _scale = $(window).width() * 0.24;
        var ganttObj = $("#resourceGanttba").data("ejGantt");
        if (ganttObj)
            ganttObj.destroy();
        var h = $(window).height() - 139 - 255 - 50;
        h = h + 'px';
        $("#resourceGanttba").ejGantt({
            selectionMode: ej.Gantt.SelectionMode.Cell,
            selectionType: ej.Gantt.SelectionType.Multiple,
            taskbarClick: function (args) {
                //$scope.addSelectedFlight(args.data.item);
                // $("#resourceGanttba").data("ejGantt").clearSelection();
            },
            dataSource: $scope.dataSource, //self.datasource, //resourceGanttData,
            allowColumnResize: true,
            isResponsive: true,
            taskIdMapping: "taskId",
            taskNameMapping: "taskName",
            fromLocationMapping: "from",
            startDateMapping: "startDate",
            endDateMapping: "endDate",
            progressMapping: "progress",
            durationMapping: "duration",
            groupNameMapping: "Title",
            groupIdMapping: "groupId",
            groupCollection: $scope.resourceGroups,
            resources: $scope.resources, //resourceGanttResources,
            resourceIdMapping: "resourceId",
            resourceNameMapping: "resourceName",
            resourceInfoMapping: "resourceId",
            notesMapping: "notes",

            rightTaskLabelMapping: "taskName",

            baselineStartDateMapping: "BaselineStartDate",
            baselineEndDateMapping: "BaselineEndDate",

            highlightWeekEnds: true,
            includeWeekend: false,
            rowHeight: 60, //window.theme == "material" ? 48 : window.theme == "office-365" ? 36 : 40,
            taskbarHeight: 40,
            scheduleStartDate: $scope.datefrom,
            scheduleEndDate: $scope.dateto,
            predecessorMapping: "predecessor",
            allowGanttChartEditing: false,
            allowDragAndDrop: true,
            editSettings: {
                allowEditing: true,
                allowAdding: true,
                allowDeleting: true,

                editMode: "normal",
            },
            splitterSettings: {
                position: 110,
            },
            toolbarSettings: {
                showToolbar: false,
                toolbarItems: [ej.Gantt.ToolbarItems.Add,
                ej.Gantt.ToolbarItems.Delete,
                ej.Gantt.ToolbarItems.Update,
                ej.Gantt.ToolbarItems.Cancel,
                ej.Gantt.ToolbarItems.ExpandAll,
                ej.Gantt.ToolbarItems.CollapseAll,
                ej.Gantt.ToolbarItems.NextTimeSpan,
                ej.Gantt.ToolbarItems.PrevTimeSpan
                ]
            },
            enableContextMenu: false,
            load: function () {
                console.log('load');
                $scope.ganttCreated = true;
                this.getColumns()[0].width = 110;
                //  console.log('load1');
                var customColumn = {
                    field: "isOverallocated",
                    mappingName: "isOverallocated",
                    allowEditing: false,
                    headerText: "Is Overallocated",
                    isTemplateColumn: true,
                    template: "{{if eResourceTaskType=='resourceTask'}} <span style='padding:10px;'> {{if eOverlapped}} Yes {{else}} No {{/if}} </span> {{/if}}"
                };
                //this.getColumns().push(customColumn);

                var columnFrom = { field: "from", mappingName: "from", headerText: "From" };
                //this.getColumns().push(columnFrom);

                var columnbaseDuration = { field: "baseDuration", mappingName: "baseDuration", headerText: "baseDuration" };
                //this.getColumns().push(columnbaseDuration);


            },
            create: function (args) {


                $('.e-ganttviewerbodyContianer').data("ejScroller").scrollX($scope.scroll); //.scrollLeft(1000)  ;

            },

            cellSelecting: function (args) {
                if (!args)
                    return;

                if (args.data.eResourceTaskType != "resourceTask")
                    args.cancel = true;
            },
            cellSelected: function (args) {
                $('.e-gantt-taskbarSelection').removeClass('e-gantt-taskbarSelection');

                
                $scope.setSelectedResource(args.data);
            },
            //  cellSelected: function (args) { console.log(args); },
            actionBegin: function (args) {

                if (args.requestType && args.requestType == 'beginedit') {

                    args.cancel = true;

                    //  $scope.InitUpdate();
                }


            },
            actionComplete: function (args) {


                if (args.requestType == 'save') {
                    if ($scope.doActionCompleteSave)
                        setTimeout(function () {
                            var ganttObj = $("#resourceGanttba").data("ejGantt");
                            ganttObj._$ganttchartHelper.ejGanttChart("selectTaskbar", args.modifiedRecord);
                        }, 100);
                    else {

                        $scope.doActionCompleteSave = true;

                    }


                }

                //console.log(args);
                //renderTasks();
                // renderLables();
                // renderLables();
            },

            workingTimeScale: "TimeScale24Hours",
            durationUnit: ej.Gantt.DurationUnit.Hour,
            scheduleHeaderSettings: {
                scheduleHeaderType: ej.Gantt.ScheduleHeaderType.Day,
                dayHeaderFormat: "MMM MM ddd dd , yyyy",
                //dayHeaderFormat: "DAY dd",
                minutesPerInterval: ej.Gantt.minutesPerInterval.ThirtyMinutes,
                // timescaleUnitSize: "400%"
                timescaleUnitSize: _scale + "%",
            },

            taskbarTemplate: "#taskbarTemplateBox",
            leftTaskLabelTemplate: "#leftlableTemplate",
            viewType: ej.Gantt.ViewType.ResourceView,
            sizeSettings: { height: h },
            groupSettings: {
            },
            showStackedHeader: false,
            taskSchedulingMode: ej.Gantt.TaskSchedulingMode.Manual,
            enableTaskbarTooltip: false,
            //  stripLines: [{ day:  "6/5/2019  03:00:00 AM" , lineWidth: "2", lineColor: "Darkblue", lineStyle: "dotted" }]
        });
    };


    $scope.flight_click = function (tid) {
        alert(tid);
    };
    $scope.bindFlights = function (saveState) {
        var filter = {
            Status: $scope.filterStatus,
            Types: $scope.filterType,
            Registers: $scope.filterAircraft,
            From: $scope.filterFrom,
            To: $scope.filterTo
        };
        $scope.hideButtons2();
        $scope.selectedFlights = [];
        $scope.dg_flights_instance.deselectAll();
        var offset = -1 * (new Date()).getTimezoneOffset();
        $scope.loadingVisible = true;
        flightService.getFlightsGantt(Config.CustomerId, (new Date($scope.datefrom)).toUTCDateTimeDigits(), (new Date($scope.dateto)).toUTCDateTimeDigits(), offset, ($scope.IsAdmin ? null : $scope.airportEntity.Id), filter).then(function (response) {

            $scope.loadingVisible = false;
            $scope.baseDate = (new Date(Date.now())).toUTCString();
            $scope.ganttData = response;

            $scope.resourceGroups = response.resourceGroups;
            $scope.resources = response.resources;
            $scope.dataSource = Flight.proccessDataSource2(response.flights);
            Flight.activeDatasource = $scope.dataSource;
            $scope.dg_flights_ds = $scope.dataSource;
            console.log(Flight.activeDatasource);
            $scope.calculateSummary();

            $scope.createGantt();
            //  if ($scope.dataSource.length > 0)
            //    $scope.scrollGantt($scope.dataSource[0]);
            $scope.scrollGanttNow();
            $scope.footerfilter = true;
            $scope.searched = true;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


    };
    $scope.rebind = function () {
        var offset = -1 * (new Date()).getTimezoneOffset();
        $scope.plansDto = {
            CustomerId: 1,
            Date: $scope.CurrentDate.ToUTC(),
            DateTo: $scope.ToDate.ToUTC(),
            Offset: offset,
            Design: false,
            PlanId: -1,
        };

        $scope.loadingVisible = true;
        flightService.getPlanItemsGanttCrewTest($scope.plansDto).then(function (response) {
            $scope.loadingVisible = false;

            $scope.baseDate = (new Date(Date.now())).toUTCString();
            $scope.ganttData = response;

            $scope.resourceGroups = response.resourceGroups;
            $scope.resources = response.resources;
            $scope.dataSource = Flight.proccessDataSource2(response.flights);
            Flight.activeDatasource = $scope.dataSource;

            // ganttObj.reRenderChart();

            var ganttObj = $("#resourceGanttba").data("ejGantt");

            ganttObj._refreshDataSource($scope.dataSource);

            $scope.selectedBox = null;
            $scope.selectedBoxId = null;
            $scope.selectedIds = [];
            $scope.selectedItems = [];

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        ////////////////////
    };
    $scope.CalanderId = -1;
    $scope.bindtest = function () {
        var offset = -1 * (new Date()).getTimezoneOffset();
        $scope.plansDto = {
            CustomerId: 1,
            Date: $scope.CurrentDate.ToUTC(),
            DateTo: $scope.ToDate.ToUTC(),
            Offset: offset,
            Design: false,
            PlanId: -1,
        };

        $scope.loadingVisible = true;
        flightService.getPlanItemsGanttCrewTest($scope.plansDto).then(function (response) {
            $scope.loadingVisible = false;
            $scope.popup_search_visible = false;
            //took
            $scope.baseDate = (new Date(Date.now())).toUTCString();
            $scope.ganttData = response;
            if (response.flights.length > 0)
                $scope.CalanderId = response.flights[0].CalendarId;

            $scope.resourceGroups = response.resourceGroups;
            $scope.resources = response.resources;
            $scope.dataSource = Flight.proccessDataSource2(response.flights);
            Flight.activeDatasource = $scope.dataSource;
            console.log(Flight.activeDatasource);
            $scope.createGantt();


            $scope.selectedBox = null;
            $scope.selectedBoxId = null;
            $scope.selectedIds = [];
            $scope.selectedItems = [];
            $scope.dg_crew_ds = null;
            $scope.dg_sum_ds = null;
           

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        ////////////////////
    };
    //////////////////////////////////////////
    $scope.getCrew = function (bid) {


        $scope.loadingVisible = true;
        flightService.getBoxCrew(bid).then(function (response) {
            $scope.loadingVisible = false;
            $scope.dg_crew_ds = response.Crew;
            $scope.dg_sum_ds = response.Summary;


            if (response.Crew.length > 0 && $scope.selectedBox) {
                $scope.selectedBox.HasCrew = true;
                $scope.selectedBox.HasCrewProblem = response.HasCrewProblem;
                $scope.selectedBox.AllCrewAssigned = response.AllCrewAssigned;
                var ganttObj = $("#resourceGanttba").data("ejGantt");
                ganttObj.updateRecordByTaskId($scope.selectedBox);
            }





        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    //////////////////////////////////////////
    //ko.applyBindings(dataView);
    $scope.AssignedCrew = "Assigned Crew";
    $scope.FlightsTitle = "";
    $scope.SourceLocation = "";
    $scope.selectedIds = [];
    $scope.selectedItems = [];
    $scope.selectedBox = null;
    $scope.selectedBoxId = null;
    $scope.selectedBoxChanged = function () {

        if (!$scope.selectedBox)
            return;
        var title = [];
        $.each($scope.selectedBox.BoxItems, function (_i, _d) {
            if (_i == 0)
                $scope.SourceLocation = _d.FromAirportIATA;
            title.push(_d.FlightNumber + ' (' + _d.FromAirportIATA + '-' + _d.ToAirportIATA + ')');
        });
        $scope.AssignedCrew = 'Assigned crew for flights: ' + title.join(', ');
        $scope.FlightsTitle = 'Flights: ' + title.join(', ');

        $scope.getCrew($scope.selectedBox.BoxId);

    };
    $scope.selectedIdsChanged = function () {
        $scope.$apply(function () {
            $scope.selectedBox = null;
            $scope.selectedBoxId = null;
            $scope.AssignedCrew = "Assigned Crew";
            $scope.dg_crew_ds = [];
            $scope.dg_sum_ds = [];

        });

    };


    $scope.$watch('selectedBox', function () {
        $scope.selectedBoxChanged();
    });

    $scope.$on('$viewContentLoaded', function () {

        $('#resourceGanttba').height($(window).height() - 139 - 255 - 50);
        //assigncrew
        $(document).on("click", ".assigncrew", function () {
            var eid = $(this).data("eid");
            alert(eid);
        });
        $(document).on("click", "._xati", function () {
             
            var id = $(this).data("id");
            var $element = $('#task-' + id).parent();

            var data = Enumerable.From($scope.dataSource).Where('$.Id==' + id).FirstOrDefault();
            var isBox = data.IsBox;
            var BoxId = data.BoxId;
            if (!isBox) {
                if ($element.hasClass('flight-item-selected')) {
                    $scope.selectedIds = Enumerable.From($scope.selectedIds).Where('$!=' + id).ToArray();
                    $scope.selectedItems = Enumerable.From($scope.selectedItems).Where('$.Id!=' + id).ToArray();
                }
                else {
                    $scope.selectedIds.push(id);
                    $scope.selectedItems.push(data);
                }
                $('#task-' + id).parent().toggleClass('nobox').toggleClass('flight-item-selected');
                $scope.selectedIdsChanged();
                // $scope.dataSource = Enumerable.From($scope.dataSource).Where('$.Id!=' + id).ToArray();
            }
            else {
                //  $('#task-' + id).parent().toggleClass('box').toggleClass('flight-item-selected');
                $scope.$apply(function () {
                    $scope.selectedBox = data;
                    $scope.selectedBoxId = data.BoxId;
                });

            }

            //// ganttObj.reRenderChart();

            // var ganttObj = $("#resourceGanttba").data("ejGantt");

            // ganttObj._refreshDataSource($scope.dataSource);




        });

    });
    $rootScope.$broadcast('FlightLoaded', null);


    //var data = [{ id: 1, name: 'vahid' }, { id: 2, name: 'atrina' }, { id: 3, name: 'navid' },];
    //var ditem = Enumerable.From( data).Where('$.id>1').ToArray();
    //ditem[0].name = 'ATI';
    //console.log('test stets sdf ssdf sdf sdf sdf sdf sdf ');
    //console.log(data);
    //console.log('---------------------------------');
    //console.log(ditem);




}]);