'use strict';
app.controller('rosterReport', ['$scope', '$location', '$routeParams', '$rootScope', '$q','$timeout', 'flightService', 'aircraftService', 'authService', 'notificationService', '$route', '$http', function ($scope, $location, $routeParams, $rootScope, $q,$timeout, flightService, aircraftService, authService, notificationService, $route, $http) {
    $scope.prms = $routeParams.prms;
    $scope.Operator = $rootScope.CustomerName.toUpperCase();
    //////////////////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> Daily Roster';
        //  $('#resourceGantt').height($(window).height() - 45 - 100);

        $('.dailyrosterreport').fadeIn(400, function () {
            //vmins = new viewModel();
            //ko.applyBindings(vmins);
            //var h = $(window).height() - 130;
            //vmins.height(h + 'px');

            //var ds = proccessDataSource(resourceGanttData);
            //activeDatasource = ds;

            //vmins.gantt_datasource(ds);
        });
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

    //////////////////////////////////
    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 120,
        validationGroup: 'rosterreportbind',
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
    $scope.selectedIds = null;
    $scope.btn_notify = {
        text: 'Notify',
        type: 'default',

        width: 120,

        bindingOptions: {},
        onClick: function (e) {
           // $scope.dg_selected = $rootScope.getSelectedRows($scope.dg_instance);
            //var ids = Enumerable.From($scope.dg_selected).Select('$.Id').ToArray();
           // if (ids.length == 0)
           //     return;
            var _ids = Enumerable.From($scope.selectedIds).Where('$>0').ToArray();
            alert('x');
            $scope.loadingVisible = true;
            flightService.getRosterCrewDetails(_ids.join('_')).then(function (response) {
                $scope.loadingVisible = false;
                $scope.dg_notify_ds = response;
                $scope.popup_notify_visible = true;

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


            //var _dt = moment($scope.dt_from).format('YYYY-MM-DDTHH:mm:ss');
            //var dto = {
            //    Day: _dt,
            //    Ids: ids.join("_"),
            //    Test: 0
            //};
            
            //$scope.loadingVisible = true;
            //flightService.notifyDailyRoster(dto).then(function (response) {
            //    $scope.loadingVisible = false;


            //}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        }
    };

    $scope.btn_print = {
        text: 'Print',
        type: 'default',

        width: 120,

        bindingOptions: {},
        onClick: function (e) {
            $scope.popup_print_visible = true;
        }
    };
    /////////////////////////////////
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
    function printElem($elem) {

        var contents = $elem.html();//'<h1>Vahid</h1>' $elem.html();
        var frame1 = $('<iframe />');
        frame1[0].name = "frame1";
        frame1.css({ "position": "absolute", "top": "-1000000px" });
        $("body").append(frame1);
        var frameDoc = frame1[0].contentWindow ? frame1[0].contentWindow : frame1[0].contentDocument.document ? frame1[0].contentDocument.document : frame1[0].contentDocument;
        frameDoc.document.open();
        //Create a new HTML document.
        frameDoc.document.write('<html><head><title></title>');
        frameDoc.document.write('<link href="content/css/print.css" rel="stylesheet" />');
        frameDoc.document.write('</head><body>');
        //Append the external CSS file.
        //frameDoc.document.write('<link href="content/css/main.css" rel="stylesheet" type="text/css" />');
        // frameDoc.document.write('<link href="../dist/css/AdminLTE.min.css" rel="stylesheet" type="text/css" />');

        frameDoc.document.write('<link href="content/css/bootstrap.css" rel="stylesheet" />');
        //frameDoc.document.write('<link href="content/css/w3.css" rel="stylesheet" />');
        //frameDoc.document.write('<link href="content/css/ionicons.css" rel="stylesheet" />');
        //frameDoc.document.write('<link href="content/css/fontawsome2.css" rel="stylesheet" />');
        //frameDoc.document.write('<link href="content/css/dx.common.css" rel="stylesheet" />');

        frameDoc.document.write('<link href="content/css/main.css" rel="stylesheet" />');
        
        //frameDoc.document.write('<link href="content/css/core-ui.css" rel="stylesheet" />');
        //frameDoc.document.write('<link href="sfstyles/ejthemes/default-theme/ej.web.all.min.css" rel="stylesheet" />');
        //frameDoc.document.write('<link href="sfstyles/default.css" rel="stylesheet" />');
        //frameDoc.document.write('<link href="sfstyles/default-responsive.css" rel="stylesheet" />');
        //frameDoc.document.write('<link href="sfstyles/ejthemes/responsive-css/ej.responsive.css" rel="stylesheet" />');
        //Append the DIV contents.
        frameDoc.document.write(contents);
        frameDoc.document.write('</body></html>');
        frameDoc.document.close();
        setTimeout(function () {
            window.frames["frame1"].focus();
            window.frames["frame1"].print();
            frame1.remove();
        }, 1500);
    }
    //////////////////////////////////
    $scope.scroll_jl_height = 200;
    $scope.scroll_jl = {
        scrollByContent: true,
        scrollByThumb: true,
        bindingOptions: { height: 'scroll_jl_height', }
    };
    $scope.scroll_jl_height = $(window).height() - 10 - 110;
    //////////////////////////////////
    $scope.formatTime = function (date) {
        if (!date)
            return "";
        return moment(date).format('HH:mm');
    };
    $scope.formatDate = function (date) {
        if (!date)
            return "";
        return moment(date).format('YYYY-MM-DD');
    };
    $scope.formatDay = function (date) {
        if (!date)
            return "";
        return moment(date).format('ddd');
    };
    $scope.formatDatePersian = function (date) {
        if (!date)
            return "";
       return new persianDate(date).format("DD/MM/YYYY")
    }
    $scope.ds_am = null;
    $scope.ds_pm = null;
    $scope.bind = function () {
        var _dt = moment($scope.dt_from).format('YYYY-MM-DDTHH:mm:ss');
        //odata/crew/report/main?date=' + _dt
        $scope.loadingVisible = true;
        flightService.getRosterSheetReport(_dt).then(function (response) {
            $scope.loadingVisible = false;
            $scope.dg_ds = response.fdps;
            $scope.ds_am = response.am;
            $scope.ds_pm = response.pm;
            console.log($scope.ds_am);
            var ln = $scope.dg_ds.length;
            if ($scope.dg_ds.length < 12) {
                for (var i = 0; i <= 12 - ln; i++)
                    $scope.dg_ds.push({FltNo:'',Route:'',Id:-1*i});
            }
            console.log($scope.dg_ds);

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    //////////////////////////////////
    $scope.popup_print_visible = false;
    $scope.popup_print_title = 'Print';
    $scope.popup_print = {

        fullScreen: false,
        showTitle: true,
        width: 1150,
        height: function () { return $(window).height() * 1 },
        toolbarItems: [

 {
     widget: 'dxButton', location: 'after', options: {
         type: 'default', text: 'Print', icon: 'print', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {


             printElem($('#rtbl'));

         }


     }, toolbar: 'bottom'
 },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_print_visible = false;
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

            $scope.scroll_jl_height = $(window).height() - 10 - 110;
        },
        onHiding: function () {


            $scope.popup_print_visible = false;

        },
        //position: 'right',
        bindingOptions: {
            visible: 'popup_print_visible',

            title: 'popup_print_title',

        }
    };
    //////////////////////////////////
    $scope.countDownVisible = false;
    $scope.counter = 30;
    var stopped;
    $scope.countdown = function () {
        $scope.countDownVisible = true;
        stopped = $timeout(function () {
            console.log($scope.counter);
            $scope.counter--;
            if ($scope.counter>0)
                $scope.countdown();
            else {
                $scope.stop();
                $scope.refreshSMSStatus();
            }
        }, 1000);
    };


    $scope.stop = function () {
        $timeout.cancel(stopped);
        $scope.countDownVisible = false;
        $scope.counter = 30;

    };
    $scope.start = function () {
        $scope.counter = 30;
        $scope.countDownVisible = true;
        $scope.countdown();
    }
    ////////////////////////////////////
    $scope.refreshSMSStatus = function () {
        $scope.stop();
        var ids = Enumerable.From($scope.dg_notify_ds).Select('$.Ref').ToArray();
        if (!ids || ids.length == 0)
            return;
        //goh
        var dto = { Ids: ids };
        $scope.loadingVisible = true;
        flightService.checkSMS(dto).then(function (response) {
            $scope.loadingVisible = false;
            $.each(response, function (_i, _d) {
                var rec = Enumerable.From($scope.dg_notify_ds).Where('$.Ref==' + _d.RefId).FirstOrDefault();
                rec.Ref = _d.RefId;
                rec.ResStr = _d.Status;

            });

            console.log('STATUS SMS DELIVERY REPORT');
            console.log(response);

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    ////////////////////////////////////
    $scope.popup_notify_visible = false;
    $scope.popup_notify_title = 'Notification';
    $scope.popup_notify = {

        fullScreen: false,
        showTitle: true,
        width: 1150,
        height: function () { return $(window).height() * 0.9 },
        toolbarItems: [
{
    widget: 'dxButton', location: 'after', options: {
        type: 'default', text: 'Refresh Status', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {
            $scope.refreshSMSStatus();

        }


    }, toolbar: 'bottom'
},
 {
     widget: 'dxButton', location: 'after', options: {
         type: 'success', text: 'Send',   bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {

             
             var selected = $rootScope.getSelectedRows($scope.dg_notify_instance);
             var ids = Enumerable.From(selected).Select('$.Id').ToArray();
             if (ids.length == 0)
                 return;
             var dto = { Ids: ids ,Date:$scope.dt_from};
             $scope.loadingVisible = true;
             flightService.rosterSendSMS(dto).then(function (response) {
                 $scope.loadingVisible = false;
                 $.each(response, function (_i, _d) {
                     var rec = Enumerable.From($scope.dg_notify_ds).Where('$.Id==' + _d.Id).FirstOrDefault();
                     rec.Ref = _d.Ref;
                     rec.ResStr = "Queue";

                 });

                 $scope.start();

                 console.log('SMS DELIVERY REPORT');
                 console.log(response);


             }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

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
            if ($scope.dg_notify_instance)
                $scope.dg_notify_instance.refresh();
            
        },
        onHiding: function () {
            $scope.stop();

            $scope.popup_notify_visible = false;

        },
        //position: 'right',
        bindingOptions: {
            visible: 'popup_notify_visible',

            title: 'popup_notify_title',

        }
    };
    ////////////////////////////////////
    $scope.dg_flight_columns = [




      { dataField: 'FltNo', caption: 'FltNo', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false,   fixed: true, fixedPosition: 'left',width:200  },
      { dataField: 'Register', caption: 'Reg', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false,   fixed: true, fixedPosition: 'left',width:80   },
       { dataField: 'Route', caption: 'Route', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: true, fixedPosition: 'left', width: 200 },
       { dataField: 'STDLocal', caption: 'Dep', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, fixed: true, fixedPosition: 'left', format: 'HH:mm',width:80 },
       { dataField: 'STALocal', caption: 'Arr', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, fixed: true, fixedPosition: 'left', format: 'HH:mm',width:80 },
       
         { dataField: 'P1', caption: 'P1', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', minWidth: 150 },
          { dataField: 'P2', caption: 'P2', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', minWidth: 150 },
           
            { dataField: 'SCCM', caption: 'SCCM', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', minWidth: 150 },
             { dataField: 'CCM1', caption: 'CCMs', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', minWidth: 400 },
              { dataField: 'IP', caption: 'IP', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', minWidth: 150 },
              { dataField: 'SAFETY', caption: 'SAFETY', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', minWidth: 150 },
               { dataField: 'OBS', caption: 'OBS', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', minWidth: 150 },
               { dataField: 'CCM3', caption: 'CHECK', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', minWidth: 150 },
             // { dataField: 'CCM2', caption: 'CCM2', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', minWidth: 150 },
             //  { dataField: 'CCM3', caption: 'CCM3', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', minWidth: 150 },





 



    ];
    //var values = [];
    //var mergeColumns =1;
    $scope.dg_flight_selected = null;
    $scope.dg_flight_instance = null;
    $scope.dg_flight_ds = null;
    $scope.dg_flight = {
        wordWrapEnabled: true,
        rowAlternationEnabled: true,
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
        height: $(window).height() - 300,

        columns: $scope.dg_flight_columns,
        onContentReady: function (e) {
            if (!$scope.dg_flight_instance)
                $scope.dg_flight_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_flight_selected = null;
            }
            else
                $scope.dg_flight_selected = data;


        },

        "export": {
            enabled: true,
            fileName: "Daily Roster",
            allowExportSelectedData: false
        },
        onToolbarPreparing: function (e) {
            e.toolbarOptions.items.unshift({
                location: "before",
                template: function () {
                    return $("<div/>")
                       // .addClass("informer")
                        .append(
                           "<span style='color:white;'>Flights</span>"
                        );
                }
            });
        },
        onExporting: function (e) {
            e.component.beginUpdate();
            e.component.columnOption("row", "visible", false);
        },
        onExported: function (e) {
            e.component.columnOption("row", "visible", true);
            e.component.endUpdate();
        },
        onRowPrepared: function (e) {
            if (e.data && e.data.IsPositioning)
                e.rowElement.css('background', '#ffccff');

        },

        onCellPrepared: function (e) {
            if (e.rowType === "data" && e.column.dataField == "FlightStatus")
                e.cellElement.addClass(e.data.FlightStatus.toLowerCase());
        },
        bindingOptions: {
            dataSource: 'dg_ds',
            selectedRowKeys:'selectedIds',
        },
        columnChooser: {
            enabled: true
        },

    };
    //////////////////////////////////
    $scope.dg_notify_columns = [




     { dataField: 'ScheduleName', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 200 },
     { dataField: 'Position', caption: 'Rank', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 100 },
      { dataField: 'Route', caption: 'Route', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left',width:200   },
       { dataField: 'Flights', caption: 'FltNo', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 300 },
       { dataField: 'Ref', caption: 'SMS Id', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'right', width: 120 },
       { dataField: 'ResStr', caption: 'Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'right', width: 150 },



    ];
    //var values = [];
    //var mergeColumns =1;
    $scope.dg_notify_selected = null;
    $scope.dg_notify_instance = null;
    $scope.dg_notify_ds = null;
    $scope.dg_notify = {
        wordWrapEnabled: true,
        rowAlternationEnabled: true,
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
        height: $(window).height() - 250,

        columns: $scope.dg_notify_columns,
        onContentReady: function (e) {
            if (!$scope.dg_notify_instance)
                $scope.dg_notify_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_notify_selected = null;
            }
            else
                $scope.dg_notify_selected = data;


        },

        
        bindingOptions: {
            dataSource: 'dg_notify_ds',
            
        },
        

    };

    ///////////////////////////////
    $scope.$on('$viewContentLoaded', function () {

        setTimeout(function () {
            $scope.bind();
        }, 500);
    });
    ///////////////////////////

}]);