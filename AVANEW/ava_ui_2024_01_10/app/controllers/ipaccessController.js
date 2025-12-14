'use strict';
app.controller('ipaccessController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'aircraftService', 'authService', 'notificationService', '$route', function ($scope, $location, $routeParams, $rootScope, flightService, aircraftService, authService, notificationService, $route) {
    $scope.prms = $routeParams.prms;
    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 120,
        validationGroup: 'ctrsearch',
        bindingOptions: {},
        onClick: function (e) {
    
            $scope.dg_access_ds = null;
           
            $scope.getUsers();
        }

    };
    $scope.dto = {
        UserName: '',
        FirstName: '',
        LastName: '',
        Email: '',
        Password: '',
    };
    function generatePassword() {
        var length = 8;
        var capital="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var numbers="0123456789";
        var charset = "abcdefghijklmnopqrstuvwxyz";
        var retVal = "";
        retVal += capital.charAt(Math.floor(Math.random() *capital.length));
        for (var i = 0, n = charset.length; i < 4; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        for (var i = 0, n = numbers.length; i < 2; ++i) {
            retVal += numbers.charAt(Math.floor(Math.random() * n));
        }
        retVal += "@";
        return retVal;
    }
    $scope.btn_new = {
        text: 'New',
        type: 'default',
        icon: 'plus',
        width: 120,
        onClick: function (e) {
           
            $scope.popup_add_visible = true;
        },


    };
    
    $scope.btn_delete = {
        text: 'Delete',
        type: 'danger',
        icon: 'clear',
        width: 120,
        
        onClick: function (e) {

            console.log($scope.ipKeys);
             
            //var selected = $rootScope.getSelectedRow($scope.dg_flight_total_instance);
            if (!$scope.ipKeys || $scope.ipKeys.length==0) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }

            General.Confirm(Config.Text_DeleteConfirm, function (res) {
                if (res) {

                    var dto = { Id: $scope.ipKeys.join('_'), };
                    $scope.loadingVisible = true;
                    flightService.deleteIPs(dto).then(function (response) {
                        $scope.loadingVisible = false;
                        General.ShowNotify(Config.Text_SavedOk, 'success');
                        $scope.dg_access_ds = null;
                        
                        
                        $scope.getUsers();



                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify2(err.message, 'error', 5000); });

                }
            });
        }
    };
    ///////////////////////////////////
    $scope.formatMinutes = function (mm) {
        return pad(Math.floor(mm / 60)).toString() + ':' + pad(mm % 60).toString();
    };
    $scope.getUsers = function () {

        $scope.loadingVisible = true;
        flightService.getIPAccess().then(function (response) {
            $scope.loadingVisible = false;

            $scope.dg_access_ds = response;



        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };

 
     
    //////////////////////////////////
    
    $scope.IsDisabled = false;
    $scope.ips = null;
    $scope.users = [];
    $scope.txt_ips = {
        hoverStateEnabled: false,
         height:100,
        bindingOptions: {
            value: 'ips',
             

        }
    };
    $scope.getDatasourceUsers = function () {
        return new DevExpress.data.DataSource({
            store:

                new DevExpress.data.ODataStore({
                    url: $rootScope.serviceUrl + 'odata/aspnetusers',
                    //  key: "Id",
                    // keyType: "Int32",
                    version: 4
                }),
            //filter: ['ParentId', '=', pid],
            sort: ['UserName'],
        });
    };
    $scope.tag_users = {
        dataSource:$scope.getDatasourceUsers(),
        displayExpr: 'UserName',
        valueExpr: 'Id',
        hideSelectedItems: true,
        searchEnabled: true,
        showSelectionControls: true,
        applyValueMode: "instantly",

        showClearButton: true,
         
        bindingOptions: {
           // dataSource: 'roles',
            value: 'users',

        }
    };
    //////////////////////////////////////
    $scope.popup_add_visible = false;
    $scope.popup_add_title = 'New';
    $scope.popup_instance = null;
    $scope.popup_add = {

        fullScreen: false,
        showTitle: true,
        width: 500,
        height: 440,
        toolbarItems: [

            { widget: 'dxButton', location: 'after', options: { type: 'success', text: 'Save', icon: 'check', validationGroup: 'ipsadd', bindingOptions: {} }, toolbar: 'bottom' },
            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }
        ],

        visible: false,
        dragEnabled: true,
        closeOnOutsideClick: false,
        onShowing: function (e) {


        },
        onShown: function (e) {


        },
        onHiding: function () {

            // $scope.clearEntity();
            $scope.dg_access_ds = null;
            $scope.ips = null;
            $scope.users = [];
            $scope.getUsers();
            $scope.popup_add_visible = false;

        },
        onContentReady: function (e) {
            if (!$scope.popup_instance)
                $scope.popup_instance = e.component;

        },
        bindingOptions: {
            visible: 'popup_add_visible',

        }
    };
    $scope.popup_add.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_add_visible = false;
    };

    //save button
    $scope.popup_add.toolbarItems[0].options.onClick = function (e) {
        //sook
       // alert($scope.dto.Roles);
        var result = e.validationGroup.validate();

        if (!result.isValid) {
            General.ShowNotify(Config.Text_FillRequired, 'error');
            return;
        }
         
        $scope.loadingVisible = true;
        var dto = {};
        if ($scope.users == null || $scope.users.length == 0)
            dto.users = "*";
        else
            dto.users = $scope.users.join('_');
        dto.ips = $scope.ips;
        $scope.loadingVisible = true;
        flightService.saveIPs(dto).then(function (response) {
            $scope.loadingVisible = false;
            $scope.getUsers();
            $scope.popup_add_visible = false;
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        ///////////////////////////////

        
        

    };
    /////////////////////////////////////
   
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
    $scope.dg_access_columns = [


         { dataField: 'IP', caption: 'IP', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left',width:300,sortIndex:0,sortOrder:'desc' },
         
           { dataField: 'UserName', caption: 'UserName', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left' },
         
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
        keyExpr:'Id',
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
    
    //////////////////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
        
    }
    else if ($rootScope.userName.toLowerCase() != 'razbani' && $rootScope.userName.toLowerCase() != 'it.razbani' && $rootScope.userName.toLowerCase() != 'demo'
         && $rootScope.userName.toLowerCase() != 'it.tanha')
        $rootScope.navigatehome();
    else {
        $rootScope.page_title = '> User/IP Access';


        $('.ipaccess').fadeIn(400, function () {
           
        });
    }
    //////////////////////////////////////////

    $scope.$on('$viewContentLoaded', function () {


    });

    $rootScope.$broadcast('CrewTimeReportLoaded', null);

}]);