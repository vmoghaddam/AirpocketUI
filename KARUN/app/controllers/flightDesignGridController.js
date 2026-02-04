'use strict';
app.controller('flightDesignGridController', ['$scope', '$location', 'flightService', 'aircraftService', 'authService', '$routeParams', '$rootScope', function ($scope, $location, flightService, aircraftService, authService, $routeParams, $rootScope) {
    $scope.taskIndex = 1000000;
    $scope.Day0 = "01/31/2019";
    $scope.Day1 = "02/01/2019";
    $scope.Day2 = "02/02/2019 23:59:00.000";

    $scope.entity = {
        Id: -1,

        FlightPlanId: null,
        TypeId: null,
        RegisterID: null,
        FlightTypeID: null,
        AirlineOperatorsID: null,
        FlightNumber: null,
        FromAirport: null,
        ToAirport: null,
        STA: null,
        STD: null,
        FlightH: null,
        FlightM: null,
        Unknown: null,
        FlightPlan: null,
        CustomerId: null,
        IsActive: null,
        DateActive: null,
        DateFrom: null,
        DateTo: null,
        Customer: null,
        FromAirportName: null,
        FromAirportIATA: null,
        from: null,
        FromAirportCityId: null,
        ToAirportName: null,
        ToAirportIATA: null,
        to: null,
        ToAirportCityId: null,
        notes: null,
        status: null,
        progress: null,
        duration: null,
        startDate: null,
        taskName: null,
        FromAirportCity: null,
        ToAirportCity: null,
        MSN: null,
        Register: null,
        AircraftType: null,
        FlightStatus: null,
        RouteId: null,
    };

    $scope.clearEntity = function () {
        $scope.entity.Id = null;
        $scope.entity.taskID = null;

        $scope.entity.TypeId = null;
        $scope.entity.RegisterID = null;
        $scope.entity.FlightTypeID = null;

        $scope.entity.FlightNumber = null;
        $scope.entity.FromAirport = null;
        $scope.entity.ToAirport = null;


        $scope.entity.Unknown = null;
        $scope.entity.FlightPlan = null;
        $scope.entity.CustomerId = null;
        $scope.entity.IsActive = null;
        $scope.entity.DateActive = null;
        $scope.entity.DateFrom = null;
        $scope.entity.DateTo = null;
        $scope.entity.Customer = null;
        $scope.entity.FromAirportName = null;
        $scope.entity.FromAirportIATA = null;
        $scope.entity.from = null;
        $scope.entity.FromAirportCityId = null;
        $scope.entity.ToAirportName = null;
        $scope.entity.ToAirportIATA = null;
        $scope.entity.to = null;
        $scope.entity.ToAirportCityId = null;
        $scope.entity.notes = null;
        $scope.entity.status = null;
        $scope.entity.progress = null;
        $scope.entity.duration = null;
        $scope.entity.startDate = null;
        $scope.entity.taskName = null;
        $scope.entity.FromAirportCity = null;
        $scope.entity.ToAirportCity = null;
        $scope.entity.MSN = null;
        $scope.entity.Register = null;
        $scope.entity.AircraftType = null;
        $scope.entity.FlightStatus = null;

        $scope.entity.STD = null;

        $scope.entity.STA = null;

        $scope.entity.FlightH = null;

        $scope.entity.FlightM = null;
        $scope.start = null;
        $scope.entity.RouteId = null;
    };

    $scope.refreshEntity = function () {
        $scope.entity.Id = null;
        $scope.entity.taskID = null;

        //  $scope.entity.TypeId = null;
        // $scope.entity.RegisterID = null;
        //  $scope.entity.FlightTypeID = null;

        $scope.entity.FlightNumber = null;
        $scope.entity.FromAirport = $scope.entity.ToAirport;
        $scope.entity.ToAirport = null;

        $scope.entity.STD = $scope.entity.STA;
        $scope.start = $scope.entity.STD;
        $scope.entity.STA = null;
        $scope.entity.FlightH = null;
        $scope.entity.FlightM = null;
        $scope.entity.Unknown = null;
        $scope.entity.FlightPlan = null;
        $scope.entity.CustomerId = null;
        $scope.entity.IsActive = null;
        $scope.entity.DateActive = null;
        $scope.entity.DateFrom = null;
        $scope.entity.DateTo = null;
        $scope.entity.Customer = null;
        $scope.entity.FromAirportName = null;
        $scope.entity.FromAirportIATA = null;
        $scope.entity.from = null;
        $scope.entity.FromAirportCityId = null;
        $scope.entity.ToAirportName = null;
        $scope.entity.ToAirportIATA = null;
        $scope.entity.to = null;
        $scope.entity.ToAirportCityId = null;
        $scope.entity.notes = null;
        $scope.entity.status = null;
        $scope.entity.progress = null;
        $scope.entity.duration = null;
        $scope.entity.startDate = null;
        $scope.entity.taskName = null;
        $scope.entity.FromAirportCity = null;
        $scope.entity.ToAirportCity = null;
        $scope.entity.MSN = null;
        //  $scope.entity.Register = null;
        //  $scope.entity.AircraftType = null;
        $scope.entity.FlightStatus = null;
        $scope.entity.RouteId = null;
    };
    $scope.selectedFlight = null;
    $scope.tempToAirport = null;
    $scope.InitUpdate = function () {


        var data = Enumerable.From(vmins.datasource()).Where("$.taskId==" + $scope.selectedFlight.taskId).FirstOrDefault();

        if (data) {
            $scope.entity.Id = data.Id;
            $scope.entity.FlightNumber = data.FlightNumber;
            $scope.entity.FlightTypeID = data.FlightTypeID;
            $scope.entity.FromAirport = data.FromAirport;
            $scope.entity.ToAirport = data.ToAirport;
            $scope.tempToAirport = data.ToAirport;
            alert($scope.tempToAirport = data.ToAirport);
            $scope.entity.TypeId = data.TypeId;
            $scope.entity.RegisterID = data.RegisterID;
            $scope.start = new Date(data.STD);
            $scope.entity.FlightH = data.FlightH;
            $scope.entity.FlightM = data.FlightM;
            $scope.entity.STA = new Date(data.STA);
            $scope.entity.STD = new Date(data.STD);
            $scope.IsNew = false;
            $scope.popup_item_title = 'Update';
            $scope.popup_item_visible = true;
            $scope.entity.status = data.status;
            $scope.entity.initStatus = data.initStatus;
            $scope.entity.isnew = false;


        }

    };
    /////////////////////////////
    $scope.setArrival = function () {
        
        if ($scope.entity.STD != null && $scope.entity.FlightH != null && $scope.entity.FlightM != null) {
            var std = new Date($scope.entity.STD);
            
            $scope.entity.STA = new Date(std.addHours($scope.entity.FlightH).addMinutes($scope.entity.FlightM));

        }
        else
            $scope.entity.STA = null;
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
                $scope.entity.AircraftType = arg.selectedItem.Type;
                aircraftService.getVirtualMSNsByType(Config.CustomerId, arg.selectedItem.Id).then(function (response) {

                    $scope.msn_readOnly = false;
                    $scope.ds_msn = response;



                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            }
            else {
                $scope.msn_readOnly = true;
                $scope.ds_msn = [];
                $scope.entity.AircraftType = null;
            }
        },
        bindingOptions: {
            value: 'entity.TypeId',
            selectedItem: 'selectedType',


        }
    };
    $scope.ds_msn = [];
    $scope.msn_readOnly = true;
    $scope.unknown_readOnly = false;
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
                $scope.entity.Register = arg.selectedItem.Register;
                if ($scope.IsNew) {
                    var last = Flight.getLastFlight($scope.dg_ds, arg.selectedItem.ID);
                    if (last) {
                        $scope.entity.FromAirport = last.ToAirport;
                        $scope.entity.ToAirport = null;
                        $scope.entity.STD = new Date(last.STA);
                        $scope.start = new Date($scope.entity.STD);
                    }
                }



            }
            else $scope.entity.Register = null;

        },
        bindingOptions: {
            value: 'entity.RegisterID',
            disabled: 'msn_readOnly',
            dataSource: 'ds_msn',
            selectedItem: 'selectedMsn'

        }
    };
    $scope.getAverageRouteTime = function () {
        if ($scope.IsNew == true && $scope.entity.FromAirport && $scope.entity.ToAirport) {
            $scope.loadingVisible = true;
            flightService.getAverageRouteTime($scope.entity.FromAirport, $scope.entity.ToAirport).then(function (response) {


                $scope.loadingVisible = false;
                $scope.entity.FlightH = response.FlightH;
                $scope.entity.FlightM = response.FlightM;
                $scope.setArrival();


            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
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

        }
    };
    //$scope.selectedFromAirport = null;
    //$scope.selectedToAirport = null;
    //$scope.sb_FromAirport = {
    //    showClearButton: true,
    //    searchEnabled: true,
    //    dataSource: $rootScope.getDatasourceAirport(),
    //    itemTemplate: function (data) {
    //        return $rootScope.getSbTemplateAirport(data);
    //    },
    //    onSelectionChanged: function (arg) {
    //        if (arg.selectedItem)
    //            $scope.entity.FromAirportIATA = arg.selectedItem.IATA;
    //        else $scope.entity.FromAirportIATA = null;
    //        $scope.getAverageRouteTime();
    //    },
    //    searchExpr: ["IATA", "Country", "SortName", "City"],
    //    displayExpr: "IATA",
    //    valueExpr: 'Id',
    //    bindingOptions: {
    //        value: 'entity.FromAirport',
    //        selectedItem: 'selectedFromAirport',
    //    }
    //};
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
            value: 'entity.FromAirport',
            selectedItem: 'selectedFromAirport',
        }
    };
    //$scope.sb_ToAirport = {
    //    showClearButton: true,
    //    searchEnabled: true,
    //    dataSource: $rootScope.getDatasourceAirport(),
    //    itemTemplate: function (data) {
    //        return $rootScope.getSbTemplateAirport(data);
    //    },
    //    onSelectionChanged: function (arg) {
    //        if (arg.selectedItem)
    //            $scope.entity.ToAirportIATA = arg.selectedItem.IATA;
    //        else $scope.entity.ToAirportIATA = null;
    //        $scope.getAverageRouteTime();
    //    },
    //    searchExpr: ["IATA", "Country", "SortName", "City"],
    //    displayExpr: "IATA",
    //    valueExpr: 'Id',
    //    bindingOptions: {
    //        value: 'entity.ToAirport',
    //        selectedItem: 'selectedToAirport',
    //    }
    //};
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
            value: 'entity.ToAirport',
            selectedItem: 'selectedRoute',
            dataSource: 'ds_toairport'
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
        type: "time",
        width: '100%',
        //pickerType: 'rollers',
        interval: 15,
        onValueChanged: function (arg) {
            
            
            if (arg.value) {
                var d = new Date(arg.value);
                var hour = d.getHours();
                var min = d.getMinutes();
                var timestring = hour + ":" + min + ":00";
                var dt = $scope.Day1 + " " + timestring;
                var std = new Date(dt);
                $scope.entity.STD = std;
                
            }
            else
                $scope.entity.STD = null;
            $scope.setArrival();
        },
        bindingOptions: {
            value: 'start',

        }
    };
    $scope.time_end = {
        readOnly: true,
        type: "time",
        width: '100%',

        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: 'entity.STA',

        }
    };
    $scope.text_flighth = {
        min: 0,
        onValueChanged: function (arg) {
            $scope.setArrival();
        },
        bindingOptions: {
            value: 'entity.FlightH',

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

        }
    };
    $scope.text_unknown = {

        bindingOptions: {
            value: 'entity.Unknown',
            disabled: 'unknown_readOnly',
        }
    };
    $scope.text_flightnumber = {

        bindingOptions: {
            value: 'entity.FlightNumber',

        }
    };




    //////////////////////////
    $scope.scroll_height = 200;
    $scope.dg_height = 200;
    $scope.dg_height2 = 200;
    $scope.scroll_main = {
        scrollByContent: true,
        scrollByThumb: true,
        bindingOptions: { height: 'scroll_height', }
    };
    $scope.deleted = [];
    $scope.pop_width = 900;
    $scope.pop_height = 600;
    $scope.popup_add_visible = false;
    $scope.popup_add_title = 'New';

    $scope.apply = false;
    $scope.gaps = 'Gaps: 0';
    $scope.overlaps = 'Overlaps: 0';
    $scope.gapoverlaps = 'Gap & Overlaps: 0';
    $scope.gapsn = 0;
    $scope.overlapsn = 0;
    $scope.gapoverlapsn = 0;
    $scope.popup_add = {

        fullScreen: true,
        showTitle: true,
        dragEnabled: false,
        toolbarItems: [
            {
                widget: 'dxButton', location: 'before', toolbar: 'bottom', options: {
                    type: 'default', text: '', width: 40, icon: 'plus', onClick: function (e) {
                        //var ganttObj = $("#resourceGantt").data("ejGantt");
                        $scope.IsNew = true;
                        $scope.popup_item_visible = true;
                        $scope.popup_item_title = 'Add';


                    }
                }
            },
            {
                widget: 'dxButton', location: 'before', toolbar: 'bottom', options: {
                    type: 'default', text: '', width: 40, icon: 'edit', onClick: function (e) {
                        //var ganttObj = $("#resourceGantt").data("ejGantt");
                        $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
                        if (!$scope.dg_selected) {
                            General.ShowNotify(Config.Text_NoRowSelected, 'error');
                            return;
                        }
                        $scope.copy($scope.dg_selected, $scope.entity);
                        $scope.start = new Date($scope.entity.STD);
                        $scope.tempToAirport = $scope.entity.ToAirport;
                        
                       // $scope.entity.isnew = false;
                        $scope.IsNew = false;
                        $scope.popup_item_title = 'Update';
                        $scope.popup_item_visible = true;


                    }
                }
            },
            {
                widget: 'dxButton', location: 'before', toolbar: 'bottom', options: {
                    type: 'danger', text: '', width: 40, icon: 'remove', onClick: function (e) {


                       
                        $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
                        if (!$scope.dg_selected) {
                            General.ShowNotify(Config.Text_NoRowSelected, 'error');
                            return;
                        }

                        var regid = $scope.dg_selected.RegisterID;
                        $scope.deleted.push($scope.dg_selected.Id);
                        var ds = Enumerable.From($scope.dg_ds).Where("$.Id!=" + $scope.dg_selected.Id).ToArray();
                      
                        console.log($scope.dg_ds.length);
                        $scope.dg_ds = ds;
                       
                        Flight.findGapsgrid($scope.dg_ds);
                        Flight.findOverlapsgrid($scope.dg_ds, regid);

                        $scope.dg_instance.refresh();
                        $scope.getErrors();



                        
                    }
                }
            },
            { widget: 'dxTextBox', location: 'after', options: { width: 70, readOnly: true, bindingOptions: { value: 'gaps' } }, toolbar: 'bottom' },
            { widget: 'dxTextBox', location: 'after', options: { width: 100, readOnly: true, bindingOptions: { value: 'overlaps' } }, toolbar: 'bottom' },
            { widget: 'dxTextBox', location: 'after', options: { width: 130, readOnly: true, bindingOptions: { value: 'gapoverlaps' } }, toolbar: 'bottom' },

            { widget: 'dxCheckBox', location: 'after', options: {visible:false, width: 100, text: 'Apply', onValueChanged: function (e) { $scope.apply = e.value; } }, toolbar: 'bottom' },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', onClick: function (arg) {
                        

                        if ($scope.apply == true && ($scope.gapsn > 0 || $scope.overlapsn > 0)) {
                            General.ShowNotify(Config.Text_GanttErrors, 'error');
                            return;
                        }

                        var dsedited = Enumerable.From($scope.dg_ds)
                            //.Where('$.status==12 || $.status==13')
                            // .Where('$.initStatus.indexOf(12)!=-1 || $.initStatus.indexOf(13)!=-1')
                            .ToArray();

                        // console.log(vmins.datasource());
                        var edited = [];
                        $.each(dsedited, function (_i, _d) {

                            edited.push(
                                {
                                    Id: _d.Id,
                                    FlightPlanId: $scope.planId,

                                    TypeId: _d.TypeId,
                                    RegisterID: _d.RegisterID,
                                    FlightTypeID: _d.FlightTypeID,
                                    AirlineOperatorsID: _d.AirlineOperatorsID,
                                    FlightNumber: _d.FlightNumber,
                                    FromAirport: _d.FromAirport,
                                    ToAirport: _d.ToAirport,
                                    STD: (new Date(_d.STD)).toUTCString(),
                                    STA: (new Date(_d.STA)).toUTCString(),
                                    FlightH: _d.FlightH,
                                    FlightM: _d.FlightM,
                                    StatusId: _d.status,


                                }
                            );
                        });


                        var dto = {};
                        dto.Plan = $scope.plan;
                        dto.Items = edited;
                        dto.Deleted = $scope.deleted;
                        dto.Apply = $scope.apply;
                        console.log(dto);
                        $scope.loadingVisible = true;
                        flightService.savePlanItems(dto).then(function (response) {

                            // $scope.clearEntity();


                            General.ShowNotify(Config.Text_SavedOk, 'success');

                            //$rootScope.$broadcast('onLibrarySaved', response);
                            //console.log(response);
                            var ds = Enumerable.From($scope.dg_ds).ToArray();
                            $.each(ds, function (_i, _d) {
                              //  _d.initStatus = [1];
                               // if (_d.status == 10 || _d.status == 11)
                              //      _d.initStatus.push(_d.status);
                              //  else
                             //       _d.status = 1;
                                if (_d.Id >= 1000000) {
                                    var result = Enumerable.From(response).Where('$.InitId==' + _d.Id).FirstOrDefault();
                                    _d.Id = result.Id;
                                }

                            });
                            

                            $scope.dg_ds = ds;
                            $scope.loadingVisible = false;


                            $rootScope.$broadcast('onFlightPlanItemsSaved', null);

                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


                    }
                }, toolbar: 'bottom'
            },

            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_add_visible = false; } }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {
            

        },
        onShown: function (e) {
           
            $scope.bind($scope.planId);


        },
        onHiding: function () {

           
            $scope.clearEntity();
            $scope.popup_add_visible = false;
            $rootScope.$broadcast('onFlightDesignHide', null);
        },
        bindingOptions: {
            visible: 'popup_add_visible',
            width: 'pop_width',
            height: 'pop_height',
            title: 'popup_add_title',
            'toolbarItems[0].visible': 'IsEditView',
            'toolbarItems[1].visible': 'IsEditView',
            'toolbarItems[2].visible': 'IsEditView',
            'toolbarItems[3].visible': 'IsEditView',
            'toolbarItems[4].visible': 'IsEditView',
            'toolbarItems[5].visible': 'IsEditView',
            'toolbarItems[6].visible': 'IsEditView',
            'toolbarItems[7].visible': 'IsEditView',

        }
    };
    $scope.detailType = 'gantt';
    $scope.copy = function (source, destination) {
        destination.Id = source.Id;
        destination.taskID = source.taskID;
        destination.FlightPlanId = source.FlightPlanId;
        destination.TypeId = source.TypeId;
        destination.RegisterID = source.RegisterID;
        destination.FlightTypeID = source.FlightTypeID;
        destination.AirlineOperatorsID = source.AirlineOperatorsID;
        destination.FlightNumber = source.FlightNumber;
        destination.FromAirport = source.FromAirport;
        destination.ToAirport = source.ToAirport;
        destination.STA = source.STA;
        destination.STD = source.STD;
        destination.FlightH = source.FlightH;
        destination.FlightM = source.FlightM;
        destination.Unknown = source.Unknown;
        destination.FlightPlan = source.FlightPlan;
        destination.CustomerId = source.CustomerId;
        destination.IsActive = source.IsActive;
        destination.DateActive = source.DateActive;
        destination.DateFrom = source.DateFrom;
        destination.DateTo = source.DateTo;
        destination.Customer = source.Customer;
        destination.FromAirportName = source.FromAirportName;
        destination.FromAirportIATA = source.FromAirportIATA;
        destination.from = source.from;
        destination.FromAirportCityId = source.FromAirportCityId;
        destination.ToAirportName = source.ToAirportName;
        destination.ToAirportIATA = source.ToAirportIATA;
        destination.to = source.to;
        destination.ToAirportCityId = source.ToAirportCityId;
        destination.notes = source.notes;
        destination.status = source.status;
        destination.progress = source.progress;
        destination.duration = source.duration;
        destination.startDate = source.startDate;
        destination.taskName = source.taskName;
        destination.FromAirportCity = source.FromAirportCity;
        destination.ToAirportCity = source.ToAirportCity;
        destination.MSN = source.MSN;
        destination.Register = source.Register;
        destination.AircraftType = source.AircraftType;
        destination.FlightStatus = source.FlightStatus;
        destination.isnew = source.isnew;
    };
    $scope.IsNew = true;
    $scope.tempFlight = null;

    $scope.addFlight = function (data) {

        if ($scope.IsNew == true) {

            data.taskId = $scope.taskIndex;
            data.Id = data.taskId;
            $scope.taskIndex = $scope.taskIndex + 1;
        }
        else
            data.taskId = data.Id;





        if ($scope.IsNew) {
            data.isnew = true;
            data.status = 1;
            data.initStatus = [1];
        }
        else if (!data.isnew) {
          //  data.status = 13;
          //  data.initStatus.push(13);
        }





        var ganttObj = $("#resourceGantt").data("ejGantt");
        $scope.tempFlight = null;



        var newdata = JSON.parse(JSON.stringify(data));
        newdata.startDate = new Date(data.startDate);
        newdata.endDate = new Date(data.endDate);


        Flight.processData(newdata);
        

        if ($scope.IsNew) {
            console.log('add');
            console.log(vmins.datasource().length);
            ganttObj.addRecord(newdata, 0);
            vmins.datasource().push(newdata);
            console.log(vmins.datasource().length);
            Flight.findGaps(vmins.datasource(), vmins.resources());
            Flight.findOverlaps(vmins.datasource(), data.RegisterID);

            $scope.refreshEntity();
        }
        else {

            var dsitem = Enumerable.From(vmins.datasource()).Where("$.taskId==" + data.taskId).FirstOrDefault();

            $scope.copy(newdata, dsitem);
            //console.log('addflight');
            // console.log(dsitem);
            // console.log(vmins.datasource());

            ganttObj.updateRecordByTaskId(newdata);

            Flight.findGaps(vmins.datasource(), vmins.resources());
            Flight.findOverlaps(vmins.datasource(), data.RegisterID);
            //console.log(data);
            // console.log(newdata);
            // console.log(dsitem);

            $scope.popup_item_visible = false;
        }

        $scope.getErrors();



        ganttObj.reRenderChart();
        //scheduleStartDate

        // ganttObj.updateScheduleDates($scope.Day1, $scope.Day2);



    };
    $scope.popup_item_visible = false;
    $scope.popup_item_title = 'Add';
    $scope.popup_item = {

        fullScreen: false,
        showTitle: true,
        height: 480,
        width: 600,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'flightplanitemgrid', onClick: function (e) {
                        
                        //cmnt save flight
                        var result = e.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }

                        if (!$scope.entity.RegisterID && !$scope.entity.Unknown) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        if ($scope.entity.FlightH == 0 && $scope.entity.FlightM == 0) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }

                      

                       


                       
                       
                        if ($scope.IsNew) {
                            var data = {};
                            $scope.copy($scope.entity, data);

                            data.Id = $scope.taskIndex;
                            $scope.taskIndex = $scope.taskIndex + 1;

                            data.isnew = true;
                            data.status = 1;
                            data.initStatus = [1];
                            data.FlightStatus = Flight.getStatus(data.status).title;
                           
                            $scope.dg_ds.push(data);
                            $scope.refreshEntity();

                        }
                        else {
                            $scope.copy($scope.entity, $scope.dg_selected);
                            

                            if (!$scope.dg_selected.isnew) {
                               // $scope.dg_selected.status = 13;
                              //  $scope.dg_selected.initStatus.push(13);
                            }

                        }

                        

                        Flight.findGapsgrid($scope.dg_ds);
                         Flight.findOverlapsgrid($scope.dg_ds, $scope.entity.RegisterID);
                        //Flight.findGaps(vmins.datasource(), vmins.resources(), function () {
                        //    Flight.findOverlaps(vmins.datasource(), data.RegisterID, function () {
                        //        //Flight.activeDatasource = vmins.datasource();
                        //    });
                        //});

                        $scope.dg_instance.refresh();
                        $scope.getErrors();
                        // JSON.parse(JSON.stringify($scope.entity));
                        if (!$scope.IsNew) {
                            $scope.popup_item_visible = false;
                        }
                       





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
            $scope.popup_expose_visible = false;
            // $rootScope.$broadcast('onPersonHide', null);
        },
        bindingOptions: {
            visible: 'popup_item_visible',

            title: 'popup_item_title',

        }
    };
    /////////////////////////////
    $scope.applied = false;
    $scope.aircraftTypes = null;
    $scope.msns = null;
    $scope.getErrors = function () {
        $scope.gapsn = Enumerable.From($scope.dg_ds).Where("$.status==11").ToArray().length;
        $scope.gaps = 'Gaps: ' + $scope.gapsn;
        $scope.overlapsn = Enumerable.From($scope.dg_ds).Where("$.status==10").ToArray().length;
        $scope.overlaps = 'Overlaps: ' + $scope.overlapsn;
        $scope.gapoverlapsn = Enumerable.From($scope.dg_ds).Where("$.status==16").ToArray().length;
        $scope.gapoverlaps = 'Gap & Overlaps: ' + $scope.gapoverlapsn;

    };
    $scope.bind = function (pid) {
        var offset = -1 * (new Date()).getTimezoneOffset();
        $scope.loadingVisible = true;
        flightService.getFlightPlanItems(pid, offset).then(function (response) {
            $scope.loadingVisible = false;
            
            $.each(response, function (_i, _d) {
                _d.STA = (new Date(_d.STA)).addMinutes($scope.offset);
                _d.STD = (new Date(_d.STD)).addMinutes($scope.offset);
                _d.initStatus = [1];
                if (_d.status != 1)
                    _d.initStatus.push(_d.status);

            });


            $scope.dg_ds = response;
            $scope.getErrors();

            

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



    };
    ///////////////////////////////
    $scope.offset = -1 * (new Date()).getTimezoneOffset();
    $scope.dg_selected = null;
    $scope.dg_columns = [
        {
            visible: $scope.IsEditView,
            dataField: "status", caption: '',
            width: 55,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {
                if (options.value == 12)
                    $("<div>")
                        .append("<i style='font-size:22px;color:#2196F3' class='icon ion-md-add-circle'></i>")
                        .appendTo(container);
                if (options.value == 13)
                    $("<div>")
                        .append("<i style='font-size:22px;color:#4CAF50' class='icon ion-md-create'></i>")
                        .appendTo(container);
                if (options.value ==10  )
                    $("<div>")
                        .append("<i style='font-size:22px;color:#f44336' class='icon ion-md-shuffle'></i>")
                        .appendTo(container);
                if (options.value == 11)
                    $("<div>")
                        //.append("<img style='width:24px' src='../../content/images/" + "gap" + ".png' />")
                        .append("<i style='font-size:22px;color:#ff5722' class='icon ion-md-code-working'></i>")
                        .appendTo(container);

                if (options.value == 16)
                    $("<div>")
                        //.append("<img style='width:24px' src='../../content/images/" + "gap" + ".png' />")
                        .append("<i style='font-size:22px;color:#f44336' class='icon ion-md-shuffle'></i><i style='font-size:22px;color:#ff5722' class='icon ion-md-code-working'></i>")
                        .appendTo(container);


            },
            fixed: true, fixedPosition: 'left',
        },
        { dataField: 'FlightNumber', caption: 'Flight No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false,width:180 },
        { dataField: 'AircraftType', caption: 'AC Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150, groupIndex: 0 },
        { dataField: 'Register', caption: 'Register', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, groupIndex: 1  },
        
        { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        {
            dataField: 'STD', caption: 'Departure', allowResizing: true, dataType: 'datetime', allowEditing: false, width: 150, alignment: 'center', format: 'HH:mm',
            
        },
        { dataField: 'STA', caption: 'Arrival', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 150, format: 'HH:mm' },
        { dataField: 'FlightH', caption: 'Hour(s)', allowResizing: true, dataType: 'number', allowEditing: false, width: 100, alignment: 'center',  },
        { dataField: 'FlightM', caption: 'Minute(s)', allowResizing: true, dataType: 'number', allowEditing: false, width: 100, alignment: 'center',  },
        { dataField: 'FlightType', caption: 'Flight Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false,    },
        { dataField: 'FlightStatus', caption: 'Status', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 ,fixed: true, fixedPosition: 'right' },


       
        


    ];
    $scope.dg_height = 100;

    $scope.dg_instance = null;
    $scope.dg_ds = null;
    $scope.dg = {
        grouping: {
             autoExpandAll: true,
            allowCollapsing:true,
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

        noDataText: '',
        
        allowColumnReordering: true,
        allowColumnResizing: true,
         
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



            }
            else {
                $scope.dg_selected = data;


            }


        },
        height: '100%',
        bindingOptions: {
            dataSource: 'dg_ds', //'dg_employees_ds',
            // height: 'dg_employees_height'
        }
    };
    ///////////////////////////////
    $scope.tempData = null;
    $scope.plan = null;
    $scope.planId = null;
    $scope.$on('InitFlightDesignGrid', function (event, prms) {
       
        $scope.plan = prms;

        $scope.planId = prms.Id;

        $scope.entity.FlightPlanId = $scope.planId;
        $scope.taskIndex = 1000000;
       
        

        $scope.tempData = null;
        $scope.popup_add_title = 'Plan Items';


        $scope.popup_add_visible = true;


    });
    $scope.IsReadonly = false;
    $scope.IsEditView = true;
    $scope.$on('InitFlightDesignGridView', function (event, prms) {
         
        $scope.IsReadonly = true;
        $scope.IsEditView = false;
        $scope.plan = prms;

        $scope.planId = prms.Id;

        $scope.entity.FlightPlanId = $scope.planId;
        $scope.taskIndex = 1000000;



        $scope.tempData = null;
        $scope.popup_add_title = 'Plan Items';
        $scope.dg_columns[0].visible = false;
        $scope.dg_columns[$scope.dg_columns.length-1].visible = false;

        $scope.popup_add_visible = true;


    });
    //////////////////////////////
 }]);  