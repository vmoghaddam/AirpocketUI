app.controller('changeFlightRegisterController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'aircraftService', 'authService', 'notificationService', '$route', function ($scope, $location, $routeParams, $rootScope, flightService, aircraftService, authService, notificationService, $route) {
    $scope.prms = $routeParams.prms;
   
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
    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 120,
        validationGroup: 'changeregister',
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
    $scope.btn_deselectall = {
        text: '',
        type: 'default',
        icon: 'far fa-square',
        width: 40,


        onClick: function (e) {

            $scope.dg_flight_instance.deselectAll();
        }
    };
    $scope.btn_selectall = {
        text: '',
        type: 'default',
        icon: 'far fa-check-square',
        width: 40,


        onClick: function (e) {

            $scope.dg_flight_instance.selectAll();
        }
    };

    $scope.btn_register = {
        text: 'Change Register',
        type: 'default',
        icon: 'fas fa-plane',
        width: 200,


        onClick: function (e) {
            var selected = $rootScope.getSelectedRows($scope.dg_flight_instance);
            if (!selected || selected.length == 0) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            $scope.current_actype = $scope.dg_register_selected.AircraftType;
            $scope.current_register = $scope.dg_register_selected.Register;
            $scope.popup_register_visible = true;

        }
    };
    $scope.bind = function () {
        var dfrom = (new Date($scope.from)).toDateTimeDigits();
        var dto = (new Date($scope.to)).toDateTimeDigits();
        var key = {};
        if ($scope.dg_register_selected) {
            key.RegisterID = $scope.dg_register_selected.RegisterID;
            key.TypeId = $scope.dg_register_selected.TypeId;
        }


        $scope.loadingVisible = true;
        flightService.getFlightsGrouped(Config.CustomerId, dfrom, dto).then(function (response) {
            $scope.loadingVisible = false;
            var ds = new DevExpress.data.DataSource({
                store: {
                    type: "array",
                    key: ["TypeId", "RegisterID"],
                    data: response
                }
            });
            $scope.dg_register_instance.option('dataSource', ds);
            if (key.RegisterID) {
                var keys = [];
                keys.push(key);
                $scope.dg_register_instance.selectRows(keys, false);
            }


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.bindFlights = function (register) {
        var dfrom = (new Date($scope.from)).toDateTimeDigits();
        var dto = (new Date($scope.to)).toDateTimeDigits();



        $scope.loadingVisible = true;
        flightService.getFlightsByRegister(Config.CustomerId, -1, register, dfrom, dto).then(function (response) {
            $scope.loadingVisible = false;

            //$scope.dg_register_instance.option('dataSource', ds);
            //console.log(response);
            $.each(response, function (_i, _d) {
                _d.STD = new Date(_d.STD + '.000Z');
                _d.STA = new Date(_d.STA + '.000Z');

            });
            $scope.dg_flight_ds = response;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
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
    $scope.current_actype = null;
    $scope.current_register = null;
    $scope.txt_actype = {
        readOnly: true,
        bindingOptions: {
            value: 'current_actype',

        }
    };
    $scope.txt_register = {
        readOnly: true,
        bindingOptions: {
            value: 'current_register',

        }
    };
    $scope.new_register = null;
    $scope.ds_msn = [];
    $scope.selectedMsn = null;
    $scope.sb_msn = {

        showClearButton: true,
        width: '100%',
        searchEnabled: true,
        //itemTemplate: function (data) {
        //    return $rootScope.getSbTemplateAircraft(data);
        //},
        searchExpr: ['Register', 'MSN'],
        //dataSource: $scope.ds_msn,
        displayExpr: "Register",
        valueExpr: 'ID',
        onSelectionChanged: function (arg) {
            if (arg.selectedItem) {



            }

        },
        bindingOptions: {
            value: 'new_register',

            dataSource: 'ds_msn',
            selectedItem: 'selectedMsn'

        }
    };
    $scope.reason = null;
    $scope.sb_reason = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceOption(1153),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'reason',

        }
    };
    /////////////////////////////////
    $scope.from = null;
    $scope.date_from = {
        type: "date",
        width: '100%',

        bindingOptions: {
            value: 'from',

        }
    };
    $scope.to = null;
    $scope.date_to = {
        type: "date",
        width: '100%',

        bindingOptions: {
            value: 'to',

        }
    };

    /////////////////////////////////
    $scope.dg_register_selected = null;
    $scope.dg_register_columns = [
        { dataField: 'AircraftType', caption: 'AC Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150, groupIndex: 0, sortIndex: 0, sortOrder: "asc" },
        { dataField: 'Register', caption: 'Register', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, sortIndex: 1, sortOrder: "asc" },

        // { dataField: 'TotalFlights', caption: 'Flights', allowResizing: true, dataType: 'number', allowEditing: false, width: 100, alignment: 'center' },





    ];
    $scope.dg_register_height = 100;

    $scope.dg_register_instance = null;
    $scope.dg_register_ds = null;
    $scope.dg_register = {
        grouping: {
            autoExpandAll: true,
            allowCollapsing: true,
        },
        searchPanel: {
            visible: false
        },
        groupPanel: {
            visible: false
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
        height:$(window).height()-140,
        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,

        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,


        columns: $scope.dg_register_columns,
        onContentReady: function (e) {
            if (!$scope.dg_register_instance)
                $scope.dg_register_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {

                $scope.dg_register_selected = null;
                $scope.dg_flight_ds = null;


            }
            else {
                $scope.dg_register_selected = data;
                $scope.bindFlights(data.RegisterID);

            }


        },
         
        bindingOptions: {
            // dataSource: 'dg_register_ds', //'dg_employees_ds',
            // height: 'dg_employees_height'
        }
    };
    /////////////////////////////
    $scope.dg_flight_selected = null;

    $scope.dg_flight_columns = [
        {
            caption: 'Flights',
            columns: [
                //{ dataField: 'FlightStatus', caption: 'Status', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150, fixed: true, fixedPosition: 'left' },
                { dataField: 'ID', caption: 'ID', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, fixed: true, fixedPosition: 'left' },
                { dataField: 'FlightNumber', caption: 'Flight No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 180, },
                // { dataField: 'AircraftType', caption: 'AC Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150, },
                //{ dataField: 'Register', caption: 'Register', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },

                { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
                { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
                {
                    dataField: 'STD', caption: 'Departure', allowResizing: true, dataType: 'datetime', allowEditing: false, width: 170, alignment: 'center', format: 'yyyy-MM-dd HH:mm', sortIndex: 0, sortOrder: "asc"

                },
                { dataField: 'STA', caption: 'Arrival', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 170, format: 'yyyy-MM-dd HH:mm' },
                { dataField: 'FlightH', caption: 'Hour(s)', allowResizing: true, dataType: 'number', allowEditing: false, width: 100, alignment: 'center', },
                { dataField: 'FlightM', caption: 'Minute(s)', allowResizing: true, dataType: 'number', allowEditing: false, width: 100, alignment: 'center', },
                { dataField: 'FlightStatus', caption: 'Status', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 300 },


                //{ dataField: 'LinkedFlight', caption: 'Linked To', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 150, fixed: true, fixedPosition: 'right' },
                // { dataField: 'LinkedReasonTitle', caption: 'Reason', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200, fixed: true, fixedPosition: 'right' },


            ]
        },


    ];
    $scope.dg_flight_height = 100;

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
        columnFixing: {
            enabled: true
        },
        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 50 },
        showBorders: true,
        selection: { mode: 'multiple' },

        columnAutoWidth: false,


        columns: $scope.dg_flight_columns,
        onContentReady: function (e) {
            if (!$scope.dg_flight_instance)
                $scope.dg_flight_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {

            }
            else {

            }

        },
        summary: {
            totalItems: [{
                column: "ID",
                summaryType: "count"
            }]
        },
        height: $(window).height() - 140,
        bindingOptions: {
            dataSource: 'dg_flight_ds', //'dg_employees_ds',
            // height: 'dg_employees_height'
        }
    };
    //////////////////////////////
    ////////////////////////////////////
    $scope.popup_register_visible = false;
    $scope.popup_register_title = 'Set Register';
    $scope.popup_register = {

        fullScreen: false,
        showTitle: true,
        height: 450,
        width: 450,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'changeregisterset', onClick: function (e) {

                        var result = e.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        var selected = $rootScope.getSelectedRows($scope.dg_flight_instance);
                        var flights = Enumerable.From(selected).Select('$.ID').ToArray();
                        var entity = {

                            NewRegisterId: $scope.new_register,
                            UserId: $rootScope.userId,
                            UserName: $rootScope.userName,
                            ReasonId: $scope.reason,
                            Remark: null,
                            Flights: flights,
                            From: (new Date($scope.from)).toUTCDateTimeDigits(),
                            To: (new Date($scope.to)).toUTCDateTimeDigits(),
                            
                        };
                        $scope.loadingVisible = true;
                        flightService.saveFlightRegisterChange(entity).then(function (response) {
                            General.ShowNotify(Config.Text_SavedOk, 'success');
                            $scope.loadingVisible = false;
                            $scope.bind();
                            $scope.popup_register_visible = false;

                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                         
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_register_visible = false;
                    }
                }, toolbar: 'bottom'
            }
        ],

        visible: false,
        dragEnabled: true,
        closeOnOutsideClick: false,
        onShowing: function (e) {



        },
        onShown: function (e) {
            $scope.ds_msn = [];
            $scope.loadingVisible = true;

            aircraftService.getAvailableMSNsByType(Config.CustomerId, /*$scope.dg_register_selected.TypeId*/-1).then(function (response) {
                $scope.loadingVisible = false;

                $scope.ds_msn = response;



            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


        },
        onHiding: function () {


            // $scope.date_std = null;

            $scope.popup_register_visible = false;
            // $rootScope.$broadcast('onPersonHide', null);
        },
        bindingOptions: {
            visible: 'popup_register_visible',

            title: 'popup_register_title',

        }
    };
    //////////////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> Change Registers';
        //  $('#resourceGantt').height($(window).height() - 45 - 100);

        $('.changeregister').fadeIn(400, function () {
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




    $scope.$on('$viewContentLoaded', function () {


    });

    $rootScope.$broadcast('FlightLoaded', null);

}]);