'use strict';
app.controller('rawcmdController', ['$scope', '$location', '$routeParams', '$rootScope', 'personService', 'authService', 'notificationService', 'flightService', '$route', 'trnService', '$window', '$timeout', function ($scope, $location, $routeParams, $rootScope, personService, authService, notificationService, flightService, $route, trnService, $window, $timeout) {
    $scope.prms = $routeParams.prms;


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
        sorting: {
            mode: "single"
        },

        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        //3-16
        selection: { mode: 'single' },

        columnAutoWidth: true,
        height: $(window).height() - 115,

        //columns: $scope.dg_columns2,
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
        "export": {
            enabled: true,
            fileName: "Instructors",
            allowExportSelectedData: true
        },
        
        onCellClick: function (e) {
            
        },
        
        editing: {
            allowUpdating: false,
            mode: 'cell'
        },
        bindingOptions: {
            dataSource: 'dg_ds'
        }
    };


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
    $scope.cmdText = "";
    $scope.txt_cmd = {
        height: 500,
        bindingOptions: {
            value: 'cmdText',
             
        },
    };

    $scope.msg = "";
    $scope.txt_msg = {
        height: 120,
        bindingOptions: {
            value: 'msg',

        },
    };


    $scope.user = "";
    $scope.txt_user = {
        
        bindingOptions: {
            value: 'user',

        },
    };

    $scope.password = "";
    $scope.txt_password = {

        bindingOptions: {
            value: 'password',

        },
    };


    $scope.btn_run = {
        text: 'Select',
        type: 'success',
      
        width: 120,

        bindingOptions: {},
        onClick: function (e) {

            $scope.run();
        }

    };

    $scope.btn_exe = {
        text: 'Execute',
        type: 'danger',

        width: 120,

        bindingOptions: {},
        onClick: function (e) {
            General.Confirm(Config.Text_DeleteConfirm, function (res) {
                if (res) {
                    $scope.execute();
                     
                    

                }
            });
          
        }

    };

    $scope.run = function () {
        var _type = 1;
        var _sql = $scope.cmdText;
        var dto = {

            type: _type,
            sql: _sql,
            user: $scope.user,
            pass: $scope.password
            
        };
        $scope.loadingVisible = true;
        flightService.runRaw(dto).then(function (response) {
              
            $scope.loadingVisible = false;
            var _data = response.Data;
            $scope.msg = response.Message;
            $scope.dg_ds = _data;


            //return Ok(new
            //    {
            //        IsSuccess = 1,
            //        Data = results,
            //        Message="",
            //    });


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    };

    $scope.execute = function () {
        var _type = 2;
        var _sql = $scope.cmdText;
        var dto = {

            type: _type,
            sql: _sql,
            user: $scope.user,
            pass: $scope.password

        };
        $scope.loadingVisible = true;
        flightService.runRaw(dto).then(function (response) {

            $scope.loadingVisible = false;
            var _data = response.Data;
            $scope.msg = response.Message;
            $scope.dg_ds = _data;


            //return Ok(new
            //    {
            //        IsSuccess = 1,
            //        Data = results,
            //        Message="",
            //    });


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    };





    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> RAW';
        $('.rawcmd').fadeIn();
    }
    ///end
}]);