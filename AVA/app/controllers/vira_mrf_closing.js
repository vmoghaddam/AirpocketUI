﻿'use strict';
app.controller('vira_closing_mrfController', ['$scope', '$rootScope', function ($scope, $rootScope) {

    
    $scope.popup_add_visible = false;
    $scope.popup_add_title = "Close MRF";
    $scope.popup_instance = null;
    $scope.isFullScreen = true;
    $scope.popup_add = {


        showTitle: true,

        toolbarItems: [

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', onClick: function (e) {
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
                                $scope.entity.paperNo = res.data.paperNo;

                                $scope.popup_result_visible = true;

                            }

                        });
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', onClick: function (e) {

                        $scope.popup_add_visible = false;

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
            $scope.clear_entity();
            if ($scope.isNew) {
                $scope.isContentVisible = true;
            }
            $scope.is_stock_readonly = false;
            if ($scope.tempData != null) {
                //$scope.bind();
                //goh
                if ($scope.tempData.location_id) {
                    $scope.entity.receiver_LocationId = $scope.tempData.location_id;
                }
            }


            if ($scope.dg_rec_instance)
                $scope.dg_rec_instance.repaint();
            //$rootScope.referred_list_instance.repaint();
            //$rootScope.$broadcast('InitTest', $scope.tempData);



        },
        onHiding: function () {


            $rootScope.$broadcast('ReceiptClosed', {});
            $scope.popup_add_visible = false;
        },
        onContentReady: function (e) {
            if (!$scope.popup_instance)
                $scope.popup_instance = e.component;

        },
        // fullScreen:false,
        bindingOptions: {
            visible: 'popup_add_visible',
            fullScreen: 'isFullScreen',
            title: 'popup_add_title',
            height: 'popup_height',
            width: 'popup_width',
            'toolbarItems[0].visible': 'isNotLocked',
            //'toolbarItems[1].visible': 'isNotLocked',
            'toolbarItems[2].visible': 'isNotLocked',

        }
    };

    //////////////////////////

    $scope.txt_paperNo = {
        bindingOptions: {
            value: 'paperNo'
        }
    };

    $scope.dt_paperDate = {
        bindingOptions: {
            value: 'paperDate'
        }
    };

    $scope.sb_priority = {
        bindingOptions: {
            value: 'priority'
        }
    };

    $scope.dt_deadline = {
        bindingOptions: {
            value: 'deadline'
        }
    };

    $scope.txt_remark = {
        bindingOptions: {
            value: 'remark'
        }
    };

    $scope.txt_sender = {
        bindingOptions: {
            value: 'sender'
        }
    };

    $scope.txt_receiver = {
        bindingOptions: {
            value: 'receiver'
        }
    };

    $scope.txt_approver = {
        bindingOptions: {
            value: 'approver'
        }
    };



    //////////////////////////
    $scope.dg_mrf_columns = [


        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },

        //{ dataField: 'itemNo', caption: 'No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: '', caption: 'Priority', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'ATA', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: '', caption: 'Description', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 300 },
        { dataField: '', caption: 'Part Number', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'Quantity', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: '', caption: 'Unit', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: '', caption: 'Reference', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },

    ];
    $scope.dg_mrf_selected = null;
    $scope.dg_mrf_instance = null;
    $scope.dg_mrf = {



        wordWrapEnabled: true,
        rowAlternationEnabled: false,
        headerFilter: {
            visible: false
        },
        filterRow: {
            visible: false,
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
        height: $(window).height() - 275,
        width: '100%',
        columns: $scope.dg_mrf_columns,
        onContentReady: function (e) {
            if (!$scope.dg_mrf_instance)
                $scope.dg_mrf_instance = e.component;

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

            $scope.dg_mrf_id.Id = e.selectedRowsData[0].Id;

            console.log($scope.dg_mrf_id.id);
            if (!data) {
                $scope.dg_mrf_selected = null;
            }
            else
                $scope.dg_mrf_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_mrf_ds',
            //height: 'get_dg_height()'
        },
        columnChooser: {
            enabled: false
        },

    };


    $scope.$on('InitCloseMRF', function (event, prms) {

        $scope.tempData = prms;
        $scope.popup_add_visible = true;
        //console.log(prms);


    });

}]);