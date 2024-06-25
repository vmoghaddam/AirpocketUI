'use strict';
app.controller('vira_part_numberController', ['$scope', '$location', '$routeParams', '$rootScope', 'authService', 'notificationService', '$route', 'mntService', 'vira_general_service',
    function ($scope, $location, $routeParams, $rootScope, authService, notificationService, $route, mntService, vira_general_service) {

        $scope.prms = $routeParams.prms;

        $scope.dto_search = {
            id: null,
            ataChapter: null,
            description: null,
            partNumber: null,
            ipcReference: null,
            typeId: null,
            categoryId: null,
            statusId: null,
            hardTime: null,
            blockList: null
        };

        $scope.entity = {

        }

        ///////////////////////////////

        $scope.btn_search = {
            icon: 'search',
            width: '50%',
            type: 'default',
            onClick: function () {
                mntService.getPNSelection($scope.dto_search).then(function (res) {
                    $scope.dg_pn_ds = res.data;
                });
            }
        }

        $scope.btn_new = {
            icon: 'add',
            text:'New',
            width: 120,
            type: 'default',
            onClick: function () {
                $rootScope.$broadcast('InitNewPNPopup', null);
            }
        }

       $scope.btn_edit = {
            icon: 'edit',
            text:'Edit',
            width: 120,
            type: 'default',
            onClick: function () {
                $rootScope.$broadcast('InitNewPNPopup', $scope.entity);
            }
        }

       $scope.btn_delete = {
            icon: 'remove',
            text:'Delete',
            width: 120,
            type: 'danger',
            onClick: function () {
                $scope.loadingVisible = true;
                $scope.delete(function (res) {
                    if (res.errorCode) {
                        if (res.errorCode == 10029) {
                            mntService.authenticate({ "username": "test", "password": "1234" }).then(function (response) {
                                $scope.delete();

                            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                        }
                        else
                            General.ShowNotify(res.errorMessage, 'error');
                    }
                    else {
                        General.ShowNotify('Deleting Was Done Successfully', 'success');
                        $scope.loadingVisible = false;
                    }
                });
            }
        }

        $scope.delete = function (callback) {
            $scope.loadingVisible = true;
            vira_general_service.delete_part_number($scope.entity.id).then(function (res) {
                $scope.loadingVisible = false;
                if (callback)
                    callback(res);
                else {
                    if (res.errorCode) {
                        General.ShowNotify(res.errorMessage, 'error');
                    }
                    else {
                        $scope.loadingVisible = false;
                        General.ShowNotify('Deleting Was Done Successfully', 'success');

                    }
                }
            });
        };


        /////////////////////////////////////
        $scope.txt_desc = {
            bindingOptions: {
                value: 'dto_search.description',
            }
        }

        $scope.txt_pn = {
            bindingOptions: {
                value: 'dto_search.partNumber',
            }
        }

        $scope.txt_ipc = {
            bindingOptions: {
                value: 'dto_search.ipcReference',
            }
        }

        $scope.txt_code = {
            bindingOptions: {
                value: '',
            }
        }

        $scope.txt_issuedBy = {
            bindingOptions: {
                 value: '',
            }
        }

        $scope.ch_block = {
            bindingOptions: {
                value: 'dto_search.blockList',
            }
        }



        $scope.sb_ata = {
            showClearButton: false,
            searchEnabled: false,
            displayExpr: "title",
            valueExpr: 'title',
            bindingOptions: {
                value: 'dto_search.ataChapter',
                dataSource: 'ds_ata'
            }
        }

        $scope.ds_cat =
            [
                { id: 0, title: "All" },
                { id: 1, title: "Components" },
                { id: 2, title: "General Tools" },
                { id: 3, title: "Special Tools" },
                { id: 4, title: "All Tools" },
            ]
        $scope.sb_cat = {
            showClearButton: false,
            searchEnabled: false,
            displayExpr: "title",
            valueExpr: 'id',
            dataSource: $scope.ds_cat,
            bindingOptions: {
                value: 'dto_search.categoryId',
            }
        }

        $scope.ds_nature =
            [
                { id: 0, title: "All" },
                { id: 1, title: "Rotable" },
                { id: 2, title: "Consumable" },
                { id: 3, title: "Fixed Assest" },
            ]
        $scope.sb_nature = {
            showClearButton: false,
            searchEnabled: false,
            displayExpr: "title",
            valueExpr: 'id',
            dataSource: $scope.ds_nature,
            bindingOptions: {
                value: '',
            }
        }


        $scope.ds_status =
            [
                { id: 0, title: "All" },
                { id: 0, title: "Approved" },
                { id: 0, title: "Reject" },
                { id: 0, title: "Waiting" },
            ]
        $scope.sb_status = {
            showClearButton: false,
            searchEnabled: false,
            displayExpr: "title",
            valueExpr: 'id',
            dataSource: $scope.ds_status,
            bindingOptions: {
                value: 'dto_search.statusId',
            }
        }


      

        /////////////////////////
        $scope.dg_pn_columns = [


            {
                cellTemplate: function (container, options) {
                    $("<div style='text-align:center'/>")
                        .html(options.rowIndex + 1)
                        .appendTo(container);
                }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
            },

            //{ dataField: 'itemNo', caption: 'No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
            { dataField: '', caption: 'Effectivity', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: true, fixedPosition: 'left' },
            { dataField: 'ataChapter', caption: 'ATA', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: true, fixedPosition: 'left' },
            { dataField: '', caption: 'Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: true, fixedPosition: 'left' },
            { dataField: 'description', caption: 'Description', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 250, fixed: true, fixedPosition: 'left' },
            { dataField: 'partNumber', caption: 'Part Number', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: true, fixedPosition: 'left' },
            { dataField: '', caption: 'Shelf Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: true, fixedPosition: 'left' },
            { dataField: 'uom', caption: 'Unit', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: true, fixedPosition: 'left' },
            { dataField: '', caption: 'Assy', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: true, fixedPosition: 'left' },
            { dataField: 'hardTime', caption: 'H/T', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: true, fixedPosition: 'left' },
            { dataField: 'blockList', caption: 'Block', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: true, fixedPosition: 'left' },
            { dataField: '', caption: 'Mdr', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: true, fixedPosition: 'left' },
            { dataField: 'ipC_Reference', caption: 'IPC', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: true, fixedPosition: 'left' },
            { dataField: 'figureNo', caption: 'Fig. No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: true, fixedPosition: 'left' },
            { dataField: 'itemNo', caption: 'Item. No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: true, fixedPosition: 'left' },
            { dataField: 'user_Creator_FullName', caption: 'Issued By', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: true, fixedPosition: 'left' },
            { dataField: 'remark', caption: 'Remark', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: true, fixedPosition: 'left' },

        ];



        $scope.dg_pn_selected = null;
        $scope.dg_pn_instance = null;
        $scope.dg_pn_height = $(window).height() - 240,
            $scope.dg_pn = {



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

                width: '100%',
                columns: $scope.dg_pn_columns,
                onContentReady: function (e) {
                    if (!$scope.dg_pn_instance)
                        $scope.dg_pn_instance = e.component;

                },

                onRowClick: function (e) {



                },

                onRowPrepared: function (e) {


                },


                onCellPrepared: function (e) {

                },

                onSelectionChanged: function (e) {
                    var data = e.selectedRowsData[0];

                    $scope.entity = data;
                    console.log('Entity: ',$scope.entity);
                    
                  
                    if (!data) {
                        $scope.dg_pn_selected = null;
                    }
                    else
                        $scope.dg_pn_selected = data;


                },

                bindingOptions: {
                    dataSource: 'dg_pn_ds',
                    height: 'dg_pn_height'
                },
                columnChooser: {
                    enabled: false
                },

            };


        $scope.dg_int_columns = [


            { dataField: '', caption: 'Interchanges', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: true, fixedPosition: 'left' },
            { dataField: 'description', caption: '2 Way', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 300, fixed: true, fixedPosition: 'left' },

        ];



        $scope.dg_int_selected = null;
        $scope.dg_int_instance = null;
        $scope.dg_int_height = $(window).height() - 240,
            $scope.dg_int = {



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

                width: '100%',
                columns: $scope.dg_int_columns,
                onContentReady: function (e) {
                    if (!$scope.dg_int_instance)
                        $scope.dg_int_instance = e.component;

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

                    $scope.dg_int_id.Id = e.selectedRowsData[0].Id;

                    console.log($scope.dg_int_id.id);
                    if (!data) {
                        $scope.dg_int_selected = null;
                    }
                    else
                        $scope.dg_int_selected = data;


                },

                bindingOptions: {
                    dataSource: 'dg_int_ds',
                    height: 'dg_int_height'
                },
                columnChooser: {
                    enabled: false
                },

            };




        $scope.loadingVisible = false;
        $scope.loadPanel = {
            message: 'Please wait...',

            showIndicator: true,
            showPane: true,
            shading: true,
            closeOnOutsideClick: false,
            shadingColor: "rgba(0,0,0,0.4)",
            // position: { of: "body" },
            onShown: function () {

            },
            onHidden: function () {

            },
            bindingOptions: {
                visible: 'loadingVisible'
            }
        };


        $scope.bind = function () {
            $scope.dg_inv_ds = null;
         

            mntService.getReceiptPN(101).then(function (res) {
                $scope.itemUnit = res;
            });

            mntService.getReceiptPN(124).then(function (res) {
                $scope.conditionDs = res;
            });

            mntService.getReceiptPN(194).then(function (res) {
                $scope.currencyDs = res;
            });

            mntService.getReceiptPN(186).then(function (res) {
                $scope.docTypeDs = res
            });

            mntService.get_ata_chart().then(function (res) {
                console.log(res);
                $scope.ds_ata = res;
            });
            mntService.get_user_locations({ userId: $rootScope.vira_user_id }).then(function (response) {
                $scope.user = response;
                $scope.dto_search.stock_LocationId = $scope.user[0].gI_LocationId;
                $scope.dto_search.sender_LocationId = $scope.user[0].gI_LocationId;
                $scope.dto_search.sender_UserId = $rootScope.vira_user_id;
                //$scope.dto_search.receiver_UserId = $rootScope.vira_user_id;
            });

            mntService.getPNSelection($scope.dto_search).then(function (res) {
                $scope.dg_pn_ds = res.data;
            });

            //mntService.get_inventory($scope.dto_search).then(function (response) {

            //    $scope.loadingVisible = false;
            //    $scope.dg_inv_ds = (response);

            //}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        };
        /////////////////////////////////////

        $scope.get_filters_style = function () {
            var _height = $(window).height() - 160;
            return {
                height: _height + 'px'
            }
        }
        ///////////////////////
        if (!authService.isAuthorized()) {

            authService.redirectToLogin();
        }
        else {
            $rootScope.page_title = '> Part Number';
            $('.vira_inventory').fadeIn();
        }
        //////////////////////////////////////////
        $scope.$on('$viewContentLoaded', function () {
            mntService.get_user_locations({ userId: $rootScope.vira_user_id }).then(function (response) {
                $scope.ds_locations = response;
                $scope.dto_search.locationId = response[0].gI_LocationId;
                $scope.bind();
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            setTimeout(function () {

                //$scope.$broadcast('getFilterQuery', null);
            }, 500);
        });

        ///////////////////////////////////////

    }]);