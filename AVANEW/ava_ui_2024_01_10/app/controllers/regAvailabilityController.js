'use strict';
app.controller('regAvailabilityController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'weatherService', 'aircraftService', 'authService', 'notificationService', '$route', function ($scope, $location, $routeParams, $rootScope, flightService, weatherService, aircraftService, authService, notificationService, $route) {
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
            $scope.dg_av_selected = $rootScope.getSelectedRow($scope.dg_av_instance);
            if (!$scope.dg_av_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }

            General.Confirm(Config.Text_DeleteConfirm, function (res) {
                if (res) {

                    var dto = { Id: $scope.dg_av_selected.Id, };
                    $scope.loadingVisible = true;
                    flightService.saveDeleteAog(dto).then(function (response) {
                        $scope.loadingVisible = false;
                        General.ShowNotify(Config.Text_SavedOk, 'success');
                        
                        $scope.bindEvents($scope.dg_selected.ID);



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

            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }

            $scope.popup_event_visible = true;
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

    
    /////////////////////////////////
    $scope.dg_selected = null;
    $scope.dg_columns = [
        
        { dataField: 'AircraftType', caption: 'Type', allowResizing: true, dataType: 'string', allowEditing: false, width: 200, alignment: 'center', groupIndex: 0 },
         
        { dataField: 'Register', caption: 'Register', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false,   },

          
    ];
    $scope.dg_height = $(window).height() - 135;

    $scope.dg_instance = null;
    $scope.dg_ds = null;
    $scope.dg = {
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

        noDataText: '',

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
                $scope.dg_av_ds = null;


            }
            else {
                $scope.dg_selected = data;
                $scope.bindEvents(data.ID);

            }


        },
        onCellPrepared: function (cellInfo) {
            
        },
        //height: '500',
        bindingOptions: {
            dataSource: 'dg_ds', //'dg_employees_ds',
            height: 'dg_height'
        }
    };
    $scope.bindEvents = function (id) {
        $scope.dg_av_ds = null;
        $scope.loadingVisible = true;
        flightService.getAogs(id).then(function (response) {
            $scope.loadingVisible = false;
            $scope.dg_av_ds = response;

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    ///////////////////////////
    $scope.dg_av_selected = null;
    $scope.dg_av_columns = [

        { dataField: 'GroundType', caption: 'Type', allowResizing: true, dataType: 'string', allowEditing: false, width: 150, alignment: 'center' },

         {
             caption: 'Local', columns: [
                 { caption: 'From', dataField: 'DateFromLocal', format: 'yyyy-MMM-dd', allowResizing: true, dataType: 'datetime', allowEditing: false, width: 130, alignment: 'center' },
                 { caption: '', dataField: 'DateFromLocal', format: 'HH:mm', allowResizing: true, dataType: 'datetime', allowEditing: false, width: 90, alignment: 'center' },
                 { caption: 'To', dataField: 'DateEndLocal', format: 'yyyy-MMM-dd', allowResizing: true, dataType: 'datetime', allowEditing: false, width: 130, alignment: 'center' },
                 { caption: '', dataField: 'DateEndLocal', format: 'HH:mm', allowResizing: true, dataType: 'datetime', allowEditing: false, width: 90, alignment: 'center' }
             ] 

         },
         {
             caption: 'UTC', columns: [
                 { caption: 'From', dataField: 'DateFrom', format: 'yyyy-MMM-dd', allowResizing: true, dataType: 'datetime', allowEditing: false, width: 130, alignment: 'center' },
                 { caption: '', dataField: 'DateFrom', format: 'HH:mm', allowResizing: true, dataType: 'datetime', allowEditing: false, width: 90, alignment: 'center' },
                 { caption: 'To', dataField: 'DateEnd', format: 'yyyy-MMM-dd', allowResizing: true, dataType: 'datetime', allowEditing: false, width: 130, alignment: 'center' },
                 { caption: '', dataField: 'DateEnd', format: 'HH:mm', allowResizing: true, dataType: 'datetime', allowEditing: false, width: 90, alignment: 'center' }
             ]

         },

          { dataField: 'Remark', caption: 'Remark', allowResizing: true, dataType: 'string', allowEditing: false,  alignment: 'left' },

    ];
    $scope.dg_av_height = $(window).height() - 135;

    $scope.dg_av_instance = null;
    $scope.dg_av_ds = null;
    $scope.dg_av = {
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


        columns: $scope.dg_av_columns,
        onContentReady: function (e) {
            if (!$scope.dg_av_instance)
                $scope.dg_av_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {

                $scope.dg_av_selected = null;



            }
            else {
                $scope.dg_av_selected = data;


            }


        },
        onCellPrepared: function (cellInfo) {

        },
        //height: '500',
        bindingOptions: {
            dataSource: 'dg_av_ds', //'dg_employees_ds',
            height: 'dg_av_height'
        }
    };
    ///////////////////////////
    $scope.popup_event_visible = false;
    $scope.popup_event_title = '';
    $scope.popup_event = {
        width: 500,
        height: 360,
        //position: 'left top',
        fullScreen: false,
        showTitle: true,
        dragEnabled: false,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Ok', icon: 'check', validationGroup: 'regav', onClick: function (arg) {

                        // console.log($scope.data);
                        //return;
                        var result = arg.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        var regid = $scope.dg_selected.ID;
                        var dto = {
                            DateFrom: new Date($scope.FromDateEvent),
                            DateEnd: new Date($scope.ToDateEvent),
                             
                            RegisterId: regid,
                            GroundTypeId: $scope.aog,
                            Remark:$scope.Remark

                        }

                        
                        $scope.loadingVisible = true;
                        flightService.saveAog(dto).then(function (response) {
                            $scope.loadingVisible = false;
                            $scope.bindEvents(regid);
                            $scope.popup_event_visible = false;

                           

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
            $scope.FromDateEvent = null;
            $scope.ToDateEvent = null;
            $scope.aog = null;
            $scope.Remark = null;

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


    ////////////////////////////
    $scope.Remark = null;
    $scope.text_remark = {
        
        bindingOptions: {
            value: 'Remark',

        }
    };
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
    $scope.dsTypes = [{ Id: 10000, Title: 'A-CHECK' },
        { Id: 10001, Title: 'C-CHECK' },
        { Id: 10002, Title: 'AOG' },

        { Id: 10003, Title: 'BACKUP' },
        { Id: 10004, Title: 'TECH' },
        { Id: 10005, Title: 'CHECK' },
    ];
    $scope.aog = null;
    $scope.sb_type = {

        showClearButton: true,
        width: '100%',
        searchEnabled: false,
        displayExpr: "Title",
        valueExpr: 'Id',
        onSelectionChanged: function (arg) {
 

        },
        bindingOptions: {
            value: 'aog',

            dataSource: 'dsTypes',


        }
    };
    ////////////////////////////
     
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
                            _d.Day1_Duty = pad(Math.floor(_d.Day1_Duty / 60)).toString() + ':' + pad(_d.Day1_Duty % 60).toString();
                            _d.Day1_Flight = pad(Math.floor(_d.Day1_Flight / 60)).toString() + ':' + pad(_d.Day1_Flight % 60).toString();

                            _d.Day7_Duty = pad(Math.floor(_d.Day7_Duty / 60)).toString() + ':' + pad(_d.Day7_Duty % 60).toString();
                            //_d.Day7_Flight = pad(Math.floor(_d.Day7_Flight / 60)).toString() + ':' + pad(_d.Day7_Flight % 60).toString();
                            _d.Day14_Duty = pad(Math.floor(_d.Day14_Duty / 60)).toString() + ':' + pad(_d.Day14_Duty % 60).toString();
                            //_d.Day14_Flight = pad(Math.floor(_d.Day14_Flight / 60)).toString() + ':' + pad(_d.Day14_Flight % 60).toString();
                            _d.Day28_Duty = pad(Math.floor(_d.Day28_Duty / 60)).toString() + ':' + pad(_d.Day28_Duty % 60).toString();
                            _d.Day28_Flight = pad(Math.floor(_d.Day28_Flight / 60)).toString() + ':' + pad(_d.Day28_Flight % 60).toString();
                            // _d.Year_Duty = pad(Math.floor(_d.Year_Duty / 60)).toString() + ':' + pad(_d.Year_Duty % 60).toString();
                            _d.Year_Flight = pad(Math.floor(_d.Year_Flight / 60)).toString() + ':' + pad(_d.Year_Flight % 60).toString();
                            _d.CYear_Flight = pad(Math.floor(_d.CYear_Flight / 60)).toString() + ':' + pad(_d.CYear_Flight % 60).toString();
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

    $scope.bindRegisters = function () {
        $scope.loadingVisible = true;
        aircraftService.getMSNs(Config.CustomerId).then(function (response) {
            $scope.loadingVisible = false;
            $scope.dg_ds = response;

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };

    


     
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> Registers';
        $('.regavailability').fadeIn();
        $scope.bindRegisters();
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
    $rootScope.$broadcast('RegAvailabilityLoaded', null);
    ///end
}]);