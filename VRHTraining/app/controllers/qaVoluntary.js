'use strict';
app.controller('qaVoluntaryController', ['$scope', '$location', 'qaService', 'authService', '$routeParams', '$rootScope', '$window', function ($scope, $location, qaService, authService, $routeParams, $rootScope, $window) {

    $scope.isFullScreen = true;

    $scope.entity = {
        Id: -1,
    };

    $scope.followUpEntity = {
        Type: 2,
    }

    $rootScope.result = {
        Result: null,
    };

    /////////////////////////////////
    $scope.flight = null;
    $scope.fill = function (data) {
        $scope.entity = data;
        $rootScope.result.Result = data.Result;
    };
    $scope.isLockVisible = false;
    $scope.bind = function () {

        qaService.getVHRById($scope.entity.Id).then(function (response) {
            $scope.fill(response.Data);
            if ($scope.tempData.isNotDetermined == true)
                $scope.isSettled = true;
        })

        qaService.getIsResponsible($scope.followUpEntity.EmployeeId, $scope.followUpEntity.Type, $scope.followUpEntity.Id).then(function (response) {
            if (response.IsSuccess == true)
                $scope.isResponsible = true

        });

        qaService.getImportedFile($scope.followUpEntity.Id, $scope.followUpEntity.ProducerId, $scope.followUpEntity.Type).then(function (response) {
            console.log(response);
            $rootScope.dg_attachments_ds = response.Data;
        });
    };
    ////////////////////////////////
    $scope.scroll_vhradd_height = $(window).height() - 170;
    $scope.scroll_vhradd = {
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
            height: 'scroll_vhradd_height'
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

    $scope.txt_hazardDate = {
        readOnly: true,
        focusStateEnabled: false,
        width: '100%',
        bindingOptions: {
            value: 'entity.DateReport',
        }
    }

    $scope.txt_repDate = {
        readOnly: true,
        focusStateEnabled: false,
        width: '100%',
        bindingOptions: {
            value: 'entity.DateOccurrence',
        }
    }

    $scope.txt_affectedArea = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.AffectedArea',
        }
    }

    $scope.txt_hazardDes = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.HazardDescription',
        }
    }

    $scope.txt_recAction = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.RecommendedAction',
        }
    }


    $scope.txt_email = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.Email',
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
            value: 'entity.EmployeeName',
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

    $scope.txt_relatedDepartment = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.RelatedDepartment',
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

    var appWindow = angular.element($window);
    appWindow.bind('resize', function () {
        $scope.scroll_vhradd_height = $(window).height() - 170;
    });


    
    ///////////////////////////////////

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

    $scope.tempData = null;

    $scope.$on('InitVHR', function (event, prms) {


        $scope.tempData = prms;
        $scope.entity.Id = $scope.tempData.Id;
        $scope.entity.Type = $scope.tempData.Type;
        $scope.entity.EmployeeId = $scope.tempData.EmployeeId;

        $scope.followUpEntity.Category = $scope.tempData.Category;
        $scope.followUpEntity.Id = $scope.tempData.Id;
        $scope.followUpEntity.Type = $scope.tempData.Type;
        $scope.followUpEntity.EmployeeId = $scope.tempData.EmployeeId;

        $scope.isNotLocked = $scope.tempData.isNotLocked;

        /* $scope.popup_add_visible = true;*/

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


