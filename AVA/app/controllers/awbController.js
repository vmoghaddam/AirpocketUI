'use strict';
app.controller('awbController', ['$scope', '$location', 'mntService', 'authService', '$routeParams', '$rootScope', '$window', '$sce', function ($scope, $location, mntService, authService, $routeParams, $rootScope, $window, $sce) {


    $scope.btn_refresh = {
        text: 'Refresh',
        type: 'Default',
        icon: '',
        width: 120,
        onClick: function (e) {
            alert("Refresh")
        }

    };


    //////////////////

    $scope.popup_awb_visible = false;
    $scope.popup_height = $(window).height() - 100;
    $scope.popup_width = 1500;
    $scope.popup_awb_title = $rootScope.Title;
    $scope.popup_instance = null;
    $scope.isFullScreen = true;

    $scope.popup_awb = {


        showTitle: true,

        toolbarItems: [

            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'success', text: 'Select', onClick: function (e) {



                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'danger', text: 'Close', onClick: function (e) {

                        $scope.popup_awb_visible = false;

                    }
                }, toolbar: 'bottom'
            },

        ],

        visible: false,
        dragEnabled: true,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            $rootScope.IsRootSyncEnabled = false;
            $scope.popup_instance.repaint();


        },
        onShown: function (e) {

            if ($scope.isNew) {
                $scope.isContentVisible = true;
            }
            if ($scope.tempData != null)
                $scope.bind();

            //$rootScope.referred_list_instance.repaint();
            //$rootScope.$broadcast('InitTest', $scope.tempData);



        },
        onHiding: function () {
            $scope.entity = {
                Id: -1,
                EventTitleIds: [],

            };
            $scope.entity.Result = null;
            $scope.popup_awb_visible = false;
        },
        onContentReady: function (e) {
            if (!$scope.popup_instance)
                $scope.popup_instance = e.component;

        },
        // fullScreen:false,
        bindingOptions: {
            visible: 'popup_awb_visible',
            fullScreen: 'isFullScreen',
            title: 'popup_awb_title',
            height: 'popup_height',
            width: 'popup_width',
            'toolbarItems[0].visible': 'isNotLocked',
            //'toolbarItems[1].visible': 'isNotLocked',
            'toolbarItems[2].visible': 'isNotLocked',

        }
    };


    ////////////////////

    $scope.txt_parNo = {
        bindingOptions: {
            value: ''
        }
    }

    $scope.txt_description = {
        bindingOptions: {
            value: ''
        }
    }

    $scope.priority =
        [
            { title: 'Routine', id: 0 },
            { title: 'Urgent', id: 1 },
            { title: 'AOG', id: 2 },
        ];

    $scope.sb_reqPriority = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.priority,
        bindingOptions: {
            value: '',
        }
    }

    $scope.sb_register = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.priority,
        bindingOptions: {
            value: '',
        }
    }


    $scope.years =
        [
            { title: '96', id: 0 },
            { title: '97', id: 1 },
            { title: '98', id: 2 },
            { title: '90', id: 3 },
            { title: '00', id: 4 },
            { title: '01', id: 5 },
            { title: '02', id: 6 },
            { title: '03', id: 7 },
        ];

    $scope.sb_year = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.years,
        bindingOptions: {
            value: '',
        }
    }

    $scope.txt_nisNo = {
        bindingOptions: {
            value: ''
        }
    }

    $scope.txt_reqNo = {
        bindingOptions: {
            value: ''
        }
    }


    $scope.dt_dateFrom = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: ''
        }
    }

    $scope.dt_dateTo = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: ''
        }
    }

    ///////////////////////


    $scope.dg_awb_columns = [



        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },
        { dataField: '', caption: 'No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: '', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 100 },
        { dataField: '', caption: 'Cost', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'Company', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'Target', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'Destination', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
    ];



$scope.dg_awb_selected = null;
$scope.dg_awb_instance = null;
$scope.dg_awb = {



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
    height: $(window).height() - 260,
    width: $(window).width(),
    columns: $scope.dg_awb_columns,
    onContentReady: function (e) {
        if (!$scope.dg_awb_instance)
            $scope.dg_awb_instance = e.component;

    },

    onRowClick: function (e) {



    },

    onRowPrepared: function (e) {


    },


    onCellPrepared: function (e) {

    },

    onSelectionChanged: function (e) {
        var data = e.selectedRowsData[0];

        console.log(data);

        $scope.dg_awb_id.Id = e.selectedRowsData[0].Id;

        console.log($scope.dg_awb_id.id);
        if (!data) {
            $scope.dg_awb_selected = null;
        }
        else
            $scope.dg_awb_selected = data;


    },

    bindingOptions: {
        dataSource: 'dg_awb_ds'
    },
    columnChooser: {
        enabled: false
    },

};


$scope.$on('InitAWBPopup', function (event, prms) {

    $scope.tempData = prms;

    console.log("AWB Called");

    $scope.popup_awb_visible = true;
});



}]);


