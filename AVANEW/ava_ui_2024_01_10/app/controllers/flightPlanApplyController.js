'use strict';

app.controller('flightPlanApplyController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'aircraftService', 'authService', 'notificationService', '$route', function ($scope, $location, $routeParams, $rootScope, flightService, aircraftService, authService, notificationService, $route) {
    $scope.prms = $routeParams.prms;

    //////////////////////////////////

    $scope.filterVisible = false;




    ////////////////////////////////
    $scope.tempData = null;

    $scope.btn_filter = {
        text: '',
        type: 'default',
        icon: 'filter',
        width: 40,
        onClick: function (e) {
            if ($scope.filterVisible) {
                $scope.filterVisible = false;
                $('.col-grid').removeClass('col-lg-7').addClass('col-lg-10');
                $('.book-side').removeClass('col-lg-12').addClass('col-lg-8');
                // $('.col-row-sum').removeClass().addClass();
                $('.filter').hide();
            }
            else {
                $scope.filterVisible = true;
                $('.col-grid').removeClass('col-lg-10').addClass('col-lg-7');
                $('.book-side').removeClass('col-lg-8').addClass('col-lg-12');
                //  $('.col-row-sum').removeClass().addClass('');
                $('.filter').show();
            }
        }

    };


    $scope.btn_view = {
        text: 'View',
        type: 'default',
        icon: 'info',
        width: 120,

        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            $scope.loadingVisible = true;
            flightService.getFlightPlanView($scope.dg_selected.Id).then(function (response) {
                $scope.loadingVisible = false;
                $scope.tempData = response;
                $scope.popup_add_visible = true;
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        }

    };
    $scope.IsApproveDisabled = true;
    $scope.btn_approve = {
        text: 'Approve',
        type: 'default',
        icon: 'check',
        width: 150,
        bindingOptions: {
            disabled: 'IsApproveDisabled'
        },
        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }

            General.Confirm(Config.Text_SimpleConfirm, function (res) {
                if (res) {

                    var dto = { Id: $scope.dg_selected.Id };
                    $scope.loadingVisible = true;
                    flightService.approvePlanRegisters(dto).then(function (response) {
                        $scope.loadingVisible = false;
                        General.ShowNotify(Config.Text_SavedOk, 'success');
                        $scope.IsApproveDisabled = true;
                        $scope.doRefresh = true;
                        $scope.bind();




                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                }
            });


        }

    };


    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 120,

        bindingOptions: {},
        onClick: function (e) {

            $scope.$broadcast('getFilterQuery', null);

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
    //////////////////////////////////





    ////////////////////////////////////


    $scope.dg_height_full = 100;
    $scope.scroll_height_full = 400;


    /////////////////////////////////
    $scope.dg_selected = null;
    $scope.dg_columns = [
        {
            dataField: "", caption: '',
            width: 55,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {
                //if (!options.data.IsActive) {
                //    if (options.data.Gaps > 0 || options.data.Overlaps > 0)
                //        $("<div>")
                //            .append("<i style='font-size:22px;color:red' class='icon ion-md-warning'></i>")
                //            .appendTo(container);
                //}
                //else
                //    $("<div>")
                //        .append("<i style='font-size:22px;color:#2196F3' class='icon ion-md-checkmark-circle'></i>")
                //        .appendTo(container);

                if (!options.data.IsApproved100 || options.data.IsApproved100 == 0) {

                    $("<div>")
                        .append("<i style='font-size:22px;color:#ff5722!important' class='icon ion-md-help-circle '></i>")
                        .appendTo(container);
                }
                else
                    $("<div>")
                        .append("<i style='font-size:22px;color:#8bc34a!important' class='icon ion-md-checkmark-circle'></i>")
                        .appendTo(container);

            },
            fixed: true, fixedPosition: 'left',
        },
        { dataField: 'Id', caption: 'No', allowResizing: true, dataType: 'number', allowEditing: false, width: 120, alignment: 'center', sortIndex: 1, sortOrder: "asc", fixed: true, fixedPosition: 'left' },
        { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 200 },
        { dataField: 'Types', caption: 'Types', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 200 },
        { dataField: 'IntervalType', caption: 'Interval', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 150 },
        { dataField: 'TotalFlights', caption: 'Flights', allowResizing: true, dataType: 'number', allowEditing: false, width: 100, alignment: 'center' },

        { dataField: 'DateFrom', caption: 'From', allowResizing: true, dataType: 'date', allowEditing: false, width: 200, alignment: 'center', fixed: false, fixedPosition: 'right' },
        { dataField: 'DateTo', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 200, fixed: false, fixedPosition: 'right' },
        // { dataField: 'DateActive', caption: 'Applied Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 200 },




    ];
    $scope.dg_height = 100;

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
        columnFixing: {
            enabled: true
        },
        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,


        columns: $scope.dg_columns,
        onContentReady: function (e) {
            if (!$scope.dg_instance)
                $scope.dg_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {

                $scope.dg_selected = null;
                $scope.IsApproveDisabled = true;
                $scope.dg_reg_ds = [];

            }
            else {
                $scope.dg_selected = data;
                $scope.IsApproveDisabled = data.IsApproved100 == 1;
                if ($scope.dg_selected.assignedRegisters) {
                    $scope.dg_reg_ds = $scope.dg_selected.assignedRegisters;
                } else {
                    $scope.loadingVisible = true;
                    var offset = -1 * (new Date()).getTimezoneOffset();
                    flightService.getFlightPlanAssignedRegisters($scope.dg_selected.Id,offset).then(function (response) {
                        $scope.loadingVisible = false;
                        $rootScope.MSNs = response;
                        $scope.dg_selected.assignedRegisters = response;
                        $scope.dg_reg_ds = $scope.dg_selected.assignedRegisters;

                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                }

            }


        },
        height: '100%',
        bindingOptions: {
            dataSource: 'dg_ds', //'dg_employees_ds',
            // height: 'dg_employees_height'
        }
    };


    $scope.dg_reg_columns = [
        { dataField: 'DateFromTo', caption: 'Date', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, groupIndex: 0, width: 200 },
        { dataField: 'Register', caption: 'Register', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, groupIndex: 1, width: 200 },
        { dataField: 'FlightNumber', caption: 'No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, },
        { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },





        { dataField: 'STD', caption: 'Dep.', allowResizing: true, dataType: 'datetime', allowEditing: false, width: 120, alignment: 'center', format: 'HH:mm' },
        { dataField: 'STA', caption: 'Arr.', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'HH:mm' },





    ];

    $scope.dg_reg_selected = null;
    $scope.dg_reg_instance = null;
    $scope.dg_reg_ds = null;
    $scope.dg_reg_height = null;
    $scope.dg_reg = {
        grouping: {
            autoExpandAll: true,
            allowCollapsing: true,
        },
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
        columnFixing: {
            enabled: true
        },
        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,


        columns: $scope.dg_reg_columns,
        onContentReady: function (e) {
            if (!$scope.dg_reg_instance)
                $scope.dg_reg_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {

                $scope.dg_reg_selected = null;



            }
            else {
                $scope.dg_reg_selected = data;
                

            }


        },
        height: function () {
            return window.innerHeight -180;
        },
        bindingOptions: {
            dataSource: 'dg_reg_ds', //'dg_employees_ds',
           // height: 'dg_reg_height'
        }
    };
    ///////////////////////////
    $scope.bind = function () {
        var url = 'odata/flightplans/approved/customer/' + Config.CustomerId + '/' + 70;
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
    ////////////////////////////
    $scope.flightData = null;
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


    //////////////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> Flight Plans(Apply) ';
        //  $('#resourceGantt').height($(window).height() - 45 - 100);

        $('.flightplanapply').fadeIn(400, function () {
            //vmins = new viewModel();
            //ko.applyBindings(vmins);
            //var h = $(window).height() - 130;
            //vmins.height(h + 'px');

            //var ds = proccessDataSource(resourceGanttData);
            //activeDatasource = ds;

            //vmins.gantt_datasource(ds);
        });
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
    //$scope.$on('onLibrarySaved', function (event, prms) {

    //    $scope.doRefresh = true;
    //});
    //$scope.$on('onLibraryHide', function (event, prms) {

    //    $scope.bind();

    //});
    //////////////////////////////////////////
    //ko.applyBindings(dataView);
    $scope.$on('$viewContentLoaded', function () {
        //Here your view content is fully loaded !!

        //if ($rootScope.AircraftTypes == null) {
        //    $scope.loadingVisible = true;
        //    aircraftService.getAircraftTypes(Config.CustomerId).then(function (response) {
        //        $scope.loadingVisible = false;
        //        $rootScope.AircraftTypes = response;
        //        console.log('types');
        //        console.log(response);

        //    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        //}
        //else {
        //    var t = 0;
        //}

        //if ($rootScope.MSNs == null) {
        //    $scope.loadingVisible = true;
        //    aircraftService.getMSNs(Config.CustomerId).then(function (response) {
        //        $scope.loadingVisible = false;
        //        $rootScope.MSNs = response;
        //        console.log('msns');
        //        console.log(response);

        //    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        //}

        //$scope.getFlightsGantt();

    });
    $rootScope.$broadcast('FlightLoaded', null);





}]);