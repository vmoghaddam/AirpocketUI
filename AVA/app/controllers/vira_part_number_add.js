'use strict';
app.controller('vira_part_number_addController', ['$scope', '$location', '$q', 'mntService', 'authService', '$routeParams', '$rootScope', '$window', '$sce', 'vira_general_service', function ($scope, $location, $q, mntService, authService, $routeParams, $rootScope, $window, $sce, vira_general_service) {

    $scope.isNew = null;

    $scope.entity = {
        id: 0,
        partTypeId: 0,
        measurementUnitId: 0,
        typeId: 0,
        categoryId: 0,
        creatorId: 8,
        ataChapter: null,
        partNumber: null,
        description: null,
        hardTime: true,
        blockList: true,
        ipC_Reference: null,
        figureNo: null,
        itemNo: null,
        remark: null,
        typeEfectivity: [],
        modelEffectivity: [],
        msnEffectivity: []
    };



    $scope.ataEntity = {
        "id": 0,
        "ata": "string",
        "title": "string"
    };



    $scope.selectedTabIndex = -1;
    $scope.selectedTabId = null;
    $scope.popupselectedTabIndex = -1;
    $scope.popupselectedTabId = null;
    $scope.tabs = [
        { text: "A/C Type", id: 'type' },
        { text: "A/C Model", id: 'model' },
        { text: "A/C MSN", id: 'msn' },
    ];


    $scope.$watch("selectedTabIndex", function (newValue) {
        //ati
        try {
            $('.tabc').hide();
            var id = $scope.tabs[newValue].id;
            $scope.selectedTabId = id;
            $('#' + id).fadeIn();

            switch (id) {
                case 'type':

                    break;

                case 'model':

                    break;

                case 'msn':

                    break;

                default:
                    break;
            }
            if ($scope.dg_type_instance)
                $scope.dg_type_instance.refresh();
            if ($scope.dg_model_instance)
                $scope.dg_model_instance.refresh();
            if ($scope.dg_msn_instance)
                $scope.dg_msn_instance.refresh();

        }
        catch (e) {

        }


    });


    $scope.tabs_options = {
        scrollByContent: true,
        showNavButtons: true,


        onItemClick: function (arg) {
            //$scope.selectedTab = arg.itemData;

        },
        onItemRendered: function (e) {
            $scope.selectedTabIndex = -1;
            $scope.selectedTabIndex = 0;
        },
        bindingOptions: {
            //visible: 'tabsdatevisible',
            dataSource: { dataPath: "tabs", deep: true },
            selectedIndex: 'selectedTabIndex'
        }

    };


    $scope.clear_entity = function () {
        $scope.entity.id = 0;
        $scope.entity.partTypeId = 0;
        $scope.entity.measurementUnitId = 0;
        $scope.entity.typeId = 0;
        $scope.entity.categoryId = 0;
        $scope.entity.creatorId = 8;
        $scope.entity.ataChapter = null;
        $scope.entity.partNumber = null;
        $scope.entity.description = null;
        $scope.entity.hardTime = true;
        $scope.entity.blockList = true;
        $scope.entity.ipC_Reference = null;
        $scope.entity.figureNo = null;
        $scope.entity.itemNo = null;
        $scope.entity.remark = null;
        $scope.entity.typeEfectivity = [];
        $scope.entity.modelEffectivity = [];
        $scope.entity.msnEffectivity = []
    }




    $scope.btn_refresh = {
        text: 'Refresh',
        type: 'Default',
        icon: '',
        width: 120,
        onClick: function (e) {
            alert("Refresh")
        }

    };


    $scope.save = function (callback) {
        $scope.loadingVisible = true;
        mntService.addPartNumber($scope.entity).then(function (res) {
            $scope.loadingVisible = false;
            if (callback)
                callback(res);
            else {
                if (res.errorCode) {
                    General.ShowNotify(res.errorMessage, 'error');
                }
                else {
                    $scope.loadingVisible = false;

                }
            }
        });
    };
    $scope.edit = function (callback) {
        $scope.loadingVisible = true;
        vira_general_service.edit_part_number($scope.entity).then(function (res) {
            $scope.loadingVisible = false;
            if (callback)
                callback(res);
            else {
                if (res.errorCode) {
                    General.ShowNotify(res.errorMessage, 'error');
                }
                else {
                    $scope.loadingVisible = false;

                }
            }
        });
    };
    //////////////////

    $scope.popup_personnel_visible = false;
    $scope.popup_height = 400;
    $scope.popup_width = 1200;
    $scope.popup_personnel_title = "New Part Number";
    $scope.popup_instance = null;
    $scope.isFullScreen = false;

    $scope.popup_personnel = {


        showTitle: true,

        toolbarItems: [


            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'danger', text: 'Close', onClick: function (e) {

                        $scope.popup_personnel_visible = false;

                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'success', text: 'Save', validationGroup: 'partnumber', onClick: function (e) {
                        ////var result = e.validationGroup.validate();

                        ////if (!result.isValid) {
                        ////    General.ShowNotify(Config.Text_FillRequired, 'error');
                        ////    return;
                        ////}

                        //$scope.loadingVisible = true;
                        //mntService.addPartNumber($scope.entity).then(function (res) {
                        //    if (res.errorCode == 101) {
                        //        $scope.loadingVisible = false;
                        //        General.ShowNotify("Error Occurred While Saving", 'error');
                        //    }
                        //    else {
                        //        $scope.loadingVisible = false;
                        //        General.ShowNotify("Saving Was Done Successfully", 'success');
                        //    }
                        //});

                        $scope.loadingVisible = true;
                        if ($scope.isNew) {
                            $scope.save(function (res) {
                                if (res.errorCode) {
                                    if (res.errorCode == 10029) {
                                        mntService.authenticate({ "username": "test", "password": "1234" }).then(function (response) {
                                            $scope.save();

                                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                                    }
                                    else
                                        General.ShowNotify(res.errorMessage, 'error');
                                }
                                else {
                                    General.ShowNotify('Saving Was Done Successfully', 'success');
                                    $scope.popup_personnel_visible = false;
                                    $scope.loadingVisible = false;
                                }
                            });
                        }
                        else {
                            $scope.edit(function (res) {
                                if (res.errorCode) {
                                    if (res.errorCode == 10029) {
                                        mntService.authenticate({ "username": "test", "password": "1234" }).then(function (response) {
                                            $scope.edit();

                                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                                    }
                                    else
                                        General.ShowNotify(res.errorMessage, 'error');
                                }
                                else {
                                    General.ShowNotify('Saving Was Done Successfully', 'success');
                                    $scope.popup_personnel_visible = false;
                                    $scope.loadingVisible = false;
                                }
                            });

                        }

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

            //if ($scope.isNew) {
            //    $scope.isContentVisible = true;
            //}
            //if ($scope.tempData != null)

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
            $scope.clear_entity();
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

        mntService.getAFCTModel().then(function (res) {
            $scope.models = res.data;
            console.log("Models", $scope.models)
        });

        mntService.getAFCTRegister().then(function (res) {

            $scope.registers = res.data;
            console.log('registers', $scope.registers)
        });

        mntService.getReceiptPN(101).then(function (res) {
            $scope.ds_unit = res;
        });

        mntService.get_ata_chart().then(function (res) {
            console.log(res);
            $scope.ds_ata = res;
        });
        mntService.getPartType().then(function (res) {
            $scope.ds_part_type = res.data;
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
            dataSource: 'ds_ata'
        }
    }
    $scope.ds_comp = [
        { id: 98, title: 'Component' },
        { id: 99, title: 'General Tools' },
        { id: 100, title: 'Special Tools' },
        { id: 119, title: 'Unknown' }
    ]

    $scope.sb_comp = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.ds_comp,
        bindingOptions: {
            value: 'entity.categoryId',
        }
    }

    $scope.sb_part_type = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.partTypeId',
            dataSource: 'ds_part_type',
        }
    }

    $scope.ds_asset = [
        { id: 93, title: 'Rotable' },
        { id: 94, title: 'Consumable' },
        { id: 95, title: 'Fixed Assets' },
        { id: 119, title: 'Unknown' }
    ]

    $scope.sb_asset = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.ds_asset,
        bindingOptions: {
            value: 'entity.typeId',
        }
    }


    $scope.sb_unit = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.measurementUnitId',
            dataSource: 'ds_unit',
        }
    }

    $scope.txt_ipc = {
        bindingOptions: {
            value: 'entity.ipC_Reference'
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

    $scope.txt_pn = {
        bindingOptions: {
            value: 'entity.partNumber'
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

    $scope.txt_pt = {
        bindingOptions: {
            value: 'entity.partTypeId'
        }
    }

    $scope.txt_remark = {
        bindingOptions: {
            value: 'entity.remark'
        }
    }



    $scope.ch_block = {
        bindingOptions: {
            value: 'entity.blockList',
        }
    }

    $scope.ch_ht = {
        bindingOptions: {
            value: 'entity.hardTime',
        }
    }


    ////////////////////

    var get_ac_type = function (data) {
        var deferred = $q.defer();
        $.each(data, function (_i, _d) {
            $scope.entity.typeEfectivity.push(_d.id);
        })
        deferred.resolve($scope.entity.typeEfectivity);
        console.log('deferred', deferred);

        return deferred.promise;
    };


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
        height: $scope.popup_height - 178,
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
            console.log(data)
            if (!data) {
                $scope.dg_effec_selected = null;
            }
            else {
                $scope.entity.typeEfectivity = [];
                $scope.dg_model_ds = [];
                $scope.dg_msn_ds = [];


                get_ac_type(data).then(function (e) {

                    console.log($scope.entity.typeEfectivity)
                    $.each($scope.entity.typeEfectivity, function (_i, _d) {

                        $scope.dg_model_ds = Enumerable.From($scope.models).Where(function (x) {
                            var models = x.id.split("-")[0];
                            return models == _d;
                            return
                        }).ToArray();

                        $scope.dg_msn_ds = Enumerable.From($scope.registers).Where(function (x) {
                            console.log(x);
                            var models = x.acfT_ModelId.split("-")[0];
                            return models == _d;
                        }).ToArray();


                        console.log("dddddd", _d);
                    });
                });



            }


        },

        bindingOptions: {
            dataSource: 'dg_effec_ds'
        },
        columnChooser: {
            enabled: false
        },

    };

    $scope.dg_msn_columns = [


        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },
        { dataField: 'register', caption: 'Register', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },

    ];


    $scope.dg_msn_selected = null;
    $scope.dg_msn_instance = null;
    $scope.dg_msn = {



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
        height: $scope.popup_height - 178,
        width: '100%',
        columns: $scope.dg_msn_columns,
        onContentReady: function (e) {
            if (!$scope.dg_msn_instance)
                $scope.dg_msn_instance = e.component;

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
                $scope.dg_msn_selected = null;
            }
            else {
                $scope.entity.msnEffectivity = [];
                $.each(data, function (_i, _d) {
                    console.log("date loop", _d)
                    $scope.entity.msnEffectivity.push(_d.id);
                });
            }

            console.log($scope.entity.typeEfectivity);
        },

        bindingOptions: {
            dataSource: 'dg_msn_ds'
        },
        columnChooser: {
            enabled: false
        },

    };

    $scope.dg_model_columns = [


        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },
        { dataField: 'id', caption: 'Aircraft Model', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },

    ];



    $scope.dg_model_selected = null;
    $scope.dg_model_instance = null;
    $scope.dg_model = {



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
        height: $scope.popup_height - 178,
        width: '100%',
        columns: $scope.dg_model_columns,
        onContentReady: function (e) {
            if (!$scope.dg_model_instance)
                $scope.dg_model_instance = e.component;

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
                $scope.dg_model_selected = null;
            }
            else {
                $scope.entity.modelEffectivity = [];
                $.each(data, function (_i, _d) {
                    console.log("date loop", _d)
                    $scope.entity.modelEffectivity.push(_d.id);
                });
            }

            console.log($scope.entity.typeEfectivity);
        },

        bindingOptions: {
            dataSource: 'dg_model_ds'
        },
        columnChooser: {
            enabled: false
        },

    };





    $scope.$on('InitNewPNPopup', function (event, prms) {

        $scope.tempData = prms;

        if ($scope.tempData == null)
            $scope.isNew = true;
        else {
            $scope.isNew = false
            $scope.entity = $scope.tempData
        }

        $scope.entity.creatorId = 8;
        console.log('entity: ', $scope.entity);
        console.log('Is New: ', $scope.isNew);


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


