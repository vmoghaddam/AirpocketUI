'use strict';

app.controller('flightPlansMaintenanceController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'aircraftService', 'authService', 'notificationService', '$route', function ($scope, $location, $routeParams, $rootScope, flightService, aircraftService, authService, notificationService, $route) {
    $scope.prms = $routeParams.prms;
    $scope.typeId = 60;
    $scope.typeId = 50;

    // console.log($location.search());
    //////////////////////////////////

    $scope.filterVisible = false;


    //$scope._filterConsts = {
    //    key: 'library',
    //    values: [
    //        { id: 'TypeId', value: $scope._type ? Number($scope._type) : -1 },
    //    ],

    //};

    //$scope.$on('FilterLoaded', function (event, prms) {
    //    $scope.$broadcast('initFilters', $scope._filterConsts);
    //});

   
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


    $scope.btn_register = {
        text: 'Registers',
        type: 'default',
        icon: 'airplane',
        width: 150,

        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            
            $rootScope.$broadcast('InitFlightPlanRegister', { Id:$scope.dg_selected.Id });
            
        }

    };
    $scope.IsApproveDisabled = true;
    $scope.btn_approve = {
        text: 'Approve Assigned Regsiters',
        type: 'default',
        icon: 'check',
        width: 300,
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

                    $scope.loadingVisible = true;
                    flightService.approvePlan70($scope.dg_selected.Id).then(function (response) {
                        $scope.IsApproveDisabled = true;
                        $scope.loadingVisible = false;
                        General.ShowNotify(Config.Text_SavedOk, 'success');
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

                if (!options.data.IsApproved70 || options.data.IsApproved70 == 0) {

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
        {
            dataField: "", caption: 'Assigned Registers',
            width: 200,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {
                //var elem = //
                var elem = "<div style='width:100%; text-align:center;position:absolute;top:0;left:0;line-height:30px;z-index:100'>" + options.data.RegisterAssignProgress + "%</div>" +
                    "<div style='width:" + (options.data.RegisterAssignProgress+0.5) + "%; position:absolute;top:-1px;left:0;height:30px;background:lightgreen'></div>";
                $("<div style='position:relative;width:100%;border:1px solid lightgreen;height:30px'>")
                    .append(elem)
                    .appendTo(container);
                

            },
            fixed: true, fixedPosition: 'left', alignment: 'center'
        },
      //  { dataField: 'Id', caption: 'No', allowResizing: true, dataType: 'number', allowEditing: false, width: 120, alignment: 'center', sortIndex: 1, sortOrder: "asc", fixed: true, fixedPosition: 'left' },
      //  { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left',  },
        { dataField: 'BaseIATA', caption: 'Base', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 150 },
        { dataField: 'BaseName', caption: 'Base Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', },
        { dataField: 'Types', caption: 'Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 200 },
        { dataField: 'IntervalType', caption: 'Interval', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 150 },
        { dataField: 'TotalFlights', caption: 'Flights', allowResizing: true, dataType: 'number', allowEditing: false, width: 100, alignment: 'center' },

        { dataField: 'DateFrom', caption: 'From', allowResizing: true, dataType: 'date', allowEditing: false, width: 200, alignment: 'center', fixed: true, fixedPosition: 'right' },
        { dataField: 'DateTo', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 200, fixed: true, fixedPosition: 'right' },
        // { dataField: 'DateActive', caption: 'Applied Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 200 },




    ];
    $scope.dg_height = $(window).height() - 135;

    $scope.dg_instance = null;
    $scope.dg_ds = null;
    $scope.dg = {
        masterDetail: {
            enabled: true,
            template: "detail"
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


        columns: $scope.dg_columns,
        onRowExpanding: function (e) {
            //  alert(e.key);
            
        },
        onContentReady: function (e) {
            if (!$scope.dg_instance)
                $scope.dg_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {

                $scope.dg_selected = null;
                $scope.IsApproveDisabled = true;

                $scope.IsApproveDisabled = true;
            }
            else {
                $scope.dg_selected = data;
                $scope.IsApproveDisabled = data.IsApproved70 == 1 || data.RegisterAssignProgress!=100;
                
            }


        },
       // height: '100%',
        bindingOptions: {
            dataSource: 'dg_ds', //'dg_employees_ds',
            // height: 'dg_employees_height'
            height: 'dg_height'
        }
    };
    $scope.dg_detail_ds = null;
    $scope.getDetailGridSettings = function (Id) {
        var detail_ds = null;
         var offset = -1 * (new Date()).getTimezoneOffset();
        //$scope.loadingVisible = true;
        //flightService.getFlightPlanItems(Id, offset).then(function (response) {
        //    $scope.loadingVisible = false;

        //    $.each(response, function (_i, _d) {
        //        _d.STA = (new Date(_d.STA)).addMinutes($scope.offset);
        //        _d.STD = (new Date(_d.STD)).addMinutes($scope.offset);
                

        //    });
        //    detail_ds = response;
            

        //}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        var setting = {
            scrolling: { mode: 'infinite' },
            paging: { pageSize: 100 },
            dataSource: {
                store: {
                    type: "odata",
                    url: $rootScope.serviceUrl + 'odata/flightplanitems/plan/' + Id + '/' + offset + '/',
                    key: "Id",
                    version: 4,
                    onLoaded: function (e) {
                       
                        //$.each(e, function (_i, _d) {
                        //    _d.STD = (new Date(_d.STD)).addMinutes(offset);
                        //    _d.STA = (new Date(_d.STA)).addMinutes(offset);
                        //});
                        //$rootScope.$broadcast('OnDataLoaded', null);
                    },
                   
                },
               
                sort: [{ getter: "DateFrom", desc: true }, 'BaseIATA', 'STD'],

            },

            columnAutoWidth: true,
            showBorders: true,
            columns: [
                { dataField: 'FlightNumber', caption: 'Flight No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },

                { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
                { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
                {
                    dataField: 'STD', caption: 'Departure', allowResizing: true, dataType: 'datetime', allowEditing: false, width: 130, alignment: 'center', format: 'HH:mm',

                },
                { dataField: 'STA', caption: 'Arrival', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 130, format: 'HH:mm' },
                { dataField: 'FlightH', caption: 'HH', allowResizing: true, dataType: 'number', allowEditing: false, width: 100, alignment: 'center', },
                { dataField: 'FlightM', caption: 'MM', allowResizing: true, dataType: 'number', allowEditing: false, width: 100, alignment: 'center', },
                { dataField: 'FlightType', caption: 'Flight Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 400 },
            ],

        };
        return setting;
    };
    ///////////////////////////
    $scope.bind = function () {
        var url = 'odata/flightplans/approved/customer/' + Config.CustomerId + '/' + $scope.typeId;
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
    $scope.getFlightsGantt = function () {

        $scope.loadingVisible = true;
        flightService.getFlightsGantt(Config.CustomerId).then(function (response) {
            $scope.loadingVisible = false;
            $scope.flightData = response;
            $.each($scope.flightData.flights, function (_i, _d) {
                _d.startDate = new Date(_d.startDate);
            });

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };

    //////////////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> Flight Plans';
        //  $('#resourceGantt').height($(window).height() - 45 - 100);

        $('.flightplansmaintenance').fadeIn(400, function () {
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
        console.log(prms);
         
        $scope.filters = prms;

        $scope.doRefresh = true;
        $scope.bind();
    });
    $scope.$on('onTemplateSearch', function (event, prms) {

        $scope.$broadcast('getFilterQuery', null);
    });
    $scope.$on('onRegisterAssigned', function (event, prms) {

        $scope.doRefresh = true;
    });
    $scope.$on('onFlightRegistersHide', function (event, prms) {

        $scope.bind();

    });
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

   
    //var data = [{ id: 1, name: 'vahid' }, { id: 2, name: 'atrina' }, { id: 3, name: 'navid' },];
    //var ditem = Enumerable.From( data).Where('$.id>1').ToArray();
    //ditem[0].name = 'ATI';
    //console.log('test stets sdf ssdf sdf sdf sdf sdf sdf ');
    //console.log(data);
    //console.log('---------------------------------');
    //console.log(ditem);




}]);