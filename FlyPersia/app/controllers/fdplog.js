'use strict';
app.controller('fdplogController', ['$scope', '$location', '$routeParams', '$rootScope', 'airportService', 'authService', '$route','schedulingService', function ($scope, $location, $routeParams, $rootScope, airportService, authService, $route,schedulingService) {
    $scope.prms = $routeParams.prms;
    $scope.IsDispatch = $route.current.isDispatch;
    $scope.IsBase = !$scope.IsDispatch;
    //////////////////////////////////
    $scope.dsUrl = null;
    $scope.filterVisible = false;
    $scope.btn_delete = {
        text: 'Delete',
        type: 'danger',
        icon: 'clear',
        width: 120,
        bindingOptions: {
            visible: 'IsBase'
        },
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

            $rootScope.$broadcast('InitAddAirport', data);
        },
        bindingOptions: {
            visible: 'IsBase'
        },

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
            $rootScope.$broadcast('InitAddAirport', data);
        },
        bindingOptions: {
            visible: 'IsBase'
        },

    };

    $scope.btn_flights = {
        text: 'Flights',
        type: 'default',
        icon: 'rowfield',
        width: 120,

        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var data = $scope.dg_selected;
            $rootScope.navigateairport(data.IATA);
        },
        bindingOptions: {
            visible: 'IsDispatch'
        },

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

        bindingOptions: {},
        onClick: function (e) {

            $scope.$broadcast('getFilterQuery', null);
        }

    };
	$scope._dateto= new Date();
	 
	$scope._datefrom = new Date();
	   $scope.date_from = {
        type: "date",
        placeholder: 'From',
        width: '130px',
        displayFormat: "yyyy-MM-dd",
        adaptivityEnabled: true,
        //  pickerType: 'rollers',
        onValueChanged: function (arg) {
            //$scope.search();
        },
        bindingOptions: {
            value: '_datefrom',

        }
    };
	   $scope.date_to = {
        type: "date",
        placeholder: 'To',
        width: '130px',
        displayFormat: "yyyy-MM-dd",
        adaptivityEnabled: true,
        //  pickerType: 'rollers',
        onValueChanged: function (arg) {
            //$scope.search();
        },
        bindingOptions: {
            value: '_dateto',

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

    ///////////////////////////////////
    $scope.filters = [];

    $scope.dg_columns = [
       { dataField: 'DateAction', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'date', format: 'yy-MM-dd HH:mm', allowEditing: false, width: 150,sortIndex: 0, sortOrder: 'asc' },
  { dataField: 'Action', caption: 'Action', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100,  },  
        { dataField: 'InitKey', caption: 'Duty Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },  
		 { dataField: 'InitFlts', caption: 'Flights', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 180 },  
		  { dataField: 'InitRoute', caption: 'Route', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 180 },  
		  { dataField: 'InitStart', caption: 'Start', allowResizing: true, alignment: 'center', dataType: 'date', format: 'yy-MM-dd HH:mm', allowEditing: false, width: 150,  },
		  { dataField: 'InitEnd', caption: 'End', allowResizing: true, alignment: 'center', dataType: 'date', format: 'yy-MM-dd HH:mm', allowEditing: false, width: 150,  },
		  { dataField: 'InitRank', caption: 'Position', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 100 },
	   { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false,minWidth:200 },
      

        
		 { dataField: 'UserName', caption: 'User', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200  },
        { dataField: 'ConfirmedBy', caption: 'Approver', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
       
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
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_selected = null;
            }
            else
                $scope.dg_selected = data;


        },
        bindingOptions: {
            dataSource: 'dg_ds'
        }
    };


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
        
		
		var d1= moment($scope._datefrom).format('YYYY-MM-DD');
		var d2= moment($scope._dateto).format('YYYY-MM-DD');
		$scope.loadingVisible = true;
        schedulingService.getFDPLogs(d1,d2).then(function (response) {
            $scope.loadingVisible = false;
            $scope.dg_ds = response;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
		
		
		

    };
    ///////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> Log';
        $('.fdplog').fadeIn();
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
    $scope.$on('onAirportSaved', function (event, prms) {

        $scope.doRefresh = true;
    });
    $scope.$on('onAirportHide', function (event, prms) {

        $scope.bind();

    });
    //////////////////////////////////////////
    $rootScope.$broadcast('AirportLoaded', null);
    ///end
}]);