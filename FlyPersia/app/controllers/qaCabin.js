'use strict';
app.controller('qaCabinController', ['$scope', '$location', 'qaService', 'authService', '$routeParams', '$rootScope', '$window', function ($scope, $location, qaService, authService, $routeParams, $rootScope, $window) {
    $scope.isNew = true;
    $scope.isEditable = false;
    $scope.isLockVisible = false;
    $scope.isContentVisible = false;
    $scope.isFullScreen = false;

    var detector = new MobileDetect(window.navigator.userAgent);

    //if (detector.mobile() && !detector.tablet())
    $scope.isFullScreen = true;

    $scope.entity = {
        Id: -1,
        EventTitleIds: [],
    };

    $scope.followUpEntity = {
        Type: 0,
    }

    $rootScope.result = {
        Result: null,
    };

    $scope.fpoptions = [];
    $scope.etoptions = [];

    /////////////////////////////////
    $scope.fill = function (data) {
		console.log(data);
        $scope.entity = data.result;
        $scope.entity.EventTitleIds = [];
        $rootScope.result.Result = data.result.Result;
        $.each($scope.flightPhase, function (_i, _d) {
            if (_d.Id == data.result.PhaseId)
                _d.checked = true;
        });
        $.each(data.CSREvent, function (_i, _d) {
            $scope.etoptions[_d.EventTitleId] = true;
        });

    };
    $scope.isLockVisible = false;
    $scope.bind = function () {

        qaService.getCabinReporter().then(function (res) {
            $scope.ds_reporter = res.Data;
        });

        qaService.getEventTitle().then(function (res) {
            $scope.eventTitle = res.Data;

        });

        qaService.getFlightPhase().then(function (res) {
            $scope.flightPhase = res.Data;
            qaService.getCSRById($scope.followUpEntity.Id).then(function (res) {
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
    $scope.scroll_qaCabin_height = $(window).height() - 170;
    $scope.scroll_qaCabin = {
        //width: 900,
        bounceEnabled: true,
        showScrollbar: 'never',
        pulledDownText: '',
        pullingDownText: '',
        useNative: false,
        refreshingText: 'Updating...',
        onPullDown: function (options) {

            options.component.release(true);

        },
		onReachBottom: function(e) {  
    // ..  
    e.component.release(true);  
    // ..  
} ,
        onInitialized: function (e) {


        },
        bindingOptions: {
            height: 'scroll_qaCabin_height'
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









    $scope.chkFlightPhase = function (index) {
        $scope.flightPhase[index].checked = !$scope.flightPhase[index].checked;
        $scope.entity.FlightPhaseId = $scope.flightPhase[index].Id;
    }

    $scope.chkEventTitle = function (index) {
        $scope.eventTitle[index].checked = !$scope.eventTitle[index].checked;

        $.each($scope.eventTitle, function (_i, _d) {
            if (_d.Title.includes('Other')) {
                if (_d.checked)
                    $scope.showOther = true;
                else
                    $scope.showOther = false;
            }
        });

        $scope.entity.EventTitleIds.push($scope.eventTitle[index].Id);

    }

    $scope.txt_repFieldBy = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.ReportFiledBy',
        }
    }

    $scope.sb_reporter = {
        readOnly: true,
        focusStateEnabled: false,
        showClearButton: false,
        searchEnabled: false,
        placeholder: '',
        displayExpr: 'Title',
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity.ReporterId',
            dataSource: 'ds_reporter',
        }
    }

    $scope.txt_repFieldBy = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.ReportFiledBy',
            useMaskBehavior: 'isEditable',
            readOnly: '!isEditable'
        }
    }

    $scope.txt_OccurrenceDate = {
        readOnly: true,
        focusStateEnabled: false,
        type: 'datetime',
        pickerType: "rollers",
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

    $scope.num_fltNum = {
        min: 0,
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.FlightNumber',
        }
    }

    $scope.txt_fltSeg = {
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
            value: 'entity.EventTitleRemark',
        }
    }

    $scope.txt_eventLoc = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.EventLocation',
        }
    }

    $scope.txt_acType = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.TypeRegisteration',
        }
    }

    $scope.num_PAXNum = {
        min: 0,
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.PaxTotal',
        }
    }



    $scope.txt_desOccurrence = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.Describtion',
        }
    }
    $scope.txt_Rec = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.Recommendation',
        }
    }

    $scope.txt_wxCondition = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.WeatherCondition',
        }
    }

    $scope.num_refNumber = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.RefNumber',
        }
    }

    $scope.txt_BOX = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.BOX',
        }
    }

    $scope.txt_Name = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.EmployeeName',
        }
    }

    $scope.txt_recived = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.Recived',
        }
    }

    $scope.txt_followup = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'entity.FollowUp',
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

        { dataField: 'Description', caption: 'Description', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minwidth: 100, },
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
		$scope.scroll_qaCabin_height = $(window).height() - 170;
	});

    $scope.$on('InitQACabin', function (event, prms) {


        $scope.tempData = null;

        $scope.tempData = prms;

        console.log('cabin tem data', $scope.tempData);

        $scope.followUpEntity.Category = $scope.tempData.Category;
        $scope.followUpEntity.Id = $scope.tempData.Id;
        $scope.followUpEntity.Type = $scope.tempData.Type;
        $scope.followUpEntity.EmployeeId = $scope.tempData.EmployeeId;
        $scope.isNotLocked = $scope.tempData.isNotLocked;

        $scope.bind();

    });

    $scope.$on('onEmployeeSelectHide', function (event, prms) {
        $scope.followUpEntity.Category = prms;
    });

    $scope.testLoaded = function () {
        $rootScope.$broadcast('InitTest', $scope.tempData);
    }

}]);

