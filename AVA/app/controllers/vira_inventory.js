'use strict';
app.controller('vira_inventoryController', ['$scope', '$location', '$routeParams', '$rootScope', 'authService', 'notificationService', '$route', 'mntService',
    function ($scope, $location, $routeParams, $rootScope, authService, notificationService, $route, mntService) {

        $scope.prms = $routeParams.prms;

        /////////////////////////////////////
        $scope.dg_inv_height = $(window).height() - 63;
        $scope.dg_inv_columns = [
            { dataField: 'partNumber', caption: 'Part Number', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150,fixed:true,fixedPosition:'left' },
            { dataField: 'sN_BN', caption: 'SN/BN', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200, fixed: true, fixedPosition: 'left' },

            { dataField: 'acfT_Type', caption: 'A/C Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
            { dataField: 'ataChapter', caption: 'ATA', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 100 },
          
            { dataField: 'description', caption: 'Description', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 300 },
            
            { dataField: 'condition', caption: 'Condition', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },



            {
                caption: 'Location',
                alignment: 'center',
                columns: [
                    { dataField: 'receiverLocation_Title', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },
                    { dataField: 'shelf', caption: 'Shelf', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
                ]
            },

            {
                caption: 'Quantity',
                alignment: 'center',
                columns: [
                    { dataField: 'availableQty', caption: 'QTY', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100 },
                    { dataField: 'uom', caption: 'Unit', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
                ], fixed: true, fixedPosition: 'right'
            },

        ];



        $scope.dg_inv_selected = null;
        $scope.dg_inv_instance = null;
        $scope.dg_inv = {



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
             

            columns: $scope.dg_inv_columns,
            onContentReady: function (e) {
                if (!$scope.dg_inv_instance)
                    $scope.dg_inv_instance = e.component;

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

                $scope.dg_inv_id.Id = e.selectedRowsData[0].Id;

                console.log($scope.dg_inv_id.id);
                if (!data) {
                    $scope.dg_inv_selected = null;
                }
                else
                    $scope.dg_inv_selected = data;


            },

            bindingOptions: {
                dataSource: 'dg_inv_ds',
                height:'dg_inv_height'
            },
            columnChooser: {
                enabled: false
            },

        };


        $scope.sb_location = {
            showClearButton: false,
            searchEnabled: false,
            displayExpr: "title",
            valueExpr: 'id',
            dataSource: $scope.type,
            bindingOptions: {
                value: '',
            }
        }
        $scope.sb_actype = {
            showClearButton: false,
            searchEnabled: false,
            displayExpr: "title",
            valueExpr: 'id',
            dataSource: $scope.type,
            bindingOptions: {
                value: '',
            }
        }
        $scope.sb_assettype = {
            showClearButton: false,
            searchEnabled: false,
            displayExpr: "title",
            valueExpr: 'id',
            dataSource: $scope.type,
            bindingOptions: {
                value: '',
            }
        }

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
        $scope.txt_snbn = {
            bindingOptions: {
                value: ''
            }
        }
        $scope.txt_shelf = {
            bindingOptions: {
                value: ''
            }
        }


        $scope.btn_search = {
            text: 'Search',
            type: 'success',
            icon: 'search',
            width:'100%',
            // validationGroup: 'crewreportsearch',
            bindingOptions: {},
            onClick: function (e) {

                $scope.dg_inv_ds = null;
                
            }

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
            $rootScope.page_title = '> Inventory';
            $('.vira_inventory').fadeIn();
        }
        //////////////////////////////////////////

    }]);