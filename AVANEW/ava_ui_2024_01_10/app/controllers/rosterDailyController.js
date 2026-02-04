'use strict';
app.controller('rosterDailyController', ['$scope', '$location', '$routeParams', '$rootScope', '$q', 'flightService', 'aircraftService', 'authService', 'notificationService', '$route', '$http', function ($scope, $location, $routeParams, $rootScope, $q, flightService, aircraftService, authService, notificationService, $route, $http) {
    $scope.prms = $routeParams.prms;

    //////////////////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> Daily Roster';
        //  $('#resourceGantt').height($(window).height() - 45 - 100);

        $('.dailyroster').fadeIn(400, function () {
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
            //$scope.$broadcast('getFilterQuery', null);
            $scope.bind();
        }

    };

    $scope.btn_notify = {
        text: 'Notify',
        type: 'default',
        
        width: 120,
        
        bindingOptions: {},
        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRows($scope.dg_instance);
            var ids = Enumerable.From($scope.dg_selected).Select('$.Id').ToArray();
            if (ids.length == 0)
                return;
         
            var _dt = moment($scope.dt_from).format('YYYY-MM-DDTHH:mm:ss');
            var dto = {
                Day: _dt,
                Ids: ids.join("_"),
                Test:0
            };
            //odata/crew/report/main?date=' + _dt
            $scope.loadingVisible = true;
            flightService.notifyDailyRoster(dto).then(function (response) {
                $scope.loadingVisible = false;
                

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        }
    };

    $scope.IsPickupVisible = $rootScope.HasMenuAccess('notify_pickup', 3);

    $scope.btn_notifypickup = {
        text: 'Notify PickUp Time',
        type: 'default',

        width: 250,

        bindingOptions: {visible:'IsPickupVisible'},
        onClick: function (e) {
            //$scope.dg_selected = $rootScope.getSelectedRows($scope.dg_instance);
            //var ids = Enumerable.From($scope.dg_selected).Select('$.Id').ToArray();
            //if (ids.length == 0)
            //    return;
            //console.log($scope.dg_selected);
            //var _dt = moment($scope.dt_from).format('YYYY-MM-DDTHH:mm:ss');

            $scope.Notify.Message = null;
            $scope.popup_notify_visible = true;
            //var dto = {
            //    Day: _dt,
            //    Ids: ids.join("_"),
            //    Test: 0
            //};
            ////odata/crew/report/main?date=' + _dt
            //$scope.loadingVisible = true;
            //flightService.notifyDailyRoster(dto).then(function (response) {
            //    $scope.loadingVisible = false;


            //}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        }
    };

    $scope.btn_notifytest = {
        text: 'Notify Test',
        type: 'danger',

        width: 200,

        bindingOptions: {},
        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRows($scope.dg_instance);
            var ids = Enumerable.From($scope.dg_selected).Select('$.Id').ToArray();
            if (ids.length == 0)
                return;
            var _dt = moment($scope.dt_from).format('YYYY-MM-DDTHH:mm:ss');
            var dto = {
                Day: _dt,
                Ids: ids.join("_"),
                Test:1,
            };
            //odata/crew/report/main?date=' + _dt
            $scope.loadingVisible = true;
            flightService.notifyDailyRoster(dto).then(function (response) {
                $scope.loadingVisible = false;


            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        }
    };
    //////////////////////////////////
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
    //////////////////////////////////
    $scope.dg_selected = null;
    $scope.dg_columns = [
        { dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200, fixed: false, fixedPosition: 'left' },
        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left' },

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
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'multiple' },

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
                
               
                $scope.dg_leg_ds = null;

            }
            else {
                
                $scope.bindLegs(data.Id);
                

            }


        },
        height: $(window).height() - 155,
        bindingOptions: {
            dataSource: 'dg_ds', //'dg_employees_ds',
            // height: 'dg_employees_height'
        }
    };
    ////////////////////////////////
    $scope.dg_leg_columns = [
      { dataField: 'IsPositioning', caption: 'DH', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 100, },
    {
        dataField: 'DepartureLocal', caption: 'Date', allowResizing: true, dataType: 'datetime', allowEditing: false, width: 130, alignment: 'center', format: 'yyyy-MMM-dd',

    },
     { dataField: 'FlightNumber', caption: 'Flight No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false,  },
       { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
       { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
      
       {
           dataField: 'DepartureLocal', caption: 'Departure', allowResizing: true, dataType: 'datetime', allowEditing: false,  alignment: 'center', format: 'HH:mm',  

       },
       { dataField: 'ArrivalLocal', caption: 'Arrival', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 130, format: 'HH:mm' },
    
     

    ];

    $scope.dg_leg_selected = null;
    $scope.dg_leg_instance = null;
    $scope.dg_leg_ds = null;
    $scope.dg_leg_height = null;
    $scope.dg_leg = {
        grouping: {
            autoExpandAll: true,
            allowCollapsing: true,
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


        columns: $scope.dg_leg_columns,
        onContentReady: function (e) {
            if (!$scope.dg_leg_instance)
                $scope.dg_leg_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {

                $scope.dg_leg_selected = null;



            }
            else {
                $scope.dg_leg_selected = data;


            }


        },
        //height: function () {
        //    return window.innerHeight - 175;
        //},
        height: '100%',
        bindingOptions: {
            dataSource: 'dg_leg_ds', //'dg_employees_ds',
            // height: 'dg_reg_height'
        }
    };
    ///////////////////////////////
    $scope.bind = function () {
        var _dt = moment($scope.dt_from).format('YYYY-MM-DDTHH:mm:ss');
        //odata/crew/report/main?date=' + _dt
        $scope.loadingVisible = true;
        flightService.getDailyRosterCrew(_dt).then(function (response) {
            $scope.loadingVisible = false;
            $scope.dg_ds = response;

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };

    $scope.bindLegs = function (cid) {
        var _dt = moment($scope.dt_from).format('YYYY-MM-DDTHH:mm:ss');
        //odata/crew/report/main?date=' + _dt
        $scope.loadingVisible = true;
        flightService.getDailyRosterFlights(_dt,cid).then(function (response) {
            $scope.loadingVisible = false;
            $scope.dg_leg_ds = response;

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };


    $scope.Notify = {
        ModuleId: 3,
        TypeId: 10023,

        SMS: true,
        Email: true,
        App: true,
        Message: null,
        CustomerId: Config.CustomerId,
        SenderId: null,
        Employees: [],
        Names: [],
    };
    $scope.txt_MessageNotify = {
        hoverStateEnabled: false,
        height: 422,
        bindingOptions: {
            value: 'Notify.Message',

        }
    };

    /////////////////////////////////////
    $scope.dg_emp_columns = [

           { dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200, },
             { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left' },
             { dataField: 'Mobile', caption: 'Monile', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
             

    ];
    $scope.dg_emp_selected = null;
    
    $scope.dg_emp_instance = null;
    $scope.dg_emp_ds = null;
    $scope.selectedEmps = null;
    $scope.recs = [];
    $scope.bindRecs = function () {
        //alert($scope.selectedEmps);
        $scope.recs = Enumerable.From($scope.dg_emp_ds).Where(function (x) { return $scope.selectedEmps.indexOf(x.Id) != -1;}).OrderBy('$.Name').ToArray();
    };
    $scope.dg_emp = {
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
        selection: { mode: 'multiple' },

        columnAutoWidth: false,
        height: 510,

        columns: $scope.dg_emp_columns,
        onContentReady: function (e) {
            if (!$scope.dg_emp_instance)
                $scope.dg_emp_instance = e.component;

        },
        onRowPrepared: function (e) {



        },
        keyExpr:'Id',
        onSelectionChanged: function (e) {
            $scope.bindRecs();
            //var data = e.selectedRowsData[0];

            //if (!data) {
            //    $scope.dg_crew_selected = null;
            //    $scope.rowCrew = null;
            //    $scope.crewTempRow = { Valid: true, Duty7: 0, Duty14: 0, Duty28: 0, Flight28: 0, FlightYear: 0, Duty7Class: '', Duty14Class: '', Duty28Class: '', Flight28Class: '', FlightYearClass: '' };
            //    $scope.outputTemps = [];
            //    $scope.crewTempFDPs = [];
            //}
            //else {
            //    $scope.dg_crew_selected = data;
            //    $scope.rowCrew = data;

            //    $scope.getTempDuties();
            //}


        },


        bindingOptions: {
            dataSource: 'dg_emp_ds',
            selectedRowKeys: 'selectedEmps',
        }
    };
    var getEmployees = function () {

        var deferred = $q.defer();
        $http.get($rootScope.serviceUrl + 'odata/employees/light/' + Config.CustomerId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    $scope.bindEmployees = function () {
         $scope.dg_selected = $rootScope.getSelectedRows($scope.dg_instance);
          
        if (!$scope.dg_emp_ds) {
            $scope.loadingVisible = true;
            getEmployees().then(function (emps) {
                $scope.loadingVisible = false;
                $scope.dg_emp_ds = emps;
                $scope.selectedEmps = Enumerable.From($scope.dg_selected).Select('$.Id').ToArray();
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        }
        else
        {
            $scope.selectedEmps = Enumerable.From($scope.dg_selected).Select('$.Id').ToArray();
        }
    };
    /////////////////////////////////////
    $scope.dsNotificationType = [
        { Id: 10023, Title: 'Pickup Notification' },
        { Id: 10025, Title: 'Training Notification' },
         { Id: 10022, Title: 'Career Notification' },
    ];
    $scope.selectedNotificationTypeId = 10023;
    $scope.sb_notification= {
        dataSource: $scope.dsNotificationType,
        showClearButton: false,
        searchEnabled: false,
        readOnly:true,
        searchExpr: ["Title"],
        valueExpr: "Id",
        displayExpr: "Title",
        bindingOptions: {
            value: 'selectedNotificationTypeId',

        },
        

    };
    $scope.popup_notify_visible = false;
    $scope.popup_notify_title = 'Notify';
    $scope.popup_notify = {

        fullScreen: false,
        showTitle: true,
        height: 800,
        width: 1200,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Send', icon: 'check',validationGroup: 'notmessage', onClick: function (e) {
                        var result = e.validationGroup.validate();
                        if (!result.isValid)
                        {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        //cmnt
                        $scope.Notify.ObjectId = -1;
                        $scope.Notify.Message = $scope.Notify.Message.replace(/\r?\n/g, '<br />');
                        var temp = Enumerable.From($scope.recs).Select('{EmployeeId:$.Id,Name:$.Name}').ToArray();
                        $.each(temp, function (_i, _d) {
                            $scope.Notify.Employees.push(_d.EmployeeId);
                            $scope.Notify.Names.push(_d.Name);
                        });
                        console.log($scope.Notify);
                        $scope.Notify.TypeId = $scope.selectedNotificationTypeId;
                        //$scope.Notify.Employees=  Enumerable.From($scope.selectedEmployees).Select('$.EmployeeId').ToArray();
                        $scope.loadingVisible = true;
                        notificationService.notify2($scope.Notify).then(function (response) {

                            $scope.loadingVisible = false;


                            General.ShowNotify(Config.Text_SavedOk, 'success');

                            $scope.Notify = {
                                ModuleId: $rootScope.moduleId,
                                TypeId: 10023,

                                SMS: true,
                                Email: true,
                                App: true,
                                Message: null,
                                CustomerId: Config.CustomerId,
                                SenderId: null,
                                Employees: [],
                                Names: [],
                            };

                           
                            $scope.popup_notify_visible = false;




                        }, function (err) { $scope.loadingVisible = false; $scope.popup_notify_visible = false; General.ShowNotify(err.message, 'error'); });




                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_notify_visible = false;
                    }
                }, toolbar: 'bottom'
            }
        ],

        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: false,
        onShowing: function (e) {



        },
        onShown: function (e) {

            $scope.bindEmployees();
        },
        onHiding: function () {

            $scope.dg_emp_instance.clearSelection();

            $scope.Notify = {
                ModuleId: $rootScope.moduleId,
                TypeId: 97,

                SMS: true,
                Email: true,
                App: true,
                Message: null,
                CustomerId: Config.CustomerId,
                SenderId: null,
                Employees: [],
                Names: [],
            };
            $scope.popup_notify_visible = false;
            // $rootScope.$broadcast('onPersonHide', null);
        },
        //position: 'right',
        bindingOptions: {
            visible: 'popup_notify_visible',

            title: 'popup_notify_title',

        }
    };
    //////////////////////////////

   
    $scope.$on('$viewContentLoaded', function () {
        
        setTimeout(function () {
            $scope.dg_ds = null;

            $scope.bind();
        }, 500);
    });
    ///////////////////////////

}]);