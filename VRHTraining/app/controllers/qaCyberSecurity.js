'use strict';
app.controller('qaCyberSecurity', ['$scope', '$location', 'qaService', 'authService', '$routeParams', '$rootScope', '$window', function ($scope, $location, qaService, authService, $routeParams, $rootScope, $window) {
    $scope.isNew = true;
    $scope.isEditable = false;
    $scope.isLockVisible = false;
    $scope.isContentVisible = false;
    $scope.isFullScreen = false;
    var detector = new MobileDetect(window.navigator.userAgent);

    $scope.isFullScreen = true;

    $scope.entity = {
        Id: -1,
        Status: null,
        StatusEmployeeId: null,
        DateStatus: null,
        DateSign: null
    };

    $scope.followUpEntity = {
        Type: 7,
    }

    $rootScope.result = {
        Result: null,
    };

    /////////////////////////////////

    $scope.chkIncidentBy = function (obj) {
        var _id = obj.Id;
        var _val = obj.checked;

        $.each($scope.incident, function (_i, _d) {

            if (_d.Id == _id) {
                _d.checked = _val;
                if (_val)
                    $scope.entity.IncidentId = _id;
            }
            else
                _d.checked = false;
        });
    }

    $scope.chkMethodBy = function (obj) {
        var _id = obj.Id;
        var _val = obj.checked;

        $.each($scope.method, function (_i, _d) {

            if (_d.Id == _id) {
                _d.checked = _val;
                if (_val)
                    $scope.entity.MethodId = _id;
            }
            else
                _d.checked = false;
        });
    }

    $scope.chkAccessBy = function (obj) {
        var _id = obj.Id;
        var _val = obj.checked;

        $.each($scope.access, function (_i, _d) {

            if (_d.Id == _id) {
                _d.checked = _val;
                if (_val)
                    $scope.entity.AccessId = _id;
            }
            else
                _d.checked = false;
        });
    }

   
    $scope.fill = function (data) {

        $scope.entity = data;
        $rootScope.result.Result = data.Result;


        $.each($scope.incident, function (_i, _d) {
            if (_d.Id == data.IncidentId)
                _d.checked = true;
        });

        $.each($scope.access, function (_i, _d) {
            if (_d.Id == data.AccessId)
                _d.checked = true;
        });

        $.each($scope.method, function (_i, _d) {
            if (_d.Id == data.MethodId)
                _d.checked = true;
        });
       

    };
    $scope.isLockVisible = false;
    $scope.bind = function () {
        $scope.entity.FlightId = $scope.tempData.FlightId;


        qaService.getCyberAccess().then(function (res) {
            $scope.access = res.Data;
            console.log(res.Data);
        });

        qaService.getCyberMethod().then(function (res) {
            $scope.method = res.Data;
        });

        qaService.getCyberIncident().then(function (res) {
            $scope.incident = res.Data;
            qaService.getCyberById($scope.followUpEntity.Id).then(function (res) {
               
                    $scope.fill(res.Data);
                
            });
        });

        
        qaService.getImportedFile($scope.followUpEntity.Id, $scope.followUpEntity.ProducerId, $scope.followUpEntity.Type).then(function (response) {
            console.log(response);
            $rootScope.dg_attachments_ds = response.Data;
        });


    };
    ////////////////////////////////
    $scope.scroll_qaCyber_height = $(window).height() - 170;
    $scope.scroll_qaCyber = {
       /* width: '100%',*/
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
            height: 'scroll_qaCyber_height'
        }

    };

    /////////////////////////////////


    $scope.txt_name = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.EmployeeName',
        }
    }

    $scope.txt_jobTitle = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.JobTitle',
        }
    }

    $scope.txt_contactInfo = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.ContactInfo',
        }
    }

    $scope.txt_dateEvent = {
        readOnly: true,
        focusStateEnabled: false,
        displayFormat: "yyyy-MMM-dd",
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


    $scope.txt_dateIncident = {
        readOnly: true,
        focusStateEnabled: false,
        type: 'datetime',
        width: '100%',
        pickerType: "rollers",
        displayFormat: "yyyy-MMM-dd  HH:mm",
        bindingOptions: {
            value: 'entity.DateIncident',
        }
    }

    $scope.txt_attack = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.AttackDescriptipn',
        }
    }

    $scope.txt_impacted = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.ImpactDescription',
        }
    }
    $scope.txt_breached = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.BreachedDescription',
        }
    }
    $scope.txt_containment = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.AccessDescription',
        }
    }
    $scope.txt_other = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.Other',
        }
    }

    $scope.txt_mobile = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.Mobile',
        }
    }

    $scope.txt_email = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.Email',
        }
    }

    $scope.txt_result = {
        bindingOptions: {
            value: 'result.Result',
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
        $scope.scroll_qaCyber_height = $(window).height() - 170;
    });


    $scope.tempData = null;

    $scope.$on('InitQACyberSecurity', function (event, prms) {


        $scope.tempData = prms;

        $scope.followUpEntity.Category = $scope.tempData.Category;
        $scope.followUpEntity.Id = $scope.tempData.Id;
        $scope.followUpEntity.Type = $scope.tempData.Type;
        $scope.followUpEntity.EmployeeId = $scope.tempData.EmployeeId;
        $scope.followUpEntity.ProducerId = parseInt($scope.tempData.ProducerId);
        $scope.isNotLocked = $scope.tempData.isNotLocked;

        console.log($scope.followUpEntity);
        $scope.bind();
     

    });


    $scope.testLoaded = function () {
        $rootScope.$broadcast('InitTest', $scope.tempData);
    }



}]);

