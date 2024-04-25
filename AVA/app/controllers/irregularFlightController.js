'use strict';

app.controller('irregularFlightController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'weatherService', 'aircraftService', 'authService', 'notificationService', '$route', function ($scope, $location, $routeParams, $rootScope, flightService, weatherService, aircraftService, authService, notificationService, $route) {
    $scope.prms = $routeParams.prms;
    $scope.typeId = $route.current.type;

    $scope.IsEditVisible = $scope.typeId == 1;
    $scope.IsRegisterVisible = $scope.typeId == 2;
    $scope.IsReadOnly = $scope.typeId == 2;
    ///////////////////////////////////
    $scope.entity = {
        ID: null,

        FlightTypeID: null,
        FlightStatusID: null,


        FlightNumber: null,
        FromAirportId: null,
        ToAirportId: null,
        STD: null,
        STA: null,

        FlightH: null,
        FlightM: null,

        CustomerId: Config.CustomerId,

        DateCreate: null,

        RouteId: null,
        FromAirportIATA: null,
        FromAirportName: null,
        ToAirportName: null,
        ToAirportIATA: null,
        FromAirportCity: null,
        ToAirportCity: null,
        FromAirportCityId: null,
        ToAirportCityId: null,
        LinkedFlight: null,
        LinkedReason: null,
        LinkedRemark: null,
    };

    $scope.clearEntity = function () {
        $scope.entity.ID = -1;

        $scope.entity.FlightTypeID = null;
        $scope.entity.FlightStatusID = null;

        $scope.entity.FlightNumber = null;
        $scope.entity.FromAirportId = null;
        $scope.entity.ToAirportId = null;
        $scope.entity.STD = null;
        $scope.entity.STA = null;


        $scope.entity.CustomerId = Config.CustomerId;

        $scope.entity.DateCreate = null;

        $scope.entity.RouteId = null;
        $scope.start = null;
        $scope.entity.FromAirportName = null;
        $scope.entity.FromAirportIATA = null;
        $scope.entity.ToAirportName = null;
        $scope.entity.ToAirportIATA = null;
        $scope.entity.FromAirportCity = null;
        $scope.entity.ToAirportCity = null;
        $scope.entity.FromAirportCityId = null;
        $scope.entity.ToAirportCityId = null;
        $scope.entity.LinkedFlight = null;
        $scope.entity.LinkedReason = null;
        $scope.entity.LinkedRemark = null;
        $scope.link = null;
        $scope.linkEntity = {};
    };

    $scope.bindEntity = function (data, flight) {
        $scope.entity.ID = data.ID;

        $scope.entity.FlightTypeID = data.FlightTypeID;
        $scope.entity.FlightStatusID = data.FlightStatusID;

        $scope.entity.FlightNumber = data.FlightNumber;
        $scope.entity.FromAirportId = data.FromAirport;

        $scope.entity.ToAirportId = data.ToAirport;
        $scope.entity.STD = data.STD;
        $scope.entity.STA = data.STA;


        $scope.entity.CustomerId = data.CustomerId;

        $scope.entity.DateCreate = data.DateCreate;

        $scope.entity.RouteId = data.RouteId;
        $scope.start = data.start;
        $scope.entity.FromAirportName = data.FromAirportName;
        $scope.entity.FromAirportIATA = data.FromAirportIATA;
        $scope.entity.ToAirportName = data.ToAirportName;
        $scope.entity.ToAirportIATA = data.ToAirportIATA;
        $scope.entity.FromAirportCity = data.FromAirportCity;
        $scope.entity.ToAirportCity = data.ToAirportCity;
        $scope.entity.FromAirportCityId = data.FromAirportCityId;
        $scope.entity.ToAirportCityId = data.ToAirportCityId;
        $scope.entity.LinkedFlight = data.LinkedFlight;
        $scope.entity.LinkedReason = data.LinkedReason;
        $scope.entity.LinkedRemark = data.LinkedRemark;
        if ($scope.entity.LinkedFlight) {
            $scope.link = data.LinkedFlight;


            $scope.linkEntity = flight;
            $scope.link = flight.FlightNumber + ' (' + flight.ID + '), ' + flight.FlightStatus;

        }
    };


    //////////////////////////////////
    $scope.IsDisabled = false;
    $scope.setArrival = function () {

        if ($scope.entity.STD != null && $scope.entity.FlightH != null && $scope.entity.FlightM != null) {
            var std = new Date($scope.entity.STD);

            $scope.entity.STA = new Date(std.addHours($scope.entity.FlightH).addMinutes($scope.entity.FlightM));

        }
        else
            $scope.entity.STA = null;
    };
    $scope.tempToAirport = null;
    $scope.selectedFromAirport = null;
    $scope.selectedToAirport = null;
    $scope.sb_FromAirport = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceRoutesFromAirport(Config.AirlineId),
        itemTemplate: function (data) {
            return $rootScope.getSbTemplateAirport(data);
        },
        onSelectionChanged: function (arg) {
            // $scope.getAverageRouteTime();
            
            $scope.entity.ToAirport = null;
            if (!arg.selectedItem) {
                $scope.ds_toairport = [];
                $scope.entity.FromAirportIATA = null;
                return;
            }
            $scope.entity.FromAirportIATA = arg.selectedItem.IATA;
            $scope.loadingVisible = true;
            flightService.getRouteDestination(Config.AirlineId, arg.selectedItem.Id).then(function (response) {
                $scope.loadingVisible = false;
                $scope.ds_toairport = response;
                if ($scope.tempToAirport) {
                    $scope.entity.ToAirport = $scope.tempToAirport;
                    $scope.tempToAirport = null;
                }

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        },
        searchExpr: ["IATA", "Country", "SortName", "City"],
        displayExpr: "IATA",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity.FromAirportId',
            selectedItem: 'selectedFromAirport',
            readOnly: 'IsReadOnly',

        }
    };
    $scope.ds_toairport = [];
    $scope.sb_ToAirport = {
        showClearButton: true,
        searchEnabled: true,
        //dataSource: $rootScope.getDatasourceAirport(),
        itemTemplate: function (data) {
            return $rootScope.getSbTemplateRouteTo(data);
        },
        onSelectionChanged: function (arg) {
            // $scope.getAverageRouteTime();
            if (arg.selectedItem) {
                $scope.entity.RouteId = arg.selectedItem.Id;
                $scope.entity.FlightH = arg.selectedItem.FlightH;
                $scope.entity.FlightM = arg.selectedItem.FlightM;
                $scope.entity.ToAirportIATA = arg.selectedItem.ToAirportIATA;
            }
            else {
                $scope.entity.RouteId = null;
                $scope.entity.FlightH = null;
                $scope.entity.FlightM = null;
                $scope.entity.ToAirportIATA = null;
            }
            $scope.setArrival();
        },
        searchExpr: ["ToAirportIATA", "ToCity"],
        displayExpr: "ToAirportIATA",
        valueExpr: 'ToAirportId',
        bindingOptions: {
            value: 'entity.ToAirportId',
            selectedItem: 'selectedRoute',
            dataSource: 'ds_toairport',
            readOnly: 'IsReadOnly',

        }
    };

    $scope.selectedRoute = null;
    $scope.sb_route = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceRoutes(Config.AirlineId),
        itemTemplate: function (data) {
            return $rootScope.getSbTemplateRoute(data);
        },
        onSelectionChanged: function (arg) {
            if (arg.selectedItem) {
                $scope.entity.FromAirport = arg.selectedItem.FromAirportId;
                $scope.entity.ToAirport = arg.selectedItem.ToAirportId;
                $scope.entity.FlightH = arg.selectedItem.FlightH;
                $scope.entity.FlightM = arg.selectedItem.FlightM;
            }
            else {
                $scope.entity.FromAirport = null;
                $scope.entity.ToAirport = null;
                $scope.entity.FlightH = null;
                $scope.entity.FlightM = null;
            }
            $scope.setArrival();
        },
        searchExpr: ["FromAirportIATA", "FromCity"],
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity.RouteId',
            selectedItem: 'selectedRoute',

        }
    };
    $scope.start = null;
    $scope.time_start = {
        type: "datetime",
        width: '100%',
        //pickerType: 'rollers',
        interval: 15,
        onValueChanged: function (arg) {


            //if (arg.value) {

            //    $scope.entity.STD = arg.value;

            //}
            //else
            //    $scope.entity.STD = null;
            $scope.setArrival();
        },
        bindingOptions: {
            value: 'entity.STD',
            disabled: 'IsDisabled',
            readOnly: 'IsReadOnly',
        }
    };
    $scope.time_end = {
        readOnly: true,
        type: "datetime",
        width: '100%',

        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: 'entity.STA',
            disabled: 'IsDisabled',
            readOnly: 'IsReadOnly',
        }
    };
    $scope.text_flighth = {
        min: 0,
        onValueChanged: function (arg) {
            $scope.setArrival();
        },
        bindingOptions: {
            value: 'entity.FlightH',
            disabled: 'IsDisabled',
            readOnly: 'IsReadOnly',
        }
    };
    $scope.text_flightm = {
        min: 0,
        max: 59,
        onValueChanged: function (arg) {
            $scope.setArrival();
        },
        bindingOptions: {
            value: 'entity.FlightM',
            disabled: 'IsDisabled',
            readOnly: 'IsReadOnly',
        }
    };
    $scope.text_flightnumber = {

        bindingOptions: {
            value: 'entity.FlightNumber',
            disabled: 'IsDisabled',
            readOnly: 'IsReadOnly',
        }
    };
    $scope.sb_flighttype = {

        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceOption(108),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity.FlightTypeID',
            disabled: 'IsDisabled',
            readOnly: 'IsReadOnly',
        }
    };
    $scope.link = null;
    $scope.linkEntity = {};
    $scope.txt_link = {
        readOnly: true,
        bindingOptions: {
            value: 'link',

        }
    };
    $scope.txt_LinkedRemark = {

        bindingOptions: {
            value: 'entity.LinkedRemark',
            disabled: 'link==null',

        }
    };
    $scope.sb_LinkedReason = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceOption(1132),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity.LinkedReason',
            disabled: 'link==null',
        }
    };

    $scope.date_std = null;
    $scope.date_std_select = {
        type: "date",
        width: '100%',

        bindingOptions: {
            value: 'date_std',

        }
    };
    //////////////////////////////////
    $scope.filterVisible = false;



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


    $scope.IsApproveDisabled = false;
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
                        $scope.IsApproveDisabled = false;
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
            $scope.popup_item_visible = true;
            //$scope.loadingVisible = true;
            //flightService.getFlightPlanView($scope.dg_selected.Id).then(function (response) {
            //    $scope.loadingVisible = false;
            //    $scope.tempData = response;
            //    $scope.popup_add_visible = true;
            //}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        }

    };
    $scope.btn_new = {
        text: 'New',
        type: 'default',
        icon: 'plus',
        width: 120,
        bindingOptions: { visible: 'IsEditVisible' },
        onClick: function (e) {
            $scope.entity.ID = -1;

            $scope.popup_item_visible = true;

        }

    };
    $scope.btn_link = {
        text: 'Link',
        type: 'default',
        icon: 'fas fa-link',
        width: 120,
        bindingOptions: { visible: 'IsEditVisible' },
        onClick: function (e) {
            $scope.entity.ID = -1;
            $scope.IsDisabled = true;
            $scope.popup_link_visible = true;

        }

    };
    $scope.btn_edit = {
        text: 'Edit',
        type: 'default',
        icon: 'edit',
        width: 120,

        bindingOptions: { visible: 'IsEditVisible' },
        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            if ($scope.dg_selected.LinkedFlight) {
                $scope.loadingVisible = true;
                flightService.getFlight($scope.dg_selected.LinkedFlight).then(function (response) {
                    $scope.loadingVisible = false;

                    $scope.bindEntity($scope.dg_selected, response);
                    $scope.popup_link_visible = true;

                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            }
            else {
                $scope.bindEntity($scope.dg_selected, null);
                $scope.popup_item_visible = true;
            }







        }

    };

    $scope.btn_register = {
        text: 'Register',
        type: 'default',
        icon: 'fas fa-plane',
        width: 150,

        bindingOptions: { visible: 'IsRegisterVisible' },
        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            $scope.entity_register.FlightId = $scope.dg_selected.ID;
            $scope.bind_entity_register($scope.dg_selected);
            if ($scope.dg_selected.LinkedFlight) {
                $scope.loadingVisible = true;
                flightService.getFlight($scope.dg_selected.LinkedFlight).then(function (response) {
                    $scope.loadingVisible = false;

                    $scope.bindEntity($scope.dg_selected, response);

                    $scope.popup_register_visible = true;

                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            }
            else {
                $scope.bindEntity($scope.dg_selected, null);
                $scope.popup_register_visible = true;
            }







        }

    };

    $scope.IsApproveVisible = false;
    $scope.btn_approve = {
        text: 'Approve',
        type: 'default',
        icon: 'check',
        width: 150,
        bindingOptions: {
            visible: 'IsApproveVisible'
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
                    flightService.saveFlightAppy($scope.dg_selected.ID).then(function (response) {
                        $scope.loadingVisible = false;
                        General.ShowNotify(Config.Text_SavedOk, 'success');
                        $scope.doRefresh = true;
                        $scope.bind();



                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                }
            });


        }

    };


    $scope.btn_delete = {
        text: 'Delete',
        type: 'danger',
        icon: 'clear',
        width: 120,
        bindingOptions: { visible: 'IsEditVisible' },
        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }

            //General.Confirm(Config.Text_DeleteConfirm, function (res) {
            //    if (res) {

            //        var dto = { Id: $scope.dg_selected.Id, };
            //        $scope.loadingVisible = true;
            //        airportService.delete(dto).then(function (response) {
            //            $scope.loadingVisible = false;
            //            General.ShowNotify(Config.Text_SavedOk, 'success');
            //            $scope.doRefresh = true;
            //            $scope.bind();



            //        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            //    }
            //});
        }
    };
    $scope.moment = function (date) {
        if (!date)
            return "";
        return moment(date).format('MM-DD-YYYY HH:mm');
    };
    $scope.btn_select = {
        text: '',
        type: 'default',
        icon: 'airplane',
        width: 50,
        onClick: function (e) {


            $scope.popup_select_visible = true;

        }

    };
    $scope.btn_select_remove = {
        text: '',
        type: 'danger',
        icon: 'close',
        width: 50,
        onClick: function (e) {
            $scope.entity.LinkedFlight = null;
            $scope.entity.LinkedReason = null;
            $scope.entity.LinkedRemark = null;
            $scope.link = null;
            $scope.linkEntity = {};
            $scope.IsDisabled = false;

        }

    };
    $scope.btn_select_search = {
        text: '',
        type: 'default',
        icon: 'search',
        validationGroup: 'irrflightselect',
        width: 40,
        onClick: function (e) {
            var result = e.validationGroup.validate();

            if (!result.isValid) {
                General.ShowNotify(Config.Text_FillRequired, 'error');
                return;
            }
            $scope.dg_flight_ds = null;
            var datestr = (new Date($scope.date_std)).toDateTimeDigits();
            $scope.loadingVisible = true;
            flightService.getFlightsAbnormal(Config.CustomerId, -1, datestr).then(function (response) {
                $scope.loadingVisible = false;
                $.each(response, function (_i, _d) {
                    _d.STD = new Date(_d.STD + '.000Z');
                    _d.STA = new Date(_d.STA + '.000Z');
                    if (_d.ChocksOut)
                        _d.ChocksOut = new Date(_d.ChocksOut + '.000Z');
                    if (_d.ChocksIn)
                        _d.ChocksIn = new Date(_d.ChocksIn + '.000Z');
                    if (_d.Takeoff)
                        _d.Takeoff = new Date(_d.Takeoff + '.000Z');
                    if (_d.Landing)
                        _d.Landing = new Date(_d.Landing + '.000Z');
                });
                $scope.dg_flight_ds = response;

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



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
    $scope.popup_item_visible = false;
    $scope.popup_item_title = 'Add';
    $scope.popup_item = {

        fullScreen: false,
        showTitle: true,
        height: 380,
        width: 600,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'irrflight', onClick: function (e) {

                        //cmnt save flight
                        var result = e.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }


                        if ($scope.entity.FlightH == 0 && $scope.entity.FlightM == 0) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }

                        if ($scope.entity.ID == -1)
                            $scope.entity.FlightStatusID = 1;
                        $scope.entity.STD = (new Date($scope.entity.STD)).toUTCString();
                        $scope.entity.STA = (new Date($scope.entity.STA)).toUTCString();
                        console.log($scope.entity.FlightStatusID);
                        $scope.entity.FlightStatus = Flight.getStatus($scope.entity.FlightStatusID).title;

                       
                        $scope.loadingVisible = true;
                        flightService.saveFlight($scope.entity).then(function (response) {

                            $scope.clearEntity();


                            General.ShowNotify(Config.Text_SavedOk, 'success');


                            $scope.loadingVisible = false;


                            $rootScope.$broadcast('onFlightSaved', null);

                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });




                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_item_visible = false;
                    }
                }, toolbar: 'bottom'
            }
        ],

        visible: false,
        dragEnabled: true,
        closeOnOutsideClick: false,
        onShowing: function (e) {

            $scope.IsDisabled = false;

        },
        onShown: function (e) {


        },
        onHiding: function () {


            $scope.clearEntity();
            //$scope.expose = {
            //    BookId: null,
            //    SMS: true,
            //    Email: true,
            //    AppNotification: true,
            //    CustomerId: Config.CustomerId,
            //};
            $scope.popup_item_visible = false;
            $rootScope.$broadcast('onFlightHide', null);
        },
        bindingOptions: {
            visible: 'popup_item_visible',

            title: 'popup_item_title',

        }
    };

    $scope.popup_link_visible = false;
    $scope.popup_link_title = 'Link';
    $scope.popup_link = {

        fullScreen: false,
        showTitle: true,
        height: 630,
        width: 700,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'irrlink', onClick: function (e) {

                        //cmnt save flight
                        var result = e.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }


                        if ($scope.entity.FlightH == 0 && $scope.entity.FlightM == 0) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }

                        if ($scope.entity.ID == -1)
                            $scope.entity.FlightStatusID = 1;
                        $scope.entity.STD = (new Date($scope.entity.STD)).toUTCString();
                        $scope.entity.STA = (new Date($scope.entity.STA)).toUTCString();
                        console.log($scope.entity.FlightStatusID);
                        $scope.entity.FlightStatus = Flight.getStatus($scope.entity.FlightStatusID).title;

                        console.log($scope.entity);
                        $scope.loadingVisible = true;
                        flightService.saveFlight($scope.entity).then(function (response) {

                            $scope.clearEntity();


                            General.ShowNotify(Config.Text_SavedOk, 'success');


                            $scope.loadingVisible = false;


                            $rootScope.$broadcast('onFlightSaved', null);

                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });




                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_link_visible = false;
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


        },
        onHiding: function () {


            $scope.clearEntity();
            //$scope.expose = {
            //    BookId: null,
            //    SMS: true,
            //    Email: true,
            //    AppNotification: true,
            //    CustomerId: Config.CustomerId,
            //};
            $scope.popup_link_visible = false;
            $rootScope.$broadcast('onFlightHide', null);
        },
        bindingOptions: {
            visible: 'popup_link_visible',

            title: 'popup_link_title',

        }
    };


    $scope.popup_register_visible = false;
    $scope.popup_register_title = 'Set Register';
    $scope.popup_register = {

        fullScreen: false,
        showTitle: true,
        height: 630,
        width: 700,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'irrregister', onClick: function (e) {

                        //cmnt save flight
                        var result = e.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }


                        $scope.loadingVisible = true;
                        flightService.saveFlightRegister($scope.entity_register).then(function (response) {




                            General.ShowNotify(Config.Text_SavedOk, 'success');


                            $scope.loadingVisible = false;

                            $scope.clear_entity_register();
                            $rootScope.$broadcast('onFlightSaved', null);
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


        },
        onHiding: function () {


            $scope.clearEntity();
            //$scope.expose = {
            //    BookId: null,
            //    SMS: true,
            //    Email: true,
            //    AppNotification: true,
            //    CustomerId: Config.CustomerId,
            //};
            $scope.popup_register_visible = false;
            $rootScope.$broadcast('onFlightHide', null);
        },
        bindingOptions: {
            visible: 'popup_register_visible',

            title: 'popup_register_title',

        }
    };


    $scope.getRoute = function () {
        if ($scope.entity.FromAirportId && $scope.entity.ToAirportId) {
            $scope.loadingVisible = true;
            flightService.getRoute($scope.entity.FromAirportId, $scope.entity.ToAirportId).then(function (response) {

                if (response) {
                    $scope.entity.FlightH = response.FlightH;
                    $scope.entity.FlightM = response.FlightM;
                }
                $scope.loadingVisible = false;
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        }
    };
    $scope.sb_link_fromairport = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceAirport(),
        itemTemplate: function (data) {
            return $rootScope.getSbTemplateAirport(data);
        },
        onSelectionChanged: function (arg) {
            //if (arg.selectedItem)
            //    $scope.entity_redirect.ToAirportIATA = arg.selectedItem.IATA;
            //else $scope.entity_redirect.ToAirportIATA = null;
            $scope.getRoute();
        },
        searchExpr: ["IATA", "Country", "SortName", "City"],
        displayExpr: "IATA",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity.FromAirportId',
            //selectedItem: 'entity_redirect.Airport',
            disabled: 'IsDisabled',
            readOnly: 'IsReadOnly',
        }
    };
    $scope.sb_link_toairport = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceAirport(),
        itemTemplate: function (data) {
            return $rootScope.getSbTemplateAirport(data);
        },
        onSelectionChanged: function (arg) {
            //if (arg.selectedItem)
            //    $scope.entity_redirect.ToAirportIATA = arg.selectedItem.IATA;
            //else $scope.entity_redirect.ToAirportIATA = null;
            $scope.getRoute();
        },
        searchExpr: ["IATA", "Country", "SortName", "City"],
        displayExpr: "IATA",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity.ToAirportId',
            // selectedItem: 'entity_redirect.Airport',
            disabled: 'IsDisabled',
            readOnly: 'IsReadOnly',
        }
    };

    $scope.entity_register = {
        FlightId: null,
        TypeId: null,
        RegisterId: null,
    };
    $scope.clear_entity_register = function () {
        $scope.entity_register.FlightId = null;
        $scope.entity_register.TypeId = null;
        $scope.entity_register.RegisterId = null;
    };
    $scope.bind_entity_register = function (data) {
        $scope.entity_register.FlightId = data.ID;
        $scope.entity_register.TypeId = data.TypeId;
        $scope.entity_register.RegisterId = data.RegisterID;
    };
    $scope.selectedType = null;
    $scope.sb_type = {

        showClearButton: true,
        width: '100%',
        searchEnabled: true,
        itemTemplate: function (data) {
            return $rootScope.getSbTemplateAircraft(data);
        },
        searchExpr: ['Type', 'Manufacturer'],
        dataSource: $rootScope.getDatasourceAircrafts(),
        displayExpr: "Type",
        valueExpr: 'Id',

        onSelectionChanged: function (arg) {
            $scope.ds_msn = [];
            $scope.msn_readOnly = true;
            if (arg && arg.selectedItem) {
                aircraftService.getAvailableMSNsByType(Config.CustomerId, arg.selectedItem.Id).then(function (response) {

                    $scope.msn_readOnly = false;
                    $scope.ds_msn = response;



                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            }
            else {
                $scope.msn_readOnly = true;
                $scope.ds_msn = [];
            }
        },
        bindingOptions: {
            value: 'entity_register.TypeId',
            selectedItem: 'selectedType',


        }
    };

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
            if (arg.selectedItem && $scope.IsNew == true) {

                var last = Flight.getLastFlight(vmins.datasource(), arg.selectedItem.ID);
                if (last) {
                    $scope.entity.FromAirport = last.ToAirport;
                    $scope.entity.ToAirport = null;
                    $scope.entity.STD = new Date(last.STA);
                    $scope.start = new Date($scope.entity.STD);
                }


            }

        },
        bindingOptions: {
            value: 'entity_register.RegisterId',

            dataSource: 'ds_msn',
            selectedItem: 'selectedMsn'

        }
    };
    ////////////////////////////////////
    $scope.popup_select_visible = false;
    $scope.popup_select_title = 'Select Flight';
    $scope.popup_select = {

        fullScreen: true,
        showTitle: true,
        height: 480,
        width: 600,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Select', icon: 'check', onClick: function (e) {

                        $scope.dg_flight_selected = $rootScope.getSelectedRow($scope.dg_flight_instance);
                        if (!$scope.dg_flight_selected) {
                            General.ShowNotify(Config.Text_NoRowSelected, 'error');
                            return;
                        }
                        $scope.entity.LinkedFlight = $scope.dg_flight_selected.ID;
                        $scope.linkEntity = $scope.dg_flight_selected;
                        $scope.link = $scope.dg_flight_selected.FlightNumber + ' (' + $scope.dg_flight_selected.ID + '), ' + $scope.dg_flight_selected.FlightStatus;
                        $scope.IsDisabled = false;
                        $scope.popup_select_visible = false;





                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_select_visible = false;
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


        },
        onHiding: function () {


            // $scope.date_std = null;

            $scope.popup_select_visible = false;
            // $rootScope.$broadcast('onPersonHide', null);
        },
        bindingOptions: {
            visible: 'popup_select_visible',

            title: 'popup_select_title',

        }
    };


    ////////////////////////////////////


    $scope.dg_height_full = 100;
    $scope.scroll_height_full = 400;



    /////////////////////////////////
    $scope.dg_selected = null;
    
    $scope.dg_columns = [
        {

            dataField: "IsActive", caption: '',
            width: 55,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {
                if (options.value)
                    $("<div>")
                        .append("<i style='font-size:22px;color:#2196F3' class='icon ion-md-checkmark-circle'></i>")
                        .appendTo(container);
                else
                    $("<div>")
                        .append("<i style='font-size:22px;color:#eee' class='icon ion-md-checkmark-circle'></i>")
                        .appendTo(container);



            },
            fixed: true, fixedPosition: 'left',
        },
        {

            dataField: "Register", caption: '',
            width: 55,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {
                if (options.value)
                    $("<div>")
                        .append("<i style='font-size:22px;color:green' class='fas fa-plane'></i>")
                        .appendTo(container);
                else
                    $("<div>")
                        .append("<i style='font-size:22px;color:#eee' class='fas fa-plane'></i>")
                        .appendTo(container);



            },
            fixed: true, fixedPosition: 'left',
        },
        {

            dataField: "LinkedFlight", caption: '',
            width: 55,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {
                if (options.value)
                    $("<div>")
                        .append("<i style='font-size:22px;color:#2196F3' class='fas fa-link'></i>")
                        .appendTo(container);
                else
                    $("<div>")
                        .append("<i style='font-size:22px;color:#eee' class='fas fa-link'></i>")
                        .appendTo(container);



            },
            fixed: true, fixedPosition: 'left',
        },
        {

            dataField: "FlightStatusID", caption: '',
            width: 55,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {
                var st = Flight.getStatus(options.value);
                var color = st.bgcolor;
                var str = ''; //options.data.FlightStatus;
                // str = '';
                switch (options.value) {
                    case 1:

                        $("<div>")
                            .append('<i class="fas fa-calendar-day" style="color:' + 'lightgray' + ';font-size:16px"></i><span style="display:inlline-block;padding-left:5px;font-size:12px">' + str + '</span>')
                            .appendTo(container);
                        break;
                    case 14:

                        $("<div>")
                            .append('<i class="far fa-square" style="color:' + color + ';font-size:16px"></i><span style="display:inlline-block;padding-left:5px;font-size:12px">' + str + '</span>')
                            .appendTo(container);
                        break;
                    case 2:

                        $("<div>")
                            .append('<i class="fas fa-plane-departure" style="color:' + color + ';font-size:16px"></i><span style="display:inlline-block;padding-left:5px;font-size:12px">' + str + '</span>')
                            .appendTo(container);
                        break;
                    case 3:

                        $("<div>")
                            .append('<i class="fas fa-plane-arrival" style="color:' + color + ';font-size:16px"></i><span style="display:inlline-block;padding-left:5px;font-size:12px">' + str + '</span>')
                            .appendTo(container);
                        break;
                    case 15:

                        $("<div>")
                            .append('<i class="fas fa-square" style="color:' + color + ';font-size:16px"></i><span style="display:inlline-block;padding-left:5px;font-size:12px">' + str + '</span>')
                            .appendTo(container);
                        break;
                    case 7:

                        $("<div>")
                            .append('<i class="fas fa-level-down-alt" style="color:' + color + ';font-size:16px"></i><span style="display:inlline-block;padding-left:5px;font-size:12px">' + str + '</span>')
                            .appendTo(container);
                        break;
                    case 17:

                        $("<div>")
                            .append('<i class="fas fa-random" style="color:' + color + ';font-size:16px"></i><span style="display:inlline-block;padding-left:5px;font-size:12px">' + str + '</span>')
                            .appendTo(container);
                        break;
                    default:
                        break;
                }


            },
            fixed: true, fixedPosition: 'left',
        },
        //{ dataField: 'FlightStatus', caption: 'Status', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150, fixed: true, fixedPosition: 'left' },
        { dataField: 'ID', caption: 'ID', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, fixed: true, fixedPosition: 'left' },
        { dataField: 'FlightNumber', caption: 'Flight No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 180, },
        { dataField: 'AircraftType', caption: 'AC Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150, },
        { dataField: 'Register', caption: 'Register', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },

        { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        {
            dataField: 'STD', caption: 'Departure', allowResizing: true, dataType: 'datetime', allowEditing: false, width: 170, alignment: 'center', format: 'yyyy-MM-dd HH:mm',

        },
        { dataField: 'STA', caption: 'Arrival', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 170, format: 'yyyy-MM-dd HH:mm' },
        { dataField: 'FlightH', caption: 'Hour(s)', allowResizing: true, dataType: 'number', allowEditing: false, width: 100, alignment: 'center', },
        { dataField: 'FlightM', caption: 'Minute(s)', allowResizing: true, dataType: 'number', allowEditing: false, width: 100, alignment: 'center', },
        { dataField: 'FlightType', caption: 'Flight Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 300 },


        { dataField: 'LinkedFlight', caption: 'Linked To', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 150, fixed: true, fixedPosition: 'right' },
        { dataField: 'LinkedReasonTitle', caption: 'Reason', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200, fixed: true, fixedPosition: 'right' },



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
        paging: { pageSize: 50 },
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

                $scope.IsApproveVisible = false;
                $scope.dg_selected = null;
                $scope.IsDetailsVisible = false;
                $scope.flight = {};
                $scope.dg_delay_ds = null;
               

            }
            else {
                $scope.dg_selected = data;
                $scope.flight = data;
                $scope.IsApproveVisible = $scope.typeId == 1 && !data.IsActive && data.RegisterID;
                

            }


        },
        height: '100%',
        bindingOptions: {
            dataSource: 'dg_ds', //'dg_employees_ds',
            // height: 'dg_employees_height'
        }
    };

    ////////////////////////////////
    $scope.dg_flight_selected = null;
    $scope.dg_flight_columns = [
        {
            dataField: "delay1", caption: '',
            width: 50,
            allowFiltering: false,
            allowSorting: false,
            alignment: 'center',
            cellTemplate: function (container, options) {
                var color = 'lightgray';
                if (options.data.FlightStatusID > 1) {

                    if (options.data.DelayOffBlock > 0 || options.data.DelayOnBlock > 0)
                        color = '#e51400';
                    else
                        color = '#60a917';
                }
                $("<div>")
                    .append('<i class="fas fa-clock" style="color:' + color + ';font-size:16px"></i>')
                    .appendTo(container);
            },
            fixed: true, fixedPosition: 'left',
        },
        {
            dataField: "FlightStatusID", caption: '',
            width: 150,
            allowFiltering: false,
            allowSorting: false,
            alignment: 'center',
            cellTemplate: function (container, options) {
                /*if (options.value == 12)
                    $("<div>")
                        .append("<i style='font-size:22px;color:#2196F3' class='icon ion-md-add-circle'></i>")
                        .appendTo(container);
                if (options.value == 13)
                    $("<div>")
                        .append("<i style='font-size:22px;color:#4CAF50' class='icon ion-md-create'></i>")
                        .appendTo(container);
                if (options.value == 10)
                    $("<div>")
                        .append("<i style='font-size:22px;color:#f44336' class='icon ion-md-shuffle'></i>")
                        .appendTo(container);
                if (options.value == 11)
                    $("<div>")
                        //.append("<img style='width:24px' src='../../content/images/" + "gap" + ".png' />")
                        .append("<i style='font-size:22px;color:#ff5722' class='icon ion-md-code-working'></i>")
                        .appendTo(container);
                   */
                var st = Flight.getStatus(options.value);
                var color = st.bgcolor;
                var str = options.data.FlightStatus;
                // str = '';
                switch (options.value) {
                    case 1:

                        $("<div>")
                            .append('<i class="fas fa-calendar-day" style="color:' + 'lightgray' + ';font-size:16px"></i><span style="display:inlline-block;padding-left:5px;font-size:12px">' + str + '</span>')
                            .appendTo(container);
                        break;
                    case 14:

                        $("<div>")
                            .append('<i class="far fa-square" style="color:' + color + ';font-size:16px"></i><span style="display:inlline-block;padding-left:5px;font-size:12px">' + str + '</span>')
                            .appendTo(container);
                        break;
                    case 2:

                        $("<div>")
                            .append('<i class="fas fa-plane-departure" style="color:' + color + ';font-size:16px"></i><span style="display:inlline-block;padding-left:5px;font-size:12px">' + str + '</span>')
                            .appendTo(container);
                        break;
                    case 3:

                        $("<div>")
                            .append('<i class="fas fa-plane-arrival" style="color:' + color + ';font-size:16px"></i><span style="display:inlline-block;padding-left:5px;font-size:12px">' + str + '</span>')
                            .appendTo(container);
                        break;
                    case 15:

                        $("<div>")
                            .append('<i class="fas fa-square" style="color:' + color + ';font-size:16px"></i><span style="display:inlline-block;padding-left:5px;font-size:12px">' + str + '</span>')
                            .appendTo(container);
                        break;
                    case 7:

                        $("<div>")
                            .append('<i class="fas fa-level-down-alt" style="color:' + color + ';font-size:16px"></i><span style="display:inlline-block;padding-left:5px;font-size:12px">' + str + '</span>')
                            .appendTo(container);
                        break;
                    case 17:

                        $("<div>")
                            .append('<i class="fas fa-random" style="color:' + color + ';font-size:16px"></i><span style="display:inlline-block;padding-left:5px;font-size:12px">' + str + '</span>')
                            .appendTo(container);
                        break;
                    case 4:

                        $("<div>")
                            .append('<i class="fas fa-ban" style="color:' + color + ';font-size:16px"></i><span style="display:inlline-block;padding-left:5px;font-size:12px">' + str + '</span>')
                            .appendTo(container);
                        break;
                    default:
                        break;
                }

            },
            fixed: true, fixedPosition: 'left',
        },
        //{ dataField: 'AircraftType', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90,  },

        {
            caption: 'Aircraft', columns: [
                { dataField: 'Register', caption: 'Register', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90 },
                { dataField: 'AircraftType', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90 },
            ]
        },
        { dataField: 'ID', caption: 'ID', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, fixed: true, fixedPosition: 'left' },
        { dataField: 'FlightTypeAbr', caption: '', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 70, fixed: true, fixedPosition: 'left' },
        { dataField: 'FlightNumber', caption: 'Flight No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 110, fixed: true, fixedPosition: 'left' },

        {
            caption: 'Airports', columns: [
                { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90 },
                { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90 },
            ]
        },
        {
            caption: 'Duration', columns: [
                { dataField: 'ActualFlightHOffBlock', caption: 'Hour(s)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90 },
                { dataField: 'ActualFlightMOffBlock', caption: 'Minute(s)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90 },
            ]
        },
        {
            caption: 'Departure',
            columns: [
                { dataField: 'STD', caption: 'Scheduled Dep.', allowResizing: true, dataType: 'datetime', allowEditing: false, width: 170, alignment: 'center', format: 'yyyy-MMM-dd, HH:mm', sortIndex: 0, sortOrder: "desc" },
                { dataField: 'ChocksOut', caption: 'Off Block', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 170, format: 'yyyy-MMM-dd, HH:mm' },
                { dataField: 'Takeoff', caption: 'Departed', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 170, format: 'yyyy-MMM-dd, HH:mm' },

            ]
        },
        {
            caption: 'Arrival',
            columns: [
                { dataField: 'STA', caption: 'Scheduled Arr.', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 170, format: 'yyyy-MMM-dd, HH:mm' },

                { dataField: 'Landing', caption: 'Arrived', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 170, format: 'yyyy-MMM-dd, HH:mm' },
                { dataField: 'ChocksIn', caption: 'On Block', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 170, format: 'yyyy-MMM-dd, HH:mm' },
            ]
        },
        // { dataField: 'FlightH', caption: 'Hour(s)', allowResizing: true, dataType: 'number', allowEditing: false, width: 100, alignment: 'center', },
        // { dataField: 'FlightM', caption: 'Minute(s)', allowResizing: true, dataType: 'number', allowEditing: false, width: 100, alignment: 'center', },

        // { dataField: 'FlightStatus', caption: 'Status', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150, fixed: false, fixedPosition: 'right' },

        {
            caption: 'Delays', fixed: true, fixedPosition: 'right', columns: [
                { dataField: 'DelayOffBlock', caption: 'Dep.', allowResizing: true, dataType: 'number', allowEditing: false, width: 100, alignment: 'center', name: 'delay', },
                { dataField: 'DelayOnBlock', caption: 'Arr.', allowResizing: true, dataType: 'number', allowEditing: false, width: 100, alignment: 'center', name: 'delayLanding', },

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
        selection: { mode: 'single' },

        columnAutoWidth: false,


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
            else {
                $scope.dg_flight_selected = data;




            }


        },
        height: function () {
            return window.innerHeight - 190;
        },
        bindingOptions: {
            dataSource: 'dg_flight_ds', //'dg_employees_ds',
            // height: 'dg_employees_height'
        }
    };


    ///////////////////////////
    $scope.bind = function () {
        //odata/flights/{cid}/{airport?}
        var url = 'odata/flights/irregular/' + Config.CustomerId + '/' + ($scope.airport ? $scope.airportEntity.Id : '-1');
        if (!$scope.dg_ds && $scope.doRefresh) {

            $scope.dg_ds = {
                store: {
                    type: "odata",
                    url: $rootScope.serviceUrl + url,
                    key: "ID",
                    version: 4,
                    onLoading: function (e) {

                    },
                    onLoaded: function (e) {
                        // $scope.loadingVisible = false;
                        //console.log(e);
                        $.each(e, function (_i, _d) {
                            _d.STD = new Date(_d.STD + '.000Z');
                            _d.STA = new Date(_d.STA + '.000Z');
                            if (_d.ChocksOut)
                                _d.ChocksOut = new Date(_d.ChocksOut + '.000Z');
                            if (_d.ChocksIn)
                                _d.ChocksIn = new Date(_d.ChocksIn + '.000Z');
                            if (_d.Takeoff)
                                _d.Takeoff = new Date(_d.Takeoff + '.000Z');
                            if (_d.Landing)
                                _d.Landing = new Date(_d.Landing + '.000Z');
                        });
                        //  console.log(e);
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
                sort: [{ getter: "ID", desc: false }],

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
        $rootScope.page_title = '> Irregular Flights';
        //  $('#resourceGantt').height($(window).height() - 45 - 100);

        $('.irrflights').fadeIn(400, function () {
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
    $scope.$on('onFlightSaved', function (event, prms) {

        $scope.doRefresh = true;

    });
    $scope.$on('onFlightHide', function (event, prms) {

        $scope.bind();

    });
    //////////////////////////////////////////
    //ko.applyBindings(dataView);
    $scope.$on('$viewContentLoaded', function () {



    });
    $rootScope.$broadcast('FlightLoaded', null);





}]);