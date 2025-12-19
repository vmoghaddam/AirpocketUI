'use strict';
app.controller('newPartNumberController', ['$scope', '$location', 'mntService', 'authService', '$routeParams', '$rootScope', '$window', '$sce', function ($scope, $location, mntService, authService, $routeParams, $rootScope, $window, $sce) {

    //mntService.authenticate({ "username": "test", "password": "1234" }).then(function (response) {





    //}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



    $scope.entity = {


        typeId: 93,
        categoryId: 98,
        creatorId: 1,
        hardTime: true,
        blockList: true,
        typeEfectivity: [],
        modelEffectivity: null,
        msnEffectivity: null

    };



    $scope.ataEntity = {
        "id": 0,
        "ata": "string",
        "title": "string"
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

    $scope.popup_personnel_visible = false;
    $scope.popup_height = 420;
    $scope.popup_width = 1250;
    $scope.popup_personnel_title = "New Part Number";
    $scope.popup_instance = null;
    $scope.isFullScreen = false;

    $scope.popup_personnel = {


        showTitle: true,

        toolbarItems: [

            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'success', icon: 'check', text: 'Save',validationGroup: 'partnumber', onClick: function (e) {
                        var result = e.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }

                        $scope.loadingVisible = true;
                        mntService.addPartNumber($scope.entity).then(function (res) {
                            if (res.errorCode == 101) {
                                $scope.loadingVisible = false;
                                General.ShowNotify("Error Occurred While Saving", 'error');
                            }
                            else {
                                $scope.loadingVisible = false;
                                General.ShowNotify("Saving Was Done Successfully", 'success');
                            }
                        });

                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'danger', text: 'Close', onClick: function (e) {

                        $scope.popup_personnel_visible = false;

                    }
                }, toolbar: 'bottom'
            },

        ],

        visible: false,
        dragEnabled: false,
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
            $scope.popup_personnel_visible = false;
        },
        onContentReady: function (e) {
            if (!$scope.popup_instance)
                $scope.popup_instance = e.component;

        },
        // fullScreen:false,
        bindingOptions: {
            visible: 'popup_personnel_visible',
            fullScreen: 'isFullScreen',
            title: 'popup_personnel_title',
            height: 'popup_height',
            width: 'popup_width',
            'toolbarItems[0].visible': 'isNotLocked',
            //'toolbarItems[1].visible': 'isNotLocked',
            'toolbarItems[2].visible': 'isNotLocked',

        }
    };
    //////////////////
    $scope.bind = function () {
        //mntService.getAtaChart().then(function (res) {
        //    $scope.ataType = res.data;
        //});

        mntService.getAFCTType().then(function (res) {
            $scope.dg_effec_ds = res.data;
        });

        mntService.get_ata_chart().then(function (res) {
            console.log(res);
            $scope.ataType = res.data;
        });
        mntService.getPartType().then(function (res) {
            $scope.partDs = res.data;
            console.log($scope.partDs);
        });
    };

    ////////////



    $scope.sb_ata = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'ata',

        bindingOptions: {
            value: 'entity.ataChapter',
            dataSource: 'ataType',
        }
    }

    $scope.descPartDs = [
        { id: 0, title: 'Description' },
        { id: 1, title: 'Part Type' }
    ]

    $scope.sb_descPart = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.descPartDs,
        bindingOptions: {
            value: 'entity.descPart',
        }
    }

    $scope.consumDs = [
        { id: 93, title: 'Rotable' },
        { id: 94, title: 'Consumable' },
        { id: 95, title: 'Fixed' },
        { id: 119, title: 'Unknown' }
    ]

    $scope.sb_consum = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.consumDs,
        bindingOptions: {
            value: '',
        }
    }

    $scope.sb_partType = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',

        bindingOptions: {
            value: 'entity.partTypeId',
            dataSource: 'partDs',
        }
    }

    $scope.uomDs =
        [
            { id: 106, title: "undefined" }
        ],

        $scope.sb_uom = {
            showClearButton: false,
            searchEnabled: false,
            displayExpr: "title",
            valueExpr: 'id',
            dataSource: $scope.uomDs,
            bindingOptions: {
                value: 'entity.measurementUnitId',

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

    $scope.txt_reference = {
        bindingOptions: {
            value: 'entity.ipC_Reference'
        }
    }



    ////////////////////


    $scope.dg_effec_columns = [


        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },
        { dataField: 'id', caption: 'Aircraft Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },

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
        height: $scope.popup_height - 152,
        width: '100%',
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
            var data = e.selectedRowsData;

            if (!data) {
                $scope.dg_effec_selected = null;
            }
            else {
                $scope.entity.typeEfectivity = [];
                $.each(data, function (_i, _d) {
                    console.log("date loop", _d)
                    $scope.entity.typeEfectivity.push(_d.id);
                });
            }

            console.log($scope.entity.typeEfectivity);
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

        $scope.bind();
        $scope.popup_personnel_visible = true;
    });

    $scope.loadingVisible = false;
    $scope.loadPanel = {
        message: 'Please wait...',

        showIndicator: true,
        showPane: true,
        shading: true,
        closeOnOutsideClick: false,
        shadingColor: "rgba(0,0,0,0.4)",
        onShown: function () {

        },
        onHidden: function () {

        },
        bindingOptions: {
            visible: 'loadingVisible'
        }
    };



}]);


