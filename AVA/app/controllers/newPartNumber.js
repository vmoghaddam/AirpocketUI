'use strict';
app.controller('newPartNumberController', ['$scope', '$location', 'mntService', 'authService', '$routeParams', '$rootScope', '$window', '$sce', function ($scope, $location, mntService, authService, $routeParams, $rootScope, $window, $sce) {

    mntService.authenticate({ "username": "test", "password": "1234" }).then(function (response) {





    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



    $scope.entity = {
        id: 0,
        partTypeId: 0,
        measurementUnitId: 0,
        typeId: 0,
        categoryId: 0,
        creatorId: 0,
        hardTime: true,
        blockList: true,
        ipC_Reference: 'test',
        typeEfectivity: [
            'test'
        ],
        modelEffectivity: [
            'test'
        ],
        msnEffectivity: [
            {
                id: 0,
                register: 'test'
            }
        ]
    };

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

    $scope.popup_pn_visible = false;
    $scope.popup_height = $(window).height() - 500;
    $scope.popup_width = 1000;
    $scope.popup_pn_title = $rootScope.Title;
    $scope.popup_instance = null;
    $scope.isFullScreen = false;

    $scope.popup_pn = {


        showTitle: true,

        toolbarItems: [

            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'success',icon:'check', text: 'Save', onClick: function (e) {

                        mntService.addPartNumber($scope.entity).then(function (res) {
                            console.log("Add Part Number Response: ", res);
                        });

                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'danger', text: 'Close', onClick: function (e) {

                        $scope.popup_pn_visible = false;

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
            $scope.popup_pn_visible = false;
        },
        onContentReady: function (e) {
            if (!$scope.popup_instance)
                $scope.popup_instance = e.component;

        },
        // fullScreen:false,
        bindingOptions: {
            visible: 'popup_pn_visible',
            fullScreen: 'isFullScreen',
            title: 'popup_pn_title',
            height: 'popup_height',
            width: 'popup_width',
            'toolbarItems[0].visible': 'isNotLocked',
            //'toolbarItems[1].visible': 'isNotLocked',
            'toolbarItems[2].visible': 'isNotLocked',

        }
    };
    //////////////////

    $scope.type =
        [
            { title: 'Routine', id: 0 },
            { title: 'Urgent', id: 1 },
            { title: 'AOG', id: 2 },
        ];

    $scope.sb_ata = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.type,
        bindingOptions: {
            value: 'entity.ataChapter',
        }
    }

    $scope.txt_pn = {
        bindingOptions: {
            value: 'entity.partNumber'
        }
    }

    $scope.txt_figNo = {
        bindingOptions: {
            value: 'entity.figureNo'
        }
    }

    $scope.txt_itemNo = {
        bindingOptions: {
            value: 'entity.itemNo'
        }
    }

    $scope.txt_itemNo = {
        bindingOptions: {
            value: 'entity.itemNo'
        }
    }
    $scope.txt_desc = {
        bindingOptions: {
            value: 'entity.description'
        }
    }

    $scope.txt_remark = {
        bindingOptions: {
            value: 'entity.remark'
        }
    }



    ////////////////////

    $scope.dg_effec_ds = [
        { Id: '0', AircraftType: 'A320' },
        { Id: '1', AircraftType: 'B737' },
        { Id: '2', AircraftType: 'Embraer 145' },
        { Id: '3', AircraftType: 'MD 80' },
    ];

    $scope.dg_effec_columns = [


        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },
        { dataField: 'AircraftType', caption: 'Aircraft Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 1000 },
        
    ];



    $scope.dg_effec_selected = null;
    $scope.dg_effec_instance = null;
    $scope.dg_effec = {



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
        selection: { mode: 'multiple' },

        columnAutoWidth: false,
        height: $(window).height() - 700,
        width: $(window).width(),
        columns: $scope.dg_effec_columns,
        onContentReady: function (e) {
            if (!$scope.dg_effec_instance)
                $scope.dg_effec_instance = e.component;

        },

        onRowClick: function (e) {



        },

        onRowPrepared: function (e) {


        },


        onCellPrepared: function (e) {

        },

        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];
          
            if (!data) {
                $scope.dg_effec_selected = null;
            }
            else
                $scope.dg_effec_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_effec_ds'
        },
        columnChooser: {
            enabled: false
        },

    };

    $scope.$on('InitNewPNPopup', function (event, prms) {

        $scope.tempData = prms;


        $scope.popup_pn_visible = true;
    });



}]);


