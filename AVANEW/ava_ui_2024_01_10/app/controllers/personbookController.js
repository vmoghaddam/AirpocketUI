'use strict';
app.controller('personbookController', ['$scope', '$location', '$routeParams', '$rootScope', 'libraryService', 'notificationService', 'authService', function ($scope, $location, $routeParams, $rootScope, libraryService, notificationService, authService) {
    $scope.prms = $routeParams.prms;
    //////////////////////////////////
    $scope.dsUrl = null;
    $scope.filterVisible = false;
    $scope.selectedCourse = null;
    $scope.courseStatus = {
        SMS: true,
        Email: true,
        AppNotification: true,
        StatusId: null,
        Status: null,
        CourseId: null,
        OldStatus: null,
        Remark: null,
        IssueDate: null,
        No: null,
        Name: null,
        People: []
    };
    ////////////////////////////////
    $scope.sb_StatusId = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: $rootScope.getDatasourcePersonCourseStatus(),
        displayExpr: "Title",
        valueExpr: 'Id',
        onSelectionChanged: function (e) {
            if (!e.selectedItem)
                return;
            var passed = e.selectedItem.Id == 71;
            $scope.isCertidicateDisabled = !passed;
        },
        bindingOptions: {
            value: 'courseStatus.StatusId',
            text: 'courseStatus.Status',
        }
    };
    $scope.txt_OldStatus = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'courseStatus.OldStatus',
        }
    };
    $scope.chb_SMS = {

        text: 'Send SMS',
        bindingOptions: {
            value: 'courseStatus.SMS',

        }
    };
    $scope.chb_Email = {

        text: 'Send Email',
        bindingOptions: {
            value: 'courseStatus.Email',

        }
    };
    $scope.chb_AppNotification = {

        text: 'Send Notification',
        bindingOptions: {
            value: 'courseStatus.AppNotification',

        }
    };
    $scope.txt_StatusRemark = {
        hoverStateEnabled: false,

        bindingOptions: {
            value: 'courseStatus.Remark',
        }
    };
    $scope.txt_CertificateNo = {
        hoverStateEnabled: false,

        bindingOptions: {
            value: 'courseStatus.No',
            //disabled:'isCertidicateDisabled',
        }
    };
    $scope.txt_Name = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'courseStatus.Name',
            //disabled:'isCertidicateDisabled',
        }
    };
    $scope.date_DateIssue = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'courseStatus.IssueDate',
            // disabled: 'isCertidicateDisabled',
        }
    };
    ////////////////////////////////
    $scope.IsNotificationDisabled = true;
    $scope.btn_notification = {
        type: 'default', width: 200, text: 'Notify', icon: 'ion ion-ios-notifications',
        onClick: function (e) {
            $scope.selectedEmployees = $rootScope.getSelectedRow($scope.dg_employees_instance);
            if (!$scope.selectedEmployees) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var books = Enumerable.From($scope.dg_course_ds).Where('$.IsDownloaded==0').Select('$.Title').ToArray();
            var booksStr = books.join('\r\n');
            $scope.Notify.Message = 'Dear ' + $scope.selectedEmployees.Name + ',' + '\r\n'
                + "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                + '\r\n'
                + '\r\n'
                + booksStr
                + '\r\n'
                + '\r\n'
                + 'Your sincerely' + '\r\n'
                + $rootScope.userTitle
                + '\r\n'
                + moment().format('MMMM Do YYYY, h:mm:ss a');
            $scope.popup_notify_visible = true;
            //$scope.dg_course_ds
            //Enumerable.From($scope.selectedEmployees).Select('$.EmployeeId').ToArray();
        },
        bindingOptions: {
            disabled: 'IsNotificationDisabled'
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
    $scope.btn_filter = {
        text: '',
        type: 'default',
        icon: 'filter',
        width: 40,
        onClick: function (e) {
            if ($scope.filterVisible) {
                $scope.filterVisible = false;
                $('.col-grid').removeClass('col-lg-7').addClass('col-lg-10');
                // $('.col-row-sum').removeClass().addClass();
                $('.filter').hide();
            }
            else {
                $scope.filterVisible = true;
                $('.col-grid').removeClass('col-lg-10').addClass('col-lg-7');
                //  $('.col-row-sum').removeClass().addClass('');
                $('.filter').show();
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
    $scope.Notify = {
        ModuleId: $rootScope.moduleId,
        TypeId: 97,
         
        SMS: true,
        Email: true,
        AppNotification: true,
        Message: null,
        CustomerId: Config.CustomerId,
        SenderId: null,
        Employees: [],
    };
    
    $scope.chb_SMSNotify = {

        text: 'Send SMS',
        bindingOptions: {
            value: 'Notify.SMS',

        }
    };
    $scope.chb_EmailNotify = {

        text: 'Send Email',
        bindingOptions: {
            value: 'Notify.Email',

        }
    };
    $scope.chb_AppNotificationNotify = {

        text: 'Send Notification',
        bindingOptions: {
            value: 'Notify.AppNotification',

        }
    };
    $scope.txt_MessageNotify = {
        hoverStateEnabled: false,
        height: 300,
        bindingOptions: {
            value: 'Notify.Message',

        }
    };
    $scope.htmlEditorOptions = {
        toolbar: {
            items: [
                "undo", "redo", "separator",
                {
                    formatName: "header",
                    formatValues: [false, 1, 2, 3, 4, 5]
                }, "separator",
                "bold", "italic", "strike", "underline", "separator",
                "alignLeft", "alignCenter", "alignRight", "alignJustify", "separator",
                {
                    widget: "dxButton",
                    options: {
                        text: "Show markup",
                        stylingMode: "text",
                        onClick: function () {
                            alert($scope.Notify.Message);
                        }
                    }
                }
            ]
        },
        bindingOptions: {
            value: "Notify.Message"
        }
    };

    $scope.popup_notify_visible = false;
    $scope.popup_notify_title = 'Notify';
    $scope.popup_notify = {

        fullScreen: false,
        showTitle: true,
        height: 500,
        width: 600,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', onClick: function (e) {

                        //cmnt
                        //$scope.Notify.ObjectId = $scope.dg_selected.Id;
                      //  $scope.Notify.Employees = Enumerable.From($scope.selectedEmployees).Select('$.Id').ToArray();
                        $scope.Notify.Employees.push($scope.selectedEmployees.Id);
                         
                        $scope.loadingVisible = true;
                        $scope.Notify.Message = $scope.Notify.Message.replace(/\r?\n/g, '<br />');
                        notificationService.notify($scope.Notify).then(function (response) {

                            $scope.loadingVisible = false;


                            General.ShowNotify(Config.Text_SavedOk, 'success');

                            $scope.Notify = {
                                ModuleId: $rootScope.moduleId,
                                TypeId: 97,

                                SMS: true,
                                Email: true,
                                AppNotification: true,
                                Message: null,
                                CustomerId: Config.CustomerId,
                                SenderId: null,
                                Employees: [],
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


        },
        onHiding: function () {



            $scope.Notify = {
                ModuleId: $rootScope.moduleId,
                TypeId: 97,

                SMS: true,
                Email: true,
                AppNotification: true,
                Message: null,
                CustomerId: Config.CustomerId,
                SenderId: null,
                Employees: [],
            };
            $scope.popup_notify_visible = false;
            // $rootScope.$broadcast('onPersonHide', null);
        },
        //  position: 'right',
        bindingOptions: {
            visible: 'popup_notify_visible',

            title: 'popup_notify_title',

        }
    };

    ////////////////////////////////
    $scope.courseCaption = 'Library Items';
    $scope.dg_employees_columns = [
        { dataField: 'BookAlert', caption: 'Issue', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90, fixed: true, fixedPosition: 'left', sortIndex: 1, sortOrder: "desc" },
        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 220, fixed: true, fixedPosition: 'left', sortIndex: 2, sortOrder: "asc" },
        { dataField: 'PID', caption: 'Personnel Id', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
        { dataField: 'NID', caption: 'National Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
        { dataField: 'Mobile', caption: 'Mobile', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'Email', caption: 'Email', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },

        { dataField: 'DateJoinCompany', caption: 'Join Company', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },
        { dataField: 'CaoCardNumber', caption: 'CAO No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
        { dataField: 'NDTNumber', caption: 'NDT No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },

    ];
    $scope.dg_employees_height = 100;
    $scope.dg_employees_selected = null;
    $scope.dg_employees_instance = null;
    $scope.dg_employees_ds = null;
    $scope.dg_employees = {
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


        columns: $scope.dg_employees_columns,
        onContentReady: function (e) {
            if (!$scope.dg_employees_instance)
                $scope.dg_employees_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {

                $scope.dg_employees_selected = null;
                $scope.dg_course_ds = null;
                $scope.courseCaption = 'Library';
                $scope.IsNotificationDisabled = true;
            }
            else {
                $scope.IsNotificationDisabled = true;
                $scope.dg_employees_selected = data;
                $scope.courseCaption = 'Library > ' + data.Name;
                libraryService.getPersonLibrary(data.Id).then(function (response) {
                    $scope.dg_course_ds = response;
                    $scope.IsNotificationDisabled = false;

                }, function (err) { General.ShowNotify(err.message, 'error'); });
            }


        },
        height: $(window).height() - 175,
        bindingOptions: {
            dataSource: 'dg_employees_ds', //'dg_employees_ds',
            // height: 'dg_employees_height'
        }
    };
    //$scope.dg_employees_height = $(window).height() - 200;
    ///////////////////////////////////
    $scope.dg_course_columns = [
        {
            dataField: "TypeId", caption: '',
            width: 55,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {
                if (options.value == 83)
                    $("<div>")
                        .append("<img src='content/images/" + "book2" + ".png' />")
                        .appendTo(container);
                if (options.value == 84)
                    $("<div>")
                        .append("<img src='content/images/" + "paper" + ".png' />")
                        .appendTo(container);
                if (options.value == 85)
                    $("<div>")
                        .append("<img src='content/images/" + "movie" + ".png' />")
                        .appendTo(container);


            },
            fixed: true, fixedPosition: 'left',
        },
        {
            dataField: "IsDownloaded", caption: '',
            width: 55,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {
                var fn = options.value == 0 ? 'notdownloaded' : 'downloaded';

                $("<div>")
                    .append("<img src='content/images/" + fn + ".png' />")
                    .appendTo(container);
            },
            fixed: true, fixedPosition: 'left', sortIndex: 1, sortOrder: "asc"
        },
        {
            dataField: "IsVisited", caption: '',
            width: 55,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {
                var fn = options.value == 0 ? 'notvisited' : 'visited';

                $("<div>")
                    .append("<img src='content/images/" + fn + ".png' />")
                    .appendTo(container);
            },
            fixed: true, fixedPosition: 'left', sortIndex: 2, sortOrder: "asc"
        },
        { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 300, fixed: true, fixedPosition: 'left', sortIndex: 1, sortOrder: "asc" },
        { dataField: 'DateEffective', caption: 'Effective', allowResizing: true, dataType: 'string', allowEditing: false, width: 150, alignment: 'center' },

        { dataField: 'DateExposure', caption: 'Exposure Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 150 },
        { dataField: 'DateVisit', caption: 'Visit Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },
        { dataField: 'DateDownload', caption: 'Download Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },
    ];
    $scope.dg_course_selected = null;


    $scope.dg_course_instance = null;
    $scope.dg_course_ds = null;
    $scope.dg_course = {
        headerFilter: {
            visible: false
        },
        filterRow: {
            visible: true,
            showOperationChooser: true,
        },
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

        columnAutoWidth: false,
        height: $(window).height() - 175,

        columns: $scope.dg_course_columns,
        onContentReady: function (e) {
            if (!$scope.dg_course_instance)
                $scope.dg_course_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_course_selected = null;

            }
            else {
                $scope.dg_course_selected = data;

            }



        },
        bindingOptions: {
            dataSource: 'dg_course_ds'
        }
    };


    ////////////////////////////
    $scope.doRefresh = false;
    $scope.filters = [];
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
        if (!$scope.dg_employees_ds && $scope.doRefresh) {

            $scope.dg_employees_ds = {
                store: {
                    type: "odata",
                    url: $rootScope.serviceUrl + 'odata/employees/' + Config.CustomerId,
                    key: "Id",
                    version: 4,
                    onLoaded: function (e) {
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
            $scope.dg_employees_ds.filter = $scope.filters;
            $scope.dg_employees_instance.refresh();
            $scope.doRefresh = false;
        }

    };
    //////////////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> Employees';
        $('.personbook').fadeIn();
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
    //////////////////////////////////////////
    $rootScope.$broadcast('PersonCourseLoaded', null);





}]);