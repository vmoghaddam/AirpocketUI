'use strict';
app.controller('qaMaintenanceController', ['$scope', '$location', 'qaService', 'authService', '$routeParams', '$rootScope', '$window', function ($scope, $location, qaService, authService, $routeParams, $rootScope, $window) {
    $scope.isFullScreen = true;

    $scope.entity = {
        Id: -1,
    };


    $scope.followUpEntity = {
        Type: 3,
    }

    $rootScope.result = {
        Result: null,
    };
    
    /////////////////////////////////
    $scope.fill = function (data) {
        $scope.entity = data;
        $rootScope.result.Result = data.Result;
    };
    $scope.isLockVisible = false;
    $scope.bind = function () {

      

        qaService.getMORCompnSpec().then(function (res) {
            $scope.dsComponentSpect = [];
            $.each(res.Data, function (_i, _d) {
                $scope.dsComponentSpect.push({ "id": _d.Id, "title": _d.Title });
            });

            qaService.getMORById($scope.followUpEntity.Id).then(function (res) {
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

        qaService.getStation().then(function (response) {
            console.log(response);
            $scope.ds_station = response.Data;
        });

    };
    ////////////////////////////////
    $scope.scroll_qaMaintenance_height = $(window).height() - 170;
    $scope.scroll_qaMaintenance = {
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
            height: 'scroll_qaMaintenance_height'
        }

    };

    $scope.scroll_referre_height = $scope.popup_height - 300;
    $scope.scroll_referre = {
        width: 590,
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
            height: 'scroll_referre_height'
        }

    };


    /////////////////////////////////

    $scope.OPTCompn = []

    $scope.chkCompnSpec = function (index) {
        $scope.componentSpecification[index].checked = !$scope.componentSpecification[index].checked;
        $scope.entity.componentSpecificationId = $scope.componentSpecification[index].Id;
        console.log($scope.componentSpecification);
    }

    $scope.sb_station = {
        readOnly: true,
        focusStateEnabled: false,
        placeholder: '',
        displayExpr: 'IATA',
        valueExpr: 'Id',
        bindingOptions: {
            value: "entity.StationId",
            dataSource: 'ds_station',
        }
    }


    $scope.txt_OccurrenceDate = {
        readOnly: true,
        focusStateEnabled: false,
        displayFormat: 'yyyy-MM-dd',
        type: 'datetime',
        pickerType: "rollers",
        bindingOptions: {
            value: 'entity.DateOccurrence',
        }
    }

    $scope.txt_OccurrenceTime = {
        readOnly: true,
        focusStateEnabled: false,
        type: 'time',
        pickerType: "rollers",
        displayFormat: "HH:mm",
        bindingOptions: {
            value: 'entity.DateOccurrence',
        }
    }
    $scope.txt_acType = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.AircraftType',
        }
    }

    $scope.txt_acReg = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.Register',
        }
    }

    $scope.txt_atlNum = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.ATLNo',
        }
    }

    $scope.txt_taskNum = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.TaskNo',
        }
    }

    $scope.txt_reference = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.Reference',
        }
    }

    $scope.txt_time = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.UTCTime',
        }
    }

    $scope.txt_route = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.Route',
        }
    }

    $scope.txt_fltNum = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.FlightNumber',
        }
    }



    $scope.txt_event = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.EventDescription',
        }
    }
    $scope.txt_actionTaken = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.ActionTakenDescription',
        }
    }

    $scope.txt_name = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.EmployeeName',
        }
    }

    $scope.txt_CAALicense = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.CAALicenceNo',
        }
    }

    $scope.txt_authNum = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.AuthorizationNo',
        }
    }

    $scope.nb_serialNumber = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.SerialNumber'
        }
    }

    $scope.nb_partNumber = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.PartNumber'
        }
    }

    $scope.sb_compn = {
        showClearButton: false,
        searchEnabled: false,
        readOnly: true,
        focusStateEnabled: false,
        displayExpr: 'title',
        placeholder: 'Component',
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.ComponentSpecificationId',
            dataSource: 'dsComponentSpect'
        }
    };

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
    /////////////////////////////////
    $scope.isMaximise = true;
    $scope.maximise = function () {
        $scope.isMaximise = !$scope.isMaximise;
        //document.getElementById("#referForm").style.width = "100%"

    }
    $scope.getStyle = function () {
        var _width = '40%';
        if (!$scope.isMaximise)
            _width = '100%';
        return {
            'width': _width,
        }

    }


    var appWindow = angular.element($window);
    appWindow.bind('resize', function () {
        $scope.scroll_qaMaintenance_height = $(window).height() - 170;
    });


    $scope.$on('InitQAMaintenance', function (event, prms) {


        $scope.tempData = null;

        $scope.tempData = prms;

        $scope.followUpEntity.Category = $scope.tempData.Category;
        $scope.followUpEntity.Id = $scope.tempData.Id;
        $scope.followUpEntity.Type = $scope.tempData.Type;
        $scope.followUpEntity.EmployeeId = $scope.tempData.EmployeeId;
        $scope.isNotLocked = $scope.tempData.isNotLocked;

        /*  $scope.popup_add_visible = true;*/

        $scope.bind();
    });

    $scope.$on('onEmployeeSelectHide', function (event, prms) {
        console.log(prms);
        $scope.followUpEntity.Category = prms;
    });

    $scope.testLoaded = function () {
        console.log("loaded");
        $rootScope.$broadcast('InitTest', $scope.tempData);
    }

}]);


