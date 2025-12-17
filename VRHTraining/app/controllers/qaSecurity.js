'use strict';
app.controller('qaSecurityController', ['$scope', '$location', 'qaService', 'authService', '$routeParams', '$rootScope', '$window', function ($scope, $location, qaService, authService, $routeParams, $rootScope, $window) {
    $scope.isFullScreen = false;
    
    var detector = new MobileDetect(window.navigator.userAgent);
    //if (detector.mobile() && !detector.tablet())

    $scope.isFullScreen = true;

    $scope.entity = {
        Id: -1,
    };

    $scope.followUpEntity = {
        Type: 5,
    };

    $rootScope.result = {
        Result: null,
    };

    /////////////////////////////////
    $scope.fill = function (data) {
        $scope.entity = data;
        $rootScope.result.Result = data.Result;
        $.each($scope.shrReason, function (_i, _d) {
            if (_d.Id == data.ReasonId)
                _d.checked = true;
        });
    };


    $scope.bind = function () {

        qaService.getSHRReason().then(function (res) {
            $scope.shrReason = res.Data
            qaService.getSHRById($scope.followUpEntity.Id).then(function (res) {
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
    $scope.scroll_qaSecurity_height = $(window).height() - 170;
    $scope.scroll_qaSecurity = {
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
            height: 'scroll_qaSecurity_height'
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


    $scope.chkReason = function (index) {

        $.each($scope.shrReason, function (_i, _d) {
            if (_d.Title.includes('سایر')) {
                if (_d.checked)
                    $scope.showOther = true;
                else
                    $scope.showOther = false;
            }
        });

        $scope.shrReason[index].checked = !$scope.shrReason[index].checked;
        $scope.entity.ReasonId = $scope.shrReason[index].Id;
    }



    $scope.txt_reportDate = {
        readOnly: true,
        focusStateEnabled: false,
        width: '100%',
        bindingOptions: {
            value: 'entity.DateReport',
        }
    }

    $scope.txt_hazardDate = {
        readOnly: true,
        focusStateEnabled: false,
        width: '100%',
        displayFormat: 'yyyy-MM-dd HH:mm',
        type: 'datetime',
        bindingOptions: {
            value: 'entity.DateOccurrence',
        }
    }
    $scope.txt_area = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.Place',
        }
    }

    $scope.txt_route = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.Route',
        }
    }

    $scope.txt_eventOther = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.ReasonDescription',
        }
    }

    $scope.txt_register = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.Register',
        }
    }

    $scope.txt_flightNumber = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.FlightNumber',
        }
    }

    $scope.txt_camera = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.Camera',
        }
    }

    $scope.txt_carryingBox = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.CarryingBox',
        }
    }

    $scope.txt_comail = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.Comail',
        }
    }


    $scope.txt_handRocket = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.HandRocket',
        }
    }


    $scope.dsBeark = [
        { value: false, title: 'NO' },
        { value: true, title: 'YES' },
    ];

    $scope.sb_workBreak = {
        readOnly: true,
        focusStateEnabled: false,
        showClearButton: false,
        searchEnabled: false,
        dataSource: $scope.dsBeark,
        placeholder: '',
        displayExpr: 'title',
        valueExpr: 'value',
        bindingOptions: {
            value: 'entity.WorkBreak',
        }
    }

    $scope.dsInjury = [
        { value: false, title: 'NO' },
        { value: true, title: 'YES' },
    ];

    $scope.sb_injuryOccuring = {
        readOnly: true,
        focusStateEnabled: false,
        showClearButton: false,
        searchEnabled: false,
        dataSource: $scope.dsInjury,
        placeholder: '',
        displayExpr: 'title',
        valueExpr: 'value',
        bindingOptions: {
            value: 'entity.InjuryOccuring',
        }
    }



    $scope.txt_injuryDescription = {
        readOnly: true,
        focusStateEnabled: false,
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.InjuryDescription',
        }
    }


  

    $scope.txt_other = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.Other',
        }
    }

    $scope.txt_equipmentDescription = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.EquipmentDescription',
        }
    }

    $scope.txt_workBreakPeriod = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.WorkBreakPeriod',
        }
    }

    $scope.txt_preventiveActions = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.PreventiveActions',
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
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.Email',
        }
    }

    $scope.txt_description = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.Description',
        }
    }

    $scope.txt_telNumber = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.Mobile ',
        }
    }

    $scope.txt_name = {
        readOnly: true,
        focusStateEnabled: false,
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

    //////////////////////////////////

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
        $scope.scroll_qaSecurity_height = $(window).height() - 170;
    });


    $scope.$on('InitQASecurity', function (event, prms) {


        $scope.tempData = null;
        $scope.tempData = prms;

        $scope.followUpEntity.Category = $scope.tempData.Category;
        $scope.followUpEntity.Id = $scope.tempData.Id;
        $scope.followUpEntity.Type = $scope.tempData.Type;
        $scope.followUpEntity.EmployeeId = $scope.tempData.EmployeeId;
        $scope.isNotLocked = $scope.tempData.isNotLocked;
        $scope.isNotDetermined = $scope.tempData.isNotDetermined;

        $scope.bind();
    });

    $scope.$on('onEmployeeSelectHide', function (event, prms) {
        $scope.followUpEntity.Category = prms;
    });

    $scope.testLoaded = function () {
        $rootScope.$broadcast('InitTest', $scope.tempData);
    }

}]);


