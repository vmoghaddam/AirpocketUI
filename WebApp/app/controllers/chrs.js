'use strict';
app.controller('chrsController', ['$scope', '$location', '$routeParams', '$rootScope', 'airportService', 'flightService', 'authService', '$route', function ($scope, $location, $routeParams, $rootScope, airportService, flightService, authService, $route) {
    $scope.prms = $routeParams.prms;
    $scope.IsDispatch = $route.current.isDispatch;
    $scope.IsBase = !$scope.IsDispatch;
    ///////////////////////////////////
    var tabs = [
        { text: "Charterers", id: 'chr' },
        //{ text: "Teachers", id: 'teacher' },

    ];
    $scope.tabs = tabs;
    $scope.selectedTabIndex = 0;
    $scope.$watch("selectedTabIndex", function (newValue) {
        //if ($scope.dg_course_instance) {
        //    $scope.dg_course_instance.columnOption("ExpireStatus", "visible", newValue == 0);
        //    $scope.dg_course_instance.columnOption("Remain", "visible", newValue == 0);

        //    $scope.dg_course_instance.columnOption("IsLast", "visible", newValue == 1);
        //    $scope.dg_course_instance.columnOption("IsFirst", "visible", newValue == 1);

        //}
        try {
            $scope.selectedTab = tabs[newValue];
            $('.tab').hide();
            $('.' + $scope.selectedTab.id).fadeIn(100, function () {


            });
            if (newValue == 'chr')
                $scope.dg_instance.repaint();
            


        }
        catch (e) {

        }
    });
    $scope.tabs_options = {


        onItemClick: function (arg) {
            //$scope.selectedTab = arg.itemData;

        },
        bindingOptions: {

            dataSource: { dataPath: "tabs", deep: true },
            selectedIndex: 'selectedTabIndex'
        }

    };
    ///////////////////////////////////
    $scope.entity = {
        Id: null,
        Title1: null,
        Title2: null,
        Code: null,
        NiraCode: null,
        
        Remark: null,
        

    };

    $scope.clearEntity = function () {
        $scope.entity.Id = null;

        $scope.entity.Title1 = null;
        $scope.entity.Title2 = null;
        $scope.entity.Code = null;
        $scope.entity.NiraCode = null;
        
        $scope.entity.Remark = null;
        

    };

    $scope.bind = function (data) {

        $scope.entity.Id = data.Id;

        $scope.entity.Title1 = data.Title1;
        $scope.entity.Title2 = data.Title2;
        $scope.entity.Code = data.Code;
        $scope.entity.NiraCode = data.NiraCode;
        $scope.entity.Remark = data.Remark;
        
    };

    $scope.sb_category = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceDelayCategory(),

        onSelectionChanged: function (arg) {


        },
        searchExpr: ["Title"],
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity.DelayCategoryId',


        }
    };
    $scope.txt_code = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Code',
        }
    };
    $scope.txt_niracode = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.NiraCode',
        }
    };
    $scope.txt_title = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Title1',
        }
    };
    $scope.txt_remark = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Remark',
        }
    };
    //////////////////////////////////
    $scope.dsUrl = null;
    $scope.filterVisible = false;
    $scope.btn_delete = {
        text: 'Delete',
        type: 'danger',
        icon: 'clear',
        width: 120,

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
                    flightService.deleteCharterer(dto).then(function (response) {
                        $scope.loadingVisible = false;
                        General.ShowNotify(Config.Text_SavedOk, 'success');
                        $scope.doRefresh = true;
                        $scope.bindDelays();



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

            var data = { Id: -1 };
            $scope.isNew = true;
            $scope.clearEntity();
            $scope.popup_add_visible = true;

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
            $scope.isNew = false;
            $scope.entity.Id = data.Id;

            $scope.entity.Title1 = data.Title1;
            $scope.entity.Code = data.Code;
            $scope.entity.NiraCode = data.NiraCode;
            $scope.entity.Remark = data.Remark;
           
            $scope.popup_add_visible = true;

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
            $scope.doRefresh = true;
            $scope.bindDelays();
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

    $scope.bindDelays = function () {
         
        $scope.dg_ds = null;
        $scope.loadingVisible = true;
        flightService.getCharterers().then(function (response) {
            $scope.dg_ds = response;
            $scope.loadingVisible = false;

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
    ///////////////////////////////////
    $scope.pop_width = 500;
    $scope.pop_height = 370;
    $scope.popup_add_visible = false;
    $scope.popup_add_title = 'New';
    $scope.popup_add = {

        fullScreen: false,
        showTitle: true,

        toolbarItems: [
            { widget: 'dxButton', location: 'after', options: { type: 'default', text: 'Save', icon: 'check', validationGroup: 'dcadd', bindingOptions: {} }, toolbar: 'bottom' },
            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }
        ],

        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            var size = $rootScope.getWindowSize();
            if (size.width <= 600) {
                $scope.pop_width = size.width;
                $scope.pop_height = size.height;
            }
            //var size = $rootScope.get_windowSizePadding(40);
            //$scope.pop_width = size.width;
            //if ($scope.pop_width > 1200)
            //    $scope.pop_width = 1200;
            //$scope.pop_height = size.height;
            // $scope.dg_height = $scope.pop_height - 140;

        },
        onShown: function (e) {


        },
        onHiding: function () {

            $scope.clearEntity();

           // $scope.bindDelays();
            $scope.popup_add_visible = false;

        },
        bindingOptions: {
            visible: 'popup_add_visible',
            width: 'pop_width',
            height: 'pop_height',
            title: 'popup_add_title'
        }
    };

    //close button
    $scope.popup_add.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_add_visible = false;
    };

    //save button
    $scope.popup_add.toolbarItems[0].options.onClick = function (e) {

        var result = e.validationGroup.validate();

        if (!result.isValid) {
            General.ShowNotify(Config.Text_FillRequired, 'error');
            return;
        }

        if ($scope.isNew)
            $scope.entity.Id = -1;

        $scope.loadingVisible = true;
        console.log($scope.entity);
        flightService.saveCharterer($scope.entity).then(function (response) {
            if (response.Id == -100) {
                $scope.loadingVisible = false;
                General.ShowNotify(response.Title1, 'error');
            }
            else {
                $scope.clearEntity();
                $scope.doRefresh = true;

                General.ShowNotify(Config.Text_SavedOk, 'success');

                $rootScope.$broadcast('onRouteSaved', response);



                $scope.loadingVisible = false;

                if (!$scope.isNew) {
                    var item =Enumerable.From( $scope.dg_ds).Where('$.Id==' + response.Id).FirstOrDefault();
                    if (item) {
                        item.Code = response.Code;
                        item.Title1 = response.Title1;
                        item.Remark = response.Remark;
                        item.NiraCode = response.NiraCode;

                    }
                    $scope.dg_instance.refresh();
                    $scope.popup_add_visible = false;
                }
                else
                {
                    
                    $scope.dg_ds.push(response);
                }
            }
           



        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        //Transaction.Aid.save($scope.entity, function (data) {

        //    $scope.clearEntity();


        //    General.ShowNotify('تغییرات با موفقیت ذخیره شد', 'success');

        //    $rootScope.$broadcast('onAidSaved', data);

        //    $scope.$apply(function () {
        //        $scope.loadingVisible = false;
        //        if (!$scope.isNew)
        //            $scope.popup_add_visible = false;
        //    });

        //}, function (ex) {
        //    $scope.$apply(function () {
        //        $scope.loadingVisible = false;
        //    });
        //    General.ShowNotify(ex.message, 'error');
        //});

    };
    ///////////////////////////////////
    $scope.filters = [];

    $scope.dg_columns = [

     
        { dataField: 'Code', caption: 'Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200, sortIndex:0,sortOrder:'asc'},
        { dataField: 'Title1', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 350, },

        { dataField: 'Remark', caption: 'Remark', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },
        { dataField: 'NiraCode', caption: 'Nira Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200, },
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
        height: $(window).height() - 155,

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
        onCellPrepared: function (cellInfo) {
            if (cellInfo.rowType == "data" && cellInfo.column.dataField === 'FromAirportIATA') {

                cellInfo.cellElement.css('background', 'palegreen');
            }
            if (cellInfo.rowType == "data" && cellInfo.column.dataField === 'ToAirportIATA') {

                cellInfo.cellElement.css('background', 'lightpink');
            }
            if (cellInfo.rowType == "data" && cellInfo.column.dataField === 'FlightH') {

                cellInfo.cellElement.css('background', 'papayawhip');
            }
            if (cellInfo.rowType == "data" && cellInfo.column.dataField === 'FlightM') {

                cellInfo.cellElement.css('background', 'papayawhip');
            }
            //papayawhip
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

    ///////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {

        $rootScope.page_title = '> Charterers';
        $('.chrs').fadeIn();
    }
    //////////////////////////////////////////
    $scope.$on('getFilterResponse', function (event, prms) {

        $scope.filters = prms;

        $scope.doRefresh = true;
        $scope.bindRoutes();
    });
    $scope.$on('onTemplateSearch', function (event, prms) {

        $scope.$broadcast('getFilterQuery', null);
    });
    $scope.$on('onRouteSaved', function (event, prms) {

        $scope.doRefresh = true;
    });
    $scope.$on('onRouteHide', function (event, prms) {
        alert($scope.doRefresh);
        $scope.bindRoutes();

    });
    $scope.$on('$viewContentLoaded', function () {
        setTimeout(function () {

            $scope.bindDelays();
        }, 1000);
       
    });
    //////////////////////////////////////////
    $rootScope.$broadcast('AirportLoaded', null);
    ///end
}]);