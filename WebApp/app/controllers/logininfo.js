'use strict';
app.controller('logininfoController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'aircraftService', 'authService', 'notificationService', '$route', function ($scope, $location, $routeParams, $rootScope, flightService, aircraftService, authService, notificationService, $route) {
    $scope.prms = $routeParams.prms;


    $scope.dt_to = new Date().addDays(0);
    $scope.dt_from = new Date().addDays(-7);
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


    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 120,
        validationGroup: 'ctrsearch',
        bindingOptions: {},
        onClick: function (e) {

            $scope.dg_access_ds = null;

            $scope.bind();
        }

    };
    ///////////////////////////////////
    $scope.bind = function () {

    };
    ///////////////////////////////////
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
    $scope.dg_access_columns = [

        { dataField: 'DateCreate', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 150, format: 'yyyy-MMM-dd', sortIndex: 0, sortOrder: 'asc', fixed: true, fixedPosition: 'left' },
        { dataField: 'DateCreate', caption: 'Time', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 150, format: 'HH:mm', sortIndex: 1, sortOrder: 'asc', fixed: true, fixedPosition: 'left' },

        { dataField: 'User', caption: 'UserName', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: true, fixedPosition: 'left',width:250, },

        { dataField: 'IP', caption: 'IP', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 200,   },
        { dataField: 'LocationCity', caption: 'City', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 200, },
        { dataField: 'Info', caption: 'Details', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', minWidth: 500, },
        
    ];

    $scope.dg_access_selected = null;
    $scope.dg_access_instance = null;
    $scope.dg_access_ds = null;
    $scope.ipKeys = null;
    $scope.dg_access = {
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
        keyExpr: 'Id',
        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'multiple' },

        columnAutoWidth: false,
        height: $(window).height() - 140,

        columns: $scope.dg_access_columns,
        onContentReady: function (e) {
            if (!$scope.dg_access_instance)
                $scope.dg_access_instance = e.component;

        },
        onSelectionChanged: function (e) {
            //var data = e.selectedRowsData[0];

            //if (!data) {

            //    $scope.dg_access_selected = null;

            //}
            //else {
            //    $scope.dg_access_selected = data;

            //}

            ////nono

        },



        onRowPrepared: function (e) {
            if (e.rowType === "data" && e.data.PersonId) {

                e.rowElement.css("backgroundColor", "#b3ffcc");
            }
            //42 %  10

        },
        bindingOptions: {
            dataSource: 'dg_access_ds',
            selectedRowKeys: 'ipKeys',
        }
    };
    //////////////////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();

    }
    else if ($rootScope.userName.toLowerCase() != 'razbani' && $rootScope.userName.toLowerCase() != 'it.razbani' && $rootScope.userName.toLowerCase() != 'demo'
        && $rootScope.userName.toLowerCase() != 'it.tanha')
        $rootScope.navigatehome();
    else {
        $rootScope.page_title = '> Login History';


        $('.logininfo').fadeIn(400, function () {

        });
    }
    //////////////////////////////////////////

    $scope.$on('$viewContentLoaded', function () {


    });

    $rootScope.$broadcast('CrewTimeReportLoaded', null);

}]);