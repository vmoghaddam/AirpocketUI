'use strict';
app.controller('rptCityPairDailyController', ['$scope', '$compile', '$location', '$routeParams', '$rootScope', 'flightService', 'aircraftService', 'authService', 'notificationService', '$route', 'flightBagService', '$sce', function ($scope, $compile, $location, $routeParams, $rootScope, flightService, aircraftService, authService, notificationService, $route, flightBagService, $sce) {



    $scope.ds_rptCPD = [];

    $scope.dg_rptCPD = {

        height: $(window).height() - 110,
        selection: { mode: 'single' },
        scrolling: { mode: 'infinite' },
        showRowLines: true,
        showColumnLines: true,
        filterRow: {
            visible: true,
            showOperationChooser: true,
        },

        onInitialized: function (e) {
            $scope.dgInstance = e.component;
        
        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];
            $scope.selectedRow = data;
        },

        bindingOptions: {
            dataSource: 'ds_rptCPD'
        }
        
    };

   

    //////////////////////////

    $scope.dt_from = new Date();
    $scope.dt_to = new Date();
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
    $scope.btn_persiandate = {
        //text: 'Search',
        type: 'default',
        icon: 'event',
        width: 35,
        //validationGroup: 'dlasearch',
        bindingOptions: {},
        onClick: function (e) {

            $scope.popup_date_visible = true;
        }

    };
    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 120,
        // validationGroup: 'crewreportsearch',
        bindingOptions: {},
        onClick: function (e) {

            $scope.dg_ds = null;
            $scope.bind();
        }

    };
    $scope.popup_date_visible = false;
    $scope.popup_date_title = 'Date Picker';
    var pd1 = null;
    var pd2 = null;
    $scope.popup_date = {
        title: 'Shamsi Date Picker',
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 200,
        width: 300,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,


        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {
            // $(e.titleElement).addClass('vahid');
            // $(e.titleElement).css('background-color', '#f2552c');
        },
        onShowing: function (e) {




        },
        onShown: function (e) {

            pd1 = $(".date1").pDatepicker({
                format: 'l',
                autoClose: true,
                calendar: {
                    persian: {
                        locale: 'en'
                    }
                },
                onSelect: function (unix) {

                    //console.log(new Date(unix));
                    $scope.$apply(function () {

                        $scope.dt_from = new Date(unix);
                    });

                },

            });
            pd1.setDate(new Date($scope.dt_from.getTime()));
            pd2 = $(".date2").pDatepicker({
                format: 'l',
                autoClose: true,
                calendar: {
                    persian: {
                        locale: 'en'
                    }
                },
                onSelect: function (unix) {
                    $scope.$apply(function () {
                        $scope.dt_to = new Date(unix);
                    });
                },

            });
            pd2.setDate(new Date($scope.dt_to.getTime()));

        },
        onHiding: function () {
            pd1.destroy();
            pd2.destroy();
            $scope.popup_date_visible = false;

        },
        showCloseButton: true,
        bindingOptions: {
            visible: 'popup_date_visible',



        }
    };
    $scope.bind = function () {
        var dt = $scope.dt_to ? new Date($scope.dt_to) : new Date(2200, 4, 19, 0, 0, 0);
        var df = $scope.dt_from ? new Date($scope.dt_from) : new Date(1900, 4, 19, 0, 0, 0);
        var _df = moment(df).format('YYYY-MM-DD');
        var _dt = moment(dt).format('YYYY-MM-DD');
        $scope.loadingVisible = true;
        flightService.get_rptCPD(_df, _dt).then(function (data) {
         
            $scope.loadingVisible = false;
            $scope.ds_rptCPD = data;
            $scope.dg_rptCPD.dataSource = data;
            if ($scope.dgInstance) {
                $scope.dgInstance.option('dataSource', data);
                $scope.dgInstance.refresh();
            }

        }).catch(function (errorMsg) {
            console.error("Error loading rptCPD:", errorMsg);
            
        });


    };

    //////////////////////////
    $scope.$on('onTemplateSearch', function (event, prms) {

        $scope.$broadcast('getFilterQuery', null);
    });

 if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
     $rootScope.page_title = ' > report City Pair Daily';
    }


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
    $scope.$on('$viewContentLoaded', function () {
        $scope.bind();
    });


}]);