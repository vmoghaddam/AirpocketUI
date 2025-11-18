'use strict';

app.controller('flightPlansCalendarMaintenanceController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'aircraftService', 'authService', 'notificationService', '$route', function ($scope, $location, $routeParams, $rootScope, flightService, aircraftService, authService, notificationService, $route) {
    $scope.prms = $routeParams.prms;
    $scope.typeId = 60;
    $scope.typeId = 50;
    $scope.typeId = -1;

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
    $scope.entity = {
        Id: null,
        PlanId:null,
        CalendarId: null,
        RegisterId: null,
        VirtualId:null,
        Date: null,
    };

    $scope.btn_register = {
        text: 'Assign Register',
        type: 'default',
        icon: 'airplane',
        width: '100%',
        bindingOptions: {
            disabled: 'unlockvisible'
        },
        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            $scope.entity.Id = $scope.dg_selected.FlightPlanRegisterId;
            if (!$scope.entity.Id)
                $scope.entity.Id = -1;
            $scope.entity.PlanId = $scope.dg_selected.Id;
            $scope.entity.CalendarId = $scope.dg_selected.CalendarId;
            $scope.entity.Date = $scope.dg_selected.Date;
            $scope.entity.RegisterId = $scope.dg_selected.RegisterId;
            $scope.entity.VirtualId = $scope.dg_selected.VirtualRegisterId;
            aircraftService.getAvailableMSNsByType(Config.CustomerId, $scope.dg_selected.VirtualTypeId).then(function (response) {

                $scope.loadingVisible = false;
                $scope.ds_msn = response;
                $scope.popup_registers_visible = true;


            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

          
           // $rootScope.$broadcast('InitFlightPlanRegister', { Id: $scope.dg_selected.Id });

        }

    };
    $scope.lockvisible = false;
    $scope.unlockvisible = false;
    $scope.btn_lock = {
        text: 'Lock',
        type: 'default',
        icon: 'icon ion-md-lock',
        width: '100%',
        bindingOptions: {
            visible: 'lockvisible'
        },
        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var dto = { id: $scope.dg_selected.FlightPlanRegisterId};
            $scope.loadingVisible = true;
            flightService.lockPlanRegister(dto).then(function (response) {

                $scope.loadingVisible = false;
                $scope.doRefresh = true;
                $scope.bind();


            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


            // $rootScope.$broadcast('InitFlightPlanRegister', { Id: $scope.dg_selected.Id });

        }

    };

    $scope.btn_unlock = {
        text: 'UnLock',
        type: 'default',
        icon: 'icon ion-md-unlock',
        width: '100%',
        bindingOptions: {
            visible: 'unlockvisible'
        },
        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var dto = { id: $scope.dg_selected.FlightPlanRegisterId };
            $scope.loadingVisible = true;
            flightService.unlockPlanRegister(dto).then(function (response) {

                $scope.loadingVisible = false;
                $scope.doRefresh = true;
                $scope.bind();


            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


        }

    };


    $scope.btn_delete = {
        text: 'Remove Register',
        type: 'danger',
        icon: 'clear',
        width: '100%',
        bindingOptions: {
            disabled:'unlockvisible'
        },
        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            if (!$scope.dg_selected.FlightPlanRegisterId)
                return;
            General.Confirm(Config.Text_DeleteConfirm, function (res) {
                if (res) {

                    var dto = { Id: $scope.dg_selected.FlightPlanRegisterId, };
                    $scope.loadingVisible = true;
                    flightService.deletePlanRegister(dto).then(function (response) {
                        $scope.loadingVisible = false;
                        General.ShowNotify(Config.Text_SavedOk, 'success');
                        $scope.doRefresh = true;
                        $scope.bind();



                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                }
            });
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
        width: '100%',
        validationGroup:'fpcsearch',
       
        onClick: function (e) {
            var result = e.validationGroup.validate();

            if (!result.isValid) {
                General.ShowNotify(Config.Text_FillRequired, 'error');
                return;
            }
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
               

                if ( options.data.IsLocked ) {

                    $("<div>")
                        .append("<i style='font-size:22px;color:red!important' class='icon ion-md-lock '></i>")
                        .appendTo(container);
                }
                else
                    $("<div>")
                        .append("<i style='font-size:22px;color:green!important' class='icon ion-md-unlock'></i>")
                        .appendTo(container);

            },
            fixed: true, fixedPosition: 'left',
        },
        { dataField: 'IsLocked', caption: '', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width:  70, },
        //  { dataField: 'Id', caption: 'No', allowResizing: true, dataType: 'number', allowEditing: false, width: 120, alignment: 'center', sortIndex: 1, sortOrder: "asc", fixed: true, fixedPosition: 'left' },
        //  { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left',  },
        { dataField: 'BaseIATA', caption: 'Base', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 150,    },
      //  { dataField: 'BaseName', caption: 'Base Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', },
       // { dataField: 'Types', caption: 'Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 200 },
        { dataField: 'Date', caption: 'Date', allowResizing: true, dataType: 'date', allowEditing: false, width: 200, alignment: 'center', fixed: false, fixedPosition: 'right' },
        { dataField: 'IntervalType', caption: 'Interval', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 150 },
        { dataField: 'TotalFlights', caption: 'Flights', allowResizing: true, dataType: 'number', allowEditing: false, width: 100, alignment: 'center' },

        { dataField: 'DateFrom', caption: 'From', allowResizing: true, dataType: 'date', allowEditing: false, width: 170, alignment: 'center', fixed: false, fixedPosition: 'right' },
        { dataField: 'DateTo', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 170, fixed: false, fixedPosition: 'right' },
        { dataField: 'Types', caption: 'Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 150 },
        { dataField: 'VirtualRegister', caption: 'Design Register', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 180  },
        // { dataField: 'DateActive', caption: 'Applied Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 200 },
       
        { dataField: 'Register', caption: 'Register', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', },




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
        
        onContentReady: function (e) {
            if (!$scope.dg_instance)
                $scope.dg_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.lockvisible = false;
                $scope.unlockvisible = false;
                $scope.dg_selected = null;
                $scope.IsApproveDisabled = true;

                $scope.IsApproveDisabled = true;
            }
            else {
                $scope.lockvisible = data.RegisterId && data.IsOpen;
                $scope.unlockvisible = data.RegisterId && data.IsLocked;
                $scope.dg_selected = data;
                $scope.IsApproveDisabled = data.IsApproved70 == 1 || data.RegisterAssignProgress != 100;

            }


        },
        onRowPrepared: function (e) {
            if (e.data && !e.data.FlightPlanRegisterId) {
                e.rowElement.css('background', '#ffdddd');
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

                        $.each(e, function (_i, _d) {
                            _d.STD = (new Date(_d.STD)).addMinutes(offset);
                            _d.STA = (new Date(_d.STA)).addMinutes(offset);
                        });
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
    /////////////////////////////
    $scope.dt_from = new Date();
    $scope.dt_to = new Date().addDays(7);
    $scope.date_from = {
        type: "date",
        placeholder:'From',
        width: '100%',
        
        bindingOptions: {
            value: 'dt_from',

        }
    };
    $scope.date_to = {
        type: "date",
        width: '100%',
        placeholder: 'To',
         
        bindingOptions: {
            value: 'dt_to',

        }
    };


    $scope.date_flight = {
        type: "date",
        width: '100%',
        readOnly:true,
        bindingOptions: {
            value: 'entity.Date',

        }
    };
    $scope.ds_msn = [];
    $scope.selectedMsn = null;
    $scope.sb_msn = {

        showClearButton: true,
        width: '100%',
        searchEnabled: true,

        searchExpr: ['Register', 'MSN'],

        displayExpr: "Register",
        valueExpr: 'ID',
        onSelectionChanged: function (arg) {
            if (arg.selectedItem) {



            }

        },
        bindingOptions: {
            value: 'entity.RegisterId',

            dataSource: 'ds_msn',
            selectedItem: 'selectedMsn'

        }
    };

    ///////////////////////////
    $scope.popup_registers_visible = false;
    $scope.popup_registers_title = 'Set Registers';
    $scope.popup_registers = {
        width: 600,
        height: 200,
        fullScreen: false,
        showTitle: true,
        dragEnabled: false,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'fpcregisteradd',  onClick: function (arg) {
                        var result = arg.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }

                        
                        $scope.loadingVisible = true;
                        //(pid,vid,rid,from,to)
                        //(new Date($scope.datefrom)).toUTCDateTimeDigits()
                        flightService.checkOverlap($scope.dg_selected.Id
                            //, $scope.dg_res_selected.resourceId
                            , $scope.dg_selected.VirtualRegisterId
                            , $scope.entity.RegisterId, (new Date($scope.entity.Date)).toUTCDateTimeDigits(), (new Date($scope.entity.Date)).toUTCDateTimeDigits()).then(function (response) {
                               

                                if (!response) {
                                    $scope.loadingVisible = false;
                                    General.ShowNotify('Overlap', 'error');
                                    return;
                                }
                                ///////////////////////

                                flightService.savePlanRegister($scope.entity).then(function (response) {



                                    General.ShowNotify(Config.Text_SavedOk, 'success');


                                    $scope.doRefresh = true;

                                    $scope.loadingVisible = false;
                                    $scope.popup_registers_visible = false;
                                     

                                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


                                /////////////////////

                            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                        return;
                        //$scope.registers
                        var items = Enumerable.From($scope.registers).Where('$.Id<0').ToArray();
                        var dto = {};
                        dto.PlanId = $scope.plan.Id;
                        dto.Items = items;
                        dto.Deleted = $scope.deleted;

                        console.log(dto);
                        $scope.loadingVisible = true;
                        flightService.savePlanRegisters(dto).then(function (response) {


                            $.each(response, function (_i, _d) {
                                var row = Enumerable.From($scope.registers).Where('$.Id==' + _d.OldId).FirstOrDefault();
                                row.Id = _d.NewId;
                            });

                            General.ShowNotify(Config.Text_SavedOk, 'success');




                            $scope.loadingVisible = false;
                            $scope.popup_registers_visible = false;
                            $scope.bindGantt();

                            $rootScope.$broadcast('onRegisterAssigned', null);

                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


                    }
                }, toolbar: 'bottom'
            },

            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }
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

            
        },
        onHiding: function () {
            $scope.entity.Id = null;
            $scope.entity.CalendarId = null;
            $scope.entity.PlanId = null;
            $scope.entity.VirtualId = null;
            $scope.entity.RegisterId = null;
            $scope.entity.Date = null;
            if ($scope.doRefresh)
                $scope.bind();
            $scope.popup_registers_visible = false;

        },
        bindingOptions: {
            visible: 'popup_registers_visible',
            //width: 'pop_width',
            //height: 'pop_height',
            title: 'popup_registers_title',

        }
    };

    //close button
    $scope.popup_registers.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_registers_visible = false;

    };
    ////////////////////////////////////////////
    $scope.bind = function () {
        var url = 'odata/flightplans/calendar/' + Config.CustomerId + '/' + $scope.typeId;
        if (!$scope.dg_ds && $scope.doRefresh) {

            $scope.dg_ds = {
                store: {
                    type: "odata",
                    url: $rootScope.serviceUrl + url,
                    //key: "Id",
                    version: 4,
                    onLoaded: function (e) {
                        // $scope.loadingVisible = false;
                        //filter
                        $rootScope.$broadcast('OnDataLoaded', null);
                    },
                    beforeSend: function (e) {

                        e.params.$filter = (e.params.$filter ? e.params.$filter + ' and ' : '') + "(Date ge " + (new Date($scope.dt_from)).ToUTC2(1) + ") and (Date le " + (new Date($scope.dt_to)).ToUTC2()+")";
                        console.log(e.params);
                        $scope.dsUrl = General.getDsUrl(e);

                        // $scope.$apply(function () {
                        //    $scope.loadingVisible = true;
                        // });
                        $rootScope.$broadcast('OnDataLoading', null);
                    },
                },
                // filter: [['Date', '=', new Date()]],
                sort: [{ getter: "Date", desc: true }],

            };
        }

        if ($scope.doRefresh) {
            //$scope.filters = $scope.getFilters();
           // $scope.dg_ds.filter = [];
           //  $scope.dg_ds.filter = $scope.filters;
           // console.log('Filters');
           // console.log($scope.dg_ds.filter);
            $scope.dg_instance.refresh();
            $scope.doRefresh = false;
        }

    };
    ////////////////////////////
    $scope.flightData = null;
    $scope.doRefresh = false;
    $scope.filters = [];
    $scope.getFilters = function () {
        $scope.filters = [['Date', '>=',  new Date($scope.dt_from) ], 'and', ['Date', '<=',  new Date($scope.dt_to) ]];
        
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

        $('.flightplanscalendarmaintenance').fadeIn(400, function () {
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