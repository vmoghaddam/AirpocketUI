'use strict';
app.controller('teachersController', ['$scope', '$location', '$routeParams', '$rootScope', 'personService', 'authService', 'notificationService', 'flightService', '$route', 'trnService', '$window', '$timeout', function ($scope, $location, $routeParams, $rootScope, personService, authService, notificationService, flightService, $route, trnService, $window, $timeout) {
    $scope.prms = $routeParams.prms;
    $scope.IsEditable = $rootScope.IsProfileEditable(); //$rootScope.roles.indexOf('Admin') != -1;
    $scope.IsCoursesVisible = $rootScope.roles.indexOf('Admin') != -1 || $rootScope.userName.toLowerCase() == 'abbaspour' || $rootScope.userName.toLowerCase() == 'dehghan';
    $scope.IsAccountEdit = $rootScope.roles.indexOf('Crew Scheduler') != -1;

     

    $scope.editButtonIcon = 'edit';
    $scope.editButtonText = 'Edit';
    $scope.isCrew = $route.current.isCrew;
    if (!$scope.IsEditable) {
        $scope.editButtonText = 'View';
        $scope.editButtonIcon = 'card';
    }
    //////////////////////////////////
    $scope.dsUrl = null;
    $scope.filterVisible = false;
    $scope.btn_delete = {
        text: 'Delete',
        type: 'danger',
        icon: 'clear',
        width: 120,
        bindingOptions: {
            visible: 'IsEditable'
        },
        onClick: function (e) {

            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            if ($scope.dg_selected.CourseCount > 0) {
                General.ShowNotify('The record cannot be deleted', 'error');
                return;
            }
            General.Confirm(Config.Text_DeleteConfirm, function (res) {
                if (res) {

                    var dto = { id: $scope.dg_selected.Id, };
                    $scope.loadingVisible = true;
                    trnService.deleteTeacher(dto).then(function(response) {
                        $scope.loadingVisible = false;
                        General.ShowNotify(Config.Text_SavedOk, 'success');
                         
                        $scope.bind();



                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify2(err.message, 'error', 5000); });

                }
            });
        }
    };
    $scope.btn_view = {
        text: 'View',
        type: 'default',
        icon: 'card',
        width: 120,
        visible: false,
        bindingOptions: {},
        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var data = $scope.dg_selected;
            $rootScope.$broadcast('InitViewPerson', data);
        }

    };
    $scope.isEdit = false;
    $scope.btn_new = {
        text: 'New',
        type: 'default',
        icon: 'plus',
        width: 120,
        onClick: function (e) {
            $scope.isEdit = false;
            $scope.popup_add_visible = true;
        },
        bindingOptions: {
            visible: 'IsEditable'
        }

    };

  

    $scope.btn_edit = {
        // text: 'Edit',
        type: 'default',
        // icon: 'edit',
        width: 120,
        bindingOptions: {
            icon: 'editButtonIcon',
            text: 'editButtonText',
        },
        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var data = $scope.dg_selected;
            $scope.isEdit = true;
            $scope.popup_add_visible = true;

        }

    };
    //$scope.btn_view = {
    //    text: 'View',
    //    type: 'default',
    //    icon: 'doc',
    //    width: 120,
    //    onClick: function (e) {
    //        $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
    //        if (!$scope.dg_selected) {
    //            General.ShowNotify(Config.Text_NoRowSelected, 'error');
    //            return;
    //        }
    //        var data = $scope.dg_selected;
    //        $scope.InitAddAirport(data);
    //    }

    //};
    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 120,

        bindingOptions: {},
        onClick: function (e) {

            $scope.bind();
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
        //{
        //    cellTemplate: function (container, options) {
        //        $("<div style='text-align:center'/>")
        //            .html(options.rowIndex + 1)
        //            .appendTo(container);
        //    }, caption: '#', width: 60, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        //},
        {
            dataField: "ImageUrl",
            width: 80,
            alignment: 'center',
            caption: '',
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {
                $("<div>")
                    .append($("<img>", { "src": $rootScope.clientsFilesUrl + (options.value ? options.value : 'imguser.png'), "css": { height: '50px', width: '50px', borderRadius: '100%' } }))
                    .appendTo(container);
            }
        },
        {
            caption: 'Base',
            columns: [
                // { dataField: 'FirstName', caption: 'First Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false,width:150 },
                //{
                //    dataField: "ImageUrl",
                //    width: 100,
                //    allowFiltering: false,
                //    allowSorting: false,
                //    cellTemplate: function (container, options) {
                //        $("<div>")
                //            .append($("<img>", { "src": (options.value ? $rootScope.clientsFilesUrl + options.value:'../../content/images/imguser.png') }))
                //            .css('width','50px')
                //            .appendTo(container);
                //    }
                //},
                { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 250 },
                { dataField: 'ScheduleName', caption: 'Schedule', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },
                { dataField: 'NID', caption: 'National Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
                { dataField: 'Mobile', caption: 'Mobile', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
                { dataField: 'Email', caption: 'Email', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },
                { dataField: 'DateJoinAvation', caption: 'Join Aviation', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },
                { dataField: 'Age', caption: 'Age', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 50 },
            ]
        },
        {
            caption: 'Organizational',
            columns: [
                { dataField: 'PID', caption: 'Personnel Id', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
                { dataField: 'Location', caption: 'Department', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },
                { dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 130 },
                { dataField: 'DateJoinCompany', caption: 'Join Company', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },

            ]
        },
        {
            caption: 'Passport',
            columns: [
                // { dataField: 'PassportNumber', caption: 'No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
                // { dataField: 'DatePassportIssue', caption: 'Issue', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },
                // { dataField: 'DatePassportExpire', caption: 'Expire', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },
                { dataField: 'RemainPassport', caption: 'Remain', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90 },
                //{ dataField: 'IsPassportExpired', caption: 'Expired', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 80 },
            ]
        },
        {
            caption: 'Medical Checkup',
            columns: [

                // { dataField: 'DateLastCheckUP', caption: 'Last', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 150 },
                // { dataField: 'DateNextCheckUP', caption: 'Next', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 150 },
                { dataField: 'RemainMedical', caption: 'Remain', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90 },
                // { dataField: 'IsMedicalExpired', caption: 'Expired', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 80 },
            ]
        },
        {
            caption: 'CAO',
            columns: [
                // { dataField: 'CaoCardNumber', caption: 'No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },

                //  { dataField: 'DateCaoCardIssue', caption: 'Issue', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },
                // { dataField: 'DateCaoCardExpire', caption: 'Expire', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },
                { dataField: 'RemainCAO', caption: 'Remain', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90 },
                // { dataField: 'IsCAOExpired', caption: 'Expired', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 80 },

            ]
        }
        ,
        {
            caption: 'NDT',
            columns: [
                // { dataField: 'NDTNumber', caption: 'No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },

                // { dataField: 'DateIssueNDT', caption: 'Issue', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },
                //{ dataField: 'DateExpireNDT', caption: 'Expire', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },
                { dataField: 'RemainNDT', caption: 'Remain', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90 },
                // { dataField: 'IsNDTExpired', caption: 'Expired', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 80 },

            ]
        }
        //{ dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },
        //{ dataField: 'IATA', caption: 'IATA', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        //{ dataField: 'ICAO', caption: 'ICAO', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        //{ dataField: 'City', caption: 'City', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },
        //{ dataField: 'SortName', caption: 'Sort Name', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        //{ dataField: 'Country', caption: 'Country', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
    ];

    $scope.rankDs = ['TRI', 'TRE', 'LTC', 'P1', 'P2', 'ISCCM', 'SCCM', 'CCM'];
    $scope.groupDs = ['Cockpit', 'Cabin'];
    $scope.dg_columns2 = [

      
       // { dataField: 'InActive', caption: 'InActive', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: true, width: 70, fixed: true, fixedPosition: 'left' },
        
        { dataField: 'CourseCount', caption: 'CRS', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 70, fixed: true, fixedPosition: 'left' },
        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 240, fixed: true, fixedPosition: 'left' },
       // { dataField: 'FirstName', caption: 'First Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 250, fixed: false, fixedPosition: 'left' },
        { dataField: 'Mobile', caption: 'Mobile', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
        { dataField: 'NID', caption: 'NID', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
      
        { dataField: 'Email', caption: 'Email', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width:150 },
        {
            dataField: 'JobGroup', caption: 'Group', allowResizing: true
            , lookup: {

                dataSource: $scope.rankDs

            }
            , alignment: 'center', dataType: 'string', allowEditing: false, width: 150,  
        },
        { dataField: 'RemarkTeacher', caption: 'Remark', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, minWidth:200 },
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

        columnAutoWidth: false,
        height: $(window).height() - 115,

        columns: $scope.dg_columns2,
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
                $scope.bindCourses(data.Id);
            }


        },
        "export": {
            enabled: true,
            fileName: "Instructors",
            allowExportSelectedData: true
        },
        onToolbarPreparing: function(e) {
            e.toolbarOptions.items.unshift({
                location: "before",
                template: function() {
                    return $("<div/>")
                        // .addClass("informer")
                        .append(
                            "<span style='color:white;'>Instructors</span>"
                        );
                }
            });
        },
        onCellClick: function (e) {
            //if (e.column.dataField == 'InActive') {
            //    General.Confirm("Are you sure?", function (res) {
            //        if (res) {

            //            var newvalue = !e.value;
            //            e.data.InActive = newvalue;
            //            personService.active({ Id: e.data.Id }).then(function (response) {

            //                $scope.dg_instance.refresh(true);

            //            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            //        }
            //    });


            //}
        },
        onRowPrepared: function (e) {
            if (e.data && e.data.EmployeeId)
                e.rowElement.css('background', '#ccf5ff');
             
        },
        editing: {
            allowUpdating: false,
            mode: 'cell'
        },
        bindingOptions: {
            dataSource: 'dg_ds'
        }
    };

    $scope.styleCell = function (e, value) {
        if (value && value == 1000000) {
            //#a6a6a6

            return;
        }
        if (value > 45)
            return;
        //moradi2

        if ((!value && value !== 0) || value == -100000) {
            //#a6a6a6
            e.cellElement.css("backgroundColor", "#a6a6a6");
            e.cellElement.css("color", "#fff");
            return;
        }
        if (value > 30 && value <= 45) {
            e.cellElement.css("backgroundColor", "#ffd633");
            e.cellElement.css("color", "#000");
        }
        else if (value > 0 && value <= 30) {
            e.cellElement.css("backgroundColor", "#ffa64d");
            e.cellElement.css("color", "#000");
        }
        else if (value <= 0) {
            e.cellElement.css("backgroundColor", "#ff471a");
            e.cellElement.css("color", "#fff");
        }
        //e.cellElement.css("backgroundColor", "#ffcccc");
    }
    $scope.doRefresh = false;
    $scope.showActive = false;
    $scope.rankGroup = 'Cockpit';
    $scope.sb_rankgroup = {
        width: 150,
        showClearButton: false,
        searchEnabled: false,
        dataSource: ['Cockpit', 'Cabin', 'All'],
        //readOnly:true,
        onValueChanged: function (e) {
            //moradi
            if (e.value == 'Cockpit') {
                $scope.dg_instance.columnOption('FirstAid', 'visible', false);
                $scope.dg_instance.columnOption('LPC', 'visible', true);
                $scope.dg_instance.columnOption('OPC', 'visible', true);
                $scope.dg_instance.columnOption('Licence', 'visible', true);
                $scope.dg_instance.columnOption('LPR', 'visible', true);
                $scope.dg_instance.columnOption('Line', 'visible', true);
                $scope.dg_instance.columnOption('Recurrent', 'visible', false);
            }
            //if (e.value == 'Cabin')
            else {
                $scope.dg_instance.columnOption('FirstAid', 'visible', true);
                $scope.dg_instance.columnOption('LPC', 'visible', false);
                $scope.dg_instance.columnOption('OPC', 'visible', false);
                $scope.dg_instance.columnOption('Licence', 'visible', false);
                $scope.dg_instance.columnOption('LPR', 'visible', false);
                $scope.dg_instance.columnOption('Line', 'visible', false);
                $scope.dg_instance.columnOption('Recurrent', 'visible', true);
            }
            $scope.$broadcast('getFilterQuery', null);
        },
        bindingOptions: {
            value: 'rankGroup',

        }
    };
    $scope.chk_active = {
        text: 'Only Active Employees',
        onValueChanged: function (e) {
            $scope.$broadcast('getFilterQuery', null);
        },
        bindingOptions: {
            value: 'showActive',

        }
    };

    ////////////////////
    //3-16
    $scope.btn_sms = {
        text: 'Notify',
        type: 'default',
        //icon: 'plus',
        width: 120,
        onClick: function (e) {
            //var selected = $rootScope.getSelectedRows($scope.dg_instance);
            //if (!selected) {
            //    General.ShowNotify(Config.Text_NoRowSelected, 'error');
            //    return;
            //}

            //$scope.popup_sms_visible = true;
            $scope.popup_notify2_visible = true;
        },
        bindingOptions: {

        }

    };
    //moradi2
    $scope.btn_training = {
        text: 'Training',
        type: 'default',
        //icon: 'plus',
        width: 140,
        onClick: function (e) {
            $window.open('#!/training/', '_blank');
        },
        bindingOptions: {

        }

    };
    $scope.txt_sms_message = {
        height: 300,
        bindingOptions: {
            value: 'sms_message',

        }
    };
    $scope.popup_sms_visible = false;
    $scope.popup_sms_title = 'Notification';
    $scope.popup_sms = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_sms"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 450,
        width: 600,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,

        toolbarItems: [

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Send', validationGroup: "smsmessageperson", onClick: function (arg) {

                        var result = arg.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        var selected = $rootScope.getSelectedRows($scope.dg_instance);

                        var names = Enumerable.From(selected).Select('$.Name').ToArray().join('_');
                        var mobiles = Enumerable.From(selected).Select('$.Mobile').ToArray().join('_');
                        var dto = { names: names, mobiles: mobiles, message: $scope.sms_message, sender: $rootScope.userName };
                        $scope.loadingVisible = true;

                        flightService.sendSMS(dto).then(function (response) {
                            $scope.loadingVisible = false;
                            General.ShowNotify(Config.Text_SavedOk, 'success');
                            $scope.popup_sms_visible = false;

                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



                    }
                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (arg) {

                        $scope.popup_sms_visible = false;

                    }
                }, toolbar: 'bottom'
            }
        ],
        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {
            // $(e.titleElement).addClass('vahid');
            // $(e.titleElement).css('background-color', '#f2552c');
        },
        onShowing: function (e) {

        },
        onShown: function (e) {

        },
        onHiding: function () {

            $scope.popup_sms_visible = false;

        },
        bindingOptions: {
            visible: 'popup_sms_visible',

            title: 'popup_sms_title',

        }
    };
    //////////////////////
    //2021-06-29
    //USER
    //////////////////////////////////////
    $scope.btn_user = {
        text: 'User',
        type: 'default',
        icon: 'user',
        width: 120,
        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var isCrew = $scope.dg_selected.JobGroupCode.startsWith('00101') || $scope.dg_selected.JobGroupCode.startsWith('00102');
            if (!isCrew) {
                return;
            }
            $scope.getUsers(function () {
                $scope.loadingVisible = true;
                personService.getCrewLight(Config.CustomerId, $scope.dg_selected.Id).then(function (response) {
                    $scope.loadingVisible = false;
                    var _data = response[0];
                    $scope.employee = _data;
                    $scope.dto_user.FirstName = $scope.employee.FirstName;
                    $scope.dto_user.LastName = $scope.employee.LastName;
                    $scope.dto_user.PhoneNumber = $scope.employee.Mobile;
                    $scope.dto_user.PersonId = $scope.employee.PersonId;
                    console.log($scope.employee);
                    if (!$scope.employee.UserId) {
                        $scope.user = null;
                        $scope.userId = null;
                    }
                    else {


                        $scope.user = Enumerable.From($scope.users).Where('$.Id=="' + $scope.employee.UserId + '"').FirstOrDefault();

                    }

                    $scope.dto_user.UserId = null;
                    $scope.dto_user.Id = null;
                    $scope.dto_user.UserName = null;
                    $scope.IsUserEdit = false;
                    if ($scope.user) {
                        $scope.dto_user.UserId = $scope.user.Id;
                        $scope.dto_user.UserName = $scope.user.UserName;
                        $scope.dto_user.Id = $scope.user.Id;
                        $scope.IsUserEdit = true;
                    }

                    $scope.popup_user_visible = true;
                });
            });


        },
        bindingOptions: {
            //visible: 'IsEditable'
        }

    };

    $scope.selectedPassword = null;
    $scope.btn_password = {
        text: 'Password',
        type: 'default',
        icon: 'key',
        width: 150,

        onClick: function (e) {
            $scope.selectedPassword = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.selectedPassword) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var isCrew = $scope.selectedPassword.JobGroupCode.startsWith('00101') || $scope.selectedPassword.JobGroupCode.startsWith('00102');
            if (!isCrew) {
                return;
            }
            $scope.loadingVisible = true;
            personService.getCrewLight(Config.CustomerId, $scope.selectedPassword.Id).then(function (response) {
                $scope.loadingVisible = false;
                var _data = response[0];

                if (!_data.UserId) {
                    General.ShowNotify("user not found", 'error');
                    return;
                }
                $scope.selectedPassword = _data;
                $scope.popup_password_visible = true;
            });


        }

    };
    /////////////////////////////////////
    $scope.newPassword = '';
    $scope.txt_newPassword = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'newPassword',


        }
    };
    $scope.popup_password_visible = false;
    $scope.popup_password_title = 'Password';

    $scope.popup_password = {

        fullScreen: false,
        showTitle: true,
        width: 400,
        height: 200,
        toolbarItems: [

            { widget: 'dxButton', location: 'after', options: { type: 'success', text: 'Save', icon: 'check', validationGroup: 'password', bindingOptions: {} }, toolbar: 'bottom' },
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

            $scope.popup_password_visible = false;

        },
        onContentReady: function (e) {

        },
        bindingOptions: {
            visible: 'popup_password_visible',

        }
    };
    $scope.popup_password.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_password_visible = false;
    };

    //save button
    $scope.popup_password.toolbarItems[0].options.onClick = function (e) {
        //sook
        // alert($scope.dto.Roles);
        var result = e.validationGroup.validate();

        if (!result.isValid) {
            General.ShowNotify(Config.Text_FillRequired, 'error');
            return;
        }
        var dto = { Id: $scope.selectedPassword.UserId, Password: $scope.newPassword }

        $scope.loadingVisible = true;
        authService.setPassword(dto).then(function (response) {
            $scope.loadingVisible = false;
            $scope.newPassword = '';
            $scope.popup_password_visible = false;


        },
            function (err) {
                $scope.loadingVisible = false;
                $scope.message = err.message;
                General.ShowNotify(err.message, 'error');

            });

    };
    /////////////////////////////
    $scope.dto_user = {
        UserId: null,
        UserName: null,
        Password: '1234@aA',
        FirstName: null,
        LastName: null,
        PhoneNumber: null,
        Email: '',
        PersonId: -1,
        Id: null,
    };
    $scope.popup_user_visible = false;
    $scope.popup_user_title = 'User';
    $scope.popup_user_instance = null;
    $scope.popup_user = {

        fullScreen: false,
        showTitle: true,
        width: 400,
        height: 400,
        toolbarItems: [

            { widget: 'dxButton', location: 'after', options: { type: 'success', text: 'Save', icon: 'check', validationGroup: 'useradd', bindingOptions: {} }, toolbar: 'bottom' },
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
            $scope.users = [];
            $scope.user = null;
            $scope.employeeId = null;
            $scope.userId = null;
            $scope.personId = null;
            $scope.employee = null;
            $scope.IsUserEdit = false;
            $scope.dto_user = {
                Id: null,
                UserId: null,
                UserName: null,
                Password: '1234@aA',
                FirstName: null,
                LastName: null,
                PhoneNumber: null,
                Email: '',
                PersonId: -1,
            };
            $scope.popup_user_visible = false;

        },
        onContentReady: function (e) {
            if (!$scope.popup_user_instance)
                $scope.popup_user_instance = e.component;

        },
        bindingOptions: {
            visible: 'popup_user_visible',

        }
    };
    $scope.popup_user.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_user_visible = false;
    };

    //save button
    $scope.popup_user.toolbarItems[0].options.onClick = function (e) {
        //sook

        var result = e.validationGroup.validate();

        if (!result.isValid) {
            General.ShowNotify(Config.Text_FillRequired, 'error');
            return;
        }
        $scope.dto_user.Email = $scope.dto_user.FirstName.replace(/\s/g, '') + '.' + $scope.dto_user.LastName.replace(/\s/g, '') + '@airpocket.ir';
        $scope.loadingVisible = true;
        if (!$scope.IsUserEdit) {
            //if ($scope.personId)
            //    $scope.dto.PersonId = $scope.personId;
            //else
            //    $scope.dto.PersonId = -1;
            authService.register2($scope.dto_user).then(function (response) {
                $scope.loadingVisible = false;
                $scope.dto_user = {
                    UserId: null,
                    UserName: null,
                    Password: '1234@aA',
                    FirstName: null,
                    LastName: null,
                    PhoneNumber: null,
                    Email: '',
                    PersonId: -1,
                    Id: null,
                };
                $scope.personId = null;
                $scope.popup_user_visible = false;


            },
                function (err) {
                    $scope.loadingVisible = false;
                    $scope.message = err.message;
                    General.ShowNotify(err.message, 'error');

                });
        }
        else {

            authService.updateUser($scope.dto_user).then(function (response) {
                $scope.loadingVisible = false;
                $scope.dto_user = {
                    UserId: null,
                    UserName: null,
                    Password: '1234@aA',
                    FirstName: null,
                    LastName: null,
                    PhoneNumber: null,
                    Email: '',
                    PersonId: -1,
                    Id: null,
                };
                $scope.popup_user_visible = false;


            },
                function (err) {
                    $scope.loadingVisible = false;
                    $scope.message = err.message;
                    General.ShowNotify(err.message, 'error');

                });
        }


    };
    /////////////////////////////////////
    $scope.users = [];
    $scope.getUsers = function (callback) {

        $scope.loadingVisible = true;
        authService.getUsers().then(function (response) {
            $scope.loadingVisible = false;

            $scope.users = response;
            if (callback)
                callback();


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.getDatasourceEmployees = function (cid) {
        return new DevExpress.data.DataSource({
            store:

                new DevExpress.data.ODataStore({
                    url: serviceBaseTRN + 'api/employees/details/query',
                    //version: 4
                }),

            sort: ['LastName'],
        });
    };
    $scope.isPropDisabled = false;
    $scope.isImage = true;
    $scope.employeeId = null;
    $scope.userId = null;
    $scope.user = null;
    $scope.personId = null;
    $scope.employee = null;
    $scope.IsUserEdit = false;

    $scope.txtuser_UserName = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'dto_user.UserName',

        }
    };
    $scope.txtuser_Password = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'dto_user.Password',


        }
    };
    $scope.txtuser_FirstName = {
        hoverStateEnabled: false,

        valueChangeEvent: 'keyup',
        onValueChanged: function (e) {
            // $scope.nameChanged();
        },
        readOnly: true,
        bindingOptions: {
            value: 'dto_user.FirstName',

        }
    };
    $scope.txtuser_LastName = {
        hoverStateEnabled: false,
        valueChangeEvent: 'keyup',
        onValueChanged: function (e) {
            //$scope.nameChanged();
        },
        readOnly: true,
        bindingOptions: {
            value: 'dto_user.LastName',

        }
    };
    $scope.txtuser_phone = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'dto_user.PhoneNumber',

        }
    };
  
    //////////////////////
    $scope.getFilters = function () {
        var filters = $scope.filters;
        if (filters.length == 0)
            filters = [['Id', '>', 0]];
        else {
            //filters.push('and');
            //filters.push(['OfficeCode', 'startswith', $scope.ParentLocation.FullCode]);

        }
        if ($scope.showActive)
            filters.push(['InActive', '=', false]);
        if ($scope.rankGroup != 'All')
            filters.push(['JobGroupRoot', '=', $scope.rankGroup]);

        return filters;
    };
    $scope.bind = function () {

        $scope.dg_ds = [];
        $scope.loadingVisible = true;
        trnService.getTeachers().then(function (response) {
            $scope.loadingVisible = false;
            $scope.dg_ds = response ;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    };

    $scope.bindCourses = function(id) {

        $scope.dg_courses_ds = [];
        $scope.loadingVisible = true;
        trnService.getTeacherCourses(id).then(function(response) {
            $scope.loadingVisible = false;
            $scope.dg_courses_ds = response ;


        }, function(err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    };
    ///////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> Instructors';
        $('.teachers').fadeIn();
    }
    //////////////////////////////////////////
    //training 2021-07  
    //chico
    $scope.btn_courses = {
        text: 'Courses',
        type: 'default',
        //icon: 'plus',
        width: 140,
        onClick: function (e) {
            var obj = $rootScope.getSelectedRow($scope.dg_instance);
            if (obj)
                $scope.selected_person_id = obj.PersonId;
            $scope.popup_course_visible = true;
        },
        bindingOptions: {

        }

    };
    $scope.personCourses = null;
    $scope.dg_courses_columns = [
         
        {
            dataField: 'StatusId', caption: 'Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 140, fixed: true, fixedPosition: 'left',
            lookup: {
                dataSource: [{ id: 1, title: 'Scheduled' }, { id: 2, title: 'In Progress' }, { id: 3, title: 'Done' }, { id: 4, title: 'Canceled' }],
                displayExpr: 'title',
                valueExpr: 'id',
            },
        },
        { dataField: 'DateStart', caption: 'Start', allowResizing: true, alignment: 'center', dataType: 'date', format: 'yyyy-MM-dd', allowEditing: false, width: 160, sortIndex: 0, sortOrder: "desc", fixed: true, fixedPosition: 'left' },
        { dataField: 'DateEnd', caption: 'End', allowResizing: true, alignment: 'center', dataType: 'date', format: 'yyyy-MM-dd', allowEditing: false, width: 160, fixed: true, fixedPosition: 'left' },
        { dataField: 'CourseType', caption: 'Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 250, fixed: false, fixedPosition: 'left' },
        
        
          { dataField: 'TrainingDirector', caption: 'Director', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'Organization', caption: 'Center', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'Duration', caption: 'Dur.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: true, fixedPosition: 'right' },
        //{ dataField: 'CoursePeopleStatus', caption: 'Result', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        //{ dataField: 'DateIssue', caption: 'Issue', allowResizing: true, alignment: 'center', dataType: 'date', format: 'yyyy-MM-dd', allowEditing: false, width: 150 },
        //{ dataField: 'DateExpire', caption: 'Expire', allowResizing: true, alignment: 'center', dataType: 'date', format: 'yyyy-MM-dd', allowEditing: false, width: 150 },
        //{ dataField: 'CertificateNo', caption: 'Cer. NO', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        //{ dataField: 'Instructor', caption: 'Instructor', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
      
        //{ dataField: 'No', caption: 'Class Id', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },



    ];
    $scope.dg_courses_selected = null;
    $scope.dg_courses_instance = null;
    $scope.dg_courses_ds = null;
    $scope.dg_courses_height = 620;
    $scope.dg_courses = {
        sorting: {
            mode: "single"
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
        "export": {
            enabled: true,
            fileName: "Courses",
            allowExportSelectedData: true
        },
        onToolbarPreparing: function(e) {
            e.toolbarOptions.items.unshift({
                location: "before",
                template: function() {
                    return $("<div/>")
                        // .addClass("informer")
                        .append(
                            "<span style='color:white;'>Courses</span>"
                        );
                }
            });
        },

        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'standard' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,
        // height: $(window).height()-130,

        columns: $scope.dg_courses_columns,
        onContentReady: function (e) {
            if (!$scope.dg_courses_instance)
                $scope.dg_courses_instance = e.component;

            //$scope.dg_cduties_height = $(window).height() - 131;
        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_courses_selected = null;

            }
            else {
                $scope.dg_courses_selected = data;

            }
        },

        onRowPrepared: function (e) {
            if (e.data && !e.data.IsNotificationEnabled) {
                e.rowElement.css('background', '#f2f2f2');

            }

        },
        onRowClick: function(e) {
            var component = e.component;

            function initialClick() {
                console.log('initial click for key ' + e.key);
                component.clickCount = 1;
                component.clickKey = e.key;
                component.clickDate = new Date();
            }

            function doubleClick() {
                console.log('second click');
                component.clickCount = 0;
                component.clickKey = 0;
                component.clickDate = null;
                if (e.data.CourseId) {
                    var _data = { Id: e.data.CourseId };
                    $rootScope.$broadcast('InitViewCourse', _data);
                }


            }

            if ((!component.clickCount) || (component.clickCount != 1) || (component.clickKey != e.key)) {
                initialClick();
            }
            else if (component.clickKey == e.key) {
                if (((new Date()) - component.clickDate) <= 300)
                    doubleClick();
                else
                    initialClick();
            }

        },
        summary: {
            totalItems: [
                {
                    column: "Duration",
                    summaryType: "sum",
                    customizeText: function(data) {
                        return data.value;
                    }
                },
             ]
        },
         height: $(window).height() - 115,
        bindingOptions: {
            dataSource: 'dg_courses_ds',
            
        }
    };
    /////////////////////////
    $scope.dg_arccourse_columns = [
        { dataField: 'Organization', caption: 'Organization', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 300, fixed: true, fixedPosition: 'left' },

        { dataField: 'DateStart', caption: 'DateStart', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130, sortIndex: 0, sortOrder: "desc" },
        { dataField: 'DateEnd', caption: 'DateEnd', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },
        { dataField: 'No', caption: 'Class Id', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: true, fixedPosition: 'left' },

        { dataField: 'Instructor', caption: 'Instructor', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'TrainingDirector', caption: 'Training Director', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },

        { dataField: 'Recurrent', caption: 'Recurrent', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 100 },
        { dataField: 'Duration', caption: 'Duration (hrs)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },



    ];
    $scope.dg_arccourse_selected = null;
    $scope.dg_arccourse_instance = null;
    $scope.dg_arccourses_ds = null;
    $scope.dg_arccourse_height = 540;
    $scope.dg_arccourse = {
        sorting: {
            mode: "single"
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


        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'standard' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,


        columns: $scope.dg_arccourse_columns,
        onContentReady: function (e) {
            if (!$scope.dg_arccourse_instance)
                $scope.dg_arccourse_instance = e.component;

            //$scope.dg_cduties_height = $(window).height() - 131;
        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_arccourse_selected = null;

            }
            else {
                console.log('dg_course', data);
                $scope.dg_arccourse_selected = data;
                $scope.course_Title = data.Title;
                $scope.course_OrganizationId = Number(data.OrganizationId);
                $scope.course_Location = data.Location;
                $scope.course_Instructor = data.Instructor;
                $scope.course_TrainingDirector = data.TrainingDirector;
                $scope.course_Duration = data.Duration;
                $scope.course_Interval = data.Interval;
                $scope.course_CalanderTypeId = data.CalanderTypeId;
                $scope.course_DateStart = new Date(data.DateStart);
                $scope.course_DateEnd = new Date(data.DateEnd);

            }
        },

        onRowPrepared: function (e) {

        },
        bindingOptions: {
            dataSource: 'dg_arccourses_ds',
            height: 'dg_arccourse_height',
        }
    };


    $scope.crs_result = null;
    $scope.crs_ctype = null;
    $scope.crs_cer = null;
    $scope.crs_re = null;
    $scope.crs_last = null;
    $scope.popup_course_visible = false;
    $scope.popup_course = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_course"
        },
        shading: true,
        title: 'Courses',
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 800,
        width: $(window).width() - 200,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,

        toolbarItems: [

            {
                widget: 'dxSelectBox', location: 'before', options: {
                    dataSource: [{ id: -2, title: 'All' }, { id: 1, title: 'Passed' }, { id: 0, title: 'Failed' }, { id: -1, title: 'Unknown' }],
                    displayExpr: 'title',
                    valueExpr: 'id',
                    placeholder: 'Result',
                    showClearButton: true,
                    width: 120,
                    onValueChanged: function (e) {
                        $scope.crs_result = e.value;
                    },
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxSelectBox', location: 'before', options: {
                    dataSource: $rootScope.getDatasourceCourseTypeNew(),
                    displayExpr: 'Title',
                    valueExpr: 'Id',
                    placeholder: 'Course Type',
                    searchEnabled: true,
                    showClearButton: true,
                    onValueChanged: function (e) {
                        $scope.crs_ctype = e.value;
                    },
                    width: 200,
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxSelectBox', location: 'before', options: {
                    dataSource: $rootScope.getDatasourceCertificateTypes(),
                    displayExpr: 'Title',
                    valueExpr: 'Id',
                    placeholder: 'Certificate Type',
                    searchEnabled: true,
                    showClearButton: true,
                    onValueChanged: function (e) {
                        $scope.crs_cer = e.value;
                    },
                    width: 200,
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxSelectBox', location: 'before', options: {
                    dataSource: [{ id: -2, title: 'All' }, { id: 1, title: 'Recurrent' }, { id: 0, title: 'Initial' }],
                    displayExpr: 'title',
                    valueExpr: 'id',
                    placeholder: 'Re/In',
                    showClearButton: true,
                    width: 100,
                    onValueChanged: function (e) {
                        $scope.crs_re = e.value;
                    },
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxSelectBox', location: 'before', options: {
                    dataSource: [{ id: 0, title: 'All' }, { id: 1, title: 'Last' }],
                    displayExpr: 'title',
                    valueExpr: 'id',
                    placeholder: 'Last/All',
                    showClearButton: true,
                    width: 100,
                    onValueChanged: function (e) {
                        $scope.crs_last = e.value;
                    },
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    width: 40,
                    type: 'success', icon: 'find', onClick: function (arg) {

                        if (!$scope.selected_person_id) {
                            General.ShowNotify(Config.Text_NoRowSelected, 'error');
                            return;
                        }
                        $scope.bindPersoncourses();


                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Add Certificate', icon: 'add', onClick: function (arg) {
                        if ($scope.selected_person_id)
                            $scope.popup_cer_visible = true;

                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    width: 130,
                    type: 'danger', text: 'Remove', onClick: function (arg) {
                        if ($scope.selected_person_id) {
                            var selected = $rootScope.getSelectedRow($scope.dg_courses_instance);
                            if (!selected) {
                                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                                return;
                            }

                            General.Confirm(Config.Text_DeleteConfirm, function (res) {
                                if (res) {

                                    var dto = { pid: $scope.selected_person_id, cid: selected.CourseId };
                                    $scope.loadingVisible = true;
                                    trnService.deleteCoursePeople(dto).then(function (response) {
                                        $scope.loadingVisible = false;
                                        if (response.IsSuccess) {
                                            General.ShowNotify(Config.Text_SavedOk, 'success');
                                            //zool
                                            $scope.personCourses = Enumerable.From($scope.personCourses).Where('$.CourseId!=' + selected.CourseId).ToArray();
                                            $scope.bindPersoncourses();
                                        }
                                        else
                                            General.ShowNotify(response.Errors[0], 'error');




                                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                                }
                            });
                            ////////////////


                        }

                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Certificates', icon: 'print', onClick: function (arg) {
                        if (!$scope.selected_person_id) {
                            General.ShowNotify(Config.Text_NoRowSelected, 'error');
                            return;
                        }
                        $window.open($rootScope.reportServer + '?type=11&pid=' + $scope.selected_person_id, '_blank');

                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Courses', icon: 'print', onClick: function (arg) {
                        if (!$scope.selected_person_id) {
                            General.ShowNotify(Config.Text_NoRowSelected, 'error');
                            return;
                        }
                        $window.open($rootScope.reportServer + '?type=12&pid=' + $scope.selected_person_id, '_blank');
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (arg) {

                        $scope.popup_course_visible = false;

                    }
                }, toolbar: 'bottom'
            }
        ],
        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {
            // $(e.titleElement).addClass('vahid');
            // $(e.titleElement).css('background-color', '#f2552c');
        },
        onShowing: function (e) {




        },
        onShown: function (e) {
            // $scope.getCrewAbs2($scope.flight.ID);
            if ($scope.dg_courses_instance)
                $scope.dg_courses_instance.refresh();


        },
        onHiding: function () {

            $scope.dg_courses_instance.clearSelection();
            $scope.dg_courses_ds = null;
            $scope.personCourses = null;
            $scope.popup_course_visible = false;

        },
        bindingOptions: {
            visible: 'popup_course_visible',
            // 'toolbarItems[0].options.value': 'crs_result',
            // 'toolbarItems[1].options.value': 'rptcd_dateTo',
            // 'toolbarItems[2].options.value': 'rptcd_caco',


        }
    };


    $scope.popup_cer_visible = false;
    $scope.popup_cer = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_cer"
        },
        shading: true,
        title: 'Courses',
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 700,
        width: $(window).width() - 400,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,

        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'remove', validationGroup: 'pceradd', onClick: function (e) {

                        var result = e.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        var dto = {};

                        //dluo


                        dto.Id = -1;
                        dto.PersonId = $scope.selected_person_id;
                        dto.CustomerId = Config.CustomerId;
                        dto.IsGeneral = 1;
                        dto.CourseTypeId = $scope.course_Type;
                        dto.CertificateNo = $scope.course_CertificateNo;
                        dto.Title = $scope.course_Title;
                        dto.DateStart = moment($scope.course_DateStart).format('YYYY-MM-DD');
                        dto.DateEnd = moment($scope.course_DateEnd).format('YYYY-MM-DD');
                        dto.DateIssue = moment($scope.course_DateIssue).format('YYYY-MM-DD');
                        dto.DateExpire = moment($scope.course_DateExpire).format('YYYY-MM-DD');
                        dto.OrganizationId = $scope.course_OrganizationId;
                        dto.Location = $scope.course_Location;
                        dto.Instructor = $scope.course_Instructor;
                        dto.TrainingDirector = $scope.course_TrainingDirector;
                        dto.Duration = $scope.course_Duration;
                        dto.DurationUnitId = 27;
                        dto.Interval = $scope.course_Interval;
                        dto.CalanderTypeId = $scope.course_CalanderTypeId;
                        // dto.Recurrent = $scope.entity.Recurrent;
                        // dto.Remark = $scope.entity.Remark;
                        dto.IsNotificationEnabled = 0;
                        //dto.Sessions = Enumerable.From($scope.entity.Sessions).Select('$.Key').ToArray();
                        console.log(dto);

                        $scope.loadingVisible = true;
                        trnService.saveCertificate(dto).then(function (response) {


                            $scope.clear_course();

                            General.ShowNotify(Config.Text_SavedOk, 'success');


                            var exists = Enumerable.From($scope.personCourses).Where('$.Id==' + response.Data.Id).FirstOrDefault();
                            if (exists) {
                                $scope.personCourses = Enumerable.From($scope.personCourses).Where('$.Id!=' + response.Data.Id).ToArray();
                            }
                            $scope.personCourses.push(response.Data);



                            $scope.loadingVisible = false;
                            $scope.bindPersoncourses();

                            // $scope.popup_cer_visible = false;




                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                        //////////////////

                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (arg) {

                        $scope.popup_cer_visible = false;

                    }
                }, toolbar: 'bottom'
            }
        ],
        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {
            // $(e.titleElement).addClass('vahid');
            // $(e.titleElement).css('background-color', '#f2552c');
        },
        onShowing: function (e) {




        },
        onShown: function (e) {
            // $scope.getCrewAbs2($scope.flight.ID);
            if ($scope.dg_arccourse_instance)
                $scope.dg_arccourse_instance.refresh();


        },
        onHiding: function () {
            $scope.clear_course();
            $scope.dg_arccourse_instance.clearSelection();
            $scope.dg_arccourse_ds = null;

            $scope.popup_cer_visible = false;

        },
        bindingOptions: {
            visible: 'popup_cer_visible',
            // 'toolbarItems[0].options.value': 'crs_result',
            // 'toolbarItems[1].options.value': 'rptcd_dateTo',
            // 'toolbarItems[2].options.value': 'rptcd_caco',


        }
    };
    $scope.clear_course = function () {
        $scope.course_Type = null;
        $scope.course_CertificateNo = null;
        $scope.course_Title = null;
        $scope.course_DateStart = null;
        $scope.course_DateEnd = null;
        $scope.course_DateIssue = null;
        $scope.course_DateExpire = null;
        $scope.course_OrganizationId = null;
        $scope.course_Location = null;
        $scope.course_Instructor = null;
        $scope.course_TrainingDirector = null;
        $scope.course_Duration = null;

        $scope.course_Interval = null;
        $scope.course_CalanderTypeId = null;
    };
    $scope.bindPersoncoursesFirst = function (callback) {
        if (!$scope.personCourses) {
            $scope.loadingVisible = true;
            trnService.getPersonCourses($scope.selected_person_id).then(function (response) {
                $scope.loadingVisible = false;
                $scope.personCourses = response.Data;
                callback();

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        }
        else callback();
    };
    $scope.bindPersoncourses = function () {
        $scope.bindPersoncoursesFirst(function () {

            var ds = $scope.personCourses;
            if ($scope.crs_result == 0 || $scope.crs_result == 1) {
                ds = Enumerable.From(ds).Where('$.CoursePeopleStatusId==' + $scope.crs_result).ToArray();
            }
            if ($scope.crs_ctype) {
                ds = Enumerable.From(ds).Where('$.CourseTypeId==' + $scope.crs_ctype).ToArray();
            }
            if ($scope.crs_cer) {
                ds = Enumerable.From(ds).Where('$.CertificateTypeId==' + $scope.crs_cer).ToArray();
            }
            if ($scope.crs_re == 0 || $scope.crs_re == 1) {
                ds = Enumerable.From(ds).Where('$.Recurrent==' + $scope.crs_re).ToArray();
            }
            if ($scope.crs_last) {
                ds = Enumerable.From(ds).Where('$.RankLast==1').ToArray();
            }

            $scope.dg_courses_ds = ds;

        });

    };
     

    $scope.selected_person_id = null;
   

    $scope.course_Type = null;
    $scope.course_TypeItem = null;
    $scope.course_set_expire = function () {
        if ($scope.course_Interval && $scope.course_CalanderTypeId && $scope.course_DateIssue) {
            if ($scope.course_CalanderTypeId == 12) {
                $scope.course_DateExpire = (new Date($scope.course_DateIssue)).addYears($scope.course_Interval);

            }
            if ($scope.course_CalanderTypeId == 13)
                $scope.course_DateExpire = (new Date($scope.course_DateIssue)).addMonths($scope.course_Interval);
            if ($scope.course_CalanderTypeId == 14)
                $scope.course_DateExpire = (new Date($scope.course_DateIssue)).addDays($scope.course_Interval);
        }
    };
    $scope.sb_course_type = {
        dataSource: $rootScope.getDatasourceCourseTypeNew(),
        placeholder: 'Select Course Type',
        showClearButton: true,
        searchEnabled: true,
        searchExpr: ["Title"],
        valueExpr: "Id",
        displayExpr: "Title",
        onSelectionChanged: function (e) {
            $scope.course_TypeItem = e.selectedItem;
            if (!e.selectedItem)
                return;
            //if (!$scope.course_Interval)
            $scope.course_Interval = e.selectedItem.Interval;
            //if (!$scope.course_Duration)
            $scope.course_Duration = e.selectedItem.Duration;
            //if (!$scope.course_CalanderTypeId)
            $scope.course_CalanderTypeId = e.selectedItem.CalenderTypeId;
            //if ($scope.isNew) {
            //    if (e.selectedItem && e.selectedItem.Interval)
            //        $scope.entity.Interval = e.selectedItem.Interval;
            //    if (e.selectedItem && e.selectedItem.CalenderTypeId)
            //        $scope.entity.CalanderTypeId = e.selectedItem.CalenderTypeId;
            //    if (e.selectedItem && e.selectedItem.Duration)
            //        $scope.entity.Duration = e.selectedItem.Duration;
            //}
            //$scope.selectedType = e.selectedItem;
            //$scope.certype = null;
            //$scope.ctgroups = null;
            //if (e.selectedItem) {
            //    $scope.certype = e.selectedItem.CertificateType;

            //    $scope.ctgroups = e.selectedItem.JobGroups;
            //}
            $scope.course_set_expire();

            $scope.dg_arccourse_instance.clearSelection();

            $scope.loadingVisible = true;
            trnService.getCoursesByType(e.selectedItem.Id, 3).then(function (response) {
                $scope.loadingVisible = false;
                $scope.dg_arccourses_ds = response.Data;

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        },
        bindingOptions: {
            value: 'course_Type',

        }

    };
    $scope.date_course_resultissue = {
        width: '100%',
        type: 'date',
        onValueChanged: function (e) {

            $scope.course_set_expire();
        },
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'course_DateIssue',
            // disabled: 'isCertidicateDisabled',
        }
    };
    $scope.txt_course_Title = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'course_Title',
        }
    };
    $scope.txt_course_Instructor = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'course_Instructor',
        }
    };
    $scope.txt_course_TrainingDirector = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'course_TrainingDirector',
        }
    };


    $scope.date_course_DateStart = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'course_DateStart',

        }
    };
    $scope.date_course_DateEnd = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
            if (e.value) {
                $scope.course_DateIssue = (new Date(e.value)).addDays(1);
            }

        },
        bindingOptions: {
            value: 'course_DateEnd',

        }
    };

    $scope.txt_course_Location = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'course_Location',
        }
    };

    $scope.txt_course_Duration = {
        min: 1,

        bindingOptions: {
            value: 'course_Duration',
        }
    };
    $scope.txt_course_Interval = {
        min: 1,
        onValueChanged: function (e) {

            $scope.course_set_expire();
        },
        bindingOptions: {
            value: 'course_Interval',
        }
    };
    $scope.sb_course_DurationUnitId = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceOption(26),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'course_DurationUnitId',

        }
    };
    $scope.sb_course_CalanderTypeId = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceOption(11),
        displayExpr: "Title",
        valueExpr: 'Id',
        onValueChanged: function (e) {

            $scope.course_set_expire();
        },
        bindingOptions: {
            value: 'course_CalanderTypeId',

        }
    };
    $scope.sb_course_OrganizationId = {
        dataSource: $rootScope.getDatasourceAirline(),
        showClearButton: true,
        searchEnabled: true,
        searchExpr: ["Title"],
        valueExpr: "Id",
        displayExpr: "Title",

        bindingOptions: {
            value: 'course_OrganizationId',

        }

    };

    $scope.date_course_resultexpire = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'course_DateExpire',
            // disabled: 'isCertidicateDisabled',
        }
    };
    $scope.txt_course_resultno = {
        hoverStateEnabled: false,

        bindingOptions: {
            value: 'course_CertificateNo',
            //disabled:'isCertidicateDisabled',
        }
    };
    ////////////////////////////////////////////
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
    ////9-14
    ////////////////////////////
    $scope.freeSMS = true;

    $scope.selectedNotificationTypeId2 = -1;
    $scope.buildMessage = function () {
        if ($scope.Notify2.TypeId == -1)
            $scope.Notify2.Message = "";

        switch ($scope.Notify2.TypeId) {
            //cancel
            case 10014:

                $scope.Notify2.Message = "Dear #Crew,\n" + "The flight " + $scope.flight.FlightNumber + " " + $scope.flight.FromAirportIATA + "-" + $scope.flight.ToAirportIATA + " is canceled.\n" + $rootScope.userName;
                break;
            //delay
            case 10015:

                $scope.Notify2.Message = "Dear #Crew,\n" + "The flight " + $scope.flight.FlightNumber + " " + $scope.flight.FromAirportIATA + "-" + $scope.flight.ToAirportIATA + " is delayed.\n"
                    + "New Dep:" + $scope.momenttime($scope.flightOffBlock2) + "\n" + $rootScope.userName;
                break;
            case 10016:

                $scope.Notify2.Message = "Dear #Crew,\n";
                break;
            case 10020:

                $scope.Notify2.Message = "Dear #Crew,\n";
                break;

            default: break;

        }
    };
    $scope.sb_notification2 = {
        dataSource: $scope.dsNotificationType2,
        showClearButton: false,
        searchEnabled: false,

        searchExpr: ["Title"],
        valueExpr: "Id",
        displayExpr: "Title",
        onValueChanged: function (e) {
            $scope.buildMessage();
        },
        bindingOptions: {
            value: 'Notify2.TypeId',
            disabled: 'freeSMS',

        },


    };
    $scope.dsNotificationType2 = [
        { Id: 10014, Title: 'Cancelling Notification' },
        { Id: 10015, Title: 'Delay Notification' },
        { Id: 10016, Title: 'Operation Notification' },
        { Id: 10020, Title: 'Training Notification' },

    ];
    $scope.Notify2 = {
        ModuleId: 3,
        TypeId: -1,

        SMS: true,
        Email: true,
        App: true,
        Message: null,
        CustomerId: Config.CustomerId,
        SenderId: null,
        Employees: [],
        Names: [],
        Dates: [],
        FDPs: [],
        Names2: [],
        Mobiles2: [],
        Messages2: [],
    };
    $scope.txt_MessageNotify2 = {
        hoverStateEnabled: false,
        height: 120,

        bindingOptions: {
            value: 'Notify2.Message',
            disabled: 'Notify2.TypeId!=10020'

        }
    };

    $scope.dg_emp3_columns = [

        { dataField: 'JobGroup', caption: 'Rank', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90, },

        // { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 250 },
        { dataField: 'LastName', caption: 'Last Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 150, sortIndex: 0, sortOrder: 'asc' },
        { dataField: 'FirstName', caption: 'First Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 150 },
        { dataField: 'Mobile', caption: 'Mobile', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, },


    ];
    $scope.dg_history_columns = [

        //{ dataField: 'JobGroup', caption: 'Rank', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, },
        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 250 },
        //  { dataField: 'Mobile', caption: 'Monile', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },


        { dataField: 'Status', caption: 'Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 140 },
        //{ dataField: 'TypeStr', caption: 'Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'Message', caption: 'Message', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },

        //{ dataField: 'RefId', caption: 'Ref', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
        { dataField: 'DateSent', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 140, /*format: 'EEE MM-dd'*/ format: 'yy-MM-dd HH:mm', sortIndex: 0, sortOrder: "desc" },
        { dataField: 'Sender', caption: 'Sender', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 150 },

    ];




    $scope.dg_emp3_selected = null;
    $scope.selectedEmps3 = null;
    $scope.dg_emp3_instance = null;
    $scope.dg_emp3_ds = null;
    $scope.dg_emp3 = {
        headerFilter: {
            visible: false
        },
        editing: {
            mode: "cell",
            allowUpdating: true
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
        height: 430,

        columns: $scope.dg_emp3_columns,
        onContentReady: function (e) {
            if (!$scope.dg_emp3_instance)
                $scope.dg_emp3_instance = e.component;

        },
        onRowPrepared: function (e) {



        },
        keyExpr: 'Id',
        onSelectionChanged: function (e) {


        },


        bindingOptions: {
            dataSource: 'dg_emp3_ds',
            selectedRowKeys: 'selectedEmps3',
        }
    };

    $scope.dg_history_instance = null;
    $scope.dg_history_ds = null;
    $scope.dg_history = {
        headerFilter: {
            visible: false
        },
        editing: {
            mode: "cell",
            allowUpdating: true
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
        height: 603,

        columns: $scope.dg_history_columns,
        onContentReady: function (e) {
            if (!$scope.dg_history_instance)
                $scope.dg_history_instance = e.component;

        },
        onRowPrepared: function (e) {



        },
        keyExpr: 'Id',
        onSelectionChanged: function (e) {


        },


        bindingOptions: {
            dataSource: 'dg_history_ds',
            //selectedRowKeys: 'selectedEmps2',
        }
    };

    $scope.countDownVisible2 = false;
    $scope.counter2 = 30;
    var stopped2;
    $scope.countdown2 = function () {
        $scope.countDownVisible2 = true;
        stopped2 = $timeout(function () {

            $scope.counter2--;
            if ($scope.counter2 > 0)
                $scope.countdown2();
            else {
                $scope.stop2();
                $scope.refreshSMSStatus2();
            }
        }, 1000);
    };

    $scope.start22 = function () {
        $scope.counter2 = 30;
        $scope.countDownVisible2 = true;
        $scope.countdown2();
    }

    $scope.stop2 = function () {
        $timeout.cancel(stopped2);
        $scope.countDownVisible2 = false;
        $scope.counter2 = 30;

    };
    $scope.refreshSMSStatus2 = function () {
        $scope.stop2();
        var ids = Enumerable.From($scope.dg_history_ds).Where('$.RefId').Select('$.RefId').ToArray();
        if (!ids || ids.length == 0)
            return;
        //goh
        var dto = { Ids: ids };
        $scope.loadingVisible = true;
        flightService.updateSMSStatus(dto).then(function (response) {
            $scope.loadingVisible = false;
            $.each(response, function (_i, _d) {
                var rec = Enumerable.From($scope.dg_history_ds).Where('$.RefId==' + _d.RefId).FirstOrDefault();
                rec.RefId = _d.RefId;
                rec.Status = _d.Status;

            });



        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.msgrec = null;
    $scope.text_msgrec = {
        placeholder: 'Receiver',
        bindingOptions: {
            value: 'msgrec'
        }
    }

    $scope.msgno = null;
    $scope.text_msgno = {
        placeholder: 'Mobile',
        bindingOptions: {
            value: 'msgno'
        }
    }


    $scope.popup_notify2_visible = false;
    $scope.popup_notify2_title = 'Notify Crew';
    $scope.popup_notify2 = {

        fullScreen: false,
        showTitle: true,
        height: 730,
        width: $(window).width() - 100,
        toolbarItems: [
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Refresh Status', icon: 'refresh', onClick: function (e) {
                        $scope.refreshSMSStatus2();
                    }
                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Send', icon: 'check', validationGroup: 'notmessage2', onClick: function (e) {
                        ////////////////




                        if ($scope.msgrec && $scope.msgno) {
                            $scope.Notify2.Names2.push($scope.msgrec);
                            $scope.Notify2.Mobiles2.push($scope.msgno);

                        }


                        var result = e.validationGroup.validate();
                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }

                        if ((!$scope.selectedEmps3 || $scope.selectedEmps3.length == 0) && ($scope.Notify2.Names2 == null || $scope.Notify2.Names2.length == 0)) {
                            General.ShowNotify("Please select flight crews.", 'error');
                            return;
                        }
                        var recs = $scope.selectedEmps3 ? Enumerable.From($scope.dg_emp3_ds).Where(function (x) { return $scope.selectedEmps3.indexOf(x.Id) != -1; }).OrderBy('$.Name').ToArray() : null;
                        if ((!recs || recs.length == 0) && ($scope.Notify2.Names2 == null || $scope.Notify2.Names2.length == 0)) {
                            General.ShowNotify("Please select flight crews.", 'error');
                            return;
                        }

                        $scope.Notify2.ObjectId = -1;
                        $scope.Notify2.FlightId = null;

                        $scope.Notify2.Message = $scope.Notify2.Message;
                        // if ($scope.msgrec && $scope.msgno) {
                        //     $scope.Notify2.Messages2.push($scope.Notify2.Message);
                        // }
                        var temp = Enumerable.From(recs).Select('{EmployeeId:$.Id,Name:$.Name, FDPItemId:$.FDPItemId}').ToArray();

                        $.each(temp, function (_i, _d) {
                            $scope.Notify2.Employees.push(_d.EmployeeId);
                            $scope.Notify2.Names.push(_d.Name);


                        });

                        $scope.Notify2.SenderName = $rootScope.userName;
                        $scope.loadingVisible = true;
                        notificationService.notifyFlight($scope.Notify2).then(function (response) {



                            General.ShowNotify(Config.Text_SavedOk, 'success');


                            $scope.Notify2.Employees = [];
                            $scope.Notify2.Dates = [];
                            $scope.Notify2.Names = [];
                            $scope.Notify2.FDPs = [];
                            ///7-20//////////////
                            $scope.Notify2.Names2 = [],
                                $scope.Notify2.Mobiles2 = [],
                                $scope.Notify2.Messages2 = [];
                            //////////////////////
                            $scope.Notify2.Message = null;
                            if (!$scope.freeSMS)
                                $scope.Notify2.TypeId = -1;

                            $scope.loadingVisible = true;
                            notificationService.getSMSHistoryTraining().then(function (response) {

                                $scope.loadingVisible = false;
                                $scope.dg_history_ds = response;

                                $scope.start22();

                            }, function (err) { $scope.loadingVisible = false; $scope.popup_notify_visible = false; General.ShowNotify(err.message, 'error'); });


                            // $scope.popup_notify_visible = false;




                        }, function (err) { $scope.loadingVisible = false; $scope.popup_notify_visible = false; General.ShowNotify(err.message, 'error'); });





                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_notify2_visible = false;
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

            $scope.dg_history_instance.refresh();
            $scope.loadingVisible = true;

            $scope.Notify2.TypeId = 10020;
            $scope.buildMessage();
            if (!$scope.dg_emp3_ds) {
                //Config.CustomerId
                flightService.getDispatchSmsEmployees(Config.CustomerId).then(function (response) {

                    $scope.dg_emp3_ds = response;

                }, function (err) { $scope.loadingVisible = false; $scope.popup_notify_visible = false; General.ShowNotify(err.message, 'error'); });
            }

            notificationService.getSMSHistoryTraining().then(function (response) {

                $scope.loadingVisible = false;
                $scope.dg_history_ds = response;



            }, function (err) { $scope.loadingVisible = false; $scope.popup_notify_visible = false; General.ShowNotify(err.message, 'error'); });




            //  $scope.selectedNotificationTypeId2 = 10016;



        },
        onHiding: function () {

            $scope.stop2();

            if ($scope.dg_emp3_instance)
                $scope.dg_emp3_instance.clearSelection();
            if (!$scope.freeSMS)
                $scope.selectedNotificationTypeId2 = -1;
            $scope.Notify2 = {
                ModuleId: $rootScope.moduleId,
                TypeId: -1,

                SMS: true,
                Email: true,
                App: true,
                Message: null,
                CustomerId: Config.CustomerId,
                SenderId: null,
                Employees: [],
                Dates: [],
                Names: [],
                FDPs: [],
                Names2: [],
                Mobiles2: [],
                Messages2: [],
            };
            $scope.popup_notify2_visible = false;
            // $rootScope.$broadcast('onPersonHide', null);
        },
        //position: 'right',
        bindingOptions: {
            visible: 'popup_notify2_visible',

            title: 'popup_notify2_title',

        }
    };
    //////////////////////////////////////
    $scope.entity = {
        Id:-1,
        NID: null,
        FirstName: null,
        LastName: null,
        Mobile: null,
        IDNo: null,
        Address: null,
        PostalCode: null,
        ImageUrl: null,
        Remark: null,
        SexId: 31,
        EmployeeId: -1,
        UserId: null,
        Documents:[],

    };
    $scope.clearEntity = function () {
        $scope.personId = null;
        $scope.entity.FirstName =null;
        $scope.entity.LastName = null;
        $scope.entity.Mobile = null;
        $scope.entity.Id = -1;
        $scope.entity.Email = null;
        $scope.entity.NID = null;
        $scope.entity.IDNo = null;
        $scope.entity.Address = null;
        $scope.entity.PostalCode = null;
        $scope.entity.EmployeeId = -1;
        $scope.entity.Documents = [];
    };
    $scope.pop_width = 1200;
    $scope.pop_height = 550;
    $scope.popup_add_visible = false;
    $scope.popup_add_title = 'New';
    $scope.popup_instance = null;
    $scope.popup_add = {

        fullScreen: false,
        showTitle: true,

        toolbarItems: [
            {
                widget: 'dxButton', location: 'before', toolbar: 'bottom', options: {
                    type: 'default', text: 'Add', width: 120, icon: 'plus', validationGroup: 'fileadd', bindingOptions: { visible: 'btn_visible_file', disabled: 'IsMainDisabled' }, onClick: function (e) {
                        $scope.popup_file_visible = true;
                    }
                }
            },

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'teacheradd', onClick: function (e) {
                        var result = e.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }   


                        //$scope.entity = {
                        //    NID: null,
                        //    FirstName: null,
                        //    LastName: null,
                        //    Mobile: null,
                        //    IDNo: null,
                        //    Address: null,
                        //    PostalCode: null,
                        //    ImageUrl: null,
                        //    Remark: null,

                        //};
                        $scope.loadingVisible = true;
                        trnService.saveTeacher($scope.entity).then(function (response) {
                            
                            $scope.clearEntity();


                            General.ShowNotify(Config.Text_SavedOk, 'success');

                             

                            $scope.loadingVisible = false;
                            $scope.bind();
                            if ($scope.isEdit)
                                $scope.popup_add_visible = false;



                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
   

                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_add_visible = false;
                    }
                }, toolbar: 'bottom'
            }
        ],

        visible: false,
        dragEnabled: true,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            $scope.selectedTabIndex = 0;
            $scope.popup_instance.repaint();

              

        },
        onShown: function (e) {
            
            //$scope.selectedTabIndex = 0;
            //if ($scope.isNew) {

            //}
            //if ($scope.tempData != null)
            //    $scope.nid = $scope.tempData.NID;

            //var size = $rootScope.getWindowSize();
            //$scope.pop_width = size.width;
            //if ($scope.pop_width > 1400)
            //    $scope.pop_width = 1400;
            //$scope.pop_height = $(window).height() - 30;
            //$scope.dg_height = $scope.pop_height - 133;
            //$scope.scroll_height = $scope.pop_height - 140;
            if ($scope.isEdit) {
                $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
                if ($scope.dg_selected.EmployeeId) {
                    $scope.personId = $scope.dg_selected.Id;
                }
                else {
                    $scope.entity.FirstName = $scope.dg_selected.FirstName;
                    $scope.entity.LastName = $scope.dg_selected.LastName;
                    $scope.entity.Mobile = $scope.dg_selected.Mobile;
                    $scope.entity.Id = $scope.dg_selected.Id;
                    $scope.entity.Email = $scope.dg_selected.Email;
                    $scope.entity.NID = $scope.dg_selected.NID;
                    $scope.entity.IDNo = $scope.dg_selected.IDNo;
                    $scope.entity.Address = $scope.dg_selected.Address;
                    $scope.entity.PostalCode = $scope.dg_selected.PostalCode;
                    $scope.entity.EmployeeId = -1;

                    if ($scope.dg_selected.ImageUrl)
                        $scope.img_url = $rootScope.clientsFilesUrl + $scope.dg_selected.ImageUrl;
                    else
                        $scope.img_url = 'content/images/imguser.png';
                }

                $scope.loadingVisible = true;
                trnService.getTeacherDocuments($scope.dg_selected.Id).then(function (response) {

                    $scope.loadingVisible = false;
                    $scope.entity.Documents = response.Data;
                     
                    
                }, function (err) { $scope.loadingVisible = false; $scope.popup_notify_visible = false; General.ShowNotify(err.message, 'error'); });

            }
           



        },
        onHiding: function () {

            $scope.personId = null;

            $scope.popup_add_visible = false;
           
        },
        //2021-12-15 upgrade dx
        onHidden: function() {
            $scope.selectedTabIndex = -1;
            $scope.clearEntity();
          
        },
        onContentReady: function (e) {
            if (!$scope.popup_instance)
                $scope.popup_instance = e.component;

        },
        bindingOptions: {
            visible: 'popup_add_visible',
            width: 'pop_width',
            height: 'pop_height',
            title: 'popup_add_title',
            'toolbarItems[0].visible': 'btn_visible_file',
            
        }
    };


    $scope.employee = null;
    $scope.personId = null;
    $scope.sb_employees = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $scope.getDatasourceEmployees(Config.CustomerId),
        //itemTemplate: function (data) {
        //    return $rootScope.getSbTemplateAirport(data);
        //},

        searchExpr: ["Name"],
        displayExpr: "Name",
        valueExpr: 'PersonId',
        onSelectionChanged: function (arg) {
            $scope.employee = arg.selectedItem;
            if ($scope.employee) {
                $scope.isPropDisabled = $scope.employee;
                $scope.isImage = false;

                $scope.entity.FirstName = $scope.employee.FirstName;
                $scope.entity.LastName = $scope.employee.LastName;
                $scope.entity.Mobile = $scope.employee.Mobile;
                $scope.entity.Id = $scope.employee.personId;
                $scope.entity.Email = $scope.employee.Email;
                $scope.entity.NID = $scope.employee.NID;
                $scope.entity.IDNo = $scope.employee.IDNo;
                $scope.entity.Address = $scope.employee.Address;
                $scope.entity.PostalCode = $scope.employee.PostalCode;
                $scope.entity.EmployeeId = $scope.employee.Id;

                if ($scope.employee.ImageUrl)
                    $scope.img_url = $rootScope.clientsFilesUrl + $scope.employee.ImageUrl;
                else
                    $scope.img_url = 'content/images/imguser.png';
            }
            else {
                $scope.isPropDisabled = false;
                $scope.isImage = true;
                $scope.img_url = 'content/images/imguser.png';
                $scope.clearEntity();
            }







        },
        bindingOptions: {
            value: 'personId',

        }
    };
    //$scope.sb_employees = {
    //    showClearButton: true,
    //    searchEnabled: true,
    //    dataSource: $scope.getDatasourceEmployees(Config.CustomerId),
    //    //itemTemplate: function (data) {
    //    //    return $rootScope.getSbTemplateAirport(data);
    //    //},

    //    searchExpr: ["Name"],
    //    displayExpr: "Name",
    //    valueExpr: 'PersonId',
    //    onSelectionChanged: function (arg) {
    //        console.log(arg.selectedItem);
    //        $scope.employee = arg.selectedItem;
    //        $scope.isPropDisabled = $scope.employee;
    //        //$scope.dto.FirstName = null;
    //        //$scope.dto.LastName = null;
    //        //$scope.dto.PhoneNumber = null;
    //        //if ($scope.employee) {
    //        //    $scope.dto.FirstName = $scope.employee.FirstName;
    //        //    $scope.dto.LastName = $scope.employee.LastName;
    //        //    $scope.dto.PhoneNumber = $scope.employee.Mobile;
    //        //}
    //        // $scope.fillSchedule2();

    //    },
    //    bindingOptions: {
    //        value: 'personId',

    //    }
    //};


    var tabs = [
        { text: "Main", id: 'main', visible_btn: false },
        { text: "Documents", id: 'doc', visible_btn: false },


    ];
    $scope.btn_visible_file = false;
    $scope.tabs = tabs;
    $scope.selectedTabIndex = -1;
    $scope.$watch("selectedTabIndex", function (newValue) {

        try {
            $scope.selectedTab = tabs[newValue];
            $('.tab').hide();
            $('.' + $scope.selectedTab.id).fadeIn(100, function () {
                $scope.dg_file_instance.repaint();

            });

            $scope.btn_visible_file = newValue == 1;



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

    $scope.scroll_height = 200;
    $scope.scroll_main = {
        scrollByContent: true,
        scrollByThumb: true,
        bindingOptions: { height: 'scroll_height', }
    };


    $scope.img_url = 'content/images/imguser.png';
    $scope.uploaderValueImage = [];
    $scope.uploadedFileImage = null;
    $scope.uploader_image = {
        //uploadedMessage: 'بارگزاری شد',
        multiple: false,
        // selectButtonText: 'انتخاب تصویر',
        labelText: '',
        accept: "image/*",
        uploadMethod: 'POST',
        uploadMode: "instantly",
        rtlEnabled: true,
        uploadUrl: $rootScope.fileHandlerUrl + '?t=clientfiles',
        onValueChanged: function (arg) {

        },
        onUploaded: function (e) {
            $scope.uploadedFileImage = e.request.responseText;
            $scope.entity.ImageUrl = e.request.responseText;
            $scope.img_url = $rootScope.clientsFilesUrl + $scope.uploadedFileImage;

        },
        bindingOptions: {
            value: 'uploaderValueImage',
            visible:'isImage'
        }
    };

    $scope.txt_nid = {

        valueChangeEvent: 'keyup',
        readOnly: false,
        hoverStateEnabled: false,

        mask: "999-999999-9",

        maskInvalidMessage: 'Wrong value',
        bindingOptions: {
            value: 'entity.NID',
            readOnly: 'isPropDisabled'
             
        }
    };

    $scope.txt_FirstName = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.FirstName',
            readOnly: 'isPropDisabled'
        }
    };
    $scope.txt_LastName = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.LastName',
            readOnly: 'isPropDisabled'
        }
    };
    $scope.txt_Address = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Address',
            readOnly: 'isPropDisabled'
        }
    };
    $scope.txt_Remark = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Remark',
            
        }
    };
    $scope.txt_IDNo = {
        readOnly: false,
        hoverStateEnabled: false,

        mask: "9999999999",

        maskChar: ' ',
        maskInvalidMessage: 'Wrong value',
        rtlEnabled: false,
        bindingOptions: {
            value: 'entity.IDNo',
            readOnly: 'isPropDisabled'
        }
    };
    $scope.txt_Mobile = {


        hoverStateEnabled: false,
        mask: "AB00-0000000",
        maskRules: {
            "A": /[0]/,
            "B": /[9]/,

        },
        maskChar: '_',
        maskInvalidMessage: 'Wrong value',

        bindingOptions: {
            value: 'entity.Mobile',
            readOnly: 'isPropDisabled'
        }
    };
    $scope.emailValidationRules = {
        validationRules: [
            //    {
            //    type: "required",
            //    message: "Email is required"
            //},
            {
                type: "email",
                message: "Email is invalid"
            }]
    };
    $scope.txt_Email = {
        mode: 'email',
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Email',
            readOnly: 'isPropDisabled'
        }
    };
    $scope.txt_PostalCode = {
        hoverStateEnabled: false,
        mask: "9999999999",
        bindingOptions: {
            value: 'entity.PostalCode',
            readOnly: 'isPropDisabled'
        }
    };
    //////////////////////////////////////////
    $scope.dg_file_columns = [
        { dataField: "Type", caption: "DocumentType", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, width: 200 },
        { dataField: "Remark", caption: "Remark", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false },
      //  { dataField: "FileUrl", caption: "File", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: 100 },
        
            {
                dataField: "Id", caption: '',
                width: 100,
                allowFiltering: false,
                allowSorting: false,
                cellTemplate: 'deleteDocTemplate',
                name: 'deletedoc',
               
                //visible:false,

        },
        {
            dataField: "FileUrl", caption: '',
            width: 65,
            name: 'FileUrl',
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {
                var fn = options.value ? 'forma' : 'forma';
                if (options.value)
                    $("<div>")
                        .append("<img class='cell-img' src='content/images/" + fn + ".png' />")
                        .appendTo(container);
                else
                    $("<div>").appendTo(container);
            },
             

        }
         


    ];
    $scope.dg_file_selected = null;
    $scope.dg_file_instance = null;
    $scope.dg_file = {
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'multiple' },

        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        filterRow: { visible: true, showOperationChooser: true, },
        columnAutoWidth: false,
        columns: $scope.dg_file_columns,
        onContentReady: function (e) {
            if (!$scope.dg_file_instance)
                $scope.dg_file_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_file_selected = null;
            }
            else
                $scope.dg_file_selected = data;


        },
        onCellClick: function (e) {
            //7-27
            var clmn = e.column;
            var field = clmn.dataField;
             
            if (clmn.name == "FileUrl" && e.data.FileUrl)
                $window.open($rootScope.clientsFilesUrl + e.data.FileUrl, '_blank');
        },
        bindingOptions: {

            dataSource: 'entity.Documents',
            height: '300',
        },
        // dataSource:ds

    };

    $scope.deleteDoc = function (row) {
        General.Confirm(Config.Text_DeleteConfirm, function (res) {
            if (res) {
                var data = row.data;
                $scope.entity.Documents = Enumerable.From($scope.entity.Documents).Where('$.Id!=' + data.Id).ToArray();
                $scope.dg_file_instance.repaint();
                
            }
        });
    };

    $scope.pop_width_file = 750;
    $scope.pop_height_file = 600;
    $scope.popup_file_visible = false;
    $scope.popup_file_title = 'New Document';
    $scope.uploadDs = [];
    $scope.clearEntityDocumnet = function () {
       
        $scope.DocumentTitle = null;
        $scope.DocumentTypeId = null;
       
        $scope.DocumentType = null;
        $scope.uploadDs = [];
        //nasiri
        $scope.uploader_document_instance.reset();
    };
    $scope.popup_file = {

        fullScreen: false,
        showTitle: true,

        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'fileadd', bindingOptions: {}, onClick: function (e) {
                        var result = e.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        if (!$scope.uploadDs.length) {
                            General.ShowNotify('no file uploaded', 'error');
                            return;
                        }

                        var id = ($scope.entity.Documents.length + 1) * -1;
                        var rec = $scope.uploadDs[0];
                        var item = { Id: id, Remark: $scope.DocumentTitle, FileUrl: rec.FileUrl, TypeId: $scope.DocumentTypeId, Type: $scope.DocumentType };
                        item.SysUrl = rec.SysUrl;
                        item.FileType = rec.FileType;
                        //$scope.entity.Documents.push(item);
                        $scope.entity.Documents.push(item);
                        
                        $scope.clearEntityDocumnet();
                        //if (!$scope.entityDocument.Id) {
                        //    var id = ($scope.entity.Person.Documents.length + 1) * -1;

                        //    $scope.entityDocument.Id = id;
                        //    $scope.entity.Person.Documents.push(JSON.clone($scope.entityDocument));
                        //    $scope.clearEntityDocumnet();
                        //}
                        //else {

                        //    //dg_selected = JSON.clone($scope.entityAircrafttype);
                        //    JSON.copy($scope.entityDocument, dg_selected);
                        //    $scope.clearEntityDocumnet();
                        //    $scope.popup_file_visible = false;
                        //}
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_file_visible = false;
                    }
                }, toolbar: 'bottom'
            }
        ],

        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            $scope.uploadDs = [];
            if ($scope.pop_width_file > $scope.pop_width)
                $scope.pop_width_file = $scope.pop_width;
            if ($scope.pop_height_file > $scope.pop_height)
                $scope.pop_height_file = $scope.pop_height;


            //$scope.scroll_height = $scope.pop_height - 140;


        },
        onShown: function (e) {

            $scope.dg_upload_instance.repaint();
        },
        onHiding: function () {
            $scope.uploadDs = [];
            $scope.clearEntityDocumnet();
          //  $scope.clearEntityDocumnet();
          //  $scope.clearEntityFile();

            $scope.popup_file_visible = false;
            // $rootScope.$broadcast('onPersonHide', null);
        },
        bindingOptions: {
            visible: 'popup_file_visible',
            width: 'pop_width_file',
            height: 'pop_height_file',
            title: 'popup_file_title',

        }
    };

    $scope.sb_DocumentTypeId = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceOption(44),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'DocumentTypeId',

        },
        onSelectionChanged: function (e) {

            $scope.DocumentType = e.selectedItem ? e.selectedItem.Title : null;


        },
    };
    $scope.txt_DocumentTitle = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'DocumentTitle',

        }
    };
    $scope.uploaderValueDocument = [];
    $scope.uploadedFileDocument = null;
    $scope.uploader_document_instance = null;
    $scope.uploader_document = {
        //uploadedMessage: 'بارگزاری شد',
        multiple: false,
        // selectButtonText: 'انتخاب تصویر',
        labelText: '',
        // accept: "image/*",
        uploadMethod: 'POST',
        uploadMode: "instantly",

        uploadUrl: $rootScope.fileHandlerUrl + '?t=clientfiles',
        onValueChanged: function (arg) {

        },
        onUploaded: function (e) {
            $scope.uploadDs = [];
          //  var id = ($scope.entity.Documents.length + 1) * -1;
            var item = { /*Id: id,*/ Title: e.request.responseText, FileUrl: e.request.responseText };
            item.SysUrl = $scope.uploaderValueDocument[0].name;
            item.FileType = $scope.uploaderValueDocument[0].type;
           
            //$scope.entity.Documents.push(item);
            $scope.uploadDs.push(item);
             


        },
        onContentReady: function (e) {
            if (!$scope.uploader_document_instance)
                $scope.uploader_document_instance = e.component;

        },
        bindingOptions: {
            value: 'uploaderValueDocument'
        }
    };

    $scope.dg_upload_columns = [

        { dataField: "FileUrl", caption: "Uploaded", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false },
        { dataField: "SysUrl", caption: "File", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, width: 200 },
        { dataField: "FileType", caption: "File Type", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, width: 150 },
        {
            dataField: "FileUrl",
            width: 120,
            alignment: 'center',
            caption: 'Attachment',
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {
                var element = "<div></div>";
                if (options.value)
                    element = "<a  href='" + $rootScope.clientsFilesUrl + "/" + options.value + "' class='w3-button w3-block w3-blue' style=' margin:0 auto 0px auto;text-decoration:none' target='_blank'>Download</a>";

                $("<div>")
                    //.append("<img src='content/images/" + fn + ".png' />")
                    .append(element)
                    .appendTo(container);
            },
        },


    ];
    $scope.dg_upload_selected = null;
    $scope.dg_upload_instance = null;
    $scope.dg_upload = {
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'multiple' },
        height: 230,
        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        filterRow: { visible: false, showOperationChooser: true, },
        columnAutoWidth: false,
        columns: $scope.dg_upload_columns,
        onContentReady: function (e) {
            if (!$scope.dg_upload_instance)
                $scope.dg_upload_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_upload_selected = null;
            }
            else
                $scope.dg_upload_selected = data;


        },
        bindingOptions: {

            dataSource: 'uploadDs',

        },
        // dataSource:ds

    };

    $scope.btn_delete_file = {
        text: 'Delete',
        type: 'danger',
        icon: 'clear',


        onClick: function (e) {
            var selected = $rootScope.getSelectedRow($scope.dg_upload_instance);
            if (!selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }

            General.Confirm(Config.Text_DeleteConfirm, function (res) {
                if (res) {

                    $scope.entityDocument.Documents = Enumerable.From($scope.entityDocument.Documents).Where('$.Id!=' + selected.Id).ToArray();
                    $scope.dg_upload_instance.refresh();

                }
            });
        }
    };


    $scope.btn_report = {
        text: 'Report',
        type: 'default',
        //icon: 'plus',
        width: 120,
        onClick: function (e) {

            $scope.popup_report_visible = true;
        },


    };
    $scope.popup_report_visible = false;
    $scope.popup_report_title = 'Report';
    $scope.popup_report = {

        fullScreen: true,
        showTitle: true,

        toolbarItems: [

            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'success', text: 'Search', icon: 'search', onClick: function (e) {
                        var people = $rootScope.getSelectedRows($scope.dg_people_instance);
                        var offset = -1 * (new Date()).getTimezoneOffset();
                        var ids = [];
                        if (people && people.length > 0)
                            ids = Enumerable.From(people).Select('$.Id').ToArray();
                        
                        var dto = {
                            Ids: ids,
                            from: $scope.repfrom ? (new Date($scope.repfrom)).addMinutes(offset) : null,
                            to: $scope.repto ? (new Date($scope.repto)).addMinutes(offset) : null,
                            type: $scope.reptype,
                        };

                        $scope.loadingVisible = true;
                        trnService.getTeachersReport(dto).then(function (response) {
                            $scope.loadingVisible = false;
                            
                                $scope.dg_report_ds = response.Data;
                            

                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Export',   onClick: function (e) {
                        $scope.dg_report_instance.exportToExcel(false);


                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_report_visible = false;
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
            $scope.loadingVisible = true;
            trnService.getTeachers().then(function (response) {
                $scope.loadingVisible = false;
                $scope.dg_people_ds = response;
                $scope.dg_report_instance.repaint();
                $scope.dg_people_instance.repaint();

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
           
        },
        onHiding: function () {
           

            $scope.popup_report_visible = false;
            // $rootScope.$broadcast('onPersonHide', null);
        },
        bindingOptions: {
            visible: 'popup_report_visible',
           
            title: 'popup_report_title',

        }
    };


    $scope.dg_report_columns = [
        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 70, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },
        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200, fixed: true, fixedPosition: 'left' },
        {
            dataField: 'StatusId', caption: 'Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 140, fixed: true, fixedPosition: 'left',
            lookup: {
                dataSource: [{ id: 1, title: 'Scheduled' }, { id: 2, title: 'In Progress' }, { id: 3, title: 'Done' }, { id: 4, title: 'Canceled' }],
                displayExpr: 'title',
                valueExpr: 'id',
            },
        },
        { dataField: 'DateStart', caption: 'Start', allowResizing: true, alignment: 'center', dataType: 'date', format: 'yyyy-MM-dd', allowEditing: false, width: 160, sortIndex: 0, sortOrder: "desc", fixed: true, fixedPosition: 'left' },
        { dataField: 'DateEnd', caption: 'End', allowResizing: true, alignment: 'center', dataType: 'date', format: 'yyyy-MM-dd', allowEditing: false, width: 160, fixed: true, fixedPosition: 'left' },
        { dataField: 'CourseType', caption: 'Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 250, fixed: false, fixedPosition: 'left' },


        { dataField: 'TrainingDirector', caption: 'Director', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'Organization', caption: 'Center', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'Duration', caption: 'Dur.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: true, fixedPosition: 'right' },
        //{ dataField: 'CoursePeopleStatus', caption: 'Result', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        //{ dataField: 'DateIssue', caption: 'Issue', allowResizing: true, alignment: 'center', dataType: 'date', format: 'yyyy-MM-dd', allowEditing: false, width: 150 },
        //{ dataField: 'DateExpire', caption: 'Expire', allowResizing: true, alignment: 'center', dataType: 'date', format: 'yyyy-MM-dd', allowEditing: false, width: 150 },
        //{ dataField: 'CertificateNo', caption: 'Cer. NO', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        //{ dataField: 'Instructor', caption: 'Instructor', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },

        //{ dataField: 'No', caption: 'Class Id', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },



    ];
    $scope.dg_report_selected = null;
    $scope.dg_report_instance = null;
    $scope.dg_report_ds = null;
    $scope.dg_report_height = 620;
    $scope.dg_report = {
        sorting: {
            mode: "single"
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
        //"export": {
        //    enabled: false,
        //    fileName: "Courses",
        //    allowExportSelectedData: true
        //},
        //onToolbarPreparing: function (e) {
        //    e.toolbarOptions.items.unshift({
        //        location: "before",
        //        template: function () {
        //            return $("<div/>")
        //                // .addClass("informer")
        //                .append(
        //                    "<span style='color:white;'>Courses</span>"
        //                );
        //        }
        //    });
        //},

        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'standard' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,
        // height: $(window).height()-130,

        columns: $scope.dg_report_columns,
        onContentReady: function (e) {
            if (!$scope.dg_report_instance)
                $scope.dg_report_instance = e.component;

            //$scope.dg_cduties_height = $(window).height() - 131;
        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_report_selected = null;

            }
            else {
                $scope.dg_report_selected = data;

            }
        },

        onRowPrepared: function (e) {
            if (e.data && !e.data.IsNotificationEnabled) {
                e.rowElement.css('background', '#f2f2f2');

            }

        },
        onRowClick: function (e) {
            var component = e.component;

            function initialClick() {
                console.log('initial click for key ' + e.key);
                component.clickCount = 1;
                component.clickKey = e.key;
                component.clickDate = new Date();
            }

            function doubleClick() {
                console.log('second click');
                component.clickCount = 0;
                component.clickKey = 0;
                component.clickDate = null;
                if (e.data.CourseId) {
                    var _data = { Id: e.data.CourseId };
                    $rootScope.$broadcast('InitViewCourse', _data);
                }


            }

            if ((!component.clickCount) || (component.clickCount != 1) || (component.clickKey != e.key)) {
                initialClick();
            }
            else if (component.clickKey == e.key) {
                if (((new Date()) - component.clickDate) <= 300)
                    doubleClick();
                else
                    initialClick();
            }

        },
        summary: {
            totalItems: [
                {
                    column: "row",
                    summaryType: "count",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                {
                    column: "Duration",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
            ]
        },
        height: $(window).height() - 155,
        bindingOptions: {
            dataSource: 'dg_report_ds',

        }
    };


    $scope.dg_people_columns2 = [

         
        // { dataField: 'InActive', caption: 'InActive', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: true, width: 70, fixed: true, fixedPosition: 'left' },

      //  { dataField: 'CourseCount', caption: 'CRS', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 70, fixed: true, fixedPosition: 'left' },
        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 240, fixed: true, fixedPosition: 'left' },
        // { dataField: 'FirstName', caption: 'First Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 250, fixed: false, fixedPosition: 'left' },
       // { dataField: 'Mobile', caption: 'Mobile', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
        { dataField: 'NID', caption: 'NID', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },

        //{ dataField: 'Email', caption: 'Email', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        {
            dataField: 'JobGroup', caption: 'Group', allowResizing: true
            , lookup: {

                dataSource: $scope.rankDs

            }
            , alignment: 'center', dataType: 'string', allowEditing: false, width: 150,
        },
       // { dataField: 'RemarkTeacher', caption: 'Remark', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, minWidth: 200 },
    ];

    $scope.dg_people_selected = null;
    $scope.dg_people_instance = null;
    $scope.dg_people_ds = null;
    $scope.dg_people = {
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
        selection: { mode: 'multiple' },

        columnAutoWidth: false,
        height: $(window).height() - 215,

        columns: $scope.dg_people_columns2,
        onContentReady: function (e) {
            if (!$scope.dg_people_instance)
                $scope.dg_people_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_people_selected = null;
            }
            else {
                $scope.dg_people_selected = data;
                
            }


        },
        "export": {
            enabled: false,
            fileName: "Instructors",
            allowExportSelectedData: true
        },
        //onToolbarPreparing: function (e) {
        //    e.toolbarOptions.items.unshift({
        //        location: "before",
        //        template: function () {
        //            return $("<div/>")
        //                // .addClass("informer")
        //                .append(
        //                    "<span style='color:white;'>Instructors</span>"
        //                );
        //        }
        //    });
        //},
        
        onRowPrepared: function (e) {
            if (e.data && e.data.EmployeeId)
                e.rowElement.css('background', '#ccf5ff');

        },
        editing: {
            allowUpdating: false,
            mode: 'cell'
        },
        bindingOptions: {
            dataSource: 'dg_people_ds'
        }
    };


    $scope.repfrom = null;
    $scope.date_repfrom = {
        type: "date",
        placeholder: 'From',
        width: '100%',
        displayFormat: "yyyy-MM-dd",
        bindingOptions: {
            value: 'repfrom',

        }
    };

    $scope.repto = null;
    $scope.date_repto = {
        type: "date",
        placeholder: 'To',
        width: '100%',
        displayFormat: "yyyy-MM-dd",
        bindingOptions: {
            value: 'repto',

        }
    };


    $scope.reptype = null;
    $scope.sb_reptype = {
        dataSource: $rootScope.getDatasourceCourseTypeNew(),
        showClearButton: true,
        searchEnabled: true,
        searchExpr: ["Title"],
        valueExpr: "Id",
        displayExpr: "Title",
        onSelectionChanged: function (e) {
 
        },
        bindingOptions: {
            value: 'reptype',

        }

    };
    //////////////////////////////////////////
    $scope.$on('$viewContentLoaded', function () {

        setTimeout(function () {
            $scope.showActive = true;
            $scope.bind();
            //$scope.$broadcast('getFilterQuery', null);
        }, 500);
    });
    $rootScope.$broadcast('PersonLoaded', null);
    ///end
}]);