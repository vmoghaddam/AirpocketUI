'use strict';
app.controller('crewReportController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'weatherService', 'aircraftService', 'authService', 'notificationService', '$route', function ($scope, $location, $routeParams, $rootScope, flightService, weatherService, aircraftService, authService, notificationService, $route) {
    $scope.prms = $routeParams.prms;

    //////////////////////////////////
    $scope.dsUrl = null;
    $scope.filterVisible = false;
    $scope.btn_delete = {
        text: 'Delete',
        type: 'danger',
        icon: 'clear',
        width: 120,

        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }

            General.Confirm(Config.Text_DeleteConfirm, function (res) {
                if (res) {

                    var dto = { Id: $scope.dg_selected.Id, };
                    $scope.loadingVisible = true;
                    airportService.delete(dto).then(function (response) {
                        $scope.loadingVisible = false;
                        General.ShowNotify(Config.Text_SavedOk, 'success');
                        $scope.doRefresh = true;
                        $scope.bind();



                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                }
            });
        }
    };
    $scope.btn_new = {
        text: 'New',
        type: 'default',
        icon: 'plus',
        width: 120,
        onClick: function (e) {

            var data = { Id: null };

            $rootScope.$broadcast('InitAddPerson', data);
        }

    };
    $scope.btn_edit = {
        text: 'Edit',
        type: 'default',
        icon: 'edit',
        width: 120,

        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var data = $scope.dg_selected;
            $rootScope.$broadcast('InitAddPerson', data);
        }

    };
    $scope.btn_view = {
        text: 'View',
        type: 'default',
        icon: 'doc',
        width: 120,
        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var data = $scope.dg_selected;
            $scope.InitAddAirport(data);
        }

    };
    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 120,
        validationGroup: 'crewreportsearch',
        bindingOptions: {},
        onClick: function (e) {
            var result = e.validationGroup.validate();

            if (!result.isValid) {
                General.ShowNotify(Config.Text_FillRequired, 'error');
                return;
            }
            $scope.dg_ds = null;
            $scope.$broadcast('getFilterQuery', null);
        }

    };
    $scope.selected_employee_id = null;
    $scope.btn_flight = {
        text: 'Flights',
        type: 'default',
        icon: 'airplane',
        width: 120,

        bindingOptions: {},
        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            $scope.selected_employee_id = $scope.dg_selected.Id;
            $scope.fillPerson($scope.dg_selected);
            $scope.doSearch = false;
            $scope.popup_flight_visible = true;
        }

    };

    $scope.btn_person = {
        text: 'Details',
        type: 'default',
        icon: 'card',
        width: 120,

        bindingOptions: {},
        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var data = $scope.dg_selected;
            $rootScope.$broadcast('InitViewPerson', data);
        }

    };
    $scope.btn_flight_total = {
        text: 'Flights(Total)',
        type: 'default',
        icon: 'datafield',
        width: 180,

        bindingOptions: {},
        onClick: function (e) {

            $scope.popup_flight_total_visible = true;
        }

    };
    $scope.btn_print = {
        text: 'Print',
        type: 'default',
        icon: 'print',
        width: 120,

    };
    $scope.btn_filter = {
        text: '',
        type: 'default',
        icon: 'filter',
        width: 40,
        onClick: function (e) {
            if ($scope.filterVisible) {
                $scope.filterVisible = false;
                $('.filter').fadeOut();
            }
            else {
                $scope.filterVisible = true;
                $('.filter').fadeIn();
            }
        }

    };
    //////////////////////////////////
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
    ///////////////////////////////////
    $scope.dt_from = new Date();
    $scope.dt_to = new Date().addDays(7);
    $scope.date_from = {
        type: "date",
        placeholder: 'From',
        width: '100%',

        bindingOptions: {
            value: 'dt_from',

        }
    };
    ///////////////////////////////////
    $scope.filters = [];
    //nook
    $scope.dg_columns = [

        {
            caption: 'Base', columns: [
                //{
                //    dataField: "ImageUrl",
                //    width: 80,
                //    alignment: 'center',
                //    caption:'',
                //    allowFiltering: false,
                //    allowSorting: false,
                //    cellTemplate: function (container, options) {
                //        $("<div>")
                //            .append($("<img>", { "src": $rootScope.clientsFilesUrl + (options.value ? options.value :'imguser.png'), "css": {height:'60px',borderRadius:'100%'} }))
                //            .appendTo(container);
                //    }
                //},
                { dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left' },
                { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 180, fixed: false, fixedPosition: 'left' },
              //  { dataField: 'PID', caption: 'PID', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: false, fixedPosition: 'left' },
               // { dataField: 'CurrentLocationAirporIATA', caption: 'Location', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90 },
            ]
        },
        //////////////////////////////////
        {
            caption: 'Flight',
            alignment: 'center',
            columns: [
                    { dataField: 'Day1_Flight', caption: 'Today', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 95, },
                    { dataField: 'Day28_Flight', caption: '28 D', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 95, sortIndex: 2, sortOrder: 'desc', },
                    { dataField: 'Year_Flight', caption: '12 M', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 95, sortIndex: 0, sortOrder: 'desc', },
                    { dataField: 'CYear_Flight', caption: 'Year', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 95, sortIndex: 1, sortOrder: 'desc', },

            ]
        },
        {
            caption: 'Duty',
            alignment: 'center',
            columns:[
                    { dataField: 'Day1_Duty', caption: 'Today', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 95  },
                    { dataField: 'Day7_Duty', caption: '7 D', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 95   },
                    { dataField: 'Day14_Duty', caption: '14 D', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 95   },
                    { dataField: 'Day28_Duty', caption: '28 D', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 95   },
            ]
        },
        
        ///////////////////////
        {
            caption: 'Alerts',
            columns: [


                ////////////////////////////////////////

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
                     dataField: "", caption: 'Licence',
                     width: 85,
                     allowFiltering: false,
                     allowSorting: false,
                     alignment: 'center',
                     cellTemplate: function (container, options) {

                         var color = 'green';
                         var icon = 'ion-md-checkmark-circle';
                         if (options.data.IsLicenceExpired == 1) { color = 'red'; icon = 'ion-md-alert'; };
                         var text = "";
                         if (options.data.IsLicenceExpired == -1) { color = 'gray'; icon = ''; text = "<span style='font-size:16px'>N/A</span>" };
                         if (options.data.JobGroup == 'CCM' || options.data.JobGroup == 'SCCM')
                         { color = 'gray'; icon = ''; text = "<span style='font-size:16px'>N/A</span>" };
                         $("<div>")
                             .append("<i style='font-size:22px;color:" + color + "!important' class='icon " + icon + "'>" + text + "</i>")
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
                    dataField: "", caption: 'LPC',
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
                    dataField: "", caption: 'CRM',
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

//{
//    dataField: "", caption: 'SEPTP',
//    width: 85,
//    allowFiltering: false,
//    allowSorting: false,
//    alignment: 'center',
//    cellTemplate: function (container, options) {

//        var color = 'green';
//        var icon = 'ion-md-checkmark-circle';
//        if (options.data.IsSEPTPExpired == 1) { color = 'red'; icon = 'ion-md-alert'; };


//        $("<div>")
//            .append("<i style='font-size:22px;color:" + color + "!important' class='icon " + icon + "'></i>")
//            .appendTo(container);

//    },

//},

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

//{
//    dataField: "", caption: 'UPSET',
//    width: 85,
//    allowFiltering: false,
//    allowSorting: false,
//    alignment: 'center',
//    cellTemplate: function (container, options) {

//        var color = 'green';
//        var icon = 'ion-md-checkmark-circle';
//        if (options.data.IsUpsetRecoveryTrainingExpired == 1) { color = 'red'; icon = 'ion-md-alert'; };
//        var text = "";
//        if (options.data.IsUpsetRecoveryTrainingExpired == -1) { color = 'gray'; icon = ''; text = "<span style='font-size:16px'>N/A</span>" };

//        $("<div>")
//            .append("<i style='font-size:22px;color:" + color + "!important' class='icon " + icon + "'>" + text + "</i>")
//            .appendTo(container);

//    },

//},
                ////////////////////////////////////////


            ]
        },





    ];

    $scope.dg_selected = null;
    $scope.dg_instance = null;
    $scope.dg_ds = null;
    $scope.dg = {
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
        height: $(window).height() - 135,

        columns: $scope.dg_columns,
        onContentReady: function (e) {
            if (!$scope.dg_instance)
                $scope.dg_instance = e.component;

        },
        onCellPrepared: function (e) {
            if (e.rowType === "data" && e.column.dataField == "Day7_Duty") {
                if (e.data.ODay7_Duty > 60 * 60)
                    e.cellElement.css("backgroundColor", "#ff3333");
                else if (e.data.ODay7_Duty > 45 * 60)
                    e.cellElement.css("backgroundColor", "#ffa64d");
            }
            if (e.rowType === "data" && e.column.dataField == "Day14_Duty") {
                if (e.data.ODay14_Duty > 110 * 60)
                    e.cellElement.css("backgroundColor", "#ff3333");
                else if (e.data.ODay14_Duty > 95 * 60)
                    e.cellElement.css("backgroundColor", "#ffa64d");
            }
            if (e.rowType === "data" && e.column.dataField == "Day28_Duty") {
                if (e.data.ODay28_Duty > 190 * 60)
                    e.cellElement.css("backgroundColor", "#ff3333");
                else if (e.data.ODay28_Duty > 175 * 60)
                    e.cellElement.css("backgroundColor", "#ffa64d");
            }

            if (e.rowType === "data" && e.column.dataField == "Day28_Flight") {
                if (e.data.ODay28_Flight > 100 * 60)
                    e.cellElement.css("backgroundColor", "#ff3333");
                else if (e.data.ODay28_Flight > 90 * 60)
                    e.cellElement.css("backgroundColor", "#ffa64d");
            }

            if (e.rowType === "data" && e.column.dataField == "Year_Flight") {
                if (e.data.OYear_Flight > 1000 * 60)
                    e.cellElement.css("backgroundColor", "#ff3333");
                else if (e.data.OYear_Flight > 990 * 60)
                    e.cellElement.css("backgroundColor", "#ffa64d");
            }

            if (e.rowType === "data" && e.column.dataField == "CYear_Flight") {
                if (e.data.OCYear_Flight > 900*60)
                    e.cellElement.css("backgroundColor", "#ff3333");
                else if (e.data.OCYear_Flight > 890 * 60)
                    e.cellElement.css("backgroundColor", "#ffa64d");
            }
               
        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_selected = null;
            }
            else
                $scope.dg_selected = data;


        },
        "export": {
            enabled: true,
            fileName: "CrewReport",
            allowExportSelectedData: true
        },
        bindingOptions: {
            dataSource: 'dg_ds'
        }
    };
    //////////////////////////////////
    $scope.person = {
        FirstName: null,
        LastName: null,
        PID: null,
        JobGroup: null,
        Mobile: null,
    };
    $scope.fillPerson = function (data) {

        $scope.person.FirstName = data.FirstName;
        $scope.person.LastName = data.LastName;
        $scope.person.PID = data.PID;
        $scope.person.JobGroup = data.JobGroup;
        $scope.person.Mobile = data.Mobile;
    };
    $scope.clearPerson = function (data) {
        $scope.person.FirstName = null;
        $scope.person.LastName = null;
        $scope.person.PID = null;
        $scope.person.JobGroup = null;
        $scope.person.Mobile = null;
    };
    $scope.txt_FirstName = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'person.FirstName',

        }
    };
    $scope.txt_LastName = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'person.LastName',

        }
    };
    $scope.txt_PID = {

        readOnly: true,
        hoverStateEnabled: false,

        rtlEnabled: false,
        bindingOptions: {
            value: 'person.PID',

        }
    };
    $scope.txt_group = {

        readOnly: true,
        hoverStateEnabled: false,

        rtlEnabled: false,

        bindingOptions: {
            value: 'person.JobGroup',

        }
    };
    $scope.txt_Mobile = {

        readOnly: true,
        hoverStateEnabled: false,
        mask: "AB00-0000000",
        maskRules: {
            "A": /[0]/,
            "B": /[9]/,

        },
        maskChar: '_',
        maskInvalidMessage: 'Wrong value',

        bindingOptions: {
            value: 'person.Mobile',

        }
    };
    ///////////////////////////////////
    $scope.dg_flight_columns = [

        { dataField: 'Date', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 130, format: 'yyyy-MMM-dd' },
        { dataField: 'FlightNumber', caption: 'No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left' },
        { dataField: 'Position', caption: 'Position', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left' },
        {
            caption: 'Route', columns: [
                { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 70 },
                { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 70 },
            ]
        },

        {
            caption: 'Departure',
            columns: [

                { dataField: 'STD', caption: 'STD', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },
                { dataField: 'ChocksOut', caption: 'Off Block', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },
                { dataField: 'Takeoff', caption: 'Departed', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },

            ]
        },
        {
            caption: 'Arrival',
            columns: [

                { dataField: 'STA', caption: 'STA', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },
                { dataField: 'Landing', caption: 'Arrived', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },
                { dataField: 'ChocksIn', caption: 'On Block', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },
            ]
        },

        {
            caption: 'Times', fixed: true, fixedPosition: 'right', columns: [
              //  { dataField: 'DurationH', caption: 'HH', allowResizing: true, dataType: 'number', allowEditing: false, width: 130, alignment: 'center', name: 'dhh', },
              //  { dataField: 'DurationM', caption: 'MM', allowResizing: true, dataType: 'number', allowEditing: false, width: 130, alignment: 'center', name: 'dmm', },
                { dataField: 'ScheduledFlightTime2', caption: 'Flight Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
                 { dataField: 'FixTime2', caption: 'Fix Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
                { dataField: 'BlockTime2', caption: 'Block Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
                //{ dataField: 'Duty2', caption: 'Duty', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
            ]
        },



    ];

    $scope.dg_flight_selected = null;
    $scope.dg_flight_instance = null;
    $scope.dg_flight_ds = null;
    $scope.dg_flight = {
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
        height: $(window).height() - 235,

        columns: $scope.dg_flight_columns,
        onContentReady: function (e) {
            if (!$scope.dg_flight_instance)
                $scope.dg_flight_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_flight_selected = null;
            }
            else
                $scope.dg_flight_selected = data;


        },
        summary: {
            totalItems: [{
                name: "FlightTimeTotal",
                showInColumn: "ScheduledFlightTime2",
                displayFormat: "{0}",

                summaryType: "custom"
            },
                {
                    name: "BlockTimeTotal",
                    showInColumn: "BlockTime2",
                    displayFormat: "{0}",

                    summaryType: "custom"
                }
                ,
                {
                    name: "FixTimeTotal",
                    showInColumn: "FixTime2",
                    displayFormat: "{0}",

                    summaryType: "custom"
                }
            ],
            calculateCustomSummary: function (options) {
                if (options.name === "FlightTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.ScheduledFlightTime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }

                if (options.name === "BlockTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.BlockTime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }

                if (options.name === "FixTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.FixTime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }



            }
        },
        bindingOptions: {
            dataSource: 'dg_flight_ds'
        }
    };
    //////////////////////////////////
    $scope.dg_flight_total_columns = [

        { dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', width: 150, allowEditing: false, fixed: false, fixedPosition: 'left' },
       
        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false,  fixed: false, fixedPosition: 'left' },
       // { dataField: 'LastName', caption: 'Last Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left' },




             //   { dataField: 'DurationH', caption: 'Flights HH', allowResizing: true, dataType: 'number', allowEditing: false, width: 150, alignment: 'center', name: 'dhh', },
            //    { dataField: 'DurationM', caption: 'Flights MM', allowResizing: true, dataType: 'number', allowEditing: false, width: 150, alignment: 'center', name: 'dmm', },
        { dataField: 'Legs', caption: 'Legs', allowResizing: true, dataType: 'number', allowEditing: false, width: 100, alignment: 'center', },
        { dataField: 'FlightTime2', caption: 'Flight Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'BlockTime2', caption: 'Block Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'FixTime2', caption: 'Fix Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },



    ];

    $scope.dg_flight_total_selected = null;
    $scope.dg_flight_total_instance = null;
    $scope.dg_flight_total_ds = null;
    $scope.dg_flight_total = {
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
        height: $(window).height() - 135,

        columns: $scope.dg_flight_total_columns,
        onContentReady: function (e) {
            if (!$scope.dg_flight_total_instance)
                $scope.dg_flight_total_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_flight_total_selected = null;
            }
            else
                $scope.dg_flight_total_selected = data;


        },
        summary: {
            totalItems: [{
                name: "FlightTimeTotal",
                showInColumn: "FlightTime2",
                displayFormat: "{0}",

                summaryType: "custom"
            },
            {
                name: "BlockTimeTotal",
                showInColumn: "BlockTime2",
                displayFormat: "{0}",

                summaryType: "custom"
            }
                ,
            {
                name: "FixTimeTotal",
                showInColumn: "FixTime2",
                displayFormat: "{0}",

                summaryType: "custom"
            }
            ],
            calculateCustomSummary: function (options) {
                if (options.name === "FlightTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.FlightTime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }

                if (options.name === "BlockTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.BlockTime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }

                if (options.name === "FixTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.FixTime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }



            }
        },
        bindingOptions: {
            dataSource: 'dg_flight_total_ds'
        }
    };
    //////////////////////////////////
    $scope.doRefresh = false;

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

    $scope.jgroup = 'Cockpit';
    $scope.sb_group = {
        showClearButton: false,
        searchEnabled: true,
        dataSource: ['Cockpit', 'Cabin'],


        bindingOptions: {
            value: 'jgroup',

        }
    };
    $scope.bind = function () {
        //iruser558387
        var _dt = moment($scope.dt_from).format('YYYY-MM-DDTHH:mm:ss');

        var jc = '00101';
        if ($scope.jgroup == 'Cabin')
            jc = '00102';
        var url = 'odata/crew/report/main?date=' + _dt + '&jc=' + jc;//2019-06-06T00:00:00';
        if (!$scope.dg_ds) {
            $scope.dg_ds = {
                store: {
                    type: "odata",
                    url: $rootScope.serviceUrl + url,
                    key: "Id",
                    version: 4,
                      
                    onLoaded: function (e) {
                        $.each(e, function (_i, _d) {
                            _d.Day1_Duty = pad(Math.floor(_d.Day1_Duty / 60)).toString() + ':' + pad(Math.round(_d.Day1_Duty % 60)).toString();
                            _d.ODay1_Flight = _d.Day1_Flight;
                            _d.Day1_Flight = pad(Math.floor(_d.Day1_Flight / 60)).toString() + ':' + pad(Math.round(_d.Day1_Flight % 60)).toString();

                            _d.ODay7_Duty = _d.Day7_Duty;
                            _d.Day7_Duty = pad(Math.floor(_d.Day7_Duty / 60)).toString() + ':' + pad(Math.round(_d.Day7_Duty % 60)).toString();
                            //_d.Day7_Duty=
                            
                            //_d.Day7_Flight = pad(Math.floor(_d.Day7_Flight / 60)).toString() + ':' + pad(_d.Day7_Flight % 60).toString();
                            _d.ODay14_Duty = _d.Day14_Duty;
                            _d.Day14_Duty = pad(Math.floor(_d.Day14_Duty / 60)).toString() + ':' + pad(Math.round(_d.Day14_Duty % 60)).toString();
                            //_d.Day14_Flight = pad(Math.floor(_d.Day14_Flight / 60)).toString() + ':' + pad(_d.Day14_Flight % 60).toString();
                            _d.ODay28_Duty = _d.Day28_Duty;
                            _d.Day28_Duty = pad(Math.floor(_d.Day28_Duty / 60)).toString() + ':' + pad(Math.round(_d.Day28_Duty % 60)).toString();

                            _d.ODay28_Flight = _d.Day28_Flight;
                            _d.Day28_Flight = pad(Math.floor(_d.Day28_Flight / 60)).toString() + ':' + pad(Math.round(_d.Day28_Flight % 60)).toString();
                            // _d.Year_Duty = pad(Math.floor(_d.Year_Duty / 60)).toString() + ':' + pad(_d.Year_Duty % 60).toString();
                            _d.OYear_Flight = _d.Year_Flight;
                            _d.Year_Flight = pad(Math.floor(_d.Year_Flight / 60)).toString() + ':' + pad(Math.round(_d.Year_Flight % 60)).toString();
                          
                            _d.OCYear_Flight = _d.CYear_Flight;
                            _d.CYear_Flight = pad(Math.floor(_d.CYear_Flight / 60)).toString() + ':' + pad(Math.round(_d.CYear_Flight % 60)).toString();
                        });
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
                // sort: ['DatePay', 'Amount'],

            };
        }

        if ($scope.doRefresh) {
            $scope.filters = $scope.getFilters();
            $scope.dg_ds.filter = $scope.filters;
            $scope.dg_instance.refresh();
            $scope.doRefresh = false;
        }

    };


    $scope.formatMinutes = function (mm) {
        return pad(Math.floor(mm / 60)).toString() + ':' + pad(mm % 60).toString();
    };
    //gigi
    $scope.getCrewFlights = function (id, df, dt) {
        var offset = -1 * (new Date()).getTimezoneOffset();
        $scope.loadingVisible = true;
        flightService.getCrewFlights(id, df, dt).then(function (response) {
            console.log(response);
            $scope.loadingVisible = false;
            $.each(response, function (_i, _d) {
                _d.STA = (new Date(_d.STA)).addMinutes(offset);

                _d.STD = (new Date(_d.STD)).addMinutes(offset);
                if (_d.ChocksIn)
                    _d.ChocksIn = (new Date(_d.ChocksIn)).addMinutes(offset);
                if (_d.ChocksOut)
                    _d.ChocksOut = (new Date(_d.ChocksOut)).addMinutes(offset);
                if (_d.Takeoff)
                    _d.Takeoff = (new Date(_d.Takeoff)).addMinutes(offset);
                if (_d.Landing)
                    _d.Landing = (new Date(_d.Landing)).addMinutes(offset);
                _d.DurationH = Math.floor(_d.FlightTime / 60);
                _d.DurationM = _d.FlightTime % 60;
                var fh = _d.FlightH * 60 + _d.FlightM;

                _d.FlightTime2 = pad(Math.floor(fh / 60)).toString() + ':' + pad(fh % 60).toString();
                _d.ScheduledFlightTime2 = $scope.formatMinutes(_d.ScheduledFlightTime);

                var bm = _d.ActualFlightHOffBlock * 60 + _d.ActualFlightMOffBlock;
                //_d.BlockTime = pad(Math.floor(bm / 60)).toString() + ':' + pad(bm % 60).toString();
                _d.BlockTime2 = $scope.formatMinutes(_d.BlockTime);
                _d.FixTime2 = $scope.formatMinutes(_d.FixTime);
                _d.Duty2 = pad(Math.floor(_d.Duty / 60)).toString() + ':' + pad(_d.Duty % 60).toString();
                //poosk
            });
            $scope.dg_flight_ds = response;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };

    $scope.getCrewFlightsTotal = function (df, dt) {

        $scope.loadingVisible = true;
        flightService.getCrewFlightsTotal(df, dt).then(function (response) {
            $scope.loadingVisible = false;
            $.each(response, function (_i, _d) {

               // _d.DurationH = Math.floor(_d.FlightTime / 60);
               // _d.DurationM = _d.FlightTime % 60;
               // var fh = _d.FlightH * 60 + _d.FlightM;
                _d.FlightTime2 = $scope.formatMinutes(_d.FlightTime);
                _d.FixTime2 = $scope.formatMinutes(_d.FixTime);
                //var bm = _d.BlockH * 60 + _d.BlockM;
                _d.BlockTime2 = $scope.formatMinutes(_d.BlockTime);
            });
            $scope.dg_flight_total_ds = response;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };


    $scope.popup_flight_df = null;
    $scope.popup_flight_df_instance = null;
    $scope.popup_flight_dt = null;
    $scope.popup_flight_dt_instance = null;
    $scope.popup_flight_visible = false;
    $scope.popup_flight_title = 'Flights';


    function printCanvas(canvas) {

        var frame1 = $('<iframe />');
        frame1[0].name = "frame1";
        frame1.css({ "position": "absolute", "top": "-1000000px" });
        $("body").append(frame1);
        var frameDoc = frame1[0].contentWindow ? frame1[0].contentWindow : frame1[0].contentDocument.document ? frame1[0].contentDocument.document : frame1[0].contentDocument;
        frameDoc.document.open();
        //Create a new HTML document.
        frameDoc.document.write('<html><head><title></title>');
        frameDoc.document.write('<style>');
        frameDoc.document.write('*{display: hidden;}');
        frameDoc.document.write('img{display: block; width: 100%; }');
        frameDoc.document.write('</style>');
        frameDoc.document.write('</head><body class="gantt">');

        frameDoc.document.write("<div style='height:100%'><div style='text-align:center;margin-top:30px'>Fly Persia</div><div style='text-align:center;margin-top:10px'>Flights</div><img style='margin-top:10px;height:65%'  src = '" + canvas.toDataURL() + "'/></div>");
        frameDoc.document.write('</body></html>');
        frameDoc.document.close();
        setTimeout(function () {
            window.frames["frame1"].focus();
            window.frames["frame1"].print();
            frame1.remove();
        }, 500);
    }
    $scope.popup_flight = {
        shading: true,
        width: 1100,
        height: 650, //function () { return $(window).height() * 0.8 },
        fullScreen: true,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [

            {
                widget: 'dxDateBox', location: 'before', options: {
                    onContentReady: function (e) {
                        if (!$scope.popup_flight_df_instance)
                            $scope.popup_flight_df_instance = e.component;
                    },
                    width: 150, placeholder: 'From', onValueChanged: function (e) { $scope.popup_flight_df = e.value; }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxDateBox', location: 'before', options: {
                    onContentReady: function (e) {
                        if (!$scope.popup_flight_dt_instance)
                            $scope.popup_flight_dt_instance = e.component;
                    },
                    width: 150, placeholder: 'To', onValueChanged: function (e) { $scope.popup_flight_dt = e.value; }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'success', text: 'Search', icon: 'search', onClick: function (arg) {
                        var dt = $scope.popup_flight_dt ? $scope.popup_flight_dt : new Date(2200, 4, 19, 0, 0, 0);
                        var df = $scope.popup_flight_df ? $scope.popup_flight_df : new Date(1900, 4, 19, 0, 0, 0);

                        $scope.getCrewFlights($scope.selected_employee_id, df, dt);


                    }


                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'success', text: 'Print', icon: 'print', onClick: function (arg) {
                         
                        html2canvas(document.querySelector("._print_flight")).then(function (canvas) {
                            // document.body.appendChild(canvas);
                            //var a = document.createElement('a');

                            //a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
                            // a.download = 'somefilename.jpg';
                            //a.click();
                            printCanvas(canvas);
                        });

                    }


                }, toolbar: 'bottom'
            },

            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_flight_visible = false; } }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {


        },
        onShown: function (e) {
            $('.dx-toolbar-items-container').addClass('dx-border');

            if ($scope.popup_flight_dt_instance && $scope.popup_flight_total_dt) {

                $scope.popup_flight_dt_instance.option('value', $scope.popup_flight_total_dt);

            }


            if ($scope.popup_flight_df_instance && $scope.popup_flight_total_df)
                $scope.popup_flight_df_instance.option('value', $scope.popup_flight_total_df);

            if ($scope.doSearch) {
                var dt = $scope.popup_flight_dt ? $scope.popup_flight_dt : new Date(2200, 4, 19, 0, 0, 0);
                var df = $scope.popup_flight_df ? $scope.popup_flight_df : new Date(1900, 4, 19, 0, 0, 0);

                $scope.getCrewFlights($scope.selected_employee_id, df, dt);
            }
        },
        onHiding: function () {
            $scope.dg_crew_flight_ds = [];
            $scope.clearPerson();
            $scope.popup_flight_visible = false;

        },
        bindingOptions: {
            visible: 'popup_flight_visible',

            title: 'popup_flight_title',
            //  'toolbarItems[0].options.value': 'popup_flight_df',

        }
    };
    //////////////////////////////
    $scope.popup_flight_total_df = null;
    $scope.popup_flight_total_dt = null;
    $scope.popup_flight_total_visible = false;
    $scope.popup_flight_total_title = 'Flights (Total)';
    $scope.doSearch = false;
    $scope.popup_flight_total = {
        shading: true,
        width: 1100,
        height: 650, //function () { return $(window).height() * 0.8 },
        fullScreen: true,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [

            {
                widget: 'dxDateBox', location: 'before', options: {
                    width: 150, placeholder: 'From', onValueChanged: function (e) {
                        $scope.popup_flight_total_df = e.value;

                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxDateBox', location: 'before', options: {
                    width: 150, placeholder: 'To', onValueChanged: function (e) {
                        $scope.popup_flight_total_dt = e.value;

                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'success', text: 'Search', icon: 'search', onClick: function (arg) {
                        var dt = $scope.popup_flight_total_dt ? $scope.popup_flight_total_dt : new Date(2200, 4, 19, 0, 0, 0);
                        var df = $scope.popup_flight_total_df ? $scope.popup_flight_total_df : new Date(1900, 4, 19, 0, 0, 0);
                        $scope.getCrewFlightsTotal(df, dt);


                    }


                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Details', icon: 'airplane', onClick: function (e) {
                        $scope.dg_flight_total_selected = $rootScope.getSelectedRow($scope.dg_flight_total_instance);
                        if (!$scope.dg_flight_total_selected) {
                            General.ShowNotify(Config.Text_NoRowSelected, 'error');
                            return;
                        }
                        $scope.selected_employee_id = $scope.dg_flight_total_selected.Id;
                        $scope.fillPerson($scope.dg_flight_total_selected);
                        $scope.doSearch = true;
                        $scope.popup_flight_visible = true;
                    }
                }, toolbar: 'bottom'
            },
            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_flight_total_visible = false; } }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {


        },
        onShown: function (e) {
            $('.dx-toolbar-items-container').addClass('dx-border');


        },
        onHiding: function () {
            $scope.dg_crew_flight_total_ds = [];
            $scope.popup_flight_total_dt = null;
            $scope.popup_flight_total_df = null;
            $scope.popup_flight_total_visible = false;

        },
        bindingOptions: {
            visible: 'popup_flight_total_visible',

            title: 'popup_flight_total_title',

        }
    };


    ///////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> Crew';
        $('.crewreport').fadeIn();
    }
    //////////////////////////////////////////
    $scope.$on('getFilterResponse', function (event, prms) {

        $scope.filters = prms;

        $scope.doRefresh = true;
        $scope.bind();
    });
    $scope.$on('onTemplateSearch', function (event, prms) {

        $scope.$broadcast('getFilterQuery', null);
    });
    $scope.$on('onPersonSaved', function (event, prms) {

        $scope.doRefresh = true;
    });
    $scope.$on('onPersonHide', function (event, prms) {

        $scope.bind();

    });
    //////////////////////////////////////////
    $rootScope.$broadcast('PersonLoaded', null);
    ///end
}]);