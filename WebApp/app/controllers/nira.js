'use strict';
app.controller('niraController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'aircraftService', 'authService', 'notificationService', '$route', '$http', 'msgService', function ($scope, $location, $routeParams, $rootScope, flightService, aircraftService, authService, notificationService, $route, $http, msgService) {
    $scope.prms = $routeParams.prms;

    //$scope.selectedTabIndex = -1;
    //$scope.selectedTabId = null;
    //$scope.tabs = [
    //    { text: "Conflicts", id: 'conflicts' },
    //    //{ text: "By Route", id: 'route' },
    //    // { text: "By Register", id: 'register' },
    //  //  { text: "Errors", id: 'errors' },

    //];

    //$scope.$watch("selectedTabIndex", function (newValue) {
    //    //ati
    //    try {
    //        $('.tabc').hide();
    //        var id = $scope.tabs[newValue].id;
    //        $scope.selectedTabId = id;
    //        $('#' + id).fadeIn();

    //        switch (id) {
    //            case 'conflicts':
    //                $scope.bindCrew();
    //                break;
    //            case 'route':

    //                break;
    //            case 'register':

    //                break;
    //            case 'errors':
    //                $scope.bindErrors();
    //                break;

    //            default:
    //                break;
    //        }
    //        if ($scope.dg_errors_instance)
    //            $scope.dg_errors_instance.refresh();
    //        if ($scope.dg_crew_instance)
    //            $scope.dg_crew_instance.refresh();
    //    }
    //    catch (e) {

    //    }

    //});
    //$scope.tabs_options = {
    //    scrollByContent: true,
    //    showNavButtons: true,


    //    onItemClick: function (arg) {
    //        //$scope.selectedTab = arg.itemData;

    //    },
    //    onItemRendered: function (e) {
    //        $scope.selectedTabIndex = -1;
    //        $scope.selectedTabIndex = 0;
    //    },
    //    bindingOptions: {
    //        //visible: 'tabsdatevisible',
    //        dataSource: { dataPath: "tabs", deep: true },
    //        selectedIndex: 'selectedTabIndex'
    //    }

    //};
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
    $scope.btn_refresh = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 150,
        validationGroup: 'nirabind',
        onClick: function (e) {
            var result = e.validationGroup.validate();

            if (!result.isValid) {
                General.ShowNotify(Config.Text_FillRequired, 'error');
                return;
            }
            $scope.bindErrors();

        }

    };
    ////////////////////////////////
    //9-14
    $scope.IsSyncVisible = $rootScope.userName.toLowerCase().startsWith('sale.lotfi') || $rootScope.userName.toLowerCase().startsWith('demo') || $rootScope.userName.toLowerCase().startsWith('razbani');
    $scope.btn_sync = {
        text: 'Sync',
        type: 'default',
          
        width: 150,
        validationGroup: 'nirabind',
        onClick: function (e) {
            var result = e.validationGroup.validate();

            if (!result.isValid) {
                General.ShowNotify(Config.Text_FillRequired, 'error');
                return;
            }
            var selected = $rootScope.getSelectedRows($scope.dg_errors_instance);
            if (!selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
          //  console.log(Enumerable.From(selected).Select('$.AirPocket.FlightId').ToArray());
            
            $scope.Sync();

        }

    };
    $scope.Sync = function () {
        var selected = $rootScope.getSelectedRows($scope.dg_errors_instance);
         
       var _ids=(Enumerable.From(selected).Select('Number($.AirPocket.FlightId)').ToArray());
        var _df = moment($scope.dt_from).format('YYYY-MM-DD');
        var _dt = moment($scope.dt_to).format('YYYY-MM-DD');
        $scope.loadingVisible = true;

        /*
        $http.get($rootScope.serviceUrl + 'odata/ati/nira/all/'+_df+'/'+_dt).then(function (response) {
            $scope.loadingVisible = false;
            General.ShowNotify(Config.Text_SavedOk, 'success');
            $scope.bindErrors();
        }, function (err, status) {
                $scope.loadingVisible = false;
                General.ShowNotify('Sync. Failed.  ' + Exceptions.getMessage(err), 'error');
             
        });
        */
        var entity = { ids: _ids, dfrom: _df, dto: _dt };
        msgService.syncNira(entity).then(function (response) {
            $scope.loadingVisible = false;
            General.ShowNotify(Config.Text_SavedOk, 'success');
            $scope.bindErrors();
             
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        //$http.post($rootScope.serviceUrl + 'odata/ati/nira/all/filtered', entity).then(function (response) {
        //    $scope.loadingVisible = false;
        //    General.ShowNotify(Config.Text_SavedOk, 'success');
        //    $scope.bindErrors();
        //}, function (err, status) {

        //        $scope.loadingVisible = false;
        //        General.ShowNotify('Sync. Failed.  ' + Exceptions.getMessage(err), 'error');
        //});

    };
    $scope.btn_persiandate = {
        //text: 'Search',
        type: 'default',
        icon: 'event',
        width: 35,
        //validationGroup: 'dlasearch',
        bindingOptions: {},
        onClick: function (e) {

            $scope.popup_date_visible = true;
        }

    };
    $scope.popup_date_visible = false;
    $scope.popup_date_title = 'Date Picker';
    var pd1 = null;
    var pd2 = null;
    $scope.popup_date = {
        title: 'Shamsi Date Picker',
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 200,
        width: 300,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,


        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {
            // $(e.titleElement).addClass('vahid');
            // $(e.titleElement).css('background-color', '#f2552c');
        },
        onShowing: function (e) {




        },
        onShown: function (e) {

            pd1 = $(".date1").pDatepicker({
                format: 'l',
                autoClose: true,
                calendar: {
                    persian: {
                        locale: 'en'
                    }
                },
                onSelect: function (unix) {

                    //console.log(new Date(unix));
                    $scope.$apply(function () {

                        $scope.dt_from = new Date(unix);
                    });

                },

            });
            pd1.setDate(new Date($scope.dt_from.getTime()));
            //pd2 = $(".date2").pDatepicker({
            //    format: 'l',
            //    autoClose: true,
            //    calendar: {
            //        persian: {
            //            locale: 'en'
            //        }
            //    },
            //    onSelect: function (unix) {
            //        $scope.$apply(function () {
            //            $scope.dt_to = new Date(unix);
            //        });
            //    },

            //});
            //pd2.setDate(new Date($scope.dt_to.getTime()));

        },
        onHiding: function () {
            pd1.destroy();
           // pd2.destroy();
            $scope.popup_date_visible = false;

        },
        showCloseButton: true,
        bindingOptions: {
            visible: 'popup_date_visible',



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
        { dataField: 'Date', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yyyy-MM-dd', fixed: true, fixedPosition: 'left' },
        // { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200, fixed: false, fixedPosition: 'left', },
        //  { dataField: 'CourseCode', caption: 'Course Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, minWidth: 300, fixed: false, fixedPosition: 'left', },

        { dataField: 'AirPocket.FlightNo', caption: 'Flight No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 110, fixed: false, fixedPosition: 'left', fixed: true, fixedPosition: 'left' }, 
        { dataField: 'AirPocket.Origin', caption: 'FROM', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130, fixed: false, fixedPosition: 'left', fixed: true, fixedPosition: 'left' }, 
        { dataField: 'AirPocket.Destination', caption: 'TO', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130, fixed: false, fixedPosition: 'left', fixed: true, fixedPosition: 'left' }, 
        {
            caption: 'Summary', fixed: true, fixedPosition: 'left',
            columns: [
                { dataField: 'IsNiraFound', caption: 'Found', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 100, fixed: false, fixedPosition: 'left', },
                { dataField: 'IsRegister', caption: 'Register', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 100, fixed: false, fixedPosition: 'left', },
                { dataField: 'IsSTD', caption: 'STD', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 100, fixed: false, fixedPosition: 'left', },
                { dataField: 'IsSTA', caption: 'STA', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 100, fixed: false, fixedPosition: 'left', },
                { dataField: 'IsRoute', caption: 'Route', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 100, fixed: false, fixedPosition: 'left', },
                { dataField: 'IsStatus', caption: 'Status', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 100, fixed: false, fixedPosition: 'left', },
            ]
        },
        {
            caption: 'Register', columns: [
                { dataField: 'AirPocket.Register', caption: 'AP', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left', },
                { dataField: 'Nira.Register', caption: 'NIRA', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130, fixed: false, fixedPosition: 'left', },
            ]
        },
        {
            caption: 'STD', columns: [
                { dataField: 'AirPocket.STD', caption: 'AP', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 100, format: 'HH:mm', },
                { dataField: 'Nira.STD', caption: 'NIRA', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 100, format: 'HH:mm', },
            ]
        },
        {
            caption: 'STA', columns: [
                { dataField: 'AirPocket.STA', caption: 'AP', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 100, format: 'HH:mm', },
                { dataField: 'Nira.STA', caption: 'NIRA', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 100, format: 'HH:mm', },
            ]
        },
        {
            caption: 'Route', columns: [
                { dataField: 'AirPocket.Route', caption: 'AP', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left', },
                { dataField: 'Nira.Route', caption: 'NIRA', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left', },
            ]
        },
        {
            caption: 'Status', columns: [
                { dataField: 'AirPocket.Status', caption: 'AP', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130, fixed: false, fixedPosition: 'left', },
                { dataField: 'Nira.Status', caption: 'NIRA', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130, fixed: false, fixedPosition: 'left', },
            ]
        },
        

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
        height: $(window).height() - 180,

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
            if (e.rowType === "data" && e.column.caption == "Flight No" && e.data.IsConflicted==1) {
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
    
    //////////////////////////////////
    $scope.bindErrors = function () {
        var _df = moment($scope.dt_from).format('YYYY-MM-DD');
        var _dt = moment($scope.dt_to).format('YYYY-MM-DD');


        $scope.loadingVisible = true;
        //flightService.getNiraConflicts(_df,_dt).then(function (response) {
        msgService.getNiraConflicts(_df, /*_dt*/_df).then(function (response) {
            $scope.loadingVisible = false;
            $scope.dg_errors_ds = response;
            console.log(response);


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    
    ///////////////////////////////////
    //$scope.dt_to = new Date().addDays(7);
    $scope.dt_from = new Date() ;
    

    $scope.date_from = {
        type: "date",
        placeholder: 'From',
        width: '100%',

        bindingOptions: {
            value: 'dt_from',

        }
    };
    $scope.date_to = {
        type: "date",
        placeholder: 'To',
        width: '100%',

        bindingOptions: {
            value: 'dt_to',

        }
    };
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
        $rootScope.page_title = '> Nira';


        $('.nira').fadeIn(400, function () {

        });
    }
    //////////////////////////////////////////

    $scope.$on('$viewContentLoaded', function () {


    });



}]);