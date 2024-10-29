'use strict';
app.controller('qaDispatchController', ['$scope', '$location', 'qaService', 'authService', '$routeParams', '$rootScope', '$window', function ($scope, $location, qaService, authService, $routeParams, $rootScope, $window) {

    $scope.isFullScreen = true;

    $scope.entity = {
        Id: -1,
    };

    $scope.followUpEntity = {
        Type: 6,
    }

    $rootScope.result = {
        Result: null,
    };

    $scope.optOPCatagory = [];
    $scope.optDISCatagory = [];


    ////////////////////////


    $scope.fill = function (data) {

        $scope.entity = data;
        $rootScope.result.Result = data.Result;
        $.each($scope.opCatagory, function (_i, _d) {

            if (_d.Id == data.CatagoryId)
                _d.checked = true;
        });

        $.each($scope.disCatagory, function (_i, _d) {
            if (_d.Id == data.CatagoryId)
                _d.checked = true;
        });




    };


    $scope.bind = function () {

        qaService.getOPCatagory().then(function (res) {
            $scope.opCatagory = res.Data

        });
        qaService.getDISCatagory().then(function (res) {
            $scope.disCatagory = res.Data
            console.log($scope.disCatagory);
            qaService.getDHRById($scope.followUpEntity.Id).then(function (res) {
                $scope.fill(res.Data);
            });
        });


        qaService.getIsResponsible($scope.followUpEntity.EmployeeId, $scope.followUpEntity.Type, $scope.followUpEntity.Id).then(function (response) {
            if (response.IsSuccess == true)
                $scope.followUpEntity.isResponsible = true
        });

        qaService.getImportedFile($scope.followUpEntity.Id, $scope.followUpEntity.ProducerId, $scope.followUpEntity.Type).then(function (response) {
            console.log(response);
            $rootScope.dg_attachments_ds = response.Data;
        });
    };
    ////////////////////////////////
    $scope.scroll_qaDispatch_height = $(window).height() - 170;
    $scope.scroll_qaDispatch = {
        //width: 900,
        bounceEnabled: false,
        showScrollbar: 'never',
        pulledDownText: '',
        pullingDownText: '',
        useNative: true,
        refreshingText: 'Updating...',
        onPullDown: function (options) {

            options.component.release();

        },
        onInitialized: function (e) {


        },
        bindingOptions: {
            height: 'scroll_qaDispatch_height'
        }

    };




    /////////////////////////////////


    $scope.chkOPCatagory = function (index) {
        $scope.opCatagory[index].checked = !$scope.opCatagory[index].checked;
        $scope.entity.OPCatagoryId = $scope.opCatagory[index].Id;
    }

    $scope.chkDISCatagory = function (index) {

        $scope.disCatagory[index].checked = !$scope.disCatagory[index].checked;
        $scope.entity.DISCatagoryId = $scope.opCatagory[index].Id;
    }



    $scope.txt_dateReport = {
        readOnly: true,
        focusStateEnabled: false,
        width: '100%',
        bindingOptions: {
            value: 'entity.DateReport',
        }
    }

    $scope.ds_type = [
        { id: 0, title: "In Flight Operation" },
        { id: 1, title: "In Flight Dispatch Process" }
    ];

    $scope.sb_occuranceType = {
        readOnly: true,
        focusStateEnabled: false,
        dataSource: $scope.ds_type,
        placeholder: '',
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.Type',
        }
    }

    $scope.txt_hazardDate = {
        readOnly: true,
        focusStateEnabled: false,
        width: '100%',
        displayFormat: 'yyyy-MM-dd HH:mm',
        type: 'datetime',
        bindingOptions: {
            value: 'entity.DateTimeHazard',
        }
    }

    $scope.txt_opEventDate = {
        readOnly: true,
        focusStateEnabled: false,
        width: '100%',
        displayFormat: 'yyyy-MM-dd HH:mm',
        type: 'datetime',
        bindingOptions: {
            value: 'entity.DateOccurrence',
        }
    }

    $scope.txt_opReportTime = {
        readOnly: true,
        focusStateEnabled: false,
        displayFormat: 'HH:mm',
        type: 'time',
        width: '100%',
        bindingOptions: {
            value: 'entity.OPTimeReceived',
        }
    }

    $scope.txt_opReporterName = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.OPReportedBy',
        }
    }


    $scope.txt_ActionTaken = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.Remarks',
        }
    }

    $scope.txt_eventLocation = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.OPLocation',
        }
    }

    $scope.ds_status = [
        { id: 0, title: "NO" },
        { id: 1, title: "YES" }
    ];

    $scope.sb_fltCancelled = {
        readOnly: true,
        focusStateEnabled: false,
        dataSource: $scope.ds_status,
        placeholder: '',
        displayExpr: 'title',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity',
        }
    }

    //$scope.txt_fltCancelledTime = {
    //    readOnly: true,
    //    focusStateEnabled: false,
    //    displayFormat: 'HH:mm',
    //    type: 'time',
    //    bindingOptions: {
    //        value: 'entity',
    //    }
    //}


    //$scope.sb_acChanged = {
    //    readOnly: true,
    //    focusStateEnabled: false,
    //    dataSource: $scope.ds_status,
    //    placeholder: '',
    //    displayExpr: 'title',
    //    valueExpr: 'id',
    //    bindingOptions: {
    //        value: 'entity',
    //    }
    //}

    //$scope.txt_acChangeTime = {
    //    readOnly: true,
    //    focusStateEnabled: false,
    //    displayFormat: 'HH:mm',
    //    type: 'time',
    //    bindingOptions: {
    //        value: 'entity',
    //    }
    //}


    //$scope.sb_crewChanged = {
    //    readOnly: true,
    //    focusStateEnabled: false,
    //    dataSource: $scope.ds_status,
    //    placeholder: '',
    //    displayExpr: 'title',
    //    valueExpr: 'id',
    //    bindingOptions: {
    //        value: 'entity',
    //    }
    //}

    //$scope.txt_crewChangeTime = {
    //    readOnly: true,
    //    focusStateEnabled: false,
    //    displayFormat: 'HH:mm',
    //    type: 'time',
    //    bindingOptions: {
    //        value: 'entity',
    //    }
    //}


    //$scope.sb_fltPerformed = {
    //    readOnly: true,
    //    focusStateEnabled: false,
    //    dataSource: $scope.ds_status,
    //    placeholder: '',
    //    displayExpr: 'title',
    //    valueExpr: 'id',
    //    bindingOptions: {
    //        value: 'entity',
    //    }
    //}

    //$scope.txt_fltPerformedTime = {
    //    readOnly: true,
    //    focusStateEnabled: false,
    //    displayFormat: 'HH:mm',
    //    type: 'time',
    //    bindingOptions: {
    //        value: 'entity',
    //    }
    //}

    $scope.txt_opEventSummery = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.OPSummary',
        }
    }

    $scope.txt_comment = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.comment'
        }
    }

    $scope.txt_result = {
        bindingOptions: {
            value: 'result.Result'
        }
    }

    $scope.txt_email = {
        hoverStateEnabled: false,
        useMaskBehavior: false,
        readOnly: true,
        bindingOptions: {
            value: 'entity.Email',
        }
    }

    $scope.txt_telNumber = {
        hoverStateEnabled: false,
        useMaskBehavior: false,
        readOnly: true,
        bindingOptions: {
            value: 'entity.Mobile ',
        }
    }

    $scope.txt_name = {
        hoverStateEnabled: false,
        useMaskBehavior: false,
        readOnly: true,
        bindingOptions: {
            value: 'entity.EmployeeName ',
        }
    }


    $scope.dg_attachments_columns = [



        {
            dataField: "Id", caption: '',
            width: 115,
            cellTemplate: "download",
            allowFiltering: false,
            allowSorting: false,

            fixed: true, fixedPosition: 'right',
        },

        { dataField: 'Description', caption: 'Description', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, minwidth: 100, },
        { dataField: 'Lable', caption: 'Name', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },



    ];
    $scope.dg_attachments_selected = null;
    $rootScope.dg_attachments_instance = null;
    $rootScope.dg_attachments_ds = null;
    $scope.dg_attachments = {



        wordWrapEnabled: true,
        rowAlternationEnabled: false,
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
        height: 200,
        columns: $scope.dg_attachments_columns,
        onContentReady: function (e) {
            if (!$rootScope.dg_attachments_instance)
                $rootScope.dg_attachments_instance = e.component;

        },

        onRowClick: function (e) {

        },

        onRowPrepared: function (e) {
        },

        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];


            if (!data) {
                $scope.dg_attachments_selected = null;
            }
            else
                $scope.dg_attachments_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_attachments_ds'
        },
        columnChooser: {
            enabled: false
        },

    };

    $scope.download = function (e) {

        var filename = e.data.Lable.split(".");
        console.log("file name", filename);
        qaService.downloadQa(filename[0], filename[1]).then(function (response) {

        });
    }


    ////////////////////////////////

    var appWindow = angular.element($window);
    appWindow.bind('resize', function () {
        $scope.scroll_qaDispatch_height = $(window).height() - 170;
    });


    $scope.tempData = null;

    $scope.$on('InitQADispatch', function (event, prms) {

        $scope.tempData = prms;

        $scope.followUpEntity.Category = $scope.tempData.Category;
        $scope.followUpEntity.Id = $scope.tempData.Id;
        $scope.followUpEntity.Type = $scope.tempData.Type;
        $scope.followUpEntity.EmployeeId = $scope.tempData.EmployeeId;

        $scope.isNotLocked = $scope.tempData.isNotLocked;

        /*   $scope.popup_add_visible = true;*/
        $scope.bind();
    });

    $scope.$on('onEmployeeSelectHide', function (event, prms) {
        console.log(prms);
        $scope.followUpEntity.Category = prms;
    });

    $scope.testLoaded = function () {
        $rootScope.$broadcast('InitTest', $scope.tempData);
    }

}]);


