'use strict';
app.controller('vira_nisController', ['$scope', '$location', '$routeParams', '$rootScope', 'authService', 'notificationService', '$route', 'mntService', 'vira_general_service',
    function ($scope, $location, $routeParams, $rootScope, authService, notificationService, $route, mntService, vira_general_service) {

        $scope.entity =
        {
            nisId: 0,
            userId: 0,
            cmP_PartNumberId: 0,
            priorityId: null,
            conditionIds: ["NE"],
            remark: null
        }

        $scope.dto_search = {
            userId: 18,
            requestNo: null,
            nisNo: null,
            priorityId: null,
            acfT_TypeId: null,
            register: null,
            stockLocation: null,
            description: null,
            partNumber: null
        };
        /////////////////////////////////////

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
        $scope.dg_nis_height = $(window).height() - 250;
        $scope.dg_nis_columns = [
            { dataField: 'nisNo', caption: 'Nis No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
            { dataField: 'createDate', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false },
            { dataField: 'senderUser_FullName', caption: 'Sender', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
            { dataField: 'description', caption: 'Description', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 350, },
            { dataField: 'partNumber', caption: 'Part Number', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 250, },
            { dataField: 'ipC_Reference', caption: 'IPC Reference', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
            { dataField: 'quantity', caption: 'QTY', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, },
            { dataField: 'uom', caption: 'Unit', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
            { dataField: 'request_Priority', caption: 'Priority', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
            { dataField: 'stock_Title', caption: 'Stock', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
            { dataField: 'request_SenderUser_FullName', caption: 'Sender', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 250, },
            { dataField: 'request_ApproverUser_FullName', caption: 'Approver', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 250, },
            { dataField: 'approverLocation_Title', caption: 'Location', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 250, },
            { dataField: 'request_ACFTType', caption: 'A/C Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
            { dataField: 'request_Register', caption: 'Register', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },
            { dataField: 'request_PartDescription', caption: 'Description', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 350, },
            { dataField: 'request_PartNumber', caption: 'Part Number', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },

        ];



        $scope.dg_nis_selected = null;
        $scope.dg_nis_instance = null;
        $scope.dg_nis = {



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


            columns: $scope.dg_nis_columns,
            onContentReady: function (e) {
                if (!$scope.dg_nis_instance)
                    $scope.dg_nis_instance = e.component;

            },

            onRowClick: function (e) {



            },

            onRowPrepared: function (e) {


            },


            onCellPrepared: function (e) {

            },

            onSelectionChanged: function (e) {
                var data = e.selectedRowsData[0];

                console.log(e.selectedRowsData);
                //$scope.entity.Id = e.selectedRowsData[0].id;
               
                                   
             
                $scope.entity.cmP_PartNumberId = data.cmP_PartNumberId;
                $scope.entity.priorityId = data.priorityId;
                $scope.entity.nisId = data.id;
                $scope.entity.remark = data.remark;

                console.log('entity', $scope.entity);

                if (!data) {
                    $scope.dg_nis_selected = null;
                }
                else
                    $scope.dg_nis_selected = data;


            },

            bindingOptions: {
                dataSource: 'dg_nis_ds',
                height: 'dg_nis_height'
            },
            columnChooser: {
                enabled: false
            },

        };

        $scope.sb_ac_type = {
            showClearButton: false,
            searchEnabled: false,
            displayExpr: "id",
            valueExpr: 'id',
            onValueChanged: function (e) {
                $scope.reg_ds = [];
                $scope.reg_ds = Enumerable.From($scope.registers).Where(function (x) {
                    var models = x.acfT_ModelId.split("-")[0];
                    return models == e.value;
                }).ToArray();
            },
            bindingOptions: {
                value: 'dto_search.acfT_TypeId',
                dataSource: 'ac_type_ds',
            }
        }

        $scope.sb_reg = {
            showClearButton: false,
            searchEnabled: false,
            displayExpr: "register",
            valueExpr: 'register',
            bindingOptions: {
                value: 'dto_search.register',
                dataSource: 'reg_ds'
            }
        }

        $scope.txt_nis_no = {
            bindingOptions: {
                value: 'dto_search.nisNo'
            }
        }

        $scope.nis_reg_no = {
            bindingOptions: {
                value: ''
            }
        }


        $scope.sb_stock = {
            showClearButton: false,
            searchEnabled: false,
            displayExpr: "title",
            valueExpr: 'title',

            bindingOptions: {
                value: 'dto_search.stockLocation',
                dataSource: 'ds_locations',
            }
        }

        $scope.txt_desc = {
            bindingOptions: {
                value: 'dto_search.description'
            }
        }

        $scope.txt_pn = {
            bindingOptions: {
                value: 'dto_search.partNumber'
            }
        }

        $scope.dt_from = {
            type: 'date',
            displayFormat: "yyyy-MMM-dd",
            bindingOptions: {
                value: ''
            }
        }

        $scope.dt_to = {
            type: 'date',
            displayFormat: "yyyy-MMM-dd",
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

        $scope.sb_priority = {
            showClearButton: false,
            searchEnabled: false,
            displayExpr: "title",
            valueExpr: 'id',
            dataSource: $scope.priority,
            bindingOptions: {
                value: 'dto_search.priorityId',
            }
        }




        ////////////////////

        $scope.btn_search = {
            text: '',
            type: 'default',
            icon: 'search',
            width: 35,
            bindingOptions: {},
            onClick: function (e) {
                vira_general_service.get_nis_approving($scope.dto_search).then(function (response) {

                    $scope.loadingVisible = false;
                    $scope.dg_nis_ds = (response.data);

                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



            }

        };


        $scope.btn_cancel = {
            text: 'Cancel',
            type: 'danger',
            width: '100%',
            bindingOptions: {},
            onClick: function (e) {
                $scope.loadingVisible = true;
                $scope.cancel(function (res) {
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
                        $scope.loadingVisible = false;
                    }
                });
                //vira_general_service.cancel_nis($scope.entity).then(function (response) {

                //    $scope.loadingVisible = false;
                //    $scope.dg_nis_ds = (response.data);

                //}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



            }
        };


        $scope.btn_approve = {
            text: 'Approve',
            type: 'success',
            width: '100%',
            bindingOptions: {},
            onClick: function (e) {

                $scope.loadingVisible = true;
                $scope.approve(function (res) {
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
                        $scope.loadingVisible = false;
                    }
                });

                //vira_general_service.approve_nis($scope.entity).then(function (response) {

                //    $scope.loadingVisible = false;
                //    $scope.dg_nis_ds = (response.data);

                //}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            }
        };


        $scope.approve = function (callback) {
            $scope.loadingVisible = true;
            vira_general_service.approve_nis($scope.entity).then(function (res) {
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
        $scope.cancel = function (callback) {
            $scope.loadingVisible = true;
            vira_general_service.cancel_nis($scope.entity).then(function (res) {
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


        $scope.bind = function () {
            $scope.dg_nis_ds = null;
            $scope.loadingVisible = true;

            mntService.get_ac_type().then(function (res) {

                $scope.ac_type_ds = res;
                mntService.get_register().then(function (res) {
                    $scope.registers = res
                });
            });
            vira_general_service.get_nis_approving($scope.dto_search).then(function (response) {

                $scope.loadingVisible = false;
                $scope.dg_nis_ds = (response.data);

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

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
            $rootScope.page_title = '> NIS';
            $('.vira_inventory').fadeIn();
        }
        //////////////////////////////////////////
        $scope.$on('$viewContentLoaded', function () {

            $scope.bind();
            mntService.get_user_locations({ userId: $rootScope.vira_user_id }).then(function (response) {
                $scope.ds_locations = response;
                //$scope.dto_search.userId = $rootScope.vira_user_id;
                $scope.dto_search.userId = 18;
                $scope.entity.userId = $rootScope.vira_user_id;
                console.log('User Response', response);
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


        });

        $scope.$on('company_closed', function () {

            $scope.bind();

        });

        ///////////////////////////////////////

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

        //////////////////////////////

    }]);